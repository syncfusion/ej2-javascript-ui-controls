import { _PdfStream } from './base-stream';
import { _PdfDictionary, _PdfReferenceSet, _isCommand, _PdfReference, _PdfCommand, _PdfName } from './pdf-primitives';
import { BaseException, FormatError, _escapePdfName, _bytesToString, ParserEndOfFileException, _numberToString, _stringToPdfString, _stringToBigEndianBytes, _getSize, _compressStream, _hasUnicodeCharacters, _stringToBytes, _byteArrayToHexString } from './utils';
import { _PdfParser, _PdfLexicalOperator } from './pdf-parser';
import { _PdfBaseStream } from './base-stream';
import { PdfCrossReferenceType } from './enumerator';
import { PdfDocument } from './pdf-document';
import { _PdfEncryptor } from './security/encryptor';
import { _PdfSignatureDictionary } from './security/digital-signature/signature/signature-dictionary';
import { PdfSignature } from './security/digital-signature/signature/pdf-signature';
import { _CipherTransform } from './security/encryptors/cipher-tranform';
import { _MD5 } from './security/encryptors/messageDigest5';
/**
 * Manages PDF cross-reference tables and streams, object lookup, and saving operations.
 *
 * @private
 */
export class _PdfCrossReference {
    /**
     * Chunks of output bytes used during saving.
     *
     * @private
     */
    _uint8Chunks: Array<Uint8Array> = [];
    /**
     * Underlying PDF stream for reading/writing objects.
     *
     * @private
     */
    _stream: _PdfStream;
    /**
     * Pending references used to detect circular references during fetch.
     *
     * @private
     */
    _pendingRefs: _PdfReferenceSet;
    /**
     * Array of object information entries representing the XRef table or stream.
     *
     * @private
     */
    _entries: _PdfObjectInformation[];
    /**
     * Map of known cross-reference positions.
     *
     * @private
     */
    _crossReferencePosition: any; // eslint-disable-line
    /**
     * Cache map of indirect references to parsed objects.
     *
     * @private
     */
    _cacheMap: Map<_PdfReference, any>; // eslint-disable-line
    /**
     * Queue of startxref positions to parse.
     *
     * @private
     */
    _startXRefQueue: number[];
    /**
     * Trailer dictionary parsed from the PDF.
     *
     * @private
     */
    _trailer: _PdfDictionary;
    /**
     * Root (catalog) dictionary of the PDF.
     *
     * @private
     */
    _root: _PdfDictionary;
    /**
     * Top dictionary discovered while reading XRef structures.
     *
     * @private
     */
    _topDictionary: _PdfDictionary;
    /**
     * State used while parsing an XRef table.
     *
     * @private
     */
    _tableState: _PdfCrossTableState;
    /**
     * State used while parsing an XRef stream.
     *
     * @private
     */
    _streamState: _PdfStreamState;
    /**
     * Previous startxref offset.
     *
     * @private
     */
    _prevStartXref: number;
    /**
     * PDF version string written on save.
     *
     * @private
     */
    _version: string = '';
    /**
     * Next object reference number to assign when saving.
     *
     * @private
     */
    _nextReferenceNumber: number;
    /**
     * Line separator used in output.
     *
     * @private
     */
    _newLine: string = '\r\n';
    /**
     * Owning document.
     *
     * @private
     */
    _document: PdfDocument;
    /**
     * Whether catalog updates are allowed during save.
     *
     * @private
     */
    _allowCatalog: boolean;
    /**
     * Password provided for encrypted documents.
     *
     * @private
     */
    _password: string;
    /**
     * Encryptor instance when document is encrypted.
     *
     * @private
     */
    _encrypt: _PdfEncryptor;
    /**
     * Document ID array from the trailer.
     *
     * @private
     */
    _ids: string[];
    /**
     * Permission flags from the encryption dictionary.
     *
     * @private
     */
    _permissionFlags: number;
    /**
     * Previous XRef offset.
     *
     * @private
     */
    _prevXRefOffset: number;
    /**
     * Index array used when writing XRef streams.
     *
     * @private
     */
    _indexes: Array<number>;
    /**
     * Collection of archived object streams.
     *
     * @private
     */
    _objectStreamCollection: Map<_PdfReference, _PdfArchievedStream>;
    /**
     * Offsets of objects written when saving.
     *
     * @private
     */
    _offsets: Array<number>;
    /**
     * Map of offset references to assist table writing.
     *
     * @private
     */
    _offsetReference: Map<_PdfReference, any>; // eslint-disable-line
    /**
     * Current write object stream when saving as stream format.
     *
     * @private
     */
    _objectStream: _PdfArchievedStream;
    /**
     * Current length written so far during save.
     *
     * @private
     */
    _currentLength: number;
    /**
     * Buffer length used while saving.
     *
     * @private
     */
    _bufferLength: number = 0;
    /**
     * Whether decoder (image extraction) is supported.
     *
     * @private
     */
    _isDecoderSupport: boolean = false;
    /**
     * Signature dictionary used during saving.
     *
     * @private
     */
    _signature: _PdfSignatureDictionary;
    /**
     * Collection of signatures present in the document.
     *
     * @private
     */
    _signatureCollection: PdfSignature[] = [];
    /**
     * Whether cross reference is written as table.
     *
     * @private
     */
    _isCrossReferenceTable: boolean = false;
    /**
     * Whether cross reference is written as stream.
     *
     * @private
     */
    _isCrossReferenceStream: boolean = false;
    _objectCollection: _PdfMainObjectCollection;
    constructor(document: PdfDocument, password?: string) {
        this._password = password;
        this._document = document;
        this._stream = document._stream;
        this._entries = [];
        this._crossReferencePosition = Object.create(null);
        this._cacheMap = new Map<_PdfReference, any>(); // eslint-disable-line
        this._offsetReference = new Map<_PdfReference, any>(); // eslint-disable-line
        this._pendingRefs = new _PdfReferenceSet();
        this._offsets = [];
    }
    /**
     * Sets the starting XRef position for parsing.
     *
     * @private
     * @param {number} startXRef - The startxref offset to parse.
     * @returns {void} nothing.
     */
    _setStartXRef(startXRef: number): void {
        this._startXRefQueue = [startXRef];
        this._prevStartXref = startXRef;
        if (typeof this._prevXRefOffset === 'undefined' || this._prevXRefOffset === null) {
            this._prevXRefOffset = startXRef;
        }
    }
    /**
     * Parses cross-reference structures and initializes trailer/root state.
     *
     * @private
     * @param {boolean} recoveryMode - If true, uses fallback indexing.
     * @returns {void} nothing.
     */
    _parse(recoveryMode: boolean): void {
        let trailerDictionary: _PdfDictionary;
        if (!recoveryMode) {
            trailerDictionary = this._readXRef();
        } else {
            trailerDictionary = this._indexObjects();
        }
        trailerDictionary.assignXref(this);
        const entrySize: number = trailerDictionary.get('Size');
        if (this._entries.length < entrySize || this._entries.length === entrySize) {
            this._nextReferenceNumber = entrySize;
        } else if (this._entries.length > entrySize) {
            this._nextReferenceNumber = this._entries.length > 0 ? this._entries.length : 1;
        }
        this._trailer = trailerDictionary;
        const encrypt: _PdfDictionary = trailerDictionary.get('Encrypt');
        if (encrypt) {
            this._document._isEncrypted = true;
            this._ids = trailerDictionary.get('ID');
            this._permissionFlags = encrypt.get('P');
            const fileId: string = this._ids && this._ids.length ? this._ids[0] : '';
            encrypt.suppressEncryption = true;
            this._encrypt = new _PdfEncryptor(encrypt, fileId, this._password);
            this._document._isUserPassword = this._encrypt._isUserPassword;
            this._document._encryptOnlyAttachment = this._encrypt._encryptOnlyAttachment;
            if (this._document._encryptOnlyAttachment) {
                this._document.fileStructure.isIncrementalUpdate = false;
            }
            if (this._document.fileStructure.isIncrementalUpdate) {
                this._document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
            } else {
                this._document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
            }
            if (this._encrypt._encryptOnlyAttachment) {
                this._document._hasUserPasswordOnly = true;
                this._document._encryptMetaData = false;
            } else {
                this._document._hasUserPasswordOnly = this._encrypt._hasUserPasswordOnly;
                this._document._encryptMetaData = encrypt.has('EncryptMetadata') ? encrypt.get('EncryptMetadata') : true;
            }
        }
        let hasRoot: boolean = false;
        let root: _PdfDictionary;
        try {
            root = trailerDictionary.get('Root');
        }
        catch (e) {
            throw new BaseException('Invalid cross reference', 'XRefParseException');
        }
        if (root) {
            try {
                const pagesEntry: _PdfDictionary = root.get('Pages');
                if (pagesEntry) {
                    this._root = root;
                    hasRoot = true;
                }
            }
            catch (ex) {
                throw new BaseException('Invalid cross reference', 'InvalidXRef');
            }
        }
        if (!hasRoot) {
            if (!recoveryMode) {
                throw new BaseException ('Invalid cross reference', 'XRefParseException');
            } else {
                throw new BaseException('Invalid cross reference', 'InvalidXRef');
            }
        }
    }
    /**
     * Gets the XRef entry information for the given object index.
     *
     * @private
     * @param {number} i - Object number index.
     * @returns {_PdfObjectInformation|null} Entry info or null.
     */
    _getEntry(i: number): _PdfObjectInformation {
        const xrefEntry: _PdfObjectInformation = this._entries[i]; // eslint-disable-line
        if (xrefEntry && !xrefEntry.free && xrefEntry.offset) {
            return xrefEntry;
        }
        return null;
    }
    /**
     * Fetches an indirect object by reference, handling caching and circular refs.
     *
     * @private
     * @param {_PdfReference} ref - Indirect reference to fetch.
     * @param {boolean} [suppressEncryption] - Whether to suppress decryption.
     * @returns {any} The fetched object.
     */
    _fetch(ref: _PdfReference, suppressEncryption?: boolean): any { // eslint-disable-line
        let entry: any; // eslint-disable-line
        if (!(ref instanceof _PdfReference)) {
            throw new Error('ref object is not a reference');
        }
        const objectNumber: number = ref.objectNumber;
        const cacheEntry: any = this._cacheMap.get(ref); // eslint-disable-line
        if (typeof cacheEntry !== 'undefined') {
            if (cacheEntry instanceof _PdfDictionary && !cacheEntry.objId) {
                cacheEntry.objId = objectNumber;
            }
            return cacheEntry;
        }
        const xrefEntry: _PdfObjectInformation = this._getEntry(objectNumber);
        if (xrefEntry === null) {
            this._cacheMap.set(ref, xrefEntry);
            return xrefEntry;
        }
        if (this._pendingRefs.has(ref)) {
            this._pendingRefs.remove(ref);
            throw new Error('circular reference');
        }
        this._pendingRefs.put(ref);
        try {
            if (xrefEntry.uncompressed) {
                entry = this._fetchUncompressed(ref, xrefEntry, suppressEncryption);
            } else {
                entry = this._fetchCompressed(ref, xrefEntry);
            }
            this._pendingRefs.remove(ref);
        } catch (ex) {
            this._pendingRefs.remove(ref);
            throw ex;
        }
        return entry;
    }
    /**
     * Fetches an uncompressed object from the file stream.
     *
     * @private
     * @param {_PdfReference} reference - Reference to the object.
     * @param {_PdfObjectInformation} xrefEntry - XRef entry describing the object.
     * @param {boolean} [makeFilter] - Whether to apply stream filters.
     * @returns {any} The parsed object.
     */
    _fetchUncompressed(reference: _PdfReference, xrefEntry: _PdfObjectInformation, makeFilter?: boolean): any { // eslint-disable-line
        const generationNumber: number = reference.generationNumber;
        const objectNumber: number = reference.objectNumber;
        if (xrefEntry.gen !== generationNumber) {
            throw new BaseException(`Inconsistent generation in XRef: ${reference}`, 'XRefEntryException');
        }
        const stream: _PdfStream = this._stream.makeSubStream(xrefEntry.offset + this._stream.start, undefined);
        const parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(stream), this, true, false, this._encrypt);
        parser._isImageExtraction = this._isDecoderSupport;
        const obj1: number = parser.getObject();
        const obj2: number = parser.getObject();
        const obj3: _PdfCommand = parser.getObject();
        if (obj1 !== objectNumber || obj2 !== generationNumber || typeof obj3 === 'undefined') {
            throw new BaseException(`Bad (uncompressed) XRef entry: ${reference}`, 'XRefEntryException');
        }
        let entry: any; // eslint-disable-line
        if (this._encrypt && !makeFilter) {
            entry = parser.getObject(reference.objectNumber, reference.generationNumber, true);
        } else {
            entry = parser.getObject(null, makeFilter);
        }
        if (!(entry instanceof _PdfBaseStream)) {
            this._cacheMap.set(reference, entry);
        }
        if (entry instanceof _PdfDictionary) {
            entry.objId = reference.toString();
        } else if (entry instanceof _PdfBaseStream) {
            entry.dictionary.objId = reference.toString();
        }
        return entry;
    }
    /**
     * Fetches an object stored inside an object stream (ObjStm).
     *
     * @private
     * @param {_PdfReference} ref - Reference to fetch.
     * @param {_PdfObjectInformation} xrefEntry - XRef entry for the object.
     * @returns {any} The fetched object.
     */
    _fetchCompressed(ref: _PdfReference, xrefEntry: _PdfObjectInformation): any { // eslint-disable-line
        const tableOffset: number = xrefEntry.offset;
        const stream: _PdfStream = this._fetch(_PdfReference.get(tableOffset, 0));
        if (typeof stream === 'undefined') {
            throw new FormatError('bad ObjStm stream');
        }
        const first: number = stream.dictionary.get('First');
        const n: number = stream.dictionary.get('N');
        const gen: number = ref.generationNumber;
        if (!Number.isInteger(first) || !Number.isInteger(n)) {
            throw new FormatError('invalid first and n parameters for ObjStm stream');
        }
        let parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(stream), this, true);
        parser._isImageExtraction = this._isDecoderSupport;
        const nums: Array<number> = new Array<number>(n);
        const offsets: Array<number> = new Array<number>(n);
        for (let i: number = 0; i < n; ++i) {
            const value: number = parser.getObject();
            if (!Number.isInteger(value)) {
                throw new FormatError(
                    `invalid object number in the ObjStm stream: ${value}`
                );
            }
            const offset: number = parser.getObject();
            if (!Number.isInteger(offset)) {
                throw new FormatError(
                    `invalid object offset in the ObjStm stream: ${offset}`
                );
            }
            nums[i] = value; // eslint-disable-line
            offsets[i] = offset; // eslint-disable-line
        }
        const start: number = (stream.start || 0) + first;
        const entries: Array<any> = new Array<any>(n); // eslint-disable-line
        for (let i: number = 0; i < n; ++i) {
            const length: number = (i < n - 1 ? (offsets[i + 1] - offsets[i]) : undefined); // eslint-disable-line
            if (length < 0) {
                throw new FormatError('Invalid offset in the ObjStm stream.');
            }
            parser = new _PdfParser(new _PdfLexicalOperator(stream.makeSubStream(start + offsets[i], length, stream.dictionary)), this, true); // eslint-disable-line
            const obj: any = parser.getObject(); // eslint-disable-line
            entries[i] = obj; // eslint-disable-line
            if (obj instanceof _PdfBaseStream) {
                continue;
            }
            const value: number = nums[i]; // eslint-disable-line
            const entry: _PdfObjectInformation = this._entries[value]; // eslint-disable-line
            if (entry && entry.offset === tableOffset && entry.gen === i) {
                const objId: string = `${value} ${gen}`;
                this._cacheMap.set(_PdfReference.get(value, gen), obj);
                if (obj instanceof _PdfDictionary) {
                    obj.objId = objId;
                }
            }
        }
        const result: any = entries[xrefEntry.gen]; // eslint-disable-line
        if (typeof result === 'undefined') {
            throw new BaseException(`Bad (compressed) XRef entry: ${ref}`, 'XRefEntryException');
        }
        return result;
    }
    /**
     * Reads cross-reference structures (table/stream) starting from queued offsets.
     *
     * @private
     * @param {boolean} [recoveryMode=false] - If true, tries heuristic indexing.
     * @returns {_PdfDictionary} The trailer dictionary.
     */
    _readXRef(recoveryMode: boolean = false): _PdfDictionary {
        const stream: _PdfStream = this._stream;
        const startXRefParsedCache: Set<number> = new Set<number>();
        try {
            while (this._startXRefQueue.length) {
                const startXRef: number = this._startXRefQueue[0];
                if (this._prevStartXref < startXRef) {
                    this._prevStartXref = startXRef;
                }
                if (startXRefParsedCache.has(startXRef)) {
                    this._startXRefQueue.shift();
                    continue;
                }
                startXRefParsedCache.add(startXRef);
                stream.position = startXRef + stream.start;
                const parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(stream), this, true);
                let obj: any = parser.getObject(); // eslint-disable-line
                let dictionary: _PdfDictionary;
                if (_isCommand(obj, 'xref')) {
                    if (typeof this._document._fileStructure._crossReferenceType === 'undefined') {
                        this._document._fileStructure._crossReferenceType = PdfCrossReferenceType.table;
                        this._isCrossReferenceTable = true;
                    }
                    dictionary = this._processXRefTable(parser);
                    if (!this._topDictionary) {
                        this._topDictionary = dictionary;
                    }
                    obj = dictionary.get('XRefStm');
                    if (Number.isInteger(obj)) {
                        const position: any = obj; // eslint-disable-line
                        if (!(position in this._crossReferencePosition)) {
                            this._crossReferencePosition[position] = 1; // eslint-disable-line
                            this._startXRefQueue.push(position);
                        }
                    }
                } else if (Number.isInteger(obj)) {
                    if (typeof this._document._fileStructure._crossReferenceType === 'undefined') {
                        this._document._fileStructure._crossReferenceType = PdfCrossReferenceType.stream;
                        this._isCrossReferenceStream = true;
                    }
                    const gen: number = parser.getObject();
                    const command: _PdfCommand = parser.getObject();
                    obj = parser.getObject();
                    if (typeof gen === 'undefined' ||
                        !Number.isInteger(gen) ||
                        !_isCommand(command, 'obj') ||
                        !(obj instanceof _PdfBaseStream)) {
                        throw new FormatError('Invalid cross reference stream');
                    }
                    dictionary = this._processXRefStream(obj as _PdfStream);
                    if (!this._topDictionary) {
                        this._topDictionary = dictionary;
                    }
                    if (!dictionary) {
                        throw new FormatError('Failed to read XRef stream');
                    }
                } else {
                    throw new FormatError('Invalid XRef stream header');
                }
                obj = dictionary.get('Prev');
                if (Number.isInteger(obj)) {
                    this._startXRefQueue.push(obj);
                } else if (obj instanceof _PdfReference) {
                    this._startXRefQueue.push(obj.objectNumber);
                }
                this._startXRefQueue.shift();
            }
            const startXRefParsed: number[] = [];
            startXRefParsedCache.forEach((value: number) => startXRefParsed.push(value));
            this._document._startXRefParsedCache = startXRefParsed;
            return this._topDictionary;
        } catch (e) {
            this._startXRefQueue.shift();
        }
        if (recoveryMode) {
            return undefined;
        }
        throw new BaseException('Invalid cross reference', 'XRefParseException');
    }
    /**
     * Reads a token string from a byte buffer starting at offset.
     *
     * @private
     * @param {Uint8Array} data - Buffer to read from.
     * @param {number} offset - Start offset.
     * @returns {string} The token read.
     */
    _readToken(data: Uint8Array, offset: number): string {
        const lf: number = 0xa;
        const cr: number = 0xd;
        const lt: number = 0x3c;
        let token: string = '';
        let ch: number = data[offset]; // eslint-disable-line
        while (ch !== lf && ch !== cr && ch !== lt) {
            if (++offset >= data.length) {
                break;
            }
            token += String.fromCharCode(ch);
            ch = data[offset]; // eslint-disable-line
        }
        return token;
    }
    /**
     * Skips bytes until the given sequence is found.
     *
     * @private
     * @param {Uint8Array} data - Buffer to search.
     * @param {number} offset - Starting offset.
     * @param {Uint8Array} what - Sequence to find.
     * @returns {number} Number of bytes skipped.
     */
    _skipUntil(data: Uint8Array, offset: number, what: Uint8Array): number {
        const length: number = what.length;
        const dataLength: number = data.length;
        let skipped: number = 0;
        while (offset < dataLength) {
            let i: number = 0;
            while (i < length && data[offset + i] === what[i]) { // eslint-disable-line
                ++i;
            }
            if (i >= length) {
                break;
            }
            offset++;
            skipped++;
        }
        return skipped;
    }
    /**
     * Indexes objects by scanning the entire PDF stream when no valid XRef exists.
     *
     * @private
     * @returns {_PdfDictionary} Best trailer dictionary found.
     */
    _indexObjects(): _PdfDictionary {
        const tab: number = 0x9;
        const lf: number = 0xa;
        const cr: number = 0xd;
        const space: number = 0x20;
        const percent: number = 0x25;
        const objRegExp: RegExp = /^(\d+)\s+(\d+)\s+obj\b/;
        const endobjRegExp: RegExp = /\bendobj[\b\s]$/;
        const nestedObjRegExp: RegExp = /\s+(\d+\s+\d+\s+obj[\b\s<])$/;
        const checkContentLength: number = 25;
        const trailerBytes: Uint8Array = new Uint8Array([116, 114, 97, 105, 108, 101, 114]);
        const startxrefBytes: Uint8Array = new Uint8Array([115, 116, 97, 114, 116, 120, 114, 101, 102]);
        const objBytes: Uint8Array = new Uint8Array([111, 98, 106]);
        const xrefBytes: Uint8Array = new Uint8Array([47, 88, 82, 101, 102]);
        this._entries.length = 0;
        this._cacheMap.clear();
        const stream: _PdfStream = this._stream;
        stream.position = 0;
        const buffer: Uint8Array = stream.getBytes();
        const length: number = buffer.length;
        let position: number = stream.start;
        const trailers: number[] = [];
        const crossReferencePosition: number[] = [];
        while (position < length) {
            let ch: number = buffer[position]; // eslint-disable-line
            if (ch === tab || ch === lf || ch === cr || ch === space) {
                ++position;
                continue;
            }
            if (ch === percent) {
                do {
                    ++position;
                    if (position >= length) {
                        break;
                    }
                    ch = buffer[position]; // eslint-disable-line
                } while (ch !== lf && ch !== cr);
                continue;
            }
            const token: string = this._readToken(buffer, position);
            let m: any; // eslint-disable-line
            if (token.startsWith('xref') && (token.length === 4 || /\s/.test(token[4]))) {
                position += this._skipUntil(buffer, position, trailerBytes);
                trailers.push(position);
                position += this._skipUntil(buffer, position, startxrefBytes);
            } else {
                m = objRegExp.exec(token);
                if (m) {
                    const objectNumber: number = <number>(m[1]) | 0;
                    const gen: number = <number>(m[2]) | 0;
                    let contentLength: number;
                    let startPos: number = position + token.length;
                    let updateEntries: boolean = false;
                    if (!this._entries[objectNumber]) { // eslint-disable-line
                        updateEntries = true;
                    } else if (this._entries[objectNumber].gen === gen) { // eslint-disable-line
                        try {
                            const subStream: _PdfStream = stream.makeSubStream(startPos, stream.length - startPos);
                            const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(subStream);
                            const parser: _PdfParser = new _PdfParser(lexicalOperator, null);
                            parser.getObject();
                            updateEntries = true;
                        } catch (ex) {
                            updateEntries = !(ex instanceof ParserEndOfFileException);
                        }
                    }
                    if (updateEntries) {
                        const info: _PdfObjectInformation = new _PdfObjectInformation();
                        info.offset = position - stream.start;
                        info.gen = gen;
                        info.uncompressed = true;
                        this._entries[objectNumber] = info; // eslint-disable-line
                    }
                    while (startPos < buffer.length) {
                        const endPos: number = startPos + this._skipUntil(buffer, startPos, objBytes) + 4;
                        contentLength = endPos - position;
                        const checkPos: number = Math.max(endPos - checkContentLength, startPos);
                        const tokenStr: string = _bytesToString(buffer.subarray(checkPos, endPos));
                        if (endobjRegExp.test(tokenStr)) {
                            break;
                        } else {
                            const objToken: any = nestedObjRegExp.exec(tokenStr); // eslint-disable-line
                            if (objToken && objToken[1]) {
                                contentLength -= objToken[1].length;
                                break;
                            }
                        }
                        startPos = endPos;
                    }
                    const content: Uint8Array = buffer.subarray(position, position + contentLength);
                    const xrefTagOffset: number = this._skipUntil(content, 0, xrefBytes);
                    if (xrefTagOffset < contentLength && content[xrefTagOffset + 5] < 64) {
                        crossReferencePosition.push(position - stream.start);
                        this._crossReferencePosition[position - stream.start] = 1;
                    }
                    position += contentLength;
                } else if (token.startsWith('trailer') && (token.length === 7 || /\s/.test(token[7]))) {
                    trailers.push(position);
                    position += this._skipUntil(buffer, position, startxrefBytes);
                } else {
                    position += token.length + 1;
                }
            }
        }
        for (let i: number = 0; i < crossReferencePosition.length; ++i) {
            this._startXRefQueue.push(crossReferencePosition[i]); // eslint-disable-line
            this._readXRef(true);
        }
        let trailerDict: _PdfDictionary;
        for (let i: number = 0; i < trailers.length; ++i) {
            stream.position = trailers[i]; // eslint-disable-line
            const parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(stream), this, true, true);
            const obj: any = parser.getObject(); // eslint-disable-line
            if (!_isCommand(obj, 'trailer')) {
                continue;
            }
            const dictionary: any = parser.getObject(); // eslint-disable-line
            if (!(dictionary instanceof _PdfDictionary)) {
                continue;
            }
            try {
                const rootDict: any = dictionary.get('Root'); // eslint-disable-line
                if (!(rootDict instanceof _PdfDictionary)) {
                    continue;
                }
                const pagesDict: any = rootDict.get('Pages'); // eslint-disable-line
                if (!(pagesDict instanceof _PdfDictionary)) {
                    continue;
                }
                const pagesCount: number = pagesDict.get('Count');
                if (typeof pagesCount === 'undefined' || !Number.isInteger(pagesCount)) {
                    continue;
                }
            } catch (ex) {
                continue;
            }
            if (dictionary.has('ID')) {
                return dictionary;
            }
            trailerDict = dictionary;
        }
        if (trailerDict) {
            return trailerDict;
        }
        if (this._topDictionary) {
            return this._topDictionary;
        }
        throw new BaseException('Invalid PDF structure.', 'InvalidPDFException');
    }
    /**
     * Processes an XRef table and returns its trailer dictionary.
     *
     * @private
     * @param {_PdfParser} parser - Parser positioned after 'xref'.
     * @returns {_PdfDictionary} The trailer dictionary.
     */
    _processXRefTable(parser: _PdfParser): _PdfDictionary {
        if (typeof this._tableState === 'undefined') {
            const tableState: _PdfCrossTableState = new _PdfCrossTableState();
            tableState.entryNum = 0;
            tableState.streamPos = parser.lexicalOperator.stream.position;
            tableState.parserBuf1 = parser.first;
            tableState.parserBuf2 = parser.second;
            this._tableState = tableState;
        }
        const obj: _PdfCommand = this._readXRefTable(parser);
        if (!_isCommand(obj, 'trailer')) {
            throw new FormatError(
                'Invalid XRef table: could not find trailer dictionary'
            );
        }
        let topDictionary: any = parser.getObject(); // eslint-disable-line
        let dictionary: _PdfDictionary;
        if (topDictionary) {
            if (topDictionary instanceof _PdfDictionary) {
                dictionary = topDictionary;
            } else if (topDictionary instanceof _PdfBaseStream && topDictionary.dictionary) {
                dictionary = topDictionary.dictionary;
            }
        }
        if (!dictionary) {
            throw new FormatError('Invalid cross reference: could not parse trailer dictionary');
        }
        this._tableState = undefined;
        return dictionary;
    }
    /**
     * Reads entries from an XRef table subsection.
     *
     * @private
     * @param {_PdfParser} parser - Parser to read entries from.
     * @returns {_PdfCommand} The command following the table.
     */
    _readXRefTable(parser: _PdfParser): _PdfCommand {
        const stream: _PdfStream = parser.lexicalOperator.stream;
        stream.position = this._tableState.streamPos;
        parser.first = this._tableState.parserBuf1;
        parser.second = this._tableState.parserBuf2;
        let obj: any; // eslint-disable-line
        while (true) { // eslint-disable-line
            if (typeof this._tableState.firstEntryNum === 'undefined' || typeof this._tableState.entryCount === 'undefined') {
                obj = parser.getObject();
                if (_isCommand(obj, 'trailer')) {
                    break;
                }
                this._tableState.firstEntryNum = obj;
                this._tableState.entryCount = parser.getObject();
            }
            let first: number = this._tableState.firstEntryNum;
            const count: number = this._tableState.entryCount;
            if (!Number.isInteger(first) || !Number.isInteger(count)) {
                throw new FormatError('Invalid cross reference: wrong types in subsection header');
            }
            for (let i: number = this._tableState.entryNum; i < count; i++) {
                this._tableState.streamPos = stream.position;
                this._tableState.entryNum = i;
                this._tableState.parserBuf1 = parser.first;
                this._tableState.parserBuf2 = parser.second;
                const entry: _PdfObjectInformation = new _PdfObjectInformation();
                entry.offset = parser.getObject();
                entry.gen = parser.getObject();
                const type: _PdfCommand = parser.getObject();
                if (type) {
                    switch (type.command) {
                    case 'f':
                        entry.free = true;
                        break;
                    case 'n':
                        entry.uncompressed = true;
                        break;
                    }
                }
                if (!Number.isInteger(entry.offset) || !Number.isInteger(entry.gen) || !(entry.free || entry.uncompressed)) {
                    throw new FormatError(`Invalid entry in cross reference subsection: ${first}, ${count}`);
                }
                if (i === 0 && entry.free && first === 1) {
                    first = 0;
                }
                if (!this._entries[i + first]) {
                    this._entries[i + first] = entry;
                }
            }
            this._tableState.entryNum = 0;
            this._tableState.streamPos = stream.position;
            this._tableState.parserBuf1 = parser.first;
            this._tableState.parserBuf2 = parser.second;
            this._tableState.firstEntryNum = undefined;
            this._tableState.entryCount = undefined;
        }
        if (this._entries[0] && !this._entries[0].free) {
            throw new FormatError('Invalid XRef table: unexpected first object');
        }
        return obj;
    }
    /**
     * Processes an XRef stream and returns its dictionary.
     *
     * @private
     * @param {_PdfStream} stream - The XRef stream.
     * @returns {_PdfDictionary} The stream dictionary.
     */
    _processXRefStream(stream: _PdfStream): _PdfDictionary {
        if (typeof this._streamState === 'undefined') {
            const streamParameters: _PdfDictionary = stream.dictionary;
            const streamState: _PdfStreamState = new _PdfStreamState();
            let index: number[] = streamParameters.getArray('Index');
            if (!index) {
                index = [0, streamParameters.get('Size')];
            }
            streamState.entryRanges = index;
            streamState.byteWidths = streamParameters.getArray('W');
            streamState.entryNum = 0;
            streamState.streamPos = stream.position;
            this._streamState = streamState;
        }
        this._readXRefStream(stream);
        this._streamState = undefined;
        return stream.dictionary;
    }
    /**
     * Reads entries from an XRef stream into internal state.
     *
     * @private
     * @param {_PdfStream} stream - Stream to read.
     * @returns {void} nothing.
     */
    _readXRefStream(stream: _PdfStream): void {
        stream.position = this._streamState.streamPos;
        const typeFieldWidth: number = this._streamState.byteWidths[0];
        const offsetFieldWidth: number = this._streamState.byteWidths[1];
        const generationFieldWidth: number = this._streamState.byteWidths[2];
        const entryRanges: number[] = this._streamState.entryRanges;
        while (entryRanges.length > 0) {
            const first: number = entryRanges[0];
            const n: number = entryRanges[1];
            if (!Number.isInteger(first) || !Number.isInteger(n)) {
                throw new FormatError(`Invalid XRef range fields: ${first}, ${n}`);
            }
            if (!Number.isInteger(typeFieldWidth) || !Number.isInteger(offsetFieldWidth) || !Number.isInteger(generationFieldWidth)) {
                throw new FormatError(`Invalid XRef entry fields length: ${first}, ${n}`);
            }
            for (let i: number = this._streamState.entryNum; i < n; ++i) {
                this._streamState.entryNum = i;
                this._streamState.streamPos = stream.position;
                let type: number = 0;
                let offset: number = 0;
                let generation: number = 0;
                for (let j: number = 0; j < typeFieldWidth; ++j) {
                    const typeByte: number = stream.getByte();
                    if (typeByte === -1) {
                        throw new FormatError('invalid cross reference byte width type.');
                    }
                    type = (type << 8) | typeByte;
                }
                if (typeFieldWidth === 0) {
                    type = 1;
                }
                for (let j: number = 0; j < offsetFieldWidth; ++j) {
                    const offsetByte: number = stream.getByte();
                    if (offsetByte === -1) {
                        throw new FormatError('invalid cross reference byte width offset.');
                    }
                    offset = (offset << 8) | offsetByte;
                }
                for (let j: number = 0; j < generationFieldWidth; ++j) {
                    const generationByte: number = stream.getByte();
                    if (generationByte === -1) {
                        throw new FormatError('invalid cross reference byte width generation.');
                    }
                    generation = (generation << 8) | generationByte;
                }
                const entry: _PdfObjectInformation = new _PdfObjectInformation();
                entry.offset = offset;
                entry.gen = generation;
                switch (type) {
                case 0:
                    entry.free = true;
                    break;
                case 1:
                    entry.uncompressed = true;
                    break;
                case 2:
                    break;
                default:
                    throw new FormatError(`Invalid XRef entry type: ${type}`);
                }
                if (!this._entries[first + i]) {
                    this._entries[first + i] = entry;
                }
            }
            this._streamState.entryNum = 0;
            this._streamState.streamPos = stream.position;
            entryRanges.splice(0, 2);
        }
    }
    /**
     * Returns the document catalog (root) dictionary.
     *
     * @private
     * @returns {_PdfDictionary} The root dictionary.
     */
    _getCatalogObj(): _PdfDictionary {
        return this._root;
    }
    _flushBuffer(data: Array<number>): void {
        if (data.length === 0) {
            return;
        }
        const chunk: Uint8Array = new Uint8Array(data.length);
        for (let i: number = 0; i < data.length; i++) {
            chunk[<number>i] = data[<number>i];
        }
        this._uint8Chunks.push(chunk);
        this._bufferLength += chunk.length;
        data.length = 0;
    }
    /**
     * Serializes and returns the full PDF bytes synchronously.
     *
     * @private
     * @returns {Uint8Array} Serialized document bytes.
     */
    _save(): Uint8Array {
        this._uint8Chunks = [];
        this._bufferLength = 0;
        const buffer: Array<number> = [37, 80, 68, 70, 45];
        this._writeString(`${this._version}${this._newLine}`, buffer);
        buffer.push(0x25, 0x83, 0x92, 0xfa, 0xfe);
        this._writeString(this._newLine, buffer);
        let result: Uint8Array;
        let offset: number = 0;
        if (this._signatureCollection && this._signatureCollection.length > 0) {
            if (this._isCrossReferenceStream) {
                this._document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
            } else if (this._isCrossReferenceTable) {
                this._document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
            }
            const totalSignatures: number = this._signatureCollection.length;
            for (let i: number = 0; i < totalSignatures; i++) {
                this._signatureCollection[<number>i]._catalogBeginSave();
            }
        }
        if (!this._document.fileStructure.isIncrementalUpdate) {
            this._currentLength = 0;
            this._objectCollection = new _PdfMainObjectCollection(this);
            this._writeObjectCollection(this._objectCollection._mainObjectCollection, buffer);
            if (buffer.length > 0) {
                this._flushBuffer(buffer);
            }
            result = new Uint8Array(this._bufferLength);
        } else {
            this._currentLength = this._stream.length;
            if (this._document._fileStructure._crossReferenceType === PdfCrossReferenceType.stream) {
                this._saveAsStream(this._currentLength, buffer);
            } else {
                this._saveAsTable(this._currentLength, buffer);
            }
            if (buffer.length > 0) {
                this._flushBuffer(buffer);
            }
            result = new Uint8Array(this._stream.length + this._bufferLength);
            result.set(this._stream.bytes);
            offset = this._stream.length;
        }
        for (const chunk of this._uint8Chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        if (this._signatureCollection && this._signatureCollection.length > 0) {
            const totalSignatures: number = this._signatureCollection.length;
            for (let i: number = 0; i < totalSignatures; i++) {
                this._signature = this._signatureCollection[<number>i]._signatureDictionary;
                this._signature._documentSaved(result);
            }
        }
        if (!this._document.fileStructure.isIncrementalUpdate) {
            const stream: _PdfStream = new _PdfStream(result);
            this._stream = stream;
            this._document._stream = stream;
        }
        this._uint8Chunks = [];
        return result;
    }
    /**
     * Saves objects as a cross-reference stream.
     *
     * @private
     * @param {number} currentLength - Current file length prior to writing.
     * @param {number[]} buffer - Buffer to append to.
     * @returns {void} nothing.
     */
    _saveAsStream(currentLength: number, buffer: number[]): void {
        const objectStreamCollection: Map<_PdfReference, _PdfArchievedStream> = new Map<_PdfReference, _PdfArchievedStream>();
        this._indexes = [];
        this._indexes.push(0, 1);
        this._offsets = [];
        const flushThreshold: number = 512000; // 500KB threshold
        this._cacheMap.forEach((value: _PdfDictionary | _PdfBaseStream) => {
            const dictionary: _PdfDictionary = value instanceof _PdfBaseStream ? value.dictionary :
                value instanceof _PdfDictionary ? value : undefined;
            if (dictionary) {
                dictionary._isProcessed = false;
            }
        });
        this._cacheMap.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
            if (value instanceof _PdfBaseStream) {
                const dictionary: _PdfDictionary = value.dictionary;
                if (dictionary && dictionary._updated && (!dictionary.isCatalog || this._allowCatalog) && !dictionary._isProcessed) {
                    let cipher: _CipherTransform;
                    if (this._encrypt) {
                        cipher = this._encrypt._createCipherTransform(key.objectNumber, key.generationNumber);
                    }
                    this._updatedDictionary(currentLength, key, buffer, value, cipher);
                    dictionary._isProcessed = true;
                    if (buffer.length > flushThreshold) {
                        this._flushBuffer(buffer);
                    }
                }
            }
        });
        this._cacheMap.forEach((value: _PdfDictionary | _PdfBaseStream, key: _PdfReference) => {
            if (value instanceof _PdfDictionary) {
                if (value._updated && !value.isCatalog && !value._isProcessed || value._isSignature) {
                    if (value._isSignature) {
                        this._updatedDictionary(currentLength, key, buffer, value);
                    } else {
                        this._writeArchiveStream(objectStreamCollection, key, value);
                    }
                } else if (value._updated && (value.isCatalog || this._allowCatalog)) {
                    this._updatedDictionary(currentLength, key, buffer, value);
                    if (buffer.length > flushThreshold) {
                        this._flushBuffer(buffer);
                    }
                }
            } else if (value instanceof _PdfBaseStream) {
                const dictionary: _PdfDictionary = value.dictionary;
                if (dictionary && dictionary._updated && (!dictionary.isCatalog || this._allowCatalog) && !dictionary._isProcessed) {
                    this._updatedDictionary(currentLength, key, buffer, value);
                    if (buffer.length > flushThreshold) {
                        this._flushBuffer(buffer);
                    }
                }
            }
        });
        this._objectStream = undefined;
        this._objectStreamCollection = objectStreamCollection;
        this._writeXrefStream(buffer);
    }
    /**
     * Writes the XRef stream and related structures into the buffer.
     *
     * @private
     * @param {number[]} buffer - Buffer to write to.
     * @returns {void} nothing.
     */
    _writeXrefStream(buffer: number[]): void {
        this._objectStreamCollection.forEach((value: _PdfArchievedStream, key: _PdfReference) => {
            value._save(buffer, this._currentLength);
            if (Array.isArray(value._collection)) {
                this._indexes.push(...value._collection);
            }
            this._indexes.push(key.objectNumber, 1);
            if (buffer.length > 524288) {
                this._flushBuffer(buffer);
            }
        });
        const formatValue: number = Math.max(_getSize(this._currentLength + this._bufferLength + buffer.length),
                                             _getSize(this._nextReferenceNumber));
        const newRef: _PdfReference = this._getNextReference();
        this._indexes.push(newRef.objectNumber, 1);
        const newStartXref: number = this._currentLength + this._bufferLength + buffer.length;
        const newXref: _PdfDictionary = new _PdfDictionary(this);
        newXref.set('Type', _PdfName.get('XRef'));
        newXref.set('Index', this._indexes);
        newXref.set('W', [1, formatValue, 1]);
        this._copyTrailer(newXref);
        if (this._ids && this._ids.length > 0) {
            newXref.update('ID', [this._ids[0], this._computeMessageDigest(newStartXref)]);
        }
        const newXrefData: Array<number> = [];
        this._writeLong(0, 1, newXrefData);
        this._writeLong(0, formatValue, newXrefData);
        this._writeLong(-1, 1, newXrefData);
        if (this._offsets.length > 0) {
            for (let index: number = 0; index < this._offsets.length; index++) {
                this._writeLong(1, 1, newXrefData);
                this._writeLong(this._offsets[<number>index], formatValue, newXrefData);
                this._writeLong(0, 1, newXrefData);
            }
        }
        if (this._objectStreamCollection.size > 0) {
            this._objectStreamCollection.forEach((value: _PdfArchievedStream, key: _PdfReference) => {
                for (let index: number = 0; index < value._length; index++) {
                    this._writeLong(2, 1, newXrefData);
                    this._writeLong(key.objectNumber, formatValue, newXrefData);
                    this._writeLong(index, 1, newXrefData);
                }
                this._writeLong(1, 1, newXrefData);
                this._writeLong(value._archiveOffset, formatValue, newXrefData);
                this._writeLong(0, 1, newXrefData);
            });
        }
        this._writeLong(1, 1, newXrefData);
        this._writeLong(newStartXref, formatValue, newXrefData);
        this._writeLong(0, 1, newXrefData);
        newXref.set('Length', newXrefData.length);
        const newXrefStream: _PdfStream = new _PdfStream(newXrefData, newXref, 0, newXrefData.length);
        let cipher: _CipherTransform;
        if (this._encrypt) {
            cipher = this._encrypt._createCipherTransform(newRef.objectNumber, newRef.generationNumber);
        }
        this._writeObject(newXrefStream, buffer, newRef, cipher, true);
        this._writeString(`startxref${this._newLine}${newStartXref}${this._newLine}%%EOF${this._newLine}`, buffer);
        if (buffer.length > 0) {
            this._flushBuffer(buffer);
        }
    }
    /**
     * Writes an updated dictionary object to the output and records offsets.
     *
     * @private
     * @param {number} currentLength - Current output length.
     * @param {_PdfReference} key - Object reference.
     * @param {number[]} buffer - Output buffer.
     * @param {any} value - Object value.
     * @param {_CipherTransform} [cipher] - Optional cipher transform.
     * @returns {void} nothing.
     */
    _updatedDictionary(currentLength: number, key: _PdfReference, buffer: number[], value: any, // eslint-disable-line
                       cipher?: _CipherTransform): void {
        this._indexes.push(key.objectNumber, 1);
        this._offsets.push(currentLength + this._bufferLength + buffer.length);
        this._writeObject(value, buffer, key, cipher);
        value._updated = false;
    }
    /**
     * Writes an XRef table into the buffer.
     *
     * @private
     * @param {number[]} buffer - Buffer to write to.
     * @returns {void} nothing.
     */
    _writeXrefTable(buffer: number[]): void {
        let tempBuffer: string = '';
        const collection: Map<_PdfReference, any> = this._getSortedReferences(this._offsetReference); // eslint-disable-line
        collection.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
            const offsetString: string = this._processString(value.toString(), 10);
            const genString: string = this._processString(key.generationNumber ? '0' : '', 5);
            if (value !== 0) {
                tempBuffer += `${offsetString} ${genString} n${this._newLine}`;
            } else {
                tempBuffer += `${offsetString} ${genString} f${this._newLine}`;
            }
        });
        const newStartXref: number = buffer.length + this._bufferLength;
        const xrefHeader: string = `xref${this._newLine}`;
        const xrefEntry: string = `0 ${collection.size + 1}${this._newLine}`;
        const initialEntry: string = `0000000000 65535 f${this._newLine}`;
        this._writeString(xrefHeader + xrefEntry + initialEntry, buffer);
        this._writeXref(buffer, tempBuffer, newStartXref);
        if (buffer.length > 512000) { // 500KB threshold
            this._flushBuffer(buffer);
        }
    }
    /**
     * Writes low-level XRef text and trailer into the buffer.
     *
     * @private
     * @param {number[]} buffer - Buffer to append to.
     * @param {string} tempBuffer - Precomputed entry lines.
     * @param {number} newStartXref - Offset of the new xref.
     * @returns {void} nothing.
     */
    _writeXref(buffer: number[], tempBuffer: string, newStartXref: number): void {
        this._writeString(tempBuffer, buffer);
        this._writeString(`trailer${this._newLine}`, buffer);
        const newXref: _PdfDictionary = new _PdfDictionary(this);
        this._copyTrailer(newXref);
        this._writeDictionary(newXref, buffer, this._newLine);
        this._writeString(`startxref${this._newLine}${newStartXref}${this._newLine}%%EOF${this._newLine}`, buffer);
    }
    /**
     * Pads a numeric string with leading zeros to the desired length.
     *
     * @private
     * @param {string} value - Value to pad.
     * @param {number} length - Desired length.
     * @returns {string} Padded string.
     */
    _processString(value: string, length: number): string {
        while (value.length < length) {
            value = '0' + value;
        }
        return value;
    }
    /**
     * Copies trailer keys (Root/Info/Encrypt) into a new xref dictionary.
     *
     * @private
     * @param {_PdfDictionary} newXref - Dictionary to populate.
     * @returns {void} nothing.
     */
    _copyTrailer(newXref: _PdfDictionary): void {
        const reference: _PdfReference = this._getNextReference();
        newXref.set('Size', reference.objectNumber);
        if (this._document.fileStructure.isIncrementalUpdate) {
            newXref.set('Prev', this._prevXRefOffset);
        }
        const root: any = this._trailer.getRaw('Root'); // eslint-disable-line
        if (typeof root !== 'undefined' && root !== null) {
            newXref.set('Root', root);
        }
        const info: any = this._trailer.getRaw('Info'); // eslint-disable-line
        if (typeof info !== 'undefined' && info !== null) {
            newXref.set('Info', info);
        }
        const encrypt: any = this._trailer.getRaw('Encrypt'); // eslint-disable-line
        if (typeof encrypt !== 'undefined' && encrypt !== null) {
            newXref.set('Encrypt', encrypt);
        }
    }
    /**
     * Computes a message digest used for signature or ID updates.
     *
     * @private
     * @param {number} size - Current size used in the digest.
     * @returns {string} Hex digest string.
     */
    _computeMessageDigest(size: number): string {
        const time: number = Math.floor(Date.now() / 1000);
        const buffer: string[] = [time.toString(), '', size.toString()];
        const info: _PdfDictionary = this._trailer.getRaw('Info');
        const crossReferenceInfo: _PdfDictionary = new _PdfDictionary();
        if (info && info instanceof _PdfDictionary) {
            info.forEach((key: string, value: any) => { // eslint-disable-line
                if (value && typeof value === 'string') {
                    crossReferenceInfo.set(key, _stringToPdfString(value));
                }
            });
        }
        crossReferenceInfo.forEach((key: string, value: any) => { // eslint-disable-line
            buffer.push(value);
        });
        const array: number[] = [];
        buffer.forEach((str: string) => {
            this._writeString(str, array);
        });
        return _bytesToString((new _MD5().hash(new Uint8Array(array))));
    }
    /**
     * Allocates the next object reference number.
     *
     * @private
     * @returns {_PdfReference} New reference object.
     */
    _getNextReference(): _PdfReference {
        const reference: _PdfReference = new _PdfReference(this._nextReferenceNumber++, 0);
        reference._isNew = true;
        return reference;
    }
    /**
     * Writes a PDF object (dictionary, stream, array, number, or string) into the output
     * buffer, applying optional encryption and handling reference wrappers when present.
     *
     * @private
     * @param {_PdfDictionary | _PdfBaseStream | any} obj - The PDF object to serialize.
     * @param {number[]} buffer - The output buffer receiving encoded bytes.
     * @param {_PdfReference} [reference] - Optional object reference used to wrap the output in an `obj` / `endobj` container.
     * @param {_CipherTransform} [transform] - Optional cipher transform applied to encrypt stream or string values.
     * @param {boolean} [isCrossReference] - Indicates whether this object belongs to a cross-reference section.
     * @returns {void} nothing.
     */
    _writeObject(obj: _PdfDictionary | _PdfBaseStream | any, // eslint-disable-line
                 buffer: Array<number>,
                 reference?: _PdfReference,
                 transform?: _CipherTransform,
                 isCrossReference?: boolean): void {
        if (reference && reference instanceof _PdfReference) {
            this._writeString(`${reference.objectNumber} ${reference.generationNumber} obj${this._newLine}`, buffer);
        }
        if (obj instanceof _PdfDictionary) {
            this._writeDictionary(obj, buffer, this._newLine, transform, isCrossReference);
        } else if (obj instanceof _PdfBaseStream) {
            this._writeStream(obj, buffer, transform, isCrossReference);
        } else if (Array.isArray(obj) && obj.length > 0) {
            this._writeString('[ ', buffer);
            obj.forEach((value: any, index: number) => { // eslint-disable-line
                if (value instanceof _PdfReference) {
                    this._writeString(`${value.objectNumber} ${value.generationNumber} R`, buffer);
                } else if (Array.isArray(value)) {
                    this._writeString('[ ', buffer);
                    value.forEach((nestedValue: any) => { // eslint-disable-line
                        if (nestedValue instanceof _PdfReference) {
                            this._writeString(`${nestedValue.objectNumber} ${nestedValue.generationNumber} R`, buffer);
                        } else if (nestedValue instanceof _PdfName) {
                            this._writeString(`/${_escapePdfName(nestedValue.name)}`, buffer);
                        } else {
                            this._writeString(`${nestedValue} `, buffer);
                        }
                    });
                    this._writeString(']', buffer);
                } else if (value instanceof _PdfName) {
                    this._writeString(`/${_escapePdfName(value.name)}`, buffer);
                } else if (value instanceof _PdfDictionary) {
                    this._writeDictionary(value, buffer, this._newLine, transform, isCrossReference);
                } else if (typeof(value) === 'string') {
                    if (_hasUnicodeCharacters(value)) {
                        const bytes: Uint8Array = _stringToBytes(value) as Uint8Array;
                        const text: string = _byteArrayToHexString(bytes);
                        this._writeString('<', buffer);
                        this._writeString(`${text}`, buffer);
                        this._writeString('>', buffer);
                    } else {
                        this._writeString(`${value}\n`, buffer);
                    }
                } else {
                    this._writeString(`${value}\n`, buffer);
                }
                if (index < obj.length - 1) {
                    this._writeString(' ', buffer);
                }
            });
            this._writeString(']', buffer);
            this._writeString('\n', buffer);
        } else if (typeof obj === 'number') {
            this._writeString(`${obj}\n`, buffer);
        } else if (typeof obj === 'string') {
            this._writeString(`(${_escapePdfName(obj)})\n`, buffer);
        }
        if (obj instanceof _PdfName) {
            if (obj.name.indexOf(' ') !== -1) {
                obj.name = obj.name.replace(/ /g,'#20'); // eslint-disable-line
            }
            const escapedName: string = obj.name;
            this._writeString(`/${escapedName}`, buffer);
        }
        if (reference && reference instanceof _PdfReference) {
            this._writeString(`endobj${this._newLine}`, buffer);
        }
    }
    /**
     * Writes a dictionary object into the output buffer using the specified spacing
     * and optionally applies encryption or cross reference rules.
     *
     * @private
     * @param {_PdfDictionary} dictionary - The dictionary to serialize into the buffer.
     * @param {number[]} buffer - The output buffer receiving serialized bytes.
     * @param {string} spaceChar - The spacing string written between dictionary entries.
     * @param {_CipherTransform} [transform] - Optional cipher transform for encrypting values.
     * @param {boolean} [isCrossReference] - Indicates whether the dictionary belongs to a cross reference stream.
     * @returns {void} nothing.
     */
    _writeDictionary(dictionary: _PdfDictionary,
                     buffer: Array<number>,
                     spaceChar: string,
                     transform?: _CipherTransform,
                     isCrossReference?: boolean): void {
        if (dictionary._currentObj) {
            dictionary._currentObj._beginSave();
        }
        if (dictionary._isFont) {
            this._writeFontDictionary(dictionary);
        }
        this._writeString(`<<${spaceChar}`, buffer);
        if (dictionary._isSignature && this._signatureCollection && this._signatureCollection.length > 0) {
            const matchingSignature: PdfSignature = this._signatureCollection.find((signature: PdfSignature) =>
                signature._signatureDictionary._dictionary.objId === dictionary.objId);
            if (matchingSignature) {
                matchingSignature._signatureDictionary._dictionarySave(buffer);
            }
        }
        dictionary.forEach((key: string, value: any) => { // eslint-disable-line
            this._writeString(`/${_escapePdfName(key)} `, buffer);
            this._writeValue(value, key, buffer, transform, isCrossReference);
            this._writeString(spaceChar, buffer);
        });
        this._writeString(`>>${this._newLine}`, buffer);
    }
    /**
     * Ensures font-related dictionary entries are converted to references.
     *
     * @private
     * @param {_PdfDictionary} dictionary - Font dictionary to process.
     * @returns {void} nothing.
     */
    _writeFontDictionary(dictionary: _PdfDictionary): void {
        if (dictionary.has('DescendantFonts')) {
            const fonts: any = dictionary.get('DescendantFonts'); // eslint-disable-line
            if (!Array.isArray(fonts)) {
                const reference: _PdfReference = this._getNextReference();
                this._cacheMap.set(reference, fonts);
                dictionary.update('DescendantFonts', [reference]);
            }
        }
        this._createFontReference('ToUnicode', dictionary);
        this._createFontReference('FontFile2', dictionary);
        this._createFontReference('FontFile3', dictionary);
        this._createFontReference('FontDescriptor', dictionary);
    }
    /**
     * Ensures a font-related subkey is stored as an indirect reference.
     *
     * @private
     * @param {string} key - Dictionary key to convert.
     * @param {_PdfDictionary} dictionary - Dictionary to modify.
     * @returns {void} nothing.
     */
    _createFontReference(key: string, dictionary: _PdfDictionary): void {
        if (dictionary.has(key)) {
            const fonts: any = dictionary.get(key); // eslint-disable-line
            if (!(fonts instanceof _PdfReference)) {
                const reference: _PdfReference = this._getNextReference();
                this._cacheMap.set(reference, fonts);
                if (this._document.fileStructure.isIncrementalUpdate === false && this._objectCollection &&
                    this._objectCollection._mainObjectCollection) {
                    this._objectCollection._mainObjectCollection.set(reference, fonts);
                }
                dictionary.update(key, reference);
            }
        }
    }
    /**
     * Writes a stream object into the output buffer, optionally applying encryption
     * or handling cross-reference stream rules.
     *
     * @private
     * @param {_PdfBaseStream} stream - The source PDF stream to write.
     * @param {number[]} buffer - The output buffer receiving the encoded stream.
     * @param {_CipherTransform} [transform] - Optional cipher transform used to encrypt stream data.
     * @param {boolean} [isCrossReference] - Indicates whether the stream is part of a cross-reference structure.
     * @returns {void} nothing.
     */
    _writeStream(stream: _PdfBaseStream, buffer: Array<number>, transform?: _CipherTransform, isCrossReference?: boolean): void {
        let value: string;
        const streamBuffer: number[] = [];
        if (!isCrossReference) {
            if (stream._isCompress && !stream._isImage) {
                value = _compressStream(stream);
            } else {
                value = stream.getString();
            }
            if (transform) {
                value = transform.encryptString(value);
            }
        } else {
            value = stream.getString();
        }
        this._writeString(value, streamBuffer);
        stream.dictionary.update('Length', streamBuffer.length);
        this._writeDictionary(stream.dictionary, buffer, this._newLine, transform, isCrossReference);
        this._writeString(`stream${this._newLine}`, buffer);
        this._writeBytes(streamBuffer, buffer);
        this._writeString(`${this._newLine}endstream${this._newLine}`, buffer);
    }
    /**
     * Writes a value (name, reference, array, string, number, etc.) into the buffer.
     *
     * @private
     * @param {any} value - String to write.
     * @param {any} key - Destination buffer.
     * @param {Array<number>} buffer - buffer for the text.
     * @param {_CipherTransform} [transform] - String to write.
     * @param {boolean} [isCrossReference] - Destination buffer.
     * @returns {void} nothing.
     */
    _writeValue(value: any, key: any, buffer: Array<number>, transform?: _CipherTransform, isCrossReference?: boolean): void { // eslint-disable-line
        if (value instanceof _PdfName) {
            if (value.name.indexOf(' ') !== -1) {
                value.name = value.name.replace(/ /g,'#20'); // eslint-disable-line
            }
            const escapedName: string = (key === 'V' || key === 'AS') ? _escapePdfName(value.name) : value.name;
            this._writeString(`/${escapedName}`, buffer);
        } else if (value instanceof _PdfReference) {
            this._writeString(`${value.toString()} R`, buffer);
        } else if (Array.isArray(value)) {
            this._writeString('[', buffer);
            let first: boolean = true;
            for (const val of value) {
                if (!first) {
                    this._writeString(' ', buffer);
                } else {
                    first = false;
                }
                this._writeValue(val, key, buffer, transform, isCrossReference);
            }
            this._writeString(']', buffer);
        } else if (typeof value === 'string') {
            if (!isCrossReference && transform) {
                value = transform.encryptString(value);
            }
            let isUnicode: boolean = false;
            for (let i: number = 0; i < value.length; i++) {
                if (value.charCodeAt([i]) > 255) {
                    isUnicode = true;
                    break;
                }
            }
            if (isUnicode) {
                this._writeUnicodeString(value, buffer);
            } else {
                this._writeString(`(${this._escapeString(value)})`, buffer);
            }
        } else if (typeof value === 'number') {
            this._writeString(_numberToString(value), buffer);
        } else if (typeof value === 'boolean') {
            this._writeString(value.toString(), buffer);
        } else if (value instanceof _PdfDictionary) {
            this._writeDictionary(value, buffer, this._newLine, transform, isCrossReference);
        } else if (value instanceof _PdfBaseStream) {
            this._writeStream(value, buffer, transform, isCrossReference);
        } else if (value === null) {
            this._writeString('null', buffer);
        }
    }
    /**
     * Writes a Unicode string as big-endian bytes into the buffer.
     *
     * @private
     * @param {string} value - String to write.
     * @param {Array<number>} buffer - Destination buffer.
     * @returns {void} nothing.
     */
    _writeUnicodeString(value: string, buffer: Array<number>): void {
        const byteValues: number[] = _stringToBigEndianBytes(value);
        byteValues.unshift(254, 255);
        const data: number[] = [];
        byteValues.forEach((byte: number) => {
            switch (byte) {
            case 40:
            case 41:
                data.push(92);
                data.push(byte);
                break;
            case 13:
                data.push(92);
                data.push(114);
                break;
            case 92:
                data.push(92);
                data.push(byte);
                break;
            default:
                data.push(byte);
                break;
            }
        });
        buffer.push('('.charCodeAt(0) & 0xff);
        data.forEach((byte: number) => {
            buffer.push(byte & 0xff);
        });
        buffer.push(')'.charCodeAt(0) & 0xff);
    }
    /**
     * Writes raw string characters into the numeric buffer.
     *
     * @private
     * @param {string} value - String to write.
     * @param {Array<number>} buffer - Destination buffer.
     * @returns {void} nothing.
     */
    _writeString(value: string, buffer: Array<number>): void {
        for (let i: number = 0; i < value.length; i++) {
            buffer.push(value.charCodeAt(i) & 0xff);
        }
    }
    /**
     * Writes raw bytes into the numeric buffer.
     *
     * @private
     * @param {number[]} data - Bytes to write.
     * @param {Array<number>} buffer - Destination buffer.
     * @returns {void} nothing.
     */
    _writeBytes(data: number[], buffer: Array<number>): void {
        for (let i: number = 0; i < data.length; i++) {
            buffer.push(data[i]); // eslint-disable-line
        }
    }
    /**
     * Writes a multi-byte long integer into the buffer.
     *
     * @private
     * @param {number} value - Destination buffer.
     * @param {number} count - Destination buffer.
     * @param {Array<number>} buffer - Destination buffer.
     * @returns {void} nothing.
     */
    _writeLong(value: number, count: number, buffer: Array<number>): void {
        for (let i: number = count - 1; i >= 0; --i) {
            buffer.push(value >> (i << 3) & 0xff);
        }
    }
    /**
     * Escapes special characters in a string for PDF string literals.
     *
     * @private
     * @param {string} value - Input string.
     * @returns {string} Escaped string.
     */
    _escapeString(value: string): string {
        return value.replace(/([()\\\n\r])/g, (substring: string) => {
            if (substring === '\n') {
                return '\\n';
            } else if (substring === '\r') {
                return '\\r';
            }
            return `\\${substring}`;
        });
    }
    _destroy(): void {
        this._entries = undefined;
        if (this._pendingRefs) {
            this._pendingRefs.clear();
            this._pendingRefs = undefined;
        }
        if (this._cacheMap) {
            this._cacheMap.clear();
        }
        if (this._offsetReference) {
            this._offsetReference.clear();
        }
        if (this._objectStreamCollection) {
            this._objectStreamCollection.clear();
        }
        if (this._objectCollection) {
            this._objectCollection = undefined;
        }
        this._offsets = [];
        this._startXRefQueue = [];
        this._root = undefined;
        this._startXRefQueue = undefined;
        this._stream = undefined;
        this._streamState = undefined;
        this._tableState = undefined;
        this._topDictionary = undefined;
        this._trailer = undefined;
        this._version = undefined;
        this._crossReferencePosition = undefined;
    }
    _writeObjectCollection(objectCollection: Map<_PdfReference, any>, buffer: number[]): void { // eslint-disable-line
        const objectStreamCollection: Map<_PdfReference, _PdfArchievedStream> = new Map<_PdfReference, _PdfArchievedStream>();
        this._indexes = [];
        this._indexes.push(0, 1);
        const flushThreshold: number = 512000;
        objectCollection.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
            this._writeObjectToBuffer(key, value, buffer, objectStreamCollection);
            if (buffer.length > flushThreshold) {
                this._flushBuffer(buffer);
            }
        });
        if (this._cacheMap.size > objectCollection.size) {
            this._cacheMap.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
                if (!objectCollection.has(key)) {
                    this._writeObjectToBuffer(key, value, buffer, objectStreamCollection);
                    if (buffer.length > flushThreshold) {
                        this._flushBuffer(buffer);
                    }
                }
            });
        }
        if (this._document.fileStructure._crossReferenceType === PdfCrossReferenceType.stream) {
            this._objectStream = undefined;
            this._objectStreamCollection = objectStreamCollection;
            this._writeXrefStream(buffer);
        } else {
            this._writeXrefTable(buffer);
        }
    }
    _saveAsTable(currentLength: number, buffer: number[]): void {
        let tempBuffer: string = '';
        const flushThreshold: number = 512000; // 500KB threshold
        let processedCount: number = 0;
        this._cacheMap.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
            let dictionary: _PdfDictionary;
            if (value instanceof _PdfDictionary) {
                dictionary = value;
            } else if (value instanceof _PdfBaseStream) {
                dictionary = value.dictionary;
            }
            if (dictionary) {
                if (dictionary._updated && (!dictionary.isCatalog || this._allowCatalog) || dictionary._isSignature) {
                    const offsetString: string = this._processString((currentLength + this._bufferLength + buffer.length).toString(), 10);
                    const genString: string = this._processString(key.generationNumber.toString(), 5);
                    tempBuffer += `${key.objectNumber} 1${this._newLine}${offsetString} ${genString} n${this._newLine}`;
                    this._writeObject(value, buffer, key);
                    processedCount++;
                    if (buffer.length > flushThreshold || processedCount % 2 === 0) {
                        this._flushBuffer(buffer);
                    }
                }
            }
        });
        const newStartXref: number = this._bufferLength + buffer.length + currentLength;
        this._writeString(`xref${this._newLine}0 1${this._newLine}0000000000 65535 f${this._newLine}`, buffer);
        this._writeXref(buffer, tempBuffer, newStartXref);
        if (buffer.length > 0) {
            this._flushBuffer(buffer);
        }
    }
    _writeArchiveStream(objectStreamCollection: Map<_PdfReference, _PdfArchievedStream>,
                         key: _PdfReference, value: any): void { // eslint-disable-line
        if (typeof this._objectStream === 'undefined' || this._objectStream._length === 100 ) {
            const archiveObj: _PdfArchievedStream = new _PdfArchievedStream(this);
            objectStreamCollection.set(archiveObj._reference, archiveObj);
            this._objectStream = archiveObj;
        }
        this._objectStream._writeObject(key, value);
    }
    _writeObjectToBuffer(key: _PdfReference, value: any, buffer: number[], // eslint-disable-line
                         objectStreamCollection: Map<_PdfReference, _PdfArchievedStream>): void {
        let cipher: _CipherTransform | undefined;
        if (value instanceof _PdfDictionary && value.isCatalog) {
            this._writeToBuffer(buffer, key, value);
        } else if (value instanceof _PdfName) {
            if (this._document.fileStructure._crossReferenceType === PdfCrossReferenceType.stream) {
                this._writeArchiveStream(objectStreamCollection, key, value);
            } else {
                this._writeToBuffer(buffer, key, value);
            }
        } else if (value instanceof _PdfDictionary) {
            const type: _PdfName = value.get('Filter');
            const typeIsFilter: boolean = type && type.name === 'Standard';
            if (this._document.fileStructure._crossReferenceType === PdfCrossReferenceType.stream) {
                if (!typeIsFilter && !value._isSignature) {
                    this._writeArchiveStream(objectStreamCollection, key, value);
                } else {
                    this._writeToBuffer(buffer, key, value);
                }
            } else {
                this._offsetReference.set(key, this._bufferLength + buffer.length);
                this._indexes.push(key.objectNumber, 1);
                this._writeObject(value, buffer, key);
            }
        } else {
            if (value instanceof _PdfBaseStream) {
                const dictionary: _PdfDictionary = value.dictionary;
                if (dictionary && dictionary._updated && !dictionary.isCatalog) {
                    if (this._encrypt) {
                        cipher = this._encrypt._createCipherTransform(key.objectNumber, key.generationNumber);
                    }
                    dictionary._updated = false;
                }
            } else if ((!Array.isArray(value) || value.length === 0) && typeof value !== 'number' && typeof value !== 'string') {
                return;
            }
            this._writeToBuffer(buffer, key, value, cipher);
        }
    }
    _writeToBuffer(buffer: number[], key: any, value: any, cipher?: _CipherTransform): void { // eslint-disable-line
        this._offsets.push(this._bufferLength + buffer.length);
        this._offsetReference.set(key, this._bufferLength + buffer.length);
        this._indexes.push(key.objectNumber, 1);
        this._writeObject(value, buffer, key, cipher);
        if (buffer.length > 512000) { // 500KB threshold
            this._flushBuffer(buffer);
        }
    }
    _getSortedReferences(collection: Map<_PdfReference, any>): Map<_PdfReference, any> {  // eslint-disable-line
        let entriesArray: [_PdfReference, any][] = [];  // eslint-disable-line
        collection.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
            entriesArray.push([key, value]);
        });
        entriesArray.sort((a: [_PdfReference, any], b: [_PdfReference, any]) => { // eslint-disable-line
            return a[0].objectNumber - b[0].objectNumber;
        });
        let sortedCollection = new Map<_PdfReference, any>();  // eslint-disable-line
        let lastObjectNumber: number = 1;
        for (const [key, value] of entriesArray) {
            const currentObjectNumber: number = key.objectNumber;
            while (lastObjectNumber < currentObjectNumber) {
                sortedCollection.set({ objectNumber: lastObjectNumber } as _PdfReference, 0);
                lastObjectNumber++;
            }
            sortedCollection.set(key, value);
            lastObjectNumber = currentObjectNumber + 1;
        }
        return sortedCollection;
    }
    async _saveAsync(): Promise<Uint8Array> {
        this._uint8Chunks = [];
        this._bufferLength = 0;
        const buffer: number[] = [37, 80, 68, 70, 45];
        await this._writeStringAsync(`${this._version}${this._newLine}`, buffer);
        buffer.push(0x25, 0x83, 0x92, 0xfa, 0xfe);
        await this._writeStringAsync(this._newLine, buffer);
        let result: Uint8Array;
        let offset: number = 0;
        if (this._signatureCollection && this._signatureCollection.length > 0) {
            if (this._isCrossReferenceStream) {
                this._document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
            } else if (this._isCrossReferenceTable) {
                this._document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
            }
            const totalSignatures: number = this._signatureCollection.length;
            for (let i: number = 0; i < totalSignatures; i++) {
                this._signatureCollection[<number>i]._catalogBeginSave();
                if (i % 50 === 0) {
                    await new Promise((resolve: any) => setTimeout(resolve, 0)); // eslint-disable-line
                }
            }
        }
        if (!this._document.fileStructure.isIncrementalUpdate) {
            this._currentLength = 0;
            const objectCollection: _PdfMainObjectCollection = new _PdfMainObjectCollection(this);
            await this._writeObjectCollectionAsync(objectCollection._mainObjectCollection, buffer);
            if (buffer.length > 0) {
                await this._flushBufferAsync(buffer);
            }
            result = new Uint8Array(this._bufferLength);
        } else {
            this._currentLength = this._stream.length;
            if (this._document._fileStructure._crossReferenceType === PdfCrossReferenceType.stream) {
                await this._saveAsStreamAsync(this._currentLength, buffer);
            } else {
                await this._saveAsTableAsync(this._currentLength, buffer);
            }
            if (buffer.length > 0) {
                await this._flushBufferAsync(buffer);
            }
            result = new Uint8Array(this._stream.length + this._bufferLength);
            result.set(this._stream.bytes);
            offset = this._stream.length;
        }
        for (const chunk of this._uint8Chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        if (this._signatureCollection && this._signatureCollection.length > 0) {
            const totalSignatures: number = this._signatureCollection.length;
            for (let i: number = 0; i < totalSignatures; i++) {
                this._signature = this._signatureCollection[<number>i]._signatureDictionary;
                await this._signature._documentSavedAsync(result);
            }
        }
        if (!this._document.fileStructure.isIncrementalUpdate) {
            const stream: _PdfStream = new _PdfStream(result);
            this._stream = stream;
            this._document._stream = stream;
        }
        this._uint8Chunks = [];
        return result;
    }
    async _writeStringAsync(value: string, buffer: Array<number>): Promise<void> {
        for (let i: number = 0; i < value.length; i++) {
            buffer.push(value.charCodeAt(i) & 0xff);
            if (i % 10000 === 0) {
                await new Promise((resolve: any) => setTimeout(resolve, 0)); // eslint-disable-line
            }
        }
    }
    async _writeObjectCollectionAsync(objectCollection: Map<_PdfReference, any>, buffer: number[]): Promise<void> { // eslint-disable-line
        const objectStreamCollection: Map<_PdfReference, _PdfArchievedStream> = new Map<_PdfReference, _PdfArchievedStream>();
        this._indexes = [];
        this._indexes.push(0, 1);
        const flushThreshold: number = 512000;
        let counter: number = 0;
        objectCollection.forEach(async (value: any, key: _PdfReference) => { // eslint-disable-line
            this._writeObjectToBuffer(key, value, buffer, objectStreamCollection);
            if (buffer.length > flushThreshold) {
                await this._flushBufferAsync(buffer);
            }
            if (++counter % 100 === 0) {
                await new Promise((resolve: any) => setTimeout(resolve, 0)); // eslint-disable-line
            }
        });
        this._cacheMap.forEach(async (value: any, key: _PdfReference) => { // eslint-disable-line
            if (!objectCollection.has(key)) {
                this._writeObjectToBuffer(key, value, buffer, objectStreamCollection);
                if (buffer.length > flushThreshold) {
                    await this._flushBufferAsync(buffer);
                }
                if (++counter % 100 === 0) {
                    await new Promise((resolve: any) => setTimeout(resolve, 0)); // eslint-disable-line
                }
            }
        });
        if (this._document.fileStructure._crossReferenceType === PdfCrossReferenceType.stream) {
            this._objectStream = undefined;
            this._objectStreamCollection = objectStreamCollection;
            await this._writeXrefStreamAsync(buffer);
        } else {
            await this._writeXrefTableAsync(buffer);
        }
    }
    async _flushBufferAsync(data: number[]): Promise<void> {
        if (data.length === 0) {
            return;
        }
        const chunk: Uint8Array = new Uint8Array(data.length);
        for (let i: number = 0; i < data.length; i++) {
            chunk[<number>i] = data[<number>i];
        }
        this._uint8Chunks.push(chunk);
        this._bufferLength += chunk.length;
        data.length = 0;
    }
    async _writeXrefStreamAsync(buffer: number[]): Promise<void> {
        this._writeXrefStream(buffer);
    }
    async _writeXrefTableAsync(buffer: number[]): Promise<void> {
        this._writeXrefTable(buffer);
    }
    async _saveAsStreamAsync(currentLength: number, buffer: number[]): Promise<void> {
        const objectStreamCollection: Map<_PdfReference, _PdfArchievedStream> = new Map<_PdfReference, _PdfArchievedStream>();
        this._indexes = [];
        this._indexes.push(0, 1);
        this._offsets = [];
        const flushThreshold: number = 512000;
        let counter: number = 0;
        this._cacheMap.forEach(async (value: any, key: _PdfReference) => { // eslint-disable-line
            if (value instanceof _PdfBaseStream) {
                const dictionary: _PdfDictionary = value.dictionary;
                if (dictionary && dictionary._updated && (!dictionary.isCatalog || this._allowCatalog) && !dictionary._isProcessed) {
                    let cipher: _CipherTransform;
                    if (this._encrypt) {
                        cipher = this._encrypt._createCipherTransform(key.objectNumber, key.generationNumber);
                    }
                    this._updatedDictionary(currentLength, key, buffer, value, cipher);
                    dictionary._isProcessed = true;
                    if (buffer.length > flushThreshold) {
                        await this._flushBufferAsync(buffer);
                    }
                    if (++counter % 100 === 0) {
                        await new Promise((resolve: any) => setTimeout(resolve, 0)); // eslint-disable-line
                    }
                }
            }
        });
        this._cacheMap.forEach(async (value: any, key: _PdfReference) => { // eslint-disable-line
            if (value instanceof _PdfDictionary) {
                if ((value._updated && !value.isCatalog && !value._isProcessed) || value._isSignature) {
                    if (value._isSignature) {
                        this._updatedDictionary(currentLength, key, buffer, value);
                    } else {
                        this._writeArchiveStream(objectStreamCollection, key, value);
                    }
                } else if (value._updated && (value.isCatalog || this._allowCatalog)) {
                    this._updatedDictionary(currentLength, key, buffer, value);
                    if (buffer.length > flushThreshold) {
                        await this._flushBufferAsync(buffer);
                    }
                }
            } else if (value instanceof _PdfBaseStream) {
                const dictionary: _PdfDictionary = value.dictionary;
                if (dictionary && dictionary._updated && (!dictionary.isCatalog || this._allowCatalog) && !dictionary._isProcessed) {
                    this._updatedDictionary(currentLength, key, buffer, value);
                    if (buffer.length > flushThreshold) {
                        await this._flushBufferAsync(buffer);
                    }
                }
            }
            if (++counter % 100 === 0) {
                await new Promise((resolve: any) => setTimeout(resolve, 0)); // eslint-disable-line
            }
        });
        this._objectStream = undefined;
        this._objectStreamCollection = objectStreamCollection;
        await this._writeXrefStreamAsync(buffer);
    }
    async _saveAsTableAsync(currentLength: number, buffer: number[]): Promise<void> {
        let tempBuffer: string = '';
        const flushThreshold: number = 512000;
        let processedCount: number = 0;
        this._cacheMap.forEach(async (value: any, key: _PdfReference) => { // eslint-disable-line
            let dictionary: _PdfDictionary;
            if (value instanceof _PdfDictionary) {
                dictionary = value;
            } else if (value instanceof _PdfBaseStream) {
                dictionary = value.dictionary;
            }
            if (dictionary) {
                if ((dictionary._updated && (!dictionary.isCatalog || this._allowCatalog)) || dictionary._isSignature) {
                    const offsetString: string = this._processString((currentLength + this._bufferLength + buffer.length).toString(), 10);
                    const genString: string = this._processString(key.generationNumber.toString(), 5);
                    tempBuffer += `${key.objectNumber} 1${this._newLine}${offsetString} ${genString} n${this._newLine}`;
                    this._writeObject(value, buffer, key);
                    processedCount++;
                    if (buffer.length > flushThreshold || processedCount % 2 === 0) {
                        await this._flushBufferAsync(buffer);
                    }
                    if (processedCount % 100 === 0) {
                        await new Promise((resolve: any) => setTimeout(resolve, 0)); // eslint-disable-line
                    }
                }
            }
        });
        const newStartXref: number = this._bufferLength + buffer.length + currentLength;
        await this._writeStringAsync(`xref${this._newLine}0 1${this._newLine}0000000000 65535 f${this._newLine}`, buffer);
        await this._writeXrefAsync(buffer, tempBuffer, newStartXref);
        if (buffer.length > 0) {
            await this._flushBufferAsync(buffer);
        }
    }
    async _writeXrefAsync(buffer: number[], tempBuffer: string, newStartXref: number): Promise<void> {
        this._writeXref(buffer, tempBuffer, newStartXref);
    }
}
/**
 * Represents metadata for a single object entry in the XRef table/stream.
 *
 * @private
 */
class _PdfObjectInformation {
    /** Object byte offset or object stream index. */
    offset: number;
    /** Generation number for the entry. */
    gen: number;
    /** Whether the object is stored uncompressed (in file) */
    uncompressed: boolean;
    /** Whether the entry is free. */
    free: boolean;
}
/**
 * Internal state used when parsing an XRef table across reads.
 *
 * @private
 */
class _PdfCrossTableState {
    /** Current entry index within the subsection. */
    entryNum: number;
    /** Stream position at start of subsection. */
    streamPos: number;
    /** Parser buffer state (first). */
    parserBuf1: any; // eslint-disable-line
    /** Parser buffer state (second). */
    parserBuf2: any; // eslint-disable-line
    /** First entry number of the subsection. */
    firstEntryNum: number;
    /** Number of entries in the subsection. */
    entryCount: number;
}
/**
 * State for parsing cross-reference streams (byte widths and ranges).
 *
 * @private
 */
class _PdfStreamState {
    /** Entry ranges (pairs of first,n). */
    entryRanges: number[];
    /** Byte widths for fields in the stream entries. */
    byteWidths: number[];
    /** Current entry index within the active range. */
    entryNum: number;
    /** Stream position used when resuming parsing. */
    streamPos: number;
}
/**
 * Helper that collects objects to write into an archived object stream (.objstm).
 *
 * @private
 */
class _PdfArchievedStream {
    /** Serialized index lines for the archive stream. */
    _indexes: string = '';
    /** Number of objects stored in this archived stream. */
    _length: number = 0;
    /** Buffer of bytes for the archived stream content. */
    _updatedStream: number[];
    /** Parent cross-reference instance. */
    _crossReference: _PdfCrossReference;
    /** Reference assigned to the archived object stream. */
    _reference: _PdfReference;
    /** Accumulated XRef index text for the archive. */
    _archiveXRef: string;
    /** Collection of object numbers included in this archive. */
    _collection: number[];
    /** Offset where this archive will be written. */
    _archiveOffset: number;
    /**
     * Initializes a new archived stream helper.
     *
     * @private
     * @param {_PdfCrossReference} crossReference - Owner cross-reference.
     */
    constructor(crossReference: _PdfCrossReference) {
        this._crossReference = crossReference;
        this._reference = crossReference._getNextReference();
        this._archiveXRef = '';
        this._updatedStream = [];
        this._collection = [];
    }
    /**
     * Appends an object to the archived stream.
     *
     * @private
     * @param {_PdfReference} key - Reference of the object.
     * @param {_PdfDictionary} value - Object value to write.
     * @returns {void} nothing.
     */
    _writeObject(key: _PdfReference, value: _PdfDictionary): void {
        this._archiveXRef += `${key.objectNumber} ${this._updatedStream.length}${this._crossReference._newLine}`;
        this._collection.push(key.objectNumber, 1);
        this._crossReference._writeObject(value, this._updatedStream);
        this._length++;
    }
    /**
     * Saves the archived stream into the provided buffer and updates offsets.
     *
     * @private
     * @param {number[]} buffer - Output buffer to append to.
     * @param {number} currentLength - Current length before writing.
     * @returns {void} nothing.
     */
    _save(buffer: number[], currentLength: number): void {
        const data: Array<number> = [];
        this._crossReference._writeString(this._archiveXRef, data);
        this._crossReference._writeBytes(this._updatedStream, data);
        const newDict: _PdfDictionary = new _PdfDictionary(this._crossReference);
        newDict.set('Type', _PdfName.get('ObjStm'));
        newDict.set('N', this._length);
        newDict.set('First', this._archiveXRef.length);
        newDict.set('Length', data.length);
        const archiveStream: _PdfStream = new _PdfStream(data, newDict, 0, data.length);
        this._archiveOffset = this._crossReference._bufferLength + currentLength + buffer.length;
        let cipher: _CipherTransform;
        if (this._crossReference._encrypt) {
            cipher = this._crossReference._encrypt._createCipherTransform(this._reference.objectNumber, this._reference.generationNumber);
        }
        this._crossReference._writeObject(archiveStream, buffer, this._reference, cipher);
    }
}
/**
 * Represents the main object collection that will be written into the file.
 * It collects and orders objects to be saved.
 *
 * @private
 */
class _PdfMainObjectCollection {
    /** Pointer into the ordered collection. */
    _pointer: number = 0;
    /** Array of references included. */
    _reference: _PdfReference[];
    /** Backing cache map from the cross-reference. */
    _cache: Map<_PdfReference, any>; // eslint-disable-line
    /** Parent cross-reference instance. */
    _crossReference: _PdfCrossReference;
    /** Map of main objects to be written. */
    _mainObjectCollection: Map<_PdfReference, any>; // eslint-disable-line
    /**
     * Initializes a new instance of the `_PdfMainObjectCollection` class.
     *
     * @private
     * @param { _PdfCrossReference } collection - The cross-reference collection containing the PDF objects.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Create a new object collection instance
     * let mainObjectCollection = new _PdfMainObjectCollection(document._crossReference);
     * // Access the main object collection
     * let objects = mainObjectCollection._mainObjectCollection;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    constructor(collection: _PdfCrossReference) {
        if (!(collection._cacheMap instanceof Map)) {
            throw new Error('Expected _cacheMap to be a Map.');
        }
        this._reference = [];
        this._cache = collection._cacheMap;
        this._mainObjectCollection = new Map<_PdfReference, any>(); // eslint-disable-line
        let foundCatalog: boolean = false;
        this._crossReference = collection;
        this._cache.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
            if (!foundCatalog && value instanceof _PdfDictionary && value.isCatalog) {
                this._addToMainObjectCollection(key, value);
                foundCatalog = true;
            }
        });
        this._parseObjectCollection();
    }
    /**
     * Parses the accumulated main object collection, expanding referenced objects.
     *
     * @private
     * @returns {Map<_PdfReference, any>} The populated main object collection.
     */
    _parseObjectCollection(): Map<_PdfReference, any> { // eslint-disable-line
        while (this._pointer < this._mainObjectCollection.size) {
            const collection: Map<_PdfReference, any> = new Map<_PdfReference, any>(); // eslint-disable-line
            let currentIndex: number = 0;
            this._mainObjectCollection.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
                if (currentIndex === this._pointer) {
                    collection.set(key, value);
                    this._parse(key, value);
                }
                currentIndex++;
            });
            this._pointer++;
        }
        this._addReferencesToMainCollection();
        return this._mainObjectCollection;
    }
    /**
     * Adds an object to the main collection.
     *
     * @private
     * @param {_PdfReference} key - Object reference.
     * @param {any} value - Object value.
     * @returns {void} nothing.
     */
    _addToMainObjectCollection(key: _PdfReference, value: any): void { // eslint-disable-line
        this._reference.push(key);
        this._mainObjectCollection.set(key, value);
    }
    /**
     * Fetches a reference and parses it into the main collection.
     *
     * @private
     * @param {_PdfReference} reference - Reference to fetch and parse.
     * @returns {void} nothing.
     */
    _parseFetchValue(reference: _PdfReference): void {
        const fetchvalue: any = this._crossReference._fetch(reference); // eslint-disable-line
        this._parse(reference, fetchvalue);
    }
    /**
     * Internal parser that inspects a value and ensures referenced objects are included.
     *
     * @private
     * @param {_PdfReference} key - Reference for the value.
     * @param {any} value - Value to inspect.
     * @returns {void} nothing.
     */
    _parse(key: _PdfReference, value: any): void  { // eslint-disable-line
        if (value instanceof _PdfDictionary) {
            this._parseDictionary(value);
        } else if (value instanceof _PdfBaseStream) {
            this._parseStream(key, value);
        } else if (value instanceof _PdfReference) {
            this._parseFetchValue(value);
        } else if (Array.isArray(value) && value.length > 0) {
            const isPdfReferenceArray: any = value.every((value: any) => value instanceof _PdfReference); // eslint-disable-line
            if (isPdfReferenceArray) {
                value.forEach((ref: any) => this._parseFetchValue(ref)); // eslint-disable-line
            } else {
                value.forEach((item: any) => { // eslint-disable-line
                    if (item instanceof _PdfReference) {
                        this._parseFetchValue(item);
                    }
                });
                if (this._reference.indexOf(key) === -1 && !this._mainObjectCollection.has(key)) {
                    this._addToMainObjectCollection(key, value);
                }
            }
        }
        else if (typeof value === 'number') {
            if (this._reference.indexOf(key) === -1 && !this._mainObjectCollection.has(key)) {
                this._addToMainObjectCollection(key, value);
            }
        }
    }
    /**
     * Adds any remaining cached objects into the main collection.
     *
     * @private
     * @returns {void} nothing.
     */
    _addReferencesToMainCollection(): void {
        const objectsToWrite: Array<{ key: _PdfReference, value: any }> = []; // eslint-disable-line
        this._cache.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
            if (!this._mainObjectCollection.has(key)) {
                objectsToWrite.push({ key, value });
            }
        });
        objectsToWrite.forEach(({ key, value }: any) => { // eslint-disable-line
            this._addToMainObjectCollection(key, value);
        });
    }
    /**
     * Walks a dictionary and ensures referenced objects are included.
     *
     * @private
     * @param {_PdfDictionary} element - Dictionary to scan.
     * @returns {void} nothing.
     */
    _parseDictionary(element: _PdfDictionary): void {
        element.forEach((key: string, value: any) => { // eslint-disable-line
            const processReference: any = (ref: _PdfReference) => { // eslint-disable-line
                if (!this._mainObjectCollection.has(ref) && this._reference.indexOf(ref) === -1) {
                    let fetchValue: any = this._crossReference._fetch(ref); // eslint-disable-line
                    if (fetchValue instanceof _PdfReference) {
                        fetchValue = this._crossReference._fetch(fetchValue);
                    }
                    if (fetchValue instanceof _PdfBaseStream) {
                        this._parseStream(ref, fetchValue);
                    } else {
                        this._addToMainObjectCollection(ref, fetchValue);
                    }
                }
            };
            if (value instanceof _PdfReference) {
                processReference(value);
            } else if (Array.isArray(value)) {
                value.forEach((item: any) => { // eslint-disable-line
                    if (item instanceof _PdfReference) {
                        processReference(item);
                    } else if (item instanceof _PdfDictionary) {
                        this._parseDictionary(item);
                    }
                });
            } else if (value instanceof _PdfDictionary) {
                this._parseDictionary(value);
            }
        });
    }
    /**
     * Parses a stream object dictionary and includes its referenced objects.
     *
     * @private
     * @param {_PdfReference} key - Reference of the stream.
     * @param {_PdfBaseStream} element - The stream to parse.
     * @returns {void} nothing.
     */
    _parseStream(key: _PdfReference, element: _PdfBaseStream): void {
        this._parseDictionary(element.dictionary);
        if (this._reference.indexOf(key) === -1 && !this._mainObjectCollection.has(key)) {
            const type: _PdfName = element.dictionary.get('Type');
            const subtype: _PdfName = element.dictionary.get('Subtype');
            const isUpdated: boolean = element.dictionary._updated;
            let uncompressedValue: _PdfBaseStream;
            if (isUpdated || (type && (type.name === 'XObject' || type.name === 'Metadata') &&
            (subtype.name === 'Form' || subtype.name === 'XML'))) {
                uncompressedValue = this._crossReference._fetch(key);
            } else {
                uncompressedValue = this._crossReference._fetch(key, true);
                uncompressedValue._isCompress = false;
            }
            this._addToMainObjectCollection(key, uncompressedValue);
        }
    }
}
