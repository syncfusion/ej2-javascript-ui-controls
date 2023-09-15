import { _TokenType } from './enumerator';
export class _ContentParser {
    _lexer: _ContentLexer;
    _recordCollection: _PdfRecord[] = [];
    _operands: string[] = [];
    constructor(contentStream: number[])
    constructor(contentStream: Uint8Array)
    constructor(contentStream: Uint8Array | number[]) {
        this._lexer = new _ContentLexer(contentStream);
    }
    _readContent(): _PdfRecord[] {
        this._parseObject(_TokenType.eof);
        return this._recordCollection;
    }
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
                this._createRecord();
                this._operands = [];
                break;
            case _TokenType.beginArray:
                break;
            case _TokenType.endArray:
                throw new Error('Error while parsing content');
            }
        }
    }
    _createRecord(): void {
        const operand: string = this._lexer._operatorParams;
        const record: _PdfRecord = new _PdfRecord(operand, this._operands);
        this._recordCollection.push(record);
    }
    _getNextToken(): _TokenType {
        return this._lexer._getNextToken();
    }
}
export class _ContentLexer {
    _data: Uint8Array;
    _tokenType: _TokenType = _TokenType.none;
    _operatorParams: string;
    _currentCharacter: string = '\0';
    _nextCharacter: string = '\0';
    _offset: number = 0;
    constructor(data: Uint8Array | number[]) {
        this._data = data instanceof Uint8Array ? data : new Uint8Array(data);
    }
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
    _getComment(): _TokenType {
        this._operatorParams = '';
        let value: string;
        let flag: boolean = (value = this._consumeValue()) !== '\x0A' && value !== String.fromCharCode(65535);
        while (flag) {
            flag = (value = this._consumeValue()) !== '\x0A' && value !== String.fromCharCode(65535);
        }
        return _TokenType.comment;
    }
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
    _getOperator(): _TokenType {
        this._operatorParams = '';
        let value: string = this._currentCharacter;
        while (this._isOperator(value)) {
            value = this._consumeValue();
        }
        return _TokenType.operator;
    }
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
    _getLiteralString(): _TokenType {
        this._operatorParams = '';
        const beginChar: string = this._currentCharacter;
        let literal: string;
        let value: string = this._consumeValue();
        let flag: boolean = true;
        while (flag) {
            if (beginChar === '(') {
                literal = this._getLiteralStringValue(value);
                this._operatorParams += literal;
                value = this._getNextChar();
                flag = false;
                break;
            } else {
                if (value === '(') {
                    value = this._consumeValue();
                    literal = this._getLiteralStringValue(value);
                    this._operatorParams += literal;
                    value = this._getNextChar();
                    continue;
                } else if (value === ']') {
                    flag = false;
                    value = this._consumeValue();
                    break;
                }
                value = this._consumeValue();
            }
        }
        return _TokenType.string;
    }
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
    _consumeValue(): string {
        this._operatorParams += this._currentCharacter;
        return this._getNextChar();
    }
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
export class _PdfRecord {
    _operator: string;
    _operands: string[];
    constructor(operator: string, operands: string[]) {
        this._operator = operator;
        this._operands = operands;
    }
}
