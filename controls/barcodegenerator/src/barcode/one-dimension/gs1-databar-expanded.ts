import { OneDimension } from '../one-dimension';
import { BarcodeRenderer } from '../rendering/renderer';
import { BaseAttributes } from '../rendering/canvas-interface';
import { Rect } from '../primitives/rect';
import { createMeasureElements, measureText } from '../utility/dom-util';
import { Size } from '../primitives/size';
import { L10n } from '@syncfusion/ej2-base';
import { parseGs1, Gs1Success } from '../../gs1/gs1-parser';
import {
    encodeExpandedDataBar, Gs1DataBarExpandedEncoded, Gs1DataBarSegment
} from '../../gs1/gs1-databar-encoder';

/**
 * One drawn row of a GS1 DataBar Expanded symbol: the module pattern of the
 * row, in module units, and the row height in module units. A 1 module is a
 * bar and a 0 module is a space.
 */
interface Gs1DataBarExpandedRow {
    /** The module pattern of the row. */
    pixels: number[];
    /** The row height in module units. */
    height: number;
}

/**
 * The symbol constants of the Expanded variants, from ISO/IEC 24724.
 */
const EXPANDED_ROW_HEIGHT: number = 34;
const EXPANDED_SEPARATOR_HEIGHT: number = 1;
const EXPANDED_MAX_SEGMENTS: number = 22;
const EXPANDED_MAX_ROWS: number = 11;
const EXPANDED_MAX_DIGITS: number = 74;
const EXPANDED_MAX_LETTERS: number = 41;

/**
 * GS1 DataBar Expanded and Expanded Stacked, per ISO/IEC 24724. The value is
 * GS1 data, bracketed or raw; it is validated by the shared GS1 parser and
 * encoded by the merged shared DataBar encoder, which chooses the compressed
 * method for a GTIN starting with 9 followed by one weight or price AI. The
 * Expanded Stacked variant splits the symbol into rows of segmentsPerRow
 * segments, an even number from 2 to 20. Invalid input triggers the invalid
 * event with a localized message and nothing is drawn.
 */
export class GS1DataBarExpanded extends OneDimension {

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
    public databarVariant: 'Expanded' | 'ExpandedStacked';

    /**
     * The number of segments in each row of the Expanded Stacked variant, an
     * even number from 2 to 20. The one-row variant ignores it.
     *
     * @private
     */
    public segmentsPerRow: number;

    /**
     * The encoded symbol of the last validation.
     *
     * @private
     */
    private encoded: Gs1DataBarExpandedEncoded;

    /**
     * Validate the GS1 DataBar Expanded value: bracketed or raw GS1 data,
     * validated by the shared parser, within the 74-digit or 41-letter limit
     * and the 22-segment symbol capacity. The Expanded Stacked variant also
     * requires segmentsPerRow to be an even number from 2 to 20 and at most
     * 11 rows.
     *
     * @param {string} char - The GS1 DataBar Expanded value.
     * @returns {string} The localized error message, or undefined when valid.
     * @private
     */
    public validateInput(char: string): string {
        const parsed: { ok: boolean; error?: string } = parseGs1(char);
        if (!parsed.ok) {
            return this.message(parsed.error);
        }
        const gs1: Gs1Success = parsed as Gs1Success;
        if (!this.withinCapacity(gs1)) {
            return this.message('DataBarDataTooLong');
        }
        const encoded: Gs1DataBarExpandedEncoded | string = encodeExpandedDataBar(
            gs1, this.databarVariant === 'ExpandedStacked' ? this.segmentsPerRow : undefined);
        if (typeof encoded === 'string') {
            return this.message(encoded);
        }
        if (this.databarVariant === 'ExpandedStacked') {
            const segmentsPerRow: number = this.segmentsPerRow;
            if (!segmentsPerRow || segmentsPerRow < 2 || segmentsPerRow > 20 || segmentsPerRow % 2 !== 0) {
                return this.message('DataBarInvalidSegmentsPerRow');
            }
            const rowCount: number = Math.ceil(encoded.segments.length / segmentsPerRow);
            if (rowCount > EXPANDED_MAX_ROWS) {
                return this.message('DataBarDataTooLong');
            }
        }
        const sizeError: string = this.validateSize(encoded);
        if (sizeError) {
            return sizeError;
        }
        this.encoded = encoded;
        return undefined;
    }

    /**
     * The capacity limit of the Expanded symbol: at most 74 digits or 41
     * letters of GS1 data, and at most 22 segments.
     *
     * @param {Gs1Success} gs1 - The parsed GS1 data.
     * @returns {boolean} Whether the data fits the symbol.
     */
    private withinCapacity(gs1: Gs1Success): boolean {
        const data: string = gs1.encodingData;
        let digits: number = 0;
        let letters: number = 0;
        let index: number;
        for (index = 0; index < data.length; index++) {
            const charCode: number = data.charCodeAt(index);
            if (charCode >= 48 && charCode <= 57) {
                digits++;
            } else {
                letters++;
            }
        }
        // ISO/IEC 24724 limits the symbol to 74 numeric characters, or 41
        // alphanumeric characters. A purely numeric value uses the digit limit;
        // once any letter is present only the letters are counted, so the numeric
        // AI prefixes of a letter value do not consume the letter budget.
        if (letters === 0) {
            return digits <= EXPANDED_MAX_DIGITS && data.length <= EXPANDED_MAX_SEGMENTS * 12;
        }
        return letters <= EXPANDED_MAX_LETTERS && data.length <= EXPANDED_MAX_SEGMENTS * 12;
    }

    /**
     * Check that the component is large enough: bars at least 1 pixel wide and
     * the rows at least 1 module high, after the margins, per the shared size
     * behavior of the GS1 barcodes.
     *
     * @param {Gs1DataBarExpandedEncoded} encoded - The encoded symbol.
     * @returns {string} The InsufficientSize message, or undefined when the
     * component is large enough.
     */
    private validateSize(encoded: Gs1DataBarExpandedEncoded): string {
        const barcodeSize: Rect = this.getDrawableSize(this.margin, this.width as number, this.height as number);
        if (barcodeSize.width <= 0 || barcodeSize.height <= 0) {
            return this.message('InsufficientSize');
        }
        const rows: Gs1DataBarExpandedRow[] = this.buildRows(encoded);
        const moduleCount: number = rows[0].pixels.length;
        const totalModules: number = rows.reduce(
            (sum: number, row: Gs1DataBarExpandedRow) => sum + row.height, 0);
        const textOptions: BaseAttributes = {
            width: undefined, height: undefined, x: 0, y: 0, color: this.foreColor,
            string: this.displayText.text ? this.displayText.text : encoded.humanReadableText,
            stringSize: this.displayText.size, visibility: this.displayText.visibility,
            fontStyle: this.displayText.font
        };
        createMeasureElements();
        const textSize: Size = measureText(textOptions);
        const scaleValue: number = this.isSvgMode ? 1 : 1.5;
        const barHeight: number = barcodeSize.height - (textSize.height / 2 + 2) * scaleValue;
        if (barcodeSize.width / (moduleCount * scaleValue) < 1 || barHeight / (totalModules * scaleValue) < 1) {
            return this.message('InsufficientSize');
        }
        return undefined;
    }

    /**
     * Draw the GS1 DataBar Expanded symbol: the element-width pattern from the
     * shared encoder, one row for the Expanded variant and rows of
     * segmentsPerRow segments with separators for the Expanded Stacked variant.
     *
     * @param {HTMLElement} canvas - The canvas element.
     * @returns {void} Draw the barcode SVG.
     * @private
     */
    public draw(canvas: HTMLElement): void {
        const rows: Gs1DataBarExpandedRow[] = this.buildRows(this.encoded);
        this.drawRows(canvas as HTMLCanvasElement, rows);
    }

    /**
     * Build the module rows of the symbol from the shared encoder segments. A
     * 1 module is a bar and a 0 module is a space. The Expanded Stacked variant
     * splits the segments into rows of segmentsPerRow segments, each row
     * closed by a 1-module guard bar, with a 1-module separator between rows.
     *
     * @param {Gs1DataBarExpandedEncoded} encoded - The encoded symbol.
     * @returns {Gs1DataBarExpandedRow[]} The rows with their heights in modules.
     */
    private buildRows(encoded: Gs1DataBarExpandedEncoded): Gs1DataBarExpandedRow[] {
        const segments: Gs1DataBarSegment[] = encoded.segments;
        if (this.databarVariant !== 'ExpandedStacked') {
            return [{
                pixels: this.linearPixels(segments),
                height: EXPANDED_ROW_HEIGHT
            }];
        }
        const perRow: number = this.segmentsPerRow;
        const symbolRows: { pixels: number[]; separator: number[] }[] = [];
        let start: number;
        for (start = 0; start < segments.length; start += perRow) {
            const rowIndex: number = symbolRows.length;
            const rowSegments: Gs1DataBarSegment[] = segments.slice(start, start + perRow);
            const pixels: number[] = this.rowPixels(
                rowSegments, perRow % 4 !== 0 && rowIndex % 2 === 1);
            const separator: number[] = this.separatorRow(pixels);
            if (perRow % 4 === 0 && rowIndex % 2 === 1) {
                const partialRow: boolean = pixels.length < symbolRows[0].pixels.length;
                if (partialRow && this.finderPositions(pixels.length).length % 2 === 1) {
                    pixels.unshift(0);
                    separator.unshift(0);
                } else {
                    pixels.reverse();
                    separator.reverse();
                }
            }
            symbolRows.push({ pixels: pixels, separator: separator });
        }
        const moduleCount: number = symbolRows[0].pixels.length;
        for (const row of symbolRows) {
            while (row.pixels.length < moduleCount) {
                row.pixels.push(0);
                row.separator.push(0);
            }
        }
        const middleSeparator: number[] = [];
        let moduleIndex: number;
        for (moduleIndex = 0; moduleIndex < 4; moduleIndex++) {
            middleSeparator.push(0);
        }
        for (moduleIndex = 4; moduleIndex < moduleCount - 4; moduleIndex++) {
            middleSeparator.push(moduleIndex % 2 === 1 ? 1 : 0);
        }
        middleSeparator.push(0, 0, 0, 0);
        const rows: Gs1DataBarExpandedRow[] = [];
        symbolRows.forEach((row: { pixels: number[]; separator: number[] }, rowIndex: number) => {
            if (rowIndex > 0) {
                rows.push({ pixels: row.separator, height: EXPANDED_SEPARATOR_HEIGHT });
            }
            rows.push({ pixels: row.pixels, height: EXPANDED_ROW_HEIGHT });
            if (rowIndex < symbolRows.length - 1) {
                rows.push({ pixels: row.separator, height: EXPANDED_SEPARATOR_HEIGHT });
                rows.push({ pixels: middleSeparator, height: EXPANDED_SEPARATOR_HEIGHT });
            }
        });
        return rows;
    }

    /**
     * Build the run pattern of a linear Expanded symbol. Linear rendering
     * starts with a dark run placeholder; the guards are space then bar.
     *
     * @param {Gs1DataBarSegment[]} segments - The encoded segments.
     * @returns {number[]} The module pattern of the symbol.
     */
    private linearPixels(segments: Gs1DataBarSegment[]): number[] {
        const runs: number[] = [0, 1, 1];
        for (const segment of segments) {
            runs.push(...segment.dataWidths);
            if (segment.finderWidths) {
                runs.push(...segment.finderWidths);
            }
        }
        runs.push(1, 1);
        const pixels: number[] = [];
        let runIndex: number = 0;
        for (const run of runs) {
            const color: number = runIndex % 2 === 0 ? 1 : 0;
            let count: number;
            for (count = 0; count < run; count++) {
                pixels.push(color);
            }
            runIndex++;
        }
        return pixels;
    }

    /**
     * The module pattern of one row: a 1-module guard bar, the data characters
     * and finder patterns of the row's segments, and a closing 1-module guard
     * bar. Odd rows of the stacked symbol are mirrored so the symbol reads in
     * both directions, per ISO/IEC 24724.
     *
     * @param {Gs1DataBarSegment[]} segments - The segments of the row.
     * @param {boolean} leadingPlaceholder - Whether the first run is a placeholder.
     * @returns {number[]} The module pattern of the row.
     */
    private rowPixels(segments: Gs1DataBarSegment[], leadingPlaceholder: boolean): number[] {
        const runs: number[] = leadingPlaceholder ? [0, 1, 1] : [1, 1];
        for (const segment of segments) {
            runs.push(...segment.dataWidths);
            if (segment.finderWidths) {
                runs.push(...segment.finderWidths);
            }
        }
        runs.push(1, 1);
        const pixels: number[] = [];
        let runIndex: number = 0;
        for (const run of runs) {
            const color: number = leadingPlaceholder ?
                (runIndex % 2 === 0 ? 1 : 0) : (runIndex % 2 === 0 ? 0 : 1);
            let count: number;
            for (count = 0; count < run; count++) {
                pixels.push(color);
            }
            runIndex++;
        }
        return pixels;
    }

    /**
     * The separator row of the Expanded Stacked variant, per ISO/IEC 24724:
     * the complement of the row above, with the four modules at each end light
     * and a dark bar added where a wide bar of the row above ends.
     *
     * @param {number[]} above - The pattern of the row above the separator.
     * @returns {number[]} The separator row pattern.
     */
    private separatorRow(above: number[]): number[] {
        const separator: number[] = above.map((pixel: number) => 1 - pixel);
        const finderPositions: number[] = this.finderPositions(above.length);
        for (const finderStart of finderPositions) {
            let index: number;
            for (index = finderStart; index <= finderStart + 14; index++) {
                const pixel: number = above.slice(index, index + 1)[0];
                if (pixel === 0 && index > 0) {
                    separator.fill(1, index - 1, index);
                } else {
                    separator.fill(0, index, index + 1);
                }
            }
        }
        separator.fill(0, 0, 4);
        separator.fill(0, separator.length - 4);
        return separator;
    }

    private finderPositions(rowLength: number): number[] {
        const positions: number[] = [];
        let position: number;
        for (position = 19; position <= rowLength - 13; position += 98) {
            positions.push(position);
        }
        for (position = 68; position <= rowLength - 13; position += 98) {
            positions.push(position);
        }
        return positions;
    }

    /**
     * Draw the rows of the symbol as bars, with the human-readable text with
     * the AIs in brackets below or above, per the displayText settings shared
     * with the other barcode types.
     *
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Gs1DataBarExpandedRow[]} rows - The rows with their heights.
     * @returns {void} Draw the barcode.
     */
    private drawRows(canvas: HTMLCanvasElement, rows: Gs1DataBarExpandedRow[]): void {
        const barcodeSize: Rect = this.getDrawableSize(this.margin, this.width as number, this.height as number);
        if (barcodeSize.height <= 0 || barcodeSize.width <= 0) {
            return;
        }
        const moduleCount: number = rows[0].pixels.length;
        const totalHeight: number = rows.reduce(
            (sum: number, row: Gs1DataBarExpandedRow) => sum + row.height, 0);
        const textOptions: BaseAttributes = {
            width: undefined, height: undefined, x: 0, y: 0, color: this.foreColor,
            string: this.displayText.text ? this.displayText.text : this.encoded.humanReadableText,
            stringSize: this.displayText.size, visibility: this.displayText.visibility,
            fontStyle: this.displayText.font
        };
        createMeasureElements();
        const textSize: Size = measureText(textOptions);
        const textHeight: number = (textSize.height / 2) + 2;
        const scaleValue: number = this.isSvgMode ? 1 : 1.5;
        const barHeight: number = barcodeSize.height - textHeight * scaleValue;
        if (barHeight <= 0) {
            return;
        }
        const moduleWidth: number = barcodeSize.width / (moduleCount * scaleValue);
        if (moduleWidth < 1) {
            return;
        }
        const rowHeightScale: number = (barHeight / scaleValue) / totalHeight;
        const position: string = this.displayText.position;
        const barTop: number = position === 'Top' ?
            barcodeSize.y + textHeight + this.displayText.margin.top : barcodeSize.y;
        const options: BaseAttributes[] = [];
        let offsetY: number = barTop;
        let index: number;
        for (index = 0; index < rows.length; index++) {
            const row: Gs1DataBarExpandedRow = rows[parseInt(index.toString(), 10)];
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
                        x: barcodeSize.x + runStart * moduleWidth, y: offsetY,
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
