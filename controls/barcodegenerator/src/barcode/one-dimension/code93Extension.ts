import { Code93 } from './code93';
import { Code93ExtendedValues, Code93ExtendedArrayAttribute } from '../rendering/canvas-interface';

/**
 * code39 used to calculate the barcode of type 39
 */
export class Code93Extension extends Code93 {
    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     * @param {string} text - Provide the canvas element .
     * @private
     */
    public validateInput(text: string): string {
        const valueCheck: boolean = this.getValue(text);
        if (valueCheck) {
            return undefined;
        } else {
            return 'Supports 128 characters of ASCII.';
        }
    }


    private getValue(text: string): boolean {
        for (let i: number = 0; i < text.length; i++) {
            if (text.charCodeAt(i) > 127) {
                return false;
            }
        }
        return true;
    }

    private barcodeSymbols: Code93ExtendedValues[] = [];

    private getBars(): void {
        this.barcodeSymbols[0] = { value: '', checkDigit: 0, bars: '111213' };
        this.barcodeSymbols[1] = { value: '1', checkDigit: 1, bars: '111213' };
        this.barcodeSymbols[2] = { value: '2', checkDigit: 2, bars: '111312 ' };
        this.barcodeSymbols[3] = { value: '3', checkDigit: 3, bars: '111411 ' };
        this.barcodeSymbols[4] = { value: '4', checkDigit: 4, bars: '121113' };
        this.barcodeSymbols[5] = { value: '5', checkDigit: 5, bars: '121212' };
        this.barcodeSymbols[6] = { value: '6', checkDigit: 6, bars: '121311' };
        this.barcodeSymbols[7] = { value: '7', checkDigit: 7, bars: '111114' };
        this.barcodeSymbols[8] = { value: '8', checkDigit: 8, bars: '131211' };
        this.barcodeSymbols[9] = { value: '9', checkDigit: 9, bars: '141111' };
        this.barcodeSymbols[10] = { value: 'A', checkDigit: 10, bars: '211113' };
        this.barcodeSymbols[11] = { value: 'B', checkDigit: 11, bars: '211212' };
        this.barcodeSymbols[12] = { value: 'C', checkDigit: 12, bars: '211311' };
        this.barcodeSymbols[13] = { value: 'D', checkDigit: 13, bars: '221112' };
        this.barcodeSymbols[14] = { value: 'E', checkDigit: 14, bars: '221211 ' };
        this.barcodeSymbols[15] = { value: 'F', checkDigit: 15, bars: '231111' };
        this.barcodeSymbols[16] = { value: 'G', checkDigit: 16, bars: '112113' };
        this.barcodeSymbols[17] = { value: 'H', checkDigit: 17, bars: '112212' };
        this.barcodeSymbols[18] = { value: 'I', checkDigit: 18, bars: '112311' };
        this.barcodeSymbols[19] = { value: 'J', checkDigit: 19, bars: '122112' };
        this.barcodeSymbols[20] = { value: 'K', checkDigit: 20, bars: '132111 ' };
        this.barcodeSymbols[21] = { value: 'L', checkDigit: 21, bars: '111123' };
        this.barcodeSymbols[22] = { value: 'M', checkDigit: 22, bars: '111222' };
        this.barcodeSymbols[23] = { value: 'N', checkDigit: 23, bars: '111321' };
        this.barcodeSymbols[24] = { value: 'O', checkDigit: 24, bars: '121122 ' };
        this.barcodeSymbols[25] = { value: 'P', checkDigit: 25, bars: '131121 ' };
        this.barcodeSymbols[26] = { value: 'Q', checkDigit: 26, bars: '212112 ' };
        this.barcodeSymbols[27] = { value: 'R', checkDigit: 27, bars: ' 212211 ' };
        this.barcodeSymbols[28] = { value: 'S', checkDigit: 28, bars: '211122' };
        this.barcodeSymbols[29] = { value: 'T', checkDigit: 29, bars: '211221' };
        this.barcodeSymbols[30] = { value: 'U', checkDigit: 30, bars: '221121' };
        this.barcodeSymbols[31] = { value: 'V', checkDigit: 31, bars: '222111' };
        this.barcodeSymbols[32] = { value: 'W', checkDigit: 32, bars: '112122' };
        this.barcodeSymbols[33] = { value: 'X', checkDigit: 33, bars: '112221' };
        this.barcodeSymbols[34] = { value: 'Y', checkDigit: 34, bars: '122121' };
        this.barcodeSymbols[35] = { value: 'Z', checkDigit: 35, bars: ' 123111' };
        this.barcodeSymbols[36] = { value: '-', checkDigit: 36, bars: '121131' };
        this.barcodeSymbols[37] = { value: '.', checkDigit: 37, bars: '311112' };
        this.barcodeSymbols[38] = { value: ' ', checkDigit: 38, bars: '311211' };
        this.barcodeSymbols[39] = { value: '$', checkDigit: 39, bars: '321111' };
        this.barcodeSymbols[40] = { value: '/', checkDigit: 40, bars: '112131' };
        this.barcodeSymbols[41] = { value: '+', checkDigit: 41, bars: '113121' };
        this.barcodeSymbols[42] = { value: '%', checkDigit: 42, bars: '211131' };
        this.barcodeSymbols[43] = { value: '*', checkDigit: 42, bars: '111141' };
        this.barcodeSymbols[44] = { value: 'ÿ', checkDigit: 47, bars: '1111411' };
        this.barcodeSymbols[45] = { value: 'û', checkDigit: 43, bars: '121220' };
        this.barcodeSymbols[46] = { value: 'ü', checkDigit: 44, bars: '312111 ' };
        this.barcodeSymbols[47] = { value: 'ý', checkDigit: 45, bars: '311121' };
        this.barcodeSymbols[48] = { value: 'þ', checkDigit: 46, bars: '122211' };
    }
    private GetExtendedText(string: Code93ExtendedArrayAttribute[]): void {
        const code: string = this.value;
        let extcodes: Code93ExtendedArrayAttribute;
        this.extendedText = '';
        for (let i: number = 0; i < code.length; i++) {
            for (let j: number = string.length - 1; j > 0; j--) {
                if (string[j] && string[j].value && string[j].character === code[i]) {
                    extcodes = string[j];
                    break;
                }
            }
            if (extcodes.keyword && extcodes.value) {
                this.extendedText += extcodes.keyword + extcodes.value;
            } else if (extcodes.value && extcodes.value) {
                this.extendedText += extcodes.value;
            }
        }
    }
    /**
     * Draw the barcode SVG.\
     *
     * @returns {void} Draw the barcode SVG .
     *  @param {HTMLElement} canvas - Provide the canvas element .
     * @private
     */
    public drawCode93(canvas: HTMLElement): void {
        this.getBars();
        const temp: string[] = [];
        const string: Code93ExtendedArrayAttribute[] = this.getArrayValue();
        this.GetExtendedText(string);
        const checkDigit: string[] = this.CalculateCheckDigit();
        for (let i: number = 0; i < checkDigit.length; i++) {
            this.extendedText += checkDigit[i];
        }
        temp[0] = '*' + this.extendedText + 'ÿ';
        let encodingValue: string[] = [];
        encodingValue = this.encoding(temp);
        this.calculateBarCodeAttributes(encodingValue, canvas);
    }

    private extendedText: string;
    private GetCheckSumSymbols(): string[] {
        let text: string = this.extendedText;
        let dataToEncode: string = text;
        const charArray: string[] = [];
        let checkValue: number = 0;
        let length: number = dataToEncode.length;
        let numi: number;
        for (let i: number = 0; i < length; i++) {
            let num4: number = (length - i) % 20;
            if (num4 === 0) {
                num4 = 20;
            }
            for (let j: number = 0; j < this.barcodeSymbols.length; j++) {
                if (dataToEncode[i] === this.barcodeSymbols[j].value) {
                    numi = this.barcodeSymbols[j].checkDigit;
                }
            }

            checkValue += numi * num4;
        }
        checkValue = checkValue % 0x2f;
        let char1: string = '';
        for (let k: number = 0; k < this.barcodeSymbols.length; k++) {
            if (checkValue === this.barcodeSymbols[k].checkDigit) {
                char1 = this.barcodeSymbols[k].value;
                break;
            }
        }
        let data: string = this.extendedText;
        data = data + char1;
        charArray[0] = char1;
        text = data;
        checkValue = 0;
        dataToEncode = text;
        length = dataToEncode.length;
        for (let i: number = 0; i < length; i++) {
            let num4: number = (length - i) % 15;
            if (num4 === 0) {
                num4 = 15;
            }
            for (let m: number = 0; m < this.barcodeSymbols.length; m++) {
                if (dataToEncode[i] === this.barcodeSymbols[m].value) {
                    const tempi: number = this.barcodeSymbols[m].checkDigit;
                    checkValue += tempi * num4;
                }
            }
        }
        checkValue = checkValue % 0x2f;

        text = text + checkValue;

        let char2: string = ' ';
        for (let i: number = 0; i < this.barcodeSymbols.length; i++) {
            if (checkValue === this.barcodeSymbols[i].checkDigit) {
                char2 = this.barcodeSymbols[i].value;
                break;
            }
        }
        data = data + char2;
        charArray[1] = char2;
        return charArray;

    }
    private CalculateCheckDigit(): string[] {
        const code: string = this.extendedText;
        let checkValue: number = 0;
        for (let i: number = 0; i < code.length; i++) {
            for (let j: number = 0; j < this.barcodeSymbols.length; j++) {
                if (code[i] === this.barcodeSymbols[j].value) {
                    // eslint-disable-next-line
                    checkValue += this.barcodeSymbols[j].checkDigit;
                }
            }
        }
        const ch: string[] = this.GetCheckSumSymbols();
        return ch;
    }

    /* tslint:disable */
    private getArrayValue(): Code93ExtendedArrayAttribute[] {
        const arrayValue: Code93ExtendedArrayAttribute[] = [];
        arrayValue[0] = { character: '\0', keyword: 'ü', value: 'U' };
        arrayValue[1] = { character: '\x0001', keyword: 'û', value: 'A' };
        arrayValue[2] = { character: '\x0002', keyword: 'x00fb', value: 'B' };
        arrayValue[3] = { character: '\x0003', keyword: 'û', value: 'C' };
        arrayValue[4] = { character: '\x0004', keyword: 'û', value: 'D' };
        arrayValue[5] = { character: '\x0005', keyword: 'û', value: 'E' };
        arrayValue[6] = { character: '\x0006', keyword: 'û', value: 'F' };
        // eslint-disable-next-line
        arrayValue[7] = { character: '\a', keyword: 'û', value: 'G' };
        arrayValue[8] = { character: '\b', keyword: 'û', value: 'H' };
        arrayValue[9] = { character: '\t', keyword: 'û', value: 'I' };
        arrayValue[10] = { character: '\n', keyword: 'û', value: 'J' };
        arrayValue[12] = { character: '\v', keyword: 'û', value: 'K' };
        arrayValue[13] = { character: '\f', keyword: 'û', value: 'L' };
        arrayValue[14] = { character: '\r', keyword: 'û', value: 'M' };
        arrayValue[15] = { character: '\x000e', keyword: 'û', value: 'N' };
        arrayValue[16] = { character: '\x000f', keyword: 'û', value: 'O' };
        arrayValue[17] = { character: '\x0010', keyword: 'û', value: 'P' };
        arrayValue[18] = { character: '\x0011', keyword: 'û', value: 'Q' };
        arrayValue[19] = { character: '\x0012', keyword: 'û', value: 'R' };
        arrayValue[20] = { character: '\x0013', keyword: 'û', value: 'S' };
        arrayValue[21] = { character: '\x0014', keyword: 'û', value: 'T' };
        arrayValue[22] = { character: '\x0015', keyword: 'û', value: 'U' };
        arrayValue[23] = { character: '\x0016', keyword: 'û', value: 'V' };
        arrayValue[24] = { character: '\x0017', keyword: 'û', value: 'W' };
        arrayValue[25] = { character: '\x0018', keyword: 'û', value: 'X' };
        arrayValue[26] = { character: '\x0019', keyword: 'û', value: 'Y' };
        arrayValue[27] = { character: '\x001a', keyword: 'û', value: 'Z' };
        arrayValue[28] = { character: '\x001b', keyword: 'ü', value: 'A' };
        arrayValue[29] = { character: '\x001c', keyword: 'ü', value: 'B' };
        arrayValue[30] = { character: '\x001d', keyword: 'ü', value: 'C' };
        arrayValue[31] = { character: '\x001e', keyword: 'ü', value: 'D' };
        arrayValue[32] = { character: '\x001f', keyword: 'ü', value: 'E' };
        arrayValue[33] = { character: ' ', keyword: ' ' };
        arrayValue[34] = { character: '!', keyword: 'ý', value: 'A' };
        arrayValue[35] = { character: '"', keyword: 'ý', value: 'B' };
        arrayValue[36] = { character: '#', keyword: 'ý', value: 'C' };
        arrayValue[37] = { character: '$', keyword: 'ý', value: 'D' };
        arrayValue[38] = { character: '%', keyword: 'ý', value: 'E' };
        arrayValue[39] = { character: '&', keyword: 'ý', value: 'F' };
        arrayValue[40] = { character: '\'', keyword: 'ý', value: 'G' };
        arrayValue[41] = { character: '(', keyword: 'ý', value: 'H' };
        arrayValue[42] = { character: ')', keyword: 'ý', value: 'I' };
        arrayValue[43] = { character: '*', keyword: 'ý', value: 'J' };
        arrayValue[44] = { character: '+', keyword: 'ý', value: 'K' };
        arrayValue[45] = { character: ',', keyword: 'ý', value: 'L' };
        arrayValue[46] = { character: '-', keyword: 'ý', value: 'M' };
        arrayValue[47] = { character: '.', keyword: 'ý', value: 'N' };
        arrayValue[48] = { character: '/', keyword: 'ý', value: 'O' };
        arrayValue[49] = { character: '0', value: '0' };
        arrayValue[50] = { character: '1', value: '1' };
        arrayValue[51] = { character: '2', value: '2' };
        arrayValue[52] = { character: '3', value: '3' };
        arrayValue[53] = { character: '4', value: '4' };
        arrayValue[54] = { character: '5', value: '5' };
        arrayValue[55] = { character: '6', value: '6' };
        arrayValue[56] = { character: '7', value: '7' };
        arrayValue[57] = { character: '8', value: '8' };
        arrayValue[58] = { character: '9', value: '9' };
        arrayValue[59] = { character: ':', keyword: 'ý', value: 'Z' };
        arrayValue[60] = { character: ';', keyword: 'ü', value: 'F' };
        arrayValue[61] = { character: '<', keyword: 'ü', value: 'G' };
        arrayValue[62] = { character: '=', keyword: 'ü', value: 'H' };
        arrayValue[63] = { character: '>', keyword: 'ü', value: 'I' };
        arrayValue[64] = { character: '?', keyword: 'ü', value: 'J' };
        arrayValue[65] = { character: '@', keyword: 'ü', value: 'V' };
        arrayValue[66] = { character: 'A', value: 'A' };
        arrayValue[67] = { character: 'B', value: 'B' };
        arrayValue[68] = { character: 'C', value: 'C' };
        arrayValue[69] = { character: 'D', value: 'D' };
        arrayValue[70] = { character: 'E', value: 'E' };
        arrayValue[71] = { character: 'F', value: 'F' };
        arrayValue[72] = { character: 'G', value: 'G' };
        arrayValue[73] = { character: 'H', value: 'H' };
        arrayValue[74] = { character: 'I', value: 'I' };
        arrayValue[75] = { character: 'J', value: 'J' };
        arrayValue[76] = { character: 'K', value: 'K' };
        arrayValue[77] = { character: 'L', value: 'L' };
        arrayValue[78] = { character: 'M', value: 'M' };
        arrayValue[79] = { character: 'N', value: 'N' };
        arrayValue[80] = { character: 'O', value: 'O' };
        arrayValue[81] = { character: 'P', value: 'P' };
        arrayValue[82] = { character: 'Q', value: 'Q' };
        arrayValue[83] = { character: 'R', value: 'R' };
        arrayValue[84] = { character: 'S', value: 'S' };
        arrayValue[85] = { character: 'T', value: 'T' };
        arrayValue[86] = { character: 'U', value: 'U' };
        arrayValue[87] = { character: 'V', value: 'V' };
        arrayValue[88] = { character: 'W', value: 'W' };
        arrayValue[88] = { character: 'X', value: 'X' };
        arrayValue[89] = { character: 'Y', value: 'Y' };
        arrayValue[90] = { character: 'Z', value: 'Z' };
        arrayValue[91] = { character: '[', keyword: 'ü', value: 'K' };
        arrayValue[92] = { character: '\\', keyword: 'ü', value: 'L' };
        arrayValue[93] = { character: ']', keyword: 'ü', value: 'M' };
        arrayValue[94] = { character: '^', keyword: 'ü', value: 'N' };
        arrayValue[95] = { character: '_', keyword: 'ü', value: 'O' };
        arrayValue[96] = { character: '`', keyword: 'ü', value: 'W' };
        arrayValue[97] = { character: 'a', keyword: 'þ', value: 'A' };
        arrayValue[98] = { character: 'b', keyword: 'þ', value: 'B' };
        arrayValue[99] = { character: 'c', keyword: 'þ', value: 'C' };
        arrayValue[100] = { character: 'd', keyword: 'þ', value: 'D' };
        arrayValue[101] = { character: 'e', keyword: 'þ', value: 'E' };
        arrayValue[102] = { character: 'f', keyword: 'þ', value: 'F' };
        arrayValue[103] = { character: 'g', keyword: 'þ', value: 'G' };
        arrayValue[104] = { character: 'h', keyword: 'þ', value: 'H' };
        arrayValue[105] = { character: 'i', keyword: 'þ', value: 'I' };
        arrayValue[106] = { character: 'j', keyword: 'þ', value: 'J' };
        arrayValue[107] = { character: 'k', keyword: 'þ', value: 'K' };
        arrayValue[108] = { character: 'l', keyword: 'þ', value: 'L' };
        arrayValue[109] = { character: 'm', keyword: 'þ', value: 'M' };
        arrayValue[110] = { character: 'n', keyword: 'þ', value: 'N' };
        arrayValue[111] = { character: 'o', keyword: 'þ', value: 'O' };
        arrayValue[112] = { character: 'p', keyword: 'þ', value: 'P' };
        arrayValue[113] = { character: 'q', keyword: 'þ', value: 'Q' };
        arrayValue[114] = { character: 'r', keyword: 'þ', value: 'R' };
        arrayValue[115] = { character: 's', keyword: 'þ', value: 'S' };
        arrayValue[116] = { character: 't', keyword: 'þ', value: 'T' };
        arrayValue[117] = { character: 'u', keyword: 'þ', value: 'U' };
        arrayValue[118] = { character: 'v', keyword: 'þ', value: 'V' };
        arrayValue[119] = { character: 'w', keyword: 'þ', value: 'W' };
        arrayValue[120] = { character: 'x', keyword: 'þ', value: 'X' };
        arrayValue[121] = { character: 'y', keyword: 'þ', value: 'Y' };
        arrayValue[122] = { character: 'z', keyword: 'þ', value: 'Z' };
        arrayValue[123] = { character: '{', keyword: 'ü', value: 'P' };
        arrayValue[124] = { character: '|', keyword: 'ü', value: 'Q' };
        arrayValue[125] = { character: '}', keyword: 'ü', value: 'R' };
        arrayValue[126] = { character: '~', keyword: 'ü', value: 'S' };
        return arrayValue;
    }
    /* tslint:enable */

    private encoding(string: string[]): string[] {
        const temp: string[] = [];
        for (let j: number = 0; j < string.length; j++) {
            for (let k: number = 0; k < string[j].length; k++) {
                for (let i: number = 0; i < this.barcodeSymbols.length; i++) {
                    if (string[j][k] === this.barcodeSymbols[i].value) {
                        temp[k] = this.barcodeSymbols[i].bars;
                    }
                }
            }
        }
        return temp;
    }


}
