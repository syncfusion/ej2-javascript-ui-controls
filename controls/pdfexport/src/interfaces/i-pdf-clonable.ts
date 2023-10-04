/**
 * `ICloneable.ts` interface for EJ2-PDF
 * Defines the basic interace of the various Cloneable.
 * @private
 */
export interface ICloneable {
    /**
     * Creates a `deep copy` of the IPdfPrimitive object.
     * @private
     */
    clone() : ICloneable;
}