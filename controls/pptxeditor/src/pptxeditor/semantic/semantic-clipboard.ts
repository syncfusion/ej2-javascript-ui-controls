/**
 * Model-backed clipboard serialization for slide content.
 * @internal
 */
export interface ClipboardSegmentModel {
    text: string;
    startOffset: number;
    endOffset: number;
    family: string;
    authoredFamily?: string;
    authoredEastAsianFamily?: string;
    authoredComplexScriptFamily?: string;
    sizePt: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strike: boolean;
    color?: string;
    hyperlink?: string;
    caps?: string;
    baselinePercent?: number;
}

/**
 * @internal
 */
export interface ClipboardLineModel {
    startOffset: number;
    endOffset: number;
    hardBreakAfter: boolean;
    segments: ReadonlyArray<ClipboardSegmentModel>;
}

/**
 * @internal
 */
export interface ClipboardParagraphModel {
    shapeId: string;
    paragraphIndex: number;
    level: number;
    rightToLeft: boolean;
    listKind: 'none' | 'bullet' | 'number';
    markerText: string;
    lines: ReadonlyArray<ClipboardLineModel>;
}

/**
 * @internal
 */
export interface ClipboardTableCellModel {
    shapeId: string;
    row: number;
    column: number;
    rowSpan: number;
    columnSpan: number;
    text: string;
}

/**
 * @internal
 */
export interface ClipboardPictureModel {
    shapeId: string;
    altText: string;
    decorative: boolean;
}

interface ParagraphEntry {
    element: HTMLElement;
    model: ClipboardParagraphModel;
    segments: ReadonlyArray<HTMLElement>;
}

interface CellEntry {
    element: HTMLElement;
    model: ClipboardTableCellModel;
}

interface PictureEntry {
    element: Element;
    model: ClipboardPictureModel;
}

type ClipboardEntry =
    { kind: 'paragraph'; value: ParagraphEntry } |
    { kind: 'cell'; value: CellEntry } |
    { kind: 'picture'; value: PictureEntry };

interface ClipboardState {
    paragraphs: ParagraphEntry[];
    cells: CellEntry[];
    entries: ClipboardEntry[];
}

/**
 * @internal
 */
export interface ClipboardPayload {
    plain: string;
    html: string;
}

const states: WeakMap<HTMLElement, ClipboardState> = new WeakMap<HTMLElement, ClipboardState>();

/**
 * @internal
 */
export function registerClipboardParagraph(
    root: HTMLElement,
    element: HTMLElement,
    model: ClipboardParagraphModel
): void {
    const state: ClipboardState = ensureState(root);
    const entry: ParagraphEntry = { element, model, segments: collectSegments(element) };
    state.paragraphs.push(entry);
    state.entries.push({ kind: 'paragraph', value: entry });
}

/**
 * @internal
 */
export function registerClipboardTableCell(
    root: HTMLElement,
    element: HTMLElement,
    model: ClipboardTableCellModel
): void {
    const state: ClipboardState = ensureState(root);
    const entry: CellEntry = { element, model };
    state.cells.push(entry);
    state.entries.push({ kind: 'cell', value: entry });
}

/**
 * @internal
 */
export function registerClipboardPicture(
    root: HTMLElement,
    element: Element,
    model: ClipboardPictureModel
): void {
    ensureState(root).entries.push({ kind: 'picture', value: { element, model } });
}

function ensureState(root: HTMLElement): ClipboardState {
    const existing: ClipboardState | undefined = states.get(root);
    if (existing) {
        return existing;
    }
    const state: ClipboardState = { paragraphs: [], cells: [], entries: [] };
    states.set(root, state);
    root.addEventListener('copy', (event: Event): void => writeClipboard(root, event));
    root.addEventListener('cut', (event: Event): void => writeClipboard(root, event));
    return state;
}

/**
 * Resolves the clipboard state for a slide content root. Content is registered
 * on the root the emitter was given, which for rendered slides is each paint
 * layer inside the content root, so the states of `root` and of every
 * descendant paint layer are merged (in document order).
 */
function resolveState(root: HTMLElement): ClipboardState | undefined {
    const hosts: HTMLElement[] = [root];
    const layers: NodeListOf<HTMLElement> = root.querySelectorAll('[data-paint-layer]');
    for (let i: number = 0; i < layers.length; i++) {
        hosts.push(layers[i]);
    }
    const found: ClipboardState[] = [];
    hosts.forEach((host: HTMLElement): void => {
        const state: ClipboardState | undefined = states.get(host);
        if (state) {
            found.push(state);
        }
    });
    if (found.length === 0) {
        return undefined;
    }
    if (found.length === 1) {
        return found[0];
    }
    const merged: ClipboardState = { paragraphs: [], cells: [], entries: [] };
    found.forEach((state: ClipboardState): void => {
        Array.prototype.push.apply(merged.paragraphs, state.paragraphs);
        Array.prototype.push.apply(merged.cells, state.cells);
        Array.prototype.push.apply(merged.entries, state.entries);
    });
    return merged;
}

function collectSegments(element: HTMLElement): ReadonlyArray<HTMLElement> {
    const found: NodeListOf<HTMLElement> = element.querySelectorAll('[data-start-offset]');
    const fallback: NodeListOf<HTMLElement> = element.querySelectorAll('span, a');
    return Array.prototype.slice.call(found.length > 0 ? found : fallback) as HTMLElement[];
}

function writeClipboard(root: HTMLElement, event: Event): void {
    const selection: Selection | null = root.ownerDocument.defaultView !== null
        ? root.ownerDocument.defaultView.getSelection() : null;
    const payload: ClipboardPayload | undefined = clipboardPayloadForSelection(root, selection);
    const clipboardEvent: ClipboardEvent = event as ClipboardEvent;
    if (!payload || !clipboardEvent.clipboardData) {
        return;
    }
    clipboardEvent.clipboardData.setData('text/plain', payload.plain);
    clipboardEvent.clipboardData.setData('text/html', payload.html);
    event.preventDefault();
}

/**
 * Builds the model-backed clipboard payload used by keyboard, ribbon and context copy paths.
 * @param {HTMLElement} root - Registered slide content root.
 * @param {Selection | null} selection - Current browser selection.
 * @returns {ClipboardPayload | undefined} Clipboard payload when registered content is selected.
 * @internal
 */
export function clipboardPayloadForSelection(
    root: HTMLElement,
    selection: Selection | null
): ClipboardPayload | undefined {
    const state: ClipboardState | undefined = resolveState(root);
    if (!selection || selection.rangeCount === 0 || !state) {
        return undefined;
    }
    const ranges: Range[] = [];
    for (let index: number = 0; index < selection.rangeCount; index++) {
        ranges.push(selection.getRangeAt(index));
    }
    return buildPayload(state, ranges);
}

/**
 * Character formatting of the currently selected slide text, aggregated the way
 * PowerPoint's Font group does: a value is shown only when every selected run
 * agrees (mixed font name / size are `undefined`; B / I / U / S are on only when
 * every selected run has the format).
 * @internal
 */
export interface SelectionFontState {
    /** Common font name, or `undefined` when the selection mixes fonts. */
    family?: string;
    /** Common font size in points, or `undefined` when the selection mixes sizes. */
    sizePt?: number;
    /** True when every selected run is bold. */
    bold: boolean;
    /** True when every selected run is italic. */
    italic: boolean;
    /** True when every selected run is underlined. */
    underline: boolean;
    /** True when every selected run has strikethrough. */
    strike: boolean;
}

/**
 * Reads the formatting of the text runs covered by the current browser selection.
 * @param {HTMLElement} root - Registered slide content root.
 * @param {Selection | null} selection - Current browser selection.
 * @returns {SelectionFontState | undefined} Aggregated state, or `undefined` when no registered text run is selected.
 * @internal
 */
export function fontStateForSelection(
    root: HTMLElement,
    selection: Selection | null
): SelectionFontState | undefined {
    const state: ClipboardState | undefined = resolveState(root);
    if (!selection || selection.rangeCount === 0 || !state) {
        return undefined;
    }
    const segments: ClipboardSegmentModel[] = [];
    for (let index: number = 0; index < selection.rangeCount; index++) {
        const range: Range = selection.getRangeAt(index);
        state.paragraphs.forEach((entry: ParagraphEntry): void => {
            if (intersects(range, entry.element)) {
                collectSelectedSegments(entry, range, segments);
            }
        });
    }
    if (segments.length === 0) {
        return undefined;
    }
    const first: ClipboardSegmentModel = segments[0];
    const family: string = first.authoredFamily || first.family;
    return {
        family: segments.every((s: ClipboardSegmentModel): boolean => (s.authoredFamily || s.family) === family)
            ? family : undefined,
        sizePt: segments.every((s: ClipboardSegmentModel): boolean => s.sizePt === first.sizePt)
            ? first.sizePt : undefined,
        bold: segments.every((s: ClipboardSegmentModel): boolean => s.bold),
        italic: segments.every((s: ClipboardSegmentModel): boolean => s.italic),
        underline: segments.every((s: ClipboardSegmentModel): boolean => s.underline),
        strike: segments.every((s: ClipboardSegmentModel): boolean => s.strike)
    };
}

function collectSelectedSegments(
    entry: ParagraphEntry,
    range: Range,
    out: ClipboardSegmentModel[]
): void {
    let segmentIndex: number = 0;
    entry.model.lines.forEach((line: ClipboardLineModel): void => {
        line.segments.forEach((segment: ClipboardSegmentModel): void => {
            const element: HTMLElement | undefined = entry.segments[segmentIndex++];
            if (!element || !intersects(range, element)) {
                return;
            }
            const bounds: [number, number] = selectedBounds(range, element, segment.text.length);
            if (bounds[1] > bounds[0] && segment.text.slice(bounds[0], bounds[1]).trim().length > 0) {
                out.push(segment);
            }
        });
    });
}

function buildPayload(state: ClipboardState, ranges: ReadonlyArray<Range>): ClipboardPayload | undefined {
    const selected: ClipboardEntry[] = state.entries.filter((entry: ClipboardEntry): boolean =>
        ranges.some((range: Range): boolean => intersects(range, entry.value.element)));
    const blocks: Array<{ shapeId: string; plain: string; html: string }> = [];
    for (let index: number = 0; index < selected.length;) {
        const entry: ClipboardEntry = selected[index];
        if (entry.kind === 'picture') {
            if (!entry.value.model.decorative && entry.value.model.altText) {
                const alt: string = entry.value.model.altText;
                blocks.push({ shapeId: entry.value.model.shapeId, plain: '[Image: ' + alt + ']',
                    html: '<figure><span role="img" aria-label="' + escapeAttribute(alt) + '">' +
                        escapeHtml(alt) + '</span></figure>' });
            }
            index++;
            continue;
        }
        if (entry.kind === 'cell') {
            const cells: CellEntry[] = [];
            const shapeId: string = entry.value.model.shapeId;
            while (index < selected.length && selected[index].kind === 'cell' &&
                (selected[index] as { kind: 'cell'; value: CellEntry }).value.model.shapeId === shapeId) {
                cells.push((selected[index] as { kind: 'cell'; value: CellEntry }).value);
                index++;
            }
            const payload: ClipboardPayload = tablePayload(cells);
            blocks.push({ shapeId, plain: payload.plain, html: payload.html });
            continue;
        }
        const range: Range | undefined = ranges.find((candidate: Range): boolean =>
            intersects(candidate, entry.value.element));
        if (range) {
            const payload: ClipboardPayload = paragraphPayload([entry.value], range);
            blocks.push({ shapeId: entry.value.model.shapeId, plain: payload.plain, html: payload.html });
        }
        index++;
    }
    if (blocks.length === 0) { return undefined; }
    const plain: string[] = [];
    const html: string[] = [];
    blocks.forEach((block: { shapeId: string; plain: string; html: string }, index: number): void => {
        if (index > 0) { plain.push(blocks[index - 1].shapeId === block.shapeId ? '\n' : '\n\n'); }
        plain.push(block.plain); html.push(block.html);
    });
    return { plain: plain.join(''), html: html.join('') };
}

function paragraphPayload(entries: ReadonlyArray<ParagraphEntry>, range: Range): ClipboardPayload {
    const plainParts: string[] = [];
    const htmlParts: string[] = [];
    let lastShape: string | undefined;
    entries.forEach((entry: ParagraphEntry): void => {
        if (lastShape !== undefined && lastShape !== entry.model.shapeId) {
            plainParts.push('');
        }
        const content: ClipboardPayload = selectedParagraph(entry, range);
        const prefix: string = listPrefix(entry.model);
        plainParts.push(prefix + content.plain);
        const direction: string = entry.model.rightToLeft ? ' dir="rtl"' : '';
        if (entry.model.listKind === 'bullet') {
            htmlParts.push('<ul' + direction + '><li>' + content.html + '</li></ul>');
        } else if (entry.model.listKind === 'number') {
            htmlParts.push('<ol' + direction + '><li>' + content.html + '</li></ol>');
        } else {
            htmlParts.push('<p' + direction + '>' + content.html + '</p>');
        }
        lastShape = entry.model.shapeId;
    });
    return { plain: plainParts.join('\n'), html: htmlParts.join('') };
}

function selectedParagraph(entry: ParagraphEntry, range: Range): ClipboardPayload {
    const plain: string[] = [];
    const html: string[] = [];
    let segmentIndex: number = 0;
    entry.model.lines.forEach((line: ClipboardLineModel): void => {
        line.segments.forEach((segment: ClipboardSegmentModel): void => {
            const element: HTMLElement | undefined = entry.segments[segmentIndex++];
            if (!element || !intersects(range, element)) {
                return;
            }
            const bounds: [number, number] = selectedBounds(range, element, segment.text.length);
            const text: string = segment.text.slice(bounds[0], bounds[1]);
            plain.push(text);
            html.push(segmentHtml(segment, text));
        });
        if (line.hardBreakAfter && plain.length > 0) {
            plain.push('\n');
            html.push('<br>');
        }
    });
    if (plain[plain.length - 1] === '\n') {
        plain.pop();
    }
    if (html[html.length - 1] === '<br>') {
        html.pop();
    }
    return { plain: plain.join(''), html: html.join('') };
}

function selectedBounds(range: Range, element: HTMLElement, length: number): [number, number] {
    const text: ChildNode | null = element.firstChild;
    let start: number = 0;
    let end: number = length;
    if (text && range.startContainer === text) {
        start = Math.min(length, range.startOffset);
    }
    if (text && range.endContainer === text) {
        end = Math.min(length, range.endOffset);
    }
    return [start, end];
}

function segmentHtml(segment: ClipboardSegmentModel, value: string): string {
    let result: string = escapeHtml(value);
    const styles: string[] = [];
    const authoredFamily: string = segment.authoredFamily || segment.family;
    if (authoredFamily) {
        styles.push('font-family:' + clipboardFontFamily(authoredFamily));
    }
    styles.push('font-size:' + segment.sizePt + 'pt');
    if (segment.bold) { styles.push('font-weight:bold'); }
    if (segment.italic) { styles.push('font-style:italic'); }
    if (segment.underline) { styles.push('text-decoration:underline'); }
    if (segment.strike) { styles.push('text-decoration:line-through'); }
    if (segment.color) { styles.push('color:' + escapeAttribute(segment.color)); }
    if (segment.caps === 'all') { styles.push('text-transform:uppercase'); }
    if (segment.caps === 'small') { styles.push('font-variant:small-caps'); }
    if (segment.baselinePercent !== undefined && segment.baselinePercent > 0) {
        styles.push('vertical-align:super');
    } else if (segment.baselinePercent !== undefined && segment.baselinePercent < 0) {
        styles.push('vertical-align:sub');
    }
    result = '<span style="' + styles.join(';') + '">' + result + '</span>';
    if (segment.hyperlink && safeHref(segment.hyperlink)) {
        result = '<a href="' + escapeAttribute(segment.hyperlink) + '">' + result + '</a>';
    }
    return result;
}

function tablePayload(entries: ReadonlyArray<CellEntry>): ClipboardPayload {
    const sorted: CellEntry[] = entries.slice().sort((left: CellEntry, right: CellEntry): number =>
        left.model.row - right.model.row || left.model.column - right.model.column);
    const rows: { [key: string]: CellEntry[] } = {};
    sorted.forEach((entry: CellEntry): void => {
        const key: string = String(entry.model.row);
        if (!rows[key]) { rows[key] = []; }
        rows[key].push(entry);
    });
    const keys: string[] = Object.keys(rows).sort((left: string, right: string): number => Number(left) - Number(right));
    const plain: string = keys.map((key: string): string => rows[key].map(
        (entry: CellEntry): string => entry.model.text).join('\t')).join('\n');
    const html: string = '<table><tbody>' + keys.map((key: string): string => '<tr>' + rows[key].map(
        (entry: CellEntry): string => '<td>' + escapeHtml(entry.model.text) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table>';
    return { plain, html };
}

function listPrefix(model: ClipboardParagraphModel): string {
    if (model.listKind === 'none') { return ''; }
    return new Array(model.level + 1).join('\t') + model.markerText + ' ';
}

function intersects(range: Range, node: Node): boolean {
    try {
        return range.intersectsNode(node);
    } catch (_error) {
        return false;
    }
}

function safeHref(value: string): boolean {
    return /^(https?:|mailto:)/i.test(value);
}

function clipboardFontFamily(value: string): string {
    const safe: string = value.trim().replace(/[\\;"<>]/gu, '');
    const family: string = '&quot;' + escapeHtml(safe) + '&quot;';
    return family + ',' + clipboardGenericFamily(safe);
}

function clipboardGenericFamily(value: string): 'serif' | 'sans-serif' | 'monospace' {
    const lower: string = value.toLocaleLowerCase('en-US');
    if (/monospace|courier|consolas|(?:^|[\s-])mono(?:$|[\s-])|(?:^|[\s-])code(?:$|[\s-])/u.test(lower)) {
        return 'monospace';
    }
    if (/serif|times|cambria|georgia|garamond|caladea/u.test(lower)) { return 'serif'; }
    return 'sans-serif';
}

function escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttribute(value: string): string {
    return escapeHtml(value).replace(/"/g, '&quot;');
}
