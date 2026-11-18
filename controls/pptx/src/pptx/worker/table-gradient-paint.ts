import { TextLineStyleSnapshot } from '../core/text/text-line-style';
import { TableBorderSelection, TableBorderLineProperties, TablePhysicalBorderEdge } from './table-border-bindings';
import { resolveOutlineGradientSources } from '../core/resolve/outline-gradient-sources';
import { selectAuthoredFillMatrixEntry } from '../core/theme/read-fill-reference';
import { FillMatrixSelection } from '../core/theme/fill-matrix-reference';
import { TableFillBinding, TableFillSelection, TableStyleFillSnapshot, resolveTableFillData,
    indexTableStyleFills, TableStyleFillIndex } from './table-fill-bindings';
import { GradientHostResult, resolveGradientHostSources } from '../core/resolve/gradient-host-sources';
import { GradientThemeStyle, GradientThemeStyles } from '../core/theme/gradient-theme-styles';
import { EffectiveColorContext } from '../core/theme/resolve-color';
import { GradientColorResult, resolveGradientStopColor } from '../core/layout/gradient-color-resolution';
import { arrayAt } from '../core/util/es5-compat';

/** Selected table fill with independently evaluated solid/gradient paint. @internal */
export interface TableFillPaint {
    readonly result: GradientHostResult;
    readonly solid?: GradientColorResult;
}
/** Selected physical edge with source line geometry separate from paint. @internal */
export interface TableBorderPaint {
    readonly edge: TablePhysicalBorderEdge;
    readonly source: TableBorderSelection['source'];
    readonly paint: TableFillPaint;
    readonly properties?: TableBorderLineProperties;
    readonly referenceIndex?: number;
}
/** Actual part-local table identity; cells retain physical source coordinates. @internal */
export interface TableGradientPaint {
    readonly partName: string;
    readonly id: string;
    readonly background: TableFillPaint;
    readonly cells: ReadonlyArray<{ readonly row: number; readonly column: number; readonly paint: TableFillPaint;
        readonly borders?: ReadonlyArray<TableBorderPaint>; }>;
}
/** Relationship-selected table records, without live XML. @internal */
export interface TablePaintPart {
    readonly partName: string;
    readonly bindings: ReadonlyArray<TableFillBinding>;
}
/**
 * Evaluates the existing table source selector with the same active theme/map as
 * ordinary shape gradients. Table background never becomes a cell fallback.
 *
 * @param {ReadonlyArray<TablePaintPart>} parts - Actual selected slide/layout/master parts.
 * @param {ReadonlyArray<TableStyleFillSnapshot>} tableStyles - Related shared table styles.
 * @param {GradientThemeStyles} styles - Active theme matrices.
 * @param {EffectiveColorContext} colors - Active color scheme/map.
 * @returns {ReadonlyArray<TableGradientPaint>} Detached paint with physical cell ownership.
 * @internal
 */
export function resolveTableGradientPaint(parts: ReadonlyArray<TablePaintPart>, tableStyles: ReadonlyArray<TableStyleFillSnapshot>,
                                          styles?: GradientThemeStyles, colors?: EffectiveColorContext): ReadonlyArray<TableGradientPaint> {
    const index: TableStyleFillIndex = indexTableStyleFills(tableStyles);
    const result: TableGradientPaint[] = [];
    parts.forEach((part: TablePaintPart): void => {
        part.bindings.forEach((binding: TableFillBinding): void => {
            const selected: ReturnType<typeof resolveTableFillData> = resolveTableFillData(binding.data, tableStyles, index);
            result.push({ partName: part.partName, id: binding.id,
                background: fillPaint(selected.background, styles, colors),
                cells: selected.cells.map((choice: TableFillSelection, i: number): TableGradientPaint['cells'][number] => {
                    const cell: typeof binding.data.cells[number] = arrayAt(binding.data.cells, i);
                    const borders: ReadonlyArray<TableBorderSelection> | undefined = selected.borderCells === undefined ? undefined :
                        arrayAt(selected.borderCells, i);
                    return { row: cell.row, column: cell.column, paint: fillPaint(choice, styles, colors),
                        ...(borders === undefined ? {} : { borders: borders.map((border: TableBorderSelection): TableBorderPaint =>
                            borderPaint(border, styles, colors)) }) };
                }) });
        });
    });
    return result;
}
/**
 * @param {TableFillSelection} selected - Existing precedence-selected direct fill or reference.
 * @param {GradientThemeStyles} styles - Active theme matrices.
 * @param {EffectiveColorContext} colors - Active map/scheme.
 * @returns {TableFillPaint} Checked source paint; invalid references never select a fallback.
 */
function fillPaint(selected: TableFillSelection, styles?: GradientThemeStyles, colors?: EffectiveColorContext): TableFillPaint {
    const choice: TableFillSelection['choice'] = selected.choice;
    const reference: import('../core/theme/read-fill-reference').AuthoredFillMatrixReference | undefined =
        choice.kind === 'reference' ? choice.reference : undefined;
    let fill: GradientThemeStyle = choice.kind === 'fill' ? choice.fill : { kind: 'missing' };
    const result: GradientHostResult = resolveGradientHostSources([{ id: selected.source, fill, reference }], styles, colors, false);
    if (reference !== undefined) {
        const fills: GradientThemeStyles['fills'] = styles === undefined ? undefined : styles.fills;
        const backgrounds: GradientThemeStyles['backgrounds'] = styles === undefined ? undefined : styles.backgrounds;
        const entry: FillMatrixSelection<GradientThemeStyle> = selectAuthoredFillMatrixEntry(reference, fills, backgrounds);
        if (entry.kind === 'style') { fill = entry.style; }
    }
    return fill.kind === 'solid' && 'color' in fill && 'colorTransforms' in fill ?
        { result, solid: resolveGradientStopColor(fill.color, fill.colorTransforms, colors, reference) } : { result };
}

/**
 * @param {TableBorderSelection} selected - Existing independently selected edge source.
 * @param {GradientThemeStyles} styles - Active independent line matrix.
 * @param {EffectiveColorContext} colors - Active map/scheme.
 * @returns {TableBorderPaint} Effective edge paint without rewriting raw line fields.
 */
function borderPaint(selected: TableBorderSelection, styles?: GradientThemeStyles, colors?: EffectiveColorContext): TableBorderPaint {
    const choice: TableBorderSelection['choice'] = selected.choice;
    const reference: import('../core/theme/read-fill-reference').AuthoredLineMatrixReference | undefined =
        choice !== undefined && choice.kind === 'reference' ? choice.reference : undefined;
    let fill: GradientThemeStyle = choice !== undefined && choice.kind === 'line' ? choice.fill : { kind: 'missing' };
    const lines: GradientThemeStyles['lines'] = styles === undefined ? undefined : styles.lines;
    const result: GradientHostResult = resolveOutlineGradientSources([{ id: selected.source, fill, reference }], lines, colors);
    const index: number | undefined = reference !== undefined && reference.index.kind === 'value' ? reference.index.value : undefined;
    if (index !== undefined && index > 0 && index !== 1000 && styles !== undefined && styles.lines !== undefined &&
        index <= styles.lines.length) { fill = arrayAt(styles.lines, index - 1); }
    const paint: TableFillPaint = result.kind === 'other' && result.fillKind === 'solid' && fill.kind === 'solid' &&
        'color' in fill && 'colorTransforms' in fill ?
        { result, solid: resolveGradientStopColor(fill.color, fill.colorTransforms, colors, reference) } : { result };
    const inherited: TextLineStyleSnapshot | undefined =
        index !== undefined && index > 0 && index !== 1000 && styles !== undefined && styles.lineStyles !== undefined ?
            styles.lineStyles[index - 1] : undefined;
    const dash: TableBorderLineProperties['dash'] = borderDash(inherited === undefined ? undefined : inherited.dash);
    const properties: TableBorderLineProperties | undefined = choice !== undefined && choice.kind === 'line' ? choice.properties :
        inherited === undefined ? undefined : { width: inherited.widthEmu, cap: inherited.cap, compound: inherited.compound,
            align: inherited.align, dash, join: inherited.join === undefined ? undefined :
                { kind: inherited.join.kind, limit: inherited.join.kind === 'miter' ? inherited.join.limit : undefined } };
    return { edge: selected.edge, source: selected.source, paint,
        ...(properties === undefined ? {} : { properties }),
        ...(index === undefined ? {} : { referenceIndex: index }) };
}

/** @param {object} source - Optional sparse raw line dash choice.
 * @returns {object | undefined} Same lexical values in the existing table wire shape.
 */
function borderDash(source: TextLineStyleSnapshot['dash']): TableBorderLineProperties['dash'] {
    if (source === undefined) { return undefined; }
    if (source.kind === 'preset') { return { kind: 'preset', value: source.value }; }
    const stops: { dash: string | undefined; space: string | undefined }[] = [];
    source.stops.forEach((stop: { readonly dash?: string; readonly space?: string }): void => {
        stops.push({ dash: stop.dash, space: stop.space });
    });
    return { kind: 'custom', stops };
}
