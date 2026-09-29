/**
 * upload-state-registry.ts — Generic runtime upload state store.
 *
 * Platform infrastructure that tracks the lifecycle state of file uploads
 * and pushes updates to interested subscribers. The registry is:
 * - Document-agnostic: no ProseMirror, schema, or node-type knowledge.
 * - Extension-agnostic: consumers interpret the state for their own UI.
 * - Keyed by an opaque owner key (e.g. a stable node ID) supplied by writers.
 *
 * Intended flow:
 * FileHandler → generic UploadStateRegistry → extension → product NodeView UI.
 *
 * @hidden
 */

/**
 * Generic upload status lifecycle shared by all file uploads.
 *
 * @public
 */
export type UploadStatus = 'idle' | 'uploading' | 'completed' | 'failed' | 'cancelled';

/**
 * Generic runtime upload state for a single upload.
 * Independent of any node type, extension, or document model.
 *
 * @public
 */
export interface UploadState {
    /** Lifecycle status of the upload. */
    status: UploadStatus;
    /** Bytes transferred so far (when known). */
    loaded?: number;
    /** Total bytes (when known). */
    total?: number;
    /** Computed percentage 0–100 (when known). */
    percentage?: number;
    /** Error details (when failed). */
    error?: Error;
    /** Upload result with final URL (when completed). */
    result?: { url: string; width?: number; height?: number; [key: string]: unknown };
}

/**
 * Listener invoked whenever the state of the tracked owner key changes.
 *
 * @hidden
 */
type UploadStateListener = (state: UploadState) => void;

/**
 * Runtime upload state store keyed by an opaque owner key.
 *
 * Writers (e.g. the image upload plugin) publish state snapshots via
 * `setState`; readers (e.g. the Image extension NodeViews) subscribe per
 * key and receive every subsequent update for that key through their
 * listener. All subscriptions return an unsubscribe function so a reader
 * can detach immediately when its view is destroyed — editor destruction
 * only acts as a final safety net via `clear()`.
 *
 * @hidden
 */
export class UploadStateRegistry {
    private readonly states: Map<string, UploadState> = new Map();
    private readonly listeners: Map<string, Set<UploadStateListener>> = new Map();

    /**
     * Publishes a state snapshot for the owner key and notifies subscribers.
     *
     * @param {string} ownerKey - Opaque key identifying the tracked upload.
     * @param {UploadState} state - The state snapshot to publish.
     * @returns {void} Nothing.
     */
    public setState(ownerKey: string, state: UploadState): void {
        this.states.set(ownerKey, state);
        const keyListeners: Set<UploadStateListener> | undefined = this.listeners.get(ownerKey);
        if (!keyListeners) {
            return;
        }
        keyListeners.forEach((listener: UploadStateListener): void => {
            listener(state);
        });
    }

    /**
     * Returns the current state snapshot for the owner key, if any.
     *
     * @param {string} ownerKey - Opaque key identifying the tracked upload.
     * @returns {UploadState | undefined} The current state, or `undefined` when none was published.
     */
    public getState(ownerKey: string): UploadState | undefined {
        return this.states.get(ownerKey);
    }

    /**
     * Subscribes to state updates for the owner key.
     * The listener is invoked for every `setState` call on that key.
     *
     * @param {string} ownerKey - Opaque key identifying the tracked upload.
     * @param {UploadStateListener} listener - Callback invoked on every update for this key.
     * @returns {Function} Unsubscribe function; call to detach immediately.
     */
    public subscribe(ownerKey: string, listener: UploadStateListener): () => void {
        let keyListeners: Set<UploadStateListener> | undefined = this.listeners.get(ownerKey);
        if (!keyListeners) {
            keyListeners = new Set<UploadStateListener>();
            this.listeners.set(ownerKey, keyListeners);
        }
        keyListeners.add(listener);
        return (): void => {
            const current: Set<UploadStateListener> | undefined = this.listeners.get(ownerKey);
            if (!current) {
                return;
            }
            current.delete(listener);
            if (current.size === 0) {
                this.listeners.delete(ownerKey);
            }
        };
    }

    /**
     * Removes the state entry and any remaining listeners for the owner key.
     * Used once an upload reaches a terminal state so entries do not accumulate.
     *
     * @param {string} ownerKey - Opaque key identifying the tracked upload.
     * @returns {void} Nothing.
     */
    public delete(ownerKey: string): void {
        this.states.delete(ownerKey);
        this.listeners.delete(ownerKey);
    }

    /**
     * Clears all state entries and listeners. Called on editor destruction as
     * the final safety net so no listener can outlive the editor.
     *
     * @returns {void} Nothing.
     */
    public clear(): void {
        this.states.clear();
        this.listeners.clear();
    }
}
