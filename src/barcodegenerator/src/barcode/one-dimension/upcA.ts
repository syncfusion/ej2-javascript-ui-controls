import { OneDimension } from '../one-dimension';

/**
 * This class is  used to calculate the barcode of type Universal Product Code barcode
 */
export class UpcA extends OneDimension {


    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     * @param {string} value - provide the input values .
     * @private
     */
    public validateInput(value: string): string {
        if (value.search(/^[0-9]{11}$/) !== -1 && this.enableCheckSum) {
            this.value += this.checkSumData(this.value);
        }
        if (this.value.search(/^[0-9]{12}$/) !== -1 && (Number(this.value[11]) === this.checkSumData(this.value))) {
            return undefined;
        } else {
            return 'Accepts 11 numeric characters.';
        }
    }

    private checkSumData(value: string): number {
        const sum1: number = 3 * (Number(value[0]) + Number(value[2]) + Number(value[4])
            + Number(value[6]) + Number(value[8]) + Number(value[10]));
        const sum2: number = (Number(value[9]) + Number(value[7]) + Number(value[5]) + Number(value[3]) + Number(value[1]));
        const checkSumValue: number = (sum1 + sum2);
        return (10 - checkSumValue % 10) % 10;
    }

    // eslint-disable-next-line
    private getBinaries(): object {
        return {
            'L': [ // The L (left) type of encoding
                '0001101', '0011001', '0010011', '0111101', '0100011',
                '0110001', '0101111', '0111011', '0110111', '0001011'
            ],
            'R': [ // The R (right) type of encoding
                '1110010', '1100110', '1101100', '1000010', '1011100',
                '1001110', '1010000', '1000100', '1001000', '1110100'
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
        const endDigits: string = '00000000';
        const middleBar: string = '01010';
        const code: string[] = [];
        code.push(endDigits);
        code.push('101' + this.leftValue(true, 'L', this.value[0]));
        code.push(this.leftValue(true, 'LLLLL', this.value.substr(1, 5)));
        code.push(middleBar);
        code.push(this.leftValue(true, 'RRRRR', this.value.substr(6, 5)));
        code.push(this.leftValue(true, 'R', this.value[11]) + '101');
        code.push(endDigits);
        this.calculateBarCodeAttributes(code, canvas);
    }

    private leftValue(isLeft: boolean, structure: string, leftString: string): string {
        let code: string;
        let tempValue: string;
        // eslint-disable-next-line
        const codes: object = this.getBinaries();
        for (let i: number = 0; i < leftString.length; i++) {
            tempValue = codes[structure[i]];
            if (i === 0) {
                code = tempValue[leftString[i]];
            } else {
                code += tempValue[leftString[i]];
            }
        }
        return code;
    }
}
