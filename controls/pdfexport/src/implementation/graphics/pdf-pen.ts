/**
 * PdfPen.ts class for EJ2-PDF
 */
import { PdfColor } from './pdf-color';
import { PdfSolidBrush } from './brushes/pdf-solid-brush';
import { PdfDashStyle, PdfLineCap, PdfLineJoin, PdfColorSpace } from './enum';
import { PdfBrush } from './brushes/pdf-brush';
import { GetResourceEventHandler } from './pdf-graphics';
import { PdfTransformationMatrix } from './pdf-transformation-matrix';
import { PdfStreamWriter } from './../input-output/pdf-stream-writer';
/**
 * `PdfPen` class defining settings for drawing operations, that determines the color,
 * width, and style of the drawing elements.
 * ```typescript
 * // create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // create a new page
 * let page1 : PdfPage = document.pages.add();
 * // set pen
 * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
 * // draw rectangle
 * page1.graphics.drawRectangle(pen, new RectangleF({x : 0, y : 0}, {width : 100, height : 50}));
 * // save the document.
 * document.save('output.pdf');
 * // destroy the document
 * document.destroy();
 * ```
 */
export class PdfPen {
    //Fields
    /**
     * Specifies the `color of the pen`.
     * @default new PdfColor()
     * @private
     */
    private pdfColor : PdfColor = new PdfColor(0, 0, 0);
    /**
     * Specifies the `dash offset of the pen`.
     * @default 0
     * @private
     */
    private dashOffsetValue : number = 0;
    /**
     * Specifies the `dash pattern of the pen`.
     * @default [0]
     * @private
     */
    private penDashPattern : number[] = [0];
    /**
     * Specifies the `dash style of the pen`.
     * @default Solid
     * @private
     */
    private pdfDashStyle : PdfDashStyle = PdfDashStyle.Solid;
    /**
     * Specifies the `line cap of the pen`.
     * @default 0
     * @private
     */
    private pdfLineCap : PdfLineCap = 0;
    /**
     * Specifies the `line join of the pen`.
     * @default 0
     * @private
     */
    private pdfLineJoin : PdfLineJoin = 0;
    /**
     * Specifies the `width of the pen`.
     * @default 1.0
     * @private
     */
    private penWidth : number = 1.0;
    /**
     * Specifies the `brush of the pen`.
     * @private
     */
    private pdfBrush : PdfBrush;
    /**
     * Specifies the `mitter limit of the pen`.
     * @default 0.0
     * @private
     */
    private internalMiterLimit : number = 0.0;
    /**
     * Stores the `colorspace` value.
     * @default Rgb
     * @private
     */
    private colorSpace : PdfColorSpace = PdfColorSpace.Rgb;

    /**
     * Initializes a new instance of the `PdfPen` class with color.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * //
     * // set pen
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
     * //
     * // draw rectangle
     * page1.graphics.drawRectangle(pen, new RectangleF({x : 0, y : 0}, {width : 100, height : 50}));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param color Color of the pen.
     */
    public constructor(color : PdfColor)
    /**
     * Initializes a new instance of the `PdfPen` class with 'PdfBrush' class and width of the pen.
     * @private
     */
    public constructor(brush : PdfBrush, width : number)
    /**
     * Initializes a new instance of the `PdfPen` class with color and width of the pen.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * //
     * // set pen
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0), 2);
     * //
     * // draw rectangle
     * page1.graphics.drawRectangle(pen, new RectangleF({x : 0, y : 0}, {width : 100, height : 50}));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param color Color of the pen.
     * @param width Width of the pen's line.
     */
    public constructor(color : PdfColor, width : number)
    public constructor(arg1 : PdfColor|PdfBrush, arg2? : number) {
        if ( arg1 instanceof PdfBrush) {
            this.setBrush(arg1 as PdfBrush);
        } else if ( arg1 instanceof PdfColor) {
            this.color = arg1;
        }
        if (typeof arg2 === 'number') {
           this.width = arg2;
        }
    }
    //Properties
    /**
     * Gets or sets the `color of the pen`.
     * @private
     */
    public get color() : PdfColor {
        return this.pdfColor;
    }
    public set color(value : PdfColor) {
        this.pdfColor = value;
    }
    /**
     * Gets or sets the `dash offset of the pen`.
     * @private
     */
    public get dashOffset() : number {
        if (typeof this.dashOffsetValue === 'undefined' || this.dashOffsetValue == null) {
            return 0;
        } else {
            return this.dashOffsetValue;
        }
    }
    public set dashOffset(value : number) {
        this.dashOffsetValue = value;
    }
    /**
     * Gets or sets the `dash pattern of the pen`.
     * @private
     */
    public get dashPattern() : number[] {
        return this.penDashPattern;
    }
    public set dashPattern(value : number[]) {
        this.penDashPattern = value;
    }
    /**
     * Gets or sets the `dash style of the pen`.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // set pen
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
     * //
     * // set pen style
     * pen.dashStyle = PdfDashStyle.DashDot;
     * // get pen style
     * let style : PdfDashStyle = pen.dashStyle;
     * //
     * // draw rectangle
     * page1.graphics.drawRectangle(pen, new RectangleF({x : 0, y : 0}, {width : 100, height : 50}));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get dashStyle() : PdfDashStyle {
        return this.pdfDashStyle;
    }
    public set dashStyle(value : PdfDashStyle) {
        if (this.pdfDashStyle !== value) {
            this.pdfDashStyle = value;

            switch (this.pdfDashStyle) {
                case PdfDashStyle.Custom:
                    break;

                case PdfDashStyle.Dash:
                    this.penDashPattern = [3, 1];
                    break;

                case PdfDashStyle.Dot:
                    this.penDashPattern = [1, 1];
                    break;

                case PdfDashStyle.DashDot:
                    this.penDashPattern = [3, 1, 1, 1];
                    break;

                case PdfDashStyle.DashDotDot:
                    this.penDashPattern = [3, 1, 1, 1, 1, 1];
                    break;

                case PdfDashStyle.Solid:
                     break;
                default:
                    this.pdfDashStyle = PdfDashStyle.Solid;
                    this.penDashPattern = [0];
                    break;
            }
        }
    }
    /**
     * Gets or sets the `line cap of the pen`.
     * @private
     */
    public get lineCap() : PdfLineCap {
        return this.pdfLineCap;
    }
    public set lineCap(value : PdfLineCap) {
        this.pdfLineCap = value;
    }
    /**
     * Gets or sets the `line join style of the pen`.
     * @private
     */
    public get lineJoin() : PdfLineJoin {
        return this.pdfLineJoin;
    }
    public set lineJoin(value : PdfLineJoin) {
        this.pdfLineJoin = value;
    }
    /**
     * Gets or sets the `miter limit`.
     * @private
     */
    public get miterLimit() : number {
        return this.internalMiterLimit;
    }
    public set miterLimit(value : number) {
        this.internalMiterLimit = value;
    }
    /**
     * Gets or sets the `width of the pen`.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // set pen
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
     * //
     * // set pen width
     * pen.width = 2;
     * //
     * // draw rectangle
     * page1.graphics.drawRectangle(pen, new RectangleF({x : 0, y : 0}, {width : 100, height : 50}));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get width() : number {
        return this.penWidth;
    }
    public set width(value : number) {
        this.penWidth = value;
    }

    //Helper
    /**
     * `Clones` this instance of PdfPen class.
     * @private
     */
    public clone() : PdfPen {
        let pen : PdfPen = this;
        return pen;
    }
    /**
     * `Sets the brush`.
     * @private
     */
    private setBrush(brush : PdfBrush) : void {
        let sBrush : PdfSolidBrush = brush as PdfSolidBrush;
        if ((sBrush != null && sBrush instanceof PdfSolidBrush)) {
            this.color = sBrush.color;
            this.pdfBrush = sBrush;
        }
        this.color = sBrush.color;
        this.pdfBrush = sBrush;
    }
    /**
     * `Monitors the changes`.
     * @private
     */
    public monitorChanges(currentPen : PdfPen, streamWriter : PdfStreamWriter,  getResources : GetResourceEventHandler,
                          saveState : boolean, currentColorSpace : PdfColorSpace, matrix : PdfTransformationMatrix) : boolean {
        let diff : boolean = false;
        saveState = true;
        if (currentPen == null) {
            diff = true;
        }
        diff = this.dashControl(currentPen, saveState, streamWriter);
        streamWriter.setLineWidth(this.width);
        streamWriter.setLineJoin(this.lineJoin);
        streamWriter.setLineCap(this.lineCap);
        let miterLimit : number = this.miterLimit;
        if (miterLimit > 0) {
            streamWriter.setMiterLimit(miterLimit);
            diff = true;
        }
        let brush : PdfBrush = this.pdfBrush;
        streamWriter.setColorAndSpace(this.color, currentColorSpace, true);
        diff = true;
        return diff;
    }
    /**
     * `Controls the dash style` and behaviour of each line.
     * @private
     */
    private dashControl(pen : PdfPen, saveState : boolean, streamWriter : PdfStreamWriter) : boolean {
        saveState = true;
        let lineWidth : number = this.width;
        let pattern : number[] = this.getPattern();
        streamWriter.setLineDashPattern(pattern, this.dashOffset * lineWidth);
        return saveState;
    }
    /**
     * `Gets the pattern` of PdfPen.
     * @private
     */
    public getPattern() : number[] {
        let pattern : number[] = this.dashPattern as number[];
        for (let i : number = 0; i < pattern.length; ++i) {
            pattern[i] *= this.width;
        }
        return pattern;
    }
}