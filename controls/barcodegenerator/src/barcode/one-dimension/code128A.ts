import { Code128 } from './code128';

/**
 * code128A used to calculate the barcode of type 1228A
 */
export class Code128A extends Code128 {


    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    public validateInput(char: string): string {
        if ((new RegExp(`^${'[\x00-\x5F\xC8-\xCF]'}+$`)).test(char)) {
            return undefined;
        } else {
            return 'Supports only ASCII characters 00 to 95 (0–9, A–Z and control codes) and special characters.';
        }
    }

    /** @private */
    public draw(canvas: HTMLElement): void {
            this.code128(canvas);
    }
}