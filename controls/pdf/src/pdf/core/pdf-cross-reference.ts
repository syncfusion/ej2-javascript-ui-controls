import { _PdfStream } from './base-stream';
import { _PdfDictionary, _PdfReferenceSet, _isCommand, _PdfReference, _PdfCommand, _PdfName } from './pdf-primitives';
import { BaseException, FormatError, _escapePdfName, _bytesToString, ParserEndOfFileException, _numberToString, _stringToPdfString } from './utils';
import { _PdfParser, _PdfLexicalOperator } from './pdf-parser';
import { _PdfBaseStream } from './base-stream';
import { PdfCrossReferenceType } from './enumerator';
import { PdfDocument } from './pdf-document';
import { _CipherTransform, _MD5, _PdfEncryptor } from './security/encryptor';
import { CompressedStreamWriter } from '@syncfusion/ej2-compression';
export class _PdfCrossReference {
    _stream: _PdfStream;
    _pendingRefs: _PdfReferenceSet;
    _entries: _PdfObjectInformation[];
    _crossReferencePosition: Object;
    _cacheMap: Map<_PdfReference, any>; // eslint-disable-line
    _startXRefQueue: number[];
    _trailer: _PdfDictionary;
    _root: _PdfDictionary;
    _topDictionary: _PdfDictionary;
    _tableState: _PdfCrossTableState;
    _streamState: _PdfStreamState;
    _prevStartXref: number;
    _version: string = '';
    _nextReferenceNumber: number;
    _newLine: string = '\r\n';
    _document: PdfDocument;
    _allowCatalog: boolean;
    _password: string;
    _encrypt: _PdfEncryptor;
    _ids: string[];
    _permissionFlags: number;
    constructor(document: PdfDocument, password?: string) {
        this._password = password;
        this._document = document;
        this._stream = document._stream;
        this._entries = [];
        this._crossReferencePosition = Object.create(null);
        this._cacheMap = new Map<_PdfReference, any>(); // eslint-disable-line
        this._pendingRefs = new _PdfReferenceSet();
    }
    _setStartXRef(startXRef: number): void {
        this._startXRefQueue = [startXRef];
        this._prevStartXref = startXRef;
    }
    _parse(recoveryMode: boolean): void {
        let trailerDictionary: _PdfDictionary;
        if (!recoveryMode) {
            trailerDictionary = this._readXRef();
        } else {
            trailerDictionary = this._indexObjects();
        }
        trailerDictionary.assignXref(this);
        this._nextReferenceNumber = trailerDictionary.get('Size');
        this._trailer = trailerDictionary;
        const encrypt: _PdfDictionary = trailerDictionary.get('Encrypt');
        if (encrypt) {
            this._document._isEncrypted = true;
            this._ids = trailerDictionary.get('ID');
            this._permissionFlags = encrypt.get('P');
            const fileId: string = this._ids && this._ids.length ? this._ids[0] : '';
            encrypt.suppressEncryption = true;
            this._encrypt = new _PdfEncryptor(encrypt, fileId, this._password);
            this._document._fileStructure._crossReferenceType = PdfCrossReferenceType.stream;
            this._document._isUserPassword = this._encrypt._isUserPassword;
            this._document._encryptOnlyAttachment = this._encrypt._encryptOnlyAttachment;
            if (this._encrypt._encryptOnlyAttachment) {
                this._document._hasUserPasswordOnly = true;
                this._document._encryptMetaData = false;
            } else {
                this._document._hasUserPasswordOnly = this._encrypt._hasUserPasswordOnly;
                this._document._encryptMetaData = encrypt.has('EncryptMetadata') ? encrypt.get('EncryptMetadata') : true;
            }
        }
        let hasRoot: boolean = false;
        try {
            const root: _PdfDictionary = trailerDictionary.get('Root');
            if (root) {
                const pagesEntry: _PdfDictionary = root.get('Pages');
                if (pagesEntry) {
                    this._root = root;
                    hasRoot = true;
                }
            }
        }
        catch (ex) {
            throw new BaseException('Invalid cross reference', 'InvalidXRef');
        }
        if (!hasRoot) {
            if (!recoveryMode) {
                throw new BaseException ('Invalid cross reference', 'XRefParseException');
            } else {
                throw new BaseException('Invalid cross reference', 'InvalidXRef');
            }
        }
    }
    _getEntry(i: number): _PdfObjectInformation {
        const xrefEntry: _PdfObjectInformation = this._entries[i]; // eslint-disable-line
        if (xrefEntry && !xrefEntry.free && xrefEntry.offset) {
            return xrefEntry;
        }
        return null;
    }
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
    _fetchUncompressed(reference: _PdfReference, xrefEntry: _PdfObjectInformation, suppressEncryption: boolean): any { // eslint-disable-line
        const generationNumber: number = reference.generationNumber;
        const objectNumber: number = reference.objectNumber;
        if (xrefEntry.gen !== generationNumber) {
            throw new BaseException(`Inconsistent generation in XRef: ${reference}`, 'XRefEntryException');
        }
        const stream: _PdfStream = this._stream.makeSubStream(xrefEntry.offset + this._stream.start, undefined);
        const parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(stream), this, true);
        const obj1: number = parser.getObject();
        const obj2: number = parser.getObject();
        const obj3: _PdfCommand = parser.getObject();
        if (obj1 !== objectNumber || obj2 !== generationNumber || typeof obj3 === 'undefined') {
            throw new BaseException(`Bad (uncompressed) XRef entry: ${reference}`, 'XRefEntryException');
        }
        let entry: any; // eslint-disable-line
        if (this._encrypt && !suppressEncryption) {
            entry = parser.getObject(this._encrypt._createCipherTransform(reference.objectNumber, reference.generationNumber));
        } else {
            entry = parser.getObject();
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
            return this._topDictionary;
        } catch (e) {
            this._startXRefQueue.shift();
        }
        if (recoveryMode) {
            return undefined;
        }
        throw new BaseException('Invalid cross reference', 'XRefParseException');
    }
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
                    const objectNumber: number = Number.parseInt(m[1]) | 0; // eslint-disable-line
                    const gen: number = Number.parseInt(m[2]) | 0; // eslint-disable-line
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
    _getCatalogObj(): _PdfDictionary {
        return this._root;
    }
    _save(): Uint8Array {
        const currentLength: number = this._stream.length;
        const buffer: Array<number> = [this._newLine.charCodeAt(0), this._newLine.charCodeAt(1), 37, 80, 68, 70, 45];
        this._writeString(`${this._version}${this._newLine}`, buffer);
        buffer.push(0x25, 0x83, 0x92, 0xfa, 0xfe);
        this._writeString(this._newLine, buffer);
        let updatedCount: number = 0;
        let uncompressedCount: number = 0;
        if (this._document._fileStructure._crossReferenceType === PdfCrossReferenceType.stream) {
            const data: Array<number> = [];
            const updatedStream: Array<number> = [];
            let archiveXRef: string = '';
            const indexes: Array<number> = [];
            indexes.push(0, 1);
            const collection: Array<number> = [];
            const uncompressedOffsets: Array<number> = [];
            this._cacheMap.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
                let dictionary: _PdfDictionary;
                if (value instanceof _PdfBaseStream) {
                    dictionary = value.dictionary;
                }
                if (dictionary && dictionary._updated && (!dictionary.isCatalog || this._allowCatalog)) {
                    indexes.push(key.objectNumber, 1);
                    uncompressedOffsets.push(currentLength + buffer.length);
                    let cipher: _CipherTransform;
                    if (this._encrypt) {
                        cipher = this._encrypt._createCipherTransform(key.objectNumber, key.generationNumber);
                    }
                    this._writeObject(value, buffer, key, cipher);
                    uncompressedCount++;
                    dictionary._updated = false;
                }
            });
            this._cacheMap.forEach((value: _PdfDictionary | _PdfBaseStream, key: _PdfReference) => {
                if (value instanceof _PdfDictionary) {
                    if (value._updated && (!value.isCatalog || this._allowCatalog)) {
                        archiveXRef += `${key.objectNumber} ${updatedStream.length}${this._newLine}`;
                        collection.push(key.objectNumber, 1);
                        updatedCount++;
                        this._writeObject(value, updatedStream);
                    }
                } else if (value instanceof _PdfBaseStream) {
                    const dictionary: _PdfDictionary = value.dictionary;
                    if (dictionary && dictionary._updated && (!dictionary.isCatalog || this._allowCatalog)) {
                        indexes.push(key.objectNumber, 1);
                        uncompressedOffsets.push(currentLength + buffer.length);
                        this._writeObject(value, buffer, key);
                        uncompressedCount++;
                        dictionary._updated = false;
                    }
                }
            });
            for (let i: number = 0; i < collection.length; i++ ) {
                indexes.push(collection[parseInt(i.toString(), 10)]);
            }
            let archiveOffset: number;
            let archiveRef: _PdfReference;
            if (updatedCount > 0) {
                archiveRef = this._getNextReference();
                indexes.push(archiveRef.objectNumber, 2);
                this._writeString(archiveXRef, data);
                this._writeBytes(updatedStream, data);
                const newDict: _PdfDictionary = new _PdfDictionary(this);
                newDict.set('Type', _PdfName.get('ObjStm'));
                newDict.set('N', updatedCount);
                newDict.set('First', archiveXRef.length);
                newDict.set('Length', data.length);
                const archiveStream: _PdfStream = new _PdfStream(data, newDict, 0, data.length);
                archiveOffset = currentLength + buffer.length;
                let cipher: _CipherTransform;
                if (this._encrypt) {
                    cipher = this._encrypt._createCipherTransform(archiveRef.objectNumber, archiveRef.generationNumber);
                }
                this._writeObject(archiveStream, buffer, archiveRef, cipher);
            }
            const newRef: _PdfReference = this._getNextReference();
            const newStartXref: number = currentLength + buffer.length;
            const newXref: _PdfDictionary = new _PdfDictionary(this);
            newXref.set('Type', _PdfName.get('XRef'));
            newXref.set('Index', indexes);
            newXref.set('W', [1, 3, 1]);
            this._copyTrailer(newXref);
            if (this._ids && this._ids.length > 0) {
                newXref.update('ID', [this._ids[0], this._computeMessageDigest(newStartXref)]);
            }
            const newXrefData: Array<number> = [];
            this._writeLong(0, 1, newXrefData);
            this._writeLong(1, 3, newXrefData);
            this._writeLong(-1, 1, newXrefData);
            if (uncompressedCount > 0) {
                for (let index: number = 0; index < uncompressedCount; index++) {
                    this._writeLong(1, 1, newXrefData);
                    this._writeLong(uncompressedOffsets[index], 3, newXrefData); // eslint-disable-line
                    this._writeLong(0, 1, newXrefData);
                }
            }
            if (updatedCount > 0) {
                for (let index: number = 0; index < updatedCount; index++) {
                    this._writeLong(2, 1, newXrefData);
                    this._writeLong(archiveRef.objectNumber, 3, newXrefData);
                    this._writeLong(index, 1, newXrefData);
                }
                this._writeLong(1, 1, newXrefData);
                this._writeLong(archiveOffset, 3, newXrefData);
                this._writeLong(0, 1, newXrefData);
            }
            this._writeLong(1, 1, newXrefData);
            this._writeLong(newStartXref, 3, newXrefData);
            this._writeLong(0, 1, newXrefData);
            newXref.set('Length', newXrefData.length);
            const newXrefStream: _PdfStream = new _PdfStream(newXrefData, newXref, 0, newXrefData.length);
            let cipher: _CipherTransform;
            if (this._encrypt) {
                cipher = this._encrypt._createCipherTransform(newRef.objectNumber, newRef.generationNumber);
            }
            this._writeObject(newXrefStream, buffer, newRef, cipher, true);
            this._writeString(`startxref${this._newLine}${newStartXref}${this._newLine}%%EOF${this._newLine}`, buffer);
        } else {
            let tempBuffer: string = '';
            this._cacheMap.forEach((value: any, key: _PdfReference) => { // eslint-disable-line
                let dictionary: _PdfDictionary;
                if (value instanceof _PdfDictionary) {
                    dictionary = value;
                } else if (value instanceof _PdfBaseStream) {
                    dictionary = value.dictionary;
                }
                if (dictionary && dictionary._updated && (!dictionary.isCatalog || this._allowCatalog)) {
                    let offsetString: string = (currentLength + buffer.length).toString();
                    while (offsetString.length < 10) {
                        offsetString = '0' + offsetString;
                    }
                    let genString: string = key.generationNumber.toString();
                    while (genString.length < 5) {
                        genString = '0' + genString;
                    }
                    tempBuffer += `${key.objectNumber} 1${this._newLine}${offsetString} ${genString} n${this._newLine}`;
                    updatedCount++;
                    this._writeObject(value, buffer, key);
                }
            });
            const newStartXref: number = buffer.length + currentLength;
            this._writeString(`xref${this._newLine}0 1${this._newLine}0000000000 65535 f${this._newLine}`, buffer);
            if (updatedCount > 0) {
                this._writeString(tempBuffer, buffer);
            }
            this._writeString(`trailer${this._newLine}`, buffer);
            const newXref: _PdfDictionary = new _PdfDictionary(this);
            this._copyTrailer(newXref);
            this._writeDictionary(newXref, buffer, this._newLine);
            this._writeString(`startxref${this._newLine}${newStartXref}${this._newLine}%%EOF${this._newLine}`, buffer);
        }
        const array: Uint8Array = new Uint8Array(this._stream.length + buffer.length);
        array.set(this._stream.bytes);
        array.set(buffer, this._stream.length);
        return array;
    }
    _copyTrailer(newXref: _PdfDictionary): void {
        newXref.set('Size', this._nextReferenceNumber);
        newXref.set('Prev', this._prevStartXref);
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
    _getNextReference(): _PdfReference {
        const reference: _PdfReference = new _PdfReference(this._nextReferenceNumber++, 0);
        reference._isNew = true;
        return reference;
    }
    _writeObject(obj: _PdfDictionary | _PdfBaseStream,
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
        }
        if (reference && reference instanceof _PdfReference) {
            this._writeString(`endobj${this._newLine}`, buffer);
        }
    }
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
        dictionary.forEach((key: string, value: any) => { // eslint-disable-line
            this._writeString(`/${_escapePdfName(key)} `, buffer);
            this._writeValue(value, buffer, transform, isCrossReference);
            this._writeString(spaceChar, buffer);
        });
        this._writeString(`>>${this._newLine}`, buffer);
    }
    _writeFontDictionary(dictionary: _PdfDictionary): void {
        if (dictionary.has('DescendantFonts')) {
            const fonts: any = dictionary.get('DescendantFonts'); // eslint-disable-line
            const reference: _PdfReference = this._getNextReference();
            this._cacheMap.set(reference, fonts);
            dictionary.update('DescendantFonts', [reference]);
        }
        if (dictionary.has('ToUnicode')) {
            const fonts: any = dictionary.get('ToUnicode'); // eslint-disable-line
            const reference: _PdfReference = this._getNextReference();
            this._cacheMap.set(reference, fonts);
            dictionary.update('ToUnicode', reference);
        }
        if (dictionary.has('FontFile2')) {
            const fonts: any = dictionary.get('FontFile2'); // eslint-disable-line
            const reference: _PdfReference = this._getNextReference();
            this._cacheMap.set(reference, fonts);
            dictionary.update('FontFile2', reference);
        }
        if (dictionary.has('FontDescriptor')) {
            const fonts: any = dictionary.get('FontDescriptor'); // eslint-disable-line
            const reference: _PdfReference = this._getNextReference();
            this._cacheMap.set(reference, fonts);
            dictionary.update('FontDescriptor', reference);
        }
    }
    _writeStream(stream: _PdfBaseStream, buffer: Array<number>, transform?: _CipherTransform, isCrossReference?: boolean): void {
        const streamBuffer: number[] = [];
        let value: string = stream.getString();
        if (!isCrossReference) {
            const byteArray: number[] = [];
            for (let i: number = 0; i < value.length; i++) {
                byteArray.push(value.charCodeAt(i));
            }
            if (stream._isCompress) {
                const dataArray: Uint8Array = new Uint8Array(byteArray);
                const sw: CompressedStreamWriter = new CompressedStreamWriter();
                sw.write(dataArray, 0, dataArray.length);
                sw.close();
                value = sw.getCompressedString;
                stream.dictionary.update('Filter', _PdfName.get('FlateDecode'));
            }
            if (transform) {
                value = transform.encryptString(value);
            }
        }
        this._writeString(value, streamBuffer);
        stream.dictionary.update('Length', streamBuffer.length);
        this._writeDictionary(stream.dictionary, buffer, this._newLine, transform, isCrossReference);
        this._writeString(`stream${this._newLine}`, buffer);
        this._writeBytes(streamBuffer, buffer);
        this._writeString(`${this._newLine}endstream${this._newLine}`, buffer);
    }
    _writeValue(value: any, buffer: Array<number>, transform?: _CipherTransform, isCrossReference?: boolean): void { // eslint-disable-line
        if (value instanceof _PdfName) {
            this._writeString(`/${_escapePdfName(value.name)}`, buffer);
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
                this._writeValue(val, buffer, transform, isCrossReference);
            }
            this._writeString(']', buffer);
        } else if (typeof value === 'string') {
            if (!isCrossReference && transform) {
                value = transform.encryptString(value);
            }
            this._writeString(`(${this._escapeString(value)})`, buffer);
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
    _writeString(value: string, buffer: Array<number>): void {
        for (let i: number = 0; i < value.length; i++) {
            buffer.push(value.charCodeAt(i) & 0xff);
        }
    }
    _writeBytes(data: number[], buffer: Array<number>): void {
        for (let i: number = 0; i < data.length; i++) {
            buffer.push(data[i]); // eslint-disable-line
        }
    }
    _writeLong(value: number, count: number, buffer: Array<number>): void {
        for (let i: number = count - 1; i >= 0; --i) {
            buffer.push(value >> (i << 3) & 0xff);
        }
    }
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
        this._pendingRefs.clear();
        this._pendingRefs = undefined;
        this._cacheMap.clear();
        this._pendingRefs = undefined;
        this._root = undefined;
        this._startXRefQueue = [];
        this._startXRefQueue = undefined;
        this._stream = undefined;
        this._streamState = undefined;
        this._tableState = undefined;
        this._topDictionary = undefined;
        this._trailer = undefined;
        this._version = undefined;
        this._crossReferencePosition = undefined;
    }
}
class _PdfObjectInformation {
    offset: number;
    gen: number;
    uncompressed: boolean;
    free: boolean;
}
class _PdfCrossTableState {
    entryNum: number;
    streamPos: number;
    parserBuf1: any; // eslint-disable-line
    parserBuf2: any; // eslint-disable-line
    firstEntryNum: number;
    entryCount: number;
}
class _PdfStreamState {
    entryRanges: number[];
    byteWidths: number[];
    entryNum: number;
    streamPos: number;
}
