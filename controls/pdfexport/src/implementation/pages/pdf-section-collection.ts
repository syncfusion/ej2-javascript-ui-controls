/**
 * PdfSectionCollection.ts class for EJ2-PDF
 */
import { PdfDocument } from './../document/pdf-document';
import { PdfNumber } from './../primitives/pdf-number';
import { PdfName } from './../primitives/pdf-name';
import { PdfArray } from './../primitives/pdf-array';
import { PdfDictionary, SaveSectionCollectionEventHandler } from './../primitives/pdf-dictionary';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { PdfPageSettings } from './pdf-page-settings';
import { RectangleF, PointF } from './../drawing/pdf-drawing';
import { PdfSection } from './pdf-section';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
/**
 * Represents the `collection of the sections`.
 * @private
 */
export class PdfSectionCollection implements IPdfWrapper {
    //Fields
    /**
     * Rotate factor for page `rotation`.
     * @default 90
     * @private
     */
    public static readonly rotateFactor : number = 90;
    /**
     * the current `document`.
     * @private
     */
    private pdfDocument : PdfDocument;
    /**
     * `count` of the sections.
     * @private
     */
    private sectionCount : PdfNumber;
    /**
     * @hidden
     * @private
     */
    private sections : PdfSection[] = [];
    /**
     * @hidden
     * @private
     */
    private sectionCollection : PdfArray;
    /**
     * @hidden
     * @private
     */
    private pages : PdfDictionary;
    /**
     * @hidden
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    //constructor
    /**
     * Initializes a new instance of the `PdfSectionCollection` class.
     * @private
     */
    public constructor(document : PdfDocument) {
        // if (document === null) {
        //     throw new Error('ArgumentNullException : document');
        // }
        this.pdfDocument = document.clone();
        this.initialize();
    }
    //Properties
    /**
     * Gets the `Section` collection.
     */
    public get section() : PdfSection[] {
        return this.sections;
    }
    /**
     * Gets a parent `document`.
     * @private
     */
    public get document() : PdfDocument {
        return this.pdfDocument;
    }
    /**
     * Gets the `number of sections` in a document.
     * @private
     */
    public get count() : number {
        return this.sections.length;
    }
    /**
     * Gets the wrapped `element`.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.pages;
    }
    //Methods
    /**
     * `Initializes the object`.
     * @private
     */
    private initialize() : void {
        this.sectionCount = new PdfNumber(0);
        this.sectionCollection = new PdfArray();
        this.pages = new PdfDictionary();
        this.pages.beginSave = new SaveSectionCollectionEventHandler(this);
        this.pages.items.setValue(this.dictionaryProperties.type, new PdfName('Pages'));
        this.pages.items.setValue(this.dictionaryProperties.kids, this.sectionCollection);
        this.pages.items.setValue(this.dictionaryProperties.count, this.sectionCount);
        this.pages.items.setValue(this.dictionaryProperties.resources, new PdfDictionary());
        this.setPageSettings(this.pages, this.pdfDocument.pageSettings);
    }
    /**
     * Initializes a new instance of the `PdfSectionCollection` class.
     * @private
     */
    public pdfSectionCollection(index : number) : PdfSection {
        if (index < 0 || index >= this.count) {
            throw new Error('IndexOutOfRangeException()');
        }
        return (this.sections[index] as PdfSection);
    }
    /**
     * In fills dictionary by the data from `Page settings`.
     * @private
     */
    private setPageSettings(container : PdfDictionary, pageSettings : PdfPageSettings) : void {
        // if (container === null) {
        //     throw new Error('ArgumentNullException : container');
        // }
        // if (pageSettings === null) {
        //     throw new Error('ArgumentNullException : pageSettings');
        // }
        let bounds : RectangleF = new RectangleF(new PointF(), pageSettings.size);
        container.items.setValue(this.dictionaryProperties.mediaBox, PdfArray.fromRectangle(bounds));
    }
    /**
     * `Adds` the specified section.
     * @private
     */
    public add(section? : PdfSection) : number|PdfSection {
        if (typeof section === 'undefined') {
            let section : PdfSection = new PdfSection(this.pdfDocument);
            this.add(section);
            return section;
        } else {
            // if (section === null) {
            //     throw new Error('ArgumentNullException : section');
            // }
            let r : PdfReferenceHolder = this.checkSection(<PdfSection>section);
            this.sections.push(section);
            section.parent = this;
            this.sectionCollection.add(r);
            return this.sections.indexOf(section);
        }
    }
    /**
     * `Checks` if the section is within the collection.
     * @private
     */
    private checkSection(section : PdfSection) : PdfReferenceHolder {
        let r : PdfReferenceHolder = new PdfReferenceHolder(section);
        let contains : boolean = this.sectionCollection.contains(r);
        // if (contains) {
        //     throw new Error('ArgumentException : The object can not be added twice to the collection,section');
        // }
        return r;
    }
    /**
     * Catches the Save event of the dictionary to `count the pages`.
     * @private
     */
    public countPages() : number {
        let count : number = 0;
        this.sections.forEach((n : PdfSection) => (count += n.count));
        return count;
    }
    /**
     * Catches the Save event of the dictionary to `count the pages`.
     * @hidden
     * @private
     */
    public beginSave() : void {
        this.sectionCount.intValue = this.countPages();
    }
}