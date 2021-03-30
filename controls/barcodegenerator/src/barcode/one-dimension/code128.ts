import { OneDimension } from '../one-dimension';
import { EncodingResult } from '../rendering/canvas-interface';

/**
 * code128 used to calculate the barcode of type 128
 */
export class Code128 extends OneDimension {


    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     *  @param {string} char - provide the input values .
     * @private
     */
    public validateInput(char: string): string {
        //if (char.search('/[a-zA-Z0-9]*/') === -1) {
        // eslint-disable-next-line
        if (char.search(/^[0-9A-Za-z\-\.\ \@\$\/\+\%\!\@\#\$\%\&\*\^\(\)\_\+\=\<\>\?\{\}\[\]\~\-\Ê]+$/) === -1) {
            return 'Supports only 128 characters of ASCII.';
        } else {
            return undefined;
        }
    }
    private getCodeValue(): number[] {
        const codes: number[] = [11011001100, 11001101100, 11001100110, 10010011000, 10010001100,
            10001001100, 10011001000, 10011000100, 10001100100, 11001001000,
            11001000100, 11000100100, 10110011100, 10011011100, 10011001110,
            10111001100, 10011101100, 10011100110, 11001110010, 11001011100,
            11001001110, 11011100100, 11001110100, 11101101110, 11101001100,
            11100101100, 11100100110, 11101100100, 11100110100, 11100110010,
            11011011000, 11011000110, 11000110110, 10100011000, 10001011000,
            10001000110, 10110001000, 10001101000, 10001100010, 11010001000,
            11000101000, 11000100010, 10110111000, 10110001110, 10001101110,
            10111011000, 10111000110, 10001110110, 11101110110, 11010001110,
            11000101110, 11011101000, 11011100010, 11011101110, 11101011000,
            11101000110, 11100010110, 11101101000, 11101100010, 11100011010,
            11101111010, 11001000010, 11110001010, 10100110000, 10100001100,
            10010110000, 10010000110, 10000101100, 10000100110, 10110010000,
            10110000100, 10011010000, 10011000010, 10000110100, 10000110010,
            11000010010, 11001010000, 11110111010, 11000010100, 10001111010,
            10100111100, 10010111100, 10010011110, 10111100100, 10011110100,
            10011110010, 11110100100, 11110010100, 11110010010, 11011011110,
            11011110110, 11110110110, 10101111000, 10100011110, 10001011110,
            10111101000, 10111100010, 11110101000, 11110100010, 10111011110,
            10111101110, 11101011110, 11110101110, 11010000100, 11010010000,
            11010011100, 1100011101011];
        return codes;
    }
    private getBytes(givenWord: string): number[] {
        const bytes: number[] = [];
        for (let i: number = 0; i < givenWord.length; i++) {
            bytes.push(givenWord[i].charCodeAt(0));
        }
        return bytes;
    }

    private appendStartStopCharacters(char: string): string {
        let startChararcter: string;
        if (this.type === 'Code128A') {
            startChararcter = String.fromCharCode(208);
        } else if (this.type === 'Code128B') {
            startChararcter = String.fromCharCode(209);
        } else if (this.type === 'Code128C') {
            startChararcter = String.fromCharCode(210);
        }
        return startChararcter + char;
    }
    private check128C(value: string): string {
        return value.match(new RegExp('^' + '(\xCF*[0-9]{2}\xCF*)' + '*'))[0];
    }
    private check128A(value: string): string {
        return value.match(new RegExp('^' + '[\x00-\x5F\xC8-\xCF]' + '*'))[0];
    }
    private check128B(value: string): string {
        return value.match(new RegExp('^' + '[\x20-\x7F\xC8-\xCF]' + '*'))[0];
    }

    private clipAB(value: string, code128A: boolean): string {
        const ranges: string = code128A ? '[\x00-\x5F\xC8-\xCF]' : '[\x20-\x7F\xC8-\xCF]';
        // eslint-disable-next-line
        const untilC: object = value.match(new RegExp('^(' + ranges + '+?)(([0-9]{2}){2,})([^0-9]|$)'));
        if (untilC) {
            return untilC[1] + String.fromCharCode(204) + this.clipC(value.substring(untilC[1].length));
        }
        const chars: string = value.match(new RegExp('^' + ranges + '+'))[0];

        if (chars.length === value.length) {
            return value;
        }
        return value;
    }

    private code128Clip(): string {
        let newString: string;
        const check128C: number = this.check128C(this.value).length;
        if (check128C >= 2) {
            return newString = String.fromCharCode(210) + this.clipC(this.value);
        } else {
            const code128A: boolean = this.check128A(this.value) > this.check128B(this.value);
            // eslint-disable-next-line
            return newString = (code128A ? String.fromCharCode(208) : String.fromCharCode(209)) + this.clipAB(this.value, code128A);
        }
    }

    private clipC(string: string): string {
        const cMatch: string = this.check128C(string);
        const length: number = cMatch.length;
        if (length === string.length) {
            return string;
        }
        string = string.substring(length);
        const code128A: boolean = this.check128A(string) >= this.check128B(string);
        return cMatch + String.fromCharCode(code128A ? 206 : 205) + this.clipAB(string, code128A);
    }

    /**
     * Draw the barcode SVG.\
     *
     * @returns {void} Draw the barcode SVG .
     *  @param {HTMLElement} canvas - Provide the canvas element .
     * @private
     */
    public draw(canvas: HTMLElement): void {
        this.code128(canvas);
    }

    /**
     * Draw the barcode SVG.\
     *
     * @returns {void} Draw the barcode SVG .
     *  @param {HTMLElement} canvas - Provide the canvas element .
     * @private
     */
    public code128(canvas: HTMLElement): void {
        let givenCharacter: string = this.value;
        givenCharacter = this.type !== 'Code128' ? this.appendStartStopCharacters(givenCharacter) : this.code128Clip() as string;
        const bytes: number[] = this.getBytes(givenCharacter);
        const startCharacterValue: number = bytes.shift() - 105;
        let set: string;
        if (startCharacterValue === 103) {
            set = '0';
        } else if (startCharacterValue === 104) {
            set = '1';
        } else {
            set = '2';
        }
        const encodingResult: EncodingResult = this.encodeData(bytes, 1, set);
        const encodedData: string = this.encode(startCharacterValue, encodingResult);
        const code: string[] = [];
        code.push(encodedData);
        this.calculateBarCodeAttributes(code, canvas);
    }


    private encodeData(byteValue: number[], textPosition: number, set: string): EncodingResult {
        if (!byteValue.length) {
            return { result: '', checksum: 0 };
        }
        let nextCode: EncodingResult;
        let index: number;
        if (byteValue[0] >= 200) {
            index = byteValue.shift() - 105;
            const nextSet: string = this.swap(index);
            if (nextSet !== undefined) {
                nextCode = this.encodeData(byteValue, textPosition + 1, nextSet);
            }
        } else {
            index = this.correctIndex(byteValue, set);
            nextCode = this.encodeData(byteValue, textPosition + 1, set);
        }
        const encodingValues: string = this.getCodes(index);
        const weight: number = index * textPosition;
        return {
            result: encodingValues + nextCode.result,
            checksum: weight + nextCode.checksum
        };
    }


    private swap(index: number): string {
        if (index === 99) {
            return '2';
        } else if (index === 100) {
            return '1';
        } else {
            return '0';
        }
    }

    private encode(startIndex: number, encodingResult: EncodingResult): string {
        const moduloValue: number = 103;
        const stopvalue: number = 106;
        let encodeValue: string = this.getCodes(startIndex) + encodingResult.result;
        if (this.enableCheckSum) {
            encodeValue += this.getCodes((encodingResult.checksum + startIndex) % moduloValue);
        }
        encodeValue += this.getCodes(stopvalue);
        return encodeValue;
    }

    // Correct an index by a set and shift it from the bytes array
    private correctIndex(bytes: number[], set?: string): number {
        if (set === '0') {
            const charCode: number = bytes.shift();
            return charCode < 32 ? charCode + 64 : charCode - 32;
        } else if (set === '1') {
            return bytes.shift() - 32;
        } else {
            return (bytes.shift() - 48) * 10 + bytes.shift() - 48;
        }
    }

    // Get a bar symbol by index
    private getCodes(index: number): string {
        const codes: number[] = this.getCodeValue();
        return codes[index] ? codes[index].toString() : '';
    }

}
