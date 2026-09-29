import { _PdfDictionary, _PdfReference, _PdfName } from './../pdf-primitives';
import { _PdfCrossReference, _PdfObjectInformation } from './../pdf-cross-reference';
import { PdfForm } from './form';
import { PdfRadioButtonListItem, PdfStateItem, PdfWidgetAnnotation, PdfListFieldItem, _PaintParameter, PdfInteractiveBorder } from './../annotations/annotation';
import { _getItemValue, _checkField, _removeReferences, _removeDuplicateReference, _updateVisibility, _styleToString, _getStateTemplate, _findPage, _getInheritableProperty, _getNewGuidString, _calculateBounds, _parseColor, _mapHighlightMode, _reverseMapHighlightMode, _mapBorderStyle, _getUpdatedBounds, _setMatrix, _obtainFontDetails, _isNullOrUndefined, _stringToPdfString, _mapFont, _isRightToLeftCharacters, _getFontStyle, _createFontStream, _encode, _getFontFromDescriptor, _decodeFontFamily, _updateDashedBorderStyle, _bytesEqual, _areArrayEqual, _toRectangle } from './../utils';
import { _PdfCheckFieldState, PdfFormFieldVisibility, _FieldFlag, PdfAnnotationFlag, PdfTextAlignment, PdfHighlightMode, PdfBorderStyle, PdfRotationAngle, PdfCheckBoxStyle, PdfFormFieldsTabOrder, PdfFillMode, PdfTextDirection, _PdfWordWrapType, _SignatureFlag, PdfCertificationFlag, RevocationStatus, SignatureStatus, RevocationType } from './../enumerator';
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
import { PdfFieldActions, PdfJavaScriptAction } from '../pdf-action';
import { PdfSignature } from '../security/digital-signature/signature/pdf-signature';
import { Point, Size, Rectangle, PdfColor, PdfSignatureValidationResult, TimestampInformation, RevocationResult, LtvVerificationInformation, PdfSignatureValidationOptions, PdfSignerCertificate, PdfRevocationCertificate, PdfX509CertificateProperties } from './../pdf-type';
import { _PdfCryptographicMessageSyntaxSigner } from '../security/digital-signature/signature/cryptographic-signer';
import { _PdfX509CertificateStructure } from '../security/digital-signature/x509/x509-certificate-structure';
import { _PdfSignedCertificate } from '../security/digital-signature/x509/x509-signed-certificate';
import { _PdfCipherParameter, _PdfRonCipherParameter } from '../security/digital-signature/x509/x509-cipher-handler';
import { _PdfX509Extension, _PdfX509Extensions } from '../security/digital-signature/x509/x509-extensions';
import { _PdfObjectIdentifier } from '../security/digital-signature/asn1/identifier-mapping';
import { _PdfAbstractSyntaxElement } from '../security/digital-signature/asn1/abstract-syntax';
import { _ICipherParam } from '../security/digital-signature/signature/pdf-interfaces';
import { _PdfUniqueEncodingElement } from '../security/digital-signature/asn1/unique-encoding-element';
import { _PdfRsaPublicKeyParam } from '../security/digital-signature/signature/ron-cipher';
import { initializeTelemetryFeature } from '@syncfusion/ej2-base';
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
    /**
     * Reference to the field object in the cross-reference table.
     *
     * @private
     */
    _ref: _PdfReference;
    /**
     * Underlying dictionary that stores the field entries.
     *
     * @private
     */
    _dictionary: _PdfDictionary;
    /**
     * Cross-reference associated with the current document.
     *
     * @private
     */
    _crossReference: _PdfCrossReference;
    /**
     * Enables grouping behavior across related widgets.
     *
     * @private
     */
    _enableGrouping: boolean = false;
    /**
     * Indicates whether the field resides on a duplicated page.
     *
     * @private
     */
    _isDuplicatePage: boolean = false;
    /**
     * Parent form that owns this field.
     *
     * @private
     */
    _form: PdfForm;
    /**
     * Child widget references for this field.
     *
     * @private
     */
    _kids: _PdfReference[];
    /**
     * Default index used to select an item.
     *
     * @private
     */
    _defaultIndex: number;
    /**
     * Cache of parsed widget annotations keyed by index.
     *
     * @private
     */
    _parsedItems: Map<number, PdfWidgetAnnotation>;
    /**
     * Fully qualified field name.
     *
     * @private
     */
    _name: string;
    /**
     * Actual field name without incremental suffixes.
     *
     * @private
     */
    _actualName: string;
    /**
     * Mapping name used for external representation.
     *
     * @private
     */
    _mappingName: string;
    /**
     * Alternate text for the field.
     *
     * @private
     */
    _alternateName: string;
    /**
     * Maximum allowed text length for text-entry fields.
     *
     * @private
     */
    _maxLength: number;
    /**
     * Visibility setting for the form field.
     *
     * @private
     */
    _visibility: PdfFormFieldVisibility;
    /**
     * Indicates whether the field is visible.
     *
     * @private
     */
    _visible: boolean = true;
    /**
     * The page on which the field is placed.
     *
     * @private
     */
    _page: PdfPage;
    /**
     * Default appearance used for text rendering in the field.
     *
     * @private
     */
    _da: _PdfDefaultAppearance;
    /**
     * Field-level flags such as read-only, required, etc.
     *
     * @private
     */
    _flags: _FieldFlag;
    /**
     * Indicates whether the field was loaded from an existing document.
     *
     * @private
     */
    _isLoaded: boolean;
    /**
     * Indicates whether an appearance stream has been set for the field.
     *
     * @private
     */
    _setAppearance: boolean;
    /**
     * String formatting applied to field text.
     *
     * @private
     */
    _stringFormat: PdfStringFormat;
    /**
     * Font used for rendering the field content.
     *
     * @private
     */
    _font: PdfFont;
    /**
     * Name of the font used in the field appearance.
     *
     * @private
     */
    _fontName: string;
    /**
     * Gray brush used for drawing default appearances.
     *
     * @private
     */
    _gray: PdfBrush;
    /**
     * Silver brush used for drawing default appearances.
     *
     * @private
     */
    _silver: PdfBrush;
    /**
     * White brush used for drawing default appearances.
     *
     * @private
     */
    _white: PdfBrush;
    /**
     * Black brush used for drawing default appearances.
     *
     * @private
     */
    _black: PdfBrush;
    /**
     * Indicates transparent background for the field.
     *
     * @private
     */
    _isTransparentBackColor: boolean = false;
    /**
     * Indicates transparent border for the field.
     *
     * @private
     */
    _isTransparentBorderColor: boolean = false;
    /**
     * Tab order index for keyboard navigation.
     *
     * @private
     */
    _tabIndex: number;
    /**
     * Index position of the underlying widget annotation.
     *
     * @private
     */
    _annotationIndex: number;
    /**
     * Default font used for field content.
     *
     * @private
     */
    _defaultFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
    /**
     * Font used for field appearance generation.
     *
     * @private
     */
    _appearanceFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
    /**
     * Default font used for list item text.
     *
     * @private
     */
    _defaultItemFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.timesRoman, 12);
    /**
     * Indicates whether the field should be flattened.
     *
     * @private
     */
    _flatten: boolean = false;
    /**
     * Font used for circle caption rendering.
     *
     * @private
     */
    _circleCaptionFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 8, PdfFontStyle.regular);
    /**
     * Horizontal alignment of the field text.
     *
     * @private
     */
    _textAlignment: PdfTextAlignment;
    /**
     * Indicates whether field updates are in progress.
     *
     * @private
     */
    _isUpdating: boolean = false;
    /**
     * Indicates whether field data is being imported.
     *
     * @private
     */
    _isImport: boolean = false;
    /**
     * Export value used for checkable fields.
     *
     * @private
     */
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
                    this._name = names.slice().reverse().join('.');
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
        let value: PdfColor = {r: 0, g: 0, b: 0};
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
    /**
     * Gets a cached gray brush or creates one when needed.
     *
     * @private
     * @returns {PdfBrush} returns the pdfbrush
     */
    get _grayBrush(): PdfBrush {
        if (!this._gray) {
            this._gray = new PdfBrush({r: 128, g: 128, b: 128});
        }
        return this._gray;
    }
    /**
     * Gets a cached silver brush or creates one when needed.
     *
     * @private
     * @returns {PdfBrush} returns the pdfbrush
     */
    get _silverBrush(): PdfBrush {
        if (!this._silver) {
            this._silver = new PdfBrush({r: 198, g: 198, b: 198});
        }
        return this._silver;
    }
    /**
     * Gets a cached white brush or creates one when needed.
     *
     * @private
     * @returns {PdfBrush} returns the pdfbrush
     */
    get _whiteBrush(): PdfBrush {
        if (!this._white) {
            this._white = new PdfBrush({r: 255, g: 255, b: 255});
        }
        return this._white;
    }
    /**
     * Gets a cached black brush or creates one when needed.
     *
     * @private
     * @returns {PdfBrush} returns the pdfbrush
     */
    get _blackBrush(): PdfBrush {
        if (!this._black) {
            this._black = new PdfBrush({r: 0, g: 0, b: 0});
        }
        return this._black;
    }
    /**
     * Gets the number of child items associated with the annotation.
     *
     * @private
     * @returns {number} returns the kids count.
     */
    get _kidsCount(): number {
        return this._kids ? this._kids.length : 0;
    }
    /**
     * Indicates whether a background color is defined in the annotation or its appearance dictionary.
     *
     * @private
     * @returns {boolean} `true` if a background color is defined; otherwise, `false`.
     */
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
    /**
     * Indicates whether a border color is defined in the annotation or its appearance dictionary.
     *
     * @private
     * @returns {boolean} `true` if a border color is defined; otherwise, `false`.
     */
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
    /**
     * Determines the effective background color using widget and appearance dictionaries.
     *
     * @private
     * @param {boolean} hasTransparency is true if it has parsed backcolor.
     * @returns {PdfColor} of the background.
     */
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
    /**
     * Determines the effective border color using widget and appearance dictionaries.
     *
     * @private
     * @param {boolean} hasTransparency - It returns true if transparency is present.
     * @returns {PdfColor} returns the pdfcolor.
     */
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
    /**
     * Updates the border style width and dash entries in the appearance dictionary.
     *
     * @private
     * @param {PdfColor} value - The background color.
     * @param {boolean} hasTransparency - It returns true if transparency is present.
     * @returns {void} nothing.
     */
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
    /**
     * Updates the annotation border color handling transparency and appearance entries.
     *
     * @private
     * @param {PdfColor} value - The border color to apply (RGB; may include `isTransparent`).
     * @param {boolean} [hasTransparency=false] - When `true`, treats `value.isTransparent` as a request to clear border color.
     * @returns {void} nothing.
     */
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
     *
     * @param {number} index Item index.
     * @returns {PdfWidgetAnnotation} Loaded PDF form field item at the specified index.
     */
    public itemAt(index: number): PdfWidgetAnnotation {
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
     * Gets the form field appearances as PDF templates.
     *
     * @returns {PdfTemplate[]} Returns the appearance templates of the form field.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first form field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Gets the form field appearances as PDF templates.
     * let template: PdfTemplate[] = field.createTemplate();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public createTemplate(): PdfTemplate[] {
        let templates: PdfTemplate[];
        if (this instanceof PdfRadioButtonListField) {
            templates = this._getPdfRadioButtonListFieldTemplates();
        } else if (this instanceof PdfCheckBoxField) {
            templates = this._getCheckboxFieldTemplates();
        } else {
            templates = this._getFieldsTemplate();
        }
        return templates;
    }
    /**
     * Builds the appearance template list for the field widgets.
     *
     * @private
     * @returns {PdfTemplate[]} Collected appearance templates; empty when no widget could be resolved.
     */
    _getFieldsTemplate(): PdfTemplate[] {
        const templates: PdfTemplate[] = [];
        const count: number = this._kidsCount;
        if (count > 0) {
            for (let i: number = 0; i < count; i++) {
                const item: PdfWidgetAnnotation = this.itemAt(i);
                if (item) {
                    const template: PdfTemplate = item.createTemplate();
                    templates.push(template);
                }
            }
        } else {
            let widget: PdfWidgetAnnotation = this.itemAt(this._defaultIndex);
            if (!widget && this._dictionary) {
                widget = PdfWidgetAnnotation._load(this._dictionary, this._crossReference);
            }
            if (widget) {
                const template: PdfTemplate = widget.createTemplate();
                templates.push(template);
            }
        }
        return templates;
    }
    /**
     * Builds the appearance templates for the checkbox field across checked/unchecked states.
     *
     * @private
     * @returns {PdfTemplate[]} Collected checkbox appearance templates; empty when no item qualifies.
     */
    _getCheckboxFieldTemplates(): PdfTemplate[] {
        const templates: PdfTemplate[] = [];
        const count: number = this._kidsCount;
        if (count > 0) {
            for (let i: number = 0; i < this._kidsCount; i++) {
                const item: PdfWidgetAnnotation = this.itemAt(i);
                if (item && item instanceof PdfStateItem && !this._checkFieldFlag(item._dictionary)) {
                    const state: _PdfCheckFieldState = item.checked ?
                        _PdfCheckFieldState.checked :
                        _PdfCheckFieldState.unchecked;
                    const template: PdfTemplate = this._getStateTemplate(state, item);
                    if (template) {
                        templates.push(template);
                    }
                }
            }
        } else if (this instanceof PdfCheckBoxField) {
            const style: _PdfCheckFieldState = this.checked ?
                _PdfCheckFieldState.checked :
                _PdfCheckFieldState.unchecked;
            const template: PdfTemplate = this._getStateTemplate(style, this);
            if (template) {
                templates.push(template);
            }
        }
        return templates;
    }
    /**
     * Builds the appearance templates for the radio button list per selected/unselected state.
     *
     * @private
     * @returns {PdfTemplate[]} Collected radio button appearance templates; empty when no item qualifies.
     */
    _getPdfRadioButtonListFieldTemplates(): PdfTemplate[] {
        const templates: PdfTemplate[] = [];
        const count: number = this._kidsCount;
        if (count > 0) {
            if (this instanceof PdfRadioButtonListField) {
                for (let i: number = 0; i < this._kidsCount; i++) {
                    const item: PdfWidgetAnnotation = this.itemAt(i);
                    if (item && item instanceof PdfRadioButtonListItem && !this._checkFieldFlag(item._dictionary)) {
                        const state: _PdfCheckFieldState = this.selectedIndex === i ?
                            _PdfCheckFieldState.checked :
                            _PdfCheckFieldState.unchecked;
                        const template: PdfTemplate = this._getStateTemplate(state, item);
                        if (template) {
                            templates.push(template);
                        }
                    }
                }
            }
        } else if (this instanceof PdfRadioButtonListField) {
            const style: _PdfCheckFieldState = this.selectedIndex !== -1 ?
                _PdfCheckFieldState.checked :
                _PdfCheckFieldState.unchecked;
            const template: PdfTemplate = this._getStateTemplate(style, this);
            if (template) {
                templates.push(template);
            }
        }
        return templates;
    }
    /**
     * Resolves the appearance template for the requested check or radio state.
     *
     * @private
     * @param {_PdfCheckFieldState} state - Check field state.
     * @param {PdfStateItem | PdfField} item - Source widget (or its parent field).
     * @returns {PdfTemplate} Appearance template, or `undefined` when no stream matches.
     */
    _getStateTemplate(state: _PdfCheckFieldState, item: PdfStateItem | PdfField): PdfTemplate {
        const value: string = state === _PdfCheckFieldState.checked ? _getItemValue(item._dictionary) : 'Off';
        let template: PdfTemplate;
        if (item._dictionary.has('AP')) {
            const dictionary: _PdfDictionary = item._dictionary.get('AP');
            if (dictionary && dictionary.has('N')) {
                let appearance: any = dictionary.get('N'); // eslint-disable-line
                if (appearance && appearance instanceof _PdfBaseStream) {
                    appearance = appearance.dictionary;
                }
                if (appearance && appearance instanceof _PdfDictionary && (value && value !== '' && appearance.has(value))) {
                    const stream: _PdfBaseStream = appearance.get(value);
                    const reference: _PdfReference = appearance.getRaw(value);
                    if (reference) {
                        stream.reference = reference;
                    }
                    if (stream && stream.dictionary instanceof _PdfDictionary) {
                        const resolvedWidget: PdfWidgetAnnotation = (item instanceof PdfStateItem)
                            ? item
                            : this.itemAt(this._defaultIndex || 0);
                        if (resolvedWidget) {
                            template = new PdfTemplate();
                            template._isExported = true;
                            const templateDictionary: _PdfDictionary = stream.dictionary;
                            const hasDictionary: boolean = templateDictionary !== undefined && templateDictionary !== null;
                            const matrix: number[] = hasDictionary ? templateDictionary.getArray('Matrix') : undefined;
                            const bounds: number[] = hasDictionary ? templateDictionary.getArray('BBox') : undefined;
                            if (matrix) {
                                const mMatrix: number[] = [];
                                for (let i: number = 0; i < matrix.length; i++) {
                                    const mValue: number = matrix[<number>i];
                                    mMatrix[<number>i] = mValue;
                                }
                                if (bounds && bounds.length > 3) {
                                    const rect: { x: number, y: number, width: number, height: number } = _toRectangle(bounds);
                                    const rectangle: number[] = resolvedWidget._transformBBox(rect, mMatrix);
                                    template._size = {width: rectangle[2], height: rectangle[3]};
                                    template._templateOriginalSize = {width: rect.width, height: rect.height};
                                }
                                if (stream && typeof stream.offset === 'number' && stream.offset !== 0) {
                                    stream.offset = 0;
                                }
                            } else if (bounds && (bounds[2] === resolvedWidget.bounds.width && bounds[3] === resolvedWidget.bounds.height)
                                    || (bounds && _areArrayEqual(resolvedWidget._dictionary.get('Rect'), bounds))) {
                                if (hasDictionary) {
                                    templateDictionary.update('Matrix', [1, 0, 0, 1, -bounds[0], -bounds[1]]);
                                }
                                if (resolvedWidget._dictionary.has('Vertices')) {
                                    template._size = {width: bounds[2], height: bounds[3]};
                                } else {
                                    template._size = {width: resolvedWidget.bounds.width, height: resolvedWidget.bounds.height};
                                    resolvedWidget._crossReference._cacheMap.set(reference, stream);
                                }
                            } else if (bounds) {
                                const identityMatrix: number[] = [1, 0, 0, 1, 0, 0];
                                const templateSize: number[] = resolvedWidget._getTransformMatrix(resolvedWidget._dictionary.get('Rect'), bounds, identityMatrix);
                                if (resolvedWidget.bounds.width === templateSize[0] && resolvedWidget.bounds.height === templateSize[3]) {
                                    if (hasDictionary) {
                                        templateDictionary.update('Matrix', [templateSize[0], 0, 0, templateSize[3], 0, 0]);
                                    }
                                    template._size = {width: templateSize[0], height: templateSize[3]};
                                    resolvedWidget._crossReference._cacheMap.set(reference, stream);
                                } else {
                                    if (hasDictionary) {
                                        templateDictionary.update('Matrix', [1, 0, 0, 1, -bounds[0], -bounds[1]]);
                                    }
                                    template._size = bounds
                                        ? {width: bounds[2], height: bounds[3]}
                                        : {width: resolvedWidget.bounds.width, height: resolvedWidget.bounds.height};
                                }
                            }
                            template._exportStream(appearance, resolvedWidget._crossReference, value);
                        }
                    }
                }
            }
        }
        return template;
    }
    /**
     * Sets the flag to indicate the new appearance creation.
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
     *
     * @param {boolean} value Set appearance.
     * @returns {void} Nothing.
     */
    public setAppearance(value: boolean): void {
        this._setAppearance = value;
    }
    /**
     * Gets the value associated with the specified key.
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
     *
     * @param {string} name Key.
     * @returns {string} Value associated with the key.
     */
    public getValue(name: string): string {
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
     *
     * @param {string} name Key.
     * @param {string} value Value associated with the key..
     * @returns {void} Nothing.
     */
    public setValue(name: string, value: string): void {
        if (name && name !== '' && value && value !== '') {
            this._dictionary.update(name, value);
        }
    }
    /**
     * Remove the form field item from the specified index.
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
     *
     * @param {number} index Item index to remove.
     * @returns {void} Nothing.
     */
    public removeItemAt(index: number): void {
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
     *
     * @param {PdfWidgetAnnotation} item Item to remove.
     * @returns {void} Nothing.
     */
    public removeItem(item: PdfWidgetAnnotation): void {
        if (item && item._ref) {
            const index: number = this._kids.indexOf(item._ref);
            if (index !== -1) {
                this.removeItemAt(index);
            }
        }
    }
    /**
     * Gets the resolved field flag value using inheritable properties with default fallback.
     *
     * @private
     * @returns {_FieldFlag} The resolved field flags.
     */
    get _fieldFlags(): _FieldFlag {
        if (typeof this._flags === 'undefined') {
            this._flags = _getInheritableProperty(this._dictionary, 'Ff', false, true, 'Parent');
            if (typeof this._flags === 'undefined') {
                this._flags = _FieldFlag.default;
            }
        }
        return this._flags;
    }
    /**
     * Sets the field flag value and updates the field dictionary.
     *
     * @private
     * @param {_FieldFlag} value - The new field flags to apply.
     * @returns {void} nothing.
     */
    set _fieldFlags(value: _FieldFlag) {
        if (this._fieldFlags !== value) {
            this._flags = value;
            this._dictionary.update('Ff', value as number);
        }
    }
    /**
     * Gets the default appearance by reading the inheritable appearance string.
     *
     * @private
     * @returns {_PdfDefaultAppearance} The default appearance if defined.
     */
    get _defaultAppearance(): _PdfDefaultAppearance {
        if (typeof this._da === 'undefined') {
            const da: string = _getInheritableProperty(this._dictionary, 'DA', false, true, 'Parent');
            if (da && da !== '') {
                this._da = new _PdfDefaultAppearance(da);
            }
        }
        return this._da;
    }
    /**
     * Gets the appearance characteristics dictionary for the widget.
     *
     * @private
     * @returns {_PdfDictionary} The appearance characteristics (MK) dictionary.
     */
    get _mkDictionary(): _PdfDictionary {
        let value: _PdfDictionary;
        if (this._dictionary && this._dictionary.has('MK')) {
            value = this._dictionary.get('MK');
        }
        return value;
    }
    /**
     * Updates the border style width and dash entries in the appearance dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary - The dictionary to update (usually widget or field dictionary).
     * @param {PdfInteractiveBorder} value - The border settings to apply (width, style, dash).
     * @returns {void} nothing.
     */
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
    /**
     * Performs control specific post processing optionally flattening appearance.
     *
     * @private
     * @param {boolean} [isFlatten] - When `true`, flattens the appearance.
     * @returns {void} nothing.
     */
    abstract _doPostProcess(isFlatten?: boolean): void;
    /**
     * Returns true when the annotation flags indicate print and no view state.
     *
     * @private
     * @param {_PdfDictionary} dictionary - The annotation/field dictionary.
     * @returns {boolean} `true` if print & no-view flags are set; otherwise, `false`.
     */
    _checkFieldFlag(dictionary: _PdfDictionary): boolean {
        let flag: number;
        if (dictionary && dictionary instanceof _PdfDictionary) {
            flag = dictionary.get('F');
        }
        return (typeof flag !== 'undefined' && flag === 6);
    }
    /**
     * Registers the font resource and populates default appearance entries.
     *
     * @private
     * @param {PdfFont} font - The font to register and use for appearances.
     * @returns {void} nothing.
     */
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
    /**
     * Draws a rectangular control background, border and bevel or inset shadows.
     *
     * @private
     * @param {PdfGraphics} g - Graphics context.
     * @param {_PaintParameter} parameter - Drawing parameters.
     * @returns {void} nothing.
     */
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
    /**
     * Renders the control border using rectangle or underline style.
     *
     * @private
     * @param {PdfGraphics} g - Graphics context.
     * @param {Rectangle} bounds - Target bounds.
     * @param {PdfPen} borderPen - Border pen.
     * @param {PdfBorderStyle} style - Border style.
     * @param {number} borderWidth - Border width in points.
     * @returns {void} nothing.
     */
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
    /**
     * Draws the highlight shadow along the left and top edges of the control.
     *
     * @private
     * @param {PdfGraphics} g - Graphics context.
     * @param {Rectangle} bounds - Target bounds.
     * @param {number} width - Shadow width in points.
     * @param {PdfBrush} brush - Shadow brush.
     * @returns {void} nothing.
     */
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
    /**
     * Draws the shadow along the right and bottom edges of the control.
     *
     * @private
     * @param {PdfGraphics} g - Graphics context.
     * @param {Rectangle} bounds - Target bounds.
     * @param {number} width - Shadow width in points.
     * @param {PdfBrush} brush - Shadow brush.
     * @returns {void} nothing.
     */
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
    /**
     * Paints a radio button appearance including fill, border, shadows and mark.
     *
     * @private
     * @param {PdfGraphics} graphics - Graphics context.
     * @param {_PaintParameter} parameter - Drawing parameters.
     * @param {string} checkSymbol - Glyph used for the selected state.
     * @param {_PdfCheckFieldState} state - Visual state to render.
     * @returns {void} nothing.
     */
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
    /**
     * Draws a circular border sized to the bounds and border width.
     *
     * @private
     * @param {PdfGraphics} graphics - Graphics context.
     * @param {Rectangle} bounds - Target bounds.
     * @param {PdfPen} borderPen - Border pen.
     * @param {number} borderWidth - Border width.
     * @returns {void} nothing.
     */
    _drawRoundBorder(graphics: PdfGraphics, bounds: Rectangle, borderPen: PdfPen, borderWidth: number): void {
        if (bounds.x !== 0 || bounds.y !== 0 || bounds.width !== 0 || bounds.height !== 0) {
            graphics.drawEllipse({x: bounds.x + borderWidth / 2, y: bounds.y + borderWidth / 2, width: (this._enableGrouping ?
                Math.min(bounds.width, bounds.height) : bounds.width) - borderWidth, height: bounds.height - borderWidth}, borderPen);
        }
    }
    /**
     * Draws beveled or inset arc shadows around a circular control.
     *
     * @private
     * @param {PdfGraphics} graphics - Graphics context.
     * @param {_PaintParameter} parameter - Drawing parameters.
     * @param {_PdfCheckFieldState} state - Visual state to render.
     * @returns {void} nothing.
     */
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
    /**
     * Paints a checkbox appearance including background, border, shadows and glyph.
     *
     * @private
     * @param {PdfGraphics} graphics - Graphics context.
     * @param {_PaintParameter} parameter - Drawing parameters.
     * @param {string} checkSymbol - Glyph used for the selected state.
     * @param {_PdfCheckFieldState} state - Visual state to render.
     * @param {PdfFont} [font] - Optional font to use for glyph drawing.
     * @returns {void} nothing.
     */
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
    /**
     * Adds the widget to the kids array and updates cached item mappings.
     *
     * @private
     * @param {PdfWidgetAnnotation} item - The widget annotation to add.
     * @returns {void} nothing.
     */
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
    /* eslint-disable */
    /**
     * Draws a template on the page respecting page rotation and text mode.
     *
     * @private
     * @param {PdfTemplate} template - The template to draw.
     * @param {PdfPage} page - Target page.
     * @param {{x: number, y: number, width: number, height: number}} bounds - Destination bounds. // eslint-disable-line
     * @returns {void} nothing.
     */
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
    /**
     * Appends a list option to the field and updates the options array entry.
     *
     * @private
     * @param {PdfListFieldItem} item - The list item to append.
     * @param {PdfListField} field - The target list field.
     * @returns {void} nothing.
     */
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
    /**
     * Adds or replaces an appearance stream entry for the specified state key.
     *
     * @private
     * @param {_PdfDictionary} dictionary - The widget or field dictionary.
     * @param {PdfTemplate} template - The appearance template.
     * @param {string} key - The state key (e.g., 'N', 'D', 'R', or a /Yes-like name).
     * @returns {void} nothing.
     */
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
    /**
     * Computes the rotated rectangle for rendering text within a rotated page.
     *
     * @private
     * @param {Rectangle} rect - Original rectangle.
     * @param {Size} size - Page size.
     * @param {PdfRotationAngle} angle - Page rotation angle.
     * @returns {Rectangle} The rotated rectangle.
     */
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
    /**
     * Validates the index is within range and throws when out of bounds.
     *
     * @private
     * @param {number} value - Index to validate.
     * @param {number} length - Valid length (upper bound).
     * @returns {void} nothing.
     * @throws {Error} When the index is out of range.
     */
    _checkIndex(value: number, length: number): void {
        if (value < 0 || (value !== 0 && value >= length)) {
            throw Error('Index out of range.');
        }
    }
    /**
     * Resolves the current appearance state value from the widget or field.
     *
     * @private
     * @returns {string} The appearance state value, if any.
     */
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
    /**
     * Gets the text alignment from widget or field dictionaries with default fallback.
     *
     * @private
     * @returns {PdfTextAlignment} The effective text alignment.
     */
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
    /**
     * Sets the text alignment on the widget or field dictionary and updates formatting.
     *
     * @private
     * @param {PdfTextAlignment} value - The alignment to set.
     * @returns {void} nothing.
     */
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
    /**
     * Materializes and returns the widget collection for the field.
     *
     * @private
     * @returns {PdfWidgetAnnotation[]} The materialized widget annotations.
     */
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
    /**
     * Text content of the field.
     *
     * @private
     */
    _text: string;
    /**
     * Default text value of the field.
     *
     * @private
     */
    _defaultValue: string;
    /**
     * Enables spell checking for text input.
     *
     * @private
     */
    _spellCheck: boolean;
    /**
     * Inserts spaces when formatting text input.
     *
     * @private
     */
    _insertSpaces: boolean;
    /**
     * Enables multiline text input.
     *
     * @private
     */
    _multiline: boolean;
    /**
     * Masks text input for password fields.
     *
     * @private
     */
    _password: boolean;
    /**
     * Enables vertical scrolling when text exceeds bounds.
     *
     * @private
     */
    _scrollable: boolean;
    /**
     * Automatically resizes text to fit the field bounds.
     *
     * @private
     */
    _autoResizeText: boolean = false;
    /**
     * Indicates whether the text content has changed.
     *
     * @private
     */
    _isTextChanged: boolean = false;
    /**
     * Defines JavaScript and other field-level actions.
     *
     * @private
     */
    _actions: PdfFieldActions;
    /**
     * Represents a text box field of the PDF document.
     *
     * @private
     */
    public constructor()
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
    public constructor(page: PdfPage, name: string, bounds: Rectangle)
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
    public constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        text?: string,
        font?: PdfFont
    })
    public constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
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
     * Gets the actions of the field. [Read-Only]
     *
     * @returns {PdfFieldActions} The actions.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Get the action value from the text box field.
     *  const PdfFieldActions: PdfFieldActions = field.actions;
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
    /**
     * Initializes the field with dictionary entries default values and widget creation.
     *
     * @private
     * @param {PdfPage} page - The page to place the field in.
     * @param {string} name - The field name.
     * @param {Rectangle} bounds - The field bounds.
     * @returns {void} nothing.
     */
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
    /**
     * Creates the widget annotation for the field and initializes appearance settings.
     *
     * @private
     * @param {Rectangle} bounds - Widget bounds.
     * @returns {void} nothing.
     */
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
    /**
     * Generates appearances or flattens widgets based on settings and field state.
     *
     * @private
     * @param {boolean} [isFlatten=false] - When `true`, flattens the field appearances.
     * @returns {void} nothing.
     */
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
    /**
     * Processes a single widget appearance or flattens it onto the page.
     *
     * @private
     * @param {boolean} isFlatten - When `true`, flattens the appearance on page.
     * @param {PdfWidgetAnnotation} [widget] - Optional widget to process; defaults to the field.
     * @returns {void} nothing.
     */
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
    /**
     * Builds the appearance template for the widget including background border and text.
     *
     * @private
     * @param {boolean} isFlatten - Whether generating for flattening.
     * @param {PdfWidgetAnnotation | PdfTextBoxField} widget - The source widget/field.
     * @returns {PdfTemplate} The generated appearance template.
     */
    _createAppearance(isFlatten: boolean, widget: PdfWidgetAnnotation | PdfTextBoxField): PdfTemplate {
        const bounds: {x: number, y: number, width: number, height: number} = widget.bounds;
        const isRotated270: boolean = widget.rotate === 270 && this.page.rotation === PdfRotationAngle.angle270;
        const width: number = isRotated270 ? bounds.height : bounds.width;
        const height: number = isRotated270 ? bounds.width : bounds.height;
        const template: PdfTemplate = new PdfTemplate([0, 0, width, height], this._crossReference);
        _setMatrix(template, isRotated270 ? widget.rotate : null);
        template._writeTransformation = false;
        const graphics: PdfGraphics = template.graphics;
        const parameter: _PaintParameter = new _PaintParameter();
        parameter.bounds = {x: 0, y: 0, width: width, height: height};
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
        const action: PdfFieldActions = this.actions;
        if (action) {
            const format: PdfJavaScriptAction = action.format;
            if (format) {
                const script: string = format.script;
                const pattern: string = this._tryParseAcrobatFormFormat(script);
                if (pattern) {
                    text = this._normalizeDateValue(this.text, pattern);
                }
            }
        }
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
    /**
     * Normalizes a date value using the acrobat format pattern when possible.
     *
     * @private
     * @param {string} textValue - The input text value.
     * @param {string} afFormat - The Acrobat format pattern.
     * @returns {string} The normalized value.
     */
    _normalizeDateValue(textValue: string, afFormat: string): string {
        const date: Date = this._parseUnknownDate(textValue);
        if (date) {
            return this._formatDateUsingAcrobatFormat(date, afFormat);
        } else {
            return textValue;
        }
    }
    /**
     * Attempts to parse an unknown date value using multiple common date patterns.
     *
     * @private
     * @param {string} text - Date text to parse.
     * @returns {Date} Parsed date if valid; otherwise `undefined`.
     */
    _parseUnknownDate(text: string): Date {
        let result: Date;
        if (text) {
            const normalized: string = text.trim().replace(/[.-]/g, '/');
            const native: Date = new Date(normalized);
            if (isNaN(native.getTime()) === false) {
                result = native;
            } else {
                // Extracts year, month, day, and optional time (hours, minutes, optional seconds) from a date string formatted as YYYY/MM/DD or similar.
                const dateRegEx: RegExp = /^(\d{1,4})\/(\d{1,2})\/(\d{1,4})$/;
                const parts: string[] = normalized.trim().split(/\s+/);
                const datePart: string =  parts[0];
                let dateMatch: RegExpMatchArray;
                if (datePart) {
                    dateMatch = datePart.match(dateRegEx);
                }
                const timePart: string = parts [1];
                if (dateMatch) {
                    const toNumberOrZero: (value: string) => number = (value: string): number => isNaN(Number(value)) ? 0 : Number(value);
                    const firstPart: number  = toNumberOrZero(dateMatch[1]);
                    const secondPart: number = toNumberOrZero(dateMatch[2]);
                    const thirdPart: number = toNumberOrZero(dateMatch[3]);
                    let year: number;
                    let monthIndex: number;
                    let dayOfMonth: number;
                    if (thirdPart > 31) {
                        year = thirdPart;
                        if (firstPart > 12) {
                            dayOfMonth = firstPart;
                            monthIndex = secondPart - 1;
                        }
                        let hours: number = 0;
                        let minutes: number = 0;
                        let seconds: number = 0;
                        if (timePart) {
                            const timeSegments: string[] = timePart.split(':');
                            if (timeSegments.length >= 2 && timeSegments.length <= 3) {
                                const h: number = toNumberOrZero(timeSegments[0]);
                                const m: number = toNumberOrZero(timeSegments[1]);
                                const s: number = timeSegments[2] ? toNumberOrZero(timeSegments[2]) : 0;
                                if (
                                    h >= 0 && h <= 99 &&
                                    m >= 0 && m <= 59 &&
                                    s >= 0 && s <= 59
                                ) {
                                    hours = h;
                                    minutes = m;
                                    seconds = s;
                                }
                            }
                        }
                        result = new Date(year, monthIndex, dayOfMonth, hours, minutes, seconds);
                    }
                }
            }
        }
        return result;
    }
    /**
     * Formats a date using an acrobat date pattern with mapped tokens.
     *
     * @private
     * @param {Date} date - Date to format.
     * @param {string} format - Acrobat pattern.
     * @returns {string} The formatted string.
     */
    _formatDateUsingAcrobatFormat(date: Date, format: string): string {
        const monthsShort: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthsLong: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const pad: (input: number) => string = (input: number) => ('0' + input).slice(-2);
        const hours24: number = date.getHours();
        const hours12: number = hours24 % 12 || 12;
        const map: Map<string, string> = new Map([
            ['yyyy' , date.getFullYear().toString()],
            ['yy', date.getFullYear().toString().slice(-2)],
            ['mmmm', monthsLong[date.getMonth()]],
            ['mmm', monthsShort[date.getMonth()]],
            ['mm' , pad(date.getMonth() + 1)],
            ['m', (date.getMonth() + 1).toString()],
            ['dd', pad(date.getDate())],
            ['d', date.getDate().toString()],
            ['HH', pad(hours24)],
            ['H', hours24.toString()],
            ['hh', pad(hours12)],
            ['h', hours12.toString()],
            ['MM', pad(date.getMinutes())],
            ['M', date.getMinutes().toString()],
            ['ss', pad(date.getSeconds())],
            ['s', date.getSeconds().toString()],
            ['tt', hours24 < 12 ? 'AM' : 'PM']
        ]);
        return format.replace(
            /yyyy|mmmm|mmm|mm|dd|HH|hh|MM|ss|yy|H|h|m|d|M|s|tt/g,
            (token: string): string => {
                const value: string = map.get(token);
                return value;
            }
        );
    }
    /**
     * Extracts an acrobat format pattern from a JavaScript format function call.
     *
     * @private
     * @param {string} js - The JavaScript source.
     * @returns {string} The extracted format pattern, if any.
     */
    _tryParseAcrobatFormFormat(js: string): string {
        let result: string;
        if (typeof js === 'string') {
            const source: string = js.replace(/\s+/g, ' ').trim();
            const regex: RegExp = /[a-zA-Z0-9_]*_FormatEx\s*\(\s*(['"])(.*?)\1\s*\)/i;
            const match: RegExpMatchArray = source.match(regex);
            if (Array.isArray(match) && match.length > 2 && typeof match[2] === 'string') {
                result = match[2];
            }
        }
        return result;
    }
    /**
     * Draws the text content of a field applying borders background alignment and rotation.
     *
     * @private
     * @param {PdfGraphics} g - Graphics context.
     * @param {_PaintParameter} parameter - Paint parameters.
     * @param {string} text - Text to render.
     * @param {PdfFont} font - Font to use.
     * @param {PdfStringFormat} format - String format.
     * @param {boolean} multiline - Whether multiline is enabled.
     * @param {boolean} scroll - Whether scrolling is enabled.
     * @param {number} [maxLength] - Optional maximum length for comb fields.
     * @returns {void} nothing.
     */
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
                        rectangle = { x: rectangle.x, y: rectangle.y, width: rectangle.width - (4 * parameter.borderWidth), height: rectangle.height };
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
    /**
     * Label text displayed on the button.
     *
     * @private
     */
    _text: string;
    /**
     * Appearance object used to render the button.
     *
     * @private
     */
    _appearance: PdfAppearance;
    /**
     * Appearance object used to render the button.
     *
     * @private
     */
    _actions: PdfFieldActions;
    /**
     * Represents a button field of the PDF document.
     *
     * @private
     */
    public constructor()
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
    public constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        text?: string,
        highlightMode?: PdfHighlightMode
    })
    public constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
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
    /**
     * Updates the appearance characteristics dictionary with the given caption text.
     *
     * @private
     * @param {_PdfDictionary} fieldDictionary - Field or widget dictionary.
     * @param {string} value - Caption text.
     * @returns {void} nothing.
     */
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
    /* eslint-disable */
    /**
     * Initializes the button field with core dictionary entries widget creation and font setup.
     *
     * @private
     * @param {PdfPage} page - The page where the field is drawn.
     * @param {string} name - The field name.
     * @param {{x: number, y: number, width: number, height: number}} bounds - The field bounds.
     * @returns {void} nothing.
     */
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
    /**
     * Creates the button widget initializes appearance values and registers the kid.
     *
     * @private
     * @param {{x: number, y: number, width: number, height: number}} bounds - Widget bounds. // eslint-disable-line
     * @returns {void} nothing.
     */
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
    /* eslint-enable */
    /**
     * Builds appearances or flattens widgets based on settings and field state.
     *
     * @private
     * @param {boolean} [isFlatten=false] - When `true`, flattens the field appearances.
     * @returns {void} nothing.
     */
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
    /**
     * Processes one widget to load reuse or rebuild its appearance and optionally flatten.
     *
     * @private
     * @param {boolean} isFlatten - Whether to flatten onto the page.
     * @param {PdfWidgetAnnotation} [widget] - Optional widget to process; defaults to the field.
     * @returns {void} nothing.
     */
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
    /**
     * Constructs the button appearance template including background border caption and shadows.
     *
     * @private
     * @param {PdfWidgetAnnotation | PdfButtonField} widget - Source widget or field.
     * @param {boolean} [isPressed=false] - Whether to render the pressed state.
     * @returns {PdfTemplate} The generated appearance template.
     */
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
    /**
     * Draws the normal button state with background border and caption respecting rotation.
     *
     * @private
     * @param {PdfGraphics} g - Graphics context.
     * @param {_PaintParameter} parameter - Paint parameters.
     * @param {string} text - Caption text.
     * @param {PdfFont} font - Caption font.
     * @param {PdfStringFormat} format - Caption format.
     * @returns {void} nothing.
     */
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
    /**
     * Draws the pressed button state with adjusted fill border shadows and caption position.
     *
     * @private
     * @param {PdfGraphics} g - Graphics context.
     * @param {_PaintParameter} parameter - Paint parameters.
     * @param {string} text - Caption text.
     * @param {PdfFont} font - Caption font.
     * @param {PdfStringFormat} format - Caption format.
     * @returns {void} nothing.
     */
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
    /**
     * Map of widget index to parsed state item.
     *
     * @private
     */
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
    public constructor(name: string, bounds: Rectangle, page: PdfPage)
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
    public constructor(name: string, bounds: Rectangle, page: PdfPage, properties: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        checked?: boolean
    })
    public constructor(name?: string, bounds?: Rectangle, page?: PdfPage, properties?: {
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
     *
     * @param {number} index Index of the field item.
     * @returns {PdfStateItem} Field item at the index.
     */
    public itemAt(index: number): PdfStateItem {
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
            if (this._crossReference && this._crossReference._document &&
                this._crossReference._document._isFormImport && this._kidsCount > 0) {
                const kidItem: PdfStateItem = this.itemAt(this._defaultIndex) as PdfStateItem;
                if (kidItem.checked !== value) {
                    kidItem.checked = value;
                    return;
                }
            }
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
        if (this._isLoaded && typeof this._exportValue === 'string' && this._exportValue !== 'Yes') {
            return this._exportValue;
        }
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
        if (!(this._dictionary.has('V')) && value !== '') {
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
    /**
     * Initializes the checkbox field with core dictionary entries and widget creation.
     *
     * @private
     * @param {PdfPage} page - The page where the field is placed.
     * @param {string} name - The field name.
     * @param {Rectangle} bounds - The field bounds.
     * @returns {void} nothing.
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
        this._dictionary.update('FT', _PdfName.get('Btn'));
        this._dictionary.update('T', name);
        this._createItem(bounds);
    }
    /**
     * Creates the checkbox widget, sets default appearance, and registers the kid.
     *
     * @private
     * @param {Rectangle} bounds - The widget bounds.
     * @returns {void} nothing.
     */
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
    /**
     * Builds appearances or flattens each widget based on state and settings.
     *
     * @private
     * @param {boolean} [isFlatten=false] - When `true`, flattens the widget appearance onto the page.
     * @returns {void} nothing.
     */
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
                        let exportValue: string;
                        if (item.exportValue === '') {
                            exportValue = 'Yes';
                        } else {
                            exportValue = item.exportValue;
                        }
                        this._drawAppearance(item, exportValue);
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
    /**
     * Constructs the checkbox appearance template including background, border, and mark.
     *
     * @private
     * @param {PdfStateItem} widget - The widget to build the appearance for.
     * @param {_PdfCheckFieldState} state - The check state to render.
     * @returns {PdfTemplate} The generated appearance template.
     */
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
    /**
     * Writes the normal  and pressed  appearance streams for a widget's state values.
     *
     * @private
     * @param {PdfStateItem} item - The widget state item whose appearance will be created/updated.
     * @param {string} [itemValue] - Optional on-state name to use (defaults to "Yes" when not provided).
     * @returns {void} nothing.
     */
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
    /**
     * Map of widget index to parsed radio button item.
     *
     * @private
     */
    _parsedItems: Map<number, PdfRadioButtonListItem>;
    /**
     * Selected radio item index, or -1 if none.
     *
     * @private
     */
    _selectedIndex: number = -1;
    /**
     * Indicates whether selection is required by the user.
     *
     * @private
     */
    _isUserRequired: boolean;
    /**
     * Allows selecting all items in unison.
     *
     * @private
     */
    _allowUnisonSelection: boolean = false;
    /**
     * Indicates whether duplicate widgets exist for this field.
     *
     * @private
     */
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
    public constructor(page: PdfPage, name: string)
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
    public constructor(page: PdfPage, name: string, properties: {
        items: { name: string, bounds: Rectangle }[],
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        selectedIndex?: number,
        allowUnisonSelection?: boolean
    })
    public constructor(page?: PdfPage, name?: string, properties?: {
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
            const selectedItem: PdfRadioButtonListItem = this.itemAt(value);
            this._hasDuplicates = this._hasDuplicateItems();
            let isAllowUnison: boolean = false;
            let isUpdatedWithValue: boolean = false;
            if (!this._isLoaded) {
                isAllowUnison = (this.allowUnisonSelection && this._isUserRequired) ? true : false;
            } else {
                isAllowUnison = this.allowUnisonSelection;
                if (this.selectedIndex >= 0) {
                    const selectedIndexItem: PdfStateItem = this.itemAt(this.selectedIndex);
                    if (selectedIndexItem && selectedIndexItem._dictionary && selectedIndexItem._dictionary.has('AS')) {
                        const selectedVal: string = selectedIndexItem._dictionary.get('AS').name;
                        if (selectedVal === (selectedIndexItem as PdfRadioButtonListItem).value) {
                            isUpdatedWithValue = true;
                        }
                    }
                }
            }
            for (let i: number = 0; i < this._kidsCount; i++) {
                const item: PdfRadioButtonListItem = this.itemAt(i);
                if ((isAllowUnison && !this._isLoaded) || (isAllowUnison && isUpdatedWithValue && this._isLoaded)) {
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
            this._selectedIndex = value;
        }
    }
    /**
     * Determines whether the radio button list contains any duplicate item values.
     * Scans the current items  and reports if any `value` occurs more than once.
     *
     * @private
     * @returns {boolean} Returns `true` if at least one item `value` is duplicated; otherwise, `false`.
     */
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
        if ((this._fieldFlags & _FieldFlag.radiosInUnison) !== 0) {
            this._allowUnisonSelection = true;
        }
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
        if (value) {
            this._fieldFlags |= _FieldFlag.radiosInUnison;
        }
        this._isUserRequired = value;
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
     *
     * @param {number} index Index of the field item.
     * @returns {PdfRadioButtonListItem} Field item at the index.
     */
    public itemAt(index: number): PdfRadioButtonListItem {
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
     *
     * @param {PdfRadioButtonListItem} item List item.
     * @returns {number} Index of the added item.
     */
    public add(item: PdfRadioButtonListItem): number
    /**
     * Add list item to the field.
     *
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
     *
     * @param {string} value Name of the list item.
     * @param {Rectangle} bounds Bounds of the list item.
     * @returns {PdfRadioButtonListItem} Added item.
     */
    public add(value: string, bounds: Rectangle): PdfRadioButtonListItem
    public add(value?: string | PdfRadioButtonListItem,
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
     *
     * @param {number} index Item index to remove.
     * @returns {void} Nothing.
     */
    public removeItemAt(index: number): void {
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
     *
     * @param {PdfRadioButtonListItem} item Item to remove.
     * @returns {void} Nothing.
     */
    public removeItem(item: PdfRadioButtonListItem): void {
        if (item && item._ref) {
            const index: number = this._kids.indexOf(item._ref);
            if (index !== -1) {
                this.removeItemAt(index);
            }
        }
    }
    /**
     * Initializes the radio button field on the specified page with the given name,
     * creating its dictionary, reference, and default flags.
     *
     * @private
     * @param {PdfPage} page The page on which the field is initialized.
     * @param {string} name The field name to assign to the radio button group.
     * @returns {void}
     */
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
    /**
     * Extracts and assigns option values from the field dictionary's `Opt` entry
     * to corresponding radio button items, if present.
     *
     * @private
     * @returns {void}
     */
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
    /**
     * Determines the selected radio button index by inspecting inherited field value (`V`)
     * and the item's appearance state (`AS`), ignoring the `Off` state.
     *
     * @private
     * @returns {number} Returns the zero-based index of the selected item, or `-1` if none is selected.
     */
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
    /**
     * Finalizes item appearances and dictionary updates after selection changes or load,
     * optionally flattening the field to static content.
     *
     * @private
     * @param {boolean} [isFlatten=false] When `true`, draws static appearances and prevents further updates.
     * @returns {void}
     */
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
                            item._postProcess(this.allowUnisonSelection ? (this.selectedIndex >= 0 && item.value === this.itemAt(this.selectedIndex).value ? item.value : 'Off') :
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
                    item._postProcess((this.allowUnisonSelection && this._isUserRequired) ? (this.selectedIndex >= 0 && item.value === this.itemAt(this.selectedIndex).value ? item.value : 'Off') :
                        this._hasDuplicates ? (this.selectedIndex === i ? i.toString() : 'Off') : (this.selectedIndex === i ? item.value : 'Off'));
                    this._drawAppearance(item);
                }
                item._dictionary._updated = !isFlatten;
            }
        }
        this._dictionary._updated = !isFlatten;
    }
    /**
     * Builds a visual appearance template for a radio button item based on the specified state,
     * applying border, background, color, rotation, and style.
     *
     * @private
     * @param {PdfRadioButtonListItem} widget The radio button item for which to create the appearance.
     * @param {_PdfCheckFieldState} state The visual state to render (e.g., checked, unchecked, pressed).
     * @returns {PdfTemplate} The generated appearance template for the requested state.
     */
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
    /**
     * Updates the item's appearance streams (`AP`) for normal (`N`) and pressed (`D`) states,
     * generating and wiring templates for the actual value and `Off`.
     *
     * @private
     * @param {PdfRadioButtonListItem} item The radio button item whose appearance is to be updated.
     * @returns {void}
     */
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
        let actualValue: string;
        if (!this._isLoaded) {
            actualValue = (this.allowUnisonSelection && this._isUserRequired && itemField.allowUnisonSelection) ?
                item.value
                : (this._hasDuplicates ? (item._index).toString() : item.value);
        } else {
            actualValue = itemField.allowUnisonSelection
                ? item.value
                : (this._hasDuplicates ? (item._index).toString() : item.value);
        }
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
    /**
     * Display text/value pairs for the list items.
     *
     * @private
     */
    _optionArray: Array<string[]>;
    /**
     * Map of widget index to parsed list field item.
     *
     * @private
     */
    _parsedItems: Map<number, PdfListFieldItem>;
    /**
     * Array of selected list values.
     *
     * @private
     */
    _listValues : string[];
    /**
     * Index of the selected item (single select mode).
     *
     * @private
     */
    _selectedIndex : number;
    /**
     * Enables multi select for the list field.
     *
     * @private
     */
    _multiSelect: boolean;
    /**
     * Enables text editing in the list field.
     *
     * @private
     */
    _editable: boolean;
    /**
     * Primary widget annotation for the list field.
     *
     * @private
     */
    _widgetAnnot: PdfWidgetAnnotation;
    /**
     * Bounds of the list field widget.
     *
     * @private
     */
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
    /**
     * Gets the option entries (`Opt`) for the radio button field, initializing the
     * underlying array in the field dictionary if it does not already exist.
     *
     * @private
     * @returns {Array<string[]>} The array of option entries associated with the field.
     */
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
     *
     * @param {number} index Index of the field item.
     * @returns {PdfListFieldItem} Field item at the index.
     */
    public itemAt(index: number): PdfListFieldItem {
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
     *
     * @param {PdfListFieldItem} item Item to add.
     * @returns {number} Index of the field item.
     */
    public addItem(item: PdfListFieldItem): number {
        this._addToOptions(item, this);
        return this._listValues.length - 1;
    }
    /**
     * Remove the list item from the specified index.
     *
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
     *
     * @param {number} index Item index to remove.
     * @returns {void} Nothing.
     */
    public removeItemAt(index: number): void {
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
     *
     * @param {PdfListFieldItem} item Item to remove.
     * @returns {void} Nothing.
     */
    public removeItem(item: PdfListFieldItem): void {
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
    /* eslint-disable */
    /**
     * Initializes the list/choice field on the specified page with the given name and bounds,
     * creating its dictionary, reference, kids collection, and a default widget.
     *
     * @private
     * @param {PdfPage} page The page on which the field is initialized.
     * @param {string} name The field name to assign to the list/choice field.
     * @param {{x: number, y: number, width: number, height: number}} bounds The field bounds in page coordinates. // eslint-disable-line
     * @returns {void}
     */
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
    /* eslint-enable */
    /**
     * Computes the font height for the specified font family, used when the effective
     * font size needs to be derived (e.g., when size is `0`).
     *
     * @private
     * @param {PdfFontFamily} font The font family for which to compute the height.
     * @returns {number} The resolved font height in points.
     */
    abstract _getFontHeight(font: PdfFontFamily): number;
    /**
     * Creates the appearance template for the list/choice field or for a specific widget item,
     * applying the current style, colors, and layout.
     *
     * @private
     * @param {PdfListFieldItem} [item] The specific widget item to render; when omitted, renders the field appearance.
     * @returns {PdfTemplate} The generated appearance template.
     */
    abstract _createAppearance(item?: PdfListFieldItem): PdfTemplate;
    /**
     * Resolves and returns the effective font for the field or a specific item by inspecting
     * style entries (`DS`) or default appearance (`DA`), and, if needed, loads an embedded font
     * from document resources.
     *
     * @private
     * @param {PdfListFieldItem} [item] The item whose font should be resolved; when omitted, resolves at the field level.
     * @returns {PdfFont} The resolved PDF font instance.
     */
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
    /**
     * Retrieves the selected export value(s) for the list/choice field, preferring the `V`
     * entry and falling back to the index array `I` mapped through the field `Opt` entries.
     *
     * @private
     * @returns {string[]} An array of selected export values; returns an empty array if none.
     */
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
    /**
     * Finalizes appearances for the field and its widgets, generating or attaching templates
     * and optionally flattening the content into the page.
     *
     * @private
     * @param {boolean} [isFlatten=false] When `true`, draws static appearances onto pages and prevents further updates.
     * @returns {void}
     */
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
    /**
     * Looks up the zero-based option index whose export value matches the specified value.
     *
     * @private
     * @param {string} value The export value to search for within the field options.
     * @returns {number} The matching option index, or `-1` if not found.
     */
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
    /**
     * Adds a default widget annotation to the field with initial appearance-related entries,
     * including `MK`, border/background colors, and a default `DA`.
     *
     * @private
     * @returns {void}
     */
    _addEmptyWidget(): void {
        const widget: PdfWidgetAnnotation = new PdfWidgetAnnotation();
        widget._create(this._page, this.bounds, this);
        this._addToKid(widget);
        widget._dictionary.update('MK', new _PdfDictionary(this._crossReference));
        widget._mkDictionary.update('BC', [0, 0, 0]);
        widget._mkDictionary.update('BG', [1, 1, 1]);
        widget._dictionary.update('DA', '/TiRo 0 Tf 0 0 0 rg');
    }
    /**
     * Builds the string format for text layout based on field flags (e.g., multiline)
     * and the widget's justification (`Q`) entry.
     *
     * @private
     * @returns {PdfStringFormat} The configured string format including alignment settings.
     */
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
    public constructor()
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
    public constructor(page: PdfPage, name: string, bounds: Rectangle)
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
    public constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
        items: { text: string, value: string }[],
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder,
        selectedIndex?: number,
        font?: PdfFont
    })
    public constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
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
    /**
     * Loads display texts for the fields items from the dictionary `Opt` array and
     * assigns them to the corresponding widget items `_text` property.
     *
     * @private
     * @returns {void}
     */
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
    /**
     * Creates the appearance template for the list/combobox field (or a specific widget item),
     * computing effective bounds (respecting page/field rotation), border, background, colors,
     * and string formatting, then renders the widget content.
     *
     * @private
     * @param {PdfListFieldItem} [item] The specific widget item to render; when omitted, renders the field level appearance.
     * @returns {PdfTemplate} The generated appearance template for the current visual state.
     */
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
            parameter.foreBrush = new PdfBrush(item.color ? item.color : this.color);
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
    /**
     * Draws the combobox/list widget: background, border, clipping, and the currently
     * selected items text (resolved from `I` and `Opt`), honoring padding and rotation.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context used for rendering.
     * @param {_PaintParameter} [parameter] The paint parameters including bounds, colors, border, rotation, and string format.
     * @param {PdfFont} [font] The font to use for rendering the selected items text.
     * @param {PdfStringFormat} [stringFormat] The text layout configuration (alignment and line alignment).
     * @returns {void}
     */
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
                if (padding) {
                    width -= doubleBorderWidth;
                }
                brush = new PdfBrush(this.color ? this.color : {r: 0, g: 0, b: 0});
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
                    if (padding) {
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
    /**
     * Computes a suitable font size (height) for rendering the selected value within
     * the field bounds, based on the specified font family and current option text widths.
     * Ensures the text fits the available width/height by scaling within border padding.
     *
     * @private
     * @param {PdfFontFamily} fontFamily The font family to measure and scale.
     * @returns {number} The resolved font size in points that fits the controls content.
     */
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
    public constructor()
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
    public constructor(page: PdfPage, name: string, bounds: Rectangle)
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
    public constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
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
    public constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
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
    /**
     * Reads the field's `Opt` array, prepares the internal `_listValues` cache, and
     * assigns display text to each widget item’s `_text`. Also updates the current
     * `_selectedIndex` from the `I` entry when available.
     *
     * @private
     * @returns {void}
     */
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
    /**
     * Creates the appearance template for the list box field ,
     * computing effective bounds , border, background,
     * and text formatting, then renders the widget content.
     *
     * @private
     * @param {PdfListFieldItem} [item] The specific widget item to render; when omitted, renders the field-level appearance.
     * @returns {PdfTemplate} The generated appearance template for the current visual state.
     */
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
            parameter.foreBrush = new PdfBrush(item.color ? item.color : this.color);
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
    /**
     * Draws the list box control including background, border, clipping, selection highlight,
     * and each options text, honoring padding and rotation settings.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context used for rendering.
     * @param {_PaintParameter} [parameter] The paint parameters including bounds, colors, border, rotation, and layout.
     * @param {PdfFont} [font] The font to use for rendering list items.
     * @param {PdfStringFormat} [stringFormat] The text layout configuration (alignment and line alignment).
     * @returns {void}
     */
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
                    brush = new PdfBrush(this.color ? this.color : {r: 0, g: 0, b: 0});
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
                    brush = new PdfBrush(this.color ? this.color : {r: 0, g: 0, b: 0});
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
    /**
     * Computes an appropriate font size (height) for rendering list items so that text
     * fits within the field's width accounting for border padding based on measured
     * widths of `_listValues`.
     *
     * @private
     * @param {PdfFontFamily} fontFamily The font family used for measurement and scaling.
     * @returns {number} The resolved font size in points (capped to a maximum of 12).
     */
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
    /**
     * Primary widget annotation for the signature field.
     *
     * @private
     */
    _widgetAnnot: PdfWidgetAnnotation;
    /**
     * Appearance object used to render the signature.
     *
     * @private
     */
    _appearance: PdfAppearance;
    private _rotateAngle: number = 0;
    /**
     * Digital signature associated with this field.
     *
     * @private
     */
    _signature: PdfSignature;
    /**
     * Indicates whether the field already contains a signature.
     *
     * @private
     */
    _isSigned: boolean = false;
    /**
     * Stores the revision number associated with the signature.
     *
     * @private
     */
    private _revision: number = -1;
    /**
     * Indicates whether the signature has been verified.
     *
     * @private
     */
    private _verified: boolean = false;
    /**
     * Stores the CMS signer information used for signing and validation.
     *
     * @private
     */
    _cmsSigner: _PdfCryptographicMessageSyntaxSigner;
    /**
     * Stores the trusted root certificates used during certificate validation.
     *
     * @private
     */
    _trustedRoots: any[]; // eslint-disable-line
    /**
     * Stores the revocation validation type used during certificate validation.
     *
     * @private
     */
    _revocationValidationType: RevocationType;
    /**
     * Indicates whether certificate revocation validation is enabled.
     *
     * @private
     */
    _validateRevocation: boolean;
    /**
     * Represents a signature field of the PDF document.
     *
     * @private
     */
    public constructor()
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
    public constructor(page: PdfPage, name: string, bounds: Rectangle)
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
    public constructor(page: PdfPage, name: string, bounds: Rectangle, properties: {
        toolTip?: string,
        color?: PdfColor,
        backColor?: PdfColor,
        borderColor?: PdfColor,
        border?: PdfInteractiveBorder
    })
    public constructor(page?: PdfPage, name?: string, bounds?: Rectangle, properties?: {
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
    /**
     * Loads a signature field from the specified dictionary and reference, binding it
     * to the owning form and cross-reference, and initializes its kids and caches.
     *
     * @private
     * @param {PdfForm} form The parent form that owns this signature field.
     * @param {_PdfDictionary} dictionary The field dictionary from which to load properties.
     * @param {_PdfCrossReference} crossReference The cross-reference table for object resolution.
     * @param {_PdfReference} reference The indirect reference identifying this field.
     * @returns {PdfSignatureField} The initialized signature field instance in a loaded state.
     */
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
     *
     * @returns {PdfSignature} - The signature instance.
     */
    public getSignature(): PdfSignature {
        if (!this._signature && this._dictionary.has('V')) {
            this._signature = this._crossReference._document._getSignature(this._dictionary.get('V'), this);
        }
        return this._signature;
    }
    /**
     * Sets the signature for the PDF signature field.
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
     *
     * @param {PdfSignature} signature - The signature to assign to the field.
     * @returns {void} Nothing.
     */
    public setSignature(signature: PdfSignature): void {
        if (this._crossReference) {
            if (this._widgetAnnot && this._widgetAnnot.bounds) {
                signature._bounds = this._widgetAnnot.bounds;
            }
            if (this._page) {
                signature._page = this._page;
            }
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
     *
     * @returns {PdfAppearance} - The appearance of the PDF signature field.
     */
    public getAppearance(): PdfAppearance {
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
     *
     * @returns {number} - The revision index of the signature.
     */
    public getRevision(): number {
        if (this.isSigned && this._revision === -1) {
            this._revision = this._getSignedRevision();
        }
        return this._revision;
    }
    /* eslint-disable */
    /**
     * Initializes the signature field on the specified page with the given name and bounds,
     * creating its dictionary, reference, default font, and the initial widget item.
     *
     * @private
     * @param {PdfPage} page The page on which the signature field is created.
     * @param {string} name The field name to assign to the signature field.
     * @param {{x: number, y: number, width: number, height: number}} bounds The field bounds in page coordinates. // eslint-disable-line
     * @returns {void}
     */
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
    /**
     * Creates and adds the signature field’s primary widget annotation using the provided bounds,
     * sets up appearance-related entries (`MK`, `BC`, `BG`, `DA`), and adds it to the Kids array.
     *
     * @private
     * @param {{x: number, y: number, width: number, height: number}} bounds The widget bounds in page coordinates.
     * @returns {void}
     */
    _createItem(bounds: {x: number, y: number, width: number, height: number}): void {
        this._widgetAnnot = new PdfWidgetAnnotation();
        this._widgetAnnot._create(this._page, bounds, this);
        this._widgetAnnot._dictionary.update('MK', new _PdfDictionary(this._crossReference));
        this._widgetAnnot._mkDictionary.update('BC', [0, 0, 0]);
        this._widgetAnnot._mkDictionary.update('BG', [1, 1, 1]);
        this._widgetAnnot._dictionary.update('DA', `${this._fontName} 8 Tf 0 0 0 rg`);
        this._addToKid(this._widgetAnnot);
    }
    /* eslint-enable */
    /**
     * Finalizes the signature field after updates by generating or attaching appearances,
     * handling signature locking if required, and optionally flattening the field to static content.
     *
     * @private
     * @param {boolean} [isFlatten=false] When `true`, flattens appearances into the page content.
     * @returns {void}
     */
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._signature && this._signature._isLocked &&
        !this._signature._certify && !this._signature._signed) {
            this._signature._lockSignature();
        }
        const needAppearance: boolean = this._setAppearance || this._form._setAppearance ||
            (this._signature && this._signature._enabledValiadtionAppearance);
        if (isFlatten || needAppearance || this._appearance) {
            const count: number = this._kidsCount;
            if (count > 0) {
                for (let i: number = 0; i < count; i++) {
                    const item: PdfWidgetAnnotation = this.itemAt(i);
                    if (this._appearance || (this._signature && this._signature._enabledValiadtionAppearance)) {
                        if (this._signature && this._signature._enabledValiadtionAppearance && !this._appearance) {
                            this._appearance = this.getAppearance();
                        }
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
    /**
     * Builds a visual appearance template for the signature widget, applying border, background,
     * colors, and rotation. When flattening, fills background if specified.
     *
     * @private
     * @param {PdfWidgetAnnotation} widget The signature widget for which to create the appearance.
     * @param {boolean} isFlatten Indicates whether the appearance is being created for flattening.
     * @returns {PdfTemplate} The generated appearance template for the widget.
     */
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
    /* eslint-disable */
    /**
     * Draws the signature appearance onto the specified page at the given bounds, using the
     * widget or field appearance stream (`AP`) if present, or a provided template.
     *
     * @private
     * @param {_PdfDictionary} dictionary The widget or field dictionary containing appearance entries.
     * @param {PdfPage} page The page on which to draw the signature appearance.
     * @param {{x: number, y: number, width: number, height: number}} bounds The drawing bounds on the page.
     * @param {PdfTemplate} [signatureTemplate] Optional predefined appearance template to use when `AP` is absent.
     * @returns {void}
     */
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
    /**
     * Computes transformed template bounds for the current page rotation, applying
     * the appropriate translate/rotate transforms to the graphics context.
     *
     * @private
     * @param {{x: number, y: number, width: number, height: number}} bounds The original widget bounds.
     * @param {PdfPage} page The page whose rotation and size influence the transformed bounds.
     * @param {PdfTemplate} template The template being drawn (used for size/transform).
     * @param {PdfGraphics} graphics The graphics context to which transforms are applied.
     * @returns {{x: number, y: number, width: number, height: number}} The adjusted bounds after transformation.
     */
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
                    const matrix: number[] = template._content.dictionary.get('Matrix');
                    if (matrix[1] === -1 && matrix[2] === 1) {
                        x = -(page._size.width - bounds.x - template.size.width);
                        y = bounds.y - bounds.height;
                    } else {
                        x = -(page._size.width - bounds.x - bounds.width);
                        y = bounds.y + bounds.x + template._size.width;
                        return {x: x, y: y, width: bounds.height, height: bounds.width};
                    }
                } else {
                    x = -(page._size.width - bounds.x - bounds.width);
                    y = bounds.y;
                }
            }
        }
        return {x: x, y: y, width: bounds.width, height: bounds.height};
    }
    /* eslint-enable */
    /**
     * Determines the effective rotation angle (0/90/180/270) of the graphics context
     * based on the provided transformation matrix.
     *
     * @private
     * @param {_PdfTransformationMatrix} matrix The transformation matrix of the graphics context.
     * @returns {number} The normalized rotation angle in degrees.
     */
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
    /**
     * Retrieves the normal appearance template from the given dictionarys `AP` entry,
     * if present, and binds its reference.
     *
     * @private
     * @param {_PdfDictionary} dictionary The widget or field dictionary to read the appearance from.
     * @returns {PdfTemplate} The extracted appearance template, or `undefined` if not available.
     */
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
    /**
     * Checks the field dictionary for a populated `V` entry to determine if the signature
     * has been applied and updates the internal signed state.
     *
     * @private
     * @returns {void}
     */
    _checkSigned(): void {
        if (this._dictionary && this._dictionary.has('V')) {
            const dictionary: _PdfDictionary = this._dictionary.get('V');
            if (dictionary !== null && typeof dictionary !== 'undefined' && dictionary.size > 0) {
                this._isSigned = true;
            }
        }
    }
    /**
     * Gets the document revision associated with the signed byte range.
     *
     * @returns {number} The signed revision number; otherwise, -1 if the revision cannot be determined.
     * @private
     */
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
    /**
     * Validates the digital signature and returns the validation result.
     *
     * ```typescript
     * // Load the signed PDF document
     * const document: PdfDocument = new PdfDocument(data);
     * // Access the signature field
     * const field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
     * // Validate the signature
     * const result: PdfSignatureValidationResult = field.validateSignature();
     * // Check the validation status
     * const isSignatureValid: boolean = result.isSignatureValid;
     * const signatureStatus: SignatureStatus = result.signatureStatus;
     * // Access revocation information
     * const revocationStatus: RevocationStatus = result.revocationResult.ocspRevocationStatus;
     * // Access signer certificates
     * const certificates: PdfSignerCertificate[] = result.signerCertificates;
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfSignatureValidationOptions} [options] The options that control signature validation behavior.
     * @returns {PdfSignatureValidationResult} The result containing signature validity, certificate validation status, revocation information, and any validation errors.
     */
    validateSignature(options?: PdfSignatureValidationOptions): PdfSignatureValidationResult {
        initializeTelemetryFeature('Signature Validation', 'PDFLibrary');
        const result: PdfSignatureValidationResult = {
            cryptographicStandard: undefined as any, // eslint-disable-line
            digestAlgorithm: undefined as any, // eslint-disable-line
            isDocumentModified: false,
            validityAtCurrentTime: false,
            validityAtSignedTime: false,
            validityAtTimestampTime: false,
            isCertifiedSignature: false,
            documentPermissions: PdfCertificationFlag.forbidChanges,
            revocationResult: undefined,
            ltvVerificationInformation: {
                isCrlEmbedded: false,
                isLtvEmbedded: false,
                isOcspEmbedded: false
            },
            signatureAlgorithm: '',
            signatureName: '',
            signatureStatus: SignatureStatus.unknown,
            validationErrorMessages: [],
            timestampInformation: {
                isDocumentTimestamp: false,
                isValid: false,
                timestampTime: new Date(0),
                timestampPolicyId: '',
                certificate: undefined,
                signerCertificates: undefined
            },
            isSignatureValid: false,
            signerCertificates: []
        };
        try {
            if (!this._signature) {
                this._signature = this.getSignature();
                this._isSigned = true;
            }
            const revocationValidationType: RevocationType = options && options.revocationValidationType ?
                options.revocationValidationType : RevocationType.ocspAndCrl;
            const validateRevocation: boolean = revocationValidationType !== RevocationType.none;
            if (this._signature && !this._cmsSigner) {
                this._cmsSigner = this._signature._signatureDictionary._cmsSigner;
            }
            this._trustedRoots = [];
            if (options && options.trustedCertificates && options.trustedCertificates.length > 0) {
                for (let i: number = 0; i < options.trustedCertificates.length; i++) {
                    const der: Uint8Array = options.trustedCertificates[<number>i];
                    if (!(der instanceof Uint8Array) || der.length === 0) {
                        continue;
                    }
                    const certPassword: string =
                        (options.passwords && options.passwords[<number>i] !== undefined)
                            ? options.passwords[<number>i]
                            :  '';
                    const extracted: any[] = this._signature._signatureDictionary._extractTrustedCertsFromBytes(der, certPassword); // eslint-disable-line
                    for (const cert of extracted) {
                        this._trustedRoots.push(cert);
                    }
                }
            }
            if (!this._verified) {
                this._verified = true;
                this._revocationValidationType = revocationValidationType;
                this._validateRevocation = validateRevocation;
            }
            const innerResult: PdfSignatureValidationResult = this._validateSignature(revocationValidationType, validateRevocation,
                                                                                      options && options.ocspExternalData,
                                                                                      options && options.crlExternalData);
            if (innerResult) {
                Object.assign(result, innerResult);
            }
            if (this._trustedRoots.length > 0) {
                const embedded: any[] = this._getEmbeddedCertificates(); // eslint-disable-line
                if (!embedded || embedded.length === 0) {
                    result.signatureStatus = SignatureStatus.invalid;
                    result.validationErrorMessages.push(
                        'Signer certificate not found in signature.'
                    );
                    return result;
                }
                const signedDate: Date = this._signature.getSignedDate();
                const trustedVerification: boolean = this._validateCertificateWithCollection(
                    embedded, this._trustedRoots, signedDate, result
                );
                if (trustedVerification && result.signatureStatus === SignatureStatus.unknown) {
                    result.signatureStatus = SignatureStatus.valid;
                } else if (!trustedVerification) {
                    result.signatureStatus = SignatureStatus.invalid;
                    result.validationErrorMessages.push(
                        'Cannot be verified against the trusted certificate store or the certificate chain.'
                    );
                }
            }
        } catch (e) {
            result.signatureStatus = SignatureStatus.invalid;
            result.validationErrorMessages.push(
                e && e.message ? e.message : 'Unknown error during signature validation.'
            );
        }
        return result;
    }
    /**
     * Retrieves the certificates embedded in the CMS signature.
     *
     * @returns {any[]} The collection of embedded certificates; otherwise, undefined if no certificates are available.
     * @private
     */
    _getEmbeddedCertificates(): any[] { // eslint-disable-line
        if (this._cmsSigner && this._cmsSigner._certificates && this._cmsSigner._certificates.length > 0) {
            return this._cmsSigner._certificates;
        }
        return undefined;
    }
    /**
     * Retrieves the signing certificate from the collection of embedded certificates.
     *
     * @param {any[]} embedded The collection of embedded certificates.
     * @returns {any} The signing certificate; otherwise, undefined if no certificate is available.
     * @private
     */
    _getSignerCertificate(embedded: any[]): any { // eslint-disable-line
        if (embedded && embedded.length > 0) {
            return embedded[0];
        }
        return undefined;
    }
    /**
     * Validates the embedded CMS certificates against a collection of trusted root certificates,
     * mirroring the .NET ValidateCertificateWithCollection logic.
     *
     * @private
     * @param {any[]} embedded The embedded certificates from the CMS signature.
     * @param {any[]} trustedRoots The trusted root certificates provided by the caller.
     * @param {Date} signDate The date at which the signature was signed.
     * @param {PdfSignatureValidationResult} signatureResult The result object to append errors to.
     * @returns {boolean} `true` if any embedded certificate is verified by a trusted root; otherwise `false`.
     */
    _validateCertificateWithCollection(embedded: any[], trustedRoots: any[], signDate: Date, signatureResult: PdfSignatureValidationResult): boolean { // eslint-disable-line
        if (!embedded || embedded.length === 0 || !trustedRoots || trustedRoots.length === 0) {
            return false;
        }
        for (let i: number = 0; i < embedded.length; i++) {
            const cert: any = embedded[<number>i]; // eslint-disable-line
            for (const rootCert of trustedRoots) {
                if (this._isCertificateTimeValid(rootCert, signDate) &&
                    this._verifyCertificateSignature(cert, rootCert)) {
                    return true;
                }
            }
            let verifiedByChain: boolean = false;
            for (let j: number = 0; j < embedded.length; j++) {
                if (j !== i) {
                    const certNext: any = embedded[<number>j]; // eslint-disable-line
                    if (this._verifyCertificateSignature(cert, certNext)) {
                        verifiedByChain = true;
                        break;
                    }
                }
            }
            if (!verifiedByChain && i === embedded.length - 1) {
                signatureResult.validationErrorMessages.push(
                    'Cannot be verified against the KeyStore or the certificate chain'
                );
            }
        }
        return false;
    }
    /**
     * Builds and validates a certificate chain from the signing certificate to a trusted root certificate.
     *
     * @param {any} leaf The signing certificate from which to start chain validation.
     * @param {any[]} intermediates The intermediate certificates used to build the certificate chain.
     * @param {any[]} roots The trusted root certificates used as trust anchors.
     * @param {Date} validationTime The date and time at which certificate validity should be evaluated.
     * @returns {object} An object containing the trust result,
     * the constructed certificate chain, and a failure reason when validation is unsuccessful.
     * @private
     */
    _buildAndValidateCertificateChain(leaf: any, intermediates: any[], // eslint-disable-line
        roots: any[], validationTime: Date): { trusted: boolean; chain: any[]; failureReason?: string } {  // eslint-disable-line
        const pool: any[] = [...intermediates, ...roots]; // eslint-disable-line
        const chain: any[] = [leaf]; // eslint-disable-line
        const keyUsage: boolean[] = leaf._keyUsage;
        const allowsSigning: boolean = keyUsage ? (keyUsage[0] === true || keyUsage[1] === true) : true;
        if (!allowsSigning) {
            return { trusted: false, chain, failureReason: 'Signer keyUsage does not allow digital signing.' };
        }
        if (!this._isCertificateTimeValid(leaf, validationTime)) {
            return { trusted: false, chain, failureReason: 'Signer certificate is expired or not yet valid.' };
        }
        let current: any = leaf; // eslint-disable-line
        while (!this._isSelfSigned(current)) {
            const issuer: any = this._findIssuer(current, pool); // eslint-disable-line
            if (!issuer) {
                return { trusted: false, chain, failureReason: 'Issuer certificate not found.' };
            }
            const ok: boolean = this._verifyCertificateSignature(current, issuer);
            if (!ok) {
                return { trusted: false, chain, failureReason: 'Certificate signature verification failed.' };
            }
            if (!this._isCertificateTimeValid(issuer, validationTime)) {
                return { trusted: false, chain, failureReason: 'Issuer certificate is expired or not yet valid.' };
            }
            chain.push(issuer);
            current = issuer;
        }
        const root: any = current; // eslint-disable-line
        const anchored: boolean = roots.some((r: any) => this._sameCertificate(r, root)); // eslint-disable-line
        if (!anchored) {
            return { trusted: false, chain, failureReason: 'Chain terminates at an untrusted root.' };
        }
        if (!this._verifyCertificateSignature(root, root)) {
            return { trusted: false, chain, failureReason: 'Root certificate self-signature invalid.' };
        }
        return { trusted: true, chain };
    }
    _findIssuer(child: any, pool: any[]): any { // eslint-disable-line
        const akiKeyId: Uint8Array = this._tryGetAuthorityKeyIdentifier(child);
        if (akiKeyId) {
            const match: boolean = pool.find((c: any) => _bytesEqual(this._tryGetSubjectKeyIdentifier(c), akiKeyId)); // eslint-disable-line
            if (match) {
                return match;
            }
        }
        const childSigned: _PdfSignedCertificate = child._structure._getSignedCertificate();
        const issuerDn: any = childSigned._issuer; // eslint-disable-line
        const candidates: any[] = pool.filter((c: any) => { // eslint-disable-line
            if (!c) {
                return false;
            }
            let signed: _PdfSignedCertificate;
            try {
                signed = c._structure._getSignedCertificate();
            } catch {
                return false;
            }
            if (!signed || !signed._subject) {
                return false;
            }
            return this._areDistinguishedNamesEqual(issuerDn, signed._subject);
        });
        if (candidates.length === 0) {
            return null;
        }
        const sigBytes: Uint8Array = child._structure._getSignatureValue();
        const kSig: number = sigBytes.length;
        const ordered: any[] = candidates.sort((a: any, b: any) => { // eslint-disable-line
            const kA: number = ((a._getPublicKey() as any)._modulus instanceof Uint8Array) ? (a._getPublicKey() as any)._modulus.length : 0; // eslint-disable-line
            const kB: number = ((b._getPublicKey() as any)._modulus instanceof Uint8Array) ? (b._getPublicKey() as any)._modulus.length : 0; // eslint-disable-line
            const da: number = Math.abs(kA - kSig);
            const db: number = Math.abs(kB - kSig);
            return da - db;
        });
        for (const cand of ordered) {
            if (this._verifyCertificateSignature(child, cand)) {
                return cand;
            }
        }
        return null;
    }
    /**
     * Maps a certificate signature algorithm OID to its corresponding hash algorithm name.
     *
     * @param {string} oid The object identifier (OID) of the certificate signature algorithm.
     * @returns {'SHA1' | 'SHA256' | 'SHA384' | 'SHA512'} The corresponding hash algorithm name; otherwise, null if the OID is not supported.
     * @private
     */
    _mapCertificateSigAlgOidToHash(oid: string): 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512' {
        switch (oid) {
        case '1.2.840.113549.1.1.5':
            return 'SHA1';
        case '1.2.840.113549.1.1.11':
            return 'SHA256';
        case '1.2.840.113549.1.1.12':
            return 'SHA384';
        case '1.2.840.113549.1.1.13':
            return 'SHA512';
        default:
            return null;
        }
    }
    /**
     * Verifies that a certificate was signed by the specified issuer certificate.
     *
     * @param {any} child The certificate whose signature is to be verified.
     * @param {any} issuer The issuer certificate containing the public key used for verification.
     * @returns {boolean} true if the certificate signature is valid; otherwise, false.
     * @private
     */
    _verifyCertificateSignature(child: any, issuer: any): boolean { // eslint-disable-line
        const structure: _PdfX509CertificateStructure = child._structure;
        const algoOid: string = structure._getSignatureAlgorithmOid();
        const hashName: 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512' = this._mapCertificateSigAlgOidToHash(algoOid);
        if (!hashName) {
            return false;
        }
        const tbs: Uint8Array = child._getTobeSignedCertificate();
        const signature: Uint8Array = structure._getSignatureValue();
        if (!signature || signature.length === 0) {
            return false;
        }
        const pubParam: _PdfCipherParameter = issuer._getPublicKey(false);
        if (!(pubParam instanceof _PdfRonCipherParameter)) {
            return false;
        }
        const icp: _ICipherParam = this._toICipherParam(pubParam);
        return this._cmsSigner._verifyRsaPkcs1Signature(hashName, tbs, signature, icp);
    }
    /**
     * Determines whether the specified certificate is valid at the given date and time.
     *
     * @param {any} cert The certificate whose validity period is to be checked.
     * @param {Date} at The date and time against which the certificate validity is evaluated.
     * @returns {boolean} true if the certificate is valid at the specified time; otherwise, false.
     * @private
     */
    _isCertificateTimeValid(cert: any, at: Date): boolean { // eslint-disable-line
        const signed: _PdfSignedCertificate = cert._structure._getSignedCertificate();
        const validFrom: Date =
            signed._startDate && typeof signed._startDate._toDate === 'function'
                ? signed._startDate._toDate()
                : undefined;
        const validTo: Date | undefined =
            signed._endDate && typeof signed._endDate._toDate === 'function'
                ? signed._endDate._toDate()
                : undefined;
        if (!validFrom || !validTo) {
            return false;
        }
        return at.getTime() >= validFrom.getTime() && at.getTime() <= validTo.getTime();
    }
    /**
     * Determines whether the specified certificate is self-signed.
     *
     * @param {any} cert The certificate to evaluate.
     * @returns {boolean} true if the certificate is self-signed and its signature is valid; otherwise, false.
     * @private
     */
    _isSelfSigned(cert: any): boolean { // eslint-disable-line
        const signed: _PdfSignedCertificate = cert._structure._getSignedCertificate();
        const subject: any = signed._subject; // eslint-disable-line
        const issuer: any = signed._issuer; // eslint-disable-line
        const dnEqual: boolean = this._areDistinguishedNamesEqual(subject, issuer);
        if (!dnEqual) {
            return false;
        }
        return this._verifyCertificateSignature(cert, cert);
    }
    /**
     * Determines whether two certificates represent the same certificate.
     *
     * @param {any} a The first certificate to compare.
     * @param {any} b The second certificate to compare.
     * @returns {boolean} true if the certificates are identical; otherwise, false.
     * @private
     */
    _sameCertificate(a: any, b: any): boolean { // eslint-disable-line
        const derA: Uint8Array = a._getEncoded();
        const derB: Uint8Array = b._getEncoded();
        if (_bytesEqual(derA, derB)) {
            return true;
        }
        const sa: _PdfSignedCertificate = a._structure._getSignedCertificate();
        const sb: _PdfSignedCertificate = b._structure._getSignedCertificate();
        const serialA: Uint8Array = sa._serialNumber;
        const serialB: Uint8Array = sb._serialNumber;
        const sameDn: boolean = this._areDistinguishedNamesEqual(sa._subject, sb._subject);
        const sameSerial: boolean = _bytesEqual(serialA, serialB);
        return sameDn && sameSerial;
    }
    /**
     * Retrieves the Authority Key Identifier (AKI) from the specified certificate.
     *
     * @param {any} cert The certificate from which to retrieve the Authority Key Identifier.
     * @returns {Uint8Array} The Authority Key Identifier value; otherwise, null if the extension is not present or cannot be parsed.
     * @private
     */
    _tryGetAuthorityKeyIdentifier(cert: any): Uint8Array { // eslint-disable-line
        const exts: _PdfX509Extensions = cert._getExtensions();
        if (exts) {
            const akiOid: _PdfObjectIdentifier = exts._authorityKeyIdentifier;
            const ext: _PdfX509Extension = exts._getExtension(akiOid);
            if (!ext || !ext._value) {
                return null;
            }
            const inner: _PdfAbstractSyntaxElement = this._unwrapExtensionValue(ext._value);
            if (!inner) {
                return null;
            }
            let seq: _PdfAbstractSyntaxElement[];
            try {
                seq = inner._getSequence();
            } catch {
                const nested: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                const innerVal: Uint8Array = (inner as any)._getValue ? (inner as any)._getValue() : new Uint8Array(0); // eslint-disable-line
                nested._fromBytes(innerVal);
                seq = nested._getSequence();
            }
            if (seq && seq.length > 0) {
                for (const el of seq) {
                    const isTaggedFn: any = el._isTagged(); // eslint-disable-line
                    if (typeof isTaggedFn === 'function' && isTaggedFn.call(el)) {
                        let tagNo: number = -1;
                        const getTagNo: any = (el as any)._getTagNumber; // eslint-disable-line
                        if (typeof getTagNo === 'function') {
                            tagNo = getTagNo.call(el);
                        }
                        if (tagNo === 0) {
                            let kid: Uint8Array = null;
                            const getValue: any = el._getValue(); // eslint-disable-line
                            if (typeof getValue === 'function') {
                                kid = getValue.call(el);
                            }
                            if (kid && kid.length > 0) {
                                return kid;
                            }
                        }
                    }
                }
            }
            return null;
        }
        return null;
    }
    /**
     * Extracts and decodes the inner ASN.1 value from a certificate extension.
     *
     * @param {_PdfAbstractSyntaxElement} extValue The encoded extension value to unwrap.
     * @returns {_PdfAbstractSyntaxElement} The decoded ASN.1 element contained within the extension value; otherwise, undefined if the value is empty.
     * @private
     */
    _unwrapExtensionValue(extValue: _PdfAbstractSyntaxElement): _PdfAbstractSyntaxElement {
        const innerDer: Uint8Array = extValue && typeof extValue._getValue === 'function'
            ? extValue._getValue() : new Uint8Array(0);
        if (innerDer && innerDer.length > 0) {
            const asn1: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            asn1._fromBytes(innerDer);
            return asn1;
        }
        return undefined;
    }
    /**
     * Retrieves the Subject Key Identifier (SKI) from the specified certificate.
     *
     * @param {any} cert The certificate from which to retrieve the Subject Key Identifier.
     * @returns {Uint8Array} The Subject Key Identifier value; otherwise, null if the extension is not present or cannot be parsed.
     * @private
     */
    _tryGetSubjectKeyIdentifier(cert: any): Uint8Array { // eslint-disable-line
        const exts: _PdfX509Extensions = cert._getExtensions();
        if (!exts) {
            return null;
        }
        const skiOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.14');
        const extElem: _PdfAbstractSyntaxElement = cert._getExtension(skiOid);
        if (!extElem) {
            return null;
        }
        const inner: _PdfAbstractSyntaxElement = this._unwrapExtensionValue(extElem);
        if (!inner) {
            return null;
        }
        try {
            let keyId: Uint8Array = null;
            const getValue: any = (inner as any)._getValue; // eslint-disable-line
            if (typeof getValue === 'function') {
                keyId = getValue.call(inner);
            }
            return (keyId && keyId.length > 0) ? keyId : null;
        } catch {
            return null;
        }
    }
    /**
     * Determines whether two distinguished names are equivalent.
     *
     * @param {any} a The first distinguished name to compare.
     * @param {any} b The second distinguished name to compare.
     * @returns {boolean} true if the distinguished names contain the same normalized values; otherwise, false.
     * @private
     */
    _areDistinguishedNamesEqual(a: any, b: any): boolean { // eslint-disable-line
        if (!a || !b) {
            return false;
        }
        const normalize: any = (val: any) => (val || '').toString().trim().toLowerCase(); // eslint-disable-line
        const valuesA: any = (a._values || []).map(normalize); // eslint-disable-line
        const valuesB: any = (b._values || []).map(normalize); // eslint-disable-line
        if (valuesA.length !== valuesB.length) {
            return false;
        }
        valuesA.sort();
        valuesB.sort();
        for (let i: number = 0; i < valuesA.length; i++) {
            if (valuesA[<number>i] !== valuesB[<number>i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Validates the signature content, certificate information, revocation status,
     * timestamp data, and document integrity, and returns the validation result.
     *
     * @param {RevocationType} revocationValidationType The revocation validation method to use.
     * @param {boolean} validateRevocation Indicates whether certificate revocation validation should be performed.
     * @param {Uint8Array} [ocsp] The external OCSP response data used for revocation validation.
     * @param {Uint8Array} [crl] The external CRL data used for revocation validation.
     * @returns {PdfSignatureValidationResult} The result containing signature validation details, certificate information, revocation status, and any validation errors.
     * @private
     */
    _validateSignature(revocationValidationType: RevocationType,
                       validateRevocation: boolean, ocsp?: Uint8Array, crl?: Uint8Array): PdfSignatureValidationResult {
        const result: PdfSignatureValidationResult = {
            cryptographicStandard: undefined as any, // eslint-disable-line
            digestAlgorithm: undefined as any, // eslint-disable-line
            isDocumentModified: false,
            validityAtCurrentTime: false,
            validityAtSignedTime: false,
            validityAtTimestampTime: false,
            isCertifiedSignature: false,
            documentPermissions: PdfCertificationFlag.forbidChanges,
            revocationResult: undefined,
            ltvVerificationInformation: {
                isCrlEmbedded: false,
                isLtvEmbedded: false,
                isOcspEmbedded: false
            },
            signatureAlgorithm: '',
            signatureName: '',
            signatureStatus: SignatureStatus.unknown,
            validationErrorMessages: [],
            timestampInformation: {
                isDocumentTimestamp: false,
                isValid: false,
                timestampTime: new Date(0),
                timestampPolicyId: '',
                certificate: undefined,
                signerCertificates: undefined
            },
            isSignatureValid: false,
            signerCertificates: []
        };
        result.signatureName = this._getFieldName();
        result.cryptographicStandard = this._signature._cryptographicStandard;
        result.digestAlgorithm = this._signature._digestAlgorithm;
        result.isCertifiedSignature = this._signature._certify;
        result.documentPermissions = this._signature._documentPermissions ?
            this._signature._documentPermissions : PdfCertificationFlag.forbidChanges;
        result.signatureAlgorithm = this._cmsSigner._encryptionAlgorithm;
        const certificates: any[] = this._cmsSigner._certificates; // eslint-disable-line
        this._detectLtvData(result.ltvVerificationInformation);
        if (!this._verifyChecksum()) {
            result.isDocumentModified = true;
            result.signatureStatus = SignatureStatus.invalid;
            result.validationErrorMessages.push(
                'The document has been altered or corrupted since the signature was applied'
            );
            return result;
        }
        result.signatureStatus = SignatureStatus.valid;
        if (this._checkIncrementUpdate()) {
            result.isDocumentModified = true;
            result.signatureStatus = SignatureStatus.invalid;
            result.validationErrorMessages.push(
                'The document has been altered or corrupted since the signature was applied'
            );
            return result;
        }
        if (validateRevocation) {
            result.revocationResult = this._validateRevocationCore(revocationValidationType, ocsp, crl);
        }
        if (certificates && Array.isArray(certificates) && certificates.length > 0) {
            const isOcspGood: boolean = !!(result.revocationResult &&
                (result.revocationResult.ocspRevocationStatus === RevocationStatus.good ||
                 result.revocationResult.ocspRevocationStatus === RevocationStatus.none));
            const isCrlGood: boolean = !!(result.revocationResult && !result.revocationResult.isRevokedCRL);
            const isOcspEmbedded: boolean = result.ltvVerificationInformation.isOcspEmbedded;
            const isCrlEmbedded: boolean = result.ltvVerificationInformation.isCrlEmbedded;
            let ocspResponderCert: any = null; // eslint-disable-line
            let ocspThisUpdate: Date = undefined;
            let ocspNextUpdate: Date = undefined;
            if (validateRevocation && isOcspGood) {
                const ocspBytes: Uint8Array = this._extractOcspFromDss();
                if (ocspBytes) {
                    const ocspInfo: { cert: any; validFrom: Date; validTo: Date } = // eslint-disable-line
                        this._signature._signatureDictionary._extractOcspResponderInfo(ocspBytes);
                    if (ocspInfo) {
                        ocspResponderCert = ocspInfo.cert;
                        ocspThisUpdate = ocspInfo.validFrom;
                        ocspNextUpdate = ocspInfo.validTo;
                    }
                }
            }
            let crlIssuerCert: any = null; // eslint-disable-line
            let crlThisUpdate: Date = undefined;
            let crlNextUpdate: Date = undefined;
            if (validateRevocation && isCrlGood) {
                if (certificates.length > 1) {
                    crlIssuerCert = certificates[1];
                }
                const crlBytes: Uint8Array = this._extractCrlFromDss();
                if (crlBytes) {
                    const crlTimes: { thisUpdate: Date; nextUpdate: Date } =
                        this._extractCrlTimes(crlBytes);
                    if (crlTimes) {
                        crlThisUpdate = crlTimes.thisUpdate;
                        crlNextUpdate = crlTimes.nextUpdate;
                    }
                }
            }
            const orderedCerts: any[] = certificates.slice().reverse(); // eslint-disable-line
            for (let ci: number = 0; ci < orderedCerts.length; ci++) {
                const cert: any = orderedCerts[<number>ci]; // eslint-disable-line
                const certProps: PdfX509CertificateProperties = cert._extractProperties();
                const signerEntry: PdfSignerCertificate = {
                    certificate: certProps
                };
                if (validateRevocation && isOcspGood && ci === 0) {
                    const ocspCert: any = ocspResponderCert || cert; // eslint-disable-line
                    const ocspProps: PdfX509CertificateProperties = ocspCert._extractProperties();
                    const ocspEntry: PdfRevocationCertificate = {
                        isEmbedded: isOcspEmbedded,
                        certificates: [ocspProps],
                        validFrom: ocspThisUpdate,
                        validTo: ocspNextUpdate
                    };
                    signerEntry.ocspCertificate = ocspEntry;
                }
                if (validateRevocation && isCrlGood && ci === 1) {
                    const issuerCert: any = crlIssuerCert || cert; // eslint-disable-line
                    const crlProps: PdfX509CertificateProperties = issuerCert._extractProperties();
                    const crlEntry: PdfRevocationCertificate = {
                        isEmbedded: isCrlEmbedded,
                        certificates: [crlProps],
                        validFrom: crlThisUpdate,
                        validTo: crlNextUpdate
                    };
                    signerEntry.crlCertificate = crlEntry;
                }
                result.signerCertificates.push(signerEntry);
            }
        }
        if (this._signature && typeof this._signature._verifyTimeStampCore === 'function') {
            result.timestampInformation = this._signature._verifyTimeStampCore();
        }
        if (certificates && Array.isArray(certificates) && certificates.length > 0) {
            const signerCert: any = certificates[0]; // eslint-disable-line
            const signedCert: any = signerCert._structure._getSignedCertificate(); // eslint-disable-line
            const validFrom: Date = signedCert._startDate ? signedCert._startDate._toDate() : undefined;
            const validTo: Date = signedCert._endDate ? signedCert._endDate._toDate() : undefined;
            const checkValidity: (d: Date) => boolean = (d: Date): boolean => {
                if (!d || !validFrom || !validTo) {
                    return false;
                }
                return d.getTime() >= validFrom.getTime() && d.getTime() <= validTo.getTime();
            };
            const isValidOCSPorCRLtime: boolean = !!(result.revocationResult &&
                (result.revocationResult.ocspRevocationStatus === RevocationStatus.good ||
                 result.revocationResult.ocspRevocationStatus === RevocationStatus.none) &&
                !result.revocationResult.isRevokedCRL);
            const signedDate: Date = (this._signature && typeof this._signature.getSignedDate === 'function')
                ? this._signature.getSignedDate() : (this._signature ? this._signature._signedDate : undefined);
            if (checkValidity(signedDate)) {
                result.validityAtSignedTime = true;
            } else if (!isValidOCSPorCRLtime) {
                result.validationErrorMessages.push(
                    'The signature is not valid at signing date. Signing time is from the clock on the signer\'s computer'
                );
            }
            if (checkValidity(new Date())) {
                result.validityAtCurrentTime = true;
            } else if (!isValidOCSPorCRLtime) {
                result.validationErrorMessages.push('The signature is not valid at current date.');
            }
            if (result.timestampInformation && result.timestampInformation.isValid && result.timestampInformation.timestampTime) {
                const tsTime: Date = result.timestampInformation.timestampTime;
                if (checkValidity(tsTime)) {
                    result.validityAtTimestampTime = true;
                } else {
                    result.validationErrorMessages.push(
                        'The signature includes an embedded timestamp but it could not be verified.'
                    );
                }
            }
        }
        if (result.isDocumentModified) {
            result.signatureStatus = SignatureStatus.invalid;
        } else {
            const isValid: boolean = result.validityAtCurrentTime || result.validityAtSignedTime ||
                result.validityAtTimestampTime;
            const revocationResult: RevocationResult = result.revocationResult;
            let hasValidRevocation: boolean = false;
            if (revocationResult) {
                if ((revocationResult.ocspRevocationStatus === RevocationStatus.good ||
                    revocationResult.ocspRevocationStatus === RevocationStatus.none) &&
                    !revocationResult.isRevokedCRL) {
                    hasValidRevocation = true;
                }
            }
            if (isValid && hasValidRevocation) {
                result.signatureStatus = SignatureStatus.unknown;
                result.isSignatureValid = true;
            } else if (!validateRevocation && isValid) {
                result.signatureStatus = SignatureStatus.unknown;
                result.isSignatureValid = true;
            } else {
                result.signatureStatus = SignatureStatus.invalid;
            }
        }
        return result;
    }
    /**
     * Retrieves the fully qualified name of the signature field.
     *
     * @returns {string} The fully qualified field name; otherwise, undefined if the field name cannot be determined.
     * @private
     */
    _getFieldName(): string {
        const fieldDict: _PdfDictionary = this._signature && this._signature._signatureField
            ? this._signature._signatureField._dictionary : undefined;
        if (!fieldDict) {
            return undefined;
        }
        let name: string;
        let leaf: string;
        const fetchParent: any = (dic: _PdfDictionary): _PdfDictionary => { // eslint-disable-line
            if (!dic || !dic.has('Parent')) {
                return undefined;
            }
            const parentRaw: any = dic.get('Parent'); // eslint-disable-line
            if (parentRaw && parentRaw instanceof _PdfDictionary) {
                return parentRaw as _PdfDictionary;
            }
            if (parentRaw && parentRaw instanceof _PdfReference && this._crossReference) {
                return this._crossReference._fetch(parentRaw as _PdfReference);
            }
            return undefined;
        };
        if (!fieldDict.has('Parent')) {
            if (fieldDict.has('T')) {
                const t: string = fieldDict.get('T');
                if (typeof t === 'string') {
                    leaf = t;
                }
            }
        } else {
            let dic: _PdfDictionary = fetchParent(fieldDict);
            if (dic) {
                while (dic && dic.has('Parent')) {
                    if (dic.has('T')) {
                        const t: string = dic.get('T');
                        if (typeof t === 'string') {
                            name = (name === null) ? t : `${t}.${name}`;
                        }
                    }
                    const next: _PdfDictionary = fetchParent(dic);
                    if (next && !next.has('T')) {
                        dic = next;
                        break;
                    }
                    dic = next;
                    if (!dic) {
                        break;
                    }
                }
                if (dic && dic.has('T')) {
                    const t: string = dic.get('T');
                    if (typeof t === 'string') {
                        name = (name === null) ? t : `${t}.${name}`;
                    }
                }
                if (fieldDict.has('T')) {
                    const leafT: string = fieldDict.get('T');
                    if (typeof leafT === 'string') {
                        name = (name === null) ? leafT : `${name}.${leafT}`;
                    }
                }
            } else {
                if (fieldDict.has('T')) {
                    const t: string = fieldDict.get('T');
                    if (typeof t === 'string') {
                        leaf = t;
                    }
                }
            }
        }
        if (leaf !== null && typeof leaf !== 'undefined') {
            return leaf;
        }
        return name;
    }
    /**
     * Verifies the integrity of the signed content by validating its checksum.
     *
     * @returns {boolean} true if the checksum is valid; otherwise, false.
     * @private
     */
    _verifyChecksum(): boolean {
        if (this._cmsSigner) {
            try {
                return this._cmsSigner._validateCheckSum();
            } catch {
                return false;
            }
        }
        return false;
    }
    /**
     * Checks whether the document has been modified after the signature was applied
     * by analyzing incremental updates and permitted document changes.
     *
     * @returns {boolean} true if unauthorized modifications are detected; otherwise, false.
     * @private
     */
    _checkIncrementUpdate(): boolean {
        const xref: _PdfCrossReference = this._crossReference as _PdfCrossReference;
        if (!xref) {
            return false;
        }
        const trailer: _PdfDictionary = xref._trailer;
        if (trailer && !trailer.has('Prev')) {
            return false;
        }
        let ranges: number[];
        const sig: any = this._signature; // eslint-disable-line
        if (sig && Array.isArray(sig._ranges) && sig._ranges.length >= 4) {
            ranges = sig._ranges.slice(0, 4);
        } else {
            let sigDict: any = this._dictionary; // eslint-disable-line
            if (sigDict && sigDict.has && sigDict.has('V')) {
                const v: any = sigDict.get('V'); // eslint-disable-line
                if (v instanceof _PdfDictionary) {
                    sigDict = v;
                }
            }
            if (sigDict instanceof _PdfDictionary) {
                const br: any[] = sigDict.getArray('ByteRange'); // eslint-disable-line
                if (Array.isArray(br) && br.length >= 4) {
                    ranges = br.slice(0, 4).map((n: any) => Number(n)); // eslint-disable-line
                }
            }
        }
        if (!ranges || ranges.length < 4 || ranges.some((n: number) => !Number.isFinite(n))) {
            return true;
        }
        const [s1, l1, s2, l2]: number[] = ranges;
        const hasPermission: boolean = !!(sig && sig._certify === true);
        const permission: PdfCertificationFlag = (sig && sig._documentPermissions !== null)
            ? sig._documentPermissions : PdfCertificationFlag.forbidChanges;
        const forbidChanges: boolean = hasPermission && permission === PdfCertificationFlag.forbidChanges;
        const allowsFormFillOrComments: boolean = hasPermission &&
            (permission === PdfCertificationFlag.allowFormFill || permission === PdfCertificationFlag.allowComments);
        const skipObjects: Set<number> = new Set<number>();
        const catalog: _PdfDictionary = xref._root;
        if (catalog && catalog.has('AcroForm')) {
            this._addTopRefIfAny(catalog.getRaw('AcroForm'), skipObjects);
        }
        if (trailer && trailer.has('Info')) {
            this._addTopRefIfAny(trailer.getRaw('Info'), skipObjects);
        }
        const skippedObjects: Set<number> = new Set<number>();
        const appendedFieldObjNums: Set<number> = new Set<number>();
        const laterSignatureObjects: Set<number> = new Set<number>();
        let acroTopRefNum: number = undefined;
        if (catalog && catalog.has('AcroForm')) {
            const acroRaw: any = catalog.getRaw('AcroForm'); // eslint-disable-line
            if (acroRaw instanceof _PdfReference) {
                acroTopRefNum = acroRaw.objectNumber;
            }
        }
        const histories: any = xref._entriesHistory; // eslint-disable-line
        let signedRevisionId: number = 0;
        if (this._ref && this._ref.objectNumber && histories && histories.length > this._ref.objectNumber) {
            const sigHist: _PdfObjectInformation[] = histories[this._ref.objectNumber];
            if (sigHist && sigHist.length > 0) {
                for (const e of sigHist) {
                    if (!e || e.free) {
                        continue;
                    }
                    const phys: number = xref._getPhysicalOffsetForEntry(e);
                    if (Number.isFinite(phys) && this._isInByteRange(phys, s1, l1, s2, l2)) {
                        signedRevisionId = e.revisionId ? e.revisionId : 0;
                        break;
                    }
                }
            }
        }
        if (catalog && catalog.has('AcroForm')) {
            const acroFormRaw: any = catalog.getRaw('AcroForm'); // eslint-disable-line
            if (acroFormRaw instanceof _PdfReference) {
                const acroFormInSignedRev: any = xref._fetchReferenceInRevision(acroFormRaw, signedRevisionId); // eslint-disable-line
                this._readAllSubRefs(acroFormInSignedRev, signedRevisionId, xref, skippedObjects);
            } else {
                this._readAllSubRefs(acroFormRaw, signedRevisionId, xref, skippedObjects);
            }
        }
        if (catalog && catalog.has('AcroForm')) {
            const acroRaw: any = catalog.getRaw('AcroForm'); // eslint-disable-line
            if (acroRaw instanceof _PdfReference) {
                const signedAcro: any = xref._fetchReferenceInRevision(acroRaw, signedRevisionId); // eslint-disable-line
                const currentAcro: any = xref._fetch(acroRaw); // eslint-disable-line
                const sFields: any = signedAcro && signedAcro.has('Fields') ? signedAcro.getRaw('Fields') : null; // eslint-disable-line
                const cFields: any = currentAcro && currentAcro.has('Fields') ? currentAcro.getRaw('Fields') : null; // eslint-disable-line
                if (Array.isArray(sFields) && Array.isArray(cFields) && cFields.length < sFields.length) {
                    return true;
                }
            }
        }
        if (trailer && trailer.has('Info')) {
            const infoRaw: any = trailer.getRaw('Info'); // eslint-disable-line
            if (infoRaw instanceof _PdfReference) {
                const infoInSignedRev: any = xref._fetchReferenceInRevision(infoRaw, signedRevisionId); // eslint-disable-line
                this._readAllSubRefs(infoInSignedRev, signedRevisionId, xref, skippedObjects);
            } else {
                this._readAllSubRefs(infoRaw, signedRevisionId, xref, skippedObjects);
            }
        }
        const signatureIsLocked: boolean = !!(sig && sig._isLocked);
        if (histories && histories.length > 0) {
            for (let objNum: number = 1; objNum < histories.length; objNum++) {
                if (laterSignatureObjects.has(objNum)) {
                    continue;
                }
                const hist: _PdfObjectInformation[] = histories[<number>objNum];
                if (!hist || hist.length === 0) {
                    continue;
                }
                let newestEntry: _PdfObjectInformation;
                for (const e of hist) {
                    if (e && !e.free) {
                        newestEntry = e; break;
                    }
                }
                if (!newestEntry) {
                    continue;
                }
                let signedEntry: _PdfObjectInformation;
                let hasOutsideNewer: boolean = false;
                for (const e of hist) {
                    if (!e || e.free) {
                        continue;
                    }
                    const phys: number = xref._getPhysicalOffsetForEntry(e);
                    if (!Number.isFinite(phys)) {
                        if (e === newestEntry) {
                            return true;
                        }
                        continue;
                    }
                    if (this._isInByteRange(phys, s1, l1, s2, l2)) {
                        signedEntry = e;
                        break;
                    } else {
                        hasOutsideNewer = true;
                    }
                }
                if (!hasOutsideNewer) {
                    continue;
                }
                if (forbidChanges) {
                    return true;
                }
                const newDict: _PdfDictionary = this._fetchDictAtEntry(objNum, newestEntry, xref);
                if (!newDict) {
                    const ref: _PdfReference = _PdfReference.get(objNum, newestEntry.gen || 0);
                    const rawObj: any = xref._fetchAtEntry(ref, newestEntry, false); // eslint-disable-line
                    if (this._isLtvObject(rawObj)) {
                        continue;
                    }
                    if (signedEntry) {
                        continue;
                    }
                    return true;
                }
                if (newDict.has('Type')) {
                    const t: any = newDict.get('Type'); // eslint-disable-line
                    const tName: any = t instanceof _PdfName ? t.name : undefined; // eslint-disable-line
                    if (tName === 'Catalog') {
                        continue;
                    }
                }
                if (skippedObjects.has(objNum) || (newDict && newDict.has && newDict.has('Fields'))) {
                    const lockDecision: boolean = this._evaluateLockRules(newDict, newestEntry.revisionId ?
                        newestEntry.revisionId : 0, xref);
                    if (lockDecision === true) {
                        return true;
                    }
                    if (lockDecision === false) {
                        continue;
                    }
                    const isTopLevelAcroForm: boolean = typeof acroTopRefNum === 'number' && objNum === acroTopRefNum;
                    if (hasPermission && isTopLevelAcroForm) {
                        const allowsFormFillOrCommentsLocal: boolean = permission === PdfCertificationFlag.allowFormFill ||
                            permission === PdfCertificationFlag.allowComments;
                        if (allowsFormFillOrCommentsLocal && signedEntry) {
                            const oldAcro: _PdfDictionary = this._fetchDictAtEntry(objNum, signedEntry, xref);
                            if (oldAcro.has('Fields') && newDict.has('Fields')) {
                                const illegal: boolean = xref._readFormReferences(oldAcro, newDict,
                                                                                  signedEntry.revisionId ? signedEntry.revisionId : 0,
                                                                                  newestEntry.revisionId ? newestEntry.revisionId : 0);
                                if (illegal) {
                                    return true;
                                }
                                continue;
                            }
                        }
                    }
                }
                if (!signedEntry) {
                    if (laterSignatureObjects.has(objNum)) {
                        continue;
                    }
                    if (this._isSigOrTimestampDict(newDict)) {
                        const ref: _PdfReference = _PdfReference.get(objNum, newestEntry.gen || 0);
                        this._collectLaterSignatureObjects(ref, xref, laterSignatureObjects);
                        continue;
                    }
                    if (newDict.has('Type')) {
                        const t: any = newDict.get('Type'); // eslint-disable-line
                        const tName: string = t instanceof _PdfName ? t.name : (typeof t === 'string' ? t : undefined);
                        if (tName === 'Page') {
                            const annots: any = newDict.getRaw('Annots'); // eslint-disable-line
                            if (Array.isArray(annots) && annots.length > 0) {
                                let onlyWidgetAnnots: boolean = true;
                                for (const annot of annots) {
                                    const annotObj: any = // eslint-disable-line
                                        annot instanceof _PdfReference ? xref._fetchReferenceInRevision(annot,
                                                                                                        newestEntry.revisionId ?
                                                                                                            newestEntry.revisionId : 0)
                                            : annot;
                                    const annotDict: _PdfDictionary = xref._asDictionary(annotObj);
                                    if (!annotDict) {
                                        onlyWidgetAnnots = false;
                                        break;
                                    }
                                    const subtypeObj: any = annotDict.get('Subtype'); // eslint-disable-line
                                    const subtypeName: string = subtypeObj instanceof _PdfName ? subtypeObj.name : subtypeObj;
                                    if (subtypeName !== 'Widget') {
                                        onlyWidgetAnnots = false;
                                        break;
                                    }
                                }
                                if (onlyWidgetAnnots) {
                                    continue;
                                }
                            }
                            return true;
                        }
                        if (tName === 'Pages') {
                            const kids: any = newDict.getRaw('Kids'); // eslint-disable-line
                            if (Array.isArray(kids) && kids.length > 0) {
                                let onlyPageKids: boolean = true;
                                for (const kid of kids) {
                                    const kidObj: any = kid instanceof _PdfReference ? // eslint-disable-line
                                        xref._fetchReferenceInRevision(kid, newestEntry.revisionId
                                            ? newestEntry.revisionId : 0) : kid;
                                    const kidDict: _PdfDictionary = xref._asDictionary(kidObj);
                                    if (!kidDict) {
                                        onlyPageKids = false;
                                        break;
                                    }
                                    const kidType: any = kidDict.get('Type'); // eslint-disable-line
                                    const kidTypeName: string = kidType instanceof _PdfName ? kidType.name : kidType;
                                    if (kidTypeName !== 'Page' && kidTypeName !== 'Pages') {
                                        onlyPageKids = false;
                                        break;
                                    }
                                }
                                if (onlyPageKids) {
                                    continue;
                                }
                            }
                            return true;
                        }
                        if (tName === 'ObjStm' || tName === 'XRef') {
                            continue;
                        }
                        if (tName === 'DSS') {
                            const ref: _PdfReference = _PdfReference.get(objNum, newestEntry.gen || 0);
                            this._collectLaterSignatureObjects(ref, xref, laterSignatureObjects);
                            continue;
                        }
                        if (tName === 'Font') {
                            const ref: _PdfReference = _PdfReference.get(objNum, newestEntry.gen || 0);
                            this._collectLaterSignatureObjects(ref, xref, laterSignatureObjects);
                            continue;
                        }
                        if (tName === 'Annot') {
                            const entry: number = newestEntry.revisionId ? newestEntry.revisionId : 0;
                            if (typeof xref._checkSubTypeSingle === 'function') {
                                const ok: any = xref._checkSubTypeSingle(newDict, hasPermission, permission, entry, xref); // eslint-disable-line
                                if (ok) {
                                    continue;
                                }
                                return true;
                            }
                            return true;
                        }
                        if (tName === 'XObject') {
                            const subtype: any = newDict.get('Subtype'); // eslint-disable-line
                            const subtypeName: string = subtype instanceof _PdfName ? subtype.name : subtype;
                            if (subtypeName === 'Form') {
                                const ref: _PdfReference = _PdfReference.get(objNum, newestEntry.gen || 0);
                                this._collectLaterSignatureObjects(ref, xref, laterSignatureObjects);
                                continue;
                            }
                        }
                    }
                    if (newDict.has('Subtype')) {
                        if (xref._checkSubTypeSingle(newDict, hasPermission, permission, newestEntry.revisionId ?
                            newestEntry.revisionId : 0, xref)) {
                            continue;
                        }
                    }
                    const noType: any = !newDict.has('Type') || !newDict.get('Type'); // eslint-disable-line
                    const noSubtype: any = !newDict.has('Subtype') || !newDict.get('Subtype'); // eslint-disable-line
                    if (noType && noSubtype && hasPermission && allowsFormFillOrComments) {
                        if (newDict.has('FT')) {
                            return true;
                        }
                        continue;
                    }
                    if (newDict.has('FT')) {
                        const ft: any = newDict.get('FT'); // eslint-disable-line
                        const ftName: string = ft instanceof _PdfName ? ft.name : (typeof ft === 'string' ? ft : '');
                        if (ftName === 'Sig') {
                            continue;
                        }
                    }
                    const keys: string[] = [];
                    newDict.forEach((k: string) => keys.push(k));
                    if (keys.length === 0) {
                        continue;
                    }
                    const isDssDictionary: boolean =
                        keys.every((k: string) =>
                            k === 'OCSPs' ||
                            k === 'CRLs' ||
                            k === 'VRI' ||
                            k === 'Certs'
                        );
                    const isVriDictionary: any = // eslint-disable-line
                        keys.every((k: any) =>  // eslint-disable-line
                            /^[A-Fa-f0-9]{40}$/.test(k)
                        );
                    const isVriEntryDictionary: any = // eslint-disable-line
                        keys.every((k: any) => // eslint-disable-line
                            k === 'OCSP' ||
                            k === 'CRL' ||
                            k === 'Cert'
                        );
                    const isRevocationStream: any = keys.indexOf('Length') !== -1 && keys.indexOf('Filter') !== -1 && keys.length <= 3; // eslint-disable-line
                    if (isDssDictionary || isVriDictionary || isVriEntryDictionary || isRevocationStream) {
                        const ref: _PdfReference = _PdfReference.get(objNum, newestEntry.gen || 0);
                        this._collectLaterSignatureObjects(ref, xref, laterSignatureObjects);
                        continue;
                    }
                    const isResourceDictionary: any = // eslint-disable-line
                        keys.every((k: string) =>
                            k === 'Font' ||
                            k === 'ExtGState' ||
                            k === 'XObject' ||
                            k === 'ProcSet' ||
                            k === 'ColorSpace' ||
                            k === 'Pattern'
                        );
                    if (isResourceDictionary) {
                        const ref: _PdfReference = _PdfReference.get(objNum, newestEntry.gen || 0);
                        this._collectLaterSignatureObjects(ref, xref, laterSignatureObjects);
                        continue;
                    }
                    return true;
                }
                const oldDict: _PdfDictionary = this._fetchDictAtEntry(objNum, signedEntry, xref);
                if (!oldDict) {
                    return true;
                }
                if (this._isSigOrTimestampDict(newDict)) {
                    continue;
                }
                const lockDecision: any = this._evaluateLockRules(newDict, newestEntry.revisionId ? newestEntry.revisionId : 0, xref); // eslint-disable-line
                if (lockDecision === true) {
                    return true;
                }
                if (lockDecision === false) {
                    continue;
                }
                if (newDict.has('Subtype') && xref._checkSubTypeSingle(newDict, hasPermission, permission,
                                                                       newestEntry.revisionId ? newestEntry.revisionId : 0, xref)) {
                    continue;
                }
                if (newDict.has('Type')) {
                    const t: _PdfName = newDict.get('Type');
                    const tName: string = t instanceof _PdfName ? t.name : undefined;
                    if (tName === 'Page' && typeof xref._verifyPageIsModify === 'function') {
                        if (xref._verifyPageIsModify(oldDict, newDict, hasPermission, permission)) {
                            return true;
                        }
                        continue;
                    }
                    if (tName === 'Annot' && typeof xref._checkSubType === 'function') {
                        const subtypeObj: any = newDict.get('Subtype'); // eslint-disable-line
                        const subtypeName: any = subtypeObj instanceof _PdfName ? subtypeObj.name : (typeof subtypeObj === 'string' ? subtypeObj : undefined); // eslint-disable-line
                        if (subtypeName === 'Widget') {
                            if (hasPermission && (permission === PdfCertificationFlag.allowFormFill ||
                                permission === PdfCertificationFlag.allowComments)) {
                                continue;
                            }
                            if (signatureIsLocked) {
                                continue;
                            }
                            try {
                                const parentRef: any = newDict.getRaw('Parent') || newDict.getRaw('F') || newDict.getRaw('T'); // eslint-disable-line
                                if (parentRef instanceof _PdfReference) {
                                    if (appendedFieldObjNums.has(parentRef.objectNumber)) {
                                        continue;
                                    }
                                } else if (parentRef && typeof parentRef === 'object') {
                                    try {
                                        const oid: number = (parentRef as any).objId; // eslint-disable-line
                                        if (oid) {
                                            const m: RegExpMatchArray = String(oid).match(/(\d+)/);
                                            if (m && appendedFieldObjNums.has(Number(m[1]))) {
                                                continue;
                                            }
                                        }
                                    } catch {
                                        /* Ignore */
                                    }
                                }
                            } catch {
                                /* Ignore */
                            }
                            return true;
                        }
                        const oldEntry: number = signedEntry.revisionId ? signedEntry.revisionId : 0;
                        const newEntry: number = newestEntry.revisionId ? newestEntry.revisionId : 0;
                        const ok: boolean = xref._checkSubType(newDict, oldDict, hasPermission, permission, oldEntry, newEntry);
                        if (ok) {
                            continue;
                        }
                        return true;
                    }
                }
                const hasNoType: boolean = !newDict.has('Type') || !newDict.get('Type');
                const hasNoSubtype: boolean = !newDict.has('Subtype') || !newDict.get('Subtype');
                if (skippedObjects.has(objNum) || (newDict && newDict.has && newDict.has('Fields'))) {
                    const oldFieldsRaw: boolean = oldDict && oldDict.has('Fields') ? oldDict.getRaw('Fields') : null;
                    const newFieldsRaw: boolean = newDict && newDict.has('Fields') ? newDict.getRaw('Fields') : null;
                    if (Array.isArray(oldFieldsRaw) && Array.isArray(newFieldsRaw)) {
                        if (newFieldsRaw.length < oldFieldsRaw.length) {
                            return true;
                        }
                        if (newFieldsRaw.length >= oldFieldsRaw.length) {
                            const oldPresent: any = oldFieldsRaw.every((oref: any) => { // eslint-disable-line
                                if (oref instanceof _PdfReference) {
                                    return newFieldsRaw.some((nref: any) => nref instanceof _PdfReference && nref.objectNumber === oref.objectNumber); // eslint-disable-line
                                }
                                return newFieldsRaw.some((nref: any) => String(nref) === String(oref)); // eslint-disable-line
                            });
                            if (oldPresent) {
                                const added: any = newFieldsRaw.filter((nref: any) => !oldFieldsRaw.some((oref: any) => { // eslint-disable-line
                                    if (oref instanceof _PdfReference && nref instanceof _PdfReference) {
                                        return oref.objectNumber === nref.objectNumber;
                                    }
                                    return String(oref) === String(nref);
                                }));
                                if (added.length > 0) {
                                    for (const a of added) {
                                        if (!(a instanceof _PdfReference)) {
                                            return true;
                                        }
                                        const fd: any = xref._fetchReferenceInRevision(a, newestEntry.revisionId ? newestEntry.revisionId : 0); // eslint-disable-line
                                        const fdict: _PdfDictionary = xref._asDictionary(fd);
                                        if (!fdict) {
                                            return true;
                                        }
                                        let ftName: string;
                                        if (fdict.has('FT')) {
                                            const ft: any = fdict.get('FT'); // eslint-disable-line
                                            ftName = ft instanceof _PdfName ? ft.name : (typeof ft === 'string' ? ft : undefined);
                                        }
                                        if (!ftName && fdict.has('V')) {
                                            const vRaw: any = fdict.getRaw('V'); // eslint-disable-line
                                            const vObj: any = vRaw instanceof _PdfReference ? xref._fetchReferenceInRevision(vRaw, newestEntry.revisionId ?  newestEntry.revisionId : 0) : vRaw; // eslint-disable-line
                                            const vDict: any = xref._asDictionary(vObj); // eslint-disable-line
                                            if (vDict) {
                                                const typeObj: any = vDict.has('Type') ? vDict.get('Type') : undefined; // eslint-disable-line
                                                const typeName: any = typeObj instanceof _PdfName ? typeObj.name : (typeof typeObj === 'string' ? typeObj : undefined); // eslint-disable-line
                                                if (typeName === 'Sig' || vDict.has('ByteRange') || vDict.has('Contents')) {
                                                    ftName = 'Sig';
                                                }
                                            }
                                        }
                                        if (ftName !== 'Sig') {
                                            return true;
                                        }
                                        appendedFieldObjNums.add(a.objectNumber);
                                    }
                                    continue;
                                }
                            }
                        }
                    }
                }
                if (hasNoType && hasNoSubtype && allowsFormFillOrComments) {
                    const isAcroForm: any = skipObjects.has(objNum); // eslint-disable-line
                    if (isAcroForm && oldDict) {
                        const oldFieldsRaw: _PdfReference = oldDict.has('Fields') ? oldDict.getRaw('Fields') : null;
                        const newFieldsRaw: _PdfReference = newDict.has('Fields') ? newDict.getRaw('Fields') : null;
                        if (Array.isArray(oldFieldsRaw) && Array.isArray(newFieldsRaw)) {
                            if (newFieldsRaw.length < oldFieldsRaw.length) {
                                return true;
                            }
                        }
                    }
                    continue;
                }
                if (skipObjects.has(objNum) && hasNoType && hasNoSubtype && !newDict.has('Fields') && !newDict.has('FT')) {
                    continue;
                }
                const changed: any = xref._compareObjects(oldDict, newDict, // eslint-disable-line
                                                          skippedObjects, objNum, hasPermission, permission,
                                                          signedEntry.revisionId ? signedEntry.revisionId : 0,
                                                          newestEntry.revisionId ? newestEntry.revisionId : 0);
                if (changed) {
                    if (hasPermission && allowsFormFillOrComments) {
                        const t: any = newDict.has('Type') ? newDict.get('Type') : undefined; // eslint-disable-line
                        const tName: any = t instanceof _PdfName ? t.name : undefined; // eslint-disable-line
                        if (tName === 'Annot') {
                            const subtypeObj: _PdfName = newDict.get('Subtype');
                            const subtypeName: string = subtypeObj instanceof _PdfName ? subtypeObj.name : subtypeObj;
                            if (subtypeName === 'Widget') {
                                continue;
                            }
                        }
                        if (!tName && hasNoType && hasNoSubtype) {
                            continue;
                        }
                    }
                    if (signatureIsLocked) {
                        const t: any = newDict.has('Type') ? newDict.get('Type') : undefined; // eslint-disable-line
                        const tName: any = t instanceof _PdfName ? t.name : undefined; // eslint-disable-line
                        if (tName === 'Annot') {
                            const subtypeObj: any = newDict.get('Subtype'); // eslint-disable-line
                            const subtypeName: string = subtypeObj instanceof _PdfName ? subtypeObj.name : (typeof subtypeObj === 'string' ? subtypeObj : undefined);
                            if (subtypeName === 'Widget') {
                                continue;
                            }
                        }
                        if (hasNoType && hasNoSubtype && newDict.has('FT')) {
                            continue;
                        }
                    }
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Checks whether a position falls within the signed byte ranges.
     *
     * @param {number} pos The physical offset to test.
     * @param {number} s1 Start of first range.
     * @param {number} l1 Length of first range.
     * @param {number} s2 Start of second range.
     * @param {number} l2 Length of second range.
     * @returns {boolean} true if pos is within either range.
     * @private
     */
    _isInByteRange(pos: number, s1: number, l1: number, s2: number, l2: number): boolean {
        if (!Number.isFinite(pos)) {
            return false;
        }
        return (pos >= s1 && pos <= (s1 + l1)) ||
            (pos >= s2 && pos <= (s2 + l2));
    }
    /**
     * Adds the object number of a top-level reference to the skip-objects set.
     *
     * @param {any} raw The raw value from a dictionary entry.
     * @param {Set<number>} skipObjects The set to add the object number into.
     * @returns {void}
     * @private
     */
    _addTopRefIfAny(raw: any, skipObjects: Set<number>): void { // eslint-disable-line
        if (raw instanceof _PdfReference) {
            skipObjects.add(raw.objectNumber);
        }
    }
    /**
     * Recursively walks all sub-references reachable from obj in a given revision
     * and records their object numbers in skippedObjects.
     *
     * @param {any} obj The object to walk.
     * @param {number} revId The revision id to use when fetching references.
     * @param {_PdfCrossReference} xref The cross-reference table.
     * @param {Set<number>} skippedObjects The set used to track already-visited objects.
     * @param {number} depth Current recursion depth (default 0).
     * @returns {void}
     * @private
     */
    _readAllSubRefs(obj: any, revId: number, xref: _PdfCrossReference, skippedObjects: Set<number>, depth: number = 0): void { // eslint-disable-line
        if (!obj) {
            return;
        }
        if (depth > 50) {
            return;
        }
        if (obj instanceof _PdfReference) {
            const n: number = obj.objectNumber;
            if (skippedObjects.has(n)) {
                return;
            }
            skippedObjects.add(n);
            const fetched: any = xref._fetchReferenceInRevision(obj, revId); // eslint-disable-line
            this._readAllSubRefs(fetched, revId, xref, skippedObjects, depth + 1);
            return;
        }
        if (obj instanceof _PdfBaseStream) {
            this._readAllSubRefs(obj.dictionary, revId, xref, skippedObjects, depth + 1);
            return;
        }
        if (obj instanceof _PdfDictionary) {
            const keys: string[] = [];
            obj.forEach((k: string) => keys.push(k));
            for (const k of keys) {
                if (k === 'P' || k === 'Parent') {
                    continue;
                }
                const val: any = obj.get(k); // eslint-disable-line
                this._readAllSubRefs(val, revId, xref, skippedObjects, depth + 1);
            }
            return;
        }
        if (Array.isArray(obj)) {
            for (const it of obj) {
                this._readAllSubRefs(it, revId, xref, skippedObjects, depth + 1);
            }
        }
    }
    /**
     * Recursively collects all objects reachable from obj and records their
     * object numbers in laterSignatureObjects, using the live xref for fetching.
     *
     * @param {any} obj The object to walk.
     * @param {_PdfCrossReference} xref The cross-reference table.
     * @param {Set<number>} laterSignatureObjects The set used to track collected objects.
     * @param {number} depth Current recursion depth (default 0).
     * @returns {void}
     * @private
     */
    _collectLaterSignatureObjects(obj: any, xref: _PdfCrossReference, laterSignatureObjects: Set<number>, depth: number = 0): void { // eslint-disable-line
        if (!obj || depth > 50) {
            return;
        }
        if (obj instanceof _PdfReference) {
            const n: number = obj.objectNumber;
            const alreadyVisited: any = laterSignatureObjects.has(n); // eslint-disable-line
            if (!alreadyVisited) {
                laterSignatureObjects.add(n);
            }
            const fetched: any = xref._fetch(obj); // eslint-disable-line
            if (!alreadyVisited || fetched) {
                this._collectLaterSignatureObjects(fetched, xref, laterSignatureObjects, depth + 1);
            }
            return;
        }
        if (obj instanceof _PdfBaseStream) {
            this._collectLaterSignatureObjects(obj.dictionary, xref, laterSignatureObjects, depth);
            return;
        }
        if (obj instanceof _PdfDictionary) {
            const keys: string[] = [];
            obj.forEach((k: string) => keys.push(k));
            for (const k of keys) {
                if (k === 'P' || k === 'Parent') {
                    continue;
                }
                const raw: any = obj.getRaw(k); // eslint-disable-line
                this._collectLaterSignatureObjects(raw, xref, laterSignatureObjects, depth + 1);
            }
            return;
        }
        if (Array.isArray(obj)) {
            for (const item of obj) {
                this._collectLaterSignatureObjects(item, xref, laterSignatureObjects, depth + 1);
            }
        }
    }
    /**
     * Fetches the PDF dictionary for a specific object entry from the cross-reference table.
     *
     * @param {number} objNum The object number.
     * @param {_PdfObjectInformation} entry The specific entry in the object history.
     * @param {_PdfCrossReference} xref The cross-reference table.
     * @returns {_PdfDictionary} The dictionary, or undefined if the entry is free or absent.
     * @private
     */
    _fetchDictAtEntry(objNum: number, entry: _PdfObjectInformation, xref: _PdfCrossReference): _PdfDictionary {
        if (!entry || entry.free) {
            return undefined;
        }
        const ref: any = _PdfReference.get(objNum, entry.gen || 0); // eslint-disable-line
        const obj: any = xref._fetchAtEntry(ref, entry, false); // eslint-disable-line
        return xref._asDictionary(obj);
    }
    /**
     * Returns true if the given dictionary represents a signature or timestamp object.
     *
     * @param {_PdfDictionary} dict The dictionary to test.
     * @returns {boolean} true if the dictionary has Type/Subtype/FT of 'Sig', 'DocTimeStamp', or 'Timestamp'.
     * @private
     */
    _isSigOrTimestampDict(dict: _PdfDictionary): boolean {
        const type: _PdfName = dict.has('Type') ? dict.get('Type') : undefined;
        const subtype: _PdfName = dict.has('Subtype') ? dict.get('Subtype') : undefined;
        const ft: any = dict.has('FT') ? dict.get('FT') : undefined; // eslint-disable-line
        const tName: string = type instanceof _PdfName ? type.name : undefined;
        const sName: string = subtype instanceof _PdfName ? subtype.name : undefined;
        const ftName: string = ft instanceof _PdfName ? ft.name : undefined;
        return tName === 'Sig' || sName === 'Sig' || ftName === 'Sig' || tName === 'DocTimeStamp' || tName === 'Timestamp';
    }
    /**
     * Dereferences a value within a specific revision.
     *
     * @param {any} val The value to dereference.
     * @param {number} revId The revision id.
     * @param {_PdfCrossReference} xref The cross-reference table.
     * @returns {any} The dereferenced object or the original value.
     * @private
     */
    _derefInRevision(val: any, revId: number, xref: _PdfCrossReference): any { // eslint-disable-line
        if (val instanceof _PdfReference) {
            return xref._fetchReferenceInRevision(val, revId);
        }
        return val;
    }
    /**
     * Extracts the string name from a _PdfName or a plain string value.
     *
     * @param {any} val The value to extract the name from.
     * @returns {string} The name string, or undefined if not applicable.
     * @private
     */
    _nameValue(val: any): string { // eslint-disable-line
        if (val instanceof _PdfName) {
            return val.name;
        }
        if (typeof val === 'string') {
            return val;
        }
        return undefined;
    }
    /**
     * Evaluates signature field lock rules and reference transform actions to determine
     * whether changes to the dictionary are permitted.
     *
     * @param {_PdfDictionary} dictionary The field or form dictionary to examine.
     * @param {number} revId The revision id used for dereferencing.
     * @param {_PdfCrossReference} xref The cross-reference table.
     * @returns {boolean | null} true if changes are forbidden, false if allowed, null if undetermined.
     * @private
     */
    _evaluateLockRules(dictionary: _PdfDictionary, revId: number, xref: _PdfCrossReference): boolean {
        let hasInclude: boolean = false;
        let fieldDictArr: any[]; // eslint-disable-line
        const lockObj: any = this._derefInRevision(dictionary.get('Lock'), revId, xref); // eslint-disable-line
        const lockDict: _PdfDictionary = lockObj instanceof _PdfDictionary ? lockObj : undefined;
        if (lockDict && lockDict.has('Fields')) {
            const fieldsObj: any = this._derefInRevision(lockDict.get('Fields'), revId, xref); // eslint-disable-line
            if (Array.isArray(fieldsObj)) {
                fieldDictArr = fieldsObj;
                if (fieldDictArr.length > 0) {
                    hasInclude = true;
                }
            }
        }
        if (typeof fieldDictArr === 'undefined' || fieldDictArr === null) {
            if (dictionary.has('V')) {
                const vObj: any = this._derefInRevision(dictionary.get('V'), revId, xref); // eslint-disable-line
                const vDict: any = vObj instanceof _PdfDictionary ? vObj : undefined; // eslint-disable-line
                if (vDict && vDict.has('Reference')) {
                    const refArrObj: any = this._derefInRevision(vDict.get('Reference'), revId, xref); // eslint-disable-line
                    if (Array.isArray(refArrObj) && refArrObj.length > 0) {
                        for (const r of refArrObj) {
                            const refDictObj: any = this._derefInRevision(r, revId, xref); // eslint-disable-line
                            const refDict: _PdfDictionary = refDictObj instanceof _PdfDictionary ? refDictObj : undefined;
                            if (!refDict || !refDict.has('TransformParams')) {
                                continue;
                            }
                            const tpObj: any = this._derefInRevision(refDict.get('TransformParams'), revId, xref); // eslint-disable-line
                            const tpDict: _PdfDictionary = tpObj instanceof _PdfDictionary ? tpObj : undefined;
                            if (!tpDict || !tpDict.has('Action')) {
                                continue;
                            }
                            const actionObj: any = this._derefInRevision(tpDict.get('Action'), revId, xref); // eslint-disable-line
                            const action: any = this._nameValue(actionObj); // eslint-disable-line
                            if (action === 'Include' && !hasInclude) {
                                return true;
                            }
                            if (action === 'Include' && hasInclude) {
                                return false;
                            }
                            if (action === 'All') {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    /**
     * Returns true if the given object is a Long-Term Validation (LTV) data object —
     * an array, stream, or dictionary whose keys are exclusively OCSP/CRL/VRI entries.
     *
     * @param {any} obj The object to test.
     * @returns {boolean} true if the object is an LTV object; otherwise, false.
     * @private
     */
    _isLtvObject(obj: any): boolean { // eslint-disable-line
        if (Array.isArray(obj)) {
            return true;
        }
        if (obj instanceof _PdfBaseStream) {
            return true;
        }
        if (obj instanceof _PdfDictionary) {
            const keys: string[] = [];
            obj.forEach((k: string) => keys.push(k));
            return keys.every((k: string) =>
                k === 'OCSPs' ||
                k === 'CRLs' ||
                k === 'VRI'
            );
        }
        return false;
    }
    /**
     * Validates the revocation status of the signing certificate using the specified
     * revocation validation method and available OCSP or CRL data.
     *
     * @param {RevocationType} revocationValidationType The revocation validation method to use.
     * @param {Uint8Array} [ocsp] The external OCSP response data used when embedded OCSP information is unavailable.
     * @param {Uint8Array} [crl] The external CRL data used when embedded CRL information is unavailable.
     * @returns {RevocationResult} The revocation validation result containing the OCSP status and CRL revocation information.
     * @private
     */
    _validateRevocationCore(revocationValidationType: RevocationType, ocsp?: Uint8Array, crl?: Uint8Array): RevocationResult {
        const result: RevocationResult = { isRevokedCRL: false, ocspRevocationStatus: RevocationStatus.none };
        if (revocationValidationType === RevocationType.none) {
            return result;
        }
        const certificates: any[] = this._cmsSigner ? this._cmsSigner._certificates : []; // eslint-disable-line
        if (!certificates || certificates.length === 0) {
            return result;
        }
        const signerCert: any = certificates[0]; // eslint-disable-line
        const hasOcsp: boolean = revocationValidationType === RevocationType.ocsp ||
            revocationValidationType === RevocationType.ocspAndCrl;
        const hasCrl: boolean = revocationValidationType === RevocationType.crl ||
            revocationValidationType === RevocationType.ocspAndCrl;
        if (hasOcsp) {
            let ocspData: Uint8Array = this._extractOcspFromDss();
            if (!ocspData && ocsp && ocsp.length > 0) {
                ocspData = ocsp;
            }
            if (ocspData) {
                result.ocspRevocationStatus = this._signature._validateLtvOcsp(ocspData);
            }
        }
        if (hasCrl) {
            let crlData: Uint8Array = this._extractCrlFromDss();
            if (!crlData && crl && crl.length > 0) {
                crlData = crl;
            }
            if (crlData) {
                result.isRevokedCRL = this._validateLtvCrl(crlData, signerCert);
            }
        }
        return result;
    }
    /**
     * Extracts thisUpdate and nextUpdate times from a raw CRL byte array.
     *
     * @private
     * @param {Uint8Array} crlBytes Raw CRL DER bytes.
     * @returns {Object} CRL validity information, or null if unavailable.
     */
    _extractCrlTimes(crlBytes: Uint8Array): { thisUpdate: Date; nextUpdate: Date } {
        try {
            const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            element._fromBytes(crlBytes);
            const tbsCertList: any = element._getComponents()[0]; // eslint-disable-line
            if (!tbsCertList) {
                return null;
            }
            const tbsChildren: any[] = tbsCertList._getComponents() || []; // eslint-disable-line
            const elemToDate: any = (el: any): Date => { // eslint-disable-line
                if (!el) {
                    return undefined;
                }
                const tagNo: number = typeof el._getTagNumber === 'function' ? el._getTagNumber() : -1;
                if (tagNo !== 23 && tagNo !== 24) {
                    return undefined;
                }
                const val: any = el._getValue(); // eslint-disable-line
                let str: string = '';
                if (typeof val === 'string') {
                    str = val.trim();
                } else if (val instanceof Uint8Array) {
                    for (let i: number = 0; i < val.length; i++) {
                        str += String.fromCharCode(val[<number>i]);
                    }
                    str = str.trim();
                }
                if (!str) {
                    return undefined;
                }
                let m: any = str.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:\.\d+)?Z$/); // eslint-disable-line
                if (m) {
                    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
                }
                m = str.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/);
                if (m) {
                    let yr: number = parseInt(m[1], 10);
                    yr += yr < 50 ? 2000 : 1900;
                    return new Date(Date.UTC(yr, +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
                }
                return undefined;
            };
            const timeElements: any[] = tbsChildren.filter((child: any) => { // eslint-disable-line
                if (!child || typeof child._getTagNumber !== 'function') {
                    return false;
                }
                const tag: number = child._getTagNumber();
                return tag === 23 || tag === 24;
            });
            const thisUpdate: Date = elemToDate(timeElements[0]);
            const nextUpdate: Date = elemToDate(timeElements[1]);
            return { thisUpdate, nextUpdate };
        } catch {
            return null;
        }
    }
    /**
     * Returns the first element from a PDF array-like object.
     *
     * @param {any} arr The array-like object.
     * @returns {any} The first element if available; otherwise, null.
     * @private
     */
    private _getFirstArrayElement(arr: any): any { // eslint-disable-line
        if (!arr) {
            return null;
        }
        if (typeof arr.get === 'function') {
            return arr.get(0);
        }
        if (Array.isArray(arr) && arr.length > 0) {
            return arr[0];
        }
        return null;
    }
    /**
     * Gets the number of elements in a PDF array-like object.
     *
     * @param {any} arr The array-like object.
     * @returns {number} The length of the array-like object.
     * @private
     */
    private _getArrayLength(arr: any): number { // eslint-disable-line
        if (!arr) {
            return 0;
        }
        if (typeof arr.size === 'function') {
            return arr.size();
        }
        if (typeof arr.length === 'number') {
            return arr.length;
        }
        return 0;
    }
    /**
     * Extracts OCSP response bytes from DSS dictionary.
     *
     * @private
     * @returns {Uint8Array} OCSP response bytes or null
     */
    private _extractOcspFromDss(): Uint8Array {
        try {
            const dssDictionary: _PdfDictionary = this._getDssDictionary();
            if (dssDictionary && dssDictionary.has('OCSPs')) {
                const ocspsArray: any = dssDictionary.get('OCSPs'); // eslint-disable-line
                if (this._getArrayLength(ocspsArray) > 0) {
                    const ocspObject: any = this._getFirstArrayElement(ocspsArray); // eslint-disable-line
                    const ocspStream: any = // eslint-disable-line
                        ocspObject instanceof _PdfReference
                            ? this._crossReference._fetch(ocspObject)
                            : ocspObject;
                    if (ocspStream && typeof ocspStream.getBytes === 'function') {
                        return ocspStream.getBytes();
                    }
                }
            }
            const vriDict: _PdfDictionary = this._getVriDictionary();
            if (vriDict) {
                const dictAny: any = vriDict; // eslint-disable-line
                const keys: string[] = dictAny._map ? Object.keys(dictAny._map) : [];
                for (const key of keys) {
                    const vriEntry: any = dictAny._map[key]; // eslint-disable-line
                    if (!vriEntry || typeof vriEntry.has !== 'function') {
                        continue;
                    }
                    if (!vriEntry.has('OCSP')) {
                        continue;
                    }
                    const vriOcsp: any = vriEntry.get('OCSP'); // eslint-disable-line
                    if (this._getArrayLength(vriOcsp) > 0) {
                        const ocspObject: any = this._getFirstArrayElement(vriOcsp); // eslint-disable-line
                        const ocspStream: any = // eslint-disable-line
                            ocspObject instanceof _PdfReference
                                ? this._crossReference._fetch(ocspObject)
                                : ocspObject;
                        if (ocspStream && typeof ocspStream.getBytes === 'function') {
                            return ocspStream.getBytes();
                        }
                    }
                }
            }
        } catch (e) {
            return null;
        }
        return null;
    }
    /**
     * Resolves a PDF reference object and returns the corresponding PDF object.
     *
     * @param {any} obj The object to resolve.
     * @returns {any} The resolved PDF object; otherwise, the original object or null if the object is not available.
     * @private
     */
    private _resolvePdfObject(obj: any): any { // eslint-disable-line
        if (!obj) {
            return null;
        }
        if (typeof obj.objectNumber === 'number' && this._crossReference &&
            typeof this._crossReference._fetch === 'function') {
            return this._crossReference._fetch(obj);
        }
        return obj;
    }
    /**
     * Extracts CRL bytes from DSS dictionary.
     *
     * @private
     * @returns {Uint8Array} CRL bytes or null
     */
    _extractCrlFromDss(): Uint8Array {
        try {
            const dssDictionary: _PdfDictionary = this._getDssDictionary();
            if (dssDictionary && dssDictionary.has('CRLs')) {
                const crlsArray: any = dssDictionary.get('CRLs'); // eslint-disable-line
                if (this._getArrayLength(crlsArray) > 0) {
                    const crlObject: any = this._getFirstArrayElement(crlsArray); // eslint-disable-line
                    const crlStream: any = this._resolvePdfObject(crlObject); // eslint-disable-line
                    if (crlStream && typeof crlStream.getBytes === 'function') {
                        return crlStream.getBytes();
                    }
                }
            }
            const vriDict: _PdfDictionary = this._getVriDictionary();
            if (vriDict) {
                const dictAny: any = vriDict; // eslint-disable-line
                const entries: string[] = dictAny._map
                    ? Object.keys(dictAny._map)
                    : [];
                for (const key of entries) {
                    const vriEntry: any = dictAny._map[key]; // eslint-disable-line
                    if (!vriEntry || typeof vriEntry.has !== 'function' ||
                        !vriEntry.has('CRL')) {
                        continue;
                    }
                    const vriCrl: any = vriEntry.get('CRL'); // eslint-disable-line
                    if (this._getArrayLength(vriCrl) > 0) {
                        const crlObject: any = this._getFirstArrayElement(vriCrl); // eslint-disable-line
                        const crlStream: any = this._resolvePdfObject(crlObject); // eslint-disable-line
                        if (crlStream && typeof crlStream.getBytes === 'function') {
                            return crlStream.getBytes();
                        }
                    }
                }
            }
        } catch (error) {
            return null;
        }
        return null;
    }
    /**
     * Determines whether the signature is a document timestamp signature.
     *
     * @returns {boolean} true if the signature uses the ETSI.RFC3161 document timestamp format; otherwise, false.
     * @private
     */
    _isDocumentTimestamp(): boolean {
        return this._signature &&
            this._signature._signatureDictionary._dictionary.get('SubFilter').name === 'ETSI.RFC3161';
    }
    /**
     * Extracts timestamp token from PKCS#7 unsigned attributes.
     *
     * @private
     * @returns {Uint8Array} Raw timestamp token bytes or null if not found
     */
    _extractTimestampToken(): Uint8Array {
        if (!this._cmsSigner) {
            return null;
        }
        if (this._cmsSigner._hasTimeStamp && this._cmsSigner._timeStampTokenBytes) {
            return this._cmsSigner._timeStampTokenBytes;
        }
        return null;
    }
    /**
     * Extracts timestamp generation time from parsed TSTInfo.
     *
     * @private
     * @param {object} tstInfo Parsed timestamp info structure.
     * @param {Date} tstInfo.genTime Timestamp generation time.
     * @returns {Date} Timestamp generation time in UTC.
     */
    _extractTimestampTime(tstInfo: { genTime: Date }): Date {
        if (!tstInfo || !tstInfo.genTime) {
            throw new Error('TSTInfo does not contain genTime');
        }
        return tstInfo.genTime;
    }
    /**
     * Determines the validation time to use for certificate validity checks.
     * Priority: timestamp time > signed time > current time.
     *
     * @private
     * @param {TimestampInformation} timestampInfo Timestamp information if available
     * @param {Date} signedDate Signed date from signature dictionary
     * @returns {Date} Validation time to use for certificate checks
     */
    _determineValidationTime(timestampInfo: TimestampInformation, signedDate: Date): Date {
        if (timestampInfo && timestampInfo.isValid && timestampInfo.timestampTime &&
            timestampInfo.timestampTime instanceof Date && timestampInfo.timestampTime.getTime() > 0) {
            return timestampInfo.timestampTime;
        }
        if (signedDate && signedDate instanceof Date) {
            return signedDate;
        }
        return new Date();
    }
    /**
     * Detects and flags embedded LTV data in the PDF document.
     *
     * @private
     * @param {LtvVerificationInformation} ltvInfo LTV information object to populate
     * @returns {void} Nothing
     */
    _detectLtvData(ltvInfo: LtvVerificationInformation): void {
        const arrayHasItems = (arr: any): boolean => { // eslint-disable-line
            if (!arr) {
                return false;
            }
            if (typeof arr.size === 'function') {
                return arr.size() > 0;
            }
            if (typeof arr.length === 'number') {
                return arr.length > 0;
            }
            return false;
        };
        try {
            const dssDictionary: _PdfDictionary = this._getDssDictionary();
            if (!dssDictionary) {
                return;
            }
            let hasOcsp: boolean = false;
            let hasCrl: boolean = false;
            if (dssDictionary.has('OCSPs')) {
                const ocspsRaw: any = dssDictionary.get('OCSPs'); // eslint-disable-line
                if (arrayHasItems(ocspsRaw)) {
                    hasOcsp = true;
                }
            }
            if (dssDictionary.has('CRLs')) {
                const crlsRaw: any = dssDictionary.get('CRLs'); // eslint-disable-line
                if (arrayHasItems(crlsRaw)) {
                    hasCrl = true;
                }
            }
            if (dssDictionary.has('VRI')) {
                const vriDict: _PdfDictionary = this._getVriDictionary();
                if (vriDict) {
                    const dictAny: any = vriDict; // eslint-disable-line
                    const keys: string[] = dictAny._map ? Object.keys(dictAny._map) : [];
                    for (const key of keys) {
                        const vriEntry: any = dictAny._map[key]; // eslint-disable-line
                        if (!vriEntry || typeof vriEntry.has !== 'function') {
                            continue;
                        }
                        if (vriEntry.has('OCSP')) {
                            const vriOcsp: any = vriEntry.get('OCSP'); // eslint-disable-line
                            if (arrayHasItems(vriOcsp)) {
                                hasOcsp = true;
                            }
                        }
                        if (vriEntry.has('CRL')) {
                            const vriCrl: any = vriEntry.get('CRL'); // eslint-disable-line
                            if (arrayHasItems(vriCrl)) {
                                hasCrl = true;
                            }
                        }
                    }
                }
            }
            ltvInfo.isOcspEmbedded = hasOcsp;
            ltvInfo.isCrlEmbedded = hasCrl;
            ltvInfo.isLtvEmbedded = hasOcsp || hasCrl;
        } catch {
            ltvInfo.isOcspEmbedded = false;
            ltvInfo.isCrlEmbedded = false;
            ltvInfo.isLtvEmbedded = false;
        }
    }
    /**
     * Retrieves the DSS (Document Security Store) dictionary from PDF catalog.
     *
     * @private
     * @returns {_PdfDictionary} DSS dictionary or null if not present
     */
    _getDssDictionary(): _PdfDictionary {
        try {
            const xref: _PdfCrossReference = this._crossReference || (this._page ? this._page._crossReference : null);
            if (!xref) {
                return null;
            }
            const catalog: _PdfDictionary = xref._root;
            if (!catalog || !catalog.has('DSS')) {
                return null;
            }
            const dssRaw: any = catalog.get('DSS'); // eslint-disable-line
            if (dssRaw instanceof _PdfDictionary) {
                return dssRaw;
            }
            return null;
        } catch {
            return null;
        }
    }
    /**
     * Retrieves the VRI (Validation-Related Information) dictionary from DSS.
     *
     * @private
     * @returns {_PdfDictionary} VRI dictionary or null if not present
     */
    _getVriDictionary(): _PdfDictionary {
        try {
            const dssDictionary: _PdfDictionary = this._getDssDictionary();
            if (!dssDictionary || !dssDictionary.has('VRI')) {
                return null;
            }
            const vriRaw: any = dssDictionary.get('VRI'); // eslint-disable-line
            if (vriRaw instanceof _PdfDictionary) {
                return vriRaw;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
    /**
     * Validates embedded CRL data from DSS dictionary.
     *
     * @private
     * @param {Uint8Array} crlBytes CRL data bytes
     * @param {any} cert Certificate to check
     * @returns {boolean} True if certificate is revoked in CRL
     */
    _validateLtvCrl(crlBytes: Uint8Array, cert: any): boolean { // eslint-disable-line
        try {
            return this._cmsSigner._checkCertificateSerialInCrl(crlBytes, cert._structure._toBeSignedCertificate._serialNumber.toString());
        } catch (error) {
            return false;
        }
    }
    /**
     * Converts an RSA public key parameter into an ICipherParam instance used for
     * cryptographic signature verification.
     *
     * @param {_PdfRonCipherParameter} pub The RSA public key parameter to convert.
     * @returns {_ICipherParam} The converted cipher parameter instance.
     * @throws {Error} Thrown when the RSA public key parameter does not contain a valid modulus or exponent.
     * @private
     */
    _toICipherParam(pub: _PdfRonCipherParameter): _ICipherParam {
        const anyPub: any = pub as any; // eslint-disable-line
        if (typeof anyPub._getHashCode === 'function' && typeof anyPub._equals === 'function') {
            return anyPub as _ICipherParam;
        }
        if (!(pub._modulus instanceof Uint8Array) || !(pub._exponent instanceof Uint8Array)) {
            throw new Error('Invalid RSA public key parameter: missing modulus/exponent.');
        }
        const keyParam: _PdfRsaPublicKeyParam  =  new _PdfRsaPublicKeyParam(pub._modulus, pub._exponent);
        if (!pub._isPrivate) {
            keyParam._isPrivate = false;
            keyParam._enableCertificationVerification = true;
        }
        return keyParam;
    }
}
/**
 * Represents a parsed default appearance (`DA`) definition, capturing font name,
 * font size, and RGB color to be used for text rendering.
 *
 * @private
 */
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
