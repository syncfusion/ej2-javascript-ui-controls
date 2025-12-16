import { _UniversalType, _TagClassType } from './../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfBasicEncodingElement } from '../asn1/basic-encoding-element';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
import { _PdfX509Certificate } from './x509-certificate';
import { _PdfX509CertificateStructure } from './x509-certificate-structure';
export class _PdfX509CertificateParser {
    private _sData: _PdfAbstractSyntaxElement[];
    private _sDataObjectCount: number = 0;
    private _currentStream: Uint8Array;
    _readDistinguishEncoderCertificate(bytes: Uint8Array, isCertificateParsing: boolean): _PdfX509Certificate {
        const structure: _PdfX509CertificateStructure = new _PdfX509CertificateStructure();
        const stream:  _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        stream._fromBytes(bytes);
        const seq: _PdfAbstractSyntaxElement[] = stream._getSequence();
        const tagNumber: number = seq[0]._getTagNumber();
        if (seq.length > 1 && tagNumber === _UniversalType.objectIdentifier) {
            const oid: _PdfObjectIdentifier = seq[0]._getObjectIdentifier();
            const dotDelimitedNotation: string = oid._getDotDelimitedNotation();
            if (dotDelimitedNotation === '1.2.840.113549.1.7.2') {
                if (seq.length >= 2) {
                    const inner: _PdfAbstractSyntaxElement = seq[1]._getInner();
                    const innerSequence: _PdfAbstractSyntaxElement[] = inner._getSequence();
                    const signedSequence: _PdfAbstractSyntaxElement[] = innerSequence;
                    for (const element of signedSequence) {
                        if (element instanceof _PdfBasicEncodingElement && element._tagClass === _TagClassType.context
                            && element._getTagNumber() === 0) {
                            const inner: _PdfAbstractSyntaxElement = element._getInner(isCertificateParsing);
                            let innerSet: _PdfAbstractSyntaxElement[];
                            if (isCertificateParsing) {
                                innerSet = inner._getSequence();
                            } else {
                                innerSet = inner._getAbstractSetValue();
                            }
                            this._sData = innerSet;
                            break;
                        }
                    }
                }
                return this._getCertificate(isCertificateParsing);
            }
        }
        return this._createX509Certificate(structure._getInstance(seq));
    }
    _getCertificate(isCertificateParsing?: boolean): _PdfX509Certificate {
        const structure: _PdfX509CertificateStructure = new _PdfX509CertificateStructure();
        if (this._sData) {
            if (!isCertificateParsing) {
                while (this._sDataObjectCount < this._sData.length) {
                    const obj: _PdfAbstractSyntaxElement = this._sData[this._sDataObjectCount++];
                    const tagNumber: number = obj._getTagNumber();
                    if (tagNumber === _UniversalType.sequence) {
                        return this._createX509Certificate(structure._getInstance(obj._getSequence()));
                    }
                }
            } else {
                return this._createX509Certificate(structure._getInstance(this._sData));
            }
        }
        return null;
    }
    _createX509Certificate(structure: _PdfX509CertificateStructure): _PdfX509Certificate {
        return new _PdfX509Certificate(structure);
    }
    _readCertificate(input: Uint8Array, isCertificateParsing: boolean = false): _PdfX509Certificate {
        return this._readCertificateFromStream(input, isCertificateParsing);
    }
    _readCertificateFromStream(stream: Uint8Array, isCertificateParsing: boolean): _PdfX509Certificate {
        if (!stream || stream.length === 0) {
            throw new Error('Input stream is empty or null');
        }
        if (this._currentStream !== stream) {
            this._currentStream = stream;
            this._sData = null;
            this._sDataObjectCount = 0;
        }
        if (this._sData && this._sDataObjectCount < this._sData.length) {
            return this._getCertificate();
        }
        const tag: number = stream[0];
        if (tag < 0) {
            return null;
        }
        return this._readDistinguishEncoderCertificate(stream, isCertificateParsing);
    }
}
