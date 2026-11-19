/**
 * UploadSession class for managing upload state.
 *
 * @hidden
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
     * Base64 or Blob URL for preview.
     */
    public previewUrl: string;

    constructor(sessionId: string, blockId: string, file: File, previewUrl: string) {
        this.sessionId = sessionId;
        this.blockId = blockId;
        this.fileName = file.name;
        this.previewUrl = previewUrl;
    }
}
