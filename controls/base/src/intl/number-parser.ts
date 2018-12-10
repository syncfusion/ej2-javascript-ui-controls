import { NumberFormatOptions } from '../internationalization';
import { extend, isNullOrUndefined } from '../util';
import { ParserBase as parser, NumericOptions } from './parser-base';
import { IntlBase as base } from './intl-base';
const formatRegex: RegExp = /(^[ncpa]{1})([0-1]?[0-9]|20)?$/i;
const parseRegex: RegExp = /^([^0-9]*)(([0-9,]*[0-9]+)(\.[0-9]+)?)([Ee][+-]?[0-9]+)?([^0-9]*)$/;
const groupRegex: RegExp = /,/g;
const latnDecimalRegex: RegExp = /^[0-9]*(\.[0-9]+)?$/;

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
 * @private
 */
export class NumberParser {
    /**
     * Returns the parser function for given skeleton.
     * @param {string} -  Specifies the culture name to be which formatting.
     * @param {NumberFormatOptions} - Specific the format in which number  will parsed.
     * @param {cldr} - Specifies the global cldr data collection.
     * @return Function.  
     */
    public static numberParser(culture: string, option: NumberFormatOptions, cldr: Object): Function {
        let dependable: base.Dependables = base.getDependables(cldr, culture, '', true);
        let parseOptions: NumericParts = { custom: true };
        let numOptions: NumericOptions;
        if ((base.formatRegex.test(option.format)) || !(option.format)) {
            extend(parseOptions, base.getProperNumericSkeleton(option.format || 'N'));
            parseOptions.custom = false;
        } else {
            extend(parseOptions, base.customFormat(option.format, null, null));
        }
        numOptions = parser.getCurrentNumericOptions(dependable.parserObject, parser.getNumberingSystem(cldr), true);
        parseOptions.symbolRegex = parser.getSymbolRegex(Object.keys(numOptions.symbolMatch));
        // tslint:disable-next-line:no-any
        parseOptions.infinity = (<any>numOptions).symbolNumberSystem[keys[1]];
        let symbolpattern: string = base.getSymbolPattern(
            parseOptions.type, numOptions.numberSystem, dependable.numericObject, parseOptions.isAccount);
        if (symbolpattern) {
            symbolpattern = symbolpattern.replace(/\u00A4/g, base.defaultCurrency);
            let split: string[] = symbolpattern.split(';');
            parseOptions.nData = base.getFormatData(split[1] || '-' + split[0], true, '');
            parseOptions.pData = base.getFormatData(split[0], true, '');
        }
        return (value: string): number => {
            return this.getParsedNumber(value, parseOptions, numOptions);
        };
    }
    /**
     * Returns parsed number for the provided formatting options
     * @param {string} value 
     * @param {NumericParts} options 
     * @param {NumericOptions} numOptions 
     * @returns {number}
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
            if (value.indexOf('.') === 0) {
                value = '0' + value;
            }
            let matches: string[] = value.match(parseRegex);
            if (isNullOrUndefined(matches)) {
                return NaN;
            }
            lead = matches[1];
            tempValue = matches[2];
            let exponent: string = matches[5];
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
            if (isNegative) {
                ret *= -1;
            }
            return ret;
        }
    }
}
