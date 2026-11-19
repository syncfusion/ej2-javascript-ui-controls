import { OoxmlElement } from '../core/xml/dom';
import { findChild, getAttr } from '../core/shapes/dom-utils';
import { getGradientDrawingNamespace, readGradientColorTransforms } from '../core/theme/read-gradient';
import { tryParseColorChoiceChild } from '../core/theme/parse-color-choice';
import { ColorValue } from '../core/theme/color-value';
import { ThemeFontCollection, readThemeFontCollection } from '../core/theme/theme-render-model';
import { TextColorSnapshot } from './rich-text-snapshot';
import { TableCellTextStyleSnapshot, TableStyleBucket } from './table-render-snapshot';
import { TableCellFillSnapshot, TableStyleFillSnapshot } from './table-fill-bindings';
/** Atomic themeable font choice; reference color is separate from foreground. @internal */
export type TableTextFontSnapshot = { readonly kind: 'reference'; readonly index: string | undefined;
    readonly color: TextColorSnapshot | undefined; } |
{ readonly kind: 'font'; readonly collection: ThemeFontCollection; };
/** Direct `tcTxStyle` values, without region or theme inheritance. @internal */
export interface TableTextStyleSnapshot {
    readonly font?: TableTextFontSnapshot;
    readonly color?: TextColorSnapshot;
    readonly bold?: boolean;
    readonly italic?: boolean;
}
/** Selected region per independent text property. @internal */
export type TableTextStyleSources = Readonly<Partial<Record<'font' | 'color' | 'bold' | 'italic', TableStyleBucket>>>;
/** Physical cell defaults selected without rewriting its authored text. @internal */
export interface TableTextStyleSelection {
    readonly row: number;
    readonly column: number;
    readonly style: TableCellTextStyleSnapshot;
    readonly sources: TableTextStyleSources;
}
/**
 * @param {OoxmlElement} source - Actual table-style text owner, or absent.
 * @returns {TableTextStyleSnapshot | undefined} Raw font/color/toggle values in the exact dialect.
 * @internal
 */
export function readTableTextStyle(source: OoxmlElement | undefined): TableTextStyleSnapshot | undefined {
    if (source === undefined || getGradientDrawingNamespace(source.namespaceUri) !== source.namespaceUri) { return undefined; }
    const ns: string = source.namespaceUri;
    const reference: OoxmlElement | undefined = findChild(source, ns, 'fontRef');
    const font: OoxmlElement | undefined = findChild(source, ns, 'font');
    return { font: reference !== undefined ? { kind: 'reference', index: getAttr(reference, '', 'idx'), color: color(reference) } :
        font === undefined ? undefined : { kind: 'font', collection: readThemeFontCollection(font) },
    color: color(source), bold: toggle(source, 'b'), italic: toggle(source, 'i') };
}
/**
 * @param {ReadonlyArray<TableCellFillSnapshot>} cells - Existing physical cell buckets, high to low.
 * @param {TableStyleFillSnapshot} selected - Existing duplicate-aware inline/shared style selection.
 * @returns {ReadonlyArray<TableTextStyleSelection>} Explicit known context, including empty defaults.
 * @internal
 */
export function resolveTableTextStyles(cells: ReadonlyArray<TableCellFillSnapshot>,
                                       selected: TableStyleFillSnapshot | undefined): ReadonlyArray<TableTextStyleSelection> {
    return cells.map((cell: TableCellFillSnapshot): TableTextStyleSelection => {
        let font: TableTextFontSnapshot | undefined;
        let foreground: TextColorSnapshot | undefined;
        let bold: boolean | undefined;
        let italic: boolean | undefined;
        const sources: Partial<Record<'font' | 'color' | 'bold' | 'italic', TableStyleBucket>> = {};
        for (const bucket of cell.buckets) {
            const region: TableStyleFillSnapshot['regions'][number] | undefined = selected === undefined ? undefined :
                selected.regions.find((value: TableStyleFillSnapshot['regions'][number]): boolean => value.bucket === bucket);
            const style: TableTextStyleSnapshot | undefined = region === undefined ? undefined : region.textStyle;
            if (style === undefined) { continue; }
            if (font === undefined && style.font !== undefined) { font = style.font; sources.font = bucket; }
            const candidate: TextColorSnapshot | undefined = style.color ||
                (style.font !== undefined && style.font.kind === 'reference' ? style.font.color : undefined);
            if (foreground === undefined && candidate !== undefined) { foreground = candidate; sources.color = bucket; }
            if (bold === undefined && style.bold !== undefined) { bold = style.bold; sources.bold = bucket; }
            if (italic === undefined && style.italic !== undefined) { italic = style.italic; sources.italic = bucket; }
        }
        return { row: cell.row, column: cell.column, sources, style: {
            ...(font === undefined ? {} : font.kind === 'reference' ? {
                fontReference: font.index === undefined ? undefined : font.index.trim(), fontReferenceColor: font.color
            } : { fontFamily: font.collection.latin.typeface, eastAsianFontFamily: font.collection.eastAsian.typeface,
                complexScriptFontFamily: font.collection.complexScript.typeface }),
            color: foreground, bold, italic } };
    });
}
/**
 * @param {OoxmlElement} source - Actual `EG_ColorChoice` owner.
 * @returns {TextColorSnapshot | undefined} Symbolic color and ordered raw transforms.
 */
function color(source: OoxmlElement): TextColorSnapshot | undefined {
    const ns: string = source.namespaceUri;
    const value: ColorValue | undefined = tryParseColorChoiceChild(source, ns);
    if (value === undefined) { return undefined; }
    const choice: OoxmlElement | undefined = findChild(source, ns, value.kind + 'Clr');
    const dialect: 'strict' | 'transitional' = ns === 'http://purl.oclc.org/ooxml/drawingml/main' ? 'strict' : 'transitional';
    return { value, transforms: readGradientColorTransforms(choice, ns, dialect) };
}
/**
 * @param {OoxmlElement} source - Actual table text-style owner.
 * @param {string} name - Schema `b` or `i` attribute.
 * @returns {boolean | undefined} `def`/absence stays inheritable; explicit off stays false.
 */
function toggle(source: OoxmlElement, name: string): boolean | undefined {
    const raw: string | undefined = getAttr(source, '', name);
    const value: string | undefined = raw === undefined ? undefined : raw.trim();
    return value === 'on' ? true : value === 'off' ? false : undefined;
}
