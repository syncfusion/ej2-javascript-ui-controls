import { elementChildren, isWml, wmlAttr, wmlElement, WML } from '../document/wml';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
/**
 * One `w:lsdException` entry under `w:latentStyles` (`CT_LsdException`).
 *
 * @private
 */
export class LsdException {
    private readonly nameValue: string;
    private readonly lockedValue: boolean | undefined;
    private readonly uiPriorityValue: number | undefined;
    private readonly semiHiddenValue: boolean | undefined;
    private readonly unhideWhenUsedValue: boolean | undefined;
    private readonly qFormatValue: boolean | undefined;
    private readonly extraAttributes: OpenXmlAttribute[];
    /**
     * @param {string} name - The name.
     * @param {boolean | undefined} locked - The locked.
     * @param {number | undefined} uiPriority - The ui priority.
     * @param {boolean | undefined} semiHidden - The semi hidden.
     * @param {boolean | undefined} unhideWhenUsed - The unhide when used.
     * @param {boolean | undefined} qFormat - The q format.
     * @param {OpenXmlAttribute[]} extraAttributes - The extra attributes.
     * @private
     */
    constructor(
        name: string,
        locked: boolean | undefined,
        uiPriority: number | undefined,
        semiHidden: boolean | undefined,
        unhideWhenUsed: boolean | undefined,
        qFormat: boolean | undefined,
        extraAttributes: OpenXmlAttribute[] = []
    ) {
        this.nameValue = name;
        this.lockedValue = locked;
        this.uiPriorityValue = uiPriority;
        this.semiHiddenValue = semiHidden;
        this.unhideWhenUsedValue = unhideWhenUsed;
        this.qFormatValue = qFormat;
        this.extraAttributes = extraAttributes;
    }
    /** `w:lsdException/@w:name` (required). */
    get name(): string {
        return this.nameValue;
    }
    get locked(): boolean | undefined {
        return this.lockedValue;
    }
    get uiPriority(): number | undefined {
        return this.uiPriorityValue;
    }
    get semiHidden(): boolean | undefined {
        return this.semiHiddenValue;
    }
    get unhideWhenUsed(): boolean | undefined {
        return this.unhideWhenUsedValue;
    }
    get qFormat(): boolean | undefined {
        return this.qFormatValue;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [wmlAttr('name', this.nameValue), ...this.extraAttributes];
        if (this.lockedValue !== undefined) {
            attributes.push(wmlAttr('locked', this.lockedValue ? '1' : '0'));
        }
        if (this.uiPriorityValue !== undefined) {
            attributes.push(wmlAttr('uiPriority', String(this.uiPriorityValue)));
        }
        if (this.semiHiddenValue !== undefined) {
            attributes.push(wmlAttr('semiHidden', this.semiHiddenValue ? '1' : '0'));
        }
        if (this.unhideWhenUsedValue !== undefined) {
            attributes.push(wmlAttr('unhideWhenUsed', this.unhideWhenUsedValue ? '1' : '0'));
        }
        if (this.qFormatValue !== undefined) {
            attributes.push(wmlAttr('qFormat', this.qFormatValue ? '1' : '0'));
        }
        return wmlElement('lsdException', { attributes });
    }
}
/**
 * Latent style information (`w:latentStyles` / `CT_LatentStyles`).
 *
 * @private
 */
export class LatentStyles {
    private readonly defLockedStateValue: boolean | undefined;
    private readonly defUIPriorityValue: number | undefined;
    private readonly defSemiHiddenValue: boolean | undefined;
    private readonly defUnhideWhenUsedValue: boolean | undefined;
    private readonly defQFormatValue: boolean | undefined;
    private readonly countValue: number | undefined;
    private readonly exceptionsList: LsdException[];
    private readonly extraAttributes: OpenXmlAttribute[];
    private readonly extras: OpenXmlElement[];
    /**
     * @param {boolean | undefined} defLockedState - The def locked state.
     * @param {number | undefined} defUIPriority - The def uipriority.
     * @param {boolean | undefined} defSemiHidden - The def semi hidden.
     * @param {boolean | undefined} defUnhideWhenUsed - The def unhide when used.
     * @param {boolean | undefined} defQFormat - The def qformat.
     * @param {number | undefined} count - The count.
     * @param {LsdException[]} exceptions - The exceptions.
     * @param {OpenXmlAttribute[]} extraAttributes - The extra attributes.
     * @param {OpenXmlElement[]} extras - The extras.
     * @private
     */
    constructor(
        defLockedState: boolean | undefined,
        defUIPriority: number | undefined,
        defSemiHidden: boolean | undefined,
        defUnhideWhenUsed: boolean | undefined,
        defQFormat: boolean | undefined,
        count: number | undefined,
        exceptions: LsdException[],
        extraAttributes: OpenXmlAttribute[] = [],
        extras: OpenXmlElement[] = []
    ) {
        this.defLockedStateValue = defLockedState;
        this.defUIPriorityValue = defUIPriority;
        this.defSemiHiddenValue = defSemiHidden;
        this.defUnhideWhenUsedValue = defUnhideWhenUsed;
        this.defQFormatValue = defQFormat;
        this.countValue = count;
        this.exceptionsList = exceptions;
        this.extraAttributes = extraAttributes;
        this.extras = extras;
    }
    get defLockedState(): boolean | undefined {
        return this.defLockedStateValue;
    }
    get defUIPriority(): number | undefined {
        return this.defUIPriorityValue;
    }
    get defSemiHidden(): boolean | undefined {
        return this.defSemiHiddenValue;
    }
    get defUnhideWhenUsed(): boolean | undefined {
        return this.defUnhideWhenUsedValue;
    }
    get defQFormat(): boolean | undefined {
        return this.defQFormatValue;
    }
    get count(): number | undefined {
        return this.countValue;
    }
    /** Ordered `w:lsdException` entries. */
    get exceptions(): ReadonlyArray<LsdException> {
        return this.exceptionsList;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [...this.extraAttributes];
        if (this.defLockedStateValue !== undefined) {
            attributes.push(wmlAttr('defLockedState', this.defLockedStateValue ? '1' : '0'));
        }
        if (this.defUIPriorityValue !== undefined) {
            attributes.push(wmlAttr('defUIPriority', String(this.defUIPriorityValue)));
        }
        if (this.defSemiHiddenValue !== undefined) {
            attributes.push(wmlAttr('defSemiHidden', this.defSemiHiddenValue ? '1' : '0'));
        }
        if (this.defUnhideWhenUsedValue !== undefined) {
            attributes.push(wmlAttr('defUnhideWhenUsed', this.defUnhideWhenUsedValue ? '1' : '0'));
        }
        if (this.defQFormatValue !== undefined) {
            attributes.push(wmlAttr('defQFormat', this.defQFormatValue ? '1' : '0'));
        }
        if (this.countValue !== undefined) {
            attributes.push(wmlAttr('count', String(this.countValue)));
        }
        const children: OpenXmlChild[] = this.exceptionsList.map((item: LsdException) => item.serialize());
        children.push(...this.extras);
        return wmlElement('latentStyles', { attributes, children });
    }
}
function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && (a.namespaceUri === WML || a.namespaceUri === ''))), ts330 == null ? undefined : ts330.value);
}
function parseOnOffAttribute(raw: string | undefined): boolean | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const normalized: string = raw.trim().toLowerCase();
    if (normalized === '' || normalized === 'true' || normalized === '1' || normalized === 'on') {
        return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'off') {
        return false;
    }
    return undefined;
}
function parseDecimalAttribute(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw.trim())) {
        return undefined;
    }
    return parseInt(raw.trim(), 10);
}
function parseLsdException(element: OpenXmlElement): LsdException | undefined {
    if (!isWml(element, 'lsdException')) {
        return undefined;
    }
    const name: string = wmlAttribute(element, 'name');
    if (name === undefined || name.length === 0) {
        return undefined;
    }
    const known: Set<string> = new Set([
        'name',
        'locked',
        'uiPriority',
        'semiHidden',
        'unhideWhenUsed',
        'qFormat'
    ]);
    const extraAttributes: OpenXmlAttribute[] = element.attributes.filter((a: OpenXmlAttribute) => !(known.has(a.localName) && (a.namespaceUri === WML || a.namespaceUri === '')));
    return new LsdException(name, parseOnOffAttribute(wmlAttribute(element, 'locked')), parseDecimalAttribute(wmlAttribute(element, 'uiPriority')), parseOnOffAttribute(wmlAttribute(element, 'semiHidden')), parseOnOffAttribute(wmlAttribute(element, 'unhideWhenUsed')), parseOnOffAttribute(wmlAttribute(element, 'qFormat')), extraAttributes);
}
/**
 * Parse `w:latentStyles` into {@link LatentStyles}.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {LatentStyles | undefined} The result.
 * @private
 */
export function parseLatentStyles(element: OpenXmlElement): LatentStyles | undefined {
    if (!isWml(element, 'latentStyles')) {
        return undefined;
    }
    const knownRoot: Set<string> = new Set([
        'defLockedState',
        'defUIPriority',
        'defSemiHidden',
        'defUnhideWhenUsed',
        'defQFormat',
        'count'
    ]);
    const extraAttributes: OpenXmlAttribute[] = element.attributes.filter((a: OpenXmlAttribute) => !(knownRoot.has(a.localName) && (a.namespaceUri === WML || a.namespaceUri === '')));
    const exceptions: LsdException[] = [];
    const extras: OpenXmlElement[] = [];
    for (const child of elementChildren(element)) {
        if (isWml(child, 'lsdException')) {
            const entry: LsdException = parseLsdException(child);
            if (entry !== undefined) {
                exceptions.push(entry);
            }
            continue;
        }
        extras.push(child);
    }
    return new LatentStyles(parseOnOffAttribute(wmlAttribute(element, 'defLockedState')), parseDecimalAttribute(wmlAttribute(element, 'defUIPriority')), parseOnOffAttribute(wmlAttribute(element, 'defSemiHidden')), parseOnOffAttribute(wmlAttribute(element, 'defUnhideWhenUsed')), parseOnOffAttribute(wmlAttribute(element, 'defQFormat')), parseDecimalAttribute(wmlAttribute(element, 'count')), exceptions, extraAttributes, extras);
}
