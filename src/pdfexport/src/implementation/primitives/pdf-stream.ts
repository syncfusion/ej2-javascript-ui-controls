/**
 * PdfStream.ts class for EJ2-PDF
 */
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { PdfDictionary } from './pdf-dictionary';
import { PdfNumber } from './pdf-number';
import { Operators } from './../input-output/pdf-operators';
import { PdfName } from './pdf-name';
import { PdfArray } from './pdf-array';
import { PdfReferenceHolder } from './pdf-reference';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { CompressedStreamWriter } from '@syncfusion/ej2-compression';
import { UnicodeTrueTypeFont } from './../graphics/fonts/unicode-true-type-font';
/**
 * `PdfStream` class is used to perform stream related primitive operations.
 * @private
 */
export class PdfStream extends PdfDictionary {
    //Constants
    /**
     * @hidden
     * @private
     */
    private readonly dicPrefix : string = 'stream';
    /**
     * @hidden
     * @private
     */
    private readonly dicSuffix : string = 'endstream';
    //Fields
    /**
     * @hidden
     * @private
     */
    private dataStream2 : string[];
    /**
     * @hidden
     * @private
     */
    private blockEncryption2 : boolean;
    /**
     * @hidden
     * @private
     */
    private bDecrypted2 : boolean;
    /**
     * @hidden
     * @private
     */
    private bCompress2 : boolean;
    /**
     * @hidden
     * @private
     */
    private bEncrypted2 : boolean;
    /**
     * Internal variable to hold `cloned object`.
     * @private
     */
    private clonedObject2 : PdfStream = null;
    /**
     * @hidden
     * @private
     */
    private bCompress : boolean = true;
    /**
     * @hidden
     * @private
     */
    private isImageStream : boolean = false;
    /**
     * @hidden
     * @private
     */
    private isFontStream : boolean = false;
    /**
     * Event. Raise `before the object saves`.
     * @private
     */
    public cmapBeginSave : SaveCmapEventHandler;
    /**
     * Event. Raise `before the object saves`.
     * @private
     */
    public fontProgramBeginSave : SaveFontProgramEventHandler;
    //Constructors
    /**
     * Initialize an instance for `PdfStream` class.
     * @private
     */
    public constructor()
    /**
     * Initialize an instance for `PdfStream` class.
     * @private
     */
    public constructor(dictionary : PdfDictionary, data : string[])
    public constructor(dictionary? : PdfDictionary, data? : string[]) {
        super(dictionary);
        if (typeof dictionary !== 'undefined' || typeof data !== 'undefined') {
            this.dataStream2 = [];
            this.dataStream2 = data;
            this.bCompress2 = false;
        } else {
            this.dataStream2 = [];
            this.bCompress2 = true;
            //Pending
        }
    }
    /**
     * Gets the `internal` stream.
     * @private
     */
    public get internalStream() : string[] {
        return this.dataStream2;
    }
    public set internalStream(value : string[]) {
        this.dataStream2 = [];
        this.dataStream2 = value;
        this.modify();
    }
    /**
     * Gets or sets 'is image' flag.
     * @private
     */
    public get isImage() : boolean {
        return this.isImageStream;
    }
    public set isImage(value : boolean) {
        this.isImageStream = value;
    }
    /**
     * Gets or sets 'is font' flag.
     * @private
     */
    public get isFont() : boolean {
        return this.isFontStream;
    }
    public set isFont(value : boolean) {
        this.isFontStream = value;
    }
    /**
     * Gets or sets `compression` flag.
     * @private
     */
    public get compress() : boolean {
        return this.bCompress;
    }
    public set compress(value : boolean) {
        this.bCompress = value;
        this.modify();
    }
    /**
     * Gets or sets the `data`.
     * @private
     */
    public get data() : string[] {
        return this.dataStream2;
    }
    public set data(value : string[]) {
        this.dataStream2 = [];
        this.dataStream2 = value;
        this.modify();
    }
    /**
     * `Clear` the internal stream.
     * @private
     */
    public clearStream() : void {
        this.internalStream = [];
        if (this.items.containsKey(this.dictionaryProperties.filter)) {
            this.remove(this.dictionaryProperties.filter);
        }
        this.bCompress = true;
        this.modify();
    }
    /**
     * `Writes` the specified string.
     * @private
     */
    public write(text : string) : void {
        if (text == null) {
            throw new Error('ArgumentNullException:text');
        }
        if (text.length <= 0) {
            throw new Error('ArgumentException: Can not write an empty string, text');
        }
        this.dataStream2.push(text);
        this.modify();
    }
    /**
     * `Writes` the specified bytes.
     * @private
     */
    public writeBytes(data : number[]) : void {
        if (data === null) {
            throw new Error('ArgumentNullException:data');
        }
        if (data.length <= 0) {
            throw new Error('ArgumentException: Can not write an empty bytes, data');
        }
        let text : string = '';
        for (let i : number = 0; i < data.length; i++) {
            text += String.fromCharCode(data[i]);
        }
        this.dataStream2.push(text);
        this.modify();
    }
    /**
     * Raises event `Cmap BeginSave`.
     * @private
     */
    public onCmapBeginSave() : void {
        (this.cmapBeginSave as SaveCmapEventHandler).sender.cmapBeginSave();
    }
    /**
     * Raises event `Font Program BeginSave`.
     * @private
     */
    protected onFontProgramBeginSave() : void {
        (this.fontProgramBeginSave as SaveFontProgramEventHandler).sender.fontProgramBeginSave();
    }
    /**
     * `Compresses the content` if it's required.
     * @private
     */
    private compressContent(data : string, writer : IPdfWriter) : string {
        if (this.bCompress) {
            let byteArray : number[] = [];
            for (let i : number = 0; i < data.length; i++) {
                byteArray.push(data.charCodeAt(i));
            }
            let dataArray : Uint8Array = new Uint8Array(byteArray);
            let sw : CompressedStreamWriter = new CompressedStreamWriter();
            // data = 'Hello World!!!';
            sw.write(dataArray, 0, dataArray.length);
            sw.close();
            data = sw.getCompressedString;
            this.addFilter(this.dictionaryProperties.flatedecode);
        }
        return data;
    }
    /**
     * `Adds a filter` to the filter array.
     * @private
     */
    public addFilter(filterName : string) : void {
        let obj : IPdfPrimitive = this.items.getValue(this.dictionaryProperties.filter);
        if (obj instanceof PdfReferenceHolder) {
            let rh : PdfReferenceHolder = obj as PdfReferenceHolder;
            obj = rh.object;
        }
        let array : PdfArray = obj as PdfArray;
        let name : PdfName = obj as PdfName;
        if (name != null) {
            array = new PdfArray();
            array.insert(0, name);
            this.items.setValue(this.dictionaryProperties.filter, array);
        }
        name = new PdfName(filterName);
        if (array == null) {
            this.items.setValue(this.dictionaryProperties.filter, name);
        } else {
            array.insert(0, name);
        }
    }
    /**
     * `Saves` the object using the specified writer.
     * @private
     */
    public save(writer : IPdfWriter) : void {
        if (typeof this.cmapBeginSave !== 'undefined') {
            this.onCmapBeginSave();
        }
        if (typeof this.fontProgramBeginSave !== 'undefined') {
            this.onFontProgramBeginSave();
        }
        let data : string = '';
        for (let i : number = 0; i < this.data.length; i++) {
            data = data + this.data[i];
        }
        if (data.length > 1 && !this.isImage && !this.isFont) {
            data = 'q\r\n' + data + 'Q\r\n';
        }
        data = this.compressContent(data, writer);
        let length : number = data.length;
        this.items.setValue(this.dictionaryProperties.length, new PdfNumber(length));
        super.save(writer, false);
        writer.write(this.dicPrefix);
        writer.write(Operators.newLine);
        if (data.length > 0) {
            writer.write(data);
        }
        writer.write(Operators.newLine);
        writer.write(this.dicSuffix);
        writer.write(Operators.newLine);
    }
    /**
     * Converts `bytes to string`.
     * @private
     */
    public static bytesToString(byteArray : number[]) : string {
        let output : string = '';
        for (let i : number = 0; i < byteArray.length; i++ ) {
            output = output + String.fromCharCode(byteArray[i]);
        }
        return output;
    }
}
export class SaveCmapEventHandler {
    /**
     * @hidden
     * @private
     */
    public sender : UnicodeTrueTypeFont;
    /**
     * New instance for `save section collection event handler` class.
     * @private
     */
    public constructor(sender : UnicodeTrueTypeFont) {
        this.sender = sender;
    }
}
export class SaveFontProgramEventHandler {
    /**
     * @hidden
     * @private
     */
    public sender : UnicodeTrueTypeFont;
    /**
     * New instance for `save section collection event handler` class.
     * @private
     */
    public constructor(sender : UnicodeTrueTypeFont) {
        this.sender = sender;
    }
}