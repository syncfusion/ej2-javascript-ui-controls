/**
 * Section break kind (`ST_SectionMark` mapped to public names).
 *
 * @public
 */
export enum SectionBreakCode {
    /** Next section begins on a new page. */
    NewPage = 'NewPage',
    /** Next section continues on the same page. */
    Continuous = 'Continuous',
    /** Next section begins in the next column. */
    NewColumn = 'NewColumn',
    /** Next section begins on the next even-numbered page. */
    EvenPage = 'EvenPage',
    /** Next section begins on the next odd-numbered page. */
    OddPage = 'OddPage',
}

/**
 * Wire `ST_SectionMark` values used in `w:type/@w:val`.
 *  Internal wire token. Not part of the public API.
 *
 * @private
 */
export type SectionMarkWire = 'newPage' | 'continuous' | 'nextColumn' | 'evenPage' | 'oddPage';

/**
 * @param {SectionBreakCode} code - The code.
 * @returns {SectionMarkWire} The result.
 * @private
 */
export function breakCodeToWire(code: SectionBreakCode): SectionMarkWire {
    switch (code) {
    case SectionBreakCode.NewPage:
        return 'newPage';
    case SectionBreakCode.Continuous:
        return 'continuous';
    case SectionBreakCode.NewColumn:
        return 'nextColumn';
    case SectionBreakCode.EvenPage:
        return 'evenPage';
    case SectionBreakCode.OddPage:
        return 'oddPage';
    default: {
        const _exhaustive: never = code;
        void _exhaustive;
        return 'newPage';
    }
    }
}

/**
 * @param {SectionMarkWire | undefined} wire - The wire.
 * @returns {SectionBreakCode} The result.
 * @private
 */
export function wireToBreakCode(wire: SectionMarkWire | undefined): SectionBreakCode {
    switch (wire) {
    case undefined:
    case 'newPage':
        return SectionBreakCode.NewPage;
    case 'continuous':
        return SectionBreakCode.Continuous;
    case 'nextColumn':
        return SectionBreakCode.NewColumn;
    case 'evenPage':
        return SectionBreakCode.EvenPage;
    case 'oddPage':
        return SectionBreakCode.OddPage;
    default:
        return SectionBreakCode.NewPage;
    }
}
