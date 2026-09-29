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
import {
    createBeforeFileUploadEvent,
    createFileReceivedEvent
} from '../events/public-events/file-upload-events';
import type {
    BeforeFileUploadEvent,
    FileReceivedEvent
} from '../events/public-events/file-upload-events';
import type { UploadStateRegistry } from './upload-state-registry';
import { DefaultIdGenerator, IdGenerator } from '../utils/index';

/**
 * Pending file upload tracking.
 */
export interface PendingFileUpload {
    /** Unique upload ID (UUID). */
    uploadId: string;

    /** Owner key for registry updates (nodeId when called from extension, uploadId otherwise). */
    registryKey: string;

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
    private idGen: IdGenerator = new DefaultIdGenerator();

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
     * @param {string} [registryKey] - Owner key for registry updates (e.g., nodeId). Defaults to uploadId.
     * @returns {string} uploadId (UUID) for tracking this upload.
     *
     * Called by extension after it creates/inserts its node.
     * Extension receives uploadId but does NOT store in node.attrs.
     * Extension maintains internal: Map<uploadId, { nodeId }>.
     * When registryKey is provided, all registry updates use that key instead of uploadId.
     */
    public startUpload(file: File, registryKey?: string): string {
        if (!this.uploadHandler) {
            throw new Error('FileUploadHandler not registered. Call setUploadHandler() first.');
        }

        const uploadId: string = this.idGen.generate();
        const abortController: AbortController = new AbortController();

        // Create pending upload entry
        const pending: PendingFileUpload = {
            uploadId,
            registryKey: registryKey ?? uploadId,
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
            const beforeEvent: BeforeFileUploadEvent = createBeforeFileUploadEvent(file, source);
            this.eventBus.publish(beforeEvent);

            // Check if any extension cancelled the upload
            if (beforeEvent.payload.cancel) {
                continue;
            }

            // Publish FILE_RECEIVED event - extensions create nodes here
            const receivedEvent: FileReceivedEvent = createFileReceivedEvent(file, source);
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

                    // Write directly to registry using registryKey (onProgress is transport-level, not event-level)
                    // registryKey allows plugins to track by nodeId even though upload is tracked by uploadId
                    this.uploadStateRegistry.setState(pending.registryKey, {
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

            this.uploadStateRegistry.setState(pending.registryKey, {
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
                this.uploadStateRegistry.setState(pending.registryKey, {
                    status: 'cancelled'
                });
            } else {
                // Other error (HTTP, validation, network, etc.)
                pending.status = 'failed';
                pending.error = error instanceof Error ? error : new Error(String(error));

                this.uploadStateRegistry.setState(pending.registryKey, {
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
