/**
 * PdfTransparency.ts class for EJ2-PDF
 */
import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { PdfDictionary } from './../primitives/pdf-dictionary';
import { PdfBlendMode } from './../graphics/enum';
import { PdfNumber } from './../primitives/pdf-number';
import { PdfName } from './../primitives/pdf-name';
/**
 * Represents a simple `transparency`.
 * @private
 */
export class PdfTransparency implements IPdfWrapper {
    // Fields
    /**
     * Internal variable to store `dictionary`.
     * @default new PdfDictionary()
     * @private
     */
    private dictionary : PdfDictionary = new PdfDictionary();
    // Properties
    // /**
    //  * Gets the `stroke` operation alpha value.
    //  * @private
    //  */
    // public get stroke() : number {
    //     let result : number = this.getNumber('CA');
    //     return result;
    // }
    // /**
    //  * Gets the `fill` operation alpha value.
    //  * @private
    //  */
    // public get fill() : number {
    //     let result : number = this.getNumber('ca');
    //     return result;
    // }
    // /**
    //  * Gets the `blend mode`.
    //  * @private
    //  */
    // public get mode() : PdfBlendMode {
    //     let result : string = this.getName('ca');
    //     return PdfBlendMode.Normal;
    // }
    // Constructors
    /**
     * Initializes a new instance of the `Transparency` class.
     * @private
     */
    public constructor(stroke : number, fill : number, mode : PdfBlendMode) {
        this.dictionary.items.setValue('CA', new PdfNumber(stroke));
        this.dictionary.items.setValue('ca', new PdfNumber(fill));
        this.dictionary.items.setValue('BM', new PdfName(mode.toString()));
    }
    // // Implementation
    // /**
    //  * Gets the `number value`.
    //  * @private
    //  */
    // private getNumber(keyName : string) : number {
    //     let result : number = 0.0;
    //     let numb : PdfNumber = this.dictionary.items.getValue(keyName) as PdfNumber;
    //     result = numb.intValue;
    //     return result;
    // }
    // /**
    //  * Gets the `name value`.
    //  * @private
    //  */
    // private getName(keyName : string) : string {
    //     let result : string = null;
    //     let name : PdfName = this.dictionary.items.getValue(keyName) as PdfName;
    //     result = name.value;
    //     return result;
    // }
    // IPdfWrapper Members
    /**
     * Gets the `element`.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.dictionary;
    }
}