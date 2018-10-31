import { NumberParser } from '../../src/intl/number-parser';
import { NumberFormat } from '../../src/intl/number-formatter';
import { NumberFormatOptions, cldrData } from '../../src/internationalization';
import { extend } from '../../src/util';
import { IntlBase } from '../../src/intl/intl-base';
const nCultures: string[] = ['en', 'ar-QA', 'ja'];
const str: string[] = ['P', 'N', 'C', 'A'];
const strMatcher: Object = { P: 'percent', N: 'decimal', C: 'currency' };
function getParsedNumber(culture: string, option: NumberFormatOptions, d: number): number {
    let fString: String = getNumberString(culture, option, d);
    let val: number = NumberParser.numberParser(culture, option, cldrData)(fString);
    return val;
}
function getNumberString(culture: string, option: NumberFormatOptions, d: number): string {
    let curCode: Object = { 'en': 'USD', 'ar-QA': 'QAR', 'ja': 'JPY' };
    let ioption: Object = extend({}, option, { currency: curCode[culture] });
    let val: string = NumberFormat.numberFormatter(culture, ioption, cldrData)(d);
    return val;
}
/**
 * Spec for number parser
 */
let type: string;
let isja: boolean;
let numParser: NumberParser = new NumberParser();
const intValue: number = 1243141241;
const decValue: number = 99312.34;
const decValue1: number = 99312.3;
describe('numberParser', () => {
    for (let cul of nCultures) {
        for (let s of str) {
            type = strMatcher[s];
            describe('Parse ' + type + ' type value in culture- ' + cul, () => {
                it('check integer value without decimal points', () => {
                    let result: number = getParsedNumber(cul, { format: s }, intValue);
                    expect(result).toBe(intValue);
                });
                it('check integer value without decimal points negative Number', () => {
                    let result: number = getParsedNumber(cul, { format: s }, -intValue);
                    expect(result).toBe(-intValue);
                });
                it('check decimal value', () => {
                    let result: number = getParsedNumber(cul, { format: s }, decValue);
                    expect(result).toBe(decValue);
                });
                it('check decimal value with negative Number', () => {
                    let result: number = getParsedNumber(cul, { format: s }, -decValue);
                    expect(result).toBe(-decValue);
                });
            });
        }
        describe('Parse for custom number formatting in culture: ' + cul, () => {
            it('integer without decimal', () => {
                let result: number = getParsedNumber(cul, { format: '###,0' }, intValue);
                expect(result).toBe(intValue);
            });
            it('decimal value with two decimal places', () => {
                let result: number = getParsedNumber(cul, { format: '0.##' }, decValue);
                expect(result).toBe(decValue);
            });
            it('decimal value with one decimal place', () => {
                let result: number = getParsedNumber(cul, { format: '##0.#' }, decValue);
                expect(result).toBe(decValue1);
            });
            it('percent type integer value', () => {
                let result: number = getParsedNumber(cul, { format: '### %' }, intValue);
                expect(result).toBe(intValue);
            });
            it('percent symbol in string not type percent', () => {
                let result: number = getParsedNumber(cul, { format: '### \'%\' ' }, intValue);
                expect(result).toBe(intValue);
            });
            it('minus sign in string but not negative value', () => {
                let result: number = getParsedNumber(cul, { format: ' \'-\'##0 ' }, intValue);
                expect(result).toBe(intValue);
            });
            it('negative integer value', () => {
                let result: number = getParsedNumber(cul, { format: '###' }, -intValue);
                expect(result).toBe(-intValue);
            });
            it('percent in negative format', () => {
                let result: number = getParsedNumber(cul, { format: '###;###%' }, -intValue);
                expect(result).toBe(-intValue);
            });
            it('percent in positive format', () => {
                let result: number = getParsedNumber(cul, { format: '##%;##' }, -intValue);
                expect(result).toBe(-intValue);
            });
            it('percent in positive format', () => {
                let result: number = getParsedNumber(cul, { format: '##%;##' }, intValue);
                expect(result).toBe(intValue);
            });
            it('fraction value one decimal place in negative value', () => {
                let result: number = getParsedNumber(cul, { format: '##.#%;##.#' }, -decValue);
                expect(result).toBe(-decValue1);
            });
            it('currency value', () => {
                let result: number = getParsedNumber(cul, { format: '$ ###' }, intValue);
                expect(result).toBe(intValue);
            });
            it('', () => {
                let result: number = getParsedNumber(cul, { format: '$#.#' }, decValue);
                expect(result).toBe(decValue1);
            });
        });
    }
    describe('Accounting type parsing', () => {
        it('negative number  accounting type for culture en', () => {
            let result: number = getParsedNumber('en', { format: 'A' }, -231231.22);
            expect(result).toBe(-231231.22);
        });
        it('negative number accounting type for culture ar-QA ', () => {
            let result: number = getParsedNumber('ar-QA', { format: 'A' }, -1231231.54);
            expect(result).toBe(-1231231.54);
        });
        it('positive number accounting type', () => {
            let result: number = getParsedNumber('en', { format: 'A' }, 231231.22);
            expect(result).toBe(231231.22);
        });
    });
    describe('Empty skeleton format converts to default format', () => {
        it('', () => {
            let result: number = getParsedNumber('en', { format: '' }, 231231);
            expect(result).toBe(231231);
        });
    });
    describe('Invalid skeleton format throws error', () => {
        it('', () => {
            expect(() => { NumberParser.numberParser('en', { format: 'D' }, cldrData) }).toBeUndefined;
        });
    });
    describe('Invalid number return NaN', () => {
        it('', () => {
            let result: number = NumberParser.numberParser('en', { format: 'N' }, cldrData)('123,34.22.22');
            expect(result).toBeNaN();
        });
    });
    describe('Numeric value given with decimal points parsed properly', () => {
        it('', () => {
            let result: number = NumberParser.numberParser('en', { format: 'N' }, cldrData)('.22');
            expect(result).toBe(0.22);
        });
    });
    describe('Infinity value parsing returns null', () => {
        it('', () => {
            let result: number = NumberParser.numberParser('en', { format: 'N' }, cldrData)('∞');
            expect(result).toBe(Infinity);
        });
    });
    describe('fraction values parsing', () => {
        it('skeleton "N3"', () => {
            let result: number = NumberParser.numberParser('en', { format: 'N3' }, cldrData)('123.12345');
            expect(result).toBe(123.123);
        });
        it('skeleton "P2"', () => {
            let result: number = NumberParser.numberParser('en', { format: 'P2' }, cldrData)('2671.6789');
            expect(result).toBe(26.72);
        });
    });
    describe('exponential  value parsing', () => {
        it('with "e" prefix ', () => {
            let result: number = NumberParser.numberParser('en', { format: 'N' }, cldrData)('2.443433247197184e+34');
            expect(result).toBe(2.443433247197184e+34);
        });
        it('with "E" prefix ', () => {
            let result: number = NumberParser.numberParser('en', { format: 'P2' }, cldrData)('2.443433247197184E+34');
            expect(result).toBe(2.443433247197184e+32);
        });
    });
    describe('get Number Format function', () => {
        it('default', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { });
            expect(result).toBe('###0');
        });
        it('N format', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'N' });
            expect(result).toBe('###0');
        });
        it('N format group', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'N', useGrouping: true });
            expect(result).toBe('###,##0');
        });
        it('N format minInt 3', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'N', minimumIntegerDigits: 3, useGrouping: true });
            expect(result).toBe('000');
        });
        it('N2 format', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'N2'});
            expect(result).toBe('###0.00');
        });
        it('N2 format minInt 4 useGroup', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'N2', minimumIntegerDigits: 4, useGrouping: true });
            expect(result).toBe('##0,000.00');
        });
        it('N3 format', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'N3'});
            expect(result).toBe('###0.000');
        });
        it('N format Maximum Fraction 5', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'N', minimumFractionDigits: 2, maximumFractionDigits: 5 });
            expect(result).toBe('###0.00###')
        });
        it('N format minFraction 3', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'N', minimumFractionDigits: 3 });
            expect(result).toBe('###0.000');
        });
        it('N format minInt 7 grouping', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'N', minimumIntegerDigits: 7, useGrouping: true });
            expect(result).toBe('##0,000,000');
        });
        it('N1 format max fraction 3', () => {
            expect(IntlBase.getActualNumberFormat('en', { format: 'N1', maximumFractionDigits: 3 })).toBe('###0.0');
        });
        it('N format max frac 4', () => {
            expect(IntlBase.getActualNumberFormat('en', { format: 'N', maximumFractionDigits: 4 })).toBe('###0.####');
        });
        it('N4 format', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'N4'});
            expect(result).toBe('###0.0000');
        });
        it('C format', () => {
            expect(IntlBase.getActualNumberFormat('en', { format: 'C' })).toBe('$###0.00');
        });
        it('C2 format', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'C2', currency: 'USD' }, cldrData);
            expect(result).toBe('$###0.00');
        });
        it('C2 format with de culture', () => {
            let result: string = IntlBase.getActualNumberFormat('de', { format: 'C2', currency: 'USD' }, cldrData);
            expect(result).toBe('###0.00 $');
        });
        it('C2 format with de culture and EUR code', () => {
            let result: string = IntlBase.getActualNumberFormat('de', { format: 'C2', currency: 'EUR' }, cldrData);
            expect(result).toBe('###0.00 €');
        });
        it('C2 format currency $', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'C2', currency: '$' });
            expect(result).toBe('$###0.00');
        });
        it('C2 format max fraction 4', () => {
            expect(IntlBase.getActualNumberFormat('en', { format: 'C2', maximumFractionDigits:4 })).toBe('$###0.00');
        });
        it('P2 format', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'P2' });
            expect(result).toBe('###0.00 %');
        });
        it('P3 format', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'P3' });
            expect(result).toBe('###0.000 %');
        });
        it('P3 format minInt 5 grouping', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'P3', minimumIntegerDigits: 5, useGrouping: true });
            let r: string = NumberFormat.numberFormatter('en', {format: 'C'}, cldrData)(0);
            expect(result).toBe('#00,000.000 %')
        });
        it('A format', () => {
            expect(IntlBase.getActualNumberFormat('en', { format:'A' })).toBe('$###0.00;($###0.00)');
        });
        it('A1 format', () => {
            expect(IntlBase.getActualNumberFormat('en', { format: 'A1' })).toBe('$###0.0;($###0.0)');
        });
        it('A1 format max fraction 4', () => {
            expect(IntlBase.getActualNumberFormat('en', { format:'A1', maximumFractionDigits:4 })).toBe('$###0.0;($###0.0)');
        });
        it('A3 format', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'A3'});
            expect(result).toBe('$###0.000;($###0.000)');
        });
        it('A5 format', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: 'A5' });
            expect(result).toBe('$###0.00000;($###0.00000)');
        });
        it('custom format \'Hi\'###.0#', () => {
            let result: string = IntlBase.getActualNumberFormat('en', { format: '\'Hi\' ###.0#' });
            expect(result).toBe('"Hi" ###.0#')
        });
    });
});