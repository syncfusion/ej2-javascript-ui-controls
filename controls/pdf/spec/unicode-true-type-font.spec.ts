import { _UnicodeTrueTypeFont } from '../src/pdf/core/fonts/unicode-true-type-font';
import { Dictionary } from '../src/pdf/core/pdf-primitives';
import { _FontDescriptorFlag } from '../src/pdf/core/enumerator';
describe('_UnicodeTrueTypeFont targeted branch tests', () => {
    it('_generateFontProgram initializes _usedChars when null and writes font program', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = null;
        let written: any = null;
        font._fontProgram = {
            _clearStream: () => { written = null; },
            _writeBytes: (b: number[]) => { written = b; }
        };
        font._ttfReader = {
            _setOffset: () => { /* noop */ },
            _isOpenType: false,
            _readFontProgram: (_chars: any) => [10, 20, 30]
        };
        font._ttfMetrics = { _contains: false };
        (font as any)._generateFontProgram();
        expect(font._usedChars).toBeDefined();
        expect(written).toEqual([10, 20, 30]);
    });
    it('_generateCmap writes endbfrange when ranges split ( > 100 entries )', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        // ensure instance string fields exist (constructor not invoked on Object.create)
        font._cmapPrefix = '';
        font._cmapEndCodeSpaceRange = '';
        font._cmapBeginRange = 'beginbfrange\n';
        font._cmapEndRange = 'endbfrange\n';
        font._cmapSuffix = 'endbfrange\nendcmap\n';
        let captured = '';
        font._cmap = {
            _clearStream: () => { captured = ''; },
            _write: (s: string) => { captured = s; }
        };
        // Build glyphChars dictionary with 101 entries to force a range split and trigger endbfrange
        const glyphChars: Dictionary<number, number> = new Dictionary<number, number>();
        for (let i = 1; i <= 101; i++) {
            glyphChars.setValue(i, i + 1000);
        }
        font._ttfReader = {
            _getGlyphChars: (_used: any) => glyphChars
        };
        // ensure _usedChars appears non-empty so _generateCmap executes
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('a', '');
        (font as any)._generateCmap();
        expect(captured).toBeTruthy();
        expect(captured.indexOf('endbfrange')).toBeGreaterThanOrEqual(0);
    });
    it('_getDescriptorFlags computes flags for symbolic/fixed/italic/bold cases', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        // Case: all true -> fixedPitch + symbolic + italic + forceBold
        font._ttfReader = { _metrics: { _isFixedPitch: true, _isSymbol: true, _isItalic: true, _isBold: true } };
        const flagsAll = (font as any)._getDescriptorFlags();
        const expectedAll = _FontDescriptorFlag.fixedPitch | _FontDescriptorFlag.symbolic | _FontDescriptorFlag.italic | _FontDescriptorFlag.forceBold;
        expect(flagsAll).toBe(expectedAll);
        // Case: non-symbolic path (isSymbol = false) -> nonSymbolic bit set
        font._ttfReader = { _metrics: { _isFixedPitch: false, _isSymbol: false, _isItalic: false, _isBold: false } };
        const flagsNonSym = (font as any)._getDescriptorFlags();
        expect(flagsNonSym & _FontDescriptorFlag.nonSymbolic).toBe(_FontDescriptorFlag.nonSymbolic);
    });
});
describe('_UnicodeTrueTypeFont survived mutants batch 1', () => {
    it('Mutant 58: does not access the font descriptor when it is undefined', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._fontDescriptor = undefined;
        font._ttfMetrics = { _contains: false };
        font._fontProgram = {};
        font._descendantFontBeginSave = () => { /* noop */ };
        font._cmapBeginSave = () => { /* noop */ };
        font._fontDictionaryBeginSave = () => { /* noop */ };
        font._fontProgramBeginSave = () => { /* noop */ };
        expect(() => {
            font._beginSave();
        }).not.toThrow();
    });
    it('Mutant 61: updates FontFile3 when the font contains compact font data', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let updatedKey: any = null;
        let updatedValue: any = null;
        font._ttfMetrics = { _contains: true };
        font._fontProgram = { data: [10, 20, 30] };
        font._fontDescriptor = {
            _updated: false,
            _isFont: false,
            update: (key: string, value: any) => {
                updatedKey = key;
                updatedValue = value;
            }
        };
        font._descendantFontBeginSave = () => { /* noop */ };
        font._cmapBeginSave = () => { /* noop */ };
        font._fontDictionaryBeginSave = () => { /* noop */ };
        font._fontProgramBeginSave = () => { /* noop */ };
        font._beginSave();
        expect(updatedKey).toBe('FontFile3');
        expect(updatedValue).toBe(font._fontProgram);
    });
    it('Mutant 63: marks the font descriptor as updated', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfMetrics = { _contains: false };
        font._fontProgram = { data: [10, 20, 30] };
        font._fontDescriptor = {
            _updated: false,
            _isFont: false,
            update: (_key: string, _value: any) => { /* noop */ }
        };
        font._descendantFontBeginSave = () => { /* noop */ };
        font._cmapBeginSave = () => { /* noop */ };
        font._fontDictionaryBeginSave = () => { /* noop */ };
        font._fontProgramBeginSave = () => { /* noop */ };
        font._beginSave();
        expect(font._fontDescriptor._updated).toBe(true);
    });
    it('Mutant 64: marks the font descriptor as a font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfMetrics = { _contains: false };
        font._fontProgram = { data: [10, 20, 30] };
        font._fontDescriptor = {
            _updated: false,
            _isFont: false,
            update: (_key: string, _value: any) => { /* noop */ }
        };
        font._descendantFontBeginSave = () => { /* noop */ };
        font._cmapBeginSave = () => { /* noop */ };
        font._fontDictionaryBeginSave = () => { /* noop */ };
        font._fontProgramBeginSave = () => { /* noop */ };
        font._beginSave();
        expect(font._fontDescriptor._isFont).toBe(true);
    });
    it('Mutant 65: executes descendant-font save processing', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let assignedKey: any = null;
        let assignedValue: any = null;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._getDescendantWidth = () => [1, [600]];
        font._descendantFont = {
            set: (key: string, value: any) => {
                assignedKey = key;
                assignedValue = value;
            }
        };
        font._descendantFontBeginSave();
        expect(assignedKey).toBe('W');
        expect(assignedValue).toEqual([1, [600]]);
    });
    it('Mutant 66: skips descendant-width processing when used characters are null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthRequested: boolean = false;
        font._usedChars = null;
        font._getDescendantWidth = () => {
            widthRequested = true;
            return [1, [600]];
        };
        font._descendantFont = {
            set: (_key: string, _value: any) => { /* noop */ }
        };
        expect(() => {
            font._descendantFontBeginSave();
        }).not.toThrow();
        expect(widthRequested).toBe(false);
    });
    it('Mutant 67: processes descendant widths for non-empty used characters', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthRequested: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._getDescendantWidth = () => {
            widthRequested = true;
            return [1, [600]];
        };
        font._descendantFont = {
            set: (_key: string, _value: any) => { /* noop */ }
        };
        font._descendantFontBeginSave();
        expect(widthRequested).toBe(true);
    });
    it('Mutant 68: short-circuits before reading the size of null used characters', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = null;
        font._getDescendantWidth = () => [1, [600]];
        font._descendantFont = {
            set: (_key: string, _value: any) => { /* noop */ }
        };
        expect(() => {
            font._descendantFontBeginSave();
        }).not.toThrow();
    });
    it('Mutant 69: skips processing when used characters are undefined', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthRequested: boolean = false;
        font._usedChars = undefined;
        font._getDescendantWidth = () => {
            widthRequested = true;
            return [1, [600]];
        };
        font._descendantFont = {
            set: (_key: string, _value: any) => { /* noop */ }
        };
        expect(() => {
            font._descendantFontBeginSave();
        }).not.toThrow();
        expect(widthRequested).toBe(false);
    });
    it('Mutant 70: uses an AND guard before accessing the used-character size', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = null;
        font._getDescendantWidth = () => [1, [600]];
        font._descendantFont = {
            set: (_key: string, _value: any) => { /* noop */ }
        };
        expect(() => {
            font._descendantFontBeginSave();
        }).not.toThrow();
    });
    it('Mutant 71: respects the null check before accessing used characters', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthAssigned: boolean = false;
        font._usedChars = null;
        font._getDescendantWidth = () => [1, [600]];
        font._descendantFont = {
            set: (_key: string, _value: any) => {
                widthAssigned = true;
            }
        };
        expect(() => {
            font._descendantFontBeginSave();
        }).not.toThrow();
        expect(widthAssigned).toBe(false);
    });
    it('Mutant 75: recognizes the undefined used-character value', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthRequested: boolean = false;
        font._usedChars = undefined;
        font._getDescendantWidth = () => {
            widthRequested = true;
            return [1, [600]];
        };
        font._descendantFont = {
            set: (_key: string, _value: any) => { /* noop */ }
        };
        expect(() => {
            font._descendantFontBeginSave();
        }).not.toThrow();
        expect(widthRequested).toBe(false);
    });
    it('Mutant 76: skips descendant-width processing for an empty dictionary', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthRequested: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._getDescendantWidth = () => {
            widthRequested = true;
            return [1, [600]];
        };
        font._descendantFont = {
            set: (_key: string, _value: any) => { /* noop */ }
        };
        font._descendantFontBeginSave();
        expect(widthRequested).toBe(false);
    });
    it('Mutant 77: requires used-character size to be greater than zero', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthAssigned: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._getDescendantWidth = () => [1, [600]];
        font._descendantFont = {
            set: (_key: string, _value: any) => {
                widthAssigned = true;
            }
        };
        font._descendantFontBeginSave();
        expect(font._usedChars._size()).toBe(0);
        expect(widthAssigned).toBe(false);
    });
    it('Mutant 78: processes a dictionary whose size is greater than zero', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthAssigned: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._getDescendantWidth = () => [1, [600]];
        font._descendantFont = {
            set: (_key: string, _value: any) => {
                widthAssigned = true;
            }
        };
        font._descendantFontBeginSave();
        expect(widthAssigned).toBe(true);
    });
    it('Mutant 80: does not set W when the calculated width is null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthAssigned: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._getDescendantWidth = (): Array<any> | null => null;
        font._descendantFont = {
            set: (_key: string, _value: any) => {
                widthAssigned = true;
            }
        };
        font._descendantFontBeginSave();
        expect(widthAssigned).toBe(false);
    });
    it('Mutant 79: executes the non-empty used-character block exactly once', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthRequestCount: number = 0;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._getDescendantWidth = () => {
            widthRequestCount++;
            return [1, [600]];
        };
        font._descendantFont = {
            set: (_key: string, _value: any) => { /* noop */ }
        };
        font._descendantFontBeginSave();
        expect(widthRequestCount).toBe(1);
    });
    it('Mutant 81: sets W when the calculated width is not null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let assignedWidth: any = null;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._getDescendantWidth = () => [2, [500]];
        font._descendantFont = {
            set: (_key: string, value: any) => {
                assignedWidth = value;
            }
        };
        font._descendantFontBeginSave();
        expect(assignedWidth).toEqual([2, [500]]);
    });
    it('Mutant 83: executes the W assignment block', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const expectedWidth: any[] = [3, [450, 550]];
        let assignedWidth: any = null;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._getDescendantWidth = () => expectedWidth;
        font._descendantFont = {
            set: (_key: string, value: any) => {
                assignedWidth = value;
            }
        };
        font._descendantFontBeginSave();
        expect(assignedWidth).toBe(expectedWidth);
    });
    it('Mutant 82: distinguishes a non-null width from null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let widthAssigned: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._getDescendantWidth = (): Array<any> => [];
        font._descendantFont = {
            set: (_key: string, _value: any) => {
                widthAssigned = true;
            }
        };
        font._descendantFontBeginSave();
        expect(widthAssigned).toBe(true);
    });
    it('Mutant 84: writes descendant widths under the W dictionary key', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let assignedKey: any = null;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._getDescendantWidth = () => [4, [700]];
        font._descendantFont = {
            set: (key: string, _value: any) => {
                assignedKey = key;
            }
        };
        font._descendantFontBeginSave();
        expect(assignedKey).toBe('W');
    });
    it('Mutant 85: executes font-dictionary save processing', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let updatedKey: any = null;
        let updatedValue: any = null;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmap = { data: 'cmap' };
        font._fontDictionary = {
            has: (_key: string) => false,
            update: (key: string, value: any) => {
                updatedKey = key;
                updatedValue = value;
            }
        };
        font._fontDictionaryBeginSave();
        expect(updatedKey).toBe('ToUnicode');
        expect(updatedValue).toBe(font._cmap);
    });
    it('Mutant 86: skips ToUnicode processing when used characters are empty', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let dictionaryUpdated: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._cmap = { data: 'cmap' };
        font._fontDictionary = {
            has: (_key: string) => false,
            update: (_key: string, _value: any) => {
                dictionaryUpdated = true;
            }
        };
        font._fontDictionaryBeginSave();
        expect(dictionaryUpdated).toBe(false);
    });
    it('Mutant 87: adds ToUnicode when used characters are non-empty', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let dictionaryUpdated: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmap = { data: 'cmap' };
        font._fontDictionary = {
            has: (_key: string) => false,
            update: (_key: string, _value: any) => {
                dictionaryUpdated = true;
            }
        };
        font._fontDictionaryBeginSave();
        expect(dictionaryUpdated).toBe(true);
    });
    it('Mutant 92: processes non-null used characters instead of the null path', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let updatedKey: any = null;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmap = { data: 'cmap' };
        font._fontDictionary = {
            has: (_key: string) => false,
            update: (key: string, _value: any) => {
                updatedKey = key;
            }
        };
        font._fontDictionaryBeginSave();
        expect(updatedKey).toBe('ToUnicode');
    });
});
describe('_UnicodeTrueTypeFont survived mutants batch 2', () => {
    it('does not add ToUnicode when used characters are null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let updated: boolean = false;
        font._usedChars = null;
        font._cmap = { data: 'cmap' };
        font._fontDictionary = {
            has: (_key: string): boolean => false,
            update: (_key: string, _value: any): void => {
                updated = true;
            }
        };
        font._fontDictionaryBeginSave();
        expect(updated).toBe(false);
    });
    it('does not add ToUnicode when used characters are undefined', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let updated: boolean = false;
        font._usedChars = undefined;
        font._cmap = { data: 'cmap' };
        font._fontDictionary = {
            has: (_key: string): boolean => false,
            update: (_key: string, _value: any): void => {
                updated = true;
            }
        };
        expect(() => {
            font._fontDictionaryBeginSave();
        }).not.toThrow();
        expect(updated).toBe(false);
    });
    it('does not add ToUnicode when used characters are empty', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let updated: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._cmap = { data: 'cmap' };
        font._fontDictionary = {
            has: (_key: string): boolean => false,
            update: (_key: string, _value: any): void => {
                updated = true;
            }
        };
        font._fontDictionaryBeginSave();
        expect(font._usedChars._size()).toBe(0);
        expect(updated).toBe(false);
    });
    it('adds ToUnicode when one used character is present', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let updated: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmap = { data: 'cmap' };
        font._fontDictionary = {
            has: (_key: string): boolean => false,
            update: (_key: string, _value: any): void => {
                updated = true;
            }
        };
        font._fontDictionaryBeginSave();
        expect(updated).toBe(true);
    });
    it('does not add ToUnicode when the font dictionary is null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._fontDictionary = null;
        font._cmap = { data: 'cmap' };
        expect(() => {
            font._fontDictionaryBeginSave();
        }).not.toThrow();
    });
    it('does not add ToUnicode when the font dictionary is undefined', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._fontDictionary = undefined;
        font._cmap = { data: 'cmap' };
        expect(() => {
            font._fontDictionaryBeginSave();
        }).not.toThrow();
    });
    it('does not replace an existing ToUnicode entry', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let updateCount: number = 0;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmap = { data: 'new-cmap' };
        font._fontDictionary = {
            has: (key: string): boolean => key === 'ToUnicode',
            update: (_key: string, _value: any): void => {
                updateCount++;
            }
        };
        font._fontDictionaryBeginSave();
        expect(updateCount).toBe(0);
    });
    it('checks specifically for the ToUnicode dictionary key', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let checkedKey: any = null;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmap = { data: 'cmap' };
        font._fontDictionary = {
            has: (key: string): boolean => {
                checkedKey = key;
                return true;
            },
            update: (_key: string, _value: any): void => { /* noop */ }
        };
        font._fontDictionaryBeginSave();
        expect(checkedKey).toBe('ToUnicode');
    });
    it('updates specifically the ToUnicode dictionary key', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let updatedKey: any = null;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmap = { data: 'cmap' };
        font._fontDictionary = {
            has: (_key: string): boolean => false,
            update: (key: string, _value: any): void => {
                updatedKey = key;
            }
        };
        font._fontDictionaryBeginSave();
        expect(updatedKey).toBe('ToUnicode');
    });
    it('assigns the CMap stream as the ToUnicode value', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const cmap: any = { data: 'expected-cmap' };
        let updatedValue: any = null;
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmap = cmap;
        font._fontDictionary = {
            has: (_key: string): boolean => false,
            update: (_key: string, value: any): void => {
                updatedValue = value;
            }
        };
        font._fontDictionaryBeginSave();
        expect(updatedValue).toBe(cmap);
    });
    it('copies the font-family metric during initialization', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._metrics = {};
        font._ttfReader = {
            _metrics: {
                _fontFamily: 'Unicode Family',
                _postScriptName: 'UnicodeFamily-Regular',
                _widthTable: [500, 600],
                _subScriptSizeFactor: 0.7,
                _superscriptSizeFactor: 0.6,
                _isBold: false
            }
        };
        font._initializeMetrics();
        expect(font._metrics._name).toBe('Unicode Family');
    });
    it('copies the PostScript name during metric initialization', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._metrics = {};
        font._ttfReader = {
            _metrics: {
                _fontFamily: 'Unicode Family',
                _postScriptName: 'UnicodeFamily-Regular',
                _widthTable: [500, 600],
                _subScriptSizeFactor: 0.7,
                _superscriptSizeFactor: 0.6,
                _isBold: false
            }
        };
        font._initializeMetrics();
        expect(font._metrics._postScriptName)
            .toBe('UnicodeFamily-Regular');
    });
    it('creates a standard width table during metric initialization', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._metrics = {};
        font._ttfReader = {
            _metrics: {
                _fontFamily: 'Unicode Family',
                _postScriptName: 'UnicodeFamily-Regular',
                _widthTable: [400, 500, 600],
                _subScriptSizeFactor: 0.7,
                _superscriptSizeFactor: 0.6,
                _isBold: false
            }
        };
        font._initializeMetrics();
        expect(font._metrics._widthTable).toBeDefined();
    });
    it('copies the subscript size factor during initialization', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._metrics = {};
        font._ttfReader = {
            _metrics: {
                _fontFamily: 'Unicode Family',
                _postScriptName: 'UnicodeFamily-Regular',
                _widthTable: [500],
                _subScriptSizeFactor: 0.65,
                _superscriptSizeFactor: 0.75,
                _isBold: false
            }
        };
        font._initializeMetrics();
        expect(font._metrics._subScriptSizeFactor).toBe(0.65);
    });
    it('copies the superscript size factor during initialization', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._metrics = {};
        font._ttfReader = {
            _metrics: {
                _fontFamily: 'Unicode Family',
                _postScriptName: 'UnicodeFamily-Regular',
                _widthTable: [500],
                _subScriptSizeFactor: 0.65,
                _superscriptSizeFactor: 0.75,
                _isBold: false
            }
        };
        font._initializeMetrics();
        expect(font._metrics._superscriptSizeFactor).toBe(0.75);
    });
    it('copies a true bold metric during initialization', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._metrics = {};
        font._ttfReader = {
            _metrics: {
                _fontFamily: 'Unicode Family',
                _postScriptName: 'UnicodeFamily-Bold',
                _widthTable: [500],
                _subScriptSizeFactor: 0.65,
                _superscriptSizeFactor: 0.75,
                _isBold: true
            }
        };
        font._initializeMetrics();
        expect(font._metrics._isBold).toBe(true);
    });
    it('copies a false bold metric during initialization', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._metrics = {};
        font._ttfReader = {
            _metrics: {
                _fontFamily: 'Unicode Family',
                _postScriptName: 'UnicodeFamily-Regular',
                _widthTable: [500],
                _subScriptSizeFactor: 0.65,
                _superscriptSizeFactor: 0.75,
                _isBold: false
            }
        };
        font._initializeMetrics();
        expect(font._metrics._isBold).toBe(false);
    });
    it('generates a subset name with six prefix characters', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._nameString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        font._ttfReader = {
            _metrics: {
                _postScriptName: 'UnicodeFont'
            }
        };
        const result: string = font._getFontName();
        const separatorIndex: number = result.indexOf('+');
        expect(separatorIndex).toBe(6);
    });
    it('adds the plus separator after the subset prefix', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._nameString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        font._ttfReader = {
            _metrics: {
                _postScriptName: 'UnicodeFont'
            }
        };
        const result: string = font._getFontName();
        expect(result.charAt(6)).toBe('+');
    });
    it('appends the PostScript name after the subset prefix', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._nameString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        font._ttfReader = {
            _metrics: {
                _postScriptName: 'UnicodeFont-Regular'
            }
        };
        const result: string = font._getFontName();
        expect(result.substring(7)).toBe('UnicodeFont-Regular');
    });
    it('generates a subset prefix containing only allowed uppercase letters', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._nameString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        font._ttfReader = {
            _metrics: {
                _postScriptName: 'UnicodeFont'
            }
        };
        const result: string = font._getFontName();
        const prefix: string = result.substring(0, 6);
        for (let i: number = 0; i < prefix.length; i++) {
            expect(font._nameString.indexOf(prefix.charAt(i)))
                .toBeGreaterThanOrEqual(0);
        }
    });
    it('returns a primitive string from subset-name generation', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._nameString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        font._ttfReader = {
            _metrics: {
                _postScriptName: 'UnicodeFont'
            }
        };
        const result: string = font._getFontName();
        expect(typeof result).toBe('string');
    });
    it('generates a subset name with the expected total length', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const postScriptName: string = 'UnicodeFont';
        font._nameString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        font._ttfReader = {
            _metrics: {
                _postScriptName: postScriptName
            }
        };
        const result: string = font._getFontName();
        expect(result.length).toBe(7 + postScriptName.length);
    });
    it('calculates a positive bounding-box width when x values are reversed', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _fontBox: [800, 900, 100, -200]
            }
        };
        const result: number[] = font._getBoundBox();
        expect(result[2]).toBe(700);
    });
    it('calculates a positive bounding-box height from top and bottom values', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _fontBox: [-100, 900, 800, -200]
            }
        };
        const result: number[] = font._getBoundBox();
        expect(result).toEqual([-100, -200, 900, 1100]);
    });
});
describe('_UnicodeTrueTypeFont survived mutants batch 3', () => {
    it('_createDescendantFont marks the descendant dictionary as updated', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._createFontDescriptor = (): any => ({ descriptor: true });
        font._createSystemInfo = (): any => ({ systemInfo: true });
        font._createDescendantFont();
        expect(font._descendantFont._updated).toBe(true);
    });
    it('_createDescendantFont sets the Type entry to Font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._createFontDescriptor = (): any => ({ descriptor: true });
        font._createSystemInfo = (): any => ({ systemInfo: true });
        font._createDescendantFont();
        const value: any = font._descendantFont.get('Type');
        expect(value).toBeDefined();
        expect(value.name).toBe('Font');
    });
    it('_createDescendantFont sets the Subtype entry to CIDFontType2', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._createFontDescriptor = (): any => ({ descriptor: true });
        font._createSystemInfo = (): any => ({ systemInfo: true });
        font._createDescendantFont();
        const value: any = font._descendantFont.get('Subtype');
        expect(value).toBeDefined();
        expect(value.name).toBe('CIDFontType2');
    });
    it('_createDescendantFont sets BaseFont to the subset font name', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._createFontDescriptor = (): any => ({ descriptor: true });
        font._createSystemInfo = (): any => ({ systemInfo: true });
        font._createDescendantFont();
        const value: any = font._descendantFont.get('BaseFont');
        expect(value).toBeDefined();
        expect(value.name).toBe('ABCDEF+UnicodeFont');
    });
    it('_createDescendantFont sets CIDToGIDMap to Identity', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._createFontDescriptor = (): any => ({ descriptor: true });
        font._createSystemInfo = (): any => ({ systemInfo: true });
        font._createDescendantFont();
        const value: any = font._descendantFont.get('CIDToGIDMap');
        expect(value).toBeDefined();
        expect(value.name).toBe('Identity');
    });
    it('_createDescendantFont sets the default width to 1000', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._createFontDescriptor = (): any => ({ descriptor: true });
        font._createSystemInfo = (): any => ({ systemInfo: true });
        font._createDescendantFont();
        expect(font._descendantFont.get('DW')).toBe(1000);
    });
    it('_createDescendantFont stores the generated font descriptor', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const descriptor: any = { descriptor: true };
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._createFontDescriptor = (): any => descriptor;
        font._createSystemInfo = (): any => ({ systemInfo: true });
        font._createDescendantFont();
        expect(font._fontDescriptor).toBe(descriptor);
        expect(font._descendantFont.get('FontDescriptor'))
            .toBe(descriptor);
    });
    it('_createDescendantFont stores the generated CID system information', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const systemInfo: any = { systemInfo: true };
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._createFontDescriptor = (): any => ({ descriptor: true });
        font._createSystemInfo = (): any => systemInfo;
        font._createDescendantFont();
        expect(font._descendantFont.get('CIDSystemInfo'))
            .toBe(systemInfo);
    });
    it('_createDescendantFont marks the descendant dictionary as a font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._createFontDescriptor = (): any => ({ descriptor: true });
        font._createSystemInfo = (): any => ({ systemInfo: true });
        font._createDescendantFont();
        expect(font._descendantFont._isFont).toBe(true);
    });
    it('_createFontDescriptor sets the descriptor Type to FontDescriptor', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._getDescriptorFlags = (): number =>
            _FontDescriptorFlag.nonSymbolic;
        font._getBoundBox = (): number[] => [-100, -200, 900, 1100];
        font._ttfReader = {
            _metrics: {
                _widthTable: { 32: 500 },
                _stemV: 80,
                _italicAngle: 0,
                _capHeight: 700,
                _winAscent: 900,
                _winDescent: -200,
                _leading: 20
            }
        };
        const descriptor: any = font._createFontDescriptor();
        const type: any = descriptor.get('Type');
        expect(type).toBeDefined();
        expect(type.name).toBe('FontDescriptor');
    });
    it('_createFontDescriptor sets FontName to the subset font name', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._getDescriptorFlags = (): number =>
            _FontDescriptorFlag.nonSymbolic;
        font._getBoundBox = (): number[] => [-100, -200, 900, 1100];
        font._ttfReader = {
            _metrics: {
                _widthTable: { 32: 500 },
                _stemV: 80,
                _italicAngle: 0,
                _capHeight: 700,
                _winAscent: 900,
                _winDescent: -200,
                _leading: 20
            }
        };
        const descriptor: any = font._createFontDescriptor();
        const fontName: any = descriptor.get('FontName');
        expect(fontName).toBeDefined();
        expect(fontName.name).toBe('ABCDEF+UnicodeFont');
    });
    it('_createFontDescriptor sets the calculated descriptor flags', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const expectedFlags: number =
            _FontDescriptorFlag.nonSymbolic |
            _FontDescriptorFlag.forceBold;
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._getDescriptorFlags = (): number => expectedFlags;
        font._getBoundBox = (): number[] => [-100, -200, 900, 1100];
        font._ttfReader = {
            _metrics: {
                _widthTable: { 32: 500 },
                _stemV: 80,
                _italicAngle: 0,
                _capHeight: 700,
                _winAscent: 900,
                _winDescent: -200,
                _leading: 20
            }
        };
        const descriptor: any = font._createFontDescriptor();
        expect(descriptor.get('Flags')).toBe(expectedFlags);
    });
    it('_createFontDescriptor sets the calculated font bounding box', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const expectedBox: number[] = [-100, -200, 900, 1100];
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._getDescriptorFlags = (): number =>
            _FontDescriptorFlag.nonSymbolic;
        font._getBoundBox = (): number[] => expectedBox;
        font._ttfReader = {
            _metrics: {
                _widthTable: { 32: 500 },
                _stemV: 80,
                _italicAngle: 0,
                _capHeight: 700,
                _winAscent: 900,
                _winDescent: -200,
                _leading: 20
            }
        };
        const descriptor: any = font._createFontDescriptor();
        expect(descriptor.get('FontBBox')).toBe(expectedBox);
    });
    it('_createFontDescriptor sets MissingWidth from character code 32', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._getDescriptorFlags = (): number =>
            _FontDescriptorFlag.nonSymbolic;
        font._getBoundBox = (): number[] => [-100, -200, 900, 1100];
        font._ttfReader = {
            _metrics: {
                _widthTable: { 32: 575 },
                _stemV: 80,
                _italicAngle: 0,
                _capHeight: 700,
                _winAscent: 900,
                _winDescent: -200,
                _leading: 20
            }
        };
        const descriptor: any = font._createFontDescriptor();
        expect(descriptor.get('MissingWidth')).toBe(575);
    });
    it('_createFontDescriptor sets StemV from TrueType metrics', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._getDescriptorFlags = (): number =>
            _FontDescriptorFlag.nonSymbolic;
        font._getBoundBox = (): number[] => [-100, -200, 900, 1100];
        font._ttfReader = {
            _metrics: {
                _widthTable: { 32: 500 },
                _stemV: 95,
                _italicAngle: 0,
                _capHeight: 700,
                _winAscent: 900,
                _winDescent: -200,
                _leading: 20
            }
        };
        const descriptor: any = font._createFontDescriptor();
        expect(descriptor.get('StemV')).toBe(95);
    });
    it('_createFontDescriptor sets ItalicAngle from TrueType metrics', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._getDescriptorFlags = (): number =>
            _FontDescriptorFlag.italic;
        font._getBoundBox = (): number[] =>
            [-100, -200, 900, 1100];
        font._ttfReader = {
            _metrics: {
                _widthTable: {
                    32: 500
                },
                _stemV: 80,
                _italicAngle: -12,
                _capHeight: 700,
                _winAscent: 900,
                _winDescent: -200,
                _leading: 20
            }
        };
        const descriptor: any = font._createFontDescriptor();
        expect(descriptor.get('ItalicAngle')).toBe(-12);
    });
});
describe('_UnicodeTrueTypeFont survived mutants batch 4', () => {
    it('_generateFontProgram initializes _usedChars when it is null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = null;
        font._ttfMetrics = {
            _contains: false
        };
        font._ttfReader = {
            _isOpenType: false,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readFontProgram: (
                _usedChars: Dictionary<string, string>
            ): number[] => [10, 20]
        };
        font._fontProgram = {
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(font._usedChars).toBeDefined();
        expect(font._usedChars instanceof Dictionary).toBe(true);
    });
    it('_generateFontProgram preserves an existing used-character dictionary', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const usedChars: Dictionary<string, string> =
            new Dictionary<string, string>();
        usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars = usedChars;
        font._ttfMetrics = {
            _contains: false
        };
        font._ttfReader = {
            _isOpenType: false,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readFontProgram: (
                _characters: Dictionary<string, string>
            ): number[] => [10, 20]
        };
        font._fontProgram = {
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(font._usedChars).toBe(usedChars);
        expect(font._usedChars.getValue('A'))
            .toBe(String.fromCharCode(0));
    });
    it('_generateFontProgram initializes _usedChars when it is undefined', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = undefined;
        font._ttfMetrics = {
            _contains: false
        };
        font._ttfReader = {
            _isOpenType: false,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readFontProgram: (
                _usedChars: Dictionary<string, string>
            ): number[] => [30, 40]
        };
        font._fontProgram = {
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(font._usedChars).toBeDefined();
        expect(font._usedChars._size()).toBe(0);
    });
    it('_generateFontProgram resets the TrueType reader offset to zero', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let assignedOffset: number = -1;
        font._usedChars = new Dictionary<string, string>();
        font._ttfMetrics = {
            _contains: false
        };
        font._ttfReader = {
            _isOpenType: false,
            _setOffset: (offset: number): void => {
                assignedOffset = offset;
            },
            _readFontProgram: (
                _usedChars: Dictionary<string, string>
            ): number[] => [10]
        };
        font._fontProgram = {
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(assignedOffset).toBe(0);
    });
    it('_generateFontProgram reads compact font data for a qualifying OpenType font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let compactTableRead: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._ttfMetrics = {
            _contains: true
        };
        font._ttfReader = {
            _isOpenType: true,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readCompactFontFormatTable: (): number[] => {
                compactTableRead = true;
                return [11, 22, 33];
            },
            _readFontProgram: (
                _usedChars: Dictionary<string, string>
            ): number[] => [44, 55]
        };
        font._fontProgram = {
            dictionary: {
                update: (_key: string, _value: any): void => { /* noop */ }
            },
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(compactTableRead).toBe(true);
    });
    it('_generateFontProgram does not read the standard program for a qualifying OpenType font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let standardProgramRead: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._ttfMetrics = {
            _contains: true
        };
        font._ttfReader = {
            _isOpenType: true,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readCompactFontFormatTable: (): number[] => [11, 22, 33],
            _readFontProgram: (
                _usedChars: Dictionary<string, string>
            ): number[] => {
                standardProgramRead = true;
                return [44, 55];
            }
        };
        font._fontProgram = {
            dictionary: {
                update: (_key: string, _value: any): void => { /* noop */ }
            },
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(standardProgramRead).toBe(false);
    });
    it('_generateFontProgram assigns CIDFontType0C for compact font data', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let updatedKey: any = null;
        let updatedValue: any = null;
        font._usedChars = new Dictionary<string, string>();
        font._ttfMetrics = {
            _contains: true
        };
        font._ttfReader = {
            _isOpenType: true,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readCompactFontFormatTable: (): number[] => [11, 22, 33]
        };
        font._fontProgram = {
            dictionary: {
                update: (key: string, value: any): void => {
                    updatedKey = key;
                    updatedValue = value;
                }
            },
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(updatedKey).toBe('Subtype');
        expect(updatedValue).toBeDefined();
        expect(updatedValue.name).toBe('CIDFontType0C');
    });
    it('_generateFontProgram reads the standard program for a non-OpenType font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let standardProgramRead: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._ttfMetrics = {
            _contains: false
        };
        font._ttfReader = {
            _isOpenType: false,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readFontProgram: (
                _usedChars: Dictionary<string, string>
            ): number[] => {
                standardProgramRead = true;
                return [50, 60, 70];
            }
        };
        font._fontProgram = {
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(standardProgramRead).toBe(true);
    });
    it('_generateFontProgram reads the standard program when compact data is absent', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let standardProgramRead: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._ttfMetrics = {
            _contains: false
        };
        font._ttfReader = {
            _isOpenType: true,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readFontProgram: (
                _usedChars: Dictionary<string, string>
            ): number[] => {
                standardProgramRead = true;
                return [80, 90];
            }
        };
        font._fontProgram = {
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(standardProgramRead).toBe(true);
    });
    it('_generateFontProgram passes _usedChars to the standard font reader', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const usedChars: Dictionary<string, string> =
            new Dictionary<string, string>();
        let receivedCharacters: Dictionary<string, string> = null as any;
        usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars = usedChars;
        font._ttfMetrics = {
            _contains: false
        };
        font._ttfReader = {
            _isOpenType: false,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readFontProgram: (
                characters: Dictionary<string, string>
            ): number[] => {
                receivedCharacters = characters;
                return [15, 25];
            }
        };
        font._fontProgram = {
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(receivedCharacters).toBe(usedChars);
    });
    it('_generateFontProgram clears the existing font-program stream', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let streamCleared: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._ttfMetrics = {
            _contains: false
        };
        font._ttfReader = {
            _isOpenType: false,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readFontProgram: (
                _usedChars: Dictionary<string, string>
            ): number[] => [100, 110]
        };
        font._fontProgram = {
            _clearStream: (): void => {
                streamCleared = true;
            },
            _writeBytes: (_bytes: number[]): void => { /* noop */ }
        };
        font._generateFontProgram();
        expect(streamCleared).toBe(true);
    });
    it('_generateFontProgram writes the standard font-program bytes', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const expectedBytes: number[] = [100, 110, 120];
        let writtenBytes: number[] = null as any;
        font._usedChars = new Dictionary<string, string>();
        font._ttfMetrics = {
            _contains: false
        };
        font._ttfReader = {
            _isOpenType: false,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readFontProgram: (
                _usedChars: Dictionary<string, string>
            ): number[] => expectedBytes
        };
        font._fontProgram = {
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (bytes: number[]): void => {
                writtenBytes = bytes;
            }
        };
        font._generateFontProgram();
        expect(writtenBytes).toBe(expectedBytes);
    });
    it('_generateFontProgram writes the compact font-program bytes', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const expectedBytes: number[] = [5, 10, 15, 20];
        let writtenBytes: number[] = null as any;
        font._usedChars = new Dictionary<string, string>();
        font._ttfMetrics = {
            _contains: true
        };
        font._ttfReader = {
            _isOpenType: true,
            _setOffset: (_offset: number): void => { /* noop */ },
            _readCompactFontFormatTable: (): number[] => expectedBytes
        };
        font._fontProgram = {
            dictionary: {
                update: (_key: string, _value: any): void => { /* noop */ }
            },
            _clearStream: (): void => { /* noop */ },
            _writeBytes: (bytes: number[]): void => {
                writtenBytes = bytes;
            }
        };
        font._generateFontProgram();
        expect(writtenBytes).toBe(expectedBytes);
    });
    it('_getBoundBox preserves the original minimum x coordinate', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _fontBox: [-125, 900, 775, -200]
            }
        };
        const result: number[] = font._getBoundBox();
        expect(result[0]).toBe(-125);
    });
    it('_getBoundBox uses the original minimum y coordinate', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _fontBox: [-125, 900, 775, -200]
            }
        };
        const result: number[] = font._getBoundBox();
        expect(result[1]).toBe(-200);
    });
    it('_getBoundBox calculates width from xMax minus xMin', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _fontBox: [-125, 900, 775, -200]
            }
        };
        const result: number[] = font._getBoundBox();
        expect(result[2]).toBe(900);
    });
    it('_getBoundBox calculates height from yMax minus yMin', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _fontBox: [-125, 900, 775, -200]
            }
        };
        const result: number[] = font._getBoundBox();
        expect(result[3]).toBe(1100);
    });
    it('_getBoundBox returns positive dimensions for reversed coordinates', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _fontBox: [800, -250, -100, 950]
            }
        };
        const result: number[] = font._getBoundBox();
        expect(result[2]).toBe(900);
        expect(result[3]).toBe(1200);
    });
    it('_cmapBeginSave invokes CMap generation', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let cmapGenerated: boolean = false;
        font._generateCmap = (): void => {
            cmapGenerated = true;
        };
        font._cmapBeginSave();
        expect(cmapGenerated).toBe(true);
    });
    it('_fontProgramBeginSave invokes font-program generation', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let programGenerated: boolean = false;
        font._generateFontProgram = (): void => {
            programGenerated = true;
        };
        font._fontProgramBeginSave();
        expect(programGenerated).toBe(true);
    });
    it('_toHexString returns lowercase hexadecimal when case conversion is false', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const result: string = font._toHexString(255, false);
        expect(result).toBe('<00ff>');
    });
    it('_toHexString returns uppercase hexadecimal when case conversion is true', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const result: string = font._toHexString(255, true);
        expect(result).toBe('<00FF>');
    });
    it('_toHexString pads a single hexadecimal digit to four positions', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const result: string = font._toHexString(10, true);
        expect(result).toBe('<000A>');
    });
    it('_toHexString preserves a four-digit hexadecimal value', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const result: string = font._toHexString(43981, true);
        expect(result).toBe('<ABCD>');
    });
    it('_toHexString formats zero using four hexadecimal digits', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const result: string = font._toHexString(0, false);
        expect(result).toBe('<0000>');
    });
});
describe('_UnicodeTrueTypeFont survived mutants batch 5', () => {
    it('_generateCmap does not request glyph characters when _usedChars is null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let glyphCharactersRequested: boolean = false;
        let streamWritten: boolean = false;
        font._usedChars = null;
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => {
                glyphCharactersRequested = true;
                return new Dictionary<number, number>();
            }
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (_value: string): void => {
                streamWritten = true;
            }
        };
        expect(() => {
            font._generateCmap();
        }).not.toThrow();
        expect(glyphCharactersRequested).toBe(false);
        expect(streamWritten).toBe(false);
    });
    it('_generateCmap does not request glyph characters when _usedChars is undefined', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let glyphCharactersRequested: boolean = false;
        font._usedChars = undefined;
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => {
                glyphCharactersRequested = true;
                return new Dictionary<number, number>();
            }
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (_value: string): void => { /* noop */ }
        };
        expect(() => {
            font._generateCmap();
        }).not.toThrow();
        expect(glyphCharactersRequested).toBe(false);
    });
    it('_generateCmap skips glyph generation for an empty used-character dictionary', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let glyphCharactersRequested: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => {
                glyphCharactersRequested = true;
                return new Dictionary<number, number>();
            }
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (_value: string): void => { /* noop */ }
        };
        font._generateCmap();
        expect(font._usedChars._size()).toBe(0);
        expect(glyphCharactersRequested).toBe(false);
    });
    it('_generateCmap requests glyph characters for non-empty used characters', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let receivedCharacters: Dictionary<string, string> = null as any;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyphChars: (
                usedCharacters: Dictionary<string, string>
            ): Dictionary<number, number> => {
                receivedCharacters = usedCharacters;
                return glyphCharacters;
            }
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (_value: string): void => { /* noop */ }
        };
        font._generateCmap();
        expect(receivedCharacters).toBe(font._usedChars);
    });
    it('_generateCmap does not clear or write the stream when glyph characters are empty', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let streamCleared: boolean = false;
        let streamWritten: boolean = false;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => {
                streamCleared = true;
            },
            _write: (_value: string): void => {
                streamWritten = true;
            }
        };
        font._generateCmap();
        expect(streamCleared).toBe(false);
        expect(streamWritten).toBe(false);
    });
    it('_generateCmap clears the existing stream before writing generated content', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const operations: string[] = [];
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        glyphCharacters.setValue(65, 97);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = 'prefix\n';
        font._cmapEndCodeSpaceRange = 'endCodeSpacerange\r\n';
        font._cmapBeginRange = 'beginbfrange\r\n';
        font._cmapEndRange = 'endbfrange\r\n';
        font._cmapSuffix = 'endbfrange\nendcmap\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => {
                operations.push('clear');
            },
            _write: (_value: string): void => {
                operations.push('write');
            }
        };
        font._generateCmap();
        expect(operations).toEqual(['clear', 'write']);
    });
    it('_generateCmap writes generated content to the CMap stream', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        glyphCharacters.setValue(65, 97);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = 'prefix\n';
        font._cmapEndCodeSpaceRange = 'endCodeSpacerange\r\n';
        font._cmapBeginRange = 'beginbfrange\r\n';
        font._cmapEndRange = 'endbfrange\r\n';
        font._cmapSuffix = 'endbfrange\nendcmap\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(capturedContent).toBeTruthy();
    });
    it('_generateCmap begins the generated content with the configured prefix', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        glyphCharacters.setValue(65, 97);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = 'expected-prefix\n';
        font._cmapEndCodeSpaceRange = 'endCodeSpacerange\r\n';
        font._cmapBeginRange = 'beginbfrange\r\n';
        font._cmapEndRange = 'endbfrange\r\n';
        font._cmapSuffix = 'endbfrange\nendcmap\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(capturedContent.indexOf('expected-prefix\n')).toBe(0);
    });
    it('_generateCmap appends the configured suffix', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const suffix: string = 'expected-suffix\r\n';
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        glyphCharacters.setValue(65, 97);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = 'prefix\n';
        font._cmapEndCodeSpaceRange = 'endCodeSpacerange\r\n';
        font._cmapBeginRange = 'beginbfrange\r\n';
        font._cmapEndRange = 'endbfrange\r\n';
        font._cmapSuffix = suffix;
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(
            capturedContent.substring(
                capturedContent.length - suffix.length
            )
        ).toBe(suffix);
    });
    it('_generateCmap uses the first and last sorted glyph keys for the code-space range', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        glyphCharacters.setValue(90, 122);
        glyphCharacters.setValue(65, 97);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = 'prefix\n';
        font._cmapEndCodeSpaceRange = 'endCodeSpacerange\r\n';
        font._cmapBeginRange = 'beginbfrange\r\n';
        font._cmapEndRange = 'endbfrange\r\n';
        font._cmapSuffix = 'suffix\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => {
                capturedContent = null as any;
            },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(capturedContent).not.toBeNull();
        expect(
            (capturedContent as string).indexOf('<0041><005a>')
        ).toBeGreaterThanOrEqual(0);
    });
    it('_generateCmap writes the configured endCodeSpacerange marker', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const marker: string = 'expected-end-code-space\r\n';
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        glyphCharacters.setValue(65, 97);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = 'prefix\n';
        font._cmapEndCodeSpaceRange = marker;
        font._cmapBeginRange = 'beginbfrange\r\n';
        font._cmapEndRange = 'endbfrange\r\n';
        font._cmapSuffix = 'suffix\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(capturedContent.indexOf(marker))
            .toBeGreaterThanOrEqual(0);
    });
    it('_generateCmap writes one range count for a single glyph', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        glyphCharacters.setValue(65, 97);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = '';
        font._cmapEndCodeSpaceRange = '';
        font._cmapBeginRange = 'beginbfrange\n';
        font._cmapEndRange = 'endbfrange\n';
        font._cmapSuffix = 'suffix\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(capturedContent.indexOf('1 beginbfrange\n'))
            .toBeGreaterThanOrEqual(0);
    });
    it('_generateCmap limits the first range block to 100 glyph mappings', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        for (let i: number = 1; i <= 101; i++) {
            glyphCharacters.setValue(i, i + 1000);
        }
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = '';
        font._cmapEndCodeSpaceRange = '';
        font._cmapBeginRange = 'beginbfrange\n';
        font._cmapEndRange = 'endbfrange\n';
        font._cmapSuffix = 'suffix\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(capturedContent.indexOf('100 beginbfrange\n'))
            .toBeGreaterThanOrEqual(0);
    });
    it('_generateCmap starts a second range block after 100 glyph mappings', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        for (let i: number = 1; i <= 101; i++) {
            glyphCharacters.setValue(i, i + 1000);
        }
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = '';
        font._cmapEndCodeSpaceRange = '';
        font._cmapBeginRange = 'beginbfrange\n';
        font._cmapEndRange = 'endbfrange\n';
        font._cmapSuffix = 'suffix\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(
            capturedContent.indexOf(
                'endbfrange\n1 beginbfrange\n'
            )
        ).toBeGreaterThanOrEqual(0);
    });
    it('_generateCmap writes the glyph source and destination hexadecimal values', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        glyphCharacters.setValue(65, 97);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = '';
        font._cmapEndCodeSpaceRange = '';
        font._cmapBeginRange = 'beginbfrange\n';
        font._cmapEndRange = 'endbfrange\n';
        font._cmapSuffix = 'suffix\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => { /* noop */ },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(capturedContent.indexOf('<0041><0041><0061>\n'))
            .toBeGreaterThanOrEqual(0);
    });
    it('_createFontDictionary marks the font dictionary as updated', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._fontDictionary = {
            _updated: false,
            _isFont: false,
            _currentObj: null,
            set: (_key: string, _value: any): void => {
                /* noop */
            }
        };
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._descendantFont = {
            value: 'descendant-font'
        };
        font._createFontDictionary();
        expect(font._fontDictionary._updated).toBe(true);
    });
    it('_createFontDictionary sets the Type entry to Font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const values: Dictionary<string, any> =
            new Dictionary<string, any>();
        font._fontDictionary = {
            _updated: false,
            _isFont: false,
            _currentObj: null,
            set: (key: string, value: any): void => {
                values.setValue(key, value);
            }
        };
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._descendantFont = { value: 'descendant-font' };
        font._createFontDictionary();
        expect(values.getValue('Type').name).toBe('Font');
    });
    it('_createFontDictionary sets the Subtype entry to Type0', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const values: Dictionary<string, any> =
            new Dictionary<string, any>();
        font._fontDictionary = {
            _updated: false,
            _isFont: false,
            _currentObj: null,
            set: (key: string, value: any): void => {
                values.setValue(key, value);
            }
        };
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._descendantFont = { value: 'descendant-font' };
        font._createFontDictionary();
        expect(values.getValue('Subtype').name).toBe('Type0');
    });
    it('_createFontDictionary sets BaseFont to the subset font name', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const values: Dictionary<string, any> =
            new Dictionary<string, any>();
        font._fontDictionary = {
            _updated: false,
            _isFont: false,
            _currentObj: null,
            set: (key: string, value: any): void => {
                values.setValue(key, value);
            }
        };
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._descendantFont = { value: 'descendant-font' };
        font._createFontDictionary();
        expect(values.getValue('BaseFont').name)
            .toBe('ABCDEF+UnicodeFont');
    });
    it('_createFontDictionary sets Encoding to Identity-H', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const values: Dictionary<string, any> =
            new Dictionary<string, any>();
        font._fontDictionary = {
            _updated: false,
            _isFont: false,
            _currentObj: null,
            set: (key: string, value: any): void => {
                values.setValue(key, value);
            }
        };
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._descendantFont = { value: 'descendant-font' };
        font._createFontDictionary();
        expect(values.getValue('Encoding').name).toBe('Identity-H');
    });
    it('_createFontDictionary stores the descendant font dictionary', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const values: Dictionary<string, any> =
            new Dictionary<string, any>();
        const descendantFont: any = { value: 'descendant-font' };
        font._fontDictionary = {
            _updated: false,
            _isFont: false,
            _currentObj: null,
            set: (key: string, value: any): void => {
                values.setValue(key, value);
            }
        };
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._descendantFont = descendantFont;
        font._createFontDictionary();
        expect(values.getValue('DescendantFonts'))
            .toBe(descendantFont);
    });
    it('_createFontDictionary marks the dictionary as a font and stores the current object', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._fontDictionary = {
            _updated: false,
            _isFont: false,
            _currentObj: null,
            set: (_key: string, _value: any): void => { /* noop */ }
        };
        font._subsetName = 'ABCDEF+UnicodeFont';
        font._descendantFont = { value: 'descendant-font' };
        font._createFontDictionary();
        expect(font._fontDictionary._isFont).toBe(true);
        expect(font._fontDictionary._currentObj).toBe(font);
    });
    it('_createSystemInfo creates updated Adobe Identity system information', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const systemInfo: any = font._createSystemInfo();
        expect(systemInfo._updated).toBe(true);
        expect(systemInfo.get('Registry')).toBe('Adobe');
        expect(systemInfo.get('Ordering')).toBe('Identity');
        expect(systemInfo.get('Supplement')).toBe(0);
    });
});
describe('_UnicodeTrueTypeFont survived mutants batch 6', () => {
    it('_getDescriptorFlags returns fixedPitch for a fixed-pitch font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: true,
                _isSymbol: false,
                _isItalic: false,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags & _FontDescriptorFlag.fixedPitch)
            .toBe(_FontDescriptorFlag.fixedPitch);
    });
    it('_getDescriptorFlags does not return fixedPitch for a proportional font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: false,
                _isItalic: false,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags & _FontDescriptorFlag.fixedPitch).toBe(0);
    });
    it('_getDescriptorFlags returns symbolic for a symbolic font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: true,
                _isItalic: false,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags & _FontDescriptorFlag.symbolic)
            .toBe(_FontDescriptorFlag.symbolic);
    });
    it('_getDescriptorFlags does not return nonSymbolic for a symbolic font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: true,
                _isItalic: false,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags & _FontDescriptorFlag.nonSymbolic).toBe(0);
    });
    it('_getDescriptorFlags returns nonSymbolic for a non-symbolic font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: false,
                _isItalic: false,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags & _FontDescriptorFlag.nonSymbolic)
            .toBe(_FontDescriptorFlag.nonSymbolic);
    });
    it('_getDescriptorFlags does not return symbolic for a non-symbolic font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: false,
                _isItalic: false,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags & _FontDescriptorFlag.symbolic).toBe(0);
    });
    it('_getDescriptorFlags returns italic for an italic font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: false,
                _isItalic: true,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags & _FontDescriptorFlag.italic)
            .toBe(_FontDescriptorFlag.italic);
    });
    it('_getDescriptorFlags does not return italic for an upright font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: false,
                _isItalic: false,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags & _FontDescriptorFlag.italic).toBe(0);
    });
    it('_getDescriptorFlags returns forceBold for a bold font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: false,
                _isItalic: false,
                _isBold: true
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags & _FontDescriptorFlag.forceBold)
            .toBe(_FontDescriptorFlag.forceBold);
    });
    it('_getDescriptorFlags does not return forceBold for a regular font', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: false,
                _isItalic: false,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags & _FontDescriptorFlag.forceBold).toBe(0);
    });
    it('_getDescriptorFlags combines fixedPitch symbolic italic and forceBold', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const expectedFlags: number =
            _FontDescriptorFlag.fixedPitch |
            _FontDescriptorFlag.symbolic |
            _FontDescriptorFlag.italic |
            _FontDescriptorFlag.forceBold;
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: true,
                _isSymbol: true,
                _isItalic: true,
                _isBold: true
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags).toBe(expectedFlags);
    });
    it('_getCharacterWidth passes the requested character to the TrueType reader', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let receivedCharacter: any = null;
        font._ttfReader = {
            _getCharacterWidth: (character: string): number => {
                receivedCharacter = character;
                return 625;
            }
        };
        font._getCharacterWidth('W');
        expect(receivedCharacter).toBe('W');
    });
    it('_getCharacterWidth returns the width supplied by the TrueType reader', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _getCharacterWidth: (_character: string): number => 625
        };
        const width: number = font._getCharacterWidth('W');
        expect(width).toBe(625);
    });
    it('_setSymbols does not initialize used characters when text is null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = null;
        font._setSymbols(null);
        expect(font._usedChars).toBeNull();
    });
    it('_setSymbols does not initialize used characters when text is undefined', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = undefined;
        font._setSymbols(undefined);
        expect(font._usedChars).toBeUndefined();
    });
    it('_setSymbols initializes Dictionary when used characters are null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = null;
        font._setSymbols('A');
        expect(font._usedChars).toBeDefined();
        expect(font._usedChars instanceof Dictionary).toBe(true);
    });
    it('_setSymbols initializes Dictionary when used characters are undefined', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = undefined;
        font._setSymbols('A');
        expect(font._usedChars).toBeDefined();
        expect(font._usedChars instanceof Dictionary).toBe(true);
    });
    it('_setSymbols preserves an existing used-character dictionary', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        const usedChars: Dictionary<string, string> =
            new Dictionary<string, string>();
        usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars = usedChars;
        font._setSymbols('B');
        expect(font._usedChars).toBe(usedChars);
        expect(font._usedChars._size()).toBe(2);
    });
    it('_setSymbols adds a single character to the used-character dictionary', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._setSymbols('A');
        expect(font._usedChars._size()).toBe(1);
        expect(font._usedChars.containsKey('A')).toBe(true);
    });
    it('_setSymbols stores the null character as the dictionary value', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._setSymbols('A');
        expect(font._usedChars.getValue('A'))
            .toBe(String.fromCharCode(0));
    });
    it('_setSymbols adds every distinct character from the supplied text', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._setSymbols('ABC');
        expect(font._usedChars._size()).toBe(3);
        expect(font._usedChars.containsKey('A')).toBe(true);
        expect(font._usedChars.containsKey('B')).toBe(true);
        expect(font._usedChars.containsKey('C')).toBe(true);
    });
    it('_setSymbols adds every repeated character supplied in the text', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._setSymbols('AAA');
        expect(font._usedChars._size()).toBe(3);
        expect(font._usedChars.containsKey('A')).toBe(true);
        expect(font._usedChars.getValue('A'))
            .toBe(String.fromCharCode(0));
    });
    it('_getDescendantWidth returns an empty array when used characters are null', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = null;
        font._ttfReader = {
            _getGlyph: (_character: string): any => ({
                _index: 1,
                _width: 500
            })
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result).toEqual([]);
    });
    it('_getDescendantWidth returns an empty array when used characters are undefined', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = undefined;
        font._ttfReader = {
            _getGlyph: (_character: string): any => ({
                _index: 1,
                _width: 500
            })
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result).toEqual([]);
    });
    it('_getDescendantWidth does not request glyphs for an empty dictionary', () => {
        const font: any = Object.create(_UnicodeTrueTypeFont.prototype);
        let glyphRequested: boolean = false;
        font._usedChars = new Dictionary<string, string>();
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                glyphRequested = true;
                return {
                    _index: 1,
                    _width: 500
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(glyphRequested).toBe(false);
        expect(result).toEqual([]);
    });
});
describe('_UnicodeTrueTypeFont survived mutants batch 7', () => {
    it('_getDescendantWidth requests the glyph for each used character', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        const requestedCharacters: string[] = [];
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                requestedCharacters.push(character);
                return {
                    _index: character === 'A' ? 1 : 2,
                    _width: 500
                };
            }
        };
        font._getDescendantWidth();
        expect(requestedCharacters.length).toBe(2);
        expect(requestedCharacters[0]).toBe('A');
        expect(requestedCharacters[1]).toBe('B');
    });
    it('_getDescendantWidth returns the starting glyph index for one glyph', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: 5,
                    _width: 500
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[0]).toBe(5);
    });
    it('_getDescendantWidth returns the width array for one glyph', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: 5,
                    _width: 500
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[1]).toEqual([500]);
    });
    it('_getDescendantWidth returns two elements for one glyph', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: 10,
                    _width: 650
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result.length).toBe(2);
        expect(result).toEqual([10, [650]]);
    });
    it('_getDescendantWidth sorts glyphs by ascending glyph index', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 30,
                        _width: 700
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 10,
                        _width: 500
                    };
                }
                return {
                    _index: 20,
                    _width: 600
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[0]).toBe(10);
    });
    it('_getDescendantWidth preserves sorted glyph widths', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 7,
                        _width: 700
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 5,
                        _width: 500
                    };
                }
                return {
                    _index: 6,
                    _width: 600
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result).toEqual([
            5,
            [500, 600],
            7,
            [700]
        ]);
    });
    it('_getDescendantWidth converts a string glyph index to a number', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: '25',
                    _width: 500
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[0]).toBe(25);
        expect(typeof result[0]).toBe('number');
    });
    it('_getDescendantWidth converts a string glyph width to a number', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: 5,
                    _width: '525'
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[1][0]).toBe(525);
        expect(typeof result[1][0]).toBe('number');
    });
    it('_getDescendantWidth initializes the first glyph index from the first sorted glyph', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 20,
                        _width: 600
                    };
                }
                return {
                    _index: 10,
                    _width: 500
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[0]).toBe(10);
    });
    it('_getDescendantWidth stores two sequential glyphs as separate final groups', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 5,
                        _width: 500
                    };
                }
                return {
                    _index: 6,
                    _width: 600
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result).toEqual([
            5,
            [500],
            6,
            [600]
        ]);
    });
    it('_getDescendantWidth stores two non-sequential glyphs in separate groups', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 5,
                        _width: 500
                    };
                }
                return {
                    _index: 8,
                    _width: 800
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result).toEqual([
            5,
            [500],
            8,
            [800]
        ]);
    });
    it('_getDescendantWidth groups the first two of three sequential glyphs', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 5,
                        _width: 500
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 6,
                        _width: 600
                    };
                }
                return {
                    _index: 7,
                    _width: 700
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[0]).toBe(5);
        expect(result[1]).toEqual([500, 600]);
    });
    it('_getDescendantWidth creates a final group for the last sequential glyph', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 5,
                        _width: 500
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 6,
                        _width: 600
                    };
                }
                return {
                    _index: 7,
                    _width: 700
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[2]).toBe(7);
        expect(result[3]).toEqual([700]);
    });
    it('_getDescendantWidth returns four elements for three sequential glyphs', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 1,
                        _width: 100
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 2,
                        _width: 200
                    };
                }
                return {
                    _index: 3,
                    _width: 300
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result.length).toBe(4);
    });
    it('_getDescendantWidth splits a group when a glyph index gap occurs', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 5,
                        _width: 500
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 7,
                        _width: 700
                    };
                }
                return {
                    _index: 8,
                    _width: 800
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[0]).toBe(5);
        expect(result[1]).toEqual([500]);
    });
    it('_getDescendantWidth starts a new group at a non-sequential glyph index', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 5,
                        _width: 500
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 7,
                        _width: 700
                    };
                }
                return {
                    _index: 8,
                    _width: 800
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[2]).toBe(7);
    });
    it('_getDescendantWidth retains the width at the start of a new group', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 5,
                        _width: 500
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 7,
                        _width: 700
                    };
                }
                return {
                    _index: 8,
                    _width: 800
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[3]).toEqual([700]);
    });
    it('_getDescendantWidth creates the last group when the final glyph is reached', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 5,
                        _width: 500
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 7,
                        _width: 700
                    };
                }
                return {
                    _index: 8,
                    _width: 800
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[4]).toBe(8);
        expect(result[5]).toEqual([800]);
    });
    it('_getDescendantWidth returns six elements for three glyphs containing a gap', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 1,
                        _width: 100
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 3,
                        _width: 300
                    };
                }
                return {
                    _index: 4,
                    _width: 400
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result.length).toBe(6);
    });
    it('_getDescendantWidth handles zero as a glyph index', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: 0,
                    _width: 400
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result).toEqual([0, [400]]);
    });
    it('_getDescendantWidth retains a zero glyph width', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: 4,
                    _width: 0
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[1]).toEqual([0]);
    });
    it('_getDescendantWidth retains a fractional glyph width', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: 4,
                    _width: 512.5
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[1]).toEqual([512.5]);
    });
    it('_getDescendantWidth retains a negative glyph width', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: 4,
                    _width: -25
                };
            }
        };
        const result: Array<any> = font._getDescendantWidth();
        expect(result[1]).toEqual([-25]);
    });
    it('_getDescendantWidth returns a new result array for each invocation', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: 5,
                    _width: 500
                };
            }
        };
        const firstResult: Array<any> =
            font._getDescendantWidth();
        const secondResult: Array<any> =
            font._getDescendantWidth();
        expect(firstResult).not.toBe(secondResult);
        expect(firstResult).toEqual(secondResult);
    });
    it('_getDescendantWidth returns independent nested width arrays', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (_character: string): any => {
                return {
                    _index: 5,
                    _width: 500
                };
            }
        };
        const firstResult: Array<any> =
            font._getDescendantWidth();
        const secondResult: Array<any> =
            font._getDescendantWidth();
        expect(firstResult[1]).not.toBe(secondResult[1]);
        expect(firstResult[1]).toEqual([500]);
        expect(secondResult[1]).toEqual([500]);
    });
});
describe('_UnicodeTrueTypeFont survived mutants final batch', () => {
    it('_getInternals returns the current font dictionary', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        const expectedDictionary: any = {
            identifier: 'font-dictionary'
        };
        font._fontDictionary = expectedDictionary;
        const result: any = font._getInternals();
        expect(result).toBe(expectedDictionary);
    });
    it('_getDescriptorFlags starts with zero before applying metric flags', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: false,
                _isItalic: false,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        expect(flags).toBe(_FontDescriptorFlag.nonSymbolic);
    });
    it('_getDescriptorFlags combines fixedPitch with nonSymbolic', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: true,
                _isSymbol: false,
                _isItalic: false,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        const expected: number =
            _FontDescriptorFlag.fixedPitch |
            _FontDescriptorFlag.nonSymbolic;
        expect(flags).toBe(expected);
    });
    it('_getDescriptorFlags combines italic with nonSymbolic', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: false,
                _isItalic: true,
                _isBold: false
            }
        };
        const flags: number = font._getDescriptorFlags();
        const expected: number =
            _FontDescriptorFlag.nonSymbolic |
            _FontDescriptorFlag.italic;
        expect(flags).toBe(expected);
    });
    it('_getDescriptorFlags combines forceBold with nonSymbolic', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._ttfReader = {
            _metrics: {
                _isFixedPitch: false,
                _isSymbol: false,
                _isItalic: false,
                _isBold: true
            }
        };
        const flags: number = font._getDescriptorFlags();
        const expected: number =
            _FontDescriptorFlag.nonSymbolic |
            _FontDescriptorFlag.forceBold;
        expect(flags).toBe(expected);
    });
    it('_setSymbols leaves the used-character dictionary empty for empty text', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._setSymbols('');
        expect(font._usedChars._size()).toBe(0);
    });
    it('_setSymbols stores whitespace as a used character', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._setSymbols(' ');
        expect(font._usedChars._size()).toBe(1);
        expect(font._usedChars.containsKey(' ')).toBe(true);
        expect(font._usedChars.getValue(' '))
            .toBe(String.fromCharCode(0));
    });
    it('_setSymbols stores Unicode characters without changing the key', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._setSymbols('\u03A9');
        expect(font._usedChars._size()).toBe(1);
        expect(font._usedChars.containsKey('\u03A9')).toBe(true);
        expect(font._usedChars.getValue('\u03A9'))
            .toBe(String.fromCharCode(0));
    });
    it('_generateCmap uses the glyph code as both code-space boundaries for one glyph', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: string = '';
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        glyphCharacters.setValue(65, 97);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = 'PREFIX\n';
        font._cmapEndCodeSpaceRange = 'END-CODE-SPACE\n';
        font._cmapBeginRange = 'BEGIN-RANGE\n';
        font._cmapEndRange = 'END-RANGE\n';
        font._cmapSuffix = 'SUFFIX\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => {
                capturedContent = '';
            },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(capturedContent).toBeTruthy();
        expect(capturedContent.indexOf('<0041><0041>\r\n'))
            .toBeGreaterThanOrEqual(0);
        expect(capturedContent.indexOf('<0041><0041><0061>\n'))
            .toBeGreaterThanOrEqual(0);
    });
    it('_generateCmap writes exactly 100 as the first block count for 101 glyphs', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        for (let i: number = 1; i <= 101; i++) {
            glyphCharacters.setValue(i, i + 1000);
        }
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = '';
        font._cmapEndCodeSpaceRange = '';
        font._cmapBeginRange = 'beginbfrange\n';
        font._cmapEndRange = 'endbfrange\n';
        font._cmapSuffix = 'suffix\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => {
                capturedContent = null;
            },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(capturedContent).not.toBeNull();
        expect(
            (capturedContent as string).indexOf(
                '100 beginbfrange\n'
            )
        ).toBeGreaterThanOrEqual(0);
    });
    it('_generateCmap writes one as the second block count for 101 glyphs', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        let capturedContent: any = null;
        const glyphCharacters: Dictionary<number, number> =
            new Dictionary<number, number>();
        for (let i: number = 1; i <= 101; i++) {
            glyphCharacters.setValue(i, i + 1000);
        }
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._cmapPrefix = '';
        font._cmapEndCodeSpaceRange = '';
        font._cmapBeginRange = 'beginbfrange\n';
        font._cmapEndRange = 'endbfrange\n';
        font._cmapSuffix = 'suffix\n';
        font._ttfReader = {
            _getGlyphChars: (
                _usedChars: Dictionary<string, string>
            ): Dictionary<number, number> => glyphCharacters
        };
        font._cmap = {
            _clearStream: (): void => {
                capturedContent = null;
            },
            _write: (value: string): void => {
                capturedContent = value;
            }
        };
        font._generateCmap();
        expect(capturedContent).not.toBeNull();
        expect(
            (capturedContent as string).indexOf(
                'endbfrange\n1 beginbfrange\n'
            )
        ).toBeGreaterThanOrEqual(0);
    });
    it('_getDescendantWidth sorts non-sequential glyphs before producing groups', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 30,
                        _width: 300
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 10,
                        _width: 100
                    };
                }
                return {
                    _index: 20,
                    _width: 200
                };
            }
        };
        const result: Array<any> =
            font._getDescendantWidth();
        expect(result).toEqual([
            10,
            [100],
            20,
            [200],
            30,
            [300]
        ]);
    });
    it('_getDescendantWidth creates a separate final group at the last glyph boundary', () => {
        const font: any =
            Object.create(_UnicodeTrueTypeFont.prototype);
        font._usedChars = new Dictionary<string, string>();
        font._usedChars.setValue('A', String.fromCharCode(0));
        font._usedChars.setValue('B', String.fromCharCode(0));
        font._usedChars.setValue('C', String.fromCharCode(0));
        font._usedChars.setValue('D', String.fromCharCode(0));
        font._ttfReader = {
            _getGlyph: (character: string): any => {
                if (character === 'A') {
                    return {
                        _index: 1,
                        _width: 100
                    };
                }
                if (character === 'B') {
                    return {
                        _index: 2,
                        _width: 200
                    };
                }
                if (character === 'C') {
                    return {
                        _index: 3,
                        _width: 300
                    };
                }
                return {
                    _index: 4,
                    _width: 400
                };
            }
        };
        const result: Array<any> =
            font._getDescendantWidth();
        expect(result).toEqual([
            1,
            [100, 200, 300],
            4,
            [400]
        ]);
    });
});