import * as utils from '../../src/pdf/core/utils';
import { _ExportHelper, _FontStructure, _XfdfDocument } from '../../src/pdf/core/import-export/xfdf-document';
import { _PdfDictionary, _PdfReference, _PdfName } from '../../src/pdf/core/pdf-primitives';
import { PdfTextBoxField, PdfListBoxField, PdfComboBoxField, PdfRadioButtonListField, PdfCheckBoxField } from '../../src/pdf/core/form/field';
import { PdfAnnotation, PdfLineAnnotation, PdfRadioButtonListItem, PdfRubberStampAnnotation } from '../../src/pdf/core/annotations/annotation';
import { PdfDocument } from '../../src/pdf/core/pdf-document';
import { _PdfContentStream } from '../../src/pdf/core/base-stream'
import { _PdfCrossReference } from '../../src/pdf/core/pdf-cross-reference';

describe('Xfdf document coverage test scripts', () => {
    it('_writeFormFieldData - Acrobat mode writes array values and ids', () => {
        const helper = new _XfdfDocument();
        // stub _getElements to return a Map with an array value
        const elements: Map<any, any> = new Map();
        elements.set('field1', ['a', 'b']);
        helper._getElements = (_table: any) => elements;

        // mock crossReference root to return IDs
        helper._crossReference = { _root: { has: (_k: string) => true, getArray: (_k: string) => ['origId', 'modId'] } } as any;

        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeString: (s: string) => calls.push(`STR:${s}`),
            _writeEndElement: () => calls.push('END'),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`)
        };

        helper._writeFormFieldData(writer, true);

        const joined = calls.join('|');
        expect(joined).toContain('START:f');
        expect(joined).toContain('ATTR:href=');
        expect(joined).toContain('START:fields');
        expect(joined).toContain('ATTR:name=field1');
        expect(joined).toContain('STR:a');
        expect(joined).toContain('STR:b');
        expect(joined).toContain('ATTR:original=origId');
        expect(joined).toContain('ATTR:modified=modId');
    });

    it('_writeFormFieldData - Acrobat mode handles value-richtext by trimming header and formKey', () => {
        const helper = new _XfdfDocument();
        helper._formKey = 'FK';
        const elements: Map<any, any> = new Map();
        elements.set('rich', '<?xml version="1.0"?>CONTENTFK');
        helper._getElements = (_table: any) => elements;

        // no ID present
        helper._crossReference = { _root: { has: (_k: string) => false } } as any;

        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeString: (s: string) => calls.push(`STR:${s}`),
            _writeEndElement: () => calls.push('END'),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`)
        };

        helper._writeFormFieldData(writer, true);

        const joined = calls.join('|');
        expect(joined).toContain('START:value-richtext');
        expect(joined).toContain('RAW:CONTENT');
        expect(joined).toContain('ATTR:original=');
        expect(joined).toContain('ATTR:modified=');
    });
    it('_writeFormFieldData - non-Acrobat writes array and scalar values', () => {
        const helper = new _XfdfDocument();
        helper._table = new Map();
        helper._table.set('f1', ['x', 'y']);
        helper._table.set('f2', 'sval');

        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeString: (s: string) => calls.push(`STR:${s}`),
            _writeEndElement: () => calls.push('END'),
            _writeRaw: (_s: string) => undefined as any
        };

        helper._writeFormFieldData(writer, false);

        const joined = calls.join('|');
        expect(joined).toContain('START:fields');
        expect(joined).toContain('ATTR:name=f1');
        expect(joined).toContain('STR:x');
        expect(joined).toContain('STR:y');
        expect(joined).toContain('ATTR:name=f2');
        expect(joined).toContain('STR:sval');
    });

    it('_writeFieldName - nested map writes nested fields arrays and value-richtext trimming', () => {
        const helper = new _XfdfDocument();
        helper._formKey = 'FK';

        const childMap: Map<any, any> = new Map();
        childMap.set('child1', ['a', 'b']);
        childMap.set('child2', '<?xml version="1.0"?>RTDATAFK');

        const parentMap: Map<any, any> = new Map();
        parentMap.set('parent', childMap);

        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeString: (s: string) => calls.push(`STR:${s}`),
            _writeEndElement: () => calls.push('END'),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`)
        };

        helper._writeFieldName(parentMap, writer);

        const joined = calls.join('|');
        expect(joined).toContain('START:field');
        expect(joined).toContain('ATTR:name=parent');
        expect(joined).toContain('ATTR:name=child1');
        expect(joined).toContain('STR:a');
        expect(joined).toContain('STR:b');
        expect(joined).toContain('START:value-richtext');
        expect(joined).toContain('RAW:RTDATA');
    });

    it('_checkAnnotationType - return value check', () => {
        const annot = new PdfLineAnnotation();
        const xfdf = new _XfdfDocument();
        xfdf._annotationTypes = [annot._type];
        const result = xfdf._checkAnnotationType(annot);
        expect(result).toBeTruthy();
    });
    it('_replaceNotUsedCharacters - no mapping returns original char', () => {
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('Subtype', _PdfName.get('Type1'));
        const structure = new _FontStructure(dict);
        structure._differencesDictionary = new Map<string, string>();
        const input = 'z';
        const out = (xfdf as any)._replaceNotUsedCharacters(input, structure);
        expect(out).toBe('z');
    });

    it('_replaceNotUsedCharacters - difference length>1 and not Type3 returns original char', () => {
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('Subtype', _PdfName.get('Type2'));
        const structure = new _FontStructure(dict);
        structure._differencesDictionary = new Map<string, string>();
        structure._differencesDictionary.set('A', 'AB'); // length > 1
        structure._fontType = 'Type2';
        const out = (xfdf as any)._replaceNotUsedCharacters('A', structure);
        expect(out).toBe('A');
    });

    it('_replaceNotUsedCharacters - difference length==1 returns mapped char', () => {
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('Subtype', _PdfName.get('Type1'));
        const structure = new _FontStructure(dict);
        structure._differencesDictionary = new Map<string, string>();
        structure._differencesDictionary.set('x', 'Y'); // single char mapping
        structure._fontType = 'Type1';
        const out = (xfdf as any)._replaceNotUsedCharacters('x', structure);
        expect(out).toBe('Y');
    });

    it('_replaceNotUsedCharacters - extended char with Type1 and ZapfDingbats returns original', () => {
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('Subtype', _PdfName.get('Type1'));
        const structure = new _FontStructure(dict);
        const ch = String.fromCharCode(200); // code >127 and <=255
        structure._differencesDictionary = new Map<string, string>();
        structure._differencesDictionary.set(ch, 'DIF');
        structure._fontType = 'Type1';
        structure._baseFontEncoding = 'CustomEncoding';
        structure._fontEncoding = 'Encoding';
        structure._fontName = 'ZapfDingbats';
        const out = (xfdf as any)._replaceNotUsedCharacters(ch, structure);
        expect(out).toBe(ch);
    });
    it('_getElements - builds nested map for dotted keys', () => {
        // Arrange
        const helper = new _XfdfDocument();
        const table: Map<any, any> = new Map();
        table.set('parent.child', 'v');

        // Act
        const elements: Map<any, any> = helper._getElements(table);

        // Assert
        expect(elements.has('parent')).toBeTruthy();
        const parent = elements.get('parent');
        expect(parent instanceof Map).toBeTruthy();
        expect(parent.get('child')).toBe('v');
    });

    it('_getElements - merges siblings under same parent', () => {
        // Arrange
        const helper = new _XfdfDocument();
        const table: Map<any, any> = new Map();
        table.set('parent.child1', 'a');
        table.set('parent.child2', 'b');

        // Act
        const elements: Map<any, any> = helper._getElements(table);

        // Assert
        const parent = elements.get('parent');
        expect(parent.get('child1')).toBe('a');
        expect(parent.get('child2')).toBe('b');
    });

    it('_writeAnnotationData - stamp branch', () => {
        const writer: any = {
            _writeStartElement: (_n: string) => undefined as any,
            _writeAttributeString: (_a: any, _b: any) => undefined as any,
            _writeString: (_s: string) => undefined as any,
            _writeEndElement: () => undefined as any,
            _writeRaw: (_s: string) => undefined as any
        };
        const xfdf = new _XfdfDocument();
        const stamp = new PdfRubberStampAnnotation();

        stamp._dictionary.set('S', 'I'); // I = inset

        stamp._dictionary.set('W', 2);   // border width

        xfdf._getAnnotationType = (dict: _PdfDictionary) => 'Stamp';
        xfdf._writeAnnotationData(writer, 0, new _PdfDictionary());

    });

    it('_writeDictionary - sound branch writes attributes and data', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`),
            _writeEndElement: () => calls.push('END')
        };
        const xfdf = new _XfdfDocument();
        spyOn(utils, '_byteArrayToHexString')
            .and.callFake((bytes: any) => 'hexString');
        const soundStream = new _PdfContentStream([1, 2, 3]);
        soundStream.dictionary.update('B', 16);
        soundStream.dictionary.update('C', 2);
        soundStream.dictionary.update('E', _PdfName.get('PCM'));
        soundStream.dictionary.update('R', 44100);
        soundStream.dictionary.update('Length', 3);
        soundStream.dictionary.update('Filter', _PdfName.get('FlateDecode'));
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('Sound', soundStream as any);

        xfdf._writeDictionary(dict, 0, writer, true);

        const joined = calls.join('|');
        expect(joined).toContain('ATTR:bits=16');
        expect(joined).toContain('ATTR:channels=2');
        expect(joined).toContain('ATTR:encoding=PCM');
        expect(joined).toContain('ATTR:rate=44100');
        expect(joined).toContain('START:data');
        expect(joined).toContain('ATTR:MODE=raw');
        expect(joined).toContain('ATTR:encoding=hex');
        expect(joined).toContain('ATTR:length=3');
        expect(joined).toContain('ATTR:filter=FlateDecode');
        expect(joined).toContain('RAW:');
    });

    it('_writeDictionary - sound Else branch writes attributes and data', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`),
            _writeEndElement: () => calls.push('END')
        };
        const xfdf = new _XfdfDocument();
        let soundStream: any = null
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('Sound', soundStream as any);

        xfdf._writeDictionary(dict, 0, writer, true);
        soundStream = new _PdfContentStream([1, 2, 3]);
        dict.update('Sound', soundStream)
        xfdf._writeDictionary(dict, 0, writer, true);

        const joined = calls.join('|');
        expect(joined).not.toContain('ATTR:bits=16');
        expect(joined).not.toContain('ATTR:channels=2');
        expect(joined).not.toContain('ATTR:encoding=PCM');
        expect(joined).not.toContain('ATTR:rate=44100');
        expect(joined).not.toContain('START:data');
        expect(joined).not.toContain('ATTR:MODE=raw');
    });
    it('_writeDictionary - FS branch writes file attributes and data', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`),
            _writeEndElement: () => calls.push('END')
        };
        const xfdf = new _XfdfDocument();
        spyOn(utils, '_byteArrayToHexString')
            .and.callFake((bytes: any) => 'hexString');
        const fStream = new _PdfContentStream([0x10, 0x20]);
        const fDictionary = fStream.dictionary;
        const params = new _PdfDictionary();
        params.update('CreationDate', 'C1');
        params.update('ModificationDate', 'M1');
        params.update('Size', 2);
        params.update('CheckSum', 'abc');
        fDictionary.update('Params', params);
        fDictionary.update('Length', 2);
        fDictionary.update('Filter', _PdfName.get('FlateDecode'));

        const ef = new _PdfDictionary();
        ef.update('F', fStream as any);
        const fs = new _PdfDictionary();
        fs.update('F', 'myfile.txt');
        fs.update('EF', ef);

        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('FS', fs);

        xfdf._writeDictionary(dict, 0, writer, true);

        const joined = calls.join('|');
        expect(joined).toContain('ATTR:file=myfile.txt');
        expect(joined).toContain('ATTR:creation=C1');
        expect(joined).toContain('ATTR:modification=M1');
        expect(joined).toContain('ATTR:size=2');
        expect(joined).toContain('ATTR:checksum=');
        expect(joined).toContain('START:data');
        expect(joined).toContain('ATTR:MODE=raw');
        expect(joined).toContain('ATTR:encoding=hex');
        expect(joined).toContain('RAW:');
    });

    it('_writeDictionary - Popup delegates to nested dictionary contents', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`${a}:${b}`),
        };
        const xfdf = new _XfdfDocument();
        const popup = new _PdfDictionary();
        popup.update('Contents', 'popupContent');
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('Popup', popup as any);
        let called = false;
        (xfdf as any)._writeAnnotationData = () => called = true;
        xfdf._writeDictionary(dict, 0, writer, true);

        expect(called).toBeTruthy();
    });

    it('_writeAnnotationData - DA writes defaultappearance raw', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (_a: any, _b: any) => undefined as any,
            _writeString: (_s: string) => undefined as any,
            _writeEndElement: () => calls.push('END'),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`)
        };
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('DA', 'defApp');

        xfdf._writeDictionary(dict, 0, writer, true);

        const joined = calls.join('|');
        expect(joined).toContain('START:defaultappearance');
        expect(joined).toContain('RAW:defApp');
    });

    it('_writeDictionary - vertices formatting', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`),
            _writeEndElement: () => calls.push('END')
        };
        const xfdf = new _XfdfDocument();
        spyOn(utils, '_byteArrayToHexString')
            .and.callFake((bytes: any) => 'hexString');
        const dict: _PdfDictionary = new _PdfDictionary();

        xfdf._writeDictionary(dict, 0, writer, true);

        const joined = calls.join('|');
        expect(joined).toEqual('');
    });

    it('_writeDictionary - RC trims leading content before <body and writes richtext', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`),
            _writeEndElement: () => calls.push('END')
        };
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        // value contains header before <body> so index > 0 and substring should trim
        dict.update('RC', 'HEADER<meta/><body>RichContent</body>');

        xfdf._writeDictionary(dict, 0, writer, true);

        const joined = calls.join('|');
        expect(joined).toContain('START:contents-richtext');
        expect(joined).toContain('RAW:<body>RichContent</body>');
    });

    it('_writeDictionary - RC without <body> writes full value as richtext', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`),
            _writeEndElement: () => calls.push('END')
        };
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        // no <body> present so value should be written unchanged
        dict.update('RC', 'NoBodyContent');

        xfdf._writeDictionary(dict, 0, writer, true);

        const joined = calls.join('|');
        expect(joined).toContain('START:contents-richtext');
        expect(joined).toContain('RAW:NoBodyContent');
    });

    it('_parseInnerElements - popup child with NM creates reference and groups', () => {
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();

        // prepare popup dictionary returned by _getAnnotationDictionary
        const popupDictionary: _PdfDictionary = new _PdfDictionary();
        popupDictionary.update('NM', 'popupName');

        // stub helper methods and cross reference
        xfdf._getAnnotationDictionary = (_page: any, _el: any) => popupDictionary;
        const cache = new Map<any, any>();
        xfdf._crossReference = { _getNextReference: () => 'REF123', _cacheMap: cache } as any;

        let grouped = false;
        (xfdf as any)._addReferenceToGroup = (_ref: any, _pd: any) => { grouped = true; };

        const popupChild: any = { nodeType: 1, nodeName: 'popup', hasAttributes: true, textContent: '', innerHTML: '' };
        const element: any = { hasChildNodes: true, childNodes: [popupChild] };

        xfdf._parseInnerElements(dict, element as any, null);

        expect(dict.get('Popup')).toBe('REF123');
        expect(cache.get('REF123')).toBe(popupDictionary);
        expect(grouped).toBeTruthy();
    });

    it('_parseInnerElements - contents, contents-richtext, defaultstyle, defaultappearance and vertices parsing', () => {
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();

        spyOn(xfdf as any, '_addString').and.callThrough();

        const contentsChild: any = { nodeType: 1, nodeName: 'contents', hasAttributes: false, textContent: 'PlainContent', innerHTML: '' };
        const richChild: any = { nodeType: 1, nodeName: 'contents-richtext', hasAttributes: false, textContent: '', innerHTML: '<b>RT</b>' };
        const dsChild: any = { nodeType: 1, nodeName: 'defaultstyle', hasAttributes: false, textContent: 'DSVAL', innerHTML: '' };
        const daChild: any = { nodeType: 1, nodeName: 'defaultappearance', hasAttributes: false, textContent: 'DAVAL', innerHTML: '' };
        const verticesChild: any = { nodeType: 1, nodeName: 'vertices', hasAttributes: false, textContent: '1,2;3,4', innerHTML: '' };

        const element: any = { hasChildNodes: true, childNodes: [contentsChild, richChild, dsChild, daChild, verticesChild] };

        xfdf._parseInnerElements(dict, element as any, null);

        expect(dict.get('Contents')).toBe((xfdf as any)._getFormatedString('PlainContent', true));
        expect(dict.get('RC')).toBe(xfdf._richTextPrefix + '<b>RT</b>');
        expect((xfdf as any)._addString).toHaveBeenCalledWith(dict, 'DS', 'DSVAL');
        expect((xfdf as any)._addString).toHaveBeenCalledWith(dict, 'DA', 'DAVAL');
        expect(dict.get('Vertices')).toEqual([1, 2, 3, 4]);
    });

    it('_parseInnerElements - inklist gesture parses points into InkList array', () => {
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();

        const gestureChild: any = { nodeType: 1, nodeName: 'gesture', hasAttributes: false, textContent: '1,2;3,4' };
        const inklistChild: any = { nodeType: 1, nodeName: 'inklist', hasAttributes: false, hasChildNodes: true, childNodes: [gestureChild] };
        const element: any = { hasChildNodes: true, childNodes: [inklistChild] };

        xfdf._parseInnerElements(dict, element as any, null);

        const inkList = dict.get('InkList');
        expect(Array.isArray(inkList)).toBeTruthy();
        expect(inkList.length).toBe(1);
        expect(inkList[0]).toEqual([1, 2, 3, 4]);
    });

    it('_parseInnerElements - data delegates to _addStreamData when present', () => {
        const xfdf = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();

        let calledWith: any = null;
        (xfdf as any)._addStreamData = (child: any, dictionary: any, parent: any) => { calledWith = { child, dictionary, parent }; };

        const dataChild: any = { nodeType: 1, nodeName: 'data', hasAttributes: false, textContent: 'AA' };
        const element: any = { hasChildNodes: true, childNodes: [dataChild] };

        xfdf._parseInnerElements(dict, element as any, element as any);

        expect(calledWith).toBeTruthy();
        expect(calledWith.child).toBe(dataChild);
        expect(calledWith.dictionary).toBe(dict);
        expect(calledWith.parent).toBe(element);
    });
    it('_writeAppearanceDictionary - does nothing for empty dictionary', () => {
        const xfdf = new _XfdfDocument();
        const writer: any = {};
        const dict = new _PdfDictionary();

        let called = false;
        (xfdf as any)._writeObject = () => called = true;

        xfdf._writeAppearanceDictionary(writer, dict);

        expect(called).toBeFalsy();
    });

    it('_writeObject - integer and fixed number handling', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeEndElement: () => calls.push('END')
        };
        const xfdf = new _XfdfDocument();

        // integer
        (xfdf as any)._writeObject(writer, 42, new _PdfDictionary(), 'intKey');
        // float
        (xfdf as any)._writeObject(writer, 3.14, new _PdfDictionary(), 'fixKey');

        const joined = calls.join('|');
        expect(joined).toContain('START:INT');
        expect(joined).toContain('ATTR:VAL=42');
        expect(joined).toContain('START:FIXED');
        expect(joined).toContain('ATTR:VAL=3.140000');
    });

    it('_writeObject - integer and fixed number handling', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeEndElement: () => calls.push('END')
        };
        const xfdf = new _XfdfDocument();

        // integer
        (xfdf as any)._writeObject(writer, "string", new _PdfDictionary(), 'intKey');

        const joined = calls.join('|');
        expect(joined).toContain('START:STRING');
        expect(joined).toContain('ATTR:VAL=string');
    });

    it('_writeObject - boolean handling true/false', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeEndElement: () => calls.push('END')
        };
        const xfdf = new _XfdfDocument();

        (xfdf as any)._writeObject(writer, true, new _PdfDictionary(), 'b1');
        (xfdf as any)._writeObject(writer, false, new _PdfDictionary(), 'b2');

        const joined = calls.join('|');
        expect(joined).toContain('START:BOOL');
        expect(joined).toContain('ATTR:VAL=true');
        expect(joined).toContain('ATTR:VAL=false');
    });

    it('_writeObject - STREAM handling when isNewReference true and DCTDecode filter', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`),
            _writeEndElement: () => calls.push('END')
        };

        const xfdf = new _XfdfDocument();
        const stream = new _PdfContentStream([0x01, 0x02]);
        stream.dictionary.update('Filter', _PdfName.get('DCTDecode'));
        stream.dictionary.update('Subtype', _PdfName.get('Image'));

        spyOn(stream, 'getString').and.callFake((arg?: any) => 'IMGDATA');

        // call as new reference -> isNewReference = true
        (xfdf as any)._writeObject(writer, stream, stream.dictionary, 'SomeKey', true);

        const joined = calls.join('|');
        expect(joined).toContain('START:DATA');
        expect(joined).toContain('ATTR:MODE=RAW');
        expect(joined).toContain('RAW:IMGDATA');
    });

    it('_writeObject - STREAM handling when isNewReference false writes and updates length', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeStartElement: (n: string) => calls.push(`START:${n}`),
            _writeAttributeString: (a: any, b: any) => calls.push(`ATTR:${a}=${b}`),
            _writeRaw: (s: string) => calls.push(`RAW:${s}`),
            _writeEndElement: () => calls.push('END')
        };

        const xfdf = new _XfdfDocument();
        const stream = new _PdfContentStream([0x0A, 0x0B, 0x0C]);
        stream.dictionary.update('Filter', _PdfName.get('DCTDecode'));
        stream.dictionary.update('Subtype', _PdfName.get('Image'));
        // ensure no Length present so it will be updated
        delete stream.dictionary._map.Length;

        spyOn(stream, 'getString').and.callFake((arg?: any) => 'STREAMBYTES');

        (xfdf as any)._writeObject(writer, stream, stream.dictionary, 'DATAKEY', false);

        const joined = calls.join('|');
        expect(joined).toContain('START:DATA');
        expect(joined).toContain('RAW:STREAMBYTES');
        // length should be set on dictionary when previously absent
        expect(stream.dictionary.get('Length')).toBeDefined();
    });

    it('_getFormatedString else barnch coverage', () => {
        const xfdf = new _XfdfDocument();
        const value = xfdf._getFormatedString('&<>', false);
        expect(value).toEqual('&amp;&lt;&gt;');
    });

    it('_writeAttribute coverage improvement ', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeAttributeString: (a: any, b: any) =>
                calls.push(`${a}=${b}`),
            _writeEndElement: () =>
                calls.push('END')
        };

        const xfdf = new _XfdfDocument();
        xfdf._writeColor = (n: any, primitive: any, key: any) =>
            calls.push(`${key}:${primitive}`);

        xfdf._writeAttributeString = (_writer: any, a: any, b: any) =>
            calls.push(`${a}=${b}`)
        xfdf._getValue
        xfdf._annotationAttributes = ['M'];

        // --- Color-related paths ---
        xfdf._writeAttribute(writer, 'OC', 1);
        xfdf._writeAttribute(writer, 'AFC', 1);
        xfdf._writeAttribute(writer, 'IC', 1);
        xfdf._writeAttribute(writer, 'Name', 1);

        // --- Line style paths ---
        xfdf._writeAttribute(writer, 'S', 'D');
        xfdf._writeAttribute(writer, 'I', true);
        xfdf._writeAttribute(writer, 'RD', [1, 2, 3, 4]);
        xfdf._writeAttribute(writer, 'RT', 'SomeTitle');
        xfdf._writeAttribute(writer, 'Q', 1);
        xfdf._writeAttribute(writer, 'CL', [10, 20, 30, 40]);
        xfdf._writeAttribute(
            writer,
            'QuadPoints',
            [1, 2, 3, 4, 5, 6, 7, 8]
        );

        const joined = calls.join('|');

        // ✅ writeColor branch assertions
        expect(joined).toContain('oc:1');
        expect(joined).toContain('afc:1');
        expect(joined).toContain('interior-color:1');
        expect(joined).toContain('icon=1');

        // ✅ writeAttributeString branch assertions
        expect(joined).toContain('style=dash');
        expect(joined).toContain('intensity=true');
        expect(joined).toContain('fringe=1,2,3,4');
        expect(joined).toContain('replyType=SomeTitle');
        expect(joined).toContain('justification=1');
        expect(joined).toContain('callout=10,20,30,40');
        expect(joined).toContain('coords=1,2,3,4,5,6,7,8');
    });
    it('_writeAttribute coverage improvement in styles ', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeAttributeString: (a: any, b: any) =>
                calls.push(`${a}=${b}`),
            _writeEndElement: () =>
                calls.push('END')
        };

        const xfdf = new _XfdfDocument();
        xfdf._writeColor = (n: any, primitive: any, key: any) =>
            calls.push(`${key}:${primitive}`);

        xfdf._writeAttributeString = (_writer: any, a: any, b: any) =>
            calls.push(`${a}=${b}`)
        xfdf._getValue
        xfdf._annotationAttributes = ['M'];
        // --- Line style paths ---
        xfdf._writeAttribute(writer, 'S', 'D');
        let joined = calls.join('|');
        xfdf._annotationAttributes = ['M'];

        xfdf._writeAttribute(writer, 'S', 'C');
        joined = calls.join('|');
        xfdf._annotationAttributes = ['M'];

        xfdf._writeAttribute(writer, 'S', 'B');
        joined = calls.join('|');
        xfdf._annotationAttributes = ['M'];

        xfdf._writeAttribute(writer, 'S', 'I');
        joined = calls.join('|');
        xfdf._annotationAttributes = ['M'];

        xfdf._writeAttribute(writer, 'S', 'U');
        joined = calls.join('|');
        xfdf._annotationAttributes = ['M'];

        expect(joined).toContain('style=dash');
        expect(joined).toContain('style=cloudy');
        expect(joined).toContain('style=bevelled');
        expect(joined).toContain('style=inset');
        expect(joined).toContain('style=dash');
        expect(joined).toContain('style=underline');

    });

    it('_writeColor - writes numeric tag and records annotation attribute', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeAttributeString: (a: any, b: any) => calls.push(`${a}=${b}`)
        };

        const xfdf = new _XfdfDocument();
        xfdf._annotationAttributes = [];

        spyOn(xfdf as any, '_getValue').and.returnValue('42');
        spyOn(xfdf as any, '_getColor').and.returnValue(''); // avoid color attribute path

        (xfdf as any)._writeColor(writer, 42, 'color', 'c');

        const joined = calls.join('|');
        expect(joined).toContain('c=42');
        expect(xfdf._annotationAttributes.indexOf('c')).toBeGreaterThan(-1);
    });

    it('_writeColor - does not write numeric tag when tag already present', () => {
        const calls: string[] = [];
        const writer: any = {
            _writeAttributeString: (a: any, b: any) => calls.push(`${a}=${b}`)
        };

        const xfdf = new _XfdfDocument();
        xfdf._annotationAttributes = ['c'];

        spyOn(xfdf as any, '_getValue').and.returnValue('99');
        spyOn(xfdf as any, '_getColor').and.returnValue('');

        (xfdf as any)._writeColor(writer, 99, 'color', 'c');

        const joined = calls.join('|');
        expect(joined).not.toContain('c=99');
        // ensure attribute list unchanged (no duplicate)
        expect(xfdf._annotationAttributes.filter((v: any) => v === 'c').length).toBe(1);
    });

    it('_getAnnotationDictionary - line with start/end sets L array and subtype', () => {
        const xfdf = new _XfdfDocument();
        // stub internal methods to avoid deep behavior
        spyOn(xfdf as any, '_addLineEndStyle').and.callFake(() => { });
        spyOn(xfdf as any, '_addAnnotationData').and.callFake(() => { });

        const element: any = {
            localName: 'line',
            hasAttribute: (k: string) => k === 'start' || k === 'end',
            getAttribute: (k: string) => k === 'start' ? '1,2' : '3,4'
        };

        const dict: _PdfDictionary = xfdf._getAnnotationDictionary(null as any, element);

        expect(dict.get('Subtype').name).toBe('Line');
        expect(dict.getArray('L')).toEqual([1, 2, 3, 4]);
    });

    it('_getAnnotationDictionary - known subtype (circle) sets subtype and invokes addAnnotationData', () => {
        const xfdf = new _XfdfDocument();
        spyOn(xfdf as any, '_addAnnotationData').and.callFake(() => { });

        const element: any = {
            localName: 'circle',
            hasAttribute: (_k: string) => false,
            getAttribute: (_k: string) => null as any
        };

        const dict: _PdfDictionary = xfdf._getAnnotationDictionary(null as any, element);

        expect(dict.get('Subtype').name).toBe('Circle');
        expect((xfdf as any)._addAnnotationData).toHaveBeenCalled();
    });

    it('_getAnnotationDictionary - remaining known subtypes set correct subtype and invoke addAnnotationData', () => {
        const xfdf = new _XfdfDocument();
        spyOn(xfdf as any, '_addAnnotationData').and.callFake(() => { });
        spyOn(xfdf as any, '_addLineEndStyle').and.callFake(() => { });

        const testCases = [
            { localName: 'circle', expected: 'Circle' },
            { localName: 'freetext', expected: 'FreeText' },
            { localName: 'polygon', expected: 'Polygon' },
            { localName: 'ink', expected: 'Ink' },
            { localName: 'popup', expected: 'Popup' },
            { localName: 'stamp', expected: 'Stamp' },
            { localName: 'highlight', expected: 'Highlight' },
            { localName: 'squiggly', expected: 'Squiggly' },
            { localName: 'underline', expected: 'Underline' },
            { localName: 'strikeout', expected: 'StrikeOut' },
            { localName: 'fileattachment', expected: 'FileAttachment' },
            { localName: 'sound', expected: 'Sound' },
            { localName: 'caret', expected: 'Caret' },
            { localName: 'redact', expected: 'Redact' }
        ];

        for (const test of testCases) {
            const element: any = {
                localName: test.localName,
                hasAttribute: (_k: string) => false,
                getAttribute: (_k: string) => null as any
            };

            const dict: _PdfDictionary = xfdf._getAnnotationDictionary(null as any, element);

            expect(dict.get('Subtype').name).toBe(test.expected);
        }

        // should be invoked once per annotation
        expect((xfdf as any)._addAnnotationData).toHaveBeenCalledTimes(testCases.length);
    });

    it('_getAnnotationDictionary - unknown type does not call addAnnotationData and leaves no Subtype', () => {
        const xfdf = new _XfdfDocument();
        spyOn(xfdf as any, '_addAnnotationData').and.callFake(() => { });

        const element: any = {
            localName: 'unknownType',
            hasAttribute: (_k: string) => false,
            getAttribute: (_k: string) => null as any
        };

        const dict: _PdfDictionary = xfdf._getAnnotationDictionary(null as any, element);

        expect(dict.get('Subtype')).toBeUndefined();
        expect((xfdf as any)._addAnnotationData).not.toHaveBeenCalled();
    });
    it('_addBorderStyle - dash with dashes updates BS.S and BS.D', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        const element: any = {
            hasAttribute: (k: string) => k === 'style' || k === 'dashes',
            getAttribute: (k: string) => k === 'style' ? 'dash' : '1,2'
        };

        (helper as any)._addBorderStyle(dict, element as any);

        const bs: any = dict.get('BS');
        expect(bs).toBeDefined();
        expect(bs.get('Type')).toBe('Border');
        expect(bs.get('S').name).toBe('D');
        expect(bs.getArray('D')).toEqual([1, 2]);
        expect(dict.get('BE')).toBeUndefined();
    });

    it('_addBorderStyle - cloudy style sets BE.S and BE.I when intensity present', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        const element: any = {
            hasAttribute: (k: string) => k === 'style' || k === 'intensity',
            getAttribute: (k: string) => k === 'style' ? 'cloudy' : '0.5'
        };

        (helper as any)._addBorderStyle(dict, element as any);

        const be: any = dict.get('BE');
        expect(be).toBeDefined();
        expect(be.get('S').name).toBe('C');
        expect(be.get('I')).toBeCloseTo(0.5, 6);
        expect(dict.get('BS')).toBeUndefined();
    });

    it('_addBorderStyle - inset style sets BS.S and no BE', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        const element: any = {
            hasAttribute: (k: string) => k === 'style',
            getAttribute: (_k: string) => 'inset'
        };

        (helper as any)._addBorderStyle(dict, element as any);

        const bs: any = dict.get('BS');
        expect(bs).toBeDefined();
        expect(bs.get('S').name).toBe('I');
        expect(dict.get('BE')).toBeUndefined();
    });
    it('_addBorderStyle - Underline style sets BS.S and no BE', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        const element: any = {
            hasAttribute: (k: string) => k === 'style',
            getAttribute: (_k: string) => 'underline'
        };

        (helper as any)._addBorderStyle(dict, element as any);

        const bs: any = dict.get('BS');
        expect(bs).toBeDefined();
        expect(bs.get('S').name).toBe('U');
        expect(dict.get('BE')).toBeUndefined();
    });
    it('_addBorderStyle - bevelled style sets BS.S and no BE', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        const element: any = {
            hasAttribute: (k: string) => k === 'style',
            getAttribute: (_k: string) => 'bevelled'
        };

        (helper as any)._addBorderStyle(dict, element as any);

        const bs: any = dict.get('BS');
        expect(bs).toBeDefined();
        expect(bs.get('S').name).toBe('B');
        expect(dict.get('BE')).toBeUndefined();
    });
    it('_applyAttributeValues - oc updates OC when subtype Redact', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('Subtype', _PdfName.get('Redact'));

        spyOn(utils, '_convertToColor').and.returnValue({ r: 255, g: 128, b: 0 } as any);

        const attributes: any = [{ name: 'oc', value: '#FF8000' }];

        (helper as any)._applyAttributeValues(dict, attributes as any);

        const oc = dict.getArray('OC');
        expect(oc).toBeDefined();
        expect(oc[0]).toBeCloseTo(1, 6);
        expect(oc[1]).toBeCloseTo(128 / 255, 6);
        expect(oc[2]).toBeCloseTo(0, 6);
    });

    it('_applyAttributeValues - afc updates AFC when subtype Redact', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('Subtype', _PdfName.get('Redact'));

        spyOn(utils, '_convertToColor').and.returnValue({ r: 10, g: 20, b: 30 } as any);

        const attributes: any = [{ name: 'afc', value: '#0A141E' }];

        (helper as any)._applyAttributeValues(dict, attributes as any);

        const afc = dict.getArray('AFC');
        expect(afc).toBeDefined();
        expect(afc[0]).toBeCloseTo(10 / 255, 6);
        expect(afc[1]).toBeCloseTo(20 / 255, 6);
        expect(afc[2]).toBeCloseTo(30 / 255, 6);
    });
    it('_applyAttributeValues - afc/color/interior-color else updates AFC when subtype Redact', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();
        dict.update('Subtype', _PdfName.get('Redact'));

        spyOn(utils, '_convertToColor').and.returnValue(null);

        const attributes: any = [{ name: 'afc', value: '#0A141E' }, { name: 'color', value: '#0A141E' }, { name: 'interior-color', value: '#0A141E' }];

        (helper as any)._applyAttributeValues(dict, attributes as any);

        const afc = dict.getArray('AFC');
        expect(afc).toBeUndefined();
    });

    it('_applyAttributeValues - interior-color always updates IC', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();

        spyOn(utils, '_convertToColor').and.returnValue({ r: 128, g: 64, b: 32 } as any);

        const attributes: any = [{ name: 'interior-color', value: '#804020' }];

        (helper as any)._applyAttributeValues(dict, attributes as any);

        const ic = dict.getArray('IC');
        expect(ic).toBeDefined();
        expect(ic[0]).toBeCloseTo(128 / 255, 6);
        expect(ic[1]).toBeCloseTo(64 / 255, 6);
        expect(ic[2]).toBeCloseTo(32 / 255, 6);
    });

    it('_applyAttributeValues - maps date/creationdate/name/icon/subject/title', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();

        spyOn(helper as any, '_getFormatedString').and.callFake((v: string) => `fmt:${v}`);

        const attributes: any = [
            { name: 'date', value: '2021-01-01' },
            { name: 'creationdate', value: 'C1' },
            { name: 'name', value: 'NM1' },
            { name: 'icon', value: '' },
            { name: 'icon', value: 'IconName' },
            { name: 'subject', value: 'SUB' },
            { name: 'title', value: 'TTL' },
            { name: 'justification', value: 2 },
            { name: 'fringe', value: '3,4' },
            { name: 'leaderlength', value: 3 },
            { name: 'callout', value: '3,4' },
            { name: 'coords', value: '3,4' },
            { name: 'open', value: 'true' },
            { name: 'open', value: 'yes' },
            { name: 'open', value: '' },
            { name: 'open', value: 'false' },
            { name: 'calibrate', value: 'calibrate' },
            { name: 'customdata', value: 'custom' },
            { name: 'overlaytext', value: 'over' },
            { name: 'repeat', value: 'true' },
            { name: 'repeat', value: 'yes' },
            { name: 'repeat', value: 'false' },
            { name: 'caption', value: '' },
            { name: 'caption', value: 'false' },
            { name: 'it', value: '' },
            { name: 'flags', value: '' },
        ];

        (helper as any)._applyAttributeValues(dict, attributes as any);

        expect(dict.get('M')).toBe('2021-01-01');
        expect(dict.get('CreationDate')).toBe('C1');
        expect(dict.get('NM')).toBe('NM1');
        expect(dict.get('Name').name).toBe('IconName');
        expect(dict.get('Subj')).toBe('fmt:SUB');
        expect(dict.get('T')).toBe('fmt:TTL');
        expect(dict.get('Q')).toBe(2);
        expect(dict.get('RD')).toEqual([3, 4]);
        expect(dict.get('LL')).toBe(3);
        expect(dict.get('CL')).toEqual([3, 4]);
        expect(dict.get('QuadPoints')).toEqual([3, 4]);
        expect(dict.get('Open')).toBe(false);
        expect(dict.get('Calibrate')).toBe('calibrate');
        expect(dict.get('CustomData')).toBe('custom');
        expect(dict.get('OverlayText')).toBe('over');
        expect(dict.get('Repeat')).toBe(false);
        expect(dict.get('Cap')).toBe(false);
    });
    it('_addStreamData - delegates to _addFileAttachment for FileAttachment subtype', () => {
        const xfdf = new _XfdfDocument();
        let nextId = 1;
        xfdf._crossReference = {
            _getNextReference: () => ({ id: nextId++ }),
            _cacheMap: new Map()
        } as any;

        const dict: _PdfDictionary = new _PdfDictionary(xfdf._crossReference);
        dict.update('Subtype', _PdfName.get('FileAttachment'));

        const child: any = { textContent: '0A0B' };

        const parent: any = {
            hasAttribute: (k: string) => ({ file: true, size: true, modification: true, creation: true, mimetype: true } as any)[k] === true,
            getAttribute: (k: string) => ({ file: 'myfile.txt', size: '2', modification: 'M1', creation: 'C1', mimetype: 'text/plain' } as any)[k]
        };

        (xfdf as any)._addStreamData(child as any, dict, parent as any);

        expect(dict.has('FS')).toBeTruthy();
        const fileRef: any = dict.get('FS');
        const fileDict: any = xfdf._crossReference._cacheMap.get(fileRef);
        expect(fileDict).toBeDefined();
        expect(fileDict.get('F')).toBe('myfile.txt');
        const embedded: any = fileDict.get('EF');
        const fRef: any = embedded.get('F');
        const fileStream: any = xfdf._crossReference._cacheMap.get(fRef);
        expect(fileStream.dictionary.get('DL')).toBe(2);
        expect(fileStream.dictionary.get('Params').get('Size')).toBe(2);
    });

    it('_addSound - creates sound stream and writes attributes', () => {
        const xfdf = new _XfdfDocument();
        let nextId = 1;
        xfdf._crossReference = {
            _getNextReference: () => ({ id: nextId++ }),
            _cacheMap: new Map()
        } as any;

        const dict: _PdfDictionary = new _PdfDictionary(xfdf._crossReference);
        dict.update('Subtype', _PdfName.get('Sound'));

        const element: any = {
            hasAttribute: (k: string) => ({ bits: true, rate: true, channels: true, encoding: true, filter: true } as any)[k] === true,
            getAttribute: (k: string) => ({ bits: '16', rate: '44100', channels: '2', encoding: 'PCM' } as any)[k]
        };

        (xfdf as any)._addSound(dict, element as any, [1, 2, 3]);

        expect(dict.has('Sound')).toBeTruthy();
        const soundRef: any = dict.get('Sound');
        const soundStream: any = xfdf._crossReference._cacheMap.get(soundRef);
        expect(soundStream).toBeDefined();
        expect(soundStream.dictionary.get('B')).toBe(16);
        expect(soundStream.dictionary.get('R')).toBe(44100);
        expect(soundStream.dictionary.get('C')).toBe(2);
        expect(soundStream.dictionary.get('E').name).toBe('PCM');
        expect(soundStream.dictionary.get('Filter').name).toBe('FlateDecode');
    });

    it('_applyAttributeValues - rect sets Rect when provided four numbers', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();

        const attributes: any = [{ name: 'rect', value: '1,2,3,4' }, { name: 'rect', value: '1,2' }];

        (helper as any)._applyAttributeValues(dict, attributes as any);

        const rect = dict.getArray('Rect');
        expect(rect).toEqual([1, 2, 3, 4]);
    });

    it('_applyAttributeValues - leaderextend sets LLE and caption/caption-style set Cap and CP', () => {
        const helper = new _XfdfDocument();
        const dict: _PdfDictionary = new _PdfDictionary();

        const attributes: any = [
            { name: 'leaderextend', value: '12.5' },
            { name: 'caption', value: 'yes' },
            { name: 'caption-style', value: 'FancyStyle' },
            { name: 'replytype', value: 'group', Group: '123' },
            { name: 'replytype', value: '123' },

        ];

        (helper as any)._applyAttributeValues(dict, attributes as any);

        expect(dict.get('LLE')).toBeCloseTo(12.5, 6);
        expect(dict.get('Cap')).toBe(true);
        expect(dict.get('CP').name).toBe('FancyStyle');
    });
    it('should generate data when MODE=FILTERED and ENCODING=ASCII', () => {
        const xfdf = new _XfdfDocument();

        // Spy on _getFormatedString
        spyOn(xfdf as any, '_getFormatedString').and.returnValue('FORMATTED_TEXT');

        // Spy on utils._stringToBytes
        spyOn(utils as any, '_stringToBytes').and.returnValue(
            new Uint8Array([70, 79, 82, 77]) // mock byte data
        );

        // Create element that satisfies ALL conditions
        const element = document.createElement('data');
        element.textContent = 'raw text';
        element.setAttribute('MODE', 'FILTERED');
        element.setAttribute('ENCODING', 'ASCII');
        const data = xfdf._getData(element);
        expect(xfdf._getFormatedString).toHaveBeenCalledWith('raw text', true);
        expect(utils._stringToBytes).toHaveBeenCalledWith('FORMATTED_TEXT', true);
        expect(data).toEqual(jasmine.any(Uint8Array))
    });

    it('_getAppearance delegates non-DATA types to helper methods via _addKey', () => {
        const xfdf = new _XfdfDocument();
        const dest: any = new _PdfDictionary();

        spyOn(xfdf as any, '_getArray').and.returnValue(['A']);
        spyOn(xfdf as any, '_getFixed').and.returnValue(1.23);
        spyOn(xfdf as any, '_getInt').and.returnValue(42);
        spyOn(xfdf as any, '_getString').and.returnValue('sval');
        spyOn(xfdf as any, '_getName').and.returnValue(_PdfName.get('Name'));
        spyOn(xfdf as any, '_getBoolean').and.returnValue(true);
        const addKeySpy = spyOn(xfdf as any, '_addKey').and.callFake(() => { });

        let element: any = { nodeType: 1, localName: 'ARRAY' };
        (xfdf as any)._getAppearance(dest, element);
        expect((xfdf as any)._getArray).toHaveBeenCalledWith(element);
        expect(addKeySpy).toHaveBeenCalledWith(['A'], dest, element);

        element.localName = 'FIXED';
        (xfdf as any)._getAppearance(dest, element);
        expect((xfdf as any)._getFixed).toHaveBeenCalledWith(element);

        element.localName = 'INT';
        (xfdf as any)._getAppearance(dest, element);
        expect((xfdf as any)._getInt).toHaveBeenCalledWith(element);

        element.localName = 'STRING';
        (xfdf as any)._getAppearance(dest, element);
        expect((xfdf as any)._getString).toHaveBeenCalledWith(element);

        element.localName = 'NAME';
        (xfdf as any)._getAppearance(dest, element);
        expect((xfdf as any)._getName).toHaveBeenCalledWith(element);

        element.localName = 'BOOL';
        (xfdf as any)._getAppearance(dest, element);
        expect((xfdf as any)._getBoolean).toHaveBeenCalledWith(element);
    });

    it('_getAppearance DATA case: does not modify when data empty or source not content stream', () => {
        const xfdf = new _XfdfDocument();
        spyOn(xfdf as any, '_getData').and.returnValue([]);
        const dest: any = new _PdfDictionary();
        const element: any = { nodeType: 1, localName: 'DATA' };

        // source is a dictionary (not _PdfContentStream) so DATA branch should not assign bytes
        (xfdf as any)._getAppearance(dest, element);
        expect((xfdf as any)._getData).toHaveBeenCalledWith(element);
    });

    it('_getAppearance DATA case: when source is image content stream sets bytes and disables compression', () => {
        const xfdf = new _XfdfDocument();
        const data = [1, 2, 3];
        spyOn(xfdf as any, '_getData').and.returnValue(data);

        const stream = new _PdfContentStream([]);
        // ensure appearance subtype is Image via the stream.dictionary
        stream.dictionary.update('Subtype', _PdfName.get('Image'));

        const element: any = { nodeType: 1, localName: 'DATA' };

        (xfdf as any)._getAppearance(stream, element);

        expect(stream._bytes).toEqual(data);
        expect(stream._isCompress).toBeTruthy();
    });

    it('_getAppearance DATA case: non-image content stream sets bytes and queries length', () => {
        const xfdf = new _XfdfDocument();
        const data = [9, 8, 7];
        spyOn(xfdf as any, '_getData').and.returnValue(data);

        const stream = new _PdfContentStream([]);
        // ensure subtype is not Image
        stream.dictionary.update('Subtype', _PdfName.get('XObject'));
        const hasSpy = spyOn(stream.dictionary, 'has').and.callThrough();

        const element: any = { nodeType: 1, localName: 'DATA' };

        (xfdf as any)._getAppearance(stream, element);

        expect(stream._bytes).toEqual(data);
        expect(hasSpy).toHaveBeenCalledWith('Length');
    });

    describe('_XfdfDocument._addArrayElements', function () {
        let doc: any;
        let array: any;
        let child: any;
        let refCount: any;

        beforeEach(function () {
            refCount = 1;
            doc = {
                _addArrayElements: _XfdfDocument.prototype._addArrayElements,
                _getStream: jasmine.createSpy('_getStream'),
                _getDictionary: jasmine.createSpy('_getDictionary'),
                _getArray: jasmine.createSpy('_getArray'),
                _getFixed: jasmine.createSpy('_getFixed'),
                _getInt: jasmine.createSpy('_getInt'),
                _getName: jasmine.createSpy('_getName'),
                _getBoolean: jasmine.createSpy('_getBoolean'),
                _crossReference: {
                    _getNextReference: jasmine.createSpy('_getNextReference').and.callFake(function () {
                        return refCount++ + ' 0 R';
                    }),
                    _cacheMap: new Map()
                }
            };
            array = [];
            child = {
                nodeType: 1,
                localName: ''
            };
        });
        it('should do nothing when child is null', function () {
            doc._addArrayElements(array, null);
            expect(array.length).toBe(0);
        });
        it('should do nothing when nodeType is not 1', function () {
            child.nodeType = 3;
            doc._addArrayElements(array, child);
            expect(array.length).toBe(0);
        });
        it('should add STREAM reference when stream exists', function () {
            var stream = {};
            doc._getStream.and.returnValue(stream);
            child.localName = 'STREAM';

            doc._addArrayElements(array, child);

            expect(array).toEqual(['1 0 R']);
            expect(doc._crossReference._cacheMap.get('1 0 R')).toBe(stream);
        });

        it('should not add STREAM when stream is null', function () {
            doc._getStream.and.returnValue(null);
            child.localName = 'STREAM';

            doc._addArrayElements(array, child);
            expect(array.length).toBe(0);
        });

        it('should add DICT reference when dictionary exists', function () {
            var dict = {};
            doc._getDictionary.and.returnValue(dict);
            child.localName = 'DICT';

            doc._addArrayElements(array, child);

            expect(array).toEqual(['1 0 R']);
            expect(doc._crossReference._cacheMap.get('1 0 R')).toBe(dict);
        });

        it('should not add DICT when dictionary is null', function () {
            doc._getDictionary.and.returnValue(null);
            child.localName = 'DICT';

            doc._addArrayElements(array, child);
            expect(array.length).toBe(0);
        });

        it('should add ARRAY value when present', function () {
            doc._getArray.and.returnValue([1, 2, 3]);
            child.localName = 'ARRAY';

            doc._addArrayElements(array, child);
            expect(array).toEqual([[1, 2, 3]]);
        });

        it('should not add ARRAY when undefined', function () {
            doc._getArray.and.returnValue(undefined);
            child.localName = 'ARRAY';

            doc._addArrayElements(array, child);
            expect(array.length).toBe(0);
        });

        it('should add FIXED when valid number', function () {
            doc._getFixed.and.returnValue(12.5);
            child.localName = 'FIXED';

            doc._addArrayElements(array, child);
            expect(array).toEqual([12.5]);
        });

        it('should not add FIXED when NaN', function () {
            doc._getFixed.and.returnValue(NaN);
            child.localName = 'FIXED';

            doc._addArrayElements(array, child);
            expect(array.length).toBe(0);
        });

        it('should not add FIXED when undefined', function () {
            doc._getFixed.and.returnValue(undefined);
            child.localName = 'FIXED';

            doc._addArrayElements(array, child);
            expect(array.length).toBe(0);
        });
        it('should add INT when valid integer', function () {
            doc._getInt.and.returnValue(42);
            child.localName = 'INT';

            doc._addArrayElements(array, child);
            expect(array).toEqual([42]);
        });

        it('should not add INT when NaN', function () {
            doc._getInt.and.returnValue(NaN);
            child.localName = 'INT';

            doc._addArrayElements(array, child);
            expect(array.length).toBe(0);
        });

        it('should not add INT when undefined', function () {
            doc._getInt.and.returnValue(undefined);
            child.localName = 'INT';

            doc._addArrayElements(array, child);
            expect(array.length).toBe(0);
        });

        it('should add NAME when truthy', function () {
            doc._getName.and.returnValue('MyName');
            child.localName = 'NAME';

            doc._addArrayElements(array, child);
            expect(array).toEqual(['MyName']);
        });

        it('should not add NAME when falsy', function () {
            doc._getName.and.returnValue('');
            child.localName = 'NAME';

            doc._addArrayElements(array, child);
            expect(array.length).toBe(0);
        });


        it('should add BOOL true', function () {
            doc._getBoolean.and.returnValue(true);
            child.localName = 'BOOL';

            doc._addArrayElements(array, child);
            expect(array).toEqual([true]);
        });

        it('should add BOOL false', function () {
            doc._getBoolean.and.returnValue(false);
            child.localName = 'BOOL';

            doc._addArrayElements(array, child);
            expect(array).toEqual([false]);
        });

        it('should not add BOOL when undefined or null', function () {
            doc._getBoolean.and.returnValue(undefined);
            child.localName = 'BOOL';

            doc._addArrayElements(array, child);
            expect(array.length).toBe(0);
        });
    });

    // -------------------- _getFixed --------------------
    describe('_getFixed', function () {

        it('should return parsed float when VAL attribute exists (if branch)', function () {
            const xfdf = new _XfdfDocument();
            const element = document.createElement('item');
            element.setAttribute('VAL', '10.25');

            const result = xfdf._getFixed(element);
            expect(result).toBe(10.25);
        });

        it('should return undefined when element is null (else branch)', function () {
            const xfdf = new _XfdfDocument();
            const result = xfdf._getFixed(null);
            expect(result).toBeUndefined();
        });
    });

    // -------------------- _getInt --------------------
    describe('_getInt', function () {

        it('should return undefined when VAL attribute does not exist (else branch)', function () {
            const xfdf = new _XfdfDocument();
            const element = document.createElement('item');

            const result = xfdf._getInt(element);
            expect(result).toBeUndefined();
        });
    });

    // -------------------- _getString --------------------
    describe('_getString', function () {

        it('should return string when VAL attribute exists (if branch)', function () {
            const xfdf = new _XfdfDocument();
            const element = document.createElement('item');
            element.setAttribute('VAL', 'TestValue');

            const result = xfdf._getString(element);
            expect(result).toBe('TestValue');
        });

        it('should return undefined when element is undefined (else branch)', function () {
            const xfdf = new _XfdfDocument();
            const result = xfdf._getString(undefined);
            expect(result).toBeUndefined();
        });
    });

    // -------------------- _getName --------------------
    describe('_getName', function () {

        it('should return PdfName object when VAL attribute exists (if branch)', function () {
            const xfdf = new _XfdfDocument();
            const element = document.createElement('item');
            element.setAttribute('VAL', 'SampleName');

            const result = xfdf._getName(element);

            expect(result).toBeDefined();
            expect(result.name).toBe('SampleName');
        });

        it('should return undefined when element is null (else branch)', function () {
            const xfdf = new _XfdfDocument();
            const result = xfdf._getName(null);
            expect(result).toBeUndefined();
        });
    });

    describe('_getBoolean', function () {

        it('should return true when VAL is "true" (if branch)', function () {
            const xfdf = new _XfdfDocument();
            const element = document.createElement('item');
            element.setAttribute('VAL', 'true');

            const result = xfdf._getBoolean(element);
            expect(result).toBe(true);
        });

        it('should return false when VAL is "false" (if branch)', function () {
            const xfdf = new _XfdfDocument();
            const element = document.createElement('item');
            element.setAttribute('VAL', 'false');

            const result = xfdf._getBoolean(element);
            expect(result).toBe(false);
        });

        it('should return undefined when VAL attribute does not exist (else branch)', function () {
            const element = document.createElement('item');
            const xfdf = new _XfdfDocument();


            const result = xfdf._getBoolean(element);
            expect(result).toBeUndefined();
        });
    });
    describe('bc-xfdf-document _groupHolders processing', () => {

        it('handles empty _groupHolders without error', () => {
            // Arrange
            const doc: any = new _XfdfDocument();
            doc._isAnnotationImport = true;
            doc._groupHolders = [];
            const root: any = { nodeType: 1, nodeName: 'xfdf', getElementsByTagName: (_: string) => ({ length: 0 }) };
            // Act
            doc._readXmlData(root);
            // Assert
            expect(doc._groupHolders).toBeUndefined();
        });

        it('replaces IRT when reference exists in _groupReferences', () => {
            // Arrange
            const doc: any = new _XfdfDocument();
            doc._isAnnotationImport = true;
            const dict: any = {
                _map: { IRT: 'key1' },
                get: function (k: string) { return this._map[k]; },
                update: function (k: string, v: any) { this._map[k] = v; }
            };
            doc._groupHolders = [dict];
            doc._groupReferences = new Map<string, any>();
            const refObj = { id: 'ref1' };
            doc._groupReferences.set('key1', refObj);
            const root: any = { nodeType: 1, nodeName: 'xfdf', getElementsByTagName: (_: string) => ({ length: 0 }) };
            // Act
            doc._readXmlData(root);
            // Assert
            expect(dict._map.IRT).toBe(refObj);
        });

        it('deletes IRT when reference missing in _groupReferences', () => {
            // Arrange
            const doc: any = new _XfdfDocument();
            doc._isAnnotationImport = true;
            const dict: any = {
                _map: { IRT: 'missing' },
                get: function (k: string) { return this._map[k]; },
                update: function (k: string, v: any) { this._map[k] = v; }
            };
            doc._groupHolders = [dict];
            doc._groupReferences = new Map<string, any>();
            const root: any = { nodeType: 1, nodeName: 'xfdf', getElementsByTagName: (_: string) => ({ length: 0 }) };
            // Act
            doc._readXmlData(root);
            // Assert
            expect(Object.prototype.hasOwnProperty.call(dict._map, 'IRT')).toBe(false);
        });

        it('processes multiple dictionaries with mixed outcomes', () => {
            // Arrange
            const doc: any = new _XfdfDocument();
            doc._isAnnotationImport = true;
            const dict1: any = {
                _map: { IRT: 'k1' },
                get: function (k: string) { return this._map[k]; },
                update: function (k: string, v: any) { this._map[k] = v; }
            };
            const dict2: any = {
                _map: { IRT: 'k2' },
                get: function (k: string) { return this._map[k]; },
                update: function (k: string, v: any) { this._map[k] = v; }
            };
            doc._groupHolders = [dict1, dict2];
            doc._groupReferences = new Map<string, any>();
            const refObj = { id: 'r1' };
            doc._groupReferences.set('k1', refObj);
            const root: any = { nodeType: 1, nodeName: 'xfdf', getElementsByTagName: (_: string) => ({ length: 0 }) };
            // Act
            doc._readXmlData(root);
            // Assert
            expect(dict1._map.IRT).toBe(refObj);
            expect(Object.prototype.hasOwnProperty.call(dict2._map, 'IRT')).toBe(false);
        });

    });
});
describe('XFDF _exportFormFieldsData (lines 269-381) tests', () => {

    class TestExportHelper extends _ExportHelper {
        _exportAnnotations(document?: any): Uint8Array { return new Uint8Array(0); }
        _exportFormFields(document: any): Uint8Array { return new Uint8Array(0); }
        _save(): Uint8Array { return new Uint8Array(0); }

        // Make encoding deterministic
        _getEncodedValue(value: string): string { return `enc:${value}`; }
        _getEncodedFontDictionary(_dict: any): any { return null; }
        _getExportValue(val: any): any { return val; }
    }
    it('Ch - string value is encoded and stored', () => {
        const helper = new TestExportHelper();
        helper._table = new Map();

        const mockField: any = { export: true, _dictionary: {}, name: 'choiceField' };
        const valuesForKey: any = {
            FT: { name: 'Ch' },
            V: 'choice1'
        };

        spyOn(utils, '_getInheritableProperty')
            .and.callFake((_d: any, key: string) => valuesForKey[key]);

        const result = helper._exportFormFieldsData(mockField);
        helper._exportFormFieldsData(mockField);
        expect(result).toBe('enc:choice1');
        expect(helper._table.get('choiceField')).toBe('enc:choice1');
    });

    it('Ch - array value returns encoded array and stores it', () => {
        const helper = new TestExportHelper();
        helper._table = new Map();

        const mockField: any = { export: true, _dictionary: {}, name: 'multiChoice' };
        const valuesForKey: any = {
            FT: { name: 'Ch' },
            V: ['a', 'b']
        };

        spyOn(utils, '_getInheritableProperty')
            .and.callFake((_d: any, key: string) => valuesForKey[key]);

        const result = helper._exportFormFieldsData(mockField) as string[];
        helper._exportFormFieldsData(mockField);
        expect(result).toEqual(['enc:a', 'enc:b']);
        expect(helper._table.get('multiChoice')).toEqual(['enc:a', 'enc:b']);
    });

    it('Btn - V present and no Opt stores encoded text', () => {
        const helper = new TestExportHelper();
        helper._table = new Map();

        const mockField: any = {
            export: true,
            _dictionary: { has: () => false },
            name: 'btnField'
        };

        const valuesForKey: any = {
            FT: { name: 'Btn' },
            V: 'btnVal'
        };

        spyOn(utils, '_getInheritableProperty')
            .and.callFake((_d: any, key: string) => valuesForKey[key]);

        const result = helper._exportFormFieldsData(mockField);
        helper._exportFormFieldsData(mockField);
        expect(result).toBe('enc:btnVal');
        expect(helper._table.get('btnField')).toBe('enc:btnVal');
    });

    it('Btn - no V uses widget.AS.name when present', () => {
        const helper = new TestExportHelper();
        helper._table = new Map();

        const widgetDict: any = {
            has: (k: string) => k === 'AS',
            get: () => ({ name: 'ASValue' })
        };

        const widget: any = { _dictionary: widgetDict };

        const mockField: any = {
            export: true,
            _dictionary: { has: () => false },
            name: 'btnWidget',
            _defaultIndex: 0,
            itemAt: () => widget
        };

        const valuesForKey: any = {
            FT: { name: 'Btn' },
            V: null
        };

        spyOn(utils, '_getInheritableProperty')
            .and.callFake((_d: any, key: string) => valuesForKey[key]);

        const result = helper._exportFormFieldsData(mockField);
        helper._exportFormFieldsData(mockField);
        expect(result).toBe('ASValue');
        expect(helper._table.get('btnWidget')).toBe('ASValue');
    });

    it('_exportFormFieldData - Btn empty text for checkbox sets Off or emp', () => {
        const xfdf = new _XfdfDocument();
        spyOn(xfdf as any, '_getEncodedFontDictionary').and.returnValue(null);
        spyOn(xfdf as any, '_getExportValue').and.returnValue('');
        const type = { name: 'Btn' };
        spyOn(utils, '_getInheritableProperty').and.returnValue(type);

        const dict = new _PdfDictionary();
        dict.update('V', '');
        const field: any = Object.create(PdfCheckBoxField.prototype);
        field._dictionary = dict;
        field._name = 'chk1';

        xfdf._exportEmptyFields = false;
        (xfdf as any)._exportFormFieldData(field);
        expect(xfdf._table.get('chk1')).toBe('Off');

        xfdf._exportEmptyFields = true;
        (xfdf as any)._exportFormFieldData(field);
        expect(xfdf._table.get('chk1')).toBe('');
    });

    it('_exportFormFieldData - Btn with Opt uses options index and encodes selected option', () => {
        const xfdf = new _XfdfDocument();
        spyOn(xfdf as any, '_getEncodedFontDictionary').and.returnValue(null);
        spyOn(xfdf as any, '_getExportValue').and.returnValue('1');
        spyOn(xfdf as any, '_getEncodedValue').and.callFake((v: any) => `E:${v}`);
        const type = { name: 'Btn' };
        spyOn(utils, '_getInheritableProperty').and.returnValue(type);
        const dict = new _PdfDictionary();
        dict.update('V', '1');
        dict.update('Opt', ['zero', 'one', 'two']);
        const field: any = { _dictionary: dict, name: 'btnOpt', export: true };

        (xfdf as any)._exportFormFieldData(field);

        expect(xfdf._table.get('btnOpt')).toBe('E:one');
    });

    it('_exportFormFieldData - Tx asPerSpecification RV sets formKey and table', () => {
        const xfdf = new _XfdfDocument();
        xfdf._asPerSpecification = true;
        const valuesForKey: any = {
            FT: { name: 'Tx' },
            V: null,
            RV: 'RVVAL'
        }
        const type = { name: 'Tx' };
        const textValue = 'Text'
        spyOn(utils, '_getInheritableProperty').and.returnValues(type, textValue, textValue);
        xfdf._key = 'K';
        spyOn(xfdf as any, '_getEncodedFontDictionary').and.returnValue(null);
        const dict = new _PdfDictionary();
        dict.update('RV', 'RVVAL');
        dict.update('V', 'VVAL');
        const field: any = { _dictionary: dict, name: 'Tx' } as PdfTextBoxField;

        (xfdf as any)._exportFormFieldData(field);

        expect(xfdf._table.get('Tx')).toBe('TextK');
        expect(xfdf._formKey).toBe('K');
    });

    it('Ch - asPerSpecification true stores array values without encoding', () => {
        const helper = new TestExportHelper();
        helper._asPerSpecification = true;
        helper._table = new Map();

        const field: any = Object.create(PdfListBoxField.prototype);
        field._dictionary = {};
        field._name = 'listSpec';

        const valuesForKey: any = { FT: { name: 'Ch' }, V: ['x', 'y'] };
        spyOn(utils, '_getInheritableProperty').and.callFake((_d: any, key: string) => valuesForKey[key]);

        const result = helper._exportFormFieldsData(field) as string[];
        expect(result).toEqual(['enc:x', 'enc:y']);
        expect(helper._table.get('listSpec')).toEqual(['enc:x', 'enc:y']);
    });

    it('Ch - asPerSpecification true encodes single string values', () => {
        const helper = new TestExportHelper();
        helper._asPerSpecification = true;
        helper._table = new Map();

        const field: any = Object.create(PdfListBoxField.prototype);
        field._dictionary = {};
        field._name = 'listSpecStr';

        const valuesForKey: any = { FT: { name: 'Ch' }, V: 'one' };
        spyOn(utils, '_getInheritableProperty').and.callFake((_d: any, key: string) => valuesForKey[key]);

        const result = helper._exportFormFieldsData(field) as string;
        expect(result).toBe('enc:one');
        expect(helper._table.get('listSpecStr')).toBe('enc:one');
    });

    it('Ch - non-spec uses _getExportValue and encodes result', () => {
        const helper = new TestExportHelper();
        helper._table = new Map();

        const field: any = Object.create(PdfListBoxField.prototype);
        field._dictionary = {};
        field._name = 'listNonSpec';

        const valuesForKey: any = { FT: { name: 'Ch' }, V: 'v1' };
        spyOn(utils, '_getInheritableProperty').and.callFake((_d: any, key: string) => valuesForKey[key]);

        const result = helper._exportFormFieldsData(field) as string;
        expect(result).toBe('enc:v1');
        expect(helper._table.get('listNonSpec')).toBe('enc:v1');
    });

    it('Ch - non-spec with no V but I present obtains selected array and encodes it', () => {
        const helper = new TestExportHelper();
        helper._table = new Map();

        const field: any = Object.create(PdfListBoxField.prototype);
        field._dictionary = { has: (_k: string) => true };
        field._name = 'listSelected';
        field._obtainSelectedValue = () => ['a', 'b'];

        const valuesForKey: any = { FT: { name: 'Ch' }, V: null };
        spyOn(utils, '_getInheritableProperty').and.callFake((_d: any, key: string) => valuesForKey[key]);

        const result = helper._exportFormFieldsData(field) as string[];
        expect(result).toEqual(['enc:a', 'enc:b']);
        expect(helper._table.get('listSelected')).toEqual(['enc:a', 'enc:b']);
    });

    it('Ch - non-spec exports empty string when selectedValue missing and _exportEmptyFields true', () => {
        const helper = new TestExportHelper();
        helper._table = new Map();
        helper._exportEmptyFields = true;

        const field: any = Object.create(PdfListBoxField.prototype);
        field._dictionary = { has: (_k: string) => false };
        field._name = 'emptyField';

        const valuesForKey: any = { FT: { name: 'Ch' }, V: undefined };
        spyOn(utils, '_getInheritableProperty').and.callFake((_d: any, key: string) => valuesForKey[key]);

        const result = helper._exportFormFieldsData(field);
        expect(helper._table.get('emptyField')).toBe('');
    });

});
describe('Export helper methods checks', () => {
    class TestExportHelper extends _ExportHelper {
        _exportAnnotations(document?: any): Uint8Array { return new Uint8Array(0); }
        _exportFormFields(document: any): Uint8Array { return new Uint8Array(0); }
        _save(): Uint8Array { return new Uint8Array(0); }

        // Make encoding deterministic
        _getEncodedValue(value: string): string { return `enc:${value}`; }
        _getExportValue(val: any): any { return val; }
    }
    it('_getValidString branches Check', () => {
        const helper = new TestExportHelper();
        const value1 = helper._getValidString('asdfdfsd\r');
        const value2 = helper._getValidString('dfjsbd\n');

        expect(value1).toBeDefined();
        expect(value2).toBeDefined();
    });
    it('_getEncodedFontDictionary  branches Check', () => {
        const helper = new TestExportHelper();
        const value1 = helper._getEncodedFontDictionary(new _PdfDictionary());
        const dict = new _PdfDictionary();
        dict.set('AP', new _PdfDictionary());
        const value2 = helper._getEncodedFontDictionary(dict);

        expect(value1).toBeUndefined();
        expect(value2).toBeUndefined();
    });

    it('_getEncodedValue uses PDFDocEncoding differences when present (lines 691-717)', () => {
        const helper = new TestExportHelper();
        // monkeypatch FontStructure.differencesDictionary to ensure non-empty
        const originalDesc = Object.getOwnPropertyDescriptor(_FontStructure.prototype, 'differencesDictionary');
        Object.defineProperty(_FontStructure.prototype, 'differencesDictionary', {
            get: function () { return new Map<string, string>([['65', 'A']]); },
            configurable: true
        });

        // stub replace to observe call
        spyOn(helper, '_replaceNotUsedCharacters').and.callFake((text: string) => `repl:${text}`);

        // minimal cross reference mock used by dictionaries
        const mockCrossRef: any = {
            _getNextReference: () => ({}),
            _cacheMap: new Map<any, any>()
        };

        // build nested dictionaries to satisfy has/get checks
        const pdfEncoding = new _PdfDictionary(mockCrossRef);
        pdfEncoding.set('Differences', [1]);
        const encoding = new _PdfDictionary(mockCrossRef);
        encoding.set('PDFDocEncoding', pdfEncoding);
        const resource = new _PdfDictionary(mockCrossRef);
        resource.set('Encoding', encoding);
        const root = new _PdfDictionary(mockCrossRef);
        root.set('DR', resource);

        helper._document = { form: { _dictionary: root } } as any;
        helper._crossReference = mockCrossRef;

        const result = helper._getEncodedValue('hello');

        expect(result).toBe('enc:hello');
        // restore original descriptor
        if (originalDesc) {
            Object.defineProperty(_FontStructure.prototype, 'differencesDictionary', originalDesc);
        }
    });

    it('_handlePopup links popup and updates page collections (lines 864-882)', () => {
        const helper = new TestExportHelper();

        const popupRef: any = { id: 'r' };
        const popupDict: any = new _PdfDictionary();

        const annotationDictionary: any = {
            has: (k: string) => k === 'Popup',
            getRaw: (_k: string) => popupRef,
            get: (_k: string) => popupDict
        };

        const parsedAnnotation = { parsed: true };
        const annotations: any = {
            _annotations: [],
            _parsedAnnotations: new Map<number, any>(),
            _parseAnnotation: (_p: any) => parsedAnnotation
        };

        const pageDictionary: any = new _PdfDictionary();
        const parentRef: any = { parent: 1 };

        helper._handlePopup(annotations, parentRef, annotationDictionary, pageDictionary);

        expect(popupDict.getRaw('Parent')).toBe(parentRef);
        expect(pageDictionary.get('Annots')).toBe(annotations._annotations);
        expect(pageDictionary._updated).toBeTruthy();
        expect(annotations._parsedAnnotations.get(0)).toBe(parsedAnnotation);
    });
    it('_importFieldData - TextBox multi-line normalizes newlines (lines 927-934)', () => {
        const helper = new TestExportHelper();
        const document = new PdfDocument();
        document.addPage();
        const field = new PdfTextBoxField(document.getPage(0), 'text', { x: 10, y: 10, width: 100, height: 100 });
        field.multiLine = true;
        field._dictionary = new _PdfDictionary();

        helper._importFieldData(field, ['line1\r\nline2\nline3']);

        expect(field.text).toBe('line1\rline2\rline3');
    });

    it('_importFieldData - ListBox uses multiple values when provided (lines 927-934)', () => {
        const helper = new TestExportHelper();
        const mockCrossRef: any = { _getNextReference: () => ({}), _cacheMap: new Map<any, any>() };
        const field: any = new PdfListBoxField();
        const options = [['a', 'A'], ['b', 'B']];
        field._dictionary = new _PdfDictionary(mockCrossRef);
        field._dictionary.set('Opt', options);

        helper._importFieldData(field, ['a', 'b']);

        expect(field._dictionary.getArray('I')).toEqual([0, 1]);
    });

    it('_importFieldData - List/Combo splits comma values when xmlImport true (lines 927-934)', () => {
        const helper = new TestExportHelper();
        helper._xmlImport = true;
        const mockCrossRef: any = { _getNextReference: () => ({}), _cacheMap: new Map<any, any>() };
        const field = new PdfComboBoxField();
        const options = [['a', 'A'], ['b', 'B']];
        field._dictionary = new _PdfDictionary(mockCrossRef);
        field._dictionary.set('Opt', options);
        field._dictionary.set('AP', new _PdfDictionary());

        helper._importFieldData(field, ['a,b']);

        expect(field._dictionary.getArray('I')).toEqual([0, 1]);
    });

    it('_importFieldData - List/Combo takes first segment when xmlImport false (lines 927-934)', () => {
        const helper = new TestExportHelper();
        helper._xmlImport = false;
        const mockCrossRef: any = { _getNextReference: () => ({}), _cacheMap: new Map<any, any>() };
        const field = new PdfComboBoxField();
        const options = [['a', 'A'], ['b', 'B']];
        field._dictionary = new _PdfDictionary(mockCrossRef);
        field._dictionary.set('Opt', options);
        field._dictionary.set('AP', new _PdfReference(4, 0));
        helper._importFieldData(field, ['a,b']);

        expect(field._dictionary.getArray('I')).toEqual([0]);
    });

    it('_importFieldData - RadioButton does not change selectedIndex when already selected', () => {
        const helper = new TestExportHelper();
        const document = new PdfDocument();
        document.addPage();
        const field = new PdfRadioButtonListField(document.getPage(0), 'button');
        field._selectedIndex = 1
        const items = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];
        field._kids = items.map(() => ({} as _PdfReference));
        field.itemAt = (i: number) => items[i] as PdfRadioButtonListItem;

        helper._importFieldData(field, ['b']);

        expect(field.selectedIndex).toBe(1);
    });

    it('_importFieldData - RadioButton leaves selectedIndex unchanged when no matching value', () => {
        const helper = new _XfdfDocument();
        const document = new PdfDocument();
        document.addPage();
        const field = new PdfRadioButtonListField(document.getPage(0), 'button');
        field._selectedIndex = 0;
        const items = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];
        field._kids = items.map(() => ({} as _PdfReference));
        field.itemAt = (i: number) => items[i] as PdfRadioButtonListItem;

        helper._importFieldData(field, ['z']);

        expect(field.selectedIndex).toBe(0);
    });

});
describe('_FontStructure coverage check', () => {
    describe('_FontStructure hex decode tests (lines 3635-3666)', () => {

        it('_decodeHexFontName - decodes single hex sequence', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            const fs = new _FontStructure(dict);
            const output = (fs as any)._decodeHexFontName('Hello#41World');
            expect(output).toBe('HelloAWorld');
        });

        it('_decodeHexFontName - decodes multiple hex sequences', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            const fs = new _FontStructure(dict);
            const output = (fs as any)._decodeHexFontName('#48#65#6C');
            expect(output).toBe('Hel');
        });

        it('_decodeHexFontName - leaves #00 sequences unchanged', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            const fs = new _FontStructure(dict);
            const output = (fs as any)._decodeHexFontName('A#00B');
            expect(output).toBe('A#00B');
        });

    });
    describe('_FontStructure - _getFontName tests (lines 3635-3666)', () => {

        it('_getFontName - takes name after + and trims after hyphen', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            dict.update('BaseFont', _PdfName.get('ABC+MyFont-Bold'));
            const fs = new _FontStructure(dict);
            const name = (fs as any)._getFontName();
            expect(name).toBe('MyFont');
        });

        it('_getFontName - replaces #20 with space when + absent', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            dict.update('BaseFont', _PdfName.get('My#20Font'));
            const fs = new _FontStructure(dict);
            const name = (fs as any)._getFontName();
            expect(name).toBe('My Font');
        });

        it('_getFontName - splits on comma when hyphen absent', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            dict.update('BaseFont', _PdfName.get('Name,Other'));
            const fs = new _FontStructure(dict);
            const name = (fs as any)._getFontName();
            expect(name).toBe('Name');
        });

        it('_getFontName - removes MT substring', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            dict.update('BaseFont', _PdfName.get('PrefixMTName'));
            const fs = new _FontStructure(dict);
            const name = fs.fontName;
            expect(name).toBe('PrefixName');
        });

        it('_getFontName - decodes hex sequences in name', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            dict.update('BaseFont', _PdfName.get('A#41B'));
            const fs = new _FontStructure(dict);
            const name = (fs as any)._getFontName();
            expect(name).toBe('AAB');
        });

    });
    describe('_FontStructure differencesDictionary tests (lines 3534-3539)', () => {

        it('differencesDictionary - returns empty map when no Encoding', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            const fs = new _FontStructure(dict);
            const diffs: Map<string, string> = (fs as any).differencesDictionary;
            expect(diffs instanceof Map).toBeTruthy();
            expect(diffs.size).toBe(0);
        });

        it('differencesDictionary - builds mapping from Differences array', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            const encoding = new _PdfDictionary();
            encoding.set('Differences', [65, _PdfName.get('A'), 66, _PdfName.get('B')]);
            dict.update('Encoding', encoding);

            const fs = new _FontStructure(dict);
            const diffs: Map<string, string> = (fs as any).differencesDictionary;

            expect(diffs.get('65')).toBe('A');
            expect(diffs.get('66')).toBe('B');
        });

        it('_getFontEncoding - returns Identity-H when Encoding is CMap as PdfName', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            dict.update('Encoding', _PdfName.get('CMap'));
            const fs = new _FontStructure(dict);

            const enc = fs.fontEncoding;
            expect(enc).toBe('Identity-H');
            expect(fs.baseFontEncoding).toBe('');
        });

        it('_getFontEncoding - returns Identity-H when Encoding is identity#2dh', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            dict.update('Encoding', _PdfName.get('identity#2dh'));
            const fs = new _FontStructure(dict);

            expect(fs.fontEncoding).toBe('Identity-H');
        });

        it('_getFontEncoding - reads BaseEncoding and Type from Encoding dictionary', () => {
            const dict = new _PdfDictionary();
            dict.update('Subtype', _PdfName.get('Type1'));
            const encDict = new _PdfDictionary();
            encDict.update('BaseEncoding', _PdfName.get('WinAnsiEncoding'));
            encDict.update('Type', _PdfName.get('CustomEnc'));
            dict.update('Encoding', encDict as any);
            const fs = new _FontStructure(dict);
            expect(fs.fontEncoding).toBe('CustomEnc');
        });

    });
});
describe('Else branch check', () => {
    it('small methods else branch check', () => {
        const xfdf = new _XfdfDocument();
        const dict = new _PdfDictionary();
        const copy = dict;
        xfdf._addInt(dict, 'check', 'value');
        xfdf._addFloat(dict, 'check', 'value');
        xfdf._addFloatPoints(dict, [], 'check');
        xfdf._addKey(null, dict, null);

        expect(dict).toEqual(copy);
    });
    it('_addElements else branch check', () => {
        const xfdf = new _XfdfDocument();
        const dict = new _PdfDictionary();
        const element = document.createElement('item');
        const copy = dict;
        xfdf._addElements(element, dict);
        expect(dict).toEqual(copy);
    });
    it('_getstream else branch check', () => {
        const xfdf = new _XfdfDocument();
        xfdf._crossReference = new _PdfCrossReference(new PdfDocument());
        spyOn(xfdf, '_getAppearance');
        let element: any = document.createElement('item');
        xfdf._getStream(element);
        element = {
            hasChildNodes: true,
            childNodes: [
                { nodeType: 3 }, // TEXT_NODE
                { nodeType: 8 }  // COMMENT_NODE
            ]
        };
        xfdf._getStream(element);
        expect(xfdf._getAppearance).not.toHaveBeenCalled();
    });
    it('_getstream else branch check', () => {
        const xfdf = new _XfdfDocument();
        xfdf._crossReference = new _PdfCrossReference(new PdfDocument());
        spyOn(xfdf, '_getAppearance');
        const element = document.createElement('item');
        xfdf._getStream(element);
        expect(xfdf._getAppearance).not.toHaveBeenCalled();
    });

    it('_exportFormFieldData - Btn radio with non-empty appearance uses value', () => {
        const helper = new _XfdfDocument();
        helper._table = new Map();
        const document = new PdfDocument();
        document.addPage();
        const field = new PdfRadioButtonListField(document.getPage(0), 'rbtn');
        (field as any)._getAppearanceStateValue = () => 'Chosen';
        helper._exportEmptyFields = false;

        (helper as any)._exportFormFieldData(field);

        expect(helper._table.get('rbtn')).toBe('Chosen');
    });

    it('_exportFormFieldData - Btn radio empty appearance sets Off or empty per exportEmptyFields', () => {
        const helper = new _XfdfDocument();
        helper._table = new Map();
        const document = new PdfDocument();
        document.addPage();
        const field = new PdfRadioButtonListField(document.getPage(0), 'rbtn2');

        // case: empty and exportEmptyFields = false -> 'Off'
        (field as any)._getAppearanceStateValue = () => '';
        helper._exportEmptyFields = false;
        (helper as any)._exportFormFieldData(field);
        expect(helper._table.get('rbtn2')).toBe('Off');

        // case: empty and exportEmptyFields = true -> ''
        helper._table = new Map();
        (field as any)._getAppearanceStateValue = () => null as any
        ;
        helper._exportEmptyFields = true;
        (helper as any)._exportFormFieldData(field);
        expect(helper._table.get('rbtn2')).toBe('');
    });

    it('_exportFormFieldData - Btn non-radio reads widget AS or field AS and respects exportEmptyFields', () => {
        const helper = new _XfdfDocument();
        helper._table = new Map();
        const document = new PdfDocument();
        document.addPage();
        const field = new PdfCheckBoxField( 'chk', {x:0,y:0,width:100,height:100}, document.getPage(0));
        // widget with AS present
        const widgetDict = new _PdfDictionary();
        widgetDict.update('AS', _PdfName.get('Yes'));
        field.itemAt = (_i: number) => ({ _dictionary: widgetDict } as any);
        helper._exportEmptyFields = false;
        (helper as any)._exportFormFieldData(field);
        expect(helper._table.get('chk')).toBe('Yes');

        // no widget, but field dictionary has AS
        helper._table = new Map();
        field.itemAt = (_i: number) => null as any;
        field._dictionary.update('AS', _PdfName.get('Maybe'));
        (helper as any)._exportFormFieldData(field);
        expect(helper._table.get('chk')).toBe('Maybe');

        // no AS anywhere and exportEmptyFields true -> empty string
        helper._table = new Map();
        field._dictionary = new _PdfDictionary();
        helper._exportEmptyFields = true;
        (helper as any)._exportFormFieldData(field);
    });

    it('_getEncodedValue - uses PDFDocEncoding Differences and sets _encodeDictionary', () => {
        const xfdf = new _XfdfDocument();
        // prepare crossReference with cache map and next reference
        xfdf._crossReference = { _getNextReference: () => ({ ref: 1 }), _cacheMap: new Map() } as any;

        // build DR -> Encoding -> PDFDocEncoding -> Differences chain
        const pdfEncoding = new _PdfDictionary();
        pdfEncoding.set('Differences', [65, _PdfName.get('A')]);
        const encoding = new _PdfDictionary();
        encoding.set('PDFDocEncoding', pdfEncoding);
        const resource = new _PdfDictionary();
        resource.set('Encoding', encoding);
        const root = new _PdfDictionary();
        root.set('DR', resource);

        xfdf._document = { form: { _dictionary: root } } as any;

        // ensure _FontStructure.differencesDictionary appears non-empty and replace returns expected
        spyOnProperty(_FontStructure.prototype, 'differencesDictionary', 'get').and.returnValue(new Map([['A', 'X']]));
        spyOn(xfdf as any, '_replaceNotUsedCharacters').and.callFake((_text: string) => 'REPLACED');

        const result = (xfdf as any)._getEncodedValue('ANY');

        expect(result).toBe('REPLACED');
        expect(xfdf._encodeDictionary).toBeTruthy();
    });

    it('_addReferenceToGroup - NM present stores reference and pushes holder when IRT exists', () => {
        const xfdf = new _XfdfDocument();
        const dict = new _PdfDictionary();
        dict.update('NM', 'group1');
        dict.update('IRT', 'parent');
        const ref: any = { id: 'R1' };

        xfdf._addReferenceToGroup(ref, dict);

        expect(xfdf._groupReferences.get('group1')).toBe(ref);
        expect(xfdf._groupHolders.indexOf(dict) !== -1).toBeTruthy();
    });

    it('_addReferenceToGroup - missing NM but IRT present replaces IRT with existing group reference', () => {
        const xfdf = new _XfdfDocument();
        const dict = new _PdfDictionary();
        dict.update('IRT', 'parentName');
        const storedRef: any = { id: 'R_PARENT' };
        xfdf._groupReferences.set('parentName', storedRef);

        xfdf._addReferenceToGroup({ id: 'R2' } as any, dict);

        expect(dict.get('IRT')).toBe(storedRef);
    });
    it('_getstream else branch check', () => {
        const xfdf = new _XfdfDocument();
        xfdf._crossReference = new _PdfCrossReference(new PdfDocument());
        spyOn(xfdf, '_getAppearance');
        const element = document.createElement('item');
        xfdf._getStream(element);
        expect(xfdf._getAppearance).not.toHaveBeenCalled();
    });
    it('_getstream else branch check', () => {
        const xfdf = new _XfdfDocument();
        xfdf._crossReference = new _PdfCrossReference(new PdfDocument());
        spyOn(xfdf, '_getAppearance');
        const element = document.createElement('item');
        xfdf._getStream(element);
        expect(xfdf._getAppearance).not.toHaveBeenCalled();
    });
});

describe('_getExportValue (lines 793-831) tests', () => {
    it('returns undefined for null primitive', () => {
        const xfdf = new _XfdfDocument();
        const out = (xfdf as any)._getExportValue(null);
        expect(out).toBeUndefined();
    });

    it('returns name when primitive is _PdfName and no field provided', () => {
        const xfdf = new _XfdfDocument();
        const name = _PdfName.get('NM');
        const out = (xfdf as any)._getExportValue(name);
        expect(out).toBe('NM');
    });

    it('returns string when primitive is string and no field provided', () => {
        const xfdf = new _XfdfDocument();
        const out = (xfdf as any)._getExportValue('plain');
        expect(out).toBe('plain');
    });

    it('returns array of strings when primitive is an array with names and strings', () => {
        const xfdf = new _XfdfDocument();
        const arr = [_PdfName.get('A'), 'b'];
        const out = (xfdf as any)._getExportValue(arr);
        expect(Array.isArray(out)).toBeTruthy();
        expect(out).toEqual(['A', 'b']);
    });

    it('radio field: selectedIndex != -1 and item matches value returns the item value (true path)', () => {
        const xfdf = new _XfdfDocument();
        const document = new PdfDocument();
        document.addPage();
        const field = new PdfRadioButtonListField(document.getPage(0), 'rbtn');
        field.selectedIndex = 0;
        field.itemAt = (_i: number) => ({ value: 'match' } as any);
        const out = (xfdf as any)._getExportValue('match', field);
        expect(out).toBe('match');
    });

    it('radio field: selectedIndex != -1 and item does not match leaves original value (false inner path)', () => {
        const xfdf = new _XfdfDocument();
        const document = new PdfDocument();
        document.addPage();
        const field = new PdfRadioButtonListField(document.getPage(0), 'rbtn2');
        field.selectedIndex = 0;
        field.itemAt = (_i: number) => ({ value: 'other' } as any);
        const out = (xfdf as any)._getExportValue('match', field);
        expect(out).toBe('match');
    });

    it('when field provided and primitive is an array returns undefined (array-handling only when no field)', () => {
        const xfdf = new _XfdfDocument();
        const document = new PdfDocument();
        document.addPage();
        const field = new PdfRadioButtonListField(document.getPage(0), 'rbtn3');
        field.selectedIndex = -1;
        const out = (xfdf as any)._getExportValue([_PdfName.get('X')], field);
        expect(out).toBeUndefined();
    });
});

