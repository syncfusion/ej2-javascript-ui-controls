import { OneDimension } from '../one-dimension';
import { BarcodeRenderer } from '../rendering/renderer';
import { BaseAttributes } from '../rendering/canvas-interface';
import { Rect } from '../primitives/rect';
import { createMeasureElements, measureText } from '../utility/dom-util';
import { Size } from '../primitives/size';
import { L10n } from '@syncfusion/ej2-base';
import { encodeGtinDataBar, encodeGtinDataBarLimited, calculateCheckDigit } from '../../gs1/gs1-databar-encoder';

/**
 * One drawn row of a GS1 DataBar symbol: the module pattern of the row, in
 * module units, and the row height in module units. A 1 module is a bar and
 * a 0 module is a space.
 */
interface Gs1DataBarRow {
    /** The module pattern of the row. */
    pixels: number[];
    /** The row height in module units. */
    height: number;
}

/**
 * The symbol layouts of the five GTIN-only GS1 DataBar variants, from
 * ISO/IEC 24724. All module counts and row heights are symbol constants.
 */
const OMNIDIRECTIONAL_HEIGHT: number = 33;
const TRUNCATED_HEIGHT: number = 13;
const STACKED_HEIGHTS: number[] = [5, 1, 7];
const STACKED_OMNIDIRECTIONAL_HEIGHTS: number[] = [33, 1, 1, 1, 33];
const STACKED_QUIET_ZONE: number = 10;
const LIMITED_HEIGHT: number = 10;

/**
 * The right-shifted module pattern of the finder value 3, from ISO/IEC
 * 24724 Stacked Omnidirectional: the row below the finder separator.
 */
const FINDER_PATTERN_3: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1];

/**
 * The separator module pattern drawn below a Stacked Omnidirectional top
 * row whose lower row encodes the finder value 3.
 */
const FINDER_SEPARATOR: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];

/**
 * GS1 DataBar: the five GTIN-only variants of the GS1 DataBar family, per
 * ISO/IEC 24724. The value is a 13- or 14-digit GTIN, or (01) followed by 14
 * digits; 13 digits get the check digit calculated and appended. The bars are
 * built by the merged shared DataBar encoder; this class adds the per-variant
 * layout, validation and rendering. Invalid input triggers the invalid event
 * with a localized message and nothing is drawn.
 */
export class GS1DataBar extends OneDimension {

    /**
     * Localization object of the BarcodeGenerator, assigned before validation.
     *
     * @private
     */
    public locale: L10n;

    /**
     * The variant layout this instance draws, set from the barcode type.
     *
     * @private
     */
    public databarVariant: 'Omnidirectional' | 'Truncated' | 'Stacked' | 'StackedOmnidirectional' | 'Limited';

    /**
     * The validated 14-digit GTIN of the last validation.
     *
     * @private
     */
    private gtin: string;

    /**
     * Validate the GS1 DataBar value. Accepts 13 digits (the check digit is
     * calculated and appended), 14 digits (the check digit is validated) or
     * (01) followed by 14 digits; all three produce the same barcode. The
     * Limited variant also requires the GTIN to start with 0 or 1.
     *
     * @param {string} char - The GS1 DataBar value.
     * @returns {string} The localized error message, or undefined when valid.
     * @private
     */
    public validateInput(char: string): string {
        let gtin: string = char;
        if (char.length === 18 && char.substring(0, 4) === '(01)') {
            gtin = char.substring(4);
        }
        if (gtin.search(/^[0-9]{13}$/) !== -1) {
            gtin = gtin + calculateCheckDigit(gtin);
        } else if (gtin.search(/^[0-9]{14}$/) === -1) {
            return this.message('DataBarInvalidGtin');
        } else if (Number(gtin.charAt(13)) !== calculateCheckDigit(gtin.substring(0, 13))) {
            return this.message('GS1InvalidCheckDigit');
        }
        if (this.databarVariant === 'Limited' && gtin.charAt(0) !== '0' && gtin.charAt(0) !== '1') {
            return this.message('DataBarLimitedInvalidGtin');
        }
        const sizeError: string = this.validateSize(gtin);
        if (sizeError) {
            return sizeError;
        }
        this.gtin = gtin;
        return undefined;
    }

    /**
     * Check that the component is large enough for the variant: bars at
     * least 1 pixel wide and the rows at least 1 module high, after the
     * margins, per the shared size behavior of the GS1 barcodes.
     *
     * @param {string} gtin - The validated 14-digit GTIN.
     * @returns {string} The InsufficientSize message, or undefined when the
     * component is large enough.
     */
    private validateSize(gtin: string): string {
        const barcodeSize: Rect = this.getDrawableSize(this.margin, this.width as number, this.height as number);
        if (barcodeSize.width <= 0 || barcodeSize.height <= 0) {
            return this.message('InsufficientSize');
        }
        const stacked: boolean = this.databarVariant === 'Stacked' || this.databarVariant === 'StackedOmnidirectional';
        const quietZoneModules: number = stacked ? STACKED_QUIET_ZONE : 0;
        const moduleCount: number = this.databarVariant === 'Limited' ? 80 : (stacked ? 50 : 96);
        const totalModules: number = stacked ?
            (this.databarVariant === 'Stacked' ? 13 : 69) :
            (this.databarVariant === 'Limited' ? 10 :
                (this.databarVariant === 'Truncated' ? 13 : 33));
        const textOptions: BaseAttributes = {
            width: undefined, height: undefined, x: 0, y: 0, color: this.foreColor,
            string: this.displayText.text ? this.displayText.text : '(01)' + gtin,
            stringSize: this.displayText.size, visibility: this.displayText.visibility,
            fontStyle: this.displayText.font
        };
        createMeasureElements();
        const textSize: Size = measureText(textOptions);
        const scaleValue: number = this.isSvgMode ? 1 : 1.5;
        const barHeight: number = barcodeSize.height - (textSize.height / 2 + 2) * scaleValue;
        if (barcodeSize.width / (moduleCount + quietZoneModules * 2) < 1 || barHeight / totalModules < 1) {
            return this.message('InsufficientSize');
        }
        return undefined;
    }

    /**
     * Draw the GS1 DataBar variant: the element-width pattern from the shared
     * encoder, laid out per the variant with rows and separators, on the SVG
     * or Canvas.
     *
     * @param {HTMLElement} canvas - The canvas element.
     * @returns {void} Draw the barcode SVG.
     * @private
     */
    public draw(canvas: HTMLElement): void {
        const rows: Gs1DataBarRow[] = this.buildRows(this.gtin);
        this.drawRows(canvas as HTMLCanvasElement, rows);
    }

    /**
     * Build the module rows of the variant symbol from the shared encoder
     * pattern. A 1 module is a bar and a 0 module is a space.
     *
     * @param {string} gtin - The validated 14-digit GTIN.
     * @returns {Gs1DataBarRow[]} The rows with their heights in module units.
     */
    private buildRows(gtin: string): Gs1DataBarRow[] {
        if (this.databarVariant === 'Limited') {
            const encoded: { widths: number[] } = encodeGtinDataBarLimited(gtin) as { widths: number[] };
            return [{ pixels: this.expandWidths(encoded.widths, false), height: LIMITED_HEIGHT }];
        }
        const encoded: { widths: number[] } = encodeGtinDataBar(gtin);
        const widths: number[] = encoded.widths;
        if (this.databarVariant === 'Omnidirectional') {
            return [{ pixels: this.expandWidths(widths, false), height: OMNIDIRECTIONAL_HEIGHT }];
        }
        if (this.databarVariant === 'Truncated') {
            return [{ pixels: this.expandWidths(widths, false), height: TRUNCATED_HEIGHT }];
        }
        // Stacked variants use two 50-module rows. The first data character
        // and finder pattern form the top row; the remaining pattern forms
        // the bottom row, with the row guard modules at each end.
        const topWidths: number[] = [1, 1].concat(widths.slice(2, 23), [1, 1, 0]);
        const bottomWidths: number[] = [1, 1].concat(widths.slice(23, 44), [1, 1, 0]);
        const top: number[] = this.expandWidths(topWidths, false);
        const bottom: number[] = this.expandWidths(bottomWidths, true);
        if (this.databarVariant === 'Stacked') {
            return [
                { pixels: top, height: STACKED_HEIGHTS[0] },
                { pixels: this.stackedSeparator(top, bottom), height: STACKED_HEIGHTS[1] },
                { pixels: bottom, height: STACKED_HEIGHTS[2] }
            ];
        }
        const separators: number[][] = this.stackedOmnidirectionalSeparators(bottom);
        return [
            { pixels: top, height: STACKED_OMNIDIRECTIONAL_HEIGHTS[0] },
            { pixels: separators[0], height: STACKED_OMNIDIRECTIONAL_HEIGHTS[1] },
            { pixels: separators[1], height: STACKED_OMNIDIRECTIONAL_HEIGHTS[2] },
            { pixels: separators[2], height: STACKED_OMNIDIRECTIONAL_HEIGHTS[3] },
            { pixels: bottom, height: STACKED_OMNIDIRECTIONAL_HEIGHTS[4] }
        ];
    }

    /**
     * Expand element widths into one module per position. Even indexes hold
     * bar widths and odd indexes space widths when barFirst, and the reverse
     * when the row starts with a space.
     *
     * @param {number[]} widths - The element widths of the row.
     * @param {boolean} barFirst - Whether the first element is a bar.
     * @returns {number[]} The module pattern of the row.
     */
    private expandWidths(widths: number[], barFirst: boolean): number[] {
        const pixels: number[] = [];
        let index: number;
        for (index = 0; index < widths.length; index += 2) {
            this.appendRun(pixels, widths[parseInt(index.toString(), 10)], barFirst ? 1 : 0);
            const spaceWidth: number = index + 1 < widths.length ?
                widths[parseInt((index + 1).toString(), 10)] : 0;
            this.appendRun(pixels, spaceWidth, barFirst ? 0 : 1);
        }
        return pixels;
    }

    /**
     * Append one run of equal modules to a row pattern.
     *
     * @param {number[]} pixels - The row pattern being built.
     * @param {number} count - The number of modules in the run.
     * @param {number} value - The module value of the run.
     * @returns {void} The run is appended in place.
     */
    private appendRun(pixels: number[], count: number, value: number): void {
        let index: number;
        for (index = 0; index < count; index++) {
            pixels.push(value);
        }
    }

    /**
     * The separator row of the Stacked variant, per ISO/IEC 24724: each module
     * is the color of the aligned module when the rows agree there, and
     * otherwise alternates from the previous module; the four modules at each
     * end are light.
     *
     * @param {number[]} top - The top row pattern.
     * @param {number[]} bottom - The bottom row pattern.
     * @returns {number[]} The separator row pattern.
     */
    private stackedSeparator(top: number[], bottom: number[]): number[] {
        const separator: number[] = [0];
        let index: number;
        for (index = 1; index < 50; index++) {
            const current: number = index;
            separator[parseInt(current.toString(), 10)] =
                top[parseInt(current.toString(), 10)] === bottom[parseInt(current.toString(), 10)] ?
                    1 - top[parseInt(current.toString(), 10)] : 1 - separator[parseInt((current - 1).toString(), 10)];
        }
        for (index = 0; index < 4; index++) {
            separator[parseInt(index.toString(), 10)] = 0;
        }
        for (index = 46; index < 50; index++) {
            separator[parseInt(index.toString(), 10)] = 0;
        }
        return separator;
    }

    /**
     * The three separator rows of the Stacked Omnidirectional variant, per
     * ISO/IEC 24724. The outer rows use the alternating separator pattern,
     * with the finder separator replacing part of the third row when the
     * bottom row encodes finder value 3. The middle row is offset by one
     * module from the outer rows.
     *
     * @param {number[]} bottom - The bottom row pattern.
     * @returns {Array.<Array.<number>>} The three separator row patterns.
     */
    private stackedOmnidirectionalSeparators(bottom: number[]): number[][] {
        const first: number[] = [0, 0, 0, 0];
        let index: number;
        for (index = 0; index < 21; index++) {
            first.push(1, 0);
        }
        first.push(0, 0, 0, 0);
        const third: number[] = first.slice();
        // The finder separator under the finder value 3.
        let isFinderThree: boolean = true;
        for (index = 0; index <= 12; index++) {
            if (bottom[parseInt((19 + index).toString(), 10)] !== FINDER_PATTERN_3[parseInt(index.toString(), 10)]) {
                isFinderThree = false;
                break;
            }
        }
        if (isFinderThree) {
            for (index = 0; index <= 12; index++) {
                third[parseInt((19 + index).toString(), 10)] = FINDER_SEPARATOR[parseInt(index.toString(), 10)];
            }
        }
        // The alternating middle separator, light at each end.
        const second: number[] = [0, 0, 0, 0];
        for (index = 0; index < 21; index++) {
            second.push(0, 1);
        }
        second.push(0, 0, 0, 0);
        return [first, second, third];
    }

    /**
     * Draw the rows of the variant symbol as bars, with the human-readable
     * text (01) with the 14 digits below or above, per the displayText
     * settings shared with the other barcode types.
     *
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Gs1DataBarRow[]} rows - The rows with their heights in modules.
     * @returns {void} Draw the barcode.
     */
    private drawRows(canvas: HTMLCanvasElement, rows: Gs1DataBarRow[]): void {
        const barcodeSize: Rect = this.getDrawableSize(this.margin, this.width as number, this.height as number);
        if (barcodeSize.height <= 0 || barcodeSize.width <= 0) {
            return;
        }
        const stacked: boolean = this.databarVariant === 'Stacked' || this.databarVariant === 'StackedOmnidirectional';
        const quietZoneModules: number = stacked ? STACKED_QUIET_ZONE : 0;
        const moduleCount: number = rows[0].pixels.length + quietZoneModules * 2;
        const totalHeight: number = rows.reduce((sum: number, row: Gs1DataBarRow) => sum + row.height, 0);
        const textOptions: BaseAttributes = {
            width: undefined, height: undefined, x: 0, y: 0, color: this.foreColor,
            string: this.displayText.text ? this.displayText.text : '(01)' + this.gtin,
            stringSize: this.displayText.size, visibility: this.displayText.visibility,
            fontStyle: this.displayText.font
        };
        createMeasureElements();
        const textSize: Size = measureText(textOptions);
        const textHeight: number = (textSize.height / 2) + 2;
        const scaleValue: number = this.isSvgMode ? 1 : 1.5;
        // The module widths, leaving room for the display text.
        const barHeight: number = barcodeSize.height - textHeight * scaleValue;
        if (barHeight <= 0) {
            return;
        }
        const moduleWidth: number = barcodeSize.width / moduleCount;
        if (moduleWidth < 1) {
            return;
        }
        const rowHeightScale: number = barHeight / totalHeight;
        const position: string = this.displayText.position;
        const barTop: number = position === 'Top' ?
            barcodeSize.y + textHeight + this.displayText.margin.top : barcodeSize.y;
        const options: BaseAttributes[] = [];
        let offsetY: number = barTop;
        let index: number;
        for (index = 0; index < rows.length; index++) {
            const row: Gs1DataBarRow = rows[parseInt(index.toString(), 10)];
            const height: number = row.height * rowHeightScale;
            let moduleIndex: number;
            let runStart: number = -1;
            for (moduleIndex = 0; moduleIndex <= row.pixels.length; moduleIndex++) {
                const isBar: boolean = moduleIndex < row.pixels.length &&
                    row.pixels[parseInt(moduleIndex.toString(), 10)] === 1;
                if (isBar && runStart === -1) {
                    runStart = moduleIndex;
                } else if (!isBar && runStart !== -1) {
                    options.push({
                        x: barcodeSize.x + (quietZoneModules + runStart) * moduleWidth, y: offsetY,
                        width: (moduleIndex - runStart) * moduleWidth, height: height, color: this.foreColor
                    });
                    runStart = -1;
                }
            }
            offsetY += height;
        }
        const renderer: BarcodeRenderer = new BarcodeRenderer(canvas.id, this.isSvgMode);
        for (index = 0; index < options.length; index++) {
            renderer.renderRectElement(canvas, options[parseInt(index.toString(), 10)]);
        }
        if (this.displayText.visibility) {
            textOptions.x = barcodeSize.x + (barcodeSize.width - textSize.width) / 2;
            textOptions.y = position === 'Bottom' ?
                (barcodeSize.y + barcodeSize.height) + 2 : (barcodeSize.y + textHeight) - 2;
            if (!this.isSvgMode) {
                textOptions.y /= 1.5;
            }
            renderer.renderTextElement(canvas, textOptions);
        }
    }

    private message(key: string): string {
        return this.locale ? (this.locale.getConstant(key) || key) : key;
    }
}
