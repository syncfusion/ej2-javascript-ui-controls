/**
 * PdfNumber.ts class for EJ2-PDF
 */
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { ObjectStatus } from './../input-output/enum';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
/**
 * `PdfNumber` class is used to perform number related primitive operations.
 * @private
 */
export class PdfNumber implements IPdfPrimitive {
    /**
     * Shows the type of object `status` whether it is object registered or other status;
     * @private
     */
    private status5 : ObjectStatus;
    /**
     * Indicates if the object is currently in `saving state or not`.
     * @private
     */
    private isSaving5 : boolean;
    /**
     * Holds the `index` number of the object.
     * @private
     */
    private index5 : number;
    /**
     * Stores the `int` value.
     * @private
     */
    private value : number;
    /**
     * Sotres the `position`.
     * @default -1
     * @private
     */
    private position5 : number = -1;
    /**
     * The `integer` value.
     * @private
     */
    private integer : boolean;
    /**
     * Initializes a new instance of the `PdfNumber` class.
     * @private
     */
    constructor(value : number) {
        this.value = value;
    }
    /**
     * Gets or sets the `integer` value.
     * @private
     */
    public get intValue() : number {
        return this.value;
    }
    public set intValue(value : number) {
        this.value = value;
    }
    /**
     * Gets or sets a value indicating whether this instance `is integer`.
     * @private
     */
    public get isInteger() : boolean {
        return this.integer;
    }
    public set isInteger(value : boolean) {
        this.integer = value;
    }
    /**
     * Gets or sets the `Status` of the specified object.
     * @private
     */
    public get status() : ObjectStatus {
        return this. status5;
    }
    public set status(value : ObjectStatus) {
        this. status5 = value;
    }
    /**
     * Gets or sets a value indicating whether this document `is saving` or not.
     * @private
     */
    public get isSaving() : boolean {
        return this. isSaving5;
    }
    public set isSaving(value : boolean) {
        this. isSaving5 = value;
    }
    /**
     * Gets or sets the `index` value of the specified object.
     * @private
     */
    public get objectCollectionIndex() : number {
        return this.index5;
    }
    public set objectCollectionIndex(value : number) {
        this.index5 = value;
    }
    /**
     * Gets or sets the `position` of the object.
     * @private
     */
    public get position() : number {
        return this.position5;
    }
    public set position(value : number) {
        this.position5 = value;
    }
    /**
     * Returns `cloned object`.
     * @private
     */
    public get clonedObject() : IPdfPrimitive {
        let rValue : IPdfPrimitive = null;
        return rValue;
    }
    /**
     * `Saves the object`.
     * @private
     */
    public save(writer : IPdfWriter) : void {
        writer.write(this.intValue.toString()); //tostring(CultureInfo.InletiantCulture)
    }
    /**
     * Creates a `copy of PdfNumber`.
     * @private
     */
    public clone(crossTable : PdfCrossTable) : IPdfPrimitive {
        let newNumber : PdfNumber = new PdfNumber(this.value);
        return newNumber;
    }
    /**
     * Converts a `float value to a string` using Adobe PDF rules.
     * @private
     */
    public static floatToString(number : number) : string {
        // let tempString1 : string = number.toString();
        // let tempString2 : string = tempString1.indexOf('.') != -1 ? tempString1.substring(0, tempString1.indexOf('.')) : tempString1;
        let returnString : string = number.toFixed(2);
        if (returnString === '0.00') {
            returnString = '.00';
        }
        // let prefixLength : number = (22 - tempString2.length) >= 0 ? (22 - tempString2.length) : 0;
        // for (let index : number = 0; index < prefixLength; index++) {
        //     returnString += '0';
        // }
        // returnString += tempString2 + '.00';
        // returnString += (tempString3.length > 6) ? tempString3.substring(0,6) : tempString3;
        // let suffixLength : number = (6 - tempString3.length) >= 0 ? (6 - tempString3.length) : 0;
        // for (let index : number = 0; index < suffixLength; index++) {
        //     returnString += '0';
        // }
        return returnString;
    }
    /**
     * Determines the `minimum of the three values`.
     * @private
     */
    public static min(x : number, y : number, z : number) : number {
        let r : number = Math.min(x, y);
        return Math.min(z, r);
    }
}