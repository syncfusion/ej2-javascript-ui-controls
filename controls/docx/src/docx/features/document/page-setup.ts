/**
 * Public section page-setup contract (architecture §4–10).
 *
 * Core types `Section.pageSetup` against this surface so consumers see the live
 * DocIO-aligned API without the core package importing the sections feature. The
 * feature `PageSetup` class implements this interface plus internal
 * {@link SectionPropertiesModel} serialization.
 *
 * @public
 */

import { Color } from './color';
/**
 * Page orientation (`ST_PageOrientation`).
 *
 * @public
 */
export enum PageOrientation {
    Portrait = 'portrait',
    Landscape = 'landscape',
}

/**
 * Page number formats (`ST_NumberFormat` subset used for page numbers).
 *
 * Maps to `w:pgNumType/@w:fmt`.
 *
 * @public
 */
export enum PageNumberStyle {
    /** Arabic decimal numerals (`decimal`). */
    Arabic = 'decimal',
    /** Uppercase Roman numerals. */
    UpperRoman = 'upperRoman',
    /** Lowercase Roman numerals. */
    LowerRoman = 'lowerRoman',
    /** Uppercase letters. */
    UpperLetter = 'upperLetter',
    /** Lowercase letters. */
    LowerLetter = 'lowerLetter',
    /** Ordinal numbers (`1st`, `2nd`, …). */
    Ordinal = 'ordinal',
    /** Cardinal text (`One`, `Two`, …). */
    CardinalText = 'cardinalText',
    /** Ordinal text (`First`, `Second`, …). */
    OrdinalText = 'ordinalText',
    /** Number in dashes. */
    NumberInDash = 'numberInDash',
    /** Chicago style. */
    Chicago = 'chicago',
}

/**
 * When line numbers restart counting (`ST_LineNumberRestart`).
 *
 * EJ2 member names; wire tokens are the enum values.
 *
 * @public
 */
export enum LineNumberingMode {
    Continuous = 'continuous',
    RestartPage = 'newPage',
    RestartSection = 'newSection',
}

/**
 * Printer paper tray codes (`w:paperSrc` / Win32 `DMBIN_*` style integers).
 *
 * Unknown loaded codes are preserved internally and are not forced into an
 * incorrect public member.
 *
 * @public
 */
export enum PrinterPaperTray {
    /** Default / only bin (typically `1`). */
    DefaultBin = 1,
    /** Upper bin (`1`). */
    UpperBin = 1,
    /** Lower bin (`2`). */
    LowerBin = 2,
    /** Middle bin (`3`). */
    MiddleBin = 3,
    /** Manual feed (`4`). */
    ManualFeed = 4,
    /** Envelope feed (`5`). */
    EnvelopeFeed = 5,
    /** Envelope manual feed (`6`). */
    EnvelopeManualFeed = 6,
    /** Auto sheet feed (`7`). */
    AutoSheetFeed = 7,
    /** Tractor feed (`8`). */
    TractorFeed = 8,
    /** Small-format bin (`9`). */
    SmallFormatBin = 9,
    /** Large-format bin (`10`). */
    LargeFormatBin = 10,
    /** Large-capacity bin (`11`). */
    LargeCapacityBin = 11,
    /** Cassette (`14`). */
    Cassette = 14,
    /** Form source (`15`). */
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
 * Page border offset origin (`CT_PageBorders/@w:offsetFrom`).
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
 * Which pages receive page borders (`CT_PageBorders/@w:display`).
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
 * Page / paragraph border line styles (`ST_Border` subset).
 *
 * EJ2 member names; wire tokens are the enum values.
 *
 * @public
 */
export enum BorderStyle {
    Nil = 'nil',
    None = 'none',
    Single = 'single',
    Thick = 'thick',
    Double = 'double',
    Dotted = 'dotted',
    Dashed = 'dashed',
    DotDash = 'dotDash',
    DotDotDash = 'dotDotDash',
    Triple = 'triple',
    ThinThickSmallGap = 'thinThickSmallGap',
    ThickThinSmallGap = 'thickThinSmallGap',
    ThinThickThinSmallGap = 'thinThickThinSmallGap',
    ThinThickMediumGap = 'thinThickMediumGap',
    ThickThinMediumGap = 'thickThinMediumGap',
    ThinThickThinMediumGap = 'thinThickThinMediumGap',
    ThinThickLargeGap = 'thinThickLargeGap',
    ThickThinLargeGap = 'thickThinLargeGap',
    ThinThickThinLargeGap = 'thinThickThinLargeGap',
    Wave = 'wave',
    DoubleWave = 'doubleWave',
    DashSmallGap = 'dashSmallGap',
    DashDotStroked = 'dashDotStroked',
    ThreeDEmboss = 'threeDEmboss',
    ThreeDEngrave = 'threeDEngrave',
    Outset = 'outset',
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
     * @param {number} width - Width in points.
     * @param {number} height - Height in points.
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
    borderType: BorderStyle;
    /** Common edge color (named {@link Color} or mapped wire). */
    color: Color;
    lineWidth: number;
    readonly top: PageBorder;
    readonly bottom: PageBorder;
    readonly left: PageBorder;
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
