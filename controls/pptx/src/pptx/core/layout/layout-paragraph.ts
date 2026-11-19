import { EffectiveTextCharacterFills } from '../resolve/resolve-text-fills';
import { DirectTransform } from '../resolve/read-xfrm';
import {
    TextBulletColorSnapshot, TextBulletFontSnapshot, TextBulletSizeSnapshot, TextBulletSnapshot
} from '../../worker/text-style-inheritance';
import { LayoutRenderColor, resolveLayoutColor } from './color-resolution';
import {
    LayoutTextCharacterSnapshot, LayoutTextColorSnapshot, LayoutTextContentSnapshot, LayoutThemeSnapshot
} from './layout-model';
import { TextMeasureRequest, TextMeasureResult, TextMeasurer } from './text-measurer';
import { ResolvedTextBody, ResolvedTextParagraph } from './resolve-text-body';
import { skiaLayoutAscent } from './skia-font-metrics';
import { textPoint } from './text-units';
import { cacheLayoutInfo, createParagraphInfos } from './layout-info';
import { applyBidiLayout, containsStrongRightToLeft } from './bidi-layout';
import {
    ComplexScriptTextPart, containsComplexScript, resolveComplexScriptFont, splitComplexScriptText
} from './complex-script-font';
import { arrayAt } from '../util/es5-compat';
import { SymbolFontBulletReplacement, resolveSymbolFontBullet } from './symbol-font-map';

type SlideFrameThemeSnapshot = LayoutThemeSnapshot;
type TextCharacterSnapshot = LayoutTextCharacterSnapshot;

export interface TextLayoutLine {
    readonly paragraphIndex: number;
    readonly startOffset: number;
    readonly endOffset: number;
    readonly hardBreakAfter: boolean;
    readonly text: string;
    readonly leftPt: number;
    readonly topPt: number;
    readonly baselinePt: number;
    readonly widthPt: number;
    readonly heightPt: number;
    readonly fontFamily: string;
    readonly fontCandidates?: ReadonlyArray<string>;
    readonly fontSizePt: number;
    readonly bold: boolean;
    readonly italic: boolean;
    readonly alignment: string;
    readonly direction: 'ltr' | 'rtl';
    readonly marker?: TextLayoutMarker;
    readonly segments: ReadonlyArray<TextLayoutSegment>;
}

export interface TextLayoutMarker {
    readonly kind: 'text' | 'picture';
    readonly text: string;
    readonly dataUri?: string;
    readonly leftPt: number;
    readonly topPt: number;
    readonly widthPt: number;
    readonly heightPt: number;
    readonly fontFamily: string;
    readonly fontCandidates?: ReadonlyArray<string>;
    readonly fontSizePt: number;
    readonly color?: string;
    readonly colorOpacity?: number;
}

export interface TextLayoutSegment {
    readonly effectiveCharacterFills?: EffectiveTextCharacterFills;
    readonly startOffset: number;
    readonly endOffset: number;
    readonly text: string;
    /** Original private-use character retained for rich clipboard output. */
    readonly authoredText?: string;
    /** Exact sourced Unicode mapping when visual fallback text differs. */
    readonly mappedText?: string;
    /** Original `a:sym` face retained separately from the Unicode render face. */
    readonly authoredSymbolFontFamily?: string;
    /** True only when a cited symbol-font mapping supplied the rendered text. */
    readonly symbolMapped?: boolean;
    readonly leftPt: number;
    readonly widthPt: number;
    readonly fontFamily: string;
    readonly fontCandidates?: ReadonlyArray<string>;
    readonly fontSizePt: number;
    readonly topOffsetPt: number;
    /** Paint offset that aligns the browser glyph baseline with Skia. */
    readonly baselineAdjustmentPt?: number;
    readonly bold: boolean;
    readonly italic: boolean;
    readonly underline?: string;
    readonly strike?: string;
    readonly baselinePercent?: number;
    readonly characterSpacingPt?: number;
    readonly color?: string;
    readonly colorOpacity?: number;
    readonly highlight?: string;
    readonly hyperlink?: { readonly target?: string; readonly tooltip?: string; readonly action?: string };
    readonly fieldType?: string;
    readonly caps?: string;
}

export interface TextBoxLayout {
    readonly xPt: number;
    readonly yPt: number;
    readonly widthPt: number;
    readonly heightPt: number;
    readonly rotationDegrees: number;
    readonly verticalType: string;
    readonly wrap: string;
    readonly lines: ReadonlyArray<TextLayoutLine>;
}

interface Token {
    readonly effectiveCharacterFills?: EffectiveTextCharacterFills;
    readonly id: string;
    readonly text: string;
    readonly authoredText?: string;
    readonly mappedText?: string;
    readonly authoredSymbolFontFamily?: string;
    readonly symbolMapped?: boolean;
    readonly paragraphIndex: number;
    readonly startOffset: number;
    readonly endOffset: number;
    readonly family: string;
    readonly fontCandidates?: ReadonlyArray<string>;
    readonly sizePt: number;
    readonly bold: boolean;
    readonly italic: boolean;
    readonly tab: boolean;
    readonly break: boolean;
    readonly underline?: string;
    readonly strike?: string;
    readonly baselinePercent?: number;
    readonly characterSpacingPt?: number;
    readonly color?: string;
    readonly colorOpacity?: number;
    readonly highlight?: string;
    readonly hyperlink?: { readonly target?: string; readonly tooltip?: string; readonly action?: string };
    readonly fieldType?: string;
    readonly caps?: string;
}

interface SymbolRunPart {
    readonly text: string;
    readonly authoredText?: string;
    readonly mappedText?: string;
    readonly family: string;
    readonly fontCandidates?: ReadonlyArray<string>;
    readonly mapped?: boolean;
}

interface WrappedLine {
    readonly tokens: ReadonlyArray<Token>;
    readonly widthPt: number;
    readonly startOffset: number;
    readonly endOffset: number;
    readonly hardBreakAfter: boolean;
}

interface ParagraphMarker {
    readonly kind: 'text' | 'picture';
    readonly id: string;
    readonly text: string;
    readonly dataUri?: string;
    readonly family: string;
    readonly fontCandidates?: ReadonlyArray<string>;
    readonly sizePt: number;
    readonly color?: string;
    readonly colorOpacity?: number;
}

export interface TextFrameBounds {
    readonly leftPt: number;
    readonly topPt: number;
    readonly widthPt: number;
    readonly heightPt: number;
}

/**
 * ports `Paragraph.Layout` and the Skia `MeasureString` batching boundary.
 * @param {ResolvedTextBody} body - body
 * @param {DirectTransform} transform - transform
 * @param {TextMeasurer} measurer - measurer
 * @param {SlideFrameThemeSnapshot} theme - theme
 * @param {TextFrameBounds} textFrame - textFrame
 * @returns {Promise} result
 */
export async function layoutTextBody(
    body: ResolvedTextBody,
    transform: DirectTransform,
    measurer: TextMeasurer,
    theme?: SlideFrameThemeSnapshot,
    textFrame?: TextFrameBounds
): Promise<TextBoxLayout> {
    const widthPt: number = emuToPoint(transform.cx || 0);
    const heightPt: number = emuToPoint(transform.cy || 0);
    const vertical: boolean = body.properties.verticalType !== 'horz';
    const frameLeft: number = optionalProperty(textFrame, 'leftPt') || 0;
    const frameTop: number = optionalProperty(textFrame, 'topPt') || 0;
    const frameWidth: number = nullishValue(optionalProperty(textFrame, 'widthPt'), () => widthPt);
    const frameHeight: number = nullishValue(optionalProperty(textFrame, 'heightPt'), () => heightPt);
    const innerWidth: number = vertical
        ? Math.max(0, heightPt - body.properties.topInsetPt - body.properties.bottomInsetPt)
        : Math.max(0, frameWidth - body.properties.leftInsetPt - body.properties.rightInsetPt);
    const columns: number = Math.max(1, body.properties.columnCount);
    const columnWidth: number = Math.max(0,
                                         (innerWidth - body.properties.columnSpacingPt * (columns - 1)) / columns);
    const tokens: Token[] = buildTokens(body, theme);
    const markers: ReadonlyArray<ParagraphMarker | undefined> = buildMarkers(body, theme);
    const requests: TextMeasureRequest[] = [];
    tokens.filter((token: Token): boolean => !token.tab && !token.break).forEach((token: Token): void => {
        requests.push(measureRequest(token));
        Array.from(token.text).forEach((character: string, index: number): void => {
            requests.push(measureRequest({ ...token, id: characterId(token, index), text: character }));
        });
    });
    markers.forEach((marker: ParagraphMarker | undefined): void => {
        if (optionalProperty(marker, 'kind') === 'text') {
            requests.push(measureRequest({
                id: marker.id, text: marker.text, paragraphIndex: -1, family: marker.family,
                startOffset: 0, endOffset: 0,
                sizePt: marker.sizePt, bold: false, italic: false, tab: false, break: false
            }));
        }
    });
    const measured: ReadonlyArray<TextMeasureResult> = await measurer.measure(requests);
    const metrics: Map<string, TextMeasureResult> = new Map(
        measured.map((value: TextMeasureResult): [string, TextMeasureResult] => [value.id, value]));
    const lines: TextLayoutLine[] = [];
    let top: number = 0;
    let column: number = 0;
    body.paragraphs.forEach((paragraph: ResolvedTextParagraph, paragraphIndex: number): void => {
        const paragraphTokens: Token[] = tokens.filter((token: Token): boolean => token.paragraphIndex === paragraphIndex);
        const metricFontSize: number = nullishValue(optionalProperty(paragraph.endParagraphProperties, 'fontSizePt'), () => paragraph.defaultFontSizePt);
        const before: number = paragraphIndex === 0 ? 0 :
            paragraphSpacingPoints(paragraph.spaceBefore, metricFontSize);
        const after: number = paragraphIndex === body.paragraphs.length - 1 ? 0 :
            paragraphSpacingPoints(paragraph.spaceAfter, metricFontSize);
        top += before;
        const marker: ParagraphMarker | undefined = arrayAt(markers, paragraphIndex);
        const markerMetric: TextMeasureResult | undefined = marker ? metrics.get(marker.id) : undefined;
        const markerWidth: number = optionalProperty(marker, 'kind') === 'picture' ? marker.sizePt : (optionalProperty(markerMetric, 'widthPt') || 0);
        const markerIndent: number = paragraph.indentPt > 0 ? paragraph.leftMarginPt :
            Math.max(0, paragraph.leftMarginPt + paragraph.indentPt);
        let usedWidth: number = paragraph.leftMarginPt;
        if (marker) {
            if (paragraph.indentPt > 0) {
                usedWidth += paragraph.indentPt;
            } else if (paragraph.leftMarginPt + paragraph.indentPt < 0) {
                usedWidth = -paragraph.indentPt;
            }
            usedWidth = Math.max(usedWidth, markerIndent + markerWidth);
        }
        // ports `Paragraph.LayoutNewLine`: wrapped continuations restart at
        // `marginLeft`; a hanging bullet/first-line indent applies only to the
        // first line.
        const continuationWidth: number = Math.max(0, paragraph.leftMarginPt);
        const firstLineWidth: number = usedWidth + (marker ? 0 : paragraph.indentPt);
        const available: number = body.properties.wrap === 'none' ? Number.POSITIVE_INFINITY :
            Math.max(0, columnWidth - continuationWidth);
        const lineGroups: WrappedLine[] = wrapTokens(
            paragraphTokens, metrics, available, firstLineWidth - continuationWidth, paragraph.tabs);
        lineGroups.forEach((wrapped: WrappedLine, lineIndex: number): void => {
            const group: ReadonlyArray<Token> = wrapped.tokens;
            const firstToken: Token = group[0] || defaultToken(paragraph, paragraphIndex, body);
            const metric: TextMeasureResult | undefined = metrics.get(firstToken.id);
            const scale: number = 1;
            // ports `Paragraph.LayoutText`/`GetLineSpace`: the paragraph renderer
            // floors its measured line box at PowerPoint's 120% font-size default.
            const baseHeight: number = firstToken.sizePt * 1.2;
            const reductionPercent: number = body.properties.autoFit.type === 'normal'
                ? nullishValue(body.properties.autoFit.lineSpacingReduction, () => 0) : 0;
            const lineHeight: number = spacingPoints(
                paragraph.lineSpacing,
                baseHeight,
                reductionPercent,
                paragraph.styleSources.lineSpacing === 'direct'
            ) * scale;
            // ports `PresentationRenderer.GetAscent`: baseline layout consumes
            // the authored family's FontMetricsData.Ascent even when glyphs
            // are drawn with an application substitute.
            const ascent: number = skiaLayoutAscent(firstToken.family, textPoint(firstToken.sizePt)) * scale;
            const scriptShift: number = metric ? scriptVerticalShift(firstToken, metric) : 0;
            const measuredHeight: number = baseHeight * scale;
            // ports the Net.Core/Skia `Paragraph.GetLineSpace` branch at
            // Paragraph.cs:5146-5173. Reduced percentage spacing uses four
            // fifths; expanded percentage and point spacing use two thirds.
            const leadingScale: number = optionalProperty(paragraph.lineSpacing, 'type') !== 'points' && lineHeight < measuredHeight
                ? 4 / 5 : 2 / 3;
            const lineLeading: number = (lineHeight - measuredHeight) * leadingScale;
            // ports `Shape.CreateColumnInfo`: the current column ends when the
            // next line (including line spacing) no longer fits.
            if (top + lineHeight > innerHeight(frameHeight, body) && column + 1 < columns) {
                column++;
                top = 0;
            }
            // ports `Paragraph.LayoutText`: trailing whitespace advances remain
            // in the line segments but do not participate in center/right alignment.
            const trailingWidth: number = trailingWhitespaceWidth(group, metrics, paragraph.tabs);
            const width: number = (wrapped.widthPt - trailingWidth) * scale;
            const lineStart: number = lineIndex === 0 ? firstLineWidth : continuationWidth;
            const columnLeft: number = column * (columnWidth + body.properties.columnSpacingPt);
            const alignment: string = paragraph.rightToLeft && paragraph.alignment === 'l' ? 'r' : paragraph.alignment;
            const textLeft: number = body.properties.leftInsetPt + frameLeft + columnLeft + lineStart;
            const left: number = alignedLeft(alignment, textLeft, Math.max(0, columnWidth - lineStart), width);
            const al2Segments: TextLayoutSegment[] = layoutSegments(
                group, metrics, left, scale, paragraph.tabs, scriptShift);
            const logicalText: string = group.map((token: Token): string => token.text).join('');
            // AN2: enter the bidi port only for a line with strong RTL text.
            // Every other line retains the exact AL2 array and values.
            const segments: ReadonlyArray<TextLayoutSegment> = containsStrongRightToLeft(logicalText)
                ? applyBidiLayout(al2Segments, logicalText, paragraph.rightToLeft)
                : al2Segments;
            const markerLeft: number = paragraph.rightToLeft
                ? body.properties.leftInsetPt + frameLeft + columnLeft + columnWidth - markerIndent - markerWidth
                : body.properties.leftInsetPt + frameLeft + columnLeft + markerIndent;
            lines.push({
                paragraphIndex,
                startOffset: wrapped.startOffset,
                endOffset: wrapped.endOffset,
                hardBreakAfter: wrapped.hardBreakAfter,
                text: logicalText.replace(/\s+$/u, ''),
                leftPt: left,
                topPt: top + lineLeading + scriptShift,
                baselinePt: top + lineLeading + ascent + scriptShift,
                widthPt: width,
                heightPt: lineHeight,
                fontFamily: optionalProperty(metric, 'family') || firstToken.family,
                fontCandidates: optionalProperty(metric, 'fontCandidates') || firstToken.fontCandidates,
                fontSizePt: firstToken.sizePt * scale,
                bold: firstToken.bold,
                italic: firstToken.italic,
                alignment,
                direction: paragraph.rightToLeft ? 'rtl' : 'ltr',
                marker: lineIndex === 0 && marker ? {
                    kind: marker.kind, text: marker.text, dataUri: marker.dataUri,
                    leftPt: markerLeft, topPt: top + lineLeading + scriptShift,
                    widthPt: markerWidth, heightPt: lineHeight,
                    fontFamily: optionalProperty(markerMetric, 'family') || marker.family,
                    fontCandidates: optionalProperty(markerMetric, 'fontCandidates') || marker.fontCandidates,
                    fontSizePt: marker.sizePt, color: marker.color, colorOpacity: marker.colorOpacity
                } : undefined,
                segments
            });
            top += lineHeight;
        });
        top += after;
    });
    const contentHeight: number = top;
    const availableHeight: number = innerHeight(frameHeight, body);
    // ports `Shape.LayoutXYPosition`: middle and bottom anchoring retain a
    // signed offset when content is taller than the text frame.
    const anchorOffset: number = body.properties.anchor === 'ctr' ? (availableHeight - contentHeight) / 2 :
        body.properties.anchor === 'b' ? availableHeight - contentHeight : 0;
    const result: TextBoxLayout = {
        xPt: emuToPoint(transform.x || 0),
        yPt: emuToPoint(transform.y || 0),
        widthPt: body.properties.wrap === 'none' ? noWrapWidth(widthPt, lines) : widthPt,
        heightPt: body.properties.autoFit.type === 'shape'
            ? Math.max(heightPt, contentHeight + body.properties.topInsetPt + body.properties.bottomInsetPt) : heightPt,
        rotationDegrees: transform.rotationDegrees || 0,
        verticalType: body.properties.verticalType,
        wrap: body.properties.wrap,
        lines: lines.map((line: TextLayoutLine): TextLayoutLine => ({
            ...line,
            topPt: line.topPt + frameTop + body.properties.topInsetPt + anchorOffset,
            baselinePt: line.baselinePt + frameTop + body.properties.topInsetPt + anchorOffset,
            marker: line.marker ? {
                ...line.marker,
                topPt: line.marker.topPt + frameTop + body.properties.topInsetPt + anchorOffset
            } : undefined
        }))
    };
    cacheLayoutInfo(result, createParagraphInfos(result.lines));
    return result;
}

/**
 * PowerPoint permits unwrapped text to grow beyond the authored shape box.
 * @param {number} authoredWidthPt - authoredWidthPt
 * @param {Array.<TextLayoutLine>} lines - lines
 * @returns {number} result
 */
function noWrapWidth(authoredWidthPt: number, lines: ReadonlyArray<TextLayoutLine>): number {
    return lines.reduce((width: number, line: TextLayoutLine): number => {
        const segmentRight: number = line.segments.reduce((right: number, segment: TextLayoutSegment): number =>
            Math.max(right, segment.leftPt + segment.widthPt), line.leftPt + line.widthPt);
        return Math.max(width, segmentRight);
    }, authoredWidthPt);
}

function buildTokens(body: ResolvedTextBody, theme?: SlideFrameThemeSnapshot): Token[] {
    const result: Token[] = [];
    body.paragraphs.forEach((paragraph: ResolvedTextParagraph, paragraphIndex: number): void => {
        const content: ReadonlyArray<LayoutTextContentSnapshot> = nullishValue(paragraph.content, () => paragraph.runs);
        let paragraphOffset: number = 0;
        content.forEach((run: LayoutTextContentSnapshot, runIndex: number): void => {
            const family: string = run.fontFamily || paragraph.defaultFontFamily;
            const authoredSize: number = run.fontSizePt || paragraph.defaultFontSizePt;
            const autoFitSizePt: number = body.properties.autoFit.type === 'normal'
                ? autoFitFontSize(authoredSize, nullishValue(body.properties.autoFit.fontScale, () => 100))
                : authoredSize;
            // ports `Paragraph.UpdateFontSize`: script glyphs use DEF_SCRIPT_FACTOR (1.5).
            const sizePt: number = run.baselinePercent ? autoFitSizePt / 1.5 : autoFitSizePt;
            if (run.kind === 'break') {
                result.push({
                    id: `${paragraphIndex}:${runIndex}:break`, text: '', paragraphIndex, family, sizePt,
                    startOffset: paragraphOffset, endOffset: paragraphOffset,
                    bold: paragraph.defaultBold, italic: paragraph.defaultItalic, tab: false, break: true
                });
                return;
            }
            if (run.symbolFontFamily && /[\uE000-\uF8FF]/u.test(run.text)) {
                let symbolOffset: number = 0;
                symbolRunParts(run.text, run.symbolFontFamily, family).forEach(
                    (part: SymbolRunPart, symbolIndex: number): void => {
                        result.push(createToken(
                            run, part.text,
                            `${paragraphIndex}:${runIndex}:symbol:${symbolIndex}`, paragraphIndex,
                            paragraphOffset + symbolOffset,
                            part.family, sizePt, paragraph, theme, part.authoredText,
                            part.authoredText ? run.symbolFontFamily : undefined,
                            part.fontCandidates, part.mapped, part.mappedText));
                        symbolOffset += (part.authoredText || part.text).length;
                    });
                paragraphOffset += run.text.length;
                return;
            }
            if (containsComplexScript(run.text)) {
                const scriptParts: ReadonlyArray<ComplexScriptTextPart> = splitComplexScriptText(run.text);
                scriptParts.forEach((scriptPart: ComplexScriptTextPart, scriptIndex: number): void => {
                    const scriptFamily: string = scriptPart.script === 'complexScript'
                        ? resolveComplexScriptFont(
                            run, paragraph.defaultFontFamily, theme, paragraph.defaultComplexScriptFontFamily)
                        : family;
                    const scriptPieces: string[] = scriptPart.text.split(/(\t| +)/u)
                        .filter((piece: string): boolean => piece.length > 0);
                    let scriptOffset: number = 0;
                    scriptPieces.forEach((text: string, tokenIndex: number): void => {
                        result.push(createToken(
                            run, text, `${paragraphIndex}:${runIndex}:script:${scriptIndex}:${tokenIndex}`,
                            paragraphIndex, paragraphOffset + scriptPart.startOffset + scriptOffset,
                            scriptFamily, sizePt, paragraph, theme));
                        scriptOffset += text.length;
                    });
                });
                paragraphOffset += run.text.length;
                return;
            }
            const pieces: string[] = run.text.split(/(\t| +)/u).filter((piece: string): boolean => piece.length > 0);
            let runOffset: number = 0;
            pieces.forEach((text: string, tokenIndex: number): void => {
                result.push(createToken(
                    run, text, `${paragraphIndex}:${runIndex}:${tokenIndex}`, paragraphIndex,
                    paragraphOffset + runOffset, family, sizePt, paragraph, theme));
                runOffset += text.length;
            });
            paragraphOffset += run.text.length;
        });
    });
    return result;
}

function symbolRunParts(text: string, symbolFamily: string, normalFamily: string): SymbolRunPart[] {
    const parts: SymbolRunPart[] = [];
    let ordinary: string = '';
    const flushOrdinary: () => void = (): void => {
        if (ordinary) {
            parts.push({ text: ordinary, family: normalFamily });
            ordinary = '';
        }
    };
    Array.from(text).forEach((character: string): void => {
        const code: number | undefined = character.codePointAt(0);
        if (code === undefined || code < 0xe000 || code > 0xf8ff) {
            ordinary += character;
            return;
        }
        flushOrdinary();
        const replacement: SymbolFontBulletReplacement | undefined =
            resolveSymbolFontBullet(symbolFamily, character);
        parts.push({
            text: replacement ? replacement.displayCharacter || replacement.character : '\ufffd',
            authoredText: character,
            mappedText: replacement ? replacement.character : undefined,
            family: replacement ? replacement.fontCandidates[0] : symbolFamily,
            fontCandidates: replacement ? replacement.fontCandidates : undefined,
            mapped: replacement !== undefined
        });
    });
    flushOrdinary();
    return parts;
}

function createToken(
    run: LayoutTextContentSnapshot,
    text: string,
    id: string,
    paragraphIndex: number,
    startOffset: number,
    family: string,
    sizePt: number,
    paragraph: ResolvedTextParagraph,
    theme?: SlideFrameThemeSnapshot,
    authoredText?: string,
    authoredSymbolFontFamily?: string,
    fontCandidates?: ReadonlyArray<string>,
    symbolMapped?: boolean,
    mappedText?: string
): Token {
    const color: LayoutRenderColor = run.color ? resolveLayoutColor(run.color.value, run.color.transforms, theme) : undefined;
    const highlight: LayoutRenderColor = run.highlight
        ? resolveLayoutColor(run.highlight.value, run.highlight.transforms, theme) : undefined;
    return {
        id, text, authoredText, mappedText, authoredSymbolFontFamily, symbolMapped,
        paragraphIndex, startOffset, endOffset: startOffset + (authoredText || text).length,
        family, fontCandidates, sizePt,
        bold: nullishValue(run.bold, () => paragraph.defaultBold),
        italic: nullishValue(run.italic, () => paragraph.defaultItalic),
        tab: /^\t+$/u.test(text), break: false,
        underline: run.underline, strike: run.strike,
        baselinePercent: run.baselinePercent, characterSpacingPt: run.characterSpacingPt,
        effectiveCharacterFills: run.effectiveCharacterFills,
        color: optionalProperty(color, 'color'), colorOpacity: optionalProperty(color, 'opacity'),
        highlight: optionalProperty(highlight, 'color'), hyperlink: run.hyperlink,
        fieldType: run.kind === 'field' ? run.fieldType : undefined,
        caps: nullishValue(run.caps, () => paragraph.defaultCaps)
    };
}

/**
 * ports `Paragraph.LayoutBullet` and numbered-list sequencing in the Skia path.
 * @param {ResolvedTextBody} body - body
 * @param {SlideFrameThemeSnapshot} theme - theme
 * @returns {Array.<ParagraphMarker|undefined>} result
 */
function buildMarkers(
    body: ResolvedTextBody,
    theme?: SlideFrameThemeSnapshot
): ReadonlyArray<ParagraphMarker | undefined> {
    const counters: Map<string, number> = new Map();
    return body.paragraphs.map((paragraph: ResolvedTextParagraph, index: number): ParagraphMarker | undefined => {
        const bullet: TextBulletSnapshot = paragraph.bullet;
        if (!bullet || bullet.kind === 'none') {
            return undefined;
        }
        const first: LayoutTextContentSnapshot = (nullishValue(paragraph.content, () => paragraph.runs)).find((run: LayoutTextContentSnapshot): boolean => run.kind !== 'break');
        // ports `Paragraph.CalculateBulletSize`: an empty paragraph never paints a marker.
        if (!first || !first.text) {
            return undefined;
        }
        const baseSize: number = optionalProperty(first, 'fontSizePt') || paragraph.defaultFontSizePt;
        const bulletSize: TextBulletSizeSnapshot | undefined = bullet.size;
        const sizePt: number = bulletSize !== undefined && bulletSize.kind === 'points' ? bulletSize.value :
            bulletSize !== undefined && bulletSize.kind === 'percent' ? baseSize * bulletSize.value / 100 : baseSize;
        const bulletFont: TextBulletFontSnapshot | undefined = bullet.font;
        let family: string = bulletFont !== undefined && bulletFont.kind === 'explicit' ? bulletFont.family :
            (optionalProperty(first, 'fontFamily') || paragraph.defaultFontFamily);
        const bulletColor: TextBulletColorSnapshot | undefined = bullet.color;
        const authoredColor: LayoutTextColorSnapshot = bulletColor !== undefined && bulletColor.kind === 'explicit' ?
            bulletColor.color : optionalProperty(first, 'color');
        const color: LayoutRenderColor = authoredColor
            ? resolveLayoutColor(authoredColor.value, authoredColor.transforms, theme) : undefined;
        if (bullet.kind === 'picture') {
            return { kind: 'picture', id: `marker:${index}`, text: '', dataUri: bullet.dataUri,
                family, sizePt, color: optionalProperty(color, 'color'), colorOpacity: optionalProperty(color, 'opacity') };
        }
        let text: string = bullet.kind === 'character' ? bullet.character : '';
        const replacement: SymbolFontBulletReplacement | undefined = bullet.kind === 'character'
            ? resolveSymbolFontBullet(family, text) : undefined;
        if (replacement) {
            text = replacement.character;
            family = replacement.fontFamily;
        }
        if (bullet.kind === 'numbered') {
            const key: string = `${paragraph.level || 0}:${bullet.scheme}`;
            const value: number = counters.has(key) ? (counters.get(key) as number) + 1 : (bullet.startAt || 1);
            counters.set(key, value);
            text = numberMarker(value, bullet.scheme);
        }
        return { kind: 'text', id: `marker:${index}`, text, family,
            fontCandidates: replacement ? replacement.fontCandidates : undefined, sizePt,
            color: optionalProperty(color, 'color'), colorOpacity: optionalProperty(color, 'opacity') };
    });
}

function numberMarker(value: number, scheme: string): string {
    const lowerAlpha: string = alphaNumber(value).toLowerCase();
    const upperAlpha: string = alphaNumber(value);
    const lowerRoman: string = romanNumber(value).toLowerCase();
    const upperRoman: string = romanNumber(value);
    const values: Readonly<Record<string, string>> = {
        alphaLcParenBoth: `(${lowerAlpha})`, alphaLcParenR: `${lowerAlpha})`, alphaLcPeriod: `${lowerAlpha}.`,
        alphaUcParenBoth: `(${upperAlpha})`, alphaUcParenR: `${upperAlpha})`, alphaUcPeriod: `${upperAlpha}.`,
        arabicParenBoth: `(${value})`, arabicParenR: `${value})`, arabicPeriod: `${value}.`, arabicPlain: String(value),
        romanLcParenBoth: `(${lowerRoman})`, romanLcParenR: `${lowerRoman})`, romanLcPeriod: `${lowerRoman}.`,
        romanUcParenBoth: `(${upperRoman})`, romanUcParenR: `${upperRoman})`, romanUcPeriod: `${upperRoman}.`,
        // The source maps this token to UpRoman + period; preserve that Skia quirk.
        thaiNumParenBoth: `${upperRoman}.`
    };
    // ports `BulletFormat.NumberStyle`/`GetNumBulletCharacter`: unsupported
    // source tokens retain the numeric default rather than inventing locale rules.
    return Reflect.get(values, scheme) as string | undefined || String(value);
}

function alphaNumber(value: number): string {
    let remaining: number = Math.max(1, value);
    let result: string = '';
    while (remaining > 0) {
        remaining--;
        result = String.fromCharCode(65 + remaining % 26) + result;
        remaining = Math.floor(remaining / 26);
    }
    return result;
}

function romanNumber(value: number): string {
    let remaining: number = Math.max(1, Math.min(3999, value));
    let result: string = '';
    const values: ReadonlyArray<[number, string]> = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
        [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    for (const entry of values) {
        while (remaining >= entry[0]) {
            result += entry[1]; remaining -= entry[0];
        }
    }
    return result;
}

function wrapTokens(
    tokens: ReadonlyArray<Token>,
    metrics: ReadonlyMap<string, TextMeasureResult>,
    available: number,
    firstIndent: number,
    tabs: ResolvedTextParagraph['tabs']
): WrappedLine[] {
    if (tokens.length === 0) {
        return [{ tokens: [], widthPt: 0, startOffset: 0, endOffset: 0, hardBreakAfter: true }];
    }
    const lines: WrappedLine[] = [];
    let line: Token[] = [];
    let width: number = 0;
    let endedWithBreak: boolean = false;
    let emptyOffset: number = tokens[0].startOffset;
    for (const token of tokens) {
        if (token.break) {
            lines.push(wrappedLine(line, width, true, token.startOffset));
            line = [];
            width = 0;
            emptyOffset = token.endOffset;
            endedWithBreak = true;
            continue;
        }
        endedWithBreak = false;
        let tokenWidth: number = tokenAdvance(token, metrics, width, tabs);
        const limit: number = Math.max(0, available - (lines.length === 0 ? firstIndent : 0));
        if (!token.tab && !/^\s+$/u.test(token.text) && tokenWidth > limit && token.text.length > 1) {
            let characterOffset: number = token.startOffset;
            const characters: Token[] = Array.from(token.text).map((text: string, index: number): Token => {
                const character: Token = { ...token, id: characterId(token, index), text,
                    startOffset: characterOffset, endOffset: characterOffset + text.length };
                characterOffset += text.length;
                return character;
            });
            const split: WrappedLine[] = wrapTokens(characters, metrics, available, lines.length === 0 ? firstIndent : 0, tabs);
            if (line.length > 0) {
                lines.push(wrappedLine(line, width, false, emptyOffset));
            }
            split.forEach((value: WrappedLine, index: number): void => {
                if (index < split.length - 1) {
                    lines.push({ ...value, hardBreakAfter: false });
                } else {
                    line = [...value.tokens];
                    width = value.widthPt;
                    emptyOffset = value.endOffset;
                }
            });
            continue;
        }
        if (line.length > 0 && !/^\s+$/u.test(token.text) && width + tokenWidth > limit) {
            lines.push(wrappedLine(line, width, false, emptyOffset));
            line = [];
            width = 0;
            emptyOffset = token.startOffset;
            tokenWidth = tokenAdvance(token, metrics, width, tabs);
        }
        line.push(token);
        width += tokenWidth;
        emptyOffset = token.endOffset;
    }
    if (line.length > 0 || endedWithBreak) {
        lines.push(wrappedLine(line, width, true, emptyOffset));
    }
    return lines.length > 0 ? lines : [wrappedLine([], 0, true, emptyOffset)];
}

function wrappedLine(
    tokens: ReadonlyArray<Token>, widthPt: number, hardBreakAfter: boolean, emptyOffset: number
): WrappedLine {
    const first: Token | undefined = tokens[0];
    const last: Token | undefined = tokens[tokens.length - 1];
    return {
        tokens,
        widthPt,
        startOffset: nullishValue(optionalProperty(first, 'startOffset'), () => emptyOffset),
        endOffset: nullishValue(optionalProperty(last, 'endOffset'), () => emptyOffset),
        hardBreakAfter
    };
}

function tokenAdvance(
    token: Token,
    metrics: ReadonlyMap<string, TextMeasureResult>,
    current: number,
    tabs: ResolvedTextParagraph['tabs']
): number {
    if (!token.tab) {
        const measured: number = optionalProperty(metrics.get(token.id), 'widthPt') || 0;
        // ports `Paragraph` Skia path: default character spacing is added once per character.
        return measured + (token.characterSpacingPt || 0) * Array.from(token.text).length;
    }
    const stop: number | undefined = optionalProperty(tabs.find(
        (value: { readonly positionPt: number; readonly alignment?: string; }): boolean =>
            value.positionPt > current + 0.01), 'positionPt');
    // ports `Paragraph.Layout`: PowerPoint's default tab size is 72 points.
    const next: number = nullishValue(stop, () => (Math.floor(current / 72) + 1) * 72);
    return Math.max(0, next - current);
}

function trailingWhitespaceWidth(
    tokens: ReadonlyArray<Token>,
    metrics: ReadonlyMap<string, TextMeasureResult>,
    tabs: ResolvedTextParagraph['tabs']
): number {
    let width: number = 0;
    for (let index: number = tokens.length - 1; index >= 0; index--) {
        const token: Token = arrayAt(tokens, index) as Token;
        if (token.tab || !/^ +$/u.test(token.text)) {
            break;
        }
        width += tokenAdvance(token, metrics, 0, tabs);
    }
    return width;
}

function layoutSegments(
    tokens: ReadonlyArray<Token>,
    metrics: ReadonlyMap<string, TextMeasureResult>,
    left: number,
    scale: number,
    tabs: ResolvedTextParagraph['tabs'],
    lineScriptShift: number
): TextLayoutSegment[] {
    let advance: number = 0;
    const segments: TextLayoutSegment[] = [];
    for (const token of tokens) {
        const width: number = tokenAdvance(token, metrics, advance, tabs) * scale;
        if (!token.tab) {
            const metric: TextMeasureResult | undefined = metrics.get(token.id);
            segments.push({
                text: token.text,
                authoredText: token.authoredText,
                mappedText: token.mappedText,
                authoredSymbolFontFamily: token.authoredSymbolFontFamily,
                symbolMapped: token.symbolMapped,
                startOffset: token.startOffset,
                endOffset: token.endOffset,
                leftPt: left + advance,
                widthPt: width,
                fontFamily: optionalProperty(metric, 'family') || token.family,
                fontCandidates: optionalProperty(metric, 'fontCandidates') || token.fontCandidates,
                fontSizePt: token.sizePt * scale,
                topOffsetPt: metric ? (scriptVerticalShift(token, metric) - lineScriptShift) * scale : 0,
                baselineAdjustmentPt: metric
                    ? (metric.ascentPt - skiaLayoutAscent(token.family, textPoint(token.sizePt))) * scale : 0,
                bold: token.bold,
                italic: token.italic,
                underline: token.underline,
                strike: token.strike,
                baselinePercent: token.baselinePercent,
                characterSpacingPt: token.characterSpacingPt,
                effectiveCharacterFills: token.effectiveCharacterFills,
                color: token.color,
                colorOpacity: token.colorOpacity,
                highlight: token.highlight,
                hyperlink: token.hyperlink,
                fieldType: token.fieldType,
                caps: token.caps
            });
        }
        advance += width;
    }
    return segments;
}

function spacingPoints(
    spacing: ResolvedTextParagraph['lineSpacing'] | undefined,
    base: number,
    reductionPercent: number,
    direct: boolean
): number {
    const reduction: number = 1 - reductionPercent / 100;
    if (!spacing) {
        return base * reduction;
    }
    if (!direct) {
        return (spacing.type === 'points' ? spacing.value : base * spacing.value / 100) * reduction;
    }
    // ports `Paragraph.LineSpacing`/`SetLineSpaceReduction`: direct point
    // spacing is rounded to whole points, while direct percentage spacing is
    // rounded to one decimal after normAutofit reduction.
    if (spacing.type === 'points') {
        return dotNetRound(spacing.value * reduction);
    }
    return base * dotNetRound(spacing.value / 100 * reduction, 1);
}

/**
 * ports `Font.ApplyFontScale` (`Math.Round`, midpoint-to-even, then ceiling).
 * @param {number} authoredSize - authoredSize
 * @param {number} fontScalePercent - fontScalePercent
 * @returns {number} result
 */
function autoFitFontSize(authoredSize: number, fontScalePercent: number): number {
    return Math.max(1, Math.ceil(dotNetRound(authoredSize * fontScalePercent / 100)));
}

/**
 * Implements the default midpoint-to-even behavior of .NET `Math.Round`.
 * @param {number} value - value
 * @param {number} digits - digits
 * @returns {number} result
 */
function dotNetRound(value: number, digits: number = 0): number {
    const factor: number = 10 ** digits;
    const scaled: number = value * factor;
    const lower: number = Math.floor(scaled);
    const fraction: number = scaled - lower;
    const rounded: number = Math.abs(fraction - 0.5) <= Number.EPSILON * Math.max(1, Math.abs(scaled)) * 4
        ? (lower % 2 === 0 ? lower : lower + 1)
        : Math.round(scaled);
    return rounded / factor;
}

function paragraphSpacingPoints(
    spacing: ResolvedTextParagraph['spaceBefore'] | undefined,
    base: number
): number {
    if (!spacing) {
        return 0;
    }
    return spacing.type === 'points' ? spacing.value : base * 1.2 * spacing.value / 100;
}

function alignedLeft(alignment: string, left: number, width: number, lineWidth: number): number {
    if (alignment === 'ctr') {
        return left + Math.max(0, (width - lineWidth) / 2);
    }
    if (alignment === 'r') {
        return left + Math.max(0, width - lineWidth);
    }
    return left;
}

function innerHeight(heightPt: number, body: ResolvedTextBody): number {
    return Math.max(0, heightPt - body.properties.topInsetPt - body.properties.bottomInsetPt);
}

/**
 * ports `Paragraph.GetDefaultParagraphFont` for an empty paragraph.
 *
 * @param {ResolvedTextParagraph} paragraph - Resolved paragraph values.
 * @param {number} paragraphIndex - Authored paragraph index.
 * @param {ResolvedTextBody} body - Resolved body properties, including autofit.
 * @returns {Token} Synthetic empty-line measurement token.
 */
function defaultToken(paragraph: ResolvedTextParagraph, paragraphIndex: number, body: ResolvedTextBody): Token {
    const direct: TextCharacterSnapshot | undefined = paragraph.endParagraphProperties;
    const authoredSize: number = nullishValue(optionalProperty(direct, 'fontSizePt'), () => paragraph.defaultFontSizePt);
    const sizePt: number = body.properties.autoFit.type === 'normal'
        ? autoFitFontSize(authoredSize, nullishValue(body.properties.autoFit.fontScale, () => 100))
        : authoredSize;
    return {
        id: `${paragraphIndex}:empty`, text: '', paragraphIndex,
        startOffset: 0, endOffset: 0,
        family: optionalProperty(direct, 'fontFamily') || paragraph.defaultFontFamily, sizePt,
        bold: nullishValue(optionalProperty(direct, 'bold'), () => paragraph.defaultBold), italic: nullishValue(optionalProperty(direct, 'italic'), () => paragraph.defaultItalic),
        tab: false, break: false, caps: nullishValue(optionalProperty(direct, 'caps'), () => paragraph.defaultCaps)
    };
}

function characterId(token: Token, index: number): string {
    return `${token.id}:character:${index}`;
}

function measureRequest(token: Token): TextMeasureRequest {
    return {
        id: token.id,
        text: token.caps === 'all' || token.caps === 'small' ? token.text.toUpperCase() : token.text,
        family: token.family,
        fontCandidates: token.fontCandidates,
        sizePt: textPoint(token.sizePt),
        bold: token.bold,
        italic: token.italic
    };
}

/**
 * ports `Paragraph.AlignSuperOrSubScript` in the Net.Core Skia path.
 * @param {Token} token - token
 * @param {TextMeasureResult} metric - metric
 * @returns {number} result
 */
function scriptVerticalShift(token: Token, metric: TextMeasureResult): number {
    const baseline: number = token.baselinePercent || 0;
    if (baseline === 0) {
        return 0;
    }
    const originalAscent: number = metric.ascentPt * 1.5;
    const fontHeight: number = Math.floor(metric.lineSpacingPt * 1.5);
    const baseShift: number = originalAscent + fontHeight / 1.7 - fontHeight;
    return baseline > 0 ? baseShift * (baseline / -30) : baseShift * (baseline / -25);
}

/** Reads a property only when its owner is present. Keys are static `keyof` members.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    // eslint-disable-next-line security/detect-object-injection -- key is a statically inferred keyof T member
    return value !== undefined && value !== null ? value[key] : undefined;
}

/** Returns a value unless it is nullish.
 * @param {*} value - Preferred value.
 * @param {Function} fallback - Lazy fallback.
 * @returns {*} Preferred value or fallback.
 */
function nullishValue<T, U>(value: T | null | undefined, fallback: () => U): T | U {
    return value !== undefined && value !== null ? value : fallback();
}

/** ports `Helper.EmuToPoint`.
 * @param {number} emu - Length in English Metric Units.
 * @returns {number} Length in typographic points.
 */
function emuToPoint(emu: number): number {
    return emu / 12700;
}
