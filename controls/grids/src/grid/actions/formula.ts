import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaDefinitionModel, IAction, IGrid } from '../base/interface';
import { Column } from '../models/column';
import * as events from '../base/constant';
import { Query } from '@syncfusion/ej2-data';

export type FormulaValue = string | number | boolean | Date | null | undefined | FormulaError;

export type TokenType =
    'operator' | 'delimiter' | 'number' | 'string' |
    'reference' | 'function' | 'equals' | 'comparison';

export type FormulaResult = FormulaValue | FormulaValue[] | FormulaReferenceValue;

export interface FormulaReferenceValue {
    __isFormulaRefValue: true;
    ref: string;
    value: FormulaResult;
}

export interface Token {
    type: TokenType;
    value: string | number;
    position: number;
}

export interface EvaluationContext {
    getCell(reference: string): FormulaValue;
    getRange(startReference: string, endReference: string): FormulaValue[];
    getRowData(rowIndex?: number): Record<string, FormulaValue>;
    getFieldReference?(fieldName: string, rowIndex: number): string | undefined;
}

export interface AbsoluteFlags {
    col: boolean;
    row: boolean;
}

export interface ParsedReference {
    col: number;
    row: number;
    isAbsolute: AbsoluteFlags;
}

export interface CacheEntry {
    ast?: ASTNode;
    value?: FormulaValue;
    error?: FormulaError;
    formula?: string;
}

export interface CustomFormulaArgs {
    values: FormulaValue[];
    args: FormulaResult[];
    context: EvaluationContext;
}

export interface CustomFormulaEventArgs {
    name: string;
    params: CustomFormulaArgs;
    result?: FormulaResult;
    error?: string | Error;
    requestType: string;
    cancel?: boolean;
}

export type CustomFunction = ((params: CustomFormulaArgs) => FormulaResult) |
{ func: (params: CustomFormulaArgs) => FormulaResult } | undefined;


/** Error codes for formula evaluation */
export enum FormulaErrorCode {
    PARSE = '#PARSE!',
    REF = '#REF!',
    NAME = '#NAME?',
    CIRCREF = '#CIRCREF!',
    VALUE = '#VALUE!',
    DIVZERO = '#DIV/0!',
    ERROR = '#ERROR!'
}

/** Base error class for all formula-related errors */
export class FormulaError extends Error {
    public code: FormulaErrorCode;

    constructor(code: FormulaErrorCode, message: string) {
        super(message);
        this.code = code;
        this.name = 'FormulaError';
        Object.setPrototypeOf(this, FormulaError.prototype);
    }

    public toString(): string {
        return this.code;
    }
}

// Specialized error classes
export class ParseError extends FormulaError {
    public position?: number;

    constructor(message: string, position?: number) {
        super(FormulaErrorCode.PARSE, `Parse error: ${message}`);
        this.position = position;
        this.name = 'ParseError';
    }
}

export class ReferenceError extends FormulaError {
    constructor(message: string) {
        super(FormulaErrorCode.REF, `Reference error: ${message}`);
        this.name = 'ReferenceError';
    }
}

export class CycleError extends FormulaError {
    constructor(message: string) {
        super(FormulaErrorCode.CIRCREF, `Circular reference: ${message}`);
        this.name = 'CycleError';
    }
}

export class DivideByZeroError extends FormulaError {
    constructor(message: string = 'Division by zero') {
        super(FormulaErrorCode.DIVZERO, message);
        this.name = 'DivideByZeroError';
    }
}

export class TypeMismatchError extends FormulaError {
    constructor(message: string) {
        super(FormulaErrorCode.VALUE, `Type error: ${message}`);
        this.name = 'TypeMismatchError';
    }
}

export class UnknownFunctionError extends FormulaError {
    constructor(message: string) {
        super(FormulaErrorCode.NAME, `Unknown function: ${message}`);
        this.name = 'UnknownFunctionError';
    }
}

/** Base abstract class for all AST nodes */
export abstract class ASTNode {
    abstract accept(visitor: ASTVisitor): FormulaResult;
}

/** Literal value node (number, string, boolean) */
export class LiteralNode extends ASTNode {
    public value: FormulaValue;

    constructor(value: FormulaValue) {
        super();
        this.value = value;
    }

    public accept(visitor: ASTVisitor): FormulaResult {
        return visitor.visitLiteral(this);
    }
}

/** Cell reference node (e.g., A1, $B$2) */
export class CellRefNode extends ASTNode {
    public ref: string;
    public isAbsolute: AbsoluteFlags;

    constructor(ref: string, isAbsolute: AbsoluteFlags = { col: false, row: false }) {
        super();
        this.ref = ref;
        this.isAbsolute = isAbsolute;
    }

    public accept(visitor: ASTVisitor): FormulaResult {
        return visitor.visitCellRef(this);
    }
}

/** Range reference node (e.g., A1:B5) */
export class RangeRefNode extends ASTNode {
    public start: ASTNode;
    public end: ASTNode;

    constructor(start: ASTNode, end: ASTNode) {
        super();
        this.start = start;
        this.end = end;
    }

    public accept(visitor: ASTVisitor): FormulaResult {
        return visitor.visitRangeRef(this);
    }
}

/** Binary operation node (e.g., A + B) */
export class BinaryOpNode extends ASTNode {
    public operator: string;
    public left: ASTNode;
    public right: ASTNode;

    constructor(operator: string, left: ASTNode, right: ASTNode) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    public accept(visitor: ASTVisitor): FormulaResult {
        return visitor.visitBinaryOp(this);
    }
}

/** Unary operation node (e.g., -A, +A) */
export class UnaryOpNode extends ASTNode {
    public operator: string;
    public operand: ASTNode;

    constructor(operator: string, operand: ASTNode) {
        super();
        this.operator = operator;
        this.operand = operand;
    }

    public accept(visitor: ASTVisitor): FormulaResult {
        return visitor.visitUnaryOperator(this);
    }
}

/** Function call node (e.g., SUM(A1:A5)) */
export class FunctionCallNode extends ASTNode {
    public name: string;
    public args: ASTNode[];

    constructor(name: string, args: ASTNode[]) {
        super();
        this.name = name;
        this.args = args;
    }

    accept(visitor: ASTVisitor): FormulaResult {
        return visitor.visitFunctionCall(this);
    }
}

/** Visitor interface for traversing AST */
export interface ASTVisitor {
    visitLiteral(node: LiteralNode): FormulaResult;
    visitCellRef(node: CellRefNode): FormulaResult;
    visitRangeRef(node: RangeRefNode): FormulaResult;
    visitBinaryOp(node: BinaryOpNode): FormulaResult;
    visitUnaryOperator(node: UnaryOpNode): FormulaResult;
    visitFunctionCall(node: FunctionCallNode): FormulaResult;
}

/** Lexer: Tokenizes formula strings into tokens */
class Lexer {
    private formula: string = '';
    private position: number = 0;
    private tokens: Token[] = [];

    /**
     * Tokenizes a formula string into a collection of tokens.
     *
     * @param {string} formula - The formula string to tokenize.
     * @returns {Token[]} The tokens extracted from the formula string.
     */
    public tokenize(formula: string): Token[] {
        this.formula = formula;
        this.position = 0;
        this.tokens = [];
        if (this.peek() === '=') {
            this.tokens.push({ type: 'equals', value: '=', position: 0 });
            this.advance();
        }
        while (this.position < this.formula.length) {
            const currentChar: string = this.peek();
            if (this.isWhitespace(currentChar)) {
                this.advance();
            } else if (this.isOperator(currentChar) || this.isComparisonOperator(currentChar)) {
                this.parseOperator();
            } else if (this.isDelimiter(currentChar)) {
                this.parseDelimiter();
            } else if (this.isDigit(currentChar)) {
                this.parseNumber();
            } else if (currentChar === '"') {
                this.parseStringLiteral();
            } else if (this.isReferenceStart(currentChar)) {
                this.parseReferenceOrFunction();
            } else {
                throw new ParseError(`Unexpected character: '${currentChar}'`, this.position);
            }
        }
        return this.tokens;
    }

    private parseOperator(): void {
        const startPosition: number = this.position;
        const currentChar: string = this.peek();
        const nextChar: string = this.peekNext();
        if (nextChar === '=') {
            this.advance();
            this.advance();
            this.tokens.push({ type: 'comparison', value: currentChar + nextChar, position: startPosition });
        } else if (currentChar === '<' && nextChar === '>') {
            this.advance();
            this.advance();
            this.tokens.push({ type: 'comparison', value: '<>', position: startPosition });
        } else {
            this.advance();
            const type: TokenType = this.isComparisonOperator(currentChar) ? 'comparison' : 'operator';
            this.tokens.push({ type, value: currentChar, position: startPosition });
        }
    }

    private parseDelimiter(): void {
        const startPosition: number = this.position;
        this.tokens.push({ type: 'delimiter', value: this.peek(), position: startPosition });
        this.advance();
    }

    private parseNumber(): void {
        const tokenStartPosition: number = this.position;
        let numberLiteral: string = '';
        while (this.position < this.formula.length) {
            const currentChar: string = this.peek();
            if (!this.isDigit(currentChar) && currentChar !== '.') {
                break;
            }
            numberLiteral += currentChar;
            this.advance();
        }
        if (this.position < this.formula.length) {
            let currentChar: string = this.peek();
            if (currentChar === 'e' || currentChar === 'E') {
                numberLiteral += currentChar;
                this.advance();
                if (this.position < this.formula.length) {
                    currentChar = this.peek();
                    if (currentChar === '+' || currentChar === '-') {
                        numberLiteral += currentChar;
                        this.advance();
                    }
                }
                while (this.position < this.formula.length) {
                    currentChar = this.peek();
                    if (!this.isDigit(currentChar)) {
                        break;
                    }
                    numberLiteral += currentChar;
                    this.advance();
                }
            }
        }
        const numericValue: number = parseFloat(numberLiteral);
        if (isNaN(numericValue)) {
            throw new ParseError(`Invalid number: ${numberLiteral}`, tokenStartPosition);
        }
        this.tokens.push({ type: 'number', value: numericValue, position: tokenStartPosition });
    }

    private parseStringLiteral(): void {
        const startPosition: number = this.position;
        let stringValue: string = '';
        this.advance();
        while (this.position < this.formula.length) {
            const currentChar: string = this.peek();
            if (currentChar === '"') {
                break;
            }
            if (currentChar === '\\' && this.peekNext() === '"') {
                stringValue += '"';
                this.advance();
                this.advance();
                continue;
            }
            stringValue += currentChar;
            this.advance();
        }
        if (this.position >= this.formula.length) {
            throw new ParseError('Unterminated string literal', startPosition);
        }
        this.advance();
        this.tokens.push({ type: 'string', value: stringValue, position: startPosition });
    }

    private parseReferenceOrFunction(): void {
        const startPosition: number = this.position;
        let identifier: string = '';
        if (this.peek() === '$') {
            identifier += '$';
            this.advance();
        }
        while (this.position < this.formula.length && this.isLetter(this.peek())) {
            identifier += this.peek();
            this.advance();
        }
        if (this.peek() === '$') {
            identifier += '$';
            this.advance();
        }
        while (this.position < this.formula.length && this.isDigit(this.peek())) {
            identifier += this.peek();
            this.advance();
        }
        const normalizedIdentifier: string = identifier.toUpperCase();
        if (this.peek() === '(' || /^[A-Za-z]+$/.test(identifier)) {
            this.tokens.push({ type: 'function', value: normalizedIdentifier, position: startPosition });
            return;
        }
        if (/^\$?[A-Za-z]+\$?[0-9]+$/.test(identifier)) {
            this.tokens.push({ type: 'reference', value: normalizedIdentifier, position: startPosition });

            return;
        }
        throw new ParseError(`Invalid reference: ${identifier}`, startPosition);
    }

    private isOperator(char: string): boolean { return /[+\-*/%^×÷]/.test(char); }
    private isComparisonOperator(char: string): boolean { return /[<>=]/.test(char); }
    private isDelimiter(char: string): boolean { return /[(),:]/.test(char); }
    private isDigit(char: string): boolean { return /[0-9]/.test(char); }
    private isLetter(char: string): boolean { return /[a-zA-Z]/.test(char); }
    private isWhitespace(char: string): boolean { return /\s/.test(char); }
    private isReferenceStart(char: string): boolean { return this.isLetter(char) || char === '$'; }
    private peek(): string { return this.position < this.formula.length ? this.formula[this.position] : '\0'; }
    private peekNext(): string { return this.position + 1 < this.formula.length ? this.formula[this.position + 1] : '\0'; }
    private advance(): void { this.position++; }
}

/** ReferenceConverter: Convert between A1 notation and (col, row) coordinates */
export class ReferenceConverter {

    public static parseReference(reference: string): ParsedReference {
        if (!reference.trim()) {
            throw new ReferenceError('Invalid reference: must be non-empty string');
        }
        const normalizedReference: string = reference.trim().toUpperCase();
        let currentPosition: number = 0;
        const isColumnAbsolute: boolean = normalizedReference[parseInt(currentPosition.toString(), 10)] === '$' ? (currentPosition++, true) : false;
        let columnLetters: string = '';
        while (currentPosition < normalizedReference.length && /[A-Z]/.test(normalizedReference[parseInt(currentPosition.toString(), 10)])) {
            columnLetters += normalizedReference[currentPosition++];
        }
        if (!columnLetters) {
            throw new ReferenceError(`Invalid reference "${reference}": missing column letters`);
        }
        const isRowAbsolute: boolean = normalizedReference[parseInt(currentPosition.toString(), 10)] === '$' ? (currentPosition++, true) : false;
        let rowText: string = '';
        while (currentPosition < normalizedReference.length && /[0-9]/.test(normalizedReference[parseInt(currentPosition.toString(), 10)])) {
            rowText += normalizedReference[currentPosition++];
        }
        if (!rowText || currentPosition !== normalizedReference.length) {
            throw new ReferenceError(`Invalid reference "${reference}": invalid format. Use A1, B2, $C$3, etc.`);
        }
        const rowIndex: number = parseInt(rowText, 10);
        if (rowIndex <= 0) {
            throw new ReferenceError(`Invalid reference "${reference}": row must be positive`);
        }
        let columnIndex: number = 0;

        for (const letter of columnLetters) {
            columnIndex = columnIndex * 26 + (letter.charCodeAt(0) - 64);
        }
        return { col: columnIndex - 1, row: rowIndex - 1, isAbsolute: { col: isColumnAbsolute, row: isRowAbsolute } };
    }

    public static convertIndexToReference(columnIndex: number, rowIndex: number): string {
        if (columnIndex < 0 || rowIndex < 0) {
            throw new ReferenceError(`Invalid indices: col=${columnIndex}, row=${rowIndex}`);
        }
        let columnLetters: string = '';
        let adjustedColumnIndex: number = columnIndex + 1;
        while (adjustedColumnIndex > 0) {
            adjustedColumnIndex--;
            columnLetters = String.fromCharCode(65 + (adjustedColumnIndex % 26)) + columnLetters;
            adjustedColumnIndex = Math.floor(adjustedColumnIndex / 26);
        }
        return `${columnLetters}${rowIndex + 1}`;
    }

    public static adjustReferences(formula: string, rowOffset: number, columnOffset: number): string {
        if (!formula) {
            return formula;
        }
        const referenceFunctionPattern: RegExp = /REF\(COLUMN\((['"])([^'")]+)\1\),ROW\((\d+)\)\)/gi;
        const updatedFormula: string = formula.replace(
            referenceFunctionPattern,
            (_match: string, quote: string, fieldName: string, rowNumber: string): string =>
                `REF(COLUMN(${quote}${fieldName}${quote}),ROW(${parseInt(rowNumber, 10) + rowOffset}))`
        );
        const referencePattern: RegExp = /(\$?[A-Z]+\$?\d+:\$?[A-Z]+\$?\d+)|(\$?[A-Z]+\$?\d+)/gi;
        return updatedFormula.replace(referencePattern, (referenceText: string) => {
            if (referenceText.includes(':')) {
                const [startReference, endReference] = referenceText.split(':');
                const start: ParsedReference = this.parseReference(startReference);
                const end: ParsedReference = this.parseReference(endReference);
                const startColumn: number = start.isAbsolute.col ? start.col : start.col + columnOffset;
                const startRow: number = start.isAbsolute.row ? start.row : start.row + rowOffset;
                const endColumn: number = end.isAbsolute.col ? end.col : end.col + columnOffset;
                const endRow: number = end.isAbsolute.row ? end.row : end.row + rowOffset;
                return `${this.buildReference(start, startColumn, startRow)}:${this.buildReference(end, endColumn, endRow)}`;
            }
            const parsedReference: ParsedReference = this.parseReference(referenceText);
            const columnIndex: number = parsedReference.isAbsolute.col ? parsedReference.col : parsedReference.col + columnOffset;
            const rowIndex: number = parsedReference.isAbsolute.row ? parsedReference.row : parsedReference.row + rowOffset;
            return this.buildReference(parsedReference, columnIndex, rowIndex);
        });
    }

    private static buildReference(parsedReference: ParsedReference, columnIndex: number, rowIndex: number): string {
        const reference: string = this.convertIndexToReference(columnIndex, rowIndex);
        const matchResult: RegExpMatchArray = reference.match(/^([A-Z]+)(\d+)$/) as RegExpMatchArray;
        return `${parsedReference.isAbsolute.col ? '$' : ''}${matchResult[1]}`
            + `${parsedReference.isAbsolute.row ? '$' : ''}${matchResult[2]}`;
    }
}

/** Parser: Build an AST from a token stream using recursive descent */
class Parser {
    private tokens: Token[] = [];
    private position: number = 0;
    public parse(formula: string): ASTNode {
        const tokenizer: Lexer = new Lexer();
        this.tokens = tokenizer.tokenize(formula);
        this.position = 0;
        if (this.position < this.tokens.length && this.tokens[this.position].type === 'equals') {
            this.advance();
        }
        const expression: ASTNode = this.parseExpression();
        if (this.position < this.tokens.length) {
            throw new ParseError(`Unexpected token after expression: ${this.tokens[this.position].value}`);
        }
        return expression;
    }

    private parseExpression(): ASTNode {
        return this.parseRange();
    }

    private parseRange(): ASTNode {
        const leftNode: ASTNode = this.parseComparison();
        if (!this.match(':')) {
            return leftNode;
        }
        return new RangeRefNode(leftNode, this.parseComparison());
    }

    private parseComparison(): ASTNode {
        let leftNode: ASTNode = this.parseAdditive();
        while (this.check('comparison')) {
            const operator: string = this.advance().value as string;
            leftNode = new BinaryOpNode(operator, leftNode, this.parseAdditive());
        }
        return leftNode;
    }

    private parseAdditive(): ASTNode {
        let leftNode: ASTNode = this.parseMultiplicative();
        while (this.match('+', '-')) {
            const operator: string = this.previous().value as string;
            leftNode = new BinaryOpNode(operator, leftNode, this.parseMultiplicative());
        }
        return leftNode;
    }

    private parseMultiplicative(): ASTNode {
        let leftNode: ASTNode = this.parseExponentiation();
        while (this.match('*', '/', '%', '×', '÷')) {
            const operator: string = this.previous().value as string;
            leftNode = new BinaryOpNode(operator, leftNode, this.parseExponentiation());
        }
        return leftNode;
    }

    private parseExponentiation(): ASTNode {
        const leftNode: ASTNode = this.parseUnary();
        if (!this.match('^')) {
            return leftNode;
        }
        return new BinaryOpNode('^', leftNode, this.parseExponentiation());
    }

    private parseUnary(): ASTNode {
        if (!this.match('+', '-')) {
            return this.parsePrimary();
        }
        const operator: string = this.previous().value as string;
        return new UnaryOpNode(operator, this.parseUnary());
    }

    private parsePrimary(): ASTNode {
        if (this.check('number')) {
            return new LiteralNode(this.advance().value as number);
        }
        if (this.check('string')) {
            return new LiteralNode(this.advance().value as string);
        }
        if (this.match('(')) {
            const expression: ASTNode = this.parseExpression();
            if (!this.match(')')) {
                throw new ParseError('Expected ")" after expression', this.position);
            }
            return expression;
        }
        if (this.check('reference') || this.check('function')) {
            return this.parseReferenceOrFunction();
        }
        throw new ParseError(`Unexpected token: ${this.peek().value}`, this.position);
    }

    private parseReferenceOrFunction(): ASTNode {
        const token: Token = this.advance();
        const identifier: string = token.value as string;
        if (!this.match('(')) {
            return this.convertReferenceToNode(identifier);
        }
        const argumentsList: ASTNode[] = [];
        if (!this.check(')')) {
            do {
                argumentsList.push(this.parseExpression());
            } while (this.match(','));
        }
        if (!this.match(')')) {
            throw new ParseError('Expected ")" after function arguments', this.position);
        }
        return new FunctionCallNode(identifier, argumentsList);
    }

    private convertReferenceToNode(reference: string): CellRefNode {
        if (!/[A-Za-z]/.test(reference) || !/[0-9]/.test(reference)) {
            throw new ParseError(
                `Invalid cell reference: "${reference}". Use A1, B2, $C$3, etc.`,
                this.position
            );
        }
        const parsedReference: ParsedReference = ReferenceConverter.parseReference(reference);
        return new CellRefNode(reference.toUpperCase(), parsedReference.isAbsolute);
    }

    private match(...values: string[]): boolean {
        return values.some((value: string) => this.check(value) && (this.advance(), true));
    }

    private check(value: string): boolean {
        return !this.isAtEnd() && (this.peek().type === value || this.peek().value === value);
    }

    private advance(): Token {
        if (!this.isAtEnd()) {
            this.position++;
        }
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.position >= this.tokens.length;
    }

    private peek(): Token {
        return this.tokens[this.position];
    }

    private previous(): Token {
        return this.tokens[this.position - 1];
    }
}

/** DependencyGraph: Track cell dependencies and detect cycles */
class DependencyGraph {
    private readonly graph: Map<string, Set<string>> = new Map<string, Set<string>>();

    public addDependency(from: string, to: string): void {
        let dependencies: Set<string> | undefined = this.graph.get(from);
        if (!dependencies) {
            dependencies = new Set<string>();
            this.graph.set(from, dependencies);
        }
        dependencies.add(to);
    }

    public removeDependency(from: string, to: string): void {
        const dependencies: Set<string> | undefined = this.graph.get(from);
        if (!dependencies) {
            return;
        }
        dependencies.delete(to);
        if (dependencies.size === 0) {
            this.graph.delete(from);
        }
    }

    public clear(): void {
        this.graph.clear();
    }

    public detectCycles(): Set<string> {
        const visited: Map<string, number> = new Map<string, number>();
        const cycleNodes: Set<string> = new Set<string>();
        this.graph.forEach((_: Set<string>, node: string): void => {
            if (!visited.has(node)) {
                this.hasCycleFromNode(node, visited, cycleNodes);
            }
        });
        return cycleNodes;
    }

    private hasCycleFromNode(node: string, visited: Map<string, number>, cycleNodes: Set<string>): boolean {
        visited.set(node, 1);
        const neighbors: Set<string> | undefined = this.graph.get(node);
        if (neighbors) {
            let hasCycle: boolean = false;
            neighbors.forEach((neighbor: string) => {
                if (hasCycle) {
                    return;
                }
                if (!visited.has(neighbor)) {
                    if (this.hasCycleFromNode(neighbor, visited, cycleNodes)) {
                        cycleNodes.add(node);
                        hasCycle = true;
                    }
                } else if (visited.get(neighbor) === 1) {
                    cycleNodes.add(node);
                    cycleNodes.add(neighbor);
                    hasCycle = true;
                }
            });
            if (hasCycle) {
                return true;
            }
        }
        visited.set(node, 2);
        return false;
    }

}

/** Evaluator: Execute AST with spreadsheet type coercion */
class Evaluator implements ASTVisitor {
    private context: EvaluationContext | null = null;
    private formulaEngine: Formula | null = null;

    public setFormulaEngine(formulaEngine: Formula): void {
        this.formulaEngine = formulaEngine;
    }

    public evaluate(astNode: ASTNode, evaluationContext: EvaluationContext): FormulaValue {
        this.context = evaluationContext;
        const result: FormulaResult = astNode.accept(this);
        // Unwrap FormulaReferenceValue to get the actual value
        if (this.isFormulaReferenceValue(result)) {
            const unwrappedValue: FormulaResult = result.value;
            if (this.isFormulaReferenceValue(unwrappedValue)) {
                return this.evaluate(astNode, evaluationContext);
            }
            return unwrappedValue as FormulaValue;
        }
        return result as FormulaValue;
    }
    private resolveReferenceNode(node: ASTNode): string {
        if (node instanceof CellRefNode) {
            return node.ref;
        }
        const value: FormulaResult | FormulaReferenceValue = node.accept(this);
        return this.isFormulaReferenceValue(value) ? value.ref : this.convertToReference(value);
    }

    public visitLiteral(node: LiteralNode): FormulaValue {
        return node.value;
    }

    public visitCellRef(node: CellRefNode): FormulaValue {
        return (this.context as EvaluationContext).getCell(node.ref);
    }

    public visitRangeRef(node: RangeRefNode): FormulaResult {
        const startReference: string = this.resolveReferenceNode(node.start);
        const endReference: string = this.resolveReferenceNode(node.end);
        return (this.context as EvaluationContext).getRange(startReference, endReference);
    }

    public visitBinaryOp(node: BinaryOpNode): number {
        const leftValue: FormulaResult = node.left.accept(this);
        const rightValue: FormulaResult = node.right.accept(this);
        switch (node.operator) {
        case '+':
            return this.convertToNumber(leftValue) + this.convertToNumber(rightValue);
        case '-':
            return this.convertToNumber(leftValue) - this.convertToNumber(rightValue);
        case '*':
        case '×':
            return this.convertToNumber(leftValue) * this.convertToNumber(rightValue);
        case '/':
        case '÷': {
            const divisor: number = this.convertToNumber(rightValue);
            if (divisor === 0) {
                throw new DivideByZeroError();
            }
            return this.convertToNumber(leftValue) / divisor;
        }
        case '%':
            return this.convertToNumber(leftValue) % this.convertToNumber(rightValue);
        case '^':
            return Math.pow(this.convertToNumber(leftValue), this.convertToNumber(rightValue));
        case '>':
            return this.convertToNumber(leftValue) > this.convertToNumber(rightValue) ? 1 : 0;
        case '<':
            return this.convertToNumber(leftValue) < this.convertToNumber(rightValue) ? 1 : 0;
        case '>=':
            return this.convertToNumber(leftValue) >= this.convertToNumber(rightValue) ? 1 : 0;
        case '<=':
            return this.convertToNumber(leftValue) <= this.convertToNumber(rightValue) ? 1 : 0;
        case '=':
            return this.convertToNumber(leftValue) === this.convertToNumber(rightValue) ? 1 : 0;
        case '<>':
            return this.convertToNumber(leftValue) !== this.convertToNumber(rightValue) ? 1 : 0;
        default:
            throw new FormulaError(FormulaErrorCode.ERROR, `Unknown operator: ${node.operator}`);
        }
    }

    public visitUnaryOperator(node: UnaryOpNode): number {
        const operandValue: FormulaResult = node.operand.accept(this);
        switch (node.operator) {
        case '+':
            return this.convertToNumber(operandValue);
        case '-':
            return -this.convertToNumber(operandValue);
        default:
            throw new FormulaError(FormulaErrorCode.ERROR, `Unknown unary operator: ${node.operator}`);
        }
    }
    public visitFunctionCall(node: FunctionCallNode): FormulaResult {
        const functionName: string = node.name.toUpperCase();
        const builtInFunctions: Set<string> = new Set([
            'SUM', 'AVERAGE', 'COUNT', 'MIN', 'MAX', 'IF', 'ABS', 'ROUND',
            'PRODUCT', 'CONCAT', 'CONCATENATE', 'COUNTA', 'COUNTBLANK',
            'COUNTIF', 'MEDIAN', 'SUMIF', 'RAN', 'RAND', 'RANDOM',
            'TODAY', 'NOW', 'MOD', 'POWER', 'SQRT'
        ]);
        if (this.formulaEngine.parent && this.formulaEngine.parent.formulaSettings
            && this.formulaEngine.parent.formulaSettings.allowBuiltInFunctions === false
            && builtInFunctions.has(functionName)) {
            throw new UnknownFunctionError(functionName);
        }
        switch (functionName) {
        case 'SUM': {
            let total: number = 0;
            for (const argument of node.args) {
                const value: FormulaResult = argument.accept(this) as FormulaResult;
                total += this.convertToNumber(value);
            }
            return total;
        }
        case 'AVERAGE': {
            let total: number = 0;
            let count: number = 0;
            for (const argument of node.args) {
                const values: FormulaValue[] = this.extractValues(argument.accept(this) as FormulaResult);
                for (const value of values) {
                    total += this.convertToNumber(value);
                    count++;
                }
            }
            return count > 0 ? total / count : 0;
        }
        case 'COUNT': {
            let count: number = 0;
            for (const argument of node.args) {
                const values: FormulaValue[] = this.extractValues(argument.accept(this) as FormulaResult);
                for (const value of values) {
                    if (this.tryParseNumber(value) !== undefined) {
                        count++;
                    }
                }
            }
            return count;
        }
        case 'MIN': {
            let minimumValue: number = Infinity;
            for (const argument of node.args) {
                const values: FormulaValue[] = this.extractValues(argument.accept(this) as FormulaResult);
                for (const value of values) {
                    minimumValue = Math.min(minimumValue, this.convertToNumber(value));
                }
            }
            return minimumValue === Infinity ? 0 : minimumValue;
        }
        case 'MAX': {
            let maximumValue: number = -Infinity;
            for (const argument of node.args) {
                const values: FormulaValue[] = this.extractValues(argument.accept(this) as FormulaResult);
                for (const value of values) {
                    maximumValue = Math.max(maximumValue, this.convertToNumber(value));
                }
            }
            return maximumValue === -Infinity ? 0 : maximumValue;
        }
        case 'IF': {
            if (node.args.length < 3) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'IF requires 3 arguments: condition, true_value, false_value');
            }
            const condition: boolean = this.convertToBoolean(node.args[0].accept(this) as FormulaResult);
            return condition ? node.args[1].accept(this) : node.args[2].accept(this);
        }
        case 'REF': {
            if (node.args.length < 2) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'REF requires 2 arguments: column reference and row number');
            }
            const columnReference: FormulaResult = node.args[0].accept(this) as FormulaResult;
            const rowNumber: FormulaResult = node.args[1].accept(this) as FormulaResult;
            if (typeof columnReference !== 'string') {
                throw new ReferenceError(`Cannot resolve REF(${columnReference}, ${rowNumber})`);
            }
            const rowIndex: number = typeof rowNumber === 'number' ? (rowNumber > 0 ? rowNumber - 1 : rowNumber) :
                this.convertToNumber(rowNumber) - 1;
            const rowData: Record<string, FormulaValue> = (this.context as EvaluationContext).getRowData(rowIndex);
            if (!rowData || !(columnReference in rowData) || rowData[columnReference as keyof typeof rowData] === undefined) {
                throw new ReferenceError(`Cannot resolve REF(${columnReference}, ${rowNumber})`);
            }
            const referenceText: string | undefined = (this.context as EvaluationContext).getFieldReference(columnReference, rowIndex);
            if (!referenceText) {
                throw new ReferenceError(`Cannot resolve REF(${columnReference}, ${rowNumber})`);
            }
            return {
                __isFormulaRefValue: true,
                ref: referenceText,
                value: (this.context as EvaluationContext).getCell(referenceText)
            };
        }
        case 'COLUMN': {
            if (node.args.length < 1 || node.args[0] instanceof LiteralNode === false) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'COLUMN requires a field name string argument');
            }
            return node.args[0].accept(this);
        }
        case 'ROW': {
            if (node.args.length < 1) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'ROW requires a row number argument');
            }
            return node.args[0].accept(this);
        }
        case 'ABS': {
            if (node.args.length < 1) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'ABS requires 1 argument');
            }
            return Math.abs(this.convertToNumber(node.args[0].accept(this)));
        }
        case 'ROUND': {
            if (node.args.length < 1) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'ROUND requires at least 1 argument: value[, decimals]');
            }
            const value: number = this.convertToNumber(node.args[0].accept(this) as FormulaResult);
            const decimals: number = node.args.length > 1 ? this.convertToNumber(node.args[1].accept(this) as FormulaResult) : 0;
            return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
        }
        case 'PRODUCT': {
            if (node.args.length === 0) {
                return 0;
            }
            let product: number = 1;
            for (const argument of node.args) {
                const values: FormulaValue[] = this.extractValues(argument.accept(this) as FormulaResult);
                for (const value of values) {
                    product *= this.convertToNumber(value);
                }
            }
            return product;
        }
        case 'CONCAT': {
            const parts: string[] = [];
            for (const arg of node.args) {
                this.appendConcatenatedValue(arg.accept(this), parts);
            }
            return parts.join('');
        }
        case 'COUNTA': {
            let count: number = 0;
            for (const arg of node.args) {
                const values: FormulaValue[] = this.extractValues(arg.accept(this));
                for (const value of values) {
                    if (value !== null && value !== undefined) {
                        count++;
                    }
                }
            }
            return count;
        }
        case 'COUNTBLANK': {
            let count: number = 0;
            for (const arg of node.args) {
                const values: FormulaValue[] = this.extractValues(arg.accept(this));
                for (const value of values) {
                    if (value === null || value === undefined || value === '') {
                        count++;
                    }
                }
            }
            return count;
        }
        case 'COUNTIF': {
            if (node.args.length < 2) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'COUNTIF requires 2 arguments: range, criteria');
            }
            const rangeValues: FormulaValue[] = this.extractValues(node.args[0].accept(this));
            const criteria: FormulaResult = node.args[1].accept(this);
            let count: number = 0;
            for (const value of rangeValues) {
                if (this.matchesCriteria(value, criteria)) {
                    count++;
                }
            }
            return count;
        }
        case 'MEDIAN': {
            const numericValues: number[] = [];
            for (const argument of node.args) {
                const values: FormulaValue[] = this.extractValues(argument.accept(this) as FormulaResult);
                for (const value of values) {
                    const numericValue: number | undefined = this.tryParseNumber(value);

                    if (numericValue !== undefined) {
                        numericValues.push(numericValue);
                    }
                }
            }
            if (numericValues.length === 0) {
                return 0;
            }
            numericValues.sort((leftValue: number, rightValue: number) => leftValue - rightValue);
            const middleIndex: number = Math.floor(numericValues.length / 2);
            return numericValues.length % 2 === 1 ? numericValues[parseInt(middleIndex.toString(), 10)] :
                (numericValues[parseInt(middleIndex.toString(), 10) - 1] + numericValues[parseInt(middleIndex.toString(), 10)]) / 2;
        }
        case 'SUMIF': {
            if (node.args.length < 2) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'SUMIF requires 2 or 3 arguments: range, criteria[, sum_range]');
            }
            const criteriaValues: FormulaValue[] = this.extractValues(node.args[0].accept(this));
            const criteria: FormulaResult = node.args[1].accept(this);
            const sumValues: FormulaValue[] = node.args.length > 2
                ? this.extractValues(node.args[2].accept(this)) : criteriaValues;
            let total: number = 0;
            for (let index: number = 0; index < criteriaValues.length; index++) {
                if (this.matchesCriteria(
                    // eslint-disable-next-line security/detect-object-injection
                    criteriaValues[index], criteria)) {
                    // eslint-disable-next-line security/detect-object-injection
                    const sumValue: FormulaValue = index < sumValues.length ? sumValues[index] : 0;
                    total += this.convertToNumber(sumValue);
                }
            }
            return total;
        }
        case 'RAND': {
            return Math.random();
        }
        case 'TODAY': {
            const currentDate: Date = new Date();
            return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        }
        case 'NOW': {
            return new Date();
        }
        case 'MOD': {
            if (node.args.length < 2) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'MOD requires 2 arguments: dividend, divisor');
            }
            const dividendValue: FormulaResult = node.args[0].accept(this) as FormulaResult;
            const divisorValue: FormulaResult = node.args[1].accept(this) as FormulaResult;
            const dividend: number = this.convertToNumber(
                Array.isArray(dividendValue) && dividendValue.length > 0 ? dividendValue[0] : dividendValue);
            const divisor: number = this.convertToNumber(
                Array.isArray(divisorValue) && divisorValue.length > 0 ? divisorValue[0] : divisorValue);
            if (divisor === 0) {
                throw new DivideByZeroError();
            }
            return dividend - divisor * Math.floor(dividend / divisor);
        }
        case 'POWER': {
            if (node.args.length < 2) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'POWER requires 2 arguments: base, exponent');
            }
            const baseValue: FormulaResult = node.args[0].accept(this) as FormulaResult;
            const exponentValue: FormulaResult = node.args[1].accept(this) as FormulaResult;
            const base: number = this.convertToNumber(Array.isArray(baseValue) && baseValue.length > 0 ? baseValue[0] : baseValue);
            const exponent: number = this.convertToNumber(Array.isArray(exponentValue) && exponentValue.length > 0 ?
                exponentValue[0] : exponentValue);
            return Math.pow(base, exponent);
        }
        case 'SQRT': {
            if (node.args.length < 1) {
                throw new FormulaError(FormulaErrorCode.ERROR, 'SQRT requires 1 argument');
            }
            const value: FormulaResult = node.args[0].accept(this) as FormulaResult;
            const numericValue: number = this.convertToNumber(Array.isArray(value) && value.length > 0 ? value[0] : value);
            if (numericValue < 0) {
                throw new FormulaError(FormulaErrorCode.VALUE, 'SQRT requires non-negative argument');
            }
            return Math.sqrt(numericValue);
        }
        default: {
            if (this.formulaEngine && this.formulaEngine.isCustomFunction(functionName)) {
                return this.executeCustomFunction(node, functionName);
            }
            throw new UnknownFunctionError(`Function not yet implemented: ${node.name}`);
        }
        }
    }

    private executeCustomFunction(node: FunctionCallNode, funcName: string): FormulaResult {
        if (!this.formulaEngine) {
            throw new FormulaError(FormulaErrorCode.ERROR, `Custom function engine not available for ${funcName}`);
        }
        const evaluatedArgs: FormulaResult[] = [];
        for (const arg of node.args) {
            evaluatedArgs.push(arg.accept(this));
        }
        const values: FormulaValue[] = [];
        for (const arg of evaluatedArgs) {
            if (this.isFormulaReferenceValue(arg)) {
                // Handle FormulaReferenceValue by extracting its value
                const refValue: FormulaResult = arg.value;
                if (Array.isArray(refValue)) {
                    values.push(...refValue);
                } else if (refValue !== null && refValue !== undefined) {
                    values.push(refValue as FormulaValue);
                }
            } else if (Array.isArray(arg)) {
                values.push(...arg);
            } else if (arg !== null && arg !== undefined) {
                values.push(arg as FormulaValue);
            }
        }
        const params: CustomFormulaArgs = { values, args: evaluatedArgs, context: this.context as EvaluationContext};
        const customFunc: CustomFunction = this.formulaEngine.getCustomFunction(funcName);
        if (!customFunc) {
            throw new UnknownFunctionError(`Custom function not found: ${funcName}`);
        }
        const eventArgs: CustomFormulaEventArgs = { name: funcName, params, result: undefined, error: undefined, requestType: 'customFunctions' };
        this.formulaEngine.parent.trigger('customFunctions', eventArgs, (args: CustomFormulaEventArgs): void => {
            if ((args as { cancel?: boolean }).cancel) {
                throw new FormulaError(FormulaErrorCode.ERROR, `Custom formula ${funcName} was cancelled by event handler`);
            }
        });
        if (typeof customFunc === 'function') {
            return customFunc(params);
        } else if (customFunc && typeof customFunc.func === 'function') {
            return customFunc.func(params);
        } else {
            throw new FormulaError(FormulaErrorCode.ERROR, `Custom function ${funcName} is not callable`);
        }
    }

    public isFormulaReferenceValue(value: FormulaResult | FormulaReferenceValue): value is FormulaReferenceValue {
        return typeof value === 'object' && value !== null && '__isFormulaRefValue' in value && value.__isFormulaRefValue === true;
    }

    private convertToNumber(value: FormulaResult | FormulaReferenceValue): number {
        if (this.isFormulaReferenceValue(value)) {
            return this.convertToNumber(value.value);
        }
        if (typeof value === 'number') { return value; }
        if (typeof value === 'boolean') { return value ? 1 : 0; }
        if (value === null || value === undefined) { return 0; }
        if (typeof value === 'string') {
            if (value === '') { return 0; }
            const numericValue: number = parseFloat(value);
            if (!isNaN(numericValue)) {
                return numericValue;
            }
            throw new TypeMismatchError(`Cannot convert string to number: "${value}"`);
        }

        if (Array.isArray(value)) {
            return value.reduce((total: number, item: FormulaValue) => total + (this.tryParseNumber(item) || 0), 0) as number;
        }
        throw new TypeMismatchError(`Cannot convert ${typeof value} to number`);
    }

    private convertToBoolean(value: FormulaResult | FormulaReferenceValue): boolean {
        if (this.isFormulaReferenceValue(value)) {
            return this.convertToBoolean(value.value);
        }
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'number') {
            return value !== 0;
        }
        if (typeof value === 'string') {
            return value.length > 0;
        }
        if (value === null || value === undefined) {
            return false;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return !!value;
    }

    private extractValues(value: FormulaResult | FormulaReferenceValue): FormulaValue[] {
        if (this.isFormulaReferenceValue(value)) {
            return this.extractValues(value.value);
        }
        if (value === null || value === undefined) {
            return [value as FormulaValue];
        }
        if (Array.isArray(value)) {
            return value.reduce((result: FormulaValue[], item: FormulaValue) => result.concat(this.extractValues(item)), []);
        }
        return [value as FormulaValue];
    }

    private appendConcatenatedValue(value: FormulaResult | FormulaReferenceValue, parts: string[]): void {
        if (this.isFormulaReferenceValue(value)) {
            this.appendConcatenatedValue(value.value, parts);
            return;
        }
        if (Array.isArray(value)) {
            for (const item of value) {
                this.appendConcatenatedValue(item, parts);
            }
            return;
        }
        if (value === null || value === undefined) {
            return;
        }
        parts.push(String(value));
    }

    private matchesCriteria(value: FormulaResult | FormulaReferenceValue, criteria: FormulaResult | FormulaReferenceValue): boolean {
        const actualValue: FormulaResult = this.isFormulaReferenceValue(value) ? value.value : value;
        const actualCriteria: FormulaResult = this.isFormulaReferenceValue(criteria) ? criteria.value : criteria;
        if (actualCriteria === null || actualCriteria === undefined) {
            return actualValue === null || actualValue === undefined || actualValue === '';
        }
        if (typeof actualCriteria === 'string') {
            const trimmed: string = actualCriteria.trim();
            const operatorMatch: RegExpMatchArray | null = trimmed.match(/^(>=|<=|<>|=|>|<)(.*)$/);
            if (operatorMatch) {
                const operator: string = operatorMatch[1];
                const operand: string = operatorMatch[2].trim();
                const numericOperand: number = parseFloat(operand);
                const leftNumber: number | undefined = this.tryParseNumber(actualValue);
                switch (operator) {
                case '=':
                    return String(actualValue) === operand || (leftNumber !== undefined && leftNumber === numericOperand);
                case '<>':
                    return String(actualValue) !== operand && (leftNumber === undefined || leftNumber !== numericOperand);
                case '>':
                    return leftNumber !== undefined && leftNumber > numericOperand;
                case '<':
                    return leftNumber !== undefined && leftNumber < numericOperand;
                case '>=':
                    return leftNumber !== undefined && leftNumber >= numericOperand;
                case '<=':
                    return leftNumber !== undefined && leftNumber <= numericOperand;
                }
            }
            return String(actualValue) === trimmed;
        }
        if (typeof actualCriteria === 'number' || typeof actualCriteria === 'boolean') {
            if (typeof actualValue === 'number' || typeof actualValue === 'boolean') {
                return actualValue === actualCriteria;
            }
            const converted: number | undefined = this.tryParseNumber(actualValue);
            return converted !== undefined && converted === this.convertToNumber(actualCriteria);
        }
        return String(actualValue) === String(actualCriteria);
    }

    private tryParseNumber(value: FormulaResult | FormulaReferenceValue): number | undefined {
        if (this.isFormulaReferenceValue(value)) {
            return this.tryParseNumber(value.value);
        }
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        if (value === null || value === undefined || value === '') {
            return undefined;
        }
        if (typeof value === 'string') {
            const number: number = parseFloat(value);
            return !isNaN(number) ? number : undefined;
        }
        if (Array.isArray(value) && value.length > 0) {
            return this.tryParseNumber(value[0]);
        }
        return undefined;
    }

    private convertToReference(value: FormulaResult | FormulaReferenceValue): string {
        if (this.isFormulaReferenceValue(value)) {
            return value.ref;
        }
        if (typeof value === 'string') {
            const reference: string = value.trim().toUpperCase();
            if (/^\$?[A-Z]+\$?\d+$/.test(reference)) {
                return reference;
            }
        }
        throw new ReferenceError(`Cannot convert value to cell reference: ${value}`);
    }
}

/** Coordinator for formula parsing, evaluation, and dependency tracking */
export class Formula implements IAction {
    public parser: Parser = new Parser();
    public evaluator: Evaluator = new Evaluator();
    public dependencyGraph: DependencyGraph = new DependencyGraph();
    public formulaCache: Map<string, CacheEntry> = new Map<string, CacheEntry>();
    public parent: IGrid;
    public customFunctions: Map<string, CustomFunction> = new Map();
    public primaryKeyValue: string | number;

    constructor(grid: IGrid) {
        this.parent = grid;
        this.initializeCustomFunctions();
        this.addEventListener();
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.destroy, this.destroy, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.destroy, this.destroy);
    }

    /**
     * Initializes custom formula functions from the component settings.
     *
     * @returns {void}
     */
    private initializeCustomFunctions(): void {
        if (this.parent && this.parent.formulaSettings && this.parent.formulaSettings.customFunctions) {
            const customFormulas: Record<string, CustomFunction> = this.parent.formulaSettings.customFunctions;
            for (const name of Object.keys(customFormulas) as string[]) {
                // eslint-disable-next-line security/detect-object-injection
                const func: CustomFunction = customFormulas[name];
                this.registerCustomFunction(name.toUpperCase(), func);
            }
        }
    }

    public registerCustomFunction(name: string, func: CustomFunction): void {
        if (typeof func === 'function' || (func && typeof func === 'object')) {
            this.customFunctions.set(name.toUpperCase(), func);
        }
    }

    public getCustomFunction(name: string): CustomFunction {
        return this.customFunctions.get(name.toUpperCase());
    }

    public isCustomFunction(name: string): boolean {
        return this.customFunctions.has(name.toUpperCase());
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    public getModuleName(): string {
        return 'formula';
    }

    /**
     * Sets a formula for a cell.
     *
     * @param {number | string} primaryKeyValue - The row index or primary key of the record.
     * @param {string} field - The field name for which the formula is being set.
     * @param {string | undefined} formula - The formula to store, or undefined to clear the formula.
     * @returns {void}
     */
    public setCellFormula(primaryKeyValue: number | string, field: string, formula: string | undefined): void {
        const key: string = this.getCacheKey(primaryKeyValue, field);
        if (formula === undefined || formula.trim() === '') {
            this.formulaCache.delete(key);
            return;
        }
        this.primaryKeyValue = primaryKeyValue;
        const trimmedFormula: string = formula.trim();
        try {
            if (!trimmedFormula.startsWith('=')) {
                if (!/[+\-*/%():\w]/.test(trimmedFormula)) {
                    throw new ParseError('Formula must start with "=" or contain valid formula syntax');
                }
            }
            const ast: ASTNode = this.parser.parse(trimmedFormula.replace(/\$/g, ''));
            const refs: string[] = this.extractReferences(ast);
            if (refs.length > 0) {
                for (const ref of refs) {
                    this.dependencyGraph.addDependency(key, ref);
                }
                const cycles: Set<string> = this.dependencyGraph.detectCycles();
                if (cycles.has(key)) {
                    for (const ref of refs) {
                        this.dependencyGraph.removeDependency(key, ref);
                    }
                }
            }
            const context: EvaluationContext = this.createContext();
            if (!context) {
                throw new FormulaError(FormulaErrorCode.ERROR, `Cannot create evaluation context for ${key}`);
            }
            this.evaluator.setFormulaEngine(this);
            let value: FormulaResult | FormulaReferenceValue = this.evaluator.evaluate(ast, context);
            if (value && this.evaluator.isFormulaReferenceValue(value)) {
                value = value.value;
            } else if (Array.isArray(value)) {
                throw new FormulaError(FormulaErrorCode.ERROR, `Cannot create evaluation context for ${key}`);
            }
            const finalValue: FormulaValue = value as FormulaValue;
            this.formulaCache.set(key, { ast, value: finalValue, error: undefined, formula: trimmedFormula });

        } catch (error) {
            let formulaError: FormulaError;
            if (error instanceof FormulaError) {
                formulaError = error;
            } else {
                formulaError = new FormulaError(FormulaErrorCode.PARSE, `Failed to process formula: ${
                    error instanceof Error ? error.message : String(error)}`);
            }

            this.formulaCache.set(key, { ast: undefined, value: formulaError, error: formulaError, formula: trimmedFormula });
        }
    }

    /**
     * Gets a stored formula.
     *
     * @param {number | string} primaryKeyValue - The row index or primary key of the record.
     * @param {string} field - The field name containing the formula.
     * @returns {string | undefined} The stored formula, or undefined if no formula exists.
     */
    public getCellFormula(primaryKeyValue: number | string, field: string): string | undefined {
        const key: string = this.getCacheKey(primaryKeyValue, field);
        const cached: CacheEntry | undefined = this.formulaCache.get(key);
        if (cached) {
            if (cached.formula) {
                return cached.formula;
            }
        }
        return undefined;
    }

    /**
     * Gets the evaluated value of a formula.
     *
     * @param {number | string} primaryKeyValue - The row index or primary key of the record.
     * @param {string} field - The field name containing the formula.
     * @returns {FormulaValue | undefined} The evaluated formula value, or undefined if no value is available.
     */
    public getFormulaValue(primaryKeyValue: number | string, field: string): FormulaValue | undefined {
        const key: string = this.getCacheKey(primaryKeyValue, field);
        const cached: CacheEntry | undefined = this.formulaCache.get(key);
        return cached ? cached.value : undefined;
    }

    /**
     * Extracts all cell references from an abstract syntax tree (AST).
     * For ranges, extracts all cells within the range to track dependencies.
     *
     * @param {ASTNode} astNode - The AST node from which to extract cell references.
     * @returns {string[]} A collection of extracted cell references.
     */
    private extractReferences(astNode: ASTNode): string[] {
        const cellReferences: string[] = [];
        const processedReferences: Set<string> = new Set<string>();
        const visitor: ASTVisitor = {
            visitLiteral: (): FormulaResult => undefined,
            visitCellRef: (cellReferenceNode: CellRefNode): FormulaResult => {
                if (!processedReferences.has(cellReferenceNode.ref)) {
                    cellReferences.push(cellReferenceNode.ref);
                    processedReferences.add(cellReferenceNode.ref);
                }
                return undefined;
            },
            visitRangeRef: (rangeReferenceNode: RangeRefNode): FormulaResult => {
                let startCellReference: string | undefined;
                let endCellReference: string | undefined;
                if (rangeReferenceNode.start instanceof CellRefNode) {
                    startCellReference = rangeReferenceNode.start.ref;
                } else {
                    const startCellReferences: string[] = this.extractReferences(rangeReferenceNode.start);
                    startCellReference = startCellReferences.length > 0 ? startCellReferences[0] : undefined;
                }
                if (rangeReferenceNode.end instanceof CellRefNode) {
                    endCellReference = rangeReferenceNode.end.ref;
                } else {
                    const endCellReferences: string[] = this.extractReferences(rangeReferenceNode.end);
                    endCellReference = endCellReferences.length > 0 ? endCellReferences[0] : undefined;
                }
                if (!startCellReference || !endCellReference) {
                    rangeReferenceNode.start.accept(visitor);
                    rangeReferenceNode.end.accept(visitor);
                    return undefined;
                }
                const startReferenceInfo: ParsedReference = ReferenceConverter.parseReference(startCellReference);
                const endReferenceInfo: ParsedReference = ReferenceConverter.parseReference(endCellReference);
                for (let rowIndex: number = startReferenceInfo.row; rowIndex <= endReferenceInfo.row; rowIndex++) {
                    for (let columnIndex: number = startReferenceInfo.col; columnIndex <= endReferenceInfo.col; columnIndex++) {
                        const currentCellReference: string = ReferenceConverter.convertIndexToReference(columnIndex, rowIndex);
                        if (!processedReferences.has(currentCellReference)) {
                            cellReferences.push(currentCellReference);
                            processedReferences.add(currentCellReference);
                        }
                    }
                }
                return undefined;
            },
            visitBinaryOp: (binaryOperationNode: BinaryOpNode): FormulaResult => {
                binaryOperationNode.left.accept(visitor);
                binaryOperationNode.right.accept(visitor);
                return undefined;
            },
            visitUnaryOperator: (unaryOperatorNode: UnaryOpNode): FormulaResult => {
                unaryOperatorNode.operand.accept(visitor);
                return undefined;
            },
            visitFunctionCall: (functionCallNode: FunctionCallNode): FormulaResult => {
                functionCallNode.args.forEach((argumentNode: ASTNode) => argumentNode.accept(visitor));
                return undefined;
            }
        };

        astNode.accept(visitor);
        return cellReferences;
    }

    /**
     * Resolve a cell value from the grid.
     *
     * @param {string} cellReference - The cell reference to resolve.
     * @returns {FormulaValue | undefined} The resolved cell value, or undefined if not found.
     */
    private resolveCellValue(cellReference: string): FormulaValue | undefined {
        if (!cellReference || typeof cellReference !== 'string') {
            return undefined;
        }
        const parsedReference: ParsedReference = ReferenceConverter.parseReference(cellReference);
        const dataSource: Object[] = this.parent.getDataModule().dataManager.executeLocal(new Query());
        const targetRowData: Record<string, FormulaValue> = dataSource[parsedReference.row] as Record<string, FormulaValue>;
        if (!targetRowData) {
            return undefined;
        }
        const validColumns: Column[] = this.parent.getColumns().filter(
            (column: Column) => column && column.field !== undefined && column.field !== null);
        if (parsedReference.col < 0 || parsedReference.col >= validColumns.length) {
            return undefined;
        }
        const fieldName: string = validColumns[parsedReference.col].field as string;
        // eslint-disable-next-line security/detect-object-injection
        const cellValue: FormulaValue = targetRowData[fieldName];
        if (typeof cellValue === 'string' &&  cellValue.trim().startsWith('=') && this.parent.formulaModule ) {
            const rowIdentifier: string | number = this.getRowId(targetRowData, parsedReference.row);
            const evaluatedFormulaValue: FormulaValue | undefined = this.getFormulaValue(rowIdentifier, fieldName);
            if (evaluatedFormulaValue !== undefined) {
                return evaluatedFormulaValue;
            }
        }
        return cellValue;
    }

    private getRowId(rowData: Record<string, FormulaValue>, rowIndex: number): number | string {
        const primaryKeyFields: string[] = this.parent.getPrimaryKeyFieldNames ? this.parent.getPrimaryKeyFieldNames() : [];
        if (primaryKeyFields.length > 0) {
            const primaryKey: string = primaryKeyFields[0];
            if (!isNullOrUndefined(rowData[`${primaryKey}`])) {
                return rowData[`${primaryKey}`] as string | number;
            }
        }
        return rowIndex;
    }

    /**
     * Resolves a range of values from the grid. Handles ranges such as A1:A5 and B2:D10.
     *
     * @param {string} startReference - The starting cell reference of the range.
     * @param {string} endReference - The ending cell reference of the range.
     * @returns {FormulaValue[]} The values contained within the specified range.
     */
    private resolveRangeValues(startReference: string, endReference: string): FormulaValue[] {
        const startCellReference: ParsedReference = ReferenceConverter.parseReference(startReference);
        const endCellReference: ParsedReference = ReferenceConverter.parseReference(endReference);
        const rangeValues: FormulaValue[] = [];
        if (startCellReference.row > endCellReference.row || startCellReference.col > endCellReference.col) {
            const originalColumnIndex: number = startCellReference.col;
            const originalRowIndex: number = startCellReference.row;
            startCellReference.col = Math.min(startCellReference.col, endCellReference.col);
            startCellReference.row = Math.min(startCellReference.row, endCellReference.row);
            endCellReference.col = Math.max(originalColumnIndex, endCellReference.col);
            endCellReference.row = Math.max(originalRowIndex, endCellReference.row);
        }
        for (let rowIndex: number = startCellReference.row; rowIndex <= endCellReference.row; rowIndex++) {
            for (let columnIndex: number = startCellReference.col; columnIndex <= endCellReference.col; columnIndex++) {
                const currentCellReference: string = ReferenceConverter.convertIndexToReference(columnIndex, rowIndex);
                const currentCellValue: FormulaValue | undefined = this.resolveCellValue(currentCellReference);
                rangeValues.push(currentCellValue);
            }
        }
        return rangeValues;
    }

    /**
     * Creates an evaluation context for formula processing.
     *
     * @returns {EvaluationContext} A new evaluation context.
     */
    private createContext(): EvaluationContext {
        return {
            getCell: (cellReference: string) => this.resolveCellValue(cellReference),

            getRange: (startReference: string, endReference: string) =>
                this.resolveRangeValues(startReference, endReference),

            getRowData: (rowIndex?: number): Record<string, FormulaValue> => {
                const dataSource: Object[] = this.parent.getDataModule().dataManager.executeLocal(new Query());
                return dataSource[parseInt(rowIndex.toString(), 10)] as Record<string, FormulaValue>;
            },

            getFieldReference: (fieldName: string, rowIndex: number) => {
                const dataColumns: Column[] = this.parent.getColumns().filter( (column: Column) =>
                    column && column.field !== undefined && column.field !== null);
                const columnIndex: number = dataColumns.findIndex((column: Column) => column.field === fieldName);
                return ReferenceConverter.convertIndexToReference(columnIndex, rowIndex);
            }
        };
    }

    private getCacheKey(rowIndex: number | string, field: string): string {
        return `${rowIndex}:${field}`;
    }

    /**
     * Gets all formulas defined in the grid.
     *
     * @returns {FormulaDefinitionModel[]} Array of formula definitions with their values.
     */
    public getFormulas(): FormulaDefinitionModel[] {
        const formulas: FormulaDefinitionModel[] = [];
        this.formulaCache.forEach((cacheEntry: CacheEntry, cacheKey: string) => {
            if (cacheEntry && cacheEntry.formula) {
                const parts: string[] = cacheKey.split(':');
                if (parts.length === 2) {
                    const rowIndexPart: string = parts[0];
                    const field: string = parts[1];
                    const rowIndex: number | string = isNaN(Number(rowIndexPart)) ? rowIndexPart : Number(rowIndexPart);
                    formulas.push({ rowIndex, field, formula: cacheEntry.formula,
                        value: cacheEntry.value instanceof FormulaError ? undefined : cacheEntry.value
                    });
                }
            }
        });
        return formulas;
    }

    /**
     * Checks if a formula exists for the specified cell.
     *
     * @param {number} primaryKeyValue - The row index of the cell.
     * @param {string} field - The field name of the cell.
     * @returns {boolean} True if a formula exists for the cell, otherwise false.
     */
    public hasFormula(primaryKeyValue: number, field: string): boolean {
        const key: string = this.getCacheKey(primaryKeyValue, field);
        const cached: CacheEntry | undefined = this.formulaCache.get(key);
        return cached !== undefined && cached.formula !== undefined && cached.formula.trim().length > 0;
    }

    /**
     * Adds a custom formula function.
     *
     * @param {string} name - The name of the custom formula function.
     * @param {Function} handler - The handler function for the custom formula.
     * @returns {void}
     */
    public addFormula(name: string, handler: Function): void {
        const normalizedName: string = name.toUpperCase();
        this.registerCustomFunction(normalizedName, handler as CustomFunction);
    }

    /**
     * Removes a custom formula function.
     *
     * @param {string} name - The name of the custom formula function to remove.
     * @returns {void}
     */
    public removeFormula(name: string): void {
        const normalizedName: string = name.toUpperCase();
        this.customFunctions.delete(normalizedName);
    }

    /**
     * Destroys the formula module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        this.formulaCache.clear();
        this.customFunctions.clear();
        this.dependencyGraph.clear();
        this.parser = null;
        this.evaluator = null;
    }
}
