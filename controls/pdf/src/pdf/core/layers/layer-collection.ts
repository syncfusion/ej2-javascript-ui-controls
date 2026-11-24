import { _PdfContentStream } from '../base-stream';
import { _ContentParser, _PdfRecord } from '../content-parser';
import { PdfPrintState } from '../enumerator';
import { _PdfCatalog } from '../pdf-catalog';
import { _PdfCrossReference } from '../pdf-cross-reference';
import { PdfDocument } from '../pdf-document';
import { PdfPage } from '../pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from '../pdf-primitives';
import { _getNewGuidString, _stringToPdfString } from '../utils';
import { PdfLayer } from './layer';
import { PdfLayerRadioGroup } from './layer-radio-group';
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
    /**
     * Whether this collection represents sub-layers.
     *
     * @private
     * @type {boolean}
     */
    _subLayer: boolean = false;
    /**
     * Internal flag indicating whether resources for layers are present.
     *
     * @private
     * @type {boolean}
     */
    private _isLayerContainsResource: boolean = false;
    /**
     * Document that owns this collection.
     *
     * @private
     * @type {PdfDocument}
     */
    _document: PdfDocument;
    /**
     * Parent layer when this collection represents sublayers.
     *
     * @private
     * @type {PdfLayer}
     */
    _parent: PdfLayer;
    /**
     * Map from reference to PdfLayer for quick lookup.
     *
     * @private
     * @type {Map<_PdfReference, PdfLayer>}
     */
    _layerDictionary: Map<_PdfReference, PdfLayer> = new Map();
    /**
     * Indicates whether the hierarchy contains name-based layer groups.
     *
     * @private
     * @type {boolean}
     */
    _groupsEnabled: boolean = false;
    _groupsModified: boolean = false;
    /**
     * Internal counter used when processing BDC/EMC markers.
     *
     * @private
     * @type {number}
     */
    private _bdcCount: number = 0;
    /**
     * Internal ordered list of layers.
     *
     * @private
     * @type {Array<PdfLayer | PdfLayerGroup>}
     */
    _list: (PdfLayer | PdfLayerGroup)[];
    /**
     * Cross-reference used for object resolution.
     *
     * @private
     * @type {_PdfCrossReference}
     */
    _crossReference: _PdfCrossReference;
    /**
     * Catalog associated with the document.
     *
     * @private
     * @type {_PdfCatalog}
     */
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
        } else if (!(this instanceof PdfLayerGroup)) {
            let _layerDictionary: _PdfDictionary;
            let _layerReference: _PdfReference;
            if (this._document && this._document._catalog && this._document._catalog._catalogDictionary
                && this._document._catalog._catalogDictionary.has('OCProperties')
            ) {
                const ocProperties: _PdfDictionary = this._document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
                if (ocProperties && ocProperties.has('OCGs')) {
                    const ocGroup: _PdfReference[] = ocProperties.get('OCGs') as _PdfReference[];
                    if (ocGroup && Array.isArray(ocGroup)) {
                        ocGroup.forEach((item: _PdfReference) => {
                            _layerReference = item;
                            if (_layerReference instanceof _PdfReference) {
                                _layerDictionary = this._crossReference._fetch(_layerReference) as _PdfDictionary;
                                const layer: PdfLayer = new PdfLayer();
                                if (_layerDictionary) {
                                    if (_layerDictionary.has('Name')) {
                                        const layerName: string = _layerDictionary.get('Name') as string;
                                        layer.name = layerName;
                                        layer._dictionary = _layerDictionary;
                                        layer._crossReference = this._document._crossReference;
                                        layer._document = document;
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
                        });
                    }
                    this._checkLayerLock(ocProperties);
                    this._checkLayerVisible(ocProperties);
                    this._checkParentLayer(ocProperties);
                    this._createLayerHierarchical(ocProperties);
                    this._loadGroups(ocProperties);
                }
            }
        }
    }
    /**
     * Gets the value indicating whether the skip state is active for the internal element.
     *
     * @private
     * @returns {boolean} True if the current BDC count is greater than zero; otherwise, false.
     */
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
     *
     * @param {number} index Layer index.
     * @returns {PdfLayer | PdfLayerGroup} Layer or layer group at the specified index.
     */
    public at(index: number): PdfLayer | PdfLayerGroup {
        return this._list[<number>index];
    }
    /**
     * Create a new `PdfLayer` with name
     * add it to the end of the collection.
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
     *
     * @param {string} name Name of the layer.
     * @returns {PdfLayer} Layer with the name specified.
     */
    public add(name: string): PdfLayer
    /**
     * Create a new `PdfLayer` with name and Boolean flag to set the visibility of layer
     * add it to the end of the collection.
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
     *
     * @param {string} name Name of the layer.
     * @param {boolean} visible Visibility of the layer.
     * @returns {PdfLayer} Layer with the name specified.
     */
    public add(name: string, visible: boolean): PdfLayer
    public add(name: string, visible?: boolean): PdfLayer {
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
     * Adds a new name-based `PdfLayerGroup` to the collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a new layer group named 'Group1'
     * let group: PdfLayerGroup = layers.addGroup('Group1');
     * // Add a layer inside the group
     * group.add('Layer1');
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {string} name Display name of the group.
     * @returns {PdfLayerGroup} The created layer group.
     */
    public addGroup(name: string): PdfLayerGroup {
        if (typeof name !== 'string') {
            throw new Error('Group name must be a string');
        }
        const group: PdfLayerGroup = new PdfLayerGroup(this._document, name, this);
        this._list.push(group);
        const root: PdfLayerCollection = this._root();
        root._groupsEnabled = true;
        root._groupsModified = true;
        this._syncOrder();
        return group;
    }
    /**
     * Boolean indicating whether the specified layer exists or not.
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
     *
     * @param {PdfLayer} layer The layer to be checked.
     * @returns {boolean} Returns true, if the layer exists. Otherwise, false
     */
    public contains(layer: PdfLayer): boolean
    /**
     * Boolean indicating whether the specified layer name exists or not.
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
     *
     * @param {string} name The layer name to be checked.
     * @returns {boolean} Returns true, if the layer exists. Otherwise, false
     */
    public contains(name: string): boolean
    public contains(arg: PdfLayer | string): boolean {
        if (!arg) {
            throw new Error('Layer cannot be null or undefined');
        }
        if (typeof arg === 'string') {
            return this._list.some((item: PdfLayer | PdfLayerGroup) => item instanceof PdfLayer && item.name === arg);
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
     *
     * @returns {void} Returns nothing.
     */
    public clear(): void {
        for (let i: number = this._list.length - 1; i > -1; i--) {
            const item: PdfLayer | PdfLayerGroup = this._list[<number>i];
            if (item instanceof PdfLayerGroup) {
                this._removeGroupContent(item, true);
            } else {
                this._removeLayer(item, true);
            }
        }
        this._list.length = 0;
        const root: PdfLayerCollection = this._root();
        if (root._groupsEnabled) {
            root._groupsModified = true;
        }
        this._syncOrder();
    }
    /**
     * Index of the specified layer.
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
     *
     * @param {PdfLayer | PdfLayerGroup} layer The layer or layer group to be checked.
     * @returns {number} Index of the layer or layer group; otherwise, -1 if not found.
     */
    public indexOf(layer: PdfLayer | PdfLayerGroup): number {
        if (!layer) {
            throw new Error('Layer cannot be null or undefined');
        }
        return this._list.indexOf(layer);
    }
    /**
     * Move the `PdfLayer` into the collection at specified index.
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
     *
     * @param {number} index Index of the layer.
     * @param {PdfLayer | PdfLayerGroup} layer Layer or layer group to move.
     * @returns {void} Returns nothing.
     */
    public move(index: number, layer: PdfLayer | PdfLayerGroup): void {
        if (index < 0 || index >= this._list.length) {
            throw new Error('Index cannot be less than 0 or greater than array length');
        }
        if (!layer) {
            throw new Error('Layer cannot be null or undefined');
        }
        let position: number;
        for (let i: number = 0; i < this._list.length; i++) {
            if (this._list[<number>i] === layer) {
                position = this.indexOf(this._list[<number>i]);
                break;
            }
        }
        if (position !== null && typeof position !== 'undefined' && position !== index) {
            this._list.splice(position, 1);
            this._list.splice(index, 0, layer);
            const root: PdfLayerCollection = this._root();
            if (root._groupsEnabled) {
                root._groupsModified = true;
                this._syncOrder();
            } else if (layer instanceof PdfLayer) {
                this._insertLayer(index, layer);
            }
        }
    }
    /**
     * Remove the `PdfLayer` at the specified index from the collection.
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
     *
     * @param {number} index The index of the layer to be removed.
     * @returns {void} Returns nothing.
     */
    public removeAt(index: number): void
    /**
     * Remove the `PdfLayer` at the specified index from the collection.
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
     *
     * @param {number} index The index of the layer to be removed.
     * @param {boolean} removeGraphicalContent Remove graphical content, if true.
     * @returns {void} Returns nothing.
     */
    public removeAt(index: number, removeGraphicalContent: boolean): void
    public removeAt(arg1: number, arg2?: boolean): void {
        if (arg1 < 0 || arg1 >= this._list.length) {
            throw new Error('Index cannot be less than 0 or greater than array length');
        }
        const item: PdfLayer | PdfLayerGroup = this._list[<number>arg1];
        this._list.splice(arg1, 1);
        const root: PdfLayerCollection = this._root();
        if (root._groupsEnabled) {
            root._groupsModified = true;
        }
        if (item instanceof PdfLayerGroup) {
            this._removeGroupContent(item, arg2 || false);
            this._syncOrder();
            return;
        }
        const layer: PdfLayer = item;
        if (layer) {
            this._removeLayer(layer, arg2 || false);
            if (layer._child.length > 0) {
                for (const child of layer._child) {
                    this._removeLayer(child, false);
                    const index: number = this._list.indexOf(child);
                    if (index !== -1) {
                        this._list.splice(index, 1);
                    }
                }
            }
            this._syncOrder();
        }
    }
    /**
     * Remove the `PdfLayer` with layer instance from the collection.
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
     *
     * @param {PdfLayer} layer Layer to remove.
     * @returns {void} Returns nothing.
     */
    public remove(layer: PdfLayer): void
    /**
     * Remove the `PdfLayer` with layer instance from the collection.
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
     *
     * @param {PdfLayer} layer Layer to remove.
     * @param {boolean} removeGraphicalContent Remove graphical content, if true.
     * @returns {void} Returns nothing.
     */
    public remove(layer: PdfLayer, removeGraphicalContent: boolean): void
    /**
     * Remove the `PdfLayer` at the layer name from the collection.
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
     *
     * @param {string} name Layer name to remove.
     * @returns {void} Returns nothing.
     */
    public remove(name: string): void
    /**
     * Remove the `PdfLayer` at the layer name from the collection.
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
     *
     * @param {string} name Layer name to remove.
     * @param {boolean} removeGraphicalContent Remove graphical content, if true.
     * @returns {void} Returns nothing.
     */
    public remove(name: string, removeGraphicalContent: boolean): void
    /**
     * Remove the `PdfLayerGroup` and its descendants from the collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Add a group and remove it
     * let group: PdfLayerGroup = layers.addGroup('Group1');
     * layers.remove(group, true);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfLayerGroup} group Group to remove.
     * @param {boolean} removeGraphicalContent Whether to remove graphical content of descendant layers.
     * @returns {void} Returns nothing.
     */
    public remove(group: PdfLayerGroup, removeGraphicalContent?: boolean): void
    public remove(arg1: PdfLayer | PdfLayerGroup | string, arg2?: boolean): void {
        if (arg1 instanceof PdfLayerGroup) {
            const groupIndex: number = this._list.indexOf(arg1);
            if (groupIndex !== -1) {
                this.removeAt(groupIndex, arg2 || false);
            }
        } else if (arg1 instanceof PdfLayer) {
            const layer: PdfLayer = arg1;
            const index: number = this._list.indexOf(layer);
            if (index !== -1) {
                this.removeAt(index, arg2 || false);
            }
        } else if (typeof arg1 === 'string') {
            for (let i: number = 0; i < this._list.length; i++) {
                const layer: PdfLayer = this._list[<number>i] as PdfLayer;
                const index: number = this._list.indexOf(layer);
                if (layer instanceof PdfLayer && layer.name === arg1 && index !== -1) {
                    this.removeAt(index, arg2 || false);
                    i = i - 1;
                }
            }
        }
    }
    /**
     * Reads print state from a dictionary and applies it to the layer.
     *
     * @private
     * @param {_PdfDictionary} printOption The print option dictionary.
     * @param {PdfLayer} layer The target layer.
     * @returns {void} nothing.
     */
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
    /**
     * Adds a layer to the internal list and creates backend objects if required.
     *
     * @private
     * @param {PdfLayer} layer The layer to add.
     * @returns {number} The index of the added layer.
     */
    private _addLayer(layer: PdfLayer): number {
        this._list.push(layer);
        const index: number = this._list.length - 1;
        if (this._document instanceof PdfDocument) {
            this._createLayer(layer);
        }
        layer._layer = layer;
        const root: PdfLayerCollection = this._root();
        if (root._groupsEnabled) {
            root._groupsModified = true;
        }
        this._syncOrder();
        return index;
    }
    /**
     * Creates PDF objects for a layer and updates document OCProperties.
     *
     * @private
     * @param {PdfLayer} layer The layer to create.
     * @returns {void} nothing.
     */
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
                            _usage.forEach((item: _PdfReference) => {
                                let usageDictionary: _PdfDictionary;
                                const value: _PdfReference = item as _PdfReference;
                                if (value instanceof _PdfReference) {
                                    usageDictionary = this._crossReference._fetch(value) as _PdfDictionary;
                                    if (usageDictionary && usageDictionary instanceof _PdfDictionary) {
                                        const usageOcGroup: _PdfReference[] = usageDictionary.get('OCGs') as _PdfReference[];
                                        if (usageOcGroup && ocGroups && usageOcGroup.indexOf(layer._referenceHolder) === -1) {
                                            usageOcGroup.push(layer._referenceHolder);
                                        }
                                    }
                                }
                            });
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
    /**
     * Creates the optional content dictionary entries for a layer.
     *
     * @private
     * @param {PdfLayer} layer The layer to create the dictionary for.
     * @returns {Array<_PdfReference>} Array of references added.
     */
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
    /**
     * Builds the optional content views dictionary for the document.
     *
     * @private
     * @returns {_PdfDictionary} The created views dictionary.
     */
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
    /**
     * Creates and links print option dictionaries for the specified layer.
     *
     * @private
     * @param {PdfLayer} layer The layer to create print options for.
     * @returns {_PdfReference} Reference to the created usage dictionary.
     */
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
    /**
     * Registers a sublayer and updates document ordering structures.
     *
     * @private
     * @param {_PdfDictionary} ocProperties The OCProperties dictionary.
     * @param {_PdfReference} reference The reference for the layer.
     * @param {PdfLayer} layer The layer instance.
     * @returns {void} nothing.
     */
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
                            if (Array.isArray(document._order[<number>i])) {
                                const value: any = document._order[<number>i]; // eslint-disable-line
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
                (this._parent._parentLayer as Array<PdfLayer>).forEach((element: PdfLayer) => {
                    if (layer._parentLayer.indexOf(element) === -1) {
                        layer._parentLayer.push(element);
                    }
                });
                if (layer._parentLayer.indexOf(this._parent) === -1) {
                    layer._parentLayer.push(this._parent);
                }
            }
        }
    }
    /**
     * Applies locked state to layers based on OCProperties.
     *
     * @private
     * @param {_PdfDictionary} ocProperties The OCProperties dictionary.
     * @returns {void} nothing.
     */
    private _checkLayerLock(ocProperties: _PdfDictionary): void {
        let locked: _PdfReference[];
        const defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
        if (defaultView && defaultView.has('Locked')) {
            locked = defaultView.get('Locked') as _PdfReference[];
        }
        if (locked) {
            locked.forEach((referenceHolder: _PdfReference) => {
                if (referenceHolder && referenceHolder instanceof _PdfReference) {
                    const pdfLayer: PdfLayer = this._layerDictionary.get(referenceHolder) as PdfLayer;
                    if (pdfLayer) {
                        pdfLayer.locked = true;
                    }
                }
            });
        }
    }
    /**
     * Updates visibility of layers based on OCProperties 'OFF' list.
     *
     * @private
     * @param {_PdfDictionary} ocProperties The OCProperties dictionary.
     * @returns {void} nothing.
     */
    private _checkLayerVisible(ocProperties: _PdfDictionary): void {
        const _document: PdfDocument = this._document;
        let visible: _PdfReference[];
        if (_document._catalog && _document._catalog._catalogDictionary.has('OCProperties')) {
            const defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
            if (defaultView && defaultView.has('OFF')) {
                visible = defaultView.get('OFF') as _PdfReference[];
            }
            if (visible) {
                visible.forEach((visibleReference: _PdfReference) => {
                    if (visibleReference instanceof _PdfReference) {
                        const layerDictionary: Map<_PdfReference, PdfLayer> = this._layerDictionary;
                        if (layerDictionary && layerDictionary.size > 0 && visibleReference && layerDictionary.has(visibleReference)) {
                            const pdfLayer: PdfLayer = layerDictionary.get(visibleReference) as PdfLayer;
                            if (pdfLayer && pdfLayer._visible) {
                                pdfLayer._visible = false;
                                if (pdfLayer._dictionary) {
                                    pdfLayer._dictionary.set('Visible', false);
                                }
                            }
                        }
                    }
                });
            }
        }
    }
    /**
     * Parses parent/child relationships for layers from OCProperties.
     *
     * @private
     * @param {_PdfDictionary} ocProperties The OCProperties dictionary.
     * @returns {void} nothing.
     */
    private _checkParentLayer(ocProperties: _PdfDictionary): void {
        const defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
        if (defaultView) {
            const array: (_PdfReference | _PdfReference[])[] = defaultView.get('Order');
            if (array) {
                this._parsingLayerOrder(null, array, this._layerDictionary);
            }
        }
    }
    /**
     * Recursively parses a layer order array to build parent-child relationships.
     *
     * @private
     * @param {PdfLayer} parent The parent layer in recursion.
     * @param {(_PdfReference | _PdfReference[])[]} array The order array.
     * @param {Map<_PdfReference, PdfLayer>} layerDictionary Map of references to layers.
     * @returns {void} nothing.
     */
    private _parsingLayerOrder(
        parent: PdfLayer,
        array: (_PdfReference | _PdfReference[])[],
        layerDictionary: Map<_PdfReference, PdfLayer>
    ): void {
        let reference: _PdfReference;
        let layer: PdfLayer;
        for (let i: number = 0; i < array.length; i++) {
            reference = array[<number>i] as _PdfReference;
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
                            parent._parentLayer.forEach((parentLayerElement: PdfLayer) => {
                                if (layer._parentLayer.indexOf(parentLayerElement) === -1) {
                                    if (!(parentLayerElement instanceof PdfLayer) && parentLayerElement) {
                                        layer._parentLayer.push(parentLayerElement);
                                    }
                                }
                            });
                            layer._parentLayer.push(parent);
                            layer._parent = parent;
                        }
                    }
                    const next: any = array[i + 1]; // eslint-disable-line
                    // A following array that starts with a title string and has children is a labeled group, not a sub-layer list.
                    if (Array.isArray(next) && !(next.length > 1 && typeof next[0] === 'string')) {
                        i++;
                        const pdfArray: any = array[i] as any; // eslint-disable-line
                        layer._subLayer = pdfArray as (_PdfReference | _PdfReference[])[];
                        this._parsingLayerOrder(layer, pdfArray, layerDictionary);
                    }
                }
            } else if (Array.isArray(array[<number>i])) {
                const value: any = array[<number>i]; // eslint-disable-line
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
    /**
     * Returns the root (document-level) collection that owns this collection.
     *
     * @private
     * @returns {PdfLayerCollection} Root collection.
     */
    _root(): PdfLayerCollection {
        if (this instanceof PdfLayerGroup && this._parentCollection) {
            return this._parentCollection._root();
        }
        if (this._parent && this._document) {
            return this._document.layers;
        }
        return this;
    }
    /**
     * Writes the current hierarchy to `/Order` when groups are in use.
     *
     * @private
     * @returns {void} nothing.
     */
    _syncOrder(): void {
        const root: PdfLayerCollection = this._root();
        if (root._groupsEnabled && root._groupsModified) {
            root._writeOrder();
        }
    }
    /**
     * Serializes the layer hierarchy into the default configuration `/Order` array.
     *
     * @private
     * @returns {void} nothing.
     */
    _writeOrder(): void {
        if (!this._document || !this._document._catalog) {
            return;
        }
        const catalog: _PdfDictionary = this._document._catalog._catalogDictionary;
        const ocProperties: _PdfDictionary = catalog.has('OCProperties') ? catalog.get('OCProperties') as _PdfDictionary : undefined;
        if (!(ocProperties instanceof _PdfDictionary)) {
            return;
        }
        const defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
        if (!(defaultView instanceof _PdfDictionary)) {
            return;
        }
        const next: any[] = []; // eslint-disable-line
        this._appendOrder(this, next, 0);
        const existing: any = defaultView.get('Order'); // eslint-disable-line
        if (Array.isArray(existing)) {
            existing.splice(0, existing.length);
            for (let i: number = 0; i < next.length; i++) {
                existing.push(next[<number>i]);
            }
            this._document._order = existing;
        } else {
            defaultView.update('Order', next);
            this._document._order = next;
        }
        defaultView._updated = true;
        ocProperties._updated = true;
        catalog._updated = true;
        this._crossReference._allowCatalog = true;
    }
    /**
     * Appends the entries of a collection to an `/Order` array.
     *
     * @private
     * @param {PdfLayerCollection} collection Collection to traverse.
     * @param {any[]} out Output array.
     * @param {number} depth Current depth.
     * @returns {void} nothing.
     */
    private _appendOrder(collection: PdfLayerCollection, out: any[], depth: number): void { // eslint-disable-line
        for (let i: number = 0; i < collection._list.length; i++) {
            const item: PdfLayer | PdfLayerGroup = collection._list[<number>i];
            if (item instanceof PdfLayerGroup) {
                if (depth < 1000) {
                    const labeled: any[] = [item.name]; // eslint-disable-line
                    this._appendOrder(item, labeled, depth + 1);
                    out.push(labeled);
                }
            } else if (item && item._referenceHolder) {
                out.push(item._referenceHolder);
                if (item._subLayer && item._subLayer.length > 0) {
                    out.push(item._subLayer);
                }
            }
        }
    }
    /**
     * Determines whether an `/Order` array contains title strings.
     *
     * @private
     * @param {any[]} order Order array.
     * @param {number} depth Current depth.
     * @param {any[]} visiting Arrays being visited.
     * @returns {boolean} True if a title is present.
     */
    private _containsTitle(order: any[], depth: number, visiting: any[]): boolean { // eslint-disable-line
        if (visiting.indexOf(order) !== -1 || depth > 1000) {
            return false;
        }
        visiting.push(order);
        let result: boolean = false;
        for (let i: number = 0; i < order.length && !result; i++) {
            const entry: any = this._resolveEntry(order[<number>i]); // eslint-disable-line
            if (typeof entry === 'string') {
                result = true;
            } else if (Array.isArray(entry)) {
                result = this._containsTitle(entry, depth + 1, visiting);
            }
        }
        visiting.pop();
        return result;
    }
    /**
     * Resolves a non-layer reference to its object.
     *
     * @private
     * @param {any} entry Entry.
     * @returns {any} Resolved value.
     */
    private _resolveEntry(entry: any): any { // eslint-disable-line
        if (entry instanceof _PdfReference && !this._layerDictionary.has(entry)) {
            try {
                return this._crossReference._fetch(entry);
            } catch (e) {
                return undefined;
            }
        }
        return entry;
    }
    /**
     * Loads name-based groups from the `/Order` array.
     *
     * @private
     * @param {_PdfDictionary} ocProperties The OCProperties dictionary.
     * @returns {void} nothing.
     */
    private _loadGroups(ocProperties: _PdfDictionary): void {
        const defaultView: _PdfDictionary = ocProperties.get('D') as _PdfDictionary;
        if (!(defaultView instanceof _PdfDictionary)) {
            return;
        }
        const order: any = defaultView.get('Order'); // eslint-disable-line
        if (!Array.isArray(order) || !this._containsTitle(order, 0, [])) {
            return;
        }
        const used: Map<PdfLayer, boolean> = new Map<PdfLayer, boolean>();
        const rootList: (PdfLayer | PdfLayerGroup)[] = [];
        this._buildGroupList(order, this, rootList, used, 0, []);
        for (let i: number = 0; i < this._list.length; i++) {
            const item: PdfLayer | PdfLayerGroup = this._list[<number>i];
            if (item instanceof PdfLayer && !used.has(item)) {
                rootList.push(item);
            }
        }
        this._list.length = 0;
        for (let i: number = 0; i < rootList.length; i++) {
            this._list.push(rootList[<number>i]);
        }
        this._groupsEnabled = true;
    }
    /**
     * Builds layers and groups from an `/Order` array.
     *
     * @private
     * @param {any[]} order Order array.
     * @param {PdfLayerCollection} owner Collection that owns the entries.
     * @param {Array<PdfLayer | PdfLayerGroup>} target Target list.
     * @param {Map<PdfLayer, boolean>} used Layers already placed.
     * @param {number} depth Current depth.
     * @param {any[]} visiting Arrays being visited.
     * @returns {void} nothing.
     */
    private _buildGroupList(
        order: any[], // eslint-disable-line
        owner: PdfLayerCollection,
        target: (PdfLayer | PdfLayerGroup)[],
        used: Map<PdfLayer, boolean>,
        depth: number,
        visiting: any[] // eslint-disable-line
    ): void {
        if (visiting.indexOf(order) !== -1 || depth > 1000) {
            return;
        }
        visiting.push(order);
        for (let i: number = 0; i < order.length; i++) {
            const entry: any = order[<number>i]; // eslint-disable-line
            const layer: PdfLayer = entry instanceof _PdfReference ? this._layerDictionary.get(entry) : undefined;
            if (layer) {
                if (!layer._parent && !used.has(layer)) {
                    used.set(layer, true);
                    target.push(layer);
                }
                const following: any = this._resolveEntry(order[i + 1]); // eslint-disable-line
                if (Array.isArray(following) && !(following.length > 0 && typeof this._resolveEntry(following[0]) === 'string')) {
                    i++;
                }
                continue;
            }
            const value: any = this._resolveEntry(entry); // eslint-disable-line
            if (typeof value === 'string') {
                const group: PdfLayerGroup = new PdfLayerGroup(this._document, _stringToPdfString(value), owner);
                target.push(group);
                const children: any = this._resolveEntry(order[i + 1]); // eslint-disable-line
                if (Array.isArray(children)) {
                    i++;
                    this._buildGroupList(children, group, group._list, used, depth + 1, visiting);
                }
            } else if (Array.isArray(value)) {
                const title: any = value.length > 0 ? this._resolveEntry(value[0]) : undefined; // eslint-disable-line
                if (typeof title === 'string') {
                    // ISO 32000-1 8.11.4.3: a sub-array whose first element is a text string is a labeled group.
                    const labeled: PdfLayerGroup = new PdfLayerGroup(this._document, _stringToPdfString(title), owner);
                    target.push(labeled);
                    this._buildGroupList(value.slice(1), labeled, labeled._list, used, depth + 1, visiting);
                } else {
                    this._buildGroupList(value, owner, target, used, depth + 1, visiting);
                }
            }
        }
        visiting.pop();
    }
    /**
     * Removes all descendants of a group from the document.
     *
     * @private
     * @param {PdfLayerGroup} group Group to remove.
     * @param {boolean} removeGraphicalContent Whether to remove graphical content.
     * @returns {void} nothing.
     */
    _removeGroupContent(group: PdfLayerGroup, removeGraphicalContent: boolean): void {
        for (let i: number = group._list.length - 1; i > -1; i--) {
            const item: PdfLayer | PdfLayerGroup = group._list[<number>i];
            if (item instanceof PdfLayerGroup) {
                this._removeGroupContent(item, removeGraphicalContent);
            } else {
                this._removeLayer(item, removeGraphicalContent);
            }
        }
        group._list.length = 0;
    }
    /**
     * Reorders internal list to reflect hierarchical layer order from OCProperties.
     *
     * @private
     * @param {_PdfDictionary} ocProperties The OCProperties dictionary.
     * @returns {void} nothing.
     */
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
    /**
     * Adds child layers of a parent into the parent's `layers` collection.
     *
     * @private
     * @param {PdfLayer} layer Parent layer whose children will be added.
     * @returns {void} nothing.
     */
    private _addChildLayer(layer: PdfLayer): void {
        layer._child.forEach((child: PdfLayer) => {
            if (layer.layers.indexOf(child) === -1) {
                layer.layers._addNestedLayer(child);
            }
        });
    }
    /**
     * Adds a nested layer into the internal list without creating resources.
     *
     * @private
     * @param {PdfLayer} layer The nested layer to add.
     * @returns {number} The index of the added nested layer.
     */
    private _addNestedLayer(layer: PdfLayer): number {
        this._list.push(layer);
        const index: number = this._list.length - 1;
        layer._layer = layer;
        return index;
    }
    /**
     * Removes a layer and associated metadata from the document catalog.
     *
     * @private
     * @param {PdfLayer} layer The layer to remove.
     * @param {boolean} removeGraphicalContent Whether to remove graphical content.
     * @returns {void} nothing.
     */
    private _removeLayer(layer: PdfLayer, removeGraphicalContent: boolean): void {
        let _dictionary: _PdfDictionary;
        if (layer && this._document) {
            if (this._document._layerRadioGroupsInstance) {
                this._document._layerRadioGroupsInstance._removeLayer(layer);
            }
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
    /**
     * Removes a layer reference from the OCG group array.
     *
     * @private
     * @param {PdfLayer} layer The layer to remove.
     * @param {_PdfReference[]} ocGroup The OCG reference array.
     * @returns {void} nothing.
     */
    private _removeOCG(layer: PdfLayer, ocGroup: _PdfReference[]): void {
        if (ocGroup && ocGroup.indexOf(layer._referenceHolder) !== -1) {
            ocGroup.splice(ocGroup.indexOf(layer._referenceHolder), 1);
        }
    }
    /**
     * Removes usage references for a layer from usage dictionaries.
     *
     * @private
     * @param {PdfLayer} layer The target layer.
     * @param {_PdfReference[]} _usage Array of usage references.
     * @returns {void} nothing.
     */
    private _removeUsage(layer: PdfLayer, _usage: _PdfReference[]): void {
        if (_usage) {
            let isRemoved: boolean = false;
            for (let i: number = 0; i < _usage.length; i++) {
                const usage: _PdfReference | _PdfDictionary = _usage[<number>i];
                if (usage) {
                    let usageDictionary: _PdfDictionary;
                    if (usage instanceof _PdfReference) {
                        usageDictionary = this._crossReference._fetch(_usage[<number>i]) as _PdfDictionary;
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
    /**
     * Removes references to a layer from order arrays recursively.
     *
     * @private
     * @param {PdfLayer} layer The layer to remove.
     * @param {(_PdfReference[] | _PdfReference)[]} order The order array to update.
     * @param {(_PdfReference | _PdfReference[])[]} arrayList Helper array used during recursion.
     * @returns {void} nothing.
     */
    private _removeOrder(
        layer: PdfLayer,
        order: (_PdfReference[] | _PdfReference)[],
        arrayList: (_PdfReference | _PdfReference[])[]
    ): void {
        let isRemoveOrder: boolean = false;
        if (order) {
            for (let i: number = 0; i < order.length; i++) {
                const entry: _PdfReference = order[<number>i] as _PdfReference;
                if (entry && entry instanceof _PdfReference && entry === layer._referenceHolder) {
                    if (i !== order.length - 1) {
                        if (Array.isArray(order[<number>i + 1])) {
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
                    arrayList.push(order[<number>i]);
                }
            }
        }
        if (!isRemoveOrder && arrayList) {
            for (let i: number = 0; i < arrayList.length; i++) {
                order = arrayList[<number>i] as [];
                arrayList.splice(i, 1);
                i -= 1;
                this._removeOrder(layer, order, arrayList);
            }
        }
    }
    /**
     * Removes layer reference from ON/OFF visibility arrays.
     *
     * @private
     * @param {PdfLayer} layer The layer to remove.
     * @param {_PdfReference[]} on ON references array.
     * @param {_PdfReference[]} off OFF references array.
     * @returns {void} nothing.
     */
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
    /**
     * Removes layer reference from locked array.
     *
     * @private
     * @param {PdfLayer} layer The layer to remove.
     * @param {_PdfReference[]} locked Locked references array.
     * @returns {void} nothing.
     */
    private _removeLocked(layer: PdfLayer, locked: _PdfReference[]): void {
        if (locked && locked.indexOf(layer._referenceHolder) !== -1) {
            locked.splice(locked.indexOf(layer._referenceHolder), 1);
        }
    }
    /**
     * Removes graphical content associated with a layer from pages.
     *
     * @private
     * @param {PdfLayer} layer The layer whose content should be removed.
     * @returns {void} nothing.
     */
    private _removeLayerContent(layer: PdfLayer): void {
        let isSkip: boolean = false;
        let _properties: _PdfDictionary;
        let _xObject: _PdfDictionary;
        if (layer._layerPage) {
            for (let i: number = 0; i < layer._pages.length; i++) {
                const _resource: _PdfDictionary = layer._pages[<number>i]._pageDictionary.get('Resources') as _PdfDictionary;
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
                    const stream: _PdfContentStream = content[<number>m] as _PdfContentStream;
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
                        const entry: _PdfRecord = result[<number>j];
                        const _operator: string = entry._operator;
                        if (_operator === 'BMC' || _operator === 'EMC' || _operator === 'BDC') {
                            const operands: string[] = entry._operands;
                            this._processBeginMarkContent(layer, _operator, operands, data, objID);
                            isSkip = true;
                        }
                        let skipCurrentOperator: boolean = false;
                        if (_operator === 'Do' && '/' + layer._layerId === entry._operands[0]) {
                            skipCurrentOperator = true;
                        }
                        if (skipCurrentOperator) {
                            continue;
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
                    if (data.length > 0) {
                        const pages: PdfPage =  layer._pages[<number>i];
                        const refArray: _PdfReference[] = pages._pageDictionary.getRaw('Contents');
                        const ref: _PdfReference = refArray[<number>m];
                        this._crossReference._cacheMap.set(ref, data);
                        pages._pageDictionary._updated = true;
                    }
                }
                layer._pages[<number>i]._pageDictionary._updated = true;
            }
        }
    }
    /**
     * Processes begin marked content operators and filters out layer content.
     *
     * @private
     * @param {PdfLayer} parser The parser/layer instance.
     * @param {string} operator The content operator.
     * @param {string[]} operands Operator operands.
     * @param {_PdfContentStream} data Output content stream.
     * @param {string} [id] Optional object id string.
     * @returns {void} nothing.
     */
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
    /**
     * Writes an operator and its operands into a content stream, optionally skipping.
     *
     * @private
     * @param {string[]} operands The operands to write.
     * @param {string} operator The operator to write.
     * @param {boolean} skip Whether writing should be skipped based on state.
     * @param {_PdfContentStream} data The target content stream.
     * @returns {void} nothing.
     */
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
    /**
     * Flattens all optional content: keeps visible layer content as normal page content,
     * drops hidden layer content and removes the optional-content metadata.
     * Effective visibility (`PdfLayer.visible`, including locked and radio-group state) is evaluated at call time.
     *
     * @private
     * @returns {void} nothing.
     */
    _flattenAll(): void {
        if (!this._groupsEnabled) {
            return;
        }
        if (!this._groupsModified) {
            let hasCreatedLayer: boolean = false;
            this._layerDictionary.forEach((layer: PdfLayer) => {
                if (layer._dictionary && layer._dictionary.has('LayerID')) {
                    hasCreatedLayer = true;
                }
            });
            if (!hasCreatedLayer) {
                return;
            }
        }
        const document: PdfDocument = this._document;
        const catalog: _PdfDictionary = document._catalog._catalogDictionary;
        const layers: PdfLayer[] = [];
        const collect: Function = (collection: PdfLayerCollection): void => {
            collection._list.forEach((item: PdfLayer | PdfLayerGroup) => {
                if (item instanceof PdfLayerGroup) {
                    collect(item);
                } else if (layers.indexOf(item) === -1) {
                    layers.push(item);
                }
            });
        };
        collect(this);
        this._layerDictionary.forEach((layer: PdfLayer) => {
            if (layers.indexOf(layer) === -1) {
                layers.push(layer);
            }
        });
        const byRef: Map<string, PdfLayer> = new Map();
        const byId: Map<string, PdfLayer> = new Map();
        layers.forEach((layer: PdfLayer) => {
            if (layer._referenceHolder) {
                byRef.set(layer._referenceHolder.toString(), layer);
            }
            if (layer._layerId) {
                byId.set(layer._layerId, layer);
            }
        });
        for (let p: number = 0; p < document.pageCount; p++) {
            const page: PdfPage = document.getPage(p);
            const pageDictionary: _PdfDictionary = page._pageDictionary;
            const resources: _PdfDictionary = pageDictionary.get('Resources') as _PdfDictionary;
            const properties: _PdfDictionary = resources instanceof _PdfDictionary ? resources.get('Properties') as _PdfDictionary : undefined;
            const hidden: string[] = [];
            const visible: string[] = [];
            if (properties instanceof _PdfDictionary) {
                Object.keys(properties._map).forEach((key: string) => {
                    const raw: any = properties.getRaw(key); // eslint-disable-line
                    let layer: PdfLayer = raw instanceof _PdfReference ? byRef.get(raw.toString()) : undefined;
                    if (!layer) {
                        layer = byId.get(key);
                    }
                    if (layer) {
                        (layer.visible ? visible : hidden).push(key);
                    }
                });
            }
            if (hidden.length > 0 || visible.length > 0) {
                this._flattenPageContent(pageDictionary, hidden, visible);
                hidden.concat(visible).forEach((key: string) => {
                    delete properties._map[<string>key];
                });
                properties._updated = true;
                if (Object.keys(properties._map).length === 0) {
                    delete resources._map.Properties;
                }
                resources._updated = true;
                pageDictionary._updated = true;
            }
        }
        if (catalog.has('OCProperties')) {
            delete catalog._map.OCProperties;
            catalog._updated = true;
            this._crossReference._allowCatalog = true;
        }
        document._order = [];
        this._list = [];
        this._layerDictionary.clear();
        if (document._layerRadioGroupsInstance) {
            document._layerRadioGroupsInstance._groups.forEach((group: PdfLayerRadioGroup) => {
                group._layers.forEach((layer: PdfLayer) => {
                    layer._radioGroups = [];
                });
                group._layers = [];
            });
            document._layerRadioGroupsInstance._groups = [];
        }
    }
    /**
     * Rewrites the content streams of a page, unwrapping visible layer content and dropping hidden layer content.
     *
     * @private
     * @param {_PdfDictionary} pageDictionary The page dictionary.
     * @param {string[]} hidden Resource names of hidden layers.
     * @param {string[]} visible Resource names of visible layers.
     * @returns {void} nothing.
     */
    private _flattenPageContent(pageDictionary: _PdfDictionary, hidden: string[], visible: string[]): void {
        let content: any = pageDictionary.getArray('Contents'); // eslint-disable-line
        let raw: any = pageDictionary.getRaw('Contents'); // eslint-disable-line
        if (!Array.isArray(content)) {
            content = content ? [content] : [];
            raw = [raw];
        }
        // Marked-content nesting is tracked across all streams of the page (ISO 32000-1, 14.6).
        const stack: string[] = [];
        let hiddenDepth: number = 0;
        for (let m: number = 0; m < content.length; m++) {
            const stream: any = content[<number>m]; // eslint-disable-line
            if (!stream || typeof stream.getBytes !== 'function') {
                continue;
            }
            const bytes: Uint8Array = stream instanceof _PdfContentStream ? new Uint8Array(stream._bytes) : stream.getBytes();
            const records: _PdfRecord[] = new _ContentParser(bytes)._readContent();
            const data: _PdfContentStream = new _PdfContentStream([]);
            for (let j: number = 0; j < records.length; j++) {
                const entry: _PdfRecord = records[<number>j];
                const operator: string = entry._operator;
                if (operator === 'BDC' || operator === 'BMC') {
                    let kind: string = 'other';
                    if (operator === 'BDC' && entry._operands.length > 1 && entry._operands[0] === '/OC') {
                        const key: string = entry._operands[1].substring(1);
                        if (hidden.indexOf(key) !== -1) {
                            kind = 'hidden';
                        } else if (visible.indexOf(key) !== -1) {
                            kind = 'visible';
                        }
                    }
                    stack.push(kind);
                    if (kind === 'hidden') {
                        hiddenDepth++;
                        continue;
                    }
                    if (kind === 'visible' || hiddenDepth > 0) {
                        continue;
                    }
                } else if (operator === 'EMC') {
                    const kind: string = stack.pop();
                    if (kind === 'hidden') {
                        hiddenDepth--;
                        continue;
                    }
                    if (kind === 'visible' || hiddenDepth > 0) {
                        continue;
                    }
                } else if (hiddenDepth > 0) {
                    continue;
                }
                if (entry._inlineImageBytes && operator === 'EI') {
                    data.write(entry._inlineImageBytes as any); // eslint-disable-line
                    data.write('\r\n');
                }
                if (entry._operands) {
                    for (const operand of entry._operands) {
                        data.write(operand);
                        data.write(' ');
                    }
                }
                data.write(operator);
                data.write('\r\n');
            }
            const ref: _PdfReference = raw[<number>m];
            if (ref instanceof _PdfReference) {
                this._crossReference._cacheMap.set(ref, data);
            }
        }
        pageDictionary._updated = true;
    }
    /**
     * Inserts a layer reference into the document order at the specified index.
     *
     * @private
     * @param {number} index The insertion index.
     * @param {PdfLayer} layer The layer to insert.
     * @returns {void} nothing.
     */
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
                                if (order[<number>index] instanceof _PdfReference) {
                                    if (index + 1 < order.length && index + 2 < order.length) {
                                        const first: number = index + 1;
                                        const second: number = index + 2;
                                        if (order[<number>first] instanceof _PdfReference
                                        && order[<number>second] instanceof _PdfReference) {
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
/**
 * The class provides methods and properties to handle a name-based group of layers.
 * A group is an organizational node in the Layers panel and does not own an optional content group.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Add a layer group
 * let group: PdfLayerGroup = document.layers.addGroup('Group1');
 * // Add a layer to the group
 * group.add('Layer1');
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfLayerGroup extends PdfLayerCollection {
    _name: string = '';
    _parentCollection: PdfLayerCollection;
    /**
     * Marks this entry as a group so callers can avoid a runtime import of this module.
     *
     * @private
     * @type {boolean}
     */
    _isGroup: boolean = true;
    /**
     * Initializes a new instance of the `PdfLayerGroup` class.
     *
     * @private
     * @param {PdfDocument} document Document.
     * @param {string} name Group name.
     * @param {PdfLayerCollection} parentCollection Parent collection.
     */
    constructor(document: PdfDocument, name?: string, parentCollection?: PdfLayerCollection) {
        super(document);
        this._name = name || '';
        this._parentCollection = parentCollection;
    }
    /**
     * Gets the name of the group.
     *
     * @returns {string} Group name.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Add a layer group
     * let group: PdfLayerGroup = document.layers.addGroup('Group1');
     * // Get the group name
     * let name: string = group.name;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get name(): string {
        return this._name;
    }
    /**
     * Sets the name of the group.
     *
     * @param {string} value Group name.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Add a layer group
     * let group: PdfLayerGroup = document.layers.addGroup('Group1');
     * // Rename the group
     * group.name = 'Renamed';
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set name(value: string) {
        if (typeof value !== 'string') {
            throw new Error('Group name must be a string');
        }
        this._name = value;
        const root: PdfLayerCollection = this._root();
        if (root._groupsEnabled) {
            root._groupsModified = true;
        }
        this._syncOrder();
    }
}
