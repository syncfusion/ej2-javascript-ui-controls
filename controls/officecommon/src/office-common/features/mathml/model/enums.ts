/**
 * Schema-exact Office Math simple-type unions.
 *
 * Source: ECMA-376 Part 1 §22.1.3 / Part 4 Annex A.8.1 `shared-math.xsd`.
 * Serializer emits only these tokens — never synthesize members.
 */

/**
 * Math paragraph justification.
 *
 * Source: ECMA-376-1 §22.1.3.7 `ST_Jc`.
 *
 * @public
 */
export type MathJc = 'left' | 'right' | 'center' | 'centerGroup';

/**
 * Fraction type.
 *
 * Source: ECMA-376-1 §22.1.3.4 `ST_FType`.
 *
 * @public
 */
export type MathFractionType = 'bar' | 'skw' | 'lin' | 'noBar';

/**
 * Delimiter shape.
 *
 * Source: ECMA-376-1 §22.1.3.10 `ST_Shp` — `'centered' | 'match'` only
 * (NOT `'distributed'`).
 *
 * @public
 */
export type MathShape = 'centered' | 'match';

/**
 * N-ary limit location.
 *
 * Source: ECMA-376-1 §22.1.3.8 `ST_LimLoc`.
 *
 * @public
 */
export type MathLimLoc = 'undOvr' | 'subSup';

/**
 * Top/bottom placement (bar, groupChr).
 *
 * Source: ECMA-376-1 §22.1.3.13 `ST_TopBot`.
 *
 * @public
 */
export type MathTopBot = 'top' | 'bot';

/**
 * Break on binary operator.
 *
 * Source: ECMA-376-1 §22.1.3.1 `ST_BreakBin`.
 *
 * @public
 */
export type MathBreakBin = 'before' | 'after' | 'repeat';

/**
 * Break-bin subscript alignment.
 *
 * Source: ECMA-376-1 §22.1.3.2 `ST_BreakBinSub`.
 *
 * @public
 */
export type MathBreakBinSub = '--' | '-+' | '+-';

/**
 * Math script (font family class).
 *
 * Source: ECMA-376-1 §22.1.3.9 `ST_Script`.
 *
 * @public
 */
export type MathScript =
  | 'roman'
  | 'script'
  | 'fraktur'
  | 'double-struck'
  | 'sans-serif'
  | 'monospace';

/**
 * Math style (plain/bold/italic).
 *
 * Source: ECMA-376-1 §22.1.3.12 `ST_Style`.
 *
 * @public
 */
export type MathStyle = 'p' | 'b' | 'i' | 'bi';

/**
 * Spacing rule enumeration (0..4).
 *
 * Source: ECMA-376-1 §22.1.3.11 `ST_SpacingRule`.
 *
 * @public
 */
export type MathSpacingRule = 0 | 1 | 2 | 3 | 4;

/** Members of {@link MathJc}. */
export const MATH_JC_VALUES: string[] = ['left', 'right', 'center', 'centerGroup'];

/** Members of {@link MathFractionType}. */
export const MATH_FTYPE_VALUES: string[] = ['bar', 'skw', 'lin', 'noBar'];

/** Members of {@link MathShape} — centered|match only. */
export const MATH_SHP_VALUES: string[] = ['centered', 'match'];

/** Members of {@link MathLimLoc}. */
export const MATH_LIMLOC_VALUES: string[] = ['undOvr', 'subSup'];

/** Members of {@link MathTopBot}. */
export const MATH_TOPBOT_VALUES: string[] = ['top', 'bot'];

/** Members of {@link MathBreakBin}. */
export const MATH_BREAKBIN_VALUES: string[] = ['before', 'after', 'repeat'];

/** Members of {@link MathBreakBinSub}. */
export const MATH_BREAKBINSUB_VALUES: string[] = ['--', '-+', '+-'];

/** Members of {@link MathScript}. */
export const MATH_SCRIPT_VALUES: string[] = [
    'roman',
    'script',
    'fraktur',
    'double-struck',
    'sans-serif',
    'monospace'
];

/** Members of {@link MathStyle}. */
export const MATH_STYLE_VALUES: string[] = ['p', 'b', 'i', 'bi'];

/** Members of {@link MathSpacingRule}. */
export const MATH_SPACING_RULE_VALUES: number[] = [0, 1, 2, 3, 4];

/**
 * Parse ST_Jc; undefined when not a known token.
 *
 * @param {string} value - The value.
 * @returns {MathJc | undefined} The result.
 */
export function parseMathJc(value: string): MathJc | undefined {
    return ((MATH_JC_VALUES as ReadonlyArray<string>).indexOf(value) !== -1) ? (value as MathJc) : undefined;
}

/**
 * Parse ST_FType.
 *
 * @param {string} value - The value.
 * @returns {MathFractionType | undefined} The result.
 */
export function parseMathFractionType(value: string): MathFractionType | undefined {
    return ((MATH_FTYPE_VALUES as ReadonlyArray<string>).indexOf(value) !== -1)
        ? (value as MathFractionType)
        : undefined;
}

/**
 * Parse ST_Shp.
 *
 * @param {string} value - The value.
 * @returns {MathShape | undefined} The result.
 */
export function parseMathShape(value: string): MathShape | undefined {
    return ((MATH_SHP_VALUES as ReadonlyArray<string>).indexOf(value) !== -1) ? (value as MathShape) : undefined;
}

/**
 * Parse ST_LimLoc.
 *
 * @param {string} value - The value.
 * @returns {MathLimLoc | undefined} The result.
 */
export function parseMathLimLoc(value: string): MathLimLoc | undefined {
    return ((MATH_LIMLOC_VALUES as ReadonlyArray<string>).indexOf(value) !== -1)
        ? (value as MathLimLoc)
        : undefined;
}

/**
 * Parse ST_TopBot.
 *
 * @param {string} value - The value.
 * @returns {MathTopBot | undefined} The result.
 */
export function parseMathTopBot(value: string): MathTopBot | undefined {
    return ((MATH_TOPBOT_VALUES as ReadonlyArray<string>).indexOf(value) !== -1)
        ? (value as MathTopBot)
        : undefined;
}

/**
 * Parse ST_BreakBin.
 *
 * @param {string} value - The value.
 * @returns {MathBreakBin | undefined} The result.
 */
export function parseMathBreakBin(value: string): MathBreakBin | undefined {
    return ((MATH_BREAKBIN_VALUES as ReadonlyArray<string>).indexOf(value) !== -1)
        ? (value as MathBreakBin)
        : undefined;
}

/**
 * Parse ST_BreakBinSub.
 *
 * @param {string} value - The value.
 * @returns {MathBreakBinSub | undefined} The result.
 */
export function parseMathBreakBinSub(value: string): MathBreakBinSub | undefined {
    return ((MATH_BREAKBINSUB_VALUES as ReadonlyArray<string>).indexOf(value) !== -1)
        ? (value as MathBreakBinSub)
        : undefined;
}

/**
 * Parse ST_Script.
 *
 * @param {string} value - The value.
 * @returns {MathScript | undefined} The result.
 */
export function parseMathScript(value: string): MathScript | undefined {
    return ((MATH_SCRIPT_VALUES as ReadonlyArray<string>).indexOf(value) !== -1)
        ? (value as MathScript)
        : undefined;
}

/**
 * Parse ST_Style.
 *
 * @param {string} value - The value.
 * @returns {MathStyle | undefined} The result.
 */
export function parseMathStyle(value: string): MathStyle | undefined {
    return ((MATH_STYLE_VALUES as ReadonlyArray<string>).indexOf(value) !== -1)
        ? (value as MathStyle)
        : undefined;
}

/**
 * ST_Integer2 range −2..2 (argSz).
 *
 * Source: ECMA-376-1 §22.1.3.5.
 *
 * @param {number} value - The value.
 * @returns {boolean} The result.
 */
export function isInteger2(value: number): boolean {
    return Number.isInteger(value) && value >= -2 && value <= 2;
}

/**
 * ST_Integer255 range 1..255.
 *
 * Source: ECMA-376-1 §22.1.3.6.
 *
 * @param {number} value - The value.
 * @returns {boolean} The result.
 */
export function isInteger255(value: number): boolean {
    return Number.isInteger(value) && value >= 1 && value <= 255;
}

/**
 * ST_UnSignedInteger ≥ 0.
 *
 * Source: ECMA-376-1 §22.1.3.14.
 *
 * @param {number} value - The value.
 * @returns {boolean} The result.
 */
export function isUnSignedInteger(value: number): boolean {
    return Number.isInteger(value) && value >= 0;
}

/**
 * ST_SpacingRule 0..4.
 *
 * Source: ECMA-376-1 §22.1.3.11.
 *
 * @param {number} value - The value.
 * @returns {boolean} The result.
 */
export function isSpacingRule(value: number): value is MathSpacingRule {
    return Number.isInteger(value) && value >= 0 && value <= 4;
}

/**
 * Parse OnOff-style val attribute (`1`/`true`/`on` → true).
 *
 * @param {string | undefined} value - The value.
 * @returns {boolean | undefined} The result.
 */
export function parseOnOff(value: string | undefined): boolean | undefined {
    if (value === undefined) {
        return undefined;
    }
    const v: string = value.toLowerCase();
    if (v === '1' || v === 'true' || v === 'on') {
        return true;
    }
    if (v === '0' || v === 'false' || v === 'off') {
        return false;
    }
    return undefined;
}

/**
 * Emit OnOff as `'1'` / `'0'`.
 *
 * @param {boolean} value - The value.
 * @returns {string} The result.
 */
export function emitOnOff(value: boolean): string {
    return value ? '1' : '0';
}
