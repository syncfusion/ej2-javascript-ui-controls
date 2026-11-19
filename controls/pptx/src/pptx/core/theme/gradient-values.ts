/**
 * Internal gradient lexical conversions; reading never normalizes document XML.
 *
 * @remarks
 * Sources: Strict/Transitional dml-main.xsd ST_PositiveFixedAngle,
 * ST_Percentage and ST_PositiveFixedPercentage; shared-commonSimpleTypes.xsd
 * percentage patterns; XML Schema boolean. Stop bounds also follow ECMA-376
 * Part 1 20.1.8.36. Public normalized positions are not .NET's 0..100 scale.
 */

/** Namespace/lexical dialect of the owning part. @internal */
export type GradientDialect = 'strict' | 'transitional';
/** Stops are bounded; relative rectangle offsets allow outsets. @internal */
export type GradientPercentageDomain = 'stop' | 'rectangle';
/** Sparse authored value with its original token, including invalid input. @internal */
export type GradientLexical<T> =
    { readonly kind: 'absent'; } |
    { readonly kind: 'invalid'; readonly raw: string; } |
    { readonly kind: 'value'; readonly raw: string; readonly value: T; };

/**
 * Parses a percentage to a normalized ratio, keeping absent/invalid distinct.
 *
 * @param {string | undefined} raw - Untouched XML attribute value.
 * @param {GradientDialect} dialect - Owning part's dialect.
 * @param {GradientPercentageDomain} domain - Stop or relative rectangle offset.
 * @returns {GradientLexical<number>} Authored token and normalized ratio.
 * @internal
 */
export function parseGradientPercentage(
    raw: string | undefined, dialect: GradientDialect, domain: GradientPercentageDomain
): GradientLexical<number> {
    if (raw === undefined) { return { kind: 'absent' }; }
    let value: number;
    if (raw.charAt(raw.length - 1) === '%') {
        const decimal: string = raw.slice(0, -1);
        if (!isPercentageDecimal(decimal, domain)) { return { kind: 'invalid', raw }; }
        value = Number(decimal + 'e-2');
    } else {
        if (dialect !== 'transitional') { return { kind: 'invalid', raw }; }
        const integer: number | undefined = parseInteger(raw);
        if (integer === undefined || integer < -2147483648 || integer > 2147483647) {
            return { kind: 'invalid', raw };
        }
        value = integer / 100000;
    }
    if (!Number.isFinite(value) || (domain === 'stop' && (value < 0 || value > 1))) {
        return { kind: 'invalid', raw };
    }
    return { kind: 'value', raw, value };
}

/**
 * Parses a positive fixed DrawingML angle to clockwise degrees.
 *
 * @param {string | undefined} raw - Integer sixtieth-thousandths of a degree.
 * @returns {GradientLexical<number>} Degrees, absent, or invalid authored token.
 * @internal
 */
export function parseGradientAngle(raw: string | undefined): GradientLexical<number> {
    if (raw === undefined) { return { kind: 'absent' }; }
    const value: number | undefined = parseInteger(raw);
    if (value === undefined || value < 0 || value >= 21600000) { return { kind: 'invalid', raw }; }
    return { kind: 'value', raw, value: value / 60000 };
}

/**
 * Parses XML Schema booleans, collapsing XML whitespace only.
 *
 * @param {string | undefined} raw - Authored boolean token.
 * @returns {GradientLexical<boolean>} Boolean, absent, or invalid token.
 * @internal
 */
export function parseGradientBoolean(raw: string | undefined): GradientLexical<boolean> {
    if (raw === undefined) { return { kind: 'absent' }; }
    const token: string = trimXmlWhitespace(raw);
    if (token === 'true' || token === '1') { return { kind: 'value', raw, value: true }; }
    if (token === 'false' || token === '0') { return { kind: 'value', raw, value: false }; }
    return { kind: 'invalid', raw };
}

/**
 * Serializes an edited normalized ratio without rewriting untouched lexemes.
 *
 * @remarks Transitional values round to 1/100000, ties away from zero.
 * Strict stops round to 0.01 percent, as required by the shared fixed-percentage
 * pattern. Strict rectangles use a finite exponent-free decimal percentage.
 * @param {number} value - Normalized ratio, not a displayed 0..100 percentage.
 * @param {GradientDialect} dialect - Owning part's dialect.
 * @param {GradientPercentageDomain} domain - Stop or rectangle offset.
 * @returns {string} Legal token for the selected dialect/domain.
 * @throws {RangeError} Input is non-finite, outside its domain, or not representable.
 * @internal
 */
export function serializeGradientPercentage(
    value: number, dialect: GradientDialect, domain: GradientPercentageDomain
): string {
    if (!Number.isFinite(value) || (domain === 'stop' && (value < 0 || value > 1))) {
        throw new RangeError('Invalid gradient percentage.');
    }
    if (dialect === 'transitional') {
        const units: number = roundAwayFromZero(value * 100000);
        if (!Number.isFinite(units) || units < -2147483648 || units > 2147483647) {
            throw new RangeError('Gradient percentage exceeds the Transitional integer range.');
        }
        return String(units);
    }
    return (domain === 'stop' ? decimalToken(Math.round(value * 10000) / 100) : decimalToken(value, 2)) + '%';
}

/**
 * Serializes edited degrees to the nearest DrawingML angle unit.
 *
 * @param {number} value - Clockwise degrees in [0, 360).
 * @returns {string} Integer sixtieth-thousandths of a degree.
 * @throws {RangeError} Invalid degrees or rounding exceeds the exclusive limit.
 * @internal
 */
export function serializeGradientAngle(value: number): string {
    const units: number = Math.round(value * 60000);
    if (!Number.isFinite(value) || value < 0 || value >= 360 || units >= 21600000) {
        throw new RangeError('Invalid gradient angle.');
    }
    return String(units);
}

/**
 * Serializes an edited boolean to its canonical XML Schema numeric form.
 *
 * @param {boolean} value - Explicit authored boolean.
 * @returns {string} One or zero; absence is handled by the host writer.
 * @throws {RangeError} JavaScript callers supply a non-boolean.
 * @internal
 */
export function serializeGradientBoolean(value: boolean): string {
    if (typeof value !== 'boolean') { throw new RangeError('Invalid gradient boolean.'); }
    return value ? '1' : '0';
}

/**
 * Removes XML whitespace at token boundaries without accepting Unicode whitespace.
 *
 * @param {string} raw - Integer or boolean token (not a string percentage).
 * @returns {string} Token with XML edge whitespace removed.
 */
function trimXmlWhitespace(raw: string): string {
    return raw.replace(/^[ \t\r\n]+/, '').replace(/[ \t\r\n]+$/, '');
}

/**
 * Reads the XML Schema integer lexical form without accepting JS hex/exponents.
 *
 * @param {string} raw - Authored integer token.
 * @returns {number | undefined} Finite integer, or undefined for malformed input.
 */
function parseInteger(raw: string): number | undefined {
    const token: string = trimXmlWhitespace(raw);
    if (!/^[+-]?[0-9]+$/.test(token)) { return undefined; }
    const value: number = Number(token);
    return Number.isFinite(value) ? value : undefined;
}

/**
 * Validates percentage decimals without nested regex repetitions on untrusted text.
 *
 * @param {string} raw - Decimal portion before the percent sign.
 * @param {GradientPercentageDomain} domain - Stop or rectangle lexical pattern.
 * @returns {boolean} Whether the complete decimal matches its schema pattern.
 */
function isPercentageDecimal(raw: string, domain: GradientPercentageDomain): boolean {
    const token: string = domain === 'rectangle' && raw.charAt(0) === '-' ? raw.slice(1) : raw;
    const point: number = token.indexOf('.');
    const whole: string = point < 0 ? token : token.slice(0, point);
    const fraction: string = point < 0 ? '' : token.slice(point + 1);
    if (!/^[0-9]+$/.test(whole) || (point >= 0 && !/^[0-9]+$/.test(fraction))) { return false; }
    return domain === 'rectangle' || ((whole.length <= 2 || whole === '100') && fraction.length <= 2);
}

/**
 * Rounds half units away from zero for deterministic authored integer output.
 *
 * @param {number} value - Scaled percentage units.
 * @returns {number} Rounded units.
 */
function roundAwayFromZero(value: number): number {
    return value < 0 ? -Math.round(-value) : Math.round(value);
}

/**
 * Shifts a decimal token without binary multiplication or exponent output.
 *
 * @param {number} value - Finite normalized ratio or percentage.
 * @param {number} shift - Decimal places to move right (two converts ratio to percent).
 * @returns {string} Exponent-free decimal preserving the JS number representation.
 */
function decimalToken(value: number, shift: number = 0): string {
    if (value === 0) { return '0'; }
    const text: string = String(value);
    const exponentAt: number = text.indexOf('e');
    if (exponentAt < 0 && shift === 0) { return text; }
    const mantissa: string = exponentAt < 0 ? text : text.slice(0, exponentAt);
    const sign: string = mantissa.charAt(0) === '-' ? '-' : '';
    const unsigned: string = sign === '' ? mantissa : mantissa.slice(1);
    const decimalAt: number = unsigned.indexOf('.');
    let digits: string = unsigned.replace('.', '');
    let point: number = (decimalAt < 0 ? unsigned.length : decimalAt) + shift +
        (exponentAt < 0 ? 0 : Number(text.slice(exponentAt + 1)));
    while (digits.length > 1 && digits.charAt(0) === '0' && point > 1) {
        digits = digits.slice(1); point--;
    }
    if (point <= 0) { return sign + '0.' + '0'.repeat(-point) + digits; }
    if (point >= digits.length) { return sign + digits + '0'.repeat(point - digits.length); }
    return sign + digits.slice(0, point) + '.' + digits.slice(point);
}
