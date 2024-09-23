import { _PdfCrossReference } from './../pdf-cross-reference';
import { PdfPage, PdfDestination } from './../pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from './../pdf-primitives';
import { PdfFormFieldVisibility, _PdfCheckFieldState, PdfAnnotationFlag, PdfBorderStyle, PdfHighlightMode, PdfLineCaptionType, PdfLineEndingStyle, PdfLineIntent, PdfRotationAngle, PdfTextAlignment , PdfBorderEffectStyle, PdfMeasurementUnit, _PdfGraphicsUnit, PdfCircleMeasurementType, PdfRubberStampAnnotationIcon, PdfCheckBoxStyle, PdfTextMarkupAnnotationType, PdfPopupIcon, PdfAnnotationState, PdfAnnotationStateModel, PdfAttachmentIcon, PdfAnnotationIntent, _PdfAnnotationType, PdfDestinationMode, PdfBlendMode, PdfDashStyle, PdfLineCap, PathPointType } from './../enumerator';
import { _checkField, _removeDuplicateReference, _updateVisibility, _getPageIndex, _checkComment, _checkReview, _mapAnnotationStateModel, _mapAnnotationState, _decode, _setMatrix, _convertToColor, _findPage, _getItemValue, _areNotEqual, _calculateBounds, _parseColor, _mapHighlightMode, _reverseMapHighlightMode, _getUpdatedBounds, _mapBorderStyle, _mapLineEndingStyle, _reverseMapEndingStyle, _toRectangle, _mapBorderEffectStyle, _getStateTemplate, _mapMeasurementUnit, _mapGraphicsUnit, _stringToStyle, _styleToString, _mapMarkupAnnotationType, _reverseMarkupAnnotationType, _reverseMapAnnotationState, _reverseMapAnnotationStateModel, _mapPopupIcon, _mapRubberStampIcon, _mapAttachmentIcon, _mapAnnotationIntent, _reverseMapPdfFontStyle, _fromRectangle, _getNewGuidString, _getFontStyle, _mapFont, _checkInkPoints, _updateBounds, _stringToBytes } from './../utils';
import { PdfField, PdfRadioButtonListField, _PdfDefaultAppearance, PdfListBoxField, PdfCheckBoxField, PdfComboBoxField } from './../form/field';
import { PdfTemplate } from './../graphics/pdf-template';
import { _TextRenderingMode, PdfBrush, PdfGraphics, PdfPen, PdfGraphicsState, _PdfTransformationMatrix, _PdfUnitConvertor } from './../graphics/pdf-graphics';
import { PdfPath } from './../graphics/pdf-path';
import { PdfFontFamily, PdfStandardFont, PdfFont, PdfFontStyle, PdfTrueTypeFont } from './../fonts/pdf-standard-font';
import { PdfStringFormat, PdfVerticalAlignment } from './../fonts/pdf-string-format';
import { _PdfBaseStream, _PdfStream } from './../base-stream';
import { PdfDocument, PdfMargins } from './../pdf-document';
import { PdfAppearance } from './pdf-appearance';
import { PdfPopupAnnotationCollection } from './annotation-collection';
import { _PdfPaddings } from './pdf-paddings';
import { PdfForm } from '../form';
import { _PdfCatalog } from '../pdf-catalog';
/**
 * Represents the base class for annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfAnnotation = page.annotations.at(0);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export abstract class PdfAnnotation {
    _isImported: boolean = false;
    _dictionary: _PdfDictionary;
    _crossReference: _PdfCrossReference;
    _ref: _PdfReference;
    _page: PdfPage;
    _isLoaded: boolean = false;
    _setAppearance: boolean = false;
    _isExport: boolean = false;
    _color: number[];
    _annotFlags: PdfAnnotationFlag;
    _bounds: {x: number, y: number, width: number, height: number};
    _innerColor: number[];
    _opacity: number = 1;
    _text: string;
    _value: string;
    _locationDisplaced: boolean;
    _isBounds: boolean;
    _borderEffect: PdfBorderEffect;
    _da: _PdfDefaultAppearance;
    _rotate: PdfRotationAngle;
    _isAllRotation: boolean = true;
    _pdfFont: PdfFont;
    _appearanceTemplate: PdfTemplate;
    _flatten: boolean = false;
    private _ratio: number;
    private _author: string;
    private _border: PdfAnnotationBorder;
    private _caption: PdfAnnotationCaption;
    private _creationDate: Date;
    private _modifiedDate: Date;
    private _name: string;
    private _subject: string;
    _isWidget: boolean;
    _type: _PdfAnnotationType;
    _isFlattenPopups: boolean;
    _comments: PdfPopupAnnotationCollection;
    _reviewHistory: PdfPopupAnnotationCollection;
    _hasData: boolean = false;
    _popUpFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10.5);
    _authorBoldFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10.5, PdfFontStyle.bold);
    _lineCaptionFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
    _circleCaptionFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 8, PdfFontStyle.regular);
    _isTransparentColor: boolean = false;
    _isRotated: boolean = false;
    _isChanged: boolean = false;
    /**
     * Gets the author of the annotation.
     *
     * @returns {string} Author.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Get the author of the annotation.
     * let author: string = annotation.author;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get author(): string {
        if (typeof this._author === 'undefined' && this._dictionary.has('Author')) {
            const author: string = this._dictionary.get('Author');
            if (author) {
                this._author = author;
            }
        }
        if (typeof this._author === 'undefined' && this._dictionary.has('T')) {
            const author: string = this._dictionary.get('T');
            if (author) {
                this._author = author;
            }
        }
        return this._author;
    }
    /**
     * Sets the author of the annotation.
     *
     * @param {string} value Author.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the author of the annotation.
     * annotation.author = ‘Syncfusion’;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set author(value: string) {
        if (this._isLoaded && typeof value === 'string' && value !== this.author) {
            let hasKey: boolean = false;
            if (this._dictionary.has('T')) {
                this._dictionary.update('T', value);
                this._author = value;
                hasKey = true;
            }
            if (this._dictionary.has('Author')) {
                this._dictionary.update('Author', value);
                this._author = value;
                hasKey = true;
            }
            if (!hasKey) {
                this._dictionary.update('T', value);
                this._author = value;
            }
        }
        if (!this._isLoaded && typeof value === 'string') {
            this._dictionary.update('T', value);
        }
    }
    /**
     * Gets the border of the annotation.
     *
     * @returns {PdfAnnotationBorder} Annotation border.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the border of the annotation.
     * let border: PdfAnnotationBorder = annotation.border;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get border(): PdfAnnotationBorder {
        if (typeof this._border === 'undefined') {
            const value: PdfAnnotationBorder = new PdfAnnotationBorder();
            value._dictionary = this._dictionary;
            if (this._dictionary.has('Border')) {
                const border: Array<number> = this._dictionary.getArray('Border');
                if (border && border.length >= 3) {
                    value._hRadius = border[0];
                    value._vRadius = border[1];
                    value._width = border[2];
                }
            }
            if (this._dictionary.has('BS')) {
                const border: _PdfDictionary = this._dictionary.get('BS');
                if (border) {
                    if (border.has('W')) {
                        const width: number = border.get('W');
                        if (typeof width !== 'undefined' && !Number.isNaN(width)) {
                            value._width = width;
                        }
                    }
                    if (border.has('S')) {
                        const style: _PdfName = border.get('S');
                        if (style) {
                            switch (style.name) {
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
                        const dash: Array<number> = border.getArray('D');
                        if (dash) {
                            value._dash = dash;
                        }
                    }
                }
            }
            this._border = value;
        }
        return this._border;
    }
    /**
     * Sets the border of the annotation.
     *
     * @param {PdfAnnotationBorder} value Border.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Initializes a new instance of the ` PdfAnnotationBorder ` class.
     * let border: PdfAnnotationBorder = new PdfAnnotationBorder ();
     * //Sets the width of the annotation border.
     * border.width = 10;
     * //Sets the style of the annotation border.
     * border.style = PdfBorderStyle.dashed;
     * //Sets the dash pattern of the annotation border.
     * border.dash = [1, 2, 1];
     * // Sets the border to the PDF annotation
     * annotation.border = border;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set border(value: PdfAnnotationBorder) {
        const current: PdfAnnotationBorder = this.border;
        let width: number;
        if (!this._isLoaded || (typeof value.width !== 'undefined' && current.width !== value.width)) {
            width = value.width;
        }
        let hRadius: number;
        if (!this._isLoaded || (typeof value.hRadius !== 'undefined' && current.hRadius !== value.hRadius)) {
            hRadius = value.hRadius;
        }
        let vRadius: number;
        if (!this._isLoaded || (typeof value.vRadius !== 'undefined' && current.vRadius !== value.vRadius)) {
            vRadius = value.vRadius;
        }
        let style: PdfBorderStyle;
        if (!this._isLoaded || (typeof value.style !== 'undefined' && current.style !== value.style)) {
            style = value.style;
        }
        let dash: number[];
        if (typeof value.dash !== 'undefined' && current.dash !== value.dash) {
            dash = value.dash;
        }
        if (!this._isWidget && (this._dictionary.has('Border') || (width || vRadius || hRadius))) {
            this._border._hRadius = typeof hRadius !== 'undefined' ? hRadius : current.hRadius;
            this._border._vRadius = typeof vRadius !== 'undefined' ? vRadius : current.vRadius;
            this._border._width = typeof width !== 'undefined' ? width : current.width;
            this._dictionary.update('Border', [this._border.hRadius, this._border.vRadius, this._border.width]);
        }
        if (this._dictionary.has('BS') || (width || style || dash)) {
            this._border._width = typeof width !== 'undefined' ? width : current.width;
            this._border._style = typeof style !== 'undefined' ? style : current.style;
            this._border._dash = typeof dash !== 'undefined' ? dash : current.dash;
            const bs: _PdfDictionary = this._dictionary.has('BS') ? this._dictionary.get('BS') : new _PdfDictionary(this._crossReference);
            bs.update('Type', _PdfName.get('Border'));
            bs.update('W', this._border.width);
            bs.update('S', _mapBorderStyle(this._border.style));
            if (typeof this._border.dash !== 'undefined') {
                bs.update('D', this._border.dash);
            }
            this._dictionary.update('BS', bs);
            this._dictionary._updated = true;
        }
    }
    /**
     * Gets the flags of the annotation.
     *
     * @returns {PdfAnnotationFlag} Annotation flag.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the flags of the annotation.
     * let flag: PdfAnnotationFlag = annotation.flags;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get flags(): PdfAnnotationFlag {
        if (typeof this._annotFlags === 'undefined') {
            this._annotFlags = PdfAnnotationFlag.default;
            if (this._dictionary.has('F')) {
                this._annotFlags = this._dictionary.get('F');
            }
        }
        return this._annotFlags;
    }
    /**
     * Sets the flags of the annotation.
     *
     * @param {PdfAnnotationFlag} value flag value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the flags of the annotation.
     * annotation.flags = PdfAnnotationFlag.print;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set flags(value: PdfAnnotationFlag) {
        if (typeof value !== 'undefined' && value !== this._annotFlags) {
            this._annotFlags = value;
            this._dictionary.update('F', value as number);
        }
    }
    /**
     * Gets the fore color of the annotation.
     *
     * @returns {number[]} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the color of the annotation.
     * let color: number[] = annotation.color;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get color(): number[] {
        if (typeof this._color === 'undefined' && this._dictionary.has('C')) {
            this._color = _parseColor(this._dictionary.getArray('C'));
        }
        return this._color;
    }
    /**
     * Sets the fore color of the annotation.
     *
     * @param {number[]} value R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the color of the annotation.
     * annotation.color = [255, 0, 0];
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set color(value: number[]) {
        if (typeof value !== 'undefined' && value.length === 3) {
            const extColor: number[] = this.color;
            if (!this._isLoaded || typeof extColor === 'undefined' || (extColor[0] !== value[0] || extColor[1] !== value[1] || extColor[2] !== value[2])) {
                this._color = value;
                this._dictionary.update('C', [Number.parseFloat((value[0] / 255).toFixed(7)),
                    Number.parseFloat((value[1] / 255).toFixed(7)),
                    Number.parseFloat((value[2] / 255).toFixed(7))]);
            }
        }
    }
    /**
     * Gets the inner color of the annotation.
     *
     * @returns {number[]} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the inner color of the annotation.
     * let innerColor: number[] = annotation.innerColor;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get innerColor(): number[] {
        if (typeof this._innerColor === 'undefined' && this._dictionary.has('IC')) {
            this._innerColor = _parseColor(this._dictionary.getArray('IC'));
        }
        return this._innerColor;
    }
    /**
     * Sets the inner color of the annotation.
     *
     * @param {number[]} value R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the inner color of the annotation.
     * annotation.innerColor = [255, 0, 0];
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set innerColor(value: number[]) {
        if (typeof value !== 'undefined' && value.length === 3) {
            const extColor: number[] = this.innerColor;
            if (!this._isLoaded ||
                typeof extColor === 'undefined' ||
                (extColor[0] !== value[0] || extColor[1] !== value[1] || extColor[2] !== value[2])) {
                this._innerColor = value;
                this._dictionary.update('IC', [Number.parseFloat((value[0] / 255).toFixed(7)),
                    Number.parseFloat((value[1] / 255).toFixed(7)),
                    Number.parseFloat((value[2] / 255).toFixed(7))]);
            }
        }
    }
    /**
     * Gets the creation date of the annotation.
     *
     * @returns {Date} Creation date.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Get the creation date of the annotation.
     * let creationDate: Date = annotation.creationDate;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get creationDate(): Date {
        if ((typeof this._creationDate === 'undefined' || this._creationDate === null) && this._dictionary.has('CreationDate')) {
            const value: any = this._dictionary.get('CreationDate'); // eslint-disable-line
            if (value !== null && typeof value === 'string') {
                this._creationDate = this._stringToDate(value);
            }
        }
        return this._creationDate;
    }
    /**
     * Sets the creation date of the annotation.
     *
     * @param {Date} value Creation date.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Set the creation date of the annotation.
     * annotation.creationDate = new Date();
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set creationDate(value: Date) {
        this._creationDate = value;
        this._dictionary.update('CreationDate', this._dateToString(value));
    }
    /**
     * Gets the modification date of the annotation.
     *
     * @returns {Date} Modified date.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Get the modified date of the annotation.
     * let modifiedDate: Date = annotation.modifiedDate;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get modifiedDate(): Date {
        if ((typeof this._modifiedDate === 'undefined' || this._modifiedDate === null)) {
            let value: any; // eslint-disable-line
            if (this._dictionary.has('ModDate')) {
                value = this._dictionary.get('ModDate');
            } else if (this._dictionary.has('M')) {
                value = this._dictionary.get('M');
            }
            if (value !== null && typeof value === 'string') {
                this._modifiedDate = this._stringToDate(value);
            }
        }
        return this._modifiedDate;
    }
    /**
     * Sets the modification date of the annotation.
     *
     * @param {Date} value Modified date.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Set the modified date of the annotation.
     * annotation.modifiedDate = new Date();
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set modifiedDate(value: Date) {
        this._modifiedDate = value;
        this._dictionary.update('M', this._dateToString(value));
    }
    /**
     * Gets the bounds of the annotation.
     *
     * @returns {{x: number, y: number, width: number, height: number}} Bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the bounds of the annotation.
     * let bounds: {x: number, y: number, width: number, height: number} = annotation.bounds;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bounds(): {x: number, y: number, width: number, height: number} {
        if (this._isLoaded) {
            this._bounds = _calculateBounds(this._dictionary, this._page);
        }
        return this._bounds;
    }
    /**
     * Sets the bounds of the annotation.
     *
     * @param {{x: number, y: number, width: number, height: number}} value bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the bounds of the annotation.
     * annotation.bounds = {x: 10, y: 10, width: 150, height: 5};
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set bounds(value: {x: number, y: number, width: number, height: number}) {
        if (value) {
            this._isBounds = true;
            if (this._isLoaded) {
                if ((value.x !== this.bounds.x) || (value.y !== this.bounds.y) ||
                    (value.width !== this.bounds.width) || (value.height !== this.bounds.height)) {
                    const size: number[] = this._page.size;
                    if (size) {
                        const y: number = size[1] - (value.y + value.height);
                        const height: number = y + value.height;
                        this._dictionary.update('Rect', [value.x, y, value.x + value.width, height]);
                        this._bounds = value;
                        this._isChanged = true;
                    }
                }
            } else {
                this._bounds = value;
                this._isChanged = true;
            }
        }
    }
    /**
     * Gets the caption of the annotation.
     *
     * @returns {PdfAnnotationCaption} Annotation caption.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the caption of the annotation.
     * let caption: PdfAnnotationCaption = annotation.caption;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get caption(): PdfAnnotationCaption {
        if (typeof this._caption === 'undefined') {
            const value: PdfAnnotationCaption = new PdfAnnotationCaption();
            value._dictionary = this._dictionary;
            if (this._dictionary.has('Cap')) {
                value._cap = this._dictionary.get('Cap');
            }
            if (this._dictionary.has('CP')) {
                const capType: _PdfName = this._dictionary.get('CP');
                if (capType) {
                    value._type = capType.name === 'Top' ? PdfLineCaptionType.top : PdfLineCaptionType.inline;
                }
            }
            if (this._dictionary.has('CO')) {
                value._offset = this._dictionary.getArray('CO');
            }
            this._caption = value;
        }
        return this._caption;
    }
    /**
     * Sets the caption of the annotation.
     *
     * @param {PdfAnnotationCaption} value Annottion caption.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Create and set annotation caption values
     * annotation.caption = new PdfAnnotationCaption(true, PdfLineCaptionType.inline, [10, 10]);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set caption(value: PdfAnnotationCaption) {
        const current: PdfAnnotationCaption = this.caption;
        if (value) {
            if (!this._isLoaded || value.cap !== current.cap) {
                this._caption.cap = value.cap;
            }
            if (!this._isLoaded || value.type !== current.type) {
                this._caption.type = value.type;
            }
            if (!this._isLoaded || value.offset !== current.offset) {
                this._caption.offset = value.offset;
            }
        }
    }
    /**
     * Gets the opacity of the annotation.
     *
     * @returns {number} Opacity in between 0 t0 1.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Get the opacity of the annotation.
     * let opacity: number = annotation.opacity;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get opacity(): number {
        if (this._dictionary.has('CA')) {
            const opacity: number = this._dictionary.get('CA');
            if (typeof opacity !== 'undefined') {
                this._opacity = opacity;
            }
        }
        return this._opacity;
    }
    /**
     * Sets the opacity of the annotation.
     *
     * @param {number} value opacity in between 0 t0 1.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the opacity of the annotation.
     * annotation.opacity = 0.5;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set opacity(value: number) {
        if (typeof value !== 'undefined' && !Number.isNaN(value)) {
            if (value >= 0 && value <= 1) {
                this._dictionary.update('CA', value);
                this._opacity = value;
            } else if (value < 0) {
                this._dictionary.update('CA', 0);
            } else {
                this._dictionary.update('CA', 1);
            }
        }
    }
    /**
     * Gets the subject of the annotation.
     *
     * @returns {string} Subject.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Get the subject of the annotation.
     * let subject: string = annotation.subject;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get subject(): string {
        if (typeof this._subject === 'undefined') {
            this._subject = this._dictionary.get('Subject', 'Subj');
        }
        return this._subject;
    }
    /**
     * Sets the subject of the annotation.
     *
     * @param {string} value Subject.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the subject of the annotation.
     * annotation.subject = 'Line Annotation';
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set subject(value: string) {
        if (typeof value === 'string' && this.subject !== value) {
            this._dictionary.update('Subj', value);
            this._subject = value;
            if (this._dictionary.has('Subject')) {
                this._dictionary.update('Subject', value);
            }
        }
    }
    /**
     * Gets the name of the annotation.
     *
     * @returns {string} Name.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Get the name of the annotation.
     * let name: string = annotation.name;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get name(): string {
        if (typeof this._name === 'undefined' && this._dictionary.has('NM')) {
            this._name = this._dictionary.get('NM');
        }
        return this._name;
    }
    /**
     * Sets the name of the annotation.
     *
     * @param {string} value Name.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the name of the annotation.
     * annotation.name = 'LineAnnotation';
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set name(value: string) {
        if (typeof value === 'string') {
            this._dictionary.update('NM', value);
            this._name = value;
        }
    }
    /**
     * Gets the text of the annotation.
     *
     * @returns {string} Text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Get the text of the annotation.
     * let text: string = annotation.text;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get text(): string {
        if (typeof this._text === 'undefined' && this._dictionary.has('Contents')) {
            this._text = this._dictionary.get('Contents');
        }
        return this._text;
    }
    /**
     * Sets the text of the annotation.
     *
     * @param {string} value Text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the text of the annotation.
     * annotation.text = ‘LineAnnotation’;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set text(value: string) {
        if (typeof value === 'string') {
            this._text = this._dictionary.get('Contents');
            if (value !== this._text) {
                this._dictionary.update('Contents', value);
                this._text = value;
            }
        }
    }
    /**
     * Gets the rotation of the annotation.
     *
     * @returns {PdfRotationAngle} Rotation angle.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Get the rotation angle of the annotation.
     * let rotationAngle: PdfRotationAngle = annotation.rotationAngle;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get rotationAngle(): PdfRotationAngle {
        if (typeof this._rotate === 'undefined' && this._dictionary.has('Rotate')) {
            this._rotate = (this._dictionary.get('Rotate') / 90);
        }
        if (this._rotate === null || typeof this._rotate === 'undefined') {
            this._rotate = PdfRotationAngle.angle0;
        }
        return this._rotate;
    }
    /**
     * Sets the rotation of the annotation.
     *
     * @param {PdfRotationAngle} value rotation angle.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the rotation angle of the annotation.
     * annotation.rotationAngle = PdfRotationAngle.angle180;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set rotationAngle(value: PdfRotationAngle) {
        const prevRotate: PdfRotationAngle = this.rotationAngle;
        if (typeof value !== 'undefined' && typeof prevRotate !== 'undefined') {
            value = ((value + prevRotate) % 4);
        }
        this._dictionary.update('Rotate', value * 90);
        this._isRotated = true;
        this._rotate = value;
    }
    /**
     * Gets the rotation angle of the annotation (Read only).
     *
     * @returns {number} Rotation angle.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * //Get the rotation angle of the annotation.
     * let rotate: number = annotation.rotate;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get rotate(): number {
        let angle: number = this._getRotationAngle();
        if (angle < 0) {
            angle = 360 + angle;
        }
        if (angle >= 360) {
            angle = 360 - angle;
        }
        return angle;
    }
    /**
     * Gets the boolean flag indicating whether annotation's popup have been flattened or not.
     *
     * @returns {boolean} Flatten Popup.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the boolean flag indicating whether annotation's popup have been flattened or not.
     * let flattenPopups: boolean = annotation.flattenPopups;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get flattenPopups(): boolean {
        return this._isFlattenPopups;
    }
    /**
     * Sets the boolean flag indicating whether the annotation’s popup have been flattened or not.
     *
     * @param {boolean} value Flatten Popup.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the boolean flag indicating whether the annotation’s popup have been flattened or not.
     * annotation.flattenPopups = false;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set flattenPopups(value: boolean) {
        if (typeof value !== 'undefined') {
            this._isFlattenPopups = value;
        }
    }
    /**
     * Gets the boolean flag indicating whether the annotation have been flattened or not.
     *
     * @returns {boolean} Flatten.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the boolean flag indicating whether the annotation have been flattened or not.
     * let flatten: boolean = annotation.flatten;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get flatten(): boolean {
        return this._flatten;
    }
    /**
     * Sets the boolean flag indicating whether the annotation have been flattened or not.
     *
     * @param {boolean} value Flatten.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the boolean flag indicating whether the annotation have been flattened or not.
     * annotation.flatten = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set flatten(value: boolean) {
        this._flatten = value;
    }
    get _hasFlags(): boolean {
        return this._dictionary.has('F');
    }
    get _degreeToRadian(): number {
        if (typeof this._ratio === 'undefined') {
            this._ratio = Math.PI / 180;
        }
        return this._ratio;
    }
    /**
     * Set the boolean flag to create a new appearance stream for annotations.
     *
     * @param {boolean} value Set appearance.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Set the boolean flag to create a new appearance stream for annotations.
     * document.getPage(0).annotations.at(0).setAppearance(true);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setAppearance(value: boolean): void {
        this._setAppearance = value;
        if (value) {
            this._dictionary._updated = true;
        }
    }
    /**
     * Gets the values associated with the specified key.
     *
     * @param {string} name Key.
     * @returns {string[]} Values associated with the key.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the values associated with the key 'Author'.
     * let values: string[] = document.getPage(0).annotations.at(0).getValues('Author');
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getValues(name: string): string[] {
        const values: string[] = [];
        if (this._dictionary.has(name)) {
            let value: any = this._dictionary.get(name);// eslint-disable-line
            if (Array.isArray(value)) {
                value = this._dictionary.getArray(name);
                for (let i: number = 0; i < value.length; i++) {
                    const element: any = value[Number.parseInt(i.toString(), 10)];// eslint-disable-line
                    if (element instanceof _PdfName) {
                        values.push(element.name);
                    } else if (typeof element === 'string') {
                        values.push(element);
                    } else if (typeof element === 'number') {
                        values.push(element.toString());
                    }
                }
            } else if (value instanceof _PdfName) {
                values.push(value.name);
            } else if (typeof value === 'string') {
                values.push(value);
            } else {
                throw new Error('PdfException: ' + name + ' is not found');
            }
        } else {
            throw new Error('PdfException: ' + name + ' is not found');
        }
        return values;
    }
    /**
     * Sets the values associated with the specified key.
     *
     * @param {string} name Key.
     * @param {string} value Value associated with the key..
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the annotation at index 0
     * let annotation: PdfAnnotation = document.getPage(0).annotations.at(0);
     * // Set Unknown state and model
     * annotation.setValues('State', 'StateModel');
     * annotation.setValues('StateModel', 'CustomState');
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    setValues(name: string, value: string): void {
        if (name && name !== '' && value && value !== '') {
            this._dictionary.update(name, value);
        }
    }
    //Implementation
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        this._page = page;
        this._crossReference = page._crossReference;
        if (dictionary) {
            this._dictionary = dictionary;
        }
        if (!this._isLoaded) {
            this._dictionary.set('P', this._page._ref);
            this._dictionary.assignXref(this._crossReference);
        }
    }
    _getRotationAngle(): number {
        let angle: number = 0;
        if (this._dictionary.has('Rotate')) {
            angle = this._dictionary.get('Rotate');
        } else if (this._dictionary.has('Rotation')) {
            angle = this._dictionary.get('Rotation');
        }
        return angle;
    }
    _getMediaOrCropBox(page: PdfPage): number[] {
        let cropOrMediaBox: number[];
        if (page && page._pageDictionary && page._pageDictionary.has('MediaBox')) {
            cropOrMediaBox = page._pageDictionary.get('MediaBox');
        } else if (page && page._pageDictionary && page._pageDictionary.has('CropBox')) {
            cropOrMediaBox = page._pageDictionary.get('CropBox');
        }
        return cropOrMediaBox;
    }
    _getBoundsValue(linePoints: number[]): {x: number, y: number, width: number, height: number} {
        const count: number = linePoints.length;
        const x: number[] = [];
        const y: number[] = [];
        if (linePoints && count > 0) {
            const points: number[] = [];
            for (let i: number = 0; i < linePoints.length; i++) {
                const value: number = linePoints[Number.parseInt(i.toString(), 10)];
                points.push(value);
            }
            let x1: number = 0;
            let y1: number = 0;
            for (let i: number = 0; i < points.length; i++) {
                if (i % 2 === 0) {
                    x[Number.parseInt(x1.toString(), 10)] = points[Number.parseInt(i.toString(), 10)];
                    x1++;
                } else {
                    y[Number.parseInt(y1.toString(), 10)] = points[Number.parseInt(i.toString(), 10)];
                    y1++;
                }
            }
        }
        x.sort((a: number, b: number) => a > b ? 1 : -1);
        y.sort((a: number, b: number) => a > b ? 1 : -1);
        return {x: x[0], y: y[0], width: x[x.length - 1] - x[0], height: y[y.length - 1] - y[0]};
    }
    abstract _doPostProcess(isFlatten?: boolean): void;
    _validateTemplateMatrix(dictionary: _PdfDictionary) : boolean;
    _validateTemplateMatrix(dictionary: _PdfDictionary, template: PdfTemplate) : boolean;
    _validateTemplateMatrix(dictionary: _PdfDictionary, template?: PdfTemplate): boolean {
        let isRotatedMatrix: boolean = false;
        let isValidMatrix: boolean = true;
        if (template === null || typeof template === 'undefined') {
            if (dictionary && dictionary.has('Matrix')) {
                const matrix: number[] = dictionary.getArray('Matrix');
                if (matrix && matrix.length > 3) {
                    if (typeof matrix[0] !== 'undefined' &&
                        typeof matrix[1] !== 'undefined' &&
                        typeof matrix[2] !== 'undefined' &&
                        typeof matrix[3] !== 'undefined') {
                        if (matrix[0] === 1 && matrix[1] === 0 && matrix[2] === 0 && matrix[3] === 1) {
                            isRotatedMatrix = true;
                            let locationX: number = 0;
                            let locationY: number = 0;
                            let templateX: number = 0;
                            let templateY: number = 0;
                            if (matrix.length > 4) {
                                templateX = -matrix[4];
                                if (matrix.length > 5) {
                                    templateY = -matrix[5];
                                }
                            }
                            let annotationBounds: number[];
                            if (this._dictionary.has('Rect')) {
                                annotationBounds = this._dictionary.getArray('Rect');
                                if (annotationBounds && annotationBounds.length > 1) {
                                    locationX = annotationBounds[0];
                                    locationY = annotationBounds[1];
                                }
                            }
                            if (!(locationX === templateX && locationY === templateY) && templateX === 0 && templateY === 0) {
                                this._locationDisplaced = true;
                            }
                        }
                    }
                }
            } else {
                isRotatedMatrix = true;
            }
            return isRotatedMatrix;
        } else {
            const point: {x: number, y: number, width: number, height: number} = this.bounds;
            if (dictionary && dictionary.has('Matrix')) {
                const box: number[] = dictionary.getArray('BBox');
                const matrix: number[] = dictionary.getArray('Matrix');
                if (matrix && box && matrix.length > 3 && box.length > 2) {
                    if (typeof matrix[0] !== 'undefined' &&
                        typeof matrix[1] !== 'undefined' &&
                        typeof matrix[2] !== 'undefined' &&
                        typeof matrix[3] !== 'undefined') {
                        if (matrix[0] === 1 && matrix[1] === 0 && matrix[2] === 0 && matrix[3] === 1) {
                            if (typeof box[0] !== 'undefined' &&
                                typeof box[1] !== 'undefined' &&
                                typeof box[2] !== 'undefined' &&
                                typeof box[3] !== 'undefined') {
                                if (box[0] !== -(matrix[4]) && box[1] !== -(matrix[5]) || (box[0] === 0 && -matrix[4] === 0)) {
                                    const graphics: PdfGraphics = this._page.graphics;
                                    const state: PdfGraphicsState = graphics.save();
                                    if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                                        graphics.setTransparency(this._opacity);
                                    }
                                    point.x -= box[0];
                                    point.y += box[1];
                                    graphics.drawTemplate(template, point);
                                    graphics.restore(state);
                                    this._page.annotations.remove(this);
                                    isValidMatrix = false;
                                }
                            }
                        }
                    }
                }
            }
            return isValidMatrix;
        }
    }
    _flattenAnnotationTemplate(template: PdfTemplate, isNormalMatrix: boolean): void {
        const graphics: PdfGraphics = this._page.graphics;
        let currentBounds: {x: number, y: number, width: number, height: number} = this.bounds;
        if (this instanceof PdfLineAnnotation && !this._dictionary.has('AP')) {
            if (this._isLoaded) {
                currentBounds = this._bounds;
            } else if (this._setAppearance && this.flatten && !this.measure) {
                currentBounds = this._bounds;
            } else {
                currentBounds = _toRectangle([this.bounds.x, this.bounds.y,
                    this.bounds.width, this.bounds.height]);
            }
            if (this._page) {
                const size: number[] = this._page.size;
                const mBox: number[] = this._page.mediaBox;
                const cropBox: number[] = this._page.cropBox;
                if (cropBox && Array.isArray(cropBox) && cropBox.length === 4 && this._page._pageDictionary.has('CropBox') && !this._isLoaded) {
                    if ((cropBox[0] !== 0 || cropBox[1] !== 0 || size[0] === cropBox[2] ||
                        size[1] === cropBox[3]) && (currentBounds.x !== cropBox[0])) {
                        currentBounds.x -= cropBox[0];
                        currentBounds.y = cropBox[3] - (currentBounds.y + currentBounds.height);
                    } else {
                        currentBounds.y = size[1] - (currentBounds.y + currentBounds.height);
                    }
                } else if (mBox && Array.isArray(mBox) && mBox.length === 4 && this._page._pageDictionary.has('MediaBox') && !this._isLoaded) {
                    if (mBox[0] > 0 || mBox[1] > 0 || size[0] === mBox[2] || size[1] === mBox[3]) {
                        currentBounds.x -= mBox[0];
                        currentBounds.y = mBox[3] - (currentBounds.y + currentBounds.height);
                    } else {
                        currentBounds.y = size[1] - (currentBounds.y + currentBounds.height);
                    }
                } else if (this._setAppearance && this.flatten && !this.measure) {
                    currentBounds = this.bounds;
                } else if (!this._isLoaded) {
                    currentBounds.y = size[1] - (currentBounds.y + currentBounds.height);
                }
            } else {
                currentBounds.y = currentBounds.y + currentBounds.height;
            }
        }
        if (typeof currentBounds !== 'undefined' && currentBounds !== null) {
            const state: PdfGraphicsState = graphics.save();
            this._page._needInitializeGraphics = true;
            if (this._type === _PdfAnnotationType.rubberStampAnnotation) {
                let needScale: boolean = true;
                if (this._dictionary.has('AP')) {
                    const dictionary: _PdfDictionary = this._dictionary.get('AP');
                    if (dictionary && dictionary.has('N')) {
                        const appearanceStream: _PdfBaseStream = dictionary.get('N');
                        if (this.rotate === PdfRotationAngle.angle270 && this._page.rotation === PdfRotationAngle.angle270
                            && appearanceStream.dictionary.has('Matrix')) {
                            const matrix: number[] = appearanceStream.dictionary.getArray('Matrix');
                            if (matrix && matrix.length === 6 && matrix[4] === 0 && matrix[5] !== 0) {
                                needScale = false;
                            }
                        }
                    }
                    if (!isNormalMatrix && this.rotate !== PdfRotationAngle.angle180 && needScale) {
                        template._isAnnotationTemplate = true;
                        template._needScale = true;
                    }
                }
            }
            if (!isNormalMatrix && this._type !== _PdfAnnotationType.rubberStampAnnotation) {
                template._isAnnotationTemplate = true;
                template._needScale = true;
            }
            if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                graphics.setTransparency(this._opacity);
            }
            let bounds: { x: number, y: number, width: number, height: number } = this._calculateTemplateBounds(currentBounds,
                                                                                                                this._page,
                                                                                                                template,
                                                                                                                isNormalMatrix,
                                                                                                                graphics);
            if (this._type === _PdfAnnotationType.rubberStampAnnotation) {
                let size: number[];
                let location: number[];
                if (this.rotate === PdfRotationAngle.angle0) {
                    size = [bounds.width, bounds.height];
                    location = [bounds.x, bounds.y];
                } else {
                    size = template._size;
                    location = [bounds.x, bounds.y];
                }
                let isRotatedMatrix: boolean = false;
                if (this.rotate !== PdfRotationAngle.angle0 && template._content) {
                    if (template._content.dictionary.has('Matrix')) {
                        const matrix: number[] = template._content.dictionary.getArray('Matrix');
                        if (matrix && matrix.length === 6 && matrix[4] === 0 && matrix[5] !== 0) {
                            isRotatedMatrix = true;
                        }
                    }
                }
                const scaleX: number = (template._size[0] > 0) ? bounds.width / template._size[0] : 1;
                const scaleY: number = (template._size[1] > 0) ? bounds.height / template._size[1] : 1;
                const needScale: boolean = !(Math.round(scaleX) === 1 && Math.round(scaleY) === 1);
                if (this.rotate !== PdfRotationAngle.angle0 && isRotatedMatrix) {
                    if (this.rotate === PdfRotationAngle.angle90) {
                        if (this._page.rotation === PdfRotationAngle.angle270) {
                            if (needScale && !(bounds.x === 0 && bounds.y === 0)) {
                                location[0] += (size[0] - size[1]);
                                location[1] += size[0];
                            } else {
                                location[0] += size[1];
                                location[1] += (size[0] - size[1]) + (size[0] - size[1]);
                            }
                        } else if (!needScale) {
                            location[0] += size[1];
                        }
                    } else if (this.rotate === PdfRotationAngle.angle270) {
                        if (this._page.rotation === PdfRotationAngle.angle270) {
                            if (needScale && template._isAnnotationTemplate) {
                                location[1] = bounds.y - bounds.width;
                            } else if (needScale) {
                                location[1] += (size[0] - size[1]);
                            }
                        } else {
                            if (!needScale && !(bounds.x === 0 && bounds.y === 0)) {
                                location[1] += -(size[0]);
                            } else {
                                location[1] += -(size[0] - size[1]);
                            }
                        }
                    } else if (this.rotate === PdfRotationAngle.angle180) {
                        location[0] += size[0];
                        location[1] += -(size[1]);
                    }
                }
            }
            if (!template._content.dictionary.has('Matrix') && template._content.dictionary.has('BBox')) {
                const box: number[] = template._content.dictionary.getArray('BBox');
                bounds.x -= box[0];
                bounds.y += box[1];
            }
            if (this instanceof PdfAngleMeasurementAnnotation && !this._isLoaded) {
                bounds = _calculateBounds(this._dictionary, this._page);
            }
            graphics.drawTemplate(template, bounds);
            graphics.restore(state);
        }
        this._page.annotations.remove(this);
    }
    _calculateTemplateBounds(bounds: {x: number, y: number, width: number, height: number},
                             page: PdfPage,
                             template: PdfTemplate,
                             isNormalMatrix: boolean,
                             graphics: PdfGraphics): {x: number, y: number, width: number, height: number} {
        let annotationBounds: {x: number, y: number, width: number, height: number} = bounds;
        let x: number = bounds.x;
        let y: number = bounds.y;
        let width: number = bounds.width;
        let height: number = bounds.height;
        if (!isNormalMatrix) {
            const rect: number[] = this._dictionary.getArray('Rect');
            if (rect) {
                annotationBounds = _toRectangle(rect);
            }
        }
        if (typeof page !== 'undefined') {
            const graphicsRotation: number = this._obtainGraphicsRotation(graphics._matrix);
            if (graphicsRotation === 90) {
                graphics.translateTransform(template._size[1], 0);
                graphics.rotateTransform(90);
                if (isNormalMatrix || (typeof this._rotate !== 'undefined' && this._rotate === PdfRotationAngle.angle180)) {
                    x = bounds.x;
                    if (!this._locationDisplaced) {
                        y = -(page.size[1] - bounds.y - bounds.height);
                    } else if (page._origin && page._o[1] !== 0) {
                        y =  bounds.y + bounds.height;
                    } else {
                        y = -(page.size[1] - (bounds.height + bounds.y) + (bounds.height - template._size[1]));
                    }
                } else {
                    x = bounds.x;
                    y = -(page.size[1] - (bounds.height + bounds.y) + (bounds.width - template._size[1]));
                    width = bounds.height;
                    height = bounds.width;
                }
            } else if (graphicsRotation === 180) {
                graphics.translateTransform(template._size[0], template._size[1]);
                graphics.rotateTransform(180);
                if (isNormalMatrix) {
                    x = -(page.size[0] - (bounds.x + bounds.width));
                    y = -(page.size[1] - bounds.y - bounds.height);
                } else {
                    x = -(page.size[0] - (bounds.x + template._size[0]));
                    y = -(page.size[1] - bounds.y - template._size[1]);
                    if (typeof this.rotationAngle !== 'undefined' &&
                        (this._rotate === PdfRotationAngle.angle90 ||
                            this._rotate === PdfRotationAngle.angle270)) {
                        y = (-(page.size[1] - bounds.y - template._size[1]) - (bounds.width - bounds.height));
                        width = bounds.height;
                        height = bounds.width;
                    }
                }
            } else if (graphicsRotation === 270) {
                graphics.translateTransform(0, template._size[0]);
                graphics.rotateTransform(270);
                if (isNormalMatrix || (typeof this.rotationAngle !== 'undefined' && this._rotate === PdfRotationAngle.angle180)) {
                    x = -(page.size[0] - bounds.x - bounds.width);
                    y =   bounds.y;
                } else {
                    x = -(page.size[0] - annotationBounds.x - template._size[0]);
                    const matrix: number[] = template._content.dictionary.getArray('Matrix');
                    const box: number[] = template._content.dictionary.getArray('BBox');
                    if (matrix && box && matrix[5] !== box[2]) {
                        y = bounds.y - (bounds.height - bounds.width);
                    } else {
                        y = (bounds.y + bounds.height) - bounds.width;
                    }
                    width = bounds.height;
                    height = bounds.width;
                }
            } else if (graphicsRotation === 0) {
                if (!isNormalMatrix &&
                    (typeof this.rotationAngle !== 'undefined' &&
                    (this.rotationAngle === PdfRotationAngle.angle90 ||
                        this.rotationAngle === PdfRotationAngle.angle270))) {
                    x = bounds.x;
                    y = (bounds.y + bounds.height - bounds.width);
                    width = bounds.height;
                    height = bounds.width;
                }
            }
        }
        return {x: x, y: y, width: width, height: height};
    }
    _obtainGraphicsRotation(matrix: _PdfTransformationMatrix): number {
        const radians: number = Math.atan2(matrix._matrix._elements[2], matrix._matrix._elements[0]);
        let angle: number = Math.round(radians * 180 / Math.PI);
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
    _removeAnnotation(page: PdfPage, annotation: PdfAnnotation): void {
        if (page && annotation) {
            page.annotations.remove(annotation);
            page._pageDictionary._updated = true;
        }
    }
    _drawCloudStyle(graphics: PdfGraphics,
                    brush: PdfBrush,
                    pen: PdfPen,
                    radius: number,
                    overlap: number,
                    points: Array<number[]>,
                    isAppearance: boolean): void {
        if (this._isClockWise(points)) {
            const sortedPoints: Array<number[]> = [];
            for (let i: number = points.length - 1; i >= 0; i--) {
                sortedPoints.push(points[Number.parseInt(i.toString(), 10)]);
            }
            points = sortedPoints;
        }
        const circles: Array<_CloudStyleArc> = [];
        const circleOverlap: number = 2 * radius * overlap;
        let previousPoint: number[] = points[points.length - 1];
        for (let i: number = 0; i < points.length; i++) {
            const currentPoint: number[] = points[Number.parseInt(i.toString(), 10)];
            let dx: number = currentPoint[0] - previousPoint[0];
            let dy: number = currentPoint[1] - previousPoint[1];
            const length: number = Math.sqrt(dx * dx + dy * dy);
            dx = dx / length;
            dy = dy / length;
            for (let a: number = 0; a + 0.1 * circleOverlap < length; a += circleOverlap) {
                const cur: _CloudStyleArc = new _CloudStyleArc();
                cur.point = [previousPoint[0] + a * dx, previousPoint[1] + a * dy];
                circles.push(cur);
            }
            previousPoint = currentPoint;
        }
        let previousCurvedStyleArc: _CloudStyleArc = circles[circles.length - 1];
        for (let i: number = 0; i < circles.length; i++) {
            const currentCurvedStyleArc: _CloudStyleArc = circles[Number.parseInt(i.toString(), 10)];
            const angle: number[] = this._getIntersectionDegrees(previousCurvedStyleArc.point, currentCurvedStyleArc.point, radius);
            previousCurvedStyleArc.endAngle = angle[0];
            currentCurvedStyleArc.startAngle = angle[1];
            previousCurvedStyleArc = currentCurvedStyleArc;
        }
        let path: PdfPath = new PdfPath();
        for (let i: number = 0; i < circles.length; i++) {
            const current: _CloudStyleArc = circles[Number.parseInt(i.toString(), 10)];
            const startAngle: number = current.startAngle % 360;
            const endAngle: number = current.endAngle % 360;
            let sweepAngel: number = 0;
            if (startAngle > 0 && endAngle < 0) {
                sweepAngel = (180 - startAngle) + (180 - (endAngle < 0 ? -endAngle : endAngle));
            } else if (startAngle < 0 && endAngle > 0) {
                sweepAngel = -startAngle + endAngle;
            } else if (startAngle > 0 && endAngle > 0) {
                let difference: number = 0;
                if (startAngle > endAngle) {
                    difference = startAngle - endAngle;
                    sweepAngel = 360 - difference;
                } else {
                    sweepAngel = endAngle - startAngle;
                }
            } else if (startAngle < 0 && endAngle < 0) {
                let difference: number = 0;
                if (startAngle > endAngle) {
                    difference = startAngle - endAngle;
                    sweepAngel = 360 - difference;
                } else {
                    sweepAngel = -(startAngle + (-endAngle));
                }
            }
            if (sweepAngel < 0) {
                sweepAngel = -sweepAngel;
            }
            current.endAngle = sweepAngel;
            path.addArc(current.point[0] - radius, current.point[1] - radius, 2 * radius, 2 * radius, startAngle, sweepAngel);
        }
        path.closeFigure();
        let tempPoints: Array<number[]> = [];
        if (isAppearance) {
            for (let i: number = 0; i < path._points.length; i++) {
                tempPoints.push([path._points[Number.parseInt(i.toString(), 10)][0], -path._points[Number.parseInt(i.toString(), 10)][1]]);
            }
        }
        let pdfpath: PdfPath;
        if (isAppearance) {
            pdfpath = new PdfPath();
            pdfpath._points = tempPoints;
            pdfpath._pathTypes = path._pathTypes;
        } else {
            pdfpath = new PdfPath();
            pdfpath._points = path._points;
            pdfpath._pathTypes = path._pathTypes;
        }
        if (brush !== null) {
            graphics.drawPath(pdfpath, brush);
        }
        const incise: number = 180 / (Math.PI * 3);
        path = new PdfPath();
        for (let i: number = 0; i < circles.length; i++) {
            const current: _CloudStyleArc = circles[Number.parseInt(i.toString(), 10)];
            path.addArc(current.point[0] - radius,
                        current.point[1] - radius,
                        2 * radius,
                        2 * radius,
                        current.startAngle,
                        current.endAngle + incise);
        }
        path.closeFigure();
        tempPoints = [];
        if (isAppearance) {
            for (let i: number = 0; i < path._points.length; i++) {
                tempPoints.push([path._points[Number.parseInt(i.toString(), 10)][0], -path._points[Number.parseInt(i.toString(), 10)][1]]);
            }
        }
        if (isAppearance) {
            pdfpath = new PdfPath();
            pdfpath._points = tempPoints;
            pdfpath._pathTypes = path._pathTypes;
        } else {
            pdfpath = new PdfPath();
            pdfpath._points = path._points;
            pdfpath._pathTypes = path._pathTypes;
        }
        graphics.drawPath(pdfpath, pen);
    }
    _isClockWise(points: Array<number[]>): boolean {
        let sum: number = 0;
        for (let i: number = 0; i < points.length; i++) {
            const first: number[] = points[Number.parseInt(i.toString(), 10)];
            const second: number[] = points[(i + 1) % points.length];
            sum += (second[0] - first[0]) * (second[1] + first[1]);
        }
        return sum > 0;
    }
    _getIntersectionDegrees(first: number[], second: number[], radius: number): number[] {
        const dx: number = second[0] - first[0];
        const dy: number = second[1] - first[1];
        const length: number = Math.sqrt(dx * dx + dy * dy);
        let a: number = 0.5 * length / radius;
        if (a < -1) {
            a = -1;
        } else if (a > 1) {
            a = 1;
        }
        const radian: number = Math.atan2(dy, dx);
        const cosvalue: number = Math.acos(a);
        return [(radian - cosvalue) * (180 / Math.PI), (Math.PI + radian + cosvalue) * (180 / Math.PI)];
    }
    _obtainStyle(borderPen: PdfPen, rectangle: number[], borderWidth: number, parameter?: PdfBorderEffect | _PaintParameter): number[] {
        const dash: number[] = this.border.dash;
        if (dash && dash.length > 0) {
            const dashPattern: number[] = [];
            let isDash: boolean = false;
            for (let i: number = 0; i < dash.length; i++) {
                dashPattern[Number.parseInt(i.toString(), 10)] = dash[Number.parseInt(i.toString(), 10)];
                if (dashPattern[Number.parseInt(i.toString(), 10)] > 0) {
                    isDash = true;
                }
            }
            if (isDash && this.border.style === PdfBorderStyle.dashed) {
                borderPen._dashStyle = PdfDashStyle.dash;
                borderPen._dashPattern = dashPattern;
            }
        }
        if (parameter) {
            if (parameter instanceof _PaintParameter) {
                if (!this._isBounds && this._dictionary.has('RD')) {
                    const array: number[] = this._dictionary.getArray('RD');
                    if (array) {
                        rectangle[0] = rectangle[0] + array[0];
                        rectangle[1] = rectangle[1] + borderWidth + array[1];
                        rectangle[2] = rectangle[2] - (array[0] +  array[2]);
                        rectangle[3] = rectangle[3] - (array[1] +  array[3]);
                    }
                } else {
                    rectangle[0] = rectangle[0] + borderWidth;
                    rectangle[1] = rectangle[1] + borderWidth;
                    rectangle[2] = rectangle[2] - this.border.width;
                    rectangle[3] = rectangle[3] - this.border.width;
                }
                parameter.bounds = rectangle;
            } else {
                if (parameter.intensity !== 0 && parameter.style === PdfBorderEffectStyle.cloudy) {
                    const radius: number = parameter.intensity * 5;
                    rectangle[0] = rectangle[0] + radius + borderWidth;
                    rectangle[1] = rectangle[1] + radius + borderWidth;
                    rectangle[2] = rectangle[2] - (2 * radius) - 2 * borderWidth;
                    rectangle[3] = rectangle[3] - (2 * radius) - 2 * borderWidth;
                } else {
                    rectangle[0] = rectangle[0] + borderWidth;
                    rectangle[1] = rectangle[1] + borderWidth;
                    rectangle[2] = rectangle[2] - this.border.width;
                    rectangle[3] = this.bounds.height - this.border.width;
                }

            }
        } else {
            if (!this._isBounds && this._dictionary.has('RD')) {
                const array: number[] = this._dictionary.getArray('RD');
                if (array) {
                    rectangle[0] = rectangle[0] + array[0];
                    rectangle[1] = rectangle[1] + borderWidth + array[1];
                    rectangle[2] = rectangle[2] - (2 * array[2]);
                    rectangle[3] = rectangle[3] - this.border.width;
                    rectangle[3] = rectangle[3] - (2 * array[3]);
                }
            } else {
                rectangle[1] = rectangle[1] + borderWidth;
                rectangle[3] = this.bounds.height - this.border.width;
            }
        }
        return rectangle;
    }
    _createRectangleAppearance(borderEffect: PdfBorderEffect): PdfTemplate {
        const width: number = this.border.width;
        let rdArray: number[] = this._dictionary.getArray('RD');
        if (!rdArray && borderEffect.intensity !== 0 && borderEffect.style === PdfBorderEffectStyle.cloudy) {
            const cloudRectangle: {x: number,
                y: number,
                width: number,
                height: number} = {x: this.bounds.x - borderEffect.intensity * 5 - width / 2,
                y: this.bounds.y - borderEffect.intensity * 5 - width / 2,
                width: this.bounds.width + borderEffect.intensity * 10 + width,
                height: this.bounds.height + borderEffect.intensity * 10 + width};
            const radius: number = borderEffect.intensity * 5;
            rdArray = [radius + width / 2, radius + width / 2, radius + width / 2, radius + width / 2];
            this._dictionary.set('RD', rdArray);
            this.bounds = cloudRectangle;
        }
        if (!this._isBounds && rdArray) {
            const cloudRectangle: {x: number, y: number, width: number, height: number} = {x: this.bounds.x + rdArray[0],
                y: this.bounds.y + rdArray[1],
                width: this.bounds.width - rdArray[2] * 2,
                height: this.bounds.height - rdArray[3] * 2};
            if (borderEffect.intensity !== 0 && borderEffect.style === PdfBorderEffectStyle.cloudy) {
                cloudRectangle.x = cloudRectangle.x - borderEffect.intensity * 5 - width / 2;
                cloudRectangle.y = cloudRectangle.y - borderEffect.intensity * 5 - width / 2;
                cloudRectangle.width = cloudRectangle.width + borderEffect.intensity * 10 + width;
                cloudRectangle.height = cloudRectangle.height + borderEffect.intensity * 10 + width;
                const radius: number = borderEffect.intensity * 5;
                this._dictionary.set('RD', [radius + width / 2, radius + width / 2, radius + width / 2, radius + width / 2]);
            } else {
                delete this._dictionary._map.RD;
            }
            this.bounds = cloudRectangle;
        }
        const borderWidth: number = width / 2;
        const nativeRectangle: number[] = [0, 0, this.bounds.width, this.bounds.height];
        const template: PdfTemplate = new PdfTemplate(nativeRectangle, this._crossReference);
        _setMatrix(template, this._getRotationAngle());
        if (borderEffect.intensity !== 0 && borderEffect.style === PdfBorderEffectStyle.cloudy) {
            template._writeTransformation = false;
        }
        const graphics: PdfGraphics = template.graphics;
        const parameter: _PaintParameter = new _PaintParameter();
        if (this.innerColor) {
            parameter.backBrush = new PdfBrush(this._innerColor);
        }
        if (width > 0 && this.color) {
            parameter.borderPen = new PdfPen(this._color, width);
        }
        if (this.color) {
            parameter.foreBrush = new PdfBrush(this._color);
        }
        const rectangle:  number[] = this._obtainStyle(parameter.borderPen, nativeRectangle, borderWidth, borderEffect);
        if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
            graphics.save();
            graphics.setTransparency(this._opacity);
        }
        if (borderEffect.intensity !== 0 && borderEffect.style === PdfBorderEffectStyle.cloudy) {
            this._drawRectangleAppearance(rectangle, graphics, parameter, borderEffect.intensity);
        } else {
            graphics.drawRectangle(rectangle[0], rectangle[1], rectangle[2], rectangle[3], parameter.borderPen, parameter.backBrush);
        }
        if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
            graphics.restore();
        }
        return template;
    }
    _drawRectangleAppearance(rectangle: number[], graphics: PdfGraphics, parameter: _PaintParameter, intensity: number): void {
        let graphicsPath: PdfPath = new PdfPath();
        graphicsPath.addRectangle(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);
        const radius: number = intensity * 4.25;
        if (radius > 0) {
            const points: Array<number[]> = [];
            for (let i: number = 0; i < graphicsPath._points.length; i++) {
                const sublist: number[] = [graphicsPath._points[Number.parseInt(i.toString(), 10)][0],
                    -graphicsPath._points[Number.parseInt(i.toString(), 10)][1]];
                points.push(sublist);
            }
            graphicsPath = new PdfPath();
            graphicsPath.addPolygon(points);
            this._drawCloudStyle(graphics, parameter.backBrush, parameter.borderPen, radius, 0.833, graphicsPath._points, false);
        } else {
            graphics.drawRectangle(rectangle[0], rectangle[1], rectangle[2], rectangle[3], parameter.borderPen, parameter.backBrush);
        }
    }
    _createCircleAppearance(): PdfTemplate {
        const nativeBounds: number[] = [0, 0, this.bounds.width, this.bounds.height];
        const template: PdfTemplate = new PdfTemplate(nativeBounds, this._crossReference);
        _setMatrix(template, this._getRotationAngle());
        if (this._dictionary.has('BE')) {
            template._writeTransformation = false;
        }
        if (typeof this.color === 'undefined') {
            this._isTransparentColor = true;
        }
        const graphics: PdfGraphics = template.graphics;
        const width: number = this.border.width;
        const borderPen: PdfPen = new PdfPen(this.color, width);
        const parameter: _PaintParameter = new _PaintParameter();
        if (this.innerColor) {
            parameter.backBrush = new PdfBrush(this._innerColor);
        }
        if (width > 0) {
            parameter.borderPen = borderPen;
        }
        if (this.color) {
            parameter.foreBrush = new PdfBrush(this._color);
        }
        parameter.borderWidth = width;
        const borderWidth: number = width / 2;
        const rectangle:  number[] = this._obtainStyle(borderPen, nativeBounds, borderWidth);
        if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
            graphics.save();
            graphics.setTransparency(this._opacity);
        }
        if (this._dictionary.has('BE')) {
            this._drawCircleAppearance(rectangle, borderWidth, graphics, parameter);
        } else {
            graphics.drawEllipse(rectangle[0] + borderWidth,
                                 rectangle[1],
                                 rectangle[2] - width,
                                 rectangle[3],
                                 parameter.borderPen,
                                 parameter.backBrush);
        }
        if (typeof this._opacity !== 'undefined' && this._opacity < 1) {
            graphics.restore();
        }
        return template;
    }
    _drawCircleAppearance(rectangle: number[], borderWidth: number, graphics: PdfGraphics, parameter: _PaintParameter): void {
        let radius: number = 0;
        if (this._dictionary.has('RD')) {
            const array: number[] = this._dictionary.getArray('RD');
            if (array && array.length > 0) {
                radius = array[0];
            }
        }
        if (radius > 0) {
            const rect: number[] = [rectangle[0] + borderWidth,
                -rectangle[1] - rectangle[3],
                rectangle[2] - this.border.width,
                rectangle[3]];
            const left: number = rect[0];
            const top: number = rect[1];
            const right: number = rect[0] + rect[2];
            const bottom: number = rect[1] + rect[3];
            const controlPointList: Array<number[]> = [];
            controlPointList.push([right, bottom]);
            controlPointList.push([left, bottom]);
            controlPointList.push([left, top]);
            controlPointList.push([right, top]);
            const startPointList: Array<number[]> = [];
            startPointList.push([right, top + (rect[3] / 2)]);
            startPointList.push([left + rect[2] / 2, bottom]);
            startPointList.push([left, top + (rect[3] / 2)]);
            startPointList.push([left + (rect[2] / 2), top]);
            const endPointList: Array<number[]> = [];
            endPointList.push([left + rect[2] / 2, bottom]);
            endPointList.push([left, top + (rect[3] / 2)]);
            endPointList.push([left + (rect[2] / 2), top]);
            endPointList.push([right, top + (rect[3] / 2)]);
            const points: Array<number[]> = [];
            for (let i: number = 0; i < controlPointList.length; i++) {
                this._createBezier(startPointList[Number.parseInt(i.toString(), 10)],
                                   controlPointList[Number.parseInt(i.toString(), 10)],
                                   endPointList[Number.parseInt(i.toString(), 10)],
                                   points);
            }
            this._drawCloudStyle(graphics, parameter.backBrush, parameter.borderPen, radius, 0.833, points, false);
        } else {
            graphics.drawEllipse(rectangle[0] + borderWidth,
                                 -rectangle[1],
                                 rectangle[2] - this.border.width,
                                 -rectangle[3],
                                 parameter.borderPen,
                                 parameter.backBrush);
        }
    }
    _createBezier(first: number[], second: number[], third: number[], bezierPoints: Array<number[]>): void {
        bezierPoints.push(first);
        this._populateBezierPoints(first, second, third, 0, bezierPoints);
        bezierPoints.push(third);
    }
    _populateBezierPoints(first: number[],
                          second: number[],
                          third: number[],
                          currentIteration: number,
                          bezierPoints: Array<number[]>): void {
        if (currentIteration < 2) {
            const midPoint1: number[] = this._midPoint(first, second);
            const midPoint2: number[] = this._midPoint(second, third);
            const midPoint3: number[] = this._midPoint(midPoint1, midPoint2);
            currentIteration++;
            this._populateBezierPoints(first, midPoint1, midPoint3, currentIteration, bezierPoints);
            bezierPoints.push(midPoint3);
            this._populateBezierPoints(midPoint3, midPoint2, third, currentIteration, bezierPoints);
        }
    }
    _midPoint(first: number[], second: number[]): number[] {
        return [(first[0] + second[0]) / 2, (first[1] + second[1]) / 2];
    }
    _getAngle(linePoints: number[]): number {
        const x1: number = linePoints[0];
        const y1: number = linePoints[1];
        const x2: number = linePoints[2];
        const y2: number = linePoints[3];
        let angle: number = 0;
        if (x2 - x1 === 0) {
            angle = (y2 > y1) ? 90 : 270;
        } else {
            const angleRatio: number = (y2 - y1) / (x2 - x1);
            const radians: number = Math.atan(angleRatio);
            angle = radians * (180 / Math.PI);
            if ((x2 - x1) < 0 || (y2 - y1) < 0) {
                angle += 180;
            }
            if ((x2 - x1) > 0 && (y2 - y1) < 0) {
                angle -= 180;
            }
            if (angle < 0) {
                angle += 360;
            }
        }
        return angle;
    }
    _getAxisValue(value: number[], angle: number, length: number): number[] {
        return [value[0] + Math.cos(angle * this._degreeToRadian) * length,
            value[1] + Math.sin(angle * this._degreeToRadian) * length];
    }
    _drawLineEndStyle(axisPoint: number[],
                      graphics: PdfGraphics,
                      angle: number,
                      pen: PdfPen,
                      brush: PdfBrush,
                      style: PdfLineEndingStyle,
                      length: number, isBegin: boolean): void {
        let arraowAngle: number;
        let count: number;
        let startPoint: number[];
        let first: number[];
        let second: number[];
        let third: number[];
        let fourth: number[];
        let path: PdfPath;
        switch (style) {
        case PdfLineEndingStyle.square:
            graphics.drawRectangle(axisPoint[0] - (3 * length),
                                   -(axisPoint[1] + (3 * length)),
                                   (6 * length),
                                   (6 * length),
                                   pen,
                                   brush);
            break;
        case PdfLineEndingStyle.circle:
            graphics.drawEllipse(axisPoint[0] - (3 * length),
                                 -(axisPoint[1] + (3 * length)),
                                 (6 * length),
                                 (6 * length),
                                 pen,
                                 brush);
            break;
        case PdfLineEndingStyle.openArrow:
            arraowAngle = isBegin ? 30 : 150;
            count = 9 * length;
            startPoint = this._getAxisValue(axisPoint, angle, (isBegin ? length : (-length)));
            first = this._getAxisValue(startPoint, (angle + arraowAngle), count);
            second = this._getAxisValue(startPoint, (angle - arraowAngle), count);
            path = new PdfPath();
            path._pen = pen;
            path.addLine(startPoint[0], -startPoint[1], first[0], -first[1]);
            path.addLine(startPoint[0], -startPoint[1], second[0], -second[1]);
            graphics._stateControl(pen, null, null);
            graphics._buildUpPath(path._points, path._pathTypes);
            graphics._drawGraphicsPath(pen, null, path._fillMode, false);
            break;
        case PdfLineEndingStyle.closedArrow:
            arraowAngle = isBegin ? 30 : 150;
            count = 9 * length;
            startPoint = this._getAxisValue(axisPoint, angle, (isBegin ? length : (-length)));
            first = this._getAxisValue(startPoint, (angle + arraowAngle), count);
            second = this._getAxisValue(startPoint, (angle - arraowAngle), count);
            graphics.drawPolygon([[startPoint[0], -startPoint[1]], [first[0], -first[1]], [second[0], -second[1]]], pen, brush);
            break;
        case PdfLineEndingStyle.rOpenArrow:
            arraowAngle = isBegin ? 150 : 30;
            count = 9 * length;
            startPoint = this._getAxisValue(axisPoint, angle, (isBegin ? (-length) : length));
            first = this._getAxisValue(startPoint, (angle + arraowAngle), count);
            second = this._getAxisValue(startPoint, (angle - arraowAngle), count);
            path = new PdfPath();
            path._pen = pen;
            path.addLine(startPoint[0], -startPoint[1], first[0], -first[1]);
            path.addLine(startPoint[0], -startPoint[1], second[0], -second[1]);
            graphics._stateControl(pen, null, null);
            graphics._buildUpPath(path._points, path._pathTypes);
            graphics._drawGraphicsPath(pen, null, path._fillMode, false);
            break;
        case PdfLineEndingStyle.rClosedArrow:
            arraowAngle = isBegin ? 150 : 30;
            count = 9 * length;
            startPoint = this._getAxisValue(axisPoint, angle, (isBegin ? (-length) : length));
            first = this._getAxisValue(startPoint, (angle + arraowAngle), count);
            second = this._getAxisValue(startPoint, (angle - arraowAngle), count);
            graphics.drawPolygon([[startPoint[0], -startPoint[1]], [first[0], -first[1]], [second[0], -second[1]]], pen, brush);
            break;
        case PdfLineEndingStyle.slash:
            count = 9 * length;
            first = this._getAxisValue(startPoint, (angle + 60), count);
            second = this._getAxisValue(startPoint, (angle - 120), count);
            graphics.drawLine(pen, axisPoint[0], -axisPoint[1], first[0], -first[1]);
            graphics.drawLine(pen, axisPoint[0], -axisPoint[1], second[0], -second[1]);
            break;
        case PdfLineEndingStyle.diamond:
            count = 3 * length;
            first = this._getAxisValue(axisPoint, 180, count);
            second = this._getAxisValue(axisPoint, 90, count);
            third = this._getAxisValue(axisPoint, 0, count);
            fourth = this._getAxisValue(axisPoint, -90, count);
            graphics.drawPolygon([[first[0], -first[1]], [second[0], -second[1]], [third[0], -third[1]], [fourth[0], -fourth[1]]],
                                 pen,
                                 brush);
            break;
        case PdfLineEndingStyle.butt:
            count = 3 * length;
            first = this._getAxisValue(axisPoint, (angle + 90), count);
            second = this._getAxisValue(axisPoint, (angle - 90), count);
            graphics.drawLine(pen, first[0], -first[1], second[0], -second[1]);
            break;
        }
    }
    _drawLineStyle(start: number[],
                   end: number[],
                   graphics: PdfGraphics,
                   angle: number,
                   pen: PdfPen,
                   brush: PdfBrush,
                   lineStyle: PdfAnnotationLineEndingStyle,
                   length: number): void {
        if (length === 0) {
            length = 1;
            pen = null;
        }
        this._drawLineEndStyle(start, graphics, angle, pen, brush, lineStyle.begin, length, true);
        this._drawLineEndStyle(end, graphics, angle, pen, brush, lineStyle.end, length, false);
    }
    _obtainFontDetails(): { name: string, size: number, style: PdfFontStyle } {
        let fontFamily: string = '';
        let fontSize: number;
        let style: PdfFontStyle = PdfFontStyle.regular;
        if (this._dictionary.has('DS') || this._dictionary.has('DA')) {
            let fontStyle: string;
            if (this._dictionary.has('DS')) {
                const collection: string[] = this._dictionary.get('DS').split(';');
                for (let i: number = 0; i < collection.length; i++) {
                    const entry: string[] = collection[Number.parseInt(i.toString(), 10)].split(':');
                    if (collection[Number.parseInt(i.toString(), 10)].indexOf('font-family') !== -1) {
                        fontFamily = entry[1];
                    } else if (collection[Number.parseInt(i.toString(), 10)].indexOf('font-size') !== -1) {
                        if (entry[1].endsWith('pt')) {
                            fontSize = Number.parseFloat(entry[1].replace('pt', ''));
                        }
                    } else if (collection[Number.parseInt(i.toString(), 10)].indexOf('font-style') !== -1 || collection[Number.parseInt(i.toString(), 10)].indexOf('style') !== -1) {
                        fontStyle = entry[1];
                    } else if (collection[Number.parseInt(i.toString(), 10)].indexOf('font') !== -1) {
                        const name: string = entry[1];
                        const split: string[] = name.split(' ');
                        for (let j: number = 0; j < split.length; j++) {
                            if (split[Number.parseInt(j.toString(), 10)] !== '' && !split[Number.parseInt(j.toString(), 10)].endsWith('pt')) {
                                fontFamily += split[Number.parseInt(j.toString(), 10)] + ' ';
                            }
                            if (split[Number.parseInt(j.toString(), 10)].endsWith('pt')) {
                                fontSize = Number.parseFloat(split[Number.parseInt(j.toString(), 10)].replace('pt', ''));
                            }
                        }
                        while (fontFamily !== ' ' && fontFamily.endsWith(' ')) {
                            fontFamily = fontFamily.substring(0, fontFamily.length - 1);
                        }
                        if (fontFamily.indexOf(',') !== -1) {
                            fontFamily = fontFamily.split(',')[0];
                        }
                    }
                }
            } else {
                const value: string = this._dictionary.get('DA');
                if (value && value !== '' && value.indexOf('Tf') !== -1) {
                    const textCollection: string[] = value.split(' ');
                    for (let i: number = 0; i < textCollection.length; i++) {
                        if (textCollection[Number.parseInt(i.toString(), 10)].indexOf('Tf') !== -1) {
                            fontFamily = textCollection[i - 2];
                            while (fontFamily !== '' && fontFamily.length > 1 && fontFamily[0] === '/') {
                                fontFamily = fontFamily.substring(1);
                            }
                            fontSize = Number.parseFloat(textCollection[i - 1]);
                        }
                    }
                }
            }
            if (fontStyle && fontStyle !== '') {
                let styleArray: string[] = [fontStyle];
                if (fontStyle.includes(':')) {
                    styleArray = fontStyle.split(':');
                } else if (fontStyle.includes(',')) {
                    styleArray = fontStyle.split(',');
                }
                if (styleArray) {
                    styleArray.forEach((entry: string) => {
                        entry = entry.trim();
                        switch (entry.toLowerCase()) {
                        case 'bold':
                            style |= PdfFontStyle.bold;
                            break;
                        case 'italic':
                            style |= PdfFontStyle.italic;
                            break;
                        case 'strikeout':
                            style |= PdfFontStyle.strikeout;
                            break;
                        case 'underline':
                            style |= PdfFontStyle.underline;
                            break;
                        }
                    });
                }
            }
            if (fontFamily) {
                fontFamily = fontFamily.trim();
            }
        }
        return { name: fontFamily, size: fontSize, style: style };
    }
    _obtainFont(): PdfFont {
        const fontData: {name: string, size: number, style: PdfFontStyle} = this._obtainFontDetails();
        return _mapFont(fontData.name, fontData.size, fontData.style, this);
    }
    _getEqualPdfGraphicsUnit(measurementUnit: PdfMeasurementUnit,
                             unitString: string): {graphicsUnit: _PdfGraphicsUnit, unitString: string} {
        let graphicsUnit: _PdfGraphicsUnit;
        switch (measurementUnit) {
        case PdfMeasurementUnit.inch:
            graphicsUnit = _PdfGraphicsUnit.inch;
            unitString = 'in';
            break;
        case PdfMeasurementUnit.centimeter:
            graphicsUnit = _PdfGraphicsUnit.centimeter;
            unitString = 'cm';
            break;
        case PdfMeasurementUnit.millimeter:
            graphicsUnit = _PdfGraphicsUnit.millimeter;
            unitString = 'mm';
            break;
        case PdfMeasurementUnit.pica:
            graphicsUnit = _PdfGraphicsUnit.pica;
            unitString = 'p';
            break;
        case PdfMeasurementUnit.point:
            graphicsUnit = _PdfGraphicsUnit.point;
            unitString = 'pt';
            break;
        default:
            graphicsUnit = _PdfGraphicsUnit.inch;
            unitString = 'in';
            break;
        }
        return {graphicsUnit: graphicsUnit, unitString: unitString};
    }
    _createMeasureDictionary(unitString: string): _PdfDictionary {
        const d: _PdfDictionary = new _PdfDictionary();
        d.set('C', 1);
        d.set('D', 100);
        d.set('F', _PdfName.get('D'));
        d.set('RD', '.');
        d.set('RT', '');
        d.set('SS', '');
        d.set('U', unitString);
        const a: _PdfDictionary = new _PdfDictionary();
        a.set('C', 1);
        a.set('D', 100);
        a.set('F', _PdfName.get('D'));
        a.set('RD', '.');
        a.set('RT', '');
        a.set('SS', '');
        a.set('U', 'sq ' + unitString);
        const x: _PdfDictionary = new _PdfDictionary();
        if (unitString === 'in') {
            x.set('C', 0.0138889);
        } else if (unitString === 'cm') {
            x.set('C', 0.0352778);
        } else if (unitString === 'mm') {
            x.set('C', 0.352778);
        } else if (unitString === 'pt') {
            x.set('C', 1);
        } else if (unitString === 'p') {
            x.set('C', 0.0833333);
        }
        x.set('D', 100);
        x.set('F', _PdfName.get('D'));
        x.set('RD', '.');
        x.set('RT', '');
        x.set('SS', '');
        x.set('U', unitString);
        const measureDictionary: _PdfDictionary = new _PdfDictionary();
        measureDictionary.set('A', [a]);
        measureDictionary.set('D', [d]);
        measureDictionary.set('R', '1 ' + unitString + ' = 1 ' + unitString);
        measureDictionary.set('Type',  _PdfName.get('Measure'));
        measureDictionary.set('X', [x]);
        return measureDictionary;
    }
    _colorToHex(col: number[]): string {
        if (col) {
            return '#' + this._componentToHex(col[0]) + this._componentToHex(col[1]) + this._componentToHex(col[2]);
        } else {
            return '#' + this._componentToHex(0) + this._componentToHex(0) + this._componentToHex(0);
        }
    }
    _componentToHex(c: number): string {
        const hex: string = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    _getRotatedBounds(bounds: { x: number, y: number, width: number, height: number },
                      rotateAngle: number): { x: number, y: number, width: number, height: number } {
        if (bounds.width > 0 && bounds.height > 0) {
            const matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
            matrix._rotate(rotateAngle);
            const corners: Array<number[]> = [];
            corners.push([bounds.x, bounds.y]);
            corners.push([bounds.x + bounds.width, bounds.y]);
            corners.push([bounds.x + bounds.width, bounds.y + bounds.height]);
            corners.push([bounds.x, bounds.y + bounds.height]);
            for (let i: number = 0; i < corners.length; i++) {
                corners[Number.parseInt(i.toString(), 10)] = matrix._matrix._transform(corners[Number.parseInt(i.toString(), 10)]);
            }
            const path: PdfPath = new PdfPath();
            path.addRectangle(bounds.x, bounds.y, bounds.width, bounds.height);
            for (let i: number = 0; i < 4; i++) {
                path._points[Number.parseInt(i.toString(), 10)] = corners[Number.parseInt(i.toString(), 10)];
            }
            let minX: number = corners[0][0];
            let maxX: number = corners[3][0];
            let minY: number = corners[0][1];
            let maxY: number = corners[3][1];
            for (let i: number = 0; i < 4; i++) {
                if (corners[Number.parseInt(i.toString(), 10)][0] < minX) {
                    minX = corners[Number.parseInt(i.toString(), 10)][0];
                }
                if (corners[Number.parseInt(i.toString(), 10)][0] > maxX) {
                    maxX = corners[Number.parseInt(i.toString(), 10)][0];
                }
                if (corners[Number.parseInt(i.toString(), 10)][1] < minY) {
                    minY = corners[Number.parseInt(i.toString(), 10)][1];
                }
                if (corners[Number.parseInt(i.toString(), 10)][1] > maxY) {
                    maxY = corners[Number.parseInt(i.toString(), 10)][1];
                }
            }
            return { x: bounds.x, y: bounds.y, width: maxX - minX, height: maxY - minY };
        }
        return bounds;
    }
    _flattenPopUp(): void {
        this._flattenPop(this._page, this.color, this.bounds, this.border, this.author, this.subject, this.text);
    }
    _flattenPop(_page: PdfPage,
                color: number[],
                boundsValue: { x: number, y: number, width: number, height: number },
                border: PdfAnnotationBorder,
                author: string,
                subject: string,
                text: string): void {
        let clientSize: number[] = [0, 0];
        clientSize = _page.size;
        const x: number = clientSize[0] - 180;
        const annotBounds: { x: number, y: number, width: number, height: number } = boundsValue;
        const y: number = (annotBounds.y + 142) < clientSize[1] ? annotBounds.y : clientSize[1] - 142;
        let bounds: number[] = [x, y, 180, 142];
        if (this._dictionary.has('Popup')) {
            const dictionary: _PdfDictionary = this._dictionary.get('Popup');
            if (dictionary) {
                const rectValue: number[] = this._dictionary.getArray('Rect');
                if (rectValue && rectValue.length === 4) {
                    const left: number = rectValue[0] as number;
                    const top: number = rectValue[1] as number;
                    const width: number = rectValue[2] as number;
                    const height: number = rectValue[3] as number;
                    bounds = [left, top, width - left, height - top];
                }
            }
        }
        if (typeof color === 'undefined') {
            color = [0, 0, 0];
        }
        const backBrush: PdfBrush = new PdfBrush(color);
        const borderWidth: number = border.width / 2;
        const pen: PdfPen = new PdfPen([0, 0, 0], 1);
        let track: number = 0;
        const aBrush: PdfBrush = new PdfBrush(this._getForeColor(color));
        if (typeof author !== 'undefined' && author !== null && author !== '') {
            track = this._drawAuthor(author, subject, bounds, backBrush, aBrush, _page, track, border);
        } else if (typeof subject !== 'undefined' && subject !== null && subject !== '') {
            const titleRect: number[] = [bounds[0] + borderWidth, bounds[1] + borderWidth, bounds[2] - border.width, 40];
            this._saveGraphics(_page, PdfBlendMode.hardLight);
            if (this._isTransparentColor) {
                _page.graphics.drawRectangle(titleRect[0], titleRect[1], titleRect[2], titleRect[3], pen);
            } else {
                _page.graphics.drawRectangle(titleRect[0], titleRect[1], titleRect[2], titleRect[3], pen, backBrush);
            }
            _page.graphics.restore();
            let contentRect: number[] = [titleRect[0] + 11, titleRect[1], titleRect[2], titleRect[3] / 2];
            contentRect = [contentRect[0], (contentRect[1] + contentRect[3] - 2), contentRect[2], titleRect[3] / 2];
            this._saveGraphics(_page, PdfBlendMode.normal);
            this._drawSubject(subject, contentRect, _page);
            _page.graphics.restore();
            track = 40;
        } else {
            this._saveGraphics(_page, PdfBlendMode.hardLight);
            const titleRect: number[] = [bounds[0] + borderWidth, bounds[1] + borderWidth, bounds[2] - border.width, 20];
            if (this._isTransparentColor) {
                _page.graphics.drawRectangle(titleRect[0], titleRect[1], titleRect[2], titleRect[3], pen);
            } else {
                _page.graphics.drawRectangle(titleRect[0], titleRect[1], titleRect[2], titleRect[3], pen, backBrush);
            }
            track = 20;
            _page.graphics.restore();
        }
        const rect: number[] = [bounds[0] + borderWidth, bounds[1] + borderWidth + track,
            bounds[2] - border.width, bounds[3] - (track + border.width)];
        this._saveGraphics(_page, PdfBlendMode.hardLight);
        _page.graphics.drawRectangle(rect[0], rect[1], rect[2], rect[3], new PdfPen([0, 0, 0], 1), new PdfBrush([255, 255, 255]));
        rect[0] += 11;
        rect[1] += 5;
        rect[2] -= 22;
        _page.graphics.restore();
        this._saveGraphics(_page, PdfBlendMode.normal);
        if (typeof text !== 'undefined' && text !== null && text !== '') {
            _page.graphics.drawString(text, this._popUpFont, rect, null, new PdfBrush([0, 0, 0]), null);
        }
        _page.graphics.restore();
    }
    _flattenLoadedPopUp(): void {
        let content: string = '';
        if (this._dictionary.has('Contents')) {
            content = this._dictionary.get('Contents');
        }
        const author: string = this.author;
        const subject: string = this.subject;
        const pen: PdfPen = new PdfPen([0, 0, 0], 1);
        if (!this._dictionary.has('Popup')) {
            this._flattenPop(this._page, this.color, this.bounds, this.border, author, subject, content);
            this._page.annotations.remove(this);
        } else {
            const bounds: number[] = this._getRectangleBoundsValue();
            if (typeof this.color === 'undefined') {
                this.color = [0, 0, 0];
            }
            const backBrush: PdfBrush = new PdfBrush(this.color);
            const borderWidth: number = this.border.width / 2;
            let track: number = 0;
            const aBrush: PdfBrush = new PdfBrush(this._getForeColor(this.color));
            if (typeof this.author !== 'undefined' && this.author !== null && this.author !== '') {
                track = this._drawAuthor(this.author, this.subject, bounds, backBrush, aBrush, this._page, track, this.border);
            } else if (typeof this.subject !== 'undefined' && this.subject !== null && this.subject !== '') {
                const titleRect: number[] = [bounds[0] + borderWidth, bounds[1] + borderWidth, bounds[2] - this.border.width, 40];
                this._saveGraphics(this._page, PdfBlendMode.hardLight);
                this._page.graphics.drawRectangle(titleRect[0], titleRect[1], titleRect[2], titleRect[3], pen, backBrush);
                this._page.graphics.restore();
                let contentRect: number[] = [titleRect[0] + 11, titleRect[1], titleRect[2], titleRect[3] / 2];
                contentRect = [contentRect[0], (contentRect[1] + contentRect[3] - 2), contentRect[2], titleRect[3] / 2];
                this._saveGraphics(this._page, PdfBlendMode.normal);
                this._drawSubject(this.subject, contentRect, this._page);
                track = 40;
                this._page.graphics.restore();
            } else {
                this._saveGraphics(this._page, PdfBlendMode.hardLight);
                const titleRect: number[] = [bounds[0] + borderWidth, bounds[1] + borderWidth, bounds[2] - this.border.width, 20];
                this._page.graphics.drawRectangle(titleRect[0], titleRect[1], titleRect[2], titleRect[3], pen, backBrush);
                track = 20;
                this._page.graphics.restore();
            }
            this._saveGraphics(this._page, PdfBlendMode.hardLight);
            const rect: number[] = [bounds[0] + borderWidth, bounds[1] + borderWidth + track,
                bounds[2] - this.border.width, bounds[3] - (track + this.border.width)];
            this._page.graphics.drawRectangle(rect[0], rect[1], rect[2], rect[3], pen, new PdfBrush([255, 255, 255]));
            rect[0] += 11;
            rect[1] += 5;
            rect[2] -= 22;
            this._page.graphics.restore();
            this._saveGraphics(this._page, PdfBlendMode.normal);
            this._page.graphics.restore();
            //let xmlData: Array<any> = Array<any>();
            // if (this._dictionary.has('RC')) {
            //     //xmlData = this.parseXMLData();
            // }
            // if (xmlData !== null) {
            //     // Need to add xml data code
            // } else {
            if (typeof content !== 'undefined' && content !== null && content !== '') {
                this._page.graphics.drawString(content, this._popUpFont, rect, null, new PdfBrush([0, 0, 0]), null);
            }
            // }
            this._page.graphics.restore();
            this._page.annotations.remove(this);
        }
    }
    _getRectangleBoundsValue(): number[] {
        if (this._dictionary.has('Popup')) {
            const dic: _PdfDictionary = this._dictionary.get('Popup');
            const rect: number[] = dic.getArray('Rect');
            if (rect !== null) {
                if (this._page !== null) {
                    if (rect[1] === 0 && rect[3] === 0) {
                        rect[1] = rect[1] + rect[3];
                    } else {
                        rect[1] = this._page._size[1] - (rect[1] + rect[3]);
                    }
                } else {
                    rect[1] = (rect[1] - rect[3]);
                }
                return rect;
            }
            else {
                return [0, 0, 0, 0];
            }
        }
        else {
            return [0, 0, 0, 0];
        }
    }
    _getForeColor(color: number[]): number[] {
        const fore: number[] = (((color[0] + color[1] + color[2]) / 3) > 128) ? [0, 0, 0] : [255, 255, 255];
        return fore;
    }
    _drawAuthor(author: string,
                subject: string,
                bounds: number[],
                backBrush: PdfBrush,
                aBrush: PdfBrush,
                _page: PdfPage,
                trackingHeight: number,
                border: PdfAnnotationBorder) : number {
        const borderWidth: number = this.border.width / 2;
        const pen: PdfPen = new PdfPen([0, 0, 0], 1);
        const format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.middle);
        const titleRect: number[] = [bounds[0] + borderWidth, bounds[1] + borderWidth, bounds[2] - border.width, 20];
        if (typeof subject !== 'undefined' && subject !== null && subject !== '') {
            titleRect[3] += 20;
            trackingHeight = titleRect[3];
            this._saveGraphics(_page, PdfBlendMode.hardLight);
            if (this._isTransparentColor) {
                _page.graphics.drawRectangle(titleRect[0], titleRect[1], titleRect[2], titleRect[3], pen);
            } else {
                _page.graphics.drawRectangle(titleRect[0], titleRect[1], titleRect[2], titleRect[3], pen, backBrush);
            }
            _page.graphics.restore();
            let contentRect: number[] = [titleRect[0] + 11, titleRect[1], titleRect[2], titleRect[3] / 2];
            this._saveGraphics(this._page, PdfBlendMode.normal);
            _page.graphics.drawString(author, this._authorBoldFont, contentRect, null, aBrush, format);
            contentRect = [contentRect[0], (contentRect[1] + contentRect[3] - 2), contentRect[2], titleRect[3] / 2];
            this._drawSubject(subject, contentRect, _page);
            _page.graphics.restore();
        } else {
            this._saveGraphics(_page, PdfBlendMode.hardLight);
            if (this._isTransparentColor) {
                _page.graphics.drawRectangle(titleRect[0], titleRect[1], titleRect[2], titleRect[3], pen);
            } else {
                _page.graphics.drawRectangle(titleRect[0], titleRect[1], titleRect[2], titleRect[3], pen, backBrush);
            }
            _page.graphics.restore();
            const contentRect: number[] = [titleRect[0] + 11, titleRect[1], titleRect[2], titleRect[3]];
            this._saveGraphics(_page, PdfBlendMode.normal);
            _page.graphics.drawString(author, this._popUpFont, contentRect, null, aBrush, format);
            trackingHeight = titleRect[3];
            _page.graphics.restore();
        }
        return trackingHeight;
    }
    _drawSubject(subject: string, contentRect: number[], _page: PdfPage): void {
        const format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.middle);
        _page.graphics.drawString(subject, this._authorBoldFont, contentRect, null, new PdfBrush([0, 0, 0]), format);
    }
    _saveGraphics(_page: PdfPage, blendMode: PdfBlendMode): void {
        _page.graphics.save();
        _page.graphics.setTransparency(0.8, 0.8, blendMode);
    }
    _getBorderColorString(color: number[]): string {
        return (color[0] / 255).toFixed(3) + ' ' + (color[1] / 255).toFixed(3) + ' ' + (color[2] / 255).toFixed(3) + ' rg ';
    }
    _stringToDate(date: string): Date {
        let dateFormat: Date = new Date();
        if (date[0] === 'D' && date[1] === ':') {
            const year: string = date.substring(2, 6);
            const month: string = date.substring(6, 8);
            const day: string = date.substring(8, 10);
            const hour: string = date.substring(10, 12);
            const minute: string = date.substring(12, 14);
            const second: string = date.substring(14, 16);
            let difference: number = 0;
            if (date.length === 23) {
                const timeZone: string = date.substring(16, 22);
                if (timeZone !== '+05\'30\'') {
                    const signature: string = timeZone[0];
                    const timeZoneHour: string = timeZone.substring(1, 3);
                    const timeZonMinute: string = timeZone.substring(4, 6);
                    difference = 5.5 - (signature === '-' ? -1 : 1) * (parseInt(timeZoneHour, 10) + (parseInt(timeZonMinute, 10) / 60));
                }
            }
            dateFormat = new Date(year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second);
            if (difference !== 0) {
                dateFormat.setTime(dateFormat.getTime() + (difference * 60 * 60 * 1000));
            }
        } else if (date.indexOf('/') !== -1) {
            const list: string[] = date.split('/');
            const year: string = list[2].split(' ')[0];
            let month: string = list[0];
            if (month !== '10' && month !== '11' && month !== '12') {
                month = '0' + month;
            }
            const day: string = list[1];
            const hour: string = list[2].split(' ')[1].split(':')[0];
            const minute: string = list[2].split(' ')[1].split(':')[1];
            const second: string = list[2].split(' ')[1].split(':')[2];
            dateFormat = new Date(year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second);
        } else {
            dateFormat = new Date(date);
        }
        return dateFormat;
    }
    _dateToString(dateTime: Date): string {
        let month: string = (dateTime.getMonth() + 1).toString();
        if (month !== '10' && month !== '11' && month !== '12') {
            month = '0' + month;
        }
        let date: string = (dateTime.getDate()).toString();
        if (Number.parseInt(date) < 10) { // eslint-disable-line
            date = '0' + date;
        }
        let hours: string = (dateTime.getHours()).toString();
        if (Number.parseInt(hours) < 10) { // eslint-disable-line
            hours = '0' + hours;
        }
        let minutes: string = (dateTime.getMinutes()).toString();
        if (Number.parseInt(minutes) < 10) { // eslint-disable-line
            minutes = '0' + minutes;
        }
        let seconds: string = (dateTime.getSeconds()).toString();
        if (Number.parseInt(seconds) < 10) { // eslint-disable-line
            seconds = '0' + seconds;
        }
        return 'D:' + dateTime.getFullYear().toString() + month + date + hours + minutes + seconds + '+05\'30\'';
    }
    _obtainNativeRectangle(): number[] {
        const rect: number[] = [this._bounds.x, this._bounds.y, this.bounds.x + this._bounds.width, this.bounds.y + this._bounds.height];
        const cropBoxOrMediaBox: number[] = this._getCropOrMediaBox();
        if (this._page) {
            const size: number[] = this._page.size;
            rect[1] = size[1] - rect[3];
            if (cropBoxOrMediaBox && cropBoxOrMediaBox.length > 2 && (cropBoxOrMediaBox[0] !== 0 || cropBoxOrMediaBox[1] !== 0)) {
                rect[0] += cropBoxOrMediaBox[0];
                rect[1] += cropBoxOrMediaBox[1];
            }
        }
        return rect;
    }
    _getPoints(polygonPoints: number[]): number[] {
        const cropOrMediaBox: number[] = this._getCropOrMediaBox();
        const points: number[] = polygonPoints;
        if (cropOrMediaBox && cropOrMediaBox.length > 3 && typeof cropOrMediaBox[0] === 'number' && typeof cropOrMediaBox[1] === 'number' && (cropOrMediaBox[0] !== 0 || cropOrMediaBox[1] !== 0)) {
            const modifiedPoints: number[] = [];
            for (let i: number = 0; i < points.length; i++) {
                modifiedPoints.push(points[Number.parseInt(i.toString(), 10)]);
            }
            for (let j: number = 0; j < modifiedPoints.length; j = j + 2) {
                const x: number = modifiedPoints[Number.parseInt(j.toString(), 10)];
                const y: number = modifiedPoints[j + 1];
                if (cropOrMediaBox) {
                    points[Number.parseInt(j.toString(), 10)] = x + cropOrMediaBox[0];
                    if (this._page._pageDictionary.has('MediaBox') && !this._page._pageDictionary.has('CropBox') && cropOrMediaBox[3] === 0 && cropOrMediaBox[1] > 0) {
                        points[j + 1] = y + cropOrMediaBox[3];
                    } else {
                        points[j + 1] = y + cropOrMediaBox[1];
                    }
                }
            }
        }
        return points;
    }
    _getCropOrMediaBox(): number[] {
        let cropOrMediaBox: number[];
        if (this._page) {
            cropOrMediaBox = this._page.cropBox;
            if (!cropOrMediaBox || cropOrMediaBox.length === 0) {
                cropOrMediaBox = this._page.mediaBox;
            }
        }
        if (cropOrMediaBox && cropOrMediaBox[3] < 0) {
            const y: number = cropOrMediaBox[1];
            const height: number = cropOrMediaBox[3];
            cropOrMediaBox[3] = y;
            cropOrMediaBox[1] = height;
        }
        return cropOrMediaBox;
    }
}
/**
 * Represents the annotations which have comments and review history.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfComment = page.annotations.at(0) as PdfComment;
 * // Gets the comments of annotation
 * let comment : PdfPopupAnnotationCollection = annotation.comments;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export abstract class PdfComment extends PdfAnnotation {
    /**
     * Gets the comments of the PDF annotation (Read only).
     *
     * @returns {PdfPopupAnnotationCollection} Annotation comments
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Access the annotation at index 0
     * let annotation: PdfRectangleAnnotation = page.annotations.at(0) as PdfRectangleAnnotation;
     * // Gets the comments of the PDF annotation
     * let comments: PdfPopupAnnotationCollection = annotation.comments;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get comments(): PdfPopupAnnotationCollection {
        if (this._comments) {
            return this._comments;
        } else {
            return this._comments = new PdfPopupAnnotationCollection(this, false);
        }
    }
    /**
     * Gets the review history of the PDF annotation (Read only).
     *
     * @returns {PdfPopupAnnotationCollection} Annotation review history.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Access the annotation at index 0
     * let annotation: PdfRectangleAnnotation = page.annotations.at(0) as PdfRectangleAnnotation;
     * // Gets the comments of the PDF annotation
     * let comments: PdfPopupAnnotationCollection = annotation.reviewHistory;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get reviewHistory(): PdfPopupAnnotationCollection {
        if (this._reviewHistory) {
            return this._reviewHistory;
        } else {
            return this._reviewHistory = new PdfPopupAnnotationCollection(this, true);
        }
    }
}
/**
 * `PdfLineAnnotation` class represents the line annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new line annotation with line points
 * const annotation: PdfLineAnnotation = new PdfLineAnnotation([10, 50, 250, 50]);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfLineAnnotation extends PdfComment {
    _unit: PdfMeasurementUnit = PdfMeasurementUnit.centimeter;
    private _linePoints: number[];
    private _leaderExt: number;
    private _leaderLine: number;
    private _leaderOffset: number;
    private _lineIntent: PdfLineIntent;
    private _lineEndingStyle: PdfAnnotationLineEndingStyle;
    private _unitString: string = '';
    private _measure: boolean;
    /**
     * Initializes a new instance of the `PdfLineAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfLineAnnotation` class with line points.
     *
     * @param {number[]} linePoints Line points.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new line annotation with line points
     * const annotation: PdfLineAnnotation = new PdfLineAnnotation([10, 50, 250, 50]);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(linePoints: number[])
    constructor(linePoints?: number[]) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Line'));
        if (typeof linePoints !== 'undefined') {
            this.linePoints = linePoints;
        }
        this._type = _PdfAnnotationType.lineAnnotation;
    }
    /**
     * Gets the line points of the line annotation.
     *
     * @returns {number[]} Line points.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the line points of the line annotation.
     * let linePoints : number[] = annotation.linePoints;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get linePoints(): number[] {
        if (typeof this._linePoints === 'undefined' && this._dictionary.has('L')) {
            const points: number[] = this._dictionary.getArray('L');
            if (points) {
                this._linePoints = points;
            }
        }
        return this._linePoints;
    }
    /**
     * Sets the line points of the line annotation.
     *
     * @param {number[]} value Line points.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the line points of the line annotation.
     * annotation.linePoints = [10, 50, 250, 50];
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set linePoints(value: number[]) {
        if (Array.isArray(value) && (typeof this._linePoints === 'undefined' || _areNotEqual(value, this._linePoints))) {
            if (value.length === 4) {
                this._dictionary.update('L', value);
                this._linePoints = value;
            } else {
                throw new Error('Line points length should be 4.');
            }
        }
    }
    /**
     * Gets the line extension of the line annotation.
     *
     * @returns {number} Leader line extension.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the line extension of the line annotation.
     * let leaderExt: number = annotation.leaderExt;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get leaderExt(): number {
        if (typeof this._leaderExt === 'undefined' && this._dictionary.has('LLE')) {
            const leaderExt: number = this._dictionary.get('LLE');
            if (typeof leaderExt !== 'undefined') {
                this._leaderExt = leaderExt;
            }
        }
        return this._leaderExt;
    }
    /**
     * Sets the line extension of the line annotation.
     *
     * @param {number} value Line extension.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the line extension of the line annotation.
     * annotation.leaderExt = 4;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set leaderExt(value: number) {
        if (!Number.isNaN(value)) {
            this._dictionary.update('LLE', value);
            this._leaderExt = value;
        }
    }
    /**
     * Gets the leader line of the line annotation.
     *
     * @returns {number} Leader line.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the leader line of the line annotation.
     * let leaderLine: number = annotation.leaderLine;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get leaderLine(): number {
        if (typeof this._leaderLine === 'undefined' && this._dictionary.has('LL')) {
            const leaderLine: number = this._dictionary.get('LL');
            if (typeof leaderLine !== 'undefined') {
                this._leaderLine = leaderLine;
            }
        }
        return this._leaderLine;
    }
    /**
     * Sets the leader line of the line annotation.
     *
     * @param {number} value Leader line.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the leader line of the line annotation.
     * annotation.leaderLine = 5;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set leaderLine(value: number) {
        if (!Number.isNaN(value) && this.leaderExt !== 0) {
            this._dictionary.update('LL', value);
            this._leaderLine = value;
        }
    }
    /**
     * Gets the line ending style of the line annotation.
     *
     * @returns {PdfAnnotationLineEndingStyle} Line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the line ending style of the line annotation.
     * let lineEndingStyle: PdfAnnotationLineEndingStyle = annotation.lineEndingStyle;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get lineEndingStyle(): PdfAnnotationLineEndingStyle {
        if (typeof this._lineEndingStyle === 'undefined') {
            const value: PdfAnnotationLineEndingStyle = new PdfAnnotationLineEndingStyle();
            value._dictionary = this._dictionary;
            if (this._dictionary.has('LE')) {
                const lineStyles: _PdfName[] = this._dictionary.getArray('LE');
                if (lineStyles && Array.isArray(lineStyles)) {
                    value._begin = _mapLineEndingStyle(lineStyles[0].name);
                    value._end = _mapLineEndingStyle(lineStyles[1].name);
                }
            }
            this._lineEndingStyle = value;
        }
        return this._lineEndingStyle;
    }
    /**
     * Sets the line ending style of the line annotation.
     *
     * @param {PdfAnnotationLineEndingStyle} value Line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the line ending style of the line annotation.
     * annotation.lineEndingStyle = new PdfAnnotationLineEndingStyle(PdfLineEndingStyle.openArrow, PdfLineEndingStyle.closeArrow);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set lineEndingStyle(value: PdfAnnotationLineEndingStyle) {
        const style: PdfAnnotationLineEndingStyle = this.lineEndingStyle;
        if (style.begin !== value.begin || style.end !== value.end) {
            style.begin = value.begin;
            style.end = value.end;
        }
    }
    /**
     * Gets the leader offset of the line annotation.
     *
     * @returns {number} Leader offset.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the leader offset value of the line annotation
     * let leaderOffset: number = annotation.leaderOffset;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get leaderOffset(): number {
        if (typeof this._leaderOffset === 'undefined' && this._dictionary.has('LLO')) {
            const leaderOffset: number = this._dictionary.get('LLO');
            if (typeof leaderOffset !== 'undefined' && leaderOffset >= 0) {
                this._leaderOffset = leaderOffset;
            }
        }
        return this._leaderOffset;
    }
    /**
     * Sets the leader offset of the line annotation.
     *
     * @param {number} value Leader line offset.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the leader offset of the line annotation.
     * annotation.leaderOffset = 1;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set leaderOffset(value: number) {
        if (!Number.isNaN(value)) {
            this._dictionary.update('LLO', value);
            this._leaderOffset = value;
        }
    }
    /**
     * Gets the line intent of the line annotation.
     *
     * @returns {PdfLineIntent} Line intent.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the line intent value of the line annotation
     * let lineIntent: PdfLineIntent = annotation.lineIntent;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get lineIntent(): PdfLineIntent {
        if (typeof this._lineIntent === 'undefined' && this._dictionary.has('IT')) {
            const lineIntent: _PdfName = this._dictionary.get('IT');
            if (lineIntent) {
                this._lineIntent = lineIntent.name === 'LineDimension' ? PdfLineIntent.lineDimension : PdfLineIntent.lineArrow;
            }
        }
        return this._lineIntent;
    }
    /**
     * Sets the line intent of the line annotation.
     *
     * @param {PdfLineIntent} value Line intent.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the line intent of the line annotation.
     * annotation.lineIntent = PdfLineIntent.lineDimension;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set lineIntent(value: PdfLineIntent) {
        if (typeof value !== 'undefined' && value !== this.lineIntent) {
            this._lineIntent = value;
            this._dictionary.update('IT', _PdfName.get(value === PdfLineIntent.lineDimension ? 'LineDimension' : 'LineArrow'));
        }
    }
    /**
     * Gets the flag to have measurement dictionary of the line annotation.
     *
     * @returns {boolean} measure.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the flag to have measurement dictionary of the line annotation.
     * let measure: boolean = annotation.measure;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get measure(): boolean {
        if (typeof this._measure === 'undefined') {
            this._measure = this._dictionary.has('Measure');
        }
        return this._measure;
    }
    /**
     * Sets the flag to add measurement dictionary to the line annotation.
     *
     * @param {boolean} value Measure.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the flag to have measurement dictionary of the line annotation.
     * annotation.measure = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set measure(value: boolean) {
        if (value) {
            if (!this._isLoaded) {
                this._measure = value;
                this.caption.cap = true;
            }
        }
    }
    /**
     * Gets the measurement unit of the annotation.
     *
     * @returns {PdfMeasurementUnit} Measurement unit.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the measurement unit of the annotation.
     * let unit: PdfMeasurementUnit = annotation.unit;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get unit(): PdfMeasurementUnit {
        if (typeof this._unit === 'undefined' || this._isLoaded) {
            this._unit = PdfMeasurementUnit.centimeter;
            if (this._dictionary.has('Contents')) {
                const text: string = this._dictionary.get('Contents');
                this._unitString = text.substring(text.length - 2);
                this._unit = _mapMeasurementUnit(this._unitString);
            }
        }
        return this._unit;
    }
    /**
     * Sets the measurement unit of the line annotation.
     *
     * @param {PdfMeasurementUnit} value Measurement unit.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the measurement unit of the annotation.
     * annotation.unit = PdfMeasurementUnit.centimeter;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set unit(value: PdfMeasurementUnit) {
        if (this._measure) {
            if (!this._isLoaded && typeof value !== 'undefined') {
                this._unit = value;
            }
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfLineAnnotation {
        const annot: PdfLineAnnotation = new PdfLineAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(flatten: boolean): void {
        if (typeof this.linePoints === 'undefined' || this.linePoints === null) {
            throw new Error('Line points cannot be null or undefined');
        } else {
            const cropOrMediaBox: number[] = this._getCropOrMediaBox();
            if (cropOrMediaBox && cropOrMediaBox.length > 3 && this.linePoints.length > 3 && typeof cropOrMediaBox[0] === 'number' && typeof cropOrMediaBox[1] === 'number' && (cropOrMediaBox[0] !== 0 || cropOrMediaBox[1] !== 0)) {
                this._linePoints[0] += cropOrMediaBox[0];
                this._linePoints[1] += cropOrMediaBox[1];
                this._linePoints[2] += cropOrMediaBox[0];
                this._linePoints[3] += cropOrMediaBox[1];
                this._dictionary.update('L', this._linePoints);
            }
        }
        if (!this._dictionary.has('Cap')) {
            this._dictionary.set('Cap', false);
        }
        if (!this._dictionary.has('CP')) {
            this._dictionary.set('CP', _PdfName.get('Inline'));
        }
        if (!this._dictionary.has('LE')) {
            this.lineEndingStyle = new PdfAnnotationLineEndingStyle();
        }
        if (!this._dictionary.has('LL')) {
            this.leaderLine = 0;
        }
        if (!this._dictionary.has('LLE')) {
            this.leaderExt = 0;
        }
        if (!this._dictionary.has('C')) {
            this.color = [0, 0, 0];
            this._isTransparentColor = true;
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        if (this.border.dash === null || typeof this.border.dash === 'undefined') {
            this.border.dash = [];
            if (this.border.style === PdfBorderStyle.dashed) {
                this.border.dash.push(4);
            } else if (this.border.style === PdfBorderStyle.dot) {
                this.border.dash.push(2);
            }
        }
        if (this._measure) {
            this._appearanceTemplate = this._createLineMeasureAppearance(flatten);
        } else {
            if (this._setAppearance) {
                this._appearanceTemplate = this._createAppearance();
            }
            const boundsArray: number[] = this._obtainLineBounds();
            const bounds: {x: number, y: number, width: number, height: number} = {x: boundsArray[0],
                y: boundsArray[1], width: boundsArray[2], height: boundsArray[3]};
            this._bounds = bounds;
            let updatedBounds: number[];
            if (this._page && this._page._isNew && this._page._pageSettings && !this._setAppearance && !this.flatten) {
                updatedBounds = _updateBounds(this);
            } else {
                updatedBounds = [this._bounds.x,
                    this._bounds.y,
                    this._bounds.x + this._bounds.width,
                    this._bounds.y + this._bounds.height];
            }
            this._dictionary.update('Rect', updatedBounds);
            if (this.flatten && !this.measure && this._page && this._page.size && Array.isArray(this._page.size) &&
                this._page.size.length >= 2) {
                this._bounds = {x: boundsArray[0], y: this._page.size[1] - (boundsArray[1] + boundsArray[3]),
                    width: boundsArray[2], height: boundsArray[3]};
            }
        }
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._isLoaded) {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                if (this._dictionary.has('Measure')) {
                    this._appearanceTemplate = this._createLineMeasureAppearance(isFlatten);
                } else {
                    this._appearanceTemplate = this._createAppearance();
                }
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    if (appearanceStream) {
                        const reference: _PdfReference = dictionary.getRaw('N');
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess(isFlatten);
            if (!this._appearanceTemplate) {
                if (isFlatten) {
                    if (!this._dictionary.has('AP')) {
                        this._appearanceTemplate = this._createAppearance();
                    } else {
                        const dictionary: _PdfDictionary = this._dictionary.get('AP');
                        if (dictionary && dictionary.has('N')) {
                            const appearanceStream: _PdfBaseStream = dictionary.get('N');
                            if (appearanceStream) {
                                const reference: _PdfReference = dictionary.getRaw('N');
                                if (reference) {
                                    appearanceStream.reference = reference;
                                }
                                this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                            }
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups && isFlatten) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            } else {
                this._flattenPopUp();
            }
        }
        if (isFlatten && this._appearanceTemplate) {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
        }
        if (!isFlatten && this._setAppearance && !this.measure) {
            let appearance: _PdfDictionary;
            if (this._dictionary.has('AP')) {
                appearance = this._dictionary.get('AP');
            } else {
                const reference: _PdfReference = this._crossReference._getNextReference();
                appearance = new _PdfDictionary(this._crossReference);
                this._crossReference._cacheMap.set(reference, appearance);
                this._dictionary.update('AP', reference);
            }
            _removeDuplicateReference(appearance, this._crossReference, 'N');
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
            appearance.update('N', reference);
        }
    }
    _createLineMeasureAppearance(_isFlatten: boolean): PdfTemplate {
        let nativeRectangle: number[] = [0, 0, 0, 0];
        const area: number = this._convertToUnit();
        const linePoints1: number[] = this._obtainLinePoints();
        const points: Array<number[]> = [];
        for (let j: number = 0; j < linePoints1.length; j = j + 2) {
            points.push([linePoints1[Number.parseInt(j.toString(), 10)], (linePoints1[j + 1])]);
        }
        const graphicsPath: PdfPath = new PdfPath();
        graphicsPath._points = points;
        graphicsPath._pathTypes = [0, 1];
        const rectPath: number[] = graphicsPath._getBounds();
        this._bounds = {x: rectPath[0], y: rectPath[1], width: rectPath[2], height: rectPath[3]};
        const borderPen: PdfPen = new PdfPen(typeof this.color !== 'undefined' ? this._color : [0, 0, 0], this.border.width);
        let backBrush: PdfBrush;
        if (this.innerColor) {
            backBrush = new PdfBrush(this._innerColor);
        }
        nativeRectangle = this._obtainLineBounds();
        const template: PdfTemplate = new PdfTemplate(nativeRectangle, this._crossReference);
        _setMatrix(template, this._getRotationAngle());
        const parameter: _PaintParameter = new _PaintParameter();
        template._writeTransformation = false;
        const graphics: PdfGraphics = template.graphics;
        parameter.borderPen = borderPen;
        parameter.backBrush = backBrush;
        parameter.foreBrush = new PdfBrush(this.color);
        const linePoints: number[] = this._obtainLinePoints();
        let font: PdfFont = this._obtainFont();
        if ((typeof font === 'undefined' || font === null) || (!this._isLoaded && font.size === 1)) {
            font = this._lineCaptionFont;
            this._pdfFont = font;
        }
        if (typeof linePoints !== 'undefined' && linePoints.length === 4) {
            const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
            const fontSize: number[] = font.measureString(area.toFixed(2) + ' ' + this._unitString, [0, 0], format, 0, 0);
            const angle: number = this._getAngle(this._linePoints);
            let leaderLine: number = 0;
            let lineAngle: number = 0;
            if (this.leaderLine < 0) {
                leaderLine = -(this.leaderLine);
                lineAngle = angle + 180;
            } else {
                leaderLine = this.leaderLine;
                lineAngle = angle;
            }
            const offset: number = (typeof this.leaderOffset !== 'undefined') ? (leaderLine + this.leaderOffset) : leaderLine;
            const startPoint: number[] = this._getAxisValue([this._linePoints[0], this._linePoints[1]], (lineAngle + 90), offset);
            const endPoint: number[] = this._getAxisValue([this._linePoints[2], this._linePoints[3]], (lineAngle + 90), offset);
            const lineDistance: number = (Math.sqrt(Math.pow((endPoint[0] - startPoint[0]), 2) +
                Math.pow((endPoint[1] - startPoint[1]), 2)));
            const centerWidth: number = lineDistance / 2 - ((fontSize[0] / 2) + this.border.width);
            const first: number[] = this._getAxisValue(startPoint, angle, centerWidth);
            const second: number[] = this._getAxisValue(endPoint, (angle + 180), centerWidth);
            const start: number[] = (this.lineEndingStyle.begin === PdfLineEndingStyle.openArrow ||
                this.lineEndingStyle.begin === PdfLineEndingStyle.closedArrow) ?
                this._getAxisValue(startPoint, angle, this.border.width) :
                startPoint;
            const end: number[] = (this.lineEndingStyle.end === PdfLineEndingStyle.openArrow ||
                this.lineEndingStyle.end === PdfLineEndingStyle.closedArrow) ?
                this._getAxisValue(endPoint, angle, -this.border.width) :
                endPoint;
            let state: PdfGraphicsState;
            if (this.opacity && this._opacity < 1) {
                state = graphics.save();
                graphics.setTransparency(this._opacity);
            }
            if (this.caption.type === PdfLineCaptionType.top || (!this.caption.cap && this.caption.type === PdfLineCaptionType.inline)) {
                graphics.drawLine(borderPen, start[0], -start[1], end[0], -end[1]);
            } else {
                graphics.drawLine(borderPen, start[0], -start[1], first[0], -first[1]);
                graphics.drawLine(borderPen, end[0], -end[1], second[0], -second[1]);
            }
            if (this.opacity && this._opacity < 1) {
                graphics.restore(state);
            }
            this._drawLineStyle(startPoint, endPoint, graphics, angle, borderPen, backBrush, this.lineEndingStyle, this.border.width);
            const leaderExt: number = (typeof this.leaderExt !== 'undefined' ? this._leaderExt : 0);
            const beginLineExt: number[] = this._getAxisValue(startPoint, (lineAngle + 90), leaderExt);
            graphics.drawLine(borderPen, startPoint[0], -startPoint[1], beginLineExt[0], -beginLineExt[1]);
            const endLineExt: number[] = this._getAxisValue(endPoint, (lineAngle + 90), leaderExt);
            graphics.drawLine(borderPen, endPoint[0], -endPoint[1], endLineExt[0], -endLineExt[1]);
            const beginLeaderLine: number[] = this._getAxisValue(startPoint, (lineAngle - 90), leaderLine);
            graphics.drawLine(borderPen, startPoint[0], -startPoint[1], beginLeaderLine[0], -beginLeaderLine[1]);
            const endLeaderLine: number[] = this._getAxisValue(endPoint, (lineAngle - 90), leaderLine);
            graphics.drawLine(borderPen, endPoint[0], -endPoint[1], endLeaderLine[0], -endLeaderLine[1]);
            const midpoint: number = lineDistance / 2;
            const centerPoint: number[] = this._getAxisValue(startPoint, angle, midpoint);
            let captionPosition: number[];
            const height: number = font._metrics._getHeight();
            if (this.caption.type === PdfLineCaptionType.top) {
                captionPosition = this._getAxisValue(centerPoint, (angle + 90), height);
            } else {
                captionPosition = this._getAxisValue(centerPoint, (angle + 90), (height / 2));
            }
            graphics.translateTransform(captionPosition[0], -captionPosition[1]);
            graphics.rotateTransform(-angle);
            graphics.drawString(area.toFixed(2) + ' ' + this._unitString, font, [(-fontSize[0] / 2), 0, 0, 0], null, parameter.foreBrush);
            graphics.restore();
        }
        if ((typeof _isFlatten !== 'undefined' && !_isFlatten) || !this._isLoaded) {
            template._content.dictionary._updated = true;
            const ref: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(ref, template._content);
            template._content.reference = ref;
            const nativeRectangle1: number[] = [this.bounds.x,
                this.bounds.y + this.bounds.height,
                this.bounds.width,
                this.bounds.height];
            const size: number[] = this._page.size;
            nativeRectangle1[1] = size[1] - (this.bounds.y + this.bounds.height);
            if (this._isBounds && !this.measure) {
                nativeRectangle =  nativeRectangle1;
                this._dictionary.update('Rect', [nativeRectangle1[0], nativeRectangle1[1], nativeRectangle1[2], nativeRectangle1[3]]);
            } else {
                this._dictionary.update('Rect', [nativeRectangle[0], nativeRectangle[1], nativeRectangle[2], nativeRectangle[3]]);
            }
            const ds: string = 'font:' +
                font._metrics._postScriptName +
                ' ' +
                font._size +
                'pt; color:' +
                this._colorToHex(this.color);
            this._dictionary.update('DS', ds);
            if (typeof _isFlatten !== 'undefined' && !_isFlatten) {
                if (this._dictionary.has('AP')) {
                    _removeDuplicateReference(this._dictionary.get('AP'), this._crossReference, 'N');
                }
                const dic: _PdfDictionary = new _PdfDictionary();
                dic.set('N', ref);
                dic._updated = true;
                this._dictionary.set('AP', dic);
                const measureDictionary: _PdfDictionary = this._createMeasureDictionary(this._unitString);
                const reference: _PdfReference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, measureDictionary);
                measureDictionary._updated = true;
                if (this._dictionary.has('Measure')) {
                    _removeDuplicateReference(this._dictionary, this._crossReference, 'Measure');
                }
                this._dictionary.update('Measure', reference);
            }
            const lineStyles: _PdfName[] = [];
            lineStyles.push(_PdfName.get(_reverseMapEndingStyle(this.lineEndingStyle.begin)));
            lineStyles.push(_PdfName.get(_reverseMapEndingStyle(this.lineEndingStyle.end)));
            this._dictionary.update('LE', lineStyles);
            if (this._linePoints !== null) {
                this._dictionary.update('L', this._linePoints);
            } else {
                throw new Error('LinePoints cannot be null');
            }
            this._dictionary.update('C',  [Number.parseFloat((this.color[0] / 255).toFixed(3)),
                Number.parseFloat((this.color[1] / 255).toFixed(3)),
                Number.parseFloat((this.color[2] / 255).toFixed(3))]);
            const offset: number = this._dictionary.has('LLO') ? this.leaderOffset : 0;
            this._dictionary.update('Subtype', new _PdfName('Line'));
            if (this._text && this._text !== '') {
                this._dictionary.update('Contents', this._text + ' ' + area.toFixed(2) + ' ' + this._unitString);
            } else {
                this._dictionary.update('Contents', area.toFixed(2) + ' ' + this._unitString);
            }
            this._dictionary.update('IT', new _PdfName('LineDimension'));
            this._dictionary.update('LLE', this.leaderExt);
            this._dictionary.update('LLO', offset);
            this._dictionary.update('LL', this.leaderLine);
            this._dictionary.update('CP', _PdfName.get(this.caption.type === PdfLineCaptionType.top ? 'Top' : 'Inline'));
            this._dictionary.update('Cap', this.caption.cap);
            const bounds: number[] = [nativeRectangle[0],
                nativeRectangle[1],
                nativeRectangle[0] + nativeRectangle[2],
                nativeRectangle[1] + nativeRectangle[3]];
            this._dictionary.update('Rect', bounds);
            this._bounds = {x: bounds[0], y: bounds[1], width: bounds[2], height: bounds[3]};
        }
        return template;
    }
    _calculateAngle(startPointX: number, startPointY: number, endPointX: number, endPointY: number): number {
        return -(Math.atan2((endPointY - startPointY), (endPointX - startPointX)) * (180 / Math.PI));
    }
    _calculateLineBounds(linePoints: number[],
                         leaderLineExt: number,
                         leaderLine: number,
                         leaderOffset: number,
                         lineStyle: PdfAnnotationLineEndingStyle,
                         borderWidth: number): { x: number, y: number, width: number, height: number } {
        let bounds: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 0, height: 0 };
        if (linePoints && linePoints.length === 4) {
            const angle: number = this._getAngle(linePoints);
            let leaderLines: number = 0;
            let lineAngle: number = 0;
            if (leaderLine < 0) {
                leaderLines = -(leaderLine);
                lineAngle = angle + 180;
            } else {
                leaderLines = leaderLine;
                lineAngle = angle;
            }
            const x1y1: number[] = [linePoints[0], linePoints[1]];
            const x2y2: number[] = [linePoints[2], linePoints[3]];
            if (leaderOffset !== 0) {
                const offsetPoint1: number[] = this._getAxisValue(x1y1, (lineAngle + 90), leaderOffset);
                const offsetPoint2: number[] = this._getAxisValue(x2y2, (lineAngle + 90), leaderOffset);
                linePoints[0] = offsetPoint1[0];
                linePoints[1] = offsetPoint1[1];
                linePoints[2] = offsetPoint2[0];
                linePoints[3] = offsetPoint2[1];
            }
            const startingPoint: number[] = this._getAxisValue(x1y1,
                                                               (lineAngle + 90),
                                                               leaderLines + leaderOffset);
            const endingPoint: number[] = this._getAxisValue(x2y2,
                                                             (lineAngle + 90),
                                                             leaderLines + leaderOffset);
            const beginLineLeader: number[] = this._getAxisValue(x1y1,
                                                                 (lineAngle + 90),
                                                                 leaderLineExt + leaderLines + leaderOffset);
            const endLineLeader: number[] = this._getAxisValue(x2y2,
                                                               (lineAngle + 90),
                                                               leaderLineExt + leaderLines + leaderOffset);
            const beginLinePoint: { x: number, y: number } = this._getLinePoint(lineStyle.begin, borderWidth);
            const endLinePoint: { x: number, y: number } = this._getLinePoint(lineStyle.end, borderWidth);
            const widthX: number[] = [];
            const heightY: number[] = [];
            if ((lineAngle >= 45 && lineAngle <= 135) || (lineAngle >= 225 && lineAngle <= 315)) {
                widthX[0] = beginLinePoint.y;
                heightY[0] = beginLinePoint.x;
                widthX[1] = endLinePoint.y;
                heightY[1] = endLinePoint.x;
            } else {
                widthX[0] = beginLinePoint.x;
                heightY[0] = beginLinePoint.y;
                widthX[1] = endLinePoint.x;
                heightY[1] = endLinePoint.y;
            }
            let width: number = Math.max(widthX[0], widthX[1]);
            let height: number = Math.max(heightY[0], heightY[1]);
            if (width === 0) {
                width = 1;
            }
            if (height === 0) {
                height = 1;
            }
            if (startingPoint[0] === Math.min(startingPoint[0], endingPoint[0])) {
                startingPoint[0] -= width * borderWidth;
                endingPoint[0] += width * borderWidth;
                startingPoint[0] = Math.min(startingPoint[0], linePoints[0]);
                startingPoint[0] = Math.min(startingPoint[0], beginLineLeader[0]);
                endingPoint[0] = Math.max(endingPoint[0], linePoints[2]);
                endingPoint[0] = Math.max(endingPoint[0], endLineLeader[0]);
            } else {
                startingPoint[0] += width * borderWidth;
                endingPoint[0] -= width * borderWidth;
                startingPoint[0] = Math.max(startingPoint[0], linePoints[0]);
                startingPoint[0] = Math.max(startingPoint[0], beginLineLeader[0]);
                endingPoint[0] = Math.min(endingPoint[0], linePoints[2]);
                endingPoint[0] = Math.min(endingPoint[0], endLineLeader[0]);
            }
            if (startingPoint[1] === Math.min(startingPoint[1], endingPoint[1])) {
                startingPoint[1] -= height * borderWidth;
                endingPoint[1] += height * borderWidth;
                startingPoint[1] = Math.min(startingPoint[1], linePoints[1]);
                startingPoint[1] = Math.min(startingPoint[1], beginLineLeader[1]);
                endingPoint[1] = Math.max(endingPoint[1], linePoints[3]);
                endingPoint[1] = Math.max(endingPoint[1], endLineLeader[1]);
            } else {
                startingPoint[1] += height * borderWidth;
                endingPoint[1] -= height * borderWidth;
                startingPoint[1] = Math.max(startingPoint[1], linePoints[1]);
                startingPoint[1] = Math.max(startingPoint[1], beginLineLeader[1]);
                endingPoint[1] = Math.min(endingPoint[1], linePoints[3]);
                endingPoint[1] = Math.min(endingPoint[1], endLineLeader[1]);
            }
            bounds = this._getBounds([{ x: startingPoint[0], y: startingPoint[1] }, { x: endingPoint[0], y: endingPoint[1] }]);
        }
        return bounds;
    }
    _getLinePoint(style: PdfLineEndingStyle, borderWidth: number): {x: number, y: number} {
        const point: {x: number, y: number} = {x: 0, y: 0};
        if (style) {
            switch (style) {
            case PdfLineEndingStyle.square:
            case PdfLineEndingStyle.circle:
            case PdfLineEndingStyle.diamond:
                point.x = 3;
                point.y = 3;
                break;
            case PdfLineEndingStyle.openArrow:
            case PdfLineEndingStyle.closedArrow:
                point.x = 1;
                point.y = 5;
                break;
            case PdfLineEndingStyle.rOpenArrow:
            case PdfLineEndingStyle.rClosedArrow:
                point.x = 9 + (borderWidth / 2);
                point.y = 5 + (borderWidth / 2);
                break;
            case PdfLineEndingStyle.slash:
                point.x = 5;
                point.y = 9;
                break;
            case PdfLineEndingStyle.butt:
                point.x = 1;
                point.y = 3;
                break;
            default:
                point.x = 0;
                point.y = 0;
                break;
            }
        }
        return point;
    }
    _getBounds(points: Array<{x: number, y: number}>): {x: number, y: number, width: number, height: number} {
        const bounds: {x: number, y: number, width: number, height: number} = {x: 0, y: 0, width: 0, height: 0};
        if (points.length > 0) {
            let xmin: number = points[0].x;
            let xmax: number = points[0].x;
            let ymin: number = points[0].y;
            let ymax: number = points[0].y;
            for (let i: number = 1; i < points.length; ++i) {
                const point: {x: number, y: number} = points[Number.parseInt(i.toString(), 10)];
                xmin = Math.min(point.x, xmin);
                xmax = Math.max(point.x, xmax);
                ymin = Math.min(point.y, ymin);
                ymax = Math.max(point.y, ymax);
            }
            bounds.x = xmin;
            bounds.y = ymin;
            bounds.width = xmax - xmin;
            bounds.height = ymax - ymin;
        }
        return bounds;
    }
    _obtainLineBounds(): number[] {
        let bounds: {x: number, y: number, width: number, height: number} = this.bounds;
        if (typeof this.linePoints !== 'undefined' && this._linePoints.length === 4) {
            const leaderOffset: number = this._dictionary.has('LLO') ? this.leaderOffset : 0;
            const leaderExt: number = this._dictionary.has('LLE') ? this.leaderExt : 0;
            const leaderLine: number = this._dictionary.has('LL') ? this.leaderLine : 0;
            bounds = this._calculateLineBounds(this._linePoints,
                                               leaderExt,
                                               leaderLine,
                                               leaderOffset,
                                               this.lineEndingStyle,
                                               this.border.width);
            bounds = {x: bounds.x - 8, y: bounds.y - 8, width: (bounds.width + 2 * 8), height: (bounds.height + 2 * 8)};
        }
        return [bounds.x, bounds.y, bounds.width, bounds.height];
    }
    _createAppearance(): PdfTemplate {
        const template: PdfTemplate = new PdfTemplate(this._obtainLineBounds(), this._crossReference);
        const parameter: _PaintParameter = new _PaintParameter();
        _setMatrix(template, this._getRotationAngle());
        template._writeTransformation = false;
        const graphics: PdfGraphics = template.graphics;
        const pen: PdfPen = new PdfPen(typeof this.color !== 'undefined' ? this._color : [0, 0, 0], this.border.width);
        if (this.border.style === PdfBorderStyle.dashed) {
            pen._dashStyle = PdfDashStyle.dash;
            pen._dashPattern = [3, 1];
        } else if (this.border.style === PdfBorderStyle.dot) {
            pen._dashStyle = PdfDashStyle.dot;
            pen._dashPattern = [1, 1];
        }
        parameter.borderPen = pen;
        parameter.foreBrush = new PdfBrush(this.color);
        const brush: PdfBrush = new PdfBrush(typeof this.innerColor !== 'undefined' ? this._innerColor : [0, 0, 0]);
        let font: PdfFont = this._obtainFont();
        if ((typeof font === 'undefined' || font === null) || (!this._isLoaded && font.size === 1)) {
            font = this._lineCaptionFont;
            this._pdfFont = font;
        }
        if (!this.text && !this._dictionary.has('Contents')) {
            this.text = this.subject;
        }
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
        const lineWidth: number = font.measureString(this.text ? this.text : '', [0, 0], format, 0, 0)[0]; //66.71001;
        if (typeof this.linePoints !== 'undefined' && this._linePoints.length === 4) {
            const angle: number = this._getAngle(this._linePoints);
            let leaderLine: number = 0;
            let lineAngle: number = 0;
            if (this.leaderLine < 0) {
                leaderLine = -(this.leaderLine);
                lineAngle = angle + 180;
            } else {
                leaderLine = this.leaderLine;
                lineAngle = angle;
            }
            const offset: number = (typeof this.leaderOffset !== 'undefined') ? (leaderLine + this.leaderOffset) : leaderLine;
            const startPoint: number[] = this._getAxisValue([this._linePoints[0], this._linePoints[1]], (lineAngle + 90), offset);
            const endPoint: number[] = this._getAxisValue([this._linePoints[2], this._linePoints[3]], (lineAngle + 90), offset);
            const lineDistance: number = (Math.sqrt(Math.pow((endPoint[0] - startPoint[0]), 2) +
                Math.pow((endPoint[1] - startPoint[1]), 2)));
            const centerWidth: number = lineDistance / 2 - ((lineWidth / 2) + this.border.width);
            const first: number[] = this._getAxisValue(startPoint, angle, centerWidth);
            const second: number[] = this._getAxisValue(endPoint, (angle + 180), centerWidth);
            const start: number[] = (this.lineEndingStyle.begin === PdfLineEndingStyle.openArrow ||
                this.lineEndingStyle.begin === PdfLineEndingStyle.closedArrow) ?
                this._getAxisValue(startPoint, angle, this.border.width) :
                startPoint;
            const end: number[] = (this.lineEndingStyle.end === PdfLineEndingStyle.openArrow ||
                this.lineEndingStyle.end === PdfLineEndingStyle.closedArrow) ?
                this._getAxisValue(endPoint, angle, -this.border.width) :
                endPoint;
            if (this.opacity && this._opacity < 1) {
                const state: PdfGraphicsState = graphics.save();
                graphics.setTransparency(this._opacity);
                this._drawLine(graphics, pen, start, end, first, second);
                graphics.restore(state);
            } else {
                this._drawLine(graphics, pen, start, end, first, second);
            }
            this._drawLineStyle(startPoint, endPoint, graphics, angle, pen, brush, this.lineEndingStyle, this.border.width);
            const leaderExt: number = (typeof this.leaderExt !== 'undefined' ? this._leaderExt : 0);
            const beginLineExt: number[] = this._getAxisValue(startPoint, (lineAngle + 90), leaderExt);
            graphics.drawLine(pen, startPoint[0], -startPoint[1], beginLineExt[0], -beginLineExt[1]);
            const endLineExt: number[] = this._getAxisValue(endPoint, (lineAngle + 90), leaderExt);
            graphics.drawLine(pen, endPoint[0], -endPoint[1], endLineExt[0], -endLineExt[1]);
            const beginLeaderLine: number[] = this._getAxisValue(startPoint, (lineAngle - 90), leaderLine);
            graphics.drawLine(pen, startPoint[0], -startPoint[1], beginLeaderLine[0], -beginLeaderLine[1]);
            const endLeaderLine: number[] = this._getAxisValue(endPoint, (lineAngle - 90), leaderLine);
            graphics.drawLine(pen, endPoint[0], -endPoint[1], endLeaderLine[0], -endLeaderLine[1]);
            const midpoint: number = lineDistance / 2;
            const centerPoint: number[] = this._getAxisValue(startPoint, angle, midpoint);
            let captionPosition: number[];
            const height: number = font._metrics._getHeight();
            if (this.caption.type === PdfLineCaptionType.top) {
                if (this._dictionary.has('Measure')) {
                    captionPosition = this._getAxisValue(centerPoint, (angle + 90), 2 * height);
                } else {
                    captionPosition = this._getAxisValue(centerPoint, (angle + 90), height);
                }
            } else {
                if (this._dictionary.has('Measure')) {
                    captionPosition = this._getAxisValue(centerPoint, (angle + 90), 3 * (height / 2));
                } else {
                    captionPosition = this._getAxisValue(centerPoint, (angle + 90), (height / 2));
                }
            }
            graphics.translateTransform(captionPosition[0], -captionPosition[1]);
            graphics.rotateTransform(-angle);
            if (this.caption.cap) {
                graphics.drawString(this.text, font, [(-lineWidth / 2), 0, 0, 0], null, parameter.foreBrush);
            }
            graphics.restore();
            const bounds: number[] = this._obtainLineBounds();
            let rectangleBounds: number[] = _fromRectangle({ x: bounds[0], y: bounds[1], width: bounds[2], height: bounds[3] });
            if (this._page._isNew && this._page._pageSettings && this._setAppearance && !this.flatten) {
                rectangleBounds = _updateBounds(this, bounds);
            }
            this.bounds = { x: rectangleBounds[0], y: rectangleBounds[1], width: rectangleBounds[2], height: rectangleBounds[3] };
            if ((!this.measure) && (!this._dictionary.has('Measure'))) {
                this._dictionary.update('Rect', [rectangleBounds[0], rectangleBounds[1], rectangleBounds[2], rectangleBounds[3]]);
            }
        }
        return template;
    }
    _drawLine(graphics: PdfGraphics, pen: PdfPen, start: number[], end: number[], first: number[], second: number[]): void {
        if (typeof this.text === 'undefined' ||
            this._text === '' ||
            this.caption.type === PdfLineCaptionType.top ||
            (!this.caption.cap && this.caption.type === PdfLineCaptionType.inline)) {
            graphics.drawLine(pen, start[0], -start[1], end[0], -end[1]);
        } else {
            graphics.drawLine(pen, start[0], -start[1], first[0], -first[1]);
            graphics.drawLine(pen, end[0], -end[1], second[0], -second[1]);
        }
    }
    _convertToUnit(): number {
        const points: number[] = this._obtainLinePoints();
        const data: Array<number[]> = new Array(points.length / 2);
        let count: number = 0;
        for (let j: number = 0; j < points.length; j = j + 2) {
            data[Number.parseInt(count.toString(), 10)] = [points[Number.parseInt(j.toString(), 10)], (points[j + 1])];
            count++;
        }
        const distance: number = Math.sqrt(Math.pow((data[1][0] - data[0][0]), 2) + Math.pow((data[1][1] - data[0][1]), 2));
        const value: {graphicsUnit: _PdfGraphicsUnit, unitString: string} = this._getEqualPdfGraphicsUnit(this.unit, this._unitString);
        this._unitString = value.unitString;
        return (new _PdfUnitConvertor())._convertUnits(distance, _PdfGraphicsUnit.point, value.graphicsUnit);
    }
    _obtainLinePoints(): number[] {
        const points: number[] = [];
        if (this.linePoints) {
            for (let i: number = 0; i < this._linePoints.length; i++) {
                points[Number.parseInt(i.toString(), 10)] = this._linePoints[Number.parseInt(i.toString(), 10)];
            }
        }
        return points;
    }
}
/**
 * `PdfCircleAnnotation` class represents the circle annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new circle annotation with circle bounds
 * const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(10, 10, 100, 100);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfCircleAnnotation extends PdfComment {
    _unit: PdfMeasurementUnit = PdfMeasurementUnit.centimeter;
    _measureType: PdfCircleMeasurementType = PdfCircleMeasurementType.diameter;
    private _unitString: string = '';
    private _measure: boolean;
    /**
     * Initializes a new instance of the `PdfCircleAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfCircleAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new circle annotation with circle bounds
     * const annotation: PdfCircleAnnotation = new PdfCircleAnnotation(10, 10, 100, 100);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number )
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Circle'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        this._type = _PdfAnnotationType.circleAnnotation;
    }
    /**
     * Gets the flag to have measurement dictionary of the circle annotation.
     *
     * @returns {boolean} measure.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfCircleAnnotation = page.annotations.at(0) as PdfCircleAnnotation;
     * // Gets the flag to have measurement dictionary of the circle annotation.
     * let measure: boolean = annotation.measure;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get measure(): boolean {
        if (typeof this._measure === 'undefined' && this._dictionary.has('Measure')) {
            this._measure =  this._dictionary.get('Measure');
        }
        return this._measure;
    }
    /**
     * Sets the flag to add measurement dictionary to the annotation.
     *
     * @param {boolean} value Measure.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfCircleAnnotation = page.annotations.at(0) as PdfCircleAnnotation;
     * // Sets the flag to have measurement dictionary of the circle annotation.
     * annotation.measure = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set measure(value: boolean) {
        if (value) {
            if (!this._isLoaded) {
                this._measure = value;
            }
        }
    }
    /**
     * Gets the measurement unit of the annotation.
     *
     * @returns {PdfMeasurementUnit} Measurement unit.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfCircleAnnotation = page.annotations.at(0) as PdfCircleAnnotation;
     * // Gets the measurement unit of the annotation.
     * let unit: PdfMeasurementUnit = annotation.unit;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get unit(): PdfMeasurementUnit {
        if (typeof this._unit === 'undefined' || this._isLoaded) {
            this._unit = PdfMeasurementUnit.centimeter;
            if (this._dictionary.has('Contents')) {
                const text: string = this._dictionary.get('Contents');
                this._unitString = text.substring(text.length - 2);
                this._unit = _mapMeasurementUnit(this._unitString);
            }
        }
        return this._unit;
    }
    /**
     * Sets the measurement unit of the annotation.
     *
     * @param {PdfMeasurementUnit} value Measurement unit.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfCircleAnnotation = page.annotations.at(0) as PdfCircleAnnotation;
     * // Sets the measurement unit of the annotation.
     * annotation.unit = PdfMeasurementUnit.centimeter;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set unit(value: PdfMeasurementUnit) {
        if (this._measure) {
            if (!this._isLoaded && typeof value !== 'undefined') {
                this._unit = value;
            }
        }
    }
    /**
     * Gets the measurement type of the annotation.
     *
     * @returns {PdfCircleMeasurementType} Measurement type.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfCircleAnnotation = page.annotations.at(0) as PdfCircleAnnotation;
     * // Gets the measurement type of the annotation.
     * let type: PdfCircleMeasurementType = annotation.type;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get measureType(): PdfCircleMeasurementType {
        if (this._dictionary.has('Contents')) {
            const text: string = this._dictionary.get('Contents');
            this._unitString = text.substring(text.length - 2);
            this._unit = _mapMeasurementUnit(this._unitString);
            const value: string = text.substring(0, text.length - 2);
            const converter: _PdfUnitConvertor = new _PdfUnitConvertor();
            const radius: number = converter._convertUnits(this.bounds.width / 2,
                                                           _PdfGraphicsUnit.point,
                                                           _mapGraphicsUnit(this._unitString));
            if (radius.toString() === value) {
                this._measureType = PdfCircleMeasurementType.radius;
            } else {
                this._measureType = PdfCircleMeasurementType.diameter;
            }
        }
        return this._measureType;
    }
    /**
     * Sets the measurement type of the annotation.
     *
     * @param {PdfCircleMeasurementType} value Measurement type.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfCircleAnnotation = page.annotations.at(0) as PdfCircleAnnotation;
     * // Sets the measurement type of the annotation.
     * annotation.type = PdfCircleMeasurementType.diameter;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set measureType(value: PdfCircleMeasurementType) {
        if (this._measure) {
            if (!this._isLoaded && typeof value !== 'undefined') {
                this._measureType = value;
            }
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfCircleAnnotation {
        const annot: PdfCircleAnnotation = new PdfCircleAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(isFlatten: boolean): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (!this._dictionary.has('C')) {
            this.color = [0, 0, 0];
            this._isTransparentColor = true;
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        if (this._measure) {
            this._appearanceTemplate = this._createCircleMeasureAppearance(isFlatten);
        } else {
            this._dictionary.update('Rect', _updateBounds(this));
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                this._appearanceTemplate = this._createCircleAppearance();
            }
        }
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._isLoaded) {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                if (this._dictionary.has('Measure')) {
                    this._appearanceTemplate = this._createCircleMeasureAppearance(isFlatten);
                } else {
                    this._appearanceTemplate = this._createCircleAppearance();
                }
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (appearanceStream) {
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess(isFlatten);
            if (!this._appearanceTemplate && isFlatten) {
                if (!this._dictionary.has('AP')) {
                    this._appearanceTemplate = this._createCircleAppearance();
                } else {
                    const dictionary: _PdfDictionary = this._dictionary.get('AP');
                    if (dictionary && dictionary.has('N')) {
                        const appearanceStream: _PdfBaseStream = dictionary.get('N');
                        const reference: _PdfReference = dictionary.getRaw('N');
                        if (appearanceStream) {
                            if (reference) {
                                appearanceStream.reference = reference;
                            }
                            this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups && isFlatten) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            } else {
                this._flattenPopUp();
            }
        }
        if (isFlatten && this._appearanceTemplate) {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
        }
        if (!isFlatten && this._setAppearance && !this.measure) {
            let appearance: _PdfDictionary;
            if (this._dictionary.has('AP')) {
                appearance = this._dictionary.get('AP');
            } else {
                const reference: _PdfReference = this._crossReference._getNextReference();
                appearance = new _PdfDictionary(this._crossReference);
                this._crossReference._cacheMap.set(reference, appearance);
                this._dictionary.update('AP', reference);
            }
            _removeDuplicateReference(appearance, this._crossReference, 'N');
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
            appearance.update('N', reference);
        }
    }
    _createCircleMeasureAppearance(_isFlatten: boolean): PdfTemplate {
        const borderWidth: number = this.border.width;
        let font: PdfFont = this._obtainFont();
        if ((typeof font === 'undefined' || font === null) || (!this._isLoaded && font.size === 1)) {
            font = this._circleCaptionFont;
            this._pdfFont = font;
        }
        const area: number = this._convertToUnit();
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
        const str: string = area.toFixed(2) + ' ' + this._unitString;
        const fontsize: number[] = font.measureString(str, [0, 0], format, 0, 0);
        const color: number[] = this.color ? this.color : [0, 0, 0];
        const borderPen: PdfPen = new PdfPen(color, borderWidth);
        const nativeRectangle: number[] = [this.bounds.x,
            (this.bounds.y + this.bounds.height),
            this.bounds.width,
            this.bounds.height];
        nativeRectangle[1] = nativeRectangle[1] - nativeRectangle[3];
        const template: PdfTemplate = new PdfTemplate(nativeRectangle, this._crossReference);
        const parameter: _PaintParameter = new _PaintParameter();
        template._writeTransformation = false;
        const graphics: PdfGraphics = template.graphics;
        const width: number = borderWidth / 2;
        parameter.borderPen = borderPen;
        if (this.innerColor) {
            parameter.backBrush = new PdfBrush(this._innerColor);
        }
        parameter.foreBrush = new PdfBrush(color);
        const rect: number[] = [nativeRectangle[0],
            -nativeRectangle[1] - nativeRectangle[3],
            nativeRectangle[2],
            nativeRectangle[3]];
        graphics.save();
        graphics.drawEllipse(rect[0] + width,
                             rect[1] + width,
                             rect[2] - borderWidth,
                             rect[3] - borderWidth,
                             new PdfPen(color, this.border.width));
        if (this._measureType === PdfCircleMeasurementType.diameter) {
            graphics.save();
            graphics.translateTransform(nativeRectangle[0], -nativeRectangle[1]);
            const x: number = (nativeRectangle[3] / 2) - (fontsize[0] / 2);
            graphics.drawLine(parameter.borderPen,
                              0,
                              -nativeRectangle[3] / 2,
                              nativeRectangle[0] + nativeRectangle[2],
                              -nativeRectangle[3] / 2);
            graphics.translateTransform(x, -(nativeRectangle[3] / 2) - font._metrics._getHeight());
            graphics.drawString(area.toFixed(2) + ' ' + this._unitString, font,  [0, 0, 0, 0], null, parameter.foreBrush);
            graphics.restore();
        } else {
            graphics.save();
            graphics.translateTransform(nativeRectangle[0], -nativeRectangle[1]);
            const x: number = (nativeRectangle[2] / 2) + ((nativeRectangle[2] / 4) - (fontsize[0] / 2));
            graphics.drawLine(parameter.borderPen,
                              nativeRectangle[2] / 2,
                              -nativeRectangle[3] / 2,
                              nativeRectangle[0] + nativeRectangle[2],
                              -nativeRectangle[3] / 2);
            graphics.translateTransform(x, -(nativeRectangle[3] / 2) - font._metrics._getHeight());
            graphics.drawString(area.toFixed(2) + ' ' + this._unitString, font, [0, 0, 0, 0],  null, parameter.foreBrush);
            graphics.restore();
        }
        graphics.restore();
        if ((typeof _isFlatten !== 'undefined' && !_isFlatten) || !this._isLoaded) {
            if (this._dictionary.has('AP')) {
                _removeDuplicateReference(this._dictionary.get('AP'), this._crossReference, 'N');
            }
            const dic: _PdfDictionary = new _PdfDictionary();
            graphics._template._content.dictionary._updated = true;
            const ref: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(ref, graphics._template._content);
            graphics._template._content.reference = ref;
            dic.set('N', ref);
            dic._updated = true;
            this._dictionary.set('AP', dic);
            this._dictionary.update('Rect', _updateBounds(this));
            if (this._dictionary.has('Measure')) {
                _removeDuplicateReference(this._dictionary, this._crossReference, 'Measure');
            }
            const measureDictionary: _PdfDictionary = this._createMeasureDictionary(this._unitString);
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, measureDictionary);
            measureDictionary._updated = true;
            this._dictionary.update('Measure', reference);
            this._dictionary.update('Subtype', new _PdfName('Circle'));
            if (this._text && this._text !== '') {
                this._dictionary.update('Contents', this._text + ' ' + area.toFixed(2) + ' ' + this._unitString);
            } else {
                this._dictionary.update('Contents', area.toFixed(2) + ' ' + this._unitString);
            }
            const ds: string = 'font:' +
                font._metrics._postScriptName +
                ' ' +
                font._size +
                'pt; color:' +
                this._colorToHex(this.color);
            this._dictionary.update('DS', ds);
        }
        return template;
    }
    _convertToUnit(): number {
        const converter: _PdfUnitConvertor = new _PdfUnitConvertor();
        const value: {graphicsUnit: _PdfGraphicsUnit, unitString: string} = this._getEqualPdfGraphicsUnit(this.unit, this._unitString);
        this._unitString = value.unitString;
        let radius: number = converter._convertUnits(this.bounds.width / 2, _PdfGraphicsUnit.point, value.graphicsUnit);
        if (this._measureType === PdfCircleMeasurementType.diameter) {
            radius = 2 * radius;
        }
        return radius;
    }
}
/**
 * `PdfEllipseAnnotation` class represents the ellipse annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new ellipse annotation with bounds
 * const annotation: PdfEllipseAnnotation = new PdfEllipseAnnotation(10, 10, 100, 100);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfEllipseAnnotation extends PdfComment {
    /**
     * Initializes a new instance of the `PdfEllipseAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfEllipseAnnotation` class with ellipse bounds.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new ellipse annotation with bounds
     * const annotation: PdfEllipseAnnotation = new PdfEllipseAnnotation(10, 10, 100, 100);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number )
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Circle'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        this._type = _PdfAnnotationType.ellipseAnnotation;
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfEllipseAnnotation {
        const annot: PdfEllipseAnnotation = new PdfEllipseAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(isFlatten: boolean): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        let borderWidth: number;

        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (!this._dictionary.has('C')) {
            this.color = [0, 0, 0];
            this._isTransparentColor = true;
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
            this._appearanceTemplate = this._createCircleAppearance();
        }
        this._dictionary.update('Rect', _updateBounds(this));
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._isLoaded) {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                this._appearanceTemplate = this._createCircleAppearance();
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (appearanceStream) {
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess(isFlatten);
            if (!this._appearanceTemplate && isFlatten) {
                if (!this._dictionary.has('AP')) {
                    this._appearanceTemplate = this._createCircleAppearance();
                } else {
                    const dictionary: _PdfDictionary = this._dictionary.get('AP');
                    if (dictionary && dictionary.has('N')) {
                        const appearanceStream: _PdfBaseStream = dictionary.get('N');
                        const reference: _PdfReference = dictionary.getRaw('N');
                        if (appearanceStream) {
                            if (reference) {
                                appearanceStream.reference = reference;
                            }
                            this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            } else {
                this._flattenPopUp();
            }
        }
        if (isFlatten && this._appearanceTemplate) {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
        }
        if (!isFlatten && this._setAppearance) {
            let appearance: _PdfDictionary;
            if (this._dictionary.has('AP')) {
                appearance = this._dictionary.get('AP');
            } else {
                const reference: _PdfReference = this._crossReference._getNextReference();
                appearance = new _PdfDictionary(this._crossReference);
                this._crossReference._cacheMap.set(reference, appearance);
                this._dictionary.update('AP', reference);
            }
            _removeDuplicateReference(appearance, this._crossReference, 'N');
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
            appearance.update('N', reference);
        }
    }
}
/**
 * `PdfSquareAnnotation` class represents the square annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new square annotation with bounds
 * const annotation: PdfSquareAnnotation = new PdfSquareAnnotation(10, 10, 100, 100);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfSquareAnnotation extends PdfComment {
    _unit: PdfMeasurementUnit = PdfMeasurementUnit.centimeter;
    private _unitString: string;
    private _measure: boolean;
    private _intensity: number;
    /**
     * Initializes a new instance of the `PdfSquareAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfSquareAnnotation` class with square bounds.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * * // Create a new square annotation with bounds
     * const annotation: PdfSquareAnnotation = new PdfSquareAnnotation(10, 10, 100, 100);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number )
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Square'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        this._type = _PdfAnnotationType.squareAnnotation;
    }
    /**
     * Gets the border effect of the square annotation.
     *
     * @returns {PdfBorderEffect} Border effect.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Gets the border effect of the square annotation.
     * let borderEffect : PdfBorderEffect = annotation.borderEffect;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get borderEffect(): PdfBorderEffect {
        if (typeof this._borderEffect === 'undefined') {
            const value: PdfBorderEffect = new PdfBorderEffect();
            value._dictionary = this._dictionary;
            if (this._dictionary.has('BE')) {
                const dictionary: _PdfDictionary = this._dictionary.get('BE');
                value._intensity = dictionary.get('I');
                value._style = _mapBorderEffectStyle(dictionary.get('S').name);
            }
            this._borderEffect = value;
        }
        return this._borderEffect;
    }
    /**
     * Sets the border effect of the square annotation.
     *
     * @param {PdfBorderEffect} value Border effect.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Sets the border effect of the square annotation.
     * annotation.borderEffect.intensity = 1;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set borderEffect(value: PdfBorderEffect) {
        if (typeof value !== 'undefined') {
            this._borderEffect = value;
        }
    }
    /**
     * Gets the flag to have measurement dictionary of the Square annotation.
     *
     * @returns {boolean} measure.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Gets the flag to have measurement dictionary of the square annotation.
     * let measure: boolean = annotation.measure;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get measure(): boolean {
        if (typeof this._measure === 'undefined' && this._dictionary.has('Measure')) {
            this._measure =  this._dictionary.get('Measure');
        }
        return this._measure;
    }
    /**
     * Sets the flag to add measurement dictionary to the annotation.
     *
     * @param {boolean} value Measure.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Sets the flag to have measurement dictionary of the square annotation.
     * annotation.measure = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set measure(value: boolean) {
        if (typeof value !== 'undefined') {
            if (!this._isLoaded) {
                this._measure = value;
            }
        }
    }
    /**
     * Gets the measurement unit of the annotation.
     *
     * @returns {PdfMeasurementUnit} Measurement unit.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Gets the measurement unit of the annotation.
     * let unit: PdfMeasurementUnit = annotation.unit;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get unit(): PdfMeasurementUnit {
        if (typeof this._unit === 'undefined') {
            this._unit = PdfMeasurementUnit.centimeter;
            if (this._dictionary.has('Contents')) {
                const text: string = this._dictionary.get('Contents');
                this._unitString = text.substring(text.length - 2);
                this._unit = _mapMeasurementUnit(this._unitString);
            }
        }
        return this._unit;
    }
    /**
     * Sets the measurement unit of the annotation.
     *
     * @param {PdfMeasurementUnit} value Measurement unit.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Sets the measurement unit of the annotation.
     * annotation.unit = PdfMeasurementUnit.centimeter;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set unit(value: PdfMeasurementUnit) {
        if (this._measure) {
            if (!this._isLoaded && typeof value !== 'undefined') {
                this._unit = value;
            }
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfSquareAnnotation {
        const annot: PdfSquareAnnotation = new PdfSquareAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(isFlatten: boolean): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (!this._dictionary.has('C')) {
            this.color = [0, 0, 0];
            this._isTransparentColor = true;
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        if (this._measure) {
            this._appearanceTemplate = this._createSquareMeasureAppearance(isFlatten);
        } else {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                this._appearanceTemplate = this._createRectangleAppearance(this.borderEffect);
            }
            this._dictionary.update('Rect', _updateBounds(this));
            if (typeof this._intensity === 'undefined' &&
                typeof this._borderEffect !== 'undefined' &&
                this._borderEffect.style === PdfBorderEffectStyle.cloudy) {
                const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
                dictionary.set('I', this.borderEffect._intensity);
                if (this.borderEffect._style === PdfBorderEffectStyle.cloudy) {
                    dictionary.set('S', _PdfName.get('C'));
                }
                this._dictionary.update('BE', dictionary);
            }
        }
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._isLoaded) {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                if (this._dictionary.has('Measure')) {
                    this._appearanceTemplate = this._createSquareMeasureAppearance(isFlatten);
                } else {
                    this._appearanceTemplate = this._createRectangleAppearance(this.borderEffect);
                }
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (appearanceStream) {
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess(isFlatten);
            if (!this._appearanceTemplate && isFlatten) {
                if (!this._dictionary.has('AP')) {
                    this._appearanceTemplate = this._createRectangleAppearance(this.borderEffect);
                } else {
                    const dictionary: _PdfDictionary = this._dictionary.get('AP');
                    if (dictionary && dictionary.has('N')) {
                        const appearanceStream: _PdfBaseStream = dictionary.get('N');
                        const reference: _PdfReference = dictionary.getRaw('N');
                        if (appearanceStream) {
                            if (reference) {
                                appearanceStream.reference = reference;
                            }
                            this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups && !this.measure) {
            if (this._isLoaded && !this._dictionary.has('Measure')) {
                this._flattenLoadedPopUp();
            } else {
                this._flattenPopUp();
            }
        }
        if (isFlatten && this._appearanceTemplate) {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
        }
        if (!isFlatten && this._setAppearance && !this.measure) {
            let appearance: _PdfDictionary;
            if (this._dictionary.has('AP')) {
                appearance = this._dictionary.get('AP');
            } else {
                const reference: _PdfReference = this._crossReference._getNextReference();
                appearance = new _PdfDictionary(this._crossReference);
                this._crossReference._cacheMap.set(reference, appearance);
                this._dictionary.update('AP', reference);
            }
            _removeDuplicateReference(appearance, this._crossReference, 'N');
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
            appearance.update('N', reference);
        }
    }
    _createSquareMeasureAppearance(_isFlatten: boolean): PdfTemplate {
        const borderWidth: number = this.border.width;
        let font: PdfFont = this._obtainFont();
        if ((typeof font === 'undefined' || font === null) || (!this._isLoaded && font.size === 1)) {
            font = this._circleCaptionFont;
            this._pdfFont = font;
        }
        const area: number = this._calculateAreaOfSquare();
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
        const str: string = area.toFixed(2) + ' sq ' + this._unitString;
        const fontsize: number[] = font.measureString(str, [0, 0], format, 0, 0);
        const borderPen: PdfPen = new PdfPen(this.color, borderWidth);
        let backBrush: PdfBrush;
        if (this.innerColor) {
            backBrush = new PdfBrush(this._innerColor);
        }
        let nativeRectangle: number[] = [this.bounds.x,
            (this.bounds.y + this.bounds.height),
            this.bounds.width,
            this.bounds.height];
        const appearanceBounds: number[] = [this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height];
        const appearance: PdfAppearance = new PdfAppearance(this, appearanceBounds);
        nativeRectangle[1] = nativeRectangle[1] - nativeRectangle[3];
        appearance.normal = new PdfTemplate(nativeRectangle, this._crossReference);
        const template: PdfTemplate =  appearance.normal;
        const parameter: _PaintParameter = new _PaintParameter();
        template._writeTransformation = false;
        const graphics: PdfGraphics = appearance.normal.graphics;
        const width: number = borderWidth / 2;
        parameter.borderPen = borderPen;
        parameter.backBrush = backBrush;
        parameter.foreBrush = new PdfBrush(this.color);
        const rect: number[] = [nativeRectangle[0],
            -nativeRectangle[1] - nativeRectangle[3],
            nativeRectangle[2],
            nativeRectangle[3]];
        graphics.drawRectangle(rect[0] + width,
                               rect[1] + width,
                               rect[2] - borderWidth,
                               rect[3] - borderWidth,
                               new PdfPen(this.color, this.border.width));
        graphics.save();
        graphics.translateTransform(nativeRectangle[0], - nativeRectangle[1]);
        const x: number = (nativeRectangle[2] / 2) - (fontsize[0] / 2);
        const y: number = (nativeRectangle[3] / 2) - (fontsize[1] / 2);
        graphics.translateTransform(x, -y - font._metrics._getHeight());
        graphics.drawString((area.toFixed(2) + ' sq ' + this._unitString), font, [0, 0, 0, 0], null, parameter.foreBrush);
        graphics.restore();
        if ((typeof _isFlatten !== 'undefined' && !_isFlatten) || !this._isLoaded) {
            if (this._dictionary.has('AP')) {
                _removeDuplicateReference(this._dictionary.get('AP'), this._crossReference, 'N');
            }
            const dic: _PdfDictionary = new _PdfDictionary();
            const tem: _PdfBaseStream = graphics._template._content;
            tem.dictionary._updated = true;
            const ref: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(ref, tem);
            graphics._template._content.reference = ref;
            dic.set('N', ref);
            dic._updated = true;
            this._dictionary.set('AP', dic);
            let nativeRectangle1: number[] = [this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height];
            const size: number[] = this._page.size;
            nativeRectangle1[1] = size[1] - (this.bounds.y + this.bounds.height);
            nativeRectangle1[2] = (this.bounds.x + this.bounds.width);
            nativeRectangle1[3] = size[1] - this.bounds.y;
            if (this._isBounds) {
                nativeRectangle =  nativeRectangle1;
            }
            if (this._page._isNew && this._page._pageSettings) {
                nativeRectangle1 = _updateBounds(this);
            }
            this._dictionary.update('Rect', [nativeRectangle1[0], nativeRectangle1[1], nativeRectangle1[2], nativeRectangle1[3]]);
            if (this._dictionary.has('Measure')) {
                _removeDuplicateReference(this._dictionary, this._crossReference, 'Measure');
            }
            const reference: _PdfReference = this._crossReference._getNextReference();
            const measureDictionary: _PdfDictionary = this._createMeasureDictionary(this._unitString);
            this._crossReference._cacheMap.set(reference, measureDictionary);
            measureDictionary._updated = true;
            this._dictionary.update('Measure', reference);
            const ds: string = 'font:' +
                font._metrics._postScriptName +
                ' ' +
                font._size +
                'pt; color:' +
                this._colorToHex(this.color);
            this._dictionary.update('DS', ds);
            if (this._text && this._text !== '') {
                this._dictionary.update('Contents', this._text + ' ' + area.toFixed(2) + ' sq ' + this._unitString);
            } else {
                this._dictionary.update('Contents', area.toFixed(2) + ' sq ' + this._unitString);
            }
            this._dictionary.update('Subject', ('Area Measurement'));
            if (typeof this.subject === 'undefined') {
                this._dictionary.update('Subject', ('Area Measurement'));
            }
            this._dictionary.update('MeasurementTypes', 129);
            this._dictionary.update('Subtype', new _PdfName('Square'));
            this._dictionary.update('IT', new _PdfName('SquareDimension'));
            const elements: number[] = this._dictionary.getArray('Rect');
            const vertices: number[] = new Array<number>(elements.length * 2);
            vertices[0] = elements[0];
            vertices[1] = elements[3];
            vertices[2] = elements[0];
            vertices[3] = elements[1];
            vertices[4] = elements[2];
            vertices[5] = elements[1];
            vertices[6] = elements[2];
            vertices[7] = elements[3];
            this._dictionary.update('Vertices', vertices);
        }
        return template;
    }
    _calculateAreaOfSquare(): number {
        let area: number;
        const converter: _PdfUnitConvertor = new _PdfUnitConvertor();
        let value: {graphicsUnit: _PdfGraphicsUnit , unitString: string };
        if (this.bounds.width === this.bounds.height) {
            value = this._getEqualPdfGraphicsUnit(this.unit, this._unitString);
            this._unitString = value.unitString;
            const width: number = converter._convertUnits(this.bounds.width, _PdfGraphicsUnit.point, value.graphicsUnit);
            area = width * width;
        } else {
            value = this._getEqualPdfGraphicsUnit(this.unit, this._unitString);
            this._unitString = value.unitString;
            const width: number = converter._convertUnits(this.bounds.width, _PdfGraphicsUnit.point, value.graphicsUnit);
            value = this._getEqualPdfGraphicsUnit(this.unit, this._unitString);
            this._unitString = value.unitString;
            const height: number = converter._convertUnits(this.bounds.height, _PdfGraphicsUnit.point, value.graphicsUnit);
            area = width * height;
        }
        return area;
    }
}
/**
 * `PdfRectangleAnnotation` class represents the rectangle annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new square annotation with bounds
 * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation(10, 10, 200, 100);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfRectangleAnnotation extends PdfComment {
    private _intensity: number;
    /**
     * Initializes a new instance of the `PdfRectangleAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfRectangleAnnotation` class with rectangle bounds.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new rectangle annotation with bounds
     * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation(10, 10, 200, 100);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number )
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Square'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        this._type = _PdfAnnotationType.rectangleAnnotation;
    }
    /**
     * Gets the border effect of the rectangle annotation.
     *
     * @returns {PdfBorderEffect} Border effect.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRectangleAnnotation = page.annotations.at(0) as PdfRectangleAnnotation;
     * // Gets the border effect of the rectangle annotation.
     * let borderEffect: PdfBorderEffect = annotation.borderEffect;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get borderEffect(): PdfBorderEffect {
        if (typeof this._borderEffect === 'undefined') {
            const value: PdfBorderEffect = new PdfBorderEffect();
            value._dictionary = this._dictionary;
            if (this._dictionary.has('BE')) {
                const dictionary: _PdfDictionary = this._dictionary.get('BE');
                value._intensity = dictionary.get('I');
                value._style = _mapBorderEffectStyle(dictionary.get('S').name);
            }
            this._borderEffect = value;
        }
        return this._borderEffect;
    }
    /**
     * Sets the border effect of the rectangle annotation.
     *
     * @param {PdfBorderEffect} value Border effect.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRectangleAnnotation = page.annotations.at(0) as PdfRectangleAnnotation;
     * // Sets the border effect of rectangle annotation.
     * annotation. borderEffect.style = PdfBorderEffectStyle.cloudy;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set borderEffect(value: PdfBorderEffect) {
        if (typeof value !== 'undefined') {
            this._borderEffect = value;
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfRectangleAnnotation {
        const annot: PdfRectangleAnnotation = new PdfRectangleAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(isFlatten: boolean): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dic: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dic.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dic);
        }
        if (!this._dictionary.has('C')) {
            this.color = [0, 0, 0];
            this._isTransparentColor = true;
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        this._dictionary.update('Rect', _updateBounds(this));
        if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
            this._appearanceTemplate = this._createRectangleAppearance(this.borderEffect);
        }
        if (typeof this._intensity === 'undefined' &&
            typeof this._borderEffect !== 'undefined' &&
            this._borderEffect.style === PdfBorderEffectStyle.cloudy) {
            const dic: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dic.set('I', this.borderEffect._intensity);
            if (this.borderEffect._style === PdfBorderEffectStyle.cloudy) {
                dic.set('S', _PdfName.get('C'));
            }
            this._dictionary.update('BE', dic);
        }
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._isLoaded) {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                this._appearanceTemplate = this._createRectangleAppearance(this.borderEffect);
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (appearanceStream) {
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess(isFlatten);
            if (!this._appearanceTemplate && isFlatten) {
                if (!this._dictionary.has('AP')) {
                    this._appearanceTemplate = this._createRectangleAppearance(this.borderEffect);
                } else {
                    const dictionary: _PdfDictionary = this._dictionary.get('AP');
                    if (dictionary && dictionary.has('N')) {
                        const appearanceStream: _PdfBaseStream = dictionary.get('N');
                        const reference: _PdfReference = dictionary.getRaw('N');
                        if (appearanceStream) {
                            if (reference) {
                                appearanceStream.reference = reference;
                            }
                            this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            } else {
                this._flattenPopUp();
            }
        }
        if (isFlatten && this._appearanceTemplate) {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            if (isNormalMatrix && this._page.rotation !== PdfRotationAngle.angle0 ||
                this._isValidTemplateMatrix(this._appearanceTemplate._content.dictionary,
                                            this.bounds, this._appearanceTemplate)) {
                this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
            }
        }
        if (!isFlatten && this._setAppearance) {
            let appearance: _PdfDictionary;
            if (this._dictionary.has('AP')) {
                appearance = this._dictionary.get('AP');
            } else {
                const reference: _PdfReference = this._crossReference._getNextReference();
                appearance = new _PdfDictionary(this._crossReference);
                this._crossReference._cacheMap.set(reference, appearance);
                this._dictionary.update('AP', reference);
            }
            _removeDuplicateReference(appearance, this._crossReference, 'N');
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
            appearance.update('N', reference);
        }
    }
    _isValidTemplateMatrix(dictionary: _PdfDictionary, bounds: {x: number, y: number, width: number, height: number},
                           appearanceTemplate: PdfTemplate): boolean {
        let isValidMatrix: boolean = true;
        const pointF: {x: number, y: number, width: number, height: number} = bounds;
        if (dictionary && dictionary.has('Matrix')) {
            const box: number[] = dictionary.getArray('BBox');
            const matrix: number[] = dictionary.getArray('Matrix');
            if (matrix && box && matrix.length > 3 && box.length > 2) {
                if (typeof matrix[0] !== 'undefined' &&
                    typeof matrix[1] !== 'undefined' &&
                    typeof matrix[2] !== 'undefined' &&
                    typeof matrix[3] !== 'undefined') {
                    if (matrix[0] === 1 && matrix[1] === 0 && matrix[2] === 0 && matrix[3] === 1) {
                        if (typeof box[0] !== 'undefined' &&
                            typeof box[1] !== 'undefined' &&
                            typeof box[2] !== 'undefined' &&
                            typeof box[3] !== 'undefined') {
                            if (Math.round(box[0]) !== Math.round(-(matrix[4])) && Math.round(box[1]) !== Math.round(-(matrix[5])) ||
                                box[0] === 0 && Math.round(-(matrix[4])) === 0) {
                                const graphics: PdfGraphics = this._page.graphics;
                                const state: PdfGraphicsState = graphics.save();
                                if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                                    graphics.setTransparency(this._opacity);
                                }
                                pointF.x -= box[0];
                                pointF.y += box[1];
                                graphics.drawTemplate(appearanceTemplate, pointF);
                                graphics.restore(state);
                                this._page.annotations.remove(this);
                                isValidMatrix = false;
                            }
                        }
                    }
                }
            }
        }
        return isValidMatrix;
    }
}
/**
 * `PdfPolygonAnnotation` class represents the polygon annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new polygon annotation with bounds
 * const annotation: PdfPolygonAnnotation = new PdfPolygonAnnotation([100, 300, 150, 200, 300, 200, 350, 300, 300, 400, 150, 400]);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPolygonAnnotation extends PdfComment {
    private _points: number[];
    private _lineExtension: number;
    private _intensity: number;
    /**
     * Initializes a new instance of the `PdfPolygonAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfPolygonAnnotation` class.
     *
     * @param {number[]} points Line points.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new polygon annotation with bounds
     * const annotation: PdfPolygonAnnotation = new PdfPolygonAnnotation([100, 300, 150, 200, 300, 200, 350, 300, 300, 400, 150, 400]);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(points: number[])
    constructor(points?: number[]) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Polygon'));
        if (typeof points !== 'undefined') {
            this._points = points;
        }
        this._type = _PdfAnnotationType.polygonAnnotation;
    }
    /**
     * Gets the border effect of the polygon annotation.
     *
     * @returns {PdfBorderEffect} Border effect.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPolygonAnnotation = page.annotations.at(0) as PdfPolygonAnnotation;
     * // Gets the border effect of the polygon annotation.
     * let borderEffect: PdfBorderEffect = annotation.borderEffect;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get borderEffect(): PdfBorderEffect {
        if (typeof this._borderEffect === 'undefined') {
            const value: PdfBorderEffect = new PdfBorderEffect();
            value._dictionary = this._dictionary;
            if (this._dictionary.has('BE')) {
                const dictionary: _PdfDictionary = this._dictionary.get('BE');
                value._intensity = dictionary.get('I');
                value._style = _mapBorderEffectStyle(dictionary.get('S').name);
            }
            this._borderEffect = value;
        }
        return this._borderEffect;
    }
    /**
     * Sets the border effect of the polygon annotation.
     *
     * @param {PdfBorderEffect} value Border effect.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPolygonAnnotation = page.annotations.at(0) as PdfPolygonAnnotation;
     * // Sets the border effect of the polygon annotation
     * annotation.borderEffect.style = PdfBorderEffectStyle.cloudy ;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set borderEffect(value: PdfBorderEffect) {
        if (typeof value !== 'undefined') {
            this._borderEffect = value;
        }
    }
    /**
     * Gets the line extension of the polygon annotation.
     *
     * @returns {number} Line extension.
     *  ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPolygonAnnotation = page.annotations.at(0) as PdfPolygonAnnotation;
     * // Gets the line extension of the polygon annotation
     * let lineExtension: number = annotation.lineExtension;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get lineExtension(): number {
        if (typeof this._lineExtension === 'undefined' && this._dictionary.has('LLE')) {
            const lineExt: number = this._dictionary.get('LLE');
            if (typeof lineExt !== 'undefined' && lineExt >= 0) {
                this._lineExtension = lineExt;
            }
        }
        return this._lineExtension;
    }
    /**
     * Sets the line extension of the polygon annotation.
     *
     * @param {number} value Line extension.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPolygonAnnotation = page.annotations.at(0) as PdfPolygonAnnotation;
     * // Sets the line extension of the polygon annotation
     * annotation.lineExtension = 5;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set lineExtension(value: number) {
        if (!Number.isNaN(value)) {
            if (value >= 0) {
                this._dictionary.update('LLE', value);
                this._lineExtension = value;
            } else {
                throw new Error('LineExtension should be non negative number');
            }
        }
    }
    //Implementation
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfPolygonAnnotation {
        const annot: PdfPolygonAnnotation = new PdfPolygonAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(isFlatten: boolean): void {
        if (typeof this._points === 'undefined' || this._points === null) {
            throw new Error('Points cannot be null or undefined');
        }
        if (!this._dictionary.has('LLE')) {
            this.lineExtension = 0;
        }
        if (!this._dictionary.has('C')) {
            this.color = [0, 0, 0];
            this._isTransparentColor = true;
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dic: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dic.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dic);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        const array: number[] = [];
        for (let i: number = 0; i < this._points.length; i++) {
            const value: number = this._points[Number.parseInt(i.toString(), 10)];
            array.push(value);
        }
        this._points = this._getPoints(this._points);
        if (array[0] !== array[array.length - 2] || array[1] !== array[array.length - 1]) {
            this._points.push(this._points[0]);
            this._points.push(this._points[1]);
        }
        const polygonBounds: {x: number, y: number, width: number, height: number} = this._getBoundsValue(this._points);
        const bounds: number[] = [polygonBounds.x,
            polygonBounds.y,
            polygonBounds.x + polygonBounds.width,
            polygonBounds.y + polygonBounds.height];
        this._dictionary.update('Rect', bounds);
        this._dictionary.update('LLE', this._lineExtension);
        if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
            this._appearanceTemplate = this._createPolygonAppearance(isFlatten);
        }
        this._dictionary.update('Vertices', this._points);
        if (typeof this._intensity === 'undefined' &&
            typeof this._borderEffect !== 'undefined' &&
            this._borderEffect.style === PdfBorderEffectStyle.cloudy) {
            const dic: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dic.set('I', this.borderEffect._intensity);
            if (this.borderEffect._style === PdfBorderEffectStyle.cloudy) {
                dic.set('S', _PdfName.get('C'));
            }
            this._dictionary.update('BE', dic);
        }
    }
    _doPostProcess(isFlatten: boolean = false): void {
        this._flatten = isFlatten;
        if (this._isLoaded) {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                this._appearanceTemplate = this._createPolygonAppearance(isFlatten);
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (appearanceStream) {
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess(isFlatten);
            if (!this._appearanceTemplate && isFlatten) {
                if (this._dictionary.has('AP')) {
                    const dictionary: _PdfDictionary = this._dictionary.get('AP');
                    if (dictionary && dictionary.has('N')) {
                        const appearanceStream: _PdfBaseStream = dictionary.get('N');
                        const reference: _PdfReference = dictionary.getRaw('N');
                        if (appearanceStream) {
                            if (reference) {
                                appearanceStream.reference = reference;
                            }
                            this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            }
        }
        if (isFlatten) {
            if (this._appearanceTemplate) {
                const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
                if (!this._appearanceTemplate._content.dictionary.has('Matrix')) {
                    const box: number[] = this._appearanceTemplate._content.dictionary.getArray('BBox');
                    if (box && box.length >= 2) {
                        this._appearanceTemplate._content.dictionary.update('Matrix', [1, 0, 0, 1, -box[0], -box[1]]);
                    }
                }
                this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
            } else {
                this._page.annotations.remove(this);
            }
        }
        if (!isFlatten && this._setAppearance) {
            let appearance: _PdfDictionary;
            if (this._dictionary.has('AP')) {
                appearance = this._dictionary.get('AP');
            } else {
                const reference: _PdfReference = this._crossReference._getNextReference();
                appearance = new _PdfDictionary(this._crossReference);
                this._crossReference._cacheMap.set(reference, appearance);
                this._dictionary.update('AP', reference);
            }
            _removeDuplicateReference(appearance, this._crossReference, 'N');
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
            appearance.update('N', reference);
        }
    }
    _createPolygonAppearance(flatten: boolean): PdfTemplate {
        if (typeof flatten !== 'undefined' && flatten) {
            let borderPen: PdfPen;
            if (this.color && this.border.width > 0) {
                borderPen = new PdfPen(this.color, this.border.width);
            }
            let backgroundBrush: PdfBrush;
            if (this.innerColor) {
                backgroundBrush = new PdfBrush(this.innerColor);
            }
            const graphics: PdfGraphics = this._page.graphics;
            if (borderPen || backgroundBrush) {
                let state: PdfGraphicsState;
                if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                    state = graphics.save();
                    graphics.setTransparency(this._opacity);
                }
                if (this.borderEffect.intensity !== 0 && this.borderEffect.style === PdfBorderEffectStyle.cloudy) {
                    const radius: number = this.borderEffect.intensity * 4 + 0.5 * this.border.width;
                    const graphicsPath: PdfPath = new PdfPath();
                    graphicsPath.addPolygon(this._getLinePoints());
                    this._drawCloudStyle(graphics, backgroundBrush, borderPen, radius, 0.833, graphicsPath._points, false);
                } else {
                    graphics.drawPolygon(this._getLinePoints(), borderPen, backgroundBrush);
                }
                if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                    graphics.restore(state);
                }
            }
            return graphics._template;
        } else {
            let boundsValue: {x: number, y: number, width: number, height: number};
            const rect: {x: number, y: number, width: number, height: number} = {x: 0, y: 0, width: 0, height: 0};
            if (typeof this._points === 'undefined' && this._dictionary.has('Vertices')) {
                this._points = this._dictionary.get('Vertices');
                boundsValue = this._getBoundsValue(this._points);
            } else {
                boundsValue = this._getBoundsValue(this._points);
            }
            if (typeof this._borderEffect !== 'undefined' &&
                typeof this.borderEffect.intensity !== 'undefined' && this.borderEffect.intensity !== 0 &&
                this._borderEffect.style === PdfBorderEffectStyle.cloudy) {
                rect.x = boundsValue.x - (this.borderEffect.intensity * 5) - this.border.width;
                rect.y = boundsValue.y - (this.borderEffect.intensity * 5) - this.border.width;
                rect.width = boundsValue.width + (this.borderEffect.intensity * 10) + (2 * this.border.width);
                rect.height = boundsValue.height + (this.borderEffect.intensity * 10) + (2 * this.border.width);
            } else {
                rect.x = boundsValue.x - this.border.width;
                rect.y = boundsValue.y - this.border.width;
                rect.width = boundsValue.width + (2 * this.border.width);
                rect.height = boundsValue.height + (2 * this.border.width);
            }
            const appearance: PdfAppearance = new PdfAppearance(this, [rect.x, rect.y, rect.width, rect.height]);
            appearance.normal = new PdfTemplate([rect.x, rect.y, rect.width, rect.height], this._crossReference);
            const template: PdfTemplate =  appearance.normal;
            _setMatrix(template, this._getRotationAngle());
            template._writeTransformation = false;
            const graphics: PdfGraphics = appearance.normal.graphics;
            const parameter: _PaintParameter = new _PaintParameter();
            if (this.innerColor) {
                parameter.backBrush = new PdfBrush(this._innerColor);
            }
            if (this.border.width > 0 && this.color) {
                parameter.borderPen = new PdfPen(this._color, this.border.width);
            }
            if (this.color) {
                parameter.foreBrush = new PdfBrush(this._color);
            }
            if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                graphics.save();
                graphics.setTransparency(this._opacity);
            } else {
                graphics.save();
            }
            if (this.borderEffect.intensity !== 0 && this.borderEffect.style === PdfBorderEffectStyle.cloudy) {
                const radius: number = this.borderEffect.intensity * 4 + 0.5 * this.border.width;
                const graphicsPath: PdfPath = new PdfPath();
                graphicsPath.addPolygon(this._getLinePoints());
                this._drawCloudStyle(graphics, parameter.backBrush, parameter.borderPen, radius, 0.833, graphicsPath._points, false);
            } else {
                graphics.drawPolygon(this._getLinePoints(), parameter.borderPen, parameter.backBrush);
            }
            if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                graphics.restore();
            }
            graphics.restore();
            if (this._isBounds) {
                template._content.dictionary._updated = true;
                this._dictionary.update('LLE', this.lineExtension);
                this._dictionary.update('Vertices', this._points);
            }
            this._dictionary.update('Rect', [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height]);
            return template;
        }
    }
    _getLinePoints(): Array<number[]> {
        let polygonPoints: Array<number[]>;
        const pageSize: number[] = this._page.size;
        const pageHeight: number = pageSize[1];
        const pageWidth: number = pageSize[0];
        if (this._dictionary.has('Vertices') && !this._isBounds) {
            let rotation: number;
            if (this._page._pageDictionary.has('Rotate')) {
                rotation = this._page._pageDictionary.get('Rotate');
            }
            if (this._page.rotation) {
                if (this._page.rotation === PdfRotationAngle.angle90) {
                    rotation = 90;
                } else if (this._page.rotation === PdfRotationAngle.angle180) {
                    rotation = 180;
                } else if (this._page.rotation === PdfRotationAngle.angle270) {
                    rotation = 270;
                }
            }
            const linePoints: number[] = this._dictionary.getArray('Vertices');
            if (linePoints) {
                const points: number[] = [];
                linePoints.forEach((value: number) => {
                    points.push(value);
                });
                polygonPoints = [];
                for (let j: number = 0; j < points.length; j = j + 2) {
                    if (this.flatten) {
                        polygonPoints.push([points[Number.parseInt(j.toString(), 10)], (pageHeight - points[j + 1])]);
                    } else {
                        polygonPoints.push([points[Number.parseInt(j.toString(), 10)], -points[j + 1]]);
                    }
                }
                if (rotation) {
                    if (rotation === 270) {
                        for (let k: number = 0; k < polygonPoints.length; k++) {
                            const x: number = polygonPoints[Number.parseInt(k.toString(), 10)][0];
                            polygonPoints[Number.parseInt(k.toString(), 10)][0] = polygonPoints[Number.parseInt(k.toString(), 10)][1];
                            polygonPoints[Number.parseInt(k.toString(), 10)][1] = pageWidth - x;
                        }
                    } else if (rotation === 90) {
                        for (let k: number = 0; k < polygonPoints.length; k++) {
                            const x: number = polygonPoints[Number.parseInt(k.toString(), 10)][0];
                            if (this._page._origin[1] !== 0) {
                                polygonPoints[Number.parseInt(k.toString(), 10)][0] = pageHeight -
                                    (polygonPoints[Number.parseInt(k.toString(), 10)][1] - pageHeight);
                            } else {
                                polygonPoints[Number.parseInt(k.toString(), 10)][0] = pageHeight -
                                    polygonPoints[Number.parseInt(k.toString(), 10)][1];
                            }
                            polygonPoints[Number.parseInt(k.toString(), 10)][1] = x;
                        }
                    } else if (rotation === 180) {
                        for (let k: number = 0; k < polygonPoints.length; k++) {
                            const x: number = polygonPoints[Number.parseInt(k.toString(), 10)][0];
                            polygonPoints[Number.parseInt(k.toString(), 10)][0] = pageWidth - x;
                            polygonPoints[Number.parseInt(k.toString(), 10)][1] = pageHeight -
                                polygonPoints[Number.parseInt(k.toString(), 10)][1];
                        }
                    }
                }
            }
        } else if (this._points !== null) {
            const points: number[] = [];
            this._points.forEach((value: number) => {
                points.push(value);
            });
            polygonPoints = [];
            for (let j: number = 0; j < this._points.length; j = j + 2) {
                if (this.flatten) {
                    polygonPoints.push([points[Number.parseInt(j.toString(), 10)], (pageHeight - points[j + 1])]);
                } else {
                    polygonPoints.push([points[Number.parseInt(j.toString(), 10)], - points[j + 1]]);
                }
            }
        }
        return polygonPoints;
    }
}
/**
 * `PdfPolyLineAnnotation` class represents the polyline annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new poly line annotation with bounds
 * const annotation: PdfPolyLineAnnotation = new PdfPolyLineAnnotation ([100, 300, 150, 200, 300, 200, 350, 300, 300, 400, 150, 400]);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPolyLineAnnotation extends PdfComment {
    private _points: number[];
    private _lineExtension: number;
    private _beginLine: PdfLineEndingStyle = PdfLineEndingStyle.none;
    private _endLine: PdfLineEndingStyle = PdfLineEndingStyle.none;
    private _pathTypes: PathPointType[];
    private _polylinePoints: Array<number[]>;
    /**
     * Initializes a new instance of the `PdfPolyLineAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfPolyLineAnnotation` class.
     *
     * @param {number[]} points Line points.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new poly line annotation with bounds
     * const annotation: PdfPolyLineAnnotation = new PdfPolyLineAnnotation ([100, 300, 150, 200, 300, 200, 350, 300, 300, 400, 150, 400]);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(points: number[])
    constructor(points?: number[]) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('PolyLine'));
        if (typeof points !== 'undefined') {
            this._points = points;
        }
        this._type = _PdfAnnotationType.polyLineAnnotation;
    }
    /**
     * Gets the begin line ending style of the annotation.
     *
     * @returns {PdfLineEndingStyle} Begin line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPolyLineAnnotation = page.annotations.at(0) as PdfPolyLineAnnotation;
     * // Gets the begin line ending style of the annotation.
     * let beginLineStyle: PdfLineEndingStyle = annotation.beginLineStyle;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get beginLineStyle(): PdfLineEndingStyle {
        if (this._dictionary.has('LE')) {
            const lineStyles: _PdfName[] = this._dictionary.getArray('LE');
            if (lineStyles && Array.isArray(lineStyles)) {
                this._beginLine = _mapLineEndingStyle(lineStyles[0].name);
            }
        }
        return this._beginLine;
    }
    /**
     * Sets the begin line ending style of the annotation.
     *
     * @param {PdfLineEndingStyle} value Begin line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPolyLineAnnotation = page.annotations.at(0) as PdfPolyLineAnnotation;
     * // Sets the begin line ending style of the annotation.
     * annotation.beginLineStyle = PdfLineEndingStyle.slash;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set beginLineStyle(value: PdfLineEndingStyle ) {
        if (value !== this._beginLine) {
            this._beginLine = value;
            if (this._dictionary) {
                const lineStyle: _PdfName[] = [];
                lineStyle.push(_PdfName.get(_reverseMapEndingStyle(value)));
                lineStyle.push(_PdfName.get(_reverseMapEndingStyle(this.endLineStyle)));
                this._dictionary.update('LE', lineStyle);
            }
        }
    }
    /**
     * Gets the end line ending style of the annotation.
     *
     * @returns {PdfLineEndingStyle} End line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPolyLineAnnotation = page.annotations.at(0) as PdfPolyLineAnnotation;
     * // Gets the end line ending style of the annotation.
     * let endLineStyle: PdfLineEndingStyle = annotation.endLineStyle;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get endLineStyle(): PdfLineEndingStyle {
        if (this._dictionary.has('LE')) {
            const lineStyles: _PdfName[] = this._dictionary.getArray('LE');
            if (lineStyles && Array.isArray(lineStyles)) {
                this._endLine = _mapLineEndingStyle(lineStyles[1].name);
            }
        }
        return this._endLine;
    }
    /**
     * Sets the end line ending style of the annotation.
     *
     * @param {PdfLineEndingStyle} value End line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPolyLineAnnotation = page.annotations.at(0) as PdfPolyLineAnnotation;
     * // Sets the end line ending style of the annotation.
     * annotation.endLineStyle = PdfLineEndingStyle.square;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set endLineStyle(value: PdfLineEndingStyle ) {
        if (value !== this._endLine) {
            this._endLine = value;
            if (this._dictionary) {
                const lineStyle: _PdfName[] = [];
                lineStyle.push(_PdfName.get(_reverseMapEndingStyle(this.beginLineStyle)));
                lineStyle.push(_PdfName.get(_reverseMapEndingStyle(value)));
                this._dictionary.update('LE', lineStyle);
            }
        }
    }
    /**
     * Gets the line extension of the square annotation.
     *
     * @returns {number} Line extension.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPolyLineAnnotation = page.annotations.at(0) as PdfPolyLineAnnotation;
     * // Gets the line extension of annotation.
     * let lineExtension: number = annotation.lineExtension;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get lineExtension(): number {
        if (typeof this._lineExtension === 'undefined' && this._dictionary.has('LLE')) {
            const lineExt: number = this._dictionary.get('LLE');
            if (typeof lineExt !== 'undefined' && lineExt >= 0) {
                this._lineExtension = lineExt;
            }
        }
        return this._lineExtension;
    }
    /**
     * Sets the line extension of the square annotation.
     *
     * @param {number} value Line extension.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPolyLineAnnotation = page.annotations.at(0) as PdfPolyLineAnnotation;
     * // Sets the line extension of the annotation.
     * annotation.lineExtension = 3;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set lineExtension(value: number) {
        if (!Number.isNaN(value)) {
            if (value >= 0) {
                this._dictionary.update('LLE', value);
                this._lineExtension = value;
            } else {
                throw new Error('LineExtension should be non negative number');
            }
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfPolyLineAnnotation {
        const annot: PdfPolyLineAnnotation = new PdfPolyLineAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(isFlatten: boolean): void {
        if (typeof this._points === 'undefined' || this._points === null) {
            throw new Error('Points cannot be null or undefined');
        }
        if (!this._dictionary.has('LLE')) {
            this.lineExtension = 0;
        }
        if (!this._dictionary.has('C')) {
            this.color = [0, 0, 0];
            this._isTransparentColor = true;
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        const points: Array<number[]> = this._getLinePoints();
        const pathTypes: PathPointType[] = [];
        pathTypes.push(0);
        for (let i: number = 1; i < points.length; i++) {
            pathTypes.push(1);
        }
        this._polylinePoints = points;
        this._pathTypes = pathTypes;
        const path: PdfPath = new PdfPath();
        path._points = points;
        path._pathTypes = pathTypes;
        this._dictionary.update('Vertices', this._points);
        const lineStyle: _PdfName[] = [];
        lineStyle.push(_PdfName.get(_reverseMapEndingStyle(this.beginLineStyle)));
        lineStyle.push(_PdfName.get(_reverseMapEndingStyle(this.endLineStyle)));
        this._dictionary.update('LE', lineStyle);
        this._dictionary.update('LLE', this._lineExtension);
        const polyLineBounds: {x: number, y: number, width: number, height: number} = this._getBoundsValue(this._points);
        const rectangle: number[] = [polyLineBounds.x,
            polyLineBounds.y,
            polyLineBounds.x + polyLineBounds.width,
            polyLineBounds.y + polyLineBounds.height];
        this._dictionary.update('Rect', rectangle);
        if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
            this._appearanceTemplate = this._createPolyLineAppearance(isFlatten);
        }
    }
    _doPostProcess(isFlatten: boolean = false): void {
        this._flatten = isFlatten;
        if (this._isLoaded) {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                this._appearanceTemplate = this._createPolyLineAppearance(isFlatten);
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (appearanceStream) {
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess(isFlatten);
            if (!this._appearanceTemplate && isFlatten) {
                if (!this._dictionary.has('AP')) {
                    this._appearanceTemplate = this._createPolyLineAppearance(isFlatten);
                } else {
                    const dictionary: _PdfDictionary = this._dictionary.get('AP');
                    if (dictionary && dictionary.has('N')) {
                        const appearanceStream: _PdfBaseStream = dictionary.get('N');
                        const reference: _PdfReference = dictionary.getRaw('N');
                        if (appearanceStream) {
                            if (reference) {
                                appearanceStream.reference = reference;
                            }
                            this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            }
        }
        if (isFlatten) {
            if (this._appearanceTemplate) {
                const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
                if (!this._appearanceTemplate._content.dictionary.has('Matrix')) {
                    const box: number[] = this._appearanceTemplate._content.dictionary.getArray('BBox');
                    if (box) {
                        this._appearanceTemplate._content.dictionary.update('Matrix', [1, 0, 0, 1, -box[0], -box[1]]);
                    }
                }
                this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
            } else {
                this._page.annotations.remove(this);
            }
        }
        if (!isFlatten && this._setAppearance) {
            let appearance: _PdfDictionary;
            if (this._dictionary.has('AP')) {
                appearance = this._dictionary.get('AP');
            } else {
                const reference: _PdfReference = this._crossReference._getNextReference();
                appearance = new _PdfDictionary(this._crossReference);
                this._crossReference._cacheMap.set(reference, appearance);
                this._dictionary.update('AP', reference);
            }
            _removeDuplicateReference(appearance, this._crossReference, 'N');
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
            appearance.update('N', reference);
        }
    }
    _createPolyLineAppearance(flatten: boolean): PdfTemplate {
        const color: number[] = this.color ? this.color : [0, 0, 0];
        if (typeof flatten !== 'undefined' && flatten) {
            let borderPen: PdfPen;
            if (this.border.width > 0) {
                borderPen = new PdfPen(color, this.border.width);
            }
            const graphics: PdfGraphics = this._page.graphics;
            if (borderPen) {
                let state: PdfGraphicsState;
                if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                    state = graphics.save();
                    graphics.setTransparency(this._opacity);
                }
                const points: Array<number[]> = this._getLinePoints();
                const pathTypes: PathPointType[] = [];
                pathTypes.push(0);
                if (points && points.length > 0) {
                    for (let i: number = 1; i < points.length; i++) {
                        pathTypes.push(1);
                    }
                    const path: PdfPath = new PdfPath();
                    path._points = points;
                    path._pathTypes = pathTypes;
                    graphics.drawPath(path, borderPen);
                    if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                        graphics.restore(state);
                    }
                }
            }
            return graphics._template;
        } else {
            let boundsValue: {x: number, y: number, width: number, height: number};
            const rect: {x: number, y: number, width: number, height: number} = {x: 0, y: 0, width: 0, height: 0};
            if (typeof this._points === 'undefined' && this._dictionary.has('Vertices')) {
                this._points = this._dictionary.get('Vertices');
                boundsValue = this._getBoundsValue(this._points);
            } else {
                boundsValue = this._getBoundsValue(this._points);
            }
            rect.x = boundsValue.x - this.border.width;
            rect.y = boundsValue.y - this.border.width;
            rect.width = boundsValue.width + (2 * this.border.width);
            rect.height = boundsValue.height + (2 * this.border.width);
            const appearance: PdfAppearance = new PdfAppearance(this, [rect.x, rect.y, rect.width, rect.height]);
            appearance.normal = new PdfTemplate([rect.x, rect.y, rect.width, rect.height], this._crossReference);
            const template: PdfTemplate =  appearance.normal;
            _setMatrix(template, this._getRotationAngle());
            template._writeTransformation = false;
            const graphics: PdfGraphics = appearance.normal.graphics;
            const parameter: _PaintParameter = new _PaintParameter();
            if (this.innerColor) {
                parameter.backBrush = new PdfBrush(this._innerColor);
            }
            if (this.border.width > 0 && color) {
                parameter.borderPen = new PdfPen(color, this.border.width);
            }
            if (color) {
                parameter.foreBrush = new PdfBrush(color);
            }
            if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                graphics.save();
                graphics.setTransparency(this._opacity);
            } else {
                graphics.save();
            }
            const path: PdfPath = new PdfPath();
            if (typeof this._polylinePoints !== 'undefined' && this._polylinePoints !== null) {
                path._points = this._polylinePoints;
            } else {
                path._points = this._getLinePoints();
            }
            if (typeof this._pathTypes !== 'undefined' && this._polylinePoints !== null) {
                path._pathTypes = this._pathTypes;
            } else {
                this._pathTypes = [];
                this._pathTypes.push(0);
                for (let i: number = 1; i < path._points.length; i++) {
                    this._pathTypes.push(1);
                }
                path._pathTypes = this._pathTypes;
            }
            graphics.drawPath(path, parameter.borderPen, parameter.backBrush);
            if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                graphics.restore();
            }
            graphics.restore();
            if (this._isBounds) {
                template._content.dictionary._updated = true;
                const lineStyle: _PdfName[] = [];
                lineStyle.push(_PdfName.get(_reverseMapEndingStyle(this.beginLineStyle)));
                lineStyle.push(_PdfName.get(_reverseMapEndingStyle(this.endLineStyle)));
                this._dictionary.update('LE', lineStyle);
                this._dictionary.update('LLE', this.lineExtension);
                this._dictionary.update('Vertices', this._points);
            }
            this._dictionary.update('Rect', [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height]);
            return template;
        }
    }
    _getLinePoints(): Array<number[]> {
        const pageSize: number[] = this._page.size;
        const pageHeight: number = pageSize[1];
        let points: Array<number[]>;
        if (this._dictionary.has('Vertices') && !this._isBounds && (!this._setAppearance || (this._setAppearance && this.flatten))) {
            const linePoints: number[] = this._dictionary.getArray('Vertices');
            if (linePoints) {
                points = [];
                for (let j: number = 0; j < linePoints.length; j = j + 2) {
                    points.push([linePoints[Number.parseInt(j.toString(), 10)], (pageHeight - linePoints[j + 1])]);
                }
            }
        } else if (this._points) {
            this._points = this._getPoints(this._points);
            const polyLinepoints: number[] = [];
            this._points.forEach((value: number) => {
                polyLinepoints.push(value);
            });
            points = [];
            for (let j: number = 0; j < polyLinepoints.length; j = j + 2) {
                if (this.flatten) {
                    points.push([polyLinepoints[Number.parseInt(j.toString(), 10)], (pageHeight - polyLinepoints[j + 1])]);
                } else {
                    points.push([polyLinepoints[Number.parseInt(j.toString(), 10)], - polyLinepoints[j + 1]]);
                }
            }
        }
        return points;
    }
}
/**
 * `PdfAngleMeasurementAnnotation` class represents the angle measurement annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new angle measurement annotation
 * const annotation: PdfAngleMeasurementAnnotation = new PdfAngleMeasurementAnnotation([[100, 700], [150, 650], [100, 600]]);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfAngleMeasurementAnnotation extends PdfComment {
    _linePoints: number[] = [];
    private _measure: boolean;
    private _firstIntersectionPoint: number[] = [0, 0];
    private _secondIntersectionPoint: number[] = [0, 0];
    private _pointArray: Array<number[]>;
    private _startAngle: number;
    private _sweepAngle: number;
    private _radius: number;
    /**
     * Initializes a new instance of the `PdfAngleMeasurementAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfAngleMeasurementAnnotation` class.
     *
     * @param {Array<number[]>} points Line points.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new angle measurement annotation
     * const annotation: PdfAngleMeasurementAnnotation = new PdfAngleMeasurementAnnotation([[100, 700], [150, 650], [100, 600]]);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(points: Array<number[]>)
    constructor(points?: Array<number[]>) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('PolyLine'));
        if (typeof points !== 'undefined' && points.length > 0) {
            if (points.length > 6) {
                throw new Error('Points length should not be greater than 3');
            }
            this._pointArray = points;
            for (let i: number = 0; i < points.length; i++) {
                this._linePoints.push(points[Number.parseInt(i.toString(), 10)][0]);
                this._linePoints.push(points[Number.parseInt(i.toString(), 10)][1]);
            }
        }
        this._type = _PdfAnnotationType.angleMeasurementAnnotation;
    }
    /**
     * Gets the flag to have measurement dictionary of the angle measurement annotation.
     *
     * @returns {boolean} measure.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfAngleMeasurementAnnotation = page.annotations.at(0) as PdfAngleMeasurementAnnotation;
     * // Gets the flag to have measurement dictionary of the angle annotation.
     * let measure: boolean = annotation.measure;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get measure(): boolean {
        if (typeof this._measure === 'undefined' && this._dictionary.has('Measure')) {
            this._measure =  this._dictionary.get('Measure');
        }
        return this._measure;
    }
    /**
     * Sets the flag to add measurement dictionary to the annotation.
     *
     * @param {boolean} value Measure.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfAngleMeasurementAnnotation = page.annotations.at(0) as PdfAngleMeasurementAnnotation;
     * // Sets the flag to add measurement dictionary to the annotation.
     * annotation.measure = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set measure(value: boolean) {
        if (value && !this._isLoaded) {
            this._measure = value;
            this.caption.cap = true;
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfAngleMeasurementAnnotation {
        const annot: PdfAngleMeasurementAnnotation = new PdfAngleMeasurementAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        if (!this._pointArray) {
            throw new Error('Points cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (!this._dictionary.has('C')) {
            this.color = [0, 0, 0];
            this._isTransparentColor = true;
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        this._appearanceTemplate = this._createAngleMeasureAppearance();
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._isLoaded) {
            if (!isFlatten && this._setAppearance) {
                this._appearanceTemplate = this._createAngleMeasureAppearance();
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (appearanceStream) {
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess();
            if (!this._appearanceTemplate) {
                if (isFlatten) {
                    if (!this._dictionary.has('AP')) {
                        this._appearanceTemplate = this._createAngleMeasureAppearance();
                    } else {
                        const dictionary: _PdfDictionary = this._dictionary.get('AP');
                        if (dictionary && dictionary.has('N')) {
                            const appearanceStream: _PdfBaseStream = dictionary.get('N');
                            const reference: _PdfReference = dictionary.getRaw('N');
                            if (appearanceStream) {
                                if (reference) {
                                    appearanceStream.reference = reference;
                                }
                                this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                            }
                        }
                    }
                }
            }
        }
        if (isFlatten && this._appearanceTemplate) {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            if (!this._appearanceTemplate._content.dictionary.has('Matrix')) {
                const box: number[] = this._appearanceTemplate._content.dictionary.getArray('BBox');
                if (box) {
                    this._appearanceTemplate._content.dictionary.update('Matrix', [1, 0, 0, 1, -box[0], -box[1]]);
                }
            }
            this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
        }
    }
    _createAngleMeasureAppearance(): PdfTemplate {
        const borderWidth: number = this.border.width;
        let font: PdfFont = this._obtainFont();
        if ((typeof font === 'undefined' || font === null) || (!this._isLoaded && font.size === 1)) {
            font = this._circleCaptionFont;
            this._pdfFont = font;
        }
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
        let angle: number = (this._calculateAngle() * (180.0 / Math.PI));
        if (angle < 0) {
            angle = -angle;
        }
        if (angle > 180) {
            angle = 360 - angle;
        }
        this._dictionary.update('Vertices', this._linePoints);
        const ds: string = 'font:' +
            font._metrics._postScriptName +
            ' ' +
            font._size +
            'pt; color:' +
            this._colorToHex(this.color);
        this._dictionary.update('DS', ds);
        if (this.text === (' ' + angle.toFixed(2) + '°')) {
            this._dictionary.update('Contents', this.text);
        } else if (this.text) {
            this._dictionary.update('Contents', this.text);
        }
        if (typeof this.subject === 'undefined') {
            this._dictionary.update('Subject', 'Angle Measurement');
        }
        this._dictionary.update('MeasurementTypes', 1152);
        this._dictionary.update('Subtype', new _PdfName('PolyLine'));
        this._dictionary.update('IT', new _PdfName('PolyLineAngle'));
        const measureDictionary: _PdfDictionary = new _PdfDictionary();
        const d: _PdfDictionary[] = [];
        const t: _PdfDictionary[] = [];
        const a: _PdfDictionary[] = [];
        const x: _PdfDictionary[] = [];
        const v: _PdfDictionary[] = [];
        measureDictionary.set('Type', _PdfName.get('measureDictionary'));
        measureDictionary.set('R', '1 in = 1 in');
        measureDictionary.set('Subtype', 'RL');
        measureDictionary.set('TargetUnitConversion', 0.1388889);
        const dDictionary: _PdfDictionary = new _PdfDictionary();
        dDictionary.set('U', 'in');
        dDictionary.set('Type', 'NumberFormat');
        dDictionary.set('C', 1);
        dDictionary.set('D', 1);
        dDictionary.set('SS', '');
        d.push(dDictionary);
        const tDictionary: _PdfDictionary = new _PdfDictionary();
        tDictionary.set('U', '°');
        tDictionary.set('Type', 'NumberFormat');
        tDictionary.set('C', 1);
        tDictionary.set('D', 1);
        tDictionary.set('FD', true);
        tDictionary.set('SS', '');
        t.push(tDictionary);
        const aDictionary: _PdfDictionary = new _PdfDictionary();
        aDictionary.set('U', 'sq in');
        aDictionary.set('Type', 'NumberFormat');
        aDictionary.set('C', 1);
        aDictionary.set('D', 1);
        aDictionary.set('FD', true);
        aDictionary.set('SS', '');
        a.push(aDictionary);
        const vDictionary: _PdfDictionary = new _PdfDictionary();
        vDictionary.set('U', 'cu in');
        vDictionary.set('Type', 'NumberFormat');
        vDictionary.set('C', 1);
        vDictionary.set('D', 1);
        vDictionary.set('FD', true);
        vDictionary.set('SS', '');
        v.push(vDictionary);
        const xDictionary: _PdfDictionary = new _PdfDictionary();
        xDictionary.set('U', 'in');
        xDictionary.set('Type', 'NumberFormat');
        xDictionary.set('C', 1);
        xDictionary.set('D', 1);
        xDictionary.set('SS', '');
        x.push(xDictionary);
        measureDictionary.set('D', d);
        measureDictionary.set('T', t);
        measureDictionary.set('A', a);
        measureDictionary.set('X', x);
        measureDictionary.set('V', v);
        if (this._dictionary.has('Measure')) {
            _removeDuplicateReference(this._dictionary, this._crossReference, 'Measure');
        }
        const reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, measureDictionary);
        measureDictionary._updated = true;
        this._dictionary.update('Measure', reference);
        let rectValue: number[] = [0, 0, 0, 0];
        const boundsValue: number[] = this._getAngleBoundsValue();
        const points: Array<number[]> = this._obtainLinePoints();
        const pathTypes: number[] = [];
        pathTypes.push(0);
        for (let i: number = 1; i < points.length; i++) {
            pathTypes.push(1);
        }
        const graphicspath: PdfPath = new PdfPath();
        graphicspath.addRectangle(points[1][0] - this._radius,
                                  -(points[1][1] + this._radius),
                                  2 * this._radius,
                                  2 * this._radius);
        const size: number[] = font.measureString(angle.toString() + '°', [0, 0], format, 0, 0);
        const midPoint: number[] = [(this._firstIntersectionPoint[0] + this._secondIntersectionPoint[0]) / 2,
            ((this._firstIntersectionPoint[1] + this._secondIntersectionPoint[1]) / 2)];
        const center: number[] = [points[1][0], -points[1][1]];
        const x1: number = points[1][0] + this._radius * Math.cos((this._startAngle + (this._sweepAngle / 2)) * (Math.PI / 180.0));
        const y: number = points[1][1] + this._radius * Math.sin((this._startAngle + (this._sweepAngle / 2)) * (Math.PI / 180.0));
        const start: number[] = [midPoint[0], midPoint[1]];
        const xDiff: number = start[0] - center[0];
        const yDiff: number = start[1] - center[1];
        let midpointAngle: number = ((Math.atan2(yDiff, xDiff)) * (180.0 / Math.PI));
        let left: boolean = false;
        let right: boolean = false;
        let up: boolean = false;
        let down: boolean = false;
        if (midpointAngle > 0) {
            if (midpointAngle < 45) {
                right = true;
            } else if (midpointAngle >= 45 && midpointAngle < 135) {
                up = true;
            } else {
                left = true;
            }
        } else {
            midpointAngle = -midpointAngle;
            if (midpointAngle === 0) {
                (new PdfPath()).addRectangle(boundsValue[0], boundsValue[1], boundsValue[2], boundsValue[3]);
            } else if (midpointAngle < 45) {
                right = true;
            } else if (midpointAngle >= 45 && midpointAngle < 135) {
                down = true;
            } else {
                left = true;
            }
        }
        if (rectValue[0] === 0 && rectValue[1] === 0 && rectValue[2] === 0 && rectValue[3] === 0 ) {
            rectValue = boundsValue;
            this.bounds = {x: boundsValue[0], y: boundsValue[1], width: boundsValue[2], height: boundsValue[3]};
        }
        const path: PdfPath = new PdfPath();
        path._pathTypes = pathTypes;
        path._points =  points;
        this._dictionary.set('Rect', [rectValue[0], rectValue[1], rectValue[0] + rectValue[2], rectValue[1] + rectValue[3]]);
        const appearance: PdfAppearance = new PdfAppearance(this, boundsValue);
        appearance.normal = new PdfTemplate(rectValue, this._crossReference);
        const template: PdfTemplate =  appearance.normal;
        template._writeTransformation = false;
        const graphics: PdfGraphics = appearance.normal.graphics;
        const width: number = borderWidth / 2;
        const pen: PdfPen = new PdfPen(this._color, width);
        if (this.border.style === PdfBorderStyle.dashed) {
            pen._dashStyle = PdfDashStyle.dash;
        }
        const brush: PdfBrush = new PdfBrush(this._color);
        graphics.save();
        graphics.drawPath(path, pen);
        path.addArc(points[1][0] - this._radius,
                    points[1][1] - this._radius,
                    2 * this._radius,
                    2 * this._radius,
                    this._startAngle,
                    this._sweepAngle);
        if (up) {
            graphics.drawString(angle.toString() + '°',
                                font,
                                [x1 - (size[0] / 2), -(-y + font._metrics._getHeight() + 2), 0, 0],
                                null,
                                brush);
        } else if (right) {
            graphics.drawString(angle.toString() + '°',
                                font,
                                [x1 + 2, -(-y + font._metrics._getHeight() / 2), 0, 0],
                                null,
                                brush);
        } else if (left) {
            graphics.drawString(angle.toString() + '°',
                                font,
                                [x1 - size[0] - 2, -(-y + font._metrics._getHeight() / 2), 0, 0],
                                null,
                                brush);
        } else if (down) {
            graphics.drawString(angle.toString() + '°', font, [x1 - (size[0] / 2), (y + 2), 0, 0], null, brush);
        }
        graphics.restore();
        graphics._template._content.dictionary._updated = true;
        const reference1: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference1, graphics._template._content);
        graphics._template._content.reference = reference1;
        if (this._dictionary.has('AP')) {
            _removeDuplicateReference(this._dictionary.get('AP'), this._crossReference, 'N');
        }
        const appearanceDictionary: _PdfDictionary = new _PdfDictionary();
        appearanceDictionary.set('N', reference1);
        appearanceDictionary._updated = true;
        this._dictionary.set('AP', appearanceDictionary);
        return template;
    }
    _getAngleBoundsValue(): number[] {
        const points: Array<number[]> = this._obtainLinePoints();
        for (let i: number = 0; i < points.length; i++) {
            points[Number.parseInt(i.toString(), 10)][1] = -points[Number.parseInt(i.toString(), 10)][1];
        }
        const path: PdfPath = new PdfPath();
        path._points = points;
        path._pathTypes = [0, 1, 1];
        return path._getBounds();
    }
    _obtainLinePoints(): Array<number[]> {
        let points: number[];
        let collection: Array<number[]>;
        if (this._linePoints) {
            points = new Array<number>(this._linePoints.length);
            for (let i: number = 0; i < this._linePoints.length; i++) {
                points[Number.parseInt(i.toString(), 10)] = this._linePoints[Number.parseInt(i.toString(), 10)];
            }
            collection = new Array<number[]>(points.length / 2);
            let count: number = 0;
            for (let j: number = 0; j < points.length; j = j + 2) {
                collection[Number.parseInt(count.toString(), 10)] = [points[Number.parseInt(j.toString(), 10)], - points[j + 1]];
                count++;
            }
        }
        return collection;
    }
    _calculateAngle(): number {
        const points: number[] = [0, 0];
        if (typeof this._linePoints !== 'undefined' && this._linePoints.length === 0 && this._isLoaded) {
            if (this._dictionary.has('Vertices')) {
                this._linePoints = this._dictionary.get('Vertices');
            }
        }
        for (let i: number = 0; i < this._linePoints.length; i++) {
            points[Number.parseInt(i.toString(), 10)] = this._linePoints[Number.parseInt(i.toString(), 10)];
        }
        const collection: Array<number[]> = [];
        for (let j: number = 0; j < points.length; j = j + 2) {
            collection.push([points[Number.parseInt(j.toString(), 10)], points[j + 1]]);
        }
        const point1: number[] = collection[0];
        const point2: number[] = collection[1];
        const point3: number[] = collection[2];
        const firstLineDistance: number = Math.sqrt(Math.pow((point2[0] - point1[0]), 2) + Math.pow((point2[1] - point1[1]), 2));
        const secondLineDistance: number = Math.sqrt(Math.pow((point2[0] - point3[0]), 2) + Math.pow((point2[1] - point3[1]), 2));
        this._radius = Math.min(firstLineDistance, secondLineDistance) / 4;
        const graphicsPath: PdfPath = new PdfPath();
        graphicsPath._points = collection;
        graphicsPath._pathTypes = [0, 1, 1];
        let intersectionPoint1: number[];
        let intersectionPoint2: number[];
        let value: {first: number[] , second: number[]} = this._findLineCircleIntersectionPoints(point2[0],
                                                                                                 point2[1],
                                                                                                 this._radius,
                                                                                                 point1,
                                                                                                 point2,
                                                                                                 intersectionPoint1,
                                                                                                 intersectionPoint2);
        intersectionPoint1 = value.first;
        intersectionPoint2 = value.second;
        if (this._firstIntersectionPoint[0] === 0 && this._firstIntersectionPoint[1] === 0) {
            this._firstIntersectionPoint = intersectionPoint2;
        }
        intersectionPoint1 = [0, 0];
        intersectionPoint2 = [0, 0];
        value = this._findLineCircleIntersectionPoints(point2[0],
                                                       point2[1],
                                                       this._radius,
                                                       point3,
                                                       point2,
                                                       intersectionPoint1,
                                                       intersectionPoint2);
        intersectionPoint1 = value.first;
        intersectionPoint2 = value.second;
        if (this._secondIntersectionPoint[0] === 0 && this._secondIntersectionPoint[1] === 0) {
            this._secondIntersectionPoint = intersectionPoint2;
        }
        let xDiff: number = this._firstIntersectionPoint[0] - point2[0];
        let yDiff: number = this._firstIntersectionPoint[1] - point2[1];
        let startAngle: number = (Math.atan2(yDiff, xDiff) * (180.0 / Math.PI));
        xDiff =  this._secondIntersectionPoint[0] - point2[0];
        yDiff =  this._secondIntersectionPoint[1] - point2[1];
        let sweepAngle: number = (Math.atan2(yDiff, xDiff) * (180.0 / Math.PI));
        startAngle = startAngle > 0 ? startAngle = 360 - startAngle : -startAngle;
        sweepAngle = sweepAngle > 0 ? sweepAngle = 360 - sweepAngle : -sweepAngle;
        if (startAngle === 180 && sweepAngle === 0) {
            this._startAngle = startAngle;
            this._sweepAngle = 180;
        } else if (startAngle === 0 && sweepAngle === 180) {
            this._startAngle = sweepAngle;
            this._sweepAngle = 180;
        } else if (startAngle < 180) {
            if (startAngle > sweepAngle) {
                this._startAngle = sweepAngle;
                this._sweepAngle = startAngle - sweepAngle;
            } else if (startAngle + 180 < sweepAngle) {
                this._startAngle = sweepAngle;
                this._sweepAngle = (360 - sweepAngle) + startAngle;
            } else {
                this._startAngle = startAngle;
                this._sweepAngle = sweepAngle - startAngle;
            }
        } else {
            if (startAngle < sweepAngle) {
                this._startAngle = startAngle;
                this._sweepAngle = sweepAngle - startAngle;
            } else if (startAngle - 180 > sweepAngle) {
                this._startAngle = startAngle;
                this._sweepAngle = (360 - startAngle) + sweepAngle;
            } else {
                this._startAngle = sweepAngle;
                this._sweepAngle = startAngle - sweepAngle;
            }
        }
        return (Math.atan2((point3[0] - point2[0]), (point3[1] - point2[1])) -
            Math.atan2((point1[0] - point2[0]), (point1[1] - point2[1])));
    }
    _findLineCircleIntersectionPoints(centerX: number,
                                      centerY: number,
                                      radius: number,
                                      point1: number[],
                                      point2: number[],
                                      intersection1: number[],
                                      intersection2: number[]): {first: number[], second: number[]} {
        const dx: number = point2[0] - point1[0];
        const dy: number = point2[1] - point1[1];
        const a: number = dx * dx + dy * dy;
        const b: number = 2 * (dx * (point1[0] - centerX) + dy * (point1[1] - centerY));
        const c: number = (point1[0] - centerX) * (point1[0] - centerX) + (point1[1] - centerY) * (point1[1] - centerY) - radius * radius;
        const e: number = b * b - 4 * a * c;
        if ((a <= 0.0000001) || (e < 0)) {
            intersection1 = [Number.NaN, Number.NaN];
            intersection2 = [Number.NaN, Number.NaN];
        } else if (e === 0) {
            const t: number = -b / (2 * a);
            intersection1 = [point1[0] + t * dx, point1[1] + t * dy];
            intersection2 = [Number.NaN, Number.NaN];
        } else {
            let t: number = ((-b + Math.sqrt(e)) / (2 * a));
            intersection1 = [point1[0] + t * dx, point1[1] + t * dy];
            t = ((-b - Math.sqrt(e)) / (2 * a));
            intersection2 = [point1[0] + t * dx, point1[1] + t * dy];
        }
        return {first: intersection1, second: intersection2};
    }
}
/**
 * `PdfInkAnnotation` class represents the ink annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new ink annotation with the bounds and ink points
 * const annotation: PdfInkAnnotation = new PdfInkAnnotation([0, 0, 300, 400], [40, 300, 60, 100, 40, 50, 40, 300]);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfInkAnnotation extends PdfComment {
    private _points: number[];
    private _linePoints: number[];
    private _inkPointsCollection: Array<number[]> = [];
    private _previousCollection: Array<number[]> = [];
    private _isFlatten: boolean;
    _isModified: boolean = false;
    _isEnableControlPoints: boolean = true;
    /**
     * Initializes a new instance of the `PdfInkAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfInkAnnotation` class.
     *
     * @param {number[]} points Ink points.
     * @param {number[]} points Line points.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new ink annotation with the bounds and ink points
     * const annotation: PdfInkAnnotation = new PdfInkAnnotation([0, 0, 300, 400], [40, 300, 60, 100, 40, 50, 40, 300]);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(points: number[], linePoints: number[])
    constructor(points?: number[], linePoints?: number[]) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Ink'));
        if (typeof points !== 'undefined') {
            this._points = points;
            this.bounds = {x: points[0], y: points[1], width: points[2], height: points[3]};
        }
        if (typeof linePoints !== 'undefined') {
            this._linePoints = linePoints;
        }
        this._type = _PdfAnnotationType.inkAnnotation;
    }
    /**
     * Gets the ink points collection of the annotation.
     *
     * @returns {Array<number[]>} Ink points collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfInkAnnotation = page.annotations.at(0) as PdfInkAnnotation;
     * // Get the ink points collection of the annotation
     * let inkPointsCollection: Array<number[]> = annotation.inkPointsCollection;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get inkPointsCollection(): Array<number[]> {
        if (this._inkPointsCollection.length === 0 && this._dictionary.has('InkList')) {
            const inkList: Array<number[]> = this._dictionary.get('InkList');
            if (Array.isArray(inkList) && inkList.length > 0) {
                this._inkPointsCollection = inkList;
            }
        }
        return this._inkPointsCollection;
    }
    /**
     * Sets the ink points collection of the annotation.
     *
     * @param {Array<number[]>} value Ink points collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * // Create a new ink annotation
     * const annotation: PdfInkAnnotation = new PdfInkAnnotation([0, 0, 300, 400], [40, 300, 60, 100, 40, 50, 40, 300]);
     * // Set the ink points collection of the annotation
     * annotation.inkPointsCollection = [[422, 690, 412, 708, 408, 715, 403, 720, 400, 725], [420, 725, 420, 715, 415, 705, 400, 690, 405, 695]];
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set inkPointsCollection(value: Array<number[]>) {
        if (Array.isArray(value) && value.length > 0 && value !== this._inkPointsCollection) {
            this._inkPointsCollection = value;
            this._isModified = true;
            if (this._isLoaded) {
                this._dictionary.update('InkList', value);
            }
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfInkAnnotation {
        const annot: PdfInkAnnotation = new PdfInkAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        if (typeof this._points === 'undefined' || this._points === null) {
            throw new Error('Points cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (!this._dictionary.has('C')) {
            this.color = [0, 0, 0];
            this._isTransparentColor = true;
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        const nativeRectangle: number[] = this._addInkPoints();
        const bounds: number[] = [nativeRectangle[0],
            nativeRectangle[1],
            nativeRectangle[0] + nativeRectangle[2],
            nativeRectangle[1] + nativeRectangle[3]];
        this._dictionary.update('Rect', bounds);
        if (this._setAppearance) {
            const appearance: PdfAppearance = new PdfAppearance(this, nativeRectangle);
            appearance.normal = new PdfTemplate(nativeRectangle, this._crossReference);
            const template: PdfTemplate = appearance.normal;
            _setMatrix(template, this._getRotationAngle());
            template._writeTransformation = false;
            this._appearanceTemplate = this._createInkAppearance(template);
            if (this._dictionary.has('AP')) {
                _removeDuplicateReference(this._dictionary.get('AP'), this._crossReference, 'N');
            }
            const dictionary: _PdfDictionary = new _PdfDictionary();
            this._appearanceTemplate._content.dictionary._updated = true;
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
            this._appearanceTemplate._content.reference = reference;
            dictionary.set('N', reference);
            dictionary._updated = true;
            this._dictionary.set('AP', dictionary);
        }
    }
    _doPostProcess(isFlatten: boolean = false): void {
        this._isFlatten = isFlatten;
        if (this._isLoaded) {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                if (this._inkPointsCollection.length === 0) {
                    this._inkPointsCollection = this._obtainInkListCollection();
                }
                const rect: number[] = this._getInkBoundsValue();
                const template: PdfTemplate = new PdfTemplate(rect, this._crossReference);
                _setMatrix(template, this._getRotationAngle());
                template._writeTransformation = false;
                this._appearanceTemplate = this._createInkAppearance(template);
                this._dictionary.update('Rect', [rect[0], rect[1], rect[0] + rect[2], rect[1] + rect[3]]);
                if (!isFlatten) {
                    if (this._dictionary.has('AP')) {
                        _removeDuplicateReference(this._dictionary.get('AP'), this._crossReference, 'N');
                    }
                    const dictionary: _PdfDictionary = new _PdfDictionary();
                    this._appearanceTemplate._content.dictionary._updated = true;
                    const reference: _PdfReference = this._crossReference._getNextReference();
                    this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
                    this._appearanceTemplate._content.reference = reference;
                    dictionary.set('N', reference);
                    dictionary._updated = true;
                    this._dictionary.set('AP', dictionary);
                }
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (appearanceStream) {
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess();
            if (!this._appearanceTemplate) {
                if (isFlatten) {
                    if (!this._dictionary.has('AP')) {
                        if (this._inkPointsCollection.length === 0) {
                            this._inkPointsCollection = this._obtainInkListCollection();
                        }
                        const rect: number[] = this._getInkBoundsValue();
                        const template: PdfTemplate = new PdfTemplate(rect, this._crossReference);
                        _setMatrix(template, this._getRotationAngle());
                        template._writeTransformation = false;
                        this._appearanceTemplate = this._createInkAppearance(template);
                        this._dictionary.update('Rect', [rect[0], rect[1], rect[0] + rect[2], rect[1] + rect[3]]);
                    } else {
                        const dictionary: _PdfDictionary = this._dictionary.get('AP');
                        if (dictionary && dictionary.has('N')) {
                            const appearanceStream: _PdfBaseStream = dictionary.get('N');
                            const reference: _PdfReference = dictionary.getRaw('N');
                            if (appearanceStream) {
                                if (reference) {
                                    appearanceStream.reference = reference;
                                }
                                this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                            }
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            } else {
                this._flattenPopUp();
            }
        }
        if (isFlatten &&
            this._appearanceTemplate &&
            this._appearanceTemplate._size !== null &&
            typeof this._appearanceTemplate._size !== 'undefined') {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            if (!this._appearanceTemplate._content.dictionary.has('Matrix')) {
                const box: number[] = this._appearanceTemplate._content.dictionary.getArray('BBox');
                if (box) {
                    this._appearanceTemplate._content.dictionary.update('Matrix', [1, 0, 0, 1, -box[0], -box[1]]);
                }
            }
            this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
        }
    }
    _createInkAppearance(template: PdfTemplate): PdfTemplate {
        const graphics: PdfGraphics = template.graphics;
        if (this._inkPointsCollection !== null &&
            this._inkPointsCollection.length > 0 &&
            this.color !== null &&
            typeof this._color !== 'undefined') {
            for (let l: number = 0; l < this._inkPointsCollection.length; l++) {
                if (this._inkPointsCollection[Number.parseInt(l.toString(), 10)].length % 2 === 0) {
                    let inkPoints: number[] = this._inkPointsCollection[Number.parseInt(l.toString(), 10)];
                    if (inkPoints.length === 2) {
                        const locx: number = inkPoints[0] - 0.5;
                        const locy: number = inkPoints[1] - 0.5;
                        const locw: number = inkPoints[0] + 0.5;
                        const loch: number = inkPoints[1] + 0.5;
                        inkPoints = [ locx, locy, locw, loch ];
                    }
                    const point: Array<number[]> = new Array(inkPoints.length / 2);
                    let count: number = 0;
                    for (let j: number = 0; j < inkPoints.length; j = j + 2) {
                        point[Number.parseInt(count.toString(), 10)] = [inkPoints[Number.parseInt(j.toString(), 10)], inkPoints[j + 1]];
                        count++;
                    }
                    let pathPointCont: number = count + (count * 2) - 2;
                    let pathPoints: Array<number[]> = new Array(pathPointCont);
                    if (this._isEnableControlPoints) {
                        let p1: Array<number[]> = [];
                        let p2: Array<number[]> = [];
                        const value: { controlP1: Array<number[]>, controlP2: Array<number[]> } = this._getControlPoints(point, p1, p2);
                        p1 = value.controlP1;
                        p2 = value.controlP2;
                        let index: number = 0;
                        for (let i: number = 0; i < pathPointCont - 1; i = i + 3) {
                            pathPoints[Number.parseInt(i.toString(), 10)] = point[Number.parseInt(index.toString(), 10)];
                            pathPoints[i + 1] = p1[Number.parseInt(index.toString(), 10)];
                            pathPoints[i + 2] = p2[Number.parseInt(index.toString(), 10)];
                            index++;
                        }
                    } else {
                        pathPointCont = count;
                        pathPoints = new Array(pathPointCont);
                        if (count % 3 === 1) {
                            pathPoints = point;
                        } else if (count % 3 === 0) {
                            for (let i: number = 0; i < count; i++) {
                                pathPoints[Number.parseInt(i.toString(), 10)] = point[Number.parseInt(i.toString(), 10)];
                            }
                        } else {
                            for (let i: number = 0; i < count; i++) {
                                pathPoints[Number.parseInt(i.toString(), 10)] = point[Number.parseInt(i.toString(), 10)];
                            }
                            pathPoints[pathPointCont - 2] = point[point.length - 2];
                        }
                    }
                    pathPoints[pathPointCont - 1] = point[point.length - 1];
                    if (pathPoints !== null) {
                        const pointsCollection: Array<number[]> = pathPoints;
                        for (let k: number = 0; k < pointsCollection.length; k++) {
                            const point: number[] = pointsCollection[Number.parseInt(k.toString(), 10)];
                            pointsCollection[Number.parseInt(k.toString(), 10)] = [point[0], (-point[1])];
                        }
                        const path1: PdfPath = new PdfPath();
                        let path2: PdfPath = null;
                        if (point.length === 2) {
                            const width: number = point[1][0] - point[0][0];
                            const height: number = point[1][1] - point[0][1];
                            path1.addEllipse(point[0][0] + (0.5), -(point[0][1] + height + (0.5)), width, height);
                            path2 = new PdfPath();
                            path2._pathTypes =  path1._pathTypes;
                            path2._points = path1._points;
                        } else {
                            path1._addBezierPoints(pointsCollection);
                            path2 = new PdfPath();
                            path2._pathTypes =  path1._pathTypes;
                            path2._points = pointsCollection;
                        }
                        const borderPen: PdfPen = new PdfPen(this.color, this.border.width);
                        if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                            const state: PdfGraphicsState = graphics.save();
                            graphics.setTransparency(this._opacity);
                            if (this._isLoaded) {
                                borderPen._lineCap = PdfLineCap.round;
                            }
                            graphics.drawPath(path2, borderPen);
                            graphics.restore(state);
                        } else {
                            graphics.drawPath(path2, borderPen);
                        }
                    }
                }
            }
            if (this._isFlatten) {
                this.bounds = {x: this.bounds.x,
                    y: (this._page.size[1] - (this.bounds.y + this.bounds.height)),
                    width: this.bounds.width,
                    height: this.bounds.height};
            }
        }
        return template;
    }
    _getControlPoints(point: number[][], p1: number[][], p2: number[][]): { controlP1: Array<number[]>; controlP2: Array<number[]>; } {
        if (point === null) {
            throw new Error('pointCollection');
        }
        const pointCount: number = point.length - 1;
        if (pointCount < 1) {
            throw new Error('At least two knot PointFs required pointCollection');
        }
        if (pointCount === 1) {
            p1 = [[((2 * point[0][0] + point[1][0]) / 3), ((2 * point[0][1] + point[1][1]) / 3)]];
            p2 = [[(2 * p1[0][0] - point[0][0]), (2 * p1[0][1] - point[0][1])]];
        }
        const rightVector: number[] = [];
        for (let i: number = 1; i < pointCount - 1; ++i) {
            rightVector[Number.parseInt(i.toString(), 10)] = 4 * point[Number.parseInt(i.toString(), 10)][0] + 2 * point[i + 1][0];
        }
        rightVector[0] = point[0][0] + 2 * point[1][0];
        rightVector[pointCount - 1] = (8 * point[pointCount - 1][0] + point[Number.parseInt(pointCount.toString(), 10)][0]) / 2.0;
        const xValue: number[] = this._getSingleControlPoint(rightVector);
        for (let i: number = 1; i < pointCount - 1; ++i) {
            rightVector[Number.parseInt(i.toString(), 10)] = 4 * point[Number.parseInt(i.toString(), 10)][1] + 2 * point[i + 1][1];
        }
        rightVector[0] = point[0][1] + 2 * point[1][1];
        rightVector[pointCount - 1] = (8 * point[pointCount - 1][1] + point[Number.parseInt(pointCount.toString(), 10)][1]) / 2.0;
        const yValue: number[] = this._getSingleControlPoint(rightVector);
        p1 = new Array<number[]>(pointCount);
        p2 = new Array<number[]>(pointCount);
        for (let i: number = 0; i < pointCount; ++i) {
            p1[Number.parseInt(i.toString(), 10)] = [xValue[Number.parseInt(i.toString(), 10)], yValue[Number.parseInt(i.toString(), 10)]];
            if (i < pointCount - 1) {
                p2[Number.parseInt(i.toString(), 10)] = [2 * point[i + 1][0] - xValue[i + 1], 2 * point[i + 1][1] - yValue[i + 1]];
            } else {
                const x: number = (point[Number.parseInt(pointCount.toString(), 10)][0] + xValue[pointCount - 1]) / 2;
                const y: number = (point[Number.parseInt(pointCount.toString(), 10)][1] + yValue[pointCount - 1]) / 2;
                p2[Number.parseInt(i.toString(), 10)] = [x, y];
            }
        }
        return {controlP1: p1, controlP2: p2};
    }
    _getSingleControlPoint(rightVector: number[]): number[] {
        const count: number = rightVector.length;
        const vector: number[] = [];
        const tmpVector: number[] = [];
        let divisor: number = 2.0;
        vector[0] = rightVector[0] / divisor;
        for (let i: number = 1; i < count; i++) {
            tmpVector[Number.parseInt(i.toString(), 10)] = 1 / divisor;
            divisor = (i < count - 1 ? 4.0 : 3.5) - tmpVector[Number.parseInt(i.toString(), 10)];
            vector[Number.parseInt(i.toString(), 10)] = (rightVector[Number.parseInt(i.toString(), 10)] - vector[i - 1]) / divisor;
        }
        for (let i: number = 1; i < count; i++) {
            vector[count - i - 1] -= tmpVector[count - i] * vector[count - i];
        }
        return vector;
    }
    _addInkPoints(): number[] {
        const inkCollection: Array<number[]> = [];
        if (this._linePoints !== null && (this._previousCollection.length === 0 || this._isModified)) {
            this._inkPointsCollection.unshift(this._linePoints);
        }
        const isEqual: boolean = _checkInkPoints(this._inkPointsCollection, this._previousCollection);
        if (this._inkPointsCollection !== null && !isEqual) {
            for (let i: number = 0; i < this._inkPointsCollection.length; i++) {
                const inkList: number[] = this._inkPointsCollection[Number.parseInt(i.toString(), 10)].slice();
                inkCollection.push(inkList);
            }
            this._dictionary.update('InkList', inkCollection);
        }
        if (this._inkPointsCollection.length > 0 && (!isEqual || this._isModified)) {
            this._inkPointsCollection.forEach((inkList: number[]) => {
                this._previousCollection.push(inkList);
                this._isModified = false;
            });
        }
        const cropOrMediaBox: number[] = this._getCropOrMediaBox();
        if (cropOrMediaBox && cropOrMediaBox.length > 3 && typeof cropOrMediaBox[0] === 'number' && typeof cropOrMediaBox[1] === 'number' && (cropOrMediaBox[0] !== 0 || cropOrMediaBox[1] !== 0)) {
            for (let i: number = 0; i < inkCollection.length; i++) {
                const inkList: number[] = inkCollection[Number.parseInt(i.toString(), 10)];
                const modifiedInkList: number[] = inkList;
                for (let j: number = 0; j < inkList.length; j = j + 2) {
                    let x: number = inkList[Number.parseInt(j.toString(), 10)];
                    let y: number = inkList[j + 1];
                    x = x + cropOrMediaBox[0];
                    if (this._page._pageDictionary.has('MediaBox') && !this._page._pageDictionary.has('CropBox') && cropOrMediaBox[3] === 0 && cropOrMediaBox[1] > 0) {
                        y = y + cropOrMediaBox[3];
                    } else {
                        y = y + cropOrMediaBox[1];
                    }
                    modifiedInkList[Number.parseInt(j.toString(), 10)] = x;
                    modifiedInkList[j + 1] = y;
                    inkCollection[Number.parseInt(i.toString(), 10)] = modifiedInkList;
                }
            }
            this._dictionary.update('InkList', inkCollection);
        }
        if (this._isEnableControlPoints || (Array.isArray(cropOrMediaBox) && cropOrMediaBox.length > 3 &&
            _areNotEqual(cropOrMediaBox, [0, 0, 0, 0]))) {
            return this._getInkBoundsValue(inkCollection);
        } else {
            if (!this._isFlatten) {
                this._updateInkListCollection(inkCollection);
            }
            return [this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height];
        }
    }
    _updateInkListCollection(inkCollection: Array<number[]>): void {
        for (let i: number = 0; i < inkCollection.length; i++) {
            const inkList: number[] = [];
            for (let j: number = 0; j < inkCollection[Number.parseInt(i.toString(), 10)].length; j++) {
                inkList.push(inkCollection[Number.parseInt(i.toString(), 10)][Number.parseInt(j.toString(), 10)]);
            }
            this._inkPointsCollection[Number.parseInt(i.toString(), 10)] = inkList;
        }
    }
    _getInkBoundsValue(inkCollection?: Array<number[]>): number[] {
        let bounds: number[] = [0, 0, 0, 0];
        if (this._points) {
            this.bounds = {x: this._points[0], y: this._points[1], width: this._points[2], height: this._points[3]};
        }
        bounds = [this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height];
        const borderWidth: number = this.border.width;
        if (this._inkPointsCollection !== null) {
            if (this._inkPointsCollection.length > 0) {
                const termsList: Array<number> = [];
                for (let i: number = 0; i < this._inkPointsCollection.length; i++) {
                    const subList: number[] = this._inkPointsCollection[Number.parseInt(i.toString(), 10)];
                    if (subList !== null) {
                        if (subList.length % 2 === 0) {
                            for (let j: number = 0; j < subList.length; j++) {
                                termsList.push(subList[Number.parseInt(j.toString(), 10)]);
                            }
                        }
                    }
                }
                let isTwoPoints: boolean = false;
                if (!this._isLoaded && termsList.length === 2) {
                    isTwoPoints = true;
                    termsList.push((termsList[0] + 1));
                    termsList.push((termsList[1] + 1));
                }
                const pointCollection: Array<number[]> = new Array(termsList.length / 2);
                let count: number = 0;
                for (let j: number = 0; j < termsList.length; j = j + 2) {
                    pointCollection[Number.parseInt(count.toString(), 10)] = [termsList[Number.parseInt(j.toString(), 10)],
                        termsList[j + 1]];
                    count++;
                }
                if (this._isLoaded) {
                    if (pointCollection.length > 0) {
                        let xMin: number = 0;
                        let yMin: number = 0;
                        let xMax: number = 0;
                        let yMax: number = 0;
                        let first: boolean = true;
                        for (let i: number = 0; i < pointCollection.length; i++) {
                            const point: number[] = pointCollection[Number.parseInt(i.toString(), 10)];
                            if (first) {
                                xMin = point[0];
                                yMin = point[1];
                                first = false;
                            } else {
                                if (point[0] < xMin) {
                                    xMin = point[0];
                                } else if (point[0] > xMax) {
                                    xMax = point[0];
                                }
                                if (point[1] < yMin) {
                                    yMin = point[1];
                                } else if (point[1] > yMax) {
                                    yMax = point[1];
                                }
                            }
                        }
                        bounds = [xMin, yMin, xMax - xMin, yMax - yMin];
                        this.bounds = {x: bounds[0], y: bounds[1], width: bounds[2], height: bounds[3]};
                        if (this._isFlatten || this._setAppearance) {
                            bounds[0] = this.bounds.x - borderWidth;
                            bounds[1] = this.bounds.y - borderWidth;
                            bounds[2] = this.bounds.width + (2 * borderWidth);
                            bounds[3] = this.bounds.height + (2 * borderWidth);
                        }
                    } else {
                        if (this._points) {
                            bounds = this._points;
                        } else if (pointCollection.length > 0) {
                            bounds = this._dictionary.get('Rect');
                        } else {
                            bounds = [this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height];
                        }
                    }
                } else if (inkCollection) {
                    bounds = this._calculateInkBounds(pointCollection, bounds, borderWidth, isTwoPoints, inkCollection);
                } else {
                    bounds = this._calculateInkBounds(pointCollection, bounds, borderWidth, isTwoPoints);
                }
                this.bounds = {x: bounds[0], y: bounds[1], width: bounds[2], height: bounds[3]};
            }
        }
        return bounds;
    }
    private _calculateInkBounds(pointCollection: number[][], bounds: number[], borderWidth: number, isTwoPoints: boolean,
                                inkCollection?: Array<number[]>): number[] {
        if (pointCollection.length > 5) {
            let xMin: number = 0;
            let yMin: number = 0;
            let xMax: number = 0;
            let yMax: number = 0;
            let first: boolean = true;
            for (let i: number = 0; i < pointCollection.length; i++) {
                const point: number[] = pointCollection[Number.parseInt(i.toString(), 10)];
                if (first) {
                    xMin = point[0];
                    yMin = point[1];
                    xMax = point[0];
                    yMax = point[1];
                    first = false;
                } else {
                    if (point[0] < xMin) {
                        xMin = point[0];
                    } else if (point[0] > xMax) {
                        xMax = point[0];
                    }
                    if (point[1] < yMin) {
                        yMin = point[1];
                    } else if (point[1] > yMax) {
                        yMax = point[1];
                    }
                }
            }
            const cropOrMediaBox: number[] = this._getCropOrMediaBox();
            if (bounds[2] < xMax) {
                xMax = bounds[2];
            } else if (cropOrMediaBox) {
                xMax = xMax - xMin;
            }
            if (bounds[3] < yMax) {
                yMax = bounds[3];
            } else if (cropOrMediaBox) {
                yMax = yMax - yMin;
            }
            if (cropOrMediaBox) {
                xMin = xMin + cropOrMediaBox[0];
                yMin = yMin + cropOrMediaBox[1];
            }
            bounds = [xMin, yMin, xMax, yMax];
            if (this._isFlatten || this._setAppearance) {
                const factor: number = isTwoPoints ? 2 : 3;
                bounds[0] = bounds[0] - borderWidth;
                bounds[1] = bounds[1] - borderWidth;
                bounds[2] = bounds[2] + (factor * borderWidth);
                bounds[3] = bounds[3] + (factor * borderWidth);
            }
        } else {
            if (typeof this._points === 'undefined' && pointCollection.length > 0) {
                bounds = this._dictionary.get('Rect');
            } else {
                bounds = this._points;
            }
        }
        if (!this._isFlatten && inkCollection) {
            this._updateInkListCollection(inkCollection);
        }
        return bounds;
    }
    _obtainInkListCollection(): Array<number[]> {
        const path: Array<number[]> = [];
        if (this._dictionary.has('InkList')) {
            const inkList: Array<number[]> = this._dictionary.getArray('InkList');
            const list: number[] = [];
            for (let i: number = 0; i < inkList.length; i++) {
                const innerList: number[] = inkList[Number.parseInt(i.toString(), 10)];
                for (let j: number = 0; j < innerList.length; j++) {
                    list.push(innerList[Number.parseInt(j.toString(), 10)]);
                }
                path.push(list);
            }
        }
        return path;
    }
}
/**
 * `PdfPopupAnnotation` class represents the popup annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new popup annotation
 * const annotation: PdfPopupAnnotation = new PdfPopupAnnotation('Test popup annotation', 10, 40, 30, 30);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPopupAnnotation extends PdfComment {
    _icon: PdfPopupIcon = PdfPopupIcon.note;
    private _iconString: string = '';
    _stateModel: PdfAnnotationStateModel = PdfAnnotationStateModel.none;
    _state: PdfAnnotationState = PdfAnnotationState.none;
    _open: boolean = false;
    _ref: _PdfReference;
    _isReview: boolean = false;
    _isComment: boolean = false;
    /**
     * Initializes a new instance of the `PdfPopupAnnotation` class.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new line annotation
     * let lineAnnotation: PdfLineAnnotation = new PdfLineAnnotation([10, 50, 250, 50]);
     * // Create a new popup annotation
     * let popup: PdfPopupAnnotation = new PdfPopupAnnotation();
     * // Set the author name
     * popup.author = 'Syncfusion';
     * // Set the text
     * popup.text = 'This is first comment';
     * // Add comments to the annotation
     * lineAnnotation.comments.add(popup);
     * // Add annotation to the page
     * page.annotations.add(lineAnnotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfPopupAnnotation` class.
     *
     * @param {string} text Text
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new popup annotation
     * const annotation: PdfPopupAnnotation = new PdfPopupAnnotation('Test popup annotation', 10, 40, 30, 30);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(text: string, x: number, y: number, width: number, height: number )
    constructor(text?: string, x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Text'));
        if (typeof text !== 'undefined') {
            this.text = text;
        }
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        this._type = _PdfAnnotationType.popupAnnotation;
    }
    /**
     * Gets the boolean flag indicating whether annotation has open or not.
     *
     * @returns {boolean} Caption.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPopupAnnotation = page.annotations.at(0) as PdfPopupAnnotation;
     * // Gets the boolean flag indicating whether annotation has open or not.
     * let open: boolean =  annotation.open;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get open(): boolean {
        if (this._dictionary.has('Open')) {
            this._open = this._dictionary.get('Open');
        }
        return this._open;
    }
    /**
     * Sets the boolean flag indicating whether annotation has open or not.
     *
     * @param {boolean} value Open.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPopupAnnotation = page.annotations.at(0) as PdfPopupAnnotation;
     * // Sets the boolean flag indicating whether annotation has open or not.
     * annotation.open = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set open(value: boolean) {
        if (typeof value !== 'undefined') {
            this._open = value;
            this._dictionary.update('Open', this._open);
        }
    }
    /**
     * Gets the icon type of the popup annotation.
     *
     * @returns {PdfPopupIcon} Annotation icon.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPopupAnnotation = page.annotations.at(0) as PdfPopupAnnotation;
     * // Gets the icon type of the popup annotation.
     * let icon: PdfPopupIcon = annotation.icon;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get icon(): PdfPopupIcon {
        if (this._dictionary.has('Name')) {
            this._icon = _mapPopupIcon(this._dictionary.get('Name').name);
        }
        return this._icon;
    }
    /**
     * Sets the icon type of the popup annotation.
     *
     * @param {PdfPopupIcon} value Annotation icon.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPopupAnnotation = page.annotations.at(0) as PdfPopupAnnotation;
     * // Sets the icon type of the popup annotation.
     * annotation.icon = PdfPopupIcon.newParagraph;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set icon(value: PdfPopupIcon) {
        if (typeof value !== 'undefined') {
            this._icon = value;
            this._dictionary.update('Name', _PdfName.get(this._obtainIconName(this._icon)));
        }
    }
    /**
     * Gets the state model of the popup annotation.
     *
     * @returns {PdfAnnotationStateModel} Annotation State Model.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPopupAnnotation = page.annotations.at(0) as PdfPopupAnnotation;
     * // Gets the state model of the popup annotation.
     * let stateModel: PdfAnnotationStateModel = annotation.stateModel;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get stateModel(): PdfAnnotationStateModel {
        if (this._dictionary.has('StateModel')) {
            this._stateModel = _mapAnnotationStateModel(this._dictionary.get('StateModel'));
        }
        return this._stateModel;
    }
    /**
     * Sets the state model of the popup annotation.
     *
     * @param {PdfAnnotationStateModel} value Annotation State Model.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPopupAnnotation = page.annotations.at(0) as PdfPopupAnnotation;
     * // Sets the state model of the popup annotation.
     * annotation.stateModel = PdfAnnotationStateModel.marked;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set stateModel(value: PdfAnnotationStateModel) {
        if (typeof value !== 'undefined') {
            this._stateModel = value;
            this._dictionary.update('StateModel', _reverseMapAnnotationStateModel(this._stateModel));
        }
    }
    /**
     * Gets the state of the popup annotation.
     *
     * @returns {PdfAnnotationState} Annotation State.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPopupAnnotation = page.annotations.at(0) as PdfPopupAnnotation;
     * // Gets the state of the popup annotation.
     * let state: PdfAnnotationState = annotation.state;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get state(): PdfAnnotationState {
        if (this._dictionary.has('State')) {
            this._state = _mapAnnotationState(this._dictionary.get('State'));
        }
        return this._state;
    }
    /**
     * Sets the state of the popup annotation.
     *
     * @param {PdfAnnotationState} value Annotation State.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfPopupAnnotation = page.annotations.at(0) as PdfPopupAnnotation;
     * // Sets the state of the popup annotation.
     * annotation.state = PdfAnnotationState.completed;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set state(value: PdfAnnotationState) {
        if (typeof value !== 'undefined') {
            this._state = value;
            this._dictionary.update('State', _reverseMapAnnotationState(this._state));
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfPopupAnnotation {
        const annot: PdfPopupAnnotation = new PdfPopupAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        if (dictionary.has('IRT')) {
            annot._isReview = _checkReview(dictionary);
            if (!annot._isReview) {
                annot._isComment = _checkComment(dictionary);
            }
        }
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            this._bounds = {x: 0, y: 0, width: 0, height: 0};
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        const rectangle: number[] = [this.bounds.x, this.bounds.y, (this.bounds.x + this.bounds.width),
            (this.bounds.y + this.bounds.height)];
        this._dictionary.update('Rect', rectangle);
        if (this._setAppearance) {
            this._appearanceTemplate = this._createPopupAppearance();
            if (this._appearanceTemplate) {
                if (this._dictionary.has('AP')) {
                    _removeDuplicateReference(this._dictionary.get('AP'), this._crossReference, 'N');
                }
                const dictionary: _PdfDictionary = new _PdfDictionary();
                this._appearanceTemplate._content.dictionary._updated = true;
                const reference: _PdfReference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
                this._appearanceTemplate._content.reference = reference;
                dictionary.set('N', reference);
                dictionary._updated = true;
                this._dictionary.set('AP', dictionary);
            }
        }
        this._dictionary.update('Rect', _updateBounds(this));
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._isLoaded) {
            if (!this._appearanceTemplate && this._isFlattenPopups && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (appearanceStream) {
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                    if (this._appearanceTemplate !== null) {
                        const state: PdfGraphicsState = this._page.graphics.save();
                        if (this.opacity < 1) {
                            this._page.graphics.setTransparency(this.opacity);
                        }
                        this._page.graphics.drawTemplate(this._appearanceTemplate, this.bounds);
                        this._page.graphics.restore(state);
                    }
                }
            }
        } else {
            this._postProcess();
            if (!this._appearanceTemplate) {
                if (isFlatten) {
                    if (!this._dictionary.has('AP')) {
                        this._appearanceTemplate = this._createPopupAppearance();
                    } else {
                        const dictionary: _PdfDictionary = this._dictionary.get('AP');
                        if (dictionary && dictionary.has('N')) {
                            const appearanceStream: _PdfBaseStream = dictionary.get('N');
                            const reference: _PdfReference = dictionary.getRaw('N');
                            if (appearanceStream) {
                                if (reference) {
                                    appearanceStream.reference = reference;
                                }
                                this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                            }
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups && this.flatten) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            } else {
                this._flattenPopUp();
            }
        }
        if (isFlatten) {
            this._removeAnnotation(this._page, this);
        }
    }
    _createPopupAppearance(): PdfTemplate {
        let template: PdfTemplate;
        if (this._dictionary.has('Name')) {
            if (this._dictionary.get('Name').name === 'Comment') {
                if (this._dictionary.has('Rect')) {
                    const nativeRectangle: number[] = [0, 0, this.bounds.width, this.bounds.height];
                    template = new PdfTemplate(nativeRectangle, this._crossReference);
                    _setMatrix(template, this._getRotationAngle());
                    const graphics: PdfGraphics = template.graphics;
                    const rectValue: number[] = this._dictionary.getArray('Rect');
                    if (rectValue !== null) {
                        const pen: PdfPen = new PdfPen([0, 0, 0], 0.3);
                        let brush: PdfBrush = new PdfBrush(this.color);
                        const pen1: PdfPen = new PdfPen([255, 255, 255], 1);
                        const points: Array<number[]> = new Array<number[]>();
                        points.push([6, 8]);
                        points.push([9, 8]);
                        points.push([4, 12]);
                        const path: PdfPath = new PdfPath();
                        if (this.color[0] === 0 && this.color[0] === 0 && this.color[0] === 0) {
                            brush = new PdfBrush([255, 215, 0]);
                        }
                        graphics.save();
                        const template: PdfTemplate = new PdfTemplate([0, 0, 15, 14], this._crossReference);
                        template.graphics.drawRectangle(0, 0, 15, 14, pen, brush);
                        template.graphics.drawPolygon(points, pen, new PdfBrush([255, 255, 255]));
                        path.addEllipse(2, 2, 11, 8);
                        template.graphics.drawPath(path, pen, new PdfBrush([255, 255, 255]));
                        template.graphics.drawArc(2, 2, 11, 8, 108, 12.7, pen1);
                        template.graphics.drawLine(pen, 4, 12, 6.5, 10);
                        graphics.drawTemplate(template, { x: 0, y: 0, width: this.bounds.width, height: this.bounds.height });
                        graphics.restore();
                    }
                }
            }
        }
        return template;
    }
    _obtainIconName(icon: PdfPopupIcon): string{
        switch (icon) {
        case PdfPopupIcon.note:
            this._iconString = 'Note';
            break;
        case PdfPopupIcon.comment:
            this._iconString = 'Comment';
            break;
        case PdfPopupIcon.help:
            this._iconString = 'Help';
            break;
        case PdfPopupIcon.insert:
            this._iconString = 'Insert';
            break;
        case PdfPopupIcon.key:
            this._iconString = 'Key';
            break;
        case PdfPopupIcon.newParagraph:
            this._iconString = 'NewParagraph';
            break;
        case PdfPopupIcon.paragraph:
            this._iconString = 'Paragraph';
            break;
        }
        return this._iconString;
    }
}
/**
 * `PdfFileLinkAnnotation` class represents the link annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new file link annotation
 * let annotation: PdfFileLinkAnnotation = new PdfFileLinkAnnotation(10, 40, 30, 30, "image.png");
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfFileLinkAnnotation extends PdfAnnotation {
    _action: string;
    private _fileName: string;
    /**
     * Initializes a new instance of the `PdfFileLinkAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfFileLinkAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * @param {string} fileName fileName
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new file link annotation
     * let annotation: PdfFileLinkAnnotation = new PdfFileLinkAnnotation(10, 40, 30, 30, "image.png");
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number, fileName: string)
    constructor(x?: number, y?: number, width?: number, height?: number, fileName?: string) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Link'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        if (typeof fileName !== 'undefined' && fileName !== null) {
            this._fileName = fileName;
        }
        this._type = _PdfAnnotationType.fileLinkAnnotation;
    }
    /**
     * Gets the action of the annotation.
     *
     * @returns {string} Action.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFileLinkAnnotation = page.annotations.at(0) as PdfFileLinkAnnotation;
     * // Gets the action of the annotation.
     * let action: string = annotation.action;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get action(): string {
        if (typeof this._action === 'undefined' && this._dictionary.has('A')) {
            const dictionary: _PdfDictionary = this._dictionary.get('A');
            if (dictionary && dictionary.has('Next')) {
                const action: Array<_PdfReference> = dictionary.get('Next');
                if (Array.isArray(action)) {
                    for (let i: number = 0; i < action.length; i++) {
                        const reference: _PdfReference = action[Number.parseInt(i.toString(), 10)];
                        if (reference && reference instanceof _PdfReference) {
                            const actionDictionary: _PdfDictionary = this._crossReference._fetch(reference);
                            if (actionDictionary.has('JS')) {
                                this._action = actionDictionary.get('JS');
                            }
                        }
                    }
                }
            }
        }
        return this._action;
    }
    /**
     * Sets the action of the annotation.
     *
     * @param {string} value Action.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFileLinkAnnotation = page.annotations.at(0) as PdfFileLinkAnnotation;
     * // Sets the action of the annotation.
     * annotation.action = ‘syncfusion’;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set action(value: string) {
        if (!this._isLoaded && typeof value === 'string') {
            this._action = value;
        }
        if (this._isLoaded && typeof value === 'string') {
            if (this.action !== value && this._dictionary.has('A')) {
                const dictionary: _PdfDictionary = this._dictionary.get('A');
                if (dictionary && dictionary.has('Next')) {
                    const action: _PdfReference[] = dictionary.get('Next');
                    if (Array.isArray(action)) {
                        for (let i: number = 0; i < action.length; i++) {
                            const reference: _PdfReference = action[Number.parseInt(i.toString(), 10)];
                            if (reference && reference instanceof _PdfReference) {
                                const actionDictionary: _PdfDictionary = this._crossReference._fetch(reference);
                                if (actionDictionary.has('JS')) {
                                    actionDictionary.update('JS', value);
                                    this._action = value;
                                    this._dictionary._updated = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfFileLinkAnnotation {
        const annot: PdfFileLinkAnnotation = new PdfFileLinkAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        this._addAction();
        this._dictionary.update('Rect', _updateBounds(this));
    }
    _addAction(): void {
        if (this._dictionary.has('A')) {
            const action: _PdfDictionary = this._dictionary.get('A');
            if (action) {
                if (typeof this._action !== 'undefined' && this._action !== null && action.has('Next')) {
                    const nextAction: _PdfReference[] = action.get('Next');
                    if (Array.isArray(nextAction) && nextAction.length > 0) {
                        nextAction.forEach((reference: _PdfReference) => {
                            if (reference && reference instanceof _PdfReference && reference._isNew) {
                                this._crossReference._cacheMap.delete(reference);
                            }
                        });
                    }
                }
                if (action.has('F')) {
                    _removeDuplicateReference(action, this._crossReference, 'F');
                }
            }
            _removeDuplicateReference(this._dictionary, this._crossReference, 'A');
        }
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Type', _PdfName.get('Action'));
        dictionary.set('S', _PdfName.get('Launch'));
        const fileDictionary: _PdfDictionary = new _PdfDictionary();
        fileDictionary.set('Type', _PdfName.get('Filespec'));
        fileDictionary.set('UF', this._fileName);
        if (typeof this._action !== 'undefined' && this._action !== null) {
            const actionDictionary: _PdfDictionary = new _PdfDictionary();
            actionDictionary.set('Type', _PdfName.get('Action'));
            actionDictionary.set('S', _PdfName.get('JavaScript'));
            actionDictionary.set('JS', this._action);
            const ref: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(ref, actionDictionary);
            actionDictionary._updated = true;
            dictionary.set('Next', [ref]);
        }
        const reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, fileDictionary);
        fileDictionary._updated = true;
        dictionary.set('F', reference);
        dictionary._updated = true;
        this._dictionary.set('A', dictionary);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (!this._isLoaded) {
            this._postProcess();
        }
        if (isFlatten) {
            let appearanceStream: _PdfBaseStream;
            if (this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    appearanceStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (reference && appearanceStream) {
                        appearanceStream.reference = reference;
                    }
                }
            }
            if (appearanceStream) {
                const template: PdfTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                const isNormalMatrix: boolean = this._validateTemplateMatrix(template._content.dictionary);
                this._flattenAnnotationTemplate(template, isNormalMatrix);
            } else {
                this._removeAnnotation(this._page, this);
            }
        }
    }
}
/**
 * `PdfUriAnnotation` class represents the URI annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new URI annotation
 * let annotation: PdfUriAnnotation = new PdfUriAnnotation(100, 150, 200, 100, ‘http://www.google.com’);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfUriAnnotation extends PdfAnnotation {
    private _uri: string;
    /**
     * Initializes a new instance of the `PdfUriAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfUriAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new URI annotation
     * let annotation: PdfUriAnnotation = new PdfUriAnnotation(100, 150, 200, 100);
     * // Sets the uri of the annotation
     * annotation.uri = ‘http://www.google.com’;
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number)
    /**
     * Initializes a new instance of the `PdfUriAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * @param {string} uri Uri
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new uri annotation
     * let annotation: PdfUriAnnotation = new PdfUriAnnotation(100, 150, 200, 100, ‘http://www.google.com’);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number, uri: string)
    constructor(x?: number, y?: number, width?: number, height?: number, uri?: string) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Link'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        if (typeof uri !== 'undefined' && uri !== null) {
            this._uri = uri;
        }
        this._type = _PdfAnnotationType.uriAnnotation;
    }
    /**
     * Gets the uri of the annotation.
     *
     * @returns {string} Uri.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfUriAnnotation = page.annotations.at(0) as PdfUriAnnotation;
     * // Gets the uri of the annotation.
     * let uri: string = annotation.uri;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get uri(): string {
        if (typeof this._uri === 'undefined' && this._dictionary.has('A')) {
            const linkDict: _PdfDictionary = this._dictionary.get('A');
            if (linkDict.has('URI')) {
                this._uri = linkDict.get('URI');
            }
        }
        return this._uri;
    }
    /**
     * Sets the uri of the annotation.
     *
     * @param {string} value Uri.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new URI annotation
     * let annotation: PdfUriAnnotation = new PdfUriAnnotation(100, 150, 200, 100);
     * // Sets the uri of the annotation
     * annotation.uri = ‘http://www.google.com’;
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set uri(value: string) {
        if (typeof value === 'string') {
            if (this._isLoaded && this._dictionary.has('A') && value !== this.uri) {
                const linkDict: _PdfDictionary = this._dictionary.get('A');
                if (linkDict.has('URI')) {
                    this._uri = value;
                    linkDict.update('URI', value);
                    this._dictionary._updated = true;
                }
            } else {
                this._uri = value;
            }
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfUriAnnotation {
        const annot: PdfUriAnnotation = new PdfUriAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        this._addAction();
        this._dictionary.update('Rect', _updateBounds(this));
    }
    _addAction(): void {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Type', _PdfName.get('Action'));
        dictionary.set('S', _PdfName.get('URI'));
        if (typeof this._uri !== 'undefined') {
            dictionary.set('URI', this._uri);
        }
        dictionary._updated = true;
        this._dictionary.set('A', dictionary);
        this._dictionary.update('Border', [this.border.hRadius, this.border.vRadius, this.border.width]);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (!this._isLoaded) {
            this._postProcess();
        }
        if (isFlatten) {
            let appearanceStream: _PdfBaseStream;
            if (this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    appearanceStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (reference && appearanceStream) {
                        appearanceStream.reference = reference;
                    }
                }
            }
            if (appearanceStream) {
                const template: PdfTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                const isNormalMatrix: boolean = this._validateTemplateMatrix(template._content.dictionary);
                this._flattenAnnotationTemplate(template, isNormalMatrix);
            } else {
                this._removeAnnotation(this._page, this);
            }
        }
    }
}
/**
 * `PdfDocumentLinkAnnotation` class represents the document link annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new document link annotation
 * let annotation: PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation(100, 150, 40, 60);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfDocumentLinkAnnotation extends PdfAnnotation {
    _destination: PdfDestination;
    /**
     * Initializes a new instance of the `PdfDocumentLinkAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfDocumentLinkAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new document link annotation
     * let annotation: PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation(100, 150, 40, 60);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number)
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Link'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        this._type = _PdfAnnotationType.documentLinkAnnotation;
    }
    /**
     * Gets the destination of the annotation.
     *
     * @returns {PdfDestination} Destination.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfDocumentLinkAnnotation = page.annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Gets the destination of the annotation.
     * let destination: PdfDestination =annotation.destination;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get destination(): PdfDestination {
        if (this._isLoaded) {
            this.destination = this._obtainDestination();
        }
        return this._destination;
    }
    /**
     * Sets the destination of the annotation.
     *
     * @param {PdfDestination} value Destination.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Access the annotation at index 0
     * let annotation: PdfDocumentLinkAnnotation = page.annotations.at(0) as PdfDocumentLinkAnnotation;
     * // Initializes a new instance of the `PdfDestination` class.
     * let destination: PdfDestination = new PdfDestination();
     * // Sets the zoom factor.
     * destination.zoom = 20;
     * // Sets the page where the destination is situated.
     * destination.page = page;
     * // Sets the mode of the destination.
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Sets the location of the destination.
     * destination.location = [20, 20];
     * // Sets the bounds of the destination.
     * destination.destinationBounds = [20, 20, 100, 50];
     * // Sets destination to document link annotation.
     * annotation.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set destination(value: PdfDestination) {
        if (value !== null) {
            this._destination = value;
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfDocumentLinkAnnotation {
        const annot: PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        this._addDocument();
        this._dictionary.update('Rect', _updateBounds(this));
    }
    _obtainDestination(): PdfDestination {
        if (this._dictionary.has('Dest')) {
            const array: any[] = this._dictionary.get('Dest');// eslint-disable-line
            let holder: _PdfReference;
            if (array[0] instanceof _PdfReference) {
                holder = array[0];
            }
            if ((typeof holder === 'undefined' || holder === null) && typeof array[0] === 'number') {
                const pageNumber: number = array[0];
                const page: PdfPage = this._crossReference._document.getPage(pageNumber);
                if (page) {
                    const mode: _PdfName = array[1];
                    if (mode.name === 'XYZ') {
                        const left: number = array[2];
                        const top: number = array[3];
                        const zoom: number = array[4];
                        const topValue: number = (typeof top !== 'undefined' && top !== null) ? (page.size[1] - top) : 0;
                        const leftValue: number = (typeof left !== 'undefined' && left !== null) ? left : 0;
                        this._destination = new PdfDestination(page , [leftValue, topValue]);
                        if (typeof zoom !== 'undefined' && zoom !== null) {
                            this._destination.zoom = zoom;
                        }
                        if ((typeof left === 'undefined' && left === null) || (typeof top === 'undefined' && top === null)
                            || (typeof zoom === 'undefined' && zoom === null)) {
                            this._destination._setValidation(false);
                        }
                    } else {
                        this._destination = new PdfDestination(page);
                        this._destination.mode = PdfDestinationMode.fitToPage;
                    }
                }
            }
            if (holder) {
                const index: number = _getPageIndex(this._crossReference._document, this._crossReference._fetch(holder));
                if (index >= 0) {
                    const page: PdfPage = this._crossReference._document.getPage(index);
                    if (page && array[1] instanceof _PdfName) {
                        const mode: _PdfName = array[1];
                        if (mode) {
                            if (mode.name === 'XYZ') {
                                const left: number = array[2];
                                const top: number = array[3];
                                const zoom: number = array[4];
                                const topValue: number = (typeof top !== 'undefined' && top !== null) ? (page.size[1] - top) : 0;
                                const leftValue: number = (typeof left !== 'undefined' && left !== null) ? left : 0;
                                this._destination = new PdfDestination(page, [leftValue, topValue]);
                                if (typeof zoom !== 'undefined' && zoom !== null) {
                                    this._destination.zoom = zoom;
                                }
                                if ((typeof left === 'undefined' && left === null) || (typeof top === 'undefined' && top === null)
                                    || (typeof zoom === 'undefined' && zoom === null)) {
                                    this._destination._setValidation(false);
                                }
                            } else if (mode.name === 'Fit') {
                                this._destination = new PdfDestination(page);
                                this._destination.mode = PdfDestinationMode.fitToPage;
                            }
                        }
                    }
                } else {
                    this._destination = new PdfDestination();
                    const zoom: number = array[4];
                    const mode: _PdfName = array[1];
                    if (typeof zoom !== 'undefined' && zoom !== null) {
                        this._destination.zoom = zoom;
                    }
                    if (mode.name === 'Fit') {
                        this._destination.mode = PdfDestinationMode.fitToPage;
                    } else if (mode.name === 'XYZ') {
                        const left: number = array[2];
                        const topValue: number = array[3];
                        if ((typeof left === 'undefined' && left === null) || (typeof topValue === 'undefined' && topValue === null)
                            || (typeof zoom === 'undefined' && zoom === null)) {
                            this._destination._setValidation(false);
                        }
                    }
                    this._destination._index = index;
                }
            }
        } else if (this._dictionary.has('A') && !this._destination) {
            const action: _PdfDictionary = this._dictionary.get('A');
            if (action.has('D')) {
                const reference: any = action.get('D');// eslint-disable-line
                if (reference !== null && typeof reference !== 'undefined') {
                    let referenceArray: any[];// eslint-disable-line
                    if (Array.isArray(reference)) {
                        referenceArray = reference;
                    } else if (reference instanceof _PdfReference) {
                        const referenceValue: any[] = this._crossReference._fetch(reference);// eslint-disable-line
                        if (Array.isArray(referenceValue)) {
                            referenceArray = referenceValue;
                        }
                    } else if (typeof reference === 'string') {
                        const document: PdfDocument = this._crossReference._document;
                        if (document) {
                            referenceArray = this._getNamedDestination(document, reference);
                        }
                    }
                    if (referenceArray && (referenceArray[0] instanceof _PdfReference || typeof referenceArray[0] === 'number')) {
                        const document: PdfDocument = this._crossReference._document;
                        let index: number;
                        if (referenceArray[0] instanceof _PdfReference) {
                            index = _getPageIndex(document, this._crossReference._fetch(referenceArray[0]));
                        } else {
                            index = referenceArray[0];
                        }
                        const page: PdfPage = document.getPage(index);
                        if (page) {
                            const mode: _PdfName = referenceArray[1];
                            if (mode.name === 'FitBH' || mode.name === 'FitH') {
                                const top: number = referenceArray[2];
                                const topValue: number = (typeof top !== 'undefined' && top !== null) ? (page.size[1] - top) : 0;
                                this._destination = new PdfDestination(page, [0, topValue]);
                                if (typeof top === 'undefined' || top === null) {
                                    this._destination._setValidation(false);
                                }
                            } else if (mode.name === 'XYZ') {
                                const left: number = referenceArray[2];
                                const top: number = referenceArray[3];
                                const zoom: number = referenceArray[4];
                                const topValue: number = (typeof top !== 'undefined' && top !== null) ? (page.size[1] - top) : 0;
                                const leftValue: number = (typeof left !== 'undefined' && left !== null) ? left : 0;
                                this._destination = new PdfDestination(page, [leftValue, topValue]);
                                if (typeof zoom !== 'undefined' && zoom !== null) {
                                    this._destination.zoom = zoom;
                                }
                                if ((typeof left !== 'undefined' && left !== null) || (typeof top !== 'undefined' && top !== null)
                                    || (typeof zoom !== 'undefined' && zoom !== null)) {
                                    this._destination._setValidation(false);
                                }
                            } else if (mode.name === 'FitR') {
                                if (referenceArray.length === 6) {
                                    const left: number = referenceArray[2];
                                    const bottom: number = referenceArray[3];
                                    const right: number = referenceArray[4];
                                    const top: number = referenceArray[5];
                                    this._destination = new PdfDestination(page, [left, bottom, right, top]);
                                }
                            } else if (mode.name === 'Fit') {
                                this._destination = new PdfDestination(page);
                                this._destination.mode = PdfDestinationMode.fitToPage;
                            }
                        }
                    }
                }
            }
        }
        return this._destination;
    }
    _getNamedDestination(document: PdfDocument, result: string): any[] { // eslint-disable-line
        let destination: any[]; // eslint-disable-line
        const catalog: _PdfCatalog = document._catalog;
        if (catalog && catalog._catalogDictionary && catalog._catalogDictionary.has('Names')) {
            const names: _PdfDictionary = catalog._catalogDictionary.get('Names');
            if (names && names.has('Dests')) {
                const kids: _PdfDictionary = names.get('Dests');
                if (kids) {
                    const ref: _PdfReference = this._getNamedObjectFromTree(kids, result);
                    destination = this._extractDestination(ref, document);
                }
            }
        }
        return destination;
    }
    _extractDestination(ref: any, document: PdfDocument): any[] { // eslint-disable-line
        let dict: _PdfDictionary;
        let destinationArray: any[]; // eslint-disable-line
        if (ref instanceof _PdfReference) {
            dict = document._crossReference._fetch(ref);
        }
        if (dict && dict.has('D')) {
            destinationArray = dict.getRaw('D');
        }
        return destinationArray;
    }
    _getNamedObjectFromTree(kids: _PdfDictionary, name: string): _PdfReference {
        let found: boolean = false;
        let currentDictionary: _PdfDictionary = kids;
        let reference: _PdfReference;
        while (!found && currentDictionary) {
            if (currentDictionary && currentDictionary.has('Kids')) {
                currentDictionary = this._getProperKid(currentDictionary, name);
            }
            else if (currentDictionary && currentDictionary.has('Names')) {
                reference = this._findName(currentDictionary, name);
                found = true;
            }
        }
        return reference;
    }
    _findName(current: _PdfDictionary, name: string): _PdfReference {
        const names: any[] = current.get('Names'); // eslint-disable-line
        const halfLength: number = names.length / 2;
        let lowerIndex: number = 0;
        let topIndex: number = halfLength - 1;
        let half: number = 0;
        let found: boolean = false;
        let destinationReference: _PdfReference;
        while (!found) {
            half = Math.floor((lowerIndex + topIndex) / 2);
            if (lowerIndex > topIndex) {
                break;
            }
            let result: any = names[Number.parseInt(half.toString(), 10) * 2]; // eslint-disable-line
            if (result && result instanceof _PdfReference) {
                result = current._crossReference._fetch(result);
            }
            const cmp: number = this._stringCompare(name, result);
            if (cmp > 0) {
                lowerIndex = half + 1;
            } else if (cmp < 0) {
                topIndex = half - 1;
            } else {
                found = true;
                break;
            }
        }
        if (found) {
            destinationReference = names[half * 2 + 1];
        }
        return destinationReference;
    }
    _getProperKid(kids: _PdfDictionary, name: string): _PdfDictionary {
        let kidsArray: any; // eslint-disable-line
        let kid: _PdfDictionary;
        if (kids && kids.has('Kids')) {
            kidsArray = kids.getRaw('Kids');
        }
        if (kidsArray && Array.isArray(kidsArray) && kidsArray.length !== 0) {
            kidsArray = kids.getArray('Kids');
            for (let i: number = 0; i < kidsArray.length; i++) {
                kid = kidsArray[Number.parseInt(i.toString(), 10)];
                if (this._checkLimits(kid, name)) {
                    break;
                }
            }
        }
        return kid;
    }
    _checkLimits (kid: _PdfDictionary, result: string): boolean {
        let found: boolean = false;
        if (kid && kid.has('Limits')) {
            const limits: any[] = kid.get('Limits'); // eslint-disable-line
            const lowerLimit: string = limits[0];
            const higherLimit: string = limits[1];
            const lowCompare: number = this._stringCompare(lowerLimit, result);
            const highCompare: number = this._stringCompare(higherLimit, result);
            if (lowCompare === 0 || highCompare === 0) {
                found = true;
            } else if (lowCompare < 0 && highCompare > 0) {
                found = true;
            }
        }
        return found;
    }
    _stringCompare(limits: string, result: string): number {
        const byteArray: Uint8Array = _stringToBytes(limits) as Uint8Array;
        const byteArray1: Uint8Array = _stringToBytes(result) as Uint8Array;
        const commonSize: number = Math.min(byteArray.length, byteArray1.length);
        let resultValue: number = 0;
        for (let i: number = 0; i < commonSize; i++) {
            const byte: number = byteArray[Number.parseInt(i.toString(), 10)];
            const byte1: number = byteArray1[Number.parseInt(i.toString(), 10)];
            resultValue = byte - byte1;
            if (resultValue !== 0) {
                break;
            }
        }
        if (resultValue === 0) {
            resultValue = byteArray.length - byteArray1.length;
        }
        return resultValue;
    }
    _addDocument(): void {
        if (this.destination) {
            this._dictionary.set('Dest', this.destination._array);
        }
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (!this._isLoaded) {
            this._postProcess();
        }
        if (isFlatten) {
            let appearanceStream: _PdfBaseStream;
            if (this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    appearanceStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (reference && appearanceStream) {
                        appearanceStream.reference = reference;
                    }
                }
            }
            if (appearanceStream) {
                const template: PdfTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                const isNormalMatrix: boolean = this._validateTemplateMatrix(template._content.dictionary);
                this._flattenAnnotationTemplate(template, isNormalMatrix);
            } else {
                this._removeAnnotation(this._page, this);
            }
        }
    }
}
/**
 * `PdfTextWebLinkAnnotation` class represents the link annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF string format
 * const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.top);
 * // Create a new standard font
 * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
 * // Get the text size
 * let size: number[] = font.measureString("Syncfusion Site", format, [0, 0], 0, 0);
 * // Create a new text web link annotation
 * let annot: PdfTextWebLinkAnnotation = new PdfTextWebLinkAnnotation(50, 40, size[0], size[1], [0, 0, 0], [165, 42, 42], 1);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfTextWebLinkAnnotation extends PdfAnnotation {
    private _url: string;
    private _font: PdfFont;
    private _pen: PdfPen;
    private _textWebLink: string;
    private _brush: PdfBrush;
    private _isActionAdded: boolean = false;
    /**
     * Initializes a new instance of the `PdfTextWebLinkAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfTextWebLinkAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * @param {number[]} brushColor Brush color.
     * @param {number[]} penColor Pen color.
     * @param {number} penWidth Pen width.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF string format
     * const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.top);
     * // Create a new standard font
     * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Get the text size
     * let size: number[] = font.measureString("Syncfusion Site", format, [0, 0], 0, 0);
     * // Create a new text web link annotation
     * let annot: PdfTextWebLinkAnnotation = new PdfTextWebLinkAnnotation(50, 40, size[0], size[1], [0, 0, 0], [165, 42, 42], 1);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number, brushColor: number[], penColor: number[], penWidth: number)
    /**
     * Initializes a new instance of the `PdfTextWebLinkAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * @param {number[]} brushColor Brush color.
     * @param {number[]} penColor Pen color.
     * @param {number} penWidth Pen width.
     * @param {string} text Text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF string format
     * const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.top);
     * // Create a new standard font
     * const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Get the text size
     * let size: number[] = font.measureString("Syncfusion Site", format, [0, 0], 0, 0);
     * // Create a new text web link annotation
     * let annot: PdfTextWebLinkAnnotation = new PdfTextWebLinkAnnotation(50, 40, size[0], size[1], [0, 0, 0], [165, 42, 42], 1, 'Google');
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number,
        y: number,
        width: number,
        height: number,
        brushColor: number[],
        penColor: number[],
        penWidth: number,
        text: string)
    constructor(x?: number,
                y?: number,
                width?: number,
                height?: number,
                brushColor?: number[],
                penColor?: number[],
                penWidth?: number,
                text?: string) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Link'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        this._textWebLink = typeof text !== 'undefined' && text !== null ? text : '';
        if (typeof brushColor !== 'undefined' && brushColor !== null) {
            this._brush = new PdfBrush(brushColor);
        }
        if (typeof penColor !== 'undefined' && penColor !== null) {
            this._pen = new PdfPen(penColor, penWidth ? penWidth : 1);
        }
        this._type = _PdfAnnotationType.textWebLinkAnnotation;
    }
    /**
     * Gets the font of the annotation.
     *
     * @returns {PdfFont} font.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfTextWebLinkAnnotation = page.annotations.at(0) as PdfTextWebLinkAnnotation;
     * // Gets the font of the annotation.
     * let font: PdfFont = annotation.font;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get font(): PdfFont {
        return this._font;
    }
    /**
     * Sets the font of the annotation.
     *
     * @param {PdfFont} value font.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfTextWebLinkAnnotation = page.annotations.at(0) as PdfTextWebLinkAnnotation;
     * // Sets the font of the annotation.
     * annotation.font = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set font(value: PdfFont) {
        this._font = value;
    }
    /**
     * Gets the url of the annotation.
     *
     * @returns {string} Url.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfTextWebLinkAnnotation = page.annotations.at(0) as PdfTextWebLinkAnnotation;
     * // Gets the URL of the annotation.
     * let url: string = annotation.url;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get url(): string {
        if (typeof this._url === 'undefined' && this._dictionary.has('A')) {
            const linkDict: _PdfDictionary = this._dictionary.get('A');
            if (linkDict.has('URI')) {
                this._url = linkDict.get('URI');
            }
        }
        return this._url;
    }
    /**
     * Sets the url of the annotation.
     *
     * @param {string} value Url.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfTextWebLinkAnnotation = page.annotations.at(0) as PdfTextWebLinkAnnotation;
     * // Sets the URL of the annotation.
     * annotation.url = ‘http://www.syncfusion.com’;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set url(value: string) {
        if (typeof value === 'string') {
            if (this._isLoaded && this._dictionary.has('A')) {
                const linkSource: any = this._dictionary._get('A');// eslint-disable-line
                const linkDict: _PdfDictionary = this._dictionary.get('A');
                if (linkDict && linkDict.has('URI')) {
                    this._url = value;
                    linkDict.update('URI', value);
                    if (!(linkSource instanceof _PdfReference)) {
                        this._dictionary._updated = linkDict._updated;
                    }
                }
            } else {
                this._url = value;
            }
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfTextWebLinkAnnotation {
        const annot: PdfTextWebLinkAnnotation = new PdfTextWebLinkAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        if (!this._isActionAdded) {
            this._addAction();
            this._isActionAdded = true;
        }
        this._dictionary.update('Rect', _updateBounds(this));
    }
    _addAction(): void {
        const rect: number[] = [this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height];
        if (typeof this.font === 'undefined' || this.font === null) {
            this.font = this._lineCaptionFont;
        }
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.top);
        this._page.graphics.drawString(this._textWebLink, this.font, rect, this._pen, this._brush, format);
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Type', _PdfName.get('Action'));
        dictionary.set('S', _PdfName.get('URI'));
        if (typeof this._url !== 'undefined') {
            dictionary.set('URI', this._url);
        }
        dictionary._updated = true;
        this._dictionary.set('A', dictionary);
        this._dictionary.update('Border', [0, 0, 0]);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (!this._isLoaded) {
            this._postProcess();
        }
        if (isFlatten) {
            let appearanceStream: _PdfBaseStream;
            if (this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    appearanceStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (reference && appearanceStream) {
                        appearanceStream.reference = reference;
                    }
                }
            }
            if (appearanceStream) {
                const template: PdfTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                const isNormalMatrix: boolean = this._validateTemplateMatrix(template._content.dictionary);
                this._flattenAnnotationTemplate(template, isNormalMatrix);
            } else {
                this._removeAnnotation(this._page, this);
            }
        }
    }
}
/**
 * `PdfAttachmentAnnotation` class represents the attachment annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new attachment annotation
 * const annotation: PdfAttachmentAnnotation = new PdfAttachmentAnnotation(300, 200, 30, 30, "Nature.jpg", imageData);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfAttachmentAnnotation extends PdfComment {
    _icon: PdfAttachmentIcon = PdfAttachmentIcon.pushPin;
    private _stream: _PdfStream;
    private _fileName: string;
    private _iconString: string = '';
    /**
     * Initializes a new instance of the `PdfAttachmentAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfAttachmentAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * @param {string} fileName FileName.
     * @param {string} data Data as base64 string.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new attachment annotation
     * const annotation: PdfAttachmentAnnotation =  new PdfAttachmentAnnotation(300, 200, 30, 30, "Nature.jpg", ‘imageData’);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number, fileName: string, data: string)
    /**
     * Initializes a new instance of the `PdfAttachmentAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * @param {string} fileName FileName
     * @param {Uint8Array} data Data as byte array
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new attachment annotation
     * const annotation: PdfAttachmentAnnotation =  new PdfAttachmentAnnotation(300, 200, 30, 30, "Nature.jpg", ‘imageData’);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number, fileName: string, data: Uint8Array)
    constructor(x?: number, y?: number, width?: number, height?: number, fileName?: string, data?: string | Uint8Array) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('FileAttachment'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        if (typeof fileName !== 'undefined') {
            this._fileName = fileName;
        }
        this._stream = new _PdfStream(typeof data === 'string' ? _decode(data) : data);
        this._type = _PdfAnnotationType.fileAttachmentAnnotation;
    }
    /**
     * Gets the icon type of the attachment annotation.
     *
     * @returns {PdfAttachmentIcon} Annotation icon.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfAttachmentAnnotation = page.annotations.at(0) as PdfAttachmentAnnotation;
     * // Gets the icon type of the attachment annotation.
     * let icon: PdfAttachmentIcon = annotation.icon;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get icon(): PdfAttachmentIcon {
        if (this._dictionary.has('Name')) {
            this._icon = _mapAttachmentIcon(this._dictionary.get('Name').name);
        }
        return this._icon;
    }
    /**
     * Sets the icon type of the attachment annotation.
     *
     * @param {PdfAttachmentIcon} value Annotation icon.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as  PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfAttachmentAnnotation = page.annotations.at(0) as PdfAttachmentAnnotation;
     * // Sets the icon type of the attachment annotation.
     * annotation.icon = PdfAttachmentIcon.pushPin;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set icon(value: PdfAttachmentIcon) {
        if (typeof value !== 'undefined') {
            this._icon = value;
            this._dictionary.update('Name', _PdfName.get(this._obtainIconName(this._icon)));
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfAttachmentAnnotation {
        const annot: PdfAttachmentAnnotation = new PdfAttachmentAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        this._dictionary.update('Rect', _updateBounds(this));
        this._addAttachment();
    }
    _addAttachment(): void {
        if (this._dictionary.has('FS')) {
            const fileSpecification: _PdfDictionary = this._dictionary.get('FS');
            if (fileSpecification && fileSpecification.has('EF')) {
                const embeddedFile: _PdfDictionary = fileSpecification.get('EF');
                if (embeddedFile && embeddedFile.has('F')) {
                    _removeDuplicateReference(embeddedFile, this._crossReference, 'F');
                }
            }
            _removeDuplicateReference(this._dictionary, this._crossReference, 'FS');
        }
        const fileSpectDictionary: _PdfDictionary = new _PdfDictionary();
        fileSpectDictionary.set('Type', _PdfName.get('Filespec'));
        fileSpectDictionary.set('Desc', this._fileName);
        fileSpectDictionary.set('F', this._fileName);
        fileSpectDictionary.set('UF', this._fileName);
        const fileDictionary: _PdfDictionary = new _PdfDictionary();
        fileDictionary.set('Type', _PdfName.get('EmbeddedFile'));
        const paramsDictionary: _PdfDictionary = new _PdfDictionary();
        const dateTime: Date = new Date();
        paramsDictionary.set('CreationDate', dateTime.toTimeString());
        paramsDictionary.set('ModDate', new Date().toTimeString());
        paramsDictionary.set('Size', this._stream.length);
        fileDictionary.set('Params', paramsDictionary);
        this._stream.dictionary = new _PdfDictionary();
        this._stream.dictionary = fileDictionary;
        fileDictionary._crossReference = this._crossReference;
        const char1: number = this._crossReference._newLine.charCodeAt(0);
        const char2: number = this._crossReference._newLine.charCodeAt(1);
        const buffer: Array<number> = [char1, char2, 37, 80, 68, 70, 45];
        fileDictionary._crossReference._writeObject(this._stream, buffer);
        const reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, this._stream);
        fileDictionary._updated = true;
        const efileDictionary: _PdfDictionary = new _PdfDictionary();
        efileDictionary.set('F', reference);
        fileSpectDictionary.set('EF', efileDictionary);
        const fsReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(fsReference, fileSpectDictionary);
        fileSpectDictionary._updated = true;
        this._dictionary.update('FS', fsReference);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (!this._isLoaded) {
            this._postProcess();
        }
        if (isFlatten) {
            let appearanceStream: _PdfBaseStream;
            if (this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    appearanceStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (reference && appearanceStream) {
                        appearanceStream.reference = reference;
                    }
                }
            }
            if (appearanceStream) {
                const template: PdfTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                const isNormalMatrix: boolean = this._validateTemplateMatrix(template._content.dictionary);
                this._flattenAnnotationTemplate(template, isNormalMatrix);
            } else {
                this._removeAnnotation(this._page, this);
            }
        }
    }
    _obtainIconName(icon: PdfAttachmentIcon): string{
        switch (icon) {
        case PdfAttachmentIcon.pushPin:
            this._iconString = 'PushPin';
            break;
        case PdfAttachmentIcon.tag:
            this._iconString = 'Tag';
            break;
        case PdfAttachmentIcon.graph:
            this._iconString = 'Graph';
            break;
        case PdfAttachmentIcon.paperClip:
            this._iconString = 'Paperclip';
            break;
        }
        return this._iconString;
    }
}
/**
 * `Pdf3DAnnotation` class represents the 3D annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: Pdf3DAnnotation = page.annotations.at(0) as Pdf3DAnnotation;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class Pdf3DAnnotation extends PdfAnnotation {
    /**
     * Initializes a new instance of the `Pdf3DAnnotation` class.
     *
     * @private
     */
    constructor() {
        super();
        this._type = _PdfAnnotationType.movieAnnotation;
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): Pdf3DAnnotation {
        const annot: Pdf3DAnnotation = new Pdf3DAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (isFlatten) {
            let appearanceStream: _PdfBaseStream;
            if (this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    appearanceStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (reference && appearanceStream) {
                        appearanceStream.reference = reference;
                    }
                }
            }
            if (appearanceStream) {
                const template: PdfTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                const isNormalMatrix: boolean = this._validateTemplateMatrix(template._content.dictionary);
                this._flattenAnnotationTemplate(template, isNormalMatrix);
            } else {
                this._removeAnnotation(this._page, this);
            }
        }
    }
}
/**
 * `PdfTextMarkupAnnotation` class represents the text markup annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new text markup annotation
 * let annotation: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation('Text markup', 50, 100, 100, 50);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfTextMarkupAnnotation extends PdfComment {
    _textMarkupType: PdfTextMarkupAnnotationType = PdfTextMarkupAnnotationType.highlight;
    private _quadPoints: Array<number> = new Array<number>(8);
    private _points: number[];
    private _textMarkUpColor: number[];
    private _boundsCollection: Array<number[]> = [];
    /**
     * Initializes a new instance of the `PdfTextMarkupAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfTextMarkupAnnotation` class.
     *
     * @param {string} text Text.
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new text markup annotation
     * const annotation: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation('Water Mark', 50, 100, 100, 50);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(text: string, x: number, y: number, width: number, height: number )
    constructor(text?: string, x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        if (typeof text !== 'undefined') {
            this._text = text;
        }
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
            this._boundsCollection.push([this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height]);
        }
        this._type = _PdfAnnotationType.textMarkupAnnotation;
    }
    /**
     * Gets the text markup color of the annotation.
     *
     * @returns {number[]} Text markup color as R, G, B color array in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfTextMarkupAnnotation = page.annotations.at(0) as PdfTextMarkupAnnotation;
     * // Gets the textMarkUp Color type of the attachment annotation.
     * let textMarkUpColor: number[] = annotation.textMarkUpColor;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textMarkUpColor(): number[] {
        if (typeof this._textMarkUpColor === 'undefined' && this._dictionary.has('C')) {
            this._textMarkUpColor = _parseColor(this._dictionary.getArray('C'));
        }
        return this._textMarkUpColor;
    }
    /**
     * Sets the text markup color of the annotation.
     *
     * @param {number[]} value R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfTextMarkupAnnotation = page.annotations.at(0) as PdfTextMarkupAnnotation;
     * // Sets the textMarkUp Color type of the attachment annotation.
     * annotation.textMarkUpColor = [255, 255, 255];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textMarkUpColor(value: number[]) {
        if (typeof value !== 'undefined' && value.length === 3) {
            const extColor: number[] = this.color;
            if (!this._isLoaded ||
                typeof extColor === 'undefined' ||
                (extColor[0] !== value[0] || extColor[1] !== value[1] || extColor[2] !== value[2])) {
                this._color = value;
                this._textMarkUpColor = value;
                this._dictionary.update('C', [Number.parseFloat((value[0] / 255).toFixed(3)),
                    Number.parseFloat((value[1] / 255).toFixed(3)),
                    Number.parseFloat((value[2] / 255).toFixed(3))]);
            }
        }
    }
    /**
     * Gets the markup type of the annotation.
     *
     * @returns {PdfTextMarkupAnnotationType} Markup type.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfTextMarkupAnnotation = page.annotations.at(0) as PdfTextMarkupAnnotation;
     * // Gets the markup type of the annotation.
     * let textMarkupType: PdfTextMarkupAnnotationType = annotation.textMarkupType;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textMarkupType(): PdfTextMarkupAnnotationType {
        if (this._dictionary.has('Subtype')) {
            const text: _PdfName = this._dictionary.get('Subtype');
            this._textMarkupType = _mapMarkupAnnotationType(text.name);
        }
        return this._textMarkupType;
    }
    /**
     * Sets the markup type of the annotation.
     *
     * @param {PdfTextMarkupAnnotationType} value Markup type.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfTextMarkupAnnotation = page.annotations.at(0) as PdfTextMarkupAnnotation;
     * // Sets the markup type of the annotation.
     * annotation.textMarkupType = PdfTextMarkupAnnotationType.squiggly;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textMarkupType(value: PdfTextMarkupAnnotationType) {
        if (typeof value !== 'undefined') {
            this._textMarkupType = value;
            this._dictionary.update('Subtype', _PdfName.get(_reverseMarkupAnnotationType(value)));
        }
    }
    /**
     * Gets the markup bounds collection of the annotation.
     *
     * @returns {Array<number[]>} Markup bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as  PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfTextMarkupAnnotation =  page.annotations.at(0) as PdfTextMarkupAnnotation;
     * // Gets the markup bounds collection of the annotation.
     * let boundsCollection : Array<number[]> = annotation.boundsCollection;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get boundsCollection(): Array<number[]> {
        if (this._isLoaded) {
            const collection: Array<number[]> = [];
            if (this._dictionary.has('QuadPoints')) {
                const points: number[] = this._dictionary.getArray('QuadPoints');
                if (points && points.length > 0) {
                    const count: number = points.length / 8;
                    for (let i: number = 0; i < count; i++) {
                        let x: number = points[4 + (i * 8)] - points[i * 8];
                        let y: number = points[5 + (i * 8)] - points[1 + (i * 8)];
                        const height: number = Math.sqrt((x * x) + (y * y));
                        x = points[6 + (i * 8)] - points[4 + (i * 8)];
                        y = points[7 + (i * 8)] - points[5 + (i * 8)];
                        const width: number = Math.sqrt((x * x) + (y * y));
                        const rect: number[] = [points[i * 8], this._page.size[1] - points[1 + (i * 8)], width, height];
                        collection.push(rect);
                    }
                }
            }
            return collection;
        }
        return this._boundsCollection;
    }
    /**
     * Sets the markup bounds collection of the annotation.
     *
     * @param {Array<number[]>} value Markup bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfTextMarkupAnnotation = page.annotations.at(0) as PdfTextMarkupAnnotation;
     * // Sets the markup bounds collection of the  annotation.
     * annotation.boundsCollection = [[50, 50, 100, 100], [201, 101, 61, 31], [101, 401, 61, 31]];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set boundsCollection(value: Array<number[]>) {
        if (!this._isLoaded && typeof value !== 'undefined') {
            if (this._boundsCollection.length > 0) {
                this._quadPoints = new Array<number>(8 + (value.length * 8));
                for (let i: number = 0; i < value.length; i++) {
                    this._boundsCollection.push(value[Number.parseInt(i.toString(), 10)]);
                }
            } else {
                this._quadPoints = new Array<number>(8);
                this._boundsCollection = value;
            }
            this._isChanged = true;
        }
        if (this._isLoaded && typeof value !== 'undefined') {
            let isChanged: boolean = false;
            if (this.boundsCollection.length === value.length) {
                for (let i: number = 0; i < value.length; i++) {
                    const values: number[] = value[Number.parseInt(i.toString(), 10)];
                    for (let j: number = 0; j < values.length; j++) {
                        if (value[Number.parseInt(i.toString(), 10)][Number.parseInt(j.toString(), 10)] !==
                            this.boundsCollection[Number.parseInt(i.toString(), 10)][Number.parseInt(j.toString(), 10)]) {
                            isChanged = true;
                            break;
                        }
                    }
                }
            }
            else {
                isChanged = true;
            }
            if (isChanged) {
                this._quadPoints = new Array<number>((value.length * 8));
                const pageHeight: number = this._page.size[1];
                for (let i: number = 0; i < value.length; i++) {
                    this._quadPoints[0 + (Number.parseInt(i.toString(), 10) * 8)] = value[Number.parseInt(i.toString(), 10)][0];
                    this._quadPoints[1 + (Number.parseInt(i.toString(), 10) * 8)] = pageHeight -
                    value[Number.parseInt(i.toString(), 10)][1];
                    this._quadPoints[2 + (Number.parseInt(i.toString(), 10) * 8)] = value[Number.parseInt(i.toString(), 10)][0] +
                    value[Number.parseInt(i.toString(), 10)][2];
                    this._quadPoints[3 + (Number.parseInt(i.toString(), 10) * 8)] = pageHeight -
                    value[Number.parseInt(i.toString(), 10)][1];
                    this._quadPoints[4 + (Number.parseInt(i.toString(), 10) * 8)] = value[Number.parseInt(i.toString(), 10)][0];
                    this._quadPoints[5 + (Number.parseInt(i.toString(), 10) * 8)] = this._quadPoints[1 + (i * 8)] -
                    value[Number.parseInt(i.toString(), 10)][3];
                    this._quadPoints[6 + (Number.parseInt(i.toString(), 10) * 8)] = value[Number.parseInt(i.toString(), 10)][0] +
                    value[Number.parseInt(i.toString(), 10)][2];
                    this._quadPoints[7 + (Number.parseInt(i.toString(), 10) * 8)] = this._quadPoints[5 +
                        (Number.parseInt(i.toString(), 10) * 8)];
                }
                this._dictionary.update('QuadPoints', this._quadPoints);
                this._isChanged = true;
            }
        }
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfTextMarkupAnnotation {
        const annot: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            dictionary.set('W', this.border.width);
            this._dictionary.set('BS', dictionary);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        if (!this._dictionary.has('C')) {
            this._isTransparentColor = true;
        }
        const size: number[] = this._page.size;
        this._dictionary.update('Subtype', _PdfName.get(_reverseMarkupAnnotationType(this._textMarkupType)));
        if (this._isChanged) {
            this._setQuadPoints(size);
            this._dictionary.update('Rect', _updateBounds(this));
        }
        if (this._setAppearance) {
            this._appearanceTemplate = this._createMarkupAppearance();
            if (!this._isLoaded && this._boundsCollection.length > 1 && this._isChanged) {
                const native: number[] = this._obtainNativeRectangle();
                this._dictionary.update('Rect', [native[0], native[1], native[0] + native[2], native[1] + native[3]]);
            }
            if (this._dictionary.has('AP')) {
                _removeDuplicateReference(this._dictionary.get('AP'), this._crossReference, 'N');
            }
            const dictionary: _PdfDictionary = new _PdfDictionary();
            this._appearanceTemplate._content.dictionary._updated = true;
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
            this._appearanceTemplate._content.reference = reference;
            dictionary.set('N', reference);
            dictionary._updated = true;
            this._dictionary.set('AP', dictionary);
        }
        if (typeof this._text !== 'undefined' && this._text !== null) {
            this._dictionary.set('Contents', this._text);
        }
        this._isChanged = false;
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._isLoaded) {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                this._appearanceTemplate = this._createMarkupAppearance();
                if (!isFlatten) {
                    if (this._dictionary.has('AP')) {
                        _removeDuplicateReference(this._dictionary.get('AP'), this._crossReference, 'N');
                    }
                    const dictionary: _PdfDictionary = new _PdfDictionary();
                    this._appearanceTemplate._content.dictionary._updated = true;
                    const reference: _PdfReference = this._crossReference._getNextReference();
                    this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
                    this._appearanceTemplate._content.reference = reference;
                    dictionary.set('N', reference);
                    dictionary._updated = true;
                    this._dictionary.set('AP', dictionary);
                }
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    if (appearanceStream) {
                        const reference: _PdfReference = dictionary.getRaw('N');
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess();
            if (!this._appearanceTemplate) {
                if (isFlatten) {
                    if (!this._dictionary.has('AP')) {
                        this._appearanceTemplate = this._createMarkupAppearance();
                    } else {
                        const dictionary: _PdfDictionary = this._dictionary.get('AP');
                        if (dictionary && dictionary.has('N')) {
                            const appearanceStream: _PdfBaseStream = dictionary.get('N');
                            if (appearanceStream) {
                                const reference: _PdfReference = dictionary.getRaw('N');
                                if (reference) {
                                    appearanceStream.reference = reference;
                                }
                                this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                            }
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            } else {
                this._flattenPopUp();
            }
        }
        if (isFlatten && this._appearanceTemplate) {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            if (!this._appearanceTemplate._content.dictionary.has('Matrix') && !this._isLoaded) {
                const box: number[] = this._appearanceTemplate._content.dictionary.getArray('BBox');
                if (box) {
                    this._appearanceTemplate._content.dictionary.update('Matrix', [1, 0, 0, 1, -box[0], -box[1]]);
                }
            }
            if (isNormalMatrix && typeof this._page.rotation !== 'undefined' && this._page.rotation !== PdfRotationAngle.angle0) {
                this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
            } else if (isNormalMatrix && this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary,
                                                                      this._appearanceTemplate)) {
                this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
            } else if (!this._dictionary.has('AP') && this._appearanceTemplate) {
                this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
            }
        }
    }
    _createMarkupAppearance(): PdfTemplate {
        let width: number;
        let height: number = 0;
        let rectangle: {x: number, y: number, width: number, height: number};
        if (this.boundsCollection.length > 1) {
            const pdfPath: PdfPath = new PdfPath();
            for (let i: number = 0; i < this.boundsCollection.length; i++) {
                const bounds: number[] = [];
                bounds[0] = this.boundsCollection[Number.parseInt(i.toString(), 10)][0];
                bounds[1] = this.boundsCollection[Number.parseInt(i.toString(), 10)][1];
                bounds[2] = this.boundsCollection[Number.parseInt(i.toString(), 10)][2];
                bounds[3] = this.boundsCollection[Number.parseInt(i.toString(), 10)][3];
                pdfPath.addRectangle(bounds[0], bounds[1], bounds[2], bounds[3]);
            }
            const rect: number[] = pdfPath._getBounds();
            rectangle = {x: rect[0], y: rect[1], width: rect[2], height: rect[3]};
            this.bounds = rectangle;
            width = rectangle.width;
            height = rectangle.height;
        } else {
            if (this._dictionary.has('QuadPoints')) {
                const quadPoints: Array<number> = this._dictionary.get('QuadPoints');
                if (this._quadPoints !== null) {
                    for (let i: number = 0; i < (quadPoints.length / 8); i++) {
                        if (this._isLoaded) {
                            const point: Array<number[]> = new Array<number[]>();
                            let j: number = 0;
                            for (let k: number = 0; k < quadPoints.length;) {
                                const x1: number = quadPoints[Number.parseInt(k.toString(), 10)];
                                const y1: number = quadPoints[k + 1];
                                point[Number.parseInt(j.toString(), 10)] = [x1, y1];
                                k = k + 2;
                                j++;
                            }
                            const path: PdfPath = new PdfPath();
                            path._addLines(point);
                            const rect: number[] = path._getBounds();
                            rectangle = {x: rect[0], y: rect[1], width: rect[2], height: rect[3]};
                            width = rectangle.width;
                            height = rectangle.height;
                        } else {
                            let x: number = Math.floor(quadPoints[4 + (i * 8)]) - Math.floor(quadPoints[0 + (i * 8)]);
                            let y: number = Math.floor(quadPoints[5 + (i * 8)]) - Math.floor(quadPoints[1 + (i * 8)]);
                            height = Math.sqrt((x * x) + (y * y));
                            x = Math.floor(quadPoints[6 + (i * 8)]) - Math.floor(quadPoints[4 + (i * 8)]);
                            y = Math.floor(quadPoints[7 + (i * 8)]) - Math.floor(quadPoints[5 + (i * 8)]);
                            width = Math.sqrt((x * x) + (y * y));
                            this.bounds = {x: this.bounds.x, y: this.bounds.y, width: width, height: height};
                        }
                    }
                }
            }
        }
        const nativeRectangle: number[] = [0, 0, width, height];
        const template: PdfTemplate = new PdfTemplate(nativeRectangle, this._crossReference);
        _setMatrix(template, this._getRotationAngle());
        const graphics: PdfGraphics = template.graphics;
        if (typeof this.opacity !== 'undefined') {
            graphics.setTransparency(this.opacity, this.opacity, PdfBlendMode.multiply);
        }
        if (this.textMarkUpColor) {
            const pdfPen: PdfPen = new PdfPen(this.textMarkUpColor, this.border.width);
            const brush: PdfBrush = new PdfBrush(this.textMarkUpColor);
            let x1: number = 0;
            let y1: number = 0;
            let w1: number = 0;
            let h1: number = 0;
            if (this.boundsCollection.length > 1) {
                for (let i: number = 0; i < this.boundsCollection.length; i++) {
                    const bounds: number[] = [];
                    bounds[0] = this.boundsCollection[Number.parseInt(i.toString(), 10)][0];
                    bounds[1] = this.boundsCollection[Number.parseInt(i.toString(), 10)][1];
                    bounds[2] = this.boundsCollection[Number.parseInt(i.toString(), 10)][2];
                    bounds[3] = this.boundsCollection[Number.parseInt(i.toString(), 10)][3];
                    if (this.textMarkupType === PdfTextMarkupAnnotationType.highlight) {
                        graphics.drawRectangle(bounds[0] - rectangle.x, bounds[1] - rectangle.y, bounds[2], bounds[3], brush);
                    } else if (this.textMarkupType === PdfTextMarkupAnnotationType.underline) {
                        x1 = bounds[0] - rectangle.x;
                        y1 = (bounds[1] - rectangle.y) + (bounds[3] - ((bounds[3] / 2) / 3));
                        w1 = bounds[2] + (bounds[0] - rectangle.x);
                        h1 = (bounds[1] - rectangle.y) + (bounds[3] - ((bounds[3] / 2) / 3));
                        graphics.drawLine(pdfPen, x1, y1, w1, h1);
                    } else if (this.textMarkupType === PdfTextMarkupAnnotationType.strikeOut) {
                        x1 = bounds[0] - rectangle.x;
                        y1 = (bounds[1] - rectangle.y) + (bounds[3] - (bounds[3] / 2));
                        w1 = bounds[2] + (bounds[0] - rectangle.x);
                        h1 = (bounds[1] - rectangle.y) + (bounds[3] - (bounds[3] / 2));
                        graphics.drawLine(pdfPen, x1, y1, w1, h1);
                    } else if (this.textMarkupType === PdfTextMarkupAnnotationType.squiggly) {
                        pdfPen._width = bounds[3] * 0.02;
                        graphics.save();
                        graphics.translateTransform(bounds[0] - rectangle.x, (bounds[1] - rectangle.y));
                        graphics.setClip([0, 0, bounds[2], bounds[3]]);
                        graphics.drawPath(this._drawSquiggly(bounds[2], bounds[3]), pdfPen);
                        graphics.restore();
                    }
                }
            } else {
                if (this.textMarkupType === PdfTextMarkupAnnotationType.highlight) {
                    graphics.drawRectangle(0, 0, width, height, brush);
                } else if (this.textMarkupType === PdfTextMarkupAnnotationType.underline) {
                    graphics.drawLine(pdfPen, 0, height - ((height / 2) / 3), width, height - ((height / 2) / 3));
                } else if (this.textMarkupType === PdfTextMarkupAnnotationType.strikeOut) {
                    graphics.drawLine(pdfPen, 0, height / 2, width, height / 2);
                } else if (this.textMarkupType === PdfTextMarkupAnnotationType.squiggly) {
                    pdfPen._width = height * 0.02;
                    graphics.drawPath(this._drawSquiggly(Math.round(width), Math.round(height)), pdfPen);
                }
                if (this._isLoaded) {
                    this._dictionary.update('Rect', [rectangle.x, rectangle.y, rectangle.x + rectangle.width, rectangle.y + rectangle.height]);
                }
            }
        }
        return template;
    }
    _drawSquiggly(width: number, height: number): PdfPath {
        if (Math.floor(width) % 2 !== 0 || Math.round(width) > width) {
            width = Math.floor(width) + 1;
        }
        const path: PdfPath = new PdfPath();
        const pathPoints: Array<number[]> = new Array<number[]>();
        const pathPointsCount: number = Math.ceil((width / height) * 16);
        const length: number = width / (pathPointsCount / 2);
        const location: number = parseFloat(((length + length) * 0.6).toFixed(2));
        let zigZag: number = location;
        let x: number = 0;
        for (let i: number = 0; i < pathPointsCount; i++) {
            const y: number = ((height - location) + zigZag) - (height * 0.02);
            const temp: number[] = [x, parseFloat(y.toFixed(2))];
            pathPoints.push(temp);
            if (zigZag === 0) {
                zigZag = location;
            } else {
                zigZag = 0;
            }
            x = x + length;
        }
        path._addLines(pathPoints);
        return path;
    }
    _setQuadPoints(pageSize: number[]): void {
        const textQuadLocation: number[] = [];
        const pageHeight: number = pageSize[1];
        let margins: {left: number, top: number, right: number, bottom: number};
        if (this._page && this._page._isNew && this._page._pageSettings && this._page._pageSettings.margins) {
            const margin: PdfMargins = this._page._pageSettings.margins;
            margins = {left: margin.left, top: margin.top, right: margin.right, bottom: margin.bottom};
        } else {
            margins = {left: 0, top: 0, right: 0, bottom: 0};
        }
        this._boundsCollection[0] = [this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height];
        const noofRect: number = this._quadPoints.length / 8;
        const cropOrMediaBox: number[] = this._getMediaOrCropBox(this._page);
        let isContainscropOrMediaBox: boolean = false;
        if (!this._isLoaded && cropOrMediaBox && cropOrMediaBox.length > 3 && !this.flatten) {
            const cropOrMediaBoxX: number = cropOrMediaBox[0];
            const cropOrMediaBoxY: number = cropOrMediaBox[1];
            if (cropOrMediaBoxX !== 0 || cropOrMediaBoxY !== 0) {
                for (let i: number = 0; i < noofRect; i++) {
                    const locationX: number = this._boundsCollection[Number.parseInt(i.toString(), 10)][0] + margins.left + cropOrMediaBoxX;
                    const locationY: number = cropOrMediaBoxY + margins.top;
                    textQuadLocation[0 + (i * 8)] = locationX + margins.left;
                    textQuadLocation[1 + (i * 8)] = (pageHeight - (-locationY)) - margins.top -
                    this._boundsCollection[Number.parseInt(i.toString(), 10)][1];
                    textQuadLocation[2 + (i * 8)] = (locationX + this._boundsCollection[Number.parseInt(i.toString(), 10)][2]) +
                    margins.left;
                    textQuadLocation[3 + (i * 8)] = (pageHeight - (-locationY)) - margins.top -
                    this._boundsCollection[Number.parseInt(i.toString(), 10)][1];
                    textQuadLocation[4 + (i * 8)] = locationX + margins.left;
                    textQuadLocation[5 + (i * 8)] = (textQuadLocation[1 + (i * 8)] -
                    this._boundsCollection[Number.parseInt(i.toString(), 10)][3]);
                    textQuadLocation[6 + (i * 8)] = (locationX + this._boundsCollection[Number.parseInt(i.toString(), 10)][2]) +
                    margins.left;
                    textQuadLocation[7 + (i * 8)] = textQuadLocation[5 + (i * 8)];
                }
                isContainscropOrMediaBox = true;
            }
        }
        if (!isContainscropOrMediaBox) {
            for (let i: number = 0; i < noofRect; i++) {
                const locationX: number = this._boundsCollection[Number.parseInt(i.toString(), 10)][0];
                const locationY: number = this._boundsCollection[Number.parseInt(i.toString(), 10)][1];
                textQuadLocation[0 + (i * 8)] = locationX + margins.left;
                textQuadLocation[1 + (i * 8)] = (pageHeight - locationY) - margins.top;
                textQuadLocation[2 + (i * 8)] = (locationX + this._boundsCollection[Number.parseInt(i.toString(), 10)][2]) + margins.left;
                textQuadLocation[3 + (i * 8)] = (pageHeight - locationY) - margins.top;
                textQuadLocation[4 + (i * 8)] = locationX + margins.left;
                textQuadLocation[5 + (i * 8)] = (textQuadLocation[1 + (i * 8)] -
                this._boundsCollection[Number.parseInt(i.toString(), 10)][3]);
                textQuadLocation[6 + (i * 8)] = (locationX + this._boundsCollection[Number.parseInt(i.toString(), 10)][2]) + margins.left;
                textQuadLocation[7 + (i * 8)] = textQuadLocation[5 + (i * 8)];
            }
        }
        this._points = textQuadLocation;
        this._dictionary.set('QuadPoints', this._points);
    }
}
/**
 * `PdfWatermarkAnnotation` class represents the watermark annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new water mark annotation
 * const annotation: PdfWatermarkAnnotation = new PdfWatermarkAnnotation('Water Mark', 50, 100, 100, 50);
 * // Set the color of the annotation
 * annotation.color = [0, 0, 0];
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfWatermarkAnnotation extends PdfAnnotation {
    _rotateAngle: number;
    _watermarkText: string = '';
    /**
     * Initializes a new instance of the `PdfWatermarkAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfWatermarkAnnotation` class.
     *
     * @param {string} text Text
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new watermark annotation
     * const annotation: PdfWatermarkAnnotation = new PdfWatermarkAnnotation('Water Mark', 50, 100, 100, 50);
     * // Set the color of the annotation
     * annotation.color = [0, 0, 0];
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(text: string, x: number, y: number, width: number, height: number )
    constructor(text?: string, x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Watermark'));
        if (typeof text !== 'undefined') {
            this._watermarkText = text;
            this.text = text;
        }
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        this._type = _PdfAnnotationType.watermarkAnnotation;
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfWatermarkAnnotation {
        const annot: PdfWatermarkAnnotation = new PdfWatermarkAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        if (typeof this.color === 'undefined') {
            this.color = [0, 0, 0];
        }
        this._appearanceTemplate = this._createWatermarkAppearance();
        this._dictionary.update('Rect', _updateBounds(this));
        if (typeof this.opacity !== 'undefined' && this._opacity !== 1.0) {
            this._dictionary.set('CA', this._opacity);
        }
    }
    private _createWatermarkAppearance(): PdfTemplate {
        let font: PdfFont = this._obtainFont();
        if ((typeof font === 'undefined' || font === null) || ((!this._isLoaded || (this._page && this._page._isDuplicate)) && font.size === 1)) {
            font = this._lineCaptionFont;
            this._pdfFont = font;
        }
        this._rotateAngle = this._getRotationAngle();
        if (typeof this.rotationAngle !== 'undefined' && this._rotate !== PdfRotationAngle.angle0 || this._rotateAngle !== PdfRotationAngle.angle0) {
            if (this._rotateAngle === 0) {
                this._rotateAngle = this.rotationAngle * 90;
            }
            this.bounds = this._getRotatedBounds(this.bounds, this._rotateAngle);
        }
        const nativeRectangle: number[] = [0, 0, this.bounds.width, this.bounds.height];
        const appearance: PdfAppearance = new PdfAppearance(this, nativeRectangle);
        appearance.normal = new PdfTemplate(nativeRectangle, this._crossReference);
        const template: PdfTemplate =  appearance.normal;
        _setMatrix(template, this._rotateAngle);
        const graphics: PdfGraphics = appearance.normal.graphics;
        const width: number = this.border.width / 2;
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.top);
        const borderPen: PdfPen = new PdfPen(this.color, width);
        let backBrush: PdfBrush;
        if (this.innerColor) {
            backBrush = new PdfBrush(this._innerColor);
        }
        if (this._isLoaded) {
            if (this._dictionary.has('Contents')) {
                this._watermarkText = this._dictionary.get('Contents');
            }
            this._dictionary.update('Contents', this._watermarkText);
        } else {
            this._dictionary.update('Contents', this._watermarkText);
        }
        if (typeof this._watermarkText !== 'undefined') {
            graphics.drawString(this._watermarkText, font, [0, 0, 0, 0], borderPen, backBrush, format);
        }
        if (this._dictionary.has('AP')) {
            const dictionary: any = this._dictionary.get('AP'); // eslint-disable-line
            if (dictionary && dictionary instanceof _PdfDictionary) {
                _removeDuplicateReference(dictionary, this._crossReference, 'N');
            }
        }
        const dictionary: _PdfDictionary = new _PdfDictionary();
        graphics._template._content.dictionary._updated = true;
        const reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, graphics._template._content);
        graphics._template._content.reference = reference;
        dictionary.set('N', reference);
        dictionary._updated = true;
        this._dictionary.set('AP', dictionary);
        return template;
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._isLoaded) {
            if (!isFlatten) {
                this._appearanceTemplate = this._createWatermarkAppearance();
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    if (appearanceStream) {
                        const reference: _PdfReference = dictionary.getRaw('N');
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess();
            if (!this._appearanceTemplate) {
                if (isFlatten) {
                    if (!this._dictionary.has('AP')) {
                        this._appearanceTemplate = this._createWatermarkAppearance();
                    } else {
                        const dictionary: _PdfDictionary = this._dictionary.get('AP');
                        if (dictionary && dictionary.has('N')) {
                            const appearanceStream: _PdfBaseStream = dictionary.get('N');
                            if (appearanceStream) {
                                const reference: _PdfReference = dictionary.getRaw('N');
                                if (reference) {
                                    appearanceStream.reference = reference;
                                }
                                this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                            }
                        }
                    }
                }
            }
        }
        if (isFlatten && this._appearanceTemplate) {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            if (!this._appearanceTemplate._content.dictionary.has('Matrix')) {
                const box: number[] = this._appearanceTemplate._content.dictionary.getArray('BBox');
                if (box) {
                    this._appearanceTemplate._content.dictionary.update('Matrix', [1, 0, 0, 1, -box[0], -box[1]]);
                }
            }
            this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
        }
    }
}
/**
 * `PdfRubberStampAnnotation` class represents the rubber stamp annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new rubber stamp annotation
 * const annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation (50, 100, 100, 50);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfRubberStampAnnotation extends PdfComment {
    _icon: PdfRubberStampAnnotationIcon = PdfRubberStampAnnotationIcon.draft;
    private _stampWidth: number = 0;
    private _iconString: string = '';
    private rotateAngle: number = 0;
    _alterRotateBounds: boolean = true;
    _stampAppearanceFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 20, PdfFontStyle.italic | PdfFontStyle.bold);
    _appearance: PdfAppearance;
    /**
     * Initializes a new instance of the `PdfRubberStampAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfRubberStampAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new rubber stamp annotation
     * const annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation (50, 100, 100, 50);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number)
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Stamp'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = { x, y, width, height };
        }
        this._type = _PdfAnnotationType.rubberStampAnnotation;
    }
    /**
     * Gets the icon type of the rubber stamp annotation.
     *
     * @returns {PdfRubberStampAnnotationIcon} Annotation icon.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRubberStampAnnotation = page.annotations.at(0) as PdfRubberStampAnnotation;
     * // Gets the icon type of the rubber stamp annotation.
     * let icon: PdfRubberStampAnnotationIcon = annotation.icon;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get icon(): PdfRubberStampAnnotationIcon {
        if (this._dictionary.has('Name')) {
            this._icon = _mapRubberStampIcon(this._dictionary.get('Name').name);
        }
        return this._icon;
    }
    /**
     * Sets the icon type of the rubber stamp annotation.
     *
     * @param {PdfRubberStampAnnotationIcon} value Annotation icon.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRubberStampAnnotation = page.annotations.at(0) as PdfRubberStampAnnotation;
     * // Sets the icon type of the rubber stamp annotation.
     * annotation.icon = PdfRubberStampAnnotationIcon.completed;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set icon(value: PdfRubberStampAnnotationIcon) {
        if (typeof value !== 'undefined') {
            this._icon = value;
            this._dictionary.update('Name', _PdfName.get('#' + this._obtainIconName(this._icon)));
        }
    }
    /**
     * Get the appearance of the rubber stamp annotation. (Read only)
     *
     * @returns {PdfAppearance} Returns the appearance of the annotation.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new rubber stamp annotation
     * const annotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(50, 100, 100, 50);
     * // Get the appearance of the annotation
     * let appearance: PdfAppearance = annotation.appearance;
     * // Access the normal template of the appearance
     * let template: PdfTemplate = appearance.normal;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Draw the image as the custom appearance for the annotation
     * template.graphics.drawImage(image, 0, 0, 100, 50);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get appearance(): PdfAppearance {
        if (this._isLoaded) {
            return null;
        }
        if (typeof this._appearance === 'undefined') {
            const nativeRectangle: number[] = [0, 0, this.bounds.width, this.bounds.height];
            this._appearance = new PdfAppearance(this, nativeRectangle);
            this._appearance.normal = new PdfTemplate(nativeRectangle, this._crossReference);
        }
        return this._appearance;
    }
    /**
     * Create an appearance template for a rubber stamp annotation.
     *
     * @returns {PdfTemplate} Returns the appearance template of the annotation.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRubberStampAnnotation = page.annotations.at(0) as PdfRubberStampAnnotation;
     * // Gets the appearance template of the annotation.
     * let template: PdfTemplate = annotation.createTemplate();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    createTemplate(): PdfTemplate {
        let template: PdfTemplate;
        if (this._isLoaded) {
            if (this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    if (appearanceStream) {
                        template = new PdfTemplate();
                        template._isExported = true;
                        const templateDictionary: _PdfDictionary = appearanceStream.dictionary;
                        const matrix: number[] = templateDictionary.getArray('Matrix');
                        const bounds: number[] = templateDictionary.getArray('BBox');
                        if (matrix) {
                            const mMatrix: number[] = [];
                            for (let i: number = 0; i < matrix.length; i++) {
                                const value: number = matrix[Number.parseInt(i.toString(), 10)];
                                mMatrix[Number.parseInt(i.toString(), 10)] = value;
                            }
                            if (bounds && bounds.length > 3) {
                                const rect: { x: number, y: number, width: number, height: number } = _toRectangle(bounds);
                                const rectangle: number[] = this._transformBBox({x: bounds[0], y: bounds[1],
                                    width: bounds[2], height: bounds[3]}, mMatrix);
                                template._size = [rectangle[2], rectangle[3]];
                                template._templateOriginalSize = [rect.width, rect.height];
                            }
                        } else if (bounds) {
                            templateDictionary.update('Matrix', [1, 0, 0, 1, -bounds[0], -bounds[1]]);
                            template._size = [bounds[2], bounds[3]];
                        }
                        template._exportStream(dictionary, this._crossReference);
                    }
                }
            } else {
                template = this._createRubberStampAppearance();
            }
        }
        return template;
    }
    get _innerTemplateBounds(): {x: number, y: number, width: number, height: number} {
        let innerBounds: {x: number, y: number, width: number, height: number};
        if (this._isLoaded) {
            innerBounds = this._obtainInnerBounds();
            innerBounds.x = this.bounds.x;
            innerBounds.y = this.bounds.y;
        }
        return innerBounds;
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfRubberStampAnnotation {
        const annot: PdfRubberStampAnnotation = new PdfRubberStampAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(): void {
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        if (!this._dictionary.has('C')) {
            this._isTransparentColor = true;
        }
        if (this._dictionary.has('AP') && this._isLoaded && !this._isRotated) {
            this._parseStampAppearance();
        } else {
            this._appearanceTemplate = this._createRubberStampAppearance();
        }
    }
    _transformBBox(bBoxValue: { x: number, y: number, width: number, height: number }, matrix: number[]): number[] {
        const xCoordinate: number[] = [];
        const yCoordinate: number[] = [];
        const point1: number[] = this._transformPoint(bBoxValue.x, bBoxValue.height, matrix);
        xCoordinate[0] = point1[0];
        yCoordinate[0] = point1[1];
        const point2: number[] = this._transformPoint(bBoxValue.width, bBoxValue.y, matrix);
        xCoordinate[1] = point2[0];
        yCoordinate[1] = point2[1];
        const point3: number[] = this._transformPoint(bBoxValue.x, bBoxValue.y, matrix);
        xCoordinate[2] = point3[0];
        yCoordinate[2] = point3[1];
        const point4: number[] = this._transformPoint(bBoxValue.width, bBoxValue.height, matrix);
        xCoordinate[3] = point4[0];
        yCoordinate[3] = point4[1];
        const rect: number[] = [this._minValue(xCoordinate), this._minValue(yCoordinate),
            this._maxValue(xCoordinate), this._maxValue(yCoordinate)];
        return rect;
    }
    _transformPoint(x: number, y: number, matrix: number[]): number[] {
        const point: number[] = [];
        point[0] = x * matrix[0] + y * matrix[2] + matrix[4];
        point[1] = x * matrix[1] + y * matrix[3] + matrix[5];
        return point;
    }
    _minValue(values: number[]): number {
        let minimum: number = values[0];
        for (let i: number = 1; i < values.length; i++) {
            if (values[Number.parseInt(i.toString(), 10)] < minimum) {
                minimum = values[Number.parseInt(i.toString(), 10)];
            }
        }
        return minimum;
    }
    _maxValue(values: number[]): number {
        let maximum: number = values[0];
        for (let i: number = 1; i < values.length; i++) {
            if (values[Number.parseInt(i.toString(), 10)] > maximum) {
                maximum = values[Number.parseInt(i.toString(), 10)];
            }
        }
        return maximum;
    }
    _doPostProcess(isFlatten: boolean = false): void {
        let isTransformBBox: boolean = false;
        if (this._isLoaded && (this._setAppearance || isFlatten || this._isExport)) {
            if ((!isFlatten && !this._isExport) || this._setAppearance) {
                this._appearanceTemplate = this._createRubberStampAppearance();
            }
            if (!this._appearanceTemplate && (this._isExport || isFlatten) && this._dictionary.has('AP')) {
                isTransformBBox = this._parseStampAppearance();
            }
        } else {
            if (!(this._isImported && this._dictionary.has('AP'))) {
                this._postProcess();
            }
            if ((!this._appearanceTemplate) && (isFlatten || this._isImported)) {
                if (!this._dictionary.has('AP')) {
                    this._appearanceTemplate = this._createRubberStampAppearance();
                } else {
                    const dictionary: _PdfDictionary = this._dictionary.get('AP');
                    if (dictionary && dictionary.has('N')) {
                        const appearanceStream: _PdfBaseStream = dictionary.get('N');
                        if (appearanceStream) {
                            const reference: _PdfReference = dictionary.getRaw('N');
                            if (reference) {
                                appearanceStream.reference = reference;
                            }
                            this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            } else {
                this._flattenPopUp();
            }
        }
        if (isFlatten && this._appearanceTemplate) {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            if (!this._appearanceTemplate._content.dictionary.has('Matrix')) {
                const box: number[] = this._appearanceTemplate._content.dictionary.getArray('BBox');
                if (box) {
                    this._appearanceTemplate._content.dictionary.update('Matrix', [1, 0, 0, 1, -box[0], -box[1]]);
                }
            }
            if (isTransformBBox) {
                this._flattenAnnotationTemplate(this._appearanceTemplate, isTransformBBox);
            } else {
                this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
            }
        }
    }
    _parseStampAppearance(): boolean {
        let isTransformBBox: boolean = false;
        const dictionary: _PdfDictionary = this._dictionary.get('AP');
        if (dictionary && dictionary.has('N')) {
            const appearanceStream: _PdfBaseStream = dictionary.get('N');
            if (appearanceStream) {
                const reference: _PdfReference = dictionary.getRaw('N');
                if (reference) {
                    appearanceStream.reference = reference;
                }
                let isStamp: boolean = false;
                if (this._type === _PdfAnnotationType.rubberStampAnnotation) {
                    let isRotated: boolean = false;
                    let size: number[];
                    let rect: { x: number, y: number, width: number, height: number };
                    if (appearanceStream) {
                        isRotated = (this._page.rotation === PdfRotationAngle.angle0 &&
                                    this.rotationAngle === PdfRotationAngle.angle0);
                        if (!isRotated) {
                            isRotated = (this._page.rotation !== PdfRotationAngle.angle0 &&
                                    this.rotationAngle === PdfRotationAngle.angle0);
                        }
                    }
                    this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    isStamp = true;
                    isTransformBBox = isRotated ? true : false;
                    if (isTransformBBox) {
                        const matrix: number[] = appearanceStream.dictionary.getArray('Matrix');
                        if (matrix) {
                            const mMatrix: number[] = [];
                            for (let i: number = 0; i < matrix.length; i++) {
                                const value: number = matrix[Number.parseInt(i.toString(), 10)];
                                mMatrix[Number.parseInt(i.toString(), 10)] = value;
                            }
                            const bounds: number[] = appearanceStream.dictionary.getArray('BBox');
                            if (bounds && bounds.length > 3) {
                                rect = _toRectangle(bounds);
                                const rectangle: number[] = this._transformBBox(rect, mMatrix);
                                size = [rectangle[2], rectangle[3]];
                                this._appearanceTemplate._size = size;
                            } else {
                                size = [rect.width, rect.height];
                            }
                        }
                    } else if (rect) {
                        size = [rect.width, rect.height];
                    }
                }
                if (!isStamp) {
                    this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                }
            }
        }
        return isTransformBBox;
    }
    _createRubberStampAppearance(): PdfTemplate {
        const nativeRectangle: number[] = [0, 0, this.bounds.width, this.bounds.height];
        let appearance: PdfAppearance;
        if (this._appearance) {
            appearance = this._appearance;
            if (!this._dictionary.has('Name')) {
                this._dictionary.update('Name', _PdfName.get('#23CustomStamp'));
            }
        } else {
            this._iconString = this._obtainIconName(this.icon);
            this._dictionary.update('Name', _PdfName.get('#23' + this._iconString));
            appearance = new PdfAppearance(this, nativeRectangle);
            appearance.normal = new PdfTemplate(nativeRectangle, this._crossReference);
        }
        const template: PdfTemplate =  appearance.normal;
        if (this._alterRotateBounds && typeof this._rotate !== 'undefined' && (this._rotate !== PdfRotationAngle.angle0 || this._getRotationAngle() !== 0)) {
            this.rotateAngle = this._getRotationAngle();
            if (this.rotateAngle === 0) {
                this.rotateAngle = this.rotationAngle * 90;
            }
            this.bounds = this._getRotatedBounds(this.bounds, this.rotateAngle);
        } else {
            this.rotateAngle = this._getRotationAngle();
        }
        _setMatrix(template, this.rotateAngle);
        if (!this._appearance) {
            this._drawStampAppearance(template);
        }
        if (this._dictionary.has('AP')) {
            _removeDuplicateReference(this._dictionary.get('AP'), this._crossReference, 'N');
        }
        const dictionary: _PdfDictionary = new _PdfDictionary();
        template._content.dictionary._updated = true;
        const reference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(reference, template._content);
        template._content.reference = reference;
        dictionary.set('N', reference);
        dictionary._updated = true;
        this._dictionary.set('AP', dictionary);
        this._dictionary.set('Border', [this.border.hRadius, this.border.vRadius, this.border.width]);
        this._dictionary.update('Rect', _updateBounds(this));
        return template;
    }
    _drawStampAppearance(template: PdfTemplate): void {
        const stringFormat: PdfStringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.center;
        stringFormat.lineAlignment = PdfVerticalAlignment.middle;
        const backBrush: PdfBrush = new PdfBrush(this._obtainBackGroundColor());
        const borderPen: PdfPen = new PdfPen(this._obtainBorderColor(), this.border.width);
        const graphics: PdfGraphics = template.graphics;
        graphics.save();
        graphics.scaleTransform(template._size[0] / (this._stampWidth + 4), (template._size[1] / 28));
        const rubberFont: PdfStandardFont = this._stampAppearanceFont;
        this._drawRubberStamp(graphics, borderPen, backBrush, rubberFont, stringFormat);
        graphics.restore();
    }
    _obtainIconName(icon: PdfRubberStampAnnotationIcon): string {
        switch (icon) {
        case PdfRubberStampAnnotationIcon.approved:
            this._iconString = 'Approved';
            this._stampWidth = 126;
            break;
        case PdfRubberStampAnnotationIcon.asIs:
            this._iconString = 'AsIs';
            this._stampWidth = 75;
            break;
        case PdfRubberStampAnnotationIcon.confidential:
            this._iconString = 'Confidential';
            this._stampWidth = 166;
            break;
        case PdfRubberStampAnnotationIcon.departmental:
            this._iconString = 'Departmental';
            this._stampWidth = 186;
            break;
        case PdfRubberStampAnnotationIcon.draft:
            this._iconString = 'Draft';
            this._stampWidth = 90;
            break;
        case PdfRubberStampAnnotationIcon.experimental:
            this._iconString = 'Experimental';
            this._stampWidth = 176;
            break;
        case PdfRubberStampAnnotationIcon.expired:
            this._iconString = 'Expired';
            this._stampWidth = 116;
            break;
        case PdfRubberStampAnnotationIcon.final:
            this._iconString = 'Final';
            this._stampWidth = 90;
            break;
        case PdfRubberStampAnnotationIcon.forComment:
            this._iconString = 'ForComment';
            this._stampWidth = 166;
            break;
        case PdfRubberStampAnnotationIcon.forPublicRelease:
            this._iconString = 'ForPublicRelease';
            this._stampWidth = 240;
            break;
        case PdfRubberStampAnnotationIcon.notApproved:
            this._iconString = 'NotApproved';
            this._stampWidth = 186;
            break;
        case PdfRubberStampAnnotationIcon.notForPublicRelease:
            this._iconString = 'NotForPublicRelease';
            this._stampWidth = 290;
            break;
        case PdfRubberStampAnnotationIcon.sold:
            this._iconString = 'Sold';
            this._stampWidth = 75;
            break;
        case PdfRubberStampAnnotationIcon.topSecret:
            this._iconString = 'TopSecret';
            this._stampWidth = 146;
            break;
        case PdfRubberStampAnnotationIcon.completed:
            this._iconString = 'Completed';
            this._stampWidth = 136;
            break;
        case PdfRubberStampAnnotationIcon.void:
            this._iconString = 'Void';
            this._stampWidth = 75;
            break;
        case PdfRubberStampAnnotationIcon.informationOnly:
            this._iconString = 'InformationOnly';
            this._stampWidth = 230;
            break;
        case PdfRubberStampAnnotationIcon.preliminaryResults:
            this._iconString = 'PreliminaryResults';
            this._stampWidth = 260;
            break;
        }
        return this._iconString;
    }
    _obtainBackGroundColor(): number[] {
        let color: number[] = [];
        let red: number;
        let green: number;
        let blue: number;
        if (this._icon === PdfRubberStampAnnotationIcon.notApproved ||
            this._icon === PdfRubberStampAnnotationIcon.void) {
            red = 251;
            green = 222;
            blue = 221;
            color = [red, green, blue];
        } else if (this._icon === PdfRubberStampAnnotationIcon.approved ||
            this._icon === PdfRubberStampAnnotationIcon.final ||
            this._icon === PdfRubberStampAnnotationIcon.completed) {
            red = 229;
            green = 238;
            blue = 222;
            color = [red, green, blue];
        } else {
            red = 219;
            green = 227;
            blue = 240;
            color = [red, green, blue];
        }
        return color;
    }
    _obtainBorderColor(): number[] {
        let color: number[] = [];
        let red: number;
        let green: number;
        let blue: number;
        if (this._icon === PdfRubberStampAnnotationIcon.notApproved ||
            this._icon === PdfRubberStampAnnotationIcon.void) {
            red = 151;
            green = 23;
            blue = 15;
            color = [red, green, blue];
        } else if (this._icon === PdfRubberStampAnnotationIcon.approved ||
                    this._icon === PdfRubberStampAnnotationIcon.final ||
                    this._icon === PdfRubberStampAnnotationIcon.completed) {
            red = 73;
            green = 110;
            blue = 38;
            color = [red, green, blue];
        } else {
            red = 24;
            green = 37;
            blue = 100;
            color = [red, green, blue];
        }
        return color;
    }
    _drawRubberStamp(graphics: PdfGraphics, pen: PdfPen, brush: PdfBrush, font: PdfStandardFont, format: PdfStringFormat): void {
        graphics.drawRoundedRectangle(2, 1, this._stampWidth, 26, 3, pen, brush);
        const pdfBrush: PdfBrush = new PdfBrush(this._obtainBorderColor());
        graphics.drawString(this._iconString.toUpperCase(), font, [(this._stampWidth / 2) + 1, 15, 0, 0], null, pdfBrush, format);
    }
    _obtainInnerBounds(): {x: number, y: number, width: number, height: number} {
        let bounds: {x: number, y: number, width: number, height: number} = {x: 0, y: 0, width: 0, height: 0};
        if (this._dictionary && this._dictionary.has('AP')) {
            const appearanceDictionary: _PdfDictionary = this._dictionary.get('AP');
            if (appearanceDictionary && appearanceDictionary.has('N')) {
                const normalAppearance: _PdfStream = appearanceDictionary.get('N');
                if (normalAppearance && typeof normalAppearance.dictionary !== 'undefined') {
                    const normalAppearanceDictionary: _PdfDictionary = normalAppearance.dictionary;
                    if (normalAppearanceDictionary.has('BBox')) {
                        const values: number[] = normalAppearanceDictionary.getArray('BBox');
                        if (values && values.length === 4) {
                            bounds = _toRectangle(values);
                        }
                    }
                }
            }
        }
        return bounds;
    }
}
/**
 * `PdfSoundAnnotation` class represents the sound annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfSoundAnnotation = page.annotations.at(0) as PdfSoundAnnotation;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfSoundAnnotation extends PdfComment {
    /**
     * Initializes a new instance of the `PdfSoundAnnotation` class.
     *
     * @private
     */
    constructor() {
        super();
        this._type = _PdfAnnotationType.soundAnnotation;
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfSoundAnnotation {
        const annot: PdfSoundAnnotation = new PdfSoundAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (isFlatten) {
            let appearanceStream: _PdfBaseStream;
            if (this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    appearanceStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (reference && appearanceStream) {
                        appearanceStream.reference = reference;
                    }
                }
            }
            if (appearanceStream) {
                const template: PdfTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                const isNormalMatrix: boolean = this._validateTemplateMatrix(template._content.dictionary);
                this._flattenAnnotationTemplate(template, isNormalMatrix);
            } else {
                this._removeAnnotation(this._page, this);
            }
        }
    }
}
/**
 * `PdfFreeTextAnnotation` class represents the free text annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new free text annotation
 * const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(50, 100, 100, 50);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfFreeTextAnnotation extends PdfComment {
    _calloutLines: Array<number[]>;
    _calloutsClone: Array<number[]>;
    _rcText: string;
    _textMarkUpColor: number[];
    _font: PdfFont;
    _textColor: number[];
    _borderColor: number[];
    _intentString: string = '';
    _markUpFont: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 7, PdfFontStyle.regular);
    private _annotationIntent: PdfAnnotationIntent;
    private _lineEndingStyle: PdfLineEndingStyle;
    private _textAlignment: PdfTextAlignment = PdfTextAlignment.left;
    private _cropBoxValueX: number = 0;
    private _cropBoxValueY: number = 0;
    private _paddings: _PdfPaddings;
    /**
     * Initializes a new instance of the `PdfFreeTextAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfFreeTextAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new free text annotation
     * const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(50, 100, 100, 50);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number )
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('FreeText'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        this._type = _PdfAnnotationType.freeTextAnnotation;
    }
    /**
     * Gets the callout lines of the free text annotation.
     *
     * @returns {Array<number[]>} Callout lines.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation= page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Gets the callout lines of the free text annotation.
     * let calloutLines: Array<number[]> = annotation.calloutLines;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get calloutLines(): Array<number[]> {
        if (typeof this._calloutLines === 'undefined') {
            this._calloutLines = this._getCalloutLinePoints();
        }
        return this._calloutLines;
    }
    /**
     * Sets the callout lines of the free text annotation.
     *
     * @param {Array<number[]>} value Callout lines.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Sets the callout lines of the free text annotation.
     * annotation.calloutLines = [[100, 450], [100, 200], [100, 150]];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set calloutLines(value: Array<number[]>) {
        if (!this._isLoaded) {
            this._calloutLines = value;
        }
        let isChanged: boolean = false;
        if (this._isLoaded && value.length >= 2) {
            if (this._calloutLines.length === value.length) {
                for (let i: number = 0; i < value.length; i++) {
                    const values: number[] = value[Number.parseInt(i.toString(), 10)];
                    for (let j: number = 0; j < values.length; j++) {
                        if (value[Number.parseInt(i.toString(), 10)][Number.parseInt(j.toString(), 10)] !==
                            this._calloutLines[Number.parseInt(i.toString(), 10)][Number.parseInt(j.toString(), 10)]) {
                            isChanged = true;
                            break;
                        }
                    }
                }
            }
            else {
                isChanged = true;
            }
        }
        if (isChanged) {
            const pageHeight: number = this._page.size[1];
            const lines: Array<number> = [];
            for (let i: number = 0; i < value.length; i++) {
                if (i < value.length) {
                    lines.push(value[Number.parseInt(i.toString(), 10)][0] + this._cropBoxValueX);
                    lines.push((pageHeight + this._cropBoxValueY) - value[Number.parseInt(i.toString(), 10)][1]);
                } else {
                    break;
                }
            }
            this._calloutLines = value;
            this._dictionary.update('CL', lines);
        }
    }
    /**
     * Gets the line ending style of the annotation.
     *
     * @returns {PdfLineEndingStyle} Line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Gets the Line ending style of the annotation.
     * let lineEndingStyle: PdfLineEndingStyle = annotation.lineEndingStyle;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get lineEndingStyle(): PdfLineEndingStyle  {
        if (this._isLoaded) {
            this._lineEndingStyle = this._obtainLineEndingStyle();
        } else if (typeof this._lineEndingStyle === 'undefined') {
            this._lineEndingStyle = PdfLineEndingStyle.none;
        }
        return this._lineEndingStyle;
    }
    /**
     * Sets the line ending style of the line annotation.
     *
     * @param {PdfLineEndingStyle} value Line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Sets the line ending style of the line annotation.
     * annotation.lineEndingStyle = PdfLineEndingStyle.closedArrow;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set lineEndingStyle(value: PdfLineEndingStyle) {
        if (typeof value !== 'undefined') {
            this._dictionary.update('LE', _PdfName.get(_reverseMapEndingStyle(value)));
        }
        this._lineEndingStyle = value;
    }
    /**
     * Gets the text markup color of the annotation.
     *
     * @returns {number[]} Text markup color as R, G, B color array in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Gets the text markup color of the annotation.
     * let textMarkUpColor: number[] = annotation.textMarkUpColor;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textMarkUpColor(): number[] {
        if (typeof this._textMarkUpColor === 'undefined') {
            let color: string;
            if (this._dictionary.has('TextColor')) {
                this._textMarkUpColor = _parseColor(this._dictionary.getArray('TextColor'));
                return this._textMarkUpColor;
            }
            if (this._dictionary.has('DS')) {
                const collections: string[] = this._dictionary.get('DS').split(';');
                for (let i: number = 0; i < collections.length; i++) {
                    if (collections[Number.parseInt(i.toString(), 10)].indexOf('color') !== -1) {
                        color = collections[Number.parseInt(i.toString(), 10)].split(':')[1];
                        if (color.startsWith('#')) {
                            color = color.substring(1);
                        }
                        this._textMarkUpColor = _convertToColor(color);
                        return this._textMarkUpColor;
                    }
                }
            }
            if (!this._textMarkUpColor && this._dictionary.has('RC')) {
                //Need to code
            }
        }
        return this._textMarkUpColor;
    }
    /**
     * Sets the text markup color of the annotation.
     *
     * @param {number[]} value R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Sets the text markup color of the annotation.
     * annotation.textMarkUpColor = [200, 200, 200];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textMarkUpColor(value: number[]) {
        if (typeof value !== 'undefined' && value.length === 3) {
            this._textMarkUpColor = value;
            this._updateStyle(this.font, value, this.textAlignment);
        }
    }
    /**
     * Gets the text alignment of the annotation.
     *
     * @returns {PdfTextAlignment} Text alignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Gets the text alignment of the annotation.
     * let textAlignment: PdfTextAlignment = annotation.textAlignment;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textAlignment(): PdfTextAlignment {
        if (this._dictionary.has('Q')) {
            this._textAlignment = this._dictionary.get('Q');
        }
        return this._textAlignment;
    }
    /**
     * Sets the text alignment of the annotation.
     *
     * @param {PdfTextAlignment} value Text alignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Sets the text alignment of the annotation.
     * annotation.textAlignment = PdfTextAlignment.justify;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textAlignment(value: PdfTextAlignment) {
        if (this._textAlignment !== value) {
            this._dictionary.update('Q', value as number);
        }
        this._textAlignment = value;
    }
    /**
     * Gets the font of the annotation.
     *
     * @returns {PdfFont} font.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Gets the font of the annotation.
     * let font: PdfFont = annotation.font;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get font(): PdfFont {
        if (!this._font) {
            this._font = this._obtainFont();
            if ((this._font === null || typeof this._font === 'undefined') || (!this._isLoaded && this._font.size === 1)) {
                this._font = this._markUpFont;
            }
        }
        return this._font;
    }
    /**
     * Sets the font of the annotation.
     *
     * @param {PdfFont} value font.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Sets the font of the annotation.
     * annotation.font = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set font(value: PdfFont) {
        this._font = value;
    }
    /**
     * Gets the border color of the annotation.
     *
     * @returns {number[]} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Gets the border color of the annotation.
     * let borderColor: number[] = annotation.borderColor;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get borderColor(): number[] {
        if (typeof this._borderColor === 'undefined' && this._dictionary.has('DA')) {
            this._borderColor = this._obtainColor();
        }
        return this._borderColor;
    }
    /**
     * Sets the border color of the annotation.
     *
     * @param {number[]} value R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Sets the border color of the annotation.
     * annotation.borderColor = [150, 150, 150];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set borderColor(value: number[]) {
        if (typeof value !== 'undefined' && value.length === 3) {
            this._borderColor = value;
            this._dictionary.update('DA', this._getBorderColorString(this.borderColor));
        }
    }
    /**
     * Gets the intent of the annotation.
     *
     * @returns {PdfAnnotationIntent} Annotation intent.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Gets the intent of the annotation.
     * let annotationIntent: PdfAnnotationIntent = annotation.annotationIntent;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get annotationIntent(): PdfAnnotationIntent {
        if (this._dictionary.has('IT')) {
            this._annotationIntent = _mapAnnotationIntent(this._dictionary.get('IT').name);
        } else {
            this._annotationIntent = PdfAnnotationIntent.none;
        }
        return this._annotationIntent;
    }
    /**
     * Sets the intent of the annotation.
     *
     * @param {PdfAnnotationIntent} value Annotation intent.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) as PdfFreeTextAnnotation;
     * // Sets the intent of the annotation.
     * annotation.annotationIntent = PdfAnnotationIntent.freeTextTypeWriter;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set annotationIntent(value: PdfAnnotationIntent) {
        if (typeof value !== 'undefined') {
            this._annotationIntent = value;
            if (value === PdfAnnotationIntent.none) {
                this._dictionary.update('Subj', 'Text Box');
            } else {
                this._dictionary.update('IT', _PdfName.get(this._obtainAnnotationIntent(this._annotationIntent)));
            }
        }
    }
    get _mkDictionary(): _PdfDictionary {
        let value: _PdfDictionary;
        if (this._dictionary.has('MK')) {
            value = this._dictionary.get('MK');
        }
        return value;
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfFreeTextAnnotation {
        const annot: PdfFreeTextAnnotation = new PdfFreeTextAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _setPaddings(paddings: _PdfPaddings): void {
        this._paddings = paddings;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(isFlatten: boolean): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        if (!this._dictionary.has('C')) {
            this._isTransparentColor = true;
        }
        const cropOrMediaBox: number[] = this._getCropOrMediaBox();
        if (cropOrMediaBox && cropOrMediaBox.length > 3 && typeof cropOrMediaBox[0] === 'number' && typeof cropOrMediaBox[1] === 'number' && (cropOrMediaBox[0] !== 0 || cropOrMediaBox[1] !== 0)) {
            this._cropBoxValueX = cropOrMediaBox[0] as number;
            this._cropBoxValueY = cropOrMediaBox[1] as number;
        }
        if (isFlatten || this._setAppearance) {
            this._appearanceTemplate = this._createAppearance();
        }
        if (!isFlatten) {
            this._dictionary.update('Rect', _updateBounds(this));
            this._saveFreeTextDictionary();
        }
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (this._isLoaded) {
            if (this._setAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                this._appearanceTemplate = this._createAppearance();
            }
            if (!this._appearanceTemplate && isFlatten && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    const appearanceStream: _PdfBaseStream = dictionary.get('N');
                    if (appearanceStream) {
                        const reference: _PdfReference = dictionary.getRaw('N');
                        if (reference) {
                            appearanceStream.reference = reference;
                        }
                        this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    }
                }
            }
        } else {
            this._postProcess(isFlatten);
            if (!this._appearanceTemplate && isFlatten) {
                if (!this._dictionary.has('AP')) {
                    this._appearanceTemplate = this._createAppearance();
                } else {
                    const dictionary: _PdfDictionary = this._dictionary.get('AP');
                    if (dictionary && dictionary.has('N')) {
                        const appearanceStream: _PdfBaseStream = dictionary.get('N');
                        if (appearanceStream) {
                            const reference: _PdfReference = dictionary.getRaw('N');
                            if (reference) {
                                appearanceStream.reference = reference;
                            }
                            this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                        }
                    }
                }
            }
        }
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups) {
            if (this._isLoaded) {
                this._flattenLoadedPopUp();
            } else {
                this._flattenPopUp();
            }
        }
        if (isFlatten && this._appearanceTemplate) {
            const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
            if (!this._appearanceTemplate._content.dictionary.has('Matrix') && !this._isLoaded) {
                const box: number[] = this._appearanceTemplate._content.dictionary.getArray('BBox');
                if (box) {
                    this._appearanceTemplate._content.dictionary.update('Matrix', [1, 0, 0, 1, -box[0], -box[1]]);
                }
            }
            if (isNormalMatrix && typeof this._page.rotation !== 'undefined' && this._page.rotation !== PdfRotationAngle.angle0) {
                this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
            } else if (this._appearanceTemplate && !this._dictionary.has('AP')) {
                this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
            } else if (this._dictionary.has('AP')) {
                if (this._isValidTemplateMatrix(this._appearanceTemplate._content.dictionary, this.bounds, this._appearanceTemplate)) {
                    this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
                }
            }
        }
        if (!isFlatten && this._setAppearance) {
            let appearance: _PdfDictionary;
            if (this._dictionary.has('AP')) {
                appearance = this._dictionary.get('AP');
            } else {
                const reference: _PdfReference = this._crossReference._getNextReference();
                appearance = new _PdfDictionary(this._crossReference);
                this._crossReference._cacheMap.set(reference, appearance);
                this._dictionary.update('AP', reference);
            }
            _removeDuplicateReference(appearance, this._crossReference, 'N');
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._appearanceTemplate._content);
            appearance.update('N', reference);
        }
    }
    _isValidTemplateMatrix(dictionary: _PdfDictionary, bounds: {x: number, y: number, width: number, height: number},
                           appearanceTemplate: PdfTemplate): boolean {
        let isValidMatrix: boolean = true;
        const pointF: {x: number, y: number, width: number, height: number} = bounds;
        if (dictionary && dictionary.has('Matrix')) {
            const box: number[] = dictionary.getArray('BBox');
            const matrix: number[] = dictionary.getArray('Matrix');
            if (matrix && box && matrix.length > 3 && box.length > 2) {
                if (typeof matrix[0] !== 'undefined' &&
                    typeof matrix[1] !== 'undefined' &&
                    typeof matrix[2] !== 'undefined' &&
                    typeof matrix[3] !== 'undefined') {
                    if (matrix[0] === 1 && matrix[1] === 0 && matrix[2] === 0 && matrix[3] === 1) {
                        if (typeof box[0] !== 'undefined' &&
                            typeof box[1] !== 'undefined' &&
                            typeof box[2] !== 'undefined' &&
                            typeof box[3] !== 'undefined') {
                            if (Math.round(box[0]) !== Math.round(-(matrix[4])) && Math.round(box[1]) !== Math.round(-(matrix[5])) ||
                                box[0] === 0 && Math.round(-(matrix[4])) === 0) {
                                const graphics: PdfGraphics = this._page.graphics;
                                const state: PdfGraphicsState = graphics.save();
                                if (typeof this.opacity !== 'undefined' && this._opacity < 1) {
                                    graphics.setTransparency(this._opacity);
                                }
                                pointF.x -= box[0];
                                pointF.y += box[1];
                                graphics.drawTemplate(appearanceTemplate, pointF);
                                graphics.restore(state);
                                this._page.annotations.remove(this);
                                isValidMatrix = false;
                            }
                        }
                    }
                }
            }
        }
        return isValidMatrix;
    }
    _createAppearance(): PdfTemplate {
        let template: PdfTemplate;
        const borderWidth: number = this.border.width / 2;
        const nativeRectangle: number[] = this._obtainAppearanceBounds();
        const rotationAngle: number = this.rotate;
        if (rotationAngle === 0 || rotationAngle === 90 || rotationAngle === 180 || rotationAngle === 270) {
            this._isAllRotation = false;
        }
        if (rotationAngle > 0 && this._isAllRotation) {
            template = new PdfTemplate([0, 0, nativeRectangle[2], nativeRectangle[3]], this._crossReference);
        } else {
            template = new PdfTemplate(nativeRectangle, this._crossReference);
        }
        const box: number[] = template._content.dictionary.getArray('BBox');
        const angle: PdfRotationAngle = this._getRotationAngle();
        if (box && angle !== null && typeof angle !== 'undefined') {
            template._content.dictionary.set('Matrix', [1, 0, 0, 1, -box[0], -box[1]]);
        }
        const parameter: _PaintParameter = new _PaintParameter();
        const text: string = this._obtainText();
        template._writeTransformation = false;
        const graphics: PdfGraphics = template.graphics;
        const alignment: PdfTextAlignment = this._obtainTextAlignment();
        const borderColor: number[] = this._obtainColor();
        const borderPen: PdfPen = new PdfPen(borderColor, this.border.width);
        if (this.border.width > 0) {
            parameter.borderPen = borderPen;
        }
        let rectangle: number[] = this._obtainStyle(borderPen, nativeRectangle, borderWidth, parameter);
        if (this.color) {
            parameter.foreBrush = new PdfBrush(this._color);
        }
        if (this.textMarkUpColor) {
            parameter.backBrush = new PdfBrush(this._textMarkUpColor);
        }
        parameter.borderWidth = this.border.width;
        if (this.calloutLines && this._calloutLines.length >= 2) {
            this._drawCallOuts(graphics, borderPen);
            if (this._isLoaded && typeof this._lineEndingStyle === 'undefined') {
                this._lineEndingStyle = this.lineEndingStyle;
            }
            if (this._lineEndingStyle !== PdfLineEndingStyle.none) {
                const linePoints: number[] = this._obtainLinePoints();
                const angle: number = this._getAngle(linePoints);
                const endPoint: number[] = this._getAxisValue([linePoints[2], linePoints[3]], 90, 0);
                this._drawLineEndStyle(endPoint,
                                       graphics,
                                       angle,
                                       borderPen,
                                       parameter.foreBrush,
                                       this.lineEndingStyle,
                                       this.border.width,
                                       false);
            }
            if (!this._dictionary.has('RD')) {
                rectangle = [this.bounds.x,
                    -((this._page.size[1] - (this.bounds.y + this.bounds.height))),
                    this.bounds.width,
                    -this.bounds.height];
            } else {
                rectangle = [rectangle[0], -rectangle[1], rectangle[2], -rectangle[3]];
            }
            rectangle[0] = rectangle[0] + this._cropBoxValueX;
            rectangle[1] = rectangle[1] - this._cropBoxValueY;
            this._calculateRectangle(rectangle);
            parameter.bounds = rectangle;
        } else {
            rectangle = [rectangle[0], -rectangle[1], rectangle[2], -rectangle[3]];
            parameter.bounds = rectangle;
        }
        const outerRectangle: number[] = this._obtainAppearanceBounds();
        const value: number[] = [rectangle[0] - outerRectangle[0], (-(rectangle[1])) - outerRectangle[1], rectangle[2] - outerRectangle[2],
            (((-rectangle[1]) - outerRectangle[1]) + (-rectangle[3])) - outerRectangle[3]];
        for (let i: number = 0; i < value.length; i++) {
            if (value[Number.parseInt(i.toString(), 10)] < 0) {
                value[Number.parseInt(i.toString(), 10)] = -value[Number.parseInt(i.toString(), 10)];
            }
        }
        this._dictionary.update('RD', value);
        if (this.opacity && this._opacity < 1) {
            graphics.save();
            graphics.setTransparency(this._opacity);
        }
        if (this.rotationAngle && this._rotate !== PdfRotationAngle.angle0) {
            graphics.save();
        }
        this._drawFreeTextRectangle(graphics, parameter, rectangle, alignment);
        if (text) {
            this._drawFreeMarkUpText(graphics, parameter, rectangle, text, alignment);
        }
        if (this.opacity && this._opacity < 1) {
            graphics.restore();
        }
        if (this.rotationAngle && this._rotate !== PdfRotationAngle.angle0) {
            graphics.restore();
        }
        const bounds: number[] = this._obtainAppearanceBounds();
        if (this.flatten) {
            this._bounds = { x: bounds[0], y: (this._page.size[1] - (bounds[1] + bounds[3])), width: bounds[2], height: bounds[3] };
        }
        this._dictionary.set('Rect', [bounds[0], bounds[1], bounds[0] + bounds[2], bounds[1] + bounds[3]]);
        return template;
    }
    _calculateRectangle(innerRectangle: number[]): void {
        const outerRectangle: number[] = this._obtainAppearanceBounds();
        const value: number[] = [innerRectangle[0] - outerRectangle[0],
            (-(innerRectangle[1])) - outerRectangle[1], innerRectangle[2] - outerRectangle[2],
            (((-innerRectangle[1]) - outerRectangle[1]) + (-innerRectangle[3])) - outerRectangle[3] ];
        for (let i: number = 0; i < 4; i++) {
            if (value[Number.parseInt(i.toString(), 10)] < 0) {
                value[Number.parseInt(i.toString(), 10)] = -value[Number.parseInt(i.toString(), 10)];
            }
        }
        this._dictionary.set('RD', value);
    }
    _obtainAnnotationIntent(_annotationIntent: PdfAnnotationIntent): string {
        switch (_annotationIntent) {
        case PdfAnnotationIntent.freeTextCallout:
            this._intentString = 'FreeTextCallout';
            break;
        case PdfAnnotationIntent.freeTextTypeWriter:
            this._intentString = 'FreeTextTypeWriter';
            break;
        }
        return this._intentString;
    }
    _obtainFont(): PdfFont {
        const fontData: {name: string, size: number, style: PdfFontStyle} = this._obtainFontDetails();
        if (!fontData.size && this._dictionary.has('RC')) {
            //Parse XML data
        }
        return _mapFont(fontData.name, fontData.size, fontData.style, this);
    }
    _updateStyle(font: PdfFont, color: number[], alignment: PdfTextAlignment): void {
        const ds: string = 'font:' +
            font._metrics._name +
            ' ' +
            font.size +
            'pt;style:' + _reverseMapPdfFontStyle(font.style) +
            ';color:' +
            this._colorToHex(color);
        this._dictionary.update('DS', ds);
        const body: string = '<?xml version="1.0"?><body xmlns="http://www.w3.org/1999/xhtml" style="font:'
            + font._metrics._name + ' ' + font.size + 'pt;font-weight:'
            + (font.isBold ? 'bold' : 'normal') + ';color:' + this._colorToHex(color) + '"><p dir="ltr">';
        let textAlignment: string;
        let alignmentText: string;
        if (alignment !== null && typeof alignment !== 'undefined') {
            switch (alignment) {
            case PdfTextAlignment.left:
                alignmentText = 'left';
                break;
            case PdfTextAlignment.center:
                alignmentText = 'center';
                break;
            case PdfTextAlignment.right:
                alignmentText = 'right';
                break;
            case PdfTextAlignment.justify:
                alignmentText = 'justify';
                break;
            }
            if (alignmentText) {
                textAlignment = 'text-align:' + alignmentText + ';';
            }
        }
        let decorationText: string = '';
        let textDecoration: string;
        const italic: string = 'font-style:italic';
        const bold: string = 'font-style:bold';
        if (font.isUnderline) {
            decorationText = font.isStrikeout ? 'text-decoration:word line-through' : 'text-decoration:word';
            if (font.isItalic) {
                decorationText += ';' + italic;
            } else if (font.isBold) {
                decorationText += ';' + bold;
            }
        } else if (font.isStrikeout) {
            decorationText = 'text-decoration:line-through';
            if (font.isItalic) {
                decorationText += ';' + italic;
            } else if (font.isBold) {
                decorationText += ';' + bold;
            }
        } else {
            if (font.isItalic) {
                decorationText += italic;
            } else if (font.isBold) {
                decorationText += bold;
            }
        }
        if (decorationText !== '') {
            textDecoration = '<span style = "' + textAlignment + decorationText + '">' + (this.text ? this._getXmlFormattedString(this.text) : '') + '</span>';
        } else {
            textDecoration = '<span style = "' + textAlignment + '">' + (this.text ? this._getXmlFormattedString(this.text) : '') + '</span>';
        }
        this._dictionary.update('RC', body + textDecoration + '</p></body>');
    }
    _drawFreeMarkUpText(graphics: PdfGraphics,
                        parameter: _PaintParameter,
                        rectangle: number[],
                        text: string,
                        alignment: PdfTextAlignment): void {
        let isRotation: boolean = false;
        const angle: number = this.rotate;
        if (this.rotationAngle === PdfRotationAngle.angle90 && !this._isAllRotation) {
            rectangle = [-rectangle[1], rectangle[0], -rectangle[3], rectangle[2]];
        } else if (this.rotationAngle === PdfRotationAngle.angle180 && !this._isAllRotation) {
            rectangle = [-(rectangle[2] + rectangle[0]), -rectangle[1], rectangle[2], -rectangle[3]];
        } else if (this.rotationAngle === PdfRotationAngle.angle270 && !this._isAllRotation) {
            rectangle = [(rectangle[1] + rectangle[3]), -(rectangle[0] + rectangle[2]), -rectangle[3], rectangle[2]];
        } else if (angle === 0 && !this._isAllRotation) {
            rectangle = [rectangle[0], (rectangle[1] + rectangle[3]), rectangle[2], rectangle[3]];
        }
        if ((typeof this._font === 'undefined' || this._font === null) || (!this._isLoaded && this._font.size === 1)) {
            this._font = this._markUpFont;
        }
        if (angle > 0 && this._isAllRotation) {
            isRotation = true;
            const bounds: {x: number, y: number, width: number, height: number} = this.bounds;
            const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
            const textSize: number[] = this._font.measureString(text, [0, 0], format, 0, 0);
            if (angle > 0 && angle <= 91) {
                graphics.translateTransform(textSize[1], -bounds.height);
            } else if (angle > 91 && angle <= 181) {
                graphics.translateTransform(bounds.width - textSize[1], -(bounds.height - textSize[1]));
            } else if (angle > 181 && angle <= 271) {
                graphics.translateTransform(bounds.width - textSize[1], -textSize[1]);
            } else if (angle > 271 && angle < 360) {
                graphics.translateTransform(textSize[1], -textSize[1]);
            }
            graphics.rotateTransform(angle);
            parameter.bounds = [0, 0, parameter.bounds[2], parameter.bounds[3]];
        }
        const bounds: number[] = [rectangle[0], rectangle[1], rectangle[2], rectangle[3]];
        if (this._paddings && !this._isLoaded) {
            const left: number = this._paddings._left;
            const top: number = this._paddings._top;
            const right: number = this._paddings._right + this._paddings._left;
            const bottom: number = this._paddings._top + this._paddings._bottom;
            if (parameter.borderWidth > 0) {
                const first: number = rectangle[0] + (parameter.borderWidth + left);
                const second: number = rectangle[1] + (parameter.borderWidth + top);
                const third: number = rectangle[2] - ((parameter.borderWidth * 2) + right);
                let forth: number;
                if (rectangle[3] > 0) {
                    forth = rectangle[3] - ((parameter.borderWidth * 2) + bottom);
                } else {
                    forth = -rectangle[3] - ((parameter.borderWidth * 2) + bottom);
                }
                rectangle = [first, second, third, forth];
            } else {
                const first: number = rectangle[0] + left;
                const second: number = rectangle[1] + top;
                const third: number = rectangle[2] - right;
                let forth: number;
                if (rectangle[3] > 0) {
                    forth = rectangle[3] - bottom;
                } else {
                    forth = -rectangle[3] - bottom;
                }
                rectangle = [first, second, third, forth];
            }
        } else if (parameter.borderWidth > 0) {
            rectangle = [rectangle[0] + (parameter.borderWidth * 1.5),
                rectangle[1] + (parameter.borderWidth * 1.5),
                rectangle[2] - (parameter.borderWidth * 3),
                (rectangle[3] > 0) ? (rectangle[3] - (parameter.borderWidth * 3)) : (-rectangle[3] - (parameter.borderWidth * 3))];
        }
        const first: boolean = this._font._metrics._getHeight() > ((rectangle[3] > 0) ? rectangle[3] : -rectangle[3]);
        const second: boolean = this._font._metrics._getHeight() <= ((bounds[3] > 0) ? bounds[3] : -bounds[3]);
        const checkPaddingWithFontHeight: boolean = first && second;
        this._drawFreeTextAnnotation(graphics,
                                     parameter,
                                     text,
                                     this._font,
                                     checkPaddingWithFontHeight ? bounds : rectangle,
                                     true,
                                     alignment,
                                     isRotation);
    }
    _drawFreeTextRectangle(graphics: PdfGraphics, parameter: _PaintParameter, rectangle: number[], alignment: PdfTextAlignment): void {
        const isRotation: boolean = false;
        if (this._dictionary.has('BE')) {
            for (let i: number = 0; i < rectangle.length; i++) {
                if (rectangle[Number.parseInt(i.toString(), 10)] < 0) {
                    rectangle[Number.parseInt(i.toString(), 10)] = -rectangle[Number.parseInt(i.toString(), 10)];
                }
            }
            this._drawAppearance(graphics, parameter, rectangle);
            if (this.rotationAngle === PdfRotationAngle.angle90 && !this._isAllRotation) {
                graphics.rotateTransform(-90);
            } else if (this.rotationAngle === PdfRotationAngle.angle180 && !this._isAllRotation) {
                graphics.rotateTransform(-180);
            } else if (this.rotationAngle === PdfRotationAngle.angle270 && !this._isAllRotation) {
                graphics.rotateTransform(-270);
            }
        } else {
            if (this.rotationAngle === PdfRotationAngle.angle90 && !this._isAllRotation) {
                graphics.rotateTransform(-90);
                parameter.bounds = [-rectangle[1], rectangle[2] + rectangle[0], - rectangle[3], -rectangle[2]];
            } else if (this.rotationAngle === PdfRotationAngle.angle180 && !this._isAllRotation) {
                graphics.rotateTransform(-180);
                parameter.bounds = [-(rectangle[2] + rectangle[0]), -(rectangle[3] + rectangle[1]), rectangle[2], rectangle[3]];
            } else if (this.rotationAngle === PdfRotationAngle.angle270 && !this._isAllRotation) {
                graphics.rotateTransform(-270);
                parameter.bounds = [rectangle[1] + rectangle[3], -rectangle[0], -rectangle[3], -rectangle[2]];
            }
            if (parameter.borderWidth > 0 && !this._isAllRotation) {
                rectangle = parameter.bounds;
            }
            this._drawFreeTextAnnotation(graphics, parameter, '', this._font, rectangle, false, alignment, isRotation);
        }
    }
    _drawAppearance(graphics: PdfGraphics, parameter: _PaintParameter, rectangle: number[]): void {
        const graphicsPath: PdfPath = new PdfPath();
        graphicsPath.addRectangle(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);
        if (this._dictionary.has('BE')) {
            const dictionary: _PdfDictionary = this._dictionary.get('BE');
            if (dictionary && dictionary.has('I')) {
                const value: number = dictionary.get('I');
                const radius: number = value === 1 ? 4 : 9;
                this._drawCloudStyle(graphics, parameter.foreBrush, parameter.borderPen, radius, 0.833, graphicsPath._points, true);
            }
        }
    }
    _drawFreeTextAnnotation(g: PdfGraphics,
                            parameter: _PaintParameter,
                            text: string,
                            font: PdfFont,
                            rectangle: number[],
                            isSkipDrawRectangle: boolean,
                            alignment: PdfTextAlignment,
                            isRotation: boolean): void {
        if (!isSkipDrawRectangle) {
            g.drawRectangle(rectangle[0], rectangle[1], rectangle[2], rectangle[3], parameter.borderPen, parameter.foreBrush);
        } else {
            const format: PdfStringFormat = new PdfStringFormat();
            format.lineAlignment = PdfVerticalAlignment.top;
            format.alignment = alignment;
            format.lineSpacing = 0;
            if (isRotation) {
                g.drawString(text, font, parameter.bounds, null, parameter.backBrush, format);
            } else {
                g.drawString(text, font, rectangle, null, parameter.backBrush, format);
            }
        }
    }
    _getCalloutLinePoints(): Array<number[]> {
        if (this._dictionary.has('CL')) {
            const calloutLinepoints: number[] = this._dictionary.getArray('CL');
            if (calloutLinepoints) {
                this._calloutLines = [];
                for (let i: number = 0; i < calloutLinepoints.length; i = i + 2) {
                    const points: number[] = [calloutLinepoints[Number.parseInt(i.toString(), 10)],
                        this._page.size[1] - calloutLinepoints[i + 1]];
                    this._calloutLines.push(points);
                }
            }
        }
        return this._calloutLines;
    }
    _obtainAppearanceBounds(): number[] {
        let bounds: number[] = [0, 0, 0, 0];
        if (this.calloutLines && this._calloutLines.length > 0) {
            const path: PdfPath = new PdfPath();
            const pointArray: Array<number[]> = [];
            const length: number = this._calloutLines.length === 2 ? 2 : 3;
            for (let i: number = 0; i < length; i++) {
                pointArray.push([0, 0]);
            }
            if (this._calloutLines.length >= 2) {
                this._obtainCallOutsNative();
                for (let i: number = 0; i < this._calloutLines.length; i++) {
                    if (i < 3) {
                        pointArray[Number.parseInt(i.toString(), 10)] = [this._calloutsClone[Number.parseInt(i.toString(), 10)][0],
                            this._calloutsClone[Number.parseInt(i.toString(), 10)][1]];
                    } else {
                        break;
                    }
                }
            }
            if (pointArray.length > 0) {
                if (this.lineEndingStyle !== PdfLineEndingStyle.none) {
                    this._expandAppearance(pointArray);
                }
                path._addLines(pointArray);
            }
            path.addRectangle((this.bounds.x + this._cropBoxValueX) - 2,
                              ((this._page.size[1] + this._cropBoxValueY) - (this.bounds.y + this.bounds.height)) - 2,
                              this.bounds.width + (2 * 2),
                              this.bounds.height + (2 * 2));
            bounds = path._getBounds();
        } else {
            bounds = [this.bounds.x + this._cropBoxValueX,
                ((this._page.size[1] + this._cropBoxValueY) - (this.bounds.y + this.bounds.height)),
                this.bounds.width,
                this.bounds.height];
        }
        return bounds;
    }
    _obtainCallOutsNative(): void {
        if (this.calloutLines && this._calloutLines.length > 0) {
            const size: number[] = this._page.size;
            this._calloutsClone = [];
            for (let i: number = 0; i < this._calloutLines.length; i++) {
                this._calloutsClone.push([this._calloutLines[Number.parseInt(i.toString(), 10)][0] + this._cropBoxValueX,
                    (size[1] + this._cropBoxValueY) - this._calloutLines[Number.parseInt(i.toString(), 10)][1]]);
            }
        }
    }
    _obtainLinePoints(): number[] {
        const pageHeight: number = this._page.size[1];
        return [this.calloutLines[1][0] + this._cropBoxValueX,
            (pageHeight + this._cropBoxValueY) - this.calloutLines[1][1],
            this.calloutLines[0][0] + this._cropBoxValueX,
            (pageHeight + this._cropBoxValueY) - this.calloutLines[0][1]];
    }
    _obtainLineEndingStyle(): PdfLineEndingStyle {
        let lineEndingStyle: PdfLineEndingStyle = PdfLineEndingStyle.square;
        if (this._dictionary.has('LE')) {
            lineEndingStyle = _mapLineEndingStyle(this._dictionary.get('LE').name, lineEndingStyle);
        }
        return lineEndingStyle;
    }
    _obtainText(): string {
        let text: string = '';
        if (this._dictionary.has('Contents')) {
            const markUpText: string = this._dictionary.get('Contents');
            if (markUpText) {
                text = markUpText;
            }
            if (text && text !== '') {
                this._text = text;
            }
            return text;
        } else if (this._dictionary.has('RC')) {
            //this._parseXMLData();
            text = this._rcText;
            return text;
        }
        return text;
    }
    _obtainTextAlignment(): PdfTextAlignment {
        let textAlignment: PdfTextAlignment = PdfTextAlignment.left;
        let hasAlignment: boolean;
        if (this._dictionary.has('Q')) {
            const value: number = this._dictionary.get('Q');
            if (typeof value !== 'undefined') {
                textAlignment = value;
                hasAlignment = true;
            }
        } else if (this._dictionary.has('RC')) {
            //Need to add
        }
        if (!hasAlignment && this._dictionary.has('DS')) {
            const value: string = this._dictionary.get('DS');
            const collections: string[] = value.split(';');
            for (let i: number = 0; i < collections.length; i++) {
                if (collections[Number.parseInt(i.toString(), 10)].indexOf('text-align') !== -1) {
                    switch (collections[Number.parseInt(i.toString(), 10)]) {
                    case 'left':
                        textAlignment = PdfTextAlignment.left;
                        break;
                    case 'right':
                        textAlignment = PdfTextAlignment.right;
                        break;
                    case 'center':
                        textAlignment = PdfTextAlignment.center;
                        break;
                    case 'justify':
                        textAlignment = PdfTextAlignment.justify;
                        break;
                    }
                }
            }
        }
        return textAlignment;
    }
    _obtainColor(): number[] {
        let color: number[];
        if (this._isLoaded) {
            if (this._dictionary.has('DA')) {
                const entry: number[] | string = this._dictionary.get('DA');
                if (Array.isArray(entry) && entry.length > 0) {
                    color = [entry[0], entry[1], entry[2]];
                } else if (typeof entry === 'string') {
                    this._da = new _PdfDefaultAppearance(entry);
                    color = this._da.color;
                }
            } else if (this._dictionary.has('MK')) {
                const mkDict: _PdfDictionary = this._mkDictionary;
                if (mkDict && mkDict.has('BC')) {
                    color = _parseColor(mkDict.getArray('BC'));
                }
            } else {
                color = [0, 0, 0];
            }
        } else {
            color = this._borderColor ? this._borderColor : [0, 0, 0];
        }
        return color;
    }
    _expandAppearance(pointArray: Array<number[]>): void {
        let pointY: number = pointArray[0][1];
        const pointX: number = pointArray[0][0];
        if (!this._isLoaded) {
            pointY = this._page.size[1] - pointY;
        }
        if (pointY > this.bounds.y) {
            if (this.lineEndingStyle !== PdfLineEndingStyle.openArrow) {
                pointArray[0][1] -= (this.border.width * 11);
            }
        } else {
            pointArray[0][1] += (this.border.width * 11);
        }
        if (pointX <= this.bounds.x) {
            pointArray[0][0] -= (this.border.width * 11);
        } else {
            pointArray[0][0] += (this.border.width * 11);
        }
    }
    _drawCallOuts(graphics: PdfGraphics, borderPen: PdfPen): void {
        const path: PdfPath = new PdfPath();
        const pointArray: Array<number[]> = [];
        const length: number = this._calloutLines.length === 2 ? 2 : 3;
        for (let i: number = 0; i < length; i++) {
            pointArray.push([0, 0]);
        }
        if (this._calloutLines.length >= 2) {
            this._obtainCallOutsNative();
            for (let i: number = 0; i < this._calloutLines.length && i < 3; i++) {
                pointArray[Number.parseInt(i.toString(), 10)] = [this._calloutsClone[Number.parseInt(i.toString(), 10)][0],
                    -this._calloutsClone[Number.parseInt(i.toString(), 10)][1]];
            }
        }
        if (pointArray.length > 0) {
            path._addLines(pointArray);
        }
        graphics.drawPath(path, borderPen);
    }
    _saveFreeTextDictionary(): void {
        if ((typeof this.font === 'undefined' || this.font === null) || (!this._isLoaded && this.font.size === 1)) {
            this.font = this._markUpFont;
        }
        if (typeof this.text === 'string' && this.text !== null) {
            this._dictionary.update('Contents', this.text);
        }
        if (this._isLoaded) {
            this._textAlignment = this.textAlignment;
        }
        this._dictionary.update('Q', this._textAlignment);
        if (this.annotationIntent === PdfAnnotationIntent.none) {
            this._dictionary.update('Subj', 'Text Box');
        } else {
            this._dictionary.update('IT', _PdfName.get(this._obtainAnnotationIntent(this._annotationIntent)));
        }
        this._updateStyle(this.font, this.textMarkUpColor, this._textAlignment);
        this._dictionary.update('DA', this._getBorderColorString(this.borderColor ? this._borderColor : [0, 0, 0]));
        if (this._calloutLines && this._calloutLines.length >= 2) {
            const pageHeight: number = this._page.size[1];
            const lines: Array<number> = [];
            for (let i: number = 0; i < this._calloutLines.length && i < 3; i++) {
                lines.push(this._calloutLines[Number.parseInt(i.toString(), 10)][0] + this._cropBoxValueX);
                lines.push((pageHeight + this._cropBoxValueY) - this._calloutLines[Number.parseInt(i.toString(), 10)][1]);
            }
            this._dictionary.update('CL', lines);
        }
        if (this._setAppearance) {
            const rect: number[] = this._obtainAppearanceBounds();
            this._dictionary.update('Rect', [rect[0], rect[1], rect[0] + rect[2], rect[1] + rect[3]]);
        }
    }
    _getXmlFormattedString(markupText: string): string {
        markupText = markupText.replace('&', '&amp;');
        markupText = markupText.replace('<', '&lt;');
        markupText = markupText.replace('>', '&gt;');
        return markupText;
    }
}
/**
 * `PdfRedactionAnnotation` class represents the redaction annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new redaction annotation
 * const annotation: PdfRedactionAnnotation = new PdfRedactionAnnotation (50, 100, 100, 50);
 * // Add annotation to the page
 * page.annotations.add(annotation);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfRedactionAnnotation extends PdfAnnotation {
    private _overlayText: string;
    private _repeat: boolean;
    private _font: PdfFont;
    private _textColor: number[];
    private _borderColor: number[];
    private _textAlignment: PdfTextAlignment = PdfTextAlignment.left;
    /**
     * Initializes a new instance of the `PdfRedactionAnnotation` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfRedactionAnnotation` class.
     *
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} width Width.
     * @param {number} height Height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new redaction annotation
     * const annotation: PdfRedactionAnnotation = new PdfRedactionAnnotation ([10, 50, 250, 50]);
     * // Add annotation to the page
     * page.annotations.add(annotation);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(x: number, y: number, width: number, height: number )
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super();
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Redact'));
        if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.bounds = {x, y, width, height};
        }
        this._type = _PdfAnnotationType.redactionAnnotation;
    }
    /**
     * Gets the boolean flag indicating whether annotation has repeat text or not.
     *
     * @returns {boolean} repeat text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Gets the boolean flag indicating whether annotation has repeat text or not.
     * let repeatText: boolean = annotation. repeatText;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get repeatText(): boolean {
        if (typeof this._repeat === 'undefined' && this._dictionary.has('Repeat')) {
            this._repeat = this._dictionary.get('Repeat');
        }
        return this._repeat;
    }
    /**
     * Sets the boolean flag indicating whether annotation has repeat text or not.
     *
     * @param {boolean} value repeat text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Sets the boolean flag indicating whether annotation has repeat text or not.
     * annotation.repeatText = false;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set repeatText(value: boolean) {
        if (value !== this._repeat) {
            this._repeat = value;
            if (this._dictionary) {
                this._dictionary.update('Repeat', value);
            }
        }
    }
    /**
     * Gets the text alignment of the annotation.
     *
     * @returns {PdfTextAlignment} Text alignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Gets the text alignment of the annotation.
     * let textAlignment: PdfTextAlignment = annotation.textAlignment;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textAlignment(): PdfTextAlignment {
        if (this._dictionary.has('Q')) {
            this._textAlignment = this._dictionary.get('Q');
        }
        return this._textAlignment;
    }
    /**
     * Sets the text alignment of the annotation.
     *
     * @param {PdfTextAlignment} value Text alignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Sets the text alignment of the annotation.
     * annotation.textAlignment = PdfTextAlignment.justify;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textAlignment(value: PdfTextAlignment) {
        if (this._textAlignment !== value) {
            this._dictionary.update('Q', value as number);
        }
        this._textAlignment = value;
    }
    /**
     * Gets the text color of the annotation.
     *
     * @returns {number[]} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Gets the text color of the annotation.
     * let textColor : number[] = annotation.textColor;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textColor(): number[] {
        if (typeof this._textColor === 'undefined' && this._dictionary.has('C')) {
            this._textColor = _parseColor(this._dictionary.getArray('C'));
        }
        return this._textColor;
    }
    /**
     * Sets the text color of the annotation.
     *
     * @param {number[]} value R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Sets the text color of the annotation.
     * annotation.textColor = [255, 255, 255];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textColor(value: number[]) {
        if (typeof value !== 'undefined' && value.length === 3) {
            const extColor: number[] = this.textColor;
            if (!this._isLoaded || typeof extColor === 'undefined' || (extColor[0] !== value[0] || extColor[1] !== value[1] || extColor[2] !== value[2])) {
                this._textColor = value;
                this._dictionary.update('C', [Number.parseFloat((value[0] / 255).toFixed(3)),
                    Number.parseFloat((value[1] / 255).toFixed(3)),
                    Number.parseFloat((value[2] / 255).toFixed(3))]);
            }
        }
    }
    /**
     * Gets the border color of the annotation.
     *
     * @returns {number[]} R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Gets the border color of the annotation.
     * let borderColor: number[] = annotation.borderColor;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get borderColor(): number[] {
        if (typeof this._borderColor === 'undefined' && this._dictionary.has('OC')) {
            this._borderColor = _parseColor(this._dictionary.getArray('OC'));
        }
        return this._borderColor;
    }
    /**
     * Sets the border color of the annotation.
     *
     * @param {number[]} value R, G, B color values in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Sets the border color of the annotation.
     * annotation.borderColor = [255, 255, 255];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set borderColor(value: number[]) {
        if (typeof value !== 'undefined' && value.length === 3) {
            const extColor: number[] = this.borderColor;
            if (!this._isLoaded || typeof extColor === 'undefined' || (extColor[0] !== value[0] || extColor[1] !== value[1] || extColor[2] !== value[2])) {
                this._borderColor = value;
                this._dictionary.update('OC', [Number.parseFloat((value[0] / 255).toFixed(3)),
                    Number.parseFloat((value[1] / 255).toFixed(3)),
                    Number.parseFloat((value[2] / 255).toFixed(3))]);
            }
        }
    }
    /**
     * Gets the overlay text of the annotation.
     *
     * @returns {string} overlay text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Gets the overlay text of the annotation.
     * let overlayText: string =annotation.overlayText;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get overlayText(): string {
        if (typeof this._overlayText === 'undefined' && this._dictionary.has('OverlayText')) {
            this._overlayText = this._dictionary.get('OverlayText');
        }
        return this._overlayText;
    }
    /**
     * Sets the overlay text of the annotation.
     *
     * @param {string} value overlay text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Sets the overlay text of the annotation.
     * annotation.overlayText = ‘syncfusion’;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set overlayText(value: string) {
        if (typeof value === 'string') {
            this._dictionary.update('OverlayText', value);
            this._overlayText = value;
        }
    }
    /**
     * Gets the font of the annotation.
     *
     * @returns {PdfFont} font.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Gets the font of the annotation.
     * let font: PdfFont = annotation.font;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get font(): PdfFont {
        return this._font;
    }
    /**
     * Sets the font of the annotation.
     *
     * @param {PdfFont} value font.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfRedactionAnnotation = page.annotations.at(0) as PdfRedactionAnnotation;
     * // Sets the font of the annotation.
     * annotation.font = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set font(value: PdfFont) {
        this._font = value;
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfRedactionAnnotation {
        const annot: PdfRedactionAnnotation = new PdfRedactionAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _postProcess(isFlatten: boolean): void {
        if (typeof this.bounds === 'undefined' || this.bounds === null) {
            throw new Error('Bounds cannot be null or undefined');
        }
        let borderWidth: number;
        if (this._dictionary.has('BS')) {
            borderWidth = this.border.width;
        } else {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.set('Type', _PdfName.get('Border'));
            this._dictionary.set('BS', dictionary);
        }
        if (typeof borderWidth === 'undefined') {
            borderWidth = 1;
        }
        if (this._setAppearance) {
            this._appearanceTemplate = this._createRedactionAppearance(isFlatten);
        }
        this._dictionary.update('Rect', _updateBounds(this));
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (!this._isImported) {
            if (this._isLoaded) {
                this._appearanceTemplate = this._createRedactionAppearance(isFlatten);
            } else {
                this._postProcess(isFlatten);
                if (!this._appearanceTemplate) {
                    if (isFlatten) {
                        if (!this._dictionary.has('AP')) {
                            this._appearanceTemplate = this._createRedactionAppearance(isFlatten);
                        } else {
                            const dictionary: _PdfDictionary = this._dictionary.get('AP');
                            if (dictionary && dictionary.has('N')) {
                                const appearanceStream: _PdfBaseStream = dictionary.get('N');
                                if (appearanceStream) {
                                    const reference: _PdfReference = dictionary.getRaw('N');
                                    if (reference) {
                                        appearanceStream.reference = reference;
                                    }
                                    this._appearanceTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                                }
                            }
                        }
                    }
                }
            }
            if (isFlatten && this._appearanceTemplate) {
                const isNormalMatrix: boolean = this._validateTemplateMatrix(this._appearanceTemplate._content.dictionary);
                if (!this._appearanceTemplate._content.dictionary.has('Matrix')) {
                    const box: number[] = this._appearanceTemplate._content.dictionary.getArray('BBox');
                    if (box) {
                        this._appearanceTemplate._content.dictionary.update('Matrix', [1, 0, 0, 1, -box[0], -box[1]]);
                    }
                }
                this._flattenAnnotationTemplate(this._appearanceTemplate, isNormalMatrix);
            }
        }
    }
    _createRedactionAppearance(isFlatten: boolean): PdfTemplate {
        const normalTemplate: PdfTemplate = this._createNormalAppearance();
        if (isFlatten) {
            if (this._isLoaded && this._page !== null) {
                this._page.annotations.remove(this);
            }
        } else {
            const borderTemplate: PdfTemplate = this._createBorderAppearance();
            if (this._dictionary.has('AP')) {
                const appearance: _PdfDictionary = this._dictionary.get('AP');
                if (appearance && appearance instanceof _PdfDictionary) {
                    _removeDuplicateReference(appearance, this._crossReference, 'N');
                    _removeDuplicateReference(appearance, this._crossReference, 'R');
                }
            }
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            borderTemplate._content.dictionary._updated = true;
            const reference1: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference1, borderTemplate._content);
            borderTemplate._content.reference = reference1;
            dictionary.set('N', reference1);
            normalTemplate._content.dictionary._updated = true;
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, normalTemplate._content);
            normalTemplate._content.reference = reference;
            dictionary.set('R', reference);
            dictionary._updated = true;
            this._dictionary.set('AP', dictionary);
        }
        return normalTemplate;
    }
    _createBorderAppearance(): PdfTemplate {
        const nativeRectangle: number[] = [0, 0, this.bounds.width, this.bounds.height];
        const template: PdfTemplate = new PdfTemplate(nativeRectangle, this._crossReference);
        const width: number = this.border.width / 2;
        const graphics: PdfGraphics = template.graphics;
        const actualWidth: number = this.border.width;
        let pen: PdfPen;
        if (this.border.width > 0 && this.borderColor) {
            pen = new PdfPen(this.borderColor, actualWidth);
        }
        const rect: number[] = [nativeRectangle[0], nativeRectangle[1], nativeRectangle[2], nativeRectangle[3]];
        if (this.opacity < 1) {
            const state: PdfGraphicsState = graphics.save();
            graphics.setTransparency(this.opacity);
            graphics.drawRectangle(rect[0] + width, rect[1] + width, rect[2] - actualWidth, rect[3] - actualWidth, pen, null);
            graphics.restore(state);
        } else {
            graphics.drawRectangle(rect[0] + width, rect[1] + width, rect[2] - actualWidth, rect[3] - actualWidth, pen, null);
        }
        return template;
    }
    _createNormalAppearance(): PdfTemplate {
        const nativeRectangle: number[] = [0, 0, this.bounds.width, this.bounds.height];
        const template: PdfTemplate = new PdfTemplate(nativeRectangle, this._crossReference);
        _setMatrix(template, this._getRotationAngle());
        const width: number = this.border.width / 2;
        const graphics: PdfGraphics = template.graphics;
        const parameter: _PaintParameter = new _PaintParameter();
        let borderPen: PdfPen;
        if (this.textColor && this.border.width > 0) {
            borderPen = new PdfPen(this.textColor, this.border.width);
        }
        let backBrush: PdfBrush;
        let textcolor: PdfBrush;
        if (this.innerColor) {
            backBrush = new PdfBrush(this.innerColor);
        }
        if (this.textColor) {
            textcolor = new PdfBrush(this.textColor);
        } else {
            textcolor = new PdfBrush([128, 128, 128]);
        }
        parameter.backBrush = backBrush;
        parameter.borderWidth = width;
        const widths: number = this.border.width;
        const rect: number[] = [nativeRectangle[0], nativeRectangle[1], nativeRectangle[2], nativeRectangle[3]];
        if (this.opacity < 1) {
            const state: PdfGraphicsState = graphics.save();
            graphics.setTransparency(this.opacity);
            graphics.drawRectangle(rect[0] + width, rect[1] + width, rect[2] - widths, rect[3] - widths, borderPen, backBrush);
            graphics.restore(state);
        } else {
            graphics.drawRectangle(rect[0] + width, rect[1] + width, rect[2] - widths, rect[3] - widths, borderPen, backBrush);
        }
        graphics.restore();
        if (this.overlayText && this._overlayText !== '') {
            let col: number = 0;
            let row: number = 0;
            if (typeof this.font === 'undefined' || this.font === null) {
                this.font = this._lineCaptionFont;
            }
            let y: number = 0;
            let x: number = 0;
            let diff: number = 0;
            let rectangle: number[];
            if (this._isLoaded) {
                this._textAlignment = this.textAlignment;
            }
            const format: PdfStringFormat = new PdfStringFormat(this._textAlignment, PdfVerticalAlignment.middle);
            const textsize: number[] = this.font.measureString(this.overlayText, [0, 0], format, 0, 0);
            if (this._isLoaded && typeof this._repeat === 'undefined') {
                this._repeat = this.repeatText;
            }
            if (this._repeat) {
                if (textsize[0] <= 0) {
                    textsize[0] = 1;
                }
                col = this.bounds.width / textsize[0];
                row = Math.floor(this.bounds.height / this.font._size);
                diff = Math.abs(this.bounds.width - (Math.floor(col) * textsize[0]));
                if (this._textAlignment === PdfTextAlignment.center) {
                    x = diff / 2;
                }
                if (this._textAlignment === PdfTextAlignment.right) {
                    x = diff;
                }
                for (let i: number = 1; i < col; i++) {
                    for (let j: number = 0; j < row; j++) {
                        rectangle = [x, y, 0, 0];
                        graphics.drawString(this.overlayText, this.font, rectangle, null, textcolor, null);
                        y = y + this.font._size;
                    }
                    x = x + textsize[0];
                    y = 0;
                }
            } else {
                diff = Math.abs(this.bounds.width - textsize[0]);
                if (this._textAlignment === PdfTextAlignment.center) {
                    x = diff / 2;
                }
                if (this._textAlignment === PdfTextAlignment.right) {
                    x = diff;
                }
                rectangle = [x, 0, 0, 0];
                graphics.drawString(this.overlayText, this.font, rectangle, null, textcolor, null);
            }
        }
        return template;
    }
}
/**
 * `PdfRichMediaAnnotation` class represents the rich media annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfRichMediaAnnotation = page.annotations.at(0) as PdfRichMediaAnnotation;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfRichMediaAnnotation extends PdfAnnotation {
    /**
     * Initializes a new instance of the `PdfRichMediaAnnotation` class.
     *
     * @private
     */
    constructor() {
        super();
        this._type = _PdfAnnotationType.richMediaAnnotation;
    }
    static _load(page: PdfPage, dictionary: _PdfDictionary): PdfRichMediaAnnotation {
        const annot: PdfRichMediaAnnotation = new PdfRichMediaAnnotation();
        annot._isLoaded = true;
        annot._initialize(page, dictionary);
        return annot;
    }
    _initialize(page: PdfPage, dictionary?: _PdfDictionary): void {
        super._initialize(page, dictionary);
    }
    _doPostProcess(isFlatten: boolean = false): void {
        if (typeof this.flattenPopups !== 'undefined' && this.flattenPopups) {
            this._flattenPopUp();
        }
        if (isFlatten) {
            let appearanceStream: _PdfBaseStream;
            if (this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    appearanceStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (reference && appearanceStream) {
                        appearanceStream.reference = reference;
                    }
                }
            }
            if (appearanceStream) {
                const template: PdfTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                const isNormalMatrix: boolean = this._validateTemplateMatrix(template._content.dictionary);
                this._flattenAnnotationTemplate(template, isNormalMatrix);
            } else {
                this._removeAnnotation(this._page, this);
            }
        }
    }
}
/**
 * `PdfWidgetAnnotation` class represents the widget annotation objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfWidgetAnnotation extends PdfAnnotation {
    private _backColor: number[];
    private _borderColor: number[];
    _rotationAngle: number;
    _highlightMode: PdfHighlightMode;
    _da: _PdfDefaultAppearance;
    _field: PdfField;
    _enableGrouping: boolean;
    _needActualName: boolean;
    _textAlignment: PdfTextAlignment;
    _isAutoResize: boolean = false;
    _index: number;
    _visibility: PdfFormFieldVisibility = PdfFormFieldVisibility.visible;
    _fontName: string;
    _isFont: boolean = false;
    _isTransparentBackColor: boolean = false;
    _isTransparentBorderColor: boolean = false;
    /**
     * Initializes a new instance of the `PdfWidgetAnnotation` class.
     *
     * @private
     */
    constructor() {
        super();
        this._isWidget = true;
        this._type = _PdfAnnotationType.widgetAnnotation;
    }
    /**
     * Parse an existing widget annotation.
     *
     * @private
     * @param {_PdfDictionary} dictionary Widget dictionary.
     * @param {_PdfCrossReference} crossReference PDF cross reference.
     * @returns {PdfWidgetAnnotation} Widget.
     */
    static _load(dictionary: _PdfDictionary, crossReference: _PdfCrossReference): PdfWidgetAnnotation {
        const widget: PdfWidgetAnnotation = new PdfWidgetAnnotation();
        widget._isLoaded = true;
        widget._dictionary = dictionary;
        widget._crossReference = crossReference;
        return widget;
    }
    /**
     * Gets the page object (Read only).
     *
     * @returns {PdfPage} page object.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access check box field
     * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
     * // Access first item of check box field
     * let item: PdfWidgetAnnotation = field.itemAt(0);
     * // Gets the page object.
     * let page: PdfPage = item.page;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get page(): PdfPage {
        return this._getPage();
    }
    /**
     * Gets the fore color of the annotation.
     *
     * @returns {number[]} Color as R, G, B color array in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Gets the fore color of the annotation.
     * let color: number[] = annotation.color;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get color(): number[] {
        if (typeof this._color === 'undefined' && this._defaultAppearance) {
            this._color = this._da.color;
        }
        return this._color;
    }
    /**
     * Sets the fore color of the annotation.
     *
     * @param {number[]} value Color as R, G, B color array in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Sets the fore color of the annotation.
     * annotation.color = [255,255,255];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set color(value: number[]) {
        if (typeof this.color === 'undefined' || this._color !== value) {
            this._color = value;
        }
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
    /**
     * Gets the back color of the annotation.
     *
     * @returns {number[]} Color as R, G, B color array in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the text box field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the back color of the annotation
     * let backColor: number[] = field.itemAt(0).backColor;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get backColor(): number[] {
        return this._parseBackColor();
    }
    /**
     * Sets the back color of the annotation.
     *
     * @param {number[]} value Array with R, G, B, A color values in between 0 to 255. For optional A (0-254), it signifies transparency.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the text box field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the background color of the field item
     * field.itemAt(0).backColor = [255, 0, 0];
     * // Sets the background color of the field item to transparent
     * field.itemAt(1).backColor = [0, 0, 0, 0];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set backColor(value: number[]) {
        this._updateBackColor(value);
    }
    get _hasBackColor(): boolean {
        if (this._isLoaded) {
            const mkDictionary: _PdfDictionary = this._mkDictionary;
            return (mkDictionary && mkDictionary.has('BG'));
        } else {
            return !this._isTransparentBackColor;
        }
    }
    get _hasBorderColor(): boolean {
        if (this._isLoaded) {
            const mkDictionary: _PdfDictionary = this._mkDictionary;
            return (mkDictionary && mkDictionary.has('BC'));
        } else {
            return !this._isTransparentBorderColor;
        }
    }
    /**
     * Gets the border color of the annotation.
     *
     * @returns {number[]} Color as R, G, B color array in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Gets the border color of the annotation.
     * let borderColor: number[] = annotation.borderColor;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get borderColor(): number[] {
        return this._parseBorderColor();
    }
    /**
     * Sets the border color of the annotation.
     *
     * @param {number[]} value Array with R, G, B, A color values in between 0 to 255. For optional A (0-254), it signifies transparency.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Sets the border color of the annotation.
     * annotation.borderColor = [255,255,255];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set borderColor(value: number[]) {
        this._updateBorderColor(value);
    }
    /**
     * Gets the rotation angle of the annotation.
     *
     * @returns {number} Rotation angle as number.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Gets the rotation angle of the annotation.
     * let rotate: number = annotation.rotate;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get rotate(): number {
        if (typeof this._rotationAngle === 'undefined') {
            if (this._mkDictionary && this._mkDictionary.has('R')) {
                this._rotationAngle = this._mkDictionary.get('R');
            } else if (this._dictionary.has('R')) {
                this._rotationAngle = this._dictionary.get('R');
            }
        }
        return this._rotationAngle;
    }
    /**
     * Sets the rotation angle of the annotation.
     *
     * @param {number} value Rotation angle as number.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Sets the rotation angle of the annotation.
     * annotation.rotate = 90;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set rotate(value: number) {
        if (typeof this.rotate === 'undefined' || this._rotationAngle !== value) {
            if (typeof this._mkDictionary === 'undefined') {
                this._dictionary.update('MK', new _PdfDictionary(this._crossReference));
            }
            this._mkDictionary.update('R', value);
            this._rotationAngle = value;
            this._dictionary._updated = true;
        }
    }
    /**
     * Gets the highlight mode of the annotation.
     *
     * @returns {PdfHighlightMode} Highlight mode.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Gets the highlight mode of the annotation.
     * let highlightMode: PdfHighlightMode = annotation.highlightMode;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get highlightMode(): PdfHighlightMode {
        if (typeof this._highlightMode === 'undefined' && this._dictionary.has('H')) {
            const mode: _PdfName = this._dictionary.get('H');
            this._highlightMode = _mapHighlightMode(mode.name);
        }
        return this._highlightMode;
    }
    /**
     * Sets the highlight mode of the annotation.
     *
     * @param {PdfHighlightMode} value Highlight mode.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Sets the highlight mode of the annotation.
     * annotation.highlightMode = PdfHighlightMode.noHighlighting;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set highlightMode(value: PdfHighlightMode) {
        if (this._highlightMode !== value) {
            this._dictionary.update('H', _reverseMapHighlightMode(value));
        }
    }
    /**
     * Gets the bounds of the annotation.
     *
     * @returns {{x: number, y: number, width: number, height: number}} Bounds.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Gets the bounds of the annotation.
     * let bounds : {x: number, y: number, width: number, height: number} = annotation.bounds;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bounds(): {x: number, y: number, width: number, height: number} {
        if (this._isLoaded && typeof this._bounds === 'undefined') {
            this._bounds = _calculateBounds(this._dictionary, this._getPage());
        }
        if (typeof this._bounds === 'undefined' || this._bounds === null) {
            this._bounds = {x: 0, y: 0, width: 0, height: 0};
        }
        return this._bounds;
    }
    /**
     * Sets the bounds of the annotation.
     *
     * @param {{x: number, y: number, width: number, height: number}} value Bounds
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Sets the bounds of the annotation.
     * annotation.bounds = {0, 0, 50, 50};
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set bounds(value: {x: number, y: number, width: number, height: number}) {
        if (value.x === 0 && value.y === 0 && value.width === 0 && value.height === 0) {
            throw new Error('Cannot set empty bounds');
        }
        this._bounds = value;
        if (this._page && this._page._isNew && this._page._pageSettings) {
            this._dictionary.update('Rect', _updateBounds(this));
        } else {
            this._dictionary.update('Rect', _getUpdatedBounds([value.x, value.y, value.width, value.height], this._getPage()));
        }
    }
    /**
     * Gets the text alignment of the annotation.
     *
     * @returns {PdfTextAlignment} Text alignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Gets the text alignment of the annotation.
     * let textAlignment: PdfTextAlignment = annotation.textAlignment;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textAlignment(): PdfTextAlignment {
        if (typeof this._textAlignment === 'undefined' && this._dictionary.has('Q')) {
            this._textAlignment = this._dictionary.get('Q');
        }
        return this._textAlignment;
    }
    /**
     * Sets the text alignment of the annotation.
     *
     * @param {PdfTextAlignment} value Text alignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Sets the text alignment of the annotation.
     * annotation.textAlignment = PdfTextAlignment.left;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textAlignment(value: PdfTextAlignment) {
        if (typeof this._textAlignment === 'undefined' || this._textAlignment !== value) {
            this._dictionary.update('Q', value as number);
        }
    }
    /**
     * Gets the visibility.
     *
     * @returns {PdfFormFieldVisibility} Field visibility option.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the visibility.
     * let visibility: PdfFormFieldVisibility = field.itemAt(0).visibility;
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
            let flag: PdfAnnotationFlag = PdfAnnotationFlag.default;
            if (this._hasFlags) {
                flag = this.flags;
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
                value = PdfFormFieldVisibility.visibleNotPrintable;
            }
        } else {
            return this._visibility;
        }
        return value;
    }
    /**
     * Sets the visibility.
     *
     * @param {PdfFormFieldVisibility} value Visibility option.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the form field at index 0
     * let field: PdfField = document.form.fieldAt(0);
     * // Sets the visibility.
     * let field.itemAt(0).visibility = PdfFormFieldVisibility.hiddenPrintable;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set visibility(value: PdfFormFieldVisibility) {
        if (this._isLoaded) {
            _updateVisibility(this._dictionary, value);
            this._dictionary._updated = true;
        } else {
            switch (value) {
            case PdfFormFieldVisibility.hidden:
                this.flags = PdfAnnotationFlag.hidden;
                break;
            case PdfFormFieldVisibility.hiddenPrintable:
                this.flags = PdfAnnotationFlag.noView | PdfAnnotationFlag.print;
                break;
            case PdfFormFieldVisibility.visible:
                this.flags = PdfAnnotationFlag.print;
                break;
            case PdfFormFieldVisibility.visibleNotPrintable:
                this.flags = PdfAnnotationFlag.default;
                break;
            }
            this._visibility = value;
        }
    }
    /**
     * Gets the font of the item.
     *
     * @returns {PdfFont} font.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the form field at index 0
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Get the first item of the field
     * let item: PdfWidgetAnnotation = field.itemAt(0);
     * // Gets the font of the item.
     * let font: PdfFont = item.font;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get font(): PdfFont {
        if (!this._pdfFont) {
            let fontName: string;
            if (this._crossReference) {
                const form: PdfForm = this._crossReference._document.form;
                const fontData: { name: string, size: number, style: PdfFontStyle } = this._obtainFontDetails();
                if (form && form._dictionary.has('DR')) {
                    const resources: _PdfDictionary = form._dictionary.get('DR');
                    if (resources.has('Font')) {
                        const fonts: _PdfDictionary = resources.get('Font');
                        if (fonts.has(fontData.name)) {
                            const fontDictionary: _PdfDictionary = fonts.get(fontData.name);
                            if (fontDictionary && fontData.name && fontDictionary.has('BaseFont')) {
                                const baseFont: _PdfName = fontDictionary.get('BaseFont');
                                let textFontStyle: PdfFontStyle = PdfFontStyle.regular;
                                if (baseFont) {
                                    fontName = baseFont.name;
                                    textFontStyle = _getFontStyle(baseFont.name);
                                    if (fontName.includes('-')) {
                                        fontName = fontName.substring(0, fontName.indexOf('-'));
                                    }
                                    this._pdfFont = _mapFont(fontName, fontData.size, textFontStyle, this);
                                }
                            }
                        }
                    }
                }
            }
        }
        if ((this._pdfFont === null || typeof this._pdfFont === 'undefined') || (!this._isLoaded && this._pdfFont.size === 1)) {
            this._pdfFont = this._circleCaptionFont;
        }
        return this._pdfFont;
    }
    /**
     * Sets the font of the item.
     *
     * @param {PdfFont} value font.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the form field at index 0
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Get the first item of the field
     * let item: PdfWidgetAnnotation = field.itemAt(0);
     * // Set the font of the item.
     * item.font = new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set font(value: PdfFont) {
        if (value && value instanceof PdfFont) {
            this._pdfFont = value;
            this._initializeFont(value);
        }
    }
    get _defaultAppearance(): _PdfDefaultAppearance {
        if (typeof this._da === 'undefined' && this._dictionary.has('DA')) {
            const da: string = this._dictionary.get('DA');
            if (da && da !== '') {
                this._da = new _PdfDefaultAppearance(da);
            }
        }
        return this._da;
    }
    get _mkDictionary(): _PdfDictionary {
        let value: _PdfDictionary;
        if (this._dictionary.has('MK')) {
            value = this._dictionary.get('MK');
        }
        return value;
    }
    _create(page: PdfPage, bounds: {x: number, y: number, width: number, height: number}, field?: PdfField): _PdfDictionary {
        this._page = page;
        this._crossReference = page._crossReference;
        this._ref = this._crossReference._getNextReference();
        this._dictionary = new _PdfDictionary(this._crossReference);
        this._crossReference._cacheMap.set(this._ref, this._dictionary);
        this._dictionary._currentObj = this;
        this._dictionary.objId = this._ref.toString();
        this._dictionary.update('Type', _PdfName.get('Annot'));
        this._dictionary.update('Subtype', _PdfName.get('Widget'));
        this.flags |= PdfAnnotationFlag.print;
        this._dictionary.update('P', page._ref);
        page._addWidget(this._ref);
        this.border = new PdfAnnotationBorder();
        this.bounds = bounds;
        if (field) {
            this._field = field;
            this._dictionary.update('Parent', this._field._ref);
        }
        return this._dictionary;
    }
    _doPostProcess(isFlatten: boolean = false, recreateAppearance: boolean = false): void {
        if (isFlatten || recreateAppearance) {
            let appearanceStream: _PdfBaseStream;
            if (recreateAppearance || (isFlatten && !this._dictionary.has('AP'))) {
                //appearanceStream = this._createAppearance();
            }
            if (!appearanceStream && this._dictionary.has('AP')) {
                const dictionary: _PdfDictionary = this._dictionary.get('AP');
                if (dictionary && dictionary.has('N')) {
                    appearanceStream = dictionary.get('N');
                    const reference: _PdfReference = dictionary.getRaw('N');
                    if (reference && appearanceStream) {
                        appearanceStream.reference = reference;
                    }
                }
            }
            if (appearanceStream) {
                let bounds: {x: number, y: number, width: number, height: number};
                if (isFlatten) {
                    const template: PdfTemplate = new PdfTemplate(appearanceStream, this._crossReference);
                    const page: PdfPage = this._getPage();
                    if (page) {
                        const graphics: PdfGraphics = page.graphics;
                        graphics.save();
                        if (page.rotation === PdfRotationAngle.angle90) {
                            graphics.translateTransform(graphics._size[0], graphics._size[1]);
                            graphics.rotateTransform(90);
                        } else if (page.rotation === PdfRotationAngle.angle180) {
                            graphics.translateTransform(graphics._size[0], graphics._size[1]);
                            graphics.rotateTransform(-180);
                        } else if (page.rotation === PdfRotationAngle.angle270) {
                            graphics.translateTransform(graphics._size[0], graphics._size[1]);
                            graphics.rotateTransform(270);
                        }
                        bounds = {x: this.bounds.x, y: this.bounds.y, width: template._size[0], height: template._size[1]};
                        graphics.drawTemplate(template, bounds);
                        graphics.restore();
                    }
                } else {
                    let appearance: _PdfDictionary;
                    if (this._dictionary.has('AP')) {
                        appearance = this._dictionary.get('AP');
                    } else {
                        const reference: _PdfReference = this._crossReference._getNextReference();
                        appearance = new _PdfDictionary(this._crossReference);
                        this._crossReference._cacheMap.set(reference, appearance);
                        this._dictionary.update('AP', reference);
                    }
                    _removeDuplicateReference(appearance, this._crossReference, 'N');
                    const reference: _PdfReference = this._crossReference._getNextReference();
                    this._crossReference._cacheMap.set(reference, appearanceStream);
                    appearance.update('N', reference);
                }
            }
            this._dictionary._updated = false;
        }
    }
    _initializeFont(font: PdfFont): void {
        this._pdfFont = font;
        let document: PdfDocument;
        if (this._crossReference) {
            document = this._crossReference._document;
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
            if (resource.has('Font')) {
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
            const keyName: _PdfName = _PdfName.get(_getNewGuidString());
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, this._pdfFont._dictionary);
            if (font instanceof PdfTrueTypeFont) {
                if (this._pdfFont._pdfFontInternals) {
                    this._crossReference._cacheMap.set(reference, this._pdfFont._pdfFontInternals);
                }
            } else if (this._pdfFont._dictionary) {
                this._crossReference._cacheMap.set(reference, this._pdfFont._dictionary);
            }
            fontDict.update(keyName.name, reference);
            resource._updated = true;
            document.form._dictionary.update('DR', resource);
            document.form._dictionary._updated = true;
            this._fontName = keyName.name;
            const defaultAppearance: _PdfDefaultAppearance = new _PdfDefaultAppearance();
            defaultAppearance.fontName = this._fontName;
            defaultAppearance.fontSize = this._pdfFont._size;
            defaultAppearance.color = this.color ? this.color : [0, 0, 0];
            this._dictionary.update('DA', defaultAppearance.toString());
            if (isReference) {
                resource._updated = true;
            }
            this._isFont = true;
        }
    }
    _getPage(): PdfPage {
        if (!this._page) {
            let document: PdfDocument;
            if (this._crossReference) {
                document = this._crossReference._document;
            }
            let page: PdfPage;
            if (this._dictionary.has('P')) {
                const ref: _PdfReference = this._dictionary.getRaw('P');
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
            if (!page && document && this._ref) {
                page = _findPage(document, this._ref);
            }
            this._page = page;
        }
        return this._page;
    }
    _beginSave(): void {
        if (!this._isLoaded && !this._page._isNew) {
            const value: {x: number, y: number, width: number, height: number} = this._bounds;
            this._dictionary.update('Rect', _getUpdatedBounds([value.x, value.y, value.width, value.height], this._page));
        }
    }
    _parseBackColor(): number[] {
        let value: number[];
        if ((this._isLoaded && this._hasBackColor) || (!this._isLoaded && !this._isTransparentBackColor)) {
            if (typeof this._backColor === 'undefined') {
                const dictionary: _PdfDictionary = this._mkDictionary;
                if (dictionary && dictionary.has('BG')) {
                    const colorArray: number[] = dictionary.getArray('BG');
                    if (colorArray) {
                        this._backColor = _parseColor(colorArray);
                    }
                }
            }
            if (typeof this._backColor === 'undefined' || this._backColor === null) {
                this._backColor = [255, 255, 255];
            }
            value = this._backColor;
        }
        return value;
    }
    _parseBorderColor(): number[] {
        let value: number[];
        if ((this._isLoaded && this._hasBorderColor) || (!this._isLoaded && !this._isTransparentBorderColor)) {
            if (typeof this._borderColor === 'undefined') {
                const dictionary: _PdfDictionary = this._mkDictionary;
                if (dictionary && dictionary.has('BC')) {
                    const colorArray: number[] = dictionary.getArray('BC');
                    if (colorArray) {
                        this._borderColor = _parseColor(colorArray);
                    }
                }
            }
            if (typeof this._borderColor === 'undefined' || this._borderColor === null) {
                this._borderColor = [0, 0, 0];
            }
            value = this._borderColor;
        }
        return value;
    }
    _updateBackColor(value: number[], setAppearance: boolean = false): void {
        let isChanged: boolean = false;
        if (value.length === 4 && value[3] !== 255) {
            this._isTransparentBackColor = true;
            if (this._dictionary.has('BG')) {
                delete this._dictionary._map.BG;
                isChanged = true;
            }
            const mkDictionary: _PdfDictionary = this._mkDictionary;
            if (mkDictionary && mkDictionary.has('BG')) {
                delete mkDictionary._map.BG;
                this._dictionary._updated = true;
                isChanged = true;
            }
        } else {
            this._isTransparentBackColor = false;
            if (typeof this.backColor === 'undefined' || this._backColor !== value) {
                if (typeof this._mkDictionary === 'undefined') {
                    this._dictionary.update('MK', new _PdfDictionary(this._crossReference));
                }
                this._mkDictionary.update('BG', [Number.parseFloat((value[0] / 255).toFixed(3)),
                    Number.parseFloat((value[1] / 255).toFixed(3)),
                    Number.parseFloat((value[2] / 255).toFixed(3))]);
                this._backColor = [value[0], value[1], value[2]];
                this._dictionary._updated = true;
                isChanged = true;
            }
        }
        if (setAppearance && isChanged && this._field) {
            this._field._setAppearance = true;
        }
    }
    _updateBorderColor(value: number[]): void {
        if (value.length === 4 && value[3] !== 255) {
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
        } else {
            this._isTransparentBorderColor = false;
            if (typeof this.borderColor === 'undefined' || this.borderColor !== value) {
                if (typeof this._mkDictionary === 'undefined') {
                    this._dictionary.update('MK', new _PdfDictionary(this._crossReference));
                }
                this._mkDictionary.update('BC', [Number.parseFloat((value[0] / 255).toFixed(3)),
                    Number.parseFloat((value[1] / 255).toFixed(3)),
                    Number.parseFloat((value[2] / 255).toFixed(3))]);
                this._borderColor = [value[0], value[1], value[2]];
                this._dictionary._updated = true;
            }
        }
    }
}
/**
 * `PdfStateItem` class represents the check box field item objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access check box field
 * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
 * // Access first item of check box field
 * let item: PdfStateItem = field.itemAt(0) as PdfStateItem;
 * // Sets the check box style as check
 * item.style = PdfCheckBoxStyle.check;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfStateItem extends PdfWidgetAnnotation {
    _style: PdfCheckBoxStyle;
    _styleText: string;
    /**
     * Initializes a new instance of the `PdfStateItem` class.
     *
     * @private
     */
    constructor() {
        super();
    }
    /**
     * Parse an existing item of the field.
     *
     * @private
     * @param {_PdfDictionary} dictionary Widget dictionary.
     * @param {_PdfCrossReference} crossReference PDF cross reference.
     * @param {PdfField} field Field object.
     * @returns {PdfStateItem} Widget.
     */
    static _load(dictionary: _PdfDictionary, crossReference: _PdfCrossReference, field?: PdfField): PdfStateItem {
        const widget: PdfStateItem = new PdfStateItem();
        widget._isLoaded = true;
        widget._dictionary = dictionary;
        widget._crossReference = crossReference;
        widget._field = field;
        return widget;
    }
    /**
     * Gets the flag to indicate whether the field item is checked or not.
     *
     * @returns {boolean} Checked or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access check box field
     * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
     * // Access first item of check box field
     * let item: PdfStateItem = field.itemAt(0) as PdfStateItem;
     * // Gets the flag to indicate whether the field item is checked or not.
     * let checked: boolean = item.checked;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get checked(): boolean {
        return _checkField(this._dictionary);
    }
    /**
     * Sets the flag to indicate whether the field item is checked or not.
     *
     * @param {boolean} value Checked or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access check box field
     * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
     * // Access first item of check box field
     * let item: PdfStateItem = field.itemAt(0) as PdfStateItem;
     * // Sets the style of the annotation
     * item.checked = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set checked(value: boolean) {
        if (this.checked !== value) {
            this._dictionary.update('AS', _PdfName.get(value ? 'Yes' : 'Off'));
        }
    }
    /**
     * Gets the style of annotation.
     *
     * @returns {PdfCheckBoxStyle} Style of annotation.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access check box field
     * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
     * // Access first item of check box field
     * let item: PdfStateItem = field.itemAt(0) as PdfStateItem;
     * // Gets the style of the annotation
     * let style: PdfCheckBoxStyle = item.style;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get style(): PdfCheckBoxStyle {
        if (this._isLoaded) {
            const dictionary: _PdfDictionary = this._mkDictionary;
            if (dictionary && dictionary.has('CA')) {
                this._style = _stringToStyle(dictionary.get('CA'));
            } else {
                this._style = PdfCheckBoxStyle.check;
            }
        }
        return this._style;
    }
    /**
     * Sets the style of annotation.
     *
     * @param {PdfCheckBoxStyle} value Style of annotation.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access check box field
     * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
     * // Access first item of check box field
     * let item: PdfStateItem = field.itemAt(0) as PdfStateItem;
     * // Sets the style of the annotation
     * item.style = PdfCheckBoxStyle.check;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set style(value: PdfCheckBoxStyle) {
        if (this.style !== value) {
            this._style = value;
            let dictionary: _PdfDictionary = this._mkDictionary;
            if (!dictionary) {
                dictionary = new _PdfDictionary(this._crossReference);
                this._dictionary.update('MK', dictionary);
            }
            dictionary.update('CA', _styleToString(value));
        }
    }
    _doPostProcess(): void {
        const style: _PdfCheckFieldState = this.checked ? _PdfCheckFieldState.checked : _PdfCheckFieldState.unchecked;
        const template: PdfTemplate = _getStateTemplate(style, this);
        if (template) {
            const page: PdfPage = this._getPage();
            if (page) {
                const graphics: PdfGraphics = page.graphics;
                graphics.save();
                if (page.rotation === PdfRotationAngle.angle90) {
                    graphics.translateTransform(graphics._size[0], graphics._size[1]);
                    graphics.rotateTransform(90);
                } else if (page.rotation === PdfRotationAngle.angle180) {
                    graphics.translateTransform(graphics._size[0], graphics._size[1]);
                    graphics.rotateTransform(-180);
                } else if (page.rotation === PdfRotationAngle.angle270) {
                    graphics.translateTransform(graphics._size[0], graphics._size[1]);
                    graphics.rotateTransform(270);
                }
                graphics._sw._setTextRenderingMode(_TextRenderingMode.fill);
                graphics.drawTemplate(template, this.bounds);
                graphics.restore();
            }
        }
        this._dictionary._updated = false;
    }
    _postProcess(value?: string): void {
        const field: PdfCheckBoxField = this._field as PdfCheckBoxField;
        if (!value) {
            value = (field && field.checked) ? 'Yes' : 'Off';
        }
        this._dictionary.update('AS', _PdfName.get(value));
    }
    _setField(field: PdfField): void {
        this._field = field;
        this._field._stringFormat = new PdfStringFormat(this.textAlignment, PdfVerticalAlignment.middle);
        this._field._addToKid(this);
    }
}
/**
 * `PdfRadioButtonListItem` class represents the radio button field item objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new radio button list field
 * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
 * // Create and add first item
 * let first: PdfRadioButtonListItem = field.add('1-9', {x: 100, y: 140, width: 20, height: 20});
 * // Create and add second item
 * let second: PdfRadioButtonListItem = new PdfRadioButtonListItem('10-49', {x: 100, y: 170, width: 20, height: 20}, page);
 * field.add(second);
 * // Create and add third item
 * let third: PdfRadioButtonListItem = new PdfRadioButtonListItem('50-59', {x: 100, y: 200, width: 20, height: 20}, field);
 * field.add(third);
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
export class PdfRadioButtonListItem extends PdfStateItem {
    _optionValue: string;
    /**
     * Initializes a new instance of the `PdfRadioButtonListItem` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfRadioButtonListItem` class.
     *
     * @param {string} value Item value.
     * @param {{x: number, y: number, width: number, height: number}} bounds Item bounds.
     * @param {PdfField} field Field object.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
     * // Create and add first item
     * let first: PdfRadioButtonListItem = field.add('1-9', {x: 100, y: 140, width: 20, height: 20});
     * // Create and add second item
     * let second: PdfRadioButtonListItem = new PdfRadioButtonListItem('10-49', {x: 100, y: 170, width: 20, height: 20}, page);
     * field.add(second);
     * // Create and add third item
     * let third: PdfRadioButtonListItem = new PdfRadioButtonListItem('50-59', {x: 100, y: 200, width: 20, height: 20}, field);
     * field.add(third);
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
    constructor(value: string, bounds: {x: number, y: number, width: number, height: number}, field: PdfField)
    /**
     * Initializes a new instance of the `PdfRadioButtonListItem` class.
     *
     * @param {string} value Item value.
     * @param {{x: number, y: number, width: number, height: number}} bounds Item bounds.
     * @param {PdfPage} page Page object.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
     * // Create and add first item
     * let first: PdfRadioButtonListItem = field.add('1-9', {x: 100, y: 140, width: 20, height: 20});
     * // Create and add second item
     * let second: PdfRadioButtonListItem = new PdfRadioButtonListItem('10-49', {x: 100, y: 170, width: 20, height: 20}, page);
     * field.add(second);
     * // Create and add third item
     * let third: PdfRadioButtonListItem = new PdfRadioButtonListItem('50-59', {x: 100, y: 200, width: 20, height: 20}, field);
     * field.add(third);
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
    constructor(value: string, bounds: {x: number, y: number, width: number, height: number}, page: PdfPage)
    constructor(value?: string, bounds?: {x: number, y: number, width: number, height: number}, item?: PdfField | PdfPage) {
        super();
        if (item && value && bounds) {
            if (item instanceof PdfField) {
                this._initializeItem(value, bounds, item.page, item);
            } else {
                this._initializeItem(value, bounds, item);
            }
        }
    }
    /**
     * Parse an existing item of the field.
     *
     * @private
     * @param {_PdfDictionary} dictionary Widget dictionary.
     * @param {_PdfCrossReference} crossReference PDF cross reference.
     * @param {PdfField} field Field object.
     * @returns {PdfRadioButtonListItem} Widget.
     */
    static _load(dictionary: _PdfDictionary, crossReference: _PdfCrossReference, field?: PdfField): PdfRadioButtonListItem {
        const widget: PdfRadioButtonListItem = new PdfRadioButtonListItem();
        widget._isLoaded = true;
        widget._dictionary = dictionary;
        widget._crossReference = crossReference;
        widget._field = field;
        return widget;
    }
    /**
     * Gets the flag to indicate whether the field item is selected or not.
     *
     * @returns {boolean} Selected or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
     * // Access first list field item
     * let item: PdfRadioButtonListItem = field.itemAt(0);
     * // Gets the flag to indicate whether the field item is selected or not.
     * let selected: boolean = item.selected;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get selected(): boolean {
        return this._index === (this._field as PdfRadioButtonListField).selectedIndex;
    }
    /**
     * Gets the value of the radio button list field item
     *
     * @returns {string} Value of the radio button list field item.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
     * // Access first list field item
     * let item: PdfRadioButtonListItem = field.itemAt(0);
     * // Gets the value of the radio button list field item
     * let value: string = item.value;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get value(): string {
        if (this._isLoaded && !this._optionValue) {
            this._optionValue = _getItemValue(this._dictionary);
        }
        return this._optionValue;
    }
    /**
     * Sets the value of the radio button list field item
     *
     * @param {string} option Value of the radio button list field item.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfRadioButtonListField = new PdfRadioButtonListField(page, 'Age');
     * // Access first list field item
     * let item: PdfRadioButtonListItem = field.itemAt(0);
     * // Sets the value of the radio button list field item
     * item.value = '1-9';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set value(option: string) {
        this._optionValue = option;
    }
    /**
     * Gets the back color of the annotation.
     *
     * @returns {number[]} Color as R, G, B color array in between 0 to 255.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfWidgetAnnotation = page.annotations.at(0) as PdfWidgetAnnotation;
     * // Gets the back color of the annotation
     * let backColor: number[] = annotation.backColor;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get backColor(): number[] {
        return this._parseBackColor();
    }
    /**
     * Sets the back color of the annotation.
     *
     * @param {number[]} value Array with R, G, B, A color values in between 0 to 255. For optional A (0-254), it signifies transparency.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Access the radio button list field
     * let field: PdfRadioButtonListField = form.fieldAt(0) as PdfRadioButtonListField;
     * // Sets the back color of the radio button list item
     * field.itemAt(0).backColor = [255, 255, 255];
     * // Sets the background color of the field item to transparent
     * field.itemAt(1).backColor = [0, 0, 0, 0];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set backColor(value: number[]) {
        this._updateBackColor(value, true);
    }
    _initializeItem(value: string, bounds: {x: number, y: number, width: number, height: number}, page: PdfPage, field?: PdfField): void {
        this._optionValue = value;
        this._page = page;
        this._create(this._page, bounds, this._field);
        this.textAlignment = PdfTextAlignment.left;
        this._dictionary.update('MK', new _PdfDictionary(this._crossReference));
        this._mkDictionary.update('BC', [0, 0, 0]);
        this._mkDictionary.update('BG', [1, 1, 1]);
        this.style = PdfCheckBoxStyle.circle;
        this._dictionary.update('DA', '/TiRo 0 Tf 0 0 0 rg');
        if (field) {
            this._setField(field);
            this._dictionary.update('Parent', field._ref);
        }
    }
    _postProcess(value?: string): void {
        const field: PdfRadioButtonListField = this._field as PdfRadioButtonListField;
        if (!value && field && field.selectedIndex !== -1) {
            value = field.itemAt(field.selectedIndex).value;
        }
        if (this.value === value) {
            this._dictionary.update('AS', _PdfName.get(this.value));
        } else {
            this._dictionary.update('AS', _PdfName.get('Off'));
        }
    }
}
/**
 * `PdfListBoxItem` class represents the list and combo box field item objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0) as PdfPage;
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
export class PdfListFieldItem extends PdfStateItem {
    /**
     * Initializes a new instance of the `PdfListFieldItem` class.
     *
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfListFieldItem` class.
     *
     * @param {string} text The text to be displayed.
     * @param {string} value The value of the item.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0) as PdfPage;
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
    constructor(text: string, value: string)
    /**
     * Initializes a new instance of the `PdfListFieldItem` class.
     *
     * @param {string} text The text to be displayed.
     * @param {string} value The value of the item.
     * @param {PdfListBoxField} field The field.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new list box field
     * let field: PdfListBoxField = new PdfListBoxField(page, 'list1', {x: 100, y: 60, width: 100, height: 50});
     * // Create and add list items to the field.
     * let item: PdfListFieldItem = new PdfListFieldItem('English', 'English', field);
     * // Add list items to the field.
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
    constructor(text: string, value: string, field: PdfListBoxField)
    constructor(text?: string, value?: string, field?: PdfListBoxField) {
        super();
        if (text && value) {
            this._initializeItem(text, value, field);
        }
    }
    /**
     * Parse an existing item of the field.
     *
     * @private
     * @param {_PdfDictionary} dictionary Widget dictionary.
     * @param {_PdfCrossReference} crossReference PDF cross reference.
     * @param {PdfField} field Field object.
     * @returns {PdfListFieldItem} Widget.
     */
    static _load(dictionary: _PdfDictionary, crossReference: _PdfCrossReference, field?: PdfField): PdfListFieldItem {
        const widget: PdfListFieldItem = new PdfListFieldItem();
        widget._isLoaded = true;
        widget._dictionary = dictionary;
        widget._crossReference = crossReference;
        widget._field = field;
        return widget;
    }
    /**
     * Gets the text of the annotation.
     *
     * @returns {string} Text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfListBoxField = form.fieldAt(0) as PdfListBoxField;
     * // Access first list field item
     * let item: PdfListFieldItem = field.itemAt(0);
     * // Gets the text of the list field item
     * let text: string = item.text;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get text(): string {
        if (typeof this._text === 'undefined' &&
            typeof this._field !== 'undefined' &&
            (this._field instanceof PdfListBoxField || this._field instanceof PdfComboBoxField)) {
            this._text = this._field._options[Number.parseInt(this._index.toString(), 10)][1];
        }
        return this._text;
    }
    /**
     * Sets the text of the annotation.
     *
     * @param {string} value Text.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfListBoxField = form.fieldAt(0) as PdfListBoxField;
     * // Access first list field item
     * let item: PdfListFieldItem = field.itemAt(0);
     * // Sets the text of the list field item
     * item.text = '1-9';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set text(value: string) {
        if (typeof value === 'string' &&
            typeof this._field !== 'undefined' &&
            (this._field instanceof PdfListBoxField || this._field instanceof PdfComboBoxField)) {
            if (value !== this._field._options[Number.parseInt(this._index.toString(), 10)][1]) {
                this._field._options[Number.parseInt(this._index.toString(), 10)][1] = value;
                this._text = value;
                this._field._dictionary._updated = true;
            }
        }
    }
    /**
     * Gets the flag to indicate whether the field item is selected or not (Read only).
     *
     * @returns {boolean} Selected or not.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new radio button list field
     * let field: PdfListBoxField = form.fieldAt(0) as PdfListBoxField;
     * // Access first list field item
     * let item: PdfListFieldItem = field.itemAt(0);
     * // Gets the flag to indicate whether the field item is selected or not.
     * let selected: boolean = item.selected;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get selected(): boolean {
        return this._index === (this._field as PdfListBoxField).selectedIndex;
    }
    _initializeItem(text: string, value: string, field?: PdfField): void {
        this._text = text;
        this._value = value;
        if (field && field instanceof PdfListBoxField) {
            field._addToOptions(this, field);
        }
    }
}
/**
 * `PdfAnnotationCaption` class represents the caption text and properties of annotations.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Get the first annotation of the page
 * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
 * // Create and set annotation caption values
 * annotation.caption = new PdfAnnotationCaption(true, PdfLineCaptionType.inline, [10, 10]);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfAnnotationCaption {
    _dictionary: _PdfDictionary;
    _cap: boolean;
    _type: PdfLineCaptionType;
    _offset: Array<number>;
    /**
     * Initializes a new instance of the `PdfAnnotationCaption` class.
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfAnnotationCaption` class.
     *
     * @param {boolean} cap Boolean flag to set caption.
     * @param {PdfLineCaptionType} type Caption type.
     * @param {Array<number>} offset Caption offset.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Create and set annotation caption values
     * annotation.caption = new PdfAnnotationCaption(true, PdfLineCaptionType.inline, [10, 10]);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(cap: boolean, type: PdfLineCaptionType, offset: Array<number>)
    constructor(cap?: boolean, type?: PdfLineCaptionType, offset?: Array<number>) {
        this._cap = typeof cap !== 'undefined' ? cap : false;
        this._type = typeof type !== 'undefined' ? type : PdfLineCaptionType.inline;
        this._offset = typeof offset !== 'undefined' ? offset : [0, 0];
    }
    /**
     * Gets the boolean flag indicating whether annotation has caption or not.
     *
     * @returns {boolean} Caption.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the boolean flag indicating whether annotation has caption or not.
     * let cap: boolean = annotation.caption.cap;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get cap(): boolean {
        return this._cap;
    }
    /**
     * Sets the boolean flag indicating whether annotation has caption or not.
     *
     * @param {boolean} value Caption.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the boolean flag indicating whether annotation has caption or not.
     * annotation.caption.cap = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set cap(value: boolean) {
        if (value !== this._cap) {
            this._cap = value;
            if (this._dictionary) {
                this._dictionary.update('Cap', value);
            }
        }
    }
    /**
     * Gets the caption type of the annotation.
     *
     * @returns {PdfLineCaptionType} Caption type.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the caption type of the annotation.
     * let type: PdfLineCaptionType = annotation.caption.type;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get type(): PdfLineCaptionType {
        return this._type;
    }
    /**
     * Sets the caption type of the annotation.
     *
     * @param {PdfLineCaptionType} value Caption type.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the caption type of the annotation.
     * annotation.caption.type = PdfLineCaptionType.inline;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set type(value: PdfLineCaptionType) {
        if (value !== this._type) {
            this._type = value;
            if (this._dictionary) {
                this._dictionary.update('CP', _PdfName.get(value === PdfLineCaptionType.top ? 'Top' : 'Inline'));
            }
        }
    }
    /**
     * Gets the offset position of the annotation.
     *
     * @returns {Array<number>} Caption offset.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the offset position of the annotation.
     * let offset: Array<number> = annotation.caption.offset;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get offset(): Array<number> {
        return this._offset;
    }
    /**
     * Sets the offset position of the annotation.
     *
     * @param {Array<number>} value Caption offset.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Sets the offset position of the annotation.
     * annotation.caption.offset = [10, 10];
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set offset(value: Array<number>) {
        if (_areNotEqual(value, this._offset)) {
            this._offset = value;
            if (this._dictionary) {
                this._dictionary.update('CO', value);
            }
        }
    }
}
/**
 * `PdfAnnotationLineEndingStyle` class represents the line ending styles of annotations.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Get the first annotation of the page
 * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
 * // Initializes a new instance of the `PdfAnnotationLineEndingStyle` class.
 * annotation.lineEndingStyle = new PdfAnnotationLineEndingStyle(PdfLineEndingStyle.openArrow, PdfLineEndingStyle.closeArrow);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfAnnotationLineEndingStyle {
    _dictionary: _PdfDictionary;
    _begin: PdfLineEndingStyle;
    _end: PdfLineEndingStyle;
    _crossReference: _PdfCrossReference;
    /**
     * Initializes a new instance of the `PdfAnnotationLineEndingStyle` class.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Initializes a new instance of the `PdfAnnotationLineEndingStyle` class.
     * let lineEndingStyle = new PdfAnnotationLineEndingStyle();
     * // Sets the begin line ending style of the annotation.
     * lineEndingStyle.begin = PdfLineEndingStyle.openArrow;
     * // Sets the end line ending style of the annotation.
     * lineEndingStyle.end = PdfLineEndingStyle.closeArrow;
     * // Sets the line ending style to the annotation
     * annotation.lineEndingStyle = lineEndingStyle;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfAnnotationLineEndingStyle` class.
     *
     * @param {PdfLineEndingStyle} begin Begin line ending style.
     * @param {PdfLineEndingStyle} end End line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Initializes a new instance of the `PdfAnnotationLineEndingStyle` class.
     * annotation.lineEndingStyle = new PdfAnnotationLineEndingStyle(PdfLineEndingStyle.openArrow, PdfLineEndingStyle.closeArrow);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(begin: PdfLineEndingStyle, end: PdfLineEndingStyle)
    constructor(begin?: PdfLineEndingStyle, end?: PdfLineEndingStyle) {
        this._begin = typeof begin !== 'undefined' ? begin : PdfLineEndingStyle.none;
        this._end = typeof end !== 'undefined' ? end : PdfLineEndingStyle.none;
    }
    /**
     * Gets the begin line ending style of the annotation.
     *
     * @returns {PdfLineEndingStyle} Begin line ending style.
     * `PdfAnnotationLineEndingStyle` class represents the line ending styles of annotations.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the begin line ending style of the annotation.
     * let begin: PdfLineEndingStyle = annotation.lineEndingStyle.begin;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get begin(): PdfLineEndingStyle {
        return this._begin;
    }
    /**
     * Sets the begin line ending style of the annotation.
     *
     * @param {PdfLineEndingStyle} value Begin line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Initializes a new instance of the `PdfAnnotationLineEndingStyle` class.
     * let lineEndingStyle = new PdfAnnotationLineEndingStyle();
     * // Sets the begin line ending style of the annotation.
     * lineEndingStyle.begin = PdfLineEndingStyle.openArrow;
     * // Sets the end line ending style of the annotation.
     * lineEndingStyle.end = PdfLineEndingStyle.closeArrow;
     * // Sets the line ending style to the annotation
     * annotation.lineEndingStyle = lineEndingStyle;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set begin(value: PdfLineEndingStyle ) {
        if (value !== this._begin) {
            this._begin = value;
            if (this._dictionary) {
                this._dictionary.update('LE', [_PdfName.get(_reverseMapEndingStyle(value)), _PdfName.get(_reverseMapEndingStyle(this._end))]);
            }
        }
    }
    /**
     * Gets the begin line ending style of the annotation.
     *
     * @returns {PdfLineEndingStyle} End line ending style.
     * `PdfAnnotationLineEndingStyle` class represents the line ending styles of annotations.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the end line ending style of the annotation.
     * let end: PdfLineEndingStyle = annotation.lineEndingStyle.end;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get end(): PdfLineEndingStyle {
        return this._end;
    }
    /**
     * Sets the begin line ending style of the annotation.
     *
     * @param {PdfLineEndingStyle} value End line ending style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Initializes a new instance of the `PdfAnnotationLineEndingStyle` class.
     * let lineEndingStyle = new PdfAnnotationLineEndingStyle();
     * // Sets the begin line ending style of the annotation.
     * lineEndingStyle.begin = PdfLineEndingStyle.openArrow;
     * // Sets the end line ending style of the annotation.
     * lineEndingStyle.end = PdfLineEndingStyle.closeArrow;
     * // Sets the line ending style to the annotation
     * annotation.lineEndingStyle = lineEndingStyle;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set end(value: PdfLineEndingStyle) {
        if (value !== this._end) {
            this._end = value;
            if (this._dictionary) {
                this._dictionary.update('LE', [_PdfName.get(_reverseMapEndingStyle(this._begin)), _PdfName.get(_reverseMapEndingStyle(value))]);
            }
        }
    }
}
/**
 * `PdfInteractiveBorder` class represents the border of the field.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the PDF form field
 * let field: PdfField = document.form.fieldAt(0);
 * // Gets the width of the field border.
 * let width: number = field.border.width;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfInteractiveBorder {
    _dictionary: _PdfDictionary;
    _width: number;
    _style: PdfBorderStyle;
    _dash: Array<number>;
    _crossReference: _PdfCrossReference;
    /**
     * Initializes a new instance of the `PdfInteractiveBorder` class.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the PDF form field
     * let field: PdfField = document.form.fieldAt(0);
     * // Initializes a new instance of the `PdfInteractiveBorder` class.
     * let border: PdfInteractiveBorder = new PdfInteractiveBorder();
     * //Sets the width of the annotation border.
     * border.width = 10;
     * //Sets the style of the annotation border.
     * border.style = PdfBorderStyle.dashed;
     * //Sets the dash pattern of the annotation border.
     * border.dash = [1, 2, 1];
     * // Sets the border to the PDF form field
     * field.border = border;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfInteractiveBorder` class.
     *
     * @param {number} width Border width.
     * @param {PdfBorderStyle} style Border style.
     * @param {Array<number>} dash Dash pattern.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the PDF form field
     * let field: PdfField = document.form.fieldAt(0);
     * // Initializes a new instance of the `PdfInteractiveBorder` class.
     * field.border = new PdfInteractiveBorder(2, PdfBorderStyle.dashed, [1, 2, 1]);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(width: number, style: PdfBorderStyle, dash: Array<number>)
    constructor(width?: number, style?: PdfBorderStyle, dash?: Array<number>) {
        this._width = typeof width !== 'undefined' ? width : 1;
        this._style = typeof style !== 'undefined' ? style : PdfBorderStyle.solid;
        if (typeof dash !== 'undefined' && Array.isArray(dash)) {
            this._dash = dash;
        }
    }
    /**
     * Gets the width of the field border.
     *
     * @returns {number} border width.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the PDF form field
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the width of the annotation border.
     * let width: number = field.border.width;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get width(): number {
        return this._width;
    }
    /**
     * Sets the width of the field border.
     *
     * @param {number} value width.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the PDF form field
     * let field: PdfField = document.form.fieldAt(0);
     * // Initializes a new instance of the `PdfInteractiveBorder` class.
     * let border: PdfInteractiveBorder = new PdfInteractiveBorder();
     * //Sets the width of the annotation border.
     * border.width = 10;
     * //Sets the style of the annotation border.
     * border.style = PdfBorderStyle.dashed;
     * //Sets the dash pattern of the annotation border.
     * border.dash = [1, 2, 1];
     * // Sets the border to the PDF form field
     * field.border = border;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set width(value: number) {
        if (value !== this._width) {
            this._width = value;
            if (this._dictionary) {
                const bs: _PdfDictionary = this._dictionary.has('BS') ? this._dictionary.get('BS') : new _PdfDictionary(this._crossReference);
                bs.update('Type', _PdfName.get('Border'));
                bs.update('W', this._width);
                bs.update('S', _mapBorderStyle(this._style));
                if (this._dash) {
                    bs.update('D', this._dash);
                }
                this._dictionary.update('BS', bs);
                this._dictionary._updated = true;
            }
        }
    }
    /**
     * Gets the border line style of the field border.
     *
     * @returns {PdfBorderStyle} Border style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the PDF form field
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the border line style of the annotation border.
     * let style: PdfBorderStyle = field.border.style;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get style(): PdfBorderStyle {
        return this._style;
    }
    /**
     * Sets the border line style of the field border.
     *
     * @param {PdfBorderStyle} value Border style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the PDF form field
     * let field: PdfField = document.form.fieldAt(0);
     * // Initializes a new instance of the `PdfInteractiveBorder` class.
     * let border: PdfInteractiveBorder = new PdfInteractiveBorder();
     * //Sets the width of the annotation border.
     * border.width = 10;
     * //Sets the style of the annotation border.
     * border.style = PdfBorderStyle.dashed;
     * //Sets the dash pattern of the annotation border.
     * border.dash = [1, 2, 1];
     * // Sets the border to the PDF form field
     * field.border = border;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set style(value: PdfBorderStyle) {
        if (value !== this._style) {
            this._style = value;
            if (this._dictionary) {
                const bs: _PdfDictionary = this._dictionary.has('BS') ? this._dictionary.get('BS') : new _PdfDictionary(this._crossReference);
                bs.update('Type', _PdfName.get('Border'));
                bs.update('W', this._width);
                bs.update('S', _mapBorderStyle(this._style));
                if (this._dash) {
                    bs.update('D', this._dash);
                }
                this._dictionary.update('BS', bs);
                this._dictionary._updated = true;
            }
        }
    }
    /**
     * Gets the dash pattern of the field border.
     *
     * @returns {Array<number>} Dash pattern.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the PDF form field
     * let field: PdfField = document.form.fieldAt(0);
     * // Gets the dash pattern of the field border.
     * let dash: Array<number> = field.border.dash;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get dash(): Array<number> {
        return this._dash;
    }
    /**
     * Sets the dash pattern of the field border.
     *
     * @param {Array<number>} value Dash pattern.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the PDF form field
     * let field: PdfField = document.form.fieldAt(0);
     * // Initializes a new instance of the `PdfInteractiveBorder` class.
     * let border: PdfInteractiveBorder = new PdfInteractiveBorder();
     * //Sets the width of the annotation border.
     * border.width = 10;
     * //Sets the style of the annotation border.
     * border.style = PdfBorderStyle.dashed;
     * //Sets the dash pattern of the annotation border.
     * border.dash = [1, 2, 1];
     * // Sets the border to the PDF form field
     * field.border = border;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set dash(value: Array<number>) {
        if (typeof this._dash === 'undefined' || _areNotEqual(value, this._dash)) {
            this._dash = value;
            if (this._dictionary) {
                const bs: _PdfDictionary = this._dictionary.has('BS') ? this._dictionary.get('BS') : new _PdfDictionary(this._crossReference);
                bs.update('Type', _PdfName.get('Border'));
                bs.update('W', this._width);
                bs.update('S', _mapBorderStyle(this._style));
                bs.update('D', this._dash);
                this._dictionary.update('BS', bs);
                this._dictionary._updated = true;
            }
        }
    }
}
/**
 * `PdfAnnotationBorder` class represents the border properties of annotations.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Get the first annotation of the page
 * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
 * // Initializes a new instance of the ` PdfAnnotationBorder ` class.
 * let border: PdfAnnotationBorder = new PdfAnnotationBorder ();
 * //Sets the width of the annotation border.
 * border.width = 10;
 * //Sets the style of the annotation border.
 * border.style = PdfBorderStyle.dashed;
 * //Sets the dash pattern of the annotation border.
 * border.dash = [1, 2, 1];
 * // Sets the border to the PDF form field
 * annotation.border = border;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfAnnotationBorder extends PdfInteractiveBorder {
    _hRadius: number;
    _vRadius: number;
    /**
     * Initializes a new instance of the `PdfAnnotationBorder` class.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Initializes a new instance of the ` PdfAnnotationBorder ` class.
     * let border: PdfAnnotationBorder = new PdfAnnotationBorder ();
     * //Sets the width of the annotation border.
     * border.width = 10;
     * //Sets the style of the annotation border.
     * border.style = PdfBorderStyle.dashed;
     * //Sets the dash pattern of the annotation border.
     * border.dash = [1, 2, 1];
     * // Sets the border to the PDF form field
     * annotation.border = border;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfAnnotationBorder` class.
     *
     * @param {number} width Border width.
     * @param {number} hRadius Border horizontal radius.
     * @param {number} vRadius Border vertical radius.
     * @param {PdfBorderStyle} style Border style.
     * @param {Array<number>} dash Dash pattern.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Initializes a new instance of the `PdfAnnotationBorder` class and sets into PDF annotation.
     * annotation.border = new PdfAnnotationBorder(10, 2, 3, PdfBorderStyle.dashed, [1, 2, 1]);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(width: number, hRadius: number, vRadius: number, style: PdfBorderStyle, dash: Array<number>)
    constructor(width?: number, hRadius?: number, vRadius?: number, style?: PdfBorderStyle, dash?: Array<number>) {
        super(width, style, dash);
        this._hRadius = typeof hRadius !== 'undefined' ? hRadius : 0;
        this._vRadius = typeof vRadius !== 'undefined' ? vRadius : 0;
    }
    /**
     * Gets the width of the annotation border.
     *
     * @returns {number} border width.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the width of the annotation border.
     * let width: number = annotation.border.width;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get width(): number {
        return this._width;
    }
    /**
     * Sets the width of the annotation border.
     *
     * @param {number} value width.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Initializes a new instance of the ` PdfAnnotationBorder ` class.
     * let border: PdfAnnotationBorder = new PdfAnnotationBorder ();
     * //Sets the width of the annotation border.
     * border.width = 10;
     * //Sets the style of the annotation border.
     * border.style = PdfBorderStyle.dashed;
     * //Sets the dash pattern of the annotation border.
     * border.dash = [1, 2, 1];
     * // Sets the border to the PDF form field
     * annotation.border = border;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set width(value: number) {
        if (value !== this._width) {
            this._width = value;
            if (this._dictionary) {
                this._dictionary.update('Border', [this._hRadius, this._vRadius, this._width]);
                const bs: _PdfDictionary = this._dictionary.has('BS') ? this._dictionary.get('BS') : new _PdfDictionary(this._crossReference);
                bs.update('Type', _PdfName.get('Border'));
                bs.update('W', this._width);
                bs.update('S', _mapBorderStyle(this._style));
                if (this._dash) {
                    bs.update('D', this._dash);
                }
                this._dictionary.update('BS', bs);
                this._dictionary._updated = true;
            }
        }
    }
    /**
     * Gets the horizontal radius of the annotation border.
     *
     * @returns {number} horizontal radius.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the horizontal radius of the annotation border.
     * let hRadius: number = annotation.border.hRadius;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get hRadius(): number {
        return this._hRadius;
    }
    /**
     * Sets the horizontal radius of the annotation border.
     *
     * @param {number} value horizontal radius.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Initializes a new instance of the ` PdfAnnotationBorder ` class.
     * let border: PdfAnnotationBorder = new PdfAnnotationBorder ();
     * //Sets the width of the annotation border.
     * border.width = 10;
     * // Sets the horizontal radius of the annotation border.
     * border.hRadius = 2;
     * //Sets the style of the annotation border.
     * border.style = PdfBorderStyle.dashed;
     * //Sets the dash pattern of the annotation border.
     * border.dash = [1, 2, 1];
     * // Sets the border to the PDF form field
     * annotation.border = border;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set hRadius(value: number) {
        if (value !== this._hRadius) {
            this._hRadius = value;
            if (this._dictionary) {
                this._dictionary.update('Border', [this._hRadius, this._vRadius, this._width]);
            }
        }
    }
    /**
     * Gets the vertical radius of the annotation border.
     *
     * @returns {number} vertical radius.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Gets the vertical radius of the annotation border.
     * let vRadius: number = annotation.border.vRadius;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get vRadius(): number {
        return this._vRadius;
    }
    /**
     * Sets the vertical radius of the annotation border.
     *
     * @param {number} value vertical radius.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
     * // Initializes a new instance of the ` PdfAnnotationBorder ` class.
     * let border: PdfAnnotationBorder = new PdfAnnotationBorder ();
     * //Sets the width of the annotation border.
     * border.width = 10;
     * // Sets the vertical radius of the annotation border.
     * border.vRadius = 2;
     * //Sets the style of the annotation border.
     * border.style = PdfBorderStyle.dashed;
     * //Sets the dash pattern of the annotation border.
     * border.dash = [1, 2, 1];
     * // Sets the border to the PDF form field
     * annotation.border = border;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set vRadius(value: number) {
        if (value !== this._vRadius) {
            this._vRadius = value;
            if (this._dictionary) {
                this._dictionary.update('Border', [this._hRadius, this._vRadius, this._width]);
            }
        }
    }
}
/**
 * `PdfBorderEffect` class represents the border effects of annotations.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Get the first annotation of the page
 * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
 * // Initializes a new instance of the `PdfBorderEffect` class.
 * let borderEffect: PdfBorderEffect = new PdfBorderEffect();
 * // Sets the intensity of the annotation border.
 * borderEffect.intensity = 2;
 * // Sets the effect style of the annotation border.
 * borderEffect.style = PdfBorderEffectStyle.cloudy;
 * // Sets border effect to the annotation.
 * annotation.borderEffect = borderEffect;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfBorderEffect {
    _dictionary: _PdfDictionary;
    _intensity: number = 0;
    _style: PdfBorderEffectStyle;
    _crossReference: _PdfCrossReference;
    /**
     * Initializes a new instance of the `PdfBorderEffect` class.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Initializes a new instance of the `PdfBorderEffect` class.
     * let borderEffect: PdfBorderEffect = new PdfBorderEffect();
     * // Sets the intensity of the annotation border.
     * borderEffect.intensity = 2;
     * // Sets the effect style of the annotation border.
     * borderEffect.style = PdfBorderEffectStyle.cloudy;
     * // Sets border effect to the annotation.
     * annotation.borderEffect = borderEffect;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfBorderEffect` class.
     *
     * @private
     * @param {_PdfDictionary} dictionary Border effect dictionary.
     */
    constructor(dictionary: _PdfDictionary)
    constructor(dictionary?: _PdfDictionary) {
        if (typeof dictionary !== 'undefined' && dictionary !== null) {
            if (dictionary.has('BE')) {
                const borderEffect: _PdfDictionary = this._dictionary.get('BE');
                if (borderEffect) {
                    if (borderEffect.has('I')) {
                        this._intensity = borderEffect.get('I');
                    }
                    if (borderEffect.has('S')) {
                        this._style = this._getBorderEffect(borderEffect.get('S'));
                    }
                }
            }
        } else {
            this._dictionary = new _PdfDictionary();
            this._dictionary.set('I', this._intensity);
            this._dictionary.set('S', this._styleToEffect(this._style));
        }
    }
    /**
     * Gets the intensity of the annotation border.
     *
     * @returns {number} intensity.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Gets the intensity of the annotation border.
     * let intensity: number = annotation.borderEffect.intensity;
     * // Gets the effect style of the annotation border.
     * let style: PdfBorderEffectStyle = annotation.borderEffect.style;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get intensity(): number {
        return this._intensity;
    }
    /**
     * Sets the intensity of the annotation border.
     *
     * @param {number} value intensity.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Initializes a new instance of the `PdfBorderEffect` class.
     * let borderEffect: PdfBorderEffect = new PdfBorderEffect();
     * // Sets the intensity of the annotation border.
     * borderEffect.intensity = 2;
     * // Sets the effect style of the annotation border.
     * borderEffect.style = PdfBorderEffectStyle.cloudy;
     * // Sets border effect to the annotation.
     * annotation.borderEffect = borderEffect;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set intensity(value: number) {
        if (value !== this._intensity) {
            this._intensity = value;
            if (this._dictionary) {
                const bs: _PdfDictionary = this._dictionary.has('BE') ? this._dictionary.get('BE') : new _PdfDictionary(this._crossReference);
                bs.update('I', this._intensity);
                bs.update('S', this._styleToEffect(this._style));
                this._dictionary.update('BE', bs);
                this._dictionary._updated = true;
            }
            this._dictionary._updated = true;
        }
    }
    /**
     * Gets the effect style of the annotation border.
     *
     * @returns {PdfBorderEffectStyle} effect style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Gets the intensity of the annotation border.
     * let intensity: number = annotation.borderEffect.intensity;
     * // Gets the effect style of the annotation border.
     * let style: PdfBorderEffectStyle = annotation.borderEffect.style;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get style(): PdfBorderEffectStyle {
        return this._style;
    }
    /**
     * Sets the effect style of the annotation border.
     *
     * @param {PdfBorderEffectStyle} value effect style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the first annotation of the page
     * let annotation: PdfSquareAnnotation = page.annotations.at(0) as PdfSquareAnnotation;
     * // Initializes a new instance of the `PdfBorderEffect` class.
     * let borderEffect: PdfBorderEffect = new PdfBorderEffect();
     * // Sets the intensity of the annotation border.
     * borderEffect.intensity = 2;
     * // Sets the effect style of the annotation border.
     * borderEffect.style = PdfBorderEffectStyle.cloudy;
     * // Sets border effect to the annotation.
     * annotation.borderEffect = borderEffect;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set style(value: PdfBorderEffectStyle) {
        if (value !== this._style) {
            this._style = value;
            if (this._dictionary) {
                const bs: _PdfDictionary = this._dictionary.has('BE') ?
                    this._dictionary.get('BE') :
                    new _PdfDictionary(this._crossReference);
                bs.update('I', this._intensity);
                bs.update('S', this._styleToEffect(this._style));
                this._dictionary.update('BE', bs);
                this._dictionary._updated = true;
            }
        }
    }
    _getBorderEffect(value: string): PdfBorderEffectStyle {
        if (value === '/C') {
            return PdfBorderEffectStyle.cloudy;
        } else {
            return PdfBorderEffectStyle.solid;
        }
    }
    _styleToEffect(value: PdfBorderEffectStyle ): string {
        if (value === PdfBorderEffectStyle.cloudy) {
            return 'C';
        } else {
            return 'S';
        }
    }
}
export class _PaintParameter {
    borderPen: PdfPen;
    backBrush: PdfBrush;
    foreBrush: PdfBrush;
    shadowBrush: PdfBrush;
    borderWidth: number;
    bounds: number[];
    borderStyle: PdfBorderStyle;
    rotationAngle: number;
    pageRotationAngle: PdfRotationAngle;
    insertSpaces: boolean;
    required: boolean;
    isAutoFontSize: boolean;
    stringFormat: PdfStringFormat;
    constructor() {
        this.borderWidth = 1;
    }
}
class _CloudStyleArc {
    point: number[];
    endAngle: number;
    startAngle: number;
    constructor() {
        this.startAngle = 0;
        this.endAngle = 0;
    }
}
