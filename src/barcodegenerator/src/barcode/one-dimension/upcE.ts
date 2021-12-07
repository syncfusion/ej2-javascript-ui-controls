import { OneDimension } from '../one-dimension';

/**
 * This class is  used to calculate the barcode of type Universal Product Code barcode
 */
export class UpcE extends OneDimension {


    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     * @param {string} value - provide the input values .
     * @private
     */
    public validateInput(value: string): string {
        if (value.search(/^[0-9]{6}$/) !== -1) {
            return undefined;
        } else {
            return 'Accepts 6 numeric characters.';
        }
    }

    private checkSum(value: string): number {
        let result: number = 0;
        let i: number;
        for (i = 1; i < 11; i += 2) {
            // eslint-disable-next-line
            result += parseInt(value[i], undefined);
        }
        for (i = 0; i < 11; i += 2) {
            // eslint-disable-next-line
            result += parseInt(value[i], undefined) * 3;
        }
        return (10 - (result % 10)) % 10;
    }
    // eslint-disable-next-line
    private getStructure(): object {
        return {
            '0': 'EEEOOO',
            '1': 'EEOEOO',
            '2': 'EEOOEO',
            '3': 'EEOOOE',
            '4': 'EOEEOO',
            '5': 'EOOEEO',
            '6': 'EOOOEE',
            '7': 'EOEOEO',
            '8': 'EOEOOE',
            '9': 'EOOEOE'
        };
    }

    private getValue(): string[] {
        return ['XX00000XXX',
            'XX10000XXX',
            'XX20000XXX',
            'XXX00000XX',
            'XXXX00000X',
            'XXXXX00005',
            'XXXXX00006',
            'XXXXX00007',
            'XXXXX00008',
            'XXXXX00009'];
    }

    private getExpansion(lastDigit: string): string {
        const value: string[] = this.getValue();
        return value[lastDigit];
    }

    private getUpcValue(): string {
        const lastDigit: string = this.value[this.value.length - 1];
        const expansionValue: string = this.getExpansion(lastDigit);
        let result: string = '';
        let index: number = 0;
        for (let i: number = 0; i < expansionValue.length; i++) {
            const value: string = expansionValue[i];
            if (value === 'X') {
                result += this.value[index++];
            } else {
                result += value;
            }
        }
        result = '' + '0' + result;
        let encodingValue: string = '' + result;
        if (this.enableCheckSum) {
            encodingValue += this.checkSum(result);
        }
        return encodingValue;
    }

    // eslint-disable-next-line
    private getBinaries(): object {
        return {
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


    private encoding(upcAValue: string, string: string, structure: string): string {
        let code: string;
        let tempValue: string;
        // eslint-disable-next-line
        const codes: object = this.getBinaries();
        for (let i: number = 0; i < string.length; i++) {
            tempValue = codes[structure[i]];
            if (i === 0) {
                code = tempValue[string[i]];
            } else {
                code += tempValue[string[i]];
            }
        }
        return code;
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
        const middleBar: string = '010101';
        const endDigits: string = '00000000';
        const code: string[] = [];
        const upcAValue: string = this.getUpcValue();
        // eslint-disable-next-line
        const structureValue: object = this.getStructure();
        const structure: string = structureValue[upcAValue[upcAValue.length - 1]];
        code.push(endDigits);
        code.push(endBars);
        code.push(this.encoding(upcAValue, this.value, structure));
        code.push(middleBar);
        code.push(endDigits);
        const renderText: string = upcAValue[0] + this.value + upcAValue[upcAValue.length - 1];
        this.calculateBarCodeAttributes(code, canvas, this.displayText.text === '' ? renderText : undefined);
    }
}
