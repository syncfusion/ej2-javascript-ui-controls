import { _PdfDictionary, _PdfReference, _PdfName } from './../pdf-primitives';
import { _PdfCrossReference } from './../pdf-cross-reference';
import { PdfForm } from './form';
import { PdfRadioButtonListItem, PdfStateItem, PdfWidgetAnnotation, PdfListFieldItem, _PaintParameter, PdfInteractiveBorder } from './../annotations/annotation';
import { _getItemValue, _checkField, _removeReferences, _removeDuplicateReference, _updateVisibility, _styleToString, _getStateTemplate, _findPage, _getInheritableProperty, _getNewGuidString, _calculateBounds, _parseColor, _mapHighlightMode, _reverseMapHighlightMode, _mapBorderStyle, _getUpdatedBounds, _setMatrix, _obtainFontDetails, _isNullOrUndefined, _stringToPdfString, _mapFont, _isRightToLeftCharacters, _getFontStyle, _createFontStream, _encode, _getFontFromDescriptor, _decodeFontFamily, _updateDashedBorderStyle } from './../utils';
import { _PdfCheckFieldState, PdfFormFieldVisibility, _FieldFlag, PdfAnnotationFlag, PdfTextAlignment, PdfHighlightMode, PdfBorderStyle, PdfRotationAngle, PdfCheckBoxStyle, PdfFormFieldsTabOrder, PdfFillMode, PdfTextDirection, _PdfWordWrapType, _SignatureFlag } from './../enumerator';
import { PdfPage } from './../pdf-page';
import { PdfDocument } from './../pdf-document';
import { _PdfBaseStream } from './../base-stream';
import { PdfTemplate } from './../graphics/pdf-template';
import { PdfStringFormat, PdfVerticalAlignment } from './../fonts/pdf-string-format';
import { PdfGraphics, PdfGraphicsState, _TextRenderingMode, _PdfTransformationMatrix, PdfBrush, PdfPen } from './../graphics/pdf-graphics';
import { PdfFontFamily, PdfStandardFont, PdfFont, PdfFontStyle, PdfTrueTypeFont } from './../fonts/pdf-standard-font';
import { PdfAppearance } from './../annotations/pdf-appearance';
import { PdfPath } from './../graphics/pdf-path';
import { PdfAnnotationCollection } from '../annotations/annotation-collection';
import { PdfFieldActions } from '../pdf-action';
import { PdfSignature } from '../security/digital-signature/signature/pdf-signature';
import { Point, Size, Rectangle, PdfColor } from './../pdf-type';
/**
 * `PdfField` class represents the base class for form field objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the form field at index 0
 * let field: PdfField = document.form.fieldAt(0);
 * // Gets the count of the loaded field items
 * let count: number = field.itemsCount;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export abstract class PdfField {
    _ref: _PdfReference;
    _dictionary: _PdfDictionary;
    _crossReference: _PdfCrossReference;
    _enableGrouping: boolean = false;
    _isDuplicatePage: boolean = false;
    _form: PdfForm;
    _kids: _PdfReference[];
    _defaultIndex: number;
    _parsedItems: Map<number, PdfWidgetAnnotation>;
    _name: string;
    _actualName: string;
    _mappingName: string;
    _alternateName: string;
    _maxLength: number;
    _visibility: PdfFormFieldVisibility;
    _visible: boolean = true;
    _page: PdfPage;
    _da: _PdfDefaultAppearance;
    _flags: _FieldFlag;
    _isLoaded: boolean;
    _setAppearance: boolean;
    _stringFormat: PdfStringFormat;
    _font: PdfFont;
    _fontName: string;
    _gray: PdfBrush;
    _silver: PdfBrush;
    _white: PdfBrush;
    _black: PdfBrush;
    _isTransparentBackColor: boolean = false;
    _isTransparentBorderColor: boolean = false;
    _tabIndex: number;
    _annotationIndex: number;
    _defaultFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
    _appearanceFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
    _defaultItemFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.timesRoman, 12);
    _flatten: boolean = false;
    _circleCaptionFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 8, PdfFontStyle.regular);
    _textAlignment: PdfTextAlignment;
    _isUpdating: boolean = false;
    _isImport: boolean = false;
    _exportValue: string = 'Yes';
    /**
     * Gets the count of the loaded field items (Read only).
     *
     * @returns {number} Items count.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the count of the loaded field items
     * let count: number = field.itemsCount;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get itemsCount(): number {
        return this._kids ? this._kids.length : 0;
    }
    /**
     * Gets the form object of the field (Read only).
     *
     * @returns {PdfForm} Form.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the form object of the field
     * let form: PdfForm = field.form;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get form(): PdfForm {
        return this._form;
    }
    /**
     * Gets the name of the field (Read only).
     *
     * @returns {string} Field name.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the name of the field
     * let name: string = field.name;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get name(): string {
        if (typeof this._name === 'undefined') {
            const names: string[] = _getInheritableProperty(this._dictionary, 'T', false, false, 'Parent');
            if (names && names.length > 0) {
                if (names.length === 1) {
                    this._name = names[0];
                } else {
                    this._name = names.join('.');
                }
            }
        }
        return this._name;
    }
    /**
     * Gets the actual name of the field (Read only).
     *
     * @private
     * @returns {string} Actual name.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the actual name of the field
     * let name: string = field.actualName;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get actualName(): string {
        if (typeof this._actualName === 'undefined' && this._dictionary && this._dictionary.has('T')) {
            const name: string = this._dictionary.get('T');
            if (name && typeof name === 'string') {
                this._actualName = name;
            }
        }
        return this._actualName;
    }
    /**
     * Gets the mapping name to be used when exporting interactive form field data from the document.
     *
     * @returns {string} Mapping name.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the mapping name of the field
     * let name: string = field.mappingName;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get mappingName(): string {
        if (typeof this._mappingName === 'undefined' && this._dictionary.has('TM')) {
            const name: string = this._dictionary.get('TM');
            if (name && typeof name === 'string') {
                this._mappingName = name;
            }
        }
        return this._mappingName;
    }
    /**
     * Sets the mapping name to be used when exporting interactive form field data from the document.
     *
     * @param {string} value Mapping name.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the mapping name of the field
     * field.mappingName = 'Author';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set mappingName(value: string) {
        if (typeof this.mappingName === 'undefined' || this._mappingName !== value) {
            this._mappingName = value;
            this._dictionary.update('TM', value);
        }
    }
    /**
     * Gets the tool tip of the form field.
     *
     * @returns {string} Tooltip.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the tool tip value of the field
     * let toolTip: string = field.toolTip;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get toolTip(): string {
        if (typeof this._alternateName === 'undefined' && this._dictionary && this._dictionary.has('TU')) {
            const name: string = this._dictionary.get('TU');
            if (name && typeof name === 'string') {
                this._alternateName = name;
            }
        }
        return this._alternateName;
    }
    /**
     * Sets the tool tip of the form field.
     *
     * @param {string} value Tooltip.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the tool tip value of the field
     * field.toolTip = 'Author of the document';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set toolTip(value: string) {
        if (typeof this.toolTip === 'undefined' || this._alternateName !== value) {
            this._alternateName = value;
            this._dictionary.update('TU', value);
        }
    }
    /**
     * Gets the form field visibility.
     *
     * @returns {PdfFormFieldVisibility} Field visibility option.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the form field visibility.
     * let visibility: PdfFormFieldVisibility = field.visibility;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get visibility(): PdfFormFieldVisibility {
        let value: PdfFormFieldVisibility;
        if (this._isLoaded) {
            value = PdfFormFieldVisibility.visible;
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            let flag: PdfAnnotationFlag = PdfAnnotationFlag.default;
            if (widget && widget._hasFlags) {
                flag = widget.flags;
            } else if (this._dictionary.has('F')) {
                flag = this._dictionary.get('F');
            } else {
                return PdfFormFieldVisibility.visibleNotPrintable;
            }
            let flagValue: number = 3;
            if ((flag & PdfAnnotationFlag.hidden) === PdfAnnotationFlag.hidden) {
                flagValue = 0;
            }
            if ((flag & PdfAnnotationFlag.noView) === PdfAnnotationFlag.noView) {
                flagValue = 1;
            }
            if ((flag & PdfAnnotationFlag.print) !== PdfAnnotationFlag.print) {
                flagValue &= 2;
            }
            switch (flagValue) {
            case 0:
                value = PdfFormFieldVisibility.hidden;
                break;
            case 1:
                value = PdfFormFieldVisibility.hiddenPrintable;
                break;
            case 2:
                value = PdfFormFieldVisibility.visibleNotPrintable;
                break;
            case 3:
                value = PdfFormFieldVisibility.visible;
                break;
            }
        } else {
            if (typeof this._visibility === 'undefined') {
                this._visibility = PdfFormFieldVisibility.visible;
            }
            value = this._visibility;
        }
        return value;
    }
    /**
     * Sets the form field visibility.
     *
     * @param {PdfFormFieldVisibility} value visibility.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the form field visibility.
     * field.visibility = PdfFormFieldVisibility.visible;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set visibility(value: PdfFormFieldVisibility) {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (this._isLoaded) {
            if (widget && (!widget._hasFlags || this.visibility !== value)) {
                _updateVisibility(widget._dictionary, value);
                this._dictionary._updated = true;
            } else if (!this._dictionary.has('F') || this.visibility !== value) {
                _updateVisibility(this._dictionary, value);
                this._dictionary._updated = true;
            }
        } else {
            if (this.visibility !== value) {
                this._visibility = value;
                switch (value) {
                case PdfFormFieldVisibility.hidden:
                    widget.flags = PdfAnnotationFlag.hidden;
                    break;
                case PdfFormFieldVisibility.hiddenPrintable:
                    widget.flags = (PdfAnnotationFlag.noView | PdfAnnotationFlag.print);
                    break;
                case PdfFormFieldVisibility.visible:
                    widget.flags = PdfAnnotationFlag.print;
                    break;
                case PdfFormFieldVisibility.visibleNotPrintable:
                    widget.flags = PdfAnnotationFlag.default;
                    break;
                }
            }
        }
    }
    /**
     * Gets the bounds.
     *
     * @returns {Rectangle} Bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the bounds of list box field.
     * let bounds: Rectangle = field.bounds;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bounds(): Rectangle {
        let value: Rectangle;
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (widget) {
            widget._page = this.page;
        }
        if (widget && widget.bounds) {
            value = widget.bounds;
        } else if (this._dictionary && this._dictionary.has('Rect')) {
            value = _calculateBounds(this._dictionary, this.page);
        }
        if (typeof value === 'undefined' || value === null) {
            value = {x: 0, y: 0, width: 0, height: 0};
        }
        return value;
    }
    /**
     * Sets the bounds.
     *
     * @param {Rectangle} value bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the bounds.
     * field.bounds = {x: 10, y: 10, width: 100, height: 20};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set bounds(value: Rectangle) {
        if (value.x === 0 && value.y === 0 && value.width === 0 && value.height === 0) {
            throw new Error('Cannot set empty bounds');
        }
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (this._isLoaded) {
            if (typeof widget === 'undefined' || this._dictionary.has('Rect')) {
                this._dictionary.update('Rect', _getUpdatedBounds([value.x, value.y, value.width, value.height], this.page));
            } else {
                widget._page = this.page;
                widget.bounds = value;
            }
        } else {
            widget._page = this.page;
            widget.bounds = value;
        }
    }
    /**
     * Gets the rotation angle of the field.
     *
     * @returns {number} angle.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the rotation angle of the form field.
     * let rotate: number = field.rotate;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get rotate(): number {
        let widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        let angle: number;
        if (widget && typeof widget.rotate !== 'undefined') {
            angle = widget.rotate;
        } else if (this._mkDictionary && this._mkDictionary.has('R')) {
            angle = this._mkDictionary.get('R');
        } else if (this._dictionary.has('R')) {
            angle = this._dictionary.get('R');
        } else {
            for (let i: number = 0; i < this._kidsCount && typeof angle === 'undefined'; i++) {
                if (i !== this._defaultIndex) {
                    widget = this.itemAt(i);
                    if (widget && typeof widget.rotate !== 'undefined') {
                        angle = widget.rotate;
                    }
                }
            }
        }
        if (typeof angle === 'undefined') {
            angle = 0;
        }
        return angle;
    }
    /**
     * Sets the rotation angle of the field.
     *
     * @param {number} value rotation angle.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the rotation angle.
     * field.rotate = 90;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set rotate(value: number) {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (widget) {
            widget.rotate = value;
        } else if (!this._dictionary.has('R') || this._dictionary.get('R') !== value) {
            this._dictionary.update('R', value);
        }
    }
    /**
     * Gets the fore color of the field.
     *
     * @returns {PdfColor} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the fore color of the field.
     * let color: PdfColor = field.color;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get color(): PdfColor {
        let value: PdfColor;
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (widget && widget.color) {
            value = widget.color;
        } else if (this._defaultAppearance) {
            value = this._da.color;
        }
        return value;
    }
    /**
     * Sets the fore color of the field.
     *
     * @param {PdfColor} value R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the fore color of the field.
     * field.color = {r: 255, g: 0, b: 0};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set color(value: PdfColor) {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (widget && widget.color && _isNullOrUndefined(value)) {
            widget.color = value;
        } else {
            let isNew: boolean = false;
            if (!this._defaultAppearance) {
                this._da = new _PdfDefaultAppearance('');
                isNew = true;
            }
            if (isNew || this._da.color !== value) {
                this._da.color = value;
                this._dictionary.update('DA', this._da.toString());
            }
        }
    }
    /**
     * Gets the background color of the field.
     *
     * @returns {PdfColor} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the background color of the field.
     * let backColor: PdfColor = field.backColor;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get backColor(): PdfColor {
        return this._parseBackColor(false);
    }
    /**
     * Sets the background color of the field.
     *
     * @param {PdfColor} value R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the background color of the field.
     * field.backColor = {r: 255, g: 0, b: 0};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set backColor(value: PdfColor) {
        this._updateBackColor(value);
    }
    /**
     * Gets the border color of the field.
     *
     * @returns {PdfColor} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the border color of the field.
     * let borderColor: PdfColor = field.borderColor;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get borderColor(): PdfColor {
        return this._parseBorderColor(true);
    }
    /**
     * Sets the border color of the field.
     *
     * @param {PdfColor} value Array with R, G, B, A color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the border color of the field.
     * field.borderColor = {r: 255, g: 0, b: 0};
     * // Sets the transparent border color of the field.
     * field.borderColor = {r: 255, g: 255, b: 255, isTransparent: true};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set borderColor(value: PdfColor) {
        this._updateBorderColor(value, true);
    }
    /**
     * Gets a value indicating whether read only.
     *
     * @returns {boolean} read only or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets a value indicating whether read only.
     * let readOnly: boolean = field.readOnly;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get readOnly(): boolean {
        return (this._fieldFlags & _FieldFlag.readOnly) !== 0;
    }
    /**
     * Sets a value indicating whether read only.
     *
     * @param {boolean} value read only or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets a value indicating whether read only.
     * field.readOnly = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set readOnly(value: boolean) {
        if (value) {
            this._fieldFlags |= _FieldFlag.readOnly;
        } else {
            if (this._fieldFlags === _FieldFlag.readOnly) {
                this._fieldFlags |= _FieldFlag.default;
            }
            this._fieldFlags &= ~_FieldFlag.readOnly;
        }
    }
    /**
     * Gets a value indicating whether the field is required.
     *
     * @returns {boolean} required or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets a value indicating whether the field is required.
     * let required: boolean = field.required;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get required(): boolean {
        return (this._fieldFlags & _FieldFlag.required) !== 0;
    }
    /**
     * Sets a value indicating whether the field is required.
     *
     * @param {boolean} value required or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets a value indicating whether the field is required.
     * field.required = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set required(value: boolean) {
        if (value) {
            this._fieldFlags |= _FieldFlag.required;
        } else {
            this._fieldFlags &= ~_FieldFlag.required;
        }
    }
    /**
     * Gets a value indicating the visibility of the field (Read only).
     *
     * @returns {boolean} visible or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets a value indicating the visibility of the field.
     * let visible: boolean = field.visible;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get visible(): boolean {
        if (this._isLoaded) {
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            let flag: PdfAnnotationFlag = PdfAnnotationFlag.default;
            if (widget && widget._hasFlags) {
                flag = widget.flags;
            } else if (this._dictionary.has('F')) {
                flag = this._dictionary.get('F');
            }
            return flag !== PdfAnnotationFlag.hidden;
        } else {
            return this._visible;
        }
    }
    /**
     * Sets a value indicating the visibility of the field.
     * Only applicable for newly created PDF form fields.
     *
     * @param {boolean} value or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets a value indicating the visibility of the field
     * field.visible = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set visible(value: boolean) {
        if (!this._isLoaded && this._visible !== value && !value) {
            this._visible = value;
            this.itemAt(this._defaultIndex).flags = PdfAnnotationFlag.hidden;
        }
    }
    /**
     * Gets the width, style and dash of the border of the field.
     *
     * @returns {PdfInteractiveBorder} Border properties.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the width, style and dash of the border of the field.
     * let border: PdfInteractiveBorder = field.border;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get border(): PdfInteractiveBorder {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        let value: PdfInteractiveBorder;
        if (widget && widget._dictionary.has('BS')) {
            value = widget.border;
        } else {
            value = new PdfInteractiveBorder({style: PdfBorderStyle.solid});
            if (!(this instanceof PdfButtonField)) {
                value._width = 0;
            }
            value._dictionary = this._dictionary;
            if (this._dictionary !== null && typeof this._dictionary !== 'undefined' && this._dictionary.has('BS')) {
                const border: _PdfDictionary = this._dictionary.get('BS');
                if (border) {
                    if (border.has('W')) {
                        value._width = border.get('W');
                    }
                    if (border.has('S')) {
                        const borderStyle: _PdfName = border.get('S');
                        if (borderStyle) {
                            switch (borderStyle.name) {
                            case 'D':
                                value._style = PdfBorderStyle.dashed;
                                break;
                            case 'B':
                                value._style = PdfBorderStyle.beveled;
                                break;
                            case 'I':
                                value._style = PdfBorderStyle.inset;
                                break;
                            case 'U':
                                value._style = PdfBorderStyle.underline;
                                break;
                            default:
                                value._style = PdfBorderStyle.solid;
                                break;
                            }
                        }
                    }
                    if (border.has('D')) {
                        value._dash = border.getArray('D');
                    }
                }
            }
        }
        return value;
    }
    /**
     * Sets the width, style and dash of the border of the field.
     *
     * @param {PdfInteractiveBorder} value Border properties.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the width, style and dash of the border of the field.
     * field.border = new PdfInteractiveBorder({width: 2, style: PdfBorderStyle.solid});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set border(value: PdfInteractiveBorder) {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (widget) {
            widget.border.width = value.width;
            widget.border.style = value.style;
            this._updateBorder(widget._dictionary, value);
        } else {
            this._updateBorder(this._dictionary, value);
        }
    }
    /**
     * Gets the rotation of the field (Read only).
     *
     * @returns {PdfRotationAngle} Rotation angle.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the rotation of the field.
     * let rotate: PdfRotationAngle = field.rotationAngle;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get rotationAngle(): PdfRotationAngle {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        let mkDictionary: _PdfDictionary;
        if (widget) {
            mkDictionary = widget._dictionary.get('MK');
        } else {
            mkDictionary = this._mkDictionary;
        }
        if (mkDictionary && mkDictionary.has('R')) {
            const rotationValue: number = mkDictionary.get('R');
            if (rotationValue !== undefined) {
                switch (rotationValue) {
                case 90:
                    return PdfRotationAngle.angle90;
                case 180:
                    return PdfRotationAngle.angle180;
                case 270:
                    return PdfRotationAngle.angle270;
                default:
                    return PdfRotationAngle.angle0;
                }
            }
        }
        if (!widget) {
            return PdfRotationAngle.angle0;
        }
        return widget.rotationAngle;
    }
    /**
     * Gets a value indicating whether the field is allow to export data or not.
     *
     * @returns {boolean} Allow to export data or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets a value indicating whether the field is allow to export data or not.
     * let export: boolean = field.export;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get export(): boolean {
        return !((this._fieldFlags & _FieldFlag.noExport) !== 0);
    }
    /**
     * Sets a value indicating whether the field is allow to export data or not.
     *
     * @param {boolean} value Allow to export data or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets a value indicating whether the field is allow to export data or not.
     * field.export = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set export(value: boolean) {
        if (value) {
            this._fieldFlags &= ~_FieldFlag.noExport;
        } else {
            this._fieldFlags |= _FieldFlag.noExport;
        }
    }
    /**
     * Gets the tab index of annotation in current page.
     *
     * @returns {number} tab index.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the tab index of annotation in current page.
     * let tabIndex: number = field.tabIndex;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get tabIndex(): number {
        if (this._isLoaded) {
            let annots: _PdfReference[];
            if (this.page._pageDictionary.has('Annots')) {
                annots = this.page._pageDictionary.get('Annots');
            }
            if (this._kids && this._kids.length > 0) {
                for (const reference of this._kids) {
                    if (reference) {
                        if (this.page._pageDictionary.has('Annots')) {
                            if (annots) {
                                const index1: number = annots.indexOf(reference);
                                if (index1 !== -1) {
                                    return index1;
                                }
                            }
                        }
                    }
                }
            } else if (this._dictionary && this._dictionary.has('Subtype') && this._dictionary.get('Subtype').name === 'Widget') {
                if (this._ref) {
                    if (annots) {
                        const index1: number = annots.indexOf(this._ref);
                        if (index1 !== -1) {
                            return index1;
                        }
                    }
                }
            }
            return -1;
        } else {
            return this._tabIndex;
        }
    }
    /**
     * Sets the tab index of a annotation in the current page.
     *
     * @param {number} value index.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the tab index of annotation in current page.
     * field.tabIndex = 5;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set tabIndex(value: number) {
        this._tabIndex = value;
        if (this._isLoaded) {
            const page: PdfPage = this.page;
            if (page &&
                (page.tabOrder === PdfFormFieldsTabOrder.manual ||
                (this.form && this.form._tabOrder === PdfFormFieldsTabOrder.manual))) {
                if (page._pageDictionary.has('Annots')) {
                    const annots: _PdfReference[] = page._pageDictionary.get('Annots');
                    const annotationCollection: PdfAnnotationCollection = new PdfAnnotationCollection(annots, this._crossReference, page);
                    page._annotations = annotationCollection;
                    let index: number = annots.indexOf(this._ref);
                    if (index < 0) {
                        index = this._annotationIndex;
                    }
                    const annotations: _PdfReference[] = page.annotations._reArrange(this._ref, this._tabIndex, index);
                    page._pageDictionary.update('Annots', annotations);
                    page._pageDictionary._updated = true;
                }
            }
        }
    }
    /**
     * Gets the page object of the form field (Read only).
     *
     * @returns {PdfPage} Page object.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the page object of the form field.
     * let page: PdfPage = field.page;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get page(): PdfPage {
        if (!this._page) {
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            const dictionary: _PdfDictionary = (typeof widget !== 'undefined') ? widget._dictionary : this._dictionary;
            let document: PdfDocument;
            if (this._crossReference) {
                document = this._crossReference._document;
            }
            let page: PdfPage;
            if (dictionary && dictionary.has('P')) {
                const ref: _PdfReference = dictionary.getRaw('P');
                if (ref && document) {
                    for (let i: number = 0; i < document.pageCount; i++) {
                        const entry: PdfPage = document.getPage(i);
                        if (entry && entry._ref === ref) {
                            page = entry;
                            break;
                        }
                    }
                }
            }
            if (!page && document) {
                const widgetRef: _PdfReference = (typeof widget !== 'undefined') ? widget._ref : this._ref;
                if (!page && widgetRef) {
                    page = _findPage(document, widgetRef);
                }
                if (!page && this._kids && this._kids.length > 0) {
                    for (let i: number = 0; i < this._kids.length; i++) {
                        page = _findPage(document, this._kids[<number>i]);
                        if (page) {
                            break;
                        }
                    }
                }
            }
            this._page = page;
        }
        return this._page;
    }
    /**
     * Gets the boolean flag indicating whether the form field have been flattened or not.
     *
     * @returns {boolean} Flatten.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first field
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the boolean flag indicating whether the form field have been flattened or not.
     * let flatten: boolean = field.flatten;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get flatten(): boolean {
        return this._flatten;
    }
    /**
     * Sets the boolean flag indicating whether the form field have been flattened or not.
     *
     * @param {boolean} value Flatten.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first field
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the boolean flag indicating whether the form field have been flattened or not.
     * field.flatten = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set flatten(value: boolean) {
        this._flatten = value;
    }
    get _grayBrush(): PdfBrush {
        if (!this._gray) {
            this._gray = new PdfBrush({r: 128, g: 128, b: 128});
        }
        return this._gray;
    }
    get _silverBrush(): PdfBrush {
        if (!this._silver) {
            this._silver = new PdfBrush({r: 198, g: 198, b: 198});
        }
        return this._silver;
    }
    get _whiteBrush(): PdfBrush {
        if (!this._white) {
            this._white = new PdfBrush({r: 255, g: 255, b: 255});
        }
        return this._white;
    }
    get _blackBrush(): PdfBrush {
        if (!this._black) {
            this._black = new PdfBrush({r: 0, g: 0, b: 0});
        }
        return this._black;
    }
    get _kidsCount(): number {
        return this._kids ? this._kids.length : 0;
    }
    get _hasBackColor(): boolean {
        if (this._isLoaded) {
            let mkDictionary: _PdfDictionary = this._mkDictionary;
            if (!mkDictionary) {
                const item: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
                if (item && item._dictionary.has('MK')) {
                    mkDictionary = item._dictionary.get('MK');
                }
            }
            return (mkDictionary && mkDictionary.has('BG'));
        } else {
            return !this._isTransparentBackColor;
        }
    }
    get _hasBorderColor(): boolean {
        if (this._isLoaded) {
            let mkDictionary: _PdfDictionary = this._mkDictionary;
            if (!mkDictionary) {
                const item: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
                if (item && item._dictionary.has('MK')) {
                    mkDictionary = item._dictionary.get('MK');
                }
            }
            return (mkDictionary && mkDictionary.has('BC'));
        } else {
            return !this._isTransparentBorderColor;
        }
    }
    _parseBackColor(hasTransparency: boolean): PdfColor {
        let value: PdfColor;
        if ((!hasTransparency) || ((this._isLoaded && this._hasBackColor) || (!this._isLoaded && !this._isTransparentBackColor))) {
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            if (widget && widget.backColor) {
                value = widget.backColor;
            } else if (this._mkDictionary) {
                const mkDict: _PdfDictionary = this._mkDictionary;
                if (mkDict && mkDict.has('BG')) {
                    const bgArray: number[] = mkDict.getArray('BG');
                    if (bgArray) {
                        value = _parseColor(bgArray);
                    }
                }
            }
            if (typeof value === 'undefined' || value === null) {
                value = {r: 255, g: 255, b: 255};
            }
        }
        return value;
    }
    _parseBorderColor(hasTransparency: boolean): PdfColor {
        let value: PdfColor;
        if ((!hasTransparency) || ((this._isLoaded && this._hasBorderColor) || (!this._isLoaded && !this._isTransparentBorderColor))) {
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            if (widget && widget.borderColor) {
                value = widget.borderColor;
            } else if (this._mkDictionary) {
                const mkDict: _PdfDictionary = this._mkDictionary;
                if (mkDict.has('BC')) {
                    const bgArray: number[] = mkDict.getArray('BC');
                    if (bgArray) {
                        value = _parseColor(bgArray);
                    }
                }
            }
            if (value === null || typeof value === 'undefined') {
                value = {r: 0, g: 0, b: 0};
            }
        }
        return value;
    }
    _updateBackColor(value: PdfColor, hasTransparency: boolean = false): void {
        if (hasTransparency && _isNullOrUndefined(value) && value.isTransparent) {
            this._isTransparentBackColor = true;
            if (this._dictionary && this._dictionary.has('BG')) {
                delete this._dictionary._map.BG;
            }
            const mkDictionary: _PdfDictionary = this._mkDictionary;
            if (mkDictionary && mkDictionary.has('BG')) {
                delete mkDictionary._map.BG;
                this._dictionary._updated = true;
            }
            const item: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            if (item) {
                item.backColor = value;
            }
        } else {
            this._isTransparentBackColor = false;
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            if (widget && widget.backColor !== value) {
                widget.backColor = value;
            } else {
                const mkDictionary: _PdfDictionary = this._mkDictionary;
                if (typeof mkDictionary === 'undefined') {
                    const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
                    dictionary.update('BG', [Number.parseFloat((value.r / 255).toFixed(3)),
                        Number.parseFloat((value.g / 255).toFixed(3)),
                        Number.parseFloat((value.b / 255).toFixed(3))]);
                    this._dictionary.update('MK', dictionary);
                } else if (!mkDictionary.has('BG') || _parseColor(mkDictionary.getArray('BG')) !== value) {
                    mkDictionary.update('BG', [Number.parseFloat((value.r / 255).toFixed(3)),
                        Number.parseFloat((value.g / 255).toFixed(3)),
                        Number.parseFloat((value.b / 255).toFixed(3))]);
                    this._dictionary._updated = true;
                }
            }
        }
    }
    _updateBorderColor(value: PdfColor, hasTransparency: boolean = false): void {
        if (hasTransparency && value.isTransparent) {
            this._isTransparentBorderColor = true;
            if (this._dictionary.has('BC')) {
                delete this._dictionary._map.BC;
            }
            const mkDictionary: _PdfDictionary = this._mkDictionary;
            if (mkDictionary && mkDictionary.has('BC')) {
                delete mkDictionary._map.BC;
                if (this._dictionary.has('BS')) {
                    const bsDictionary: _PdfDictionary = this._dictionary.get('BS');
                    if (bsDictionary && bsDictionary.has('W')) {
                        delete bsDictionary._map.W;
                    }
                }
                this._dictionary._updated = true;
            }
            const item: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            if (item) {
                item.borderColor = value;
            }
        } else {
            this._isTransparentBorderColor = false;
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            if (widget && widget.borderColor !== value) {
                widget.borderColor = value;
            } else {
                const mkDictionary: _PdfDictionary = this._mkDictionary;
                if (typeof mkDictionary === 'undefined') {
                    const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
                    dictionary.update('BC', [Number.parseFloat((value.r / 255).toFixed(3)),
                        Number.parseFloat((value.g / 255).toFixed(3)),
                        Number.parseFloat((value.b / 255).toFixed(3))]);
                    this._dictionary.update('MK', dictionary);
                } else if (!mkDictionary.has('BC') || _parseColor(mkDictionary.getArray('BC')) !== value) {
                    mkDictionary.update('BC', [Number.parseFloat((value.r / 255).toFixed(3)),
                        Number.parseFloat((value.g / 255).toFixed(3)),
                        Number.parseFloat((value.b / 255).toFixed(3))]);
                    this._dictionary._updated = true;
                }
            }
        }
    }
    /**
     * Gets the field item as `PdfWidgetAnnotation` at the specified index.
     *
     * @param {number} index Item index.
     * @returns {PdfWidgetAnnotation} Loaded PDF form field item at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the loaded form field
     * let field: PdfField = document.form.fieldAt(0);
     * // Access the count of the field items.
     * let count: number = field.count;
     * // Access the first item
     * let item: PdfWidgetAnnotation = field.itemAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    itemAt(index: number): PdfWidgetAnnotation {
        let item: PdfWidgetAnnotation;
        if (index >= 0 && index < this._kidsCount) {
            if (this._parsedItems.has(index)) {
                item = this._parsedItems.get(index);
            } else {
                let dictionary: _PdfDictionary;
                const reference: _PdfReference = this._kids[<number>index];
                if (reference && reference instanceof _PdfReference) {
                    dictionary = this._crossReference._fetch(reference);
                }
                if (dictionary) {
                    item = PdfWidgetAnnotation._load(dictionary, this._crossReference);
                    item._ref = reference;
                    this._parsedItems.set(index, item);
                }
            }
        }
        return item;
    }
    /**
     * Sets the flag to indicate the new appearance creation.
     *
     * @param {boolean} value Set appearance.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Set boolean flag to create a new appearance stream for form fields.
     * document.form.fieldAt(0).setAppearance(true);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setAppearance(value: boolean): void {
        this._setAppearance = value;
    }
    /**
     * Gets the value associated with the specified key.
     *
     * @param {string} name Key.
     * @returns {string} Value associated with the key.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the value associated with the key 'Author'.
     * let value: string = document.form.fieldAt(0).getValue('Author');
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getValue(name: string): string {
        let value: string;
        if (this._dictionary && this._dictionary.has(name)) {
            const element: any = this._dictionary.get(name);// eslint-disable-line
            if (element !== null && typeof element !== 'undefined' && element instanceof _PdfName) {
                value = element.name;
            } else if (typeof element === 'string') {
                value = element;
            } else {
                throw new Error('PdfException: ' + name + ' is not found');
            }
        } else {
            throw new Error('PdfException: ' + name + ' is not found');
        }
        return value;
    }
    /**
     * Sets the value associated with the specified key.
     *
     * @param {string} name Key.
     * @param {string} value Value associated with the key..
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Set custom value
     * field.setValue('Author', 'John');
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setValue(name: string, value: string): void {
        if (name && name !== '' && value && value !== '') {
            this._dictionary.update(name, value);
        }
    }
    /**
     * Remove the form field item from the specified index.
     *
     * @param {number} index Item index to remove.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Remove the first item of the form field
     * field.removeItemAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removeItemAt(index: number): void {
        if (this._dictionary !== null && typeof this._dictionary !== 'undefined' && this._dictionary.has('Kids') && this.itemsCount > 0) {
            const item: PdfWidgetAnnotation = this.itemAt(index);
            if (item && item._ref) {
                const page: PdfPage = item._getPage();
                if (page) {
                    page._removeAnnotation(item._ref);
                }
                this._kids.splice(index, 1);
                this._dictionary.set('Kids', this._kids);
                this._dictionary._updated = true;
                this._parsedItems.delete(index);
                if (this._parsedItems.size > 0) {
                    const parsedItems: Map<number, PdfWidgetAnnotation> = new Map<number, PdfWidgetAnnotation>();
                    this._parsedItems.forEach((value: PdfWidgetAnnotation, key: number) => {
                        if (key > index) {
                            parsedItems.set(key - 1, value);
                        } else {
                            parsedItems.set(key, value);
                        }
                    });
                    this._parsedItems = parsedItems;
                }
            }
        }
    }
    /**
     * Remove the specified form field item.
     *
     * @param {PdfWidgetAnnotation} item Item to remove.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Remove the first item of the form field
     * field.removeItem(field.itemAt(0));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removeItem(item: PdfWidgetAnnotation): void {
        if (item && item._ref) {
            const index: number = this._kids.indexOf(item._ref);
            if (index !== -1) {
                this.removeItemAt(index);
            }
        }
    }
    get _fieldFlags(): _FieldFlag {
        if (typeof this._flags === 'undefined') {
            this._flags = _getInheritableProperty(this._dictionary, 'Ff', false, true, 'Parent');
            if (typeof this._flags === 'undefined') {
                this._flags = _FieldFlag.default;
            }
        }
        return this._flags;
    }
    set _fieldFlags(value: _FieldFlag) {
        if (this._fieldFlags !== value) {
            this._flags = value;
            this._dictionary.update('Ff', value as number);
        }
    }
    get _defaultAppearance(): _PdfDefaultAppearance {
        if (typeof this._da === 'undefined') {
            const da: string = _getInheritableProperty(this._dictionary, 'DA', false, true, 'Parent');
            if (da && da !== '') {
                this._da = new _PdfDefaultAppearance(da);
            }
        }
        return this._da;
    }
    get _mkDictionary(): _PdfDictionary {
        let value: _PdfDictionary;
        if (this._dictionary && this._dictionary.has('MK')) {
            value = this._dictionary.get('MK');
        }
        return value;
    }
    _updateBorder(dictionary: _PdfDictionary, value: PdfInteractiveBorder): void {
        let bs: _PdfDictionary;
        let isNew: boolean = false;
        if (dictionary && dictionary.has('BS')) {
            bs = dictionary.get('BS');
        } else {
            bs = new _PdfDictionary(this._crossReference);
            dictionary.update('BS', bs);
            isNew = true;
        }
        if (typeof value.width !== 'undefined') {
            bs.update('W', value.width);
            dictionary._updated = true;
        } else if (isNew) {
            bs.update('W', 0);
        }
        if (typeof value.style !== 'undefined') {
            bs.update('S', _mapBorderStyle(value.style));
            dictionary._updated = true;
        } else if (isNew) {
            bs.update('S', _mapBorderStyle(PdfBorderStyle.solid));
        }
        if (typeof value.dash !== 'undefined') {
            bs.update('D', value.dash);
            dictionary._updated = true;
        }
    }
    abstract _doPostProcess(isFlatten?: boolean): void;
    _checkFieldFlag(dictionary: _PdfDictionary): boolean {
        let flag: number;
        if (dictionary && dictionary instanceof _PdfDictionary) {
            flag = dictionary.get('F');
        }
        return (typeof flag !== 'undefined' && flag === 6);
    }
    _initializeFont(font: PdfFont): void {
        this._font = font;
        const document: PdfDocument = this._crossReference._document;
        let resource: _PdfDictionary;
        if (document) {
            if (document.form._dictionary.has('DR')) {
                resource = document.form._dictionary.get('DR');
            } else {
                resource = new _PdfDictionary(this._crossReference);
            }
        }
        let fontDict: _PdfDictionary;
        let isReference: boolean = false;
        if (resource && resource.has('Font')) {
            const obj: any = resource.getRaw('Font'); // eslint-disable-line
            if (obj && obj instanceof _PdfReference) {
                isReference = true;
                fontDict = this._crossReference._fetch(obj);
            } else if (obj instanceof _PdfDictionary) {
                fontDict = obj;
            }
        }
        if (!fontDict) {
            fontDict = new _PdfDictionary(this._crossReference);
            resource.update('Font', fontDict);
        }
        let keyName: _PdfName;
        let reference: _PdfReference;
        let hasFont: boolean = false;
        if (this._font && (this._font._key !== null && typeof this._font._key !== 'undefined') && this._font._reference) {
            keyName = _PdfName.get(this._font._key);
            reference = this._font._reference;
            hasFont = true;
        } else {
            keyName = _PdfName.get(_getNewGuidString());
            reference = this._crossReference._getNextReference();
            if (this._font) {
                this._font._key = keyName.name;
                this._font._reference = reference;
            }
        }
        if (reference && !hasFont) {
            if (font instanceof PdfTrueTypeFont) {
                if (this._font._pdfFontInternals) {
                    this._crossReference._cacheMap.set(reference, this._font._pdfFontInternals);
                    this._font._reference = reference;
                }
            } else if (this._font._dictionary) {
                this._crossReference._cacheMap.set(reference, this._font._dictionary);
                fontDict.update(keyName.name, reference);
                resource._updated = true;
                document.form._dictionary.update('DR', resource);
                document.form._dictionary._updated = true;
            }
        }
        fontDict.update(keyName.name, reference);
        resource._updated = true;
        document.form._dictionary.update('DR', resource);
        document.form._dictionary._updated = true;
        this._fontName = keyName.name;
        const defaultAppearance: _PdfDefaultAppearance = new _PdfDefaultAppearance();
        defaultAppearance.fontName = this._fontName;
        defaultAppearance.fontSize = this._font._size;
        defaultAppearance.color = this.color ? this.color : {r: 0, g: 0, b: 0};
        if (this._dictionary.has('Kids')) {
            const widgetDictionary: _PdfDictionary[] = this._dictionary.getArray('Kids');
            widgetDictionary.forEach((dictionary: _PdfDictionary, index: number) => {
                const widget: PdfWidgetAnnotation = this.itemAt(index);
                dictionary.update('DA', defaultAppearance.toString());
                if (widget) {
                    widget._da = defaultAppearance;
                }
            });
        } else if (this._dictionary.has('Subtype') && this._dictionary.get('Subtype').name === 'Widget') {
            this._dictionary.update('DA', defaultAppearance.toString());
        }
        if (isReference) {
            resource._updated = true;
        }
    }
    _drawRectangularControl(g: PdfGraphics, parameter: _PaintParameter): void {
        g.drawRectangle(parameter.bounds, parameter.backBrush);
        this._drawBorder(g, parameter.bounds, parameter.borderPen, parameter.borderStyle, parameter.borderWidth);
        switch (parameter.borderStyle) {
        case PdfBorderStyle.inset:
            this._drawLeftTopShadow(g, parameter.bounds, parameter.borderWidth, this._grayBrush);
            this._drawRightBottomShadow(g, parameter.bounds, parameter.borderWidth, this._silverBrush);
            break;
        case PdfBorderStyle.beveled:
            this._drawLeftTopShadow(g, parameter.bounds, parameter.borderWidth, this._whiteBrush);
            this._drawRightBottomShadow(g, parameter.bounds, parameter.borderWidth, parameter.shadowBrush);
            break;
        }
    }
    _drawBorder(g: PdfGraphics, bounds: Rectangle, borderPen: PdfPen, style: PdfBorderStyle, borderWidth: number): void {
        if (borderPen && borderWidth > 0) {
            if (style === PdfBorderStyle.underline) {
                g.drawLine(borderPen,
                           {x: bounds.x, y: bounds.x + bounds.height - borderWidth / 2},
                           {x: bounds.x + bounds.width, y: bounds.y + bounds.height - borderWidth / 2});
            } else {
                const actual: Rectangle = {x: bounds.x + borderWidth / 2,
                    y: bounds.y + borderWidth / 2,
                    width: bounds.width - borderWidth,
                    height: bounds.height - borderWidth};
                g.drawRectangle(actual, borderPen);
            }
        }
    }
    _drawLeftTopShadow(g: PdfGraphics, bounds: Rectangle, width: number, brush: PdfBrush): void {
        const path: PdfPath = new PdfPath();
        const points: Array<Point> = [];
        points.push({x: bounds.x + width, y: bounds.y + width});
        points.push({x: bounds.x + width, y: (bounds.y + bounds.height) - width});
        points.push({x: bounds.x + 2 * width, y: (bounds.y + bounds.height) - 2 * width});
        points.push({x: bounds.x + 2 * width, y: bounds.y + 2 * width});
        points.push({x: (bounds.x + bounds.width) - 2 * width, y: bounds.y + 2 * width});
        points.push({x: (bounds.x + bounds.width) - width, y: bounds.y + width});
        path.addPolygon(points);
        g.drawPath(path, brush);
    }
    _drawRightBottomShadow(g: PdfGraphics, bounds: Rectangle, width: number, brush: PdfBrush): void {
        const path: PdfPath = new PdfPath();
        const points: Array<Point> = [];
        points.push({x: bounds.x + width, y: (bounds.y + bounds.height) - width});
        points.push({x: bounds.x + 2 * width, y: (bounds.y + bounds.height) - 2 * width});
        points.push({x: (bounds.x + bounds.width) - 2 * width, y: (bounds.y + bounds.height) - 2 * width});
        points.push({x: (bounds.x + bounds.width) - 2 * width, y: bounds.y + 2 * width});
        points.push({x: bounds.x + bounds.width - width, y: bounds.y + width});
        points.push({x: (bounds.x + bounds.width) - width, y: (bounds.y + bounds.height) - width});
        path.addPolygon(points);
        g.drawPath(path, brush);
    }
    _drawRadioButton(graphics: PdfGraphics, parameter: _PaintParameter, checkSymbol: string, state: _PdfCheckFieldState): void {
        if (checkSymbol === 'l') {
            const bounds: Rectangle = parameter.bounds;
            let diameter: number = bounds.width;
            if (this._enableGrouping) {
                diameter = Math.min(bounds.width, bounds.height);
            }
            switch (state) {
            case _PdfCheckFieldState.checked:
            case _PdfCheckFieldState.unchecked:
                graphics.drawEllipse({x: bounds.x, y: bounds.y, width: diameter, height: bounds.height}, parameter.backBrush);
                break;
            case _PdfCheckFieldState.pressedChecked:
            case _PdfCheckFieldState.pressedUnchecked:
                if ((parameter.borderStyle === PdfBorderStyle.beveled) || (parameter.borderStyle === PdfBorderStyle.underline)) {
                    graphics.drawEllipse(bounds, parameter.backBrush);
                } else {
                    graphics.drawEllipse({x: bounds.x, y: bounds.y, width: diameter, height: bounds.height}, parameter.shadowBrush);
                }
                break;
            }
            this._drawRoundBorder(graphics, bounds, parameter.borderPen, parameter.borderWidth);
            this._drawRoundShadow(graphics, parameter, state);
            if (state === _PdfCheckFieldState.checked || state === _PdfCheckFieldState.pressedChecked) {
                const outward: number[] = [bounds.x + parameter.borderWidth / 2,
                    bounds.y + parameter.borderWidth / 2,
                    diameter - parameter.borderWidth,
                    bounds.height - parameter.borderWidth];
                graphics.drawEllipse({x: outward[0] + (outward[2] / 4),
                    y: outward[1] + (outward[2] / 4),
                    width: outward[2] - (outward[2] / 2),
                    height: outward[3] - (outward[2] / 2)}, parameter.foreBrush);
            }
        } else {
            this._drawCheckBox(graphics, parameter, checkSymbol, state);
        }
    }
    _drawRoundBorder(graphics: PdfGraphics, bounds: Rectangle, borderPen: PdfPen, borderWidth: number): void {
        if (bounds.x !== 0 || bounds.y !== 0 || bounds.width !== 0 || bounds.height !== 0) {
            graphics.drawEllipse({x: bounds.x + borderWidth / 2, y: bounds.y + borderWidth / 2, width: (this._enableGrouping ?
                Math.min(bounds.width, bounds.height) : bounds.width) - borderWidth, height: bounds.height - borderWidth}, borderPen);
        }
    }
    _drawRoundShadow(graphics: PdfGraphics, parameter: _PaintParameter, state: _PdfCheckFieldState): void {
        const borderWidth: number = parameter.borderWidth;
        const inflateValue: number = -1.5 * borderWidth;
        const x: number = parameter.bounds.x + inflateValue;
        const y: number = parameter.bounds.y + inflateValue;
        const width: number = parameter.bounds.width + (2 * inflateValue);
        const height: number = parameter.bounds.height + (2 * inflateValue);
        const shadowBrush: PdfBrush = parameter.shadowBrush;
        if (shadowBrush) {
            const shadowColor: PdfColor = shadowBrush._color;
            let leftTop: PdfPen;
            let rightBottom: PdfPen;
            switch (parameter.borderStyle) {
            case PdfBorderStyle.beveled:
                switch (state) {
                case _PdfCheckFieldState.pressedChecked:
                case _PdfCheckFieldState.pressedUnchecked:
                    leftTop = new PdfPen(shadowColor, borderWidth);
                    rightBottom = new PdfPen({r: 255, g: 255, b: 255}, borderWidth);
                    break;
                case _PdfCheckFieldState.checked:
                case _PdfCheckFieldState.unchecked:
                    leftTop = new PdfPen({r: 255, g: 255, b: 255}, borderWidth);
                    rightBottom = new PdfPen(shadowColor, borderWidth);
                    break;
                }
                break;
            case PdfBorderStyle.inset:
                switch (state) {
                case _PdfCheckFieldState.pressedChecked:
                case _PdfCheckFieldState.pressedUnchecked:
                    leftTop = new PdfPen({r: 0, g: 0, b: 0}, borderWidth);
                    rightBottom = new PdfPen({r: 0, g: 0, b: 0}, borderWidth);
                    break;
                case _PdfCheckFieldState.checked:
                case _PdfCheckFieldState.unchecked:
                    leftTop = new PdfPen({r: 128, g: 128, b: 128}, borderWidth);
                    rightBottom = new PdfPen({r: 192, g: 192, b: 192}, borderWidth);
                    break;
                }
                break;
            }
            if (leftTop && rightBottom) {
                graphics.drawArc({x: x, y: y, width: width, height: height}, 135, 180, leftTop);
                graphics.drawArc({x: x, y: y, width: width, height: height}, -45, 180, rightBottom);
            }
        }
    }
    _drawCheckBox(graphics: PdfGraphics,
                  parameter: _PaintParameter,
                  checkSymbol: string,
                  state: _PdfCheckFieldState,
                  font?: PdfFont): void {
        switch (state) {
        case _PdfCheckFieldState.unchecked:
        case _PdfCheckFieldState.checked:
            if (parameter.borderPen || parameter.backBrush) {
                graphics.drawRectangle(parameter.bounds, parameter.backBrush);
            }
            break;
        case _PdfCheckFieldState.pressedChecked:
        case _PdfCheckFieldState.pressedUnchecked:
            if ((parameter.borderStyle === PdfBorderStyle.beveled || parameter.backBrush) ||
                (parameter.borderStyle === PdfBorderStyle.underline)) {
                if (parameter.borderPen || parameter.backBrush) {
                    graphics.drawRectangle(parameter.bounds, parameter.backBrush);
                }
            } else if (parameter.borderPen || parameter.shadowBrush) {
                graphics.drawRectangle(parameter.bounds, parameter.shadowBrush);
            }
            break;
        }
        let rectangle: Rectangle = parameter.bounds;
        this._drawBorder(graphics, parameter.bounds, parameter.borderPen, parameter.borderStyle, parameter.borderWidth);
        if ((state === _PdfCheckFieldState.pressedChecked) || (state === _PdfCheckFieldState.pressedUnchecked)) {
            switch (parameter.borderStyle) {
            case PdfBorderStyle.inset:
                this._drawLeftTopShadow(graphics, parameter.bounds, parameter.borderWidth, this._blackBrush);
                this._drawRightBottomShadow(graphics, parameter.bounds, parameter.borderWidth, this._whiteBrush);
                break;
            case PdfBorderStyle.beveled:
                this._drawLeftTopShadow(graphics, parameter.bounds, parameter.borderWidth, parameter.shadowBrush);
                this._drawRightBottomShadow(graphics, parameter.bounds, parameter.borderWidth, this._whiteBrush);
                break;
            }
        } else {
            switch (parameter.borderStyle) {
            case PdfBorderStyle.inset:
                this._drawLeftTopShadow(graphics, parameter.bounds, parameter.borderWidth, this._grayBrush);
                this._drawRightBottomShadow(graphics, parameter.bounds, parameter.borderWidth, this._silverBrush);
                break;
            case PdfBorderStyle.beveled:
                this._drawLeftTopShadow(graphics, parameter.bounds, parameter.borderWidth, this._whiteBrush);
                this._drawRightBottomShadow(graphics, parameter.bounds, parameter.borderWidth, parameter.shadowBrush);
                break;
            }
        }
        let yOffset: number = 0;
        let size: number = 0;
        switch (state) {
        case _PdfCheckFieldState.pressedChecked:
        case _PdfCheckFieldState.checked:
            if (!font)  {
                const extraBorder: boolean = parameter.borderStyle === PdfBorderStyle.beveled ||
                    parameter.borderStyle === PdfBorderStyle.inset;
                let borderWidth: number = parameter.borderWidth;
                if (extraBorder) {
                    borderWidth *= 2;
                }
                const xPosition: number = Math.max((extraBorder ? 2 * parameter.borderWidth : parameter.borderWidth), 1);
                const xOffset: number = Math.min(borderWidth, xPosition);
                size = (parameter.bounds.width > parameter.bounds.height) ? parameter.bounds.height : parameter.bounds.width;
                const fontSize: number = size - 2 * xOffset;
                font = new PdfStandardFont(PdfFontFamily.zapfDingbats, fontSize);
                if (parameter.bounds.width > parameter.bounds.height) {
                    yOffset = ((parameter.bounds.height - font._getHeight()) / 2);
                }
            } else {
                font = new PdfStandardFont(PdfFontFamily.zapfDingbats, font._size);
            }
            if (size === 0) {
                size = parameter.bounds.height;
            }
            if (parameter.pageRotationAngle !== PdfRotationAngle.angle0 || parameter.rotationAngle > 0) {
                const state: PdfGraphicsState = graphics.save();
                const size: Size = graphics._size;
                if (parameter.pageRotationAngle !== PdfRotationAngle.angle0) {
                    if (parameter.pageRotationAngle === PdfRotationAngle.angle90) {
                        graphics.translateTransform({x: size.height, y: 0});
                        graphics.rotateTransform(90);
                        const y: number = size.height - (rectangle.x + rectangle.width);
                        const x: number = rectangle.y;
                        rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                    } else if (parameter.pageRotationAngle === PdfRotationAngle.angle180) {
                        graphics.translateTransform({x: size.width, y: size.height});
                        graphics.rotateTransform(-180);
                        const x: number = size.width - (rectangle.x + rectangle.width);
                        const y: number = size.height - (rectangle.y + rectangle.height);
                        rectangle = {x: x, y: y, width: rectangle.width, height: rectangle.height};
                    } else if (parameter.pageRotationAngle === PdfRotationAngle.angle270) {
                        graphics.translateTransform({x: 0, y: size.width});
                        graphics.rotateTransform(270);
                        const x: number = size.width - (rectangle.y + rectangle.height);
                        const y: number = rectangle.x;
                        rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                    }
                }
                if (parameter.rotationAngle > 0) {
                    if (parameter.rotationAngle === 90) {
                        if (parameter.pageRotationAngle === PdfRotationAngle.angle90) {
                            graphics.translateTransform({x: 0, y: size.height});
                            graphics.rotateTransform(-90);
                            const x: number = size.height - (rectangle.y + rectangle.height);
                            const y: number = rectangle.x;
                            rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                        } else {
                            if (rectangle.width > rectangle.height) {
                                graphics.translateTransform({x: 0, y: size.height});
                                graphics.rotateTransform(-90);
                                rectangle = parameter.bounds;
                            } else {
                                const z: number = rectangle.x;
                                rectangle.x = -(rectangle.y + rectangle.height);
                                rectangle.y = z;
                                const height: number = rectangle.height;
                                rectangle.height = rectangle.width > font._getHeight() ? rectangle.width : font._getHeight();
                                rectangle.width = height;
                                graphics.rotateTransform(-90);
                            }
                        }
                    } else if (parameter.rotationAngle === 270) {
                        graphics.translateTransform({x: size.width, y: 0});
                        graphics.rotateTransform(-270);
                        const x: number = rectangle.y;
                        const y: number = size.width - (rectangle.x + rectangle.width);
                        rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                    } else if (parameter.rotationAngle === 180) {
                        graphics.translateTransform({x: size.width, y: size.height});
                        graphics.rotateTransform(-180);
                        const x: number = size.width - (rectangle.x + rectangle.width);
                        const y: number = size.height - (rectangle.y + rectangle.height);
                        rectangle = {x: x, y: y, width: rectangle.width, height: rectangle.height};
                    }
                    graphics.drawString(checkSymbol,
                                        font,
                                        {x: rectangle.x, y: rectangle.y - yOffset, width: rectangle.width, height: rectangle.height},
                                        null,
                                        parameter.foreBrush,
                                        new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle));
                    graphics.restore(state);
                } else {
                    graphics.drawString(checkSymbol,
                                        font,
                                        {x: rectangle.x, y: rectangle.y - yOffset, width: rectangle.width, height: rectangle.height},
                                        null,
                                        parameter.foreBrush,
                                        new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle));
                }
                break;
            }
        }
    }
    _addToKid(item: PdfWidgetAnnotation): void {
        if (this._dictionary && this._dictionary.has('Kids')) {
            this._kids = this._dictionary.get('Kids');
        } else {
            this._kids = [];
            this._dictionary.update('Kids', this._kids);
            this._parsedItems = new Map<number, PdfWidgetAnnotation>();
        }
        if (this._kids.indexOf(item._ref) === -1) {
            const currentIndex: number = this._kidsCount;
            item._index = currentIndex;
            this._kids.push(item._ref);
            this._parsedItems.set(currentIndex, item);
        }
    }
    _drawTemplate(template: PdfTemplate, page: PdfPage, bounds: {x: number, y: number, width: number, height: number}): void {
        if (template && page) {
            const graphics: PdfGraphics = page.graphics;
            graphics.save();
            if (page.rotation === PdfRotationAngle.angle90) {
                graphics.translateTransform({x: graphics._size.height, y: 0});
                graphics.rotateTransform(90);
            } else if (page.rotation === PdfRotationAngle.angle180) {
                graphics.translateTransform({x: graphics._size.width, y: graphics._size.height});
                graphics.rotateTransform(-180);
            } else if (page.rotation === PdfRotationAngle.angle270) {
                graphics.translateTransform({x: 0, y: graphics._size.width});
                graphics.rotateTransform(270);
            }
            graphics._sw._setTextRenderingMode(_TextRenderingMode.fill);
            graphics.drawTemplate(template, bounds);
            graphics.restore();
        }
    }
    _addToOptions(item: PdfListFieldItem, field: PdfListField): void {
        if (field instanceof PdfListBoxField) {
            field._listValues.push(item._text);
        }
        field._options.push([item._value, item._text]);
        field._dictionary.set('Opt', field._options);
        field._dictionary._updated = true;
        if (!item._isFont && item._pdfFont) {
            this._initializeFont(item._pdfFont);
        }
    }
    _addAppearance(dictionary: _PdfDictionary, template: PdfTemplate, key: string): void {
        let appearance: _PdfDictionary = new _PdfDictionary();
        if (dictionary && dictionary.has('AP')) {
            appearance = dictionary.get('AP');
            _removeDuplicateReference(dictionary.get('AP'), this._crossReference, key);
        } else {
            appearance = new _PdfDictionary(this._crossReference);
            dictionary.update('AP', appearance);
        }
        const reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, template._content);
        appearance.update(key, reference);
    }
    _rotateTextBox(rect: Rectangle, size: Size, angle: PdfRotationAngle): Rectangle {
        let rectangle: Rectangle = {x: 0, y: 0, width: 0, height: 0};
        if (angle === PdfRotationAngle.angle180) {
            rectangle = {x: size.width - (rect.x + rect.width),
                y: size.height - (rect.y + rect.height),
                width: rect.width,
                height: rect.height};
        } else if (angle === PdfRotationAngle.angle270) {
            rectangle = {x: rect.y, y: size.width - (rect.x + rect.width), width: rect.height, height: rect.width};
        } else if (angle === PdfRotationAngle.angle90) {
            rectangle = {x: size.height - (rect.y + rect.height), y: rect.x, width: rect.height, height: rect.width};
        }
        return rectangle;
    }
    _checkIndex(value: number, length: number): void {
        if (value < 0 || (value !== 0 && value >= length)) {
            throw Error('Index out of range.');
        }
    }
    _getAppearanceStateValue(): string {
        let value: string;
        if (this._dictionary && this._dictionary.has('Kids')) {
            for (let i: number = 0; i < this._kidsCount; i++) {
                const item: PdfWidgetAnnotation = this.itemAt(i);
                if (item && item._dictionary && item._dictionary.has('AS')) {
                    const state: _PdfName = item._dictionary.get('AS');
                    if (state && state.name !== 'Off') {
                        value = state.name;
                        break;
                    }
                }
            }
        } else if (this._dictionary && this._dictionary.has('AS')) {
            const state: _PdfName = this._dictionary.get('AS');
            if (state && state.name !== 'Off') {
                value = state.name;
            }
        }
        return value;
    }
    _getTextAlignment(): PdfTextAlignment {
        if (this._textAlignment === null || typeof this._textAlignment === 'undefined') {
            if (this._isLoaded) {
                const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
                if (widget && widget._dictionary && widget._dictionary.has('Q')) {
                    this._textAlignment = widget._dictionary.get('Q');
                } else if (this._dictionary.has('Q')) {
                    this._textAlignment = this._dictionary.get('Q');
                } else {
                    this._textAlignment = PdfTextAlignment.left;
                }
            } else {
                this._textAlignment = PdfTextAlignment.left;
            }
        }
        return this._textAlignment;
    }
    _setTextAlignment(value: PdfTextAlignment): void {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (this._isLoaded && !this.readOnly) {
            if (widget && widget._dictionary) {
                widget._dictionary.update('Q', value);
            } else {
                this._dictionary.update('Q', value);
            }
        }
        if (!this._isLoaded && this._textAlignment !== value) {
            if (widget && widget._dictionary) {
                widget._dictionary.update('Q', value as number);
            } else if (this._dictionary) {
                this._dictionary.update('Q', value as number);
            }
        }
        this._textAlignment = value;
        this._stringFormat = new PdfStringFormat(value, PdfVerticalAlignment.middle);
    }
    _parseItems(): PdfWidgetAnnotation[] {
        const collection: PdfWidgetAnnotation[] = [];
        for (let i: number = 0; i < this.itemsCount; i++) {
            collection.push(this.itemAt(i));
        }
        return collection;
    }
}
/**
 * `PdfTextBoxField` class represents the text box field objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access text box field
 * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfTextBoxField extends PdfField {
    _text: string;
    _defaultValue: string;
    _spellCheck: boolean;
    _insertSpaces: boolean;
    _multiline: boolean;
    _password: boolean;
    _scrollable: boolean;
    _autoResizeText: boolean = false;
    _isTextChanged: boolean = false;
    /**
     * Represents a text box field of the PDF document.
     *
     * @private
     */
    constructor()
    /**
     * Represents a text box field of the PDF document.
     *
     * @param {PdfPage} page The page where the field is drawn.
     * @param {string} name The name of the field.
     * @param {Rectangle} bounds The bounds of the field.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new text box field
     * let field: PdfTextBoxField = new PdfTextBoxField(page, 'FirstName', {x: 10, y: 10, width: 100, height: 50});
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, bounds: Rectangle)
    /**
     * Represents a text box field of the PDF document.
     *
     * @param {PdfPage} page The page where the field is drawn.
     * @param {string} name The unique name of the field.
     * @param {Rectangle} bounds The bounds of the field.
     * @param {object} [properties] Optional customization properties.
     * @param {string} [properties.toolTip] Tooltip text.
     * @param {PdfColor} [properties.color] Fore color (text color) of the field (RGB).
     * @param {PdfColor} [properties.backColor] Background color of the field.
     * @param {PdfColor} [properties.borderColor] Border color.
     * @param {PdfInteractiveBorder} [properties.border] Border settings (width, style, dash).
     * @param {string} [properties.text] Initial text value of the field.
     * @param {PdfFont} [properties.font] Font applied to the field text.
     *
     * ```typescript
     * // Load an existing PDF
     * const document = new PdfDocument(data);
     * // Gets the first page of the document
     * const page = document.getPage(0);
     * // Add new textbox field into PDF form
     * document.form.add(new PdfTextBoxField(
     *   page,
     *   'FirstName',
     *   { x: 50, y: 600, width: 200, height: 22 },
     *   {
     *     toolTip: 'Enter your first name',
     *     color: { r: 0, g: 0, b: 0 },
     *     backColor: { r: 255, g: 255, b: 255 },
     *     borderColor: { r: 0, g: 122, b: 204 },
     *     border: new PdfInteractiveBorder({width: 1, style: PdfBorderStyle.solid}),
     *     text: 'John',
     *     font: document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular)
     *   }
     * ));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        text?: string,
        font?: PdfFont
    })
    constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        text?: string,
        font?: PdfFont
    }) {
        super();
        if (page && name && bounds) {
            this._initialize(page, name, bounds);
        }
        if (properties) {
            if ('text' in properties && _isNullOrUndefined(properties.text)) {
                this.text = properties.text;
            }
            if ('toolTip' in properties && _isNullOrUndefined(properties.toolTip)) {
                this.toolTip = properties.toolTip;
            }
            if ('color' in properties && _isNullOrUndefined(properties.color)) {
                this.color = properties.color;
            }
            if ('border' in properties && _isNullOrUndefined(properties.border)) {
                this.border = properties.border;
            }
            if ('backColor' in properties && _isNullOrUndefined(properties.backColor)) {
                this.backColor = properties.backColor;
            }
            if ('borderColor' in properties && _isNullOrUndefined(properties.borderColor)) {
                this.borderColor = properties.borderColor;
            }
            if ('font' in properties && _isNullOrUndefined(properties.font)) {
                this.font = properties.font;
            }
        }
    }
    /**
     * Parse an existing text box field.
     *
     * @private
     * @param {PdfForm} form Form object.
     * @param {_PdfDictionary} dictionary Field dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference object.
     * @param {_PdfReference} reference Field reference.
     * @returns {PdfTextBoxField} Text box field.
     */
    static _load(form: PdfForm,
                 dictionary: _PdfDictionary,
                 crossReference: _PdfCrossReference,
                 reference: _PdfReference): PdfTextBoxField {
        const field: PdfTextBoxField = new PdfTextBoxField();
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
        return field;
    }
    /**
     * Gets the value of the text box field.
     *
     * @returns {string} Text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets the text value from text box field
     * let text: string = field.text;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get text(): string {
        if (typeof this._text === 'undefined') {
            if (this._isLoaded) {
                let text: string = _getInheritableProperty(this._dictionary, 'V', false, true, 'Parent');
                if (text) {
                    this._text = _stringToPdfString(text);
                } else {
                    const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
                    if (widget) {
                        text = widget._dictionary.get('V');
                        if (text) {
                            this._text = _stringToPdfString(text);
                        }
                    }
                }
            } else {
                this._text = '';
            }
        }
        return this._text;
    }
    /**
     * Sets the value of the text box field.
     *
     * @param {string} value Text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets the text value to text box field
     * field.text = 'Syncfusion';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set text(value: string) {
        if (this._isLoaded) {
            if (!this.readOnly) {
                if (!(this._dictionary.has('V') && this._dictionary.get('V') === value)) {
                    this._dictionary.update('V', value);
                }
                const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
                if (widget && !(widget._dictionary.has('V') && widget._dictionary.get('V') === value)) {
                    widget._dictionary.update('V', value);
                }
                this._text = value;
                this._isTextChanged = true;
            }
        } else if (this._text !== value) {
            this._dictionary.update('V', value);
            this._text = value;
        }
    }
    /**
     * Gets the text alignment in a text box.
     *
     * @returns {PdfTextAlignment} Text alignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets the text alignment from text box field
     * let alignment: PdfTextAlignment = field.textAlignment;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textAlignment(): PdfTextAlignment {
        return this._getTextAlignment();
    }
    /**
     * Sets the text alignment in a text box.
     *
     * @param {PdfTextAlignment} value Text alignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets the text alignment of form field as center
     * field.textAlignment = PdfTextAlignment.center;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textAlignment(value: PdfTextAlignment) {
        if (this._textAlignment !== value) {
            this._setTextAlignment(value);
        }
    }
    /**
     * Gets the default value of the field.
     *
     * @returns {string} Default value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets the default value from the text box field
     * let value: string = field.defaultValue;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get defaultValue(): string {
        if (typeof this._defaultValue === 'undefined') {
            const text: string = _getInheritableProperty(this._dictionary, 'DV', false, true, 'Parent');
            if (text) {
                this._defaultValue = text;
            }
        }
        return this._defaultValue;
    }
    /**
     * Sets the default value of the field.
     *
     * @param {string} value Default value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets the default value of the text box field
     * field.defaultValue = 'Syncfusion';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set defaultValue(value: string) {
        if (value !== this.defaultValue) {
            this._dictionary.update('DV', value);
            this._defaultValue = value;
        }
    }
    /**
     * Gets a value indicating whether this `PdfTextBoxField` is multiline.
     *
     * @returns {boolean} multiline.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets a value indicating whether this `PdfTextBoxField` is multiline.
     * let multiLine: boolean = field.multiLine;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get multiLine(): boolean {
        return (this._fieldFlags & _FieldFlag.multiLine) !== 0;
    }
    /**
     * Sets a value indicating whether this `PdfTextBoxField` is multiline.
     *
     * @param {boolean} value multiLine or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets a value indicating whether this `PdfTextBoxField` is multiline.
     * field.multiLine = false;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set multiLine(value: boolean) {
        if (value) {
            this._fieldFlags |= _FieldFlag.multiLine;
        } else {
            this._fieldFlags &= ~_FieldFlag.multiLine;
        }
        if (this._stringFormat) {
            this._stringFormat.lineAlignment = value ? PdfVerticalAlignment.top : PdfVerticalAlignment.middle;
        }
    }
    /**
     * Gets a value indicating whether this `PdfTextBoxField` is password.
     *
     * @returns {boolean} password.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets a value indicating whether this `PdfTextBoxField` is password.
     * let password: boolean = field.password;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get password(): boolean {
        return (this._fieldFlags & _FieldFlag.password) !== 0;
    }
    /**
     * Sets a value indicating whether this `PdfTextBoxField` is password.
     *
     * @param {boolean} value password or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets a value indicating whether this `PdfTextBoxField` is password.
     * field.password = false;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set password(value: boolean) {
        if (value) {
            this._fieldFlags |= _FieldFlag.password;
        } else {
            this._fieldFlags &= ~_FieldFlag.password;
        }
    }
    /**
     * Gets a value indicating whether this `PdfTextBoxField` is scrollable.
     *
     * @returns {boolean} scrollable.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets a value indicating whether this `PdfTextBoxField` is scrollable.
     * let scrollable: boolean = field.scrollable;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get scrollable(): boolean {
        return !((this._fieldFlags & _FieldFlag.doNotScroll) !== 0);
    }
    /**
     * Sets a value indicating whether this `PdfTextBoxField` is scrollable.
     *
     * @param {boolean} value scrollable or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets a value indicating whether this `PdfTextBoxField` is scrollable.
     * field.scrollable = false;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set scrollable(value: boolean) {
        if (value) {
            this._fieldFlags &= ~_FieldFlag.doNotScroll;
        } else {
            this._fieldFlags |= _FieldFlag.doNotScroll;
        }
    }
    /**
     * Gets a value indicating whether to check spelling.
     *
     * @returns {boolean} spellCheck.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets a value indicating whether to check spelling
     * let spellCheck: boolean = field.spellCheck;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get spellCheck(): boolean {
        return !((this._fieldFlags & _FieldFlag.doNotSpellCheck) !== 0);
    }
    /**
     * Sets a value indicating whether to check spelling.
     *
     * @param {boolean} value spellCheck or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets a value indicating whether to check spelling
     * field.spellCheck = false;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set spellCheck(value: boolean) {
        if (value) {
            this._fieldFlags &= ~_FieldFlag.doNotSpellCheck;
        } else {
            this._fieldFlags |= _FieldFlag.doNotSpellCheck;
        }
    }
    /**
     * Meaningful only if the MaxLength property is set and the Multiline, Password properties are false.
     * If set, the field is automatically divided into as many equally spaced positions, or combs,
     * as the value of MaxLength, and the text is laid out into those combs.
     *
     * @returns {boolean} insertSpaces.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets a value indicating whether this `PdfTextBoxField` is insertSpaces.
     * let insertSpaces: boolean = field.insertSpaces;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get insertSpaces(): boolean {
        const flags: _FieldFlag = this._fieldFlags;
        return ((_FieldFlag.comb & flags) !== 0) &&
               ((flags & _FieldFlag.multiLine) === 0) &&
               ((flags & _FieldFlag.password) === 0) &&
               ((flags & _FieldFlag.fileSelect) === 0);
    }
    /**
     * Meaningful only if the MaxLength property is set and the Multiline, Password properties are false.
     * If set, the field is automatically divided into as many equally spaced positions, or combs,
     * as the value of MaxLength, and the text is laid out into those combs.
     *
     * @param {boolean} value insertSpaces.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets a value indicating whether this `PdfTextBoxField` is insertSpaces.
     * field.insertSpaces = false;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set insertSpaces(value: boolean) {
        if (value) {
            this._fieldFlags |= _FieldFlag.comb;
        } else {
            this._fieldFlags &= ~_FieldFlag.comb;
        }
    }
    /**
     * Gets the highlight mode of the field.
     *
     * @returns {PdfHighlightMode} highlight mode.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets the highlight mode of text box field
     * let mode: PdfHighlightMode = field.highlightMode;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get highlightMode(): PdfHighlightMode {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        let mode: PdfHighlightMode;
        if (widget && typeof widget.highlightMode !== 'undefined') {
            mode = widget.highlightMode;
        } else if (this._dictionary && this._dictionary.has('H')) {
            const name: _PdfName = this._dictionary.get('H');
            mode = _mapHighlightMode(name.name);
        }
        return (typeof mode !== 'undefined') ? mode : PdfHighlightMode.noHighlighting;
    }
    /**
     * Sets the highlight mode of the field.
     *
     * @param {PdfHighlightMode} value highlight mode.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets the highlight mode of text box field as outline
     * field.highlightMode = PdfHighlightMode.outline;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set highlightMode(value: PdfHighlightMode) {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (widget && (typeof widget.highlightMode === 'undefined' || widget.highlightMode !== value)) {
            widget.highlightMode = value;
        } else if (!this._dictionary.has('H') || _mapHighlightMode(this._dictionary.get('H')) !== value) {
            this._dictionary.update('H', _reverseMapHighlightMode(value));
        }
    }
    /**
     * Gets the maximum length of the field, in characters.
     *
     * @returns {number} maximum length.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets the maximum length of the field, in characters.
     * let maxLength: number = field.maxLength;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get maxLength(): number {
        if (typeof this._maxLength === 'undefined') {
            const length: number = _getInheritableProperty(this._dictionary, 'MaxLen', false, true, 'Parent');
            this._maxLength = (typeof length !== 'undefined' && Number.isInteger(length)) ? length : 0;
        }
        return this._maxLength;
    }
    /**
     * Sets the maximum length of the field, in characters.
     *
     * @param {number} value maximum length.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets the maximum length of the field, in characters.
     * field.maxLength = 20;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set maxLength(value: number) {
        if (this.maxLength !== value) {
            this._dictionary.update('MaxLen', value);
            this._maxLength = value;
        }
    }
    /**
     * Gets the flag indicating whether the auto resize text enabled or not.
     * Note: Applicable only for newly created PDF fields.
     *
     * @returns {boolean} Enable or disable auto resize text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets the flag indicating whether the auto resize text enabled or not.
     * let isAutoResize: boolean = field.isAutoResizeText;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isAutoResizeText(): boolean {
        return this._autoResizeText;
    }
    /**
     * Sets the flag indicating whether the auto resize text enabled or not.
     * Note: Applicable only for newly created PDF fields.
     *
     * @param {boolean} value Enable or disable auto resize text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets the flag indicating whether the auto resize text enabled or not.
     * field.isAutoResizeText = false;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set isAutoResizeText(value: boolean) {
        this._autoResizeText = value;
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (widget) {
            widget._isAutoResize = value;
        }
    }
    /**
     * Gets the font of the field.
     *
     * @returns {PdfFont} font.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Gets the font of the field.
     * let font: PdfFont = field.font;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get font(): PdfFont {
        if (this._font) {
            return this._font;
        } else {
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            this._font = _obtainFontDetails(this._form, widget, this);
        }
        return this._font;
    }
    /**
     * Sets the font of the field.
     *
     * @param {PdfFont} value font.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Sets the font of the field
     * field.font = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set font(value: PdfFont) {
        if (value && value instanceof PdfFont) {
            this._font = value;
            this._initializeFont(value);
        }
    }
    /**
     * Gets the background color of the field.
     *
     * @returns {PdfColor} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the background color of the field.
     * let backColor: PdfColor = field.backColor;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get backColor(): PdfColor {
        return this._parseBackColor(true);
    }
    /**
     * Sets the background color of the field.
     *
     * @param {PdfColor} value Array with R, G, B, A color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the text box field at index 0
     * let firstName: PdfField = document.form.fieldAt(0);
     * // Sets the background color of the field.
     * firstName.backColor = {r: 255, g: 0, b: 0};
     * // Access the text box field at index 1
     * let secondName: PdfField = document.form.fieldAt(1);
     * // Sets the background color of the field to transparent.
     * secondName.backColor = {r: 0, g: 0, b: 0, isTransparent: true};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set backColor(value: PdfColor) {
        this._updateBackColor(value, true);
    }
    _initialize(page: PdfPage, name: string, bounds: Rectangle): void {
        this._crossReference = page._crossReference;
        this._page = page;
        this._name = name;
        this._text = '';
        this._defaultValue = '';
        this._defaultIndex = 0;
        this._spellCheck = false;
        this._insertSpaces = false;
        this._multiline = false;
        this._password = false;
        this._scrollable = false;
        this._dictionary = new _PdfDictionary(this._crossReference);
        this._ref = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(this._ref, this._dictionary);
        this._dictionary.objId = this._ref.toString();
        this._dictionary.update('FT', _PdfName.get('Tx'));
        this._dictionary.update('T', name);
        this._fieldFlags |= _FieldFlag.doNotSpellCheck;
        this._createItem(bounds);
        this._initializeFont(this._defaultFont);
    }
    _createItem(bounds: Rectangle): void {
        const widget: PdfWidgetAnnotation = new PdfWidgetAnnotation();
        widget._create(this._page, bounds, this);
        widget.textAlignment = PdfTextAlignment.left;
        this._stringFormat = new PdfStringFormat(widget.textAlignment, PdfVerticalAlignment.middle);
        widget._dictionary.update('MK', new _PdfDictionary(this._crossReference));
        widget._mkDictionary.update('BC', [0, 0, 0]);
        widget._mkDictionary.update('BG', [1, 1, 1]);
        widget._mkDictionary.update('CA',  this.actualName);
        this._addToKid(widget);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (isFlatten || this._setAppearance || this._form._setAppearance) {
            const count: number = this._kidsCount;
            if (this._isLoaded) {
                if (count > 0) {
                    for (let i: number = 0; i < count; i++) {
                        const item: PdfWidgetAnnotation = this.itemAt(i);
                        if (item) {
                            this._postProcess(isFlatten, item);
                        }
                    }
                } else if ((isFlatten || this._form._setAppearance || this._setAppearance) && !this._checkFieldFlag(this._dictionary)) {
                    this._postProcess(isFlatten);
                }
            } else if (isFlatten || this._form._setAppearance || this._setAppearance) {
                for (let i: number = 0; i < count; i++) {
                    const item: PdfWidgetAnnotation = this.itemAt(i);
                    if (item && !this._checkFieldFlag(item._dictionary)) {
                        const template: PdfTemplate = this._createAppearance(isFlatten, item);
                        if (isFlatten) {
                            const bounds: Rectangle = {x: item.bounds.x,
                                y: item.bounds.y,
                                width: template._size.width,
                                height: template._size.height};
                            this._drawTemplate(template, item._page, bounds);
                        } else {
                            this._addAppearance(item._dictionary, template, 'N');
                        }
                        item._dictionary._updated = !isFlatten;
                    }
                }
            }
            if (isFlatten) {
                this._dictionary._updated = false;
            }
        }
    }
    _postProcess(isFlatten: boolean, widget ?: PdfWidgetAnnotation): void {
        let template: PdfTemplate;
        let bounds: {x: number, y: number, width: number, height: number};
        const source: PdfWidgetAnnotation | PdfTextBoxField = widget ? widget : this;
        if ((widget !== null && typeof widget !== 'undefined' && widget._setAppearance && widget._enableGrouping) || this._form._setAppearance || this._setAppearance || (isFlatten && !source._dictionary.has('AP'))) {
            template = this._createAppearance(isFlatten, source);
        } else if (source._dictionary.has('AP')) {
            let appearanceStream: _PdfBaseStream;
            const dictionary: _PdfDictionary = source._dictionary.get('AP');
            if (dictionary && dictionary.has('N')) {
                appearanceStream = dictionary.get('N');
                const reference: _PdfReference = dictionary.getRaw('N');
                if (reference) {
                    appearanceStream.reference = reference;
                }
                if (appearanceStream) {
                    template = new PdfTemplate(appearanceStream, this._crossReference);
                }
            }
        }
        if (template) {
            if (isFlatten) {
                const page: PdfPage = source instanceof PdfWidgetAnnotation ? source._getPage() : source.page;
                if (page) {
                    const graphics: PdfGraphics = page.graphics;
                    graphics.save();
                    if (page.rotation === PdfRotationAngle.angle90) {
                        graphics.translateTransform({x: graphics._size.width, y: graphics._size.height});
                        graphics.rotateTransform(90);
                    } else if (page.rotation === PdfRotationAngle.angle180) {
                        graphics.translateTransform({x: graphics._size.width, y: graphics._size.height});
                        graphics.rotateTransform(-180);
                    } else if (page.rotation === PdfRotationAngle.angle270) {
                        graphics.translateTransform({x: graphics._size.width, y: graphics._size.height});
                        graphics.rotateTransform(270);
                    }
                    bounds = {x: source.bounds.x, y: source.bounds.y, width: template._size.width, height: template._size.height};
                    graphics.drawTemplate(template, bounds);
                    graphics.restore();
                }
                source._dictionary._updated = false;
            } else {
                this._addAppearance(source._dictionary, template, 'N');
            }
        }
    }
    _createAppearance(isFlatten: boolean, widget: PdfWidgetAnnotation | PdfTextBoxField): PdfTemplate {
        const bounds: {x: number, y: number, width: number, height: number} = widget.bounds;
        const template: PdfTemplate = new PdfTemplate([0, 0, bounds.width, bounds.height], this._crossReference);
        _setMatrix(template, null);
        template._writeTransformation = false;
        const graphics: PdfGraphics = template.graphics;
        const parameter: _PaintParameter = new _PaintParameter();
        parameter.bounds = {x: 0, y: 0, width: bounds.width, height: bounds.height};
        const backcolor: PdfColor = widget.backColor;
        if (backcolor && !backcolor.isTransparent) {
            parameter.backBrush = new PdfBrush(backcolor);
        }
        parameter.foreBrush = new PdfBrush(widget.color);
        const border: PdfInteractiveBorder = widget.border;
        if (widget.borderColor) {
            if (border.width === 0) {
                widget.borderColor = {r: 255, g: 255, b: 255};
            }
            parameter.borderPen = new PdfPen(widget.borderColor,  border.width);
            _updateDashedBorderStyle(border, parameter);
        }
        parameter.borderWidth = border.width;
        parameter.borderStyle = border.style;
        if (backcolor) {
            const shadowColor: number[] = [backcolor.r - 64, backcolor.g - 64, backcolor.b - 64];
            const color: PdfColor = {r: shadowColor[0] >= 0 ? shadowColor[0] : 0,
                g: shadowColor[1] >= 0 ? shadowColor[1] : 0,
                b: shadowColor[2] >= 0 ? shadowColor[2] : 0};
            parameter.shadowBrush = new PdfBrush(color);
        }
        parameter.rotationAngle = widget.rotate;
        parameter.insertSpaces = this.insertSpaces;
        let text: string = this.text;
        let pdfFont: PdfFont;
        let stringFormat: PdfStringFormat;
        let enableGrouping: boolean = false;
        if (text === null || typeof text === 'undefined') {
            text = '';
        }
        if (this.password) {
            let password: string = '';
            for (let i: number = 0; i < text.length; i++) {
                password += '*';
            }
            text = password;
        }
        if (this.maxLength && text.length > this.maxLength) {
            text = text.substring(0, this.maxLength);
        }
        parameter.required = this.required;
        if (!this.required) {
            graphics._sw._beginMarkupSequence('Tx');
            graphics._initializeCoordinates();
        }
        if (widget !== null && typeof widget !== 'undefined' && widget instanceof PdfWidgetAnnotation && widget._enableGrouping) {
            enableGrouping = true;
        }
        if (enableGrouping && widget.font !== null && typeof widget.font !== 'undefined') {
            pdfFont = widget.font;
        } else if (typeof this._font === 'undefined' || this._font === null) {
            this._font = this.font ? this.font : this._defaultFont;
        }
        if (enableGrouping && widget.textAlignment !== null && typeof widget.textAlignment !== 'undefined') {
            stringFormat = stringFormat = new PdfStringFormat(widget.textAlignment, PdfVerticalAlignment.middle);
        } else if (typeof this._stringFormat === 'undefined' || this._stringFormat === null) {
            if (typeof this.textAlignment === 'undefined' || this.textAlignment === null) {
                this._stringFormat = new PdfStringFormat(this.textAlignment, PdfVerticalAlignment.middle);
            } else {
                this._stringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.middle);
            }
        }
        if (_isRightToLeftCharacters(text)) {
            this._stringFormat.textDirection = PdfTextDirection.rightToLeft;
        }
        if (this._isLoaded && !this.multiLine) {
            if (this._stringFormat) {
                this._stringFormat.lineLimit = false;
            } else if (stringFormat) {
                stringFormat.lineLimit = false;
            }
        }
        if (enableGrouping) {
            this._drawTextBox(graphics, parameter, text, pdfFont, stringFormat, this.multiLine, this.scrollable, this.maxLength);
        } else {
            this._drawTextBox(graphics, parameter, text, this._font, this._stringFormat, this.multiLine, this.scrollable, this.maxLength);
        }
        if (!this.required) {
            graphics._sw._endMarkupSequence();
        }
        return template;
    }
    _drawTextBox(g: PdfGraphics,
                 parameter: _PaintParameter,
                 text: string,
                 font: PdfFont,
                 format: PdfStringFormat,
                 multiline: boolean,
                 scroll: boolean,
                 maxLength?: number): void {
        if (typeof maxLength !== 'undefined') {
            if (parameter.insertSpaces) {
                let width: number = 0;
                if (typeof maxLength !== 'undefined' && maxLength > 0 && this.borderColor) {
                    width = parameter.bounds.width / maxLength;
                    g.drawRectangle(parameter.bounds, parameter.borderPen, parameter.backBrush);
                    const current: string = text;
                    for (let i: number = 0; i < maxLength; i++) {
                        if (format.alignment === PdfTextAlignment.right) {
                            if (maxLength - current.length <= i) {
                                text = current[i - (maxLength - current.length)];
                            } else {
                                text = '';
                            }
                        } else {
                            if (format.alignment === PdfTextAlignment.center && current.length < maxLength) {
                                const startlocation: number = Math.floor(maxLength / 2 - Math.ceil(current.length / 2));
                                if (i >= startlocation && i < startlocation + current.length) {
                                    text = current[i - startlocation];
                                } else {
                                    text = '';
                                }
                            } else {
                                if (current.length > i) {
                                    text = current[<number>i];
                                } else {
                                    text = '';
                                }
                            }
                        }
                        parameter.bounds.width = width;
                        const stringFormat: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
                        this._drawTextBox(g, parameter, text, font, stringFormat, multiline, scroll);
                        parameter.bounds.x = parameter.bounds.x + width;
                        if (parameter.borderWidth) {
                            g.drawLine(parameter.borderPen,
                                       {x: parameter.bounds.x, y: parameter.bounds.y},
                                       {x: parameter.bounds.x, y: parameter.bounds.y + parameter.bounds.height});
                        }
                    }
                } else {
                    this._drawTextBox(g, parameter, text, font, format, multiline, scroll);
                }
            } else {
                this._drawTextBox(g, parameter, text, font, format, multiline, scroll);
            }
        } else {
            if (g._isTemplateGraphics && parameter.required) {
                g.save();
                g._initializeCoordinates();
            }
            if (!parameter.insertSpaces) {
                this._drawRectangularControl(g, parameter);
            }
            if (g._isTemplateGraphics && parameter.required) {
                g.restore();
                g.save();
                g._sw._beginMarkupSequence('Tx');
                g._initializeCoordinates();
            }
            let rectangle: Rectangle = parameter.bounds;
            const rotate: number = this.rotate;
            if (rotate !== null && typeof rotate !== 'undefined' && rotate === 90) {
                rectangle.y = rectangle.width / 2;
            }
            if (parameter.borderStyle === PdfBorderStyle.beveled || parameter.borderStyle === PdfBorderStyle.inset) {
                rectangle.x = rectangle.x + 4 * parameter.borderWidth;
                rectangle.width = rectangle.width - 8 * parameter.borderWidth;
            } else {
                rectangle.x = rectangle.x + 2 * parameter.borderWidth;
                rectangle.width = rectangle.width - 4 * parameter.borderWidth;
            }
            if (multiline) {
                const tempheight: number = (typeof format === 'undefined' || format === null || format.lineSpacing === 0) ?
                    font._getHeight() :
                    format.lineSpacing;
                const ascent: number = font._getAscent(format);
                const shift: number = tempheight - ascent;
                if (text.indexOf('\n') !== -1) {
                    if (rectangle.x === 0 && rectangle.y === 1) {
                        rectangle.y = -(rectangle.y - shift);
                    }
                } else if (rectangle.x === 0 && rectangle.y === 1) {
                    rectangle.y = -(rectangle.y - shift);
                }
                if (parameter.isAutoFontSize) {
                    if (parameter.borderWidth !== 0) {
                        rectangle.y = rectangle.y + 2.5 * parameter.borderWidth;
                    }
                }
            }
            if ((g._page &&
                typeof g._page.rotation !== 'undefined' &&
                g._page.rotation !== PdfRotationAngle.angle0) ||
                parameter.rotationAngle > 0) {
                const state: PdfGraphicsState = g.save();
                if (typeof parameter.pageRotationAngle !== 'undefined' && parameter.pageRotationAngle !== PdfRotationAngle.angle0) {
                    if (parameter.pageRotationAngle === PdfRotationAngle.angle90) {
                        g.translateTransform({x: g._size.height, y: 0});
                        g.rotateTransform(90);
                        const y: number = g._size.height - (rectangle.x + rectangle.width);
                        const x: number = rectangle.y;
                        rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                    } else if (parameter.pageRotationAngle === PdfRotationAngle.angle180) {
                        g.translateTransform({x: g._size.width, y: g._size.height});
                        g.rotateTransform(-180);
                        const x: number = g._size.width - (rectangle.x + rectangle.width);
                        const y: number = g._size.height - (rectangle.y + rectangle.height);
                        rectangle = {x: x, y: y, width: rectangle.width, height: rectangle.height};
                    } else if (parameter.pageRotationAngle === PdfRotationAngle.angle270) {
                        g.translateTransform({x: 0, y: g._size.width});
                        g.rotateTransform(270);
                        const x: number = g._size.width - (rectangle.y + rectangle.height);
                        const y: number = rectangle.x;
                        rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                    }
                }
                if (parameter.rotationAngle) {
                    if (parameter.rotationAngle === 90) {
                        if (parameter.pageRotationAngle === PdfRotationAngle.angle90) {
                            g.translateTransform({x: 0, y: g._size.height});
                            g.rotateTransform(-90);
                            const x: number = g._size.height - (rectangle.y + rectangle.height);
                            const y: number = rectangle.x;
                            rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                            parameter.stringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
                        } else {
                            if (rectangle.width > rectangle.height) {
                                g.translateTransform({x: 0, y: g._size.height});
                                g.rotateTransform(-90);
                                rectangle = parameter.bounds;
                                rectangle.y = (rectangle.width / 2) - (8 * parameter.borderWidth);
                            } else {
                                const z: number = rectangle.x;
                                rectangle.x = -(rectangle.y + rectangle.height);
                                rectangle.y = z;
                                const height: number = rectangle.height;
                                rectangle.height = rectangle.width > font._getHeight() ? rectangle.width : font._getHeight();
                                rectangle.width = height;
                                g.rotateTransform(-90);
                            }
                        }
                    } else if (parameter.rotationAngle === 270) {
                        g.translateTransform({x: g._size.width, y: 0});
                        g.rotateTransform(-270);
                        rectangle = parameter.bounds;
                        rectangle.y = (rectangle.width / 2) - (8 * parameter.borderWidth);
                    } else if (parameter.rotationAngle === 180) {
                        g.translateTransform({x: g._size.width, y: g._size.height});
                        g.rotateTransform(-180);
                        const x: number = g._size.width - (rectangle.x + rectangle.width);
                        const y: number = g._size.height - (rectangle.y + rectangle.height);
                        rectangle = {x: x, y: y, width: rectangle.width, height: rectangle.height};
                    }
                }
                g.drawString(text, font, rectangle, null, parameter.foreBrush, format);
                g.restore(state);
            } else {
                g.drawString(text, font, rectangle, null, parameter.foreBrush, format);
            }
            if (g._isTemplateGraphics && parameter.required) {
                g._sw._endMarkupSequence();
                g.restore();
            }
        }
    }
}
/**
 * `PdfButtonField` class represents the button field objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new button field
 * let field: PdfButtonField = new PdfButtonField(page , 'Button1', {x: 100, y: 40, width: 100, height: 20});
 * // Add the field into PDF form
 * form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfButtonField extends PdfField {
    _text: string;
    _appearance: PdfAppearance;
    _actions: PdfFieldActions;
    /**
     * Represents a button field of the PDF document.
     *
     * @private
     */
    constructor()
    /**
     * Represents a button box field of the PDF document.
     *
     * @param {PdfPage} page The page where the field is drawn.
     * @param {string} name The name of the field.
     * @param {Rectangle} bounds The bounds of the field.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new button field
     * let field: PdfButtonField = new PdfButtonField(page , 'Button1', {x: 100, y: 40, width: 100, height: 20});
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, bounds: Rectangle)
    /**
     * Represents a button field (push/submit/reset) of the PDF document.
     *
     * @param {PdfPage} page The page where the field is drawn.
     * @param {string} name The unique name of the field.
     * @param {Rectangle} bounds The bounds of the field.
     * @param {object} properties Required properties bag.
     * @param {string} [properties.toolTip] Tooltip text shown by the viewer.
     * @param {PdfColor} [properties.color] Fore color (caption/text color) (RGB).
     * @param {PdfColor} [properties.backColor] Background color.
     * @param {PdfColor} [properties.borderColor] Border color.
     * @param {PdfInteractiveBorder} [properties.border] Border settings (width, style, dash).
     * @param {string} [properties.text] Button caption text.
     * @param {PdfHighlightMode} [properties.highlightMode] Button highlight mode on click/hover (e.g., invert, push, outline, noHighlighting).
     * @param {PdfFont} [properties.font] Font applied to the caption text.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Add new button field into PDF form
     * document.form.add(new PdfButtonField(
     *   page,
     *   'Submit',
     *   { x: 50, y: 560, width: 120, height: 28 },
     *   {
     *     toolTip: 'Submit form',
     *     color: { r: 255, g: 255, b: 255 },
     *     backColor: { r: 0, g: 122, b: 204 },
     *     borderColor: { r: 0, g: 0, b: 0 },
     *     border: new PdfInteractiveBorder({width: 1, style: PdfBorderStyle.solid}),
     *     text: 'Submit',
     *     highlightMode: PdfHighlightMode.push,
     *     font: document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular)
     *   }
     * ));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        text?: string,
        highlightMode?: PdfHighlightMode
    })
    constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        text?: string,
        highlightMode?: PdfHighlightMode
    }) {
        super();
        if (page && name && bounds) {
            this._initialize(page, name, bounds);
        }
        if (properties) {
            if ('text' in properties && _isNullOrUndefined(properties.text)) {
                this.text = properties.text;
            }
            if ('toolTip' in properties && _isNullOrUndefined(properties.toolTip)) {
                this.toolTip = properties.toolTip;
            }
            if ('color' in properties && _isNullOrUndefined(properties.color)) {
                this.color = properties.color;
            }
            if ('border' in properties && _isNullOrUndefined(properties.border)) {
                this.border = properties.border;
            }
            if ('backColor' in properties && _isNullOrUndefined(properties.backColor)) {
                this.backColor = properties.backColor;
            }
            if ('borderColor' in properties && _isNullOrUndefined(properties.borderColor)) {
                this.borderColor = properties.borderColor;
            }
            if ('highlightMode' in properties && _isNullOrUndefined(properties.highlightMode)) {
                this.highlightMode = properties.highlightMode;
            }
        }
    }
    /**
     * Gets the actions of the field. [Read-Only]
     *
     * @returns {PdfFieldActions} The actions.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the action value from button field
     * let action: PdfAction = field.actions.mouseEnter;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get actions(): PdfFieldActions {
        if (!this._actions) {
            this._actions = new PdfFieldActions(this);
        }
        return this._actions;
    }
    /**
     * Gets value of the text box field.
     *
     * @returns {string} Text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Gets the text value from button field
     * let text: string = field.text;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get text(): string {
        if (this._isLoaded) {
            if (typeof this._text === 'undefined') {
                const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
                if (widget && widget._mkDictionary && widget._mkDictionary.has('CA')) {
                    this._text = widget._mkDictionary.get('CA');
                } else if (this._mkDictionary && this._mkDictionary.has('CA')) {
                    this._text = this._mkDictionary.get('CA');
                }
            }
            if (typeof this._text === 'undefined') {
                const value: string = _getInheritableProperty(this._dictionary, 'V', false, true, 'Parent');
                if (value) {
                    this._text = value;
                }
            }
        }
        if (typeof this._text === 'undefined') {
            this._text = '';
        }
        return this._text;
    }
    /**
     * Sets value of the text box field.
     *
     * @param {string} value Text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Sets the text value of form field
     * field.text = 'Click to submit';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set text(value: string) {
        if (this._isLoaded && !this.readOnly) {
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            if (widget && widget._dictionary) {
                this._assignText(widget._dictionary, value);
            } else {
                this._assignText(this._dictionary, value);
            }
            this._text = value;
        }
        if (!this._isLoaded && this._text !== value) {
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            this._assignText(widget._dictionary, value);
            this._text = value;
        }
    }
    /**
     * Gets the text alignment in a button field.
     *
     * @returns {PdfTextAlignment} Text alignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Gets the text alignment from button field
     * let alignment: PdfTextAlignment = field.textAlignment;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textAlignment(): PdfTextAlignment {
        return this._getTextAlignment();
    }
    /**
     * Sets the text alignment in a button field.
     *
     * @param {PdfTextAlignment} value Text alignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Sets the text alignment of form field as center
     * field.textAlignment = PdfTextAlignment.center;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textAlignment(value: PdfTextAlignment) {
        if (this._textAlignment !== value) {
            this._setTextAlignment(value);
        }
    }
    /**
     * Gets the highlight mode of the field.
     *
     * @returns {PdfHighlightMode} highlight mode.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Gets the highlight mode from button field
     * let highlightMode: PdfHighlightMode = field. highlightMode;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get highlightMode(): PdfHighlightMode {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        let mode: PdfHighlightMode;
        if (widget && typeof widget.highlightMode !== 'undefined') {
            mode = widget.highlightMode;
        } else if (this._dictionary && this._dictionary.has('H')) {
            const highlight: _PdfName = this._dictionary.get('H');
            mode = _mapHighlightMode(highlight.name);
        }
        return (typeof mode !== 'undefined') ? mode : PdfHighlightMode.invert;
    }
    /**
     * Sets the highlight mode of the field.
     *
     * @param {PdfHighlightMode} value highlight mode.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Sets the highlight mode of button field as outline
     * field.highlightMode = PdfHighlightMode.outline;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set highlightMode(value: PdfHighlightMode) {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (widget && (typeof widget.highlightMode === 'undefined' || widget.highlightMode !== value)) {
            widget.highlightMode = value;
        } else if (!this._dictionary.has('H') || _mapHighlightMode(this._dictionary.get('H')) !== value) {
            this._dictionary.update('H', _reverseMapHighlightMode(value));
        }
    }
    /**
     * Gets the font of the field.
     *
     * @returns {PdfFont} font.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Gets the font of the field.
     * let font: PdfFont = field.font;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get font(): PdfFont {
        if (this._font) {
            return this._font;
        } else {
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            this._font = _obtainFontDetails(this._form, widget, this);
        }
        return this._font;
    }
    /**
     * Sets the font of the field.
     *
     * @param {PdfFont} value font.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Sets the font of the field
     * field.font = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set font(value: PdfFont) {
        if (value && value instanceof PdfFont) {
            this._font = value;
            this._initializeFont(value);
        }
    }
    /**
     * Gets the background color of the field.
     *
     * @returns {PdfColor} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the background color of the field.
     * let backColor: PdfColor = field.backColor;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get backColor(): PdfColor {
        return this._parseBackColor(true);
    }
    /**
     * Sets the background color of the field.
     *
     * @param {PdfColor} value Array with R, G, B, A color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the button field at index 0
     * let submitButton: PdfField = document.form.fieldAt(0);
     * // Sets the background color of the field.
     * submitButton.backColor = {r: 255, g: 0, b: 0};
     * // Access the button field at index 1
     * let cancelButton: PdfField = document.form.fieldAt(1);
     * // Sets the background color of the field to transparent.
     * cancelButton.backColor = {r: 0, g: 0, b: 0, isTransparent: true};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set backColor(value: PdfColor) {
        this._updateBackColor(value, true);
    }
    _assignText(fieldDictionary: _PdfDictionary, value: string): void {
        let dictionary: _PdfDictionary;
        if (fieldDictionary && fieldDictionary.has('MK')) {
            dictionary = fieldDictionary.get('MK');
        } else {
            dictionary = new _PdfDictionary(this._crossReference);
            fieldDictionary.set('MK', dictionary);
        }
        dictionary.update('CA', value);
        fieldDictionary._updated = true;
    }
    /**
     * Parse an existing button field.
     *
     * @private
     * @param {PdfForm} form Form object.
     * @param {_PdfDictionary} dictionary Field dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference object.
     * @param {_PdfReference} reference Field reference.
     * @returns {PdfButtonField} Button field.
     */
    static _load(form: PdfForm,
                 dictionary: _PdfDictionary,
                 crossReference: _PdfCrossReference,
                 reference: _PdfReference): PdfButtonField {
        const field: PdfButtonField = new PdfButtonField();
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
        return field;
    }
    _initialize(page: PdfPage, name: string, bounds: {x: number, y: number, width: number, height: number}): void {
        this._crossReference = page._crossReference;
        this._page = page;
        this._name = name;
        this._defaultIndex = 0;
        this._dictionary = new _PdfDictionary(this._crossReference);
        this._ref = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(this._ref, this._dictionary);
        this._dictionary.objId = this._ref.toString();
        this._dictionary.update('FT', _PdfName.get('Btn'));
        this._dictionary.update('T', name);
        this._fieldFlags |= _FieldFlag.pushButton;
        this._initializeFont(this._defaultFont);
        this._createItem(bounds);
    }
    _createItem(bounds: {x: number, y: number, width: number, height: number}): void {
        const widget: PdfWidgetAnnotation = new PdfWidgetAnnotation();
        widget._create(this._page, bounds, this);
        widget.textAlignment = PdfTextAlignment.center;
        this._stringFormat = new PdfStringFormat(widget.textAlignment, PdfVerticalAlignment.middle);
        widget._dictionary.update('MK', new _PdfDictionary(this._crossReference));
        widget._mkDictionary.update('BC', [0, 0, 0]);
        widget._mkDictionary.update('BG', [.827451, .827451, .827451]);
        widget._mkDictionary.update('CA', (typeof this._name !== 'undefined' && this._name !== null) ? this._name : this._actualName);
        this._addToKid(widget);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (isFlatten || this._setAppearance || this._form._setAppearance) {
            const count: number = this._kidsCount;
            if (this._isLoaded) {
                if (count > 0) {
                    for (let i: number = 0; i < count; i++) {
                        const item: PdfWidgetAnnotation = this.itemAt(i);
                        if (item) {
                            this._postProcess(isFlatten, item);
                        }
                    }
                } else if ((isFlatten || this._form._setAppearance || this._setAppearance) && !this._checkFieldFlag(this._dictionary)) {
                    this._postProcess(isFlatten);
                }
            } else if (isFlatten || this._form._setAppearance || this._setAppearance) {
                for (let i: number = 0; i < count; i++) {
                    const item: PdfWidgetAnnotation = this.itemAt(i);
                    if (item && !this._checkFieldFlag(item._dictionary)) {
                        const template: PdfTemplate = this._createAppearance(item);
                        if (isFlatten) {
                            const bounds: Rectangle = {x: item.bounds.x,
                                y: item.bounds.y,
                                width: template._size.width,
                                height: template._size.height};
                            this._drawTemplate(template, item._getPage(), bounds);
                        } else {
                            this._addAppearance(item._dictionary, template, 'N');
                            const pressed: PdfTemplate = this._createAppearance(item, true);
                            if (pressed) {
                                this._addAppearance(item._dictionary, pressed, 'D');
                            }
                        }
                        item._dictionary._updated = !isFlatten;
                    }
                }
            }
            if (isFlatten) {
                this._dictionary._updated = false;
            }
        }
    }
    _postProcess(isFlatten: boolean, widget ?: PdfWidgetAnnotation): void {
        let template: PdfTemplate;
        let bounds: {x: number, y: number, width: number, height: number};
        const source: PdfWidgetAnnotation | PdfButtonField = widget ? widget : this;
        if ((widget !== null && typeof widget !== 'undefined' && widget._setAppearance && widget._enableGrouping) || this._form._setAppearance || this._setAppearance || (isFlatten && !source._dictionary.has('AP'))) {
            template = this._createAppearance(source);
        } else if (source._dictionary.has('AP')) {
            let appearanceStream: _PdfBaseStream;
            const dictionary: _PdfDictionary = source._dictionary.get('AP');
            if (dictionary && dictionary.has('N')) {
                appearanceStream = dictionary.get('N');
                const reference: _PdfReference = dictionary.getRaw('N');
                if (reference) {
                    appearanceStream.reference = reference;
                }
                if (appearanceStream && appearanceStream instanceof _PdfDictionary && source._dictionary.has('AS')) {
                    const name: _PdfName = source._dictionary.get('AS');
                    if (name && name instanceof _PdfName && appearanceStream.has(name.name)) {
                        const reference: _PdfReference = appearanceStream.getRaw(name.name);
                        const value: _PdfBaseStream = appearanceStream.get(name.name);
                        if (reference && value && value instanceof _PdfBaseStream) {
                            appearanceStream = value;
                            appearanceStream.reference = reference;
                        }
                    }
                }
                if (appearanceStream) {
                    template = new PdfTemplate(appearanceStream, this._crossReference);
                }
            }
        }
        if (template) {
            if (isFlatten) {
                const page: PdfPage = source instanceof PdfWidgetAnnotation ? source._getPage() : source.page;
                if (page) {
                    const graphics: PdfGraphics = page.graphics;
                    graphics.save();
                    if (page.rotation === PdfRotationAngle.angle90) {
                        graphics.translateTransform({x: graphics._size.width, y: graphics._size.height});
                        graphics.rotateTransform(90);
                    } else if (page.rotation === PdfRotationAngle.angle180) {
                        graphics.translateTransform({x: graphics._size.width, y: graphics._size.height});
                        graphics.rotateTransform(-180);
                    } else if (page.rotation === PdfRotationAngle.angle270) {
                        graphics.translateTransform({x: graphics._size.width, y: graphics._size.height});
                        graphics.rotateTransform(270);
                    }
                    bounds = {x: source.bounds.x, y: source.bounds.y, width: template._size.width, height: template._size.height};
                    graphics.drawTemplate(template, bounds);
                    graphics.restore();
                }
                source._dictionary._updated = false;
            } else {
                this._addAppearance(source._dictionary, template, 'N');
            }
        }
    }
    _createAppearance(widget: PdfWidgetAnnotation | PdfButtonField, isPressed: boolean = false): PdfTemplate {
        const bounds: {x: number, y: number, width: number, height: number} = widget.bounds;
        const template: PdfTemplate = new PdfTemplate([0, 0, bounds.width, bounds.height], this._crossReference);
        const parameter: _PaintParameter = new _PaintParameter();
        parameter.bounds = {x: 0, y: 0, width: bounds.width, height: bounds.height};
        let text: string;
        let font: PdfFont;
        let stringFormat: PdfStringFormat;
        let enableGrouping: boolean = false;
        let isSizeZero: boolean = false;
        const backcolor: PdfColor = widget.backColor;
        if (backcolor && !backcolor.isTransparent) {
            parameter.backBrush = new PdfBrush(backcolor);
        }
        parameter.foreBrush = new PdfBrush(widget.color);
        const border: PdfInteractiveBorder = widget.border;
        if (widget.borderColor) {
            parameter.borderPen = new PdfPen(widget.borderColor, border.width);
            _updateDashedBorderStyle(border, parameter);
        }
        parameter.borderWidth = border.width;
        parameter.borderStyle = border.style;
        if (backcolor) {
            const shadowColor: number[] = [backcolor.r - 64, backcolor.g - 64, backcolor.b - 64];
            const color: number[] = [shadowColor[0] >= 0 ? shadowColor[0] : 0,
                shadowColor[1] >= 0 ? shadowColor[1] : 0,
                shadowColor[2] >= 0 ? shadowColor[2] : 0];
            parameter.shadowBrush = new PdfBrush({r: color[0], g: color[1], b: color[2]});
        }
        parameter.rotationAngle = widget.rotate;
        if (widget !== null && typeof widget !== 'undefined' && widget instanceof PdfWidgetAnnotation && widget._enableGrouping) {
            enableGrouping = true;
        }
        if (enableGrouping) {
            if (widget._mkDictionary && widget._mkDictionary && widget._mkDictionary.has('CA')) {
                text = widget._mkDictionary.get('CA');
            } else {
                text = '';
            }
            if (typeof widget.font !== 'undefined' && widget.font.size !== null && widget.font.size !== 0) {
                font = widget.font;
            }
            stringFormat = new PdfStringFormat(widget.textAlignment, PdfVerticalAlignment.middle);
        } else if (typeof this._font === 'undefined' || this._font === null) {
            this._font = this._defaultFont;
        }
        if (this._isLoaded && widget instanceof PdfWidgetAnnotation &&
            widget !== null && typeof widget !== 'undefined' && widget._defaultAppearance) {
            let fontName: string = widget._defaultAppearance.fontName;
            if (fontName === null || typeof fontName === 'undefined') {
                fontName = 'Helvetica';
            }
            let fontSize: number = widget._defaultAppearance.fontSize;
            if (fontSize === null || typeof fontSize === 'undefined') {
                fontSize = this._defaultFont.size;
            } else if (fontSize === 0) {
                isSizeZero = true;
            }
            let previousFont: PdfFont;
            let currentFont: PdfFont;
            let font: PdfFont;
            this._stringFormat = new PdfStringFormat();
            this._stringFormat.lineAlignment = PdfVerticalAlignment.middle;
            this._stringFormat.alignment = PdfTextAlignment.center;
            if (fontSize !== null && typeof fontSize !== 'undefined' && fontName) {
                font = _mapFont(fontName, fontSize, PdfFontStyle.regular, widget);
            }
            if (font !== null && typeof font !== 'undefined') {
                currentFont = font;
            } else {
                currentFont = this._defaultFont;
            }
            let textWidth: Size = currentFont.measureString(this.text, this._stringFormat);
            if (isSizeZero && currentFont && currentFont instanceof PdfStandardFont) {
                if (this._isLoaded && !widget._dictionary.has('AP')) {
                    const width: number = widget.bounds.width - 8 * border.width;
                    const height: number = widget.bounds.height - 8 * border.width;
                    while (textWidth.width < width || textWidth.height < height) {
                        previousFont = currentFont;
                        currentFont = new PdfStandardFont((currentFont as PdfStandardFont).fontFamily, currentFont._size + 1);
                        textWidth = currentFont.measureString(this.text, this._stringFormat);
                        if (textWidth.width > width || textWidth.height > height) {
                            currentFont = previousFont;
                            break;
                        }
                    }
                    this._font = currentFont;
                }
            }
        }
        if (enableGrouping) {
            if (isPressed) {
                this._drawPressedButton(template.graphics, parameter, text, font, stringFormat);
            } else {
                this._drawButton(template.graphics, parameter, text, font, stringFormat);
            }
        } else{
            if (isPressed) {
                this._drawPressedButton(template.graphics, parameter, this.text, this._font, this._stringFormat);
            } else {
                this._drawButton(template.graphics, parameter, this.text, this._font, this._stringFormat);
            }
        }
        return template;
    }
    _drawButton(g: PdfGraphics, parameter: _PaintParameter, text: string, font: PdfFont, format: PdfStringFormat): void {
        this._drawRectangularControl(g, parameter);
        let rectangle: Rectangle = parameter.bounds;
        if ((g._page &&
            typeof g._page.rotation !== 'undefined' &&
            g._page.rotation !== PdfRotationAngle.angle0) ||
            parameter.rotationAngle > 0) {
            const state: PdfGraphicsState = g.save();
            if (typeof parameter.pageRotationAngle !== 'undefined' && parameter.pageRotationAngle !== PdfRotationAngle.angle0) {
                if (parameter.pageRotationAngle === PdfRotationAngle.angle90) {
                    g.translateTransform({x: g._size.height, y: 0});
                    g.rotateTransform(90);
                    const y: number = g._size.height - (rectangle.x + rectangle.width);
                    const x: number = rectangle.y;
                    rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                } else if (parameter.pageRotationAngle === PdfRotationAngle.angle180) {
                    g.translateTransform({x: g._size.width, y: g._size.height});
                    g.rotateTransform(-180);
                    const x: number = g._size.width - (rectangle.x + rectangle.width);
                    const y: number = g._size.height - (rectangle.y + rectangle.height);
                    rectangle = {x: x, y: y, width: rectangle.width, height: rectangle.height};
                } else if (parameter.pageRotationAngle === PdfRotationAngle.angle270) {
                    g.translateTransform({x: 0, y: g._size.width});
                    g.rotateTransform(270);
                    const x: number = g._size.width - (rectangle.y + rectangle.height);
                    const y: number = rectangle.x;
                    rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                }
            }
            if (parameter.rotationAngle) {
                if (parameter.rotationAngle === 90) {
                    if (parameter.pageRotationAngle === PdfRotationAngle.angle90) {
                        g.translateTransform({x: 0, y: g._size.height});
                        g.rotateTransform(-90);
                        const x: number = g._size.height - (rectangle.y + rectangle.height);
                        const y: number = rectangle.x;
                        rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                    } else {
                        if (rectangle.width > rectangle.height) {
                            g.translateTransform({x: 0, y: g._size.height});
                            g.rotateTransform(-90);
                            const x: number = g._size.height - (rectangle.y + rectangle.height);
                            const y: number = rectangle.x;
                            rectangle = {x: x, y, width: rectangle.height, height: rectangle.width};
                            format._wordWrapType = _PdfWordWrapType.none;
                        } else {
                            const z: number = rectangle.x;
                            rectangle.x = -(rectangle.y + rectangle.height);
                            rectangle.y = z;
                            const height: number = rectangle.height;
                            rectangle.height = rectangle.width > font._getHeight() ? rectangle.width : font._getHeight();
                            rectangle.width = height;
                            g.rotateTransform(-90);
                        }
                    }
                } else if (parameter.rotationAngle === 270) {
                    g.translateTransform({x: g._size.width, y: 0});
                    g.rotateTransform(-270);
                    const x: number = rectangle.y;
                    const y: number = g._size.width - (rectangle.x + rectangle.width);
                    rectangle = {x: x, y: y, width: rectangle.height, height: rectangle.width};
                    format._wordWrapType = _PdfWordWrapType.none;
                } else if (parameter.rotationAngle === 180) {
                    g.translateTransform({x: g._size.width, y: g._size.height});
                    g.rotateTransform(-180);
                    const x: number = g._size.width - (rectangle.x + rectangle.width);
                    const y: number = g._size.height - (rectangle.y + rectangle.height);
                    rectangle = {x: x, y: y, width: rectangle.width, height: rectangle.height};
                }
            }
            g.drawString(text, font, rectangle, null, parameter.foreBrush, format);
            g.restore(state);
        } else {
            g.drawString(text, font, rectangle, null, parameter.foreBrush, format);
        }
    }
    _drawPressedButton(g: PdfGraphics, parameter: _PaintParameter, text: string, font: PdfFont, format: PdfStringFormat): void {
        switch (parameter.borderStyle) {
        case PdfBorderStyle.inset:
            g.drawRectangle(parameter.bounds, parameter.shadowBrush);
            break;
        default:
            g.drawRectangle(parameter.bounds, parameter.backBrush);
            break;
        }
        this._drawBorder(g, parameter.bounds, parameter.borderPen, parameter.borderStyle, parameter.borderWidth);
        const rectangle: Rectangle = {x: parameter.borderWidth,
            y: parameter.borderWidth,
            width: parameter.bounds.width - parameter.borderWidth,
            height: parameter.bounds.height - parameter.borderWidth};
        g.drawString(text, font, rectangle, null, parameter.foreBrush, format);
        switch (parameter.borderStyle) {
        case PdfBorderStyle.inset:
            this._drawLeftTopShadow(g, parameter.bounds, parameter.borderWidth, this._grayBrush);
            this._drawRightBottomShadow(g, parameter.bounds, parameter.borderWidth, this._silverBrush);
            break;
        case PdfBorderStyle.beveled:
            this._drawLeftTopShadow(g, parameter.bounds, parameter.borderWidth, parameter.shadowBrush);
            this._drawRightBottomShadow(g, parameter.bounds, parameter.borderWidth, this._whiteBrush);
            break;
        default:
            this._drawLeftTopShadow(g, parameter.bounds, parameter.borderWidth, parameter.shadowBrush);
            break;
        }
    }
}
/**
 * `PdfCheckBoxField` class represents the check box field objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new check box field
 * let field: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 100, y: 40, width: 20, height: 20}, page);
 * // Sets the checked flag as true.
 * field.checked = true;
 * // Sets the tool tip value
 * field.toolTip = 'Checked';
 * // Add the field into PDF form
 * form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfCheckBoxField extends PdfField {
    _parsedItems: Map<number, PdfStateItem>;
    /**
     * Represents a check box field of the PDF document.
     *
     * @private
     */
    constructor()
    /**
     * Represents a check box field of the PDF document.
     *
     * @param {string} name The name of the field.
     * @param {Rectangle} bounds The bounds of the field.
     * @param {PdfPage} page The page where the field is drawn.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new check box field
     * let field: PdfCheckBoxField = new PdfCheckBoxField('CheckBox1', {x: 100, y: 40, width: 20, height: 20}, page);
     * // Sets the checked flag as true.
     * field.checked = true;
     * // Sets the tool tip value
     * field.toolTip = 'Checked';
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(name: string, bounds: Rectangle, page: PdfPage)
    /**
     * Represents a check box field of the PDF document.
     *
     * @param {string} name The unique name of the field.
     * @param {Rectangle} bounds The bounds of the field.
     * @param {PdfPage} page The page where the field is drawn.
     * @param {object} properties Required properties bag.
     * @param {string} [properties.toolTip] Tooltip text shown by the viewer.
     * @param {PdfColor} [properties.color] Fore color of the marker (RGB).
     * @param {PdfColor} [properties.backColor] Background color.
     * @param {PdfColor} [properties.borderColor] Border color.
     * @param {PdfInteractiveBorder} [properties.border] Border settings (width, style, dash).
     * @param {boolean} [properties.checked] Initial checked state (default: false).
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Add new checkbox field into PDF form
     * document.form.add(new PdfCheckBoxField(
     *   'AcceptTerms',
     *   { x: 50, y: 520, width: 14, height: 14 },
     *   page,
     *   {
     *     toolTip: 'Accept the terms and conditions',
     *     backColor: { r: 255, g: 255, b: 255 },
     *     borderColor: { r: 0, g: 0, b: 0 },
     *     border: new PdfInteractiveBorder({width: 1, style: PdfBorderStyle.solid}),
     *     checked: true
     *   }
     * ));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(name: string, bounds: Rectangle, page: PdfPage, properties: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        checked?: boolean
    })
    constructor(name?: string, bounds?: Rectangle, page?: PdfPage, properties?: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        checked?: boolean
    }) {
        super();
        if (page && name && bounds) {
            this._initialize(page, name, bounds);
        }
        if (properties) {
            if ('toolTip' in properties && _isNullOrUndefined(properties.toolTip)) {
                this.toolTip = properties.toolTip;
            }
            if ('color' in properties && _isNullOrUndefined(properties.color)) {
                this.color = properties.color;
            }
            if ('border' in properties && _isNullOrUndefined(properties.border)) {
                this.border = properties.border;
            }
            if ('backColor' in properties && _isNullOrUndefined(properties.backColor)) {
                this.backColor = properties.backColor;
            }
            if ('borderColor' in properties && _isNullOrUndefined(properties.borderColor)) {
                this.borderColor = properties.borderColor;
            }
            if ('checked' in properties && _isNullOrUndefined(properties.checked)) {
                this.checked = properties.checked;
            }
        }
    }
    /**
     * Parse an existing check box field.
     *
     * @private
     * @param {PdfForm} form Form object.
     * @param {_PdfDictionary} dictionary Field dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference object.
     * @param {_PdfReference} reference Field reference.
     * @returns {PdfCheckBoxField} Check box field.
     */
    static _load(form: PdfForm,
                 dictionary: _PdfDictionary,
                 crossReference: _PdfCrossReference,
                 reference: _PdfReference): PdfCheckBoxField {
        const field: PdfCheckBoxField = new PdfCheckBoxField();
        field._isLoaded = true;
        field._form = form;
        field._dictionary = dictionary;
        field._crossReference = crossReference;
        field._ref = reference;
        field._defaultIndex = 0;
        field._parsedItems = new Map<number, PdfStateItem>();
        if (field._dictionary.has('Kids')) {
            field._kids = field._dictionary.get('Kids');
        } else {
            const item: PdfStateItem = PdfStateItem._load(dictionary, crossReference, field);
            item._isLoaded = true;
            item._ref = reference;
            field._parsedItems.set(0, item);
        }
        return field;
    }
    /**
     * Gets the item at the specified index.
     *
     * @param {number} index Index of the field item.
     * @returns {PdfStateItem} Field item at the index.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the check box field
     * let field: PdfCheckBoxField = form.fieldAt(0) as PdfCheckBoxField;
     * // Gets the first list item.
     * let item: PdfStateItem = field.itemAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    itemAt(index: number): PdfStateItem {
        if (index < 0 || (index !== 0 && index >= this._kidsCount)) {
            throw Error('Index out of range.');
        }
        let item: PdfStateItem;
        if (this._parsedItems.has(index)) {
            item = this._parsedItems.get(index);
        } else {
            let dictionary: _PdfDictionary;
            if (index >= 0 && this._kids && this._kids.length > 0 && index < this._kids.length) {
                const ref: _PdfReference = this._kids[<number>index];
                if (ref && ref instanceof _PdfReference) {
                    dictionary = this._crossReference._fetch(ref);
                }
                if (dictionary) {
                    item = PdfStateItem._load(dictionary, this._crossReference, this);
                    item._isLoaded = true;
                    item._ref = ref;
                    this._parsedItems.set(index, item);
                }
            }
        }
        return item;
    }
    /**
     * Gets the font of the field.
     *
     * @returns {PdfFont} font.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
     * // Gets the font of the field.
     * let font: PdfFont = field.font;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get font(): PdfFont {
        if (this._font) {
            return this._font;
        } else {
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            this._font = _obtainFontDetails(this._form, widget, this);
        }
        return this._font;
    }
    /**
     * Sets the font of the field.
     *
     * @param {PdfFont} value font.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
     * // Sets the font of the field
     * field.font = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set font(value: PdfFont) {
        if (value && value instanceof PdfFont) {
            this._font = value;
            this._initializeFont(value);
        }
    }
    /**
     * Gets the flag indicating whether the field is checked or not.
     *
     * @returns {boolean} Checked.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the check box field
     * let field: PdfCheckBoxField = form.fieldAt(0) as PdfCheckBoxField;
     * // Gets the flag indicating whether the field is checked or not.
     * let checked: Boolean = field.checked;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get checked(): boolean {
        return (this._kidsCount > 0) ? this.itemAt(this._defaultIndex).checked : _checkField(this._dictionary);
    }
    /**
     * Sets the flag indicating whether the field is checked or not.
     *
     * @param {boolean} value Checked.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the check box field
     * let field: PdfCheckBoxField = form.fieldAt(0) as PdfCheckBoxField;
     * // Sets the flag indicating whether the field is checked or not.
     * field.checked = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set checked(value: boolean) {
        if (this.checked !== value) {
            if (this._kidsCount > 0) {
                for (let i: number = 0; i < this._kidsCount; i++) {
                    const kidItem: PdfStateItem = this.itemAt(i) as PdfStateItem;
                    if (kidItem.checked !== value) {
                        kidItem.checked = value;
                    }
                }
            }
            if (value) {
                if (this._isLoaded) {
                    const entry: string = _getItemValue((this._kidsCount > 0) ?
                        this.itemAt(this._defaultIndex)._dictionary : this._dictionary);
                    this._dictionary.update('V', _PdfName.get(entry));
                    this._dictionary.update('AS', _PdfName.get(entry));
                } else {
                    this._dictionary.update('V', _PdfName.get(this.exportValue));
                    this._dictionary.update('AS', _PdfName.get(this.exportValue));
                }
            } else {
                if (this._dictionary.has('V')) {
                    delete this._dictionary._map.V;
                }
                if (this._dictionary.has('AS')) {
                    delete this._dictionary._map.AS;
                }
            }
            this._dictionary._updated = true;
        }
    }
    /**
     * Gets the export value of the check box field.
     *
     * @returns {boolean} Checked.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the check box field
     * let field: PdfCheckBoxField = form.fieldAt(0) as PdfCheckBoxField;
     * // Gets the export value of the checkbox field.
     * let value: string = field.exportValue;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get exportValue(): string {
        return this._isLoaded ? _getItemValue(this._dictionary) : this._exportValue;
    }
    /**
     * Sets the export value of the check box field.
     *
     * @param {boolean} value Checked.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the check box field
     * let field: PdfCheckBoxField = form.fieldAt(0) as PdfCheckBoxField;
     * // Sets the export value.
     * field.exportValue = 'Value';
     * // Set the chexk box field as checked
     * field.checked = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set exportValue(value: string) {
        if (this.itemAt(this._defaultIndex)) {
            this.itemAt(this._defaultIndex).exportValue = value;
        }
        if (!(this._dictionary.has('V'))) {
            this._exportValue = value;
        }
    }
    /**
     * Gets the text alignment in a check box field.
     *
     * @returns {PdfTextAlignment} Text alignment.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access check box field
     * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
     * // Gets the text alignment from check box field
     * let alignment: PdfTextAlignment = field.textAlignment;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textAlignment(): PdfTextAlignment {
        return this._getTextAlignment();
    }
    /**
     * Sets the text alignment in a check box field.
     *
     * @param {PdfTextAlignment} value Text alignment.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access check box field
     * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
     * // Sets the text alignment of form field as center
     * field.textAlignment = PdfTextAlignment.center;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textAlignment(value: PdfTextAlignment) {
        if (this._textAlignment !== value) {
            this._setTextAlignment(value);
        }
    }
    /**
     * Gets the background color of the field.
     *
     * @returns {PdfColor} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the background color of the field.
     * let backColor: PdfColor = field.backColor;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get backColor(): PdfColor {
        return this._parseBackColor(true);
    }
    /**
     * Sets the background color of the field.
     *
     * @param {PdfColor} value Array with R, G, B, A color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the check box field at index 0
     * let checkBox1: PdfField = document.form.fieldAt(0);
     * // Sets the background color of the field.
     * checkBox1.backColor = {r: 255, g: 0, b: 0};
     * // Access the check box field at index 1
     * let checkBox2: PdfField = document.form.fieldAt(1);
     * // Sets the background color of the field to transparent.
     * checkBox2.backColor = {r: 0, g: 0, b: 0, isTransparent: true};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set backColor(value: PdfColor) {
        this._updateBackColor(value, true);
    }
    /**
     * Gets the border color of the field.
     *
     * @returns {PdfColor} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the border color of the field.
     * let borderColor: PdfColor = field.borderColor;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get borderColor(): PdfColor {
        return this._parseBorderColor(true);
    }
    /**
     * Sets the border color of the field.
     *
     * @param {PdfColor} value Array with R, G, B, A color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the border color of the field.
     * field.borderColor = {r: 255, g: 0, b: 0};
     * // Sets the background color of the field to transparent.
     * field.backColor = {r: 0, g: 0, b: 0, isTransparent: true};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set borderColor(value: PdfColor) {
        this._updateBorderColor(value, true);
        if (this._isLoaded) {
            this._setAppearance = true;
        }
    }
    _initialize(page: PdfPage, name: string, bounds: Rectangle): void {
        this._crossReference = page._crossReference;
        this._page = page;
        this._name = name;
        this._defaultIndex = 0;
        this._dictionary = new _PdfDictionary(this._crossReference);
        this._ref = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(this._ref, this._dictionary);
        this._dictionary.objId = this._ref.toString();
        this._dictionary.update('FT', _PdfName.get('Btn'));
        this._dictionary.update('T', name);
        this._createItem(bounds);
    }
    _createItem(bounds: Rectangle): void {
        const widget: PdfStateItem = new PdfStateItem();
        widget._create(this._page, bounds, this);
        widget.textAlignment = PdfTextAlignment.center;
        this._stringFormat = new PdfStringFormat(widget.textAlignment, PdfVerticalAlignment.middle);
        widget._dictionary.update('MK', new _PdfDictionary(this._crossReference));
        widget._mkDictionary.update('BC', [0, 0, 0]);
        widget._mkDictionary.update('BG', [1, 1, 1]);
        widget.style = PdfCheckBoxStyle.check;
        widget._dictionary.update('DA', '/TiRo 0 Tf 0 0 0 rg');
        this._addToKid(widget);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        const count: number = this._kidsCount;
        if (!this._isLoaded) {
            for (let i: number = 0; i < count; i++) {
                const item: PdfStateItem = this.itemAt(i);
                if (item) {
                    const state: _PdfCheckFieldState = item.checked ? _PdfCheckFieldState.checked : _PdfCheckFieldState.unchecked;
                    item._postProcess(item.checked ? item.exportValue : 'Off');
                    if (isFlatten) {
                        const template: PdfTemplate = this._createAppearance(item, state);
                        this._drawTemplate(template, item._getPage(), item.bounds);
                    } else {
                        this._drawAppearance(item, item.exportValue);
                    }
                    item._dictionary._updated = !isFlatten;
                }
            }
        } else if (isFlatten || this._setAppearance || this._dictionary._updated || this._isImport) {
            if (count > 0) {
                for (let i: number = 0; i < count; i++) {
                    const item: PdfStateItem = this.itemAt(i);
                    if (item) {
                        if (!this._checkFieldFlag(item._dictionary)) {
                            if (isFlatten) {
                                let template: PdfTemplate;
                                const state: _PdfCheckFieldState = item.checked ?
                                    _PdfCheckFieldState.checked :
                                    _PdfCheckFieldState.unchecked;
                                if (this._setAppearance || this._form._setAppearance || !item._dictionary.has('AP')) {
                                    template = this._createAppearance(item, state);
                                } else {
                                    template = _getStateTemplate(state, item);
                                }
                                this._drawTemplate(template, item._getPage(), item.bounds);
                            } else if (this._setAppearance || this._form._setAppearance || !item._isLoaded) {
                                item._postProcess(item.checked ? item.exportValue : 'Off');
                                this._drawAppearance(item, item.exportValue);
                            }
                        }
                        item._dictionary._updated = !isFlatten;
                    }
                }
            } else {
                const style: _PdfCheckFieldState = this.checked ?
                    _PdfCheckFieldState.checked :
                    _PdfCheckFieldState.unchecked;
                this._drawTemplate(_getStateTemplate(style, this), this.page, this.bounds);
            }
        }
        this._dictionary._updated = !isFlatten;
    }
    _createAppearance(widget: PdfStateItem, state: _PdfCheckFieldState): PdfTemplate {
        const bounds: {x: number, y: number, width: number, height: number} = widget.bounds;
        const parameter: _PaintParameter = new _PaintParameter();
        parameter.bounds = {x: 0, y: 0, width: bounds.width, height: bounds.height};
        const backcolor: PdfColor = widget.backColor;
        if (backcolor && !backcolor.isTransparent) {
            parameter.backBrush = new PdfBrush(backcolor);
        }
        parameter.foreBrush = new PdfBrush(widget.color);
        const border: PdfInteractiveBorder = widget.border;
        if (widget.borderColor) {
            parameter.borderPen = new PdfPen(widget.borderColor, border.width);
        }
        parameter.borderWidth = border.width;
        parameter.borderStyle = border.style;
        if (backcolor) {
            const shadowColor: number[] = [backcolor.r - 64, backcolor.g - 64, backcolor.b - 64];
            const color: PdfColor = {r: shadowColor[0] >= 0 ? shadowColor[0] : 0,
                g: shadowColor[1] >= 0 ? shadowColor[1] : 0,
                b: shadowColor[2] >= 0 ? shadowColor[2] : 0};
            parameter.shadowBrush = new PdfBrush(color);
        }
        parameter.rotationAngle = widget.rotate;
        const template: PdfTemplate = new PdfTemplate(parameter.bounds, this._crossReference);
        const graphics: PdfGraphics = template.graphics;
        if (widget._styleText) {
            this._drawCheckBox(graphics, parameter, widget._styleText, state);
        } else {
            this._drawCheckBox(graphics, parameter, _styleToString(widget._style), state);
        }
        return template;
    }
    _drawAppearance(item: PdfStateItem, itemValue?: string): void {
        let appearance: _PdfDictionary = new _PdfDictionary();
        if (item._dictionary.has('AP')) {
            appearance = item._dictionary.get('AP');
            if (appearance) {
                if (appearance.has('N')) {
                    _removeReferences(appearance.get('N'), this._crossReference, 'Yes', 'Off');
                }
                if (appearance.has('D')) {
                    _removeReferences(appearance.get('D'), this._crossReference, 'Yes', 'Off');
                }
            }
            _removeDuplicateReference(appearance, this._crossReference, 'N');
            _removeDuplicateReference(appearance, this._crossReference, 'D');
        } else {
            const reference: _PdfReference = this._crossReference._getNextReference();
            appearance = new _PdfDictionary(this._crossReference);
            this._crossReference._cacheMap.set(reference, appearance);
            item._dictionary.update('AP', reference);
        }
        const normalChecked: PdfTemplate = this._createAppearance(item, _PdfCheckFieldState.checked);
        const normalCheckedReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(normalCheckedReference, normalChecked._content);
        const normalUnchecked: PdfTemplate = this._createAppearance(item, _PdfCheckFieldState.unchecked);
        const normalUncheckedReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(normalUncheckedReference, normalUnchecked._content);
        const normalDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        if (itemValue !== null && typeof itemValue !== 'undefined') {
            normalDictionary.update(itemValue, normalCheckedReference);
        } else {
            normalDictionary.update('Yes', normalCheckedReference);
        }
        normalDictionary.update('Off', normalUncheckedReference);
        const normalReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(normalReference, normalDictionary);
        appearance.update('N', normalReference);
        const pressChecked: PdfTemplate = this._createAppearance(item, _PdfCheckFieldState.pressedChecked);
        const pressCheckedReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(pressCheckedReference, pressChecked._content);
        const pressUnchecked: PdfTemplate = this._createAppearance(item, _PdfCheckFieldState.pressedUnchecked);
        const pressUncheckedReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(pressUncheckedReference, pressUnchecked._content);
        const pressedDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        if (itemValue !== null && typeof itemValue !== 'undefined') {
            pressedDictionary.update(itemValue, pressCheckedReference);
        } else {
            pressedDictionary.update('Yes', pressCheckedReference);
        }
        pressedDictionary.update('Off', pressUncheckedReference);
        const pressedReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(pressedReference, pressedDictionary);
        appearance.update('D', pressedReference);
        item._dictionary._updated = true;
    }
}
/**
 * `PdfRadioButtonListField` class represents the radio button field objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new radio button list field
 * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
 * // Create and add first item
 * let first: PdfRadioButtonListItem = field.add('1-9', {x: 100, y: 140, width: 20, height: 20});
 * // Create and add second item
 * let second: PdfRadioButtonListItem = new PdfRadioButtonListItem('10-49', {x: 100, y: 170, width: 20, height: 20}, page);
 * field.add(second);
 * // Sets selected index of the radio button list field
 * field.selectedIndex = 0;
 * // Add the field into PDF form
 * form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfRadioButtonListField extends PdfField {
    _parsedItems: Map<number, PdfRadioButtonListItem>;
    _selectedIndex: number = -1;
    _allowUnisonSelection: boolean = false;
    _hasDuplicates: boolean = false;
    /**
     * Represents a radio button list field of the PDF document.
     *
     * @private
     */
    constructor()
    /**
     * Represents a radio button list field of the PDF document.
     *
     * @param {PdfPage} page The page where the field is drawn.
     * @param {string} name The name of the field.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
     * // Create and add first item
     * let first: PdfRadioButtonListItem = field.add('1-9', {x: 100, y: 140, width: 20, height: 20});
     * // Create and add second item
     * let second: PdfRadioButtonListItem = new PdfRadioButtonListItem('10-49', {x: 100, y: 170, width: 20, height: 20}, page);
     * field.add(second);
     * // Sets selected index of the radio button list field
     * field.selectedIndex = 0;
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string)
    /**
     * Represents a radio button list field (group of mutually exclusive options).
     *
     * @param {PdfPage} page The page where the field dictionary is created.
     * @param {string} name The unique name of the field.
     * @param {object} properties Required properties bag.
     * @param {{name: string, bounds: Rectangle}[]} properties.items Radio button items to create (each with a name/value and bounds).
     * @param {string} [properties.toolTip] Tooltip text shown by the viewer.
     * @param {PdfColor} [properties.color] Fore color of the marker (RGB).
     * @param {PdfColor} [properties.backColor] Background color for items.
     * @param {PdfColor} [properties.borderColor] Border color for items.
     * @param {PdfInteractiveBorder} [properties.border] Border settings for items (width, style, dash).
     * @param {number} [properties.selectedIndex] Zero-based selected index (default: 0).
     * @param {boolean} [properties.allowUnisonSelection] When true, allows the group selection to synchronize across widgets with the same value (if supported).
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Add new radio button list field into PDF form
     * document.form.add(new PdfRadioButtonListField(
     *   page,
     *   'AgeGroup',
     *   {
     *     items: [
     *       { name: '18-25', bounds: { x: 50, y: 480, width: 14, height: 14 } },
     *       { name: '26-35', bounds: { x: 50, y: 460, width: 14, height: 14 } },
     *       { name: '36-45', bounds: { x: 50, y: 440, width: 14, height: 14 } }
     *     ],
     *     toolTip: 'Select an age range',
     *     selectedIndex: 1,
     *     allowUnisonSelection: false
     *   }
     * ));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, properties: {
        items: { name: string, bounds: Rectangle }[],
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        selectedIndex?: number,
        allowUnisonSelection?: boolean
    })
    constructor(page?: PdfPage, name?: string, properties?: {
        items: { name: string, bounds: Rectangle }[],
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        selectedIndex?: number,
        allowUnisonSelection?: boolean
    }) {
        super();
        if (page && name) {
            this._initialize(page, name);
        }
        if (properties) {
            if ('items' in properties && _isNullOrUndefined(properties.items)) {
                properties.items.forEach((item: {name: string, bounds: Rectangle}) => {
                    this.add(new PdfRadioButtonListItem(item.name, item.bounds, this));
                });
            }
            if ('toolTip' in properties && _isNullOrUndefined(properties.toolTip)) {
                this.toolTip = properties.toolTip;
            }
            if ('color' in properties && _isNullOrUndefined(properties.color)) {
                this.color = properties.color;
            }
            if ('border' in properties && _isNullOrUndefined(properties.border)) {
                this.border = properties.border;
            }
            if ('backColor' in properties && _isNullOrUndefined(properties.backColor)) {
                this.backColor = properties.backColor;
            }
            if ('borderColor' in properties && _isNullOrUndefined(properties.borderColor)) {
                this.borderColor = properties.borderColor;
            }
            if ('allowUnisonSelection' in properties && _isNullOrUndefined(properties.allowUnisonSelection)) {
                this.allowUnisonSelection = properties.allowUnisonSelection;
            }
            if ('selectedIndex' in properties && _isNullOrUndefined(properties.selectedIndex)) {
                this.selectedIndex = properties.selectedIndex;
            }
        }
    }
    /**
     * Parse an existing radio button list field.
     *
     * @private
     * @param {PdfForm} form Form object.
     * @param {_PdfDictionary} dictionary Field dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference object.
     * @param {_PdfReference} reference Field reference.
     * @returns {PdfRadioButtonListField} Radio button list field.
     */
    static _load(form: PdfForm,
                 dictionary: _PdfDictionary,
                 crossReference: _PdfCrossReference,
                 reference: _PdfReference): PdfRadioButtonListField {
        const field: PdfRadioButtonListField = new PdfRadioButtonListField();
        field._isLoaded = true;
        field._form = form;
        field._dictionary = dictionary;
        field._crossReference = crossReference;
        field._ref = reference;
        if (field._dictionary.has('Kids')) {
            field._kids = field._dictionary.get('Kids');
        }
        field._defaultIndex = 0;
        field._parsedItems = new Map<number, PdfRadioButtonListItem>();
        if (field._kidsCount > 0) {
            field._retrieveOptionValue();
        }
        return field;
    }
    /**
     * Gets the flag indicating whether the field is checked or not (Read only).
     *
     * @returns {boolean} Checked.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the radio button list field
     * let field: PdfRadioButtonListField = form.fieldAt(0) as PdfRadioButtonListField;
     * // Gets the flag indicating whether the field is checked or not.
     * let checked: boolean = field.checked;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get checked(): boolean {
        let check: boolean = false;
        if (this._kidsCount > 0) {
            check = this.itemAt(this._defaultIndex).checked;
        }
        return check;
    }
    /**
     * Gets the selected item index.
     *
     * @returns {number} Index.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the radio button list field
     * let field: PdfRadioButtonListField = form.fieldAt(0) as PdfRadioButtonListField;
     * // Gets the selected index.
     * let index: number = field.selectedIndex;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get selectedIndex(): number {
        if (this._isLoaded && this._selectedIndex === -1) {
            this._selectedIndex = this._obtainSelectedIndex();
        }
        return this._selectedIndex;
    }
    /**
     * Sets the selected item index.
     *
     * @param {number} value Selected index.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
     * // Create and add first item
     * let first: PdfRadioButtonListItem = field.add('1-9', {x: 100, y: 140, width: 20, height: 20});
     * // Create and add second item
     * let second: PdfRadioButtonListItem = new PdfRadioButtonListItem('10-49', {x: 100, y: 170, width: 20, height: 20}, page);
     * field.add(second);
     * // Sets selected index of the radio button list field
     * field.selectedIndex = 0;
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set selectedIndex(value: number) {
        if (this.selectedIndex !== value) {
            this._selectedIndex = value;
            const selectedItem: PdfRadioButtonListItem = this.itemAt(value);
            this._hasDuplicates = this._hasDuplicateItems();
            for (let i: number = 0; i < this._kidsCount; i++) {
                const item: PdfRadioButtonListItem = this.itemAt(i);
                if (this.allowUnisonSelection) {
                    if (item.value === selectedItem.value) {
                        item._dictionary.update('AS', _PdfName.get(item.value));
                        this._dictionary.update('V', _PdfName.get(item.value));
                        this._dictionary.update('DV', _PdfName.get(item.value));
                    } else {
                        item._dictionary.update('AS', _PdfName.get('Off'));
                    }
                } else {
                    if (i === value) {
                        if (!this._hasDuplicates) {
                            item._dictionary.update('AS', _PdfName.get(item.value));
                            this._dictionary.update('V', _PdfName.get(item.value));
                            this._dictionary.update('DV', _PdfName.get(item.value));
                        } else {
                            item._dictionary.update('AS', _PdfName.get(i.toString()));
                            this._dictionary.update('V', _PdfName.get(i.toString()));
                            this._dictionary.update('DV', _PdfName.get(i.toString()));
                        }
                    } else {
                        item._dictionary.update('AS', _PdfName.get('Off'));
                    }
                }
            }
        }
    }
    _hasDuplicateItems(): boolean {
        if (this._kidsCount > 2 || this.itemsCount > 2) {
            const seenValues: Set<string> = new Set();
            const duplicateValues: Set<string> = new Set();
            for (let j: number = 0; j < this._kidsCount; j++) {
                const items: PdfRadioButtonListItem = this.itemAt(j);
                if (seenValues.has(items.value)) {
                    if (!duplicateValues.has(items.value)) {
                        duplicateValues.add(items.value);
                    }
                } else {
                    seenValues.add(items.value);
                }
            }
            return duplicateValues.size > 0;
        }
        return false;
    }
    /**
     * Gets a value that specifies whether multiple radio buttons in the same group can be selected simultaneously within the form.
     *
     * @returns {boolean} Indicates if unison selection is enabled.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the form
     * let form: PdfForm = document.form;
     * // Gets the value indicating if unison selection is enabled
     * let isUnisonSelectionEnabled: boolean = form.allowUnisonSelection;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get allowUnisonSelection(): boolean {
        return this._allowUnisonSelection;
    }
    /**
     * Sets a value that specifies whether multiple radio buttons in the same group can be selected simultaneously within the form.
     *
     * @param {boolean} value Enable or disable unison selection. The default value is false.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the form
     * let form: PdfForm = document.form;
     * // Disable the unison selection.
     * form.allowUnisonSelection = false;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set allowUnisonSelection(value: boolean) {
        this._allowUnisonSelection = value;
    }
    /**
     * Gets the border color of the field.
     *
     * @returns {PdfColor} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the border color of the field.
     * let borderColor: PdfColor = field.borderColor;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get borderColor(): PdfColor {
        return this._parseBorderColor(!this._isLoaded);
    }
    /**
     * Sets the border color of the field.
     *
     * @param {PdfColor} value Array with R, G, B, A color values in between 0 to 255.
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the border color of the field.
     * field.borderColor = {r: 255, g: 0, b: 0};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set borderColor(value: PdfColor) {
        this._updateBorderColor(value, true);
    }
    /**
     * Gets the item at the specified index.
     *
     * @param {number} index Index of the field item.
     * @returns {PdfRadioButtonListItem} Field item at the index.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the radio button list field
     * let field: PdfRadioButtonListField = form.fieldAt(0) as PdfRadioButtonListField;
     * // Gets the first list item.
     * let item: PdfRadioButtonListField = field.itemAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    itemAt(index: number): PdfRadioButtonListItem {
        if (index < 0 || (index !== 0 && index >= this._kidsCount)) {
            throw Error('Index out of range.');
        }
        let item: PdfRadioButtonListItem;
        if (this._parsedItems.has(index)) {
            item = this._parsedItems.get(index);
        } else {
            let dictionary: _PdfDictionary;
            if (index >= 0 && this._kids && this._kids.length > 0 && index < this._kids.length) {
                const ref: _PdfReference = this._kids[<number>index];
                if (ref && ref instanceof _PdfReference) {
                    dictionary = this._crossReference._fetch(ref);
                }
                if (dictionary) {
                    item = PdfRadioButtonListItem._load(dictionary, this._crossReference, this);
                    item._ref = ref;
                    item._index = index;
                    this._parsedItems.set(index, item);
                }
            }
        }
        return item;
    }
    /**
     * Add list item to the field.
     *
     * @param {PdfRadioButtonListItem} item List item.
     * @returns {number} Index of the added item.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
     * // Create and add first item
     * let first: PdfRadioButtonListItem = field.add('1-9', {x: 100, y: 140, width: 20, height: 20});
     * // Create and add second item
     * let second: PdfRadioButtonListItem = new PdfRadioButtonListItem('10-49', {x: 100, y: 170, width: 20, height: 20}, page);
     * Add list item to the field
     * field.add(second);
     * // Sets selected index of the radio button list field
     * field.selectedIndex = 0;
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(item: PdfRadioButtonListItem): number
    /**
     * Add list item to the field.
     *
     * @param {string} value Name of the list item.
     * @param {Rectangle} bounds Bounds of the list item.
     * @returns {PdfRadioButtonListItem} Added item.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
     * // Create and add first item
     * let first: PdfRadioButtonListItem = field.add('1-9', {x: 100, y: 140, width: 20, height: 20});
     * // Create and add second item
     * let second: PdfRadioButtonListItem = new PdfRadioButtonListItem('10-49', {x: 100, y: 170, width: 20, height: 20}, page);
     * Add list item to the field
     * field.add(second);
     * // Sets selected index of the radio button list field
     * field.selectedIndex = 0;
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(value: string, bounds: Rectangle): PdfRadioButtonListItem
    add(value?: string | PdfRadioButtonListItem,
        bounds?: Rectangle): PdfRadioButtonListItem | number {
        if (value instanceof PdfRadioButtonListItem) {
            value._field = this;
            value._dictionary.update('Parent', this._ref);
            value._setField(this);
            return this._kidsCount;
        } else {
            return new PdfRadioButtonListItem(value, bounds, this);
        }
    }
    /**
     * Remove the radio button list item from the specified index.
     *
     * @param {number} index Item index to remove.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Remove the first item of the form field
     * field.removeItemAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removeItemAt(index: number): void {
        const item: PdfRadioButtonListItem = this.itemAt(index);
        if (item && item._ref) {
            const page: PdfPage = item._getPage();
            if (page) {
                page._removeAnnotation(item._ref);
            }
            this._kids.splice(index, 1);
            this._dictionary.set('Kids', this._kids);
            this._dictionary._updated = true;
            this._parsedItems.delete(index);
            if (this._parsedItems.size > 0) {
                const parsedItems: Map<number, PdfRadioButtonListItem> = new Map<number, PdfRadioButtonListItem>();
                this._parsedItems.forEach((value: PdfRadioButtonListItem, key: number) => {
                    if (key > index) {
                        parsedItems.set(key - 1, value);
                    } else {
                        parsedItems.set(key, value);
                    }
                });
                this._parsedItems = parsedItems;
            }
            if (this._dictionary.has('Opt')) {
                const options: string[] = this._dictionary.getArray('Opt');
                if (options && options.length > 0) {
                    options.splice(index, 1);
                    this._dictionary.set('Opt', options);
                }
            }
        }
    }
    /**
     * Remove the specified radio button list field item.
     *
     * @param {PdfRadioButtonListItem} item Item to remove.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Remove the first item of the form field
     * field.removeItem(field.itemAt(0));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removeItem(item: PdfRadioButtonListItem): void {
        if (item && item._ref) {
            const index: number = this._kids.indexOf(item._ref);
            if (index !== -1) {
                this.removeItemAt(index);
            }
        }
    }
    _initialize(page: PdfPage, name: string): void {
        this._defaultIndex = 0;
        this._crossReference = page._crossReference;
        this._page = page;
        this._name = name;
        this._dictionary = new _PdfDictionary(this._crossReference);
        this._ref = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(this._ref, this._dictionary);
        this._dictionary.objId = this._ref.toString();
        this._dictionary.update('FT', _PdfName.get('Btn'));
        this._dictionary.update('T', name);
        this._parsedItems = new Map<number, PdfRadioButtonListItem>();
        this._fieldFlags |= _FieldFlag.radio;
    }
    _retrieveOptionValue(): void {
        if (this._dictionary.has('Opt')) {
            const options: string[] = this._dictionary.getArray('Opt');
            if (options && options.length > 0) {
                const itemsCount: number = this._kidsCount;
                const count: number = options.length <= itemsCount ? options.length : itemsCount;
                for (let i: number = 0; i < count; i++) {
                    if (options[<number>i]) {
                        this.itemAt(i)._optionValue = options[<number>i];
                    }
                }
            }
        }
    }
    _obtainSelectedIndex(): number {
        let index: number = -1;
        for (let i: number = 0; i < this._kidsCount; ++i) {
            const item: PdfRadioButtonListItem = this.itemAt(i);
            if (item) {
                const checkName: _PdfName | string = _getInheritableProperty(item._dictionary, 'V', false, true, 'Parent');
                if (checkName && item._dictionary.has('AS')) {
                    const asName: _PdfName = item._dictionary.get('AS');
                    if (asName && asName.name.toLowerCase() !== 'off') {
                        if (checkName instanceof _PdfName && checkName.name.toLowerCase() !== 'off') {
                            if (asName.name === checkName.name || item._optionValue === checkName.name) {
                                index = i;
                                break;
                            }
                        } else if (typeof checkName === 'string' && checkName.toLowerCase() !== 'off') {
                            if (asName.name === checkName || item._optionValue === checkName) {
                                index = i;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return index;
    }
    _doPostProcess(isFlatten: boolean = false): void {
        this._hasDuplicates = this._hasDuplicateItems();
        const count: number = this._kidsCount;
        if (this._isLoaded) {
            if (count > 0) {
                for (let i: number = 0; i < count; i++) {
                    const item: PdfRadioButtonListItem = this.itemAt(i);
                    if (item && !this._checkFieldFlag(item._dictionary)) {
                        if (isFlatten) {
                            let template: PdfTemplate;
                            const state: _PdfCheckFieldState = this.selectedIndex === i ?
                                _PdfCheckFieldState.checked :
                                _PdfCheckFieldState.unchecked;
                            if (this._setAppearance || this._form._setAppearance || !item._dictionary.has('AP')) {
                                template = this._createAppearance(item, state);
                            } else {
                                template = _getStateTemplate(state, item);
                            }
                            this._drawTemplate(template, item._getPage(), item.bounds);
                        } else if (this._setAppearance || this._form._setAppearance || !item._isLoaded) {
                            item._postProcess(this.allowUnisonSelection ? item.value === this.itemAt(this.selectedIndex).value ? item.value : 'Off' :
                                this._hasDuplicates ? (this.selectedIndex === i ? i.toString() : 'Off') : (this.selectedIndex === i ? item.value : 'Off'));
                            this._drawAppearance(item);
                        }
                        item._dictionary._updated = !isFlatten;
                    }
                }
            } else {
                const style: _PdfCheckFieldState = this.selectedIndex !== -1 ?
                    _PdfCheckFieldState.checked :
                    _PdfCheckFieldState.unchecked;
                this._drawTemplate(_getStateTemplate(style, this), this.page, this.bounds);
            }
        } else {
            for (let i: number = 0; i < count; i++) {
                const item: PdfRadioButtonListItem = this.itemAt(i);
                const state: _PdfCheckFieldState = this.selectedIndex === i ? _PdfCheckFieldState.checked : _PdfCheckFieldState.unchecked;
                if (!this._isDuplicatePage) {
                    item._dictionary.update('AS', _PdfName.get(this.selectedIndex === i ? item.value : 'Off'));
                }
                if (isFlatten) {
                    const template: PdfTemplate = this._createAppearance(item, state);
                    this._drawTemplate(template, item._getPage(), item.bounds);
                } else if (!this._isDuplicatePage) {
                    item._postProcess(this.allowUnisonSelection ? item.value === this.itemAt(this.selectedIndex).value ? item.value : 'Off' :
                        this._hasDuplicates ? (this.selectedIndex === i ? i.toString() : 'Off') : (this.selectedIndex === i ? item.value : 'Off'));
                    this._drawAppearance(item);
                }
                item._dictionary._updated = !isFlatten;
            }
        }
        this._dictionary._updated = !isFlatten;
    }
    _createAppearance(widget: PdfRadioButtonListItem, state: _PdfCheckFieldState): PdfTemplate {
        const bounds: {x: number, y: number, width: number, height: number} = widget.bounds;
        const parameter: _PaintParameter = new _PaintParameter();
        parameter.bounds = {x: 0, y: 0, width: bounds.width, height: bounds.height};
        const backcolor: PdfColor = widget.backColor;
        if (backcolor) {
            parameter.backBrush = new PdfBrush(backcolor);
        }
        parameter.foreBrush = new PdfBrush(widget.color);
        const border: PdfInteractiveBorder = widget.border;
        if (widget.borderColor) {
            parameter.borderPen = new PdfPen(widget.borderColor, border.width);
        }
        parameter.borderWidth = border.width;
        parameter.borderStyle = border.style;
        if (backcolor) {
            const shadowColor: number[] = [backcolor.r - 64, backcolor.g - 64, backcolor.b - 64];
            const color: number[] = [shadowColor[0] >= 0 ? shadowColor[0] : 0,
                shadowColor[1] >= 0 ? shadowColor[1] : 0,
                shadowColor[2] >= 0 ? shadowColor[2] : 0];
            parameter.shadowBrush = new PdfBrush({r: color[0], g: color[1], b: color[2]});
        }
        parameter.rotationAngle = widget.rotate;
        const template: PdfTemplate = new PdfTemplate(parameter.bounds, this._crossReference);
        const graphics: PdfGraphics = template.graphics;
        if (widget._styleText) {
            this._drawRadioButton(graphics, parameter, widget._styleText, state);
        } else {
            this._drawRadioButton(graphics, parameter, _styleToString(widget.style), state);
        }
        return template;
    }
    _drawAppearance(item: PdfRadioButtonListItem): void {
        let appearance: _PdfDictionary = new _PdfDictionary();
        if (item._dictionary.has('AP')) {
            appearance = item._dictionary.get('AP');
            if (appearance) {
                if (appearance.has('N')) {
                    _removeReferences(appearance.get('N'), this._crossReference, item.value, 'Off');
                }
                if (appearance.has('D')) {
                    _removeReferences(appearance.get('D'), this._crossReference, item.value, 'Off');
                }
            }
            _removeDuplicateReference(appearance, this._crossReference, 'N');
            _removeDuplicateReference(appearance, this._crossReference, 'D');
        } else {
            const reference: _PdfReference = this._crossReference._getNextReference();
            appearance = new _PdfDictionary(this._crossReference);
            this._crossReference._cacheMap.set(reference, appearance);
            item._dictionary.update('AP', reference);
        }
        const normalChecked: PdfTemplate = this._createAppearance(item, _PdfCheckFieldState.checked);
        const normalCheckedReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(normalCheckedReference, normalChecked._content);
        const normalUnchecked: PdfTemplate = this._createAppearance(item, _PdfCheckFieldState.unchecked);
        const normalUncheckedReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(normalUncheckedReference, normalUnchecked._content);
        const normalDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const itemField : PdfRadioButtonListField = item._field as PdfRadioButtonListField;
        let actualValue: string = itemField.allowUnisonSelection
            ? item.value
            : (this._hasDuplicates ? (item._index).toString() : item.value);
        if (!actualValue && item._enableGrouping) {
            actualValue = 'check' + item._index;
        }
        normalDictionary.update(actualValue, normalCheckedReference);
        normalDictionary.update('Off', normalUncheckedReference);
        const normalReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(normalReference, normalDictionary);
        appearance.update('N', normalReference);
        const pressChecked: PdfTemplate = this._createAppearance(item, _PdfCheckFieldState.pressedChecked);
        const pressCheckedReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(pressCheckedReference, pressChecked._content);
        const pressUnchecked: PdfTemplate = this._createAppearance(item, _PdfCheckFieldState.pressedUnchecked);
        const pressUncheckedReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(pressUncheckedReference, pressUnchecked._content);
        const pressedDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        pressedDictionary.update(actualValue, pressCheckedReference);
        pressedDictionary.update('Off', pressUncheckedReference);
        const pressedReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(pressedReference, pressedDictionary);
        appearance.update('D', pressedReference);
        item._dictionary._updated = true;
    }
}
/**
 * Represents the base class for list box and combo box fields.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Access the combo box field
 * let comboBoxField: PdfListField = form.fieldAt(0) as PdfListField;
 * // Gets the count of the loaded combo box field items.
 * let comboItemsCount: number = comboBoxField.itemsCount;
 * // Access the list box field
 * let listBoxField: PdfListField = form.fieldAt(1) as PdfListField;
 * // Gets the count of the loaded list box field items.
 * let ListItemsCount: number = listBoxField.itemsCount;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export abstract class PdfListField extends PdfField {
    _optionArray: Array<string[]>;
    _parsedItems: Map<number, PdfListFieldItem>;
    _listValues : string[];
    _selectedIndex : number;
    _multiSelect: boolean;
    _editable: boolean;
    _widgetAnnot: PdfWidgetAnnotation;
    _bounds: {x: number, y: number, width: number, height: number};
    /**
     * Gets the count of the loaded field items (Read only).
     *
     * @returns {number} Items count.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the combo box field
     * let comboBoxField: PdfComboBoxField = form.fieldAt(0) as PdfComboBoxField;
     * // Gets the count of the loaded combo box field items.
     * let comboItemsCount: number = comboBoxField.itemsCount;
     * // Access the list box field
     * let listBoxField: PdfListBoxField = form.fieldAt(1) as PdfListBoxField;
     * // Gets the count of the loaded list box field items.
     * let ListItemsCount: number = listBoxField.itemsCount;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get itemsCount(): number {
        return this._options.length;
    }
    /**
     * Gets the bounds.
     *
     * @returns {Rectangle} Bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the combo box field
     * let comboBoxField: PdfComboBoxField = form.fieldAt(0) as PdfComboBoxField;
     * // Gets the bounds of combo box field.
     * let comboBoxBounds: Rectangle = comboBoxField.bounds;
     * // Access the combo box field
     * let listBoxField: PdfListBoxField = form.fieldAt(1) as PdfListBoxField;
     * // Gets the bounds of list box field.
     * let listBoxBounds: Rectangle = listBoxField.bounds;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bounds(): Rectangle {
        let value: Rectangle;
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (widget) {
            widget._page = this.page;
        }
        if (widget && widget.bounds) {
            value = widget.bounds;
        } else if (this._dictionary.has('Rect')) {
            value = _calculateBounds(this._dictionary, this.page);
        }
        if (value) {
            return value;
        } else if (this._bounds) {
            return this._bounds;
        }
        return value;
    }
    /**
     * Sets the bounds.
     *
     * @param {Rectangle} value bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the combo box field
     * let comboBoxField: PdfComboBoxField = form.fieldAt(0) as PdfComboBoxField;
     * // Sets the bounds of combo box field.
     * comboBoxField.bounds = {x: 10, y: 10, width: 100, height: 30};
     * // Access the list box field
     * let listBoxField: PdfListBoxField = form.fieldAt(1) as PdfListBoxField;
     * // Sets the bounds of list box field.
     * listBoxField.bounds = {x: 10, y: 50, width: 100, height: 30};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set bounds(value: Rectangle) {
        if (value.x === 0 && value.y === 0 && value.width === 0 && value.height === 0) {
            throw new Error('Cannot set empty bounds');
        }
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        if (this._isLoaded) {
            if (typeof widget === 'undefined' || this._dictionary.has('Rect')) {
                this._dictionary.update('Rect', _getUpdatedBounds([value.x, value.y, value.width, value.height], this.page));
            } else {
                widget._page = this.page;
                widget.bounds = value;
            }
        } else {
            if (widget) {
                widget._page = this.page;
                widget.bounds = value;
            } else {
                this._bounds = value;
            }
        }
    }
    /**
     * Gets the selected item index or indexes.
     *
     * @returns {number | number[]} Index.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the combo box field
     * let comboBoxfield: PdfComboBoxField = form.fieldAt(0) as PdfComboBoxField;
     * // Gets the selected item index or indexes from combo box field.
     * let comboBoxIndex: number = comboBoxfield.selectedIndex;
     * // Access the list box field
     * let listBoxField: PdfListBoxField = form.fieldAt(1) as PdfListBoxField;
     * // Gets the selected item index or indexes from list box field.
     * let listBoxIndex: number = listBoxField.selectedIndex;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get selectedIndex(): number | number[] {
        const value: number[] = this._dictionary.get('I');
        if (typeof value === 'undefined') {
            return [];
        } else {
            if (value.length === 1) {
                return value[0];
            } else {
                return value;
            }
        }
    }
    /**
     * Sets the selected item index or indexes.
     *
     * @param {number | number[]} value Selected index.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new list box field
     * let listField: PdfListField = new PdfListBoxField(page, 'list1', {x: 100, y: 60, width: 100, height: 50});
     * // Add list items to the field.
     * listField.addItem(new PdfListFieldItem('English', 'English'));
     * listField.addItem(new PdfListFieldItem('French', 'French'));
     * listField.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected index
     * listField.selectedIndex = 2;
     * // Sets the flag indicates whether the list box allows multiple selections.
     * listField.multiSelect = true;
     * // Add the field into PDF form
     * form.add(listField);
     * // Create a new combo box field
     * let comboField: PdfComboBoxField = new PdfComboBoxField(page, 'list1', {x: 100, y: 160, width: 100, height: 50});
     * // Add list items to the field.
     * comboField.addItem(new PdfListFieldItem('English', 'English'));
     * comboField.addItem(new PdfListFieldItem('French', 'French'));
     * comboField.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected index
     * comboField.selectedIndex = 2;
     * // Sets the flag indicates whether the combo box allows multiple selections.
     * comboField.multiSelect = true;
     * // Add the field into PDF form
     * form.add(comboField);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set selectedIndex(value: number | number[]) {
        const length: number = this._options.length;
        if (typeof value === 'number') {
            this._checkIndex(value, length);
            this._dictionary.update('I', [value]);
            this._dictionary.update('V', [this._options[<number>value][0]]);
        } else {
            const values: string[] = [];
            value.forEach((entry: number) => {
                this._checkIndex(entry, length);
                values.push(this._options[<number>entry][0]);
            });
            this._dictionary.update('I', value);
            this._dictionary.update('V', values);
        }
    }
    /**
     * Gets the selected item value or values.
     *
     * @returns {string | string[]} Selected values.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the list box field
     * let listBoxField: PdfListBoxField = form.fieldAt(0) as PdfListBoxField;
     * // Gets the selected item value or values from list box field.
     * if (listBoxField.multiSelect) {
     *     let listBoxValues: string[]; = listBoxField.selectedValue;
     * } else {
     *    let listBoxValues: string = listBoxField.selectedValue;
     * }
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get selectedValue(): string | string[] {
        const values: string[] = [];
        if (this._dictionary && this._dictionary.has('V')) {
            const value: any = this._dictionary.getArray('V'); // eslint-disable-line
            if (typeof value !== 'undefined') {
                if (Array.isArray(value)) {
                    values.push(...value);
                } else if (typeof value === 'string') {
                    values.push(value);
                }
            }
        }
        if (values.length === 0 && this._dictionary && this._dictionary.has('I')) {
            const value: number[] = this._dictionary.get('I');
            if (value && value.length > 0) {
                values.push(...value.map((index: number) => this._options[<number>index][0]));
            }
        }
        if (values.length === 1) {
            return values[0];
        } else {
            return values;
        }
    }
    /**
     * Sets the selected item value or values.
     *
     * @param {string | string[]} value Selected values.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new list box field
     * let listField: PdfListField = new PdfListBoxField(page, 'list1', {x: 100, y: 60, width: 100, height: 50});
     * // Add list items to the field.
     * listField.addItem(new PdfListFieldItem('English', 'English'));
     * listField.addItem(new PdfListFieldItem('French', 'French'));
     * listField.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the flag indicates whether the list box allows multiple selections.
     * listField.multiSelect = true;
     * // Sets the selected values
     * listField.selectedValue = ['English', 'German'];
     * // Add the field into PDF form
     * form.add(listField);
     * // Create a new combo box field
     * let comboField: PdfComboBoxField = new PdfComboBoxField(page, 'list1', {x: 100, y: 160, width: 100, height: 50});
     * // Add list items to the field.
     * comboField.addItem(new PdfListFieldItem('English', 'English'));
     * comboField.addItem(new PdfListFieldItem('French', 'French'));
     * comboField.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected value
     * comboField.selectedValue = ['French'];
     * // Add the field into PDF form
     * form.add(comboField);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set selectedValue(value: string | string[]) {
        if (typeof value === 'string') {
            const index: number = this._tryGetIndex(value);
            if (index !== -1) {
                this._dictionary.update('I', [index]);
                this._dictionary.update('V', [value]);
            }
        } else {
            const values: string[] = [];
            const indices: number[] = [];
            value.forEach((entry: string) => {
                const index: number = this._tryGetIndex(entry);
                if (index !== -1) {
                    indices.push(index);
                    values.push(entry);
                }
            });
            if (values.length > 0) {
                this._dictionary.update('I', indices);
                this._dictionary.update('V', values);
            }
        }
    }
    /**
     * Gets the flag indicates whether the list field allows multiple selections.
     *
     * @returns {boolean} Value indicates whether the list field allows multiple selections.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the combo box field
     * let comboBoxField: PdfComboBoxField = form.fieldAt(0) as PdfComboBoxField;
     * // Gets the flag indicates whether the combo box allows multiple selections.
     * let comboBoxFlag: Boolean = comboBoxField.multiSelect;
     * // Access the list box field
     * let listBoxField: PdfListBoxField = form.fieldAt(1) as PdfListBoxField;
     * // Gets the flag indicates whether the list box allows multiple selections.
     * let listBoxFlag: boolean = listBoxField.multiSelect;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get multiSelect(): boolean {
        if (this._isLoaded) {
            return (this._fieldFlags & _FieldFlag.multiSelect) !== 0;
        } else {
            return this._multiSelect;
        }
    }
    /**
     * Sets the flag indicates whether the list field allows multiple selections.
     *
     * @param {boolean} value Indicates whether the list field allows multiple selections.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new list box field
     * let listField: PdfListField = new PdfListBoxField(page, 'list1', {x: 100, y: 60, width: 100, height: 50});
     * // Add list items to the field.
     * listField.addItem(new PdfListFieldItem('English', 'English'));
     * listField.addItem(new PdfListFieldItem('French', 'French'));
     * listField.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected index
     * listField.selectedIndex = 2;
     * // Sets the flag indicates whether the list box allows multiple selections.
     * listField.multiSelect = true;
     * // Add the field into PDF form
     * form.add(listField);
     * // Create a new combo box field
     * let comboField: PdfComboBoxField = new PdfComboBoxField(page, 'list1', {x: 100, y: 160, width: 100, height: 50});
     * // Add list items to the field.
     * comboField.addItem(new PdfListFieldItem('English', 'English'));
     * comboField.addItem(new PdfListFieldItem('French', 'French'));
     * comboField.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected index
     * comboField.selectedIndex = 2;
     * // Sets the flag indicates whether the combo box allows multiple selections.
     * comboField.multiSelect = true;
     * // Add the field into PDF form
     * form.add(comboField);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set multiSelect(value: boolean) {
        if (this.multiSelect !== value) {
            this._multiSelect = value;
            if (value) {
                this._fieldFlags |= _FieldFlag.multiSelect;
            } else {
                this._fieldFlags &= ~_FieldFlag.multiSelect;
            }
        }
    }
    /**
     * Gets the flag indicates whether the list field is editable.
     *
     * @returns {boolean} Value indicates whether the list field is editable.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the combo box field
     * let comboBoxField: PdfComboBoxField = form.fieldAt(0) as PdfComboBoxField;
     * // Gets the flag indicates whether the combo box is editable.
     * let comboBoxFlag: Boolean = comboBoxField.editable;
     * // Access the list box field
     * let listBoxField: PdfListBoxField = form.fieldAt(1) as PdfListBoxField;
     * // Gets the flag indicates whether the list box is editable.
     * let listBoxFlag: boolean = listBoxField.editable;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get editable(): boolean {
        if (this._isLoaded) {
            return (this._fieldFlags & _FieldFlag.edit) !== 0;
        } else {
            return this._editable;
        }
    }
    /**
     * Sets the flag indicates whether the list field is editable.
     *
     * @param {boolean} value Indicates whether the list field is editable.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new list box field
     * let listField: PdfListField = new PdfListBoxField(page, 'list1', {x: 100, y: 60, width: 100, height: 50});
     * // Add list items to the field.
     * listField.addItem(new PdfListFieldItem('English', 'English'));
     * listField.addItem(new PdfListFieldItem('French', 'French'));
     * listField.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected index
     * listField.selectedIndex = 2;
     * // Sets the flag indicates whether the list box is editable.
     * listField.editable = true;
     * // Add the field into PDF form
     * form.add(listField);
     * // Create a new combo box field
     * let comboField: PdfComboBoxField = new PdfComboBoxField(page, 'list1', {x: 100, y: 160, width: 100, height: 50});
     * // Add list items to the field.
     * comboField.addItem(new PdfListFieldItem('English', 'English'));
     * comboField.addItem(new PdfListFieldItem('French', 'French'));
     * comboField.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected index
     * comboField.selectedIndex = 2;
     * // Sets the flag indicates whether the combo box is editable.
     * comboField.editable = true;
     * // Add the field into PDF form
     * form.add(comboField);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set editable(value: boolean) {
        if (this._editable !== value) {
            this._editable = value;
            if (value) {
                this._fieldFlags |= _FieldFlag.edit;
            } else {
                this._fieldFlags &= ~_FieldFlag.edit;
            }
        }
    }
    /**
     * Gets the font of the field.
     *
     * @returns {PdfFont} font.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfListBoxField = document.form.fieldAt(0) as PdfListBoxField;
     * // Gets the font of the field.
     * let font: PdfFont = field.font;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get font(): PdfFont {
        if (this._font) {
            return this._font;
        } else {
            const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            this._font = _obtainFontDetails(this._form, widget, this);
        }
        return this._font;
    }
    /**
     * Sets the font of the field.
     *
     * @param {PdfFont} value font.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfListBoxField = document.form.fieldAt(0) as PdfListBoxField;
     * // Sets the font of the field
     * field.font = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set font(value: PdfFont) {
        if (value && value instanceof PdfFont) {
            this._font = value;
            this._initializeFont(value);
        }
    }
    /**
     * Gets the text alignment in a combo box field.
     *
     * @returns {PdfTextAlignment} Text alignment.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access combo box field
     * let field: PdfComboBoxField = document.form.fieldAt(0) as PdfComboBoxField;
     * // Gets the text alignment from combo box field
     * let alignment: PdfTextAlignment = field.textAlignment;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textAlignment(): PdfTextAlignment {
        return this._getTextAlignment();
    }
    /**
     * Sets the text alignment in a combo box field.
     *
     * @param {PdfTextAlignment} value Text alignment.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access combo box field
     * let field: PdfComboBoxField = document.form.fieldAt(0) as PdfComboBoxField;
     * // Sets the text alignment of form field as center
     * field.textAlignment = PdfTextAlignment.center;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textAlignment(value: PdfTextAlignment) {
        if (this._textAlignment !== value) {
            this._setTextAlignment(value);
        }
    }
    /**
     * Gets the background color of the field.
     *
     * @returns {PdfColor} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the background color of the field.
     * let backColor: PdfColor = field.backColor;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get backColor(): PdfColor {
        return this._parseBackColor(true);
    }
    /**
     * Sets the background color of the field.
     *
     * @param {PdfColor} value Array with R, G, B, A color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the list field at index 0
     * let list1: PdfField = document.form.fieldAt(0);
     * // Sets the background color of the field.
     * list1.backColor = {r: 255, g: 0, b: 0};
     * // Access the list field at index 1
     * let list2: PdfField = document.form.fieldAt(1);
     * // Sets the background color of the field to transparent.
     * list2.backColor = {r: 0, g: 0, b: 0, isTransparent: true};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set backColor(value: PdfColor) {
        this._updateBackColor(value, true);
    }
    get _options(): Array<string[]> {
        if (!this._optionArray) {
            if (this._dictionary && this._dictionary.has('Opt')) {
                this._optionArray = this._dictionary.getArray('Opt');
            } else {
                this._optionArray = [];
                this._dictionary.update('Opt', this._optionArray);
            }
        }
        return this._optionArray;
    }
    /**
     * Gets the item at the specified index.
     *
     * @param {number} index Index of the field item.
     * @returns {PdfListFieldItem} Field item at the index.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the list box field
     * let listBox: PdfListBoxField = form.fieldAt(0) as PdfListBoxField;
     * // Gets the first list item.
     * let listBoxItem: PdfListFieldItem = listBox.itemAt(0);
     * // Access the combo box field
     * let comboBox: PdfComboBoxField = form.fieldAt(1) as PdfComboBoxField;
     * // Gets the first list item.
     * let comboBoxItem: PdfListFieldItem = comboBox.itemAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    itemAt(index: number): PdfListFieldItem {
        let item: PdfListFieldItem;
        if (index < this._kidsCount) {
            if (this._parsedItems.has(index)) {
                item = this._parsedItems.get(index);
            } else {
                let dictionary: _PdfDictionary;
                const reference: _PdfReference = this._kids[<number>index];
                if (reference && reference instanceof _PdfReference) {
                    dictionary = this._crossReference._fetch(reference);
                }
                if (dictionary) {
                    item = PdfListFieldItem._load(dictionary, this._crossReference, this);
                    item._index = index;
                    item._ref = reference;
                    if (this._options && this._options.length > 0 && index < this._options.length) {
                        item._text = this._options[<number>index][1];
                    } else {
                        item._text = '';
                    }
                    this._parsedItems.set(index, item);
                }
            }
        } else {
            if (this._parsedItems.has(index)) {
                item = this._parsedItems.get(index);
            } else if (this._kidsCount > 0 && this._kids && this._kids.length > 0) {
                let dictionary: _PdfDictionary;
                let reference: _PdfReference;
                if (this._kidsCount === 1) {
                    reference = this._kids[0];
                } else {
                    reference = this._kids[<number>index];
                }
                if (reference && reference instanceof _PdfReference) {
                    dictionary = this._crossReference._fetch(reference);
                }
                if (dictionary) {
                    item = PdfListFieldItem._load(dictionary, this._crossReference, this);
                    item._index = index;
                    item._ref = reference;
                    if (this._options && this._options.length > 0 && index < this._options.length) {
                        item._text = this._options[<number>index][1];
                    } else {
                        item._text = '';
                    }
                    this._parsedItems.set(index, item);
                }
            }
        }
        return item;
    }
    /**
     * Add list item.
     *
     * @param {PdfListFieldItem} item Item to add.
     * @returns {number} Index of the field item.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new list box field
     * let listField: PdfListField = new PdfListBoxField(page, 'list1', {x: 100, y: 60, width: 100, height: 50});
     * // Add list items to the field.
     * listField.addItem(new PdfListFieldItem('English', 'English'));
     * listField.addItem(new PdfListFieldItem('French', 'French'));
     * listField.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected index
     * listField.selectedIndex = 2;
     * // Sets the flag indicates whether the list box allows multiple selections.
     * listField.multiSelect = true;
     * // Add the field into PDF form
     * form.add(listField);
     * // Create a new combo box field
     * let comboField: PdfComboBoxField = new PdfComboBoxField(page, 'list1', {x: 100, y: 160, width: 100, height: 50});
     * // Add list items to the field.
     * comboField.addItem(new PdfListFieldItem('English', 'English'));
     * comboField.addItem(new PdfListFieldItem('French', 'French'));
     * comboField.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected index
     * comboField.selectedIndex = 2;
     * // Sets the flag indicates whether the combo box allows multiple selections.
     * comboField.multiSelect = true;
     * // Add the field into PDF form
     * form.add(comboField);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addItem(item: PdfListFieldItem): number {
        this._addToOptions(item, this);
        return this._listValues.length - 1;
    }
    /**
     * Remove the list item from the specified index.
     *
     * @param {number} index Item index to remove.
     * @returns {void} Nothing.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the list box field
     * let listBoxField: PdfListBoxField = form.fieldAt(0) as PdfListBoxField;
     * // Remove the list item from the list box field
     * listBoxField.removeItemAt(1);
     * // Access the combo box field
     * let comboBoxField: PdfComboBoxField = form.fieldAt(1) as PdfComboBoxField;
     * // Remove the list item from the combo box field
     * comboBoxField.removeItemAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removeItemAt(index: number): void {
        const item: PdfListFieldItem = this.itemAt(index);
        if (item && item._ref) {
            this._parsedItems.delete(index);
            if (this._parsedItems.size > 0) {
                const parsedItems: Map<number, PdfListFieldItem> = new Map<number, PdfListFieldItem>();
                this._parsedItems.forEach((value: PdfListFieldItem, key: number) => {
                    if (key > index) {
                        parsedItems.set(key - 1, value);
                    } else {
                        parsedItems.set(key, value);
                    }
                });
                this._parsedItems = parsedItems;
            }
            if (this._dictionary && this._dictionary.has('Opt')) {
                const options: Array<string[]> = this._options;
                if (options && options.length > 0) {
                    options.splice(index, 1);
                    this._dictionary.set('Opt', options);
                    this._optionArray = options;
                    this._dictionary._updated = true;
                }
            }
        }
    }
    /**
     * Remove the list item.
     *
     * @param {PdfListFieldItem} item Item to remove.
     * @returns {void} Nothing.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the list box field
     * let listBoxField: PdfListBoxField = form.fieldAt(0) as PdfListBoxField;
     * // Remove the list item from the list box field
     * listBoxField.removeItem(listBoxField.itemAt(1));
     * // Access the combo box field
     * let comboBoxField: PdfComboBoxField = form.fieldAt(1) as PdfComboBoxField;
     * // Remove the list item from the combo box field
     * comboBoxField.removeItem(comboBoxField.itemAt(0));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removeItem(item: PdfListFieldItem): void {
        if (item && item.text) {
            let index: number;
            for (let i: number = 0; i < this.itemsCount; i++) {
                const fieldItem: PdfListFieldItem = this.itemAt(i);
                if (fieldItem && item === fieldItem && fieldItem.text === item.text) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                this.removeItemAt(index);
            }
        }
    }
    _initialize(page: PdfPage, name: string, bounds: {x: number, y: number, width: number, height: number}): void {
        this._defaultIndex = 0;
        this._crossReference = page._crossReference;
        this._page = page;
        this._name = name;
        this._dictionary = new _PdfDictionary(this._crossReference);
        this._ref = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(this._ref, this._dictionary);
        this._dictionary.objId = this._ref.toString();
        this._dictionary.update('FT', _PdfName.get('Ch'));
        this._dictionary.update('T', name);
        this._parsedItems = new Map<number, PdfListFieldItem>();
        this._listValues = [];
        this._kids = [];
        this.bounds = bounds;
        this._addEmptyWidget();
    }
    abstract _getFontHeight(font: PdfFontFamily): number;
    abstract _createAppearance(item?: PdfListFieldItem): PdfTemplate;
    _obtainFont(item?: PdfListFieldItem): PdfFont {
        let fontFamily: string = '';
        let fontSize: number = 1;
        if (item && (item._dictionary.has('DS') || item._dictionary.has('DA'))) {
            if (item._dictionary.has('DS')) {
                const collection: string[] = item._dictionary.get('DS').split(';');
                collection.forEach((entryString: string) => {
                    const entry: string[] = entryString.split(':');
                    if (entryString.indexOf('font-family') !== -1) {
                        fontFamily = entry[1];
                    } else if (entryString.indexOf('font-size') !== -1) {
                        if (entry[1].endsWith('pt')) {
                            fontSize = Number.parseFloat(entry[1].replace('pt', ''));
                        }
                    } else if (entryString.indexOf('font-style') === -1 && entryString.indexOf('font') !== -1) {
                        const name: string = entry[1];
                        const split: string[] = name.split(' ');
                        split.forEach((splitEntry: string) => {
                            if (splitEntry !== '' && !splitEntry.endsWith('pt')) {
                                fontFamily += splitEntry + ' ';
                            }
                            if (splitEntry.endsWith('pt')) {
                                fontSize = Number.parseFloat(splitEntry.replace('pt', ''));
                            }
                        });
                        while (fontFamily !== ' ' && fontFamily.endsWith(' ')) {
                            fontFamily = fontFamily.substring(0, fontFamily.length - 2);
                        }
                        if (fontFamily.indexOf(',') !== -1) {
                            fontFamily = fontFamily.split(',')[0];
                        }
                    }
                });
            } else {
                const value: string = item._dictionary.get('DA');
                if (value && value !== '' && value.indexOf('Tf') !== -1) {
                    const textCollection: string[] = value.split(' ');
                    textCollection.forEach((text: string, index: number) => {
                        if (text.indexOf('Tf') !== -1) {
                            fontFamily = textCollection[index - 2];
                            while (fontFamily !== '' && fontFamily.length > 1 && fontFamily[0] === '/') {
                                fontFamily = fontFamily.substring(1);
                            }
                            fontSize = Number.parseFloat(textCollection[index - 1]);
                        }
                    });
                    let height: number = 0.0;
                    if (fontSize === 0) {
                        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, height);
                        if (font !== null) {
                            height = this._getFontHeight(font._fontFamily);
                            if (Number.isNaN(height) || height === 0) {
                                height = 12;
                            }
                            font._size = height;
                            fontSize = height;
                        }
                    }
                }
            }
            fontFamily = fontFamily.trim();
            if (fontFamily) {
                fontFamily = _decodeFontFamily(fontFamily);
            }
            switch (fontFamily) {
            case 'Helv':
                this._font = new PdfStandardFont(PdfFontFamily.helvetica, fontSize, PdfFontStyle.regular);
                break;
            case 'Courier':
            case 'Cour':
                this._font = new PdfStandardFont(PdfFontFamily.courier, fontSize, PdfFontStyle.regular);
                break;
            case 'Symb':
                this._font = new PdfStandardFont(PdfFontFamily.symbol, fontSize, PdfFontStyle.regular);
                break;
            case 'TiRo':
                this._font = new PdfStandardFont(PdfFontFamily.timesRoman, fontSize, PdfFontStyle.regular);
                break;
            case 'ZaDb':
                this._font = new PdfStandardFont(PdfFontFamily.zapfDingbats, fontSize, PdfFontStyle.regular);
                break;
            default:
                this._font = new PdfStandardFont(PdfFontFamily.helvetica, fontSize, PdfFontStyle.regular);
                break;
            }
            if (this._font && this._font._dictionary && this._font._dictionary.has('BaseFont')) {
                const fontName: string = this._font._dictionary.get('BaseFont').name;
                if (fontName && fontName !== fontFamily) {
                    if (this.form._dictionary.has('DR')) {
                        const resources: _PdfDictionary = this.form._dictionary.get('DR');
                        const fonts: _PdfDictionary = resources.get('Font');
                        if (fonts) {
                            if (fonts.has(fontFamily)) {
                                const fontDictionary: _PdfDictionary = fonts.get(fontFamily);
                                const fontSubtType: any = fontDictionary.get('Subtype').name; // eslint-disable-line
                                if (fontDictionary && fontFamily && fontDictionary.has('BaseFont')) {
                                    const baseFont: _PdfName = fontDictionary.get('BaseFont');
                                    let textFontStyle: PdfFontStyle = PdfFontStyle.regular;
                                    if (baseFont && baseFont.name !== null && typeof baseFont.name !== 'undefined') {
                                        textFontStyle = _getFontStyle(baseFont.name);
                                        if (fontSubtType && fontSubtType === 'TrueType') {
                                            const fontData: Uint8Array = _createFontStream(this.form, fontDictionary);
                                            if (fontData && fontData.length > 0) {
                                                const base64String: string = _encode(fontData);
                                                if (base64String && base64String.length > 0) {
                                                    this._font = new PdfTrueTypeFont(base64String, fontSize, textFontStyle);
                                                }
                                            }
                                        } else if (fontSubtType && fontSubtType === 'Type0') {
                                            const fontData: Uint8Array = _getFontFromDescriptor(fontDictionary);
                                            if (fontData && fontData.length > 0) {
                                                const base64String: string = _encode(fontData);
                                                if (base64String && base64String.length > 0) {
                                                    this._font = new PdfTrueTypeFont(base64String, fontSize, textFontStyle);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return this._font;
    }
    _obtainSelectedValue(): string[] {
        const result: string[] = [];
        if (this._dictionary.has('V')) {
            const primitive: any = this._dictionary.get('V'); // eslint-disable-line
            const array: any = this._dictionary.getArray('V'); // eslint-disable-line
            if (primitive !== null && typeof primitive !== 'undefined') {
                if (typeof primitive === 'string') {
                    result.push(primitive);
                } else if (Array.isArray(primitive)) {
                    result.push(...array);
                }
            }
        } else {
            const selectedIndexes: number[] = this._dictionary.get('I');
            if (selectedIndexes !== null &&
                typeof selectedIndexes !== 'undefined' &&
                selectedIndexes.length > 0 &&
                selectedIndexes[0] > -1 &&
                this._options &&
                this._options.length > 0) {
                result.push(...selectedIndexes.map((index: number) => this._options[<number>index][0]));
            }
        }
        return result;
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (isFlatten || this._setAppearance || this._form._setAppearance) {
            const count: number = this._kidsCount;
            if (this._kids && this._kids.length > 0) {
                if (count > 1) {
                    for (let i: number = 0; i < count; i++) {
                        const item: PdfListFieldItem = this.itemAt(i);
                        if (item && !this._checkFieldFlag(item._dictionary)) {
                            const template: PdfTemplate = this._createAppearance(item);
                            if (isFlatten) {
                                const page: PdfPage = item._getPage();
                                if (page) {
                                    this._drawTemplate(template, page, item.bounds);
                                }
                            } else {
                                this._addAppearance(item._dictionary, template, 'N');
                            }
                            item._dictionary._updated = !isFlatten;
                        }
                    }
                } else {
                    const item: PdfListFieldItem = this.itemAt(0);
                    const template: PdfTemplate = this._createAppearance();
                    if (isFlatten) {
                        const page: PdfPage = this.page;
                        if (page) {
                            this._drawTemplate(template, page, this.bounds);
                        }
                    } else {
                        this._addAppearance(item._dictionary, template, 'N');
                    }
                    item._dictionary._updated = !isFlatten;
                }
            } else if (this._dictionary) {
                const template: PdfTemplate = this._createAppearance();
                if (isFlatten) {
                    const page: PdfPage = this.page;
                    if (page) {
                        this._drawTemplate(template, page, this.bounds);
                    }
                } else {
                    this._addAppearance(this._dictionary, template, 'N');
                }
            }
            this._dictionary._updated = !isFlatten;
        }
    }
    _tryGetIndex(value: string): number {
        let index: number = -1;
        if (this._options && this._options.length > 0) {
            for (let i: number = 0; i < this._options.length; i++) {
                if (value === this._options[<number>i][0]) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    _addEmptyWidget(): void {
        const widget: PdfWidgetAnnotation = new PdfWidgetAnnotation();
        widget._create(this._page, this.bounds, this);
        this._addToKid(widget);
        widget._dictionary.update('MK', new _PdfDictionary(this._crossReference));
        widget._mkDictionary.update('BC', [0, 0, 0]);
        widget._mkDictionary.update('BG', [1, 1, 1]);
        widget._dictionary.update('DA', '/TiRo 0 Tf 0 0 0 rg');
    }
    _getStringFormat(): PdfStringFormat {
        const widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
        const stringFormat: PdfStringFormat = new PdfStringFormat();
        stringFormat.lineAlignment =
            (this._fieldFlags & _FieldFlag.multiLine) > 0
                ? PdfVerticalAlignment.top
                : PdfVerticalAlignment.middle;
        if (widget && widget._dictionary.has('Q')) {
            const flagValue: number = widget._dictionary.get('Q');
            if (flagValue !== null && typeof flagValue !== 'undefined') {
                stringFormat.alignment = flagValue as PdfTextAlignment;
            }
        }
        return stringFormat;
    }
}
/**
 * `PdfComboBoxField` class represents the combo box field objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new combo box field
 * let field: PdfComboBoxField = new PdfComboBoxField(page, 'list1', {x: 100, y: 60, width: 100, height: 50});
 * // Add list items to the field.
 * field.addItem(new PdfListFieldItem('English', 'English'));
 * field.addItem(new PdfListFieldItem('French', 'French'));
 * field.addItem(new PdfListFieldItem('German', 'German'));
 * // Sets the selected index
 * field.selectedIndex = 2;
 * // Sets the flag indicates whether the combo box allows multiple selections.
 * field.multiSelect = true;
 * // Add the field into PDF form
 * form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfComboBoxField extends PdfListField {
    /**
     * Represents a combo box field of the PDF document.
     *
     * @private
     */
    constructor()
    /**
     * Represents a combo box field of the PDF document.
     *
     * @param {PdfPage} page The page where the field is drawn.
     * @param {string} name The name of the field.
     * @param {Rectangle} bounds The bounds of the field.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new combo box field
     * let field: PdfComboBoxField = new PdfComboBoxField(page, 'list1', {x: 100, y: 60, width: 100, height: 50});
     * // Add list items to the field.
     * field.addItem(new PdfListFieldItem('English', 'English'));
     * field.addItem(new PdfListFieldItem('French', 'French'));
     * field.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected index
     * field.selectedIndex = 2;
     * // Sets the flag indicates whether the combo box allows multiple selections.
     * field.multiSelect = true;
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, bounds: Rectangle)
    /**
     * Represents a combo box (drop-down) field of the PDF document.
     *
     * @param {PdfPage} page The page where the field is drawn.
     * @param {string} [name] The unique name of the field.
     * @param {Rectangle} bounds The bounds of the field.
     * @param {object} properties Required properties bag.
     * @param {{text: string, value: string}[]} properties.items List items to populate (text/value pairs).
     * @param {string} [properties.toolTip] Tooltip text shown by the viewer.
     * @param {PdfColor} [properties.color] Fore color (text color) of the field (RGB).
     * @param {PdfColor} [properties.backColor] Background color.
     * @param {PdfColor} [properties.borderColor] Border color.
     * @param {PdfInteractiveBorder} [properties.border] Border settings (width, style, dash).
     * @param {number|number[]} [properties.selectedIndex] Selected index (single) or indices (multi) if viewer supports it.
     * @param {string|string[]} [properties.selectedValue] Selected value (single) or values (multi) matching items.
     * @param {PdfFont} [properties.font] Font used for the drop-down text.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Add new combobox field into PDF form
     * document.form.add(new PdfComboBoxField(
     *   page,
     *   'Country',
     *   { x: 50, y: 400, width: 180, height: 22 },
     *   {
     *     items: [
     *       { text: 'United States', value: 'US' },
     *       { text: 'Canada', value: 'CA' },
     *       { text: 'Germany', value: 'DE' }
     *     ],
     *     toolTip: 'Choose a country',
     *     color: { r: 0, g: 0, b: 0 },
     *     backColor: { r: 255, g: 255, b: 255 },
     *     borderColor: { r: 0, g: 0, b: 0 },
     *     border: new PdfInteractiveBorder({width: 1, style: PdfBorderStyle.solid}),
     *     selectedIndex: 0,
     *     font: document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular)
     *   }
     * ));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
        items: { text: string, value: string }[],
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        selectedIndex?: number,
        font?: PdfFont
    })
    constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
        items: { text: string, value: string }[],
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        selectedIndex?: number,
        font?: PdfFont
    }) {
        super();
        if (page && name && bounds) {
            this._initialize(page, name, bounds);
            this._fieldFlags |= _FieldFlag.combo;
        }
        if (properties) {
            if ('items' in properties && _isNullOrUndefined(properties.items)) {
                properties.items.forEach((item: { text: string, value: string }) => {
                    this.addItem(new PdfListFieldItem(item.text, item.value));
                });
            }
            if ('toolTip' in properties && _isNullOrUndefined(properties.toolTip)) {
                this.toolTip = properties.toolTip;
            }
            if ('color' in properties && _isNullOrUndefined(properties.color)) {
                this.color = properties.color;
            }
            if ('border' in properties && _isNullOrUndefined(properties.border)) {
                this.border = properties.border;
            }
            if ('backColor' in properties && _isNullOrUndefined(properties.backColor)) {
                this.backColor = properties.backColor;
            }
            if ('borderColor' in properties && _isNullOrUndefined(properties.borderColor)) {
                this.borderColor = properties.borderColor;
            }
            if ('font' in properties && _isNullOrUndefined(properties.font)) {
                this.font = properties.font;
            }
            if ('selectedIndex' in properties && _isNullOrUndefined(properties.selectedIndex)) {
                this.selectedIndex = properties.selectedIndex;
            }
        }
    }
    /**
     * Gets the boolean flag indicates whether the combo box field is auto size.
     *
     * @private
     * @returns {boolean} Returns the boolean value to check auto size.
     */
    get _isAutoFontSize(): boolean {
        let isAutoFontSize: boolean = false;
        if (this._isLoaded && this._form) {
            const acroForm: _PdfDictionary = this._form._dictionary;
            if (acroForm && acroForm.has('DA')) {
                let fontString: string = acroForm.get('DA');
                if (fontString) {
                    let defaultAppearance: _PdfDefaultAppearance = new _PdfDefaultAppearance(fontString);
                    if (defaultAppearance.fontSize === 0) {
                        if (this._kids && this._kids.length > 0) {
                            let fontSize: boolean = false;
                            if (this._dictionary.has('DA')) {
                                fontString = this._dictionary.get('DA');
                                if (fontString) {
                                    defaultAppearance = new _PdfDefaultAppearance(fontString);
                                    if (defaultAppearance && defaultAppearance.fontSize > 0) {
                                        fontSize = true;
                                    }
                                }
                            }
                            if (!fontSize) {
                                this._kids.forEach((reference: _PdfReference) => {
                                    let dictionary: _PdfDictionary;
                                    if (reference && reference instanceof _PdfReference) {
                                        dictionary = this._crossReference._fetch(reference);
                                    }
                                    if (dictionary) {
                                        if (dictionary.has('DA')) {
                                            fontString = dictionary.get('DA');
                                            let height: number = 0;
                                            if (fontString) {
                                                defaultAppearance = new _PdfDefaultAppearance(fontString);
                                                if (defaultAppearance) {
                                                    height = defaultAppearance.fontSize;
                                                }
                                            }
                                            if (height === 0) {
                                                isAutoFontSize = true;
                                            }
                                        } else {
                                            isAutoFontSize = true;
                                        }
                                    }
                                });
                            }
                        } else {
                            if (this._dictionary.has('DA')) {
                                fontString = this._dictionary.get('DA');
                                let height: number = 0;
                                if (fontString) {
                                    defaultAppearance = new _PdfDefaultAppearance(fontString);
                                    if (defaultAppearance) {
                                        height = defaultAppearance.fontSize;
                                    }
                                }
                                if (height === 0) {
                                    isAutoFontSize = true;
                                }
                            } else {
                                isAutoFontSize = true;
                            }
                        }
                    }
                }
            }
        }
        return isAutoFontSize;
    }
    /**
     * Parse an existing combo box field.
     *
     * @private
     * @param {PdfForm} form Form object.
     * @param {_PdfDictionary} dictionary Field dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference object.
     * @param {_PdfReference} reference Field reference.
     * @returns {PdfComboBoxField} Combo box field.
     */
    static _load(form: PdfForm,
                 dictionary: _PdfDictionary,
                 crossReference: _PdfCrossReference,
                 reference: _PdfReference): PdfComboBoxField {
        const field: PdfComboBoxField = new PdfComboBoxField();
        field._isLoaded = true;
        field._form = form;
        field._dictionary = dictionary;
        field._crossReference = crossReference;
        field._ref = reference;
        if (field._dictionary.has('Kids')) {
            field._kids = field._dictionary.get('Kids');
        }
        const options: Array<string[]> = field._dictionary.getArray('Opt');
        if (options !== null && typeof options !== 'undefined') {
            field._listValues = new Array(options.length);
        }
        field._defaultIndex = 0;
        field._parsedItems = new Map<number, PdfListFieldItem>();
        if (field._kidsCount > 0) {
            field._retrieveOptionValue();
        }
        return field;
    }
    _retrieveOptionValue(): void {
        if (this._dictionary.has('Opt')) {
            const options: Array<string[]> = this._dictionary.getArray('Opt');
            if (options && options.length > 0) {
                const itemsCount: number = this._kidsCount;
                const count: number = options.length <= itemsCount ? options.length : itemsCount;
                for (let i: number = 0; i < count; i++) {
                    const text: string = options[<number>i][1];
                    if (text) {
                        this.itemAt(i)._text = text ? text : '';
                    }
                }
            }
        }
    }
    _createAppearance(item?: PdfListFieldItem): PdfTemplate {
        const parameter: _PaintParameter = new _PaintParameter();
        if (item) {
            const bounds: {x: number, y: number, width: number, height: number} = item.bounds;
            const page: PdfPage = item._getPage();
            if (item._isLoaded && page && typeof page.rotation !== 'undefined' && page.rotation !== PdfRotationAngle.angle0) {
                parameter.bounds = this._rotateTextBox(bounds, page.size, page.rotation);
            } else {
                parameter.bounds = {x: 0, y: 0, width: bounds.width, height: bounds.height};
            }
            const backcolor: PdfColor = item.backColor;
            if (backcolor && !backcolor.isTransparent) {
                parameter.backBrush = new PdfBrush(backcolor);
            }
            parameter.foreBrush = new PdfBrush(item.color);
            const border: PdfInteractiveBorder = item.border;
            if (item.borderColor) {
                parameter.borderPen = new PdfPen(item.borderColor, border.width);
                _updateDashedBorderStyle(border, parameter);
            }
            parameter.borderStyle = border.style;
            parameter.borderWidth = border.width;
            if (backcolor) {
                const shadowColor: number[] = [backcolor.r - 64, backcolor.g - 64, backcolor.b - 64];
                const color: PdfColor = {r: shadowColor[0] >= 0 ? shadowColor[0] : 0,
                    g: shadowColor[1] >= 0 ? shadowColor[1] : 0,
                    b: shadowColor[2] >= 0 ? shadowColor[2] : 0};
                parameter.shadowBrush = new PdfBrush(color);
            }
            const alignment: PdfTextAlignment = typeof item.textAlignment !== 'undefined' ? item.textAlignment : PdfTextAlignment.left;
            const verticalAlignment: PdfVerticalAlignment = this.multiSelect ? PdfVerticalAlignment.top : PdfVerticalAlignment.middle;
            parameter.stringFormat = new PdfStringFormat(alignment, verticalAlignment);
        } else {
            const bounds: {x: number, y: number, width: number, height: number} = this.bounds;
            if (bounds) {
                if (this._isLoaded &&
                    this.page &&
                    typeof this.page.rotation !== 'undefined' &&
                    this.page.rotation !== PdfRotationAngle.angle0) {
                    parameter.bounds = this._rotateTextBox(bounds, this.page.size, this.page.rotation);
                } else {
                    parameter.bounds = {x: 0, y: 0, width: bounds.width, height: bounds.height};
                }
            }
            const backcolor: PdfColor = this.backColor;
            if (backcolor && !backcolor.isTransparent) {
                parameter.backBrush = new PdfBrush(backcolor);
            }
            parameter.foreBrush = new PdfBrush(this.color);
            const border: PdfInteractiveBorder = this.border;
            if (this.borderColor) {
                parameter.borderPen = new PdfPen(this.borderColor, border.width);
                _updateDashedBorderStyle(border, parameter);
            }
            parameter.borderStyle = border.style;
            parameter.borderWidth = border.width;
            if (backcolor) {
                const shadowColor: number[] = [backcolor.r - 64, backcolor.g - 64, backcolor.b - 64];
                const color: PdfColor = {r: shadowColor[0] >= 0 ? shadowColor[0] : 0,
                    g: shadowColor[1] >= 0 ? shadowColor[1] : 0,
                    b: shadowColor[2] >= 0 ? shadowColor[2] : 0};
                parameter.shadowBrush = new PdfBrush(color);
            }
            parameter.rotationAngle = this.rotationAngle;
            if (this.rotate !== null && typeof this.rotate !== 'undefined') {
                parameter.rotationAngle = this.rotate;
            }
            const alignment: PdfTextAlignment = typeof this.textAlignment !== 'undefined' ? this.textAlignment : PdfTextAlignment.left;
            const verticalAlignment: PdfVerticalAlignment = this.multiSelect ? PdfVerticalAlignment.top : PdfVerticalAlignment.middle;
            parameter.stringFormat = new PdfStringFormat(alignment, verticalAlignment);
        }
        parameter.required = this.required;
        if (parameter.bounds === null || typeof parameter.bounds === 'undefined') {
            parameter.bounds = {x: 0, y: 0, width: 0, height: 0};
        }
        const template: PdfTemplate = new PdfTemplate(parameter.bounds, this._crossReference);
        const graphics: PdfGraphics = template.graphics;
        graphics._sw._clear();
        if (!this.required) {
            graphics._sw._beginMarkupSequence('Tx');
            graphics._initializeCoordinates();
        }
        if (this._isLoaded) {
            let font: PdfFont;
            if (item) {
                font = this._obtainFont(item);
            }
            if (typeof font === 'undefined' || font === null) {
                font = this.font;
            }
            if (!font || font.size === 0) {
                font = this._appearanceFont;
            }
            this._drawComboBox(graphics, parameter, font, parameter.stringFormat);
        } else {
            if (!this._font) {
                this._font = new PdfStandardFont(PdfFontFamily.timesRoman, this._getFontHeight(PdfFontFamily.helvetica));
            }
            this._drawComboBox(graphics, parameter, this._font, parameter.stringFormat);
        }
        if (!this.required) {
            graphics._sw._endMarkupSequence();
        }
        return template;
    }
    _drawComboBox(graphics: PdfGraphics, parameter?: _PaintParameter, font?: PdfFont, stringFormat?: PdfStringFormat): void {
        if (graphics._isTemplateGraphics && parameter.required) {
            graphics.save();
            graphics._initializeCoordinates();
        }
        this._drawRectangularControl(graphics, parameter);
        if (graphics._isTemplateGraphics && parameter.required) {
            graphics.restore();
            graphics.save();
            graphics._sw._beginMarkupSequence('Tx');
            graphics._initializeCoordinates();
        }
        const options: Array<string[]> = this._options;
        const selectedIndexes: number[] = this._dictionary.get('I');
        let i: number = -1;
        if (selectedIndexes && selectedIndexes.length > 0) {
            i = selectedIndexes[0];
        }
        if (i >= 0 && i < options.length) {
            const item: any = options[<number>i]; // eslint-disable-line 
            const offset: number[] = [0, 0];
            const borderWidth: number = parameter.borderWidth;
            const doubleBorderWidth: number = 2 * borderWidth;
            const defaultPadding: number = 2;
            const padding: boolean = (parameter.borderStyle === PdfBorderStyle.inset || parameter.borderStyle === PdfBorderStyle.beveled);
            if (padding) {
                offset[0] = 2 * doubleBorderWidth;
                offset[1] = 2 * borderWidth;
            } else {
                offset[0] = doubleBorderWidth + defaultPadding;
                offset[1] = 1 * borderWidth;
            }
            let brush: PdfBrush = parameter.foreBrush;
            const rect: Rectangle = parameter.bounds;
            let width: number = rect.width - doubleBorderWidth;
            let rectangle: Rectangle = rect;
            if (padding) {
                rectangle.height -= doubleBorderWidth;
            } else {
                rectangle.height -= borderWidth;
            }
            graphics.setClip(rectangle, PdfFillMode.winding);
            if (parameter.rotationAngle === 0) {
                let x: number = rect.x + borderWidth;
                if (padding) {
                    x += borderWidth;
                    width -= doubleBorderWidth;
                }
                brush = new PdfBrush({r: 0, g: 0, b: 0});
            }
            let value: string;
            if (item && Array.isArray(item)) {
                value = item[1] ? item[1] : item[0];
            } else {
                value = item;
            }
            if (value) {
                const itemTextBound: Rectangle = {x: offset[0], y: offset[1], width: width - offset[0], height: rect.height};
                if (parameter.rotationAngle > 0) {
                    const state: PdfGraphicsState = graphics.save();
                    if (parameter.rotationAngle === 90) {
                        graphics.translateTransform({x: 0, y: graphics._size.height});
                        graphics.rotateTransform(-90);
                        const x: number = graphics._size.height - (rectangle.y + rectangle.height);
                        const y: number = rectangle.x;
                        rectangle = {x: x, y: y, width: rectangle.height + rectangle.width, height: rectangle.width};
                    } else if (parameter.rotationAngle === 270) {
                        graphics.translateTransform({x: graphics._size.width, y: 0});
                        graphics.rotateTransform(-270);
                        const x: number = rectangle.y;
                        const y: number = graphics._size.width - (rectangle.x + rectangle.width);
                        rectangle = {x: x, y: y, width: rectangle.height + rectangle.width, height: rectangle.width};
                    } else if (parameter.rotationAngle === 180) {
                        graphics.translateTransform({x: graphics._size.width, y: graphics._size.height});
                        graphics.rotateTransform(-180);
                        const x: number = graphics._size.width - (rectangle.x + rectangle.width);
                        const y: number = graphics._size.height - (rectangle.y + rectangle.height);
                        rectangle = {x: x, y: y, width: rectangle.width, height: rectangle.height};
                    }
                    let x: number = rect.x + borderWidth;
                    if (padding) {
                        x += borderWidth;
                        width -= doubleBorderWidth;
                    }
                    brush = new PdfBrush({r: 0, g: 0, b: 0});
                    graphics.drawString(value, font, itemTextBound, null, brush, stringFormat);
                    graphics.restore(state);
                } else {
                    graphics.drawString(value, font, itemTextBound, null, brush, stringFormat);
                }
            }
        }
        if (graphics._isTemplateGraphics && parameter.required) {
            graphics._sw._endMarkupSequence();
            graphics.restore();
        }
    }
    _getFontHeight(fontFamily: PdfFontFamily): number {
        const values: number[] = this._dictionary.get('I');
        let s: number;
        let itemFont: PdfFont;
        let format: PdfStringFormat;
        let options: Array<string[]>;
        let bounds: {x: number, y: number, width: number, height: number};
        const borderWidth: number = this.border.width;
        if (this._isLoaded) {
            itemFont = new PdfStandardFont(fontFamily, 12);
            format = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
            options = this._dictionary.getArray('Opt');
            bounds = this.bounds;
            const widths: number[] = [];
            if (values && values.length > 0) {
                values.forEach((entry: number) => {
                    widths.push(itemFont.measureString(options[<number>entry][1], {width: 0, height: 0}, format, 0, 0).width);
                });
            } else if (options.length > 0) {
                let max: number = itemFont.measureString(options[0][1], {width: 0, height: 0}, format, 0, 0).width;
                for (let i: number = 1; i < options.length; ++i) {
                    const width: number = itemFont.measureString(options[<number>i][1], {width: 0, height: 0}, format, 0, 0).width;
                    max = Math.max(max, width);
                    widths.push(max);
                }
            }
            s = (widths.length > 0) ? ((12 * (bounds.width - 4 * borderWidth)) /  ((widths.sort())[widths.length - 1])) : 12;
        } else {
            s = 0;
            if (values && values.length > 0) {
                itemFont = new PdfStandardFont(fontFamily, 12);
                format = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
                options = this._dictionary.getArray('Opt');
                const selectedValue: any = this.selectedValue; // eslint-disable-line
                const width: number = itemFont.measureString((selectedValue !== null && typeof selectedValue === 'string') ? selectedValue :
                    options[values[0]][1], {width: 0, height: 0}, format, 0, 0).width;
                bounds = this.bounds;
                if (width) {
                    s = (12 * (bounds.width - 4 * borderWidth)) / width;
                } else {
                    s = 12;
                }
            } else {
                return s;
            }
        }
        let fontSize: number = 0;
        if (values && values.length > 0) {
            if (s !== 12) {
                itemFont = new PdfStandardFont(fontFamily, s);
                const selectedValue: any = this.selectedValue; // eslint-disable-line
                const text: string = (selectedValue !== null && typeof selectedValue === 'string') ? selectedValue :
                    options[values[0]][1];
                const textSize: Size = itemFont.measureString(text);
                if (textSize.width > bounds.width || textSize.height > bounds.height) {
                    const width: number = bounds.width - 4 * borderWidth;
                    const h: number = bounds.height - 4 * borderWidth;
                    const min: number = 0.248;
                    for (let i: number = 1; i <= bounds.height; i++) {
                        itemFont = new PdfStandardFont(fontFamily, i);
                        let size: Size = itemFont.measureString(text);
                        if (size.width > bounds.width || size.height > h) {
                            fontSize = i;
                            do {
                                fontSize = fontSize - 0.001;
                                itemFont = new PdfStandardFont(fontFamily, fontSize);
                                const textWidth: number = itemFont.getLineWidth(text, format);
                                if (fontSize < min) {
                                    itemFont._size = min;
                                    break;
                                }
                                size = itemFont.measureString(text, {width: 0, height: 0}, format, 0, 0);
                                if (textWidth < width && size.height < h) {
                                    itemFont._size = fontSize;
                                    break;
                                }
                            } while (fontSize > min);
                            s = fontSize;
                            break;
                        }
                    }
                }
            }
        } else if (s > 12) {
            s = 12;
        }
        return s;
    }
}
/**
 * `PdfListBoxField` class represents the list box field objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new list box field
 * let field: PdfListBoxField = new PdfListBoxField(page, 'list1', {x: 100, y: 60, width: 100, height: 50});
 * // Add list items to the field.
 * field.addItem(new PdfListFieldItem('English', 'English'));
 * field.addItem(new PdfListFieldItem('French', 'French'));
 * field.addItem(new PdfListFieldItem('German', 'German'));
 * // Sets the selected index
 * field.selectedIndex = 2;
 * // Sets the flag indicates whether the list box allows multiple selections.
 * field.multiSelect = true;
 * // Add the field into PDF form
 * form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfListBoxField extends PdfListField {
    /**
     * Represents a list box field of the PDF document.
     *
     * @private
     */
    constructor()
    /**
     * Represents a list box field of the PDF document.
     *
     * @param {PdfPage} page The page where the field is drawn.
     * @param {string} name The name of the field.
     * @param {Rectangle} bounds The bounds of the field.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new list box field
     * let field: PdfListBoxField = new PdfListBoxField(page, 'list1', {x: 100, y: 60, width: 100, height: 50});
     * // Add list items to the field.
     * field.addItem(new PdfListFieldItem('English', 'English'));
     * field.addItem(new PdfListFieldItem('French', 'French'));
     * field.addItem(new PdfListFieldItem('German', 'German'));
     * // Sets the selected index
     * field.selectedIndex = 2;
     * // Sets the flag indicates whether the list box allows multiple selections.
     * field.multiSelect = true;
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, bounds: Rectangle)
    /**
     * Represents a list box field of the PDF document.
     *
     * @param {PdfPage} page The page where the field is drawn.
     * @param {string} name The unique name of the field.
     * @param {Rectangle} bounds The bounds of the field.
     * @param {object} properties Required properties bag.
     * @param {{text: string, value: string}[]} properties.items List items to populate (text/value pairs).
     * @param {string} [properties.toolTip] Tooltip text shown by the viewer.
     * @param {PdfColor} [properties.color] Fore color (text color) of the field (RGB).
     * @param {PdfColor} [properties.backColor] Background color.
     * @param {PdfColor} [properties.borderColor] Border color.
     * @param {PdfInteractiveBorder} [properties.border] Border settings (width, style, dash).
     * @param {number|number[]} [properties.selectedIndex] Selected index or indices (for multi-select).
     * @param {string|string[]} [properties.selectedValue] Selected value(s) matching items[].value.
     * @param {boolean} [properties.multiSelect] Allow selecting multiple items (viewer dependent).
     * @param {PdfFont} [properties.font] Font used for item text.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Add new listbox field into PDF form
     * document.form.add(new PdfListBoxField(
     *   page,
     *   'Languages',
     *   { x: 50, y: 340, width: 180, height: 60 },
     *   {
     *     items: [
     *       { text: 'English', value: 'en' },
     *       { text: 'French', value: 'fr' },
     *       { text: 'German', value: 'de' }
     *     ],
     *     toolTip: 'Select language(s)',
     *     color: { r: 0, g: 0, b: 0 },
     *     backColor: { r: 255, g: 255, b: 255 },
     *     borderColor: { r: 0, g: 0, b: 0 },
     *     border: new PdfInteractiveBorder({width: 1, style: PdfBorderStyle.solid}),
     *     selectedIndex: [0, 2],
     *     multiSelect: true,
     *     font: document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular)
     *   }
     * ));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
        items: { text: string, value: string }[],
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        selectedIndex?: number | number[],
        multiSelect?: boolean,
        font?: PdfFont
    })
    constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
        items: { text: string, value: string }[],
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        selectedIndex?: number | number[],
        multiSelect?: boolean,
        font?: PdfFont
    }) {
        super();
        if (page && name && bounds) {
            this._initialize(page, name, bounds);
        }
        if (properties) {
            if ('items' in properties && _isNullOrUndefined(properties.items)) {
                properties.items.forEach((item: { text: string, value: string }) => {
                    this.addItem(new PdfListFieldItem(item.text, item.value));
                });
            }
            if ('toolTip' in properties && _isNullOrUndefined(properties.toolTip)) {
                this.toolTip = properties.toolTip;
            }
            if ('color' in properties && _isNullOrUndefined(properties.color)) {
                this.color = properties.color;
            }
            if ('border' in properties && _isNullOrUndefined(properties.border)) {
                this.border = properties.border;
            }
            if ('backColor' in properties && _isNullOrUndefined(properties.backColor)) {
                this.backColor = properties.backColor;
            }
            if ('borderColor' in properties && _isNullOrUndefined(properties.borderColor)) {
                this.borderColor = properties.borderColor;
            }
            if ('font' in properties && _isNullOrUndefined(properties.font)) {
                this.font = properties.font;
            }
            if ('multiSelect' in properties && _isNullOrUndefined(properties.multiSelect)) {
                this.multiSelect = properties.multiSelect;
            }
            if ('selectedIndex' in properties && _isNullOrUndefined(properties.selectedIndex)) {
                this.selectedIndex = properties.selectedIndex;
            }
        }
    }
    /**
     * Parse an existing list box field of the PDF document.
     *
     * @private
     * @param {number} form maximum length.
     * @param {_PdfDictionary} dictionary maximum length.
     * @param {_PdfCrossReference} crossReference maximum length.
     * @param {_PdfReference} reference maximum length.
     * @returns {PdfListBoxField} List box field.
     */
    static _load(form: PdfForm, dictionary: _PdfDictionary, crossReference: _PdfCrossReference, reference: _PdfReference): PdfListBoxField {
        const field: PdfListBoxField = new PdfListBoxField();
        field._isLoaded = true;
        field._form = form;
        field._dictionary = dictionary;
        field._crossReference = crossReference;
        field._ref = reference;
        if (field._dictionary.has('Kids')) {
            field._kids = field._dictionary.get('Kids');
        }
        field._defaultIndex = 0;
        field._parsedItems = new Map<number, PdfListFieldItem>();
        if (field._kidsCount > 0) {
            field._retrieveOptionValue();
        }
        return field;
    }
    _retrieveOptionValue(): void {
        if (this._dictionary.has('Opt')) {
            const options: Array<string[]> = this._dictionary.getArray('Opt');
            const itemsCount: number = this._kidsCount;
            const count: number = options.length <= itemsCount ? options.length : itemsCount;
            this._listValues = new Array(count);
            if (options && options.length > 0) {
                let index: number = this._dictionary.get('I');
                if (Array.isArray(index) && index.length > 0) {
                    index = index[0];
                    this._selectedIndex = index;
                }
                for (let i: number = 0; i < count; i++) {
                    const item: PdfListFieldItem = this.itemAt(i);
                    if (item) {
                        if (_isNullOrUndefined(index) && this._listValues !== null && typeof this._listValues !== 'undefined') {
                            const value: any = options[<number>i]; // eslint-disable-line
                            if (Array.isArray(value)) {
                                this._listValues[<number>i] = value[1];
                            } else {
                                this._listValues[<number>i] = value;
                            }
                            if (i === index) {
                                item._text = this._listValues[<number>i];
                                this._selectedIndex = i;
                            } else {
                                item._text = this._listValues[<number>i];
                            }
                        } else {
                            item._text = '';
                        }
                    }
                }
            }
        }
    }
    _createAppearance(item?: PdfListFieldItem): PdfTemplate {
        const parameter: _PaintParameter = new _PaintParameter();
        if (item) {
            const bounds: {x: number, y: number, width: number, height: number} = item.bounds;
            const page: PdfPage = item._getPage();
            if (item._isLoaded && page && typeof page.rotation !== 'undefined' && page.rotation !== PdfRotationAngle.angle0) {
                parameter.bounds = this._rotateTextBox(bounds, page.size, page.rotation);
            } else {
                parameter.bounds = {x: 0, y: 0, width: bounds.width, height: bounds.height};
            }
            const backcolor: PdfColor = item.backColor;
            if (backcolor && !backcolor.isTransparent) {
                parameter.backBrush = new PdfBrush(backcolor);
            }
            parameter.foreBrush = new PdfBrush(item.color);
            const border: PdfInteractiveBorder = item.border;
            if (item.borderColor) {
                parameter.borderPen = new PdfPen(item.borderColor, border.width);
                _updateDashedBorderStyle(border, parameter);
            }
            parameter.borderStyle = border.style;
            parameter.borderWidth = border.width;
            if (backcolor) {
                const shadowColor: number[] = [backcolor.r - 64, backcolor.g - 64, backcolor.b - 64];
                const color: PdfColor = {r: shadowColor[0] >= 0 ? shadowColor[0] : 0,
                    g: shadowColor[1] >= 0 ? shadowColor[1] : 0,
                    b: shadowColor[2] >= 0 ? shadowColor[2] : 0};
                parameter.shadowBrush = new PdfBrush(color);
            }
            if (item._enableGrouping && typeof item.rotate === 'undefined') {
                parameter.rotationAngle = 0;
            } else {
                parameter.rotationAngle = item.rotate;
            }
            const alignment: PdfTextAlignment = typeof item.textAlignment !== 'undefined' ? item.textAlignment : PdfTextAlignment.left;
            const verticalAlignment: PdfVerticalAlignment = this.multiSelect ? PdfVerticalAlignment.top : PdfVerticalAlignment.middle;
            parameter.stringFormat = new PdfStringFormat(alignment, verticalAlignment);
        } else {
            const bounds: {x: number, y: number, width: number, height: number} = this.bounds;
            if (this._isLoaded &&
                this.page &&
                typeof this.page.rotation !== 'undefined' &&
                this.page.rotation !== PdfRotationAngle.angle0) {
                parameter.bounds = this._rotateTextBox(bounds, this.page.size, this.page.rotation);
            } else {
                parameter.bounds = {x: 0, y: 0, width: bounds.width, height: bounds.height};
            }
            const backcolor: PdfColor = this.backColor;
            if (backcolor && !backcolor.isTransparent) {
                parameter.backBrush = new PdfBrush(backcolor);
            }
            parameter.foreBrush = new PdfBrush(this.color);
            const border: PdfInteractiveBorder = this.border;
            if (this.borderColor) {
                parameter.borderPen = new PdfPen(this.borderColor, border.width);
                _updateDashedBorderStyle(border, parameter);
            }
            parameter.borderStyle = border.style;
            parameter.borderWidth = border.width;
            if (backcolor) {
                const shadowColor: number[] = [backcolor.r - 64, backcolor.g - 64, backcolor.b - 64];
                const color: PdfColor = {r: shadowColor[0] >= 0 ? shadowColor[0] : 0,
                    g: shadowColor[1] >= 0 ? shadowColor[1] : 0,
                    b: shadowColor[2] >= 0 ? shadowColor[2] : 0};
                parameter.shadowBrush = new PdfBrush(color);
            }
            parameter.rotationAngle = this.rotationAngle;
            if (this.rotate !== null && typeof this.rotate !== 'undefined') {
                parameter.rotationAngle = this.rotate;
            }
            const alignment: PdfTextAlignment = typeof this.textAlignment !== 'undefined' ? this.textAlignment : PdfTextAlignment.left;
            const verticalAlignment: PdfVerticalAlignment = this.multiSelect ? PdfVerticalAlignment.top : PdfVerticalAlignment.middle;
            parameter.stringFormat = new PdfStringFormat(alignment, verticalAlignment);
        }
        parameter.required = this.required;
        const template: PdfTemplate = new PdfTemplate(parameter.bounds, this._crossReference);
        const graphics: PdfGraphics = template.graphics;
        graphics._sw._clear();
        if (!this.required) {
            graphics._sw._beginMarkupSequence('Tx');
            graphics._initializeCoordinates();
        }
        if (this._isLoaded) {
            let font: PdfFont = this._obtainFont(item);
            if ((typeof font === 'undefined' || font === null) || (!this._isLoaded && font.size === 1)) {
                font = this._appearanceFont;
            }
            this._drawListBox(graphics, parameter, font, parameter.stringFormat);
        } else {
            if (!this._font) {
                this._font = this._defaultItemFont;
            }
            this._drawListBox(graphics, parameter, this._font, parameter.stringFormat);
        }
        if (!this.required) {
            graphics._sw._endMarkupSequence();
        }
        return template;
    }
    _drawListBox(graphics: PdfGraphics, parameter?: _PaintParameter, font?: PdfFont, stringFormat?: PdfStringFormat): void {
        if (graphics._isTemplateGraphics && parameter.required) {
            graphics.save();
            graphics._initializeCoordinates();
        }
        this._drawRectangularControl(graphics, parameter);
        if (graphics._isTemplateGraphics && parameter.required) {
            graphics.restore();
            graphics.save();
            graphics._sw._beginMarkupSequence('Tx');
            graphics._initializeCoordinates();
        }
        const options: Array<string[]> = this._options;
        for (let index: number = 0; index < options.length; ++index) {
            const item: string[] = options[<number>index];
            const location: number[] = [];
            const borderWidth: number = parameter.borderWidth;
            const doubleBorderWidth: number = 2 * borderWidth;
            const defaultPadding: number = 2;
            const padding: boolean = (parameter.borderStyle === PdfBorderStyle.inset || parameter.borderStyle === PdfBorderStyle.beveled);
            if (padding) {
                location.push(2 * doubleBorderWidth);
                location.push((index + 2) * borderWidth + font._getHeight() * index);
            } else {
                location.push(doubleBorderWidth + defaultPadding);
                location.push((index + 1) * borderWidth + font._getHeight() * index + (defaultPadding - 1));
            }
            let brush: PdfBrush = parameter.foreBrush;
            const rect: Rectangle = parameter.bounds;
            let width: number = rect.width - doubleBorderWidth;
            let rectangle: Rectangle = rect;
            if (padding) {
                rectangle.height -= doubleBorderWidth;
            } else {
                rectangle.height -= borderWidth;
            }
            graphics.setClip(rectangle, PdfFillMode.winding);
            let selected: boolean = false;
            const selectedIndexes: number[] = this._dictionary.get('I');
            if (selectedIndexes !== null && typeof selectedIndexes !== 'undefined' && selectedIndexes.length > 0) {
                selectedIndexes.forEach((selectedIndex: number) => {
                    selected = selected || (selectedIndex === index);
                });
            }
            if (parameter.rotationAngle === 0) {
                if (selected) {
                    let x: number = rect.x + borderWidth;
                    if (padding) {
                        x += borderWidth;
                        width -= doubleBorderWidth;
                    }
                    brush = new PdfBrush({r: 153, g: 193, b: 218});
                    graphics.drawRectangle({x: x, y: location[1], width: width, height: font._getHeight()}, brush);
                    brush = new PdfBrush({r: 0, g: 0, b: 0});
                }
            }
            let value: string;
            if (item && typeof item === 'string') {
                value = item;
            } else {
                value = item[1] ? item[1] : item[0];
            }
            const itemTextBound: Rectangle = {x: location[0], y: location[1], width: width - location[0], height: font._getHeight()};
            if (parameter.rotationAngle > 0) {
                const state: PdfGraphicsState = graphics.save();
                if (parameter.rotationAngle === 90) {
                    graphics.translateTransform({x: 0, y: graphics._size.height});
                    graphics.rotateTransform(-90);
                    const x: number = graphics._size.height - (rectangle.y + rectangle.height);
                    const y: number = rectangle.x;
                    rectangle = {x: x, y: y, width: rectangle.height + rectangle.width, height: rectangle.width};
                } else if (parameter.rotationAngle === 270) {
                    graphics.translateTransform({x: graphics._size.width, y: 0});
                    graphics.rotateTransform(-270);
                    const x: number = rectangle.y;
                    const y: number = graphics._size.width - (rectangle.x + rectangle.width);
                    rectangle = {x: x, y: y, width: rectangle.height + rectangle.width, height: rectangle.width};
                } else if (parameter.rotationAngle === 180) {
                    graphics.translateTransform({x: graphics._size.width, y: graphics._size.height});
                    graphics.rotateTransform(-180);
                    const x: number = graphics._size.width - (rectangle.x + rectangle.width);
                    const y: number = graphics._size.height - (rectangle.y + rectangle.height);
                    rectangle = {x: x, y: y, width: rectangle.width, height: rectangle.height};
                }
                if (selected) {
                    let x: number = rect.x + borderWidth;
                    if (padding) {
                        x += borderWidth;
                        width -= doubleBorderWidth;
                    }
                    brush = new PdfBrush({r: 153, g: 193, b: 218});
                    graphics.drawRectangle({x: x, y: location[1], width: width, height: font._getHeight()}, brush);
                    brush = new PdfBrush({r: 0, g: 0, b: 0});
                }
                graphics.drawString(value, font, itemTextBound, null, brush, stringFormat);
                graphics.restore(state);
            } else {
                graphics.drawString(value, font, itemTextBound, null, brush, stringFormat);
            }
        }
        if (graphics._isTemplateGraphics && parameter.required) {
            graphics._sw._endMarkupSequence();
            graphics.restore();
        }
    }
    _getFontHeight(fontFamily: PdfFontFamily): number {
        const itemFont : PdfStandardFont = new PdfStandardFont(fontFamily, 12, PdfFontStyle.regular);
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.middle);
        let s: number = 0;
        if (_isNullOrUndefined(this._listValues) && this._listValues.length > 0) {
            let max: number = itemFont.measureString(this._listValues[0], {width: 0, height: 0}, format, 0, 0).width;
            for (let i: number = 1; i < this._listValues.length; ++i) {
                const value: number = itemFont.measureString(this._listValues[<number>i], {width: 0, height: 0}, format, 0, 0).width;
                max = (max > value) ? max : value;
            }
            s = ((12 * (this.bounds.width - 4 * this.border.width)) / max);
            s = (s > 12) ? 12 : s;
        }
        return s;
    }
}
/**
 * `PdfSignatureField` class represents the signature field objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new signature field
 * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
 * // Add the field into PDF form
 * form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfSignatureField extends PdfField {
    _widgetAnnot: PdfWidgetAnnotation;
    _appearance: PdfAppearance;
    private _rotateAngle: number = 0;
    _signature: PdfSignature;
    _isSigned: boolean = false;
    private _revision: number = -1;
    /**
     * Represents a signature field of the PDF document.
     *
     * @private
     */
    constructor()
    /**
     * Represents a signature field of the PDF document.
     *
     * @private
     * @param {PdfPage} page The page to which the signature field is added.
     * @param {string} name The name of the signature field.
     * @param {Rectangle} bounds The bounds of the signature field.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new signature field
     * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, bounds: Rectangle)
    /**
     * Represents a signature field of the PDF document.
     *
     * @param {PdfPage} page The page where the field is drawn.
     * @param {string} [name] The unique name of the field.
     * @param {Rectangle} bounds The bounds of the field (typically a visible area for signature appearance).
     * @param {object} properties Required properties bag.
     * @param {string} [properties.toolTip] Tooltip text shown by the viewer.
     * @param {PdfColor} [properties.color] Fore color used in the appearance (RGB).
     * @param {PdfColor} [properties.backColor] Background color.
     * @param {PdfColor} [properties.borderColor] Border color.
     * @param {PdfInteractiveBorder} [properties.border] Border settings (width, style, dash).
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Add new signature field into PDF form
     * document.form.add(new PdfSignatureField(
     *   page,
     *   'ApprovalSignature',
     *   { x: 50, y: 260, width: 200, height: 40 },
     *   {
     *     toolTip: 'Sign here',
     *     color: { r: 0, g: 0, b: 0 },
     *     backColor: { r: 255, g: 255, b: 255 },
     *     borderColor: { r: 0, g: 0, b: 0 },
     *     border: new PdfInteractiveBorder({width: 1, style: PdfBorderStyle.solid})
     *   }
     * ));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder
    })
    constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder
    }) {
        super();
        if (page && name && bounds) {
            this._initialize(page, name, bounds);
        }
        if (properties) {
            if ('toolTip' in properties && _isNullOrUndefined(properties.toolTip)) {
                this.toolTip = properties.toolTip;
            }
            if ('color' in properties && _isNullOrUndefined(properties.color)) {
                this.color = properties.color;
            }
            if ('border' in properties && _isNullOrUndefined(properties.border)) {
                this.border = properties.border;
            }
            if ('backColor' in properties && _isNullOrUndefined(properties.backColor)) {
                this.backColor = properties.backColor;
            }
            if ('borderColor' in properties && _isNullOrUndefined(properties.borderColor)) {
                this.borderColor = properties.borderColor;
            }
        }
    }
    /**
     * Gets the flag to indicate whether the field is signed or not.
     *
     * @returns {boolean} Returns true if the field is signed; otherwise, false.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the loaded signature field
     * let field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
     * // Get the signed status of the field
     * let isSigned: boolean = field.isSigned;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isSigned(): boolean {
        if (!this._isSigned) {
            this._checkSigned();
        }
        return this._isSigned;
    }
    /**
     * Gets the background color of the field.
     *
     * @returns {PdfColor} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the background color of the field.
     * let backColor: PdfColor = field.backColor;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get backColor(): PdfColor {
        return this._parseBackColor(true);
    }
    /**
     * Sets the background color of the field.
     *
     * @param {PdfColor} value Array with R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the signature field at index 0
     * let field1: PdfField = document.form.fieldAt(0);
     * // Sets the background color of the field.
     * field1.backColor = {r: 255, g: 0, b: 0};
     * // Access the signature field at index 1
     * let field2: PdfField = document.form.fieldAt(1);
     * // Sets the background color of the field to transparent.
     * field2.backColor = {r: 0, g: 0, b: 0, isTransparent: true};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set backColor(value: PdfColor) {
        this._updateBackColor(value, true);
    }
    static _load(form: PdfForm,
                 dictionary: _PdfDictionary,
                 crossReference: _PdfCrossReference,
                 reference: _PdfReference): PdfSignatureField {
        const field: PdfSignatureField = new PdfSignatureField();
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
        return field;
    }
    /**
     * Gets the signature associated with the PDF signature field.
     *
     * @returns {PdfSignature} - The signature instance.
     *
     * ```typescript
     * // Load the document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Gets the signature field
     * let field: PdfSignatureField = form.fieldAt(0) as PdfSignatureField;
     * // Gets the PDF signature
     * let signature: PdfSignature = field.getSignature();
     * // Gets the signature options
     * let options: PdfSignatureOptions = signature.getSignatureOptions();
     * // Gets the cryptographic standard of the signature
     * let cryptographicStandard: CryptographicStandard = options.cryptographicStandard;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getSignature(): PdfSignature {
        if (!this._signature && this._dictionary.has('V')) {
            this._signature = this._crossReference._document._getSignature(this._dictionary.get('V'), this);
        }
        return this._signature;
    }
    /**
     * Sets the signature for the PDF signature field.
     *
     * @param {PdfSignature} signature - The signature to assign to the field.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load the document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new signature field
     * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
     * // Create a new signature using PFX data and private key
     * const sign: PdfSignature = PdfSignature.create(certData, password, { cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 });
     * // Sets the signature to the field
     * field.setSignature(sign);
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setSignature(signature: PdfSignature): void {
        if (this._crossReference) {
            const form: PdfForm = this._crossReference._document.form;
            form._signatureFlag = _SignatureFlag.signatureExists | _SignatureFlag.appendOnly;
            signature._signatureField = this;
            signature._signatureDictionary = signature._createDictionary(this._crossReference._document, signature);
            this._signature = signature;
            const ref: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(ref, signature._signatureDictionary._dictionary);
            signature._reference = ref;
            signature._signatureDictionary._dictionary._isSignature = true;
            this._crossReference._signature = signature._signatureDictionary;
            this._dictionary.update('V', ref);
            this._dictionary.update('Ff', 0);
            this._crossReference._signatureCollection.push(signature);
        }
    }
    /**
     * Gets the appearance of the PDF signature field.
     *
     * @returns {PdfAppearance} - The appearance of the PDF signature field.
     *
     * ```typescript
     * // Load the document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new signature field
     * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
     * // Create a new signature using PFX data and private key
     * const sign: PdfSignature = PdfSignature.create(certData, password, { cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 });
     * // Sets the signature to the field
     * field.setSignature(sign);
     * // Gets the field Appearance
     * let appearance = field.getAppearance();
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getAppearance(): PdfAppearance {
        if (this._isLoaded) {
            return null;
        }
        if (!this._appearance) {
            const nativeRectangle: Rectangle = {x: 0, y: 0, width: this.bounds.width, height: this.bounds.height};
            this._appearance = new PdfAppearance(nativeRectangle, this._widgetAnnot);
            this._appearance.normal = new PdfTemplate(nativeRectangle, this._crossReference);
        }
        return this._appearance;
    }
    /**
     * Gets the revision index of the PDF signature field.
     *
     * @returns {number} - The revision index of the signature.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Gets the signature field
     * let signature: PdfSignatureField = form.fieldAt(0) as PdfSignatureField;
     * // Gets the revision number associated with the signature field
     * let revision: number = signature.getRevision();
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getRevision(): number {
        if (this.isSigned && this._revision === -1) {
            this._revision = this._getSignedRevision();
        }
        return this._revision;
    }
    _initialize(page: PdfPage, name: string, bounds: {x: number, y: number, width: number, height: number}): void {
        this._crossReference = page._crossReference;
        this._page = page;
        this._name = name;
        this._dictionary = new _PdfDictionary(this._crossReference);
        this._ref = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(this._ref, this._dictionary);
        this._dictionary.objId = this._ref.toString();
        this._dictionary.update('FT', _PdfName.get('Sig'));
        this._dictionary.update('T', name);
        this._defaultIndex = 0;
        this._initializeFont(this._defaultFont);
        this._createItem(bounds);
    }
    _createItem(bounds: {x: number, y: number, width: number, height: number}): void {
        this._widgetAnnot = new PdfWidgetAnnotation();
        this._widgetAnnot._create(this._page, bounds, this);
        this._widgetAnnot._dictionary.update('MK', new _PdfDictionary(this._crossReference));
        this._widgetAnnot._mkDictionary.update('BC', [0, 0, 0]);
        this._widgetAnnot._mkDictionary.update('BG', [1, 1, 1]);
        this._widgetAnnot._dictionary.update('DA', `${this._fontName} 8 Tf 0 0 0 rg`);
        this._addToKid(this._widgetAnnot);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._signature && this._signature._isLocked &&
        !this._signature._certify && !this._signature._signed) {
            this._signature._lockSignature();
        }
        const needAppearance: boolean = this._setAppearance || this._form._setAppearance;
        if (isFlatten || needAppearance || this._appearance) {
            const count: number = this._kidsCount;
            if (count > 0) {
                for (let i: number = 0; i < count; i++) {
                    const item: PdfWidgetAnnotation = this.itemAt(i);
                    if (this._appearance) {
                        const template: PdfTemplate =  this._appearance.normal;
                        this._rotateAngle = this._widgetAnnot._getRotationAngle();
                        _setMatrix(template, this.rotate);
                        const dictionary: _PdfDictionary = new _PdfDictionary();
                        template._content.dictionary._updated = true;
                        const reference: _PdfReference = this._crossReference._getNextReference();
                        this._crossReference._cacheMap.set(reference, template._content);
                        template._content.reference = reference;
                        dictionary.set('N', reference);
                        dictionary._updated = true;
                        this._widgetAnnot._dictionary.set('AP', dictionary);
                    } else if (item && item._dictionary && (needAppearance || (isFlatten && !item._dictionary.has('AP')))) {
                        const template: PdfTemplate = this._createAppearance(item, isFlatten);
                        this._addAppearance(item._dictionary, template, 'N');
                    }
                }
            }
        }
        if (isFlatten) {
            const count: number = this._kidsCount;
            if (count > 0) {
                let firstItemTemplate: PdfTemplate;
                for (let i: number = 0; i < count; i++) {
                    const item: PdfWidgetAnnotation = this.itemAt(i);
                    if (item && item._dictionary) {
                        const page: PdfPage = item.page;
                        if (page) {
                            if (!firstItemTemplate && i === 0) {
                                firstItemTemplate = this._getItemTemplate(item._dictionary);
                            }
                            if (this._appearance) {
                                firstItemTemplate = this._appearance.normal;
                            }
                            this._flattenSignature(item._dictionary, page, item.bounds, firstItemTemplate);
                        }
                    }
                }
            } else {
                this._flattenSignature(this._dictionary, this.page, this.bounds);
            }
        }
    }
    _createAppearance(widget: PdfWidgetAnnotation, isFlatten: boolean): PdfTemplate {
        const bounds: {x: number, y: number, width: number, height: number} = widget.bounds;
        const template: PdfTemplate = new PdfTemplate([0, 0, bounds.width, bounds.height], this._crossReference);
        _setMatrix(template, null);
        template._writeTransformation = false;
        const graphics: PdfGraphics = template.graphics;
        const parameter: _PaintParameter = new _PaintParameter();
        parameter.bounds = {x: 0, y: 0, width: bounds.width, height: bounds.height};
        const backcolor: PdfColor = widget.backColor;
        if (isFlatten && backcolor && !backcolor.isTransparent) {
            parameter.backBrush = new PdfBrush(backcolor);
        }
        parameter.foreBrush = new PdfBrush(widget.color);
        const border: PdfInteractiveBorder = widget.border;
        if (widget.borderColor) {
            parameter.borderPen = new PdfPen(widget.borderColor, border.width);
        }
        parameter.borderWidth = border.width;
        parameter.borderStyle = border.style;
        if (backcolor) {
            const shadowColor: number[] = [backcolor.r - 64, backcolor.g - 64, backcolor.b - 64];
            const color: PdfColor = {r: shadowColor[0] >= 0 ? shadowColor[0] : 0,
                g: shadowColor[1] >= 0 ? shadowColor[1] : 0,
                b: shadowColor[2] >= 0 ? shadowColor[2] : 0};
            parameter.shadowBrush = new PdfBrush(color);
        }
        parameter.rotationAngle = widget.rotate;
        graphics.save();
        graphics._initializeCoordinates();
        this._drawRectangularControl(graphics, parameter);
        graphics.restore();
        return template;
    }
    _flattenSignature(dictionary: _PdfDictionary,
                      page: PdfPage,
                      bounds: { x: number, y: number, width: number, height: number },
                      signatureTemplate?: PdfTemplate) : void {
        let template: PdfTemplate;
        if (dictionary.has('AP')) {
            const appearanceDictionary: _PdfDictionary = dictionary.get('AP');
            if (appearanceDictionary && appearanceDictionary.has('N')) {
                const appearanceStream: _PdfBaseStream = appearanceDictionary.get('N');
                const reference: _PdfReference = appearanceDictionary.getRaw('N');
                if (reference && appearanceStream) {
                    appearanceStream.reference = reference;
                }
                if (appearanceStream) {
                    if (signatureTemplate) {
                        template = signatureTemplate;
                    } else {
                        template = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                    if (template && page) {
                        const graphics: PdfGraphics = page.graphics;
                        const state: PdfGraphicsState = graphics.save();
                        if (this.isSigned) {
                            template._isSignature = true;
                        }
                        if (page.rotation !== PdfRotationAngle.angle0) {
                            const newGraphics: PdfGraphics = new PdfGraphics(graphics._size, graphics._sw._stream,
                                                                             graphics._crossReference, page);
                            newGraphics.drawTemplate(template, this._calculateTemplateBounds(bounds, page, template, newGraphics));
                        } else {
                            graphics.drawTemplate(template, bounds);
                        }
                        graphics.restore(state);
                    }
                }
            }
        } else if (signatureTemplate && page) {
            template = signatureTemplate;
            const graphics: PdfGraphics = page.graphics;
            const state: PdfGraphicsState = graphics.save();
            if (page.rotation !== PdfRotationAngle.angle0) {
                const newGraphics: PdfGraphics = new PdfGraphics(graphics._size, graphics._sw._stream, graphics._crossReference, page);
                newGraphics.drawTemplate(template, this._calculateTemplateBounds(bounds, page, template, newGraphics));
            } else {
                graphics.drawTemplate(template, bounds);
            }
            graphics.restore(state);
        }
    }
    _calculateTemplateBounds(bounds: { x: number, y: number, width: number, height: number },
                             page: PdfPage,
                             template: PdfTemplate,
                             graphics: PdfGraphics) : { x: number, y: number, width: number, height: number } {
        let x: number = bounds.x;
        let y: number = bounds.y;
        if (page) {
            const graphicsRotation: number = this._obtainGraphicsRotation(page.graphics._matrix);
            if (graphicsRotation === 90) {
                graphics.translateTransform({x: template._size.height, y: 0});
                graphics.rotateTransform(90);
                x = bounds.x;
                y = -(page._size.height - bounds.y - bounds.height);
            } else if (graphicsRotation === 180) {
                graphics.translateTransform({x: template._size.width, y: template._size.height});
                graphics.rotateTransform(180);
                x = -(page._size.width - (bounds.x + template._size.width));
                y = -(page._size.height - bounds.y - template._size.height);
            } else if (graphicsRotation === 270) {
                graphics.translateTransform({x: 0, y: template._size.width});
                graphics.rotateTransform(270);
                if (page._size.width > page._size.height && template._content && template._content.dictionary && template._content.dictionary.has('Matrix')) {
                    x = -(page._size.width - bounds.x - template.size.width);
                    y = bounds.y - bounds.height;
                } else {
                    x = -(page._size.width - bounds.x - bounds.width);
                    y = bounds.y;
                }
            }
        }
        return {x: x, y: y, width: bounds.width, height: bounds.height};
    }
    _obtainGraphicsRotation(matrix: _PdfTransformationMatrix): number {
        let angle: number = Math.round(Math.atan2(matrix._matrix._elements[2], matrix._matrix._elements[0]) * 180 / Math.PI);
        switch (angle) {
        case -90:
            angle = 90;
            break;
        case -180:
            angle = 180;
            break;
        case 90:
            angle = 270;
            break;
        }
        return angle;
    }
    _getItemTemplate(dictionary: _PdfDictionary): PdfTemplate {
        let template: PdfTemplate;
        if (dictionary && dictionary.has('AP')) {
            const appearanceDictionary: _PdfDictionary = dictionary.get('AP');
            if (appearanceDictionary && appearanceDictionary.has('N')) {
                const appearanceStream: _PdfBaseStream = appearanceDictionary.get('N');
                const reference: _PdfReference = appearanceDictionary.getRaw('N');
                if (reference) {
                    appearanceStream.reference = reference;
                }
                if (appearanceStream) {
                    template = new PdfTemplate(appearanceStream, this._crossReference);
                }
            }
        }
        return template;
    }
    _checkSigned(): void {
        if (this._dictionary && this._dictionary.has('V')) {
            const dictionary: _PdfDictionary = this._dictionary.get('V');
            if (dictionary !== null && typeof dictionary !== 'undefined' && dictionary.size > 0) {
                this._isSigned = true;
            }
        }
    }
    private _getSignedRevision(): number {
        const signatureDictionary: _PdfDictionary = this._dictionary.get('V');
        const range: number[] = signatureDictionary.getArray('ByteRange');
        const start: number = range[0] + range[1];
        const end: number = range[2] + range[3];
        let revision: number = -1;
        if (this._crossReference && this._crossReference._document) {
            const eofOffsets: number[] = this._crossReference._document.getRevisions();
            if (eofOffsets && Array.isArray(eofOffsets) && eofOffsets.length > 0) {
                for (let i: number = 0; i < eofOffsets.length; i++) {
                    const offset: number = eofOffsets[<number>i];
                    if (offset > start && offset === end) {
                        revision = i + 1;
                        break;
                    }
                }
            }
        }
        return revision;
    }
}
export class _PdfDefaultAppearance {
    fontName: string;
    fontSize: number;
    color: PdfColor;
    constructor(da?: string) {
        let color: number[];
        let fontName: string = '';
        let fontSize: number = 0;
        if (da && typeof da === 'string' && da !== '') {
            const sliced: string[] = da.split(' ');
            sliced.forEach((item: string, i: number) => {
                switch (item) {
                case 'g':
                    color = [Number.parseFloat(sliced[i - 1])];
                    break;
                case 'rg':
                    color = [Number.parseFloat(sliced[i - 3]), Number.parseFloat(sliced[i - 2]), Number.parseFloat(sliced[i - 1])];
                    break;
                case 'k':
                    color = [Number.parseFloat(sliced[i - 4]), Number.parseFloat(sliced[i - 3]), Number.parseFloat(sliced[i - 2]),
                        Number.parseFloat(sliced[i - 1])];
                    break;
                case 'Tf':
                    fontSize = Number.parseFloat(sliced[i - 1]);
                    fontName = sliced[i - 2].substring(1);
                    if (fontName.includes('#2C')) {
                        fontName.replace('#2C', ',');
                    }
                    break;
                }
            });
        }
        this.fontName = fontName;
        this.fontSize = fontSize;
        this.color = (typeof color !== 'undefined') ? _parseColor(color) : {r: 0, g: 0, b: 0};
    }
    toString(): string {
        const color: number[] = [Number.parseFloat((this.color.r / 255).toFixed(3)),
            Number.parseFloat((this.color.g / 255).toFixed(3)),
            Number.parseFloat((this.color.b / 255).toFixed(3))];
        return '/' +
            this.fontName +
            ' ' +
            this.fontSize +
            ' Tf ' +
            color[0].toString() +
            ' ' +
            color[1].toString() +
            ' ' +
            color[2].toString() +
            ' rg';
    }
}
