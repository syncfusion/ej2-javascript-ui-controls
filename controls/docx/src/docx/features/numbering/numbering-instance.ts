import { elementChildren, isWml, wmlAttr, wmlElement, wValAttribute } from '../document/wml';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement, WML_TRANSITIONAL_NAMESPACE } from '../../core/xml/index';
import { NumberingLevel, parseNumberingLevel } from './numbering-level';
/**
 * Level override on a numbering instance (`w:lvlOverride` / `CT_NumLvl`).
 *
 * MVP exposes `ilvl` and optional `startOverride`; nested `w:lvl` and other
 * children are preserved opaquely via {@link NumberingLevel} when present.
 *
 * @private
 */
export class NumberingLevelOverride {
    private readonly _ilvl: number;
    private _startOverride: number | undefined;
    private readonly _level: NumberingLevel | undefined;
    private readonly extraAttributes: ReadonlyArray<OpenXmlAttribute>;
    private readonly extras: ReadonlyArray<OpenXmlElement>;
    /**
     * @param {Object} init - The init.
     * @private
     */
    constructor(init: {
        readonly ilvl: number;
        readonly startOverride?: number;
        readonly level?: NumberingLevel;
        readonly extraAttributes?: ReadonlyArray<OpenXmlAttribute>;
        readonly extras?: ReadonlyArray<OpenXmlElement>;
    }) {
        this._ilvl = init.ilvl;
        this._startOverride = init.startOverride;
        this._level = init.level;
        this.extraAttributes = init.extraAttributes != null ? init.extraAttributes : [];
        this.extras = init.extras != null ? init.extras : [];
    }
    /** Zero-based level index (`@w:ilvl`). */
    get ilvl(): number {
        return this._ilvl;
    }
    /** Start override (`w:startOverride/@w:val`), when present. */
    get startOverride(): number | undefined {
        return this._startOverride;
    }
    /**
     * Update `w:startOverride/@w:val` on this override.
     *
     * @param {number} startAt - The start at.
     * @returns {void} Nothing is returned.
     * @private
     */
    setStartOverride(startAt: number): void {
        this._startOverride = startAt;
    }
    /** Nested level replacement (`w:lvl`), when present. */
    get level(): NumberingLevel | undefined {
        return this._level;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const children: OpenXmlChild[] = [];
        if (this._startOverride !== undefined) {
            children.push(wmlElement('startOverride', {
                attributes: [wmlAttr('val', String(this._startOverride))]
            }));
        }
        if (this._level !== undefined) {
            children.push(this._level.toOpenXml());
        }
        children.push(...this.extras);
        return wmlElement('lvlOverride', {
            attributes: [wmlAttr('ilvl', String(this._ilvl)), ...this.extraAttributes],
            children
        });
    }
}
/**
 * Concrete numbering instance (`w:num` / `CT_Num`).
 *
 * @private
 */
export class NumberingInstance {
    private readonly _numId: number;
    private readonly _abstractNumId: number;
    private readonly _levelOverrides: NumberingLevelOverride[];
    private readonly extraAttributes: ReadonlyArray<OpenXmlAttribute>;
    private readonly prefixExtras: ReadonlyArray<OpenXmlElement>;
    private readonly suffixExtras: ReadonlyArray<OpenXmlElement>;
    /**
     * @param {Object} init - The init.
     * @private
     */
    constructor(init: {
        readonly numId: number;
        readonly abstractNumId: number;
        readonly levelOverrides?: ReadonlyArray<NumberingLevelOverride>;
        readonly extraAttributes?: ReadonlyArray<OpenXmlAttribute>;
        readonly prefixExtras?: ReadonlyArray<OpenXmlElement>;
        readonly suffixExtras?: ReadonlyArray<OpenXmlElement>;
    }) {
        this._numId = init.numId;
        this._abstractNumId = init.abstractNumId;
        this._levelOverrides = init.levelOverrides != null ? [...init.levelOverrides] : [];
        this.extraAttributes = init.extraAttributes != null ? init.extraAttributes : [];
        this.prefixExtras = init.prefixExtras != null ? init.prefixExtras : [];
        this.suffixExtras = init.suffixExtras != null ? init.suffixExtras : [];
    }
    /** Instance id (`@w:numId`). */
    get numId(): number {
        return this._numId;
    }
    /** Linked abstract definition id (`w:abstractNumId/@w:val`). */
    get abstractNumId(): number {
        return this._abstractNumId;
    }
    /** Ordered level overrides (`w:lvlOverride`). */
    get levelOverrides(): ReadonlyArray<NumberingLevelOverride> {
        return this._levelOverrides;
    }
    /**
     * Set or replace the start override for `ilvl` (`w:startOverride`).
     *
     * @param {number} ilvl - The ilvl.
     * @param {number} startAt - The start at.
     * @returns {void} Nothing is returned.
     * @private
     */
    setStartOverride(ilvl: number, startAt: number): void {
        const existing: NumberingLevelOverride = this._levelOverrides.find((entry: NumberingLevelOverride) => entry.ilvl === ilvl);
        if (existing !== undefined) {
            existing.setStartOverride(startAt);
            return;
        }
        this._levelOverrides.push(new NumberingLevelOverride({ ilvl, startOverride: startAt }));
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const children: OpenXmlChild[] = [
            ...this.prefixExtras,
            wmlElement('abstractNumId', {
                attributes: [wmlAttr('val', String(this._abstractNumId))]
            })
        ];
        for (const override of this._levelOverrides) {
            children.push(override.toOpenXml());
        }
        children.push(...this.suffixExtras);
        return wmlElement('num', {
            attributes: [wmlAttr('numId', String(this._numId)), ...this.extraAttributes],
            children
        });
    }
}
/**
 * Parse `w:lvlOverride` into {@link NumberingLevelOverride}.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {NumberingLevelOverride | undefined} The result.
 * @private
 */
export function parseNumberingLevelOverride(element: OpenXmlElement): NumberingLevelOverride | undefined {
    if (!isWml(element, 'lvlOverride')) {
        return undefined;
    }
    const ilvl: number = decimalAttribute(element, 'ilvl');
    if (ilvl === undefined) {
        return undefined;
    }
    let startOverride: number | undefined;
    let level: NumberingLevel | undefined;
    const extras: OpenXmlElement[] = [];
    for (const child of elementChildren(element)) {
        if (isWml(child, 'startOverride') && startOverride === undefined) {
            const raw: string = wValAttribute(child);
            if (raw !== undefined && /^-?\d+$/.test(raw)) {
                startOverride = Number.parseInt(raw, 10);
                continue;
            }
        }
        if (isWml(child, 'lvl') && level === undefined) {
            level = parseNumberingLevel(child);
            if (level !== undefined) {
                continue;
            }
        }
        extras.push(child);
    }
    const extraAttributes: OpenXmlAttribute[] = element.attributes.filter((a: OpenXmlAttribute) => !(a.localName === 'ilvl' && a.namespaceUri === WML_TRANSITIONAL_NAMESPACE));
    return new NumberingLevelOverride({
        ilvl,
        ...(startOverride !== undefined ? { startOverride } : {}),
        ...(level !== undefined ? { level } : {}),
        extraAttributes,
        extras
    });
}
/**
 * Parse `w:num` into {@link NumberingInstance}.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {NumberingInstance | undefined} The result.
 * @private
 */
export function parseNumberingInstance(element: OpenXmlElement): NumberingInstance | undefined {
    if (!isWml(element, 'num')) {
        return undefined;
    }
    const numId: number = decimalAttribute(element, 'numId');
    if (numId === undefined) {
        return undefined;
    }
    const prefixExtras: OpenXmlElement[] = [];
    const suffixExtras: OpenXmlElement[] = [];
    const levelOverrides: NumberingLevelOverride[] = [];
    let abstractNumId: number = 0;
    let seenAbstract: boolean = false;
    for (const child of elementChildren(element)) {
        if (isWml(child, 'abstractNumId') && !seenAbstract) {
            const val: string = wValAttribute(child);
            if (val !== undefined && /^-?\d+$/.test(val)) {
                abstractNumId = Number.parseInt(val, 10);
                seenAbstract = true;
                continue;
            }
        }
        if (isWml(child, 'lvlOverride')) {
            const override: NumberingLevelOverride = parseNumberingLevelOverride(child);
            if (override !== undefined) {
                levelOverrides.push(override);
            }
            continue;
        }
        if (!seenAbstract) {
            prefixExtras.push(child);
            continue;
        }
        suffixExtras.push(child);
    }
    if (!seenAbstract) {
        return undefined;
    }
    const extraAttributes: OpenXmlAttribute[] = element.attributes.filter((a: OpenXmlAttribute) => !(a.localName === 'numId' && a.namespaceUri === WML_TRANSITIONAL_NAMESPACE));
    return new NumberingInstance({
        numId,
        abstractNumId,
        levelOverrides,
        extraAttributes,
        prefixExtras,
        suffixExtras
    });
}
/**
 * Minimal `w:num` linking to an abstract definition.
 *
 * @param {number} numId - The num id.
 * @param {number} abstractNumId - The abstract num id.
 * @returns {NumberingInstance} The result.
 * @private
 */
export function createNumberingInstance(numId: number, abstractNumId: number): NumberingInstance {
    return new NumberingInstance({ numId, abstractNumId });
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
