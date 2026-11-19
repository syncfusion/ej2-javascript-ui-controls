import { elementChildren, isWml, wmlAttr, wmlElement, wValAttribute } from '../document/wml';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { WML_TRANSITIONAL_NAMESPACE } from '../../core/xml/index';
/**
 * One numbering level definition (`w:lvl` / `CT_Lvl`).
 *
 * MVP models `ilvl`, `start`, `numFmt`, `lvlText`, `isLgl`, `lvlJc`, and
 * `lvlPicBulletId`. Remaining `CT_Lvl` children and unknown attributes are
 * preserved opaquely for round-trip.
 *
 * @private
 */
export class NumberingLevel {
    private readonly _ilvl: number;
    private _start: number | undefined;
    private _numFmt: string | undefined;
    private _lvlText: string | undefined;
    private _isLgl: boolean | undefined;
    private _lvlJc: string | undefined;
    private _lvlPicBulletId: number | undefined;
    private readonly extraAttributes: ReadonlyArray<OpenXmlAttribute>;
    /** Unmodeled children in document order (`lvlRestart`, `pStyle`, `suff`, `legacy`, `pPr`, `rPr`, …). */
    private extras: OpenXmlElement[];
    /**
     * @param {Object} init - The init.
     * @private
     */
    constructor(init: {
        readonly ilvl: number;
        readonly start?: number;
        readonly numFmt?: string;
        readonly lvlText?: string;
        readonly isLgl?: boolean;
        readonly lvlJc?: string;
        readonly lvlPicBulletId?: number;
        readonly extraAttributes?: ReadonlyArray<OpenXmlAttribute>;
        readonly extras?: ReadonlyArray<OpenXmlElement>;
    }) {
        this._ilvl = init.ilvl;
        this._start = init.start;
        this._numFmt = init.numFmt;
        this._lvlText = init.lvlText;
        this._isLgl = init.isLgl;
        this._lvlJc = init.lvlJc;
        this._lvlPicBulletId = init.lvlPicBulletId;
        this.extraAttributes = init.extraAttributes != null ? init.extraAttributes : [];
        this.extras = init.extras != null ? init.extras.slice() : [];
    }
    /** Zero-based level index (`@w:ilvl`). */
    get ilvl(): number {
        return this._ilvl;
    }
    /** Starting value (`w:start/@w:val`), when present. */
    get start(): number | undefined {
        return this._start;
    }
    /**
     * @param {number | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setStart(value: number | undefined): void {
        this._start = value;
    }
    /**
     * Number format token (`w:numFmt/@w:val`, `ST_NumberFormat`).
     * Values are not invented by this library.
     */
    get numFmt(): string | undefined {
        return this._numFmt;
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setNumFmt(value: string | undefined): void {
        this._numFmt = value;
    }
    /** Level text pattern (`w:lvlText/@w:val`). */
    get lvlText(): string | undefined {
        return this._lvlText;
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setLvlText(value: string | undefined): void {
        this._lvlText = value;
    }
    /** Legal style numbering (`w:isLgl`), when present. */
    get isLgl(): boolean | undefined {
        return this._isLgl;
    }
    /**
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setIsLgl(value: boolean | undefined): void {
        this._isLgl = value;
    }
    /** Level justification token (`w:lvlJc/@w:val`, `ST_Jc`). */
    get lvlJc(): string | undefined {
        return this._lvlJc;
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setLvlJc(value: string | undefined): void {
        this._lvlJc = value;
    }
    /** Picture bullet id reference (`w:lvlPicBulletId/@w:val`). */
    get lvlPicBulletId(): number | undefined {
        return this._lvlPicBulletId;
    }
    /**
     * @returns {ReadonlyArray<OpenXmlElement>} The result.
     *  Unmodeled CT_Lvl children including `suff`, `lvlRestart`, `pStyle`, `pPr`, `rPr`.
     *
     * @private
     */
    getExtras(): ReadonlyArray<OpenXmlElement> {
        return this.extras;
    }
    /**
     * @param {string} localName - The local name.
     * @param {OpenXmlElement | undefined} element - The element.
     * @returns {void} Nothing is returned.
     *  Replace or insert a single WML child in extras by local name.
     *
     * @private
     */
    setExtraElement(localName: string, element: OpenXmlElement | undefined): void {
        const next: OpenXmlElement[] = [];
        let replaced: boolean = false;
        for (const elementItem of this.extras) {
            if (elementItem !== undefined && isWml(elementItem, localName)) {
                if (!replaced && element !== undefined) {
                    next.push(element);
                    replaced = true;
                }
                continue;
            }
            if (elementItem !== undefined) {
                next.push(elementItem);
            }
        }
        if (!replaced && element !== undefined) {
            // Insert pPr/rPr near the end; other mid children before pPr.
            if (localName === 'pPr' || localName === 'rPr' || localName === 'legacy') {
                next.push(element);
            } else {
                let insertAt: number = next.length;
                for (const [i, element] of next.entries()) {
                    if (element !== undefined && (isWml(element, 'pPr') || isWml(element, 'rPr') || isWml(element, 'legacy'))) {
                        insertAt = i;
                        break;
                    }
                }
                next.splice(insertAt, 0, element);
            }
        }
        this.extras = next;
    }
    /**
     * @param {string} localName - The local name.
     * @returns {OpenXmlElement | undefined} The result.
     *  Find first extras child by local name.
     *
     * @private
     */
    findExtra(localName: string): OpenXmlElement | undefined {
        for (const extra of this.extras) {
            if (extra !== undefined && isWml(extra, localName)) {
                return extra;
            }
        }
        return undefined;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const children: OpenXmlChild[] = [];
        if (this._start !== undefined) {
            children.push(wmlElement('start', { attributes: [wmlAttr('val', String(this._start))] }));
        }
        if (this._numFmt !== undefined) {
            children.push(wmlElement('numFmt', { attributes: [wmlAttr('val', this._numFmt)] }));
        }
        // Unmodeled extras keep original relative order among themselves; modeled
        // fields above emit in CT_Lvl head order first, then remaining extras, then
        // remaining modeled tail (isLgl / lvlText / lvlPicBulletId / lvlJc).
        const headModeled: Set<string> = new Set(['start', 'numFmt']);
        const tailModeled: Set<string> = new Set(['isLgl', 'lvlText', 'lvlPicBulletId', 'lvlJc']);
        const midExtras: OpenXmlElement[] = [];
        const tailExtras: OpenXmlElement[] = [];
        let pastMid: boolean = false;
        for (const extra of this.extras) {
            if (isWml(extra, 'pPr') || isWml(extra, 'rPr') || isWml(extra, 'legacy')) {
                pastMid = true;
            }
            if (pastMid ||
                isWml(extra, 'pPr') ||
                isWml(extra, 'rPr') ||
                isWml(extra, 'legacy') ||
                isWml(extra, 'lvlJc')) {
                // lvlJc may appear in extras only if modeling failed; treat as tail region.
                tailExtras.push(extra);
            }
            else if (!headModeled.has(extra.localName) && !tailModeled.has(extra.localName)) {
                midExtras.push(extra);
            }
        }
        children.push(...midExtras);
        if (this._isLgl !== undefined) {
            children.push(serializeOnOffChild('isLgl', this._isLgl));
        }
        if (this._lvlText !== undefined) {
            children.push(wmlElement('lvlText', { attributes: [wmlAttr('val', this._lvlText)] }));
        }
        if (this._lvlPicBulletId !== undefined) {
            children.push(wmlElement('lvlPicBulletId', {
                attributes: [wmlAttr('val', String(this._lvlPicBulletId))]
            }));
        }
        if (this._lvlJc !== undefined) {
            children.push(wmlElement('lvlJc', { attributes: [wmlAttr('val', this._lvlJc)] }));
        }
        children.push(...tailExtras);
        return wmlElement('lvl', {
            attributes: [wmlAttr('ilvl', String(this._ilvl)), ...this.extraAttributes],
            children
        });
    }
}
/**
 * Parse a `w:lvl` element into {@link NumberingLevel}.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {NumberingLevel | undefined} The result.
 * @private
 */
export function parseNumberingLevel(element: OpenXmlElement): NumberingLevel | undefined {
    if (!isWml(element, 'lvl')) {
        return undefined;
    }
    const ilvl: number = decimalAttribute(element, 'ilvl');
    if (ilvl === undefined) {
        return undefined;
    }
    let start: number | undefined;
    let numFmt: string | undefined;
    let lvlText: string | undefined;
    let isLgl: boolean | undefined;
    let lvlJc: string | undefined;
    let lvlPicBulletId: number | undefined;
    const extras: OpenXmlElement[] = [];
    for (const child of elementChildren(element)) {
        if (isWml(child, 'start') && start === undefined) {
            const raw: string = wValAttribute(child);
            if (raw !== undefined && /^-?\d+$/.test(raw)) {
                start = Number.parseInt(raw, 10);
                continue;
            }
        }
        if (isWml(child, 'numFmt') && numFmt === undefined) {
            const raw: string = wValAttribute(child);
            if (raw !== undefined) {
                numFmt = raw;
                continue;
            }
        }
        if (isWml(child, 'lvlText') && lvlText === undefined) {
            const raw: string = wValAttribute(child);
            if (raw !== undefined) {
                lvlText = raw;
                continue;
            }
        }
        if (isWml(child, 'isLgl') && isLgl === undefined) {
            isLgl = parseOnOffChild(child);
            continue;
        }
        if (isWml(child, 'lvlJc') && lvlJc === undefined) {
            const raw: string = wValAttribute(child);
            if (raw !== undefined) {
                lvlJc = raw;
                continue;
            }
        }
        if (isWml(child, 'lvlPicBulletId') && lvlPicBulletId === undefined) {
            const raw: string = wValAttribute(child);
            if (raw !== undefined && /^-?\d+$/.test(raw)) {
                lvlPicBulletId = Number.parseInt(raw, 10);
                continue;
            }
        }
        extras.push(child);
    }
    const extraAttributes: OpenXmlAttribute[] = element.attributes.filter((a: OpenXmlAttribute) => !(a.localName === 'ilvl' && a.namespaceUri === WML_TRANSITIONAL_NAMESPACE));
    return new NumberingLevel({
        ilvl,
        ...(start !== undefined ? { start } : {}),
        ...(numFmt !== undefined ? { numFmt } : {}),
        ...(lvlText !== undefined ? { lvlText } : {}),
        ...(isLgl !== undefined ? { isLgl } : {}),
        ...(lvlJc !== undefined ? { lvlJc } : {}),
        ...(lvlPicBulletId !== undefined ? { lvlPicBulletId } : {}),
        extraAttributes,
        extras
    });
}
/**
 * Minimal level-0 bullet or decimal definition used by ensure/create paths.
 *
 * @param {number} ilvl - The ilvl.
 * @param {string | string} format - The format.
 * @returns {NumberingLevel} The result.
 * @private
 */
export function createMinimalNumberingLevel(ilvl: number, format: 'bullet' | 'decimal'): NumberingLevel {
    const numFmt: string = format === 'bullet' ? 'bullet' : 'decimal';
    const lvlText: string = format === 'bullet' ? '•' : '%1.';
    return new NumberingLevel({
        ilvl,
        start: 1,
        numFmt,
        lvlText,
        lvlJc: 'left',
        extras: [
            wmlElement('pPr', {
                children: [
                    wmlElement('ind', { attributes: [wmlAttr('left', '720'), wmlAttr('hanging', '360')] })
                ]
            })
        ]
    });
}
/**
 * Bullet character, font name, and format token at a given 0-based position in the
 * three-slot repeating pattern used by DocIO `WListLevel.CreateDefBulletLvl`.
 */
const BULLET_PATTERN: ReadonlyArray<{
    readonly lvlText: string;
    readonly font: string;
}> = [
    { lvlText: '\uf0b7', font: 'Symbol' },
    { lvlText: 'o', font: 'Courier New' },
    { lvlText: '\uf0a7', font: 'Wingdings' }
];
/**
 * Number format and justification at a given 0-based position in the three-slot
 * repeating pattern used by DocIO `WListLevel.CreateDefNumberLvl`.
 */
const NUMBER_PATTERN: ReadonlyArray<{
    readonly numFmt: string;
    readonly lvlJc: string;
}> = [
    { numFmt: 'decimal', lvlJc: 'left' },
    { numFmt: 'lowerLetter', lvlJc: 'right' },
    { numFmt: 'lowerRoman', lvlJc: 'left' }
];
/**
 * Build one `w:lvl` for a default nine-level bullet abstract numbering definition.
 *
 * DocIO formula (points → twips): `left = (ilvl + 1) * 36 pt * 20 = (ilvl + 1) * 720`;
 * `hanging = 18 pt * 20 = 360` for all levels.
 *
 * @param {number} ilvl - The ilvl.
 * @returns {NumberingLevel} The result.
 * @private
 */
export function createDefaultBulletLevel(ilvl: number): NumberingLevel {
    let ts330: any;
    const slot: number = ilvl % 3;
    // slot is always 0, 1, or 2 because BULLET_PATTERN has exactly 3 entries.
    // Provide a safe fallback (slot=0) to avoid non-null assertion.
    // eslint-disable-next-line security/detect-object-injection -- slot is a bounded integer computed internally; table is a fixed constant array
    const pattern: { readonly lvlText: string; readonly font: string; } = ((ts330 = BULLET_PATTERN[slot] != null ? BULLET_PATTERN[slot] : BULLET_PATTERN[0]), ts330 != null ? ts330 : { lvlText: '\uf0b7', font: 'Symbol' });
    const leftTwips: number = (ilvl + 1) * 720;
    return new NumberingLevel({
        ilvl,
        start: 1,
        numFmt: 'bullet',
        lvlText: pattern.lvlText,
        lvlJc: 'left',
        extras: [
            wmlElement('pPr', {
                children: [
                    wmlElement('ind', {
                        attributes: [
                            wmlAttr('left', String(leftTwips)),
                            wmlAttr('hanging', '360')
                        ]
                    })
                ]
            }),
            wmlElement('rPr', {
                children: [
                    wmlElement('rFonts', {
                        attributes: [
                            wmlAttr('ascii', pattern.font),
                            wmlAttr('hAnsi', pattern.font)
                        ]
                    })
                ]
            })
        ]
    });
}
/**
 * Build one `w:lvl` for a default nine-level numbered abstract numbering definition.
 *
 * Level text token: `%<N>.` where N = ilvl + 1 (1-based, matches DocIO `%N<suffix>`).
 *
 * @param {number} ilvl - The ilvl.
 * @returns {NumberingLevel} The result.
 * @private
 */
export function createDefaultNumberedLevel(ilvl: number): NumberingLevel {
    let ts331: any;
    const slot: number = ilvl % 3;
    // slot is always 0, 1, or 2 because NUMBER_PATTERN has exactly 3 entries.
    // eslint-disable-next-line security/detect-object-injection -- slot is a bounded integer computed internally; table is a fixed constant array
    const pattern: { readonly numFmt: string; readonly lvlJc: string; } = ((ts331 = NUMBER_PATTERN[slot] != null ? NUMBER_PATTERN[slot] : NUMBER_PATTERN[0]), ts331 != null ? ts331 : { numFmt: 'decimal', lvlJc: 'left' });
    const leftTwips: number = (ilvl + 1) * 720;
    return new NumberingLevel({
        ilvl,
        start: 1,
        numFmt: pattern.numFmt,
        lvlText: `%${String(ilvl + 1)}.`,
        lvlJc: pattern.lvlJc,
        extras: [
            wmlElement('pPr', {
                children: [
                    wmlElement('ind', {
                        attributes: [
                            wmlAttr('left', String(leftTwips)),
                            wmlAttr('hanging', '360')
                        ]
                    })
                ]
            })
        ]
    });
}
/**
 * HTML <ol> level: decimal at every level, matching browser rendering of nested
 * ordered lists (1. / 1.1-style nesting keeps plain numbers at each level).
 *
 * @private
 */
export function createHtmlDecimalLevel(ilvl: number, numFmt: string = 'decimal'): NumberingLevel {
    const leftTwips = (ilvl + 1) * 720;
    return new NumberingLevel({
        ilvl,
        start: 1,
        numFmt: numFmt,
        lvlText: `%${String(ilvl + 1)}.`,
        lvlJc: 'left',
        extras: [
            wmlElement('pPr', {
                children: [
                    wmlElement('ind', {
                        attributes: [
                            wmlAttr('left', String(leftTwips)),
                            wmlAttr('hanging', '360'),
                        ],
                    }),
                ],
            }),
        ],
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
function parseOnOffChild(el: OpenXmlElement): boolean {
    const raw: string = wValAttribute(el);
    if (raw === undefined || raw === '' || raw === '1' || raw === 'true' || raw === 'on') {
        return true;
    }
    if (raw === '0' || raw === 'false' || raw === 'off') {
        return false;
    }
    return true;
}
function serializeOnOffChild(localName: string, value: boolean): OpenXmlElement {
    if (value) {
        return wmlElement(localName);
    }
    return wmlElement(localName, { attributes: [wmlAttr('val', '0')] });
}
