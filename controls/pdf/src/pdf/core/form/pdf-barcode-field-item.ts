import { _PdfDictionary, _PdfName } from './../pdf-primitives';
import { _PdfCrossReference } from './../pdf-cross-reference';
import { PdfWidgetAnnotation } from './../annotations/annotation';
import { PdfField } from './field';
/**
 * Represents a widget annotation of a barcode form field.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the barcode field
 * let field: PdfBarcodeField = document.form.fieldAt(0) as PdfBarcodeField;
 * // Access the first widget of the barcode field
 * let item: PdfBarcodeFieldItem = field.itemAt(0);
 * // Get the bounds of the widget
 * let bounds: Rectangle = item.bounds;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfBarcodeFieldItem extends PdfWidgetAnnotation {
    /**
     * Loads a barcode field item from an existing widget dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The widget dictionary.
     * @param {_PdfCrossReference} crossReference The cross reference table.
     * @param {PdfField} [field] The owning field.
     * @returns {PdfBarcodeFieldItem} The loaded item.
     */
    static _load(dictionary: _PdfDictionary, crossReference: _PdfCrossReference, field?: PdfField): PdfBarcodeFieldItem {
        const item: PdfBarcodeFieldItem = new PdfBarcodeFieldItem();
        item._isLoaded = true;
        item._dictionary = dictionary;
        item._crossReference = crossReference;
        if (field) {
            item._field = field;
        }
        return item;
    }
    /**
     * Gets the PaperMetaData (`PMD`) dictionary of the widget, if any.
     *
     * @private
     * @returns {_PdfDictionary} The PMD dictionary or `undefined`.
     */
    get _pmd(): _PdfDictionary {
        let value: _PdfDictionary;
        if (this._dictionary && this._dictionary.has('PMD')) {
            const pmd: _PdfDictionary = this._dictionary.get('PMD');
            if (pmd instanceof _PdfDictionary) {
                value = pmd;
            }
        }
        return value;
    }
    /**
     * Writes a PaperMetaData dictionary to the widget.
     *
     * @private
     * @param {_PdfDictionary} pmd The PMD dictionary.
     * @returns {void} Nothing.
     */
    _setPmd(pmd: _PdfDictionary): void {
        this._dictionary.update('PMD', pmd);
        this._dictionary._updated = true;
    }
    /**
     * Applies the default barcode widget entries (no border, default appearance string).
     *
     * @private
     * @returns {void} Nothing.
     */
    _applyDefaults(): void {
        const border: _PdfDictionary = new _PdfDictionary(this._crossReference);
        border.update('Type', _PdfName.get('Border'));
        border.update('W', 0);
        this._dictionary.update('BS', border);
        if (!this._dictionary.has('DA')) {
            this._dictionary.update('DA', '/Helv 8 Tf 0 g');
        }
        this._dictionary._updated = true;
    }
}
