/**
 * WordDocument-level footnote/endnote properties (`w:footnotePr` / `w:endnotePr`).
 *
 * Models `CT_FtnDocProps` / `CT_EdnDocProps` (extends `CT_FtnProps` / `CT_EdnProps`)
 * from Transitional `wml.xsd`: optional `pos`, `numFmt`, `numStart`, `numRestart`,
 * plus residual children (separator refs) and leftover root attributes.
 *
 * Standards: ECMA-376-1 §17.11; `ST_NumberFormat`, `ST_FtnPos`, `ST_EdnPos`,
 * `ST_RestartNumber` in `specs/schemas/xsd/OfficeOpenXML-XMLSchema-Transitional/wml.xsd`.
 *
 * @public
 */
import { WML_TRANSITIONAL_NAMESPACE, NamespaceDeclaration, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { elementChildren, isWml, wmlAttr, wmlElement, wValAttribute } from '../document/wml';
/**
 * Where footnotes are placed on the page or in the document.
 *
 * - `pageBottom` — bottom of the page
 * - `beneathText` — directly under the last body text on the page
 * - `sectEnd` — end of the section
 * - `docEnd` — end of the document
 *
 *
 * @private
 */
export type FootnotePosition = 'pageBottom' | 'beneathText' | 'sectEnd' | 'docEnd';
/**
 * Where endnotes are placed in the document.
 *
 * - `sectEnd` — end of the section
 * - `docEnd` — end of the document
 *
 *
 * @private
 */
export type EndnotePosition = 'sectEnd' | 'docEnd';
/**
 * When automatic footnote or endnote numbering restarts.
 *
 * - `continuous` — numbering continues across the whole document
 * - `eachSect` — numbering restarts at each section
 * - `eachPage` — numbering restarts on each page (footnotes)
 *
 * @public
 */
export type NoteNumberingRestart = 'continuous' | 'eachSect' | 'eachPage';
/**
 * Closed set of note number formats.
 *
 * Use common values such as `decimal`, `upperRoman`, `lowerRoman`,
 * `upperLetter`, and `lowerLetter`. Less common regional and specialty tokens
 * are accepted when present in the schema.
 *
 * @public
 */
export type NoteNumberFormat = 'decimal' | 'upperRoman' | 'lowerRoman' | 'upperLetter' | 'lowerLetter' | 'ordinal' | 'cardinalText' | 'ordinalText' | 'hex' | 'chicago' | 'ideographDigital' | 'japaneseCounting' | 'aiueo' | 'iroha' | 'decimalFullWidth' | 'decimalHalfWidth' | 'japaneseLegal' | 'japaneseDigitalTenThousand' | 'decimalEnclosedCircle' | 'decimalFullWidth2' | 'aiueoFullWidth' | 'irohaFullWidth' | 'decimalZero' | 'bullet' | 'ganada' | 'chosung' | 'decimalEnclosedFullstop' | 'decimalEnclosedParen' | 'decimalEnclosedCircleChinese' | 'ideographEnclosedCircle' | 'ideographTraditional' | 'ideographZodiac' | 'ideographZodiacTraditional' | 'taiwaneseCounting' | 'ideographLegalTraditional' | 'taiwaneseCountingThousand' | 'taiwaneseDigital' | 'chineseCounting' | 'chineseLegalSimplified' | 'chineseCountingThousand' | 'koreanDigital' | 'koreanCounting' | 'koreanLegal' | 'koreanDigital2' | 'vietnameseCounting' | 'russianLower' | 'russianUpper' | 'none' | 'numberInDash' | 'hebrew1' | 'hebrew2' | 'arabicAlpha' | 'arabicAbjad' | 'hindiVowels' | 'hindiConsonants' | 'hindiNumbers' | 'hindiCounting' | 'thaiLetters' | 'thaiNumbers' | 'thaiCounting' | 'bahtText' | 'dollarText' | 'custom';
/** Closed `ST_NumberFormat` token set from Transitional `wml.xsd`. */
const ST_NUMBER_FORMAT: ReadonlySet<string> = new Set<string>([
    'decimal',
    'upperRoman',
    'lowerRoman',
    'upperLetter',
    'lowerLetter',
    'ordinal',
    'cardinalText',
    'ordinalText',
    'hex',
    'chicago',
    'ideographDigital',
    'japaneseCounting',
    'aiueo',
    'iroha',
    'decimalFullWidth',
    'decimalHalfWidth',
    'japaneseLegal',
    'japaneseDigitalTenThousand',
    'decimalEnclosedCircle',
    'decimalFullWidth2',
    'aiueoFullWidth',
    'irohaFullWidth',
    'decimalZero',
    'bullet',
    'ganada',
    'chosung',
    'decimalEnclosedFullstop',
    'decimalEnclosedParen',
    'decimalEnclosedCircleChinese',
    'ideographEnclosedCircle',
    'ideographTraditional',
    'ideographZodiac',
    'ideographZodiacTraditional',
    'taiwaneseCounting',
    'ideographLegalTraditional',
    'taiwaneseCountingThousand',
    'taiwaneseDigital',
    'chineseCounting',
    'chineseLegalSimplified',
    'chineseCountingThousand',
    'koreanDigital',
    'koreanCounting',
    'koreanLegal',
    'koreanDigital2',
    'vietnameseCounting',
    'russianLower',
    'russianUpper',
    'none',
    'numberInDash',
    'hebrew1',
    'hebrew2',
    'arabicAlpha',
    'arabicAbjad',
    'hindiVowels',
    'hindiConsonants',
    'hindiNumbers',
    'hindiCounting',
    'thaiLetters',
    'thaiNumbers',
    'thaiCounting',
    'bahtText',
    'dollarText',
    'custom'
]);
function isFootnotePosition(value: string): value is FootnotePosition {
    return (value === 'pageBottom' ||
        value === 'beneathText' ||
        value === 'sectEnd' ||
        value === 'docEnd');
}
function isEndnotePosition(value: string): value is EndnotePosition {
    return value === 'sectEnd' || value === 'docEnd';
}
function isNoteNumberingRestart(value: string): value is NoteNumberingRestart {
    return value === 'continuous' || value === 'eachSect' || value === 'eachPage';
}
function isNumberFormatToken(value: string): value is NoteNumberFormat {
    return ST_NUMBER_FORMAT.has(value);
}
function parseDecimalVal(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}
function isWmlValAttribute(attribute: OpenXmlAttribute): boolean {
    return (attribute.localName === 'val' &&
        (attribute.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attribute.namespaceUri === ''));
}
function requireNumberFormat(value: string): void {
    if (!isNumberFormatToken(value)) {
        throw new RangeError(`numberFormat is not a supported NoteNumberFormat: ${value}`);
    }
}
function requireFootnotePosition(value: string): void {
    if (!isFootnotePosition(value)) {
        throw new RangeError(`position is not a supported FootnotePosition: ${value}`);
    }
}
function requireEndnotePosition(value: string): void {
    if (!isEndnotePosition(value)) {
        throw new RangeError(`position is not a supported EndnotePosition: ${value}`);
    }
}
function requireRestart(value: string): void {
    if (!isNoteNumberingRestart(value)) {
        throw new RangeError(`numberingRestart is not a supported NoteNumberingRestart: ${value}`);
    }
}
type SharedNoteState = {
    numberFormat: NoteNumberFormat | undefined;
    numberingStart: number | undefined;
    numberingRestart: NoteNumberingRestart | undefined;
    numFmtExtraAttributes: OpenXmlAttribute[];
    numFmtChildren: OpenXmlChild[];
    numFmtNamespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    residualChildren: OpenXmlElement[];
    leftoverAttributes: OpenXmlAttribute[];
    namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    onDirty: (() => void) | undefined;
};
function emptySharedState(onDirty: (() => void) | undefined): SharedNoteState {
    return {
        numberFormat: undefined,
        numberingStart: undefined,
        numberingRestart: undefined,
        numFmtExtraAttributes: [],
        numFmtChildren: [],
        numFmtNamespaceDeclarations: [],
        residualChildren: [],
        leftoverAttributes: [],
        namespaceDeclarations: [],
        onDirty
    };
}
/**
 * Parse shared CT_FtnProps / CT_EdnProps children.
 * `tryConsumePos` returns true when the pos child is fully consumed (known token).
 * Returning false places the child in residual (unknown pos, or duplicate).
 *
 * @param {OpenXmlElement} element - Specifies the element.
 * @param {Function|undefined} onDirty - Specifies the on dirty.
 * @param {Function} tryConsumePos - Specifies the try consume pos.
 * @returns {SharedNoteState} Returns the result.
 */
function parseSharedFromElement(
    element: OpenXmlElement,
    onDirty: (() => void) | undefined,
    tryConsumePos: (raw: string | undefined) => boolean
): SharedNoteState {
    const state: SharedNoteState = emptySharedState(onDirty);
    state.leftoverAttributes = [...element.attributes];
    state.namespaceDeclarations = element.namespaceDeclarations;
    let sawPos: boolean = false;
    let sawNumFmt: boolean = false;
    let sawNumStart: boolean = false;
    let sawNumRestart: boolean = false;
    for (const child of elementChildren(element)) {
        if (isWml(child, 'pos') && !sawPos) {
            sawPos = true;
            if (tryConsumePos(wValAttribute(child))) {
                continue;
            }
            state.residualChildren.push(child);
            continue;
        }
        if (isWml(child, 'numFmt') && !sawNumFmt) {
            sawNumFmt = true;
            const raw: string = wValAttribute(child);
            if (raw !== undefined && isNumberFormatToken(raw)) {
                state.numberFormat = raw;
                state.numFmtExtraAttributes = child.attributes.filter((a: OpenXmlAttribute) => !isWmlValAttribute(a));
                state.numFmtChildren = [...child.children];
                state.numFmtNamespaceDeclarations = child.namespaceDeclarations;
                continue;
            }
            state.residualChildren.push(child);
            continue;
        }
        if (isWml(child, 'numStart') && !sawNumStart) {
            sawNumStart = true;
            const n: number = parseDecimalVal(wValAttribute(child));
            if (n !== undefined) {
                state.numberingStart = n;
                continue;
            }
            state.residualChildren.push(child);
            continue;
        }
        if (isWml(child, 'numRestart') && !sawNumRestart) {
            sawNumRestart = true;
            const raw: string = wValAttribute(child);
            if (raw !== undefined && isNoteNumberingRestart(raw)) {
                state.numberingRestart = raw;
                continue;
            }
            state.residualChildren.push(child);
            continue;
        }
        state.residualChildren.push(child);
    }
    return state;
}
function serializeShared(localName: 'footnotePr' | 'endnotePr', position: string | undefined, state: SharedNoteState): OpenXmlElement {
    const children: OpenXmlElement[] = [];
    if (position !== undefined) {
        children.push(wmlElement('pos', { attributes: [wmlAttr('val', position)] }));
    }
    if (state.numberFormat !== undefined) {
        children.push(wmlElement('numFmt', {
            attributes: [wmlAttr('val', state.numberFormat), ...state.numFmtExtraAttributes],
            namespaceDeclarations: state.numFmtNamespaceDeclarations,
            children: state.numFmtChildren
        }));
    }
    if (state.numberingStart !== undefined) {
        children.push(wmlElement('numStart', { attributes: [wmlAttr('val', String(state.numberingStart))] }));
    }
    if (state.numberingRestart !== undefined) {
        children.push(wmlElement('numRestart', { attributes: [wmlAttr('val', state.numberingRestart)] }));
    }
    for (const child of state.residualChildren) {
        children.push(child);
    }
    return wmlElement(localName, {
        attributes: state.leftoverAttributes,
        namespaceDeclarations: state.namespaceDeclarations,
        children
    });
}
/**
 * First-class `w:footnotePr` node (`CT_FtnDocProps`).
 *
 * @private
 */
export class FootnoteProperties {
    private positionValue: FootnotePosition | undefined;
    private readonly state: SharedNoteState;
    private constructor(position: FootnotePosition | undefined, state: SharedNoteState) {
        this.positionValue = position;
        this.state = state;
    }
    /**
     * @param {OpenXmlElement} element - The element.
     * @param {Function} onDirty - The on dirty.
     * @returns {FootnoteProperties} The result.
     * @private
     */
    static fromElement(element: OpenXmlElement, onDirty?: () => void): FootnoteProperties {
        let position: FootnotePosition | undefined;
        const state: SharedNoteState = parseSharedFromElement(element, onDirty, (raw: string) => {
            if (raw !== undefined && isFootnotePosition(raw)) {
                position = raw;
                return true;
            }
            return false;
        });
        return new FootnoteProperties(position, state);
    }
    /**
     * @param {Function} onDirty - The on dirty.
     * @returns {FootnoteProperties} The result.
     * @private
     * Empty node for create path.
     */
    static create(onDirty?: () => void): FootnoteProperties {
        return new FootnoteProperties(undefined, emptySharedState(onDirty));
    }
    /**
     * @param {Function} onDirty - The on dirty.
     * @returns {void} Nothing is returned.
     * @private
     * Bind dirty callback after SettingsPart wraps the node.
     */
    bindDirty(onDirty: () => void): void {
        this.state.onDirty = onDirty;
    }
    private markDirty(): void {
        if (this.state.onDirty != null) {
            this.state.onDirty();
        }
    }
    /**
     * Display format for automatic footnote numbers (for example `decimal` or
     * `lowerRoman`). `undefined` when the document does not specify a format.
     *
     * @public
     */
    get numberFormat(): NoteNumberFormat | undefined {
        return this.state.numberFormat;
    }
    /**
     * Set or clear the footnote number format.
     *
     * @param {NoteNumberFormat | undefined} value - Specifies the value.
     * @returns {void} Nothing.
     * @throws RangeError when `value` is not a supported {@link NoteNumberFormat}.
     * @public
     */
    set numberFormat(value: NoteNumberFormat | undefined) {
        if (value !== undefined) {
            requireNumberFormat(value);
        }
        this.state.numberFormat = value;
        if (value === undefined) {
            this.state.numFmtExtraAttributes = [];
            this.state.numFmtChildren = [];
            this.state.numFmtNamespaceDeclarations = [];
        }
        this.markDirty();
    }
    /**
     * Where footnotes appear relative to body text and sections.
     * `undefined` when the document does not specify a placement.
     *
     * @public
     */
    get position(): FootnotePosition | undefined {
        return this.positionValue;
    }
    /**
     * Set or clear footnote placement.
     *
     * @param {FootnotePosition | undefined} value - Specifies the value.
     * @returns {void} Nothing.
     * @throws RangeError when `value` is not a supported {@link FootnotePosition}.
     * @public
     */
    set position(value: FootnotePosition | undefined) {
        if (value !== undefined) {
            requireFootnotePosition(value);
        }
        this.positionValue = value;
        this.markDirty();
    }
    /**
     * Starting value for automatic footnote numbering.
     * `undefined` when the document uses the application default (typically `1`).
     *
     * @public
     */
    get initialNoteNumber(): number | undefined {
        return this.state.numberingStart;
    }
    /**
     * Set or clear the starting footnote number.
     *
     * @param {number | undefined} value - Specifies the value.
     * @returns {void} Nothing.
     * @throws RangeError when `value` is not a finite integer.
     * @public
     */
    set initialNoteNumber(value: number | undefined) {
        if (value !== undefined && (!Number.isInteger(value) || !Number.isFinite(value))) {
            throw new RangeError(`initialNoteNumber must be a finite integer, got ${String(value)}`);
        }
        this.state.numberingStart = value;
        this.markDirty();
    }
    /**
     * When automatic footnote numbering restarts (`continuous`, `eachSect`, or
     * `eachPage`). `undefined` when the document does not specify a restart rule.
     *
     * @public
     */
    get numberingRestart(): NoteNumberingRestart | undefined {
        return this.state.numberingRestart;
    }
    /**
     * Set or clear the footnote numbering restart rule.
     *
     * @param {NoteNumberingRestart | undefined} value - Specifies the value.
     * @returns {void} Nothing.
     * @throws RangeError when `value` is not a supported {@link NoteNumberingRestart}.
     * @public
     */
    set numberingRestart(value: NoteNumberingRestart | undefined) {
        if (value !== undefined) {
            requireRestart(value);
        }
        this.state.numberingRestart = value;
        this.markDirty();
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        return serializeShared('footnotePr', this.positionValue, this.state);
    }
}
/**
 * First-class `w:endnotePr` node (`CT_EdnDocProps`).
 *
 * @private
 */
export class EndnoteProperties {
    private positionValue: EndnotePosition | undefined;
    private readonly state: SharedNoteState;
    private constructor(position: EndnotePosition | undefined, state: SharedNoteState) {
        this.positionValue = position;
        this.state = state;
    }
    /**
     * @param {OpenXmlElement} element - The element.
     * @param {Function} onDirty - The on dirty.
     * @returns {EndnoteProperties} The result.
     * @private
     */
    static fromElement(element: OpenXmlElement, onDirty?: () => void): EndnoteProperties {
        let position: EndnotePosition | undefined;
        const state: SharedNoteState = parseSharedFromElement(element, onDirty, (raw: string) => {
            if (raw !== undefined && isEndnotePosition(raw)) {
                position = raw;
                return true;
            }
            return false;
        });
        return new EndnoteProperties(position, state);
    }
    /**
     * @param {Function} onDirty - The on dirty.
     * @returns {EndnoteProperties} The result.
     * @private
     * Empty node for create path.
     */
    static create(onDirty?: () => void): EndnoteProperties {
        return new EndnoteProperties(undefined, emptySharedState(onDirty));
    }
    /**
     * @param {Function} onDirty - The on dirty.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindDirty(onDirty: () => void): void {
        this.state.onDirty = onDirty;
    }
    private markDirty(): void {
        if (this.state.onDirty != null) {
            this.state.onDirty();
        }
    }
    /**
     * Display format for automatic endnote numbers (for example `decimal` or
     * `upperRoman`). `undefined` when the document does not specify a format.
     *
     * @public
     */
    get numberFormat(): NoteNumberFormat | undefined {
        return this.state.numberFormat;
    }
    /**
     * Set or clear the endnote number format.
     *
     * @param {NoteNumberFormat | undefined} value - Specifies the value.
     * @returns {void} Nothing.
     * @throws RangeError when `value` is not a supported {@link NoteNumberFormat}.
     * @public
     */
    set numberFormat(value: NoteNumberFormat | undefined) {
        if (value !== undefined) {
            requireNumberFormat(value);
        }
        this.state.numberFormat = value;
        if (value === undefined) {
            this.state.numFmtExtraAttributes = [];
            this.state.numFmtChildren = [];
            this.state.numFmtNamespaceDeclarations = [];
        }
        this.markDirty();
    }
    /**
     * Where endnotes appear relative to sections and the document end.
     * `undefined` when the document does not specify a placement.
     *
     * @public
     */
    get position(): EndnotePosition | undefined {
        return this.positionValue;
    }
    /**
     * Set or clear endnote placement.
     *
     * @param {EndnotePosition | undefined} value - Specifies the value.
     * @returns {void} Nothing.
     * @throws RangeError when `value` is not a supported {@link EndnotePosition}.
     * @public
     */
    set position(value: EndnotePosition | undefined) {
        if (value !== undefined) {
            requireEndnotePosition(value);
        }
        this.positionValue = value;
        this.markDirty();
    }
    /**
     * Starting value for automatic endnote numbering.
     * `undefined` when the document uses the application default (typically `1`).
     *
     * @public
     */
    get initialNoteNumber(): number | undefined {
        return this.state.numberingStart;
    }
    /**
     * Set or clear the starting endnote number.
     *
     * @param {number | undefined} value - Specifies the value.
     * @returns {void} Nothing.
     * @throws RangeError when `value` is not a finite integer.
     * @public
     */
    set initialNoteNumber(value: number | undefined) {
        if (value !== undefined && (!Number.isInteger(value) || !Number.isFinite(value))) {
            throw new RangeError(`initialNoteNumber must be a finite integer, got ${String(value)}`);
        }
        this.state.numberingStart = value;
        this.markDirty();
    }
    /**
     * When automatic endnote numbering restarts (`continuous` or `eachSect`).
     * `undefined` when the document does not specify a restart rule.
     *
     * @public
     */
    get numberingRestart(): NoteNumberingRestart | undefined {
        return this.state.numberingRestart;
    }
    /**
     * Set or clear the endnote numbering restart rule.
     *
     * @param {NoteNumberingRestart | undefined} value - Specifies the value.
     * @returns {void} Nothing.
     * @throws RangeError when `value` is not a supported {@link NoteNumberingRestart}.
     * @public
     */
    set numberingRestart(value: NoteNumberingRestart | undefined) {
        if (value !== undefined) {
            requireRestart(value);
        }
        this.state.numberingRestart = value;
        this.markDirty();
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        return serializeShared('endnotePr', this.positionValue, this.state);
    }
}
