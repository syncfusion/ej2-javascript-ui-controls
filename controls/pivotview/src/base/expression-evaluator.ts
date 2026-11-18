/**
 * CSP-Safe Expression Evaluator for Calculated Field Formulas
 *
 * This module provides a secure, CSP-compliant arithmetic expression parser
 * that supports:
 * - Numeric literals (including scientific notation)
 * - String literals
 * - Arithmetic operators: +, -, *, /, %, ^
 * - Comparison operators: <, >, <=, >=, ==, ===, !=, !==
 * - Logical operators: &&, ||, !
 * - Math functions: min, max, abs, pow, sqrt, floor, ceil, round, trunc, log, exp
 * - Math constants: PI, E
 * - Ternary operator: condition ? value1 : value2
 * - Parenthesized expressions
 * - Unary +/-
 *
 * Operator precedence (lowest to highest):
 * 1. Logical OR: ||
 * 2. Logical AND: &&
 * 3. Equality: ==, ===, !=, !==
 * 4. Comparison: <, >, <=, >=
 * 5. Additive: +, -
 * 6. Multiplicative: *, /, %
 * 7. Exponentiation: ^ (right-associative)
 * 8. Unary: +, -, !
 * 9. Primary: literals, parentheses, function calls, constants
 *
 * No eval(), Function(), or dynamic code execution.
 * Fully CSP-compliant.
 */

/**
 * Evaluates a CSP-safe arithmetic expression containing substituted calculated field formulas.
 *
 * @param {string} expression - The formula text to evaluate
 * @returns {number | string | boolean} The evaluated result
 * @throws {Error} for invalid expressions
 */
export function evaluateExpression(expression: string): number | string | boolean | null | undefined {
    const evaluator: ExpressionEvaluator = new ExpressionEvaluator(expression);
    return evaluator.parse();
}

type ExpressionValue = number | string | boolean | null | undefined;
type MathFunction = (...args: number[]) => number;

/**
 * Internal class implementing the recursive descent parser.
 *
 * @hidden
 */
class ExpressionEvaluator {
    private pos: number = 0;
    private input: string;

    // Math functions registry (whitelisted)
    private readonly mathFunctions: Map<string, MathFunction> = new Map<string, MathFunction>([
        ['min', Math.min],
        ['max', Math.max],
        ['abs', Math.abs],
        ['pow', Math.pow],
        ['sqrt', Math.sqrt],
        ['floor', Math.floor],
        ['ceil', Math.ceil],
        ['round', Math.round],
        ['trunc', Math.trunc],
        ['log', Math.log],
        ['exp', Math.exp],
        ['sin', Math.sin],
        ['cos', Math.cos],
        ['tan', Math.tan],
        ['asin', Math.asin],
        ['acos', Math.acos],
        ['atan', Math.atan]
    ]);

    // Math constants (whitelisted)
    private readonly mathConstants: Map<string, number> = new Map<string, number>([
        ['PI', Math.PI],
        ['E', Math.E],
        ['LN2', Math.LN2],
        ['LN10', Math.LN10],
        ['LOG2E', Math.LOG2E],
        ['LOG10E', Math.LOG10E],
        ['SQRT1_2', Math.SQRT1_2],
        ['SQRT2', Math.SQRT2]
    ]);

    constructor(input: string) {
        this.input = input;
    }

    /**
     * Main entry point: parse the entire expression
     *
     * @returns {ExpressionValue} The parsed expression result.
     */
    public parse(): ExpressionValue {
        const result: ExpressionValue = this.parseLogicalOr();
        this.skipWhitespace();
        if (this.pos < this.input.length) {
            throw new Error(`Unexpected trailing content at position ${this.pos}: "${this.input[this.pos]}"`);
        }
        return result;
    }

    // ===== Precedence levels (lowest to highest) =====

    /**
     * Level 1 (lowest): Logical OR (||)
     * Right-associative: a || b || c = a || (b || c)
     *
     * @returns {ExpressionValue} The evaluated result.
     */
    private parseLogicalOr(): ExpressionValue {
        let left: ExpressionValue = this.parseLogicalAnd();
        this.skipWhitespace();

        while (this.matchOperator('||')) {
            this.pos += 2;
            this.skipWhitespace();
            const right: ExpressionValue = this.parseLogicalAnd();
            left = this.isTruthy(left) ? left : right;
        }

        return left;
    }

    /**
     * Level 2: Logical AND (&&)
     *
     * @returns {ExpressionValue} The evaluated result.
     */
    private parseLogicalAnd(): ExpressionValue {
        let left: ExpressionValue = this.parseEquality();
        this.skipWhitespace();

        while (this.matchOperator('&&')) {
            this.pos += 2;
            this.skipWhitespace();
            const right: ExpressionValue = this.parseEquality();
            left = this.isTruthy(left) ? right : left;
        }

        return left;
    }

    /**
     * Level 3: Equality (==, ===, !=, !==)
     *
     * @returns {ExpressionValue} The evaluated result.
     */
    private parseEquality(): ExpressionValue {
        let left: ExpressionValue = this.parseComparison();
        this.skipWhitespace();

        while (this.pos < this.input.length) {
            if (this.matchOperator('===')) {
                this.pos += 3;
                const right: ExpressionValue = this.parseComparison();
                left = left === right;
            } else if (this.matchOperator('!==')) {
                this.pos += 3;
                const right: ExpressionValue = this.parseComparison();
                left = left !== right;
            } else if (this.matchOperator('==')) {
                this.pos += 2;
                const right: ExpressionValue = this.parseComparison();
                left = this.areLooseEqual(left, right);
            } else if (this.matchOperator('!=')) {
                this.pos += 2;
                const right: ExpressionValue = this.parseComparison();
                left = !this.areLooseEqual(left, right);
            } else {
                break;
            }
            this.skipWhitespace();
        }

        return left;
    }

    /**
     * Level 4: Comparison (<, >, <=, >=)
     *
     * @returns {ExpressionValue} The evaluated result.
     */
    private parseComparison(): ExpressionValue {
        let left: ExpressionValue = this.parseAddition();
        this.skipWhitespace();

        while (this.pos < this.input.length) {
            if (this.matchOperator('<=')) {
                this.pos += 2;
                const right: ExpressionValue = this.parseAddition();
                left = this.toNumber(left) <= this.toNumber(right);
            } else if (this.matchOperator('>=')) {
                this.pos += 2;
                const right: ExpressionValue = this.parseAddition();
                left = this.toNumber(left) >= this.toNumber(right);
            } else if (this.matchOperator('<')) {
                this.pos += 1;
                const right: ExpressionValue = this.parseAddition();
                left = this.toNumber(left) < this.toNumber(right);
            } else if (this.matchOperator('>')) {
                this.pos += 1;
                const right: ExpressionValue = this.parseAddition();
                left = this.toNumber(left) > this.toNumber(right);
            } else {
                break;
            }
            this.skipWhitespace();
        }

        return left;
    }

    /**
     * Level 5: Addition and subtraction (+, -)
     * Left-associative: a + b - c = (a + b) - c
     *
     * @returns {ExpressionValue} The evaluated result.
     */
    private parseAddition(): ExpressionValue {
        let left: ExpressionValue = this.parseMultiplication();
        this.skipWhitespace();

        while (this.pos < this.input.length) {
            const ch: string = this.input[this.pos];
            if (ch === '+') {
                this.pos++;
                const right: ExpressionValue = this.parseMultiplication();
                left = this.toNumber(left) + this.toNumber(right);
            } else if (ch === '-' && !this.isUnaryMinus()) {
                this.pos++;
                const right: ExpressionValue = this.parseMultiplication();
                left = this.toNumber(left) - this.toNumber(right);
            } else {
                break;
            }
            this.skipWhitespace();
        }

        return left;
    }

    /**
     * Level 6: Multiplication, division, modulo (*, /, %)
     *
     * @returns {ExpressionValue} The evaluated result.
     */
    private parseMultiplication(): ExpressionValue {
        let left: ExpressionValue = this.parseExponentiation();
        this.skipWhitespace();

        while (this.pos < this.input.length) {
            const ch: string = this.input[this.pos];
            if (ch === '*') {
                this.pos++;
                const right: ExpressionValue = this.parseExponentiation();
                left = this.toNumber(left) * this.toNumber(right);
            } else if (ch === '/') {
                this.pos++;
                const right: ExpressionValue = this.parseExponentiation();
                left = this.toNumber(left) / this.toNumber(right);
            } else if (ch === '%') {
                this.pos++;
                const right: ExpressionValue = this.parseExponentiation();
                left = this.toNumber(left) % this.toNumber(right);
            } else {
                break;
            }
            this.skipWhitespace();
        }

        return left;
    }

    /**
     * Level 7: Exponentiation (^)
     * Right-associative: a ^ b ^ c = a ^ (b ^ c)
     *
     * @returns {ExpressionValue} The evaluated result.
     */
    private parseExponentiation(): ExpressionValue {
        const base: ExpressionValue = this.parseUnary();

        this.skipWhitespace();
        if (this.pos < this.input.length && this.input[this.pos] === '^') {
            this.pos++;
            this.skipWhitespace();
            const exponent: ExpressionValue = this.parseExponentiation();
            return Math.pow(this.toNumber(base), this.toNumber(exponent));
        }

        return base;
    }

    /**
     * Level 8: Unary operators (+, -, !)
     * Right-associative: !!x = !(!x)
     *
     * @returns {ExpressionValue} The evaluated result.
     */
    private parseUnary(): ExpressionValue {
        this.skipWhitespace();

        if (this.pos < this.input.length) {
            const ch: string = this.input[this.pos];

            if (ch === '-') {
                this.pos++;
                const value: ExpressionValue = this.parseUnary();
                return -this.toNumber(value);
            } else if (ch === '+') {
                this.pos++;
                return this.parseUnary();
            } else if (ch === '!') {
                this.pos++;
                const value: ExpressionValue = this.parseUnary();
                return !this.isTruthy(value);
            }
        }

        return this.parseTernary();
    }

    /**
     * Parse ternary conditional operator (? :)
     * Lowest precedence besides logical OR, but evaluated here due to structure
     *
     * @returns {ExpressionValue} The selected expression result.
     */
    private parseTernary(): ExpressionValue {
        const condition: ExpressionValue = this.parsePrimary();
        this.skipWhitespace();

        if (this.pos < this.input.length && this.input[this.pos] === '?') {
            this.pos++;
            this.skipWhitespace();

            const trueValue: ExpressionValue = this.parseLogicalOr();
            this.skipWhitespace();

            if (this.pos >= this.input.length || this.input[this.pos] !== ':') {
                throw new Error('Expected ":" in ternary operator at position ' + this.pos);
            }
            this.pos++;
            this.skipWhitespace();

            const falseValue: ExpressionValue = this.parseTernary();
            return this.isTruthy(condition) ? trueValue : falseValue;
        }

        return condition;
    }

    /**
     * Level 9 (highest): Primary expressions
     * Literals, parentheses, function calls, constants, variables
     *
     * @returns {ExpressionValue} The parsed primary expression.
     */
    private parsePrimary(): ExpressionValue {
        this.skipWhitespace();

        if (this.pos >= this.input.length) {
            throw new Error('Unexpected end of expression');
        }

        const ch: string = this.input[this.pos];

        // String literal: "text"
        if (ch === '"') {
            return this.parseStringLiteral('"');
        }

        // String literal: 'text'
        if (ch === '\'') {
            return this.parseStringLiteral('\'');
        }

        // Parenthesized expression: (expr)
        if (ch === '(') {
            this.pos++;
            const value: ExpressionValue = this.parseLogicalOr();
            this.skipWhitespace();
            if (this.pos >= this.input.length || this.input[this.pos] !== ')') {
                throw new Error('Missing closing parenthesis at position ' + this.pos);
            }
            this.pos++;
            return value;
        }

        // Number literal or identifier (Math.function or Math.constant)
        if (this.isDigit(ch) || ch === '.') {
            return this.parseNumber();
        }

        // Identifier: true, false, Math.function, Math.constant
        if (this.isIdentifierStart(ch)) {
            return this.parseIdentifier();
        }

        throw new Error(`Unexpected character at position ${this.pos}: "${ch}"`);
    }

    // ===== Helper Methods =====

    /**
     * Parse a string literal enclosed in quotes
     *
     * @param {string} quote The quote character delimiting the literal.
     * @returns {string} The parsed string value.
     */
    private parseStringLiteral(quote: string): string {
        this.pos++; // Skip opening quote
        let value: string = '';

        while (this.pos < this.input.length && this.input[this.pos] !== quote) {
            if (this.input[this.pos] === '\\' && this.pos + 1 < this.input.length) {
                // Handle escape sequences
                this.pos++;
                const escaped: string = this.input[this.pos];
                switch (escaped) {
                case 'n':
                    value += '\n';
                    break;
                case 't':
                    value += '\t';
                    break;
                case 'r':
                    value += '\r';
                    break;
                case '\\':
                    value += '\\';
                    break;
                case '"':
                    value += '"';
                    break;
                case '\'':
                    value += '\'';
                    break;
                default:
                    value += escaped;
                }
            } else {
                value += this.input[this.pos];
            }
            this.pos++;
        }

        if (this.pos >= this.input.length) {
            throw new Error(`Unterminated string at position ${this.pos}`);
        }

        this.pos++; // Skip closing quote
        return value;
    }

    /**
     * Parse a numeric literal (including scientific notation)
     * Examples: 42, 3.14, 1e5, 1.23E-4, .5
     *
     * @returns {number} The parsed numeric value.
     */
    private parseNumber(): number {
        let numStr: string = '';

        // Integer part or leading decimal
        while (this.pos < this.input.length && (this.isDigit(this.input[this.pos]) || this.input[this.pos] === '.')) {
            numStr += this.input[this.pos];
            this.pos++;
        }

        // Exponent part: e, E, followed by optional sign and digits
        if (this.pos < this.input.length && (this.input[this.pos] === 'e' || this.input[this.pos] === 'E')) {
            numStr += this.input[this.pos];
            this.pos++;

            if (this.pos < this.input.length && (this.input[this.pos] === '+' || this.input[this.pos] === '-')) {
                numStr += this.input[this.pos];
                this.pos++;
            }

            while (this.pos < this.input.length && this.isDigit(this.input[this.pos])) {
                numStr += this.input[this.pos];
                this.pos++;
            }
        }

        const value: number = parseFloat(numStr);
        if (isNaN(value)) {
            throw new Error(`Invalid number format at position ${this.pos - numStr.length}: "${numStr}"`);
        }
        return value;
    }

    /**
     * Parse identifiers: true, false, Math.function, Math.constant
     *
     * @returns {ExpressionValue} The resolved identifier value.
     */
    private parseIdentifier(): ExpressionValue {
        let identifier: string = '';

        while (this.pos < this.input.length && (this.isIdentifierPart(this.input[this.pos]) || this.input[this.pos] === '.')) {
            identifier += this.input[this.pos];
            this.pos++;
        }

        if (identifier === 'true') {
            return true;
        }
        if (identifier === 'false') {
            return false;
        }
        // Literals that appear when a substituted aggregate value is empty or non-finite
        // (the substituted value is converted using String(value)); mirrors JavaScript semantics.
        if (identifier === 'undefined') {
            return undefined;
        }
        if (identifier === 'null') {
            return null;
        }
        if (identifier === 'NaN') {
            return NaN;
        }
        if (identifier === 'Infinity') {
            return Infinity;
        }

        if (identifier.startsWith('Math.')) {
            const name: string = identifier.substring(5);

            this.skipWhitespace();
            if (this.pos >= this.input.length || this.input[this.pos] !== '(') {
                const constant: number | undefined = this.mathConstants.get(name);
                if (constant !== undefined) {
                    return constant;
                }
                throw new Error(`Unknown Math constant: Math.${name}`);
            }

            const mathFunction: MathFunction | undefined = this.mathFunctions.get(name);
            if (mathFunction !== undefined) {
                this.pos++;
                const args: number[] = [];

                this.skipWhitespace();
                if (this.pos < this.input.length && this.input[this.pos] !== ')') {
                    args.push(this.toNumber(this.parseLogicalOr()));
                    this.skipWhitespace();

                    while (this.pos < this.input.length && this.input[this.pos] === ',') {
                        this.pos++;
                        this.skipWhitespace();
                        args.push(this.toNumber(this.parseLogicalOr()));
                        this.skipWhitespace();
                    }
                }

                if (this.pos >= this.input.length || this.input[this.pos] !== ')') {
                    throw new Error(`Missing closing parenthesis for Math.${name}() at position ${this.pos}`);
                }
                this.pos++;

                try {
                    return mathFunction(...args);
                } catch (error) {
                    const errorMessage: string = error instanceof Error ? error.message : String(error);
                    throw new Error(`Error calling Math.${name}(${args.join(', ')}): ${errorMessage}`);
                }
            }

            throw new Error(`Unknown Math function: Math.${name}`);
        }

        throw new Error(`Unknown identifier: "${identifier}"`);
    }

    /**
     * Skip whitespace characters
     *
     * @returns {void} No value is returned.
     */
    private skipWhitespace(): void {
        while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
            this.pos++;
        }
    }

    /**
     * Check if character is a digit
     *
     * @param {string} ch The character to check.
     * @returns {boolean} Whether the character is a digit.
     */
    private isDigit(ch: string): boolean {
        return ch >= '0' && ch <= '9';
    }

    /**
     * Check if character can start an identifier
     *
     * @param {string} ch The character to check.
     * @returns {boolean} Whether the character can start an identifier.
     */
    private isIdentifierStart(ch: string): boolean {
        return /[a-zA-Z_$]/.test(ch);
    }

    /**
     * Check if character is part of an identifier
     *
     * @param {string} ch The character to check.
     * @returns {boolean} Whether the character can continue an identifier.
     */
    private isIdentifierPart(ch: string): boolean {
        return /[a-zA-Z0-9_$]/.test(ch);
    }

    /**
     * Check if we have a unary minus (not binary subtraction)
     * Heuristic: minus is unary if preceded by operator or at start
     *
     * @returns {boolean} Whether the current minus is unary.
     */
    private isUnaryMinus(): boolean {
        if (this.pos === 0) {
            return true;
        }

        // Look back to see what precedes this minus
        let prevPos: number = this.pos - 1;
        while (prevPos >= 0 && /\s/.test(this.input.charAt(prevPos))) {
            prevPos--;
        }

        if (prevPos < 0) {
            return true;
        }

        const prevCh: string = this.input.charAt(prevPos);
        // Unary minus after: operators, parentheses, commas
        return /[+\-*/%^,(<>=&|!]/.test(prevCh);
    }

    /**
     * Check if operator string matches at current position
     *
     * @param {string} op The operator to match.
     * @returns {boolean} Whether the operator matches at the current position.
     */
    private matchOperator(op: string): boolean {
        return this.input.substr(this.pos, op.length) === op;
    }

    /**
     * Convert value to boolean using JavaScript truthy/falsy rules
     *
     * @param {ExpressionValue} value The value to convert.
     * @returns {boolean} The truthiness of the value.
     */
    private isTruthy(value: ExpressionValue): boolean {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'number') {
            return value !== 0 && !isNaN(value);
        }
        if (typeof value === 'string') {
            return value.length > 0;
        }
        return false;
    }

    /**
     * Convert expression values to a numeric value for arithmetic operations.
     *
     * @param {ExpressionValue} value The value to convert.
     * @returns {number} The numeric value.
     */
    private toNumber(value: ExpressionValue): number {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        if (typeof value === 'string') {
            const trimmed: string = value.trim();
            if (trimmed.length === 0) {
                return 0;
            }
            const parsed: number = Number(trimmed);
            if (Number.isNaN(parsed)) {
                throw new Error(`Cannot convert value "${value}" to a number`);
            }
            return parsed;
        }
        // JavaScript semantics: null -> 0, undefined -> NaN
        return value === null ? 0 : NaN;
    }

    /**
     * Approximate JavaScript loose equality semantics without using == or !=.
     *
     * @param {ExpressionValue} left The left expression value.
     * @param {ExpressionValue} right The right expression value.
     * @returns {boolean} Whether the values are loosely equal.
     */
    private areLooseEqual(left: ExpressionValue, right: ExpressionValue): boolean {
        if (left === null || left === undefined || right === null || right === undefined) {
            return (left === null || left === undefined) && (right === null || right === undefined);
        }
        if (typeof left === typeof right) {
            return left === right;
        }

        if (typeof left === 'number' && typeof right === 'string') {
            return this.toNumber(left) === this.toNumber(right);
        }
        if (typeof left === 'string' && typeof right === 'number') {
            return this.toNumber(left) === this.toNumber(right);
        }
        if (typeof left === 'boolean' && typeof right === 'number') {
            return Number(left) === right;
        }
        if (typeof left === 'number' && typeof right === 'boolean') {
            return left === Number(right);
        }

        return String(left) === String(right);
    }
}
