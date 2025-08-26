import { _bytesToString, _defineProperty, _stringToBytes, FormatError } from '@syncfusion/ej2-pdf';
import { _expertEncoding, _standardEncoding, _getEncoding, _getGlyphsUnicode } from './encoding-utils';
import { _FontStructure } from './font-structure';
import { _recoverGlyphName } from './font-utils';
export class _PdfCompactFontParser {
    _bytes: Uint8Array;
    _properties: any; //eslint-disable-line
    _isAnalysisEnabled: boolean;
    _compactFontFormat: _PdfCompactFormatFont;
    _values: any; //eslint-disable-line
    _characterValidationData: any = [ //eslint-disable-line
        null,
        { id: 'hstem', min: 2, stackClearing: true, stem: true },
        null,
        { id: 'vstem', min: 2, stackClearing: true, stem: true },
        { id: 'vmoveto', min: 1, stackClearing: true },
        { id: 'rlineto', min: 2, resetStack: true },
        { id: 'hlineto', min: 1, resetStack: true },
        { id: 'vlineto', min: 1, resetStack: true },
        { id: 'rrcurveto', min: 6, resetStack: true },
        null,
        { id: 'callsubr', min: 1, undefStack: true },
        { id: 'return', min: 0, undefStack: true },
        null,
        null,
        { id: 'endchar', min: 0, stackClearing: true },
        null,
        null,
        null,
        { id: 'hstemhm', min: 2, stackClearing: true, stem: true },
        { id: 'hintmask', min: 0, stackClearing: true },
        { id: 'cntrmask', min: 0, stackClearing: true },
        { id: 'rmoveto', min: 2, stackClearing: true },
        { id: 'hmoveto', min: 1, stackClearing: true },
        { id: 'vstemhm', min: 2, stackClearing: true, stem: true },
        { id: 'rcurveline', min: 8, resetStack: true },
        { id: 'rlinecurve', min: 8, resetStack: true },
        { id: 'vvcurveto', min: 4, resetStack: true },
        { id: 'hhcurveto', min: 4, resetStack: true },
        null,
        { id: 'callgsubr', min: 1, undefStack: true },
        { id: 'vhcurveto', min: 4, resetStack: true },
        { id: 'hvcurveto', min: 4, resetStack: true }
    ];
    _characterValidationData12: any = [ //eslint-disable-line
        null,
        null,
        null,
        { id: 'and', min: 2, stackDelta: -1 },
        { id: 'or', min: 2, stackDelta: -1 },
        { id: 'not', min: 1, stackDelta: 0 },
        null,
        null,
        null,
        { id: 'abs', min: 1, stackDelta: 0 },
        {
            id: 'add',
            min: 2,
            stackDelta: -1,
            stackFn(stack: any, index: any) { //eslint-disable-line
                stack[index - 2] = stack[index - 2] + stack[index - 1];
            }
        },
        {
            id: 'sub',
            min: 2,
            stackDelta: -1,
            stackFn(stack: any, index: any) { //eslint-disable-line
                stack[index - 2] = stack[index - 2] - stack[index - 1];
            }
        },
        {
            id: 'div',
            min: 2,
            stackDelta: -1,
            stackFn(stack: any, index: any) { //eslint-disable-line
                stack[index - 2] = stack[index - 2] / stack[index - 1];
            }
        },
        null,
        {
            id: 'neg',
            min: 1,
            stackDelta: 0,
            stackFn(stack: any, index: any) { //eslint-disable-line
                stack[index - 1] = -stack[index - 1];
            }
        },
        { id: 'eq', min: 2, stackDelta: -1 },
        null,
        null,
        { id: 'drop', min: 1, stackDelta: -1 },
        null,
        { id: 'put', min: 2, stackDelta: -2 },
        { id: 'get', min: 1, stackDelta: 0 },
        { id: 'ifelse', min: 4, stackDelta: -3 },
        { id: 'random', min: 0, stackDelta: 1 },
        {
            id: 'mul',
            min: 2,
            stackDelta: -1,
            stackFn(stack: any, index: any) { //eslint-disable-line
                stack[index - 2] = stack[index - 2] * stack[index - 1];
            }
        },
        null,
        { id: 'sqrt', min: 1, stackDelta: 0 },
        { id: 'dup', min: 1, stackDelta: 1 },
        { id: 'exch', min: 2, stackDelta: 0 },
        { id: 'index', min: 2, stackDelta: 0 },
        { id: 'roll', min: 3, stackDelta: -2 },
        null,
        null,
        null,
        { id: 'hflex', min: 7, resetStack: true },
        { id: 'flex', min: 13, resetStack: true },
        { id: 'hflex1', min: 9, resetStack: true },
        { id: 'flex1', min: 11, resetStack: true }
    ];
    _compactCharSetPredefinedTypes: any = { //eslint-disable-line
        standard: 0,
        expert: 1,
        expertSubset: 2
    };
    _standardCharSet: string[] = [
        '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar',
        'percent', 'ampersand', 'quoteright', 'parenleft', 'parenright',
        'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero',
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
        'nine', 'colon', 'semicolon', 'less', 'equal', 'greater', 'question',
        'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
        'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
        'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent',
        'sterling', 'fraction', 'yen', 'florin', 'section', 'currency',
        'quotesingle', 'quotedblleft', 'guillemotleft', 'guilsinglleft',
        'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl',
        'periodcentered', 'paragraph', 'bullet', 'quotesinglbase',
        'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis',
        'perthousand', 'questiondown', 'grave', 'acute', 'circumflex', 'tilde',
        'macron', 'breve', 'dotaccent', 'dieresis', 'ring', 'cedilla',
        'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine',
        'Lslash', 'Oslash', 'OE', 'ordmasculine', 'ae', 'dotlessi', 'lslash',
        'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu',
        'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter',
        'divide', 'brokenbar', 'degree', 'thorn', 'threequarters', 'twosuperior',
        'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright',
        'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde',
        'Ccedilla', 'Eacute', 'Ecircumflex', 'Edieresis', 'Egrave', 'Iacute',
        'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex',
        'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex',
        'Udieresis', 'Ugrave', 'Yacute', 'Ydieresis', 'Zcaron', 'aacute',
        'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla',
        'eacute', 'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex',
        'idieresis', 'igrave', 'ntilde', 'oacute', 'ocircumflex', 'odieresis',
        'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis',
        'ugrave', 'yacute', 'ydieresis', 'zcaron'
    ];
    _expertCharSet: string[] = [
        '.notdef', 'space', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle',
        'dollarsuperior', 'ampersandsmall', 'Acutesmall', 'parenleftsuperior',
        'parenrightsuperior', 'twodotenleader', 'onedotenleader', 'comma',
        'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle',
        'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle',
        'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle',
        'colon', 'semicolon', 'commasuperior', 'threequartersemdash',
        'periodsuperior', 'questionsmall', 'asuperior', 'bsuperior',
        'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
        'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior',
        'tsuperior', 'ff', 'fi', 'fl', 'ffi', 'ffl', 'parenleftinferior',
        'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall',
        'Asmall', 'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall',
        'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall', 'Msmall', 'Nsmall',
        'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall',
        'Vsmall', 'Wsmall', 'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary',
        'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall', 'centoldstyle',
        'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall',
        'Brevesmall', 'Caronsmall', 'Dotaccentsmall', 'Macronsmall',
        'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall',
        'Cedillasmall', 'onequarter', 'onehalf', 'threequarters',
        'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths',
        'seveneighths', 'onethird', 'twothirds', 'zerosuperior', 'onesuperior',
        'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
        'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
        'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior',
        'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior',
        'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior',
        'periodinferior', 'commainferior', 'Agravesmall', 'Aacutesmall',
        'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall',
        'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall',
        'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
        'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall',
        'Ogravesmall', 'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall',
        'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall',
        'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall',
        'Ydieresissmall'
    ];
    _expertSubsetCharSet: string[] = [
        '.notdef', 'space', 'dollaroldstyle', 'dollarsuperior',
        'parenleftsuperior', 'parenrightsuperior', 'twodotenleader',
        'onedotenleader', 'comma', 'hyphen', 'period', 'fraction',
        'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle',
        'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle',
        'eightoldstyle', 'nineoldstyle', 'colon', 'semicolon', 'commasuperior',
        'threequartersemdash', 'periodsuperior', 'asuperior', 'bsuperior',
        'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
        'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior',
        'tsuperior', 'ff', 'fi', 'fl', 'ffi', 'ffl', 'parenleftinferior',
        'parenrightinferior', 'hyphensuperior', 'colonmonetary', 'onefitted',
        'rupiah', 'centoldstyle', 'figuredash', 'hypheninferior', 'onequarter',
        'onehalf', 'threequarters', 'oneeighth', 'threeeighths', 'fiveeighths',
        'seveneighths', 'onethird', 'twothirds', 'zerosuperior', 'onesuperior',
        'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
        'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
        'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior',
        'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior',
        'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior',
        'periodinferior', 'commainferior'
    ];
    _standardEncodingChars: any = []; //eslint-disable-line
    _widths: any = []; //eslint-disable-line
    _pos: number = 0;
    constructor(file: any, properties: any, isAnalysisEnabled: boolean) { //eslint-disable-line
        this._bytes = file.getBytes();
        this._properties = properties;
        this._isAnalysisEnabled = isAnalysisEnabled;
    }
    _parsePrivateDictionary(parentDictionary: any): any { //eslint-disable-line
        if (!parentDictionary._hasName('Private')) {
            this._emptyPrivateDictionary(parentDictionary);
            return;
        }
        const privateOffset: any = parentDictionary._getByName('Private'); //eslint-disable-line
        if (!Array.isArray(privateOffset) || privateOffset.length !== 2) {
            parentDictionary._removeByName('Private');
            return;
        }
        const size: number = privateOffset[0];
        const offset: number = privateOffset[1];
        if (size === 0 || offset >= this._bytes.length) {
            this._emptyPrivateDictionary(parentDictionary);
            return;
        }
        const privateDictionary: any = this._createDictionary(_PdfCompactFontPrivateDictionary, this._parseDictionary(this._bytes.subarray(offset, offset + size)), parentDictionary.strings); //eslint-disable-line
        parentDictionary.privateDictionary = privateDictionary;
        if (privateDictionary._getByName('ExpansionFactor') === 0) {
            privateDictionary._setByName('ExpansionFactor', 0.06);
        }
        if (!privateDictionary._getByName('Subrs')) {
            return;
        }
        const subrsOffset: any = privateDictionary._getByName('Subrs'); //eslint-disable-line
        const relativeOffset: any = offset + subrsOffset; //eslint-disable-line
        if (subrsOffset === 0 || relativeOffset >= this._bytes.length) {
            this._emptyPrivateDictionary(parentDictionary);
            return;
        }
        const subroutineIndex: any = this._parseIndex(relativeOffset); //eslint-disable-line
        privateDictionary.subroutineIndex = subroutineIndex.obj;
    }
    _parse(properties?: any): _PdfCompactFormatFont { //eslint-disable-line
        const compactFontFormat: _PdfCompactFormatFont = new _PdfCompactFormatFont();
        this._compactFontFormat = compactFontFormat;
        const header: any = this._parseHeader(); //eslint-disable-line
        const nameIndex: any = this._parseIndex(header.endPos); //eslint-disable-line
        const topDictIndex: any = this._parseIndex(nameIndex.endPos); //eslint-disable-line
        const stringIndex: any = this._parseIndex(topDictIndex.endPos); //eslint-disable-line
        const globalSubroutineIndex: any = this._parseIndex(stringIndex.endPos); //eslint-disable-line
        const topDictParsed: any = this._parseDictionary(topDictIndex.obj._get(0)); //eslint-disable-line
        const topDict: any = this._createDictionary(_PdfCompactFontTopDictionary, topDictParsed, compactFontFormat.strings); //eslint-disable-line
        compactFontFormat.header = header.obj;
        compactFontFormat.names = this._parseNameIndex(nameIndex.obj);
        compactFontFormat.strings = this._parseStringIndex(stringIndex.obj);
        compactFontFormat.topDictionary = topDict;
        compactFontFormat.globalSubroutineIndex = globalSubroutineIndex.obj;
        this._parsePrivateDictionary(compactFontFormat.topDictionary);
        compactFontFormat.isCharacterIdentifierFont = topDict._hasName('ROS');
        const charStringOffset: any = topDict._getByName('CharStrings'); //eslint-disable-line
        const charStringIndex: any = this._parseIndex(charStringOffset).obj; //eslint-disable-line
        const fontMatrix: any = topDict._getByName('FontMatrix'); //eslint-disable-line
        if (fontMatrix) {
            properties._fontStructure._fontMatrix = fontMatrix;
        }
        const fontBBox: any = topDict._getByName('FontBBox'); //eslint-disable-line
        if (fontBBox) {
            properties.ascent = Math.max(fontBBox[3], fontBBox[1]);
            properties.descent = Math.min(fontBBox[1], fontBBox[3]);
            properties.ascentScaled = true;
        }
        let charSet: any; //eslint-disable-line
        let encoding: any; //eslint-disable-line
        if (compactFontFormat.isCharacterIdentifierFont) {
            const fontDictionaryArrayIndex: any = this._parseIndex(topDict._getByName('FDArray')).obj; //eslint-disable-line
            for (let i: number = 0, ii: number = fontDictionaryArrayIndex.count; i < ii; ++i) {
                const dictRaw: any = fontDictionaryArrayIndex._get(i); //eslint-disable-line
                const fontDict: any = this._createDictionary( //eslint-disable-line
                    _PdfCompactFontTopDictionary,
                    this._parseDictionary(dictRaw),
                    compactFontFormat.strings
                );
                this._parsePrivateDictionary(fontDict);
                compactFontFormat.fontDictionaryArray.push(fontDict);
            }
            encoding = null;
            charSet = this._parseCharSets(
                topDict._getByName('charSet'),
                charStringIndex.count,
                compactFontFormat.strings,
                true
            );
            compactFontFormat.fontDictionarySelect = this._parseFontDictionarySelect(
                topDict._getByName('FDSelect'),
                charStringIndex.count
            );
        } else {
            charSet = this._parseCharSets(
                topDict._getByName('charSet'),
                charStringIndex.count,
                compactFontFormat.strings,
                false
            );
            encoding = this._parseEncoding(
                topDict._getByName('Encoding'),
                this._properties,
                compactFontFormat.strings,
                charSet.charSet
            );
        }
        compactFontFormat.charSet = charSet;
        compactFontFormat.encoding = encoding;
        const charStringsAndSeacs: any = this._parseCharStrings( //eslint-disable-line
            charStringIndex,
            topDict.privateDictionary.subroutineIndex,
            globalSubroutineIndex.obj,
            compactFontFormat.fontDictionarySelect,
            compactFontFormat.fontDictionaryArray,
            topDict.privateDictionary
        );
        compactFontFormat.charStrings = charStringsAndSeacs.charStrings;
        compactFontFormat.standardEncodingChars = charStringsAndSeacs.standardEncodingChars;
        compactFontFormat.widths = charStringsAndSeacs.widths;
        return compactFontFormat;
    }
    _parseCharStrings(charStrings: any,localSubroutineIndex: any,globalSubroutineIndex: any, fontDictionarySelect: any, fontDictionaryArray: any, //eslint-disable-line
                      privateDictionary: any): any { //eslint-disable-line
        const count: number = charStrings.count;
        for (let i: number = 0; i < count; i++) {
            const charstring: any = charStrings._get(i); //eslint-disable-line
            const state: any = { //eslint-disable-line
                callDepth: 0,
                stackSize: 0,
                stack: [],
                undefStack: true,
                hints: 0,
                firstStackClearing: true,
                standardCharacter: null,
                width: null,
                hasVStems: false
            };
            let valid: boolean = true;
            let localSubrToUse: any = null; //eslint-disable-line
            let dictionaryToUse: any = privateDictionary; //eslint-disable-line
            if (fontDictionarySelect && fontDictionaryArray.length) {
                const fontDictionaryIndex: number = fontDictionarySelect.getFDIndex(i);
                if (fontDictionaryIndex === -1) {
                    //warn('Glyph index is not in font dictionary select.');
                    valid = false;
                }
                if (fontDictionaryIndex >= fontDictionaryArray.length) {
                    //warn('Invalid font dictionary index for glyph index.');
                    valid = false;
                }
                if (valid) {
                    dictionaryToUse = fontDictionaryArray[Number.parseInt(fontDictionaryIndex.toString(), 10)].privateDictionary;
                    localSubrToUse = dictionaryToUse.subroutineIndex;
                }
            } else if (localSubroutineIndex) {
                localSubrToUse = localSubroutineIndex;
            }
            if (valid) {
                valid = this._parseCharString(
                    state,
                    charstring,
                    localSubrToUse,
                    globalSubroutineIndex
                );
            }
            if (state.width !== null) {
                const nominalWidth: number = dictionaryToUse._getByName('nominalWidthX');
                this._widths[Number.parseInt(i.toString(), 10)] = nominalWidth + state.width;
            } else {
                const defaultWidth: any = dictionaryToUse._getByName('defaultWidthX'); //eslint-disable-line
                this._widths[Number.parseInt(i.toString(), 10)] = defaultWidth;
            }
            if (state.standardCharacter !== null) {
                this._standardEncodingChars[Number.parseInt(i.toString(), 10)] = state.standardCharacter;
            }
            if (!valid) {
                // resetting invalid charstring to single 'endchar'
                charStrings.set(i, new Uint8Array([14]));
            }
        }
        return { charStrings, this: this._standardEncodingChars, widths: this._widths };
    }
    _parseFontDictionarySelect(pos: number, length: number): any { //eslint-disable-line
        const bytes: any = this._bytes; //eslint-disable-line
        const format: any = bytes[pos++]; //eslint-disable-line
        const fontDictionarySelect: any = []; //eslint-disable-line
        let i: number;
        let rangesCount: number;
        switch (format) {
        case 0:
            for (i = 0; i < length; ++i) {
                const id: any = bytes[pos++]; //eslint-disable-line
                fontDictionarySelect.push(id);
            }
            break;
        case 3:
            rangesCount = (bytes[pos++] << 8) | bytes[pos++];
            for (i = 0; i < rangesCount; ++i) {
                let first: number = (bytes[pos++] << 8) | bytes[pos++];
                if (i === 0 && first !== 0) {
                    first = 0;
                }
                const fontDictionaryIndex: any = bytes[pos++]; //eslint-disable-line
                const next: number = (bytes[Number.parseInt(pos.toString(), 10)] << 8) | bytes[pos + 1];
                for (let j: number = first; j < next; ++j) {
                    fontDictionarySelect.push(fontDictionaryIndex);
                }
            }
            pos += 2;
            break;
        default:
            throw new FormatError(`parseFDSelect: Unknown format '${format}'.`);
        }
        if (fontDictionarySelect.length !== length) {
            throw new FormatError('parseFDSelect: Invalid font data.');
        }
        return new _PdfCompactFontSelect(format, fontDictionarySelect);
    }
    _parseCharSets(pos: any, length: any, strings: any, characterIdentifier: any): any { //eslint-disable-line
        if (pos === 0) {
            return new _PdfCompactFontCharacterSet(
                true,
                this._compactCharSetPredefinedTypes.standard,
                this._standardCharSet
            );
        } else if (pos === 1) {
            return new _PdfCompactFontCharacterSet(
                true,
                this._compactCharSetPredefinedTypes.expert,
                this._expertCharSet
            );
        } else if (pos === 2) {
            return new _PdfCompactFontCharacterSet(
                true,
                this._compactCharSetPredefinedTypes.expertSubset,
                this._expertSubsetCharSet
            );
        }
        const bytes: any = this._bytes; //eslint-disable-line
        const start: number = pos;
        const format: any = bytes[pos++]; //eslint-disable-line
        const charSet: any = [characterIdentifier ? 0 : '.notdef']; //eslint-disable-line
        let id: number;
        let count: number;
        let i: number;
        length -= 1;
        switch (format) {
        case 0:
            for (i = 0; i < length; i++) {
                id = (bytes[pos++] << 8) | bytes[pos++];
                charSet.push(characterIdentifier ? id : strings._get(id));
            }
            break;
        case 1:
            while (charSet.length <= length) {
                id = (bytes[pos++] << 8) | bytes[pos++];
                count = bytes[pos++];
                for (i = 0; i <= count; i++) {
                    charSet.push(characterIdentifier ? id++ : strings._get(id++));
                }
            }
            break;
        case 2:
            while (charSet.length <= length) {
                id = (bytes[pos++] << 8) | bytes[pos++];
                count = (bytes[pos++] << 8) | bytes[pos++];
                for (i = 0; i <= count; i++) {
                    charSet.push(characterIdentifier ? id++ : strings._get(id++));
                }
            }
            break;
        default:
            throw new FormatError('Unknown charSet format');
        }
        const end: number = pos;
        const raw: any = bytes.subarray(start, end); //eslint-disable-line
        return new _PdfCompactFontCharacterSet(false, format, charSet, raw);
    }
    _readSupplement(bytes: any, pos: number, encoding: any, charSet: any, strings: any): any {; //eslint-disable-line
        const supplementsCount: number = bytes[pos++];
        for (let i: number = 0; i < supplementsCount; i++) {
            const code: any = bytes[pos++]; //eslint-disable-line
            const sid: any = (bytes[pos++] << 8) + (bytes[pos++] & 0xff); //eslint-disable-line
            encoding[Number.parseInt(code.toString(), 10)] = charSet.indexOf(strings._get(sid));
        }
        return encoding;
    }
    _parseEncoding(pos: any, properties: any, strings: any, charSet: any): any { //eslint-disable-line
        let encoding: any = Object.create(null); //eslint-disable-line
        const bytes: any = this._bytes; //eslint-disable-line
        let predefined: boolean = false;
        let format: number;
        let i: number;
        let ii: number;
        let raw: any = null; //eslint-disable-line
        if (pos === 0 || pos === 1) {
            predefined = true;
            format = pos;
            const baseEncoding: string[] = pos ? _expertEncoding : _standardEncoding;
            for (i = 0, ii = charSet.length; i < ii; i++) {
                const index: number = baseEncoding.indexOf(charSet[Number.parseInt(i.toString(), 10)]);
                if (index !== -1) {
                    encoding[Number.parseInt(index.toString(), 10)] = i;
                }
            }
        } else {
            const dataStart: number = pos;
            format = bytes[pos++];
            let rangesCount: number;
            let glyphsCount: number;
            let gid: number;
            switch (format & 0x7f) {
            case 0:
                glyphsCount = bytes[pos++];
                for (i = 1; i <= glyphsCount; i++) {
                    encoding[bytes[pos++]] = i;
                }
                break;
            case 1:
                rangesCount = bytes[pos++];
                gid = 1;
                for (i = 0; i < rangesCount; i++) {
                    const start: number = bytes[pos++];
                    const left: number = bytes[pos++];
                    for (let j: number = start; j <= start + left; j++) {
                        encoding[Number.parseInt(j.toString(), 10)] = gid++;
                    }
                }
                break;
            default:
                throw new FormatError(`Unknown encoding format: ${format} in compactFont`);
            }
            const dataEnd: number = pos;
            if (format & 0x80) {
                bytes[Number.parseInt(dataStart.toString(), 10)] &= 0x7f;
                encoding = this._readSupplement(bytes, pos, encoding, charSet, strings);
            }
            raw = bytes.subarray(dataStart, dataEnd);
        }
        format &= 0x7f;
        return new _PdfCompactFontEncoding(predefined, format, encoding, raw);
    }
    private _parseHeader(): any { //eslint-disable-line
        let bytes: any = this._bytes; //eslint-disable-line
        const bytesLength: number = bytes.length;
        let offset: number = 0;
        while (offset < bytesLength && bytes[Number.parseInt(offset.toString(), 10)] !== 1) {
            ++offset;
        }
        if (offset >= bytesLength) {
            throw new FormatError('Invalid compactFont header');
        }
        if (offset !== 0) {
            bytes = bytes.subarray(offset);
            this._bytes = bytes;
        }
        const major: any = bytes[0]; //eslint-disable-line
        const minor: any = bytes[1]; //eslint-disable-line
        const headerSize: any = bytes[2]; //eslint-disable-line
        const offSize: any = bytes[3]; //eslint-disable-line
        const header: _PdfCompactFontHeader = new _PdfCompactFontHeader(major, minor, headerSize, offSize);
        return { obj: header, endPos: headerSize };
    }
    _parseOperand(dictionary: any): number { //eslint-disable-line
        let value: number = dictionary[this._pos++];
        if (value === 30) {
            return this._parseFloatOperand(dictionary);
        } else if (value === 28) {
            value = dictionary[this._pos++];
            value = ((value << 24) | (dictionary[this._pos++] << 16)) >> 16;
            return value;
        } else if (value === 29) {
            value = dictionary[this._pos++];
            value = (value << 8) | dictionary[this._pos++];
            value = (value << 8) | dictionary[this._pos++];
            value = (value << 8) | dictionary[this._pos++];
            return value;
        } else if (value >= 32 && value <= 246) {
            return value - 139;
        } else if (value >= 247 && value <= 250) {
            return (value - 247) * 256 + dictionary[this._pos++] + 108;
        } else if (value >= 251 && value <= 254) {
            return -((value - 251) * 256) - dictionary[this._pos++] - 108;
        }
        return NaN;
    }
    _parseFloatOperand(dictionary: any): number { //eslint-disable-line
        let str: string = '';
        const eof: number = 15;
        const lookup: any = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'E', 'E-', null, '-']; //eslint-disable-line
        const length: number = dictionary.length;
        while (this._pos < length) {
            const b: number = dictionary[this._pos++];
            const b1: number = b >> 4;
            const b2: number = b & 15;
            if (b1 === eof) {
                break;
            }
            str += lookup[Number.parseInt(b1.toString(), 10)];
            if (b2 === eof) {
                break;
            }
            str += lookup[Number.parseInt(b2.toString(), 10)];
        }
        return parseFloat(str);
    }
    _parseDictionary(dictionary: any): [number, number[]][] { //eslint-disable-line
        let operands: number[] = [];
        const entries: [number, number[]][] = [];
        const end: number = dictionary.length;
        this._pos = 0;
        while (this._pos < end) {
            let b: number = dictionary[this._pos];
            if (b <= 21) {
                if (b === 12) {
                    b = (b << 8) | dictionary[++this._pos];
                }
                entries.push([b, operands]);
                operands = [];
                ++this._pos;
            } else {
                operands.push(this._parseOperand(dictionary));
            }
        }
        return entries;
    }
    _parseIndex(pos: number): { obj: _PdfCompactFontIndex; endPos: number } {
        const compactFontIndex: _PdfCompactFontIndex = new _PdfCompactFontIndex();
        const bytes: any = this._bytes; //eslint-disable-line
        const count: number = (bytes[pos++] << 8) | bytes[pos++];
        const offsets: number[] = [];
        let end: number = pos;
        if (count !== 0) {
            const offsetSize: number = bytes[pos++];
            const startPos: number = pos + (count + 1) * offsetSize - 1;
            for (let i: number = 0, ii: number = count + 1; i < ii; ++i) {
                let offset: number = 0;
                for (let j: number = 0; j < offsetSize; ++j) {
                    offset <<= 8;
                    offset += bytes[pos++];
                }
                offsets.push(startPos + offset);
            }
            end = offsets[Number.parseInt(count.toString(), 10)];
        }
        for (let i: number = 0, ii: number = offsets.length - 1; i < ii; ++i) {
            const offsetStart: number = offsets[Number.parseInt(i.toString(), 10)];
            const offsetEnd: number = offsets[i + 1];
            compactFontIndex.add(bytes.subarray(offsetStart, offsetEnd));
        }
        return { obj: compactFontIndex, endPos: end };
    }
    _parseNameIndex(index: { count: number; _get: (i: number) => Uint8Array }): string[] {
        const names: string[] = [];
        for (let i: number = 0, ii: number = index.count; i < ii; ++i) {
            const name: any = index._get(i); //eslint-disable-line
            names.push(_bytesToString(name));
        }
        return names;
    }
    _parseStringIndex(index: { count: number; _get: (i: number) => Uint8Array }): _PdfCompactFontStrings {
        const strings: _PdfCompactFontStrings = new _PdfCompactFontStrings();
        for (let i: number = 0, ii: number = index.count; i < ii; ++i) {
            const data: any = index._get(i); //eslint-disable-line
            strings._add(_bytesToString(data));
        }
        return strings;
    }
    _createDictionary(type: any, dictionary: [number, number[]][], strings: _PdfCompactFontStrings): any { //eslint-disable-line
        const compactFontDict: any = new type(strings); //eslint-disable-line
        for (const [key, value] of dictionary) {
            compactFontDict._setByKey(key, value);
        }
        return compactFontDict;
    }
    _parseCharString(
        state: any, //eslint-disable-line
        data: number[],
        localSubroutineIndex: { count: number; get: (index: number) => number[] },
        globalSubroutineIndex: { count: number; get: (index: number) => number[] }
    ): any { //eslint-disable-line
        if (!data || state.callDepth > 1000) {
            return false;
        }
        let stackSize: number = state.stackSize;
        const stack: any = state.stack; //eslint-disable-line
        let length: number = data.length;
        for (let j: number = 0; j < length;) {
            const value: number = data[j++];
            let validationCommand: any = null; //eslint-disable-line
            if (value === 12) {
                const q: number = data[j++];
                if (q === 0) {
                    data[j - 2] = 139;
                    data[j - 1] = 22;
                    stackSize = 0;
                } else {
                    validationCommand = this._characterValidationData12[Number.parseInt(q.toString(), 10)];
                }
            } else if (value === 28) {
                stack[Number.parseInt(stackSize.toString(), 10)] = ((data[Number.parseInt(j.toString(), 10)] << 24) |
                                                                    (data[j + 1] << 16)) >> 16;
                j += 2;
                stackSize++;
            } else if (value === 14) {
                if (stackSize >= 4) {
                    stackSize -= 4;
                    if (this._isAnalysisEnabled) {
                        state.standardCharacter = stack.slice(stackSize, stackSize + 4);
                        return false;
                    }
                }
                validationCommand = this._characterValidationData[Number.parseInt(value.toString(), 10)];
            } else if (value >= 32 && value <= 246) {
                stack[Number.parseInt(stackSize.toString(), 10)] = value - 139;
                stackSize++;
            } else if (value >= 247 && value <= 254) {
                stack[Number.parseInt(stackSize.toString(), 10)] = value < 251
                    ? ((value - 247) << 8) + data[Number.parseInt(j.toString(), 10)] + 108
                    : -((value - 251) << 8) - data[Number.parseInt(j.toString(), 10)] - 108;
                j++;
                stackSize++;
            } else if (value === 255) {
                stack[Number.parseInt(stackSize.toString(), 10)] = ((data[Number.parseInt(j.toString(), 10)] << 24) |
                    (data[j + 1] << 16) |
                    (data[j + 2] << 8) |
                    data[j + 3]) / 65536;
                j += 4;
                stackSize++;
            } else if (value === 19 || value === 20) {
                state.hints += stackSize >> 1;
                if (state.hints === 0) {
                    data.copyWithin(j - 1, j, -1);
                    j -= 1;
                    length -= 1;
                    continue;
                }
                j += (state.hints + 7) >> 3;
                stackSize %= 2;
                validationCommand = this._characterValidationData[Number.parseInt(value.toString(), 10)];
            } else if (value === 10 || value === 29) {
                const subroutineIndex: any = value === 10 ? localSubroutineIndex : globalSubroutineIndex; //eslint-disable-line
                if (!subroutineIndex) {
                    validationCommand = this._characterValidationData[Number.parseInt(value.toString(), 10)];
                    return false;
                }
                let bias: number = 32768;
                if (subroutineIndex.count < 1240) {
                    bias = 107;
                } else if (subroutineIndex.count < 33900) {
                    bias = 1131;
                }
                const subrNumber: number = stack[--stackSize] + bias;
                if (subrNumber < 0 || subrNumber >= subroutineIndex.count || isNaN(subrNumber)) {
                    validationCommand = this._characterValidationData[Number.parseInt(value.toString(), 10)];
                    return false;
                }
                state.stackSize = stackSize;
                state.callDepth++;
                const valid: boolean = this._parseCharString(state, subroutineIndex._get(subrNumber), localSubroutineIndex,
                                                             globalSubroutineIndex);
                if (!valid) {
                    return false;
                }
                state.callDepth--;
                stackSize = state.stackSize;
                continue;
            } else if (value === 11) {
                state.stackSize = stackSize;
                return true;
            } else if (value === 0 && j === data.length) {
                data[j - 1] = 14;
                validationCommand = this._characterValidationData[14];
            } else if (value === 9) {
                data.copyWithin(j - 1, j, -1);
                j -= 1;
                length -= 1;
                continue;
            } else {
                validationCommand = this._characterValidationData[Number.parseInt(value.toString(), 10)];
            }
            if (validationCommand) {
                if (validationCommand.stem) {
                    state.hints += stackSize >> 1;
                    if (value === 3 || value === 23) {
                        state.hasVStems = true;
                    } else if (state.hasVStems && (value === 1 || value === 18)) {
                        data[j - 1] = value === 1 ? 3 : 23;
                    }
                }
                if ('min' in validationCommand) {
                    if (!state.undefStack && stackSize < validationCommand.min) {
                        if (stackSize === 0) {
                            data[j - 1] = 14;
                            return true;
                        }
                        return false;
                    }
                }
                if (state.firstStackClearing && validationCommand.stackClearing) {
                    state.firstStackClearing = false;
                    stackSize -= validationCommand.min;
                    if (stackSize >= 2 && validationCommand.stem) {
                        stackSize %= 2;
                    }
                    if (stackSize > 0) {
                        state.width = stack[stackSize - 1];
                    }
                }
                if ('stackDelta' in validationCommand) {
                    if ('stackFn' in validationCommand) {
                        validationCommand.stackFn(stack, stackSize);
                    }
                    stackSize += validationCommand.stackDelta;
                } else if (validationCommand.stackClearing) {
                    stackSize = 0;
                } else if (validationCommand.resetStack) {
                    stackSize = 0;
                    state.undefStack = false;
                } else if (validationCommand.undefStack) {
                    stackSize = 0;
                    state.undefStack = true;
                    state.firstStackClearing = false;
                }
            }
        }
        if (length < data.length) {
            data.fill(/* endchar = */ 14, length);
        }
        state.stackSize = stackSize;
        return true;
    }
    _emptyPrivateDictionary(parentDictionary: any): void { //eslint-disable-line
        const privateDictionary: any = this._createDictionary(_PdfCompactFontPrivateDictionary, [], parentDictionary.strings); //eslint-disable-line
        parentDictionary._setByKey(18, [0, 0]);
        parentDictionary.privateDictionary = privateDictionary;
    }
}
export class _PdfCompactFormatFont {
    header: any; //eslint-disable-line
    names: any; //eslint-disable-line
    topDictionary: any; //eslint-disable-line
    strings: _PdfCompactFontStrings;
    globalSubroutineIndex: any; //eslint-disable-line
    encoding: any; //eslint-disable-line
    charSet: any; //eslint-disable-line
    charStrings: any; //eslint-disable-line
    fontDictionaryArray: any; //eslint-disable-line
    fontDictionarySelect: any; //eslint-disable-line
    isCharacterIdentifierFont: boolean = false;
    standardEncodingChars: any = []; //eslint-disable-line
    widths: any = []; //eslint-disable-line
    constructor() {
        this.header = null;
        this.names = [];
        this.topDictionary = null;
        this.strings = new _PdfCompactFontStrings();
        this.globalSubroutineIndex = null;
        this.encoding = null;
        this.charSet = null;
        this.charStrings = null;
        this.fontDictionaryArray = [];
        this.fontDictionarySelect = null;
        this.isCharacterIdentifierFont = false;
    }
    _duplicateFirstGlyph(): void {
        if (this.charStrings.count >= 65535) {
            return;
        }
        const glyphZero: any = this.charStrings._get(0); //eslint-disable-line
        this.charStrings.add(glyphZero);
        if (this.isCharacterIdentifierFont) {
            this.fontDictionarySelect.fontDictionarySelect.push(this.fontDictionarySelect.fontDictionarySelect[0]);
        }
    }
    _hasGlyphId(id: any): boolean {  //eslint-disable-line
        if (id < 0 || id >= this.charStrings.count) {
            return false;
        }
        const glyph: any = this.charStrings._get(id); //eslint-disable-line
        return glyph.length > 0;
    }
}
export class _PdfCompactFontHeader {
    major: any; //eslint-disable-line
    minor: any; //eslint-disable-line
    headerSize: any; //eslint-disable-line
    offSize: any; //eslint-disable-line
    constructor(major: any, minor: any, headerSize: any, offSize: any) { //eslint-disable-line
        this.major = major;
        this.minor = minor;
        this.headerSize = headerSize;
        this.offSize = offSize;
    }
}
export class _PdfCompactFontStrings {
    strings: any;  //eslint-disable-line
    _numberOfStandardCompactFontStrings: number = 391;
    _compactFontStandardStrings: string[] = [
        '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
        'ampersand', 'quoteright', 'parenleft', 'parenright', 'asterisk', 'plus',
        'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three', 'four',
        'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less',
        'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
        'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum',
        'underscore', 'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
        'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent',
        'sterling', 'fraction', 'yen', 'florin', 'section', 'currency',
        'quotesingle', 'quotedblleft', 'guillemotleft', 'guilsinglleft',
        'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl',
        'periodcentered', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase',
        'quotedblright', 'guillemotright', 'ellipsis', 'perthousand', 'questiondown',
        'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent',
        'dieresis', 'ring', 'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash',
        'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE', 'ordmasculine', 'ae',
        'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior',
        'logicalnot', 'mu', 'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn',
        'onequarter', 'divide', 'brokenbar', 'degree', 'thorn', 'threequarters',
        'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior',
        'copyright', 'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring',
        'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex', 'Edieresis', 'Egrave',
        'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute',
        'Ocircumflex', 'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute',
        'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute', 'Ydieresis', 'Zcaron',
        'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde',
        'ccedilla', 'eacute', 'ecircumflex', 'edieresis', 'egrave', 'iacute',
        'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute', 'ocircumflex',
        'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex',
        'udieresis', 'ugrave', 'yacute', 'ydieresis', 'zcaron', 'exclamsmall',
        'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior', 'ampersandsmall',
        'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader',
        'onedotenleader', 'zerooldstyle', 'oneoldstyle', 'twooldstyle',
        'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle',
        'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior',
        'threequartersemdash', 'periodsuperior', 'questionsmall', 'asuperior',
        'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior',
        'lsuperior', 'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior',
        'tsuperior', 'ff', 'ffi', 'ffl', 'parenleftinferior', 'parenrightinferior',
        'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall', 'Bsmall',
        'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall',
        'Jsmall', 'Ksmall', 'Lsmall', 'Msmall', 'Nsmall', 'Osmall', 'Psmall',
        'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
        'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah',
        'Tildesmall', 'exclamdownsmall', 'centoldstyle', 'Lslashsmall',
        'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall',
        'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior',
        'Ogoneksmall', 'Ringsmall', 'Cedillasmall', 'questiondownsmall', 'oneeighth',
        'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds',
        'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior',
        'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior',
        'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior',
        'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior',
        'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior',
        'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall',
        'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall',
        'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall',
        'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall',
        'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall', 'Ocircumflexsmall',
        'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall',
        'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall',
        'Thornsmall', 'Ydieresissmall', '001.000', '001.001', '001.002', '001.003',
        'Black', 'Bold', 'Book', 'Light', 'Medium', 'Regular', 'Roman', 'Semibold'
    ];
    constructor() {
        this.strings = [];
    }
    _get(index: number): any { //eslint-disable-line
        if (index >= 0 && index <= this._numberOfStandardCompactFontStrings - 1) {
            return this._compactFontStandardStrings[Number.parseInt(index.toString(), 10)];
        }
        if (index - this._numberOfStandardCompactFontStrings <= this.strings.length) {
            return this.strings[index - this._numberOfStandardCompactFontStrings];
        }
        return this._compactFontStandardStrings[0];
    }
    _fetchStringIdentifier(text: any): number { //eslint-disable-line
        let index: number = this._compactFontStandardStrings.indexOf(text);
        if (index !== -1) {
            return index;
        }
        index = this.strings.indexOf(text);
        if (index !== -1) {
            return index + this._numberOfStandardCompactFontStrings;
        }
        return -1;
    }
    _add(value: any): void { //eslint-disable-line
        this.strings.push(value);
    }
    get count(): number {
        return this.strings.length;
    }
}
export class _PdfCompactFontIndex {
    objects: any; //eslint-disable-line
    length: number;
    constructor() {
        this.objects = [];
        this.length = 0;
    }
    add(data: any): void { //eslint-disable-line
        this.length += data.length;
        this.objects.push(data);
    }
    set(index: number, data: any): void { //eslint-disable-line
        this.length += data.length - this.objects[Number.parseInt(index.toString(), 10)].length;
        this.objects[Number.parseInt(index.toString(), 10)] = data;
    }
    _get(index: number): any { //eslint-disable-line
        return this.objects[Number.parseInt(index.toString(), 10)];
    }
    get count(): number {
        return this.objects.length;
    }
}
export class _PdfCompactFontDictionary {
    keyToNameMap: any; //eslint-disable-line
    nameToKeyMap: any; //eslint-disable-line
    defaults: any; //eslint-disable-line
    types: any; //eslint-disable-line
    opcodes: any; //eslint-disable-line
    order: any; //eslint-disable-line
    strings: any; //eslint-disable-line
    values: any = Object.create(null); //eslint-disable-line
    constructor(tables: any, strings: any) { //eslint-disable-line 
        this.keyToNameMap = tables.keyToNameMap;
        this.nameToKeyMap = tables.nameToKeyMap;
        this.defaults = tables.defaults;
        this.types = tables.types;
        this.opcodes = tables.opcodes;
        this.order = tables.order;
        this.strings = strings;
        this.values = Object.create(null);
    }
    _setByKey(key: any, value: any): boolean { //eslint-disable-line
        if (!this.keyToNameMap && (key in this.keyToNameMap)) {
            return false;
        }
        if (value.length === 0) {
            return true;
        }
        for (const val of value) {
            if (isNaN(val)) {
                return true;
            }
        }
        const type: any = this.types[key]; //eslint-disable-line
        if (type === 'num' || type === 'sid' || type === 'offset') {
            value = value[0];
        }
        this.values[Number.parseInt(key.toString(), 10)] = value;
        return true;
    }
    _setByName(name: any, value: any): void { //eslint-disable-line
        if (!(name in this.nameToKeyMap)) {
            throw new FormatError(`Invalid dictionary name '${name}'`);
        }
        this.values[this.nameToKeyMap[Number.parseInt(name.toString(), 10)]] = value;
    }
    _hasName(name: any): any { //eslint-disable-line
        return this.nameToKeyMap[Number.parseInt(name.toString(), 10)] in this.values;
    }
    _getByName(name: string): any { //eslint-disable-line
        if (!(name in this.nameToKeyMap)) {
            throw new FormatError(`Invalid dictionary name ${name}'`);
        }
        const key: any = this.nameToKeyMap[name]; //eslint-disable-line
        if (!(key in this.values)) {
            return this.defaults[key]; // eslint-disable-line
        }
        return this.values[key]; //eslint-disable-line
    }
    _removeByName(name: any): any { //eslint-disable-line
        delete this.values[this.nameToKeyMap[Number.parseInt(name.toString(), 10)]];
    }
    _createTables(layout: any) { //eslint-disable-line
        const tables: any = { //eslint-disable-line
            keyToNameMap: {},
            nameToKeyMap: {},
            defaults: {},
            types: {},
            opcodes: {},
            order: []
        };
        for (const entry of layout) {
            const key: any = Array.isArray(entry[0]) //eslint-disable-line
                ? (entry[0][0] << 8) + entry[0][1]
                : entry[0];
            tables.keyToNameMap[Number.parseInt(key.toString(), 10)] = entry[1];
            tables.nameToKeyMap[entry[1]] = key;
            tables.types[Number.parseInt(key.toString(), 10)] = entry[2];
            tables.defaults[Number.parseInt(key.toString(), 10)] = entry[3];
            tables.opcodes[Number.parseInt(key.toString(), 10)] = Array.isArray(entry[0]) ? entry[0] : [entry[0]];
            tables.order.push(key);
        }
        return tables;
    }
}
export class _PdfCompactFontTopDictionary extends _PdfCompactFontDictionary {
    privateDictionary: any; //eslint-disable-line  
    static get _tables(): any { //eslint-disable-line
        return _defineProperty(this, 'tables', _PdfCompactFontTopDictionary._createTables());
    }
    constructor(strings?: any) {  //eslint-disable-line
        super(_PdfCompactFontTopDictionary._createTables(), strings);
        this.privateDictionary = null;
    }
    static _createTables(): any { //eslint-disable-line
        let layout: any = [ //eslint-disable-line
            [[12, 30], 'ROS', ['sid', 'sid', 'num'], null],
            [[12, 20], 'SyntheticBase', 'num', null],
            [0, 'version', 'sid', null],
            [1, 'Notice', 'sid', null],
            [[12, 0], 'Copyright', 'sid', null],
            [2, 'FullName', 'sid', null],
            [3, 'FamilyName', 'sid', null],
            [4, 'Weight', 'sid', null],
            [[12, 1], 'isFixedPitch', 'num', 0],
            [[12, 2], 'ItalicAngle', 'num', 0],
            [[12, 3], 'UnderlinePosition', 'num', -100],
            [[12, 4], 'UnderlineThickness', 'num', 50],
            [[12, 5], 'PaintType', 'num', 0],
            [[12, 6], 'CharstringType', 'num', 2],
            [[12, 7], 'FontMatrix', ['num', 'num', 'num', 'num', 'num', 'num'],
                [0.001, 0, 0, 0.001, 0, 0]],
            [13, 'UniqueID', 'num', null],
            [5, 'FontBBox', ['num', 'num', 'num', 'num'], [0, 0, 0, 0]],
            [[12, 8], 'StrokeWidth', 'num', 0],
            [14, 'XUID', 'array', null],
            [15, 'charSet', 'offset', 0],
            [16, 'Encoding', 'offset', 0],
            [17, 'CharStrings', 'offset', 0],
            [18, 'Private', ['offset', 'offset'], null],
            [[12, 21], 'PostScript', 'sid', null],
            [[12, 22], 'BaseFontName', 'sid', null],
            [[12, 23], 'BaseFontBlend', 'delta', null],
            [[12, 31], 'CIDFontVersion', 'num', 0],
            [[12, 32], 'CIDFontRevision', 'num', 0],
            [[12, 33], 'CIDFontType', 'num', 0],
            [[12, 34], 'CIDCount', 'num', 8720],
            [[12, 35], 'UIDBase', 'num', null],
            [[12, 37], 'FDSelect', 'offset', null],
            [[12, 36], 'FDArray', 'offset', null],
            [[12, 38], 'FontName', 'sid', null]
        ];
        const tables: any = { //eslint-disable-line
            keyToNameMap: {},
            nameToKeyMap: {},
            defaults: {},
            types: {},
            opcodes: {},
            order: []
        };
        for (const entry of layout) {
            const key: any = Array.isArray(entry[0]) //eslint-disable-line
                ? (entry[0][0] << 8) + entry[0][1]
                : entry[0];
            tables.keyToNameMap[Number.parseInt(key.toString(), 10)] = entry[1];
            tables.nameToKeyMap[entry[1]] = key;
            tables.types[Number.parseInt(key.toString(), 10)] = entry[2];
            tables.defaults[Number.parseInt(key.toString(), 10)] = entry[3];
            tables.opcodes[Number.parseInt(key.toString(), 10)] = Array.isArray(entry[0]) ? entry[0] : [entry[0]];
            tables.order.push(key);
        }
        return tables;
    }
}
export class _PdfCompactFontPrivateDictionary extends _PdfCompactFontDictionary {
    strings: any; //eslint-disable-line
    subroutineIndex: any; //eslint-disable-line
    tables: any; //eslint-disable-line
    constructor(strings?: string) {
        const layout: any = [ //eslint-disable-line
            [6, 'BlueValues', 'delta', null],
            [7, 'OtherBlues', 'delta', null],
            [8, 'FamilyBlues', 'delta', null],
            [9, 'FamilyOtherBlues', 'delta', null],
            [[12, 9], 'BlueScale', 'num', 0.039625],
            [[12, 10], 'BlueShift', 'num', 7],
            [[12, 11], 'BlueFuzz', 'num', 1],
            [10, 'StdHW', 'num', null],
            [11, 'StdVW', 'num', null],
            [[12, 12], 'StemSnapH', 'delta', null],
            [[12, 13], 'StemSnapV', 'delta', null],
            [[12, 14], 'ForceBold', 'num', 0],
            [[12, 17], 'LanguageGroup', 'num', 0],
            [[12, 18], 'ExpansionFactor', 'num', 0.06],
            [[12, 19], 'initialRandomSeed', 'num', 0],
            [20, 'defaultWidthX', 'num', 0],
            [21, 'nominalWidthX', 'num', 0],
            [19, 'Subrs', 'offset', null]
        ];
        const tables: any = { //eslint-disable-line
            keyToNameMap: {},
            nameToKeyMap: {},
            defaults: {},
            types: {},
            opcodes: {},
            order: []
        };
        for (const entry of layout) {
            const key: any = Array.isArray(entry[0]) //eslint-disable-line
                ? (entry[0][0] << 8) + entry[0][1]
                : entry[0];
            tables.keyToNameMap[Number.parseInt(key.toString(), 10)] = entry[1];
            tables.nameToKeyMap[entry[1]] = key;
            tables.types[Number.parseInt(key.toString(), 10)] = entry[2];
            tables.defaults[Number.parseInt(key.toString(), 10)] = entry[3];
            tables.opcodes[Number.parseInt(key.toString(), 10)] = Array.isArray(entry[0]) ? entry[0] : [entry[0]];
            tables.order.push(key);
        }
        super(tables, strings);
        this.tables = tables;
        this.subroutineIndex = null;
    }
}
export class _PdfCompactFontCharacterSet {
    predefined: any; //eslint-disable-line
    format: any; //eslint-disable-line
    charSet: any; //eslint-disable-line
    raw: any; //eslint-disable-line
    constructor(predefined: any, format: any, charSet: any, raw?: any) { //eslint-disable-line
        this.predefined = predefined;
        this.format = format;
        this.charSet = charSet;
        this.raw = raw;
    }
}
export class _PdfCompactFontEncoding {
    predefined: any; //eslint-disable-line
    format: any; //eslint-disable-line
    charSet: any; //eslint-disable-line
    raw: any; //eslint-disable-line
    encoding: any; //eslint-disable-line
    constructor(predefined: any, format: any, encoding: any, raw: any) { //eslint-disable-line
        this.predefined = predefined;
        this.format = format;
        this.encoding = encoding;
        this.raw = raw;
    }
}
export class _PdfCompactFontSelect {
    format: any; //eslint-disable-line
    fontDictionarySelect: any; //eslint-disable-line
    constructor(format: any, fontDictionarySelect: any) { //eslint-disable-line
        this.format = format;
        this.fontDictionarySelect = fontDictionarySelect;
    }
    _getFontDictionaryIndex(glyphIndex: number): any { //eslint-disable-line
        if (glyphIndex < 0 || glyphIndex >= this.fontDictionarySelect.length) {
            return -1;
        }
        return this.fontDictionarySelect[Number.parseInt(glyphIndex.toString(), 10)];
    }
}
export class _PdfCompactFontOffsetTracker {
    offsets: any; //eslint-disable-line
    constructor() {
        this.offsets = Object.create(null);
    }
    _isTracking(key: any): boolean { //eslint-disable-line
        return key in this.offsets;
    }
    _track(key: any, location: any): void { //eslint-disable-line
        if (key in this.offsets) {
            throw new FormatError(`Already tracking location of ${key}`);
        }
        this.offsets[Number.parseInt(key.toString(), 10)] = location;
    }
    _offset(value: any): void { //eslint-disable-line
        const keys: any = Object.keys(this.offsets); //eslint-disable-line
        for (let i: number = 0; i < keys.length; i++) {
            const key: any = keys[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
            const numericKey: number = Number.parseInt(key, 10);
            this.offsets[Number.parseInt(numericKey.toString(), 10)] += value;
        }
    }
    _setEntryLocation(key: any, values: any, output: any): void { //eslint-disable-line
        if (!(key in this.offsets)) {
            throw new FormatError(`Not tracking location of ${key}`);
        }
        const data: any = output.data; //eslint-disable-line
        const dataOffset: number = this.offsets[Number.parseInt(key.toString(), 10)];
        const size: number = 5;
        for (let i: number = 0, ii: number = values.length; i < ii; ++i) {
            const offset0: number = i * size + dataOffset;
            const offset1: number = offset0 + 1;
            const offset2: number = offset0 + 2;
            const offset3: number = offset0 + 3;
            const offset4: number = offset0 + 4;
            if (data[Number.parseInt(offset0.toString(), 10)] !== 0x1d || data[Number.parseInt(offset1.toString(), 10)] !== 0 ||
                data[Number.parseInt(offset2.toString(), 10)] !== 0 || data[Number.parseInt(offset3.toString(), 10)] !== 0 ||
                data[Number.parseInt(offset4.toString(), 10)] !== 0) {
                throw new FormatError('writing to an offset that is not empty');
            }
            const value: number = values[Number.parseInt(i.toString(), 10)];
            data[Number.parseInt(offset0.toString(), 10)] = 0x1d;
            data[Number.parseInt(offset1.toString(), 10)] = (value >> 24) & 0xff;
            data[Number.parseInt(offset2.toString(), 10)] = (value >> 16) & 0xff;
            data[Number.parseInt(offset3.toString(), 10)] = (value >> 8) & 0xff;
            data[Number.parseInt(offset4.toString(), 10)] = value & 0xff;
        }
    }
}
export class _PdfCompactFontCompiler {
    compactFont: any; //eslint-disable-line
    constructor(compactFont: any) { //eslint-disable-line
        this.compactFont = compactFont;
    }
    compile(): any { //eslint-disable-line
        const compactFont: any = this.compactFont; //eslint-disable-line
        const output: any = { //eslint-disable-line
            data: [],
            length: 0,
            add(data: any) { //eslint-disable-line
                try {
                    this.data.push(...data);
                } catch {
                    this.data = this.data.concat(data);
                }
                this.length = this.data.length;
            }
        };
        const header: any = this._compileHeader(compactFont.header); //eslint-disable-line
        output.add(header);
        const nameIndex: any = this._compileNameIndex(compactFont.names); //eslint-disable-line
        output.add(nameIndex);
        if (compactFont.isCharacterIdentifierFont) {
            if (compactFont.topDict._hasName('FontMatrix')) {
                const base: any = compactFont.topDict._getByName('FontMatrix'); //eslint-disable-line
                compactFont.topDict._removeByName('FontMatrix');
                for (const subDict of compactFont.fontDictionaryArray) {
                    let matrix: any = base.slice(0); //eslint-disable-line
                    if (subDict._hasName('FontMatrix')) {
                        matrix = this._transform(matrix, subDict._getByName('FontMatrix'));
                    }
                    subDict._setByName('FontMatrix', matrix);
                }
            }
        }
        const xuid: any = compactFont.topDict._getByName('XUID'); //eslint-disable-line
        if (xuid && xuid.length > 16) {
            compactFont.topDict._removeByName('XUID');
        }
        compactFont.topDict._setByName('charSet', 0);
        let compiled: any = this._compileTopDictionary([compactFont.topDict], output.length, compactFont.isCharacterIdentifierFont); //eslint-disable-line
        output.add(compiled.output);
        const topDictTracker: any = compiled.trackers[0]; //eslint-disable-line
        const stringIndex: any = this._compileStringIndex(compactFont.strings.strings); //eslint-disable-line
        output.add(stringIndex);
        const globalSubroutineIndex: any = this._compileIndex(compactFont.globalSubroutineIndex); //eslint-disable-line
        output.add(globalSubroutineIndex);
        if (compactFont.encoding && compactFont.topDict._hasName('Encoding')) {
            if (compactFont.encoding.predefined) {
                topDictTracker._setEntryLocation('Encoding', [compactFont.encoding.format], output);
            } else {
                const encoding: any = this._compileEncoding(compactFont.encoding); //eslint-disable-line
                topDictTracker._setEntryLocation('Encoding', [output.length], output);
                output.add(encoding);
            }
        }
        const charSet: any = this._compileCharSet( //eslint-disable-line
            compactFont.charSet,
            compactFont.charStrings.count,
            compactFont.strings,
            compactFont.isCharacterIdentifierFont
        );
        topDictTracker._setEntryLocation('charSet', [output.length], output);
        output.add(charSet);
        const charStrings: any = this._compileCharStrings(compactFont.charStrings); //eslint-disable-line
        topDictTracker._setEntryLocation('CharStrings', [output.length], output);
        output.add(charStrings);
        if (compactFont.isCharacterIdentifierFont) {
            topDictTracker._setEntryLocation('FDSelect', [output.length], output);
            const fontDictionarySelect: any = this._compileFontDictionarySelect(compactFont.fontDictionarySelect); //eslint-disable-line
            output.add(fontDictionarySelect);
            compiled = this._compileTopDictionary(compactFont.fontDictionaryArray, output.length, true);
            topDictTracker._setEntryLocation('FDArray', [output.length], output);
            output.add(compiled.output);
            const fontDictTrackers: any = compiled.trackers; //eslint-disable-line
            this._compilePrivateDictionary(compactFont.fontDictionaryArray, fontDictTrackers, output);
        }
        this._compilePrivateDictionary([compactFont.topDict], [topDictTracker], output);
        output.add([0]);
        return output.data;
    }
    _transform(m1: any, m2: any): any { //eslint-disable-line
        return [
            m1[0] * m2[0] + m1[2] * m2[1],
            m1[1] * m2[0] + m1[3] * m2[1],
            m1[0] * m2[2] + m1[2] * m2[3],
            m1[1] * m2[2] + m1[3] * m2[3],
            m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
            m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
        ];
    }
    _encodeNumber(value: any): any { //eslint-disable-line
        if (Number.isInteger(value)) {
            return this._encodeInteger(value);
        }
        return this._encodeFloat(value);
    }
    _encodeFloat(count: any): number[] { //eslint-disable-line
        let value: string = count.toString();
        const m: any = _defineProperty(this, 'EncodeFloatRegExp', /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/).exec(value); //eslint-disable-line
        if (m) {
            const epsilon: number = parseFloat('1e' + ((m[2] ? +m[2] : 0) + m[1].length));
            value = (Math.round(count * epsilon) / epsilon).toString();
        }
        let nibbles: string = '';
        for (let i: number = 0; i < value.length; ++i) {
            const a: string = value[Number.parseInt(i.toString(), 10)];
            if (a === 'e') {
                nibbles += value[++i] === '-' ? 'c' : 'b';
            } else if (a === '.') {
                nibbles += 'a';
            } else if (a === '-') {
                nibbles += 'e';
            } else {
                nibbles += a;
            }
        }
        nibbles += nibbles.length & 1 ? 'f' : 'ff';
        const result: number[] = [30];
        for (let i: number = 0; i < nibbles.length; i += 2) {
            result.push(parseInt(nibbles.substring(i, i + 2), 16));
        }
        return result;
    }
    _encodeInteger(value: number): number[] {
        let code: number[];
        if (value >= -107 && value <= 107) {
            code = [value + 139];
        } else if (value >= 108 && value <= 1131) {
            value -= 108;
            code = [(value >> 8) + 247, value & 0xff];
        } else if (value >= -1131 && value <= -108) {
            value = -value - 108;
            code = [(value >> 8) + 251, value & 0xff];
        } else if (value >= -32768 && value <= 32767) {
            code = [0x1c, (value >> 8) & 0xff, value & 0xff];
        } else {
            code = [
                0x1d,
                (value >> 24) & 0xff,
                (value >> 16) & 0xff,
                (value >> 8) & 0xff,
                value & 0xff
            ];
        }
        return code;
    }
    _compileHeader(header: any): any { //eslint-disable-line
        return [header.major, header.minor, 4, header.offSize];
    }
    _compileNameIndex(names: any): any { //eslint-disable-line
        const nameIndex: _PdfCompactFontIndex = new _PdfCompactFontIndex();
        for (const name of names) {
            const length: number = Math.min(name.length, 127);
            let sanitizedName: any = new Array(length); //eslint-disable-line
            for (let j: number = 0; j < length; j++) {
                let char: string = name[Number.parseInt(j.toString(), 10)];
                if (
                    char < '!' ||
                    char > '~' ||
                    char === '[' ||
                    char === ']' ||
                    char === '(' ||
                    char === ')' ||
                    char === '{' ||
                    char === '}' ||
                    char === '<' ||
                    char === '>' ||
                    char === '/' ||
                    char === '%'
                ) {
                    char = '_';
                }
                sanitizedName[Number.parseInt(j.toString(), 10)] = char;
            }
            sanitizedName = sanitizedName.join('');
            if (sanitizedName === '') {
                sanitizedName = 'Bad_Font_Name';
            }
            nameIndex.add(_stringToBytes(sanitizedName));
        }
        return this._compileIndex(nameIndex);
    }
    _compileTopDictionary(dictionary: any, length: any, removeCidKeys: any): any { //eslint-disable-line
        const fontDictTrackers: any = []; //eslint-disable-line
        let fontDictionaryArrayIndex: _PdfCompactFontIndex = new _PdfCompactFontIndex();
        for (const fontDict of dictionary) {
            if (removeCidKeys) {
                fontDict._removeByName('CIDFontVersion');
                fontDict._removeByName('CIDFontRevision');
                fontDict._removeByName('CIDFontType');
                fontDict._removeByName('CIDCount');
                fontDict._removeByName('UIDBase');
            }
            const fontDictTracker: _PdfCompactFontOffsetTracker = new _PdfCompactFontOffsetTracker();
            const fontDictData: any = this._compileDictionary(fontDict, fontDictTracker); //eslint-disable-line
            fontDictTrackers.push(fontDictTracker);
            fontDictionaryArrayIndex.add(fontDictData);
            fontDictTracker._offset(length);
        }
        fontDictionaryArrayIndex = this._compileIndex(fontDictionaryArrayIndex, fontDictTrackers);
        return {
            trackers: fontDictTrackers,
            output: fontDictionaryArrayIndex
        };
    }
    _compilePrivateDictionary(dictionary: any, trackers: any, output: any): void { //eslint-disable-line
        for (let i: number = 0, ii: number = dictionary.length; i < ii; ++i) {
            const fontDict: any = dictionary[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
            const privateDictionary: any = fontDict.privateDictionary; //eslint-disable-line
            if (!privateDictionary || !fontDict._hasName('Private')) {
                throw new FormatError('There must be a private dictionary.');
            }
            const privateDictionaryTracker: _PdfCompactFontOffsetTracker = new _PdfCompactFontOffsetTracker();
            const privateDictionaryData: any = this._compileDictionary(privateDictionary, privateDictionaryTracker); //eslint-disable-line
            let outputLength: number = output.length;
            privateDictionaryTracker._offset(outputLength);
            if (!privateDictionaryData.length) {
                outputLength = 0;
            }
            trackers[Number.parseInt(i.toString(), 10)].setEntryLocation(
                'Private',
                [privateDictionaryData.length, outputLength],
                output
            );
            output.add(privateDictionaryData);
            if (privateDictionary.subroutineIndex && privateDictionary._hasName('Subrs')) {
                const subrs: any = this._compileIndex(privateDictionary.subroutineIndex); //eslint-disable-line
                privateDictionaryTracker._setEntryLocation(
                    'Subrs',
                    [privateDictionaryData.length],
                    output
                );
                output.add(subrs);
            }
        }
    }
    _compileDictionary(dictionary: any, offsetTracker: any): any { //eslint-disable-line
        const out = []; //eslint-disable-line
        for (const key of dictionary.order) {
            if (!(key in dictionary.values)) {
                continue;
            }
            let values: any = dictionary.values[key]; //eslint-disable-line
            let types: any = dictionary.types[key]; //eslint-disable-line
            if (!Array.isArray(types)) {
                types = [types];
            }
            if (!Array.isArray(values)) {
                values = [values];
            }
            if (values.length === 0) {
                continue;
            }
            for (let j: number = 0, jj: number = types.length; j < jj; ++j) {
                const type : any= types[Number.parseInt(j.toString(), 10)];  //eslint-disable-line
                const value: number = values[Number.parseInt(jj.toString(), 10)];
                let name: string = '';
                switch (type) {
                case 'num':
                case 'sid':
                    try {
                        out.push(...this._encodeNumber(value));
                    } catch (ex) {
                        // Ignoring the error intentionally because...
                    }
                    break;
                case 'offset':
                    name = dictionary.keyToNameMap[Number.parseInt(key.toString(), 10)];
                    if (!offsetTracker.isTracking(name)) {
                        offsetTracker.track(name, out.length);
                    }
                    out.push(0x1d, 0, 0, 0, 0);
                    break;
                case 'array':
                case 'delta':
                    out.push(...this._encodeNumber(value));
                    for (let k: number = 1, kk: number = values.length; k < kk; ++k) {
                        out.push(...this._encodeNumber(values[Number.parseInt(k.toString(), 10)]));
                    }
                    break;
                default:
                    throw new FormatError(`Unknown data type of ${type}`);
                }
            }
            out.push(...dictionary.opcodes[Number.parseInt(key.toString(), 10)]);
        }
        return out;
    }
    _compileStringIndex(strings: any) { //eslint-disable-line
        const stringIndex: _PdfCompactFontIndex = new _PdfCompactFontIndex();
        for (const string of strings) {
            stringIndex.add(_stringToBytes(string));
        }
        return this._compileIndex(stringIndex);
    }
    _compileCharStrings(charStrings: any): any { //eslint-disable-line
        const charStringsIndex: _PdfCompactFontIndex = new _PdfCompactFontIndex();
        for (let i: number = 0; i < charStrings.count; i++) {
            const glyph: any = charStrings._get(i); //eslint-disable-line
            if (glyph.length === 0) {
                charStringsIndex.add(new Uint8Array([0x8b, 0x0e]));
                continue;
            }
            charStringsIndex.add(glyph);
        }
        return this._compileIndex(charStringsIndex);
    }
    _compileCharSet(charSet: any, glyphCount: any, strings: any, isCharacterIdentifierFont: any): any { //eslint-disable-line
        let out: any; //eslint-disable-line
        const glyphCountLessNotDef: number = glyphCount - 1;
        if (isCharacterIdentifierFont) {
            out = new Uint8Array([2, 0, 0, (glyphCountLessNotDef >> 8) & 0xff, glyphCountLessNotDef & 0xff]);
        } else {
            const length: number = 1 + glyphCountLessNotDef * 2;
            out = new Uint8Array(length);
            out[0] = 0;
            let charSetIndex: number = 0;
            const numcharSets: number = charSet.charSet.length;
            let warned: boolean = false;
            for (let i: number = 1; i < out.length; i += 2) {
                let sid: number = 0;
                if (charSetIndex < numcharSets) {
                    const name: any = charSet.charSet[charSetIndex++]; //eslint-disable-line
                    sid = strings.getSID(name);
                    if (sid === -1) {
                        sid = 0;
                        if (!warned) {
                            warned = true;
                        }
                    }
                }
                out[Number.parseInt(i.toString(), 10)] = (sid >> 8) & 0xff;
                out[i + 1] = sid & 0xff;
            }
        }
        return this._compileTypedArray(out);
    }
    _compileEncoding(encoding: any) { //eslint-disable-line
        return this._compileTypedArray(encoding.raw);
    }
    _compileFontDictionarySelect(fontDictionarySelect: any) { //eslint-disable-line
        const format: any = fontDictionarySelect.format; //eslint-disable-line
        let out: Uint8Array;
        let i: number;
        let numRanges: number;
        let start: number;
        switch (format) {
        case 0:
            out = new Uint8Array(1 + fontDictionarySelect.fontDictionarySelect.length);
            out[0] = format;
            for (i = 0; i < fontDictionarySelect.fontDictionarySelect.length; i++) {
                out[i + 1] = fontDictionarySelect.fontDictionarySelect[Number.parseInt(i.toString(), 10)];
            }
            break;
        case 3:
            start = 0;
            let lastFD: any = fontDictionarySelect.fontDictionarySelect[0]; //eslint-disable-line
            const ranges: any = [format, 0, 0, (start >> 8) & 0xff, start & 0xff, lastFD]; //eslint-disable-line
            for (i = 1; i < fontDictionarySelect.fontDictionarySelect.length; i++) {
                const currentFD: any = fontDictionarySelect.fontDictionarySelect[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
                if (currentFD !== lastFD) {
                    ranges.push((i >> 8) & 0xff, i & 0xff, currentFD);
                    lastFD = currentFD;
                }
            }
            numRanges = (ranges.length - 3) / 3;
            ranges[1] = (numRanges >> 8) & 0xff;
            ranges[2] = numRanges & 0xff;
            ranges.push((i >> 8) & 0xff, i & 0xff);
            out = new Uint8Array(ranges);
            break;
        }
        return this._compileTypedArray(out);
    }
    _compileTypedArray(data: any): any { //eslint-disable-line
        return Array.from(data);
    }
    _compileIndex(index: any, trackers: any = []): any { //eslint-disable-line
        const objects: any = index.objects; //eslint-disable-line
        const count: number = objects.length;
        if (count === 0) {
            return [0, 0];
        }
        const data: any = [(count >> 8) & 0xff, count & 0xff]; //eslint-disable-line
        let lastOffset: number = 1;
        let i: number;
        for (i = 0; i < count; ++i) {
            lastOffset += objects[Number.parseInt(i.toString(), 10)].length;
        }
        let offsetSize: number;
        if (lastOffset < 0x100) {
            offsetSize = 1;
        } else if (lastOffset < 0x10000) {
            offsetSize = 2;
        } else if (lastOffset < 0x1000000) {
            offsetSize = 3;
        } else {
            offsetSize = 4;
        }
        data.push(offsetSize);
        let relativeOffset: number = 1;
        for (i = 0; i < count + 1; i++) {
            if (offsetSize === 1) {
                data.push(relativeOffset & 0xff);
            } else if (offsetSize === 2) {
                data.push((relativeOffset >> 8) & 0xff, relativeOffset & 0xff);
            } else if (offsetSize === 3) {
                data.push(
                    (relativeOffset >> 16) & 0xff,
                    (relativeOffset >> 8) & 0xff,
                    relativeOffset & 0xff
                );
            } else {
                data.push(
                    (relativeOffset >>> 24) & 0xff,
                    (relativeOffset >> 16) & 0xff,
                    (relativeOffset >> 8) & 0xff,
                    relativeOffset & 0xff
                );
            }
            if (objects[Number.parseInt(i.toString(), 10)]) {
                relativeOffset += objects[Number.parseInt(i.toString(), 10)].length;
            }
        }
        for (i = 0; i < count; i++) {
            if (trackers[Number.parseInt(i.toString(), 10)]) {
                trackers[Number.parseInt(i.toString(), 10)].offset(data.length);
            }
            data.push(...objects[Number.parseInt(i.toString(), 10)]);
        }
        return data;
    }
}
export class _PdfCompactFont {
    properties: _FontStructure;
    compactFont: any; //eslint-disable-line
    standardCharacter: any; //eslint-disable-line
    data: any; //eslint-disable-line
    _builtInEncoding: any;  //eslint-disable-line
    constructor(file: any, properties: any) { //eslint-disable-line
        this.properties = properties;
        const parser: _PdfCompactFontParser = new _PdfCompactFontParser(file, properties, true);
        this.compactFont = parser._parse(properties);
        this.compactFont._duplicateFirstGlyph();
        const compiler: _PdfCompactFontCompiler = new _PdfCompactFontCompiler(this.compactFont);
        this.standardCharacter = this.compactFont.standardCharacter;
        try {
            this.data = compiler.compile();
        } catch {
            this.data = file;
        }
        this._createBuiltInEncoding();
    }
    get _glyphCount(): number {
        return this.compactFont.charStrings.count;
    }
    _getCharSet(): any { //eslint-disable-line
        return this.compactFont.charSet.charSet;
    }
    _getGlyphMapping(): { [key: number]: number } {
        const compactFont: any = this.compactFont; //eslint-disable-line
        const properties: any = this.properties; //eslint-disable-line
        let cidToGidMap: any; //eslint-disable-line
        const cMap: any = properties._fontStructure._cMap; //eslint-disable-line
        const charSets: any = compactFont.charSet.charSet; //eslint-disable-line
        let charCodeToGlyphId: { [key: number]: number } = {};
        let glyphId: number;
        if (properties._fontStructure._composite) {
            let invCidToGidMap: { [key: number]: number } | undefined;
            if (cidToGidMap && cidToGidMap.length > 0) {
                invCidToGidMap = Object.create(null);
                for (let i: number = 0, ii: number = cidToGidMap.length; i < ii; i++) {
                    const gid: any = cidToGidMap[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
                    if (typeof(gid) !== 'undefined') {
                        invCidToGidMap[Number.parseInt(gid.toString(), 10)] = i;
                    }
                }
            }
            let charCode: number;
            if (compactFont.isCharacterIdentifierFont) {
                for (glyphId = 0; glyphId < charSets.length; glyphId++) {
                    const cid: any = charSets[glyphId];  //eslint-disable-line
                    charCode = cMap._charCodeOf(cid);
                    if (invCidToGidMap && typeof(invCidToGidMap[Number.parseInt(charCode.toString(), 10)]) !== 'undefined') {
                        charCode = invCidToGidMap[Number.parseInt(charCode.toString(), 10)];
                    }
                    charCodeToGlyphId[Number.parseInt(charCode.toString(), 10)] = glyphId;
                }
            } else {
                for (glyphId = 0; glyphId < compactFont.charStrings.count; glyphId++) {
                    charCode = cMap._charCodeOf(glyphId);
                    charCodeToGlyphId[Number.parseInt(charCode.toString(), 10)] = glyphId;
                }
            }
            return charCodeToGlyphId;
        }
        let encoding: any = compactFont.encoding ? compactFont.encoding.encoding : null; //eslint-disable-line
        if (properties._fontStructure._isInternalFont) {
            encoding = properties._fontStructure._defaultEncoding;
        }
        charCodeToGlyphId = this._type1FontGlyphMapping(properties, encoding, charSets);
        return charCodeToGlyphId;
    }
    _hasGlyphId(id: number): boolean {
        return this.compactFont.hasGlyphId(id);
    }
    _type1FontGlyphMapping(properties: any, builtInEncoding: any, glyphNames: any): any { //eslint-disable-line
        const charCodeToGlyphId: any = Object.create(null); //eslint-disable-line
        let glyphId: number;
        let charCode: any; //eslint-disable-line
        let baseEncoding: any; //eslint-disable-line
        const isSymbolicFont: boolean = !!(properties._flags & properties._fontFlags.Symbolic);
        if (properties._fontStructure._isInternalFont) {
            baseEncoding = builtInEncoding;
            for (charCode = 0; charCode < baseEncoding.length; charCode++) {
                glyphId = glyphNames.indexOf(baseEncoding[Number.parseInt(charCode.toString(), 10)]);
                charCodeToGlyphId[Number.parseInt(charCode.toString(), 10)] = glyphId >= 0 ? glyphId : /* notdef = */ 0;
            }
        } else if (properties.baseEncodingName) {
            baseEncoding = _getEncoding(properties.baseEncodingName);
            for (charCode = 0; charCode < baseEncoding.length; charCode++) {
                glyphId = glyphNames.indexOf(baseEncoding[Number.parseInt(charCode.toString(), 10)]);
                charCodeToGlyphId[Number.parseInt(charCode.toString(), 10)] = glyphId >= 0 ? glyphId : /* notdef = */ 0;
            }
        } else if (isSymbolicFont) {
            const builtInEncodingKeys: any = Object.keys(builtInEncoding); //eslint-disable-line
            for (let i: number = 0; i < builtInEncodingKeys.length; i++) {
                const charCode: any = builtInEncodingKeys[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
                const numericCharCode: any = Number.parseInt(charCode, 10); //eslint-disable-line
                charCodeToGlyphId[Number.parseInt(numericCharCode.toString(), 10)] =
                    builtInEncoding[Number.parseInt(numericCharCode.toString(), 10)];
            }
        } else {
            baseEncoding = _standardEncoding;
            for (charCode = 0; charCode < baseEncoding.length; charCode++) {
                glyphId = glyphNames.indexOf(baseEncoding[Number.parseInt(charCode.toString(), 10)]);
                charCodeToGlyphId[Number.parseInt(charCode.toString(), 10)] = glyphId >= 0 ? glyphId : /* notdef = */ 0;
            }
        }
        const differences: any = properties._fontStructure._differences; //eslint-disable-line
        let glyphsUnicodeMap: any; //eslint-disable-line
        if (differences) {
            const differencesKeys: any = Object.keys(differences); //eslint-disable-line
            for (let i: number = 0; i < differencesKeys.length; i++) {
                const charCode: any = differencesKeys[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
                const glyphName: any = differences[Number.parseInt(charCode.toString(), 10)]; //eslint-disable-line
                let glyphId: number = -1;
                for (let j: number = 0; j < glyphNames.length; j++) {
                    if (glyphNames[Number.parseInt(j.toString(), 10)] === glyphName) {
                        glyphId = j;
                        break;
                    }
                }
                if (glyphId === -1) {
                    if (!glyphsUnicodeMap) {
                        glyphsUnicodeMap = _getGlyphsUnicode();
                    }
                    const standardGlyphName: any = _recoverGlyphName(glyphName, glyphsUnicodeMap); //eslint-disable-line
                    if (standardGlyphName !== glyphName) {
                        for (let k: number = 0; k < glyphNames.length; k++) {
                            if (glyphNames[Number.parseInt(k.toString(), 10)] === standardGlyphName) {
                                glyphId = k;
                                break;
                            }
                        }
                    }
                }
                charCodeToGlyphId[Number.parseInt(charCode, 10)] = glyphId >= 0 ? glyphId : 0;
            }
        }
        return charCodeToGlyphId;
    }
    _createBuiltInEncoding(): void {
        const { charSet, encoding } = this.compactFont;
        if (!charSet || !encoding) {
            return;
        }
        const charSets: any = charSet.charSet; //eslint-disable-line
        const encodings: any = encoding.encoding; //eslint-disable-line
        const map: any[] = []; //eslint-disable-line
        const keys: any = Object.keys(encodings); //eslint-disable-line
        for (let i: number = 0; i < keys.length; i++) {
            const charCode: any = keys[Number.parseInt(i.toString(), 10)]; //eslint-disable-line
            const glyphId: number = encodings[Number.parseInt(charCode, 10)];
            if (glyphId >= 0) {
                const glyphName: any = charSets[glyphId]; //eslint-disable-line
                if (glyphName) {
                    map[Number(charCode)] = glyphName;
                }
            }
        }
        if (map.length > 0) {
            this._builtInEncoding = map;
        }
    }
}
