/**
 * PdfDocumentBase.ts class for EJ2-PDF
 */
import { PdfMainObjectCollection } from './../input-output/pdf-main-object-collection';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
import { PdfCatalog } from './pdf-catalog';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { Encoding } from '@syncfusion/ej2-file-utils';
import { PdfDocument } from './pdf-document';
import { PdfReference } from './../primitives/pdf-reference';
/**
 * `PdfDocumentBase` class represent common properties of PdfDocument classes.
 * @private
 */
export class PdfDocumentBase {
    //Fields
    /**
     * Collection of the main `objects`.
     * @private
     */
    private objects : PdfMainObjectCollection;
    /**
     * The `cross table`.
     * @private
     */
    private pdfCrossTable : PdfCrossTable;
    /**
     * `Object` that is saving currently.
     * @private
     */
    private currentSavingObject : PdfReference;
    /**
     * Document `catlog`.
     * @private
     */
    private pdfCatalog : PdfCatalog;
    /**
     * If the stream is copied,  then it specifies true.
     * @private
     */
    public isStreamCopied : boolean = false;
    /**
     * Instance of parent `document`.
     * @private
     */
    public document : PdfDocument;
    //constructor
    /**
     * Initializes a new instance of the `PdfDocumentBase` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfDocumentBase` class with instance of PdfDocument as argument.
     * @private
     */
    public constructor(document : PdfDocument)
    public constructor(document? : PdfDocument) {
        if (document instanceof PdfDocument) {
            this.document = document;
        }
    }
    //Prpperties
    /**
     * Gets the `PDF objects` collection, which stores all objects and references to it..
     * @private
     */
    public get pdfObjects() : PdfMainObjectCollection {
        return this.objects;
    }
    /**
     * Gets the `cross-reference` table.
     * @private
     */
    public get crossTable() : PdfCrossTable {
        return this.pdfCrossTable;
    }
    /**
     * Gets or sets the current saving `object number`.
     * @private
     */
    public get currentSavingObj() : PdfReference {
        return this.currentSavingObject;
    }
    public set currentSavingObj(value : PdfReference) {
        this.currentSavingObject = value;
    }
    /**
     * Gets the PDF document `catalog`.
     * @private
     */
    public get catalog() : PdfCatalog {
        return this.pdfCatalog;
    }
    public set catalog(value : PdfCatalog) {
        this.pdfCatalog = value;
    }
    //Public methods
    /**
     * Sets the `main object collection`.
     * @private
     */
    public setMainObjectCollection(mainObjectCollection : PdfMainObjectCollection) : void {
        this.objects = mainObjectCollection;
    }
    /**
     * Sets the `cross table`.
     * @private
     */
    public setCrossTable(cTable : PdfCrossTable) : void {
        this.pdfCrossTable = cTable;
    }
    /**
     * Sets the `catalog`.
     * @private
     */
    public setCatalog(catalog : PdfCatalog) : void {
        this.pdfCatalog = catalog;
    }
    /**
     * `Saves` the document to the specified filename.
     * @private
     */
    public save(): Promise<{blobData: Blob}>
    /**
     * `Saves` the document to the specified filename.
     * @public
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * //
     * // save the document
     * document.save('output.pdf');
     * //
     * // destroy the document
     * document.destroy();
     * ```
     * @param filename Specifies the file name to save the output pdf document.
     */
    public save(filename : string) : void
    public save(filename ?: string) : Promise<{blobData: Blob}> | void {
        let encoding: Encoding = new Encoding(true);
        let SW : StreamWriter = new StreamWriter(encoding);
        if (typeof filename === 'undefined') {
            let encoding: Encoding = new Encoding(true);
            let SW: StreamWriter = new StreamWriter(encoding);
            return new Promise((resolve: Function, reject: Function) => {
                /* tslint:disable-next-line:no-any */
                let obj: any = {};
                obj.blobData = new Blob([this.document.docSave(SW, true)], {type : 'application/pdf'});
                resolve(obj);
            });
        } else {
            this.document.docSave(SW, filename, true);
        }
    }
    /**
     * `Clone` of parent object - PdfDocument.
     * @private
     */
    public clone() : PdfDocument {
        return this.document;
    }
}