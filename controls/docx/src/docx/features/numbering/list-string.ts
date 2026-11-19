/**
 * Pure list label computation for {@link Paragraph.listString}.
 *
 * @private
 */
import { visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { Paragraph } from '../document/paragraph';
import { WordDocument } from '../document/document';
import { NumberingLevel } from './numbering-level';
import { NumberingInstance, NumberingLevelOverride } from './numbering-instance';
import { AbstractNumbering } from './abstract-numbering';
import { numberingFor } from './index';
import { OpenXmlElement, OpenXmlAttribute } from '../../core/xml/model';

/** Minimal numbering catalog for label computation. */
interface NumberingCatalog {
    getNumbering(numId: number): NumberingInstance | undefined;
    getAbstractNumbering(abstractNumId: number): AbstractNumbering | undefined;
}

function numberingCatalog(document: WordDocument): NumberingCatalog {
    return numberingFor(document);
}

/**
 * Compute the display string for a paragraph's list label without mutating state.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {string} The result.
 * @private
 */
export function computeListString(paragraph: Paragraph): string {
    const listId: number = paragraph.numId;
    if (listId === undefined) {
        return '';
    }
    let doc: WordDocument;
    try {
        doc = paragraph.owningDocument();
    } catch {
        return '';
    }
    let numbering: NumberingCatalog;
    try {
        numbering = numberingCatalog(doc);
    } catch {
        return '';
    }
    const instance: NumberingInstance = numbering.getNumbering(listId);
    if (instance === undefined) {
        return '';
    }
    const abstract: AbstractNumbering = numbering.getAbstractNumbering(instance.abstractNumId);
    if (abstract === undefined) {
        return '';
    }

    const targetLevel: number = paragraph.listLevel !== undefined ? paragraph.listLevel : 0;
    const counters: Map<string, number[]> = new Map<string, number[]>();

    let result: string = '';
    visitParagraphsInDocumentOrder(doc, (p: Paragraph) => {
        if (p.numId === undefined) {
            return;
        }
        const numId: number = p.numId;
        const inst: NumberingInstance = numbering.getNumbering(numId);
        if (inst === undefined) {
            return;
        }
        const abs: AbstractNumbering = numbering.getAbstractNumbering(inst.abstractNumId);
        if (abs === undefined) {
            return;
        }
        const ilvl: number = p.listLevel !== undefined ? p.listLevel : 0;
        const key: string = String(numId);
        let state: number[] = counters.get(key);
        if (state === undefined) {
            state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // Initialize from start values
            for (let i: number = 0; i < 9; i += 1) {
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                state[i] = resolveStart(inst, abs.levels, i) - 1;
            }
            counters.set(key, state);
        }

        // Restart deeper levels when a shallower level advances
        for (let i: number = ilvl + 1; i < 9; i += 1) {
            const restart: number = resolveRestartLevel(abs.levels, i);
            if (restart <= ilvl) {
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                state[i] = resolveStart(inst, abs.levels, i) - 1;
            }
        }

        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        state[ilvl] = (state[ilvl] !== undefined ? state[ilvl]! : 0) + 1;

        if (p === paragraph) {
            result = renderLabel(abs.levels, inst, ilvl, state);
        }
    });

    return result;
}

Object.defineProperty(Paragraph.prototype, 'listString', {
    get(this: Paragraph): string {
        return computeListString(this);
    },
    configurable: true
});

function resolveStart(
    instance: NumberingInstance,
    levels: ReadonlyArray<NumberingLevel>,
    ilvl: number
): number {
    const override: NumberingLevelOverride = instance.levelOverrides.find((entry: NumberingLevelOverride) => entry.ilvl === ilvl);
    if (override !== undefined && override.startOverride !== undefined) {
        return override.startOverride;
    }
    const level: NumberingLevel = resolveLevel(instance, levels, ilvl);
    if (level !== undefined && level.start !== undefined) {
        return level.start;
    }
    return 1;
}

function resolveRestartLevel(levels: ReadonlyArray<NumberingLevel>, ilvl: number): number {
    const level: NumberingLevel = levels.find((entry: NumberingLevel) => entry.ilvl === ilvl);
    if (level === undefined) {
        return ilvl;
    }
    const extras: ReadonlyArray<OpenXmlElement> = level.getExtras();
    for (const extra of extras) {
        if (extra.localName === 'lvlRestart') {
            for (const attr of extra.attributes) {
                if (attr.localName === 'val' && /^\d+$/.test(attr.value)) {
                    return parseInt(attr.value, 10);
                }
            }
        }
    }
    return ilvl;
}

function resolveLevel(
    instance: NumberingInstance,
    levels: ReadonlyArray<NumberingLevel>,
    ilvl: number
): NumberingLevel | undefined {
    const override: NumberingLevelOverride = instance.levelOverrides.find((entry: NumberingLevelOverride) => entry.ilvl === ilvl);
    if (override !== undefined && override.level !== undefined) {
        return override.level;
    }
    const found: NumberingLevel = levels.find((entry: NumberingLevel) => entry.ilvl === ilvl);
    if (found !== undefined) {
        return found;
    }
    return levels.length > 0 ? levels[0] : undefined;
}

function renderLabel(
    levels: ReadonlyArray<NumberingLevel>,
    instance: NumberingInstance,
    ilvl: number,
    counters: number[]
): string {
    const level: NumberingLevel = resolveLevel(instance, levels, ilvl);
    if (level === undefined) {
        return '';
    }
    const numFmt: string = level.numFmt !== undefined ? level.numFmt : 'decimal';
    if (numFmt === 'bullet') {
        return level.lvlText !== undefined ? level.lvlText : '';
    }
    if (numFmt === 'none') {
        return '';
    }

    const pattern: string = level.lvlText !== undefined ? level.lvlText : '%' + String(ilvl + 1);
    const isLegal: boolean = level.isLgl === true;

    // Expand %1..%9
    let out: string = '';
    for (let i: number = 0; i < pattern.length; i += 1) {
        const ch: string = pattern.charAt(i);
        if (ch === '%' && i + 1 < pattern.length) {
            const digit: string = pattern.charAt(i + 1);
            if (digit >= '1' && digit <= '9') {
                const idx: number = parseInt(digit, 10) - 1;
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const n: number = counters[idx] !== undefined ? counters[idx]! : 0;
                let fmt: string = numFmt;
                if (idx !== ilvl) {
                    const other: NumberingLevel = resolveLevel(instance, levels, idx);
                    fmt = other !== undefined && other.numFmt !== undefined ? other.numFmt : 'decimal';
                }
                if (isLegal) {
                    fmt = 'decimal';
                }
                out += formatNumber(n, fmt);
                i += 1;
                continue;
            }
        }
        out += ch;
    }
    return out;
}

function formatNumber(n: number, numFmt: string): string {
    if (n < 0) {
        n = 0;
    }
    switch (numFmt) {
    case 'decimal':
        return String(n);
    case 'decimalZero':
        return n < 10 ? '0' + String(n) : String(n);
    case 'upperRoman':
        return toRoman(n).toUpperCase();
    case 'lowerRoman':
        return toRoman(n).toLowerCase();
    case 'upperLetter':
        return toLetters(n).toUpperCase();
    case 'lowerLetter':
        return toLetters(n).toLowerCase();
    case 'ordinal':
        return toOrdinal(n);
    case 'ordinalText':
        return toOrdinalText(n);
    case 'cardinalText':
        return toCardinalText(n);
    case 'bullet':
        return '';
    case 'none':
        return '';
    case 'decimalEnclosedParen':
        return '(' + String(n) + ')';
    case 'decimalEnclosedFullstop':
        return String(n) + '.';
    case 'decimalEnclosedCircle':
    case 'decimalEnclosedCircleChinese':
        return enclosedCircle(n);
    case 'decimalFullWidth':
        return toFullWidthDecimal(n);
    case 'decimalHalfWidth':
        return String(n);
    case 'hebrew1':
    case 'hebrew2':
        return toHebrew(n);
    case 'hindiNumbers':
        return toHindiDigits(n);
    case 'hindiCounting':
        return toCardinalText(n);
    case 'hindiVowels':
    case 'hindiConsonants':
        return toLetters(n).toLowerCase();
    case 'chineseCounting':
    case 'chineseCountingThousand':
    case 'chineseLegalSimplified':
    case 'japaneseCounting':
    case 'japaneseDigitalTenThousand':
    case 'japaneseLegal':
    case 'koreanCounting':
    case 'koreanDigital':
    case 'koreanDigital2':
    case 'koreanLegal':
    case 'taiwaneseCounting':
    case 'taiwaneseCountingThousand':
    case 'taiwaneseDigital':
    case 'ideographTraditional':
    case 'ideographZodiac':
    case 'ideographZodiacTraditional':
    case 'ideographEnclosedCircle':
        return String(n);
    case 'aiueo':
    case 'aiueoFullWidth':
        return toAiueo(n);
    case 'iroha':
    case 'irohaFullWidth':
        return toIroha(n);
    case 'ganada':
    case 'chosung':
        return toLetters(n).toLowerCase();
    default:
        return String(n);
    }
}

function toRoman(num: number): string {
    if (num <= 0) {
        return String(num);
    }
    const numerals: Array<[number, string]> = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'],
        [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let n: number = num;
    let out: string = '';
    for (const [value, symbol] of numerals) {
        while (n >= value) {
            out += symbol;
            n -= value;
        }
    }
    return out;
}

function toLetters(num: number): string {
    if (num <= 0) {
        return String(num);
    }
    let n: number = num;
    let out: string = '';
    while (n > 0) {
        n -= 1;
        out = String.fromCharCode(97 + (n % 26)) + out;
        n = Math.floor(n / 26);
    }
    return out;
}

function toOrdinal(n: number): string {
    const mod100: number = n % 100;
    if (mod100 >= 11 && mod100 <= 13) {
        return String(n) + 'th';
    }
    switch (n % 10) {
    case 1:
        return String(n) + 'st';
    case 2:
        return String(n) + 'nd';
    case 3:
        return String(n) + 'rd';
    default:
        return String(n) + 'th';
    }
}

const ONES: string[] = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen'
];
const TENS: string[] = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function toCardinalText(n: number): string {
    if (n < 0) {
        return String(n);
    }
    if (n < 20) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return ONES[n]!;
    }
    if (n < 100) {
        const t: number = Math.floor(n / 10);
        const o: number = n % 10;
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return o === 0 ? TENS[t]! : TENS[t]! + '-' + ONES[o]!;
    }
    if (n < 1000) {
        const h: number = Math.floor(n / 100);
        const rest: number = n % 100;
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return rest === 0 ? ONES[h]! + ' hundred' : ONES[h]! + ' hundred ' + toCardinalText(rest);
    }
    return String(n);
}

function toOrdinalText(n: number): string {
    const card: string = toCardinalText(n);
    if (card === 'one') {
        return 'first';
    }
    if (card === 'two') {
        return 'second';
    }
    if (card === 'three') {
        return 'third';
    }
    if (card === 'five') {
        return 'fifth';
    }
    if (card === 'eight') {
        return 'eighth';
    }
    if (card === 'nine') {
        return 'ninth';
    }
    if (card === 'twelve') {
        return 'twelfth';
    }
    if (card.charAt(card.length - 1) === 'y') {
        return card.substring(0, card.length - 1) + 'ieth';
    }
    return card + 'th';
}

function toHebrew(n: number): string {
    // Best-effort decimal fallback with Hebrew letter mapping for 1-10
    const map: string[] = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'];
    if (n >= 1 && n <= 10) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return map[n]!;
    }
    return String(n);
}

function toHindiDigits(n: number): string {
    const digits: string = String(n);
    let out: string = '';
    for (let i: number = 0; i < digits.length; i += 1) {
        const code: number = digits.charCodeAt(i);
        if (code >= 48 && code <= 57) {
            out += String.fromCharCode(0x0966 + (code - 48));
        } else {
            out += digits.charAt(i);
        }
    }
    return out;
}

function toFullWidthDecimal(n: number): string {
    const digits: string = String(n);
    let out: string = '';
    for (let i: number = 0; i < digits.length; i += 1) {
        const code: number = digits.charCodeAt(i);
        if (code >= 48 && code <= 57) {
            out += String.fromCharCode(0xff10 + (code - 48));
        } else {
            out += digits.charAt(i);
        }
    }
    return out;
}

function enclosedCircle(n: number): string {
    if (n >= 1 && n <= 20) {
        return String.fromCharCode(0x2460 + n - 1);
    }
    return String(n);
}

const AIUEO: string = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
function toAiueo(n: number): string {
    if (n <= 0) {
        return String(n);
    }
    const idx: number = (n - 1) % AIUEO.length;
    return AIUEO.charAt(idx);
}

const IROHA: string = 'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす';
function toIroha(n: number): string {
    if (n <= 0) {
        return String(n);
    }
    const idx: number = (n - 1) % IROHA.length;
    return IROHA.charAt(idx);
}
