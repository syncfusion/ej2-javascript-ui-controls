/**
 * Specifies the horizontal alignment of a paragraph.
 *
 * @public
 */
export enum ParagraphAlignment {
    /** Specifies the left alignment. */
    Left = 'start',
    /** Specifies the center alignment. */
    Center = 'center',
    /** Specifies the right alignment. */
    Right = 'end',
    /** Specifies the justify alignment. */
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
