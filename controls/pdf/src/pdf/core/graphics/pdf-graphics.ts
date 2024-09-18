import { PdfPage } from './../pdf-page';
import { _PdfStreamWriter } from './pdf-stream-writer';
import { _PdfBaseStream, _PdfContentStream } from './../base-stream';
import { _floatToString, _addProcSet, _reverseMapBlendMode, _mapBlendMode, _getNewGuidString, _getBezierArc, _numberToString, _bytesToString, _stringToUnicodeArray } from './../utils';
import { _PdfDictionary, _PdfReference, _PdfName } from './../pdf-primitives';
import { _PdfCrossReference } from './../pdf-cross-reference';
import { PdfFont, PdfStandardFont, PdfTrueTypeFont } from './../fonts/pdf-standard-font';
import { _PdfStringLayouter, _PdfStringLayoutResult, _LineInfo, _LineType, _StringTokenizer } from './../fonts/string-layouter';
import { PdfTextAlignment, _PdfGraphicsUnit, PdfTextDirection, PdfSubSuperScript, PdfBlendMode, PdfLineJoin, PdfLineCap, PdfDashStyle, PdfFillMode, PathPointType } from './../enumerator';
import { PdfStringFormat, PdfVerticalAlignment } from './../fonts/pdf-string-format';
import { PdfTemplate } from './pdf-template';
import { PdfPath } from './pdf-path';
import { _UnicodeTrueTypeFont } from '../fonts/unicode-true-type-font';
import { _TrueTypeReader } from './../fonts/ttf-reader';
import { _RtlRenderer } from './../graphics/rightToLeft/text-renderer';
import { PdfImage } from './images/pdf-image';
/**
 * Represents a graphics from a PDF page.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * //Create a new pen.
 * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
 * //Draw line on the page graphics.
 * graphics.drawLine(pen, 10, 10, 100, 100);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfGraphics {
    _source: _PdfDictionary;
    _sw: _PdfStreamWriter;
    _cropBox: Array<number>;
    _mediaBoxUpperRightBound: number;
    _m: _PdfTransformationMatrix;
    _characterSpacing: number;
    _wordSpacing: number;
    _textScaling: number;
    _textRenderingMode: _TextRenderingMode;
    _graphicsState: PdfGraphicsState[];
    _size: number[];
    _clipBounds: number[];
    _resourceObject: _PdfDictionary;
    _resourceMap: Map<_PdfReference, _PdfName>;
    _crossReference: _PdfCrossReference;
    _transparencies: Map<_TransparencyData, string>;
    _hasResourceReference: boolean;
    _currentPen: PdfPen;
    _currentBrush: PdfBrush;
    _currentFont: any; // eslint-disable-line
    _colorSpaceInitialized: boolean;
    _startCutIndex: number;
    _page: PdfPage;
    _template: PdfTemplate;
    _isTemplateGraphics: boolean;
    _state: PdfGraphicsState;
    _pendingResource: any[] = []; // eslint-disable-line
    /**
     * Initializes a new instance of the `PdfGraphics` class.
     *
     * @param {number[]} size The graphics client size.
     * @param {_PdfContentStream} content Content stream.
     * @param {_PdfCrossReference} xref Cross reference.
     * @param {PdfPage | PdfTemplate} source Source object of the graphics.
     * @private
     */
    constructor(size: number[], content: _PdfContentStream, xref: _PdfCrossReference, source: PdfPage | PdfTemplate) {
        this._hasResourceReference = false;
        if (source instanceof PdfPage) {
            this._source = source._pageDictionary;
            this._page = source;
        } else if (source instanceof PdfTemplate) {
            this._source = source._content.dictionary;
            this._template = source;
        }
        if (this._source && this._source.has('Resources')) {
            const obj: any = this._source.getRaw('Resources'); // eslint-disable-line
            if (obj instanceof _PdfReference) {
                this._hasResourceReference = true;
                this._resourceObject = xref._fetch(obj);
            } else if (obj instanceof _PdfDictionary) {
                this._resourceObject = obj;
            }
        } else {
            this._resourceObject = new _PdfDictionary();
            this._source.update('Resources', this._resourceObject);
        }
        this._crossReference = xref;
        this._sw = new _PdfStreamWriter(content);
        this._size = size;
        _addProcSet('PDF', this._resourceObject);
        this._initialize();
    }
    /**
     * Gets the size of the canvas reduced by margins and page templates (Read only).
     *
     * @returns {number[]} The width and height of the client area as number array.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics client size.
     * let size: number[] = page.graphics.clientSize;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get clientSize(): number[] {
        return [this._clipBounds[2], this._clipBounds[3]];
    }
    get _matrix(): _PdfTransformationMatrix {
        if (typeof this._m === 'undefined') {
            this._m = new _PdfTransformationMatrix();
        }
        return this._m;
    }
    get _resources(): Map<_PdfReference, _PdfName> {
        if (typeof this._resourceMap === 'undefined') {
            this._resourceMap = new Map<_PdfReference, _PdfName>();
            if (this._resourceObject.has('Font')) {
                const fonts: _PdfDictionary = this._resourceObject.get('Font');
                if (fonts && fonts.size > 0) {
                    fonts.forEach((key: string, value: any) => { // eslint-disable-line
                        if (value !== null && typeof value !== 'undefined' && value instanceof _PdfReference) {
                            this._resourceMap.set(value, _PdfName.get(key));
                        }
                    });
                }
            }
            if (this._resourceObject.has('XObject')) {
                const other: _PdfDictionary = this._resourceObject.get('XObject');
                if (other && other.size > 0) {
                    other.forEach((key: string, value: any) => { // eslint-disable-line
                        if (value !== null && typeof value !== 'undefined' && value instanceof _PdfReference) {
                            this._resourceMap.set(value, _PdfName.get(key));
                        }
                    });
                }
            }
            if (this._resourceObject.has('ExtGState')) {
                const state: _PdfDictionary = this._resourceObject.get('ExtGState');
                if (state && state.size > 0) {
                    if (!this._transparencies) {
                        this._transparencies = new Map<_TransparencyData, string>();
                    }
                    state.forEach((key: string, value: any) => { // eslint-disable-line
                        if (value !== null && typeof value !== 'undefined' && value instanceof _PdfReference) {
                            this._setTransparencyData(value, _PdfName.get(key));
                        }
                    });
                }
            }
        }
        return this._resourceMap;
    }
    /**
     * Save the current graphics state.
     *
     * @returns {PdfGraphicsState} graphics state.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // Save the graphics
     * let state: PdfGraphicsState = graphics.save();
     * //Set graphics translate transform.
     * graphics.translateTransform(100, 100);
     * //Draws the String.
     * graphics.drawString("Hello world!", font, [10, 20, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * //Restore the graphics.
     * graphics.restore(state);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    save(): PdfGraphicsState {
        const state: PdfGraphicsState = new PdfGraphicsState(this, this._matrix);
        state._textRenderingMode = this._textRenderingMode;
        state._charSpacing = this._characterSpacing;
        state._textScaling = this._textScaling;
        state._wordSpacing = this._wordSpacing;
        state._currentBrush = this._currentBrush;
        state._currentPen = this._currentPen;
        state._currentFont = this._currentFont;
        this._graphicsState.push(state);
        this._sw._saveGraphicsState();
        return state;
    }
    /**
     * Restore the graphics state.
     *
     * @param {PdfGraphicsState} state graphics state.
     * @returns {void} restore of the graphics state.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // Save the graphics
     * let state: PdfGraphicsState = graphics.save();
     * //Set graphics translate transform.
     * graphics.translateTransform(100, 100);
     * //Draws the String.
     * graphics.drawString("Hello world!", font, [10, 20, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * //Restore the graphics.
     * graphics.restore(state);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    restore(state?: PdfGraphicsState): void {
        if (this._graphicsState.length > 0) {
            if (typeof state === 'undefined') {
                this._doRestore();
            } else {
                if (this._graphicsState.length > 0 && this._graphicsState.indexOf(state) !== -1) {
                    while (this._graphicsState.length > 0) {
                        if (this._doRestore() === state) {
                            break;
                        }
                    }
                }
            }
        }
    }
    _doRestore(): PdfGraphicsState {
        const state: PdfGraphicsState = this._graphicsState.pop();
        this._m = state._transformationMatrix;
        this._currentBrush = state._currentBrush;
        this._currentPen = state._currentPen;
        this._currentFont = state._currentFont;
        this._characterSpacing = state._charSpacing;
        this._wordSpacing = state._wordSpacing;
        this._textScaling = state._textScaling;
        this._textRenderingMode = state._textRenderingMode;
        this._sw._restoreGraphicsState();
        return state;
    }
    /**
     * Draw a rectangle on the page graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the rectangular region.
     * @param {number} y The y-coordinate of the upper-left corner of the rectangular region.
     * @param {number} width The width of the rectangular region.
     * @param {number} height The height of the rectangular region.
     * @param {PdfPen} pen Pen that determines the stroke color, width, and style of the rectangle.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Draw a rectangle on the page graphics.
     * graphics.drawRectangle(10, 20, 100, 200, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawRectangle(x: number, y: number, width: number, height: number, pen: PdfPen): void
    /**
     * Draw a rectangle on the page graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the rectangular region.
     * @param {number} y The y-coordinate of the upper-left corner of the rectangular region.
     * @param {number} width The width of the rectangular region.
     * @param {number} height The height of the rectangular region.
     * @param {PdfBrush} brush Brush that determines the fill color and texture of the rectangle.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new brush.
     * let brush: PdfBrush = new PdfBrush([0, 0, 255]);
     * // Draw a filled rectangle on the page graphics.
     * graphics.drawRectangle(10, 20, 100, 200, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawRectangle(x: number, y: number, width: number, height: number, brush: PdfBrush): void
    /**
     * Draw a rectangle on the page graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the rectangular region.
     * @param {number} y The y-coordinate of the upper-left corner of the rectangular region.
     * @param {number} width The width of the rectangular region.
     * @param {number} height The height of the rectangular region.
     * @param {PdfPen} pen Pen that determines the stroke color, width, and style of the rectangle.
     * @param {PdfBrush} brush Brush that determines the fill color and texture of the rectangle.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush.
     * let brush: PdfBrush = new PdfBrush([0, 0, 255]);
     * // Draw a rectangle with both stroke and fill on the page graphics.
     * graphics.drawRectangle(10, 20, 100, 200, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawRectangle(x: number, y: number, width: number, height: number, pen: PdfPen, brush: PdfBrush): void
    drawRectangle(x: number, y: number, width: number, height: number, first?: PdfPen| PdfBrush, second?: PdfBrush): void {
        const result: {pen: PdfPen, brush: PdfBrush} = this._setPenBrush(first, second);
        this._sw._appendRectangle(x, y, width, height);
        this._drawGraphicsPath(result.pen, result.brush);
    }
    /**
     * Draws a Bezier curve using a specified pen and coordinates for the start point, two control points, and end point.
     *
     * @param {number} startX The x-coordinate of the starting point of the Bezier curve.
     * @param {number} startY The y-coordinate of the starting point of the Bezier curve.
     * @param {number} firstX The x-coordinate of the first control point of the Bezier curve.
     * @param {number} firstY The y-coordinate of the first control point of the Bezier curve.
     * @param {number} secondX The x-coordinate of the second control point of the Bezier curve.
     * @param {number} secondY The y-coordinate of the second control point of the Bezier curve.
     * @param {number} endX The x-coordinate of the ending point of the Bezier curve.
     * @param {number} endY The y-coordinate of the ending point of the Bezier curve.
     * @param {PdfPen} pen The pen that determines the stroke color, width, and style of the Bezier curve.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Draw a Bezier curve on the page graphics
     * graphics.drawBezier(50, 100, 200, 50, 100, 150, 150, 100, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawBezier(startX: number, startY: number, firstX: number, firstY: number, secondX: number,
               secondY: number, endX: number, endY: number, pen: PdfPen): void {
        this._stateControl(pen, null, null);
        this._sw._beginPath(startX, startY);
        this._sw._appendBezierSegment(firstX, firstY, secondX, secondY, endX, endY);
        this._drawGraphicsPath(pen);
    }
    /**
     * Draws a pie slice on a PDF graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the bounding rectangle.
     * @param {number} y The y-coordinate of the upper-left corner of the bounding rectangle.
     * @param {number} width The width of the bounding rectangle.
     * @param {number} height The height of the bounding rectangle.
     * @param {number} startAngle The angle in degrees measured clockwise from the x-axis to the start of the pie slice.
     * @param {number} sweepAngle The angle in degrees measured clockwise from the startAngle to the end of the pie slice.
     * @param {PdfPen} pen The pen that determines the stroke color, width, and style of the pie slice.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Draw a pie slice on the page graphics
     * graphics.drawPie(10, 50, 200, 200, 180, 60, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawPie(x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number, pen: PdfPen): void
    /**
     * Draws a pie slice on PDF graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the bounding rectangle.
     * @param {number} y The y-coordinate of the upper-left corner of the bounding rectangle.
     * @param {number} width The width of the bounding rectangle.
     * @param {number} height The height of the bounding rectangle.
     * @param {number} startAngle The angle in degrees, measured clockwise from the x-axis to the start of the pie slice.
     * @param {number} sweepAngle The angle in degrees, measured clockwise from the startAngle to the end of the pie slice.
     * @param {PdfBrush} brush The brush that determines the fill color and texture of the pie slice.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Draw a pie slice on the page graphics
     * graphics.drawPie(10, 50, 200, 200, 180, 60, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawPie(x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number, brush: PdfBrush): void
    /**
     * Draws a pie slice on PDF graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the bounding rectangle.
     * @param {number} y The y-coordinate of the upper-left corner of the bounding rectangle.
     * @param {number} width The width of the bounding rectangle.
     * @param {number} height The height of the bounding rectangle.
     * @param {number} startAngle The angle in degrees, measured clockwise from the x-axis to the start of the pie slice.
     * @param {number} sweepAngle The angle in degrees, measured clockwise from the startAngle to the end of the pie slice.
     * @param {PdfPen} pen The pen that determines the stroke color, width, and style of the pie slice.
     * @param {PdfBrush} brush The brush that determines the fill color and texture of the pie slice.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Draw a pie slice on the page graphics
     * graphics.drawPie(10, 50, 200, 200, 180, 60, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawPie(x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number, pen: PdfPen, brush: PdfBrush): void
    drawPie(x: number, y: number, width: number, height: number, startAngle: number,
            sweepAngle: number, first?: PdfPen | PdfBrush, second?: PdfBrush): void {
        const result: {pen: PdfPen, brush: PdfBrush} = this._setPenBrush(first, second);
        this._constructPiePath(x, y, x + width, y + height, startAngle, sweepAngle);
        this._sw._appendLineSegment(x + width / 2, y + height / 2);
        this._drawGraphicsPath(result.pen, result.brush, null, true);
    }
    /**
     * Draw polygon on the page graphics.
     *
     * @param {Array<number[]>} points The points of the polygon.
     * @param {PdfPen} pen Pen that determines the stroke color, width, and style of the polygon.
     * @returns {void} Nothing.
     *
     *  ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Get the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Define the polygon points
     * let points: number[][] = [[10, 100], [10, 200], [100, 100], [100, 200], [55, 150]];
     * // Draw the polygon on the page graphics
     * graphics.drawPolygon(points, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawPolygon(points: Array<number[]>, pen: PdfPen): void
    /**
     * Draw polygon on the page graphics.
     *
     * @param {Array<number[]>} points The points of the polygon.
     * @param {PdfBrush} brush Brush that determines the fill color and texture of the polygon.
     * @returns {void} Nothing
     *
     *```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Define the polygon points
     * let points: number[][] = [[10, 100], [10, 200], [100, 100], [100, 200], [55, 150]];
     * // Draw the polygon on the page graphics
     * graphics.drawPolygon(points, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawPolygon(points: Array<number[]>, brush: PdfBrush): void
    /**
     * Draw polygon on the page graphics.
     *
     * @param {Array<number[]>} points The points of the polygon.
     * @param {PdfPen} pen Pen that determines the stroke color, width, and style of the polygon.
     * @param {PdfBrush} brush Brush that determines the fill color and texture of the polygon.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Define the polygon points
     * let points: number[][] = [[10, 100], [10, 200], [100, 100], [100, 200], [55, 150]];
     * // Draw the polygon on the page graphics
     * graphics.drawPolygon(points, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawPolygon(points: Array<number[]>, pen: PdfPen, brush: PdfBrush): void
    drawPolygon(points: Array<number[]>, first?: PdfPen| PdfBrush, second?: PdfBrush): void {
        if (points.length > 0) {
            const result: {pen: PdfPen, brush: PdfBrush} = this._setPenBrush(first, second);
            this._sw._beginPath(points[0][0], points[0][1]);
            for (let i: number = 1; i < points.length; i++) {
                this._sw._appendLineSegment(points[Number.parseInt(i.toString(), 10)][0], points[Number.parseInt(i.toString(), 10)][1]);
            }
            this._drawGraphicsPath(result.pen, result.brush, PdfFillMode.winding, true);
        }
    }
    /**
     * Draw ellipse on the page graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the bounding rectangle that defines the ellipse.
     * @param {number} y The y-coordinate of the upper-left corner of the bounding rectangle that defines ellipse.
     * @param {number} width The width of the bounding rectangle that defines ellipse.
     * @param {number} height The height of the bounding rectangle that defines ellipse.
     * @param {PdfPen} pen Pen that determines the stroke color, width, and style of the ellipse.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Draw an ellipse on the page graphics
     * graphics.drawEllipse(10, 20, 100, 200, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawEllipse(x: number, y: number, width: number, height: number, pen: PdfPen): void
    /**
     * Draw ellipse on the page graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the bounding rectangle that defines the ellipse.
     * @param {number} y The y-coordinate of the upper-left corner of the bounding rectangle that defines the ellipse.
     * @param {number} width The width of the bounding rectangle that defines ellipse.
     * @param {number} height The height of the bounding rectangle that defines ellipse.
     * @param {PdfBrush} brush Brush that determines the fill color and texture of the ellipse.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Draw an ellipse on the page graphics
     * graphics.drawEllipse(10, 20, 100, 200, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawEllipse(x: number, y: number, width: number, height: number, brush: PdfBrush): void
    /**
     * Draw ellipse on the page graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the bounding rectangle that defines the ellipse.
     * @param {number} y The y-coordinate of the upper-left corner of the bounding rectangle that defines the ellipse.
     * @param {number} width The width of the bounding rectangle that defines ellipse.
     * @param {number} height The height of the bounding rectangle that defines ellipse.
     * @param {PdfPen} pen Pen that determines the stroke color, width, and style of the ellipse.
     * @param {PdfBrush} brush Brush that determines the fill color and texture of the ellipse.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Draw an ellipse on the page graphics
     * graphics.drawEllipse(10, 20, 100, 200, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawEllipse(x: number, y: number, width: number, height: number, pen: PdfPen, brush: PdfBrush): void
    drawEllipse(x: number, y: number, width: number, height: number, first?: PdfPen| PdfBrush, second?: PdfBrush): void {
        const result: {pen: PdfPen, brush: PdfBrush} = this._setPenBrush(first, second);
        this._constructArcPath(x, y, x + width, y + height, 0, 360);
        this._drawGraphicsPath(result.pen, result.brush, PdfFillMode.winding, true);
    }
    /**
     * Draw arc on the page graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the bounding rectangle that defines the ellipse from which the arc shape comes.
     * @param {number} y The y-coordinate of the upper-left corner of the bounding rectangle that defines the ellipse from which the arc shape comes.
     * @param {number} width Width of the bounding rectangle that defines the ellipse from which the arc shape comes.
     * @param {number} height Height of the bounding rectangle that defines the ellipse from which the arc shape comes.
     * @param {number} startAngle Angle measured in degrees clockwise from the x-axis to the first side of the arc shape.
     * @param {number} sweepAngle Angle measured in degrees clockwise from the startAngle parameter to the second side of the arc shape.
     * @param {PdfPen} pen Pen that determines the stroke color, width, and style of the arc.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Draw an arc on the page graphics
     * graphics.drawArc(10, 20, 100, 200, 20, 30, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawArc(x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number, pen: PdfPen): void {
        if (sweepAngle !== 0) {
            this._stateControl(pen);
            this._constructArcPath(x, y, x + width, y + height, startAngle, sweepAngle);
            this._drawGraphicsPath(pen, null, PdfFillMode.winding, false);
        }
    }
    /**
     * Draws an image on the page graphics.
     *
     * @param {PdfImage} image The image to be drawn on the page.
     * @param {number} x The x-coordinate of the upper-left corner where the image will be drawn.
     * @param {number} y The y-coordinate of the upper-left corner where the image will be drawn.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new image object using JPEG image data as a Base64 string
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Draw the image on the page graphics
     * graphics.drawImage(image, 10, 20);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawImage(image: PdfImage, x: number, y: number) : void
    /**
     * Draws an image on the page graphics.
     *
     * @param {PdfImage} image The image to be drawn on the page.
     * @param {number} x The x-coordinate of the upper-left corner where the image will be drawn.
     * @param {number} y The y-coordinate of the upper-left corner where the image will be drawn.
     * @param {number} width The width of the image to be drawn.
     * @param {number} height The height of the image to be drawn.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new image object using JPEG image data as a Base64 string
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Draw the image on the page graphics with specified width and height
     * graphics.drawImage(image, 10, 20, 400, 400);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawImage(image: PdfImage, x: number, y: number, width: number, height: number) : void
    drawImage(arg1: PdfImage, arg2: number, arg3: number, arg4?: number, arg5?: number) : void {
        if (typeof arg2 === 'number' && typeof arg3 === 'number' && typeof arg4 === 'undefined') {
            const size: number[] = arg1.physicalDimension;
            this.drawImage(arg1, arg2, arg3, size[0], size[1]);
        } else {
            arg1._save();
            const matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
            this._getTranslateTransform(arg2, (arg3 + arg5), matrix);
            this._getScaleTransform(arg4, arg5, matrix);
            this._sw._write('q');
            this._sw._modifyCtm(matrix);
            let sourceDictionary: _PdfDictionary;
            let keyName: _PdfName;
            let isNew: boolean = true;
            if (this._resourceObject.has('XObject')) {
                const obj: any = this._resourceObject.getRaw('XObject'); // eslint-disable-line
                if (obj instanceof _PdfDictionary) {
                    sourceDictionary = obj;
                }
                if (sourceDictionary) {
                    isNew = false;
                }
            }
            if (isNew) {
                sourceDictionary = new _PdfDictionary(this._crossReference);
                this._resourceObject.update('XObject', sourceDictionary);
            }
            if (typeof keyName === 'undefined') {
                keyName = _PdfName.get(_getNewGuidString());
            }
            if (this._crossReference) {
                this._updateImageResource(arg1, keyName, sourceDictionary, this._crossReference);
                this._source.update('Resources', this._resourceObject);
                this._source._updated = true;
            } else {
                this._pendingResource.push({'resource': arg1, 'key': keyName, 'source': sourceDictionary});
            }
            this._sw._executeObject(keyName);
            this._sw._write('Q');
            this._sw._write('\r\n');
            _addProcSet('ImageB', this._resourceObject);
            _addProcSet('ImageC', this._resourceObject);
            _addProcSet('ImageI', this._resourceObject);
            _addProcSet('Text', this._resourceObject);
        }
    }
    /**
     * Draws a PDF template onto the page graphics.
     *
     * @param {PdfTemplate} template The PDF template to be drawn.
     * @param {{x: number, y: number, width: number, height: number}} bounds The bounds of the template.
     * @param {number} bounds.x The x-coordinate of the upper-left corner where the template will be drawn.
     * @param {number} bounds.y The y-coordinate of the upper-left corner where the template will be drawn.
     * @param {number} bounds.width The width of the area where the template will be drawn.
     * @param {number} bounds.height The height of the area where the template will be drawn.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Get the first annotation of the page
     * let annotation: PdfRubberStampAnnotation = page.annotations.at(0) as PdfRubberStampAnnotation;
     * // Get the appearance template of the annotation
     * let template: PdfTemplate = annotation.createTemplate();
     * // Get the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Draw the template on the page graphics within the specified bounds
     * graphics.drawTemplate(template, { x: 10, y: 20, width: template.size[0], height: template.size[1] });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawTemplate(template: PdfTemplate, bounds: {x: number, y: number, width: number, height: number}): void {
        if (typeof template !== 'undefined') {
            if (template._isExported || template._isResourceExport) {
                if (this._crossReference) {
                    template._crossReference = this._crossReference;
                    template._importStream(true, template._isResourceExport);
                } else {
                    template._importStream(false, template._isResourceExport);
                    this._pendingResource.push(template);
                }
            }
            const scaleX: number = (template && template._size[0] > 0) ? bounds.width / template._size[0] : 1;
            const scaleY: number = (template && template._size[1] > 0) ? bounds.height / template._size[1] : 1;
            const needScale: boolean = !(scaleX === 1 && scaleY === 1);
            let cropBox: number[];
            let mediaBox: number[];
            if (this._page) {
                cropBox = this._page.cropBox;
                mediaBox = this._page.mediaBox;
                if (this._page._pageDictionary.has('CropBox') && this._page._pageDictionary.has('MediaBox')) {
                    if (cropBox[0] > 0 && cropBox[1] > 0 && mediaBox[0] < 0 && mediaBox[1] < 0) {
                        this.translateTransform(cropBox[0], -cropBox[1]);
                        bounds.x = -cropBox[0];
                        bounds.y = cropBox[1];
                    }
                }
            }
            const state: PdfGraphicsState = this.save();
            let matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
            if (this._page) {
                const needTransform: boolean = (this._page._pageDictionary.has('CropBox') &&
                    this._page._pageDictionary.has('MediaBox') && cropBox && mediaBox &&
                    cropBox[0] === mediaBox[0] && cropBox[1] === mediaBox[1] && cropBox[2] === mediaBox[2] && cropBox[3] === mediaBox[3]) ||
                    (this._page._pageDictionary.has('MediaBox') && mediaBox && mediaBox[3] === 0);
                matrix._translate(bounds.x, -(bounds.y + ((this._page._origin[0] >= 0 || needTransform) ? bounds.height : 0)));
            } else {
                matrix._translate(bounds.x, -(bounds.y + bounds.height));
            }
            if (needScale) {
                if (template._isAnnotationTemplate && template._needScale) {
                    let scaleApplied: boolean = false;
                    if (template._content && template._content.dictionary) {
                        const dictionary: _PdfDictionary = template._content.dictionary;
                        if (dictionary.has('Matrix') && dictionary.has('BBox')) {
                            const templateMatrix: number[] = dictionary.getArray('Matrix');
                            const templateBox: number[] = dictionary.getArray('BBox');
                            if (templateMatrix && templateBox && templateMatrix.length > 5 && templateBox.length > 3) {
                                const templateScaleX: number = Number.parseFloat(_numberToString(-templateMatrix[1]));
                                const templateScaleY: number = Number.parseFloat(_numberToString(templateMatrix[2]));
                                const roundScaleX: number = Number.parseFloat(_numberToString(scaleX));
                                const roundScaleY: number = Number.parseFloat(_numberToString(scaleY));
                                if (roundScaleX === templateScaleX &&
                                    roundScaleY === templateScaleY &&
                                    templateBox[2] === template._size[0] &&
                                    templateBox[3] === template._size[1]) {
                                    matrix = new _PdfTransformationMatrix();
                                    matrix._translate(bounds.x - templateMatrix[4], bounds.y + templateMatrix[5]);
                                    matrix._scale(1, 1);
                                    scaleApplied = true;
                                }
                            }
                        }
                    }
                    if (!scaleApplied) {
                        matrix._scale(scaleX, scaleY);
                    }
                } else {
                    matrix._scale(scaleX, scaleY);
                }
            }
            this._sw._modifyCtm(matrix);
            let sourceDictionary: _PdfDictionary;
            let isReference: boolean = false;
            let keyName: _PdfName;
            let isNew: boolean = true;
            let ref: _PdfReference;
            if (this._resourceObject.has('XObject')) {
                const obj: any = this._resourceObject.getRaw('XObject'); // eslint-disable-line
                if (obj instanceof _PdfReference) {
                    isReference = true;
                    sourceDictionary = this._crossReference._fetch(obj);
                } else if (obj instanceof _PdfDictionary) {
                    sourceDictionary = obj;
                }
                if (sourceDictionary) {
                    isNew = false;
                    this._resources.forEach((value: _PdfName, key: _PdfReference) => {
                        if (key && key instanceof _PdfReference) {
                            const base: _PdfBaseStream = this._crossReference._fetch(key);
                            if (base && template && base === template._content) {
                                keyName = value;
                                ref = key;
                            }
                        }
                    });
                }
            }
            if (isNew) {
                sourceDictionary = new _PdfDictionary(this._crossReference);
                this._resourceObject.update('XObject', sourceDictionary);
            }
            if (typeof keyName === 'undefined') {
                keyName = _PdfName.get(_getNewGuidString());
                if (template && template._content.reference) {
                    ref = template._content.reference;
                } else if (this._crossReference) {
                    ref = this._crossReference._getNextReference();
                } else {
                    this._pendingResource.push({'resource': template._content, 'key': keyName, 'source': sourceDictionary});
                }
                if (ref && this._crossReference) {
                    if (!this._crossReference._cacheMap.has(ref) && template && template._content) {
                        this._crossReference._cacheMap.set(ref, template._content);
                    }
                    sourceDictionary.update(keyName.name, ref);
                    this._resources.set(ref, keyName);
                }
                this._resourceObject._updated = true;
            }
            if (isReference) {
                this._resourceObject._updated = true;
            }
            if (this._hasResourceReference) {
                this._source._updated = true;
            }
            this._sw._executeObject(keyName);
            this.restore(state);
            _addProcSet('ImageB', this._resourceObject);
            _addProcSet('ImageC', this._resourceObject);
            _addProcSet('ImageI', this._resourceObject);
            _addProcSet('Text', this._resourceObject);
        }
    }
    _processResources(crossReference: _PdfCrossReference): void {
        this._crossReference = crossReference;
        if (this._pendingResource.length > 0) {
            for (let i: number = 0; i < this._pendingResource.length; i++) {
                const entry: any = this._pendingResource[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                if (entry instanceof PdfTemplate) {
                    entry._crossReference = crossReference;
                    entry._updatePendingResource(crossReference);
                } else if (entry.resource instanceof _PdfBaseStream) {
                    let reference: _PdfReference;
                    if (entry.resource._reference) {
                        reference = entry.resource._reference;
                    } else {
                        reference = crossReference._getNextReference();
                        entry.resource._reference = reference;
                    }
                    if (!crossReference._cacheMap.has(reference) && entry.resource) {
                        crossReference._cacheMap.set(reference, entry.resource);
                    }
                    entry.source.update(entry.key.name, reference);
                    this._resources.set(reference, entry.key);
                } else if (entry.resource instanceof PdfImage) {
                    this._updateImageResource(entry.resource, entry.key, entry.source, crossReference);
                } else if (entry.resource instanceof PdfFont) {
                    this._updateFontResource(entry.resource, entry.key, entry.source, crossReference);
                }
                this._source.update('Resources', this._resourceObject);
                this._source._updated = true;
            }
            this._pendingResource = [];
        }
    }
    _updateImageResource(image: PdfImage, keyName: _PdfName, source: _PdfDictionary, crossReference: _PdfCrossReference): void {
        let reference: _PdfReference;
        if (image._reference) {
            reference = image._reference;
        } else {
            reference = crossReference._getNextReference();
            image._reference = reference;
        }
        if (!crossReference._cacheMap.has(reference)) {
            if (image && image._imageStream && image._imageStream.dictionary) {
                crossReference._cacheMap.set(reference, image._imageStream);
                image._imageStream.dictionary._updated = true;
                if (image._maskStream && image._maskStream.dictionary) {
                    let ref: _PdfReference;
                    if (image._maskReference) {
                        ref = image._maskReference;
                    } else {
                        ref = crossReference._getNextReference();
                        image._maskReference = ref;
                    }
                    crossReference._cacheMap.set(ref, image._maskStream);
                    image._maskStream.dictionary._updated = true;
                    image._imageStream.dictionary.set('SMask', ref);
                }
            }
        }
        source.update(keyName.name, reference);
        this._resources.set(reference, keyName);
        this._resourceObject._updated = true;
    }
    _updateFontResource(font: PdfFont, keyName: _PdfName, source: _PdfDictionary, crossReference: _PdfCrossReference): void {
        let reference: _PdfReference;
        if (font._reference) {
            reference = font._reference;
        } else {
            reference = crossReference._getNextReference();
            font._reference = reference;
        }
        if (!crossReference._cacheMap.has(reference)) {
            if (font._dictionary) {
                crossReference._cacheMap.set(reference, font._dictionary);
                source.update(keyName.name, reference);
                this._resources.set(reference, keyName);
            } else if (font instanceof PdfTrueTypeFont) {
                const internal: _UnicodeTrueTypeFont = font._fontInternal;
                if (internal && internal._fontDictionary) {
                    crossReference._cacheMap.set(reference, internal._fontDictionary);
                }
                source.update(keyName.name, reference);
                this._resources.set(reference, keyName);
            }
        }
    }
    /**
     * Draws a graphics path defined by a pen and path.
     *
     * @param {PdfPath} path The path to be drawn.
     * @param {PdfPen} pen The pen that determines the stroke color, width, and style of the path.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a new path
     * let path: PdfPath = new PdfPath();
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Add lines to the path
     * path.addLine(10, 100, 50, 100);
     * path.addLine(50, 100, 50, 150);
     * path.addLine(50, 150, 10, 100);
     * // Draw the path on the page graphics
     * graphics.drawPath(path, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawPath(path: PdfPath, pen: PdfPen): void
    /**
     * Draws a graphics path defined by a brush and path.
     *
     * @param {PdfPath} path The path to be drawn.
     * @param {PdfBrush} brush The brush that determines the fill color and texture of the path.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a new path
     * let path: PdfPath = new PdfPath();
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Add an ellipse to the path
     * path.addEllipse(200, 200, 100, 50);
     * // Draw the path on the page graphics
     * graphics.drawPath(path, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawPath(path: PdfPath, brush: PdfBrush): void
    /**
     * Draws a graphics path defined by a pen, brush, and path.
     *
     * @param {PdfPath} path The path to be drawn.
     * @param {PdfPen} pen The pen that determines the stroke color, width, and style of the path.
     * @param {PdfBrush} brush The brush that determines the fill color and texture of the path.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a new path
     * let path: PdfPath = new PdfPath();
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Add an ellipse to the path
     * path.addEllipse(200, 200, 100, 50);
     * // Draw the path on the page graphics with both pen and brush
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawPath(path: PdfPath, pen: PdfPen, brush: PdfBrush): void
    drawPath(path: PdfPath, first?: PdfPen | PdfBrush, second?: PdfBrush): void {
        const result: {pen: PdfPen, brush: PdfBrush} = this._setPenBrush(first, second);
        if (result.pen || result.brush) {
            this._buildUpPath(path._points, path._pathTypes);
            this._drawGraphicsPath(result.pen, result.brush, path.fillMode, false);
        }
    }
    /**
     * Draws a rounded rectangle on the page graphics.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the rounded rectangle.
     * @param {number} y The y-coordinate of the upper-left corner of the rounded rectangle.
     * @param {number} width The width of the rounded rectangle.
     * @param {number} height The height of the rounded rectangle.
     * @param {number} radius The radius of the rounded corners of the rectangle.
     * @param {PdfPen} pen The pen that determines the stroke color, width, and style of the rectangle.
     * @param {PdfBrush} brush The brush that determines the fill color and texture of the rectangle.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 0, 255]);
     * // Draw a rounded rectangle on the page graphics
     * graphics.drawRoundedRectangle(10, 20, 100, 200, 5, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawRoundedRectangle(x: number, y: number, width: number, height: number, radius: number, pen: PdfPen, brush: PdfBrush): void {
        if (pen === null) {
            throw new Error('pen');
        }
        if (brush === null) {
            throw new Error('brush');
        }
        const bounds: number[] = [x, y, width, height];
        const diameter: number = radius * 2;
        const size: number[] = [diameter, diameter];
        const arc: number[] = [bounds[0], bounds[1], size[0], size[1]];
        const path: PdfPath = new PdfPath();
        if (radius === 0) {
            path.addRectangle(bounds[0], bounds[1], bounds[2], bounds[3]);
            this.drawPath(path, pen, brush);
        } else {
            path._isRoundedRectangle = true;
            path.addArc(arc[0], arc[1], arc[2], arc[3], 180, 90);
            arc[0] = (bounds[0] + bounds[2]) - diameter;
            path.addArc(arc[0], arc[1], arc[2], arc[3], 270, 90);
            arc[1] = (bounds[1] + bounds[3]) - diameter;
            path.addArc(arc[0], arc[1], arc[2], arc[3], 0, 90);
            arc[0] = bounds[0];
            path.addArc(arc[0], arc[1], arc[2], arc[3], 90, 90);
            path.closeFigure();
            this.drawPath(path, pen, brush);
        }
    }
    _constructArcPath(x1: number, y1: number, x2: number, y2: number, start: number, sweep: number): void {
        const points: number[] = _getBezierArc(x1, y1, x2, y2, start, sweep);
        if (points.length === 8) {
            return;
        }
        let point: number[] = [points[0], points[1], points[2], points[3], points[4], points[5], points[6], points[7]];
        this._sw._beginPath(point[0], point[1]);
        for (let i: number = 0 ; i < points.length; i = i + 8) {
            point = [points[Number.parseInt(i.toString(), 10)],
                points[i + 1],
                points[i + 2],
                points[i + 3],
                points[i + 4],
                points[i + 5],
                points[i + 6],
                points[i + 7]];
            this._sw._appendBezierSegment(point[2], point[3], point[4], point[5], point[6], point[7]);
        }
    }
    _constructPiePath(x1: number, y1: number, x2: number, y2: number, start: number, sweep: number): void {
        const points: number[] = _getBezierArc(x1, y1, x2, y2, start, sweep);
        if (points.length === 8) {
            let point: number[] = [points[0], points[1], points[2], points[3], points[4], points[5], points[6], points[7]];
            this._sw._beginPath(point[0], point[1]);
            for (let i: number = 0; i < points.length; i = i + 8) {
                point = [points[Number.parseInt(i.toString(), 10)],
                    points[i + 1],
                    points[i + 2],
                    points[i + 3],
                    points[i + 4],
                    points[i + 5],
                    points[i + 6],
                    points[i + 7]];
                this._sw._appendBezierSegment(point[2], point[3], point[4], point[5], point[6], point[7]);
            }
        }
    }
    _writePen(pen: PdfPen): void {
        const lineWidth: number = pen._width;
        const pattern: number[] = pen._dashPattern;
        for (let i: number = 0; i < pattern.length; ++i) {
            pattern[i] *= pen._width; // eslint-disable-line
        }
        this._sw._setLineDashPattern(pattern, pen._dashOffset * lineWidth);
        this._sw._setLineWidth(pen._width);
        this._sw._setLineJoin(pen._lineJoin);
        this._sw._setLineCap(pen._lineCap);
        if (pen._miterLimit > 0) {
            this._sw._setMiterLimit(pen._miterLimit);
        }
        this._sw._setColor(pen._color, true);
    }
    /**
     * Draw text on the page graphics.
     *
     * @param {string} value The string to be drawn.
     * @param {PdfFont} font The font used to draw the string.
     * @param {number[]} bounds An array specifying the bounds [x, y, width, height] where the string will be drawn.
     * @param {PdfPen} pen The pen that determines the stroke color, width, and style of the string.
     * @param {PdfBrush} brush The brush that determines the fill color and texture of the string.
     * @param {PdfStringFormat} format The format that specifies text layout information such as alignment, line spacing, and trimming.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new font
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
     * // Create a new string format
     * let format: PdfStringFormat = new PdfStringFormat();
     * format.alignment = PdfTextAlignment.center;
     * // Draw text on the page graphics
     * graphics.drawString('Hello World', font, [10, 20, 100, 200], pen, new PdfBrush([0, 0, 255]), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawString(value: string,
               font: PdfFont,
               bounds: number[],
               pen?: PdfPen,
               brush?: PdfBrush,
               format?: PdfStringFormat): void {
        const layouter: _PdfStringLayouter = new _PdfStringLayouter();
        const result: _PdfStringLayoutResult = layouter._layout(value, font, format, [bounds[2], bounds[3]]);
        if (!result._empty) {
            const rect: number[] = this._checkCorrectLayoutRectangle(result._actualSize, bounds[0], bounds[1], format);
            if (bounds[2] <= 0) {
                bounds[0] = rect[0];
                bounds[2] = rect[2];
            }
            if (bounds[3] <= 0) {
                bounds[1] = rect[1];
                bounds[3] = rect[3];
            }
            this._drawStringLayoutResult(result, font, pen, brush, bounds, format);
        }
        _addProcSet('Text', this._resourceObject);
    }
    _buildUpPath(points: Array<number[]>, types: PathPointType[]): void {
        for (let i: number = 0; i < points.length; i++) {
            const point: number[] = points[Number.parseInt(i.toString(), 10)];
            let type: PathPointType = types[Number.parseInt(i.toString(), 10)];
            switch (type & 0xf) {
            case PathPointType.start:
                this._sw._beginPath(point[0], point[1]);
                break;
            case PathPointType.bezier:
                let result: { index: number, point: number[] } = this._getBezierPoint(points, types, i); // eslint-disable-line
                i = result.index;
                const first: number[] = result.point; // eslint-disable-line
                result = this._getBezierPoint(points, types, i);
                i = result.index;
                const second: number[] = result.point; // eslint-disable-line
                this._sw._appendBezierSegment(point[0], point[1], first[0], first[1], second[0], second[1]);
                break;
            case PathPointType.line:
                this._sw._appendLineSegment(point[0], point[1]);
                break;
            default:
                throw new Error('Incorrect path formation.');
            }
            type = types[Number.parseInt(i.toString(), 10)];
            if ((type & PathPointType.closePath) === PathPointType.closePath) {
                this._sw._closePath();
            }
        }
    }
    _getBezierPoint(points: Array<number[]>, types: PathPointType[], index: number): {index: number, point: number[]} {
        if (types[Number.parseInt(index.toString(), 10)] !== PathPointType.bezier) {
            throw new Error('Malforming path.');
        }
        index++;
        return { 'index': index, 'point': points[Number.parseInt(index.toString(), 10)] };
    }
    _initialize(): void {
        this._mediaBoxUpperRightBound = 0;
        this._characterSpacing = -1;
        this._wordSpacing = -1;
        this._textScaling = -100;
        this._textRenderingMode = -1;
        this._graphicsState = [];
        this._clipBounds = [0, 0, this._size[0], this._size[1]];
        this._colorSpaceInitialized = false;
        this._startCutIndex = -1;
    }
    _initializeCurrentColorSpace(): void {
        if (!this._colorSpaceInitialized) {
            this._sw._setColorSpace('DeviceRGB', true);
            this._sw._setColorSpace('DeviceRGB', false);
            this._colorSpaceInitialized = true;
        }
    }
    _brushControl(brush: PdfBrush): void {
        this._sw._setColor(brush._color, false);
        this._currentBrush = brush;
    }
    _penControl(pen: PdfPen): void {
        this._currentPen = pen;
        this._writePen(pen);
        this._currentPen = pen;
    }
    _fontControl(font: PdfFont, format: PdfStringFormat): void {
        const size: number = font._metrics._getSize(format);
        this._currentFont = font;
        let sourceDictionary: _PdfDictionary;
        let isReference: boolean = false;
        let keyName: _PdfName;
        let isNew: boolean = true;
        let ref: _PdfReference;
        let hasResource: boolean = false;
        if (this._resourceObject.has('Font')) {
            const obj: any = this._resourceObject.getRaw('Font'); // eslint-disable-line
            if (obj !== null && typeof obj !== 'undefined') {
                if (obj instanceof _PdfReference) {
                    isReference = true;
                    sourceDictionary = this._crossReference._fetch(obj);
                } else if (obj instanceof _PdfDictionary) {
                    sourceDictionary = obj;
                }
            }
            if (typeof sourceDictionary !== 'undefined' && sourceDictionary !== null) {
                isNew = false;
                this._resources.forEach((value: _PdfName, key: _PdfReference) => {
                    if (this._crossReference) {
                        if (key !== null && typeof key !== 'undefined') {
                            const dictionary: _PdfDictionary = this._crossReference._fetch(key);
                            if (dictionary && ((font instanceof PdfStandardFont && dictionary === font._dictionary) ||
                                (font instanceof PdfTrueTypeFont && dictionary === font._fontInternal._fontDictionary))) {
                                keyName = value;
                                ref = key;
                                hasResource = true;
                            }
                        }
                    } else if (font._reference && font._reference === key) {
                        keyName = value;
                        ref = key;
                        hasResource = true;
                    }
                });
            }
        }
        if (isNew) {
            sourceDictionary = new _PdfDictionary(this._crossReference);
            this._resourceObject.update('Font', sourceDictionary);
        }
        if (typeof keyName === 'undefined') {
            keyName = _PdfName.get(_getNewGuidString());
            if (!ref) {
                if (font._reference) {
                    ref = font._reference;
                    sourceDictionary.update(keyName.name, ref);
                } else if (this._crossReference) {
                    ref = this._crossReference._getNextReference();
                } else {
                    this._pendingResource.push({'resource': font, 'key': keyName, 'source': sourceDictionary});
                }
            }
            if (ref && this._crossReference) {
                if (!font._reference) {
                    font._reference = ref;
                }
                if (font._dictionary) {
                    this._crossReference._cacheMap.set(ref, font._dictionary);
                    sourceDictionary.update(keyName.name, ref);
                } else if (font instanceof PdfTrueTypeFont) {
                    const internal: _UnicodeTrueTypeFont = font._fontInternal;
                    if (internal && internal._fontDictionary) {
                        this._crossReference._cacheMap.set(ref, internal._fontDictionary);
                    }
                    sourceDictionary.update(keyName.name, ref);
                }
            }
            if (!hasResource) {
                this._resources.set(ref, keyName);
            }
        }
        if (isReference) {
            this._resourceObject._updated = true;
        }
        if (this._hasResourceReference) {
            this._source._updated = true;
        }
        this._sw._setFont(keyName.name, size);
    }
    _setPenBrush(first?: PdfPen | PdfBrush, second?: PdfBrush): {pen: PdfPen, brush: PdfBrush} {
        let pen: PdfPen;
        let brush: PdfBrush;
        if (first) {
            if (first instanceof PdfPen) {
                pen = first;
            } else {
                brush = first;
            }
        }
        if (second && second instanceof PdfBrush) {
            brush = second;
        }
        this._stateControl(pen, brush, null);
        return {pen, brush};
    }
    _stateControl(pen?: PdfPen, brush?: PdfBrush, font?: PdfFont, format?: PdfStringFormat): void {
        if (pen || brush) {
            this._initializeCurrentColorSpace();
        }
        if (pen) {
            this._penControl(pen);
        }
        if (brush) {
            this._brushControl(brush);
        }
        if (font) {
            this._fontControl(font, format);
        }
    }
    _drawStringLayoutResult(result: _PdfStringLayoutResult,
                            font: PdfFont,
                            pen: PdfPen,
                            brush: PdfBrush,
                            layoutRectangle: number[],
                            format: PdfStringFormat): void {
        if (!result._empty) {
            const allowPartialLines: boolean = (format && typeof format.lineLimit !== 'undefined' && !format.lineLimit);
            const shouldClip: boolean = (typeof format === 'undefined' || (format && typeof format.noClip !== 'undefined'
                && !format.noClip));
            const clipRegion: boolean = allowPartialLines && shouldClip;
            let state: PdfGraphicsState;
            if (clipRegion) {
                state = this.save();
                const clipBounds: number[] = [layoutRectangle[0], layoutRectangle[1], result._actualSize[0], result._actualSize[1]];
                if (layoutRectangle[2] > 0) {
                    clipBounds[2] = layoutRectangle[2];
                }
                if (format.lineAlignment === PdfVerticalAlignment.middle) {
                    clipBounds[1] += (layoutRectangle[3] - clipBounds[3]) / 2;
                } else if (format.lineAlignment === PdfVerticalAlignment.bottom) {
                    clipBounds[1] += (layoutRectangle[3] - clipBounds[3]);
                }
                this.setClip(clipBounds);
            }
            this._applyStringSettings(font, pen, brush, format);
            const textScaling: number = (typeof format !== 'undefined' && format !== null) ? format.horizontalScalingFactor : 100.0;
            if (textScaling !== this._textScaling) {
                this._sw._setTextScaling(textScaling);
                this._textScaling = textScaling;
            }
            let verticalAlignShift: number = this._getTextVerticalAlignShift(result._actualSize[1], layoutRectangle[3], format);
            const height: number = (typeof format === 'undefined' || format === null || format.lineSpacing === 0) ?
                font._metrics._getHeight(format) :
                format.lineSpacing + font._metrics._getHeight(format);
            const script: boolean = (format !== null && typeof format !== 'undefined' &&
                format.subSuperScript === PdfSubSuperScript.subScript);
            let shift: number = 0;
            shift = (script) ? height - (font.height + font._metrics._getDescent(format)) : (height - font._metrics._getAscent(format));
            if (format && format.lineAlignment === PdfVerticalAlignment.bottom) {
                if (layoutRectangle[3] - result._actualSize[1] !== 0 &&
                    (layoutRectangle[3] - result._actualSize[1]) < (font._metrics._size / 2) - 1) {
                    if (Number.parseFloat(_numberToString(layoutRectangle[3])) <=
                        Number.parseFloat(_numberToString(font._metrics._getHeight(format)))) {
                        shift = -(height / font._metrics._size);
                    }
                }
            }
            const matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
            matrix._translate(layoutRectangle[0], (-(layoutRectangle[1] + font._metrics._getHeight(format)) -
                (font._metrics._getDescent(format) > 0 ? -font._metrics._getDescent(format) : font._metrics._getDescent(format))) -
                verticalAlignShift);
            this._sw._modifyTM(matrix);
            if (layoutRectangle[3] < font._metrics._size) {
                if ((result._actualSize[1] - layoutRectangle[3]) < (font._metrics._size / 2) - 1) {
                    verticalAlignShift = 0;
                }
            }
            if (verticalAlignShift !== 0) {
                if (format !== null && format.lineAlignment === PdfVerticalAlignment.bottom) {
                    if (layoutRectangle[3] - result._actualSize[1] !== 0 &&
                        (layoutRectangle[3] - result._actualSize[1]) > (font._metrics._size / 2) - 1) {
                        verticalAlignShift -= (shift - (height - font._metrics._size)) / 2;
                    }
                }
            }
            this._drawLayoutResult(result, font, format, layoutRectangle);
            if (verticalAlignShift !== 0) {
                this._sw._startNextLine(0, -(verticalAlignShift - result._lineHeight));
            }
            _addProcSet('Text', this._resourceObject);
            this._sw._endText();
            this._underlineStrikeoutText(brush, result, font, layoutRectangle, format);
            if (clipRegion) {
                this.restore(state);
            }
        }
    }
    _getNextPage(): PdfPage {
        let page: PdfPage;
        const pageCount: number = this._crossReference._document.pageCount;
        if (this._page._pageIndex <= pageCount - 2) {
            page = this._crossReference._document.getPage(this._page._pageIndex + 1);
        } else {
            page = this._crossReference._document.addPage();
        }
        return page;
    }
    _applyStringSettings(font: PdfFont, pen: PdfPen, brush: PdfBrush, format: PdfStringFormat): void {
        let tm: _TextRenderingMode = _TextRenderingMode.fill;
        if (pen && brush) {
            tm = _TextRenderingMode.fillStroke;
        } else if (pen) {
            tm = _TextRenderingMode.stroke;
        } else if (brush) {
            tm = _TextRenderingMode.fill;
        }
        if (format && format.clipPath) {
            tm |= _TextRenderingMode.clipFlag;
        }
        this._sw._beginText();
        this._stateControl(pen, brush, font, format);
        if (tm !== this._textRenderingMode) {
            this._sw._setTextRenderingMode(tm);
            this._textRenderingMode = tm;
        }
        const cs: number = (typeof format !== 'undefined' && format !== null) ? format.characterSpacing : 0;
        if (cs !== this._characterSpacing) {
            this._sw._setCharacterSpacing(cs);
            this._characterSpacing = cs;
        }
        const ws: number = (typeof format !== 'undefined' && format !== null) ? format.wordSpacing : 0;
        if (ws !== this._wordSpacing) {
            this._sw._setWordSpacing(ws);
            this._wordSpacing = ws;
        }
    }
    _drawLayoutResult(result: _PdfStringLayoutResult, font: PdfFont, format: PdfStringFormat, layoutRectangle: number[]): void {
        const height: number = (typeof format === 'undefined' || format === null || format.lineSpacing === 0) ?
            font._metrics._getHeight(format) :
            format.lineSpacing + font._metrics._getHeight(format);
        const lines: _LineInfo[] = result._lines;
        const ttfFont: PdfTrueTypeFont = font as PdfTrueTypeFont;
        const unicode: boolean = (ttfFont !== null && ttfFont.isUnicode);
        for (let i: number = 0, len: number = lines.length; (i < len && i !== this._startCutIndex); i++) {
            const lineInfo: _LineInfo = lines[Number.parseInt(i.toString(), 10)];
            const lineWidth: number = lineInfo._width;
            const hAlignShift: number = this._getHorizontalAlignShift(lineWidth, layoutRectangle[2], format) +
                this._getLineIndent(lineInfo, format, layoutRectangle[2], (i === 0));
            if (hAlignShift !== 0) {
                this._sw._startNextLine(hAlignShift, 0);
            }
            if (unicode) {
                this._drawUnicodeLine(lineInfo, layoutRectangle[2], font, format);
            } else {
                this._drawAsciiLine(lineInfo, layoutRectangle[2], format, font);
            }
            if ((i + 1 !== len)) {
                const vAlignShift: number = this._getTextVerticalAlignShift(result._actualSize[1], layoutRectangle[3], format);
                const matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
                const baseline: number = ((-(layoutRectangle[1] + font._metrics._getHeight(format)) -
                    font._metrics._getDescent(format)) -
                    vAlignShift) -
                    (height * (i + 1));
                matrix._translate(layoutRectangle[0], baseline);
                this._sw._modifyTM(matrix);
            }
        }
    }
    _drawUnicodeLine(lineInfo: _LineInfo, width: number, font: PdfFont, format: PdfStringFormat): void {
        const line: string = lineInfo._text;
        const rtl: boolean = (format !== null && typeof format !== 'undefined' && format.rightToLeft);
        const useWordSpace: boolean = (format !== null && typeof format !== 'undefined' && (format.wordSpacing !== 0 ||
                                    format.alignment === PdfTextAlignment.justify));
        const ttfFont: PdfTrueTypeFont = font as PdfTrueTypeFont;
        const wordSpacing: number = this._justifyLine(lineInfo, width, format, ttfFont);
        const rtlRender: _RtlRenderer = new _RtlRenderer();
        if (rtl || (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.none)) {
            let blocks: string[] = [];
            const rightAlign: boolean  = (format !== null && typeof format !== 'undefined' && format.alignment === PdfTextAlignment.right);
            if (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.none) {
                blocks = rtlRender._layout(line, ttfFont, (format.textDirection === PdfTextDirection.rightToLeft) ? true : false,
                                           useWordSpace, format);
            } else {
                blocks = rtlRender._layout(line, ttfFont, rightAlign, useWordSpace, format);
            }
            let words: string[] = [];
            if (blocks.length > 1) {
                if (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.none) {
                    words = rtlRender._splitLayout(line, ttfFont, (format.textDirection === PdfTextDirection.rightToLeft) ? true : false,
                                                   useWordSpace, format);
                }
            } else {
                words = [line];
            }
            this._drawUnicodeBlocks(blocks, words, ttfFont, format, wordSpacing);
        } else {
            if (useWordSpace) {
                const result: { tokens: string[], words: string[] } = this._breakUnicodeLine(line, ttfFont, null);
                const blocks: string[] = result.tokens;
                const words: string[] = result.words;
                this._drawUnicodeBlocks(blocks, words, ttfFont, format, wordSpacing);
            } else {
                const token: string = this._convertToUnicode(line, ttfFont);
                this._sw._showNextLineText(token, true);
            }
        }
    }
    _drawUnicodeBlocks(blocks: string[], words: string[], font: PdfTrueTypeFont, format: PdfStringFormat, wordSpacing: number): void {
        if (blocks !== null && typeof blocks !== 'undefined' && blocks.length > 0 && words !== null && typeof words !== 'undefined' &&
            words.length > 0 && font !== null && typeof font !== 'undefined') {
            this._sw._startNextLine();
            let x: number = 0;
            let xShift: number = 0;
            let firstLineIndent: number = 0;
            let paragraphIndent: number = 0;
            try {
                if (format !== null && typeof format !== 'undefined') {
                    firstLineIndent = format.firstLineIndent;
                    paragraphIndent = format.paragraphIndent;
                    format.firstLineIndent = 0;
                    format.paragraphIndent = 0;
                }
                let spaceWidth: number = font._getCharacterWidth(_StringTokenizer._whiteSpace, format) + wordSpacing;
                const characterSpacing: number = (format !== null) ? format.characterSpacing : 0;
                const wordSpace: number = (format !== null && typeof format !== 'undefined' && wordSpacing === 0) ? format.wordSpacing : 0;
                spaceWidth += characterSpacing + wordSpace;
                for (let i: number = 0; i < blocks.length; i++) {
                    const token: string = blocks[i]; //eslint-disable-line
                    const word: string = words[i]; //eslint-disable-line
                    let tokenWidth: number = 0;
                    if (x !== 0) {
                        this._sw._startNextLine(x, 0);
                    }
                    if (word.length > 0) {
                        tokenWidth += font.measureString(word, format)[0];
                        tokenWidth += characterSpacing;
                        this._sw._showText(token);
                    }
                    if (i !== blocks.length - 1) {
                        x = tokenWidth + spaceWidth;
                        xShift += x;
                    }
                }
                if (xShift > 0) {
                    this._sw._startNextLine(-xShift, 0);
                }
            }
            finally {
                if (format !== null && typeof format !== 'undefined') {
                    format.firstLineIndent = firstLineIndent;
                    format.paragraphIndent = paragraphIndent;
                }
            }
        }
    }
    _breakUnicodeLine(line: string, ttfFont: PdfTrueTypeFont, words: string[]): {tokens: string[], words: string[]} {
        const tokens: string[] = [];
        if (line !== null && typeof line !== 'undefined' && line.length > 0) {
            words = line.split(null);
            for (let i: number = 0; i < words.length; i++) {
                const word: string = words[i]; //eslint-disable-line
                const token: string = this._convertToUnicode(word, ttfFont);
                tokens[Number.parseInt(i.toString(), 10)] = token;
            }
        }
        return { tokens: tokens, words: words };
    }
    _convertToUnicode(text: string, ttfFont: PdfTrueTypeFont): string {
        let token: string = null;
        if (text !== null && typeof text !== 'undefined' && ttfFont !== null && typeof ttfFont !== 'undefined' &&
            ttfFont._fontInternal instanceof _UnicodeTrueTypeFont) {
            const ttfReader: _TrueTypeReader = (ttfFont._fontInternal as _UnicodeTrueTypeFont)._ttfReader;
            ttfFont._setSymbols(text);
            token = ttfReader._convertString(text);
            const bytes: Uint8Array = _stringToUnicodeArray(token);
            token = _bytesToString(bytes as Uint8Array);
        }
        return token;
    }
    _getTextVerticalAlignShift(textHeight: number, boundsHeight: number, format: PdfStringFormat): number {
        let shift: number = 0;
        if (boundsHeight >= 0 && (typeof format !== 'undefined' && format !== null) && format.lineAlignment !== PdfVerticalAlignment.top) {
            switch (format.lineAlignment) {
            case PdfVerticalAlignment.middle:
                shift = (boundsHeight - textHeight) / 2;
                break;
            case PdfVerticalAlignment.bottom:
                shift = boundsHeight - textHeight;
                break;
            }
        }
        return shift;
    }
    _getHorizontalAlignShift(lineWidth: number, boundsWidth: number, format: PdfStringFormat): number {
        let shift: number = 0;
        if (boundsWidth >= 0 && (typeof format !== 'undefined' && format !== null) && format.alignment !== PdfTextAlignment.left) {
            switch (format.alignment) {
            case PdfTextAlignment.center:
                shift = (boundsWidth - lineWidth) / 2;
                break;
            case PdfTextAlignment.right:
                shift = boundsWidth - lineWidth;
                break;
            }
        }
        return shift;
    }
    _getLineIndent(lineInfo: _LineInfo, format: PdfStringFormat, width: number, firstLine: boolean): number {
        let lineIndent: number = 0;
        const firstParagraphLine: boolean = ((lineInfo._lineType & _LineType.firstParagraphLine) > 0);
        if (format && firstParagraphLine) {
            lineIndent = (firstLine) ? format.firstLineIndent : format.paragraphIndent;
            lineIndent = (width > 0) ? Math.min(width, lineIndent) : lineIndent;
        }
        return lineIndent;
    }
    _drawAsciiLine(lineInfo: _LineInfo, width: number, format: PdfStringFormat, font: PdfFont): void {
        this._justifyLine(lineInfo, width, format, font);
        let value: string = '';
        if (lineInfo._text.indexOf('(') !== -1 || lineInfo._text.indexOf(')') !== -1) {
            for (let i: number = 0; i < lineInfo._text.length; i ++) {
                if (lineInfo._text[Number.parseInt(i.toString(), 10)] === '(') {
                    value += '\\\('; // eslint-disable-line
                } else if (lineInfo._text[Number.parseInt(i.toString(), 10)] === ')') {
                    value += '\\\)'; // eslint-disable-line
                } else {
                    value += lineInfo._text[Number.parseInt(i.toString(), 10)];
                }
            }
        }
        if (value === '') {
            value = lineInfo._text;
        }
        this._sw._showNextLineText('(' + value + ')');
    }
    _justifyLine(lineInfo: _LineInfo, boundsWidth: number, format: PdfStringFormat, font: PdfFont): number {
        const line: string = lineInfo._text;
        let lineWidth: number = lineInfo._width;
        const shouldJustify: boolean = this._shouldJustify(lineInfo, boundsWidth, format, font);
        const hasWordSpacing: boolean = (format && format.wordSpacing !== 0);
        const whitespacesCount: number = font._getCharacterCount(line, [' ', '\t']);
        let wordSpace: number = 0;
        if (shouldJustify) {
            if (hasWordSpacing) {
                lineWidth -= (whitespacesCount * format.wordSpacing);
            }
            wordSpace = (boundsWidth - lineWidth) / whitespacesCount;
            this._sw._setWordSpacing(wordSpace);
        } else if (format && format.alignment === PdfTextAlignment.justify) {
            this._sw._setWordSpacing(0);
        }
        return wordSpace;
    }
    _shouldJustify(lineInfo: _LineInfo, boundsWidth: number, format: PdfStringFormat, font: PdfFont): boolean {
        const line: string = lineInfo._text;
        const lineWidth: number = lineInfo._width;
        const justifyStyle: boolean = (format && format.alignment === PdfTextAlignment.justify);
        const goodWidth: boolean = (boundsWidth >= 0 && lineWidth < boundsWidth);
        const whitespacesCount: number = font._getCharacterCount(line,  [' ', '\t']);
        const hasSpaces: boolean = (whitespacesCount > 0 && line[0] !== ' ');
        const goodLineBreakStyle: boolean = ((lineInfo._lineType & _LineType.layoutBreak) > 0);
        return (justifyStyle && goodWidth && hasSpaces && (goodLineBreakStyle || format.alignment === PdfTextAlignment.justify));
    }
    _underlineStrikeoutText(brush: PdfBrush,
                            result: _PdfStringLayoutResult,
                            font: PdfFont,
                            layoutRectangle: number[],
                            format: PdfStringFormat): void {
        if (font.isUnderline || font.isStrikeout) {
            const linePen: PdfPen = this._createUnderlineStrikeoutPen(brush, font);
            if (typeof linePen !== 'undefined' && linePen !== null) {
                const shift: number = this._getTextVerticalAlignShift(result._actualSize[1], layoutRectangle[3], format);
                let underlineYOffset: number = layoutRectangle[1] + shift + font._metrics._getAscent(format) + 1.5 * linePen._width;
                let strikeoutYOffset: number = layoutRectangle[1] + shift + font._metrics._getHeight(format) / 2 + 1.5 * linePen._width;
                const lines: _LineInfo[] = result._lines;
                for (let i: number = 0; i < result._lineCount; i++) {
                    const lineInfo: _LineInfo = lines[Number.parseInt(i.toString(), 10)];
                    const lineWidth: number = lineInfo._width;
                    const hShift: number = this._getHorizontalAlignShift(lineWidth, layoutRectangle[2], format);
                    const lineIndent: number = this._getLineIndent(lineInfo, format, layoutRectangle[2], (i === 0));
                    const x1: number = layoutRectangle[0] + hShift;
                    const x2: number = (!this._shouldJustify(lineInfo, layoutRectangle[2], format, font)) ?
                        x1 + lineWidth - lineIndent :
                        x1 + layoutRectangle[2] - lineIndent;
                    if (font.isUnderline) {
                        this.drawLine(linePen, x1, underlineYOffset, x2, underlineYOffset);
                        underlineYOffset += result._lineHeight;
                    }
                    if (font.isStrikeout) {
                        this.drawLine(linePen, x1, strikeoutYOffset, x2, strikeoutYOffset);
                        strikeoutYOffset += result._lineHeight;
                    }
                }
            }
        }
    }
    /**
     * Draws a line on the page graphics.
     *
     * @param {PdfPen} pen The pen that determines the stroke color, width, and style of the line.
     * @param {number} x1 The x-coordinate of the starting point of the line.
     * @param {number} y1 The y-coordinate of the starting point of the line.
     * @param {number} x2 The x-coordinate of the ending point of the line.
     * @param {number} y2 The y-coordinate of the ending point of the line.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Draw a line on the page graphics
     * graphics.drawLine(pen, 10, 10, 100, 100);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawLine(pen: PdfPen, x1: number, y1: number, x2: number, y2: number): void {
        this._stateControl(pen);
        this._sw._beginPath(x1, y1);
        this._sw._appendLineSegment(x2, y2);
        this._sw._strokePath();
        _addProcSet('PDF', this._resourceObject);
    }
    _createUnderlineStrikeoutPen(brush: PdfBrush, font: PdfFont): PdfPen{
        return new PdfPen(brush._color, font._metrics._size / 20);
    }
    _checkCorrectLayoutRectangle(textSize: number[], x: number, y: number, format: PdfStringFormat): number[] {
        const layoutedRectangle: number[] = [x, y, textSize[0], textSize[0]];
        if (format) {
            switch (format.alignment) {
            case PdfTextAlignment.center:
                layoutedRectangle[0] = layoutedRectangle[0] - layoutedRectangle[2] / 2;
                break;
            case PdfTextAlignment.right:
                layoutedRectangle[0] = layoutedRectangle[0] - layoutedRectangle[2];
                break;
            }
            switch (format.lineAlignment) {
            case PdfVerticalAlignment.middle:
                layoutedRectangle[1] = layoutedRectangle[1] - layoutedRectangle[3] / 2;
                break;
            case PdfVerticalAlignment.bottom:
                layoutedRectangle[1] = layoutedRectangle[1] - layoutedRectangle[3];
                break;
            }
        }
        return layoutedRectangle;
    }
    _drawGraphicsPath(pen?: PdfPen, brush?: PdfBrush, fillMode?: PdfFillMode, needClosing?: boolean): void {
        if (typeof fillMode === 'undefined') {
            fillMode = PdfFillMode.winding;
        }
        const isBrush: boolean = (typeof brush !== 'undefined' && brush !== null);
        const isPen: boolean = (typeof pen !== 'undefined' && pen !== null);
        const isEvenOdd: boolean = fillMode === PdfFillMode.alternate;
        if (isPen && isBrush) {
            if (needClosing) {
                this._sw._closeFillStrokePath(isEvenOdd);
            } else {
                this._sw._fillStrokePath(isEvenOdd);
            }
        } else if (!isPen && !isBrush) {
            this._sw._endPath();
        } else if (isPen) {
            if (needClosing) {
                this._sw._closeStrokePath();
            } else {
                this._sw._strokePath();
            }
        } else {
            if (needClosing) {
                this._sw._closeFillPath(isEvenOdd);
            } else {
                this._sw._fillPath(isEvenOdd);
            }
        }
    }
    _initializeCoordinates(page?: PdfPage): void {
        let cbox: number[];
        if (page) {
            const location: number[] = [0, 0];
            let needTransformation: boolean = false;
            if (page._pageDictionary.has('CropBox') && page._pageDictionary.has('MediaBox')) {
                cbox = page._pageDictionary.getArray('CropBox');
                const mbox: number[] = page._pageDictionary.getArray('MediaBox');
                if (cbox[0] === mbox[0] && cbox[1] === mbox[1] && cbox[2] === mbox[2] && cbox[3] === mbox[3]) {
                    needTransformation = true;
                }
                if (cbox[0] > 0 && cbox[3] > 0 && mbox[0] < 0 && mbox[1] < 0) {
                    this.translateTransform(cbox[0], -cbox[3]);
                    location[0] = -cbox[0];
                    location[1] = cbox[3];
                } else if (!page._pageDictionary.has('CropBox')) {
                    needTransformation = true;
                }
                if (needTransformation) {
                    this._sw._writeComment('Change co-ordinate system to left/top.');
                    if (this._cropBox) {
                        this.translateTransform(this._cropBox[0], -this._cropBox[3]);
                    } else {
                        if (-(page._origin[1]) < this._mediaBoxUpperRightBound || this._mediaBoxUpperRightBound === 0) {
                            this.translateTransform(0, -this._size[1]);
                        } else {
                            this.translateTransform(0, -this._mediaBoxUpperRightBound);
                        }
                    }
                }
            }
        } else {
            this._sw._writeComment('Change co-ordinate system to left/top.');
            if (this._mediaBoxUpperRightBound !== (-this._size[1])) {
                if (this._cropBox) {
                    cbox = this._cropBox;
                    if (cbox[0] > 0 || cbox[1] > 0 || this._size[0] === cbox[2] || this._size[1] === cbox[3]) {
                        this.translateTransform(cbox[0], -cbox[3]);
                    } else {
                        if (this._mediaBoxUpperRightBound === this._size[1] || this._mediaBoxUpperRightBound === 0) {
                            this.translateTransform(0, -this._size[1]);
                        } else {
                            this.translateTransform(0, -this._mediaBoxUpperRightBound);
                        }
                    }
                } else {
                    if (this._mediaBoxUpperRightBound === this._size[1] || this._mediaBoxUpperRightBound === 0) {
                        this.translateTransform(0, -this._size[1]);
                    } else {
                        this.translateTransform(0, -this._mediaBoxUpperRightBound);
                    }
                }
            }
        }
    }
    /**
     * Represents a scale transform of the graphics.
     *
     * @param {number} scaleX Scale factor in the x direction.
     * @param {number} scaleY Scale factor in the y direction.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // Save the current graphics state
     * let state: PdfGraphicsState = graphics.save();
     * // Apply scale transform
     * graphics.scaleTransform(0.5, 0.5);
     * // Draw a string with the scaled transformation
     * graphics.drawString("Hello world!", font, [10, 20, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * // Restore the graphics to its previous state
     * graphics.restore(state);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    scaleTransform(scaleX: number, scaleY: number): void {
        const matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
        matrix._scale(scaleX, scaleY);
        this._sw._modifyCtm(matrix);
        this._matrix._multiply(matrix);
    }
    /**
     * Represents a translate transform of the graphics.
     *
     * @param {number} x x-coordinate of the translation.
     * @param {number} y y-coordinate of the translation.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // Save the current graphics state
     * let state: PdfGraphicsState = graphics.save();
     * // Apply translate transform
     * graphics.translateTransform(100, 100);
     * // Draw a string with the translation applied
     * graphics.drawString("Hello world!", font, [10, 20, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * // Restore the graphics to its previous state
     * graphics.restore(state);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    translateTransform(x: number, y: number): void {
        const matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
        matrix._translate(x, -y);
        this._sw._modifyCtm(matrix);
        this._matrix._multiply(matrix);
    }
    /**
     * Represents a rotate transform of the graphics.
     *
     * @param {number} angle Angle of rotation in degrees.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // Save the current graphics state
     * let state: PdfGraphicsState = graphics.save();
     * // Apply rotate transform
     * graphics.rotateTransform(-90);
     * // Draw a string with the rotation applied
     * graphics.drawString("Hello world!", font, [10, 20, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * // Restore the graphics to its previous state
     * graphics.restore(state);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    rotateTransform(angle: number): void {
        const matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
        matrix._rotate(-angle);
        this._sw._modifyCtm(matrix);
        this._matrix._multiply(matrix);
    }
    /**
     * Represents a clipping region of this graphics.
     *
     * @param {number[]} bounds Rectangle structure that represents the new clip region, specified as [x, y, width, height].
     * @param {PdfFillMode} mode Member of the PdfFillMode enumeration that specifies the filling operation to use.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // Set clipping region
     * graphics.setClip([0, 0, 50, 12], PdfFillMode.alternate);
     * // Draw a string within the clipping region
     * graphics.drawString("Hello world!", font, [0, 0, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setClip(bounds: number[], mode?: PdfFillMode): void {
        if (typeof mode === 'undefined') {
            mode = PdfFillMode.winding;
        }
        this._sw._appendRectangle(bounds[0], bounds[1], bounds[2], bounds[3]);
        this._sw._clipPath(mode === PdfFillMode.alternate);
    }
    /**
     * Represents a transparency of this graphics.
     *
     * @param {number} stroke The transparency value for the stroke.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // Set transparency
     * graphics.setTransparency(0.5);
     * // Draw a string with transparency
     * graphics.drawString("Hello world!", font, [0, 0, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setTransparency(stroke: number): void
    /**
     * Represents a transparency setting for the graphics.
     *
     * @param {number} stroke The transparency value for strokes.
     * @param {number} fill The transparency value for fills.
     * @param {PdfBlendMode} mode The blend mode to use.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // Set transparency
     * graphics.setTransparency(0.5, 0.5, PdfBlendMode.multiply);
     * // Draw the string
     * graphics.drawString("Hello world!", font, [0, 0, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setTransparency(stroke: number, fill: number, mode: PdfBlendMode): void
    /**
     * Sets the transparency for the graphics.
     *
     * @param {number} stroke The transparency value for strokes.
     * @param {number} fill The transparency value for fills.
     * @param {PdfBlendMode} mode The blend mode to use.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // Set transparency
     * graphics.setTransparency(0.5, 0.5, PdfBlendMode.multiply);
     * // Draw the string
     * graphics.drawString("Hello world!", font, [0, 0, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setTransparency(stroke: number, fill?: number, mode?: PdfBlendMode): void {
        if (typeof fill === 'undefined') {
            fill = stroke;
        }
        if (typeof mode === 'undefined') {
            mode = PdfBlendMode.normal;
        }
        if (typeof this._transparencies === 'undefined') {
            this._transparencies = new Map<_TransparencyData, string>();
        }
        const transparencyKey: string = 'CA:' + stroke.toString() + '_ca:' + fill.toString() + '_BM:' + (mode as number).toString();
        let transparencyData: _TransparencyData;
        if (this._transparencies.size > 0) {
            this._transparencies.forEach((value: string, key: _TransparencyData) => {
                if (value === transparencyKey) {
                    transparencyData = key;
                }
            });
        }
        if (!transparencyData) {
            transparencyData = new _TransparencyData();
            const transparencyDict: _PdfDictionary = new _PdfDictionary();
            transparencyDict.update('CA', stroke);
            transparencyDict.update('ca', fill);
            transparencyDict.update('BM', _reverseMapBlendMode(mode));
            const ref: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(ref, transparencyDict);
            transparencyData._dictionary = transparencyDict;
            transparencyData._key = transparencyKey;
            transparencyData._name = _PdfName.get(_getNewGuidString());
            transparencyData._reference = ref;
            let dictionary: _PdfDictionary;
            let isReference: boolean = false;
            if (this._resourceObject.has('ExtGState')) {
                const obj: any = this._resourceObject.getRaw('ExtGState'); // eslint-disable-line
                if (obj !== null && typeof obj !== 'undefined') {
                    if (obj instanceof _PdfReference) {
                        isReference = true;
                        dictionary = this._crossReference._fetch(obj);
                    } else if (obj instanceof _PdfDictionary) {
                        dictionary = obj;
                    }
                }
            } else {
                dictionary = new _PdfDictionary(this._crossReference);
                this._resourceObject.update('ExtGState', dictionary);
            }
            dictionary.update(transparencyData._name.name, ref);
            if (isReference) {
                this._resourceObject._updated = true;
            }
            if (this._hasResourceReference) {
                this._source._updated = true;
            }
        }
        this._sw._setGraphicsState(transparencyData._name);
    }
    _setTransparencyData(ref: _PdfReference, name: _PdfName): void {
        this._resourceMap.set(ref, name);
        const dictionary: _PdfDictionary = this._crossReference._fetch(ref);
        let stroke: number = 0;
        let fill: number = 0;
        let mode: number = 0;
        if (dictionary.has('CA')) {
            stroke = dictionary.get('CA');
        }
        if (dictionary.has('ca')) {
            fill = dictionary.get('ca');
        }
        if (dictionary.has('ca')) {
            fill = dictionary.get('ca');
        }
        if (dictionary.has('BM')) {
            mode = _mapBlendMode(dictionary.get('BM'));
        }
        const tkey: string = 'CA:' + stroke.toString() + '_ca:' + fill.toString() + '_BM:' + mode.toString();
        const tdata: _TransparencyData = new _TransparencyData();
        tdata._dictionary = dictionary;
        tdata._key = tkey;
        tdata._name = name;
        tdata._reference = ref;
        this._transparencies.set(tdata, tkey);
    }
    _getTranslateTransform(x: number, y: number, input: _PdfTransformationMatrix): _PdfTransformationMatrix {
        input._translate(x, -y);
        return input;
    }
    _getScaleTransform(x: number, y: number, input: _PdfTransformationMatrix) : _PdfTransformationMatrix {
        if (input === null || typeof input === 'undefined') {
            input = new _PdfTransformationMatrix();
        }
        input._scale(x, y);
        return input;
    }
    _clipTranslateMargins(clipBounds: number[]): void {
        this._clipBounds = clipBounds;
        this._sw._writeComment('Clip margins.');
        this._sw._appendRectangle(clipBounds[0], clipBounds[1], clipBounds[2], clipBounds[3]);
        this._sw._closePath();
        this._sw._clipPath(false);
        this._sw._writeComment('Translate co-ordinate system.');
        this.translateTransform(clipBounds[0], clipBounds[1]);
    }
}
export class _PdfTransformationMatrix {
    _matrix: _Matrix;
    constructor() {
        this._matrix = new _Matrix(1, 0, 0, 1, 0, 0);
    }
    _translate(x: number, y: number): void {
        this._matrix._translate(x, y);
    }
    _scale(x: number, y: number): void {
        this._matrix._elements[0] = x;
        this._matrix._elements[3] = y;
    }
    _rotate(angle: number): void {
        angle = (angle * Math.PI) / 180;
        this._matrix._elements[0] = Math.cos(angle);
        this._matrix._elements[1] = Math.sin(angle);
        this._matrix._elements[2] = -Math.sin(angle);
        this._matrix._elements[3] = Math.cos(angle);
    }
    _multiply(matrix: _PdfTransformationMatrix): void {
        this._matrix._multiply(matrix._matrix);
    }
    _toString(): string {
        let builder: string = '';
        for (let i: number = 0, len: number = this._matrix._elements.length; i < len; i++) {
            builder += _floatToString(this._matrix._elements[Number.parseInt(i.toString(), 10)]) + ' ';
        }
        return builder;
    }
}
export class _Matrix {
    _elements: number[];
    public constructor()
    public constructor(elements: number[])
    public constructor(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number)
    public constructor(arg1 ?: number | number[], arg2 ?: number, arg3 ?: number, arg4 ?: number, arg5 ?: number, arg6 ?: number) {
        if (typeof arg1 === 'undefined') {
            this._elements = [];
        } else if (typeof arg1 === 'number') {
            this._elements = [arg1, arg2, arg3, arg4, arg5, arg6];
        } else {
            this._elements = arg1;
        }
    }
    public get _offsetX(): number {
        return this._elements[4];
    }
    public get _offsetY(): number {
        return this._elements[5];
    }
    _clone(): _Matrix {
        return new _Matrix(this._elements.slice());
    }
    public _translate(x: number, y: number): void {
        this._elements[4] = x;
        this._elements[5] = y;
    }
    public _transform(points: number[]): number[] {
        const x: number = points[0];
        const y: number = points[1];
        const x2: number = x * this._elements[0] + y * this._elements[2] + this._offsetX;
        const y2: number = x * this._elements[1] + y * this._elements[3] + this._offsetY;
        return [x2, y2];
    }
    public _multiply(matrix: _Matrix): void {
        this._elements = [(this._elements[0] * matrix._elements[0] + this._elements[1] * matrix._elements[2]),
            (this._elements[0] * matrix._elements[1] + this._elements[1] * matrix._elements[3]),
            (this._elements[2] * matrix._elements[0] + this._elements[3] * matrix._elements[2]),
            (this._elements[2] * matrix._elements[1] + this._elements[3] * matrix._elements[3]),
            (this._offsetX * matrix._elements[0] + this._offsetY * matrix._elements[2] + matrix._offsetX),
            (this._offsetX * matrix._elements[1] + this._offsetY * matrix._elements[3] + matrix._offsetY)];
    }
}
/**
 * Represents a state of the graphics from a PDF page.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * // Create a new font
 * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
 * // Save the graphics state
 * let state: PdfGraphicsState = graphics.save();
 * // Set graphics translate transform
 * graphics.translateTransform(100, 100);
 * // Draw the string
 * graphics.drawString("Hello world!", font, [10, 20, 100, 200], undefined, new PdfBrush([0, 0, 255]));
 * // Restore the graphics state
 * graphics.restore(state);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfGraphicsState {
    _g: PdfGraphics;
    _transformationMatrix: _PdfTransformationMatrix;
    _textRenderingMode: _TextRenderingMode;
    _charSpacing: number;
    _wordSpacing: number;
    _textScaling: number;
    _currentPen: PdfPen;
    _currentBrush: PdfBrush;
    _currentFont: any; // eslint-disable-line
    /**
     * Initializes a new instance of the `PdfGraphicsState` class.
     *
     * @private
     * @param {PdfGraphics} graphics Graphics.
     * @param {_PdfTransformationMatrix} matrix Matrix.
     *
     */
    constructor(graphics: PdfGraphics, matrix: _PdfTransformationMatrix) {
        if (graphics) {
            this._g = graphics;
            this._transformationMatrix = matrix;
        }
        this._charSpacing = 0;
        this._wordSpacing = 0;
        this._textScaling = 100;
        this._textRenderingMode = _TextRenderingMode.fill;
    }
}
class _TransparencyData {
    _key: string;
    _reference: _PdfReference;
    _dictionary: _PdfDictionary;
    _name: _PdfName;
}
export enum _TextRenderingMode {
    fill = 0,
    stroke = 1,
    fillStroke = 2,
    none = 3,
    clipFlag = 4,
    clipFill = fill | clipFlag,
    clipStroke = stroke | clipFlag,
    clipFillStroke = fillStroke | clipFlag,
    clip = none | clipFlag,
}
/**
 * Represents a brush for the PDF page.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * // Create a new brush
 * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
 * // Draw a rectangle using brush
 * graphics.drawRectangle(10, 10, 100, 100, brush);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfBrush {
    _color: number[];
    /**
     * Initializes a new instance of the `PdfBrush` class.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush();
     * // Draw a rectangle using brush
     * graphics.drawRectangle(10, 10, 100, 100, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfBrush` class.
     *
     * @param {number[]} color Color.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Draw a rectangle using brush
     * graphics.drawRectangle(10, 10, 100, 100, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(color: number[])
    /**
     * Initializes a new instance of the `PdfBrush` class.
     *
     * @param {number[]} color Color.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Draw a rectangle using brush
     * graphics.drawRectangle(10, 10, 100, 100, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(color?: number[]) {
        this._color = typeof color !== 'undefined' ? color : [0, 0, 0];
    }
}
/**
 * Represents a pen for the PDF page.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * // Create a new pen
 * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
 * // Draw a rectangle using pen
 * graphics.drawRectangle(150, 50, 50, 50, pen);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPen{
    _color: number[];
    _width: number;
    _dashOffset: number;
    _dashPattern: number[];
    _dashStyle: PdfDashStyle;
    _lineCap: PdfLineCap;
    _lineJoin: PdfLineJoin;
    _miterLimit: number;
    /**
     * Initializes a new instance of the `PdfPen` class.
     *
     * @param {number[]} color Color.
     * @param {number} width Width.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Draw a rectangle using pen
     * graphics.drawRectangle(150, 50, 50, 50, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(color: number[], width: number) {
        this._color = color;
        this._width = width;
        this._dashOffset = 0;
        this._dashPattern = [];
        this._dashStyle = PdfDashStyle.solid;
        this._miterLimit = 0;
        this._lineCap = PdfLineCap.flat;
        this._lineJoin = PdfLineJoin.miter;
    }
}
export class _PdfUnitConvertor {
    _horizontalResolution: number = 96;
    _proportions: number[];
    constructor() {
        this._proportions = this._updateProportions(this._horizontalResolution);
    }
    _updateProportions(pixel: number): number[] {
        return [pixel / 2.54, pixel / 6.0, 1, pixel / 72.0, pixel, pixel / 300.0, pixel / 25.4];
    }
    _convertUnits(value: number, from: _PdfGraphicsUnit, to: _PdfGraphicsUnit): number {
        return this._convertFromPixels(this._convertToPixels(value, from), to);
    }
    _convertFromPixels(value: number, to: _PdfGraphicsUnit): number {
        const index: number = to;
        return (value / this._proportions[Number.parseInt(index.toString(), 10)]);
    }
    _convertToPixels(value: number, from: _PdfGraphicsUnit): number {
        const index: number = from;
        return (value * this._proportions[Number.parseInt(index.toString(), 10)]);
    }
}
