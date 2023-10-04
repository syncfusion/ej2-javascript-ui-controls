/**
 * PdfGraphics.ts class for EJ2-PDF
 */
import { PdfColorSpace, TextRenderingMode, PdfFillMode, PdfTextAlignment } from './enum';
import { PdfVerticalAlignment, PdfBlendMode } from './enum';
import { PdfSubSuperScript } from './fonts/enum';
import { PdfStreamWriter } from './../input-output/pdf-stream-writer';
import { PdfPen } from './pdf-pen';
import { PdfBrush } from './brushes/pdf-brush';
import { PdfSolidBrush } from './brushes/pdf-solid-brush';
import { PdfFont } from './fonts/pdf-font';
import { PdfStandardFont } from './fonts/pdf-standard-font';
import { PdfTransformationMatrix } from './pdf-transformation-matrix';
import { PointF, SizeF, RectangleF } from './../drawing/pdf-drawing';
import { ProcedureSets } from './constants';
import { PdfStream } from './../primitives/pdf-stream';
import { PdfString } from './../primitives/pdf-string';
import { PdfName } from './../primitives/pdf-name';
import { PdfArray } from './../primitives/pdf-array';
import { PdfStringFormat } from './fonts/pdf-string-format';
import { TemporaryDictionary } from './../collections/object-object-pair/dictionary';
import { PdfTransparency } from './pdf-transparency';
import { PdfStringLayouter, PdfStringLayoutResult, LineType } from './fonts/string-layouter';
import { PdfPageLayer } from './../pages/pdf-page-layer';
import { PdfPageBase } from './../pages/pdf-page-base';
import { PdfPage } from './../pages/pdf-page';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
import { StringTokenizer } from './fonts/string-tokenizer';
import { PdfResources } from './pdf-resources';
import { LineInfo } from './fonts/string-layouter';
import { PdfImage } from './images/pdf-image';
import { PdfAutomaticFieldInfoCollection } from './../document/automatic-fields/automatic-field-info-collection';
import { PdfAutomaticFieldInfo } from './../document/automatic-fields/automatic-field-info';
import { PdfTemplate } from './figures/pdf-template';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
import { PdfSection } from './../pages/pdf-section';
import { Operators } from './../input-output/pdf-operators';
import { PdfTrueTypeFont } from './fonts/pdf-true-type-font';
import { UnicodeTrueTypeFont } from './fonts/unicode-true-type-font';
import { TtfReader } from './fonts/ttf-reader';
import { InternalEnum } from './../primitives/pdf-string';
import { RtlRenderer } from './fonts/rtl-renderer';
import { PdfTextDirection } from './enum';
import { PathPointType } from './figures/enum';
import { PdfPath } from './figures/path';
import { PdfGradientBrush } from './../../implementation/graphics/brushes/pdf-gradient-brush';
import { PdfTilingBrush } from './brushes/pdf-tiling-brush';
/**
 * `PdfGraphics` class represents a graphics context of the objects.
 * It's used for performing all the graphics operations.
 * ```typescript
 * // create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // add a new page to the document
 * let page1 : PdfPage = document.pages.add();
 * // set the font
 * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
 * // create black brush
 * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
 * //
 * //graphics of the page
 * let page1Graphics : PdfGraphics = page1.graphics;
 * // draw the text on the page1 graphics
 * page1Graphics.drawString('Hello World', font, blackBrush, new PointF(0, 0));
 * //
 * // save the document
 * document.save('output.pdf');
 * // destroy the document
 * document.destroy();
 * ```
 */
export class PdfGraphics {
    // Constants
    /**
     * Specifies the mask of `path type values`.
     * @private
     */
    private static readonly pathTypesValuesMask : number = 0xf;
    // Fields
    /**
     * Represents the `Stream writer` object.
     * @private
     */
    private pdfStreamWriter : PdfStreamWriter;
    /**
     * Represents the state, whether it `is saved or not`.
     * @private
     */
    private bStateSaved : boolean;
    /**
     * Represents the `Current pen`.
     * @private
     */
    private currentPen : PdfPen;
    /**
     * Represents the `Current brush`.
     * @private
     */
    private currentBrush : PdfBrush;
    /**
     * Represents the `Current font`.
     * @private
     */
    private currentFont : PdfFont;
    /**
     * Represents the `Current font`.
     * @private
     */
    public currentPage : PdfPage;
    /**
     * Represents the `Current color space`.
     * @private
     */
    private currentColorSpace : PdfColorSpace = PdfColorSpace.Rgb;
    /**
     * The `transformation matrix` monitoring all changes with CTM.
     * @private
     */
    private transformationMatrix : PdfTransformationMatrix;
    /**
     * Stores `previous rendering mode`.
     * @private
     */
    private previousTextRenderingMode : TextRenderingMode = TextRenderingMode.Fill;
    /**
     * Previous `character spacing` value or 0.
     * @private
     */
    private previousCharacterSpacing : number = 0.0;
    /**
     * Previous `word spacing` value or 0.
     * @private
     */
    private previousWordSpacing : number = 0.0;
    /**
     * The `previously used text scaling` value.
     * @private
     */
    private previousTextScaling : number = 100.0;
    /**
     * Event handler object to store instance of `PdfResources` class.
     * @private
     */
    private getResources : GetResourceEventHandler;
    /**
     * Indicates whether `color space was initialized`.
     * @private
     */
    private bCSInitialized : boolean;
    /**
     * Represents the `Size of the canvas`.
     * @private
     */
    private canvasSize : SizeF;
    /**
     * Represents the size of the canvas reduced by `margins and templates`.
     * @private
     */
    public clipBounds : RectangleF;
    // private trasparencies : Dictionary<TransparencyData, PdfTransparency>;
    /**
     * Current `string format`.
     * @private
     */
    private currentStringFormat : PdfStringFormat;
    /**
     * Instance of `ProcedureSets` class.
     * @private
     */
    private procedureSets : ProcedureSets = new ProcedureSets();
    /**
     * To check wihether it is a `direct text rendering`.
     * @default true
     * @private
     */
    private isNormalRender : boolean = true;
    /**
     * check whether to `use font size` to calculate the shift.
     * @default false
     * @private
     */
    private isUseFontSize : boolean = false;
    /**
     * check whether the font is in `italic type`.
     * @default false
     * @private
     */
    private isItalic : boolean = false;
    /**
     * Check whether it is an `emf Text Matrix`.
     * @default false
     * @private
     */
    public isEmfTextScaled : boolean = false;
    /**
     * Check whether it is an `emf` call.
     * @default false
     * @private
     */
    public isEmf : boolean = false;
    /**
     * Check whether it is an `emf plus` call.
     * @default false
     * @private
     */
    public isEmfPlus : boolean = false;
    /**
     * Check whether it is in `base line format`.
     * @default true
     * @private
     */
    public isBaselineFormat : boolean = true;
    /**
     * Emf Text `Scaling Factor`.
     * @private
     */
    public emfScalingFactor : SizeF = new SizeF(0, 0);
    /**
     * Internal variable to store `layout result` after drawing string.
     * @private
     */
    private pdfStringLayoutResult : PdfStringLayoutResult;
    /**
     * Internal variable to store `layer` on which this graphics lays.
     * @private
     */
    private pageLayer : PdfPageLayer;
    /**
     * To check whether the `last color space` of document and garphics is saved.
     * @private
     */
    private colorSpaceChanged : boolean = false;
    /**
     * Media box upper right `bound`.
     * @hidden
     * @private
     */
    private internalMediaBoxUpperRightBound : number;
    /**
     * Holds instance of PdfArray as `cropBox`.
     * @private
     */
    public cropBox : PdfArray;
    /**
     * Checks whether the object is `transparencyObject`.
     * @hidden
     * @private
     */
    private static transparencyObject : boolean = false;
    /**
     * Stores an instance of `DictionaryProperties`.
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * `last document colorspace`.
     * @hidden
     * @private
     */
    private lastDocumentCS : PdfColorSpace;
    /**
     * `last graphics's colorspace`.
     * @hidden
     * @private
     */
    private lastGraphicsCS : PdfColorSpace;
    /**
     * Checks whether the x co-ordinate is need to set as client size or not.
     * @hidden
     * @private
     */
    private isOverloadWithPosition : boolean = false;
    /**
     * Checks whether the x co-ordinate is need to set as client size or not.
     * @hidden
     * @private
     */
    private isPointOverload : boolean = false;
    /**
     * Current colorspaces.
     * @hidden
     * @private
     */
    private currentColorSpaces : string[] = ['RGB', 'CMYK', 'GrayScale', 'Indexed'];
    /**
     * Checks the current image `is optimized` or not.
     * @default false.
     * @private
     */
    public isImageOptimized : boolean = false;
    /**
     * Returns the `current graphics state`.
     * @private
     */
    private gState : PdfGraphicsState;
    /**
     * Stores the `graphics states`.
     * @private
     */
    private graphicsState : PdfGraphicsState[] = [];
    /**
     * Stores the `trasparencies`.
     * @private
     */
    private trasparencies : TemporaryDictionary<TransparencyData, PdfTransparency>;
    /**
     * Indicates whether the object `had trasparency`.
     * @default false
     * @private
     */
    private istransparencySet : boolean = false;
    /**
     * Stores the instance of `PdfAutomaticFieldInfoCollection` class .
     * @default null
     * @private
     */
    private internalAutomaticFields : PdfAutomaticFieldInfoCollection = null;
    /**
     * Stores shift value for draw string with `PointF` overload.
     * @private
     * @hidden
     */
    private shift : number;
    /**
     * Stores the index of the start line that should draw with in the next page. 
     * @private
     */
    private startCutIndex : number = -1;
    //  Properties
    /**
     * Returns the `result` after drawing string.
     * @private
     */
    public get stringLayoutResult() : PdfStringLayoutResult {
        return this.pdfStringLayoutResult;
    }
    /**
     * Gets the `size` of the canvas.
     * @private
     */
    public get size() : SizeF {
        return this.canvasSize;
    }
    /**
     * Gets and Sets the value of `MediaBox upper right bound`.
     * @private
     */
    public get mediaBoxUpperRightBound() : number {
        if (typeof this.internalMediaBoxUpperRightBound === 'undefined') {
            this.internalMediaBoxUpperRightBound = 0;
        }
        return this.internalMediaBoxUpperRightBound;
    }
    public set mediaBoxUpperRightBound(value : number) {
        this.internalMediaBoxUpperRightBound = value;
    }
    /**
     * Gets the `size` of the canvas reduced by margins and page templates.
     * @private
     */
    public get clientSize() : SizeF {
        return new SizeF(this.clipBounds.width, this.clipBounds.height);
    }
    /**
     * Gets or sets the current `color space` of the document
     * @private
     */
    public get colorSpace() : PdfColorSpace {
        return this.currentColorSpace;
    }
    public set colorSpace(value : PdfColorSpace) {
        this.currentColorSpace = value;
    }
    /**
     * Gets the `stream writer`.
     * @private
     */
    public get streamWriter() : PdfStreamWriter {
        return this.pdfStreamWriter;
    }
    /**
     * Gets the `transformation matrix` reflecting current transformation.
     * @private
     */
    public get matrix() : PdfTransformationMatrix {
        if (this.transformationMatrix == null) {
            this.transformationMatrix = new PdfTransformationMatrix();
        }
        return this.transformationMatrix;
    }
    /**
     * Gets the `layer` for the graphics, if exists.
     * @private
     */
    public get layer() : PdfPageLayer {
        return this.pageLayer;
    }
    /**
     * Gets the `page` for this graphics, if exists.
     * @private
     */
    public get page() : PdfPageBase {
        return this.pageLayer.page;
    }
    public get automaticFields() : PdfAutomaticFieldInfoCollection {
        if (this.internalAutomaticFields == null || typeof this.internalAutomaticFields === 'undefined') {
            this.internalAutomaticFields = new PdfAutomaticFieldInfoCollection();
        }
        return this.internalAutomaticFields;
    }
    /**
     * Initializes a new instance of the `PdfGraphics` class.
     * @private
     */
    public constructor(size : SizeF, resources : GetResourceEventHandler, writer : PdfStreamWriter)
    /**
     * Initializes a new instance of the `PdfGraphics` class.
     * @private
     */
    public constructor(size : SizeF, resources : GetResourceEventHandler, stream : PdfStream)
    public constructor(arg1 : SizeF, arg2 : GetResourceEventHandler, arg3 : PdfStream | PdfStreamWriter) {
        this.getResources = arg2 as GetResourceEventHandler;
        this.canvasSize = arg1;
        if (arg3 instanceof PdfStreamWriter) {
            this.pdfStreamWriter = arg3;
        } else {
            this.pdfStreamWriter = new PdfStreamWriter(arg3);
        }
        this.initialize();
    }
    //Implementation
    /**
     * `Initializes` this instance.
     * @private
     */
    public initialize() : void {
        this.bStateSaved = false;
        this.currentPen = null;
        this.currentBrush = null;
        this.currentFont = null;
        this.currentColorSpace = PdfColorSpace.Rgb;
        this.bCSInitialized = false;
        this.transformationMatrix = null;
        this.previousTextRenderingMode = <TextRenderingMode>(-1); //.Fill;
        this.previousCharacterSpacing = -1.0;
        this.previousWordSpacing = -1.0;
        this.previousTextScaling = -100.0;
        // this.m_trasparencies = null;
        this.currentStringFormat = null;
        this.clipBounds = new RectangleF(new PointF(0, 0), this.size);
        this.getResources.getResources().requireProcedureSet(this.procedureSets.pdf);
    }
    // Public methods
    /* tslint:disable */
    /**
     * `Draw the template`.
     * @private
     */
    public drawPdfTemplate(template : PdfTemplate, location : PointF) : void
    public drawPdfTemplate(template : PdfTemplate, location : PointF, size : SizeF) : void
    public drawPdfTemplate(template : PdfTemplate, location : PointF, size ?: SizeF) : void {
        if (typeof size === 'undefined') {
            if (template == null) {
                throw Error('ArgumentNullException-template');
            }
            this.drawPdfTemplate(template, location, template.size);
        } else {
            // let crossTable : PdfCrossTable = null;
            // if (this.pageLayer != null) {
            //     crossTable = (this.page as PdfPage).section.parentDocument.crossTable;
            // }
            if (template == null) {
                throw Error('ArgumentNullException-template');
            }

            let scaleX : number = (template.width > 0) ? size.width / template.width : 1;
            let scaleY : number = (template.height > 0) ? size.height / template.height : 1;
            let bNeedScale : boolean = !(scaleX === 1 && scaleY === 1);
            // Save state.
            let state : PdfGraphicsState = this.save();
            // Take into consideration that rect location is bottom/left.
            let matrix : PdfTransformationMatrix = new PdfTransformationMatrix();
            if (this.pageLayer != null) {
                this.getTranslateTransform(location.x, location.y + size.height, matrix);
            }
            if (bNeedScale) {
                this.getScaleTransform(scaleX, scaleY, matrix);
            }
            this.pdfStreamWriter.modifyCtm(matrix);
            // Output template.
            let resources : PdfResources = this.getResources.getResources();
            let name : PdfName = resources.getName(template);
            this.pdfStreamWriter.executeObject(name);
            // Restore state.
            this.restore(state);
            //Transfer automatic fields from template.
            let g : PdfGraphics = template.graphics;
            if (g != null) {
                for (let index : number = 0; index < g.automaticFields.automaticFields.length; index++) {
                    let fieldInfo : PdfAutomaticFieldInfo = g.automaticFields.automaticFields[index] as PdfAutomaticFieldInfo;
                    let newLocation : PointF = new PointF(fieldInfo.location.x + location.x, fieldInfo.location.y + location.y);
                    let scalingX : number = template.size.width == 0 ? 0 : size.width / template.size.width;
                    let scalingY : number = template.size.height == 0 ? 0 : size.height / template.size.height;
                    this.automaticFields.add(new PdfAutomaticFieldInfo(fieldInfo.field, newLocation, scalingX, scalingY));
                    this.page.dictionary.modify();
                }
            }
            this.getResources.getResources().requireProcedureSet(this.procedureSets.imageB);
            this.getResources.getResources().requireProcedureSet(this.procedureSets.imageC);
            this.getResources.getResources().requireProcedureSet(this.procedureSets.imageI);
            this.getResources.getResources().requireProcedureSet(this.procedureSets.text);
        }
    }
    // DrawString overloads
    /**
     * `Draws the specified text` at the specified location and size with string format.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * // set font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // set pen
     * let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
     * // set brush
     * let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * // set rectangle bounds
     * let rectangle : RectangleF = new RectangleF({x : 10, y : 10}, {width : 200, height : 200});
     * // set the format for string
     * let stringFormat : PdfStringFormat = new PdfStringFormat();
     * // set the text alignment
     * stringFormat.alignment = PdfTextAlignment.Center;
     * // set the vertical alignment
     * stringFormat.lineAlignment = PdfVerticalAlignment.Middle;
     * //
     * // draw the text
     * page1.graphics.drawString('Hello World', font, pen, brush, rectangle, stringFormat);
     * //
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param s Input text.
     * @param font Font of the text.
     * @param pen Color of the text.
     * @param brush Color of the text.
     * @param layoutRectangle RectangleF structure that specifies the bounds of the drawn text.
     * @param format String formatting information.
     */
    public drawString(s : string, font : PdfFont, pen : PdfPen, brush : PdfBrush, x : number, y : number, format : PdfStringFormat) : void
    public drawString(s : string, font : PdfFont, pen : PdfPen, brush : PdfBrush, x : number, y : number, width : number, height : number, format : PdfStringFormat) : void
    /* tslint:disable */
    /**
     * @public
     */
    public drawString(arg1 : string, arg2 : PdfFont, arg3 : PdfPen, arg4 : PdfBrush, arg5 : number, arg6 : number, arg7 : number|PdfStringFormat, arg8 ?: number, arg9 ?: PdfStringFormat) : void {
        if (typeof arg1 === 'string' && arg2 instanceof PdfFont && (arg3 instanceof PdfPen || arg3 === null) && (arg4 instanceof PdfBrush || arg4 === null) && typeof arg5 === 'number' && typeof arg6 === 'number' && (arg7 instanceof PdfStringFormat || arg7 === null)  && typeof arg8 === 'undefined') {
            this.isOverloadWithPosition = true;
            this.drawString(arg1, arg2, arg3, arg4, arg5, arg6, (this.clientSize.width - arg5), 0, arg7 as PdfStringFormat);
        } else {
            let temparg3 : PdfPen = arg3 as PdfPen;
            let temparg4 : PdfBrush = arg4 as PdfBrush;
            let temparg5 : number = arg5 as number;
            let temparg6 : number = arg6 as number;
            let temparg7 : number = arg7 as number;
            let temparg8 : number = arg8 as number;
            let temparg9 : PdfStringFormat = arg9 as PdfStringFormat;
            let layouter : PdfStringLayouter = new PdfStringLayouter();
            let result : PdfStringLayoutResult = layouter.layout(arg1, arg2, temparg9, new SizeF(temparg7, temparg8), this.isOverloadWithPosition, this.clientSize);
            if (!result.empty) {
                let rect : RectangleF = this.checkCorrectLayoutRectangle(result.actualSize, temparg5, temparg6, temparg9);
                if (temparg7 <= 0) {
                    temparg5 = rect.x;
                    temparg7 = rect.width;
                }
                if (temparg8 <= 0) {
                    temparg6 = rect.y;
                    temparg8 = rect.height;
                }
                this.drawStringLayoutResult(result, arg2, temparg3, temparg4, new RectangleF(temparg5, temparg6, temparg7, temparg8), temparg9);
                this.isEmfTextScaled = false;
                this.emfScalingFactor = new SizeF(0, 0);
            }
            this.getResources.getResources().requireProcedureSet(this.procedureSets.text);
            this.isNormalRender = true;
            this.pdfStringLayoutResult = result;
            this.isUseFontSize = false;
        }
    }/* tslint:enable */
    //DrawLine overloads
    /**
     * `Draws a line` connecting the two points specified by the coordinate pairs.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * //
     * // draw the line
     * page1.graphics.drawLine(new PdfPen(new PdfColor(0, 0, 255)), new PointF(10, 20), new PointF(100, 200));
     * //
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param pen Color of the line.
     * @param point1 PointF structure that represents the first point to connect.
     * @param point2 PointF structure that represents the second point to connect.
     */
    public drawLine(pen : PdfPen, point1 : PointF, point2 : PointF) : void
    /**
     * `Draws a line` connecting the two points specified by the coordinate pairs.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * //
     * // draw the line
     * page1.graphics.drawLine(new PdfPen(new PdfColor(0, 0, 255)), 10, 20, 100, 200);
     * //
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param pen Color of the line.
     * @param x1 The x-coordinate of the first point.
     * @param y1 The y-coordinate of the first point.
     * @param x2 The x-coordinate of the second point.
     * @param y2 The y-coordinate of the second point.
     */
    public drawLine(pen : PdfPen, x1 : number, y1 : number, x2 : number, y2 : number) : void
    public drawLine(arg1 : PdfPen, arg2 : number | PointF, arg3 : number | PointF, arg4 ?: number, arg5 ?: number) : void {
        if (arg2 instanceof PointF) {
            let temparg2 : PointF = arg2 as PointF;
            let temparg3 : PointF = arg3 as PointF;
            this.drawLine(arg1, temparg2.x, temparg2.y, temparg3.x, temparg3.y);
        } else {
            let temparg2 : number = arg2 as number;
            let temparg3 : number = arg3 as number;
            let temparg4 : number = arg4 as number;
            let temparg5 : number = arg5 as number;
            this.stateControl(arg1, null, null);
            let sw : PdfStreamWriter = this.streamWriter;
            sw.beginPath(temparg2, temparg3);
            sw.appendLineSegment(temparg4, temparg5);
            sw.strokePath();
            this.getResources.getResources().requireProcedureSet(this.procedureSets.pdf);
        }
    }

    // DrawRectangle overloads
    /**
     * `Draws a rectangle` specified by a pen, a coordinate pair, a width, and a height.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // create pen for draw rectangle
     * let pen : PdfPen = new PdfPen(new PdfColor(238, 130, 238));
     * //
     * // draw rectangle
     * page1.graphics.drawRectangle(pen, 10, 10, 50, 100);
     * //
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param pen Color of the rectangle.
     * @param x The x-coordinate of the upper-left corner of the rectangle to draw.
     * @param y The y-coordinate of the upper-left corner of the rectangle to draw.
     * @param width Width of the rectangle to draw.
     * @param height Height of the rectangle to draw.
     */
    public drawRectangle(pen : PdfPen, x : number, y : number, width : number, height : number) : void
    /**
     * `Draws a rectangle` specified by a brush, coordinate pair, a width, and a height.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // create brush for draw rectangle
     * let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(238, 130, 238));
     * //
     * // draw rectangle
     * page1.graphics.drawRectangle(brush, 10, 10, 50, 100);
     * //
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param brush Color of the rectangle.
     * @param x The x-coordinate of the upper-left corner of the rectangle to draw.
     * @param y The y-coordinate of the upper-left corner of the rectangle to draw.
     * @param width Width of the rectangle to draw.
     * @param height Height of the rectangle to draw.
     */
    public drawRectangle(brush : PdfBrush, x : number, y : number, width : number, height : number) : void
    /**
     * `Draws a rectangle` specified by a pen, a coordinate pair, a width, and a height.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // create brush for draw rectangle
     * let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(238, 130, 238));
     * // set pen
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
     * //
     * // draw rectangle
     * page1.graphics.drawRectangle(pen, brush, 10, 10, 50, 100);
     * //
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param pen A Pen that determines the color, width, and style of the rectangle.
     * @param brush Color of the rectangle.
     * @param x The x-coordinate of the upper-left corner of the rectangle to draw.
     * @param y The y-coordinate of the upper-left corner of the rectangle to draw.
     * @param width Width of the rectangle to draw.
     * @param height Height of the rectangle to draw.
     */
    public drawRectangle(pen : PdfPen, brush : PdfBrush, x : number, y : number, width : number, height : number) : void
    /* tslint:disable */
    public drawRectangle(arg1 : PdfPen|PdfBrush, arg2 : PdfBrush|number, arg3 : number, arg4 : number, arg5 : number, arg6 ?: number) : void {
        if ( arg1 instanceof PdfPen && typeof arg2 === 'number' ) {
            let temparg3 : number = arg3 as number;
            this.drawRectangle(arg1, null, arg2, temparg3, arg4, arg5);
        } else if ( arg1 instanceof PdfBrush && typeof arg2 === 'number' ) {
            let temparg3 : number = arg3 as number;
            this.drawRectangle(null, arg1, arg2, temparg3, arg4, arg5);
        } else {
            let temparg3 : number = arg3 as number;
            let temparg4 : number = arg4 as number;
            let temparg5 : number = arg5 as number;
            let temparg6 : number = arg6 as number;
            if ((arg2 instanceof PdfTilingBrush)) {
                this.bCSInitialized = false;
                let xOffset: number = (this.matrix.matrix.offsetX + temparg3);
                let yOffset: number;
                if (((this.layer != null) && (this.layer.page != null))) {
                    yOffset = ((this.layer.page.size.height - this.matrix.matrix.offsetY) + temparg4);
                } else {
                    yOffset = ((this.clientSize.height - this.matrix.matrix.offsetY) + temparg4);
                }
                (<PdfTilingBrush>(arg2)).location = new PointF(xOffset, yOffset);
                (<PdfTilingBrush>(arg2)).graphics.colorSpace = this.colorSpace;
            } else if ((arg2 instanceof PdfGradientBrush)) {
                (arg2 as PdfGradientBrush).colorSpace = this.colorSpace;
            }
            if (arg2 instanceof PdfSolidBrush && (<PdfSolidBrush>arg2).color.isEmpty) {
                arg2 = null;
            }
            let temparg1 : PdfPen = <PdfPen>arg1;
            let temparg2 : PdfBrush = <PdfBrush>arg2;
            this.stateControl(temparg1, temparg2, null);
            this.streamWriter.appendRectangle(temparg3, temparg4, temparg5, temparg6);
            this.drawPathHelper(temparg1, temparg2, false);
        }
    }

    /**
     * `Draws the path`.
     * @private
     */
    private drawPathHelper(pen : PdfPen, brush : PdfBrush, needClosing : boolean) : void
    /**
     * `Draws the path`.
     * @private
     */
    private drawPathHelper(pen : PdfPen, brush : PdfBrush, fillMode : PdfFillMode, needClosing : boolean) : void
    private drawPathHelper(arg1 : PdfPen, arg2 : PdfBrush, arg3 : PdfFillMode|boolean, arg4 ?: boolean) : void {
        if (typeof arg3 === 'boolean') {
            let temparg3 : boolean = arg3 as boolean;
            this.drawPathHelper(arg1, arg2, PdfFillMode.Winding, temparg3);
        } else {
            let temparg3 : PdfFillMode = arg3 as PdfFillMode;
            let temparg4 : boolean = arg4 as boolean;
            let isPen : boolean = arg1 != null;
            let isBrush : boolean = arg2 != null;
            let isEvenOdd : boolean = (temparg3 === PdfFillMode.Alternate);
            if (isPen && isBrush) {
                this.streamWriter.fillStrokePath(isEvenOdd);
            } else if (!isPen && !isBrush) {
                this.streamWriter.endPath();
            } else if (isPen) {
                this.streamWriter.strokePath();
            } else {
                this.streamWriter.fillPath(isEvenOdd);
            }
        }
    }
       /* tslint:disable */
    //DrawImage overloads
    /**
     * `Draws the specified image`, using its original physical size, at the location specified by a coordinate pair.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // add a page to the document.
     * let page1 : PdfPage = document.pages.add();
     * // base64 string of an image
     * let imageString : string = '/9j/3+2w7em7HzY/KiijFw … 1OEYRUYrQ45yc5OUtz/9k=';
     * // load the image from the base64 string of original image.
     * let image : PdfBitmap = new PdfBitmap(imageString);
     * //
     * // draw the image
     * page1.graphics.drawImage(image, 10, 10);
     * //
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param image PdfImage to draw.
     * @param x The x-coordinate of the upper-left corner of the drawn image.
     * @param y The y-coordinate of the upper-left corner of the drawn image.
     */
    public drawImage(image : PdfImage, x : number, y : number) : void
    /**
     * `Draws the specified image`, using its original physical size, at the location specified by a coordinate pair.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // add a page to the document.
     * let page1 : PdfPage = document.pages.add();
     * // base64 string of an image
     * let imageString : string = '/9j/3+2w7em7HzY/KiijFw … 1OEYRUYrQ45yc5OUtz/9k=';
     * // load the image from the base64 string of original image.
     * let image : PdfBitmap = new PdfBitmap(imageString);
     * //
     * // draw the image
     * page1.graphics.drawImage(image, 0, 0, 100, 100);
     * //
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param image PdfImage to draw.
     * @param x The x-coordinate of the upper-left corner of the drawn image.
     * @param y The y-coordinate of the upper-left corner of the drawn image.
     * @param width Width of the drawn image.
     * @param height Height of the drawn image.
     */
    public drawImage(image : PdfImage, x : number, y : number, width : number, height : number) : void
    /* tslint:disable */
    public drawImage(arg1 : PdfImage, arg2 : number, arg3 : number, arg4 ?: number, arg5 ?: number) : void {/* tslint:enable */
        if (typeof arg2 === 'number' && typeof arg3 === 'number' && typeof arg4 === 'undefined') {
            let size : SizeF = arg1.physicalDimension;
            this.drawImage(arg1, arg2, arg3, size.width, size.height);
        } else {
            let temparg2 : number = arg2 as number;
            let temparg3 : number = arg3 as number;
            let temparg4 : number = arg4 as number;
            let temparg5 : number = arg5 as number;
            arg1.save();
            let matrix : PdfTransformationMatrix = new PdfTransformationMatrix();
            this.getTranslateTransform(temparg2, (temparg3 + temparg5), matrix);
            this.getScaleTransform(arg4, arg5, matrix);
            this.pdfStreamWriter.write('q');
            this.pdfStreamWriter.modifyCtm(matrix);
            // Output template.
            let resources : PdfResources = this.getResources.getResources();
            if (typeof this.pageLayer !== 'undefined' && (this.page as PdfPage) != null) {
                resources.document = (this.page as PdfPage).document;
            }
            let name : PdfName = resources.getName(arg1);
            if (typeof this.pageLayer !== 'undefined') {
                this.page.setResources(resources);
            }
            this.pdfStreamWriter.executeObject(name);
            this.pdfStreamWriter.write(Operators.restoreState);
            this.pdfStreamWriter.write(Operators.newLine);
            let resource : PdfResources = this.getResources.getResources();
            resource.requireProcedureSet(this.procedureSets.imageB);
            resource.requireProcedureSet(this.procedureSets.imageC);
            resource.requireProcedureSet(this.procedureSets.imageI);
            resource.requireProcedureSet(this.procedureSets.text);
        }
    }
    //Implementation
    /* tslint:disable */
    /**
     * Returns `bounds` of the line info.
     * @private
     */
    public getLineBounds(lineIndex : number, result : PdfStringLayoutResult, font : PdfFont, layoutRectangle : RectangleF, format : PdfStringFormat) : RectangleF {/* tslint:enable */
        let bounds : RectangleF;
        if (!result.empty && lineIndex < result.lineCount && lineIndex >= 0) {
            let line : LineInfo = result.lines[lineIndex];
            let vShift : number = this.getTextVerticalAlignShift(result.actualSize.height, layoutRectangle.height, format);
            let y : number = vShift + layoutRectangle.y + (result.lineHeight * lineIndex);
            let lineWidth : number = line.width;
            let hShift : number = this.getHorizontalAlignShift(lineWidth, layoutRectangle.width, format);
            let lineIndent : number = this.getLineIndent(line, format, layoutRectangle, (lineIndex === 0));
            hShift += (!this.rightToLeft(format)) ? lineIndent : 0;
            let x : number = layoutRectangle.x + hShift;
            /* tslint:disable */
            let width : number = (!this.shouldJustify(line, layoutRectangle.width, format)) ? lineWidth - lineIndent : layoutRectangle.width - lineIndent;/* tslint:enable */
            let height : number = result.lineHeight;
            bounds = new RectangleF(x, y, width, height);
        } else {
            bounds = new RectangleF(0, 0, 0, 0);
        }
        return bounds;
    }
    /**
     * Creates `lay outed rectangle` depending on the text settings.
     * @private
     */
    public checkCorrectLayoutRectangle(textSize : SizeF, x : number, y : number, format : PdfStringFormat) : RectangleF {
        let layoutedRectangle : RectangleF = new RectangleF(x, y, textSize.width, textSize.width);
        if (format != null) {
            switch (format.alignment) {
                case PdfTextAlignment.Center:
                    layoutedRectangle.x -= layoutedRectangle.width / 2;
                    break;
                case PdfTextAlignment.Right:
                    layoutedRectangle.x -= layoutedRectangle.width;
                    break;
            }
            switch (format.lineAlignment) {
                case PdfVerticalAlignment.Middle:
                    layoutedRectangle.y -= layoutedRectangle.height / 2;
                    break;
                case PdfVerticalAlignment.Bottom:
                    layoutedRectangle.y -= layoutedRectangle.height;
                    break;
            }
        }
        return layoutedRectangle;
    }
    /**
     * Sets the `layer` for the graphics.
     * @private
     */
    public setLayer(layer : PdfPageLayer) : void {
        this.pageLayer = layer;
        let page : PdfPage = layer.page as PdfPage;
        if (page != null && typeof page !== 'undefined') {
            page.beginSave = this.pageSave;
        }
    }
    /**
     * Adding page number field before page saving.
     * @private
     */
    /* tslint:disable */
    public pageSave(page : PdfPage) : void {
        if (page.graphics.automaticFields != null) {
            for (let i : number = 0; i < page.graphics.automaticFields.automaticFields.length; i++) {
                let fieldInfo : PdfAutomaticFieldInfo = page.graphics.automaticFields.automaticFields[i] as PdfAutomaticFieldInfo;
                fieldInfo.field.performDraw(page.graphics, fieldInfo.location, fieldInfo.scalingX, fieldInfo.scalingY);
            }
        }
    }
    /**
     * `Draws a layout result`.
     * @private
     */
    public drawStringLayoutResult(result : PdfStringLayoutResult, font : PdfFont, pen : PdfPen, brush : PdfBrush, layoutRectangle : RectangleF, format : PdfStringFormat) : void {
        if (!result.empty) {
            this.applyStringSettings(font, pen, brush, format, layoutRectangle);
            // Set text scaling
            let textScaling : number = (format != null) ? format.horizontalScalingFactor : 100.0;
            if (textScaling !== this.previousTextScaling && !this.isEmfTextScaled) {
                this.pdfStreamWriter.setTextScaling(textScaling);
                this.previousTextScaling = textScaling;
            }
            let height : number = (format == null || format.lineSpacing === 0) ? font.height : format.lineSpacing + font.height;
            let subScript : boolean = (format != null && format.subSuperScript === PdfSubSuperScript.SubScript);
            let shift : number = 0;
            shift = (subScript) ? height - (font.height + font.metrics.getDescent(format)) : (height - font.metrics.getAscent(format));
            this.shift = shift;
            this.pdfStreamWriter.startNextLine(layoutRectangle.x, layoutRectangle.y - shift);
            this.pdfStreamWriter.setLeading(+height);
            let resultHeight : number = 0;
            let remainingString : string = '';
            for (let i : number = 0; i < result.lines.length; i++) {
                resultHeight += result.lineHeight;
                if ((layoutRectangle.y + resultHeight) > this.clientSize.height) {
                    this.startCutIndex = i;
                    break;
                }
            }
            for (let j : number = this.startCutIndex; (j < result.lines.length && j >= 0); j++) {
                remainingString += result.lines[j].text;
            }
            let bounds : RectangleF = new RectangleF(layoutRectangle.x, layoutRectangle.y, layoutRectangle.width, layoutRectangle.height);
            this.drawLayoutResult(result, font, format, layoutRectangle);
            this.underlineStrikeoutText(pen, brush, result, font, bounds, format);
            this.isEmfPlus = false;
            this.isUseFontSize = false;
            if (this.startCutIndex !== -1) {
                let page : PdfPage = this.getNextPage();
                page.graphics.drawString(remainingString, font, pen, brush, layoutRectangle.x, 0, layoutRectangle.width, 0, format);
            }
        } else {
            throw new Error('ArgumentNullException:result');
        }
    }
    /**
     * Gets the `next page`.
     * @private
     */
    public getNextPage() : PdfPage {
        let section : PdfSection = this.currentPage.section;
        let nextPage : PdfPage = null;
        let index : number = section.indexOf(this.currentPage);
        if (index === section.count - 1) {
            nextPage = (section.add() as PdfPage);
        } else {
            nextPage = (section.getPages()[index + 1] as PdfPage);
        }
        return nextPage;
    }
    /**
     * `Sets the clipping` region of this Graphics to the rectangle specified by a RectangleF structure.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // create PDF graphics for the page
     * let graphics : PdfGraphics = page1.graphics;
     * // set the font
     * let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
     * // create black brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * //
     * // set clipping with rectangle bounds
     * graphics.setClip(new RectangleF({x : 10, y : 80}, {width : 150 , height : 15}));
     * //
     * // draw the text after clipping
     * graphics.drawString('Text after clipping', font, blackBrush, new PointF(10, 80));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param rectangle RectangleF structure that represents the new clip region.
     */
    public setClip(rectangle : RectangleF) : void
    /**
     * `Sets the clipping` region of this Graphics to the result of the specified operation combining the current clip region and the rectangle specified by a RectangleF structure.
     * @private
     */
    public setClip(rectangle : RectangleF, mode : PdfFillMode) : void
    public setClip(rectangle : RectangleF, mode ?: PdfFillMode) : void {
        if (typeof mode === 'undefined') {
            this.setClip(rectangle, PdfFillMode.Winding);
        } else {
            this.pdfStreamWriter.appendRectangle(rectangle);
            this.pdfStreamWriter.clipPath((mode === PdfFillMode.Alternate));
        }
    }
    /**
     * Applies all the `text settings`.
     * @private
     */
    private applyStringSettings(font : PdfFont, pen : PdfPen, brush : PdfBrush, format : PdfStringFormat, bounds : RectangleF) : void {
        if ( brush instanceof PdfTilingBrush) {
            this.bCSInitialized = false;
            (<PdfTilingBrush>brush).graphics.colorSpace = this.colorSpace;
        } else if ((brush instanceof PdfGradientBrush)) {
            this.bCSInitialized = false;
            (<PdfGradientBrush>brush).colorSpace = this.colorSpace;
        }
        let setLineWidth : boolean = false;
        let tm : TextRenderingMode = this.getTextRenderingMode(pen, brush, format);
        this.stateControl(pen, brush, font, format);
        this.pdfStreamWriter.beginText();
        if ((tm) !== this.previousTextRenderingMode) {
            this.pdfStreamWriter.setTextRenderingMode(tm);
            this.previousTextRenderingMode = tm;
        }
        // Set character spacing.
        let cs : number = (format != null) ? format.characterSpacing : 0;
        if (cs !== this.previousCharacterSpacing && !this.isEmfTextScaled) {
            this.pdfStreamWriter.setCharacterSpacing(cs);
            this.previousCharacterSpacing = cs;
        }
        // Set word spacing.
        // NOTE: it works only if the space code is equal to 32 (0x20).
        let ws : number = (format != null) ? format.wordSpacing : 0;
        if (ws !== this.previousWordSpacing) {
            this.pdfStreamWriter.setWordSpacing(ws);
            this.previousWordSpacing = ws;
        }
    }
    /**
     * Calculates `shift value` if the text is vertically aligned.
     * @private
     */
    public getTextVerticalAlignShift(textHeight : number, boundsHeight : number, format : PdfStringFormat) : number {
        let shift : number = 0;
        if (boundsHeight >= 0 && format != null && format.lineAlignment !== PdfVerticalAlignment.Top) {
            switch (format.lineAlignment) {
                case PdfVerticalAlignment.Middle:
                    shift = (boundsHeight - textHeight) / 2;
                    break;
                case PdfVerticalAlignment.Bottom:
                    shift = boundsHeight - textHeight;
                    break;
            }
        }
        return shift;
    }
    /* tslint:disable */
    /**
     * `Draws layout result`.
     * @private
     */
    private drawLayoutResult(result : PdfStringLayoutResult, font : PdfFont, format : PdfStringFormat, layoutRectangle : RectangleF) : void {/* tslint:enable */
        let vAlignShift : number = this.getTextVerticalAlignShift(result.actualSize.height, layoutRectangle.height, format);
        if (vAlignShift !== 0) {
            this.pdfStreamWriter.startNextLine(0, vAlignShift);
        }
        let ttfFont : PdfTrueTypeFont = font as PdfTrueTypeFont;
        let unicode : boolean = (ttfFont != null && ttfFont.isUnicode);
        let embed : boolean = (ttfFont != null && ttfFont.isEmbedFont);
        let lines : LineInfo[] = result.lines;
        for (let i : number = 0, len : number = lines.length; (i < len && i !== this.startCutIndex); i++) {
            let lineInfo : LineInfo = lines[i];
            let line : string = lineInfo.text;
            let lineWidth : number = lineInfo.width;
            let hAlignShift : number = this.getHorizontalAlignShift(lineWidth, layoutRectangle.width, format);
            let lineIndent : number = this.getLineIndent(lineInfo, format, layoutRectangle, (i === 0));
            hAlignShift += (!this.rightToLeft(format)) ? lineIndent : 0;
            if (hAlignShift !== 0 && !this.isEmfTextScaled) {
                this.pdfStreamWriter.startNextLine(hAlignShift, 0);
            }
            if (unicode) {
                this.drawUnicodeLine(lineInfo, layoutRectangle, font, format);
            } else {
                this.drawAsciiLine(lineInfo, layoutRectangle, font, format);
            }
            if (hAlignShift !== 0 && !this.isEmfTextScaled) {
                this.pdfStreamWriter.startNextLine(-hAlignShift, 0);
            }
            if (this.isOverloadWithPosition && lines.length > 1) {
                this.pdfStreamWriter.startNextLine(-(layoutRectangle.x), 0);
                layoutRectangle.x = 0;
                layoutRectangle.width = this.clientSize.width;
                this.isOverloadWithPosition = false;
                this.isPointOverload = true;
            }
        }
        this.getResources.getResources().requireProcedureSet(this.procedureSets.text);
        if (vAlignShift !== 0) {
            this.pdfStreamWriter.startNextLine(0, -(vAlignShift - result.lineHeight));
        }
        this.pdfStreamWriter.endText();

    }
    /**
     * `Draws Ascii line`.
     * @private
     */
    private drawAsciiLine(lineInfo : LineInfo, layoutRectangle : RectangleF, font : PdfFont, format : PdfStringFormat) : void {
        this.justifyLine(lineInfo, layoutRectangle.width, format);
        let value : string = '';
        if (lineInfo.text.indexOf('(') !== -1 || lineInfo.text.indexOf(')') !== -1) {
            for (let i : number = 0; i < lineInfo.text.length; i ++) {
                if (lineInfo.text[i] === '(') {
                    value += '\\\(';
                } else if (lineInfo.text[i] === ')') {
                    value += '\\\)';
                } else {
                    value += lineInfo.text[i];
                }
            }
        }
        if (value === '') {
            value = lineInfo.text;
        }
        let line : string = '(' + value + ')';
        this.pdfStreamWriter.showNextLineText(new PdfString(line));
    }
    /**
     * Draws unicode line.
     * @private
     */
    private drawUnicodeLine(lineInfo : LineInfo, layoutRectangle : RectangleF, font : PdfFont, format : PdfStringFormat) : void {
        let line : string = lineInfo.text;
        let lineWidth : number = lineInfo.width;
        let rtl : boolean = (format !== null && typeof format !== 'undefined' && format.rightToLeft);
        let useWordSpace : boolean = (format !== null && typeof format !== 'undefined' && (format.wordSpacing !== 0 || format.alignment === PdfTextAlignment.Justify));
        let ttfFont : PdfTrueTypeFont = font as PdfTrueTypeFont;
        let wordSpacing : number = this.justifyLine(lineInfo, layoutRectangle.width, format);
        let rtlRender : RtlRenderer = new RtlRenderer();
        if (rtl || (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.None)) {
                let blocks : string[] = null;
                let rightAlign : boolean  = (format !== null && typeof format !== 'undefined' && format.alignment === PdfTextAlignment.Right);
                if (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.None) {
                    /* tslint:disable-next-line:max-line-length */
                    blocks = rtlRender.layout(line, ttfFont, (format.textDirection === PdfTextDirection.RightToLeft) ? true : false, useWordSpace, format);
                } else {
                    blocks = rtlRender.layout(line, ttfFont, rightAlign, useWordSpace, format);
                }
                let words : string[] = null;
                if (blocks.length > 1) {
                    if (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.None) {
                        /* tslint:disable-next-line:max-line-length */
                        words = rtlRender.splitLayout(line, ttfFont, (format.textDirection === PdfTextDirection.RightToLeft) ? true : false, useWordSpace, format);
                    } else {
                        words = rtlRender.splitLayout(line, ttfFont, rightAlign, useWordSpace, format);
                    }
                } else {
                    words = [line] ;
                }
                this.drawUnicodeBlocks(blocks, words, ttfFont, format, wordSpacing);
            } else {
        if (useWordSpace) {
            let result : { tokens : string[], words : string[] } = this.breakUnicodeLine(line, ttfFont, null);
            let blocks : string[] = result.tokens;
            let words : string[] = result.words;
            this.drawUnicodeBlocks(blocks, words, ttfFont, format, wordSpacing);
        } else {
            let token : string = this.convertToUnicode(line, ttfFont);
            let value : PdfString = this.getUnicodeString(token);
            this.streamWriter.showNextLineText(value);
        }
    }
}
    /**
     * Draws array of unicode tokens.
     */
    /* tslint:disable */
    private drawUnicodeBlocks(blocks : string[], words : string[], font : PdfTrueTypeFont, format : PdfStringFormat, wordSpacing : number) : void {
        /* tslint:enable */
        if (blocks == null) {
            throw new Error('Argument Null Exception : blocks');
        }
        if (words == null) {
            throw new Error('Argument Null Exception : words');
        }
        if (font == null) {
            throw new Error('Argument Null Exception : font');
        }
        this.streamWriter.startNextLine();
        let x : number = 0;
        let xShift : number = 0;
        let firstLineIndent : number = 0;
        let paragraphIndent : number = 0;
        try {
            if (format !== null && typeof format !== 'undefined') {
                firstLineIndent = format.firstLineIndent;
                paragraphIndent = format.paragraphIndent;
                format.firstLineIndent = 0;
                format.paragraphIndent = 0;
            }
            let spaceWidth : number = font.getCharWidth(StringTokenizer.whiteSpace, format) + wordSpacing;
            let characterSpacing : number = (format != null) ? format.characterSpacing : 0;
            let wordSpace : number = (format !== null && typeof format !== 'undefined' && wordSpacing === 0) ? format.wordSpacing : 0;
            spaceWidth += characterSpacing + wordSpace;
            for (let i : number = 0; i < blocks.length; i++) {
                let token : string = blocks[i];
                let word : string = words[i];
                let tokenWidth : number = 0;
                if (x !== 0) {
                    this.streamWriter.startNextLine(x, 0);
                }
                if (word.length > 0) {
                    tokenWidth += /*Utils.Round(*/ font.measureString(word, format).width /*)*/;
                    tokenWidth += characterSpacing;
                    let val : PdfString = this.getUnicodeString(token);
                    this.streamWriter.showText(val);
                }
                if (i !== blocks.length - 1) {
                    x = tokenWidth + spaceWidth;
                    xShift += x;
                }
            }
            // Rolback current line position.
            if (xShift > 0) {
                this.streamWriter.startNextLine(-xShift, 0);
            }
        }
        finally {
            if (format !== null && typeof format !== 'undefined') {
                format.firstLineIndent = firstLineIndent;
                format.paragraphIndent = paragraphIndent;
            }
        }
    }
    /**
     * Breakes the unicode line to the words and converts symbols to glyphs.
     */
    private breakUnicodeLine(line : string, ttfFont : PdfTrueTypeFont, words : string[]) : {tokens : string[], words : string[]} {
        if (line === null) {
            throw new Error('Argument Null Exception : line');
        }
        words = line.split(null);
        let tokens : string[] = [];
        for (let i : number = 0; i < words.length; i++) {
            // Reconvert string according to unicode standard.
            let word : string = words[i];
            let token : string = this.convertToUnicode(word, ttfFont);
            tokens[i] = token;
        }
        return { tokens : tokens, words : words };
    }
    /**
     * Creates PdfString from the unicode text.
     */
    private getUnicodeString(token : string) : PdfString {
        if (token === null) {
            throw new Error('Argument Null Exception : token');
        }
        let val : PdfString = new PdfString(token);
        val.converted = true;
        val.encode = InternalEnum.ForceEncoding.Ascii;
        return val;
    }
    /**
     * Converts to unicode format.
     */
    private convertToUnicode(text : string, ttfFont : PdfTrueTypeFont) : string {
        let token : string = null;
        if (text == null) {
            throw new Error('Argument Null Exception : text');
        }
        if (ttfFont == null) {
            throw new Error('Argument Null Exception : ttfFont');
        }
        if (ttfFont.fontInternal instanceof UnicodeTrueTypeFont) {
            let ttfReader : TtfReader = (ttfFont.fontInternal as UnicodeTrueTypeFont).ttfReader;
            ttfFont.setSymbols(text);
            token = ttfReader.convertString(text);
            let bytes : number[] = PdfString.toUnicodeArray(token, false);
            token = PdfString.byteToString(bytes);
        }
        return token;
    }
    /**
     * `Justifies` the line if needed.
     * @private
     */
    private justifyLine(lineInfo : LineInfo, boundsWidth : number, format : PdfStringFormat) : number {
        let line : string = lineInfo.text;
        let lineWidth : number = lineInfo.width;
        let shouldJustify : boolean = this.shouldJustify(lineInfo, boundsWidth, format);
        let hasWordSpacing : boolean = (format != null && format.wordSpacing !== 0);
        let symbols : string[] = StringTokenizer.spaces;
        let whitespacesCount : number = StringTokenizer.getCharsCount(line, symbols);
        let wordSpace : number = 0;
        if (shouldJustify) {
            // Correct line width.
            if (hasWordSpacing) {
                lineWidth -= (whitespacesCount * format.wordSpacing);
            }
            let difference : number = boundsWidth - lineWidth;
            wordSpace = difference / whitespacesCount;
            this.pdfStreamWriter.setWordSpacing(wordSpace);
        } else {
            // If there is justifying, but the line shouldn't be justified, restore default word spacing.
            if (hasWordSpacing) {
                this.pdfStreamWriter.setWordSpacing(format.wordSpacing);
            } else {
                this.pdfStreamWriter.setWordSpacing(0);
            }
        }
        return wordSpace;
    }
    /**
     * `Reset` or reinitialize the current graphic value.
     * @private
     */
    public reset(size : SizeF) : void {
        this.canvasSize = size;
        this.streamWriter.clear();
        this.initialize();
        this.initializeCoordinates();
    }
    /**
     * Checks whether the line should be `justified`.
     * @private
     */
    private shouldJustify(lineInfo : LineInfo, boundsWidth : number, format : PdfStringFormat) : boolean {
        let line : string = lineInfo.text;
        let lineWidth : number = lineInfo.width;
        let justifyStyle : boolean = (format != null && format.alignment === PdfTextAlignment.Justify);
        let goodWidth : boolean = (boundsWidth >= 0 && lineWidth < boundsWidth);
        let symbols : string[] = StringTokenizer.spaces;
        let whitespacesCount : number = StringTokenizer.getCharsCount(line, symbols);
        let hasSpaces : boolean = (whitespacesCount > 0 && line[0] !== StringTokenizer.whiteSpace);
        let goodLineBreakStyle : boolean = ((lineInfo.lineType & LineType.LayoutBreak) > 0);
        /* tslint:disable */
        let shouldJustify : boolean = (justifyStyle && goodWidth && hasSpaces && (goodLineBreakStyle || format.alignment === PdfTextAlignment.Justify));/* tslint:enable */
        return shouldJustify;
    }
    /* tslint:disable */
    /**
     * Emulates `Underline, Strikeout` of the text if needed.
     * @private
     */
    private underlineStrikeoutText(pen : PdfPen, brush : PdfBrush, result : PdfStringLayoutResult, font : PdfFont, layoutRectangle : RectangleF, format : PdfStringFormat) : void {/* tslint:enable */
        if (font.underline || font.strikeout) {
            // Calculate line width.
            let linePen : PdfPen = this.createUnderlineStikeoutPen(pen, brush, font, format);
            if (linePen != null) {
                // Approximate line positions.
                let vShift : number = this.getTextVerticalAlignShift(result.actualSize.height, layoutRectangle.height, format);
                let underlineYOffset : number = 0;
                underlineYOffset = layoutRectangle.y + vShift + font.metrics.getAscent(format) + 1.5 * linePen.width;
                let strikeoutYOffset : number = layoutRectangle.y + vShift + font.metrics.getHeight(format) / 2 + 1.5 * linePen.width;
                let lines : LineInfo[] = result.lines;
                // Run through the text and draw lines.
                for (let i : number = 0, len : number = result.lineCount; i < len; i++) {
                    let lineInfo : LineInfo = lines[i];
                    let line : string = lineInfo.text;
                    let lineWidth : number = lineInfo.width;
                    let hShift : number = this.getHorizontalAlignShift(lineWidth, layoutRectangle.width, format);
                    let lineIndent : number = this.getLineIndent(lineInfo, format, layoutRectangle, (i === 0));
                    hShift += (!this.rightToLeft(format)) ? lineIndent : 0;
                    let x1 : number = layoutRectangle.x + hShift;
                    /* tslint:disable */
                    let x2 : number = (!this.shouldJustify(lineInfo, layoutRectangle.width, format)) ? x1 + lineWidth - lineIndent : x1 + layoutRectangle.width - lineIndent;
                    /* tslint:enable */
                    if (font.underline) {
                        let y : number = underlineYOffset;
                        this.drawLine(linePen, x1, y, x2, y);
                        underlineYOffset += result.lineHeight;
                    }
                    if (font.strikeout) {
                        let y : number = strikeoutYOffset;
                        this.drawLine(linePen, x1, y, x2, y);
                        strikeoutYOffset += result.lineHeight;
                    }
                    if (this.isPointOverload && lines.length > 1) {
                        layoutRectangle.x = 0;
                        layoutRectangle.width = this.clientSize.width;
                    }
                }
                this.isPointOverload = false;
            }
        }
    }
    /**
     * `Creates a pen` for drawing lines in the text.
     * @private
     */
    private createUnderlineStikeoutPen(pen : PdfPen, brush : PdfBrush, font : PdfFont, format : PdfStringFormat) : PdfPen {
        // Calculate line width.
        let lineWidth : number = font.metrics.getSize(format) / 20;
        let linePen : PdfPen = null;
        // Create a pen fo the lines.
        if (pen != null) {
            linePen = new PdfPen(pen.color, lineWidth);
        } else if (brush != null) {
            linePen = new PdfPen(brush, lineWidth);
        }
        return linePen;
    }
    /**
     * Return `text rendering mode`.
     * @private
     */
    private getTextRenderingMode(pen : PdfPen, brush : PdfBrush, format : PdfStringFormat) : TextRenderingMode {
        let tm : TextRenderingMode = TextRenderingMode.None;
        if (pen != null && brush != null) {
            tm = TextRenderingMode.FillStroke;
        } else if (pen != null) {
            tm = TextRenderingMode.Stroke;
        } else {
            tm = TextRenderingMode.Fill;
        }
        if (format != null && format.clipPath) {
            tm |= TextRenderingMode.ClipFlag;
        }
        return tm;
    }
    /**
     * Returns `line indent` for the line.
     * @private
     */
    private getLineIndent(lineInfo : LineInfo, format : PdfStringFormat, layoutBounds : RectangleF, firstLine : boolean) : number {
        let lineIndent : number = 0;
        let firstParagraphLine : boolean = ((lineInfo.lineType & LineType.FirstParagraphLine) > 0);
        if (format != null && firstParagraphLine) {
            lineIndent = (firstLine) ? format.firstLineIndent : format.paragraphIndent;
            lineIndent = (layoutBounds.width > 0) ? Math.min(layoutBounds.width, lineIndent) : lineIndent;
        }
        return lineIndent;
    }
    /**
     * Calculates shift value if the line is `horizontaly aligned`.
     * @private
     */
    private getHorizontalAlignShift(lineWidth : number, boundsWidth : number, format : PdfStringFormat) : number {
        let shift : number = 0;
        if (boundsWidth >= 0 && format != null && format.alignment !== PdfTextAlignment.Left) {
            switch (format.alignment) {
                case PdfTextAlignment.Center:
                    shift = (boundsWidth - lineWidth) / 2;
                    break;
                case PdfTextAlignment.Right:
                    shift = boundsWidth - lineWidth;
                    break;
            }
        }
        return shift;
    }
    /**
     * Gets or sets the value that indicates `text direction` mode.
     * @private
     */
    private rightToLeft(format : PdfStringFormat) : boolean {
        let rtl : boolean = (format !== null && typeof format !== 'undefined' && format.rightToLeft);
        if (format !== null && typeof format !== 'undefined') {
            if (format.textDirection !== PdfTextDirection.None && typeof format.textDirection !== 'undefined') {
                rtl = true;
            }
        }
        return rtl;
    }
    /**
     * Controls all `state modifications` and react repectively.
     * @private
     */
    private stateControl(pen : PdfPen, brush : PdfBrush, font : PdfFont) : void
    /**
     * Controls all `state modifications` and react respectively.
     * @private
     */
    private stateControl(pen : PdfPen, brush : PdfBrush, font : PdfFont, format : PdfStringFormat) : void
    private stateControl(pen : PdfPen, brush : PdfBrush, font : PdfFont, format ?: PdfStringFormat) : void {
        if (typeof format === 'undefined') {
            this.stateControl(pen, brush, font, null);
        } else {
            if (brush instanceof PdfGradientBrush) {
                this.bCSInitialized = false;
                (<PdfGradientBrush>brush).colorSpace = this.colorSpace;
            }
            if (brush instanceof PdfTilingBrush) {
                this.bCSInitialized = false;
                (<PdfTilingBrush>brush).graphics.colorSpace =  this.colorSpace;
            }
            let saveState : boolean = false;
            if (brush !== null) {
                let solidBrush : PdfSolidBrush = <PdfSolidBrush>brush;
                if (typeof this.pageLayer !== 'undefined' && this.pageLayer != null) {
                    if (this.colorSpaceChanged === false) {
                        this.lastDocumentCS = (this.pageLayer.page as PdfPage).document.colorSpace;
                        this.lastGraphicsCS = (this.pageLayer.page as PdfPage).graphics.colorSpace;
                        this.colorSpace = (this.pageLayer.page as PdfPage).document.colorSpace;
                        this.currentColorSpace = (this.pageLayer.page as PdfPage).document.colorSpace;
                        this.colorSpaceChanged = true;
                    }
                }
                this.initCurrentColorSpace(this.currentColorSpace);
            } else if (pen != null) {
                let pdfPen : PdfPen = pen as PdfPen;
                if (typeof this.pageLayer !== 'undefined' && this.pageLayer != null) {
                    /* tslint:disable */
                    this.colorSpace = (this.pageLayer.page as PdfPage).document.colorSpace;
                    this.currentColorSpace = (this.pageLayer.page as PdfPage).document.colorSpace;
                }
                this.initCurrentColorSpace(this.currentColorSpace);
            }
            this.penControl(pen, saveState);
            this.brushControl(brush, saveState);
            this.fontControl(font, format, saveState);
        }
    }
    /**
     * Initializes the `current color space`.
     * @private
     */
    private initCurrentColorSpace(colorspace : PdfColorSpace) : void {
        let re : PdfResources = this.getResources.getResources() as PdfResources;
        if (!this.bCSInitialized) {
            if (this.currentColorSpace != PdfColorSpace.GrayScale) {
                this.pdfStreamWriter.setColorSpace('Device' + this.currentColorSpaces[this.currentColorSpace], true);
                this.pdfStreamWriter.setColorSpace('Device' + this.currentColorSpaces[this.currentColorSpace], false);
                this.bCSInitialized = true;
            } else {
                this.pdfStreamWriter.setColorSpace('DeviceGray' , true);
                this.pdfStreamWriter.setColorSpace('DeviceGray' , false);
                this.bCSInitialized = true;
            }

        }
    }
    /**
     * Controls the `pen state`.
     * @private
     */
    private penControl(pen : PdfPen, saveState : boolean) : void {
        if (pen != null) {
            this.currentPen = pen;
            /* tslint:disable */
            pen.monitorChanges(this.currentPen, this.pdfStreamWriter, this.getResources, saveState, this.colorSpace, this.matrix.clone());
            /* tslint:enable */
            this.currentPen = pen.clone();
        }
    }
    /**
     * Controls the `brush state`.
     * @private
     */
    private brushControl(brush : PdfBrush, saveState : boolean) : void {
        if (brush != null && typeof brush !== 'undefined') {
            let b : PdfBrush = brush.clone();
            let lgb : PdfGradientBrush = <PdfGradientBrush>b;
            if (lgb !== null && typeof lgb !== 'undefined' && !(brush instanceof PdfSolidBrush) && !(brush instanceof PdfTilingBrush)) {
                let m: PdfTransformationMatrix = lgb.matrix;
                let matrix: PdfTransformationMatrix = this.matrix.clone();
                if ((m != null)) {
                    m.multiply(matrix);
                    matrix = m;
                }
                lgb.matrix = matrix;
            }
            this.currentBrush = lgb;
            let br: PdfSolidBrush = (<PdfSolidBrush>(brush));
            /* tslint:disable */
            b.monitorChanges(this.currentBrush, this.pdfStreamWriter, this.getResources, saveState, this.colorSpace);
            /* tslint:enable */
            this.currentBrush = brush;
            brush = null;
        }
    }
    /**
     * Saves the font and other `font settings`.
     * @private
     */
    private fontControl(font : PdfFont, format : PdfStringFormat, saveState : boolean) : void {
        if (font != null) {
            let curSubSuper : PdfSubSuperScript = (format != null) ? format.subSuperScript : PdfSubSuperScript.None;
            /* tslint:disable */
            let prevSubSuper : PdfSubSuperScript = (this.currentStringFormat != null) ? this.currentStringFormat.subSuperScript : PdfSubSuperScript.None; /* tslint:enable */
            if (saveState || font !== this.currentFont || curSubSuper !== prevSubSuper) {
                let resources : PdfResources = this.getResources.getResources();
                this.currentFont = font;
                this.currentStringFormat = format;
                let size : number = font.metrics.getSize(format);
                /* tslint:disable */
                this.isEmfTextScaled = false;
                let fontName : PdfName = resources.getName(font);
                this.pdfStreamWriter.setFont(font, fontName, size);
            }
        }
    }
    /**
     * `Sets the transparency` of this Graphics with the specified value for pen.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // create pen
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
     * //
     * // set transparency
     * page1.graphics.setTransparency(0.5);
     * //
     * // draw the rectangle after applying transparency
     * page1.graphics.drawRectangle(pen, new RectangleF({x : 0, y : 0}, {width : 100, height : 50}));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param alpha The alpha value for both pen and brush.
     */
    public setTransparency(alpha : number) : void
    /**
     * `Sets the transparency` of this Graphics with the specified value for pen and brush.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // create pen 
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
     * // set brush
     * let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * //
     * // set transparency
     * page1.graphics.setTransparency(0.8, 0.2);
     * //
     * // draw the rectangle after applying transparency
     * page1.graphics.drawRectangle(pen, brush, new RectangleF({x : 0, y : 0}, {width : 100, height : 50}));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param alphaPen The alpha value for pen.
     * @param alphaBrush The alpha value for brush.
     */
    public setTransparency(alphaPen : number, alphaBrush : number) : void
    /**
     * `Sets the transparency` of this Graphics with the specified PdfBlendMode.
     * @private
     */
    public setTransparency(alphaPen : number, alphaBrush : number, blendMode : PdfBlendMode) : void
    public setTransparency(arg1 : number, arg2 ?: number, arg3 ?: PdfBlendMode) : void {
        if (typeof arg2 === 'undefined') {
            this.istransparencySet = true;
            this.setTransparency(arg1, arg1, PdfBlendMode.Normal);
        } else if (typeof arg2 === 'number' && typeof arg3 === 'undefined') {
            this.setTransparency(arg1, arg2, PdfBlendMode.Normal);
        } else {
            if (this.trasparencies == null) {
                this.trasparencies = new TemporaryDictionary<TransparencyData, PdfTransparency>();
            }
            let transp : PdfTransparency = null;
            let td : TransparencyData = new TransparencyData(arg1, arg2, arg3);
            if (this.trasparencies.containsKey(td)) {
                transp = this.trasparencies.getValue(td) as PdfTransparency;
            }
            if (transp == null) {
                transp = new PdfTransparency(arg1, arg2, arg3);
                this.trasparencies.setValue(td, transp);
            }
            let resources : PdfResources = this.getResources.getResources();
            let name : PdfName = resources.getName(transp);
            let sw : PdfStreamWriter = this.streamWriter;
            sw.setGraphicsState(name);
        }
    }
    /**
     * Sets the `drawing area and translates origin`.
     * @private
     */
    public clipTranslateMargins(clipBounds : RectangleF) : void
    public clipTranslateMargins(x : number, y : number, left : number, top : number, right : number, bottom : number) : void
    public clipTranslateMargins(x : number | RectangleF, y ?: number, left ?: number, top ?: number, right ?: number, bottom ?: number) : void {
        if (x instanceof RectangleF && typeof y === 'undefined') {
            this.clipBounds = x as RectangleF;
            this.pdfStreamWriter.writeComment('Clip margins.');
            this.pdfStreamWriter.appendRectangle(x as RectangleF);
            this.pdfStreamWriter.closePath();
            this.pdfStreamWriter.clipPath(false);
            this.pdfStreamWriter.writeComment('Translate co-ordinate system.');
            this.translateTransform((x as RectangleF).x, (x as RectangleF).y);
        } else if (typeof x === 'number') {
            let clipArea : RectangleF = new RectangleF(left, top, this.size.width-left-right, this.size.height-top-bottom);
            this.clipBounds = clipArea;
            this.pdfStreamWriter.writeComment("Clip margins.");
            this.pdfStreamWriter.appendRectangle(clipArea);
            this.pdfStreamWriter.closePath();
            this.pdfStreamWriter.clipPath(false);
            this.pdfStreamWriter.writeComment("Translate co-ordinate system.");
            this.translateTransform(x, y);
        }
    }
    /**
     * `Updates y` co-ordinate.
     * @private
     */
    public updateY(y : number) : number {
        return -y;
    }
    /**
     * Used to `translate the transformation`.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // set pen
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
     * //
     * // set translate transform
     * page1.graphics.translateTransform(100, 100);
     * //
     * // draw the rectangle after applying translate transform
     * page1.graphics.drawRectangle(pen, new RectangleF({x : 0, y : 0}, {width : 100, height : 50}));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param offsetX The x-coordinate of the translation.
     * @param offsetY The y-coordinate of the translation.
     */
    public translateTransform(offsetX : number, offsetY : number) : void {
        let matrix : PdfTransformationMatrix = new PdfTransformationMatrix();
        this.getTranslateTransform(offsetX, offsetY, matrix);
        this.pdfStreamWriter.modifyCtm(matrix);
        this.matrix.multiply(matrix);
    }
    /**
     * `Translates` coordinates of the input matrix.
     * @private
     */
    private getTranslateTransform(x : number, y : number, input : PdfTransformationMatrix) : PdfTransformationMatrix {
        input.translate(x, this.updateY(y));
        return input;
    }
    /* tslint:disable */
    /**
     * Applies the specified `scaling operation` to the transformation matrix of this Graphics by prepending it to the object's transformation matrix.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // create pen 
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
     * //
     * // apply scaling trasformation
     * page1.graphics.scaleTransform(1.5, 2);
     * //
     * // draw the rectangle after applying scaling transform
     * page1.graphics.drawRectangle(pen, new RectangleF({x : 100, y : 100}, {width : 100, height : 50}));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param scaleX Scale factor in the x direction.
     * @param scaleY Scale factor in the y direction.
     */
    /* tslint:enable */
    public scaleTransform(scaleX : number, scaleY : number) : void {
        let matrix : PdfTransformationMatrix = new PdfTransformationMatrix();
        this.getScaleTransform(scaleX, scaleY, matrix);
        this.pdfStreamWriter.modifyCtm(matrix);
        this.matrix.multiply(matrix);
    }
    /**
     * `Scales` coordinates of the input matrix.
     * @private
     */
    private getScaleTransform(x : number, y : number, input : PdfTransformationMatrix) : PdfTransformationMatrix {
        if (input == null) {
            input = new PdfTransformationMatrix();
        }
        input.scale(x, y);
        return input;
    }
    /**
     * Applies the specified `rotation` to the transformation matrix of this Graphics.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // create pen 
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
     * //
     * // set RotateTransform with 25 degree of angle
     * page1.graphics.rotateTransform(25);
     * //
     * // draw the rectangle after RotateTransformation
     * page1.graphics.drawRectangle(pen, new RectangleF({x : 100, y : 100}, {width : 100, height : 50}));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param angle Angle of rotation in degrees.
     */
    public rotateTransform(angle : number) : void {
        let matrix : PdfTransformationMatrix = new PdfTransformationMatrix();
        this.getRotateTransform(angle, matrix);
        this.pdfStreamWriter.modifyCtm(matrix);
        this.matrix.multiply(matrix);
    }
    /**
     * `Initializes coordinate system`.
     * @private
     */
    public initializeCoordinates() : void {
        // Matrix equation: TM(T-1)=M', where T=[1 0 0 -1 0 h]
        this.pdfStreamWriter.writeComment('Change co-ordinate system to left/top.');
        // Translate co-ordinates only, don't flip.
        if (this.mediaBoxUpperRightBound !== -(this.size.height)) {
            if (this.cropBox == null) {
                if (this.mediaBoxUpperRightBound === this.size.height || this.mediaBoxUpperRightBound === 0) {
                    this.translateTransform(0, this.updateY(this.size.height));
                } else {
                    this.translateTransform(0, this.updateY(this.mediaBoxUpperRightBound));
                }
            }
        }
    }
    /**
     * `Rotates` coordinates of the input matrix.
     * @private
     */
    private getRotateTransform(angle : number, input : PdfTransformationMatrix) : PdfTransformationMatrix {
        if (input == null || typeof input === 'undefined') {
            input = new PdfTransformationMatrix();
        }
        input.rotate(this.updateY(angle));
        return input;
    }
    /**
     * `Saves` the current state of this Graphics and identifies the saved state with a GraphicsState.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // create a new page
     * let page1 : PdfPage = document.pages.add();
     * // create pen 
     * let pen : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
     * //
     * // save the graphics state
     * let state1 : PdfGraphicsState = page1.graphics.save();
     * //
     * page1.graphics.scaleTransform(1.5, 2);
     * // draw the rectangle
     * page1.graphics.drawRectangle(pen, new RectangleF({x : 100, y : 100}, {width : 100, height : 50}));
     * // restore the graphics state
     * page1.graphics.restore(state1);
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public save() : PdfGraphicsState {
        let state : PdfGraphicsState = new PdfGraphicsState(this, this.matrix.clone());
        state.brush = this.currentBrush;
        state.pen = this.currentPen;
        state.font = this.currentFont;
        state.colorSpace = this.currentColorSpace;
        state.characterSpacing = this.previousCharacterSpacing;
        state.wordSpacing = this.previousWordSpacing;
        state.textScaling = this.previousTextScaling;
        state.textRenderingMode = this.previousTextRenderingMode;
        this.graphicsState.push(state);
        this.pdfStreamWriter.saveGraphicsState();
        return state;
    }
    /**
     * `Restores the state` of this Graphics to the state represented by a GraphicsState.
     * @private
     */
    public restore() : void
    /**
     * `Restores the state` of this Graphics to the state represented by a GraphicsState.
     * @private
     */
    public restore(state : PdfGraphicsState) : void
    public restore(state ?: PdfGraphicsState) : void {
        if (typeof state === 'undefined') {
            if (this.graphicsState.length > 0) {
                this.doRestoreState();
            }
        } else {
            if (this.graphicsState.indexOf(state) !== -1) {
                for ( ; ; )  {
                    if (this.graphicsState.length === 0) {
                        break;
                    }
                    let popState : PdfGraphicsState = this.doRestoreState();
                    if (popState === state) {
                        break;
                    }
                }
            }
        }
    }
    /**
     * `Restores graphics state`.
     * @private
     */
    private doRestoreState() : PdfGraphicsState {
        let state : PdfGraphicsState = this.graphicsState.pop();
        this.transformationMatrix = state.matrix;
        this.currentBrush = state.brush;
        this.currentPen = state.pen;
        this.currentFont = state.font;
        this.currentColorSpace = state.colorSpace;
        this.previousCharacterSpacing = state.characterSpacing;
        this.previousWordSpacing = state.wordSpacing;
        this.previousTextScaling = state.textScaling;
        this.previousTextRenderingMode = state.textRenderingMode;
        this.pdfStreamWriter.restoreGraphicsState();
        return state;
    }
    /* tslint:enable */
    /**
     * `Draws the specified path`, using its original physical size, at the location specified by a coordinate pair.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // add a page to the document.
     * let page1 : PdfPage = document.pages.add();
     * //Create new PDF path.
     * let path : PdfPath = new PdfPath();
     * //Add line path points.
     * path.addLine(new PointF(10, 100), new PointF(10, 200));
     * path.addLine(new PointF(100, 100), new PointF(100, 200));
     * path.addLine(new PointF(100, 200), new PointF(55, 150));
     * // set pen
     * let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
     * // set brush
     * let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * // draw the path
     * page1.graphics.drawPath(pen, brush, path);
     * //
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param pen Color of the text.
     * @param brush Color of the text.
     * @param path Draw path.
     */
    public drawPath(pen: PdfPen, brush: PdfBrush, path: PdfPath) : void {
        if (brush instanceof PdfTilingBrush) {
            this.bCSInitialized = false;
            (<PdfTilingBrush>brush).graphics.colorSpace = this.colorSpace;
        } else if (brush instanceof PdfGradientBrush) {
            this.bCSInitialized = false;
            (<PdfGradientBrush>brush).colorSpace = this.colorSpace;
        }
        this.stateControl(pen, brush, null);
        this.buildUpPath(path.pathPoints, path.pathTypes);
        this.drawPathHelper(pen, brush, path.fillMode, false);
    }
    /* tslint:enable */
    //drawArc overloads
    /**
     * `Draws the specified arc`, using its original physical size, at the location specified by a coordinate pair.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // add a page to the document.
     * let page1 : PdfPage = document.pages.add();
     * let pen : PdfPen = new PdfPen(new PdfColor(255, 0, 0));
     * // draw the path
     * page1.graphics.drawArc(pen, 10, 10, 100, 200, 90, 270);
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param name Pen that determines the color, width, and style of the arc.
     * @param rectangle RectangleF structure that defines the boundaries of the ellipse.
     * @param startAngle Angle in degrees measured clockwise from the x-axis to the starting point of the arc.
     * @param sweepAngle Angle in degrees measured clockwise from the startAngle parameter to ending point of the arc.
     */
   public drawArc(pen: PdfPen, rectangle: RectangleF, startAngle: number, sweepAngle: number) : void
   public drawArc(pen: PdfPen, x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number) : void
   /* tslint:disable-next-line:max-line-length */
   public drawArc(arg1 : PdfPen, arg2 : number|RectangleF, arg3 ?: number, arg4 ?: number, arg5 ?: number, arg6 ?: number, arg7 ?: number) : void {
       if (arg2 instanceof RectangleF) {
           this.drawArc(arg1, arg2.x, arg2.y, arg2.width, arg2.height, arg3, arg4);
       } else {
           if ((arg7 !== 0)) {
               this.stateControl(arg1, null, null);
               this.constructArcPath(arg2, arg3, (arg2 + arg4), (arg3 + arg5), arg6, arg7);
               this.drawPathHelper(arg1, null, false);
           }
       }
   }
    /**
     * Builds up the path.
     * @private
     */
    private buildUpPath(arg1 : PointF[], arg2 : number[]) : void {
        let cnt : number = arg1.length;
        for (let i : number = 0 ; i < cnt; ++i) {
            let typeValue: number = 0;
            let point: PointF = arg1[i];
            switch ((<PathPointType>((arg2[i] & (<number>(PdfGraphics.pathTypesValuesMask)))))) {
                case PathPointType.Start:
                    this.pdfStreamWriter.beginPath(point.x, point.y);
                    break;
                case PathPointType.Bezier3:
                    let p2 : PointF = new PointF(0, 0);
                    let p3 : PointF = new PointF(0, 0);
                    let result1 : { i: number, p2 : PointF, p3 : PointF } = this.getBezierPoints(arg1, arg2, i, p2, p3);
                    this.pdfStreamWriter.appendBezierSegment(point, result1.p2, result1.p3);
                    i = result1.i;
                    break;
                case PathPointType.Line:
                    this.pdfStreamWriter.appendLineSegment(point);
                    break;
                default:
                    throw new Error('ArithmeticException - Incorrect path formation.');
            }
            typeValue = arg2[i];
            this.checkFlags(typeValue);
        }
    }
    /**
     * Gets the bezier points from respective arrays.
     * @private
     */
    /* tslint:disable-next-line:max-line-length */
    private getBezierPoints(points: PointF[], types: number[], i: number, p2: PointF, p3: PointF) : { i : number, p2 : PointF, p3 : PointF } {
        let errorMsg: string = 'Malforming path.';
        ++i;
        if (((<PathPointType>((types[i] & PdfGraphics.pathTypesValuesMask))) === PathPointType.Bezier3)) {
            p2 = points[i];
            ++i;
            if (((<PathPointType>((types[i] & PdfGraphics.pathTypesValuesMask))) === PathPointType.Bezier3)) {
                p3 = points[i];
            } else {
                throw new Error ('ArgumentException : errorMsg');
            }
        } else {
            throw new Error ('ArgumentException : errorMsg');
        }
        return { i : i, p2 : p2, p3 : p3 };
    }

    /**
     * Checks path point type flags.
     * @private
     */
    private checkFlags(type :  number) : void {
        if (((<PathPointType>((type & (<number>(PathPointType.CloseSubpath))))) === PathPointType.CloseSubpath)) {
            this.pdfStreamWriter.closePath();
        }
    }
    /**
     * Constructs the arc path using Bezier curves.
     * @private 
     */
    private constructArcPath(x1: number, y1: number, x2: number, y2: number, startAng: number, sweepAngle: number) : void {
        let points: number[] = this.getBezierArc(x1, y1, x2, y2, startAng, sweepAngle);
        if ((points.length === 0)) {
            return;
        }
        let pt: number[] = [points[0], points[1], points[2], points[3], points[4], points[5], points[6], points[7]];
        this.pdfStreamWriter.beginPath(pt[0], pt[1]);
        let i: number = 0;
        for (i = 0 ; i < points.length; i = i + 8) {
            pt = [ points[i], points[i + 1], points[i + 2], points[i + 3], points[i + 4], points[i + 5], points[i + 6], points[i + 7]];
            this.pdfStreamWriter.appendBezierSegment(pt[2], pt[3], pt[4], pt[5], pt[6], pt[7]);
        }
    }
    /**
     * Gets the bezier points for arc constructing.
     * @private
     */
    private getBezierArc(numX1: number, numY1: number, numX2: number, numY2: number, s1: number, e1: number): number[] {
        if ((numX1 > numX2)) {
            let tmp: number;
            tmp = numX1;
            numX1 = numX2;
            numX2 = tmp;
        }
        if ((numY2 > numY1)) {
            let tmp: number;
            tmp = numY1;
            numY1 = numY2;
            numY2 = tmp;
        }
        let fragAngle1: number;
        let numFragments: number;
        if ((Math.abs(e1) <= 90)) {
            fragAngle1 = e1;
            numFragments = 1;
        } else {
            numFragments = (<number>(Math.ceil((Math.abs(e1) / 90))));
            fragAngle1 = (e1 / numFragments);
        }
        let xcen: number = ((numX1 + numX2) / 2);
        let ycen: number = ((numY1 + numY2) / 2);
        let rx: number = ((numX2 - numX1) / 2);
        let ry: number = ((numY2 - numY1) / 2);
        let halfAng: number = (<number>((fragAngle1 * (Math.PI / 360))));
        let kappa: number = (<number>(Math.abs(4.0 / 3.0 * (1.0 - Math.cos(halfAng)) / Math.sin(halfAng))));
        let pointsList: number[] = [];
        for (let i: number = 0; (i < numFragments); i++) {
            let thetaValue0: number = (<number>(((s1 + (i * fragAngle1)) * (Math.PI / 180))));
            let thetaValue1: number = (<number>(((s1 + ((i + 1) * fragAngle1)) * (Math.PI / 180))));
            let cos0: number = (<number>(Math.cos(thetaValue0)));
            let cos1: number = (<number>(Math.cos(thetaValue1)));
            let sin0: number = (<number>(Math.sin(thetaValue0)));
            let sin1: number = (<number>(Math.sin(thetaValue1)));
            if ((fragAngle1 > 0)) {
                /* tslint:disable-next-line:max-line-length */
                pointsList.push((xcen  + (rx * cos0)), (ycen - (ry * sin0)), (xcen + (rx * (cos0 - (kappa * sin0)))), (ycen - (ry * (sin0 + (kappa * cos0)))), (xcen + (rx * (cos1 + (kappa * sin1)))), (ycen - (ry * (sin1 - (kappa * cos1)))), (xcen + (rx * cos1)), (ycen - (ry * sin1)));
            } else {
                /* tslint:disable-next-line:max-line-length */
                pointsList.push((xcen + (rx * cos0)), (ycen - (ry * sin0)), (xcen + (rx * (cos0 + (kappa * sin0)))), (ycen - (ry * (sin0 - (kappa * cos0)))), (xcen + (rx * (cos1 - (kappa * sin1)))), (ycen - (ry * (sin1 + (kappa * cos1)))), (xcen + (rx * cos1)), (ycen - (ry * sin1)));
            }
        }
        return pointsList;
    }
}
/**
 * `GetResourceEventHandler` class is alternate for event handlers and delegates.
 * @private
 * @hidden
 */
export class GetResourceEventHandler {
    /**
     * Return the instance of `PdfResources` class.
     * @private
     */
    public getResources() : PdfResources {
        return this.sender.getResources();
    }
    /**
     * Variable to store instance of `PdfPageBase as sender`.
     * @hidden
     * @private
     */
    public sender : PdfPageBase|PdfTemplate|PdfTilingBrush;
    /**
     * Initialize instance of `GetResourceEventHandler` class.
     * Alternate for event handlers and delegates.
     * @private
     */
    public constructor(sender : PdfPageBase|PdfTemplate|PdfTilingBrush) {
        this.sender = sender;
    }
}
export class PdfGraphicsState {
    // Fields
    /**
     * `Parent graphics` object.
     * @private
     */
    private pdfGraphics : PdfGraphics;
    /**
     * The current `transformation matrix`.
     * @private
     */
    private transformationMatrix : PdfTransformationMatrix;
    /**
     * Stores `previous rendering mode`.
     * @default TextRenderingMode.Fill
     * @private
     */
    private internalTextRenderingMode : TextRenderingMode = TextRenderingMode.Fill;
    /**
     * `Previous character spacing` value or 0.
     * @default 0.0
     * @private
     */
    private internalCharacterSpacing : number = 0.0;
    /**
     * `Previous word spacing` value or 0.
     * @default 0.0
     * @private
     */
    private internalWordSpacing : number = 0.0;
    /**
     * The previously used `text scaling value`.
     * @default 100.0
     * @private
     */
    private internalTextScaling : number = 100.0;
    /**
     * `Current pen`.
     * @private
     */
    private pdfPen : PdfPen;
    /**
     * `Current brush`.
     * @private
     */
    private pdfBrush : PdfBrush;
    /**
     * `Current font`.
     * @private
     */
    private pdfFont : PdfFont;
    /**
     * `Current color space`.
     * @default PdfColorSpace.Rgb
     * @private
     */
    private pdfColorSpace : PdfColorSpace = PdfColorSpace.Rgb;
    // Properties
    /**
     * Gets the parent `graphics object`.
     * @private
     */
    public get graphics() : PdfGraphics {
        return this.pdfGraphics;
    }
    /**
     * Gets the `current matrix`.
     * @private
     */
    public get matrix() : PdfTransformationMatrix {
        return this.transformationMatrix;
    }
    /**
     * Gets or sets the `current character spacing`.
     * @private
     */
    public get characterSpacing() : number {
        return this.internalCharacterSpacing;
    }
    public set characterSpacing(value : number) {
        this.internalCharacterSpacing = value;
    }
    /**
     * Gets or sets the `word spacing` value.
     * @private
     */
    public get wordSpacing() : number {
        return this.internalWordSpacing;
    }
    public set wordSpacing(value : number) {
        this.internalWordSpacing = value;
    }
    /**
     * Gets or sets the `text scaling` value.
     * @private
     */
    public get textScaling() : number {
        return this.internalTextScaling;
    }
    public set textScaling(value : number) {
        this.internalTextScaling = value;
    }
    /**
     * Gets or sets the `current pen` object.
     * @private
     */
    public get pen() : PdfPen {
        return this.pdfPen;
    }
    public set pen(value : PdfPen) {
        this.pdfPen = value;
    }
    /**
     * Gets or sets the `brush`.
     * @private
     */
    public get brush() : PdfBrush {
        return this.pdfBrush;
    }
    public set brush(value : PdfBrush) {
        this.pdfBrush = value;
    }
    /**
     * Gets or sets the `current font` object.
     * @private
     */
    public get font() : PdfFont {
        return this.pdfFont;
    }
    public set font(value : PdfFont) {
        this.pdfFont = value;
    }
    /**
     * Gets or sets the `current color space` value.
     * @private
     */
    public get colorSpace() : PdfColorSpace {
        return this.pdfColorSpace;
    }
    public set colorSpace(value : PdfColorSpace) {
        this.pdfColorSpace = value;
    }
    /**
     * Gets or sets the `text rendering mode`.
     * @private
     */
    public get textRenderingMode() : TextRenderingMode {
        return this.internalTextRenderingMode;
    }
    public set textRenderingMode(value : TextRenderingMode) {
        this.internalTextRenderingMode = value;
    }

    // Constructors
    /**
     * `default constructor`.
     * @private
     */
    public constructor()
    /**
     * Creates new object for `PdfGraphicsState`.
     * @private
     */
    public constructor(graphics : PdfGraphics, matrix : PdfTransformationMatrix)
    public constructor(graphics ?: PdfGraphics, matrix ?: PdfTransformationMatrix) {
        if (typeof graphics !== 'undefined') {
            this.pdfGraphics = graphics;
            this.transformationMatrix = matrix;
        }
    }
}
class TransparencyData {
    // Fields
    /**
     * Specifies the `Alpha pen`.
     * @private
     */
    public alphaPen : number;
    /**
     * Specifies the `Alpha brush`.
     * @private
     */
    public alphaBrush : number;
    /**
     * Specifies the `blend mode`.
     * @private
     */
    public blendMode : PdfBlendMode;
    // Constructors
    /**
     * Initializes a new instance of the `TransparencyData` class.
     * @private
     */
    public constructor(alphaPen : number, alphaBrush : number, blendMode : PdfBlendMode) {
        this.alphaPen = alphaPen;
        this.alphaBrush = alphaBrush;
        this.blendMode = blendMode;
    }
}
