/**
 * PdfPageLayerCollection.ts class for EJ2-PDF
 */
import { PdfPageBase } from './pdf-page-base';
import { PdfPage } from './pdf-page';
import { PdfDictionary } from './../primitives/pdf-dictionary';
import { PdfPageLayer } from './pdf-page-layer';
import { PdfCollection } from './../general/pdf-collection';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
import { PdfArray } from './../primitives/pdf-array';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
import { PdfStream } from './../primitives/pdf-stream';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
/**
 * The class provides methods and properties to handle the collections of `PdfPageLayer`.
 */
export class PdfPageLayerCollection extends PdfCollection {
    // Fields
    /**
     * Parent `page`.
     * @private
     */
    private page : PdfPageBase;
    /**
     * Stores the `number of first level layers` in the document.
     * @default 0
     * @private
     */
    private parentLayerCount : number = 0;
    /**
     * Indicates if `Sublayer` is present.
     * @default false
     * @private
     */
    public sublayer : boolean = false;
    /**
     * Stores the `optional content dictionary`.
     * @private
     */
    public optionalContent : PdfDictionary = new PdfDictionary();
    // Properties
    /**
     * Return the `PdfLayer` from the layer collection by index.
     * @private
     */
    public items(index : number) : PdfPageLayer
    /**
     * Stores the `layer` into layer collection with specified index.
     * @private
     */
    public items(index : number, value : PdfPageLayer) : void
    public items(index : number, value ?: PdfPageLayer) : void|PdfPageLayer {
        if (typeof index === 'number' && typeof value === 'undefined') {
            let obj : Object = this.list[index];
            return (obj as PdfPageLayer);
        } else {
            if (value == null) {
                throw new Error('ArgumentNullException: layer');
            }
            if (value.page !== this.page) {
                throw new Error('ArgumentException: The layer belongs to another page');
            }
            // // Add/remove the layer.
            // let layer : PdfPageLayer = this.items(index);
            // if (layer != null) {
            //     this.RemoveLayer(layer);
            // }
            // this.List[index] = value;
            // this.InsertLayer(index, value);
        }
    }
    //  Constructors
    /**
     * Initializes a new instance of the `PdfPageLayerCollection` class
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfPageLayerCollection` class
     * @private
     */
    public constructor(page : PdfPageBase)
    public constructor(page? : PdfPageBase) {
        super();
        if (page instanceof PdfPageBase) {
            // if (page == null) {
            //     throw new Error('ArgumentNullException:page');
            // }
            this.page = page;
            let lPage : PdfPageBase = page;
            // if (lPage != null) {
            this.parseLayers(lPage);
            // }
        }
    }
    // Implementation
    /**
     * Creates a new `PdfPageLayer` and adds it to the end of the collection.
     * @private
     */
    public add() : PdfPageLayer
    /**
     * Creates a new `PdfPageLayer` and adds it to the end of the collection.
     * @private
     */
    public add(layerName : string, visible : boolean) : PdfPageLayer
    /**
     * Creates a new `PdfPageLayer` and adds it to the end of the collection.
     * @private
     */
    public add(layerName : string) : PdfPageLayer
    /**
     * Creates a new `PdfPageLayer` and adds it to the end of the collection.
     * @private
     */
    public add(layer : PdfPageLayer) : number
    public add(firstArgument ?: PdfPageLayer|string, secondArgument ?: boolean) : PdfPageLayer|number {
        if (typeof firstArgument === 'undefined') {
            let layer : PdfPageLayer = new PdfPageLayer(this.page);
            layer.name = '';
            this.add(layer);
            return layer;
        } else if (firstArgument instanceof PdfPageLayer) {
            // if (layer == null)
            //     throw new ArgumentNullException("layer");
            // if (layer.Page != m_page)
            //     throw new ArgumentException("The layer belongs to another page");
            let index : number = this.list.push(firstArgument);
            // Register layer.
            this.addLayer(index, firstArgument);
            return index;
        } else {
            return 0;
        }
    }
    /**
     * Registers `layer` at the page.
     * @private
     */
    private addLayer(index : number, layer : PdfPageLayer) : void {
        let reference : PdfReferenceHolder = new PdfReferenceHolder(layer);
        this.page.contents.add(reference);
    }
    // private RemoveLayer(layer : PdfPageLayer) : void {
    //     if (layer == null) {
    //         throw new Error('ArgumentNullException:layer');
    //     }
    //     let reference : PdfReferenceHolder = new PdfReferenceHolder(layer);
    //     if (this.page != null) {
    //         this.page.Contents.Remove(reference);
    //     }
    // }
    /**
     * Inserts `PdfPageLayer` into the collection at specified index.
     * @private
     */
    public insert(index : number, layer : PdfPageLayer) : void {
        // if (index < 0)
        //     throw new ArgumentOutOfRangeException("index", "Value can not be less 0");
        // if (layer == null)
        //     throw new ArgumentNullException("layer");
        // if (layer.Page != m_page)
        //     throw new ArgumentException("The layer belongs to another page");
        let list : Object[] = [];
        let length : number = this.list.length;
        for (let i : number = index; i < length; i++) {
            list.push(this.list.pop());
        }
        this.list.push(layer);
        for (let i : number = 0; i < list.length; i++) {
            this.list.push(list[i]);
        }
        // Register layer.
        this.insertLayer(index, layer);
    }
    /**
     * Registers layer at the page.
     * @private
     */
    private insertLayer(index : number, layer : PdfPageLayer) : void {
        if (layer == null) {
            throw new Error('ArgumentNullException:layer');
        }
        let reference : PdfReferenceHolder = new PdfReferenceHolder(layer);
        this.page.contents.insert(index, reference);
    }
    // tslint:disable
    /**
     * `Parses the layers`.
     * @private
     */
    private parseLayers(loadedPage : PdfPageBase) : void {// tslint:enable
        // if (loadedPage == null) {
        //     throw new Error('ArgumentNullException:loadedPage');
        // }
        let contents : PdfArray = this.page.contents;
        let resource : PdfDictionary = this.page.getResources();
        let crossTable : PdfCrossTable = null;
        let ocproperties : PdfDictionary = null;
        let propertie : PdfDictionary = null;
        let isLayerAdded : boolean = false;
        // if (loadedPage instanceof PdfPage) {
        crossTable = (loadedPage as PdfPage).crossTable;
        // } else {
        //     crossTable = (loadedPage as PdfLoadedPage).CrossTable;
        //     Propertie = PdfCrossTable.Dereference(Resource[DictionaryProperties.Properties]) as PdfDictionary;
        //     ocproperties = PdfCrossTable.Dereference((loadedPage as PdfLoadedPage).
        //     Document.Catalog[DictionaryProperties.OCProperties]) as PdfDictionary;
        // }
        let saveStream : PdfStream = new PdfStream();
        let restoreStream : PdfStream = new PdfStream();
        let saveState : string = 'q';
        let newLine : string = '\n';
        let restoreState : string = 'Q';
        // for (let index : number = 0; index < contents.Items.length; index++) {
        //     let obj : IPdfPrimitive = contents[index];
        //     let stream : PdfStream = crossTable.GetObject(obj) as PdfStream;

        //     if (stream == null)
        //         throw new PdfDocumentException("Invalid contents array.");

        //     // if (stream.Compress)
        //     {
        //         if (!loadedPage.Imported)
        //             stream.Decompress();
        //     }

        //     byte[] contentId = stream.Data;
        //     string str = PdfString.ByteToString(contentId);

        //     if (!loadedPage.Imported && (contents.Count == 1) && ((stream.Data[stream.Data.Length - 2] ==
        //     RestoreState) || (stream.Data[stream.Data.Length - 1] == RestoreState)))
        //     {
        //         byte[] content = stream.Data;
        //         byte[] data = new byte[content.Length + 4];
        //         data[0] = SaveState;
        //         data[1] = NewLine;
        //         content.CopyTo(data, 2);
        //         data[data.Length - 2] = NewLine;
        //         data[data.Length - 1] = RestoreState;
        //         stream.Data = data;
        //     }

        //     if (ocproperties != null)
        //     {
        //         if (Propertie != null)
        //         {
        //             foreach (KeyValuePair<PdfName, IPdfPrimitive> prop in Propertie.Items)
        //             {
        //                 String Key = prop.Key.ToString();
        //                 PdfReferenceHolder refh = prop.Value as PdfReferenceHolder;
        //                 PdfDictionary Dict = null;
        //                 if (refh != null)
        //                 {
        //                     Dict = refh.Object as PdfDictionary;
        //                 }
        //                 else
        //                 {
        //                     Dict = prop.Value as PdfDictionary;
        //                 }
        //                 PdfDictionary m_usage = PdfCrossTable.Dereference(Dict[DictionaryProperties.Usage]) as PdfDictionary;
        //                 if (m_usage != null)
        //                 {

        //                     if (str.Contains(Key))
        //                     {
        //                         PdfPageLayer layer = new PdfPageLayer(loadedPage, stream);
        //                         PdfDictionary printoption = PdfCrossTable.Dereference(m_usage[DictionaryProperties.Print])
        //                         as PdfDictionary;
        //                         if (printoption != null)
        //                         {
        //                             layer.m_printOption = printoption;

        //                             foreach (KeyValuePair<PdfName, IPdfPrimitive> value in printoption.Items)
        //                             {
        //                                 if (value.Key.Value.Equals(DictionaryProperties.PrintState))
        //                                 {
        //                                     string printState = (value.Value as PdfName).Value;
        //                                     if (printState.Equals(DictionaryProperties.OCGON))
        //                                     {
        //                                         layer.PrintState = PdfPrintState.AlwaysPrint;
        //                                         break;
        //                                     }
        //                                     else
        //                                     {
        //                                         layer.PrintState = PdfPrintState.NeverPrint;
        //                                         break;
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                         PdfString layerName = PdfCrossTable.Dereference(Dict[DictionaryProperties.Name]) as PdfString;
        //                         layer.Name = layerName.Value;
        //                         List.add(layer);
        //                         isLayerAdded = true;
        //                         if(!str.Contains("EMC"))
        //                         break;
        //                     }
        //                 }
        //                 else
        //                 {

        //                     if (str.Contains(Key))
        //                     {
        //                         PdfPageLayer layer = new PdfPageLayer(loadedPage, stream);
        //                         List.add(layer);
        //                         if(Dict.ContainsKey(DictionaryProperties.Name))
        //                         {
        //                         PdfString layerName = PdfCrossTable.Dereference(Dict[DictionaryProperties.Name]) as PdfString;
        //                         layer.Name = layerName.Value;
        //                         }
        //                         isLayerAdded = true;
        //                         break;
        //                     }
        //                 }
        //             }
        //         }

        //     }
        //     if (!isLayerAdded)
        //     {
        //         PdfPageLayer layer = new PdfPageLayer(loadedPage, stream);
        //         List.add(layer);
        //     }
        //     else
        //         isLayerAdded = false;
        // }
        let saveData : string[] = [];
        saveData.push(saveState);
        saveStream.data = saveData;
        contents.insert(0, new PdfReferenceHolder(saveStream));
        saveData = [];
        saveData.push(restoreState);
        restoreStream.data = saveData;
        contents.insert(contents.count, new PdfReferenceHolder(restoreStream));
    }
    /**
     * Returns `index of` the `PdfPageLayer` in the collection if exists, -1 otherwise.
     * @private
     */
    public indexOf(layer : PdfPageLayer) : number {
        if (layer == null) {
            throw new Error('ArgumentNullException: layer');
        }
        let index : number = this.list.indexOf(layer);
        return index;
    }
}