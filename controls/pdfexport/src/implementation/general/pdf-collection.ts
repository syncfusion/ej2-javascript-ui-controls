/**
 * PdfCollection.ts class for EJ2-PDF
 * The class used to handle the collection of PdF objects.
 */
export class PdfCollection {
    // Fields
    /**
     * Stores the `objects` as array.
     * @private
     */
    private collection : Object[];
    // Constructors
    /**
     * Initializes a new instance of the `Collection` class.
     * @private
     */
    public constructor() {
        //
    }
    // Properties
    /**
     * Gets the `Count` of stored objects.
     * @private
     */
    public get count() : number {
        if (typeof this.collection === 'undefined') {
            this.collection = [];
        }
        return this.collection.length;
    }
    /**
     * Gets the `list` of stored objects.
     * @private
     */
    public get list() : Object[] {
        if (typeof this.collection === 'undefined') {
            this.collection = [];
        }
        return this.collection;
    }
}