import { parseGs1, Gs1Element, Gs1ParseResult, Gs1Success } from '../gs1/gs1-parser';
import { L10n } from '@syncfusion/ej2-base';

/**
 * The GS character, U+001D. In the merged DotCode encoder's GS1 mode, this
 * character at variable-length field boundaries is encoded as FNC1 (symbol
 * character 107). The AIM DotCode specification identifies GS1 data through
 * the symbology identifier (]d1), so a leading FNC1 is not encoded; only
 * separator FNC1s appear in the codeword stream.
 */
const GS: string = '\u001D';

/**
 * GS1 DotCode: a DotCode symbol whose value is GS1 data, bracketed such as
 * (01)09506000134505(17)271231(10)LOT001(21)SN000001, or a raw element string
 * with GS characters. The shared GS1 parser validates the data; this class
 * builds the value with a GS after each non-final variable-length value, at
 * the element boundaries the parser marks, and the DotCode encoder and
 * renderer draw it unchanged.
 */
export class Gs1DotCode {

    /**
     * Localization object of the DotCodeGenerator, assigned before validation.
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
     * Build the GS1 value for the DotCode encoder: the parsed element string
     * with a GS after each non-final variable-length value, at the element
     * boundaries the parser marked. No leading FNC1 is added; the symbol is
     * identified as GS1 through the symbology identifier.
     *
     * @returns {string} The value to encode, with GS separators.
     */
    public buildGs1Data(): string {
        const success: Gs1Success = this.gs1Result as Gs1Success;
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
            if (separators.indexOf(index) !== -1 && index !== success.elements.length - 1) {
                data += GS;
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
