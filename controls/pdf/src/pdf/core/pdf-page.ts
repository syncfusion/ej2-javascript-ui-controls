import { _PdfCrossReference } from './pdf-cross-reference';
import { _PdfDictionary, _PdfReference, _PdfName } from './pdf-primitives';
import { _getInheritableProperty } from './utils';
import { PdfAnnotationCollection } from './annotations/annotation-collection';
import { PdfGraphics, PdfGraphicsState } from './graphics/pdf-graphics';
import { _PdfBaseStream, _PdfContentStream } from './base-stream';
import { PdfRotationAngle, PdfDestinationMode, PdfFormFieldsTabOrder, PdfPageOrientation } from './enumerator';
import { PdfNamedDestination } from './pdf-outline';
import { PdfPageSettings } from './pdf-document';
import { PdfTemplate } from './graphics/pdf-template';
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
    _crossReference: _PdfCrossReference;
    _pageIndex: number;
    _pageDictionary: _PdfDictionary;
    _ref: _PdfReference;
    _annotations: PdfAnnotationCollection;
    _isAnnotationParsed: boolean = false;
    _size: number[];
    _mBox: number[];
    _cBox: number[];
    _orientation: PdfPageOrientation;
    _o: number[];
    _g: PdfGraphics;
    _graphicsState: PdfGraphicsState;
    _contents: Array<_PdfReference>;
    _rotation: PdfRotationAngle;
    _needInitializeGraphics: boolean;
    _hasResourceReference: boolean;
    _resourceObject: _PdfDictionary;
    _tabOrder: PdfFormFieldsTabOrder;
    _pageSettings: PdfPageSettings;
    _isNew: boolean = false;
    _isDuplicate: boolean = false;
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
            if (this._pageDictionary.has('Annots')) {
                const annots: Array<_PdfReference> = this._getProperty('Annots');
                if (annots && Array.isArray(annots)) {
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
        }
        return this._annotations;
    }
    /**
     * Gets the size of the page (Read only).
     *
     * @returns {number[]} Page width and height as number array.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the width and height of the PDF page as number array
     * let size: number[] = page.size;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get size(): number[] {
        if (typeof this._size === 'undefined') {
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
            this._size = [Math.abs(width), Math.abs(height)];
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
                const size: number[] = this.size;
                if (size[0] > size[1]) {
                    this._orientation = PdfPageOrientation.landscape;
                } else {
                    this._orientation = PdfPageOrientation.portrait;
                }
            }
        }
        return this._orientation;
    }
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
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * //Draw line on the page graphics.
     * graphics.drawLine(pen, 10, 10, 100, 100);
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
    _addWidget(reference: _PdfReference): void {
        let annots: Array<_PdfReference>;
        if (this._pageDictionary.has('Annots')) {
            const annotsRef: any = this._pageDictionary.getRaw('Annots'); // eslint-disable-line
            annots = this._getProperty('Annots');
            if (annotsRef instanceof _PdfReference) {
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
    _initializeGraphics(stream: _PdfContentStream): void {
        let isInvalidCase: boolean = false;
        let llx: number = 0;
        let lly: number = 0;
        let urx: number = 0;
        let ury: number = 0;
        const size: number[] = this.size;
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
                    (Math.floor(Math.abs(cy)) === Math.floor(Math.abs(size[1]))) &&
                    (Math.floor(Math.abs(cx)) === Math.floor(Math.abs(size[0])));
                if (isValid) {
                    this._g = new PdfGraphics([Math.max(cx, crx), Math.max(cy, cry)], stream, this._crossReference, this);
                } else {
                    this._g = new PdfGraphics(size, stream, this._crossReference, this);
                    this._g._cropBox = cbox;
                }
            } else {
                this._g = new PdfGraphics(size, stream, this._crossReference, this);
            }
        } else if ((llx < 0 || lly < 0 || urx < 0 || ury < 0) &&
            (Math.floor(Math.abs(lly)) === Math.floor(Math.abs(size[1]))) &&
            (Math.floor(Math.abs(urx)) === Math.floor(Math.abs(size[0])))) {
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
            this._g = new PdfGraphics([width, height], stream, this._crossReference, this);
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
                    this._g.translateTransform(0, size[1]);
                    this._g.rotateTransform(-90);
                    this._g._clipBounds = [clip[0], clip[1], size[0], size[1]];
                } else if (rotate === 180) {
                    this._g.translateTransform(size[0], size[1]);
                    this._g.rotateTransform(-180);
                } else if (rotate === 270) {
                    this._g.translateTransform(size[0], 0);
                    this._g.rotateTransform(-270);
                    this._g._clipBounds = [clip[0], clip[1], size[1], size[0]];
                }
            }
        }
        if (this._isNew && this._pageSettings) {
            const clipBounds: number[] = this._getActualBounds(this._pageSettings);
            this._g._clipTranslateMargins(clipBounds);
        }
        this._needInitializeGraphics = false;
    }
    _getActualBounds(pageSettings: PdfPageSettings): number[] {
        const actualSize: number[] = pageSettings._getActualSize();
        return [pageSettings.margins.left, pageSettings.margins.top, actualSize[0], actualSize[1]];
    }
    _fetchResources(): _PdfDictionary {
        if (typeof this._resourceObject === 'undefined') {
            if (this._pageDictionary && this._pageDictionary.has('Resources')) {
                const obj: any = this._pageDictionary.getRaw('Resources'); // eslint-disable-line
                if (obj !== null && typeof obj !== 'undefined' && obj instanceof _PdfReference) {
                    this._hasResourceReference = true;
                    this._resourceObject = this._crossReference._fetch(obj);
                } else if (obj instanceof _PdfDictionary) {
                    this._resourceObject = obj;
                }
            } else {
                this._resourceObject = new _PdfDictionary(this._crossReference);
                this._pageDictionary.update('Resources', this._resourceObject);
            }
        }
        return this._resourceObject;
    }
    _getCropOrMediaBox(): number[] {
        let box: number[];
        if (this._pageDictionary.has('CropBox')) {
            box = this._pageDictionary.getArray('CropBox');
        } else if (this._pageDictionary.has('MediaBox')) {
            box = this._pageDictionary.getArray('MediaBox');
        }
        return box;
    }
    _beginSave(): void {
        if (typeof this._graphicsState !== 'undefined') {
            this.graphics.restore(this._graphicsState);
            this._graphicsState = null;
            this._needInitializeGraphics = true;
        }
    }
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
    _obtainTabOrder(): PdfFormFieldsTabOrder {
        if  (this._pageDictionary.has('Tabs')) {
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
    _removeAnnotation(reference: _PdfReference): void {
        if (this._pageDictionary.has('Annots')) {
            const annots: Array<_PdfReference> = this._getProperty('Annots');
            if (annots && Array.isArray(annots)) {
                const index: number = annots.indexOf(reference);
                if (index >= 0) {
                    annots.splice(index, 1);
                }
                this._pageDictionary.set('Annots', annots);
                this._pageDictionary._updated = true;
            }
        }
    }
    get _contentTemplate(): PdfTemplate {
        this._loadContents();
        this._fetchResources();
        let array: Uint8Array;
        const list: Uint8Array[] = [];
        const count: number = this._contents.length;
        list.push(new Uint8Array([32, 113, 32, 10]));
        for (let i: number = 0; i < count; i++) {
            const reference: _PdfReference = this._contents[Number.parseInt(i.toString(), 10)];
            const base: any = this._crossReference._fetch(reference); // eslint-disable-line
            if (typeof base !== 'undefined') {
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
        }
        list.push(new Uint8Array([32, 81, 32, 10]));
        list.push(new Uint8Array([13, 10]));
        const targetArray: Uint8Array = this._combineIntoSingleArray(list);
        const targetStream: _PdfContentStream = new _PdfContentStream(Array.from(targetArray));
        const template: PdfTemplate = new PdfTemplate(targetStream, this._crossReference);
        template._content.dictionary.set('Resources', this._resourceObject);
        if (this.cropBox[0] > 0 || this.cropBox[1] > 0) {
            template._content.dictionary.set('BBox', this.cropBox);
            template._size = [this.cropBox[0], this.cropBox[1]];
        } else if (this.mediaBox[0] > 0 || this.mediaBox[1] > 0) {
            template._content.dictionary.set('BBox', this.mediaBox);
            template._size = [this.mediaBox[0], this.mediaBox[1]];
        } else {
            template._content.dictionary.set('BBox', [0, 0, this.size[0], this.size[1]]);
            template._size = [this.size[0], this.size[1]];
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
 * destination.location = [20, 20];
 * // Sets the bounds of the destination.
 * destination.destinationBounds = [20, 20, 100, 50];
 * // Sets destination to  document link annotation.
 * annotation.destination = destination;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */

export class PdfDestination {
    _page: PdfPage;
    _location: number[] = [0, 0];
    _destinationMode: PdfDestinationMode = PdfDestinationMode.location;
    _zoom: number = 0;
    _isValid: boolean = true;
    _index: number = 0;
    _destinationBounds: number[] = [0, 0, 0, 0];
    _array: Array<any> = Array<any>(); // eslint-disable-line
    _parent: any; // eslint-disable-line
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
     * destination.location = [20, 20];
     * // Sets the bounds of the destination.
     * destination.destinationBounds = [20, 20, 100, 50];
     * // Sets destination to  document link annotation.
     * annotation.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfDestination` class.
     *
     * @private
     * @param {PdfPage} page PdfPage.
     */
    constructor(page: PdfPage)
    /**
     * Initializes a new instance of the `PdfDestination` class.
     *
     * @private
     * @param {PdfPage} page PdfPage.
     * @param {number[]} location Location.
     */
    constructor(page: PdfPage, location: number[])
    constructor(page?: PdfPage, location?: number[]) {
        if (typeof page !== 'undefined' && page !== null) {
            if (page.rotation === PdfRotationAngle.angle180) {
                this._location = [page.graphics._size[0], this._location[1]];
            } else if (page.rotation === PdfRotationAngle.angle90) {
                this._location = [0, 0];
            } else if (page.rotation === PdfRotationAngle.angle270) {
                this._location = [page.graphics._size[0], 0];
            } else {
                this._location = [0,  this._location[1]];
            }
            this._page = page;
            this._index = page._pageIndex;
        }
        if (typeof location !== 'undefined' && location.length === 2) {
            this._location = location;
        }
        if (typeof location !== 'undefined' && location.length === 4) {
            this._location = [location[0], location[1]];
            this._destinationBounds = location;
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
     * destination.location = [20, 20];
     * // Sets the bounds of the destination.
     * destination.destinationBounds = [20, 20, 100, 50];
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
     * destination.location = [20, 20];
     * // Sets the bounds of the destination.
     * destination.destinationBounds = [20, 20, 100, 50];
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
     * destination.location = [20, 20];
     * // Sets the bounds of the destination.
     * destination.destinationBounds = [20, 20, 100, 50];
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
     * @returns {number[]} page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annot: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Gets the location of the destination.
     * let location: number[] = annot.destination.location;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get location(): number[] {
        return this._location;
    }
    /**
     * Sets the location of the destination.
     *
     * @param {number[]} value page.
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
     * destination.location = [20, 20];
     * // Sets the bounds of the destination.
     * destination.destinationBounds = [20, 20, 100, 50];
     * // Sets destination to  document link annotation.
     * annotation.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set location(value: number[]) {
        if (value !== this._location) {
            this._location = value;
            this._initializePrimitive();
        }
    }
    /**
     * Gets the bounds of the destination.
     *
     * @returns {number[]} bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annot: PdfDocumentLinkAnnotation = document.getPage(0).annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Gets the bounds of the destination.
     * let destinationBounds: number[] = annot.destination.destinationBounds;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get destinationBounds(): number[] {
        return this._destinationBounds;
    }
    /**
     * Sets the bounds of the destination.
     *
     * @param {number[]} value bounds.
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
     * destination.location = [20, 20];
     * // Sets the bounds of the destination.
     * destination.destinationBounds = [20, 20, 100, 50];
     * // Sets destination to  document link annotation.
     * annotation.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set destinationBounds(value: number[]) {
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
    _setValidation(value: boolean): void {
        this._isValid = value;
    }
    _initializePrimitive(): void {
        this._array = [];
        const page: PdfPage = this._page as PdfPage;
        const element: _PdfDictionary = this._page._pageDictionary;
        if (typeof element !== 'undefined' && element !== null) {
            this._array.push(this._page._ref);
        }
        switch (this._destinationMode) {
        case PdfDestinationMode.location:
            this._array.push(_PdfName.get('XYZ'));
            if (typeof page !== 'undefined' && page !== null) {
                this._array.push(this._location[0]);
                this._array.push(this._page.graphics._size[1] - this._location[1]);
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
            this._array.push(this._destinationBounds[0]);
            this._array.push(this._destinationBounds[1]);
            this._array.push(this._destinationBounds[2]);
            this._array.push(this._destinationBounds[3]);
            break;
        case PdfDestinationMode.fitH:
            this._array.push(_PdfName.get('FitH'));
            this._array.push((typeof page !== 'undefined' && page !== null) ? page._size[1] - this._location[1] : 0);
            break;
        }
        if (this._parent) {
            this._parent._dictionary.set(this._parent instanceof PdfNamedDestination ? 'D' : 'Dest', this._array);
            this._parent._dictionary._updated = true;
        }
    }
}

