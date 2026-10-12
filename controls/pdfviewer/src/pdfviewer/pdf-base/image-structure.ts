import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfViewer, PdfViewerBase } from '../index';
import {_PdfBaseStream, _PdfDictionary, _PdfName, _PdfReference, _stringToBytes } from '@syncfusion/ej2-pdf';

/**
 * ImageStructureBase
 *
 * @hidden
 */
export class ImageStructureBase {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private mImageDictionary: _PdfDictionary;
    private mIsImageStreamParsed: boolean = false;
    private mIsImageInterpolated: boolean = false;
    private mImageFilter: string[];
    private isDualFilter: boolean = false;
    private mColorspace: string;
    private numberOfComponents: number = 0;
    private internalColorSpace: string;
    private mImageStream: _PdfBaseStream;
    constructor(stream: _PdfBaseStream, fontDictionary: _PdfDictionary) {
        if (!isNullOrUndefined(fontDictionary)) {
            this.mImageStream = stream as _PdfBaseStream;
            this.mImageDictionary = fontDictionary as _PdfDictionary;
        }

    }
    /**
     * @private
     *@returns {void}
     */
    public getImageStream(): Uint8Array {
        this.mIsImageStreamParsed = true;
        let IsDecodeFilterDefined: boolean = true;
        const ImageDictionary: _PdfDictionary = this.mImageDictionary;
        this.getImageInterpolation(ImageDictionary);
        const imageFilter: string[] = this.setImageFilter();
        const imageUnit8Array: Uint8Array = this.imageStream();
        if (isNullOrUndefined(imageFilter)) {
            this.mImageFilter.push('FlateDecode');
            IsDecodeFilterDefined = false;
        }
        if (!isNullOrUndefined(imageFilter)) {
            for (let i: number = 0; i < imageFilter.length; i++) {
                if (imageFilter.length > 1) {
                    this.isDualFilter = true;
                }
                switch (imageFilter[parseInt(i.toString(), 10)]) {
                case 'DCTDecode': {
                    if (!this.mImageDictionary.has('SMask') && !this.mImageDictionary.has('Mask')) {
                        const colorSpace: any = this.setColorSpace();
                        if (colorSpace.name === 'DeviceCMYK' || colorSpace.name === 'DeviceN' || colorSpace.name === 'DeviceGray' || colorSpace.name === 'Separation' || colorSpace.name === 'DeviceRGB' || (colorSpace.name === 'ICCBased' && this.numberOfComponents === 4)) {
                            if (colorSpace.name === 'DeviceRGB' && (this.mImageDictionary.has('DecodeParms') || this.mImageDictionary.has('Decode'))) {
                                break;
                            }
                        }
                    }
                }
                }
            }
            this.mImageFilter = null;
            return imageUnit8Array;
        }
        return null;
    }

    private setColorSpace(): any {
        if (isNullOrUndefined(this.mColorspace)) {
            this.getColorSpace();
            return this.mColorspace;
        }
    }

    private getColorSpace(): void {
        if (this.mImageDictionary.has('ColorSpace')) {
            this.internalColorSpace = '';
            let value: any = null;
            if (this.mImageDictionary.has('ColorSpace')) {
                const array: any = this.mImageDictionary.getArray('ColorSpace');
                if (array && Array.isArray(array) && array.length > 0) {
                    value = this.mImageDictionary.get('ColorSpace');
                }
            }
            if (this.mImageDictionary.get('ColorSpace') instanceof _PdfName) {
                this.mColorspace = this.mImageDictionary.get('ColorSpace');
            }
        }
    }

    private setImageFilter(): string[] {
        if (isNullOrUndefined(this.mImageFilter)) {
            this.mImageFilter = this.getImageFilter();
        }
        return this.mImageFilter;
    }

    private getImageFilter(): string[] {
        const imageFilter: string[] = [];
        if (!isNullOrUndefined(this.mImageDictionary)) {
            if (this.mImageDictionary.has('Filter')) {
                if (this.mImageDictionary.get('Filter') instanceof _PdfName) {
                    imageFilter.push(this.mImageDictionary.get('Filter').name);
                }
            }
        }
        return imageFilter;
    }
    private getImageInterpolation(imageDictionary: _PdfDictionary): void {
        if (!isNullOrUndefined(imageDictionary) && imageDictionary.has('Interpolate')) {
            this.mIsImageInterpolated = imageDictionary.get('Interpolate');
        }
    }

    private imageStream(): any {
        const content: Uint8Array = _stringToBytes(this.mImageStream.getString(), false, true) as Uint8Array;
        return content;
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.mImageDictionary = null;
        this.mIsImageStreamParsed = null;
        this.mIsImageInterpolated = null;
        this.mImageFilter = null;
        this.isDualFilter = null;
        this.mColorspace = null;
        this.numberOfComponents = null;
        this.internalColorSpace = null;
        this.mImageStream = null;
    }

}
