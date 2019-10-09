import { OneDimension } from '../one-dimension';

/**
 * EAN8 class is  used to calculate the barcode of type EAN8 barcode
 */
export class Ean8 extends OneDimension {


    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
     public validateInput(value: string): string {
        if (value.search(/^[0-9]{8}$/) !== -1 && Number(value[7]) === this.checkSumData(value)) {
            return undefined;
        } else {
            return 'Accepts 8 numeric characters.';
        }
    }
    private getCodeValueRight(right: boolean): object {
        let codes: object;
        if (right) {
            codes = {
                '0': '0001101',
                '1': '0011001',
                '2': '0010011',
                '3': '0111101',
                '4': '0100011',
                '5': '0110001',
                '6': '0101111',
                '7': '0111011',
                '8': '0110111',
                '9': '0001011',
            };
        } else {
            codes = {
                '0': '1110010',
                '1': '1100110',
                '2': '1101100',
                '3': '1000010',
                '4': '1011100',
                '5': '1001110',
                '6': '1010000',
                '7': '1000100',
                '8': '1001000',
                '9': '1110100'
            };

        }
        return codes;
    }


    private checkSumData(value: string): number {
        for (let i: number = 0; i < value.length; i++) {
            let sum1: number = Number(value[1]) + Number(value[3]) + Number(value[5]);
            let sum2: number = 3 * (Number(value[0]) + Number(value[2]) + Number(value[4]) + Number(value[6]));
            let checkSumValue: number = sum1 + sum2;
            let checkSumDigit: number = 10 - (checkSumValue % 10);
            return checkSumDigit === 0 ? checkSumDigit = 0 : checkSumDigit;
        }
        return 0;
    }

    /** @private */
    public draw(canvas: HTMLElement): void {
            let endBars: string = '101';
            let middleBar: string = '01010';
            let codes: string[] = this.getCodeValueRight(true) as string[];
            let code: string[] = [];
            code.push(endBars);
            code.push(this.leftValue(codes, true));
            code.push(middleBar);
            codes = this.getCodeValueRight(false) as string[];
            code.push(this.leftValue(codes, false));
            code.push(endBars);
            this.calculateBarCodeAttributes(code, canvas);
    }

    private leftValue(codes: string[], isLeft: boolean): string {
        let code: string;
        for (let i: number = isLeft ? 0 : this.value.length - 4; i < (isLeft ? this.value.length - 4 : this.value.length); i++) {
            if (i === 0 || i === 4) {
                code = codes[this.value[i]];
            } else {
                code += codes[this.value[i]];
            }
        }
        return code;
    }


}