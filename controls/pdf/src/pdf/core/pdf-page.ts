import { _PdfCrossReference } from './pdf-cross-reference';
import { _PdfDictionary, _PdfReference, _PdfName } from './pdf-primitives';
import { _checkRotation, _getInheritableProperty, _getPageIndex, _isNullOrUndefined, _stringToBytes } from './utils';
import { PdfAnnotationCollection } from './annotations/annotation-collection';
import { PdfGraphics, PdfGraphicsState } from './graphics/pdf-graphics';
import { _PdfBaseStream, _PdfContentStream } from './base-stream';
import { PdfRotationAngle, PdfDestinationMode, PdfFormFieldsTabOrder, PdfPageOrientation } from './enumerator';
import { PdfDocument, PdfPageSettings } from './pdf-document';
import { PdfTemplate } from './graphics/pdf-template';
import { _PdfCatalog } from './pdf-catalog';
import { Point, Size, Rectangle } from './pdf-type';
/**
 * Represents a page loaded from the PDF document.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPage {
    /**
     * Crossreference context for the page.
     *
     * @private
     */
    _crossReference: _PdfCrossReference;
    /**
     * Zero  based index of this page in the document.
     *
     * @private
     */
    _pageIndex: number;
    /**
     * Underlying page dictionary.
     *
     * @private
     */
    _pageDictionary: _PdfDictionary;
    /**
     * Indirect reference to this page object.
     *
     * @private
     */
    _ref: _PdfReference;
    /**
     * Lazyparsed annotations collection.
     *
     * @private
     */
    _annotations: PdfAnnotationCollection;
    /**
     * Indicates whether annotations have been parsed.
     *
     * @private
     */
    _isAnnotationParsed: boolean = false;
    /**
     * Cached page size.
     *
     * @private
     */
    _size: Size;
    /**
     * MediaBox array cache.
     *
     * @private
     */
    _mBox: number[];
    /**
     * CropBox array cache.
     *
     * @private
     */
    _cBox: number[];
    /**
     * Cached page orientation.
     *
     * @private
     */
    _orientation: PdfPageOrientation;
    /**
     * Cached origin coordinates.
     *
     * @private
     */
    _o: number[];
    /**
     * Graphics context for drawing on the page.
     *
     * @private
     */
    _g: PdfGraphics;
    /**
     * Graphics state handle used for restore.
     *
     * @private
     */
    _graphicsState: PdfGraphicsState;
    /**
     * Ordered list of content streams/references.
     *
     * @private
     */
    _contents: Array<_PdfReference>;
    /**
     * Cached rotation angle.
     *
     * @private
     */
    _rotation: PdfRotationAngle;
    /**
     * Initializes graphics again on next access when true.
     *
     * @private
     */
    _needInitializeGraphics: boolean;
    /**
     * Indicates if the resources entry is an indirect reference.
     *
     * @private
     */
    _hasResourceReference: boolean;
    /**
     * Resolved resources dictionary for the page.
     *
     * @private
     */
    _resourceObject: _PdfDictionary;
    /**
     * Current tab order setting for form fields.
     *
     * @private
     */
    _tabOrder: PdfFormFieldsTabOrder;
    /**
     * Page settings used for layout operations.
     *
     * @private
     */
    _pageSettings: PdfPageSettings;
    /**
     * Indicates whether this page is newly created.
     *
     * @private
     */
    _isNew: boolean = false;
    /**
     * Indicates whether this page is a duplicate of another.
     *
     * @private
     */
    _isDuplicate: boolean = false;
    /**
     * Indicates whether the current operation pertains to a line annotation.
     *
     * @private
     */
    _isLineAnnotation: boolean  = false;
    /**
     * Represents a loaded page of the PDF document.
     *
     * @private
     * @param {_PdfCrossReference} crossReference Cross reference object.
     * @param {number} pageIndex page index.
     * @param {_PdfDictionary} dictionary page Dictionary.
     * @param {_PdfReference} reference page reference.
     */
    constructor(crossReference: _PdfCrossReference,
                pageIndex: number,
                dictionary: _PdfDictionary,
                reference: _PdfReference) {
        this._pageIndex = pageIndex;
        this._pageDictionary = dictionary;
        this._crossReference = crossReference;
        this._ref = reference;
    }
    /**
     * Gets the collection of the page's annotations (Read only).
     *
     * @returns {PdfAnnotationCollection} Annotation collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the annotation collection
     * let annotations: PdfAnnotationCollection = page.annotations;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get annotations(): PdfAnnotationCollection {
        if (typeof this._annotations === 'undefined') {
            if (this._pageDictionary && this._pageDictionary.has('Annots')) {
                const annots: Array<_PdfReference> = this._getProperty('Annots');
                if (_isNullOrUndefined(annots) && Array.isArray(annots)) {
                    let widgets: Array<_PdfReference>;
                    if (this._crossReference._document._catalog._catalogDictionary.has('AcroForm')) {
                        widgets = this._crossReference._document.form._parseWidgetReferences();
                    }
                    if (widgets && widgets.length > 0) {
                        const validAnnotations: _PdfReference[] = [];
                        annots.forEach((entry: _PdfReference) => {
                            if (widgets.indexOf(entry) === -1) {
                                validAnnotations.push(entry);
                            }
                        });
                        this._annotations = new PdfAnnotationCollection(validAnnotations, this._crossReference, this);
                    } else {
                        this._annotations = new PdfAnnotationCollection(annots, this._crossReference, this);
                    }
                }
            }
            if (typeof this._annotations === 'undefined') {
                this._annotations = new PdfAnnotationCollection([], this._crossReference, this);
            }
            this._annotations._getAnnotations();
        }
        return this._annotations;
    }
    /**
     * Gets the size of the page (Read only).
     *
     * @returns {Size} The size of the PDF page.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the width and height of the PDF page as number array
     * let size: Size = page.size;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get size(): Size {
        if (typeof this._size === 'undefined' || typeof this._size.width === 'undefined' || typeof this._size.height === 'undefined') {
            const mBox: number[] = _getInheritableProperty(this._pageDictionary, 'MediaBox', false, true, 'Parent', 'P');
            const cBox: number[] = _getInheritableProperty(this._pageDictionary, 'CropBox', false, true, 'Parent', 'P');
            let width: number = 0;
            let height: number = 0;
            const rotate: number = this._pageDictionary && this._pageDictionary.has('Rotate')
                ? _getInheritableProperty(this._pageDictionary, 'Rotate', false, true, 'Parent')
                : 0;
            if (cBox && rotate !== null && typeof rotate !== 'undefined') {
                width = cBox[2] - cBox[0];
                height = cBox[3] - cBox[1];
                const isValidCropBox: boolean = !(mBox && (mBox[2] - mBox[0]) < width);
                if (!(((rotate === 0 || rotate === 180) && (width < height)) ||
                    ((rotate === 90 || rotate === 270) && (width > height) || isValidCropBox)) && (rotate === 0 && mBox)) {
                    width = mBox[2] - mBox[0];
                    height = mBox[3] !== 0 ? mBox[3] - mBox[1] : mBox[1];
                }
            } else if (mBox) {
                width = mBox[2] - mBox[0];
                height = mBox[3] !== 0 ? mBox[3] - mBox[1] : mBox[1];
            } else {
                this._pageDictionary.update('MediaBox', [0, 0, 612, 792]);
                width = 612;
                height = 792;
            }
            this._size = {width: Math.abs(width), height: Math.abs(height)};
        }
        return this._size;
    }
    /**
     * Gets the rotation angle of the page (Read only).
     *
     * @returns {PdfRotationAngle} Page rotation angle.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the rotation angle of the page
     * let rotation: PdfRotationAngle = page.rotation;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get rotation(): PdfRotationAngle {
        let angle: number = 0;
        if (typeof this._rotation === 'undefined') {
            angle = _getInheritableProperty(this._pageDictionary, 'Rotate', false, true, 'Parent');
            if (angle < 0) {
                angle += 360;
            }
            this._rotation = (typeof angle !== 'undefined') ? ((angle / 90) % 4) as PdfRotationAngle : PdfRotationAngle.angle0;
        }
        return this._rotation;
    }
    /**
     * Sets the rotation angle of the PDF page
     *
     * @param {PdfRotationAngle} value rotation angle.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Sets the rotation angle of the PDF page
     * page.rotate = PdfRotationAngle.angle90;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set rotation(value: PdfRotationAngle) {
        if (!this._isNew) {
            this._rotation = value;
            let rotate: number = Math.floor(this._rotation as number) * 90;
            if (rotate >= 360) {
                rotate = rotate % 360;
            }
            this._pageDictionary.update('Rotate', rotate);
        }
    }
    /**
     * Gets the tab order of a PDF form field.
     *
     * @returns {PdfFormFieldsTabOrder} tab order.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the tab order of a PDF form field.
     * let tabOrder: PdfFormFieldsTabOrder = page.tabOrder;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get tabOrder(): PdfFormFieldsTabOrder {
        return this._obtainTabOrder();
    }
    /**
     * Sets the tab order of a PDF form field.
     *
     * @param {PdfFormFieldsTabOrder} value tab order.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Sets the tab order of a PDF form field.
     * page.tabOrder = PdfFormFieldsTabOrder.row;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set tabOrder(value: PdfFormFieldsTabOrder) {
        this._tabOrder = value;
        let tabs: string = '';
        if (this._tabOrder !== PdfFormFieldsTabOrder.none) {
            if (this._tabOrder === PdfFormFieldsTabOrder.row) {
                tabs = 'R';
            } else if (this._tabOrder === PdfFormFieldsTabOrder.column) {
                tabs = 'C';
            } else if (this._tabOrder === PdfFormFieldsTabOrder.structure) {
                tabs = 'S';
            }
        }
        this._pageDictionary.update('Tabs', _PdfName.get(tabs));
    }
    /**
     * Gets the bounds that define the area intended for display or printing in the PDF viewer application (Read only).
     *
     * @returns {number[]} Page size as number array.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the cropBox of the PDF page as number array
     * let cropBox: number[] = page.cropBox;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get cropBox(): number[] {
        if (typeof this._cBox === 'undefined') {
            this._cBox = _getInheritableProperty(this._pageDictionary, 'CropBox', false, true, 'Parent', 'P');
        }
        if (typeof this._cBox === 'undefined') {
            this._cBox = [0, 0, 0, 0];
        }
        return this._cBox;
    }
    /**
     * Gets the size that specify the width and height of the page (Read only).
     *
     * @returns {number[]} Page size as number array.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the mediaBox of the PDF page as number array
     * let mediaBox: number[] = page.mediaBox;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get mediaBox(): number[] {
        if (typeof this._mBox === 'undefined') {
            this._mBox = _getInheritableProperty(this._pageDictionary, 'MediaBox', false, true, 'Parent', 'P');
        }
        if (typeof this._mBox === 'undefined') {
            this._mBox = [0, 0, 0, 0];
        }
        return this._mBox;
    }
    /**
     * Gets the orientation of the page (Read only).
     *
     * @returns {PdfPageOrientation} Page orientation.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the orientation of the PDF page
     * let orientation: number[] = page.orientation;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get orientation(): PdfPageOrientation {
        if (typeof this._orientation === 'undefined') {
            if (typeof this.size !== 'undefined') {
                const size: Size = this.size;
                if (size.width > size.height) {
                    this._orientation = PdfPageOrientation.landscape;
                } else {
                    this._orientation = PdfPageOrientation.portrait;
                }
            }
        }
        return this._orientation;
    }
    /**
     * Gets the origin coordinates derived from the MediaBox.
     *
     * @returns {number[]} Origin as a two-element array [x, y].
     */
    get _origin(): number[] {
        if (typeof this._o === 'undefined' || (this._o[0] === 0 && this._o[1] === 0)) {
            this._o = [this.mediaBox[0], this._mBox[1]];
        }
        return this._o;
    }
    /**
     * Gets the graphics of the page (Read only).
     *
     * @returns {PdfGraphics} Page graphics.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * //Create a new pen.
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * //Draw line on the page graphics.
     * graphics.drawLine(pen, {x: 10, y: 10}, {x: 100, y: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get graphics(): PdfGraphics {
        if (typeof this._g === 'undefined' || this._needInitializeGraphics) {
            this._parseGraphics();
        }
        return this._g;
    }
    /**
     * Adds a widget annotation reference to the page's Annots array.
     *
     * @private
     * @param {_PdfReference} reference Widget annotation reference to add.
     * @returns {void} nothing.
     */
    _addWidget(reference: _PdfReference): void {
        let annots: Array<_PdfReference>;
        if (this._pageDictionary.has('Annots')) {
            const annotsRef: any = this._pageDictionary.getRaw('Annots'); // eslint-disable-line
            annots = this._getProperty('Annots');
            if (annotsRef && annotsRef instanceof _PdfReference) {
                delete this._pageDictionary._map.Annots;
                this._pageDictionary.update('Annots', annots);
            }
        }
        if (annots && Array.isArray(annots)) {
            annots.push(reference);
        } else {
            this._pageDictionary.update('Annots', [reference]);
        }
        this._pageDictionary._updated = true;
    }
    /**
     * Resolves an inheritable page property from the page tree.
     *
     * @private
     * @param {string} key The dictionary key to fetch.
     * @param {boolean} [getArray=false] Whether to return an array value as-is.
     * @returns {any} Resolved value or merged dictionary.
     */
    _getProperty(key: string, getArray: boolean = false): any { // eslint-disable-line
        const value: any = _getInheritableProperty(this._pageDictionary, key, getArray, false); // eslint-disable-line
        if (!Array.isArray(value)) {
            return value;
        }
        if (value.length === 1 || !(value[0] instanceof _PdfDictionary)) {
            return value[0];
        }
        return _PdfDictionary.merge(this._crossReference, value);
    }
    /**
     * Initializes content streams and graphics for drawing operations.
     *
     * @private
     * @returns {void} nothing.
     */
    _parseGraphics(): void {
        this._loadContents();
        const saveStream: _PdfContentStream = new _PdfContentStream([32, 113, 32, 10]);
        const saveReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(saveReference, saveStream);
        this._contents.splice(0, 0, saveReference);
        const restoreStream: _PdfContentStream = new _PdfContentStream([32, 81, 32, 10]);
        const restoreReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(restoreReference, restoreStream);
        this._contents.push(restoreReference);
        const contentStream: _PdfContentStream = new _PdfContentStream([]);
        const contentReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(contentReference, contentStream);
        this._contents.push(contentReference);
        this._pageDictionary.set('Contents', this._contents);
        this._pageDictionary._updated = true;
        this._initializeGraphics(contentStream);
    }
    /**
     * Loads the page's Contents entry into the internal reference list.
     *
     * @private
     * @returns {void} nothing.
     */
    _loadContents(): void {
        let contents: any = this._pageDictionary.getRaw('Contents'); // eslint-disable-line
        let ref: _PdfReference;
        if (contents !== null && typeof contents !== 'undefined' && contents instanceof _PdfReference) {
            ref = contents;
            contents = this._crossReference._fetch(ref);
        }
        if (contents && contents instanceof _PdfBaseStream) {
            this._contents = [ref];
        } else if (contents && Array.isArray(contents)) {
            this._contents = contents;
        } else {
            this._contents = [];
        }
    }
    /**
     * Creates the graphics context and applies initial transforms and rotation.
     *
     * @private
     * @param {_PdfContentStream} stream Target content stream to draw into.
     * @returns {void} nothing.
     */
    _initializeGraphics(stream: _PdfContentStream): void {
        let isInvalidCase: boolean = false;
        let llx: number = 0;
        let lly: number = 0;
        let urx: number = 0;
        let ury: number = 0;
        const size: Size = this.size;
        const mbox: number[] = this.mediaBox;
        if (mbox && mbox.length >= 4) {
            llx = mbox[0];
            lly = mbox[1];
            urx = mbox[2];
            ury = mbox[3];
        }
        let cbox: number[];
        if (this._pageDictionary.has('CropBox')) {
            cbox = this.cropBox;
            if (cbox && cbox.length >= 4) {
                const cx: number = cbox[0];
                const cy: number = cbox[1];
                const crx: number = cbox[2];
                const cry: number = cbox[3];
                const isValid: boolean = (cx < 0 || cy < 0 || crx < 0 || cry < 0) &&
                    (Math.floor(Math.abs(cy)) === Math.floor(Math.abs(size.height))) &&
                    (Math.floor(Math.abs(cx)) === Math.floor(Math.abs(size.width)));
                if (isValid) {
                    this._g = new PdfGraphics({width: Math.max(cx, crx), height: Math.max(cy, cry)}, stream, this._crossReference, this);
                } else {
                    this._g = new PdfGraphics(size, stream, this._crossReference, this);
                    this._g._cropBox = cbox;
                }
            } else {
                this._g = new PdfGraphics(size, stream, this._crossReference, this);
            }
        } else if ((llx < 0 || lly < 0 || urx < 0 || ury < 0) &&
            (Math.floor(Math.abs(lly)) === Math.floor(Math.abs(size.height))) &&
            (Math.floor(Math.abs(urx)) === Math.floor(Math.abs(size.width)))) {
            let width: number = Math.max(llx, urx);
            let height: number = Math.max(lly, ury);
            if (width <= 0 || height <= 0) {
                isInvalidCase = true;
                if (llx < 0) {
                    llx = -llx;
                }
                if (lly < 0) {
                    lly = -lly;
                }
                if (urx < 0) {
                    urx = -urx;
                }
                if (ury < 0) {
                    ury = -ury;
                }
                width = Math.max(llx, urx);
                height = Math.max(lly, ury);
            }
            this._g = new PdfGraphics({width: width, height: height}, stream, this._crossReference, this);
        } else {
            this._g = new PdfGraphics(size, stream, this._crossReference, this);
        }
        if (this._pageDictionary.has('MediaBox')) {
            this._g._mediaBoxUpperRightBound = isInvalidCase ? -lly : ury;
        }
        this._graphicsState = this._g.save();
        const origin: number[] = this._origin;
        if ((origin[0] >= 0 && origin[1] >= 0) || Math.sign(origin[0]) !== Math.sign(origin[1])) {
            this._g._initializeCoordinates();
        } else {
            this._g._initializeCoordinates(this);
        }
        //Need to code - set transparency group
        if (!this._isNew) {
            const rotation: PdfRotationAngle = this.rotation;
            if (!Number.isNaN(rotation) && (rotation !== PdfRotationAngle.angle0 || this._pageDictionary.has('Rotate'))) {
                let rotate: number;
                if (this._pageDictionary.has('Rotate')) {
                    rotate = this._pageDictionary.get('Rotate');
                } else {
                    rotate = rotation * 90;
                }
                const clip: number[] = this._g._clipBounds;
                if (rotate === 90) {
                    this._g.translateTransform({x: 0, y: size.height});
                    this._g.rotateTransform(-90);
                    this._g._clipBounds = [clip[0], clip[1], size.width, size.height];
                } else if (rotate === 180) {
                    this._g.translateTransform({x: size.width, y: size.height});
                    this._g.rotateTransform(-180);
                } else if (rotate === 270) {
                    this._g.translateTransform({x: size.width, y: 0});
                    this._g.rotateTransform(-270);
                    this._g._clipBounds = [clip[0], clip[1], size.height, size.width];
                }
            }
        }
        if (this._isNew && this._pageSettings && !this._isLineAnnotation) {
            const clipBounds: number[] = this._getActualBounds(this._pageSettings);
            this._g._clipTranslateMargins(clipBounds);
        }
        this._needInitializeGraphics = false;
    }
    /**
     * Computes the effective content bounds based on the page settings.
     *
     * @private
     * @param {PdfPageSettings} pageSettings Page settings containing margins and size.
     * @returns {number[]} Calculated bounds as [x, y, width, height].
     */
    _getActualBounds(pageSettings: PdfPageSettings): number[] {
        const actualSize: number[] = pageSettings._getActualSize();
        return [pageSettings.margins.left, pageSettings.margins.top, actualSize[0], actualSize[1]];
    }
    /**
     * Fetches or creates the resources dictionary for the page.
     *
     * @private
     * @returns {_PdfDictionary} Resources dictionary.
     */
    _fetchResources(): _PdfDictionary {
        if (typeof this._resourceObject === 'undefined') {
            if (this._pageDictionary && this._pageDictionary.has('Resources')) {
                const obj: any = this._pageDictionary.getRaw('Resources'); // eslint-disable-line
                if (obj !== null && typeof obj !== 'undefined' && obj instanceof _PdfReference) {
                    this._hasResourceReference = true;
                    this._resourceObject = this._crossReference._fetch(obj);
                } else if (obj && obj instanceof _PdfDictionary) {
                    this._resourceObject = obj;
                }
            } else {
                this._resourceObject = new _PdfDictionary(this._crossReference);
                this._pageDictionary.update('Resources', this._resourceObject);
            }
        }
        return this._resourceObject;
    }
    /**
     * Returns the CropBox or MediaBox of the page, preferring CropBox when available.
     *
     * @private
     * @returns {number[]} The selected box array.
     */
    _getCropOrMediaBox(): number[] {
        let box: number[];
        if (this._pageDictionary) {
            if (this._pageDictionary.has('CropBox')) {
                box = this._pageDictionary.getArray('CropBox');
            } else if (this._pageDictionary.has('MediaBox')) {
                box = this._pageDictionary.getArray('MediaBox');
            }
        }
        return box;
    }
    /**
     * Finalizes the graphics state and marks that graphics need reinitialization on next access.
     *
     * @private
     * @returns {void}
     */
    _beginSave(): void {
        if (typeof this._graphicsState !== 'undefined') {
            this.graphics.restore(this._graphicsState);
            this._graphicsState = null;
            this._needInitializeGraphics = true;
        }
    }
    /**
     * Releases page resources and cached values.
     *
     * @private
     * @returns {void}
     */
    _destroy(): void {
        this._pageDictionary = undefined;
        this._size = undefined;
        this._mBox = undefined;
        this._cBox = undefined;
        this._o = undefined;
        this._g = undefined;
        this._graphicsState = undefined;
        this._contents = undefined;
    }
    /**
     * Resolves the current tab order from the page dictionary.
     *
     * @private
     * @returns {PdfFormFieldsTabOrder} The resolved tab order.
     */
    _obtainTabOrder(): PdfFormFieldsTabOrder {
        if  (this._pageDictionary && this._pageDictionary.has('Tabs')) {
            const tabOrder: _PdfName = this._pageDictionary.get('Tabs');
            if (tabOrder === _PdfName.get('R')) {
                this._tabOrder = PdfFormFieldsTabOrder.row;
            } else if (tabOrder === _PdfName.get('C')) {
                this._tabOrder = PdfFormFieldsTabOrder.column;
            } else if (tabOrder === _PdfName.get('S')) {
                this._tabOrder = PdfFormFieldsTabOrder.structure;
            } else if (tabOrder === _PdfName.get('W')) {
                this._tabOrder = PdfFormFieldsTabOrder.widget;
            }
        }
        if (this._tabOrder === null || typeof this._tabOrder === 'undefined') {
            this._tabOrder = PdfFormFieldsTabOrder.none;
        }
        return this._tabOrder;
    }
    /**
     * Removes the specified annotation reference from the page's Annots array.
     *
     * @private
     * @param {_PdfReference} reference Annotation reference to remove.
     * @returns {void} nothing.
     */
    _removeAnnotation(reference: _PdfReference): void {
        if (this._pageDictionary && this._pageDictionary.has('Annots')) {
            let annots: Array<_PdfReference> = this._getProperty('Annots');
            if (_isNullOrUndefined(annots) && Array.isArray(annots)) {
                annots = annots.filter((item: _PdfReference) => item !== reference);
                this._pageDictionary.set('Annots', annots);
                this._pageDictionary._updated = true;
            }
        }
    }
    /**
     * Gets the page's combined content as a reusable template.
     *
     * @returns {PdfTemplate} Generated template containing the page content.
     */
    get _contentTemplate(): PdfTemplate {
        this._fetchResources();
        const targetArray: Uint8Array = this._combineContent();
        const targetStream: _PdfContentStream = new _PdfContentStream(Array.from(targetArray));
        const template: PdfTemplate = new PdfTemplate(targetStream, this._crossReference);
        template._content.dictionary.set('Resources', this._resourceObject);
        if (this.cropBox[0] > 0 || this.cropBox[1] > 0) {
            template._content.dictionary.set('BBox', this.cropBox);
            template._size = {width: this.cropBox[0], height: this.cropBox[1]};
        } else if (this.mediaBox[0] > 0 || this.mediaBox[1] > 0) {
            template._content.dictionary.set('BBox', this.mediaBox);
            template._size = {width: this.mediaBox[0], height: this.mediaBox[1]};
        } else {
            template._content.dictionary.set('BBox', [0, 0, this.size.width, this.size.height]);
            template._size = {width: this.size.width, height: this.size.height};
        }
        return template;
    }
    _combineIntoSingleArray(arrays: Uint8Array[]): Uint8Array {
        const totalLength: number = arrays.reduce((length: number, arr: Uint8Array) => length + arr.length, 0);
        const targetArray: Uint8Array = new Uint8Array(totalLength);
        let offset: number = 0;
        arrays.forEach((sourceArray: Uint8Array) => {
            targetArray.set(sourceArray, offset);
            offset += sourceArray.length;
        });
        return targetArray;
    }
    /**
     * Concatenates multiple byte arrays into a single array.
     *
     * @private
     * @returns {Uint8Array} Combined array.
     */
    _combineContent(): Uint8Array {
        const list: Uint8Array[] = [];
        let array: Uint8Array;
        this._loadContents();
        list.push(new Uint8Array([32, 113, 32, 10]));
        const contents: Array<_PdfReference> = this._contents;
        contents.forEach((reference: _PdfReference) => {
            const base: any = this._crossReference._fetch(reference); // eslint-disable-line
            if (base) {
                if (base instanceof _PdfContentStream) {
                    array = new Uint8Array(base._bytes);
                } else if (base instanceof _PdfBaseStream) {
                    array = base.getBytes();
                }
                if (array) {
                    list.push(array);
                    list.push(new Uint8Array([13, 10]));
                }
            }
        });
        list.push(new Uint8Array([32, 81, 32, 10]));
        list.push(new Uint8Array([13, 10]));
        const targetArray: Uint8Array = this._combineIntoSingleArray(list);
        return targetArray;
    }
}
/**
 * `PdfDestination` class represents the PDF destination.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the annotation at index 0
 * let annotation: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
 * // Initializes a new instance of the `PdfDestination` class.
 * let destination: PdfDestination = new PdfDestination();
 * // Sets the zoom factor.
 * destination.zoom = 20;
 * // Sets the page where the destination is situated.
 * destination.page = page;
 * // Sets the mode of the destination.
 * destination.mode = PdfDestinationMode.fitToPage;
 * // Sets the location of the destination.
 * destination.location = {x: 20, y: 20};
 * // Sets the bounds of the destination.
 * destination.destinationBounds = {x: 20, y: 20, width: 100, height: 50};
 * // Sets destination to  document link annotation.
 * annotation.destination = destination;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */

export class PdfDestination {
    /**
     * @private
     */
    _page: PdfPage;
    /**
     * @private
     */
    _location: Point = {x: 0, y: 0};
    /**
     * @private
     */
    _destinationMode: PdfDestinationMode = PdfDestinationMode.location;
    /**
     * @private
     */
    _zoom: number = 0;
    /**
     * @private
     */
    _isValid: boolean = true;
    /**
     * @private
     */
    _index: number;
    /**
     * @private
     */
    _destinationBounds: Rectangle = {x: 0, y: 0, width: 0, height: 0};
    /**
     * @private
     */
    _array: Array<any> = Array<any>(); // eslint-disable-line
    /**
     * @private
     */
    _parent: any; // eslint-disable-line
    /**
     * @private
     */
    _isBookmark: boolean;
    /**
     * Initializes a new instance of the `PdfDestination` class.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annotation: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Initializes a new instance of the `PdfDestination` class.
     * let destination: PdfDestination = new PdfDestination();
     * // Sets the zoom factor.
     * destination.zoom = 20;
     * // Sets the page where the destination is situated.
     * destination.page = page;
     * // Sets the mode of the destination.
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Sets the location of the destination.
     * destination.location = {x: 20, y: 20};
     * // Sets the bounds of the destination.
     * destination.destinationBounds = {x: 20, y: 20, width: 100, height: 50};
     * // Sets destination to  document link annotation.
     * annotation.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfDestination` class.
     *
     * @param {PdfPage} page PdfPage.
     */
    public constructor(page: PdfPage)
    /**
     * Initializes a new instance of the `PdfDestination` class.
     *
     * @param {PdfPage} page PdfPage.
     * @param {Point} location Location.
     */
    public constructor(page: PdfPage, location: Point)
    /**
     * Initializes a new instance of the `PdfDestination` class.
     *
     * @param {PdfPage} page PdfPage.
     * @param {Rectangle} bounds Bounds.
     */
    public constructor(page: PdfPage, bounds: Rectangle)
    /**
     * Initializes a new instance of the `PdfDestination` class.
     *
     * @param {PdfPage} page PdfPage.
     * @param {Point} location Location.
     * @param {object} options Destination options.
     * @param {number} [options.zoom] The zoom level for the destination.
     * @param {PdfDestinationMode} [options.mode] The destination display mode.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create new document link annotation
     * const docLink = new PdfDocumentLinkAnnotation(
     *   { x: 80, y: 100, width: 120, height: 18 },
     *   new PdfDestination(
     *     page: document.getPage(0),
     *     location: { x: 10, y: 20 }, {zoom: 5,
     *     mode: PdfDestinationMode.fitToPage
     *   }),
     *   { color: { r: 0, g: 128, b: 0 }, opacity: 1 }
     * );
     * // Add annotation to the page
     * page.addAnnotation(docLink);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(page: PdfPage, location: Point, options: {zoom?: number, mode?: PdfDestinationMode})
    /**
     * Initializes a new instance of the `PdfDestination` class.
     *
     * @param {PdfPage} page PdfPage.
     * @param {Rectangle} bounds Bounds.
     * @param {object} options Destination options.
     * @param {number} [options.zoom] The zoom level for the destination.
     * @param {PdfDestinationMode} [options.mode] The destination display mode.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create new document link annotation
     * const docLink = new PdfDocumentLinkAnnotation(
     *   { x: 80, y: 100, width: 120, height: 18 },
     *   new PdfDestination(
     *     page: document.getPage(0),
     *     bounds: { x: 10, y: 20, width: 100, height: 200 }, {zoom: 5,
     *     mode: PdfDestinationMode.fitToPage
     *   }),
     *   { color: { r: 0, g: 128, b: 0 }, opacity: 1 }
     * );
     * // Add annotation to the page
     * page.addAnnotation(docLink);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(page: PdfPage, bounds: Rectangle, options: {zoom?: number, mode?: PdfDestinationMode})
    public constructor(arg1?: PdfPage, arg2?: Point | Rectangle, arg3?: {zoom?: number, mode?: PdfDestinationMode}) {
        if (typeof arg1 !== 'undefined' && arg1 !== null) {
            if (arg1.rotation === PdfRotationAngle.angle180) {
                this._location = {x: arg1.graphics._size.width, y: this._location.y};
            } else if (arg1.rotation === PdfRotationAngle.angle90) {
                this._location = {x: 0, y: 0};
            } else if (arg1.rotation === PdfRotationAngle.angle270) {
                this._location = {x: arg1.graphics._size.width, y: 0};
            } else {
                this._location = {x: 0,  y: this._location.y};
            }
            this._page = arg1;
            this._index = arg1._pageIndex;
        }
        if (arg2 !== null && typeof arg2 !== 'undefined') {
            this._location = {x: arg2.x, y: arg2.y};
            if ('width' in arg2 && 'height' in arg2 && typeof arg2.width === 'number' && typeof arg2.height === 'number') {
                this._destinationBounds = arg2;
            }
        }
        if (arg3 !== null && typeof arg3 !== 'undefined') {
            if ('mode' in arg3 && arg3.mode !== null && typeof arg3.mode !== 'undefined') {
                this.mode = arg3.mode;
            }
            if ('zoom' in arg3 && arg3.zoom !== null && typeof arg3.zoom !== 'undefined') {
                this.zoom = arg3.zoom;
            }
        }
    }
    /**
     * Gets the zoom factor.
     *
     * @returns {number} zoom.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * //Access the annotation at index 0
     * let annot: PdfDocumentLinkAnnotation = page.annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Gets the zoom factor of the destination.
     * let zoom: number = annot.destination.zoom;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get zoom(): number {
        return this._zoom;
    }
    /**
     * Sets the zoom factor.
     *
     * @param {number} value zoom.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annotation: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Initializes a new instance of the `PdfDestination` class.
     * let destination: PdfDestination = new PdfDestination();
     * // Sets the zoom factor.
     * destination.zoom = 20;
     * // Sets the page where the destination is situated.
     * destination.page = page;
     * // Sets the mode of the destination.
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Sets the location of the destination.
     * destination.location = {x: 20, y: 20};
     * // Sets the bounds of the destination.
     * destination.destinationBounds = {x: 20, y: 20, width: 100, height: 50};
     * // Sets destination to  document link annotation.
     * annotation.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set zoom(value: number) {
        if (value !== this._zoom) {
            this._zoom = value;
            this._initializePrimitive();
        }
    }
    /**
     * Gets the page where the destination is situated.
     *
     * @returns {PdfPage} page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * //Access the annotation at index 0
     * let annot: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Gets the page of the destination.
     * let page: PdfPage = annot.destination.page;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get page(): PdfPage {
        return this._page;
    }
    /**
     * Sets the page where the destination is situated.
     *
     * @param {PdfPage} value page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annotation: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Initializes a new instance of the `PdfDestination` class.
     * let destination: PdfDestination = new PdfDestination();
     * // Sets the zoom factor.
     * destination.zoom = 20;
     * // Sets the page where the destination is situated.
     * destination.page = page;
     * // Sets the mode of the destination.
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Sets the location of the destination.
     * destination.location = {x: 20, y: 20};
     * // Sets the bounds of the destination.
     * destination.destinationBounds = {x: 20, y: 20, width: 100, height: 50};
     * // Sets destination to  document link annotation.
     * annotation.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set page(value: PdfPage) {
        if (value !== this._page) {
            this._page = value;
            this._initializePrimitive();
            this._index = value._pageIndex;
        }
    }
    /**
     * Gets the page index of bookmark destination (Read only).
     *
     * @returns {number} index.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * //Access the annotation at index 0
     * let annot: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Gets the page index of the destination.
     * let pageIndex: number = annot.destination.pageIndex;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get pageIndex(): number {
        return this._index;
    }
    /**
     * Gets the mode of the destination.
     *
     * @returns {PdfDestinationMode} page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * //Access the annotation at index 0
     * let annot: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Gets the mode of the destination.
     * let mode: PdfDestinationMode = annot.destination.mode;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get mode(): PdfDestinationMode {
        return this._destinationMode;
    }
    /**
     * Sets the mode of the destination.
     *
     * @param {PdfDestinationMode} value page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annotation: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Initializes a new instance of the `PdfDestination` class.
     * let destination: PdfDestination = new PdfDestination();
     * // Sets the zoom factor.
     * destination.zoom = 20;
     * // Sets the page where the destination is situated.
     * destination.page = page;
     * // Sets the mode of the destination.
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Sets the location of the destination.
     * destination.location = {x: 20, y: 20};
     * // Sets the bounds of the destination.
     * destination.destinationBounds = {x: 20, y: 20, width: 100, height: 50};
     * // Sets destination to document link annotation.
     * annotation.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set mode(value: PdfDestinationMode) {
        if (value !== this._destinationMode) {
            this._destinationMode = value;
            this._initializePrimitive();
        }
    }
    /**
     * Gets the location of the destination.
     *
     * @returns {Point} page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annot: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Gets the location of the destination.
     * let location: Point = annot.destination.location;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get location(): Point {
        return this._location;
    }
    /**
     * Sets the location of the destination.
     *
     * @param {Point} value page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annotation: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Initializes a new instance of the `PdfDestination` class.
     * let destination: PdfDestination = new PdfDestination();
     * // Sets the zoom factor.
     * destination.zoom = 20;
     * // Sets the page where the destination is situated.
     * destination.page = page;
     * // Sets the mode of the destination.
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Sets the location of the destination.
     * destination.location = {x: 20, y: 20};
     * // Sets the bounds of the destination.
     * destination.destinationBounds = {x: 20, y: 20, width: 100, height: 50};
     * // Sets destination to  document link annotation.
     * annotation.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set location(value: Point) {
        if (value !== this._location) {
            this._location = value;
            this._initializePrimitive();
        }
    }
    /**
     * Gets the bounds of the destination.
     *
     * @returns {Rectangle} bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annot: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Gets the bounds of the destination.
     * let destinationBounds: Rectangle = annot.destination.destinationBounds;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get destinationBounds(): Rectangle {
        return this._destinationBounds;
    }
    /**
     * Sets the bounds of the destination.
     *
     * @param {Rectangle} value bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annotation: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Initializes a new instance of the `PdfDestination` class.
     * let destination: PdfDestination = new PdfDestination();
     * // Sets the zoom factor.
     * destination.zoom = 20;
     * // Sets the page where the destination is situated.
     * destination.page = page;
     * // Sets the mode of the destination.
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Sets the location of the destination.
     * destination.location = {x: 20, y: 20};
     * // Sets the bounds of the destination.
     * destination.destinationBounds = {x: 20, y: 20, width: 100, height: 50};
     * // Sets destination to  document link annotation.
     * annotation.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set destinationBounds(value: Rectangle) {
        if (value !== this._destinationBounds) {
            this._destinationBounds = value;
            this._initializePrimitive();
        }
    }
    /**
     * Gets a value indicating whether this instance is valid (Read only).
     *
     * @returns {boolean} value indicating whether this instance is valid.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annot: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Gets a value indicating whether this instance is valid.
     * let isValid: boolean = annot.destination.isValid;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isValid(): boolean {
        return this._isValid;
    }
    /**
     * Sets the internal validation flag for the destination.
     *
     * @private
     * @param {boolean} value True to mark as valid; otherwise false.
     * @returns {void} nothing.
     */
    _setValidation(value: boolean): void {
        this._isValid = value;
    }
    /**
     * Builds the internal PDF array representation and updates the parent dictionary.
     *
     * @private
     * @returns {void}
     */
    _initializePrimitive(): void {
        this._array = [];
        const page: PdfPage = this._page as PdfPage;
        if (page && page._pageDictionary) {
            const element: _PdfDictionary = page._pageDictionary;
            if (typeof element !== 'undefined' && element !== null) {
                this._array.push(this._page._ref);
            }
            switch (this._destinationMode) {
            case PdfDestinationMode.location:
                this._array.push(_PdfName.get('XYZ'));
                if (typeof page !== 'undefined' && page !== null) {
                    this._array.push(this._location.x);
                    this._array.push(this._page.graphics._size.height - this._location.y);
                } else {
                    this._array.push(0);
                    this._array.push(0);
                }
                this._array.push(this._zoom);
                break;
            case PdfDestinationMode.fitToPage:
                this._array.push(_PdfName.get('Fit'));
                break;
            case PdfDestinationMode.fitR:
                this._array.push(_PdfName.get('FitR'));
                this._array.push(this._destinationBounds.x);
                this._array.push(this._destinationBounds.y);
                this._array.push(this._destinationBounds.width);
                this._array.push(this._destinationBounds.height);
                break;
            case PdfDestinationMode.fitH:
                this._array.push(_PdfName.get('FitH'));
                this._array.push((typeof page !== 'undefined' && page !== null) ? page.size.height - this._location.y : 0);
                break;
            }
            if (this._parent) {
                this._parent._dictionary.set(this._isBookmark ? 'Dest' : 'D', this._array);
                this._parent._dictionary._updated = true;
            }
        }
    }
}
/**
 * Provides utilities to resolve and parse destination arrays from dictionaries and Names trees.
 *
 * @private
 */
export class _PdfDestinationHelper {
    /**
     * Source dictionary that contains the destination entry.
     *
     * @private
     */
    _dictionary: _PdfDictionary;
    /**
     * Key to look up ('Dest' or 'D').
     *
     * @private
     */
    _key: string;
    constructor(dictionary: _PdfDictionary, value: string) {
        if (dictionary && typeof value === 'string') {
            this._dictionary = dictionary;
            this._key = value;
        }
    }
    /**
     * Obtains the `PdfDestination` from the source dictionary or Names tree.
     *
     * @private
     * @returns {PdfDestination} Resolved destination instance, if any.
     */
    _obtainDestination(): PdfDestination {
        let destination: PdfDestination;
        let page: PdfPage;
        let loadedDocument: PdfDocument;
        if (!this._dictionary || (!this._dictionary.has(this._key) && !this._dictionary.has('D'))) {
            return undefined;
        } else if (this._dictionary && this._dictionary._crossReference && this._dictionary._crossReference._document) {
            loadedDocument = this._dictionary._crossReference._document;
        }
        if (this._dictionary.has('D')) {
            this._key = 'D';
        }
        let destinationArray: any[] = this._dictionary.getArray(this._key); // eslint-disable-line
        if ((typeof destinationArray === 'string' || (destinationArray instanceof _PdfName && typeof destinationArray.name === 'string')) && loadedDocument) {
            destinationArray = this._getDestination(destinationArray, loadedDocument);
        }
        let value: any; // eslint-disable-line
        if (Array.isArray(destinationArray) && destinationArray.length > 0) {
            value = destinationArray[0];
        }
        let mode: _PdfName;
        let left: number;
        let top: number;
        let bottom: number;
        let right: number;
        let zoom: number;
        let index: number;
        let topValue: number;
        let leftValue: number;
        if (typeof value === 'number') {
            index = value;
        } else if (value instanceof _PdfDictionary) {
            index = _getPageIndex(loadedDocument, value);
        } else if (value instanceof _PdfReference) {
            const pageDictionary: _PdfDictionary = loadedDocument._crossReference._fetch(value);
            if (pageDictionary && pageDictionary instanceof _PdfDictionary) {
                index = _getPageIndex(loadedDocument, pageDictionary);
            }
        }
        if (!page && typeof index === 'number' && (index >= 0 && index < loadedDocument.pageCount)) {
            page = loadedDocument.getPage(index);
        }
        if (Array.isArray(destinationArray) && destinationArray.length > 0) {
            mode = destinationArray[1];
        }
        if (mode && page && destinationArray) {
            switch (mode.name) {
            case 'XYZ':
                left = destinationArray[2];
                top = destinationArray[3];
                zoom = destinationArray[4];
                topValue = typeof top === 'number' ? (page.size.height - top) : 0;
                leftValue = typeof left === 'number' ? left : 0;
                if (page.rotation !== PdfRotationAngle.angle0) {
                    topValue = _checkRotation(page, top, left);
                }
                destination = new PdfDestination(page, {x: leftValue, y: topValue});
                destination._index = page._pageIndex;
                destination.zoom = (typeof zoom !== 'undefined' && zoom !== null) ? zoom : 0;
                if (left === null || top === null || zoom === null || typeof left === 'undefined' ||
                        typeof top === 'undefined' || typeof zoom === 'undefined') {
                    destination._setValidation(false);
                }
                break;
            case 'FitR':
                if (destinationArray.length > 2) {
                    left = destinationArray[2];
                }
                if (destinationArray.length > 3) {
                    bottom = destinationArray[3];
                }
                if (destinationArray.length > 4) {
                    right = destinationArray[4];
                }
                if (destinationArray.length > 5) {
                    top = destinationArray[5];
                }
                left = (typeof left !== 'undefined' && left !== null) ? left : 0;
                bottom = (typeof bottom !== 'undefined' && bottom !== null) ? bottom : 0;
                right = (typeof right !== 'undefined' && right !== null) ? right : 0;
                top = (typeof top !== 'undefined' && top !== null) ? top : 0;
                destination = new PdfDestination(page, {x: left, y: bottom, width: right, height: top});
                destination._index = page._pageIndex;
                destination.mode = PdfDestinationMode.fitR;
                break;
            case 'FitH':
            case 'FitBH':
                if (destinationArray.length > 2) {
                    top = destinationArray[2];
                }
                topValue = typeof top === 'number' ? (page.size.height - top) : 0;
                destination = new PdfDestination(page, {x: 0, y: topValue});
                destination._index = page._pageIndex;
                destination.mode = PdfDestinationMode.fitH;
                if (top === null || typeof top === 'undefined') {
                    destination._setValidation(false);
                }
                break;
            case 'Fit':
                destination = new PdfDestination(page);
                destination._index = page._pageIndex;
                destination.mode = PdfDestinationMode.fitToPage;
                break;
            }
        } else if (Array.isArray(destinationArray)) {
            destination = new PdfDestination();
            if (destinationArray.length > 4) {
                zoom = destinationArray[4];
            }
            if (destinationArray.length > 1) {
                mode = destinationArray[1];
            }
            if (typeof zoom === 'number') {
                destination.zoom = zoom;
            }
            if (mode) {
                if (mode.name === 'Fit') {
                    destination.mode = PdfDestinationMode.fitToPage;
                } else if (mode.name === 'XYZ') {
                    if (destinationArray.length > 2) {
                        left = destinationArray[2];
                    }
                    if (destinationArray.length > 3) {
                        topValue = destinationArray[3];
                    }
                    if ((typeof left === 'undefined' && left === null) || (typeof topValue === 'undefined' && topValue === null)
                        || (typeof zoom === 'undefined' && zoom === null)) {
                        destination._setValidation(false);
                    }
                }
            }
            if (typeof index === 'number' && (index >= 0 && index < loadedDocument.pageCount)) {
                destination._index = index;
            }
        }
        return destination;
    }
    /**
     * Looks up a destination array by name from the document.
     *
     * @private
     * @param {_PdfName | string} name Named destination identifier.
     * @param {PdfDocument} document Document to search.
     * @returns {any[]} The resolved destination array if found.
     */
    _getDestination(name: _PdfName | string, document: PdfDocument): any[] { // eslint-disable-line
        let destinationArray: any[]; // eslint-disable-line
        if (document) {
            destinationArray = this._getNamedDestination(document, name);
        }
        return destinationArray;
    }
    /**
     * Resolves a named destination from the Names tree or Dests dictionary.
     *
     * @private
     * @param {PdfDocument} document Source document.
     * @param {_PdfName | string} result Name key to resolve.
     * @returns {any[]} Destination array or undefined.
     */
    _getNamedDestination(document: PdfDocument, result: _PdfName | string): any[] { // eslint-disable-line
        let destination: any[]; // eslint-disable-line
        const catalog: _PdfCatalog = document._catalog;
        if (catalog && catalog._catalogDictionary) {
            if (result && typeof result === 'string') {
                if (catalog._catalogDictionary.has('Names')) {
                    const names: _PdfDictionary = catalog._catalogDictionary.get('Names');
                    if (names && names.has('Dests')) {
                        const kids: _PdfDictionary = names.get('Dests');
                        if (kids) {
                            const ref: _PdfReference = this._getNamedObjectFromTree(kids, result);
                            destination = this._extractDestination(ref, document);
                        }
                    }
                }
            } else if (result && result instanceof _PdfName) {
                const destinations: _PdfDictionary = catalog._catalogDictionary.get('Dests');
                if (destinations) {
                    destination = destinations.get(result.name);
                }
            }
        }
        return destination;
    }
    /**
     * Extracts a destination array from a referenced dictionary or array.
     *
     * @private
     * @param {any} ref Reference or array pointing to a destination.
     * @param {PdfDocument} document Document to use for dereferencing.
     * @returns {any[]} The destination array if available.
     */
    _extractDestination(ref: any, document: PdfDocument): any[] { // eslint-disable-line
        let dict: any; // eslint-disable-line
        let destinationArray: any[]; // eslint-disable-line
        if (ref && ref instanceof _PdfReference) {
            dict = document._crossReference._fetch(ref);
        }
        if (dict) {
            if (dict instanceof _PdfDictionary && dict.has('D')) {
                destinationArray = dict.getRaw('D');
            } else if (Array.isArray(dict)) {
                destinationArray = dict;
            }
        }
        return destinationArray ? destinationArray : ref;
    }
    /**
     * Traverses the Names tree to find a named object reference.
     *
     * @private
     * @param {_PdfDictionary} kids Current node in the Names tree.
     * @param {string} name Name to locate.
     * @returns {_PdfReference} Reference to the matching named object.
     */
    _getNamedObjectFromTree(kids: _PdfDictionary, name: string): _PdfReference {
        let found: boolean = false;
        let currentDictionary: _PdfDictionary = kids;
        let reference: _PdfReference;
        while (!found && currentDictionary) {
            if (currentDictionary && currentDictionary.has('Kids')) {
                currentDictionary = this._getProperKid(currentDictionary, name);
            } else if (currentDictionary && currentDictionary.has('Names')) {
                reference = this._findName(currentDictionary, name);
                found = true;
            }
        }
        return reference;
    }
    /**
     * Performs a binary search in a Names array for the given name.
     *
     * @private
     * @param {_PdfDictionary} current Dictionary containing a 'Names' array.
     * @param {string} target Name to search for.
     * @returns {_PdfReference} Reference associated with the found name.
     */
    _findName(current: _PdfDictionary, target: string): _PdfReference {
        let reference: _PdfReference;
        const names: any[] = current.get('Names'); // eslint-disable-line
        if (!Array.isArray(names) || names.length === 0) {
            return reference;
        }
        for (let i: number = 0; i < names.length; i += 2) {
            let key: any = names[i]; // eslint-disable-line
            if (key instanceof _PdfReference) {
                key = current._crossReference._fetch(key);
            }
            if (this._stringCompare(target, key) === 0) {
                reference = names[i + 1] as _PdfReference;
                return reference;
            }
        }
        return reference;
    }
    /**
     * Selects the child dictionary whose Limits bracket the specified name.
     *
     * @private
     * @param {_PdfDictionary} kids Parent dictionary with Kids array.
     * @param {string} name Name to bracket.
     * @returns {_PdfDictionary} The child dictionary likely containing the name.
     */
    _getProperKid(kids: _PdfDictionary, name: string): _PdfDictionary {
        let kidsArray: any; // eslint-disable-line
        let kid: _PdfDictionary;
        if (kids && kids.has('Kids')) {
            kidsArray = kids.getRaw('Kids');
        }
        if (kidsArray && Array.isArray(kidsArray) && kidsArray.length !== 0) {
            kidsArray = kids.getArray('Kids');
            for (let i: number = kidsArray.length - 1; i >= 0; i--) {
                kid = kidsArray[Number.parseInt(i.toString(), 10)];
                if (this._checkLimits(kid, name)) {
                    break;
                }
            }
        }
        return kid;
    }
    /**
     * Checks whether the given name falls within the Limits of the node.
     *
     * @private
     * @param {_PdfDictionary} kid Node to test.
     * @param {string} result Name to compare.
     * @returns {boolean} True if within limits; otherwise false.
     */
    _checkLimits(kid: _PdfDictionary, result: string): boolean {
        let found: boolean = false;
        if (kid && kid.has('Limits')) {
            const limits: any[] = kid.get('Limits'); // eslint-disable-line
            const lowerLimit: string = limits[0];
            const higherLimit: string = limits[1];
            const lowCompare: number = this._stringCompare(lowerLimit, result);
            const highCompare: number = this._stringCompare(higherLimit, result);
            found = (lowCompare === 0 || highCompare === 0 || (lowCompare < 0 && highCompare > 0));
        }
        return found;
    }
    /**
     * Compares two strings using byte-wise comparison.
     *
     * @private
     * @param {string} limits First string to compare.
     * @param {string} result Second string to compare.
     * @returns {number} Negative if limits < result, positive if limits > result, zero if equal.
     */
    _stringCompare(limits: string, result: string): number {
        const byteArray: Uint8Array = _stringToBytes(limits) as Uint8Array;
        const byteArray1: Uint8Array = _stringToBytes(result) as Uint8Array;
        const commonSize: number = Math.min(byteArray.length, byteArray1.length);
        let resultValue: number = 0;
        for (let i: number = 0; i < commonSize; i++) {
            const byte: number = byteArray[Number.parseInt(i.toString(), 10)];
            const byte1: number = byteArray1[Number.parseInt(i.toString(), 10)];
            resultValue = byte - byte1;
            if (resultValue !== 0) {
                break;
            }
        }
        if (resultValue === 0) {
            resultValue = byteArray.length - byteArray1.length;
        }
        return resultValue;
    }
}
