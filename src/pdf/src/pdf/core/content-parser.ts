import { _TokenType } from './enumerator';
/**
 * Parses PDF content streams into record tokens for internal consumption.
 *
 * @private
 */
export class _ContentParser {
    /**
     * Lexer instance used to tokenize the content stream.
     *
     * @private
     */
    _lexer: _ContentLexer;
    /**
     * Collected `_PdfRecord` instances parsed from the stream.
     *
     * @private
     */
    _recordCollection: _PdfRecord[] = [];
    /**
     * Operands collected for the current operator.
     *
     * @private
     */
    _operands: string[] = [];
    /**
     * Byte buffer for inline image data while parsing.
     *
     * @private
     */
    _inlineImageBytes: number[] = [];
    /**
     * True when the current operand represents raw inline image bytes.
     *
     * @private
     */
    _isByteOperand: boolean = false;
    constructor(contentStream: number[])
    constructor(contentStream: Uint8Array)
    constructor(contentStream: Uint8Array | number[]) {
        this._lexer = new _ContentLexer(contentStream);
    }
    /**
     * Read and parse the entire content stream into records.
     *
     * @private
     * @returns {_PdfRecord[]} Array of parsed `_PdfRecord` objects.
     */
    _readContent(): _PdfRecord[] {
        this._parseObject(_TokenType.eof);
        return this._recordCollection;
    }
    /**
     * Parse objects until encountering the specified token type.
     *
     * @private
     * @param {_TokenType} tokenType - Token type that terminates parsing.
     * @returns {void} nothing.
     */
    _parseObject(tokenType: _TokenType): void {
        let symbol: _TokenType;
        while ((symbol = this._getNextToken()) !== _TokenType.eof) {// eslint-disable-line
            if (symbol === tokenType || symbol === _TokenType.none) {
                return;
            }
            switch (symbol) {
            case _TokenType.comment:
                break;
            case _TokenType.number:
                if (this._lexer._operatorParams === '-') {
                    this._operands.push('0');
                } else {
                    this._operands.push(this._lexer._operatorParams);
                }
                break;
            case _TokenType.real:
                this._operands.push(this._lexer._operatorParams);
                break;
            case _TokenType.string:
            case _TokenType.hexString:
            case _TokenType.unicodeHexString:
            case _TokenType.unicodeString:
                this._operands.push(this._lexer._operatorParams);
                break;
            case _TokenType.name:
                this._operands.push(this._lexer._operatorParams);
                break;
            case _TokenType.operator:
                if (this._lexer._operatorParams === 'ID') {
                    this._createRecord();
                    this._operands = [];
                    this._consumeValue();
                    break;
                } else {
                    this._createRecord();
                    this._operands = [];
                }
                break;
            case _TokenType.beginArray:
                break;
            case _TokenType.endArray:
                throw new Error('Error while parsing content');
            }
        }
    }
    /**
     * Consume and process inline image or operand values from the lexer.
     *
     * @private
     * @returns {void} nothing.
     */
    _consumeValue(): void {
        let currentChar: string;
        let nextChar: string;
        let secondNextChar: string;
        let thirdChar: string;
        while (true) { // eslint-disable-line
            let contentCount: number = 0;
            currentChar = this._lexer._getNextCharForInlineStream();
            if (currentChar === 'E' || currentChar === String.fromCharCode(65535)) {
                nextChar = this._lexer._getNextInlineChar();
                if (nextChar === 'I' || (nextChar === String.fromCharCode(65535) && currentChar === String.fromCharCode(65535))) {
                    secondNextChar = this._lexer._nextCharacter;
                    thirdChar = this._lexer._nextCharacter;
                    while (thirdChar === ' ' || thirdChar === '\r' || thirdChar === '\n') {
                        thirdChar = this._lexer._getNextChar();
                        contentCount++;
                    }
                    this._lexer._resetContentPointer(contentCount);
                    if (secondNextChar === ' ' || secondNextChar === '\n' || secondNextChar === String.fromCharCode(65535) || secondNextChar === '\r') {
                        if (thirdChar === 'Q' || thirdChar === String.fromCharCode(65535) || thirdChar === 'S' || (thirdChar >= '0' && thirdChar <= '9')) {
                            this._lexer._operatorParams = '';
                            this._lexer._operatorParams += currentChar;
                            this._lexer._operatorParams += nextChar;
                            this._isByteOperand = true;
                            this._createRecord();
                            this._isByteOperand = false;
                            this._inlineImageBytes = [];
                            nextChar = this._lexer._getNextInlineChar();
                            break;
                        }
                    }  else {
                        this._inlineImageBytes.push(currentChar.charCodeAt(0) & 0xFF);
                        this._inlineImageBytes.push(nextChar.charCodeAt(0) & 0xFF);
                        this._inlineImageBytes.push(secondNextChar.charCodeAt(0) & 0xFF);
                        this._inlineImageBytes.push(thirdChar.charCodeAt(0) & 0xFF);
                        currentChar = this._lexer._getNextCharForInlineStream();
                    }
                } else {
                    this._inlineImageBytes.push(currentChar.charCodeAt(0) & 0xFF);
                    this._inlineImageBytes.push(nextChar.charCodeAt(0) & 0xFF);
                }
            } else {
                this._inlineImageBytes.push(currentChar.charCodeAt(0) & 0xFF);
            }
        }
    }
    /**
     * Create a `_PdfRecord` from the current operator and operands and store it.
     *
     * @private
     * @returns {void} nothing.
     */
    _createRecord(): void {
        const operand: string = this._lexer._operatorParams;
        let record: _PdfRecord;
        if (this._isByteOperand) {
            record = new _PdfRecord(operand, new Uint8Array(this._inlineImageBytes));
        } else {
            record = new _PdfRecord(operand, this._operands);
        }
        record._splitText = this._lexer._text;
        this._recordCollection.push(record);
    }
    /**
     * Delegate to the lexer to retrieve the next token type.
     *
     * @private
     * @returns {_TokenType} The next `_TokenType` from the lexer.
     */
    _getNextToken(): _TokenType {
        return this._lexer._getNextToken();
    }
}
/**
 * Lexer/tokenizer for PDF content streams; intended for internal use.
 *
 * @private
 */
export class _ContentLexer {
    /**
     * Raw input data for the lexer.
     *
     * @private
     */
    _data: Uint8Array;
    /**
     * Current token type determined by the lexer.
     *
     * @private
     */
    _tokenType: _TokenType = _TokenType.none;
    /**
     * Accumulated operator parameter string for the current token.
     *
     * @private
     */
    _operatorParams: string;
    /**
     * Current character under consideration.
     *
     * @private
     */
    _currentCharacter: string = '\0';
    /**
     * Next character lookahead used by the lexer.
     *
     * @private
     */
    _nextCharacter: string = '\0';
    /**
     * Current byte offset into `_data`.
     *
     * @private
     */
    _offset: number = 0;
    /**
     * Text fragments collected while parsing literal strings.
     *
     * @private
     */
    _text: string[] = [];
    constructor(data: Uint8Array | number[]) {
        this._data = data instanceof Uint8Array ? data : new Uint8Array(data);
    }
    /**
     * Delegate to the lexer to retrieve the next token type.
     *
     * @private
     * @returns {_TokenType} The next `_TokenType` from the lexer.
     */
    _getNextToken(): _TokenType {
        this._operatorParams = '';
        const value: string = this._moveToNextChar();
        switch (value) {
        case '%':
            return this._tokenType = this._getComment();
        case '/':
            return this._tokenType = this._getName();
        case '[':
        case '(':
            return this._tokenType = this._getLiteralString();
        case '+':
        case '-':
            return this._tokenType = this._getNumber();
        case '<':
            return this._tokenType = this._getEncodedDecimalString();
        case '.':
            return this._tokenType = this._getNumber();
        case '"':
        case '\'':
            return this._tokenType = this._getOperator();
        }
        if (!isNaN(parseInt(value, 10))) {
            return this._tokenType = this._getNumber();
        }
        if ((/[a-zA-Z]/).test(value)) {
            return this._tokenType = this._getOperator();
        }
        if (value === String.fromCharCode(65535)) {
            return this._tokenType = _TokenType.eof;
        }
        return this._tokenType = _TokenType.none;
    }
    /**
     * Read and discard a comment token.
     *
     * @private
     * @returns {_TokenType} `_TokenType.comment`.
     */
    _getComment(): _TokenType {
        this._operatorParams = '';
        let value: string;
        let flag: boolean = (value = this._consumeValue()) !== '\x0A' && value !== String.fromCharCode(65535);
        while (flag) {
            flag = (value = this._consumeValue()) !== '\x0A' && value !== String.fromCharCode(65535);
        }
        return _TokenType.comment;
    }
    /**
     * Parse a name token starting with '/'.
     *
     * @private
     * @returns {_TokenType} `_TokenType.name` when a name is parsed.
     */
    _getName(): _TokenType {
        this._operatorParams = '';
        let flag: boolean = false;
        while (!flag) {
            const value: string = this._consumeValue();
            switch (value) {
            case '\0':
            case '\t':
            case '\x0A':
            case '\f':
            case '\x0D':
            case '\b':
            case ' ':
            case '%':
            case '(':
            case ')':
            case '<':
            case '>':
            case '[':
            case ']':
            case '/':
                flag = true;
                return _TokenType.name;
            default:
                break;
            }
        }
        return _TokenType.none;
    }
    /**
     * Parse a numeric token (integer or real).
     *
     * @private
     * @returns {_TokenType} `_TokenType.number`.
     */
    _getNumber(): _TokenType {
        let value: string = this._currentCharacter;
        if (value === '+' || value === '-') {
            this._operatorParams += this._currentCharacter;
            value = this._getNextChar();
        }
        while (!isNaN(parseInt(value, 10)) || value === '.') {
            if (!isNaN(parseInt(value, 10))) {
                this._operatorParams += this._currentCharacter;
            } else if (value === '.') {
                if (this._operatorParams.includes('.')) {
                    break;
                } else {
                    this._operatorParams += this._currentCharacter;
                }
            }
            value = this._getNextChar();
        }
        return _TokenType.number;
    }
    /**
     * Parse an operator token composed of alphabetic/operator characters.
     *
     * @private
     * @returns {_TokenType} `_TokenType.operator`.
     */
    _getOperator(): _TokenType {
        this._operatorParams = '';
        let value: string = this._currentCharacter;
        while (this._isOperator(value)) {
            value = this._consumeValue();
        }
        return _TokenType.operator;
    }
    /**
     * Determine whether the provided character is part of an operator token.
     *
     * @private
     * @param {string} value - Single-character string to test.
     * @returns {boolean} `true` when the character contributes to an operator.
     */
    _isOperator(value: string): boolean {
        if ((/[a-zA-Z]/).test(value)) {
            return true;
        }
        switch (value) {
        case '*':
        case '\'':
        case '\"':// eslint-disable-line
        case '1':
        case '0':
            return true;
        }
        return false;
    }
    /**
     * Parse a literal or array string token starting with '(' or '['.
     *
     * @private
     * @returns {_TokenType} `_TokenType.string` when parsing completes.
     */
    _getLiteralString(): _TokenType {
        this._operatorParams = '';
        const beginChar: string = this._currentCharacter;
        let literal: string;
        let value: string = this._consumeValue();
        let flag: boolean = true;
        let index: number = 0;
        let char: string = '';
        this._text = [];
        while (flag) {
            if (beginChar === '(') {
                literal = this._getLiteralStringValue(value);
                this._operatorParams += literal;
                value = this._getNextChar();
                flag = false;
                break;
            } else {
                if (value === '(') {
                    if (char !== '') {
                        this._text[<number>index] = char.slice(0, -1);
                        char = '';
                        index++;
                    }
                    value = this._consumeValue();
                    literal = this._getLiteralStringValue(value);
                    this._text[<number>index] = '(' + literal;
                    index++;
                    this._operatorParams += literal;
                    value = this._getNextChar();
                    char += value;
                    continue;
                } else if (value === ']') {
                    flag = false;
                    value = this._consumeValue();
                    break;
                } else if (value === '>') {
                    this._text[<number>index] = '<' + char;
                    index++;
                    char = '';
                } else if (value === '<') {
                    if (char !== '' ) {
                        this._text[<number>index] = char.slice(0, -1);
                        index++;
                    }
                    char = '';
                }
                value = this._consumeValue();
                char += value;
            }
        }
        return _TokenType.string;
    }
    /**
     * Parse an encoded hexadecimal string delimited by '<' and '>'.
     *
     * @private
     * @returns {_TokenType} `_TokenType.hexString`.
     */
    _getEncodedDecimalString(): _TokenType {
        const startChar: string = '<';
        const endChar: string = '>';
        const space: string = ' ';
        let parentLevel: number = 0;
        let value: string = this._consumeValue();
        let flag: boolean = true;
        while (flag) {
            if (value === startChar) {
                parentLevel++;
                value = this._consumeValue();
            } else if (value === endChar) {
                if (parentLevel === 0) {
                    this._consumeValue();
                    flag = false;
                    break;
                } else if (parentLevel === 1) {
                    value = this._consumeValue();
                    if (value === '>') {
                        parentLevel--;
                    }
                    if (parentLevel === 1 && value === space) {
                        flag = false;
                        break;
                    }
                } else {
                    if (value === '>') {
                        parentLevel--;
                    }
                    value = this._consumeValue();
                }
            } else {
                value = this._consumeValue();
                if (value === String.fromCharCode(65535)) {
                    flag = false;
                    break;
                }
            }
        }
        return _TokenType.hexString;
    }
    /**
     * Read the contents of a literal string handling escapes and nested parentheses.
     *
     * @private
     * @param {string} value - Initial character to start parsing from.
     * @returns {string} The parsed literal string including delimiters.
     */
    _getLiteralStringValue(value: string): string {
        let parenthesesCount: number = 0;
        let literal: string = '';
        let flag: boolean = true;
        while (flag) {
            if (value === '\\') {
                literal += value;
                value = this._getNextChar();
                literal += value;
                value = this._getNextChar();
                continue;
            }
            if (value === '(') {
                parenthesesCount++;
                literal += value;
                value = this._getNextChar();
                continue;
            }
            if (value === ')' && parenthesesCount !== 0) {
                literal += value;
                value = this._getNextChar();
                parenthesesCount--;
                continue;
            }
            if (value === ')' && parenthesesCount === 0) {
                literal += value;
                flag = false;
                return literal;
            }
            literal += value;
            value = this._getNextChar();
        }
        return literal;
    }
    /**
     * Consume the current character into `_operatorParams` and advance.
     *
     * @private
     * @returns {string} The next character after consuming.
     */
    _consumeValue(): string {
        this._operatorParams += this._currentCharacter;
        return this._getNextChar();
    }
    /**
     * Skip whitespace and return the next non-whitespace character.
     *
     * @private
     * @returns {string} The next non-whitespace character.
     */
    _moveToNextChar(): string {
        while (this._currentCharacter !== String.fromCharCode(65535)) {
            switch (this._currentCharacter) {
            case '\0':
            case '\t':
            case '\x0A':
            case '\f':
            case '\x0D':
            case '\b':
            case ' ':
                this._getNextChar();
                break;
            default:
                return this._currentCharacter;
            }
        }
        return this._currentCharacter;
    }
    /**
     * Reset the current offset backwards by `count` bytes.
     *
     * @private
     * @param {number} count - Number of bytes to rewind the offset by.
     * @returns {void} nothing.
     */
    _resetContentPointer(count: number): void {
        this._offset = this._offset - count;
    }
    /**
     * Get the next character when parsing inline image data, with special handling.
     *
     * @private
     * @returns {string} The next character as a string.
     */
    _getNextInlineChar(): string {
        if (this._data.length <= this._offset) {
            this._currentCharacter = String.fromCharCode(65535);
            this._nextCharacter = String.fromCharCode(65535);
        } else {
            this._currentCharacter = this._nextCharacter;
            this._nextCharacter = String.fromCharCode(this._data[this._offset++]);
            if (this._currentCharacter === '\x0D') {
                if (this._nextCharacter === '\x0A') {
                    this._currentCharacter = '\x0D';
                } else {
                    this._currentCharacter = '\x0A';
                }
            }
        }
        return this._currentCharacter;
    }
    /**
     * Get the next character specifically for inline stream parsing.
     *
     * @private
     * @returns {string} The next character as a string.
     */
    _getNextCharForInlineStream(): string {
        if (this._data.length <= this._offset) {
            this._currentCharacter = String.fromCharCode(65535);
            this._nextCharacter = String.fromCharCode(65535);
        } else {
            this._currentCharacter = this._nextCharacter;
            this._nextCharacter = String.fromCharCode(this._data[this._offset++]);
            if (this._currentCharacter === '\x0D') {
                if (this._nextCharacter === '\x0A') {
                    if (this._data.length <= this._offset) {
                        this._currentCharacter = this._nextCharacter;
                        this._nextCharacter = String.fromCharCode(65535);
                    }
                }
            }
        }
        return this._currentCharacter;
    }
    /**
     * Get the next character from the input data, advancing the offset.
     *
     * @private
     * @returns {string} The consumed character as a string.
     */
    _getNextChar(): string {
        if (this._data.length <= this._offset) {
            if (this._nextCharacter === 'Q' || (this._currentCharacter === 'D' && this._nextCharacter === 'o')) {
                this._currentCharacter = this._nextCharacter;
                this._nextCharacter = String.fromCharCode(65535);
                return this._currentCharacter;
            }
            this._currentCharacter = String.fromCharCode(65535);
            this._nextCharacter = String.fromCharCode(65535);
        } else {
            this._currentCharacter = this._nextCharacter;
            this._nextCharacter = String.fromCharCode(this._data[this._offset++]);
            if (this._currentCharacter === '\x0D') {
                if (this._nextCharacter === '\x0A') {
                    this._currentCharacter = this._nextCharacter;
                    if (this._data.length <= this._offset) {
                        this._nextCharacter = String.fromCharCode(65535);
                    } else {
                        this._nextCharacter = String.fromCharCode(this._data[this._offset++]);
                    }
                } else {
                    this._currentCharacter = '\x0A';
                }
            }
        }
        return this._currentCharacter;
    }
}
/**
 * Exactly one of `_operands` or `_inlineImageBytes` will be set based on the
 * provided `data` argument.
 *
 * @private
 */
export class _PdfRecord {
    _operator: string;
    _operands: string[];
    _splitText: string[];
    _inlineImageBytes: Uint8Array;
    constructor(name: string, operands: string[]);
    constructor(name: string, imageData: Uint8Array);
    constructor(name: string, data: string[] | Uint8Array) {
        this._operator = name;
        if (Array.isArray(data)) {
            this._operands = data;
        } else {
            this._inlineImageBytes = data;
        }
    }
}
