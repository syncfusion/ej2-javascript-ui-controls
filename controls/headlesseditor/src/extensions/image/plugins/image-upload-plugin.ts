/**
 * image-upload-plugin.ts — ProseMirror plugin for image file upload handling.
 *
 * This plugin bridges the FileHandler service with the image node lifecycle:
 * - Creates image nodes when files are received (temp preview).
 * - Correlates uploadId ↔ image position via transaction metadata
 *   (never through node attrs or persistent node IDs).
 * - Publishes generic upload state snapshots into UploadStateRegistry
 *   (progress updates never dispatch ProseMirror transactions).
 * - Replaces the image `src` with the final hosted URL on completion
 *   through the existing document transaction.
 *
 * **Why this is a plugin (not an extension contributor):**
 * The plugin needs direct access to the HeadlessEditor instance to subscribe
 * to file upload events. Extension contributors don't have editor access
 * during plugin compilation (compile happens before editor binding).
 * By creating this plugin directly in editor-builder.ts (like
 * focusBlurPlugin and selectionSyncPlugin), we get guaranteed editor access.
 *
 * @hidden
 */

import { readFileAsDataUrl, readImageDimensions } from '../../../core/utils/index';
import type { HeadlessEditor } from '../../../headless-editor/headless-editor';
import type { FileReceivedEventArgs } from '../../../core/events/public-events/file-upload-events';
import type { EditorEvent } from '../../../core/events/editor-event';
import type { IDisposable } from '../../../core/events/types';
import type { UploadState, UploadStateRegistry } from '../../../core/services/upload-state-registry';
import { PMEditorState, PMNode, PMPlugin, PMPluginKey, PMTransaction } from '../../../pm/pm-guard';

/**
 * Public ProseMirror PluginKey used by NodeViews (and external helpers) to
 * resolve the runtime `uploadId` for an image at a given position without
 * touching node attrs.
 *
 * The plugin state is intentionally minimal — just the `pendingUploads` map.
 * No persistent identity leaks into this state; everything is keyed by
 * transient `uploadId` plus the current mapped PM position.
 *
 * @hidden
 */
export interface ImageUploadPluginState {
    /** Active uploads: uploadId → { nodePos } (position is kept remapped by `apply`). */
    pendingUploads: PendingUploads;
}

export const imageUploadPluginKey: PMPluginKey<ImageUploadPluginState> =
    new PMPluginKey<ImageUploadPluginState>('imageUpload');

/**
 * Transaction metadata contract for the image upload plugin.
 *
 * `add` associates an uploadId with the image node position **in the document
 * resulting from the transaction** (the position is NOT remapped again).
 * `remove` drops the association (terminal states: completed/failed/cancelled
 * or explicit cleanup).
 *
 * All association changes flow through transaction metadata so plugin state
 * stays immutable and consistently derived in `apply()`.
 *
 * @hidden
 */
export interface ImageUploadPluginMeta {
    /** Associate an uploadId with an image node position in the resulting doc. */
    add?: { uploadId: string; nodePos: number };
    /** Drop an existing uploadId association. */
    remove?: string;
}

/**
 * Map of uploadId -> { nodePos } for tracking active uploads.
 *
 * Positions are remapped through every transaction's mapping in `apply()`
 * so the stored position tracks the image node even as the document shifts.
 */
type PendingUploads = Map<string, { nodePos: number }>;

/**
 * Resolve the runtime uploadId for the image node whose open token sits at
 * `pos`. Returns `undefined` when no active upload is associated with the
 * image at that position.
 *
 * This is the bridge the Image NodeView uses to subscribe to the generic
 * `UploadStateRegistry` without putting `uploadId` into the image schema.
 *
 * @param {PMEditorState} state Current PM editor state.
 * @param {number} pos Position of the image node's open token (i.e. `getPos()`).
 * @returns {string | undefined} The active uploadId, or undefined.
 */
export function getUploadIdAtPosition(state: PMEditorState, pos: number): string | undefined {
    const pluginState: ImageUploadPluginState | undefined = imageUploadPluginKey.getState(state);
    if (!pluginState) {
        return undefined;
    }
    let found: string | undefined;
    pluginState.pendingUploads.forEach((pending: { nodePos: number }, uploadId: string): void => {
        if (pending.nodePos === pos) {
            found = uploadId;
        }
    });
    return found;
}

/**
 * Resolve the current mapped position of the image tracked by `uploadId`.
 * Used by the completion handler to write the final `src` back into the
 * document — even after the image has moved.
 *
 * @param {PMEditorState} state Current PM editor state.
 * @param {string} uploadId The uploadId whose image position is requested.
 * @returns {number | undefined} The mapped position, or undefined when the upload is unknown.
 */
export function getPositionForUploadId(state: PMEditorState, uploadId: string): number | undefined {
    const pluginState: ImageUploadPluginState | undefined = imageUploadPluginKey.getState(state);
    if (!pluginState) {
        return undefined;
    }
    const pending: { nodePos: number } | undefined = pluginState.pendingUploads.get(uploadId);
    return pending ? pending.nodePos : undefined;
}

/**
 * Drop the uploadId ↔ position association through a transaction carrying
 * plugin meta (never by mutating plugin state directly).
 *
 * @param {HeadlessEditor} editor - The editor instance.
 * @param {string} uploadId - The uploadId to disassociate.
 * @returns {void} Nothing.
 */
function removeUploadAssociation(editor: HeadlessEditor, uploadId: string): void {
    try {
        const currentState: PMEditorState = editor.integration.getState();
        const tr: PMTransaction = currentState.tr;
        tr.setMeta(imageUploadPluginKey, { remove: uploadId } as ImageUploadPluginMeta);
        editor.integration.dispatch(tr);
    } catch {
        // Editor destroyed or dispatch unavailable; association dies with state.
    }
}

/**
 * Handles incoming FILE_RECEIVED events.
 * Creates an image node with a temporary data URL, starts the upload, and
 * subscribes to the registry for state changes (to update src on completion).
 *
 * @param {HeadlessEditor} editor - The editor instance
 * @param {EditorEvent<FileReceivedEventArgs>} event - The file received event
 * @param {UploadStateRegistry} registry - Generic upload state registry
 * @param {Map<string, Function>} nodeStateListeners - Map of uploadId -> unsubscribe for cleanup
 * @returns {Promise<void>} Resolves when the image node is created
 * @hidden
 */
async function handleFileReceived(
    editor: HeadlessEditor,
    event: EditorEvent<FileReceivedEventArgs>,
    registry: UploadStateRegistry,
    nodeStateListeners: Map<string, Function>
): Promise<void> {
    const { file } = event.payload;

    // Only accept image files
    if (!file.type || !file.type.startsWith('image/')) {
        return;
    }

    try {
        // Read file as data URL for temporary preview
        const dataUrl: string = await readFileAsDataUrl(file);

        // Extract dimensions (best effort)
        let dimensions: { width?: number; height?: number } = {};
        try {
            dimensions = await readImageDimensions(file);
        } catch {
            // Dimensions are optional, continue without them
        }

        // Start the upload early so the uploadId exists before the image node
        // is inserted (the NodeView resolves this id by position once the
        // association is committed by the insert transaction's meta).
        const uploadId: string = editor.getFileHandler().startUpload(file);

        const pmState: PMEditorState = editor.integration.getState();
        const insertPos: number = pmState.selection.from;

        // Build image node attributes — runtime-only. No uploadId here.
        const imageAttrs: Record<string, unknown> = {
            src: dataUrl,
            alt: file.name || 'Image',
            title: '',
            width: dimensions.width ?? null,
            height: dimensions.height ?? null,
            display: 'block',
            align: 'none',
            wrap: 'none',
            attributes: ''
        };

        // Insert the image node and associate the uploadId with its position
        // in the SAME transaction. `apply()` trusts meta-supplied positions
        // as-is (already expressed in the resulting doc) — no double remap.
        const imageNode: PMNode = pmState.schema.nodes.image.create(imageAttrs as Parameters<typeof pmState.schema.nodes.image.create>[0]);
        const tr: PMTransaction = pmState.tr.insert(insertPos, imageNode);
        let imagePos: number | undefined;

        tr.doc.descendants((node: PMNode, pos: number) => {
            if (node === imageNode) {
                imagePos = pos;
                return false;
            }
            return true;
        });

        if (imagePos === undefined) {
            return;
        }
        tr.setMeta(imageUploadPluginKey, {
            add: { uploadId, nodePos: imagePos }
        } as ImageUploadPluginMeta);
        editor.integration.dispatch(tr);

        // Subscribe to registry state changes for this upload. Terminal
        // handlers remove the position association via transaction meta, not
        // by mutating plugin state directly.
        const onStateChange: (state: UploadState) => void = (state: UploadState): void => {
            if (state && state.status === 'completed' && state.result?.url) {
                const completedResult: NonNullable<UploadState['result']> = state.result;
                let removeAssociation: boolean = true;
                try {
                    const currentState: PMEditorState = editor.integration.getState();
                    // Plugin state already holds the latest mapped position; just read it.
                    const resolvedPos: number | undefined = getPositionForUploadId(currentState, uploadId);

                    if (resolvedPos !== undefined) {
                        const nodeAtPos: PMNode | null = currentState.doc.nodeAt(resolvedPos);
                        if (nodeAtPos) {
                            const updatedAttrs: Record<string, unknown> = {
                                ...nodeAtPos.attrs,
                                src: completedResult.url
                            };
                            if (completedResult.width) { updatedAttrs.width = completedResult.width; }
                            if (completedResult.height) { updatedAttrs.height = completedResult.height; }
                            // Update the src and drop the association in ONE transaction.
                            const updateTr: PMTransaction = currentState.tr.setNodeMarkup(resolvedPos, null, updatedAttrs as Parameters<PMTransaction['setNodeMarkup']>[2]);
                            updateTr.setMeta(imageUploadPluginKey, { remove: uploadId } as ImageUploadPluginMeta);
                            editor.integration.dispatch(updateTr);
                        } else {
                            removeAssociation = false;
                        }
                    }
                } catch {
                    // Document state changed before completion — node may have been removed.
                }
                if (removeAssociation) {
                    removeUploadAssociation(editor, uploadId);
                }
                registry.delete(uploadId);
                nodeStateListeners.delete(uploadId);
                unsubscribe();
            } else if (state && (state.status === 'failed' || state.status === 'cancelled')) {
                removeUploadAssociation(editor, uploadId);
                registry.delete(uploadId);
                nodeStateListeners.delete(uploadId);
                unsubscribe();
            }
        };
        const unsubscribe: () => void = registry.subscribe(uploadId, onStateChange);

        nodeStateListeners.set(uploadId, unsubscribe);

        // ── Subscription race guard: `startUpload()` runs the upload in the
        //    background and may reach a terminal state before `subscribe()`
        //    above is registered. Replay the current state through the same
        //    callback so terminal states are never missed.
        const currentState: UploadState | undefined = registry.getState(uploadId);
        if (currentState) {
            onStateChange(currentState);
        }
        else {
            // Publish the initial uploading state (registry listeners + NodeView
            // subscriptions get progress from here; PM is untouched).
            registry.setState(uploadId, {
                status: 'uploading',
                loaded: 0,
                total: file.size,
                percentage: 0
            });
        }
    } catch {
        // Suppress; surface is via registry + listeners.
    }
}

/**
 * Creates a ProseMirror plugin that handles image file uploads.
 *
 * This plugin:
 * - Subscribes to FILE_RECEIVED events to create image nodes with temporary preview
 * - Listens to UploadStateRegistry for terminal state changes (completed/failed/cancelled)
 *   to update the image src attribute in the document
 *
 * Upload state progression happens in FileHandler.performUpload():
 * - onProgress callbacks write directly to registry (via FileHandler, not events)
 * - Promise resolution/rejection determines terminal state
 * - FileHandler writes terminal state directly to registry
 *
 * This plugin bridges FILE_RECEIVED (document/extension responsibility) with
 * the registry-based state model (product UI consumption).
 *
 * Subscriptions are initialized once (on first view decoration pass) and all
 * EventBus disposables are held so the plugin's view destroy hook can
 * release them — following the existing editor/plugin lifecycle pattern.
 *
 * @param {HeadlessEditor} editor - The fully initialized editor instance
 * @param {UploadStateRegistry} registry - Generic runtime upload state registry
 * @returns {PMPlugin} A ProseMirror plugin instance
 * @hidden
 */
export function createImageUploadPlugin(editor: HeadlessEditor, registry: UploadStateRegistry): PMPlugin {
    // Map of uploadId -> unsubscribe function for registry state listeners
    const nodeStateListeners: Map<string, () => void> = new Map();
    let subscribed: boolean = false;
    let disposables: IDisposable[] = [];

    const plugin: PMPlugin = new PMPlugin({
        key: imageUploadPluginKey,
        state: {
            init(): ImageUploadPluginState {
                return { pendingUploads: new Map() };
            },
            apply(tr: PMTransaction, value: ImageUploadPluginState): ImageUploadPluginState {
                const meta: ImageUploadPluginMeta | undefined =
                    tr.getMeta(imageUploadPluginKey) as ImageUploadPluginMeta | undefined;
                const addedId: string | undefined = meta?.add?.uploadId;
                const removedId: string | undefined = meta?.remove;

                // Immutable rebuild: existing entries are remapped, entries
                // added by THIS transaction's meta are taken as-is (their
                // position is already expressed in the resulting doc).
                const nextUploads: PendingUploads = new Map();
                value.pendingUploads.forEach((pending: { nodePos: number }, uploadId: string): void => {
                    if (uploadId === addedId || uploadId === removedId) {
                        return; // replaced by meta add / dropped by meta remove
                    }
                    const mappedPos: number = tr.mapping.map(pending.nodePos);
                    // Stale detection is two-step: (1) the mapping reports the
                    // position was deleted, OR (2) the mapped position no
                    // longer resolves to a live image node in the resulting
                    // doc. Either way the association is invalid — drop it.
                    const mapDeleted: boolean = tr.mapping.mapResult(pending.nodePos).deleted;
                    const docNode: PMNode = (tr as unknown as { doc: PMNode }).doc;
                    const nodeAt: PMNode | null = docNode ? docNode.nodeAt(mappedPos) : null;
                    const stale: boolean = mapDeleted || !nodeAt || nodeAt.type.name !== 'image';
                    if (!stale) {
                        nextUploads.set(uploadId, { nodePos: mappedPos });
                    }
                });
                if (meta?.add) {
                    // Meta positions are NOT remapped — the add transaction
                    // already expresses them in the resulting doc.
                    nextUploads.set(meta.add.uploadId, { nodePos: meta.add.nodePos });
                }
                return { pendingUploads: nextUploads };
            }
        },

        /**
         * Initialize event subscriptions when the plugin is applied to the editor state.
         * Use the editor instance to subscribe to FILE_RECEIVED events only.
         *
         * @returns {null} No decorations
         */
        props: {
            decorations(): null {
                // Initialize subscriptions once
                if (!subscribed) {
                    subscribed = true;

                    // Subscribe to FILE_RECEIVED events
                    // This is the ONLY event subscription now — registry state is driven by FileHandler.performUpload()
                    disposables.push(editor.eventBus.subscribe('fileReceived', (event: EditorEvent<unknown>) => {
                        void handleFileReceived(editor, event as EditorEvent<FileReceivedEventArgs>,
                                                registry, nodeStateListeners);
                    }));
                }

                return null;
            }
        },

        /**
         * Release all EventBus subscriptions and registry listeners when the PM view is destroyed.
         *
         * @returns {object} Plugin view handle whose destroy releases the subscriptions.
         */
        view(): { destroy(): void } {
            return {
                destroy(): void {
                    // Dispose EventBus subscriptions
                    for (const disposable of disposables) {
                        disposable.dispose();
                    }
                    disposables = [];

                    // Dispose all registry listeners
                    nodeStateListeners.forEach((unsubscribe: () => void) => {
                        unsubscribe();
                    });
                    nodeStateListeners.clear();
                }
            };
        }
    } as never);

    return plugin;
}
