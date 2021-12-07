/**
 * ImageDecoder class
 */
import { ByteArray } from './byte-array';
import { PdfStream } from './../../primitives/pdf-stream';
import { DictionaryProperties } from './../../input-output/pdf-dictionary-properties';
import { PdfName } from './../../primitives/pdf-name';
import { PdfNumber } from './../../primitives/pdf-number';
import { PdfBoolean } from './../../primitives/pdf-boolean';
import { PdfDictionary } from './../../primitives/pdf-dictionary';
/**
 * Specifies the image `format`.
 * @private
 */
export enum ImageFormat {
    /**
     * Specifies the type of `Unknown`.
     * @hidden
     * @private
     */
    Unknown,
    /**
     * Specifies the type of `Bmp`.
     * @hidden
     * @private
     */
    Bmp,
    /**
     * Specifies the type of `Emf`.
     * @hidden
     * @private
     */
    Emf,
    /**
     * Specifies the type of `Gif`.
     * @hidden
     * @private
     */
    Gif,
    /**
     * Specifies the type of `Jpeg`.
     * @hidden
     * @private
     */
    Jpeg,
    /**
     * Specifies the type of `Png`.
     * @hidden
     * @private
     */
    Png,
    /**
     * Specifies the type of `Wmf`.
     * @hidden
     * @private
     */
    Wmf,
    /**
     * Specifies the type of `Icon`.
     * @hidden
     * @private
     */
    Icon
}
/**
 * `Decode the image stream`.
 * @private
 */
export class ImageDecoder {
    /**
     * Start of file markers.
     * @hidden
     * @private
     */
    private sof1Marker : number = 0x00C1;
    private sof2Marker : number = 0x00C2;
    private sof3Marker : number = 0x00C3;
    private sof5Marker : number = 0x00C5;
    private sof6Marker : number = 0x00C6;
    private sof7Marker : number = 0x00C7;
    private sof9Marker : number = 0x00C9;
    private sof10Marker : number = 0x00CA;
    private sof11Marker : number = 0x00CB;
    private sof13Marker : number = 0x00CD;
    private sof14Marker : number = 0x00CE;
    private sof15Marker : number = 0x00CF;
    /**
     * Number array for `png header`.
     * @hidden
     * @private
     */
    private static mPngHeader: number[] = [137, 80, 78, 71, 13, 10, 26, 10];
    /**
     * Number Array for `jpeg header`.
     * @hidden
     * @private
     */
    private static mJpegHeader: number[] = [255, 216];
    /**
     * Number array for `gif header`.
     * @hidden
     * @private
     */
    private static GIF_HEADER: string = 'G,I,F,8';
    /**
     * Number array for `bmp header.`
     * @hidden
     * @private
     */
    private static BMP_HEADER: string = 'B,M';
    /**
     * `memory stream` to store image data.
     * @hidden
     * @private
     */
    private mStream: ByteArray;
    /**
     * Specifies `format` of image.
     * @hidden
     * @private
     */
    private mFormat: ImageFormat = ImageFormat.Unknown;
    /**
     * `height` of image.
     * @hidden
     * @private
     */
    private mHeight: number;
    /**
     * `width` of image.
     * @hidden
     * @private
     */
    private mWidth: number;
    /**
     * `Bits per component`.
     * @default 8
     * @hidden
     * @private
     */
    private mbitsPerComponent : number = 8;
    /**
     * ByteArray to store `image data`.
     * @hidden
     * @private
     */
    private mImageData: ByteArray;
    /**
     * Store an instance of `PdfStream` for an image.
     * @hidden
     * @private
     */
    private imageStream : PdfStream;
    /**
     * 'offset' of image.
     * @hidden
     * @private
     */
    private offset : number;
    /**
     * Internal variable for accessing fields from `DictionryProperties` class.
     * @hidden
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * Initialize the new instance for `image-decoder` class.
     * @private
     */
    public constructor(stream: ByteArray) {
        this.mStream = stream;
        this.initialize();
    }
    /**
     * Gets the `height` of image.
     * @hidden
     * @private
     */
    public get height(): number {
        return this.mHeight;
    }
    /**
     * Gets the `width` of image.
     * @hidden
     * @private
     */
    public get width(): number {
        return this.mWidth;
    }
    /**
     * Gets `bits per component`.
     * @hidden
     * @private
     */
    public get bitsPerComponent() : number {
        return this.mbitsPerComponent;
    }
    /**
     * Gets the `size` of an image data.
     * @hidden
     * @private
     */
    public get size(): number {
        return this.mImageData.count;
    }
    /**
     * Gets the value of an `image data`.
     * @hidden
     * @private
     */
    public get imageData(): ByteArray {
        return this.mImageData;
    }
    /**
     * Gets the value of an `image data as number array`.
     * @hidden
     * @private
     */
    public get imageDataAsNumberArray() : ArrayBuffer {
        return this.mImageData.internalBuffer.buffer;
    }
    /**
     * `Initialize` image data and image stream.
     * @hidden
     * @private
     */
    private initialize(): void {
        if (this.mFormat === ImageFormat.Unknown && this.checkIfJpeg()) {
            this.mFormat = ImageFormat.Jpeg;
            this.parseJpegImage();
        }
        this.reset();
        this.mImageData = new ByteArray(this.mStream.count);
        this.mStream.read(this.mImageData, 0, this.mImageData.count);
    }
    /**
     * `Reset` stream position into 0.
     * @hidden
     * @private
     */
    private reset(): void {
        this.mStream.position = 0;
    }
    /**
     * `Parse` Jpeg image.
     * @hidden
     * @private
     */
    private parseJpegImage(): void {
        this.reset();
        let imgData: ByteArray = new ByteArray(this.mStream.count);
        this.mStream.read(imgData, 0, imgData.count);
        let i: number = 4;
        let isLengthExceed : boolean = false;
        /* tslint:disable */
        let length: number = imgData.getBuffer(i) * 256 + imgData.getBuffer(i + 1);
        while (i < imgData.count) {
            i += length;
            if (i < imgData.count) {
                if (imgData.getBuffer(i + 1) === 192) {
                    this.mHeight = imgData.getBuffer(i + 5) * 256 + imgData.getBuffer(i + 6);
                    this.mWidth = imgData.getBuffer(i + 7) * 256 + imgData.getBuffer(i + 8);
                    return;
                } else {
                    i += 2;
                    length = imgData.getBuffer(i) * 256 + imgData.getBuffer(i + 1);
                }
            } else {
                isLengthExceed = true;
                break;
            }
        }
        if (isLengthExceed) {
            this.mStream.position = 0;
            this.skip(this.mStream, 2);
            this.readExceededJPGImage(this.mStream);
        }
        /* tslint:enable */
    }
    /**
     * Gets the image `format`.
     * @private
     * @hidden
     */
    public get format(): ImageFormat {
        return this.mFormat;
    }
    /**
     * `Checks if JPG`.
     * @private
     * @hidden
     */
    private checkIfJpeg(): boolean {
        this.reset();
        for (let i: number = 0; i < ImageDecoder.mJpegHeader.length; i++) {
            if (ImageDecoder.mJpegHeader[i] !== this.mStream.readByte(i)) {
                return false;
            }
            this.mStream.position++;
        }
        return true;
    }
    /**
     * Return image `dictionary`.
     * @hidden
     * @private
     */
    public getImageDictionary() : PdfStream {
        if (this.mFormat === ImageFormat.Jpeg) {
            let tempArrayBuffer : number = this.imageData.internalBuffer.length;
            this.imageStream = new PdfStream();
            this.imageStream.isImage = true;
            let tempString : string = '';
            let decodedString : string = '';
            for (let i : number = 0; i < this.imageDataAsNumberArray.byteLength; i++ ) {
                tempString += String.fromCharCode(null, this.mStream.readByte(i));
            }
            for (let i : number = 0; i < tempString.length; i++) {
                if (i % 2 !== 0) {
                    decodedString += tempString[i];
                }
            }
            this.imageStream.data = [decodedString];
            this.imageStream.compress = false;
            this.imageStream.items.setValue(this.dictionaryProperties.type, new PdfName(this.dictionaryProperties.xObject));
            this.imageStream.items.setValue(this.dictionaryProperties.subtype, new PdfName(this.dictionaryProperties.image));
            this.imageStream.items.setValue(this.dictionaryProperties.width, new PdfNumber(this.width));
            this.imageStream.items.setValue(this.dictionaryProperties.height, new PdfNumber(this.height));
            this.imageStream.items.setValue(this.dictionaryProperties.bitsPerComponent, new PdfNumber(this.bitsPerComponent));
            this.imageStream.items.setValue(this.dictionaryProperties.filter, new PdfName(this.dictionaryProperties.dctdecode));
            this.imageStream.items.setValue(this.dictionaryProperties.colorSpace, new PdfName(this.getColorSpace() as string));
            this.imageStream.items.setValue(this.dictionaryProperties.decodeParms, this.getDecodeParams());
            return this.imageStream;
        } else {
            return this.imageStream;
        }
    }
    /**
     * Return `colorSpace` of an image.
     * @hidden
     * @private
     */
    private getColorSpace() : string {
        return this.dictionaryProperties.deviceRgb;
    }
    /**
     * Return `decode parameters` of an image.
     * @hidden
     * @private
     */
    private getDecodeParams() : PdfDictionary {
        let decodeParams : PdfDictionary = new PdfDictionary();
        decodeParams.items.setValue(this.dictionaryProperties.columns, new PdfNumber(this.width));
        decodeParams.items.setValue(this.dictionaryProperties.blackIs1, new PdfBoolean(true));
        decodeParams.items.setValue(this.dictionaryProperties.k, new PdfNumber(-1));
        decodeParams.items.setValue(this.dictionaryProperties.predictor, new PdfNumber(15));
        decodeParams.items.setValue(this.dictionaryProperties.bitsPerComponent, new PdfNumber(this.bitsPerComponent));
        return decodeParams;
    }

    /**
     * 'readExceededJPGImage' stream 
     * @hidden
     * @private
     */
    private readExceededJPGImage(stream: ByteArray): void {
        this.mStream = stream;
        let isContinueReading : boolean = true;
        while (isContinueReading) {
            let marker : number =  this.getMarker(stream);
            switch (marker) {
                case this.sof1Marker:
                case this.sof2Marker:
                case this.sof3Marker:
                case this.sof5Marker:
                case this.sof6Marker:
                case this.sof7Marker:
                case this.sof9Marker:
                case this.sof10Marker:
                case this.sof11Marker:
                case this.sof13Marker:
                case this.sof14Marker:
                case this.sof15Marker:
                    stream.position += 3;
                    this.mHeight = this.mStream.readNextTwoBytes(stream);
                    this.mWidth = this.mStream.readNextTwoBytes(stream);
                    isContinueReading = false;
                    break;
                default:
                this.skipStream(stream);
                    break;
            }
        }
    }
    /**
     * 'skip' stream 
     * @hidden
     * @private
     */
    private skip(stream: ByteArray, noOfBytes: number): void {
        this.mStream = stream;
        let temp : ByteArray =  new ByteArray(noOfBytes);
        this.mStream.read(temp, 0, temp.count);
    }
    /**
     * 'getMarker' stream 
     * @hidden
     * @private
     */
    private getMarker(stream: ByteArray): number {
        let skippedByte :  number = 0;
        let marker : number = 32;
        marker = stream.readByte(this.mStream.position);
        stream.position++;
        while (marker !== 255) {
            skippedByte++;
            marker = stream.readByte(this.mStream.position); stream.position++;
        }
        do {
            marker = stream.readByte(this.mStream.position);
            stream.position++;
        }
        while (marker === 255);
        return marker;
    }
    /**
     * 'skipStream' stream 
     * @hidden
     * @private
     */
    private skipStream(stream: ByteArray): void {
        let markerLength : number = this.mStream.readNextTwoBytes(stream) - 2;
        if (markerLength > 0) {
            stream.position += markerLength;
        }
    }
}