/**
 * PdfName.ts class for EJ2-PDF
 */
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { ObjectStatus } from './../input-output/enum';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
/**
 * `PdfName` class is used to perform name (element names) related primitive operations.
 * @private
 */
export class PdfName implements IPdfPrimitive {
    /**
     * `Start symbol` of the name object.
     * @default /
     * @private
     */
    public readonly stringStartMark : string = '/';
    /**
     * PDF `special characters`.
     * @private
     */
    public static delimiters : string = '()<>[]{}/%}';
    /**
     * The symbols that are not allowed in PDF names and `should be replaced`.
     * @private
     */
    private static readonly replacements : string[] = [' ', '\t', '\n', '\r'];
    /**
     * `Value` of the element.
     * @private
     */
    private internalValue : string = '';
    /**
     * Shows the type of object `status` whether it is object registered or other status;
     * @private
     */
    private status6 : ObjectStatus;
    /**
     * Indicates if the object is currently in `saving state or not`.
     * @default false
     * @private
     */
    private isSaving6 : boolean = false;
    /**
     * Holds the `index` number of the object.
     * @private
     */
    private index6 : number;
    /**
     * Internal variable to store the `position`.
     * @default -1
     * @private
     */
    private position6 : number = -1;
    /**
     * Initializes a new instance of the `PdfName` class.
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfName` class.
     * @private
     */
    constructor(value : string)
    constructor(value? : string) {
        this.internalValue = this.normalizeValue(value);
    }
    //property
    /**
     * Gets or sets the `Status` of the specified object.
     * @private
     */
    public get status() : ObjectStatus {
        return this.status6;
    }
    public set status(value : ObjectStatus) {
        this.status6 = value;
    }
    /**
     * Gets or sets a value indicating whether this document `is saving` or not.
     * @private
     */
    public get isSaving() : boolean {
        return this.isSaving6;
    }
    public set isSaving(value : boolean) {
        this.isSaving6 = value;
    }
    /**
     * Gets or sets the `index` value of the specified object.
     * @private
     */
    public get objectCollectionIndex() : number {
        return this.index6;
    }
    public set objectCollectionIndex(value : number) {
        this.index6 = value;
    }
    /**
     * Gets or sets the `position` of the object.
     * @private
     */
    public get position() : number {
        return this.position6;
    }
    public set position(value : number) {
        this.position6 = value;
    }
    /**
     * Returns `cloned object`.
     * @private
     */
    public get clonedObject() : IPdfPrimitive {
        return null;
    }
    /**
     * Gets or sets the `value` of the object.
     * @private
     */
    public get value() : string {
        return this.internalValue;
    }
    public set value(value : string) {
        // if (value !== this.value) {
        let val : string = value;
        if (value !== null && value.length > 0) {
            // val = (value.substring(0, 1) === this.stringStartMark) ? value.substring(1) : value;
            val = value;
            this.internalValue = this.normalizeValue(val);
        } else {
            this.internalValue = val;
        }
        // }
    }
    //public methods
    /**
     * `Saves` the name using the specified writer.
     * @private
     */
    public save(writer : IPdfWriter) : void {
        // if (writer === null) {
        //     throw new Error('ArgumentNullException : writer');
        // }
        writer.write(this.toString());
    }
    /**
     * Gets `string` representation of the primitive.
     * @private
     */
    public toString() : string {
        return (this.stringStartMark + this.escapeString(this.value));
    }
    /**
     * Creates a `copy of PdfName`.
     * @private
     */
    public clone(crossTable : PdfCrossTable) : IPdfPrimitive {
        let newName : PdfName = new PdfName();
        newName.value = this.internalValue;
        return newName;
    }
    /**
     * Replace some characters with its `escape sequences`.
     * @private
     */
    public escapeString(stringValue : string) : string {
        // if (str === null) {
        //     throw new Error('ArgumentNullException : str');
        // }
        // if (str === '') {
        //     return str;
        // }
        let result : string = '';
        let len : number = 0;
        for (let i : number = 0, len : number = stringValue.length; i < len; i++) {
            let ch : string = stringValue[i];
            let index : number = PdfName.delimiters.indexOf(ch);
            // switch (ch) {
            //     case '\r' :
            //         result = result + '\\r';
            //         break;
            //     case '\n' :
            //         result = result + '\n';
            //         break;
            //     case '(' :
            //     case ')' :
            //     case '\\' :
            //         //result.Append( '\\' ).Append( ch );
            //         result = result + ch;
            //         break;
            //     default :
            //         result = result + ch;
            //         break;
            // }
            result = result + ch;
        }
        return result;
    }
    //methiods
    /**
     * Replace a symbol with its code with the precedence of the `sharp sign`.
     * @private
     */
    private normalizeValue(value : string, c? : string) : string {
        // if (typeof c === undefined) {
        //     let str : string = value;
        //     for (let i : number = 0; i < PdfName.replacements.length; i++) {
        //         str = this.normalizeValue(str, c);
        //     }
        //     return str;
        // } else {
        let strFormat : String = '#{0:X}';
        //return value.replace(c.toString(),String.format(strFormat,c));
        return value;
        // }
    }
}