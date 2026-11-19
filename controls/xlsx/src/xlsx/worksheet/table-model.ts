/**
 * Worksheet table wire model, `tableParts` lift/emit, and table part
 * (`CT_Table`) parse / serialize.
 *
 * Citations:
 * - ECMA-376-1 §18.5 (`table`, `tableColumn(s)`, `tableStyleInfo`) and
 *   §12.3.21 Table Definition Part (content type)
 * - transitional sml.xsd `CT_Table` / `CT_TableColumns` / `CT_TableColumn` /
 *   `CT_TableFormula` / `CT_TableStyleInfo` / `ST_TotalsRowFunction` /
 *   `ST_TableType` / `CT_TableParts` / `CT_TablePart` and the `CT_Worksheet`
 *   sequence (… `webPublishItems` → `tableParts` → `extLst`)
 * - docs/specs/tables.md; docs/ooxml-mapping/tables.md
 *
 * Formulas are opaque text (never evaluated). Table ids are never renumbered;
 * new ids are allocated by the host (workbook max + 1).
 *
 * @private
 */

import { normalizeFormulaExpression } from '../cell/formula';
import { SPREADSHEETML_NS_TRANSITIONAL } from '../core/package/constants';
import { escapeXml, unescapeXml } from '../core/xml/minimal-xml';

/**
 * SpreadsheetML `ST_TableType` values. Citation: transitional sml.xsd.
 *
 * @private
 */
export type TableTypeValue = 'worksheet' | 'xml' | 'queryTable';

const TABLE_TYPES: ReadonlySet<string> = new Set([
    'worksheet',
    'xml',
    'queryTable'
]);

/**
 * SpreadsheetML `ST_TotalsRowFunction` values.
 * Citation: transitional sml.xsd ST_TotalsRowFunction.
 */
export type TotalsRowFunctionValue =
  | 'none'
  | 'sum'
  | 'min'
  | 'max'
  | 'average'
  | 'count'
  | 'countNums'
  | 'stdDev'
  | 'var'
  | 'custom';

const TOTALS_ROW_FUNCTIONS: ReadonlySet<string> = new Set([
    'none',
    'sum',
    'min',
    'max',
    'average',
    'count',
    'countNums',
    'stdDev',
    'var',
    'custom'
]);

/** XSD defaults for `CT_Table` attributes. */
const DEFAULT_TABLE_TYPE: TableTypeValue = 'worksheet';
const DEFAULT_HEADER_ROW_COUNT: number = 1;
const DEFAULT_TOTALS_ROW_COUNT: number = 0;
const DEFAULT_TOTALS_ROW_SHOWN: boolean = true;

/** XSD default for `CT_TableColumn@totalsRowFunction`. */
const DEFAULT_TOTALS_ROW_FUNCTION: TotalsRowFunctionValue = 'none';

/**
 * One `tableColumn` (`CT_TableColumn`) wire entry.
 *
 * @private
 */
export interface TableColumnEntry {
    /** `@id` — required unsigned int, unique within the table. */
    id: number;
    /** `@name` — required, unique within the table. */
    name: string;
    /** `@uniqueName` — optional. */
    uniqueName: string | undefined;
    /** `@totalsRowFunction` — `ST_TotalsRowFunction`, default `none`. */
    totalsRowFunction: TotalsRowFunctionValue;
    /**
     * Unknown `totalsRowFunction` text preserved from load (round-trip);
     * only rejected on authoring.
     */
    totalsRowFunctionRaw: string | undefined;
    /** `@totalsRowLabel` — optional. */
    totalsRowLabel: string | undefined;
    /** `@queryTableFieldId` — optional; preserved. */
    queryTableFieldId: number | undefined;
    /**
     * `calculatedColumnFormula` (`CT_TableFormula`) — opaque `ST_Formula`
     * text (leading `=` stripped on authoring).
     */
    calculatedColumnFormula: string | undefined;
    /** `calculatedColumnFormula/@array` — preserved (`CT_TableFormula`). */
    calculatedColumnFormulaArray: boolean;
    /** `totalsRowFormula` — opaque `ST_Formula` text. */
    totalsRowFormula: string | undefined;
    /** `totalsRowFormula/@array` — preserved. */
    totalsRowFormulaArray: boolean;
    /** `xmlColumnPr` opaque child XML when present. */
    xmlColumnPrXml: string | undefined;
    /** `extLst` opaque child XML when present (unknown children folded in parse order). */
    extLstXml: string | undefined;
    /** Column-level dxf-id attributes — preserved, not modeled (dxf = CF scope). */
    headerRowDxfId: number | undefined;
    dataDxfId: number | undefined;
    totalsRowDxfId: number | undefined;
    /** Column-level cell-style name attributes — preserved, not modeled. */
    headerRowCellStyle: string | undefined;
    dataCellStyle: string | undefined;
    totalsRowCellStyle: string | undefined;
    /** Extra attributes excluding modeled ones (XML fragment, no leading space). */
    extraAttrsXml: string;
}

/**
 * `tableStyleInfo` (`CT_TableStyleInfo`) wire model.
 * All flags default false; `name` optional.
 *
 * @private
 */
export interface TableStyleInfoEntry {
    name: string | undefined;
    showFirstColumn: boolean;
    showLastColumn: boolean;
    showRowStripes: boolean;
    showColumnStripes: boolean;
    /** Extra attributes excluding modeled ones. */
    extraAttrsXml: string;
}

/**
 * Excel-created worksheet tables always write `tableStyleInfo` matching the
 * workbook default table style (`styles.xml` `defaultTableStyle`, typically
 * `TableStyleMedium2`) with row stripes on. Omitting the element is
 * schema-legal but Microsoft Excel may repair the table part on open.
 * Citation: native Excel table parts (`excel-native-totals-probe.xlsx`).
 * Lives on the wire-model layer so serialize can apply the fallback without
 * importing the public `tables` façade (avoids tables ↔ table-model cycle).
 *
 * @returns {TableStyleInfoEntry} Function result.
 * @private
 */
export function defaultAuthoredTableStyleInfo(): TableStyleInfoEntry {
    return {
        name: 'TableStyleMedium2',
        showFirstColumn: false,
        showLastColumn: false,
        showRowStripes: true,
        showColumnStripes: false,
        extraAttrsXml: ''
    };
}

/**
 * One `table` root (`CT_Table`) wire model — the full table part content.
 *
 * @private
 */
export interface TableEntry {
    /** `@id` — required, workbook-unique. Never renumbered. */
    id: number;
    /** `@displayName` — required, unique per worksheet (public `Table.name`). */
    displayName: string;
    /** `@name` — optional metadata. */
    name: string | undefined;
    /** `@ref` — required `ST_Ref`, single rectangle, normalized compact A1. */
    ref: string;
    /** `@comment` — optional. */
    comment: string | undefined;
    /** `@tableType` — `ST_TableType`, default `worksheet`. Unknown text preserved. */
    tableType: TableTypeValue;
    /** Unknown `tableType` text preserved from load. */
    tableTypeRaw: string | undefined;
    /** `@headerRowCount` — default 1. */
    headerRowCount: number;
    /** `@insertRow` — default false. */
    insertRow: boolean;
    /** `@insertRowShift` — default false. */
    insertRowShift: boolean;
    /** `@totalsRowCount` — default 0. */
    totalsRowCount: number;
    /** `@totalsRowShown` — default true. */
    totalsRowShown: boolean;
    /** `@published` — default false. */
    published: boolean;
    /** `@connectionId` — optional; preserved as data (never resolved). */
    connectionId: number | undefined;
    /** Cell-style name attributes (`headerRowCellStyle`, `dataCellStyle`, `totalsRowCellStyle`). */
    headerRowCellStyle: string | undefined;
    dataCellStyle: string | undefined;
    totalsRowCellStyle: string | undefined;
    /** dxf-id attributes — preserved, not modeled (dxf scope is conditional formatting). */
    headerRowDxfId: number | undefined;
    dataDxfId: number | undefined;
    totalsRowDxfId: number | undefined;
    headerRowBorderDxfId: number | undefined;
    tableBorderDxfId: number | undefined;
    totalsRowBorderDxfId: number | undefined;
    /** Ordered `tableColumn` entries (`tableColumns`). */
    columns: TableColumnEntry[];
    /** Extra attributes on `tableColumns` excluding `count`. */
    tableColumnsExtraAttrsXml: string;
    /** `tableStyleInfo` when present. */
    styleInfo: TableStyleInfoEntry | undefined;
    /** `autoFilter` opaque child (`CT_AutoFilter`) when present. */
    autoFilterXml: string | undefined;
    /** `sortState` opaque child when present. */
    sortStateXml: string | undefined;
    /** `extLst` opaque child when present. */
    extLstXml: string | undefined;
    /**
     * Unknown `table` children (outside the `CT_Table` sequence) preserved in
     * relative order; emitted after `extLst` on serialize so no-op saves keep
     * them in the package.
     */
    unknownChildrenXml: string | undefined;
    /** Extra root attributes excluding modeled ones (XML fragment). */
    extraAttrsXml: string;
}

/**
 * Worksheet `tableParts` (`CT_TableParts`): ordered refs plus unknown attrs.
 *
 * @private
 */
export interface TablePartsModel {
    /** Ordered `tablePart@r:id` values in file order. */
    readonly relIds: ReadonlyArray<string>;
    /** Extra attributes on `tableParts` excluding `count`. */
    readonly extraAttrsXml: string;
}

/**
 * Empty `tableParts` model (element absent or all children skipped).
 *
 * @returns {TablePartsModel} Function result.
 * @private
 */
export function emptyTablePartsModel(): TablePartsModel {
    return { relIds: [], extraAttrsXml: '' };
}

/* ─────────────────────────── tableParts (worksheet child) ─────────────────── */

/**
 * CT_Worksheet local names that appear **before** `tableParts` after sheetData.
 * `tableParts` is the last content child before `extLst`.
 *
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const TABLE_PARTS_PREDECESSORS_AFTER_SHEET_DATA: ReadonlyArray<string> = [
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
    'hyperlinks',
    'printOptions',
    'pageMargins',
    'pageSetup',
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
    'webPublishItems'
];

const TABLE_PARTS_SUCC_SET: ReadonlySet<string> = new Set(['extLst']);

const TP_PRED_SET: ReadonlySet<string> = new Set(
    TABLE_PARTS_PREDECESSORS_AFTER_SHEET_DATA
);

/**
 * Index at which to insert serialized `tableParts` among after-sheetData
 * siblings (defaults to the end — `tableParts` precedes only `extList`).
 *
 * @param {ReadonlyArray<string>} afterSheetDataLocals - afterSheetDataLocals value.
 * @returns {number} Function result.
 */
export function findTablePartsInsertIndex(
    afterSheetDataLocals: ReadonlyArray<string>
): number {
    let lastPred: number = -1;
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && TP_PRED_SET.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && TABLE_PARTS_SUCC_SET.has(name)) {
            return i;
        }
    }
    return afterSheetDataLocals.length;
}

/**
 * Parse `tableParts` element XML. Soft-skips children that are not
 * `tablePart` or lack `r:id`.
 *
 * @param {string} xml - xml value.
 * @returns {TablePartsModel} Function result.
 * @private
 */
export function parseTablePartsXml(xml: string): TablePartsModel {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(xml));
    const extraAttrsXml: string = attrsToXmlExcludingLocal(
        attrs,
        new Set(['count', 'r:id', 'id'])
    );
    const relIds: string[] = [];
    for (const child of splitTopLevelLocal(elementInnerLocal(xml))) {
        if (elementLocalNameLocal(child) !== 'tablePart') {
            continue;
        }
        const childAttrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(child));
        const relId: string = (childAttrs.get('r:id') != null ? childAttrs.get('r:id') : childAttrs.get('id'));
        if (relId !== undefined && relId.trim().length > 0) {
            relIds.push(relId);
        }
    }
    return { relIds, extraAttrsXml };
}

/**
 * Serialize `tableParts`. Returns `undefined` when no refs (omit element).
 *
 * @param {TablePartsModel} model - model value.
 * @returns {string | undefined} Function result.
 * @private
 */
export function serializeTablePartsXml(model: TablePartsModel): string | undefined {
    if (model.relIds.length === 0) {
        return undefined;
    }
    const attrParts: string[] = [`count="${model.relIds.length}"`];
    if (model.extraAttrsXml.trim().length > 0) {
        attrParts.push(model.extraAttrsXml.trim());
    }
    const parts: string[] = [`<tableParts ${attrParts.join(' ')}>`];
    for (const relId of model.relIds) {
        parts.push(`<tablePart r:id="${escapeXml(relId)}"/>`);
    }
    parts.push('</tableParts>');
    return parts.join('');
}

/* ───────────────────────────── table part (CT_Table) ───────────────────────── */

/** Modeled root attributes of `CT_Table` (excluded from `extraAttrsXml`). */
const MODELED_TABLE_ATTRS: ReadonlySet<string> = new Set([
    'id',
    'name',
    'displayName',
    'comment',
    'ref',
    'tableType',
    'headerRowCount',
    'insertRow',
    'insertRowShift',
    'totalsRowCount',
    'totalsRowShown',
    'published',
    'connectionId',
    'headerRowDxfId',
    'dataDxfId',
    'totalsRowDxfId',
    'headerRowBorderDxfId',
    'tableBorderDxfId',
    'totalsRowBorderDxfId',
    'headerRowCellStyle',
    'dataCellStyle',
    'totalsRowCellStyle'
]);

/** Modeled `tableColumn` attributes (excluded from column `extraAttrsXml`). */
const MODELED_COLUMN_ATTRS: ReadonlySet<string> = new Set([
    'id',
    'uniqueName',
    'name',
    'totalsRowFunction',
    'totalsRowLabel',
    'queryTableFieldId',
    'headerRowDxfId',
    'dataDxfId',
    'totalsRowDxfId',
    'headerRowCellStyle',
    'dataCellStyle',
    'totalsRowCellStyle'
]);

/** Column-level dxf-id / cell-style attributes — preserved, not modeled. */
interface ColumnPreservedAttrs {
    headerRowDxfId: number | undefined;
    dataDxfId: number | undefined;
    totalsRowDxfId: number | undefined;
    headerRowCellStyle: string | undefined;
    dataCellStyle: string | undefined;
    totalsRowCellStyle: string | undefined;
}

/**
 * Parse a table part (`<table>` root element XML) into a {@link TableEntry}.
 * Returns `undefined` (soft-skip) when a required attr is missing/unparseable:
 * `id`, `displayName`, `ref`, or when `tableColumns` is absent.
 * Column entries missing `id`/`name` are soft-skipped individually.
 *
 * @param {string} xml - xml value.
 * @returns {TableEntry | undefined} Function result.
 * @private
 */
export function parseTableXml(xml: string): TableEntry | undefined {
    // Strip an XML prolog / comments so element matching starts at `<table`.
    const body: string = stripPrologAndCommentsLocal(xml);
    const rootAttrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(body));

    const id: number = parseOptionalUnsigned(rootAttrs.get('id'));
    const displayName: string = rootAttrs.get('displayName');
    const refRaw: string = rootAttrs.get('ref');
    if (
        id === undefined ||
    displayName === undefined ||
    displayName.length === 0 ||
    refRaw === undefined ||
    refRaw.trim().length === 0
    ) {
        return undefined;
    }

    const tableTypeRaw: string = rootAttrs.get('tableType');
    let tableType: TableTypeValue = DEFAULT_TABLE_TYPE;
    let tableTypeRawOut: string | undefined;
    if (tableTypeRaw !== undefined && tableTypeRaw.length > 0) {
        if (!TABLE_TYPES.has(tableTypeRaw)) {
            tableTypeRawOut = tableTypeRaw; // preserve unknown text for round-trip
        } else {
            tableType = tableTypeRaw as TableTypeValue;
        }
    }

    const extraAttrsXml: string = attrsToXmlExcludingLocal(rootAttrs, MODELED_TABLE_ATTRS);
    const inner: string = elementInnerLocal(body);

    // Children in any input order; serialization restores schema order with
    // unknown children preserved in relative order.
    const children: string[] = splitTopLevelLocal(inner);
    const columns: TableColumnEntry[] = [];
    let tableColumnsExtraAttrsXml: string | undefined;
    let styleInfo: TableStyleInfoEntry | undefined;
    let autoFilterXml: string | undefined;
    let sortStateXml: string | undefined;
    let extLstXml: string | undefined;
    const unknownChildren: string[] = [];

    for (const child of children) {
        const local: string = elementLocalNameLocal(child);
        switch (local) {
        case 'tableColumns':
            tableColumnsExtraAttrsXml = attrsToXmlExcludingLocal(
                parseAttrMapLocal(elementOpenAttrsLocal(child)),
                new Set(['count'])
            ).trim();
            for (const colEl of splitTopLevelLocal(elementInnerLocal(child))) {
                if (elementLocalNameLocal(colEl) !== 'tableColumn') {
                    continue;
                }
                const parsed: TableColumnEntry = parseTableColumn(colEl);
                if (parsed !== undefined) {
                    columns.push(parsed);
                }
            }
            break;
        case 'tableStyleInfo':
            styleInfo = parseTableStyleInfo(child);
            break;
        case 'autoFilter':
        case 'sortState':
        case 'extLst':
        // Modeled-position children preserved opaque (criteria semantics
        // belong to the AutoFilter feature scope; extLst always opaque).
            if (local === 'autoFilter') {
                autoFilterXml = child;
            } else if (local === 'sortState') {
                sortStateXml = child;
            } else {
                extLstXml = child;
            }
            break;
        default:
            unknownChildren.push(child);
            break;
        }
    }

    if (columns.length === 0) {
    // `tableColumns` is required (minOccurs 1, ≥1 column); treat its absence
    // or an all-skipped column list as an unparseable table (soft-skip).
        return undefined;
    }

    // Table-level preserved dxf-id / cell-style attrs.
    const dxfIds: {
        headerRowDxfId: number;
        dataDxfId: number;
        totalsRowDxfId: number;
        headerRowBorderDxfId: number;
        tableBorderDxfId: number;
        totalsRowBorderDxfId: number;
    } = parseDxfIdAttrs(rootAttrs);
    const cellStyles: { headerRowCellStyle: string; dataCellStyle: string; totalsRowCellStyle: string; } = parseCellStyleAttrs(rootAttrs);
    const unknownChildrenXml: string =
    unknownChildren.length > 0 ? unknownChildren.join('') : undefined;

    return {
        id,
        displayName,
        name: optionalNonEmpty(rootAttrs.get('name')),
        ref: refRaw.trim(),
        comment: optionalNonEmpty(rootAttrs.get('comment')),
        tableType,
        tableTypeRaw: tableTypeRawOut,
        headerRowCount: (() => { const __h: number = parseOptionalUnsigned(rootAttrs.get('headerRowCount')); return __h !== undefined ? __h : DEFAULT_HEADER_ROW_COUNT; })(),
        insertRow: parseBoolAttr(rootAttrs.get('insertRow'), false),
        insertRowShift: parseBoolAttr(rootAttrs.get('insertRowShift'), false),
        totalsRowCount: (() => { const __t: number = parseOptionalUnsigned(rootAttrs.get('totalsRowCount')); return __t !== undefined ? __t : DEFAULT_TOTALS_ROW_COUNT; })(),
        totalsRowShown: parseBoolAttr(rootAttrs.get('totalsRowShown'), DEFAULT_TOTALS_ROW_SHOWN),
        published: parseBoolAttr(rootAttrs.get('published'), false),
        connectionId: parseOptionalUnsigned(rootAttrs.get('connectionId')),
        ...dxfIds,
        ...cellStyles,
        columns,
        tableColumnsExtraAttrsXml: (tableColumnsExtraAttrsXml != null ? tableColumnsExtraAttrsXml : ''),
        styleInfo,
        autoFilterXml,
        sortStateXml,
        extLstXml,
        unknownChildrenXml,
        extraAttrsXml
    };
}

/**
 * parseTableColumn function.
 *
 * @param {string} el - el value.
 * @returns {TableColumnEntry | undefined} Function result.
 */
function parseTableColumn(el: string): TableColumnEntry | undefined {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(el));
    const id: number = parseOptionalUnsigned(attrs.get('id'));
    const name: string = attrs.get('name');
    if (id === undefined || name === undefined || name.length === 0) {
        return undefined;
    }

    const fnRaw: string = optionalNonEmpty(attrs.get('totalsRowFunction'));
    let totalsRowFunction: TotalsRowFunctionValue = DEFAULT_TOTALS_ROW_FUNCTION;
    let totalsRowFunctionRaw: string | undefined;
    if (fnRaw !== undefined) {
        if (!TOTALS_ROW_FUNCTIONS.has(fnRaw)) {
            totalsRowFunctionRaw = fnRaw; // preserve unknown text for round-trip
        } else {
            totalsRowFunction = fnRaw as TotalsRowFunctionValue;
        }
    }

    const preserved: ColumnPreservedAttrs = parseColumnPreservedAttrs(attrs);
    const extraAttrsXml: string = attrsToXmlExcludingLocal(attrs, MODELED_COLUMN_ATTRS);

    let calculatedColumnFormula: string | undefined;
    let calculatedColumnFormulaArray: boolean = false;
    let totalsRowFormula: string | undefined;
    let totalsRowFormulaArray: boolean = false;
    let xmlColumnPrXml: string | undefined;
    let extLstXml: string | undefined;
    const unknownChildren: string[] = [];

    for (const child of splitTopLevelLocal(elementInnerLocal(el))) {
        const local: string = elementLocalNameLocal(child);
        if (local === 'calculatedColumnFormula') {
            calculatedColumnFormula = formulaText(child);
            calculatedColumnFormulaArray = parseBoolAttr(
                parseAttrMapLocal(elementOpenAttrsLocal(child)).get('array'),
                false
            );
        } else if (local === 'totalsRowFormula') {
            totalsRowFormula = formulaText(child);
            totalsRowFormulaArray = parseBoolAttr(
                parseAttrMapLocal(elementOpenAttrsLocal(child)).get('array'),
                false
            );
        } else if (local === 'xmlColumnPr') {
            xmlColumnPrXml = child;
        } else if (local === 'extLst') {
            extLstXml = child;
        } else {
            unknownChildren.push(child);
        }
    }

    // Unknown children must survive round-trip: fold them into the extLst
    // bag at parse order so no-op saves keep every child in the package.
    const unknownChildrenXml: string = unknownChildren.join('');

    return {
        id,
        name,
        uniqueName: optionalNonEmpty(attrs.get('uniqueName')),
        totalsRowFunction,
        totalsRowFunctionRaw,
        totalsRowLabel: optionalNonEmpty(attrs.get('totalsRowLabel')),
        queryTableFieldId: parseOptionalUnsigned(attrs.get('queryTableFieldId')),
        calculatedColumnFormula,
        calculatedColumnFormulaArray,
        totalsRowFormula,
        totalsRowFormulaArray,
        xmlColumnPrXml,
        extLstXml: extLstXml !== undefined || unknownChildrenXml.length > 0
            ? [extLstXml, unknownChildrenXml].filter((x: string) => x !== undefined && x.length > 0).join('')
            : undefined,
        extraAttrsXml,
        ...preserved
    };
}

/**
 * parseTableStyleInfo function.
 *
 * @param {string} el - el value.
 * @returns {TableStyleInfoEntry} Function result.
 */
function parseTableStyleInfo(el: string): TableStyleInfoEntry {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(el));
    return {
        name: optionalNonEmpty(attrs.get('name')),
        showFirstColumn: parseBoolAttr(attrs.get('showFirstColumn'), false),
        showLastColumn: parseBoolAttr(attrs.get('showLastColumn'), false),
        showRowStripes: parseBoolAttr(attrs.get('showRowStripes'), false),
        showColumnStripes: parseBoolAttr(attrs.get('showColumnStripes'), false),
        extraAttrsXml: attrsToXmlExcludingLocal(
            attrs,
            new Set(['name', 'showFirstColumn', 'showLastColumn', 'showRowStripes', 'showColumnStripes'])
        )
    };
}

/**
 * parseDxfIdAttrs function.
 *
 * @param {Map<string, string>} attrs - attrs value.
 * @returns {*} Function result.
 */
function parseDxfIdAttrs(attrs: Map<string, string>) : {
    headerRowDxfId: number | undefined;
    dataDxfId: number | undefined;
    totalsRowDxfId: number | undefined;
    headerRowBorderDxfId: number | undefined;
    tableBorderDxfId: number | undefined;
    totalsRowBorderDxfId: number | undefined;
} {
    return {
        headerRowDxfId: parseOptionalUnsigned(attrs.get('headerRowDxfId')),
        dataDxfId: parseOptionalUnsigned(attrs.get('dataDxfId')),
        totalsRowDxfId: parseOptionalUnsigned(attrs.get('totalsRowDxfId')),
        headerRowBorderDxfId: parseOptionalUnsigned(attrs.get('headerRowBorderDxfId')),
        tableBorderDxfId: parseOptionalUnsigned(attrs.get('tableBorderDxfId')),
        totalsRowBorderDxfId: parseOptionalUnsigned(attrs.get('totalsRowBorderDxfId'))
    };
}

/**
 * parseCellStyleAttrs function.
 *
 * @param {Map<string, string>} attrs - attrs value.
 * @returns {*} Function result.
 */
function parseCellStyleAttrs(attrs: Map<string, string>) : {
    headerRowCellStyle: string | undefined;
    dataCellStyle: string | undefined;
    totalsRowCellStyle: string | undefined;
} {
    return {
        headerRowCellStyle: optionalNonEmpty(attrs.get('headerRowCellStyle')),
        dataCellStyle: optionalNonEmpty(attrs.get('dataCellStyle')),
        totalsRowCellStyle: optionalNonEmpty(attrs.get('totalsRowCellStyle'))
    };
}

/**
 * parseColumnPreservedAttrs function.
 *
 * @param {Map<string, string>} attrs - attrs value.
 * @returns {ColumnPreservedAttrs} Function result.
 */
function parseColumnPreservedAttrs(attrs: Map<string, string>): ColumnPreservedAttrs {
    return {
        ...parseDxfIdAttrs(attrs),
        ...parseCellStyleAttrs(attrs)
    };
}

/**
 * Opaque formula text from a `CT_TableFormula` element.
 *
 * @param {string} el - el value.
 * @returns {string | undefined} Function result.
 */
function formulaText(el: string): string | undefined {
    const text: string = elementInnerTextLocal(el);
    if (text.length === 0) {
        return undefined;
    }
    return text;
}

/**
 * Serialize a {@link TableEntry} to table part XML (root `<table>` element).
 * Schema child order: `autoFilter`? → `sortState`? → `tableColumns` →
 * `tableStyleInfo`? → `extLst`?. Attributes are emitted only when non-default.
 *
 * @param {TableEntry} entry - entry value.
 * @returns {string} Function result.
 * @private
 */
export function serializeTableXml(entry: TableEntry): string {
    const attrs: string[] = [];
    attrs.push(`id="${entry.id}"`);
    // @name is REQUIRED by ECMA-376 and must always be present.
    // When undefined, default to displayName. This matches native Excel behavior.
    const nameAttr: string = entry.name != null ? entry.name : entry.displayName;
    attrs.push(`name="${escapeXml(nameAttr)}"`);
    attrs.push(`displayName="${escapeXml(entry.displayName)}"`);
    if (entry.comment !== undefined) {
        attrs.push(`comment="${escapeXml(entry.comment)}"`);
    }
    attrs.push(`ref="${escapeXml(entry.ref)}"`);
    const tableTypeAttr: string = (entry.tableTypeRaw != null ? entry.tableTypeRaw : entry.tableType);
    if (entry.tableTypeRaw !== undefined || entry.tableType !== DEFAULT_TABLE_TYPE) {
        attrs.push(`tableType="${escapeXml(tableTypeAttr)}"`);
    }
    if (entry.headerRowCount !== DEFAULT_HEADER_ROW_COUNT) {
        attrs.push(`headerRowCount="${entry.headerRowCount}"`);
    }
    if (entry.insertRow) {
        attrs.push('insertRow="1"');
    }
    if (entry.insertRowShift) {
        attrs.push('insertRowShift="1"');
    }
    if (entry.totalsRowCount !== DEFAULT_TOTALS_ROW_COUNT) {
        attrs.push(`totalsRowCount="${entry.totalsRowCount}"`);
    }
    if (!entry.totalsRowShown) {
        attrs.push('totalsRowShown="0"');
    }
    if (entry.published) {
        attrs.push('published="1"');
    }
    if (entry.connectionId !== undefined) {
        attrs.push(`connectionId="${entry.connectionId}"`);
    }
    pushOptionalUnsignedAttr(attrs, 'headerRowDxfId', entry.headerRowDxfId);
    pushOptionalUnsignedAttr(attrs, 'dataDxfId', entry.dataDxfId);
    pushOptionalUnsignedAttr(attrs, 'totalsRowDxfId', entry.totalsRowDxfId);
    pushOptionalUnsignedAttr(attrs, 'headerRowBorderDxfId', entry.headerRowBorderDxfId);
    pushOptionalUnsignedAttr(attrs, 'tableBorderDxfId', entry.tableBorderDxfId);
    pushOptionalUnsignedAttr(attrs, 'totalsRowBorderDxfId', entry.totalsRowBorderDxfId);
    pushOptionalStringAttr(attrs, 'headerRowCellStyle', entry.headerRowCellStyle);
    pushOptionalStringAttr(attrs, 'dataCellStyle', entry.dataCellStyle);
    pushOptionalStringAttr(attrs, 'totalsRowCellStyle', entry.totalsRowCellStyle);
    if (entry.extraAttrsXml.trim().length > 0) {
        attrs.push(entry.extraAttrsXml.trim());
    }

    const children: string[] = [];
    if (entry.autoFilterXml !== undefined) {
        children.push(entry.autoFilterXml);
    }
    if (entry.sortStateXml !== undefined) {
        children.push(entry.sortStateXml);
    }
    children.push(serializeTableColumns(entry.columns, entry.tableColumnsExtraAttrsXml));
    // Excel requires tableStyleInfo for file validity. When missing, emit
    // default Medium2 (matches Tables.add). User-intentional clears are
    // preserved through the styleInfo object itself; this fallback is
    // serialization-only and does not mutate the model.
    const styleToEmit: TableStyleInfoEntry = entry.styleInfo != null
        ? entry.styleInfo
        : defaultAuthoredTableStyleInfo();
    children.push(serializeTableStyleInfo(styleToEmit));
    if (entry.extLstXml !== undefined) {
        children.push(entry.extLstXml);
    }
    if (entry.unknownChildrenXml !== undefined) {
        children.push(entry.unknownChildrenXml);
    }

    // Default SpreadsheetML namespace: the table part is parsed standalone,
    // so namespace declarations from the source document are not in scope —
    // re-declare on the root or the part is not well-formed. Corpus: every
    // table part root example (ECMA-376-1 §18.5) carries it.
    return `<table xmlns="${SPREADSHEETML_NS_TRANSITIONAL}" ${attrs.join(' ')}>${children.join('')}</table>`;
}

/**
 * serializeTableColumns function.
 *
 * @param {ReadonlyArray<TableColumnEntry>} columns - columns value.
 * @param {string} extraAttrsXml - extraAttrsXml value.
 * @returns {string} Function result.
 */
function serializeTableColumns(
    columns: ReadonlyArray<TableColumnEntry>,
    extraAttrsXml: string
): string {
    const attrParts: string[] = [`count="${columns.length}"`];
    if (extraAttrsXml.trim().length > 0) {
        attrParts.push(extraAttrsXml.trim());
    }
    const parts: string[] = [`<tableColumns ${attrParts.join(' ')}>`];
    for (const col of columns) {
        parts.push(serializeTableColumn(col));
    }
    parts.push('</tableColumns>');
    return parts.join('');
}

/**
 * serializeTableColumn function.
 *
 * @param {TableColumnEntry} col - col value.
 * @returns {string} Function result.
 */
function serializeTableColumn(col: TableColumnEntry): string {
    const attrs: string[] = [];
    attrs.push(`id="${col.id}"`);
    if (col.uniqueName !== undefined) {
        attrs.push(`uniqueName="${escapeXml(col.uniqueName)}"`);
    }
    attrs.push(`name="${escapeXml(col.name)}"`);
    const fnAttr: string = (col.totalsRowFunctionRaw != null ? col.totalsRowFunctionRaw : col.totalsRowFunction);
    // Emit totalsRowFunction only when non-default or unknown-from-load.
    // XSD default is `none`; Excel omits the attribute for label-only columns
    // (MS-OE376 / native table parts: totalsRowLabel without totalsRowFunction).
    // Do not force `none` merely because totalsRowLabel is set.
    if (col.totalsRowFunctionRaw !== undefined || col.totalsRowFunction !== DEFAULT_TOTALS_ROW_FUNCTION) {
        attrs.push(`totalsRowFunction="${escapeXml(fnAttr)}"`);
    }
    if (col.totalsRowLabel !== undefined) {
        attrs.push(`totalsRowLabel="${escapeXml(col.totalsRowLabel)}"`);
    }
    if (col.queryTableFieldId !== undefined) {
        attrs.push(`queryTableFieldId="${col.queryTableFieldId}"`);
    }
    pushOptionalUnsignedAttr(attrs, 'headerRowDxfId', col.headerRowDxfId);
    pushOptionalUnsignedAttr(attrs, 'dataDxfId', col.dataDxfId);
    pushOptionalUnsignedAttr(attrs, 'totalsRowDxfId', col.totalsRowDxfId);
    pushOptionalStringAttr(attrs, 'headerRowCellStyle', col.headerRowCellStyle);
    pushOptionalStringAttr(attrs, 'dataCellStyle', col.dataCellStyle);
    pushOptionalStringAttr(attrs, 'totalsRowCellStyle', col.totalsRowCellStyle);
    if (col.extraAttrsXml.trim().length > 0) {
        attrs.push(col.extraAttrsXml.trim());
    }

    const children: string[] = [];
    if (col.calculatedColumnFormula !== undefined) {
        children.push(serializeTableFormula('calculatedColumnFormula', col.calculatedColumnFormula, col.calculatedColumnFormulaArray));
    }
    // Emit totalsRowFormula only for custom (or unknown raw) columns. Excel
    // repairs away table parts that pair a built-in totalsRowFunction (e.g.
    // sum) with a nested totalsRowFormula while the occupied cell is a
    // SUBTOTAL structured ref (MS-OE376 §2.1.710(n) cell/function match).
    const fnWire: string = col.totalsRowFunctionRaw != null ? col.totalsRowFunctionRaw : col.totalsRowFunction;
    if (
        col.totalsRowFormula !== undefined &&
        (fnWire === 'custom' || col.totalsRowFunctionRaw !== undefined)
    ) {
        children.push(serializeTableFormula('totalsRowFormula', col.totalsRowFormula, col.totalsRowFormulaArray));
    }
    if (col.xmlColumnPrXml !== undefined) {
        children.push(col.xmlColumnPrXml);
    }
    if (col.extLstXml !== undefined) {
        children.push(col.extLstXml);
    }

    const open: string = `<tableColumn ${attrs.join(' ')}`;
    if (children.length === 0) {
        return `${open}/>`;
    }
    return `${open}>${children.join('')}</tableColumn>`;
}

/**
 * serializeTableFormula function.
 *
 * @param {string} localName - localName value.
 * @param {string} formula - formula value.
 * @param {boolean} isArray - isArray value.
 * @returns {string} Function result.
 */
function serializeTableFormula(
    localName: string,
    formula: string,
    isArray: boolean
): string {
    if (isArray) {
        return `<${localName} array="1">${escapeXml(formula)}</${localName}>`;
    }
    return `<${localName}>${escapeXml(formula)}</${localName}>`;
}

/**
 * serializeTableStyleInfo function.
 *
 * @param {TableStyleInfoEntry} style - style value.
 * @returns {string} Function result.
 */
function serializeTableStyleInfo(style: TableStyleInfoEntry): string {
    const attrs: string[] = [];
    if (style.name !== undefined) {
        attrs.push(`name="${escapeXml(style.name)}"`);
    }
    // Excel always writes the four stripe/column flags as "0"/"1" on create
    // (see native table parts). Emitting only true flags is schema-legal but
    // diverges from Excel wire; write all four for interoperability.
    attrs.push(`showFirstColumn="${style.showFirstColumn ? '1' : '0'}"`);
    attrs.push(`showLastColumn="${style.showLastColumn ? '1' : '0'}"`);
    attrs.push(`showRowStripes="${style.showRowStripes ? '1' : '0'}"`);
    attrs.push(`showColumnStripes="${style.showColumnStripes ? '1' : '0'}"`);
    if (style.extraAttrsXml.trim().length > 0) {
        attrs.push(style.extraAttrsXml.trim());
    }
    return `<tableStyleInfo ${attrs.join(' ')}/>`;
}

/**
 * Normalize opaque authoring formula text (strip single leading `=`).
 * Never evaluates. Same convention as cell / DV formulas.
 *
 * @param {string} text - text value.
 * @returns {string} Function result.
 * @private
 */
export function normalizeTableFormula(text: string): string {
    return normalizeFormulaExpression(text);
}

/**
 * pushOptionalUnsignedAttr function.
 *
 * @param {string[]} attrs - attrs value.
 * @param {string} name - name value.
 * @param {number | undefined} value - value value.
 * @returns {void} Nothing.
 */
function pushOptionalUnsignedAttr(
    attrs: string[],
    name: string,
    value: number | undefined
): void {
    if (value !== undefined) {
        attrs.push(`${name}="${value}"`);
    }
}

/**
 * pushOptionalStringAttr function.
 *
 * @param {string[]} attrs - attrs value.
 * @param {string} name - name value.
 * @param {string | undefined} value - value value.
 * @returns {void} Nothing.
 */
function pushOptionalStringAttr(
    attrs: string[],
    name: string,
    value: string | undefined
): void {
    if (value !== undefined) {
        attrs.push(`${name}="${escapeXml(value)}"`);
    }
}

/**
 * optionalNonEmpty function.
 *
 * @param {string | undefined} raw - raw value.
 * @returns {string | undefined} Function result.
 */
function optionalNonEmpty(raw: string | undefined): string | undefined {
    if (raw === undefined || raw.length === 0) {
        return undefined;
    }
    return raw;
}

/**
 * parseBoolAttr function.
 *
 * @param {string | undefined} raw - raw value.
 * @param {boolean} defaultValue - defaultValue value.
 * @returns {boolean} Function result.
 */
function parseBoolAttr(raw: string | undefined, defaultValue: boolean): boolean {
    if (raw === undefined) {
        return defaultValue;
    }
    const v: string = raw.trim().toLowerCase();
    if (v === '1' || v === 'true') {
        return true;
    }
    if (v === '0' || v === 'false') {
        return false;
    }
    return defaultValue;
}

/**
 * parseOptionalUnsigned function.
 *
 * @param {string | undefined} raw - raw value.
 * @returns {number | undefined} Function result.
 */
function parseOptionalUnsigned(raw: string | undefined): number | undefined {
    if (raw === undefined || raw.trim().length === 0) {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) {
        return undefined;
    }
    return n;
}

/* ── minimal local XML helpers (mirror data-validations, avoid cycles) ── */

/**
 * Remove `<?xml ...?>` prolog and comments/comments-doctype noise.
 *
 * @param {string} s - s value.
 * @returns {string} Function result.
 */
function stripPrologAndCommentsLocal(s: string): string {
    let out: string = s;
    for (;;) {
        const pi: number = out.indexOf('<?');
        if (pi >= 0) {
            const end: number = out.indexOf('?>', pi);
            out = end < 0 ? out.slice(0, pi) : out.slice(0, pi) + out.slice(end + 2);
            continue;
        }
        const cm: number = out.indexOf('<!--');
        if (cm >= 0) {
            const end: number = out.indexOf('-->', cm);
            out = end < 0 ? out.slice(0, cm) : out.slice(0, cm) + out.slice(end + 3);
            continue;
        }
        break;
    }
    return out.trim();
}

/**
 * elementLocalNameLocal function.
 *
 * @param {string} el - el value.
 * @returns {string} Function result.
 */
function elementLocalNameLocal(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- static OOXML tag scanner; input is package XML not attacker-controlled regex
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
    return ((__t: string) => __t != null ? __t : '')(m == null ? undefined : m[2]);
}

/**
 * elementOpenAttrsLocal function.
 *
 * @param {string} el - el value.
 * @returns {string} Function result.
 */
function elementOpenAttrsLocal(el: string): string {
    const trimmed: string = el.trim();
    const m: RegExpExecArray = /^<[^>\s]+\s([^>]*?)\/?>/.exec(trimmed);
    return ((__t: string) => __t != null ? __t : '')(m == null ? undefined : m[1]);
}

/**
 * findTagEndLocal function.
 *
 * @param {string} s - s value.
 * @param {number} from - from value.
 * @returns {number} Function result.
 */
function findTagEndLocal(s: string, from: number): number {
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
 * findClosingLocal function.
 *
 * @param {string} s - s value.
 * @param {string} localName - localName value.
 * @param {number} from - from value.
 * @returns {number} Function result.
 */
function findClosingLocal(s: string, localName: string, from: number): number {
    // eslint-disable-next-line security/detect-non-literal-regexp -- pattern built from escaped fixed local names / OOXML tags
    const openPat: RegExp = new RegExp(
        `<([A-Za-z_][\\w.-]*:)?${escapeRegExpLocal(localName)}(?=[\\s>/])`,
        'g'
    );
    // eslint-disable-next-line security/detect-non-literal-regexp -- pattern built from escaped fixed local names / OOXML tags
    const closePat: RegExp = new RegExp(
        `</([A-Za-z_][\\w.-]*:)?${escapeRegExpLocal(localName)}\\s*>`,
        'g'
    );
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
            const tagEnd: number = findTagEndLocal(s, om.index);
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
 * elementInnerLocal function.
 *
 * @param {string} el - el value.
 * @returns {string} Function result.
 */
function elementInnerLocal(el: string): string {
    const trimmed: string = el.trim();
    if (/\/>$/.test(trimmed)) {
        return '';
    }
    const openEnd: number = findTagEndLocal(trimmed, 0);
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
 * elementInnerTextLocal function.
 *
 * @param {string} el - el value.
 * @returns {string} Function result.
 */
function elementInnerTextLocal(el: string): string {
    return elementInnerLocal(el);
}

/**
 * splitTopLevelLocal function.
 *
 * @param {string} s - s value.
 * @returns {string[]} Function result.
 */
function splitTopLevelLocal(s: string): string[] {
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
        const openEnd: number = findTagEndLocal(s, lt);
        if (openEnd < 0) {
            break;
        }
        const openTag: string = s.slice(lt, openEnd + 1);
        if (openTag.endsWith('/>') || /\/\s*>$/.test(openTag)) {
            result.push(s.slice(lt, openEnd + 1));
            i = openEnd + 1;
            continue;
        }
        const local: string = elementLocalNameLocal(openTag);
        const close: number = findClosingLocal(s, local, openEnd + 1);
        if (close < 0) {
            result.push(s.slice(lt).trim());
            break;
        }
        result.push(s.slice(lt, close).replace(/\s+$/, ''));
        i = close;
    }
    return result.map((x: string) => x.trim()).filter((x: string) => x.length > 0);
}

/**
 * parseAttrMapLocal function.
 *
 * @param {string} attrText - attrText value.
 * @returns {Map<string, string>} Function result.
 */
function parseAttrMapLocal(attrText: string): Map<string, string> {
    const map: Map<string, string> = new Map<string, string>();
    const re: RegExp = /([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    for (;;) {
        const m: RegExpExecArray = re.exec(attrText);
        if (m === null) {
            break;
        }
        const name: string = m[1];
        if (name === undefined) {
            continue;
        }
        const raw: string = ((__t: string) => __t != null ? __t : '')(m[2] != null ? m[2] : m[3]);
        const value: string = unescapeXml(raw);
        map.set(name, value);
        const local: string = name.includes(':') ? name.slice(name.indexOf(':') + 1) : name;
        if (!map.has(local)) {
            map.set(local, value);
        }
    }
    return map;
}

/**
 * attrsToXmlExcludingLocal function.
 *
 * @param {Map<string, string>} attrs - attrs value.
 * @param {ReadonlySet<string>} exclude - exclude value.
 * @returns {string} Function result.
 */
function attrsToXmlExcludingLocal(
    attrs: Map<string, string>,
    exclude: ReadonlySet<string>
): string {
    const parts: string[] = [];
    const seen: Set<string> = new Set<string>();
    for (const [k, v] of attrs) {
        if (exclude.has(k)) {
            continue;
        }
        const local: string = k.includes(':') ? k.slice(k.indexOf(':') + 1) : k;
        if (exclude.has(local)) {
            continue;
        }
        if (k === 'xmlns' || k.startsWith('xmlns:')) {
            continue;
        }
        if (seen.has(k)) {
            continue;
        }
        seen.add(k);
        parts.push(`${k}="${escapeXml(v)}"`);
    }
    return parts.join(' ');
}

/**
 * escapeRegExpLocal function.
 *
 * @param {string} s - s value.
 * @returns {string} Function result.
 */
function escapeRegExpLocal(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

