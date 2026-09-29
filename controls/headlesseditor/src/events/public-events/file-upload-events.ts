/**
 * File upload events.
 *
 * Published by FileHandler service throughout the upload lifecycle.
 * Extensions subscribe to these events to react to upload state changes.
 */

import { EditorEvent } from '../editor-event';

/**
 * Enum for file upload event types.
 *
 * @public
 */
export enum FileUploadEventType {
    /** Published before a file upload is attempted. Extensions can cancel or modify the upload. */
    BEFORE_FILE_UPLOAD = 'beforeFileUpload',

    /** Published when a file is received (pasted/dropped/API). Extensions decide whether to accept it. */
    FILE_RECEIVED = 'fileReceived'
}

/**
 * Payload for BEFORE_FILE_UPLOAD event.
 * Published before a file upload is attempted.
 * Extensions can inspect the file and cancel the upload if needed.
 *
 * @public
 */
export interface BeforeFileUploadPayload {
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
 * BEFORE_FILE_UPLOAD event.
 *
 * @public
 */
export type BeforeFileUploadEvent = EditorEvent<BeforeFileUploadPayload>;

/**
 * Payload for FILE_RECEIVED event.
 * Published when a file is received (pasted/dropped/API).
 * Extensions receive this to decide whether to accept the file and create a node.
 *
 * @public
 */
export interface FileReceivedPayload {
    /** The file that was received. */
    file: File;

    /** Source of the file: 'paste' | 'drop' | 'api'. */
    source: 'paste' | 'drop' | 'api';
}

/**
 * FILE_RECEIVED event.
 *
 * @public
 */
export type FileReceivedEvent = EditorEvent<FileReceivedPayload>;

/**
 * Creates a BeforeFileUploadEvent instance.
 *
 * @param {File} file - The file about to be uploaded.
 * @param {'paste' | 'drop' | 'api'} source - Source of the file.
 * @returns {BeforeFileUploadEvent} The constructed event.
 *
 * @public
 */
export function createBeforeFileUploadEvent(
    file: File,
    source: 'paste' | 'drop' | 'api'
): BeforeFileUploadEvent {
    return {
        type: FileUploadEventType.BEFORE_FILE_UPLOAD,
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
 * @returns {FileReceivedEvent} The constructed event.
 *
 * @public
 */
export function createFileReceivedEvent(
    file: File,
    source: 'paste' | 'drop' | 'api'
): FileReceivedEvent {
    return {
        type: FileUploadEventType.FILE_RECEIVED,
        payload: {
            file,
            source
        }
    };
}

