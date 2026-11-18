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
/**
 * SpreadsheetML `ST_TableType` values. Citation: transitional sml.xsd.
 *
 * @private
 */
export declare type TableTypeValue = 'worksheet' | 'xml' | 'queryTable';
/**
 * SpreadsheetML `ST_TotalsRowFunction` values.
 * Citation: transitional sml.xsd ST_TotalsRowFunction.
 */
export declare type TotalsRowFunctionValue = 'none' | 'sum' | 'min' | 'max' | 'average' | 'count' | 'countNums' | 'stdDev' | 'var' | 'custom';
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
export declare function defaultAuthoredTableStyleInfo(): TableStyleInfoEntry;
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
export declare function emptyTablePartsModel(): TablePartsModel;
/**
 * CT_Worksheet local names that appear **before** `tableParts` after sheetData.
 * `tableParts` is the last content child before `extLst`.
 *
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export declare const TABLE_PARTS_PREDECESSORS_AFTER_SHEET_DATA: ReadonlyArray<string>;
/**
 * Index at which to insert serialized `tableParts` among after-sheetData
 * siblings (defaults to the end — `tableParts` precedes only `extList`).
 *
 * @param {ReadonlyArray<string>} afterSheetDataLocals - afterSheetDataLocals value.
 * @returns {number} Function result.
 */
export declare function findTablePartsInsertIndex(afterSheetDataLocals: ReadonlyArray<string>): number;
/**
 * Parse `tableParts` element XML. Soft-skips children that are not
 * `tablePart` or lack `r:id`.
 *
 * @param {string} xml - xml value.
 * @returns {TablePartsModel} Function result.
 * @private
 */
export declare function parseTablePartsXml(xml: string): TablePartsModel;
/**
 * Serialize `tableParts`. Returns `undefined` when no refs (omit element).
 *
 * @param {TablePartsModel} model - model value.
 * @returns {string | undefined} Function result.
 * @private
 */
export declare function serializeTablePartsXml(model: TablePartsModel): string | undefined;
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
export declare function parseTableXml(xml: string): TableEntry | undefined;
/**
 * Serialize a {@link TableEntry} to table part XML (root `<table>` element).
 * Schema child order: `autoFilter`? → `sortState`? → `tableColumns` →
 * `tableStyleInfo`? → `extLst`?. Attributes are emitted only when non-default.
 *
 * @param {TableEntry} entry - entry value.
 * @returns {string} Function result.
 * @private
 */
export declare function serializeTableXml(entry: TableEntry): string;
/**
 * Normalize opaque authoring formula text (strip single leading `=`).
 * Never evaluates. Same convention as cell / DV formulas.
 *
 * @param {string} text - text value.
 * @returns {string} Function result.
 * @private
 */
export declare function normalizeTableFormula(text: string): string;
