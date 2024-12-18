/**
 * PdfReference.ts and PdfReferenceHolder.ts class for EJ2-PDF
 */
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { ObjectStatus } from './../input-output/enum';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
import { PdfDocument } from './../document/pdf-document';
import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
import { PdfMainObjectCollection } from './../input-output/pdf-main-object-collection';
import { PdfStream } from './../primitives/pdf-stream';
import { PdfArray } from './../primitives/pdf-array';
import { PdfNumber } from './../primitives/pdf-number';
import { PdfName } from './../primitives/pdf-name';
import { PdfDictionary } from './../primitives/pdf-dictionary';
import { PdfString } from './../primitives/pdf-string';
/**
 * `PdfReference` class is used to perform reference related primitive operations.
 * @private
 */
export class PdfReference implements IPdfPrimitive {
    /**
     * Indicates if the object is currently in `saving stat`e or not.
     * @private
     */
    private isSaving3 : boolean;
    /**
     * Shows the type of object `status` whether it is object registered or other status;
     * @private
     */
    private status3 : ObjectStatus;
    /**
     * Holds the `index` number of the object.
     * @default -1
     * @private
     */
    private index3 : number = -1;
    /**
     * Internal variable to store the `position`.
     * @default -1
     * @private
     */
    private position3 : number = -1;
    /**
     * Holds the `object number`.
     * @default 0
     * @private
     */
    public readonly objNumber : number = 0;
    /**
     * Holds the `generation number` of the object.
     * @default 0
     * @private
     */
    public readonly genNumber : number = 0;
    //Property
    /**
     * Gets or sets the `Status` of the specified object.
     * @private
     */
    public get status() : ObjectStatus {
        return this.status3;
    }
    public set status(value : ObjectStatus) {
        this.status3 = value;
    }
    /**
     * Gets or sets a value indicating whether this document `is saving` or not.
     * @private
     */
    public get isSaving() : boolean {
        return this.isSaving3;
    }
    public set isSaving(value : boolean) {
        this.isSaving3 = value;
    }
    /**
     * Gets or sets the `index` value of the specified object.
     * @private
     */
    public get objectCollectionIndex() : number {
        return this.index3;
    }
    public set objectCollectionIndex(value : number) {
        this.index3 = value;
    }
    /**
     * Gets or sets the `position` of the object.
     * @private
     */
    public get position() : number {
        return this.position3;
    }
    public set position(value : number) {
        this.position3 = value;
    }
    /**
     * Returns `cloned object`.
     * @private
     */
    public get clonedObject() : IPdfPrimitive {
        let returnObject3 : IPdfPrimitive = null;
        return returnObject3;
    }
    //IPdfPrimitives methods
    /**
     * `Saves` the object.
     * @private
     */
    public save(writer : IPdfWriter) : void {
        writer.write(this.toString());
    }
    /**
     * Initialize the `PdfReference` class.
     * @private
     */
    public constructor(objNumber : number, genNumber : number)
    /**
     * Initialize the `PdfReference` class.
     * @private
     */
    public constructor(objNumber : string, genNumber : string)
    public constructor(objNumber : number|string, genNumber : number|string) {
        if (typeof objNumber === 'number' && typeof genNumber === 'number') {
            this.objNumber = objNumber;
            this.genNumber = genNumber;
        // } else if (typeof objNum === 'string' && typeof genNum === 'string') {
        } else {
            this.objNumber = Number(objNumber);
            this.genNumber = Number(genNumber);
        }
    }
    /**
     * Returns a `string` representing the object.
     * @private
     */
    public toString() : string {
        return this.objNumber.toString() + ' ' + this.genNumber.toString() + ' R';
    }
    /**
     * Creates a `deep copy` of the IPdfPrimitive object.
     * @private
     */
    public clone(crossTable : PdfCrossTable) : IPdfPrimitive {
        return null;
    }
}
/**
 * `PdfReferenceHolder` class is used to perform reference holder related primitive operations.
 * @private
 */
export class PdfReferenceHolder implements  IPdfPrimitive, IPdfWrapper {
    /**
     * Indicates if the object is currently in `saving state or not`.
     * @private
     */
    private isSaving4 : boolean;
    /**
     * Shows the type of object `status` whether it is object registered or other status;
     * @private
     */
    private status4 : ObjectStatus;
    /**
     * Holds the `index` number of the object.
     * @default -1
     * @private
     */
    private index4 : number = -1;
    /**
     * Internal variable to store the `position`.
     * @default -1
     * @private
     */
    private position4 : number= -1;
    /**
     * The `object` which the reference is of.
     * @private
     */
    private primitiveObject : IPdfPrimitive;
    /**
     * The `reference` to the object, which was read from the PDF document.
     * @private
     */
    private pdfReference : PdfReference;
    /**
     * The `cross-reference table`, which the object is within.
     * @private
     */
    private crossTable : PdfCrossTable;
    /**
     * The `index` of the object within the object collection.
     * @default -1
     * @private
     */
    private objectIndex : number = -1;
    /**
     * @hidden
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    //Properties
    /**
     * Gets or sets the `Status` of the specified object.
     * @private
     */
    public get status() : ObjectStatus {
        return this.status4;
    }
    public set status(value : ObjectStatus) {
        this.status4 = value;
    }
    /**
     * Gets or sets a value indicating whether this document `is saving` or not.
     * @private
     */
    public get isSaving() : boolean {
        return this.isSaving4;
    }
    public set isSaving(value : boolean) {
        this.isSaving4 = value;
    }
    /**
     * Gets or sets the `index` value of the specified object.
     * @private
     */
    public get objectCollectionIndex() : number {
        return this.index4;
    }
    public set objectCollectionIndex(value : number) {
        this.index4 = value;
    }
    /**
     * Gets or sets the `position` of the object.
     * @private
     */
    public get position() : number {
        return this.position4;
    }
    public set position(value : number) {
        this.position4 = value;
    }
    /**
     * Returns `cloned object`.
     * @private
     */
    public get clonedObject() : IPdfPrimitive {
        return null;
    }
    /**
     * Gets the `object` the reference is of.
     * @private
     */
    public get object() : IPdfPrimitive {
        // if ((this.reference != null) || (this.object == null)) {
        //     this.object = this.GetterObject();
        // }
        return this.primitiveObject;
    }
    /**
     * Gets the `reference`.
     * @private
     */
    public get reference() : PdfReference {
        return this.pdfReference;
    }
    /**
     * Gets the `index` of the object.
     * @private
     */
    public get index() : number {
        // let items : PdfMainObjectCollection = this.crossTable.PdfObjects;
        // this.objectIndex = items.GetObjectIndex(this.reference);
        // if (this.objectIndex < 0) {
        //     let obj : IPdfPrimitive = this.crossTable.GetObject(this.reference);
        //     this.objectIndex = items.Count - 1;
        // }
        return this.objectIndex;
    }
    /**
     * Gets the `element`.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.primitiveObject;
    }
    //constructors
    /**
     * Initializes the `PdfReferenceHolder` class instance with an object.
     * @private
     */
    public constructor(obj1 : IPdfWrapper)
    /**
     * Initializes the `PdfReferenceHolder` class instance with an object.
     * @private
     */
    public constructor(obj1 : IPdfPrimitive)
    /**
     * Initializes the `PdfReferenceHolder` class instance with an object.
     * @private
     */
    public constructor(obj1 : PdfReference, obj2 : PdfCrossTable)
    public constructor(obj1 : IPdfWrapper|IPdfPrimitive|PdfReference, obj2? : PdfCrossTable) {
        // if (typeof obj2 === 'undefined') {
            this.initialize(obj1);
        // }
        // else {
        //     if (obj2 === null) {
        //         throw new Error('ArgumentNullException : crossTable');
        //     }
        //     if (obj1 === null) {
        //         throw new Error('ArgumentNullException : reference');
        //     }
        //     this.crossTable = obj2;
        //     let tempObj1 : PdfReference = <PdfReference>obj1;
        //     this.reference = tempObj1;
        // }
    }
    private initialize(obj1 : IPdfPrimitive | IPdfWrapper | PdfReference) : void {
        if ( obj1 instanceof PdfArray
            || obj1 instanceof PdfDictionary
            || obj1 instanceof PdfName
            || obj1 instanceof PdfNumber
            || obj1 instanceof PdfStream
            || obj1 instanceof PdfReference
            || obj1 instanceof PdfString ) {
            this.primitiveObject = <IPdfPrimitive>obj1;
        } else {
            let tempObj : IPdfWrapper = obj1 as IPdfWrapper;
            this.initialize(tempObj.element);
        }
    }
    /**
     * `Writes` a reference into a PDF document.
     * @private
     */
    public save(writer : IPdfWriter) : void {
        // if (writer == null) {
        //     throw new Error('ArgumentNullException : writer');
        // }
        let position : number = writer.position;
        let cTable : PdfCrossTable = writer.document.crossTable;
        // if (cTable.Document instanceof PdfDocument) {
        this.object.isSaving = true;
        // }
        let reference : PdfReference = null;
        // if (writer.Document.FileStructure.IncrementalUpdate === true && writer.Document.isStreamCopied === true) {
        //     if (this.reference === null) {
        //         reference = cTable.GetReference(this.Object);
        //     } else {
        //         reference = this.reference;
        //     }
        // } else {
        //     reference = cTable.GetReference(this.Object);
        // }
        // if (!(writer.Document.FileStructure.IncrementalUpdate === true && writer.Document.isStreamCopied === true)) {
        reference = cTable.getReference(this.object);
        // }
        // if (writer.Position !== position) {
        //     writer.Position = position;
        // }
        reference.save(writer);
    }
    /**
     * Creates a `copy of PdfReferenceHolder`.
     * @private
     */
    public clone(crossTable : PdfCrossTable) : IPdfPrimitive {
        let refHolder : PdfReferenceHolder = null;
        let temp : IPdfPrimitive = null;
        let refNum : string = '';
        let reference : PdfReference = null;
        // Restricts addition of same object multiple time.
        /* if (this.Reference != null && this.crossTable != null && this.crossTable.PageCorrespondance.containsKey(this.Reference)) {
            refHolder = new PdfReferenceHolder(this.crossTable.PageCorrespondance.getValue(this.Reference) as PdfReference, crossTable);
            return refHolder;
        }
        if (Object instanceof PdfNumber) {
            return new PdfNumber((Object as PdfNumber).IntValue);
        }
        */
        // if (Object instanceof PdfDictionary) {
        //     // Meaning the referenced page is not available for import.
        //     let type : PdfName = new PdfName(this.dictionaryProperties.type);
        //     let dict : PdfDictionary = Object as PdfDictionary;
        //     if (dict.ContainsKey(type)) {
        //         let pageName : PdfName = dict.Items.getValue(type.Value) as PdfName;
        //         if (pageName !== null) {
        //             if (pageName.Value === 'Page') {
        //                 return new PdfNull();
        //             }
        //         }
        //     }
        // }
        /* if (Object instanceof PdfName) {
            return new PdfName ((Object as PdfName ).Value);
        }
        */
        // Resolves circular references.
        // if (crossTable.PrevReference !== null && (crossTable.PrevReference.indexOf(this.Reference) !== -1)) {
        //     let obj : IPdfPrimitive = this.crossTable.GetObject(this.Reference).ClonedObject;
        //     if (obj !== null) {
        //         reference = crossTable.GetReference(obj);
        //         return new PdfReferenceHolder(reference, crossTable);
        //     } else {
        //         return new PdfNull();
        //     }
        // }
        /*if (this.Reference !== null) {
            crossTable.PrevReference.push(this.Reference);
        }
        reference = crossTable.GetReference(temp);
        refHolder = new PdfReferenceHolder(reference, crossTable);
        return refHolder;
        */
        return null;
    }
    //method
    // private GetterObject() : IPdfPrimitive {
    //     let obj : IPdfPrimitive = null;
    //     if (this.reference !== null) {
    //         if (this.Index >= 0) {
    //             obj = this.crossTable.PdfObjects.GetObject(this.reference);
    //         }
    //     } else if (this.object !== null) {
    //         obj = this.object;
    //     }
    //     return obj;
    // }
}