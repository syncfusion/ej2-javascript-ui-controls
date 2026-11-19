import { TextBoxLayout, TextLayoutLine } from './layout-paragraph';
import { ResolvedTextBody, ResolvedTextParagraph } from './resolve-text-body';
import {
    ClipboardLineModel,
    ClipboardParagraphModel,
    ClipboardSegmentModel,
    registerClipboardParagraph
} from '../../semantic/semantic-clipboard';

interface ParityTextLayoutLine extends TextLayoutLine {
    readonly paragraphIndex: number;
    readonly startOffset: number;
    readonly endOffset: number;
    readonly hardBreakAfter: boolean;
}

interface ParityTextLayoutSegment {
    readonly startOffset: number;
    readonly endOffset: number;
}

/** Safe hyperlink activation emitted by the HTML text layer.  @internal */
/**
 * @internal
 */
export interface TextHyperlinkActivation {
    readonly shapeId: string;
    readonly target?: string;
    readonly tooltip?: string;
    readonly action?: string;
}

/** Returns `false` to cancel the browser's safe default navigation.  @internal */
/**
 * @internal
 */
export type TextHyperlinkActivationHandler = (
    activation: TextHyperlinkActivation,
    event: MouseEvent
) => boolean | void;

/**
 * Emits selectable HTML text without using canvas for slide content.
 * @param {HTMLElement} host - host
 * @param {string} shapeId - shapeId
 * @param {TextBoxLayout} layout - layout
 * @param {string} shapeName - shapeName
 * @param {TextHyperlinkActivationHandler} onHyperlink - onHyperlink
 * @param {ResolvedTextBody} body - body
 * @returns {HTMLElement} result
 * @internal
 */
export function emitHtmlTextBox(
    host: HTMLElement,
    shapeId: string,
    layout: TextBoxLayout,
    shapeName: string = '',
    onHyperlink?: TextHyperlinkActivationHandler,
    body?: ResolvedTextBody
): HTMLElement {
    const box: HTMLElement = document.createElement('div');
    box.className = 'ej2-pptx-text-box';
    box.dataset.shapeId = shapeId;
    box.dataset.shapeName = shapeName;
    box.dataset.textWrap = layout.wrap;
    box.dataset.textClip = 'false';
    box.style.left = `${layout.xPt}pt`;
    box.style.top = `${layout.yPt}pt`;
    box.style.width = `${layout.widthPt}pt`;
    box.style.height = `${layout.heightPt}pt`;
    box.style.overflow = 'visible';
    box.style.whiteSpace = layout.wrap === 'none' ? 'nowrap' : 'normal';
    box.style.transform = layout.rotationDegrees === 0 ? '' : `rotate(${layout.rotationDegrees}deg)`;
    box.style.writingMode = layout.verticalType === 'vert' ? 'vertical-rl' :
        layout.verticalType === 'vert270' ? 'vertical-lr' : 'horizontal-tb';
    const paragraphElements: { [key: string]: HTMLElement } = {};
    for (const line of layout.lines) {
        const index: number = hasParityLineOffsets(line) ? line.paragraphIndex : 0;
        const key: string = String(index);
        let paragraph: HTMLElement = paragraphElements[key];
        if (!paragraph) {
            const source: ResolvedTextParagraph | undefined = body && body.paragraphs[index];
            const bulletKind: string = source && source.bullet ? source.bullet.kind : 'none';
            const isList: boolean = bulletKind !== 'none';
            paragraph = document.createElement(isList ? 'li' : /^Title\b/iu.test(shapeName) && index === 0 ? 'h1' : 'p');
            paragraph.className = 'ej2-pptx-text-paragraph';
            paragraph.style.display = 'contents';
            paragraph.dataset.paragraphIndex = key;
            if (isList) {
                const list: HTMLElement = document.createElement(bulletKind === 'numbered' ? 'ol' : 'ul');
                list.className = 'ej2-pptx-text-list';
                list.style.display = 'contents';
                paragraph.setAttribute('aria-level', String((source ? source.level : 0) + 1));
                list.appendChild(paragraph);
                box.appendChild(list);
            } else {
                box.appendChild(paragraph);
            }
            paragraphElements[key] = paragraph;
        }
        paragraph.appendChild(emitLine(line, shapeId, onHyperlink));
    }
    host.appendChild(box);
    registerTextBoxClipboard(host, box, shapeId, layout, body, paragraphElements);
    return box;
}

function registerTextBoxClipboard(
    root: HTMLElement,
    box: HTMLElement,
    shapeId: string,
    layout: TextBoxLayout,
    body: ResolvedTextBody | undefined,
    paragraphElements: { [key: string]: HTMLElement }
): void {
    const linesByParagraph: { [key: string]: ClipboardLineModel[] } = {};
    layout.lines.forEach((line: TextLayoutLine): void => {
        if (!hasParityLineOffsets(line)) {
            return;
        }
        const key: string = String(line.paragraphIndex);
        if (!linesByParagraph[key]) {
            linesByParagraph[key] = [];
        }
        const segments: ClipboardSegmentModel[] = [];
        line.segments.forEach((segment: TextLayoutLine['segments'][number]): void => {
            if (!hasParitySegmentOffsets(segment)) {
                return;
            }
            segments.push({
                text: segment.text,
                startOffset: segment.startOffset,
                endOffset: segment.endOffset,
                family: segment.fontFamily,
                authoredFamily: segment.authoredFontFamily,
                authoredEastAsianFamily: segment.authoredEastAsianFontFamily,
                authoredComplexScriptFamily: segment.authoredComplexScriptFontFamily,
                sizePt: segment.fontSizePt,
                bold: segment.bold,
                italic: segment.italic,
                underline: !!segment.underline && segment.underline !== 'none',
                strike: !!segment.strike && segment.strike !== 'noStrike',
                color: segment.color,
                hyperlink: segment.hyperlink ? segment.hyperlink.target : undefined,
                caps: segment.caps,
                baselinePercent: segment.baselinePercent
            });
        });
        linesByParagraph[key].push({
            startOffset: line.startOffset,
            endOffset: line.endOffset,
            hardBreakAfter: line.hardBreakAfter,
            segments
        });
    });
    Object.keys(linesByParagraph).sort((left: string, right: string): number => Number(left) - Number(right))
        .forEach((key: string): void => {
            const index: number = Number(key);
            const source: ResolvedTextParagraph | undefined = body && body.paragraphs[index];
            const firstLine: TextLayoutLine | undefined = layout.lines.find((line: TextLayoutLine): boolean =>
                hasParityLineOffsets(line) && line.paragraphIndex === index);
            const marker: string = firstLine && firstLine.marker ? firstLine.marker.text : '';
            const bulletKind: string = source && source.bullet ? source.bullet.kind : 'none';
            const model: ClipboardParagraphModel = {
                shapeId,
                paragraphIndex: index,
                level: source ? source.level : 0,
                rightToLeft: source ? source.rightToLeft : !!firstLine && firstLine.direction === 'rtl',
                listKind: bulletKind === 'numbered' ? 'number' : bulletKind === 'none' ? 'none' : 'bullet',
                markerText: marker,
                lines: linesByParagraph[key]
            };
            registerClipboardParagraph(root, paragraphElements[key] || box, model);
        });
}

function emitLine(
    line: TextLayoutLine,
    shapeId: string,
    onHyperlink?: TextHyperlinkActivationHandler
): HTMLElement {
    const element: HTMLElement = document.createElement('div');
    element.className = 'ej2-pptx-text-line';
    element.setAttribute('role', 'presentation');
    element.style.left = '0';
    element.style.top = `${line.topPt}pt`;
    element.style.height = `${line.heightPt}pt`;
    element.style.fontFamily = cssFontFamily(line.fontFamily, line.fontCandidates);
    element.style.fontSize = `${line.fontSizePt}pt`;
    element.style.fontWeight = line.bold ? '700' : '400';
    element.style.fontStyle = line.italic ? 'italic' : 'normal';
    element.style.lineHeight = `${line.heightPt}pt`;
    element.dataset.baselinePt = String(line.baselinePt);
    element.dataset.topPt = String(line.topPt);
    element.dataset.lineText = line.text;
    element.dataset.widthPt = String(line.widthPt);
    if (hasParityLineOffsets(line)) {
        element.dataset.paragraphIndex = String(line.paragraphIndex);
        element.dataset.startOffset = String(line.startOffset);
        element.dataset.endOffset = String(line.endOffset);
        element.dataset.hardBreakAfter = String(line.hardBreakAfter);
    }
    element.dir = line.direction;
    element.style.unicodeBidi = 'plaintext';
    element.appendChild(emitPositionProbe('origin', line.leftPt, 0));
    element.appendChild(emitPositionProbe('baseline', line.leftPt, line.baselinePt - line.topPt));
    if (line.marker) {
        element.appendChild(emitMarker(line));
    }
    for (const segment of line.segments) {
        const span: HTMLSpanElement | HTMLAnchorElement = segment.hyperlink
            ? document.createElement('a') : document.createElement('span');
        span.textContent = segment.text;
        span.style.position = 'absolute';
        span.style.left = `${segment.leftPt}pt`;
        // `baselineAdjustmentPt` (Skia ascent delta) is intentionally not applied: the browser already places the
        // glyph baseline from the rendered font's metrics, and the extra shift pushed text below the centre of
        // middle-anchored shapes (e.g. numbers in circles).
        span.style.top = `${segment.topOffsetPt}pt`;
        span.style.fontFamily = cssFontFamily(segment.fontFamily, segment.fontCandidates);
        span.style.fontSize = `${segment.fontSizePt}pt`;
        span.style.fontWeight = segment.bold ? '700' : '400';
        span.style.fontStyle = segment.italic ? 'italic' : 'normal';
        span.dataset.widthPt = String(segment.widthPt);
        if (hasParitySegmentOffsets(segment)) {
            span.dataset.startOffset = String(segment.startOffset);
            span.dataset.endOffset = String(segment.endOffset);
        }
        span.style.textTransform = segment.caps === 'all' ? 'uppercase' : '';
        span.style.fontVariant = segment.caps === 'small' ? 'small-caps' : '';
        span.style.letterSpacing = segment.characterSpacingPt ? `${segment.characterSpacingPt}pt` : '';
        span.style.textDecoration = textDecoration(segment.underline, segment.strike);
        if (segment.color) {
            span.style.color = segment.color;
            if (segment.colorOpacity !== undefined) {
                span.style.opacity = String(segment.colorOpacity);
            }
        }
        if (segment.highlight) {
            span.style.backgroundColor = segment.highlight;
        }
        if (segment.fieldType) {
            span.dataset.fieldType = segment.fieldType;
        }
        if (segment.hyperlink) {
            span.tabIndex = 0;
            span.setAttribute('role', 'link');
            if (segment.hyperlink.target) {
                span.dataset.href = segment.hyperlink.target;
                const safeTarget: string | undefined = safeHyperlinkTarget(segment.hyperlink.target);
                if (safeTarget) {
                    span.setAttribute('href', safeTarget);
                    span.setAttribute('rel', 'noopener noreferrer');
                    if (/^https?:/iu.test(safeTarget)) {
                        span.setAttribute('target', '_blank');
                    }
                }
            }
            if (segment.hyperlink.action) {
                span.dataset.action = segment.hyperlink.action;
            }
            if (segment.hyperlink.tooltip) {
                span.setAttribute('aria-label', segment.hyperlink.tooltip);
            }
            span.addEventListener('click', (event: MouseEvent): void => {
                const proceed: boolean | void = ((onHyperlink) !== undefined && (onHyperlink) !== null ? (onHyperlink)({
                    shapeId,
                    target: safeHyperlinkTarget(optionalProperty(segment.hyperlink, 'target')),
                    tooltip: optionalProperty(segment.hyperlink, 'tooltip'),
                    action: optionalProperty(segment.hyperlink, 'action')
                }, event) : undefined);
                if (proceed === false || !safeHyperlinkTarget(optionalProperty(segment.hyperlink, 'target'))) {
                    event.preventDefault();
                }
            });
        }
        element.appendChild(span);
    }
    return element;
}

function hasParityLineOffsets(line: TextLayoutLine): line is ParityTextLayoutLine {
    return 'paragraphIndex' in line && 'startOffset' in line && 'endOffset' in line && 'hardBreakAfter' in line;
}

function hasParitySegmentOffsets(segment: TextLayoutLine['segments'][number]): segment is
TextLayoutLine['segments'][number] & ParityTextLayoutSegment {
    return 'startOffset' in segment && 'endOffset' in segment;
}

function safeHyperlinkTarget(target: string | undefined): string | undefined {
    if (!target) {
        return undefined;
    }
    try {
        const parsed: URL = new URL(target);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:'
            ? parsed.href : undefined;
    } catch {
        return undefined;
    }
}

function emitPositionProbe(kind: 'origin' | 'baseline', leftPt: number, topPt: number): HTMLElement {
    const probe: HTMLElement = document.createElement('i');
    probe.className = `ej2-pptx-text-${kind}-probe`;
    probe.dataset.proofProbe = kind;
    probe.setAttribute('aria-hidden', 'true');
    probe.style.position = 'absolute';
    probe.style.left = `${leftPt}pt`;
    probe.style.top = `${topPt}pt`;
    probe.style.width = '0';
    probe.style.height = '0';
    probe.style.pointerEvents = 'none';
    return probe;
}

function emitMarker(line: TextLayoutLine): HTMLElement {
    const marker: import('./layout-paragraph').TextLayoutMarker = line.marker;
    if (!marker) {
        throw new Error('Expected text marker');
    }
    const element: HTMLElement = marker.kind === 'picture' ? document.createElement('img') : document.createElement('span');
    element.className = marker.kind === 'picture' ? 'ej2-pptx-picture-bullet' : 'ej2-pptx-text-bullet';
    element.style.position = 'absolute';
    element.style.left = `${marker.leftPt}pt`;
    element.style.top = `${marker.topPt - line.topPt}pt`;
    element.style.width = `${marker.widthPt}pt`;
    element.style.height = `${marker.heightPt}pt`;
    if (element instanceof HTMLImageElement) {
        element.src = marker.dataUri || '';
        element.alt = '';
    } else {
        element.textContent = marker.text;
        element.style.fontFamily = cssFontFamily(marker.fontFamily, marker.fontCandidates);
        element.style.fontSize = `${marker.fontSizePt}pt`;
        if (marker.color) {
            element.style.color = marker.color;
        }
        if (marker.colorOpacity !== undefined) {
            element.style.opacity = String(marker.colorOpacity);
        }
    }
    return element;
}

function cssFontFamily(primary: string, candidates: ReadonlyArray<string> | undefined): string {
    const generic: string = genericFamily(primary);
    const values: string[] = [];
    for (const family of [primary, ...(candidates || []), generic]) {
        const normalized: string = family.trim();
        if (normalized && !values.some((value: string): boolean => value.toLocaleLowerCase('en-US') ===
        normalized.toLocaleLowerCase('en-US'))) {
            values.push(normalized);
        }
    }
    return values.map((family: string): string => /^(?:serif|sans-serif|monospace)$/u.test(family)
        ? family : `"${family.replace(/["\\]/gu, '\\$&')}"`).join(', ');
}

function genericFamily(name: string): 'serif' | 'sans-serif' | 'monospace' {
    if (/mono|courier|consolas|code/iu.test(name)) {
        return 'monospace';
    }
    if (/serif|times|cambria|georgia|garamond|caladea/iu.test(name)) {
        return 'serif';
    }
    return 'sans-serif';
}

function textDecoration(underline: string | undefined, strike: string | undefined): string {
    const values: string[] = [];
    if (underline && underline !== 'none') {
        values.push('underline');
    }
    if (strike && strike !== 'noStrike') {
        values.push('line-through');
    }
    return values.join(' ');
}

/** Reads a property only when its owner is present.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    return value !== undefined && value !== null ? value[key] : undefined;
}
