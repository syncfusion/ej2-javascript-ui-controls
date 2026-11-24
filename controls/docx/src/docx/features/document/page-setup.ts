/**
 * Public section page-setup contract (architecture §4–10).
 *
 * Core types `Section.pageSetup` against this surface so consumers see the live
 * API without the core package importing the sections feature. The
 * feature `PageSetup` class implements this interface plus internal
 * {@link SectionPropertiesModel} serialization.
 *
 * @public
 */

import { Color } from './color';
/**
 * Page orientation.
 *
 * @public
 */
export enum PageOrientation {
    /** Specifies the portrait orientation. */
    Portrait = 'portrait',
    /** Specifies the landscape orientation. */
    Landscape = 'landscape',
}

/**
 * Specifies the number format used for page numbers.
 *
 * @public
 */
export enum PageNumberStyle {
    /** Arabic decimal numerals (`decimal`). */
    Arabic = 'decimal',
    /** Specifies uppercase Roman numerals (I, II, III, …) for the page numbers. */
    UpperRoman = 'upperRoman',
    /** Specifies lowercase Roman numerals (i, ii, iii, …) for the page numbers. */
    LowerRoman = 'lowerRoman',
    /** Specifies uppercase letters (A, B, C, …) for the page numbers. */
    UpperLetter = 'upperLetter',
    /** Specifies lowercase letters (a, b, c, …) for the page numbers. */
    LowerLetter = 'lowerLetter',
    /** Ordinal numbers (`1st`, `2nd`, …). */
    Ordinal = 'ordinal',
    /** Cardinal text (`One`, `Two`, …). */
    CardinalText = 'cardinalText',
    /** Ordinal text (`First`, `Second`, …). */
    OrdinalText = 'ordinalText',
    /** Specifies numbers surrounded by dashes (- 1 -) for the page numbers. */
    NumberInDash = 'numberInDash',
    /** Specifies the Chicago style, which uses the symbols *, †, ‡, and § for the page numbers. */
    Chicago = 'chicago',
}

/**
 * Specifies when line numbering restarts.
 *
 * @public
 */
export enum LineNumberingMode {
    /** Specifies the continuous mode. */
    Continuous = 'continuous',
    /** Specifies the restart page mode. */
    RestartPage = 'newPage',
    /** Specifies the restart section mode. */
    RestartSection = 'newSection',
}

/**
 * Printer paper tray codes.
 *
 * Unknown loaded codes are preserved internally and are not forced into an
 * incorrect public member.
 *
 * @public
 */
export enum PrinterPaperTray {
    /** Default / only bin (typically `1`). */
    DefaultBin = 1,
    /** Specifies the upper bin (`1`). */
    UpperBin = 1,
    /** Specifies the lower bin (`2`). */
    LowerBin = 2,
    /** Specifies the middle bin (`3`). */
    MiddleBin = 3,
    /** Specifies the manual feed tray (`4`). */
    ManualFeed = 4,
    /** Specifies the envelope feed tray (`5`). */
    EnvelopeFeed = 5,
    /** Envelope manual feed (`6`). */
    EnvelopeManualFeed = 6,
    /** Auto sheet feed (`7`). */
    AutoSheetFeed = 7,
    /** Specifies the tractor feed tray (`8`). */
    TractorFeed = 8,
    /** Specifies the small-format bin (`9`). */
    SmallFormatBin = 9,
    /** Specifies the large-format bin (`10`). */
    LargeFormatBin = 10,
    /** Specifies the large-capacity bin (`11`). */
    LargeCapacityBin = 11,
    /** Specifies the cassette tray (`14`). */
    Cassette = 14,
    /** Specifies the form source tray (`15`). */
    FormSource = 15,
}

/**
 * Vertical text alignment on the page (`ST_VerticalJc` / `w:vAlign`).
 *
 * EJ2 member names; wire tokens are the enum values.
 *
 * @public
 */
export enum VerticalAlignment {
    Top = 'top',
    Center = 'center',
    Both = 'both',
    Bottom = 'bottom',
}

/**
 * Page border offset origin.
 *
 * @public
 */
export enum PageBorderOffsetFrom {
    /** Measure border space from the text area (`text`). */
    Text = 'text',
    /** Measure border space from the page edge (`page`). */
    PageEdge = 'page',
}

/**
 * Which pages receive page borders.
 *
 * @public
 */
export enum PageBordersApplyType {
    /** All pages in the section (`allPages`). */
    AllPages = 'allPages',
    /** First page only (`firstPage`). */
    FirstPage = 'firstPage',
    /** All pages except the first (`notFirstPage`). */
    NotFirstPage = 'notFirstPage',
}

/**
 * Specifies the line style of a page or paragraph border.
 *
 * @public
 */
export enum BorderStyle {
    /** Specifies the nil style. */
    Nil = 'nil',
    /** Specifies the none style. */
    None = 'none',
    /** Specifies the single style. */
    Single = 'single',
    /** Specifies the thick style. */
    Thick = 'thick',
    /** Specifies the double style. */
    Double = 'double',
    /** Specifies the dotted style. */
    Dotted = 'dotted',
    /** Specifies the dashed style. */
    Dashed = 'dashed',
    /** Specifies the dot dash style. */
    DotDash = 'dotDash',
    /** Specifies the dot dot dash style. */
    DotDotDash = 'dotDotDash',
    /** Specifies the triple style. */
    Triple = 'triple',
    /** Specifies the thin thick small gap style. */
    ThinThickSmallGap = 'thinThickSmallGap',
    /** Specifies the thick thin small gap style. */
    ThickThinSmallGap = 'thickThinSmallGap',
    /** Specifies the thin thick thin small gap style. */
    ThinThickThinSmallGap = 'thinThickThinSmallGap',
    /** Specifies the thin thick medium gap style. */
    ThinThickMediumGap = 'thinThickMediumGap',
    /** Specifies the thick thin medium gap style. */
    ThickThinMediumGap = 'thickThinMediumGap',
    /** Specifies the thin thick thin medium gap style. */
    ThinThickThinMediumGap = 'thinThickThinMediumGap',
    /** Specifies the thin thick large gap style. */
    ThinThickLargeGap = 'thinThickLargeGap',
    /** Specifies the thick thin large gap style. */
    ThickThinLargeGap = 'thickThinLargeGap',
    /** Specifies the thin thick thin large gap style. */
    ThinThickThinLargeGap = 'thinThickThinLargeGap',
    /** Specifies the wave style. */
    Wave = 'wave',
    /** Specifies the double wave style. */
    DoubleWave = 'doubleWave',
    /** Specifies the dash small gap style. */
    DashSmallGap = 'dashSmallGap',
    /** Specifies the dash dot stroked style. */
    DashDotStroked = 'dashDotStroked',
    /** Specifies the three d emboss style. */
    ThreeDEmboss = 'threeDEmboss',
    /** Specifies the three d engrave style. */
    ThreeDEngrave = 'threeDEngrave',
    /** Specifies the outset style. */
    Outset = 'outset',
    /** Specifies the inset style. */
    Inset = 'inset',
}

/**
 * Mutable page size dimensions in points (`CT_PageSz` width/height only).
 *
 * Orientation is owned by {@link PageSetup}. Mutating width/height notifies the
 * owning setup (when attached) so orientation stays in sync.
 *
 * @public
 */
export class SizeF {
    private widthValue: number;
    private heightValue: number;
    private changeListener: ((width: number, height: number) => void) | undefined;

    /**
     * @param {number} width - Specifies the width in points.
     * @param {number} height - Specifies the height in points.
     */
    constructor(width: number, height: number) {
        this.widthValue = width;
        this.heightValue = height;
        this.changeListener = undefined;
    }

    /**
     * @param {Function} listener - The listener.
     * @returns {void} Nothing is returned.
     * @private
     * Owned by {@link PageSetup} so dimension edits can recompute orientation.
     */
    setChangeListener(listener: ((width: number, height: number) => void) | undefined): void {
        this.changeListener = listener;
    }

    /**
     * @param {number} width - The width.
     * @param {number} height - The height.
     * @param {boolean} notify - The notify.
     * @returns {void} Nothing is returned.
     * @private
     * Replace both dimensions without re-entry through public setters.
     */
    replace(width: number, height: number, notify: boolean): void {
        this.widthValue = width;
        this.heightValue = height;
        if (notify && this.changeListener !== undefined) {
            this.changeListener(width, height);
        }
    }

    get width(): number {
        return this.widthValue;
    }

    set width(value: number) {
        this.widthValue = value;
        if (this.changeListener !== undefined) {
            this.changeListener(this.widthValue, this.heightValue);
        }
    }

    get height(): number {
        return this.heightValue;
    }

    set height(value: number) {
        this.heightValue = value;
        if (this.changeListener !== undefined) {
            this.changeListener(this.widthValue, this.heightValue);
        }
    }
}

/**
 * Live page margins surface (`CT_PageMar` left/top/right/bottom).
 *
 * @public
 */
export interface PageMargins {
    all: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * One live page-border edge (`w:top` / `w:left` / `w:bottom` / `w:right`).
 *
 * Edge style, color, and width are owned by {@link PageBorders}; only
 * per-edge space is public here.
 *
 * @public
 */
export interface PageBorder {
    space: number;
}

/**
 * Live page borders surface (`CT_PageBorders`).
 *
 * `borderType`, `color`, and `lineWidth` apply to all four edges.
 *
 * @public
 */
export interface PageBorders {
    /**
     * Gets or sets the border style applied to all the page borders.
     */
    borderType: BorderStyle;
    /** Common edge color (named {@link Color} or mapped wire). */
    color: Color;
    /**
     * Gets or sets the line width, in points, applied to all the page borders.
     */
    lineWidth: number;
    /**
     * Gets the top page border.
     */
    readonly top: PageBorder;
    /**
     * Gets the bottom page border.
     */
    readonly bottom: PageBorder;
    /**
     * Gets the left page border.
     */
    readonly left: PageBorder;
    /**
     * Gets the right page border.
     */
    readonly right: PageBorder;
}

/**
 * Public live page-setup API for a document section.
 *
 * Always returned from {@link Section.pageSetup} when the sections feature is
 * registered (never `undefined`, never {@link SectionPropertiesModel} alone).
 *
 * @public
 */
export interface PageSetup {
    /**
     * Page orientation. Setter swaps width/height only when needed.
     */
    orientation: PageOrientation;

    /**
     * Live page size (stable identity). Setter copies width/height and derives orientation.
     */
    pageSize: SizeF;

    /**
     * Live margins instance (stable identity for the life of this page setup).
     */
    readonly margins: PageMargins;

    /**
     * Distance from page top to header (`w:pgMar/@w:header`), points.
     */
    headerDistance: number;

    /**
     * Distance from page bottom to footer (`w:pgMar/@w:footer`), points.
     */
    footerDistance: number;

    /**
     * Gutter margin (`w:pgMar/@w:gutter`), points.
     *
     * @private
     */
    gutter: number;

    /**
     * Vertical text alignment on the page (`w:vAlign` / `ST_VerticalJc`).
     */
    verticalAlignment: VerticalAlignment;

    /**
     * Right-to-left section layout (`w:bidi`, ECMA-376-1 §17.6.1).
     */
    bidi: boolean;

    /**
     * Live page borders (stable identity).
     */
    readonly borders: PageBorders;

    /**
     * Page border offset origin (`w:pgBorders/@w:offsetFrom`).
     */
    pageBorderOffsetFrom: PageBorderOffsetFrom;

    /**
     * Which pages receive page borders (`w:pgBorders/@w:display`).
     */
    pageBordersApplyType: PageBordersApplyType;

    /**
     * First-page printer tray (`w:paperSrc/@w:first`).
     */
    firstPageTray: PrinterPaperTray;

    /**
     * Other-pages printer tray (`w:paperSrc/@w:other`).
     */
    otherPagesTray: PrinterPaperTray;

    /**
     * Different first page (`w:titlePg`).
     */
    differentFirstPage: boolean;

    /**
     * Different odd and even pages (document settings `w:evenAndOddHeaders`).
     */
    differentOddAndEvenPages: boolean;

    /**
     * Starting page number when restart is enabled (`w:pgNumType/@w:start`).
     */
    pageStartingNumber: number;

    /**
     * When `true`, write `w:start` with {@link pageStartingNumber}.
     */
    restartPageNumbering: boolean;

    /**
     * Page number format (`w:pgNumType/@w:fmt`).
     */
    pageNumberStyle: PageNumberStyle;

    /**
     * Distance from text to line numbers (`w:lnNumType/@w:distance`), points.
     */
    lineNumberingDistanceFromText: number;

    /**
     * Line-number restart mode (`w:lnNumType/@w:restart`).
     */
    lineNumberingMode: LineNumberingMode;

    /**
     * Line-number start value (`w:lnNumType/@w:start`).
     */
    lineNumberingStartValue: number;

    /**
     * Line-number count-by step (`w:lnNumType/@w:countBy`).
     */
    lineNumberingStep: number;
}
