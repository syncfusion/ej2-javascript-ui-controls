/**
 * `IPdfPrimitive.ts` interface for EJ2-PDF
 * Defines the basic interace of the various Primitive.
 * @private
 */
import { ObjectStatus } from './../implementation/input-output/enum';
import { PdfCrossTable } from './../implementation/input-output/pdf-cross-table';
import { IPdfWriter } from './i-pdf-writer';
export interface IPdfPrimitive {
    /**
     * Specifies the `status` of the IPdfPrimitive. Status is registered if it has a reference or else none.
     * @private
     */
    status : ObjectStatus;
    /**
     * Gets or sets a value indicating whether this document `is saving` or not.
     * @private
     */
    isSaving : boolean;
    /**
     * Gets or sets the `index` value of the specified object.
     * @private
     */
    objectCollectionIndex : number;
    /**
     * Stores the `cloned object` for future use.
     * @private
     */
    clonedObject : IPdfPrimitive;
    /**
     * `Saves` the object using the specified writer.
     * @private
     */
    save(writer : IPdfWriter) : void;
    /**
     * Creates a `deep copy` of the IPdfPrimitive object.
     * @private
     */
    clone(crossTable : PdfCrossTable) : IPdfPrimitive;
    /**
     * Gets or sets the `position` of the object.
     * @private
     */
    position : number;
}