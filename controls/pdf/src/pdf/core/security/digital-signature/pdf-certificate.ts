import { _PdfObjectIdentifier } from './asn1/identifier-mapping';
import { _PdfPublicKeyCryptographyCertificate } from './pdf-cryptography-certificate';
import { _PdfSignedCertificate } from './x509/x509-signed-certificate';
import { _PdfX509Certificate, _PdfX509Certificates } from './x509/x509-certificate';
import { _PdfX509CertificateStructure } from './x509/x509-certificate-structure';
import { _PdfX509Name } from './x509/x509-name';
export class _PdfCertificate {
    _version: number;
    _serialNumber: Uint8Array;
    _issuerName: string;
    _subjectName: string;
    _signatureLength: number;
    _validTo: Date;
    _validFrom: Date;
    _publicKeyCryptographyCertificate: _PdfPublicKeyCryptographyCertificate;
    _isPublicKeyCryptographyCertificate: boolean;
    _chains: _PdfX509Certificate[] = [];
    _objectIdentifierToAttributeMap: Record<string, string> = {
        '2.5.4.3': 'CN',
        '2.5.4.6': 'C',
        '2.5.4.7': 'L',
        '2.5.4.8': 'ST',
        '2.5.4.10': 'O',
        '2.5.4.11': 'OU'
    };
    constructor(certificate: Uint8Array | _PdfX509Certificate, password?: string) {
        if (certificate instanceof Uint8Array && password !== null && typeof password !== 'undefined') {
            this._initializePublicKeyCryptographyCertificate(certificate, password);
        } else if (certificate instanceof _PdfX509Certificate) {
            this._loadDetailsFromCertificate(certificate as _PdfX509Certificate);
        }
    }
    _initializePublicKeyCryptographyCertificate(certificateBytes: Uint8Array, password: string): void {
        const pkcsCertificate: _PdfPublicKeyCryptographyCertificate = new _PdfPublicKeyCryptographyCertificate(certificateBytes, password);
        if (pkcsCertificate) {
            this._publicKeyCryptographyCertificate = pkcsCertificate;
            let certificateAlias: string = '';
            pkcsCertificate._keys.forEach((keyEntry: any, alias: string) => { // eslint-disable-line
                if (keyEntry && certificateAlias === '') {
                    certificateAlias = alias;
                }
            });
            const certificates: _PdfX509Certificates = pkcsCertificate._getCertificate(certificateAlias);
            if (certificates) {
                this._loadDetailsFromCertificate(certificates._certificate);
            }
        }
    }
    _loadDetailsFromCertificate(certificate: _PdfX509Certificate): void {
        const structure: _PdfX509CertificateStructure = certificate._structure;
        const signature: _PdfSignedCertificate = structure._getSignedCertificate();
        this._issuerName = this._getUniqueAttributes(signature._issuer, 'CN');
        if (this._issuerName === '') {
            this._issuerName = this._getUniqueAttributes(signature._issuer, 'OU');
        }
        this._subjectName = this._getUniqueAttributes(signature._subject, 'CN');
        this._validFrom = signature._startDate._toDate();
        this._validTo = signature._endDate._toDate();
        this._version = signature._getVersion();
        const serialNumberBytes: Uint8Array = signature._serialNumber;
        this._serialNumber = serialNumberBytes;
        this._isPublicKeyCryptographyCertificate = true;
    }
    _getUniqueAttributes(x509Name: _PdfX509Name, attribute: string): string {
        const targetOid: string = Object.keys(this._objectIdentifierToAttributeMap).find(
            (oid: string) => this._objectIdentifierToAttributeMap[<string>oid] === attribute || oid === attribute
        ) || attribute;
        for (let i: number = 0; i < x509Name._ordering.length; i++) {
            const oid: _PdfObjectIdentifier = x509Name._ordering[<number>i];
            if (oid.toString() === targetOid) {
                const val: string = x509Name._values[<number>i];
                return val ? val.trim() : '';
            }
        }
        return '';
    }
}
