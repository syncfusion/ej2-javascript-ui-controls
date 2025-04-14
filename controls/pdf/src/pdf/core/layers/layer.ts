import { _PdfBaseStream, _PdfContentStream, _PdfStream } from '../base-stream';
import { PdfPrintState, PdfRotationAngle } from '../enumerator';
import { PdfGraphics, PdfGraphicsState } from '../graphics/pdf-graphics';
import { _PdfCrossReference } from '../pdf-cross-reference';
import { PdfDocument } from '../pdf-document';
import { PdfPage } from '../pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from '../pdf-primitives';
import { PdfLayerCollection } from './layer-collection';
/**
 * Represents the base class for layer objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the collection of layers in the document
 * let layers: PdfLayerCollection = document.layers;
 * // Retrieve the first layer from the layers collection
 * let layer: PdfLayer = layers.at(0);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfLayer {
    private _page: PdfPage;
    private _graphics: PdfGraphics;
    private _content: _PdfContentStream;
    private _graphicsState: PdfGraphicsState;
    private _needInitializeGraphics: boolean;
    private _id: string;
    private _name: string;
    private _visible: boolean = true;
    _printOption: _PdfDictionary;
    _usage: _PdfDictionary;
    private _printState: PdfPrintState = PdfPrintState.printWhenVisible;
    _isEndState: boolean = false;
    _dictionary: _PdfDictionary = new _PdfDictionary();
    _referenceHolder: _PdfReference;
    _layer: PdfLayer;
    _document: PdfDocument;
    _pages: Array<PdfPage> = [];
    private _layers: PdfLayerCollection;
    _subLayerPosition: number;
    _subLayer: (_PdfReference | _PdfReference[])[] = [];
    private _locked: boolean = false;
    private _lock: _PdfReference[];
    _parentLayer: Array<PdfLayer> = [];
    _child: Array<PdfLayer> = [];
    _parent: PdfLayer;
    private _graphicsCollection: Map<PdfGraphics, PdfGraphics> = new Map();
    private _pageGraphics: Map<PdfPage, PdfGraphics> = new Map();
    private _pageParsed: boolean = false;
    _crossReference: _PdfCrossReference;
    _xObject: string[] = [];
    /**
     * Initializes a new instance of the `PdfLayer` class.
     *
     * @private
     */
    constructor() {
        this._content = new _PdfContentStream([]);
    }
    get _layerPage(): PdfPage {
        if (!this._pageParsed) {
            this._parseLayerPage();
        }
        return this._page;
    }
    get _layerId(): string {
        if (!this._pageParsed) {
            this._parseLayerPage();
        }
        return this._id;
    }
    set _layerId(value: string) {
        this._id = value;
    }
    /**
     * Gets the name of the layer.
     *
     * @returns {string} Name of the layer.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Retrieve the first layer from the layers collection
     * let layer: PdfLayer = layers.at(0);
     * // Retrieve the name of the layer
     * let name: string = layer.name;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get name(): string {
        return this._name || '';
    }
    /**
     * Sets the name of the layer.
     *
     * @param {string} name Name of the layer.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Retrieve the first layer from the layers collection
     * let layer: PdfLayer = layers.at(0);
     * // Change the name of the layer
     * layer.name = 'Layer2';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set name(name: string) {
        this._name = name;
        if (this._dictionary && this._name && this.name !== '') {
            this._dictionary.update('Name', this._name);
        }
    }
    /**
     * Gets the visibility of the layer.
     *
     * @returns {boolean} Boolean indicating whether the specified layer is visible or not.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Retrieve the first layer from the layers collection
     * let layer: PdfLayer = layers.at(0);
     * // Get the visibility state of the layer
     * let isVisible: boolean = layer.visible;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get visible(): boolean {
        if (this._dictionary) {
            const visibility: boolean = this._dictionary.get('Visible');
            if (typeof visibility === 'boolean') {
                this._visible = visibility;
            }
        }
        return this._visible;
    }
    /**
     * Sets the visibility of the layer.
     *
     * @param {boolean} isVisible Boolean indicating whether the specified layer is visible or not.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Retrieve the first layer from the layers collection
     * let layer: PdfLayer = layers.at(0);
     * // Set the layer visibility to true
     * layer.visible = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set visible(isVisible: boolean) {
        this._visible = isVisible;
        if (this._dictionary) {
            this._dictionary.update('Visible', isVisible);
        }
        this._setVisibility(isVisible);
        this._document._catalog._catalogDictionary._updated = true;
        this._crossReference._allowCatalog = true;
    }
    /**
     * Gets the boolean indicating whether the layer is locked or not.
     *
     * @returns {boolean} Boolean indicating whether the layer is locked or not.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Retrieve the first layer from the layers collection
     * let layer: PdfLayer = layers.at(0);
     * // Retrieve the lock status of the layer
     * let isLocked: boolean = layer.locked;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get locked(): boolean {
        return this._locked;
    }
    /**
     * Sets the boolean indicating whether the layer is locked or not.
     *
     * @param {boolean} isLocked Boolean indicating whether the layer is locked or not.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Retrieve the first layer from the layers collection
     * let layer: PdfLayer = layers.at(0);
     * // Lock the layer to prevent modifications
     * layer.locked = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set locked(isLocked: boolean) {
        this._locked = isLocked;
        if (typeof isLocked === 'boolean') {
            this._setLock(isLocked);
        }
        this._document._catalog._catalogDictionary._updated = true;
        this._crossReference._allowCatalog = true;
    }
    /**
     * Gets the print state of the layer.
     *
     * @returns {PdfPrintState} Print state.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Retrieve the first layer from the layers collection
     * let layer: PdfLayer = layers.at(0);
     * // Retrieve the printState of the layer
     * let printState: PdfPrintState = layer.printState;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get printState(): PdfPrintState {
        return this._printState;
    }
    /**
     * Sets the print state of the layer.
     *
     * @param {PdfPrintState} printState Print state.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Retrieve the first layer from the layers collection
     * let layer: PdfLayer = layers.at(0);
     * // Set the print state to 'alwaysPrint' to ensure this layer is printed
     * layer.printState = PdfPrintState.alwaysPrint;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set printState(printState: PdfPrintState) {
        this._printState = printState;
        if (this._printOption) {
            if (this.printState === PdfPrintState.alwaysPrint) {
                this._printOption.update('PrintState', new _PdfName('ON'));
            } else if (this.printState === PdfPrintState.neverPrint) {
                this._printOption.update('PrintState', new _PdfName('OFF'));
            }
        } else {
            this._setPrintState();
        }
    }
    /**
     * Gets the collection of `PdfLayer` from the layer.
     *
     * @returns {PdfLayerCollection} Layer collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Retrieve the first layer from the layers collection
     * let layer: PdfLayer = layers.at(0);
     * // Access the collection of layers in the layer (parent layer)
     * let childLayers: PdfLayerCollection = layer.layers;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get layers(): PdfLayerCollection {
        if (!this._layers) {
            this._layers = new PdfLayerCollection(this._document, this._layer);
            this._layers._subLayer = true;
        }
        return this._layers;
    }
    /**
     * Initializes graphics context of the layer.
     *
     * @param {PdfPage} page The PDF page.
     * @returns {PdfGraphics} Graphics of the layer content.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1'
     * let layer: PdfLayer = layers.add('Layer1');
     * // Create graphics for the newly added layer on the specified page
     * let graphics: PdfGraphics = layer.createGraphics(page);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    createGraphics(page: PdfPage): PdfGraphics {
        if (!this._graphics || this._needInitializeGraphics) {
            this._page = page;
            this._crossReference = page._crossReference;
            this._parseGraphics();
        }
        return this._graphics;
    }
    private _parseGraphics(): void {
        this._loadContents();
        const saveStream: _PdfContentStream = new _PdfContentStream([32, 113, 32, 10]);
        const saveReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(saveReference, saveStream);
        this._page._contents.splice(0, 0, saveReference);
        const restoreStream: _PdfContentStream = new _PdfContentStream([32, 81, 32, 10]);
        const restoreReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(restoreReference, restoreStream);
        this._page._contents.push(restoreReference);
        const contentStream: _PdfContentStream = new _PdfContentStream([]);
        const contentReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(contentReference, contentStream);
        this._page._contents.push(contentReference);
        this._page._pageDictionary.set('Contents', this._page._contents);
        this._page._pageDictionary._updated = true;
        this._initializeGraphics(contentStream);
        this._initializeProperties();
    }
    private _initializeProperties(): void {
        const resource: _PdfDictionary = this._graphics._resourceObject;
        if (resource && resource.has('Properties')) {
            const properties: _PdfDictionary = resource.get('Properties') as _PdfDictionary;
            if (properties) {
                properties.update(this._id, this._referenceHolder);
            } else {
                const properties: _PdfDictionary = new _PdfDictionary();
                properties.update(this._id, this._referenceHolder);
                resource.update('Properties', properties);
            }
        } else {
            const properties: _PdfDictionary = new _PdfDictionary();
            properties.update(this._id, this._referenceHolder);
            resource.update('Properties', properties);
        }
    }
    private _loadContents(): void {
        let contents: _PdfReference[] = this._page._pageDictionary.getRaw('Contents');
        let ref: _PdfReference;
        if (contents && contents && contents instanceof _PdfReference) {
            ref = contents;
            contents = this._crossReference._fetch(ref);
        }
        if (contents && contents instanceof _PdfBaseStream) {
            this._page._contents = [ref];
        } else if (contents && Array.isArray(contents)) {
            this._page._contents = contents;
        } else {
            this._page._contents = [];
        }
    }
    private _initializeGraphics(stream: _PdfContentStream): void {
        let isInvalidCase: boolean = false;
        let llx: number = 0;
        let lly: number = 0;
        let urx: number = 0;
        let ury: number = 0;
        const size: number[] = this._page.size;
        const mbox: number[] = this._page.mediaBox;
        if (mbox && mbox.length >= 4) {
            llx = mbox[0];
            lly = mbox[1];
            urx = mbox[2];
            ury = mbox[3];
        }
        let cbox: number[];
        if (this._page._pageDictionary.has('CropBox')) {
            cbox = this._page.cropBox;
            if (cbox && cbox.length >= 4) {
                const cx: number = cbox[0];
                const cy: number = cbox[1];
                const crx: number = cbox[2];
                const cry: number = cbox[3];
                const isValid: boolean = (cx < 0 || cy < 0 || crx < 0 || cry < 0) &&
                    (Math.floor(Math.abs(cy)) === Math.floor(Math.abs(size[1]))) &&
                    (Math.floor(Math.abs(cx)) === Math.floor(Math.abs(size[0])));
                if (isValid) {
                    this._graphics = new PdfGraphics([Math.max(cx, crx), Math.max(cy, cry)], stream, this._crossReference, this._page);
                } else {
                    this._graphics = new PdfGraphics(size, stream, this._crossReference, this._page);
                    this._graphics._cropBox = cbox;
                }
            } else {
                this._graphics = new PdfGraphics(size, stream, this._crossReference, this._page);
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
            this._graphics = new PdfGraphics([width, height], stream, this._crossReference, this._page);
        } else {
            this._graphics = new PdfGraphics(size, stream, this._crossReference, this._page);
        }
        if (this._page._pageDictionary.has('MediaBox')) {
            this._graphics._mediaBoxUpperRightBound = isInvalidCase ? -lly : ury;
        }
        this._graphicsState = this._graphics.save();
        const origin: number[] = this._page._origin;
        if ((origin[0] >= 0 && origin[1] >= 0) || Math.sign(origin[0]) !== Math.sign(origin[1])) {
            this._graphics._initializeCoordinates();
        } else {
            this._graphics._initializeCoordinates(this._page);
        }
        //Need to code - set transparency group
        if (!this._page._isNew) {
            const rotation: PdfRotationAngle = this._page.rotation;
            if (!Number.isNaN(rotation) && (rotation !== PdfRotationAngle.angle0 || this._page._pageDictionary.has('Rotate'))) {
                let rotate: number;
                if (this._page._pageDictionary.has('Rotate')) {
                    rotate = this._page._pageDictionary.get('Rotate');
                } else {
                    rotate = rotation * 90;
                }
                const clip: number[] = this._graphics._clipBounds;
                if (rotate === 90) {
                    this._graphics.translateTransform(0, size[1]);
                    this._graphics.rotateTransform(-90);
                    this._graphics._clipBounds = [clip[0], clip[1], size[0], size[1]];
                } else if (rotate === 180) {
                    this._graphics.translateTransform(size[0], size[1]);
                    this._graphics.rotateTransform(-180);
                } else if (rotate === 270) {
                    this._graphics.translateTransform(size[0], 0);
                    this._graphics.rotateTransform(-270);
                    this._graphics._clipBounds = [clip[0], clip[1], size[1], size[0]];
                }
            }
        }
        if (this._page._isNew && this._page._pageSettings) {
            const clipBounds: number[] = this._page._getActualBounds(this._page._pageSettings);
            this._graphics._clipTranslateMargins(clipBounds);
        }
        this._needInitializeGraphics = false;
        if (!this._graphicsCollection.has(this._graphics)) {
            this._graphicsCollection.set(this._graphics, this._graphics);
        }
        if (!this._pageGraphics.has(this._page)) {
            this._pageGraphics.set(this._page, this._graphics);
        }
        if (this._pages.indexOf(this._page) === -1) {
            this._pages.push(this._page);
        }
        this._graphics._layer = this;
    }
    _beginLayer(currentGraphics: PdfGraphics): void {
        if (this._graphicsCollection) {
            if (this._graphicsCollection.has(currentGraphics)) {
                this._graphics = this._graphicsCollection.get(currentGraphics);
            } else {
                this._graphics = currentGraphics;
            }
        }
        if (this._graphics && this._name && this._name !== '') {
            this._graphics._isEmptyLayer = true;
            if (this._parentLayer.length !== 0) {
                for (let i: number = 0; i < this._parentLayer.length; i++) {
                    if (this._parentLayer[Number.parseInt(i.toString(), 10)]._id && this._parentLayer[Number.parseInt(i.toString(), 10)]._layerId !== '') {
                        this._graphics._sw._write(`/OC /${this._parentLayer[Number.parseInt(i.toString(), 10)]._id} BDC`);
                    }
                }
            }
            const data: string = `/OC /${this._id} BDC`;
            if (this.name && this.name !== '') {
                this._graphics._sw._write(data);
                this._isEndState = true;
            } else {
                this._content.write(data);
            }
        }
    }
    private _setVisibility(value: boolean): void {
        const catalog: _PdfDictionary = this._document._catalog._catalogDictionary;
        let ocProperties: _PdfDictionary;
        if (catalog.has('OCProperties')) {
            ocProperties = catalog.get('OCProperties') as _PdfDictionary;
            if (!ocProperties) {
                ocProperties = new _PdfDictionary(this._crossReference);
            }
        }
        if (ocProperties) {
            let ocgOFF: _PdfReference[];
            let ocgON: _PdfReference[];
            let defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
            if (!defaultView) {
                defaultView = new _PdfDictionary(this._crossReference);
            }
            if (defaultView) {
                if (defaultView.has('ON')) {
                    ocgON = defaultView.get('ON') as _PdfReference[];
                    if (!ocgON) {
                        ocgON = [];
                    }
                }
                if (defaultView.has('OFF')) {
                    ocgOFF = defaultView.get('OFF') as _PdfReference[];
                    if (!ocgOFF) {
                        ocgOFF = [];
                    }
                }
                if (this._referenceHolder) {
                    if (!value) {
                        if (ocgON) {
                            const index: number = ocgON.indexOf(this._referenceHolder);
                            if (index !== -1) {
                                ocgON.splice(index, 1);
                            }
                        }
                        if (ocgOFF) {
                            const index: number = ocgOFF.indexOf(this._referenceHolder);
                            if (index !== -1) {
                                ocgOFF.splice(index);
                            }
                        }
                        ocgOFF.push(this._referenceHolder);
                    } else {
                        if (ocgOFF) {
                            const index: number = ocgOFF.indexOf(this._referenceHolder);
                            if (index !== -1) {
                                ocgOFF.splice(index, 1);
                            }
                        }
                        if (ocgON) {
                            const index: number = ocgON.indexOf(this._referenceHolder);
                            if (index !== -1) {
                                ocgON.splice(index);
                            }
                        }
                        ocgON.push(this._referenceHolder);
                    }
                }
                defaultView._updated = true;
            }
            ocProperties._updated = true;
        }
    }
    private _setLock(isSetLock: boolean): void {
        const catalog: _PdfDictionary = this._document._catalog._catalogDictionary;
        let ocProperties: _PdfDictionary;
        if (catalog.has('OCProperties')) {
            ocProperties = catalog.get('OCProperties');
            if (!ocProperties) {
                ocProperties = new _PdfDictionary(this._crossReference);
            }
        }
        if (ocProperties) {
            let defaultView: _PdfDictionary = ocProperties.get('D');
            if (!defaultView) {
                defaultView = new _PdfDictionary(this._crossReference);
            }
            if (defaultView) {
                const locked: Array<_PdfReference> = defaultView.get('Locked') as Array<_PdfReference>;
                if (this._referenceHolder) {
                    if (isSetLock) {
                        if (locked) {
                            if (locked.indexOf(this._referenceHolder) === -1) {
                                locked.push(this._referenceHolder);
                            }
                        } else {
                            this._lock = [];
                            this._lock.push(this._referenceHolder);
                            defaultView.update('Locked', this._lock);
                        }
                    } else if (locked) {
                        const index: number = locked.indexOf(this._referenceHolder);
                        if (index !== -1) {
                            locked.splice(index, 1);
                        }
                    }
                }
                defaultView._updated = true;
            }
            ocProperties._updated = true;
        }
    }
    private _parseLayerPage(): void {
        if (this._document) {
            for (let i: number = 0; i < this._document.pageCount; i++) {
                const pageDictionary: _PdfDictionary = this._document.getPage(i)._pageDictionary;
                const pageBase: PdfPage = this._document.getPage(i);
                if (pageDictionary.has('Resources')) {
                    const resources: _PdfDictionary = pageDictionary.get('Resources');
                    if (resources && (resources.has('Properties') || resources.has('XObject'))) {
                        const properties: _PdfDictionary = resources.get('Properties');
                        const xObject: _PdfDictionary = resources.get('XObject');
                        if (properties) {
                            const map: any = properties._map; // eslint-disable-line
                            for (const layerValue in map) {
                                if (map[String(layerValue)] instanceof _PdfReference) {
                                    const reference: _PdfReference = map[String(layerValue)] as _PdfReference;
                                    const dictionary: _PdfDictionary = this._crossReference._fetch(reference) as _PdfDictionary;
                                    const layerIDName: string = layerValue;
                                    const isPresent: boolean = this._parseDictionary(dictionary, reference, pageBase, layerIDName);
                                    if (isPresent) {
                                        break;
                                    }
                                }
                            }
                        }
                        if (xObject) {
                            const map: any = xObject._map; // eslint-disable-line
                            for (const layerValue in map) {
                                if (map[String(layerValue)] instanceof _PdfReference) {
                                    const reference: _PdfReference = map[String(layerValue)] as _PdfReference;
                                    const xobjectStream: _PdfStream = this._crossReference._fetch(reference) as _PdfStream;
                                    let dictionary: _PdfDictionary = xobjectStream.dictionary as _PdfDictionary;
                                    if (dictionary.has('OC')) {
                                        const layerIdName: string = layerValue;
                                        const ocReference: _PdfReference = dictionary.getRaw('OC') as _PdfReference;
                                        dictionary = this._crossReference._fetch(ocReference) as _PdfDictionary;
                                        const isPresent: boolean = this._parseDictionary(dictionary, ocReference, pageBase, layerIdName);
                                        if (isPresent) {
                                            this._layer._xObject.push(layerIdName);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    private _parseDictionary(dictionary: _PdfDictionary, reference: _PdfReference, pageBase: PdfPage, layerID: string): boolean {
        let isPresent: boolean = false;
        if (dictionary.has('Name') && dictionary.has('OCGs')) {
            const refArray: _PdfReference[] = dictionary.get('OCGs') as [];
            if (!refArray) {
                reference = dictionary.getRaw('OCGs') as _PdfReference;
                dictionary = dictionary.get('OCGs') as _PdfDictionary;
                if (dictionary && dictionary.has('Name')) {
                    isPresent = this._setLayerPage(reference, pageBase, layerID);
                }
            } else {
                for (let a: number = 0; a < refArray.length; a++) {
                    if (refArray[Number.parseInt(a.toString(), 10)] instanceof _PdfReference) {
                        reference = refArray[Number.parseInt(a.toString(), 10)] as _PdfReference;
                        dictionary = this._crossReference._fetch(reference) as _PdfDictionary;
                        isPresent = this._setLayerPage(reference, pageBase, layerID);
                    }
                }
            }
        } else if (dictionary.has('Name')) {
            isPresent = this._setLayerPage(reference, pageBase, layerID);
        }
        return isPresent;
    }
    private _setLayerPage(reference: _PdfReference, pageBase: PdfPage, layerID: string): boolean {
        let isPresent: boolean = false;
        if (this._layer._referenceHolder && this._layer._referenceHolder === reference) {
            this._layer._pageParsed = true;
            isPresent = true;
            this._layer._layerId = layerID;
            this._layer._page = pageBase;
            if (this._layer._pages.indexOf(pageBase) === -1) {
                this._layer._pages.push(pageBase);
            }
        }
        return isPresent;
    }
    private _setPrintState(): void {
        const catalog: _PdfDictionary = this._document._catalog._catalogDictionary;
        let ocProperties: _PdfDictionary;
        let usageDictionary: _PdfDictionary;
        if (catalog.has('OCProperties')) {
            ocProperties = catalog.get('OCProperties') as _PdfDictionary;
            if (!ocProperties) {
                ocProperties = new _PdfDictionary(this._crossReference);
            }
        }
        let ocGroup: _PdfReference[] = ocProperties.get('OCGs') as _PdfReference[];
        if (!ocGroup) {
            ocGroup = [];
        }
        if (!this._dictionary.has('Usage')) {
            usageDictionary = new _PdfDictionary();
        } else {
            usageDictionary = this._dictionary.get('Usage') as _PdfDictionary;
        }
        this._layer._printOption = new _PdfDictionary();
        this._layer._printOption.update('Subtype', new _PdfName('Print'));
        if (this._layer._printState === PdfPrintState.neverPrint) {
            this._layer._printOption.update('PrintState', new _PdfName('OFF'));
        } else if (this._layer.printState === PdfPrintState.alwaysPrint) {
            this._layer._printOption.update('PrintState', new _PdfName('ON'));
        }
        let reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, this._layer._printOption);
        usageDictionary.update('Print', reference);
        this._layer._usage = usageDictionary;
        this._dictionary.update('Usage', this._layer._usage);
        const category: _PdfName[] = [];
        category.push(new _PdfName('Print'));
        const _usageApplication: _PdfDictionary = new _PdfDictionary();
        _usageApplication.update('Category', category);
        _usageApplication.update('OCGs', ocGroup);
        _usageApplication.update('Event', new _PdfName('Print'));
        const usageApplication: _PdfReference[] = [];
        reference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, _usageApplication);
        usageApplication.push(reference);
        let defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
        if (!defaultView) {
            defaultView = new _PdfDictionary(this._crossReference);
        }
        defaultView.update('D', usageApplication);
    }
}
