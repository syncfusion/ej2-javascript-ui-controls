/*!
 * Conditional formatting engine (client side, implemented from the OOXML / Excel rules).
 *
 * ALL knowledge about the shape of the @syncfusion/ej2-xlsx objects lives in the
 * "normalize*" functions near the bottom of the class. If a rule type is not picked up,
 * call ConditionalFormattingEngine.debugDump(sheet) and adjust the property names there.
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CfBorderEdge, CfDataBar, CfIconSet, EvaluatedCF, RangeParser, formatHexColor } from '../common/index';

export { CfBorderEdge, CfDataBar, CfIconSet };

// Dynamic workbook objects have no static shape, so one explicit alias is used instead of many scattered `any`s.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;


type KindA = 'colorScale' | 'dataBar' | 'iconSet' | 'cellIs' | 'expression' | 'text' | 'top10' | 'average';
type KindB = 'duplicate' | 'unique' | 'blanks' | 'errors' | 'timePeriod' | 'unknown';
type Kind = KindA | KindB;

interface Cfvo { type: string; value: Any; gte: boolean; }
interface IconCrit extends Cfvo { custom?: { set: string; id: number }; }
interface Stats { min: number; max: number; n: number; avg: number; sd: number; sorted: number[]; counts: Map<string, number>; }
interface Stop { cfvo: Cfvo; color: string; }
interface DataBarRule {
    min: Cfvo; max: Cfvo; color: string; negColor: string; negSame: boolean; border: boolean; borderColor: string;
    negBorderColor: string; gradient: boolean; rtl: boolean; axisPos: string; axisColor: string; showValue: boolean;
    minLen: number; maxLen: number;
}
interface IconSetRule { set: string; count: number; crit: IconCrit[]; reverse: boolean; showValue: boolean; }

interface Rule {
    raw: Any; index: number; kind: Kind; priority: number; stopIfTrue: boolean;
    rects: number[][]; baseRow: number; baseCol: number;
    formulas: string[]; operator: string; negate: boolean;
    text?: string; textOp: string;
    rank: number; percent: boolean; bottom: boolean;
    above: boolean; equalAverage: boolean; stdDev: number;
    period: string;
    stops: Stop[];
    bar?: DataBarRule;
    icons?: IconSetRule;
    style?: EvaluatedCF; stats?: Stats;
}

interface SheetCtx {
    sheet: Any; workbook: Any; name: string; rules: Rule[];
    grid: Map<number, Map<number, Any>>; maxRow: number; maxCol: number;
}

interface GridInfo { grid: Map<number, Map<number, Any>>; maxRow: number; maxCol: number; }

/**
 * Returns the first defined property among the given names.
 *
 * @param {Any} o - source object
 * @param {string} [name1] - first property name
 * @param {string} [name2] - second property name
 * @param {string} [name3] - third property name
 * @param {string} [name4] - fourth property name
 * @param {string} [name5] - fifth property name
 * @param {string} [name6] - sixth property name
 * @param {string} [name7] - seventh property name
 * @returns {Any} first defined value
 */
function pick(
    o: Any,
    name1?: string,
    name2?: string,
    name3?: string,
    name4?: string,
    name5?: string,
    name6?: string,
    name7?: string
): Any {
    if (!o) { return undefined; }
    const names: (string | undefined)[] = [name1, name2, name3, name4, name5, name6, name7];
    for (let i: number = 0; i < names.length; i++) {
        const propName: string | undefined = names[i as number];
        if (propName !== undefined) {
            const val: Any = o[propName as string];
            if (!isNullOrUndefined(val)) { return val; }
        }
    }
    return undefined;
}

/**
 * Normalizes a name to lower case alphanumerics.
 *
 * @param {Any} s - input
 * @returns {string} normalized key
 */
function key(s: Any): string {
    return String(isNullOrUndefined(s) ? '' : s).replace(/[^A-Za-z0-9]/g, '').toLowerCase();
}

/**
 * Converts a value to a number (NaN when not numeric).
 *
 * @param {Any} v - input
 * @returns {number} numeric value
 */
function toN(v: Any): number {
    if (typeof v === 'number') { return v; }
    if (isNullOrUndefined(v) || String(v).trim() === '') { return NaN; }
    return Number(String(v).trim());
}

/**
 * Converts a flag value to boolean.
 *
 * @param {Any} v - input
 * @param {boolean} dflt - default when undefined
 * @returns {boolean} flag value
 */
function truthyFlag(v: Any, dflt: boolean): boolean {
    if (isNullOrUndefined(v)) { return dflt; }
    if (typeof v === 'string') { return !(v === '0' || v.toLowerCase() === 'false'); }
    return Boolean(v);
}

const DEFAULT_THEME: string[] = [
    '#FFFFFF', '#000000', '#E7E6E6', '#44546A', '#4472C4', '#ED7D31',
    '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47', '#0563C1', '#954F72'
];
const INDEXED: string[] = [
    '000000,FFFFFF,FF0000,00FF00,0000FF,FFFF00,FF00FF,00FFFF,',
    '000000,FFFFFF,FF0000,00FF00,0000FF,FFFF00,FF00FF,00FFFF,',
    '800000,008000,000080,808000,800080,008080,C0C0C0,808080,',
    '9999FF,993366,FFFFCC,CCFFFF,660066,FF8080,0066CC,CCCCFF,',
    '000080,FF00FF,FFFF00,00FFFF,800080,800000,008080,0000FF,',
    '00CCFF,CCFFFF,CCFFCC,FFFF99,99CCFF,FF99CC,CC99FF,FFCC99,',
    '3366FF,33CCCC,99CC00,FFCC00,FF9900,FF6600,666699,969696,',
    '003366,339966,003300,333300,993300,993366,333399,333333'
].join('').split(',');

const ICON_SETS: { [k: string]: number } = {
    '3Arrows': 3, '3ArrowsGray': 3, '3Flags': 3, '3TrafficLights1': 3, '3TrafficLights2': 3,
    '3Signs': 3, '3Symbols': 3, '3Symbols2': 3, '3Stars': 3, '3Triangles': 3,
    '4Arrows': 4, '4ArrowsGray': 4, '4RedToBlack': 4, '4Rating': 4, '4TrafficLights': 4,
    '5Arrows': 5, '5ArrowsGray': 5, '5Rating': 5, '5Quarters': 5, '5Boxes': 5, 'NoIcons': 0
};

const KIND: { [k: string]: Kind } = {
    colorscale: 'colorScale', colorscales: 'colorScale', databar: 'dataBar', databars: 'dataBar',
    iconset: 'iconSet', iconsets: 'iconSet',
    cellis: 'cellIs', cellvalue: 'cellIs', greaterthan: 'cellIs', lessthan: 'cellIs', equalto: 'cellIs', between: 'cellIs',
    expression: 'expression', formula: 'expression',
    top10: 'top10', top: 'top10', bottom: 'top10', topbottom: 'top10', topn: 'top10', bottomn: 'top10',
    aboveaverage: 'average', belowaverage: 'average', average: 'average',
    containstext: 'text', notcontainstext: 'text', beginswith: 'text', endswith: 'text', specifictext: 'text', text: 'text',
    duplicatevalues: 'duplicate', duplicate: 'duplicate', uniquevalues: 'unique', unique: 'unique',
    containsblanks: 'blanks', notcontainsblanks: 'blanks', blank: 'blanks', blanks: 'blanks', noblank: 'blanks', noblanks: 'blanks',
    containserrors: 'errors', notcontainserrors: 'errors', error: 'errors', errors: 'errors', noerror: 'errors', noerrors: 'errors',
    timeperiod: 'timePeriod', dateoccurring: 'timePeriod'
};

/**
 * Looks up a rule kind by its normalized type key.
 *
 * @param {string} k - normalized type key
 * @returns {Kind | undefined} rule kind
 */
function kindOf(k: string): Kind | undefined {
    return Object.prototype.hasOwnProperty.call(KIND, k) ? KIND[k as string] : undefined;
}

class CfErr {
    code: string;
    constructor(code: string) {
        this.code = code;
    }
}

class Rng {
    s: SheetCtx;
    r1: number;
    c1: number;
    r2: number;
    c2: number;
    constructor(s: SheetCtx, r1: number, c1: number, r2: number, c2: number) {
        this.s = s;
        this.r1 = r1;
        this.c1 = c1;
        this.r2 = r2;
        this.c2 = c2;
    }
}

interface EC { s: SheetCtx; row: number; col: number; dr: number; dc: number; wb: Any; }

const MAXR: number = 1048576;
const MAXC: number = 16384;

/**
 * Checks whether a value is a formula error object.
 *
 * @param {Any} x - value
 * @returns {boolean} true for errors
 */
function isErr(x: Any): x is CfErr {
    return x instanceof CfErr;
}

/**
 * Collects all cell values of a range.
 *
 * @param {Rng} r - range
 * @returns {Any[]} cell values
 */
function rangeCells(r: Rng): Any[] {
    const out: Any[] = [];
    const r2: number = Math.min(r.r2, r.s.maxRow);
    const c2: number = Math.min(r.c2, r.s.maxCol);
    for (let i: number = r.r1; i <= r2; i++) {
        const row: Map<number, Any> | undefined = r.s.grid.get(i);
        for (let j: number = r.c1; j <= c2; j++) {
            const val: Any = row ? row.get(j) : undefined;
            out.push(isNullOrUndefined(val) ? null : val);
        }
    }
    return out;
}

/**
 * Reduces a range to its first cell, leaves other values untouched.
 *
 * @param {Any} x - value or range
 * @returns {Any} scalar value
 */
function scalar(x: Any): Any {
    if (x instanceof Rng) {
        const row: Map<number, Any> | undefined = x.s.grid.get(x.r1);
        const val: Any = row ? row.get(x.c1) : undefined;
        return isNullOrUndefined(val) ? null : val;
    }
    return x;
}

/**
 * Coerces a value to a number or a #VALUE! error.
 *
 * @param {Any} x0 - value
 * @returns {Any} number or error
 */
function toNum(x0: Any): Any {
    const x: Any = scalar(x0);
    if (isErr(x)) { return x; }
    if (isNullOrUndefined(x) || x === '') { return 0; }
    if (typeof x === 'number') { return x; }
    if (typeof x === 'boolean') { return x ? 1 : 0; }
    const n: number = Number(String(x).trim());
    return isNaN(n) ? new CfErr('#VALUE!') : n;
}

/**
 * Coerces a value to text.
 *
 * @param {Any} x0 - value
 * @returns {Any} string or error
 */
function toStr(x0: Any): Any {
    const x: Any = scalar(x0);
    if (isErr(x)) { return x; }
    if (isNullOrUndefined(x)) { return ''; }
    if (typeof x === 'boolean') { return x ? 'TRUE' : 'FALSE'; }
    return String(x);
}

/**
 * Coerces a value to boolean or a #VALUE! error.
 *
 * @param {Any} x0 - value
 * @returns {Any} boolean or error
 */
function toBool(x0: Any): Any {
    const x: Any = scalar(x0);
    if (isErr(x)) { return x; }
    if (isNullOrUndefined(x)) { return false; }
    if (typeof x === 'boolean') { return x; }
    if (typeof x === 'number') { return x !== 0; }
    const u: string = String(x).toUpperCase();
    if (u === 'TRUE') { return true; }
    if (u === 'FALSE') { return false; }
    return new CfErr('#VALUE!');
}

/**
 * Checks whether a value is an error string such as #N/A.
 *
 * @param {Any} v - value
 * @returns {boolean} true for error strings
 */
function isErrorString(v: Any): boolean {
    return typeof v === 'string' && /^#(N\/A|VALUE!|REF!|DIV\/0!|NUM!|NAME\?|NULL!)$/i.test(v);
}

/**
 * Returns the Excel sort rank of a value type.
 *
 * @param {Any} v - value
 * @returns {number} type rank
 */
function typeRank(v: Any): number {
    if (typeof v === 'number') { return 0; }
    return typeof v === 'string' ? 1 : 2;
}

/**
 * Compares two values using Excel ordering.
 *
 * @param {Any} a0 - first value
 * @param {Any} b0 - second value
 * @returns {number} negative, zero or positive
 */
function compareVals(a0: Any, b0: Any): number {
    let a: Any = scalar(a0);
    let b: Any = scalar(b0);
    if (isNullOrUndefined(a)) {
        if (typeof b === 'string') {
            a = '';
        } else {
            a = typeof b === 'boolean' ? false : 0;
        }
    }
    if (isNullOrUndefined(b)) {
        if (typeof a === 'string') {
            b = '';
        } else {
            b = typeof a === 'boolean' ? false : 0;
        }
    }
    const ta: number = typeRank(a);
    const tb: number = typeRank(b);
    if (ta !== tb) { return ta < tb ? -1 : 1; }
    if (ta === 1) {
        const sa: string = String(a).toLowerCase();
        const sb: string = String(b).toLowerCase();
        if (sa < sb) { return -1; }
        return sa > sb ? 1 : 0;
    }
    const x: number = Number(a);
    const y: number = Number(b);
    if (x < y) { return -1; }
    return x > y ? 1 : 0;
}

interface WildTok { kind: number; ch: string; }

/**
 * Splits an Excel wildcard pattern into tokens (0 literal, 1 single char, 2 any run).
 *
 * @param {string} p - pattern
 * @returns {WildTok[]} tokens
 */
function wildcardTokens(p: string): WildTok[] {
    const out: WildTok[] = [];
    for (let i: number = 0; i < p.length; i++) {
        const ch: string = p.charAt(i);
        if (ch === '~' && i + 1 < p.length) {
            i++;
            out.push({ kind: 0, ch: p.charAt(i).toLowerCase() });
        } else if (ch === '*') {
            out.push({ kind: 2, ch: '' });
        } else if (ch === '?') {
            out.push({ kind: 1, ch: '' });
        } else {
            out.push({ kind: 0, ch: ch.toLowerCase() });
        }
    }
    return out;
}

/**
 * Matches wildcard tokens against text at a fixed position.
 *
 * @param {WildTok[]} toks - pattern tokens
 * @param {number} ti - token start
 * @param {string} text - text
 * @param {number} si - text start
 * @param {boolean} anchored - whether the whole remaining text must match
 * @returns {boolean} true when matched
 */
function wildMatchAt(toks: WildTok[], ti: number, text: string, si: number, anchored: boolean): boolean {
    let t: number = ti;
    let s: number = si;
    while (t < toks.length) {
        const tk: WildTok = toks[t as number];
        if (tk.kind === 2) {
            for (let k: number = s; k <= text.length; k++) {
                if (wildMatchAt(toks, t + 1, text, k, anchored)) { return true; }
            }
            return false;
        }
        if (s >= text.length) { return false; }
        if (tk.kind === 0 && text.charAt(s).toLowerCase() !== tk.ch) { return false; }
        t++;
        s++;
    }
    return anchored ? s === text.length : true;
}

/**
 * Finds a wildcard pattern in text (case-insensitive).
 *
 * @param {string} pattern - wildcard pattern
 * @param {string} text - text to search
 * @param {boolean} anchored - match the whole text
 * @returns {number} start index or -1
 */
function wildcardFind(pattern: string, text: string, anchored: boolean): number {
    const toks: WildTok[] = wildcardTokens(pattern);
    if (anchored) { return wildMatchAt(toks, 0, text, 0, true) ? 0 : -1; }
    for (let st: number = 0; st <= text.length; st++) {
        if (wildMatchAt(toks, 0, text, st, false)) { return st; }
    }
    return -1;
}

/**
 * Builds a matcher for COUNTIF style criteria.
 *
 * @param {Any} crit0 - criteria
 * @returns {Function} predicate
 */
function criteriaMatcher(crit0: Any): (v: Any) => boolean {
    const crit: Any = scalar(crit0);
    if (typeof crit === 'number') { return (v: Any): boolean => typeof v === 'number' && v === crit; }
    if (typeof crit === 'boolean') { return (v: Any): boolean => v === crit; }
    const s: string = isNullOrUndefined(crit) ? '' : String(crit);
    const ops: string[] = ['<=', '>=', '<>', '=', '<', '>'];
    let op: string = '=';
    let rhs: string = s;
    for (let i: number = 0; i < ops.length; i++) {
        if (s.indexOf(ops[i as number]) === 0) {
            op = ops[i as number];
            rhs = s.substring(op.length);
            break;
        }
    }
    const n: number = rhs.trim() === '' ? NaN : Number(rhs);
    const blank: (v: Any) => boolean = (v: Any): boolean => isNullOrUndefined(v) || v === '';
    if (!isNaN(n)) {
        return (v: Any): boolean => {
            if (typeof v !== 'number') { return op === '<>'; }
            switch (op) {
            case '=': return v === n;
            case '<>': return v !== n;
            case '<': return v < n;
            case '>': return v > n;
            case '<=': return v <= n;
            default: return v >= n;
            }
        };
    }
    if (rhs === '') {
        return op === '<>' ? (v: Any): boolean => !blank(v) : (v: Any): boolean => blank(v);
    }
    if (op === '=' || op === '<>') {
        return (v: Any): boolean => {
            const hit: boolean = !blank(v) && wildcardFind(rhs, String(v), true) >= 0;
            return op === '=' ? hit : !hit;
        };
    }
    const low: string = rhs.toLowerCase();
    return (v: Any): boolean => {
        if (typeof v !== 'string') { return false; }
        const x: string = v.toLowerCase();
        switch (op) {
        case '<': return x < low;
        case '>': return x > low;
        case '<=': return x <= low;
        default: return x >= low;
        }
    };
}

/**
 * Converts an Excel serial number to a UTC date.
 *
 * @param {number} n - serial number
 * @returns {Date} date
 */
function serialToDate(n: number): Date {
    return new Date(Date.UTC(1899, 11, 30) + Math.floor(n) * 86400000);
}

/**
 * Returns today's Excel serial number.
 *
 * @returns {number} serial number
 */
function todaySerial(): number {
    const d: Date = new Date();
    return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(1899, 11, 30)) / 86400000);
}

/**
 * Converts a calendar date to an Excel serial number.
 *
 * @param {number} y - year
 * @param {number} m - month
 * @param {number} d - day
 * @returns {number} serial number
 */
function dateToSerial(y: number, m: number, d: number): number {
    return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 86400000);
}

/**
 * Converts a JS date to a fractional Excel serial number.
 *
 * @param {Date} d - date
 * @returns {number} serial number
 */
function dateToNumber(d: Date): number {
    return Math.floor((d.getTime() - Date.UTC(1899, 11, 30)) / 86400000 * 1e6) / 1e6;
}

/**
 * Returns a month index used to compare months across years.
 *
 * @param {Date} x - date
 * @returns {number} month index
 */
function monthIndex(x: Date): number {
    return x.getUTCFullYear() * 12 + x.getUTCMonth();
}

interface Tok { t: string; v: Any; }
interface RefMatch { sheet: string | undefined; body: string; length: number; }

const CELL_RE: RegExp = /^(\$?)([A-Za-z]{1,3})(\$?)(\d+)$/;
const CELL_RANGE_RE: RegExp = /^\$?[A-Za-z]{1,3}\$?\d+:\$?[A-Za-z]{1,3}\$?\d+/;
const CELL_ONE_RE: RegExp = /^\$?[A-Za-z]{1,3}\$?\d+/;
const COL_RANGE_RE: RegExp = /^\$?[A-Za-z]{1,3}:\$?[A-Za-z]{1,3}/;
const ROW_RANGE_RE: RegExp = /^\$?\d+:\$?\d+/;
const WORD_CHAR_RE: RegExp = /[\w.(]/;
const CMP_OPS: string[] = ['=', '<>', '<', '>', '<=', '>='];

/**
 * Matches a cell / range reference body at the start of the text.
 *
 * @param {string} text - text
 * @returns {string} matched body or empty string
 */
function matchBody(text: string): string {
    const patterns: RegExp[] = [CELL_RANGE_RE, CELL_ONE_RE, COL_RANGE_RE, ROW_RANGE_RE];
    for (let i: number = 0; i < patterns.length; i++) {
        const m: RegExpExecArray | null = patterns[i as number].exec(text);
        if (m) {
            const next: string = text.charAt(m[0].length);
            if (next === '' || !WORD_CHAR_RE.test(next)) { return m[0]; }
        }
    }
    return '';
}

/**
 * Matches an optional sheet prefix followed by a reference at the start of the text.
 *
 * @param {string} text - text
 * @returns {RefMatch | null} match info
 */
function matchRef(text: string): RefMatch | null {
    let pos: number = 0;
    let sheet: string | undefined;
    if (text.charAt(0) === '\'') {
        let q: number = 1;
        let closed: boolean = false;
        while (q < text.length) {
            if (text.charAt(q) === '\'') {
                if (text.charAt(q + 1) === '\'') {
                    q += 2;
                    continue;
                }
                closed = true;
                break;
            }
            q++;
        }
        if (closed && q > 1 && text.charAt(q + 1) === '!') {
            sheet = text.substring(0, q + 1);
            pos = q + 2;
        }
    } else {
        let q: number = 0;
        while (q < text.length && /[A-Za-z0-9_.]/.test(text.charAt(q))) { q++; }
        if (q > 0 && text.charAt(q) === '!') {
            sheet = text.substring(0, q);
            pos = q + 1;
        }
    }
    let body: string = matchBody(text.substring(pos));
    if (!body && pos > 0) {
        pos = 0;
        sheet = undefined;
        body = matchBody(text);
    }
    if (!body) { return null; }
    return { sheet, body, length: pos + body.length };
}

/**
 * Returns the index after a run of digits.
 *
 * @param {string} s - text
 * @param {number} pos - start index
 * @returns {number} end index
 */
function skipDigits(s: string, pos: number): number {
    let p: number = pos;
    while (p < s.length && s.charAt(p) >= '0' && s.charAt(p) <= '9') { p++; }
    return p;
}

/**
 * Returns the length of a number literal at the start of the text (0 when none).
 *
 * @param {string} s - text
 * @returns {number} literal length
 */
function numberLength(s: string): number {
    let p: number = skipDigits(s, 0);
    if (p > 0) {
        if (s.charAt(p) === '.') { p = skipDigits(s, p + 1); }
    } else if (s.charAt(0) === '.') {
        const q: number = skipDigits(s, 1);
        if (q === 1) { return 0; }
        p = q;
    } else {
        return 0;
    }
    const e: string = s.charAt(p);
    if (e === 'e' || e === 'E') {
        let q: number = p + 1;
        const sg: string = s.charAt(q);
        if (sg === '+' || sg === '-') { q++; }
        const end: number = skipDigits(s, q);
        if (end > q) { p = end; }
    }
    return p;
}

/**
 * Splits a formula into tokens.
 *
 * @param {string} src - formula text
 * @returns {Tok[]} tokens
 */
function tokenize(src: string): Tok[] {
    const out: Tok[] = [];
    let i: number = 0;
    while (i < src.length) {
        const ch: string = src.charAt(i);
        if (/\s/.test(ch)) {
            i++;
            continue;
        }
        if (ch === '"') {
            let j: number = i + 1;
            let text: string = '';
            let closed: boolean = false;
            while (j < src.length) {
                if (src.charAt(j) === '"') {
                    if (src.charAt(j + 1) === '"') {
                        text += '"';
                        j += 2;
                        continue;
                    }
                    closed = true;
                    break;
                }
                text += src.charAt(j);
                j++;
            }
            if (!closed) { return out; }
            out.push({ t: 'str', v: text });
            i = j + 1;
            continue;
        }
        const rest: string = src.substring(i);
        const ref: RefMatch | null = matchRef(rest);
        if (ref) {
            out.push({ t: 'ref', v: ref });
            i += ref.length;
            continue;
        }
        const numLen: number = numberLength(rest);
        if (numLen > 0) {
            out.push({ t: 'num', v: parseFloat(rest.substring(0, numLen)) });
            i += numLen;
            continue;
        }
        if (/[A-Za-z_]/.test(ch)) {
            let j: number = i + 1;
            while (j < src.length && /[A-Za-z0-9_.]/.test(src.charAt(j))) { j++; }
            out.push({ t: 'id', v: src.substring(i, j) });
            i = j;
            continue;
        }
        const two: string = src.substring(i, i + 2);
        if (two === '<=' || two === '>=' || two === '<>') {
            out.push({ t: 'op', v: two });
            i += 2;
            continue;
        }
        if ('=<>+-*/^&%(),;'.indexOf(ch) >= 0) {
            out.push({ t: 'op', v: ch });
            i++;
            continue;
        }
        return out;
    }
    return out;
}

/**
 * Converts a matched reference into an AST node.
 *
 * @param {RefMatch} m - reference match
 * @returns {Any} reference node
 */
function parseRefMatch(m: RefMatch): Any {
    const sheet: string | undefined = m.sheet ? m.sheet.replace(/^'|'$/g, '').replace(/''/g, '\'') : undefined;
    const parts: string[] = m.body.split(':');
    const one: (p: string) => Any = (p: string): Any => {
        const c: RegExpExecArray | null = CELL_RE.exec(p);
        if (c) { return { ac: Boolean(c[1]), col: RangeParser.columnLetterToIndex(c[2]), ar: Boolean(c[3]), row: parseInt(c[4], 10) }; }
        if (/^\$?[A-Za-z]+$/.test(p)) {
            return { ac: p.startsWith('$'), col: RangeParser.columnLetterToIndex(p.replace('$', '')), ar: true, row: 0 };
        }
        return { ac: true, col: 0, ar: p.startsWith('$'), row: parseInt(p.replace('$', ''), 10) };
    };
    const a: Any = one(parts[0]);
    const b: Any = parts.length > 1 ? one(parts[1]) : undefined;
    if (b && a.row === 0 && b.row === 0) {
        a.row = 1;
        b.row = MAXR;
        a.ar = true;
        b.ar = true;
    }
    if (b && a.col === 0 && b.col === 0) {
        a.col = 1;
        b.col = MAXC;
        a.ac = true;
        b.ac = true;
    }
    return { t: 'ref', sheet, a, b };
}

class Parser {
    private p: number = 0;
    private toks: Tok[];
    constructor(toks: Tok[]) {
        this.toks = toks;
    }
    private peek(): Tok | undefined { return this.toks[this.p]; }
    private isOp(v: string): boolean {
        const t: Tok | undefined = this.peek();
        return Boolean(t && t.t === 'op' && t.v === v);
    }
    parse(): Any {
        if (!this.toks || this.toks.length === 0) { return null; }
        return this.cmp();
    }
    private cmp(): Any {
        let l: Any = this.cat();
        for (; ;) {
            const t: Tok | undefined = this.peek();
            if (t && t.t === 'op' && CMP_OPS.indexOf(t.v) >= 0) {
                this.p++;
                l = { t: 'bin', op: t.v, a: l, b: this.cat() };
            } else {
                return l;
            }
        }
    }
    private cat(): Any {
        let l: Any = this.add();
        while (this.isOp('&')) {
            this.p++;
            l = { t: 'bin', op: '&', a: l, b: this.add() };
        }
        return l;
    }
    private add(): Any {
        let l: Any = this.mul();
        for (; ;) {
            const t: Tok | undefined = this.peek();
            if (t && t.t === 'op' && (t.v === '+' || t.v === '-')) {
                this.p++;
                l = { t: 'bin', op: t.v, a: l, b: this.mul() };
            } else {
                return l;
            }
        }
    }
    private mul(): Any {
        let l: Any = this.pow();
        for (; ;) {
            const t: Tok | undefined = this.peek();
            if (t && t.t === 'op' && (t.v === '*' || t.v === '/')) {
                this.p++;
                l = { t: 'bin', op: t.v, a: l, b: this.pow() };
            } else {
                return l;
            }
        }
    }
    private pow(): Any {
        let l: Any = this.unary();
        while (this.isOp('^')) {
            this.p++;
            l = { t: 'bin', op: '^', a: l, b: this.unary() };
        }
        return l;
    }
    private unary(): Any {
        const t: Tok | undefined = this.peek();
        if (t && t.t === 'op' && (t.v === '-' || t.v === '+')) {
            this.p++;
            return { t: 'un', op: t.v, a: this.unary() };
        }
        let n: Any = this.primary();
        while (this.isOp('%')) {
            this.p++;
            n = { t: 'pct', a: n };
        }
        return n;
    }
    private primary(): Any {
        const t: Tok | undefined = this.toks[this.p++];
        if (!t) { return null; }
        if (t.t === 'num') { return { t: 'num', v: t.v }; }
        if (t.t === 'str') { return { t: 'str', v: t.v }; }
        if (t.t === 'ref') { return parseRefMatch(t.v); }
        if (t.t === 'op' && t.v === '(') {
            const n: Any = this.cmp();
            this.expect(')');
            return n;
        }
        if (t.t === 'id') {
            const u: string = String(t.v).toUpperCase();
            if (this.isOp('(')) {
                this.p++;
                const args: Any[] = [];
                if (!this.isOp(')')) {
                    for (; ;) {
                        args.push(this.isOp(',') || this.isOp(')') ? { t: 'blank' } : this.cmp());
                        if (this.isOp(',')) {
                            this.p++;
                            continue;
                        }
                        break;
                    }
                }
                this.expect(')');
                return { t: 'fn', name: u, args };
            }
            if (u === 'TRUE') { return { t: 'bool', v: true }; }
            if (u === 'FALSE') { return { t: 'bool', v: false }; }
            return { t: 'name', v: t.v };
        }
        return null;
    }
    private expect(v: string): void {
        if (this.isOp(v)) { this.p++; }
    }
}

const astCache: Map<string, Any> = new Map<string, Any>();

/**
 * Parses a formula into an AST (cached).
 *
 * @param {string} f - formula text
 * @returns {Any} AST
 */
function parseFormula(f: string): Any {
    let k: string = f.trim();
    if (k.charAt(0) === '=') { k = k.substring(1); }
    if (astCache.has(k)) { return astCache.get(k); }
    const tokens: Tok[] = tokenize(k);
    const ast: Any = new Parser(tokens).parse();
    astCache.set(k, ast);
    return ast;
}

/**
 * Resolves the sheet a reference points to.
 *
 * @param {EC} c - evaluation context
 * @param {string} name - optional sheet name
 * @returns {SheetCtx | null} sheet context
 */
function sheetFor(c: EC, name?: string): SheetCtx | null {
    if (!name || name.toLowerCase() === c.s.name.toLowerCase()) { return c.s; }
    const sheets: Any = c.wb && c.wb.worksheets;
    if (Array.isArray(sheets)) {
        for (let i: number = 0; i < sheets.length; i++) {
            const sh: Any = sheets[i as number];
            if (sh && String(sh.name).toLowerCase() === name.toLowerCase()) {
                return ConditionalFormattingEngine._ctx(sh, c.wb);
            }
        }
    }
    return null;
}

/**
 * Resolves a reference position relative to the evaluated cell.
 *
 * @param {Any} p - reference part
 * @param {EC} c - evaluation context
 * @returns {object} row and column
 */
function resolvePos(p: Any, c: EC): { r: number; c: number } {
    return { r: p.ar ? p.row : p.row + c.dr, c: p.ac ? p.col : p.col + c.dc };
}

/**
 * Evaluates a reference node.
 *
 * @param {Any} n - node
 * @param {EC} c - evaluation context
 * @returns {Any} value or range
 */
function evalRef(n: Any, c: EC): Any {
    const s: SheetCtx | null = sheetFor(c, n.sheet);
    if (!s) { return new CfErr('#REF!'); }
    const a: { r: number; c: number } = resolvePos(n.a, c);
    if (a.r < 1 || a.c < 1) { return new CfErr('#REF!'); }
    if (!n.b) {
        const row: Map<number, Any> | undefined = s.grid.get(a.r);
        const val: Any = row ? row.get(a.c) : undefined;
        return isNullOrUndefined(val) ? null : val;
    }
    const b: { r: number; c: number } = resolvePos(n.b, c);
    if (b.r < 1 || b.c < 1) { return new CfErr('#REF!'); }
    return new Rng(s, Math.min(a.r, b.r), Math.min(a.c, b.c), Math.max(a.r, b.r), Math.max(a.c, b.c));
}

/**
 * Evaluates a binary operation.
 *
 * @param {string} op - operator
 * @param {Any} a0 - left operand
 * @param {Any} b0 - right operand
 * @returns {Any} result
 */
function evBin(op: string, a0: Any, b0: Any): Any {
    const a: Any = scalar(a0);
    const b: Any = scalar(b0);
    if (isErr(a)) { return a; }
    if (isErr(b)) { return b; }
    switch (op) {
    case '=': return compareVals(a, b) === 0;
    case '<>': return compareVals(a, b) !== 0;
    case '<': return compareVals(a, b) < 0;
    case '>': return compareVals(a, b) > 0;
    case '<=': return compareVals(a, b) <= 0;
    case '>=': return compareVals(a, b) >= 0;
    case '&': return toStr(a) + toStr(b);
    }
    const x: Any = toNum(a);
    const y: Any = toNum(b);
    if (isErr(x)) { return x; }
    if (isErr(y)) { return y; }
    switch (op) {
    case '+': return x + y;
    case '-': return x - y;
    case '*': return x * y;
    case '/': return y === 0 ? new CfErr('#DIV/0!') : x / y;
    case '^': return Math.pow(x, y);
    }
    return new CfErr('#VALUE!');
}

/**
 * Evaluates an AST node.
 *
 * @param {Any} n - node
 * @param {EC} c - evaluation context
 * @returns {Any} result
 */
function ev(n: Any, c: EC): Any {
    if (!n) { return new CfErr('#VALUE!'); }
    switch (n.t) {
    case 'num':
    case 'str':
    case 'bool':
        return n.v;
    case 'blank':
        return null;
    case 'name':
        return new CfErr('#NAME?');
    case 'ref':
        return evalRef(n, c);
    case 'un': {
        const a: Any = ev(n.a, c);
        if (n.op === '+') { return a; }
        const x: Any = toNum(a);
        return isErr(x) ? x : -x;
    }
    case 'pct': {
        const x: Any = toNum(ev(n.a, c));
        return isErr(x) ? x : x / 100;
    }
    case 'bin':
        return evBin(n.op, ev(n.a, c), ev(n.b, c));
    case 'fn':
        return evFn(n, c);
    }
    return new CfErr('#VALUE!');
}

/**
 * Flattens ranges inside an argument list.
 *
 * @param {Any[]} args - arguments
 * @returns {Any[]} flat values
 */
function flat(args: Any[]): Any[] {
    const out: Any[] = [];
    for (let i: number = 0; i < args.length; i++) {
        const a: Any = args[i as number];
        if (a instanceof Rng) {
            const cells: Any[] = rangeCells(a);
            for (let j: number = 0; j < cells.length; j++) { out.push(cells[j as number]); }
        } else {
            out.push(a);
        }
    }
    return out;
}

/**
 * Keeps arguments that count for AND / OR.
 *
 * @param {Any} x - argument
 * @returns {boolean} true when it is used
 */
function isLogicalArg(x: Any): boolean {
    return (!isNullOrUndefined(x) && typeof x !== 'string') || isErr(x);
}

/**
 * Collects numeric arguments (numbers inside ranges, coerced direct values).
 *
 * @param {Any[]} args - arguments
 * @returns {number[] | CfErr} numbers or error
 */
function numericArgs(args: Any[]): number[] | CfErr {
    const out: number[] = [];
    for (let i: number = 0; i < args.length; i++) {
        const a: Any = args[i as number];
        if (a instanceof Rng) {
            const cells: Any[] = rangeCells(a);
            for (let j: number = 0; j < cells.length; j++) {
                const cell: Any = cells[j as number];
                if (isErr(cell) || isErrorString(cell)) { return new CfErr('#VALUE!'); }
                if (typeof cell === 'number') { out.push(cell); }
            }
        } else {
            const x: Any = toNum(a);
            if (isErr(x)) { return x; }
            out.push(x);
        }
    }
    return out;
}

/**
 * Rounds a number to the given digits.
 *
 * @param {number} x - value
 * @param {number} d - digits
 * @param {string} mode - r (round), u (up) or d (down)
 * @returns {number} rounded value
 */
function roundTo(x: number, d: number, mode: 'r' | 'u' | 'd'): number {
    const f: number = Math.pow(10, d);
    const y: number = x * f;
    const abs: number = Math.abs(y);
    let v: number;
    if (mode === 'r') {
        v = Math.round(abs);
    } else if (mode === 'u') {
        v = Math.ceil(abs);
    } else {
        v = Math.floor(abs);
    }
    return (y < 0 ? -v : v) / f;
}

/**
 * Evaluates a function call node.
 *
 * @param {Any} n - node
 * @param {EC} c - evaluation context
 * @returns {Any} result
 */
function evFn(n: Any, c: EC): Any {
    const name: string = n.name;
    if (name === 'ROW' || name === 'COLUMN') {
        if (!n.args.length) { return name === 'ROW' ? c.row : c.col; }
        const first: Any = n.args[0];
        if (first.t === 'ref') {
            const p: Any = first.a;
            if (name === 'ROW') { return p.ar ? p.row : p.row + c.dr; }
            return p.ac ? p.col : p.col + c.dc;
        }
        return new CfErr('#VALUE!');
    }
    const args: Any[] = n.args.map((x: Any): Any => ev(x, c));
    const A: (i: number) => Any = (i: number): Any => args[i as number];
    switch (name) {
    case 'AND':
    case 'OR': {
        const vals: Any[] = flat(args).filter(isLogicalArg);
        let res: boolean = name === 'AND';
        if (!vals.length) { return new CfErr('#VALUE!'); }
        for (let i: number = 0; i < vals.length; i++) {
            const b: Any = toBool(vals[i as number]);
            if (isErr(b)) { return b; }
            res = name === 'AND' ? res && b : res || b;
        }
        return res;
    }
    case 'NOT': {
        const b: Any = toBool(A(0));
        return isErr(b) ? b : !b;
    }
    case 'IF': {
        const t: Any = toBool(A(0));
        if (isErr(t)) { return t; }
        if (t) { return args.length > 1 ? scalar(A(1)) : true; }
        return args.length > 2 ? scalar(A(2)) : false;
    }
    case 'IFERROR': {
        const v: Any = scalar(A(0));
        return isErr(v) || isErrorString(v) ? scalar(A(1)) : v;
    }
    case 'ISBLANK': return isNullOrUndefined(scalar(A(0)));
    case 'ISNUMBER': return typeof scalar(A(0)) === 'number';
    case 'ISTEXT': {
        const v: Any = scalar(A(0));
        return typeof v === 'string' && !isErrorString(v);
    }
    case 'ISLOGICAL': return typeof scalar(A(0)) === 'boolean';
    case 'ISERROR': {
        const v: Any = scalar(A(0));
        return isErr(v) || isErrorString(v);
    }
    case 'ISERR': {
        const v: Any = scalar(A(0));
        return (isErr(v) && v.code !== '#N/A') || (isErrorString(v) && String(v).toUpperCase() !== '#N/A');
    }
    case 'ISNA': {
        const v: Any = scalar(A(0));
        return (isErr(v) && v.code === '#N/A') || String(v).toUpperCase() === '#N/A';
    }
    case 'ISEVEN':
    case 'ISODD': {
        const x: Any = toNum(A(0));
        if (isErr(x)) { return x; }
        const even: boolean = Math.floor(Math.abs(x)) % 2 === 0;
        return name === 'ISEVEN' ? even : !even;
    }
    case 'MOD': {
        const x: Any = toNum(A(0));
        const y: Any = toNum(A(1));
        if (isErr(x)) { return x; }
        if (isErr(y)) { return y; }
        if (y === 0) { return new CfErr('#DIV/0!'); }
        return x - y * Math.floor(x / y);
    }
    case 'ABS': {
        const x: Any = toNum(A(0));
        return isErr(x) ? x : Math.abs(x);
    }
    case 'INT': {
        const x: Any = toNum(A(0));
        return isErr(x) ? x : Math.floor(x);
    }
    case 'TRUNC': {
        const x: Any = toNum(A(0));
        const d: Any = args.length > 1 ? toNum(A(1)) : 0;
        return isErr(x) ? x : roundTo(x, d, 'd');
    }
    case 'ROUND':
    case 'ROUNDUP':
    case 'ROUNDDOWN': {
        const x: Any = toNum(A(0));
        const d: Any = args.length > 1 ? toNum(A(1)) : 0;
        if (isErr(x)) { return x; }
        if (isErr(d)) { return d; }
        if (name === 'ROUND') { return roundTo(x, d, 'r'); }
        return roundTo(x, d, name === 'ROUNDUP' ? 'u' : 'd');
    }
    case 'FLOOR': {
        const x: Any = toNum(A(0));
        const s: Any = args.length > 1 ? toNum(A(1)) : 1;
        if (isErr(x)) { return x; }
        return s === 0 ? 0 : Math.floor(x / s) * s;
    }
    case 'CEILING': {
        const x: Any = toNum(A(0));
        const s: Any = args.length > 1 ? toNum(A(1)) : 1;
        if (isErr(x)) { return x; }
        return s === 0 ? 0 : Math.ceil(x / s) * s;
    }
    case 'LEN': {
        const s: Any = toStr(A(0));
        return isErr(s) ? s : s.length;
    }
    case 'LEFT': {
        const s: Any = toStr(A(0));
        const k: Any = args.length > 1 ? toNum(A(1)) : 1;
        if (isErr(s)) { return s; }
        if (isErr(k)) { return k; }
        return s.substring(0, Math.max(0, k));
    }
    case 'RIGHT': {
        const s: Any = toStr(A(0));
        const k: Any = args.length > 1 ? toNum(A(1)) : 1;
        if (isErr(s)) { return s; }
        if (isErr(k)) { return k; }
        return k <= 0 ? '' : s.substring(Math.max(0, s.length - k));
    }
    case 'MID': {
        const str: Any = toStr(A(0));
        const startPos: Any = toNum(A(1));
        const length: Any = toNum(A(2));
        if (isErr(str)) { return str; }
        if (isErr(startPos)) { return startPos; }
        if (isErr(length)) { return length; }
        const begin: number = Math.max(0, startPos - 1);
        return str.substring(begin, begin + Math.max(0, length));
    }
    case 'UPPER': {
        const s: Any = toStr(A(0));
        return isErr(s) ? s : s.toUpperCase();
    }
    case 'LOWER': {
        const s: Any = toStr(A(0));
        return isErr(s) ? s : s.toLowerCase();
    }
    case 'TRIM': {
        const s: Any = toStr(A(0));
        return isErr(s) ? s : s.replace(/^ +| +$/g, '').replace(/ {2,}/g, ' ');
    }
    case 'EXACT': return toStr(A(0)) === toStr(A(1));
    case 'CONCATENATE': {
        let o: string = '';
        for (let i: number = 0; i < args.length; i++) {
            const s: Any = toStr(A(i));
            if (isErr(s)) { return s; }
            o += s;
        }
        return o;
    }
    case 'SUBSTITUTE': {
        const s: Any = toStr(A(0));
        const f: Any = toStr(A(1));
        const r: Any = toStr(A(2));
        if (isErr(s)) { return s; }
        if (isErr(f)) { return f; }
        if (isErr(r)) { return r; }
        return f === '' ? s : s.split(f).join(r);
    }
    case 'SEARCH':
    case 'FIND': {
        const f: Any = toStr(A(0));
        const w: Any = toStr(A(1));
        const st: Any = args.length > 2 ? toNum(A(2)) : 1;
        if (isErr(f)) { return f; }
        if (isErr(w)) { return w; }
        if (isErr(st)) { return st; }
        const hay: string = w.substring(Math.max(0, st - 1));
        const idx: number = name === 'FIND' ? hay.indexOf(f) : wildcardFind(f, hay, false);
        return idx < 0 ? new CfErr('#VALUE!') : idx + Math.max(0, st - 1) + 1;
    }
    case 'VALUE': return toNum(A(0));
    case 'SUM': {
        const v: number[] | CfErr = numericArgs(args);
        if (v instanceof CfErr) { return v; }
        return v.reduce((a: number, b: number): number => a + b, 0);
    }
    case 'AVERAGE': {
        const v: number[] | CfErr = numericArgs(args);
        if (v instanceof CfErr) { return v; }
        return v.length ? v.reduce((a: number, b: number): number => a + b, 0) / v.length : new CfErr('#DIV/0!');
    }
    case 'MIN': {
        const v: number[] | CfErr = numericArgs(args);
        if (v instanceof CfErr) { return v; }
        return v.length ? v.reduce((a: number, b: number): number => Math.min(a, b), Infinity) : 0;
    }
    case 'MAX': {
        const v: number[] | CfErr = numericArgs(args);
        if (v instanceof CfErr) { return v; }
        return v.length ? v.reduce((a: number, b: number): number => Math.max(a, b), -Infinity) : 0;
    }
    case 'LARGE':
    case 'SMALL': {
        const v: number[] | CfErr = numericArgs([A(0)]);
        const k: Any = toNum(A(1));
        if (v instanceof CfErr) { return v; }
        if (isErr(k)) { return k; }
        const sorted: number[] = v.slice().sort((x: number, y: number): number => x - y);
        if (k < 1 || k > sorted.length) { return new CfErr('#NUM!'); }
        return name === 'SMALL' ? sorted[k - 1] : sorted[sorted.length - k];
    }
    case 'RANK': {
        const x: Any = toNum(A(0));
        const v: number[] | CfErr = numericArgs([A(1)]);
        const asc: boolean = args.length > 2 && toNum(A(2)) !== 0;
        if (isErr(x)) { return x; }
        if (v instanceof CfErr) { return v; }
        if (v.indexOf(x) < 0) { return new CfErr('#N/A'); }
        return 1 + v.filter((y: number): boolean => (asc ? y < x : y > x)).length;
    }
    case 'COUNT': {
        let k: number = 0;
        const v: Any[] = flat(args);
        for (let i: number = 0; i < v.length; i++) {
            if (typeof v[i as number] === 'number') { k++; }
        }
        return k;
    }
    case 'COUNTA': {
        let count: number = 0;
        const items: Any[] = flat(args);
        for (let idx: number = 0; idx < items.length; idx++) {
            if (!isNullOrUndefined(items[idx as number])) { count++; }
        }
        return count;
    }
    case 'COUNTBLANK': {
        let count: number = 0;
        const items: Any[] = flat(args);
        for (let idx: number = 0; idx < items.length; idx++) {
            const item: Any = items[idx as number];
            if (isNullOrUndefined(item) || item === '') { count++; }
        }
        return count;
    }
    case 'COUNTIF': {
        if (!(A(0) instanceof Rng)) { return new CfErr('#VALUE!'); }
        const m: (v: Any) => boolean = criteriaMatcher(A(1));
        return rangeCells(A(0)).filter(m).length;
    }
    case 'COUNTIFS': {
        if (args.length < 2 || args.length % 2) { return new CfErr('#VALUE!'); }
        const lists: Any[][] = [];
        const ms: ((v: Any) => boolean)[] = [];
        for (let i: number = 0; i < args.length; i += 2) {
            if (!(args[i as number] instanceof Rng)) { return new CfErr('#VALUE!'); }
            lists.push(rangeCells(args[i as number]));
            ms.push(criteriaMatcher(args[i + 1]));
        }
        let k: number = 0;
        for (let j: number = 0; j < lists[0].length; j++) {
            let ok: boolean = true;
            for (let q: number = 0; q < lists.length; q++) {
                if (!ms[q as number](lists[q as number][j as number])) {
                    ok = false;
                    break;
                }
            }
            if (ok) { k++; }
        }
        return k;
    }
    case 'SUMIF': {
        if (!(A(0) instanceof Rng)) { return new CfErr('#VALUE!'); }
        const m: (v: Any) => boolean = criteriaMatcher(A(1));
        const cr: Any[] = rangeCells(A(0));
        const sr: Any[] = args.length > 2 && A(2) instanceof Rng ? rangeCells(A(2)) : cr;
        let t: number = 0;
        for (let j: number = 0; j < cr.length; j++) {
            if (m(cr[j as number]) && typeof sr[j as number] === 'number') { t += sr[j as number]; }
        }
        return t;
    }
    case 'TODAY': return todaySerial();
    case 'NOW': {
        const d: Date = new Date();
        return todaySerial() + (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / 86400;
    }
    case 'YEAR': {
        const x: Any = toNum(A(0));
        return isErr(x) ? x : serialToDate(x).getUTCFullYear();
    }
    case 'MONTH': {
        const x: Any = toNum(A(0));
        return isErr(x) ? x : serialToDate(x).getUTCMonth() + 1;
    }
    case 'DAY': {
        const x: Any = toNum(A(0));
        return isErr(x) ? x : serialToDate(x).getUTCDate();
    }
    case 'WEEKDAY': {
        const x: Any = toNum(A(0));
        const t: Any = args.length > 1 ? toNum(A(1)) : 1;
        if (isErr(x)) { return x; }
        const sun0: number = (((Math.floor(x) - 1) % 7) + 7) % 7;
        if (t === 2) { return ((sun0 + 6) % 7) + 1; }
        if (t === 3) { return (sun0 + 6) % 7; }
        return sun0 + 1;
    }
    case 'DATE': {
        const y: Any = toNum(A(0));
        const m: Any = toNum(A(1));
        const d: Any = toNum(A(2));
        if (isErr(y)) { return y; }
        if (isErr(m)) { return m; }
        if (isErr(d)) { return d; }
        return dateToSerial(y, m, d);
    }
    }
    return new CfErr('#NAME?');
}

/**
 * Evaluates a formula for a cell.
 *
 * @param {SheetCtx} ctx - sheet context
 * @param {string} formula - formula text
 * @param {number} row - row
 * @param {number} col - column
 * @param {Rule | null} rule - owning rule
 * @returns {Any} result
 */
function calc(ctx: SheetCtx, formula: string, row: number, col: number, rule: Rule | null): Any {
    const ast: Any = parseFormula(formula);
    if (!ast) { return new CfErr('#NAME?'); }
    const c: EC = { s: ctx, row, col, dr: rule ? row - rule.baseRow : 0, dc: rule ? col - rule.baseCol : 0, wb: ctx.workbook };
    return scalar(ev(ast, c));
}

/**
 * Converts a hue to an RGB component.
 *
 * @param {number} low - low value
 * @param {number} high - high value
 * @param {number} component - hue component
 * @returns {number} channel value
 */
function hueToRgb(low: number, high: number, component: number): number {
    let t: number = component;
    if (t < 0) { t += 1; }
    if (t > 1) { t -= 1; }
    if (t < 1 / 6) { return low + (high - low) * 6 * t; }
    if (t < 1 / 2) { return high; }
    if (t < 2 / 3) { return low + (high - low) * (2 / 3 - t) * 6; }
    return low;
}

/**
 * Converts a 0..1 channel to a two digit hex string.
 *
 * @param {number} channelVal - channel
 * @returns {string} hex string
 */
function toByteHex(channelVal: number): string {
    const byteHex: string = Math.min(255, Math.max(0, Math.round(channelVal * 255))).toString(16);
    return byteHex.length < 2 ? '0' + byteHex : byteHex;
}

/**
 * Applies an Excel tint to a hex color.
 *
 * @param {string} hex - color
 * @param {number} tint - tint
 * @returns {string} tinted color
 */
function applyTint(hex: string, tint: number): string {
    const red: number = parseInt(hex.substring(1, 3), 16) / 255;
    const green: number = parseInt(hex.substring(3, 5), 16) / 255;
    const blue: number = parseInt(hex.substring(5, 7), 16) / 255;
    const maxChannel: number = Math.max(red, green, blue);
    const minChannel: number = Math.min(red, green, blue);
    let hue: number = 0;
    let saturation: number = 0;
    const lightness: number = (maxChannel + minChannel) / 2;
    if (maxChannel !== minChannel) {
        const delta: number = maxChannel - minChannel;
        if (lightness > 0.5) {
            saturation = delta / (2 - maxChannel - minChannel);
        } else {
            saturation = delta / (maxChannel + minChannel);
        }
        if (maxChannel === red) {
            hue = (green - blue) / delta + (green < blue ? 6 : 0);
        } else if (maxChannel === green) {
            hue = (blue - red) / delta + 2;
        } else {
            hue = (red - green) / delta + 4;
        }
        hue /= 6;
    }
    const nextLightness: number = tint < 0 ? lightness * (1 + tint) : lightness * (1 - tint) + tint;
    let outR: number = nextLightness;
    let outG: number = nextLightness;
    let outB: number = nextLightness;
    if (saturation !== 0) {
        let high: number;
        if (nextLightness < 0.5) {
            high = nextLightness * (1 + saturation);
        } else {
            high = nextLightness + saturation - nextLightness * saturation;
        }
        const low: number = 2 * nextLightness - high;
        outR = hueToRgb(low, high, hue + 1 / 3);
        outG = hueToRgb(low, high, hue);
        outB = hueToRgb(low, high, hue - 1 / 3);
    }
    return ('#' + toByteHex(outR) + toByteHex(outG) + toByteHex(outB)).toUpperCase();
}

/**
 * Blends one channel of two hex colors.
 *
 * @param {string} first - first color
 * @param {string} second - second color
 * @param {number} start - channel start index
 * @param {number} ratio - blend ratio
 * @returns {string} channel hex
 */
function blendChannel(first: string, second: string, start: number, ratio: number): string {
    const a: number = parseInt(first.substring(start, start + 2), 16);
    const b: number = parseInt(second.substring(start, start + 2), 16);
    const byteHex: string = Math.round(a + (b - a) * ratio).toString(16);
    return byteHex.length < 2 ? '0' + byteHex : byteHex;
}

/**
 * Mixes two hex colors.
 *
 * @param {string} firstHex - first color
 * @param {string} secondHex - second color
 * @param {number} ratio - blend ratio
 * @returns {string} mixed color
 */
function mix(firstHex: string, secondHex: string, ratio: number): string {
    const redHex: string = blendChannel(firstHex, secondHex, 1, ratio);
    const greenHex: string = blendChannel(firstHex, secondHex, 3, ratio);
    const blueHex: string = blendChannel(firstHex, secondHex, 5, ratio);
    return ('#' + redHex + greenHex + blueHex).toUpperCase();
}

/**
 * Returns the entries collection of a syncfusion collection-like object.
 *
 * @param {Any} coll - collection
 * @returns {Any} entries
 */
function entriesOf(coll: Any): Any {
    if (!coll) { return coll; }
    if (!isNullOrUndefined(coll.entries)) { return coll.entries; }
    return typeof coll.list === 'function' ? coll.list() : coll;
}

/**
 * Returns the cells of a row as an array.
 *
 * @param {Any} cells - cells collection
 * @returns {Any[]} cell list
 */
function cellListOf(cells: Any): Any[] {
    const cellsObj: Any = entriesOf(cells);
    if (Array.isArray(cellsObj)) { return cellsObj; }
    const list: Any[] = [];
    if (cellsObj && typeof cellsObj === 'object') {
        const cellKeys: string[] = Object.keys(cellsObj);
        for (let keyIndex: number = 0; keyIndex < cellKeys.length; keyIndex++) {
            list.push(cellsObj[cellKeys[keyIndex as number] as string]);
        }
    }
    return list;
}

/**
 * Stores a cell value in the grid.
 *
 * @param {GridInfo} info - grid info
 * @param {number} rowIdx - row
 * @param {number} colIdx - column
 * @param {Any} rawVal - value
 * @returns {void}
 */
function putCell(info: GridInfo, rowIdx: number, colIdx: number, rawVal: Any): void {
    if (isNullOrUndefined(rawVal) || rawVal === '') { return; }
    let val: Any = rawVal;
    if (val instanceof Date) {
        val = dateToNumber(val);
    } else if (typeof val === 'object') {
        let txt: Any = val;
        if (!isNullOrUndefined(val.text)) {
            txt = val.text;
        } else if (!isNullOrUndefined(val.value)) {
            txt = val.value;
        }
        val = String(txt);
    }
    const numVal: number = toN(val);
    if (typeof numVal === 'number' && isFinite(numVal)) { val = numVal; }
    let rowMap: Map<number, Any> | undefined = info.grid.get(rowIdx);
    if (!rowMap) {
        rowMap = new Map<number, Any>();
        info.grid.set(rowIdx, rowMap);
    }
    rowMap.set(colIdx, val);
    if (rowIdx > info.maxRow) { info.maxRow = rowIdx; }
    if (colIdx > info.maxCol) { info.maxCol = colIdx; }
}

export class ConditionalFormattingEngine {
    static zeroBasedRanges: boolean = false;
    static dataBarMinMaxIsAuto: boolean = true;
    static themeColors: string[] = DEFAULT_THEME;
    static debug: boolean = false;

    private static ctxMap: WeakMap<object, SheetCtx> = new WeakMap();

    static reset(sheet?: Any): void {
        if (sheet) {
            this.ctxMap.delete(sheet);
        } else {
            this.ctxMap = new WeakMap();
        }
        astCache.clear();
    }

    static debugDump(sheet: Any, workbook?: Any): Any[] {
        const ctx: SheetCtx = this._ctx(sheet, workbook);
        return ctx.rules.map((r: Rule): Any => ({
            kind: r.kind, priority: r.priority, rects: r.rects, formulas: r.formulas, operator: r.operator,
            stops: r.stops, bar: r.bar, icons: r.icons, rank: r.rank, text: r.text, period: r.period, raw: r.raw
        }));
    }

    static _ctx(sheet: Any, workbook: Any): SheetCtx {
        const existing: SheetCtx | undefined = this.ctxMap.get(sheet);
        if (existing) { return existing; }
        const g: GridInfo = this.buildGrid(sheet);
        const ctx: SheetCtx = {
            sheet,
            workbook,
            name: String(sheet && sheet.name ? sheet.name : ''),
            rules: [],
            grid: g.grid,
            maxRow: g.maxRow,
            maxCol: g.maxCol
        };
        this.ctxMap.set(sheet, ctx);
        ctx.rules = this.buildRules(sheet);
        return ctx;
    }

    static evaluateSheetCF(sheet: Any, workbook: Any, row: number, col: number, val: Any): EvaluatedCF | null {
        if (!sheet) { return null; }
        const ctx: SheetCtx = this._ctx(sheet, workbook);
        if (!ctx.rules.length) { return null; }
        let normalizedValue: Any = val === '' || isNullOrUndefined(val) ? null : val;
        if (normalizedValue instanceof Date) { normalizedValue = dateToNumber(normalizedValue); }
        let out: EvaluatedCF | null = null;
        for (let i: number = 0; i < ctx.rules.length; i++) {
            const rule: Rule = ctx.rules[i as number];
            if (!this.inRects(rule.rects, row, col)) { continue; }
            const res: EvaluatedCF | null = this.evalRule(ctx, rule, row, col, normalizedValue);
            if (!res) { continue; }
            out = out || {};
            this.merge(out, res);
            if (rule.stopIfTrue) { break; }
        }
        return out;
    }

    private static merge(out: EvaluatedCF, res: EvaluatedCF): void {
        const target: Any = out;
        const source: Any = res;
        Object.keys(source).forEach((propKey: string): void => {
            if (isNullOrUndefined(source[propKey as string])) { return; }
            if (propKey === 'borders') {
                target.borders = target.borders || {};
                ['left', 'right', 'top', 'bottom'].forEach((edge: string): void => {
                    if (source.borders[edge as string] && !target.borders[edge as string]) {
                        target.borders[edge as string] = source.borders[edge as string];
                    }
                });
            } else if (isNullOrUndefined(target[propKey as string])) {
                target[propKey as string] = source[propKey as string];
            }
        });
    }

    private static inRects(rects: number[][], row: number, col: number): boolean {
        for (let i: number = 0; i < rects.length; i++) {
            const q: number[] = rects[i as number];
            if (row >= q[0] && row <= q[2] && col >= q[1] && col <= q[3]) { return true; }
        }
        return false;
    }

    private static hit(ctx: SheetCtx, rule: Rule): EvaluatedCF {
        return Object.assign({}, this.styleFor(ctx, rule));
    }

    private static evalRule(ctx: SheetCtx, rule: Rule, row: number, col: number, v: Any): EvaluatedCF | null {
        const numVal: number = toN(v);
        const isNum: boolean = typeof numVal === 'number' && isFinite(numVal);
        switch (rule.kind) {
        case 'colorScale': return isNum ? this.evalScale(ctx, rule, row, col, numVal) : null;
        case 'dataBar': return isNum ? this.evalBar(ctx, rule, row, col, numVal) : null;
        case 'iconSet': return isNum ? this.evalIcon(ctx, rule, row, col, numVal) : null;
        case 'expression': {
            if (!rule.formulas.length) { return null; }
            const r: Any = calc(ctx, rule.formulas[0], row, col, rule);
            let ok: boolean = false;
            if (typeof r === 'boolean') {
                ok = r;
            } else if (typeof r === 'number') {
                ok = r !== 0;
            }
            return ok ? this.hit(ctx, rule) : null;
        }
        case 'cellIs': return this.evalCellIs(ctx, rule, row, col, v) ? this.hit(ctx, rule) : null;
        case 'text': return this.evalText(ctx, rule, row, col, v) ? this.hit(ctx, rule) : null;
        case 'blanks': {
            const isBlank: boolean = isNullOrUndefined(v) || (typeof v === 'string' && v.trim() === '');
            return (rule.negate ? !isBlank : isBlank) ? this.hit(ctx, rule) : null;
        }
        case 'errors': {
            const e: boolean = isErrorString(v);
            return (rule.negate ? !e : e) ? this.hit(ctx, rule) : null;
        }
        case 'top10': {
            if (!isNum) { return null; }
            const st: Stats = this.statsFor(ctx, rule);
            const n: number = st.sorted.length;
            if (!n) { return null; }
            const k: number = rule.percent ? Math.max(1, Math.floor(n * rule.rank / 100)) : Math.min(Math.max(1, rule.rank), n);
            const ok: boolean = rule.bottom ? numVal <= st.sorted[k - 1] : numVal >= st.sorted[n - k];
            return ok ? this.hit(ctx, rule) : null;
        }
        case 'average': {
            if (!isNum) { return null; }
            const st: Stats = this.statsFor(ctx, rule);
            if (!st.n) { return null; }
            const m: number = rule.stdDev > 0 ? rule.stdDev * st.sd : 0;
            let ok: boolean;
            if (rule.above) {
                const t: number = st.avg + m;
                ok = rule.equalAverage ? numVal >= t : numVal > t;
            } else {
                const t: number = st.avg - m;
                ok = rule.equalAverage ? numVal <= t : numVal < t;
            }
            return ok ? this.hit(ctx, rule) : null;
        }
        case 'duplicate':
        case 'unique': {
            const k: string = this.cellKey(v);
            if (!k) { return null; }
            const cnt: number = this.statsFor(ctx, rule).counts.get(k) || 0;
            const match: boolean = rule.kind === 'duplicate' ? cnt > 1 : cnt === 1;
            return match ? this.hit(ctx, rule) : null;
        }
        case 'timePeriod': return isNum && this.evalPeriod(rule.period, numVal) ? this.hit(ctx, rule) : null;
        }
        return null;
    }

    private static evalPeriod(p: string, v: number): boolean {
        const d: number = Math.floor(v);
        const t: number = todaySerial();
        const dd: Date = serialToDate(d);
        const td: Date = serialToDate(t);
        const dow: number = (((t - 1) % 7) + 7) % 7;
        switch (p) {
        case 'today': return d === t;
        case 'yesterday': return d === t - 1;
        case 'tomorrow': return d === t + 1;
        case 'last7days': return d >= t - 6 && d <= t;
        case 'thisweek': return d >= t - dow && d <= t - dow + 6;
        case 'lastweek': return d >= t - dow - 7 && d <= t - dow - 1;
        case 'nextweek': return d >= t - dow + 7 && d <= t - dow + 13;
        case 'thismonth': return monthIndex(dd) === monthIndex(td);
        case 'lastmonth': return monthIndex(dd) === monthIndex(td) - 1;
        case 'nextmonth': return monthIndex(dd) === monthIndex(td) + 1;
        }
        return false;
    }

    private static evalCellIs(ctx: SheetCtx, rule: Rule, row: number, col: number, v: Any): boolean {
        const f1: Any = rule.formulas.length > 0 ? calc(ctx, rule.formulas[0], row, col, rule) : null;
        const f2: Any = rule.formulas.length > 1 ? calc(ctx, rule.formulas[1], row, col, rule) : null;
        if (isErr(f1) || isErr(f2)) { return false; }
        const c1: number = compareVals(v, f1);
        switch (rule.operator) {
        case 'equal': return c1 === 0;
        case 'notEqual': return c1 !== 0;
        case 'greaterThan': return c1 > 0;
        case 'greaterThanOrEqual': return c1 >= 0;
        case 'lessThan': return c1 < 0;
        case 'lessThanOrEqual': return c1 <= 0;
        case 'between':
        case 'notBetween': {
            const ordered: boolean = compareVals(f1, f2) <= 0;
            const lo: Any = ordered ? f1 : f2;
            const hi: Any = ordered ? f2 : f1;
            const inside: boolean = compareVals(v, lo) >= 0 && compareVals(v, hi) <= 0;
            return rule.operator === 'between' ? inside : !inside;
        }
        }
        return false;
    }

    private static evalText(ctx: SheetCtx, rule: Rule, row: number, col: number, v: Any): boolean {
        if (!isNullOrUndefined(rule.text)) {
            const hay: string = isNullOrUndefined(v) ? '' : String(v).toLowerCase();
            const needle: string = String(rule.text).toLowerCase();
            switch (rule.textOp) {
            case 'contains': return !isNullOrUndefined(v) && hay.indexOf(needle) >= 0;
            case 'notcontains': return hay.indexOf(needle) < 0;
            case 'begins': return !isNullOrUndefined(v) && hay.substring(0, needle.length) === needle;
            case 'ends': return !isNullOrUndefined(v) && needle.length <= hay.length && hay.substring(hay.length - needle.length) === needle;
            }
            return false;
        }
        if (!rule.formulas.length) { return false; }
        const r: Any = calc(ctx, rule.formulas[0], row, col, rule);
        return r === true || (typeof r === 'number' && r !== 0);
    }

    private static cellKey(v: Any): string {
        if (isNullOrUndefined(v) || v === '') { return ''; }
        if (typeof v === 'number') { return 'n:' + v; }
        return typeof v === 'boolean' ? 'b:' + v : 's:' + String(v).toLowerCase();
    }

    private static statsFor(ctx: SheetCtx, rule: Rule): Stats {
        if (rule.stats) { return rule.stats; }
        const nums: number[] = [];
        const counts: Map<string, number> = new Map<string, number>();
        for (let i: number = 0; i < rule.rects.length; i++) {
            const q: number[] = rule.rects[i as number];
            ctx.grid.forEach((cells: Map<number, Any>, r: number): void => {
                if (r < q[0] || r > q[2]) { return; }
                cells.forEach((v: Any, c: number): void => {
                    if (c < q[1] || c > q[3]) { return; }
                    const nv: number = toN(v);
                    if (typeof nv === 'number' && isFinite(nv)) { nums.push(nv); }
                    const k: string = this.cellKey(v);
                    if (k) { counts.set(k, (counts.get(k) || 0) + 1); }
                });
            });
        }
        nums.sort((a: number, b: number): number => a - b);
        const n: number = nums.length;
        const sum: number = nums.reduce((a: number, b: number): number => a + b, 0);
        const avg: number = n ? sum / n : 0;
        const sd: number = n > 1 ? Math.sqrt(nums.reduce((a: number, b: number): number => a + (b - avg) * (b - avg), 0) / (n - 1)) : 0;
        rule.stats = { min: n ? nums[0] : 0, max: n ? nums[n - 1] : 0, n, avg, sd, sorted: nums, counts };
        return rule.stats;
    }

    private static percentile(sorted: number[], p: number): number {
        const n: number = sorted.length;
        if (!n) { return 0; }
        if (n === 1) { return sorted[0]; }
        const idx: number = Math.max(0, Math.min(100, p)) / 100 * (n - 1);
        const lo: number = Math.floor(idx);
        const hi: number = Math.ceil(idx);
        if (lo === hi) { return sorted[lo as number]; }
        return sorted[lo as number] + (sorted[hi as number] - sorted[lo as number]) * (idx - lo);
    }

    private static cfvoValue(ctx: SheetCtx, rule: Rule, c: Cfvo, st: Stats, row: number, col: number): number {
        switch (c.type) {
        case 'min':
        case 'lowestvalue':
            return st.min;
        case 'max':
        case 'highestvalue':
            return st.max;
        case 'percent':
            return st.min + (toN(c.value) / 100) * (st.max - st.min);
        case 'percentile':
            return this.percentile(st.sorted, toN(c.value));
        case 'formula': {
            const r: Any = calc(ctx, String(c.value), row, col, rule);
            return typeof r === 'number' ? r : NaN;
        }
        default:
            return toN(c.value);
        }
    }

    private static evalScale(ctx: SheetCtx, rule: Rule, row: number, col: number, v: number): EvaluatedCF | null {
        const st: Stats = this.statsFor(ctx, rule);
        if (!st.n || rule.stops.length < 2) { return null; }
        const pts: { x: number; color: string }[] = rule.stops.map((s: Stop, i: number): { x: number; color: string } => {
            let x: number = this.cfvoValue(ctx, rule, s.cfvo, st, row, col);
            if (isNaN(x)) {
                if (i === 0) {
                    x = st.min;
                } else if (i === rule.stops.length - 1) {
                    x = st.max;
                } else {
                    x = this.percentile(st.sorted, 50);
                }
            }
            return { x, color: s.color };
        });
        const last: number = pts.length - 1;
        let hexCol: string;
        const pt0: { x: number; color: string } = pts[0];
        const ptLast: { x: number; color: string } = pts[last as number];
        if (v <= pt0.x) {
            hexCol = pt0.color;
        } else if (v >= ptLast.x) {
            hexCol = ptLast.color;
        } else {
            let i: number = 0;
            while (i < last - 1 && v >= pts[(i + 1) as number].x) { i++; }
            const a: { x: number; color: string } = pts[i as number];
            const b: { x: number; color: string } = pts[(i + 1) as number];
            hexCol = b.x === a.x ? b.color : mix(a.color, b.color, (v - a.x) / (b.x - a.x));
        }
        return { fillColor: hexCol };
    }

    private static isAutoCfvo(c: Cfvo): boolean {
        if (c.type === 'automatic' || c.type === 'automin' || c.type === 'automax' || c.type === '') { return true; }
        return (c.type === 'min' || c.type === 'max') && this.dataBarMinMaxIsAuto;
    }

    private static evalBar(ctx: SheetCtx, rule: Rule, row: number, col: number, v: number): EvaluatedCF | null {
        const st: Stats = this.statsFor(ctx, rule);
        const b: DataBarRule | undefined = rule.bar;
        if (!st.n || !b) { return null; }
        let lo: number = this.isAutoCfvo(b.min) ? Math.min(0, st.min) : this.cfvoValue(ctx, rule, b.min, st, row, col);
        let hi: number = this.isAutoCfvo(b.max) ? Math.max(0, st.max) : this.cfvoValue(ctx, rule, b.max, st, row, col);
        if (isNaN(lo)) { lo = Math.min(0, st.min); }
        if (isNaN(hi)) { hi = Math.max(0, st.max); }
        if (hi <= lo) { hi = lo + 1; }
        const x: number = Math.max(lo, Math.min(hi, v));
        const span: number = hi - lo;
        const hasAxis: boolean = lo < 0 && b.axisPos !== 'none';
        let start: number = 0;
        let len: number = 0;
        let axis: number | null = null;
        if (hasAxis) {
            if (b.axisPos === 'midpoint') {
                axis = 0.5;
                const m: number = Math.max(-lo, hi);
                len = Math.min(0.5, Math.abs(x) / m * 0.5);
            } else {
                axis = -lo / span;
                len = Math.abs(x) / span;
            }
            start = x >= 0 ? axis : axis - len;
        } else if (b.axisPos === 'none' && lo < 0) {
            len = Math.abs(x) / Math.max(-lo, hi);
        } else {
            len = (x - lo) / span;
            len = b.minLen / 100 + len * ((b.maxLen - b.minLen) / 100);
        }
        const neg: boolean = v < 0;
        const color: string = neg && !b.negSame ? b.negColor : b.color;
        let border: string | undefined;
        if (b.border) {
            if (neg) {
                border = b.negSame ? b.borderColor : b.negBorderColor;
            } else {
                border = b.borderColor;
            }
        }
        return {
            hideValue: b.showValue ? undefined : true,
            dataBar: {
                startFrac: start, lenFrac: Math.max(0, Math.min(1, len)), axisFrac: axis, color, border, axisColor: b.axisColor,
                isGradient: b.gradient, isNegative: neg, rtl: b.rtl, percent: Math.max(0, Math.min(1, len))
            }
        };
    }

    private static evalIcon(ctx: SheetCtx, rule: Rule, row: number, col: number, v: number): EvaluatedCF | null {
        const ic: IconSetRule | undefined = rule.icons;
        if (!ic || !ic.set || ic.set === 'NoIcons') { return null; }
        const st: Stats = this.statsFor(ctx, rule);
        if (!st.n) { return null; }
        const n: number = ic.count;
        let idx: number = 0;
        for (let i: number = n - 1; i >= 1; i--) {
            const c: Cfvo = ic.crit[i as number] || { type: 'percent', value: Math.round(i * 100 / n), gte: true };
            let t: number = this.cfvoValue(ctx, rule, c, st, row, col);
            if (isNaN(t)) { t = st.min + (i / n) * (st.max - st.min); }
            if (c.gte ? v >= t : v > t) {
                idx = i;
                break;
            }
        }
        if (ic.reverse) { idx = n - 1 - idx; }
        return {
            hideValue: ic.showValue ? undefined : true,
            iconSet: { set: ic.set, index: idx, count: n, icon: ic.set + '_' + idx }
        };
    }

    private static styleFor(ctx: SheetCtx, rule: Rule): EvaluatedCF {
        if (rule.style) { return rule.style; }
        const cf: Any = rule.raw;
        const st: EvaluatedCF = {};
        const PRESET: { [k: string]: string[] } = {
            redft: ['#FFC7CE', '#9C0006'],
            yellowft: ['#FFEB9C', '#9C5700'],
            greenft: ['#C6EFCE', '#006100'],
            redf: ['#FFC7CE', ''],
            redt: ['', '#9C0006']
        };
        const prKey: string = key(pick(cf, 'cFColor', 'cfColor', 'preset'));
        const pr: string[] | undefined = Object.prototype.hasOwnProperty.call(PRESET, prKey) ? PRESET[prKey as string] : undefined;
        if (pr) {
            if (pr[0]) { st.fillColor = pr[0]; }
            if (pr[1]) { st.textColor = pr[1]; }
        }
        const cands: Any[] = [pick(cf, 'format'), pick(cf, 'dxf'), pick(cf, 'differentialFormat'), pick(cf, 'style')];
        const id: Any = pick(cf, 'dxfId', 'dxfIndex');
        const wb: Any = ctx.workbook;
        if (!isNullOrUndefined(id) && wb) {
            const src: Any = wb.stylesTable || wb.styles || wb;
            let f: Any;
            if (src && typeof src.getDifferentialFormat === 'function') {
                f = src.getDifferentialFormat(id);
            }
            if (!f && src) {
                const arr: Any = src.differentialFormats || src.dxfs || src.differentialStyles;
                if (arr) { f = typeof arr.get === 'function' ? arr.get(id) : arr[id as number]; }
            }
            cands.push(f);
        }
        for (let i: number = 0; i < cands.length; i++) {
            this.readDxf(cands[i as number], st);
        }
        rule.style = st;
        return st;
    }

    private static readDxf(o: Any, st: EvaluatedCF): void {
        if (!o || typeof o !== 'object') { return; }
        const fill: Any = o.fill;
        if (fill && isNullOrUndefined(st.fillColor)) {
            const col: string = this.resolveColor(pick(fill, 'bgColor', 'fgColor', 'color'));
            if (col) { st.fillColor = col; }
        }
        if (o.fillColor && isNullOrUndefined(st.fillColor)) {
            const col: string = this.resolveColor(o.fillColor);
            if (col) { st.fillColor = col; }
        }
        if (o.fontColor && isNullOrUndefined(st.textColor)) {
            const col: string = this.resolveColor(o.fontColor);
            if (col) { st.textColor = col; }
        }
        const css: Any = o.style && typeof o.style === 'object' && !o.style.font ? o.style : null;
        if (css) {
            if (css.backgroundColor && isNullOrUndefined(st.fillColor)) { st.fillColor = this.resolveColor(css.backgroundColor); }
            if (css.color && isNullOrUndefined(st.textColor)) { st.textColor = this.resolveColor(css.color); }
            if (css.fontWeight === 'bold' && isNullOrUndefined(st.isBold)) { st.isBold = true; }
            if (css.fontStyle === 'italic' && isNullOrUndefined(st.isItalic)) { st.isItalic = true; }
        }
        const font: Any = o.font;
        if (font) {
            const fc: string = this.resolveColor(font.color);
            if (fc && isNullOrUndefined(st.textColor)) { st.textColor = fc; }
            if (!isNullOrUndefined(font.bold) && isNullOrUndefined(st.isBold)) { st.isBold = Boolean(font.bold); }
            if (!isNullOrUndefined(font.italic) && isNullOrUndefined(st.isItalic)) { st.isItalic = Boolean(font.italic); }
            const underlineVal: Any = pick(font, 'underline');
            if (!isNullOrUndefined(underlineVal) && isNullOrUndefined(st.isUnderline)) {
                st.isUnderline = underlineVal !== false && String(underlineVal).toLowerCase() !== 'none';
            }
            const strikeVal: Any = pick(font, 'strike', 'strikethrough');
            if (!isNullOrUndefined(strikeVal) && isNullOrUndefined(st.isStrike)) { st.isStrike = Boolean(strikeVal); }
        }
        const nf: Any = pick(o, 'numberFormat', 'numFmt');
        if (!isNullOrUndefined(nf) && isNullOrUndefined(st.numberFormat)) {
            const code: Any = typeof nf === 'string' ? nf : pick(nf, 'formatCode', 'format', 'code');
            if (code) { st.numberFormat = String(code); }
        }
        const bs: Any = pick(o, 'borders', 'border');
        if (bs) {
            const edgeList: string[] = ['left', 'right', 'top', 'bottom'];
            for (let eIdx: number = 0; eIdx < edgeList.length; eIdx++) {
                const edge: string = edgeList[eIdx as number];
                const borderEdge: Any = Object.prototype.hasOwnProperty.call(bs, edge) ? bs[edge as string] : undefined;
                if (!borderEdge || !borderEdge.style || String(borderEdge.style).toLowerCase() === 'none') {
                    continue;
                }
                st.borders = st.borders || {};
                const currentBorders: Any = st.borders;
                if (!currentBorders[edge as string]) {
                    currentBorders[edge as string] = {
                        style: String(borderEdge.style),
                        color: this.resolveColor(borderEdge.color) || undefined
                    };
                }
            }
        }
    }

    static resolveColor(c: Any): string {
        if (!c) { return ''; }
        if (typeof c === 'string') { return formatHexColor(c); }
        let hexCol: string = '';
        const rgb: Any = pick(c, 'rgbColor', 'rgb', 'argb');
        if (!isNullOrUndefined(rgb)) {
            hexCol = formatHexColor(String(rgb));
        } else if (!isNullOrUndefined(c.theme)) {
            hexCol = this.themeColors[Number(c.theme)] || '';
        } else if (!isNullOrUndefined(c.indexed)) {
            const ix: string | undefined = INDEXED[Number(c.indexed)];
            hexCol = ix ? '#' + ix : '';
        }
        if (hexCol && c.tint) { hexCol = applyTint(hexCol, Number(c.tint)); }
        return hexCol;
    }

    private static buildGrid(sheet: Any): GridInfo {
        const info: GridInfo = { grid: new Map<number, Map<number, Any>>(), maxRow: 0, maxCol: 0 };
        const entries: Any = entriesOf(sheet && sheet.rows);
        if (Array.isArray(entries)) {
            for (let rowOffset: number = 0; rowOffset < entries.length; rowOffset++) {
                const rowObj: Any = entries[rowOffset as number];
                if (!rowObj) { continue; }
                const rowIdxVal: Any = pick(rowObj, 'index', 'row');
                const rowIdx: number = !isNullOrUndefined(rowIdxVal) ? Number(rowIdxVal) : rowOffset + 1;
                const cellList: Any[] = cellListOf(rowObj.cells);
                for (let cellOffset: number = 0; cellOffset < cellList.length; cellOffset++) {
                    const cellObj: Any = cellList[cellOffset as number];
                    if (!cellObj) { continue; }
                    const colIdxVal: Any = pick(cellObj, 'index', 'col', 'column');
                    const colIdx: number = !isNullOrUndefined(colIdxVal) ? Number(colIdxVal) : cellOffset + 1;
                    putCell(info, rowIdx, colIdx, pick(cellObj, 'value', 'val'));
                }
            }
        }
        if (info.grid.size === 0 && sheet && typeof sheet.cell === 'function') {
            const ur: Any = sheet.usedRange || {};
            const r1: number = ur.firstRow || 1;
            const r2: number = ur.lastRow || 100;
            const c1: number = ur.firstColumn || 1;
            const c2: number = ur.lastColumn || 50;
            for (let rowIdx: number = r1; rowIdx <= r2; rowIdx++) {
                for (let colIdx: number = c1; colIdx <= c2; colIdx++) {
                    const cell: Any = sheet.cell(rowIdx, colIdx);
                    if (cell && !isNullOrUndefined(cell.value) && cell.value !== '') {
                        putCell(info, rowIdx, colIdx, cell.value);
                    }
                }
            }
        }
        return info;
    }

    private static buildRules(sheet: Any): Rule[] {
        const list: Any = sheet && (sheet.conditionalFormats || sheet.conditionalFormatting || sheet._conditionalFormats);
        if (!list) { return []; }
        const raw: Any[] = Array.isArray(list) ? list : (list.entries || (typeof list.list === 'function' ? list.list() : []));
        const out: Rule[] = [];
        for (let i: number = 0; i < (raw || []).length; i++) {
            const cf: Any = (raw || [])[i as number];
            if (!cf) { continue; }
            const inner: Any = pick(cf, 'rules', 'cfRules', 'formats');
            if (Array.isArray(inner) && inner.length && !pick(cf, 'type', 'cfType', 'ruleType', 'formatType')) {
                inner.forEach((innerRule: Any): void => {
                    const ruleSqref: Any = pick(innerRule, 'sqref', 'range');
                    const mergedSqref: Any = !isNullOrUndefined(ruleSqref)
                        ? ruleSqref
                        : pick(cf, 'sqref', 'range', 'ranges', 'address');
                    const normalized: Rule | null = this.normalize(Object.assign({}, innerRule, { sqref: mergedSqref }), out.length);
                    if (normalized) { out.push(normalized); }
                });
                continue;
            }
            const normalizedRule: Rule | null = this.normalize(cf, out.length);
            if (normalizedRule) { out.push(normalizedRule); }
        }
        return out.sort((first: Rule, second: Rule): number => first.priority - second.priority || first.index - second.index);
    }

    private static toCfvo(s: Any, fallbackType: string): Cfvo {
        let cfvoType: string = key(pick(s, 'type', 'cfvoType', 'valueType', 'kind'));
        const value: Any = pick(s, 'value', 'val', 'formula');
        if (!cfvoType) { cfvoType = !isNullOrUndefined(value) && value !== '' ? 'num' : fallbackType; }
        if (cfvoType === 'number') { cfvoType = 'num'; }
        const op: string = key(pick(s, 'operator'));
        const gte: Any = pick(s, 'greaterThanOrEqual', 'gte', 'greaterOrEqual');
        return { type: cfvoType, value, gte: !isNullOrUndefined(gte) ? truthyFlag(gte, true) : op !== 'greaterthan' };
    }

    private static toRects(cf: Any): number[][] {
        const out: number[][] = [];
        const zb: number = this.zeroBasedRanges ? 1 : 0;
        const A1: (txt: string) => void = (txt: string): void => {
            txt.split(/[\s,]+/).filter(Boolean).forEach((ref0: string): void => {
                const ref: string = ref0.indexOf('!') >= 0 ? ref0.substring(ref0.lastIndexOf('!') + 1) : ref0;
                const m: RefMatch | null = matchRef(ref);
                if (!m) { return; }
                const p: Any = parseRefMatch(m);
                const a: { row: number; col: number } = p.a;
                const b: { row: number; col: number } = p.b || p.a;
                out.push([Math.min(a.row, b.row), Math.min(a.col, b.col), Math.max(a.row, b.row), Math.max(a.col, b.col)]);
            });
        };
        const walk: (v: Any) => void = (v: Any): void => {
            if (isNullOrUndefined(v)) { return; }
            if (typeof v === 'string') {
                A1(v);
                return;
            }
            if (Array.isArray(v)) {
                if (v.length >= 4 && v.every((x: Any): boolean => typeof x === 'number')) {
                    out.push([v[0] + zb, v[1] + zb, v[2] + zb, v[3] + zb]);
                } else {
                    v.forEach(walk);
                }
                return;
            }
            if (typeof v === 'object') {
                const r1: Any = pick(v, 'startRow', 'firstRow', 'row', 'top');
                const c1: Any = pick(v, 'startCol', 'startColumn', 'firstColumn', 'col', 'column', 'left');
                if (typeof r1 === 'number' && typeof c1 === 'number') {
                    const r2: Any = pick(v, 'endRow', 'lastRow', 'bottom');
                    const c2: Any = pick(v, 'endCol', 'endColumn', 'lastColumn', 'right');
                    out.push([r1 + zb, c1 + zb, (typeof r2 === 'number' ? r2 : r1) + zb, (typeof c2 === 'number' ? c2 : c1) + zb]);
                } else {
                    walk(pick(v, 'address', 'sqref', 'range', 'ref'));
                }
            }
        };
        walk(pick(cf, 'sqref', 'range', 'ranges', 'address', 'cells', 'appliesTo', 'ref'));
        return out;
    }

    private static normalize(cf: Any, index: number): Rule | null {
        const rects: number[][] = this.toRects(cf);
        if (!rects.length) { return null; }
        const tkey: string = key(pick(cf, 'type', 'cfType', 'ruleType', 'formatType'));
        let kind: Kind = kindOf(tkey) || 'unknown';
        if (kind === 'unknown') {
            if (pick(cf, 'colorScaleData', 'colorScale') || tkey.indexOf('colorscale') >= 0) {
                kind = 'colorScale';
            } else if (pick(cf, 'dataBarData', 'dataBar') || tkey.indexOf('databar') >= 0 || tkey.indexOf('bar') >= 0) {
                kind = 'dataBar';
            } else if (pick(cf, 'iconSetData', 'iconSet') || tkey.indexOf('iconset') >= 0 || tkey.indexOf('icon') >= 0) {
                kind = 'iconSet';
            } else if (pick(cf, 'operator')) {
                kind = 'cellIs';
            } else if (pick(cf, 'formula', 'formulas', 'formula1')) {
                kind = 'expression';
            }
        }
        let minR: number = Infinity;
        let minC: number = Infinity;
        rects.forEach((q: number[]): void => {
            if (q[0] < minR) { minR = q[0]; }
            if (q[1] < minC) { minC = q[1]; }
        });
        const prio: number = toN(pick(cf, 'priority'));
        const rule: Rule = {
            raw: cf,
            index,
            kind,
            priority: isNaN(prio) ? 1e9 + index : prio,
            stopIfTrue: truthyFlag(pick(cf, 'stopIfTrue'), false),
            rects,
            baseRow: minR,
            baseCol: minC,
            formulas: [],
            operator: '',
            negate: /^(not|no)/.test(tkey) || tkey === 'notcontainsblanks',
            textOp: '',
            rank: 10,
            percent: false,
            bottom: false,
            above: true,
            equalAverage: false,
            stdDev: 0,
            period: '',
            stops: []
        };
        const add: (v: Any) => void = (v: Any): void => {
            if (isNullOrUndefined(v) || v === '') { return; }
            if (Array.isArray(v)) {
                v.forEach(add);
            } else {
                rule.formulas.push(String(v));
            }
        };
        add(pick(cf, 'formulas'));
        add(pick(cf, 'formula'));
        add(pick(cf, 'formula1', 'firstFormula'));
        add(pick(cf, 'formula2', 'secondFormula'));
        if (!rule.formulas.length) {
            add(pick(cf, 'values'));
            add(pick(cf, 'value', 'value1'));
            add(pick(cf, 'value2'));
        }
        const opVal: Any = pick(cf, 'operator', 'op');
        const tkeyKind: Kind | undefined = kindOf(tkey);
        const opRaw: string = key(opVal) || (tkeyKind === 'cellIs' ? tkey : '');
        if (kind === 'cellIs') {
            if (opRaw.indexOf('notbetween') >= 0) {
                rule.operator = 'notBetween';
            } else if (opRaw.indexOf('between') >= 0) {
                rule.operator = 'between';
            } else if (opRaw.indexOf('notequal') >= 0) {
                rule.operator = 'notEqual';
            } else if (opRaw.indexOf('greaterthanorequal') >= 0 || opRaw === 'greaterequal') {
                rule.operator = 'greaterThanOrEqual';
            } else if (opRaw.indexOf('lessthanorequal') >= 0 || opRaw === 'lessequal') {
                rule.operator = 'lessThanOrEqual';
            } else if (opRaw.indexOf('greater') >= 0) {
                rule.operator = 'greaterThan';
            } else if (opRaw.indexOf('less') >= 0) {
                rule.operator = 'lessThan';
            } else {
                rule.operator = 'equal';
            }
        }
        if (kind === 'text') {
            const textValue: Any = pick(cf, 'text', 'textValue');
            if (!isNullOrUndefined(textValue)) {
                rule.text = String(textValue);
            } else if (rule.formulas.length && /^"[\s\S]*"$/.test(rule.formulas[0].trim())) {
                rule.text = rule.formulas[0].trim().slice(1, -1).replace(/""/g, '"');
            }
            const opKey: string = tkey === 'specifictext' || tkey === 'text' ? opRaw : tkey;
            if (opKey.indexOf('notcontain') >= 0) {
                rule.textOp = 'notcontains';
            } else if (opKey.indexOf('contain') >= 0) {
                rule.textOp = 'contains';
            } else if (opKey.indexOf('begin') >= 0) {
                rule.textOp = 'begins';
            } else if (opKey.indexOf('end') >= 0) {
                rule.textOp = 'ends';
            } else {
                rule.textOp = 'contains';
            }
            if (isNullOrUndefined(rule.text)) { rule.formulas = rule.formulas.slice(0, 1); }
        }
        if (kind === 'top10') {
            const rankVal: number = toN(pick(cf, 'rank', 'value', 'count', 'topBottomValue'));
            rule.rank = isNaN(rankVal) ? 10 : rankVal;
            rule.percent = truthyFlag(pick(cf, 'percent', 'isPercent'), false) || tkey.indexOf('percent') >= 0;
            let isBottom: boolean = truthyFlag(pick(cf, 'bottom', 'isBottom'), false);
            if (tkey.indexOf('bottom') >= 0) { isBottom = true; }
            if (key(pick(cf, 'topBottom', 'topBottomType')) === 'bottom') { isBottom = true; }
            rule.bottom = isBottom;
        }
        if (kind === 'average') {
            const aboveAvg: Any = pick(cf, 'aboveAverage', 'isAboveAverage');
            if (!isNullOrUndefined(aboveAvg)) {
                rule.above = truthyFlag(aboveAvg, true);
            } else {
                rule.above = !(tkey === 'belowaverage' || truthyFlag(pick(cf, 'bottom'), false));
            }
            rule.equalAverage = truthyFlag(pick(cf, 'equalAverage'), false);
            const stdDev: number = toN(pick(cf, 'stdDev', 'standardDeviation'));
            rule.stdDev = isNaN(stdDev) ? 0 : stdDev;
        }
        if (kind === 'timePeriod') { rule.period = key(pick(cf, 'timePeriod', 'period', 'dateOperator', 'operator')); }
        if (kind === 'colorScale') { this.normScale(cf, rule); }
        if (kind === 'dataBar') { this.normBar(cf, rule); }
        if (kind === 'iconSet') { this.normIcons(cf, rule); }
        if (kind === 'unknown') { return null; }
        return rule;
    }

    private static normScale(cf: Any, rule: Rule): void {
        const d: Any = pick(cf, 'colorScaleData', 'colorScale') || cf;
        let raw: Any = pick(d, 'stops', 'points', 'criteria');
        if (!Array.isArray(raw)) { raw = [d.minPoint, d.midPoint, d.maxPoint].filter(Boolean); }
        if ((!raw || !raw.length) && Array.isArray(d.cfvos) && Array.isArray(d.colors)) {
            raw = d.cfvos.map((v: Any, i: number): Any => Object.assign({}, v, {
                color: d.colors[i as number]
            }));
        }
        rule.stops = (raw || []).map((stop: Any, idx: number, arr: Any[]): Stop => {
            let typeFallback: string = 'percentile';
            let colorFallback: string = '#FFEB84';
            if (idx === 0) {
                typeFallback = 'min';
                colorFallback = '#F8696B';
            } else if (idx === arr.length - 1) {
                typeFallback = 'max';
                colorFallback = '#63BE7B';
            }
            return {
                cfvo: this.toCfvo(stop, typeFallback),
                color: this.resolveColor(pick(stop, 'color', 'colour', 'rgb')) || colorFallback
            };
        });
        rule.stops.forEach((stop: Stop): void => {
            if (stop.cfvo.type === 'percentile' && (isNullOrUndefined(stop.cfvo.value) || stop.cfvo.value === '')) {
                stop.cfvo.value = 50;
            }
        });
    }

    private static normBar(cf: Any, rule: Rule): void {
        const d: Any = pick(cf, 'dataBarData', 'dataBar') || cf;
        let mn: Any = pick(d, 'minPoint', 'min', 'minimum');
        let mx: Any = pick(d, 'maxPoint', 'max', 'maximum');
        if (Array.isArray(d.cfvos)) {
            mn = mn || d.cfvos[0];
            mx = mx || d.cfvos[1];
        }
        const color: string = this.resolveColor(pick(d, 'barColor', 'color', 'fillColor', 'positiveColor')) || '#638EC6';
        const neg: string = this.resolveColor(pick(d, 'negativeBarColor', 'negativeFillColor', 'negativeColor')) || '#FF0000';
        const dir: string = key(pick(d, 'direction', 'barDirection'));
        const showIconOnly: Any = pick(d, 'showIconOnly', 'showBarOnly');
        const sv: Any = pick(d, 'showValue');
        const showValue: boolean = !isNullOrUndefined(showIconOnly) ? !truthyFlag(showIconOnly, false) : truthyFlag(sv, true);
        const ml: number = toN(pick(d, 'minLength'));
        const xl: number = toN(pick(d, 'maxLength'));
        const grad: Any = pick(d, 'gradient', 'showGradient', 'hasGradientFill');
        rule.bar = {
            min: this.toCfvo(mn, 'automatic'),
            max: this.toCfvo(mx, 'automatic'),
            color,
            negColor: neg,
            negSame: truthyFlag(pick(d, 'negativeBarColorSameAsPositive', 'negativeFillSameAsPositive'), false),
            border: truthyFlag(pick(d, 'hasBorder', 'showBorder', 'border'), false),
            borderColor: this.resolveColor(pick(d, 'borderColor', 'barBorderColor')) || color,
            negBorderColor: this.resolveColor(pick(d, 'negativeBorderColor', 'negativeBarBorderColor')) || neg,
            gradient: truthyFlag(grad, false),
            rtl: dir === 'righttoleft' || dir === 'rtl',
            axisPos: key(pick(d, 'axisPosition', 'axis')) || 'automatic',
            axisColor: this.resolveColor(pick(d, 'axisColor', 'barAxisColor')) || '#000000',
            showValue,
            minLen: isNaN(ml) ? 0 : ml,
            maxLen: isNaN(xl) ? 100 : xl
        };
    }

    private static normIcons(cf: Any, rule: Rule): void {
        const d: Any = pick(cf, 'iconSetData', 'iconSet') || cf;
        const rawName: Any = typeof d === 'string' ? d : pick(d, 'iconSetType', 'iconSet', 'type', 'name', 'iconSetName') || pick(cf, 'iconSetType');
        const k: string = key(rawName).replace(/^three/, '3').replace(/^four/, '4').replace(/^five/, '5');
        let set: string = '';
        Object.keys(ICON_SETS).forEach((n: string): void => {
            if (key(n) === k) { set = n; }
        });
        if (!set && !k) { set = '3TrafficLights1'; }
        const critRaw: Any = pick(d, 'iconCriteria', 'criteria', 'cfvos', 'points') || [];
        const crit: IconCrit[] = (Array.isArray(critRaw) ? critRaw : []).map((c: Any): IconCrit => {
            const o: IconCrit = this.toCfvo(c, 'percent');
            const ci: Any = pick(c, 'customIcon', 'icon');
            if (ci && typeof ci === 'object') { o.custom = { set: String(pick(ci, 'iconSet', 'set')), id: Number(pick(ci, 'iconId', 'id')) }; }
            return o;
        });
        const sv: Any = pick(d, 'showValue');
        const io: Any = pick(d, 'showIconOnly');
        const known: number = Object.prototype.hasOwnProperty.call(ICON_SETS, set) ? ICON_SETS[set as string] : 0;
        const iconCount: number = known || crit.length || 3;
        rule.icons = {
            set,
            count: iconCount,
            crit,
            reverse: truthyFlag(pick(d, 'reverse', 'isReversed', 'reverseOrder', 'reverseIconOrder'), false),
            showValue: !isNullOrUndefined(io) ? !truthyFlag(io, false) : truthyFlag(sv, true)
        };
    }
}
