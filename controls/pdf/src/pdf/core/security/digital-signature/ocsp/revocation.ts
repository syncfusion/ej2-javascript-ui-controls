import { LongTermValidationCallback } from '../../../pdf-type';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _TagClassType } from '../asn1/enumerator';
import { _PdfX509Certificate } from '../x509/x509-certificate';
import { _PdfCertificateUtility } from './certificate-utils';
import { _PdfOcspTag } from './ocsp-client';
/**
 * Represents a revocation list helper used for Long-Term Validation (LTV).
 *
 * @private
 */
export class _PdfRevocationList {
    /**
     * Collection of CRL distribution point URLs.
     *
     * @private
     */
    private _urls: string[] = [];
    /**
     * Callback used to retrieve revocation data from a given URL.
     *
     * @private
     */
    _ltvCallback: LongTermValidationCallback;
    /**
     * Certificate utility helper used to extract CRL URLs.
     *
     * @private
     */
    private _utility: _PdfCertificateUtility = new _PdfCertificateUtility();
    /**
     * Initializes a new instance of the `_PdfRevocationList` class.
     *
     * @private
     */
    constructor() {} // eslint-disable-line
    /**
     * Retrieves the encoded Certificate Revocation List (CRL) data.
     *
     * @private
     * @param {_PdfX509Certificate} certificate X.509 certificate to resolve CRL information for.
     * @param {string} [url] Optional CRL distribution point URL.
     * @returns {Promise<Uint8Array[]>} Promise resolving to a list of encoded CRL byte arrays.
     */
    async _getEncoded(certificate: _PdfX509Certificate, url?: string): Promise<Uint8Array[]> {
        if (!certificate) {
            return null;
        }
        const urls: string[] = [...this._urls];
        if (urls.length === 0) {
            try {
                let allUris: string[];
                if (url) {
                    allUris = [url];
                } else {
                    allUris = await this._utility._getCrlUrls(certificate);
                }
                if (allUris) {
                    urls.push(...allUris);
                }
            } catch (err) { } // eslint-disable-line
        }
        const byteList: Uint8Array[] = [];
        for (const entry of urls) {
            try {
                const bytes: {response: Uint8Array} = await this._ltvCallback(entry);
                byteList.push(bytes.response);
                break;
            } catch (err) { } // eslint-disable-line
        }
        return byteList;
    }
}
/**
 * Represents a list of CRL distribution points.
 *
 * @private
 */
export class _PdfRevocationPointList {
    /**
     * ASN.1 sequence containing CRL distribution point entries.
     *
     * @private
     */
    private _sequence: _PdfAbstractSyntaxElement;
    /**
     * Initializes a new instance of the `_PdfRevocationPointList` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [sequence] ASN.1 sequence representing CRL distribution points.
     */
    constructor(sequence?: _PdfAbstractSyntaxElement) {
        if (sequence) {
            this._sequence = sequence;
        }
    }
    /**
     * Resolves a `_PdfRevocationPointList` instance from the given object.
     *
     * @private
     * @param {*} object Object representing a CRL distribution point list.
     * @returns {_PdfRevocationPointList} Parsed revocation point list instance.
     * @throws {Error} Throws an error if the object is not a valid entry.
     */
    _getCrlPointList(object: any): _PdfRevocationPointList { // eslint-disable-line
        if (object instanceof _PdfAbstractSyntaxElement) {
            return new _PdfRevocationPointList(object);
        }
        throw new Error('Invalid entry in sequence');
    }
    /**
     * Gets the collection of CRL distribution point entries.
     *
     * @private
     * @returns {_PdfRevocationDistribution[]} Array of CRL distribution entries.
     */
    _getDistributionPoints(): _PdfRevocationDistribution[] {
        const elements: _PdfAbstractSyntaxElement[] = this._sequence._getSequence();
        const distributions: _PdfRevocationDistribution[] = new Array(elements.length);
        const distribution: _PdfRevocationDistribution = new _PdfRevocationDistribution();
        for (let i: number = 0; i < elements.length; i++) {
            distributions[<number>i] = distribution._getCrlDistribution(elements[<number>i]);
        }
        return distributions;
    }
}
/**
 * Represents a single CRL distribution point.
 *
 * @private
 */
export class _PdfRevocationDistribution {
    /**
     * Distribution point name or type information.
     *
     * @private
     */
    private _distributionPoint: _PdfRevocationDistributionType;
    /**
     * CRL issuer name associated with the distribution point.
     *
     * @private
     */
    private _issuer: _PdfRevocationName;
    /**
     * Initializes a new instance of the `_PdfRevocationDistribution` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [sequence] ASN.1 sequence representing a CRL distribution point.
     */
    constructor(sequence?: _PdfAbstractSyntaxElement) {
        if (sequence) {
            const elements: _PdfAbstractSyntaxElement[] = sequence._getSequence();
            const type: _PdfRevocationDistributionType = new _PdfRevocationDistributionType();
            const name: _PdfRevocationName = new _PdfRevocationName();
            for (let i: number = 0; i < elements.length; i++) {
                const tag: _PdfAbstractSyntaxElement = elements[<number>i];
                switch (tag._getTagNumber()) {
                case 0:
                    this._distributionPoint = type._getDistributionTypeFromTag(tag);
                    break;
                case 2:
                    this._issuer = name._getCrlNameFromTag(tag);
                    break;
                }
            }
        }
    }
    /**
     * Gets the distribution point name or type.
     *
     * @returns {_PdfRevocationDistributionType} Distribution point information.
     */
    get _distributionPointName(): _PdfRevocationDistributionType {
        return this._distributionPoint;
    }
    /**
     * Resolves a `_PdfRevocationDistribution` instance from the given object.
     *
     * @private
     * @param {*} object Object representing a CRL distribution point.
     * @returns {_PdfRevocationDistribution} Parsed CRL distribution point instance.
     * @throws {Error} Throws an error if the object is not a valid entry.
     */
    _getCrlDistribution(object: any): _PdfRevocationDistribution { // eslint-disable-line
        if (object instanceof _PdfAbstractSyntaxElement) {
            return new _PdfRevocationDistribution(object);
        }
        throw new Error('Invalid entry in CRL distribution point');
    }
}
/**
 * Represents the distribution point type within a CRL distribution point.
 *
 * @private
 */
export class _PdfRevocationDistributionType {
    /**
     * Constant representing the `fullName` distribution point type.
     *
     * @private
     */
    _fullName: number = 0;
    /**
     * Parsed CRL name associated with the distribution point.
     *
     * @private
     */
    _name: _PdfRevocationName;
    /**
     * Numeric distribution point type identifier.
     *
     * @private
     */
    private _type: number;
    /**
     * Initializes a new instance of the `_PdfRevocationDistributionType` class.
     *
     * @private
     * @param {*} [tag] Context-specific ASN.1 tag representing a distribution point type.
     * @throws {Error} Throws an error if the tag class or type is invalid.
     */
    constructor(tag?: any) { // eslint-disable-line
        if (tag && tag instanceof _PdfAbstractSyntaxElement) {
            this._type = tag._getTagNumber();
            if (tag._tagClass !== _TagClassType.context) {
                throw new Error(`Expected a context-specific tag, got class ${tag._tagClass}`);
            }
            if (this._type === this._fullName) {
                const crl: _PdfRevocationName = new _PdfRevocationName();
                this._name = crl._getCrlNameFromTag(tag);
            } else {
                throw new Error(`Invalid CRL distribution point type: [${this._type}]`);
            }
        }
    }
    /**
     * Gets the numeric distribution point type.
     *
     * @returns {number} Distribution point type identifier.
     */
    get _pointType(): number {
        return this._type;
    }
    /**
     * Resolves a distribution point type from a context-specific tag.
     *
     * @private
     * @param {*} tag ASN.1 tag representing a distribution point type.
     * @returns {_PdfRevocationDistributionType} Parsed distribution type instance.
     */
    _getDistributionTypeFromTag(tag: any): _PdfRevocationDistributionType { // eslint-disable-line
        return new _PdfRevocationDistributionType()._getDistributionType(tag);
    }
    /**
     * Resolves a `_PdfRevocationDistributionType` instance from the given object.
     *
     * @private
     * @param {*} object Object representing a distribution point type.
     * @returns {_PdfRevocationDistributionType} Parsed distribution type instance.
     * @throws {Error} Throws an error if the object is not a valid entry.
     */
    _getDistributionType(object: any): _PdfRevocationDistributionType { // eslint-disable-line
        if (object instanceof _PdfAbstractSyntaxElement) {
            return new _PdfRevocationDistributionType(object);
        }
        throw new Error('Invalid entry in sequence');
    }
}
/**
 * Represents a CRL name structure within a revocation distribution point.
 *
 * @private
 */
export class _PdfRevocationName {
    /**
     * Collection of parsed revocation name entries.
     *
     * @private
     */
    private names: _PdfOcspTag[] = [];
    /**
     * Initializes a new instance of the `_PdfRevocationName` class.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} [sequence] ASN.1 sequence representing CRL names.
     */
    constructor(sequence?: _PdfAbstractSyntaxElement) {
        if (sequence) {
            const elements: _PdfAbstractSyntaxElement[] = sequence._getSequence();
            this.names = new Array(elements.length);
            for (let i: number = 0; i < elements.length; i++) {
                const name: _PdfOcspTag = new _PdfOcspTag();
                this.names[<number>i] = name._getOcspName(elements[<number>i]);
            }
        }
    }
    /**
     * Gets the collection of parsed revocation names.
     *
     * @returns {_PdfOcspTag[]} Array of OCSP tag name entries.
     */
    get _names(): _PdfOcspTag[] {
        return [...this.names];
    }
    /**
     * Resolves a `_PdfRevocationName` instance from the given object.
     *
     * @private
     * @param {*} object Object representing a CRL name sequence.
     * @returns {_PdfRevocationName} Parsed revocation name instance.
     * @throws {Error} Throws an error if the object is not a valid entry.
     */
    _getCrlName(object: any): _PdfRevocationName { // eslint-disable-line
        if (object instanceof _PdfAbstractSyntaxElement) {
            return new _PdfRevocationName(object);
        }
        throw new Error('Invalid entry in sequence');
    }
    /**
     * Resolves a CRL name from a context-specific ASN.1 tag.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} tag Context-specific ASN.1 tag.
     * @returns {_PdfRevocationName} Parsed revocation name instance.
     */
    _getCrlNameFromTag(tag: _PdfAbstractSyntaxElement): _PdfRevocationName {
        return new _PdfRevocationName()._getCrlName(tag._getInner());
    }
}
