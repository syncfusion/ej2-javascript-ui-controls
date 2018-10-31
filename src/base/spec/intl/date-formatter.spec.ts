/**
 * 
 */
import { DateFormat } from '../../src/intl/date-formatter';
import { DateParser } from '../../src/intl/date-parser';
import { dateMatched, dupCulObject } from './date-parser.spec';
import { loadCldr, cldrData } from '../../src/internationalization';
import { ParserBase } from '../../src/intl/parser-base';

loadCldr(dupCulObject, {});
const parseCultures: string[] = ['en', 'ar-QA', 'ja'];
export function getTimeZoneString(date: Date, ishour?: boolean): string {
    let off: number = date.getTimezoneOffset();
    if (off !== 0) {
        return (DateFormat as any).getTimeZoneValue(date.getTimezoneOffset(), ishour ? '+H;-H' : '+HH:mm;-HH:mm');
    } else {
        return '';
    }
}

let expectOut: Object = {
    'en': {
        s: '11/4/16, 2:30 PM',
        m: 'Nov 4, 2016, 2:30:22 PM',
        l: 'November 4, 2016 at 2:30:22 PM',
        f: 'Friday, November 4, 2016 at 2:30:22 PM',

    },
    'ar-QA': {
        s: '٤‏/١١‏/٢٠١٦ ٢:٣٠ م',
        m: '٠٤‏/١١‏/٢٠١٦ ٢:٣٠:٢٢ م',
    },
    'ja': {
        s: '2016/11/04 14:30',
        m: '2016/11/04 14:30:22'
    }
};
const strRep: string[] = ['s', 'm', 'l', 'f',];
let expOut: Object = {
    'en': {
        0: '11/4/2016',
        1: 'Nov 04,2016',
        2: 'November 04',
        3: '04 Nov 2016',
        4: '04 November',
        5: '04/11/2016',
        6: 'Nov 04',
        7: 'November 2016 AD',
        8: '4/11/2016',
        9: 'Nov-2016',
        10: '04-November',
        11: 'Nov 4/2016',
        12: '4-Nov-2016 AD',
        13: 'November 4,2016 AD',
        14: 'Fri 4-11-2016',
        15: 'Fri Nov 4/2016 AD',
        16: 'Friday 4 11 2016',
        17: 'November 4,2016 Friday',
        18: 'Friday 4-Nov-2016',
        19: 'November,2016',
        20: 'November 4',
        21: '4 Nov 2016',
        22: '2 : 30',
        23: '2:30:22',
        24: '2:30:22 PM'
    },
    'ar-QA': {
        0: '١١/٤/٢٠١٦',
        1: 'نوفمبر ٠٤,٢٠١٦',
        2: 'نوفمبر ٠٤',
        3: '٠٤ نوفمبر ٢٠١٦',
        4: '٠٤ نوفمبر',
        5: '٠٤/١١/٢٠١٦',
        6: 'نوفمبر ٠٤',
        7: 'نوفمبر ٢٠١٦ م',
        8: '٤/١١/٢٠١٦',
        9: 'نوفمبر-٢٠١٦',
        10: '٠٤-نوفمبر',
        11: 'نوفمبر ٤/٢٠١٦',
        12: '٤-نوفمبر-٢٠١٦ م',
        13: 'نوفمبر ٤,٢٠١٦ م',
        14: 'الجمعة ٤-١١-٢٠١٦',
        15: 'الجمعة نوفمبر ٤/٢٠١٦ م',
        16: 'الجمعة ٤ ١١ ٢٠١٦',
        17: 'نوفمبر ٤,٢٠١٦ الجمعة',
        18: 'الجمعة ٤-نوفمبر-٢٠١٦',
        19: 'نوفمبر,٢٠١٦',
        20: 'نوفمبر ٤',
        21: '٤ نوفمبر ٢٠١٦',
        22: '٢ : ٣٠',
        23: '٢:٣٠:٢٢',
        24: '٢:٣٠:٢٢ م'
    },
    'ja': {
        0: '11/4/2016',
        1: '11月 04,2016',
        2: '11月 04',
        3: '04 11月 2016',
        4: '04 11月',
        5: '04/11/2016',
        6: '11月 04',
        7: '11月 2016 西暦',
        8: '4/11/2016',
        9: '11月-2016',
        10: '04-11月',
        11: '11月 4/2016',
        12: '4-11月-2016 西暦',
        13: '11月 4,2016 西暦',
        14: '金 4-11-2016',
        15: '金 11月 4/2016 西暦',
        16: '金曜日 4 11 2016',
        17: '11月 4,2016 金曜日',
        18: '金曜日 4-11月-2016',
        19: '11月,2016',
        20: '11月 4',
        21: '4 11月 2016',
        22: '2 : 30',
        23: '2:30:22',
        24: '2:30:22 午後'
    }
};
describe('dateformat', () => {
    let formatInstance: DateFormat = new DateFormat();
    let formatter: Function;
    let result: string;
    let date: Date = new Date('11/4/2016 14:30:22');
    describe('Date Type formatting', () => {
        it('short date format converts properly', () => {
            formatter = DateFormat.dateFormat('en-Us', { type: 'date', skeleton: 'short' }, cldrData);
            result = formatter(date);
            expect(result).toBe('11/4/16');
        });
        it('Medium date format converts properly', () => {
            formatter = DateFormat.dateFormat('en-Us', { type: 'date', skeleton: 'medium' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Nov 4, 2016');
        });
        it('Long date format converts properly', () => {
            formatter = DateFormat.dateFormat('en-Us', { type: 'date', skeleton: 'long' }, cldrData);
            result = formatter(date);
            expect(result).toBe('November 4, 2016');
        });
        it('Full date format converts properly', () => {
            formatter = DateFormat.dateFormat('en-Us', { type: 'date', skeleton: 'full' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Friday, November 4, 2016');
        });
        it('short date Format with no type specified ', () => {
            formatter = DateFormat.dateFormat('en-Us', { skeleton: 'short' }, cldrData);
            result = formatter(date);
            expect(result).toBe('11/4/16');
        });
    });
    describe('Time Type formatting', () => {
        it('short time format converts properly', () => {
            formatter = DateFormat.dateFormat('en-Us', { type: 'time', skeleton: 'short' }, cldrData);
            result = formatter(date);
            expect(result).toBe('2:30 PM');
        });
        it('Medium time format converts properly', () => {
            formatter = DateFormat.dateFormat('en-Us', { type: 'time', skeleton: 'medium' }, cldrData);
            result = formatter(date);
            expect(result).toBe('2:30:22 PM');
        });
        it('Long time format converts properly with UTC', () => {
            formatter = DateFormat.dateFormat('en-Us', { type: 'time', skeleton: 'long' }, cldrData);
            result = formatter(date);
            expect(result).toBe('2:30:22 PM GMT' + getTimeZoneString(date, true));
        });
        it('Full time format converts properly', () => {
            formatter = DateFormat.dateFormat('en-Us', { type: 'time', skeleton: 'full' }, cldrData);
            result = formatter(date);
            expect(result).toBe('2:30:22 PM GMT' + getTimeZoneString(date));
        });
    });
    describe('check if empty string converts to single quotes in custom format ', () => {
        it('empty string at end', () => {
            formatter = DateFormat.dateFormat('en', { format: 'h : mm \'\' ' }, cldrData);
            result = formatter(date);
            expect(result).toBe('2 : 30 \' ');
        });
        it('empty string at front', () => {
            formatter = DateFormat.dateFormat('en', { format: ' \'\' h : mm' }, cldrData);
            result = formatter(date);
            expect(result).toBe(' \' 2 : 30');
        });
        it('empty string at middle', () => {
            formatter = DateFormat.dateFormat('en', { format: 'h \'\' mm' }, cldrData);
            result = formatter(date);
            expect(result).toBe('2 \' 30');
        });
        it('string', () => {
            formatter = DateFormat.dateFormat('en', { format: '\'Time: \'h:mm' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Time: 2:30');
        });
    });
    describe('check culture specific time seperator works properly', () => {
        it('for culture "da"', () => {
            formatter = DateFormat.dateFormat('da', { format: 'h : mm' }, cldrData);
            result = formatter(date);
            expect(result).toBe('2 . 30');
        });
    });
    parseCultures.forEach((culName: string) => {
        let locRes: Object = expOut[culName];
        describe('Custom date time formatting', () => {
            it('custom date format "M/d/y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'M/d/y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[0]);
            });
            it('custom date format "MMM dd,y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'MMM dd,y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[1]);
            });
            it('custom date format "MMMM dd" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'MMMM dd' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[2]);
            });
            it('custom date format "dd MMM y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'dd MMM y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[3]);
            });
            it('custom date format "dd MMMM" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'dd MMMM' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[4]);
            });
            it('custom date format "dd/MM/y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'dd/MM/y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[5]);
            });
            it('custom date format "MMM dd" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'MMM dd' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[6]);
            });
            it('custom date format "MMMM y GG" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'MMMM y GG' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[7]);
            });
            it('custom date format "d/M/y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'd/M/y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[8]);
            });
            it('custom date format "MMM-y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'MMM-y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[9]);
            });
            it('custom date format "dd-MMMM" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'dd-MMMM' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[10]);
            });
            it('custom date format "MMM d/y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'MMM d/y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[11]);
            });
            it('custom date format "d-MMM-y GG" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'd-MMM-y GG' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[12]);
            });
            it('custom date format "MMMM d,y GG" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'MMMM d,y GG' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[13]);
            });
            it('custom date format "E d-M-y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'E d-M-y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[14]);
            });
            it('custom date format "E MMM d/y GG" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'E MMM d/y GG' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[15]);
            });
            it('custom date format "EEEE d MM y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'EEEE d MM y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[16]);
            });
            it('custom date format "MMMM d,y EEEE" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'MMMM d,y EEEE' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[17]);
            });
            it('custom date format "EEEE d-MMM-y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'EEEE d-MMM-y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[18]);
            });
            it('custom date format "MMMM,y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'MMMM,y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[19]);
            });
            it('custom date format "MMMM d" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'MMMM d' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[20]);
            });
            it('custom date format "d MMM y" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'd MMM y' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[21]);
            });
            it('custom time format "h : mm" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'h : mm' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[22]);
            });
            it('custom time format "h:mm:ss" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'h:mm:ss' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[23]);
            });
            it('custom time format "h:mm:ss a" converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { format: 'h:mm:ss a' }, cldrData);
                result = formatter(date);
                expect(result).toBe(locRes[24]);
            });
            it('custom time format "qop" returns same', () => {
                formatter = DateFormat.dateFormat(culName, { format: "qop" }, cldrData);
                result = formatter(date);
                expect(result).toBe('qop');
            });
        });
    });
    parseCultures.forEach((culName: string) => {
        let localRes: Object = expectOut[culName];
        describe('Date Time Type formatting for ' + culName, () => {
            it('short Date time format converts properly', () => {
                formatter = DateFormat.dateFormat(culName, { type: 'dateTime', skeleton: 'short' }, cldrData);
                result = formatter(date);
                expect(result).toBe(localRes[strRep[0]]);
            });
            it('Medium Date time format for ' + culName, () => {
                formatter = DateFormat.dateFormat(culName, { type: 'dateTime', skeleton: 'medium' }, cldrData);
                result = formatter(date);
                expect(result).toBe(localRes[strRep[1]]);
            });
            it('Long Datetime format for ' + culName, () => {
                formatter = DateFormat.dateFormat(culName, { type: 'dateTime', skeleton: 'long' }, cldrData);
                let reDate: Date = DateParser.dateParser(culName, { type: 'dateTime', skeleton: 'long' }, cldrData)(formatter(date));
                expect(dateMatched(reDate, date)).toBe(true);
            });
            it('Full Datetime format for ' + culName, () => {
                formatter = DateFormat.dateFormat(culName, { type: 'dateTime', skeleton: 'full' }, cldrData);
                let reDate: Date = DateParser.dateParser(culName, { type: 'dateTime', skeleton: 'full' }, cldrData)(formatter(date));
                expect(dateMatched(reDate, date)).toBe(true);
            });
        });
    });
    describe('era validation check', () => {
        it('eraNames ', () => {
            let formater: Function = DateFormat.dateFormat('dummy', { skeleton: 'G' }, cldrData);
            expect(formater(date)).toBe('2016 Anno Domini');
        });
        it('eraNarrow', () => {
            let formater: Function = DateFormat.dateFormat('dummy', { skeleton: 'GG' }, cldrData);
            expect(formater(date)).toBe('2016 A');
        });
    });
    describe('Addiitonal skeletons', () => {
        let date1: Date = new Date('1/14/2000 4:3:2');
        describe('checks day of month', () => {
            describe(' skeleton "d" numeric type', () => {
                beforeAll(() => {
                    formatter = DateFormat.dateFormat('en-US', { skeleton: 'd' }, cldrData);
                });
                it('using single digit day', () => {
                    expect(formatter(date)).toBe('4');
                });
                it('using two digit day', () => {
                    expect(formatter(date1)).toBe('14');
                });
            });

        });
        describe('checks month of year', () => {
            describe(' skeleton "M" numeric type', () => {
                beforeAll(() => {
                    formatter = DateFormat.dateFormat('en-US', { skeleton: 'M' }, cldrData);
                });
                it('using single digit day', () => {
                    expect(formatter(date1)).toBe('1');
                });
                it('using two digit day', () => {
                    expect(formatter(date)).toBe('11');
                });
            });

            it('skeleton "MMM"   short form ', () => {
                formatter = DateFormat.dateFormat('en-US', { skeleton: 'MMM' }, cldrData);
                expect(formatter(date)).toBe('Nov');
                expect(formatter(date1)).toBe('Jan');
            });
        });
        describe('checks weekday of week', () => {
            it('skelton "E" short form', () => {
                formatter = DateFormat.dateFormat('en-US', { skeleton: 'E' }, cldrData);
                result = formatter(date);
                expect(result).toBe('Fri');
            });
        });
        describe('checks year', () => {
            it('skeleton "y" numeric type', () => {
                formatter = DateFormat.dateFormat('en-US', { skeleton: 'y' }, cldrData);
                expect(formatter(date)).toBe('2016');
                expect(formatter(date1)).toBe('2000');
                expect(formatter(new Date('1/4/20150'))).toBe('20150');
            });

        });
        it('Pattern "EHm" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'EHm' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Fri 14:30');
        });
        it('Pattern "EHms" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'EHms' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Fri 14:30:22');
        });
        it('Pattern "Ed" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'Ed' }, cldrData);
            result = formatter(date);
            expect(result).toBe('4 Fri');
        });
        it('Pattern "H" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'H' }, cldrData);
            result = formatter(date);
            expect(result).toBe('14');
        });
        it('Pattern "h" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'h' }, cldrData);
            result = formatter(new Date('11/4/2016 10:30:22'));
            expect(result).toBe('10 AM');
        });
        it('Pattern "Hms" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'Hms' }, cldrData);
            result = formatter(date);
            expect(result).toBe('14:30:22');
        });
        it('Pattern "Hm" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'Hm' }, cldrData);
            result = formatter(date);
            expect(result).toBe('14:30');
        });
        it('Pattern "hm" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'hm' }, cldrData);
            result = formatter(new Date('11/4/2016 12:30:22'));
            expect(result).toBe('12:30 PM');
        });
        it('Pattern "hms" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'hms' }, cldrData);
            result = formatter(date);
            expect(result).toBe('2:30:22 PM');
        });
        it('Pattern "ms" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'ms' }, cldrData);
            result = formatter(date);
            expect(result).toBe('30:22');
        });
        it('Pattern "MEd" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'MEd' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Fri, 11/4');
        });
        it('Pattern "MMEd" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'MMMEd' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Fri, Nov 4');
        });
        it('Pattern "Md" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'Md' }, cldrData);
            result = formatter(date);
            expect(result).toBe('11/4');
        });
        it('Pattern "yM" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'yM' }, cldrData);
            result = formatter(date);
            expect(result).toBe('11/2016');
        });
        it('Pattern "yMEd" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'yMEd' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Fri, 11/4/2016');
        });
        it('Pattern "yMMM" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'yMMM' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Nov 2016');
        });
        it('Pattern "yMMMEd" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'yMMMEd' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Fri, Nov 4, 2016');
        });
        it('Pattern "yMMMd" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'yMMMd' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Nov 4, 2016');
        });
        it('Pattern "yMd" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'yMd' }, cldrData);
            result = formatter(date);
            expect(result).toBe('11/4/2016');
        });
        it('Pattern "Ehms" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'Ehms' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Fri 2:30:22 PM');
        });
        it('Pattern "y" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'y' }, cldrData);
            result = formatter(date);
            expect(result).toBe('2016');
        });
        it('Pattern "yMMM" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'yMMM' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Nov 2016');
        });
        it('Pattern "yMMMEd" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'yMMMEd' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Fri, Nov 4, 2016');
        });
        it('Pattern "yMMMd" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'yMMMd' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Nov 4, 2016');
        });
        it('Pattern "Gy" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'Gy' }, cldrData);
            result = formatter(date);
            expect(result).toBe('2016 AD');
        });
        it('Pattern "GyMMM" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'GyMMM' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Nov 2016 AD');
        });
        it('Pattern "GyMMMd" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'GyMMMd' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Nov 4, 2016 AD');
        });
        it('Pattern "GyMMMEd" converts properly', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'GyMMMEd' }, cldrData);
            result = formatter(date);
            expect(result).toBe('Fri, Nov 4, 2016 AD');
        });
    });
    describe('Invalid inputs', () => {
        it('invalid date returns null value', () => {
            formatter = DateFormat.dateFormat('en-US', { skeleton: 'GyMMMEd' }, cldrData);
            expect(formatter(new Date('test'))).toBeNull();
        });
        it('invalid pattern', () => {
            expect(() => { DateFormat.dateFormat('en-US', { skeleton: 'ss' }, cldrData) }).toThrow();
        });
    });
    describe('function', () => {
        it('getTimeZoneValue', () => {
            expect((DateFormat as any).getTimeZoneValue(-330, '+HH:mm;-HH:mm')).toBe('+05:30');
            expect((DateFormat as any).getTimeZoneValue(330, '+H;-H')).toBe('-5');
        });
        it('parserBase get Numbering system with no digits', () => {
            let result: any = ParserBase.getNumberMapper({
                numbers: { 'defaultNumberingSystem': 'latn' }
            }, { latn: {} });
            expect(result.symbolNumberSystem).toBe(undefined);
            expect(result.numericPair).toBe(undefined);
            expect(result.numberParseRegex).toBe(undefined);
        });
        it('parserBase get Numbering system with no defaultnumbering system', () => {
            let result: any = ParserBase.getNumberMapper({}, {});
            expect(result.symbolNumberSystem).toBe(undefined);
            expect(result.numericPair).toBe(undefined);
            expect(result.numberParseRegex).toBe(undefined);
        });
    });
})