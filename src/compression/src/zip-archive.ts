import { CompressedStreamWriter } from './compression-writer';
import { Save } from '@syncfusion/ej2-file-utils';
const CRC32TABLE: number[] = [];

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
}
/**
 * Class represent unique ZipArchive item
 * ```typescript
 * let archiveItem = new ZipArchiveItem(archive, 'directoryName\fileName.txt');
 * ```
 */
export class ZipArchiveItem {
    public data: Blob | ArrayBuffer;
    private fileName: string;
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