import { Code128 } from './code128';

/**
 * code128B used to calculate the barcode of type 128
 */
export class Code128B extends Code128 {


    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     * @param {string} char - provide the input values .
     * @private
     */
    public validateInput(char: string): string {
        if ((new RegExp(`^${'[\x20-\x7F\xC8-\xCF]'}+$`)).test(char)) {
            return undefined;
        } else {
            return 'Supports only ASCII characters 32 to 127 (0–9, A–Z, a–z), and special characters.';
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
