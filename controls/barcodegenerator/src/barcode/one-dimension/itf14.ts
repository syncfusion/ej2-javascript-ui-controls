import { OneDimension } from '../one-dimension';
import { BarcodeRenderer } from '../rendering/renderer';
import { BaseAttributes } from '../rendering/canvas-interface';
import { Rect } from '../primitives/rect';
import { createMeasureElements, measureText } from '../utility/dom-util';
import { Size } from '../primitives/size';
import { BearerBarType } from '../enum/enum';
import { L10n } from '@syncfusion/ej2-base';

/**
 * ITF-14: Interleaved 2 of 5 barcode for a 14-digit GTIN on outer cartons.
 * Accepts 13 digits (the check digit is calculated with the GS1 modulo 10
 * method and appended) or 14 digits (the check digit is validated). Bearer
 * bars are drawn around the barcode as defined by bearerBar, with a
 * thickness of bearerBarWidth narrow-bar multiples. Other barcode types
 * ignore the bearer bar settings.
 */
export class ITF14 extends OneDimension {

    /**
     * Localization object of the BarcodeGenerator, assigned before validation.
     *
     * @private
     */
    public locale: L10n;

    /**
     * Defines the bearer bars for the ITF14 type. Other types ignore it.
     *
     * @default 'Frame'
     * @private
     */
    public bearerBar: BearerBarType;

    /**
     * Defines the bearer bar thickness, as a multiple of the narrow bar
     * width, from 1 to 10, for the ITF14 type. Other types ignore it.
     *
     * @default 5
     * @private
     */
    public bearerBarWidth: number;

    /**
     * Validate the ITF-14 value. 13 digits get the check digit calculated and
     * appended; 14 digits have the check digit validated with the shared GS1
     * modulo 10 method.
     *
     * @param {string} char - The ITF-14 value.
     * @returns {string} The localized error message, or undefined when valid.
     * @private
     */
    public validateInput(char: string): string {
        if (char.search(/^[0-9]{13}$/) !== -1) {
            this.value = char + this.calculateCheckDigit(char);
            return undefined;
        } else if (char.search(/^[0-9]{14}$/) !== -1) {
            if (Number(char[13]) !== this.calculateCheckDigit(char.substring(0, 13))) {
                return this.message('ITF14InvalidCheckDigit');
            }
            return undefined;
        }
        return this.message('ITF14InvalidValue');
    }

    /**
     * Draw the ITF-14 barcode: the Interleaved 2 of 5 pattern of the 14
     * digits, with bearer bars drawn around it, on the SVG or Canvas.
     *
     * @param {HTMLElement} canvas - The canvas element.
     * @returns {void} Draw the barcode SVG.
     * @private
     */
    public draw(canvas: HTMLElement): void {
        const quietModules: number = this.bearerBar === 'Frame' ?
            10 + this.bearerBarWidth : this.bearerBar === 'Horizontal' ? 10 : 0;
        const encoded: string = this.encodeValue(this.value);
        const code: string[] = [
            new Array(quietModules + 1).join('0') + encoded + new Array(quietModules + 1).join('0')];
        this.calculateBarCodeAttributes(code, canvas);
        if (this.bearerBar !== 'None') {
            this.drawBearerBars(canvas as HTMLCanvasElement, code[0].length);
        }
    }

    /**
     * Encode the 14 digits as the Interleaved 2 of 5 module string: the start
     * pattern, each digit pair interleaved as bar and space elements, and the
     * stop pattern. A 1 is a dark module and a 0 is a light module.
     *
     * @param {string} value - The 14-digit value.
     * @returns {string} The module string.
     */
    private encodeValue(value: string): string {
        // Start pattern: narrow bar, narrow space, narrow bar, narrow space.
        let encoded: string = '1010';
        let index: number;
        for (index = 0; index < value.length; index += 2) {
            const barPattern: string = this.getPattern(value[parseInt(index.toString(), 10)]);
            const spacePattern: string = this.getPattern(value[parseInt((index + 1).toString(), 10)]);
            let element: number;
            for (element = 0; element < 5; element++) {
                const barWidth: number = Number(barPattern[parseInt(element.toString(), 10)]);
                const spaceWidth: number = Number(spacePattern[parseInt(element.toString(), 10)]);
                let module: number;
                for (module = 0; module < barWidth; module++) {
                    encoded += '1';
                }
                for (module = 0; module < spaceWidth; module++) {
                    encoded += '0';
                }
            }
        }
        // Stop pattern: wide bar, narrow space, narrow bar.
        encoded += '1101';
        return encoded;
    }

    /**
     * Interleaved 2 of 5 pattern of one digit: five element widths where 1 is
     * a narrow element and 2 a wide one. Two of the five elements are wide.
     *
     * @param {string} digit - One digit.
     * @returns {string} The five element widths.
     */
    private getPattern(digit: string): string {
        // eslint-disable-next-line
        const patterns: { [key: string]: string } = {
            '0': '11221',
            '1': '21112',
            '2': '12112',
            '3': '22111',
            '4': '11212',
            '5': '21211',
            '6': '12211',
            '7': '11122',
            '8': '21121',
            '9': '12121'
        };
        return patterns[`${digit}`];
    }

    /**
     * Draw the bearer bars around the drawn barcode. Frame draws bars on all
     * four sides; Horizontal draws bars above and below only. The thickness
     * is bearerBarWidth multiples of the narrow bar (one module) width.
     *
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {number} moduleCount - The number of modules in the barcode.
     * @returns {void} Draw the bearer bars.
     * @private
     */
    private drawBearerBars(canvas: HTMLCanvasElement, moduleCount: number): void {
        const barcodeSize: Rect = this.getDrawableSize(this.margin, this.width as number, this.height as number);
        if (barcodeSize.height <= 0 || barcodeSize.width <= 0) {
            return;
        }
        const textOptions: BaseAttributes = {
            width: undefined, height: undefined, x: 0, y: 0, color: this.foreColor,
            string: this.displayText.text ? this.displayText.text : this.value,
            stringSize: this.displayText.size, visibility: this.displayText.visibility,
            fontStyle: this.displayText.font
        };
        createMeasureElements();
        const textSize: Size = measureText(textOptions);
        const textHeight: number = (textSize.height / 2) + 2;
        const scaleValue: number = this.isSvgMode ? 1 : 1.5;
        // The bar area, matching the area used by the shared bar rendering.
        const barTop: number = this.displayText.position === 'Top' ?
            barcodeSize.y + textHeight + this.displayText.margin.top : barcodeSize.y;
        const drawableHeight: number = (barcodeSize.height - textHeight * scaleValue) / scaleValue;
        const drawableWidth: number = barcodeSize.width / scaleValue;
        if (drawableHeight <= 0 || drawableWidth <= 0) {
            return;
        }
        // Use the same module pitch as the shared bar renderer in both modes.
        const moduleWidth: number = drawableWidth / moduleCount;
        const barWidth: number = this.bearerBarWidth * moduleWidth;
        const options: BaseAttributes[] = [];
        // Top and bottom bearer bars.
        options.push({
            x: barcodeSize.x, y: barTop, width: drawableWidth,
            height: barWidth, color: this.foreColor
        });
        options.push({
            x: barcodeSize.x, y: barTop + drawableHeight - barWidth, width: drawableWidth,
            height: barWidth, color: this.foreColor
        });
        if (this.bearerBar === 'Frame') {
            // Left and right bearer bars.
            options.push({
                x: barcodeSize.x, y: barTop, width: barWidth,
                height: drawableHeight, color: this.foreColor
            });
            options.push({
                x: barcodeSize.x + drawableWidth - barWidth, y: barTop, width: barWidth,
                height: drawableHeight, color: this.foreColor
            });
        }
        // eslint-disable-next-line
        const renderer: BarcodeRenderer = new BarcodeRenderer(canvas.id, this.isSvgMode);
        let index: number;
        for (index = 0; index < options.length; index++) {
            renderer.renderRectElement(canvas, options[parseInt(index.toString(), 10)]);
        }
    }

    /**
     * GS1 modulo 10 check digit. Weights 3 and 1 alternate from the right of
     * the supplied digits.
     *
     * @param {string} digits - The digits before the check digit.
     * @returns {number} The check digit.
     */
    private calculateCheckDigit(digits: string): number {
        let sum: number = 0;
        let weight: number = 3;
        let index: number;
        for (index = digits.length - 1; index >= 0; index--) {
            sum += (digits.charCodeAt(index) - 48) * weight;
            weight = weight === 3 ? 1 : 3;
        }
        return (10 - (sum % 10)) % 10;
    }

    private message(key: string): string {
        return this.locale ? (this.locale.getConstant(key) || key) : key;
    }
}
