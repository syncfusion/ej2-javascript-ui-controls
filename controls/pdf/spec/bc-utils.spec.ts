import { _checkRotation, _annotationFlagsToString, _stringToAnnotationFlags, _stringToPdfString, _stringToBytes, _areArrayEqual, _arePointsEqual, _numberToString, _areNotEqual, _arePointsNotEqual, _bytesToString, _decodeUnicodeBytes, _hexStringToString, _hexStringToByteArray, _decode, _encode, _updateBounds, _parseRectangle, _calculateBounds, _getUpdatedBounds, _fromRectangle, _encodeCodePointToUtf8, _toHex2, _escapePdfName, _getNewGuidString, _addProcSet, _floatToString, _mapBlendMode, _reverseMapHighlightMode, _mapHighlightMode, _mapLineEndingStyle, _reverseMapEndingStyle, _mapBorderStyle, _mapBorderEffectStyle, _parseColor, _isPointArray, _convertToPoints, _reverseMapBlendMode, _isHexDigit, _getBezierArc, _findPage, _checkField, _getItemValue, _getColorValue, _setMatrix, _styleToString, _stringToStyle, _mapMeasurementUnit, _mapMarkupAnnotationType, _reverseMarkupAnnotationType, _mapGraphicsUnit, _mapRubberStampIcon, _mapPopupIcon, _reverseMapAnnotationState, _mapAnnotationState, _reverseMapAnnotationStateModel, _mapAnnotationStateModel, _mapAttachmentIcon, _mapAnnotationIntent, _reverseMapPdfFontStyle, _getSpecialCharacter, _getLatinCharacter, _encodeValue, _getCommentsOrReview, _checkReview, _checkComment, _updateVisibility, _removeDuplicateReference, _removeDuplicateFromResources, _removeReferences, BaseException, FormatError, ParserEndOfFileException, _defaultToString, _getCenterX, _getCenterY } from "../src/pdf/core/utils";
import { PdfRotationAngle, PdfAnnotationFlag, PdfRubberStampAnnotationIcon, PdfBorderStyle, PdfLineEndingStyle, PdfHighlightMode, PdfBlendMode, PdfCheckBoxStyle, PdfMeasurementUnit, PdfTextMarkupAnnotationType, _PdfGraphicsUnit, PdfPopupIcon, PdfAnnotationState, PdfAnnotationStateModel, PdfAttachmentIcon, PdfAnnotationIntent } from "../src/pdf/core/enumerator";
import { PdfDocument, PdfPageSettings } from "../src/pdf/core/pdf-document";
import { PdfRubberStampAnnotation } from "../src/pdf/core/annotations/annotation";
import { PdfFontStyle } from "../src/pdf/core/fonts/pdf-standard-font";

describe('Utils - _checkRotation', () => {
    it('angle90 (integration): height undefined -> returns 0', () => {
        const doc = new PdfDocument();
        const page: any = doc.addPage();
        page.rotation = PdfRotationAngle.angle90;
        // left provided but height is undefined -> branch returns 0
        const result = _checkRotation(page, undefined as any, 10);
        expect(result).toBe(0);
    });

    it('angle90 (integration): height provided -> returns left', () => {
        const doc = new PdfDocument();
        let setting: PdfPageSettings = new PdfPageSettings({ rotation: PdfRotationAngle.angle90 });
        const page: any = doc.addPage(setting);
        const result = _checkRotation(page, 5, 10);
        expect(result).toBe(10);
    });

    it('angle180 (integration): height undefined -> returns 0', () => {
        const doc = new PdfDocument();
        let setting: PdfPageSettings = new PdfPageSettings({ rotation: PdfRotationAngle.angle180 });
        const page: any = doc.addPage(setting);
        const result = _checkRotation(page, undefined as any, 0);
        expect(result).toBe(0);
    });

    it('angle180 (integration): height provided -> returns height', () => {
        const doc = new PdfDocument();
        let setting: PdfPageSettings = new PdfPageSettings({ rotation: PdfRotationAngle.angle180 });
        const page: any = doc.addPage(setting);
        const result = _checkRotation(page, 50, 0);
        expect(result).toBe(50);
    });

    it('angle270 (integration): height undefined -> returns 0', () => {
        const doc = new PdfDocument();
        let setting: PdfPageSettings = new PdfPageSettings({ rotation: PdfRotationAngle.angle270, size: { width: 200, height: 300 } });
        const page: any = doc.addPage(setting);
        const result = _checkRotation(page, undefined as any, 20);
        expect(result).toBe(0);
    });

    it('angle270 (integration): height provided -> returns size.width - left', () => {
        const doc = new PdfDocument();
        let setting: PdfPageSettings = new PdfPageSettings({ rotation: PdfRotationAngle.angle270, size: { width: 200, height: 300 } });
        const page: any = doc.addPage(setting);
        const result = _checkRotation(page, 1, 20);
        expect(result).toBe(180);
    });

    it('left defaults to 0 when undefined or null (integration)', () => {
        const doc = new PdfDocument();
        let setting: PdfPageSettings = new PdfPageSettings({ rotation: PdfRotationAngle.angle90 });
        let setting1: PdfPageSettings = new PdfPageSettings({ rotation: PdfRotationAngle.angle270, size: { width: 100, height: 200 } });
        const page: any = doc.addPage(setting);
        expect(_checkRotation(page, 1, undefined as any)).toBe(0);
        const p2: any = doc.addPage(setting1);
        expect(_checkRotation(p2, 1, null as any)).toBe(100);
    });

    it('integration: PdfDocument page with rotation 270', () => {
        const doc = new PdfDocument();
        let setting: PdfPageSettings = new PdfPageSettings({ rotation: PdfRotationAngle.angle270, size: { width: 400, height: 800 } });
        const page: any = doc.addPage(setting);
        const result = _checkRotation(page, 5, 25);
        expect(result).toBe(375);
    });

    it('annotation flags to string - multiple flags', () => {
        const flag = PdfAnnotationFlag.hidden | PdfAnnotationFlag.invisible | PdfAnnotationFlag.print | PdfAnnotationFlag.readOnly;
        const str = _annotationFlagsToString(flag);
        expect(str).toBe('hidden,invisible,print,readonly');
    });

    it('string to annotation flags - known and unknown', () => {
        expect(_stringToAnnotationFlags('hidden')).toBe(PdfAnnotationFlag.hidden);
        expect(_stringToAnnotationFlags('noview')).toBe(PdfAnnotationFlag.noView);
        expect(_stringToAnnotationFlags('togglenoview')).toBe(PdfAnnotationFlag.toggleNoView);
        // unknown string should map to default (0)
        expect(_stringToAnnotationFlags('unknown-string')).toBe(PdfAnnotationFlag.default);
    });

    it('annotationFlagsToString covers all single flags', () => {
        const mappings: Array<[number, string]> = [
            [PdfAnnotationFlag.hidden, 'hidden'],
            [PdfAnnotationFlag.invisible, 'invisible'],
            [PdfAnnotationFlag.locked, 'locked'],
            [PdfAnnotationFlag.noRotate, 'norotate'],
            [PdfAnnotationFlag.noView, 'noview'],
            [PdfAnnotationFlag.noZoom, 'nozoom'],
            [PdfAnnotationFlag.print, 'print'],
            [PdfAnnotationFlag.readOnly, 'readonly'],
            [PdfAnnotationFlag.toggleNoView, 'togglenoview'],
            [PdfAnnotationFlag.default, ''],
            [PdfAnnotationFlag.default | PdfAnnotationFlag.readOnly, 'readonly']
        ];
        for (const [flag, expected] of mappings) {
            expect(_annotationFlagsToString(flag)).toBe(expected);
        }
    });

    it('stringToAnnotationFlags covers all strings', () => {
        const pairs: Array<[string, number]> = [
            ['hidden', PdfAnnotationFlag.hidden],
            ['invisible', PdfAnnotationFlag.invisible],
            ['locked', PdfAnnotationFlag.locked],
            ['norotate', PdfAnnotationFlag.noRotate],
            ['noview', PdfAnnotationFlag.noView],
            ['nozoom', PdfAnnotationFlag.noZoom],
            ['print', PdfAnnotationFlag.print],
            ['readonly', PdfAnnotationFlag.readOnly],
            ['togglenoview', PdfAnnotationFlag.toggleNoView],
        ];
        for (const [str, flag] of pairs) {
            expect(_stringToAnnotationFlags(str)).toBe(flag);
        }
        // ensure unknown maps to default
        expect(_stringToAnnotationFlags('')).toBe(PdfAnnotationFlag.default);
    });

    it('stringToPdfString - ascii passes through', () => {
        const input = 'Hello, World!';
        const out = _stringToPdfString(input);
        expect(out).toBe('Hello, World!');
    });

    it('stringToPdfString - utf8 BOM decodes', () => {
        const input = '\xEF\xBB\xBFabc';
        const out = _stringToPdfString(input);
        expect(typeof out).toBe('string');
        expect(out).toContain('abc');
    });

    it('stringToPdfString - utf16le BOM decodes or returns string', () => {
        const input = '\xFF\xFEa\x00b\x00c\x00';
        const out = _stringToPdfString(input);
        expect(typeof out).toBe('string');
        expect(out.length).toBeGreaterThan(0);
    });

    it('stringToPdfString - utf16be BOM decodes or returns string', () => {
        const input = '\xFE\xFF\x00a\x00b\x00c';
        const out = _stringToPdfString(input);
        expect(typeof out).toBe('string');
        expect(out.length).toBeGreaterThan(0);
    });
    it('_stringToBytes - isPassword true returns char codes (Uint8Array)', () => {
        const out = _stringToBytes('abc', false, true) as Uint8Array;
        expect(Array.from(out)).toEqual([97, 98, 99]);
    });

    it('_stringToBytes - isDirect true for ASCII', () => {
        const out = _stringToBytes('A', true) as number[];
        expect(out).toEqual([65]);
    });

    it('_stringToBytes - two-byte UTF-8 (©)', () => {
        const out = _stringToBytes('©', true) as number[];
        expect(out).toEqual([0xC2, 0xA9]);
    });

    it('_stringToBytes - three-byte UTF-8 (€)', () => {
        const out = _stringToBytes('€', true) as number[];
        expect(out).toEqual([0xE2, 0x82, 0xAC]);
    });

    it('_stringToBytes - four-byte UTF-8 (surrogate pair 😀)', () => {
        const smile = '\uD83D\uDE00';
        const out = _stringToBytes(smile, true) as number[];
        expect(out).toEqual([0xF0, 0x9F, 0x98, 0x80]);
    });

    it('_stringToBytes - uses destination array when provided', () => {
        const dest: number[] = [1, 2];
        const out = _stringToBytes('A', true, false, dest) as number[];
        expect(out).toBe(dest);
        expect(dest.slice(-1)).toEqual([65]);
    });
    it('_areArrayEqual works for Uint8Array and number[]', () => {
        const a = new Uint8Array([1, 2, 3]);
        const b = new Uint8Array([1, 2, 3]);
        const c = [1, 2, 4];
        expect(_areArrayEqual(a, b)).toBeTruthy();
        expect(_areArrayEqual(a, c as any)).toBeFalsy();
    });

    it('_arePointsEqual and _arePointsNotEqual', () => {
        const p1 = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
        const p2 = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
        const p3 = [{ x: 1, y: 2 }];
        expect(_arePointsEqual(p1 as any, p2 as any)).toBeTruthy();
        expect(_arePointsEqual(p1 as any, p3 as any)).toBeFalsy();
        expect(_arePointsNotEqual(p1 as any, p2 as any)).toBeFalsy();
        expect(_arePointsNotEqual(p1 as any, p3 as any)).toBeTruthy();
    });

    it('_numberToString integer and float', () => {
        expect(_numberToString(5)).toBe('5');
        expect(_numberToString(3.14159)).toBe((3.14159).toFixed(7));
    });

    it('_areNotEqual checks arrays correctly', () => {
        expect(_areNotEqual([1, 2, 3], [1, 2, 3])).toBeFalsy();
        expect(_areNotEqual([1, 2], [1, 2, 3])).toBeTruthy();
        expect(_areNotEqual([1, 2, 4], [1, 2, 3])).toBeTruthy();
    });

    it('_bytesToString small and large paths with isJson true/false', () => {
        const small = new Uint8Array([65, 66, 67]);
        expect(_bytesToString(small, false)).toBe('ABC');
        // mixed unicode bytes: A, ¢, €, 😀
        const mixed = new Uint8Array([65, 0xC2, 0xA2, 0xE2, 0x82, 0xAC, 0xF0, 0x9F, 0x98, 0x80]);
        expect(_bytesToString(mixed, true)).toBe(_decodeUnicodeBytes(mixed));

        // large array triggers chunking
        const large = new Uint8Array(9000);
        for (let i = 0; i < 9000; i++) {
            large[i] = 65;
        }
        const out = _bytesToString(large, false);
        expect(out.length).toBe(9000);
        expect(out[0]).toBe('A');
    });

    it('_decodeUnicodeBytes covers 1/2/3/4 byte sequences', () => {
        expect(_decodeUnicodeBytes(new Uint8Array([0x41]))).toBe('A');
        expect(_decodeUnicodeBytes(new Uint8Array([0xC2, 0xA2]))).toBe('¢');
        expect(_decodeUnicodeBytes(new Uint8Array([0xE2, 0x82, 0xAC]))).toBe('€');
    });

    it('_hexStringToString converts #hex to string and returns input otherwise', () => {
        expect(_hexStringToString('#48656c6c6f')).toBe('Hello');
        expect(_hexStringToString('nohash')).toBe('nohash');
    });

    it('base64 encode/decode chunk and full roundtrip', () => {
        const b = new Uint8Array([72, 101, 108, 108, 111]); // 'Hello'
        const encoded = _encode(b);
        expect(typeof encoded).toBe('string');
        const decoded = _decode(encoded) as Uint8Array;
        expect(_bytesToString(decoded, false)).toBe('Hello');
        const dec2 = _decode('SGVsbG8=');
        expect(_bytesToString(dec2 as Uint8Array, false)).toBe('Hello');
    });
    it('_decode with isDirect true returns number[]', () => {
        const decDirect = _decode('SGVsbG8=', true) as number[];
        expect(Array.isArray(decDirect)).toBeTruthy();
        expect(_bytesToString(new Uint8Array(decDirect), false)).toBe('Hello');
    });

    it('large buffer encode/decode triggers chunking (may be memory heavy)', () => {
        // chunkSize in _decode is 3_000_000, create slightly larger buffer
        const largeSize = 3000001;
        const large = new Uint8Array(largeSize);
        for (let i = 0; i < largeSize; i++) { large[i] = 65; } // all 'A'
        const encodedLarge = _encode(large); // hits large/chunked encode path
        expect(typeof encodedLarge).toBe('string');
        const decodedLarge = _decode(encodedLarge) as Uint8Array; // hits large/chunked decode path
        expect(decodedLarge.length).toBe(3000002);
        // spot-check
        expect(decodedLarge[0]).toBe(65);
        expect(decodedLarge[largeSize - 1]).toBe(65);
    });

    it('_parseRectangle - isWidget negative and negative-greater-than case', () => {
        const dict1: any = { getArray: (k: string) => [10, -5, 20, 30], has: (k: string) => true };
        const r1 = _parseRectangle(dict1, true);
        expect(r1.x).toBe(10);
        expect(r1.y).toBe(-5);
        expect(r1.width).toBe(10);
        expect(r1.height).toBe(35);
        const dict2: any = { getArray: (k: string) => [10, -1, 20, -5], has: (k: string) => true };
        const r2 = _parseRectangle(dict2, true);
        expect(r2.x).toBe(10);
        expect(r2.y).toBe(-5);
        expect(r2.width).toBe(10);
        expect(r2.height).toBe(4);
    });
    it('_calculateBounds - cropBox true-branch, cropBox false-branch, mediaBox branch, page undefined and missing Rect', () => {
        const dict: any = { getArray: (k: string) => [10, 20, 30, 40], has: (k: string) => true };
        const doc = new PdfDocument();
        const setting: any = { size: { width: 200, height: 300 } } as PdfPageSettings;
        const page: any = doc.addPage(setting);
        // cropBox branch where condition is true (cropBox[0] !== 0)
        page._pageDictionary.update('CropBox', [5, 0, 200, 300]);
        let res = _calculateBounds(dict, page);
        expect(res.x).toBe(5);
        expect(res.y).toBe(300 - (20 + 20));
        expect(res.width).toBe(20);
        expect(res.height).toBe(20);
        // cropBox exists but condition false -> x unchanged
        page._pageDictionary.update('CropBox', [0, 0, 999, 999]);
        res = _calculateBounds(dict, page);
        expect(res.x).toBe(5);
        // remove CropBox and set MediaBox to trigger media box branch
        delete page._pageDictionary._map['CropBox'];
        page._pageDictionary.update('MediaBox', [5, 0, 200, 300]);
        res = _calculateBounds(dict, page);
        expect(res.x).toBe(10);
        expect(res.y).toBe(300 - (20 + 20));
        // page undefined -> rect.y = rect.y + rect.height
        const rUndefined = _calculateBounds(dict, undefined as any);
        expect(rUndefined.x).toBe(10);
        expect(rUndefined.y).toBe(20 + 20);
        // missing Rect -> returns undefined
        const dictNoRect: any = { has: (k: string) => false };
        const missing = _calculateBounds(dictNoRect, page);
        expect(missing).toBeUndefined();
        doc.destroy();
    });

    it('_isPointArray and _convertToPoints', () => {
        expect(_isPointArray([{ x: 1, y: 2 }])).toBeTruthy();
        expect(_isPointArray([1, 2] as any)).toBeFalsy();
        const pts = _convertToPoints([1, 2, 3, 4]);
        expect(pts).toEqual([{ x: 1, y: 2 }, { x: 3, y: 4 }]);
    });

    it('_parseColor basic cases', () => {
        expect(_parseColor([0.5])).toEqual({ r: Math.round(0.5 * 255), g: Math.round(0.5 * 255), b: Math.round(0.5 * 255) });
        expect(_parseColor([1, 0, 0])).toEqual({ r: 255, g: 0, b: 0 });
        expect(_parseColor([0, 0, 0, 1])).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('_mapBorderStyle and line ending mappers', () => {
        const nameD = _mapBorderStyle(PdfBorderStyle.dot);
        expect(nameD.name).toBe('D');
        const rev = _reverseMapEndingStyle(PdfLineEndingStyle.openArrow);
        expect(rev).toBe('OpenArrow');
        expect(_mapLineEndingStyle('openarrow')).toBe(PdfLineEndingStyle.openArrow);
        expect(_mapLineEndingStyle('unknown')).toBe(PdfLineEndingStyle.none);
    });

    it('_mapHighlightMode and reverse', () => {
        expect(_mapHighlightMode('P')).toBe(PdfHighlightMode.push);
        expect(_reverseMapHighlightMode(PdfHighlightMode.push).name).toBe('P');
    });

    it('_reverseMapBlendMode and _mapBlendMode', () => {
        const nm = _reverseMapBlendMode(PdfBlendMode.multiply);
        expect(nm.name).toBe('Multiply');
        expect(_mapBlendMode({ name: 'Multiply' } as any)).toBe(PdfBlendMode.multiply);
        expect(_mapBlendMode({ name: 'UnknownMode' } as any)).toBe(PdfBlendMode.normal);
    });

    it('_floatToString, _addProcSet and _getNewGuidString', () => {
        expect(_floatToString(0)).toBe('.00');
        expect(_floatToString(1.234)).toBe('1.23');

        const mock: any = { has: (k: string) => false, update: (k: string, v: any) => { mock.updated = v; }, getArray: (k: string) => mock._array };
        _addProcSet('ExtGState', mock);
        expect(mock.updated && mock.updated[0].name).toBe('ExtGState');

        const g = _getNewGuidString();
        expect(typeof g).toBe('string');
        expect(g.length).toBe(36);
        expect(g[14]).toBe('4');
    });

    it('_escapePdfName, _encodeCodePointToUtf8, _toHex2, _isHexDigit and _getBezierArc', () => {
        expect(_escapePdfName('abc')).toBe('abc');
        expect(_escapePdfName('(')).toBe('#28');
        const emojiEsc = _escapePdfName('\uD83D\uDE00');
        expect(typeof emojiEsc).toBe('string');

        expect(_encodeCodePointToUtf8(0x41)).toEqual([0x41]);
        expect(_encodeCodePointToUtf8(0x20AC)).toEqual([0xE2, 0x82, 0xAC]);

        expect(_toHex2(1)).toBe('01');
        expect(_toHex2(255)).toBe('FF');
        expect(_isHexDigit('A')).toBeTruthy();
        expect(_isHexDigit('g')).toBeFalsy();

        const bez = _getBezierArc(0, 100, 100, 0, 0, 45);
        expect(Array.isArray(bez)).toBeTruthy();
        expect(bez.length).toBe(8);
    });
    it('additional mapping and helper branches', () => {
        // border style mappings
        expect(_mapBorderStyle(PdfBorderStyle.dashed).name).toBe('D');
        expect(_mapBorderStyle(PdfBorderStyle.beveled).name).toBe('B');
        expect(_mapBorderStyle(PdfBorderStyle.inset).name).toBe('I');
        expect(_mapBorderStyle(PdfBorderStyle.underline).name).toBe('U');

        // border effect
        expect(_mapBorderEffectStyle('C')).toBeDefined();
        expect(_mapBorderEffectStyle('X')).toBeDefined();

        // line endings reverse and map
        expect(_reverseMapEndingStyle(PdfLineEndingStyle.closedArrow)).toBe('ClosedArrow');
        expect(_reverseMapEndingStyle(PdfLineEndingStyle.butt)).toBe('Butt');
        expect(_mapLineEndingStyle('closedarrow')).toBe(PdfLineEndingStyle.closedArrow);
        expect(_mapLineEndingStyle('diamond')).toBe(PdfLineEndingStyle.diamond);

        // highlight modes
        expect(_mapHighlightMode('N')).toBe(PdfHighlightMode.noHighlighting);
        expect(_mapHighlightMode('O')).toBe(PdfHighlightMode.outline);
        expect(_mapHighlightMode('X')).toBe(PdfHighlightMode.invert);
        expect(_reverseMapHighlightMode(PdfHighlightMode.noHighlighting).name).toBe('N');

        // blend modes many branches
        const blendPairs: Array<[PdfBlendMode, string]> = [
            [PdfBlendMode.screen, 'Screen'],
            [PdfBlendMode.overlay, 'Overlay'],
            [PdfBlendMode.darken, 'Darken'],
            [PdfBlendMode.lighten, 'Lighten'],
            [PdfBlendMode.colorDodge, 'ColorDodge'],
            [PdfBlendMode.colorBurn, 'ColorBurn'],
            [PdfBlendMode.hardLight, 'HardLight'],
            [PdfBlendMode.softLight, 'SoftLight'],
            [PdfBlendMode.difference, 'Difference'],
            [PdfBlendMode.exclusion, 'Exclusion'],
            [PdfBlendMode.hue, 'Hue'],
            [PdfBlendMode.saturation, 'Saturation'],
            [PdfBlendMode.color, 'Color'],
            [PdfBlendMode.luminosity, 'Luminosity']
        ];
        for (const [mode, name] of blendPairs) {
            expect(_reverseMapBlendMode(mode).name).toBe(name);
            expect(_mapBlendMode({ name } as any)).toBe(mode);
        }

        // _addProcSet when ProcSet exists and when not
        let procPushed = false;
        const procsetPresent: any = { indexOf: (_n: any) => 0, push: function(_n: any) { procPushed = true; } };
        const dictPresent: any = { has: (k: string) => true, getArray: (k: string) => procsetPresent, update: (k: string, v: any) => { dictPresent.updated = v; } };
        _addProcSet('ExtGState', dictPresent);
        expect(dictPresent.updated).toBeUndefined();

        let pushedObj: any = null;
        const procsetMissing: any = { indexOf: (_n: any) => -1, push: function(n: any) { this._pushed = n; pushedObj = n; } };
        const dictMissing: any = { has: (k: string) => true, getArray: (k: string) => procsetMissing, update: (k: string, v: any) => { dictMissing.updated = v; } };
        _addProcSet('NewProc', dictMissing);
        expect(dictMissing.updated).toBe(procsetMissing);
        expect(pushedObj && pushedObj.name).toBeDefined();

        // escape hex pass-through
        expect(_escapePdfName('#ab')).toBe('#AB');

        // encodeCodePointToUtf8 2-byte and 4-byte
        expect(_encodeCodePointToUtf8(0x7FF)).toEqual([0xDF, 0xBF]);
        expect(_encodeCodePointToUtf8(0x1F600)).toEqual([0xF0, 0x9F, 0x98, 0x80]);

        // bezier negative extent and large extent -> multi-segment
        const neg = _getBezierArc(0, 100, 100, 0, 0, -45);
        expect(Array.isArray(neg)).toBeTruthy();
        expect(neg.length).toBe(8);
        const multi = _getBezierArc(0, 100, 100, 0, 0, 180);
        expect(multi.length).toBeGreaterThan(8);
    });

    it('_escapePdfName surrogate and hex branches, _getBezierArc swaps, and _findPage', () => {
        // lone low surrogate -> encoded as replacement U+FFFD
        const lowSolo = String.fromCharCode(0xDC00);
        const lowEsc = _escapePdfName(lowSolo);
        expect(lowEsc.indexOf('#EF')).toBeGreaterThanOrEqual(0);

        // high surrogate followed by non-low -> replacement
        const highFollow = String.fromCharCode(0xD800) + 'A';
        const highEsc = _escapePdfName(highFollow);
        expect(highEsc.indexOf('#EF')).toBeGreaterThanOrEqual(0);

        // hex passthrough: leading '#' with two hex digits preserved uppercase
        expect(_escapePdfName('#1a')).toBe('#1A');

        // bezier arc where x1 > x2 and y2 > y1 triggers swaps
        const swapped = _getBezierArc(100, 0, 0, 200, 0, 45);
        expect(Array.isArray(swapped)).toBeTruthy();
        expect(swapped.length).toBeGreaterThanOrEqual(8);

        // _findPage: create document, add annotation, obtain its reference and find page
        const doc = new PdfDocument();
        const p1: any = doc.addPage();
        const p2: any = doc.addPage();
        const stamp = new PdfRubberStampAnnotation({ x: 5, y: 5, width: 10, height: 10 });
        p2.annotations.add(stamp);
        // the page dictionary should have Annots array of references
        const annots = p2._pageDictionary.get('Annots');
        expect(Array.isArray(annots)).toBeTruthy();
        const ref = annots[0];
        const found = _findPage(doc, ref);
        expect(found).toBe(p2);
        doc.destroy();
    });

    it('_checkField and _getItemValue basic branches', () => {
        // has AS with a non-Off name
        const dict1: any = { has: (k: string) => k === 'AS', get: (k: string) => (k === 'AS' ? { name: 'Yes' } : null) };
        expect(_checkField(dict1)).toBeTruthy();

        // has AS but AS returns null, fallback to V -> actual.name compared to _getItemValue (which returns '')
        const dict2: any = { has: (k: string) => k === 'AS' || k === 'V', get: (k: string) => (k === 'AS' ? null : { name: 'Some' }) };
        expect(_checkField(dict2)).toBeFalsy();

        // _getItemValue with non-_PdfDictionary returns empty string
        const notDict: any = { not: true };
        expect(_getItemValue(notDict)).toBe('');
    });

    it('_getColorValue covers many named colors and default', () => {
        const names = [
            'transparent','aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond',
            'blue','blueviolet','brown','burlywood','cadetBlue','chartreuse','chocolate','coral','cornflowerblue','cornsilk',
            'crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgreen','darkkhaki','darkmagenta','darkolivegreen',
            'darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkturquoise','darkviolet','deeppink',
            'deepskyblue','dimgray','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold',
            'goldenrod','gray','green','greenyellow','honeydew','hotpink','indianred','indigo','ivory','khaki',
            'lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgreen','lightgray',
            'lightsalmon','lightseagreen','lightskyblue','lightslategray','lightsteelblue','lightyellow','lime','limeGreen','linen','magenta',
            'maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred',
            'midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldLace','olive','olivedrab','orange',
            'orangered','orchid','palegoldenrod','palegreen','paleturquoise','palebioletred','papayawhip','peachpuff','peru','pink',
            'plum','powderblue','purple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen',
            'seashell','sienna','silver','skyblue','slateblue','slategray','snow','springgreen','steelblue','tan',
            'teal','thistle','tomato','turquoise','violet','wheat','white','whitesmoke','yellow','yellowgreen'
        ];
        for (const n of names) {
            const c = _getColorValue(n);
            expect(Array.isArray(c)).toBeTruthy();
            expect(c.length).toBe(3);
            expect(c.every(v => typeof v === 'number' && v >= 0 && v <= 255)).toBeTruthy();
        }
        expect(_getColorValue('not-a-color')).toBeUndefined();
    });

    it('_setMatrix angle 0/90/180/270 stores expected Matrix', () => {
        const template: any = { _content: { dictionary: { _set: null, getArray: (_k: string) => [1, 2, 3, 4], set: function(k: string, v: any) { this._set = v; } } } };
        _setMatrix(template as any, 0);
        expect(template._content.dictionary._set).toEqual([1, 0, 0, 1, -1, -2]);

        // angles 90/180/270 produce some matrix array set
        const t90: any = { _content: { dictionary: { _set: null, getArray: (_k: string) => [1, 2, 3, 4], set: function(k: string, v: any) { this._set = v; } } } };
        _setMatrix(t90 as any, 90);
        expect(Array.isArray(t90._content.dictionary._set)).toBeTruthy();

        const t180: any = { _content: { dictionary: { _set: null, getArray: (_k: string) => [1, 2, 3, 4], set: function(k: string, v: any) { this._set = v; } } } };
        _setMatrix(t180 as any, 180);
        expect(Array.isArray(t180._content.dictionary._set)).toBeTruthy();

        const t270: any = { _content: { dictionary: { _set: null, getArray: (_k: string) => [1, 2, 3, 4], set: function(k: string, v: any) { this._set = v; } } } };
        _setMatrix(t270 as any, 270);
        expect(Array.isArray(t270._content.dictionary._set)).toBeTruthy();
    });
    it('_getCenterX and _getCenterY transform bbox correctly (basic checks)', () => {
        const doc = new PdfDocument();
        const page: any = doc.addPage();
        const stamp = new PdfRubberStampAnnotation({ x: 10, y: 20, width: 30, height: 40 });
        // call center functions with 0 and 45 degrees
        const cx0 = _getCenterX(0, [10, 20, 30, 40], 15, stamp);
        const cy0 = _getCenterY(0, [10, 20, 30, 40], 20, stamp);
        expect(typeof cx0).toBe('number');
        expect(typeof cy0).toBe('number');
        const cx45 = _getCenterX(45, [10, 20, 30, 40], 15, stamp);
        const cy45 = _getCenterY(45, [10, 20, 30, 40], 20, stamp);
        expect(typeof cx45).toBe('number');
        expect(typeof cy45).toBe('number');
        doc.destroy();
    });

    it('_styleToString/_stringToStyle and many small mappers', () => {
        expect(_styleToString(PdfCheckBoxStyle.circle)).toBe('l');
        expect(_styleToString(PdfCheckBoxStyle.cross)).toBe('8');
        expect(_stringToStyle('l')).toBe(PdfCheckBoxStyle.circle);
        expect(_stringToStyle('8')).toBe(PdfCheckBoxStyle.cross);

        expect(_mapMeasurementUnit('cm')).toBe(PdfMeasurementUnit.centimeter);
        expect(_mapMeasurementUnit('pt')).toBe(PdfMeasurementUnit.point);

        expect(_mapMarkupAnnotationType('Underline')).toBe(PdfTextMarkupAnnotationType.underline);
        expect(_reverseMarkupAnnotationType(PdfTextMarkupAnnotationType.squiggly)).toBe('Squiggly');

        expect(_mapGraphicsUnit('mm')).toBe(_PdfGraphicsUnit.millimeter);
        expect(_mapRubberStampIcon('#Approved')).toBeDefined();
        expect(_mapPopupIcon('Note')).toBe(PdfPopupIcon.note);

        expect(_reverseMapAnnotationState(PdfAnnotationState.accepted)).toBe('Accepted');
        expect(_mapAnnotationState('Rejected')).toBe(PdfAnnotationState.rejected);
        expect(_reverseMapAnnotationStateModel(PdfAnnotationStateModel.review)).toBe('Review');
        expect(_mapAnnotationStateModel('Marked')).toBe(PdfAnnotationStateModel.marked);

        expect(_mapAttachmentIcon('Graph')).toBe(PdfAttachmentIcon.graph);
        expect(_mapAnnotationIntent('FreeTextCallout')).toBe(PdfAnnotationIntent.freeTextCallout);

        // reverseMapPdfFontStyle builds string from bitmask
        expect(_reverseMapPdfFontStyle(PdfFontStyle.bold | PdfFontStyle.italic)).toContain('Bold');
    });

    it('_getSpecialCharacter, _getLatinCharacter, _encodeValue and small helpers', () => {
        // special characters
        expect(_getSpecialCharacter('head2right')).toBe('\u27A2');
        expect(_getSpecialCharacter('aacute')).toBe('a\u0301');
        expect(_getSpecialCharacter('circle6')).toBe('\u25CF');
        // latin characters
        expect(_getLatinCharacter('zero')).toBe('0');
        expect(_getLatinCharacter('aacute')).toBe('á');
        expect(_getLatinCharacter('ellipsis')).toBe('...');

        // encodeValue escapes parentheses and hashes
        expect(_encodeValue('A B(C)#')).toContain('#28');
        expect(_encodeValue('abc')).toBe('abc');
    });

    it('_getCommentsOrReview, _checkReview/_checkComment and exceptions/strings', () => {
        const comment: any = { comments: ['c'], reviewHistory: ['r'] };
        expect(_getCommentsOrReview(comment as any, false)).toBe(comment.comments);
        expect(_getCommentsOrReview(comment as any, true)).toBe(comment.reviewHistory);

        const dictRev: any = { get: (k: string) => 30, has: (k: string) => (k === 'State'), }; // F -> 30
        expect(_checkReview(dictRev)).toBeTruthy();
        const dictCom: any = { get: (k: string) => 28, has: (k: string) => false };
        expect(_checkComment(dictCom)).toBeTruthy();

        const be = new BaseException('m', 'n');
        expect(be.message).toBe('m');
        const fe = new FormatError('fmt');
        expect(fe.name).toBe('FormatError');
        const pe = new ParserEndOfFileException('eof');
        expect(pe.name).toBe('ParserEndOfFileException');

        // _defaultToString
        expect(_defaultToString('str')).toBe('$sstr');
        expect(_defaultToString(123)).toBe('$o123');
    });
    

});
