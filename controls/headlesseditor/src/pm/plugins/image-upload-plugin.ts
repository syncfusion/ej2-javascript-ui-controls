/**
 * image-upload-plugin.ts — ProseMirror plugin for image file upload handling.
 *
 * This plugin bridges the FileHandler service with the image node lifecycle:
 * - Creates image nodes when files are received (temp preview).
 * - Translates uploadId → stable image node ID for the runtime registry.
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

import { DefaultIdGenerator, IdGenerator } from '../../utils/index';
import { readFileAsDataUrl, readImageDimensions } from '../../utils/file-utils';
import type { HeadlessEditor } from '../../headless-editor/headless-editor';
import type {
    FileReceivedEvent
} from '../../events/public-events/file-upload-events';
import type { EditorEvent } from '../../events/editor-event';
import type { IDisposable } from '../../events/types';
import type { UploadState, UploadStateRegistry } from '../../services/upload-state-registry';
import { PMEditorState, PMNode, PMPlugin, PMTransaction } from '../pm-guard';

const idGen: IdGenerator = new DefaultIdGenerator();

/**
 * Map of uploadId -> { nodeId } for tracking active uploads.
 * Uses stable node ID (not position) to handle node position changes during upload.
 */
type PendingUploads = Map<string, { nodeId: string }>;

/**
 * Handles incoming FILE_RECEIVED events.
 * Creates an image node with a temporary data URL, starts the upload, and
 * subscribes to the registry for state changes (to update src on completion).
 *
 * @param {HeadlessEditor} editor - The editor instance
 * @param {FileReceivedEvent} event - The file received event
 * @param {PendingUploads} pendingUploads - Map tracking active uploads
 * @param {UploadStateRegistry} registry - Generic upload state registry
 * @param {Map<string, Function>} nodeStateListeners - Map of nodeId -> unsubscribe for cleanup
 * @returns {Promise<void>} Resolves when the image node is created
 * @hidden
 */
async function handleFileReceived(
    editor: HeadlessEditor,
    event: FileReceivedEvent,
    pendingUploads: PendingUploads,
    registry: UploadStateRegistry,
    nodeStateListeners: Map<string, Function>
): Promise<void> {
    const { file } = event.payload;

    // Only accept image files
    if (!file.type || !file.type.startsWith('image/')) {
        return;
    }

    try {
        // Create stable node ID before insertion
        const nodeId: string = idGen.generate();

        // Read file as data URL for temporary preview
        const dataUrl: string = await readFileAsDataUrl(file);

        // Extract dimensions (best effort)
        let dimensions: { width?: number; height?: number } = {};
        try {
            dimensions = await readImageDimensions(file);
        } catch (error) {
            // Dimensions are optional, continue without them
        }

        // Create image node with stable ID and temp src
        const imageAttrs: {
            id: string;
            src: string;
            alt: string;
            title: string;
            width: number | null;
            height: number | null;
            display: string;
            align: string;
            wrap: string;
            attributes: string;
        } = {
            id: nodeId,
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

        // Insert node at current cursor position using PM integration
        const pmState: PMEditorState = editor.integration.getState();
        const { from } = pmState.selection;
        const imageNode: PMNode = pmState.schema.nodes.image.create(imageAttrs);
        const tr: PMTransaction = pmState.tr.insert(from, imageNode);
        editor.integration.dispatch(tr);

        // Start upload with nodeId as registry key (fire-and-forget, no await)
        // This ensures progress updates use the same key that listeners are subscribed to
        const uploadId: string = editor.getFileHandler().startUpload(file, nodeId);

        // Track: uploadId -> nodeId (NOT storing position or Node object)
        pendingUploads.set(uploadId, { nodeId });

        // Subscribe to registry state changes for this node.
        // FileHandler.performUpload() writes progress updates directly to registry.
        // When upload reaches terminal state (completed/failed/cancelled):
        // - Completed: Update image node src with final URL via transaction
        // - Failed/Cancelled: Clean up subscription; node keeps temporary preview
        const unsubscribe: () => void = registry.subscribe(nodeId, (state: UploadState) => {
            if (state && state.status === 'completed' && state.result?.url) {
                // Upload completed — update the image node's src with final URL
                const completedResult: NonNullable<UploadState['result']> = state.result;
                try {
                    const pmState: PMEditorState = editor.integration.getState();
                    pmState.doc.descendants((node: PMNode, pos: number) => {
                        if (node.type.name === 'image' && node.attrs.id === nodeId) {
                            const updatedAttrs: Record<string, unknown> = {
                                ...node.attrs,
                                src: completedResult.url
                            };
                            if (completedResult.width) {
                                updatedAttrs.width = completedResult.width;
                            }
                            if (completedResult.height) {
                                updatedAttrs.height = completedResult.height;
                            }
                            const tr: PMTransaction = pmState.tr.setNodeMarkup(pos, null, updatedAttrs);
                            editor.integration.dispatch(tr);
                        }
                    });
                } catch (error) {
                    console.error('Failed to update image node on upload completion', error);
                }
                // Clean up subscription after handling completion
                registry.delete(nodeId);
                nodeStateListeners.delete(nodeId);
                unsubscribe();
            } else if (state && (state.status === 'failed' || state.status === 'cancelled')) {
                // Terminal failure/cancellation — clean up subscription
                // Node keeps temporary preview; product UI shows error/cancelled via registry state
                try {
                    registry.delete(nodeId);
                    nodeStateListeners.delete(nodeId);
                    unsubscribe();
                } catch (error) {
                    console.error('Failed to clean up registry subscription on terminal state', error);
                }
            }
        });

        // Store the unsubscribe function so plugin destroy can clean up
        nodeStateListeners.set(nodeId, unsubscribe);

        // Publish the initial uploading state
        registry.setState(nodeId, {
            status: 'uploading',
            loaded: 0,
            total: file.size,
            percentage: 0
        });
    } catch (error) {
        console.error('Failed to create image node from FILE_RECEIVED event', error);
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
    // Map of uploadId -> { nodeId } for tracking active uploads
    const pendingUploads: PendingUploads = new Map();
    // Map of nodeId -> unsubscribe function for registry state listeners
    const nodeStateListeners: Map<string, () => void> = new Map();
    let subscribed: boolean = false;
    let disposables: IDisposable[] = [];

    const plugin: PMPlugin = new PMPlugin({
        state: {
            init(): { pendingUploads: PendingUploads } {
                return { pendingUploads };
            },
            apply(): { pendingUploads: PendingUploads } {
                return { pendingUploads };
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
                        void handleFileReceived(editor, event as FileReceivedEvent, pendingUploads, registry, nodeStateListeners);
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

                    pendingUploads.clear();
                }
            };
        }
    } as never);

    return plugin;
}
