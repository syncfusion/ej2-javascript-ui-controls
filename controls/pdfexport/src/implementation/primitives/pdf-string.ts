/**
 * PdfString.ts class for EJ2-PDF
 */
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { ObjectStatus } from './../input-output/enum';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
/**
 * `PdfString` class is used to perform string related primitive operations.
 * @private
 */
export namespace InternalEnum {
    //Internals
    /**
     * public Enum for `ForceEncoding`.
     * @private
     */
    export enum ForceEncoding {
        /**
         * Specifies the type of `None`.
         * @private
         */
        None,
        /**
         * Specifies the type of `Ascii`.
         * @private
         */
        Ascii,
        /**
         * Specifies the type of `Unicode`.
         * @private
         */
        Unicode
    }
    /**
     * public Enum for `SourceType`.
     * @private
     */
    enum SourceType {
        /**
         * Specifies the type of `StringValue`.
         * @private
         */
        StringValue,
        /**
         * Specifies the type of `ByteBuffer`.
         * @private
         */
        ByteBuffer,
    }
}
export class PdfString implements IPdfPrimitive {
    //constants = ;
    /**
     * `General markers` for string.
     * @private
     */
    public static readonly stringMark : string = '()';
    /**
     * `Hex markers` for string.
     * @private
     */
    public static readonly hexStringMark : string = '<>';
    /**
     * Format of password data.
     * @private
     */
    private static readonly hexFormatPattern : string = '{0:X2}';
    //Fields
    /**
     * Value of the object.
     * @private
     */
    private stringValue : string;
    /**
     * The byte data of the string.
     * @private
     */
    private data : number[];
    /**
     * Value indicating whether the string was converted to hex.
     * @default false
     * @private
     */
    private bHex : boolean = false;
    /**
     * Shows the type of object `status` whether it is object registered or other status;
     * @private
     */
    private status1 : ObjectStatus;
    /**
     * Indicates if the object is currently in `saving state or not`.
     * @private
     */
    private isSaving1 : boolean;
    /**
     * Internal variable to store the `position`.
     * @default -1
     * @private
     */
    private position1 : number = -1;
    /**
     * Internal variable to hold `PdfCrossTable` reference.
     * @private
     */
    private crossTable : PdfCrossTable;
    /**
     * Internal variable to hold `cloned object`.
     * @default null
     * @private
     */
    private clonedObject1 : PdfString = null;
    /**
     * Indicates whether to check if the value `has unicode characters`.
     * @private
     */
    private bConverted : boolean;
    /**
     * Indicates whether we should convert `data to Unicode`.
     * @private
     */
    private bForceEncoding : InternalEnum.ForceEncoding;
    /**
     * `Shows` if the data of the stream was decrypted.
     * @default false
     * @private
     */
    private bDecrypted : boolean = false;
    /**
     * Holds the `index` number of the object.
     * @private
     */
    private index1 : number;
    /**
     * Shows if the data of the stream `was decrypted`.
     * @default false
     * @private
     */
    private isParentDecrypted : boolean = false;
    /**
     * Gets a value indicating whether the object is `packed or not`.
     * @default false
     * @private
     */
    private isPacked : boolean = false;
    /**
     * @hidden
     * @private
     */
    public isFormField : boolean = false;
    /**
     * @hidden
     * @private
     */
    public isColorSpace : boolean = false;
    /**
     * @hidden
     * @private
     */
    public isHexString : boolean = true;
    /**
     * @hidden
     * @private
     */
    private encodedBytes : number[];
    //constructor
    /**
     * Initializes a new instance of the `PdfString` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfString` class.
     * @private
     */
    public constructor(value : string)
    public constructor(value? : string) {
        if (typeof value === 'undefined') {
            this.bHex = false;
        } else {
            if (!(value.length > 0 && value[0] === '0xfeff')) {
                this.stringValue = value;
                this.data = [];
                for (let i : number = 0; i < value.length; ++i) {
                    this.data.push(value.charCodeAt(i));
                }
            }
        }
    }
    //Property
    /**
     * Gets a value indicating whether string is in `hex`.
     * @private
     */
    public get hex() : boolean {
        return this.bHex;
    }
    /**
     * Gets or sets string `value` of the object.
     * @private
     */
    public get value() : string {
        return this.stringValue;
    }
    public set value(value : string) {
        this.stringValue = value;
        this.data = null;
    }
    /**
     * Gets or sets the `Status` of the specified object.
     * @private
     */
    public get status() : ObjectStatus {
        return this.status1;
    }
    public set status(value : ObjectStatus) {
        this.status1 = value;
    }
    /**
     * Gets or sets a value indicating whether this document `is saving` or not.
     * @private
     */
    public get isSaving() : boolean {
        return this.isSaving1;
    }
    public set isSaving(value : boolean) {
        this.isSaving1 = value;
    }
    /**
     * Gets or sets the `index` value of the specified object.
     * @private
     */
    public get objectCollectionIndex() : number {
        return this.index1;
    }
    public set objectCollectionIndex(value : number) {
        this.index1 = value;
    }
    /**
     * Returns `cloned object`.
     * @private
     */
    public get clonedObject() : IPdfPrimitive {
        return this.clonedObject1;
    }
    /**
     * Gets or sets the `position` of the object.
     * @private
     */
    public get position() : number {
        return this.position1;
    }
    public set position(value : number) {
        this.position1 = value;
    }
    /**
     * Returns `PdfCrossTable` associated with the object.
     * @private
     */
    public get CrossTable() : PdfCrossTable {
        return this.crossTable;
    }
    /**
     * Gets a value indicating whether to check if the value has unicode characters.
     * @private
     */
    public get converted() : boolean {
        return this.bConverted;
    }
    /**
     * sets a value indicating whether to check if the value has unicode characters.
     * @private
     */
    public set converted(value : boolean) {
        this.bConverted = value;
    }
    /**
     * Gets value indicating whether we should convert data to Unicode.
     */
    public get encode() : InternalEnum.ForceEncoding {
        return this.bForceEncoding;
    }
    public set encode(value : InternalEnum.ForceEncoding) {
        this.bForceEncoding = value;
    }
    //Methods
    /**
     * Converts `bytes to string using hex format` for representing string.
     * @private
     */
    public static bytesToHex(bytes : number[]) : string {
        if (bytes == null) {
            return '';
        }
        let builder : string = '';
        return builder;
    }
    /**
     * `Saves` the object using the specified writer.
     * @private
     */
    public save(writer : IPdfWriter) : void {
        if (writer === null) {
            throw new Error('ArgumentNullException : writer');
        }
        if (this.encode !== undefined && this.encode === InternalEnum.ForceEncoding.Ascii) {
            writer.write(this.pdfEncode());
        } else {
            writer.write(PdfString.stringMark[0] + this.value + PdfString.stringMark[1]);
        }
    }
    public pdfEncode() : string {
        let result : string = '';
        if (this.encode !== undefined && this.encode === InternalEnum.ForceEncoding.Ascii) {
            let data : number[] = this.escapeSymbols(this.value);
            for (let i : number = 0; i < data.length; i++) {
                result += String.fromCharCode(data[i]);
            }
            result = PdfString.stringMark[0] + result + PdfString.stringMark[1];
        } else {
            result = this.value;
        }
        return result;
    }
    private escapeSymbols(value : string) : number[] {
        let data : number[] = [];
        for (let i : number = 0; i < value.length; i++) {
            let currentData : number = value.charCodeAt(i);
            switch (currentData) {
                case 40:
                case 41:
                    data.push(92);
                    data.push(currentData);
                    break;
                case 13:
                    data.push(92);
                    data.push(114);
                    break;
                case 92:
                    data.push(92);
                    data.push(currentData);
                    break;

                default:
                    data.push(currentData);
                    break;
            }
        }
        return data;
    }
    /**
     * Creates a `copy of PdfString`.
     * @private
     */
    public clone(crossTable : PdfCrossTable) : IPdfPrimitive {
        if (this.clonedObject1 !== null && this.clonedObject1.CrossTable === crossTable) {
            return this.clonedObject1;
        } else {
            this.clonedObject1 = null;
        }
        let newString : PdfString = new PdfString(this.stringValue);
        newString.bHex = this.bHex;
        newString.crossTable = crossTable;
        newString.isColorSpace = this.isColorSpace;
        this.clonedObject1 = newString;
        return newString;
    }
    /**
     * Converts string to array of unicode symbols.
     */
    public static toUnicodeArray(value : string, bAddPrefix : boolean) : number[] {
        if (value == null) {
            throw new Error('Argument Null Exception : value');
        }
        let startIndex : number = 0;
        let output : number[] = [];
        for (let i : number = 0; i < value.length; i++) {
            let code : number = value.charCodeAt(i);
            output.push(code / 256 >>> 0);
            output.push(code & 0xff);
        }
        return output;
    }
    /**
     * Converts byte data to string.
     */
    public static byteToString(data : number[]) : string {
        if (data == null) {
            throw new Error('Argument Null Exception : stream');
        }
        let result : string = '';
        for (let i : number = 0; i < data.length; ++i) {
            result += String.fromCharCode(data[i]);
        }
        return result;
    }
}