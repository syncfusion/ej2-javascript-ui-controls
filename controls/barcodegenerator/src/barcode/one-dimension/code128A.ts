import { Code128 } from './code128';

/**
 * code128A used to calculate the barcode of type 1228A
 */
export class Code128A extends Code128 {


    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     * @param {string} char - provide the input values .
     * @private
     */
    public validateInput(char: string): string {
        if ((new RegExp(`^${'[\x00-\x5F\xC8-\xCF]'}+$`)).test(char)) {
            return undefined;
        } else {
            return 'Supports only ASCII characters 00 to 95 (0–9, A–Z and control codes) and special characters.';
        }
    }

    /**
     * Draw the barcode SVG.\
     *
     * @returns {void} Draw the barcode SVG .
     * @param {HTMLElement} canvas - Provide the canvas element .
     * @private
     */
    public draw(canvas: HTMLElement): void {
        this.code128(canvas);
    }
}
