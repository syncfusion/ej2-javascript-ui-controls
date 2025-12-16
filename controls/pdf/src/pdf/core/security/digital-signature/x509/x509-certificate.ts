import { _ConstructionType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfBasicEncodingElement } from '../asn1/basic-encoding-element';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
import { _isBasicEncodingElement } from '../asn1/utils';
import { _PdfPublicKeyInformation } from './x509-certificate-key';
import { _PdfX509CertificateStructure } from './x509-certificate-structure';
import { _PdfCipherParameter, _PdfRonCipherParameter } from './x509-cipher-handler';
import { _PdfX509ExtensionBase, _PdfX509Extensions } from './x509-extensions';
import { _PdfSignedCertificate } from './x509-signed-certificate';
export class _PdfX509Certificate extends _PdfX509ExtensionBase {
    _structure: _PdfX509CertificateStructure;
    _publicKeyBytes: Uint8Array;
    _keyUsage: boolean[] = [];
    constructor(certificate: _PdfX509CertificateStructure) {
        super();
        this._structure = certificate;
        const keyUsageOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.15');
        const keyUsageExt: _PdfAbstractSyntaxElement = this._getExtension(keyUsageOid);
        if (keyUsageExt) {
            const rawBytes: Uint8Array = keyUsageExt._getValue();
            const asn1Element: _PdfAbstractSyntaxElement = _isBasicEncodingElement(rawBytes)
                ? new _PdfBasicEncodingElement()
                : new _PdfUniqueEncodingElement();
            asn1Element._fromBytes(rawBytes);
            const bitStringElement: _PdfAbstractSyntaxElement = asn1Element._construction === _ConstructionType.constructed
                ? asn1Element._getInner()
                : asn1Element;
            const bitBytes: Uint8Array = bitStringElement._getValue();
            const unusedBits: number = bitBytes[0];
            const bits: Uint8Array = bitBytes.slice(1);
            const length: number = (bits.length * 8) - unusedBits;
            this._keyUsage = Array.from({ length: Math.max(9, length) }, (value: any, i: number) => { // eslint-disable-line
                return (bits[Math.floor(i / 8)] & (0x80 >> (i % 8))) !== 0;
            });
        } else {
            this._keyUsage = null;
        }
    }
    _getExtensions(): _PdfX509Extensions {
        const signed: _PdfSignedCertificate = this._structure._getSignedCertificate();
        return signed._getVersion() === 3 ? signed._extensions : new _PdfX509Extensions();
    }
    _getPublicKey(): _PdfCipherParameter {
        const signed: _PdfSignedCertificate = this._structure._getSignedCertificate();
        return this._createKey(signed._publicKeyInformation);
    }
    _createKey(publicKeyInfo: _PdfPublicKeyInformation): _PdfCipherParameter {
        const algOID: string = publicKeyInfo._algorithms._objectID.toString();
        const publicKeyElement: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        publicKeyElement._fromBytes(publicKeyInfo._publicKey._getBytes());
        this._publicKeyBytes = publicKeyInfo._publicKey._data;
        if (algOID === '1.2.840.113549.1.1.1') {
            return this._parsePublicKey(publicKeyElement);
        }
        throw new Error('Unsupported Algorithm');
    }
    _parsePublicKey(publicKey: _PdfAbstractSyntaxElement): _PdfCipherParameter {
        const seq: _PdfAbstractSyntaxElement[] = publicKey._getSequence();
        if (!seq || seq.length < 2) {
            throw new Error('Invalid RSA public key structure');
        }
        const modulus: Uint8Array = seq[0]._getValue();
        const exponent: Uint8Array = seq[1]._getValue();
        return new _PdfRonCipherParameter(true, modulus, exponent);
    }
    _getTobeSignedCertificate(): Uint8Array {
        const signed: _PdfSignedCertificate = this._structure._getSignedCertificate();
        return signed._getDistinguishEncoded();
    }
    _getEncoded(): Uint8Array {
        const asn1Element: Uint8Array = this._structure._getDerEncoded();
        return asn1Element;
    }
    _getEncodedString(): Uint8Array {
        return this._getEncoded();
    }
}
export class _PdfX509Certificates {
    _certificate: _PdfX509Certificate;
    _hashValue: number;
    _hashValueSet: boolean = false;
    constructor(certificates: _PdfX509Certificate) {
        this._certificate = certificates;
    }
}
