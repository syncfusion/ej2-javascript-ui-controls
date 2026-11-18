/**
 * Parse / serialize SpreadsheetML worksheet part (`CT_Worksheet` / `sheetData`).
 *
 * Citations:
 * - `CT_Worksheet`, `CT_SheetData`, `CT_Row`, `CT_Cell`, `ST_CellType`:
 *   `specs/schemas/xsd/OfficeOpenXML-XMLSchema-Transitional/sml.xsd`
 * - docs/specs/worksheet-cells.md
 * - docs/specs/conditional-formatting.md (`conditionalFormatting` after mergeCells /
 *   phoneticPr, before dataValidations)
 * - docs/specs/data-validations.md (`dataValidations` after CF, before hyperlinks)
 * - docs/specs/hyperlinks.md (`hyperlinks` after dataValidations, before printOptions)
 * - docs/specs/freeze-panes.md (`sheetViews` before sheetData)
 * - docs/specs/column-properties.md (`cols` after sheetFormatPr, before sheetData)
 * - docs/specs/standard-height.md (`sheetFormatPr` after sheetViews, before cols)
 * - docs/specs/page-setup.md (`printOptions` / `pageMargins` / `pageSetup` after hyperlinks)
 * - docs/specs/text-boxes.md (`drawing` after smartTags, before legacyDrawing)
 *
 * Unsupported top-level children are preserved opaquely in before/after bags.
 * When the caller owns the drawing model, bag copies of `drawing` are stripped
 * and a modeled `<drawing r:id="…"/>` is inserted.
 *
 * @private
 */

import { formatA1, parseA1 } from '../address/cell-address';
import { InvalidWorksheetError, PackageLimitError } from '../core/errors';
import { OFFICE_DOCUMENT_RELATIONSHIPS_NS, SPREADSHEETML_NS_TRANSITIONAL } from '../core/package/constants';
import { OpcRelationship } from '../core/package/relationships';
import { attrsToXmlExcluding, decodeUtf8, encodeUtf8, escapeXml, parseAttrMap, unescapeXml } from '../core/xml/minimal-xml';
import { createEmptyCellModel, CellModel, CellStorageKind } from '../cell/cell-model';
import { parseFormulaXml, serializeFormulaXml } from '../cell/formula';
import {
    findConditionalFormattingInsertIndex,
    parseConditionalFormattingXml,
    serializeConditionalFormattingXml,
    ConditionalFormattingModel
} from './conditional-formatting';
import {
    findDataValidationsInsertIndex,
    parseDataValidationsXml,
    serializeDataValidationsXml,
    DataValidationsModel
} from './data-validations';
import { findColsInsertIndex, parseColsXml, serializeColsXml, ColumnsModel } from './columns';
import { parseRowEntry, RowEntry, RowsModel } from './rows';
import { findSheetViewsInsertIndex, parseSheetViewsXml, serializeSheetViewsXml, SheetViewsModel } from './freeze-panes';
import {
    EMPTY_SHEET_FORMAT_PR,
    findSheetFormatPrInsertIndex,
    parseSheetFormatPrXml,
    serializeSheetFormatPrXml,
    SheetFormatPrModel
} from './sheet-format';
import { findSortStateInsertIndex, parseSortStateXml, serializeSortStateXml, SortStateModel } from './sort-state';
import { findAutoFilterInsertIndex, parseAutoFilterXml, serializeAutoFilterXml, AutoFilterModel } from './auto-filter';
import { findHyperlinksInsertIndex, parseHyperlinksXml, serializeHyperlinksXml, HyperlinksModel } from './hyperlinks';
import { findTablePartsInsertIndex, parseTablePartsXml, serializeTablePartsXml, TablePartsModel } from './table-model';
import { findMergeCellsInsertIndex, parseMergeCellsXml, serializeMergeCellsXml, MergeCellEntry } from './merged-cells';
import {
    findHeaderFooterInsertIndex,
    findPageMarginsInsertIndex,
    findPageSetupInsertIndex,
    findPrintOptionsInsertIndex,
    mergePageSetupParse,
    serializePageSetupElements,
    PageSetupModel
} from './page-setup';
import {
    DEFAULT_PROTECT_OPTIONS,
    findSheetProtectionInsertIndex,
    parseSheetProtectionXml,
    serializeSheetProtectionXml,
    SheetProtectionModel
} from './sheet-protection';
import {
    EMPTY_PROTECTED_RANGES,
    findProtectedRangesInsertIndex,
    parseProtectedRangesXml,
    serializeProtectedRangesXml,
    ProtectedRangesModel
} from './protected-ranges';
import { findDrawingInsertIndex, serializeDrawingElementXml } from './text-boxes';
import { findLegacyDrawingInsertIndex, serializeLegacyDrawingElementXml } from './form-controls';

/** Default ceiling for cells materialized from sheetData. */
export const DEFAULT_MAX_SHEET_CELLS: 5000000 = 5_000_000;

/**
 * Parsed worksheet part focused on sheetData + dimension + mergeCells +
 * conditionalFormatting + dataValidations + hyperlinks + sheetViews + cols +
 * page setup.
 */
export interface WorksheetXmlModel {
    /** Sparse cells keyed later by host; ordered list from file. */
    readonly cells: ReadonlyArray<CellModel>;
    /** Sparse row records, including rows with no cells. */
    readonly rows: RowsModel;
    /** `dimension/@ref` when present. */
    readonly dimensionRef: string | undefined;
    /**
     * Ordered non-modeled top-level children excluding sheetData, dimension,
     * modeled `sheetViews`, modeled `cols`, modeled `mergeCells`, modeled
     * `conditionalFormatting`, modeled `dataValidations`, modeled `hyperlinks`,
     * and modeled print trio elements, each full element XML. Relative order
     * among preserves is kept; modeled elements are re-inserted by the
     * serializer at standard positions.
     */
    readonly beforeSheetDataXml: ReadonlyArray<string>;
    readonly afterSheetDataXml: ReadonlyArray<string>;
    /** Extra root attributes excluding xmlns / xmlns:r. */
    readonly rootExtraAttrsXml: string;
    /** Whether a dimension element was present. */
    readonly hadDimension: boolean;
    /**
     * Parsed `mergeCells` / `mergeCell@ref` entries in file order.
     * Empty when absent or all refs soft-skipped.
     */
    readonly mergeCells: ReadonlyArray<MergeCellEntry>;
    /**
     * Parsed conditional-formatting rules from all `conditionalFormatting`
     * parents (file order). Empty when absent or all soft-skipped.
     */
    readonly conditionalFormatting: ConditionalFormattingModel;
    /**
     * Parsed `dataValidations` model. Empty entries when absent or all soft-skipped.
     */
    readonly dataValidations: DataValidationsModel;
    /**
     * Parsed `hyperlinks` model. Empty entries when absent or all soft-skipped.
     * External targets are resolved when sheet relationships are supplied.
     */
    readonly hyperlinks: HyperlinksModel;
    /**
     * Parsed `sheetFormatPr` model (sheet default row height).
     * `present: false` when the element was absent.
     */
    readonly sheetFormatPr: SheetFormatPrModel;
    /**
     * Parsed `sheetViews` model (freeze/split panes).
     * `present: false` when the element was absent.
     */
    readonly sheetViews: SheetViewsModel;
    /**
     * Parsed `cols` / `col` column records. Empty when absent or all soft-skipped.
     */
    readonly cols: ColumnsModel;
    /**
     * Parsed print/page setup trio (`printOptions` / `pageMargins` / `pageSetup`).
     * `present: false` when none of the three elements were present.
     */
    readonly pageSetup: PageSetupModel;
    /**
     * Parsed `tableParts` refs (`CT_TableParts`). Empty when absent or all
     * soft-skipped; table parts themselves are resolved lazily by the host.
     */
    readonly tableParts: TablePartsModel;
    /**
     * Parsed worksheet-level `sortState` model. `present: false` when the
     * element was absent, or when its root was unparsable (whole-element
     * backup then round-trips via `xml`).
     */
    readonly sortState: SortStateModel;
    /**
     * Parsed worksheet-level `autoFilter` model. `present: false` when the
     * element was absent, or when its root was unparsable (whole-element
     * backup then round-trips via `xml`). Table-embedded autoFilter stays
     * opaque on the table part owner.
     */
    readonly autoFilter: AutoFilterModel;
    /**
     * Parsed `sheetProtection` model. `present: false` when the element was
     * absent. CT_Worksheet order: after `sheetCalcPr`, before `protectedRanges`.
     */
    readonly sheetProtection: SheetProtectionModel;
    /**
     * Parsed `protectedRanges` model. Empty entries when absent or all
     * soft-skipped. CT_Worksheet order: after `sheetProtection`, before
     * `scenarios` / `autoFilter`.
     */
    readonly protectedRanges: ProtectedRangesModel;
}

const EMPTY_COLS: ColumnsModel = { entries: [] };

const SML_NS: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main' = SPREADSHEETML_NS_TRANSITIONAL;

const EMPTY_HYPERLINKS: HyperlinksModel = { entries: [] };
const EMPTY_CONDITIONAL_FORMATTING: ConditionalFormattingModel = { entries: [] };

/** Absent sort state (nothing modeled; nothing emitted). */
const EMPTY_SORT_STATE: SortStateModel = {
    present: false,
    range: undefined,
    columnSort: undefined,
    caseSensitive: undefined,
    sortMethod: undefined,
    conditions: [],
    extraChildrenXml: [],
    extraAttrsXml: '',
    xml: undefined
};

/** Absent autoFilter (nothing modeled; nothing emitted). */
const EMPTY_AUTO_FILTER: AutoFilterModel = {
    present: false,
    range: undefined,
    columns: [],
    sortState: undefined,
    extraChildrenXml: [],
    extraAttrsXml: '',
    xml: undefined
};

/**
 * Absent sheet protection (nothing modeled; nothing emitted).
 * Mirrors private EMPTY_MODEL in sheet-protection.ts (not exported).
 */
const EMPTY_SHEET_PROTECTION: SheetProtectionModel = {
    present: false,
    sheet: false,
    options: { ...DEFAULT_PROTECT_OPTIONS },
    algorithmName: undefined,
    hashValue: undefined,
    saltValue: undefined,
    spinCount: undefined,
    legacyPassword: undefined,
    extraAttrsXml: ''
};

const EMPTY_SHEET_VIEWS: SheetViewsModel = {
    present: false,
    primaryExtraAttrsXml: '',
    workbookViewId: '0',
    primaryOtherChildrenXml: [],
    extraSheetViewsXml: [],
    pane: undefined,
    rootExtraAttrsXml: ''
};

/** Empty page-setup model (no print trio present). */
const EMPTY_PAGE_SETUP: PageSetupModel = mergePageSetupParse({});

/**
 * Parse worksheet part bytes into a sparse cell list + preserve bags. hyperlink `r:id` targets on load.
 *
 * @param {Uint8Array} bytes - The bytes parameter.
 * @param {string} partName - The partName parameter.
 * @param {any} options - The options parameter.
 * @param {*} [options.maxCells] - Optional maxCells field.
 * @param {*} [options.sheetRels] - Optional sheetRels field.
 * @returns {WorksheetXmlModel} - Returns the result.
 */
export function parseWorksheetXml(
    bytes: Uint8Array,
    partName: string,
    options?: {
        readonly maxCells?: number;
        readonly sheetRels?: ReadonlyArray<OpcRelationship>;
    }
): WorksheetXmlModel {
    const maxCells: number = ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_SHEET_CELLS))(
        options == null ? undefined : options.maxCells
    );
    const xml: string = decodeUtf8(bytes);
    const trimmed: string = stripPrologAndComments(xml);
    const root: { inner: string; openAttrs: string } = matchRoot(trimmed, partName);
    const rootAttrs: Map<string, string> = parseAttrMap(root.openAttrs);
    const rootExtraAttrsXml: string = attrsToXmlExcluding(rootAttrs, new Set(['xmlns', 'xmlns:r', 'xmlns:R']));

    const sheetRelsById: Map<string, OpcRelationship> = buildRelIdMap(options == null ? undefined : options.sheetRels);

    const children: string[] = splitTopLevelElements(root.inner);
    const cells: CellModel[] = [];
    const rowEntries: RowEntry[] = [];
    const beforeSheetDataXml: string[] = [];
    const afterSheetDataXml: string[] = [];
    const mergeCells: MergeCellEntry[] = [];
    const conditionalFormattingEntries: ConditionalFormattingModel['entries'][number][] = [];
    let dataValidations: DataValidationsModel = {
        disablePrompts: false,
        xWindow: undefined,
        yWindow: undefined,
        extraAttrsXml: '',
        entries: []
    };
    let hyperlinks: HyperlinksModel = EMPTY_HYPERLINKS;
    let sheetViews: SheetViewsModel = EMPTY_SHEET_VIEWS;
    let sheetFormatPr: SheetFormatPrModel = EMPTY_SHEET_FORMAT_PR;
    const colsEntries: ColumnsModel['entries'][number][] = [];
    let printOptionsXml: string | undefined;
    let pageMarginsXml: string | undefined;
    let pageSetupXml: string | undefined;
    let headerFooterXml: string | undefined;
    let tableParts: TablePartsModel = { relIds: [], extraAttrsXml: '' };
    let sortState: SortStateModel = EMPTY_SORT_STATE;
    let autoFilter: AutoFilterModel = EMPTY_AUTO_FILTER;
    let sheetProtection: SheetProtectionModel = EMPTY_SHEET_PROTECTION;
    let protectedRanges: ProtectedRangesModel = EMPTY_PROTECTED_RANGES;
    let dimensionRef: string | undefined;
    let hadDimension: boolean = false;
    let seenSheetData: boolean = false;

    for (const child of children) {
        const local: string = elementLocalName(child);
        if (local === 'dimension') {
            hadDimension = true;
            const attrs: Map<string, string> = parseAttrMap(elementOpenAttrs(child));
            dimensionRef = attrs.get('ref');
            continue;
        }
        if (local === 'sheetData') {
            seenSheetData = true;
            parseSheetData(child, cells, rowEntries, maxCells, partName);
            continue;
        }
        if (local === 'sheetViews') {
            // Model freeze/split panes; do not keep opaque copy in before bag.
            sheetViews = parseSheetViewsXml(child);
            continue;
        }
        if (local === 'sheetFormatPr') {
            // Model sheet default row height; do not keep opaque copy in before bag.
            sheetFormatPr = parseSheetFormatPrXml(child);
            continue;
        }
        if (local === 'cols') {
            // Model column properties (0..∞ `cols` parents); merge in file order.
            // Do not keep opaque copies in the before bag.
            const parsed: ColumnsModel = parseColsXml(child);
            for (const e of parsed.entries) {
                colsEntries.push(e);
            }
            continue;
        }
        if (local === 'mergeCells') {
            // Model merges regardless of position; do not keep opaque copy in bags.
            const parsed: MergeCellEntry[] = parseMergeCellsXml(child);
            for (const e of parsed) {
                mergeCells.push(e);
            }
            continue;
        }
        if (local === 'conditionalFormatting') {
            // Model all CF parents (0..∞); do not keep opaque copies in bags.
            const parsed: any = parseConditionalFormattingXml(child);
            for (const e of parsed) {
                conditionalFormattingEntries.push(e);
            }
            continue;
        }
        if (local === 'dataValidations') {
            // Model data validations regardless of position; do not keep opaque copy.
            dataValidations = parseDataValidationsXml(child);
            continue;
        }
        if (local === 'hyperlinks') {
            // Model hyperlinks regardless of position; resolve r:id via sheet rels.
            hyperlinks = parseHyperlinksXml(child, sheetRelsById);
            continue;
        }
        if (local === 'printOptions') {
            printOptionsXml = child;
            continue;
        }
        if (local === 'pageMargins') {
            pageMarginsXml = child;
            continue;
        }
        if (local === 'pageSetup') {
            pageSetupXml = child;
            continue;
        }
        if (local === 'headerFooter') {
            headerFooterXml = child;
            continue;
        }
        if (local === 'tableParts') {
            // Model tableParts refs regardless of position; do not keep opaque copy.
            // The referenced table parts are resolved lazily by the worksheet host.
            tableParts = parseTablePartsXml(child);
            continue;
        }
        if (local === 'autoFilter') {
            // Model the worksheet-level autoFilter; table-embedded autoFilter
            // lives on the table part and stays opaque here.
            autoFilter = parseAutoFilterXml(child);
            continue;
        }
        if (local === 'sortState') {
            // Model the worksheet-level sort state; table-embedded sortState
            // elements stay opaque (other owners).
            sortState = parseSortStateXml(child);
            continue;
        }
        if (local === 'sheetProtection') {
            // Model sheet protection; do not keep opaque copy in bags.
            // CT_Worksheet: after sheetCalcPr, before protectedRanges.
            sheetProtection = parseSheetProtectionXml(child);
            continue;
        }
        if (local === 'protectedRanges') {
            // Model protected ranges; do not keep opaque copy in bags.
            // CT_Worksheet: after sheetProtection, before scenarios/autoFilter.
            protectedRanges = parseProtectedRangesXml(child);
            continue;
        }
        // drawing and other unsupported children stay in preserve bags.
        if (!seenSheetData) {
            beforeSheetDataXml.push(child);
        } else {
            afterSheetDataXml.push(child);
        }
    }

    const pageSetupParts: {
        printOptionsXml?: string;
        pageMarginsXml?: string;
        pageSetupXml?: string;
        headerFooterXml?: string;
    } = {};
    if (printOptionsXml !== undefined) {
        pageSetupParts.printOptionsXml = printOptionsXml;
    }
    if (pageMarginsXml !== undefined) {
        pageSetupParts.pageMarginsXml = pageMarginsXml;
    }
    if (pageSetupXml !== undefined) {
        pageSetupParts.pageSetupXml = pageSetupXml;
    }
    if (headerFooterXml !== undefined) {
        pageSetupParts.headerFooterXml = headerFooterXml;
    }
    const pageSetup: PageSetupModel = mergePageSetupParse(pageSetupParts);

    return {
        cells,
        rows: { entries: rowEntries },
        sheetFormatPr,
        dimensionRef,
        beforeSheetDataXml,
        afterSheetDataXml,
        rootExtraAttrsXml,
        hadDimension,
        mergeCells,
        conditionalFormatting: { entries: conditionalFormattingEntries },
        dataValidations,
        autoFilter,
        hyperlinks,
        sheetViews,
        cols: { entries: colsEntries },
        pageSetup,
        tableParts,
        sortState,
        sheetProtection,
        protectedRanges
    };
}

/**
 * Serialize a worksheet model to SpreadsheetML worksheet part bytes. Modeled elements (`sheetViews`, `cols`, `mergeCells`, `conditionalFormatting`, `dataValidations`, `hyperlinks`, the print trio) are inserted at CT_Worksheet sequence positions. Unsupported children (including `drawing`) are emitted from preserve bags as-is.
 *
 * @param {*} model - model value.
 * @returns {Uint8Array} Function result.
 */
export function serializeWorksheetXml(model: {
    readonly cells: ReadonlyArray<CellModel>;
    readonly rows?: RowsModel;
    readonly beforeSheetDataXml?: ReadonlyArray<string>;
    readonly afterSheetDataXml?: ReadonlyArray<string>;
    readonly rootExtraAttrsXml?: string;
    /** Modeled merge ranges; omitted from output when empty/absent. */
    readonly mergeCells?: ReadonlyArray<MergeCellEntry>;
    /** Modeled conditional formatting; omitted from output when empty/absent. */
    readonly conditionalFormatting?: ConditionalFormattingModel;
    /** Modeled data validations; omitted from output when empty/absent. */
    readonly dataValidations?: DataValidationsModel;
    /** Modeled hyperlinks; omitted from output when empty/absent. */
    readonly hyperlinks?: HyperlinksModel;
    /** Modeled sheetViews / freeze panes; omitted when absent/empty. */
    readonly sheetViews?: SheetViewsModel;
    /** Modeled sheetFormatPr / default row height; omitted when present is false. */
    readonly sheetFormatPr?: SheetFormatPrModel;
    /** Modeled `cols` / column widths; omitted when empty/absent. */
    readonly cols?: ColumnsModel;
    /** Modeled print/page setup trio; omitted when absent. */
    readonly pageSetup?: PageSetupModel;
    /** Modeled tableParts refs; omitted from output when empty/absent. */
    readonly tableParts?: TablePartsModel;
    /**
     * Modeled worksheet-level `sortState`; omitted from output when absent
     * (no backup) — an unparsable root still re-emits its whole-element
     * backup verbatim.
     */
    readonly sortState?: SortStateModel;
    /**
     * Modeled worksheet-level `autoFilter`; omitted from output when absent
     * (no backup) — an unparsable root still re-emits its whole-element
     * backup verbatim. Schema order: autoFilter immediately before sortState.
     */
    readonly autoFilter?: AutoFilterModel;
    /**
     * Modeled `sheetProtection`; omitted when `present: false`.
     * Schema order: after sheetCalcPr, before protectedRanges.
     */
    readonly sheetProtection?: SheetProtectionModel;
    /**
     * Modeled `protectedRanges`; omitted when entries are empty.
     * Schema order: after sheetProtection, before scenarios/autoFilter.
     */
    readonly protectedRanges?: ProtectedRangesModel;
    /**
     * Sheet drawing relationship id for modeled `<drawing r:id="…"/>`.
     * When set (or `stripBagDrawing` is true), opaque bag `drawing` elements
     * are filtered out so the library-owned element is sole.
     */
    readonly drawingRelationshipId?: string;
    /**
     * Strip bag `drawing` even when no relationship id is emitted (empty owned
     * drawing after last text box removed).
     */
    readonly stripBagDrawing?: boolean;
    /**
     * Sheet VML legacyDrawing relationship id for modeled
     * `<legacyDrawing r:id="…"/>` (form controls). When set (or
     * `stripBagLegacyDrawing` is true), opaque bag `legacyDrawing` elements
     * are filtered out so the library-owned element is sole.
     */
    readonly legacyDrawingRelationshipId?: string;
    /**
     * Strip bag `legacyDrawing` even when no relationship id is emitted
     * (empty owned VML after last form control removed).
     */
    readonly stripBagLegacyDrawing?: boolean;
    /** Force dimension emission even when empty (omit by default). */
    readonly emitEmptyDimension?: boolean;
}): Uint8Array {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    const extra: string =
        model.rootExtraAttrsXml !== undefined && model.rootExtraAttrsXml.trim().length > 0 ? ` ${model.rootExtraAttrsXml.trim()}` : '';
    const hyperlinksModel: HyperlinksModel = model.hyperlinks != null ? model.hyperlinks : EMPTY_HYPERLINKS;
    const drawingRId: string = model.drawingRelationshipId;
    const ownsDrawing: boolean = model.stripBagDrawing === true || (drawingRId !== undefined && drawingRId.length > 0);
    const legacyDrawingRId: string = model.legacyDrawingRelationshipId;
    const ownsLegacyDrawing: boolean =
        model.stripBagLegacyDrawing === true || (legacyDrawingRId !== undefined && legacyDrawingRId.length > 0);
    // `xmlns:r` must be declared unconditionally: emitted children may use
    // qualified attributes (`tablePart@r:id`, `hyperlink@r:id`, `drawing@r:id`,
    // and any future rel-backed child). An undeclared prefix is not well-formed
    // XML — Excel rejects the part. The parser strips all `xmlns*` from
    // `rootExtraAttrsXml` (namespaces are never preserved as ordinary attrs), so
    // re-declaration here is the serializer's responsibility. Corpus: every
    // worksheet root example carries both declarations. (TASK-1216: unconditional
    // declaration beats conditional — the same bug class recurs for any
    // rel-backed child otherwise.)
    lines.push(`<worksheet xmlns="${SML_NS}" xmlns:r="${OFFICE_DOCUMENT_RELATIONSHIPS_NS}"${extra}>`);

    const dim: string = computeDimensionRef(model.cells);
    if (dim !== undefined) {
        lines.push(`<dimension ref="${escapeXml(dim)}"/>`);
    } else if (model.emitEmptyDimension === true) {
        lines.push('<dimension ref="A1"/>');
    }

    const beforeRaw: ReadonlyArray<string> = model.beforeSheetDataXml != null ? model.beforeSheetDataXml : [];
    const beforeFiltered: string[] = [];
    for (const child of beforeRaw) {
        // Skip any legacy modeled elements that might have been mis-bucketed.
        const local: string = elementLocalName(child);
        if (
            local === 'dimension' ||
            local === 'sheetViews' ||
            local === 'sheetFormatPr' ||
            local === 'cols' ||
            local === 'mergeCells' ||
            local === 'dataValidations' ||
            local === 'autoFilter' ||
            local === 'hyperlinks' ||
            local === 'printOptions' ||
            local === 'pageMargins' ||
            local === 'pageSetup' ||
            local === 'headerFooter' ||
            local === 'tableParts' ||
            local === 'sortState' ||
            local === 'sheetProtection' ||
            local === 'protectedRanges' ||
            (ownsDrawing && local === 'drawing') ||
            (ownsLegacyDrawing && local === 'legacyDrawing')
        ) {
            continue;
        }
        beforeFiltered.push(child);
    }

    // CT_Worksheet sequence before sheetData:
    // sheetPr → dimension → sheetViews → sheetFormatPr → cols → sheetData
    const sheetViewsXml: string = serializeSheetViewsXml(model.sheetViews != null ? model.sheetViews : EMPTY_SHEET_VIEWS);
    if (sheetViewsXml !== undefined) {
        const locals: string[] = beforeFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findSheetViewsInsertIndex(locals);
        beforeFiltered.splice(insertAt, 0, sheetViewsXml);
    }

    const sheetFormatPrXml: string = serializeSheetFormatPrXml(
        model.sheetFormatPr != null ? model.sheetFormatPr : EMPTY_SHEET_FORMAT_PR
    );
    if (sheetFormatPrXml !== undefined) {
        const formatLocals: string[] = beforeFiltered.map((c: string): string => elementLocalName(c));
        const formatInsertAt: number = findSheetFormatPrInsertIndex(formatLocals);
        beforeFiltered.splice(formatInsertAt, 0, sheetFormatPrXml);
    }

    const colsXml: string = serializeColsXml(model.cols != null ? model.cols : EMPTY_COLS);
    if (colsXml !== undefined) {
        const locals: string[] = beforeFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findColsInsertIndex(locals);
        beforeFiltered.splice(insertAt, 0, colsXml);
    }

    for (const child of beforeFiltered) {
        lines.push(child);
    }

    lines.push(serializeSheetData(model.cells, model.rows));

    const afterRaw: ReadonlyArray<string> = model.afterSheetDataXml != null ? model.afterSheetDataXml : [];
    const afterFiltered: string[] = [];
    for (const child of afterRaw) {
        const local: string = elementLocalName(child);
        if (
            local === 'dimension' ||
            local === 'sheetViews' ||
            local === 'sheetFormatPr' ||
            local === 'cols' ||
            local === 'mergeCells' ||
            local === 'dataValidations' ||
            local === 'hyperlinks' ||
            local === 'printOptions' ||
            local === 'pageMargins' ||
            local === 'pageSetup' ||
            local === 'headerFooter' ||
            local === 'autoFilter' ||
            local === 'sortState' ||
            local === 'sheetProtection' ||
            local === 'protectedRanges' ||
            (ownsDrawing && local === 'drawing') ||
            (ownsLegacyDrawing && local === 'legacyDrawing')
        ) {
            continue;
        }
        afterFiltered.push(child);
    }

    // CT_Worksheet after sheetData: sheetCalcPr → sheetProtection → protectedRanges
    // → scenarios → autoFilter → … → mergeCells. Emit protection before other
    // modeled after-sheetData children so insert indexes see consistent order.
    const spXml: string = serializeSheetProtectionXml(model.sheetProtection != null ? model.sheetProtection : EMPTY_SHEET_PROTECTION);
    if (spXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findSheetProtectionInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, spXml);
    }

    const prXml: string = serializeProtectedRangesXml(model.protectedRanges != null ? model.protectedRanges : EMPTY_PROTECTED_RANGES);
    if (prXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findProtectedRangesInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, prXml);
    }

    const mergeXml: string = serializeMergeCellsXml(model.mergeCells != null ? model.mergeCells : []);
    if (mergeXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findMergeCellsInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, mergeXml);
    }

    // CT_Worksheet sequence: autoFilter → sortState → dataConsolidate → … →
    // customSheetViews → mergeCells. Emit autoFilter first so findSortState
    // sees it among predecessors. Strip both from bags above so duplicates
    // never stack with re-inserted modeled elements.
    const afXml: string = serializeAutoFilterXml(model.autoFilter != null ? model.autoFilter : EMPTY_AUTO_FILTER);
    if (afXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findAutoFilterInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, afXml);
    }

    // position is computed so both finders see a consistent sibling list.
    const ssXml: string = serializeSortStateXml(model.sortState != null ? model.sortState : EMPTY_SORT_STATE);
    if (ssXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findSortStateInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, ssXml);
    }

    const cfXmls: string[] = serializeConditionalFormattingXml(
        model.conditionalFormatting != null ? model.conditionalFormatting : EMPTY_CONDITIONAL_FORMATTING
    );
    if (cfXmls.length > 0) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findConditionalFormattingInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, ...cfXmls);
    }

    const emptyDv: DataValidationsModel = {
        disablePrompts: false,
        xWindow: undefined,
        yWindow: undefined,
        extraAttrsXml: '',
        entries: []
    };
    const dvXml: string = serializeDataValidationsXml(model.dataValidations != null ? model.dataValidations : emptyDv);
    if (dvXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findDataValidationsInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, dvXml);
    }

    // CT_Worksheet sequence: hyperlinks before printOptions, tableParts last
    // among content children (before extLst). Both are re-inserted at their
    // schema positions among the after-sheetData preserves.
    const hlXml: string = serializeHyperlinksXml(hyperlinksModel);
    if (hlXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findHyperlinksInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, hlXml);
    }

    const pageEls: { printOptionsXml: string; pageMarginsXml: string; headerFooterXml: string; pageSetupXml: string } =
        serializePageSetupElements(model.pageSetup != null ? model.pageSetup : EMPTY_PAGE_SETUP);
    if (pageEls.printOptionsXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findPrintOptionsInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, pageEls.printOptionsXml);
    }
    if (pageEls.pageMarginsXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findPageMarginsInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, pageEls.pageMarginsXml);
    }
    if (pageEls.pageSetupXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findPageSetupInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, pageEls.pageSetupXml);
    }
    if (pageEls.headerFooterXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findHeaderFooterInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, pageEls.headerFooterXml);
    }
    if (drawingRId !== undefined && drawingRId.length > 0) {
        const drawingXml: string = serializeDrawingElementXml(drawingRId);
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findDrawingInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, drawingXml);
    }
    // CT_Worksheet: legacyDrawing immediately after drawing (form-control VML).
    if (legacyDrawingRId !== undefined && legacyDrawingRId.length > 0) {
        const legacyXml: string = serializeLegacyDrawingElementXml(legacyDrawingRId);
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findLegacyDrawingInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, legacyXml);
    }

    const tpXml: string = serializeTablePartsXml(model.tableParts != null ? model.tableParts : { relIds: [], extraAttrsXml: '' });
    if (tpXml !== undefined) {
        const locals: string[] = afterFiltered.map((c: string): string => elementLocalName(c));
        const insertAt: number = findTablePartsInsertIndex(locals);
        afterFiltered.splice(insertAt, 0, tpXml);
    }
    // Last step: later inserts must not leave headerFooter before pageSetup.
    // Excel replaces sheet1.xml when that sequence is illegal.
    reorderPageSetupChildren(afterFiltered);

    for (const child of afterFiltered) {
        lines.push(child);
    }
    lines.push('</worksheet>');
    return encodeUtf8(lines.join(''));
}

/**
 * buildRelIdMap function.
 *
 * @param {*} rels - The rels parameter.
 * @returns {string} - Returns the result.
 */
function buildRelIdMap(rels: ReadonlyArray<OpcRelationship> | undefined): Map<string, OpcRelationship> | undefined {
    if (rels === undefined || rels.length === 0) {
        return undefined;
    }
    const map: Map<string, OpcRelationship> = new Map<string, OpcRelationship>();
    for (const r of rels) {
        map.set(r.id, r);
    }
    return map;
}

/**
 * Minimal bounding A1 range for existing cells, or undefined if empty.
 *
 * @param {Object} cells - The cells parameter.
 * @returns {string} - Returns the result.
 */
export function computeDimensionRef(cells: ReadonlyArray<CellModel>): string | undefined {
    if (cells.length === 0) {
        return undefined;
    }
    let minRow: number = Number.POSITIVE_INFINITY;
    let maxRow: number = 0;
    let minCol: number = Number.POSITIVE_INFINITY;
    let maxCol: number = 0;
    for (const c of cells) {
        if (c.row < minRow) {
            minRow = c.row;
        }
        if (c.row > maxRow) {
            maxRow = c.row;
        }
        if (c.col < minCol) {
            minCol = c.col;
        }
        if (c.col > maxCol) {
            maxCol = c.col;
        }
    }
    if (!Number.isFinite(minRow) || !Number.isFinite(minCol)) {
        return undefined;
    }
    const a: string = formatA1(minRow, minCol);
    const b: string = formatA1(maxRow, maxCol);
    return a === b ? a : `${a}:${b}`;
}

/**
 * parseSheetData function.
 *
 * @param {string} sheetDataXml - The sheetDataXml parameter.
 * @param {CellModel[]} cells - The cells parameter.
 * @param {RowEntry[]} rowEntries - The rowEntries parameter.
 * @param {number} maxCells - The maxCells parameter.
 * @param {string} partName - The partName parameter.
 * @returns {void} - Returns the result.
 */
function parseSheetData(sheetDataXml: string, cells: CellModel[], rowEntries: RowEntry[], maxCells: number, partName: string): void {
    const inner: string = elementInner(sheetDataXml);
    const rows: string[] = splitTopLevelElements(inner).filter((el: string): boolean => elementLocalName(el) === 'row');
    for (const rowEl of rows) {
        const rowAttrs: Map<string, string> = parseAttrMap(elementOpenAttrs(rowEl));
        const rowAttr: string = rowAttrs.get('r');
        let rowNum: number = rowAttr !== undefined ? Number.parseInt(rowAttr, 10) : Number.NaN;
        if (Number.isFinite(rowNum) && rowNum >= 1) {
            rowEntries.push(parseRowEntry(rowNum, rowAttrs));
        }
        const rowInner: string = elementInner(rowEl);
        const cellEls: string[] = splitTopLevelElements(rowInner).filter((el: string): boolean => elementLocalName(el) === 'c');
        let colCursor: number = 1;
        for (const cellEl of cellEls) {
            if (cells.length >= maxCells) {
                throw new PackageLimitError(`Worksheet "${partName}" exceeds maximum of ${maxCells} cells`, { partName });
            }
            const model: CellModel = parseCellElement(cellEl, rowNum, colCursor, partName);
            cells.push(model);
            colCursor = model.col + 1;
            if (!Number.isFinite(rowNum) || rowNum < 1) {
                rowNum = model.row;
            }
        }
    }
}

/**
 * parseCellElement function.
 *
 * @param {string} cellXml - The cellXml parameter.
 * @param {number} rowHint - The rowHint parameter.
 * @param {number} colHint - The colHint parameter.
 * @param {string} partName - The partName parameter.
 * @returns {CellModel} - Returns the result.
 */
function parseCellElement(cellXml: string, rowHint: number, colHint: number, partName: string): CellModel {
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrs(cellXml));
    const rAttr: string = attrs.get('r');
    let row: number = rowHint;
    let col: number = colHint;
    if (rAttr !== undefined && rAttr.length > 0) {
        try {
            const coord: any = parseA1(rAttr);
            row = coord.row;
            col = coord.col;
        } catch {
            // Fall back to positional hints when r is unparsable.
            if (!Number.isFinite(row) || row < 1) {
                throw new InvalidWorksheetError(`Cell with invalid r="${rAttr}" in "${partName}"`, { partName });
            }
        }
    }
    if (!Number.isFinite(row) || row < 1) {
        row = 1;
    }
    if (!Number.isFinite(col) || col < 1) {
        col = 1;
    }

    const model: CellModel = createEmptyCellModel(row, col);
    const styleRaw: string = attrs.get('s');
    if (styleRaw !== undefined && styleRaw !== '') {
        const s: number = Number.parseInt(styleRaw, 10);
        if (Number.isFinite(s) && s >= 0) {
            model.styleIndex = s;
        }
    }
    const excluded: Set<string> = new Set(['r', 's', 't']);
    const vmRaw: string = attrs.get('vm');
    if (vmRaw !== undefined && /^[1-9]\d*$/.test(vmRaw)) {
        model.vm = Number.parseInt(vmRaw, 10);
        excluded.add('vm');
    }
    model.extraAttrsXml = attrsToXmlExcluding(attrs, excluded);

    const tRaw: string = attrs.get('t');
    const t: string = tRaw === undefined || tRaw === '' ? 'n' : tRaw;

    const inner: string = elementInner(cellXml);
    const children: string[] = splitTopLevelElements(inner);
    let vText: string | undefined;
    let isXml: string | undefined;
    let isPlain: string | undefined;
    let fXml: string | undefined;
    const preserve: string[] = [];

    for (const child of children) {
        const local: string = elementLocalName(child);
        if (local === 'f') {
            fXml = child.trim();
            continue;
        }
        if (local === 'v') {
            vText = parseSimpleTextElement(child);
            continue;
        }
        if (local === 'is') {
            isXml = child.trim();
            isPlain = extractInlinePlain(child);
            continue;
        }
        preserve.push(child);
    }
    if (fXml !== undefined) {
        model.formula = parseFormulaXml(fXml);
    }
    model.preserveChildrenXml = preserve;

    applyTypeAndValue(model, t, vText, isXml, isPlain);
    return model;
}

/**
 * applyTypeAndValue function.
 *
 * @param {CellModel} model - The model parameter.
 * @param {string} t - The t parameter.
 * @param {string} vText - The vText parameter.
 * @param {string} isXml - The isXml parameter.
 * @param {string} isPlain - The isPlain parameter.
 * @returns {void} - Returns the result.
 */
function applyTypeAndValue(
    model: CellModel,
    t: string,
    vText: string | undefined,
    isXml: string | undefined,
    isPlain: string | undefined
): void {
    switch (t) {
    case 's': {
        model.kind = 'sharedString';
        const idx: number = vText !== undefined ? Number.parseInt(vText, 10) : 0;
        model.raw = Number.isFinite(idx) ? idx : 0;
        break;
    }
    case 'b': {
        model.kind = 'boolean';
        model.raw = vText === '1' || vText === 'true';
        break;
    }
    case 'e': {
        model.kind = 'error';
        model.raw = vText != null ? vText : '#N/A';
        break;
    }
    case 'inlineStr': {
        model.kind = 'inlineString';
        model.inlineIsXml = isXml;
        model.inlinePlain = isPlain != null ? isPlain : '';
        model.raw = undefined;
        break;
    }
    case 'str': {
        model.kind = 'str';
        model.raw = vText != null ? vText : '';
        break;
    }
    case 'n':
    default: {
        if (vText === undefined || vText === '') {
            if (isXml !== undefined) {
                // Odd files may omit t for inline — treat as empty unless is present.
                model.kind = 'inlineString';
                model.inlineIsXml = isXml;
                model.inlinePlain = isPlain != null ? isPlain : '';
            } else {
                model.kind = 'empty';
                model.raw = undefined;
            }
        } else {
            model.kind = 'number';
            const n: number = Number(vText);
            model.raw = Number.isFinite(n) ? n : vText;
        }
        break;
    }
    }
}

/**
 * serializeSheetData function.
 *
 * @param {Object} cells - The cells parameter.
 * @param {RowsModel} rows - The rows parameter.
 * @returns {string} - Returns the result.
 */
function serializeSheetData(cells: ReadonlyArray<CellModel>, rows?: RowsModel): string {
    const rowEntries: ReadonlyArray<RowEntry> = rows !== undefined && rows !== null ? rows.entries : undefined;
    const rowEntryCount: number = rowEntries !== undefined ? rowEntries.length : 0;
    if (cells.length === 0 && rowEntryCount === 0) {
        return '<sheetData/>';
    }
    // Group by row
    const byRow: Map<number, CellModel[]> = new Map<number, CellModel[]>();
    for (const c of cells) {
        let list: CellModel[] = byRow.get(c.row);
        if (list === undefined) {
            list = [];
            byRow.set(c.row, list);
        }
        list.push(c);
    }
    const rowNums: number[] = [...byRow.keys()].sort((a: number, b: number): number => a - b);
    if (rowEntries !== undefined) {
        for (const entry of rowEntries) {
            if (rowNums.indexOf(entry.index) < 0) {
                rowNums.push(entry.index);
            }
        }
    }
    rowNums.sort((a: number, b: number): number => a - b);
    const parts: string[] = ['<sheetData>'];
    for (const rn of rowNums) {
        const rowCellsMaybe: CellModel[] = byRow.get(rn);
        const rowCells: CellModel[] = rowCellsMaybe !== undefined ? rowCellsMaybe : [];
        rowCells.sort((a: CellModel, b: CellModel): number => a.col - b.col);
        const firstCell: CellModel = rowCells[0];
        const lastCell: CellModel = rowCells[rowCells.length - 1];
        const rowEntry: RowEntry = rowEntries !== undefined ? rowEntries.find((entry: RowEntry): boolean => entry.index === rn) : undefined;
        const attrs: string[] = [`r="${rn}"`];
        if (firstCell !== undefined && lastCell !== undefined) {
            attrs.push(`spans="${firstCell.col}:${lastCell.col}"`);
        }
        if (rowEntry !== undefined && rowEntry.height !== undefined) {
            attrs.push(`ht="${String(rowEntry.height)}"`);
        }
        if (rowEntry !== undefined && rowEntry.customHeight !== undefined) {
            attrs.push(`customHeight="${rowEntry.customHeight ? '1' : '0'}"`);
        }
        if (rowEntry !== undefined && rowEntry.hidden === true) {
            attrs.push('hidden="1"');
        }
        if (rowEntry !== undefined && rowEntry.styleIndex !== undefined) {
            attrs.push(`s="${String(rowEntry.styleIndex)}"`);
        }
        if (rowEntry !== undefined && rowEntry.customFormat === true) {
            attrs.push('customFormat="1"');
        } else if (rowEntry !== undefined && rowEntry.customFormat === false) {
            attrs.push('customFormat="0"');
        }
        if (rowEntry !== undefined && rowEntry.extraAttrsXml.trim()) {
            attrs.push(rowEntry.extraAttrsXml.trim());
        }
        parts.push(`<row ${attrs.join(' ')}>`);
        for (const c of rowCells) {
            parts.push(serializeCell(c));
        }
        parts.push('</row>');
    }
    parts.push('</sheetData>');
    return parts.join('');
}

/**
 * serializeCell function.
 *
 * @param {CellModel} model - The model parameter.
 * @returns {string} - Returns the result.
 */
function serializeCell(model: CellModel): string {
    const addr: string = formatA1(model.row, model.col);
    const attrs: string[] = [`r="${addr}"`];
    if (model.styleIndex !== undefined) {
        attrs.push(`s="${model.styleIndex}"`);
    }
    const tAttr: string = typeAttr(model.kind);
    if (tAttr !== undefined) {
        attrs.push(`t="${tAttr}"`);
    }
    if (model.vm !== undefined) {
        attrs.push(`vm="${model.vm}"`);
    }
    if (model.extraAttrsXml.length > 0) {
        attrs.push(model.extraAttrsXml.trim());
    }

    const body: string[] = [];
    if (model.formula !== undefined) {
        body.push(serializeFormulaXml(model.formula));
    }
    const v: string = valueElement(model);
    if (v !== undefined) {
        body.push(v);
    }
    if (model.kind === 'inlineString') {
        if (model.inlineIsXml !== undefined) {
            body.push(model.inlineIsXml);
        } else {
            const plain: string = model.inlinePlain != null ? model.inlinePlain : '';
            body.push(`<is>${serializeT(plain)}</is>`);
        }
    }
    for (const p of model.preserveChildrenXml) {
        body.push(p);
    }

    if (body.length === 0) {
        return `<c ${attrs.join(' ')}/>`;
    }
    return `<c ${attrs.join(' ')}>${body.join('')}</c>`;
}

/**
 * typeAttr function.
 *
 * @param {CellStorageKind} kind - The kind parameter.
 * @returns {string} - Returns the result.
 */
function typeAttr(kind: CellStorageKind): string | undefined {
    switch (kind) {
    case 'sharedString':
        return 's';
    case 'boolean':
        return 'b';
    case 'error':
        return 'e';
    case 'inlineString':
        return 'inlineStr';
    case 'str':
        return 'str';
    case 'number':
    case 'empty':
    default:
        return undefined;
    }
}

/**
 * valueElement function.
 *
 * @param {CellModel} model - The model parameter.
 * @returns {string} - Returns the result.
 */
function valueElement(model: CellModel): string | undefined {
    switch (model.kind) {
    case 'number': {
        if (model.raw === undefined) {
            return undefined;
        }
        return `<v>${escapeXml(String(model.raw))}</v>`;
    }
    case 'boolean':
        return `<v>${model.raw === true || model.raw === 1 || model.raw === '1' ? '1' : '0'}</v>`;
    case 'error':
        return `<v>${escapeXml(String(model.raw != null ? model.raw : '#N/A'))}</v>`;
    case 'sharedString':
        return `<v>${escapeXml(String(model.raw != null ? model.raw : 0))}</v>`;
    case 'str':
        return `<v>${escapeXml(String(model.raw != null ? model.raw : ''))}</v>`;
    case 'inlineString':
    case 'empty':
        return undefined;
    default:
        return undefined;
    }
}

/**
 * serializeT function.
 *
 * @param {string} text - The text parameter.
 * @returns {string} - Returns the result.
 */
function serializeT(text: string): string {
    const space: '' | ' xml:space="preserve"' =
        text.length > 0 && (/^\s|\s$/.test(text) || text.includes('\n') || text.includes('\t')) ? ' xml:space="preserve"' : '';
    return `<t${space}>${escapeXml(text)}</t>`;
}

/**
 * extractInlinePlain function.
 *
 * @param {string} isXml - The isXml parameter.
 * @returns {string} - Returns the result.
 */
function extractInlinePlain(isXml: string): string {
    const texts: string[] = [];
    collectTTexts(isXml, texts);
    return texts.join('');
}

/**
 * collectTTexts function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string[]} out - The out parameter.
 * @returns {void} - Returns the result.
 */
function collectTTexts(xml: string, out: string[]): void {
    const inner: string = elementInner(xml);
    for (const child of splitTopLevelElements(inner)) {
        const local: string = elementLocalName(child);
        if (local === 't') {
            out.push(parseSimpleTextElement(child));
        } else if (local === 'r' || local === 'is') {
            collectTTexts(child, out);
        }
    }
}

/**
 * parseSimpleTextElement function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function parseSimpleTextElement(el: string): string {
    return unescapeXml(elementInner(el));
}

/**
 * matchRoot function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} partName - The partName parameter.
 * @returns {Object} - Returns the result.
 */
function matchRoot(xml: string, partName: string): { inner: string; openAttrs: string } {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?worksheet\b([^>]*)>/i.exec(xml);
    if (m === null) {
        throw new InvalidWorksheetError(`Worksheet part "${partName}" is missing root element worksheet`, { partName });
    }
    const openAttrs: string = (m[2] != null ? m[2] : '').replace(/\/\s*$/, '');
    const openEnd: number = findTagEnd(xml, 0);
    if (openEnd < 0) {
        throw new InvalidWorksheetError(`Worksheet part "${partName}" has malformed worksheet open tag`, { partName });
    }
    const openTag: string = xml.slice(0, openEnd + 1);
    if (/\/\s*>$/.test(openTag)) {
        return { inner: '', openAttrs };
    }
    const close: number = findClosing(xml, 'worksheet', openEnd + 1);
    if (close < 0) {
        throw new InvalidWorksheetError(`Worksheet part "${partName}" has unclosed worksheet element`, { partName });
    }
    const closeStart: number = xml.lastIndexOf('</', close);
    const inner: string = xml.slice(openEnd + 1, closeStart);
    return { inner, openAttrs };
}

/**
 * stripPrologAndComments function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {string} - Returns the result.
 */
function stripPrologAndComments(xml: string): string {
    return xml
        .replace(/^\uFEFF/, '')
        .replace(/<\?xml[\s\S]*?\?>/i, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/^\s+/, '');
}

/**
 * splitTopLevelElements function.
 *
 * @param {string} s - The s parameter.
 * @returns {string[]} - Returns the result.
 */
function splitTopLevelElements(s: string): string[] {
    const result: string[] = [];
    let i: number = 0;
    while (i < s.length) {
        const lt: number = s.indexOf('<', i);
        if (lt < 0) {
            break;
        }
        if (s.startsWith('</', lt)) {
            break;
        }
        if (s.startsWith('<?', lt) || s.startsWith('<!', lt)) {
            const endPi: number = s.indexOf('>', lt);
            i = endPi < 0 ? s.length : endPi + 1;
            continue;
        }
        const openEnd: number = findTagEnd(s, lt);
        if (openEnd < 0) {
            break;
        }
        const openTag: string = s.slice(lt, openEnd + 1);
        if (openTag.endsWith('/>') || /\/\s*>$/.test(openTag)) {
            result.push(s.slice(lt, openEnd + 1));
            i = openEnd + 1;
            continue;
        }
        const local: string = elementLocalName(openTag);
        const close: number = findClosing(s, local, openEnd + 1);
        if (close < 0) {
            result.push(s.slice(lt).trim());
            break;
        }
        result.push(s.slice(lt, close).replace(/\s+$/, ''));
        i = close;
    }
    return result.map((x: string): string => x.trim()).filter((x: string): boolean => x.length > 0);
}

/**
 * findTagEnd function.
 *
 * @param {string} s - The s parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findTagEnd(s: string, from: number): number {
    let inQuote: '"' | '\'' | null = null;
    for (let i: number = from; i < s.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const ch: string = s[i];
        if (inQuote !== null) {
            if (ch === inQuote) {
                inQuote = null;
            }
            continue;
        }
        if (ch === '"' || ch === '\'') {
            inQuote = ch;
            continue;
        }
        if (ch === '>') {
            return i;
        }
    }
    return -1;
}

/**
 * findClosing function.
 *
 * @param {string} s - The s parameter.
 * @param {string} localName - The localName parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findClosing(s: string, localName: string, from: number): number {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const openPat: RegExp = new RegExp(`<([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}(?=[\\s>/])`, 'g');
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const closePat: RegExp = new RegExp(`</([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}\\s*>`, 'g');
    let depth: number = 1;
    let i: number = from;
    while (i < s.length && depth > 0) {
        openPat.lastIndex = i;
        closePat.lastIndex = i;
        const om: RegExpExecArray = openPat.exec(s);
        const cm: RegExpExecArray = closePat.exec(s);
        if (cm === null) {
            return -1;
        }
        if (om !== null && om.index < cm.index) {
            const tagEnd: number = findTagEnd(s, om.index);
            if (tagEnd >= 0) {
                const tag: string = s.slice(om.index, tagEnd + 1);
                if (!/\/\s*>$/.test(tag)) {
                    depth += 1;
                }
                i = tagEnd + 1;
                continue;
            }
        }
        depth -= 1;
        if (depth === 0) {
            return cm.index + cm[0].length;
        }
        i = cm.index + cm[0].length;
    }
    return -1;
}

/**
 * elementLocalName function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
/**
 * Force CT_Worksheet print children into schema order:
 * printOptions, pageMargins, pageSetup, headerFooter.
 * Excel replaces sheet1.xml when headerFooter precedes pageSetup.
 */
function reorderPageSetupChildren(children: string[]): void {
    const order: string[] = ['printOptions', 'pageMargins', 'pageSetup', 'headerFooter'];
    const picked: string[][] = [[], [], [], []];
    let first: number = -1;
    for (let i: number = 0; i < children.length; i += 1) {
        const child: string = children[i];
        const rank: number = order.indexOf(elementLocalName(child));
        if (rank >= 0) {
            if (first < 0) {
                first = i;
            }
            picked[rank].push(child);
        }
    }
    if (first < 0) {
        return;
    }
    const rebuilt: string[] = [];
    let inserted: boolean = false;
    for (let i: number = 0; i < children.length; i += 1) {
        const child: string = children[i];
        if (order.indexOf(elementLocalName(child)) >= 0) {
            if (!inserted) {
                for (const bucket of picked) {
                    for (const item of bucket) {
                        rebuilt.push(item);
                    }
                }
                inserted = true;
            }
            continue;
        }
        rebuilt.push(child);
    }
    children.splice(0, children.length, ...rebuilt);
}

function elementLocalName(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[2]);
}

/**
 * elementOpenAttrs function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementOpenAttrs(el: string): string {
    const trimmed: string = el.trim();
    const m: RegExpExecArray = /^<[^>\s]+\s([^>]*?)\/?>/.exec(trimmed);
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[1]);
}

/**
 * elementInner function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementInner(el: string): string {
    const trimmed: string = el.trim();
    if (/\/>$/.test(trimmed)) {
        return '';
    }
    const openEnd: number = findTagEnd(trimmed, 0);
    if (openEnd < 0) {
        return '';
    }
    const closeStart: number = trimmed.lastIndexOf('</');
    if (closeStart < 0 || closeStart <= openEnd) {
        return '';
    }
    return trimmed.slice(openEnd + 1, closeStart);
}

/**
 * escapeRegExp function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
