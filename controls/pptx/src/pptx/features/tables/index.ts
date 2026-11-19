/**
 * Optional DrawingML tables module (`@syncfusion/ej2-pptx/tables`).
 *
 * @remarks
 * Detect/read table graphic frames without pulling table semantics into the core
 * bundle. Importing this entry registers feature id {@link TABLES_FEATURE_ID}.
 * Core continues to preserve `graphicFrame` / `a:tbl` when this module is absent.
 *
 * **TASK-1082** / **TASK-1086**: {@link addTable} / {@link removeTable} are
 * declared directly on the core {@link Slide} class (API-RULES R6.2). Tables are
 * inline under the graphic frame (no package parts). There is no `slide.tables`
 * collection — use {@link asTable}.
 *
 * Citations: req/spec **038**; ADR `2026-09-22-table-create-structural`;
 * TASK-1080 lock.
 *
 * @packageDocumentation
 */
import { registerFeature } from '../../core/registry/feature-registry';
import { addTable, AddTableOptions } from './add-table';
import { BuiltInTableStyle } from './built-in-table-style';
import { Shape } from '../../core/shapes/shape';
import { asTable, tableShapeMaterializer } from './as-table';   
import { removeTable } from './remove-table';
import { DRAWINGML_TABLE_URI, TABLES_FEATURE_ID } from './constants';
import { DEFAULT_TABLE_BOUNDS, DEFAULT_TABLE_NAME, buildEmptyTableCell, buildTableGraphicFrame, buildTbl,
    resolveColumnWidthsEmu, resolveRowHeightsEmu } from './create-table-seed';
import { BuildTableGraphicFrameArgs, BuildTblArgs } from './create-table-seed';
import { TablesError } from './errors';
import { Table } from './table';
import { AddTableColumnOptions, AddTableRowOptions } from './table';
import { TableCell } from './table-cell';
import { DirectTableCellProperties, DirectTableCellPropertiesPatch, TableMergeInfo } from './table-types';
registerFeature({ id: TABLES_FEATURE_ID });
Shape.materializer = tableShapeMaterializer;
export { addTable, removeTable, asTable, DRAWINGML_TABLE_URI, Table, TableCell, TablesError, TABLES_FEATURE_ID,
    DEFAULT_TABLE_BOUNDS, DEFAULT_TABLE_NAME, buildEmptyTableCell, buildTableGraphicFrame, buildTbl, resolveColumnWidthsEmu,
    resolveRowHeightsEmu, BuiltInTableStyle };
export { AddTableOptions, AddTableColumnOptions, AddTableRowOptions, DirectTableCellProperties, DirectTableCellPropertiesPatch,
    TableMergeInfo, BuildTableGraphicFrameArgs, BuildTblArgs };

/** Complete authored gradient data returned by optional table/cell gradientFill. */
export { AuthoredGradientFill } from '../../core/theme/gradient-types';

export { TableFillChoice, TableStyleFillSnapshot, TableCellFillSnapshot, TableFillData,
    TableFillSelection, TableFillResolvedData, TableGradientFillSnapshot, TableStyleFillRegion } from '../../worker/table-fill-bindings';

export { TableCellBorder, TableBorderGradientUpdate, AuthoredTableCellBorders } from './table-border-fill';

export { TablePhysicalBorderEdge, TableBorderEdge, TableBorderLineProperties, TableBorderChoice,
    TableBorderRecord, TableBorderSelection } from '../../worker/table-border-bindings';
