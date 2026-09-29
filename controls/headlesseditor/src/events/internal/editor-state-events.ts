import { EditorEvent } from '../editor-event';

// FocusAcquired
// FocusLost
// CommandRegistered
// PluginStateChanged

/**
 * Payload for CommandRegistered — emitted when a command is added to the command registry.
 *
 * @hidden
 */
export interface CommandRegisteredPayload {
    /** The unique name of the command that was registered. */
    commandName: string;
}

/**
 * CommandRegistered — fired when a new command is registered with the editor.
 *
 * @hidden
 */
export type CommandRegistered = EditorEvent<CommandRegisteredPayload>;

/**
 * FocusAcquiredPayload — carried when the editor view gains browser focus.
 *
 * @hidden
 */
export type FocusAcquiredPayload = Record<string, never>;

/**
 * FocusAcquired — fired when the editor view gains focus.
 *
 * @hidden
 */
export type FocusAcquired = EditorEvent<FocusAcquiredPayload>;

/**
 * FocusLostPayload — carried when the editor view loses browser focus.
 *
 * @hidden
 */
export type FocusLostPayload = Record<string, never>;

/**
 * FocusLost — fired when the editor view loses focus.
 *
 * @hidden
 */
export type FocusLost = EditorEvent<FocusLostPayload>;

/**
 * Payload for PluginStateChanged — emitted when a ProseMirror plugin's state changes.
 *
 * @hidden
 */
export interface PluginStateChangedPayload {
    /** The ProseMirror plugin key string. */
    pluginKey: string;
}

/**
 * PluginStateChanged — fired when an internal PM plugin updates its state.
 *
 * @hidden
 */
export type PluginStateChanged = EditorEvent<PluginStateChangedPayload>;
