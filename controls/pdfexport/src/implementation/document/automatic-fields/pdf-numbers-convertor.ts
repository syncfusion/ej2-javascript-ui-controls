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
        let retvalM : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 1000, 'M');
        retval += retvalM.returnValue;
        intArabic = retvalM.intArabic;
        let retvalCM : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 900, 'CM');
        retval += retvalCM.returnValue;
        intArabic = retvalCM.intArabic;
        let retvalD : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 500, 'D');
        retval += retvalD.returnValue;
        intArabic = retvalD.intArabic;
        let retvalCD : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 400, 'CD');
        retval += retvalCD.returnValue;
        intArabic = retvalCD.intArabic;
        let retvalC : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 100, 'C');
        retval += retvalC.returnValue;
        intArabic = retvalC.intArabic;
        let retvalXC : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 90, 'XC');
        retval += retvalXC.returnValue;
        intArabic = retvalXC.intArabic;
        let retvalL : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 50, 'L');
        retval += retvalL.returnValue;
        intArabic = retvalL.intArabic;
        let retvalXL : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 40, 'XL');
        retval += retvalXL.returnValue;
        intArabic = retvalXL.intArabic;
        let retvalX : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 10, 'X');
        retval += retvalX.returnValue;
        intArabic = retvalX.intArabic;
        let retvalIX : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 9, 'IX');
        retval += retvalIX.returnValue;
        intArabic = retvalIX.intArabic;
        let retvalV : {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 5, 'V');
        retval += retvalV.returnValue;
        intArabic = retvalV.intArabic;
        let retvalIV: {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 4, 'IV');
        retval += retvalIV.returnValue;
        intArabic = retvalIV.intArabic;
        let retvalI: {returnValue : string , intArabic : number } = this.generateNumber(intArabic, 1, 'I');
        retval += retvalI.returnValue;
        intArabic = retvalI.intArabic;

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
    private static generateNumber(value : number, magnitude : number, letter : string) : { returnValue : string, intArabic : number } {
        let numberstring : string = '';
        while (value >= magnitude) {
            value -= magnitude;
            numberstring += letter;
        }
        return {returnValue : numberstring.toString(), intArabic : value };
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