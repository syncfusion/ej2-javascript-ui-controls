import { _isCommand, _PdfCommand, _PdfDecryptStream, _PdfName } from '@syncfusion/ej2-pdf';
import { _PdfBinaryCharacterMapReader } from './binary-cmap-reader';
import { _getEncodingBase64String } from './font-utils';
import { _PdfLexicalOperator } from '@syncfusion/ej2-pdf';
import { _PdfStream } from '@syncfusion/ej2-pdf';
import { _PdfFlateStream } from '@syncfusion/ej2-pdf';
/**
 * Represents a character mapping used to translate character codes
 * to destination character sequences or CIDs.
 *
 * @private
 */
export class _PdfCharacterMap {
    /**
     * Code space ranges per byte-length.
     *
     * @private
     */
    _codeSpaceRanges: any; //eslint-disable-line
    /**
     * Number of code space ranges populated.
     *
     * @private
     */
    _numberOfCodeSpaceRanges: number;
    /**
     * Internal map from source code to destination value.
     *
     * @private
     */
    _map: any = []; //eslint-disable-line
    /**
     * CMap name when provided.
     *
     * @private
     */
    _name: string
    /**
     * Vertical writing mode flag for this CMap.
     *
     * @private
     */
    _vertical: boolean;
    /**
     * If this CMap is a built-in one.
     *
     * @private
     */
    _builtInCMap: any; //eslint-disable-line
    /**
     * Optional linked useCMap (extension map) for fallback mappings.
     *
     * @private
     */
    _useCMap: any; //eslint-disable-line
    /**
     * Maximum range size allowed when mapping ranges.
     *
     * @private
     */
    _maximumMapRange: number = 2 ** 24 - 1;
    constructor(builtInCMap: boolean = false) {
        this._codeSpaceRanges = [[], [], [], []];
        this._numberOfCodeSpaceRanges = 0;
        this._map = [];
        this._name = '';
        this._vertical = false;
        this._useCMap = null;
        this._builtInCMap = builtInCMap;
    }
    /**
     * Iterate over each mapped entry and invoke the callback.
     *
     * @private
     * @param {Function} callback Function called with `(key, value)` for each mapping.
     * @returns {void} nothing.
     */
    _forEach(callback: any) { //eslint-disable-line
        const map: any = this._map; //eslint-disable-line
        const length: number = map.length;
        if (length <= 0x10000) {
            for (let i: number = 0; i < length; i++) {
                if (typeof(map[Number.parseInt(i.toString(), 10)]) !== 'undefined') {
                    callback (i, map[Number.parseInt(i.toString(), 10)]);
                }
            }
        } else {
            let keys: any = Object.keys(map); //eslint-disable-line
            for (let k: number = 0; k < keys.length; k++) {
                const i: any = keys[Number.parseInt(k.toString(), 10)]; //eslint-disable-line
                callback(i, map[Number.parseInt(i.toString(), 10)]);
            }
        }
    }
    /**
     * Inserts a codespace range for the given byte-length.
     *
     * @private
     * @param {number} number Byte-length of codespace (1..4 typically).
     * @param {number} low Lower bound of the range.
     * @param {number} high Upper bound of the range.
     * @returns {void} nothing.
     */
    _insertCodeSpaceRange(number: number, low: number, high: number): void {
        this._codeSpaceRanges[number - 1].push(low, high);
        this._numberOfCodeSpaceRanges++;
    }
    /**
     * Maps a continuous source range to successive string destinations.
     *
     * @private
     * @param {number} low Starting source code.
     * @param {number} high Ending source code.
     * @param {any} destinationLow Destination string for the `low` code.
     * @returns {void} nothing.
     */
    _mapRangeToDestination(low: number, high: number, destinationLow: any): void { //eslint-disable-line
        if (high - low > this._maximumMapRange) {
            throw new Error('mapBfRange - ignoring data above _maximumMapRange.');
        }
        const lastByte: number = destinationLow.length - 1;
        while (low <= high) {
            this._map[low++] = destinationLow;
            const nextCharCode: number = destinationLow.charCodeAt(lastByte) + 1;
            if (nextCharCode > 0xff) {
                destinationLow = destinationLow.substring(0, lastByte - 1) + String.fromCharCode(destinationLow.charCodeAt(lastByte - 1) + 1) + '\x00';
                continue;
            }
            destinationLow = destinationLow.substring(0, lastByte) + String.fromCharCode(nextCharCode);
        }
    }
    /**
     * Maps a source range to a provided array of destination values.
     *
     * @private
     * @param {number} low Starting source code.
     * @param {number} high Ending source code.
     * @param {any} array Array of destination values corresponding to the range.
     * @returns {void} nothing.
     */
    _mapRangeToArray(low: number, high: number, array: any): void { //eslint-disable-line
        if (high - low > this._maximumMapRange) {
            throw new Error('mapBfRangeToArray - ignoring data above _maximumMapRange.');
        }
        const ii: number = array.length;
        let i: number = 0;
        while (low <= high && i < ii) {
            this._map[Number.parseInt(low.toString(), 10)] = array[i++];
            ++low;
        }
    }
    /**
     * Map a single source code to a destination value.
     *
     * @private
     * @param {any} source Source code key.
     * @param {any} destination Destination value to map to.
     * @returns {void} nothing.
     */
    _mapOne(source: any, destination: any): void { //eslint-disable-line
        this._map[Number.parseInt(source.toString(), 10)] = destination;
    }
    _lookup(code: any): void { //eslint-disable-line
        return this._map[Number.parseInt(code.toString(), 10)];
    }
    /**
     * Check whether a mapping exists for the given source code.
     *
     * @private
     * @param {any} code Source code to test.
     * @returns {boolean} True when a mapping exists.
     */
    _contains(code: any): any { //eslint-disable-line
        return this._map[Number.parseInt(code.toString(), 10)] !== undefined;
    }
    /**
     * Maps a contiguous range of CIDs to a contiguous destination range.
     * Throws when the requested range exceeds the internal maximum allowed span.
     *
     * @private
     * @param {number} low The starting source CID.
     * @param {number} high The ending source CID .
     * @param {number} destinationLow The starting destination CID to map .
     * @returns {void} nothing.
     * @throws {Error} If exceeds `_maximumMapRange`.
     */
    _mapCharacterIdentifierRange(low: number, high: number, destinationLow: number): void {
        if (high - low > this._maximumMapRange) {
            throw new Error('mapCidRange - ignoring data above _maximumMapRange.');
        }
        while (low <= high) {
            this._map[low++] = destinationLow++;
        }
    }
    /**
     * Reads a character code from a string at `offset` using the codespace ranges
     * and writes the `charcode` and `length` to the provided `out` object.
     *
     * @private
     * @param {any} text Source string to read from.
     * @param {any} offset Offset within the string to start reading.
     * @param {any} out Object that will receive `{ charcode, length }`.
     * @returns {void} nothing.
     */
    _readCharacterCodeFromString(text: any, offset: any, out: any): void { //eslint-disable-line
        let c: number = 0;
        const codespaceRanges: any = this._codeSpaceRanges; //eslint-disable-line
        for (let n: number = 0, nn: number = codespaceRanges.length; n < nn; n++) {
            c = ((c << 8) | text.charCodeAt(offset + n)) >>> 0;
            const codespaceRange: any = codespaceRanges[n]; //eslint-disable-line
            for (let k: number = 0, kk: number = codespaceRange.length; k < kk; ) {
                const low: number = codespaceRange[k++];
                const high: number = codespaceRange[k++];
                if (c >= low && c <= high) {
                    out.charcode = c;
                    out.length = n + 1;
                    return;
                }
            }
        }
        out.charcode = 0;
        out.length = 1;
    }
}
/**
 * Factory responsible for creating `_PdfCharacterMap` instances from CMap
 * sources.
 *
 * @private
 */
export class _PdfCharacterMapFactory {
    /**
     * Known compression types for CMap payloads.
     *
     * @private
     */
    _cmapCompressionType: any = { //eslint-disable-line
        NONE: 0,
        BINARY: 1
    };
    /**
     * List of built in CMap names used for standard PDF font encodings.
     *
     * @private
     */
    _builtInCharacterMap: any = [ //eslint-disable-line
        'Adobe-GB1-UCS2',
        'Adobe-CNS1-UCS2',
        'Adobe-Japan1-UCS2',
        'Adobe-Korea1-UCS2',
        '78-EUC-H',
        '78-EUC-V',
        '78-H',
        '78-RKSJ-H',
        '78-RKSJ-V',
        '78-V',
        '78ms-RKSJ-H',
        '78ms-RKSJ-V',
        '83pv-RKSJ-H',
        '90ms-RKSJ-H',
        '90ms-RKSJ-V',
        '90msp-RKSJ-H',
        '90msp-RKSJ-V',
        '90pv-RKSJ-H',
        '90pv-RKSJ-V',
        'Add-H',
        'Add-RKSJ-H',
        'Add-RKSJ-V',
        'Add-V',
        'Adobe-CNS1-0',
        'Adobe-CNS1-1',
        'Adobe-CNS1-2',
        'Adobe-CNS1-3',
        'Adobe-CNS1-4',
        'Adobe-CNS1-5',
        'Adobe-CNS1-6',
        'Adobe-GB1-0',
        'Adobe-GB1-1',
        'Adobe-GB1-2',
        'Adobe-GB1-3',
        'Adobe-GB1-4',
        'Adobe-GB1-5',
        'Adobe-Japan1-0',
        'Adobe-Japan1-1',
        'Adobe-Japan1-2',
        'Adobe-Japan1-3',
        'Adobe-Japan1-4',
        'Adobe-Japan1-5',
        'Adobe-Japan1-6',
        'Adobe-Korea1-0',
        'Adobe-Korea1-1',
        'Adobe-Korea1-2',
        'B5-H',
        'B5-V',
        'B5pc-H',
        'B5pc-V',
        'CNS-EUC-H',
        'CNS-EUC-V',
        'CNS1-H',
        'CNS1-V',
        'CNS2-H',
        'CNS2-V',
        'ETHK-B5-H',
        'ETHK-B5-V',
        'ETen-B5-H',
        'ETen-B5-V',
        'ETenms-B5-H',
        'ETenms-B5-V',
        'EUC-H',
        'EUC-V',
        'Ext-H',
        'Ext-RKSJ-H',
        'Ext-RKSJ-V',
        'Ext-V',
        'GB-EUC-H',
        'GB-EUC-V',
        'GB-H',
        'GB-V',
        'GBK-EUC-H',
        'GBK-EUC-V',
        'GBK2K-H',
        'GBK2K-V',
        'GBKp-EUC-H',
        'GBKp-EUC-V',
        'GBT-EUC-H',
        'GBT-EUC-V',
        'GBT-H',
        'GBT-V',
        'GBTpc-EUC-H',
        'GBTpc-EUC-V',
        'GBpc-EUC-H',
        'GBpc-EUC-V',
        'H',
        'HKdla-B5-H',
        'HKdla-B5-V',
        'HKdlb-B5-H',
        'HKdlb-B5-V',
        'HKgccs-B5-H',
        'HKgccs-B5-V',
        'HKm314-B5-H',
        'HKm314-B5-V',
        'HKm471-B5-H',
        'HKm471-B5-V',
        'HKscs-B5-H',
        'HKscs-B5-V',
        'Hankaku',
        'Hiragana',
        'KSC-EUC-H',
        'KSC-EUC-V',
        'KSC-H',
        'KSC-Johab-H',
        'KSC-Johab-V',
        'KSC-V',
        'KSCms-UHC-H',
        'KSCms-UHC-HW-H',
        'KSCms-UHC-HW-V',
        'KSCms-UHC-V',
        'KSCpc-EUC-H',
        'KSCpc-EUC-V',
        'Katakana',
        'NWP-H',
        'NWP-V',
        'RKSJ-H',
        'RKSJ-V',
        'Roman',
        'UniCNS-UCS2-H',
        'UniCNS-UCS2-V',
        'UniCNS-UTF16-H',
        'UniCNS-UTF16-V',
        'UniCNS-UTF32-H',
        'UniCNS-UTF32-V',
        'UniCNS-UTF8-H',
        'UniCNS-UTF8-V',
        'UniGB-UCS2-H',
        'UniGB-UCS2-V',
        'UniGB-UTF16-H',
        'UniGB-UTF16-V',
        'UniGB-UTF32-H',
        'UniGB-UTF32-V',
        'UniGB-UTF8-H',
        'UniGB-UTF8-V',
        'UniJIS-UCS2-H',
        'UniJIS-UCS2-HW-H',
        'UniJIS-UCS2-HW-V',
        'UniJIS-UCS2-V',
        'UniJIS-UTF16-H',
        'UniJIS-UTF16-V',
        'UniJIS-UTF32-H',
        'UniJIS-UTF32-V',
        'UniJIS-UTF8-H',
        'UniJIS-UTF8-V',
        'UniJIS2004-UTF16-H',
        'UniJIS2004-UTF16-V',
        'UniJIS2004-UTF32-H',
        'UniJIS2004-UTF32-V',
        'UniJIS2004-UTF8-H',
        'UniJIS2004-UTF8-V',
        'UniJISPro-UCS2-HW-V',
        'UniJISPro-UCS2-V',
        'UniJISPro-UTF8-V',
        'UniJISX0213-UTF32-H',
        'UniJISX0213-UTF32-V',
        'UniJISX02132004-UTF32-H',
        'UniJISX02132004-UTF32-V',
        'UniKS-UCS2-H',
        'UniKS-UCS2-V',
        'UniKS-UTF16-H',
        'UniKS-UTF16-V',
        'UniKS-UTF32-H',
        'UniKS-UTF32-V',
        'UniKS-UTF8-H',
        'UniKS-UTF8-V',
        'V',
        'WP-Symbol'
    ];
    /**
     * End-of-file marker used by CMap lexical parsing.
     *
     * @private
     */
    eof: string = 'EOF';
    /**
     * Create a `_PdfCharacterMap` from a name or stream encoding.
     *
     * @private
     * @param {any} encoding Name or stream containing the CMap data.
     * @param {Function} fetchBuiltInCharacterMap Callback to fetch built-in maps.
     * @param {any} _useCharacterMap Optional use-cmap name to extend from.
     * @returns {any} The parsed `_PdfCharacterMap` or `undefined` when not applicable.
     */
    _create(encoding: any, fetchBuiltInCharacterMap: any, _useCharacterMap: any): any { //eslint-disable-line
        let  parsedCharacterMap: any; //eslint-disable-line
        if (encoding instanceof _PdfName) {
            return this._createBuiltInCharacterMap(encoding.name, fetchBuiltInCharacterMap);
        } else if (encoding instanceof _PdfFlateStream) {
            const stream: any = encoding.stream; //eslint-disable-line
            if (stream instanceof _PdfStream || stream instanceof _PdfDecryptStream) {
                parsedCharacterMap = this._parseCharacterMap(new _PdfCharacterMap(), new _PdfLexicalOperator(encoding),
                                                             fetchBuiltInCharacterMap, _useCharacterMap);
            }
            return parsedCharacterMap;
        } else if (encoding instanceof _PdfStream) {
            parsedCharacterMap = this._parseCharacterMap(new _PdfCharacterMap(), new _PdfLexicalOperator(encoding),
                                                         fetchBuiltInCharacterMap, _useCharacterMap);
            return parsedCharacterMap;
        }
    }
    /**
     * Create a built in CMap by name.
     *
     * @private
     * @param {string} name Built-in CMap name.
     * @param {Function} fetchBuiltInCharacterMap Callback to fetch map data.
     * @returns {any} Parsed character map or the result of binary parsing.
     */
    _createBuiltInCharacterMap(name: string, fetchBuiltInCharacterMap: any): any { //eslint-disable-line
        if (name === 'Identity-H') {
            return new _PdfIdentityCharacterMap(false, 2);
        } else if (name === 'Identity-V') {
            return new _PdfIdentityCharacterMap(true, 2);
        }
        if (!this._builtInCharacterMap.includes(name)) {
            throw new Error('Unknown CMap name: ' + name);
        }
        const characterMapData: any = this._fetchCharacterMap(name); //eslint-disable-line
        const cMap: _PdfCharacterMap = new _PdfCharacterMap(true);
        if (characterMapData.isCompressed) {
            return new _PdfBinaryCharacterMapReader()._process(characterMapData.uint8Array, cMap, (useCMap: any) => //eslint-disable-line
                this._extendCMap(cMap, fetchBuiltInCharacterMap, useCMap)
            );
        }
        //throw new Error(`Invalid CMap 'compressionType' value: ${compressionType}`);
    }
    /**
     * Fetch built-in character map data (base64) and return a byte array.
     *
     * @private
     * @param {string} name Name of the built-in CMap.
     * @returns {any} Object containing `uint8Array` and `isCompressed` flag.
     */
    _fetchCharacterMap(name: string): any { //eslint-disable-line
        const base64String: string = _getEncodingBase64String(name).replace(/^data:.+;base64,/, '');
        const uint8Array: Uint8Array = this._base64ToUnSigned8Array(base64String);
        const isCompressed: boolean = true;
        const data: any = {uint8Array, isCompressed}; //eslint-disable-line
        return data;
    }
    /**
     * Decode a base64 string into a `Uint8Array`.
     *
     * @private
     * @param {string} base64String Base64 encoded string.
     * @returns {Uint8Array} Decoded bytes.
     */
    _base64ToUnSigned8Array(base64String: string): Uint8Array {
        const binaryString: string = atob(base64String);
        const uint8Array: Uint8Array = new Uint8Array(binaryString.length);
        for (let i: number = 0; i < binaryString.length; i++) {
            uint8Array[Number.parseInt(i.toString(), 10)] = binaryString.charCodeAt(i);
        }
        return uint8Array;
    }
    /**
     * Parse a textual CMap definition from the provided lexer and populate
     * the supplied `characterMap`.
     *
     * @private
     * @param {any} characterMap The `_PdfCharacterMap` to populate.
     * @param {_PdfLexicalOperator} lexer Lexical operator instance for reading tokens.
     * @param {Function} fetchBuiltInCMap Callback used to fetch built-in maps.
     * @param {any} _useCharacterMap Optional CMap name to extend from.
     * @returns {any} The populated character map or an extended map when `useCMap` used.
     */
    _parseCharacterMap(characterMap: any, lexer: _PdfLexicalOperator, fetchBuiltInCMap: any, _useCharacterMap: any): any { //eslint-disable-line
        let previous: any; //eslint-disable-line
        let embeddedUseCMap: any; //eslint-disable-line
        while (true) { //eslint-disable-line 
            try {
                const obj: any = lexer.getObject(); //eslint-disable-line
                if (obj === this.eof) {
                    break;
                } else if (obj instanceof _PdfName) {
                    if (obj.name === 'WMode') {
                        this._parseWritingMode(characterMap, lexer);
                    } else if (obj.name === 'CMapName') {
                        this._parseCharacterMapName(characterMap, lexer);
                    }
                    previous = obj;
                } else if (obj instanceof _PdfCommand) {
                    switch (obj.command) {
                    case 'endcmap':
                        break;
                    case 'usecmap':
                        if (previous instanceof _PdfName) {
                            embeddedUseCMap = previous.name;
                        }
                        break;
                    case 'begincodespacerange':
                        this._parseCodeSpaceRange(characterMap, lexer);
                        break;
                    case 'beginbfchar':
                        this._parseBaseFontCharacter(characterMap, lexer);
                        break;
                    case 'begincidchar':
                        this._processCharacterMapping(characterMap, lexer);
                        break;
                    case 'beginbfrange':
                        this._mapBaseFontRange(characterMap, lexer);
                        break;
                    case 'begincidrange':
                        this._parseCharacterIdentifierRange(characterMap, lexer);
                        break;
                    }
                }
            } catch (ex) {
                continue;
            }
        }
        if (!_useCharacterMap && embeddedUseCMap) {
            _useCharacterMap = embeddedUseCMap;
        }
        if (_useCharacterMap) {
            return this._extendCMap(characterMap, fetchBuiltInCMap, _useCharacterMap);
        }
        return characterMap;
    }
    /**
     * Convert a string of bytes (each char treated as a byte) to an integer.
     *
     * @private
     * @param {string} text Input string containing byte values.
     * @returns {number} Unsigned integer representation.
     */
    _stringToInt(text: string): number {
        let a: number = 0;
        for (let i: number = 0; i < text.length; i++) {
            a = (a << 8) | text.charCodeAt(i);
        }
        return a >>> 0;
    }
    /**
     * Validate that the provided object is a string. Throws when not.
     *
     * @private
     * @param {any} object Object to validate.
     * @returns {void} nothing.
     */
    _validateString(object: any): void { //eslint-disable-line
        if (typeof object !== 'string') {
            throw new Error('Malformed CMap: expected string.');
        }
    }
    /**
     * Validate that the provided object is an integer. Throws when not.
     *
     * @private
     * @param {any} object Object to validate as integer.
     * @returns {void} nothing.
     */
    _expectInt(object: any): void { //eslint-disable-line
        if (!Number.isInteger(object)) {
            throw new Error('Malformed CMap: expected int.');
        }
    }
    /**
     * Parse `beginbfchar`/`endbfchar` blocks mapping single source codes
     * to destination strings.
     *
     * @private
     * @param {any} characterMap Target character map to populate.
     * @param {_PdfLexicalOperator} lexer Token reader for the CMap stream.
     * @returns {void} nothing.
     */
    _parseBaseFontCharacter(characterMap: any, lexer: _PdfLexicalOperator): void { //eslint-disable-line
        while (true) { // eslint-disable-line
            let obj: any = lexer.getObject(); //eslint-disable-line
            if (obj === this.eof) {
                break;
            }
            if (_isCommand(obj, 'endbfchar')) {
                return;
            }
            this._validateString(obj);
            const source: number = this._stringToInt(obj);
            obj = lexer.getObject();
            this._validateString(obj);
            const destination: any = obj; //eslint-disable-line
            characterMap._mapOne(source, destination);
        }
    }
    /**
     * Parse `beginbfrange` blocks mapping source ranges to destinations.
     *
     * @private
     * @param {_PdfCharacterMap} cMap Target character map.
     * @param {_PdfLexicalOperator} lexer Lexer providing tokens.
     * @returns {void} nothing.
     */
    _mapBaseFontRange(cMap: _PdfCharacterMap, lexer: _PdfLexicalOperator): void {
        while (true) { // eslint-disable-line
            let obj: any = lexer.getObject(); //eslint-disable-line
            if (obj === this.eof) {
                break;
            }
            if (_isCommand(obj, 'endbfrange')) {
                return;
            }
            this._validateString(obj);
            const low: number = this._stringToInt(obj);
            obj = lexer.getObject();
            this._validateString(obj);
            const high: number = this._stringToInt(obj);
            obj = lexer.getObject();
            if (Number.isInteger(obj) || typeof obj === 'string') {
                const dstLow: any = Number.isInteger(obj) ? String.fromCharCode(obj) : obj; //eslint-disable-line
                cMap._mapRangeToDestination(low, high, dstLow);
            } else if (_isCommand(obj, '[')) {
                obj = lexer.getObject();
                const array: any[] = []; //eslint-disable-line
                while (!_isCommand(obj, ']') && obj !== this.eof) {
                    array.push(obj);
                    obj = lexer.getObject();
                }
                cMap._mapRangeToArray(low, high, array);
            } else {
                break;
            }
        }
    }
    /**
     * Parse `begincidchar` blocks mapping CIDs to integers.
     *
     * @private
     * @param {any} characterMap Target character map.
     * @param {_PdfLexicalOperator} lexer Lexer for reading tokens.
     * @returns {void} nothing.
     */
    _processCharacterMapping(characterMap: any, lexer: _PdfLexicalOperator): void { //eslint-disable-line
        while (true) { // eslint-disable-line
            let obj: any = lexer.getObject(); //eslint-disable-line
            if (obj === this.eof) {
                break;
            }
            if (_isCommand(obj, 'endcidchar')) {
                return;
            }
            this._validateString(obj);
            const src: number = this._stringToInt(obj);
            obj = lexer.getObject();
            this._expectInt(obj);
            const dst: any = obj; //eslint-disable-line
            characterMap._mapOne(src, dst);
        }
    }
    /**
     * Parse `begincidrange` blocks mapping code ranges to CID ranges.
     *
     * @private
     * @param {any} characterMap Target character map.
     * @param {any} lexer Lexer-like object providing `getObj`.
     * @returns {void} nothing.
     */
    _parseCharacterIdentifierRange(characterMap: any, lexer: any): any { // eslint-disable-line
        while (true) { // eslint-disable-line
            let obj: any = lexer.getObj(); //eslint-disable-line
            if (obj === this.eof) {
                break;
            }
            if (_isCommand(obj, 'endcidrange')) {
                return;
            }
            this._validateString(obj);
            const low: number = this._stringToInt(obj);
            obj = lexer.getObj();
            this._validateString(obj);
            const high: number = this._stringToInt(obj);
            obj = lexer.getObj();
            this._expectInt(obj);
            const dstLow: any = obj; // eslint-disable-line
            characterMap._mapCharacterIdentifierRange(low, high, dstLow);
        }
    }
    /**
     * Parse `begincodespacerange` blocks and insert codespace ranges.
     *
     * @private
     * @param {_PdfCharacterMap} characterMap Target character map.
     * @param {_PdfLexicalOperator} lexer Lexer for reading tokens.
     * @returns {void} nothing.
     */
    _parseCodeSpaceRange(characterMap: _PdfCharacterMap, lexer: _PdfLexicalOperator): void {
        while (true) { // eslint-disable-line
            let obj: any = lexer.getObject(); //eslint-disable-line
            if (obj === this.eof) {
                break;
            }
            if (_isCommand(obj, 'endcodespacerange')) {
                return;
            }
            if (typeof obj !== 'string') {
                break;
            }
            const low: number = this._stringToInt(obj);
            obj = lexer.getObject();
            if (typeof obj !== 'string') {
                break;
            }
            const high: number = this._stringToInt(obj);
            characterMap._insertCodeSpaceRange(obj.length, low, high);
        }
    }
    /**
     * Parse the writing mode (`WMode`) entry and set vertical mode on the map.
     *
     * @private
     * @param {any} cMap Target character map.
     * @param {_PdfLexicalOperator} lexer Lexer providing the next token.
     * @returns {void} nothing.
     */
    _parseWritingMode(cMap: any, lexer: _PdfLexicalOperator): void { //eslint-disable-line
        const obj: any = lexer.getObject(); //eslint-disable-line
        if (Number.isInteger(obj)) {
            cMap.vertical = obj;
        }
    }
    /**
     * Parse the `CMapName` entry from the lexer and set the name.
     *
     * @private
     * @param {any} characterMap Target character map.
     * @param {_PdfLexicalOperator} lexer Lexer providing tokens.
     * @returns {void} nothing.
     */
    _parseCharacterMapName(characterMap:any, lexer: _PdfLexicalOperator): void { //eslint-disable-line
        const obj: any = lexer.getObject(); //eslint-disable-line
        if (obj instanceof _PdfName) {
            characterMap.name = obj.name;
        }
    }
    /**
     * Extend a parsed character map with a built-in useCMap fallback.
     *
     * @private
     * @param {any} characterMap Target character map to extend.
     * @param {Function} fetchBuiltInCMap Callback to fetch built-in maps.
     * @param {any} _useCharacterMap Name of the useCMap to extend from.
     * @returns {any} The extended character map.
     */
    _extendCMap(characterMap: any, fetchBuiltInCMap: any, _useCharacterMap: any): any { //eslint-disable-line
        characterMap.useCMap = this._createBuiltInCharacterMap(_useCharacterMap, fetchBuiltInCMap);
        if (characterMap.numCodespaceRanges === 0) {
            const useCodespaceRanges: any = characterMap.useCMap.codespaceRanges; // eslint-disable-line
            for (let i: number = 0; i < useCodespaceRanges.length; i++) {
                characterMap.codespaceRanges[Number.parseInt(i.toString(), 10)] = useCodespaceRanges[Number.parseInt(i.toString(), 10)].
                    slice();
            }
            characterMap.numCodespaceRanges = characterMap.useCMap.numCodespaceRanges;
        }
        characterMap.useCMap.forEach((key: any, value: any)  => { //eslint-disable-line
            if (!characterMap._contains(key)) {
                characterMap._mapOne(key, characterMap.useCMap.lookup(key));
            }
        });
        return characterMap;
    }
}
/**
 * Identity CMap that maps code points to themselves (horizontal/vertical).
 *
 * @private
 */
export class _PdfIdentityCharacterMap extends _PdfCharacterMap {
    /**
     * Creates an identity map and sets full 16 bit codespace.
     *
     * @private
     * @param {boolean} vertical Whether the map is vertical.
     * @param {any} count Internal codespace index. // eslint-disable-line
     */
    constructor(vertical: boolean, count: any) { //eslint-disable-line
        super();
        this._vertical = vertical;
        this._insertCodeSpaceRange(count, 0, 0xffff);
    }
    /**
     * Adds a codespace range [low, high] at the given slot.
     *
     * @private
     * @param {number} count Slot index.
     * @param {number} low Range start.
     * @param {number} high Range end.
     * @returns {void} nothing.
     */
    _insertCodeSpaceRange(count: number, low: number, high: number): void {
        this._codeSpaceRanges[count - 1].push(low, high);
        this._numberOfCodeSpaceRanges++;
    }
    /**
     * Looks up a code; returns it if within 0x0000–0xFFFF.
     *
     * @private
     * @param {any} code Input code. // eslint-disable-line
     * @returns {any} Code or `undefined`. // eslint-disable-line
     */
    _lookup(code: any): any { //eslint-disable-line
        return Number.isInteger(code) && code <= 0xffff ? code : undefined;
    }
    /**
     * Checks if the code is a valid 16‑bit value.
     *
     * @private
     * @param {any} code Input code. // eslint-disable-line
     * @returns {boolean} True if valid; otherwise false.
     */
    _contains(code: any): boolean{ //eslint-disable-line
        return Number.isInteger(code) && code <= 0xffff;
    }
    /**
     * Returns the char code for a value or -1 if invalid.
     *
     * @private
     * @param {any} value Input value. // eslint-disable-line
     * @returns {any} Code or -1. // eslint-disable-line
     */
    _charCodeOf(value: any): any { //eslint-disable-line
        return Number.isInteger(value) && value <= 0xffff ? value : -1;
    }
    /* eslint-disable */
    /**
     * Returns the char code for a value or -1 if invalid.
     *
     * @private
     * @param {any} callback Input value.
     */
    _forEach(callback: any) {
        for (let i: number = 0; i <= 0xffff; i++) {
            callback(i, i);
        }
    }
    /* eslint-enable */
}
