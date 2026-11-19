/**
 * Worksheet page setup (`printOptions` / `pageMargins` / `pageSetup`).
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.62–64
 * - transitional sml.xsd `CT_PrintOptions`, `CT_PageMargins`, `CT_PageSetup`
 * - docs/specs/page-setup.md; docs/ooxml-mapping/page-setup.md
 * - API-RULES R3.5 (`PaperSize.*`)
 * - Chart anchor size pattern: public size in points; OOXML margins store inches
 * - XlsIO PageSetup skill
 *
 * Print area / titles remain workbook defined names (`_xlnm.*`).
 * `headerFooter` stays opaque in the after-sheetData bag.
 *
 * **Units:** public margin values are **points** (72 points = 1 inch), same
 * authoring unit as chart `width`/`height`. SpreadsheetML `pageMargins`
 * attributes are inches; load/save converts at the wire boundary.
 */

import { formatInchesAttr } from '../core/length';
import { InvalidArgumentError } from '../core/errors';
import { PaperSize } from '../core/paper-size';
import { attrsToXmlExcluding, escapeXml, parseAttrMap, unescapeXml } from '../core/xml/minimal-xml';

/** Points per inch (exact; typographic point). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const POINTS_PER_INCH: 72 = 72;

/** Specifies whether a printed page is taller than wide or wider than tall. */
export type PageOrientation = 'default' | 'portrait' | 'landscape';

/**
 * Specifies the order pages are printed when a sheet spans several pages —
 * down first or across first.
 */
export type PageOrder = 'downThenOver' | 'overThenDown';

/**
 * The six page margins in **points** (72 points = 1 inch), matching chart
 * width/height authoring. Example: `54` = 0.75 inches.
 */
export interface PageMargins {
    /**
     * Left margin in points (72 points = 1 inch).
     * Example: `50.4` = 0.7 inches.
     */
    left: number;
    /**
     * Right margin in points (72 points = 1 inch).
     * Example: `50.4` = 0.7 inches.
     */
    right: number;
    /**
     * Top margin in points (72 points = 1 inch).
     * Example: `54` = 0.75 inches.
     */
    top: number;
    /**
     * Bottom margin in points (72 points = 1 inch).
     * Example: `54` = 0.75 inches.
     */
    bottom: number;
    /**
     * Header margin in points (72 points = 1 inch).
     * Example: `21.6` = 0.3 inches.
     */
    header: number;
    /**
     * Footer margin in points (72 points = 1 inch).
     * Example: `21.6` = 0.3 inches.
     */
    footer: number;
}

/**
 * Provides the left, center, and right header and footer sections for a
 * page kind (default, first, odd, or even).
 *
 * Matches the Excel / XlsIO shape `FirstPage.CenterHeader`, `EvenPage.LeftFooter`, etc.
 */
export interface PageHeaderFooter {
    /** The text printed in the top-left corner of the page. */
    leftHeader: string;
    /** The text printed centered at the top of the page. */
    centerHeader: string;
    /** The text printed in the top-right corner of the page. */
    rightHeader: string;
    /** The text printed in the bottom-left corner of the page. */
    leftFooter: string;
    /** The text printed centered at the bottom of the page. */
    centerFooter: string;
    /** The text printed in the bottom-right corner of the page. */
    rightFooter: string;
}

/**
 * Controls how a worksheet prints, letting you set paper size, orientation,
 * margins, headers and footers, and scaling options.
 */
export interface PageSetup {
    /**
     * The paper size pages print on, given as one of the `PaperSize`
     * constants — for example `PaperSize.A4` or `PaperSize.Letter`.
     */
    paperSize: number;
    /**
     * The page direction: `'portrait'` (tall) or `'landscape'` (wide).
     * `'default'` leaves the choice to the printer's default.
     */
    orientation: PageOrientation;
    /**
     * The blank space around the printed content, in **points**
     * (72 points = 1 inch — same unit as chart width/height).
     *
     * Nested writes work: `sheet.pageSetup.margins.top = 90`.
     * You can also assign a full or partial object:
     * `sheet.pageSetup.margins = { top: 108 }` (1.5 inch top margin).
     *
     * Declared as a property for TypeScript 3.3 interface compatibility
     * (no get/set in interfaces). Reads return full {@link PageMargins};
     * writes accept a full or partial object at runtime.
     */
    margins: PageMargins | Partial<PageMargins>;
    /** Whether the printed content is centered left-to-right on the page. */
    centerHorizontally: boolean;
    /** Whether the printed content is centered top-to-bottom on the page. */
    centerVertically: boolean;
    /** Whether the sheet's gridlines are printed. */
    printGridlines: boolean;
    /** Whether the row numbers and column letters are printed. */
    printHeadings: boolean;
    /**
     * Print scale percent (10–400). Retained for OOXML load/save only.
     *
     * @private
     */
    scale: number;
    /**
     * When {@link isFitToPage} is on, the number of pages wide the sheet is
     * scaled to — `0` means no width limit.
     */
    fitToWidth: number;
    /**
     * When {@link isFitToPage} is on, the number of pages tall the sheet is
     * scaled to — `0` means no height limit.
     */
    fitToHeight: number;
    /**
     * Whether Excel scales the sheet to fit the page counts in
     * {@link fitToWidth} / {@link fitToHeight}, instead of printing at
     * 100%.
     */
    isFitToPage: boolean;
    /**
     * How multi-page sheets are ordered: across then down
     * (`'overThenDown'`) or down then across (`'downThenOver'`).
     */
    pageOrder: PageOrder;
    /**
     * The number printed on the first page — `undefined` lets Excel start
     * at `1`.
     */
    firstPageNumber: number | undefined;
    /** The text printed in the top-left corner of every printed page. */
    leftHeader: string;
    /** The text printed centered at the top of every printed page. */
    centerHeader: string;
    /** The text printed in the top-right corner of every printed page. */
    rightHeader: string;
    /** The text printed in the bottom-left corner of every printed page. */
    leftFooter: string;
    /** The text printed centered at the bottom of every printed page. */
    centerFooter: string;
    /** The text printed in the bottom-right corner of every printed page. */
    rightFooter: string;
    /**
     * Whether the first page uses its own header and footer, separate from
     * the rest. Set sections on {@link firstPage} to turn this on
     * automatically.
     */
    differentFirstPage: boolean;
    /**
     * The header and footer for the first page, section by section. Writing
     * any section turns on {@link differentFirstPage}.
     */
    readonly firstPage: PageHeaderFooter;
    /**
     * The first page's full header as a single string, using Excel's
     * `&L` / `&C` / `&R` section markers. Prefer {@link firstPage} for
     * simpler left/center/right authoring.
     */
    firstPageHeader: string;
    /**
     * The first page's full footer as a single string, using Excel's
     * `&L` / `&C` / `&R` section markers. Prefer {@link firstPage} for
     * simpler left/center/right authoring.
     */
    firstPageFooter: string;
    /**
     * Whether odd and even pages use different headers and footers. Set
     * sections on {@link evenPage} to turn this on automatically.
     */
    oddAndEvenPagesHeaderFooter: boolean;
    /**
     * The header and footer for odd pages, section by section. When the
     * raw {@link oddHeader} / {@link oddFooter} strings are empty, mirrors
     * the default {@link leftHeader} / {@link centerHeader} / … properties.
     */
    readonly oddPage: PageHeaderFooter;
    /**
     * The header and footer for even pages, section by section. Writing
     * any section turns on {@link oddAndEvenPagesHeaderFooter}.
     */
    readonly evenPage: PageHeaderFooter;
    /** The odd pages' full header as a single `&L`/`&C`/`&R` string. */
    oddHeader: string;
    /** The odd pages' full footer as a single `&L`/`&C`/`&R` string. */
    oddFooter: string;
    /** The even pages' full header as a single `&L`/`&C`/`&R` string. */
    evenHeader: string;
    /** The even pages' full footer as a single `&L`/`&C`/`&R` string. */
    evenFooter: string;
    /**
     * The part of the sheet that prints, as a range address — `undefined`
     * prints the whole sheet.
     */
    printArea: string | undefined;
    /**
     * The rows repeated at the top of every printed page — for example
     * `'1:2'` to repeat rows 1 and 2. `undefined` repeats nothing.
     */
    printTitleRows: string | undefined;
    /**
     * The columns repeated at the left of every printed page — for example
     * `'A:B'` to repeat columns A and B. `undefined` repeats nothing.
     */
    printTitleColumns: string | undefined;
}

/**
 * Wire model for the print trio.
 *
 * @private
 */
export interface PageSetupModel {
    /** True when any of the three elements was present or authored. */
    readonly present: boolean;
    readonly printOptionsPresent: boolean;
    readonly pageMarginsPresent: boolean;
    readonly pageSetupPresent: boolean;
    readonly paperSize: number;
    readonly orientation: PageOrientation;
    readonly margins: PageMargins;
    readonly centerHorizontally: boolean;
    readonly centerVertically: boolean;
    readonly printGridlines: boolean;
    readonly printHeadings: boolean;
    readonly scale: number;
    readonly fitToWidth: number;
    readonly fitToHeight: number;
    readonly isFitToPage: boolean;
    readonly pageOrder: PageOrder;
    readonly firstPageNumber: number | undefined;
    readonly leftHeader: string;
    readonly centerHeader: string;
    readonly rightHeader: string;
    readonly leftFooter: string;
    readonly centerFooter: string;
    readonly rightFooter: string;
    readonly differentFirstPage: boolean;
    readonly firstPageHeader: string;
    readonly firstPageFooter: string;
    readonly oddAndEvenPagesHeaderFooter: boolean;
    readonly oddHeader: string;
    readonly oddFooter: string;
    readonly evenHeader: string;
    readonly evenFooter: string;
    readonly headerFooterPresent: boolean;
    readonly headerFooterExtraAttrsXml: string;
    readonly printOptionsExtraAttrsXml: string;
    readonly pageMarginsExtraAttrsXml: string;
    readonly pageSetupExtraAttrsXml: string;
    /**
     * When true, fitTo* was explicitly set on wire or by author (affects
     * whether scale vs fit attributes are emphasized on write).
     */
    readonly fitToPage: boolean;
}

/**
 * Host notifications.
 *
 * @private
 */
export interface PageSetupHost {
    markDirty(): void;
    getPrintName(name: 'Print_Area' | 'Print_Titles'): string | undefined;
    setPrintName(name: 'Print_Area' | 'Print_Titles', content: string | undefined): void;
}

/** Default Excel-like margins (inches on the OOXML wire). */
const DEFAULT_MARGIN_IN: { left: number; right: number; top: number; bottom: number; header: number; footer: number } = {
    left: 0.7,
    right: 0.7,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3
};

/**
 * Convert inches (SpreadsheetML) to public points.
 *
 * @param {number} inches - The inches parameter.
 * @returns {number} - Returns the result.
 */
function inchesToPoints(inches: number): number {
    return inches * POINTS_PER_INCH;
}

/**
 * Convert public points to inches for SpreadsheetML `pageMargins`.
 *
 * @param {number} points - The points parameter.
 * @returns {number} - Returns the result.
 */
function pointsToInches(points: number): number {
    return points / POINTS_PER_INCH;
}

/**
 * defaultMargins function.
 *
 * @returns {PageMargins} - Returns the result.
 */
function defaultMargins(): PageMargins {
    return {
        left: inchesToPoints(DEFAULT_MARGIN_IN.left),
        right: inchesToPoints(DEFAULT_MARGIN_IN.right),
        top: inchesToPoints(DEFAULT_MARGIN_IN.top),
        bottom: inchesToPoints(DEFAULT_MARGIN_IN.bottom),
        header: inchesToPoints(DEFAULT_MARGIN_IN.header),
        footer: inchesToPoints(DEFAULT_MARGIN_IN.footer)
    };
}

/**
 * defaultModel function.
 *
 * @returns {PageSetupModel} - Returns the result.
 */
function defaultModel(): PageSetupModel {
    return {
        present: false,
        printOptionsPresent: false,
        pageMarginsPresent: false,
        pageSetupPresent: false,
        paperSize: PaperSize.Letter,
        orientation: 'default',
        margins: defaultMargins(),
        centerHorizontally: false,
        centerVertically: false,
        printGridlines: false,
        printHeadings: false,
        scale: 100,
        fitToWidth: 1,
        fitToHeight: 1,
        isFitToPage: false,
        pageOrder: 'downThenOver',
        firstPageNumber: undefined,
        leftHeader: '',
        centerHeader: '',
        rightHeader: '',
        leftFooter: '',
        centerFooter: '',
        rightFooter: '',
        differentFirstPage: false,
        firstPageHeader: '',
        firstPageFooter: '',
        oddAndEvenPagesHeaderFooter: false,
        oddHeader: '',
        oddFooter: '',
        evenHeader: '',
        evenFooter: '',
        headerFooterPresent: false,
        headerFooterExtraAttrsXml: '',
        printOptionsExtraAttrsXml: '',
        pageMarginsExtraAttrsXml: '',
        pageSetupExtraAttrsXml: '',
        fitToPage: false
    };
}

/**
 * CT_Worksheet local names before the print trio (after sheetData).
 * Used so each element inserts immediately after hyperlinks / prior siblings.
 */
export const PRINT_OPTIONS_PREDECESSORS: ReadonlyArray<string> = [
    'sheetCalcPr',
    'sheetProtection',
    'protectedRanges',
    'scenarios',
    'autoFilter',
    'sortState',
    'dataConsolidate',
    'customSheetViews',
    'mergeCells',
    'phoneticPr',
    'conditionalFormatting',
    'dataValidations',
    'hyperlinks'
];

export const PAGE_MARGINS_PREDECESSORS: ReadonlyArray<string> = [...PRINT_OPTIONS_PREDECESSORS, 'printOptions'];

export const PAGE_SETUP_PREDECESSORS: ReadonlyArray<string> = [...PAGE_MARGINS_PREDECESSORS, 'pageMargins'];

export const PAGE_SETUP_SUCCESSORS: ReadonlyArray<string> = [
    'headerFooter',
    'rowBreaks',
    'colBreaks',
    'customProperties',
    'cellWatches',
    'ignoredErrors',
    'smartTags',
    'drawing',
    'legacyDrawing',
    'legacyDrawingHF',
    'drawingHF',
    'picture',
    'oleObjects',
    'controls',
    'webPublishItems',
    'tableParts',
    'extLst'
];

const PO_PRED: Set<string> = new Set(PRINT_OPTIONS_PREDECESSORS);
const PM_PRED: Set<string> = new Set(PAGE_MARGINS_PREDECESSORS);
const PS_PRED: Set<string> = new Set(PAGE_SETUP_PREDECESSORS);
const PS_SUCC: Set<string> = new Set(PAGE_SETUP_SUCCESSORS);

/**
 * findInsertIndex function.
 *
 * @param {string} locals - The locals parameter.
 * @param {string} pred - The pred parameter.
 * @param {string} succ - The succ parameter.
 * @returns {number} - Returns the result.
 */
function findInsertIndex(locals: ReadonlyArray<string>, pred: ReadonlySet<string>, succ: ReadonlySet<string>): number {
    let lastPred: number = -1;
    for (let i: number = 0; i < locals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = locals[i];
        if (name !== undefined && pred.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < locals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = locals[i];
        if (name !== undefined && succ.has(name)) {
            return i;
        }
    }
    return locals.length;
}

/**
 * findPrintOptionsInsertIndex function.
 *
 * @param {string} locals - The locals parameter.
 * @returns {number} - Returns the result.
 */
export function findPrintOptionsInsertIndex(locals: ReadonlyArray<string>): number {
    return findInsertIndex(locals, PO_PRED, new Set(['pageMargins', 'pageSetup', ...PAGE_SETUP_SUCCESSORS]));
}

/**
 * findPageMarginsInsertIndex function.
 *
 * @param {string} locals - The locals parameter.
 * @returns {number} - Returns the result.
 */
export function findPageMarginsInsertIndex(locals: ReadonlyArray<string>): number {
    return findInsertIndex(locals, PM_PRED, new Set(['pageSetup', ...PAGE_SETUP_SUCCESSORS]));
}

/**
 * findPageSetupInsertIndex function.
 *
 * @param {string} locals - The locals parameter.
 * @returns {number} - Returns the result.
 */
export function findPageSetupInsertIndex(locals: ReadonlyArray<string>): number {
    return findInsertIndex(locals, PS_PRED, PS_SUCC);
}

/**
 * CT_Worksheet: headerFooter follows pageSetup (ECMA-376-4 transitional sml.xsd CT_Worksheet).
 *
 * @param {string} locals - The locals parameter.
 * @returns {number} - Returns the result.
 */
export function findHeaderFooterInsertIndex(locals: ReadonlyArray<string>): number {
    const pred: Set<string> = new Set([...PAGE_SETUP_PREDECESSORS, 'pageSetup']);
    const succ: Set<string> = new Set(PAGE_SETUP_SUCCESSORS.filter((name: string): boolean => name !== 'headerFooter'));
    return findInsertIndex(locals, pred, succ);
}

/**
 * Mutable page-setup store.
 *
 * @private
 */
export class PageSetupImpl implements PageSetup {
    private model: PageSetupModel = defaultModel();
    private host: PageSetupHost | undefined;

    /**
     * Creates an instance.
     *
     * @param {PageSetupModel} initial - The initial parameter.
     */
    public constructor(initial?: PageSetupModel) {
        if (initial !== undefined) {
            this.model = cloneModel(initial);
        }
    }

    /**
     * bindHost method.
     *
     * @param {PageSetupHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: PageSetupHost): void {
        this.host = host;
    }

    /**
     * replaceFromParse method.
     *
     * @param {PageSetupModel} model - The model parameter.
     * @returns {void} - Returns the result.
     */
    public replaceFromParse(model: PageSetupModel): void {
        this.model = cloneModel(model);
    }

    /**
     * toModel method.
     *
     * @returns {PageSetupModel} - Returns the result.
     */
    public toModel(): PageSetupModel {
        return cloneModel(this.model);
    }

    /**
     * Gets paperSize.
     *
     * @returns {number} - Returns the result.
     */
    public get paperSize(): number {
        return this.model.paperSize;
    }

    /**
     * Sets paperSize.
     *
     * @param {number} value - The value parameter.
     */
    public set paperSize(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 1) {
            throw new InvalidArgumentError('paperSize must be a finite number >= 1');
        }
        if (!Number.isInteger(value)) {
            throw new InvalidArgumentError('paperSize must be an integer');
        }
        this.ensurePresent();
        this.model = {
            ...this.model,
            paperSize: value,
            pageSetupPresent: true
        };
        this.touch();
    }

    /**
     * Gets orientation.
     *
     * @returns {PageOrientation} - Returns the result.
     */
    public get orientation(): PageOrientation {
        return this.model.orientation;
    }

    /**
     * Sets orientation.
     *
     * @param {PageOrientation} value - The value parameter.
     */
    public set orientation(value: PageOrientation) {
        if (value !== 'default' && value !== 'portrait' && value !== 'landscape') {
            throw new InvalidArgumentError('orientation must be default, portrait, or landscape');
        }
        this.ensurePresent();
        this.model = {
            ...this.model,
            orientation: value,
            pageSetupPresent: true
        };
        this.touch();
    }

    /**
     * Gets margins.
     *
     * @returns {Object} - Returns the result.
     */
    public get margins(): PageMargins | Partial<PageMargins> {
        return this.marginsView();
    }

    /**
     * Sets margins.
     *
     * @param {Object} value - The value parameter.
     */
    public set margins(value: PageMargins | Partial<PageMargins>) {
        if (value === null || typeof value !== 'object') {
            throw new InvalidArgumentError('margins must be an object');
        }
        const next: { left: number; right: number; top: number; bottom: number; header: number; footer: number } = {
            ...this.model.margins
        };
        assignMargin(next, 'left', value.left);
        assignMargin(next, 'right', value.right);
        assignMargin(next, 'top', value.top);
        assignMargin(next, 'bottom', value.bottom);
        assignMargin(next, 'header', value.header);
        assignMargin(next, 'footer', value.footer);
        this.ensurePresent();
        this.model = {
            ...this.model,
            margins: next,
            pageMarginsPresent: true
        };
        this.touch();
    }

    /**
     * Live view so `pageSetup.margins.top = n` writes through to the model.
     *
     * @returns {PageMargins} - Returns the result.
     */
    private marginsView(): PageMargins {
        // eslint-disable-next-line @typescript-eslint/no-this-alias -- view closure needs stable owner ref
        const owner: this = this;
        const write: (key: keyof PageMargins, value: number) => void =
            /**
             * write function.
             *
             * @param {*} key - The key parameter.
             * @param {number} value - The value parameter.
             * @returns {void} - Returns the result.
             */
            (key: keyof PageMargins, value: number): void => {
                const next: { left: number; right: number; top: number; bottom: number; header: number; footer: number } = {
                    ...owner.model.margins
                };
                assignMargin(next, key, value);
                owner.ensurePresent();
                owner.model = {
                    ...owner.model,
                    margins: next,
                    pageMarginsPresent: true
                };
                owner.touch();
            };
        return {
            /**
             * Gets left.
             *
             * @returns {number} - Returns the result.
             */
            get left(): number {
                return owner.model.margins.left;
            },
            /**
             * Sets left.
             *
             * @param {number} value - The value parameter.
             */
            set left(value: number) {
                write('left', value);
            },
            /**
             * Gets right.
             *
             * @returns {number} - Returns the result.
             */
            get right(): number {
                return owner.model.margins.right;
            },
            /**
             * Sets right.
             *
             * @param {number} value - The value parameter.
             */
            set right(value: number) {
                write('right', value);
            },
            /**
             * Gets top.
             *
             * @returns {number} - Returns the result.
             */
            get top(): number {
                return owner.model.margins.top;
            },
            /**
             * Sets top.
             *
             * @param {number} value - The value parameter.
             */
            set top(value: number) {
                write('top', value);
            },
            /**
             * Gets bottom.
             *
             * @returns {number} - Returns the result.
             */
            get bottom(): number {
                return owner.model.margins.bottom;
            },
            /**
             * Sets bottom.
             *
             * @param {number} value - The value parameter.
             */
            set bottom(value: number) {
                write('bottom', value);
            },
            /**
             * Gets header.
             *
             * @returns {number} - Returns the result.
             */
            get header(): number {
                return owner.model.margins.header;
            },
            /**
             * Sets header.
             *
             * @param {number} value - The value parameter.
             */
            set header(value: number) {
                write('header', value);
            },
            /**
             * Gets footer.
             *
             * @returns {number} - Returns the result.
             */
            get footer(): number {
                return owner.model.margins.footer;
            },
            /**
             * Sets footer.
             *
             * @param {number} value - The value parameter.
             */
            set footer(value: number) {
                write('footer', value);
            }
        };
    }

    /**
     * Gets centerHorizontally.
     *
     * @returns {boolean} - Returns the result.
     */
    public get centerHorizontally(): boolean {
        return this.model.centerHorizontally;
    }

    /**
     * Sets centerHorizontally.
     *
     * @param {boolean} value - The value parameter.
     */
    public set centerHorizontally(value: boolean) {
        this.ensurePresent();
        this.model = {
            ...this.model,
            centerHorizontally: Boolean(value),
            printOptionsPresent: true
        };
        this.touch();
    }

    /**
     * Gets centerVertically.
     *
     * @returns {boolean} - Returns the result.
     */
    public get centerVertically(): boolean {
        return this.model.centerVertically;
    }

    /**
     * Sets centerVertically.
     *
     * @param {boolean} value - The value parameter.
     */
    public set centerVertically(value: boolean) {
        this.ensurePresent();
        this.model = {
            ...this.model,
            centerVertically: Boolean(value),
            printOptionsPresent: true
        };
        this.touch();
    }

    /**
     * Gets printGridlines.
     *
     * @returns {boolean} - Returns the result.
     */
    public get printGridlines(): boolean {
        return this.model.printGridlines;
    }

    /**
     * Sets printGridlines.
     *
     * @param {boolean} value - The value parameter.
     */
    public set printGridlines(value: boolean) {
        this.ensurePresent();
        this.model = {
            ...this.model,
            printGridlines: Boolean(value),
            printOptionsPresent: true
        };
        this.touch();
    }

    /**
     * Gets printHeadings.
     *
     * @returns {boolean} - Returns the result.
     */
    public get printHeadings(): boolean {
        return this.model.printHeadings;
    }

    /**
     * Sets printHeadings.
     *
     * @param {boolean} value - The value parameter.
     */
    public set printHeadings(value: boolean) {
        this.ensurePresent();
        this.model = {
            ...this.model,
            printHeadings: Boolean(value),
            printOptionsPresent: true
        };
        this.touch();
    }

    /**
     * Print scale percent (10–400). Retained for OOXML load/save only.
     *
     * @returns {number} - Returns the result.
     */
    public get scale(): number {
        return this.model.scale;
    }

    /**
     * Print scale percent (10–400). Retained for OOXML load/save only.
     *
     * @param {number} value - The value parameter.
     */
    public set scale(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new InvalidArgumentError('scale must be a finite number');
        }
        if (!Number.isInteger(value) || value < 10 || value > 400) {
            throw new InvalidArgumentError('scale must be an integer 10–400');
        }
        this.ensurePresent();
        this.model = {
            ...this.model,
            scale: value,
            pageSetupPresent: true,
            fitToPage: false,
            isFitToPage: false
        };
        this.touch();
    }

    /**
     * Gets fitToWidth.
     *
     * @returns {number} - Returns the result.
     */
    public get fitToWidth(): number {
        return this.model.fitToWidth;
    }

    /**
     * Sets fitToWidth.
     *
     * @param {number} value - The value parameter.
     */
    public set fitToWidth(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new InvalidArgumentError('fitToWidth must be a finite number');
        }
        if (!Number.isInteger(value) || value < 0) {
            throw new InvalidArgumentError('fitToWidth must be an integer >= 0');
        }
        this.ensurePresent();
        this.model = {
            ...this.model,
            fitToWidth: value,
            pageSetupPresent: true,
            fitToPage: true,
            isFitToPage: true
        };
        this.touch();
    }

    /**
     * Gets fitToHeight.
     *
     * @returns {number} - Returns the result.
     */
    public get fitToHeight(): number {
        return this.model.fitToHeight;
    }

    /**
     * Sets fitToHeight.
     *
     * @param {number} value - The value parameter.
     */
    public set fitToHeight(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new InvalidArgumentError('fitToHeight must be a finite number');
        }
        if (!Number.isInteger(value) || value < 0) {
            throw new InvalidArgumentError('fitToHeight must be an integer >= 0');
        }
        this.ensurePresent();
        this.model = {
            ...this.model,
            fitToHeight: value,
            pageSetupPresent: true,
            fitToPage: true,
            isFitToPage: true
        };
        this.touch();
    }

    /**
     * Gets isFitToPage.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isFitToPage(): boolean {
        return this.model.isFitToPage;
    }
    /**
     * Sets isFitToPage.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isFitToPage(value: boolean) {
        this.ensurePresent();
        this.model = { ...this.model, isFitToPage: Boolean(value), pageSetupPresent: true };
        this.touch();
    }

    /**
     * Gets firstPageNumber.
     *
     * @returns {number} - Returns the result.
     */
    public get firstPageNumber(): number | undefined {
        return this.model.firstPageNumber;
    }
    /**
     * Sets firstPageNumber.
     *
     * @param {number} value - The value parameter.
     */
    public set firstPageNumber(value: number | undefined) {
        if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
            throw new InvalidArgumentError('firstPageNumber must be an integer >= 1');
        }
        this.ensurePresent();
        this.model = { ...this.model, firstPageNumber: value, pageSetupPresent: true };
        this.touch();
    }

    /**
     * Gets leftHeader.
     *
     * @returns {string} - Returns the result.
     */
    public get leftHeader(): string {
        return this.model.leftHeader;
    }
    /**
     * Sets leftHeader.
     *
     * @param {string} value - The value parameter.
     */
    public set leftHeader(value: string) {
        this.setHeaderFooter('leftHeader', value);
    }
    /**
     * Gets centerHeader.
     *
     * @returns {string} - Returns the result.
     */
    public get centerHeader(): string {
        return this.model.centerHeader;
    }
    /**
     * Sets centerHeader.
     *
     * @param {string} value - The value parameter.
     */
    public set centerHeader(value: string) {
        this.setHeaderFooter('centerHeader', value);
    }
    /**
     * Gets rightHeader.
     *
     * @returns {string} - Returns the result.
     */
    public get rightHeader(): string {
        return this.model.rightHeader;
    }
    /**
     * Sets rightHeader.
     *
     * @param {string} value - The value parameter.
     */
    public set rightHeader(value: string) {
        this.setHeaderFooter('rightHeader', value);
    }
    /**
     * Gets leftFooter.
     *
     * @returns {string} - Returns the result.
     */
    public get leftFooter(): string {
        return this.model.leftFooter;
    }
    /**
     * Sets leftFooter.
     *
     * @param {string} value - The value parameter.
     */
    public set leftFooter(value: string) {
        this.setHeaderFooter('leftFooter', value);
    }
    /**
     * Gets centerFooter.
     *
     * @returns {string} - Returns the result.
     */
    public get centerFooter(): string {
        return this.model.centerFooter;
    }
    /**
     * Sets centerFooter.
     *
     * @param {string} value - The value parameter.
     */
    public set centerFooter(value: string) {
        this.setHeaderFooter('centerFooter', value);
    }
    /**
     * Gets rightFooter.
     *
     * @returns {string} - Returns the result.
     */
    public get rightFooter(): string {
        return this.model.rightFooter;
    }
    /**
     * Sets rightFooter.
     *
     * @param {string} value - The value parameter.
     */
    public set rightFooter(value: string) {
        this.setHeaderFooter('rightFooter', value);
    }
    /**
     * Gets differentFirstPage.
     *
     * @returns {boolean} - Returns the result.
     */
    public get differentFirstPage(): boolean {
        return this.model.differentFirstPage;
    }
    /**
     * Sets differentFirstPage.
     *
     * @param {boolean} value - The value parameter.
     */
    public set differentFirstPage(value: boolean) {
        this.setHeaderFooter('differentFirstPage', Boolean(value));
    }
    /**
     * First-page L/C/R header and footer sections (Excel / XlsIO `FirstPage.*`).
     *
     * @returns {PageHeaderFooter} - Returns the result.
     */
    public get firstPage(): PageHeaderFooter {
        return this.pageHeaderFooterView('first');
    }
    /**
     * Gets firstPageHeader.
     *
     * @returns {string} - Returns the result.
     */
    public get firstPageHeader(): string {
        return this.model.firstPageHeader;
    }
    /**
     * Sets firstPageHeader.
     *
     * @param {string} value - The value parameter.
     */
    public set firstPageHeader(value: string) {
        this.setHeaderFooter('firstPageHeader', value);
    }
    /**
     * Gets firstPageFooter.
     *
     * @returns {string} - Returns the result.
     */
    public get firstPageFooter(): string {
        return this.model.firstPageFooter;
    }
    /**
     * Sets firstPageFooter.
     *
     * @param {string} value - The value parameter.
     */
    public set firstPageFooter(value: string) {
        this.setHeaderFooter('firstPageFooter', value);
    }
    /**
     * Gets oddAndEvenPagesHeaderFooter.
     *
     * @returns {boolean} - Returns the result.
     */
    public get oddAndEvenPagesHeaderFooter(): boolean {
        return this.model.oddAndEvenPagesHeaderFooter;
    }
    /**
     * Sets oddAndEvenPagesHeaderFooter.
     *
     * @param {boolean} value - The value parameter.
     */
    public set oddAndEvenPagesHeaderFooter(value: boolean) {
        this.setHeaderFooter('oddAndEvenPagesHeaderFooter', Boolean(value));
    }
    /**
     * Odd-page L/C/R sections. Falls back to default left/center/right when raw odd strings are empty.
     *
     * @returns {PageHeaderFooter} - Returns the result.
     */
    public get oddPage(): PageHeaderFooter {
        return this.pageHeaderFooterView('odd');
    }
    /**
     * Even-page L/C/R header and footer sections (Excel / XlsIO `EvenPage.*`).
     *
     * @returns {PageHeaderFooter} - Returns the result.
     */
    public get evenPage(): PageHeaderFooter {
        return this.pageHeaderFooterView('even');
    }
    /**
     * Gets oddHeader.
     *
     * @returns {string} - Returns the result.
     */
    public get oddHeader(): string {
        return this.model.oddHeader;
    }
    /**
     * Sets oddHeader.
     *
     * @param {string} value - The value parameter.
     */
    public set oddHeader(value: string) {
        this.setHeaderFooter('oddHeader', value);
    }
    /**
     * Gets oddFooter.
     *
     * @returns {string} - Returns the result.
     */
    public get oddFooter(): string {
        return this.model.oddFooter;
    }
    /**
     * Sets oddFooter.
     *
     * @param {string} value - The value parameter.
     */
    public set oddFooter(value: string) {
        this.setHeaderFooter('oddFooter', value);
    }
    /**
     * Gets evenHeader.
     *
     * @returns {string} - Returns the result.
     */
    public get evenHeader(): string {
        return this.model.evenHeader;
    }
    /**
     * Sets evenHeader.
     *
     * @param {string} value - The value parameter.
     */
    public set evenHeader(value: string) {
        this.setHeaderFooter('evenHeader', value);
    }
    /**
     * Gets evenFooter.
     *
     * @returns {string} - Returns the result.
     */
    public get evenFooter(): string {
        return this.model.evenFooter;
    }
    /**
     * Sets evenFooter.
     *
     * @param {string} value - The value parameter.
     */
    public set evenFooter(value: string) {
        this.setHeaderFooter('evenFooter', value);
    }

    /**
     * pageHeaderFooterView method.
     *
     * @param {Object} kind - The kind parameter.
     * @returns {PageHeaderFooter} - Returns the result.
     */
    private pageHeaderFooterView(kind: 'first' | 'odd' | 'even'): PageHeaderFooter {
        // eslint-disable-next-line @typescript-eslint/no-this-alias -- view closure needs stable owner ref
        const owner: this = this;
        const read: any =
            /**
             * read function.
             *
             * @returns {any} - Returns the result.
             */
            (): {
                leftHeader: string;
                centerHeader: string;
                rightHeader: string;
                leftFooter: string;
                centerFooter: string;
                rightFooter: string;
            } => {
                if (kind === 'first') {
                    return {
                        ...splitHeaderFooterSections(owner.model.firstPageHeader),
                        ...mapFooterSections(splitHeaderFooterSections(owner.model.firstPageFooter))
                    };
                }
                if (kind === 'even') {
                    return {
                        ...splitHeaderFooterSections(owner.model.evenHeader),
                        ...mapFooterSections(splitHeaderFooterSections(owner.model.evenFooter))
                    };
                }
                // odd: prefer dedicated oddHeader/oddFooter; else default sheet L/C/R props
                const headerSource: { leftHeader: string; centerHeader: string; rightHeader: string } =
                    owner.model.oddHeader.length > 0
                        ? splitHeaderFooterSections(owner.model.oddHeader)
                        : {
                            leftHeader: owner.model.leftHeader,
                            centerHeader: owner.model.centerHeader,
                            rightHeader: owner.model.rightHeader
                        };
                const footerSource: { leftFooter: string; centerFooter: string; rightFooter: string } =
                    owner.model.oddFooter.length > 0
                        ? mapFooterSections(splitHeaderFooterSections(owner.model.oddFooter))
                        : {
                            leftFooter: owner.model.leftFooter,
                            centerFooter: owner.model.centerFooter,
                            rightFooter: owner.model.rightFooter
                        };
                return { ...headerSource, ...footerSource };
            };
        const writeSection: (section: keyof PageHeaderFooter, value: string) => void =
            /**
             * writeSection function.
             *
             * @param {*} section - The section parameter.
             * @param {string} value - The value parameter.
             * @returns {void} - Returns the result.
             */
            (section: keyof PageHeaderFooter, value: string): void => {
                if (typeof value !== 'string') {
                    throw new InvalidArgumentError(`${kind}Page.${section} must be a string`);
                }
                const current: any = read();
                // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
                current[section] = value;
                owner.ensurePresent();
                if (kind === 'first') {
                    owner.model = {
                        ...owner.model,
                        firstPageHeader: composeHeaderFooterSections(current.leftHeader, current.centerHeader, current.rightHeader),
                        firstPageFooter: composeHeaderFooterSections(current.leftFooter, current.centerFooter, current.rightFooter),
                        differentFirstPage: true,
                        headerFooterPresent: true
                    };
                } else if (kind === 'even') {
                    owner.model = {
                        ...owner.model,
                        evenHeader: composeHeaderFooterSections(current.leftHeader, current.centerHeader, current.rightHeader),
                        evenFooter: composeHeaderFooterSections(current.leftFooter, current.centerFooter, current.rightFooter),
                        oddAndEvenPagesHeaderFooter: true,
                        headerFooterPresent: true
                    };
                } else {
                    // Writing oddPage sections authors oddHeader/oddFooter wire strings
                    // and enables different odd/even so Excel uses them.
                    owner.model = {
                        ...owner.model,
                        oddHeader: composeHeaderFooterSections(current.leftHeader, current.centerHeader, current.rightHeader),
                        oddFooter: composeHeaderFooterSections(current.leftFooter, current.centerFooter, current.rightFooter),
                        oddAndEvenPagesHeaderFooter: true,
                        headerFooterPresent: true
                    };
                }
                owner.touch();
            };
        return {
            /**
             * Gets leftHeader.
             *
             * @returns {string} - Returns the result.
             */
            get leftHeader(): string {
                return read().leftHeader;
            },
            /**
             * Sets leftHeader.
             *
             * @param {string} value - The value parameter.
             */
            set leftHeader(value: string) {
                writeSection('leftHeader', value);
            },
            /**
             * Gets centerHeader.
             *
             * @returns {string} - Returns the result.
             */
            get centerHeader(): string {
                return read().centerHeader;
            },
            /**
             * Sets centerHeader.
             *
             * @param {string} value - The value parameter.
             */
            set centerHeader(value: string) {
                writeSection('centerHeader', value);
            },
            /**
             * Gets rightHeader.
             *
             * @returns {string} - Returns the result.
             */
            get rightHeader(): string {
                return read().rightHeader;
            },
            /**
             * Sets rightHeader.
             *
             * @param {string} value - The value parameter.
             */
            set rightHeader(value: string) {
                writeSection('rightHeader', value);
            },
            /**
             * Gets leftFooter.
             *
             * @returns {string} - Returns the result.
             */
            get leftFooter(): string {
                return read().leftFooter;
            },
            /**
             * Sets leftFooter.
             *
             * @param {string} value - The value parameter.
             */
            set leftFooter(value: string) {
                writeSection('leftFooter', value);
            },
            /**
             * Gets centerFooter.
             *
             * @returns {string} - Returns the result.
             */
            get centerFooter(): string {
                return read().centerFooter;
            },
            /**
             * Sets centerFooter.
             *
             * @param {string} value - The value parameter.
             */
            set centerFooter(value: string) {
                writeSection('centerFooter', value);
            },
            /**
             * Gets rightFooter.
             *
             * @returns {string} - Returns the result.
             */
            get rightFooter(): string {
                return read().rightFooter;
            },
            /**
             * Sets rightFooter.
             *
             * @param {string} value - The value parameter.
             */
            set rightFooter(value: string) {
                writeSection('rightFooter', value);
            }
        };
    }
    /**
     * Gets printArea.
     *
     * @returns {string} - Returns the result.
     */
    public get printArea(): string | undefined {
        return this.host == null ? undefined : this.host.getPrintName('Print_Area');
    }
    /**
     * Sets printArea.
     *
     * @param {string} value - The value parameter.
     */
    public set printArea(value: string | undefined) {
        if (this.host != null) {
            this.host.setPrintName('Print_Area', value);
        }
        this.touch();
    }
    /**
     * Gets printTitleRows.
     *
     * @returns {string} - Returns the result.
     */
    public get printTitleRows(): string | undefined {
        return splitPrintTitles(this.host == null ? undefined : this.host.getPrintName('Print_Titles')).rows;
    }
    /**
     * Sets printTitleRows.
     *
     * @param {string} value - The value parameter.
     */
    public set printTitleRows(value: string | undefined) {
        this.setPrintTitles(value, 'rows');
        this.touch();
    }
    /**
     * Gets printTitleColumns.
     *
     * @returns {string} - Returns the result.
     */
    public get printTitleColumns(): string | undefined {
        return splitPrintTitles(this.host == null ? undefined : this.host.getPrintName('Print_Titles')).columns;
    }
    /**
     * Sets printTitleColumns.
     *
     * @param {string} value - The value parameter.
     */
    public set printTitleColumns(value: string | undefined) {
        this.setPrintTitles(value, 'columns');
        this.touch();
    }

    /**
     * setPrintTitles method.
     *
     * @param {string} value - The value parameter.
     * @param {Object} kind - The kind parameter.
     * @returns {void} - Returns the result.
     */
    private setPrintTitles(value: string | undefined, kind: 'rows' | 'columns'): void {
        const current: { rows: string; columns: string } = splitPrintTitles(
            this.host == null ? undefined : this.host.getPrintName('Print_Titles')
        );
        const next: { rows: string; columns: string } =
            kind === 'rows' ? { rows: value, columns: current.columns } : { rows: current.rows, columns: value };
        const content: string = [next.rows, next.columns]
            .filter((entry: string): entry is string => entry !== undefined && entry.length > 0)
            .join(',');
        if (this.host != null) {
            this.host.setPrintName('Print_Titles', content || undefined);
        }
    }

    /**
     * Gets pageOrder.
     *
     * @returns {PageOrder} - Returns the result.
     */
    public get pageOrder(): PageOrder {
        return this.model.pageOrder;
    }

    /**
     * Sets pageOrder.
     *
     * @param {PageOrder} value - The value parameter.
     */
    public set pageOrder(value: PageOrder) {
        if (value !== 'downThenOver' && value !== 'overThenDown') {
            throw new InvalidArgumentError('pageOrder must be downThenOver or overThenDown');
        }
        this.ensurePresent();
        this.model = {
            ...this.model,
            pageOrder: value,
            pageSetupPresent: true
        };
        this.touch();
    }

    /**
     * setHeaderFooter method.
     *
     * @param {any} key - The key parameter.
     * @param {Object} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    private setHeaderFooter(
        key:
        | 'leftHeader'
        | 'centerHeader'
        | 'rightHeader'
        | 'leftFooter'
        | 'centerFooter'
        | 'rightFooter'
        | 'differentFirstPage'
        | 'firstPageHeader'
        | 'firstPageFooter'
        | 'oddAndEvenPagesHeaderFooter'
        | 'oddHeader'
        | 'oddFooter'
        | 'evenHeader'
        | 'evenFooter',
        value: string | boolean
    ): void {
        if ((key.endsWith('Header') || key.endsWith('Footer')) && typeof value !== 'string') {
            throw new InvalidArgumentError(`${key} must be a string`);
        }
        this.ensurePresent();
        this.model = { ...this.model, [key]: value, headerFooterPresent: true };
        this.touch();
    }

    /**
     * ensurePresent method.
     *
     * @returns {void} - Returns the result.
     */
    private ensurePresent(): void {
        if (!this.model.present) {
            this.model = { ...this.model, present: true };
        }
    }

    /**
     * touch method.
     *
     * @returns {void} - Returns the result.
     */
    private touch(): void {
        if (this.host != null) {
            this.host.markDirty();
        }
    }
}

/**
 * Merge parse results for the three optional elements into one model.
 *
 * @param {*} parts - parts value.
 * @returns {PageSetupModel} Function result.
 */
export function mergePageSetupParse(parts: {
    printOptionsXml?: string;
    pageMarginsXml?: string;
    pageSetupXml?: string;
    headerFooterXml?: string;
}): PageSetupModel {
    let model: PageSetupModel = defaultModel();
    if (parts.printOptionsXml !== undefined) {
        model = applyPrintOptionsXml(model, parts.printOptionsXml);
    }
    if (parts.pageMarginsXml !== undefined) {
        model = applyPageMarginsXml(model, parts.pageMarginsXml);
    }
    if (parts.pageSetupXml !== undefined) {
        model = applyPageSetupXml(model, parts.pageSetupXml);
    }
    if (parts.headerFooterXml !== undefined) {
        model = applyHeaderFooterXml(model, parts.headerFooterXml);
    }
    if (
        parts.printOptionsXml !== undefined ||
        parts.pageMarginsXml !== undefined ||
        parts.pageSetupXml !== undefined ||
        parts.headerFooterXml !== undefined
    ) {
        model = { ...model, present: true };
    }
    return model;
}

/**
 * Serialize print trio to ordered element strings (omit empty).
 *
 * @param {PageSetupModel} model - The model parameter.
 * @returns {any} - Returns the result.
 */
export function serializePageSetupElements(model: PageSetupModel): {
    printOptionsXml: string | undefined;
    pageMarginsXml: string | undefined;
    headerFooterXml: string | undefined;
    pageSetupXml: string | undefined;
} {
    if (!model.present) {
        return {
            printOptionsXml: undefined,
            pageMarginsXml: undefined,
            headerFooterXml: undefined,
            pageSetupXml: undefined
        };
    }
    return {
        printOptionsXml: serializePrintOptions(model),
        pageMarginsXml: serializePageMargins(model),
        headerFooterXml: serializeHeaderFooter(model),
        pageSetupXml: serializePageSetupEl(model)
    };
}

/**
 * applyPrintOptionsXml function.
 *
 * @param {PageSetupModel} model - The model parameter.
 * @param {string} xml - The xml parameter.
 * @returns {PageSetupModel} - Returns the result.
 */
function applyPrintOptionsXml(model: PageSetupModel, xml: string): PageSetupModel {
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(xml));
    const extra: string = attrsToXmlExcluding(
        attrs,
        new Set(['horizontalCentered', 'verticalCentered', 'headings', 'gridLines', 'gridLinesSet'])
    );
    return {
        ...model,
        printOptionsPresent: true,
        centerHorizontally: parseBool(attrs.get('horizontalCentered'), false),
        centerVertically: parseBool(attrs.get('verticalCentered'), false),
        printHeadings: parseBool(attrs.get('headings'), false),
        printGridlines: parseBool(attrs.get('gridLines'), false),
        printOptionsExtraAttrsXml: extra
    };
}

/**
 * applyPageMarginsXml function.
 *
 * @param {PageSetupModel} model - The model parameter.
 * @param {string} xml - The xml parameter.
 * @returns {PageSetupModel} - Returns the result.
 */
function applyPageMarginsXml(model: PageSetupModel, xml: string): PageSetupModel {
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(xml));
    const margins: PageMargins = defaultMargins();
    margins.left = parseInchAttr(attrs.get('left'), DEFAULT_MARGIN_IN.left);
    margins.right = parseInchAttr(attrs.get('right'), DEFAULT_MARGIN_IN.right);
    margins.top = parseInchAttr(attrs.get('top'), DEFAULT_MARGIN_IN.top);
    margins.bottom = parseInchAttr(attrs.get('bottom'), DEFAULT_MARGIN_IN.bottom);
    margins.header = parseInchAttr(attrs.get('header'), DEFAULT_MARGIN_IN.header);
    margins.footer = parseInchAttr(attrs.get('footer'), DEFAULT_MARGIN_IN.footer);
    const extra: string = attrsToXmlExcluding(attrs, new Set(['left', 'right', 'top', 'bottom', 'header', 'footer']));
    return {
        ...model,
        pageMarginsPresent: true,
        margins,
        pageMarginsExtraAttrsXml: extra
    };
}

/**
 * applyPageSetupXml function.
 *
 * @param {PageSetupModel} model - The model parameter.
 * @param {string} xml - The xml parameter.
 * @returns {PageSetupModel} - Returns the result.
 */
function applyPageSetupXml(model: PageSetupModel, xml: string): PageSetupModel {
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(xml));
    const paperSize: number = parseUint(attrs.get('paperSize'), PaperSize.Letter);
    const orientation: PageOrientation = parseOrientation(attrs.get('orientation'));
    const scale: number = parseUint(attrs.get('scale'), 100);
    const fitToWidth: number = parseUint(attrs.get('fitToWidth'), 1);
    const fitToHeight: number = parseUint(attrs.get('fitToHeight'), 1);
    const pageOrder: PageOrder = parsePageOrder(attrs.get('pageOrder'));
    const firstPageNumber: number = attrs.has('firstPageNumber') ? parseUint(attrs.get('firstPageNumber'), 1) : undefined;
    const fitToPage: boolean = attrs.has('fitToWidth') || attrs.has('fitToHeight') || parseBool(attrs.get('fitToPage'), false);
    const extra: string = attrsToXmlExcluding(
        attrs,
        new Set(['paperSize', 'orientation', 'scale', 'fitToWidth', 'fitToHeight', 'pageOrder', 'fitToPage', 'firstPageNumber'])
    );
    return {
        ...model,
        pageSetupPresent: true,
        paperSize,
        orientation,
        scale,
        fitToWidth,
        fitToHeight,
        pageOrder,
        fitToPage,
        isFitToPage: fitToPage,
        firstPageNumber,
        pageSetupExtraAttrsXml: extra
    };
}

/**
 * serializePrintOptions function.
 *
 * @param {PageSetupModel} model - The model parameter.
 * @returns {string} - Returns the result.
 */
function serializePrintOptions(model: PageSetupModel): string | undefined {
    const nonDefault: boolean = model.centerHorizontally || model.centerVertically || model.printGridlines || model.printHeadings;
    const hasExtra: boolean = model.printOptionsExtraAttrsXml.trim().length > 0;
    if (!model.printOptionsPresent && !nonDefault && !hasExtra) {
        return undefined;
    }
    // If present on load with all defaults, still re-emit empty-ish element only
    // when extras or non-defaults exist; pure default present can omit.
    if (!nonDefault && !hasExtra) {
        return undefined;
    }
    const attrs: string[] = [];
    if (model.centerHorizontally) {
        attrs.push('horizontalCentered="1"');
    }
    if (model.centerVertically) {
        attrs.push('verticalCentered="1"');
    }
    if (model.printHeadings) {
        attrs.push('headings="1"');
    }
    if (model.printGridlines) {
        attrs.push('gridLines="1"');
    }
    if (hasExtra) {
        attrs.push(model.printOptionsExtraAttrsXml.trim());
    }
    if (attrs.length === 0) {
        return '<printOptions/>';
    }
    return `<printOptions ${attrs.join(' ')}/>`;
}

/**
 * serializePageMargins function.
 *
 * @param {PageSetupModel} model - The model parameter.
 * @returns {string} - Returns the result.
 */
function serializePageMargins(model: PageSetupModel): string | undefined {
    // Schema requires all six when element is present. Emit whenever setup is
    // active (present) so Excel gets a complete margin set after any page edit.
    if (!model.present && !model.pageMarginsPresent) {
        return undefined;
    }
    // Only emit when we have margins presence or any page setup activity.
    if (!model.pageMarginsPresent && !model.pageSetupPresent && !model.printOptionsPresent) {
        // present flag alone from empty authoring of a bool still needs margins
        // once any property was set — ensurePresent + flags cover that.
    }
    if (!model.pageMarginsPresent && !model.pageSetupPresent && !model.printOptionsPresent && !model.present) {
        return undefined;
    }
    // Always emit margins when model.present (any authoring/load).
    if (!model.present) {
        return undefined;
    }
    const m: PageMargins = model.margins;
    const attrs: string[] = [
        `left="${formatInchesAttr(pointsToInches(m.left))}"`,
        `right="${formatInchesAttr(pointsToInches(m.right))}"`,
        `top="${formatInchesAttr(pointsToInches(m.top))}"`,
        `bottom="${formatInchesAttr(pointsToInches(m.bottom))}"`,
        `header="${formatInchesAttr(pointsToInches(m.header))}"`,
        `footer="${formatInchesAttr(pointsToInches(m.footer))}"`
    ];
    if (model.pageMarginsExtraAttrsXml.trim().length > 0) {
        attrs.push(model.pageMarginsExtraAttrsXml.trim());
    }
    return `<pageMargins ${attrs.join(' ')}/>`;
}

/**
 * serializePageSetupEl function.
 *
 * @param {PageSetupModel} model - The model parameter.
 * @returns {string} - Returns the result.
 */
function serializePageSetupEl(model: PageSetupModel): string | undefined {
    const nonDefault: boolean =
        model.paperSize !== PaperSize.Letter ||
        model.orientation !== 'default' ||
        model.scale !== 100 ||
        model.fitToWidth !== 1 ||
        model.fitToHeight !== 1 ||
        model.pageOrder !== 'downThenOver' ||
        model.fitToPage ||
        model.firstPageNumber !== undefined;
    const hasExtra: boolean = model.pageSetupExtraAttrsXml.trim().length > 0;
    if (!model.pageSetupPresent && !nonDefault && !hasExtra) {
        return undefined;
    }
    if (!nonDefault && !hasExtra && !model.pageSetupPresent) {
        return undefined;
    }
    // Emit when present on load even if defaults — preserves element existence
    // only when pageSetupPresent or non-default.
    if (!model.pageSetupPresent && !nonDefault && !hasExtra) {
        return undefined;
    }
    const attrs: string[] = [];
    if (model.paperSize !== PaperSize.Letter || model.pageSetupPresent) {
        // Always write paperSize when emitting pageSetup (Excel-friendly).
        attrs.push(`paperSize="${String(model.paperSize)}"`);
    }
    if (model.orientation !== 'default') {
        attrs.push(`orientation="${model.orientation}"`);
    }
    if (model.fitToPage) {
        attrs.push(`fitToWidth="${String(model.fitToWidth)}"`);
        attrs.push(`fitToHeight="${String(model.fitToHeight)}"`);
    } else if (model.scale !== 100) {
        attrs.push(`scale="${String(model.scale)}"`);
    } else if (model.pageSetupPresent && model.scale === 100) {
        // keep scale optional at default
    }
    if (model.pageOrder !== 'downThenOver') {
        attrs.push(`pageOrder="${model.pageOrder}"`);
    }
    if (model.firstPageNumber !== undefined) {
        attrs.push(`firstPageNumber="${String(model.firstPageNumber)}"`);
    }
    if (model.isFitToPage && !model.fitToPage) {
        attrs.push('fitToPage="1"');
    }
    if (hasExtra) {
        attrs.push(model.pageSetupExtraAttrsXml.trim());
    }
    // Ensure we always have paperSize when we decided to emit.
    if (!attrs.some((a: string): boolean => a.startsWith('paperSize='))) {
        attrs.unshift(`paperSize="${String(model.paperSize)}"`);
    }
    return `<pageSetup ${attrs.join(' ')}/>`;
}

/**
 * applyHeaderFooterXml function.
 *
 * @param {PageSetupModel} model - The model parameter.
 * @param {string} xml - The xml parameter.
 * @returns {PageSetupModel} - Returns the result.
 */
function applyHeaderFooterXml(model: PageSetupModel, xml: string): PageSetupModel {
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(xml));
    const value: (name: string) => string =
        /**
         * value function.
         *
         * @param {string} name - The name parameter.
         * @returns {string} - Returns the result.
         */
        (name: string): string => unescapeXml(elementText(xml, name));
    const oddHeader: string = value('oddHeader');
    const oddFooter: string = value('oddFooter');
    return {
        ...model,
        headerFooterPresent: true,
        differentFirstPage: parseBool(attrs.get('differentFirst'), false),
        oddAndEvenPagesHeaderFooter: parseBool(attrs.get('differentOddEven'), false),
        leftHeader: headerSection(oddHeader, 'L'),
        centerHeader: headerSection(oddHeader, 'C') || (oddHeader.includes('&L') || oddHeader.includes('&R') ? '' : oddHeader),
        rightHeader: headerSection(oddHeader, 'R'),
        leftFooter: headerSection(oddFooter, 'L'),
        centerFooter: headerSection(oddFooter, 'C') || (oddFooter.includes('&L') || oddFooter.includes('&R') ? '' : oddFooter),
        rightFooter: headerSection(oddFooter, 'R'),
        firstPageHeader: value('firstHeader'),
        firstPageFooter: value('firstFooter'),
        oddHeader: value('oddHeader'),
        oddFooter: value('oddFooter'),
        evenHeader: value('evenHeader'),
        evenFooter: value('evenFooter'),
        headerFooterExtraAttrsXml: attrsToXmlExcluding(attrs, new Set(['differentFirst', 'differentOddEven']))
    };
}

/**
 * serializeHeaderFooter function.
 *
 * @param {PageSetupModel} model - The model parameter.
 * @returns {string} - Returns the result.
 */
function serializeHeaderFooter(model: PageSetupModel): string | undefined {
    const hasValues: string | true =
        model.leftHeader ||
        model.centerHeader ||
        model.rightHeader ||
        model.leftFooter ||
        model.centerFooter ||
        model.rightFooter ||
        model.firstPageHeader ||
        model.firstPageFooter ||
        model.oddHeader ||
        model.oddFooter ||
        model.evenHeader ||
        model.evenFooter ||
        model.differentFirstPage ||
        model.oddAndEvenPagesHeaderFooter ||
        model.headerFooterExtraAttrsXml;
    if (!model.headerFooterPresent && !hasValues) {
        return undefined;
    }
    const attrs: string[] = [];
    if (model.differentFirstPage) {
        attrs.push('differentFirst="1"');
    }
    if (model.oddAndEvenPagesHeaderFooter) {
        attrs.push('differentOddEven="1"');
    }
    if (model.headerFooterExtraAttrsXml) {
        attrs.push(model.headerFooterExtraAttrsXml);
    }
    const child: (name: string, text: string) => string =
        /**
         * child function.
         *
         * @param {string} name - The name parameter.
         * @param {string} text - The text parameter.
         * @returns {string} - Returns the result.
         */
        (name: string, text: string): string => (text ? `<${name}>${escapeXml(text)}</${name}>` : '');
    const sections: (left: string, center: string, right: string) => string =
        /**
         * sections function.
         *
         * @param {string} left - The left parameter.
         * @param {string} center - The center parameter.
         * @param {string} right - The right parameter.
         * @returns {string} - Returns the result.
         */
        (left: string, center: string, right: string): string =>
            `${left ? `&L${left}` : ''}${center ? `&C${center}` : ''}${right ? `&R${right}` : ''}`;
    return (
        `<headerFooter${attrs.length ? ` ${attrs.join(' ')}` : ''}>` +
        child('oddHeader', model.oddHeader || sections(model.leftHeader, model.centerHeader, model.rightHeader)) +
        child('oddFooter', model.oddFooter || sections(model.leftFooter, model.centerFooter, model.rightFooter)) +
        child('evenHeader', model.evenHeader) +
        child('evenFooter', model.evenFooter) +
        child('firstHeader', model.firstPageHeader) +
        child('firstFooter', model.firstPageFooter) +
        '</headerFooter>'
    );
}

/**
 * headerSection function.
 *
 * @param {string} value - The value parameter.
 * @param {Object} section - The section parameter.
 * @returns {string} - Returns the result.
 */
function headerSection(value: string, section: 'L' | 'C' | 'R'): string {
    const marker: string = `&${section}`;
    const start: number = value.indexOf(marker);
    if (start < 0) {
        return '';
    }
    const contentStart: number = start + marker.length;
    const next: number = value.slice(contentStart).search(/&[LCR]/);
    return value.slice(contentStart, next < 0 ? undefined : contentStart + next);
}

/**
 * Split a full header/footer wire string into L/C/R sections. Unmarked text (no `&L`/`&C`/`&R`) is treated as center content (Excel default).
 *
 * @param {string} value - The value parameter.
 * @returns {Object} - Returns the result.
 */
function splitHeaderFooterSections(value: string): {
    leftHeader: string;
    centerHeader: string;
    rightHeader: string;
} {
    if (value.length === 0) {
        return { leftHeader: '', centerHeader: '', rightHeader: '' };
    }
    const left: string = headerSection(value, 'L');
    const right: string = headerSection(value, 'R');
    const center: string = headerSection(value, 'C') || (value.includes('&L') || value.includes('&R') ? '' : value);
    return { leftHeader: left, centerHeader: center, rightHeader: right };
}

/**
 * Re-key header split result as footer section names.
 *
 * @param {*} sections - sections value.
 * @returns {*} Function result.
 */
function mapFooterSections(sections: { leftHeader: string; centerHeader: string; rightHeader: string }): {
    leftFooter: string;
    centerFooter: string;
    rightFooter: string;
} {
    return {
        leftFooter: sections.leftHeader,
        centerFooter: sections.centerHeader,
        rightFooter: sections.rightHeader
    };
}

/**
 * Compose L/C/R section text into an Excel header/footer wire string.
 *
 * @param {string} left - The left parameter.
 * @param {string} center - The center parameter.
 * @param {string} right - The right parameter.
 * @returns {string} - Returns the result.
 */
function composeHeaderFooterSections(left: string, center: string, right: string): string {
    return `${left ? `&L${left}` : ''}${center ? `&C${center}` : ''}${right ? `&R${right}` : ''}`;
}

/**
 * elementText function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} name - The name parameter.
 * @returns {string} - Returns the result.
 */
function elementText(xml: string, name: string): string {
    const escapedName: string = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const match: RegExpExecArray = new RegExp(`<[^>]*${escapedName}[^>]*>([\\s\\S]*?)</[^>]*${escapedName}>`).exec(xml);
    return ((__t: string): string => (__t != null ? __t : ''))(match == null ? undefined : match[1]);
}

/**
 * splitPrintTitles function.
 *
 * @param {string} content - The content parameter.
 * @returns {Object} - Returns the result.
 */
function splitPrintTitles(content: string | undefined): {
    rows: string | undefined;
    columns: string | undefined;
} {
    if (content === undefined || content.length === 0) {
        return { rows: undefined, columns: undefined };
    }
    const parts: string[] = content.split(',');
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const rows: string = parts.filter((part: string): boolean => /\$\d+(?::\$\d+)?$/.test(part)).join(',') || undefined;
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const columns: string = parts.filter((part: string): boolean => /\$[A-Z]+(?::\$[A-Z]+)?$/.test(part)).join(',') || undefined;
    return { rows, columns };
}

/**
 * assignMargin function.
 *
 * @param {PageMargins} target - The target parameter.
 * @param {*} key - The key parameter.
 * @param {number} value - The value parameter.
 * @returns {void} - Returns the result.
 */
function assignMargin(target: PageMargins, key: keyof PageMargins, value: number | undefined): void {
    if (value === undefined) {
        return;
    }
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        throw new InvalidArgumentError(`margins.${key} must be a finite number of points (>= 0; 72 points = 1 inch)`);
    }
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    target[key] = value;
}

/**
 * Parse a `pageMargins` inches attribute into public points.
 *
 * @param {string} raw - The raw parameter.
 * @param {number} fallbackInches - The fallbackInches parameter.
 * @returns {number} - Returns the result.
 */
function parseInchAttr(raw: string | undefined, fallbackInches: number): number {
    if (raw === undefined || raw.trim().length === 0) {
        return inchesToPoints(fallbackInches);
    }
    const n: number = Number(raw);
    if (!Number.isFinite(n) || n < 0) {
        return inchesToPoints(fallbackInches);
    }
    return inchesToPoints(n);
}

/**
 * parseBool function.
 *
 * @param {string} raw - The raw parameter.
 * @param {boolean} fallback - The fallback parameter.
 * @returns {boolean} - Returns the result.
 */
function parseBool(raw: string | undefined, fallback: boolean): boolean {
    if (raw === undefined) {
        return fallback;
    }
    const v: string = raw.trim().toLowerCase();
    if (v === '1' || v === 'true') {
        return true;
    }
    if (v === '0' || v === 'false') {
        return false;
    }
    return fallback;
}

/**
 * parseUint function.
 *
 * @param {string} raw - The raw parameter.
 * @param {number} fallback - The fallback parameter.
 * @returns {number} - Returns the result.
 */
function parseUint(raw: string | undefined, fallback: number): number {
    if (raw === undefined || raw.trim().length === 0) {
        return fallback;
    }
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) {
        return fallback;
    }
    return n;
}

/**
 * parseOrientation function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {PageOrientation} - Returns the result.
 */
function parseOrientation(raw: string | undefined): PageOrientation {
    if (raw === 'portrait' || raw === 'landscape' || raw === 'default') {
        return raw;
    }
    return 'default';
}

/**
 * parsePageOrder function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {PageOrder} - Returns the result.
 */
function parsePageOrder(raw: string | undefined): PageOrder {
    if (raw === 'overThenDown' || raw === 'downThenOver') {
        return raw;
    }
    return 'downThenOver';
}

/**
 * cloneModel function.
 *
 * @param {PageSetupModel} m - The m parameter.
 * @returns {PageSetupModel} - Returns the result.
 */
function cloneModel(m: PageSetupModel): PageSetupModel {
    return {
        ...m,
        margins: {
            left: m.margins.left,
            right: m.margins.right,
            top: m.margins.top,
            bottom: m.margins.bottom,
            header: m.margins.header,
            footer: m.margins.footer
        }
    };
}

/* ── minimal local XML helpers ── */

/**
 * elementOpenAttrsLocal function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementOpenAttrsLocal(el: string): string {
    const trimmed: string = el.trim();
    const m: RegExpExecArray = /^<[^>\s]+\s([^>]*?)\/?>/.exec(trimmed);
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[1]);
}

// escapeXml imported for potential attr values; paperSize etc. are numeric.
void escapeXml;
