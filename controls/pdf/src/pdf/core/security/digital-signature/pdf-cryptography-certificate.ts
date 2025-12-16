import { _extractAttributes, _areUint8ArraysEqual, _bytesToHex, _padStart } from '../../utils';
import { _PdfBigInt } from './pdf-big-integer';
import { _PdfCertificateIdentifier } from './pdf-certificate-identifier';
import { _PdfCertificateTable } from './pdf-certificate-table';
import { _PdfSubjectKeyIdentifier } from './pdf-key-identifier';
import { _PdfPublicKeyInformation } from './x509/x509-certificate-key';
import { _PdfAlgorithms } from './x509/x509-algorithm';
import { _PdfUniqueBitString } from './x509/x509-bit-string-handler';
import { _PdfX509Certificate, _PdfX509Certificates } from './x509/x509-certificate';
import { _PdfX509CertificateParser } from './x509/x509-certificate-parser';
import { _PdfCipherParameter, _PdfRonCipherParameter } from './x509/x509-cipher-handler';
import { _PdfAbstractSyntaxElement } from './asn1/abstract-syntax';
import { _PdfObjectIdentifier } from './asn1/identifier-mapping';
import { _PdfUniqueEncodingElement } from './asn1/unique-encoding-element';
import { _PdfBasicEncodingElement } from './asn1/basic-encoding-element';
import { _isBasicEncodingElement } from './asn1/utils';
import { _TagClassType } from './asn1/enumerator';
import { _Sha1 } from '../encryptors/secureHash-algorithm1';
import { _Sha256 } from '../encryptors/secureHash-algorithm256';
import { _Sha384, _Sha512 } from '../encryptors/secureHash-algorithm512';
import { _MD5 } from '../encryptors/messageDigest5';
import { _RaceEvaluationMessageDigest } from '../encryptors/evaluation-digest';
import { _AdvancedEncryption128Cipher } from '../encryptors/advance-cipher';
import { _CipherTwo, _NormalCipherFour } from '../encryptors/normal-cipher';
import { _TripleDataEncryptionStandardCipher } from '../encryptors/encryption-cipher';
import { _DataEncryptionStandardCipher } from '../encryptors/cipher-tranform';
export interface _PdfKeyEntry {
    privateKey: any; //eslint-disable-line
    attributes: Record<string, any>; //eslint-disable-line
}
export class _PdfPublicKeyCryptographyCertificate {
    _certificateChain: _PdfAbstractSyntaxElement[] = [];
    _keys: Map<string, any> = new Map(); //eslint-disable-line
    _localIdentifiers: Map<string, string> = new Map();
    _data: string = '1.2.840.113549.1.7.1';
    _encryptedData: string = '1.2.840.113549.1.7.6';
    _certificateBag: string = '1.2.840.113549.1.12.10.1.3';
    _shroudedKeyBag: string = '1.2.840.113549.1.12.10.1.2';
    _keyBag: string = '1.2.840.113549.1.12.10.1.1';
    _attributes: Record<string, any> = {}; //eslint-disable-line
    _certificates: _PdfCertificateTable = new _PdfCertificateTable();
    _chainCertificates: Map<_PdfCertificateIdentifier, _PdfX509Certificates>;
    _keyCertificates: Map<string, _PdfX509Certificates>;
    _publicKeyString: string;
    _isUnMarkedKey: boolean = false;
    constructor(input?: Uint8Array, password?: string) {
        if (input && input.length > 0 && password !== null) {
            this._loadCertificate(input, password);
        }
    }
    _createSubjectKeyID(publicKey: _PdfCipherParameter, id: Uint8Array): _PdfSubjectKeyIdentifier {
        if (publicKey instanceof _PdfRonCipherParameter) {
            const algorithm: _PdfAlgorithms = new _PdfAlgorithms();
            algorithm._objectID = new _PdfObjectIdentifier()._fromString('1.2.840.113549.1.1.1');
            algorithm._parameters = algorithm._getUniqueEncoderNull();
            algorithm._parametersDefined = true;
            const bitString: _PdfUniqueBitString = new _PdfUniqueBitString(id, 0);
            const publicKeyInfo: _PdfPublicKeyInformation = new _PdfPublicKeyInformation(algorithm, bitString);
            return new _PdfSubjectKeyIdentifier(publicKeyInfo);
        }
        throw new Error(`Invalid Key: ${publicKey}`);
    }
    _loadCertificate(input: Uint8Array, password: string): void {
        if (!input || input.length === 0) {
            throw new Error('input is null');
        }
        if (!password) {
            throw new Error('password is null');
        }
        const root: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        root._fromBytes(input);
        const pfxSequence: _PdfAbstractSyntaxElement[] = root._getSequence();
        const contentInfo: _PdfAbstractSyntaxElement = pfxSequence[1];
        const contentInfoSeq: _PdfAbstractSyntaxElement[] = contentInfo._getSequence();
        const taggedContent: _PdfAbstractSyntaxElement = contentInfoSeq[1];
        const seq: _PdfAbstractSyntaxElement[] = taggedContent._getSequence();
        const contentOctetElement: _PdfAbstractSyntaxElement =
            seq && seq[0];
        if (!contentOctetElement || !contentOctetElement._getOctetString()) {
            throw new Error('Missing or invalid content octets');
        }
        const contentOctets: Uint8Array = contentOctetElement._getOctetString();
        const innerIsBER: boolean = _isBasicEncodingElement(contentOctets);
        const inner: _PdfAbstractSyntaxElement =  innerIsBER ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
        inner._fromBytes(contentOctets);
        const innerSequence: _PdfAbstractSyntaxElement[] = inner._getSequence();
        for (const entry of innerSequence) {
            const entrySeq: _PdfAbstractSyntaxElement[] = entry._getSequence();
            const typeOID: string = entrySeq[0]._getObjectIdentifier().toString();
            if (typeOID === this._data) {
                const dataContentWrapper: _PdfAbstractSyntaxElement = entrySeq[1];
                const dataContent: _PdfAbstractSyntaxElement = dataContentWrapper._getSequence()
                && dataContentWrapper._getSequence()[0];
                if (dataContent) {
                    this._processData(dataContent, password);
                }
            } else if (typeOID === this._encryptedData) {
                const encryptedContentWrapper: _PdfAbstractSyntaxElement = entrySeq[1];
                const dataContent: _PdfAbstractSyntaxElement = encryptedContentWrapper._getSequence()
                    ? encryptedContentWrapper._getSequence()[0]
                    : undefined;
                this._processEncryptedData(dataContent, password);
            }
        }
        if (this._certificateChain && this._certificateChain.length > 0) {
            this._processCertificateCollection(this._certificateChain);
        }
    }
    _processCertificateCollection(certificateChain: any[]): void { // eslint-disable-line
        this._certificates = new _PdfCertificateTable();
        this._chainCertificates = new Map<_PdfCertificateIdentifier, _PdfX509Certificates>();
        this._keyCertificates = new Map<string, _PdfX509Certificates>();
        for (const abstractSyntaxCollection of certificateChain) {
            const asn1Sequence: _PdfAbstractSyntaxElement = abstractSyntaxCollection;
            const sequence: _PdfAbstractSyntaxElement[] = asn1Sequence._getSequence();
            const certValue: _PdfAbstractSyntaxElement = sequence[1];
            const certSequence: _PdfAbstractSyntaxElement[] = certValue._getSequence();
            const certOctet: Uint8Array = certSequence[0]._getSequence()[1]._getSequence()[0]._getValue();
            if (!certOctet) {
                continue;
            }
            const certificate: _PdfX509Certificate = new _PdfX509CertificateParser()._readCertificate(certOctet);
            if (!certificate) {
                continue;
            }
            const attributes: Record<string, any> = {}; // eslint-disable-line
            let localId: Uint8Array;
            let key: string;
            const tempAttributes: _PdfUniqueEncodingElement = _extractAttributes(asn1Sequence as _PdfUniqueEncodingElement);
            if (tempAttributes) {
                let attributeSet: _PdfAbstractSyntaxElement[];
                try {
                    if (tempAttributes) {
                        attributeSet = tempAttributes._getAbstractSetValue();
                    }
                } catch {
                    if (tempAttributes) {
                        attributeSet = tempAttributes._getSequence();
                    }
                }
                for (const sequence of attributeSet) {
                    const items: _PdfAbstractSyntaxElement[] = sequence._getSequence();
                    if (!items || items.length < 2) {
                        continue;
                    }
                    const attributeOid: string = items[0]._getObjectIdentifier().toString();
                    const attrSet: _PdfAbstractSyntaxElement[] = typeof items[1]._getAbstractSetValue() !== 'undefined' &&
                    items[1]._getAbstractSetValue() !== null
                        ? items[1]._getAbstractSetValue()
                        : items[1]._getSequence();
                    if (!attrSet || attrSet.length === 0) {
                        continue;
                    }
                    const attr: _PdfAbstractSyntaxElement = attrSet[0];
                    if (attributes[<string>attributeOid]) {
                        if (JSON.stringify(attributes[<string>attributeOid]) !== JSON.stringify(attr)) {
                            throw new Error('attempt to add existing attribute with different value');
                        }
                    } else {
                        attributes[<string>attributeOid] = attr;
                    }
                    if (attributeOid === '1.2.840.113549.1.9.20') {
                        key = attr._getBmpString();
                    } else if (attributeOid === '1.2.840.113549.1.9.21') {
                        localId = attr._getOctetString();
                    }
                }
            }
            const certId: _PdfCertificateIdentifier = new _PdfCertificateIdentifier({ pubicKey: certificate._getPublicKey(),
                id: certificate._publicKeyBytes });
            const certificateCollection: _PdfX509Certificates = new _PdfX509Certificates(certificate);
            this._chainCertificates.set(certId, certificateCollection);
            if (this._isUnMarkedKey) {
                const name: string = _bytesToHex(certId._identifier);
                this._keyCertificates.set(name, certificateCollection);
                const temp: string = this._keys.get('unmarked');
                this._keys.delete('unmarked');
                this._keys.set('name', temp);
            } else {
                if (localId) {
                    const name: string = _bytesToHex(localId);
                    this._keyCertificates.set(name, certificateCollection);
                }
                if (key) {
                    this._certificates._setValue(key, certificateCollection);
                }
            }
        }
    }
    _processData(contentElement: _PdfAbstractSyntaxElement, password: string): void {
        const octets: Uint8Array = contentElement._getOctetString();
        if (!octets) {
            return;
        }
        const innerIsBER: boolean = _isBasicEncodingElement(octets);
        const inner: _PdfAbstractSyntaxElement = innerIsBER ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
        inner._fromBytes(octets);
        const contentSequence: _PdfAbstractSyntaxElement[] = inner._getSequence();
        for (const sub of contentSequence) {
            const subSeq: _PdfAbstractSyntaxElement[] = sub._getSequence();
            const bagId: string = subSeq[0]._getObjectIdentifier().toString();
            if (bagId === '1.2.840.113549.1.12.10.1.2') {
                const encryptedKeyOctets: _PdfAbstractSyntaxElement = subSeq[1]._getSequence()[0];
                const encryptedKeyInfoSeq: _PdfAbstractSyntaxElement[] = encryptedKeyOctets._getSequence();
                const encryptionAlgorithmSeq: _PdfAbstractSyntaxElement[] = encryptedKeyInfoSeq[0]._getSequence();
                const encryptedOctets: Uint8Array = encryptedKeyInfoSeq[1]._getOctetString();
                const decryptedKeyBytes: Uint8Array = this._getCryptographicData(encryptionAlgorithmSeq,
                                                                                 encryptedOctets, password);
                const innerIsBER: boolean = _isBasicEncodingElement(octets);
                const privateKeyElement: _PdfAbstractSyntaxElement = innerIsBER ? new _PdfBasicEncodingElement() :
                    new _PdfUniqueEncodingElement();
                privateKeyElement._fromBytes(decryptedKeyBytes);
                const keySeq: _PdfAbstractSyntaxElement[] = privateKeyElement._getSequence();
                const algorithmOID: string = keySeq[1]._getSequence()[0]._getObjectIdentifier().toString();
                const privateKeyOctets: Uint8Array = keySeq[2]._getOctetString();
                let privateKey: any; //eslint-disable-line
                if (algorithmOID === '1.2.840.113549.1.1.1') {
                    const parsed: any = this._parsePrivateKey(privateKeyOctets); // eslint-disable-line
                    privateKey = this._createPrivateKey(parsed.modulus, parsed.publicExponent,
                                                        parsed.privateExponent, parsed.prime1,
                                                        parsed.prime2, parsed.exponent1,
                                                        parsed.exponent2, parsed.coefficient);
                }
                let localIdentifier: string;
                let localId: Uint8Array;
                const attributes: Record<string, any> = {}; //eslint-disable-line
                let keyEntry: _PdfKeyEntry;
                if (privateKey) {
                    keyEntry = {
                        privateKey,
                        attributes
                    };
                }
                const attributeSequence: _PdfAbstractSyntaxElement[] =
                    (subSeq[2] && subSeq[2]._getSequence()
                        ? (subSeq[2]._getSequence() as _PdfAbstractSyntaxElement[])
                        : []).map((el: _PdfAbstractSyntaxElement) => el);
                if (attributeSequence && attributeSequence.length > 0) {
                    for (const attribute of attributeSequence) {
                        const attributeSet: _PdfAbstractSyntaxElement[] = attribute._getSequence();
                        const attributeOid: string = attributeSet[0]._getObjectIdentifier().toString();
                        const attributeValues: _PdfAbstractSyntaxElement[] = attributeSet[1]._getAbstractSetValue();
                        if (attributeValues && attributeValues.length > 0) {
                            const value: _PdfAbstractSyntaxElement = attributeValues[0];
                            if (attributes[<string>attributeOid] && attributes[<string>attributeOid] !== value) {
                                throw new Error('Should not add existing attribute with different value');
                            }
                            attributes[<string>attributeOid] = value;
                            if (attributeOid === '1.2.840.113549.1.9.20') {
                                localIdentifier = value._getBmpString() ? value._getBmpString()
                                    : value._getUtf8String() ? value._getUtf8String() : '';
                            } else if (attributeOid === '1.2.840.113549.1.9.21') {
                                localId = value._getOctetString();
                            }
                        }
                    }
                }
                if (localId) {
                    const name: string = Array.from(localId)
                        .map((b: number) => _padStart(b.toString(16), 2, '0'))
                        .join('');
                    if (!localIdentifier) {
                        this._keys.set(name, keyEntry);
                    } else {
                        this._localIdentifiers.set(localIdentifier, name);
                        this._keys.set(localIdentifier, keyEntry);
                    }
                } else {
                    this._isUnMarkedKey = true;
                    this._keys.set('unmarked', privateKey);
                }
            }
            else if (bagId === this._certificateBag) {
                this._certificateChain.push(sub as _PdfUniqueEncodingElement);
            }
        }
    }
    private _parseAndDecrypt(contentElement: _PdfAbstractSyntaxElement, password: string): Uint8Array {
        const encryptedDataSeq: _PdfAbstractSyntaxElement[] = contentElement._getSequence();
        const encryptedContentInfo: _PdfAbstractSyntaxElement[] = encryptedDataSeq[1]._getSequence();
        const encryptionAlgorithm: _PdfAbstractSyntaxElement[] = encryptedContentInfo[1]._getSequence();
        const encryptedOctet: Uint8Array = encryptedContentInfo[2]._getOctetString();
        return this._getCryptographicData(encryptionAlgorithm, encryptedOctet, password);
    }
    private _decodeDecryptedBytes(decryptedBytes: Uint8Array): _PdfAbstractSyntaxElement[] {
        const innerIsBER: boolean = _isBasicEncodingElement(decryptedBytes);
        const decryptedElement: _PdfAbstractSyntaxElement = innerIsBER ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
        decryptedElement._fromBytes(decryptedBytes);
        return decryptedElement._getSequence();
    }
    private _handleCertificateBag(cert: _PdfAbstractSyntaxElement): void {
        this._certificateChain.push(cert as _PdfUniqueEncodingElement);
    }
    private _extractPrivateKeyFromKeyInfo(keyInfoRoot: _PdfAbstractSyntaxElement, password: string, isEncrypted: boolean): { privateKey?: any; attributesRoot?: _PdfAbstractSyntaxElement } { // eslint-disable-line
        if (isEncrypted) {
            // certSeq[1]._getSequence()[0] => EncryptedPrivateKeyInfo (for shroudedKeyBag)
            const encryptedPrivateKeyInfo: _PdfAbstractSyntaxElement = keyInfoRoot._getSequence()[0];
            const encryptedKeyInfoSeq: _PdfAbstractSyntaxElement[] = encryptedPrivateKeyInfo._getSequence();
            const encryptionAlgorithmSeq: _PdfAbstractSyntaxElement[] = encryptedKeyInfoSeq[0]._getSequence();
            const encryptedPrivOctets: Uint8Array = encryptedKeyInfoSeq[1]._getOctetString();

            const decryptedKeyBytes: Uint8Array = this._getCryptographicData(encryptionAlgorithmSeq, encryptedPrivOctets, password);
            const innerIsBER: boolean = _isBasicEncodingElement(decryptedKeyBytes);
            const privKeyElement: _PdfAbstractSyntaxElement = innerIsBER ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
            privKeyElement._fromBytes(decryptedKeyBytes);

            const keySeq: _PdfAbstractSyntaxElement[] = privKeyElement._getSequence();
            const algorithmOID: string = keySeq[1]._getSequence()[0]._getObjectIdentifier().toString();
            const privateKeyOctets: Uint8Array = keySeq[2]._getOctetString();
            let privateKey: any; // eslint-disable-line
            if (algorithmOID === '1.2.840.113549.1.1.1') {
                const parsed: Record<string, Uint8Array> = this._parsePrivateKey(privateKeyOctets);
                privateKey = this._createPrivateKey(
                    parsed.modulus, parsed.publicExponent, parsed.privateExponent,
                    parsed.prime1, parsed.prime2, parsed.exponent1, parsed.exponent2, parsed.coefficient
                );
            }
            return { privateKey, attributesRoot: null };
        } else {
            const privKeyInfoElement: _PdfAbstractSyntaxElement = keyInfoRoot._getSequence()[0];
            const keyInfoSeq: _PdfAbstractSyntaxElement[] = privKeyInfoElement._getSequence();
            const algorithmOID: string = keyInfoSeq[1]._getSequence()[0]._getObjectIdentifier().toString();
            const privateKeyOctets: Uint8Array = keyInfoSeq[2]._getOctetString();
            let privateKey: any;  // eslint-disable-line
            if (algorithmOID === '1.2.840.113549.1.1.1') {
                const parsed: any = this._parsePrivateKey(privateKeyOctets); // eslint-disable-line
                privateKey = this._createPrivateKey(
                    parsed.modulus, parsed.publicExponent, parsed.privateExponent,
                    parsed.prime1, parsed.prime2, parsed.exponent1, parsed.exponent2, parsed.coefficient
                );
            }
            return { privateKey, attributesRoot: null };
        }
    }
    private _extractLocalIdentifiers(attrsContainer: _PdfAbstractSyntaxElement): { localIdentifier?: string; localId?: Uint8Array } {
        let localIdentifier: string;
        let localId: Uint8Array;
        const attributeSequence: _PdfAbstractSyntaxElement[] =
            (attrsContainer && attrsContainer._getSequence()
                ? (attrsContainer._getSequence() as _PdfAbstractSyntaxElement[])
                : []).map((el: _PdfAbstractSyntaxElement) => el);
        for (const attribute of attributeSequence) {
            const attributeSet: _PdfAbstractSyntaxElement[] = attribute._getSequence();
            const attributeOid: string = attributeSet[0]._getObjectIdentifier().toString();
            const attributeValues: _PdfAbstractSyntaxElement[] = attributeSet[1]._getAbstractSetValue();
            if (attributeValues.length > 0) {
                const value: _PdfAbstractSyntaxElement = attributeValues[0];
                if (attributeOid === '1.2.840.113549.1.9.20') {
                    localIdentifier = value._getBmpString() ? value._getBmpString() : (value._getUtf8String() ? value._getUtf8String() : '');
                } else if (attributeOid === '1.2.840.113549.1.9.21') {
                    localId = value._getOctetString();
                }
            }
        }
        return { localIdentifier, localId };
    }
    private _storeKeyEntry(localIdentifier: string, localId: Uint8Array, keyEntry: _PdfKeyEntry | any): void { // eslint-disable-line
        if (localId) {
            const name: string = Array.from(localId).map((b: number) => _padStart(b.toString(16), 2, '0')).join('');
            if (!localIdentifier) {
                this._keys.set(name, keyEntry);
            } else {
                this._localIdentifiers.set(localIdentifier, name);
                this._keys.set(localIdentifier, keyEntry);
            }
        } else {
            this._keys.set('unmarked', keyEntry);
        }
    }
    private _handleShroudedKeyBag(certSeq: _PdfAbstractSyntaxElement[], password: string): void {
        const encryptedPrivateKeyInfo: _PdfAbstractSyntaxElement = certSeq[1]._getSequence()[0];
        const encryptedKeyInfoSeq: _PdfAbstractSyntaxElement[] = encryptedPrivateKeyInfo._getSequence();
        const encryptionAlgorithmSeq: _PdfAbstractSyntaxElement[] = encryptedKeyInfoSeq[0]._getSequence();
        const encryptedPrivOctets: Uint8Array = encryptedKeyInfoSeq[1]._getOctetString();
        const decryptedKeyBytes: Uint8Array = this._getCryptographicData(encryptionAlgorithmSeq, encryptedPrivOctets, password);
        const innerIsBER: boolean = _isBasicEncodingElement(decryptedKeyBytes);
        const privKeyElement: _PdfAbstractSyntaxElement = innerIsBER ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
        privKeyElement._fromBytes(decryptedKeyBytes);
        const keySeq: _PdfAbstractSyntaxElement[] = privKeyElement._getSequence();
        const algorithmOID: string = keySeq[1]._getSequence()[0]._getObjectIdentifier().toString();
        const privateKeyOctets: Uint8Array = keySeq[2]._getOctetString();
        let privateKey: any; // eslint-disable-line
        if (algorithmOID === '1.2.840.113549.1.1.1') {
            const parsed: Record<string, Uint8Array> = this._parsePrivateKey(privateKeyOctets);
            privateKey = this._createPrivateKey(
                parsed.modulus, parsed.publicExponent, parsed.privateExponent,
                parsed.prime1, parsed.prime2, parsed.exponent1, parsed.exponent2, parsed.coefficient
            );
        }
        const attributesRoot: _PdfAbstractSyntaxElement = certSeq[2];
        const { localIdentifier, localId } = this._extractLocalIdentifiers(attributesRoot);
        if (privateKey) {
            const keyEntry: _PdfKeyEntry = { privateKey, attributes: {} };
            this._storeKeyEntry(localIdentifier, localId, keyEntry);
        }
    }
    private _handleKeyBag(certSeq: _PdfAbstractSyntaxElement[]): void {
        const privKeyInfoElement: _PdfAbstractSyntaxElement = certSeq[1]._getSequence()[0];
        const keyInfoSeq: _PdfAbstractSyntaxElement[] = privKeyInfoElement._getSequence();
        const algorithmOID: string = keyInfoSeq[1]._getSequence()[0]._getObjectIdentifier().toString();
        const privateKeyOctets: Uint8Array = keyInfoSeq[2]._getOctetString();
        let privateKey: any; // eslint-disable-line
        if (algorithmOID === '1.2.840.113549.1.1.1') {
            const parsed: any = this._parsePrivateKey(privateKeyOctets); // eslint-disable-line
            privateKey = this._createPrivateKey(
                parsed.modulus, parsed.publicExponent, parsed.privateExponent,
                parsed.prime1, parsed.prime2, parsed.exponent1, parsed.exponent2, parsed.coefficient
            );
        }
        const attributesRoot: _PdfAbstractSyntaxElement = certSeq[2];
        const { localIdentifier, localId } = this._extractLocalIdentifiers(attributesRoot);
        if (privateKey) {
            const keyEntry: _PdfKeyEntry = { privateKey, attributes: {} };
            this._storeKeyEntry(localIdentifier, localId, keyEntry);
        }
    }
    _processEncryptedData(contentElement: _PdfAbstractSyntaxElement, password: string): void {
        const decryptedBytes: Uint8Array = this._parseAndDecrypt(contentElement, password);
        const certSequence: _PdfAbstractSyntaxElement[] = this._decodeDecryptedBytes(decryptedBytes);
        for (const cert of certSequence) {
            const certSeq: _PdfAbstractSyntaxElement[] = cert._getSequence();
            const bagId: string = certSeq[0]._getObjectIdentifier().toString();
            if (bagId === this._certificateBag) {
                this._handleCertificateBag(cert);
            } else if (bagId === this._shroudedKeyBag) {
                this._handleShroudedKeyBag(certSeq, password);
            } else if (bagId === this._keyBag) {
                this._handleKeyBag(certSeq);
            }
        }
    }
    _createPrivateKey(modulus: Uint8Array, publicExponent: Uint8Array, privateExponent: Uint8Array, p: Uint8Array,
                              q: Uint8Array, dP: Uint8Array, dQ: Uint8Array, inverse: Uint8Array): any { // eslint-disable-line
        const mod: _PdfBigInt = this._uint8ArrayToBigInt(modulus);
        const pubExp: _PdfBigInt = this._uint8ArrayToBigInt(publicExponent);
        const privExp: _PdfBigInt = this._uint8ArrayToBigInt(privateExponent);
        const _p: _PdfBigInt = this._uint8ArrayToBigInt(p);
        const _q: _PdfBigInt = this._uint8ArrayToBigInt(q);
        const _dP: _PdfBigInt = this._uint8ArrayToBigInt(dP);
        const _dQ: _PdfBigInt = this._uint8ArrayToBigInt(dQ);
        const inv: _PdfBigInt = this._uint8ArrayToBigInt(inverse);
        const _isPrivate: boolean = true;
        this._validateValue('publicExponent', pubExp);
        this._validateValue('p', _p);
        this._validateValue('q', _q);
        this._validateValue('dP', _dP);
        this._validateValue('dQ', _dQ);
        this._validateValue('inverse', inv);
        return {
            modulus: mod,
            publicExponent: pubExp,
            privateExponent: privExp,
            p: _p,
            q: _q,
            dP: _dP,
            dQ: _dQ,
            inverse: inv,
            get PublicExponent(): _PdfBigInt { return pubExp; },
            get P(): _PdfBigInt { return _p; },
            get Q(): _PdfBigInt { return _q; },
            get DP(): _PdfBigInt { return _dP; },
            get DQ(): _PdfBigInt { return _dQ; },
            get QInv(): _PdfBigInt { return inv; },
            get _isPrivate(): boolean { return _isPrivate; },
            equals(other: any) { //eslint-disable-line
                if (!other) {
                    return false;
                }
                return (this.dP === other.dP &&
                        this.dQ === other.dQ &&
                        this.privateExponent === other.privateExponent &&
                        this.modulus === other.modulus &&
                        this.p === other.p &&
                        this.q === other.q &&
                        this.publicExponent === other.publicExponent &&
                        this.inverse === other.inverse);
            },
            hashCode(): number {
                return (
                    this._extractLow32Bits(this.DP) ^
                    this._extractLow32Bits(this.DQ) ^
                    this._extractLow32Bits(this.privateExponent) ^
                    this._extractLow32Bits(this.modulus) ^
                    this._extractLow32Bits(this.P) ^
                    this._extractLow32Bits(this.Q) ^
                    this._extractLow32Bits(this.PublicExponent) ^
                    this._extractLow32Bits(this.QInv)
                );
            }
        };
    }
    _validateValue(name: string, value: _PdfBigInt): void {
        if (value === null || typeof value === 'undefined') {
            throw new Error(`RSA parameter '${name}' is null or undefined`);
        }
    }
    _uint8ArrayToBigInt(bytes: Uint8Array): _PdfBigInt {
        const result: _PdfBigInt = new _PdfBigInt('0');
        for (let i: number = 0; i < bytes.length; i++) {
            result._multiply();
            result._add(bytes[<number>i]);
        }
        return result;
    }
    _getPassword(password: string): Uint8Array {
        const out: Uint8Array = new Uint8Array((password.length + 1) * 2);
        for (let i: number = 0; i < password.length; ++i) {
            const code: number = password.charCodeAt(i);
            out[i * 2] = code >> 8;
            out[i * 2 + 1] = code & 0xff;
        }
        return out;
    }
    _getCryptographicData(algorithmSeq: _PdfAbstractSyntaxElement[], encryptedData: Uint8Array, password: string): Uint8Array {
        const oid: string = algorithmSeq[0]._getObjectIdentifier().toString();
        const params: _PdfAbstractSyntaxElement[] = algorithmSeq[1]._getSequence();
        const salt: Uint8Array = params[0]._getOctetString();
        const iterations: number = Number(params[1]._getInteger());
        const passwordBytes: Uint8Array = this._getPassword(password) as Uint8Array;
        const oidMap: Record<string, {
            name: string;
            keySize: number;
            ivSize: number;
            cipher: 'AES' | 'RC4' | 'DESEDE' | 'RC2' | 'DES';
            hash: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5' | 'ripemd160';
        }> = {
            '1.2.840.113549.1.12.1.1': { name: 'PBEwithSHA-1and128bitRC4', keySize: 16, ivSize: 0, cipher: 'RC4', hash: 'sha1' },
            '1.2.840.113549.1.12.1.2': { name: 'PBEwithSHA-1and40bitRC4', keySize: 5, ivSize: 0, cipher: 'RC4', hash: 'sha1' },
            '1.2.840.113549.1.12.1.3': { name: 'PBEwithSHA-1and3-KeyTripleDES-CBC', keySize: 24, ivSize: 8, cipher: 'DESEDE', hash: 'sha1' },
            '1.2.840.113549.1.12.1.4': { name: 'PBEwithSHA-1and3-KeyTripleDES-CBC', keySize: 24, ivSize: 8, cipher: 'DESEDE', hash: 'sha1' },
            '1.2.840.113549.1.12.1.5': { name: 'PBEwithSHA-1and128bitRC2-CBC', keySize: 16, ivSize: 8, cipher: 'RC2', hash: 'sha1' },
            '1.2.840.113549.1.12.1.6': { name: 'PBEwithSHA-1and40bitRC2-CBC', keySize: 5, ivSize: 8, cipher: 'RC2', hash: 'sha1' },
            '1.2.840.113549.1.5.12': { name: 'PBKDF2', keySize: 0, ivSize: 0, cipher: 'AES', hash: 'sha1' },
            '1.2.840.113549.1.5.3': { name: 'pbeWithMD5AndDES-CBC', keySize: 8, ivSize: 8, cipher: 'DES', hash: 'md5' },
            '1.2.840.113549.1.5.10': { name: 'pbeWithSHA1AndDES-CBC', keySize: 8, ivSize: 8, cipher: 'DES', hash: 'sha1' },
            '1.2.840.113549.1.12.1.8': { name: 'PBEwithSHA-1and128bitRC2-CBC', keySize: 16, ivSize: 8, cipher: 'RC2', hash: 'sha1' },
            '1.2.840.113549.1.12.1.9': { name: 'PBEwithSHA-1and40bitRC2-CBC', keySize: 5, ivSize: 8, cipher: 'RC2', hash: 'sha1' },
            '1.2.840.113549.1.5.6': { name: 'pbeWithMD5AndRC2-CBC', keySize: 16, ivSize: 8, cipher: 'RC2', hash: 'md5' },
            '1.2.840.113549.1.5.11': { name: 'pbeWithSHA1AndRC2-CBC', keySize: 16, ivSize: 8, cipher: 'RC2', hash: 'sha1' }
        };
        const hashMap: any = { // eslint-disable-line
            sha1: { hash: (d: Uint8Array) => new _Sha1()._hash(d, 0, d.length), u: 20, v: 64 },
            sha256: { hash: (d: Uint8Array) => new _Sha256()._hash(d, 0, d.length), u: 32, v: 64 },
            sha384: { hash: (d: Uint8Array) => new _Sha384()._hash(d, 0, d.length), u: 48, v: 128 },
            sha512: { hash: (d: Uint8Array) => new _Sha512()._hash(d, 0, d.length), u: 64, v: 128 },
            md5: { hash: (d: Uint8Array) => new _MD5().hash(d, 0, d.length), u: 16, v: 64 },
            ripemd160: { hash: (d: Uint8Array) => new _RaceEvaluationMessageDigest()._hash(d, 0, d.length), u: 20, v: 64 }
        };
        if (!(oid in oidMap)) {
            throw new Error(`Unsupported oid: ${oid}`);
        }
        const algorithm: { name: string; keySize: number; ivSize: number; cipher: 'AES' | 'RC4' | 'DESEDE' | 'RC2' | 'DES'; hash: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5' | 'ripemd160'; } =
            oidMap[<string>oid];
        const inputHash: any = hashMap[algorithm.hash]; //eslint-disable-line
        const key: Uint8Array = this._generateDerivedKey(passwordBytes, salt, 1, iterations, algorithm.keySize, inputHash);
        const iv: Uint8Array = algorithm.ivSize > 0
            ? this._generateDerivedKey(passwordBytes, salt, 2, iterations, algorithm.ivSize, inputHash)
            : undefined;
        const actualEncrypted: Uint8Array = encryptedData;
        let decrypted: Uint8Array;
        switch (algorithm.cipher) {
        case 'AES':
            decrypted = (new _AdvancedEncryption128Cipher(key))._decryptBlock(actualEncrypted, true, iv);
            break;
        case 'RC4':
            decrypted = (new _NormalCipherFour(key))._decryptBlock(actualEncrypted);
            break;
        case 'DESEDE': {
            const tripleDES: _TripleDataEncryptionStandardCipher = new _TripleDataEncryptionStandardCipher(key, false);
            if (actualEncrypted.length % 8 !== 0) {
                throw new Error('3DES expects multiples of 8 bytes');
            }
            const decryptedDESEDE: Uint8Array = new Uint8Array(actualEncrypted.length);
            let cbcBytes: Uint8Array = iv.slice();
            for (let i: number = 0; i < actualEncrypted.length; i += tripleDES._blockSize) {
                const cipherBlock: Uint8Array = actualEncrypted.slice(i, i + tripleDES._blockSize);
                tripleDES._processBlock(actualEncrypted, i, decryptedDESEDE, i);
                for (let j: number = 0; j < tripleDES._blockSize; j++) {
                    decryptedDESEDE[i + j] ^= cbcBytes[<number>j];
                }
                cbcBytes = cipherBlock;
            }
            decrypted = decryptedDESEDE;
            break;
        }
        case 'RC2': {
            const rc2: _CipherTwo = new _CipherTwo(key, algorithm.keySize * 8);
            decrypted = rc2._decrypt(actualEncrypted, iv);
            break;
        }
        case 'DES': {
            if (actualEncrypted.length % 8 !== 0) {
                throw new Error('DES expects multiples of 8 bytes');
            }
            const des: _DataEncryptionStandardCipher = new _DataEncryptionStandardCipher(key, false);
            const decryptedDes: Uint8Array = new Uint8Array(actualEncrypted.length);
            for (let i: number = 0; i < actualEncrypted.length; i += 8) {
                des._processBlock(actualEncrypted, i, decryptedDes, i);
            }
            decrypted = decryptedDes;
            break;
        }
        default:
            throw new Error(`Unsupported cipher: ${algorithm.cipher}`);
        }
        return decrypted;
    }
    _generateDerivedKey(password: Uint8Array, salt: Uint8Array, id: number,
                        iterations: number, n: number,
                        hashValues: { hash(data: Uint8Array): Uint8Array; u: number; v: number }): Uint8Array {
        const { u, v }: any = hashValues; // eslint-disable-line
        const D: Uint8Array = new Uint8Array(v).fill(id);
        const Slen: number = salt.length ? v * Math.ceil(salt.length / v) : 0;
        const S: Uint8Array = new Uint8Array(Slen);
        for (let i: number = 0; i < Slen; ++i) {
            S[<number>i] = salt[i % salt.length];
        }
        const Plen: number = password.length ? v * Math.ceil(password.length / v) : 0;
        const P: Uint8Array = new Uint8Array(Plen);
        for (let i: number = 0; i < Plen; ++i) {
            P[<number>i] = password[i % password.length];
        }
        const I: Uint8Array = new Uint8Array(Slen + Plen);
        I.set(S, 0);
        I.set(P, Slen);
        const c: number = Math.ceil(n / u);
        const result: Uint8Array = new Uint8Array(n);
        let offset: number = 0;
        for (let i: number = 0; i < c; ++i) {
            const buf: Uint8Array = new Uint8Array(D.length + I.length);
            buf.set(D);
            buf.set(I, D.length);
            let Ai: Uint8Array = hashValues.hash(buf);
            for (let j: number = 1; j < iterations; ++j) {
                Ai = hashValues.hash(Ai);
            }
            const blockLen: number = Math.min(u, n - offset);
            result.set(Ai.subarray(0, blockLen), offset);
            offset += blockLen;
            const B: Uint8Array = new Uint8Array(v);
            for (let j: number = 0; j < v; ++j) {
                B[<number>j] = Ai[j % Ai.length];
            }
            for (let j: number = 0; j < I.length / v; ++j) {
                this._adjust(I, j * v, B);
            }
        }
        return result;
    }
    _adjust(I: Uint8Array, offset: number, B: Uint8Array): void {
        let x: number = B[B.length - 1] + I[offset + B.length - 1] + 1;
        I[offset + B.length - 1] = x & 0xff;
        x >>>= 8;
        for (let i: number = B.length - 2; i >= 0; --i) {
            x += B[<number>i] + I[offset + i];
            I[offset + i] = x & 0xff;
            x >>>= 8;
        }
    }
    _getCertificate(certificateKey: string): _PdfX509Certificates {
        const certificates: _PdfX509Certificates = this._certificates._get(certificateKey);
        if (certificates && certificates instanceof _PdfX509Certificates) {
            return certificates;
        } else {
            let id: string;
            if (this._localIdentifiers.has(certificateKey)) {
                id = this._localIdentifiers.get(certificateKey);
            }
            if (typeof id !== 'undefined' && id !== null) {
                const certificates: _PdfX509Certificates = this._keyCertificates.get(id);
                if (certificates && certificates instanceof _PdfX509Certificates) {
                    return certificates;
                }
            } else {
                const key: string = certificateKey.toUpperCase().trim();
                const certificates: _PdfX509Certificates = this._keyCertificates.get(key);
                if (certificates && certificates instanceof _PdfX509Certificates) {
                    return certificates;
                }
            }
        }
        return undefined;
    }
    _parsePrivateKey(privateKeyOctets: Uint8Array): Record<string, Uint8Array> {
        const innerIsBER: boolean = _isBasicEncodingElement(privateKeyOctets);
        const rsaElement: _PdfAbstractSyntaxElement = innerIsBER ? new _PdfBasicEncodingElement() : new _PdfUniqueEncodingElement();
        rsaElement._fromBytes(privateKeyOctets);
        const rsaSeq: _PdfAbstractSyntaxElement[] = rsaElement._getSequence();
        return {
            version: new Uint8Array([rsaSeq[0]._getInteger()]),
            modulus: rsaSeq[1]._getValue(),
            publicExponent: rsaSeq[2]._getValue(),
            privateExponent: rsaSeq[3]._getValue(),
            prime1: rsaSeq[4]._getValue(),
            prime2: rsaSeq[5]._getValue(),
            exponent1: rsaSeq[6]._getValue(),
            exponent2: rsaSeq[7]._getValue(),
            coefficient: rsaSeq[8]._getValue()
        };
    }
    _getCertificateChain(key: string): _PdfX509Certificates[]{
        if (!this._keys.has(key)) {
            return null;
        }
        let certificates: _PdfX509Certificates = this._getCertificate(key);
        if (!certificates) {
            return null;
        }
        const certificateList: _PdfX509Certificates[] = [];
        const isContinue: boolean = true;
        while (certificates && isContinue) {
            const x509Certificate: _PdfX509Certificate = certificates._certificate;
            let nextCertificate: _PdfX509Certificates;
            const x509Extension: _PdfAbstractSyntaxElement = x509Certificate._getExtension(new _PdfObjectIdentifier()._fromString('2.5.29.35'));
            if (x509Extension) {
                const extensionOctets: Uint8Array = x509Extension._getValue();
                const der: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                der._fromBytes(extensionOctets);
                const components: _PdfAbstractSyntaxElement[] = der._getSequence();
                const keyIdentifierElement: _PdfAbstractSyntaxElement = components.find(
                    (el: _PdfAbstractSyntaxElement) => el._tagClass === _TagClassType.context && el._getTagNumber() === 0
                );
                if (keyIdentifierElement) {
                    const keyID: Uint8Array = keyIdentifierElement._getOctetString();
                    if (keyID) {
                        const certId: _PdfCertificateIdentifier = new _PdfCertificateIdentifier({ id: keyID });
                        this._chainCertificates.forEach((value: _PdfX509Certificates, key: _PdfCertificateIdentifier) => {
                            if (_areUint8ArraysEqual(key._identifier, certId._identifier)) {
                                nextCertificate = value;
                            }
                        });
                    }
                }
            }
            if (isContinue) {
                certificateList.push(certificates);
                certificates = nextCertificate && nextCertificate !== certificates ? nextCertificate : undefined;
            }
        }
        return certificateList.length > 0 ? certificateList : null;
    }
}
