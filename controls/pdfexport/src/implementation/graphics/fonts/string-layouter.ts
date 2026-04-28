/**
 * PdfStringLayouter.ts class for EJ2-PDF
 */
import { PdfFont } from './pdf-font';
import { PdfStringFormat } from './pdf-string-format';
import { SizeF, RectangleF, PointF } from './../../drawing/pdf-drawing';
import { PdfWordWrapType } from './enum';
import { StringTokenizer } from './string-tokenizer';
/**
 * Class `lay outing the text`.
 */
export class PdfStringLayouter {
    // Fields
    /**
     * `Text` data.
     * @private
     */
    private text : string;
    /**
     * Pdf `font`.
     * @private
     */
    private font : PdfFont;
    /**
     * String `format`.
     * @private
     */
    private format : PdfStringFormat;
    /**
     * `Size` of the text.
     * @private
     */
    private size : SizeF;
    /**
     * `Bounds` of the text.
     * @private
     */
    private rectangle : RectangleF;
    /**
     * Pdf page `height`.
     * @private
     */
    private pageHeight : number;
    /**
     * String `tokenizer`.
     * @private
     */
    private reader : StringTokenizer;
    /**
     * Specifies if [`isTabReplaced`].
     * @private
     */
    private isTabReplaced : boolean;
    /**
     * Count of tab `occurance`.
     * @private
     */
    private tabOccuranceCount : number;
    /**
     * Checks whether the x co-ordinate is need to set as client size or not.
     * @hidden
     * @private
     */
    private isOverloadWithPosition : boolean = false;
    /**
     * Stores client size of the page if the layout method invoked with `PointF` overload.
     * @hidden
     * @private
     */
    private clientSize : SizeF;
    // Constructors
    /**
     * Initializes a new instance of the `StringLayouter` class.
     * @private
     */
    public constructor() {
        //
    }

    //Public methods
    /**
     * `Layouts` the text.
     * @private
     */
    public layout(text : string, font : PdfFont, format : PdfStringFormat, rectangle : RectangleF,
                  pageHeight : number, recalculateBounds : boolean, clientSize : SizeF) : PdfStringLayoutResult
    public layout(text : string, font : PdfFont, format : PdfStringFormat, size : SizeF,
                  recalculateBounds : boolean, clientSize : SizeF) : PdfStringLayoutResult
    public layout(arg1 : string, arg2 : PdfFont, arg3 : PdfStringFormat, arg4 : SizeF|RectangleF,
                  arg5 : number | boolean, arg6 : boolean | SizeF, arg7 ?: SizeF) : PdfStringLayoutResult {
        if (arg4 instanceof RectangleF) {
            this.initialize(arg1, arg2, arg3, <RectangleF>arg4, arg5 as number);
            this.isOverloadWithPosition = arg6 as boolean;
            this.clientSize = arg7 as SizeF;
            let result : PdfStringLayoutResult = this.doLayout();
            this.clear();
            return result;
        } else {
            this.initialize(arg1, arg2, arg3, arg4 as SizeF);
            this.isOverloadWithPosition = arg5 as boolean;
            this.clientSize = arg6 as SizeF;
            let result : PdfStringLayoutResult = this.doLayout();
            this.clear();
            return result;
        }
    }
    // recalculateBounds : boolean, clientSize : SizeF
    //Implementation
    /**
     * `Initializes` internal data.
     * @private
     */
    private initialize(text : string, font : PdfFont, format : PdfStringFormat, rectangle : RectangleF, pageHeight : number) : void
    private initialize(text : string, font : PdfFont, format : PdfStringFormat, size : SizeF) : void
    private initialize(text : string, font : PdfFont, format : PdfStringFormat, rectSize : SizeF|RectangleF,
                       pageHeight ?: number) : void {
        if (typeof pageHeight === 'number') {
            if (text == null) {
                throw new Error('ArgumentNullException:text');
            }
            if (font == null) {
                throw new Error('ArgumentNullException:font');
            }
            this.text = text;
            this.font = font;
            this.format = format;
            this.size = new SizeF(rectSize.width, rectSize.height);
            this.rectangle = <RectangleF>rectSize;
            this.pageHeight = pageHeight;
            this.reader = new StringTokenizer(text);
        } else {
            this.initialize(text, font, format, new RectangleF(new PointF(0, 0), <SizeF>rectSize), 0);
        }
    }
    /**
     * `Clear` all resources.
     * @private
     */
    private clear() : void {
        this.font = null;
        this.format = null;
        this.reader.close();
        this.reader = null;
        this.text = null;
    }
    /**
     * `Layouts` the text.
     * @private
     */
    private doLayout() : PdfStringLayoutResult {
        let result : PdfStringLayoutResult = new PdfStringLayoutResult();
        let lineResult : PdfStringLayoutResult = new PdfStringLayoutResult();
        let lines : LineInfo[] = [];
        let line : string = this.reader.peekLine();
        let lineIndent : number = this.getLineIndent(true);
        while (line != null) {
            lineResult = this.layoutLine(line, lineIndent);
            if (lineResult !== null || typeof lineResult !== 'undefined') {
                let numSymbolsInserted : number = 0;
                /* tslint:disable */
                let returnedValue : { success : boolean, numInserted : number } = this.copyToResult(result, lineResult, lines, /*out*/ numSymbolsInserted);
                /* tslint:enable */
                let success : boolean = returnedValue.success;
                numSymbolsInserted = returnedValue.numInserted;
                if (!success) {
                    this.reader.read(numSymbolsInserted);
                    break;
                }
            }
            // if (lineResult.textRemainder != null && lineResult.textRemainder.length > 0 ) {
            //     break;
            // }
            this.reader.readLine();
            line = this.reader.peekLine();
            lineIndent = this.getLineIndent(false);
        }
        this.finalizeResult(result, lines);
        return result;
    }
    /**
     * Returns `line indent` for the line.
     * @private
     */
    private getLineIndent(firstLine : boolean) : number {
        let lineIndent : number = 0;
        if (this.format != null) {
            lineIndent = (firstLine) ? this.format.firstLineIndent : this.format.paragraphIndent;
            lineIndent = (this.size.width > 0) ? Math.min(this.size.width, lineIndent) : lineIndent;
        }
        return lineIndent;
    }
    /**
     * Calculates `height` of the line.
     * @private
     */
    private getLineHeight() : number {
        let height : number = this.font.height;
        if (this.format != null && this.format.lineSpacing !== 0) {
            height = this.format.lineSpacing + this.font.height;
        }
        return height;
    }
    /**
     * Calculates `width` of the line.
     * @private
     */
    private getLineWidth(line : string) : number {
        let width : number = this.font.getLineWidth(line, this.format);
        return width;
    }
    // tslint:disable
    /**
     * `Layouts` line.
     * @private
     */
    private layoutLine(line : string, lineIndent : number) : PdfStringLayoutResult {
        let lineResult : PdfStringLayoutResult = new PdfStringLayoutResult();
        lineResult.layoutLineHeight = this.getLineHeight();
        let lines : LineInfo[] = [];
        let maxWidth : number = this.size.width;
        let lineWidth : number = this.getLineWidth(line) + lineIndent;
        let lineType : LineType = LineType.FirstParagraphLine;
        let readWord : boolean = true;
        // line is in bounds.
        if (maxWidth <= 0 || Math.round(lineWidth) <= Math.round(maxWidth)) {
            this.addToLineResult(lineResult, lines, line, lineWidth, LineType.NewLineBreak | lineType);
        } else {
            let builder : string = '';
            let curLine : string = '';
            lineWidth = lineIndent;
            let curIndent : number = lineIndent;
            let reader : StringTokenizer = new StringTokenizer(line);
            let word : string = reader.peekWord();
            let isSingleWord : boolean = false;
            if (word.length !== reader.length) {
                if (word === ' ') {
                    curLine = curLine + word;
                    builder = builder + word;
                    reader.position += 1;
                    word = reader.peekWord();
                }
            }
            while (word != null) {
                curLine = curLine + word;
                let curLineWidth : number = /*Utils.Round(*/ this.getLineWidth(curLine.toString()) + curIndent /*)*/;
                if (curLine.toString() === ' ') {
                    curLine = '';
                    curLineWidth = 0;
                }
                if (curLineWidth > maxWidth) {
                    if (this.getWrapType() === PdfWordWrapType.None) {
                        break;
                    }
                    if (curLine.length === word.length) {
                        //  Character wrap is disabled or one symbol is greater than bounds.
                        if (this.getWrapType() === PdfWordWrapType.WordOnly) {
                            lineResult.textRemainder = line.substring(reader.position);
                            break;
                        } else if (curLine.length === 1) {
                            builder = builder + word;
                            break;
                        } else {
                            readWord = false;
                            curLine = '';
                            word = reader.peek().toString();
                            continue;
                        }
                    } else {
                        if (this.getLineWidth(word.toString()) > maxWidth) {
                            this.format.wordWrap = PdfWordWrapType.Character;
                        } else {
                            if (typeof this.format !== 'undefined' && this.format !== null ) {
                                this.format.wordWrap = PdfWordWrapType.Word;
                            }
                        }
                        if (this.getWrapType() !== PdfWordWrapType.Character || !readWord) {
                            let ln : string = builder.toString();
                        // if (ln.indexOf(' ') === -1) {
                        //     isSingleWord = true;
                        //     this.addToLineResult(lineResult, lines, curLine, lineWidth, LineType.LayoutBreak | lineType);
                        // } else {
                        //     this.addToLineResult(lineResult, lines, ln, lineWidth, LineType.LayoutBreak | lineType);
                        // }                          
                            if (ln !== ' ') {
                                this.addToLineResult(lineResult, lines, ln, lineWidth, LineType.LayoutBreak | lineType);
                            }
                            if (this.isOverloadWithPosition) {
                                maxWidth = this.clientSize.width;
                            }
                            curLine = '';
                            builder = '';
                            lineWidth = 0;
                            curIndent = 0;
                            curLineWidth = 0;
                            lineType = LineType.None;
                            // if (isSingleWord) {
                            //     reader.readWord();
                            //     readWord = false;
                            // }
                            word = (readWord) ? word : reader.peekWord();
                            //isSingleWord = false;
                            readWord = true;
                        } else {
                            readWord = false;
                            curLine = '';
                            curLine = curLine + builder.toString();
                            word = reader.peek().toString();
                        }
                        continue;
                    }
                }
                /*tslint:disable:max-func-body-length */
                builder = builder + word;
                lineWidth = curLineWidth;
                if (readWord) {
                    reader.readWord();
                    word = reader.peekWord();
                    //isSingleWord = false;
                } else {
                    reader.read();
                    word = reader.peek().toString();
                }
            }
            if (builder.length > 0) {
                let ln : string = builder.toString();
                this.addToLineResult(lineResult, lines, ln, lineWidth, LineType.NewLineBreak | LineType.LastParagraphLine);
            }
            reader.close();
        }
        lineResult.layoutLines = [];
        for (let index : number = 0; index < lines.length; index++) {
            lineResult.layoutLines.push(lines[index]);
        }
        lines = [];
        return lineResult;
    }
    /**
     * `Adds` line to line result.
     * @private
     */
    private addToLineResult(lineResult : PdfStringLayoutResult, lines : LineInfo[], line : string,
                            lineWidth : number, breakType : LineType) : void {
        let info : LineInfo = new LineInfo();
        info.text = line;
        info.width = lineWidth;
        info.lineType = breakType;
        lines.push(info);
        let size : SizeF = lineResult.actualSize;
        size.height += this.getLineHeight();
        size.width = Math.max(size.width, lineWidth);
        lineResult.size = size;
    }
    /**
     * `Copies` layout result from line result to entire result. Checks whether we can proceed lay outing or not.
     * @private
     */
    private copyToResult(result : PdfStringLayoutResult, lineResult : PdfStringLayoutResult, lines : LineInfo[],
                 /*out*/ numInserted : number) : { success : boolean, numInserted : number } {
        let success : boolean = true;
        let allowPartialLines : boolean = (this.format != null && !this.format.lineLimit);
        let height : number = result.actualSize.height;
        let maxHeight : number = this.size.height;
        if ((this.pageHeight > 0) && (maxHeight + this.rectangle.y > this.pageHeight)) {
            maxHeight = this.rectangle.y - this.pageHeight;
            maxHeight = Math.max(maxHeight, -maxHeight);
        }
        numInserted = 0;
        if (lineResult.lines != null) {
            for (let i : number = 0, len : number = lineResult.lines.length; i < len; i++) {
                let expHeight : number = height + lineResult.lineHeight;
                if (expHeight <= maxHeight || maxHeight <= 0 || allowPartialLines)
                   {
                        let info : LineInfo = lineResult.lines[i];
                        numInserted += info.text.length;                        
                        info = this.trimLine(info, (lines.length === 0));
                        lines.push(info);
                        // Update width.
                        let size : SizeF = result.actualSize;
                        size.width = Math.max(size.width, info.width);
                        result.size = size;
                        // The part of the line fits only and it's allowed to use partial lines.
                        // if (expHeight >= maxHeight && maxHeight > 0 && allowPartialLines)
                        // {
                        //     let shouldClip : boolean = (this.format == null || !this.format.noClip);

                        //     if (shouldClip)
                        //     {
                        //         let exceededHeight : number = expHeight - maxHeight;
                        //         let fitHeight : number  = /*Utils.Round(*/ lineResult.lineHeight - exceededHeight /*)*/;
                        //         height = /*Utils.Round(*/ height + fitHeight /*)*/;
                        //     }
                        //     else
                        //     {
                        //         height = expHeight;
                        //     }

                        //     success = false;
                        //     break;
                        // } else {
                            height = expHeight;
                       // }
                    }
                    else
                    {
                        success = false;
                        break;
                    }
                }
            }
            if (height != result.size.height)
            {
                let size1 : SizeF= result.actualSize;
                size1.height = height;
                result.size = size1;
            }                
        return {success : success, numInserted : numInserted};
    }
    /**
     * `Finalizes` final result.
     * @private
     */
    private finalizeResult(result : PdfStringLayoutResult, lines : LineInfo[]) : void {
        result.layoutLines = [];
        for (let index : number = 0; index < lines.length ; index++) {
            result.layoutLines.push(lines[index]);
        }
        result.layoutLineHeight = this.getLineHeight();
        if (!this.reader.end)
            {
                result.textRemainder = this.reader.readToEnd();
            }
        lines = [];
    }
    /**
     * `Trims` whitespaces at the line.
     * @private
     */
    private trimLine(info : LineInfo, firstLine : boolean) : LineInfo {
        let line : string = info.text;
        let lineWidth : number = info.width;
        // Trim start whitespaces if the line is not a start of the paragraph only.
        let trimStartSpaces : boolean = ((info.lineType & LineType.FirstParagraphLine) === 0);
        let start : boolean = (this.format == null || !this.format.rightToLeft);
        let spaces : string[] = StringTokenizer.spaces;
        line = (start) ? line.trim() : line.trim();
        // Recalculate line width.
        if (line.length !== info.text.length) {
            lineWidth = this.getLineWidth(line);
            if ((info.lineType & LineType.FirstParagraphLine) > 0) {
                lineWidth += this.getLineIndent(firstLine);
            }
        }
        info.text = line;
        info.width = lineWidth;
        return info;
    }
    /**
     * Returns `wrap` type.
     * @private
     */
    private getWrapType() : PdfWordWrapType {
        let wrapType : PdfWordWrapType = (this.format != null) ? this.format.wordWrap : PdfWordWrapType.Word;
        return wrapType;
    }
}
//Internal declaration
export class PdfStringLayoutResult {
    //Fields
    /**
     * Layout `lines`.
     * @private
     */
    public layoutLines : LineInfo[];
    /**
     * The `text` wasn`t lay outed.
     * @private
     */
    public textRemainder : string;
    /**
     * Actual layout text `bounds`.
     * @private
     */
    public size : SizeF;
    /**
     * `Height` of the line.
     * @private
     */
    public layoutLineHeight : number;
    // Properties
    /**
     * Gets the `text` which is not lay outed.
     * @private
     */
    public get remainder() : string {
        return this.textRemainder;
    }
    /**
     * Gets the actual layout text `bounds`.
     * @private
     */
    public get actualSize() : SizeF {
        if ( typeof this.size === 'undefined' ) {
            this.size = new SizeF(0, 0);
        }
        return this.size;
    }
    /**
     * Gets layout `lines` information.
     * @private
     */
    public get lines() : LineInfo[] {
        return this.layoutLines;
    }
    /**
     * Gets the `height` of the line.
     * @private
     */
    public get lineHeight() : number {
        return this.layoutLineHeight;
    }
    /**
     * Gets value that indicates whether any layout text [`empty`].
     * @private
     */
    public get empty() : boolean {
        return (this.layoutLines == null || this.layoutLines.length === 0);
    }
    /**
     * Gets `number of` the layout lines.
     * @private
     */
    public get lineCount() : number {
        let count : number = (!this.empty) ? this.layoutLines.length : 0;
        return count;
    }
}
export class LineInfo {
    //Fields
    /**
     * Line `text`.
     * @private
     */
    public content : string;
    /**
     * `Width` of the text.
     * @private
     */
    public lineWidth : number;
    /**
     * `Breaking type` of the line.
     * @private
     */
    public type : LineType;

    //Properties
    /**
     * Gets the `type` of the line text.
     * @private
     */
    public get lineType() : LineType {
        return this.type;
    }
    public set lineType(value : LineType) {
        this.type = value;
    }
    /**
     * Gets the line `text`.
     * @private
     */
    public get text() : string {
        return this.content;
    }
    public set text(value : string) {
        this.content = value;
    }
    /**
     * Gets `width` of the line text.
     * @private
     */
    public get width() : number {
        return this.lineWidth;
    }
    public set width(value : number) {
        this.lineWidth = value;
    }
}
 /**
 * Break type of the `line`.
 * @private
 */
export enum LineType {
    /**
     * Specifies the type of `None`.
     * @private
     */
    None = 0,
    /**
     * Specifies the type of `NewLineBreak`.
     * @private
     */
    NewLineBreak = 0x0001,
    /**
     * Specifies the type of `LayoutBreak`.
     * @private
     */
    LayoutBreak = 0x0002,
    /**
     * Specifies the type of `FirstParagraphLine`.
     * @private
     */
    FirstParagraphLine = 0x0004,
    /**
     * Specifies the type of `LastParagraphLine`.
     * @private
     */
    LastParagraphLine = 0x0008
}