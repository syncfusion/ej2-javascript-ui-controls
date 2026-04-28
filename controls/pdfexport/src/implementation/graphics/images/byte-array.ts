/**
 * ByteArray class
 * Used to keep information about image stream as byte array.
 * @private
 */
export class ByteArray {
    /**
     * Current stream `position`.
     * @default 0
     * @private
     */
    private mPosition: number = 0;
    /**
     * Uint8Array for returing `buffer`.
     * @hidden
     * @private
     */
    private buffer: Uint8Array;
    /**
     * Specifies the `data view`.
     * @hidden
     * @private
     */
    private dataView: DataView;
    /**
     * Initialize the new instance for `byte-array` class
     * @hidden
     * @private
     */
    constructor(length: number) {
        this.buffer = new Uint8Array(length);
        this.dataView = new DataView(this.buffer.buffer);
    }
    /**
     * Gets and Sets a current `position` of byte array.
     * @hidden
     * @private
     */
    public get position(): number {
        return this.mPosition;
    }
    public set position(value: number) {
        this.mPosition = value;
    }
    /**
     * `Read` from current stream position.
     * @default 0
     * @hidden
     * @private
     */
    public read(buffer: ByteArray, offset: number, count: number): void {
        for (let index: number = offset; index < count; index++) {
            let position: number = this.position;
            buffer.buffer[index] = this.readByte(position);
            this.position++;
        }
    }
    /**
     * @hidden
     */
    public getBuffer(index: number): number {
        return this.buffer[index];
    }
    /**
     * @hidden
     */
    public writeFromBase64String(base64: string): void {
        let arr: Uint8Array = this.encodedString(base64);
        this.buffer = arr;
    }
    /**
     * @hidden
     */
    public encodedString(input: string): Uint8Array {
        let keyStr: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let chr1: number;
        let chr2: number;
        let chr3: number;
        let enc1: number;
        let enc2: number;
        let enc3: number;
        let enc4: number;
        let i: number = 0;
        let resultIndex: number = 0;
        let dataUrlPrefix: string = 'data:';
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        let totalLength: number = input.length * 3 / 4;
        if (input.charAt(input.length - 1) === keyStr.charAt(64)) {
            totalLength--;
        }
        let output: Uint8Array = new Uint8Array(totalLength | 0);
        while (i < input.length) {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output[resultIndex++] = chr1;
            output[resultIndex++] = chr2;
            output[resultIndex++] = chr3;
        }
        return output;
    }
    /**
     * @hidden
     */
    public readByte(offset: number): number {
        return (this.buffer[offset]);
    }
    /**
     * @hidden
     */
    public get internalBuffer(): Uint8Array {
        return this.buffer;
    }
    /**
     * @hidden
     */
    public get count(): number {
        return this.buffer.byteLength;
    }
    /**
     * 'readNextTwoBytes' stream 
     * @hidden
     * @private
     */
    public readNextTwoBytes(stream: ByteArray): number {
        let data : number = stream.readByte(this.position);
        this.position++;
        data <<= 8;
        data |= stream.readByte(this.position);
        this.position++;
        return data;
    }
}