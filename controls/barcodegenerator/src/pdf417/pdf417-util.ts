import { PDF417CompactionMode, PDF417ErrorCorrectionLevel } from '../barcode/enum/enum';
import { BarcodeRenderer } from '../barcode/rendering/renderer';
import { BaseAttributes } from '../barcode/rendering/canvas-interface';
import { DisplayTextModel } from '../barcode/primitives/displaytext-model';
import { MarginModel } from '../barcode/primitives/margin-model';
import { getBaseAttributes } from '../barcode/utility/barcode-util';
import { createMeasureElements, measureText } from '../barcode/utility/dom-util';
import { Size } from '../barcode/primitives/size';
import { encodePDF417, PDF417EncodeResult, PDF417_MIN_ROW_HEIGHT, PDF417_QUIET_ZONE } from './pdf417-encoder';

/**
 * PDF417 layout and drawing
 */
/** @private */
export class PDF417 {
    /** @private */
    public value: string;
    /** @private */
    public width: number;
    /** @private */
    public height: number;
    /** @private */
    public isSvgMode: boolean;
    /** @private */
    public margin: MarginModel;
    /** @private */
    public displayText: DisplayTextModel;
    /** @private */
    public foreColor: string;
    /** @private */
    public compactionMode: PDF417CompactionMode;
    /** @private */
    public errorCorrectionLevel: PDF417ErrorCorrectionLevel;
    /** @private */
    public rows: number;
    /** @private */
    public columns: number;
    /** @private */
    public isCompact: boolean;
    /** @private */
    public rowHeightRatio: number;
    /** @private */
    public result: PDF417EncodeResult;

    private textOptions: BaseAttributes;
    private textHeight: number = 0;
    private symbolX: number;
    private symbolY: number;
    private symbolWidth: number;
    private symbolHeight: number;
    private moduleWidth: number;
    private rowHeight: number;
    /** Rows and columns of the previous symbol, supplied by the component. */
    public previousLayout: { rows: number, columns: number };

    private get scale(): number {
        // Canvas mode renders into a canvas 1.5 times the element size (see the component).
        return this.isSvgMode ? 1 : 1.5;
    }

    /**
     * Measures the display text, calculates the symbol area and encodes the value.
     *
     * @returns {PDF417EncodeResult} encoding result; when success is false, error holds the reason.
     * @private
     */
    public build(): PDF417EncodeResult {
        const scale: number = this.scale;
        const left: number = this.margin.left * scale;
        const right: number = this.margin.right * scale;
        const top: number = this.margin.top * scale;
        const bottom: number = this.margin.bottom * scale;
        const x: number = left;
        let y: number = top;
        const width: number = Math.max(0, this.width - left - right);
        let height: number = Math.max(0, this.height - top - bottom);
        this.textHeight = 0;
        this.textOptions = undefined;
        if (this.displayText.visibility) {
            this.textOptions = this.measureDisplayText();
            const textMargin: MarginModel = this.displayText.margin;
            this.textHeight = this.textOptions.height + (textMargin.top + textMargin.bottom) * scale;
            height = Math.max(0, height - this.textHeight);
            if (this.displayText.position === 'Top') {
                y += this.textHeight;
            }
        }
        this.symbolX = x;
        this.symbolY = y;
        this.symbolWidth = width;
        this.symbolHeight = height;
        this.result = encodePDF417({
            value: this.value,
            compactionMode: this.compactionMode,
            errorCorrectionLevel: this.errorCorrectionLevel,
            rows: this.rows,
            columns: this.columns,
            isCompact: this.isCompact,
            rowHeightRatio: this.rowHeightRatio,
            availableWidth: width,
            availableHeight: height,
            previousLayout: this.previousLayout
        });
        if (this.result.success) {
            this.calculateModuleSize();
            // Bars narrower than one pixel cannot be drawn or scanned reliably.
            if (!(this.moduleWidth >= 1 && this.rowHeight >= 1)) {
                this.result = { success: false, error: 'InsufficientSize' };
            }
        }
        return this.result;
    }

    private calculateModuleSize(): void {
        const result: PDF417EncodeResult = this.result;
        const quiet: number = PDF417_QUIET_ZONE;
        const ratio: number = this.rowHeightRatio || PDF417_MIN_ROW_HEIGHT;
        // Fit the symbol, including the quiet zone, to the control. Flooring the module
        // and centering the leftover space makes the barcode jump when width or height
        // crosses an integer boundary instead of scaling.
        this.moduleWidth = Math.min(
            this.symbolWidth / (result.moduleCount + 2 * quiet),
            this.symbolHeight / (result.rows * ratio + 2 * quiet));
        // Keep the requested Y/X ratio. Flooring here drops 3.5 to 3 when the module is
        // one pixel wide, so the ratio would not be applied.
        this.rowHeight = this.moduleWidth * ratio;
    }

    /**
     * Draws the encoded symbol and the display text.
     *
     * @returns {void}
     * @param {HTMLElement} canvas - root SVG or canvas element
     * @private
     */
    public draw(canvas: HTMLElement): void {
        const result: PDF417EncodeResult = this.result;
        if (!result || !result.success) {
            return;
        }
        const rows: number = result.rows;
        const moduleWidth: number = this.moduleWidth;
        const rowHeight: number = this.rowHeight;
        const ratio: number = this.rowHeightRatio || PDF417_MIN_ROW_HEIGHT;
        const quiet: number = PDF417_QUIET_ZONE;
        const drawnWidth: number = result.moduleCount * moduleWidth;
        const drawnHeight: number = rows * rowHeight;
        // The quiet zone is part of the fitted symbol. Any sub-pixel remainder (the two
        // constraints rarely divide the area exactly) stays centered, so growing the
        // control scales the bars instead of sliding them.
        const offsetX: number = this.symbolX + quiet * moduleWidth +
            (this.symbolWidth - (result.moduleCount + 2 * quiet) * moduleWidth) / 2;
        const offsetY: number = this.symbolY + quiet * rowHeight +
            (this.symbolHeight - (rows * ratio + 2 * quiet) * moduleWidth) / 2;
        const renderer: BarcodeRenderer = this.getInstance(canvas.id);
        for (let r: number = 0; r < rows; r++) {
            const row: number[] = result.matrix[parseInt(r.toString(), 10)];
            let c: number = 0;
            while (c < row.length) {
                if (row[parseInt(c.toString(), 10)] !== 1) {
                    c++;
                    continue;
                }
                const start: number = c;
                while (c < row.length && row[parseInt(c.toString(), 10)] === 1) {
                    c++;
                }
                // Each run of adjacent bar modules becomes one rectangle.
                renderer.renderRectElement(canvas as HTMLCanvasElement, getBaseAttributes(
                    (c - start) * moduleWidth, rowHeight, offsetX + start * moduleWidth, offsetY + r * rowHeight, this.foreColor));
            }
        }
        if (this.textOptions) {
            this.drawDisplayText(canvas, renderer, offsetX, drawnWidth, offsetY, drawnHeight);
        }
        // Release the matrix; it is rebuilt on the next render.
        this.result.matrix = undefined;
    }

    private measureDisplayText(): BaseAttributes {
        createMeasureElements();
        const textOptions: BaseAttributes = getBaseAttributes(0, 0, 0, 0, this.foreColor);
        textOptions.string = this.displayText.text ? this.displayText.text : this.value;
        textOptions.fontStyle = this.displayText.font;
        textOptions.stringSize = this.displayText.size;
        textOptions.visibility = this.displayText.visibility;
        const size: Size = measureText(textOptions);
        textOptions.width = size.width * this.scale;
        textOptions.height = size.height * this.scale;
        textOptions.stringSize = this.displayText.size * this.scale;
        return textOptions;
    }

    private drawDisplayText(canvas: HTMLElement, renderer: BarcodeRenderer, symbolLeft: number, symbolWidth: number,
                            symbolTop: number, symbolHeight: number): void {
        const scale: number = this.scale;
        const options: BaseAttributes = this.textOptions;
        const textMargin: MarginModel = this.displayText.margin;
        this.fitDisplayText(options, this.symbolWidth - (textMargin.left + textMargin.right) * scale);
        if (this.displayText.alignment === 'Left') {
            options.x = symbolLeft + textMargin.left * scale;
        } else if (this.displayText.alignment === 'Right') {
            options.x = symbolLeft + symbolWidth - options.width - textMargin.right * scale;
        } else {
            options.x = symbolLeft + (symbolWidth - options.width) / 2;
        }
        options.x = Math.max(this.margin.left * scale, options.x);
        // y is the text baseline.
        const baselineOffset: number = options.height * 0.8;
        if (this.displayText.position === 'Top') {
            options.y = symbolTop - (textMargin.bottom * scale) - options.height + baselineOffset;
            options.y = Math.max(options.y, this.margin.top * scale + textMargin.top * scale + baselineOffset);
        } else {
            options.y = symbolTop + symbolHeight + textMargin.top * scale + baselineOffset;
        }
        renderer.renderTextElement(canvas as HTMLCanvasElement, options);
    }

    /**
     * Shortens the display text with an ellipsis when it is wider than the available width.
     * PDF417 values are often long, and the text is drawn on a single line.
     *
     * @returns {void}
     * @param {BaseAttributes} options - measured text options; string and width are updated in place
     * @param {number} maxWidth - available width in pixels
     */
    private fitDisplayText(options: BaseAttributes, maxWidth: number): void {
        if (options.width <= maxWidth) {
            return;
        }
        const ellipsis: string = '\u2026';
        const full: string = options.string;
        let low: number = 0;
        let high: number = full.length;
        let width: number = 0;
        // Longest prefix that fits together with the ellipsis.
        while (low < high) {
            const mid: number = Math.ceil((low + high) / 2);
            options.string = full.substring(0, mid) + ellipsis;
            if (measureText(options).width <= maxWidth) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }
        // A scannable symbol is always wider than one character, so low is never 0 here.
        /* istanbul ignore next */
        options.string = low > 0 ? full.substring(0, low).replace(/\s+$/, '') + ellipsis : '';
        /* istanbul ignore next */
        width = options.string ? measureText(options).width : 0;
        options.width = width;
    }

    private getInstance(id: string): BarcodeRenderer {
        return new BarcodeRenderer(id, this.isSvgMode);
    }
}
