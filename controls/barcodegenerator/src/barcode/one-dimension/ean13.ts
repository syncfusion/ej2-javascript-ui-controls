import { OneDimension } from '../one-dimension';

/**
 * EAN13 class is  used to calculate the barcode of type EAN13 barcode
 */
export class Ean13 extends OneDimension {


    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     * @param {string} value - provide the input values .
     * @private
     */
    public validateInput(value: string): string {
        const checkSumValue: number = this.checksumValue(value);
        if (value.search(/^[0-9]{13}$/) !== -1 && (Number(value[12]) === this.checkSumData(value) || Number(value[12]) === checkSumValue)) {
            return undefined;
        } else if (value.search(/^[0-9]{12}$/) !== -1) {
            value += this.checkSumData(value);
            this.value = value;
            return undefined;
        } else {
            return 'Accepts 12 numeric characters.';
        }
    }
    private checksumValue(number: string): number {
        const res: number = number
            .substr(0, 12)
            .split('')
            .map((n: string) => +n)
            .reduce((sum: number, a: number, idx: number) => (idx % 2 ? sum + a * 3 : sum + a), 0);
        return (10 - (res % 10)) % 10;
    }

    private checkSumData(value: string): number {
        const sum1: number = 3 * (Number(value[11]) + Number(value[9]) + Number(value[7])
            + Number(value[5]) + Number(value[3]) + Number(value[1]));
        const sum2: number = (Number(value[10]) + Number(value[8]) + Number(value[6])
            + Number(value[4])) + Number(value[2]) + Number(value[0]);
        const checkSumValue: number = (sum1 + sum2);
        const roundOffValue: number = Math.round(checkSumValue / 10) * 10;
        return roundOffValue - checkSumValue;
    }

    // eslint-disable-next-line
    private getStructure(): object {
        return {
            '0': 'LLLLLL',
            '1': 'LLGLGG',
            '2': 'LLGGLG',
            '3': 'LLGGGL',
            '4': 'LGLLGG',
            '5': 'LGGLLG',
            '6': 'LGGGLL',
            '7': 'LGLGLG',
            '8': 'LGLGGL',
            '9': 'LGGLGL'
        };
    }

    // eslint-disable-next-line
    private getBinaries(): object {
        return {
            'L': [ // The L (left) type of encoding
                '0001101', '0011001', '0010011', '0111101', '0100011',
                '0110001', '0101111', '0111011', '0110111', '0001011'
            ], 'G': [ // The G type of encoding
                '0100111', '0110011', '0011011', '0100001', '0011101',
                '0111001', '0000101', '0010001', '0001001', '0010111'
            ],
            'R': [ // The R (right) type of encoding
                '1110010', '1100110', '1101100', '1000010', '1011100',
                '1001110', '1010000', '1000100', '1001000', '1110100'
            ],
            'O': [ // The O (odd) encoding for UPC-E
                '0001101', '0011001', '0010011', '0111101', '0100011',
                '0110001', '0101111', '0111011', '0110111', '0001011'
            ],
            'E': [ // The E (even) encoding for UPC-E
                '0100111', '0110011', '0011011', '0100001', '0011101',
                '0111001', '0000101', '0010001', '0001001', '0010111'
            ]
        };
    }

    /**
     * Draw the barcode SVG.\
     *
     * @returns {void} Draw the barcode SVG .
     * @param {HTMLElement} canvas - Provide the canvas element .
     * @private
     */
    public draw(canvas: HTMLElement): void {
        const endBars: string = '101';
        const middleBar: string = '01010';
        const code: string[] = [];
        // eslint-disable-next-line
        const structureValue: object = this.getStructure();
        const structure: string = structureValue[this.value[0]];
        code.push(endBars);
        let leftString: string = this.value.substr(1, 6);
        code.push(this.leftValue(true, structure, leftString));
        code.push(middleBar);
        leftString = this.value.substr(7, 6);
        code.push(this.leftValue(false, 'RRRRRR', leftString));
        code.push(endBars);
        this.calculateBarCodeAttributes(code, canvas);
    }


    private leftValue(isLeft: boolean, structure: string, leftString: string): string {
        let code: string;
        let tempCodes: string;
        // eslint-disable-next-line
        const codes: object = this.getBinaries();
        for (let i: number = 0; i < leftString.length; i++) {
            tempCodes = codes[structure[i]];
            if (i === 0) {
                code = tempCodes[leftString[i]];
            } else {
                code += tempCodes[leftString[i]];
            }
        }
        return code;
    }
}
