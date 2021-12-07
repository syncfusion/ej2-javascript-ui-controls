/**
 * PdfCatalog.ts class for EJ2-PDF
 */
import { PdfDictionary } from './../primitives/pdf-dictionary';
import { PdfSectionCollection } from './../pages/pdf-section-collection';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
import { PdfName } from './../primitives/pdf-name';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
/**
 * `PdfCatalog` class represents internal catalog of the Pdf document.
 * @private
 */
export class PdfCatalog extends PdfDictionary {
    //fields
    /**
     * Internal variable to store collection of `sections`.
     * @default null
     * @private
     */
    private sections : PdfSectionCollection = null;
    /**
     * Internal variable for accessing fields from `DictionryProperties` class.
     * @private
     */
    private tempDictionaryProperties : DictionaryProperties = new DictionaryProperties();
    //constructor
    /**
     * Initializes a new instance of the `PdfCatalog` class.
     * @private
     */
    public constructor() {
        super();
        this.items.setValue(new DictionaryProperties().type, new PdfName('Catalog'));
    }
    //Properties
    /**
     * Gets or sets the sections, which contain `pages`.
     * @private
     */
    public get pages() : PdfSectionCollection {
        return this.sections;
    }
    public set pages(value : PdfSectionCollection) {
        let dictionary : PdfDictionary = value.element as PdfDictionary;
        // if (this.sections !== value) {
        //     this.sections = value;
        //     this.Items.setValue(this.tempDictionaryProperties.pages, new PdfReferenceHolder(value));
        // }
        this.sections = value;
        this.items.setValue(this.tempDictionaryProperties.pages, new PdfReferenceHolder(value));
    }
}