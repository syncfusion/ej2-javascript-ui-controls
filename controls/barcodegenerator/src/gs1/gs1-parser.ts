/**
 * Private GS1 element-string parser and validator.
 * Does not encode a symbology, insert a leading FNC1, or look up locale text.
 *
 * @private
 */
import { GS1_CHARSET, Gs1AiRule, findGs1AiRule } from './gs1-ai-rules';

const GS: string = '\u001D';

/**
 * Approved shared error keys. Generators map these to locale text later.
 *
 * @private
 */
export type Gs1ErrorKey =
    | 'GS1InvalidFormat'
    | 'GS1UnsupportedAI'
    | 'GS1InvalidLength'
    | 'GS1InvalidCharacter'
    | 'GS1InvalidDate'
    | 'GS1InvalidCheckDigit'
    | 'GS1DuplicateAI'
    | 'GS1MissingRequiredAI';

/**
 * One parsed Application Identifier and its value, in supplied order.
 *
 * @private
 */
export interface Gs1Element {
    ai: string;
    value: string;
    variableLength: boolean;
}

/**
 * Successful parse. encodingData has no parentheses, GS, or FNC1.
 *
 * @private
 */
export interface Gs1Success {
    ok: true;
    elements: Gs1Element[];
    encodingData: string;
    humanReadableText: string;
    separatingFnc1After: number[];
}

/**
 * Failed parse. Invalid input is not repaired.
 *
 * @private
 */
export interface Gs1Failure {
    ok: false;
    error: Gs1ErrorKey;
}

/**
 * Result of parseGs1.
 *
 * @private
 */
export type Gs1ParseResult = Gs1Success | Gs1Failure;

interface ParsedElements {
    elements: Gs1Element[];
    error: Gs1ErrorKey;
}

/**
 * Parses parenthesized or raw GS1 data.
 * A leading "(" selects parenthesized form. Any other value is raw.
 * AIs stay in the supplied order. The input string is not mutated.
 *
 * @param {string} value - GS1 element string.
 * @returns {Gs1ParseResult} Normalized data, or one error key.
 * @private
 */
export function parseGs1(value: string): Gs1ParseResult {
    if (value === undefined || value === null || value.length === 0) {
        return fail('GS1InvalidFormat');
    }
    const parsed: ParsedElements = value.charAt(0) === '(' ? parseParenthesized(value) : parseRaw(value);
    if (parsed.error) {
        return fail(parsed.error);
    }
    const validationError: Gs1ErrorKey = validateElements(parsed.elements);
    if (validationError) {
        return fail(validationError);
    }
    return succeed(parsed.elements);
}

function fail(error: Gs1ErrorKey): Gs1Failure {
    return { ok: false, error: error };
}

function succeed(elements: Gs1Element[]): Gs1Success {
    let encodingData: string = '';
    let humanReadableText: string = '';
    const separatingFnc1After: number[] = [];
    let index: number;
    index = 0;
    for (const element of elements) {
        encodingData += element.ai + element.value;
        humanReadableText += '(' + element.ai + ')' + element.value;
        if (element.variableLength && index < elements.length - 1) {
            separatingFnc1After.push(index);
        }
        index++;
    }
    return {
        ok: true,
        elements: elements,
        encodingData: encodingData,
        humanReadableText: humanReadableText,
        separatingFnc1After: separatingFnc1After
    };
}

function parseParenthesized(value: string): ParsedElements {
    const elements: Gs1Element[] = [];
    let index: number = 0;
    while (index < value.length) {
        if (value.charAt(index) !== '(') {
            return { elements: elements, error: 'GS1InvalidFormat' };
        }
        const close: number = value.indexOf(')', index + 1);
        if (close < 0) {
            return { elements: elements, error: 'GS1InvalidFormat' };
        }
        const ai: string = value.substring(index + 1, close);
        if (!isAiToken(ai)) {
            return { elements: elements, error: 'GS1InvalidFormat' };
        }
        const rule: Gs1AiRule = findGs1AiRule(ai);
        if (!rule) {
            return { elements: elements, error: 'GS1UnsupportedAI' };
        }
        const read: ValueRead = readParenthesizedValue(value, close + 1);
        if (read.error) {
            return { elements: elements, error: read.error };
        }
        const lengthError: Gs1ErrorKey = checkValueLength(rule, read.value);
        if (lengthError) {
            return { elements: elements, error: lengthError };
        }
        elements.push(toElement(rule, read.value));
        index = read.next;
    }
    if (elements.length === 0) {
        return { elements: elements, error: 'GS1InvalidFormat' };
    }
    return { elements: elements, error: undefined };
}

interface ValueRead {
    value: string;
    next: number;
    error: Gs1ErrorKey;
}

function readParenthesizedValue(value: string, start: number): ValueRead {
    let collected: string = '';
    let index: number = start;
    while (index < value.length) {
        const char: string = value.charAt(index);
        if (char === ' ' || char === GS) {
            return { value: collected, next: index, error: 'GS1InvalidFormat' };
        }
        if (char === '\\') {
            const escaped: string = index + 1 < value.length ? value.charAt(index + 1) : '';
            if (escaped !== '(' && escaped !== ')') {
                return { value: collected, next: index, error: 'GS1InvalidFormat' };
            }
            collected += escaped;
            index += 2;
            continue;
        }
        if (char === '(') {
            break;
        }
        collected += char;
        index++;
    }
    return { value: collected, next: index, error: undefined };
}

function parseRaw(value: string): ParsedElements {
    const elements: Gs1Element[] = [];
    let index: number = 0;
    while (index < value.length) {
        if (value.charAt(index) === GS) {
            return { elements: elements, error: 'GS1InvalidFormat' };
        }
        const resolved: ResolvedAi = resolveRawAi(value, index);
        if (resolved.error) {
            return { elements: elements, error: resolved.error };
        }
        const rule: Gs1AiRule = resolved.rule;
        const valueStart: number = index + rule.ai.length;
        let fieldValue: string;
        let next: number;
        if (rule.fixedLength !== null) {
            if (value.length - valueStart < rule.fixedLength) {
                return { elements: elements, error: 'GS1InvalidLength' };
            }
            fieldValue = value.substring(valueStart, valueStart + rule.fixedLength);
            next = valueStart + rule.fixedLength;
        } else {
            const separator: number = value.indexOf(GS, valueStart);
            if (separator < 0) {
                fieldValue = value.substring(valueStart);
                next = value.length;
            } else if (separator + 1 >= value.length) {
                return { elements: elements, error: 'GS1InvalidFormat' };
            } else {
                fieldValue = value.substring(valueStart, separator);
                next = separator + 1;
            }
        }
        const lengthError: Gs1ErrorKey = checkValueLength(rule, fieldValue);
        if (lengthError) {
            return { elements: elements, error: lengthError };
        }
        elements.push(toElement(rule, fieldValue));
        index = next;
    }
    if (elements.length === 0) {
        return { elements: elements, error: 'GS1InvalidFormat' };
    }
    return { elements: elements, error: undefined };
}

interface ResolvedAi {
    rule: Gs1AiRule;
    error: Gs1ErrorKey;
}

function resolveRawAi(value: string, index: number): ResolvedAi {
    const remaining: number = value.length - index;
    if (remaining < 2) {
        return { rule: undefined, error: 'GS1InvalidFormat' };
    }
    const lengths: number[] = [4, 3, 2];
    for (const length of lengths) {
        if (remaining < length) {
            continue;
        }
        const token: string = value.substring(index, index + length);
        if (!isAiToken(token)) {
            continue;
        }
        const rule: Gs1AiRule = findGs1AiRule(token);
        if (rule) {
            return { rule: rule, error: undefined };
        }
    }
    const shortest: number = remaining >= 2 ? 2 : remaining;
    const head: string = value.substring(index, index + shortest);
    if (!isAiToken(head)) {
        return { rule: undefined, error: 'GS1InvalidFormat' };
    }
    return { rule: undefined, error: 'GS1UnsupportedAI' };
}

function isAiToken(ai: string): boolean {
    if (ai.length < 2 || ai.length > 4) {
        return false;
    }
    let index: number;
    for (index = 0; index < ai.length; index++) {
        const code: number = ai.charCodeAt(index);
        if (code < 48 || code > 57) {
            return false;
        }
    }
    return true;
}

function checkValueLength(rule: Gs1AiRule, fieldValue: string): Gs1ErrorKey {
    if (rule.fixedLength !== null) {
        return fieldValue.length === rule.fixedLength ? undefined : 'GS1InvalidLength';
    }
    if (fieldValue.length < 1 || fieldValue.length > rule.maxLength) {
        return 'GS1InvalidLength';
    }
    return undefined;
}

function toElement(rule: Gs1AiRule, fieldValue: string): Gs1Element {
    return {
        ai: rule.ai,
        value: fieldValue,
        variableLength: rule.fixedLength === null
    };
}

function validateElements(elements: Gs1Element[]): Gs1ErrorKey {
    const seen: string[] = [];
    let hasGtin: boolean = false;
    let hasAlone: boolean = false;
    let requiresGtin: boolean = false;
    for (const element of elements) {
        if (containsAi(seen, element.ai)) {
            return 'GS1DuplicateAI';
        }
        seen.push(element.ai);
        const rule: Gs1AiRule = findGs1AiRule(element.ai);
        const characterError: Gs1ErrorKey = validateCharacters(rule, element.value);
        if (characterError) {
            return characterError;
        }
        if (rule.date && !isValidYyMmDd(element.value)) {
            return 'GS1InvalidDate';
        }
        if (rule.checkDigit && !isValidModulo10(element.value)) {
            return 'GS1InvalidCheckDigit';
        }
        if (element.ai === '01') {
            hasGtin = true;
        }
        if (rule.mustBeAlone) {
            hasAlone = true;
        }
        if (rule.requiresGtin) {
            requiresGtin = true;
        }
    }
    if (hasAlone && elements.length !== 1) {
        return 'GS1MissingRequiredAI';
    }
    if (requiresGtin && !hasGtin) {
        return 'GS1MissingRequiredAI';
    }
    return undefined;
}

function containsAi(seen: string[], ai: string): boolean {
    for (const seenAi of seen) {
        if (seenAi === ai) {
            return true;
        }
    }
    return false;
}

function validateCharacters(rule: Gs1AiRule, fieldValue: string): Gs1ErrorKey {
    const allowed: string = rule.charset === 'digit' ? '0123456789' : GS1_CHARSET;
    let index: number;
    for (index = 0; index < fieldValue.length; index++) {
        if (allowed.indexOf(fieldValue.charAt(index)) < 0) {
            return 'GS1InvalidCharacter';
        }
    }
    return undefined;
}

/**
 * GS1 modulo 10. Weights 3 and 1 alternate from the right, excluding the check digit.
 * The supplied digit is compared and never replaced.
 *
 * @param {string} digits - Value including the check digit.
 * @returns {boolean} Whether the check digit matches.
 * @private
 */
function isValidModulo10(digits: string): boolean {
    let sum: number = 0;
    let weight: number = 3;
    let index: number;
    for (index = digits.length - 2; index >= 0; index--) {
        sum += (digits.charCodeAt(index) - 48) * weight;
        weight = weight === 3 ? 1 : 3;
    }
    const expected: number = (10 - (sum % 10)) % 10;
    return expected === digits.charCodeAt(digits.length - 1) - 48;
}

/**
 * YYMMDD. Day 00 is allowed. YY maps to 2000 + YY for the leap-day rule.
 *
 * @param {string} digits - Six date digits.
 * @returns {boolean} Whether the date is valid.
 * @private
 */
function isValidYyMmDd(digits: string): boolean {
    const year: number = (digits.charCodeAt(0) - 48) * 10 + (digits.charCodeAt(1) - 48);
    const month: number = (digits.charCodeAt(2) - 48) * 10 + (digits.charCodeAt(3) - 48);
    const day: number = (digits.charCodeAt(4) - 48) * 10 + (digits.charCodeAt(5) - 48);
    if (month < 1 || month > 12 || day < 0) {
        return false;
    }
    if (day === 0) {
        return true;
    }
    const lengths: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let lastDay: number = lengths[month - 1];
    if (month === 2 && year % 4 === 0) {
        lastDay = 29;
    }
    return day <= lastDay;
}
