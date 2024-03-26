/* eslint-disable */
import { CompressedStreamWriter, Stream, CompressedStreamReader } from './index';
import { Save } from '@syncfusion/ej2-file-utils';
import { Utils } from './utils';

const CRC32TABLE: number[] = [];
/// <summary>
/// Size of the int value in bytes.
/// </summary>
const INT_SIZE: number = 4;
/// <summary>
/// Size of the short value in bytes.
/// </summary>
const SHORT_SIZE = 2;
/// <summary>
/// End of central directory signature.
/// </summary>
const CentralDirectoryEndSignature: number = 0x06054b50;
/// <summary>
/// Offset to the size field in the End of central directory record.
/// </summary>
const CentralDirSizeOffset: number = 12;
/// <summary>
/// Central header signature.
/// </summary>
const CentralHeaderSignature: number = 0x02014b50;
		/// <summary>
		/// Buffer size.
		/// </summary>
		const BufferSize: number = 4096;
/**
 * class provide compression library
 * ```typescript
 * let archive = new ZipArchive();
 * archive.compressionLevel = 'Normal';
 * let archiveItem = new ZipArchiveItem(archive, 'directoryName\fileName.txt');
 * archive.addItem(archiveItem);
 * archive.save(fileName.zip);
 * ```
 */
export class ZipArchive {
    private files: (ZipArchiveItem | string)[];
    private level: CompressionLevel;
public get items(): (ZipArchiveItem | string)[] {
    return this.files;
}
    /**
     * gets compression level
     */
    get compressionLevel(): CompressionLevel {
        return this.level;
    }
    /**
     * sets compression level
     */
    set compressionLevel(level: CompressionLevel) {
        this.level = level;
    }
    /**
     * gets items count
     */
    get length(): number {
        if (this.files === undefined) {
            return 0;
        }
        return this.files.length;
    }

    /**
     * constructor for creating ZipArchive instance
     */
    constructor() {
        if (CRC32TABLE.length === 0) {
            ZipArchive.initCrc32Table();
        }
        this.files = [];
        this.level = 'Normal';
        Save.isMicrosoftBrowser = !(!navigator.msSaveBlob);
    }

    /**
     * add new item to archive
     * @param {ZipArchiveItem} item - item to be added
     * @returns {void}
     */
    public addItem(item: ZipArchiveItem): void {
        if (item === null || item === undefined) {
            throw new Error('ArgumentException: item cannot be null or undefined');
        }
        for (let i: number = 0; i < this.files.length; i++) {
            let file: ZipArchiveItem = this.files[i] as ZipArchiveItem;
            if (file instanceof ZipArchiveItem) {
                if (file.name === item.name) {
                    throw new Error('item with same name already exist');
                }
            }
        }
        this.files.push(item as ZipArchiveItem);
    }

    /**
     * add new directory to archive
     * @param directoryName directoryName to be created
     * @returns {void}
     */
    public addDirectory(directoryName: string): void {
        if (directoryName === null || directoryName === undefined) {
            throw new Error('ArgumentException: string cannot be null or undefined');
        }
        if (directoryName.length === 0) {
            throw new Error('ArgumentException: string cannot be empty');
        }
        if (directoryName.slice(-1) !== '/') {
            directoryName += '/';
        }
        if (this.files.indexOf(directoryName) !== -1) {
            throw new Error('item with same name already exist');
        }
        this.files.push(directoryName as string);
    }
    /**
     * gets item at specified index
     * @param {number} index - item index
     * @returns {ZipArchiveItem}
     */
    public getItem(index: number): ZipArchiveItem {
        if (index >= 0 && index < this.files.length) {
            return this.files[index] as ZipArchiveItem;
        }
        return undefined;
    }
    /**
     * determines whether an element is in the collection
     * @param {string | ZipArchiveItem} item - item to search
     * @returns {boolean}
     */
    public contains(item: string | ZipArchiveItem): boolean {
        return this.files.indexOf(item) !== -1 ? true : false;
    }
    public open(base64String: string): void {
        
        //return promise = new Promise((resolve: Function, reject: Function) => {
            let zipArchive: ZipArchive = this;
           


            let zipByteArray: Uint8Array = Utils.encodedString(base64String);
            if (zipByteArray.length == 0)
                throw new DOMException("stream");
            let stream: Stream = new Stream(zipByteArray);
    
            //let lCentralDirEndPosition = this.findValueFromEnd( arrBuffer, Constants.CentralDirectoryEndSignature, 65557 );
            let lCentralDirEndPosition: number = ZipArchive.findValueFromEnd(stream, CentralDirectoryEndSignature, 65557);
            if (lCentralDirEndPosition < 0)
                throw new DOMException("Can't locate end of central directory record. Possible wrong file format or archive is corrupt.");
    
            // Step2. Locate central directory and iterate through all items
            stream.position = lCentralDirEndPosition + CentralDirSizeOffset;
            let iCentralDirSize: number = ZipArchive.ReadInt32(stream);
    
            let lCentralDirPosition: number = lCentralDirEndPosition - iCentralDirSize;
    
            // verify that this is really central directory
            stream.position = lCentralDirPosition;
            this.readCentralDirectoryDataAndExtractItems(stream);
            
        //});
       

        // let zipArchive: ZipArchive = this;
        //let promise: Promise<ZipArchive>;
        // return promise = new Promise((resolve: Function, reject: Function) => {
        //     let reader: FileReader = new FileReader();
        //     reader.onload = (e: Event) => {
        //         let data: Uint8Array = new Uint8Array((e.target as any).result);
        //         let zipReader: ZipReader = new ZipReader(data);
        //         zipReader.readEntries().then((entries: ZipEntry[]) => {
        //             for (let i: number = 0; i < entries.length; i++) {
        //                 let entry: ZipEntry = entries[i];
        //                 let item: ZipArchiveItem = new ZipArchiveItem(zipArchive, entry.fileName);
        //                 item.data = entry.data;
        //                 item.compressionMethod = entry.compressionMethod;
        //                 item.crc = entry.crc;
        //                 item.lastModified = entry.lastModified;
        //                 item.lastModifiedDate = entry.lastModifiedDate;
        //                 item.size = entry.size;
        //                 item.uncompressedSize = entry.uncompressedSize;
        //                 zipArchive.addItem(item);
        //             }
        //             resolve(zipArchive);
        //         });
        //     };
        //     reader.readAsArrayBuffer(fileName);
        // });
        
    }
    /// <summary>
    /// Read central directory record from the stream.
    /// </summary>
    /// <param name="stream">Stream to read from.</param>
    public readCentralDirectoryDataAndExtractItems(stream: Stream): void {
        if (stream == null)
            throw new DOMException("stream");

            let itemHelper: ZipArchiveItemHelper ;
        while (ZipArchive.ReadInt32(stream) == CentralHeaderSignature) {
            itemHelper = new ZipArchiveItemHelper();
            itemHelper.readCentralDirectoryData(stream);
            itemHelper
            
            // let item: ZipArchiveItem = new ZipArchiveItem(this);
            // item.ReadCentralDirectoryData(stream);
            // m_arrItems.Add(item);
        }
        itemHelper.readData(stream, itemHelper.checkCrc);
        itemHelper.decompressData();
        this.files.push(new ZipArchiveItem(itemHelper.unCompressedStream.buffer, itemHelper.name));
    }
    /**
     * save archive with specified file name
     * @param {string} fileName save archive with specified file name
     * @returns {Promise<ZipArchive>}
     */
    public save(fileName: string): Promise<ZipArchive> {
        if (fileName === null || fileName === undefined || fileName.length === 0) {
            throw new Error('ArgumentException: fileName cannot be null or undefined');
        }
        if (this.files.length === 0) {
            throw new Error('InvalidOperation');
        }
        let zipArchive: ZipArchive = this;
        let promise: Promise<ZipArchive>;
        return promise = new Promise((resolve: Function, reject: Function) => {
            zipArchive.saveInternal(fileName, false).then(() => {
                resolve(zipArchive);
            });
        });
    }

    /**
     * Save archive as blob
     * @return {Promise<Blob>}
     */
    public saveAsBlob(): Promise<Blob> {
        let zipArchive: ZipArchive = this;
        let promise: Promise<Blob>;
        return promise = new Promise((resolve: Function, reject: Function) => {
            zipArchive.saveInternal('', true).then((blob: Blob) => {
                resolve(blob);
            });
        });
    }
    private saveInternal(fileName: string, skipFileSave: boolean): Promise<Blob> {
        let zipArchive: ZipArchive = this;
        let promise: Promise<Blob>;
        return promise = new Promise((resolve: Function, reject: Function) => {
            let zipData: ZippedObject[] = [];
            let dirLength: number = 0;
            for (let i: number = 0; i < zipArchive.files.length; i++) {
                let compressedObject: Promise<CompressedData> = this.getCompressedData(this.files[i]);
                compressedObject.then((data: CompressedData) => {
                    dirLength = zipArchive.constructZippedObject(zipData, data, dirLength, data.isDirectory);
                    if (zipData.length === zipArchive.files.length) {
                        let blob: Blob = zipArchive.writeZippedContent(fileName, zipData, dirLength, skipFileSave);
                        resolve(blob);
                    }
                });
            }
        });
    }
    /**
     * release allocated un-managed resource
     * @returns {void}
     */
    public destroy(): void {
        if (this.files !== undefined && this.files.length > 0) {
            for (let i: number = 0; i < this.files.length; i++) {
                let file: ZipArchiveItem | string = this.files[i];
                if (file instanceof ZipArchiveItem) {
                    (file as ZipArchiveItem).destroy();
                }
                file = undefined;
            }
            this.files = [];
        }
        this.files = undefined;
        this.level = undefined;
    }
    private getCompressedData(item: ZipArchiveItem | string): Promise<CompressedData> {
        let zipArchive: ZipArchive = this;
        let promise: Promise<CompressedData> = new Promise((resolve: Function, reject: Function) => {
            if (item instanceof ZipArchiveItem) {
                let reader: FileReader = new FileReader();
                reader.onload = () => {
                    let input: Uint8Array = new Uint8Array(reader.result as ArrayBuffer);
                    let data: CompressedData = {
                        fileName: item.name, crc32Value: 0, compressedData: [],
                        compressedSize: undefined, uncompressedDataSize: input.length, compressionType: undefined,
                        isDirectory: false
                    };
                    if (zipArchive.level === 'Normal') {
                        zipArchive.compressData(input, data, CRC32TABLE);
                        let length: number = 0;
                        for (let i: number = 0; i < data.compressedData.length; i++) {
                            length += data.compressedData[i].length;
                        }
                        data.compressedSize = length;
                        data.compressionType = '\x08\x00'; //Deflated = 8
                    } else {
                        data.compressedSize = input.length;
                        data.crc32Value = zipArchive.calculateCrc32Value(0, input, CRC32TABLE);
                        data.compressionType = '\x00\x00'; // Stored = 0
                        (data.compressedData as Uint8Array[]).push(input);
                    }
                    resolve(data);
                };
                reader.readAsArrayBuffer(item.data as Blob);
            } else {
                let data: CompressedData = {
                    fileName: item as string, crc32Value: 0, compressedData: '', compressedSize: 0, uncompressedDataSize: 0,
                    compressionType: '\x00\x00', isDirectory: true
                };
                resolve(data);
            }
        });
        return promise;
    }
    private compressData(input: Uint8Array, data: CompressedData, crc32Table: number[]): void {
        let compressor: CompressedStreamWriter = new CompressedStreamWriter(true);
        let currentIndex: number = 0;
        let nextIndex: number = 0;
        do {
            if (currentIndex >= input.length) {
                compressor.close();
                break;
            }
            nextIndex = Math.min(input.length, currentIndex + 16384);
            let subArray: Uint8Array = input.subarray(currentIndex, nextIndex);
            data.crc32Value = this.calculateCrc32Value(data.crc32Value, subArray, crc32Table);
            compressor.write(subArray, 0, nextIndex - currentIndex);
            currentIndex = nextIndex;
        } while (currentIndex <= input.length);
        data.compressedData = compressor.compressedData;
        compressor.destroy();
    }
    private constructZippedObject(zipParts: ZippedObject[], data: CompressedData, dirLength: number, isDirectory: boolean): number {
        let extFileAttr: number = 0;
        let date: Date = new Date();
        if (isDirectory) {
            extFileAttr = extFileAttr | 0x00010;  // directory flag
        }
        extFileAttr = extFileAttr | (0 & 0x3F);
        let header: string = this.writeHeader(data, date);
        let localHeader: string = 'PK\x03\x04' + header + data.fileName;
        let centralDir: string = this.writeCentralDirectory(data, header, dirLength, extFileAttr);
        zipParts.push({ localHeader: localHeader, centralDir: centralDir, compressedData: data });
        return dirLength + localHeader.length + data.compressedSize;
    }
    private writeHeader(data: CompressedData, date: Date): string {
        let zipHeader: string = '';
        zipHeader += '\x0A\x00' + '\x00\x00'; // version needed to extract & general purpose bit flag
        zipHeader += data.compressionType;  // compression method Deflate=8,Stored=0
        zipHeader += this.getBytes(this.getModifiedTime(date), 2);  // last modified Time
        zipHeader += this.getBytes(this.getModifiedDate(date), 2);  // last modified date
        zipHeader += this.getBytes(data.crc32Value, 4);   // crc-32 value
        zipHeader += this.getBytes(data.compressedSize, 4);   // compressed file size
        zipHeader += this.getBytes(data.uncompressedDataSize, 4); // uncompressed file size
        zipHeader += this.getBytes(data.fileName.length, 2);    // file name length
        zipHeader += this.getBytes(0, 2);    // extra field length
        return zipHeader;
    }
    private writeZippedContent(fileName: string, zipData: ZippedObject[], localDirLen: number, skipFileSave: boolean): Blob {
        let cenDirLen: number = 0;
        let buffer: ArrayBuffer[] = [];
        for (let i: number = 0; i < zipData.length; i++) {
            let item: ZippedObject = zipData[i];
            cenDirLen += item.centralDir.length;
            buffer.push(this.getArrayBuffer(item.localHeader));
            while (item.compressedData.compressedData.length) {
                buffer.push((item.compressedData.compressedData as Uint8Array[]).shift().buffer);
            }
        }
        for (let i: number = 0; i < zipData.length; i++) {
            buffer.push(this.getArrayBuffer(zipData[i].centralDir));
        }
        buffer.push(this.getArrayBuffer(this.writeFooter(zipData, cenDirLen, localDirLen)));
        let blob: Blob = new Blob(buffer, { type: 'application/zip' });
        if (!skipFileSave) {
            Save.save(fileName, blob);
        }
        return blob;
    }
    private writeCentralDirectory(data: CompressedData, localHeader: string, offset: number, externalFileAttribute: number): string {
        let directoryHeader: string = 'PK\x01\x02' +
            this.getBytes(0x0014, 2) + localHeader +    // inherit from file header
            this.getBytes(0, 2) +  // comment length
            '\x00\x00' + '\x00\x00' +    // internal file attributes 
            this.getBytes(externalFileAttribute, 4) +    // external file attributes
            this.getBytes(offset, 4) + // local fileHeader relative offset
            data.fileName;
        return directoryHeader;
    }
    private writeFooter(zipData: ZippedObject[], centralLength: number, localLength: number): string {
        let dirEnd: string = 'PK\x05\x06' + '\x00\x00' + '\x00\x00' +
            this.getBytes(zipData.length, 2) + this.getBytes(zipData.length, 2) +
            this.getBytes(centralLength, 4) + this.getBytes(localLength, 4) +
            this.getBytes(0, 2);
        return dirEnd;
    }
    private getArrayBuffer(input: string): ArrayBuffer {
        let a: Uint8Array = new Uint8Array(input.length);
        for (let j: number = 0; j < input.length; ++j) {
            a[j] = input.charCodeAt(j) & 0xFF;
        }
        return a.buffer;
    }
    private getBytes(value: number, offset: number): string {
        let bytes: string = '';
        for (let i: number = 0; i < offset; i++) {
            bytes += String.fromCharCode(value & 0xff);
            value = value >>> 8;
        }
        return bytes;
    }
    private getModifiedTime(date: Date): number {
        let modTime: number = date.getHours();
        modTime = modTime << 6;
        modTime = modTime | date.getMinutes();
        modTime = modTime << 5;
        return modTime = modTime | date.getSeconds() / 2;
    }
    private getModifiedDate(date: Date): number {
        let modiDate: number = date.getFullYear() - 1980;
        modiDate = modiDate << 4;
        modiDate = modiDate | (date.getMonth() + 1);
        modiDate = modiDate << 5;
        return modiDate = modiDate | date.getDate();
    }
    private calculateCrc32Value(crc32Value: number, input: Uint8Array, crc32Table: number[]): number {
        crc32Value ^= -1;
        for (let i: number = 0; i < input.length; i++) {
            crc32Value = (crc32Value >>> 8) ^ crc32Table[(crc32Value ^ input[i]) & 0xFF];
        }
        return (crc32Value ^ (-1));
    }
    /**
     * construct cyclic redundancy code table
     * @private
     */
    public static initCrc32Table(): void {
        let i: number;
        for (let j: number = 0; j < 256; j++) {
            i = j;
            for (let k: number = 0; k < 8; k++) {
                i = ((i & 1) ? (0xEDB88320 ^ (i >>> 1)) : (i >>> 1));
            }
            CRC32TABLE[j] = i;
        }
    }
    public static findValueFromEnd(stream: Stream, value: number, maxCount: number) {
        if (stream == null)
            throw new DOMException("stream");

        //   if( !stream.CanSeek || !stream.CanRead )
        //     throw new ArgumentOutOfRangeException( "We need to have seekable and readable stream." );

        // read last 4 bytes and compare with required value
        let lStreamSize: number = stream.inputStream.buffer.byteLength;

        if (lStreamSize < 4)
            return -1;

        let arrBuffer: Uint8Array = new Uint8Array(4);
        let lLastPos: number = Math.max(0, lStreamSize - maxCount);
        let lCurrentPosition: number = lStreamSize - 1 - INT_SIZE;

        stream.position = lCurrentPosition;
        stream.read(arrBuffer, 0, INT_SIZE);
        let uiCurValue: number = arrBuffer[0];
        let bFound: boolean = (uiCurValue == value);

        if (!bFound) {
            while (lCurrentPosition > lLastPos) {
                // remove unnecessary byte and replace it with new value.
                uiCurValue <<= 8;
                lCurrentPosition--;
                stream.position = lCurrentPosition;
                uiCurValue += stream.readByte();

                if (uiCurValue == value) {
                    bFound = true;
                    break;
                }
            }
        }

        return bFound ? lCurrentPosition : -1;
    }
    /// <summary>
    /// Extracts Int32 value from the stream.
    /// </summary>
    /// <param name="stream">Stream to read data from.</param>
    /// <returns>Extracted value.</returns>
    public static ReadInt32(stream: Stream): number {


        
        let buffer: Uint8Array = new Uint8Array(INT_SIZE);



        if (stream.read(buffer, 0, INT_SIZE) != INT_SIZE) {
            throw new DOMException("Unable to read value at the specified position - end of stream was reached.");
        }

        return Utils.bitConverterToInt32(buffer, 0);
    }
    /// <summary>
    /// Extracts Int16 value from the stream.
    /// </summary>
    /// <param name="stream">Stream to read data from.</param>
    /// <returns>Extracted value.</returns>
    public static ReadInt16(stream: Stream): number {
        let buffer: Uint8Array = new Uint8Array(SHORT_SIZE)
        if (stream.read(buffer, 0, SHORT_SIZE) != SHORT_SIZE) {
            throw new DOMException("Unable to read value at the specified position - end of stream was reached.");
        }

        return Utils.bitConverterToInt16(buffer, 0);
    }
    /// <summary>
    /// Extracts unsigned Int16 value from the stream.
    /// </summary>
    /// <param name="stream">Stream to read data from.</param>
    /// <returns>Extracted value.</returns>
    public static ReadUInt16(stream: Stream): number {
        {
            let buffer: Uint8Array = new Uint8Array(SHORT_SIZE)
            if (stream.read(buffer, 0, SHORT_SIZE) != SHORT_SIZE) {
                throw new DOMException("Unable to read value at the specified position - end of stream was reached.");
            }

            return Utils.bitConverterToInt16(buffer, 0);
        }
    }

}
export class ZipArchiveItemHelper {
    public compressedStream : Uint8Array;
    public name: string;
    public unCompressedStream : Uint8Array;
    /// <summary>
    /// Zip header signature.
    /// </summary>
    public headerSignature: number = 0x04034b50;
    /// <summary>
    /// General purpose bit flag.
    /// </summary>
    private options: number;
    /// <summary>
    /// Compression method.
    /// </summary>
    private compressionMethod: number;
    /// <summary>
    /// Indicates whether we should check Crc value when reading item's data. Check
    /// is performed when user gets access to decompressed data for the first time.
    /// </summary>
    public checkCrc: boolean = true;
    /// <summary>
    /// Crc.
    /// </summary>
    private crc32: number = 0;
    /// <summary>
    /// Compressed data size.
    /// </summary>
    private compressedSize: number;
    /// <summary>
    /// Original (not compressed) data size.
    /// </summary>
    private originalSize: number;
    /// <summary>
    /// Offset to the local header.
    /// </summary>
    private localHeaderOffset: number;
    /// <summary>
    /// Item's external attributes.
    /// </summary>
    private externalAttributes: number;
    /// <summary>
    /// Read data from the stream based on the central directory.
    /// </summary>
    /// <param name="stream">Stream to read data from, stream.Position must point at just after correct file header.</param>
    public readCentralDirectoryData(stream: Stream): void {
        // on the current moment we ignore "version made by" and "version needed to extract" fields.
        stream.position += 4;

        this.options = ZipArchive.ReadInt16(stream);
        this.compressionMethod = ZipArchive.ReadInt16(stream);
        this.checkCrc = (this.compressionMethod != 99); //COmpression.Defalte != SecurityConstants.AES





        //m_bCompressed = true;

        // on the current moment we ignore "last mod file time" and "last mod file date" fields.
        let lastModified: number = ZipArchive.ReadInt32(stream);

        //LastModified = ConvertToDateTime(lastModified);

        this.crc32 = Utils.bitConverterToUInt32(ZipArchive.ReadInt32(stream));
        this.compressedSize = ZipArchive.ReadInt32(stream);
        this.originalSize = ZipArchive.ReadInt32(stream);

        let iFileNameLength = ZipArchive.ReadInt16(stream);
        let iExtraFieldLenth = ZipArchive.ReadInt16(stream);
        let iCommentLength = ZipArchive.ReadInt16(stream);

        // on the current moment we ignore and "disk number start" (2 bytes),
        // "internal file attributes" (2 bytes).
        stream.position += 4;

        this.externalAttributes = ZipArchive.ReadInt32(stream);
        this.localHeaderOffset = ZipArchive.ReadInt32(stream);

        let arrBuffer: Uint8Array = new Uint8Array(iFileNameLength);

        stream.read(arrBuffer, 0, iFileNameLength);


        let m_strItemName = Utils.byteToString(arrBuffer);
        m_strItemName = m_strItemName.replace("\\", "/");
this.name = m_strItemName;
        stream.position += iExtraFieldLenth + iCommentLength;
        if (this.options != 0) this.options = 0;
    }
    /// <summary>
    /// Reads zipped data from the stream.
    /// </summary>
    /// <param name="stream">Stream to read data from.</param>
    /// <param name="checkCrc">Indicates whether we should check crc value after data decompression.</param>
    public readData(stream: Stream, checkCrc: boolean): void {
        if (stream.length == 0)
            throw new DOMException("stream");

        stream.position = this.localHeaderOffset;
        this.checkCrc = checkCrc;

        this.readLocalHeader(stream);
        this.readCompressedData( stream );
    }
    public decompressData(): void {
        if(this.compressionMethod == 8){
            if( this.originalSize > 0 )
            {
this.decompressDataOld();
            }
        }
    }
    private decompressDataOld(): void
    {
      let reader: CompressedStreamReader = new CompressedStreamReader( this.compressedStream, true );

      let decompressedData: Stream;
        if(this.originalSize>0)
            decompressedData = new Stream(new Uint8Array(this.originalSize));
      let arrBuffer:Uint8Array = new Uint8Array(BufferSize );
      let iReadBytes: number;
      let past:Uint8Array = new Uint8Array(0);
        while ((iReadBytes = reader.read(arrBuffer, 0, BufferSize)) > 0) {
//             past = new Uint8Array(decompressedData.length);
// let currentBlock: Uint8Array = arrBuffer.subarray(0, iReadBytes);
            decompressedData.write(arrBuffer.subarray(0, iReadBytes), 0, iReadBytes);
        }
        this.unCompressedStream = decompressedData.toByteArray();
        //   this.originalSize = decompressedData.Length;
        //   m_bControlStream = true;
        //   m_streamData = decompressedData;
        //   decompressedData.SetLength( m_lOriginalSize );
        //   decompressedData.Capacity = ( int )m_lOriginalSize;

        if (this.checkCrc) {
            //TODO: fix this
            //CheckCrc(decompressedData.ToArray());

        }

        //m_streamData.Position = 0;
    }
    /// <summary>
    /// Extracts local header from the stream.
    /// </summary>
    /// <param name="stream">Stream to read data from.</param>
    private readLocalHeader(stream: Stream) {
        if (stream.length == 0)
            throw new DOMException("stream");

        if (ZipArchive.ReadInt32(stream) != this.headerSignature)
            throw new DOMException("Can't find local header signature - wrong file format or file is corrupt.");

        // TODO: it is good to verify data read from the central directory record,
        // but on the current moment we simply skip it.
        stream.position += 22;

        let iNameLength = ZipArchive.ReadInt16(stream);
        let iExtraLength = ZipArchive.ReadUInt16(stream);

        if (this.compressionMethod == 99) //SecurityConstants.AES
        {
            // stream.Position += iNameLength + 8;
            // m_archive.EncryptionAlgorithm = (EncryptionAlgorithm)stream.ReadByte();
            // m_actualCompression = new byte[2];
            // stream.Read(m_actualCompression, 0, 2);
        }
        else if (iExtraLength > 2) {
            stream.position += iNameLength;
            let headerVal = ZipArchive.ReadInt16(stream);
            if (headerVal == 0x0017) //PKZipEncryptionHeader
                throw new DOMException("UnSupported");
            else
                stream.position += iExtraLength - 2;
        }
        else
            stream.position += iNameLength + iExtraLength;
    }
        /// <summary>
    /// Extracts compressed data from the stream.
    /// </summary>
    /// <param name="stream">Stream to read data from.</param>
    private readCompressedData(stream: Stream ): void
    {
        let dataStream: Stream;
      if( this.compressedSize > 0 )
      {
        
        let iBytesLeft: number = this.compressedSize;
        dataStream = new Stream(new Uint8Array(iBytesLeft));
        

        let arrBuffer: Uint8Array = new Uint8Array(BufferSize);

        while( iBytesLeft > 0 )
        {
          let iBytesToRead: number = Math.min( iBytesLeft, BufferSize );

          if( stream.read( arrBuffer, 0, iBytesToRead ) != iBytesToRead )
            throw new DOMException( "End of file reached - wrong file format or file is corrupt." );
            dataStream.write(arrBuffer.subarray(0, iBytesToRead), 0, iBytesToRead);

          iBytesLeft -= iBytesToRead;
        }

        // if(m_archive.Password != null)
        // {
        //     byte[] dataBuffer = new byte[dataStream.Length];
        //     dataBuffer = dataStream.ToArray();
        //     dataStream=new MemoryStream( Decrypt(dataBuffer));
        // }
        this.compressedStream = new Uint8Array(dataStream.inputStream);
        // m_bControlStream = true;
      }
      else if(this.compressedSize<0) //If compression size is negative, then read until the next header signature reached.
      {
        //   MemoryStream dataStream = new MemoryStream();
        //   int bt = 0;
        //   bool proceed=true;
        //   while (proceed)
        //   {
        //       if ((bt = stream.ReadByte()) == Constants.HeaderSignatureStartByteValue)
        //       {
        //           stream.Position -= 1;
        //           int headerSignature = ZipArchive.ReadInt32(stream);
        //           if (headerSignature==Constants.CentralHeaderSignature || headerSignature==Constants.CentralHeaderSignature)
        //           {
        //               proceed = false;
                   
        //           }
        //           stream.Position -= 3;
        //       }
        //       if (proceed)
        //           dataStream.WriteByte((byte)bt);
        //   }
        //   m_streamData = dataStream;
        //   m_lCompressedSize = m_streamData.Length;
        //   m_bControlStream = true;
      }
      else if(this.compressedSize == 0)
      {
        //  m_streamData = new MemoryStream();
      }      
    }
}
/**
 * Class represent unique ZipArchive item
 * ```typescript
 * let archiveItem = new ZipArchiveItem(archive, 'directoryName\fileName.txt');
 * ```
 */
export class ZipArchiveItem {
    public data: Blob | ArrayBuffer;
    private decompressedStream: Blob | ArrayBuffer;
    private fileName: string;
    public get dataStream(): Blob | ArrayBuffer {
        return this.decompressedStream;
    }
    /**
     * Get the name of archive item
     * @returns string
     */
    get name(): string {
        return this.fileName;
    }
    /**
     * Set the name of archive item
     * @param  {string} value
     */
    set name(value: string) {
        this.fileName = value;
    }
    /**
     * constructor for creating {ZipArchiveItem} instance
     * @param {Blob|ArrayBuffer} data file data 
     * @param {itemName} itemName absolute file path
     */
    constructor(data: Blob | ArrayBuffer, itemName: string) {
        if (data === null || data === undefined) {
            throw new Error('ArgumentException: data cannot be null or undefined');
        }
        if (itemName === null || itemName === undefined) {
            throw new Error('ArgumentException: string cannot be null or undefined');
        }
        if (itemName.length === 0) {
            throw new Error('string cannot be empty');
        }
        this.data = data;
        this.name = itemName;
    }
    /**
     * release allocated un-managed resource
     * @returns {void}
     */
    public destroy(): void {
        this.fileName = undefined;
        this.data = undefined;
    }
}
export interface CompressedData {
    fileName: string;
    compressedData: Uint8Array[] | string;
    uncompressedDataSize: number;
    compressedSize: number;
    crc32Value: number;
    compressionType: string;
    isDirectory: boolean;
}
export interface ZippedObject {
    localHeader: string;
    centralDir: string;
    compressedData: CompressedData;
}
/**
 * Compression level.
 */
export type CompressionLevel =
    /* Pack without compression */
    'NoCompression' |
    /* Use normal compression, middle between speed and size*/
    'Normal';
/* eslint-enable */