/**
 * Office Math model → LaTeX generator.
 *
 * Port of compression `LaTeXConverter.GetLaTeX` (Math to LaTeX region). Output
 * syntax matches what `parseLatexToMath` accepts. Unsupported element kinds are
 * skipped, as in the .NET implementation.
 *
 * @packageDocumentation
 */
import { ownValue } from '../../../core/own-value';
import { OfficeMathFormat } from '../office-math/format';
import { MathFontType, MathFractionType, MathFunctionType, MathScriptType, MathStyleType } from '../office-math/enums';
import { K } from '../office-math/keys';
import { OfficeMath } from '../office-math/office-math';
import { OfficeMathParagraph } from '../office-math/math-paragraph';
import { OfficeMathFunctionBase } from '../office-math/function-base';
import { OfficeMathRunElement } from '../office-math/run-element';
import {
    OfficeMathAccent, OfficeMathBar, OfficeMathBorderBox, OfficeMathBox, OfficeMathGroupCharacter, OfficeMathRadical
} from '../office-math/functions-basic';
import {
    OfficeMathDelimiter, OfficeMathEquationArray, OfficeMathFraction, OfficeMathFunction, OfficeMathLeftScript,
    OfficeMathLimit, OfficeMathNArray, OfficeMathRightScript, OfficeMathScript
} from '../office-math/functions-multi';
import { OfficeMathMatrix } from '../office-math/matrix';
import { getSymbolLatex } from './latex-symbols';

// Built at runtime: `u`-flag literals are rejected by ES5 compile targets.
const LETTER: RegExp = new RegExp('^\\p{L}$', 'u');
/**
 * The or default.
 *
 * @param {T | undefined} value - The value.
 * @param {T} fallback - The fallback.
 * @returns {T} The result.
 */
function orDefault<T>(value: T | undefined, fallback: T): T {
    return value !== undefined && value !== null ? value : fallback;
}
const ACCENT_COMMANDS: Readonly<Record<number, string>> = {
    775: '\\dot', 776: '\\ddot', 8411: '\\dddot', 770: '\\widehat', 780: '\\check', 768: '\\grave', 774: '\\breve',
    771: '\\widetilde', 769: '\\acute', 773: '\\bar', 831: '\\bar{\\bar', 8407: '\\vec', 8401: '\\hvec'
};
const NARY_COMMANDS: Readonly<Record<number, string>> = {
    8721: '\\sum', 8747: '\\int', 8748: '\\iint', 8749: '\\iiint', 8750: '\\oint', 8751: '\\oiint', 8752: '\\oiiint',
    8753: '\\cwint', 8754: '\\coint', 8755: '\\aoint', 8719: '\\prod', 8720: '\\amalg', 8898: '\\bigcap', 8899: '\\bigcup',
    8896: '\\bigwedge', 8897: '\\bigvee', 10752: '\\bigodot', 10754: '\\bigotimes', 10753: '\\bigoplus', 10756: '\\biguplus',
    10755: '\\bigudot'
};
const DELIMITER_COMMANDS: Readonly<Record<number, string>> = {
    40: '(', 91: '[', 123: '{', 41: ')', 93: ']', 125: '}', 124: '|', 9001: '\\langle', 8968: '\\lceil', 8970: '\\lfloor',
    9002: '\\rangle', 8969: '\\rceil', 8971: '\\rfloor'
};
const FONT_COMMANDS: Readonly<Record<number, string>> = {
    [MathFontType.DoubleStruck]: '\\mathbb', [MathFontType.Fraktur]: '\\mathfrak', [MathFontType.Monospace]: '\\mathtt',
    [MathFontType.SansSerif]: '\\mathsf', [MathFontType.Script]: '\\mathscr'
};

class LatexGenerator {
    private out: string = '';
    private inFunctionName: boolean = false;

    generate(equations: ReadonlyArray<OfficeMath>): string {
        for (const eq of equations) {
            this.arg(eq);
        }
        return this.out;
    }

    private group(arg: OfficeMath | undefined): void {
        this.out += '{';
        this.arg(arg);
        this.out += '}';
    }

    private arg(arg: OfficeMath | undefined): void {
        if (arg) {
            for (let i: number = 0; i < arg.functions.count; i++) {
                this.element(arg.functions.getItem(i));
            }
        }
    }

    private element(el: OfficeMathFunctionBase): void {
        switch (el.type) {
        case MathFunctionType.RunElement: this.run(el as OfficeMathRunElement); break;
        case MathFunctionType.Accent: this.accent(el as OfficeMathAccent); break;
        case MathFunctionType.Bar:
            this.out += (el as OfficeMathBar).barTop ? '\\overline' : '\\underline';
            this.group((el as OfficeMathBar).equation);
            break;
        case MathFunctionType.Box: this.out += '\\box'; this.group((el as OfficeMathBox).equation); break;
        case MathFunctionType.BorderBox: this.out += '\\fbox'; this.group((el as OfficeMathBorderBox).equation); break;
        case MathFunctionType.Fraction: this.fraction(el as OfficeMathFraction); break;
        case MathFunctionType.Function: this.func(el as OfficeMathFunction); break;
        case MathFunctionType.Delimiter: this.delimiter(el as OfficeMathDelimiter); break;
        case MathFunctionType.GroupCharacter: this.groupChar(el as OfficeMathGroupCharacter); break;
        case MathFunctionType.Limit: this.limit(el as OfficeMathLimit); break;
        case MathFunctionType.Matrix: this.matrix(el as OfficeMathMatrix); break;
        case MathFunctionType.NArray: this.nary(el as OfficeMathNArray); break;
        case MathFunctionType.Radical: this.radical(el as OfficeMathRadical); break;
        case MathFunctionType.SubSuperscript: {
            const s: OfficeMathScript = el as OfficeMathScript;
            this.script(s.equation, s.scriptType === MathScriptType.Subscript ? '_' : '^', s.script);
            break;
        }
        case MathFunctionType.LeftSubSuperscript: {
            const s: OfficeMathLeftScript = el as OfficeMathLeftScript;
            this.out += '{_';
            this.group(s.subscript);
            this.out += '^';
            this.group(s.superscript);
            this.out += '}';
            this.group(s.equation);
            break;
        }
        case MathFunctionType.RightSubSuperscript: {
            const s: OfficeMathRightScript = el as OfficeMathRightScript;
            this.group(s.equation);
            this.out += '_';
            this.group(s.subscript);
            this.out += '^';
            this.group(s.superscript);
            break;
        }
        case MathFunctionType.EquationArray: {
            const e: OfficeMathEquationArray = el as OfficeMathEquationArray;
            this.out += '\\eqarray{';
            for (let i: number = 0; i < e.equations.count; i++) {
                if (i > 0) {
                    this.out += '@';
                }
                this.arg(e.equations.getItem(i));
            }
            this.out += '}';
            break;
        }
        default: break;
        }
    }

    private accent(el: OfficeMathAccent): void {
        const code: number = el.accentCharacter.charCodeAt(0);
        this.out += orDefault(ownValue<string>(ACCENT_COMMANDS, code), '');
        this.group(el.equation);
        if (code === 831) {
            this.out += '}';
        }
    }

    private fraction(el: OfficeMathFraction): void {
        const type: MathFractionType = el.fractionType;
        if (type === MathFractionType.NormalFractionBar) {
            this.out += '\\frac';
        } else if (type === MathFractionType.SkewedFractionBar || type === MathFractionType.FractionInline) {
            this.out += '\\sfrac';
        }
        this.group(el.numerator);
        if (type === MathFractionType.NoFractionBar) {
            this.out += '\\atop';
        }
        this.group(el.denominator);
    }

    private func(el: OfficeMathFunction): void {
        this.inFunctionName = true;
        this.out += '\\';
        this.arg(el.functionName);
        this.inFunctionName = false;
        this.group(el.equation);
    }

    private delimiterChar(chr: string): void {
        this.out += chr.length > 0 ? orDefault(DELIMITER_COMMANDS[chr.charCodeAt(0)], '') : '.';
    }

    private delimiter(el: OfficeMathDelimiter): void {
        this.out += '\\left';
        this.delimiterChar(el.beginCharacter);
        this.out += ' ';
        for (let i: number = 0; i < el.equations.count; i++) {
            this.arg(el.equations.getItem(i));
            if (i < el.equations.count - 1) {
                this.out += '\\middle';
                this.delimiterChar(el.separator);
                this.out += ' ';
            }
        }
        this.out += '\\right';
        this.delimiterChar(el.endCharacter);
    }

    private groupChar(el: OfficeMathGroupCharacter): void {
        const code: number = el.groupCharacter.charCodeAt(0);
        if (code === 9182) {
            this.out += '\\overbrace';
        } else if (code === 9183) {
            this.out += '\\underbrace';
        }
        this.group(el.equation);
    }

    private limit(el: OfficeMathLimit): void {
        if (!this.inFunctionName) {
            this.out += '{';
        }
        this.arg(el.equation);
        if (!this.inFunctionName) {
            this.out += '}';
        }
        this.out += '\\below';
        this.group(el.limit);
    }

    private matrix(el: OfficeMathMatrix): void {
        this.out += '\\begin{matrix}';
        for (const row of el.rowItems) {
            const count: number = row.arguments.count;
            for (let i: number = 0; i < count; i++) {
                this.arg(row.arguments.getItem(i));
                if (i !== count - 1) {
                    this.out += '&';
                }
            }
            this.out += '\\\\';
        }
        this.out += '\\end{matrix}';
    }

    private nary(el: OfficeMathNArray): void {
        this.out += orDefault(NARY_COMMANDS[el.nArrayCharacter.charCodeAt(0)], '');
        if (el.subscript.functions.count > 0) {
            this.out += '_';
            this.group(el.subscript);
        }
        if (el.superscript.functions.count > 0) {
            this.out += '^';
            this.group(el.superscript);
        }
        this.group(el.equation);
    }

    private radical(el: OfficeMathRadical): void {
        this.out += '\\sqrt';
        if (el.degree.functions.count > 0) {
            this.out += '[';
            this.arg(el.degree);
            this.out += ']';
        }
        this.group(el.equation);
    }

    private script(base: OfficeMath, op: string, script: OfficeMath): void {
        if (!this.inFunctionName) {
            this.out += '{';
        }
        this.arg(base);
        if (!this.inFunctionName) {
            this.out += '}';
        }
        this.out += op;
        this.group(script);
    }

    private run(el: OfficeMathRunElement): void {
        const text: string = el.text;
        const format: OfficeMathFormat = el.mathFormat;
        const sty: MathStyleType = format.isExplicit(K.Style) ? format.style : undefined;
        const scr: MathFontType = format.isExplicit(K.Script) ? format.font : undefined;
        const openers: string[] = [];
        if (sty === MathStyleType.BoldItalic) {
            openers.push('\\mathbit{');
        } else if (sty === MathStyleType.Bold) {
            openers.push('\\mathbf{');
        }
        const fontCommand: string | undefined = scr !== undefined ? ownValue<string>(FONT_COMMANDS, scr) : undefined;
        if (fontCommand !== undefined) {
            openers.push(`${fontCommand}{`);
        }
        if (format.hasNormalText) {
            openers.push('\\mathrm{');
        }
        let applied: number = 0;
        let applyFormats: boolean = true;
        let lastSymbol: boolean = false;
        for (const ch of text) {
            const symbol: string = getSymbolLatex(ch, scr === MathFontType.Script);
            if (symbol !== undefined) {
                this.out += '}'.repeat(applied);
                applied = 0;
                applyFormats = true;
                this.out += symbol;
                lastSymbol = true;
                continue;
            }
            if (lastSymbol && LETTER.test(ch)) {
                this.out += ' ';
            }
            lastSymbol = false;
            if (applyFormats) {
                this.out += openers.join('');
                applied = openers.length;
                applyFormats = false;
            }
            this.out += ch;
        }
        this.out += '}'.repeat(applied);
    }
}

/**
 * Converts a math paragraph (or a single `m:oMath`) to a LaTeX string.
 *
 * @param {OfficeMathParagraph | OfficeMath} math - The math.
 * @returns {string} The result.
 * @public
 */
export function mathToLatex(math: OfficeMathParagraph | OfficeMath): string {
    return new LatexGenerator().generate(math instanceof OfficeMathParagraph ? math.maths.toArray() : [math]);
}
