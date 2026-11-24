/**
 * Page size dimensions in points (`CT_PageSz` width/height only).
 *
 * Canonical interface lives in core; re-exported for the sections surface.
 * Orientation is owned by {@link PageSetup}, not by size values.
 *
 * @public
 */
export { SizeF } from '../document/page-setup';
import { SizeF } from '../document/page-setup';

function freezeSize(width: number, height: number): SizeF {
    // Presets are SizeF instances; PageSetup.pageSize copies width/height and
    // never mutates the static preset identity.
    return new SizeF(width, height);
}

/**
 * Immutable page-size presets (points).
 *
 * Assigning a preset to {@link PageSetup.pageSize} copies width/height and never
 * mutates the static preset.
 *
 * @public
 */
export class PageSize {
    /**
     * Specifies the A3 page size, 842 × 1190 points.
     */
    static readonly A3: SizeF = freezeSize(842, 1190);
    /**
     * Specifies the A4 page size, 595 × 842 points.
     */
    static readonly A4: SizeF = freezeSize(595, 842);
    /**
     * Specifies the A5 page size, 421 × 595 points.
     */
    static readonly A5: SizeF = freezeSize(421, 595);
    /**
     * Specifies the A6 page size, 297 × 421 points.
     */
    static readonly A6: SizeF = freezeSize(297, 421);
    /**
     * Specifies the B4 page size, 709 × 1002 points.
     */
    static readonly B4: SizeF = freezeSize(709, 1002);
    /**
     * Specifies the B5 page size, 501 × 709 points.
     */
    static readonly B5: SizeF = freezeSize(501, 709);
    /**
     * Specifies the B6 page size, 501 × 354 points.
     */
    static readonly B6: SizeF = freezeSize(501, 354);
    /**
     * Specifies the US Letter page size, 612 × 792 points.
     */
    static readonly Letter: SizeF = freezeSize(612, 792);
    /**
     * Specifies the Half letter page size, 396 × 612 points.
     */
    static readonly HalfLetter: SizeF = freezeSize(396, 612);
    /**
     * Specifies the Letter 11 × 17 page size (Tabloid), 792 × 1224 points.
     */
    static readonly Letter11x17: SizeF = freezeSize(792, 1224);
    /**
     * Specifies the Envelope DL page size, 312 × 624 points.
     */
    static readonly EnvelopeDL: SizeF = freezeSize(312, 624);
    /**
     * Specifies the Quarto page size, 610 × 780 points.
     */
    static readonly Quarto: SizeF = freezeSize(610, 780);
    /**
     * Specifies the Statement page size, 396 × 612 points.
     */
    static readonly Statement: SizeF = freezeSize(396, 612);
    /**
     * Specifies the Ledger page size, 1224 × 792 points.
     */
    static readonly Ledger: SizeF = freezeSize(1224, 792);
    /**
     * Specifies the Tabloid page size, 792 × 1224 points.
     */
    static readonly Tabloid: SizeF = freezeSize(792, 1224);
    /**
     * Specifies the Note page size, 540 × 720 points.
     */
    static readonly Note: SizeF = freezeSize(540, 720);
    /**
     * Specifies the Legal page size, 612 × 1008 points.
     */
    static readonly Legal: SizeF = freezeSize(612, 1008);
    /**
     * Specifies the Flsa page size, 612 × 936 points.
     */
    static readonly Flsa: SizeF = freezeSize(612, 936);
    /**
     * Specifies the Executive page size, 522 × 756 points.
     */
    static readonly Executive: SizeF = freezeSize(522, 756);

    private constructor() {
        /* static presets only */
    }
}
