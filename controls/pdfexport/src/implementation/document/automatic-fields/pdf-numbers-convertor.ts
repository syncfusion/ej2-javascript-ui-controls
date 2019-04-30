/**
 * PdfNumbersConvertor.ts class for EJ2-PDF
 * @private
 */
import { PdfNumberStyle } from './../../pages/enum';
/**
 * `PdfNumbersConvertor` for convert page number into numbers, roman letters, etc.,
 * @private
 */
export class PdfNumbersConvertor {
    // Fields
    /**
     * numbers of letters in english [readonly].
     * @default = 26.0
     * @private
     */
    private static readonly letterLimit : number = 26.0;
    /**
     * Resturns `acsii start index` value.
     * @default 64
     * @private
     */
    private static readonly acsiiStartIndex : number = <number>(65 - 1);
    // Static methods
    /**
     * Convert string value from page number with correct format.
     * @private
     */
    public static convert(intArabic : number, numberStyle : PdfNumberStyle) : string {
        let result : string = '';
        switch (numberStyle) {
            case PdfNumberStyle.None:
                result = '';
                break;
            case PdfNumberStyle.Numeric:
                result = intArabic.toString();
                break;
            case PdfNumberStyle.LowerLatin:
                result = this.arabicToLetter(intArabic).toLowerCase();
                break;
            case PdfNumberStyle.LowerRoman:
                result = this.arabicToRoman(intArabic).toLowerCase();
                break;
            case PdfNumberStyle.UpperLatin:
                result = this.arabicToLetter(intArabic);
                break;
            case PdfNumberStyle.UpperRoman:
                result = this.arabicToRoman(intArabic);
                break;
        }
        return result;
    }
    /**
     * Converts `arabic to roman` letters.
     * @private
     */
    private static arabicToRoman(intArabic : number) : string {
        let retval : string = '';
        retval += this.generateNumber(intArabic, 1000, 'M');
        retval += this.generateNumber(intArabic, 900, 'CM');
        retval += this.generateNumber(intArabic, 500, 'D');
        retval += this.generateNumber(intArabic, 400, 'CD');
        retval += this.generateNumber(intArabic, 100, 'C');
        retval += this.generateNumber(intArabic, 90, 'XC');
        retval += this.generateNumber(intArabic, 50, 'L');
        retval += this.generateNumber(intArabic, 40, 'XL');
        retval += this.generateNumber(intArabic, 10, 'X');
        retval += this.generateNumber(intArabic, 9, 'IX');
        retval += this.generateNumber(intArabic, 5, 'V');
        retval += this.generateNumber(intArabic, 4, 'IV');
        retval += this.generateNumber(intArabic, 1, 'I');

        return retval.toString();
    }
    /**
     * Converts `arabic to normal letters`.
     * @private
     */
    private static arabicToLetter(arabic : number) : string {
        let stack : number[] = this.convertToLetter(arabic);
        let result : string = '';
        while (stack.length > 0) {
            let num : number = stack.pop();
            result = this.appendChar(result, num);
        }
        return result.toString();
    }
    /**
     * Generate a string value of an input number.
     * @private
     */
    private static generateNumber(value : number, magnitude : number, letter : string) : string {
        let numberstring : string = '';
        while (value >= magnitude) {
            value -= magnitude;
            numberstring += letter;
        }
        return numberstring.toString();
    }
    /**
     * Convert a input number into letters.
     * @private
     */
    private static convertToLetter(arabic : number) : number[] {
        if (arabic <= 0) {
            throw Error('ArgumentOutOfRangeException-arabic, Value can not be less 0');
        }
        let stack : number[] = [];
        while ((arabic as number) > this.letterLimit) {
            let remainder : number = arabic % this.letterLimit;
            if (remainder === 0.0) {
                arabic = arabic / this.letterLimit - 1;
                remainder = this.letterLimit;
            } else {
                arabic /= this.letterLimit;
            }
            stack.push(remainder as number);
        }
        stack.push(arabic as number);
        return stack;
    }
    /**
     * Convert number to actual string value.
     * @private
     */
    private static appendChar(builder : string, value : number) : string {
        let letter : string = String.fromCharCode(PdfNumbersConvertor.acsiiStartIndex + value);
        builder += letter;
        return builder;
    }
}