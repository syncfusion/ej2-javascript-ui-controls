/**
 * PdfArray.ts class for EJ2-PDF
 */
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { ObjectStatus } from './../input-output/enum';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
import { PdfNumber } from './pdf-number';
import { RectangleF } from './../drawing/pdf-drawing';
import { Operators } from './../input-output/pdf-operators';
import { PdfName } from './pdf-name';
/**
 * `PdfArray` class is used to perform array related primitive operations.
 * @private
 */
export class PdfArray implements IPdfPrimitive {
    //Fields
    /**
     * `startMark` - '['
     * @private
     */
    public startMark : string = '[';
    /**
     * `endMark` - ']'.
     * @private
     */
    public endMark : string = ']';
    /**
     * The `elements` of the PDF array.
     * @private
     */
    private internalElements : IPdfPrimitive[];
    /**
     * Indicates if the array `was changed`.
     * @private
     */
    private bChanged : boolean;
    /**
     * Shows the type of object `status` whether it is object registered or other status;
     * @private
     */
    private status9 : ObjectStatus;
    /**
     * Indicates if the object is currently in `saving state` or not.
     * @private
     */
    private isSaving9 : boolean;
    /**
     * Holds the `index` number of the object.
     * @private
     */
    private index9 : number;
    /**
     * Internal variable to store the `position`.
     * @default -1
     * @private
     */
    private position9 : number = -1;
    /**
     * Internal variable to hold `PdfCrossTable` reference.
     * @private
     */
    private pdfCrossTable : PdfCrossTable;
    /**
     * Internal variable to hold `cloned object`.
     * @default null
     * @private
     */
    private clonedObject9 : PdfArray = null;
    /**
     * Represents the Font dictionary.
     * @hidden
     * @private
     */
    public isFont : boolean = false;
    //property
    /**
     * Gets the `IPdfSavable` at the specified index.
     * @private
     */
    public items(index : number) : IPdfPrimitive {
        // if (index < 0 || index >= this.Count) {
        //     throw new Error('ArgumentOutOfRangeException : index, The index can"t be less then zero or greater then Count.');
        // }
        return this.internalElements[index] as IPdfPrimitive;
    }
    /**
     * Gets the `count`.
     * @private
     */
    public get count() : number {
        return this.internalElements.length;
    }
    /**
     * Gets or sets the `Status` of the specified object.
     * @private
     */
    public get status() : ObjectStatus {
        return this.status9;
    }
    public set status(value : ObjectStatus) {
        this.status9 = value;
    }
    /**
     * Gets or sets a value indicating whether this document `is saving` or not.
     * @private
     */
    public get isSaving() : boolean {
        return this.isSaving9;
    }
    public set isSaving(value : boolean) {
        this.isSaving9 = value;
    }
    /**
     * Returns `cloned object`.
     * @private
     */
    public get clonedObject() : IPdfPrimitive {
        return this.clonedObject9;
    }
    /**
     * Gets or sets the `position` of the object.
     * @private
     */
    public get position() : number {
        return this.position9;
    }
    public set position(value : number) {
        this.position9 = value;
    }
    /**
     * Gets or sets the `index` value of the specified object.
     * @private
     */
    public get objectCollectionIndex() : number {
        return this.index9;
    }
    public set objectCollectionIndex(value : number) {
        this.index9 = value;
    }
    /**
     * Returns `PdfCrossTable` associated with the object.
     * @private
     */
    public get CrossTable() : PdfCrossTable {
        return this.pdfCrossTable;
    }
    /**
     * Gets the `elements` of the Pdf Array.
     * @private
     */
    public get elements() : IPdfPrimitive[] {
        return this.internalElements;
    }
    //constructor
    /**
     * Initializes a new instance of the `PdfArray` class.
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfArray` class.
     * @private
     */
    constructor(array : PdfArray|number[])
    constructor(array? : PdfArray|number[]) {
        if (typeof array === 'undefined') {
            this.internalElements = [];
        } else {
            if (typeof array !== 'undefined' && !(array instanceof PdfArray)) {
                let tempNumberArray : number[] = array;
                for (let index : number = 0; index < tempNumberArray.length; index++) {
                    let pdfNumber : PdfNumber = new PdfNumber(tempNumberArray[index]);
                    this.add(pdfNumber);
                }
            // } else if (typeof array !== 'undefined' && (array instanceof PdfArray)) {
            } else {
                let tempArray : PdfArray = array as PdfArray;
                // if (tempArray.Elements.length > 0) {
                this.internalElements = [];
                for (let index : number = 0; index < tempArray.elements.length; index++) {
                    this.internalElements.push(tempArray.elements[index]);
                }
                // }
            }
        }
    }
    /**
     * `Adds` the specified element to the PDF array.
     * @private
     */
    public add(element : IPdfPrimitive) : void {
        // if (element === null) {
        //     throw new Error('ArgumentNullException : obj');
        // }
        if (typeof this.internalElements === 'undefined') {
            this.internalElements = [];
        }
        this.internalElements.push(element);
        this.markedChange();
    }
    /**
     * `Marks` the object changed.
     * @private
     */
    private markedChange() : void {
        this.bChanged = true;
    }
    /**
     * `Determines` whether the specified element is within the array.
     * @private
     */
    public contains(element : IPdfPrimitive) : boolean {
        let returnValue : boolean = false;
        for (let index : number = 0; index < this.internalElements.length; index++) {
            let tempElement : PdfName = this.internalElements[index] as PdfName;
            let inputElement : PdfName = element as PdfName;
            if (tempElement != null && typeof tempElement !== 'undefined' && inputElement != null && typeof inputElement !== 'undefined') {
                if (tempElement.value === inputElement.value) {
                    return true;
                }
            }
            // if (this.internalElements[index] === element) {
            //     returnValue = true;
            // }
        }
        return returnValue;
    }
    /**
     * Returns the `primitive object` of input index.
     * @private
     */
    public getItems(index : number) : IPdfPrimitive {
        // if (index < 0 || index >= this.Count) {
        //     throw new Error('ArgumentOutOfRangeException : index , The index can"t be less then zero or greater then Count.');
        // }
        return this.internalElements[index] as IPdfPrimitive;
    }
    /**
     * `Saves` the object using the specified writer.
     * @private
     */
    public save(writer : IPdfWriter) : void {
        // if (writer === null) {
        //     throw new Error('ArgumentNullException : writer');
        // }
        writer.write(this.startMark);
        for (let i : number = 0, len : number = this.count; i < len; i++) {
            this.getItems(i).save(writer);
            if (i + 1 !== len) {
                writer.write(Operators.whiteSpace);
            }
        }
        writer.write(this.endMark);
    }
    /**
     * Creates a `copy of PdfArray`.
     * @private
     */
    public clone(crossTable : PdfCrossTable) : IPdfPrimitive {
        // if (this.clonedObject9 !== null && this.clonedObject9.CrossTable === crossTable) {
        //     return this.clonedObject9;
        // } else {
        this.clonedObject9 = null;
        // Else clone the object.
        let newArray : PdfArray = new PdfArray();
        for (let index : number = 0; index < this.internalElements.length; index++) {
            let obj : IPdfPrimitive = this.internalElements[index];
            newArray.add(obj.clone(crossTable));
        }
        newArray.pdfCrossTable = crossTable;
        this.clonedObject9 = newArray;
        return newArray;
    }
    /**
     * Creates filled PDF array `from the rectangle`.
     * @private
     */
    public static fromRectangle(bounds : RectangleF) : PdfArray {
        let values : number[] = [bounds.x, bounds.y, bounds.width, bounds.height];
        let array : PdfArray = new PdfArray(values);
        return array;
    }
    // /**
    //  * Creates the rectangle from filled PDF array.
    //  * @private
    //  */
    // public ToRectangle() : RectangleF {
    //     if (this.Count < 4) {
    //         throw Error('InvalidOperationException-Can not convert to rectangle.');
    //     }
    //     let x1 : number;
    //     let x2 : number;
    //     let y1 : number;
    //     let y2 : number;
    //     let num : PdfNumber = this.getItems(0) as PdfNumber;
    //     x1 = num.IntValue;
    //     num = this.getItems(1) as PdfNumber;
    //     y1 = num.IntValue;
    //     num = this.getItems(2) as PdfNumber;
    //     x2 = num.IntValue;
    //     num = this.getItems(3) as PdfNumber;
    //     y2 = num.IntValue;

    //     let x : number = Math.min(x1, x2);
    //     let y : number = Math.min(y1, y2);
    //     let width : number = Math.abs(x1 - x2);
    //     let height : number = Math.abs(y1 - y2);
    //     let rect : RectangleF = new RectangleF(new PointF(x, y), new SizeF(width, height));
    //     return rect;
    // }
    /**
     * `Inserts` the element into the array.
     * @private
     */
    public insert(index : number, element : IPdfPrimitive) : void {
        if (index < this.internalElements.length && index > 0) {
            let tempElements : IPdfPrimitive[] = [];
            for (let i : number = 0; i < index ; i++) {
                tempElements.push(this.internalElements[i]);
            }
            tempElements.push(element);
            for (let i : number = index; i < this.internalElements.length ; i++) {
                tempElements.push(this.internalElements[i]);
            }
            this.internalElements = tempElements;
        } else {
            this.internalElements.push(element);
        }
        this.markChanged();
    }
    /**
     * `Checks whether array contains the element`.
     * @private
     */
    public indexOf(element : IPdfPrimitive) : number {
        return this.internalElements.indexOf(element);
    }
    /**
     * `Removes` element from the array.
     * @private
     */
    public remove(element : IPdfPrimitive) : void {
        // if (element === null) {
        //     throw new Error('ArgumentNullException : element');
        // }
        let index : number = this.internalElements.indexOf(element);
        // if (index >= 0 && index < this.internalElements.length) {
        this.internalElements[index] = null;
        // }
        this.markChanged();
    }
    /**
     * `Remove` the element from the array by its index.
     * @private
     */
    public removeAt(index : number) : void {
        // this.internalElements.RemoveAt(index);
        if (this.internalElements.length > index) {
            let tempArray : IPdfPrimitive[] = [];
            for (let i : number = 0; i < index; i++) {
                tempArray.push(this.internalElements[i]);
            }
            for (let i : number = index + 1; i < this.internalElements.length; i++) {
                tempArray.push(this.internalElements[i]);
            }
            this.internalElements = tempArray;
        }
        this.markChanged();
    }
    /**
     * `Clear` the array.
     * @private
     */
    public clear() : void {
        this.internalElements = [];
        this.markChanged();
    }
    /**
     * `Marks` the object changed.
     * @private
     */
    public markChanged() : void {
        this.bChanged = true;
    }
}