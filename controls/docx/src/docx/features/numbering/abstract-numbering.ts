import { elementChildren, isWml, wmlAttr, wmlElement, wValAttribute } from '../document/wml';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement, WML_TRANSITIONAL_NAMESPACE } from '../../core/xml/index';
import { createDefaultBulletLevel, createDefaultNumberedLevel, createHtmlDecimalLevel, createMinimalNumberingLevel, NumberingLevel, parseNumberingLevel } from './numbering-level';
/**
 * Multilevel classification (`w:multiLevelType/@w:val`, `ST_MultiLevelType`).
 *
 * @private
 */
export type MultiLevelType = 'singleLevel' | 'multilevel' | 'hybridMultilevel';
const MULTI_LEVEL_TYPES: Set<string> = new Set<string>(['singleLevel', 'multilevel', 'hybridMultilevel']);
/**
 * Abstract numbering definition (`w:abstractNum` / `CT_AbstractNum`).
 *
 * @private
 */
export class AbstractNumbering {
    private readonly _abstractNumId: number;
    private readonly _multiLevelType: MultiLevelType | undefined;
    private _name: string | undefined;
    private _styleLink: string | undefined;
    private _numStyleLink: string | undefined;
    private readonly _levels: NumberingLevel[];
    private readonly extraAttributes: ReadonlyArray<OpenXmlAttribute>;
    /** Unmodeled children before `w:lvl` (`nsid`, `tmpl`, unknown, …). */
    private readonly prefixExtras: ReadonlyArray<OpenXmlElement>;
    /** Unmodeled children after levels (rare). */
    private readonly suffixExtras: ReadonlyArray<OpenXmlElement>;
    /**
     * @param {Object} init - The init.
     * @private
     */
    constructor(init: {
        readonly abstractNumId: number;
        readonly multiLevelType?: MultiLevelType;
        readonly name?: string;
        readonly styleLink?: string;
        readonly numStyleLink?: string;
        readonly levels?: ReadonlyArray<NumberingLevel>;
        readonly extraAttributes?: ReadonlyArray<OpenXmlAttribute>;
        readonly prefixExtras?: ReadonlyArray<OpenXmlElement>;
        readonly suffixExtras?: ReadonlyArray<OpenXmlElement>;
    }) {
        this._abstractNumId = init.abstractNumId;
        this._multiLevelType = init.multiLevelType;
        this._name = init.name;
        this._styleLink = init.styleLink;
        this._numStyleLink = init.numStyleLink;
        this._levels = init.levels != null ? init.levels.slice() : [];
        this.extraAttributes = init.extraAttributes != null ? init.extraAttributes : [];
        this.prefixExtras = init.prefixExtras != null ? init.prefixExtras : [];
        this.suffixExtras = init.suffixExtras != null ? init.suffixExtras : [];
    }
    /** Abstract definition id (`@w:abstractNumId`). */
    get abstractNumId(): number {
        return this._abstractNumId;
    }
    /** Multilevel type (`w:multiLevelType/@w:val`), when present. */
    get multiLevelType(): MultiLevelType | undefined {
        return this._multiLevelType;
    }
    /** Friendly name (`w:name/@w:val`), when present. */
    get name(): string | undefined {
        return this._name;
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setName(value: string | undefined): void {
        this._name = value;
    }
    /** Style link (`w:styleLink/@w:val`), when present. */
    get styleLink(): string | undefined {
        return this._styleLink;
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setStyleLink(value: string | undefined): void {
        this._styleLink = value;
    }
    /** Numbering style link (`w:numStyleLink/@w:val`), when present. */
    get numStyleLink(): string | undefined {
        return this._numStyleLink;
    }
    /** Ordered level definitions (`w:lvl`, max 9 in schema). */
    get levels(): ReadonlyArray<NumberingLevel> {
        return this._levels;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const children: OpenXmlChild[] = [...this.prefixExtras];
        if (this._multiLevelType !== undefined) {
            children.push(wmlElement('multiLevelType', { attributes: [wmlAttr('val', this._multiLevelType)] }));
        }
        if (this._name !== undefined) {
            children.push(wmlElement('name', { attributes: [wmlAttr('val', this._name)] }));
        }
        if (this._styleLink !== undefined) {
            children.push(wmlElement('styleLink', { attributes: [wmlAttr('val', this._styleLink)] }));
        }
        if (this._numStyleLink !== undefined) {
            children.push(wmlElement('numStyleLink', { attributes: [wmlAttr('val', this._numStyleLink)] }));
        }
        for (const level of this._levels) {
            children.push(level.toOpenXml());
        }
        children.push(...this.suffixExtras);
        return wmlElement('abstractNum', {
            attributes: [
                wmlAttr('abstractNumId', String(this._abstractNumId)),
                ...this.extraAttributes
            ],
            children
        });
    }
}
/**
 * Parse `w:abstractNum` into {@link AbstractNumbering}.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {AbstractNumbering | undefined} The result.
 * @private
 */
export function parseAbstractNumbering(element: OpenXmlElement): AbstractNumbering | undefined {
    if (!isWml(element, 'abstractNum')) {
        return undefined;
    }
    const abstractNumId: number = decimalAttribute(element, 'abstractNumId');
    if (abstractNumId === undefined) {
        return undefined;
    }
    let multiLevelType: MultiLevelType | undefined;
    let name: string | undefined;
    let styleLink: string | undefined;
    let numStyleLink: string | undefined;
    const levels: NumberingLevel[] = [];
    const prefixExtras: OpenXmlElement[] = [];
    const suffixExtras: OpenXmlElement[] = [];
    let seenLevel: boolean = false;
    for (const child of elementChildren(element)) {
        if (isWml(child, 'lvl')) {
            const level: NumberingLevel = parseNumberingLevel(child);
            if (level !== undefined) {
                levels.push(level);
            }
            seenLevel = true;
            continue;
        }
        if (isWml(child, 'multiLevelType') && multiLevelType === undefined) {
            const raw: string = wValAttribute(child);
            if (raw !== undefined && MULTI_LEVEL_TYPES.has(raw)) {
                multiLevelType = raw as MultiLevelType;
                continue;
            }
        }
        if (isWml(child, 'name') && name === undefined) {
            const raw: string = wValAttribute(child);
            if (raw !== undefined) {
                name = raw;
                continue;
            }
        }
        if (isWml(child, 'styleLink') && styleLink === undefined) {
            const raw: string = wValAttribute(child);
            if (raw !== undefined) {
                styleLink = raw;
                continue;
            }
        }
        if (isWml(child, 'numStyleLink') && numStyleLink === undefined) {
            const raw: string = wValAttribute(child);
            if (raw !== undefined) {
                numStyleLink = raw;
                continue;
            }
        }
        if (!seenLevel) {
            prefixExtras.push(child);
        }
        else {
            suffixExtras.push(child);
        }
    }
    const extraAttributes: OpenXmlAttribute[] = element.attributes.filter((a: OpenXmlAttribute) => !(a.localName === 'abstractNumId' && a.namespaceUri === WML_TRANSITIONAL_NAMESPACE));
    return new AbstractNumbering({
        abstractNumId,
        ...(multiLevelType !== undefined ? { multiLevelType } : {}),
        ...(name !== undefined ? { name } : {}),
        ...(styleLink !== undefined ? { styleLink } : {}),
        ...(numStyleLink !== undefined ? { numStyleLink } : {}),
        levels,
        extraAttributes,
        prefixExtras,
        suffixExtras
    });
}
/**
 * Minimal single-level abstract definition for ensure/create paths (legacy fallback).
 *
 * @param {number} abstractNumId - The abstract num id.
 * @param {string | string} format - The format.
 * @returns {AbstractNumbering} The result.
 * @private
 */
export function createMinimalAbstractNumbering(abstractNumId: number, format: 'bullet' | 'decimal'): AbstractNumbering {
    return new AbstractNumbering({
        abstractNumId,
        multiLevelType: 'singleLevel',
        levels: [createMinimalNumberingLevel(0, format)]
    });
}
/**
 * Default nine-level abstract numbering definition following the DocIO
 * `ListStyle.CreateDefListLevels` repeating pattern.
 *
 * - **bullet:** ilvl 0/3/6 = `\uf0b7`/Symbol, ilvl 1/4/7 = `o`/Courier New,
 *   ilvl 2/5/8 = `\uf0a7`/Wingdings; indents (ilvl+1)×720 twips left, 360 twips hanging.
 * - **decimal:** cycling `decimal`/`lowerLetter`/`lowerRoman`; level text `%N.`;
 *   same indent ladder.
 *
 * `multiLevelType` is set to `hybridMultilevel` to match DocIO output.
 *
 * @param {number} abstractNumId - The abstract num id.
 * @param {string | string} format - The format.
 * @returns {AbstractNumbering} The result.
 * @private
 */
export function createDefaultAbstractNumbering(abstractNumId: number, format: 'bullet' | 'decimal' | 'html-decimal', htmlNumFmt: string = 'decimal'): AbstractNumbering {
    const levels: NumberingLevel[] = [];
    for (let ilvl = 0; ilvl < 9; ilvl++) {
        levels.push(format === 'bullet' ? createDefaultBulletLevel(ilvl)
            : format === 'html-decimal' ? createHtmlDecimalLevel(ilvl, htmlNumFmt)
            : createDefaultNumberedLevel(ilvl));
    }
    return new AbstractNumbering({
        abstractNumId,
        multiLevelType: 'hybridMultilevel',
        levels
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
