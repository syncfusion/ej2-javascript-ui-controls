import { PdfLayer } from './layer';
import { PdfDocument } from '../pdf-document';
/**
 * Represents a radio button layer group in which only one layer can be visible at a time,
 * similar to radio button selection behavior.
 *
 * ```typescript
 * let document: PdfDocument = new PdfDocument();
 * let layer1: PdfLayer = document.layers.add('English');
 * let layer2: PdfLayer = document.layers.add('Spanish');
 * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
 * radioGroup.add(layer1);
 * radioGroup.add(layer2);
 * radioGroup.activeLayerIndex = 0; // English ON, Spanish OFF
 * document.layerRadioGroups.add(radioGroup);
 * ```
 */
export class PdfLayerRadioGroup {
    /**
     * Internal ordered list of layers participating in this radio group.
     *
     * @private
     * @type {PdfLayer[]}
     */
    _layers: PdfLayer[] = [];
    /**
     * Internal member list (shared with the collection for serialization).
     *
     * @private
     * @returns {PdfLayer[]} Members.
     */
    get _members(): PdfLayer[] {
        return this._layers;
    }
    /**
     * Internal active layer index, resolved from member visibility.
     *
     * @private
     * @returns {number} Active index, or `undefined` when unresolved.
     */
    get _activeLayerIndex(): number {
        return this.activeLayerIndex;
    }
    /**
     * Internal document reference once associated.
     *
     * @private
     * @type {PdfDocument}
     */
    _document: PdfDocument;
    /**
     * Guard to prevent recursive visibility updates.
     *
     * @private
     * @type {boolean}
     */
    private _isUpdatingVisibility: boolean = false;
    /**
     * Initializes a new instance of the `PdfLayerRadioGroup` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add layers to the document
     * let layer1: PdfLayer = document.layers.add('English');
     * let layer2: PdfLayer = document.layers.add('Spanish');
     * // Create a new radio group
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * // Add the layers to the radio group one by one
     * radioGroup.add(layer1);
     * radioGroup.add(layer2);
     * // Make the first layer active
     * radioGroup.activeLayerIndex = 0;
     * // Add the radio group to the document
     * document.layerRadioGroups.add(radioGroup);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfLayerRadioGroup` class with optional layers and an active layer selection.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add layers to the document
     * let layer1: PdfLayer = document.layers.add('English');
     * let layer2: PdfLayer = document.layers.add('Spanish');
     * // Create a radio group with the layers and make the second layer active
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup({ layers: [layer1, layer2], activeLayerIndex: 1 });
     * // Add the radio group to the document
     * document.layerRadioGroups.add(radioGroup);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {object} options Optional settings used to initialize the radio group.
     * @param {PdfLayer[]} options.layers Layers to add to the radio group.
     * @param {number} options.activeLayerIndex Index of the layer to make active.
     */
    constructor(options: { layers?: PdfLayer[], activeLayerIndex?: number })
    constructor(options?: { layers?: PdfLayer[], activeLayerIndex?: number }) {
        if (options) {
            if (options.layers) {
                for (let i: number = 0; i < options.layers.length; i++) {
                    this.add(options.layers[<number>i]);
                }
            }
            if (typeof options.activeLayerIndex === 'number') {
                this.activeLayerIndex = options.activeLayerIndex;
            }
        }
    }
    /**
     * Gets the number of layers contained in the radio button layer group.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Create a radio group
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroup.add(document.layers.at(0) as PdfLayer);
     * // Get the layer count in the radio group
     * let count: number = radioGroup.count;
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The layer count.
     */
    get count(): number {
        return this._layers.length;
    }
    /**
     * Gets or sets the index of the currently visible layer within the radio button layer group.
     *
     * If exactly one unlocked member is visible, returns that member's index.
     * If zero or multiple unlocked members are visible or the group is empty, returns undefined.
     *
     * Setting this property automatically shows the selected layer and hides all other unlocked layers.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Create a radio group
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroup.add(document.layers.add('English'));
     * radioGroup.add(document.layers.add('Spanish'));
     * // Set the first layer as active (visible)
     * radioGroup.activeLayerIndex = 0;
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The active layer index, or `undefined` when no single active layer is resolved.
     */
    get activeLayerIndex(): number {
        if (this._layers.length === 0) {
            return undefined;
        }
        let visibleUnlockedIndex: number = -1;
        let visibleUnlockedCount: number = 0;
        for (let i: number = 0; i < this._layers.length; i++) {
            const layer: PdfLayer = this._layers[<number>i];
            if (layer && !layer.locked && layer.visible) {
                visibleUnlockedCount++;
                visibleUnlockedIndex = i;
            }
        }
        if (visibleUnlockedCount === 1) {
            return visibleUnlockedIndex;
        }
        return undefined;
    }
    set activeLayerIndex(index: number) {
        if (typeof index !== 'number' || isNaN(index) || Math.floor(index) !== index || index < 0 || index >= this._layers.length) {
            return;
        }
        const targetLayer: PdfLayer = this._layers[<number>index];
        if (!targetLayer || targetLayer.locked) {
            return;
        }
        this._isUpdatingVisibility = true;
        try {
            for (let i: number = 0; i < this._layers.length; i++) {
                const current: PdfLayer = this._layers[<number>i];
                if (current && !current.locked) {
                    if (i === index) {
                        current.visible = true;
                    } else {
                        current.visible = false;
                    }
                }
            }
            if (this._document) {
                this._document._syncRBGroupsDictionary();
            }
        } finally {
            this._isUpdatingVisibility = false;
        }
    }
    /**
     * Adds the specified layer to the radio button layer group.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Create a layer
     * let layer: PdfLayer = document.layers.add('Layer1');
     * // Create a radio group and add the layer
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroup.add(layer);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfLayer} layer The layer to add.
     * @returns {void}
     */
    public add(layer: PdfLayer): void {
        if (!layer) {
            throw new Error('Layer cannot be null or undefined');
        }
        if (this._document && layer._document && this._document !== layer._document) {
            throw new Error('Layer belongs to a different document');
        }
        if (this._layers.indexOf(layer) !== -1) {
            throw new Error('Layer already exists in the radio group');
        }
        if (layer._radioGroups && layer._radioGroups.length > 0) {
            throw new Error('Layer already belongs to another radio group');
        }
        this._layers.push(layer);
        if (!layer._radioGroups) {
            layer._radioGroups = [];
        }
        if (layer._radioGroups.indexOf(this) === -1) {
            layer._radioGroups.push(this);
        }
        if (this._document) {
            this._document._syncRBGroupsDictionary();
        }
    }
    /**
     * Returns the layer at the specified index within the radio button layer group.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Create a radio group
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroup.add(document.layers.add('Layer1'));
     * // Retrieve the layer at index 0
     * let layer: PdfLayer = radioGroup.itemAt(0);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} index Index of the layer.
     * @returns {PdfLayer} The layer instance.
     */
    public itemAt(index: number): PdfLayer {
        if (index < 0 || index >= this._layers.length) {
            return undefined;
        }
        return this._layers[<number>index];
    }
    /**
     * Removes the layer at the specified index from the radio button layer group.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Create a radio group
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroup.add(document.layers.add('Layer1'));
     * // Remove the layer at index 0
     * radioGroup.removeAt(0);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} index Index of the layer to remove.
     * @returns {void}
     */
    public removeAt(index: number): void {
        if (index < 0 || index >= this._layers.length) {
            return;
        }
        const layer: PdfLayer = this._layers[<number>index];
        this._layers.splice(index, 1);
        if (layer && layer._radioGroups) {
            const rgIndex: number = layer._radioGroups.indexOf(this);
            if (rgIndex !== -1) {
                layer._radioGroups.splice(rgIndex, 1);
            }
        }
        if (this._document) {
            this._document._syncRBGroupsDictionary();
        }
    }
    /**
     * Removes the specified layer from the radio button layer group.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Create a layer
     * let layer: PdfLayer = document.layers.add('Layer1');
     * // Create a radio group and add the layer
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroup.add(layer);
     * // Remove the layer from the radio group
     * radioGroup.remove(layer);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfLayer} layer The layer to remove.
     * @returns {void}
     */
    public remove(layer: PdfLayer): void {
        if (!layer) {
            return;
        }
        const index: number = this._layers.indexOf(layer);
        if (index !== -1) {
            this.removeAt(index);
        }
    }
    /**
     * Determines whether the specified layer exists in the radio button layer group.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Create a layer
     * let layer: PdfLayer = document.layers.add('Layer1');
     * // Create a radio group and add the layer
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroup.add(layer);
     * // Check if the layer exists in the radio group
     * let exists: boolean = radioGroup.has(layer);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfLayer} layer The layer to check.
     * @returns {boolean} True if the layer exists; otherwise, false.
     */
    public has(layer: PdfLayer): boolean {
        if (!layer) {
            return false;
        }
        return this._layers.indexOf(layer) !== -1;
    }
    /**
     * Returns the zero-based index of the specified layer; otherwise, -1 if not found.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Create a layer
     * let layer: PdfLayer = document.layers.add('Layer1');
     * // Create a radio group and add the layer
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroup.add(layer);
     * // Find the index of the layer in the radio group
     * let index: number = radioGroup.indexOf(layer);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfLayer} layer The layer to find.
     * @returns {number} The zero-based index.
     */
    public indexOf(layer: PdfLayer): number {
        if (!layer) {
            return -1;
        }
        return this._layers.indexOf(layer);
    }
    /**
     * Removes all layers from the radio button layer group.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Create a radio group
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroup.add(document.layers.add('Layer1'));
     * // Clear all layers from the radio group
     * radioGroup.clear();
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {void}
     */
    public clear(): void {
        for (let i: number = 0; i < this._layers.length; i++) {
            const layer: PdfLayer = this._layers[<number>i];
            if (layer && layer._radioGroups) {
                const rgIndex: number = layer._radioGroups.indexOf(this);
                if (rgIndex !== -1) {
                    layer._radioGroups.splice(rgIndex, 1);
                }
            }
        }
        this._layers.length = 0;
        if (this._document) {
            this._document._syncRBGroupsDictionary();
        }
    }
    /**
     * Notification handler when a member layer's visible property is modified directly.
     *
     * @private
     * @param {PdfLayer} layer The layer whose visibility changed.
     * @param {boolean} isVisible The new visibility value.
     * @returns {void} nothing.
     */
    _onLayerVisibilityChanged(layer: PdfLayer, isVisible: boolean): void {
        if (this._isUpdatingVisibility || !layer || layer.locked) {
            return;
        }
        this._isUpdatingVisibility = true;
        try {
            const index: number = this._layers.indexOf(layer);
            if (index === -1) {
                return;
            }
            if (isVisible) {
                for (let i: number = 0; i < this._layers.length; i++) {
                    const sibling: PdfLayer = this._layers[<number>i];
                    if (sibling && sibling !== layer && !sibling.locked) {
                        sibling.visible = false;
                    }
                }
            }
            if (this._document) {
                this._document._syncRBGroupsDictionary();
            }
        } finally {
            this._isUpdatingVisibility = false;
        }
    }
}
/**
 * Represents a collection of radio button layer groups that enforce mutually exclusive
 * visibility behavior among associated PDF layers.
 *
 * ```typescript
 * let document: PdfDocument = new PdfDocument();
 * let radioGroups: PdfLayerRadioGroupCollection = document.layerRadioGroups;
 * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
 * radioGroups.add(radioGroup);
 * ```
 */
export class PdfLayerRadioGroupCollection {
    /**
     * Internal ordered list of radio groups.
     *
     * @private
     * @type {PdfLayerRadioGroup[]}
     */
    _groups: PdfLayerRadioGroup[] = [];
    /**
     * Document that owns this radio group collection.
     *
     * @private
     * @type {PdfDocument}
     */
    _document: PdfDocument;
    /**
     * Initializes a new instance of the `PdfLayerRadioGroupCollection` class.
     *
     * @private
     * @param {PdfDocument} document The document owning this collection.
     */
    constructor(document: PdfDocument) {
        this._document = document;
    }
    /**
     * Gets the number of radio button layer groups in the collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of radio groups in the document
     * let radioGroups: PdfLayerRadioGroupCollection = document.layerRadioGroups;
     * // Get the count of radio groups
     * let count: number = radioGroups.count;
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The count.
     */
    get count(): number {
        return this._groups.length;
    }
    /**
     * Adds the specified radio button layer group to the collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of radio groups in the document
     * let radioGroups: PdfLayerRadioGroupCollection = document.layerRadioGroups;
     * // Create a radio group and add to the collection
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroups.add(radioGroup);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfLayerRadioGroup} group The radio group to add.
     * @returns {void}
     */
    public add(group: PdfLayerRadioGroup): void {
        if (!group) {
            throw new Error('Radio group cannot be null or undefined');
        }
        if (group._document && this._document && group._document !== this._document) {
            throw new Error('Radio group belongs to a different document');
        }
        if (this._groups.indexOf(group) !== -1) {
            return;
        }
        group._document = this._document;
        // Also validate that member layers belong to this document
        for (let i: number = 0; i < group.count; i++) {
            const member: PdfLayer = group.itemAt(i);
            if (member && member._document && this._document && member._document !== this._document) {
                throw new Error('Layer belongs to a different document');
            }
        }
        this._groups.push(group);
        if (this._document) {
            this._document._syncRBGroupsDictionary();
        }
    }
    /**
     * Returns the radio button layer group at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of radio groups in the document
     * let radioGroups: PdfLayerRadioGroupCollection = document.layerRadioGroups;
     * // Retrieve the radio group at index 0
     * let radioGroup: PdfLayerRadioGroup = radioGroups.itemAt(0);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} index Index of the radio group.
     * @returns {PdfLayerRadioGroup} The radio group instance.
     */
    public itemAt(index: number): PdfLayerRadioGroup {
        if (index < 0 || index >= this._groups.length) {
            return undefined;
        }
        return this._groups[<number>index];
    }
    /**
     * Removes the radio button layer group at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of radio groups in the document
     * let radioGroups: PdfLayerRadioGroupCollection = document.layerRadioGroups;
     * // Remove the radio group at index 0
     * radioGroups.removeAt(0);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} index Index of the radio group to remove.
     * @returns {void}
     */
    public removeAt(index: number): void {
        if (index < 0 || index >= this._groups.length) {
            return;
        }
        this._groups.splice(index, 1);
        if (this._document) {
            this._document._syncRBGroupsDictionary();
        }
    }
    /**
     * Removes the specified radio button layer group from the collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of radio groups in the document
     * let radioGroups: PdfLayerRadioGroupCollection = document.layerRadioGroups;
     * let radioGroup: PdfLayerRadioGroup = radioGroups.itemAt(0);
     * // Remove the radio group from the collection
     * radioGroups.remove(radioGroup);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfLayerRadioGroup} group The radio group to remove.
     * @returns {void}
     */
    public remove(group: PdfLayerRadioGroup): void {
        if (!group) {
            return;
        }
        const index: number = this._groups.indexOf(group);
        if (index !== -1) {
            this.removeAt(index);
        }
    }
    /**
     * Determines whether the specified layer belongs to any radio button layer group in the collection,
     * or whether the specified radio group exists in the collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of radio groups in the document
     * let radioGroups: PdfLayerRadioGroupCollection = document.layerRadioGroups;
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroups.add(radioGroup);
     * // Check if the radio group exists in the collection
     * let exists: boolean = radioGroups.has(radioGroup);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfLayer | PdfLayerRadioGroup} item The layer or radio group to check.
     * @returns {boolean} True if found; otherwise, false.
     */
    public has(item: PdfLayer | PdfLayerRadioGroup): boolean {
        if (!item) {
            return false;
        }
        if (item instanceof PdfLayerRadioGroup) {
            return this._groups.indexOf(item) !== -1;
        } else if (item instanceof PdfLayer) {
            for (let i: number = 0; i < this._groups.length; i++) {
                if (this._groups[<number>i].has(item)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Returns the zero-based index of the specified radio button layer group; otherwise, -1 if not found.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of radio groups in the document
     * let radioGroups: PdfLayerRadioGroupCollection = document.layerRadioGroups;
     * let radioGroup: PdfLayerRadioGroup = new PdfLayerRadioGroup();
     * radioGroups.add(radioGroup);
     * // Find the index of the radio group in the collection
     * let index: number = radioGroups.indexOf(radioGroup);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfLayerRadioGroup} group The radio group to find.
     * @returns {number} The zero-based index.
     */
    public indexOf(group: PdfLayerRadioGroup): number {
        if (!group) {
            return -1;
        }
        return this._groups.indexOf(group);
    }
    /**
     * Removes all radio button layer groups from the collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of radio groups in the document
     * let radioGroups: PdfLayerRadioGroupCollection = document.layerRadioGroups;
     * // Clear all radio groups from the collection
     * radioGroups.clear();
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {void}
     */
    public clear(): void {
        this._groups.length = 0;
        if (this._document) {
            this._document._syncRBGroupsDictionary();
        }
    }
    /**
     * Internal cleanup when a layer is removed from the document.
     *
     * @private
     * @param {PdfLayer} layer The removed layer.
     * @returns {void} nothing.
     */
    _removeLayer(layer: PdfLayer): void {
        for (let i: number = this._groups.length - 1; i >= 0; i--) {
            const group: PdfLayerRadioGroup = this._groups[<number>i];
            if (group.has(layer)) {
                group.remove(layer);
                if (group.count === 0) {
                    this._groups.splice(i, 1);
                }
            }
        }
        if (this._document) {
            this._document._syncRBGroupsDictionary();
        }
    }
}
