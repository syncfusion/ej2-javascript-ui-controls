import { Calculate, FormulaError, CalcSheetFamilyItem } from './index';
import { CommonErrors, FailureEventArgs, FormulasErrorsStrings, isExternalFileLink } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
export class Parser {
    private parent: Calculate;
    constructor(parent?: Calculate) {
        this.parent = parent;
    }
    private emptyStr: string = '';
    private storedStringText: string = this.emptyStr;
    private sheetToken: string = '!';
    /** @hidden */
    public tokenAdd: string = 'a';
    /** @hidden */
    public tokenSubtract: string = 's';
    /** @hidden */
    public tokenMultiply: string = 'm';
    /** @hidden */
    public tokenDivide: string = 'd';
    /** @hidden */
    public tokenLess: string = 'l';
    private charEm: string = 'r';
    private charEp: string = 'x';
    /** @hidden */
    public tokenGreater: string = 'g';
    /** @hidden */
    public tokenEqual: string = 'e';
    /** @hidden */
    public tokenLessEq: string = 'k';
    /** @hidden */
    public tokenGreaterEq: string = 'j';
    /** @hidden */
    public tokenNotEqual: string = 'o';
    /** @hidden */
    public tokenAnd: string = 'c';
    private tokenEm: string = 'v';
    private tokenEp: string = 't';
    /** @hidden */
    public tokenOr: string = String.fromCharCode(126);
    private charAnd: string = 'i';
    private charLess: string = '<';
    private charGreater: string = '>';
    private charEqual: string = '=';
    private charLessEq: string = 'f';
    private charGreaterEq: string = 'h';
    private charNoEqual: string = 'z';
    private stringGreaterEq: string = '>=';
    private stringLessEq: string = '<=';
    private stringNoEqual: string = '<>';
    private stringAnd: string = '&';
    private stringOr: string = '^';
    private charOr: string = 'w';
    private charAdd: string = '+';
    private charSubtract: string = '-';
    private charMultiply: string = '*';
    private charDivide: string = '/';
    private fixedReference: string = '$';
    private spaceString: string = ' ';
    private ignoreBracet: boolean = false;
    /** @hidden */
    public isError: boolean = false;
    /** @hidden */
    public isFormulaParsed: boolean = false;
    private findNamedRange: boolean = false;
    private stringsColl: Map<string, string> = new Map<string, string>();
    private tokens: string[] = [
        this.tokenAdd, this.tokenSubtract, this.tokenMultiply, this.tokenDivide, this.tokenLess,
        this.tokenGreater, this.tokenEqual, this.tokenLessEq, this.tokenGreaterEq, this.tokenNotEqual, this.tokenAnd, this.tokenOr];
    private charNOTop: string = String.fromCharCode(167);
    private specialSym: string[] = ['~', '@', '#', '?'];
    private isFailureTriggered: boolean = false;

    /**
     * @hidden
     * @param {string} text - specify the text
     * @param {string} fkey - specify the formula key
     * @returns {string} - returns parse.
     */
    public parse(text: string, fkey?: string): string {
        if (this.parent.isTextEmpty(text)) {
            return text;
        }
        if (isExternalFileLink(text)) {
            return this.parent.getErrorStrings()[CommonErrors.ref];
        }
        if (this.parent.getFormulaCharacter() !== String.fromCharCode(0) && this.parent.getFormulaCharacter() === text[0]) {
            text = text.substring(1);
        }
        if (this.parent.namedRanges.size > 0 || this.parent.storedData.size > 0) {
            text = this.checkForNamedRangeAndKeyValue(text);
            this.findNamedRange = false;
        }
        text = text.split('-+').join('-'); text = text.split('--').join('+'); text = text.split('+-').join('-');
        text = text.split('-' + '(' + '-').join('(');
        const formulaString: Map<string, string> = this.storeStrings(text);
        text = this.storedStringText;
        let i: number = 0;
        if (isNullOrUndefined(formulaString)) {
            text = text.split(' ').join('');
        }
        text = text.split('=>').join('>=');
        text = text.split('=<').join('<=');
        if (text[text.length - 1] !== this.parent.arithMarker || this.indexOfAny(text, this.tokens) !== (text.length - 2)) {
            text = text.toUpperCase();
        }
        if (text.indexOf(this.sheetToken) > -1) {
            const family: CalcSheetFamilyItem = this.parent.getSheetFamilyItem(this.parent.grid);
            if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.size > 0) {
                if (text[0] !== this.sheetToken.toString()) {
                    text = this.parent.setTokensForSheets(text);
                }
                const sheetToken: string = this.parent.getSheetToken(text.split(this.parent.tic).join(this.emptyStr));
                const scopedRange: string = this.checkScopedRange(text.split('"').join(this.emptyStr).split(this.sheetToken).join(''));
                if (isNullOrUndefined(sheetToken) && sheetToken !== '' && this.parent.namedRanges.size > 0 && scopedRange !== '') {
                    text = scopedRange;
                }
            }
        }
        text = this.markLibraryFormulas(text);
        try {
            text = this.formulaAutoCorrection(text);
        } catch (ex) {
            const args: FailureEventArgs = {
                message: ex.message, exception: ex, isForceCalculable: ex.formulaCorrection,
                computeForceCalculate: false
            };
            if (!args.isForceCalculable) {
                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_expression];
            }
            if (!this.isFailureTriggered) {
                this.parent.trigger('onFailure', args);
                this.isFailureTriggered = true;
            }
            if (args.isForceCalculable && args.computeForceCalculate) {
                text = this.formulaAutoCorrection(text, args);
                this.parent.storedData.get(fkey).formulaText = '=' + text;
            } else {
                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_expression];
            }
        }
        if (!this.ignoreBracet) {
            i = text.indexOf(')');
            while (i > -1) {
                const k: number = text.substring(0, i).lastIndexOf('(');
                if (k === -1) {
                    throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.mismatched_parentheses]);
                }
                if (k === i - 1) {
                    throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.empty_expression]);
                }
                let s: string = this.emptyStr;
                if (this.ignoreBracet) {
                    s = this.parent.substring(text, k, i - k + 1);
                } else {
                    s = this.parent.substring(text, k + 1, i - k - 1);
                }
                try {
                    text = text.substring(0, k) + this.parseSimple(s) + text.substring(i + 1);
                } catch (ex) {
                    const args: FailureEventArgs = this.exceptionArgs(ex);
                    if (!this.isFailureTriggered) {
                        this.parent.trigger('onFailure', args);
                        this.isFailureTriggered = true;
                    }
                    const errorMessage: string = (typeof args.exception === 'string') ? args.exception : args.message;
                    return (this.parent.getErrorLine(ex) ? '' : '#' + this.parent.getErrorLine(ex) + ': ') + errorMessage;
                }
                i = text.indexOf(')');
            }
        }
        if (!this.ignoreBracet && text.indexOf('(') > -1) {
            throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.mismatched_parentheses]);
        }
        text = this.parseSimple(text);
        if (formulaString !== null && formulaString.size > 0) {
            text = this.setStrings(text, formulaString);
        }
        return text;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private exceptionArgs(ex: any): FailureEventArgs {
        return {
            message: ex.message, exception: ex, isForceCalculable: ex.formulaCorrection,
            computeForceCalculate: false
        };
    }

    private formulaAutoCorrection(formula: string, args?: FailureEventArgs): string {
        const arithemeticArr: string[] = ['*', '+', '-', '/', '^', '&'];
        const logicalSym: string[] = ['>', '=', '<'];
        let i: number = 0;
        let form: string = '';
        let op: string = '';
        let firstOp: string = '';
        let secondprevOp: string = '';
        let secondnextOp: string = '';
        let firstDigit: string = '';
        let secondDigit: string = '';
        let countDigit: number = 0;
        if (this.parent.formulaErrorStrings.indexOf(formula) > -1) {
            return formula;
        } else {
            if (this.indexOfAny(formula, this.specialSym) > -1) {
                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_expression], false);
            }
            while (i < formula.length) {
                formula = formula.split('-*').join('-').split('/*').join('/').split('*/').join('*').split('-/').join('-').
                    split('*+').join('*').split('+*').join('+');
                if ((this.parent.isDigit(formula[i]) && ((formula.length > i + 1)
                    && (this.indexOfAny(formula[i + 1], arithemeticArr) > -1)) && ((formula.length > i + 2)
                    && (!isNullOrUndefined(formula[i + 2]) && this.indexOfAny(formula[i + 2], arithemeticArr) > -1))) &&
                    (formula[i + 2] !== '-' || (formula[i + 1] !== '*' && formula[i + 1] !== '/'))) {
                    if (isNullOrUndefined(args)) {
                        throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_expression], true);
                    }
                    if (args.computeForceCalculate) {
                        if (this.parent.isDigit(formula[i])) {
                            if (countDigit < 1) {
                                firstDigit = formula[i];
                                firstOp = formula[i + 1];
                                if (isNullOrUndefined(firstOp)) {
                                    firstOp = this.emptyStr;
                                }
                                firstOp = firstOp === '&' ? '' : firstOp;
                                countDigit = countDigit + 1;
                                form = form + firstDigit + firstOp;
                            } else if (countDigit < 2) {
                                secondDigit = formula[i];
                                secondprevOp = formula[i - 1];
                                secondnextOp = formula[i + 1];
                                countDigit = 0;
                                if (secondprevOp === '-') {
                                    secondnextOp = isNullOrUndefined(secondnextOp) ? this.emptyStr : secondnextOp;
                                    secondnextOp = secondnextOp === '&' ? '' : secondnextOp;
                                    form = form + secondprevOp + secondDigit + secondnextOp;
                                } else {
                                    secondnextOp = isNullOrUndefined(secondnextOp) ? this.emptyStr : secondnextOp;
                                    form = form + secondDigit + secondnextOp;
                                }
                            }
                            i = i + 2;
                        } else {
                            form = (formula[i] === '-') ? form + formula[i] : form;
                            i = i + 1;
                        }
                    } else {
                        throw this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
                    }
                    /* eslint-disable-next-line */
                } else if ((this.parent.isDigit(formula[i]) || formula[i] === this.parent.rightBracket || this.parent.storedData.has(formula[i].toUpperCase())) && (isNullOrUndefined(formula[i + 1]) || this.indexOfAny(formula[i + 1], arithemeticArr)) > -1) {
                    op = isNullOrUndefined(formula[i + 1]) ? this.emptyStr : formula[i + 1];
                    op = op === '&' ? '' : op;
                    form = formula[i - 1] === '-' ? form + formula[i - 1] + formula[i] + op : form + formula[i] + op;
                    i = i + 2;
                    /* eslint-disable-next-line */
                } else if (this.indexOfAny(formula[i], logicalSym) > -1 && !isNullOrUndefined(formula[i - 1]) && !isNullOrUndefined(formula[i + 1])) {
                    form = form + formula[i];
                    i = i + 1;
                } else if (formula[i] === 'q') {
                    while (formula[i] !== this.parent.leftBracket) {
                        form = form + formula[i];
                        i = i + 1;
                    }
                } else if (formula[i] === this.parent.leftBracket || formula[i] === this.parent.rightBracket || formula[i] === '{' || formula[i] === '}' || formula[i] === '(' || formula[i] === ')') {
                    form = form + formula[i];
                    i = i + 1;
                } else if (this.parent.isUpperChar(formula[i]) || formula[i].indexOf(':') > -1 || formula[i] === this.parent.getParseArgumentSeparator() || ((formula[i] === '%') && (this.parent.isDigit(formula[i - 1])))) {
                    form = form + formula[i];
                    i = i + 1;
                } else if (formula[i] === this.parent.tic || formula[i] === ' ' || formula[i] === '.' || formula[i] === this.sheetToken ||
                    formula[i] === '$') {
                    form = form + formula[i];
                    i = i + 1;
                } else {
                    if (this.parent.isDigit(formula[i])) {
                        form = formula[i - 1] === '-' ? form + formula[i - 1] + formula[i] : form + formula[i];
                    }
                    if (formula[i] === '-' || formula[i] === '+') {
                        form = form + formula[i];
                        form = form.split('++').join('+').split('+-').join('-').split('-+').join('-');
                    }
                    if (formula[i] === '/' || formula[i] === '*') {
                        form = form + formula[i];
                    }
                    i = i + 1;
                }
            }
        }
        form = form === this.emptyStr ? formula : form;
        if (this.indexOfAny(form[form.length - 1], arithemeticArr) > -1) {
            form = form.substring(0, form.length - 1);
        }
        form = form.split('--').join('-').split('-+').join('-').split('+-').join('-');
        return form;
    }

    private checkScopedRange(text: string): string {
        let scopedRange: string = this.emptyStr;
        let b: string = 'NaN';
        let id: number = this.parent.getSheetID(this.parent.grid);
        const sheet: CalcSheetFamilyItem = this.parent.getSheetFamilyItem(this.parent.grid);
        if (text[0] === this.sheetToken.toString()) {
            const i: number = text.indexOf(this.sheetToken, 1);
            const v: number = parseInt(text.substr(1, i - 1), 10);
            if (i > 1 && !this.parent.isNaN(v)) {
                text = text.substring(i + 1);
                id = v;
            }
        }
        const token: string = '!' + id.toString() + '!';
        if (sheet === null || sheet.sheetNameToToken == null) {
            return b;
        }
        sheet.sheetNameToToken.forEach((value: string, key: string) => {
            if (sheet.sheetNameToToken.get(key).toString() === token) {
                let s: string = this.emptyStr;
                this.parent.namedRanges.forEach((value: string, key: string) => {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    if (!isNullOrUndefined(this.parent.parentObject as any)) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        s = ((this.parent.parentObject as any).getActiveSheet().name + this.sheetToken + text).toUpperCase();
                    } else {
                        s = sheet.sheetNameToToken.get(key).toUpperCase();
                    }
                    if (this.parent.getNamedRanges().has(s)) {
                        scopedRange = (this.parent.getNamedRanges().get(s)).toUpperCase();
                        b = scopedRange;
                    }
                });
            }
        });
        return b;
    }

    private storeStrings(tempString: string): Map<string, string> {
        let i: number = 0;
        let j: number = 0;
        let id: number = 0;
        let key: string = '';
        let storedString: Map<string, string> = null;
        let condition: string;
        const ticLoc: number = tempString.indexOf(this.parent.tic);
        if (ticLoc > -1) {
            i = tempString.indexOf(this.parent.tic);
            while (i > -1 && tempString.length > 0) {
                if (storedString === null) {
                    storedString = this.stringsColl;
                }
                j = i + 1 < tempString.length ? tempString.indexOf(this.parent.tic, i + 1) : -1;
                if (j === -1) {
                    throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.mismatched_tics]);
                }
                condition = this.parent.substring(tempString, i, j - i + 1);
                key = this.parent.tic + this.spaceString + id.toString() + this.parent.tic;
                storedString = storedString.set(key, condition);
                tempString = tempString.substring(0, i) + key + tempString.substring(j + 1);
                i = i + key.length;
                if (i <= tempString.length) {
                    i = tempString.indexOf(this.parent.tic, i);
                }
                id++;
            }
        }
        this.storedStringText = tempString;
        return storedString;
    }

    private setStrings(text: string, formulaString: Map<string, string>): string {
        for (let i: number = 0; i < formulaString.size; i++) {
            formulaString.forEach((value: string, key: string) => {
                text = text.split(key).join(value);
            });
        }
        return text;
    }

    /**
     * @hidden
     * @param {string} formulaText - specify the formula text
     * @returns {string} - parse simple.
     */
    public parseSimple(formulaText: string): string {
        let needToContinue: boolean = true;
        let text: string = formulaText;
        if (text.length > 0 && text[0] === '+') {
            text = text.substring(1);
        }
        if (text === '#DIV/0!') {
            return '#DIV/0!';
        }
        if (text === '#NAME?') {
            return '#NAME?';
        }
        if (text === '') {
            return text;
        }
        if (this.parent.formulaErrorStrings.indexOf(text) > -1) {
            return text;
        }
        text = text.split(this.stringLessEq).join(this.charLessEq);
        text = text.split(this.stringGreaterEq).join(this.charGreaterEq);
        text = text.split(this.stringNoEqual).join(this.charNoEqual);
        text = text.split(this.stringAnd).join(this.charAnd);
        text = text.split(this.stringOr).join(this.charOr);
        text = text.split(this.fixedReference).join(this.emptyStr);
        needToContinue = true;
        const expTokenArray: string[] = [this.tokenEp, this.tokenEm];
        const mulTokenArray: string[] = [this.tokenMultiply, this.tokenDivide];
        const addTokenArray: string[] = [this.tokenAdd, this.tokenSubtract];
        const mulCharArray: string[] = [this.charMultiply, this.charDivide];
        const addCharArray: string[] = [this.charAdd, this.charSubtract];
        const compareTokenArray: string[] = [this.tokenLess, this.tokenGreater, this.tokenEqual, this.tokenLessEq,
            this.tokenGreaterEq, this.tokenNotEqual];
        const compareCharArray: string[] = [this.charLess, this.charGreater, this.charEqual, this.charLessEq,
            this.charGreaterEq, this.charNoEqual];
        const expCharArray: string[] = [this.charEp, this.charEm];
        const andTokenArray: string[] = [this.tokenAnd];
        const andCharArray: string[] = [this.charAnd];
        const orCharArray: string[] = [this.charOr];
        const orTokenArray: string[] = [this.tokenOr];
        text = this.parseSimpleOperators(text, expTokenArray, expCharArray);
        text = this.parseSimpleOperators(text, orTokenArray, orCharArray);
        if (needToContinue) {
            text = this.parseSimpleOperators(text, mulTokenArray, mulCharArray);
        }
        if (needToContinue) {
            text = this.parseSimpleOperators(text, addTokenArray, addCharArray);
        }
        if (needToContinue) {
            text = this.parseSimpleOperators(text, compareTokenArray, compareCharArray);
        }
        if (needToContinue) {
            text = this.parseSimpleOperators(text, andTokenArray, andCharArray);
        }
        return text;
    }

    /**
     * @hidden
     * @param {string} formulaText - specify the formula text
     * @param {string[]} markers -  specify the markers
     * @param {string[]} operators - specify the operators
     * @returns {string} - parse Simple Operators
     */
    public parseSimpleOperators(formulaText: string, markers: string[], operators: string[]): string {
        if (this.parent.getErrorStrings().indexOf(formulaText) > -1) {
            return formulaText;
        }
        let text: string = formulaText;
        let i: number = 0;
        let op: string = '';
        for (let c: number = 0; c < operators.length; c++) {
            op = op + operators[c];
        }
        /* eslint-disable */
        text = text.split("---").join("-").split("--").join("+").split(this.parent.getParseArgumentSeparator() + "-").join(this.parent.getParseArgumentSeparator() + "u").split(this.parent.leftBracket + "-").join(this.parent.leftBracket + "u").split("=-").join("=u");
        text = text.split(',+').join(',').split(this.parent.leftBracket + '+').join(this.parent.leftBracket).split('=+').join('=').split('>+').join('>').split('<+').join('<').split('/+').join('/').split('*+').join('*').split('++').join('+').split("*-").join("*u").toString();;
        /* eslint-enable */
        if (text.length > 0 && text[0] === '-') {
            text = text.substring(1).split('-').join(this.tokenOr);
            text = '0-' + text;
            text = this.parseSimpleOperators(text, [this.tokenSubtract], [this.charSubtract]);
            text = text.split(this.tokenOr).join('-');
        } else if (text.length > 0 && text[0] === '+') {
            text = text.substring(1);
        } else if (text.length > 0 && text[text.length - 1] === '+') {
            text = text.substring(0, text.length - 1);
        }
        try {
            if (this.indexOfAny(text, operators) > -1) {
                i = this.indexOfAny(text, operators);
                while (i > -1) {
                    let left: string = '';
                    let right: string = '';
                    let leftIndex: number = 0;
                    let rightIndex: number = 0;
                    const isNotOperator: boolean = text[i] === this.charNOTop;
                    let j: number = 0;
                    if (!isNotOperator) {
                        j = i - 1;
                        if (text[j] === this.parent.arithMarker) {
                            const k: number = this.findLeftMarker(text.substring(0, j - 1));
                            if (k < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }
                            left = this.parent.substring(text, k + 1, j - k - 1);
                            leftIndex = k + 1;
                        } else if (text[j] === this.parent.rightBracket) {
                            let bracketCount: number = 0;
                            let k: number = j - 1;
                            while (k > 0 && (text[k] !== 'q' || bracketCount !== 0)) {
                                if (text[k] === 'q') {
                                    bracketCount--;
                                } else if (text[k] === this.parent.rightBracket) {
                                    bracketCount++;
                                }
                                k--;
                            }
                            if (k < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }

                            left = this.parent.substring(text, k, j - k + 1);
                            leftIndex = k;
                        } else if (text[j] === this.parent.tic[0]) {
                            const l: number = text.substring(0, j - 1).lastIndexOf(this.parent.tic);
                            if (l < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }
                            left = this.parent.substring(text, l, j - l + 1);
                            leftIndex = l;
                        } else {
                            let period: boolean = false;
                            while (j > -1 && (this.parent.isDigit(text[j]) ||
                                (!period && text[j] === this.parent.getParseDecimalSeparator()))) {
                                if (text[j] === this.parent.getParseDecimalSeparator()) {
                                    period = true;
                                }
                                j = j - 1;
                            }
                            if (j > -1 && period && text[j] === this.parent.getParseDecimalSeparator()) {
                                /* eslint-disable-next-line */
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.number_contains_2_decimal_points]);
                            }
                            j = j + 1;
                            if (j === 0 || (j > 0 && !this.parent.isUpperChar(text[j - 1]))) {
                                left = 'n' + this.parent.substring(text, j, i - j);
                                leftIndex = j;
                            } else {
                                j = j - 1;
                                while (j > -1 && (this.parent.isUpperChar(text[j]) || this.parent.isDigit(text[j]))) {
                                    j = j - 1;
                                }
                                if (j > -1 && text[j] === this.sheetToken) {
                                    j = j - 1;
                                    while (j > -1 && text[j] !== this.sheetToken) {
                                        j = j - 1;
                                    }

                                    if (j > -1 && text[j] === this.sheetToken) {
                                        j = j - 1;
                                    }
                                }
                                if (j > -1 && text[j] === ':') {
                                    //// handle range operands
                                    j = j - 1;
                                    while (j > -1 && this.parent.isDigit(text[j])) {
                                        j = j - 1;
                                    }

                                    while (j > -1 && this.parent.isUpperChar(text[j])) {
                                        j = j - 1;
                                    }

                                    if (j > -1 && text[j] === this.sheetToken) {
                                        j--;
                                        while (j > -1 && text[j] !== this.sheetToken) {
                                            j--;
                                        }

                                        if (j > -1 && text[j] === this.sheetToken) {
                                            j--;
                                        }
                                    }

                                    j = j + 1;
                                    left = this.parent.substring(text, j, i - j);
                                    left = this.parent.getCellFrom(left);
                                } else {
                                    j = j + 1;
                                    left = this.parent.substring(text, j, i - j);
                                }
                                this.parent.updateDependentCell(left);
                                leftIndex = j;
                            }
                            if ((this.parent.namedRanges.size > 0 && this.parent.namedRanges.has(left.toUpperCase())) ||
                                (this.parent.storedData.has(left.toUpperCase()))) {
                                left = 'n' + this.checkForNamedRangeAndKeyValue(left);
                            }
                        }
                    } else {
                        leftIndex = i;
                    }
                    if (i === text.length - 1) {
                        /* eslint-disable-next-line */
                        throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.expression_cannot_end_with_an_operator]);
                    } else {
                        j = i + 1;
                        let uFound: boolean = text[j] === 'u';      // for 3*-2
                        if (uFound) {
                            j = j + 1;
                        }
                        if (text[j] === this.parent.tic[0]) {
                            const k: number = text.substring(j + 1).indexOf(this.parent.tic);
                            if (k < 0) {
                                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse];
                            }
                            right = this.parent.substring(text, j, k + 2);
                            rightIndex = k + j + 2;
                        } else if (text[j] === this.parent.arithMarker) {
                            const k: number = this.findRightMarker(text.substring(j + 1));
                            if (k < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }
                            right = this.parent.substring(text, j + 1, k);
                            rightIndex = k + j + 2;
                        } else if (text[j] === 'q') {
                            let bracketCount: number = 0;
                            let k: number = j + 1;
                            while (k < text.length && (text[k] !== this.parent.rightBracket || bracketCount !== 0)) {
                                if (text[k] === this.parent.rightBracket) {
                                    bracketCount++;
                                } else if (text[k] === 'q') {
                                    bracketCount--;
                                }
                                k++;
                            }
                            if (k === text.length) {
                                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse];
                            }
                            right = this.parent.substring(text, j, k - j + 1);
                            if (uFound) {
                                right = 'u' + right;
                            }
                            rightIndex = k + 1;
                        } else if (this.parent.isDigit(text[j]) || text[j] === this.parent.getParseDecimalSeparator()) {
                            let period: boolean = (text[j] === this.parent.getParseDecimalSeparator());
                            j = j + 1;
                            /* eslint-disable-next-line */
                            while (j < text.length && (this.parent.isDigit(text[j]) || (!period && text[j] === this.parent.getParseDecimalSeparator()))) {
                                if (text[j] === this.parent.getParseDecimalSeparator()) {
                                    period = true;
                                }
                                j = j + 1;
                            }
                            if (j < text.length && text[j] === '%') {
                                j += 1;
                            }
                            if (period && j < text.length && text[j] === this.parent.getParseDecimalSeparator()) {
                                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.number_contains_2_decimal_points];
                            }
                            right = 'n' + this.parent.substring(text, i + 1, j - i - 1);
                            rightIndex = j;
                        } else if (this.parent.isUpperChar(text[j]) || text[j] === this.sheetToken || text[j] === 'u') {
                            if (text[j] === this.sheetToken) {
                                j = j + 1;
                                while (j < text.length && text[j] !== this.sheetToken) {
                                    j = j + 1;
                                }
                            }
                            j = j + 1;
                            let jTemp: number = 0;
                            let inbracket: boolean = false;
                            while (j < text.length && (this.parent.isUpperChar(text[j]) || text[j] === '_'
                                || text[j] === '.' || text[j] === '[' || text[j] === ']' || text[j] === '#' || text[j] === ' '
                                || text[j] === '%' || text[j] === this.parent.getParseDecimalSeparator() && inbracket)) {
                                if (j !== text.length - 1 && text[j] === '[' && text[j + 1] === '[') {
                                    inbracket = true;
                                }
                                if (j !== text.length - 1 && text[j] === ']' && text[j + 1] === ']') {
                                    inbracket = false;
                                }
                                j++;
                                jTemp++;
                            }
                            let noCellReference: boolean = (j === text.length) || !this.parent.isDigit(text[j]);
                            if (jTemp > 1) {
                                while (j < text.length && (this.parent.isUpperChar(text[j]) || this.parent.isDigit(text[j])
                                    || text[j] === ' ' || text[j] === '_')) {
                                    j++;
                                }
                                noCellReference = true;
                            }
                            while (j < text.length && this.parent.isDigit(text[j])) {
                                j = j + 1;
                            }
                            if (j < text.length && text[j] === ':') {
                                j = j + 1;
                                if (j < text.length && text[j] === this.sheetToken) {
                                    j++;
                                    while (j < text.length && text[j] !== this.sheetToken) {
                                        j = j + 1;
                                    }
                                    if (j < text.length && text[j] === this.sheetToken) {
                                        j++;
                                    }
                                }
                                while (j < text.length && this.parent.isUpperChar(text[j])) {
                                    j = j + 1;
                                }
                                while (j < text.length && this.parent.isDigit(text[j])) {
                                    j = j + 1;
                                }
                                j = j - 1;
                                right = this.parent.substring(text, i + 1, j - i);
                                right = this.parent.getCellFrom(right);
                            } else {
                                j = j - 1;
                                right = this.parent.substring(text, i + 1, j - i);
                                uFound = text[j] === 'u';
                                if (uFound) {
                                    right = 'u' + right;
                                }
                            }
                            if (noCellReference && right.startsWith(this.sheetToken)) {
                                noCellReference = !this.parent.isCellReference(right);
                            }
                            if (!noCellReference) {
                                this.parent.updateDependentCell(right);
                            }
                            if ((this.parent.namedRanges.size > 0 && this.parent.namedRanges.has(right.toUpperCase()))
                                || (this.parent.storedData.has(right.toUpperCase()))) {
                                right = 'n' + this.checkForNamedRangeAndKeyValue(right);
                            }
                            rightIndex = j + 1;
                        }
                    }
                    const p: number = op.indexOf(text[i]);
                    let s: string = this.parent.arithMarker + left + right + markers[p] + this.parent.arithMarker;
                    if (leftIndex > 0) {
                        s = text.substring(0, leftIndex) + s;
                    }
                    if (rightIndex < text.length) {
                        s = s + text.substring(rightIndex);
                    }
                    s = s.split(this.parent.arithMarker2).join(this.parent.arithMarker.toString());
                    text = s;
                    i = this.indexOfAny(text, operators);
                }
            } else {
                if (text.length > 0 && (this.parent.isUpperChar(text[0]) || text[0] === this.sheetToken)) {
                    let isCharacter: boolean = true;
                    let checkLetter: boolean = true;
                    let oneTokenFound: boolean = false;
                    const textLen: number = text.length;
                    for (let k: number = 0; k < textLen; ++k) {
                        if (text[k] === this.sheetToken) {
                            if (k > 0 && !oneTokenFound) {
                                throw this.parent.getErrorStrings()[CommonErrors.ref];
                            }
                            oneTokenFound = true;
                            k++;
                            while (k < textLen && this.parent.isDigit(text[k])) {
                                k++;
                            }
                            if (k === textLen || text[k] !== this.sheetToken) {
                                isCharacter = false;
                                break;
                            }
                        } else {
                            if (!checkLetter && this.parent.isChar(text[k])) {
                                isCharacter = false;
                                break;
                            }
                            if (this.parent.isChar(text[k]) || this.parent.isDigit(text[k]) || text[k] === this.sheetToken) {
                                checkLetter = this.parent.isUpperChar(text[k]);
                            } else {
                                isCharacter = false;
                                break;
                            }
                        }
                    }
                    if (isCharacter) {
                        this.parent.updateDependentCell(text);
                    }
                }
            }
            return text;
        } catch (ex) {
            return ex;
        }
    }

    /**
     * @hidden
     * @param {string} text - specify the text
     * @param {string[]} operators - specify the operators
     * @returns {number} - returns index.
     */
    public indexOfAny(text: string, operators: string[]): number {
        for (let i: number = 0; i < text.length; i++) {
            if (operators.indexOf(text[i]) > -1) {
                return i;
            }
        }
        return -1;
    }

    /**
     * @hidden
     * @param {string} text - specify the text
     * @returns {number} - find Left Marker.
     */
    public findLeftMarker(text: string): number {
        let ret: number = -1;
        if (text.indexOf(this.parent.arithMarker) > -1) {
            let bracketLevel: number = 0;
            for (let i: number = text.length - 1; i >= 0; --i) {
                if (text[i] === this.parent.rightBracket) {
                    bracketLevel--;
                } else if (text[i] === this.parent.leftBracket) {
                    bracketLevel++;
                } else if (text[i] === this.parent.arithMarker && bracketLevel === 0) {
                    ret = i;
                    break;
                }
            }
        }
        return ret;
    }

    /**
     * @hidden
     * @param {string} text - specify the text.
     * @returns {number} - find Right Marker.
     */
    public findRightMarker(text: string): number {
        let ret: number = -1;
        if (text.indexOf(this.parent.arithMarker) > -1) {
            let bracketLevel: number = 0;
            for (let j: number = 0; j < text.length; ++j) {
                if (text[j] === this.parent.rightBracket) {
                    bracketLevel--;
                } else if (text[j] === this.parent.leftBracket) {
                    bracketLevel++;
                } else if (text[j] === this.parent.arithMarker && bracketLevel === 0) {
                    ret = j;
                    break;
                }
            }
        }
        return ret;
    }

    /**
     * @hidden
     * @param {string} formula - specify the formula
     * @param {string} fKey - specify the formula key.
     * @returns {string} - parse formula.
     */
    public parseFormula(formula: string, fKey?: string): string {
        if (formula.length > 0 && formula[0] === this.parent.getFormulaCharacter()) {
            formula = formula.substring(1);
        }
        if (formula.indexOf('#REF!') > -1) {
            return this.parent.getErrorStrings()[CommonErrors.ref];
        }
        if (formula.length > 0 && formula[0] === '+') {
            formula = formula.substring(1);
        }
        try {
            this.isFailureTriggered = false;
            this.isError = false;
            formula = this.parse(formula.trim(), fKey);
            this.isFormulaParsed = true;
        } catch (ex) {
            const args: FailureEventArgs = this.exceptionArgs(ex);
            if (!this.isFailureTriggered) {
                this.parent.trigger('onFailure', args);
                this.isFailureTriggered = true;
            }
            const errorMessage: string = (typeof args.exception === 'string') ? args.exception : args.message;
            formula = (isNullOrUndefined(this.parent.getErrorLine(ex)) ? '' : '#' + this.parent.getErrorLine(ex) + ': ') + errorMessage;
            this.isError = true;
        }
        return formula;
    }

    /**
     * @hidden
     * @param {string} formula - specify the formula
     * @returns {string} - mark library formulas.
     */
    public markLibraryFormulas(formula: string): string {
        let bracCount: number = 0;
        let rightParens: number = formula.indexOf(')');
        if (rightParens === -1) {
            formula = this.markNamedRanges(formula);
        } else {
            while (rightParens > -1) {
                let parenCount: number = 0;
                let leftParens: number = rightParens - 1;
                while (leftParens > -1 && (formula[leftParens] !== '(' || parenCount !== 0)) {
                    if (formula[leftParens] === ')') {
                        parenCount++;
                    }
                    // else if (formula[leftParens] === ')') {
                    //     parenCount--;
                    // }
                    leftParens--;
                }
                if (leftParens === -1) {
                    throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.mismatched_parentheses]);
                }
                let i: number = leftParens - 1;
                while (i > -1 && (this.parent.isChar(formula[i]))) {
                    i--;
                }
                const len: number = leftParens - i - 1;
                const libFormula: string = this.parent.substring(formula, i + 1, len);
                if (len > 0 && !isNullOrUndefined(this.parent.getFunction(libFormula))) {
                    if (this.parent.substring(formula, i + 1, len) === 'AREAS') {
                        this.ignoreBracet = true;
                    } else {
                        this.ignoreBracet = false;
                    }
                    let substr: string = this.parent.substring(formula, leftParens, rightParens - leftParens + 1);
                    try {
                        let args: FailureEventArgs;
                        substr = substr.split('(').join('').split(')').join('');
                        substr = '(' + this.formulaAutoCorrection(substr, args) + ')';
                    } catch (ex) {
                        const args: FailureEventArgs = {
                            message: ex.message, exception: ex,
                            isForceCalculable: ex.formulaCorrection, computeForceCalculate: false
                        };
                        if (!args.isForceCalculable) {
                            throw this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
                        }
                        if (!this.isFailureTriggered) {
                            this.parent.trigger('onFailure', args);
                            this.isFailureTriggered = true;
                            bracCount = bracCount + 1;
                        }
                        args.computeForceCalculate = bracCount > 0 ? true : args.computeForceCalculate;
                        if (args.isForceCalculable) {
                            if (args.computeForceCalculate) {
                                substr = substr.split('(').join('').split(')').join('');
                                substr = '(' + this.formulaAutoCorrection(substr, args) + ')';
                            } else {
                                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
                            }
                        } else {
                            throw this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
                        }
                    }
                    substr = this.markNamedRanges(substr);
                    substr = this.swapInnerParens(substr);
                    substr = this.addParensToArgs(substr);
                    const id: number = substr.lastIndexOf(this.parent.getParseArgumentSeparator());
                    if (id === -1) {
                        if (substr.length > 2 && substr[0] === '(' && substr[substr.length - 1] === ')') {
                            if (substr[1] !== '{' && substr[1] !== '(') {
                                substr = substr.substring(0, substr.length - 1) + '}' + substr.substring(substr.length - 1);
                                substr = substr[0] + '{' + substr.substring(1);
                            }
                        }
                    }
                    formula = formula.substring(0, i + 1) + 'q' + this.parent.substring(formula, i + 1, len) +
                        (substr.split('(').join(this.parent.leftBracket))
                            .split(')').join(this.parent.rightBracket) + formula.substring(rightParens + 1);
                } else if (len > 0) {
                    return this.parent.getErrorStrings()[CommonErrors.name];
                } else {
                    let s: string = this.emptyStr;
                    if (leftParens > 0) {
                        s = formula.substring(0, leftParens);
                    }
                    s = s + '{' + this.parent.substring(formula, leftParens + 1, rightParens - leftParens - 1) + '}';
                    if (rightParens < formula.length) {
                        s = s + formula.substring(rightParens + 1);
                    }
                    s = this.markNamedRanges(s);
                    formula = s;
                }
                rightParens = formula.indexOf(')');
            }
        }
        formula = (formula.split('{').join('(')).split('}').join(')');
        return formula;
    }

    /**
     * @hidden
     * @param {string} fSubstr - specify the string
     * @returns {string} - swap inner parens.
     */
    public swapInnerParens(fSubstr: string): string {
        if (fSubstr.length > 2) {
            fSubstr = fSubstr[0] + fSubstr.substr(1, fSubstr.length - 2).split('(').join('{').split(')').join('}') + fSubstr[fSubstr.length - 1];
        }
        return fSubstr;
    }

    /**
     * @hidden
     * @param {string} fSubstr - specify the string
     * @returns {string} - add parens to args.
     */
    public addParensToArgs(fSubstr: string): string {
        if (fSubstr.length === 0) {
            return this.emptyStr;
        }
        const rightSides: string[] = [];
        rightSides.push(this.parent.getParseArgumentSeparator());
        rightSides.push(this.parent.rightBracket);
        let id: number = fSubstr.lastIndexOf(this.parent.getParseArgumentSeparator());
        let k: number = 0;
        if (id === -1) {
            if (fSubstr.length > 2 && fSubstr[0] === '(' && fSubstr[fSubstr.length - 1] === ')') {
                if (fSubstr[1] !== '{' && fSubstr[1] !== '(') {
                    fSubstr = fSubstr.substring(0, fSubstr.length - 1) + '}' + fSubstr.substring(fSubstr.length - 1);
                    fSubstr = fSubstr[0] + '{' + fSubstr.substring(1);
                } else {
                    const marker: string[] = ['+', '-', '*', '/'];
                    id = this.lastIndexOfAny(fSubstr, marker);
                    if (k === 0 && fSubstr[fSubstr.length - 1] === ')') {
                        k = fSubstr.length - 1;
                    }
                    if (k > 0) {
                        if (fSubstr[id + 1] !== '{' && fSubstr[id - 1] === '}') {
                            fSubstr = fSubstr.substr(0, k) + '}' + fSubstr.substr(k);
                            fSubstr = fSubstr.substr(0, id + 1) + '{' + fSubstr.substr(id + 1);
                        }
                    }
                }
            }
        } else {
            let oneTimeOnly: boolean = true;
            while (id > -1) {
                let j: number = this.indexOfAny(fSubstr.substring(id + 1, fSubstr.length), rightSides);
                if (j >= 0) {
                    j = id + j + 1;
                } else if (j === -1 && fSubstr[fSubstr.length - 1] === ')') {
                    j = fSubstr.length - 1;
                }
                if (j > 0) {
                    if (fSubstr[id + 1] !== '{' && fSubstr[j - 1] !== '}') {
                        fSubstr = fSubstr.substr(0, j) + '}' + fSubstr.substr(j);
                        fSubstr = fSubstr.substr(0, id + 1) + '{' + fSubstr.substr(id + 1);
                    }
                }
                id = fSubstr.substr(0, id).lastIndexOf(this.parent.getParseArgumentSeparator());
                if (oneTimeOnly && id === -1 && fSubstr[0] === '(') {
                    id = 0;
                    oneTimeOnly = false;
                }
            }
        }
        fSubstr = fSubstr.split('{}').join(this.emptyStr);
        return fSubstr;
    }

    /**
     * @hidden
     * @param {string} text - specify the text
     * @param {string[]} operators - specify the operators
     * @returns {number} - returns last Index Of Any.
     */
    private lastIndexOfAny(text: string, operators: string[]): number {
        for (let i: number = text.length - 1; i > -1; i--) {
            if (operators.indexOf(text[i]) > -1) {
                return i;
            }
        }
        return -1;
    }

    /**
     * @hidden
     * @param {string} formula - specify the formula
     * @returns {string} - mark Named Ranges.
     */
    public markNamedRanges(formula: string): string {
        const markers: string[] = [')', this.parent.getParseArgumentSeparator(), '}', '+', '-', '*', '/', '<', '>', '=', '&'];
        let i: number = (formula.length > 0 && (formula[0] === '(' || formula[0] === '{')) ? 1 : 0;
        if (formula.indexOf('#N/A') > -1) {
            formula = formula.split('#N/A').join('#N~A');
        }
        if (formula.indexOf('#DIV/0!') > -1) {
            formula = formula.split('#DIV/0!').join('#DIV~0!');
        }
        let end: number = this.indexOfAny(formula.substring(i), markers);
        while (end > -1 && end + i < formula.length) {
            let scopedRange: string = this.emptyStr; let s: string = null;
            if ((this.parent.substring(formula, i, end)).indexOf('[') > -1) {
                s = this.getTableRange(this.parent.substring(formula, i, end));
            } else if (this.parent.storedData.has(this.parent.substring(formula, i, end))) {
                s = this.checkForNamedRangeAndKeyValue(this.parent.substring(formula, i, end));
            } else if (this.parent.namedRanges.has(this.parent.substring(formula, i, end))) {
                s = this.checkForNamedRangeAndKeyValue(this.parent.substring(formula, i, end));
            }
            if (isNullOrUndefined(s)) {
                scopedRange = this.checkScopedRange(this.parent.substring(formula, i, end));
                if (scopedRange !== 'NaN') {
                    this.findNamedRange = true;
                    s = scopedRange;
                } else if (this.parent.substring(formula, i, end).startsWith(this.sheetToken.toString())) {
                    //let formulaStr: number = this.parent.substring(formula, i, end).indexOf(this.sheetToken, 1);
                    // if (formulaStr > 1) {
                    //     s = this.parent.namedRanges.get(this.parent.substring
                    // (formula.substring(i), formulaStr + 1, end - formulaStr - 1));
                    // }
                }
                if (!isNullOrUndefined(s) && this.findNamedRange) {
                    if (s.indexOf(this.fixedReference) > -1) {
                        s = s.split(this.fixedReference).join(this.emptyStr);
                    }
                }
            }
            if (!isNullOrUndefined(s)) {
                s = s.toUpperCase(); s = this.parent.setTokensForSheets(s); s = this.markLibraryFormulas(s);
            }
            if (!isNullOrUndefined(s) && s !== this.emptyStr) {
                formula = formula.substring(0, i) + s + formula.substring(i + end);
                i += s.length + 1;
            } else {
                i += end + 1;
                while (i < formula.length && !this.parent.isUpperChar(formula[i]) && formula[i] !== this.sheetToken) {
                    i++;
                }
            }
            end = i;
            if (i < formula.length - 1 && formula[i] === '{') {
                i = i + 1;
            }
            end = this.indexOfAny(formula.substring(i), markers);
            while (end === 0 && i < formula.length - 1) {
                i++; end = this.indexOfAny(formula.substring(i), markers);
            }
            if ((end === -1 || formula.substring(i).indexOf('[') > -1) && i < formula.length) {
                if (formula.substring(i).indexOf('[') > -1) {
                    s = this.getTableRange(formula.substring(i));
                } else {
                    if (this.parent.storedData.has(formula.substring(i))) {
                        s = this.parent.storedData.size > 0 ? this.checkForNamedRangeAndKeyValue(formula.substring(i)) : s;
                    } else {
                        s = this.parent.namedRanges.size > 0 ? this.checkForNamedRangeAndKeyValue(formula.substring(i)) : s;
                    }
                }
                if (isNullOrUndefined(s)) {
                    scopedRange = this.checkScopedRange(formula.substring(i));
                    if (scopedRange !== 'NaN') {
                        s = scopedRange;
                    }
                }
                if (!isNullOrUndefined(s) && s !== this.emptyStr) {
                    s = s.toUpperCase(); s = this.parent.setTokensForSheets(s); s = this.markLibraryFormulas(s);
                    if (s != null) {
                        const val: string = formula.substring(i);
                        if (val[val.length - 1] === ')') {
                            formula = formula.substring(0, i) + s + ')';
                        } else {
                            formula = formula.substring(0, i) + s;
                        }
                        i += s.toString().length + 1;
                    }
                }
                end = (i < formula.length) ? this.indexOfAny(formula.substring(i), markers) : -1;
            }
        }
        if (formula.indexOf('#N~A') > -1) {
            formula = formula.split('#N~A').join('#N/A');
        }
        if (formula.indexOf('#DIV~0!') > -1) {
            formula = formula.split('#DIV~0!').join('#DIV/0!');
        }
        return formula;
    }

    /**
     * @hidden
     * @param {string} text - specify the text.
     * @returns {string} - check For Named Range And Key Value
     */
    public checkForNamedRangeAndKeyValue(text: string): string {
        let scopedRange: string = this.emptyStr;
        if (text.indexOf('[') > -1) {
            const namerangeValue: string = this.getTableRange(text);
            if (!isNullOrUndefined(namerangeValue)) {
                this.findNamedRange = true;
                text = namerangeValue;
            }
        }
        scopedRange = this.checkScopedRange(text);
        if (scopedRange !== 'NaN') {
            this.findNamedRange = true;
            text = scopedRange;
        } else {
            if (text.indexOf(this.sheetToken) > -1) {
                const sheet: CalcSheetFamilyItem = this.parent.getSheetFamilyItem(this.parent.grid);
                let value: string = text.split('"').join(this.emptyStr);
                value = value.substr(0, value.indexOf(this.sheetToken));
                if (sheet.sheetNameToToken.has(value.toUpperCase())) {
                    /* eslint-disable */
                    let sheetIndex: number = parseInt(sheet.sheetNameToToken.get(value.toUpperCase()).split(this.sheetToken).join(this.emptyStr));
                    // if (!ej.isNullOrUndefined(this.parentObject) && this.parentObject.pluginName == "ejSpreadsheet") {
                    //     var name = text.replace(value, this.parentObject.model.sheets[(sheetIndex + 1)].sheetInfo.text.toUpperCase()).split("'").join(this._string_empty);
                    //     if (this.getNamedRanges().length > 0 && this.getNamedRanges().contains(name.toUpperCase())) {
                    //         text = name;
                    //     }
                    // }
                    /* tslint-enable */
                }
            }
            if (this.parent.storedData.size > 0 && this.parent.storedData.has(text)) {
                text = 'A' + this.parent.colIndex(text);
            }
            if (this.parent.namedRanges.size > 0 && this.parent.namedRanges.has(text.toUpperCase())) {
                if (!isNullOrUndefined(this.parent.parentObject as any)) {
                    text = this.parse(this.parent.namedRanges.get(text.toUpperCase()));
                }
                else {
                    text = this.parse(this.parent.namedRanges.get(text.toUpperCase()));
                    text = this.parent.setTokensForSheets(text);
                    if (text.indexOf(this.fixedReference) > -1) {
                        text.split(this.fixedReference).join(this.emptyStr);
                    }
                    this.findNamedRange = true;
                }
            }

            if (this.findNamedRange) {
                if (text[0] !== '!' && text[0] !== 'q' && text[0] !== 'bq') {
                    text = this.parent.setTokensForSheets(text);
                    if (text.indexOf(this.fixedReference) > -1) {
                        text = text.split(this.fixedReference).join(this.emptyStr);
                    }
                }
            }
        }
        return text;
    }
    private getTableRange(text: string): string {
        text = text.replace(' ', this.emptyStr).toUpperCase();
        let name: string = text.replace(']', this.emptyStr).replace('#DATA', this.emptyStr);
        let tableName: string = name;
        if (name.indexOf(this.parent.getParseArgumentSeparator()) > -1) {
            tableName = name.substring(0, name.indexOf(this.parent.getParseArgumentSeparator())).replace('[', this.emptyStr);
            name = name.replace('[', this.emptyStr).replace(this.parent.getParseArgumentSeparator(), '_');
        }
        let range: string = this.emptyStr;
        return name.toUpperCase();
    }

    private findNextEndIndex(formula: string, loc: number): number {
        let count: number = 0;
        let l: number = loc;
        let found: boolean = false;
        while (!found && loc < formula.length) {
            if (formula[l] === '[') {
                count++;
            } else if (formula[l] === ']') {
                count--;
                if (count === 0) {
                    found = true;
                }
            }
            loc++;
        }
        loc = loc - l;
        return loc;
    };
}