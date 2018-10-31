/**
 * Spec for date parser.
 */
import { DateParser } from '../../src/intl/date-parser';
import { ParserBase } from '../../src/intl/parser-base';
import { IntlBase } from '../../src/intl/intl-base';
import { loadCldr, Internationalization, DateFormatOptions, cldrData } from '../../src/internationalization';
import { DateFormat } from '../../src/intl/date-formatter';
import { isNullOrUndefined } from '../../src/util';
import '../../node_modules/es6-promise/dist/es6-promise';
import { Ajax } from '../../src/ajax';

export function getTimeZone(date?: Date): number {
    date = date || new Date();
    let timeZone: number = date.getTimezoneOffset();
    return timeZone / 60;
}


function processlongTime(d: Date): Date {
    let offset: number = d.getTimezoneOffset();
    if (offset !== 0) {
        let val: number = offset % 60;
        if (val !== 0) {
            d.setMinutes(d.getMinutes() + val);
        }
    }
    return d;
}
function getDateString(culture: string, option: DateFormatOptions, d: Date): string {
    let val: string = DateFormat.dateFormat(culture, option, cldrData)(d);
    return val;
}
export const dupCulObject: Object = {
    main: {
        'dummy': {
            'dates': {
                'calendars': {
                    'gregorian': {
                        'timeFormats': {
                            'full': 'zzzzz',
                        },
                        'dateTimeFormats': {
                            'availableFormats': {
                                G: 'y GGGG',
                                GG: 'y GGGGG'
                            }
                        },
                        'eras': {
                            'eraNames': {
                                '0': 'Before Christ',
                                '0-alt-variant': 'Before Common Era',
                                '1': 'Anno Domini',
                                '1-alt-variant': 'Common Era'
                            }, 'eraNarrow': {
                                '0': 'B',
                                '0-alt-variant': 'BCE',
                                '1': 'A',
                                '1-alt-variant': 'CE'
                            }
                        }
                    }
                },
                'timeZoneNames': {
                    'hourFormat': '+HH:mm;-HH:mm',
                    'gmtFormat': 'GMT{0}',
                    'gmtZeroFormat': 'GMT',
                },

            },
            'numbers': {
                'defaultNumberingSystem': 'latn'
            }
        }
    }
};
function getTimeZoneString(): string {
    let val: number = getTimeZone();
    if (!isNullOrUndefined(val)) {
        let ret: string = val > 0 ? '-' : '+';
        val = Math.abs(val);
        let mval: number = val % 1 * 60;
        let hval: number = Math.floor(val);
        return 'GMT' + ret + addzero(hval) + ':' + addzero(mval);
    } else {
        return 'GMT';
    }
}
function addzero(val: number): string {
    let ret: string = val + '';
    if (ret.length < 2) {
        return '0' + val;
    }
    return ret;
}
function getParsedDate(culture: string, option: DateFormatOptions, d: Date): Date {
    let fString: String = getDateString(culture, option, d);
    let val: Date = DateParser.dateParser(culture, option, cldrData)(fString);
    return val;
}
function isDateTimeMacthed(date1: Date, date2: Date): boolean {
    return date1.toUTCString() === date2.toUTCString();
}
export function dateMatched(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
}

export function loadCultureFiles(name: string, base?: boolean): void {
    let files: string[] = !base ?
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'] : ['numberingSystems.json'];
    for (let prop of files) {
        let val: Object;
        let ajax: Ajax;
        if (base) {
            ajax = new Ajax('base/spec/intl/cldr/supplemental/' + prop, 'GET', false);
        } else {
            ajax = new Ajax('base/spec/intl/cldr/main/' + name + '/' + prop, 'GET', false);
        }
        ajax.onSuccess = (value: JSON) => {
            val = value;
        };
        ajax.send();
        loadCldr(JSON.parse(<string>val));
    }
}
loadCultureFiles('', true);
loadCultureFiles('ar-QA');
loadCultureFiles('ja');
loadCultureFiles('da');
loadCultureFiles('de');
loadCultureFiles('zh');
export function monthDayMatch(date1: Date, date2: Date): boolean {
    return date1.toLocaleDateString() === date2.toLocaleDateString()
}
const parseCultures: string[] = ['en', 'ar-QA', 'ja', 'zh'];
let parserInst: DateParser = new DateParser();
let baseInst: ParserBase = new ParserBase();
describe('DateParser', () => {
    let parseDate: Date = new Date();
    beforeAll(() => {
        loadCldr(dupCulObject);
    });
    for (let cul of parseCultures) {
        describe('dateTime Format for culture - ' + cul, () => {
            beforeEach(() => {
                parseDate = new Date();
            });
            it('full type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'full', type: 'dateTime' }, parseDate);
                expect(isDateTimeMacthed(parseDate, result)).toBeTruthy();
            });
            it('long type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'long', type: 'dateTime' }, parseDate);
                result = processlongTime(result);
                expect(isDateTimeMacthed(parseDate, result)).toBeTruthy();
            });
            it('medium type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'medium', type: 'dateTime' }, parseDate);
                expect(isDateTimeMacthed(parseDate, result)).toBeTruthy();
            });
            it('medium type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'medium', type: 'dateTime' }, parseDate);
                expect(isDateTimeMacthed(parseDate, result)).toBeTruthy();
            });
            it('short type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'short', type: 'dateTime' }, parseDate);
                result.setSeconds(parseDate.getSeconds());
                expect(isDateTimeMacthed(parseDate, result)).toBeTruthy();
            });
        });
        describe('date Format for culture - ' + cul, () => {
            beforeEach(() => {
                parseDate = new Date();
            });
            it('full type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'full', type: 'date' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('long type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'long', type: 'date' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('medium type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'medium', type: 'date' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('short type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'short', type: 'date' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
        });
        describe('time Format for culture - ' + cul, () => {
            beforeEach(() => {
                parseDate = new Date();
            });
            it('full type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'full', type: 'time' }, parseDate);
                expect(parseDate.toTimeString()).toBe(result.toTimeString());
            });
            it('long type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'long', type: 'time' }, parseDate);
                result = processlongTime(result);
                expect(parseDate.toTimeString()).toBe(result.toTimeString());
            });
            it('medium type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'medium', type: 'time' }, parseDate);
                expect(parseDate.toTimeString()).toBe(result.toTimeString());
            });
            it('short type', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'short', type: 'time' }, parseDate);
                result.setSeconds(parseDate.getSeconds());
                expect(parseDate.toTimeString()).toBe(result.toTimeString());
            });
        });
        describe('Custom Format for culture - ' + cul, () => {
            beforeEach(() => {
                parseDate = new Date();
            });
            it('custom date format "M/d/y"', () => {
                let result: Date = getParsedDate(cul, { format: 'M/d/y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "MMM dd,y"', () => {
                let result: Date = getParsedDate(cul, { format: 'MMM dd,y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "MMMM dd"', () => {
                let result: Date = getParsedDate(cul, { format: 'MMMM dd' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "dd MMM y"', () => {
                let result: Date = getParsedDate(cul, { format: 'dd MMM y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "dd MMMM"', () => {
                let result: Date = getParsedDate(cul, { format: 'dd MMMM' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "dd/MM/y"', () => {
                let result: Date = getParsedDate(cul, { format: 'dd/MM/y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "MMM dd"', () => {
                let result: Date = getParsedDate(cul, { format: 'MMM dd' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "MMMM y GG"', () => {
                let result: Date = getParsedDate(cul, { format: 'MMMM y GG' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "d/M/y"', () => {
                let result: Date = getParsedDate(cul, { format: 'd/M/y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "MMM-y"', () => {
                let result: Date = getParsedDate(cul, { format: 'MMM-y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "dd-MMMM"', () => {
                let result: Date = getParsedDate(cul, { format: 'dd-MMMM' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "MMM d/y"', () => {
                let result: Date = getParsedDate(cul, { format: 'MMM d/y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "d-MMM-y GG"', () => {
                let result: Date = getParsedDate(cul, { format: 'd-MMM-y GG' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "MMMM d,y GG"', () => {
                let result: Date = getParsedDate(cul, { format: 'MMMM d,y GG' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "E d-M-y"', () => {
                let result: Date = getParsedDate(cul, { format: 'E d-M-y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "E MMM d/y GG"', () => {
                let result: Date = getParsedDate(cul, { format: 'E MMM d/y GG' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "EEEE d MM y"', () => {
                let result: Date = getParsedDate(cul, { format: 'EEEE d MM y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "MMMM d,y EEEE"', () => {
                let result: Date = getParsedDate(cul, { format: 'MMMM d,y EEEE' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "EEEE d-MMM-y"', () => {
                let result: Date = getParsedDate(cul, { format: 'EEEE d-MMM-y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "MMMM,y"', () => {
                let result: Date = getParsedDate(cul, { format: 'MMMM,y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "MMMM d"', () => {
                let result: Date = getParsedDate(cul, { format: 'MMMM d' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom date format "d MMM y"', () => {
                let result: Date = getParsedDate(cul, { format: 'd MMM y' }, parseDate);
                expect(dateMatched(parseDate, result)).toBeTruthy();
            });
            it('custom time format "H : mm"', () => {
                let result: Date = getParsedDate(cul, { format: 'H : mm' }, parseDate);
                result.setSeconds(parseDate.getSeconds());
                expect(parseDate.toTimeString()).toBe(result.toTimeString());
            });
            it('custom time format "H:mm:ss"', () => {
                let result: Date = getParsedDate(cul, { format: 'H:mm:ss' }, parseDate);
                expect(parseDate.toTimeString()).toBe(result.toTimeString());
            });
            it('custom time format "h:mm:ss a"', () => {
                let result: Date = getParsedDate(cul, { format: 'h:mm:ss a' }, parseDate);
                expect(parseDate.toTimeString()).toBe(result.toTimeString());
            });
        });
        describe('Addional format-' + cul, () => {
            let timeParse: Date = new Date();
            beforeAll(() => {
                timeParse.setHours(10);
                timeParse.setMinutes(10);
                timeParse.setSeconds(10);
            });
            beforeEach(() => {
                parseDate = new Date();
            });
            it('skelton "d"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'd' }, parseDate);
                expect(result.getDate()).toBe(parseDate.getDate());
            });
            it('skeleton "Ed"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'Ed' }, parseDate);
                expect(result.getDate()).toBe(parseDate.getDate());
            });
            it('skeleton "Ehm"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'Ehm' }, timeParse);
                result.setSeconds(10);
                expect(timeParse.toTimeString()).toBe(result.toTimeString());
            });
            it('skeleton "Ehms"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'Ehms' }, timeParse);
                expect(timeParse.toTimeString()).toBe(result.toTimeString());
            });
            it('skeleton "h"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'h' }, timeParse);
                result.setMinutes(10);
                result.setSeconds(10);
                expect(timeParse.toTimeString()).toBe(result.toTimeString());
            });
            it('skeleton "hms"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'hms' }, parseDate);
                expect(parseDate.toTimeString()).toBe(result.toTimeString());
            });
            it('skeleton "hm"', () => {
                let hour12Date: Date = new Date();
                hour12Date.setHours(0, 20, 33);
                let result: Date = getParsedDate(cul, { skeleton: 'hm' }, hour12Date);
                result.setSeconds(33);
                expect(hour12Date.toTimeString()).toBe(result.toTimeString());
            });
            it('skeleton "EHms"', () => {
                let d: Date = new Date();
                let result: Date = getParsedDate(cul, { skeleton: 'EHms' }, timeParse);
                expect(timeParse.toTimeString()).toBe(result.toTimeString());
            });
            it('skeleton "H"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'H' }, timeParse);
                expect(result.getHours()).toBe(timeParse.getHours());
            });
            it('skeleton "Hm"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'Hm' }, timeParse);
                result.setSeconds(10);
                expect(timeParse.toTimeString()).toBe(result.toTimeString());
            });
            it('skeleton "Hms"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'Hms' }, timeParse);
                expect(timeParse.toTimeString()).toBe(result.toTimeString());
            });
            it('skeleton "M"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'M' }, parseDate);
                expect(parseDate.getMonth()).toBe(result.getMonth());
            });
            it('skeleton "Md"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'Md' }, parseDate);
                expect(monthDayMatch(parseDate, result)).toBeTruthy();
            });
            it('skeleton "MEd"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'MEd' }, parseDate);
                expect(monthDayMatch(parseDate, result)).toBeTruthy();
            });
            it('skeleton "MMM"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'MMM' }, parseDate);
                expect(result.getMonth()).toBe(parseDate.getMonth());
            });
            it('skeleton "MMMd"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'MMMEd' }, parseDate);
                expect(monthDayMatch(parseDate, result)).toBeTruthy();
            });
            it('skeleton "MEd"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'MMMMd' }, parseDate);
                expect(monthDayMatch(parseDate, result)).toBeTruthy();
            });
            it('skeleton "ms"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'ms' }, parseDate);
                result.setHours(parseDate.getHours());
                expect(parseDate.toTimeString()).toBe(result.toTimeString());
            });
            it('skeleton "y"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'y' }, parseDate);
                expect(result.getFullYear()).toBe(parseDate.getFullYear());
            });
            it('skeleton "y" with single digit year', () => {
                let result: Date = DateParser.dateParser('en-US', {skeleton:'y'}, cldrData)('1');
                expect(result.getFullYear()).toBe((Math.floor(new Date().getFullYear() / 100) * 100) + 1);
            });
            it('skeleton "yM"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'yM' }, parseDate);
                result.setDate(parseDate.getDate());
                expect(monthDayMatch(result, parseDate));
            });
            it('skeleton "yMd"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'yMd' }, parseDate);
                expect(monthDayMatch(result, parseDate));
            });
            it('skeleton "yMEd"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'yMd' }, parseDate);
                expect(monthDayMatch(result, parseDate));
            });
            it('skeleton "yMMM"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'yMMM' }, parseDate);
                result.setDate(parseDate.getDate());
                expect(monthDayMatch(result, parseDate));
            });
            it('skeleton "yMMMd"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'yMMMd' }, parseDate);
                expect(monthDayMatch(result, parseDate));
            });
            it('skeleton "yMMMEd"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'yMMMEd' }, parseDate);
                expect(monthDayMatch(result, parseDate));
            });
            it('skeleton "yMMMM"', () => {
                let result: Date = getParsedDate(cul, { skeleton: 'yMMMM' }, parseDate);
                result.setDate(parseDate.getDate());
                expect(monthDayMatch(result, parseDate));
            });
        });
    }
    describe('date value set properly while date value is greater than 28', () => {
        let maxDate: Date = new Date('1/30/2016');
        let maxDate2: Date = new Date('3/31/2017');
        it('max date value1', () => {
            let result: Date = getParsedDate('en-US', { skeleton: 'full', type: 'dateTime' }, maxDate);
            expect(result.getDate()).toBe(maxDate.getDate());
            expect(result.getMonth()).toBe(maxDate.getMonth());
        });
        it('max date value2', () => {
            let result: Date = getParsedDate('en-US', { skeleton: 'full', type: 'dateTime' }, maxDate2);
            expect(result.getDate()).toBe(maxDate2.getDate());
            expect(result.getMonth()).toBe(maxDate2.getMonth());
        });
    });
    describe('era format type check for "en"', () => {
        let eraDate: Date;
        beforeEach(() => {
            eraDate = new Date('1/1/2015');
        });
        it('Gy', () => {
            let parser: Function = DateParser.dateParser('en', { skeleton: 'Gy' }, cldrData);
            let result: Date = parser('2015 AD');
            expect(result.getFullYear()).toBe(2015);
        });
        it('GyMMM', () => {
            let parser: Function = DateParser.dateParser('en', { skeleton: 'GyMMM' }, cldrData);
            let result: Date = parser('Jan 2015 AD');
            result.setDate(1);
            result.setHours(0, 0, 0, 0);
            expect(monthDayMatch(result, new Date('1/1/2015'))).toBeTruthy();
        });
        it('GyMMMd', () => {
            let parser: Function = DateParser.dateParser('en', { skeleton: 'GyMMMd' }, cldrData);
            let result: Date = parser('Jan 1, 2015 AD');
            result.setHours(0, 0, 0, 0);
            expect(monthDayMatch(result, eraDate)).toBeTruthy();
        });
        it('GyMMMED', () => {
            let parser: Function = DateParser.dateParser('en', { skeleton: 'GyMMMEd' }, cldrData);
            let result: Date = parser('Fri, Jan 1, 2015 AD');
            result.setHours(0, 0, 0, 0);
            expect(monthDayMatch(result, eraDate)).toBeTruthy();
        });
    });
    //EJ2-4536-milli second issue
    describe('Milli seconds value set to 0 for returned date value', () => {
        let maxMilliDate: Date = new Date('1/30/2016');
        it(' gy check milli seconds', () => {
            let parser: Function = DateParser.dateParser('en', { skeleton: 'Gy' }, cldrData);
            let result: number = +parser('2015 AD');
            expect(('' +result).slice(10)).toBe('000');
        });
        it('max date value1', () => {
            let result: number = +getParsedDate('en-US', { skeleton: 'full', type: 'dateTime' }, maxMilliDate);
            expect(('' +result).slice(10)).toBe('000');
        });
    });
    describe('Custom format with invalid value returns null', () => {
        it('With date value only returns null', () => {
            let parser: Function = DateParser.dateParser('en', { format: 'dd/MM/yyyy H:mm' }, cldrData);
            let result: Date = parser('10/12/2015');
            expect(result).toBeNull();
        });
        it('With date value and hour only returns null', () => {
            let parser: Function = DateParser.dateParser('en', { format: 'dd/MM/yyyy H:mm' }, cldrData);
            let result: Date = parser('10/12/2015 10:');
            expect(result).toBeNull();
        });
        it('With correct value not returns null', () => {
            let parser: Function = DateParser.dateParser('en', { format: 'dd/MM/yyyy H:mm' }, cldrData);
            let result: Date = parser('10/12/2015 10:30');
            expect(result).not.toBeNull();
        });
    });
    describe('dateTime Format with gmt ', () => {
        it('', () => {
            let str: string = getTimeZoneString();
            let parser: Function = DateParser.dateParser('en', { type: 'dateTime', skeleton: 'full' }, cldrData);
            let result: Date = parser('Saturday, November 12, 2016 at 1:05:00 PM ' + str);
            expect(dateMatched(result, new Date('11/12/2016 13:05'))).toBeTruthy();
        });
        it('datetime with custom timeZone positive value', () => {
            let parser: Function = DateParser.dateParser('en', { type: 'dateTime', skeleton: 'full' }, cldrData);
            let expected: Date = new Date('11/12/2016 1:05:00 PM GMT+06:30');
            let result: Date = parser('Saturday, November 12, 2016, 1:05:00 PM GMT+06:30');
            expect(dateMatched(expected, result)).toBeTruthy();
        });
        it('datetime with custom timeZone negative value', () => {
            let parser: Function = DateParser.dateParser('en', { type: 'dateTime', skeleton: 'full' }, cldrData);
            let expected: Date = new Date('11/12/2016 1:05:00 PM GMT-03:30');
            let result: Date = parser('Saturday, November 12, 2016, 1:05:00 PM GMT-03:30');
            expect(dateMatched(expected, result)).toBeTruthy();
        });
        it('timezone with hour only format', () => {
            let parser: Function = DateParser.dateParser('dummy', { type: 'time', skeleton: 'full' }, cldrData);
            parser('GMT+07');
        });
    });
    describe('DateParser with multiple months check works properly',()=>{
        for (let i: number = 0; i <= 11; i++) {
            it('parser for month ' + (i + 1), () => {
                let date: Date = new Date(2016, i, 2);
                let result: Date = getParsedDate('en-US', { skeleton: 'full', type: 'dateTime' }, date);
                expect(result.toUTCString()).toBe(date.toUTCString());
            });
        }
    });
    describe('era validation check', () => {
        it('eraNames ', () => {
            let parser: Function = DateParser.dateParser('dummy', { skeleton: 'G' }, cldrData);
            expect(parser('2015 Anno Domini').getFullYear()).toBe(2015);
        });
        it('eraNarrow', () => {
            let parser: Function = DateParser.dateParser('dummy', { skeleton: 'GG' }, cldrData);
            expect(parser('2012 A').getFullYear()).toBe(2012);
        });
    });
    describe('Invalid pattern throws error', () => {
        it('properly', () => {
            expect(() => { DateParser.dateParser('en', { skeleton: 'invalid' }, cldrData) }).toThrow();
        });
    });
    describe('Invalid parse value returns null', () => {
        it('', () => {
            let result: Date = DateParser.dateParser('en', { skeleton: 'H' }, cldrData)('12 PM');
            expect(result).toBeNull();
        });
    });
    describe('Chinese Designator check', () => {
        it('pm', () => {
            let result: Date = DateParser.dateParser('zh', { format: 'y/M/d ah:mm'}, cldrData)('2017/6/7 下午9:00');
            let nDate: Date = new Date(2017, 5, 7, 21);
            expect(result.toDateString()).toBe(nDate.toDateString());
        });
        it('am', () => {
            let result: Date = DateParser.dateParser('zh', { format: 'y/M/d ah:mm'}, cldrData)('2017/6/7 上午9:00');
            let nDate: Date = new Date(2017, 5, 7, 9);
            expect(result.toDateString()).toBe(nDate.toDateString());
        });
    });
    describe('functions', () => {
        let tvalue: number = 0;
        let tObject: Object = {
            getTimezoneOffset: () => { return -330 },
            setMinutes: (val: number) => { tvalue = val },
            setMilliseconds:() =>{},
            getMinutes: () => { return 20 }
        }
        it('getZoneValue for positive value', () => {
            let res: number = (DateParser as any).getZoneValue(false, '2', '3', {
                numberParseRegex: /0|1|2|3|4|5|6|7|8|9/g, numericPair: { 2: 2, 3: 3 }
            });
            expect(res).toBe(3);
        });
        it('getZoneValue for invalid number value', () => {
            let res: number = (DateParser as any).getZoneValue(false, '2', '3', {
                numberParseRegex: /0|1|2|3|4|5|6|7|8|9/g, numericPair: { 2: 'a', 3: 'b' }
            });
            expect(res).toBeNull();
        });
        it('getZoneValue for no value', () => {
            let res: number = (DateParser as any).getZoneValue(false, '', '', {});
            expect(res).toBe(0);
        });
        it('parserBase get Numbering system ', () => {
            expect(ParserBase.getNumberingSystem({})).toBe(ParserBase.numberingSystems);
        });
        it('parserBase get Numbering system with no digits', () => {
            let result: any = ParserBase.getCurrentNumericOptions({
                numbers: { 'defaultNumberingSystem': 'latn' }
            }, { latn: {} });
            expect(result.symbolNumberSystem).toBe(undefined);
            expect(result.numericPair).toBe(undefined);
            expect(result.numberParseRegex).toBe(undefined);
        });
        it('parserBase get Numbering system with no defaultnumbering system', () => {
            let result: any = ParserBase.getCurrentNumericOptions({}, {});
            expect(result.symbolNumberSystem).toBe(undefined);
            expect(result.numericPair).toBe(undefined);
            expect(result.numberParseRegex).toBe(undefined);
        });
        describe('timezone processing ', () => {
            it('while timezone values are equal', () => {
                let ret: Object = (DateParser as any).getDateObject({ timeZone: -330 }, tObject);
                expect(tvalue).toBe(0);
            });
            it('while timezone values are equal', () => {
                let ret: Object = (DateParser as any).getDateObject({ timeZone: -300}, tObject);
                expect(tvalue).toBe(50);
            });
        });
        describe('Invalid date and month processing', () => {
            it('Invalid month returns invalid date object with maximum value', () => {
                let result: Date = DateParser.dateParser('en', { skeleton: 'short', type: 'date' },cldrData)('14/13/17');
                expect(result.toString()).toBe('Invalid Date');
            });
            it('Invalid month returns invalid date object with min  value', () => {
                let result: Date = DateParser.dateParser('en', { skeleton: 'short', type: 'date' }, cldrData)('0/13/17');
                expect(result.toString()).toBe('Invalid Date');
            });
            it('Invalid day returns invalid date object max value ', () => {
                let result: Date = DateParser.dateParser('en', { skeleton: 'short', type: 'date' }, cldrData)('1/33/17');
                expect(result).toBeNull();
            });
            it('Invalid day returns invalid date object min value', () => {
                let result: Date = DateParser.dateParser('en', { skeleton: 'short', type: 'date' }, cldrData)('1/0/17');
                expect(result).toBeNull();
            });
            it('Invalid day returns invalid date object with valid value and exceeding the months days', () => {
                let result: Date = DateParser.dateParser('en', { skeleton: 'short', type: 'date' }, cldrData)('9/31/17');
                expect(result).toBeNull();
            });
        });
        it('internalDateParser timzone processing hour an month format', () => {
            let ret: any = (DateParser as any).internalDateParse(
                'Saturday, November 12, 2016, 1:05:00 PM GMT+05:30',
                {
                    designator: { PM: 'pm' },
                    evalposition: {
                        day: { isNumber: true, pos: 6 },
                        designator: { pos: 19 },
                        hour: { isNumber: true, pos: 13 },
                        minute: { isNumber: true, pos: 15 },
                        month: { pos: 4 },
                        second: { isNumber: true, pos: 17 },
                        timeZone: { hourOnly: false, pos: 21 },
                        year: { isNumber: true, pos: 9 },
                    },
                    month: {
                        November: "11"
                    },
                    // tslint:disable-next-line:max-line-length
                    parserRegex: /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)(.)?(.)?(January|February|March|April|May|June|July|August|September|October|November|December)(.)?([0-9][0-9]?)(.)?(.)?([0-9]+)(.)?(at)?(.)?([0-9][0-9]?)(.)?([0-9][0-9])(.)?([0-9][0-9])(.)?(AM|PM)(.)?(GMT\+(([0-9])([0-9])):(([0-9])([0-9]))|GMT-(([0-9])([0-9])):(([0-9])([0-9]))|GMT)?$/,
                    timeZone: {
                        gmtFormat: "GMT{0}",
                        gmtZeroFormat: "GMT",
                        hourFormat: "+HH:mm;-HH:mm"
                    }
                },
                { "numericPair": { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9 }, "numberParseRegex": /0|1|2|3|4|5|6|7|8|9/g, "numericRegex": "[0-9]" }
            );
            expect(ret.timeZone).toBe(-330)
        });
        it('internalDateParser timzone processing hour only', () => {
            let ret: any = (DateParser as any).internalDateParse(
                "November 4, 2016 at 2:30:22 PM GMT+5",
                {
                    designator: { PM: 'pm' },
                    evalposition: {
                        "month": { "pos": 1 },
                        "day": { "isNumber": true, "pos": 3 },
                        "year": { "isNumber": true, "pos": 6 },
                        "hour": { "isNumber": true, "pos": 10 },
                        "minute": { "isNumber": true, "pos": 12 },
                        "second": { "isNumber": true, "pos": 14 },
                        "designator": { "pos": 16 },
                        "timeZone": { "pos": 18, "hourOnly": true }
                    },
                    month: {
                        November: "11"
                    },
                    parserRegex:
                    /^(January|February|March|April|May|June|July|August|September|October|November|December)(.)?([0-9][0-9]?)(.)?(.)?([0-9]+)(.)?(at)?(.)?([0-9][0-9]?)(.)?([0-9][0-9])(.)?([0-9][0-9])(.)?(AM|PM)(.)?(GMT\+(([0-9])([0-9])?)|GMT-(([0-9])([0-9])?)|GMT)?$/,
                    timeZone: {
                        gmtFormat: "GMT{0}",
                        gmtZeroFormat: "GMT",
                        hourFormat: "+HH:mm;-HH:mm"
                    }
                },
                {
                    "numericPair":
                    { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9 }, "numberParseRegex": /0|1|2|3|4|5|6|7|8|9/g, "numericRegex": "[0-9]"
                }
            );
            expect(ret.timeZone).toBe(-300)
        });

    });

    describe('Get Actual Date Time Format function', () => {
        it('short date', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'short', type: 'date'});
            expect(result).toBe('M/d/yy');
        });
        it('long date', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'long', type: 'date'});
            expect(result).toBe('MMMM d, y');
        });
        it('medium date', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'medium', type: 'date'});
            expect(result).toBe('MMM d, y');
        });
        it('full date', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'full', type: 'date'});
            expect(result).toBe('EEEE, MMMM d, y');
        });
        it('skeleton d', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'd' });
            expect(result).toBe('d');
        });
        it('skeleton Ed', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'Ed' });
            expect(result).toBe('d E');
        });
        it('skeleton Ehm', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'Ehm' });
            expect(result).toBe('E h:mm a');
        });
        it('skeleton Ehms', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'Ehms' });
            expect(result).toBe('E h:mm:ss a');
        });
        it('skeleton h', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'h' });
            expect(result).toBe('h a');
        });
        it('skeleton hms', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'hms' });
            expect(result).toBe('h:mm:ss a');
        });
        it('skeleton hm', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'hm' });
            expect(result).toBe('h:mm a');
        });
        it('skeleton EHms', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'EHms' });
            expect(result).toBe('E HH:mm:ss');
        });
        it('skeleton H', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'H' });
            expect(result).toBe('HH');
        });
        it('skeleton Hm', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'Hm' });
            expect(result).toBe('HH:mm');
        });
        it('skeleton Hms', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'Hms' });
            expect(result).toBe('HH:mm:ss');
        });
        it('skeleton M', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'M' });
            expect(result).toBe('L');
        });
        it('skeleton Md', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'Md' });
            expect(result).toBe('M/d');
        });
        it('skeleton MEd', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'MEd' });
            expect(result).toBe('E, M/d');
        });
        it('skeleton MMM', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'MMM' });
            expect(result).toBe('LLL');
        });
        it('skeleton MMMd', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'MMMd' });
            expect(result).toBe('MMM d');
        });
        it('skeleton MEd', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'MEd' });
            expect(result).toBe('E, M/d');
        });
        it('skeleton ms', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'ms' });
            expect(result).toBe('mm:ss');
        });
        it('skeleton y', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'y' });
            expect(result).toBe('y');
        });
        it('skeleton yM', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'yM' });
            expect(result).toBe('M/y');
        });
        it('skeleton yMd', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'yMd' });
            expect(result).toBe('M/d/y');
        });
        it('skeleton yMEd', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'yMEd' });
            expect(result).toBe('E, M/d/y');
        });
        it('skeleton yMMM', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'yMMM' });
            expect(result).toBe('MMM y');
        });
        it('skeleton yMMMd', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'yMMMd' });
            expect(result).toBe('MMM d, y');
        });
        it('skeleton yMMMEd', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'yMMMEd' });
            expect(result).toBe('E, MMM d, y');
        });
        it('skeleton yMMMM', () => {
            let result: string = IntlBase.getActualDateTimeFormat('en', { skeleton: 'yMMMM' });
            expect(result).toBe('MMMM y');
        });
    });
});