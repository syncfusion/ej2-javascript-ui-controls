/**
 * PdfStreamWriter.ts class for EJ2-PDF
 */
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { PdfStream } from './../primitives/pdf-stream';
import { Operators } from './pdf-operators';
import { PdfNumber } from './../primitives/pdf-number';
import { PointF, RectangleF } from './../drawing/pdf-drawing';
import { TextRenderingMode, PdfLineCap, PdfLineJoin, PdfColorSpace } from './../graphics/enum';
import { PdfString } from './../primitives/pdf-string';
import { PdfName } from './../primitives/pdf-name';
import { PdfFont } from './../graphics/fonts/pdf-font';
import { PdfTransformationMatrix } from './../graphics/pdf-transformation-matrix';
import { PdfColor } from './../graphics/pdf-color';
import { PdfArray } from './../primitives/pdf-array';
import { PdfDocument } from './../document/pdf-document';
/**
 * Helper class to `write PDF graphic streams` easily.
 * @private
 */
export class PdfStreamWriter implements IPdfWriter {
    //Fields
    /**
     * The PDF `stream` where the data should be write into.
     * @private
     */
    private stream : PdfStream;
    /**
     * Initialize an instance of `PdfStreamWriter` class.
     * @private
     */
    public constructor(stream : PdfStream) {
        if (stream == null) {
            throw new Error('ArgumentNullException:stream');
        }
        this.stream = stream;
    }
    //Implementation
    /**
     * `Clear` the stream.
     * @public
     */
    public clear() : void {
        this.stream.clearStream();
    }
    /**
     * Sets the `graphics state`.
     * @private
     */
    public setGraphicsState(dictionaryName : PdfName) : void
    /**
     * Sets the `graphics state`.
     * @private
     */
    public setGraphicsState(dictionaryName : string) : void
    public setGraphicsState(dictionaryName : PdfName|string) : void {
        if (dictionaryName instanceof PdfName) {
            this.stream.write(dictionaryName.toString());
            this.stream.write(Operators.whiteSpace);
            this.writeOperator(Operators.setGraphicsState);
        } else {
            this.stream.write(Operators.slash);
            this.stream.write(dictionaryName);
            this.stream.write(Operators.whiteSpace);
            this.writeOperator(Operators.setGraphicsState);
        }
    }
    /**
     * `Executes the XObject`.
     * @private
     */
    public executeObject(name : PdfName) : void {
        this.stream.write(name.toString());
        this.stream.write(Operators.whiteSpace);
        this.writeOperator(Operators.paintXObject);
        this.stream.write(Operators.newLine);
    }
    /**
     * `Closes path object`.
     * @private
     */
    public closePath() : void {
        this.writeOperator(Operators.closePath);
    }
    /**
     * `Clips the path`.
     * @private
     */
    public clipPath(useEvenOddRule : boolean) : void {
        this.stream.write(Operators.clipPath);
        if (useEvenOddRule) {
            this.stream.write(Operators.evenOdd);
        }
        this.stream.write(Operators.whiteSpace);
        this.stream.write(Operators.endPath);
        this.stream.write(Operators.newLine);
    }
    /**
     * `Closes, then fills and strokes the path`.
     * @private
     */
    public closeFillStrokePath(useEvenOddRule : boolean) : void {
        this.stream.write(Operators.closeFillStrokePath);
        if (useEvenOddRule) {
            this.stream.write(Operators.evenOdd);
            this.stream.write(Operators.newLine);
        } else {
            this.stream.write(Operators.newLine);
        }
    }
    /**
     * `Fills and strokes path`.
     * @private
     */
    public fillStrokePath(useEvenOddRule : boolean) : void {
        this.stream.write(Operators.fillStroke);
        if (useEvenOddRule) {
            this.stream.write(Operators.evenOdd);
            this.stream.write(Operators.newLine);
        } else {
            this.stream.write(Operators.newLine);
        }
    }
    /**
     * `Fills path`.
     * @private
     */
    public fillPath(useEvenOddRule : boolean) : void {
        this.stream.write(Operators.fill);
        if (useEvenOddRule) {
            this.stream.write(Operators.evenOdd);
            this.stream.write(Operators.newLine);
        } else {
            this.stream.write(Operators.newLine);
        }
    }
    /**
     * `Ends the path`.
     * @private
     */
    public endPath() : void {
        this.writeOperator(Operators.n);
    }
    /**
     * `Closes and fills the path`.
     * @private
     */
    public closeFillPath(useEvenOddRule : boolean) : void {
        this.writeOperator(Operators.closePath);
        this.stream.write(Operators.fill);
        if (useEvenOddRule) {
            this.stream.write(Operators.evenOdd);
            this.stream.write(Operators.newLine);
        } else {
            this.stream.write(Operators.newLine);
        }
    }
    /**
     * `Closes and strokes the path`.
     * @private
     */
    public closeStrokePath() : void {
        this.writeOperator(Operators.closeStrokePath);
    }
    /**
     * `Sets the text scaling`.
     * @private
     */
    public setTextScaling(textScaling : number) : void {
        this.stream.write(PdfNumber.floatToString(textScaling));
        this.stream.write(Operators.whiteSpace);
        this.writeOperator(Operators.setTextScaling);
    }
    /**
     * `Strokes path`.
     * @private
     */
    public strokePath() : void {
        this.writeOperator(Operators.stroke);
    }
    /**
     * `Restores` the graphics state.
     * @private
     */
    public restoreGraphicsState() : void {
        this.writeOperator(Operators.restoreState);
    }
    /**
     * `Saves` the graphics state.
     * @private
     */
    public saveGraphicsState() : void {
        this.writeOperator(Operators.saveState);
    }
    /**
     * `Shifts the text to the point`.
     * @private
     */
    public startNextLine() : void
    /**
     * `Shifts the text to the point`.
     * @private
     */
    public startNextLine(point : PointF) : void
    /**
     * `Shifts the text to the point`.
     * @private
     */
    public startNextLine(x : number, y : number) : void
    public startNextLine(arg1 ?: PointF | number, arg2 ?: number) : void {
        if (typeof arg1 === 'undefined') {
            this.writeOperator(Operators.goToNextLine);
        } else if (arg1 instanceof PointF) {
            this.writePoint(arg1);
            this.writeOperator(Operators.setCoords);
        } else {
            this.writePoint(arg1, arg2);
            this.writeOperator(Operators.setCoords);
        }
    }
    /**
     * Shows the `text`.
     * @private
     */
    public showText(text : PdfString) : void {
        this.checkTextParam(text);
        this.writeText(text);
        this.writeOperator(Operators.setText);
    }
    /**
     * Sets `text leading`.
     * @private
     */
    public setLeading(leading : number) : void {
        this.stream.write(PdfNumber.floatToString(leading));
        this.stream.write(Operators.whiteSpace);
        this.writeOperator(Operators.setTextLeading);
    }
    /**
     * `Begins the path`.
     * @private
     */
    public beginPath(x : number, y : number) : void {
        this.writePoint(x, y);
        this.writeOperator(Operators.beginPath);
    }
    /**
     * `Begins text`.
     * @private
     */
    public beginText() : void {
        this.writeOperator(Operators.beginText);
    }
    /**
     * `Ends text`.
     * @private
     */
    public endText() : void {
        this.writeOperator(Operators.endText);
    }
    /**
     * `Appends the rectangle`.
     * @private
     */
    public appendRectangle(rectangle : RectangleF) : void
    /**
     * `Appends the rectangle`.
     * @private
     */
    public appendRectangle(x : number, y : number, width : number, height : number) : void
    public appendRectangle(arg1 : number|RectangleF, arg2 ?: number, arg3 ?: number, arg4 ?: number) : void {
        if (arg1 instanceof RectangleF) {
            this.appendRectangle(arg1.x, arg1.y, arg1.width, arg1.height);
        } else {
            this.writePoint(arg1 as number, arg2);
            this.writePoint(arg3, arg4);
            this.writeOperator(Operators.appendRectangle);
        }
    }
    /**
     * `Appends a line segment`.
     * @private
     */
    public appendLineSegment(point : PointF) : void
    /**
     * `Appends a line segment`.
     * @private
     */
    public appendLineSegment(x : number, y : number) : void
    public appendLineSegment(arg1 : number | PointF, arg2 ?: number) : void {
        if (arg1 instanceof PointF) {
            this.appendLineSegment(arg1.x, arg1.y);
        } else {
            this.writePoint(arg1, arg2);
            this.writeOperator(Operators.appendLineSegment);
        }
    }
    /**
     * Sets the `text rendering mode`.
     * @private
     */
    public setTextRenderingMode(renderingMode : TextRenderingMode) : void {
        this.stream.write((<number>renderingMode).toString());
        this.stream.write(Operators.whiteSpace);
        this.writeOperator(Operators.setRenderingMode);
    }
    /**
     * Sets the `character spacing`.
     * @private
     */
    public setCharacterSpacing(charSpacing : number) : void {
        this.stream.write(PdfNumber.floatToString(charSpacing));
        this.stream.write(Operators.whiteSpace);
        this.stream.write(Operators.setCharacterSpace);
        this.stream.write(Operators.newLine);
    }
    /**
     * Sets the `word spacing`.
     * @private
     */
    public setWordSpacing(wordSpacing : number) : void {
        this.stream.write(PdfNumber.floatToString(wordSpacing));
        this.stream.write(Operators.whiteSpace);
        this.writeOperator(Operators.setWordSpace);
    }
    // public showNextLineText(text : number[], hex : boolean) : void
    /**
     * Shows the `next line text`.
     * @private
     */
    public showNextLineText(text : string, hex : boolean) : void
    /**
     * Shows the `next line text`.
     * @private
     */
    public showNextLineText(text : PdfString) : void
    public showNextLineText(arg1 ?: PdfString|string , arg2 ?: boolean) : void {
        if (arg1 instanceof PdfString) {
            this.checkTextParam(arg1);
            this.writeText(arg1);
            this.writeOperator(Operators.setTextOnNewLine);
        } else {
            this.checkTextParam(arg1);
            this.writeText(arg1, arg2);
            this.writeOperator(Operators.setTextOnNewLine);
        }
    }
    /**
     * Set the `color space`.
     * @private
     */
    public setColorSpace(name : string, forStroking : boolean) : void
    /**
     * Set the `color space`.
     * @private
     */
    public setColorSpace(name : PdfName, forStroking : boolean) : void
    public setColorSpace(arg1 : PdfName|string, arg2 : boolean|PdfName) : void {
        if (arg1 instanceof PdfName && typeof arg2 === 'boolean') {
            let temparg1 : PdfName = arg1 as PdfName;
            let temparg2 : boolean = arg2 as boolean;
            // if (temparg1 == null) {
            //     throw new Error('ArgumentNullException:name');
            // }
            let op : string = (temparg2) ? Operators.selectcolorspaceforstroking : Operators.selectcolorspacefornonstroking;
            this.stream.write(temparg1.toString());
            this.stream.write(Operators.whiteSpace);
            this.stream.write(op);
            this.stream.write(Operators.newLine);
        } else {
            let temparg1 : string = arg1 as string;
            let temparg2 : boolean = arg2 as boolean;
            this.setColorSpace(new PdfName(temparg1), temparg2);
        }
    }
    /**
     * Modifies current `transformation matrix`.
     * @private
     */
    public modifyCtm(matrix : PdfTransformationMatrix) : void {
        if (matrix == null) {
            throw new Error('ArgumentNullException:matrix');
        }
        this.stream.write(matrix.toString());
        this.stream.write(Operators.whiteSpace);
        this.writeOperator(Operators.modifyCtm);
    }
    /**
     * Sets `font`.
     * @private
     */
    public setFont(font : PdfFont, name : string, size : number) : void
    /**
     * Sets `font`.
     * @private
     */
    public setFont(font : PdfFont, name : PdfName, size : number) : void
    public setFont(font : PdfFont, name : PdfName|string, size : number) : void {
        if (typeof name === 'string') {
            this.setFont(font, new PdfName(name), size);
        } else {
            if (font == null) {
                throw new Error('ArgumentNullException:font');
            }
            this.stream.write(name.toString());
            this.stream.write(Operators.whiteSpace);
            this.stream.write(PdfNumber.floatToString(size));
            this.stream.write(Operators.whiteSpace);
            this.writeOperator(Operators.setFont);
        }
    }
    /**
     * `Writes the operator`.
     * @private
     */
    private writeOperator(opcode : string) : void {
        this.stream.write(opcode);
        this.stream.write(Operators.newLine);
    }
    /**
     * Checks the `text param`.
     * @private
     */
    private checkTextParam(text : string) : void
    /**
     * Checks the `text param`.
     * @private
     */
    private checkTextParam(text : PdfString) : void
    private checkTextParam(text : PdfString|string) : void {
        if (text == null) {
            throw new Error('ArgumentNullException:text');
        }
        if (typeof text === 'string' && text === '') {
            throw new Error('ArgumentException:The text can not be an empty string, text');
        }
    }
    /**
     * `Writes the text`.
     * @private
     */
    private writeText(text : string, hex : boolean) : void
    /**
     * `Writes the text`.
     * @private
     */
    private writeText(text : PdfString) : void
    private writeText(arg1 : PdfString|string, arg2 ?: boolean) : void {
        if ((arg1 instanceof PdfString) && (typeof arg2 === 'undefined')) {
            this.stream.write(arg1.pdfEncode());
        } else {
            let start : string;
            let end : string;
            if (arg2) {
                start = PdfString.hexStringMark[0];
                end = PdfString.hexStringMark[1];
            } else {
                start = PdfString.stringMark[0];
                end = PdfString.stringMark[1];
            }
            this.stream.write(start);
            this.stream.write(arg1 as string);
            this.stream.write(end);
        }
    }
    /**
     * `Writes the point`.
     * @private
     */
    private writePoint(point : PointF) : void
    /**
     * `Writes the point`.
     * @private
     */
    private writePoint(x : number, y : number) : void
    private writePoint(arg1 : number|PointF, arg2 ?: number) : void {
        if ((arg1 instanceof PointF) && (typeof arg2 === 'undefined')) {
            this.writePoint(arg1.x, arg1.y);
        } else {
            let temparg1 : number = arg1 as number;
            this.stream.write(PdfNumber.floatToString(temparg1));
            this.stream.write(Operators.whiteSpace);
            // NOTE: Change Y co-ordinate because we shifted co-ordinate system only.
            arg2 = this.updateY(arg2);
            this.stream.write(PdfNumber.floatToString(arg2));
            this.stream.write(Operators.whiteSpace);
        }
    }
    /**
     * `Updates y` co-ordinate.
     * @private
     */
    public updateY(arg : number) : number {
        return -arg;
    }
    /**
     * `Writes string` to the file.
     * @private
     */
    public write(string : string) : void {
        let builder : string = '';
        builder += string;
        builder += Operators.newLine;
        this.writeOperator(builder);
    }
    /**
     * `Writes comment` to the file.
     * @private
     */
    public writeComment(comment : string) : void {
        if (comment != null && comment.length > 0) {
            let builder : string = '';
            builder += Operators.comment;
            builder += Operators.whiteSpace;
            builder += comment;
            //builder.Append( Operators.NewLine );
            this.writeOperator(builder);
        } else {
            throw new Error('Invalid comment');
        }
    }
    /**
     * Sets the `color and space`.
     * @private
     */
    public setColorAndSpace(color : PdfColor, colorSpace : PdfColorSpace, forStroking : boolean) : void {
        if (!color.isEmpty) {
            // bool test = color is PdfExtendedColor;
            this.stream.write(color.toString(colorSpace, forStroking));
            this.stream.write(Operators.newLine);
        }
    }
    // public setLineDashPattern(pattern : number[], patternOffset : number) : void
    // {
    //     let pat : PdfArray = new PdfArray(pattern);
    //     let off : PdfNumber = new PdfNumber(patternOffset);
    //     this.setLineDashPatternHelper(pat, off);
    // }
    // private setLineDashPatternHelper(pattern : PdfArray, patternOffset : PdfNumber) : void
    // {
    //     pattern.Save(this);
    //     this.m_stream.write(Operators.whiteSpace);
    //     patternOffset.Save(this);
    //     this.m_stream.write(Operators.whiteSpace);
    //     this.writeOperator(Operators.setDashPattern);
    // }
    /**
     * Sets the `line dash pattern`.
     * @private
     */
    public setLineDashPattern(pattern : number[], patternOffset : number) : void {
        // let pat : PdfArray = new PdfArray(pattern);
        // let off : PdfNumber = new PdfNumber(patternOffset);
        // this.setLineDashPatternHelper(pat, off);
        this.setLineDashPatternHelper(pattern, patternOffset);

    }
    /**
     * Sets the `line dash pattern`.
     * @private
     */
    private setLineDashPatternHelper(pattern : number[], patternOffset : number) : void {
        let tempPattern : string = '[';
        if (pattern.length > 1) {
            for (let index : number = 0; index < pattern.length; index++) {
                if (index === pattern.length - 1) {
                    tempPattern += pattern[index].toString();
                } else {
                    tempPattern += pattern[index].toString() + ' ';
                }
            }
        }
        tempPattern += '] ';
        tempPattern += patternOffset.toString();
        tempPattern += ' ' + Operators.setDashPattern;
        this.stream.write(tempPattern);
        this.stream.write(Operators.newLine);
    }
    /**
     * Sets the `miter limit`.
     * @private
     */
    public setMiterLimit(miterLimit : number) : void {
        this.stream.write(PdfNumber.floatToString(miterLimit));
        this.stream.write(Operators.whiteSpace);
        this.writeOperator(Operators.setMiterLimit);
    }
    /**
     * Sets the `width of the line`.
     * @private
     */
    public setLineWidth(width : number) : void {
        this.stream.write(PdfNumber.floatToString(width));
        this.stream.write(Operators.whiteSpace);
        this.writeOperator(Operators.setLineWidth);
    }
    /**
     * Sets the `line cap`.
     * @private
     */
    public setLineCap(lineCapStyle : PdfLineCap) : void {
        this.stream.write((lineCapStyle).toString());
        this.stream.write(Operators.whiteSpace);
        this.writeOperator(Operators.setLineCapStyle);
    }
    /**
     * Sets the `line join`.
     * @private
     */
    public setLineJoin(lineJoinStyle : PdfLineJoin) : void {
        this.stream.write((lineJoinStyle).toString());
        this.stream.write(Operators.whiteSpace);
        this.writeOperator(Operators.setLineJoinStyle);
    }
    //IPdfWriter members
    /**
     * Gets or sets the current `position` within the stream.
     * @private
     */
    public get position() : number {
        return this.stream.position;
    }
    /**
     * Gets `stream length`.
     * @private
     */
    public get length() : number {
        let returnValue : number = 0;
        if (this.stream.data.length !== 0 && this.stream.data.length !== -1) {
            for (let index : number = 0; index < this.stream.data.length; index++) {
                returnValue += this.stream.data[index].length;
            }
        }
        return returnValue;
    }
    /**
     * Gets and Sets the `current document`.
     * @private
     */
    public get document() : PdfDocument {
        return null;
    }
    /**
     * `Appends a line segment`.
     * @public
     */
    public appendBezierSegment(arg1 : PointF, arg2 : PointF, arg3 : PointF) : void
    public appendBezierSegment(x1 : number, y1 : number, x2 : number, y2 : number, x3 : number, y3 : number ) : void
    /* tslint:disable-next-line:max-line-length */
    public appendBezierSegment(arg1 : number|PointF, arg2 : number|PointF, arg3 : number|PointF, arg4 ?: number, arg5 ?: number, arg6 ?: number ) : void {
        if (arg1 instanceof PointF && arg2 instanceof PointF && arg3 instanceof PointF) {
            this.writePoint(arg1.x, arg1.y);
            this.writePoint(arg2.x, arg2.y);
            this.writePoint(arg3.x, arg3.y);
        } else {
            this.writePoint(arg1 as number, arg2 as number);
            this.writePoint(arg3 as number, arg4 as number);
            this.writePoint(arg5 as number, arg6 as number);
        }
        this.writeOperator(Operators.appendbeziercurve);
    }
    public setColourWithPattern(colours: number[], patternName: PdfName, forStroking: boolean) : void {
        if ((colours != null)) {
            let count: number = colours.length;
            let i : number = 0;
            for (i = 0; i < count; ++i) {
                this.stream.write(colours[i].toString());
                this.stream.write(Operators.whiteSpace);
            }
        }
        if ((patternName != null)) {
            this.stream.write(patternName.toString());
            this.stream.write(Operators.whiteSpace);
        }
        if (forStroking) {
            this.writeOperator(Operators.setColorAndPatternStroking);
        } else {
            this.writeOperator(Operators.setColorAndPattern);
        }
    }
}