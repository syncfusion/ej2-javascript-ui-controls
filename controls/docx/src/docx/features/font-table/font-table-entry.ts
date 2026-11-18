import { parseOnOff, serializeOnOff } from '../document/on-off';
import { elementChildren, isWml, wmlAttr, wmlElement, wValAttribute, WML } from '../document/wml';
import { enumValues } from '../../core/compat/object-compat';
import { NamespaceDeclaration, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
/**
 * Office WordDocument relationships namespace for `r:id` on `CT_FontRel` / `CT_Rel`
 * (Transitional `wml.xsd`).
 */
const OFFICE_RELATIONSHIPS_NAMESPACE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
/**
 * Font family values for `w:family/@w:val` (`ST_FontFamily`, Transitional `wml.xsd`).
 *
 * @private
 */
export enum FontFamily {
    Decorative = 'decorative',
    Modern = 'modern',
    Roman = 'roman',
    Script = 'script',
    Swiss = 'swiss',
    Auto = 'auto'
}
/**
 * Pitch values for `w:pitch/@w:val` (`ST_Pitch`, Transitional `wml.xsd`).
 *
 * @private
 */
export enum FontPitch {
    Fixed = 'fixed',
    Variable = 'variable',
    Default = 'default'
}
/**
 * Embedded font face slot (`w:embedRegular` / `Bold` / `Italic` / `BoldItalic`).
 *
 * @private
 */
export enum FontEmbedSlot {
    Regular = 'regular',
    Bold = 'bold',
    Italic = 'italic',
    BoldItalic = 'boldItalic'
}
const FONT_FAMILY_VALUES: Set<string> = new Set<string>(enumValues<FontFamily>(FontFamily));
const FONT_PITCH_VALUES: Set<string> = new Set<string>(enumValues<FontPitch>(FontPitch));
const EMBED_LOCAL_BY_SLOT: Record<FontEmbedSlot, string> = {
    [FontEmbedSlot.Regular]: 'embedRegular',
    [FontEmbedSlot.Bold]: 'embedBold',
    [FontEmbedSlot.Italic]: 'embedItalic',
    [FontEmbedSlot.BoldItalic]: 'embedBoldItalic'
};
const EMBED_SLOT_BY_LOCAL: Record<string, FontEmbedSlot> = {
    embedRegular: FontEmbedSlot.Regular,
    embedBold: FontEmbedSlot.Bold,
    embedItalic: FontEmbedSlot.Italic,
    embedBoldItalic: FontEmbedSlot.BoldItalic
};
/**
 * Unicode / code-page bitmasks from `w:sig` (`CT_FontSig`).
 * Values are stored hex strings (`ST_UcharHexNumber` / long-hex attributes).
 *
 * Required attributes per Transitional `wml.xsd`: `usb0`–`usb3`, `csb0`, `csb1`.
 *
 * @private
 */
export interface FontSignature {
    readonly usb0: string;
    readonly usb1: string;
    readonly usb2: string;
    readonly usb3: string;
    readonly csb0: string;
    readonly csb1: string;
}
/**
 * One embedded font relationship reference on a font row (`CT_FontRel`).
 *
 * Metadata only — binary ODTTF authoring / decode is out of scope.
 *
 * @private
 */
export interface FontEmbedRef {
    /**
     * @private
     */
    readonly slot: FontEmbedSlot;
    /**
     * @private
     * `r:id` targeting the font part relationship. */
    readonly relationshipId: string;
    /**
     * @private
     * Optional `w:fontKey`. */
    readonly fontKey: string | undefined;
    /**
     * @private
     * Optional `w:subsetted`. */
    readonly subsetted: boolean | undefined;
}
interface ModeledEmbed {
    slot: FontEmbedSlot;
    relationshipId: string;
    fontKey: string | undefined;
    subsetted: boolean | undefined;
    extraAttributes: OpenXmlAttribute[];
    children: OpenXmlChild[];
    namespaceDeclarations: NamespaceDeclaration[];
}
interface ParsedFontChildren {
    alternateName: string | undefined;
    panose: string | undefined;
    charset: string | undefined;
    family: FontFamily | undefined;
    familyRaw: string | undefined;
    notTrueType: boolean | undefined;
    pitch: FontPitch | undefined;
    pitchRaw: string | undefined;
    signature: FontSignature | undefined;
    embeds: ModeledEmbed[];
    residualChildren: OpenXmlElement[];
}
/**
 * One `w:font` row in `fontTable.xml` (`CT_Font`, Transitional `wml.xsd`).
 *
 * Models the full schema child sequence after `w:name`:
 * `altName`, `panose1`, `charset`, `family`, `notTrueType`, `pitch`, `sig`,
 * `embedRegular`, `embedBold`, `embedItalic`, `embedBoldItalic`, then residual
 * unknown children.
 *
 * Substitution remains `w:altName` (ECMA-376-1 §17.8.3.1). Embed APIs expose
 * relationship metadata only; they do not author or decode ODTTF binaries.
 * `clearEmbed` drops the corresponding child element (markup only); package
 * orphan cleanup of the target part is not performed in this MVP.
 *
 * @private
 */
export class FontTableFont {
    private readonly nameValue: string;
    private alternateNameValue: string | undefined;
    private panoseValue: string | undefined;
    private charsetValue: string | undefined;
    private familyValue: FontFamily | undefined;
    /** Invalid-on-load family string preserved for round-trip when typed family is unset. */
    private familyRawValue: string | undefined;
    private notTrueTypeValue: boolean | undefined;
    private pitchValue: FontPitch | undefined;
    private pitchRawValue: string | undefined;
    private signatureValue: FontSignature | undefined;
    private readonly embeds: ModeledEmbed[];
    private readonly residualChildren: OpenXmlElement[];
    private readonly extraAttributes: OpenXmlAttribute[];
    private readonly markDirty: () => void;
    /**
     * @param {string} name - The name.
     * @param {Object} options - The options.
     * @param {Function} markDirty - The mark dirty.
     * @private
     */
    constructor(name: string, options: {
        readonly alternateName?: string | undefined;
        readonly panose?: string | undefined;
        readonly charset?: string | undefined;
        readonly family?: FontFamily | undefined;
        readonly familyRaw?: string | undefined;
        readonly notTrueType?: boolean | undefined;
        readonly pitch?: FontPitch | undefined;
        readonly pitchRaw?: string | undefined;
        readonly signature?: FontSignature | undefined;
        readonly embeds?: ReadonlyArray<ModeledEmbed>;
        readonly residualChildren?: ReadonlyArray<OpenXmlElement>;
        readonly extraAttributes?: ReadonlyArray<OpenXmlAttribute>;
    }, markDirty: () => void) {
        this.nameValue = name;
        this.alternateNameValue = options.alternateName;
        this.panoseValue = options.panose;
        this.charsetValue = options.charset;
        this.familyValue = options.family;
        this.familyRawValue = options.familyRaw;
        this.notTrueTypeValue = options.notTrueType;
        this.pitchValue = options.pitch;
        this.pitchRawValue = options.pitchRaw;
        this.signatureValue = options.signature;
        this.embeds = options.embeds !== undefined ? options.embeds.map(cloneEmbed) : [];
        this.residualChildren =
            options.residualChildren !== undefined ? [...options.residualChildren] : [];
        this.extraAttributes =
            options.extraAttributes !== undefined ? [...options.extraAttributes] : [];
        this.markDirty = markDirty;
    }
    /**
     * Primary name from `w:font/@w:name` (stored casing preserved).
     *
     * @public
     */
    get name(): string {
        return this.nameValue;
    }
    /**
     * Alternate name list as stored on `w:altName/@w:val`, or `undefined` if absent.
     *
     * ECMA-376-1 §17.8.3.1: comma-delimited list; writers may set a single name or a
     * full list string. Assign `undefined` (or empty / whitespace-only) to remove
     * `w:altName`; the font entry is kept. Empty `w:val` is never emitted.
     *
     * @public
     */
    get alternateName(): string | undefined {
        return this.alternateNameValue;
    }
    set alternateName(value: string | undefined) {
        if (value === undefined || value.trim().length === 0) {
            if (this.alternateNameValue === undefined) {
                return;
            }
            this.alternateNameValue = undefined;
            this.markDirty();
            return;
        }
        if (this.alternateNameValue === value) {
            return;
        }
        this.alternateNameValue = value;
        this.markDirty();
    }
    /**
     * Split {@link alternateName} on commas; empty segments (adjacent commas) dropped
     * per ECMA. Empty array when no `altName`.
     *
     * @public
     */
    get alternateNames(): ReadonlyArray<string> {
        if (this.alternateNameValue === undefined) {
            return [];
        }
        const parts: string[] = [];
        for (const segment of this.alternateNameValue.split(',')) {
            const trimmed: string = segment.trim();
            if (trimmed.length > 0) {
                parts.push(trimmed);
            }
        }
        return parts;
    }
    /**
     * PANOSE-1 classification from `w:panose1/@w:val` (`ST_Panose`), or `undefined`.
     * Stored as the attribute string. Assign `undefined` / empty to clear.
     *
     * @public
     */
    get panose(): string | undefined {
        return this.panoseValue;
    }
    set panose(value: string | undefined) {
        const next: string = normalizeOptionalString(value);
        if (this.panoseValue === next) {
            return;
        }
        this.panoseValue = next;
        this.markDirty();
    }
    /**
     * Character set from `w:charset/@w:val` (`ST_UcharHexNumber`), or `undefined`.
     * Stored as the attribute string. Assign `undefined` / empty to clear.
     *
     * @public
     */
    get charset(): string | undefined {
        return this.charsetValue;
    }
    set charset(value: string | undefined) {
        const next: string = normalizeOptionalString(value);
        if (this.charsetValue === next) {
            return;
        }
        this.charsetValue = next;
        this.markDirty();
    }
    /**
     * Font family from `w:family/@w:val` (`ST_FontFamily`), or `undefined` when
     * absent or not a known enumeration value on load.
     *
     * @throws RangeError when assigning a string that is not a {@link FontFamily} value.
     *
     * @public
     */
    get family(): FontFamily | undefined {
        return this.familyValue;
    }
    set family(value: FontFamily | undefined) {
        if (value === undefined) {
            if (this.familyValue === undefined && this.familyRawValue === undefined) {
                return;
            }
            this.familyValue = undefined;
            this.familyRawValue = undefined;
            this.markDirty();
            return;
        }
        assertFontFamily(value);
        if (this.familyValue === value && this.familyRawValue === undefined) {
            return;
        }
        this.familyValue = value;
        this.familyRawValue = undefined;
        this.markDirty();
    }
    /**
     * `w:notTrueType` (`CT_OnOff`). `true` when the element is present without `val`
     * or with a true `ST_OnOff` value; `false` when explicitly off; `undefined` when
     * the child is absent.
     *
     * @public
     */
    get notTrueType(): boolean | undefined {
        return this.notTrueTypeValue;
    }
    set notTrueType(value: boolean | undefined) {
        if (this.notTrueTypeValue === value) {
            return;
        }
        this.notTrueTypeValue = value;
        this.markDirty();
    }
    /**
     * Pitch from `w:pitch/@w:val` (`ST_Pitch`), or `undefined` when absent or not a
     * known enumeration value on load.
     *
     * @throws RangeError when assigning a string that is not a {@link FontPitch} value.
     *
     * @public
     */
    get pitch(): FontPitch | undefined {
        return this.pitchValue;
    }
    set pitch(value: FontPitch | undefined) {
        if (value === undefined) {
            if (this.pitchValue === undefined && this.pitchRawValue === undefined) {
                return;
            }
            this.pitchValue = undefined;
            this.pitchRawValue = undefined;
            this.markDirty();
            return;
        }
        assertFontPitch(value);
        if (this.pitchValue === value && this.pitchRawValue === undefined) {
            return;
        }
        this.pitchValue = value;
        this.pitchRawValue = undefined;
        this.markDirty();
    }
    /**
     * Supported Unicode / code-page bitmasks from `w:sig` (`CT_FontSig`), or
     * `undefined` when the child is absent or missing a required attribute.
     *
     * @public
     */
    get signature(): FontSignature | undefined {
        return this.signatureValue;
    }
    set signature(value: FontSignature | undefined) {
        if (value === undefined) {
            if (this.signatureValue === undefined) {
                return;
            }
            this.signatureValue = undefined;
            this.markDirty();
            return;
        }
        const next: FontSignature = {
            usb0: value.usb0,
            usb1: value.usb1,
            usb2: value.usb2,
            usb3: value.usb3,
            csb0: value.csb0,
            csb1: value.csb1
        };
        if (signaturesEqual(this.signatureValue, next)) {
            return;
        }
        this.signatureValue = next;
        this.markDirty();
    }
    /**
     * Embedded font relationship metadata for each modeled embed child present on
     * this row, in schema slot order.
     *
     * @returns {ReadonlyArray<FontEmbedRef>} The result.
     * @public
     */
    embedRefs(): ReadonlyArray<FontEmbedRef> {
        return this.embeds.map(toEmbedRef);
    }
    /**
     * Embed metadata for `slot`, or `undefined` when that child is absent.
     *
     * @param {FontEmbedSlot} slot - The slot.
     * @returns {FontEmbedRef | undefined} The result.
     * @public
     */
    embedRef(slot: FontEmbedSlot): FontEmbedRef | undefined {
        assertFontEmbedSlot(slot);
        const found: ModeledEmbed = this.embeds.find((entry: ModeledEmbed) => entry.slot === slot);
        return found === undefined ? undefined : toEmbedRef(found);
    }
    /**
     * Drop the embed child for `slot` from this font row (markup only).
     * Does not remove package parts or relationships targeted by `r:id`.
     * No-op when the slot is already absent.
     *
     * @param {FontEmbedSlot} slot - The slot.
     * @returns {void} Nothing is returned.
     * @public
     */
    clearEmbed(slot: FontEmbedSlot): void {
        assertFontEmbedSlot(slot);
        const index: number = this.embeds.findIndex((entry: ModeledEmbed) => entry.slot === slot);
        if (index < 0) {
            return;
        }
        this.embeds.splice(index, 1);
        this.markDirty();
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        const children: OpenXmlChild[] = [];
        if (this.alternateNameValue !== undefined) {
            children.push(wmlElement('altName', {
                attributes: [wmlAttr('val', this.alternateNameValue)]
            }));
        }
        if (this.panoseValue !== undefined) {
            children.push(wmlElement('panose1', {
                attributes: [wmlAttr('val', this.panoseValue)]
            }));
        }
        if (this.charsetValue !== undefined) {
            children.push(wmlElement('charset', {
                attributes: [wmlAttr('val', this.charsetValue)]
            }));
        }
        const familyEmit: string = this.familyValue != null ? this.familyValue : this.familyRawValue;
        if (familyEmit !== undefined) {
            children.push(wmlElement('family', {
                attributes: [wmlAttr('val', familyEmit)]
            }));
        }
        if (this.notTrueTypeValue !== undefined) {
            children.push(serializeOnOff('notTrueType', this.notTrueTypeValue));
        }
        const pitchEmit: string = this.pitchValue != null ? this.pitchValue : this.pitchRawValue;
        if (pitchEmit !== undefined) {
            children.push(wmlElement('pitch', {
                attributes: [wmlAttr('val', pitchEmit)]
            }));
        }
        if (this.signatureValue !== undefined) {
            children.push(serializeSignature(this.signatureValue));
        }
        for (const slot of [
            FontEmbedSlot.Regular,
            FontEmbedSlot.Bold,
            FontEmbedSlot.Italic,
            FontEmbedSlot.BoldItalic
        ]) {
            const embed: ModeledEmbed = this.embeds.find((entry: ModeledEmbed) => entry.slot === slot);
            if (embed !== undefined) {
                children.push(serializeEmbed(embed));
            }
        }
        children.push(...this.residualChildren);
        const attributes: OpenXmlAttribute[] = [
            wmlAttr('name', this.nameValue),
            ...this.extraAttributes
        ];
        return wmlElement('font', { attributes, children });
    }
}
function cloneEmbed(embed: ModeledEmbed): ModeledEmbed {
    return {
        slot: embed.slot,
        relationshipId: embed.relationshipId,
        fontKey: embed.fontKey,
        subsetted: embed.subsetted,
        extraAttributes: [...embed.extraAttributes],
        children: [...embed.children],
        namespaceDeclarations: [...embed.namespaceDeclarations]
    };
}
function toEmbedRef(embed: ModeledEmbed): FontEmbedRef {
    return {
        slot: embed.slot,
        relationshipId: embed.relationshipId,
        fontKey: embed.fontKey,
        subsetted: embed.subsetted
    };
}
function normalizeOptionalString(value: string | undefined): string | undefined {
    if (value === undefined || value.trim().length === 0) {
        return undefined;
    }
    return value;
}
function assertFontFamily(value: string): void {
    if (!FONT_FAMILY_VALUES.has(value)) {
        throw new RangeError(`Invalid FontFamily value: ${value}`);
    }
}
function assertFontPitch(value: string): void {
    if (!FONT_PITCH_VALUES.has(value)) {
        throw new RangeError(`Invalid FontPitch value: ${value}`);
    }
}
function assertFontEmbedSlot(value: string): void {
    if (value !== FontEmbedSlot.Regular &&
        value !== FontEmbedSlot.Bold &&
        value !== FontEmbedSlot.Italic &&
        value !== FontEmbedSlot.BoldItalic) {
        throw new RangeError(`Invalid FontEmbedSlot value: ${value}`);
    }
}
function signaturesEqual(a: FontSignature | undefined, b: FontSignature): boolean {
    if (a === undefined) {
        return false;
    }
    return (a.usb0 === b.usb0 &&
        a.usb1 === b.usb1 &&
        a.usb2 === b.usb2 &&
        a.usb3 === b.usb3 &&
        a.csb0 === b.csb0 &&
        a.csb1 === b.csb1);
}
function fontNameAttribute(element: OpenXmlElement): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === 'name' &&
        (attribute.namespaceUri === WML || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function wmlNamedAttribute(element: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (attribute.namespaceUri === WML || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function relationshipIdAttribute(element: OpenXmlElement): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === 'id' &&
        (attribute.namespaceUri === OFFICE_RELATIONSHIPS_NAMESPACE ||
            attribute.prefix === 'r' ||
            attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function parseSignature(element: OpenXmlElement): FontSignature | undefined {
    const usb0: string = wmlNamedAttribute(element, 'usb0');
    const usb1: string = wmlNamedAttribute(element, 'usb1');
    const usb2: string = wmlNamedAttribute(element, 'usb2');
    const usb3: string = wmlNamedAttribute(element, 'usb3');
    const csb0: string = wmlNamedAttribute(element, 'csb0');
    const csb1: string = wmlNamedAttribute(element, 'csb1');
    if (usb0 === undefined ||
        usb1 === undefined ||
        usb2 === undefined ||
        usb3 === undefined ||
        csb0 === undefined ||
        csb1 === undefined) {
        return undefined;
    }
    return { usb0, usb1, usb2, usb3, csb0, csb1 };
}
function serializeSignature(signature: FontSignature): OpenXmlElement {
    return wmlElement('sig', {
        attributes: [
            wmlAttr('usb0', signature.usb0),
            wmlAttr('usb1', signature.usb1),
            wmlAttr('usb2', signature.usb2),
            wmlAttr('usb3', signature.usb3),
            wmlAttr('csb0', signature.csb0),
            wmlAttr('csb1', signature.csb1)
        ]
    });
}
function parseSubsetted(element: OpenXmlElement): boolean | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === 'subsetted' &&
        (attribute.namespaceUri === WML || attribute.namespaceUri === ''));
    if (found === undefined) {
        return undefined;
    }
    const normalized: string = found.value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'on') {
        return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'off') {
        return false;
    }
    return undefined;
}
function parseEmbed(element: OpenXmlElement, slot: FontEmbedSlot): ModeledEmbed | undefined {
    const relationshipId: string = relationshipIdAttribute(element);
    if (relationshipId === undefined || relationshipId.length === 0) {
        return undefined;
    }
    const fontKeyRaw: string = wmlNamedAttribute(element, 'fontKey');
    const fontKey: string = fontKeyRaw !== undefined && fontKeyRaw.trim().length > 0 ? fontKeyRaw : undefined;
    const subsetted: boolean = parseSubsetted(element);
    const extraAttributes: OpenXmlAttribute[] = element.attributes.filter((attribute: OpenXmlAttribute) => {
        if (attribute.localName === 'id' &&
            (attribute.namespaceUri === OFFICE_RELATIONSHIPS_NAMESPACE ||
                attribute.prefix === 'r' ||
                attribute.namespaceUri === '')) {
            return false;
        }
        if (attribute.localName === 'fontKey' &&
            (attribute.namespaceUri === WML || attribute.namespaceUri === '')) {
            return false;
        }
        if (attribute.localName === 'subsetted' &&
            (attribute.namespaceUri === WML || attribute.namespaceUri === '')) {
            return false;
        }
        return true;
    });
    return {
        slot,
        relationshipId,
        fontKey,
        subsetted,
        extraAttributes,
        children: [...element.children],
        namespaceDeclarations: [...element.namespaceDeclarations]
    };
}
function serializeEmbed(embed: ModeledEmbed): OpenXmlElement {
    const localName: string = EMBED_LOCAL_BY_SLOT[embed.slot];
    const attributes: OpenXmlAttribute[] = [
        {
            namespaceUri: OFFICE_RELATIONSHIPS_NAMESPACE,
            localName: 'id',
            prefix: 'r',
            value: embed.relationshipId
        }
    ];
    if (embed.fontKey !== undefined) {
        attributes.push(wmlAttr('fontKey', embed.fontKey));
    }
    if (embed.subsetted !== undefined) {
        attributes.push(wmlAttr('subsetted', embed.subsetted ? 'true' : 'false'));
    }
    attributes.push(...embed.extraAttributes);
    const namespaceDeclarations: NamespaceDeclaration[] = embed.namespaceDeclarations.length > 0
        ? [...embed.namespaceDeclarations]
        : [{ prefix: 'r', namespaceUri: OFFICE_RELATIONSHIPS_NAMESPACE }];
    if (!namespaceDeclarations.some((declaration: NamespaceDeclaration) => declaration.prefix === 'r' && declaration.namespaceUri === OFFICE_RELATIONSHIPS_NAMESPACE)) {
        namespaceDeclarations.push({
            prefix: 'r',
            namespaceUri: OFFICE_RELATIONSHIPS_NAMESPACE
        });
    }
    return wmlElement(localName, {
        attributes,
        children: embed.children,
        namespaceDeclarations
    });
}
function parseKnownChildren(element: OpenXmlElement): ParsedFontChildren {
    let alternateName: string | undefined;
    let panose: string | undefined;
    let charset: string | undefined;
    let family: FontFamily | undefined;
    let familyRaw: string | undefined;
    let notTrueType: boolean | undefined;
    let pitch: FontPitch | undefined;
    let pitchRaw: string | undefined;
    let signature: FontSignature | undefined;
    const embeds: ModeledEmbed[] = [];
    const seenEmbedSlots: Set<string> = new Set<FontEmbedSlot>();
    const residualChildren: OpenXmlElement[] = [];
    for (const child of elementChildren(element)) {
        if (isWml(child, 'altName')) {
            if (alternateName === undefined) {
                const val: string = wValAttribute(child);
                if (val !== undefined && val.trim().length > 0) {
                    alternateName = val;
                }
            }
            continue;
        }
        if (isWml(child, 'panose1')) {
            if (panose === undefined) {
                const val: string = wValAttribute(child);
                if (val !== undefined && val.trim().length > 0) {
                    panose = val;
                }
            }
            continue;
        }
        if (isWml(child, 'charset')) {
            if (charset === undefined) {
                const val: string = wValAttribute(child);
                if (val !== undefined && val.trim().length > 0) {
                    charset = val;
                }
            }
            continue;
        }
        if (isWml(child, 'family')) {
            if (family === undefined && familyRaw === undefined) {
                const val: string = wValAttribute(child);
                if (val !== undefined && val.trim().length > 0) {
                    if (FONT_FAMILY_VALUES.has(val)) {
                        family = val as FontFamily;
                    }
                    else {
                        familyRaw = val;
                    }
                }
            }
            continue;
        }
        if (isWml(child, 'notTrueType')) {
            if (notTrueType === undefined) {
                const parsed: boolean = parseOnOff(child);
                if (parsed !== undefined) {
                    notTrueType = parsed;
                }
            }
            continue;
        }
        if (isWml(child, 'pitch')) {
            if (pitch === undefined && pitchRaw === undefined) {
                const val: string = wValAttribute(child);
                if (val !== undefined && val.trim().length > 0) {
                    if (FONT_PITCH_VALUES.has(val)) {
                        pitch = val as FontPitch;
                    }
                    else {
                        pitchRaw = val;
                    }
                }
            }
            continue;
        }
        if (isWml(child, 'sig')) {
            if (signature === undefined) {
                const parsed: FontSignature = parseSignature(child);
                if (parsed !== undefined) {
                    signature = parsed;
                }
                else {
                    residualChildren.push(child);
                }
            }
            continue;
        }
        const embedSlot: FontEmbedSlot = EMBED_SLOT_BY_LOCAL[child.localName];
        if (embedSlot !== undefined && isWml(child, child.localName)) {
            if (!seenEmbedSlots.has(embedSlot)) {
                const parsed: ModeledEmbed = parseEmbed(child, embedSlot);
                if (parsed !== undefined) {
                    embeds.push(parsed);
                    seenEmbedSlots.add(embedSlot);
                }
                else {
                    residualChildren.push(child);
                }
            }
            continue;
        }
        residualChildren.push(child);
    }
    return {
        alternateName,
        panose,
        charset,
        family,
        familyRaw,
        notTrueType,
        pitch,
        pitchRaw,
        signature,
        embeds,
        residualChildren
    };
}
/**
 * Parse one `w:font` element into a {@link FontTableFont}, or `undefined` when
 * `@w:name` is missing/empty.
 *
 * @param {OpenXmlElement} element - The element.
 * @param {Function} markDirty - The mark dirty.
 * @returns {FontTableFont | undefined} The result.
 * @private
 */
export function parseFontTableFont(element: OpenXmlElement, markDirty: () => void): FontTableFont | undefined {
    const name: string = fontNameAttribute(element);
    if (name === undefined || name.length === 0) {
        return undefined;
    }
    const parsed: ParsedFontChildren = parseKnownChildren(element);
    const extraAttributes: OpenXmlAttribute[] = element.attributes.filter((attribute: OpenXmlAttribute) => !(attribute.localName === 'name' &&
        (attribute.namespaceUri === WML || attribute.namespaceUri === '')));
    return new FontTableFont(name, {
        alternateName: parsed.alternateName,
        panose: parsed.panose,
        charset: parsed.charset,
        family: parsed.family,
        familyRaw: parsed.familyRaw,
        notTrueType: parsed.notTrueType,
        pitch: parsed.pitch,
        pitchRaw: parsed.pitchRaw,
        signature: parsed.signature,
        embeds: parsed.embeds,
        residualChildren: parsed.residualChildren,
        extraAttributes
    }, markDirty);
}
/**
 * Create a minimal font entry (`@w:name` only).
 *
 * @param {string} name - The name.
 * @param {Function} markDirty - The mark dirty.
 * @returns {FontTableFont} The result.
 * @private
 */
export function createFontTableFont(name: string, markDirty: () => void): FontTableFont {
    return new FontTableFont(name, {}, markDirty);
}
