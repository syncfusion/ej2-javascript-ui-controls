import { isNullOrUndefined } from '@syncfusion/ej2-base';
import {
    PdfBrush,
    PdfFont,
    PdfGraphics,
    PdfGraphicsState,
    PdfStringFormat,
    PdfTextAlignment,
    PdfVerticalAlignment,
    Rectangle,
    Size
} from '@syncfusion/ej2-pdf';
import { ICellStyle, IRichTextRun, Rgba } from '../common/index';
import { measurePdfText, sanitizeTextForFont } from '../common/index';

interface MeasuredSegment {
    text: string;
    font: PdfFont;
    brush: PdfBrush;
    width: number;
    height: number;
    yOffsetRatio: number;
}

interface LayoutLine {
    segments: MeasuredSegment[];
    width: number;
    height: number;
}

const BLACK: Rgba = { r: 0, g: 0, b: 0, a: 255 };

/**
 * Handles layout calculation, word wrapping, alignment, and rendering for cells containing multi-style rich text runs.
 */
export class RichTextRenderer {
    /**
     * Renders an array of rich text formatting runs within a cell bounding box.
     *
     * @param {IRichTextRun[]} runs The collection of formatted text runs.
     * @param {Rectangle} rect The bounding rectangle of the cell in points.
     * @param {PdfGraphics} graphics The target PDF page graphics context.
     * @param {ICellStyle} baseStyle Default base cell styling.
     * @param {Function} getFont Callback resolving an evaluated PdfFont from cell style parameters.
     * @param {boolean} blackAndWhite Whether monochrome printing is enabled.
     * @param {PdfTextAlignment} horizontalAlign Horizontal text alignment.
     * @param {PdfVerticalAlignment} verticalAlign Vertical text alignment.
     * @param {boolean} wrapText Whether line wrapping is enabled on the cell.
     * @returns {void}
     */
    public static drawRichText(
        runs: IRichTextRun[],
        rect: Rectangle,
        graphics: PdfGraphics,
        baseStyle: ICellStyle,
        getFont: (style: ICellStyle) => PdfFont,
        blackAndWhite: boolean,
        horizontalAlign: PdfTextAlignment,
        verticalAlign: PdfVerticalAlignment,
        wrapText: boolean
    ): void {
        if (runs.length === 0 || rect.width <= 0 || rect.height <= 0) {
            return;
        }
        const lines: LayoutLine[] = RichTextRenderer.buildLines(runs, rect.width, baseStyle, getFont, blackAndWhite, wrapText);
        if (lines.length === 0) {
            return;
        }
        let totalHeight: number = 0;
        for (let lineIndex: number = 0; lineIndex < lines.length; lineIndex++) {
            const currentLayoutLine: LayoutLine = lines[lineIndex as number];
            totalHeight += currentLayoutLine.height;
        }
        let currentY: number = rect.y;
        if (verticalAlign === PdfVerticalAlignment.middle) {
            currentY = rect.y + Math.max(0, (rect.height - totalHeight) / 2);
        } else if (verticalAlign === PdfVerticalAlignment.bottom) {
            currentY = rect.y + Math.max(0, rect.height - totalHeight);
        }
        const stringFormat: PdfStringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.left;
        stringFormat.lineAlignment = PdfVerticalAlignment.bottom;
        const graphicsState: PdfGraphicsState = graphics.save();
        graphics.setClip(rect);
        for (let lineIndex: number = 0; lineIndex < lines.length; lineIndex++) {
            const line: LayoutLine = lines[lineIndex as number];
            let currentX: number = rect.x;
            if (horizontalAlign === PdfTextAlignment.center) {
                currentX = rect.x + (rect.width - line.width) / 2;
            } else if (horizontalAlign === PdfTextAlignment.right) {
                currentX = rect.x + (rect.width - line.width);
            }
            for (let segmentIndex: number = 0; segmentIndex < line.segments.length; segmentIndex++) {
                const segment: MeasuredSegment = line.segments[segmentIndex as number];
                const segmentY: number = currentY + segment.yOffsetRatio * line.height;
                graphics.drawString(
                    segment.text, segment.font, { x: currentX, y: segmentY, width: segment.width + 2, height: line.height },
                    segment.brush, stringFormat
                );
                currentX += segment.width;
            }
            currentY += line.height;
        }
        graphics.restore(graphicsState);
    }

    private static buildLines(
        runs: IRichTextRun[],
        maxWidth: number,
        baseStyle: ICellStyle,
        getFont: (style: ICellStyle) => PdfFont,
        blackAndWhite: boolean,
        wrapText: boolean
    ): LayoutLine[] {
        const lines: LayoutLine[] = [];
        let currentLine: LayoutLine = { segments: [], width: 0, height: baseStyle.fontSize * 1.2 };
        const pushLine: () => void = (): void => {
            lines.push(currentLine);
            currentLine = { segments: [], width: 0, height: baseStyle.fontSize * 1.2 };
        };
        for (let runIndex: number = 0; runIndex < runs.length; runIndex++) {
            const run: IRichTextRun = runs[runIndex as number];
            const isSubOrSup: boolean = run.subscript === true || run.superscript === true;
            const runFontSize: number = (!isNullOrUndefined(run.fontSize) ? run.fontSize : baseStyle.fontSize) * (isSubOrSup ? 0.65 : 1);
            const runStyle: ICellStyle = Object.assign({}, baseStyle, {
                fontName: !isNullOrUndefined(run.fontName) ? run.fontName : baseStyle.fontName,
                fontSize: runFontSize,
                bold: !isNullOrUndefined(run.bold) ? run.bold : baseStyle.bold,
                italic: !isNullOrUndefined(run.italic) ? run.italic : baseStyle.italic,
                underline: !isNullOrUndefined(run.underline) ? run.underline : baseStyle.underline,
                strikeout: !isNullOrUndefined(run.strikeout) ? run.strikeout : baseStyle.strikeout
            });
            const font: PdfFont = getFont(runStyle);
            const rawColor: Rgba = blackAndWhite
                ? BLACK
                : (!isNullOrUndefined(run.fontColor) ? run.fontColor : baseStyle.fontColor);
            const resolvedColor: Rgba = !isNullOrUndefined(rawColor) ? rawColor : BLACK;
            const effectiveColor: Rgba = resolvedColor.a === 0
                ? { r: resolvedColor.r, g: resolvedColor.g, b: resolvedColor.b, a: 255 }
                : resolvedColor;
            const brush: PdfBrush = new PdfBrush({ r: effectiveColor.r, g: effectiveColor.g, b: effectiveColor.b });
            const yOffsetRatio: number = run.superscript ? -0.25 : (run.subscript ? 0.2 : 0);
            const cleanText: string = sanitizeTextForFont(run.text, font).split('\r').join('');
            const rawLines: string[] = wrapText ? cleanText.split('\n') : [cleanText.split('\n').join('')];
            for (let lineIndex: number = 0; lineIndex < rawLines.length; lineIndex++) {
                if (lineIndex > 0) {
                    pushLine();
                }
                const lineText: string = rawLines[lineIndex as number];
                if (!wrapText) {
                    const size: Size = measurePdfText(lineText, font);
                    currentLine.segments.push({
                        text: lineText, font: font, brush: brush, width: size.width, height: size.height, yOffsetRatio: yOffsetRatio
                    });
                    currentLine.width += size.width;
                    currentLine.height = Math.max(currentLine.height, size.height);
                } else {
                    const rawTokens: string[] = lineText.match(/\S+\s*|\s+/g) || [];
                    const tokens: string[] = [];
                    for (let tIdx: number = 0; tIdx < rawTokens.length; tIdx++) {
                        const tk: string = rawTokens[tIdx as number];
                        const tkSize: Size = measurePdfText(tk, font);
                        if (tkSize.width > maxWidth && tk.length > 1) {
                            let currChunk: string = '';
                            for (let cIdx: number = 0; cIdx < tk.length; cIdx++) {
                                const ch: string = tk.charAt(cIdx);
                                if (currChunk && measurePdfText(currChunk + ch, font).width > maxWidth) {
                                    tokens.push(currChunk);
                                    currChunk = ch;
                                } else {
                                    currChunk += ch;
                                }
                            }
                            if (currChunk) { tokens.push(currChunk); }
                        } else {
                            tokens.push(tk);
                        }
                    }
                    for (let tokenIndex: number = 0; tokenIndex < tokens.length; tokenIndex++) {
                        const token: string = tokens[tokenIndex as number];
                        const size: Size = measurePdfText(token, font);
                        if (currentLine.segments.length > 0 && currentLine.width + size.width > maxWidth) {
                            pushLine();
                        }
                        currentLine.segments.push({
                            text: token, font: font, brush: brush, width: size.width, height: size.height, yOffsetRatio: yOffsetRatio
                        });
                        currentLine.width += size.width;
                        currentLine.height = Math.max(currentLine.height, size.height);
                    }
                }
            }
        }
        if (currentLine.segments.length > 0 || lines.length === 0) {
            lines.push(currentLine);
        }
        return lines;
    }
}
