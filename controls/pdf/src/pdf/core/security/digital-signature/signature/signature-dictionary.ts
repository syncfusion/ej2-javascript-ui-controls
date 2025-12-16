import { CryptographicStandard, DigestAlgorithm } from '../../../enumerator';
import { _PdfCrossReference } from '../../../pdf-cross-reference';
import { PdfDocument } from '../../../pdf-document';
import { _PdfDictionary, _PdfName, _PdfReference } from '../../../pdf-primitives';
import { _PdfCertificate } from '../pdf-certificate';
import { _PdfKeyEntry } from '../pdf-cryptography-certificate';
import { _PdfX509Certificate, _PdfX509Certificates } from '../x509/x509-certificate';
import { _PdfX509CertificateParser } from '../x509/x509-certificate-parser';
import { PdfSignature } from './pdf-signature';
import { _PdfSignaturePrivateKey } from './signature-privatekey';
import { _PdfCryptographicMessageSyntaxSigner } from './cryptographic-signer';
import { _bytesToHex, _padStart } from '../../../utils';
export class _PdfSignatureDictionary {
    _dictionary: _PdfDictionary = new _PdfDictionary();
    private _document: PdfDocument;
    private _signature: PdfSignature;
    private _transParam: string = 'TransformParams';
    private _signaturePermissionsDictionary: string = 'DocMDP';
    private _cryptographicFilterType: string = 'adbe.pkcs7.detached';
    private _advanceFilterType: string = 'ETSI.CAdES.detached';
    private _requestForCommentsFilterType: string = 'ETSI.RFC3161';
    _firstRangeLength: number;
    _secondRangeIndex: number;
    _startPositionByteRange: number;
    private _estimatedSize: number = 8192;
    _certificate: _PdfCertificate;
    private _crossReference: _PdfCrossReference;
    constructor(dictionary: _PdfDictionary, signature: PdfSignature)
    constructor(document: PdfDocument, signature: PdfSignature)
    constructor(arg1?: PdfDocument | _PdfDictionary, arg2?: PdfSignature) {
        if (!arg1) {
            throw new Error('A valid argument must be provided.');
        }
        if (!arg2) {
            throw new Error('Argument signature is null or undefined.');
        }
        if (arg1 instanceof PdfDocument) {
            this._document = arg1;
            this._crossReference = arg1._crossReference;
        } else {
            this._dictionary = arg1;
        }
        this._signature = arg2;
        this._certificate = arg2._certificate;
    }
    _parsePdfContents(contents: any): Uint8Array { // eslint-disable-line
        let result: Uint8Array;
        if (contents instanceof Uint8Array) {
            return contents;
        } else if (typeof contents === 'string') {
            const trimmed: string = contents.trim();
            const isHexFormat: boolean = trimmed.startsWith('<') && trimmed.endsWith('>');
            if (isHexFormat) {
                let hex: string = trimmed.slice(1, -1).replace(/[^0-9a-fA-F]/g, '');
                if (hex.length % 2 !== 0) {
                    hex += '0';
                }
                result = new Uint8Array(hex.length / 2);
                for (let i: number = 0; i < hex.length; i += 2) {
                    result[i / 2] = parseInt(hex.slice(i, i + 2), 16);
                }
                return result;
            }
            result = new Uint8Array(trimmed.length);
            for (let i: number = 0; i < trimmed.length; i++) {
                result[<number>i] = trimmed.charCodeAt(i) & 0xff;
            }
            return result;
        }
        return result;
    }
    _parseDigestAlgorithm(): DigestAlgorithm {
        let digest: DigestAlgorithm;
        let cmsSigner: _PdfCryptographicMessageSyntaxSigner;
        if (this._dictionary.has('Contents')) {
            const contents: string = this._dictionary.get('Contents');
            const bytes: Uint8Array = this._parsePdfContents(contents);
            const isDeferredSigning: boolean = bytes && bytes.length > 0 && bytes.every((byte: number) => byte === 0);
            if (bytes && bytes.length > 0 && !isDeferredSigning) {
                const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
                const certificateChain: _PdfX509Certificate = parser._readCertificate(bytes, true);
                const certificate: _PdfCertificate = new _PdfCertificate(certificateChain);
                this._certificate = certificate;
                cmsSigner = new _PdfCryptographicMessageSyntaxSigner(bytes);
            }
        }
        if (cmsSigner) {
            const messageDigest: string = cmsSigner._getHashAlgorithm();
            switch (messageDigest) {
            case 'SHA512':
                digest = DigestAlgorithm.sha512;
                break;
            case 'SHA384':
                digest = DigestAlgorithm.sha384;
                break;
            case 'SHA1':
                digest = DigestAlgorithm.sha1;
                break;
            case 'RIPEMD160':
                digest = DigestAlgorithm.ripemd160;
                break;
            default:
                digest = DigestAlgorithm.sha256;
                break;
            }
        }
        return digest;
    }
    _parseDirect(key: string): string {
        let value: string;
        if (this._dictionary.has(key)) {
            value = this._dictionary.get(key);
        }
        return value;
    }
    _parseSignedDate(): Date {
        let signedDate: Date;
        if (this._dictionary.has('M')) {
            const dateEntry: string = this._dictionary.get('M');
            signedDate = this._parsePdfDate(dateEntry);
        }
        return signedDate;
    }
    _parsePdfDate(v: string): Date {
        if (typeof v !== 'string' || v.length === 0) {
            return undefined;
        }
        let s: string = v.trim();
        if (s.startsWith('D:')) {
            s = s.slice(2);
        }
        const year: number = Number(s.slice(0, 4));
        const month: number = Number(s.slice(4, 6) || '01');
        const day: number = Number(s.slice(6, 8) || '01');
        const hour: number = Number(s.slice(8, 10) || '00');
        const minute: number = Number(s.slice(10, 12) || '00');
        const second: number = Number(s.slice(12, 14) || '00');
        let offsetMinutes: number = 0;
        const tzStart: number = 14;
        if (s.length > tzStart) {
            const tzRaw: string = s.slice(tzStart).replace(/'/g, '');
            if (tzRaw.toUpperCase() !== 'Z') {
                const sign: number = tzRaw.startsWith('-') ? -1 : 1;
                const hh: number = Number(tzRaw.slice(1, 3));
                const mm: number = tzRaw.length >= 5 ? Number(tzRaw.slice(3, 5)) : 0;
                offsetMinutes = sign * (hh * 60 + mm);
            }
        }
        const millisLocal: number = Date.UTC(year, month - 1, day, hour, minute, second);
        const time: number = millisLocal - offsetMinutes * 60_000;
        const dt: Date = new Date(time);
        return isNaN(dt.getTime()) ? undefined : dt;
    }
    _dictionarySave(buffer: number[]): void {
        if (!this._dictionary || buffer.length <= 0) {
            throw new Error('dictionary or writer is null.');
        }
        if (this._signature) {
            this._addRequiredItems();
            this._addOptionalItems();
        }
        this._addContents(buffer);
        this._addRange(buffer);
        if (this._signature && this._signature._certify) {
            this._addDigest(buffer);
        }
    }
    _addDigest(buffer: number[]): void {
        if (this._signature && this._signature._certify && this._allowMessageDigestProcessing()) {
            const writer: _PdfCrossReference = this._document._crossReference;
            writer._writeString(`/Reference[<</TransformParams<<\r\n/V /1.2\r\n/P ${this._signature._documentPermissions}\r\n /Type /TransformParams\r\n>>\r\n/TransformMethod/DocMDP/Type/SigRef/DigestValue`, buffer);
            let offset: number = buffer.length + writer._currentLength;
            writer._writeString('<', buffer);
            for (let i: number = 0; i < 32; i++) {
                writer._writeString('0', buffer);
            }
            const reference: string = this._document._catalog._catalogDictionary.objId.toString();
            writer._writeString('>/DigestLocation[' + offset + ' 34]/DigestMethod/MD5/Data '+ reference + ' R>><</TransformParams<<\r\n/V /1.2\r\n/Fields [(Signature)]\r\n/Type /TransformParams\r\n/Action /Include\r\n>>\r\n/TransformMethod/FieldMDP/Type/SigRef/DigestValue', buffer); // eslint-disable-line
            offset = buffer.length + writer._currentLength;
            writer._writeString('<', buffer);
            for (let i: number = 0; i < 32; i++) {
                writer._writeString('0', buffer);
            }
            writer._writeString('>/DigestLocation[' + offset + ' 34]/DigestMethod/MD5/Data ' + reference + ' R>>]\r\n', buffer);
        }
    }
    _addRequiredItems(): void {
        if (this._signature && this._signature._certify && this._allowMessageDigestProcessing()) {
            this._addReference();
        }
        this._addType();
        this._addDate();
        this._addFilter();
        this._addSubFilter();
    }
    _allowMessageDigestProcessing(): boolean {
        const dictionary: _PdfDictionary = this._document._catalog._catalogDictionary.get('Perms');
        if (typeof dictionary !== 'undefined' && dictionary !== null) {
            const docMDP: any = dictionary.get('DocMDP'); // eslint-disable-line
            if (docMDP instanceof _PdfReference) {
                const docMDPDictionary: _PdfDictionary = this._document._crossReference._fetch(docMDP);
                const signatureDictionary: _PdfDictionary = this._dictionary;
                if (signatureDictionary.has('Reference') || docMDPDictionary.has('Reference')) {
                    return false;
                }
            } else if (docMDP instanceof _PdfDictionary) {
                if (docMDP.objId !== this._dictionary.objId) {
                    return false;
                }
            }
        }
        return true;
    }
    _addOptionalItems(): void {
        if (this._signature) {
            if (this._signature._reason) {
                this._dictionary.update('Reason', this._signature._reason);
            }
            if (this._signature._locationInfo) {
                this._dictionary.update('Location', this._signature._locationInfo);
            }
            if (this._signature._contactInfo) {
                this._dictionary.update('ContactInfo', this._signature._contactInfo);
            }
            if (this._signature._signedName) {
                this._dictionary.update('Name', this._signature._signedName);
                const tempDictionary: _PdfDictionary = new _PdfDictionary();
                const appDictionary: _PdfDictionary = new _PdfDictionary();
                tempDictionary.update('Name', this._signature._signedName);
                let ref: _PdfReference = this._document._crossReference._getNextReference();
                this._document._crossReference._cacheMap.set(ref, tempDictionary);
                appDictionary.update('App', ref);
                ref = this._document._crossReference._getNextReference();
                this._document._crossReference._cacheMap.set(ref, appDictionary);
                this._dictionary.update('Prop_Build', ref);
            }
        }
    }
    _addReference(): void {
        const trans: _PdfDictionary = new _PdfDictionary();
        const reference: _PdfDictionary = new _PdfDictionary();
        const array: any = []; // eslint-disable-line
        trans.update('V', _PdfName.get('1.2'));
        trans.update('P', this._signature._documentPermissions);
        trans.update('Type', _PdfName.get(this._transParam));
        reference.update('TransformMethod', _PdfName.get(this._signaturePermissionsDictionary));
        reference.update('Type', _PdfName.get('SigRef'));
        reference.update(this._transParam, trans);
        reference.update(this._transParam, trans);
        array.push(reference);
        this._dictionary.update('Reference', array);
    }
    _addType(): void {
        if (this._certificate) {
            this._dictionary.update('Type', new _PdfName('Sig'));
        }
    }
    _addDate(): void {
        let dateTime: Date = new Date();
        if (this._signature && this._signature._signedDate) {
            dateTime = this._signature._signedDate;
        }
        const year: string = dateTime.getFullYear().toString();
        const month: string = _padStart((dateTime.getMonth() + 1).toString(), 2, '0');
        const day: string = _padStart(dateTime.getDate().toString(), 2, '0');
        const hours: string = _padStart(dateTime.getHours().toString(), 2, '0');
        const minutes: string = _padStart(dateTime.getMinutes().toString(), 2, '0');
        const seconds: string = _padStart(dateTime.getSeconds().toString(), 2, '0');
        const totalMinutesOffset: number = dateTime.getTimezoneOffset();
        const offsetHours: string = _padStart(Math.floor(Math.abs(totalMinutesOffset) / 60).toString(), 2, '0');
        const offsetMinutes: string = _padStart((Math.abs(totalMinutesOffset) % 60).toString(), 2, '0');
        const offsetSign: string = totalMinutesOffset > 0 ? '-' : '+';
        this._dictionary.update('M', `D:${year}${month}${day}${hours}${minutes}${seconds}${offsetSign}${offsetHours}'${offsetMinutes}'`);
    }
    _addFilter(): void {
        this._dictionary.update('Filter', new _PdfName('Adobe.PPKLite'));
    }
    _addSubFilter(): void {
        if (this._signature && this._signature._cryptographicStandard === CryptographicStandard.cades) {
            this._dictionary.update('SubFilter', new _PdfName(this._advanceFilterType));
        } else {
            this._dictionary.update('SubFilter', new _PdfName(this._cryptographicFilterType));
        }
    }
    _getLength(): number {
        let length: number = 0;
        if (this._crossReference._uint8Chunks.length > 0) {
            for (let i: number = 0; i < this._crossReference._uint8Chunks.length; i++) {
                const arr: Uint8Array = this._crossReference._uint8Chunks[<number>i];
                length += arr.length;
            }
        }
        return length;
    }
    _addContents(buffer: number[]): void {
        const chunksLength: number = this._getLength();
        const writer: _PdfCrossReference = this._crossReference;
        writer._writeString('/Contents ', buffer);
        this._firstRangeLength = this._crossReference._currentLength + buffer.length + chunksLength;
        let length: number = this._estimatedSize * 2;
        if (this._signature && this._certificate) {
            length = this._estimatedSize;
        }
        writer._writeString('<' + ' '.repeat(length * 2) + '>', buffer);
        this._secondRangeIndex = buffer.length + chunksLength + this._crossReference._currentLength;
        writer._writeString('\r\n', buffer);
    }
    _addRange(buffer: number[]): void {
        const chunksLength: number = this._getLength();
        const writer: _PdfCrossReference = this._crossReference;
        writer._writeString(`${'/'}${'ByteRange'}${' '}${'['}`, buffer);
        this._startPositionByteRange = buffer.length + this._document._crossReference._currentLength + chunksLength;
        for (let i: number = 0; i < 32; i++) {
            writer._writeString(' ', buffer);
        }
        writer._writeString(`${']'}${'\r\n'}`, buffer);
    }
    _documentSaved(buffer: Uint8Array): void {
        const secondRangeLength: number = buffer.length - this._secondRangeIndex;
        const byteRangeStrings: string[] = ['0 ', `${this._firstRangeLength} `,
            `${this._secondRangeIndex} `,
            secondRangeLength.toString()
        ];
        let currentPosition: number = this._saveRangeItem(buffer, byteRangeStrings[0], this._startPositionByteRange);
        currentPosition = this._saveRangeItem(buffer, byteRangeStrings[1], currentPosition);
        currentPosition = this._saveRangeItem(buffer, byteRangeStrings[2], currentPosition);
        this._saveRangeItem(buffer, byteRangeStrings[3], currentPosition);
        const buf1: Uint8Array = buffer.subarray(0, this._firstRangeLength);
        const buf2: Uint8Array = buffer.subarray(this._secondRangeIndex);
        const combined: Uint8Array = new Uint8Array(buf1.length + buf2.length);
        combined.set(buf1, 0);
        combined.set(buf2, buf1.length);
        const pkcs7Content: Uint8Array = this._getCryptographicStandardContent(combined);
        const hexEncodedSignature: string = _bytesToHex(pkcs7Content);
        const signatureStartPos: number = this._firstRangeLength;
        buffer[<number>signatureStartPos] = '<'.charCodeAt(0) & 0xff;
        for (let i: number = 0; i < hexEncodedSignature.length; i++) {
            buffer[signatureStartPos + 1 + i] = hexEncodedSignature.charCodeAt(i) & 0xff;
        }
        const signatureEndPos: number = signatureStartPos + 1 + hexEncodedSignature.length;
        const paddingLength: number = this._secondRangeIndex - signatureEndPos - 1;
        if (paddingLength > 0) {
            buffer.fill('0'.charCodeAt(0) & 0xff, signatureEndPos, signatureEndPos + paddingLength);
        }
        buffer[this._secondRangeIndex - 1] = '>'.charCodeAt(0) & 0xff;
    }
    _getCryptographicStandardContent(data: Uint8Array): Uint8Array {
        try {
            let hashAlgorithm: string = '';
            let externalSignature: _PdfSignaturePrivateKey;
            let crlBytes: Uint8Array[];
            let ocspByte: Uint8Array;
            const chain: _PdfX509Certificate[] = [];
            if (this._signature._externalSignatureCallback) {
                if (this._signature._externalChain && this._signature._externalChain.length > 0) {
                    hashAlgorithm = DigestAlgorithm[this._signature._digestAlgorithm];
                    const pks: _PdfSignaturePrivateKey = new _PdfSignaturePrivateKey(hashAlgorithm);
                    externalSignature = pks;
                    chain.push(...this._signature._externalChain);
                } else {
                    const value: {signedData: Uint8Array, timestampData?: Uint8Array} = this._signature._externalSignatureCallback(
                        data, {
                            algorithm: this._signature._digestAlgorithm,
                            cryptographicStandard: CryptographicStandard.cms}) as {signedData: Uint8Array, timestampData?: Uint8Array};
                    return value.signedData;
                }
            } else {
                let certificateAlias: string = '';
                let pk: _PdfKeyEntry;
                const keys: Map<string, any> = this._certificate._publicKeyCryptographyCertificate._keys;// eslint-disable-line
                keys.forEach((keyEntry: _PdfKeyEntry, alias: string) => {
                    const entry: _PdfKeyEntry = keyEntry;
                    if (entry.privateKey) {
                        certificateAlias = alias;
                        pk = entry;
                    }
                });
                const certificates: _PdfX509Certificates[] =
                    this._certificate._publicKeyCryptographyCertificate._getCertificateChain(certificateAlias);
                certificates.forEach((c: _PdfX509Certificates) => {
                    chain.push(c._certificate);
                });
                const digest: string = DigestAlgorithm[this._signature._digestAlgorithm];
                const pks: _PdfSignaturePrivateKey = new _PdfSignaturePrivateKey(digest, pk.privateKey);
                hashAlgorithm = digest;
                externalSignature = pks;
            }
            const pkcs7: _PdfCryptographicMessageSyntaxSigner = new _PdfCryptographicMessageSyntaxSigner(null,
                                                                                                         chain,
                                                                                                         hashAlgorithm,
                                                                                                         false);
            const hash: Uint8Array = pkcs7._getDigestAlgorithm()._digest(data, hashAlgorithm);
            const sequenceDataSet: Uint8Array = pkcs7._getSequenceDataSet(hash, ocspByte, crlBytes,
                                                                          this._signature._cryptographicStandard);
            let extSignature: Uint8Array;
            if (this._signature._externalChain && this._signature._externalChain.length > 0) {
                const value: {signedData: Uint8Array, timestampData?: Uint8Array} = this._signature._externalSignatureCallback(
                    sequenceDataSet, {algorithm: this._signature._digestAlgorithm,
                        cryptographicStandard: this._signature._cryptographicStandard}) as
                        {signedData: Uint8Array, timestampData?: Uint8Array};
                if (value && value.signedData) {
                    extSignature = value.signedData;
                }
                if (!value.signedData) {
                    return new Uint8Array(this._estimatedSize).fill(0);
                }
            } else {
                extSignature = externalSignature._sign(sequenceDataSet);
            }
            pkcs7._setSignedData(extSignature, null, externalSignature._getEncryptionAlgorithm());
            let cryptographicStandard: CryptographicStandard;
            if (this._signature && this._signature._cryptographicStandard) {
                cryptographicStandard = this._signature._cryptographicStandard;
            } else {
                cryptographicStandard = CryptographicStandard.cms;
            }
            return pkcs7._sign(
                hash,
                null,
                ocspByte,
                crlBytes,
                cryptographicStandard,
                hashAlgorithm
            );
        } catch (error) {
            return new Uint8Array(this._estimatedSize).fill(0);
        }
    }
    _saveRangeItem(buffer: Uint8Array, str: string, startPosition: number): number {
        const utf8Bytes: number[] = [];
        for (let i: number = 0; i < str.length; i++) {
            utf8Bytes.push(str.charCodeAt(i) & 0xff);
        }
        buffer.set(utf8Bytes, startPosition);
        return startPosition + str.length;
    }
}
