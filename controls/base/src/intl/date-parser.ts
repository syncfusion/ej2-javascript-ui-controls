import { DateFormatOptions } from '../internationalization';
import { IntlBase as base } from './intl-base';
import { ParserBase as parser, NumericOptions, NumberMapper } from './parser-base';
import { isUndefined, throwError, getValue, isNullOrUndefined, isBlazor } from '../util';
import { datePartMatcher } from './date-formatter';
import { HijriParser } from '../hijri-parser';
const number: string = 'numbers';
const defNoSystem: string = 'defaultNumberingSystem';
const noSystem: string = 'numberingSystem';
const standalone: string = 'stand-alone';
const curWeekDay: string = 'curWeekDay';
const latnRegex: RegExp = /^[0-9]*$/;
const abbreviateRegex: RegExp = /\/MMMMM|MMMM|MMM|a|LLLL|LLL|EEEEE|EEEE|E|ccc/;
const timeSetter: Object = {
    minute: 'setMinutes',
    hour: 'setHours',
    second: 'setSeconds',
    day: 'setDate',
    month: 'setMonth',
    milliseconds: 'setMilliseconds'
};
/**
 * Interface for date parsing options
 */
interface ParseOptions {
    month?: Object;
    weekday?: string[];
    pattern?: string;
    designator?: Object;
    timeZone?: base.TimeZoneOptions;
    era?: Object;
    hour12?: boolean;
    parserRegex?: RegExp;
    evalposition?: { [key: string]: ValuePosition };
    isIslamic?: boolean;
    culture?: string;
}

/**
 * Interface for the date options
 */
interface DateParts {
    month?: number;
    day?: number;
    year?: number;
    hour?: number;
    minute?: number;
    second?: number;
    designator?: string;
    timeZone?: number;
    hour12?: boolean;
}
const month: string = 'months';
/**
 * Interface for value position
 */
interface ValuePosition {
    isNumber: boolean;
    pos: number;
    hourOnly?: boolean;
}
/* tslint:disable no-any */
/**
 * Date Parser.
 * @private
 */

export class DateParser {
    /**
     * Returns the parser function for given skeleton.
     * @param {string} -  Specifies the culture name to be which formatting.
     * @param {DateFormatOptions} - Specific the format in which string date  will be parsed.
     * @param {cldr} - Specifies the global cldr data collection.
     *  @return Function.  
     */
    // tslint:disable-next-line:max-func-body-length
    public static dateParser(culture: string, option: DateFormatOptions, cldr: Object): Function {
        let dependable: base.Dependables = base.getDependables(cldr, culture, option.calendar);
        // tslint:disable-next-line
        let numOptions: NumericOptions = parser.getCurrentNumericOptions(dependable.parserObject, parser.getNumberingSystem(cldr), false, isBlazor());
        let parseOptions: ParseOptions = {};
        if (isBlazor() && option.isServerRendered) {
            option = base.compareBlazorDateFormats(option, culture);
        }
        let resPattern: string = option.format ||
            base.getResultantPattern(option.skeleton, dependable.dateObject, option.type, false, isBlazor() ? culture : '');
        let regexString: string = '';
        let hourOnly: boolean;
        if (isUndefined(resPattern)) {
            throwError('Format options or type given must be invalid');
        } else {
            resPattern = base.ConvertDateToWeekFormat(resPattern);
            parseOptions = { isIslamic: base.islamicRegex.test(option.calendar), pattern: resPattern, evalposition: {}, culture: culture };
            let patternMatch: string[] = resPattern.match(base.dateParseRegex) || [];
            let length: number = patternMatch.length;
            let gmtCorrection: number = 0;
            let zCorrectTemp: number = 0;
            let isgmtTraversed: boolean = false;
            let nRegx: string = numOptions.numericRegex;
            // tslint:disable-next-line
            let numMapper: NumberMapper = isBlazor() ? (dependable.parserObject as any).numbers :
                parser.getNumberMapper(dependable.parserObject, parser.getNumberingSystem(cldr));
            for (let i: number = 0; i < length; i++) {
                let str: string = patternMatch[i];
                let len: number = str.length;
                let char: string = (str[0] === 'K') ? 'h' : str[0];
                let isNumber: boolean;
                let canUpdate: boolean;
                // tslint:disable-next-line
                let charKey: any = datePartMatcher[char];
                let optional: string = (len === 2) ? '' : '?';
                if (isgmtTraversed) {
                    gmtCorrection = zCorrectTemp;
                    isgmtTraversed = false;
                }
                switch (char) {
                    case 'E':
                    case 'c':
                        // tslint:disable
                        let weekData: Object;
                        if (isBlazor()) {
                            weekData = getValue('days.' + (base as any).monthIndex[len], dependable.dateObject);
                        } else {
                            weekData = (<any>dependable.dateObject)[base.days][standalone][(<any>base).monthIndex[len]];
                        }
                        let weekObject: Object = parser.reverseObject(weekData);
                        // tslint:enable
                        regexString += '(' + Object.keys(weekObject).join('|') + ')';
                        break;
                    case 'M':
                    case 'L':
                    case 'd':
                    case 'm':
                    case 's':
                    case 'h':
                    case 'H':
                    case 'f':
                        canUpdate = true;
                        if ((char === 'M' || char === 'L') && len > 2) {
                            let monthData: Object;
                            if (isBlazor()) {
                                /* tslint:disable no-any */
                                monthData = getValue('months.' + (base as any).monthIndex[len], dependable.dateObject);
                            } else {
                                /* tslint:disable no-any */
                                monthData = (<any>dependable).dateObject[month][standalone][(<any>base).monthIndex[len]];
                            }
                            // tslint:disable-next-line
                            (<any>parseOptions)[charKey] = parser.reverseObject(monthData);
                            /* tslint:disable no-any */
                            regexString += '(' + Object.keys((<any>parseOptions)[charKey]).join('|') + ')';
                        } else if (char === 'f') {
                            if (len > 3) {
                                continue;
                            }
                            isNumber = true;
                            regexString += '(' + nRegx + nRegx + '?' + nRegx + '?' + ')';
                        } else {
                            isNumber = true;
                            regexString += '(' + nRegx + nRegx + optional + ')';
                        }
                        if (char === 'h') {
                            parseOptions.hour12 = true;
                        }
                        break;
                    case 'W':
                        let opt: string = len === 1 ? '?' : '';
                        regexString += '(' + nRegx + opt + nRegx + ')';
                        break;
                    case 'y':
                        canUpdate = isNumber = true;
                        if (len === 2) {
                            regexString += '(' + nRegx + nRegx + ')';
                        } else {
                            regexString += '(' + nRegx + '{' + len + ',})';
                        }
                        break;
                    case 'a':
                        canUpdate = true;
                        let periodValur: Object = isBlazor() ?
                            getValue('dayPeriods', dependable.dateObject) :
                            getValue('dayPeriods.format.wide', dependable.dateObject);
                        (<any>parseOptions)[charKey] = parser.reverseObject(periodValur);
                        regexString += '(' + Object.keys((<any>parseOptions)[charKey]).join('|') + ')';
                        break;
                    case 'G':
                        canUpdate = true;
                        let eText: string = (len <= 3) ? 'eraAbbr' : (len === 4) ? 'eraNames' : 'eraNarrow';
                        (<any>parseOptions)[charKey] = parser.reverseObject(isBlazor() ?
                            getValue('eras', dependable.dateObject) : getValue('eras.' + eText, dependable.dateObject));
                        regexString += '(' + Object.keys((<any>parseOptions)[charKey]).join('|') + '?)';
                        break;
                    case 'z':
                        let tval: number = new Date().getTimezoneOffset();
                        canUpdate = (tval !== 0);
                        (<any>parseOptions)[charKey] = getValue('dates.timeZoneNames', dependable.parserObject);
                        let tzone: base.TimeZoneOptions = (<any>parseOptions)[charKey];
                        hourOnly = (len < 4);
                        let hpattern: string = hourOnly ? '+H;-H' : tzone.hourFormat;
                        hpattern = hpattern.replace(/:/g, numMapper.timeSeparator);
                        regexString += '(' + this.parseTimeZoneRegx(hpattern, tzone, nRegx) + ')?';
                        isgmtTraversed = true;
                        zCorrectTemp = hourOnly ? 6 : 12;
                        break;
                    case '\'':
                        let iString: string = str.replace(/\'/g, '');
                        regexString += '(' + iString + ')?';
                        break;
                    default:
                        regexString += '([\\D])';
                        break;
                }
                if (canUpdate) {
                    parseOptions.evalposition[charKey] = { isNumber: isNumber, pos: i + 1 + gmtCorrection, hourOnly: hourOnly };
                }
                if (i === length - 1 && !isNullOrUndefined(regexString)) {
                    parseOptions.parserRegex = new RegExp('^' + regexString + '$', 'i');
                }
            }
        }
        return (value: string): Date => {
            let parsedDateParts: DateParts = this.internalDateParse(value, parseOptions, numOptions);
            if (isNullOrUndefined(parsedDateParts) || !Object.keys(parsedDateParts).length) {
                return null;
            }
            if (parseOptions.isIslamic) {
                let dobj: base.DateObject = {};
                let tYear: number = parsedDateParts.year;
                let tDate: number = parsedDateParts.day;
                let tMonth: number = parsedDateParts.month;
                let ystrig: string = tYear ? (tYear + '') : '';
                let is2DigitYear: boolean = (ystrig.length === 2);
                if (!tYear || !tMonth || !tDate || is2DigitYear) {
                    dobj = HijriParser.getHijriDate(new Date());
                }
                if (is2DigitYear) {
                    tYear = parseInt((dobj.year + '').slice(0, 2) + ystrig, 10);
                }
                // tslint:disable-next-line
                let dateObject: Date = HijriParser.toGregorian(
                    tYear || dobj.year, tMonth || dobj.month, tDate || dobj.date);
                parsedDateParts.year = dateObject.getFullYear();
                parsedDateParts.month = dateObject.getMonth() + 1;
                parsedDateParts.day = dateObject.getDate();

            }
            return this.getDateObject(parsedDateParts);
        };
    }
    /* tslint:disable */
    /**
     * Returns date object for provided date options
     * @param {DateParts} options 
     * @param {Date} value 
     * @returns {Date}
     */
    private static getDateObject(options: DateParts, value?: Date): Date {
        let res: Date = value || new Date();
        res.setMilliseconds(0);
        let tKeys: string[] = ['hour', 'minute', 'second', 'milliseconds', 'month', 'day'];
        let y: number = options.year;
        let desig: string = options.designator;
        let tzone: number = options.timeZone;
        if (!isUndefined(y)) {
            let len: number = (y + '').length;
            if (len <= 2) {
                let century: number = Math.floor(res.getFullYear() / 100) * 100;
                y += century;
            }
            res.setFullYear(y);
        }
        for (let key of tKeys) {
            let tValue: number = (<any>options)[key];
            if (isUndefined(tValue) && key === "day") {
                res.setDate(1);
            }
            if (!isUndefined(tValue)) {
                if (key === 'month') {
                    tValue -= 1;
                    if (tValue < 0 || tValue > 11) {
                        return new Date('invalid');
                    }
                    let pDate: number = res.getDate();
                    res.setDate(1);
                    (<any>res)[(<any>timeSetter)[key]](tValue);
                    let lDate: number = new Date(res.getFullYear(), tValue + 1, 0).getDate();
                    res.setDate(pDate < lDate ? pDate : lDate);
                } else {
                    if (key === 'day') {
                        let lastDay: number = new Date(res.getFullYear(), res.getMonth() + 1, 0).getDate();
                        if ((tValue < 1 || tValue > lastDay)) {
                            return null;
                        }
                    }
                    (<any>res)[(<any>timeSetter)[key]](tValue);
                }
            }
        }
        if (!isUndefined(desig)) {
            let hour: number = res.getHours();
            if (desig === 'pm') {
                res.setHours(hour + (hour === 12 ? 0 : 12));
            } else if (hour === 12) {
                res.setHours(0);
            }
        }
        if (!isUndefined(tzone)) {
            let tzValue: number = tzone - res.getTimezoneOffset();
            if (tzValue !== 0) {
                res.setMinutes(res.getMinutes() + tzValue);
            }
        }
        return res;
    }
    /**
     * Returns date parsing options for provided value along with parse and numeric options
     * @param {string} value 
     * @param {ParseOptions} parseOptions 
     * @param {NumericOptions} num 
     * @returns {DateParts}
     */
    private static internalDateParse(value: string, parseOptions: ParseOptions, num: NumericOptions): DateParts {
        let matches: string[] = value.match(parseOptions.parserRegex);
        let retOptions: DateParts = { 'hour': 0, 'minute': 0, 'second': 0 };
        let nRegx: string = num.numericRegex;
        if (isNullOrUndefined(matches)) {
            return null;
        } else {
            let props: string[] = Object.keys(parseOptions.evalposition);
            for (let prop of props) {
                let curObject: ValuePosition = parseOptions.evalposition[prop];
                let matchString: string = matches[curObject.pos];
                if (curObject.isNumber) {
                    (<any>retOptions)[prop] = this.internalNumberParser(matchString, num);
                } else {
                    if (prop === 'timeZone' && !isUndefined(matchString)) {
                        let pos: number = curObject.pos;
                        let val: number;
                        let tmatch: string = matches[pos + 1];
                        let flag: boolean = !isUndefined(tmatch);
                        if (curObject.hourOnly) {
                            val = this.getZoneValue(flag, tmatch, matches[pos + 4], num) * 60;
                        } else {
                            val = this.getZoneValue(flag, tmatch, matches[pos + 7], num) * 60;
                            val += this.getZoneValue(flag, matches[pos + 4], matches[pos + 10], num);

                        }
                        if (!isNullOrUndefined(val)) {
                            retOptions[prop] = val;
                        }
                    } else {
                        matchString = ((prop === 'month') && (!(<any>parseOptions).isIslamic) && ((<any>parseOptions).culture === 'en' || (<any>parseOptions).culture === 'en-GB' || (<any>parseOptions).culture === 'en-US')) 
                        ? matchString[0].toUpperCase() + matchString.substring(1).toLowerCase() : matchString;
                        (<any>retOptions)[prop] = (<any>parseOptions)[prop][matchString];
                    }
                }
            }
            if (parseOptions.hour12) {
                retOptions.hour12 = true;
            }
        }
        return retOptions;
    }
    /**
     * Returns parsed number for provided Numeric string and Numeric Options
     * @param {string} value 
     * @param {NumericOptions} option 
     * @returns {number}
     */
    private static internalNumberParser(value: string, option: NumericOptions): number {
        value = parser.convertValueParts(value, option.numberParseRegex, option.numericPair);
        if (latnRegex.test(value)) {
            return +value;
        }
        return null;
    }
    /**
     * Returns parsed time zone RegExp for provided hour format and time zone 
     * @param {string} hourFormat 
     * @param {base.TimeZoneOptions} tZone 
     * @param {string} nRegex 
     * @returns {string}
     */
    private static parseTimeZoneRegx(hourFormat: string, tZone: base.TimeZoneOptions, nRegex: string): string {
        let pattern: string = tZone.gmtFormat;
        let ret: string;
        let result: string;
        let cRegex: string = '(' + nRegex + ')' + '(' + nRegex + ')';
        let splitStr: string[];

        ret = hourFormat.replace('+', '\\+');
        if (hourFormat.indexOf('HH') !== -1) {
            ret = ret.replace(/HH|mm/g, '(' + cRegex + ')');
        } else {
            ret = ret.replace(/H|m/g, '(' + cRegex + '?)');
        }
        splitStr = (ret.split(';').map((str: string): string => {
            return pattern.replace('{0}', str);
        }));
        ret = splitStr.join('|') + '|' + tZone.gmtZeroFormat;
        return ret;
    }
    /**
     * Returns zone based value.
     * @param {boolean} flag 
     * @param {string} val1 
     * @param {string} val2 
     * @param {NumericOptions} num 
     * @returns {number}
     */
    private static getZoneValue(flag: boolean, val1: string, val2: string, num: NumericOptions): number {
        let ival: string = flag ? val1 : val2;
        if (!ival) {
            return 0;
        }
        let value: number = this.internalNumberParser(ival, num);
        if (flag) {
            return -value;
        }
        return value;
    }
}
/* tslint:enable */
