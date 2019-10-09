import { OneDimension } from '../one-dimension';

/**
 * code39 used to calculate the barcode of type 39
 */
export class Code11 extends OneDimension {

    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    public validateInput(value: string): string {
        if (value.search(/^[0-9\-\*]+$/) === -1) {
            return 'This bar code support 0-9 , * , -';
        } else {
            return undefined;
        }
    }
    /**
     * get the code value to check
     */
    private getCodeValue(): object {
        let codes: object = {
            '0': '111121',
            '1': '211121',
            '2': '121121',
            '3': '221111',
            '4': '112121',
            '5': '212111',
            '6': '122111',
            '7': '111221',
            '8': '211211',
            '9': '211111',
            '-': '112111',
            '*': '112211'
        };
        return codes;
    }
    private getPatternCollection(givenChar: string, ): string[] {
        let codeNumber: number;
        let code: string[] = [];
        let codes: string[] = this.getCodeValue() as string[];
        for (let i: number = 0; i < givenChar.length; i++) {
            code.push(codes[givenChar[i]]);
        }
        return code;
    }


    /** @private */
    public draw(canvas: HTMLElement): void {
        let codes: string[] = [];
        let givenChar: string = '*' + this.value + '*';
        codes = this.getPatternCollection(givenChar);
        this.calculateBarCodeAttributes(codes, canvas);
    }
}