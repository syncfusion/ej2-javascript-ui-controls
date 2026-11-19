/**
 * GS1 Application Identifier rules for the private shared parser.
 * Adding an AI is a table change. This file does not parse or validate input.
 *
 * @private
 */

/**
 * Digits, upper- and lower-case letters, and the GS1 symbols
 * ! " % & ' ( ) * + , - . / : ; < = > ? _
 *
 * @private
 */
export const GS1_CHARSET: string =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!"%&\'()*+,-./:;<=>?_';

/**
 * One supported Application Identifier.
 *
 * @private
 */
export interface Gs1AiRule {
    ai: string;
    fixedLength: number | null;
    maxLength: number;
    charset: 'digit' | 'gs1';
    checkDigit: boolean;
    date: boolean;
    requiresGtin: boolean;
    mustBeAlone: boolean;
}

const GS1_AI_RULE_LIST: Gs1AiRule[] = [
    { ai: '00', fixedLength: 18, maxLength: 18, charset: 'digit', checkDigit: true, date: false, requiresGtin: false, mustBeAlone: true },
    { ai: '01', fixedLength: 14, maxLength: 14, charset: 'digit', checkDigit: true, date: false, requiresGtin: false, mustBeAlone: false },
    { ai: '10', fixedLength: null, maxLength: 20, charset: 'gs1', checkDigit: false, date: false, requiresGtin: true, mustBeAlone: false },
    { ai: '11', fixedLength: 6, maxLength: 6, charset: 'digit', checkDigit: false, date: true, requiresGtin: true, mustBeAlone: false },
    { ai: '15', fixedLength: 6, maxLength: 6, charset: 'digit', checkDigit: false, date: true, requiresGtin: true, mustBeAlone: false },
    { ai: '17', fixedLength: 6, maxLength: 6, charset: 'digit', checkDigit: false, date: true, requiresGtin: true, mustBeAlone: false },
    { ai: '21', fixedLength: null, maxLength: 20, charset: 'gs1', checkDigit: false, date: false, requiresGtin: true, mustBeAlone: false }
];

let weightIndex: number;
for (weightIndex = 0; weightIndex <= 5; weightIndex++) {
    GS1_AI_RULE_LIST.push({
        ai: '310' + weightIndex,
        fixedLength: 6,
        maxLength: 6,
        charset: 'digit',
        checkDigit: false,
        date: false,
        requiresGtin: true,
        mustBeAlone: false
    });
}
let priceIndex: number;
for (priceIndex = 0; priceIndex <= 9; priceIndex++) {
    GS1_AI_RULE_LIST.push({
        ai: '392' + priceIndex,
        fixedLength: null,
        maxLength: 15,
        charset: 'digit',
        checkDigit: false,
        date: false,
        requiresGtin: true,
        mustBeAlone: false
    });
}

/**
 * Finds a supported AI rule by the complete AI string.
 * 310 and 392 prefixes are not rules. 3106 is not a rule.
 *
 * @param {string} ai - Complete Application Identifier.
 * @returns {Gs1AiRule} The rule, or undefined.
 * @private
 */
export function findGs1AiRule(ai: string): Gs1AiRule {
    for (const rule of GS1_AI_RULE_LIST) {
        if (rule.ai === ai) {
            return rule;
        }
    }
    return undefined;
}
