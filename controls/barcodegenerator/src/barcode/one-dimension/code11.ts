import { OneDimension } from '../one-dimension';

/**
 * code39 used to calculate the barcode of type 39
 */
export class Code11 extends OneDimension {

    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     * @param {string} value - Provide the canvas element .
     * @private
     */
    public validateInput(value: string): string {
        // eslint-disable-next-line
        if (value.search(/^[0-9\-\*]+$/) === -1) {
            return 'This bar code support 0-9 , * , -';
        } else {
            return undefined;
        }
    }
    /**
     * Validate the given input.
     *
     * @returns {object} Validate the given input.
     * @private
     */
    // eslint-disable-next-line
    private getCodeValue(): object {
        // eslint-disable-next-line
        const codes: object = {
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
    private getPatternCollection(givenChar: string): string[] {
        // const codeNumber: number;
        const code: string[] = [];
        const codes: string[] = this.getCodeValue() as string[];
        for (let i: number = 0; i < givenChar.length; i++) {
            code.push(codes[givenChar[i]]);
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
        let codes: string[] = [];
        const givenChar: string = '*' + this.value + '*';
        codes = this.getPatternCollection(givenChar);
        this.calculateBarCodeAttributes(codes, canvas);
    }
}
