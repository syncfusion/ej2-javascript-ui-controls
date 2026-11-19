import { EditorEvent } from '../editor-event';

// ExtensionMounted
// ExtensionUnmounted

/**
 * Payload for ExtensionMounted / ExtensionUnmounted.
 *
 * @hidden
 */
export interface ExtensionLifecyclePayload {
    /** The unique identifier of the extension. */
    extensionId: string;
}

/**
 * ExtensionMounted — fired after an extension is successfully mounted.
 *
 * @hidden
 */
export const EXTENSION_MOUNTED: string  = 'ExtensionMounted';
export type ExtensionMounted = EditorEvent<ExtensionLifecyclePayload>;

/**
 * ExtensionUnmounted — fired after an extension is removed from the editor.
 *
 * @hidden
 */
export const EXTENSION_UNMOUNTED: string = 'ExtensionUnmounted';
export type ExtensionUnmounted = EditorEvent<ExtensionLifecyclePayload>;

