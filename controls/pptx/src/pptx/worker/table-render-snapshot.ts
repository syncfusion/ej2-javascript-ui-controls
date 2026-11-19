import { TableTextStyleSources } from './table-text-style';
import { TableGradientFillSnapshot } from './table-fill-bindings';
/**
 * Clone-safe DrawingML table data emitted by the presentation Worker.
 *
 * @remarks
 * Authored values remain in `direct`; the independently computed render value
 * and its provenance remain in `resolved`. The DTO contains no live XML nodes.
 */

import { DirectFill, DirectLine } from '../core/shapes/fill-line-types';
import { TextColorSnapshot } from './rich-text-snapshot';

/** JSON value used for the existing clone-safe text-body payload. */
interface TableJsonArray extends ReadonlyArray<TableJsonValue> {}
interface TableJsonObject { readonly [key: string]: TableJsonValue; }
export type TableJsonValue = string | number | boolean | null | undefined |
TableJsonArray | TableJsonObject;

/** Existing Worker text-body snapshot carried without live XML objects. */
export type TableCellTextBodySnapshot = TableJsonObject;

/** Table-style regions selected by DrawingML table flags and cell position. */
export type TableStyleBucket = 'wholeTbl' | 'band1H' | 'band2H' | 'band1V' | 'band2V' |
'firstRow' | 'lastRow' | 'firstCol' | 'lastCol' | 'nwCell' | 'neCell' | 'swCell' | 'seCell';

/** Authored `a:tblPr` data which selects table-style regions. */
export interface TableDirectPropertiesSnapshot {
    /** Authored table style GUID. */
    readonly styleId?: string;
    /** Whether the first-row style region is enabled. */
    readonly firstRow: boolean;
    /** Whether the last-row style region is enabled. */
    readonly lastRow: boolean;
    /** Whether the first-column style region is enabled. */
    readonly firstColumn: boolean;
    /** Whether the last-column style region is enabled. */
    readonly lastColumn: boolean;
    /** Whether horizontal banding is enabled. */
    readonly bandedRows: boolean;
    /** Whether vertical banding is enabled. */
    readonly bandedColumns: boolean;
}

/** Authored cell margins, anchoring, fill, and border values. */
export interface TableCellDirectStyleSnapshot {
    /** Left cell margin in EMUs. */
    readonly marginLeftEmu: number;
    /** Right cell margin in EMUs. */
    readonly marginRightEmu: number;
    /** Top cell margin in EMUs. */
    readonly marginTopEmu: number;
    /** Bottom cell margin in EMUs. */
    readonly marginBottomEmu: number;
    /** DrawingML vertical-text token. */
    readonly verticalType: string;
    /** DrawingML vertical anchor token. */
    readonly anchor: string;
    /** Whether text is horizontally centred in the cell. */
    readonly anchorCenter: boolean;
    /** Horizontal overflow policy. */
    readonly horizontalOverflow: string;
    /** Direct cell fill; `missing` means style inheritance remains eligible. */
    readonly fill: DirectFill;
    /** Direct borders by physical edge. */
    readonly borders: TableCellBorderSnapshot;
}

/** Four physical cell borders plus the two authored diagonal borders. */
export interface TableCellBorderSnapshot {
    /** Left border. */
    readonly left: DirectLine;
    /** Right border. */
    readonly right: DirectLine;
    /** Top border. */
    readonly top: DirectLine;
    /** Bottom border. */
    readonly bottom: DirectLine;
    /** Top-left to bottom-right diagonal. */
    readonly insideDiagonalDown: DirectLine;
    /** Bottom-left to top-right diagonal. */
    readonly insideDiagonalUp: DirectLine;
}

/** Render style selected for a cell, kept separate from authored data. */
export interface TableCellResolvedStyleSnapshot {
    /** Style buckets selected in precedence order for this cell. */
    readonly buckets: ReadonlyArray<TableStyleBucket>;
    /** Resolved fill used by the renderer. */
    readonly fill: DirectFill;
    /** Provenance of the resolved fill. */
    readonly fillSource: 'cell' | TableStyleBucket | 'none';
    /** Resolved borders used by the renderer. */
    readonly borders: TableCellBorderSnapshot;
    /** Provenance of each resolved border. */
    readonly borderSources: Readonly<Record<keyof TableCellBorderSnapshot, 'cell' | TableStyleBucket | 'none'>>;
    /** Resolved table-style text defaults; direct paragraph/run properties remain separate. */
    readonly textStyle?: TableCellTextStyleSnapshot;
    /** Style bucket that supplied the text defaults. */
    readonly textStyleSource?: TableStyleBucket;
    /** Independent canonical sources; a single bucket cannot describe partial overrides. */
    readonly textStyleSources?: TableTextStyleSources;
    /** Inherited paragraph default for table text when a run/paragraph omits a value. */
    readonly inheritedTextStyle?: TableCellTextStyleSnapshot;
    /** Provenance of the inherited paragraph default. */
    readonly inheritedTextStyleSource?: 'master-other-style' | 'presentation-default';
}

/** Clone-safe `a:tcTxStyle` defaults. */
export interface TableCellTextStyleSnapshot {
    /** Theme major/minor font reference. */
    readonly fontReference?: string;
    /** Actual font-reference color, separate from an explicit table foreground. */
    readonly fontReferenceColor?: TextColorSnapshot;
    /** Direct inline font-collection script faces. */
    readonly eastAsianFontFamily?: string;
    readonly complexScriptFontFamily?: string;
    /** Resolved concrete typeface when the inherited text tier supplies one. */
    readonly fontFamily?: string;
    /** Resolved inherited size in points. */
    readonly fontSizePt?: number;
    /** Text colour outside `fontRef`; theme tokens retain clrMap semantics. */
    readonly color?: TextColorSnapshot;
    /** Authored bold toggle. */
    readonly bold?: boolean;
    /** Authored italic toggle. */
    readonly italic?: boolean;
}

/** One clone-safe table-cell record in document order. */
export interface TableCellRenderSnapshot {
    /** Zero-based physical row. */
    readonly row: number;
    /** Zero-based physical column. */
    readonly column: number;
    /** Authored horizontal span, defaulting to one. */
    readonly columnSpan: number;
    /** Authored vertical span, defaulting to one. */
    readonly rowSpan: number;
    /** Whether this cell continues a horizontal merge. */
    readonly horizontalMerge: boolean;
    /** Whether this cell continues a vertical merge. */
    readonly verticalMerge: boolean;
    /** Row of the cell that owns this merged region. */
    readonly mergeOwnerRow: number;
    /** Column of the cell that owns this merged region. */
    readonly mergeOwnerColumn: number;
    /** Authored cell data before table-style resolution. */
    readonly direct: TableCellDirectStyleSnapshot;
    /** Render-ready style plus property provenance. */
    readonly resolved: TableCellResolvedStyleSnapshot;
    /** Clone-safe text body, including paragraph properties and ordered content. */
    readonly textBody?: TableCellTextBodySnapshot;
}

/** Clone-safe render snapshot for one DrawingML `a:tbl`. */
export interface TableRenderSnapshot {
    /** Complete source fills and region selection; references require separate theme evaluation. */
    readonly authoredFills?: TableGradientFillSnapshot;
    /** Direct table flags and style identity. */
    readonly direct: TableDirectPropertiesSnapshot;
    /** Authored grid-column widths in EMUs. */
    readonly columnWidthsEmu: ReadonlyArray<number>;
    /** Authored row heights in EMUs. */
    readonly rowHeightsEmu: ReadonlyArray<number>;
    /** Cells in physical row-major order. */
    readonly cells: ReadonlyArray<TableCellRenderSnapshot>;
}
