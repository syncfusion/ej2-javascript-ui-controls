/**
 * PdfMainObjectCollection.ts class for EJ2-PDF
 */
import { Dictionary } from './../collections/dictionary';
import { PdfReference } from './../primitives/pdf-reference';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { ObjectStatus } from './enum';
/**
 * The collection of all `objects` within a PDF document.
 * @private
 */
export class PdfMainObjectCollection {
    //Fields
    /**
     * The collection of the `indirect objects`.
     * @default []
     * @private
     */
    public objectCollections : ObjectInfo[] = [];
    /**
     * The collection of the `Indirect objects`.
     * @default new Dictionary<number, ObjectInfo>()
     * @private
     */
    public mainObjectCollection : Dictionary<number, ObjectInfo> = new Dictionary<number, ObjectInfo>();
    /**
     * The collection of `primitive objects`.
     * @private
     */
    public primitiveObjectCollection : Dictionary<IPdfPrimitive, number> = new Dictionary<IPdfPrimitive, number>();
    /**
     * Holds the `index of the object`.
     * @private
     */
    private index : number;
    /**
     * Stores the value of `IsNew`.
     * @private
     */
    private isNew : boolean;
    //Properties
    /**
     * Gets the `count`.
     * @private
     */
    public get count() : number {
        return this.objectCollections.length;
    }
    /**
     * Gets the value of `ObjectInfo` from object collection.
     * @private
     */
    public items(index : number) : ObjectInfo {
        return this.objectCollections[index];
    }
    //Methods
    /**
     * Specifies the value of `IsNew`.
     * @private
     */
    public get outIsNew() : boolean {
        return this.isNew;
    }
    /**
     * `Adds` the specified element.
     * @private
     */
    public add(element : IPdfPrimitive) : void {
        let objInfo : ObjectInfo = new ObjectInfo(element);
        this.objectCollections.push(objInfo);
        if (!this.primitiveObjectCollection.containsKey(element)) {
            this.primitiveObjectCollection.setValue(element, this.objectCollections.length - 1);
        }
        element.position = this.index = this.objectCollections.length - 1;
        element.status = ObjectStatus.Registered;
    }
    /**
     * `Looks` through the collection for the object specified.
     * @private
     */
    private lookFor(obj : IPdfPrimitive) : number {
        let index : number = -1;
        if (obj.position !== -1) {
            return obj.position;
        }
        if (this.primitiveObjectCollection.containsKey(obj) && this.count === this.primitiveObjectCollection.size()) {
            index = <number>this.primitiveObjectCollection.getValue(obj);
        } else {
            for (let i : number = this.count - 1; i >= 0; i--) {
                let oi : ObjectInfo = this.objectCollections[i];
                if (oi.object === obj) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    /**
     * Gets the `reference of the object`.
     * @private
     */
    public getReference(index : IPdfPrimitive, isNew : boolean) : {reference : PdfReference, wasNew : boolean} {
        this.index = this.lookFor(<IPdfPrimitive>index);
        let reference : PdfReference;
        this.isNew = false;
        let oi : ObjectInfo = this.objectCollections[this.index];
        reference = oi.reference;
        let obj : {reference : PdfReference, wasNew : boolean} = {reference : reference, wasNew : isNew};
        return obj;
    }
    /**
     * Tries to set the `reference to the object`.
     * @private
     */
    public trySetReference(obj : IPdfPrimitive, reference : PdfReference, found : boolean) : boolean {
        let result : boolean = true;
        found = true;
        this.index = this.lookFor(obj);
        let oi : ObjectInfo = this.objectCollections[this.index];
        oi.setReference(reference);
        return result;
    }
    public destroy() : void {
        for (let obj of this.objectCollections) {
            if (obj !== undefined) {
                obj.pdfObject.position = -1;
                obj.pdfObject.isSaving = undefined;
                obj.pdfObject.objectCollectionIndex = undefined;
                obj.pdfObject.position = undefined;
            }
        }
        this.objectCollections = [];
        this.mainObjectCollection = new Dictionary<number, ObjectInfo>();
        this.primitiveObjectCollection = new Dictionary<IPdfPrimitive, number>();
    }
}
export class ObjectInfo {
    //Fields
    /**
     * The `PDF object`.
     * @private
     */
    public pdfObject : IPdfPrimitive;
    /**
     * `Object number and generation number` of the object.
     * @private
     */
    private pdfReference : PdfReference;
    /**
     * Initializes a new instance of the `ObjectInfo` class.
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `ObjectInfo` class.
     * @private
     */
    constructor(obj : IPdfPrimitive)
    /**
     * Initializes a new instance of the `ObjectInfo` class.
     * @private
     */
    constructor(obj : IPdfPrimitive, reference : PdfReference)
    constructor(obj? : IPdfPrimitive, reference? : PdfReference) {
        this.pdfObject = obj;
        this.pdfReference = reference;
    }
    //Properties
    /**
     * Gets the `object`.
     * @private
     */
    public get object() : IPdfPrimitive {
        return this.pdfObject;
    }
    public set object(value : IPdfPrimitive) {
        this.pdfObject = value;
    }
    /**
     * Gets the `reference`.
     * @private
     */
    public get reference() : PdfReference {
        return this.pdfReference;
    }
    /**
     * Sets the `reference`.
     * @private
     */
    public setReference(reference : PdfReference) : void {
        this.pdfReference = reference;
    }
}