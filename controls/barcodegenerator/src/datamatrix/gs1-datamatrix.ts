import { DataMatrix } from './datamatrix-util';
import { parseGs1, Gs1Element, Gs1ParseResult, Gs1Success } from '../gs1/gs1-parser';
import { L10n } from '@syncfusion/ej2-base';

/**
 * The FNC1 placeholder character. The inherited ASCII encoder maps a
 * character with charCode 359 to the Data Matrix codeword 232, which is FNC1,
 * so this character in the encode string becomes FNC1 in the codeword stream.
 */
const FNC1_PLACEHOLDER: string = String.fromCharCode(359);

/**
 * GS1 DataMatrix: a Data Matrix whose value is GS1 data, bracketed such as
 * (01)09506000134505(17)271231(10)LOT001(21)SN000001, or a raw element string
 * with GS characters. The shared GS1 parser validates the data; this class
 * builds the encode string with the FNC1 placeholder in first position and at
 * the variable-length boundaries the parser marks, and the inherited Data
 * Matrix encoder and renderer draw it unchanged.
 */
export class Gs1DataMatrix extends DataMatrix {

    /**
     * Localization object of the DataMatrixGenerator, assigned before validation.
     *
     * @private
     */
    public locale: L10n;

    private gs1Result: Gs1ParseResult;

    /**
     * Validate the GS1 value with the shared parser.
     *
     * @param {string} char - The GS1 value.
     * @returns {string} The localized error message, or undefined when valid.
     * @private
     */
    public validateGs1(char: string): string {
        const result: Gs1ParseResult = parseGs1(char);
        this.gs1Result = result;
        if (!result.ok) {
            return this.message((result as { error: string }).error);
        }
        return undefined;
    }

    /**
     * Build the GS1 encode string: the FNC1 placeholder in first position that
     * marks the data as GS1, the parsed element string, and an FNC1
     * placeholder after each non-final variable-length value, at the element
     * boundaries the parser marked.
     *
     * @returns {string} The encode string for the inherited encoder.
     */
    public buildGs1Data(): string {
        const success: Gs1Success = this.gs1Result as Gs1Success;
        if (!success.separatingFnc1After.length) {
            return FNC1_PLACEHOLDER + success.encodingData;
        }
        const separators: number[] = success.separatingFnc1After;
        let data: string = FNC1_PLACEHOLDER;
        let offset: number = 0;
        let index: number;
        for (index = 0; index < success.elements.length; index++) {
            const element: Gs1Element = success.elements[parseInt(index.toString(), 10)];
            const length: number = element.ai.length + element.value.length;
            data += success.encodingData.substring(offset, offset + length);
            offset += length;
            if (separators.indexOf(index) !== -1 && index !== success.elements.length - 1) {
                data += FNC1_PLACEHOLDER;
            }
        }
        return data;
    }

    /**
     * The human-readable GS1 text, with the AIs in brackets.
     *
     * @returns {string} The human-readable text.
     */
    public getHumanReadableText(): string {
        return (this.gs1Result as Gs1Success).humanReadableText;
    }

    private message(key: string): string {
        return this.locale ? (this.locale.getConstant(key) || key) : key;
    }
}
