/**
 * Semantic paragraph alignment mapped from `ST_Jc`.
 *
 * New writes use `start`/`center`/`end`/`justify`. Loaded `left` reads as `Start`
 * and `both` reads as `Justify` without rewriting the stored value on a no-op save.
 *
 * @public
 */
export enum ParagraphAlignment {
    Left = 'start',
    Center = 'center',
    Right = 'end',
    Justify = 'justify'
}
/**
 *  ST_Jc `left`/`start` read as Start; `both` reads as Justify (spec).
 *
 * @param {string} val - The val.
 * @returns {ParagraphAlignment | undefined} The result.
 * @private
 */
export function alignmentFromJc(val: string): ParagraphAlignment | undefined {
    if (val === 'left' || val === 'start') {
        return ParagraphAlignment.Left;
    }
    if (val === 'right' || val === 'end') {
        return ParagraphAlignment.Right;
    }
    if (val === 'center') {
        return ParagraphAlignment.Center;
    }
    if (val === 'both' || val === 'justify') {
        return ParagraphAlignment.Justify;
    }
    return undefined;
}
export function jcForNewAlignment(alignment: ParagraphAlignment): string {
    if (alignment === ParagraphAlignment.Justify) {
        return 'both';
    }
    return alignment;
}
