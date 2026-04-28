/**
 * PdfFunction.ts class for EJ2-PDF
 * Implements the base class for all functions.
 */
import { PdfDictionary } from '../../primitives/pdf-dictionary';
import { IPdfWrapper} from '../../../interfaces/i-pdf-wrapper';
import { DictionaryProperties } from './../../input-output/pdf-dictionary-properties';
import { PdfArray } from './../../primitives/pdf-array';
import { IPdfPrimitive } from './../../../interfaces/i-pdf-primitives';
export abstract class PdfFunction implements IPdfWrapper {
    //Field
    /**
     * Internal variable to store dictionary.
     * @private
     */
    private mDictionary: PdfDictionary = null;
    /**
     * Local variable to store the dictionary properties.
     * @private
     */
    protected mDictionaryProperties : DictionaryProperties = new DictionaryProperties();
    //Constructor
    /**
     * Initializes a new instance of the `PdfFunction` class.
     * @public
     */
    public constructor(dictionary: PdfDictionary) {
        this.mDictionary = dictionary;
    }
    //Properties
    /**
     * Gets or sets the domain of the function.
     * @public
     */
    protected get domain(): PdfArray {
        let domain: PdfArray = (<PdfArray>this.mDictionary.items.getValue(this.mDictionaryProperties.domain));
        return domain;
    }
    protected set domain(value: PdfArray)  {
        this.mDictionary.items.setValue(this.mDictionaryProperties.domain, value);
    }
    /**
     * Gets or sets the range.
     * @public
     */
    protected get range(): PdfArray {
        let range: PdfArray = (<PdfArray>(this.mDictionary.items.getValue(this.mDictionaryProperties.range)));
        return range;
    }
    protected set range(value: PdfArray)  {
        this.mDictionary.items.setValue(this.mDictionaryProperties.range, value);
    }
    /**
     * Gets the dictionary.
     */
    protected get dictionary(): PdfDictionary {
        return this.mDictionary;
    }
    //IPdfWrapper Members
    /**
     * Gets the element.
     */
    get element(): IPdfPrimitive {
        return this.mDictionary;
    }
}
