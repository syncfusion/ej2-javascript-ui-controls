/**
 * UploadSession entity for tracking active upload operations.
 * This is a transient entity that exists only during the upload lifecycle.
 */

/**
 * Upload status classification.
 */
export type UploadStatus =
    | 'pending'      // File selected, not yet started
    | 'validating'   // Running client-side validation
    | 'uploading'    // Upload in progress
    | 'completed'    // Upload successful
    | 'failed'       // Upload failed
    | 'cancelled';   // Upload cancelled by user

/**
 * UploadSession class for managing upload state.
 */
export class UploadSession {
    /**
     * Unique upload session identifier.
     */
    public sessionId: string;

    /**
     * Associated ImageBlock ID.
     */
    public blockId: string;

    /**
     * Original file name from user's device.
     */
    public fileName: string;

    /**
     * File size in bytes.
     */
    public fileSize: number;

    /**
     * Upload progress (0-100).
     */
    public progressPercent: number;

    /**
     * Current upload status.
     */
    public status: UploadStatus;

    /**
     * Base64 or Blob URL for preview.
     */
    public previewUrl: string | null;

    /**
     * Error message if upload failed.
     */
    public errorMessage: string | null;

    /**
     * Upload start timestamp.
     */
    public startTime: number;

    /**
     * Upload completion/failure timestamp.
     */
    public endTime: number | null;

    /**
     * Native File object (for retry scenarios).
     */
    public file: File | null;

    constructor(sessionId: string, blockId: string, file: File, previewUrl: string | null) {
        this.sessionId = sessionId;
        this.blockId = blockId;
        this.fileName = file.name;
        this.fileSize = file.size;
        this.progressPercent = 0;
        this.status = 'pending';
        this.previewUrl = previewUrl;
        this.errorMessage = null;
        this.startTime = Date.now();
        this.endTime = null;
        this.file = file;
    }

    public updateProgress(percent: number): void {
        this.progressPercent = Math.min(100, Math.max(0, percent));
        if (this.status === 'pending') {
            this.status = 'uploading';
        }
    }

    private setTerminalState(
        status: 'completed' | 'failed' | 'cancelled',
        errorMessage?: string
    ): void {
        this.status = status;
        this.endTime = Date.now();

        if (status === 'completed') {
            this.progressPercent = 100;
        } else if (errorMessage !== undefined) {
            this.errorMessage = errorMessage;
        }
        else {
            this.errorMessage = 'Upload failed';
        }
    }

    public complete(): void {
        this.setTerminalState('completed');
    }

    public fail(errorMessage: string): void {
        this.setTerminalState('failed', errorMessage);
    }

    public cancel(): void {
        this.setTerminalState('cancelled', 'Upload cancelled by user');
    }
}
