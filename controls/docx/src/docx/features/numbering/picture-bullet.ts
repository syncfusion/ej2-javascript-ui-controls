import { isWml, wmlAttr, wmlElement } from '../document/wml';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement, WML_TRANSITIONAL_NAMESPACE } from '../../core/xml/index';
/**
 * Picture bullet definition (`w:numPicBullet` / `CT_NumPicBullet`).
 *
 * MVP exposes the id and preserves `w:pict` / `w:drawing` (and any other)
 * children opaquely — no drawing authoring in this task.
 *
 * @private
 */
export class NumberingPictureBullet {
    private readonly _numPicBulletId: number;
    private readonly children: ReadonlyArray<OpenXmlChild>;
    private readonly extraAttributes: ReadonlyArray<OpenXmlAttribute>;
    /**
     * @param {Object} init - The init.
     * @private
     */
    constructor(init: {
        readonly numPicBulletId: number;
        readonly children?: ReadonlyArray<OpenXmlChild>;
        readonly extraAttributes?: ReadonlyArray<OpenXmlAttribute>;
    }) {
        this._numPicBulletId = init.numPicBulletId;
        this.children = init.children != null ? init.children : [];
        this.extraAttributes = init.extraAttributes != null ? init.extraAttributes : [];
    }
    /** Picture bullet id (`@w:numPicBulletId`). */
    get numPicBulletId(): number {
        return this._numPicBulletId;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        return wmlElement('numPicBullet', {
            attributes: [
                wmlAttr('numPicBulletId', String(this._numPicBulletId)),
                ...this.extraAttributes
            ],
            children: this.children
        });
    }
}
/**
 * Parse `w:numPicBullet` into {@link NumberingPictureBullet}.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {NumberingPictureBullet | undefined} The result.
 * @private
 */
export function parseNumberingPictureBullet(element: OpenXmlElement): NumberingPictureBullet | undefined {
    if (!isWml(element, 'numPicBullet')) {
        return undefined;
    }
    const numPicBulletId: number = decimalAttribute(element, 'numPicBulletId');
    if (numPicBulletId === undefined) {
        return undefined;
    }
    const extraAttributes: OpenXmlAttribute[] = element.attributes.filter((a: OpenXmlAttribute) => !(a.localName === 'numPicBulletId' && a.namespaceUri === WML_TRANSITIONAL_NAMESPACE));
    return new NumberingPictureBullet({
        numPicBulletId,
        children: [...element.children],
        extraAttributes
    });
}
function decimalAttribute(el: OpenXmlElement, localName: string): number | undefined {
    const found: OpenXmlAttribute = el.attributes.find(
        (a: OpenXmlAttribute) => a.localName === localName && a.namespaceUri === WML_TRANSITIONAL_NAMESPACE
    );
    if ((found == null ? undefined : found.value) === undefined || !/^-?\d+$/.test(found.value)) {
        return undefined;
    }
    return Number.parseInt(found.value, 10);
}
