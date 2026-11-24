/**
 * Flags that control {@link WordDocument.importContent}.
 *
 * Flags may be combined with `|`. A value is normalized before use: of the style
 * flags, Use Destination Styles wins over Merge Formatting, which wins over Keep
 * Text Only, which wins over Keep Source Formatting; with no style flag, Use
 * Destination Styles applies. Of the list flags only one is kept, and Continue wins.
 *
 * @isenumeration true
 * @public
 */
export enum ImportOptions {
    /**
     * Keeps the source formatting. Each paragraph references the destination's default
     * paragraph style and carries the formatting its source style supplied as direct formatting.
     */
    KeepSourceFormatting = 1,

    /**
     * Merges the source into the formatting of the destination's last paragraph. Direct bold,
     * italic, single underline, subscript and superscript are retained; strikethrough and
     * explicit font size are not.
     */
    MergeFormatting = 2,

    /**
     * Imports text only in one new section. A table row becomes one paragraph with the cell
     * texts separated by tabs. Styles and non-text content are not imported.
     */
    KeepTextOnly = 4,

    /**
     * Uses the destination's style when it defines a style with the same name and type;
     * otherwise the source style is added.
     */
    UseDestinationStyles = 8,

    /** Continues the numbering of the preceding list in the destination. */
    ListContinueNumbering = 16,

    /** Restarts list numbering for the imported list items. */
    ListRestartNumbering = 32
}

/**
 * Normalized import options.
 *
 * @private
 */
export interface NormalizedImportOptions {
    readonly mode: 'destination' | 'merge' | 'textOnly' | 'source';
    readonly list: 'continue' | 'restart' | 'none';
}

/**
 * Whether `value` is a valid {@link ImportOptions} value: an integer in 0..63.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export function isValidImportOptions(value: unknown): value is number {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value && value >= 0 && value <= 63;
}

/**
 * Normalizes a valid options value.
 *
 * @param {number} value - A value accepted by {@link isValidImportOptions}.
 * @returns {NormalizedImportOptions} The result.
 * @private
 */
export function normalizeImportOptions(value: number): NormalizedImportOptions {
    let mode: NormalizedImportOptions['mode'] = 'destination';
    if ((value & ImportOptions.UseDestinationStyles) !== 0) {
        mode = 'destination';
    } else if ((value & ImportOptions.MergeFormatting) !== 0) {
        mode = 'merge';
    } else if ((value & ImportOptions.KeepTextOnly) !== 0) {
        mode = 'textOnly';
    } else if ((value & ImportOptions.KeepSourceFormatting) !== 0) {
        mode = 'source';
    }
    let list: NormalizedImportOptions['list'] = 'none';
    if ((value & ImportOptions.ListContinueNumbering) !== 0) {
        list = 'continue';
    } else if ((value & ImportOptions.ListRestartNumbering) !== 0) {
        list = 'restart';
    }
    return { mode, list };
}
