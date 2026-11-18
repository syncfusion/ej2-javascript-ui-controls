import { BarcodeRenderer } from '../barcode/rendering/renderer';
import { BaseAttributes } from '../barcode/rendering/canvas-interface';
import { DisplayTextModel } from '../barcode/primitives/displaytext-model';
import { MarginModel } from '../barcode/primitives/margin-model';
import { getBaseAttributes } from '../barcode/utility/barcode-util';
import { createMeasureElements, measureText } from '../barcode/utility/dom-util';
import { Size } from '../barcode/primitives/size';
import { encodeDotCode, DotCodeEncodeResult, DOTCODE_QUIET_ZONE } from './dotcode-encoder';

/** Dot diameter as a ratio of the dot spacing, so neighbouring dots never touch. */
const DOT_DIAMETER_RATIO: number = 0.8;
/** A drawn dot of 0.8 of the spacing must still be at least one pixel wide. */
const MIN_DOT_SPACING: number = 1 / DOT_DIAMETER_RATIO;

/**
 * DotCode layout and drawing
 */
/** @private */
export class DotCode {
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
    /** Number of columns: 0 chooses the grid automatically, otherwise 5 or more. */
    public columns: number;
    /** Whether the value is a GS1 element string whose GS characters are FNC1. */
    public isGs1: boolean;
    /** @private */
    public result: DotCodeEncodeResult;

    private textOptions: BaseAttributes;
    private textHeight: number = 0;
    private symbolX: number;
    private symbolY: number;
    private symbolWidth: number;
    private symbolHeight: number;
    private dotSpacing: number;

    private get scale(): number {
        // Canvas mode renders into a canvas 1.5 times the element size (see the component).
        return this.isSvgMode ? 1 : 1.5;
    }

    /**
     * Measures the display text, calculates the symbol area and encodes the value.
     *
     * @returns {DotCodeEncodeResult} encoding result; when success is false, error holds the reason.
     * @private
     */
    public build(): DotCodeEncodeResult {
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
        this.result = encodeDotCode({ value: this.value, columns: this.columns, isGs1: this.isGs1 });
        if (this.result.success) {
            this.calculateDotSpacing();
            // Dots are drawn 0.8 of the spacing wide; a smaller spacing makes them
            // sub-pixel and the symbol cannot be scanned reliably.
            if (!(this.dotSpacing >= MIN_DOT_SPACING)) {
                this.result = { success: false, error: 'InsufficientSize' };
            }
        }
        return this.result;
    }

    private calculateDotSpacing(): void {
        const result: DotCodeEncodeResult = this.result;
        // The quiet zone of three dot spacings on every side is part of the drawn symbol,
        // separately from the margin.
        this.dotSpacing = Math.min(
            this.symbolWidth / (result.columns + 2 * DOTCODE_QUIET_ZONE),
            this.symbolHeight / (result.rows + 2 * DOTCODE_QUIET_ZONE));
    }

    /**
     * Draws the encoded symbol and the display text.
     *
     * @returns {void}
     * @param {HTMLElement} canvas - root SVG or canvas element
     * @private
     */
    public draw(canvas: HTMLElement): void {
        const result: DotCodeEncodeResult = this.result;
        if (!result || !result.success) {
            return;
        }
        const quiet: number = DOTCODE_QUIET_ZONE;
        const spacing: number = this.dotSpacing;
        // The quiet zone is part of the fitted symbol. Any sub-pixel remainder stays
        // centered, so growing the control scales the dots instead of sliding them.
        const offsetX: number = this.symbolX + quiet * spacing +
            (this.symbolWidth - (result.columns + 2 * quiet) * spacing) / 2;
        const offsetY: number = this.symbolY + quiet * spacing +
            (this.symbolHeight - (result.rows + 2 * quiet) * spacing) / 2;
        if (this.isSvgMode) {
            this.drawDotsSvg(canvas, offsetX, offsetY, spacing);
        } else {
            this.drawDotsCanvas(canvas, offsetX, offsetY, spacing);
        }
        if (this.textOptions) {
            this.drawDisplayText(canvas, offsetX, result.columns * spacing, offsetY, result.rows * spacing);
        }
        // Release the matrix; it is rebuilt on the next render.
        this.result.matrix = undefined;
    }

    /**
     * Draws every dot of the symbol as circles merged into one SVG path, so even
     * large symbols create only a few elements.
     *
     * @returns {void}
     * @param {HTMLElement} svg - root SVG element
     * @param {number} offsetX - x of the first dot center's column, in pixels
     * @param {number} offsetY - y of the first dot center's row, in pixels
     * @param {number} spacing - distance between neighbouring dot centers
     * @private
     */
    private drawDotsSvg(svg: HTMLElement, offsetX: number, offsetY: number, spacing: number): void {
        const result: DotCodeEncodeResult = this.result;
        const radius: number = spacing * DOT_DIAMETER_RATIO / 2;
        let pathData: string = '';
        for (let row: number = 0; row < result.rows; row++) {
            const rowDots: number[] = result.matrix[parseInt(row.toString(), 10)];
            for (let column: number = 0; column < result.columns; column++) {
                if (rowDots[parseInt(column.toString(), 10)] !== 1) {
                    continue;
                }
                // Dot centers sit on the checkerboard: a dot at (row + column) odd
                // positions would overlap its neighbours.
                const cx: number = offsetX + column * spacing + spacing / 2;
                const cy: number = offsetY + row * spacing + spacing / 2;
                // A circle as four symmetric Bezier arcs.
                pathData += 'M' + (cx - radius) + ',' + cy +
                    'a' + radius + ',' + radius + ' 0 1,0 ' + (2 * radius) + ',0' +
                    'a' + radius + ',' + radius + ' 0 1,0 ' + (-2 * radius) + ',0z';
            }
        }
        const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', this.foreColor);
        svg.appendChild(path);
    }

    /**
     * Draws every dot of the symbol on the canvas context.
     *
     * @returns {void}
     * @param {HTMLElement} canvasElement - root canvas element
     * @param {number} offsetX - x of the first dot center's column, in pixels
     * @param {number} offsetY - y of the first dot center's row, in pixels
     * @param {number} spacing - distance between neighbouring dot centers
     * @private
     */
    private drawDotsCanvas(canvasElement: HTMLElement, offsetX: number, offsetY: number, spacing: number): void {
        const result: DotCodeEncodeResult = this.result;
        const canvas: HTMLCanvasElement = canvasElement as HTMLCanvasElement;
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        const radius: number = spacing * DOT_DIAMETER_RATIO / 2;
        context.fillStyle = this.foreColor;
        for (let row: number = 0; row < result.rows; row++) {
            const rowDots: number[] = result.matrix[parseInt(row.toString(), 10)];
            for (let column: number = 0; column < result.columns; column++) {
                if (rowDots[parseInt(column.toString(), 10)] !== 1) {
                    continue;
                }
                context.beginPath();
                context.arc(
                    offsetX + column * spacing + spacing / 2, offsetY + row * spacing + spacing / 2, radius,
                    0, 2 * Math.PI);
                context.fill();
            }
        }
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

    private drawDisplayText(canvas: HTMLElement, symbolLeft: number, symbolWidth: number,
                            symbolTop: number, symbolHeight: number): void {
        const renderer: BarcodeRenderer = this.getInstance(canvas.id);
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
     *
     * @returns {void}
     * @param {BaseAttributes} options - measured text options; string and width are updated in place
     * @param {number} maxWidth - available width in pixels
     * @private
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
