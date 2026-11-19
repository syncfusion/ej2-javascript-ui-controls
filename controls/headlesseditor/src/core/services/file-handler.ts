/**
 * Generic file upload orchestrator.
 *
 * Responsibility:
 * - File intake (paste, drop, API)
 * - Upload ID generation and tracking
 * - Upload orchestration (call product handler, publish events)
 * - Cancellation support
 * - Event publishing
 *
 * Non-responsibility:
 * - Document state
 * - Node validation or updates
 * - Race protection
 * - Temporary preview generation
 */
import { EventBus } from '../events/event-bus';
import {
    FileUploadHandler,
    FileUploadProgress,
    FileUploadResult
} from '../model/file-upload-handler';
import type {
    BeforeFileUploadEventArgs,
    FileReceivedEventArgs
} from '../events/public-events/file-upload-events';
import type { UploadStateRegistry } from './upload-state-registry';
import { EditorEvent } from '../events';

/**
 * Pending file upload tracking.
 */
export interface PendingFileUpload {
    /** Unique upload ID (UUID). */
    uploadId: string;

    /** The file object. */
    file: File;

    /** Current state: pending → uploading → (completed | failed | cancelled). */
    status: 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled';

    /** Latest progress (if available). */
    progress?: FileUploadProgress;

    /** Result (if completed). */
    result?: FileUploadResult;

    /** Error details (if failed). */
    error?: Error;
}

/**
 * Generic file upload service.
 *
 * Manages file lifecycle: paste/drop → upload ID generation → upload orchestration.
 * Writes upload state directly to UploadStateRegistry (no EventBus re-publishing).
 *
 * Responsibility:
 * - File intake and tracking
 * - Upload orchestration (call handler, track state)
 * - State validation (result contract, terminal conditions)
 * - Registry writes (progress, completed, failed, cancelled)
 *
 * Non-responsibility:
 * - Document state
 * - Node validation
 * - Product implementation details
 */
export class FileHandler {
    private uploadHandler: FileUploadHandler | null = null;
    private pendingUploads: Map<string, PendingFileUpload> = new Map();
    private abortControllers: Map<string, AbortController> = new Map();
    private eventBus: EventBus;
    private uploadStateRegistry: UploadStateRegistry;

    private generateUploadId(): string {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        // Fallback for environments without crypto.randomUUID.
        return `upload-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`;
    }

    constructor(eventBus: EventBus, uploadStateRegistry: UploadStateRegistry) {
        this.eventBus = eventBus;
        this.uploadStateRegistry = uploadStateRegistry;
    }

    /**
     * Register product's upload handler.
     * MUST be called before file operations.
     *
     * @param {FileUploadHandler} handler - The upload handler implementation.
     * @returns {void} Nothing.
     */
    public setUploadHandler(handler: FileUploadHandler): void {
        this.uploadHandler = handler;
    }

    /**
     * Start uploading a file.
     * Returns uploadId synchronously (no await needed).
     * Actual upload happens asynchronously in background.
     *
     * @param {File} file - The file to upload.
     * @returns {string} uploadId (UUID) for tracking this upload.
     */
    public startUpload(file: File): string {
        if (!this.uploadHandler) {
            throw new Error('FileUploadHandler not registered. Call setUploadHandler() first.');
        }

        const uploadId: string = this.generateUploadId();
        const abortController: AbortController = new AbortController();

        const pending: PendingFileUpload = {
            uploadId,
            file,
            status: 'pending'
        };

        this.pendingUploads.set(uploadId, pending);
        this.abortControllers.set(uploadId, abortController);

        // Fire background upload (NOT awaited)
        this.performUpload(uploadId, file, abortController).catch(() => {
            // Errors handled inside performUpload
        });

        return uploadId;
    }

    /**
     * Cancel an in-flight upload.
     * May trigger FILE_UPLOAD_CANCELLED or FILE_UPLOAD_FAILED event.
     *
     * @param {string} uploadId - The upload ID to cancel.
     * @returns {void} Nothing.
     */
    public cancel(uploadId: string): void {
        const controller: AbortController | undefined = this.abortControllers.get(uploadId);
        if (controller) {
            controller.abort();
        }
        this.uploadHandler?.cancel?.(uploadId);
    }

    /**
     * Get all pending uploads.
     * Used for progress UI, debugging.
     *
     * @returns {PendingFileUpload[]} Array of all pending uploads.
     */
    public getPendingUploads(): PendingFileUpload[] {
        return Array.from(this.pendingUploads.values());
    }

    /**
     * Get a specific pending upload.
     *
     * @param {string} uploadId - The upload ID to look up.
     * @returns {PendingFileUpload | undefined} The pending upload or undefined.
     */
    public getPendingUpload(uploadId: string): PendingFileUpload | undefined {
        return this.pendingUploads.get(uploadId);
    }

    /**
     * Creates a BeforeFileUploadEvent instance.
     *
     * @param {File} file - The file about to be uploaded.
     * @param {'paste' | 'drop' | 'api'} source - Source of the file.
     * @returns {EditorEvent<BeforeFileUploadEventArgs>} The constructed event.
     *
     */
    private createBeforeFileUploadEvent(
        file: File,
        source: 'paste' | 'drop' | 'api'
    ): EditorEvent<BeforeFileUploadEventArgs> {
        return {
            type: 'beforeFileUpload',
            payload: {
                file,
                source,
                cancel: false
            }
        };
    }

    /**
     * Creates a FileReceivedEvent instance.
     *
     * @param {File} file - The file being received.
     * @param {'paste' | 'drop' | 'api'} source - Source of the file.
     * @returns {EditorEvent<FileReceivedEventArgs>} The constructed event.
     *
     */
    private createFileReceivedEvent(
        file: File,
        source: 'paste' | 'drop' | 'api'
    ): EditorEvent<FileReceivedEventArgs> {
        return {
            type: 'fileReceived',
            payload: {
                file,
                source
            }
        };
    }

    /**
     * Process files and publish BEFORE_FILE_UPLOAD and FILE_RECEIVED events.
     * If any BEFORE_FILE_UPLOAD handler sets cancel=true, the file is skipped.
     *
     * @param {File[]} files - The files to process.
     * @param {'paste' | 'drop' | 'api'} source - The source of the files.
     * @returns {void} Nothing.
     * @hidden
     */
    public handleFileInput(files: File[], source: 'paste' | 'drop' | 'api'): void {
        for (const file of files) {
            // Publish BEFORE_FILE_UPLOAD event - extensions can cancel here
            const beforeEvent: EditorEvent<BeforeFileUploadEventArgs> = this.createBeforeFileUploadEvent(file, source);
            this.eventBus.publish(beforeEvent);

            // Check if any extension cancelled the upload
            if (beforeEvent.payload.cancel) {
                continue;
            }

            // Publish FILE_RECEIVED event - extensions create nodes here
            const receivedEvent: EditorEvent<FileReceivedEventArgs> = this.createFileReceivedEvent(file, source);
            this.eventBus.publish(receivedEvent);
        }
    }

    /**
     * Perform the actual upload in background.
     *
     * Flow:
     * 1. Call product's handler.upload() with onProgress callback
     * 2. onProgress callback writes directly to registry (not via events)
     * 3. If handler resolves: validate result contract
     * 4. If valid: mark completed, write to registry
     * 5. If invalid: throw, caught as failed
     * 6. If handler rejects: check for AbortError (cancelled) or generic (failed)
     * 7. Write terminal state to registry
     *
     * @param {string} uploadId - The upload ID.
     * @param {File} file - The file to upload.
     * @param {AbortController} abortController - The abort controller for cancellation.
     * @returns {Promise<void>} A promise that resolves when the upload completes.
     * @private
     */
    private async performUpload(
        uploadId: string,
        file: File,
        abortController: AbortController
    ): Promise<void> {
        const pending: PendingFileUpload | undefined = this.pendingUploads.get(uploadId);
        if (!pending) {
            return;
        }

        try {
            // Mark as uploading
            pending.status = 'uploading';

            // Call product's upload handler
            const handler: FileUploadHandler | null = this.uploadHandler;
            if (!handler) {
                throw new Error('Upload handler not available');
            }

            const result: FileUploadResult = await handler.upload({
                id: uploadId,
                file,
                signal: abortController.signal,
                onProgress: (progress: FileUploadProgress): void => {
                    // Update pending tracking
                    pending.progress = progress;

                    this.uploadStateRegistry.setState(pending.uploadId, {
                        status: 'uploading',
                        loaded: progress.loaded,
                        total: progress.total,
                        percentage: progress.percentage
                    });
                }
            });

            // ✅ Validate result contract before marking completed
            if (!result || typeof result.url !== 'string' || !result.url.trim()) {
                throw new Error('Handler returned invalid FileUploadResult: url must be a non-empty string');
            }

            // Success: mark completed and write to registry
            pending.status = 'completed';
            pending.result = result;

            this.uploadStateRegistry.setState(pending.uploadId, {
                status: 'completed',
                percentage: 100,
                result: {
                    url: result.url,
                    width: result.width,
                    height: result.height
                }
            });
        } catch (error) {
            // Determine error type and set appropriate status
            if (error instanceof DOMException && error.name === 'AbortError') {
                // User cancelled via AbortSignal
                pending.status = 'cancelled';
                this.uploadStateRegistry.setState(pending.uploadId, {
                    status: 'cancelled'
                });
            } else {
                // Other error (HTTP, validation, network, etc.)
                pending.status = 'failed';
                pending.error = error instanceof Error ? error : new Error(String(error));

                this.uploadStateRegistry.setState(pending.uploadId, {
                    status: 'failed',
                    error: pending.error
                });
            }
        } finally {
            // Cleanup
            this.abortControllers.delete(uploadId);
        }
    }

}
