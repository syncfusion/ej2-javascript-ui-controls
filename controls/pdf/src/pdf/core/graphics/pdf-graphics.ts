import { PdfPage } from './../pdf-page';
import { _PdfStreamWriter } from './pdf-stream-writer';
import { _PdfBaseStream, _PdfContentStream } from './../base-stream';
import { _floatToString, _addProcSet, _reverseMapBlendMode, _mapBlendMode, _getNewGuidString, _getBezierArc, _numberToString, _bytesToString, _stringToUnicodeArray } from './../utils';
import { _PdfDictionary, _PdfReference, _PdfName } from './../pdf-primitives';
import { _PdfCrossReference } from './../pdf-cross-reference';
import { PdfFont, PdfTrueTypeFont } from './../fonts/pdf-standard-font';
import { _PdfStringLayouter, _PdfStringLayoutResult, _LineInfo, _LineType, _StringTokenizer } from './../fonts/string-layouter';
import { PdfTextAlignment, _PdfGraphicsUnit, PdfTextDirection, PdfSubSuperScript, PdfBlendMode, PdfLineJoin, PdfLineCap, PdfDashStyle, PdfFillMode } from './../enumerator';
import { PdfStringFormat, PdfVerticalAlignment } from './../fonts/pdf-string-format';
import { PdfTemplate } from './pdf-template';
import { _PdfPath, _PathPointType } from './pdf-path';
import { _UnicodeTrueTypeFont } from '../fonts/unicode-true-type-font';
import { _TrueTypeReader } from './../fonts/ttf-reader';
import { _RtlRenderer } from './../graphics/rightToLeft/text-renderer';
import { PdfImage} from './images/pdf-image';
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
     * Draw rectangle on the page graphics.
     *
     * @param {number} x value.
     * @param {number} y value.
     * @param {number} width value.
     * @param {number} height value.
     * @param {PdfPen} pen value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * //Draw rectangle on the page graphics.
     * graphics.drawRectangle(10, 20, 100, 200, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawRectangle(x: number, y: number, width: number, height: number, pen: PdfPen): void
    /**
     * Draw rectangle on the page graphics.
     *
     * @param {number} x value.
     * @param {number} y value.
     * @param {number} width value.
     * @param {number} height value.
     * @param {PdfBrush} brush value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new brush.
     * let brush: PdfBrush = new PdfBrush([0, 0, 255]);
     * //Draw rectangle on the page graphics.
     * graphics.drawRectangle(10, 20, 100, 200, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawRectangle(x: number, y: number, width: number, height: number, brush: PdfBrush): void
    /**
     * Draw rectangle on the page graphics.
     *
     * @param {number} x value.
     * @param {number} y value.
     * @param {number} width value.
     * @param {number} height value.
     * @param {PdfPen} pen value.
     * @param {PdfBrush} brush value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * //Create a new brush.
     * let brush: PdfBrush = new PdfBrush([0, 0, 255]);
     * //Draw rectangle on the page graphics.
     * graphics.drawRectangle(10, 20, 100, 200, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawRectangle(x: number, y: number, width: number, height: number, pen: PdfPen, brush: PdfBrush): void
    drawRectangle(x: number, y: number, width: number, height: number, first?: PdfPen| PdfBrush, second?: PdfBrush): void {
        let pen: PdfPen;
        let brush: PdfBrush;
        if (first instanceof PdfPen) {
            pen = first;
            if (second) {
                brush = second;
            }
        } else {
            brush = first;
        }
        this._stateControl(pen, brush);
        this._sw._appendRectangle(x, y, width, height);
        this._drawGraphicsPath(pen, brush);
    }
    /**
     * Draw polygon on the page graphics.
     *
     * @param {Array<number[]>} points value.
     * @param {PdfPen} pen value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * //Create the polygon points.
     * let points: number[][] = [[10, 100], [10, 200], [100, 100], [100, 200], [55, 150]];
     * //Draw polygon on the page graphics.
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
     * @param {Array<number[]>} points value.
     * @param {PdfBrush} brush value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new brush.
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * //Create the polygon points.
     * let points: number[][] = [[10, 100], [10, 200], [100, 100], [100, 200], [55, 150]];
     * //Draw polygon on the page graphics.
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
     * @param {Array<number[]>} points value.
     * @param {PdfPen} pen value.
     * @param {PdfBrush} brush value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * //Create a new brush.
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * //Create the polygon points.
     * let points: number[][] = [[10, 100], [10, 200], [100, 100], [100, 200], [55, 150]];
     * //Draw polygon on the page graphics.
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
            let pen: PdfPen;
            let brush: PdfBrush;
            if (first instanceof PdfPen) {
                pen = first;
                if (second) {
                    brush = second;
                }
            } else {
                brush = first;
            }
            this._stateControl(pen, brush);
            this._sw._beginPath(points[0][0], points[0][1]);
            for (let i: number = 1; i < points.length; i++) {
                this._sw._appendLineSegment(points[Number.parseInt(i.toString(), 10)][0], points[Number.parseInt(i.toString(), 10)][1]);
            }
            this._drawGraphicsPath(pen, brush, PdfFillMode.winding, true);
        }
    }
    /**
     * Draw ellipse on the page graphics.
     *
     * @param {number} x value.
     * @param {number} y value.
     * @param {number} width value.
     * @param {number} height value.
     * @param {PdfPen} pen value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * //Draw ellipse on the page graphics.
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
     * @param {number} x value.
     * @param {number} y value.
     * @param {number} width value.
     * @param {number} height value.
     * @param {PdfBrush} brush value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new brush.
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * //Draw ellipse on the page graphics.
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
     * @param {number} x value.
     * @param {number} y value.
     * @param {number} width value.
     * @param {number} height value.
     * @param {PdfPen} pen value.
     * @param {PdfBrush} brush value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * //Create a new brush.
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * //Draw ellipse on the page graphics.
     * graphics.drawEllipse(10, 20, 100, 200, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawEllipse(x: number, y: number, width: number, height: number, pen: PdfPen, brush: PdfBrush): void
    drawEllipse(x: number, y: number, width: number, height: number, first?: PdfPen| PdfBrush, second?: PdfBrush): void {
        let pen: PdfPen;
        let brush: PdfBrush;
        if (first instanceof PdfPen) {
            pen = first;
            if (second) {
                brush = second;
            }
        } else {
            brush = first;
        }
        this._stateControl(pen, brush);
        this._constructArcPath(x, y, x + width, y + height, 0, 360);
        this._drawGraphicsPath(pen, brush, PdfFillMode.winding, true);
    }
    /**
     * Draw arc on the page graphics.
     *
     * @param {number} x value.
     * @param {number} y value.
     * @param {number} width value.
     * @param {number} height value.
     * @param {number} startAngle value.
     * @param {number} sweepAngle value.
     * @param {PdfPen} pen value.
     * @returns {void} draw a arc.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * //Draw arc on the page graphics.
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
     * Draw image on the page graphics.
     *
     * @param {PdfImage} image value.
     * @param {number} x value.
     * @param {number} y value.
     * @returns {void} Draws a image on the page graphics.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * //Draw image on the page graphics.
     * graphics.drawImage(image, 10, 20);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    drawImage(image: PdfImage, x: number, y: number) : void
    /**
     * Draw image on the page graphics.
     *
     * @param {PdfImage} image value.
     * @param {number} x value.
     * @param {number} y value.
     * @param {number} width value.
     * @param {number} height value.
     * @returns {void} Draws a image on the page graphics.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * //Draw image on the page graphics.
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
    _processResources(crossReference: _PdfCrossReference): void {
        if (this._pendingResource.length > 0) {
            for (let i: number = 0; i < this._pendingResource.length; i++) {
                const entry: any = this._pendingResource[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                if (entry.resource instanceof PdfImage) {
                    this._updateImageResource(entry.resource, entry.key, entry.source, crossReference);
                }
                this._source.update('Resources', this._resourceObject);
                this._source._updated = true;
            }
            this._pendingResource = [];
        }
    }
    _updateImageResource(image: PdfImage, keyName: _PdfName, source: _PdfDictionary, crossReference: _PdfCrossReference): void {
        let ref: _PdfReference;
        if (image._reference) {
            ref = image._reference;
        } else {
            ref = crossReference._getNextReference();
            image._reference = ref;
        }
        if (!crossReference._cacheMap.has(ref)) {
            if (image && image._imageStream && image._imageStream.dictionary) {
                crossReference._cacheMap.set(ref, image._imageStream);
                image._imageStream.dictionary._updated = true;
            }
        }
        source.update(keyName.name, ref);
        this._resources.set(ref, keyName);
        this._resourceObject._updated = true;
    }
    _drawTemplate(template: PdfTemplate, bounds: {x: number, y: number, width: number, height: number}): void {
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
            } else {
                ref = this._crossReference._getNextReference();
            }
            if (!this._crossReference._cacheMap.has(ref)) {
                if (template && template._content) {
                    this._crossReference._cacheMap.set(ref, template._content);
                }
            }
            sourceDictionary.update(keyName.name, ref);
            this._resources.set(ref, keyName);
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
    _drawPath(path: _PdfPath, pen?: PdfPen, brush?: PdfBrush): void {
        if (pen || brush) {
            this._stateControl(pen, brush, null);
            this._buildUpPath(path._points, path._pathTypes);
            this._drawGraphicsPath(pen, brush, path._fillMode, false);
        }
    }
    /**
     * Draw rounded rectangle on the page graphics.
     *
     * @param {number} x value.
     * @param {number} y value.
     * @param {number} width value.
     * @param {number} height value.
     * @param {number} radius value.
     * @param {PdfPen} pen value.
     * @param {PdfBrush} brush value.
     * @returns {void} draw a rounded rectangle.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * //Create a new brush.
     * let brush: PdfBrush = new PdfBrush([0, 0, 255]);
     * //Draw rounded rectangle on the page graphics.
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
        const path: _PdfPath = new _PdfPath();
        if (radius === 0) {
            path._addRectangle(bounds[0], bounds[1], bounds[2], bounds[3]);
            this._drawPath(path, pen, brush);
        } else {
            path._isRoundedRectangle = true;
            path._addArc(arc[0], arc[1], arc[2], arc[3], 180, 90);
            arc[0] = (bounds[0] + bounds[2]) - diameter;
            path._addArc(arc[0], arc[1], arc[2], arc[3], 270, 90);
            arc[1] = (bounds[1] + bounds[3]) - diameter;
            path._addArc(arc[0], arc[1], arc[2], arc[3], 0, 90);
            arc[0] = bounds[0];
            path._addArc(arc[0], arc[1], arc[2], arc[3], 90, 90);
            path._closeFigure();
            this._drawPath(path, pen, brush);
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
     * @param {string} value draw string.
     * @param {PdfFont} font value.
     * @param {number[]} bounds value.
     * @param {PdfPen} pen value.
     * @param {PdfBrush} brush value.
     * @param {PdfStringFormat} format value.
     * @returns {void} draw a string.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen.
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new font.
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.symbol, 10);
     * // Create a new string format
     * let format: PdfStringFormat = new PdfStringFormat();
     * format.alignment = PdfTextAlignment.center;
     * // Draw text on the page graphics.
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
    _buildUpPath(points: Array<number[]>, types: _PathPointType[]): void {
        for (let i: number = 0; i < points.length; i++) {
            const point: number[] = points[Number.parseInt(i.toString(), 10)];
            let type: _PathPointType = types[Number.parseInt(i.toString(), 10)];
            switch (type & 0xf) {
            case _PathPointType.start:
                this._sw._beginPath(point[0], point[1]);
                break;
            case _PathPointType.bezier:
                let result: { index: number, point: number[] } = this._getBezierPoint(points, types, i); // eslint-disable-line
                i = result.index;
                const first: number[] = result.point; // eslint-disable-line
                result = this._getBezierPoint(points, types, i);
                i = result.index;
                const second: number[] = result.point; // eslint-disable-line
                this._sw._appendBezierSegment(point[0], point[1], first[0], first[1], second[0], second[1]);
                break;
            case _PathPointType.line:
                this._sw._appendLineSegment(point[0], point[1]);
                break;
            default:
                throw new Error('Incorrect path formation.');
            }
            type = types[Number.parseInt(i.toString(), 10)];
            if ((type & _PathPointType.closePath) === _PathPointType.closePath) {
                this._sw._closePath();
            }
        }
    }
    _getBezierPoint(points: Array<number[]>, types: _PathPointType[], index: number): {index: number, point: number[]} {
        if (types[Number.parseInt(index.toString(), 10)] !== _PathPointType.bezier) {
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
        let fontDict: _PdfDictionary;
        let isReference: boolean = false;
        let keyName: _PdfName;
        let isNew: boolean = true;
        let ref: _PdfReference;
        if (this._resourceObject.has('Font')) {
            const obj: any = this._resourceObject.getRaw('Font'); // eslint-disable-line
            if (obj !== null && typeof obj !== 'undefined') {
                if (obj instanceof _PdfReference) {
                    isReference = true;
                    fontDict = this._crossReference._fetch(obj);
                } else if (obj instanceof _PdfDictionary) {
                    fontDict = obj;
                }
            }
            if (typeof fontDict !== 'undefined' && fontDict !== null) {
                isNew = false;
                this._resources.forEach((value: _PdfName, key: _PdfReference) => {
                    if (key !== null && typeof key !== 'undefined') {
                        const dictionary: _PdfDictionary = this._crossReference._fetch(key);
                        if (dictionary && dictionary === font._dictionary) {
                            keyName = value;
                            ref = key;
                        }
                    }
                });
            }
        }
        if (isNew) {
            fontDict = new _PdfDictionary(this._crossReference);
            this._resourceObject.update('Font', fontDict);
        }
        if (typeof keyName === 'undefined') {
            keyName = _PdfName.get(_getNewGuidString());
            if (!ref) {
                ref = this._crossReference._getNextReference();
            }
            if (font._dictionary) {
                this._crossReference._cacheMap.set(ref, font._dictionary);
                fontDict.update(keyName.name, ref);
                this._resources.set(ref, keyName);
            } else if (font instanceof PdfTrueTypeFont) {
                const internal: _UnicodeTrueTypeFont = font._fontInternal;
                if (internal && internal._fontDictionary) {
                    this._crossReference._cacheMap.set(ref, internal._fontDictionary);
                }
                fontDict.update(keyName.name, ref);
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
        if (this._page._pageIndex < pageCount - 2) {
            page = this._crossReference._document.getPage(this._page._pageIndex + 1);
        }
        return page;
    }
    _applyStringSettings(font: PdfFont, pen: PdfPen, brush: PdfBrush, format: PdfStringFormat): void {
        let tm: _TextRenderingMode = _TextRenderingMode.fill;
        if (pen != null && brush != null) {
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
                const characterSpacing: number = (format != null) ? format.characterSpacing : 0;
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
     * Draw line on the page graphics.
     *
     * @param {PdfPen} pen pen value.
     * @param {number} x1 value.
     * @param {number} y1 value.
     * @param {number} x2 value.
     * @param {number} y2 value.
     * @returns {void} draw a line.
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
     * @returns {void} scale transform.
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
     * //Set graphics scale transform.
     * graphics.scaleTransform(0.5, 0.5);
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
     * @returns {void} translate transform.
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
    translateTransform(x: number, y: number): void {
        const matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
        matrix._translate(x, -y);
        this._sw._modifyCtm(matrix);
        this._matrix._multiply(matrix);
    }
    /**
     * Represents a rotate transform of the graphics.
     *
     * @param {number} angle Angle of rotation in degrees
     * @returns {void} rotate transform.
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
     * //Set graphics rotate transform.
     * graphics.rotateTransform(-90);
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
    rotateTransform(angle: number): void {
        const matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
        matrix._rotate(-angle);
        this._sw._modifyCtm(matrix);
        this._matrix._multiply(matrix);
    }
    /**
     * Represents a clipping region of this graphics.
     *
     * @param {number[]} bounds Rectangle structure that represents the new clip region.
     * @param {PdfFillMode} mode Member of the PdfFillMode enumeration that specifies the filling operation to use.
     * @returns {void} clipping region.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * //Set clip.
     * graphics.setClip([0, 0, 50, 12], PdfFillMode.alternate);
     * //Draws the String.
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
     * @param {number} stroke transparency value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * //Set transparency.
     * graphics.setTransparency(0.5);
     * //Draws the String.
     * graphics.drawString("Hello world!", font, [0, 0, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setTransparency(stroke: number): void
    /**
     * Represents a transparency of this graphics.
     *
     * @param {number} stroke transparency value.
     * @param {number} fill transparency value.
     * @param {PdfBlendMode} mode blend mode.
     * @returns {void} transparency of this graphics.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * //Set transparency.
     * graphics.setTransparency(0.5, 0.5, PdfBlendMode.multiply);
     * //Draws the String.
     * graphics.drawString("Hello world!", font, [0, 0, 100, 200], undefined, new PdfBrush([0, 0, 255]));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setTransparency(stroke: number, fill: number, mode: PdfBlendMode): void
    /**
     * Represents a transparency of this graphics.
     *
     * @param {number} stroke transparency value.
     * @param {number} fill transparency value.
     * @param {PdfBlendMode} mode blend mode.
     * @returns {void} transparency of this graphics.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new font
     * let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * //Set transparency.
     * graphics.setTransparency(0.5, 0.5, PdfBlendMode.multiply);
     * //Draws the String.
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
