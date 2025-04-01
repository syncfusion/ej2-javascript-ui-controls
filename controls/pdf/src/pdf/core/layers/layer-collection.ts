import { _PdfContentStream } from '../base-stream';
import { _ContentParser, _PdfRecord } from '../content-parser';
import { PdfPrintState } from '../enumerator';
import { _PdfCatalog } from '../pdf-catalog';
import { _PdfCrossReference } from '../pdf-cross-reference';
import { PdfDocument } from '../pdf-document';
import { PdfPage } from '../pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from '../pdf-primitives';
import { _getNewGuidString } from '../utils';
import { PdfLayer } from './layer';
/**
 * The class provides methods and properties to handle the collection of `PdfLayer`.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the collection of layers in the document
 * let layers: PdfLayerCollection = document.layers;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfLayerCollection {
    _subLayer: boolean = false;
    private _isLayerContainsResource: boolean = false;
    private _document: PdfDocument;
    private _parent: PdfLayer;
    private _layerDictionary: Map<_PdfReference, PdfLayer> = new Map();
    private _bdcCount: number = 0;
    private _list: PdfLayer[];
    private _crossReference: _PdfCrossReference;
    private _catalog: _PdfCatalog;
    /**
     * Initializes a new instance of the `PdfLayerCollection` class with document.
     *
     * @private
     * @param {PdfDocument} document Document.
     */
    constructor(document: PdfDocument)
    /**
     * Initializes a new instance of the `PdfLayerCollection` class with document and layer.
     *
     * @private
     * @param {PdfDocument} document Document.
     * @param {PdfLayer} layer PDF layer.
     */
    constructor(document: PdfDocument, layer: PdfLayer)
    constructor(document: PdfDocument, layer?: PdfLayer) {
        if (!this._list) {
            this._list = [];
        }
        this._crossReference = document._crossReference;
        this._catalog = document._catalog;
        this._document = document;
        if (layer) {
            this._parent = layer;
        } else {
            let _layerDictionary: _PdfDictionary;
            let _layerReference: _PdfReference;
            if (this._document && this._document._catalog && this._document._catalog._catalogDictionary
                && this._document._catalog._catalogDictionary.has('OCProperties')
            ) {
                const ocProperties: _PdfDictionary = this._document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
                if (ocProperties && ocProperties.has('OCGs')) {
                    const ocGroup: _PdfReference[] = ocProperties.get('OCGs') as _PdfReference[];
                    if (ocGroup && Array.isArray(ocGroup)) {
                        for (let i: number = 0; i < ocGroup.length; i++) {
                            _layerReference = ocGroup[Number.parseInt(i.toString(), 10)] as _PdfReference;
                            if (_layerReference instanceof _PdfReference) {
                                _layerDictionary = this._crossReference._fetch(_layerReference) as _PdfDictionary;
                                const layer: PdfLayer = new PdfLayer();
                                if (_layerDictionary) {
                                    if (_layerDictionary.has('Name')) {
                                        const layerName: string = _layerDictionary.get('Name') as string;
                                        layer.name = layerName;
                                        layer._dictionary = _layerDictionary;
                                        layer._crossReference = this._document._crossReference;
                                        layer._referenceHolder = _layerReference;
                                        const layerId: _PdfName = _layerDictionary.get('LayerID') as _PdfName;
                                        if (layerId) {
                                            layer._layerId = layerId.name;
                                        }
                                        const _print: _PdfReference | _PdfDictionary = _layerDictionary.getRaw('Usage');
                                        if (_print && _print instanceof _PdfDictionary) {
                                            const printOption: _PdfDictionary = _print.get('Print') as _PdfDictionary;
                                            if (printOption && printOption instanceof _PdfDictionary) {
                                                layer._printOption = printOption;
                                                if (printOption.has('PrintState')) {
                                                    this._setPrintState(printOption, layer);
                                                }
                                            }
                                            const viewState: _PdfDictionary = _print.get('View') as _PdfDictionary;
                                            if (viewState && viewState instanceof _PdfDictionary && viewState.has('ViewState')) {
                                                const view: _PdfName = viewState.get('ViewState') as _PdfName;
                                                if (view.name === 'OFF') {
                                                    layer.visible = false;
                                                }
                                            }
                                        }
                                        if (_print && _print instanceof _PdfReference) {
                                            const printRef: _PdfDictionary = this._crossReference._fetch(_print) as _PdfDictionary;
                                            if (printRef && printRef instanceof _PdfDictionary) {
                                                const _printOptionReference: _PdfReference = printRef.getRaw('Print') as _PdfReference;
                                                if (_printOptionReference && _printOptionReference instanceof _PdfReference) {
                                                    const subtytpe: _PdfDictionary = this._crossReference._fetch(_printOptionReference);
                                                    if (subtytpe && subtytpe instanceof _PdfDictionary) {
                                                        layer._printOption = subtytpe;
                                                        if (subtytpe.has('PrintState')) {
                                                            this._setPrintState(subtytpe, layer);
                                                        }
                                                    }
                                                }
                                                const viewStateReference: _PdfReference = printRef.getRaw('View') as _PdfReference;
                                                if (viewStateReference && viewStateReference instanceof _PdfReference) {
                                                    const viewState: _PdfDictionary = this._crossReference._fetch(viewStateReference);
                                                    if (viewState && viewState instanceof _PdfDictionary && viewState.has('ViewState')) {
                                                        const view: _PdfName = viewState.get('ViewState') as _PdfName;
                                                        if (view.name === 'OFF') {
                                                            layer.visible = false;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    layer._document = document;
                                    layer._layer = layer;
                                    this._layerDictionary.set(_layerReference, layer);
                                    this._list.push(layer);
                                }
                            }
                        }
                    }
                    this._checkLayerLock(ocProperties);
                    this._checkLayerVisible(ocProperties);
                    this._checkParentLayer(ocProperties);
                    this._createLayerHierarchical(ocProperties);
                }
            }
        }
    }
    get _isSkip(): boolean {
        return this._bdcCount > 0;
    }
    /**
     * Gets the layer count.
     *
     * @returns {number} Number of layers.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Retrieve layer counts from the layers collection
     * let count: number = layers.count;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get count(): number {
        return this._list.length;
    }
    /**
     * Gets the `PdfLayer` at the specified index.
     *
     * @param {number} index Layer index.
     * @returns {PdfLayer} Layer at the specified index.
     *
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
    at(index: number): PdfLayer {
        return this._list[Number.parseInt(index.toString(), 10)];
    }
    /**
     * Create a new `PdfLayer` with name
     * add it to the end of the collection.
     *
     * @param {string} name Name of the layer.
     * @returns {PdfLayer} Layer with the name specified.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1'
     * let layer: PdfLayer = layers.add('Layer1');
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(name: string): PdfLayer
    /**
     * Create a new `PdfLayer` with name and Boolean flag to set the visibility of layer
     * add it to the end of the collection.
     *
     * @param {string} name Name of the layer.
     * @param {boolean} visible Visibility of the layer.
     * @returns {PdfLayer} Layer with the name specified.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1' and set visibility to be true
     * let layer: PdfLayer = layers.add('Layer1', true);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(name: string, visible: boolean): PdfLayer
    add(name: string, visible?: boolean): PdfLayer {
        const newLayer: PdfLayer = new PdfLayer();
        newLayer._document = this._document;
        newLayer._crossReference = this._document._crossReference;
        newLayer.name = name;
        if (visible !== null && typeof visible !== 'undefined') {
            newLayer.visible = visible;
        }
        newLayer._layerId = 'OCG_' + _getNewGuidString();
        newLayer._subLayerPosition = 0;
        newLayer._layer = newLayer;
        this._addLayer(newLayer);
        return newLayer;
    }
    /**
     * Boolean indicating whether the specified layer exists or not.
     *
     * @param {PdfLayer} layer The layer to be checked.
     * @returns {boolean} Returns true, if the layer exists. Otherwise, false
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1'
     * let layer: PdfLayer = layers.add('Layer1');
     * // Check if the layer is present in the layers collection
     * let isPresent: boolean = layers.contains(layer);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    contains(layer: PdfLayer): boolean
    /**
     * Boolean indicating whether the specified layer name exists or not.
     *
     * @param {string} name The layer name to be checked.
     * @returns {boolean} Returns true, if the layer exists. Otherwise, false
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1'
     * let layer: PdfLayer = layers.add('Layer1');
     * // Check if the layer is present in the layers collection
     * let isPresent: boolean = layers.contains('Layer1');
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    contains(name: string): boolean
    contains(arg: PdfLayer | string): boolean {
        if (!arg) {
            throw new Error('Layer cannot be null or undefined');
        }
        if (typeof arg === 'string') {
            for (let i: number = 0; i < this._list.length; i++) {
                const layer: PdfLayer = this._list[Number.parseInt(i.toString(), 10)];
                if (layer.name === arg) {
                    return true;
                }
            }
        } else if (arg instanceof PdfLayer) {
            if (this._list.indexOf(arg) !== -1) {
                return true;
            }
        }
        return false;
    }
    /**
     * Remove all the layers.
     *
     * @returns {void} Returns nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Removes all layers from the collection
     * layers.clear();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    clear(): void {
        for (let i: number = this._list.length - 1; i > -1; i--) {
            const layer: PdfLayer = this._list[Number.parseInt(i.toString(), 10)];
            this._removeLayer(layer, true);
        }
        this._list.length = 0;
    }
    /**
     * Index of the specified layer.
     *
     * @param {PdfLayer} layer The layer to be checked.
     * @returns {number} Index of the layer.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1'
     * let layer: PdfLayer = layers.add('Layer1');
     * // Find the index of the layer in the layers collection
     * let index: number = layers.indexOf(layer);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    indexOf(layer: PdfLayer): number {
        if (!layer) {
            throw new Error('Layer cannot be null or undefined');
        }
        return this._list.indexOf(layer);
    }
    /**
     * Move the `PdfLayer` into the collection at specified index.
     *
     * @param {number} index Index of the layer.
     * @param {PdfLayer} layer Layer to move.
     * @returns {void} Returns nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1'
     * let layer: PdfLayer = layers.add('Layer1');
     * // Add a new layer to the document with the name 'Layer2'
     * let layer1: PdfLayer = layers.add('Layer2');
     * // Move 'layer2' to the first position (index 0)
     * layers.move(0, layer2);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    move(index: number, layer: PdfLayer): void {
        if (index < 0 || index >= this._list.length) {
            throw new Error('Index cannot be less than 0 or greater than array length');
        }
        if (!layer) {
            throw new Error('Layer cannot be null or undefined');
        }
        let position: number;
        for (let i: number = 0; i < this._list.length; i++) {
            if (this._list[Number.parseInt(i.toString(), 10)] === layer) {
                position = this.indexOf(this._list[Number.parseInt(i.toString(), 10)]);
                break;
            }
        }
        if (position !== null && typeof position !== 'undefined' && position !== index) {
            this._list.splice(position, 1);
            this._list.splice(index, 0, layer);
            this._insertLayer(index, layer);
        }
    }
    /**
     * Remove the `PdfLayer` at the specified index from the collection.
     *
     * @param {number} index The index of the layer to be removed.
     * @returns {void} Returns nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Remove the layer at index 0 (the first layer)
     * layers.removeAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removeAt(index: number): void
    /**
     * Remove the `PdfLayer` at the specified index from the collection.
     *
     * @param {number} index The index of the layer to be removed.
     * @param {boolean} removeGraphicalContent Remove graphical content, if true.
     * @returns {void} Returns nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Remove the layer at index 0 (the first layer) with graphics on page
     * layers.removeAt(0, true);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removeAt(index: number, removeGraphicalContent: boolean): void
    removeAt(arg1: number, arg2?: boolean): void {
        if (arg1 < 0 || arg1 >= this._list.length) {
            throw new Error('Index cannot be less than 0 or greater than array length');
        }
        const layer: PdfLayer = this._list[Number.parseInt(arg1.toString(), 10)];
        this._list.splice(arg1, 1);
        if (layer) {
            this._removeLayer(layer, arg2 || false);
            if (layer._child.length > 0) {
                for (let i: number = 0; i < layer._child.length; i++) {
                    this._removeLayer(layer._child[Number.parseInt(i.toString(), 10)], false);
                    const index: number = this._list.indexOf(layer._child[Number.parseInt(i.toString(), 10)]);
                    if (index !== -1) {
                        this._list.splice(index, 1);
                    }
                }
            }
        }
    }
    /**
     * Remove the `PdfLayer` with layer instance from the collection.
     *
     * @param {PdfLayer} layer Layer to remove.
     * @returns {void} Returns nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1'
     * let layer: PdfLayer = layers.add('Layer1');
     * // Remove the layer from layer collection with instance
     * layers.remove(layer);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    remove(layer: PdfLayer): void
    /**
     * Remove the `PdfLayer` with layer instance from the collection.
     *
     * @param {PdfLayer} layer Layer to remove.
     * @param {boolean} removeGraphicalContent Remove graphical content, if true.
     * @returns {void} Returns nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1'
     * let layer: PdfLayer = layers.add('Layer1');
     * // Remove the layer from layer collection with instance and graphics on page
     * layers.remove(layer, true);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    remove(layer: PdfLayer, removeGraphicalContent: boolean): void
    /**
     * Remove the `PdfLayer` at the layer name from the collection.
     *
     * @param {string} name Layer name to remove.
     * @returns {void} Returns nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1'
     * let layer: PdfLayer = layers.add('Layer1');
     * // Remove the layer with name
     * layers.remove('Layer1');
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    remove(name: string): void
    /**
     * Remove the `PdfLayer` at the layer name from the collection.
     *
     * @param {string} name Layer name to remove.
     * @param {boolean} removeGraphicalContent Remove graphical content, if true.
     * @returns {void} Returns nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer to the document with the name 'Layer1'
     * let layer: PdfLayer = layers.add('Layer1');
     * // Remove the layer with name and graphics on page
     * layers.remove('Layer1', true);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    remove(name: string, removeGraphicalContent: boolean): void
    remove(arg1: PdfLayer | string, arg2?: boolean): void {
        if (arg1 instanceof PdfLayer) {
            const layer: PdfLayer = arg1;
            const index: number = this._list.indexOf(layer);
            if (index !== -1) {
                this.removeAt(index, arg2 || false);
            }
        } else if (typeof arg1 === 'string') {
            for (let i: number = 0; i < this._list.length; i++) {
                const layer: PdfLayer = this._list[Number.parseInt(i.toString(), 10)];
                const index: number = this._list.indexOf(layer);
                if (layer.name === arg1 && index !== -1) {
                    this.removeAt(index, arg2 || false);
                    i = i - 1;
                }
            }
        }
    }
    private _setPrintState(printOption: _PdfDictionary, layer: PdfLayer): void {
        const printState: _PdfName = printOption.get('PrintState') as _PdfName;
        if (printState && printState instanceof _PdfName) {
            if (printState.name === 'ON') {
                layer.printState = PdfPrintState.alwaysPrint;
            } else {
                layer.printState = PdfPrintState.neverPrint;
            }
        }
    }
    private _addLayer(layer: PdfLayer): number {
        this._list.push(layer);
        const index: number = this._list.length - 1;
        if (this._document instanceof PdfDocument) {
            this._createLayer(layer);
        }
        layer._layer = layer;
        return index;
    }
    private _createLayer(layer: PdfLayer): void {
        const ocProperties: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const ocGroups: _PdfReference[] = this._createOptionalContentDictionary(layer);
        let isPresent: boolean = false;
        if (this._document && this._document._catalog && this._document._catalog._catalogDictionary.has('OCProperties') && this._isLayerContainsResource) {
            const _ocDictionary: _PdfDictionary = this._document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
            if (_ocDictionary && _ocDictionary.has('OCGs')) {
                const ocgsList: _PdfReference[] = _ocDictionary.get('OCGs') as _PdfReference[];
                if (ocgsList && ocGroups) {
                    isPresent = true;
                    for (const obj of ocGroups) {
                        if (ocgsList.indexOf(obj) === -1) {
                            ocgsList.push(obj);
                        }
                    }
                }
                if (_ocDictionary.has('D')) {
                    const defaultView: _PdfDictionary = _ocDictionary.get('D') as _PdfDictionary;
                    if (defaultView) {
                        let on: _PdfReference[];
                        let off: _PdfReference[];
                        let _usage: _PdfReference[];
                        if (!defaultView.has('Order')) {
                            defaultView.update('Order', this._document._order);
                        }
                        if (defaultView.has('OFF')) {
                            off = defaultView.get('OFF') as _PdfReference[];
                        }
                        if (defaultView.has('ON')) {
                            on = defaultView.get('ON') as _PdfReference[];
                        }
                        if (defaultView.has('AS')) {
                            _usage = defaultView.get('AS') as _PdfReference[];
                        }
                        if (_usage) {
                            for (let i: number = 0; i < _usage.length; i++) {
                                let usageDictionary: _PdfDictionary;
                                const value: _PdfReference = _usage[Number.parseInt(i.toString(), 10)] as _PdfReference;
                                if (value instanceof _PdfReference) {
                                    usageDictionary = this._crossReference._fetch(value) as _PdfDictionary;
                                    if (usageDictionary && usageDictionary instanceof _PdfDictionary) {
                                        const usageOcGroup: _PdfReference[] = usageDictionary.get('OCGs') as _PdfReference[];
                                        if (usageOcGroup && ocGroups && usageOcGroup.indexOf(layer._referenceHolder) === -1) {
                                            usageOcGroup.push(layer._referenceHolder);
                                        }
                                    }
                                }
                            }
                        }
                        if (layer.visible) {
                            if (on && ocGroups && on.indexOf(layer._referenceHolder) === -1) {
                                on.push(layer._referenceHolder);
                            }
                        } else if (off && ocGroups && off.indexOf(layer._referenceHolder) === -1) {
                            off.push(layer._referenceHolder);
                        }
                    }
                }
                this._document._catalog._catalogDictionary._updated = true;
            }
        }
        if (!isPresent) {
            ocProperties.update('OCGs', ocGroups);
            ocProperties.update('D', this._createOptionalContentViews());
            this._catalog._catalogDictionary.update('OCProperties', ocProperties);
        }
        this._crossReference._allowCatalog = true;
    }
    private _createOptionalContentDictionary(layer: PdfLayer): Array<_PdfReference> {
        const _dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, _dictionary);
        _dictionary.update('Name', layer.name);
        _dictionary.update('Type',  new _PdfName('OCG'));
        _dictionary.update('LayerID', new _PdfName(layer._layerId));
        _dictionary.update('Visible', layer.visible);
        if (
            layer.printState === PdfPrintState.alwaysPrint ||
            layer.printState === PdfPrintState.neverPrint ||
            layer.printState === PdfPrintState.printWhenVisible
        ) {
            const UsageReference: _PdfReference = this._setPrintOption(layer);
            _dictionary.update('Usage', UsageReference);
            this._document._printLayer.push(reference);
        }
        this._document._optionalContentDictionaries.push(reference);
        layer._dictionary = _dictionary;
        layer._referenceHolder = reference;
        const ocProperties: _PdfDictionary = this._document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        this._createSublayer(ocProperties, reference, layer);
        if (layer.visible) {
            this._document._on.push(reference);
        } else {
            this._document._off.push(reference);
        }
        this._isLayerContainsResource = true;
        return this._document._optionalContentDictionaries;
    }
    private _createOptionalContentViews(): _PdfDictionary {
        const _optionalContent: _PdfDictionary = new _PdfDictionary();
        _optionalContent.update('Name', 'Layers');
        _optionalContent.update('Order', this._document._order);
        _optionalContent.update('ON', this._document._on);
        _optionalContent.update('OFF', this._document._off);
        const category: Array<_PdfName> = [];
        category.push(new _PdfName('Print'));
        const _usageApplication: _PdfDictionary = new _PdfDictionary();
        _usageApplication.update('Category', category);
        _usageApplication.update('OCGs', this._document._printLayer);
        _usageApplication.update('Event', new _PdfName('Print'));
        const reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, _usageApplication);
        this._document._as.push(reference);
        _optionalContent.update('AS', this._document._as);
        return _optionalContent;
    }
    private _setPrintOption(layer: PdfLayer): _PdfReference {
        const _usage: _PdfDictionary = new _PdfDictionary();
        const _print: _PdfDictionary = new _PdfDictionary();
        const usageReference: _PdfReference = this._crossReference._getNextReference();
        const printReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(usageReference, _usage);
        this._crossReference._cacheMap.set(printReference, _print);
        _print.update('Subtype', new _PdfName('Print'));
        if (layer.printState === PdfPrintState.neverPrint) {
            _print.update('PrintState', new _PdfName('OFF'));
        } else if (layer.printState === PdfPrintState.alwaysPrint) {
            _print.update('PrintState', new _PdfName('ON'));
        }
        layer._usage = _usage;
        layer._printOption = _print;
        _usage.update('Print', printReference);
        return usageReference;
    }
    private _createSublayer(ocProperties: _PdfDictionary, reference: _PdfReference, layer: PdfLayer): void {
        if (!this._subLayer) {
            if (ocProperties) {
                let order: (_PdfReference | _PdfReference[])[];
                const defaultview: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
                if (defaultview) {
                    order = defaultview.get('Order') as (_PdfReference | _PdfReference[])[];
                }
                if (order) {
                    this._document._order = order;
                }
                this._document._order.push(reference);
            } else {
                this._document._order.push(reference);
            }
        } else {
            layer._parent = this._parent;
            if (ocProperties) {
                let order: (_PdfReference | _PdfReference[])[];
                const defaultview: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
                if (defaultview) {
                    order = defaultview.get('Order') as [];
                }
                if (this._document._order && order) {
                    this._document._order = order;
                }
            }
            if (this._parent._child.length === 0) {
                this._parent._subLayer.push(reference);
            } else if (this._document._order.indexOf(this._parent._referenceHolder) !== -1) {
                const position: number = this._document._order.indexOf(this._parent._referenceHolder);
                this._document._order.splice(position + 1, 1);
                this._parent._subLayer.push(reference);
            } else {
                this._parent._subLayer.push(reference);
            }
            if (this._document._order.indexOf(this._parent._referenceHolder) !== -1) {
                const position: number = this._document._order.indexOf(this._parent._referenceHolder);
                this._document._order.splice(position + 1, 0, this._parent._subLayer as []);
            } else {
                if (this._parent._parent) {
                    if (this._parent._parent._subLayer.indexOf(this._parent._referenceHolder) !== -1) {
                        const position: number = this._parent._parent._subLayer.indexOf(this._parent._referenceHolder);
                        if (this._parent._subLayer.length === 1) {
                            this._parent._parent._subLayer.splice(position + 1, 0, this._parent._subLayer as []);
                        }
                        if (this._document._order.indexOf(this._parent._parent._referenceHolder) !== -1) {
                            const position: number = this._document._order.indexOf(this._parent._parent._referenceHolder);
                            this._document._order.splice(position + 1, 1);
                            this._document._order.splice(position + 1, 0, this._parent._parent._subLayer as []);
                        }
                    }
                } else {
                    if (document instanceof PdfDocument) {
                        for (let i: number = 0; i < document._order.length; i++) {
                            if (Array.isArray(document._order[Number.parseInt(i.toString(), 10)])) {
                                const value: any = document._order[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                                const orderArray: (_PdfReference | _PdfReference[])[] = value as (_PdfReference | _PdfReference[])[];
                                if (orderArray.indexOf(this._parent._referenceHolder) !== -1) {
                                    const position: number = orderArray.indexOf(this._parent._referenceHolder);
                                    if (this._parent._subLayer.length === 1) {
                                        orderArray.splice(position + 1, 0, this._parent._subLayer as []);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this._parent._child.indexOf(layer) === -1) {
                this._parent._child.push(layer);
            }
            if (this._parent._parentLayer.length === 0) {
                layer._parentLayer.push(this._parent);
            } else {
                for (let i: number = 0; i < this._parent._parentLayer.length; i++) {
                    if (layer._parentLayer.indexOf(this._parent._parentLayer[Number.parseInt(i.toString(), 10)]) === -1) {
                        layer._parentLayer.push(this._parent._parentLayer[Number.parseInt(i.toString(), 10)]);
                    }
                }
                if (layer._parentLayer.indexOf(this._parent) === -1) {
                    layer._parentLayer.push(this._parent);
                }
            }
        }
    }
    private _checkLayerLock(ocProperties: _PdfDictionary): void {
        let locked: _PdfReference[];
        const defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
        if (defaultView && defaultView.has('Locked')) {
            locked = defaultView.get('Locked') as _PdfReference[];
        }
        if (locked) {
            for (let i: number = 0; i < locked.length; i++) {
                const referenceHolder: _PdfReference = locked[Number.parseInt(i.toString(), 10)] as _PdfReference;
                if (referenceHolder && referenceHolder instanceof _PdfReference) {
                    const pdfLayer: PdfLayer = this._layerDictionary.get(referenceHolder) as PdfLayer;
                    if (pdfLayer) {
                        pdfLayer.locked = true;
                    }
                }
            }
        }
    }
    private _checkLayerVisible(ocProperties: _PdfDictionary): void {
        const _document: PdfDocument = this._document;
        let visible: _PdfReference[];
        if (_document._catalog && _document._catalog._catalogDictionary.has('OCProperties')) {
            const defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
            if (defaultView && defaultView.has('OFF')) {
                visible = defaultView.get('OFF') as _PdfReference[];
            }
            if (visible) {
                for (let i: number = 0; i < visible.length; i++) {
                    const visibleReference: _PdfReference = visible[Number.parseInt(i.toString(), 10)] as _PdfReference;
                    if (visibleReference instanceof _PdfReference) {
                        const layerDictionary: Map<_PdfReference, PdfLayer> = this._layerDictionary;
                        if (layerDictionary && layerDictionary.size > 0 && visibleReference && layerDictionary.has(visibleReference)) {
                            const pdfLayer: PdfLayer = layerDictionary.get(visibleReference) as PdfLayer;
                            if (pdfLayer) {
                                pdfLayer.visible = false;
                                if (pdfLayer._dictionary && pdfLayer._dictionary.has('Visible')) {
                                    pdfLayer._dictionary.set('Visible', false);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    private _checkParentLayer(ocProperties: _PdfDictionary): void {
        const defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
        if (defaultView) {
            const array: (_PdfReference | _PdfReference[])[] = defaultView.get('Order');
            if (array) {
                this._parsingLayerOrder(null, array, this._layerDictionary);
            }
        }
    }
    private _parsingLayerOrder(
        parent: PdfLayer,
        array: (_PdfReference | _PdfReference[])[],
        layerDictionary: Map<_PdfReference, PdfLayer>
    ): void {
        let reference: _PdfReference;
        let layer: PdfLayer;
        for (let i: number = 0; i < array.length; i++) {
            reference = array[Number.parseInt(i.toString(), 10)] as _PdfReference;
            if (reference instanceof _PdfReference) {
                if (layerDictionary.has(reference)) {
                    layer = layerDictionary.get(reference) as PdfLayer;
                }
                if (layer) {
                    if (parent) {
                        if (parent._child.indexOf(layer) === -1) {
                            parent._child.push(layer);
                        }
                        if (parent._parentLayer.length === 0) {
                            layer._parentLayer.push(parent);
                            layer._parent = parent;
                        } else {
                            for (let j: number = 0; j < parent._parentLayer.length; j++) {
                                if (layer._parentLayer.indexOf(parent._parentLayer[Number.parseInt(j.toString(), 10)]) === -1) {
                                    if (!(parent._parentLayer[Number.parseInt(j.toString(), 10)] instanceof PdfLayer)
                                    && parent._parentLayer[Number.parseInt(j.toString(), 10)]) {
                                        layer._parentLayer.push(parent._parentLayer[Number.parseInt(j.toString(), 10)]);
                                    }
                                }
                            }
                            layer._parentLayer.push(parent);
                            layer._parent = parent;
                        }
                    }
                    if (array.length > i + 1 && (Array.isArray(array[i + 1]))) {
                        i++;
                        const pdfArray: any = array[i] as any; // eslint-disable-line
                        layer._subLayer = pdfArray as (_PdfReference | _PdfReference[])[];
                        this._parsingLayerOrder(layer, pdfArray, layerDictionary);
                    }
                }
            } else if (Array.isArray(array[Number.parseInt(i.toString(), 10)])) {
                const value: any = array[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                const subArray: (_PdfReference | _PdfReference[])[] = value as (_PdfReference | _PdfReference[])[];
                if (!subArray || subArray.length === 0) {
                    return;
                }
                if (typeof subArray[0] === 'string') {
                    parent = null;
                    this._parsingLayerOrder(parent, subArray, layerDictionary);
                } else {
                    parent = null;
                    this._parsingLayerOrder(parent, array[i] as any, layerDictionary); // eslint-disable-line
                }
            }
        }
    }
    private _createLayerHierarchical(ocProperties: _PdfDictionary): void {
        const defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
        if (defaultView && defaultView.has('Order')) {
            if (this._layerDictionary && this._layerDictionary.size > 0) {
                this._list.splice(0, this._list.length);
                this._layerDictionary.forEach((_layer: PdfLayer, _pdfReference: _PdfReference) => {
                    if (_layer instanceof PdfLayer && _pdfReference instanceof _PdfReference) {
                        if (!_layer._parent && this._list.indexOf(_layer) === -1) {
                            this._list.push(_layer);
                        } else if (_layer._child.length > 0) {
                            this._addChildLayer(_layer._parent);
                        } else if (_layer._parent && _layer._child.length === 0 && !_layer._parent.layers.contains(_layer)){
                            _layer._parent.layers._addNestedLayer(_layer);
                        }
                    }
                });
            }
        }
    }
    private _addChildLayer(layer: PdfLayer): void {
        for (let i: number = 0; i < layer._child.length; i++) {
            const child: PdfLayer = layer._child[Number.parseInt(i.toString(), 10)];
            if (layer.layers.indexOf(child) === -1) {
                layer.layers._addNestedLayer(child);
            }
        }
    }
    private _addNestedLayer(layer: PdfLayer): number {
        this._list.push(layer);
        const index: number = this._list.length - 1;
        layer._layer = layer;
        return index;
    }
    private _removeLayer(layer: PdfLayer, removeGraphicalContent: boolean): void {
        let _dictionary: _PdfDictionary;
        if (layer && this._document) {
            _dictionary = this._document._catalog._catalogDictionary;
            if (_dictionary && _dictionary.has('OCProperties')) {
                const ocProperties: _PdfDictionary = _dictionary.get('OCProperties') as _PdfDictionary;
                if (ocProperties) {
                    const ocGroup: _PdfReference[] = ocProperties.get('OCGs') as _PdfReference[];
                    if (ocGroup) {
                        this._removeOCG(layer, ocGroup);
                    }
                    if (ocProperties.has('D')) {
                        const defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
                        if (defaultView) {
                            let on: _PdfReference[];
                            let off: _PdfReference[];
                            if (defaultView.has('Order')) {
                                const order: (_PdfReference | _PdfReference[])[] = defaultView.get('Order') as (_PdfReference | _PdfReference[])[];
                                if (order) {
                                    const arrayList: (_PdfReference | _PdfReference[])[] = [];
                                    this._removeOrder(layer, order, arrayList);
                                }
                            }
                            if (defaultView.has('Locked')) {
                                const locked: _PdfReference[] = defaultView.get('Locked') as _PdfReference[];
                                if (locked) {
                                    this._removeLocked(layer, locked);
                                }
                            }
                            if (defaultView.has('OFF')) {
                                off = defaultView.get('OFF') as _PdfReference[];
                            }
                            if (defaultView.has('ON')) {
                                on = defaultView.get('ON') as _PdfReference[];
                            }
                            if (defaultView.has('AS')) {
                                const _usage: _PdfReference[] = defaultView.get('AS') as _PdfReference[];
                                if (_usage) {
                                    this._removeUsage(layer, _usage);
                                }
                            }
                            this._removeVisible(layer, on, off);
                        }
                        defaultView._updated = true;
                    }
                    const page: PdfPage = layer._layerPage;
                    if (page) {
                        const resource: _PdfDictionary = layer._layerPage._pageDictionary.get('Resources');
                        if (resource.has('Properties')) {
                            const properties: _PdfDictionary = resource.get('Properties');
                            if (properties && properties.has(layer._layerId)) {
                                delete properties._map[layer._layerId];
                            }
                        }
                    }
                    const chacheMap: Map<_PdfReference, any> = this._crossReference._cacheMap; // eslint-disable-line
                    if (chacheMap.has(layer._referenceHolder)) {
                        let dictionary: _PdfDictionary = this._crossReference._cacheMap.get(layer._referenceHolder);
                        if (dictionary) {
                            const usage: _PdfReference | _PdfDictionary = dictionary.getRaw('Usage');
                            if (usage instanceof _PdfReference) {
                                dictionary = this._crossReference._cacheMap.get(usage);
                                if (dictionary) {
                                    const printReference: _PdfReference = dictionary.getRaw('Print');
                                    chacheMap.delete(layer._referenceHolder);
                                    chacheMap.delete(usage);
                                    chacheMap.delete(printReference);
                                }
                            }
                        }
                    }
                    ocProperties._updated = true;
                    _dictionary._updated = true;
                }
                this._crossReference._allowCatalog = true;
            }
            if (removeGraphicalContent) {
                this._removeLayerContent(layer);
            }
        }
    }
    private _removeOCG(layer: PdfLayer, ocGroup: _PdfReference[]): void {
        if (ocGroup && ocGroup.indexOf(layer._referenceHolder) !== -1) {
            ocGroup.splice(ocGroup.indexOf(layer._referenceHolder), 1);
        }
    }
    private _removeUsage(layer: PdfLayer, _usage: _PdfReference[]): void {
        if (_usage) {
            let isRemoved: boolean = false;
            for (let i: number = 0; i < _usage.length; i++) {
                const usage: _PdfReference | _PdfDictionary = _usage[Number.parseInt(i.toString(), 10)];
                if (usage) {
                    let usageDictionary: _PdfDictionary;
                    if (usage instanceof _PdfReference) {
                        usageDictionary = this._crossReference._fetch(_usage[Number.parseInt(i.toString(), 10)]) as _PdfDictionary;
                    }
                    if (usage instanceof _PdfDictionary) {
                        usageDictionary = usage as _PdfDictionary;
                    }
                    if (usageDictionary) {
                        const usageOcGroup: _PdfReference[] = usageDictionary.get('OCGs') as _PdfReference[];
                        if (usageOcGroup) {
                            if (usageOcGroup.indexOf(layer._referenceHolder) !== -1) {
                                usageOcGroup.splice(usageOcGroup.indexOf(layer._referenceHolder), 1);
                                isRemoved = true;
                            }
                            if (isRemoved) {
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    private _removeOrder(
        layer: PdfLayer,
        order: (_PdfReference[] | _PdfReference)[],
        arrayList: (_PdfReference | _PdfReference[])[]
    ): void {
        let isRemoveOrder: boolean = false;
        if (order) {
            for (let i: number = 0; i < order.length; i++) {
                const entry: _PdfReference = order[Number.parseInt(i.toString(), 10)] as _PdfReference;
                if (entry && entry instanceof _PdfReference && entry === layer._referenceHolder) {
                    if (i !== order.length - 1) {
                        if (Array.isArray(order[Number.parseInt(i.toString(), 10) + 1])) {
                            order.splice(i, 2);
                            isRemoveOrder = true;
                            break;
                        } else {
                            order.splice(i, 1);
                            isRemoveOrder = true;
                            break;
                        }
                    } else {
                        order.splice(i, 1);
                        isRemoveOrder = true;
                        break;
                    }
                } else if (Array.isArray(entry)) {
                    arrayList.push(order[Number.parseInt(i.toString(), 10)]);
                }
            }
        }
        if (!isRemoveOrder && arrayList) {
            for (let i: number = 0; i < arrayList.length; i++) {
                order = arrayList[Number.parseInt(i.toString(), 10)] as [];
                arrayList.splice(i, 1);
                i -= 1;
                this._removeOrder(layer, order, arrayList);
            }
        }
    }
    private _removeVisible(layer: PdfLayer, on: _PdfReference[], off: _PdfReference[]): void {
        if (layer.visible) {
            if (on && on.indexOf(layer._referenceHolder) !== -1) {
                const index: number = on.indexOf(layer._referenceHolder);
                if (index > -1) {
                    on.splice(index, 1);
                }
            }
        } else {
            if (off && off.indexOf(layer._referenceHolder) !== -1) {
                const index: number = off.indexOf(layer._referenceHolder);
                if (index > -1) {
                    off.splice(index, 1);
                }
            }
        }
    }
    private _removeLocked(layer: PdfLayer, locked: _PdfReference[]): void {
        if (locked && locked.indexOf(layer._referenceHolder) !== -1) {
            locked.splice(locked.indexOf(layer._referenceHolder), 1);
        }
    }
    private _removeLayerContent(layer: PdfLayer): void {
        let isSkip: boolean = false;
        let _properties: _PdfDictionary;
        let _xObject: _PdfDictionary;
        if (layer._layerPage) {
            for (let i: number = 0; i < layer._pages.length; i++) {
                const _resource: _PdfDictionary = layer._pages[Number.parseInt(i.toString(), 10)]._pageDictionary.get('Resources') as _PdfDictionary;
                if (_resource) {
                    _properties = _resource.get('Properties') as _PdfDictionary;
                    _xObject = _resource.get('XObject') as _PdfDictionary;
                    if (_properties && layer._layerId.trim().length > 0 && _properties.has(layer._layerId)) {
                        delete _properties._map[layer._layerId];
                    }
                    if (_xObject && layer._xObject.length > 0) {
                        const map: any = _xObject._map; // eslint-disable-line
                        for (const key of map) {
                            if (layer._xObject.indexOf(map[String(key)]) !== -1) {
                                delete _xObject._map[String(key)];
                                break;
                            }
                        }
                        if (layer._xObject.indexOf(layer._layerId) !== -1) {
                            layer._xObject.splice(layer._xObject.indexOf(layer._layerId), 1);
                        }
                    }
                }
                const content: any[] = layer._pages[i]._pageDictionary.getArray('Contents'); // eslint-disable-line
                for (let m: number = 0; m < content.length; m++) {
                    const data: _PdfContentStream = new _PdfContentStream([]);
                    const stream: _PdfContentStream = content[Number.parseInt(m.toString(), 10)] as _PdfContentStream;
                    const objID: string = stream.dictionary.objId;
                    const bytes: Uint8Array = stream.getBytes();
                    let parser: _ContentParser;
                    if (stream instanceof _PdfContentStream) {
                        parser = new _ContentParser(stream._bytes);
                    } else {
                        parser = new _ContentParser(bytes);
                    }
                    const result: _PdfRecord[] = parser._readContent();
                    for (let j: number = 0; j < result.length; j++) {
                        const entry: _PdfRecord = result[Number.parseInt(j.toString(), 10)];
                        const _operator: string = entry._operator;
                        if (_operator === 'BMC' || _operator === 'EMC' || _operator === 'BDC') {
                            const operands: string[] = entry._operands;
                            this._processBeginMarkContent(layer, _operator, operands, data, objID);
                            isSkip = true;
                        }
                        if (_operator === 'Do' && layer._xObject.indexOf(entry._operands[0]) !== -1) {
                            isSkip = true;
                        }
                        if (
                            _operator === 'q' || _operator === 'Q' ||
                            _operator === 'w' || _operator === 'J' || _operator === 'j' ||
                            _operator === 'M' || _operator === 'd' || _operator === 'ri' ||
                            _operator === 'i' || _operator === 'gs' || _operator === 'g' ||
                            _operator === 'cm' || _operator === 'G' || _operator === 'rg' ||
                            _operator === 'RG' || _operator === 'k' || _operator === 'K' ||
                            _operator === 'cs' || _operator === 'CS' || _operator === 'scn' ||
                            _operator === 'SCN' || _operator === 'sc' || _operator === 'SC'
                        ) {
                            if (!isSkip) {
                                this._streamWrite(entry._operands, _operator, false, data);
                            }
                            isSkip = false;
                        } else {
                            if (!isSkip) {
                                this._streamWrite(entry._operands, _operator, true, data);
                            }
                            isSkip = false;
                        }
                    }
                    if (data.length > 0 && !objID) {
                        const _pages: PdfPage =  layer._pages[Number.parseInt(i.toString(), 10)];
                        const _reference: _PdfReference = _pages._contents[Number.parseInt(m.toString(), 10)];
                        const contentStream: _PdfContentStream = this._crossReference._fetch(_reference);
                        contentStream._bytes.length = 0;
                        contentStream.write(data.getString());
                    }
                }
                layer._pages[Number.parseInt(i.toString(), 10)]._pageDictionary._updated = true;
            }
        }
    }
    private _processBeginMarkContent(parser: PdfLayer, operator: string, operands: string[], data: _PdfContentStream, id?: string): void {
        if (operator === 'BDC') {
            let operand: string;
            if (operands.length > 1 && operands[0].substring(1) === 'OC') {
                operand = operands[1].substring(1);
            }
            if (this._bdcCount > 0) {
                this._bdcCount++;
                return;
            }
            if (operand && operand === parser._layerId) {
                this._bdcCount++;
                const refArray: _PdfReference[] = parser._pages[0]._pageDictionary.getRaw('Contents') as _PdfReference[];
                if (id) {
                    const strParts: string[] = id.split(' ');
                    const index: number = refArray.indexOf(_PdfReference.get(Number(strParts[0]), Number(strParts[1])));
                    parser._pages[0]._pageDictionary.getRaw('Contents').splice(index, 1);
                }
            }
        }
        this._streamWrite(operands, operator, true, data);
        if ('EMC' === operator && this._bdcCount > 0) {
            this._bdcCount--;
        }
    }
    private _streamWrite(operands: string[], operator: string, skip: boolean, data: _PdfContentStream): void {
        let pdfString: string;
        if (skip && this._isSkip) {
            return;
        }
        if (operands) {
            for (const operand of operands) {
                pdfString = operand as string;
                data.write(pdfString);
                data.write(' ');
            }
        }
        pdfString = operator;
        data.write(pdfString);
        data.write('\r\n');
    }
    private _insertLayer(index: number, layer: PdfLayer): void {
        const reference: _PdfReference = layer._referenceHolder;
        if (this._document) {
            const catalog: _PdfDictionary = this._document._catalog._catalogDictionary;
            if (catalog.has('OCProperties')) {
                const ocDictionary: _PdfDictionary = catalog.get('OCProperties') as _PdfDictionary;
                if (ocDictionary) {
                    const ocGroups: Array<_PdfReference> = ocDictionary.get('OCGs') as Array<_PdfReference>;
                    if (ocDictionary.has('D')) {
                        const defaultView: _PdfDictionary = ocDictionary.get('D') as _PdfDictionary;
                        if (defaultView) {
                            const order: (_PdfReference | _PdfReference[])[] = defaultView.get('Order') as (_PdfReference | _PdfReference[])[];
                            if (order && ocGroups && order.indexOf(reference) !== -1 && index < order.length) {
                                if (order[Number.parseInt(index.toString(), 10)] instanceof _PdfReference) {
                                    if (index + 1 < order.length && index + 2 < order.length) {
                                        const first: number = index + 1;
                                        const second: number = index + 2;
                                        if (order[Number.parseInt(first.toString(), 10)] instanceof _PdfReference
                                        && order[Number.parseInt(second.toString(), 10)] instanceof _PdfReference) {
                                            const position: number = order.indexOf(reference);
                                            order.splice(position, 1);
                                            order.splice(index, 0, reference);
                                            if (ocGroups.indexOf(reference) !== -1) {
                                                const position: number = ocGroups.indexOf(reference);
                                                ocGroups.splice(position, 1);
                                                ocGroups.splice(index, 0, reference);
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
    }
}
