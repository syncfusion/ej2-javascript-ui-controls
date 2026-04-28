/**
 * `IPdfChangable.ts` interface for EJ2-PDF
 * Interface of the objects that support Changable of their internals.
 * @private
 */
export interface IPdfChangable {
    /**
     * Gets a value indicating whether this 'IPdfChangable' `is changed`.
     * @private
     */
    changed() : boolean;
    /**
     * `Freezes the changes`.
     * @private
     */
    freezeChanges(freezer : Object) : void;
}