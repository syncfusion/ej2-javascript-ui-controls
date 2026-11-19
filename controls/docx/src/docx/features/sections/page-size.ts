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
    /** A3 — 842 × 1190 pt. */
    static readonly A3: SizeF = freezeSize(842, 1190);
    /** A4 — 595 × 842 pt. */
    static readonly A4: SizeF = freezeSize(595, 842);
    /** A5 — 421 × 595 pt. */
    static readonly A5: SizeF = freezeSize(421, 595);
    /** A6 — 297 × 421 pt. */
    static readonly A6: SizeF = freezeSize(297, 421);
    /** B4 — 709 × 1002 pt. */
    static readonly B4: SizeF = freezeSize(709, 1002);
    /** B5 — 501 × 709 pt. */
    static readonly B5: SizeF = freezeSize(501, 709);
    /** B6 — 501 × 354 pt (landscape preset dimensions). */
    static readonly B6: SizeF = freezeSize(501, 354);
    /** US Letter — 612 × 792 pt. */
    static readonly Letter: SizeF = freezeSize(612, 792);
    /** Half letter — 396 × 612 pt. */
    static readonly HalfLetter: SizeF = freezeSize(396, 612);
    /** 11×17 tabloid portrait dimensions — 792 × 1224 pt. */
    static readonly Letter11x17: SizeF = freezeSize(792, 1224);
    /** Envelope DL — 312 × 624 pt. */
    static readonly EnvelopeDL: SizeF = freezeSize(312, 624);
    /** Quarto — 610 × 780 pt. */
    static readonly Quarto: SizeF = freezeSize(610, 780);
    /** Statement — 396 × 612 pt. */
    static readonly Statement: SizeF = freezeSize(396, 612);
    /** Ledger — 1224 × 792 pt. */
    static readonly Ledger: SizeF = freezeSize(1224, 792);
    /** Tabloid — 792 × 1224 pt. */
    static readonly Tabloid: SizeF = freezeSize(792, 1224);
    /** Note — 540 × 720 pt. */
    static readonly Note: SizeF = freezeSize(540, 720);
    /** Legal — 612 × 1008 pt. */
    static readonly Legal: SizeF = freezeSize(612, 1008);
    /** Flsa — 612 × 936 pt. */
    static readonly Flsa: SizeF = freezeSize(612, 936);
    /** Executive — 522 × 756 pt. */
    static readonly Executive: SizeF = freezeSize(522, 756);

    private constructor() {
        /* static presets only */
    }
}
