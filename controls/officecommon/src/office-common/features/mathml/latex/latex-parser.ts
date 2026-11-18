/**
 * LaTeX → Office Math model parser.
 *
 * Port of compression `LaTeXConverter.ParseMathPara` (Syncfusion.Office MathML).
 * The scanning rules intentionally mirror the .NET implementation (including
 * Microsoft Word's tolerant handling of malformed input, which degrades to plain
 * text runs).
 *
 * @packageDocumentation
 */
import { ownValue } from '../../../core/own-value';
import { OfficeMathMatrixRow } from '../office-math/matrix-row';
import { Literal } from '../../../core/literal-type';
import { MathFontType, MathFractionType, MathFunctionType, MathHorizontalAlignment, MathLimitType, MathScriptType, MathStyleType } from '../office-math/enums';
import { OfficeMath } from '../office-math/office-math';
import { OfficeMathParagraph } from '../office-math/math-paragraph';
import { MathDocumentAdapter } from '../office-math/adapter';
import { OfficeMathRunElement } from '../office-math/run-element';
import {
    OfficeMathAccent, OfficeMathBar, OfficeMathBorderBox, OfficeMathBox, OfficeMathGroupCharacter, OfficeMathRadical
} from '../office-math/functions-basic';
import {
    OfficeMathDelimiter, OfficeMathEquationArray, OfficeMathFraction, OfficeMathFunction, OfficeMathLeftScript,
    OfficeMathLimit, OfficeMathNArray, OfficeMathRightScript, OfficeMathScript
} from '../office-math/functions-multi';
import { OfficeMathMatrix } from '../office-math/matrix';
import { getLatexSymbol } from './latex-symbols';

// Built at runtime: Unicode property escapes need the `u` flag, which ES5 compile targets reject in literals.
const LETTER: RegExp = new RegExp('^\\p{L}$', 'u');
const LETTER_OR_DIGIT: RegExp = new RegExp('^[\\p{L}\\p{Nd}]$', 'u');
const GROUP_START: Literal<'{'> = '{';
const GROUP_END: Literal<'}'> = '}';
const SQUARE_START: Literal<'['> = '[';
const SQUARE_END: Literal<']'> = ']';
const CONTROL_START: Literal<'\\'> = '\\';
const SPACE: Literal<' '> = ' ';
const MATRIX_ROW_END: Literal<'\\\\'> = '\\\\';
const MATRIX_COL_END: Literal<'&'> = '&';
const SUPER: Literal<'^'> = '^';
const SUB: Literal<'_'> = '_';
const LOW_LIMIT: Literal<'\\below'> = '\\below';

const ACCENTS: Readonly<Record<string, number>> = {
    '\\dot': 775, '\\ddot': 776, '\\dddot': 8411, '\\hat': 770, '\\widehat': 770, '\\check': 780, '\\acute': 769,
    '\\grave': 768, '\\breve': 774, '\\widetilde': 771, '\\bar': 773, '\\vec': 8407, '\\hvec': 8401
};
const FUNCTIONS: string[] = ['\\sin', '\\cos', '\\tan', '\\cot', '\\sec', '\\csc', '\\sinh', '\\cosh', '\\tanh', '\\coth', '\\sech', '\\csch',
    '\\arcsin', '\\arccos', '\\arctan', '\\log', '\\lim', '\\min', '\\max', '\\ln'];
const NARY: Readonly<Record<string, number>> = {
    '\\sum': 8721, '\\int': 8747, '\\iint': 8748, '\\iiint': 8749, '\\oint': 8750, '\\oiint': 8751, '\\oiiint': 8752,
    '\\cwint': 8753, '\\coint': 8754, '\\aoint': 8755, '\\prod': 8719, '\\amalg': 8720, '\\bigcap': 8898, '\\bigcup': 8899,
    '\\bigwedge': 8896, '\\bigvee': 8897, '\\bigodot': 10752, '\\bigotimes': 10754, '\\bigoplus': 10753,
    '\\biguplus': 10756, '\\bigudot': 10755
};
const DELIMITERS: Readonly<Record<string, string>> = {
    '\\lfloor': '\u230A', '\\rfloor': '\u230B', '\\lceil': '\u2308', '\\rceil': '\u2309', '\\langle': '\u2329', '\\rangle': '\u232A',
    '.': '', '|': '|', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}'
};
const FONT_COMMANDS: Readonly<Record<string, MathFontType>> = {
    '\\mathbb': MathFontType.DoubleStruck, '\\mathfrak': MathFontType.Fraktur, '\\mathtt': MathFontType.Monospace,
    '\\mathsf': MathFontType.SansSerif, '\\mathcal': MathFontType.Script, '\\mathscr': MathFontType.Script
};
const STYLE_COMMANDS: Readonly<Record<string, MathStyleType>> = {
    '\\mathbit': MathStyleType.BoldItalic, '\\mathbf': MathStyleType.Bold
};

/** Mutable run accumulated while scanning; merged while formatting is unchanged. */
class RunBuf {
    public text: string;
    public sty: MathStyleType | undefined;
    public scr: MathFontType | undefined;
    public nor: boolean;
    constructor(text: string, sty: MathStyleType | undefined, scr: MathFontType | undefined, nor: boolean) {
        this.text = text;
        this.sty = sty;
        this.scr = scr;
        this.nor = nor;
    }
}
/** Deferred node: children are filled after creation, then built into the model. */
interface Node { make(target: OfficeMath): void }
type Item = RunBuf | Node;
type Seq = Item[];

/**
 * The finalize.
 *
 * @param {Seq} seq - The seq.
 * @param {OfficeMath} target - The target.
 * @returns {void} Nothing is returned.
 */
function finalize(seq: Seq, target: OfficeMath): void {
    seq.forEach((i: Item) => (i instanceof RunBuf ? addRun(i, target) : i.make(target)));
}
/**
 * The add run.
 *
 * @param {RunBuf} r - The r.
 * @param {OfficeMath} target - The target.
 * @returns {void} Nothing is returned.
 */
function addRun(r: RunBuf, target: OfficeMath): void {
    const run: OfficeMathRunElement = target.functions.add(MathFunctionType.RunElement) as OfficeMathRunElement;
    run.text = r.text;
    if (r.sty !== undefined) { run.mathFormat.style = r.sty; }
    if (r.scr !== undefined) { run.mathFormat.font = r.scr; }
    if (r.nor) { run.mathFormat.hasNormalText = true; }
}
/**
 * The add.
 *
 * @param {OfficeMath} target - The target.
 * @param {MathFunctionType} type - The type.
 * @returns {T} The result.
 */
function add<T>(target: OfficeMath, type: MathFunctionType): T {
    return target.functions.add(type) as unknown as T;
}
/**
 * The chr.
 *
 * @param {number} code - The code.
 * @returns {string} The result.
 */
function chr(code: number): string {
    return String.fromCharCode(code);
}
/**
 * The nz.
 *
 * @param {string | null} value - The value.
 * @returns {string} The result.
 */
function nz(value: string | null): string {
    return value === null ? '' : value;
}
/**
 * The has script pair.
 *
 * @param {string} s - The s.
 * @returns {boolean} The result.
 */
function hasScriptPair(s: string): boolean {
    return (s.startsWith(SUB) && s.includes(SUPER)) || (s.startsWith(SUPER) && s.includes(SUB));
}
/**
 * The trim backslash.
 *
 * @param {string} s - The s.
 * @returns {string} The result.
 */
function trimBackslash(s: string): string {
    return s.replace(/^\\+|\\+$/g, '');
}

interface DelimiterResult {
    ok: boolean;
    begin: string | null;
    end: string | null;
    sep: string | null;
    list: string[];
    text: string;
}

/**
 * Stateful LaTeX scanner/parser. One instance per conversion.
 *
 * @private
 */
export class LatexParser {
    private latex: string = '';
    private pos: number = 0;
    private cur: string | null = null;
    private useExisting: boolean = false;
    private current: Seq | null = null;
    private readonly roots: Seq[] = [];
    private sty: MathStyleType | undefined;
    private scr: MathFontType | undefined;
    private nor: boolean = false;

    /**
     * Appends one `m:oMath` per top-level equation of `latex` to `target`, through its collections and adapter.
     *
     * @param {string} latex - The latex.
     * @param {OfficeMathParagraph} target - The target.
     * @returns {void} Nothing is returned.
     */
    populate(latex: string, target: OfficeMathParagraph): void {
        this.latex = latex;
        this.parseEquation();
        target.suspendMutations(() => this.roots.forEach((r: Seq) => finalize(r, target.maths.add())));
    }

    // ─── Scanner ──────────────────────────────────────────────────────────────
    private next(): string | null {
        if (this.pos > this.latex.length - 1) {
            return null;
        }
        let el: string = this.latex[this.pos] as string;
        this.pos++;
        this.cur = el;
        if (el === CONTROL_START) {
            while (this.pos < this.latex.length && (LETTER.test(this.latex[this.pos] as string) || this.latex[this.pos] === ';')) {
                el += this.latex[this.pos];
                this.pos++;
            }
            this.cur = el;
        }
        return this.cur;
    }
    private ensure(): Seq {
        if (this.current === null) {
            this.current = [];
            this.roots.push(this.current);
        }
        return this.current;
    }
    private sub(text: string | null, target: Seq | null): void {
        if (text === null) {
            return;
        }
        const saved: { latex: string; current: Seq; pos: number; cur: string; use: boolean; } = {
            latex: this.latex,
            current: this.current,
            pos: this.pos,
            cur: this.cur,
            use: this.useExisting
        };
        this.latex = text;
        this.current = target;
        this.pos = 0;
        this.cur = null;
        this.useExisting = false;
        this.parseEquation();
        this.latex = saved.latex;
        this.current = saved.current;
        this.pos = saved.pos;
        this.cur = saved.cur;
        this.useExisting = saved.use;
    }
    private fill(text: string | null): Seq {
        const seq: Seq = [];
        this.sub(text, seq);
        return seq;
    }
    private add(make: (target: OfficeMath) => void): void {
        this.ensure().push({ make });
    }
    private setRun(text: string): void {
        if (text.length === 0) {
            return;
        }
        const seq: Seq = this.ensure();
        const t: string = text.startsWith('\\') ? getLatexSymbol(text) : text;
        const last: Item = seq[seq.length - 1];
        if (last instanceof RunBuf && last.sty === this.sty && last.scr === this.scr && last.nor === this.nor) {
            last.text += t;
        } else {
            seq.push(new RunBuf(t, this.sty, this.scr, this.nor));
        }
    }
    private fallbackRun(startPos: number): void {
        this.setRun(this.latex.substring(startPos, this.pos));
    }

    // ─── Group helpers ────────────────────────────────────────────────────────
    private equationString(): string | null {
        this.cur = this.next();
        let result: string | null = null;
        let valid: boolean = false;
        let notInGroup: boolean = false;
        if (this.cur === GROUP_START) {
            const g: { ok: boolean; text: string; } = this.group();
            valid = g.ok;
            result = g.text;
        } else {
            notInGroup = true;
        }
        if (notInGroup && this.cur !== null && this.cur.length === 1 && (LETTER_OR_DIGIT.test(this.cur) || this.cur === SPACE)) {
            result = this.cur;
        } else if (!valid) {
            result = null;
        }
        return result;
    }
    private group(): { ok: boolean; text: string } {
        if (this.cur !== GROUP_START) {
            return { ok: false, text: '' };
        }
        let text: string = '';
        let depth: number = 1;
        while (depth > 0 && this.pos < this.latex.length) {
            this.cur = this.next();
            if (this.cur === GROUP_START) {
                depth++;
                text += this.cur;
            } else if (this.cur === GROUP_END) {
                if (depth !== 1) {
                    text += this.cur;
                }
                depth--;
            } else if (this.cur === '\\left') {
                const d: DelimiterResult = this.delimiter();
                text += d.text;
                if (!d.ok) {
                    return { ok: false, text };
                }
            } else {
                text += nz(this.cur);
            }
        }
        return { ok: depth === 0, text };
    }
    private squareGroup(): string | null {
        if (this.cur !== SQUARE_START) {
            return null;
        }
        let text: string = '';
        let depth: number = 1;
        while (depth > 0 && this.pos < this.latex.length) {
            this.cur = this.next();
            if (this.cur === SQUARE_START) {
                depth++;
                text += this.cur;
            } else if (this.cur === SQUARE_END) {
                if (depth !== 1) {
                    text += this.cur;
                }
                depth--;
            } else {
                text += nz(this.cur);
            }
        }
        return text;
    }

    // ─── Main loop ────────────────────────────────────────────────────────────
    private parseEquation(): void {
        while (this.pos < this.latex.length || this.useExisting) {
            if (this.useExisting) {
                this.useExisting = false;
            } else {
                this.cur = this.next();
            }
            this.dispatch(nz(this.cur), this.cur);
        }
    }
    private dispatch(c: string, raw: string | null): void {
        const styleCommand: MathStyleType | undefined = ownValue<MathStyleType>(STYLE_COMMANDS, c);
        const fontCommand: MathFontType | undefined = ownValue<MathFontType>(FONT_COMMANDS, c);
        if (raw === null) {
            this.parseDefault();
        } else if (ownValue<number>(ACCENTS, c) !== undefined) {
            this.parseAccent();
        } else if (c === '\\overline' || c === '\\underline') {
            this.parseBar();
        } else if (c === '\\box') {
            this.parseBox();
        } else if (c === '\\fbox' || c === '\\boxed') {
            this.parseBorderBox();
        } else if (c === '\\left') {
            this.parseDelimiter();
        } else if (c === '\\eqarray') {
            this.parseEqArray();
        } else if (c === '\\frac' || c === '\\sfrac' || c === '\\binom') {
            this.parseFraction();
        } else if (FUNCTIONS.indexOf(c) !== -1) {
            this.parseFunction();
        } else if (c === '\\overbrace' || c === '\\underbrace') {
            this.parseGroupChar();
        } else if (c === '\\begin') {
            this.parseMatrix();
        } else if (ownValue<number>(NARY, c) !== undefined) {
            this.parseNary();
        } else if (c === '\\sqrt') {
            this.parseRadical();
        } else if (c === GROUP_START) {
            this.parseGroupStart();
        } else if (styleCommand !== undefined) {
            this.parseFormat(c, 'sty', styleCommand);
        } else if (fontCommand !== undefined) {
            this.parseFormat(c, 'scr', fontCommand);
        } else if (c === '\\mathrm') {
            this.parseFormat(c, 'nor', true);
        } else {
            this.parseDefault();
        }
    }

    private parseDefault(): void {
        const startPos: number = this.pos;
        const previous: string = nz(this.cur);
        this.cur = this.next();
        if (this.cur === SUPER || this.cur === SUB) {
            this.parseScript(previous, startPos - previous.length);
            return;
        }
        if (this.cur !== null) {
            this.useExisting = true;
        }
        if (this.cur === SPACE) {
            if (previous === '\\') {
                return;
            }
            if (previous.startsWith('\\') && getLatexSymbol(previous) !== previous) {
                this.useExisting = false;
            }
        }
        this.setRun(previous);
    }

    private parseFormat(start: string, kind: 'sty' | 'scr' | 'nor', value: MathStyleType | MathFontType | boolean): void {
        const laTexPos: number = this.pos;
        this.cur = this.next();
        if (this.cur !== GROUP_START) {
            this.setRun(start);
            this.useExisting = true;
            return;
        }
        const g: { ok: boolean; text: string; } = this.group();
        if (!g.ok) {
            this.fallbackRun(laTexPos - start.length);
            return;
        }
        const old: { sty: MathStyleType; scr: MathFontType; nor: boolean; } = { sty: this.sty, scr: this.scr, nor: this.nor };
        if (kind === 'sty' && this.sty === undefined) {
            this.sty = value as MathStyleType;
        } else if (kind === 'scr' && this.scr === undefined) {
            this.scr = value as MathFontType;
        } else if (kind === 'nor') {
            this.nor = true;
        }
        this.sub(g.text, this.current);
        this.sty = old.sty;
        this.scr = old.scr;
        this.nor = old.nor;
    }

    /**
     * `\cmd{...}` / `\cmd x` argument shared by accent, bar, box, border box, group char.
     *
     * @returns {object} The result.
     */
    private oneArg(): { start: string; at: number; text: string | null } {
        const at: number = this.pos;
        const start: string = nz(this.cur);
        let text: string = this.equationString();
        if (text === SPACE && this.cur === SPACE) {
            text = this.equationString();
        }
        return { start, at, text };
    }

    private parseAccent(): void {
        const { start, at, text } = this.oneArg();
        if (text === null && this.cur !== null) {
            this.fallbackRun(at - start.length);
            return;
        }
        let chrCode: string = chr(ownValue<number>(ACCENTS, start) as number);
        let body: string = text;
        if (body && body.startsWith('\\bar{') && body.endsWith(GROUP_END) && chrCode === chr(773)) {
            chrCode = chr(831);
            body = body.substring(5, body.length - 1);
        }
        const inner: Seq = body ? this.fill(body) : [];
        this.add((t: OfficeMath) => {
            const f: OfficeMathAccent = add<OfficeMathAccent>(t, MathFunctionType.Accent);
            f.accentCharacter = chrCode;
            finalize(inner, f.equation);
        });
    }

    private parseBar(): void {
        const { start, at, text } = this.oneArg();
        if (text === null && this.cur !== null) {
            this.fallbackRun(at - start.length);
            return;
        }
        this.cur = this.next();
        if (this.cur === SUPER || this.cur === SUB) {
            this.parseScript(`${start}${GROUP_START}${nz(text)}${GROUP_END}`, at);
            return;
        }
        if (this.cur !== null) {
            this.useExisting = true;
        }
        const inner: Seq = text ? this.fill(text) : [];
        const pos: 'top' | 'bot' = start === '\\overline' ? 'top' : 'bot';
        this.add((t: OfficeMath) => {
            const f: OfficeMathBar = add<OfficeMathBar>(t, MathFunctionType.Bar);
            f.barTop = pos === 'top';
            finalize(inner, f.equation);
        });
    }

    private parseBox(): void {
        const { start, at, text } = this.oneArg();
        if (text === null && this.cur !== null) {
            this.fallbackRun(at - start.length);
            return;
        }
        const inner: Seq = text ? this.fill(text) : [];
        this.add((t: OfficeMath) => {
            const f: OfficeMathBox = add<OfficeMathBox>(t, MathFunctionType.Box);
            f.noBreak = false;
            finalize(inner, f.equation);
        });
    }

    private parseBorderBox(): void {
        const { start, at, text } = this.oneArg();
        if (text === null && this.cur !== null) {
            this.fallbackRun(at - start.length);
            return;
        }
        this.cur = this.next();
        if (this.cur === SUPER || this.cur === SUB) {
            this.parseScript(`${start}${GROUP_START}${nz(text)}${GROUP_END}`, at);
            return;
        }
        if (this.cur !== null) {
            this.useExisting = true;
        }
        const inner: Seq = text ? this.fill(text) : [];
        this.add((t: OfficeMath) => finalize(inner, add<OfficeMathBorderBox>(t, MathFunctionType.BorderBox).equation));
    }

    // ─── Delimiter / eqArray ──────────────────────────────────────────────────
    private delimiterChar(eq: { s: string }): string | null {
        this.cur = this.next();
        eq.s += nz(this.cur);
        if (this.cur === CONTROL_START) {
            this.cur = this.next();
            eq.s += nz(this.cur);
        }
        const key: string = nz(this.cur);
        const delimiter: string | undefined = ownValue<string>(DELIMITERS, key);
        return delimiter !== undefined ? delimiter : null;
    }
    private delimiter(): DelimiterResult {
        const r: DelimiterResult = { ok: false, begin: null, end: null, sep: null, list: [], text: '' };
        const eq: { s: string; } = { s: nz(this.cur) };
        let depth: number = 1;
        r.begin = this.delimiterChar(eq);
        if (r.begin === null) {
            r.text = eq.s;
            return r;
        }
        let between: string = '';
        while (depth > 0 && this.pos < this.latex.length) {
            const el: string = nz(this.next());
            eq.s += el;
            if (el === '\\left') {
                between += el;
                depth++;
            } else if (el === '\\right') {
                if (depth === 1) {
                    r.list.push(between.trim());
                    r.end = this.delimiterChar(eq);
                    if (r.end === null) {
                        r.text = eq.s;
                        return r;
                    }
                } else {
                    between += el;
                }
                depth--;
            } else if (el === '\\middle') {
                if (depth === 1) {
                    const mid: string = this.delimiterChar(eq);
                    if (mid === null) {
                        r.text = eq.s;
                        return r;
                    }
                    if (r.sep === null) {
                        r.sep = mid;
                    }
                    r.list.push(between.trim());
                    between = '';
                } else {
                    between += el;
                }
            } else {
                between += el;
            }
        }
        r.ok = depth === 0;
        r.text = eq.s;
        return r;
    }
    private parseDelimiter(): void {
        const at: number = this.pos;
        const start: string = nz(this.cur);
        const d: DelimiterResult = this.delimiter();
        if (!d.ok) {
            this.setRun(this.latex.substring(at - start.length, this.pos).replace(/\\ /g, ' '));
            return;
        }
        this.cur = this.next();
        if (this.cur === SUPER || this.cur === SUB) {
            this.parseScript(d.text, at);
            return;
        }
        if (this.cur !== null) {
            this.useExisting = true;
        }
        const args: Seq[] = d.list.map((e: string) => this.fill(e));
        const props: { begChr: string; endChr: string; sepChr?: string } = { begChr: nz(d.begin), endChr: nz(d.end) };
        if (d.sep !== null) { props.sepChr = d.sep; }
        this.add((t: OfficeMath) => {
            const f: OfficeMathDelimiter = add<OfficeMathDelimiter>(t, MathFunctionType.Delimiter);
            f.beginCharacter = props.begChr;
            f.endCharacter = props.endChr;
            if (props.sepChr !== undefined) { f.separator = props.sepChr; }
            args.forEach((a: Seq) => finalize(a, f.equations.add()));
        });
    }

    private splitEqArray(text: string | null): string[] {
        const list: string[] = [];
        let between: string = '';
        if (text !== null) {
            for (let p: number = 0; p < text.length; p++) {
                if (text.charAt(p) === '@') {
                    if (text.substring(p).includes('&') || text.substring(p + 1).includes('@')) {
                        list.push(between.trim());
                        between = '';
                    }
                } else {
                    between += text.charAt(p);
                }
            }
            list.push(between.trim());
        }
        return list;
    }
    private parseEqArray(): void {
        const at: number = this.pos;
        const start: string = nz(this.cur);
        const text: string = this.equationString();
        if (text === null && this.cur !== null) {
            this.fallbackRun(at - start.length);
            return;
        }
        const parts: Seq[] = this.splitEqArray(text).map((e: string) => this.fill(e));
        this.add((t: OfficeMath) => {
            const f: OfficeMathEquationArray = add<OfficeMathEquationArray>(t, MathFunctionType.EquationArray);
            if (parts.length === 0) { f.equations.add(); }
            parts.forEach((p: Seq) => finalize(p, f.equations.add()));
        });
    }

    // ─── Fraction / function / group char / limit ─────────────────────────────
    private parseFraction(): void {
        const at: number = this.pos;
        const start: string = nz(this.cur);
        let num: string = this.equationString();
        if (this.cur === SPACE && num === SPACE) {
            num = this.equationString();
        }
        let den: string | null = '';
        if ((this.cur === SPACE && num === SPACE) || (this.cur === null && num === null)) {
            num = '';
        } else {
            den = this.equationString();
        }
        if (num === null || den === null) {
            this.fallbackRun(at - start.length);
            return;
        }
        this.cur = this.next();
        if (this.cur === SUPER || this.cur === SUB) {
            this.parseScript(`${start}${GROUP_START}${num}${GROUP_END}${GROUP_START}${den}${GROUP_END}`, at);
            return;
        }
        if (this.cur !== null) {
            this.useExisting = true;
        }
        if (start === '\\binom') {
            this.binomial(num, den);
            return;
        }
        const type: MathFractionType = start === '\\sfrac' ? MathFractionType.SkewedFractionBar : MathFractionType.NormalFractionBar;
        this.fraction(type, num, den);
    }
    private fraction(type: MathFractionType, num: string, den: string): void {
        const n: Seq = num !== '' ? this.fill(num) : [];
        const d: Seq = den !== '' ? this.fill(den) : [];
        this.add((t: OfficeMath) => {
            const f: OfficeMathFraction = add<OfficeMathFraction>(t, MathFunctionType.Fraction);
            f.fractionType = type;
            finalize(n, f.numerator);
            finalize(d, f.denominator);
        });
    }
    /**
     * `\binom{n}{k}`: a parenthesis delimiter around a no-bar fraction (Word's binomial coefficient).
     *
     * @param {string} num - The num.
     * @param {string} den - The den.
     * @returns {void} Nothing is returned.
     */
    private binomial(num: string, den: string): void {
        const n: Seq = num !== '' ? this.fill(num) : [];
        const d: Seq = den !== '' ? this.fill(den) : [];
        this.add((t: OfficeMath) => {
            const delimiter: OfficeMathDelimiter = add<OfficeMathDelimiter>(t, MathFunctionType.Delimiter);
            delimiter.beginCharacter = '(';
            delimiter.endCharacter = ')';
            const f: OfficeMathFraction = add<OfficeMathFraction>(delimiter.equations.add(), MathFunctionType.Fraction);
            f.fractionType = MathFractionType.NoFractionBar;
            finalize(n, f.numerator);
            finalize(d, f.denominator);
        });
    }
    private parseNoFractionBar(numerator: string, startPos: number): void {
        if (this.cur !== '\\atop') {
            return;
        }
        let den: string = this.equationString();
        if (this.cur === den) {
            den = null;
        }
        if (den === null) {
            this.fallbackRun(startPos);
            return;
        }
        this.fraction(MathFractionType.NoFractionBar, numerator, den);
    }

    private parseFunction(): void {
        const at: number = this.pos;
        const start: string = nz(this.cur);
        let body: string = this.equationString();
        let scriptKind: 'sup' | 'sub' | 'limit' | null = null;
        let scriptText: string | null = null;
        if (this.cur === SUPER || this.cur === SUB || this.cur === LOW_LIMIT) {
            scriptKind = this.cur === SUPER ? 'sup' : this.cur === SUB ? 'sub' : 'limit';
            scriptText = this.equationString();
            if (scriptText === this.cur) {
                body = this.equationString();
                if (body !== null && body === this.cur) {
                    body = '';
                    this.useExisting = true;
                }
            } else {
                body = this.equationString();
            }
        }
        if (body === null) {
            this.fallbackRun(at - start.length);
            return;
        }
        const name: string = trimBackslash(start);
        const nameSeq: Seq = [];
        let make: (f: OfficeMathFunction) => void;
        if (scriptKind === 'sup' || scriptKind === 'sub') {
            const base: Seq = this.fill(name);
            this.regular(base);
            const script: Seq = scriptText !== null ? this.fill(scriptText) : [];
            make = (f: OfficeMathFunction) => {
                const sc: OfficeMathScript = add<OfficeMathScript>(f.functionName, MathFunctionType.SubSuperscript);
                sc.scriptType = scriptKind === 'sup' ? MathScriptType.Superscript : MathScriptType.Subscript;
                finalize(base, sc.equation);
                finalize(script, sc.script);
            };
        } else if (scriptKind === 'limit') {
            const base: Seq = this.fill(name);
            this.regular(base);
            const lim: Seq = scriptText !== null ? this.fill(scriptText) : [];
            make = (f: OfficeMathFunction) => {
                const l: OfficeMathLimit = add<OfficeMathLimit>(f.functionName, MathFunctionType.Limit);
                l.limitType = MathLimitType.LowerLimit;
                finalize(base, l.equation);
                finalize(lim, l.limit);
            };
        } else {
            const saved: Seq = this.current;
            this.current = nameSeq;
            this.setRun(name);
            this.current = saved;
            this.regular(nameSeq);
            make = (f: OfficeMathFunction) => finalize(nameSeq, f.functionName);
        }
        this.ensure();
        const inner: Seq = body !== '' ? this.fill(body) : [];
        this.add((t: OfficeMath) => {
            const f: OfficeMathFunction = add<OfficeMathFunction>(t, MathFunctionType.Function);
            make(f);
            finalize(inner, f.equation);
        });
    }
    private regular(seq: Seq): void {
        const first: Item = seq[0];
        if (first instanceof RunBuf) {
            first.sty = MathStyleType.Regular;
        }
    }

    private parseGroupChar(): void {
        const { start, at, text } = this.oneArg();
        if (text === null && this.cur !== null) {
            this.fallbackRun(at - start.length);
            return;
        }
        const inner: Seq = text ? this.fill(text) : [];
        const over: boolean = start === '\\overbrace';
        this.add((t: OfficeMath) => {
            const f: OfficeMathGroupCharacter = add<OfficeMathGroupCharacter>(t, MathFunctionType.GroupCharacter);
            if (over) {
                f.groupCharacter = chr(9182);
                f.hasAlignTop = false;
                f.hasCharacterTop = true;
            }
            finalize(inner, f.equation);
        });
    }
    /**
     * Compares the current element without TypeScript narrowing across mutating calls.
     *
     * @param {string} value - The value.
     * @returns {boolean} The result.
     */
    private isCurrent(value: string): boolean {
        return this.cur === value;
    }
    private parseLimit(equation: string | null, startPos: number): void {
        if (!this.isCurrent(LOW_LIMIT)) {
            return;
        }
        let lim: string | null = this.equationString();
        if (lim === SPACE && this.isCurrent(SPACE)) {
            lim = this.equationString();
        }
        if (lim === null) {
            this.fallbackRun(startPos);
            return;
        }
        const base: Seq = this.fill(equation);
        const limit: Seq = lim !== SPACE ? this.fill(lim) : [];
        this.add((t: OfficeMath) => {
            const f: OfficeMathLimit = add<OfficeMathLimit>(t, MathFunctionType.Limit);
            f.limitType = MathLimitType.LowerLimit;
            finalize(base, f.equation);
            finalize(limit, f.limit);
        });
    }

    // ─── Matrix ───────────────────────────────────────────────────────────────
    private parseMatrix(): void {
        const at: number = this.pos;
        const start: string = nz(this.cur);
        this.cur = this.next();
        if (this.cur !== GROUP_START) {
            this.setRun(start);
            this.useExisting = true;
            return;
        }
        const g: { ok: boolean; text: string; } = this.group();
        const m: { rows: string[][]; maxCols: number; } = g.ok && g.text === 'matrix' ? this.matrixRows() : null;
        if (m === null) {
            this.fallbackRun(at - start.length);
            return;
        }
        this.cur = this.next();
        if (this.cur === SUPER || this.cur === SUB) {
            this.parseScript(this.latex.substring(at - start.length, this.pos - 1), at);
            return;
        }
        if (this.cur !== null) {
            this.useExisting = true;
        }
        const rows: Seq[][] = m.rows.map((cols: string[]) => {
            const cells: Seq[] = cols.slice(0, m.maxCols).map((col: string) => this.fill(col));
            while (cells.length < m.maxCols) {
                cells.push([]);
            }
            return cells;
        });
        const columnCount: number = m.maxCols;
        this.add((t: OfficeMath) => {
            const f: OfficeMathMatrix = add<OfficeMathMatrix>(t, MathFunctionType.Matrix);
            for (let i: number = 0; i < columnCount; i++) { f.columns.add().horizontalAlignment = MathHorizontalAlignment.Center; }
            rows.forEach((r: Seq[]) => {
                const row: OfficeMathMatrixRow = f.rows.add();
                r.forEach((c: Seq, i: number) => finalize(c, row.arguments.getItem(i)));
            });
        });
    }
    private matrixRows(): { rows: string[][]; maxCols: number } | null {
        const rows: string[][] = [];
        let maxCols: number = 0;
        let depth: number = 1;
        let between: string = '';
        let cols: string[] = [];
        const endRow: () => void = (): void => {
            cols.push(between);
            between = '';
            maxCols = Math.max(maxCols, cols.length);
            rows.push(cols);
            cols = [];
        };
        while (depth > 0 && this.pos < this.latex.length) {
            this.cur = this.next();
            while (this.cur === SPACE) {
                this.cur = this.next();
            }
            if (this.cur === CONTROL_START) {
                this.cur = this.next();
                if (this.cur === CONTROL_START) {
                    this.cur += CONTROL_START;
                }
            }
            const c: string = this.cur;
            if (c === '\\begin') {
                between += c;
                const startEl: string = nz((this.cur = this.next()));
                const g: { ok: boolean; text: string; } = this.group();
                if (g.ok && g.text === 'matrix') {
                    depth++;
                }
                between += startEl + g.text + nz(this.cur);
            } else if (c === '\\end') {
                const startEl: string = c + nz((this.cur = this.next()));
                const g: { ok: boolean; text: string; } = this.group();
                if (g.ok && g.text === 'matrix' && depth === 1) {
                    if (cols.length !== 0 || between !== '') {
                        endRow();
                    }
                    depth--;
                } else if (depth === 1) {
                    return null;
                } else {
                    between += startEl + g.text + nz(this.cur);
                }
            } else if (c === MATRIX_COL_END) {
                if (depth === 1) {
                    cols.push(between);
                    between = '';
                } else {
                    between += c;
                }
            } else if (c === MATRIX_ROW_END) {
                if (depth === 1) {
                    endRow();
                } else {
                    between += c;
                }
            } else {
                between += nz(c);
            }
        }
        return depth === 0 ? { rows, maxCols } : null;
    }

    // ─── N-ary ────────────────────────────────────────────────────────────────
    private parseNary(): void {
        const at: number = this.pos;
        const start: string = nz(this.cur);
        let eq: string = this.equationString();
        let subText: string | null = null;
        let supText: string | null = null;
        for (let i: number = 0; i < 2; i++) {
            if (eq === SPACE && this.cur === SPACE) {
                eq = this.equationString();
            } else {
                break;
            }
        }
        if (this.cur === SUB) {
            subText = this.equationString();
        } else if (this.cur === SUPER) {
            supText = this.equationString();
        }
        if (subText !== null) {
            eq = this.equationString();
            if (this.cur === SUPER) {
                supText = this.equationString();
            }
        } else if (supText !== null) {
            eq = this.equationString();
            if (this.cur === SUB) {
                subText = this.equationString();
            }
        }
        if (subText !== null && supText !== null) {
            eq = this.equationString();
        }
        if (eq !== null) {
            eq = this.naryTail(eq);
        }
        if (eq === null && this.cur !== null) {
            this.fallbackRun(at - start.length);
            return;
        }
        const sub: Seq = subText !== null ? this.fill(subText) : [];
        const sup: Seq = supText !== null ? this.fill(supText) : [];
        const base: Seq = eq !== SPACE ? this.fill(eq) : [];
        const character: string = chr(ownValue<number>(NARY, start) as number);
        this.add((t: OfficeMath) => {
            const f: OfficeMathNArray = add<OfficeMathNArray>(t, MathFunctionType.NArray);
            f.nArrayCharacter = character;
            if (subText === null) { f.hideLowerLimit = true; }
            if (supText === null) { f.hideUpperLimit = true; }
            if (subText === null && supText === null) { f.subSuperscriptLimit = false; }
            finalize(sub, f.subscript);
            finalize(sup, f.superscript);
            finalize(base, f.equation);
        });
    }
    /**
     * Greedily absorbs trailing script groups into the N-ary operand (mirrors compression).
     *
     * @param {string} first - The first.
     * @returns {string} The result.
     */
    private naryTail(first: string): string {
        let eq: string = first;
        let isLeft: boolean = false;
        if (this.cur === GROUP_END && hasScriptPair(eq)) {
            eq = GROUP_START + eq + GROUP_END;
            isLeft = true;
        }
        let part: string = this.equationString();
        let check: boolean = true;
        if (part !== null && isLeft) {
            eq += GROUP_START + part + GROUP_END;
        } else if (part === null && (this.cur === SUPER || this.cur === SUB)) {
            eq += this.cur + GROUP_START + nz(this.equationString()) + GROUP_END;
        } else if (part !== null && hasScriptPair(part)) {
            eq += GROUP_START + part + GROUP_END;
        } else {
            this.useExisting = true;
            check = false;
            if (part !== null && this.cur !== part) {
                this.cur = part;
            }
        }
        while (check) {
            part = this.equationString();
            if (part === null && (this.cur === SUPER || this.cur === SUB)) {
                eq += this.cur + GROUP_START + nz(this.equationString()) + GROUP_END;
            } else if (part !== null && hasScriptPair(part)) {
                eq += GROUP_START + part + GROUP_END;
            } else {
                this.useExisting = true;
                check = false;
            }
        }
        return eq;
    }

    // ─── Radical ──────────────────────────────────────────────────────────────
    private parseRadical(): void {
        const at: number = this.pos;
        const start: string = nz(this.cur);
        this.cur = this.next();
        if (this.cur === SPACE) {
            this.cur = this.next();
        }
        const degree: string = this.squareGroup();
        if (degree !== null) {
            this.cur = this.next();
        }
        let equation: string | null = null;
        let valid: boolean = false;
        let notInGroup: boolean = false;
        if (this.cur === GROUP_START) {
            const g: { ok: boolean; text: string; } = this.group();
            valid = g.ok;
            equation = g.text;
        } else {
            notInGroup = true;
        }
        if (notInGroup && this.cur !== null && this.cur.length === 1 && (LETTER_OR_DIGIT.test(this.cur) || this.cur === SPACE)) {
            equation = this.cur;
        }
        if (!(notInGroup || valid)) {
            this.fallbackRun(at - start.length);
            return;
        }
        this.cur = this.next();
        if (this.cur === SUPER || this.cur === SUB) {
            this.parseScript(this.latex.substring(at - start.length, this.pos - 1), at);
            return;
        }
        if (this.cur !== null) {
            this.useExisting = true;
        }
        const hide: boolean = !(degree !== null && equation !== null);
        const deg: Seq = !hide ? this.fill(degree) : [];
        let body: Seq = [];
        if (equation !== null && equation !== SPACE) {
            body = this.fill(equation);
        } else if (equation === null) {
            this.useExisting = true;
            if (degree !== null) {
                this.setRun(`[${degree}]`);
            }
        }
        this.add((t: OfficeMath) => {
            const f: OfficeMathRadical = add<OfficeMathRadical>(t, MathFunctionType.Radical);
            if (hide) { f.hideDegree = true; }
            finalize(deg, f.degree);
            finalize(body, f.equation);
        });
    }

    // ─── Groups and scripts ───────────────────────────────────────────────────
    private parseGroupStart(): void {
        const startPos: number = this.pos - GROUP_START.length;
        const g: { ok: boolean; text: string; } = this.group();
        if (!g.ok) {
            this.setRun(GROUP_START);
            this.sub(g.text, this.current);
            return;
        }
        if (hasScriptPair(g.text)) {
            this.parseLeftScript(g.text, startPos);
            return;
        }
        this.cur = this.next();
        if (this.cur === SUPER || this.cur === SUB) {
            this.parseScript(g.text, startPos);
        } else if (this.cur === LOW_LIMIT) {
            this.parseLimit(g.text, startPos);
        } else if (this.cur === '\\atop') {
            this.parseNoFractionBar(g.text, startPos);
        } else {
            this.sub(g.text, this.current);
            this.useExisting = true;
        }
    }

    private parseScript(equation: string | null, startPos: number): void {
        if (!(this.cur === SUPER || this.cur === SUB)) {
            return;
        }
        const isSup: boolean = this.cur === SUPER;
        const script: string = this.equationString();
        if (script === null && this.cur !== null) {
            this.fallbackRun(startPos);
            return;
        }
        if (this.cur !== null) {
            this.cur = this.next();
            if ((isSup && this.cur === SUB) || (!isSup && this.cur === SUPER)) {
                this.parseRightScript(equation, script, isSup, startPos);
                return;
            }
            this.useExisting = true;
        }
        this.ensure();
        const base: Seq = this.fill(equation);
        const scriptSeq: Seq = script ? this.fill(script) : [];
        this.add((t: OfficeMath) => {
            const f: OfficeMathScript = add<OfficeMathScript>(t, MathFunctionType.SubSuperscript);
            f.scriptType = isSup ? MathScriptType.Superscript : MathScriptType.Subscript;
            finalize(base, f.equation);
            finalize(scriptSeq, f.script);
        });
    }
    private parseRightScript(equation: string | null, first: string | null, isSup: boolean, startPos: number): void {
        const second: string = this.equationString();
        if (second === null && this.cur !== null) {
            this.fallbackRun(startPos);
            return;
        }
        const keep: (s: string | null) => string | null = (s: string | null): string | null => (s !== null && s !== SPACE ? s : null);
        const base: Seq = this.fill(keep(equation));
        const sup: Seq = this.fill(keep(isSup ? first : second));
        const sub: Seq = this.fill(keep(isSup ? second : first));
        this.add((t: OfficeMath) => {
            const f: OfficeMathRightScript = add<OfficeMathRightScript>(t, MathFunctionType.RightSubSuperscript);
            finalize(base, f.equation);
            finalize(sub, f.subscript);
            finalize(sup, f.superscript);
        });
    }
    private parseLeftScript(group: string, startPos: number): void {
        let sub: string | null = null;
        let sup: string | null = null;
        const saved: { latex: string; pos: number; cur: string; } = { latex: this.latex, pos: this.pos, cur: this.cur };
        this.latex = group;
        this.pos = 1;
        if (group.startsWith(SUB)) {
            sub = this.equationString();
        } else {
            sup = this.equationString();
        }
        if (sub !== null) {
            this.cur = this.next();
            if (this.cur === SUPER) {
                sup = this.equationString();
            }
        } else if (sup !== null) {
            this.cur = this.next();
            if (this.cur === SUB) {
                sub = this.equationString();
            }
        }
        this.latex = saved.latex;
        this.pos = saved.pos;
        this.cur = saved.cur;
        let eq: string | null = null;
        if (sub !== null && sup !== null) {
            eq = this.equationString();
        }
        if (eq === null && this.cur !== null) {
            this.fallbackRun(startPos);
            return;
        }
        const keep: (s: string | null) => string | null = (s: string | null): string | null => (s !== SPACE ? s : null);
        const subSeq: Seq = this.fill(keep(sub));
        const supSeq: Seq = this.fill(keep(sup));
        const base: Seq = eq !== null && eq !== SPACE ? this.fill(eq) : [];
        this.add((t: OfficeMath) => {
            const f: OfficeMathLeftScript = add<OfficeMathLeftScript>(t, MathFunctionType.LeftSubSuperscript);
            finalize(subSeq, f.subscript);
            finalize(supSeq, f.superscript);
            finalize(base, f.equation);
        });
    }
}

/**
 * Convert a LaTeX equation string to an Office Math paragraph.
 *
 * Mirrors Microsoft Word's "linear LaTeX" behavior as implemented by Syncfusion
 * `LaTeXConverter.ParseMathPara`: unsupported or malformed constructs degrade to
 * plain text runs instead of throwing.
 *
 * @param {string} latex - LaTeX source (for example `\frac{a}{b}` or `\sqrt[3]{x}`).
 * @param {MathDocumentAdapter | undefined} adapter - The adapter.
 * @returns {OfficeMathParagraph} An {@link OfficeMathParagraph} holding one {@link OfficeMath} per top-level equation.
 * @public
 */
export function parseLatexToMath(latex: string, adapter?: MathDocumentAdapter): OfficeMathParagraph {
    const paragraph: OfficeMathParagraph = new OfficeMathParagraph(adapter);
    parseLatexIntoMathParagraph(latex, paragraph);
    return paragraph;
}

/**
 * Appends the equations parsed from a LaTeX string to an existing Math paragraph.
 * Runs are created through the target's document adapter when it has one.
 *
 * @param {string} latex - LaTeX source.
 * @param {OfficeMathParagraph} target - The paragraph to populate; it keeps its identity, owner, adapter and listener.
 * @returns {void} Nothing is returned.
 * @public
 */
export function parseLatexIntoMathParagraph(latex: string, target: OfficeMathParagraph): void {
    new LatexParser().populate(latex, target);
}
