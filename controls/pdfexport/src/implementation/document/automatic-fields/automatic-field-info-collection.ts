/**
 * PdfAutomaticFieldInfoCollection.ts class for EJ2-PDF
 * @private
 */
import { PdfAutomaticFieldInfo } from './automatic-field-info';
/**
 * Represent a `collection of automatic fields information`.
 * @private
 */
export class PdfAutomaticFieldInfoCollection {
    /**
     * Internal variable to store instance of `pageNumberFields` class.
     * @private
     */
    private automaticFieldsInformation : PdfAutomaticFieldInfo[] = [];
    /**
     * Gets the `page number fields collection`.
     * @private
     */
    public get automaticFields() : PdfAutomaticFieldInfo[] {
        return this.automaticFieldsInformation;
    }
    /**
     * Initializes a new instance of the 'PdfPageNumberFieldInfoCollection' class.
     * @private
     */
    public constructor() {
        //
    }
    // Public methods
    /// Adds the specified field info.
    /**
     * Add page number field into collection.
     * @private
     */
    public add(fieldInfo : PdfAutomaticFieldInfo) : number {
        return this.automaticFields.push(fieldInfo);
    }
}