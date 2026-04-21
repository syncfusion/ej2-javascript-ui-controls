import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
/**
 * Represents a single X.509 extension (critical flag + value element).
 *
 * @private
 */
export class _PdfX509Extension {
    /**
     * Whether the extension is marked critical.
     *
     * @private
     * @type {boolean}
     */
    _critical: boolean;
    /**
     * The ASN.1 element containing the extension value.
     *
     * @private
     * @type {_PdfAbstractSyntaxElement}
     */
    _value: _PdfAbstractSyntaxElement;
    constructor(critical: boolean, value: _PdfAbstractSyntaxElement) {
        this._value = value;
        this._critical = critical;
    }
}
/**
 * Collection helper for X.509 extensions with lookup and sequencing utilities.
 *
 * @private
 */
export class _PdfX509Extensions {
    private _extensions: Map<string, _PdfX509Extension> = new Map();
    private _ordering: string[] = [];
    /**
     * OID for authorityKeyIdentifier extension.
     *
     * @private
     * @type {_PdfObjectIdentifier}
     */
    _authorityKeyIdentifier: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.35');
    /**
     * OID for certificateRevocationListPoints extension.
     *
     * @private
     * @type {_PdfObjectIdentifier}
     */
    _certificateRevocationListPoints: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.31');
    /**
     * OID for authorityInfoAccess extension.
     *
     * @private
     * @type {_PdfObjectIdentifier}
     */
    _authorityInfoAccess: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('1.3.6.1.5.5.7.1.1');
    constructor(extensions?: Map<string, _PdfX509Extension>, ordering?: string[]) {
        if (extensions || ordering) {
            const orderingList: string[] = [];
            extensions.forEach((_extension: _PdfX509Extension, objectIdentifier: string) => {
                orderingList.push(objectIdentifier);
            });
            this._ordering = ordering != null ? ordering : orderingList;
            for (const objectIdentifier of this._ordering) {
                const extension: _PdfX509Extension = extensions.get(objectIdentifier);
                if (extension) {
                    this._extensions.set(objectIdentifier, extension);
                }
            }
        }
    }
    /**
     * Build extensions collection from an ASN.1 sequence of extension entries.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} sequence - ASN.1 extension sequence elements.
     * @returns {_PdfX509Extensions} Constructed extensions container.
     */
    _fromSequence(sequence: _PdfAbstractSyntaxElement[]): _PdfX509Extensions {
        const extensionsMap: Map<string, _PdfX509Extension> = new Map<string, _PdfX509Extension>();
        for (const element of sequence) {
            const innerSeq: _PdfAbstractSyntaxElement[] = element._getSequence();
            if (!innerSeq || innerSeq.length < 2 || innerSeq.length > 3) {
                throw new Error('Bad sequence size');
            }
            const oid: string = innerSeq[0]._getObjectIdentifier().toString();
            const isCritical: boolean = innerSeq.length === 3 ? innerSeq[1]._getBooleanValue() : false;
            const value: _PdfAbstractSyntaxElement = innerSeq[innerSeq.length - 1];
            extensionsMap.set(oid, new _PdfX509Extension(isCritical, value));
        }
        return new _PdfX509Extensions(extensionsMap);
    }
    /**
     * Normalize or construct a `_PdfX509Extensions` instance from various inputs.
     *
     * @private
     * @param {any} obj - Candidate extensions container or ASN.1 element.
     * @returns {_PdfX509Extensions} The resolved extensions instance.
     */
    _getInstance(obj: any): _PdfX509Extensions { // eslint-disable-line
        if (obj instanceof _PdfX509Extensions) {
            return obj;
        } else if (obj instanceof _PdfAbstractSyntaxElement) {
            const extension: _PdfX509Extensions = new _PdfX509Extensions();
            const sequence: _PdfAbstractSyntaxElement[] = obj._getSequence();
            return extension._fromSequence(sequence[0]._getSequence());
        } else {
            throw new Error('Unknown object in factory');
        }
    }
    /**
     * Lookup an extension by object identifier.
     *
     * @private
     * @param {_PdfObjectIdentifier} objectIdentifier - OID to search for.
     * @returns {_PdfX509Extension|null} The extension or null when not present.
     */
    _getExtension(objectIdentifier: _PdfObjectIdentifier): _PdfX509Extension | null {
        const key: string = objectIdentifier._encoding.toString().replace(/,/g, '.');
        const ext: _PdfX509Extension = this._extensions.get(key);
        return ext ? ext : null;
    }
}
/**
 * Base class for objects that expose X.509 extensions retrieval.
 *
 * @private
 */
export abstract class _PdfX509ExtensionBase {
    /**
     * Implemented by subclasses to return their extensions container.
     *
     * @private
     * @returns {_PdfX509Extensions}
     */
    abstract _getExtensions(): _PdfX509Extensions;
    /**
     * Convenience helper to retrieve a raw extension ASN.1 element by OID.
     *
     * @private
     * @param {_PdfObjectIdentifier} objectIdentifier - OID to lookup.
     * @returns {_PdfAbstractSyntaxElement} The extension value element or null.
     */
    _getExtension(objectIdentifier: _PdfObjectIdentifier): _PdfAbstractSyntaxElement {
        const exts: _PdfX509Extensions = this._getExtensions();
        if (exts) {
            const ext: _PdfX509Extension = exts._getExtension(objectIdentifier) as _PdfX509Extension;
            return ext ? ext._value : null;
        }
        return null;
    }
}
