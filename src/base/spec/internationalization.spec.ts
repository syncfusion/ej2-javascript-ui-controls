/**
 * Spec for internationalization.
 */
import { Internationalization, setCulture, setCurrencyCode, getNumericObject, getDefaultDateObject, loadCldr } from '../src/internationalization';
import { monthDayMatch } from './intl/date-parser.spec';
import { getTimeZoneString } from './intl/date-formatter.spec';
import { IntlBase as base } from '../src/intl/intl-base';
describe('Internationalization', () => {
    beforeAll(() => {
        setCulture('en-US');
    });
    describe('Date Fromatting without local culture set', () => {
        let dateIntl: Internationalization = new Internationalization();
        let date: Date = new Date('11/17/2016');
        it('datefromatting using the getdateFormat', () => {
            let dateformatter: Function = dateIntl.getDateFormat({ skeleton: 'long', type: 'date' });
            expect(dateformatter(date)).toBe('November 17, 2016');
        });
        it('datefromatting using the formatDate', () => {
            let result: string = dateIntl.formatDate(date, { skeleton: 'Gy' });
            expect(result).toBe('2016 AD');
        });
        it('datefromatting using the formatDate with no options', () => {
            let result: string = dateIntl.formatDate(date);
            expect(result).toBe('11/17/16');
        });
        it('dateformatter by changing culture using "setCulture" methos', () => {
            setCulture('ja');
            let result: string = dateIntl.formatDate(date, { skeleton: 'yMMMEd' });
            expect(result).toBe('2016年11月17日(木)');
        });
        afterAll(() => {
            setCulture('en-US');
        });
    });
    describe('Number Fromatting with local culture set', () => {
        let numIntl: Internationalization = new Internationalization('ja');
        it('numberformatter using the getNumberFormatter and currency code set in option', () => {
            let numberformatter: Function = numIntl.getNumberFormat({ format: 'C2', currency: 'JPY' });
            expect(numberformatter(123134)).toBe('￥123,134.00');
        });
        it('numberformatter using the getNumberFormatter and using global default currency code', () => {
            let numberformatter: Function = numIntl.getNumberFormat({ format: 'C2' });
            expect(numberformatter(123134)).toBe('$123,134.00');
        });
        it('numberfromatting using the formatNumber #1', () => {
            let result: string = numIntl.formatNumber(2341123.23, { format: 'p2' });
            expect(result).toBe('234,112,323.00%');
        });
        it('numberfromatting using the formatNumber #2', () => {
            let result: string = numIntl.formatNumber(-2341123, { format: 'e' });
            expect(result).toBe('-2.341123E+6');
        });
        it('numberfromatting using the formatNumber #3', () => {
            let result: string = numIntl.formatNumber(0.002341123, { format: 'e' });
            expect(result).toBe('2.341123E-3');
        });
        it('numberfromatting using the formatNumber #4', () => {
            let result: string = numIntl.formatNumber(-2341123, { format: '0;N/A' });
            expect(result).toBe('N/A');
        });
        it('numberfromatting using the formatNumber with no options', () => {
            let result: string = numIntl.formatNumber(2341123.234);
            expect(result).toBe('2,341,123.234');
        });
        it('Number formatter with rtl language set locale for instance', () => {
            numIntl.culture = 'ar-QA';
            let result: string = numIntl.formatNumber(2345634.342534, { format: 'n' });
            expect(result).toBe('٢٬٣٤٥٬٦٣٤٫٣٤٣');
        });
        it('Number formatter by changing culture using "setCulture" method and currency using the "setCurrencyCode"', () => {
            numIntl.culture = undefined;
            setCulture('en');
            setCurrencyCode('EUR');
            let result: string = numIntl.formatNumber(23412312.2212123, {
                format: 'C', maximumFractionDigits: 5, minimumFractionDigits: 2
            });
            expect(result).toBe('€23,412,312.22121');
        });
        afterAll(() => {
            setCulture('en-US');
            setCurrencyCode('USD');
        });
    });
    describe('Date Parser', () => {
        let dParseIntl: Internationalization = new Internationalization();
        let parseDate: Date = new Date();
        it('using getDateparser function', () => {
            let parser: Function = dParseIntl.getDateParser({ skeleton: 'yMMMM' });
            let result: Date = parser(dParseIntl.formatDate(parseDate, { skeleton: 'yMMMM' }));
            result.setDate(parseDate.getDate());
            expect(monthDayMatch(result, parseDate)).toBeTruthy;
        });
        it('using parse date and default value', () => {
            let ip: string = dParseIntl.formatDate(parseDate, { type: 'date', skeleton: 'short' })
            let result: Date = dParseIntl.parseDate(ip);
            expect(monthDayMatch(result, parseDate));
        });
    });
    describe('Number  Parser', () => {
        let nParseIntl: Internationalization = new Internationalization();
        let parseDate: Date = new Date();
        it('using getNumberParser function', () => {
            let parser: Function = nParseIntl.getNumberParser({ format: 'P' });
            let result: number = parser(nParseIntl.formatNumber(12345.23, { format: 'p2' }));
            expect(result).toBe(12345.23);
        });
        it('using parse number function', () => {
            let result: number = nParseIntl.parseNumber(
                nParseIntl.formatNumber(12345.23, { format: 'N', minimumFractionDigits: 5 }));
            expect(result).toBe(12345.23);
        });
    });
    describe('getNumericObject', () => {
        it('checkNumericObject for invalid culture returns default culture', () => {
            expect(getNumericObject('fe')).toEqual({
                decimal: '.', exponential: 'E', group: ',', infinity: '∞', list: ';', maximumFraction: 3, minimumFraction: 0
                , minusSign: '-', nan: 'NaN', perMille: '‰', percentSign: '%', plusSign: '+', superscriptingExponent: '×',
                timeSeparator: ':', dateSeparator: '/'
            });
        });
        it('checkNumericObject for "ar-QA" culture', () => {
            expect(getNumericObject('ar-QA')).toEqual({
                decimal: '٫', group: '٬', list: '؛', percentSign: '٪؜', plusSign: '؜+', minusSign: '؜-',
                exponential: 'اس', superscriptingExponent: '×', perMille: '؉', infinity: '∞',
                nan: 'ليس رقم', timeSeparator: ':', minimumFraction: 0, maximumFraction: 3, dateSeparator: '/'
            });
        });
    });
    describe('getDateSeparator check', () => {
        it('empty dateObject', () => {
            expect(base.getDateSeparator({})).toBe('/');
        });
        it('undefined parameter', () => {
            expect(base.getDateSeparator(undefined)).toBe('/');
        });
    });
    describe('getDateTimePattern', () => {
        let intl: Internationalization = new Internationalization();
        it('short date', () => {
            expect(intl.getDatePattern({ skeleton: 'short', type: 'date'})).toBe('M/d/yy');
        });
        it('long date', () => {
            expect(intl.getDatePattern({ skeleton: 'long', type: 'date'})).toBe('MMMM d, y');
        });
        it('full date', () => {
            expect(intl.getDatePattern({ skeleton: 'full', type: 'date' })).toBe('EEEE, MMMM d, y');
        });
        it('short time', () => {
            expect(intl.getDatePattern({ skeleton: 'short', type: 'time' })).toBe('h:mm a');
        });
        it('medium time', () => {
            expect(intl.getDatePattern({ skeleton: 'medium', type: 'time' })).toBe('h:mm:ss a');
        });
        it('short date xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'short', type: 'date' }, true)).toBe('m/d/yy');
        });
        it('medium date xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'medium', type: 'date' }, true)).toBe('mmm d, yyyy');
        });
        it('long date xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'long', type: 'date' }, true)).toBe('mmmm d, yyyy');
        });
        it('full date xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'full', type: 'date'}, true)).toBe('dddd, mmmm d, yyyy');
        });
        it('short time xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'short', type: 'time'}, true)).toBe('h:mm AM/PM');
        });
        it('medium time xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'medium', type: 'time'}, true)).toBe('h:mm:ss AM/PM');
        });
        it('long time xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'long', type: 'time'}, true)).
                toBe('h:mm:ss AM/PM "GMT' + getTimeZoneString(new Date(), true) + '"');
        });
        it('full time xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'full', type: 'time'}, true)).
                toBe('h:mm:ss AM/PM "GMT' + getTimeZoneString(new Date()) + '"');
        });
        it('short dateTime xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'short', type: 'dateTime' }, true)).toBe('m/d/yy, h:mm AM/PM');
        });
        it('medium dateTime xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'medium', type: 'dateTime' }, true)).toBe('mmm d, yyyy, h:mm:ss AM/PM');
        });
        it('long dateTime xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'long', type: 'dateTime' }, true)).
                toBe('mmmm d, yyyy "at" h:mm:ss AM/PM "GMT' + getTimeZoneString(new Date(), true) + '"');
        });
        it('full dateTime xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'full', type: 'dateTime' }, true)).
                toBe('dddd, mmmm d, yyyy "at" h:mm:ss AM/PM "GMT' + getTimeZoneString(new Date()) + '"');
        });
        it('d xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'd' }, true)).toBe('d');
        });
        it('E xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'E' }, true)).toBe('ddd');
        });
        it('Ed xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'Ed' }, true)).toBe('d ddd');
        });
        it('Ehm xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'Ehm' }, true)).toBe('ddd h:mm AM/PM');
        });
        it('EHm xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'EHm' }, true)).toBe('ddd hh:mm');
        });
        it('Ehms xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'Ehms' }, true)).toBe('ddd h:mm:ss AM/PM');
        });
        it('EHms xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'EHms' }, true)).toBe('ddd hh:mm:ss');
        });
        it('Gy xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'Gy' }, true)).toBe('yyyy');
        });
        it('GyMMM xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'GyMMM' }, true)).toBe('mmm yyyy');
        });
        it('GyMMMd xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'GyMMMd' }, true)).toBe('mmm d, yyyy');
        });
        it('GyMMMEd xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'GyMMMEd' }, true)).toBe('ddd, mmm d, yyyy');
        });
        it('h xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'h' }, true)).toBe('h AM/PM');
        });
        it('H xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'H' }, true)).toBe('hh');
        });
        it('hm xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'hm' }, true)).toBe('h:mm AM/PM');
        });
        it('Hm xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'Hm' }, true)).toBe('hh:mm');
        });
        it('hms xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'hms' }, true)).toBe('h:mm:ss AM/PM');
        });
        it('Hms xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'Hms' }, true)).toBe('hh:mm:ss');
        });
        it('M xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'M' }, true)).toBe('m');
        });
        it('Md xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'Md' }, true)).toBe('m/d');
        });
        it('MEd xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'MEd' }, true)).toBe('ddd, m/d');
        });
        it('MMM xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'MMM' }, true)).toBe('mmm');
        });
        it('MMMEd xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'MMMEd' }, true)).toBe('ddd, mmm d');
        });
        it('MMMd xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'MMMd' }, true)).toBe('mmm d');
        });
        it('ms xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'ms' }, true)).toBe('mm:ss');
        });
        it('y xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'y' }, true)).toBe('yyyy');
        });
        it('yM xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'yM' }, true)).toBe('m/yyyy');
        });
        it('yMd xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'yMd' }, true)).toBe('m/d/yyyy');
        });
        it('yMEd xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'yMEd' }, true)).toBe('ddd, m/d/yyyy');
        });
        it('yMMM xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'yMMM' }, true)).toBe('mmm yyyy');
        });
        it('yMMMMd xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'yMMMd' }, true)).toBe('mmm d, yyyy');
        });
        it('yMMMEd xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'yMMMEd' }, true)).toBe('ddd, mmm d, yyyy');
        });
        it('yMMM xls format', () => {
            expect(intl.getDatePattern({ skeleton: 'yMMM' }, true)).toBe('mmm yyyy');
        });
    });
    describe('getNumberPattern', () => {
        let intl: Internationalization = new Internationalization();
        it('default', () => {
            expect(intl.getNumberPattern({})).toBe('###0');
        });
        it('N format', () => {
            expect(intl.getNumberPattern({ format: 'N' })).toBe('###0');
        });
        it('N format use Grouping', () => {
            expect(intl.getNumberPattern({ format: 'N', useGrouping: true })).toBe('###,##0');
        });
        it('C format', () => {
            expect(intl.getNumberPattern({ format: 'C' })).toBe('$###0.00');
        });
        it('C1 format', () => {
            expect(intl.getNumberPattern({ format: 'C1' })).toBe('$###0.0');
        });
        it('C2 format', () => {
            expect(intl.getNumberPattern({ format: 'C2' })).toBe('$###0.00');
        });
        it('C2 format with maximum Fraction 4', () => {
            expect(intl.getNumberPattern({ format: 'C2', maximumFractionDigits: 4 })).toBe('$###0.00');
        });
        it('A format', () => {
            expect(intl.getNumberPattern({ format: 'A' })).toBe('$###0.00;($###0.00)');
        });
        it('A3 format', () => {
            expect(intl.getNumberPattern({ format: 'A3' })).toBe('$###0.000;($###0.000)');
        });
    });
    describe('First Day of the Week', () => {
        let intl: Internationalization = new Internationalization();
        let weekData: Object = {
            "supplemental": {
              "weekData": {
                "firstDay": {
                    "AD": "mon",
                    "AE": "sat",
                    "GB-alt-variant": "sun",
                    "ZW": "sun"
                }
              }
            }
        };
        loadCldr(weekData);
        it('en culture', () => {
            setCulture('en');
            expect(intl.getFirstDayOfWeek()).toBe(0);
        });
        it('en-Us culture', () => {
            setCulture('en-Us');
            expect(intl.getFirstDayOfWeek()).toBe(0);
        });
        it('en-AE culture', () => {
            setCulture('en-Ae');
            expect(intl.getFirstDayOfWeek()).toBe(6);
        });
        it('en-ZS culture data not available', () => {
            setCulture('en-ZS');
            expect(intl.getFirstDayOfWeek()).toBe(0);
        });
        it('en-GB-alt-variant culture data not available', () => {
            setCulture('en-Gb-alt-variant');
            expect(intl.getFirstDayOfWeek()).toBe(0);
        });
        it('ar culture', () => {
            setCulture('ar');
            expect(intl.getFirstDayOfWeek()).toBe(0);
        });
    });
    describe('getDefaultDateObject returns default dateObject properly', () => {
        /* tslint:disable:quotemark */
        // tslint:disable-next-line:max-func-body-length
        it('', () => {
            expect(JSON.stringify(getDefaultDateObject())).toBe(JSON.stringify({
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
            }));
        });
    });
    describe('Cr-EJ2-10356 - Date parser returns invalid output instead of null value',() => {
        it('Without special characters',()=>{
            let intl: Internationalization = new Internationalization();
            let res: Date = intl.parseDate('12122015',{skeleton:'yMd'});
            expect(res).toBe(null);
        });
        it('Wit special characters', () => {
            let intl: Internationalization = new Internationalization();
            let res: Date = intl.parseDate('12/122015', { skeleton: 'yMd' });
            expect(res).toBe(null);
        });
    });
    /* tslint:enable:quotemark */
});