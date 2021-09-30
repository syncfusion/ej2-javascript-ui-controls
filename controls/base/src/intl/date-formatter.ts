import { DateFormatOptions } from '../internationalization';
import { ParserBase as parser, NumberMapper } from './parser-base';
import { IntlBase as base } from './intl-base';
import { isUndefined, throwError, getValue, isBlazor } from '../util';
import { HijriParser } from '../hijri-parser';
import { isNullOrUndefined, extend } from '../util';
const abbreviateRegexGlobal: RegExp = /\/MMMMM|MMMM|MMM|a|LLLL|LLL|EEEEE|EEEE|E|K|cccc|ccc|WW|W|G+|z+/gi;
const standalone: string = 'stand-alone';
const weekdayKey: string[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const basicPatterns: string[] = ['short', 'medium', 'long', 'full'];
/**
 * Interface for Date Format Options Modules.
 *
 * @private
 */
export interface FormatOptions {
    month?: Object;
    weekday?: Object;
    pattern?: string;
    designator?: Object;
    timeZone?: base.TimeZoneOptions;
    era?: Object;
    hour12?: boolean;
    numMapper?: NumberMapper;
    dateSeperator?: string;
    isIslamic?: boolean;
    weekOfYear?: string;
}
const timeSetter: Object = {
    m: 'getMinutes',
    h: 'getHours',
    H: 'getHours',
    s: 'getSeconds',
    d: 'getDate',
    f: 'getMilliseconds'
};
export const datePartMatcher: { [key: string]: Object } = {
    'M': 'month',
    'd': 'day',
    'E': 'weekday',
    'c': 'weekday',
    'y': 'year',
    'm': 'minute',
    'h': 'hour',
    'H': 'hour',
    's': 'second',
    'L': 'month',
    'a': 'designator',
    'z': 'timeZone',
    'Z': 'timeZone',
    'G': 'era',
    'f': 'milliseconds'
};

const timeSeparator: string = 'timeSeparator';

/* tslint:disable no-any */
/**
 * Date Format is a framework provides support for date formatting.
 *
 * @private
 */
export class DateFormat {

    /**
     * Returns the formatter function for given skeleton.
     *
     * @param {string} culture -  Specifies the culture name to be which formatting.
     * @param {DateFormatOptions} option - Specific the format in which date  will format.
     * @param {Object} cldr - Specifies the global cldr data collection.
     * @returns {Function} ?
     */
    public static dateFormat(culture: string, option: DateFormatOptions, cldr: Object): Function {
        const dependable: base.Dependables = base.getDependables(cldr, culture, option.calendar);
        const numObject: Object = getValue('parserObject.numbers', dependable);
        const dateObject: Object = dependable.dateObject;
        const formatOptions: FormatOptions = { isIslamic: base.islamicRegex.test(option.calendar) };
        if (isBlazor() && option.isServerRendered) {
            option = base.compareBlazorDateFormats(option, culture);
        }
        let resPattern: string = option.format ||
            base.getResultantPattern(option.skeleton, dependable.dateObject, option.type, false, isBlazor() ? culture : '');
        formatOptions.dateSeperator = isBlazor() ? getValue('dateSeperator', dateObject) : base.getDateSeparator(dependable.dateObject);
        if (isUndefined(resPattern)) {
            throwError('Format options or type given must be invalid');
        } else {
            resPattern = base.ConvertDateToWeekFormat(resPattern);
            if (isBlazor()) {
                resPattern = resPattern.replace(/tt/, 'a');
            }
            formatOptions.pattern = resPattern;
            formatOptions.numMapper = isBlazor() ?
                extend({}, numObject) : parser.getNumberMapper(dependable.parserObject, parser.getNumberingSystem(cldr));
            const patternMatch: string[] = resPattern.match(abbreviateRegexGlobal) || [];
            for (const str of patternMatch) {
                const len: number = str.length;
                let char: string = str[0];
                if (char === 'K') {
                    char = 'h';
                }
                switch (char) {
                case 'E':
                case 'c':
                    if (isBlazor()) {
                        // eslint-disable-next-line
                        formatOptions.weekday = getValue('days.' + (base as any).monthIndex[len], dateObject);
                    } else {
                        // eslint-disable-next-line
                        formatOptions.weekday = (<any>dependable.dateObject)[base.days][standalone][(<any>base).monthIndex[len]];
                    }
                    break;
                case 'M':
                case 'L':
                    if (isBlazor()) {
                        // eslint-disable-next-line
                        formatOptions.month = getValue('months.' + (base as any).monthIndex[len], dateObject);
                    } else {
                        // eslint-disable-next-line
                        formatOptions.month = (<any>dependable.dateObject)[base.month][standalone][(<any>base.monthIndex)[len]];
                    }
                    break;
                case 'a':
                    formatOptions.designator = isBlazor() ?
                        getValue('dayPeriods', dateObject) : getValue('dayPeriods.format.wide', dateObject);
                    break;
                case 'G':
                    // eslint-disable-next-line
                    const eText: string = (len <= 3) ? 'eraAbbr' : (len === 4) ? 'eraNames' : 'eraNarrow';
                    formatOptions.era = isBlazor() ? getValue('eras', dateObject) : getValue('eras.' + eText, dependable.dateObject);
                    break;
                case 'z':
                    formatOptions.timeZone = getValue('dates.timeZoneNames', dependable.parserObject);
                    break;
                }
            }
        }
        return (value: Date): string => {
            if (isNaN(value.getDate())) {
                return null;
            }
            return this.intDateFormatter(value, formatOptions);
        };
    }
    /**
     * Returns formatted date string based on options passed.
     *
     * @param {Date} value ?
     * @param {FormatOptions} options ?
     * @returns {string} ?
     */
    private static intDateFormatter(value: Date, options: FormatOptions): string {
        const pattern: string = options.pattern;
        let ret: string = '';
        const matches: string[] = pattern.match(base.dateParseRegex);
        const dObject: base.DateObject = this.getCurrentDateValue(value, options.isIslamic);
        for (const match of matches) {
            const length: number = match.length;
            let char: string = match[0];
            if (char === 'K') {
                char = 'h';
            }
            let curval: number;
            let curvalstr: string = '';
            let isNumber: boolean;
            let processNumber: boolean;
            let curstr: string = '';
            switch (char) {
            case 'M':
            case 'L':
                curval = dObject.month;
                if (length > 2) {
                    // eslint-disable-next-line
                    ret += (<any>options.month)[curval];
                } else {
                    isNumber = true;
                }
                break;
            case 'E':
            case 'c':
                // eslint-disable-next-line
                ret += (<any>options.weekday)[weekdayKey[value.getDay()]];
                break;
            case 'H':
            case 'h':
            case 'm':
            case 's':
            case 'd':
            case 'f':
                isNumber = true;
                if (char === 'd') {
                    curval = dObject.date;
                } else if (char === 'f') {
                    isNumber = false;
                    processNumber = true;
                    // eslint-disable-next-line
                    curvalstr = (<any>value)[(<any>timeSetter)[char]]().toString();
                    curvalstr = curvalstr.substring(0, length);
                    const curlength: number = curvalstr.length;
                    if (length !== curlength) {
                        if (length > 3) {
                            continue;
                        }
                        for (let i: number = 0; i < length - curlength; i++) {
                            curvalstr = '0' + curvalstr.toString();
                        }
                    }
                    curstr += curvalstr;
                } else {
                    // eslint-disable-next-line
                    curval = (<any>value)[(<any>timeSetter)[char]]();
                }
                if (char === 'h') {
                    curval = curval % 12 || 12;
                }
                break;
            case 'y':
                processNumber = true;
                curstr += dObject.year;
                if (length === 2) {
                    curstr = curstr.substr(curstr.length - 2);
                }
                break;
            case 'a':
                // eslint-disable-next-line
                let desig: string = value.getHours() < 12 ? 'am' : 'pm';
                // eslint-disable-next-line
                ret += (<any>options).designator[desig];
                break;
            case 'G':
                // eslint-disable-next-line
                let dec: number = value.getFullYear() < 0 ? 0 : 1;
                // eslint-disable-next-line
                let retu: String = (<any>options).era[dec];
                if (isNullOrUndefined(retu)) {
                    // eslint-disable-next-line
                    retu = (<any>options).era[dec ? 0 : 1];
                }
                ret += retu || '';
                break;
            case '\'':
                ret += (match === '\'\'') ? '\'' : match.replace(/'/g, '');
                break;
            case 'z':
                // eslint-disable-next-line
                let timezone: number = value.getTimezoneOffset();
                // eslint-disable-next-line
                let pattern: string = (length < 4) ? '+H;-H' : options.timeZone.hourFormat;
                pattern = pattern.replace(/:/g, options.numMapper.timeSeparator);
                if (timezone === 0) {
                    ret += options.timeZone.gmtZeroFormat;
                } else {
                    processNumber = true;
                    curstr = this.getTimeZoneValue(timezone, pattern);
                }
                curstr = options.timeZone.gmtFormat.replace(/\{0\}/, curstr);
                break;
            case ':':
                // eslint-disable-next-line
                ret += (<any>options).numMapper.numberSymbols[timeSeparator];
                break;
            case '/':
                ret += options.dateSeperator;
                break;
            case 'W':
                isNumber = true;
                curval = base.getWeekOfYear(value);
                break;
            default:
                ret += match;
            }
            if (isNumber) {
                processNumber = true;
                curstr = this.checkTwodigitNumber(curval, length);
            }
            if (processNumber) {
                ret += parser.convertValueParts(curstr, base.latnParseRegex, options.numMapper.mapper);
            }
        }
        return ret;
    }
    private static getCurrentDateValue(value: Date, isIslamic?: boolean): base.DateObject {
        if (isIslamic) {
            return HijriParser.getHijriDate(value);
        }
        return { year: value.getFullYear(), month: value.getMonth() + 1, date: value.getDate() };
    }
    /**
     * Returns two digit numbers for given value and length
     *
     * @param {number} val ?
     * @param {number} len ?
     * @returns {string} ?
     */
    private static checkTwodigitNumber(val: number, len: number): string {
        const ret: string = val + '';
        if (len === 2 && ret.length !== 2) {
            return '0' + ret;
        }
        return ret;
    }
    /**
     * Returns the value of the Time Zone.
     *
     * @param {number} tVal ?
     * @param {string} pattern ?
     * @returns {string} ?
     * @private
     */
    public static getTimeZoneValue(tVal: number, pattern: string): string {
        const splt: string[] = pattern.split(';');
        let curPattern: string = splt[tVal > 0 ? 1 : 0];
        const no: number = Math.abs(tVal);
        return curPattern = curPattern.replace(/HH?|mm/g, (str: string): string => {
            const len: number = str.length;
            const ishour: boolean = str.indexOf('H') !== -1;
            return this.checkTwodigitNumber(Math.floor(ishour ? (no / 60) : (no % 60)), len);
        }
        );

    }
}
