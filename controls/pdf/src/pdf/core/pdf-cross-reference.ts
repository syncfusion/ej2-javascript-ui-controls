import { _PdfStream } from './base-stream';
import { _PdfDictionary, _PdfReferenceSet, _isCommand, _PdfReference, _PdfCommand, _PdfName } from './pdf-primitives';
import { BaseException, FormatError, _escapePdfName, _bytesToString, ParserEndOfFileException, _numberToString, _stringToPdfString, _stringToBigEndianBytes, _getSize, _compressStream, _hasUnicodeCharacters, _stringToBytes, _byteArrayToHexString } from './utils';
import { _PdfParser, _PdfLexicalOperator } from './pdf-parser';
import { _PdfBaseStream } from './base-stream';
import { PdfCrossReferenceType, PdfEncryptionType, PdfPermissionFlag, PdfCertificationFlag } from './enumerator';
import { PdfDocument } from './pdf-document';
import { _PdfEncryptionHelper, _PdfEncryptor } from './security/encryptor';
import { _PdfSignatureDictionary } from './security/digital-signature/signature/signature-dictionary';
import { PdfSignature } from './security/digital-signature/signature/pdf-signature';
import { _CipherTransform } from './security/encryptors/cipher-tranform';
import { _MD5 } from './security/encryptors/messageDigest5';
import { PdfSecurityOptions } from './pdf-type';
import { initializeTelemetryFeature } from '@syncfusion/ej2-base';
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
     * Encryptor instance when document is newly encrypted.
     *
     * @private
     */
    _newEncrypt: _PdfEncryptor;
    /**
     * Encryption state for document writing operations.
     *
     * @private
     */
    _encryptionState: PdfSecurityOptions;
    /**
     * Indicates whether encryption needs to be updated or not.
     *
     * @private
     */
    _isUpdateEncrypt: boolean = false;
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
    _entriesHistory: _PdfObjectInformation[][] = [];
    _revisionCounter: number = 0;
    _currentRevisionId: number = 0;
    constructor(document: PdfDocument, password?: string) {
        this._password = password;
        this._document = document;
        this._stream = document._stream;
        this._entries = [];
        this._entriesHistory = [];
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
            initializeTelemetryFeature('DecryptPDF', 'PDFLibrary');
            this._document._isEncrypted = true;
            this._ids = trailerDictionary.get('ID');
            this._permissionFlags = encrypt.get('P');
            const fileId: string = (this._ids && this._ids.length > 0 && typeof this._ids[0] === 'string') ? this._ids[0] : (this._ids = [this._generateDocumentId()])[0];
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
        const xrefEntry: _PdfObjectInformation = this._entries[<number>i];
        if (xrefEntry && !xrefEntry.free && Number.isFinite(xrefEntry.offset)) {
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
                this._currentRevisionId = this._revisionCounter++;
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
                        info.revisionId = -1;
                        this._recordEntryHistory(objectNumber, info, false);
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
                entry.revisionId = this._currentRevisionId;
                this._recordEntryHistory(i + first, entry, true);
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
                    entry.compressed = true;
                    break;
                default:
                    throw new FormatError(`Invalid XRef entry type: ${type}`);
                }
                if (!this._entries[first + i]) {
                    this._entries[first + i] = entry;
                }
                entry.revisionId = this._currentRevisionId;
                this._recordEntryHistory(first + i, entry, true);
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
        if (this._isUpdateEncrypt) {
            this._document.fileStructure.isIncrementalUpdate = false;
            this._document.fileStructure._crossReferenceType = PdfCrossReferenceType.stream;
        }
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
                const signature: PdfSignature = this._signatureCollection[<number>i];
                if (signature._enabledValiadtionAppearance) {
                    signature._setValidationAppearance();
                }
                signature._catalogBeginSave();
            }
        }
        if (!this._document.fileStructure.isIncrementalUpdate) {
            this._currentLength = 0;
            this._objectCollection = new _PdfMainObjectCollection(this);
            if (this._isUpdateEncrypt && this._newEncrypt) {
                this._encrypt = this._newEncrypt;
            }
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
        if (this._ids && this._ids.length > 0) {
            this._ids = [
                this._ids[0],
                this._computeMessageDigest(this._currentLength)
            ];
            newXref.set('ID', this._ids);
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
        } else if (Array.isArray(obj)) {
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
            if (dictionary || Array.isArray(value)) {
                if (Array.isArray(value) ||
                (dictionary._updated && (!dictionary.isCatalog || this._allowCatalog) || dictionary._isSignature)) {
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
                if (this._isUpdateEncrypt) {
                    if (dictionary && !dictionary.isCatalog) {
                        if (this._encrypt) {
                            cipher = this._encrypt._createCipherTransform(key.objectNumber, key.generationNumber);
                        }
                        dictionary._updated = false;
                    }
                } else if (dictionary && dictionary._updated && !dictionary.isCatalog) {
                    if (this._encrypt) {
                        cipher = this._encrypt._createCipherTransform(key.objectNumber, key.generationNumber);
                    }
                    dictionary._updated = false;
                }
            } else if (!Array.isArray(value) && typeof value !== 'number' && typeof value !== 'string') {
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
    /**
     * Creates encryption dictionary with all required fields based on security options.
     *
     * @private
     * @param {PdfSecurityOptions} options - Security configuration options.
     * @param {string} userPassword - User password.
     * @param {string} ownerPassword - Owner password.
     * @returns {_PdfDictionary} The encryption dictionary.
     */
    _createEncryptDictionary(options: PdfSecurityOptions, userPassword: string, ownerPassword: string): _PdfDictionary {
        const dict: _PdfDictionary = new _PdfDictionary();
        const helper: _PdfEncryptionHelper = new _PdfEncryptionHelper();
        const fileId: string = (this._ids && this._ids.length > 0 && typeof this._ids[0] === 'string')
            ? this._ids[0]
            : (this._ids = [this._generateDocumentId()])[0];
        const fileIdBytes: Uint8Array = _stringToBytes(fileId, false, true) as Uint8Array;
        dict.set('Filter', new _PdfName('Standard'));
        const { version, revision, length } = this._mapEncryptionTypeToVRL(options.encryptionType);
        dict.set('V', version);
        dict.set('R', revision);
        dict.set('Length', length);
        const permissions: number = options.permissions | PdfPermissionFlag.default;
        dict.set('P', permissions);
        if (version >= 4) {
            const cf: _PdfDictionary = new _PdfDictionary();
            const stdcf: _PdfDictionary = new _PdfDictionary();
            if (version === 4) {
                stdcf.set('CFM', new _PdfName('AESV2'));
                stdcf.set('Length', 16);
            } else if (version === 5) {
                stdcf.set('CFM', new _PdfName('AESV3'));
                stdcf.set('Length', 32);
            }
            cf.set('StdCF', stdcf);
            dict.set('CF', cf);
            stdcf.set('AuthEvent', new _PdfName('DocOpen'));
            dict.set('StmF', new _PdfName('StdCF'));
            dict.set('StrF', new _PdfName('StdCF'));
        }
        if (version < 5) {
            const userBytes: Uint8Array = _stringToBytes(userPassword || '', false, true) as Uint8Array;
            const ownerBytes: Uint8Array = _stringToBytes(ownerPassword || userPassword || '', false, true) as Uint8Array;
            const ownerValue: Uint8Array = helper._computeOwnerPassword(ownerBytes, userBytes, revision, length);
            dict.set('O', _bytesToString(ownerValue));
            const encryptionKey: Uint8Array = helper._generateKey(fileIdBytes, userBytes, ownerValue, permissions, revision, length,
                                                                  true);
            const userValue: Uint8Array = helper._computeUserPassword(encryptionKey, fileIdBytes, revision);
            dict.set('U', _bytesToString(userValue));
        }
        if (version === 5) {
            const encryptionKey: Uint8Array = new Uint8Array(32);
            if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                crypto.getRandomValues(encryptionKey);
            } else {
                for (let i: number = 0; i < 32; i++) {
                    encryptionKey[<number>i] = Math.floor(Math.random() * 256);
                }
            }
            const uSalt: Uint8Array = new Uint8Array(16);
            if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                crypto.getRandomValues(uSalt);
            } else {
                for (let i: number = 0; i < 16; i++) {
                    uSalt[<number>i] = Math.floor(Math.random() * 256);
                }
            }
            const oSalt: Uint8Array = new Uint8Array(16);
            if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                crypto.getRandomValues(oSalt);
            } else {
                for (let i: number = 0; i < 16; i++) {
                    oSalt[<number>i] = Math.floor(Math.random() * 256);
                }
            }
            const userKeySalt: Uint8Array = uSalt.subarray(8, 16);
            const ownerKeySalt: Uint8Array = oSalt.subarray(8, 16);
            const uValue: Uint8Array = helper._computeUserPassword256(userPassword, uSalt, revision);
            dict.set('U', _bytesToString(uValue));
            const oValue: Uint8Array = helper._computeOwnerPassword256(ownerPassword, uValue, oSalt, revision);
            dict.set('O', _bytesToString(oValue));
            const ueValue: Uint8Array = helper._computeUserEncryptionKey(userPassword, userKeySalt, encryptionKey, revision);
            dict.set('UE', _bytesToString(ueValue));
            const oeValue: Uint8Array = helper._computeOwnerEncryptionKey(ownerPassword, ownerKeySalt, uValue, encryptionKey, revision);
            dict.set('OE', _bytesToString(oeValue));
            const permsValue: Uint8Array = helper._computeEncryptedPermissions(permissions, encryptionKey, true);
            dict.set('Perms', _bytesToString(permsValue));
        }
        return dict;
    }
    /**
     * Generates a unique document identifier by creating random bytes.
     *
     * @private
     * @returns {string} The generated document ID as a hexadecimal string.
     */
    _generateDocumentId(): string {
        const random: Uint8Array = new Uint8Array(16);
        if (typeof crypto !== 'undefined' && crypto !== null) {
            crypto.getRandomValues(random);
        } else {
            for (let i: number = 0; i < 16; i++) {
                random[<number>i] = Math.floor(256 * Math.random());
            }
        }
        const md5: _MD5 = new _MD5();
        const hash: Uint8Array = md5.hash(random, 0, random.length);
        return _bytesToString(hash);
    }
    /**
     * Maps encryption type enum to V/R/Length values.
     *
     * @private
     * @param {PdfEncryptionType} type - Encryption type.
     * @returns {{version: number, revision: number, length: number}} V, R, and key length values.
     */
    _mapEncryptionTypeToVRL(type: PdfEncryptionType): { version: number; revision: number; length: number } {
        switch (type) {
        case PdfEncryptionType.rc4Bit40:
            return { version: 1, revision: 2, length: 40 };
        case PdfEncryptionType.rc4Bit128:
            return { version: 2, revision: 3, length: 128 };
        case PdfEncryptionType.aesBit128:
            return { version: 4, revision: 4, length: 128 };
        case PdfEncryptionType.aesBit256Rev5:
            return { version: 5, revision: 5, length: 256 };
        case PdfEncryptionType.aesBit256Rev6:
            return { version: 5, revision: 6, length: 256 };
        default:
            throw new FormatError('Unsupported encryption type');
        }
    }
    /**
     * Adds encryption dictionary to trailer and registers as indirect object.
     *
     * @private
     * @param {_PdfDictionary} dictionary - Encryption dictionary to add.
     * @returns {void} Nothing.
     */
    _addEncryptDictionaryToTrailer(dictionary: _PdfDictionary): void {
        if (!this._trailer) {
            throw new FormatError('Trailer not initialized');
        }
        const ref: _PdfReference = this._getNextReference();
        this._cacheMap.set(ref, dictionary);
        this._trailer.set('Encrypt', ref);
        if (this._ids && this._ids.length > 0) {
            this._trailer.set('ID', [ `${this._ids[0]}`, `${this._ids[0]}`]);
        }
    }
    /**
     * Initializes encryption state for new documents.
     *
     * @private
     * @param {PdfSecurityOptions} options - Security configuration options.
     * @returns {void} Nothing.
     */
    _initializeEncryptionState(options: PdfSecurityOptions): void {
        const userPassword: string = options.userPassword || '';
        const ownerPassword: string = options.ownerPassword || userPassword;
        const newPassword: string = userPassword || ownerPassword;
        if (newPassword && this._password !== newPassword) {
            this._password = newPassword;
        }
        if (!options.encryptionType && options.encryptionType !== 0) {
            options.encryptionType = PdfEncryptionType.rc4Bit40;
        }
        if (!options.permissions && options.permissions !== 0) {
            options.permissions = PdfPermissionFlag.default;
        }
        const dictionary: _PdfDictionary = this._createEncryptDictionary(options, userPassword, ownerPassword);
        this._newEncrypt = new _PdfEncryptor(dictionary, this._ids[0], this._password);
        this._encryptionState = options;
        this._isUpdateEncrypt = true;
        this._addEncryptDictionaryToTrailer(dictionary);
    }
    /**
     * Updates encryption settings on loaded documents.
     *
     * @private
     * @param {PdfSecurityOptions} options - New security configuration options.
     * @returns {void} Nothing.
     */
    _updateEncryptionSettings(options: PdfSecurityOptions): void {
        if (!this._trailer) {
            throw new FormatError('Trailer not initialized');
        }
        const parsedOptions: PdfSecurityOptions = this._document.getSecurity();
        if (!options.encryptionType) {
            options.encryptionType = parsedOptions.encryptionType;
        }
        if (!options.encryptionType && options.encryptionType !== 0) {
            options.encryptionType = PdfEncryptionType.rc4Bit40;
        }
        if (!options.permissions && options.permissions !== 0) {
            options.permissions = PdfPermissionFlag.default;
        }
        const userPassword: string = options.userPassword || '';
        const ownerPassword: string = options.ownerPassword || userPassword;
        const encryptRef: any = this._trailer._map['Encrypt']; // eslint-disable-line
        const dictionary: _PdfDictionary = this._createEncryptDictionary(options, userPassword, ownerPassword);
        if (encryptRef && encryptRef instanceof _PdfReference) {
            this._cacheMap.set(encryptRef, dictionary);
        } else {
            this._addEncryptDictionaryToTrailer(dictionary);
        }
        this._newEncrypt = new _PdfEncryptor(dictionary, this._ids[0], userPassword || ownerPassword);
        this._isUpdateEncrypt = true;
        this._encryptionState = options;
    }
    /**
     * Retrieves the object associated with the specified cross-reference entry.
     *
     * @param {_PdfReference} ref The reference of the object to retrieve.
     * @param {_PdfObjectInformation} xrefEntry The cross-reference entry that describes the object location.
     * @param {boolean} [suppressEncryption] Indicates whether decryption should be skipped when retrieving the object.
     * @returns {any} The resolved PDF object; otherwise, null if the object cannot be found.
     * @private
     */
    _fetchAtEntry(ref: _PdfReference, xrefEntry: _PdfObjectInformation, suppressEncryption?: boolean): any { // eslint-disable-line
        if (!xrefEntry || xrefEntry.free) {
            return null;
        }
        if (xrefEntry.uncompressed) {
            return this._fetchUncompressedAtOffset(ref, xrefEntry, suppressEncryption);
        }
        if (xrefEntry.compressed) {
            return this._fetchCompressedAtEntry(ref, xrefEntry);
        }
        return null;
    }
    /**
     * Retrieves an uncompressed PDF object from the specified cross-reference entry.
     *
     * @param {_PdfReference} reference The reference of the object to retrieve.
     * @param {_PdfObjectInformation} xrefEntry The cross-reference entry containing the object's offset and generation information.
     * @param {boolean} [suppressEncryption] Indicates whether decryption should be skipped when retrieving the object.
     * @returns {any} The retrieved PDF object.
     * @throws {Error} Thrown when the generation number does not match the cross-reference entry.
     * @throws {BaseException} Thrown when the cross-reference entry is invalid or the object cannot be parsed.
     * @private
     */
    _fetchUncompressedAtOffset(reference: _PdfReference, xrefEntry: _PdfObjectInformation,
        suppressEncryption?: boolean): any {  // eslint-disable-line
        const generationNumber: number = reference.generationNumber;
        const objectNumber: number = reference.objectNumber;
        if (xrefEntry.gen !== generationNumber) {
            throw new Error(`Inconsistent generation in XRef: ${reference}`);
        }
        const stream: _PdfStream = this._stream.makeSubStream(xrefEntry.offset + this._stream.start, undefined);
        const parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(stream), this, true, false, this._encrypt);
        const obj1: any = parser.getObject();  // eslint-disable-line
        const obj2: any = parser.getObject();  // eslint-disable-line
        const obj3: any = parser.getObject();  // eslint-disable-line
        if (obj1 !== objectNumber || obj2 !== generationNumber || typeof obj3 === 'undefined' || obj3 === null) {
            throw new BaseException(`Bad uncompressed XRef entry: ${reference}`, 'XRefEntryException');
        }
        let entry: any;  // eslint-disable-line
        if (this._encrypt && !suppressEncryption) {
            entry = parser.getObject(reference.objectNumber, reference.generationNumber, true);
        } else {
            entry = parser.getObject(null, suppressEncryption);
        }
        return entry;
    }
    /**
     * Retrieves the cross-reference history entry for the specified object and revision.
     *
     * @param {number} objNum The object number whose history entry is to be retrieved.
     * @param {number} revisionId The revision identifier associated with the history entry.
     * @returns {_PdfObjectInformation | undefined} The matching history entry; otherwise, undefined if no entry exists for the specified revision.
     * @private
     */
    _getHistoryEntryForRevision(objNum: number, revisionId: number): _PdfObjectInformation | undefined {
        const history: _PdfObjectInformation[] = this._entriesHistory[<number>objNum];
        if (!history) {
            return history.find((e: any) => e && e.revisionId === revisionId);  // eslint-disable-line
        }
        return undefined;
    }
    /**
     * Retrieves a compressed PDF object from an object stream using the specified
     * cross-reference entry.
     *
     * @param {_PdfReference} ref The reference of the object to retrieve.
     * @param {_PdfObjectInformation} xrefEntry The cross-reference entry describing the compressed object.
     * @returns {any} The retrieved PDF object from the object stream.
     * @throws {FormatError} Thrown when the object stream contains invalid data or parameters.
     * @throws {BaseException} Thrown when the compressed object cannot be located or parsed.
     * @private
     */
    _fetchCompressedAtEntry(ref: _PdfReference, xrefEntry: _PdfObjectInformation): any { // eslint-disable-line
        const objStmObjNum: number = xrefEntry.offset;
        let indexObject: number = xrefEntry.gen;
        const revisionId: number = xrefEntry.revisionId ? xrefEntry.revisionId : 0;
        const objStmEntry: _PdfObjectInformation = this._getHistoryEntryForRevision(objStmObjNum, revisionId);
        if (!objStmEntry) {
            return this._fetchCompressed(ref, xrefEntry);
        }
        const objStmRef: _PdfReference = _PdfReference.get(objStmObjNum, objStmEntry.gen || 0);
        const objStmStreamAny: any = this._fetchAtEntry(objStmRef, objStmEntry);  // eslint-disable-line
        const objStmStream: _PdfBaseStream =
            objStmStreamAny instanceof _PdfBaseStream ? objStmStreamAny : undefined as any; // eslint-disable-line
        if (!objStmStream || !objStmStream.dictionary) {
            throw new FormatError('bad ObjStm stream');
        }
        const first: number = objStmStream.dictionary.get('First');
        const n: number = objStmStream.dictionary.get('N');
        if (!Number.isInteger(first) || !Number.isInteger(n)) {
            throw new FormatError('invalid First/N parameters for ObjStm stream');
        }
        const parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(objStmStream as any), this, true); // eslint-disable-line
        const nums: number[] = new Array(n);
        const offsets: number[] = new Array(n);
        for (let i: number = 0; i < n; i++) {
            const num: any = parser.getObject();  // eslint-disable-line
            const off: any = parser.getObject();  // eslint-disable-line
            if (!Number.isInteger(num) || !Number.isInteger(off)) {
                throw new FormatError(`invalid object number/offset in ObjectStream: ${num}, ${off}`);
            }
            nums[<number>i] = num;
            offsets[<number>i] = off;
        }
        if (indexObject < 0 || indexObject >= n || nums[<number>indexObject] !== ref.objectNumber) {
            const realIndex: number = nums.indexOf(ref.objectNumber);
            if (realIndex < 0) {
                throw new BaseException(`Bad (compressed) XRef entry: ${ref}`, 'XRefEntryException');
            }
            indexObject = realIndex;
        }
        const objDataStart: number = first;
        const objStart: number = objDataStart + offsets[<number>indexObject];
        const objLen: number = (indexObject < n - 1) ? (offsets[indexObject + 1] - offsets[<number>indexObject]) : undefined;
        if (objLen !== undefined && objLen < 0) {
            throw new FormatError('Invalid offset ordering in ObjStm');
        }
        const sub: _PdfBaseStream = objStmStream.makeSubStream(objStart, objLen, objStmStream.dictionary) as _PdfBaseStream;
        const objParser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(sub as any), this, true);  // eslint-disable-line
        const obj: any = objParser.getObject();  // eslint-disable-line
        if (typeof obj === 'undefined') {
            throw new BaseException(`Bad compressed XRef entry: ${ref}`, 'XRefEntryException');
        }
        return obj;
    }
    /**
     * Records a cross-reference entry in the object history for the specified object number.
     *
     * @param {number} index The object number whose history is being recorded.
     * @param {_PdfObjectInformation} entry The cross-reference entry to add to the history.
     * @param {boolean} latestFirstEncounter Indicates whether the entry belongs to the latest encountered revision.
     * @returns {void}
     * @private
     */
    _recordEntryHistory(index: number, entry: _PdfObjectInformation, latestFirstEncounter: boolean): void {
        if (!this._entriesHistory[<number>index]) {
            this._entriesHistory[<number>index] = [];
        }
        const list: _PdfObjectInformation[] = this._entriesHistory[<number>index];
        if (latestFirstEncounter) {
            list.push(entry);
        } else {
            list.unshift(entry);
        }
    }
    /**
     * Retrieves the history entries for the specified object, including the latest entry
     * and the entry associated with the signed byte range, if available.
     *
     * @param {number} objectNumber The object number whose history entries are to be retrieved.
     * @param {number[]} [byteRange] The signature byte range used to locate the entry within the signed revision.
     * @returns {object} An object containing the latest history entry and the entry that falls within the specified byte range.
     * @private
     */
    _getEntryVersions(objectNumber: number, byteRange?: number[]): { inside?: _PdfObjectInformation; latest?: _PdfObjectInformation } {
        const history: _PdfObjectInformation[] = this._entriesHistory[<number>objectNumber];
        const result: { inside?: _PdfObjectInformation; latest?: _PdfObjectInformation } = {};
        if (!history || history.length === 0) {
            return result;
        }
        result.latest = history[0];
        if (Array.isArray(byteRange) && byteRange.length >= 4) {
            const [s1, l1, s2, l2]: number[] = byteRange;
            const inRange: any = (off: number) =>   // eslint-disable-line
                (off >= s1 && off < s1 + l1) || (off >= s2 && off < s2 + l2);
            for (const e of history) {
                const phys: number = this._getPhysicalOffsetForEntry(e);
                if (Number.isFinite(phys) && inRange(phys)) {
                    result.inside = e;
                    break;
                }
            }
        }
        return result;
    }
    /**
     * Gets the physical file offset associated with the specified cross-reference entry.
     *
     * @param {_PdfObjectInformation} entry The cross-reference entry whose physical offset is to be determined.
     * @returns {number} The physical offset of the object in the PDF file; otherwise, undefined if the offset cannot be resolved.
     * @private
     */
    _getPhysicalOffsetForEntry(entry: _PdfObjectInformation): number {
        if (entry.uncompressed) {
            return entry.offset;
        }
        if (entry.compressed) {
            const objStmObjNum: number = entry.offset;
            const rev: number = entry.revisionId;
            if (Number.isInteger(rev)) {
                const hist: _PdfObjectInformation[] = this._entriesHistory[<number>objStmObjNum];
                if (hist) {
                    const sameRev: _PdfObjectInformation = hist.find((e: any) => e && e.revisionId === rev);  // eslint-disable-line
                    if (sameRev && sameRev.uncompressed) {
                        return sameRev.offset;
                    }
                }
            }
            const latestContainer: _PdfObjectInformation = this._entries[<number>objStmObjNum];
            if (latestContainer && latestContainer.uncompressed) {
                return latestContainer.offset;
            }
        }
        return undefined;
    }
    /**
     * Retrieves the object referenced by the specified reference from a particular document revision.
     *
     * @param {_PdfReference} ref The reference of the object to retrieve.
     * @param {number} revisionId The revision identifier from which to fetch the object.
     * @returns {any} The resolved PDF object; otherwise, null if the object cannot be found.
     * @private
     */
    _fetchReferenceInRevision(ref: _PdfReference, revisionId: number): any {  // eslint-disable-line
        const objNum: number = ref.objectNumber;
        const hist: _PdfObjectInformation[] = this._entriesHistory[<number>objNum];
        let entry: _PdfObjectInformation;
        if (hist && Number.isInteger(revisionId)) {
            entry = hist.find((e: any) => e && e.revisionId === revisionId);  // eslint-disable-line
        }
        if (!entry) {
            entry = this._entries[<number>objNum];
        }
        if (!entry) {
            return null;
        }
        const refForEntry: _PdfReference = _PdfReference.get(objNum, entry.gen || 0);
        return this._fetchAtEntry(refForEntry, entry);
    }
    /**
     * Determines whether the specified value is a PDF reference.
     *
     * @param {any} v The value to evaluate.
     * @returns {boolean} true if the value is a PDF reference; otherwise, false.
     * @private
     */
    _isRef(v: any): v is _PdfReference {  // eslint-disable-line
        return v instanceof _PdfReference;
    }
    /**
     * Determines whether the specified value is a PDF name object.
     *
     * @param {any} v The value to evaluate.
     * @returns {boolean} true if the value is a PDF name object; otherwise, false.
     * @private
     */
    _isName(v: any): v is _PdfName {  // eslint-disable-line
        return v instanceof _PdfName;
    }
    /**
     * Determines whether the specified value is a PDF dictionary.
     *
     * @param {any} v The value to evaluate.
     * @returns {boolean} true if the value is a PDF dictionary; otherwise, false.
     * @private
     */
    _isDict(v: any): v is _PdfDictionary {  // eslint-disable-line
        return v instanceof _PdfDictionary;
    }
    /**
     * Determines whether the specified value is a PDF stream.
     *
     * @param {any} v The value to evaluate.
     * @returns {boolean} true if the value is a PDF stream; otherwise, false.
     * @private
     */
    _isStream(v: any): v is _PdfBaseStream {  // eslint-disable-line
        return v instanceof _PdfBaseStream;
    }
    /**
     * Converts the specified value to a PDF dictionary, resolving stream dictionaries when necessary.
     *
     * @param {any} v The value to convert.
     * @returns {_PdfDictionary} The corresponding PDF dictionary; otherwise, undefined.
     * @private
     */
    _asDictionary(v: any): _PdfDictionary {  // eslint-disable-line
        return this._isStream(v) ? v.dictionary : this._isDict(v) ? v : undefined;
    }
    /**
     * Determines whether the specified subtype represents a supported PDF annotation.
     *
     * @param {string} subType The annotation subtype to evaluate.
     * @returns {boolean} true if the subtype is an annotation subtype; otherwise, false.
     * @private
     */
    _isAnnotationSubtype(subType: string): boolean {
        switch (subType) {
        case 'Text':
        case 'Link':
        case 'FreeText':
        case 'Line':
        case 'Square':
        case 'Circle':
        case 'PolyLine':
        case 'Polygon':
        case 'Highlight':
        case 'Underline':
        case 'StrikeOut':
        case 'Squiggly':
        case 'Stamp':
        case 'Caret':
        case 'Ink':
        case 'Popup':
        case 'FileAttachment':
        case 'Sound':
        case 'Movie':
        case 'Screen':
        case 'PrinterMark':
        case 'TrapNet':
        case 'Watermark':
        case 'U3D':
            return true;
        }
        return false;
    }
    /**
     * Validates annotation and widget changes against the document certification permissions.
     *
     * @param {_PdfDictionary} newer The updated annotation or widget dictionary.
     * @param {_PdfDictionary} older The original annotation or widget dictionary.
     * @param {boolean} hasPermission Indicates whether the document contains certification permissions.
     * @param {PdfCertificationFlag} permission The certification permission applied to the document.
     * @param {number} olderRevId The revision identifier of the original object.
     * @param {number} newerRevId The revision identifier of the updated object.
     * @returns {boolean} true if the change is permitted or does not invalidate the signature; otherwise, false.
     * @private
     */
    _checkSubType(newer: _PdfDictionary, older: _PdfDictionary, hasPermission: boolean, permission: PdfCertificationFlag,
                  olderRevId: number, newerRevId: number): boolean {
        const subtypeObj: string = newer.get('Subtype');
        const subtypeName: string = this._isName(subtypeObj) ? subtypeObj.name :
            (typeof subtypeObj === 'string' ? subtypeObj : undefined);
        const resolveWidgetFT: any = (widget: _PdfDictionary, revId: number): string => {  // eslint-disable-line
            if (widget.has('FT')) {
                const ft: string = widget.get('FT');
                return this._isName(ft) ? ft.name : (typeof ft === 'string' ? ft : undefined);
            }
            const parent: any = widget.getRaw('Parent');  // eslint-disable-line
            if (parent instanceof _PdfReference) {
                const parentObj: any = this._fetchReferenceInRevision(parent, revId);  // eslint-disable-line
                const parentDict: _PdfDictionary = this._asDictionary(parentObj);
                if (parentDict && parentDict.has('FT')) {
                    const ft: string = parentDict.get('FT');
                    return this._isName(ft) ? ft.name : (typeof ft === 'string' ? ft : undefined);
                }
            }
            return undefined;
        };
        if (subtypeName === 'Widget') {
            const ftName: any = resolveWidgetFT(newer, newerRevId);  // eslint-disable-line
            if (ftName === 'Sig') {
                return true;
            }
            if ((ftName === 'Tx' || ftName === 'Btn' || ftName === 'Ch') &&
                hasPermission && (permission === PdfCertificationFlag.allowFormFill || permission === PdfCertificationFlag.allowComments)) {
                return true;
            }
            return this._areEqual(newer, older, false, hasPermission, permission, olderRevId, newerRevId);
        }
        if (subtypeName && this._isAnnotationSubtype(subtypeName)) {
            if (hasPermission && permission === PdfCertificationFlag.allowComments) {
                return true;
            }
            return this._areEqual(newer, older, false, hasPermission, permission, olderRevId, newerRevId);
        }
        return false;
    }
    /**
     * Compares two PDF dictionaries and determines whether their contents are equivalent,
     * taking certification permissions and annotation rules into account.
     *
     * @param {_PdfDictionary} older The original dictionary to compare.
     * @param {_PdfDictionary} newer The updated dictionary to compare.
     * @param {boolean} ignoreAnnotation Indicates whether annotation-specific validation should be performed.
     * @param {boolean} hasPermission Indicates whether the document contains certification permissions.
     * @param {PdfCertificationFlag} permission The certification permission applied to the document.
     * @param {number} olderRevId The revision identifier of the original dictionary.
     * @param {number} newerRevId The revision identifier of the updated dictionary.
     * @returns {boolean} true if the dictionaries are considered equivalent or the changes are permitted; otherwise, false.
     * @private
     */
    _areEqual(older: _PdfDictionary, newer: _PdfDictionary, ignoreAnnotation: boolean, hasPermission: boolean,
              permission: PdfCertificationFlag, olderRevId: number, newerRevId: number): boolean {
        let areEqual: boolean = true;
        const newerAsDict: any = newer;  // eslint-disable-line
        const newerIsXmlStream: any = (newerAsDict instanceof _PdfBaseStream || newer instanceof _PdfBaseStream)  // eslint-disable-line
            ? (() => {
                const dict: _PdfDictionary = this._asDictionary(newer);
                if (!dict || !dict.has('Subtype')) {
                    return false;
                }
                const st: string = dict.get('Subtype');
                const stName: string = this._isName(st) ? st.name : undefined;
                return stName === 'XML';
            })() : false;
        if (!older || !newer || newerIsXmlStream) {
            return true;
        }
        if (ignoreAnnotation && newer.has('Type')) {
            const newerType: any = newer.get('Type');  // eslint-disable-line
            const tName: string = this._isName(newerType) ? newerType.name : undefined;
            if (tName === 'Annot') {
                return this._checkSubType(newer, older, hasPermission, permission, olderRevId, newerRevId);
            }
        }
        if (newer.has('FT')) {
            const ft: any= newer.get('FT');  // eslint-disable-line
            const ftName: string = this._isName(ft) ? ft.name : (typeof ft === 'string' ? ft : undefined);
            if (!ftName) {
                return false;
            }
            if (ftName === 'Sig') {
                return true;
            }
            if (ftName === 'Tx' || ftName === 'Btn' || ftName === 'Ch') {
                if (hasPermission && (permission === PdfCertificationFlag.allowFormFill ||
                    permission === PdfCertificationFlag.allowComments)) {
                    return true;
                }
                return false;
            }
            return false;
        }
        const olderKeys: string[] = [];
        older.forEach((k: string) => {
            olderKeys.push(k);
        });
        for (const key of olderKeys) {
            if (!newer.has(key)) {
                return false;
            }
            if (key === 'Annots') {
                continue;
            }
            const olderVal: any = older.get(key);  // eslint-disable-line
            const newerVal: any = newer.get(key);  // eslint-disable-line
            areEqual = this._isEqual(olderVal, newerVal, olderRevId, newerRevId, hasPermission, permission);
            if (!areEqual) {
                break;
            }
        }
        return areEqual;
    }
    /**
     * Compares two PDF objects and determines whether they are equivalent,
     * resolving references and applying certification permission rules when necessary.
     *
     * @param {any} olderVal The original object value.
     * @param {any} newerVal The updated object value.
     * @param {number} olderRevId The revision identifier of the original object.
     * @param {number} newerRevId The revision identifier of the updated object.
     * @param {boolean} hasPermission Indicates whether the document contains certification permissions.
     * @param {PdfCertificationFlag} permission The certification permission applied to the document.
     * @returns {boolean} true if the objects are considered equivalent or the changes are permitted; otherwise, false.
     * @private
     */
    _isEqual(olderVal: any, newerVal: any, olderRevId: number, newerRevId: number,  // eslint-disable-line
             hasPermission: boolean, permission: PdfCertificationFlag): boolean {
        if (olderVal == null && newerVal == null) {
            return true;
        }
        if (olderVal == null || newerVal == null) {
            return false;
        }
        if (this._isName(olderVal) && this._isName(newerVal)) {
            return olderVal.name === newerVal.name;
        }
        if (typeof olderVal === 'number' || typeof olderVal === 'string' || typeof olderVal === 'boolean') {
            return olderVal === newerVal;
        }
        if (this._isRef(olderVal) && this._isRef(newerVal)) {
            const oldObj: any = this._fetchReferenceInRevision(olderVal, olderRevId);  // eslint-disable-line
            const newObj: any = this._fetchReferenceInRevision(newerVal, newerRevId);  // eslint-disable-line
            const oldDict: any = this._asDictionary(oldObj);  // eslint-disable-line
            const newDict: any = this._asDictionary(newObj);  // eslint-disable-line
            if (oldDict && newDict) {
                return this._areEqual(oldDict, newDict, true, hasPermission, permission, olderRevId, newerRevId);
            }
            return JSON.stringify(oldObj) === JSON.stringify(newObj);
        }
        if (Array.isArray(olderVal) && Array.isArray(newerVal)) {
            if (olderVal.length !== newerVal.length) {
                return false;
            }
            for (let i: number = 0; i < olderVal.length; i++) {
                if (!this._isEqual(olderVal[<number>i], newerVal[<number>i], olderRevId, newerRevId, hasPermission, permission)) {
                    return false;
                }
            }
            return true;
        }
        if (this._isDict(olderVal) && this._isDict(newerVal)) {
            return this._areEqual(olderVal, newerVal, true, hasPermission, permission, olderRevId, newerRevId);
        }
        if (this._isStream(olderVal) && this._isStream(newerVal)) {
            const oldD: any = olderVal.dictionary;  // eslint-disable-line
            const newD: any = newerVal.dictionary;  // eslint-disable-line
            return this._areEqual(oldD, newD, true, hasPermission, permission, olderRevId, newerRevId);
        }
        return JSON.stringify(olderVal) === JSON.stringify(newerVal);
    }
    /**
     * Compares two PDF dictionaries and determines whether changes between them
     * affect the validity of the signed document.
     *
     * @param {_PdfDictionary} olderDict The original dictionary from the signed revision.
     * @param {_PdfDictionary} newerDict The updated dictionary from the latest revision.
     * @param {Set<number>} skipObjects The collection of object numbers that require special comparison handling.
     * @param {number} objectNumber The object number being compared.
     * @param {boolean} hasPermission Indicates whether the document contains certification permissions.
     * @param {PdfCertificationFlag} permission The certification permission applied to the document.
     * @param {number} olderRevId The revision identifier of the original dictionary.
     * @param {number} newerRevId The revision identifier of the updated dictionary.
     * @returns {boolean} true if the object has changed in a way that affects signature validation; otherwise, false.
     * @private
     */
    _compareObjects(olderDict: _PdfDictionary, newerDict: _PdfDictionary,
                    skipObjects: Set<number>, objectNumber: number,
                    hasPermission: boolean, permission: PdfCertificationFlag,
                    olderRevId: number, newerRevId: number): boolean {
        if (!olderDict || !newerDict) {
            return false;
        }
        if (skipObjects && skipObjects.has(objectNumber)) {
            if (olderDict.has && newerDict.has && olderDict.has('Fields') && newerDict.has('Fields')) {
                return this._readFormReferences(olderDict, newerDict, olderRevId, newerRevId);
            }
            if (!hasPermission) {
                const res: boolean = !this._areEqual(olderDict, newerDict, true, hasPermission, permission, olderRevId, newerRevId);
                return res;
            }
            return this._readFormReferences(olderDict, newerDict, olderRevId, newerRevId);
        }
        const areEqual: boolean = this._areEqual(olderDict, newerDict, true, hasPermission, permission, olderRevId, newerRevId);
        const changed: boolean = !areEqual;
        return changed;
    }
    /**
     * Compares the form field references in two AcroForm dictionaries and determines
     * whether changes made between revisions are permitted for signature validation.
     *
     * @param {_PdfDictionary} oldAcroForm The AcroForm dictionary from the signed revision.
     * @param {_PdfDictionary} newAcroForm The AcroForm dictionary from the latest revision.
     * @param {number} olderRevId The revision identifier of the original AcroForm.
     * @param {number} newerRevId The revision identifier of the updated AcroForm.
     * @returns {boolean} true if unauthorized form field changes are detected; otherwise, false.
     * @private
     */
    _readFormReferences(oldAcroForm: _PdfDictionary, newAcroForm: _PdfDictionary,
                        olderRevId: number, newerRevId: number): boolean {
        if (!oldAcroForm.has('Fields') || !newAcroForm.has('Fields')) {
            return false;
        }
        const oldFields: any = oldAcroForm.get('Fields');  // eslint-disable-line
        const newFields: any = newAcroForm.get('Fields');  // eslint-disable-line
        if (!Array.isArray(oldFields) || !Array.isArray(newFields)) {
            return false;
        }
        const refEquals = (a: any, b: any): boolean => {  // eslint-disable-line
            if (a === b) {
                return true;
            }
            if (a instanceof _PdfReference && b instanceof _PdfReference) {
                return a.objectNumber === b.objectNumber && a.generationNumber === b.generationNumber;
            }
            return false;
        };
        const arrayContains: any = (arr: any[], item: any): boolean => {  // eslint-disable-line
            for (const el of arr) {
                if (refEquals(el, item)) {
                    return true;
                }
                if (!(el instanceof _PdfReference) && !(item instanceof _PdfReference) && el === item) {
                    return true;
                }
            }
            return false;
        };
        const resolveFT: any = (fieldDict: _PdfDictionary, revId: number): string => {  // eslint-disable-line
            if (fieldDict.has('FT')) {
                const ft: any = fieldDict.get('FT');  // eslint-disable-line
                return ft instanceof _PdfName ? ft.name : (typeof ft === 'string' ? ft : undefined);
            }
            const parent: any = fieldDict.getRaw('Parent');  // eslint-disable-line
            if (parent instanceof _PdfReference) {
                const parentObj: any = this._fetchReferenceInRevision(parent, revId);  // eslint-disable-line
                const parentDict: _PdfDictionary = this._asDictionary(parentObj);
                if (parentDict && parentDict.has('FT')) {
                    const ft: any = parentDict.get('FT');  // eslint-disable-line
                    return ft instanceof _PdfName ? ft.name : (typeof ft === 'string' ? ft : undefined);
                }
            }
            return undefined;
        };
        if (newFields.length < oldFields.length) {
            return true;
        }
        if (newFields.length === oldFields.length) {
            for (const f of newFields) {
                if (!arrayContains(oldFields, f)) {
                    return true;
                }
            }
            return false;
        }
        for (const f of newFields) {
            if (arrayContains(oldFields, f)) {
                continue;
            }
            if (!(f instanceof _PdfReference)) {
                return true;
            }
            const fieldObj: any = this._fetchReferenceInRevision(f, newerRevId);  // eslint-disable-line
            const fieldDict: _PdfDictionary = this._asDictionary(fieldObj);
            if (!fieldDict) {
                return true;
            }
            let ftName: string = resolveFT(fieldDict, newerRevId);
            if (!ftName) {
                if (fieldDict.has('V')) {
                    const vRaw: any = fieldDict.getRaw('V');  // eslint-disable-line
                    const vObj: any = vRaw instanceof _PdfReference  // eslint-disable-line
                        ? this._fetchReferenceInRevision(vRaw, newerRevId)
                        : vRaw;
                    const vDict: _PdfDictionary = this._asDictionary(vObj);
                    if (vDict) {
                        const typeObj: any = vDict.has('Type') ? vDict.get('Type') : undefined;  // eslint-disable-line
                        const typeName: string = typeObj instanceof _PdfName ? typeObj.name : (typeof typeObj === 'string' ? typeObj : undefined);
                        if (typeName === 'Sig' || vDict.has('ByteRange') || vDict.has('Contents')) {
                            ftName = 'Sig';
                        }
                    }
                }
            }
            if (!ftName) {
                return true;
            }
            if (ftName !== 'Sig') {
                return true;
            }
        }
        return false;
    }
    /**
     * Reads all references contained in the specified form dictionary for the given revision.
     *
     * @param {_PdfDictionary} formDict The form dictionary whose references are to be processed.
     * @param {number} revisionId The revision identifier used to resolve referenced objects.
     * @returns {void}
     * @private
     */
    _readAllReferences(formDict: _PdfDictionary, revisionId: number): void {
        const keys: string[] = [];
        formDict.forEach((k: string) => keys.push(k));
        for (const k of keys) {
            if (k === 'P' || k === 'Parent') {
                continue;
            }
            const v: any = formDict.get(k);  // eslint-disable-line
            this._readAllSubReferences(v, revisionId);
        }
    }
    /**
     * Recursively traverses and resolves all referenced objects contained within the specified object for a given revision.
     *
     * @param {any} obj The object whose references are to be resolved and processed.
     * @param {number} revisionId The revision identifier used when retrieving referenced objects.
     * @returns {void}
     * @private
     */
    _readAllSubReferences(obj: any, revisionId: number): void {  // eslint-disable-line
        if (this._isRef(obj)) {
            const fetched: any = this._fetchReferenceInRevision(obj, revisionId);  // eslint-disable-line
            this._readAllSubReferences(fetched, revisionId);
        } else if (this._isDict(obj)) {
            obj.forEach((k: string, v: any) => this._readAllSubReferences(v, revisionId));  // eslint-disable-line
        } else if (this._isStream(obj)) {
            this._readAllSubReferences(obj.dictionary, revisionId);
        } else if (Array.isArray(obj)) {
            for (const it of obj) {
                this._readAllSubReferences(it, revisionId);
            }
        }
    }
    /**
     * Verifies whether a page has been modified in a manner that violates the document's
     * certification permissions or invalidates the applied signature.
     *
     * @param {_PdfDictionary} oldPage The page dictionary from the signed revision.
     * @param {_PdfDictionary} newPage The page dictionary from the latest revision.
     * @param {boolean} hasPermission Indicates whether certification permissions are defined for the document.
     * @param {PdfCertificationFlag} permission The certification permission level applied to the document.
     * @returns {boolean} true if an unauthorized page modification is detected; otherwise, false.
     * @private
     */
    _verifyPageIsModify(oldPage: _PdfDictionary, newPage: _PdfDictionary,
                        hasPermission: boolean, permission: PdfCertificationFlag): boolean {
        if (hasPermission && permission === PdfCertificationFlag.forbidChanges) {
            return true;
        }
        if (newPage.has('Contents') && oldPage.has('Contents')) {
            const n: any = newPage.get('Contents');  // eslint-disable-line
            const o: any = oldPage.get('Contents');  // eslint-disable-line
            if (this._isRef(n) && this._isRef(o) && n.objectNumber !== o.objectNumber) {
                return true;
            }
        }
        const keys: string[] = [];
        newPage.forEach((k: string) => keys.push(k));
        const allowAnnots: boolean =
            (hasPermission && permission === PdfCertificationFlag.allowComments) ||
            (hasPermission && permission === PdfCertificationFlag.allowFormFill) ||
            (!hasPermission);
        for (const k of keys) {
            if (!oldPage.has(k)) {
                if (!(k === 'Annots' && allowAnnots)) {
                    return true;
                }
            } else {
                const nv: any = newPage.get(k);  // eslint-disable-line
                const ov: any = oldPage.get(k);  // eslint-disable-line
                if (k === 'Annots' && allowAnnots) {
                    if (Array.isArray(nv) && Array.isArray(ov)) {
                        if (this._checkFormFieldRemoved(ov, nv, 0)) {
                            return true;
                        }
                        const allMatch: boolean = ov.every((oref: any) => {  // eslint-disable-line
                            return nv.some((nref: any) =>  // eslint-disable-line
                                this._isRef(oref) &&
                                this._isRef(nref) &&
                                oref.objectNumber === nref.objectNumber
                            );
                        });
                        if (!allMatch) {
                            return true;
                        }
                        if (nv.length > ov.length) {
                            const added = nv.filter((nref: any) => {  // eslint-disable-line
                                return !ov.some((oref: any) =>  // eslint-disable-line
                                    this._isRef(oref) &&
                                    this._isRef(nref) &&
                                    oref.objectNumber === nref.objectNumber
                                );
                            });
                            for (const a of added) {
                                if (!(a instanceof _PdfReference)) {
                                    return true;
                                }
                                const obj: any = this._fetchReferenceInRevision(a, 0);  // eslint-disable-line
                                const dict: _PdfDictionary = this._asDictionary(obj);
                                if (!dict) {
                                    return true;
                                }
                                if (dict.has('Subtype')) {
                                    const subtype: any = dict.get('Subtype');  // eslint-disable-line
                                    let name: string = '';
                                    if (this._isName(subtype)) {
                                        name = (subtype.name || '').trim();
                                        if (!name && typeof subtype.toString === 'function') {
                                            name = (subtype.toString() || '').trim();
                                        }
                                    } else if (typeof subtype === 'string') {
                                        name = subtype.trim();
                                    }
                                    if (name === 'Widget') {
                                        continue;
                                    }
                                    if (allowAnnots && name && this._isAnnotationSubtype(name)) {
                                        continue;
                                    }
                                    return true;
                                }
                                return true;
                            }
                        }
                        continue;
                    }
                    continue;
                }
                if (this._isRef(nv) && this._isRef(ov)) {
                    if (nv.objectNumber !== ov.objectNumber) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * Checks whether a form field widget annotation has been removed between revisions.
     *
     * @param {any[]} oldAnnots The annotation collection from the original revision.
     * @param {any[]} newAnnots The annotation collection from the updated revision.
     * @param {number} newerRevId The revision identifier used to resolve annotation references.
     * @returns {boolean} true if a widget annotation has been removed; otherwise, false.
     * @private
     */
    _checkFormFieldRemoved(oldAnnots: any[], newAnnots: any[], newerRevId: number): boolean {  // eslint-disable-line
        for (const el of oldAnnots) {
            if (!this._arrayContains(newAnnots, el)) {
                if (this._isRef(el)) {
                    const annotObj: any = this._fetchReferenceInRevision(el, newerRevId);  // eslint-disable-line
                    const annotDict: any = this._asDictionary(annotObj);  // eslint-disable-line
                    if (annotDict && annotDict.has('Subtype')) {
                        const st: any = annotDict.get('Subtype');  // eslint-disable-line
                        const stName: string = this._isName(st) ? st.name : undefined;
                        if (stName === 'Widget') {
                            return true;
                        }
                    }
                }
                break;
            }
        }
        return false;
    }
    /**
     * Determines whether two PDF references refer to the same object.
     *
     * @param {any} a The first reference to compare.
     * @param {any} b The second reference to compare.
     * @returns {boolean} true if both references identify the same object number and generation number; otherwise, false.
     * @private
     */
    _refEquals(a: any, b: any): boolean {  // eslint-disable-line
        if (a === b) {
            return true;
        }
        if (a instanceof _PdfReference && b instanceof _PdfReference) {
            return a.objectNumber === b.objectNumber && a.generationNumber === b.generationNumber;
        }
        return false;
    }
    /**
     * Determines whether the specified array contains the given item.
     *
     * @param {any[]} arr The array to search.
     * @param {any} item The item to locate in the array.
     * @returns {boolean} true if the item exists in the array; otherwise, false.
     * @private
     */
    _arrayContains(arr: any[], item: any): boolean {  // eslint-disable-line
        for (const el of arr) {
            if (this._refEquals(el, item)) {
                return true;
            }
            if (!(el instanceof _PdfReference) && !(item instanceof _PdfReference) && el === item) {
                return true;
            }
        }
        return false;
    }
    /**
     * Determines whether the specified annotation subtype represents a permitted change
     * according to the document certification permissions.
     *
     * @param {_PdfDictionary} dict The annotation or form field dictionary to evaluate.
     * @param {boolean} hasPermission Indicates whether certification permissions are present.
     * @param {PdfCertificationFlag} permission The certification permission level applied to the document.
     * @param {number} revisionId The revision identifier used to resolve referenced field information.
     * @param {_PdfCrossReference} xref The cross-reference table used to resolve PDF objects.
     * @returns {boolean} true if the subtype represents an allowed change; otherwise, false.
     * @private
     */
    _checkSubTypeSingle(dict: _PdfDictionary, hasPermission: boolean, permission: PdfCertificationFlag, revisionId: number,
                        xref: _PdfCrossReference): boolean {
        const subtypeObj: any = dict.get('Subtype');  // eslint-disable-line
        const subtypeName: string = subtypeObj instanceof _PdfName ? subtypeObj.name :
            (typeof subtypeObj === 'string' ? subtypeObj : undefined);
        if (subtypeName === 'Form') {
            return true;
        }
        if (subtypeName === 'Widget') {
            const resolveFT: any = (): string => {  // eslint-disable-line
                if (dict.has('FT')) {
                    const ft: any = dict.get('FT');  // eslint-disable-line
                    return ft instanceof _PdfName ? ft.name : (typeof ft === 'string' ? ft : undefined);
                }
                const parent: any = dict.getRaw('Parent');  // eslint-disable-line
                if (parent instanceof _PdfReference) {
                    const parentObj: any = xref._fetchReferenceInRevision(parent, revisionId);  // eslint-disable-line
                    const parentDict: _PdfDictionary = xref._asDictionary(parentObj);
                    if (parentDict && parentDict.has('FT')) {
                        const ft: any = parentDict.get('FT');  // eslint-disable-line
                        return ft instanceof _PdfName ? ft.name : (typeof ft === 'string' ? ft : undefined);
                    }
                }
                return undefined;
            };
            const ftName: string = resolveFT();
            return ftName === 'Sig';
        }
        if (subtypeName && this._isAnnotationSubtype(subtypeName)) {
            return hasPermission && (
                permission === PdfCertificationFlag.allowComments
                || permission === PdfCertificationFlag.allowFormFill
            );
        }
        return false;
    }
}
/**
 * Represents metadata for a single object entry in the XRef table/stream.
 *
 * @private
 */
export class _PdfObjectInformation {
    /**
     * Gets or sets the byte offset of the object or the object stream identifier.
     */
    offset: number;
    /**
     * Gets or sets the generation number associated with the entry.
     */
    gen: number;
    /**
     * Indicates whether the object is stored as an uncompressed object in the PDF file.
     */
    uncompressed: boolean;
    /**
     * Indicates whether the entry is marked as free in the cross-reference table.
     */
    free: boolean;
    /**
     * Indicates whether the object is stored in a compressed object stream.
     */
    compressed: boolean;
    /**
     * Gets or sets the revision identifier associated with the object entry.
     */
    revisionId: number;
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
        if (collection._trailer && collection._trailer.has('Info')) {
            const infoRef: any = collection._trailer.getRaw('Info'); // eslint-disable-line
            if (infoRef && infoRef instanceof _PdfReference) {
                const infoDict: _PdfDictionary = collection._fetch(infoRef);
                if (infoDict && infoDict instanceof _PdfDictionary) {
                    infoDict._updated = true;
                    this._addToMainObjectCollection(infoRef, infoDict);
                }
            } else if (infoRef && infoRef instanceof _PdfDictionary) {
                infoRef._updated = true;
                this._addToMainObjectCollection(this._crossReference._getNextReference(), infoRef);
            }
        }
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
        if (element._isVisited) {
            return;
        }
        element._isVisited = true;
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
            if (this._crossReference._isUpdateEncrypt && this._crossReference._document.isEncrypted) {
                uncompressedValue = this._crossReference._fetch(key);
                if (type && type.name === 'XObject' && subtype && subtype.name === 'Image') {
                    uncompressedValue._isImage = true;
                }
            } else {
                if (isUpdated || (type && (type.name === 'XObject' || type.name === 'Metadata') &&
                    (subtype.name === 'Form' || subtype.name === 'XML'))) {
                    uncompressedValue = this._crossReference._fetch(key);
                } else {
                    uncompressedValue = this._crossReference._fetch(key, true);
                    uncompressedValue._isCompress = false;
                }
            }
            this._addToMainObjectCollection(key, uncompressedValue);
        }
    }
}
