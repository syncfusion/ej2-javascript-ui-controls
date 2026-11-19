import { Code128 } from './code128';
import { L10n } from '@syncfusion/ej2-base';
import { parseGs1, Gs1Element, Gs1ParseResult, Gs1Success } from '../../gs1/gs1-parser';

/**
 * FNC1 character for GS1-128. Code 128 character value 102, char code 207.
 */
const FNC1: string = String.fromCharCode(207);

/**
 * GS1-128: a Code 128 barcode with a leading FNC1 that marks the data as GS1.
 * The value is GS1 data, bracketed such as (01)09506000134376(10)ABC123, or a
 * raw element string with GS characters. The shared GS1 parser validates it;
 * this class inserts the leading and separating FNC1 characters, keeps the
 * Modulo 103 check character always on, and shows the human-readable text
 * with the AIs in brackets. GS1 limits the data to 48 characters, not
 * counting FNC1 or the check character.
 */
export class GS1Code128 extends Code128 {

    /**
     * Localization object of the BarcodeGenerator, assigned before validation.
     *
     * @private
     */
    public locale: L10n;

    private gs1Result: Gs1ParseResult;

    /**
     * Validate the GS1 value with the shared parser and the GS1-128 length limit.
     *
     * @param {string} char - The GS1 value.
     * @returns {string} The localized error message, or undefined when valid.
     * @private
     */
    public validateInput(char: string): string {
        const result: Gs1ParseResult = parseGs1(char);
        this.gs1Result = result;
        if (!result.ok) {
            return this.message((result as { error: string }).error);
        }
        if ((result as Gs1Success).encodingData.length > 48) {
            return this.message('GS1DataTooLong');
        }
        return undefined;
    }

    /**
     * Draw the GS1-128 barcode. Reuses the inherited Code 128 encoder with the
     * FNC1 characters inserted into the data.
     *
     * @param {HTMLElement} canvas - The canvas element.
     * @returns {void} Draw the barcode SVG.
     * @private
     */
    public draw(canvas: HTMLElement): void {
        const result: Gs1ParseResult = this.gs1Result && this.gs1Result.ok ? this.gs1Result : parseGs1(this.value);
        if (!result.ok) {
            return;
        }
        const success: Gs1Success = result as Gs1Success;
        const originalValue: string = this.value;
        const originalText: string = this.displayText.text;
        const originalCheckSum: boolean = this.enableCheckSum;
        this.value = FNC1 + this.insertSeparatingFnc1(success);
        // The Modulo 103 check character is always added in GS1-128.
        this.enableCheckSum = true;
        // Show the human-readable GS1 text with the AIs in brackets.
        if (!originalText) {
            this.displayText.text = success.humanReadableText;
        }
        this.code128(canvas);
        this.value = originalValue;
        this.displayText.text = originalText;
        this.enableCheckSum = originalCheckSum;
    }

    /**
     * Insert a separating FNC1 after each non-final variable-length value,
     * at the element boundaries the parser marked.
     *
     * @param {Gs1Success} success - The parsed GS1 data.
     * @returns {string} The encoding data with FNC1 separators.
     */
    private insertSeparatingFnc1(success: Gs1Success): string {
        if (!success.separatingFnc1After.length) {
            return success.encodingData;
        }
        const separators: number[] = success.separatingFnc1After;
        let data: string = '';
        let offset: number = 0;
        let index: number;
        for (index = 0; index < success.elements.length; index++) {
            const element: Gs1Element = success.elements[parseInt(index.toString(), 10)];
            const length: number = element.ai.length + element.value.length;
            data += success.encodingData.substring(offset, offset + length);
            offset += length;
            if (separators.indexOf(index) !== -1) {
                data += FNC1;
            }
        }
        return data;
    }

    private message(key: string): string {
        return this.locale ? (this.locale.getConstant(key) || key) : key;
    }
}
