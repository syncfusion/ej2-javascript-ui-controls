import {
    ColorValue, TableBorderRecord, TableCellRenderSnapshot, TableFillChoice, TableRenderSnapshot, TableStyleBucket,
    TableStyleFillRegion, TableStyleFillSnapshot
} from '@syncfusion/ej2-pptx';
import { BUILTIN_TABLE_STYLES_JSON } from './builtin-table-styles-data';

/** A DrawingML colour plus its ordered transforms, kept symbolic until render time.  @internal */
/**
 * @internal
 */
export interface TableStyleColor {
    /** Authored colour (scheme colours stay references). */
    readonly value: ColorValue;
    /** Ordered colour transforms such as `tint`, `shade` or `alpha`. */
    readonly transforms: ReadonlyArray<{ readonly kind: string; readonly value?: number }>;
}

/** Fill of a table-style region: explicit none, a colour, or a theme `fillRef` (colour is the `phClr`).  @internal */
/**
 * @internal
 */
export interface TableStyleFill {
    /** True for an explicit `a:noFill`. */
    readonly none?: boolean;
    /** Solid colour, or the placeholder colour of a theme reference. */
    readonly color?: TableStyleColor;
    /** `a:fillRef/@idx` into the theme fill matrix. */
    readonly ref?: number;
}

/** One border line of a table-style region.  @internal */
/**
 * @internal
 */
export interface TableStyleLine {
    /** True for an explicit `a:noFill` line. */
    readonly none?: boolean;
    /** Line colour, or the placeholder colour of a theme reference. */
    readonly color?: TableStyleColor;
    /** `a:ln/@w` in EMUs. */
    readonly widthEmu?: number;
    /** `a:ln/@cmpd` compound token. */
    readonly compound?: string;
    /** Preset dash token. */
    readonly dash?: string;
    /** `a:lnRef/@idx` into the theme line matrix. */
    readonly ref?: number;
}

/** Edge keys: l/r/t/b outer, h/v interior, d/u diagonals.  @internal */
/**
 * @internal
 */
export type TableStyleEdge = 'l' | 'r' | 't' | 'b' | 'h' | 'v' | 'd' | 'u';

/** `a:tcTxStyle` defaults of one region.  @internal */
/**
 * @internal
 */
export interface TableStyleText {
    /** Foreground colour. */
    readonly color?: TableStyleColor;
    /** Bold toggle. */
    readonly bold?: boolean;
    /** Italic toggle. */
    readonly italic?: boolean;
    /** Theme font reference (`major` | `minor`) or an authored typeface. */
    readonly font?: string;
}

/** One table-style region (`wholeTbl`, `firstRow`, ...).  @internal */
/**
 * @internal
 */
export interface TableStyleRegion {
    /** Region fill. */
    readonly fill?: TableStyleFill;
    /** Region borders. */
    readonly edges: { [edge: string]: TableStyleLine };
    /** Region text defaults. */
    readonly text?: TableStyleText;
}

/** A normalised table style, independent of whether it came from the package or the built-in catalogue.  @internal */
/**
 * @internal
 */
export interface TableStyleDefinition {
    /** `a:tblBg` fill. */
    readonly background?: TableStyleFill;
    /** Regions by bucket. */
    readonly regions: { [bucket: string]: TableStyleRegion };
}

/** Region precedence, highest first (corner cells only apply when both row and column flags are on). */
const PRECEDENCE: ReadonlyArray<TableStyleBucket> = ['nwCell', 'neCell', 'swCell', 'seCell', 'firstRow', 'lastRow',
    'firstCol', 'lastCol', 'band1H', 'band2H', 'band1V', 'band2V', 'wholeTbl'];
const ROW_STRIPS: ReadonlyArray<string> = ['firstRow', 'lastRow', 'band1H', 'band2H'];
const COLUMN_STRIPS: ReadonlyArray<string> = ['firstCol', 'lastCol', 'band1V', 'band2V'];

let builtinCache: { [styleId: string]: TableStyleDefinition } | undefined;

/**
 * Finds the style of a table: the package/inline style exposed by the library first, then the built-in
 * PowerPoint catalogue (PowerPoint binds the 74 preset GUIDs even when `tableStyles.xml` omits them).
 *
 * @param {TableRenderSnapshot} table - Table snapshot.
 * @returns {TableStyleDefinition | undefined} Style, or undefined when the table has none.
 * @internal
 */
export function resolveTableStyleDefinition(table: TableRenderSnapshot): TableStyleDefinition | undefined {
    const authored: TableStyleFillSnapshot | undefined = table.authoredFills ? table.authoredFills.resolved.style : undefined;
    if (authored) {
        return fromAuthoredStyle(authored);
    }
    const id: string | undefined = table.direct.styleId;
    return id ? builtinStyles()[id.toUpperCase()] : undefined;
}

/**
 * Returns the style buckets of a cell, highest precedence first.
 *
 * @param {TableRenderSnapshot} table - Table snapshot.
 * @param {TableCellRenderSnapshot} cell - Cell snapshot.
 * @returns {TableStyleBucket[]} Applicable buckets.
 * @internal
 */
export function cellStyleBuckets(table: TableRenderSnapshot, cell: TableCellRenderSnapshot): TableStyleBucket[] {
    const applicable: string[] = cell.resolved.buckets.slice();
    const rows: number = table.rowHeightsEmu.length;
    const columns: number = table.columnWidthsEmu.length;
    const direct: TableRenderSnapshot['direct'] = table.direct;
    const top: boolean = direct.firstRow && cell.row === 0;
    const bottom: boolean = direct.lastRow && cell.row === rows - 1;
    const left: boolean = direct.firstColumn && cell.column === 0;
    const right: boolean = direct.lastColumn && cell.column === columns - 1;
    if (top && left) { applicable.push('nwCell'); }
    if (top && right) { applicable.push('neCell'); }
    if (bottom && left) { applicable.push('swCell'); }
    if (bottom && right) { applicable.push('seCell'); }
    return PRECEDENCE.filter((bucket: TableStyleBucket): boolean => applicable.indexOf(bucket) >= 0);
}

/**
 * Selects the style region key a physical cell side reads, following table geometry: outer sides use
 * `l/r/t/b`, interior sides use `h/v`; strip regions own their own top/bottom (rows) or left/right (columns).
 *
 * @param {TableRenderSnapshot} table - Table snapshot.
 * @param {TableCellRenderSnapshot} cell - Cell snapshot.
 * @param {string} side - `top` | `right` | `bottom` | `left`.
 * @param {string} bucket - Style bucket being consulted.
 * @returns {TableStyleEdge} Edge key.
 * @internal
 */
export function styleEdgeKey(
    table: TableRenderSnapshot,
    cell: TableCellRenderSnapshot,
    side: 'top' | 'right' | 'bottom' | 'left',
    bucket: string
): TableStyleEdge {
    const horizontal: boolean = side === 'top' || side === 'bottom';
    if (horizontal && ROW_STRIPS.indexOf(bucket) >= 0) { return side === 'top' ? 't' : 'b'; }
    if (!horizontal && COLUMN_STRIPS.indexOf(bucket) >= 0) { return side === 'left' ? 'l' : 'r'; }
    const lastRow: number = table.rowHeightsEmu.length - 1;
    const lastColumn: number = table.columnWidthsEmu.length - 1;
    if (side === 'top') { return cell.row === 0 ? 't' : 'h'; }
    if (side === 'bottom') { return cell.row + cell.rowSpan - 1 >= lastRow ? 'b' : 'h'; }
    if (side === 'left') { return cell.column === 0 ? 'l' : 'v'; }
    return cell.column + cell.columnSpan - 1 >= lastColumn ? 'r' : 'v';
}

/**
 * First fill found walking the cell's regions from highest to lowest precedence.
 *
 * @param {TableStyleDefinition} style - Style.
 * @param {TableStyleBucket[]} buckets - Cell buckets, highest first.
 * @returns {TableStyleFill | undefined} Fill, or undefined when no region fills the cell.
 * @internal
 */
export function styleFill(style: TableStyleDefinition, buckets: TableStyleBucket[]): TableStyleFill | undefined {
    for (const bucket of buckets) {
        const region: TableStyleRegion | undefined = style.regions[bucket];
        if (region && region.fill) {
            return region.fill;
        }
    }
    return undefined;
}

/**
 * First border found for an edge key walking the regions from highest to lowest precedence.
 *
 * @param {TableStyleDefinition} style - Style.
 * @param {TableRenderSnapshot} table - Table snapshot.
 * @param {TableCellRenderSnapshot} cell - Cell snapshot.
 * @param {TableStyleBucket[]} buckets - Cell buckets, highest first.
 * @param {string} side - Physical side.
 * @returns {TableStyleLine | undefined} Line, or undefined when no region styles the edge.
 * @internal
 */
export function styleBorder(
    style: TableStyleDefinition,
    table: TableRenderSnapshot,
    cell: TableCellRenderSnapshot,
    buckets: TableStyleBucket[],
    side: 'top' | 'right' | 'bottom' | 'left'
): TableStyleLine | undefined {
    for (const bucket of buckets) {
        const region: TableStyleRegion | undefined = style.regions[bucket];
        const line: TableStyleLine | undefined = region ? region.edges[styleEdgeKey(table, cell, side, bucket)] : undefined;
        if (line) {
            return line;
        }
    }
    return undefined;
}

/**
 * Merges the per-property text defaults of the cell's regions (each property resolves independently).
 *
 * @param {TableStyleDefinition} style - Style.
 * @param {TableStyleBucket[]} buckets - Cell buckets, highest first.
 * @returns {TableStyleText} Text defaults.
 * @internal
 */
export function styleText(style: TableStyleDefinition, buckets: TableStyleBucket[]): TableStyleText {
    let color: TableStyleColor | undefined;
    let bold: boolean | undefined;
    let italic: boolean | undefined;
    let font: string | undefined;
    for (const bucket of buckets) {
        const region: TableStyleRegion | undefined = style.regions[bucket];
        const text: TableStyleText | undefined = region ? region.text : undefined;
        if (!text) { continue; }
        color = color || text.color;
        bold = bold === undefined ? text.bold : bold;
        italic = italic === undefined ? text.italic : italic;
        font = font || text.font;
    }
    return { color, bold, italic, font };
}

function builtinStyles(): { [styleId: string]: TableStyleDefinition } {
    if (builtinCache) {
        return builtinCache;
    }
    const parsed: { [styleId: string]: CompactStyle } = JSON.parse(BUILTIN_TABLE_STYLES_JSON);
    const result: { [styleId: string]: TableStyleDefinition } = {};
    for (const id of Object.keys(parsed)) {
        result[id.toUpperCase()] = fromCompactStyle(parsed[id]);
    }
    builtinCache = result;
    return result;
}

interface CompactColor { k: string; v: string | string[]; t?: Array<[string, number]> }
interface CompactFill { n?: number; c?: CompactColor | null; r?: number }
interface CompactLine { n?: number; c?: CompactColor | null; w?: number; m?: string; r?: number }
interface CompactRegion {
    x?: { f?: string; c?: CompactColor; b?: number; i?: number };
    f?: CompactFill;
    e?: { [edge: string]: CompactLine };
}
type CompactStyle = { bg?: CompactFill } & { [bucket: string]: CompactRegion | CompactFill | undefined };

function fromCompactColor(color: CompactColor | null | undefined): TableStyleColor | undefined {
    if (!color) { return undefined; }
    const transforms: Array<{ kind: string; value: number }> = (color.t || []).map(
        (pair: [string, number]): { kind: string; value: number } => ({ kind: pair[0], value: pair[1] }));
    let value: ColorValue;
    if (color.k === 'g') {
        const channels: string[] = color.v as string[];
        value = { kind: 'scrgb', r: channels[0], g: channels[1], b: channels[2] };
    } else if (color.k === 'p') {
        value = { kind: 'prst', val: color.v as string };
    } else if (color.k === 'x') {
        value = { kind: 'srgb', val: color.v as string };
    } else {
        value = { kind: 'scheme', val: color.v as string };
    }
    return { value, transforms };
}

function fromCompactFill(fill: CompactFill | undefined): TableStyleFill | undefined {
    if (!fill) { return undefined; }
    return { none: fill.n === 1 ? true : undefined, color: fromCompactColor(fill.c), ref: fill.r };
}

function fromCompactStyle(style: CompactStyle): TableStyleDefinition {
    const regions: { [bucket: string]: TableStyleRegion } = {};
    for (const bucket of PRECEDENCE) {
        const region: CompactRegion | undefined = style[bucket] as CompactRegion | undefined;
        if (!region) { continue; }
        const edges: { [edge: string]: TableStyleLine } = {};
        for (const edge of Object.keys(region.e || {})) {
            const line: CompactLine = (region.e || {})[edge];
            edges[edge] = { none: line.n === 1 ? true : undefined, color: fromCompactColor(line.c), widthEmu: line.w,
                            compound: line.m, ref: line.r };
        }
        const text: CompactRegion['x'] = region.x;
        regions[bucket] = {
            fill: fromCompactFill(region.f),
            edges,
            text: text ? { color: fromCompactColor(text.c), bold: text.b === 1 ? true : undefined,
                           italic: text.i === 1 ? true : undefined, font: text.f } : undefined
        };
    }
    return { background: fromCompactFill(style.bg), regions };
}

function fromAuthoredStyle(style: TableStyleFillSnapshot): TableStyleDefinition {
    const regions: { [bucket: string]: TableStyleRegion } = {};
    for (const region of style.regions) {
        regions[region.bucket] = fromAuthoredRegion(region);
    }
    return { background: fromAuthoredFill(style.background), regions };
}

function fromAuthoredRegion(region: TableStyleFillRegion): TableStyleRegion {
    const edges: { [edge: string]: TableStyleLine } = {};
    for (const record of region.borders || []) {
        const key: TableStyleEdge | undefined = authoredEdgeKey(record);
        const line: TableStyleLine | undefined = fromAuthoredLine(record);
        if (key && line) {
            edges[key] = line;
        }
    }
    const source: TableStyleFillRegion['textStyle'] = region.textStyle;
    let text: TableStyleText | undefined;
    if (source) {
        const font: NonNullable<TableStyleFillRegion['textStyle']>['font'] = source.font;
        text = {
            color: source.color ? { value: source.color.value, transforms: source.color.transforms } :
                font && font.kind === 'reference' && font.color ?
                    { value: font.color.value, transforms: font.color.transforms } : undefined,
            bold: source.bold,
            italic: source.italic,
            font: font ? font.kind === 'reference' ? font.index : font.collection.latin.typeface : undefined
        };
    }
    return { fill: fromAuthoredFill(region.fill), edges, text };
}

function authoredEdgeKey(record: TableBorderRecord): TableStyleEdge | undefined {
    const map: { [edge: string]: TableStyleEdge } = { left: 'l', right: 'r', top: 't', bottom: 'b',
        insideHorizontal: 'h', insideVertical: 'v', insideDiagonalDown: 'd', insideDiagonalUp: 'u' };
    return map[record.edge];
}

function fromAuthoredFill(choice: TableFillChoice): TableStyleFill | undefined {
    if (choice.kind === 'reference') {
        const index: { readonly kind: string; readonly value?: number } = choice.reference.index;
        return { ref: index.kind === 'value' ? index.value : undefined,
                 color: choice.reference.color ? { value: choice.reference.color,
                                                   transforms: choice.reference.colorTransforms } : undefined };
    }
    if (choice.kind !== 'fill') { return undefined; }
    const source: { readonly kind: string; readonly color?: ColorValue;
        readonly colorTransforms?: ReadonlyArray<{ readonly kind: string; readonly value?: number }> } = choice.fill;
    if (source.kind === 'none') { return { none: true }; }
    if (source.kind === 'solid' && source.color) {
        return { color: { value: source.color, transforms: source.colorTransforms || [] } };
    }
    return undefined;
}

function fromAuthoredLine(record: TableBorderRecord): TableStyleLine | undefined {
    const choice: TableBorderRecord['choice'] = record.choice;
    if (choice.kind === 'reference') {
        const index: { readonly kind: string; readonly value?: number } = choice.reference.index;
        return { ref: index.kind === 'value' ? index.value : undefined,
                 color: choice.reference.color ? { value: choice.reference.color,
                                                   transforms: choice.reference.colorTransforms } : undefined };
    }
    if (choice.kind !== 'line') { return undefined; }
    const fill: { readonly kind: string; readonly color?: ColorValue;
        readonly colorTransforms?: ReadonlyArray<{ readonly kind: string; readonly value?: number }> } = choice.fill;
    const width: number = Number(choice.properties.width);
    const dash: TableStyleLine['dash'] = choice.properties.dash && choice.properties.dash.kind === 'preset' ?
        choice.properties.dash.value : undefined;
    if (fill.kind === 'none') { return { none: true }; }
    if (fill.kind === 'solid' && fill.color) {
        return { color: { value: fill.color, transforms: fill.colorTransforms || [] },
                 widthEmu: isFinite(width) && choice.properties.width !== undefined ? width : undefined,
                 compound: choice.properties.compound, dash };
    }
    return undefined;
}
