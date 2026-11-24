/**
 * Vertical text position relative to the baseline.
 *
 * @public
 */
export enum SubSuperScript {
    /** Normal baseline text (`w:vertAlign` baseline / omitted). */
    None = 0,
    /** Specifies that the text is raised above the baseline as a superscript. */
    SuperScript = 1,
    /** Specifies that the text is lowered below the baseline as a subscript. */
    SubScript = 2,
}

/**
 * Map ST_VerticalAlignRun wire value to {@link SubSuperScript}.
 *
 * @param {string | undefined} raw - The raw.
 * @returns {SubSuperScript} The result.
 * @private
 */
export function subSuperScriptFromWire(raw: string | undefined): SubSuperScript {
    if (raw === 'superscript') {
        return SubSuperScript.SuperScript;
    }
    if (raw === 'subscript') {
        return SubSuperScript.SubScript;
    }
    return SubSuperScript.None;
}

/**
 * Map {@link SubSuperScript} to ST_VerticalAlignRun wire value.
 *
 * @param {SubSuperScript} value - The value.
 * @returns {string | undefined} The result.
 * @private
 */
export function subSuperScriptToWire(value: SubSuperScript): string | undefined {
    if (value === SubSuperScript.SuperScript) {
        return 'superscript';
    }
    if (value === SubSuperScript.SubScript) {
        return 'subscript';
    }
    if (value === SubSuperScript.None) {
        return 'baseline';
    }
    return undefined;
}
