import { PdfDocument } from '../src/pdf/core/pdf-document';
import { _PdfBaseStream, _PdfStream } from '../src/pdf/core/base-stream';
import { PdfTemplate } from '../src/pdf/core/graphics/pdf-template'
import { _PdfDictionary, _PdfName } from '../src/pdf/core/pdf-primitives';
import { _JsonDocument } from '../src/pdf/core/import-export/json-document';
import { _PdfCrossReference } from '../src/pdf/core/pdf-cross-reference';
describe('pdf-template file mutation testing', () => {
    it('Property Level mutation testing', () => {
        const template = new PdfTemplate();
        expect(template._isSignature).toBeFalsy();
        expect(template._crossReference).toBeUndefined();
        expect(template._isReadOnly).toBeTruthy();
    });
    it("Construtor passing with empty stream with out dictioanry values", () => {
        const document = new PdfDocument();
        const stream = new _PdfStream([]);
        stream.dictionary = new _PdfDictionary(document._crossReference)
        const template = new PdfTemplate(stream, document._crossReference);
        const dictionary = template._content.dictionary;
        expect(dictionary._map.Subtype.name).toEqual("Form");
        expect(dictionary._map.Type.name).toEqual("XObject");
        const empty: _PdfCrossReference = undefined
        const template1 = new PdfTemplate(stream, empty);
        expect(template1._crossReference).toBeUndefined();
        const template2 = new PdfTemplate(null, document._crossReference);
        expect(template2._isReadOnly).toBeTruthy();

    });
    it("Construtor Should not reinitialize when Type and Subtype already exist", () => {
        const document = new PdfDocument();
        const stream = new _PdfStream([]);
        stream.dictionary = new _PdfDictionary(document._crossReference);

        stream.dictionary.set("Type", _PdfName.get("CustomType"));
        stream.dictionary.set("Subtype", _PdfName.get("CustomSubtype"));

        const template = new PdfTemplate(stream, document._crossReference);

        expect(template._content.dictionary.get("Type").name)
            .toEqual("CustomType");
        expect(template._content.dictionary.get("Subtype").name)
            .toEqual("CustomSubtype");
    });
    it("Should not calculate size when BBox contains less than 4 values", () => {
        const document = new PdfDocument();
        const stream = new _PdfStream([]);
        stream.dictionary = new _PdfDictionary(document._crossReference);
        stream.dictionary.set("Type", _PdfName.get("XObject"));
        stream.dictionary.set("Subtype", _PdfName.get("Form"));
        stream.dictionary.set("BBox", [0, 0, 100]); // length = 3
        const template = new PdfTemplate(stream, document._crossReference);
        expect(template._size).toBeUndefined();
    });
    it("Should set correct BBox values when array bounds are passed", () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([10, 20, 100, 200], document._crossReference);
        const bbox = template._content.dictionary.getArray('BBox');
        expect(bbox).toEqual([10, 20, 110, 220]);
    });
    it("Should create template when width and height are provided", () => {
        const template = new PdfTemplate({width: 100,height: 50});
        expect(template._size.width).toBe(100);
        expect(template._size.height).toBe(50);
    });
    it("Should not enter width-height branch when width is undefined", () => {
        const template = new PdfTemplate({height: 50} as any);
        expect(template._size).toBeUndefined();
    });
    it("Should not enter width-height branch when height is undefined", () => {
        const template = new PdfTemplate({width: 100} as any);
        expect(template._size).toBeUndefined();
    });
    it("Should not enter width-height branch when width is null", () => {
        const template = new PdfTemplate({width: null,height: 50 } as any);
        expect(template._size).toBeUndefined();
    });
    it("Should not enter width-height branch when height is null", () => {
        const template = new PdfTemplate({width: 100,height: null} as any);
        expect(template._size).toBeUndefined();
    });
    it("Should use provided x and y values when both are defined", () => {
        const template = new PdfTemplate({x: 10,y: 20,width: 100,height: 200});
        const bbox = template._content.dictionary.getArray('BBox');
        expect(bbox).toEqual([10, 20, 110, 220]);
    });
    it("Should default x and y to zero when x is undefined", () => {
        const template = new PdfTemplate({y: 20,width: 100,height: 200} as any);
        const bbox = template._content.dictionary.getArray('BBox');
        expect(bbox).toEqual([0, 0, 100, 200]);
    });
    it("Should default x and y to zero when y is undefined", () => {
        const template = new PdfTemplate({x: 10,width: 100,height: 200} as any);
        const bbox = template._content.dictionary.getArray('BBox');
        expect(bbox).toEqual([0, 0, 100, 200]);
    });
    it("Should default x and y to zero when x is null", () => {
        const template = new PdfTemplate({x: null,y: 20,width: 100,height: 200} as any);
        const bbox = template._content.dictionary.getArray('BBox');
        expect(bbox).toEqual([0, 0, 100, 200]);
    });
    it("Should default x and y to zero when y is null", () => {
        const template = new PdfTemplate({x: 10,y: null,width: 100,height: 200} as any);
        const bbox = template._content.dictionary.getArray('BBox');
        expect(bbox).toEqual([0, 0, 100, 200]);
    });
    it("Should export stream in annotation export mode", () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([0, 0, 100, 100], document._crossReference);
        const dictionary = new _PdfDictionary(document._crossReference);
        const stream = new _PdfStream([]);
        dictionary.set("AP", stream);
        template._exportStream(
            dictionary,
            document._crossReference,
            "AP"
        );
        expect(template._appearance).toBeDefined();
        expect(template._appearance.length).toBeGreaterThan(0);
    });
    it('should not assign crossReference to JsonDocument when hasCrossReference is false', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([0, 0, 100, 100], document._crossReference);

        template._appearance = JSON.stringify({
            normal: {
                stream: {}
            }
        });
        let capturedCrossReference: any;
        spyOn(_JsonDocument.prototype, '_parseStream').and.callFake(function (this: _JsonDocument) {
            capturedCrossReference = this._crossReference;
            return new _PdfStream([]);
        });

        template._importStream(false, false);

        expect(capturedCrossReference).toBeUndefined();
    });
    it('should process pending resources when value is "styker was here"', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([0, 0, 100, 100], document._crossReference);
        template._content._pendingResources = 'styker was here';
        const parseSpy = spyOn(_JsonDocument.prototype, '_parseStreamElements');
        template._updatePendingResource(document._crossReference);
        expect(parseSpy).toHaveBeenCalled();
    });
    it('should not process pending resources when value is empty string', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([0, 0, 100, 100], document._crossReference);
        template._content._pendingResources = '';
        const parseSpy = spyOn(_JsonDocument.prototype, '_parseStreamElements');
        template._updatePendingResource(document._crossReference);
        expect(parseSpy).not.toHaveBeenCalled();
    });
});
describe('pdf-template constructor survived mutation testing', () => {
    function getStreamBytes(stream: any): any[] {
        const candidates: string[] = ['bytes', '_bytes', 'data', '_data', 'buffer', '_buffer'];
        for (const key of candidates) {
            if (key in stream && stream[key] !== null && typeof stream[key] !== 'undefined') {
                if (Array.isArray(stream[key])) {
                    return stream[key];
                }
                if (ArrayBuffer.isView(stream[key])) {
                    return Array.from(stream[key] as any);
                }
            }
        }
        if (typeof stream.getBytes === 'function') {
            const bytes: any = stream.getBytes();
            return ArrayBuffer.isView(bytes) ? Array.from(bytes as any) : bytes;
        }
        fail('Unable to find stream bytes on PdfTemplate content stream');
        return [];
    }
    it('Constructor should initialize stream dictionary when Type is missing but Subtype exists, targets OR changed to AND mutant', () => {
        const document = new PdfDocument();
        const stream = new _PdfStream([]);
        stream.dictionary = new _PdfDictionary(document._crossReference);
        stream.dictionary.set('Subtype', _PdfName.get('CustomSubtype'));
        const template = new PdfTemplate(stream, document._crossReference);
        expect(template._content.dictionary.get('Type').name).toBe('XObject');
        expect(template._content.dictionary.get('Subtype').name).toBe('Form');
        expect(template._isReadOnly).toBe(true);
    });
    it('Constructor should initialize stream dictionary when Subtype is missing but Type exists, targets OR changed to AND mutant', () => {
        const document = new PdfDocument();
        const stream = new _PdfStream([]);
        stream.dictionary = new _PdfDictionary(document._crossReference);
        stream.dictionary.set('Type', _PdfName.get('CustomType'));
        const template = new PdfTemplate(stream, document._crossReference);
        expect(template._content.dictionary.get('Type').name).toBe('XObject');
        expect(template._content.dictionary.get('Subtype').name).toBe('Form');
        expect(template._isReadOnly).toBe(true);
    });
    it('Constructor should create array-based template with empty content stream, targets _PdfContentStream styker string mutant in Array.isArray branch', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([10, 20, 100, 200], document._crossReference);
        expect(template._size).toEqual({ width: 100, height: 200 });
        expect(template._content.dictionary.get('Type').name).toBe('XObject');
        expect(template._content.dictionary.get('Subtype').name).toBe('Form');
        expect(template._content.dictionary.getArray('BBox')).toEqual([10, 20, 110, 220]);
        expect(template._content.dictionary._crossReference).toBe(document._crossReference);
        expect(getStreamBytes(template._content)).toEqual([]);
    });
    it('Constructor should create size-object template with empty content stream and exact BBox, targets _PdfContentStream styker string mutant in width-height branch', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate({ x: 10, y: 20, width: 100, height: 200 }, document._crossReference);
        expect(template._size).toEqual({ width: 100, height: 200 });
        expect(template._content.dictionary.get('Type').name).toBe('XObject');
        expect(template._content.dictionary.get('Subtype').name).toBe('Form');
        expect(template._content.dictionary.getArray('BBox')).toEqual([10, 20, 110, 220]);
        expect(template._content.dictionary._crossReference).toBe(document._crossReference);
        expect(template._isNew).toBe(false);
        expect(getStreamBytes(template._content)).toEqual([]);
    });
    it('Constructor should create new size-object template without cross reference using empty content stream, targets _PdfContentStream styker string mutant and _isNew branch', () => {
        const template = new PdfTemplate({ width: 100, height: 50 });
        expect(template._size).toEqual({ width: 100, height: 50 });
        expect(template._content.dictionary.get('Type').name).toBe('XObject');
        expect(template._content.dictionary.get('Subtype').name).toBe('Form');
        expect(template._content.dictionary.getArray('BBox')).toEqual([0, 0, 100, 50]);
        expect(template._isNew).toBe(true);
        expect(getStreamBytes(template._content)).toEqual([]);
    });
});
describe('PdfTemplate _exportStream mutation testing', () => {
    it('_exportStream should set JsonDocument as annotation export before writing object', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([0, 0, 100, 100], document._crossReference);
        const dictionary = new _PdfDictionary(document._crossReference);
        const stream = new _PdfStream([1, 2, 3]);
        dictionary.set('AP', stream);
        let capturedAnnotationFlag: boolean | undefined;
        let capturedCrossReference: any;
        spyOn(_JsonDocument.prototype, '_writeObject').and.callFake(function (this: _JsonDocument, resourceTable: Map<any, any>, value: any, sourceDictionary: any, appearanceState: string) {
            capturedAnnotationFlag = this._isAnnotationExport;
            capturedCrossReference = this._crossReference;
            expect(resourceTable instanceof Map).toBe(true);
            expect(value).toBe(stream);
            expect(sourceDictionary).toBe(dictionary);
            expect(appearanceState).toBe('normal');
        });
        spyOn(_JsonDocument.prototype, '_convertToJson').and.returnValue('{"normal":{"stream":"exported"}}');
        const disposeSpy = spyOn(_JsonDocument.prototype, '_dispose');
        template._exportStream(dictionary, document._crossReference, 'AP');
        expect(capturedAnnotationFlag).toBe(true);
        expect(capturedCrossReference).toBe(document._crossReference);
        expect(template._appearance).toBe('{"normal":{"stream":"exported"}}');
        expect(_JsonDocument.prototype._writeObject).toHaveBeenCalledTimes(1);
        expect(_JsonDocument.prototype._convertToJson).toHaveBeenCalledTimes(1);
        expect(disposeSpy).toHaveBeenCalledTimes(1);
    });
    it('_exportStream should pass normal appearance state to _writeObject', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([0, 0, 100, 100], document._crossReference);
        const dictionary = new _PdfDictionary(document._crossReference);
        const normalStream = new _PdfStream([10, 20]);
        dictionary.set('N', normalStream);
        let capturedWriteArgs: any[] = [];
        spyOn(_JsonDocument.prototype, '_writeObject').and.callFake(function (...args: any[]) {
            capturedWriteArgs = args;
        });
        spyOn(_JsonDocument.prototype, '_convertToJson').and.returnValue('{"normal":true}');
        spyOn(_JsonDocument.prototype, '_dispose');
        template._exportStream(dictionary, document._crossReference, 'N');
        expect(capturedWriteArgs.length).toBe(4);
        expect(capturedWriteArgs[0] instanceof Map).toBe(true);
        expect(capturedWriteArgs[1]).toBe(normalStream);
        expect(capturedWriteArgs[2]).toBe(dictionary);
        expect(capturedWriteArgs[3]).toBe('normal');
        expect(template._appearance).toBe('{"normal":true}');
    });
});
describe('PdfTemplate _importStream mutation testing', () => {
    function createTemplateWithAppearance(crossReference: any, appearance: any): PdfTemplate {
        const template = new PdfTemplate([0, 0, 100, 100], crossReference);
        template._appearance = JSON.stringify(appearance);
        return template;
    }
    it('_importStream should assign crossReference to JsonDocument when hasCrossReference is true for normal stream import', () => {
        const document = new PdfDocument();
        const template = createTemplateWithAppearance(document._crossReference, {
            normal: {
                stream: {
                    dictionary: {
                        Type: 'XObject'
                    }
                }
            }
        });
        const parsedStream = new _PdfStream([]);
        parsedStream.dictionary = new _PdfDictionary();
        let capturedJsonDocumentCrossReference: any;
        spyOn(_JsonDocument.prototype, '_parseStream').and.callFake(function (this: _JsonDocument, stream: any) {
            capturedJsonDocumentCrossReference = this._crossReference;
            expect(stream).toEqual({
                dictionary: {
                    Type: 'XObject'
                }
            });
            return parsedStream;
        });
        const disposeSpy = spyOn(_JsonDocument.prototype, '_dispose');
        template._importStream(true, false);
        expect(capturedJsonDocumentCrossReference).toBe(document._crossReference);
        expect(template._content).toBe(parsedStream);
        expect(template._content.dictionary._crossReference).toBe(document._crossReference);
        expect(template._content.dictionary._updated).toBe(true);
        expect(_JsonDocument.prototype._parseStream).toHaveBeenCalledTimes(1);
        expect(disposeSpy).toHaveBeenCalledTimes(1);
    });
    it('_importStream should not assign parsed stream dictionary crossReference or updated flag when hasCrossReference is false', () => {
        const document = new PdfDocument();
        const template = createTemplateWithAppearance(document._crossReference, {
            normal: {
                stream: {
                    dictionary: {
                        Type: 'XObject'
                    }
                }
            }
        });
        const parsedStream = new _PdfStream([]);
        parsedStream.dictionary = new _PdfDictionary();
        let capturedJsonDocumentCrossReference: any;
        spyOn(_JsonDocument.prototype, '_parseStream').and.callFake(function (this: _JsonDocument) {
            capturedJsonDocumentCrossReference = this._crossReference;
            return parsedStream;
        });
        spyOn(_JsonDocument.prototype, '_dispose');
        template._importStream(false, false);
        expect(capturedJsonDocumentCrossReference).toBeUndefined();
        expect(template._content).toBe(parsedStream);
        expect(template._content.dictionary._crossReference).toBeUndefined();
        expect(template._content.dictionary._updated).toBeFalsy();
    });
    it('_importStream should use resources entry key when isResourceExport is true', () => {
        const document = new PdfDocument();
        const resourceDictJson = {
            Font: {
                F1: {
                    Type: 'Font'
                }
            }
        };
        const template = createTemplateWithAppearance(document._crossReference, {
            resources: {
                dict: resourceDictJson
            },
            normal: {
                stream: {
                    ignored: true
                }
            }
        });
        const resourceDictionary = new _PdfDictionary(document._crossReference);
        let capturedJsonDocumentCrossReference: any;
        const parseDictionarySpy = spyOn(_JsonDocument.prototype, '_parseDictionary').and.callFake(function (this: _JsonDocument, dict: any) {
            capturedJsonDocumentCrossReference = this._crossReference;
            expect(dict).toEqual(resourceDictJson);
            return resourceDictionary;
        });
        const parseStreamSpy = spyOn(_JsonDocument.prototype, '_parseStream');
        const updateSpy = spyOn(template._content.dictionary, 'update').and.callThrough();
        spyOn(_JsonDocument.prototype, '_dispose');
        template._importStream(true, true);
        expect(capturedJsonDocumentCrossReference).toBe(document._crossReference);
        expect(parseDictionarySpy).toHaveBeenCalledTimes(1);
        expect(parseStreamSpy).not.toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(updateSpy.calls.argsFor(0)[0]).toBe('Resources');
        expect(updateSpy.calls.argsFor(0)[1]).toBe(resourceDictionary);
    });
    it('_importStream should pass entry dict object to _parseDictionary during resource import', () => {
        const document = new PdfDocument();
        const dictEntry = {
            ProcSet: ['PDF', 'Text']
        };
        const template = createTemplateWithAppearance(document._crossReference, {
            resources: {
                dict: dictEntry,
                stream: {
                    shouldNotBeUsed: true
                }
            }
        });
        const parsedResourceDictionary = new _PdfDictionary(document._crossReference);
        const parseDictionarySpy = spyOn(_JsonDocument.prototype, '_parseDictionary').and.returnValue(parsedResourceDictionary);
        const updateSpy = spyOn(template._content.dictionary, 'update').and.callThrough();
        spyOn(_JsonDocument.prototype, '_dispose');
        template._importStream(true, true);
        expect(parseDictionarySpy).toHaveBeenCalledTimes(1);
        expect(parseDictionarySpy.calls.argsFor(0)[0]).toEqual(dictEntry);
        expect(updateSpy).toHaveBeenCalledWith('Resources', parsedResourceDictionary);
    });
    it('_importStream should not update Resources when resource import has no crossReference', () => {
        const document = new PdfDocument();
        const dictEntry = {
            XObject: {
                Im1: {}
            }
        };
        const template = createTemplateWithAppearance(document._crossReference, {
            resources: {
                dict: dictEntry
            }
        });
        const parsedResourceDictionary = new _PdfDictionary();
        let capturedJsonDocumentCrossReference: any;
        const parseDictionarySpy = spyOn(_JsonDocument.prototype, '_parseDictionary').and.callFake(function (this: _JsonDocument, dict: any) {
            capturedJsonDocumentCrossReference = this._crossReference;
            expect(dict).toEqual(dictEntry);
            return parsedResourceDictionary;
        });
        const updateSpy = spyOn(template._content.dictionary, 'update').and.callThrough();
        spyOn(_JsonDocument.prototype, '_dispose');
        template._importStream(false, true);
        expect(capturedJsonDocumentCrossReference).toBeUndefined();
        expect(parseDictionarySpy).toHaveBeenCalledTimes(1);
        expect(updateSpy).not.toHaveBeenCalled();
    });
    it('_importStream should update exact Resources key when resource import has crossReference', () => {
        const document = new PdfDocument();
        const template = createTemplateWithAppearance(document._crossReference, {
            resources: {
                dict: {
                    ColorSpace: {
                        CS1: {}
                    }
                }
            }
        });
        const parsedResourceDictionary = new _PdfDictionary(document._crossReference);
        spyOn(_JsonDocument.prototype, '_parseDictionary').and.returnValue(parsedResourceDictionary);
        const updateSpy = spyOn(template._content.dictionary, 'update').and.callThrough();
        spyOn(_JsonDocument.prototype, '_dispose');
        template._importStream(true, true);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(updateSpy.calls.argsFor(0)).toEqual(['Resources', parsedResourceDictionary]);
    });
    it('_importStream should parse normal stream entry when isResourceExport is false', () => {
        const document = new PdfDocument();
        const normalStreamEntry = {
            bytes: [1, 2, 3],
            dictionary: {
                Length: 3
            }
        };
        const template = createTemplateWithAppearance(document._crossReference, {
            resources: {
                dict: {
                    ignored: true
                }
            },
            normal: {
                stream: normalStreamEntry
            }
        });
        const parsedStream = new _PdfStream([1, 2, 3]);
        parsedStream.dictionary = new _PdfDictionary();
        const parseStreamSpy = spyOn(_JsonDocument.prototype, '_parseStream').and.returnValue(parsedStream);
        const parseDictionarySpy = spyOn(_JsonDocument.prototype, '_parseDictionary');
        spyOn(_JsonDocument.prototype, '_dispose');
        template._importStream(true, false);
        expect(parseStreamSpy).toHaveBeenCalledTimes(1);
        expect(parseStreamSpy.calls.argsFor(0)[0]).toEqual(normalStreamEntry);
        expect(parseDictionarySpy).not.toHaveBeenCalled();
        expect(template._content).toBe(parsedStream);
        expect(template._content.dictionary._crossReference).toBe(document._crossReference);
        expect(template._content.dictionary._updated).toBe(true);
    });
    it('_importStream should dispose JsonDocument even when requested entry is missing', () => {
        const document = new PdfDocument();
        const template = createTemplateWithAppearance(document._crossReference, {
            other: {
                stream: {}
            }
        });
        const parseStreamSpy = spyOn(_JsonDocument.prototype, '_parseStream');
        const parseDictionarySpy = spyOn(_JsonDocument.prototype, '_parseDictionary');
        const disposeSpy = spyOn(_JsonDocument.prototype, '_dispose');
        template._importStream(true, false);
        expect(parseStreamSpy).not.toHaveBeenCalled();
        expect(parseDictionarySpy).not.toHaveBeenCalled();
        expect(disposeSpy).toHaveBeenCalledTimes(1);
    });
});
describe('PdfTemplate _updatePendingResource mutation testing', () => {
    it('_updatePendingResource should not process when pendingResources is empty string, targets condition changed to true mutant', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([0, 0, 100, 100], document._crossReference);
        template._content._pendingResources = '';
        const parseSpy = spyOn(_JsonDocument.prototype, '_parseStreamElements');
        const disposeSpy = spyOn(_JsonDocument.prototype, '_dispose');
        template._updatePendingResource(document._crossReference);
        expect(parseSpy).not.toHaveBeenCalled();
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(template._content._pendingResources).toBe('');
    });
    it('_updatePendingResource should process when pendingResources is styker was here, targets pendingResources !== styker was here mutant', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([0, 0, 100, 100], document._crossReference);
        template._content._pendingResources = 'styker was here';
        let capturedCrossReference: any;
        let capturedContent: any;
        const parseSpy = spyOn(_JsonDocument.prototype, '_parseStreamElements').and.callFake(function (this: _JsonDocument, content: any) {
            capturedCrossReference = this._crossReference;
            capturedContent = content;
        });
        const disposeSpy = spyOn(_JsonDocument.prototype, '_dispose');
        template._updatePendingResource(document._crossReference);
        expect(parseSpy).toHaveBeenCalledTimes(1);
        expect(capturedCrossReference).toBe(document._crossReference);
        expect(capturedContent).toBe(template._content);
        expect(template._content._pendingResources).toBe('');
        expect(disposeSpy).toHaveBeenCalledTimes(1);
    });
    it('_updatePendingResource should process non-empty pendingResources and clear it exactly once', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([0, 0, 100, 100], document._crossReference);
        template._content._pendingResources = '{"Font":{"F1":{}}}';
        let parseCallPendingValue: any;
        const parseSpy = spyOn(_JsonDocument.prototype, '_parseStreamElements').and.callFake((content: any) => {
            parseCallPendingValue = content._pendingResources;
        });
        const disposeSpy = spyOn(_JsonDocument.prototype, '_dispose');
        template._updatePendingResource(document._crossReference);
        expect(parseSpy).toHaveBeenCalledTimes(1);
        expect(parseCallPendingValue).toBe('{"Font":{"F1":{}}}');
        expect(template._content._pendingResources).toBe('');
        expect(disposeSpy).toHaveBeenCalledTimes(1);
    });
    it('_updatePendingResource should not process when pendingResources is undefined', () => {
        const document = new PdfDocument();
        const template = new PdfTemplate([0, 0, 100, 100], document._crossReference);
        template._content._pendingResources = undefined;
        const parseSpy = spyOn(_JsonDocument.prototype, '_parseStreamElements');
        const disposeSpy = spyOn(_JsonDocument.prototype, '_dispose');
        template._updatePendingResource(document._crossReference);
        expect(parseSpy).not.toHaveBeenCalled();
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(template._content._pendingResources).toBeUndefined();
    });
});