/**
 * Writes data in BigEndian order.
 */
export class BigEndianWriter {
    //Constants
    /**
     * Size of Int32 type.
     */
    public readonly int32Size : number = 4;
    /**
     * Size of Int16 type.
     */
    public readonly int16Size : number = 2;
    /**
     * Size of long type.
     */
    public readonly int64Size : number = 8;
    //Fields    
    /**
     * Internal buffer.
     */
    private buffer : number[];
    /**
     * Internal buffer capacity.
     */
    private bufferLength : number;
    /**
     * Current position.
     */
    private internalPosition : number;
    //Properties
    /**
     * Gets data written to the writer.
     */
    public get data() : number[] {
        if (this.buffer.length < this.bufferLength) {
            let length : number = this.bufferLength - this.buffer.length;
            for (let i : number = 0; i < length; i++) {
                this.buffer.push(0);
            }
        }
        return this.buffer;
    }
    /// <summary>
    /// Gets position of the internal buffer.
    /// </summary>
    public get position() : number {
        if (this.internalPosition === undefined || this.internalPosition === null) {
            this.internalPosition = 0;
        }
        return this.internalPosition;
    }
    //Constructors
    /**
     * Creates a new writer.
     */
    public constructor(capacity : number) {
        this.bufferLength = capacity;
        this.buffer = [];
    }
    /**
     * Writes short value.
     */
    public writeShort(value : number) : void {
        let bytes : number[] = [((value & 0x0000ff00) >> 8), value & 0x000000ff];
        this.flush(bytes);
    }
    /**
     * Writes int value.
     */
    public writeInt(value : number) : void {
        let i1 : number = (value & 0xff000000) >> 24;
        i1 = i1 < 0 ? 256 + i1 : i1;
        let i2 : number = (value & 0x00ff0000) >> 16;
        i2 = i2 < 0 ? 256 + i2 : i2;
        let i3 : number = (value & 0x0000ff00) >> 8;
        i3 = i3 < 0 ? 256 + i3 : i3;
        let i4 : number = value & 0x000000ff;
        i4 = i4 < 0 ? 256 + i4 : i4;
        let bytes : number[] = [(value & 0xff000000) >> 24, (value & 0x00ff0000) >> 16, (value & 0x0000ff00) >> 8, value & 0x000000ff ];
        this.flush(bytes);
    }
    /**
     * Writes u int value.
     */
    public writeUInt(value : number) : void {
        let buff : number[] = [(value & 0xff000000) >> 24, (value & 0x00ff0000) >> 16, (value & 0x0000ff00) >> 8, value & 0x000000ff ];
        this.flush(buff);
    }
    /**
     * Writes string value.
     */
    public writeString(value : string) : void {
        if (value == null) {
            throw new Error('Argument Null Exception : value');
        }
        let bytes : number[] = [];
        for (let i : number = 0; i < value.length; i++) {
            bytes.push(value.charCodeAt(i));
        }
        this.flush(bytes);
    }
    /**
     * Writes byte[] value.
     */
    public writeBytes(value : number[]) : void {
        this.flush(value);
    }
    // //Implementation
    private flush(buff : number[]) : void {
        if (buff === null) {
            throw new Error('Argument Null Exception : buff');
        }
        let position : number = this.position;
        for (let i : number = 0; i < buff.length; i++) {
            this.buffer[position] = buff[i];
            position++;
        }
        this.internalPosition += buff.length;
    }
}