import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { PdfDictionary } from './../primitives/pdf-dictionary';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
import { PdfName } from './../primitives/pdf-name';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
/**
 * `PdfAction` class represents base class for all action types.
 * @private
 */
export abstract class PdfAction implements IPdfWrapper {
    /**
     * Specifies the Next `action` to perform.
     * @private
     */
    private action : PdfAction = null;
    /**
     * Specifies the Internal variable to store `dictionary`.
     * @private
     */
    private pdfDictionary : PdfDictionary;
    /**
     * Specifies the Internal variable to store `dictionary properties`.
     * @private
     */
    protected dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    // Constructors
    /**
     * Initialize instance for `Action` class.
     * @private
     */
    protected constructor() {
        // super(); -> Object()
        this.initialize();
    }
    // Properties
    /**
     * Gets and Sets the `Next` action to perform.
     * @private
     */
    public get next() : PdfAction {
        return this.action;
    }
    public set next(value : PdfAction) {
        // if (this.action !== value) {
        this.action = value;
        this.dictionary.items.setValue(this.dictionaryProperties.next, new PdfReferenceHolder(this.action));
        // }
    }
    /**
     * Gets and Sets the instance of PdfDictionary class for `Dictionary`.
     * @private
     */
    public get dictionary() : PdfDictionary {
        if (typeof this.pdfDictionary === 'undefined') {
            this.pdfDictionary = new PdfDictionary();
        }
        return this.pdfDictionary;
    }
    // Implementation
    /**
     * `Initialize` the action type.
     * @private
     */
    protected initialize() : void {
        this.dictionary.items.setValue(this.dictionaryProperties.type, new PdfName(this.dictionaryProperties.action));
    }
    // IPdfWrapper Members
    /**
     * Gets the `Element` as IPdfPrimitive class.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.dictionary;
    }
}