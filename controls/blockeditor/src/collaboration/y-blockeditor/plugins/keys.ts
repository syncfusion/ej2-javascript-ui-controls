/**
 * Unique key for the sync plugin.
 * Used to:
 * - Identify transactions originated from the sync plugin
 * - Access sync plugin state
 * - Coordinate between plugins
 */
export const ySyncPluginKey: string = 'y-sync-plugin';

/**
 * Unique key for the undo plugin.
 * Used to:
 * - Identify undo/redo transactions
 * - Access undo manager state
 */
export const yUndoPluginKey: string = 'y-undo-plugin';

/**
 * Unique key for the cursor plugin.
 * Used to:
 * - Identify cursor-related updates
 * - Access awareness state
 */
export const yCursorPluginKey: string = 'y-cursor-plugin';

/**
 * Unique key for the version plugin.
 * Used to:
 * - Identify version history operations
 */
export const yVersionHistoryKey: string = 'y-version-plugin';

/**
 * Unique key to mark transactions or operations that should be excluded from Yjs synchronization.
 * Used to:
 * - Prevent certain local-only changes from being synced to other clients
 * - Avoid feedback loops when applying remote updates
 */
export const yExcludedOrigin: string[] = ['y-excluded-origin'];
