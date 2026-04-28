import { PdfDictionary } from './../primitives/pdf-dictionary';
import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { PdfArray } from './../primitives/pdf-array';
import { PointF, SizeF } from './../drawing/pdf-drawing';
import { PdfPageLayerCollection } from './pdf-page-layer-collection';
import { PdfPageLayer } from './pdf-page-layer';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
import { PdfResources } from './../graphics/pdf-resources';
import { PdfSection } from './pdf-section';
/**
 * The abstract base class for all pages,
 * `PdfPageBase` class provides methods and properties to create PDF pages and its elements.
 * @private
 */
export abstract class PdfPageBase implements IPdfWrapper {
    /**
     * Collection of the `layers` of the page.
     * @private
     */
    private layerCollection : PdfPageLayerCollection;
    /**
     * Stores the instance of `PdfDictionary` class.
     * @private
     */
    private pageDictionary : PdfDictionary;
    /**
     * `Index` of the default layer.
     * @default -1.
     * @private
     */
    private defLayerIndex : number = -1;
    /**
     * Local variable to store if page `updated`.
     * @default false.
     * @private
     */
    private modified : boolean = false;
    /**
     * Stores the instance of `PdfResources`.
     * @hidden
     * @private
     */
    private resources : PdfResources;
    /**
     * Instance of `DictionaryProperties` class.
     * @hidden
     * @private
     */
    protected dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * Specifies the current `section`.
     * @hidden
     * @private
     */
    private pdfSection : PdfSection;
    //Properties
    /**
     * Gets the `section` of a page.
     * @private
     */
    public get section() : PdfSection {
        // if (this.pdfSection === null) {
        //     throw new Error('PdfException : Page must be added to some section before using.');
        // }
        return this.pdfSection;
    }
    public set section(value : PdfSection) {
        this.pdfSection = value;
    }
    /**
     * Gets the page `dictionary`.
     * @private
     */
    public get dictionary() : PdfDictionary {
        return this.pageDictionary;
    }
    /**
     * Gets the wrapped `element`.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.pageDictionary;
    }
    /**
     * Gets the `default layer` of the page (Read only).
     * @private
     */
    public get defaultLayer() : PdfPageLayer {
        let layer : PdfPageLayerCollection = this.layers;
        let index : number = this.defaultLayerIndex;
        let returnlayer : PdfPageLayer = layer.items(index) as PdfPageLayer;
        return returnlayer;
    }
    /**
     * Gets or sets `index of the default layer`.
     * @private
     */
    public get defaultLayerIndex() : number {
        if (this.layerCollection.count === 0 || this.defLayerIndex === -1) {
            let layer : PdfPageLayer = this.layerCollection.add();
            this.defLayerIndex = this.layerCollection.indexOf(layer);
        }
        return this.defLayerIndex;
    }
    /**
     * Gets the collection of the page's `layers` (Read only).
     * @private
     */
    public get layers() : PdfPageLayerCollection {
        if (this.layerCollection == null || typeof this.layerCollection === 'undefined') {
            this.layerCollection = new PdfPageLayerCollection(this);
        }
        return this.layerCollection;
    }
    /**
     * Return an instance of `PdfResources` class.
     * @private
     */
    public getResources() : PdfResources {
        if (this.resources == null) {
            this.resources = new PdfResources();
            this.dictionary.items.setValue(this.dictionaryProperties.resources, this.resources);
        }
        return this.resources;
    }
    /**
     * Gets `array of page's content`.
     * @private
     */
    public get contents(): PdfArray {
        let obj : IPdfPrimitive = this.pageDictionary.items.getValue(this.dictionaryProperties.contents);
        let contents : PdfArray = obj as PdfArray;
        let rh : PdfReferenceHolder = obj as PdfReferenceHolder;
        if (contents == null) {
            contents = new PdfArray();
            this.pageDictionary.items.setValue(this.dictionaryProperties.contents, contents);
        }
        return contents;
    }
    /**
     * Gets or sets` index of the default layer`.
     * @private
     */
    public set defaultLayerIndex(value : number) {
        if (value < 0 || value > this.layers.count - 1) {
            throw new Error('ArgumentOutOfRangeException : value, Index can not be less 0 and greater Layers.Count - 1');
        } else {
            this.defLayerIndex = value;
            this.modified = true;
        }
    }
    /**
     * Sets the `resources`.
     * @private
     */
    public setResources(res : PdfResources) : void {
        this.resources = res;
        this.dictionary.items.setValue(this.dictionaryProperties.resources, this.resources);
        this.modified = true;
    }
    /**
     * Gets the `size of the page` (Read only).
     * @private
     */
    public abstract get size() : SizeF;
    /**
     * Gets the `origin of the page`.
     * @private
     */
    public abstract get origin() : PointF;
    //constructors
    /**
     * Initializes a new instance of the `PdfPageBase` class.
     * @private
     */
    constructor(dictionary : PdfDictionary) {
        this.pageDictionary = dictionary;
    }
}