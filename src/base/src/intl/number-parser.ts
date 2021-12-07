import { NumberFormatOptions } from '../internationalization';
import { extend, isNullOrUndefined, isBlazor, getValue } from '../util';
import { ParserBase as parser, NumericOptions } from './parser-base';
import { IntlBase as base } from './intl-base';
const parseRegex: RegExp = /^([^0-9]*)(([0-9,]*[0-9]+)(\.[0-9]+)?)([Ee][+-]?[0-9]+)?([^0-9]*)$/;
const groupRegex: RegExp = /,/g;

const keys: string[] = ['minusSign', 'infinity'];
/**
 * interface for Numeric Formatting Parts
 */
export interface NumericParts {
    symbolRegex?: RegExp;
    nData?: base.NegativeData;
    pData?: base.NegativeData;
    infinity?: string;
    type?: string;
    fractionDigits?: number;
    isAccount?: boolean;
    custom?: boolean;
    maximumFractionDigits?: number;
}
/**
 * interface for numeric parse options
 */
interface NumberParseOptions {
    parseRegex: string;
    numbericMatcher: Object;
}


/**
 * Module for Number Parser.
 *
 * @private
 */
export class NumberParser {
    /**
     * Returns the parser function for given skeleton.
     *
     * @param {string} culture -  Specifies the culture name to be which formatting.
     * @param {NumberFormatOptions} option - Specific the format in which number  will parsed.
     * @param {Object} cldr - Specifies the global cldr data collection.
     * @returns {Function} ?
     */
    public static numberParser(culture: string, option: NumberFormatOptions, cldr: Object): Function {
        const dependable: base.Dependables = base.getDependables(cldr, culture, '', true);
        const parseOptions: NumericParts = { custom: true };
        let numOptions: NumericOptions;
        if ((base.formatRegex.test(option.format)) || !(option.format)) {
            extend(parseOptions, base.getProperNumericSkeleton(option.format || 'N'));
            parseOptions.custom = false;
            if (!parseOptions.fractionDigits) {
                if (option.maximumFractionDigits) {
                    parseOptions.maximumFractionDigits = option.maximumFractionDigits;
                }
            }
        } else {
            extend(parseOptions, base.customFormat(option.format, null, null));
        }
        const numbers: Object = getValue('numbers', dependable.parserObject);
        // eslint-disable-next-line
        numOptions = parser.getCurrentNumericOptions(dependable.parserObject, parser.getNumberingSystem(cldr), true, isBlazor());
        parseOptions.symbolRegex = parser.getSymbolRegex(Object.keys(numOptions.symbolMatch));
        // eslint-disable-next-line
        parseOptions.infinity = (<any>numOptions).symbolNumberSystem[keys[1]];
        let symbolpattern: string;
        if (!isBlazor()) {
            symbolpattern = base.getSymbolPattern(
                parseOptions.type, numOptions.numberSystem, dependable.numericObject, parseOptions.isAccount);
            if (symbolpattern) {
                symbolpattern = symbolpattern.replace(/\u00A4/g, base.defaultCurrency);
                const split: string[] = symbolpattern.split(';');
                parseOptions.nData = base.getFormatData(split[1] || '-' + split[0], true, '');
                parseOptions.pData = base.getFormatData(split[0], true, '');
            }
        } else {
            parseOptions.nData = extend({}, {}, getValue(parseOptions.type + 'nData', numbers));
            parseOptions.pData = extend({}, {}, getValue(parseOptions.type + 'pData', numbers));
            if (parseOptions.type === 'currency' && option.currency) {
                base.replaceBlazorCurrency([parseOptions.pData, parseOptions.nData], getValue('currencySymbol', numbers), option.currency);
            }
        }

        return (value: string): number => {
            return this.getParsedNumber(value, parseOptions, numOptions);
        };
    }
    /**
     * Returns parsed number for the provided formatting options
     *
     * @param {string} value ?
     * @param {NumericParts} options ?
     * @param {NumericOptions} numOptions ?
     * @returns {number} ?
     */
    private static getParsedNumber(value: string, options: NumericParts, numOptions: NumericOptions): number {
        let isNegative: boolean;
        let isPercent: boolean;
        let tempValue: string;
        let lead: string;
        let end: string;
        let ret: number;
        if (value.indexOf(options.infinity) !== -1) {
            return Infinity;
        } else {
            value = parser.convertValueParts(value, options.symbolRegex, numOptions.symbolMatch);
            value = parser.convertValueParts(value, numOptions.numberParseRegex, numOptions.numericPair);
            value = value.indexOf('-') !== -1 ? value.replace('-.','-0.') : value;
            if (value.indexOf('.') === 0) {
                value = '0' + value;
            }
            const matches: string[] = value.match(parseRegex);
            if (isNullOrUndefined(matches)) {
                return NaN;
            }
            lead = matches[1];
            tempValue = matches[2];
            const exponent: string = matches[5];
            end = matches[6];
            isNegative = options.custom ? ((lead === options.nData.nlead) && (end === options.nData.nend)) :
                ((lead.indexOf(options.nData.nlead) !== -1) && (end.indexOf(options.nData.nend) !== -1));
            isPercent = isNegative ?
                options.nData.isPercent :
                options.pData.isPercent;
            tempValue = tempValue.replace(groupRegex, '');
            if (exponent) {
                tempValue += exponent;
            }
            ret = +tempValue;
            if (options.type === 'percent' || isPercent) {
                ret = ret / 100;
            }
            if (options.custom || options.fractionDigits) {
                ret = parseFloat(ret.toFixed(options.custom ?
                    (isNegative ? options.nData.maximumFractionDigits : options.pData.maximumFractionDigits) : options.fractionDigits));
            }
            if (options.maximumFractionDigits) {
                ret = this.convertMaxFracDigits(tempValue, options, ret, isNegative);
            }
            if (isNegative) {
                ret *= -1;
            }
            return ret;
        }
    }
    private static convertMaxFracDigits(value: string, options: NumericParts, ret: number, isNegative: boolean): number {
        let decimalSplitValue: string[] = value.split('.');
        if (decimalSplitValue[1] && decimalSplitValue[1].length > options.maximumFractionDigits) {
            ret = +(ret.toFixed(options.custom ?
                (isNegative ? options.nData.maximumFractionDigits : options.pData.maximumFractionDigits) : options.maximumFractionDigits));
        }
        return ret;
    }
}
