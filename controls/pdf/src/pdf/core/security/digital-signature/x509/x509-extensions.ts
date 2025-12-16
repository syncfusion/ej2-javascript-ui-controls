import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
export class _PdfX509Extension {
    _critical: boolean;
    _value: _PdfAbstractSyntaxElement;
    constructor(critical: boolean, value: _PdfAbstractSyntaxElement) {
        this._value = value;
        this._critical = critical;
    }
}
export class _PdfX509Extensions {
    private _extensions: Map<string, _PdfX509Extension> = new Map();
    private _ordering: string[] = [];
    _authorityKeyIdentifier: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.35');
    _certificateRevocationListPoints: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.31');
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
    _getExtension(objectIdentifier: _PdfObjectIdentifier): _PdfX509Extension | null {
        const key: string = objectIdentifier._encoding.toString().replace(/,/g, '.');
        const ext: _PdfX509Extension = this._extensions.get(key);
        return ext ? ext : null;
    }
}
export abstract class _PdfX509ExtensionBase {
    abstract _getExtensions(): _PdfX509Extensions;
    _getExtension(objectIdentifier: _PdfObjectIdentifier): _PdfAbstractSyntaxElement {
        const exts: _PdfX509Extensions = this._getExtensions();
        if (exts) {
            const ext: _PdfX509Extension = exts._getExtension(objectIdentifier) as _PdfX509Extension;
            return ext ? ext._value : null;
        }
        return null;
    }
}
