import { QRCode } from './qr-code-util';
import { parseGs1, Gs1Element, Gs1ParseResult, Gs1Success } from '../gs1/gs1-parser';
import { MarginModel } from '../barcode/primitives/margin-model';
import { DisplayTextModel } from '../barcode/primitives/displaytext-model';
import { QRCodeLogoModel } from '../barcode/primitives/icon-model';
import { L10n } from '@syncfusion/ej2-base';

/**
 * GS1 character, the ASCII group separator U+001D. In a GS1 QR Code, FNC1 in
 * first position and each separating FNC1 are encoded as this character in
 * the byte stream.
 */
const GS: string = String.fromCharCode(29);

/**
 * GS1 QR Code: a QR Code whose value is GS1 data, bracketed such as
 * (01)09506000134406(17)280531(10)L2025001, or a raw element string with GS
 * characters. The shared GS1 parser validates the data; this class builds the
 * byte stream with the FNC1 characters and forces byte-mode encoding, which the
 * inherited QR Code encoder and renderer draw unchanged.
 */
export class Gs1QRCode extends QRCode {

    /**
     * Localization object of the QRCodeGenerator, assigned before validation.
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
    public validateInput(char: string): string {
        const result: Gs1ParseResult = parseGs1(char);
        this.gs1Result = result;
        if (!result.ok) {
            return this.message((result as { error: string }).error);
        }
        return undefined;
    }

    /**
     * Build the GS1 byte stream: the leading FNC1 that marks the data as GS1,
     * the parsed element string, and a separating FNC1 after each non-final
     * variable-length value, at the element boundaries the parser marked.
     *
     * @returns {string} The GS1 byte stream to encode.
     */
    private buildGs1Data(): string {
        const success: Gs1Success = this.gs1Result as Gs1Success;
        let data: string = GS + success.encodingData;
        if (success.separatingFnc1After.length) {
            const separators: number[] = success.separatingFnc1After;
            // Walk the elements in reverse and insert a separator after each
            // marked boundary, so indexes stay valid as the string grows.
            let index: number;
            for (index = separators.length - 1; index >= 0; index--) {
                const elementIndex: number = separators[parseInt(index.toString(), 10)];
                let offset: number = GS.length;
                let boundary: number;
                for (boundary = 0; boundary <= elementIndex; boundary++) {
                    const element: Gs1Element = success.elements[parseInt(boundary.toString(), 10)];
                    offset += element.ai.length + element.value.length;
                }
                data = data.substring(0, offset) + GS + data.substring(offset);
            }
        }
        return data;
    }

    /**
     * Draw the GS1 QR Code. The text is the GS1 byte stream, encoded in byte
     * mode by the inherited encoder; the display text is the human-readable
     * GS1 text with the AIs in brackets, unless the user set one.
     *
     * @param {string} char - The original GS1 value, used for the display text.
     * @param {HTMLElement} canvas - The canvas element.
     * @param {number} height - The height of the QR Code.
     * @param {number} width - The width of the QR Code.
     * @param {Object} margin - The margin of the QR Code.
     * @param {Object} displayText - The display text options.
     * @param {boolean} mode - Whether the rendering mode is SVG.
     * @param {string} foreColor - The fore color.
     * @param {Object} logo - The logo overlay options.
     * @returns {boolean} Whether the input is valid and drawn.
     * @private
     */
    public draw(
        char: string, canvas: HTMLElement, height: number, width: number,
        margin?: MarginModel, displayText?: DisplayTextModel, mode?: boolean, foreColor?: string,
        logo?: QRCodeLogoModel): boolean {
        const result: Gs1ParseResult = this.gs1Result && this.gs1Result.ok ? this.gs1Result : parseGs1(char);
        if (!result.ok) {
            return false;
        }
        this.gs1Result = result;
        this.text = this.buildGs1Data();
        const originalText: string = displayText.text;
        if (!originalText) {
            displayText.text = (result as Gs1Success).humanReadableText;
        }
        const valid: boolean = super.draw(
            this.text, canvas, height, width, margin, displayText, mode, foreColor, logo);
        displayText.text = originalText;
        return valid;
    }

    /**
     * Force byte-mode encoding. The GS1 byte stream contains the FNC1/GS
     * characters, so the inherited mode detection already selects byte mode;
     * the ECI header it would add for control characters is suppressed, as GS1
     * data uses only the GS1 character set.
     *
     * @returns {void}
     * @private
     */
    protected initialize(): void {
        super.initialize();
        this.mInputMode = 'BinaryMode';
        this.mIsEci = false;
        this.mIsFnc1FirstPosition = true;
    }

    private message(key: string): string {
        return this.locale ? (this.locale.getConstant(key) || key) : key;
    }
}
