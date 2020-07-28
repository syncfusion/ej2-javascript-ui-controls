import { NumberFormatOptions, DateFormatOptions, defaultCurrencyCode } from '../internationalization';
import { NumericParts } from './number-parser';
import { getValue, isNullOrUndefined, extend, isBlazor } from '../util';
import { ParserBase as parser, getBlazorCurrencySymbol } from './parser-base';
import { DateFormat, FormatOptions } from './date-formatter';
import { NumberFormat, FormatParts, CommonOptions } from './number-formatter';
import { isUndefined } from '../util';

export const blazorCultureFormats: Object = {
    'en-US': {
        'd': 'M/d/y',
        'D': 'EEEE, MMMM d, y',
        'f': 'EEEE, MMMM d, y h:mm a',
        'F': 'EEEE, MMMM d, y h:mm:s a',
        'g': 'M/d/y h:mm a',
        'G': 'M/d/yyyy h:mm:ss tt',
        'm': 'MMMM d',
        'M': 'MMMM d',
        'r': 'ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'',
        'R': 'ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'',
        's': 'yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss',
        't': 'h:mm tt',
        'T': 'h:m:s tt',
        'u': 'yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'',
        'U': 'dddd, MMMM d, yyyy h:mm:ss tt',
        'y': 'MMMM yyyy',
        'Y': 'MMMM yyyy'
    }
};
/**
 * Date base common constants and function for date parser and formatter.
 */
export namespace IntlBase {
    // tslint:disable-next-line:max-line-length
    export const negativeDataRegex: RegExp = /^(('[^']+'|''|[^*#@0,.E])*)(\*.)?((([#,]*[0,]*0+)(\.0*[0-9]*#*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
    export const customRegex: RegExp = /^(('[^']+'|''|[^*#@0,.])*)(\*.)?((([0#,]*[0,]*[0#]*)(\.[0#]*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
    export const latnParseRegex: RegExp = /0|1|2|3|4|5|6|7|8|9/g;
    const fractionRegex: RegExp = /[0-9]/g;
    export const defaultCurrency: string = '$';
    const mapper: string[] = ['infinity', 'nan', 'group', 'decimal'];
    const patternRegex: RegExp = /G|M|L|H|c|'| a|yy|y|EEEE|E/g;
    const patternMatch: Object = {
        'G': '',
        'M': 'm',
        'L': 'm',
        'H': 'h',
        'c': 'd',
        '\'': '"',
        ' a': ' AM/PM',
        'yy': 'yy',
        'y': 'yyyy',
        'EEEE': 'dddd',
        'E': 'ddd'
    };
    export const dateConverterMapper: RegExp = /dddd|ddd/ig;
    const defaultFirstDay: string = 'sun';
    export const islamicRegex: RegExp = /^islamic/;
    const firstDayMapper: Object = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
    };
    export interface NumericSkeleton {
        type?: string;
        isAccount?: boolean;
        fractionDigits?: number;
    }
    export interface GenericFormatOptions {
        nData?: NegativeData;
        pData?: NegativeData;
        zeroData?: NegativeData;
    }
    export interface GroupSize {
        primary?: number;
        secondary?: number;
    }
    export interface NegativeData extends FormatParts {
        nlead?: string;
        nend?: string;
        groupPattern?: string;
        minimumFraction?: number;
        maximumFraction?: number;
    }
    export const formatRegex: RegExp = /(^[ncpae]{1})([0-1]?[0-9]|20)?$/i;
    export const currencyFormatRegex: RegExp = /(^[ca]{1})([0-1]?[0-9]|20)?$/i;
    export const curWithoutNumberRegex: RegExp = /(c|a)$/ig;
    const typeMapper: Object = {
        '$': 'isCurrency',
        '%': 'isPercent',
        '-': 'isNegative',
        0: 'nlead',
        1: 'nend'
    };
    export const dateParseRegex: RegExp = /([a-z])\1*|'([^']|'')+'|''|./gi;
    export const basicPatterns: string[] = ['short', 'medium', 'long', 'full'];
    export interface Dependables {
        parserObject?: Object;
        dateObject?: Object;
        numericObject?: Object;
    }
    export interface TimeZoneOptions {
        hourFormat?: string;
        gmtFormat?: string;
        gmtZeroFormat?: string;
    }
    /* tslint:disable:quotemark */
    export const defaultObject: Object = {
        'dates': {
            'calendars': {
                'gregorian': {
                    'months': {
                        'stand-alone': {
                            'abbreviated': {
                                '1': 'Jan',
                                '2': 'Feb',
                                '3': 'Mar',
                                '4': 'Apr',
                                '5': 'May',
                                '6': 'Jun',
                                '7': 'Jul',
                                '8': 'Aug',
                                '9': 'Sep',
                                '10': 'Oct',
                                '11': 'Nov',
                                '12': 'Dec'
                            },
                            'narrow': {
                                '1': 'J',
                                '2': 'F',
                                '3': 'M',
                                '4': 'A',
                                '5': 'M',
                                '6': 'J',
                                '7': 'J',
                                '8': 'A',
                                '9': 'S',
                                '10': 'O',
                                '11': 'N',
                                '12': 'D'
                            },
                            'wide': {
                                '1': 'January',
                                '2': 'February',
                                '3': 'March',
                                '4': 'April',
                                '5': 'May',
                                '6': 'June',
                                '7': 'July',
                                '8': 'August',
                                '9': 'September',
                                '10': 'October',
                                '11': 'November',
                                '12': 'December'
                            }
                        }
                    },
                    "days": {
                        "stand-alone": {
                            "abbreviated": {
                                "sun": "Sun",
                                "mon": "Mon",
                                "tue": "Tue",
                                "wed": "Wed",
                                "thu": "Thu",
                                "fri": "Fri",
                                "sat": "Sat"
                            },
                            "narrow": {
                                "sun": "S",
                                "mon": "M",
                                "tue": "T",
                                "wed": "W",
                                "thu": "T",
                                "fri": "F",
                                "sat": "S"
                            },
                            "short": {
                                "sun": "Su",
                                "mon": "Mo",
                                "tue": "Tu",
                                "wed": "We",
                                "thu": "Th",
                                "fri": "Fr",
                                "sat": "Sa"
                            },
                            "wide": {
                                "sun": "Sunday",
                                "mon": "Monday",
                                "tue": "Tuesday",
                                "wed": "Wednesday",
                                "thu": "Thursday",
                                "fri": "Friday",
                                "sat": "Saturday"
                            }
                        }
                    },
                    "dayPeriods": {
                        "format": {
                            "wide": {
                                "am": "AM",
                                "pm": "PM"
                            }
                        }
                    },
                    'eras': {
                        'eraNames': {
                            '0': 'Before Christ',
                            '0-alt-variant': 'Before Common Era',
                            '1': 'Anno Domini',
                            "1-alt-variant": "Common Era"
                        },
                        'eraAbbr': {
                            '0': 'BC',
                            '0-alt-variant': 'BCE',
                            '1': 'AD',
                            '1-alt-variant': 'CE'
                        },
                        'eraNarrow': {
                            '0': 'B',
                            '0-alt-variant': 'BCE',
                            '1': 'A',
                            '1-alt-variant': 'CE'
                        }
                    },
                    'dateFormats': {
                        'full': 'EEEE, MMMM d, y',
                        'long': 'MMMM d, y',
                        'medium': 'MMM d, y',
                        'short': 'M/d/yy'
                    },
                    'timeFormats': {
                        'full': 'h:mm:ss a zzzz',
                        'long': 'h:mm:ss a z',
                        'medium': 'h:mm:ss a',
                        'short': 'h:mm a'
                    },
                    'dateTimeFormats': {
                        'full': "{1} 'at' {0}",
                        'long': "{1} 'at' {0}",
                        'medium': '{1}, {0}',
                        'short': '{1}, {0}',
                        'availableFormats': {
                            'd': 'd',
                            'E': 'ccc',
                            'Ed': 'd E',
                            'Ehm': 'E h:mm a',
                            'EHm': 'E HH:mm',
                            'Ehms': 'E h:mm:ss a',
                            'EHms': 'E HH:mm:ss',
                            'Gy': 'y G',
                            'GyMMM': 'MMM y G',
                            'GyMMMd': 'MMM d, y G',
                            'GyMMMEd': 'E, MMM d, y G',
                            'h': 'h a',
                            'H': 'HH',
                            'hm': 'h:mm a',
                            'Hm': 'HH:mm',
                            'hms': 'h:mm:ss a',
                            'Hms': 'HH:mm:ss',
                            'hmsv': 'h:mm:ss a v',
                            'Hmsv': 'HH:mm:ss v',
                            'hmv': 'h:mm a v',
                            'Hmv': 'HH:mm v',
                            'M': 'L',
                            'Md': 'M/d',
                            'MEd': 'E, M/d',
                            'MMM': 'LLL',
                            'MMMd': 'MMM d',
                            'MMMEd': 'E, MMM d',
                            'MMMMd': 'MMMM d',
                            'ms': 'mm:ss',
                            'y': 'y',
                            'yM': 'M/y',
                            'yMd': 'M/d/y',
                            'yMEd': 'E, M/d/y',
                            'yMMM': 'MMM y',
                            'yMMMd': 'MMM d, y',
                            'yMMMEd': 'E, MMM d, y',
                            'yMMMM': 'MMMM y',
                        },
                    }
                },
                "islamic": {
                    "months": {
                        "stand-alone": {
                            "abbreviated": {
                                "1": "Muh.",
                                "2": "Saf.",
                                "3": "Rab. I",
                                "4": "Rab. II",
                                "5": "Jum. I",
                                "6": "Jum. II",
                                "7": "Raj.",
                                "8": "Sha.",
                                "9": "Ram.",
                                "10": "Shaw.",
                                "11": "Dhuʻl-Q.",
                                "12": "Dhuʻl-H."
                            },
                            "narrow": {
                                "1": "1",
                                "2": "2",
                                "3": "3",
                                "4": "4",
                                "5": "5",
                                "6": "6",
                                "7": "7",
                                "8": "8",
                                "9": "9",
                                "10": "10",
                                "11": "11",
                                "12": "12"
                            },
                            "wide": {
                                "1": "Muharram",
                                "2": "Safar",
                                "3": "Rabiʻ I",
                                "4": "Rabiʻ II",
                                "5": "Jumada I",
                                "6": "Jumada II",
                                "7": "Rajab",
                                "8": "Shaʻban",
                                "9": "Ramadan",
                                "10": "Shawwal",
                                "11": "Dhuʻl-Qiʻdah",
                                "12": "Dhuʻl-Hijjah"
                            }
                        }
                    },
                    "days": {
                        "stand-alone": {
                            "abbreviated": {
                                "sun": "Sun",
                                "mon": "Mon",
                                "tue": "Tue",
                                "wed": "Wed",
                                "thu": "Thu",
                                "fri": "Fri",
                                "sat": "Sat"
                            },
                            "narrow": {
                                "sun": "S",
                                "mon": "M",
                                "tue": "T",
                                "wed": "W",
                                "thu": "T",
                                "fri": "F",
                                "sat": "S"
                            },
                            "short": {
                                "sun": "Su",
                                "mon": "Mo",
                                "tue": "Tu",
                                "wed": "We",
                                "thu": "Th",
                                "fri": "Fr",
                                "sat": "Sa"
                            },
                            "wide": {
                                "sun": "Sunday",
                                "mon": "Monday",
                                "tue": "Tuesday",
                                "wed": "Wednesday",
                                "thu": "Thursday",
                                "fri": "Friday",
                                "sat": "Saturday"
                            }
                        }
                    },
                    "dayPeriods": {
                        "format": {
                            "wide": {
                                "am": "AM",
                                "pm": "PM"
                            }
                        }
                    },
                    "eras": {
                        "eraNames": {
                            "0": "AH"
                        },
                        "eraAbbr": {
                            "0": "AH"
                        },
                        "eraNarrow": {
                            "0": "AH"
                        }
                    },
                    "dateFormats": {
                        "full": "EEEE, MMMM d, y G",
                        "long": "MMMM d, y G",
                        "medium": "MMM d, y G",
                        "short": "M/d/y GGGGG"
                    },
                    "timeFormats": {
                        "full": "h:mm:ss a zzzz",
                        "long": "h:mm:ss a z",
                        "medium": "h:mm:ss a",
                        "short": "h:mm a"
                    },
                    "dateTimeFormats": {
                        "full": "{1} 'at' {0}",
                        "long": "{1} 'at' {0}",
                        "medium": "{1}, {0}",
                        "short": "{1}, {0}",
                        "availableFormats": {
                            "d": "d",
                            "E": "ccc",
                            "Ed": "d E",
                            "Ehm": "E h:mm a",
                            "EHm": "E HH:mm",
                            "Ehms": "E h:mm:ss a",
                            "EHms": "E HH:mm:ss",
                            "Gy": "y G",
                            "GyMMM": "MMM y G",
                            "GyMMMd": "MMM d, y G",
                            "GyMMMEd": "E, MMM d, y G",
                            "h": "h a",
                            "H": "HH",
                            "hm": "h:mm a",
                            "Hm": "HH:mm",
                            "hms": "h:mm:ss a",
                            "Hms": "HH:mm:ss",
                            "M": "L",
                            "Md": "M/d",
                            "MEd": "E, M/d",
                            "MMM": "LLL",
                            "MMMd": "MMM d",
                            "MMMEd": "E, MMM d",
                            "MMMMd": "MMMM d",
                            "ms": "mm:ss",
                            "y": "y G",
                            "yyyy": "y G",
                            "yyyyM": "M/y GGGGG",
                            "yyyyMd": "M/d/y GGGGG",
                            "yyyyMEd": "E, M/d/y GGGGG",
                            "yyyyMMM": "MMM y G",
                            "yyyyMMMd": "MMM d, y G",
                            "yyyyMMMEd": "E, MMM d, y G",
                            "yyyyMMMM": "MMMM y G",
                            "yyyyQQQ": "QQQ y G",
                            "yyyyQQQQ": "QQQQ y G"
                        }
                    }
                }
            },
            'timeZoneNames': {
                "hourFormat": "+HH:mm;-HH:mm",
                "gmtFormat": "GMT{0}",
                "gmtZeroFormat": "GMT",
            }
        },
        'numbers': {
            'currencies': {
                'USD': {
                    'displayName': 'US Dollar',
                    'symbol': '$',
                    'symbol-alt-narrow': '$'
                },
                'EUR': {
                    'displayName': 'Euro',
                    'symbol': '€',
                    'symbol-alt-narrow': '€'
                },
                'GBP': {
                    'displayName': 'British Pound',
                    'symbol-alt-narrow': '£'
                },
            },
            'defaultNumberingSystem': 'latn',
            'minimumGroupingDigits': '1',
            'symbols-numberSystem-latn': {
                'decimal': '.',
                'group': ',',
                'list': ';',
                'percentSign': '%',
                'plusSign': '+',
                'minusSign': '-',
                'exponential': 'E',
                'superscriptingExponent': '×',
                'perMille': '‰',
                'infinity': '∞',
                'nan': 'NaN',
                'timeSeparator': ':'
            },
            'decimalFormats-numberSystem-latn': {
                'standard': '#,##0.###',
            },
            'percentFormats-numberSystem-latn': {
                'standard': '#,##0%'
            },
            'currencyFormats-numberSystem-latn': {
                'standard': '¤#,##0.00',
                'accounting': '¤#,##0.00;(¤#,##0.00)'
            },
            'scientificFormats-numberSystem-latn': {
                'standard': '#E0'
            }
        }
    };
    export const blazorDefaultObject: Object = {
        "numbers": {
            "mapper": {
                "0": "0",
                "1": "1",
                "2": "2",
                "3": "3",
                "4": "4",
                "5": "5",
                "6": "6",
                "7": "7",
                "8": "8",
                "9": "9"
            },
            "mapperDigits": "0123456789",
            "numberSymbols": {
                "decimal": ".",
                "group": ",",
                "plusSign": "+",
                "minusSign": "-",
                "percentSign": "%",
                "nan": "NaN",
                "timeSeparator": ":",
                "infinity": "∞"
            },
            "timeSeparator": ":",
            "currencySymbol": "$",
            "currencypData": {
                "nlead": "$",
                "nend": "",
                "groupSeparator": ",",
                "groupData": {
                    "primary": 3
                },
                "maximumFraction": 2,
                "minimumFraction": 2
            },
            "percentpData": {
                "nlead": "",
                "nend": "%",
                "groupSeparator": ",",
                "groupData": {
                    "primary": 3
                },
                "maximumFraction": 2,
                "minimumFraction": 2
            },
            "percentnData": {
                "nlead": "-",
                "nend": "%",
                "groupSeparator": ",",
                "groupData": {
                    "primary": 3
                },
                "maximumFraction": 2,
                "minimumFraction": 2
            },
            "currencynData": {
                "nlead": "($",
                "nend": ")",
                "groupSeparator": ",",
                "groupData": {
                    "primary": 3
                },
                "maximumFraction": 2,
                "minimumFraction": 2
            },
            "decimalnData": {
                "nlead": "-",
                "nend": "",
                "groupData": {
                    "primary": 3
                },
                "maximumFraction": 2,
                "minimumFraction": 2
            },
            "decimalpData": {
                "nlead": "",
                "nend": "",
                "groupData": {
                    "primary": 3
                },
                "maximumFraction": 2,
                "minimumFraction": 2
            }
        },
        "dates": {
            "dayPeriods": {
                "am": "AM",
                "pm": "PM"
            },
            "dateSeperator": "/",
            "days": {
                "abbreviated": {
                    "sun": "Sun",
                    "mon": "Mon",
                    "tue": "Tue",
                    "wed": "Wed",
                    "thu": "Thu",
                    "fri": "Fri",
                    "sat": "Sat"
                },
                "short": {
                    "sun": "Su",
                    "mon": "Mo",
                    "tue": "Tu",
                    "wed": "We",
                    "thu": "Th",
                    "fri": "Fr",
                    "sat": "Sa"
                },
                "wide": {
                    "sun": "Sunday",
                    "mon": "Monday",
                    "tue": "Tuesday",
                    "wed": "Wednesday",
                    "thu": "Thursday",
                    "fri": "Friday",
                    "sat": "Saturday"
                }
            },
            "months": {
                "abbreviated": {
                    "1": "Jan",
                    "2": "Feb",
                    "3": "Mar",
                    "4": "Apr",
                    "5": "May",
                    "6": "Jun",
                    "7": "Jul",
                    "8": "Aug",
                    "9": "Sep",
                    "10": "Oct",
                    "11": "Nov",
                    "12": "Dec"
                },
                "wide": {
                    "1": "January",
                    "2": "February",
                    "3": "March",
                    "4": "April",
                    "5": "May",
                    "6": "June",
                    "7": "July",
                    "8": "August",
                    "9": "September",
                    "10": "October",
                    "11": "November",
                    "12": "December"
                }
            },
            "eras": {
                "1": "AD"
            }
        }
    };
    /* tslint:enable:quotemark */
    export const monthIndex: Object = {
        3: 'abbreviated',
        4: 'wide',
        5: 'narrow',
        1: 'abbreviated'
    };
    /**
     * 
     */

    export const month: string = 'months';
    export const days: string = 'days';
    /**
     * Default numerber Object
     */

    export const patternMatcher: { [key: string]: Object } = {
        C: 'currency',
        P: 'percent',
        N: 'decimal',
        A: 'currency',
        E: 'scientific'
    };
    /**
     * Returns the resultant pattern based on the skeleton, dateObject and the type provided
     * @private
     * @param {string} skeleton 
     * @param {Object} dateObject 
     * @param {string} type 
     * @returns {string}
     */
    export function getResultantPattern(
        skeleton: string, dateObject: Object, type: string, isIslamic?: boolean,
        blazorCulture?: string): string {
        let resPattern: string;
        let iType: string = type || 'date';
        if (blazorCulture) {
            resPattern = compareBlazorDateFormats({ skeleton: skeleton }, blazorCulture).format ||
                compareBlazorDateFormats({ skeleton: 'd' }, 'en-US').format;
        } else {
            if (basicPatterns.indexOf(skeleton) !== -1) {
                resPattern = getValue(iType + 'Formats.' + skeleton, dateObject);
                if (iType === 'dateTime') {
                    let dPattern: string = getValue('dateFormats.' + skeleton, dateObject);
                    let tPattern: string = getValue('timeFormats.' + skeleton, dateObject);
                    resPattern = resPattern.replace('{1}', dPattern).replace('{0}', tPattern);
                }
            } else {
                resPattern = getValue('dateTimeFormats.availableFormats.' + skeleton, dateObject);
            }
            if (isUndefined(resPattern) && skeleton === 'yMd') {
                resPattern = 'M/d/y';
            }
        }
        return resPattern;
    }
    export interface DateObject {
        year?: number;
        month?: number;
        date?: number;
    }
    /**
     * Returns the dependable object for provided cldr data and culture
     * @private
     * @param {Object} cldr 
     * @param {string} culture 
     * @param {boolean} isNumber 
     * @returns {Dependables}
     */
    export function getDependables(cldr: Object, culture: string, mode: string, isNumber?: boolean): Dependables {
        let ret: Dependables = {};
        let calendartype: string = mode || 'gregorian';
        ret.parserObject = parser.getMainObject(cldr, culture) || (isBlazor() ? blazorDefaultObject : defaultObject);
        if (isNumber) {
            ret.numericObject = getValue('numbers', ret.parserObject);
        } else {
            let dateString: string = isBlazor() ? 'dates' : ('dates.calendars.' + calendartype);
            ret.dateObject = getValue(dateString, ret.parserObject);
        }
        return ret;
    }
    /**
     * Returns the symbol pattern for provided parameters
     * @private
     * @param {string} type 
     * @param {string} numSystem 
     * @param {Object} obj 
     * @param {boolean} isAccount 
     * @returns {string}
     */
    export function getSymbolPattern(type: string, numSystem: string, obj: Object, isAccount: boolean): string {
        return getValue(
            type + 'Formats-numberSystem-' +
            numSystem + (isAccount ? '.accounting' : '.standard'),
            obj) || (isAccount ? getValue(
                type + 'Formats-numberSystem-' +
                numSystem + '.standard',
                obj) : '');
    }
    export function ConvertDateToWeekFormat(format: string): string {
        let convertMapper: string[] = format.match(dateConverterMapper);
        if (convertMapper && isBlazor()) {
            let tempString: string = convertMapper[0].length === 3 ? 'EEE' : 'EEEE';
            return format.replace(dateConverterMapper, tempString);
        }
        return format;
    }
    export function compareBlazorDateFormats(formatOptions: DateFormatOptions, culture?: string): DateFormatOptions {
        let format: string = formatOptions.format || formatOptions.skeleton;
        let curFormatMapper: string = getValue((culture || 'en-US') + '.' + format, blazorCultureFormats);
        if (!curFormatMapper) {
            curFormatMapper = getValue('en-US.' + format, blazorCultureFormats);
        }
        if (curFormatMapper) {
            curFormatMapper = ConvertDateToWeekFormat(curFormatMapper);
            formatOptions.format = curFormatMapper.replace(/tt/, 'a');
        }
        return formatOptions;
    }

    /**
     * Returns proper numeric skeleton
     * @private
     * @param {string} skeleton 
     * @returns {NumericSkeleton}
     */
    export function getProperNumericSkeleton(skeleton: string): NumericSkeleton {
        let matches: RegExpMatchArray = skeleton.match(formatRegex);
        let ret: NumericSkeleton = {};
        let pattern: string = matches[1].toUpperCase();
        ret.isAccount = (pattern === 'A');
        /* tslint:disable no-any */
        (<any>ret).type = patternMatcher[pattern];
        if (skeleton.length > 1) {
            ret.fractionDigits = parseInt(matches[2], 10);
        }
        return ret;
    }
    /**
     * Returns format data for number formatting like minimum fraction, maximum fraction, etc..,
     * @private
     * @param {string} pattern 
     * @param {boolean} needFraction 
     * @param {string} cSymbol 
     * @param {boolean} fractionOnly 
     * @returns {NegativeData}
     */
    export function getFormatData(pattern: string, needFraction: boolean, cSymbol: string, fractionOnly?: boolean): NegativeData {
        let nData: NegativeData = fractionOnly ? {} : { nlead: '', nend: '' };
        let match: string[] = pattern.match(customRegex);
        if (match) {
            if (!fractionOnly) {
                nData.nlead = changeCurrencySymbol(match[1], cSymbol);
                nData.nend = changeCurrencySymbol(match[10], cSymbol);
                nData.groupPattern = match[4];
            }
            let fraction: string = match[7];
            if (fraction && needFraction) {
                let fmatch: string[] = fraction.match(fractionRegex);
                if (!isNullOrUndefined(fmatch)) {
                    nData.minimumFraction = fmatch.length;
                } else {
                    nData.minimumFraction = 0;
                }
                nData.maximumFraction = fraction.length - 1;
            }

        }
        return nData;
    }
    /**
     * Changes currency symbol
     * @private
     * @param {string} val 
     * @param {string} sym 
     * @returns {string}
     */
    function changeCurrencySymbol(val: string, sym: string): string {
        if (val) {
            return val.replace(defaultCurrency, sym);
        }
        return '';
    }
    /**
     * Returns currency symbol based on currency code
     * @private
     * @param {Object} numericObject 
     * @param {string} currencyCode 
     * @returns {string}
     */
    export function getCurrencySymbol(numericObject: Object, currencyCode: string, altSymbol?: string): string {
        let symbol: string = altSymbol ? ('.' + altSymbol) : '.symbol';
        let getCurrency: string = getValue('currencies.' + currencyCode + symbol, numericObject) ||
            getValue('currencies.' + currencyCode + '.symbol-alt-narrow', numericObject) || '$';
        return getCurrency;
    }
    /**
     * Returns formatting options for custom number format
     * @private
     * @param {string} format 
     * @param {CommonOptions} dOptions 
     * @param {Dependables} obj 
     * @returns {GenericFormatOptions}
     */
    export function customFormat(format: string, dOptions: CommonOptions, obj: Dependables): GenericFormatOptions {
        let options: GenericFormatOptions = {};
        let formatSplit: string[] = format.split(';');
        let data: string[] = ['pData', 'nData', 'zeroData'];
        for (let i: number = 0; i < formatSplit.length; i++) {
            (<any>options)[data[i]] = customNumberFormat(formatSplit[i], dOptions, obj);
        }
        if (isNullOrUndefined(options.nData)) {
            options.nData = extend({}, options.pData);
            options.nData.nlead = isNullOrUndefined(dOptions) ? '-' + options.nData.nlead : dOptions.minusSymbol + options.nData.nlead;
        }
        return options;
    }
    /**
     * Returns custom formatting options
     * @private
     * @param {string} format 
     * @param {CommonOptions} dOptions 
     * @param {Object} numObject 
     * @returns {NegativeData}
     */
    function customNumberFormat(format: string, dOptions?: CommonOptions, numObject?: Object): NegativeData {
        let cOptions: NegativeData = { type: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 };
        let pattern: string[] = format.match(customRegex);
        if (isNullOrUndefined(pattern) || (pattern[5] === '' && format !== 'N/A')) {
            cOptions.type = undefined;
            return cOptions;
        }
        cOptions.nlead = pattern[1];
        cOptions.nend = pattern[10];
        let integerPart: string = pattern[6];
        cOptions.useGrouping = integerPart.indexOf(',') !== -1;
        integerPart = integerPart.replace(/,/g, '');
        let fractionPart: string = pattern[7];
        if (integerPart.indexOf('0') !== -1) {
            cOptions.minimumIntegerDigits = integerPart.length - integerPart.indexOf('0');
        }
        if (!isNullOrUndefined(fractionPart)) {
            cOptions.minimumFractionDigits = fractionPart.lastIndexOf('0');
            cOptions.maximumFractionDigits = fractionPart.lastIndexOf('#');
            if (cOptions.minimumFractionDigits === -1) {
                cOptions.minimumFractionDigits = 0;
            }
            if (cOptions.maximumFractionDigits === -1 || cOptions.maximumFractionDigits < cOptions.minimumFractionDigits) {
                cOptions.maximumFractionDigits = cOptions.minimumFractionDigits;
            }
        }
        if (!isNullOrUndefined(dOptions)) {
            extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], '$', dOptions.currencySymbol));
            if (!cOptions.isCurrency) {
                extend(cOptions, isCurrencyPercent(
                    [cOptions.nlead, cOptions.nend], '%', dOptions.percentSymbol));
            }
        } else {
            extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], '%', '%'));
        }
        if (!isNullOrUndefined(numObject)) {
            let symbolPattern: string = getSymbolPattern(
                cOptions.type, dOptions.numberMapper.numberSystem, numObject, false);
            if (cOptions.useGrouping) {
                cOptions.groupSeparator = (<any>dOptions).numberMapper.numberSymbols[mapper[2]];
                cOptions.groupData = NumberFormat.getGroupingDetails(symbolPattern.split(';')[0]);
            }
            cOptions.nlead = cOptions.nlead.replace(/\'/g, '');
            cOptions.nend = cOptions.nend.replace(/\'/g, '');
        }
        return cOptions;
    }
    /**
     * Returns formatting options for currency or percent type
     * @private
     * @param {string[]} parts 
     * @param {string} actual 
     * @param {string} symbol 
     * @returns {NegativeData}
     */
    export function isCurrencyPercent(parts: string[], actual: string, symbol: string): NegativeData {
        let options: NegativeData = { nlead: parts[0], nend: parts[1] };
        for (let i: number = 0; i < 2; i++) {
            let part: string = parts[i];
            let loc: number = part.indexOf(actual);
            if ((loc !== -1) && ((loc < part.indexOf('\'')) || (loc > part.lastIndexOf('\'')))) {
                (<any>options)[(<any>typeMapper)[i]] = part.substr(0, loc) + symbol + part.substr(loc + 1);
                (<any>options)[(<any>typeMapper)[actual]] = true;
                options.type = options.isCurrency ? 'currency' : 'percent';
                break;
            }
        }
        return options;
    }
    /**
     * Returns culture based date separator 
     * @private
     * @param {Object} dateObj 
     * @returns {string}
     */
    export function getDateSeparator(dateObj: Object): string {
        let value: string[] = (getValue('dateFormats.short', dateObj) || '').match(/[d‏M‏]([^d‏M])[d‏M‏]/i);
        return value ? value[1] : '/';
    }

    /**
     * Returns Native Date Time pattern
     * @private
     * @param {string} culture 
     * @param {DateFormatOptions} options 
     * @param {Object} cldr 
     * @returns {string}
     */
    export function getActualDateTimeFormat(culture: string, options: DateFormatOptions, cldr?: Object, isExcelFormat?: boolean): string {
        let dependable: Dependables = getDependables(cldr, culture, options.calendar);
        if (isBlazor()) {
            options = compareBlazorDateFormats(options, culture);
        }
        let actualPattern: string = options.format || getResultantPattern(options.skeleton, dependable.dateObject, options.type);
        if (isExcelFormat) {
            actualPattern = actualPattern.replace(patternRegex, (pattern: string): string => {
                return (<any>patternMatch)[pattern];
            });
            if (actualPattern.indexOf('z') !== -1) {
                let tLength: number = actualPattern.match(/z/g).length;
                let timeZonePattern: string;
                let options: FormatOptions = { 'timeZone': {} };
                options.numMapper = parser.getNumberMapper(dependable.parserObject, parser.getNumberingSystem(cldr));
                options.timeZone = getValue('dates.timeZoneNames', dependable.parserObject);
                let value: Date = new Date();
                let timezone: number = value.getTimezoneOffset();
                let pattern: string = (tLength < 4) ? '+H;-H' : options.timeZone.hourFormat;
                pattern = pattern.replace(/:/g, options.numMapper.timeSeparator);
                if (timezone === 0) {
                    timeZonePattern = options.timeZone.gmtZeroFormat;
                } else {
                    timeZonePattern = DateFormat.getTimeZoneValue(timezone, pattern);
                    timeZonePattern = options.timeZone.gmtFormat.replace(/\{0\}/, timeZonePattern);
                }
                actualPattern = actualPattern.replace(/[z]+/, '"' + timeZonePattern + '"');
            }
            actualPattern = actualPattern.replace(/ $/, '');
        }
        return actualPattern;
    }

    // tslint:disable-next-line:no-any
    function processSymbol(actual: string, option: any): any {
        if (actual.indexOf(',') !== -1) {
            // tslint:disable-next-line:no-any
            let split: any = actual.split(',');
            actual = (split[0] + getValue('numberMapper.numberSymbols.group', option) +
                split[1].replace('.', getValue('numberMapper.numberSymbols.decimal', option)));
        } else {
            actual = actual.replace('.', getValue('numberMapper.numberSymbols.decimal', option));
        }
        return actual;
    }


    /**
     * Returns Native Number pattern
     * @private
     * @param {string} culture 
     * @param {NumberFormatOptions} options 
     * @param {Object} cldr 
     * @returns {string}
     */
    export function getActualNumberFormat(culture: string, options: NumberFormatOptions, cldr?: Object, isExcel?: Boolean): string {
        let dependable: Dependables = getDependables(cldr, culture, '', true);
        let parseOptions: NumericParts = { custom: true };
        let numrericObject: Object = dependable.numericObject;
        let minFrac: number;
        let curObj: GenericFormatOptions & { hasNegativePattern?: boolean } = {};
        let curMatch: string[] = (options.format || '').match(currencyFormatRegex);
        let type: NumericSkeleton = formatRegex.test(options.format) ? getProperNumericSkeleton(options.format || 'N') : {};
        let dOptions: CommonOptions = {};
        if (curMatch) {
            dOptions.numberMapper = isBlazor() ?
                extend({}, dependable.numericObject) :
                parser.getNumberMapper(dependable.parserObject, parser.getNumberingSystem(cldr), true);
            let curCode: string = isBlazor() ? getValue('currencySymbol', dependable.numericObject) :
                getCurrencySymbol(dependable.numericObject, options.currency || defaultCurrencyCode, options.altSymbol);
            let symbolPattern: string = getSymbolPattern(
                'currency', dOptions.numberMapper.numberSystem, dependable.numericObject, (/a/i).test(options.format));
            symbolPattern = symbolPattern.replace(/\u00A4/g, curCode);
            let split: string[] = symbolPattern.split(';');
            curObj.hasNegativePattern = isBlazor() ? true : (split.length > 1);
            curObj.nData = isBlazor() ? getValue(type.type + 'nData', numrericObject) :
                getFormatData(split[1] || '-' + split[0], true, curCode);
            curObj.pData = isBlazor() ? getValue(type.type + 'pData', numrericObject) :
                getFormatData(split[0], false, curCode);
            if (!curMatch[2] && !options.minimumFractionDigits && !options.maximumFractionDigits) {
                minFrac = getFormatData(symbolPattern.split(';')[0], true, '', true).minimumFraction;
            }
        }
        let actualPattern: string;
        if ((formatRegex.test(options.format)) || !(options.format)) {
            extend(parseOptions, getProperNumericSkeleton(options.format || 'N'));
            parseOptions.custom = false;
            actualPattern = '###0';
            if (parseOptions.fractionDigits || options.minimumFractionDigits || options.maximumFractionDigits || minFrac) {
                let defaultMinimum: number = 0;
                if (parseOptions.fractionDigits) {
                    options.minimumFractionDigits = options.maximumFractionDigits = parseOptions.fractionDigits;
                }
                actualPattern = fractionDigitsPattern(
                    actualPattern, minFrac || parseOptions.fractionDigits ||
                    options.minimumFractionDigits || defaultMinimum,
                    options.maximumFractionDigits || defaultMinimum);
            }
            if (options.minimumIntegerDigits) {
                actualPattern = minimumIntegerPattern(actualPattern, options.minimumIntegerDigits);
            }
            if (options.useGrouping) {
                actualPattern = groupingPattern(actualPattern);
            }
            if (parseOptions.type === 'currency' || (parseOptions.type && isBlazor())) {
                if (isBlazor() && parseOptions.type !== 'currency') {
                    curObj.pData = getValue(parseOptions.type + 'pData', numrericObject);
                    curObj.nData = getValue(parseOptions.type + 'nData', numrericObject);
                }
                let cPattern: string = actualPattern;
                actualPattern = curObj.pData.nlead + cPattern + curObj.pData.nend;
                if (curObj.hasNegativePattern || isBlazor()) {
                    actualPattern += ';' + curObj.nData.nlead + cPattern + curObj.nData.nend;
                }
            }
            if (parseOptions.type === 'percent' && !isBlazor()) {
                actualPattern += ' %';
            }
        } else {
            actualPattern = options.format.replace(/\'/g, '"');
        }
        if (Object.keys(dOptions).length > 0) {
            actualPattern = !isExcel ? processSymbol(actualPattern, dOptions) : actualPattern;
        }
        return actualPattern;
    }
    function fractionDigitsPattern(pattern: string, minDigits: number, maxDigits?: number): string {
        pattern += '.';
        for (let a: number = 0; a < minDigits; a++) {
            pattern += '0';
        }
        if (minDigits < maxDigits) {
            let diff: number = maxDigits - minDigits;
            for (let b: number = 0; b < diff; b++) {
                pattern += '#';
            }
        }
        return pattern;
    }
    function minimumIntegerPattern(pattern: string, digits: number): string {
        let temp: string[] = pattern.split('.');
        let integer: string = '';
        for (let x: number = 0; x < digits; x++) {
            integer += '0';
        }
        return temp[1] ? (integer + '.' + temp[1]) : integer;
    }
    function groupingPattern(pattern: string): string {
        let temp: string[] = pattern.split('.');
        let integer: string = temp[0];
        let no: number = 3 - integer.length % 3;
        let hash: string = (no && no === 1) ? '#' : (no === 2 ? '##' : '');
        integer = hash + integer;
        pattern = '';
        for (let x: number = integer.length - 1; x > 0; x = x - 3) {
            pattern = ',' + integer[x - 2] + integer[x - 1] + integer[x] + pattern;
        }
        pattern = pattern.slice(1);
        return temp[1] ? (pattern + '.' + temp[1]) : pattern;
    }
    export function getWeekData(culture: string, cldr?: Object): number {
        let firstDay: string = defaultFirstDay;
        let mapper: Object = getValue('supplemental.weekData.firstDay', cldr);
        let iCulture: string = culture;
        if ((/en-/).test(iCulture)) {
            iCulture = iCulture.slice(3);
        }
        iCulture = iCulture.slice(0, 2).toUpperCase() + iCulture.substr(2);
        if (mapper) {
            firstDay = mapper[iCulture] || defaultFirstDay;
        }
        return firstDayMapper[firstDay];
    }
    /**
     * @private
     * @param pData 
     * @param aCurrency 
     * @param rCurrency 
     */
    export function replaceBlazorCurrency(pData: NegativeData[], aCurrency: string, rCurrency: string): void {
        let iCurrency: string = getBlazorCurrencySymbol(rCurrency);
        if (aCurrency !== iCurrency) {
            for (let data of pData) {
                data.nend = data.nend.replace(aCurrency, iCurrency);
                data.nlead = data.nlead.replace(aCurrency, iCurrency);
            }
        }
    }
    /**
     * @private
     */
    export function getWeekOfYear(date: Date): number {
        let newYear: Date = new Date(date.getFullYear(), 0, 1);
        let day: number = newYear.getDay();
        let weeknum: number;
        day = (day >= 0 ? day : day + 7);
        let daynum: number = Math.floor((date.getTime() - newYear.getTime() -
            (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
        if (day < 4) {
            weeknum = Math.floor((daynum + day - 1) / 7) + 1;
            if (weeknum > 52) {
                let nYear: Date = new Date(this.getFullYear() + 1, 0, 1);
                let nday: number = nYear.getDay();
                nday = nday >= 0 ? nday : nday + 7;
                weeknum = nday < 4 ? 1 : 53;
            }
        } else {
            weeknum = Math.floor((daynum + day - 1) / 7);
        }
        return weeknum;
    }
}
