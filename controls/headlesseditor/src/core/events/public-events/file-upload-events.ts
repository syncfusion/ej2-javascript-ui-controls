/**
 * File upload events.
 *
 * Published by FileHandler service throughout the upload lifecycle.
 * Extensions subscribe to these events to react to upload state changes.
 */

/**
 * Payload for BEFORE_FILE_UPLOAD event.
 * Published before a file upload is attempted.
 * Extensions can inspect the file and cancel the upload if needed.
 *
 * @public
 */
export interface BeforeFileUploadEventArgs {
    /** The file about to be uploaded. */
    file: File;

    /** Source of the file: 'paste' | 'drop' | 'api'. */
    source: 'paste' | 'drop' | 'api';

    /**
     * Set to true to cancel the upload.
     * Extensions can set this in their event handler to prevent the upload from starting.
     */
    cancel?: boolean;
}

/**
 * Payload for FILE_RECEIVED event.
 * Published when a file is received (pasted/dropped/API).
 * Extensions receive this to decide whether to accept the file and create a node.
 *
 * @public
 */
export interface FileReceivedEventArgs {
    /** The file that was received. */
    file: File;

    /** Source of the file: 'paste' | 'drop' | 'api'. */
    source: 'paste' | 'drop' | 'api';
}
