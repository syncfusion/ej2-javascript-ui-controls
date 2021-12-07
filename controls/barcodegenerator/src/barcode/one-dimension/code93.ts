import { OneDimension } from '../one-dimension';

/**
 * code39 used to calculate the barcode of type 39
 */
export class Code93 extends OneDimension {

    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     * @param {string} value - Provide the canvas element .
     * @private
     */
    public validateInput(value: string): string {
        // eslint-disable-next-line
        if (value.search(/^[0-9A-Z\-\.\*\$\/\+\ %\ ]+$/) === -1) {
            return 'Supports A-Z, 0-9, and symbols ( - . $ / + % SPACE).';
        } else {
            return undefined;
        }
    }
    // eslint-disable-next-line
    private getCharacterWeight(): object {
        // eslint-disable-next-line
        let codes: object = {
            '0': '0',
            '1': '1',
            '2': '2',
            '3': '3',
            '4': '4',
            '5': '5',
            '6': '6',
            '7': '7',
            '8': '8',
            '9': '9',
            'A': '10',
            'B': '11',
            'C': '12',
            'D': '13',
            'E': '14',
            'F': '15',
            'G': '16',
            'H': '17',
            'I': '18',
            'J': '19',
            'K': '20',
            'L': '21',
            'M': '22',
            'N': '23',
            'O': '24',
            'P': '25',
            'Q': '26',
            'R': '27',
            'S': '28',
            'T': '29',
            'U': '30',
            'V': '31',
            'W': '32',
            'X': '33',
            'Y': '34',
            'Z': '35',
            '-': '36',
            '.': '37',
            ' ': '38',
            '$': '39',
            '/': '40',
            '+': '41',
            '%': '42',
            '($)': '43',
            '(/)': '44',
            '(+)': '45',
            '(%)': '46'
        };
        return codes;
    }
    /**
     * get the code value.
     *
     * @returns {string[]} return the code value.
     * @private
     */
    // eslint-disable-next-line
    private getCodeValue(): object {
    // eslint-disable-next-line
        let codes: object = {
            '0': '100010100',
            '1': '101001000',
            '2': '101000100',
            '3': '101000010',
            '4': '100101000',
            '5': '100100100',
            '6': '100100010',
            '7': '101010000',
            '8': '100010010',
            '9': '100001010',
            'A': '110101000',
            'B': '110100100',
            'C': '110100010',
            'D': '110010100',
            'E': '110010010',
            'F': '110001010',
            'G': '101101000',
            'H': '101100100',
            'I': '101100010',
            'J': '100110100',
            'K': '100011010',
            'L': '101011000',
            'M': '101001100',
            'N': '101000110',
            'O': '100101100',
            'P': '100010110',
            'Q': '110110100',
            'R': '110110010',
            'S': '110101100',
            'T': '110100110',
            'U': '110010110',
            'V': '110011010',
            'W': '101101100',
            'X': '101100110',
            'Y': '100110110',
            'Z': '100111010',
            '-': '100101110',
            '.': '111010100',
            ' ': '111010010',
            '$': '111001010',
            '/': '101101110',
            '+': '101110110',
            '%': '110101110',
            '($)': '100100110',
            '(/)': '111010110',
            '(+)': '100110010',
            '(%)': '111011010'
        };
        return codes;
    }
    private getPatternCollection(givenCharacter: string, codes: string[], encodingValue: string[]): void {
        const code: string[] = encodingValue;
        for (let i: number = 0; i < givenCharacter.length; i++) {
            const char: string = givenCharacter[i];
            code.push(codes[char]);
        }
    }


    private calculateCheckSum(givenCharacter: string): string {
        const value: string = givenCharacter;
        let weightSum: number = 0;
        let j: number = 0;
        // eslint-disable-next-line
        const codes: object = this.getCharacterWeight();
        for (let i: number = value.length; i > 0; i--) {
            const characterValue: number = codes[value[j]] * i;
            weightSum += characterValue;
            j++;
        }
        const moduloValue: number = weightSum % 47;
        const objectValue: string[] = Object.keys(codes);
        const appendSymbol: string = objectValue[moduloValue];
        return appendSymbol;
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
        const encodingValue: string[] = [];
        let givenCharacter: string = this.value;
        const startStopCharacter: string = '101011110';
        const terminationBar: string = '1';
        if (this.enableCheckSum) {
            givenCharacter += this.calculateCheckSum(givenCharacter);
            givenCharacter += this.calculateCheckSum(givenCharacter);
        }
        encodingValue.push(startStopCharacter);
        this.getPatternCollection(givenCharacter, codes, encodingValue);
        encodingValue.push(startStopCharacter);
        encodingValue.push(terminationBar);
        this.calculateBarCodeAttributes(encodingValue, canvas);
    }
}
