/**
 * Direct paragraph list format (`a:pPr` bullet children).
 *
 * Citations (Transitional `dml-main.xsd`, local corpus):
 * - `EG_TextBullet` choice: `buNone` | `buAutoNum` | `buChar` | `buBlip`
 * - `CT_TextAutonumberBullet`: required `@type` (`ST_TextAutonumberScheme`),
 *   optional `@startAt` (`ST_TextBulletStartAtNum`, inclusive 1–32767, default 1)
 * - `EG_TextBulletSize` choice includes `buSzPct` (`CT_TextBulletSizePercent`,
 *   `ST_TextBulletSizePercent` / `ST_TextBulletSizeDecimal` 25000–400000)
 */
import { asMutable, findChild, getAttr, MutableOoxmlElement } from '../shapes/dom-utils';
import { DML_NS } from '../shapes/constants';
import { partNameOptions, ShapeTextError } from '../shapes/errors';
import { PackageLimitError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { IMAGE_REL_TYPE } from '../package/constants';
import { allocateNextRelationshipId } from '../package/allocate-relationship-id';
import { PackagePart } from '../package/package-model';
import { PackageRelationship } from '../package/relationships';
import { relativeTarget } from '../package/paths';
import { OFFICE_REL_ATTR_NS } from '../presentation/constants';
import {
    allocateNextMediaPartName, copyPictureBytes, detectPictureContentType, enforcePictureMediaInsertLimits,
    extensionForPictureContentType, PictureDataInput
} from '../pictures/add-picture';
import { PictureMediaAccess } from '../pictures/media-access';
import { arrayIncludes, objectValues } from '../util/es5-compat';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/index';
export { PictureDataInput };

/**
 * Public list kind written as an `EG_TextBullet` child of `a:pPr`.
 *
 * @public
 */
export enum ListType {
    /** No bullet (`a:buNone`). */
    None = 'none',
    /** Autonumber bullet (`a:buAutoNum`). */
    Numbered = 'numbered',
    /** Character bullet (`a:buChar`). */
    Bulleted = 'bulleted',
    /** Picture bullet (`a:buBlip`). */
    Picture = 'picture'
}

/** One public {@link ListType} token. @public */
export type ListTypeValue = ListType.None | ListType.Numbered | ListType.Bulleted | ListType.Picture;

const LIST_TYPE_VALUES: ReadonlyArray<ListTypeValue> = Object.freeze([
    ListType.None, ListType.Numbered, ListType.Bulleted, ListType.Picture
]);

/**
 * Returns `true` when `value` is a public {@link ListType} token.
 *
 * @public
 * @param {string} value - Candidate token.
 * @returns {boolean} The result.
 */
export function isListType(value: string): value is ListTypeValue {
    return arrayIncludes(LIST_TYPE_VALUES as ReadonlyArray<string>, value);
}

/**
 * Numbered-list styles. Values are exactly the Transitional
 * `ST_TextAutonumberScheme` tokens.
 *
 * @public
 */
export enum NumberedListStyle {
    AlphaLcParenBoth = 'alphaLcParenBoth',
    AlphaUcParenBoth = 'alphaUcParenBoth',
    AlphaLcParenR = 'alphaLcParenR',
    AlphaUcParenR = 'alphaUcParenR',
    AlphaLcPeriod = 'alphaLcPeriod',
    AlphaUcPeriod = 'alphaUcPeriod',
    ArabicParenBoth = 'arabicParenBoth',
    ArabicParenR = 'arabicParenR',
    ArabicPeriod = 'arabicPeriod',
    ArabicPlain = 'arabicPlain',
    RomanLcParenBoth = 'romanLcParenBoth',
    RomanUcParenBoth = 'romanUcParenBoth',
    RomanLcParenR = 'romanLcParenR',
    RomanUcParenR = 'romanUcParenR',
    RomanLcPeriod = 'romanLcPeriod',
    RomanUcPeriod = 'romanUcPeriod',
    CircleNumDbPlain = 'circleNumDbPlain',
    CircleNumWdBlackPlain = 'circleNumWdBlackPlain',
    CircleNumWdWhitePlain = 'circleNumWdWhitePlain',
    ArabicDbPeriod = 'arabicDbPeriod',
    ArabicDbPlain = 'arabicDbPlain',
    Ea1ChsPeriod = 'ea1ChsPeriod',
    Ea1ChsPlain = 'ea1ChsPlain',
    Ea1ChtPeriod = 'ea1ChtPeriod',
    Ea1ChtPlain = 'ea1ChtPlain',
    Ea1JpnChsDbPeriod = 'ea1JpnChsDbPeriod',
    Ea1JpnKorPlain = 'ea1JpnKorPlain',
    Ea1JpnKorPeriod = 'ea1JpnKorPeriod',
    Arabic1Minus = 'arabic1Minus',
    Arabic2Minus = 'arabic2Minus',
    Hebrew2Minus = 'hebrew2Minus',
    ThaiAlphaPeriod = 'thaiAlphaPeriod',
    ThaiAlphaParenR = 'thaiAlphaParenR',
    ThaiAlphaParenBoth = 'thaiAlphaParenBoth',
    ThaiNumPeriod = 'thaiNumPeriod',
    ThaiNumParenR = 'thaiNumParenR',
    ThaiNumParenBoth = 'thaiNumParenBoth',
    HindiAlphaPeriod = 'hindiAlphaPeriod',
    HindiNumPeriod = 'hindiNumPeriod',
    HindiNumParenR = 'hindiNumParenR',
    HindiAlpha1Period = 'hindiAlpha1Period'
}

/** One public {@link NumberedListStyle} token (`ST_TextAutonumberScheme`). @public */
export type NumberedListStyleValue = NumberedListStyle;

const NUMBERED_LIST_STYLE_VALUES: ReadonlyArray<string> = Object.freeze(
    objectValues<string>(NumberedListStyle).filter((value: string) => value.length > 0 && value.charCodeAt(0) >= 97)
);

/**
 * Returns `true` when `value` is a public {@link NumberedListStyle} token.
 *
 * @public
 * @param {string} value - Candidate token.
 * @returns {boolean} The result.
 */
export function isNumberedListStyle(value: string): value is NumberedListStyleValue {
    return arrayIncludes(NUMBERED_LIST_STYLE_VALUES, value);
}

/** `ST_TextBulletStartAtNum` inclusive bounds. Citation: Transitional `dml-main.xsd`. */
const START_AT_MIN: number = 1;
const START_AT_MAX: number = 32767;
/** `ST_TextBulletSizeDecimal` inclusive bounds (thousandths of a percent). */
const BULLET_SIZE_MIN: number = 25000;
const BULLET_SIZE_MAX: number = 400000;

const BULLET_CHILD_NAMES: ReadonlyArray<string> = ['buNone', 'buAutoNum', 'buChar', 'buBlip'];
const BULLET_SIZE_CHILD_NAMES: ReadonlyArray<string> = ['buSzTx', 'buSzPct', 'buSzPts'];

/**
 * Direct list formatting of one paragraph (`a:pPr` bullet groups).
 *
 * @remarks
 * Reads and writes only direct markup. Does not resolve list style inheritance
 * from `a:lstStyle`, layout, master, or theme. `buFontTx`, `buClrTx`, and
 * `buSzTx` are not authored.
 *
 * @public
 */
export class ListFormat {
    /**
     * @internal
     * @param {() => OoxmlElement} ensurePPr - Ensures `a:pPr` and returns it.
     * @param {() => OoxmlElement | undefined} tryGetPPr - Returns `a:pPr` when present.
     * @param {string | undefined} partName - Owning part name for errors.
     * @param {(() => void) | undefined} onMutate - Mutation hook.
     * @param {(() => PictureMediaAccess | undefined) | undefined} mediaAccess - Slide media for picture bullets.
     * @param {SecurityLimits | undefined} limits - Package limits for picture embed.
     */
    constructor(private ensurePPr: () => OoxmlElement, private tryGetPPr: () => OoxmlElement | undefined,
                private partName: string | undefined, private onMutate: (() => void) | undefined,
                private mediaAccess?: () => PictureMediaAccess | undefined,
                private limits?: SecurityLimits) {
    }

    /**
     * Direct list kind (`EG_TextBullet`). `undefined` when no bullet child is authored.
     *
     * @returns {ListTypeValue | undefined} The result.
     */
    get type(): ListTypeValue | undefined {
        const bullet: OoxmlElement = this.bulletChild();
        if (bullet === undefined) {
            return undefined;
        }
        if (bullet.localName === 'buNone') {
            return ListType.None;
        }
        if (bullet.localName === 'buAutoNum') {
            return ListType.Numbered;
        }
        if (bullet.localName === 'buChar') {
            return ListType.Bulleted;
        }
        if (bullet.localName === 'buBlip') {
            return ListType.Picture;
        }
        return undefined;
    }

    /**
     * Sets the direct list kind. `ListType.Numbered` writes `a:buAutoNum` with
     * `@type="arabicPeriod"` when no numbered style is already present.
     * `ListType.None` writes `a:buNone`. `ListType.Bulleted` writes `a:buChar`
     * with `@char="•"` when no character is already present.
     *
     * @param {ListTypeValue | undefined} value - Public list kind, or `undefined` to remove the bullet child.
     * @returns {void} Nothing.
     */
    set type(value: ListTypeValue | undefined) {
        if (value === undefined) {
            this.removeNamedChildren(BULLET_CHILD_NAMES);
            this.notify();
            return;
        }
        if (!isListType(value)) {
            throw new ShapeTextError('listFormat.type must be a ListType token (got "' + String(value) + '")',
                                     partNameOptions(this.partName));
        }
        if (value === ListType.None) {
            this.replaceBullet(dmlEl('buNone', [], []));
            return;
        }
        if (value === ListType.Numbered) {
            const existing: OoxmlElement = this.bulletChild();
            if (existing !== undefined && existing.localName === 'buAutoNum') {
                return;
            }
            this.replaceBullet(dmlEl('buAutoNum', [attr('type', NumberedListStyle.ArabicPeriod)], []));
            return;
        }
        if (value === ListType.Picture) {
            // .NET sets Type = Picture before Picture(stream). A picture bullet
            // cannot be written without an embed, so this is a no-op until picture().
            return;
        }
        const existingChar: OoxmlElement = this.bulletChild();
        if (existingChar !== undefined && existingChar.localName === 'buChar') {
            return;
        }
        this.replaceBullet(dmlEl('buChar', [attr('char', '•')], []));
    }

    /**
     * Direct bullet character (`a:buChar/@char`). `undefined` when the paragraph is not bulleted.
     *
     * @returns {string | undefined} The authored character.
     */
    get bulletCharacter(): string | undefined {
        const bullet: OoxmlElement = this.bulletChild();
        if (bullet === undefined || bullet.localName !== 'buChar') {
            return undefined;
        }
        return getAttr(bullet, '', 'char');
    }

    /**
     * Sets `a:buChar/@char` and selects the bulleted type (`CT_TextCharBullet`).
     *
     * @param {string | undefined} value - Required non-empty character.
     * @returns {void} Nothing.
     */
    set bulletCharacter(value: string | undefined) {
        if (value === undefined || value.length === 0) {
            throw new ShapeTextError('listFormat.bulletCharacter must be a non-empty string', partNameOptions(this.partName));
        }
        const existing: OoxmlElement = this.bulletChild();
        if (existing !== undefined && existing.localName === 'buChar') {
            setElementAttr(existing, 'char', value);
            this.notify();
            return;
        }
        this.replaceBullet(dmlEl('buChar', [attr('char', value)], []));
    }

    /**
     * Direct bullet typeface (`a:buFont/@typeface`). `undefined` when absent or when only `a:buFontTx` is present.
     *
     * @returns {string | undefined} The result.
     */
    get fontName(): string | undefined {
        const pPr: OoxmlElement = this.tryGetPPr();
        if (pPr === undefined) {
            return undefined;
        }
        const font: OoxmlElement = findChild(pPr, DML_NS, 'buFont');
        if (font === undefined) {
            return undefined;
        }
        const typeface: string = getAttr(font, '', 'typeface');
        return typeface === undefined || typeface.length === 0 ? undefined : typeface;
    }

    /**
     * Writes `a:buFont/@typeface` (`CT_TextFont`). Replaces `a:buFontTx`. Does not change the bullet child.
     *
     * @param {string | undefined} value - Typeface name.
     * @returns {void} Nothing.
     */
    set fontName(value: string | undefined) {
        if (value === undefined || value.length === 0) {
            throw new ShapeTextError('listFormat.fontName must be a non-empty string', partNameOptions(this.partName));
        }
        this.removeNamedChildren(['buFont', 'buFontTx']);
        const pPr: OoxmlElement = this.ensurePPr();
        insertBeforeBullet(pPr, dmlEl('buFont', [attr('typeface', value)], []));
        this.notify();
    }

    /**
     * Direct sRGB bullet color (`a:buClr/a:srgbClr/@val`) as `#RRGGBB`.
     * Scheme and other color choices return `undefined` and are not flattened.
     *
     * @returns {{ r: number; g: number; b: number } | undefined} The result.
     */
    get color(): { r: number; g: number; b: number } | undefined {
        const pPr: OoxmlElement = this.tryGetPPr();
        if (pPr === undefined) {
            return undefined;
        }
        const buClr: OoxmlElement = findChild(pPr, DML_NS, 'buClr');
        if (buClr === undefined) {
            return undefined;
        }
        const srgb: OoxmlElement = findChild(buClr, DML_NS, 'srgbClr');
        if (srgb === undefined) {
            return undefined;
        }
        const raw: string = getAttr(srgb, '', 'val');
        if (raw === undefined || !/^[0-9A-Fa-f]{6}$/u.test(raw)) {
            return undefined;
        }
        return {
            r: parseInt(raw.slice(0, 2), 16),
            g: parseInt(raw.slice(2, 4), 16),
            b: parseInt(raw.slice(4, 6), 16)
        };
    }

    /**
     * Writes `a:buClr/a:srgbClr` (`EG_TextBulletColor`). Replaces `a:buClrTx`.
     * Does not accept theme colors and does not write a resolved theme color as RGB.
     *
     * @param {{ r: number; g: number; b: number } | undefined} value - Channel values 0–255.
     * @returns {void} Nothing.
     */
    set color(value: { r: number; g: number; b: number } | undefined) {
        if (value === undefined || !isByte(value.r) || !isByte(value.g) || !isByte(value.b)) {
            throw new ShapeTextError('listFormat.color must be { r, g, b } integers in [0, 255]', partNameOptions(this.partName));
        }
        this.removeNamedChildren(['buClr', 'buClrTx']);
        const hex: string = toHex(value.r) + toHex(value.g) + toHex(value.b);
        const srgb: OoxmlElement = dmlEl('srgbClr', [attr('val', hex)], []);
        const pPr: OoxmlElement = this.ensurePPr();
        insertAtColorSlot(pPr, dmlEl('buClr', [], [srgb]));
        this.notify();
    }

    /**
     * Embeds a PNG, JPEG, or GIF as `a:buBlip/a:blip/@r:embed` and selects the picture list type.
     *
     * @remarks `string` is base64 of the image payload (same as picture insert). Never fetches a URL.
     * Requires a live slide, layout, master, or notes part with package write access.
     * Citation: Transitional `dml-main.xsd` `CT_TextBlipBullet` / `CT_Blip` `r:embed`.
     * @param {Uint8Array | number[] | string} data - Image octets or base64.
     * @returns {void} Nothing.
     */
    picture(data: PictureDataInput): void {
        const media: PictureMediaAccess = this.mediaAccess === undefined ? undefined : this.mediaAccess();
        const write = media === undefined ? undefined : media.write;
        if (media === undefined || write === undefined || this.partName === undefined || this.limits === undefined) {
            throw new ShapeTextError('listFormat.picture requires a live slide with package write access',
                                     partNameOptions(this.partName));
        }
        const bytes: Uint8Array = copyPictureBytes(data);
        const contentType: string = detectPictureContentType(bytes, this.partName);
        enforcePictureMediaInsertLimits({
            limits: this.limits,
            write,
            slidePartName: this.partName,
            dataByteLength: bytes.byteLength
        });
        const existingRels: ReadonlyArray<PackageRelationship> = media.getSlideRelationships();
        if (existingRels.length + 1 > this.limits.relationshipsPerPart) {
            throw new PackageLimitError('relationshipsPerPart', {
                partName: this.partName,
                actual: existingRels.length + 1
            });
        }
        const extension: string = extensionForPictureContentType(contentType);
        const mediaPartName: string = allocateNextMediaPartName(write, extension);
        const relationshipId: string = allocateNextRelationshipId(existingRels);
        const mediaPart: PackagePart = { name: mediaPartName, contentType, data: bytes };
        write.setPart(mediaPart);
        write.ensureContentTypeDefault(extension, contentType);
        write.ensureContentTypeOverride(mediaPartName, contentType);
        const relationship: PackageRelationship = {
            id: relationshipId,
            type: IMAGE_REL_TYPE,
            target: relativeTarget(this.partName, mediaPartName),
            targetMode: 'Internal',
            targetPartName: mediaPartName
        };
        write.setSlideRelationships([...existingRels, relationship]);
        const blip: OoxmlElement = dmlEl('blip', [relAttr('embed', relationshipId)], []);
        this.replaceBullet(dmlEl('buBlip', [], [blip]));
    }

    /**
     * Direct autonumber style (`a:buAutoNum/@type`). `undefined` when not numbered.
     *
     * @returns {NumberedListStyleValue | undefined} The result.
     */
    get numberStyle(): NumberedListStyleValue | undefined {
        const bullet: OoxmlElement = this.bulletChild();
        if (bullet === undefined || bullet.localName !== 'buAutoNum') {
            return undefined;
        }
        const raw: string = getAttr(bullet, '', 'type');
        return raw !== undefined && isNumberedListStyle(raw) ? raw : undefined;
    }

    /**
     * Sets `a:buAutoNum/@type`. Creates `a:buAutoNum` when absent (replacing any
     * other `EG_TextBullet` child).
     *
     * @param {NumberedListStyleValue | undefined} value - Scheme token.
     * @returns {void} Nothing.
     */
    set numberStyle(value: NumberedListStyleValue | undefined) {
        if (value === undefined) {
            throw new TypeError('ListFormat.numberStyle: value is required');
        }
        if (!isNumberedListStyle(value)) {
            throw new ShapeTextError('listFormat.numberStyle must be a NumberedListStyle token (got "' + String(value) + '")',
                                     partNameOptions(this.partName));
        }
        const bullet: OoxmlElement = this.ensureAutoNum();
        setElementAttr(bullet, 'type', value);
        this.notify();
    }

    /**
     * Direct numbering start (`a:buAutoNum/@startAt`). Schema default 1 is not
     * resolved when the attribute is absent.
     *
     * @returns {number | undefined} The result.
     */
    get startValue(): number | undefined {
        const bullet: OoxmlElement = this.bulletChild();
        if (bullet === undefined || bullet.localName !== 'buAutoNum') {
            return undefined;
        }
        const raw: string = getAttr(bullet, '', 'startAt');
        const parsed: number = Number(raw);
        return raw !== undefined && Number.isInteger(parsed) ? parsed : undefined;
    }

    /**
     * Sets `a:buAutoNum/@startAt` (`ST_TextBulletStartAtNum`, inclusive 1–32767).
     *
     * @param {number | undefined} value - Start number.
     * @returns {void} Nothing.
     */
    set startValue(value: number | undefined) {
        if (value === undefined || typeof value !== 'number' || !Number.isInteger(value) ||
            value < START_AT_MIN || value > START_AT_MAX) {
            throw new ShapeTextError('listFormat.startValue must be an integer in [1, 32767]', partNameOptions(this.partName));
        }
        const bullet: OoxmlElement = this.ensureAutoNum();
        setElementAttr(bullet, 'startAt', String(value));
        this.notify();
    }

    /**
     * Direct bullet size as a percentage of the text size (`a:buSzPct/@val`).
     * Public unit is percent; wire form is thousandths of a percent
     * (`ST_TextBulletSizeDecimal`, inclusive 25000–400000 → public 25–400).
     *
     * @returns {number | undefined} The result.
     */
    get size(): number | undefined {
        const pPr: OoxmlElement = this.tryGetPPr();
        if (pPr === undefined) {
            return undefined;
        }
        const size: OoxmlElement = findChild(pPr, DML_NS, 'buSzPct');
        if (size === undefined) {
            return undefined;
        }
        const raw: string = getAttr(size, '', 'val');
        const parsed: number = Number(raw);
        return raw !== undefined && Number.isFinite(parsed) ? parsed / 1000 : undefined;
    }

    /**
     * Sets `a:buSzPct/@val` from a public percentage (25–400).
     *
     * @param {number | undefined} value - Percent of text size.
     * @returns {void} Nothing.
     */
    set size(value: number | undefined) {
        if (value === undefined || typeof value !== 'number' || !Number.isFinite(value)) {
            throw new ShapeTextError('listFormat.size must be a percentage in [25, 400]', partNameOptions(this.partName));
        }
        const wire: number = Math.round(value * 1000);
        if (wire < BULLET_SIZE_MIN || wire > BULLET_SIZE_MAX) {
            throw new ShapeTextError('listFormat.size must be a percentage in [25, 400]', partNameOptions(this.partName));
        }
        this.removeNamedChildren(BULLET_SIZE_CHILD_NAMES);
        const pPr: OoxmlElement = this.ensurePPr();
        const sizeEl: OoxmlElement = dmlEl('buSzPct', [attr('val', String(wire))], []);
        insertBeforeNames(pPr, sizeEl, ['buFont', 'buFontTx'].concat(BULLET_CHILD_NAMES, ['tabLst', 'defRPr', 'extLst']));
        this.notify();
    }

    /**
     * @returns {OoxmlElement | undefined} The result.
     */
    private bulletChild(): OoxmlElement | undefined {
        const pPr: OoxmlElement = this.tryGetPPr();
        if (pPr === undefined) {
            return undefined;
        }
        for (let i: number = 0; i < BULLET_CHILD_NAMES.length; i++) {
            const found: OoxmlElement = findChild(pPr, DML_NS, arrayAtName(BULLET_CHILD_NAMES, i));
            if (found !== undefined) {
                return found;
            }
        }
        return undefined;
    }

    /**
     * @returns {OoxmlElement} The result.
     */
    private ensureAutoNum(): OoxmlElement {
        const existing: OoxmlElement = this.bulletChild();
        if (existing !== undefined && existing.localName === 'buAutoNum') {
            return existing;
        }
        const created: OoxmlElement = dmlEl('buAutoNum', [attr('type', NumberedListStyle.ArabicPeriod)], []);
        this.removeNamedChildren(BULLET_CHILD_NAMES);
        const pPr: OoxmlElement = this.ensurePPr();
        insertBeforeTabList(pPr, created);
        return created;
    }

    /**
     * @param {OoxmlElement} bullet - Replacement `EG_TextBullet` child.
     * @returns {void} Nothing.
     */
    private replaceBullet(bullet: OoxmlElement): void {
        this.removeNamedChildren(BULLET_CHILD_NAMES);
        const pPr: OoxmlElement = this.ensurePPr();
        insertBeforeTabList(pPr, bullet);
        this.notify();
    }

    /**
     * @param {ReadonlyArray<string>} names - Local names to drop from `a:pPr`.
     * @returns {void} Nothing.
     */
    private removeNamedChildren(names: ReadonlyArray<string>): void {
        const pPr: OoxmlElement = this.tryGetPPr();
        if (pPr === undefined) {
            return;
        }
        const mutable: MutableOoxmlElement = asMutable(pPr);
        mutable.children = mutable.children.filter((child: OoxmlElement | OoxmlText) => {
            if (child.kind !== 'element' || child.namespaceUri !== DML_NS) {
                return true;
            }
            return !arrayIncludes(names, child.localName);
        });
    }

    /**
     * @returns {void} Nothing.
     */
    private notify(): void {
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
}

/**
 * @param {ReadonlyArray<string>} values - Source.
 * @param {number} index - Index.
 * @returns {string} The result.
 */
function arrayAtName(values: ReadonlyArray<string>, index: number): string {
    return values[index];
}

/**
 * @param {string} localName - Attribute name.
 * @param {string} value - Attribute value.
 * @returns {OoxmlAttribute} The result.
 */
function attr(localName: string, value: string): OoxmlAttribute {
    return { namespaceUri: '', localName, value };
}

/**
 * @param {string} localName - Element name.
 * @param {ReadonlyArray<OoxmlAttribute>} attributes - Attributes.
 * @param {ReadonlyArray<OoxmlElement | OoxmlText>} children - Children.
 * @returns {OoxmlElement} The result.
 */
function dmlEl(localName: string, attributes: ReadonlyArray<OoxmlAttribute>,
               children: ReadonlyArray<OoxmlElement | OoxmlText>): OoxmlElement {
    return {
        kind: 'element' as 'element',
        namespaceUri: DML_NS,
        localName,
        attributes,
        children,
        prefixHint: 'a'
    };
}

/**
 * @param {OoxmlElement} el - Element.
 * @param {string} localName - Attribute name.
 * @param {string} value - Attribute value.
 * @returns {void} Nothing.
 */
function setElementAttr(el: OoxmlElement, localName: string, value: string): void {
    const mutable: MutableOoxmlElement = asMutable(el);
    const attrs: OoxmlAttribute[] = mutable.attributes.slice();
    const idx: number = attrs.findIndex((a: OoxmlAttribute) => a.namespaceUri === '' && a.localName === localName);
    const next: OoxmlAttribute = { namespaceUri: '', localName, value };
    if (idx === -1) {
        attrs.push(next);
    }
    else {
        attrs[idx] = next;
    }
    mutable.attributes = attrs;
}

/**
 * Inserts `child` immediately before `tabLst` / `defRPr` / `extLst` (schema order).
 *
 * @param {OoxmlElement} pPr - Paragraph properties.
 * @param {OoxmlElement} child - New child.
 * @returns {void} Nothing.
 */
function insertBeforeTabList(pPr: OoxmlElement, child: OoxmlElement): void {
    const mutable: MutableOoxmlElement = asMutable(pPr);
    const idx: number = mutable.children.findIndex((c: OoxmlElement | OoxmlText) => c.kind === 'element' &&
        c.namespaceUri === DML_NS && (c.localName === 'tabLst' || c.localName === 'defRPr' || c.localName === 'extLst'));
    if (idx === -1) {
        mutable.children.push(child);
    }
    else {
        mutable.children.splice(idx, 0, child);
    }
}

/**
 * Inserts a bullet-size child before the bullet group (and later siblings).
 *
 * @param {OoxmlElement} pPr - Paragraph properties.
 * @param {OoxmlElement} child - New child.
 * @returns {void} Nothing.
 */
function insertBeforeBullet(pPr: OoxmlElement, child: OoxmlElement): void {
    insertBeforeNames(pPr, child, BULLET_CHILD_NAMES.concat(['tabLst', 'defRPr', 'extLst']));
}

/**
 * Inserts `a:buClr` after spacing and before size, font, and bullet (`CT_TextParagraphProperties`).
 *
 * @param {OoxmlElement} pPr - Paragraph properties.
 * @param {OoxmlElement} child - `a:buClr`.
 * @returns {void} Nothing.
 */
function insertAtColorSlot(pPr: OoxmlElement, child: OoxmlElement): void {
    insertBeforeNames(pPr, child, BULLET_SIZE_CHILD_NAMES.concat([
        'buFont', 'buFontTx', 'buChar', 'buAutoNum', 'buBlip', 'buNone', 'tabLst', 'defRPr', 'extLst'
    ]));
}

/**
 * @param {OoxmlElement} pPr - Paragraph properties.
 * @param {OoxmlElement} child - Child to insert.
 * @param {ReadonlyArray<string>} names - Local names that must follow `child`.
 * @returns {void} Nothing.
 */
function insertBeforeNames(pPr: OoxmlElement, child: OoxmlElement, names: ReadonlyArray<string>): void {
    const mutable: MutableOoxmlElement = asMutable(pPr);
    const idx: number = mutable.children.findIndex((c: OoxmlElement | OoxmlText) => c.kind === 'element' &&
        c.namespaceUri === DML_NS && arrayIncludes(names, c.localName));
    if (idx === -1) {
        mutable.children.push(child);
    }
    else {
        mutable.children.splice(idx, 0, child);
    }
}

/**
 * @param {number} value - Channel.
 * @returns {boolean} The result.
 */
function isByte(value: number): boolean {
    return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 255;
}

/**
 * @param {number} value - Channel 0–255.
 * @returns {string} Two uppercase hex digits.
 */
function toHex(value: number): string {
    const hex: string = value.toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
}

/**
 * @param {string} localName - Relationship attribute name.
 * @param {string} value - Relationship id.
 * @returns {OoxmlAttribute} The result.
 */
function relAttr(localName: string, value: string): OoxmlAttribute {
    return { namespaceUri: OFFICE_REL_ATTR_NS, localName, value, prefix: 'r' };
}
