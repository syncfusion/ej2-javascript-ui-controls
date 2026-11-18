import {
    ColorValue, DirectFill, DirectLine, TableCellRenderSnapshot, TableCellTextBodySnapshot, TableJsonValue, TableRenderSnapshot
} from '@syncfusion/ej2-pptx';
import { TextColorSnapshot } from '@syncfusion/ej2-pptx';
import {
    SlideFrameFill, SlideFrameGradientStop, SlideFrameLineStyle, SlideFrameThemeSnapshot
} from '../../main-slide/slide-frame-model';
import { RenderColor, resolveRenderColor } from '../background/color';
import { emuToPoint } from '../units';
import {
    cellStyleBuckets, resolveTableStyleDefinition, styleBorder, styleFill, styleText, TableStyleColor,
    TableStyleDefinition, TableStyleFill, TableStyleLine, TableStyleText
} from './table-style';

/** One text record read from the loosely typed table-cell text body. */
type TableRecord = { readonly [key: string]: TableJsonValue };

/** Placement of a table frame in slide space.  @internal */
/**
 * @internal
 */
export interface TableFrameBounds {
    /** Left edge in points. */
    readonly xPt: number;
    /** Top edge in points. */
    readonly yPt: number;
    /** Frame width in points. */
    readonly widthPt: number;
    /** Frame height in points. */
    readonly heightPt: number;
    /** Clockwise rotation in degrees. */
    readonly rotationDegrees: number;
    /** Horizontal flip. */
    readonly flipHorizontal: boolean;
    /** Vertical flip. */
    readonly flipVertical: boolean;
}

/** Inputs required to build the HTML for one `a:tbl`.  @internal */
/**
 * @internal
 */
export interface TableRenderInput {
    /** Owning graphic-frame id. */
    readonly shapeId: string;
    /** Accessible name; used as the table caption. */
    readonly name: string;
    /** Table render snapshot with resolved style, borders and text. */
    readonly table: TableRenderSnapshot;
    /** Slide-space placement of the frame. */
    readonly bounds: TableFrameBounds;
    /** Theme used to resolve scheme colours. */
    readonly theme?: SlideFrameThemeSnapshot;
    /** Called for every painted cell so hosts can register clipboard text. */
    readonly onCell?: (cell: HTMLElement, model: TableCellRenderSnapshot, text: string) => void;
}

/**
 * Ports `Table.Layout`/`UpdateRowHeight`: an authored row height is a minimum, so the
 * effective height grows to fit the tallest single-row cell.
 *
 * @param {TableRenderSnapshot} table - Table snapshot.
 * @returns {number[]} Effective row heights in points.
 * @internal
 */
export function effectiveTableRowHeights(table: TableRenderSnapshot): number[] {
    const heights: number[] = table.rowHeightsEmu.map(emuToPoint);
    for (const cell of table.cells) {
        if (cell.horizontalMerge || cell.verticalMerge || cell.rowSpan > 1) {
            continue;
        }
        heights[cell.row] = Math.max(heights[cell.row] || 0, tableCellMinimumHeight(cell));
    }
    return heights;
}

/**
 * Flattens the cell text body into plain text, one paragraph per line.
 *
 * @param {TableCellTextBodySnapshot} textBody - Cell text body.
 * @returns {string} Plain text.
 * @internal
 */
export function tableCellText(textBody: TableCellTextBodySnapshot | undefined): string {
    return paragraphsOf(textBody).map((paragraph: TableRecord): string =>
        contentOf(paragraph).map((item: TableRecord): string =>
            typeof item.text === 'string' ? item.text : '').join('')).join('\n');
}

/**
 * Renders DrawingML tables as semantic HTML: `<div><table><tr><th|td>`.
 * Borders, gridlines, fills, margins, anchoring and run formatting are CSS.
 * Ports `RendererBase.DrawTable` and `GDIRenderer.DrawCellBorders`.
 * @internal
 */
export class TableRenderer {
    /** Table style (package or built-in) selected for the table being rendered. */
    private style: TableStyleDefinition | undefined;

    /**
     * Builds the table frame.
     *
     * @param {TableRenderInput} input - Table, placement and theme.
     * @returns {HTMLDivElement | undefined} The frame, or undefined for empty geometry.
     */
    public render(input: TableRenderInput): HTMLDivElement | undefined {
        const columnWidths: number[] = input.table.columnWidthsEmu.map(emuToPoint);
        const rowHeights: number[] = effectiveTableRowHeights(input.table);
        const bounds: TableFrameBounds = input.bounds;
        if (bounds.widthPt <= 0 || bounds.heightPt <= 0 || sum(columnWidths) <= 0 || sum(rowHeights) <= 0) {
            return undefined;
        }
        this.style = resolveTableStyleDefinition(input.table);
        const frame: HTMLDivElement = document.createElement('div');
        frame.className = 'ej2-pptx-table-frame';
        frame.dataset.shapeId = input.shapeId;
        frame.style.position = 'absolute';
        frame.style.left = `${fmt(bounds.xPt)}pt`;
        frame.style.top = `${fmt(bounds.yPt)}pt`;
        frame.style.width = `${fmt(sum(columnWidths))}pt`;
        frame.style.height = `${fmt(sum(rowHeights))}pt`;
        frame.style.transform = frameTransform(bounds);
        frame.style.pointerEvents = 'auto';
        const table: HTMLTableElement = document.createElement('table');
        table.className = 'ej2-pptx-table';
        table.dataset.shapeId = input.shapeId;
        table.style.borderCollapse = 'collapse';
        table.style.tableLayout = 'fixed';
        table.style.width = `${fmt(sum(columnWidths))}pt`;
        table.style.margin = '0';
        const background: string | undefined = this.style && this.style.background
            ? styleFillCss(this.style.background, input.theme) : undefined;
        if (background && background !== 'transparent') {
            table.style.backgroundColor = background;
        }
        const caption: HTMLTableCaptionElement = document.createElement('caption');
        caption.textContent = input.name || `Table ${input.shapeId}`;
        caption.style.display = 'none';
        table.appendChild(caption);
        table.appendChild(this.buildColumns(columnWidths));
        const head: HTMLTableSectionElement = document.createElement('thead');
        const body: HTMLTableSectionElement = document.createElement('tbody');
        for (let rowIndex: number = 0; rowIndex < rowHeights.length; rowIndex++) {
            const row: HTMLTableRowElement = this.buildRow(input, rowIndex, rowHeights[rowIndex], columnWidths);
            (rowIndex === 0 && input.table.direct.firstRow ? head : body).appendChild(row);
        }
        if (head.childNodes.length > 0) {
            table.appendChild(head);
        }
        table.appendChild(body);
        frame.appendChild(table);
        return frame;
    }

    /**
     * Builds the `<colgroup>` carrying authored column widths.
     *
     * @param {number[]} widths - Column widths in points.
     * @returns {HTMLTableColElement} The column group.
     */
    private buildColumns(widths: number[]): HTMLTableColElement {
        const group: HTMLTableColElement = document.createElement('colgroup');
        for (const width of widths) {
            const col: HTMLTableColElement = document.createElement('col');
            col.style.width = `${fmt(width)}pt`;
            group.appendChild(col);
        }
        return group;
    }

    /**
     * Builds one `<tr>`; merge continuation cells are omitted so spans own their area.
     *
     * @param {TableRenderInput} input - Render input.
     * @param {number} rowIndex - Physical row.
     * @param {number} height - Row height in points.
     * @param {number[]} columnWidths - Column widths in points.
     * @returns {HTMLTableRowElement} The row.
     */
    private buildRow(
        input: TableRenderInput,
        rowIndex: number,
        height: number,
        columnWidths: number[]
    ): HTMLTableRowElement {
        const row: HTMLTableRowElement = document.createElement('tr');
        row.style.height = `${fmt(height)}pt`;
        const cells: TableCellRenderSnapshot[] = input.table.cells.filter((cell: TableCellRenderSnapshot): boolean =>
            cell.row === rowIndex && !cell.horizontalMerge && !cell.verticalMerge)
            .sort((a: TableCellRenderSnapshot, b: TableCellRenderSnapshot): number => a.column - b.column);
        for (const cell of cells) {
            row.appendChild(this.buildCell(input, cell, columnWidths));
        }
        return row;
    }

    /**
     * Builds one `<th>`/`<td>` with fill, borders, padding, anchoring and text.
     *
     * @param {TableRenderInput} input - Render input.
     * @param {TableCellRenderSnapshot} cell - Cell snapshot.
     * @param {number[]} columnWidths - Column widths in points.
     * @returns {HTMLTableCellElement} The cell.
     */
    private buildCell(
        input: TableRenderInput,
        cell: TableCellRenderSnapshot,
        columnWidths: number[]
    ): HTMLTableCellElement {
        const direct: TableCellRenderSnapshot['direct'] = cell.direct;
        const header: boolean = cell.row === 0 && input.table.direct.firstRow;
        const element: HTMLTableCellElement = document.createElement(header ? 'th' : 'td');
        if (header) {
            element.scope = 'col';
        }
        element.className = 'ej2-pptx-table-cell';
        element.dataset.row = String(cell.row);
        element.dataset.column = String(cell.column);
        if (cell.columnSpan > 1) {
            element.colSpan = cell.columnSpan;
        }
        if (cell.rowSpan > 1) {
            element.rowSpan = cell.rowSpan;
        }
        const style: CSSStyleDeclaration = element.style;
        style.width = `${fmt(sum(columnWidths.slice(cell.column, cell.column + cell.columnSpan)))}pt`;
        style.boxSizing = 'border-box';
        style.overflow = 'hidden';
        style.fontWeight = 'normal';
        style.textAlign = direct.anchorCenter ? 'center' : 'left';
        style.verticalAlign = direct.anchor === 'b' ? 'bottom' : direct.anchor === 'ctr' ? 'middle' : 'top';
        style.padding = [direct.marginTopEmu, direct.marginRightEmu, direct.marginBottomEmu, direct.marginLeftEmu]
            .map((emu: number): string => `${fmt(emuToPoint(emu))}pt`).join(' ');
        style.backgroundColor = this.cellFill(input, cell);
        this.applyBorders(element, cell, input);
        const text: string = tableCellText(cell.textBody);
        this.appendParagraphs(element, cell, input);
        if (input.onCell) {
            input.onCell(element, cell, text);
        }
        return element;
    }

    /**
     * Resolves the cell background: an authored cell fill wins, then the table-style regions
     * (first row, banding, ...), then whatever the library resolved.
     *
     * @param {TableRenderInput} input - Render input.
     * @param {TableCellRenderSnapshot} cell - Cell snapshot.
     * @returns {string} CSS colour.
     */
    private cellFill(input: TableRenderInput, cell: TableCellRenderSnapshot): string {
        if (cell.resolved.fillSource === 'cell' || cell.direct.fill.kind !== 'missing' || !this.style) {
            return fillColor(cell.resolved.fill, input.theme);
        }
        const fill: TableStyleFill | undefined = styleFill(this.style, cellStyleBuckets(input.table, cell));
        return fill ? styleFillCss(fill, input.theme) : 'transparent';
    }

    /**
     * Applies the four resolved borders (gridlines) and optional diagonals. Authored cell borders win;
     * otherwise the table style supplies them per edge.
     *
     * @param {HTMLTableCellElement} element - Target cell.
     * @param {TableCellRenderSnapshot} cell - Cell snapshot.
     * @param {TableRenderInput} input - Render input.
     * @returns {void}
     */
    private applyBorders(
        element: HTMLTableCellElement,
        cell: TableCellRenderSnapshot,
        input: TableRenderInput
    ): void {
        const theme: SlideFrameThemeSnapshot | undefined = input.theme;
        const borders: TableCellRenderSnapshot['resolved']['borders'] = cell.resolved.borders;
        const buckets: ReturnType<typeof cellStyleBuckets> = this.style ? cellStyleBuckets(input.table, cell) : [];
        const edge: (side: 'top' | 'right' | 'bottom' | 'left') => string = (side): string => {
            const authored: DirectLine = cell.direct.borders[side];
            if (authored.present || !this.style) {
                return borderCss(authored.present ? authored : borders[side], theme);
            }
            const line: TableStyleLine | undefined = styleBorder(this.style, input.table, cell, buckets, side);
            return line ? styleLineCss(line, theme) : 'none';
        };
        element.style.borderTop = edge('top');
        element.style.borderRight = edge('right');
        element.style.borderBottom = edge('bottom');
        element.style.borderLeft = edge('left');
        const images: string[] = [];
        const down: string | undefined = diagonalCss(borders.insideDiagonalDown, 'to top right', theme);
        const up: string | undefined = diagonalCss(borders.insideDiagonalUp, 'to bottom right', theme);
        if (down) {
            images.push(down);
            element.dataset.diagonalDown = 'true';
        }
        if (up) {
            images.push(up);
            element.dataset.diagonalUp = 'true';
        }
        if (images.length > 0) {
            element.style.backgroundImage = images.join(', ');
        }
    }

    /**
     * Appends one `<p>` per paragraph with run-level formatting.
     *
     * @param {HTMLTableCellElement} element - Target cell.
     * @param {TableCellRenderSnapshot} cell - Cell snapshot.
     * @param {TableRenderInput} input - Render input.
     * @returns {void}
     */
    private appendParagraphs(
        element: HTMLTableCellElement,
        cell: TableCellRenderSnapshot,
        input: TableRenderInput
    ): void {
        for (const paragraph of paragraphsOf(cell.textBody)) {
            const block: HTMLParagraphElement = document.createElement('p');
            block.className = 'ej2-pptx-table-paragraph';
            block.style.margin = '0';
            block.style.whiteSpace = 'pre-wrap';
            block.style.lineHeight = '1.2';
            const alignment: string | undefined = alignmentCss(paragraph.alignment);
            if (alignment) {
                block.style.textAlign = alignment;
            }
            for (const item of contentOf(paragraph)) {
                if (item.kind === 'break') {
                    block.appendChild(document.createElement('br'));
                    continue;
                }
                if (typeof item.text === 'string' && item.text.length > 0) {
                    block.appendChild(this.buildRun(item, paragraph, cell, input));
                }
            }
            if (block.childNodes.length === 0) {
                block.appendChild(document.createElement('br'));
            }
            element.appendChild(block);
        }
    }

    /**
     * Builds one formatted `<span>`; run values override paragraph and table-style defaults.
     *
     * @param {TableRecord} run - Run record.
     * @param {TableRecord} paragraph - Owning paragraph record.
     * @param {TableCellRenderSnapshot} cell - Cell snapshot for table-style text defaults.
     * @param {TableRenderInput} input - Render input (theme).
     * @returns {HTMLSpanElement} The run.
     */
    private buildRun(
        run: TableRecord,
        paragraph: TableRecord,
        cell: TableCellRenderSnapshot,
        input: TableRenderInput
    ): HTMLSpanElement {
        const theme: SlideFrameThemeSnapshot | undefined = input.theme;
        const span: HTMLSpanElement = document.createElement('span');
        const defaults: TableCellRenderSnapshot['resolved']['textStyle'] = cell.resolved.textStyle;
        const styled: TableStyleText | undefined = this.style
            ? styleText(this.style, cellStyleBuckets(input.table, cell)) : undefined;
        span.textContent = String(run.text);
        const size: number = firstNumber(run.fontSizePt, paragraph.defaultFontSizePt,
                                         defaults ? defaults.fontSizePt : undefined) || 12;
        span.style.fontSize = `${fmt(size)}pt`;
        const family: string | undefined = firstString(run.fontFamily, paragraph.defaultFontFamily,
                                                       defaults ? defaults.fontFamily : undefined,
                                                       styledFontFamily(styled, theme));
        span.style.fontFamily = family ? `"${family.replace(/["\\]/gu, '')}", Arial, sans-serif` : 'Arial, sans-serif';
        if (run.bold === true || (run.bold === undefined && ((defaults && defaults.bold) || (styled && styled.bold)))) {
            span.style.fontWeight = 'bold';
        }
        if (run.italic === true || (run.italic === undefined && ((defaults && defaults.italic) || (styled && styled.italic)))) {
            span.style.fontStyle = 'italic';
        }
        const decorations: string[] = [];
        if (typeof run.underline === 'string' && run.underline !== 'none') {
            decorations.push('underline');
        }
        if (typeof run.strike === 'string' && run.strike !== 'noStrike') {
            decorations.push('line-through');
        }
        if (decorations.length > 0) {
            span.style.textDecoration = decorations.join(' ');
        }
        const color: RenderColor | undefined = textColor(run.color, theme) ||
            textColor(defaults ? defaults.color : undefined, theme) ||
            (styled && styled.color ? resolveStyleColor(styled.color, theme) : undefined);
        if (color) {
            span.style.color = rgba(color);
        }
        return span;
    }
}

/**
 * Ports `Cell.Layout` text-height accumulation plus top/bottom margins.
 *
 * @param {TableCellRenderSnapshot} cell - Cell snapshot.
 * @returns {number} Minimum cell height in points.
 */
function tableCellMinimumHeight(cell: TableCellRenderSnapshot): number {
    const paragraphs: TableRecord[] = paragraphsOf(cell.textBody);
    let textHeight: number = 0;
    if (paragraphs.length === 0) {
        textHeight = 12 * 1.2;
    }
    for (const paragraph of paragraphs) {
        let fontSize: number = typeof paragraph.defaultFontSizePt === 'number' ? paragraph.defaultFontSizePt : 12;
        let lineCount: number = 1;
        for (const item of contentOf(paragraph)) {
            if (typeof item.fontSizePt === 'number') {
                fontSize = Math.max(fontSize, item.fontSizePt);
            }
            if (item.kind === 'break') {
                lineCount++;
            }
            if (typeof item.text === 'string') {
                lineCount += (item.text.match(/\n/gu) || []).length;
            }
        }
        textHeight += lineCount * fontSize * 1.2;
    }
    return textHeight + emuToPoint(cell.direct.marginTopEmu + cell.direct.marginBottomEmu);
}

/**
 * Reads the paragraph records of a cell text body.
 *
 * @param {TableCellTextBodySnapshot} textBody - Cell text body.
 * @returns {TableRecord[]} Paragraph records.
 */
function paragraphsOf(textBody: TableCellTextBodySnapshot | undefined): TableRecord[] {
    const paragraphs: TableJsonValue = textBody ? textBody.paragraphs : undefined;
    return Array.isArray(paragraphs) ? paragraphs.filter(isRecord) : [];
}

/**
 * Reads ordered run/break/field records of a paragraph.
 *
 * @param {TableRecord} paragraph - Paragraph record.
 * @returns {TableRecord[]} Content records.
 */
function contentOf(paragraph: TableRecord): TableRecord[] {
    const sequence: TableJsonValue = Array.isArray(paragraph.content) ? paragraph.content : paragraph.runs;
    return Array.isArray(sequence) ? sequence.filter(isRecord) : [];
}

/**
 * Narrows a JSON value to an object record.
 *
 * @param {TableJsonValue} value - Candidate.
 * @returns {boolean} True for plain objects.
 */
function isRecord(value: TableJsonValue): value is TableRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Returns the first finite number.
 *
 * @param {TableJsonValue[]} values - Candidates.
 * @returns {number | undefined} First number or undefined.
 */
function firstNumber(...values: TableJsonValue[]): number | undefined {
    for (const value of values) {
        if (typeof value === 'number' && isFinite(value)) {
            return value;
        }
    }
    return undefined;
}

/**
 * Returns the first non-empty string.
 *
 * @param {TableJsonValue[]} values - Candidates.
 * @returns {string | undefined} First string or undefined.
 */
function firstString(...values: TableJsonValue[]): string | undefined {
    for (const value of values) {
        if (typeof value === 'string' && value.length > 0) {
            return value;
        }
    }
    return undefined;
}

/**
 * Maps a DrawingML paragraph alignment token to CSS.
 *
 * @param {TableJsonValue} value - `algn` token.
 * @returns {string | undefined} CSS text-align or undefined.
 */
function alignmentCss(value: TableJsonValue): string | undefined {
    const map: { [key: string]: string } = { l: 'left', ctr: 'center', r: 'right', just: 'justify', dist: 'justify' };
    return typeof value === 'string' ? map[value] : undefined;
}

/**
 * Resolves a run/table-style text colour snapshot.
 *
 * @param {TableJsonValue} value - `{ value, transforms }` colour snapshot.
 * @param {SlideFrameThemeSnapshot} theme - Theme.
 * @returns {RenderColor | undefined} Resolved colour.
 */
function textColor(value: TableJsonValue | TextColorSnapshot, theme: SlideFrameThemeSnapshot | undefined): RenderColor | undefined {
    if (!isColorSnapshot(value)) {
        return undefined;
    }
    return resolveRenderColor(value.value, value.transforms, theme);
}

/**
 * Narrows a value to a colour snapshot carrying a `{ kind }` colour value.
 *
 * @param {TableJsonValue | TextColorSnapshot} value - Candidate.
 * @returns {boolean} True for colour snapshots.
 */
function isColorSnapshot(value: TableJsonValue | TextColorSnapshot): value is TextColorSnapshot {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const inner: unknown = (value as { value?: unknown }).value;
    return typeof inner === 'object' && inner !== null && typeof (inner as { kind?: unknown }).kind === 'string';
}

/**
 * Resolves a table-style colour (scheme colours stay symbolic until here).
 *
 * @param {TableStyleColor} color - Style colour.
 * @param {SlideFrameThemeSnapshot} theme - Theme.
 * @param {ColorValue} placeholder - Resolved `phClr` for theme-matrix entries.
 * @returns {RenderColor} Resolved colour.
 */
function resolveStyleColor(
    color: TableStyleColor,
    theme: SlideFrameThemeSnapshot | undefined,
    placeholder?: RenderColor
): RenderColor {
    const stand: ColorValue | undefined = placeholder
        ? { kind: 'srgb', val: placeholder.color.replace('#', '') } : undefined;
    const resolved: RenderColor = resolveRenderColor(color.value, color.transforms, theme, stand);
    return placeholder && placeholder.opacity < 1 && resolved.opacity === 1
        ? { color: resolved.color, opacity: placeholder.opacity } : resolved;
}

/**
 * Converts a table-style fill to CSS, evaluating `a:fillRef` against the theme fill matrix.
 *
 * @param {TableStyleFill} fill - Style fill.
 * @param {SlideFrameThemeSnapshot} theme - Theme.
 * @returns {string} CSS colour.
 */
function styleFillCss(fill: TableStyleFill, theme: SlideFrameThemeSnapshot | undefined): string {
    if (fill.none) {
        return 'transparent';
    }
    if (fill.ref !== undefined) {
        const entry: SlideFrameFill | undefined = fill.ref > 0 && theme && theme.fillStyles
            ? theme.fillStyles[fill.ref - 1] : undefined;
        const placeholder: RenderColor | undefined = fill.color ? resolveStyleColor(fill.color, theme) : undefined;
        return entry ? matrixFillCss(entry, theme, placeholder) : 'transparent';
    }
    return fill.color ? rgba(resolveStyleColor(fill.color, theme)) : 'transparent';
}

/**
 * Flattens a theme fill-matrix entry to a CSS colour (gradients use their middle stop).
 *
 * @param {SlideFrameFill} entry - Matrix entry.
 * @param {SlideFrameThemeSnapshot} theme - Theme.
 * @param {RenderColor} placeholder - Resolved `phClr`.
 * @returns {string} CSS colour.
 */
function matrixFillCss(entry: SlideFrameFill, theme: SlideFrameThemeSnapshot | undefined, placeholder?: RenderColor): string {
    const stand: ColorValue | undefined = placeholder ? { kind: 'srgb', val: placeholder.color.replace('#', '') } : undefined;
    if (entry.kind === 'solid') {
        return rgba(resolveRenderColor(entry.color, entry.colorTransforms, theme, stand));
    }
    if (entry.kind === 'gradient' && entry.stops.length > 0) {
        const stop: SlideFrameGradientStop = entry.stops[Math.floor((entry.stops.length - 1) / 2)];
        return rgba(resolveRenderColor(stop.color, stop.colorTransforms, theme, stand));
    }
    return 'transparent';
}

/**
 * Builds a CSS border for a table-style line, evaluating `a:lnRef` against the theme line matrix.
 *
 * @param {TableStyleLine} line - Style line.
 * @param {SlideFrameThemeSnapshot} theme - Theme.
 * @returns {string} CSS border value.
 */
function styleLineCss(line: TableStyleLine, theme: SlideFrameThemeSnapshot | undefined): string {
    if (line.none) {
        return 'none';
    }
    let widthPt: number = line.widthEmu !== undefined ? emuToPoint(line.widthEmu) : 1;
    let color: RenderColor | undefined = line.color && line.ref === undefined ? resolveStyleColor(line.color, theme) : undefined;
    let dash: string | undefined = line.dash;
    if (line.ref !== undefined) {
        const entry: SlideFrameLineStyle | undefined = line.ref > 0 && theme && theme.lineStyles
            ? theme.lineStyles[line.ref - 1] : undefined;
        if (!entry || entry.fill.kind !== 'solid') {
            return 'none';
        }
        const placeholder: RenderColor | undefined = line.color ? resolveStyleColor(line.color, theme) : undefined;
        const stand: ColorValue | undefined = placeholder ? { kind: 'srgb', val: placeholder.color.replace('#', '') } : undefined;
        color = resolveRenderColor(entry.fill.color, entry.fill.colorTransforms, theme, stand);
        widthPt = entry.width !== undefined ? entry.width : widthPt;
        dash = dash || entry.dash;
    }
    if (!color) {
        return 'none';
    }
    const compound: boolean = line.compound === 'dbl';
    const style: string = compound ? 'double' : !dash || dash === 'solid' ? 'solid' : /dot/iu.test(dash) ? 'dotted' : 'dashed';
    return `${fmt(compound ? Math.max(widthPt, 3) : widthPt)}pt ${style} ${rgba(color)}`;
}

/**
 * Theme font named by a table-style text default (`fontRef idx="minor|major"`).
 *
 * @param {TableStyleText} styled - Style text defaults.
 * @param {SlideFrameThemeSnapshot} theme - Theme.
 * @returns {string | undefined} Typeface.
 */
function styledFontFamily(styled: TableStyleText | undefined, theme: SlideFrameThemeSnapshot | undefined): string | undefined {
    if (!styled || !styled.font) {
        return undefined;
    }
    if (styled.font !== 'minor' && styled.font !== 'major') {
        return styled.font;
    }
    const fonts: SlideFrameThemeSnapshot['fonts'] = theme ? theme.fonts : undefined;
    const latin: string | undefined = fonts ? fonts[styled.font].latin : undefined;
    return latin && latin.charAt(0) !== '+' ? latin : undefined;
}

/**
 * Resolves the cell background colour.
 *
 * @param {DirectFill} fill - Resolved fill.
 * @param {SlideFrameThemeSnapshot} theme - Theme.
 * @returns {string} CSS colour.
 */
function fillColor(fill: DirectFill, theme: SlideFrameThemeSnapshot | undefined): string {
    if (fill.kind === 'solid') {
        return rgba(resolveRenderColor(fill.color, fill.colorTransforms, theme));
    }
    return 'transparent';
}

/**
 * Builds a CSS border shorthand for one resolved table-cell edge.
 *
 * @param {DirectLine} line - Resolved border.
 * @param {SlideFrameThemeSnapshot} theme - Theme.
 * @returns {string} CSS border value.
 */
function borderCss(line: DirectLine, theme: SlideFrameThemeSnapshot | undefined): string {
    if (!line.present || line.fill.kind !== 'solid') {
        return 'none';
    }
    const color: RenderColor = resolveRenderColor(line.fill.color, line.fill.colorTransforms, theme);
    const dash: string | undefined = line.presetDash;
    const style: string = !dash || dash === 'solid' ? 'solid' : /dot/iu.test(dash) ? 'dotted' : 'dashed';
    return `${fmt(emuToPoint(line.widthEmu || 12700))}pt ${style} ${rgba(color)}`;
}

/**
 * Builds a gradient that draws a diagonal cell border.
 *
 * @param {DirectLine} line - Diagonal border.
 * @param {string} direction - CSS gradient direction.
 * @param {SlideFrameThemeSnapshot} theme - Theme.
 * @returns {string | undefined} CSS background-image layer.
 */
function diagonalCss(line: DirectLine, direction: string, theme: SlideFrameThemeSnapshot | undefined): string | undefined {
    if (!line.present || line.fill.kind !== 'solid') {
        return undefined;
    }
    const color: string = rgba(resolveRenderColor(line.fill.color, line.fill.colorTransforms, theme));
    const half: string = `${fmt(emuToPoint(line.widthEmu || 12700) / 2)}pt`;
    return `linear-gradient(${direction}, transparent calc(50% - ${half}), ${color} calc(50% - ${half}), ` +
        `${color} calc(50% + ${half}), transparent calc(50% + ${half}))`;
}

/**
 * Formats a resolved colour as CSS `rgba()`.
 *
 * @param {RenderColor} color - Colour with opacity.
 * @returns {string} CSS colour.
 */
function rgba(color: RenderColor): string {
    const hex: string = color.color.replace('#', '');
    const channel: (index: number) => number = (index: number): number => parseInt(hex.substr(index, 2), 16);
    return `rgba(${channel(0)}, ${channel(2)}, ${channel(4)}, ${fmt(color.opacity)})`;
}

/**
 * Builds the frame transform for rotation and flip about the centre.
 *
 * @param {TableFrameBounds} bounds - Frame placement.
 * @returns {string} CSS transform or an empty string.
 */
function frameTransform(bounds: TableFrameBounds): string {
    const operations: string[] = [];
    if (bounds.rotationDegrees) {
        operations.push(`rotate(${fmt(bounds.rotationDegrees)}deg)`);
    }
    if (bounds.flipHorizontal || bounds.flipVertical) {
        operations.push(`scale(${bounds.flipHorizontal ? -1 : 1}, ${bounds.flipVertical ? -1 : 1})`);
    }
    return operations.join(' ');
}

/**
 * Sums numbers.
 *
 * @param {number[]} values - Values.
 * @returns {number} Total.
 */
function sum(values: number[]): number {
    return values.reduce((total: number, value: number): number => total + value, 0);
}

/**
 * Formats a number with at most six decimals.
 *
 * @param {number} value - Number.
 * @returns {string} Compact string.
 */
function fmt(value: number): string {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}
