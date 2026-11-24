/**
 * Custom list styles: ListStyle / ListLevel facades over numbering abstracts + styles.
 *
 * @public
 */
import { objectValues, ownGet } from '../../core/compat/object-compat';
import { DocxError, InvalidArgumentError } from '../../core/errors/docx-error';
import { OpenXmlElement } from '../../core/xml/index';
import { WordDocument } from '../document/document';
import {
    CharacterFormat,
    CharacterFormatHost,
    CharacterFormatSnapshot,
    parseCharacterFormat
} from '../document/character-format';
import {
    emptyParagraphFormatSnapshot,
    ParagraphFormat,
    ParagraphFormatHost,
    ParagraphFormatSnapshot,
    parseParagraphFormat
} from '../document/paragraph-format';
import { pointToTwips, twipsToPoint } from '../document/length';
import { elementChildren, isWml, wmlAttr, wmlElement, wValAttribute } from '../document/wml';
import { createDefaultAbstractNumbering, AbstractNumbering } from './abstract-numbering';
import { NumberingLevel } from './numbering-level';
import { numberingFor, ListFormatType } from './index';
import {
    characterSnapshotFromRPr,
    paragraphSnapshotFromPPr
} from '../styles/style-format-bridge';
import { DocxStyle } from '../styles/style';
import { styleCollectionFor } from '../styles/index';
import { StyleCollection } from '../styles/style-collection';
import { Style } from '../styles/style-base';
import { OpenXmlAttribute } from '../../core/xml/model';

/** Minimal numbering catalog surface used by list-style. */
interface NumberingCatalog {
    allocateAbstractNumId(): number;
    registerAbstract(abstract: AbstractNumbering): void;
    markDirty(): void;
    readonly abstractNumberings: ReadonlyArray<{
        readonly abstractNumId: number;
        readonly styleLink: string | undefined;
        readonly name: string | undefined;
        readonly numStyleLink: string | undefined;
    }>;
}

function numberingCatalog(document: WordDocument): NumberingCatalog {
    return numberingFor(document);
}

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/**
 * High-level list category for {@link WordDocument.addListStyle}.
 *
 * @public
 */
export enum ListType {
    /** Specifies the bulleted type. */
    Bulleted = 'bulleted',
    /** Specifies the numbered type. */
    Numbered = 'numbered',
}

/**
 * Number / bullet pattern for a list level.
 *
 * @public
 */
export enum ListPatternType {
    /** Specifies the arabic type. */
    Arabic = 'arabic',
    /** Specifies the leading zero type. */
    LeadingZero = 'leadingZero',
    /** Specifies the letter type. */
    Letter = 'letter',
    /** Specifies the letter low type. */
    LetterLow = 'letterLow',
    /** Specifies the roman type. */
    Roman = 'roman',
    /** Specifies the roman low type. */
    RomanLow = 'romanLow',
    /** Specifies the ordinal type. */
    Ordinal = 'ordinal',
    /** Specifies the ordinal text type. */
    OrdinalText = 'ordinalText',
    /** Specifies the cardinal text type. */
    CardinalText = 'cardinalText',
    /** Specifies the bullet type. */
    Bullet = 'bullet',
    /** Specifies the no number type. */
    NoNumber = 'noNumber',
    /** Specifies the far east type. */
    FarEast = 'farEast',
    /** Specifies the special type. */
    Special = 'special',
    /** Specifies the hebrew1 type. */
    Hebrew1 = 'hebrew1',
    /** Specifies the hebrew2 type. */
    Hebrew2 = 'hebrew2',
    /** Specifies the hindi arabic type. */
    HindiArabic = 'hindiArabic',
    /** Specifies the hindi cardinal text type. */
    HindiCardinalText = 'hindiCardinalText',
    /** Specifies the hindi letter1 type. */
    HindiLetter1 = 'hindiLetter1',
    /** Specifies the hindi letter2 type. */
    HindiLetter2 = 'hindiLetter2',
    /** Specifies the chinese counting type. */
    ChineseCounting = 'chineseCounting',
    /** Specifies the chinese counting thousand type. */
    ChineseCountingThousand = 'chineseCountingThousand',
    /** Specifies the chinese legal simplified type. */
    ChineseLegalSimplified = 'chineseLegalSimplified',
    /** Specifies the japanese counting type. */
    JapaneseCounting = 'japaneseCounting',
    /** Specifies the japanese digital ten thousand type. */
    JapaneseDigitalTenThousand = 'japaneseDigitalTenThousand',
    /** Specifies the japanese legal type. */
    JapaneseLegal = 'japaneseLegal',
    /** Specifies the korean counting type. */
    KoreanCounting = 'koreanCounting',
    /** Specifies the korean digital type. */
    KoreanDigital = 'koreanDigital',
    /** Specifies the korean digital2 type. */
    KoreanDigital2 = 'koreanDigital2',
    /** Specifies the korean legal type. */
    KoreanLegal = 'koreanLegal',
    /** Specifies the aiueo type. */
    Aiueo = 'aiueo',
    /** Specifies the aiueo full width type. */
    AiueoFullWidth = 'aiueoFullWidth',
    /** Specifies the iroha type. */
    Iroha = 'iroha',
    /** Specifies the iroha full width type. */
    IrohaFullWidth = 'irohaFullWidth',
    /** Specifies the ganada type. */
    Ganada = 'ganada',
    /** Specifies the chosung type. */
    Chosung = 'chosung',
    /** Specifies the decimal enclosed circle type. */
    DecimalEnclosedCircle = 'decimalEnclosedCircle',
    /** Specifies the decimal full width type. */
    DecimalFullWidth = 'decimalFullWidth',
    /** Specifies the decimal half width type. */
    DecimalHalfWidth = 'decimalHalfWidth',
    /** Specifies the decimal enclosed fullstop type. */
    DecimalEnclosedFullstop = 'decimalEnclosedFullstop',
    /** Specifies the decimal enclosed paren type. */
    DecimalEnclosedParen = 'decimalEnclosedParen',
    /** Specifies the decimal enclosed circle chinese type. */
    DecimalEnclosedCircleChinese = 'decimalEnclosedCircleChinese',
    /** Specifies the ideograph enclosed circle type. */
    IdeographEnclosedCircle = 'ideographEnclosedCircle',
    /** Specifies the ideograph traditional type. */
    IdeographTraditional = 'ideographTraditional',
    /** Specifies the ideograph zodiac type. */
    IdeographZodiac = 'ideographZodiac',
    /** Specifies the ideograph zodiac traditional type. */
    IdeographZodiacTraditional = 'ideographZodiacTraditional',
    /** Specifies the taiwanese counting type. */
    TaiwaneseCounting = 'taiwaneseCounting',
    /** Specifies the taiwanese counting thousand type. */
    TaiwaneseCountingThousand = 'taiwaneseCountingThousand',
    /** Specifies the taiwanese digital type. */
    TaiwaneseDigital = 'taiwaneseDigital',
    /** Specifies the none type. */
    None = 'none',
    /** Specifies the custom type. */
    Custom = 'custom',
}

/**
 * Character inserted after the list label.
 *
 * @public
 */
export enum FollowCharacterType {
    /** Specifies the tab type. */
    Tab = 'tab',
    /** Specifies the space type. */
    Space = 'space',
    /** Specifies the nothing type. */
    Nothing = 'nothing',
}

/**
 * Horizontal alignment of the list number.
 *
 * @public
 */
export enum ListNumberAlignment {
    /** Specifies the left alignment. */
    Left = 'left',
    /** Specifies the center alignment. */
    Center = 'center',
    /** Specifies the right alignment. */
    Right = 'right',
}

// ---------------------------------------------------------------------------
// Pattern / wire maps
// ---------------------------------------------------------------------------

const PATTERN_TO_NUMFMT: { [key: string]: string } = {
    arabic: 'decimal',
    leadingZero: 'decimalZero',
    letter: 'upperLetter',
    letterLow: 'lowerLetter',
    roman: 'upperRoman',
    romanLow: 'lowerRoman',
    ordinal: 'ordinal',
    ordinalText: 'ordinalText',
    cardinalText: 'cardinalText',
    bullet: 'bullet',
    noNumber: 'none',
    none: 'none',
    hebrew1: 'hebrew1',
    hebrew2: 'hebrew2',
    hindiArabic: 'hindiNumbers',
    hindiCardinalText: 'hindiCounting',
    hindiLetter1: 'hindiVowels',
    hindiLetter2: 'hindiConsonants',
    chineseCounting: 'chineseCounting',
    chineseCountingThousand: 'chineseCountingThousand',
    chineseLegalSimplified: 'chineseLegalSimplified',
    japaneseCounting: 'japaneseCounting',
    japaneseDigitalTenThousand: 'japaneseDigitalTenThousand',
    japaneseLegal: 'japaneseLegal',
    koreanCounting: 'koreanCounting',
    koreanDigital: 'koreanDigital',
    koreanDigital2: 'koreanDigital2',
    koreanLegal: 'koreanLegal',
    aiueo: 'aiueo',
    aiueoFullWidth: 'aiueoFullWidth',
    iroha: 'iroha',
    irohaFullWidth: 'irohaFullWidth',
    ganada: 'ganada',
    chosung: 'chosung',
    decimalEnclosedCircle: 'decimalEnclosedCircle',
    decimalFullWidth: 'decimalFullWidth',
    decimalHalfWidth: 'decimalHalfWidth',
    decimalEnclosedFullstop: 'decimalEnclosedFullstop',
    decimalEnclosedParen: 'decimalEnclosedParen',
    decimalEnclosedCircleChinese: 'decimalEnclosedCircleChinese',
    ideographEnclosedCircle: 'ideographEnclosedCircle',
    ideographTraditional: 'ideographTraditional',
    ideographZodiac: 'ideographZodiac',
    ideographZodiacTraditional: 'ideographZodiacTraditional',
    taiwaneseCounting: 'taiwaneseCounting',
    taiwaneseCountingThousand: 'taiwaneseCountingThousand',
    taiwaneseDigital: 'taiwaneseDigital',
    farEast: 'ideographTraditional',
    special: 'bullet',
    custom: 'decimal'
};

const NUMFMT_TO_PATTERN: { [key: string]: ListPatternType } = {
    decimal: ListPatternType.Arabic,
    decimalZero: ListPatternType.LeadingZero,
    upperLetter: ListPatternType.Letter,
    lowerLetter: ListPatternType.LetterLow,
    upperRoman: ListPatternType.Roman,
    lowerRoman: ListPatternType.RomanLow,
    ordinal: ListPatternType.Ordinal,
    ordinalText: ListPatternType.OrdinalText,
    cardinalText: ListPatternType.CardinalText,
    bullet: ListPatternType.Bullet,
    none: ListPatternType.None,
    hebrew1: ListPatternType.Hebrew1,
    hebrew2: ListPatternType.Hebrew2,
    hindiNumbers: ListPatternType.HindiArabic,
    hindiCounting: ListPatternType.HindiCardinalText,
    hindiVowels: ListPatternType.HindiLetter1,
    hindiConsonants: ListPatternType.HindiLetter2,
    chineseCounting: ListPatternType.ChineseCounting,
    chineseCountingThousand: ListPatternType.ChineseCountingThousand,
    chineseLegalSimplified: ListPatternType.ChineseLegalSimplified,
    japaneseCounting: ListPatternType.JapaneseCounting,
    japaneseDigitalTenThousand: ListPatternType.JapaneseDigitalTenThousand,
    japaneseLegal: ListPatternType.JapaneseLegal,
    koreanCounting: ListPatternType.KoreanCounting,
    koreanDigital: ListPatternType.KoreanDigital,
    koreanDigital2: ListPatternType.KoreanDigital2,
    koreanLegal: ListPatternType.KoreanLegal,
    aiueo: ListPatternType.Aiueo,
    aiueoFullWidth: ListPatternType.AiueoFullWidth,
    iroha: ListPatternType.Iroha,
    irohaFullWidth: ListPatternType.IrohaFullWidth,
    ganada: ListPatternType.Ganada,
    chosung: ListPatternType.Chosung,
    decimalEnclosedCircle: ListPatternType.DecimalEnclosedCircle,
    decimalFullWidth: ListPatternType.DecimalFullWidth,
    decimalHalfWidth: ListPatternType.DecimalHalfWidth,
    decimalEnclosedFullstop: ListPatternType.DecimalEnclosedFullstop,
    decimalEnclosedParen: ListPatternType.DecimalEnclosedParen,
    decimalEnclosedCircleChinese: ListPatternType.DecimalEnclosedCircleChinese,
    ideographEnclosedCircle: ListPatternType.IdeographEnclosedCircle,
    ideographTraditional: ListPatternType.IdeographTraditional,
    ideographZodiac: ListPatternType.IdeographZodiac,
    ideographZodiacTraditional: ListPatternType.IdeographZodiacTraditional,
    taiwaneseCounting: ListPatternType.TaiwaneseCounting,
    taiwaneseCountingThousand: ListPatternType.TaiwaneseCountingThousand,
    taiwaneseDigital: ListPatternType.TaiwaneseDigital
};

function patternToNumFmt(pattern: ListPatternType): string {
    const mapped: string = ownGet(PATTERN_TO_NUMFMT, pattern);
    if (mapped !== undefined) {
        return mapped;
    }
    return 'decimal';
}

function numFmtToPattern(numFmt: string | undefined): ListPatternType {
    if (numFmt === undefined || numFmt.length === 0) {
        return ListPatternType.Arabic;
    }
    const mapped: ListPatternType = ownGet(NUMFMT_TO_PATTERN, numFmt);
    if (mapped !== undefined) {
        return mapped;
    }
    return ListPatternType.Custom;
}

function isListType(value: string): value is ListType {
    return value === ListType.Bulleted || value === ListType.Numbered;
}

function isListPatternType(value: string): boolean {
    return objectValues(ListPatternType as unknown as { [k: string]: string }).indexOf(value) !== -1;
}

function isFollowCharacterType(value: string): boolean {
    return (
        value === FollowCharacterType.Tab ||
    value === FollowCharacterType.Space ||
    value === FollowCharacterType.Nothing
    );
}

function isListNumberAlignment(value: string): boolean {
    return (
        value === ListNumberAlignment.Left ||
    value === ListNumberAlignment.Center ||
    value === ListNumberAlignment.Right
    );
}

function assertFiniteNumber(name: string, value: number): void {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new InvalidArgumentError(name + ' must be a finite number');
    }
}

function assertNonNegativePoints(name: string, value: number): void {
    assertFiniteNumber(name, value);
    if (value < 0) {
        throw new InvalidArgumentError(name + ' must be a non-negative number of points');
    }
}

function twipAttr(el: OpenXmlElement | undefined, localName: string): number | undefined {
    if (el === undefined) {
        return undefined;
    }
    for (const attribute of el.attributes) {
        if (attribute !== undefined && attribute.localName === localName) {
            const n: number = parseInt(attribute.value, 10);
            if (Number.isFinite(n)) {
                return n;
            }
            return undefined;
        }
    }
    return undefined;
}

function setTwipAttr(el: OpenXmlElement, localName: string, twips: number): OpenXmlElement {
    const attrs: OpenXmlAttribute[] = el.attributes.slice();
    let found: boolean = false;
    for (let i: number = 0; i < attrs.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const attr: OpenXmlAttribute = attrs[i];
        if (attr !== undefined && attr.localName === localName) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            attrs[i] = wmlAttr(localName, String(twips));
            found = true;
            break;
        }
    }
    if (!found) {
        attrs.push(wmlAttr(localName, String(twips)));
    }
    return wmlElement(el.localName, {
        attributes: attrs,
        children: el.children.slice() as any
    });
}

function ensureIndInPPr(pPr: OpenXmlElement | undefined): OpenXmlElement {
    if (pPr === undefined) {
        return wmlElement('pPr', {
            children: [wmlElement('ind', { attributes: [] })]
        });
    }
    const kids: OpenXmlElement[] = elementChildren(pPr).slice();
    let hasInd: boolean = false;
    for (const element of kids) {
        if (isWml(element, 'ind')) {
            hasInd = true;
            break;
        }
    }
    if (!hasInd) {
        kids.push(wmlElement('ind', { attributes: [] }));
    }
    return wmlElement('pPr', {
        attributes: pPr.attributes.slice(),
        children: kids as any
    });
}

function findInd(pPr: OpenXmlElement | undefined): OpenXmlElement | undefined {
    if (pPr === undefined) {
        return undefined;
    }
    const kids: ReadonlyArray<OpenXmlElement> = elementChildren(pPr);
    for (const element of kids) {
        if (isWml(element, 'ind')) {
            return element;
        }
    }
    return undefined;
}

function replaceInd(pPr: OpenXmlElement, ind: OpenXmlElement): OpenXmlElement {
    const kids: OpenXmlElement[] = elementChildren(pPr).slice();
    let replaced: boolean = false;
    for (let i: number = 0; i < kids.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        if (isWml(kids[i]!, 'ind')) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            kids[i] = ind;
            replaced = true;
            break;
        }
    }
    if (!replaced) {
        kids.push(ind);
    }
    return wmlElement('pPr', {
        attributes: pPr.attributes.slice(),
        children: kids as any
    });
}

/**
 * Split `w:lvlText` around this level's own token (`%(ilvl+1)`).
 * Nested prior-level tokens (`%1` in level 2's `%1.%2.%3.`) belong in the prefix.
 * When `levelNumber` is omitted, falls back to the first `%n` (legacy).
 *
 * @param {string | undefined} lvlText - Specifies the lvl text.
 * @param {number} levelNumber - Specifies the level number.
 * @returns {Object} Returns the result.
 */
function splitLevelText(
    lvlText: string | undefined,
    levelNumber?: number
): { prefix: string; body: string; suffix: string } {
    if (lvlText === undefined || lvlText.length === 0) {
        return { prefix: '', body: '', suffix: '' };
    }
    let match: RegExpExecArray | null = null;
    if (levelNumber !== undefined && levelNumber >= 0 && levelNumber <= 8) {
        const token: string = '%' + String(levelNumber + 1);
        const idx: number = lvlText.indexOf(token);
        if (idx >= 0) {
            return {
                prefix: lvlText.substring(0, idx),
                body: token,
                suffix: lvlText.substring(idx + token.length)
            };
        }
    }
    match = /%([1-9])/.exec(lvlText);
    if (match === null || match.index === undefined) {
        return { prefix: '', body: lvlText, suffix: '' };
    }
    const start: number = match.index;
    const end: number = start + match[0].length;
    return {
        prefix: lvlText.substring(0, start),
        body: lvlText.substring(start, end),
        suffix: lvlText.substring(end)
    };
}

function rebuildLevelText(prefix: string, body: string, suffix: string): string {
    return prefix + body + suffix;
}

/**
 * Word encodes prior-level placeholders in `NumberPrefix`/`NumberSuffix` as
 * U+0000..U+0008 (level 0..8). OOXML `w:lvlText` uses `%1`..`%9`. Raw NULs are
 * illegal in XML 1.0 attributes and corrupt the package — convert both ways.
 *
 * @param {string} value - Specifies the value.
 * @returns {string} Returns the result.
 */
function docioLevelPlaceholdersToOoxml(value: string): string {
    let result: string = '';
    for (let i: number = 0; i < value.length; i++) {
        const code: number = value.charCodeAt(i);
        if (code >= 0 && code <= 8) {
            result += '%' + String(code + 1);
        } else {
            result += value.charAt(i);
        }
    }
    return result;
}

function ooxmlLevelPlaceholdersToDocio(value: string): string {
    let result: string = '';
    let i: number = 0;
    while (i < value.length) {
        if (value.charAt(i) === '%' && i + 1 < value.length) {
            const digit: string = value.charAt(i + 1);
            if (digit >= '1' && digit <= '9') {
                result += String.fromCharCode(digit.charCodeAt(0) - '1'.charCodeAt(0));
                i += 2;
                continue;
            }
        }
        result += value.charAt(i);
        i += 1;
    }
    return result;
}

// ---------------------------------------------------------------------------
// ListLevel
// ---------------------------------------------------------------------------

/**
 * Represents a level of a list and its formatting.
 *
 * @public
 */
export class ListLevel implements CharacterFormatHost, ParagraphFormatHost {
    private readonly owner: ListStyle;
    private readonly level: NumberingLevel;
    private readonly characterFormatValue: CharacterFormat;
    private readonly paragraphFormatValue: ParagraphFormat;
    private suppressDirty: boolean;

    /**
     * @param {ListStyle} owner - The owner.
     * @param {NumberingLevel} level - The level.
     * @private
     */
    constructor(owner: ListStyle, level: NumberingLevel) {
        this.owner = owner;
        this.level = level;
        this.suppressDirty = false;
        this.characterFormatValue = new CharacterFormat(this);
        this.paragraphFormatValue = new ParagraphFormat(this);
        this.hydrateFormatsFromLevel();
    }

    /**
     * Gets the owning list style.
     */
    get listStyle(): ListStyle {
        return this.owner;
    }

    /**
     * Gets the zero-based level index.
     */
    get levelNumber(): number {
        return this.level.ilvl;
    }

    /**
     * Gets or sets the numbering pattern type of the list level.
     */
    get patternType(): ListPatternType {
        return numFmtToPattern(this.level.numFmt);
    }
    set patternType(value: ListPatternType) {
        if (typeof value !== 'string' || !isListPatternType(value)) {
            throw new InvalidArgumentError('patternType must be a ListPatternType value');
        }
        this.level.setNumFmt(patternToNumFmt(value));
        if (value === ListPatternType.Bullet) {
            const text: string = this.level.lvlText;
            if (text === undefined || text.indexOf('%') >= 0) {
                this.level.setLvlText('\uf0b7');
            }
        } else if (value !== ListPatternType.NoNumber && value !== ListPatternType.None) {
            const parts: { prefix: string; body: string; suffix: string; } = splitLevelText(this.level.lvlText, this.level.ilvl);
            if (parts.body.length === 0 || parts.body.indexOf('%') < 0) {
                const token: string = '%' + String(this.level.ilvl + 1);
                this.level.setLvlText(rebuildLevelText(parts.prefix, token, parts.suffix.length > 0 ? parts.suffix : '.'));
            }
        }
        this.markDirty();
    }

    /**
     * Gets or sets the number at which the numbering of the list level starts.
     */
    get startAt(): number {
        const s: number = this.level.start;
        return s !== undefined ? s : 1;
    }
    set startAt(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value) || Math.floor(value) !== value || value < 0) {
            throw new InvalidArgumentError('startAt must be a non-negative integer');
        }
        this.level.setStart(value);
        this.markDirty();
    }

    /**
     * Gets or sets the level text pattern that defines how the number is displayed (for example, `%1.`).
     */
    get levelText(): string {
        const t: string = this.level.lvlText;
        return t !== undefined ? t : '';
    }
    set levelText(value: string) {
        if (typeof value !== 'string') {
            throw new InvalidArgumentError('levelText must be a string');
        }
        this.level.setLvlText(value);
        this.markDirty();
    }

    /**
     * Gets or sets the text that is displayed before the number of the list level.
     */
    get numberPrefix(): string {
        return ooxmlLevelPlaceholdersToDocio(splitLevelText(this.level.lvlText, this.level.ilvl).prefix);
    }
    set numberPrefix(value: string) {
        if (typeof value !== 'string') {
            throw new InvalidArgumentError('numberPrefix must be a string');
        }
        const parts: { prefix: string; body: string; suffix: string; } = splitLevelText(this.level.lvlText, this.level.ilvl);
        let body: string = parts.body;
        if (body.length === 0 || body.indexOf('%') < 0) {
            body = this.level.numFmt === 'bullet' ? '\uf0b7' : '%' + String(this.level.ilvl + 1);
        }
        const prefix: string = docioLevelPlaceholdersToOoxml(value);
        this.level.setLvlText(rebuildLevelText(prefix, body, parts.suffix));
        this.markDirty();
    }

    /**
     * Gets or sets the text that is displayed after the number of the list level.
     */
    get numberSuffix(): string {
        return ooxmlLevelPlaceholdersToDocio(splitLevelText(this.level.lvlText, this.level.ilvl).suffix);
    }
    set numberSuffix(value: string) {
        if (typeof value !== 'string') {
            throw new InvalidArgumentError('numberSuffix must be a string');
        }
        const parts: { prefix: string; body: string; suffix: string; } = splitLevelText(this.level.lvlText, this.level.ilvl);
        let body: string = parts.body;
        if (body.length === 0 || body.indexOf('%') < 0) {
            body = this.level.numFmt === 'bullet' ? '\uf0b7' : '%' + String(this.level.ilvl + 1);
        }
        const suffix: string = docioLevelPlaceholdersToOoxml(value);
        this.level.setLvlText(rebuildLevelText(parts.prefix, body, suffix));
        this.markDirty();
    }

    /**
     * Gets or sets the bullet character used when the list level is a bullet list.
     */
    get bulletCharacter(): string {
        if (this.level.numFmt !== 'bullet') {
            return '';
        }
        const t: string = this.level.lvlText;
        return t !== undefined ? t : '';
    }
    set bulletCharacter(value: string) {
        if (typeof value !== 'string') {
            throw new InvalidArgumentError('bulletCharacter must be a string');
        }
        this.level.setNumFmt('bullet');
        this.level.setLvlText(value);
        this.markDirty();
    }

    /**
     * Gets or sets the character that follows the number or bullet of the list level.
     */
    get followCharacter(): FollowCharacterType {
        const suff: OpenXmlElement = this.level.findExtra('suff');
        const val: string = suff !== undefined ? wValAttribute(suff) : undefined;
        if (val === 'space') {
            return FollowCharacterType.Space;
        }
        if (val === 'nothing') {
            return FollowCharacterType.Nothing;
        }
        return FollowCharacterType.Tab;
    }
    set followCharacter(value: FollowCharacterType) {
        if (typeof value !== 'string' || !isFollowCharacterType(value)) {
            throw new InvalidArgumentError('followCharacter must be a FollowCharacterType value');
        }
        let wire: string = 'tab';
        if (value === FollowCharacterType.Space) {
            wire = 'space';
        } else if (value === FollowCharacterType.Nothing) {
            wire = 'nothing';
        }
        this.level.setExtraElement('suff', wmlElement('suff', { attributes: [wmlAttr('val', wire)] }));
        this.markDirty();
    }

    /**
     * Gets or sets the alignment of the number or bullet within its allotted space.
     */
    get numberAlignment(): ListNumberAlignment {
        const jc: string = this.level.lvlJc;
        if (jc === 'center') {
            return ListNumberAlignment.Center;
        }
        if (jc === 'right') {
            return ListNumberAlignment.Right;
        }
        return ListNumberAlignment.Left;
    }
    set numberAlignment(value: ListNumberAlignment) {
        if (typeof value !== 'string' || !isListNumberAlignment(value)) {
            throw new InvalidArgumentError('numberAlignment must be a ListNumberAlignment value');
        }
        this.level.setLvlJc(value);
        this.markDirty();
    }

    /**
     * Gets or sets the tab space, in points, between the number and the text.
     */
    get tabSpaceAfter(): number {
        const pPr: OpenXmlElement = this.level.findExtra('pPr');
        if (pPr === undefined) {
            return 0;
        }
        const tabs: ReadonlyArray<OpenXmlElement> = elementChildren(pPr);
        for (const child of tabs) {
            if (!isWml(child, 'tabs')) {
                continue;
            }
            const tabKids: ReadonlyArray<OpenXmlElement> = elementChildren(child);
            for (const tab of tabKids) {
                if (!isWml(tab, 'tab')) {
                    continue;
                }
                const pos: number = twipAttr(tab, 'pos');
                if (pos !== undefined) {
                    return twipsToPoint(pos);
                }
            }
        }
        return 0;
    }
    set tabSpaceAfter(value: number) {
        assertNonNegativePoints('tabSpaceAfter', value);
        const twips: number = pointToTwips(value);
        let pPr: OpenXmlElement = this.level.findExtra('pPr');
        if (pPr === undefined) {
            pPr = wmlElement('pPr', { children: [] });
        }
        const kids: OpenXmlElement[] = elementChildren(pPr).slice().filter((el: OpenXmlElement) => !isWml(el, 'tabs'));
        kids.push(
            wmlElement('tabs', {
                children: [
                    wmlElement('tab', {
                        attributes: [wmlAttr('val', 'left'), wmlAttr('pos', String(twips))]
                    })
                ]
            })
        );
        this.level.setExtraElement(
            'pPr',
            wmlElement('pPr', { attributes: pPr.attributes.slice(), children: kids as any })
        );
        this.suppressDirty = true;
        try {
            this.paragraphFormatValue.hydrate(paragraphSnapshotFromPPr(this.level.findExtra('pPr')));
        } finally {
            this.suppressDirty = false;
        }
        this.markDirty();
    }

    /**
     * Gets or sets the position, in points, of the number or bullet relative to the left margin.
     */
    get numberPosition(): number {
        const ind: OpenXmlElement = findInd(this.level.findExtra('pPr'));
        const left: number = twipAttr(ind, 'left');
        const hanging: number = twipAttr(ind, 'hanging');
        if (left === undefined) {
            return 0;
        }
        const hang: number = hanging !== undefined ? hanging : 0;
        return twipsToPoint(left - hang);
    }
    set numberPosition(value: number) {
        assertFiniteNumber('numberPosition', value);
        const numberTwips: number = pointToTwips(value);
        let pPr: OpenXmlElement = ensureIndInPPr(this.level.findExtra('pPr'));
        let ind: OpenXmlElement = findInd(pPr)!;
        const hanging: number = twipAttr(ind, 'hanging');
        const hang: number = hanging !== undefined ? hanging : 0;
        ind = setTwipAttr(ind, 'left', numberTwips + hang);
        pPr = replaceInd(pPr, ind);
        this.level.setExtraElement('pPr', pPr);
        this.suppressDirty = true;
        try {
            this.paragraphFormatValue.hydrate(paragraphSnapshotFromPPr(pPr));
        } finally {
            this.suppressDirty = false;
        }
        this.markDirty();
    }

    /**
     * Gets or sets the position, in points, of the text relative to the left margin.
     */
    get textPosition(): number {
        const ind: OpenXmlElement = findInd(this.level.findExtra('pPr'));
        const left: number = twipAttr(ind, 'left');
        return left !== undefined ? twipsToPoint(left) : 0;
    }
    set textPosition(value: number) {
        assertFiniteNumber('textPosition', value);
        const leftTwips: number = pointToTwips(value);
        let pPr: OpenXmlElement = ensureIndInPPr(this.level.findExtra('pPr'));
        let ind: OpenXmlElement = findInd(pPr)!;
        const numberPosTwips: number = pointToTwips(this.numberPosition);
        let hanging: number = leftTwips - numberPosTwips;
        if (hanging < 0) {
            hanging = 0;
        }
        ind = setTwipAttr(ind, 'left', leftTwips);
        ind = setTwipAttr(ind, 'hanging', hanging);
        pPr = replaceInd(pPr, ind);
        this.level.setExtraElement('pPr', pPr);
        this.suppressDirty = true;
        try {
            this.paragraphFormatValue.hydrate(paragraphSnapshotFromPPr(pPr));
        } finally {
            this.suppressDirty = false;
        }
        this.markDirty();
    }

    /**
     * Gets or sets the zero-based index of the list level after which the numbering of this level restarts.
     */
    get restartLevel(): number {
        const el: OpenXmlElement = this.level.findExtra('lvlRestart');
        const val: string = el !== undefined ? wValAttribute(el) : undefined;
        if (val === undefined || !/^\d+$/.test(val)) {
            return this.level.ilvl;
        }
        return parseInt(val, 10);
    }
    set restartLevel(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value) || Math.floor(value) !== value || value < 0 || value > 8) {
            throw new InvalidArgumentError('restartLevel must be an integer from 0 through 8');
        }
        this.level.setExtraElement(
            'lvlRestart',
            wmlElement('lvlRestart', { attributes: [wmlAttr('val', String(value))] })
        );
        this.markDirty();
    }

    /**
     * Gets or sets a value indicating whether the numbers of this level are displayed in Arabic numerals, even if the previous levels use another numbering style.
     */
    get isLegalStyleNumbering(): boolean {
        return this.level.isLgl === true;
    }
    set isLegalStyleNumbering(value: boolean) {
        if (typeof value !== 'boolean') {
            throw new InvalidArgumentError('isLegalStyleNumbering must be a boolean');
        }
        this.level.setIsLgl(value ? true : undefined);
        this.markDirty();
    }

    /**
     * Gets or sets the name of the paragraph style that is linked to the list level.
     */
    get linkedParagraphStyleName(): string {
        const el: OpenXmlElement = this.level.findExtra('pStyle');
        const val: string = el !== undefined ? wValAttribute(el) : undefined;
        return val !== undefined ? val : '';
    }
    set linkedParagraphStyleName(value: string) {
        if (typeof value !== 'string') {
            throw new InvalidArgumentError('linkedParagraphStyleName must be a string');
        }
        const trimmed: string = value.trim();
        if (trimmed.length === 0) {
            this.level.setExtraElement('pStyle', undefined);
        } else {
            this.level.setExtraElement(
                'pStyle',
                wmlElement('pStyle', { attributes: [wmlAttr('val', trimmed)] })
            );
        }
        this.markDirty();
    }

    /**
     * Gets the character formatting of the number or bullet of the list level.
     */
    get characterFormat(): CharacterFormat {
        return this.characterFormatValue;
    }

    /**
     * Gets the paragraph formatting of the paragraphs that use the list level.
     */
    get paragraphFormat(): ParagraphFormat {
        return this.paragraphFormatValue;
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    notifyCharacterFormatMutation(): void {
        if (this.suppressDirty) {
            return;
        }
        const children: any = (this.characterFormatValue as any).buildRPrChildren
            ? (this.characterFormatValue as any).buildRPrChildren()
            : undefined;
        let rPrChildren: any[] = [];
        if (children !== undefined) {
            rPrChildren = children;
        } else {
            const snap: any = (this.characterFormatValue as any).snapshot
                ? (this.characterFormatValue as any).snapshot()
                : undefined;
            if (snap !== undefined) {
                // Fall back: serialize via temporary rPr using existing parse path reverse
                rPrChildren = buildRPrChildrenSafe(this.characterFormatValue);
            }
        }
        if (rPrChildren.length === 0) {
            this.level.setExtraElement('rPr', undefined);
        } else {
            this.level.setExtraElement('rPr', wmlElement('rPr', { children: rPrChildren }));
        }
        this.markDirty();
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    notifyParagraphFormatMutation(): void {
        if (this.suppressDirty) {
            return;
        }
        const children: OpenXmlElement[] = this.paragraphFormatValue.buildPPrChildren();
        if (children.length === 0) {
            this.level.setExtraElement('pPr', undefined);
        } else {
            this.level.setExtraElement('pPr', wmlElement('pPr', { children: children as any }));
        }
        this.markDirty();
    }

    private hydrateFormatsFromLevel(): void {
        this.suppressDirty = true;
        try {
            const rPr: OpenXmlElement = this.level.findExtra('rPr');
            this.characterFormatValue.hydrate(
                rPr !== undefined ? characterSnapshotFromRPr(rPr) : parseCharacterFormat(wmlElement('rPr'))
            );
            const pPr: OpenXmlElement = this.level.findExtra('pPr');
            this.paragraphFormatValue.hydrate(
                pPr !== undefined ? paragraphSnapshotFromPPr(pPr) : emptyParagraphFormatSnapshot()
            );
        } finally {
            this.suppressDirty = false;
        }
    }

    private markDirty(): void {
        this.owner.markNumberingDirty();
    }
}

function buildRPrChildrenSafe(cf: CharacterFormat): OpenXmlElement[] {
    // CharacterFormat exposes buildRPrChildrenFromSnapshot on the class in this codebase.
    const anyCf: any = cf as any;
    if (typeof anyCf.buildRPrChildren === 'function') {
        return anyCf.buildRPrChildren();
    }
    if (typeof anyCf.snapshot === 'function' && typeof anyCf.constructor.buildRPrChildrenFromSnapshot === 'function') {
        return anyCf.constructor.buildRPrChildrenFromSnapshot(anyCf.snapshot());
    }
    // Try module-level pattern used elsewhere: serialize by re-reading after hydrate path
    return [];
}

// ---------------------------------------------------------------------------
// ListLevelCollection / ListStyle
// ---------------------------------------------------------------------------

/**
 * Nine-level collection for a {@link ListStyle}.
 *
 * @public
 */
export class ListLevelCollection {
    private readonly items: ListLevel[];

    /**
     * @param {ListLevel[]} items - The items.
     * @private
     */
    constructor(items: ListLevel[]) {
        this.items = items;
    }

    get count(): number {
        return this.items.length;
    }

    getItem(index: number): ListLevel {
        if (typeof index !== 'number' || !Number.isFinite(index) || Math.floor(index) !== index || index < 0 || index > 8) {
            throw new InvalidArgumentError('level index must be an integer from 0 through 8');
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const item: ListLevel = this.items[index];
        if (item === undefined) {
            throw new DocxError('content/invalid-num-id', 'List level ' + String(index) + ' is not defined');
        }
        return item;
    }
}

/**
 * Public custom list style facade.
 *
 * @public
 */
export class ListStyle {
    private readonly document: WordDocument;
    private readonly styleIdValue: string;
    private readonly displayName: string;
    private readonly listTypeValue: ListType;
    private readonly abstractNumId: number;
    private readonly levelsValue: ListLevelCollection;

    /**
     * @param {Object} init - The init.
     * @private
     */
    constructor(init: {
        document: WordDocument;
        styleId: string;
        displayName: string;
        listType: ListType;
        abstractNumId: number;
        levels: ListLevel[];
    }) {
        this.document = init.document;
        this.styleIdValue = init.styleId;
        this.displayName = init.displayName;
        this.listTypeValue = init.listType;
        this.abstractNumId = init.abstractNumId;
        this.levelsValue = new ListLevelCollection(init.levels);
    }

    get name(): string {
        return this.displayName;
    }

    get listType(): ListType {
        return this.listTypeValue;
    }

    get levels(): ListLevelCollection {
        return this.levelsValue;
    }

    /**
     * @private
     */
    get styleId(): string {
        return this.styleIdValue;
    }

    /**
     * @private
     */
    get abstractId(): number {
        return this.abstractNumId;
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    markNumberingDirty(): void {
        numberingCatalog(this.document).markDirty();
    }
}

const listStyleByAbstract: WeakMap<object, ListStyle> = new WeakMap<object, ListStyle>();

/**
 * Create a custom list style on the document.
 *
 * @param {WordDocument} document - The document.
 * @param {ListType} listType - The list type.
 * @param {string} styleName - The style name.
 * @returns {ListStyle} The result.
 * @private
 */
function addListStyle(document: WordDocument, listType: ListType, styleName: string): ListStyle {
    if (typeof listType !== 'string' || !isListType(listType)) {
        throw new InvalidArgumentError('listType must be ListType.Bulleted or ListType.Numbered');
    }
    if (typeof styleName !== 'string' || styleName.trim().length === 0) {
        throw new InvalidArgumentError('styleName must be a non-empty string');
    }
    const name: string = styleName.trim();
    const styles: StyleCollection = styleCollectionFor(document);
    if (styles.findByName(name) !== undefined || styles.getStyle(name) !== undefined) {
        throw new DocxError('styles/duplicate-style', 'A style named "' + name + '" already exists');
    }
    let styleId: string = sanitizeStyleIdPublic(name);
    if (styleId.length === 0) {
        styleId = 'ListStyle';
    }
    if (styles.getStyle(styleId) !== undefined) {
        throw new DocxError('styles/duplicate-style', 'A style with id "' + styleId + '" already exists');
    }

    const numbering: NumberingCatalog = numberingCatalog(document);
    const abstractNumId: number = numbering.allocateAbstractNumId();
    const format: ListFormatType = listType === ListType.Bulleted ? 'bullet' : 'decimal';
    const abstract: AbstractNumbering = createDefaultAbstractNumbering(abstractNumId, format);
    abstract.setName(name);
    abstract.setStyleLink(styleId);
    numbering.registerAbstract(abstract);

    const shell: DocxStyle = new DocxStyle(styleId, 'numbering', undefined, true, [
        wmlElement('name', { attributes: [wmlAttr('val', name)] })
    ]);
    // Force OpaqueStyle numbering entry via addStyle
    styles.addStyle(shell);
    const live: Style = styles.getStyle(styleId);
    if (live === undefined) {
    // addStyle may no-op if race; ensure via direct path
        throw new DocxError('styles/undefined-style', 'Failed to register list style "' + name + '"');
    }

    const levelFacades: ListLevel[] = [];
    const listStyle: ListStyle = new ListStyle({
        document: document,
        styleId: styleId,
        displayName: name,
        listType: listType,
        abstractNumId: abstractNumId,
        levels: levelFacades
    });
    for (const lvl of abstract.levels) {
        levelFacades.push(new ListLevel(listStyle, lvl));
    }
    // Rebuild collection with filled levels
    (listStyle as any).levelsValue = new ListLevelCollection(levelFacades);
    listStyleByAbstract.set(abstract as any, listStyle);
    return listStyle;
}

function sanitizeStyleIdPublic(name: string): string {
    let out: string = '';
    for (let i: number = 0; i < name.length; i += 1) {
        const ch: string = name.charAt(i);
        const code: number = name.charCodeAt(i);
        const isLetter: boolean =
      (code >= 65 && code <= 90) ||
      (code >= 97 && code <= 122) ||
      code > 127;
        const isDigit: boolean = code >= 48 && code <= 57;
        if (isLetter || isDigit) {
            out += ch;
        }
    }
    return out;
}

/**
 * Resolve abstract num id for a numbering style (styleLink / name).
 *
 * @param {NumberingCatalog} numbering - The numbering.
 * @param {string} styleId - The style id.
 * @param {string | undefined} displayName - The display name.
 * @returns {number | undefined} The result.
 * @private
 */
export function findAbstractForListStyle(
    numbering: NumberingCatalog,
    styleId: string,
    displayName: string | undefined
): number | undefined {
    for (const abs of numbering.abstractNumberings) {
        if (abs.styleLink === styleId || (displayName !== undefined && abs.styleLink === displayName)) {
            return abs.abstractNumId;
        }
        if (abs.name === styleId || (displayName !== undefined && abs.name === displayName)) {
            return abs.abstractNumId;
        }
    }
    return undefined;
}

// Wire WordDocument.addListStyle without importing numbering/index at module top.
Object.defineProperty(WordDocument.prototype, 'addListStyle', {
    value(this: WordDocument, listType: ListType, styleName: string): ListStyle {
        return addListStyle(this, listType, styleName);
    },
    writable: true,
    configurable: true
});
