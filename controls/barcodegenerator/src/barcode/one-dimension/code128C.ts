import { Code128 } from './code128';

/**
 * code128C used to calculate the barcode of type 128C barcode
 */
export class Code128C extends Code128 {


    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
     public validateInput(char: string): string {
        if ((new RegExp(`^${'(\xCF*[0-9]{2}\xCF*)'}+$`)).test(char)) {
            return undefined;
        } else {
            return 'Supports even number of numeric characters (00-99).';
        }
    }

    /** @private */
    public draw(canvas: HTMLElement): void {
        this.code128(canvas);
    }
}