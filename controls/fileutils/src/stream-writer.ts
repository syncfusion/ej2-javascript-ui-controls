import { Encoding, EncodingType, validateNullOrUndefined } from './encoding';
import { Save } from './save';

/**
 * StreamWriter class contains the implementation for writing characters to a file in a particular encoding
 * ```typescript
 * let writer = new StreamWriter();
 * writer.write('Hello World');
 * writer.save('Sample.txt');
 * writer.dispose();
 * ```
 */
export class StreamWriter {
    private bufferBlob: Blob;
    private bufferText: string;
    private enc: Encoding;
    /**
     * Gets the content written to the StreamWriter as Blob.
     * @returns Blob
     */
    get buffer(): Blob {
        this.flush();
        return this.bufferBlob;
    }
    /**
     * Gets the encoding.
     * @returns Encoding
     */
    get encoding(): Encoding {
        return this.enc;
    }


    /**
     * Initializes a new instance of the StreamWriter class by using the specified encoding.
     * @param  {Encoding} encoding?- The character encoding to use.
     */
    constructor(encoding?: Encoding) {
        this.bufferBlob = new Blob(['']);
        this.bufferText = '';
        this.init(encoding);
        Save.isMicrosoftBrowser = !(!navigator.msSaveBlob);
    }

    private init(encoding: Encoding): void {
        if (encoding === null || encoding === undefined) {
            this.enc = new Encoding(false);
            this.enc.type = 'Utf8';
        } else {
            this.enc = encoding;
            this.setBomByte();
        }
    }
    /**
     * Private method to set Byte Order Mark(BOM) value based on EncodingType
     */
    private setBomByte(): void {
        if (this.encoding.includeBom) {
            switch (this.encoding.type) {
                case 'Unicode':
                    let arrayUnicode: ArrayBuffer = new ArrayBuffer(2);
                    let uint8: Uint8Array = new Uint8Array(arrayUnicode);
                    uint8[0] = 255;
                    uint8[1] = 254;
                    this.bufferBlob = new Blob([arrayUnicode]);
                    break;
                case 'Utf8':
                    let arrayUtf8: ArrayBuffer = new ArrayBuffer(3);
                    let utf8: Uint8Array = new Uint8Array(arrayUtf8);
                    utf8[0] = 239;
                    utf8[1] = 187;
                    utf8[2] = 191;
                    this.bufferBlob = new Blob([arrayUtf8]);
                    break;
                default:
                    this.bufferBlob = new Blob(['']);
                    break;
            }
        }
    }
    /**
     * Saves the file with specified name and sends the file to client browser
     * @param  {string} fileName - The file name to save
     * @returns {void}
     */
    public save(fileName: string): void {
        if (this.bufferText !== '') {
            this.flush();
        }
        Save.save(fileName, this.buffer);
    }
    /**
     * Writes the specified string.
     * @param  {string} value - The string to write. If value is null or undefined, nothing is written.
     * @returns {void}
     */
    public write(value: string): void {
        if (this.encoding === undefined) {
            throw new Error('Object Disposed Exception: current writer is disposed');
        }
        validateNullOrUndefined(value, 'string');
        this.bufferText += value;
        if (this.bufferText.length >= 10240) {
            this.flush();
        }
    }
    private flush(): void {
        if (this.bufferText === undefined || this.bufferText === null || this.bufferText.length === 0) {
            return;
        }
        let bufferArray: ArrayBuffer = this.encoding.getBytes(this.bufferText, 0, this.bufferText.length);
        this.bufferText = '';
        this.bufferBlob = new Blob([this.bufferBlob, bufferArray]);
    }

    /**
     * Writes the specified string followed by a line terminator
     * @param  {string} value - The string to write. If value is null or undefined, nothing is written
     * @returns {void}
     */
    public writeLine(value: string): void {
        if (this.encoding === undefined) {
            throw new Error('Object Disposed Exception: current writer is disposed');
        }
        validateNullOrUndefined(value, 'string');
        this.bufferText = this.bufferText + value + '\r\n';
        if (this.bufferText.length >= 10240) {
            this.flush();
        }
    }

    /**
     * Releases the resources used by the StreamWriter
     * @returns {void}
     */
    public destroy(): void {
        this.bufferBlob = undefined;
        this.bufferText = undefined;
        if (this.enc instanceof Encoding) {
            this.enc.destroy();
        }
        this.enc = undefined;
    }
}