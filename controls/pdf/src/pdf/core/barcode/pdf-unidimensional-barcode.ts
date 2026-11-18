import { PdfBrush, PdfGraphics, PdfGraphicsState } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { PdfFont, PdfStandardFont, PdfFontFamily } from '../fonts/pdf-standard-font';
import { PdfStringFormat } from '../fonts/pdf-string-format';
import { PdfBarcodeTextAlignment, PdfBarcodeTextLocation, PdfTextAlignment } from '../enumerator';
import { PdfColor, Point, Rectangle, PdfUnidimensionalBarcodeOptions, _UniPlan, _UniGeometry, _UniSettings } from '../pdf-document-helper';
import { PdfBarcode } from './pdf-barcode';
/**
 * Abstract base class that provides common bar-height and human-readable text behavior for one-dimensional barcodes.
 * It adds `narrowBarWidth`, `barHeight`, and the text font, color, gap, alignment and location settings on top of `PdfBarcode`.
 * Create one of the concrete classes (for example `PdfCode39Barcode`) to draw a barcode on a page or graphics.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export abstract class PdfUnidimensionalBarcode extends PdfBarcode {
    /**
     * Gets or sets the width, in points, of the narrowest bar. The default value is 1.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the narrowBarWidth.
     * barcode.narrowBarWidth = 1.5;
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default 1
     */
    public narrowBarWidth: number = 1;
    /**
     * Gets or sets the bar height in points. The default value is 0, which enables automatic height calculation.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the barHeight.
     * barcode.barHeight = 60;
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default 0 (automatic)
     */
    public barHeight: number = 0;
    /**
     * Gets or sets the human-readable barcode text color. The default value is black.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the textColor.
     * barcode.textColor = { r: 128, g: 0, b: 0 };
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default { r: 0, g: 0, b: 0 }
     */
    public textColor: PdfColor = { r: 0, g: 0, b: 0 };
    /**
     * Gets or sets the gap, in points, between the bars and human-readable text. The default value is 5.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the textGap.
     * barcode.textGap = 8;
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default 5
     */
    public textGap: number = 5;
    /**
     * Gets or sets whether applicable start and stop symbols are included in the displayed text. The default value is false.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the encodeStartStopSymbols.
     * barcode.encodeStartStopSymbols = true;
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default false
     */
    public encodeStartStopSymbols: boolean = false;
    /**
     * Gets or sets the font used for human-readable barcode text. The default value is the internal barcode text font.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the font.
     * barcode.font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default Helvetica 8 (PdfStandardFont)
     */
    public font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
    /**
     * Gets or sets the horizontal alignment of human-readable text. The default value is Center.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the textAlignment.
     * barcode.textAlignment = PdfBarcodeTextAlignment.Left;
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default PdfBarcodeTextAlignment.Center
     */
    public textAlignment: PdfBarcodeTextAlignment = PdfBarcodeTextAlignment.Center;
    /**
     * Gets or sets the location of human-readable text. The default value is Bottom.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode39Barcode = new PdfCode39Barcode('CODE39');
     * // Sets the textLocation.
     * barcode.textLocation = PdfBarcodeTextLocation.Top;
     * // Draws the barcode at the specified point.
     * barcode.draw(page, { x: 20, y: 20 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @default PdfBarcodeTextLocation.Bottom
     */
    public textLocation: PdfBarcodeTextLocation = PdfBarcodeTextLocation.Bottom;
    /**
     * Creates a unidimensional barcode.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfEan13Barcode = new PdfEan13Barcode('123456789012');
     * // Creates a barcode with custom options.
     * let custom: PdfEan13Barcode = new PdfEan13Barcode('123456789012', {
     *     foreColor: { r: 0, g: 0, b: 128 },
     *     backColor: { r: 255, g: 255, b: 255 },
     *     quietZone: { all: 5 },
     *     narrowBarWidth: 1.5,
     *     barHeight: 60,
     *     textGap: 4,
     *     textAlignment: PdfBarcodeTextAlignment.Center,
     *     textLocation: PdfBarcodeTextLocation.Bottom
     * });
     * // Draws the barcode at the specified point.
     * custom.draw(page, { x: 20, y: 20 });
     * // Draws the barcode at specified bounds.
     * barcode.draw(page, { x: 20, y: 20, width: 100, height: 100 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     * @param {string} text The barcode payload.
     * @param {PdfUnidimensionalBarcodeOptions} options Optional settings.
     */
    protected constructor(text: string, options?: PdfUnidimensionalBarcodeOptions) {
        super(text, options);
        if (options) {
            if (options.narrowBarWidth !== undefined) {
                this.narrowBarWidth = options.narrowBarWidth;
            }
            if (options.barHeight !== undefined) {
                this.barHeight = options.barHeight;
            }
            if (options.textColor) {
                this.textColor = this._copyColor(options.textColor);
            }
            if (options.textGap !== undefined) {
                this.textGap = options.textGap;
            }
            if (options.encodeStartStopSymbols !== undefined) {
                this.encodeStartStopSymbols = options.encodeStartStopSymbols;
            }
            if (options.font) {
                this.font = options.font;
            }
            if (options.textAlignment !== undefined) {
                this.textAlignment = options.textAlignment;
            }
            if (options.textLocation !== undefined) {
                this.textLocation = options.textLocation;
            }
        }
    }
    /**
     * Builds the plan and geometry, then paints. Nothing is painted when any earlier phase fails.
     *
     * @param {PdfPage | PdfGraphics} target The page or graphics context.
     * @param {Point | Rectangle} locationOrBounds The drawing point or bounds. A point selects the natural size.
     * @param {Function} buildPlan Produces the immutable logical plan from the validated state.
     * @returns {Rectangle} The occupied rectangle.
     * @private
     */
    protected _drawPlan(target: PdfPage | PdfGraphics, locationOrBounds: Point | Rectangle, buildPlan: () => _UniPlan): Rectangle {
        if (!(target instanceof PdfPage) && !(target instanceof PdfGraphics)) {
            throw new Error('draw target must be a PdfPage or PdfGraphics');
        }
        const area: Rectangle = this._readBounds(locationOrBounds);
        const settings: _UniSettings = this._snapshotSettings();
        const plan: _UniPlan = buildPlan();
        const geometry: _UniGeometry = this._planGeometry(plan, area, settings);
        const graphics: PdfGraphics = target instanceof PdfPage ? target.graphics : target;
        const state: PdfGraphicsState = graphics.save();
        try {
            graphics.drawRectangle(geometry.occupied, new PdfBrush(settings.backColor));
            const bar: PdfBrush = new PdfBrush(settings.foreColor);
            for (let i: number = 0; i < geometry.bars.length; i++) {
                graphics.drawRectangle(geometry.bars[<number>i], bar);
            }
            if (geometry.text) {
                const format: PdfStringFormat = new PdfStringFormat(settings.alignment);
                graphics.drawString(geometry.text.value, settings.font, geometry.text.bounds,
                                    new PdfBrush(settings.textColor), format);
            }
        } finally {
            graphics.restore(state);
        }
        const o: Rectangle = geometry.occupied;
        return { x: o.x, y: o.y, width: o.width, height: o.height };
    }
    /**
     * Returns true when the value is a point (no width or height).
     *
     * @param {Point | Rectangle} value The point or bounds.
     * @returns {boolean} True for a point.
     * @private
     */
    private _isPoint(value: Point | Rectangle): boolean {
        return !!value && typeof value === 'object' && (<Rectangle>value).width === undefined && (<Rectangle>value).height === undefined;
    }
    /**
     * Validates a point or bounds and returns the bounds; a point selects the natural size.
     *
     * @param {Point | Rectangle} input The point or bounds.
     * @returns {Rectangle} The validated bounds.
     * @private
     */
    private _readBounds(input: Point | Rectangle): Rectangle {
        const bounds: Rectangle = this._isPoint(input) ? { x: input.x, y: input.y, width: 0, height: 0 } : <Rectangle>input;
        if (!bounds || typeof bounds !== 'object') {
            throw new Error('bounds are required');
        }
        const x: number = bounds.x;
        const y: number = bounds.y;
        const w: number = bounds.width;
        const h: number = bounds.height;
        if (!this._finite(x) || !this._finite(y) || !this._finite(w) ||
            !this._finite(h) || w < 0 || h < 0) {
            throw new Error('bounds must have finite coordinates and non-negative width and height');
        }
        if ((w === 0) !== (h === 0)) {
            throw new Error('bounds width and height must both be zero (natural size) or both be positive');
        }
        return { x: x, y: y, width: w, height: h };
    }
    /**
     * Validates the current settings and returns an immutable snapshot.
     *
     * @returns {_UniSettings} The settings snapshot.
     * @private
     */
    private _snapshotSettings(): _UniSettings {
        const zone: { all?: number, left?: number, right?: number, top?: number, bottom?: number } = this.quietZone || {};
        if (zone.all !== undefined && (!this._finite(zone.all) || zone.all < 0)) {
            throw new Error('quietZone.all must be a finite number greater than or equal to 0');
        }
        const side: (name: 'left' | 'right' | 'top' | 'bottom') => number = (name: 'left' | 'right' | 'top' | 'bottom'): number => {
            const sideValue: number = name === 'left' ? zone.left : name === 'right' ? zone.right : name === 'top' ? zone.top : zone.bottom;
            const v: number = sideValue !== undefined ? sideValue : zone.all !== undefined ? zone.all : 0;
            if (!this._finite(v) || v < 0) {
                throw new Error('quietZone.' + name + ' must be a finite number greater than or equal to 0');
            }
            return v;
        };
        const narrow: number = this.narrowBarWidth;
        if (!this._finite(narrow) || narrow <= 0) {
            throw new Error('narrowBarWidth must be a finite number greater than 0');
        }
        if (!this._finite(this.barHeight) || this.barHeight < 0) {
            throw new Error('barHeight must be a finite number greater than or equal to 0');
        }
        if (!this._finite(this.textGap) || this.textGap < 0) {
            throw new Error('textGap must be a finite number greater than or equal to 0');
        }
        if (this.textLocation !== PdfBarcodeTextLocation.Bottom && this.textLocation !== PdfBarcodeTextLocation.Top &&
            this.textLocation !== PdfBarcodeTextLocation.None) {
            throw new Error('textLocation is not a valid PdfBarcodeTextLocation');
        }
        let alignment: PdfTextAlignment;
        if (this.textAlignment === PdfBarcodeTextAlignment.Left) {
            alignment = PdfTextAlignment.left;
        } else if (this.textAlignment === PdfBarcodeTextAlignment.Right) {
            alignment = PdfTextAlignment.right;
        } else if (this.textAlignment === PdfBarcodeTextAlignment.Center) {
            alignment = PdfTextAlignment.center;
        } else {
            throw new Error('textAlignment is not a valid PdfBarcodeTextAlignment');
        }
        const fore: PdfColor = this._checkColor(this.foreColor, 'foreColor');
        const back: PdfColor = this._checkColor(this.backColor, 'backColor');
        const textColor: PdfColor = this._checkColor(this.textColor, 'textColor');
        if (this.textLocation !== PdfBarcodeTextLocation.None && !this.font) {
            throw new Error('font is required when text is displayed');
        }
        return {
            narrow: narrow, barHeight: this.barHeight, gap: this.textGap, location: this.textLocation, alignment: alignment,
            left: side('left'), right: side('right'), top: side('top'), bottom: side('bottom'),
            foreColor: fore, backColor: back, textColor: textColor, font: this.font
        };
    }
    /**
     * Internal member _defaultAutoBarHeight.
     *
     * @private
     */
    private readonly _defaultAutoBarHeight: number = 80;
    /**
     * Returns true for a finite number.
     *
     * @param {number} value The value.
     * @returns {boolean} True when finite.
     * @private
     */
    private _finite(value: number): boolean {
        return typeof value === 'number' && isFinite(value);
    }
    /**
     * Validates and copies a color.
     *
     * @param {PdfColor} color The color.
     * @param {string} name The property name for errors.
     * @returns {PdfColor} The copy.
     * @private
     */
    private _checkColor(color: PdfColor, name: string): PdfColor {
        if (!color || !this._finite(color.r) || !this._finite(color.g) ||
            !this._finite(color.b)) {
            throw new Error(name + ' must be a color with finite r, g and b components');
        }
        return this._copyColor(color);
    }
    /**
     * Plans the bar, text and occupied rectangles without painting.
     *
     * @param {_UniPlan} plan The logical plan.
     * @param {Rectangle} area The validated bounds.
     * @param {_UniSettings} s The settings snapshot.
     * @returns {_UniGeometry} The geometry.
     * @private
     */
    private _planGeometry(plan: _UniPlan, area: Rectangle, s: _UniSettings): _UniGeometry {
        const natural: boolean = area.width === 0;
        const showText: boolean = s.location !== PdfBarcodeTextLocation.None;
        let textWidth: number = 0;
        let textHeight: number = 0;
        if (showText) {
            const size: { width: number, height: number } = s.font.measureString(plan.displayText);
            textWidth = size.width;
            textHeight = size.height;
            if (!this._finite(textWidth) || !this._finite(textHeight) || textWidth < 0 ||
                textHeight <= 0) {
                throw new Error('human-readable text could not be measured');
            }
        }
        const textBlock: number = showText ? textHeight + s.gap : 0;
        let moduleWidth: number;
        let contentWidth: number;
        let barsWidth: number;
        let barHeight: number;
        let width: number;
        let height: number;
        if (natural) {
            moduleWidth = s.narrow;
            barsWidth = plan.moduleCount * moduleWidth;
            contentWidth = Math.max(barsWidth, textWidth);
            width = s.left + contentWidth + s.right;
            barHeight = s.barHeight > 0 ? s.barHeight : this._defaultAutoBarHeight;
            height = s.top + barHeight + textBlock + s.bottom;
        } else {
            width = area.width;
            height = area.height;
            contentWidth = width - s.left - s.right;
            if (contentWidth <= 0) {
                throw new Error('bounds width is insufficient for the quiet zones');
            }
            moduleWidth = contentWidth / plan.moduleCount;
            barsWidth = contentWidth;
            barHeight = height - s.top - s.bottom - textBlock;
            if (barHeight <= 0) {
                throw new Error('bounds height is insufficient for the quiet zones, text and bars');
            }
        }
        if (!this._finite(width) || !this._finite(height) ||
            !this._finite(moduleWidth) || moduleWidth <= 0 || !this._finite(barHeight) ||
            barHeight <= 0) {
            throw new Error('barcode geometry is not valid');
        }
        // In natural mode the bars are centred when the text is wider than the symbol.
        const left: number = area.x + s.left + (natural ? (contentWidth - barsWidth) / 2 : 0);
        const textLeft: number = area.x + s.left;
        const barTop: number = area.y + s.top + (s.location === PdfBarcodeTextLocation.Top ? textBlock : 0);
        const edge: (k: number) => number = (k: number): number => left + (k === plan.moduleCount ? barsWidth : k * moduleWidth);
        const bars: Rectangle[] = [];
        let cursor: number = 0;
        for (let i: number = 0; i < plan.runs.length; i++) {
            const next: number = cursor + plan.runs[<number>i];
            if (i % 2 === 0) {
                const x0: number = edge(cursor);
                const w: number = edge(next) - x0;
                if (!(w > 0)) {
                    throw new Error('barcode geometry produced a bar without positive width');
                }
                bars.push({ x: x0, y: barTop, width: w, height: barHeight });
            }
            cursor = next;
        }
        let text: { value: string, bounds: Rectangle } = null;
        if (showText) {
            const textY: number = s.location === PdfBarcodeTextLocation.Top ? area.y + s.top : barTop + barHeight + s.gap;
            text = { value: plan.displayText, bounds: { x: textLeft, y: textY, width: contentWidth, height: textHeight } };
        }
        return {
            occupied: { x: area.x, y: area.y, width: width, height: height },
            bars: bars, text: text, moduleWidth: moduleWidth
        };
    }
}
