/**
 * table-meta.ts — Transaction metadata key for table commands.
 *
 * All table mutation commands tag their transactions with this key so
 * the integration layer can identify table-originated changes.
 */

/**
 * Metadata key written on every table command transaction via
 * `tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command')`.
 *
 * Using a plain string key keeps PM-specific PluginKey out of the
 * commands layer while still providing a stable, unique identifier.
 */
export const TABLE_COMMAND_META_KEY: string = 'table-command';
