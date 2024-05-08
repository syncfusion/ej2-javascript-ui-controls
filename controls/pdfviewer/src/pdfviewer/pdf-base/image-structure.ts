import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfViewer, PdfViewerBase } from '../index';
import {_PdfBaseStream, _PdfDictionary, _PdfName, _PdfReference, _PdfStream, _stringToBytes } from '@syncfusion/ej2-pdf';

/**
 * ImageStructureBase
 *
 * @hidden
 */

export class ImageStructureBase {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private m_imageDictionary: _PdfDictionary;
    private m_isImageStreamParsed: boolean = false;
    private m_isImageInterpolated: boolean = false;
    private m_imageFilter: string[];
    private isDualFilter: boolean = false;
    private m_colorspace: string;
    private numberOfComponents: number = 0;
    private internalColorSpace: string;
    private m_imageStream: _PdfBaseStream;
    constructor(stream: _PdfBaseStream, fontDictionary: _PdfDictionary) {
        if (!isNullOrUndefined(fontDictionary)) {
            this.m_imageStream = stream as _PdfBaseStream
            this.m_imageDictionary = fontDictionary as _PdfDictionary;
        }

    }
    /**
     * @private
     * 
     */
    public getImageStream() {
        this.m_isImageStreamParsed = true;
        let IsDecodeFilterDefined: boolean = true;
        let ImageDictionary: _PdfDictionary = this.m_imageDictionary;
        this.getImageInterpolation(ImageDictionary);
        let imageFilter = this.setImageFilter();
        let imageUnit8Array: Uint8Array = this.imageStream();
        if (isNullOrUndefined(imageFilter)) {
            this.m_imageFilter.push("FlateDecode");
            IsDecodeFilterDefined = false;
        }
        if (!isNullOrUndefined(imageFilter)) {
            for (let i = 0; i < imageFilter.length; i++) {
                if (imageFilter.length > 1) {
                    this.isDualFilter = true;
                }
                switch (imageFilter[parseInt(i.toString(), 10)]) {
                    case "DCTDecode": {
                        if (!this.m_imageDictionary.has("SMask") && !this.m_imageDictionary.has("Mask")) {
                            let colorSpace: any = this.setColorSpace();
                            if (colorSpace.name === "DeviceCMYK" || colorSpace.name === "DeviceN" || colorSpace.name === "DeviceGray" || colorSpace.name === "Separation" || colorSpace.name === "DeviceRGB" || (colorSpace.name === "ICCBased" && this.numberOfComponents === 4)) {
                                if (colorSpace.name === "DeviceRGB" && (this.m_imageDictionary.has("DecodeParms") || this.m_imageDictionary.has("Decode"))) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            this.m_imageFilter = null;
            return imageUnit8Array;
        }
        return null;
    }

    private setColorSpace(): any {
        if (isNullOrUndefined(this.m_colorspace)) {
            this.getColorSpace();
            return this.m_colorspace;
        }
    }

    private getColorSpace() {
        if (this.m_imageDictionary.has("ColorSpace")) {
            let filter: string[] = [];
            this.internalColorSpace = "";
            let colorspaceDictionary: _PdfDictionary = null;
            let value: any = null;
            let colorSpaceResources = null;
            if (this.m_imageDictionary.has("ColorSpace")) {
                const array = this.m_imageDictionary.getArray("ColorSpace");
                if (array && Array.isArray(array) && array.length > 0) {
                    value = this.m_imageDictionary.get("ColorSpace");
                }
            }
            if (this.m_imageDictionary._get("ColorSpace") instanceof _PdfReference) {
            }
            if (this.m_imageDictionary.get("ColorSpace") instanceof _PdfName) {
                this.m_colorspace = this.m_imageDictionary.get("ColorSpace");
            }
            if (!isNullOrUndefined(value) && !isNullOrUndefined(value[0] as _PdfName)) {

            }

        }
    }

    private setImageFilter() {
        if (isNullOrUndefined(this.m_imageFilter)) {
            this.m_imageFilter = this.getImageFilter();
        }
        return this.m_imageFilter;
    }

    private getImageFilter(): string[] {
        let imageFilter: string[] = [];
        if (!isNullOrUndefined(this.m_imageDictionary)) {
            if (this.m_imageDictionary.has("Filter")) {
                if (this.m_imageDictionary.get("Filter") instanceof _PdfName) {
                    imageFilter.push(this.m_imageDictionary.get("Filter").name);
                } else if (this.m_imageDictionary._get("Filter") instanceof _PdfReference) {

                }
            }
        }
        return imageFilter;
    }
    private getImageInterpolation(imageDictionary: _PdfDictionary) {
        if (!isNullOrUndefined(imageDictionary) && imageDictionary.has("Interpolate")) {
            this.m_isImageInterpolated = imageDictionary.get("Interpolate");
        }
    }

    private imageStream(): any {
        let content: Uint8Array = _stringToBytes(this.m_imageStream.getString(), false, true) as Uint8Array;
        return content;

    }

}
