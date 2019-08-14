/**
 * PdfCrossTable.ts class for EJ2-PDF
 */
import { PdfDocument } from './../document/pdf-document';
import { PdfDocumentBase } from './../document/pdf-document-base';
import { ObjectStatus } from './../input-output/enum';
import { PdfWriter } from './pdf-writer';
import { PdfDictionary } from './../primitives/pdf-dictionary';
import { DictionaryProperties } from './pdf-dictionary-properties';
import { Operators } from './pdf-operators';
import { PdfMainObjectCollection, ObjectInfo } from './pdf-main-object-collection';
import { Dictionary } from './../collections/dictionary';
import { PdfReference, PdfReferenceHolder } from './../primitives/pdf-reference';
import { ObjectType } from './cross-table';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { PdfStream } from './../primitives/pdf-stream';
import { PdfNumber } from './../primitives/pdf-number';
import { PdfCatalog } from './../document/pdf-catalog';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
/**
 * `PdfCrossTable` is responsible for intermediate level parsing
 * and savingof a PDF document.
 * @private
 */
export class PdfCrossTable {
    /**
     * Parent `Document`.
     * @private
     */
    private pdfDocument : PdfDocumentBase;
    /**
     * Internal variable to store primtive objects of `main object collection`.
     * @private
     */
    private items : PdfMainObjectCollection;
    /**
     * The `mapped references`.
     * @private
     */
    private mappedReferences : Dictionary<PdfReference, PdfReference>;
    /**
     * The modified `objects` that should be saved.
     * @private
     */
    private objects : Dictionary<number, RegisteredObject> = new Dictionary<number, RegisteredObject>();
    /**
     * The `trailer` for a new document.
     * @private
     */
    private internalTrailer : IPdfPrimitive;
    /**
     * Internal variable to store if document `is being merged`.
     * @private
     */
    private merging : boolean;
    /**
     * `Flag` that forces an object to be 'a new'.
     * @private
     */
    private bForceNew : boolean;
    /**
     * Holds `maximal generation number` or offset to object.
     * @default 0
     * @private
     */
    private maxGenNumIndex : number = 0;
    /**
     * The `number of the objects`.
     * @default 0
     * @private
     */
    private objectCount : number = 0;
    /**
     * Internal variable for accessing fields from `DictionryProperties` class.
     * @default new PdfDictionaryProperties()
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    //Properties
    /**
     * Gets or sets if the document `is merged`.
     * @private
     */
    public get isMerging() : boolean {
        return this.merging;
    }
    public set isMerging(value : boolean) {
        this.merging = value;
    }
    /**
     * Gets the `trailer`.
     * @private
     */
    public get trailer() : PdfDictionary {
        if (this.internalTrailer == null) {
            this.internalTrailer = new PdfStream();
        }
        return <PdfDictionary>this.internalTrailer;
    }
    /**
     * Gets or sets the main `PdfDocument` class instance.
     * @private
     */
    public get document() : PdfDocumentBase {
        return this.pdfDocument;
    }
    public set document(value : PdfDocumentBase) {
        this.pdfDocument = value;
        this.items = this.pdfDocument.pdfObjects;
    }
    /**
     * Gets the catched `PDF object` main collection.
     * @private
     */
    public get pdfObjects() : PdfMainObjectCollection {
        return this.items;
    }
    /**
     * Gets the `object collection`.
     * @private
     */
    private get objectCollection() : PdfMainObjectCollection {
        return this.pdfDocument.pdfObjects;
    }
    /**
     * Gets or sets the `number of the objects` within the document.
     * @private
     */
    public get count() : number {
        return this.objectCount;
    }
    public set count(value : number) {
        this.objectCount = value;
    }
    /**
     * Returns `next available object number`.
     * @private
     */
    public get nextObjNumber() : number {
        this.count = this.count + 1;
        return this.count;
    }
    //Public methods
    /**
     * `Saves` the cross-reference table into the stream and return it as Blob.
     * @private
     */
    public save(writer : PdfWriter) : Blob
    /**
     * `Saves` the cross-reference table into the stream.
     * @private
     */
    public save(writer : PdfWriter, filename : string) : void
    public save(writer : PdfWriter, filename ?: string) : void | Blob {
        this.saveHead(writer);
        let state : boolean = false;
        this.mappedReferences = null;
        this.objects.clear();
        this.markTrailerReferences();
        this.saveObjects(writer);
        let saveCount : number = this.count;
        let xrefPos : number = writer.position;
        this.registerObject(0, new PdfReference(0, -1), true);
        let prevXRef : number = 0;
        writer.write(Operators.xref);
        writer.write(Operators.newLine);
        this.saveSections(writer);
        this.saveTrailer(writer, this.count, prevXRef);
        this.saveTheEndess(writer, xrefPos);
        this.count = saveCount;
        for (let i : number = 0; i < this.objectCollection.count; ++i) {
            let oi : ObjectInfo = this.objectCollection.items(i);
            oi.object.isSaving = false;
        }
        if (typeof filename === 'undefined') {
            return writer.stream.buffer;
        } else {
            writer.stream.save(filename);
        }
    }
    /**
     * `Saves the endess` of the file.
     * @private
     */
    private saveTheEndess(writer : PdfWriter, xrefPos : number) : void {
        writer.write(Operators.newLine + Operators.startxref + Operators.newLine);
        writer.write(xrefPos.toString() + Operators.newLine);
        writer.write(Operators.eof + Operators.newLine);
    }
    /**
     * `Saves the new trailer` dictionary.
     * @private
     */
    private saveTrailer(writer : PdfWriter, count : number, prevXRef : number) : void {
        writer.write(Operators.trailer + Operators.newLine);
        // Save the dictionary.
        let trailer : PdfDictionary = this.trailer;
        trailer.items.setValue(this.dictionaryProperties.size, new PdfNumber(this.objectCount + 1));
        trailer = new PdfDictionary(trailer); // Make it real dictionary.
        trailer.setEncrypt(false);
        trailer.save(writer);
    }
    /**
     * `Saves the xref section`.
     * @private
     */
    private saveSections(writer : PdfWriter) : void {
        let objectNum : number = 0;
        let count : number = 0;
        do {
            count = this.prepareSubsection(objectNum);
            this.saveSubsection(writer, objectNum, count);
            objectNum += count;
        } while (count !== 0);
    }
    /**
     * `Saves a subsection`.
     * @private
     */
    private saveSubsection(writer : PdfWriter, objectNum : number, count : number) : void {
        if (count <= 0 || objectNum >= this.count) {
            return;
        }
        let subsectionHead : string = '{0} {1}{2}';
        writer.write(objectNum + ' ' + (count + 1) + Operators.newLine);
        for (let i : number = objectNum; i <= objectNum + count; ++i) {
            let obj : RegisteredObject = this.objects.getValue(i) as RegisteredObject;
            let str : string = '';
            if ( obj.type === ObjectType.Free ) {
                str = this.getItem(obj.offset, 65535, true);
            } else {
                str = this.getItem(obj.offset, obj.generation, false);
            }
            writer.write(str);
        }
    }
    /**
     * Generates string for `xref table item`.
     * @private
     */
    public getItem(offset : number, genNumber : number, isFree : boolean) : string {
        let returnString : string = '';
        let addOffsetLength : number = 10 - offset.toString().length;
        if ( genNumber <= 0 ) {
            genNumber = 0;
        }
        let addGenNumberLength : number = (5 - genNumber.toString().length) <= 0 ? 0 : (5 - genNumber.toString().length);
        for (let index : number = 0; index < addOffsetLength; index++) {
            returnString = returnString + '0';
        }
        returnString = returnString + offset.toString() + ' ';
        for (let index : number = 0; index < addGenNumberLength; index++) {
            returnString = returnString + '0';
        }
        returnString = returnString + genNumber.toString() + ' ';
        returnString = returnString + ((isFree) ? Operators.f : Operators.n) + Operators.newLine;
        return returnString;
    }
    /**
     * `Prepares a subsection` of the current section within the cross-reference table.
     * @private
     */
    private prepareSubsection(objectNum : number) : number {
        let count : number = 0;
        let i : number;
        let total : number = this.count;
        for (let k : number = 0; k < this.document.pdfObjects.count; k++) {
            let reference : PdfReference = this.document.pdfObjects.items(k).reference;
            let refString : string = reference.toString();
            let refArray : string[] = refString.split(' ');
        }
        if (objectNum >= total) {
            return count;
        }
        // search for first changed indirect object.
        for (i = objectNum; i < total; ++i) {
            break;
        }
        objectNum = i;
        // look up for all indirect objects in one subsection.
        for (; i < total; ++i) {
            ++count;
        }
        return count;
    }
    /**
     * `Marks the trailer references` being saved.
     * @private
     */
    private markTrailerReferences() : void {
        let tempArray : IPdfPrimitive[];
        let keys : string[] = this.trailer.items.keys();
        let values : IPdfPrimitive[] = this.trailer.items.values();
    }
    /**
     * `Saves the head`.
     * @private
     */
    private saveHead(writer : PdfWriter) : void {
        let version : string = this.generateFileVersion(writer.document);
        writer.write('%PDF-' + version);
        writer.write(Operators.newLine);
    }
    /**
     * Generates the `version` of the file.
     * @private
     */
    private generateFileVersion(document : PdfDocumentBase) : string {
        let iVersion : number = 4;
        let version : string = '1.' + iVersion.toString();
        return version;
    }
    /**
     * Retrieves the `reference` of the object given.
     * @private
     */
    public getReference(obj : IPdfPrimitive) : PdfReference
    /**
     * Retrieves the `reference` of the object given.
     * @private
     */
    public getReference(obj : IPdfPrimitive, bNew : boolean) : PdfReference
    public getReference(obj : IPdfPrimitive, bNew? : boolean) : PdfReference {
        if (typeof bNew === 'undefined') {
            let wasNew : boolean = false;
            return this.getReference(obj, wasNew);
        } else {
            //code splitted for reducing lines of code exceeds 100.
            return this.getSubReference(obj, bNew);
        }
    }
    /**
     * Retrieves the `reference` of the object given.
     * @private
     */
    private getSubReference(obj : IPdfPrimitive, bNew : boolean) : PdfReference {
        let isNew : boolean = false;
        let wasNew : boolean;
        let reference : PdfReference = null;
        // if (obj.IsSaving) {
        if (this.items.count > 0 && obj.objectCollectionIndex > 0 && this.items.count > obj.objectCollectionIndex - 1) {
            let tempObj : {reference : PdfReference, wasNew : boolean} = this.document.pdfObjects.getReference(obj, wasNew);
            reference = tempObj.reference;
            wasNew = tempObj.wasNew;
        }
        if (reference == null) {
            if (obj.status === ObjectStatus.Registered) {
                wasNew = false;
            } else {
                wasNew = true;
            }
        } else {
            wasNew = false;
        }
        // need to add mapped reference code
        if (reference == null) {
            let objnumber : number = this.nextObjNumber;
            reference = new PdfReference(objnumber, 0);
            let found : boolean;
            if (wasNew) {
                this.document.pdfObjects.add(obj);
                this.document.pdfObjects.trySetReference(obj, reference, found);
                let tempIndex : number = this.document.pdfObjects.count - 1;
                let tempkey : number = this.document.pdfObjects.objectCollections[tempIndex].reference.objNumber;
                let tempvalue : ObjectInfo = this.document.pdfObjects.objectCollections[this.document.pdfObjects.count - 1];
                this.document.pdfObjects.mainObjectCollection.setValue(tempkey, tempvalue);
                obj.position = -1;
            } else {
                this.document.pdfObjects.trySetReference(obj, reference, found);
            }
            obj.objectCollectionIndex = <number>reference.objNumber;
            obj.status = ObjectStatus.None;
            isNew = true;
        }
        bNew = isNew || this.bForceNew;
        return reference;
    }
    /**
     * `Saves all objects` in the collection.
     * @private
     */
    private saveObjects(writer : PdfWriter) : void {
        let objectCollection : PdfMainObjectCollection = this.objectCollection;
        for (let i : number = 0; i < objectCollection.count; ++i) {
            let oi : ObjectInfo = objectCollection.items(i);
            let obj : IPdfPrimitive = oi.object;
            obj.isSaving = true;
            this.saveIndirectObject(obj, writer);
        }
    }
    /**
     * `Saves indirect object`.
     * @private
     */
    public saveIndirectObject(obj : IPdfPrimitive, writer : PdfWriter) : void {
        let reference : PdfReference = this.getReference(obj);
        if (obj instanceof PdfCatalog) {
            this.trailer.items.setValue(this.dictionaryProperties.root, reference);
        }
        // NOTE :  This is needed for correct string objects encryption.
        this.pdfDocument.currentSavingObj = reference;
        let tempArchive : boolean = false;
        tempArchive = (<PdfDictionary>obj).getArchive();
        let allowedType : boolean = !((obj instanceof PdfStream) || !tempArchive || (obj instanceof PdfCatalog));
        let sigFlag : boolean = false;
        this.registerObject(writer.position, reference);
        this.doSaveObject(obj, reference, writer);
    }
    /**
     * Performs `real saving` of the save object.
     * @private
     */
    private doSaveObject(obj : IPdfPrimitive, reference : PdfReference, writer : PdfWriter) : void {
        let correctPosition : number = writer.length;
        writer.write(reference.objNumber.toString());
        writer.write(Operators.whiteSpace);
        writer.write(reference.genNumber.toString());
        writer.write(Operators.whiteSpace);
        writer.write(Operators.obj);
        writer.write(Operators.newLine);
        obj.save(writer);
        let stream : StreamWriter = writer.stream;
        writer.write(Operators.endObj);
        writer.write(Operators.newLine);
    }
    /**
     * `Registers` an archived object.
     * @private
     */
    public registerObject(offset : number, reference : PdfReference) : void
    /**
     * `Registers` the object in the cross reference table.
     * @private
     */
    public registerObject(offset : number, reference : PdfReference, free : boolean) : void
    public registerObject(offset? : number, reference? : PdfReference, free? : boolean) : void {
        if (typeof free === 'boolean') {
            // Register the object by its number.
            this.objects.setValue(reference.objNumber, new RegisteredObject(<number>offset, reference, free));
            this.maxGenNumIndex = Math.max(this.maxGenNumIndex, reference.genNumber);
        } else if (typeof free === 'undefined') {
            // Register the object by its number.
            this.objects.setValue(reference.objNumber, new RegisteredObject(offset, reference));
            this.maxGenNumIndex = Math.max(this.maxGenNumIndex, reference.genNumber);
        }
    }
    /**
     * `Dereferences` the specified primitive object.
     * @private
     */
    public static dereference(obj : IPdfPrimitive) : IPdfPrimitive {
        let rh : PdfReferenceHolder = obj as PdfReferenceHolder;
        if (rh != null) {
            obj = rh.object;
        }
        return obj;
    }
}
export class RegisteredObject {
    /**
     * The `object number` of the indirect object.
     * @private
     */
    private object : number;
    /**
     * The `generation number` of the indirect object.
     * @private
     */
    public generation : number;
    /**
     * The `offset` of the indirect object within the file.
     * @private
     */
    private offsetNumber : number;
    /**
     * Shows if the object `is free`.
     * @private
     */
    public type : ObjectType;
    /**
     * Holds the current `cross-reference` table.
     * @private
     */
    private xrefTable : PdfCrossTable;
    //Properties
    /**
     * Gets the `object number`.
     * @private
     */
    public get objectNumber() : number {
        return this.object;
    }
    /**
     * Gets the `offset`.
     * @private
     */
    public get offset() : number {
        let result : number;
        result = this.offsetNumber;
        return result;
    }
    /**
     * Initialize the `structure` with the proper values.
     * @private
     */
    public constructor(offset : number, reference : PdfReference)
    /**
     * Initialize the `structure` with the proper values.
     * @private
     */
    public constructor(offset : number, reference : PdfReference, free : boolean)
    public constructor(offset : number|PdfCrossTable, reference : PdfReference, free? : boolean|PdfReference) {
        let tempOffset : number = <number>offset;
        this.offsetNumber = tempOffset;
        let tempReference : PdfReference = <PdfReference>reference;
        this.generation = tempReference.genNumber;
        this.object = tempReference.objNumber;
        if (typeof free === 'undefined') {
            this.type = ObjectType.Normal;
        } else {
            this.type = ObjectType.Free;
        }
    }
}