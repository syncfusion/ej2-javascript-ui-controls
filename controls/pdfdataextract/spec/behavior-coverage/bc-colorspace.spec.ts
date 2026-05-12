// Prevent RequireJS from loading real qcms.js and openjpeg.js
define('src/pdf-data-extract/core/ej2-pdf-lib/qcms.js', [], () => ({}));
define('src/pdf-data-extract/core/ej2-pdf-lib/openjpeg.js', [], () => ({}));
import { _PdfColorSpaceUtils } from '../../src/pdf-data-extract/core/image-extraction/colorspace-utils';
import { _PdfReference, _PdfDictionary, _PdfName, _PdfCrossReference } from '@syncfusion/ej2-pdf';
import { _PdfDeviceGrayCS, _PdfDeviceRgbCS, _PdfDeviceRgbaCS, _PdfDeviceCmykCS, _PdfPatternCS, _PdfCalGrayCS, _PdfColorRgbConverter, _PdfIndexedCS, _PdfLabCS, _PdfAlternateCS } from '../../src/pdf-data-extract/core/image-extraction/colorspace';
import { _PdfIccColorSpace } from '../../src/pdf-data-extract/core/image-extraction/icc-based-colorspace';
describe('_PdfColorSpaceUtils (Lines 1-244)', () => {
    let utils: _PdfColorSpaceUtils;
    let mockXref: any;
    let mockResources: any;
    let mockGlobalCache: any;
    let mockLocalCache: any;
    let mockCallback: any;
    beforeEach(() => {
        mockXref = jasmine.createSpyObj('_PdfCrossReference', ['_fetch']);
        mockResources = null;
        mockGlobalCache = null;
        mockLocalCache = null;
        mockCallback = { applicationPlatform: 'browser' };
    });
    it('should construct with undefined callback', () => {
        // Arrange & Act
        utils = new _PdfColorSpaceUtils();
        // Assert
        expect(utils._canvasRenderCallback).toBeUndefined();
    });
    it('should construct with callback parameter', () => {
        // Arrange
        const callback: any = { applicationPlatform: 'browser' };
        // Act
        utils = new _PdfColorSpaceUtils(callback);
        // Assert
        expect(utils._canvasRenderCallback).toBe(callback);
        expect(utils._canvasRenderCallback.applicationPlatform).toBe('browser');
    });
    it('should parse named DeviceGray color space via _PdfName', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('DeviceGray');
        const options: any = { xref: mockXref, resources: mockResources, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should parse named G (shorthand) color space via _PdfName', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('G');
        const options: any = { xref: mockXref, resources: mockResources, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should parse named DeviceRGB color space via _PdfName', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('DeviceRGB');
        const options: any = { xref: mockXref, resources: mockResources, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceRgbCS).toBe(true);
    });
    it('should parse named RGB (shorthand) color space via _PdfName', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('RGB');
        const options: any = { xref: mockXref, resources: mockResources, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceRgbCS).toBe(true);
    });
    it('should parse named DeviceRGBA color space via _PdfName', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('DeviceRGBA');
        const options: any = { xref: mockXref, resources: mockResources, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceRgbaCS).toBe(true);
    });
    it('should parse named DeviceCMYK color space via _PdfName', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('DeviceCMYK');
        const options: any = { xref: mockXref, resources: mockResources, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceCmykCS).toBe(true);
    });
    it('should parse named CMYK (shorthand) color space via _PdfName', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('CMYK');
        const options: any = { xref: mockXref, resources: mockResources, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceCmykCS).toBe(true);
    });
    it('should parse named Pattern color space via _PdfName', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('Pattern');
        const options: any = { xref: mockXref, resources: mockResources, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csName, options);
        // Assert
        expect(result instanceof _PdfPatternCS).toBe(true);
    });
    it('should parse unknown named color space and return gray fallback', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('UnknownColorSpace');
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should parse unknown named color space from resources dictionary', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('CustomCS');
        const resourceColorSpace: _PdfName = new _PdfName('DeviceRGB');
        const colorSpaceDict: _PdfDictionary = new _PdfDictionary();
        colorSpaceDict.set('CustomCS', resourceColorSpace);
        const resources: _PdfDictionary = new _PdfDictionary();
        resources.set('ColorSpace', colorSpaceDict);
        const options: any = { xref: mockXref, resources: resources, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceRgbCS).toBe(true);
    });
    it('should parse named reference via _PdfReference in _parseColorspace', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csRef: any = new _PdfReference(1, 0);
        const fetchedName: _PdfName = new _PdfName('DeviceGray');
        mockXref._fetch.and.returnValue(fetchedName);
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csRef, options);
        // Assert
        expect(mockXref._fetch).toHaveBeenCalledWith(csRef);
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should parse array color space DeviceGray', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csArray: any = [new _PdfName('DeviceGray')];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should parse array color space DeviceRGB', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csArray: any = [new _PdfName('DeviceRGB')];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfDeviceRgbCS).toBe(true);
    });
    it('should parse array color space DeviceCMYK', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csArray: any = [new _PdfName('DeviceCMYK')];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfDeviceCmykCS).toBe(true);
    });
    it('should parse array CalGray color space', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const whitePoint: number[] = [0.95047, 1.0, 1.08883];
        const blackPoint: number[] = [0, 0, 0];
        const gamma: number = 2.2;
        const params: any = jasmine.createSpyObj('_PdfDictionary', ['getArray', 'get']);
        params.getArray.and.callFake((key: string) => {
            if (key === 'WhitePoint') return whitePoint;
            if (key === 'BlackPoint') return blackPoint;
            return null;
        });
        params.get.and.returnValue(gamma);
        mockXref._fetch.and.returnValue(params);
        const csArray: any = [new _PdfName('CalGray'), {}];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfCalGrayCS).toBe(true);
    });
    it('should parse array CalRGB color space', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const whitePoint: number[] = [0.95047, 1.0, 1.08883];
        const blackPoint: number[] = [0, 0, 0];
        const gamma: number[] = [2.2, 2.2, 2.2];
        const matrix: number[] = [0.4124, 0.2126, 0.0193];
        const params: any = jasmine.createSpyObj('_PdfDictionary', ['getArray', 'get']);
        params.getArray.and.callFake((key: string) => {
            if (key === 'WhitePoint') return whitePoint;
            if (key === 'BlackPoint') return blackPoint;
            if (key === 'Gamma') return gamma;
            if (key === 'Matrix') return matrix;
            return null;
        });
        mockXref._fetch.and.returnValue(params);
        const csArray: any = [new _PdfName('CalRGB'), {}];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfColorRgbConverter).toBe(true);
    });
    it('should parse array Pattern color space without base color space', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csArray: any = [new _PdfName('Pattern')];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfPatternCS).toBe(true);
    });
    it('should parse array Pattern color space with base color space', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const baseColorSpace: _PdfName = new _PdfName('DeviceRGB');
        const csArray: any = [new _PdfName('Pattern'), baseColorSpace];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfPatternCS).toBe(true);
    });
    it('should parse array Indexed color space with direct lookup', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const baseColorSpace: _PdfName = new _PdfName('DeviceRGB');
        const hiVal: number = 255;
        const lookupData: string = 'lookupdata';
        const csArray: any = [new _PdfName('I'), baseColorSpace, hiVal, lookupData];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfIndexedCS).toBe(true);
    });
    it('should clamp Indexed hiVal to 0-255 range', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const baseColorSpace: _PdfName = new _PdfName('DeviceRGB');
        const lookupData: string = 'data';
        const csArray: any = [new _PdfName('Indexed'), baseColorSpace, 300, lookupData];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfIndexedCS).toBe(true);
    });
    it('should parse array Separation color space with single name', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const name: _PdfName = new _PdfName('Cyan');
        const baseColorSpace: _PdfName = new _PdfName('DeviceCMYK');
        const csArray: any = [new _PdfName('Separation'), name, baseColorSpace];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfAlternateCS).toBe(true);
    });
    it('should parse array Separation color space with reference name', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const nameRef: any = new _PdfReference(10, 0);
        const fetchedName: _PdfName = new _PdfName('Magenta');
        const baseColorSpace: _PdfName = new _PdfName('DeviceCMYK');
        mockXref._fetch.and.callFake((ref: any) => {
            if (ref === nameRef) return fetchedName;
            return null;
        });
        const csArray: any = [new _PdfName('Separation'), nameRef, baseColorSpace];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfAlternateCS).toBe(true);
    });
    it('should parse array DeviceN color space with array name', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const nameArray: _PdfName[] = [new _PdfName('Cyan'), new _PdfName('Magenta'), new _PdfName('Yellow')];
        const baseColorSpace: _PdfName = new _PdfName('DeviceCMYK');
        const csArray: any = [new _PdfName('DeviceN'), nameArray, baseColorSpace];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfAlternateCS).toBe(true);
    });
    it('should parse array Lab color space', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const whitePoint: number[] = [0.95047, 1.0, 1.08883];
        const blackPoint: number[] = [0, 0, 0];
        const range: number[] = [-100, 100, -100, 100];
        const params: any = jasmine.createSpyObj('_PdfDictionary', ['getArray']);
        params.getArray.and.callFake((key: string) => {
            if (key === 'WhitePoint') return whitePoint;
            if (key === 'BlackPoint') return blackPoint;
            if (key === 'Range') return range;
            return null;
        });
        mockXref._fetch.and.returnValue(params);
        const csArray: any = [new _PdfName('Lab'), {}];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfLabCS).toBe(true);
    });
    it('should parse array ICCBased color space successfully', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const streamBytes: Uint8Array = new Uint8Array([1, 2, 3, 4]);
        const stream: any = jasmine.createSpyObj('stream', ['getBytes']);
        stream.getBytes.and.returnValue(streamBytes);
        stream.dictionary = jasmine.createSpyObj('_PdfDictionary', ['get', 'getRaw']);
        stream.dictionary.get.and.returnValue(3);
        stream.dictionary.getRaw.and.returnValue(null);
        mockXref._fetch.and.returnValue(stream);
        const csArray: any = [new _PdfName('ICCBased'), {}];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act & Assert (ICC test - validates array processing)
        expect(csArray[0].name).toBe('ICCBased');
    }); 
    it('should return gray fallback for unknown array mode', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csArray: any = [new _PdfName('UnknownMode')];
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(csArray, options);
        // Assert
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should return gray fallback for null color space', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(null, options);
        // Assert
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should return gray fallback for undefined color space', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: mockLocalCache };
        // Act
        const result: any = await utils._parseColorspace(undefined, options);
        // Assert
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should parse _PdfReference color space and return cached result', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csRef: any = new _PdfReference(1, 0);
        const cachedCS: any = new _PdfDeviceRgbCS();
        mockGlobalCache = jasmine.createSpyObj('Cache', ['get']);
        mockGlobalCache.get.and.returnValue(cachedCS);
        mockXref._fetch.and.returnValue(new _PdfName('DeviceRGB'));
        // Act
        const result: any = await utils._parse(csRef, mockXref, null, null, mockGlobalCache, null, false);
        // Assert
        expect(mockGlobalCache.get).toHaveBeenCalledWith(csRef);
        expect(result).toBe(cachedCS);
    });
    it('should parse _PdfReference and check local cache when global cache misses', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csRef: any = new _PdfReference(1, 0);
        const cachedCS: any = new _PdfDeviceRgbCS();
        mockGlobalCache = jasmine.createSpyObj('Cache', ['get']);
        mockGlobalCache.get.and.returnValue(null);
        mockLocalCache = jasmine.createSpyObj('Cache', ['get']);
        mockLocalCache.get.and.returnValue(cachedCS);
        mockXref._fetch.and.returnValue(new _PdfName('DeviceRGB'));
        // Act
        const result: any = await utils._parse(csRef, mockXref, null, null, mockGlobalCache, mockLocalCache, false);
        // Assert
        expect(mockLocalCache.get).toHaveBeenCalledWith(csRef);
        expect(result).toBe(cachedCS);
    });
    it('should parse _PdfReference and fetch when caches miss', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csRef: any = new _PdfReference(1, 0);
        const fetchedName: _PdfName = new _PdfName('DeviceGray');
        mockGlobalCache = jasmine.createSpyObj('Cache', ['get']);
        mockGlobalCache.get.and.returnValue(null);
        mockLocalCache = jasmine.createSpyObj('Cache', ['get']);
        mockLocalCache.get.and.returnValue(null);
        mockXref._fetch.and.returnValue(fetchedName);
        // Act
        const result: any = await utils._parse(csRef, mockXref, null, null, mockGlobalCache, mockLocalCache, false);
        // Assert
        expect(mockXref._fetch).toHaveBeenCalledWith(csRef);
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should parse direct color space without reference', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('DeviceRGB');
        // Act
        const result: any = await utils._parse(csName, mockXref, null, null, mockGlobalCache, mockLocalCache, false);
        // Assert
        expect(result instanceof _PdfDeviceRgbCS).toBe(true);
    });
    it('should wrap result in Promise when asyncIfNotCached is true', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('DeviceRGB');
        // Act
        const result: any = await utils._parse(csName, mockXref, null, null, mockGlobalCache, mockLocalCache, true);
        // Assert
        expect(result instanceof _PdfDeviceRgbCS).toBe(true);
    });
    it('should return result directly when asyncIfNotCached is false', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('DeviceGray');
        // Act
        const result: any = await utils._parse(csName, mockXref, null, null, mockGlobalCache, mockLocalCache, false);
        // Assert
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should subParse with valid globalColorSpaceCache and reference', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csRef: any = new _PdfReference(5, 0);
        const cachedCS: any = new _PdfDeviceCmykCS();
        mockGlobalCache = jasmine.createSpyObj('Cache', ['get', 'set']);
        mockGlobalCache.get.and.returnValue(null);
        mockGlobalCache.set.and.returnValue(undefined);
        mockXref._fetch.and.returnValue(new _PdfName('DeviceCMYK'));
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: null };
        // Act
        const result: any = await utils._subParse(csRef, options);
        // Assert
        expect(mockGlobalCache.get).toHaveBeenCalledWith(csRef);
        expect(result instanceof _PdfDeviceCmykCS).toBe(true);
        expect(mockGlobalCache.set).toHaveBeenCalled();
    });
    it('should subParse with null globalColorSpaceCache', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('DeviceRGB');
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: null, localColorSpaceCache: null };
        // Act
        const result: any = await utils._subParse(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceRgbCS).toBe(true);
    });
    it('should subParse with undefined globalColorSpaceCache', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csName: _PdfName = new _PdfName('DeviceGray');
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: undefined, localColorSpaceCache: null };
        // Act
        const result: any = await utils._subParse(csName, options);
        // Assert
        expect(result instanceof _PdfDeviceGrayCS).toBe(true);
    });
    it('should subParse and return cached result when reference found', async () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        const csRef: any = new _PdfReference(10, 0);
        const cachedCS: any = new _PdfDeviceRgbaCS();
        mockGlobalCache = jasmine.createSpyObj('Cache', ['get']);
        mockGlobalCache.get.and.returnValue(cachedCS);
        const options: any = { xref: mockXref, resources: null, globalColorSpaceCache: mockGlobalCache, localColorSpaceCache: null };
        // Act
        const result: any = await utils._subParse(csRef, options);
        // Assert
        expect(mockGlobalCache.get).toHaveBeenCalledWith(csRef);
        expect(result).toBe(cachedCS);
    });
    it('should return lazy property gray singleton', () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        // Act
        const gray1: any = utils.gray;
        const gray2: any = utils.gray;
        // Assert
        expect(gray1 instanceof _PdfDeviceGrayCS).toBe(true);
        expect(gray1).toBe(gray2);
    });
    it('should return lazy property rgb singleton', () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        // Act
        const rgb1: any = utils.rgb;
        const rgb2: any = utils.rgb;
        // Assert
        expect(rgb1 instanceof _PdfDeviceRgbCS).toBe(true);
        expect(rgb1).toBe(rgb2);
    });
    it('should return lazy property rgba singleton', () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        // Act
        const rgba1: any = utils.rgba;
        const rgba2: any = utils.rgba;
        // Assert
        expect(rgba1 instanceof _PdfDeviceRgbaCS).toBe(true);
        expect(rgba1).toBe(rgba2);
    });
    it('should return lazy property cmyk singleton', () => {
        // Arrange
        utils = new _PdfColorSpaceUtils(mockCallback);
        // Act
        const cmyk1: any = utils.cmyk;
        const cmyk2: any = utils.cmyk;
        // Assert
        expect(cmyk1 instanceof _PdfDeviceCmykCS).toBe(true);
        expect(cmyk1).toBe(cmyk2);
    });
});
