/**
 * PdfBoolean.ts class for EJ2-PDF
 */
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { ObjectStatus } from './../input-output/enum';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
/**
 * `PdfBoolean` class is used to perform boolean related primitive operations.
 * @private
 */
export class PdfBoolean implements IPdfPrimitive {
    /**
     * Shows the type of object `status` whether it is object registered or other status;
     * @private
     */
    private objectStatus : ObjectStatus;
    /**
     * Indicates if the object `is currently in saving state` or not.
     * @private
     */
    private saving : boolean;
    /**
     * Holds the `index` number of the object.
     * @private
     */
    private index : number;
    /**
     * The `value` of the PDF boolean.
     * @private
     */
    public value : boolean;
    /**
     * Internal variable to store the `position`.
     * @default -1
     * @private
     */
    private currentPosition : number = -1;
    //constructor
    /**
     * Initializes a new instance of the `PdfBoolean` class.
     * @private
     */
    constructor(value : boolean) {
        this.value = value;
    }
    //Properties
    /**
     * Gets or sets the `Status` of the specified object.
     * @private
     */
    public get status() : ObjectStatus {
        return this.objectStatus;
    }
    public set status(value : ObjectStatus) {
        this.objectStatus = value;
    }
    /**
     * Gets or sets a value indicating whether this document `is saving` or not.
     * @private
     */
    public get isSaving() : boolean {
        return this.saving;
    }
    public set isSaving(value : boolean) {
        this.saving = value;
    }
    /**
     * Gets or sets the `index` value of the specified object.
     * @private
     */
    public get objectCollectionIndex() : number {
        return this.index;
    }
    public set objectCollectionIndex(value : number) {
        this.index = value;
    }
    /**
     * Gets or sets the `position` of the object.
     * @private
     */
    public get position() : number {
        return this.currentPosition;
    }
    public set position(value : number) {
        this.currentPosition = value;
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
     * `Saves` the object using the specified writer.
     * @private
     */
    public save(writer : IPdfWriter) : void {
        writer.write(this.boolToStr(this.value));
    }
    /**
     * Creates a `copy of PdfBoolean`.
     * @private
     */
    public clone(crossTable : PdfCrossTable) : IPdfPrimitive {
        let newNumber : PdfBoolean = new PdfBoolean(this.value);
        return newNumber;
    }
    // Implementation
    /**
     * Converts `boolean to string` - 0/1 'true'/'false'.
     * @private
     */
    private boolToStr(value : boolean) : string {
        return value ? 'true' : 'false';
    }
}