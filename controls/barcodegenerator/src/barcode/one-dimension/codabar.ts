import { OneDimension } from '../one-dimension';


/**
 * codabar used to calculate the barcode of type codabar
 */
export class CodaBar extends OneDimension {

    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     *  @param {string} char - provide the input values .
     * @private
     */
    public validateInput(char: string): string {
        // eslint-disable-next-line
        if (char.search(/^[0-9A-D\-\.\$\/\+\%\:]+$/) === -1) {
            return 'Supports 0-9, A-D and symbols (-,$, /, ., +).';
        } else {
            return undefined;
        }
    }

    // eslint-disable-next-line
    private getCodeValue(): object {
        // eslint-disable-next-line
        const codes: object = {
            '0': '101010011',
            '1': '101011001',
            '2': '101001011',
            '3': '110010101',
            '4': '101101001',
            '5': '110101001',
            '6': '100101011',
            '7': '100101101',
            '8': '100110101',
            '9': '110100101',
            '-': '101001101',
            '$': '101100101',
            ':': '1101011011',
            '/': '1101101011',
            '.': '1101101101',
            '+': '101100110011',
            'A': '1011001001',
            'B': '1001001011',
            'C': '1010010011',
            'D': '1010011001'
        };
        return codes;
    }

    private appendStartStopCharacters(char: string): string {
        return 'A' + char + 'A';
    }

    private getPatternCollection(givenCharacter: string, codes: string[]): number[] {
        const code: number[] = [];
        for (let i: number = 0; i < givenCharacter.length; i++) {
            const char: string = givenCharacter[i];
            code.push(codes[char]);
        }
        return code;
    }


    /**
     * Draw the barcode SVG.\
     *
     * @returns {void} Draw the barcode SVG .
     *  @param {HTMLElement} canvas - Provide the canvas element .
     * @private
     */
    public draw(canvas: HTMLElement): void {
        const codes: string[] = this.getCodeValue() as string[];
        let givenCharacter: string = this.value;
        givenCharacter = this.appendStartStopCharacters(givenCharacter);
        const code: number[] = this.getPatternCollection(givenCharacter, codes);
        this.calculateBarCodeAttributes(code, canvas);
    }
}
