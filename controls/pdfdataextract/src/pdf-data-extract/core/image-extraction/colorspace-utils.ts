import { _defineLazyProperty, _mathClamp, _PdfCrossReference, _PdfDictionary, _PdfName, _PdfReference } from '@syncfusion/ej2-pdf';
import { _PdfAlternateCS, _PdfCalGrayCS, _PdfColorRgbConverter, _PdfDeviceCmykCS, _PdfDeviceGrayCS, _PdfDeviceRgbaCS, _PdfDeviceRgbCS, _PdfIndexedCS, _PdfLabCS, _PdfPatternCS } from './colorspace';
import { _PdfIccColorSpace } from './icc-based-colorspace';
/**
 * Utilities for parsing and resolving PDF color spaces and producing color space objects.
 *
 * @private
 */
export class _PdfColorSpaceUtils {
    /**
     * Canvas or rendering environment callback surface used by color-space helpers.
     *
     * @private
     */
    _canvasRenderCallback: any; // eslint-disable-line
    constructor();
    constructor(callback: any); // eslint-disable-line
    constructor(callback?: any) { // eslint-disable-line
        this._canvasRenderCallback = callback;
    }
    /**
     * Parses an arbitrary color space value or reference and returns a resolved color space instance.
     *
     * @private
     * @param {any} colorSpace The raw color space name/array/reference to parse. // eslint-disable-line
     * @param {_PdfCrossReference} xref Cross-reference context to fetch indirect objects.
     * @param {any} resources The resource dictionary used to resolve named color spaces. // eslint-disable-line
     * @param {any} pdfFunctionFactory Factory to create PDF functions used by certain color spaces. // eslint-disable-line
     * @param {any} globalColorSpaceCache Global cache for resolved color spaces. // eslint-disable-line
     * @param {any} localColorSpaceCache Local cache for resolved color spaces within the scope. // eslint-disable-line
     * @param {boolean} asyncIfNotCached If `true`, wraps the result in a resolved Promise for async paths.
     * @returns {Promise<any>} A promise that resolves to the parsed color space instance. // eslint-disable-line
     */
    async _parse(colorSpace: any, xref: _PdfCrossReference, resources: any, pdfFunctionFactory: any, // eslint-disable-line
        globalColorSpaceCache: any, localColorSpaceCache: any, asyncIfNotCached: boolean): Promise<any> {  // eslint-disable-line
        const options: any = {xref, resources, pdfFunctionFactory, globalColorSpaceCache, localColorSpaceCache}; // eslint-disable-line
        let csRef: any; // eslint-disable-line
        if (colorSpace instanceof _PdfReference) {
            csRef = colorSpace;
            const cachedCS: any = // eslint-disable-line
                globalColorSpaceCache && globalColorSpaceCache.get(csRef) ||
                localColorSpaceCache && localColorSpaceCache.get(csRef);
            if (cachedCS) {
                return cachedCS;
            }
            colorSpace = xref._fetch(colorSpace);
        }
        const parsedCS: any = await this._parseColorspace(colorSpace, options); // eslint-disable-line
        return asyncIfNotCached ? Promise.resolve(parsedCS) : parsedCS;
    }
    /**
     * Parses a nested/base color space, consulting caches when available.
     *
     * @private
     * @param {any} cs The color space object/name/reference to be sub-parsed.
     * @param {any} options Shared options including xref, resources, and caches.
     * @returns {Promise<any>} A promise that resolves to the parsed color space.
     */
    async _subParse(cs: any, options: any): Promise<any> { // eslint-disable-line
        const { globalColorSpaceCache }: any = options; // eslint-disable-line
        let csRef: any; // eslint-disable-line
        if (globalColorSpaceCache !== null && typeof(globalColorSpaceCache) !== 'undefined' && cs instanceof _PdfReference) {
            csRef = cs;
            const cachedCS: any = globalColorSpaceCache.get(csRef); // eslint-disable-line
            if (cachedCS) {
                return cachedCS;
            }
        }
        const parsedCS:any =  await this._parseColorspace(cs, options); // eslint-disable-line
        if (csRef) {
            globalColorSpaceCache.set(null, csRef, parsedCS);
        }
        return parsedCS;
    }
    /**
     * Core parser that resolves named, array, ICC-based, and pattern color spaces into implementations.
     *
     * @private
     * @param {any} cs A color space descriptor to parse.
     * @param {any} options Parsing context including xref, resources, and caches.
     * @returns {Promise<any>} A promise that resolves to a color space implementation or a fallback.
     */
    async _parseColorspace(cs: any, options: any): Promise<any> { // eslint-disable-line
        const { xref, resources } = options;
        if (cs instanceof _PdfReference) {
            cs = xref._fetch(cs);
        }
        if (cs instanceof _PdfName) {
            switch (cs.name) {
            case 'G':
            case 'DeviceGray':
                return this.gray;
            case 'RGB':
            case 'DeviceRGB':
                return this.rgb;
            case 'DeviceRGBA':
                return this.rgba;
            case 'CMYK':
            case 'DeviceCMYK':
                return this.cmyk;
            case 'Pattern':
                return new _PdfPatternCS(/* baseCS = */ null);
            default:
                if (resources instanceof _PdfDictionary) {
                    const colorSpaces: any = resources.get('ColorSpace'); // eslint-disable-line
                    if (colorSpaces instanceof _PdfDictionary) {
                        const resourcesCS: any = colorSpaces.get(cs.name); // eslint-disable-line
                        if (resourcesCS) {
                            if (resourcesCS instanceof _PdfName) {
                                return await this._parseColorspace(resourcesCS, options);
                            }
                            cs = resourcesCS;
                            break;
                        }
                    }
                }
                return this.gray;
            }
        }
        if (Array.isArray(cs)) {
            let mode: string;
            if (cs[0].name instanceof _PdfReference) {
                mode = xref._fetch(cs[0]).name;
            }
            mode = cs[0].name;
            let params: any; // eslint-disable-line
            let numComps: number;
            let baseCS: any; // eslint-disable-line
            let whitePoint: any; // eslint-disable-line
            let blackPoint: any; // eslint-disable-line
            let gamma: any; // eslint-disable-line
            let matrix: any; // eslint-disable-line
            let hiVal: any; // eslint-disable-line
            let lookup: any; // eslint-disable-line
            let name: any; // eslint-disable-line
            let range: any; // eslint-disable-line
            let stream: any; // eslint-disable-line
            let dictionary: _PdfDictionary;
            let altRaw: any; // eslint-disable-line
            let altCS: any; // eslint-disable-line
            switch (mode) {
            case 'G':
            case 'DeviceGray':
                return this.gray;
            case 'RGB':
            case 'DeviceRGB':
                return this.rgb;
            case 'CMYK':
            case 'DeviceCMYK':
                return this.cmyk;
            case 'CalGray':
                params = xref._fetch(cs[1]);
                whitePoint = params.getArray('WhitePoint');
                blackPoint = params.getArray('BlackPoint');
                gamma = params.get('Gamma');
                return new _PdfCalGrayCS(whitePoint, blackPoint, gamma);
            case 'CalRGB':
                params = xref._fetch(cs[1]);
                whitePoint = params.getArray('WhitePoint');
                blackPoint = params.getArray('BlackPoint');
                gamma = params.getArray('Gamma');
                matrix = params.getArray('Matrix');
                return new _PdfColorRgbConverter(whitePoint, blackPoint, gamma, matrix);
            case 'Pattern':
                baseCS = cs[1] || null;
                if (baseCS) {
                    baseCS = await this._subParse(baseCS, options);
                }
                return new _PdfPatternCS(baseCS);
            case 'I':
            case 'Indexed':
                baseCS = await this._subParse(cs[1], options);
                hiVal = _mathClamp(cs[2] instanceof _PdfReference ? xref._fetch(cs[2]) : cs[2], 0, 255);
                if (cs[3] instanceof _PdfReference) {
                    lookup = xref._fetch(cs[3]);
                } else {
                    lookup = cs[3];
                }
                return new _PdfIndexedCS(baseCS, hiVal, lookup);
            case 'Separation':
            case 'DeviceN':
                if (cs[1] instanceof _PdfReference) {
                    name =  xref._fetch(cs[1]);
                } else {
                    name = cs[1];
                }
                numComps = Array.isArray(name) ? name.length : 1;
                baseCS = await this._subParse(cs[2], options);
                return new _PdfAlternateCS(numComps, baseCS);
            case 'Lab':
                params = xref._fetch(cs[1]);
                whitePoint = params.getArray('WhitePoint');
                blackPoint = params.getArray('BlackPoint');
                range = params.getArray('Range');
                return new _PdfLabCS(whitePoint, blackPoint, range);
            case 'ICCBased':
                stream = xref._fetch(cs[1]);
                dictionary = stream.dictionary;
                numComps = dictionary.get('N');
                try {
                    const colorSpace: _PdfIccColorSpace = new _PdfIccColorSpace('ICCBased', numComps, stream.getBytes());
                    await colorSpace._initialize(this._canvasRenderCallback.applicationPlatform);
                    if (colorSpace._isUsable) {
                        await colorSpace._create();
                        return colorSpace;
                    }
                } catch (ex) {
                    altRaw = dictionary.getRaw('Alternate');
                }
                if (altRaw) {
                    altCS = await this._subParse(altRaw, options);
                    if (altCS.numComps === numComps) {
                        return altCS;
                    }
                }
                if (numComps === 1) {
                    return this.gray;
                } else if (numComps === 3) {
                    return this.rgb;
                } else if (numComps === 4) {
                    return this.cmyk;
                }
                break;
            default:
                return this.gray;
            }
        }
        return this.gray;
    }
    get gray(): any { // eslint-disable-line
        return _defineLazyProperty(this, 'gray', new _PdfDeviceGrayCS());
    }
    get rgb(): any { // eslint-disable-line
        return _defineLazyProperty(this, 'rgb', new _PdfDeviceRgbCS());
    }
    get rgba(): any { // eslint-disable-line
        return _defineLazyProperty(this, 'rgba', new _PdfDeviceRgbaCS());
    }
    get cmyk(): any { // eslint-disable-line
        return _defineLazyProperty(this, 'cmyk', new _PdfDeviceCmykCS());
    }
}

