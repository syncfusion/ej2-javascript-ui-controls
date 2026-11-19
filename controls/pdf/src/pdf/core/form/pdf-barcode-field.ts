import { _PdfDictionary, _PdfName, _PdfReference } from './../pdf-primitives';
import { _PdfCrossReference } from './../pdf-cross-reference';
import { PdfPage } from './../pdf-page';
import { PdfButtonField, PdfCheckBoxField, PdfComboBoxField, PdfField, PdfListBoxField, PdfRadioButtonListField, PdfTextBoxField } from './field';
import { PdfForm } from './form';
import { PdfBarcodeFieldItem } from './pdf-barcode-field-item';
import { PdfRadioButtonListItem, PdfWidgetAnnotation } from './../annotations/annotation';
import { PdfAnnotationFlag, PdfBarcodeSymbology, PdfBarcodeValueFormat, Pdf417ErrorCorrectionLevel, PdfQRErrorCorrectionLevel, _FieldFlag, PdfQRInputMode, PdfBarcodeTextEncoding } from './../enumerator';
import { PdfBarcodeOptions, PdfQRBarcodeOptions, PdfDataMatrixBarcodeOptions, Rectangle, _QrEncodeResult } from './../pdf-document-helper';
import { PdfTemplate } from './../graphics/pdf-template';
import { PdfBrush, PdfGraphics, PdfGraphicsState } from './../graphics/pdf-graphics';
import { PdfFontFamily, PdfStandardFont } from './../fonts/pdf-standard-font';
import { Pdf417Barcode } from './../barcode/pdf417-barcode';
import { PdfQRBarcode } from './../barcode/qr-barcode';
import { PdfDataMatrixBarcode } from './../barcode/data-matrix-barcode';
import { _PdfBaseStream, _PdfContentStream } from './../base-stream';
import { PdfStringFormat } from '../fonts/pdf-string-format';
import { _compressBarcodeData } from './../utils';
const _barcodeFlags: number = _FieldFlag.readOnly | _FieldFlag.noExport | _FieldFlag.multiLine | _FieldFlag.doNotSpellCheck;
const _defaultXdimension: number = 4;
const _captionHeight: number = 10;
/**
 * Represents a barcode form field. The value of the field is rendered as a PDF417, QR Code or Data Matrix barcode.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a new page
 * let page: PdfPage = document.addPage();
 * // Create a new barcode field that encodes the value of the 'name' field
 * let field: PdfBarcodeField = new PdfBarcodeField(page, 'barcode', {x: 10, y: 10, width: 200, height: 80}, {
 *     fields: ['name'],
 *     caption: 'Scan me'
 * });
 * // Add the field to the form
 * document.form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
/**
 * Private action-dictionary key that marks a calculation script as a user-supplied custom script.
 * Its value is a checksum of the script, so the marker is ignored if the script is edited elsewhere.
 *
 * @private
 */
const _customScriptMarker: string = 'SfCustomScript';
export class PdfBarcodeField extends PdfField {
    /**
     * Creates an empty barcode field instance. Intended for internal loading only.
     *
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfBarcodeField` class with the default PDF417 barcode.
     *
     * @param {PdfPage} page PDF page where the barcode field is added.
     * @param {string} name Name of the barcode field.
     * @param {Rectangle} bounds Bounds of the barcode field.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200});
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(page: PdfPage, name: string, bounds: Rectangle)
    /**
     * Initializes a new instance of the `PdfBarcodeField` class with the specified barcode settings.
     *
     * @param {PdfPage} page PDF page where the barcode field is added.
     * @param {string} name Name of the barcode field.
     * @param {Rectangle} bounds Bounds of the barcode field.
     * @param {Object} properties Optional barcode field settings.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     caption: 'Employee',
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
        barcodeOptions?: PdfBarcodeOptions,
        valueFormat?: PdfBarcodeValueFormat,
        includeFieldNames?: boolean,
        fields?: string[],
        caption?: string,
        compressData?: boolean,
        customCalculationScript?: string
    })
    public constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
        barcodeOptions?: PdfBarcodeOptions,
        valueFormat?: PdfBarcodeValueFormat,
        includeFieldNames?: boolean,
        fields?: string[],
        caption?: string,
        compressData?: boolean,
        customCalculationScript?: string
    }) {
        super();
        if (page && name && bounds) {
            this._initialize(page, name, bounds);
            if (properties) {
                if (properties.barcodeOptions !== undefined) {
                    this.barcodeOptions = properties.barcodeOptions;
                }
                if (properties.caption !== undefined) {
                    this.caption = properties.caption;
                }
                if (properties.compressData !== undefined) {
                    this.compressData = properties.compressData;
                }
                if (properties.includeFieldNames !== undefined) {
                    this._includeFieldNames = properties.includeFieldNames;
                }
                if (properties.valueFormat !== undefined) {
                    this._valueFormat = properties.valueFormat;
                }
                if (properties.customCalculationScript !== undefined) {
                    this._customScript = properties.customCalculationScript;
                }
                if (properties.fields !== undefined) {
                    this._fieldNames = properties.fields;
                }
                this._updateScript();
            }
        }
    }
    /**
     * Loads an existing barcode field.
     *
     * @private
     * @param {PdfForm} form Form object.
     * @param {_PdfDictionary} dictionary Field dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference object.
     * @param {_PdfReference} reference Field reference.
     * @returns {PdfBarcodeField} Barcode field.
     */
    static _load(form: PdfForm,
                 dictionary: _PdfDictionary,
                 crossReference: _PdfCrossReference,
                 reference: _PdfReference): PdfBarcodeField {
        const field: PdfBarcodeField = new PdfBarcodeField();
        field._isLoaded = true;
        field._form = form;
        field._dictionary = dictionary;
        field._crossReference = crossReference;
        field._ref = reference;
        if (field._dictionary.has('Kids')) {
            field._kids = field._dictionary.get('Kids');
        }
        field._defaultIndex = 0;
        field._parsedItems = new Map<number, PdfWidgetAnnotation>();
        field._parseScript();
        return field;
    }
    /**
     * Gets the options used to generate the barcode appearance.
     *
     * @returns {PdfBarcodeOptions} Barcode generation options
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Get the barcode options
     * let options: PdfBarcodeOptions = barcode.barcodeOptions;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get barcodeOptions(): PdfBarcodeOptions {
        const pmd: _PdfDictionary = this._findPmd();
        const options: PdfBarcodeOptions = {symbology: PdfBarcodeSymbology.PDF417, xDimention: _defaultXdimension};
        if (pmd) {
            const symbology: PdfBarcodeSymbology = this._readSymbology(pmd);
            options.symbology = symbology;
            const width: number = pmd.get('XSymWidth');
            if (typeof width === 'number') {
                options.xDimention = width;
            }
            const ecc: number = pmd.get('ECC');
            if (typeof ecc === 'number') {
                if (symbology === PdfBarcodeSymbology.PDF417 && ecc >= 0 && ecc <= 8) {
                    options.errorCorrectionLevel = (ecc + 1) as Pdf417ErrorCorrectionLevel;
                } else if (symbology === PdfBarcodeSymbology.QR) {
                    const valid: boolean = ecc >= 0 && ecc <= 3;
                    options.errorCorrectionLevel = (valid ? ecc : PdfQRErrorCorrectionLevel.Medium) as PdfQRErrorCorrectionLevel;
                }
            } else if (symbology === PdfBarcodeSymbology.QR) {
                options.errorCorrectionLevel = PdfQRErrorCorrectionLevel.Medium;
            }
        } else {
            options.errorCorrectionLevel = Pdf417ErrorCorrectionLevel.Level5;
        }
        return options;
    }
    /**
     * Sets the options used to generate the barcode appearance.
     *
     * @param {PdfBarcodeOptions} value Barcode generation options
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId']
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Set the barcode options
     * barcode.barcodeOptions = {symbology: PdfBarcodeSymbology.QR, xDimention: 4, errorCorrectionLevel: PdfQRErrorCorrectionLevel.Medium};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set barcodeOptions(value: PdfBarcodeOptions) {
        if (value === null || typeof value === 'undefined') {
            throw new Error('barcodeOptions cannot be null or undefined.');
        }
        const symbology: PdfBarcodeSymbology =
            value.symbology === null ||
            typeof value.symbology === 'undefined'
                ? PdfBarcodeSymbology.PDF417
                : value.symbology;
        if (symbology !== PdfBarcodeSymbology.PDF417 &&
            symbology !== PdfBarcodeSymbology.QR &&
            symbology !== PdfBarcodeSymbology.DataMatrix) {
            throw new RangeError('Unsupported barcode symbology.');
        }
        let xDimension: number =
            typeof value.xDimention === 'number' &&
            value.xDimention > 1
                ? value.xDimention
                : _defaultXdimension;
        let ecc: number;
        if (symbology === PdfBarcodeSymbology.PDF417) {
            xDimension = Math.max(1, Math.round(xDimension));
            const level: number = typeof value.errorCorrectionLevel === 'number' ?
                value.errorCorrectionLevel : Pdf417ErrorCorrectionLevel.Level5;
            ecc = level === Pdf417ErrorCorrectionLevel.Auto ? 5 : Math.min(8, Math.max(0, level - 1));
        } else if (symbology === PdfBarcodeSymbology.QR) {
            xDimension = Math.max(2, Math.round(xDimension));
            ecc = typeof value.errorCorrectionLevel === 'number' && value.errorCorrectionLevel >= 0 &&
                value.errorCorrectionLevel <= 3 ? value.errorCorrectionLevel : PdfQRErrorCorrectionLevel.Medium;
        } else {
            xDimension = Math.max(2, Math.round(xDimension));
        }
        this._forEachWidget((dictionary: _PdfDictionary) => {
            const pmd: _PdfDictionary = this._ensurePmd(dictionary);
            pmd.update('Symbology', _PdfName.get(['PDF417', 'QRCode', 'DataMatrix'][<number>symbology]));
            pmd.update('XSymWidth', xDimension);
            this._removeKey(pmd, 'XSymHeight');
            this._removeKey(pmd, 'nCodeWordCol');
            this._removeKey(pmd, 'nCodeWordRow');
            this._removeKey(pmd, 'ECC');
            if (symbology === PdfBarcodeSymbology.PDF417) {
                pmd.update('XSymHeight', xDimension * 2);
                pmd.update('nCodeWordCol', 0);
                pmd.update('nCodeWordRow', 0);
            }
            if (typeof ecc === 'number') {
                pmd.update('ECC', ecc);
            }
        });
    }
    /**
     * Gets the caption drawn at the bottom of the barcode.
     *
     * @returns {string} Caption of the barcode field
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     caption: 'Employee'
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Get the caption
     * let caption: string = barcode.caption;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get caption(): string {
        const pmd: _PdfDictionary = this._findPmd();
        const value: string = pmd ? pmd.get('Caption') : undefined;
        return typeof value === 'string' ? value : '';
    }
    /**
     * Sets the caption drawn at the bottom of the barcode.
     *
     * @param {string} value Caption of the barcode field
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId']
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Set the caption
     * barcode.caption = 'Employee Barcode';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set caption(value: string) {
        const caption: string = value === null || typeof value === 'undefined' ? '' : value;
        this._forEachWidget((dictionary: _PdfDictionary) => {
            const pmd: _PdfDictionary = this._ensurePmd(dictionary);
            if (caption.length > 0) {
                pmd.update('Caption', caption);
            } else {
                this._removeKey(pmd, 'Caption');
            }
        });
        this._refreshScriptIfFormatted();
    }
    /**
     * Gets whether the barcode data is compressed.
     *
     * @returns {boolean} `true` if the data is compressed; otherwise, `false`
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Get whether the data is compressed
     * let isCompressed: boolean = barcode.compressData;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get compressData(): boolean {
        let value: number = this._dictionary.get('DataPrep');
        if (typeof value !== 'number') {
            const pmd: _PdfDictionary = this._findPmd();
            value = pmd ? pmd.get('DataPrep') : undefined;
        }
        return value === 1;
    }
    /**
     * Sets whether the barcode data is compressed.
     *
     * @param {boolean} value `true` to compress the data; otherwise, `false`
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId']
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Enable data compression
     * barcode.compressData = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set compressData(value: boolean) {
        this._dictionary.update('DataPrep', value ? 1 : 0);
        this._dictionary._updated = true;
    }
    /**
     * Gets the barcode payload text built from the values of the referenced fields.
     *
     * @returns {string} Barcode payload text
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Get the barcode payload text
     * let payload: string = barcode.text;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get text(): string {
        if (typeof this._text !== 'undefined' && this._text !== null && this._text.length > 0) {
            return this._text;
        }
        if (this._isLoaded && this._valueFormat === PdfBarcodeValueFormat.CustomScript) {
            let cachedValue: string = this._dictionary.get('V');
            if ((typeof cachedValue !== 'string' || cachedValue.length === 0 || cachedValue === ' ') &&
                this.itemsCount > 0) {
                const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
                if (widget && widget._dictionary && widget._dictionary.has('V')) {
                    cachedValue = widget._dictionary.get('V');
                }
            }
            if (typeof cachedValue === 'string' && cachedValue.length > 0 && cachedValue !== ' ') {
                this._text = cachedValue;
                return cachedValue;
            }
        }
        const encoded: string = this._encodeValue();
        if (encoded.length > 0) {
            return encoded;
        }
        const value: string = this._dictionary.get('V');
        return typeof value === 'string' ? value : '';
    }
    /**
     * Gets the format used to combine the referenced field values.
     *
     * @returns {PdfBarcodeValueFormat} Value format of the barcode
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Get the value format
     * let format: PdfBarcodeValueFormat = barcode.valueFormat;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get valueFormat(): PdfBarcodeValueFormat {
        return this._valueFormat;
    }
    /**
     * Sets the format used to combine the referenced field values.
     *
     * @param {PdfBarcodeValueFormat} value Value format of the barcode
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Set the value format
     * barcode.valueFormat = PdfBarcodeValueFormat.XML;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set valueFormat(value: PdfBarcodeValueFormat) {
        if (this._valueFormat === PdfBarcodeValueFormat.CustomScript && value !== PdfBarcodeValueFormat.CustomScript) {
            this._customScript = '';
        }
        this._valueFormat = value;
        this._updateScript();
    }
    /**
     * Gets the custom JavaScript calculation script, applied when the value format is `customScript`.
     *
     * @returns {string} Custom calculation script
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Get the custom calculation script
     * let script: string = barcode.customCalculationScript;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get customCalculationScript(): string {
        return this._customScript;
    }
    /**
     * Sets the custom JavaScript calculation script, applied when the value format is `customScript`.
     *
     * @param {string} value Custom calculation script
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Set the custom calculation script
     * barcode.valueFormat = PdfBarcodeValueFormat.CustomScript;
     * barcode.customCalculationScript = "event.value = this.getField('EmployeeId').value;";
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set customCalculationScript(value: string) {
        this._customScript = value === null || typeof value === 'undefined' ? '' : value;
        this._updateScript();
    }
    /**
     * Gets whether field names are included in the tab delimited barcode payload.
     *
     * @returns {boolean} `true` if the names are included; otherwise, `false`
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Get whether field names are included
     * let includeNames: boolean = barcode.includeFieldNames;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get includeFieldNames(): boolean {
        return this._includeFieldNames;
    }
    /**
     * Sets whether field names are included in the tab delimited barcode payload.
     *
     * @param {boolean} value `true` to include the names; otherwise, `false`
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Include field names in the payload
     * barcode.includeFieldNames = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set includeFieldNames(value: boolean) {
        this._includeFieldNames = value;
        this._updateScript();
    }
    /**
     * Gets the names of the form fields whose values are encoded in the barcode.
     *
     * @returns {string[]} Names of the referenced fields
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Get the referenced field names
     * let fieldNames: string[] = barcode.fields;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fields(): string[] {
        return this._fieldNames.slice();
    }
    /**
     * Sets the names of the form fields whose values are encoded in the barcode.
     *
     * @param {string[]} value Names of the referenced fields
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Set the referenced field names
     * barcode.fields = ['EmployeeId'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set fields(value: string[]) {
        this._fieldNames = value ? value.slice() : [];
        this._updateScript();
    }
    /**
     * Gets the resolution in dots per inch.
     *
     * @private
     * @returns {number} The resolution.
     */
    get _resolution(): number {
        const pmd: _PdfDictionary = this._findPmd();
        const value: number = pmd ? pmd.get('Resolution') : undefined;
        return typeof value === 'number' ? value : 300;
    }
    /**
     * Sets the resolution in dots per inch.
     *
     * @private
     * @param {number} value The resolution.
     */
    set _resolution(value: number) {
        this._forEachWidget((dictionary: _PdfDictionary) => {
            this._ensurePmd(dictionary).update('Resolution', value);
        });
    }
    /**
     * Gets the number of widget items associated with the barcode field.
     *
     * @returns {number} Number of widget items
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Get the number of items
     * let count: number = barcode.itemsCount;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get itemsCount(): number {
        return this._kidsCount > 0 ? this._kidsCount : ((this._isLoaded || this._parsedItems.has(0)) ? 1 : 0);
    }
    /**
     * Returns the barcode field item at the specified index, or `undefined` when the index is out of range.
     *
     * @param {number} index Index of the barcode field item.
     * @returns {PdfBarcodeFieldItem} Barcode field item at the specified index
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'EmployeeId', {x: 10, y: 10, width: 120, height: 20});
     * // Set the text box value
     * textBox.text = 'EMP-1001';
     * // Add the text box field to the form
     * document.form.add(textBox);
     * // Create a barcode field
     * let barcode: PdfBarcodeField = new PdfBarcodeField(page, 'EmployeeBarcode', {x: 10, y: 50, width: 200, height: 200}, {
     *     fields: ['EmployeeId'],
     *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
     * });
     * // Add the barcode field to the form
     * document.form.add(barcode);
     * // Get the first barcode field item
     * let item: PdfBarcodeFieldItem = barcode.itemAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public itemAt(index: number): PdfBarcodeFieldItem {
        let item: PdfBarcodeFieldItem;
        if (typeof index !== 'number' || index < 0) {
            return item;
        }
        if (this._kidsCount === 0) {
            if ((this._isLoaded || this._parsedItems.has(0)) && index === 0) {
                const cached: PdfWidgetAnnotation = this._parsedItems.get(0);
                if (cached instanceof PdfBarcodeFieldItem) {
                    item = cached;
                } else {
                    item = PdfBarcodeFieldItem._load(this._dictionary, this._crossReference, this);
                    item._ref = this._ref;
                    item._index = 0;
                    this._parsedItems.set(0, item);
                }
            }
            return item;
        }
        if (index < this._kidsCount) {
            const cached: PdfWidgetAnnotation = this._parsedItems.get(index);
            if (cached instanceof PdfBarcodeFieldItem) {
                item = cached;
            } else {
                const reference: _PdfReference = this._kids[<number>index];
                const dictionary: _PdfDictionary = reference instanceof _PdfReference ?
                    this._crossReference._fetch(reference) : undefined;
                if (dictionary instanceof _PdfDictionary) {
                    item = PdfBarcodeFieldItem._load(dictionary, this._crossReference, this);
                    item._ref = reference;
                    item._index = index;
                    this._parsedItems.set(index, item);
                }
            }
        }
        return item;
    }
    _valueFormat: PdfBarcodeValueFormat = PdfBarcodeValueFormat.TabDelimited;
    _includeFieldNames: boolean = false;
    _customScript: string = '';
    _text: string;
    _fieldNames: string[] = [];
    /**
     * Initializes a new barcode field with the default PDF417 settings.
     *
     * @private
     * @param {PdfPage} page The page.
     * @param {string} name The field name.
     * @param {Rectangle} bounds The bounds.
     * @returns {void} Nothing.
     */
    _initialize(page: PdfPage, name: string, bounds: Rectangle): void {
        this._crossReference = page._crossReference;
        this._page = page;
        this._name = name;
        this._defaultIndex = 0;
        this._dictionary = new _PdfDictionary(this._crossReference);
        this._ref = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(this._ref, this._dictionary);
        this._dictionary.objId = this._ref.toString();
        this._dictionary.update('FT', _PdfName.get('Tx'));
        this._dictionary.update('T', name);
        this._dictionary.update('DataPrep', 0);
        this._fieldFlags = _barcodeFlags as number as _FieldFlag;
        // Single widget: merge field and widget into one dictionary, as Acrobat does.
        const item: PdfBarcodeFieldItem = new PdfBarcodeFieldItem();
        item._page = page;
        item._crossReference = this._crossReference;
        item._ref = this._ref;
        item._dictionary = this._dictionary;
        item._dictionary._currentObj = item;
        item._field = this;
        item._index = 0;
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Widget'));
        item.flags |= PdfAnnotationFlag.print;
        this._dictionary.update('P', page._ref);
        page._addWidget(this._ref);
        item.bounds = bounds;
        item._applyDefaults();
        this._parsedItems = new Map<number, PdfWidgetAnnotation>();
        this._parsedItems.set(0, item);
        this.barcodeOptions = {
            symbology: PdfBarcodeSymbology.PDF417,
            xDimention: _defaultXdimension,
            errorCorrectionLevel: Pdf417ErrorCorrectionLevel.Level5
        };
        this._resolution = 300;
        this._updateScript();
    }
    /**
     * Gets the dictionaries of all widgets. For a merged field the field dictionary itself is returned.
     *
     * @private
     * @returns {_PdfDictionary[]} The widget dictionaries.
     */
    _widgetDictionaries(): _PdfDictionary[] {
        const result: _PdfDictionary[] = [];
        if (this._kidsCount > 0) {
            for (let i: number = 0; i < this._kidsCount; i++) {
                const item: PdfBarcodeFieldItem = this.itemAt(i);
                if (item) {
                    result.push(item._dictionary);
                }
            }
        } else {
            result.push(this._dictionary);
        }
        return result;
    }
    _forEachWidget(callback: (dictionary: _PdfDictionary, index: number) => void): void {
        this._widgetDictionaries().forEach(callback);
    }
    /**
     * Finds the first PMD dictionary on the field or its widgets.
     *
     * @private
     * @returns {_PdfDictionary} The PMD dictionary or `undefined`.
     */
    _findPmd(): _PdfDictionary {
        const dictionaries: _PdfDictionary[] = [this._dictionary].concat(this._widgetDictionaries());
        for (let i: number = 0; i < dictionaries.length; i++) {
            if (dictionaries[<number>i].has('PMD')) {
                const pmd: _PdfDictionary = dictionaries[<number>i].get('PMD');
                if (pmd instanceof _PdfDictionary) {
                    return pmd;
                }
            }
        }
        return undefined;
    }
    _ensurePmd(dictionary: _PdfDictionary): _PdfDictionary {
        let pmd: _PdfDictionary = dictionary.has('PMD') ? dictionary.get('PMD') : undefined;
        if (!(pmd instanceof _PdfDictionary)) {
            pmd = new _PdfDictionary(this._crossReference);
            pmd.update('Type', _PdfName.get('PaperMetaData'));
            pmd.update('Version', 1);
            const existing: _PdfDictionary = this._findPmd();
            if (existing) {
                existing.forEach((key: string, value: any) => { // eslint-disable-line
                    if (key !== 'Type' && key !== 'Version' && key !== 'Width' && key !== 'Height') {
                        pmd.update(key, value);
                    }
                });
            }
            dictionary.update('PMD', pmd);
        }
        dictionary._updated = true;
        pmd._updated = true;
        return pmd;
    }
    _removeKey(dictionary: _PdfDictionary, key: string): void {
        if (dictionary.has(key)) {
            delete dictionary._map[<string>key];
            dictionary._updated = true;
        }
    }
    _readSymbology(pmd: _PdfDictionary): PdfBarcodeSymbology {
        const symbology: _PdfName | string = pmd.get('Symbology');
        const name: string = symbology instanceof _PdfName ? symbology.name : (typeof symbology === 'string' ? symbology : '');
        switch (name.toLowerCase()) {
        case 'qrcode':
            return PdfBarcodeSymbology.QR;
        case 'datamatrix':
            return PdfBarcodeSymbology.DataMatrix;
        default:
            return PdfBarcodeSymbology.PDF417;
        }
    }
    /**
     * Rewrites the size-dependent PMD entries of each widget.
     *
     * @private
     * @returns {void} Nothing.
     */
    _syncWidgets(): void {
        const count: number = this.itemsCount;
        for (let i: number = 0; i < count; i++) {
            const item: PdfBarcodeFieldItem = this.itemAt(i);
            if (item) {
                const bounds: Rectangle = item.bounds;
                const pmd: _PdfDictionary = this._ensurePmd(item._dictionary);
                pmd.update('Width', bounds.width / 72);
                pmd.update('Height', bounds.height / 72);
            }
        }
    }
    _escapeScript(value: string): string {
        return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    }
    _fieldsScript(): string {
        if (this._fieldNames.length === 0) {
            return '[]';
        }
        return '[' + this._fieldNames.map((name: string) => '"' + this._escapeScript(name) + '"').join(', ') + ']';
    }
    /**
     * Builds the calculate script for the current value format.
     *
     * @private
     * @returns {string} The script.
     */
    _buildScript(): string {
        if (this._valueFormat === PdfBarcodeValueFormat.CustomScript) {
            return this._customScript;
        }
        const fieldsJs: string = this._fieldsScript();
        if (this._valueFormat === PdfBarcodeValueFormat.XML) {
            return this._xmlTemplate(fieldsJs, this.caption);
        }
        return this._tabTemplate(fieldsJs, this._includeFieldNames);
    }
    _xmlTemplate(fieldsJs: string, caption: string): string {
        return 'try\r\n{\r\n' +
            '    if ( app.viewerVersion >= ADBE.PMD_Need_Version )\r\n' +
            '        event.value = this.exportAsXFDFStr({aFields: ' + fieldsJs + ', cHRef: "' +
            this._escapeScript(caption) + '"});\r\n' +
            '    else event.value = " ";\r\n' +
            '}\r\n' +
            'catch (e)\r\n{\r\n' +
            '    event.value = " ";\r\n' +
            '}';
    }
    _tabTemplate(fieldsJs: string, includeNames: boolean): string {
        const lines: string[] = [
            'function bMemberOf(strName, aStrNames)',
            '{',
            '    for (var nMembIdx in aStrNames)',
            '    {',
            '        if (strName == aStrNames[nMembIdx])',
            '            return true;',
            '    }',
            '    return false;',
            '}',
            '',
            'function strTabDelimited(oParam)',
            '{',
            '    var bNeedTab = false;',
            '    var strNames = "";',
            '    var strValues = "";',
            '    for (var i = 0; i < oParam.oDoc.numFields; ++i)',
            '    {',
            '        var strFieldName = oParam.oDoc.getNthFieldName(i);',
            '        if ((null == oParam.aFields || bMemberOf(strFieldName, oParam.aFields))',
            '            && (null == oParam.strXclField || strFieldName != oParam.strXclField)',
            '            && (oParam.oDoc.getField(strFieldName).type != "button"))',
            '        {',
            '            if (bNeedTab)',
            '            {',
            '                if (oParam.bFieldNames)',
            '                    strNames += "\\t";',
            '                strValues += "\\t";',
            '            }',
            '            if (oParam.bFieldNames)',
            '                strNames += strFieldName;',
            '            strValues += oParam.oDoc.getField(strFieldName).value;',
            '            bNeedTab = true;',
            '        }',
            '    }',
            '    if (oParam.bFieldNames)',
            '        return strNames + "\\n" + strValues;',
            '    else',
            '        return strValues;',
            '}',
            '',
            'try',
            '{',
            '    if ( app.viewerVersion >= ADBE.PMD_Need_Version )',
            '        event.value = strTabDelimited({oDoc: this, aFields: ' + fieldsJs + ', bFieldNames: ' +
                (includeNames ? 'true' : 'false') + '});',
            '    else event.value = " ";',
            '}',
            'catch (e)',
            '{',
            '    event.value = " ";',
            '}'
        ];
        return lines.join('\r\n');
    }
    _refreshScriptIfFormatted(): void {
        if (this._valueFormat === PdfBarcodeValueFormat.XML) {
            this._updateScript();
        }
    }
    /**
     * Writes the calculate script to the `/AA /C` entry or removes it when empty.
     *
     * @private
     * @returns {void} Nothing.
     */
    _updateScript(): void {
        const script: string = this._buildScript();
        let aa: _PdfDictionary = this._dictionary.has('AA') ? this._dictionary.get('AA') : undefined;
        if (script.length === 0) {
            if (aa instanceof _PdfDictionary && aa.has('C')) {
                this._removeKey(aa, 'C');
                if (Object.keys(aa._map).length === 0) {
                    this._removeKey(this._dictionary, 'AA');
                }
                this._dictionary._updated = true;
            }
            return;
        }
        if (!(aa instanceof _PdfDictionary)) {
            aa = new _PdfDictionary(this._crossReference);
            this._dictionary.update('AA', aa);
        }
        const action: _PdfDictionary = new _PdfDictionary(this._crossReference);
        action.update('S', _PdfName.get('JavaScript'));
        const stream: _PdfContentStream = new _PdfContentStream([]);
        stream.write(script);
        const streamRef: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(streamRef, stream);
        action.update('JS', streamRef);
        if (this._valueFormat === PdfBarcodeValueFormat.CustomScript) {
            action.update(_customScriptMarker, this._scriptChecksum(script));
        }
        const actionRef: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(actionRef, action);
        aa.update('C', actionRef);
        action._updated = true;
        aa._updated = true;
        this._dictionary._updated = true;
    }
    _readAction(): _PdfDictionary {
        const dictionaries: _PdfDictionary[] = [this._dictionary].concat(this._widgetDictionaries());
        for (let i: number = 0; i < dictionaries.length; i++) {
            try {
                const aa: _PdfDictionary = dictionaries[<number>i].has('AA') ? dictionaries[<number>i].get('AA') : undefined;
                const action: _PdfDictionary = aa instanceof _PdfDictionary && aa.has('C') ? aa.get('C') : undefined;
                if (action instanceof _PdfDictionary && action.has('JS')) {
                    return action;
                }
            } catch (e) {
                return undefined;
            }
        }
        return undefined;
    }
    _scriptChecksum(script: string): string {
        let hash: number = 2166136261;
        for (let i: number = 0; i < script.length; i++) {
            hash ^= script.charCodeAt(i);
            hash = (hash * 16777619) >>> 0;
        }
        return script.length.toString(16) + '-' + hash.toString(16);
    }
    _hasCustomMarker(script: string): boolean {
        const action: _PdfDictionary = this._readAction();
        if (action && action.has(_customScriptMarker)) {
            return action.get(_customScriptMarker) === this._scriptChecksum(script);
        }
        return false;
    }
    _classifyScript(script: string): {format: PdfBarcodeValueFormat, fields: string[], includeNames: boolean} {
        const custom: {format: PdfBarcodeValueFormat, fields: string[], includeNames: boolean} =
            {format: PdfBarcodeValueFormat.CustomScript, fields: [], includeNames: false};
        if (this._hasCustomMarker(script)) {
            return custom;
        }
        const eol: RegExp = /\r\n|\r|\n/g;
        const normalized: string = script.replace(eol, '\r\n');
        const fieldsPattern: string = '(null|\\[(?:[^\\]"\\\\]|"(?:[^"\\\\]|\\\\.)*")*\\])';
        const parseFields: (literal: string) => string[] = (literal: string): string[] => {
            if (literal === 'null') {
                return [];
            }
            return JSON.parse(literal);
        };
        try {
            const tab: RegExpExecArray = new RegExp('aFields: ' + fieldsPattern + ', bFieldNames: (true|false)\\}\\);').exec(normalized);
            if (tab) {
                const names: string[] = parseFields(tab[1]);
                const include: boolean = tab[2] === 'true';
                const literal: string = tab[1] === 'null' ? 'null' : '[' + names.map((n: string) => '"' + this._escapeScript(n) + '"').join(', ') + ']';
                if (normalized === this._tabTemplate(literal, include)) {
                    return {format: PdfBarcodeValueFormat.TabDelimited, fields: names, includeNames: include};
                }
            }
            const xml: RegExpExecArray = new RegExp('aFields: ' + fieldsPattern + ', cHRef: "((?:[^"\\\\]|\\\\.)*)"\\}\\);').exec(normalized);
            if (xml) {
                const names: string[] = parseFields(xml[1]);
                const caption: string = JSON.parse('"' + xml[2] + '"');
                const literal: string = xml[1] === 'null' ? 'null' : '[' + names.map((n: string) => '"' + this._escapeScript(n) + '"').join(', ') + ']';
                if (normalized === this._xmlTemplate(literal, caption)) {
                    return {format: PdfBarcodeValueFormat.XML, fields: names, includeNames: false};
                }
            }
        } catch (e) {
            return custom;
        }
        return custom;
    }
    _readScript(): string {
        const dictionaries: _PdfDictionary[] = [this._dictionary].concat(this._widgetDictionaries());
        for (let i: number = 0; i < dictionaries.length; i++) {
            try {
                const aa: _PdfDictionary = dictionaries[<number>i].has('AA') ? dictionaries[<number>i].get('AA') : undefined;
                const action: _PdfDictionary = aa instanceof _PdfDictionary && aa.has('C') ? aa.get('C') : undefined;
                if (action instanceof _PdfDictionary && action.has('JS')) {
                    const js: string | _PdfBaseStream = action.get('JS');
                    if (typeof js === 'string') {
                        return js;
                    } else if (js && typeof (js as _PdfBaseStream).getString === 'function') {
                        return (js as _PdfBaseStream).getString();
                    }
                }
            } catch (e) {
                return '';
            }
        }
        return '';
    }
    /**
     * Infers the value format, field names and name option from the calculate script of a loaded field.
     *
     * @private
     * @returns {void} Nothing.
     */
    _parseScript(): void {
        const script: string = this._readScript();
        this._fieldNames = [];
        this._includeFieldNames = false;
        this._customScript = '';
        if (script.length === 0) {
            this._valueFormat = PdfBarcodeValueFormat.TabDelimited;
            return;
        }
        const result: {format: PdfBarcodeValueFormat, fields: string[], includeNames: boolean} = this._classifyScript(script);
        this._valueFormat = result.format;
        if (result.format === PdfBarcodeValueFormat.CustomScript) {
            this._customScript = script;
            return;
        }
        this._fieldNames = result.fields.filter((name: any) => typeof name === 'string'); // eslint-disable-line
        this._includeFieldNames = result.includeNames;
    }
    _fieldValue(name: string): string {
        const form: PdfForm = this._form;
        let value: string = '';
        if (form && name !== this.name) {
            try {
                for (let i: number = 0; i < form.count; i++) {
                    const field: PdfField = form.fieldAt(i);

                    if (field && field.name === name) {
                        value += this._resolveFieldValue(field);
                    }
                }
            } catch (error) {
                return '';
            }
        }

        return value;
    }
    _resolveFieldValue(field: PdfField): string {
        let value: string | string[] = '';
        try {
            if (field instanceof PdfTextBoxField) {
                value = field.text;
            } else if (
                field instanceof PdfListBoxField ||
                field instanceof PdfComboBoxField
            ) {
                value = field.selectedValue;
            } else if (
                field instanceof PdfRadioButtonListField
            ) {
                const index: number = field.selectedIndex;
                const item: PdfRadioButtonListItem | undefined =
                    index >= 0 ? field.itemAt(index) : undefined;

                value = item ? item.value : '';
            } else if (
                field instanceof PdfCheckBoxField
            ) {
                value = field.checked
                    ? field.exportValue
                    : 'Off';
            } else if (
                field instanceof PdfButtonField
            ) {
                value = field.text;
            }
        } catch (error) {
            return '';
        }
        if (Array.isArray(value)) {
            return value.join(',');
        }
        return typeof value === 'string' ? value : '';
    }
    _escapeXml(value: string): string {
        return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    /**
     * Extracts the value of the first `event.value = <literal>;` assignment in a custom
     * calculation script, so the saved appearance and `/V` match what the script produces.
     *
     * @private
     * @returns {string} The assigned value or an empty string.
     */
    _customScriptValue(): string {
        if (this._customScript.length === 0) {
            return '';
        }
        const match: RegExpExecArray =
            /event\s*\.\s*value\s*=\s*(?:'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)")/.exec(this._customScript); // eslint-disable-line
        if (!match) {
            return '';
        }
        const raw: string = typeof match[1] === 'string' ? match[1] : match[2];
        let value: string = '';
        for (let i: number = 0; i < raw.length; i++) {
            const char: string = raw[<number>i];
            if (char === '\\' && i + 1 < raw.length) {
                const next: string = raw[i + 1];
                switch (next) {
                case 'n':
                    value += '\n';
                    break;
                case 'r':
                    value += '\r';
                    break;
                case 't':
                    value += '\t';
                    break;
                default:
                    value += next;
                    break;
                }
                i++;
            } else {
                value += char;
            }
        }
        return value;
    }
    /**
     * Builds the payload from the referenced field values using the current value format.
     *
     * @private
     * @returns {string} The encoded value or an empty string.
     */
    _encodeValue(): string {
        if (this._valueFormat === PdfBarcodeValueFormat.CustomScript) {
            return this._customScriptValue();
        }
        if (!this._form || this._fieldNames.length === 0) {
            return '';
        }
        const names: string[] = this._fieldNames;
        const values: string[] = names.map((name: string) => this._fieldValue(name));
        if (this._valueFormat === PdfBarcodeValueFormat.XML) {
            let xml: string = '<?xml version="1.0" encoding="UTF-8"?>\n<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">\n' +
                '<f href="' + this._escapeXml(this.caption) + '"/>\n<fields>\n';
            names.forEach((name: string, index: number) => {
                xml += '<field name="' + this._escapeXml(name) + '"><value>' + this._escapeXml(values[<number>index]) + '</value></field>\n';
            });
            return xml + '</fields>\n</xfdf>\n';
        }
        const row: string = values.join('\t');
        return this._includeFieldNames ? names.join('\t') + '\r' + row : row;
    }
    _updateCalculationOrder(): void {
        if (!this._form || !this._ref) {
            return;
        }
        const formDictionary: _PdfDictionary =
            this._form._dictionary;
        let calculationOrder: _PdfReference[] =
            formDictionary.has('CO')
                ? formDictionary.getRaw('CO') as _PdfReference[]
                : [];
        if (!Array.isArray(calculationOrder)) {
            calculationOrder = [];
        }
        if (calculationOrder.indexOf(this._ref) === -1) {
            calculationOrder.push(this._ref);
            formDictionary.update('CO', calculationOrder);
            formDictionary._updated = true;
        }
    }
    /**
     * Writes the current payload to the `/V` entry and rebuilds the size-dependent entries.
     *
     * @private
     * @returns {void} Nothing.
     */
    _onAddedToForm(): void {
        const encoded: string = this._encodeValue();
        const currentValue: string = this._dictionary.get('V');
        if (encoded.length > 0 && encoded !== currentValue) {
            this._dictionary.update('V', encoded);
            this._dictionary._updated = true;
            this._setAppearance = true;
        } else if (encoded.length === 0 && this._valueFormat === PdfBarcodeValueFormat.CustomScript &&
                   typeof currentValue === 'string' && currentValue.length > 0 && currentValue !== ' ' && !this._isLoaded) {
            this._dictionary.update('V', ' ');
            this._dictionary._updated = true;
            this._setAppearance = true;
        }
        this._updateCalculationOrder();
        if (!this._isLoaded) {
            this._syncWidgets();
            this._fieldFlags =
                _barcodeFlags as number as _FieldFlag;
        }
    }
    /**
     * Generates the appearance of a widget or flattens it onto the page.
     *
     * @private
     * @param {boolean} [isFlatten=false] When `true`, flattens the field.
     * @returns {void} Nothing.
     */
    _doPostProcess(isFlatten: boolean = false): void {
        this._onAddedToForm();
        const regenerate: boolean = !this._isLoaded || this._setAppearance || (this._form && this._form._setAppearance);
        if (!isFlatten && !regenerate) {
            return;
        }
        const count: number = this.itemsCount;
        for (let i: number = 0; i < count; i++) {
            const item: PdfBarcodeFieldItem = this.itemAt(i);
            if (!item) {
                continue;
            }
            const bounds: Rectangle = item.bounds;
            if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
                continue;
            }
            let template: PdfTemplate;
            if (!regenerate && item._dictionary.has('AP')) {
                template = this._existingTemplate(item);
            }
            if (!template) {
                template = this._createBarcodeAppearance( bounds.width, bounds.height );
            }
            if (isFlatten) {
                const page: PdfPage = item._page || item._getPage();
                this._drawTemplate( template, page, { x: bounds.x, y: bounds.y, width: template._size.width,
                    height: template._size.height} );
            } else {
                this._addAppearance(item._dictionary, template, 'N');
                item._dictionary._updated = true;
            }
        }
        if (isFlatten) {
            this._dictionary._updated = false;
        }
        this._setAppearance = false;
    }
    _existingTemplate(item: PdfBarcodeFieldItem): PdfTemplate {
        try {
            const ap: _PdfDictionary = item._dictionary.get('AP');
            if (ap instanceof _PdfDictionary && ap.has('N')) {
                const stream: _PdfBaseStream = ap.get('N');
                const reference: _PdfReference = ap.getRaw('N');
                if (stream && reference instanceof _PdfReference) {
                    stream.reference = reference;
                    return new PdfTemplate(stream, this._crossReference);
                }
            }
        } catch (e) {
            return undefined;
        }
        return undefined;
    }
    /**
     * Draws the barcode and caption into a new template.
     *
     * @private
     * @param {number} width The width of the template.
     * @param {number} height The height of the template.
     * @returns {PdfTemplate} The template.
     */
    _createBarcodeAppearance( width: number, height: number): PdfTemplate {
        const template: PdfTemplate = new PdfTemplate( [0, 0, width, height], this._crossReference);
        template._writeTransformation = true;
        const graphics: PdfGraphics = template.graphics;
        const state: PdfGraphicsState = graphics.save();
        const caption: string = this.caption;
        const captionHeight: number = caption.length > 0 ? _captionHeight : 0;
        const horizontalPadding: number = 4;
        const topPadding: number = 4;
        const bottomPadding: number = captionHeight > 0 ? 7 : 5;
        const region: Rectangle = {
            x: horizontalPadding,
            y: topPadding,
            width: Math.max(1, width - (horizontalPadding * 2)),
            height: Math.max(1, height - captionHeight - topPadding - bottomPadding)
        };
        const rawPayload: string =
            this.text.length > 0 ? this.text : ' ';
        try {
            if (this.compressData) {
                this._drawBarcode(graphics, rawPayload, region, _compressBarcodeData(rawPayload));
            } else {
                this._drawBarcode(graphics, rawPayload, region);
            }
            if (captionHeight > 0) {
                const font: PdfStandardFont =
                    new PdfStandardFont(
                        PdfFontFamily.helvetica,
                        4.27
                    );
                const format: PdfStringFormat = new PdfStringFormat();
                const captionWidth: number = Math.min(
                    Math.max(1, width - (horizontalPadding * 2)),
                    font.getLineWidth(caption, format)
                );
                const captionBounds: Rectangle = {
                    x: Math.max(0, (width - captionWidth) / 2),
                    y: height - captionHeight + 2,
                    width: captionWidth,
                    height: captionHeight
                };
                graphics.drawString(
                    caption,
                    font,
                    captionBounds,
                    new PdfBrush({
                        r: 0,
                        g: 0,
                        b: 0
                    })
                );
            }
        } finally {
            graphics.restore(state);
        }
        return template;
    }
    _drawBarcode(graphics: PdfGraphics, payload: string, bounds: Rectangle, bytes?: Uint8Array): void {
        const options: PdfBarcodeOptions = this.barcodeOptions;
        const xDimension: number = options.xDimention;
        // Binary payload: one character per byte (0-255), encoded without any UTF-8 conversion.
        let text: string = payload;
        if (bytes) {
            text = '';
            for (let i: number = 0; i < bytes.length; i++) {
                text += String.fromCharCode(bytes[<number>i]);
            }
        }
        if (options.symbology === PdfBarcodeSymbology.QR) {
            const qrOptions: PdfQRBarcodeOptions = {errorCorrectionLevel: options.errorCorrectionLevel as PdfQRErrorCorrectionLevel,
                xDimension: xDimension};
            if (bytes) {
                qrOptions.inputMode = PdfQRInputMode.Byte;
                qrOptions.textEncoding = PdfBarcodeTextEncoding.Iso88591;
            }
            qrOptions.quietZone = {all: 4};
            const renderer: PdfQRBarcode = new PdfQRBarcode(text, qrOptions);
            this._drawQrSymbol(graphics, renderer, xDimension, bounds);
        } else if (options.symbology === PdfBarcodeSymbology.DataMatrix) {
            const matrixOptions: PdfDataMatrixBarcodeOptions = {xDimension: xDimension};
            if (bytes) {
                matrixOptions.textEncoding = PdfBarcodeTextEncoding.Iso88591;
            }
            new PdfDataMatrixBarcode(text, matrixOptions).draw(graphics, bounds);
        } else {
            const barcode: Pdf417Barcode = new Pdf417Barcode(text, {
                errorCorrectionLevel: options.errorCorrectionLevel as Pdf417ErrorCorrectionLevel,
                xDimension: xDimension});
            barcode._isByteText = !!bytes;
            barcode.draw(graphics, bounds);
        }
    }
    /**
     * Draws a QR Code while preserving the configured X-Dimension when possible.
     *
     * @param {PdfGraphics} graphics - Graphics context used for rendering.
     * @param {PdfQRBarcode} renderer - QR Code renderer.
     * @param {number} xDimension - Module size of the QR Code.
     * @param {Rectangle} region - Target drawing region.
     * @returns {void} returns nothing
     */
    _drawQrSymbol(
        graphics: PdfGraphics, renderer: PdfQRBarcode,
        xDimension: number, region: Rectangle): void {
        graphics.drawRectangle(
            { x: region.x, y: region.y, width: region.width, height: region.height },
            new PdfBrush({ r: 255, g: 255, b: 255 }));
        const encoded: _QrEncodeResult = renderer._encodeQr(
            renderer.text, renderer.inputMode, renderer.errorCorrectionLevel,
            renderer.version, renderer.textEncoding);
        const modules: number = encoded.size;
        const quietZone: number = 4 * xDimension;
        const totalWidth: number = modules * xDimension + quietZone * 2;
        const totalHeight: number = totalWidth;
        if (region.width >= totalWidth && region.height >= totalHeight) {
            renderer.draw(graphics, {
                x: region.x + (region.width - totalWidth) / 2,
                y: region.y + (region.height - totalHeight) / 2,
                width: 0,
                height: 0
            });
            return;
        }
        if (region.width > quietZone * 2 && region.height > quietZone * 2) {
            renderer.draw(graphics, region);
            return;
        }
        renderer.quietZone = {all: 0};
        renderer.draw(graphics, region);
    }
}
