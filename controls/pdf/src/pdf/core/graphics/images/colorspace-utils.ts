import { _PdfAlternateCS, _PdfCalGrayCS, _PdfColorRgbConverter, _PdfDeviceCmykCS, _PdfDeviceGrayCS, _PdfDeviceRgbaCS, _PdfDeviceRgbCS, _PdfIndexedCS, _PdfLabCS, _PdfPatternCS } from './colorspace';
import { _PdfDictionary, _PdfName, _PdfReference } from '../../pdf-primitives';
import { _mathClamp, _defineLazyProperty } from '../../utils';
import { _PdfCrossReference } from '../../pdf-cross-reference';
export class _PdfColorSpaceUtils {
    _parse(colorSpace: any, xref: _PdfCrossReference, resources: any, pdfFunctionFactory: any, // eslint-disable-line
        globalColorSpaceCache: any, localColorSpaceCache: any, asyncIfNotCached: boolean): any {  // eslint-disable-line
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
        const parsedCS: any = this._parseColorspace(colorSpace, options); // eslint-disable-line
        return asyncIfNotCached ? Promise.resolve(parsedCS) : parsedCS;
    }
    _subParse(cs: any, options: any): any { // eslint-disable-line
        const { globalColorSpaceCache }: any = options; // eslint-disable-line
        let csRef: any; // eslint-disable-line
        if (cs instanceof _PdfReference) {
            csRef = cs;
            const cachedCS: any = globalColorSpaceCache.get(csRef); // eslint-disable-line
            if (cachedCS) {
                return cachedCS;
            }
        }
        const parsedCS:any = this._parseColorspace(cs, options); // eslint-disable-line
        if (csRef) {
            globalColorSpaceCache.set(null, csRef, parsedCS);
        }
        return parsedCS;
    }
    _parseColorspace(cs: any, options: any): any { // eslint-disable-line
        const { xref, resources, pdfFunctionFactory} = options;
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
                                return this._parseColorspace(resourcesCS, options);
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
            let numComps: any; // eslint-disable-line
            let baseCS: any; // eslint-disable-line
            let whitePoint: any; // eslint-disable-line
            let blackPoint: any; // eslint-disable-line
            let gamma: any; // eslint-disable-line
            let matrix: any; // eslint-disable-line
            let hiVal: any; // eslint-disable-line
            let lookup: any; // eslint-disable-line
            let name: any; // eslint-disable-line
            let range: any; // eslint-disable-line
            let tintFn: any; // eslint-disable-line
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
                params = xref.fetchIfRef(cs[1]);
                whitePoint = params.getArray('WhitePoint');
                blackPoint = params.getArray('BlackPoint');
                gamma = params.get('Gamma');
                return new _PdfCalGrayCS(whitePoint, blackPoint, gamma);
            case 'CalRGB':
                params = xref.fetchIfRef(cs[1]);
                whitePoint = params.getArray('WhitePoint');
                blackPoint = params.getArray('BlackPoint');
                gamma = params.getArray('Gamma');
                matrix = params.getArray('Matrix');
                return new _PdfColorRgbConverter(whitePoint, blackPoint, gamma, matrix);
            case 'Pattern':
                baseCS = cs[1] || null;
                if (baseCS) {
                    baseCS = this._subParse(baseCS, options);
                }
                return new _PdfPatternCS(baseCS);
            case 'I':
            case 'Indexed':
                baseCS = this._subParse(cs[1], options);
                hiVal = _mathClamp(cs[2] instanceof _PdfReference ? xref._fetch(cs[2]) : cs[2], 0, 255);
                if (cs[3] instanceof _PdfReference) {
                    lookup = xref._fetch(cs[3]);
                } else {
                    lookup = cs[3];
                }
                return new _PdfIndexedCS(baseCS, hiVal, lookup);
            case 'Separation':
            case 'DeviceN':
                name = xref.fetchIfRef(cs[1]);
                numComps = Array.isArray(name) ? name.length : 1;
                baseCS = this._subParse(cs[2], options);
                tintFn = pdfFunctionFactory.create(cs[3]);
                return new _PdfAlternateCS(numComps, baseCS, tintFn);
            case 'Lab':
                params = xref.fetchIfRef(cs[1]);
                whitePoint = params.getArray('WhitePoint');
                blackPoint = params.getArray('BlackPoint');
                range = params.getArray('Range');
                return new _PdfLabCS(whitePoint, blackPoint, range);
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

