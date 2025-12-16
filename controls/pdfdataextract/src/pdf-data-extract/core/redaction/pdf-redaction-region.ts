import { PdfAppearance, PdfTemplate, Rectangle, PdfColor } from '@syncfusion/ej2-pdf';
/**
 * Represents the redaction process in a PDF document
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Add redactions to the collection
 * let redactions: PdfRedactionRegion[] = [];
 * // Initialize a new instance of the `PdfRedactor` class
 * let redactor: PdfRedactor = new PdfRedactor(document);
 * // Initialize a new instance of the `PdfRedactionRegion` class.
 * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
 * // Sets the fill color used to fill the redacted area.
 * redaction.fillColor = {r: 255, g: 0, b: 0};
 * redactions.push(redaction);
 * // Add redactions with specified options.
 * redactor.add(redactions);
 * // Apply redactions on the PDF document
 * redactor.redact();
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfRedactionRegion {
    _pageIndex: number;
    _appearance: PdfAppearance;
    _bounds: Rectangle;
    _isTextOnly: boolean = false;
    _fillColor: PdfColor;
    _appearanceEnabled: boolean = false;
    /*
     * Initialize a new instance of the `PdfRedactionRegion` class.
     *
     * @param {number} pageIndex The index of the page in the PDF document where redaction is to be applied.
     * @param {Rectangle} bounds The rectangular bounds that define areas to be redacted
     * @param {PdfColor} fillColor An array of numbers representing the RGB color used to fill the redacted area.
     * @param {Boolean} isTextOnly A boolean indicating whether only the text within the redaction bounds should be redacted.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90}, true, {r: 255, g: 0, b: 0});
     * redactions.push(redaction);
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redact();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(pageIndex: number, bounds: Rectangle, isTextOnly?: boolean, fillColor?: PdfColor) {
        this._pageIndex = pageIndex;
        this._bounds = bounds;
        if (typeof(isTextOnly) !== 'undefined') {
            this._isTextOnly = isTextOnly;
        }
        if (typeof(fillColor) !== 'undefined') {
            this._fillColor = fillColor;
        }
    }
    /**
     * Sets the page index of the PDF document where redaction is to be applied.
     *
     * @param {number} value The page index of the PDF document where redaction is to be applied.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Sets the page index of the PDF document where redaction is to be applied.
     * redaction.pageIndex = 1;
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redact();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set pageIndex(value: number) {
        this._pageIndex = value;
    }
    /**
     * Gets the page index of the PDF document where redaction is to be applied.
     *
     *  @returns {number} page index
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Gets the page index of the PDF document where redaction is to be applied.
     * let index: number = redaction.pageIndex;
     * redactions.push(redaction);
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redact();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get pageIndex(): number {
        return this._pageIndex;
    }
    /**
     * Sets the rectangular bounds that define areas to be redacted
     *
     * @param {number} value The rectangular bounds that define the areas to be redacted.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Sets the rectangular bounds that define areas to be redacted
     * redaction.bounds = {x: 40, y: 41.809, width: 80, height: 90};
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redact();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set bounds(value: Rectangle) {
        this._bounds = value;
    }
    /**
     * Gets the bounds of the redaction area.
     *
     * @returns {Rectangle} A Rectangle object representing the boundaries of the redaction.
     *
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Gets the bounds of the redaction area.
     * let bounds: Rectangle = redaction.bounds;
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redact();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bounds(): Rectangle{
        return this._bounds;
    }
    /**
     * Sets a value indicating whether only the text within the bounds should be redacted.
     * The default value is `false`.
     *
     * @param {boolean} value  A boolean flag indicating text only redaction.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Sets the fill color used to fill the redacted area.
     * redaction.isTextOnly = true;
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redact();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set isTextOnly(value: boolean) {
        this._isTextOnly = value;
    }
    /**
     * Gets a value indicating whether only the text should be redacted.
     *
     * @returns {boolean} value indicating if only text should be redacted.
     *
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Gets a value indicating whether only the text should be redacted.
     * let textOnly: boolean = redaction.isTextOnly;
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redact();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isTextOnly(): boolean {
        return this._isTextOnly;
    }
    /**
     * Sets the fill color used to fill the redacted area.
     *
     * @param {PdfColor} value An array of numbers representing the RGB color used to fill the redacted area.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Sets the fill color used to fill the redacted area.
     * redaction.fillColor = {r: 255, g: 0, b: 0};
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redact();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set fillColor(value: PdfColor) {
        this._fillColor = value;
    }
    /**
     * Gets the fill color used to fill the redacted area.
     *
     * @returns {PdfColor} value indicating array of numbers representing the RGB color values [R, G, B].
     *
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Gets a value indicating whether only the text should be redacted.
     * let fillColor: PdfColor = redaction.fillColor;
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redact();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fillColor(): PdfColor {
        return this._fillColor;
    }
    /**
     * Get the appearance of the pdf redaction
     *
     * @returns {PdfAppearance} Returns the appearance of the redaction.
     *
     * // Load an existing PDF document
     * let document: PdfDocument =  new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] =  [];
     * let region = { x: 40, y: 43.620000000000005, width: 80, height: 20};
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction = new PdfRedactionRegion(0, {x: 0, y: 0, width: 80, height: 20}, true);
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10);
     * redaction.appearance.normal.graphics.drawString('Redacted Text', font, {x: 0, y: 0, width: 80, height: 20}, new PdfBrush({r: 255, g: 0, b: 0}));
     * redactions.push(redaction);
     * redaction = new PdfRedactionRegion(0, {x: 0, y: 0, width: 80, height: 20}, true);
     * region = { x: 40, y: 43.620000000000005, width: 80, height: 20};
     * redactions.push(redaction);
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redact();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get appearance(): PdfAppearance {
        if (typeof(this._appearance) === 'undefined') {
            this._appearanceEnabled = true;
            this._appearance = new PdfAppearance(this.bounds);
            this._appearance.normal = new PdfTemplate({x: 0, y: 0, width: this._bounds.width, height: this._bounds.height});
        }
        return this._appearance;
    }
}
