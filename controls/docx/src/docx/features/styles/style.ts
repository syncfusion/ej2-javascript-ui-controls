import { parseOnOff, serializeOnOff } from '../document/on-off';
import { elementChildren, isWml, wmlAttr, wmlElement, wValAttribute, WML } from '../document/wml';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { parseModeledRunProperties, ModeledRunProperties } from './run-properties';
/**
 * `ST_StyleType` (Transitional `wml.xsd`): paragraph | character | table | numbering.
 *
 * @private
 */
export type DocxStyleType = 'paragraph' | 'character' | 'table' | 'numbering';
const STYLE_TYPES: ReadonlySet<string> = new Set(['paragraph', 'character', 'table', 'numbering']);
/** CT_Style children emitted from typed fields, in schema sequence order before opaque extras. */
const MODELED_CHILD_NAMES: ReadonlySet<string> = new Set([
    'name',
    'aliases',
    'basedOn',
    'next',
    'link',
    'autoRedefine',
    'hidden',
    'uiPriority',
    'semiHidden',
    'unhideWhenUsed',
    'qFormat',
    'locked'
]);
function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && (a.namespaceUri === WML || a.namespaceUri === ''))), ts330 == null ? undefined : ts330.value);
}
function parseStyleType(raw: string | undefined): DocxStyleType | undefined {
    if (raw !== undefined && STYLE_TYPES.has(raw)) {
        return raw as DocxStyleType;
    }
    return undefined;
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
function parseDecimalChild(el: OpenXmlElement | undefined): number | undefined {
    if (el === undefined) {
        return undefined;
    }
    const raw: string = wValAttribute(el);
    if (raw === undefined || !/^-?\d+$/.test(raw.trim())) {
        return undefined;
    }
    return parseInt(raw.trim(), 10);
}
function firstWmlChild(children: ReadonlyArray<OpenXmlElement>, localName: string): OpenXmlElement | undefined {
    return children.find((child: OpenXmlElement) => isWml(child, localName));
}
function readStringVal(children: ReadonlyArray<OpenXmlElement>, localName: string): string | undefined {
    const el: OpenXmlElement = firstWmlChild(children, localName);
    if (el === undefined) {
        return undefined;
    }
    return wValAttribute(el);
}
function readOnOffChild(children: ReadonlyArray<OpenXmlElement>, localName: string): boolean | undefined {
    const el: OpenXmlElement = firstWmlChild(children, localName);
    if (el === undefined) {
        return undefined;
    }
    return parseOnOff(el);
}
/**
 * One `w:style` definition (`CT_Style`).
 *
 * Typed getters cover MVP identity, inheritance, and UI flags. Unmodeled children
 * (`pPr`, table style props, `personal*`, `rsid`, unknown) are retained opaquely and
 * re-emitted on serialize after the typed preamble (schema sequence for modeled fields;
 * extras keep relative order).
 *
 * @private
 */
export class DocxStyle {
    private readonly styleIdValue: string;
    private readonly typeValue: DocxStyleType | undefined;
    private readonly defaultValue: boolean | undefined;
    private readonly customStyleValue: boolean | undefined;
    private readonly children: OpenXmlElement[];
    private readonly extraAttributes: OpenXmlAttribute[];
    /**
     * @param {string} styleId - The style id.
     * @param {DocxStyleType | undefined} type - The type.
     * @param {boolean | undefined} defaultFlag - The default flag.
     * @param {boolean | undefined} customStyle - The custom style.
     * @param {OpenXmlElement[]} children - The children.
     * @param {OpenXmlAttribute[]} extraAttributes - The extra attributes.
     * @private
     */
    constructor(
        styleId: string,
        type: DocxStyleType | undefined,
        defaultFlag: boolean | undefined,
        customStyle: boolean | undefined,
        children: OpenXmlElement[],
        extraAttributes: OpenXmlAttribute[] = []
    ) {
        this.styleIdValue = styleId;
        this.typeValue = type;
        this.defaultValue = defaultFlag;
        this.customStyleValue = customStyle;
        this.children = children;
        this.extraAttributes = extraAttributes;
    }
    /** `w:style/@w:styleId`. */
    get styleId(): string {
        return this.styleIdValue;
    }
    /** `w:style/@w:type` (`ST_StyleType`), when present and recognized. */
    get type(): DocxStyleType | undefined {
        return this.typeValue;
    }
    /** `w:style/@w:default`. */
    get default(): boolean | undefined {
        return this.defaultValue;
    }
    /** `w:style/@w:customStyle`. */
    get customStyle(): boolean | undefined {
        return this.customStyleValue;
    }
    /** `w:name/@w:val`. */
    get name(): string | undefined {
        return readStringVal(this.children, 'name');
    }
    /** `w:aliases/@w:val`. */
    get aliases(): string | undefined {
        return readStringVal(this.children, 'aliases');
    }
    /** `w:basedOn/@w:val`. */
    get basedOn(): string | undefined {
        return readStringVal(this.children, 'basedOn');
    }
    /** `w:next/@w:val`. */
    get next(): string | undefined {
        return readStringVal(this.children, 'next');
    }
    /** `w:link/@w:val`. */
    get link(): string | undefined {
        return readStringVal(this.children, 'link');
    }
    /** `w:uiPriority/@w:val`. */
    get uiPriority(): number | undefined {
        return parseDecimalChild(firstWmlChild(this.children, 'uiPriority'));
    }
    /** `w:autoRedefine` on/off. */
    get autoRedefine(): boolean | undefined {
        return readOnOffChild(this.children, 'autoRedefine');
    }
    /** `w:hidden` on/off. */
    get hidden(): boolean | undefined {
        return readOnOffChild(this.children, 'hidden');
    }
    /** `w:semiHidden` on/off. */
    get semiHidden(): boolean | undefined {
        return readOnOffChild(this.children, 'semiHidden');
    }
    /** `w:unhideWhenUsed` on/off. */
    get unhideWhenUsed(): boolean | undefined {
        return readOnOffChild(this.children, 'unhideWhenUsed');
    }
    /** `w:qFormat` on/off. */
    get qFormat(): boolean | undefined {
        return readOnOffChild(this.children, 'qFormat');
    }
    /** `w:locked` on/off. */
    get locked(): boolean | undefined {
        return readOnOffChild(this.children, 'locked');
    }
    /**
     * Modeled `w:rPr` properties on this style (`w:b`, `w:i`, `w:sz`, `w:rFonts`).
     *
     * @returns {ModeledRunProperties} The result.
     * @private
     */
    runProperties(): ModeledRunProperties {
        const rPr: OpenXmlElement = firstWmlChild(this.children, 'rPr');
        return parseModeledRunProperties(rPr);
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [];
        if (this.typeValue !== undefined) {
            attributes.push(wmlAttr('type', this.typeValue));
        }
        attributes.push(wmlAttr('styleId', this.styleIdValue));
        if (this.defaultValue !== undefined) {
            attributes.push(wmlAttr('default', this.defaultValue ? '1' : '0'));
        }
        if (this.customStyleValue !== undefined) {
            attributes.push(wmlAttr('customStyle', this.customStyleValue ? '1' : '0'));
        }
        attributes.push(...this.extraAttributes);
        const out: OpenXmlChild[] = [];
        const nameVal: string = this.name;
        out.push(wmlElement('name', { attributes: [wmlAttr('val', nameVal != null ? nameVal : this.styleIdValue)] }));
        const aliases: string = this.aliases;
        if (aliases !== undefined) {
            out.push(wmlElement('aliases', { attributes: [wmlAttr('val', aliases)] }));
        }
        const basedOn: string = this.basedOn;
        if (basedOn !== undefined) {
            out.push(wmlElement('basedOn', { attributes: [wmlAttr('val', basedOn)] }));
        }
        const next: string = this.next;
        if (next !== undefined) {
            out.push(wmlElement('next', { attributes: [wmlAttr('val', next)] }));
        }
        const link: string = this.link;
        if (link !== undefined) {
            out.push(wmlElement('link', { attributes: [wmlAttr('val', link)] }));
        }
        const autoRedefine: boolean = this.autoRedefine;
        if (autoRedefine !== undefined) {
            out.push(serializeOnOff('autoRedefine', autoRedefine));
        }
        const hidden: boolean = this.hidden;
        if (hidden !== undefined) {
            out.push(serializeOnOff('hidden', hidden));
        }
        const uiPriority: number = this.uiPriority;
        if (uiPriority !== undefined) {
            out.push(wmlElement('uiPriority', { attributes: [wmlAttr('val', String(uiPriority))] }));
        }
        const semiHidden: boolean = this.semiHidden;
        if (semiHidden !== undefined) {
            out.push(serializeOnOff('semiHidden', semiHidden));
        }
        const unhideWhenUsed: boolean = this.unhideWhenUsed;
        if (unhideWhenUsed !== undefined) {
            out.push(serializeOnOff('unhideWhenUsed', unhideWhenUsed));
        }
        const qFormat: boolean = this.qFormat;
        if (qFormat !== undefined) {
            out.push(serializeOnOff('qFormat', qFormat));
        }
        const locked: boolean = this.locked;
        if (locked !== undefined) {
            out.push(serializeOnOff('locked', locked));
        }
        // Preserve non-modeled children (pPr, rPr, tbl*, personal*, rsid, unknown) in order.
        for (const child of this.children) {
            if (isWml(child, child.localName) && MODELED_CHILD_NAMES.has(child.localName)) {
                continue;
            }
            out.push(child);
        }
        return wmlElement('style', { attributes, children: out });
    }
}
/**
 * Parse a `w:style` element into {@link DocxStyle}. Returns `undefined` when `styleId` is absent.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {DocxStyle | undefined} The result.
 * @private
 */
export function parseDocxStyle(element: OpenXmlElement): DocxStyle | undefined {
    if (!isWml(element, 'style')) {
        return undefined;
    }
    const styleId: string = wmlAttribute(element, 'styleId');
    if (styleId === undefined || styleId.length === 0) {
        return undefined;
    }
    const type: DocxStyleType = parseStyleType(wmlAttribute(element, 'type'));
    const defaultFlag: boolean = parseOnOffAttribute(wmlAttribute(element, 'default'));
    const customStyle: boolean = parseOnOffAttribute(wmlAttribute(element, 'customStyle'));
    const knownAttr: Set<string> = new Set(['styleId', 'type', 'default', 'customStyle']);
    const extraAttributes: OpenXmlAttribute[] = element.attributes.filter((a: OpenXmlAttribute) => !(knownAttr.has(a.localName) && (a.namespaceUri === WML || a.namespaceUri === '')));
    return new DocxStyle(styleId, type, defaultFlag, customStyle, [...elementChildren(element)], extraAttributes);
}
/**
 * Minimal paragraph, character, or table style used by ensure* / materialize.
 *
 * @param {string} styleId - The style id.
 * @param {string | string | string} type - The type.
 * @returns {DocxStyle} The result.
 * @private
 */
export function createMinimalDocxStyle(
    styleId: string,
    type: 'paragraph' | 'character' | 'table'
): DocxStyle {
    return new DocxStyle(styleId, type, undefined, undefined, [
        wmlElement('name', { attributes: [wmlAttr('val', styleId)] })
    ]);
}
