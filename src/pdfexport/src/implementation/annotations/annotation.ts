import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { PdfColor } from './../graphics/pdf-color';
import { RectangleF, PointF } from './../drawing/pdf-drawing';
import { PdfPage } from './../pages/pdf-page';
import { PdfPageBase } from './../pages/pdf-page-base';
import { PdfDictionary, SaveAnnotationEventHandler } from './../primitives/pdf-dictionary';
import { PdfArray } from './../primitives/pdf-array';
import { PdfNumber } from './../primitives/pdf-number';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
import { PdfString } from './../primitives/pdf-string';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
import { PdfName } from './../primitives/pdf-name';
import { PdfSection } from './../pages/pdf-section';
import { PdfBrush } from './../graphics/brushes/pdf-brush';
import { PdfSolidBrush } from './../graphics/brushes/pdf-solid-brush';
import { PdfStandardFont } from './../graphics/fonts/pdf-standard-font';
import { PdfFont } from './../graphics/fonts/pdf-font';
import { PdfFontFamily } from './../graphics/fonts/enum';
import { PdfStringFormat } from './../graphics/fonts/pdf-string-format';
import { PdfTextAlignment } from './../graphics/enum';
/**
 * `PdfAnnotation` class represents the base class for annotation objects.
 * @private
 */
export abstract class PdfAnnotation implements IPdfWrapper {
    // Fields
    /**
     * Specifies the Internal variable to store fields of `PdfDictionaryProperties`.
     * @private
     */
    protected dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * `Color` of the annotation
     * @private
     */
    private pdfColor : PdfColor = new PdfColor(255, 255, 255);
    /**
     * `Bounds` of the annotation.
     * @private
     */
    private rectangle : RectangleF = new RectangleF(0, 0, 0, 0);
    /**
     * Parent `page` of the annotation.
     * @private
     */
    private pdfPage : PdfPage = null;
    /**
     * `Brush of the text` of the annotation.
     * @default new PdfSolidBrush(new PdfColor(0, 0, 0))
     * @private
     */
    private textBrush : PdfBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
    /**
     * `Font of the text` of the annotation.
     * @default new PdfStandardFont(PdfFontFamily.TimesRoman, 10)
     * @private
     */
    private textFont : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 10);
    /**
     * `StringFormat of the text` of the annotation.
     * @default new PdfStringFormat(PdfTextAlignment.Left)
     * @private
     */
    private format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Left);
    /**
     * `Text` of the annotation.
     * @private
     */
    private content : string = '';
    /**
     * Internal variable to store `dictionary`.
     * @private
     */
    private pdfDictionary : PdfDictionary = new PdfDictionary();
    /**
     * To specifying the `Inner color` with which to fill the annotation
     * @private
     */
    private internalColor : PdfColor = new PdfColor();
    /**
     * `opacity or darkness` of the annotation.
     * @private
     * @default 1.0
     */
    private darkness : number = 1.0;
    // Properties
    /**
     * `Color` of the annotation
     * @private
     */
    public get color() : PdfColor {
        return this.pdfColor;
    }
    public set color(value : PdfColor) {
        this.pdfColor = value;
    }
    /**
     * To specifying the `Inner color` with which to fill the annotation
     * @private
     */
    public get innerColor() : PdfColor {
        return this.internalColor;
    }
    public set innerColor(value : PdfColor) {
        this.internalColor = value;
    }
    /**
     * `bounds` of the annotation.
     * @private
     */
    public get bounds() : RectangleF {
        return this.rectangle;
    }
    public set bounds(value : RectangleF) {
        this.rectangle = value;
    }
    /**
     * Parent `page` of the annotation.
     * @private
     */
    public get page() : PdfPage {
        return this.pdfPage;
    }
    /**
     * To specifying the `Font of the text` in the annotation.
     * @private
     */
    public get font() : PdfFont {
        return this.textFont;
    }
    public set font(value : PdfFont) {
        this.textFont = value;
    }
    /**
     * To specifying the `StringFormat of the text` in the annotation.
     * @private
     */
    public get stringFormat() : PdfStringFormat {
        return this.format;
    }
    public set stringFormat(value : PdfStringFormat) {
        this.format = value;
    }
    /**
     * To specifying the `Brush of the text` in the annotation.
     * @private
     */
    public get brush() : PdfBrush {
        return this.textBrush;
    }
    public set brush(value : PdfBrush) {
        this.textBrush = value;
    }
    /**
     * `Text` of the annotation.
     * @private
     */
    public get text() : string {
        return this.content;
    }
    public set text(value : string) {
        this.content = value;
        this.dictionary.items.setValue(this.dictionaryProperties.contents, new PdfString(this.content));
    }
    /**
     * Internal variable to store `dictionary`.
     * @hidden
     */
    public get dictionary() : PdfDictionary {
        return this.pdfDictionary;
    }
    public set dictionary(value : PdfDictionary) {
        this.pdfDictionary = value;
    }
    // Constructors
    /**
     * Object initialization for `Annotation` class
     * @private
     */
    public constructor()
    public constructor(bounds : RectangleF)
    public constructor(arg1 ?: RectangleF) {
        if (typeof arg1 === 'undefined') {
            this.initialize();
        } else {
            this.initialize();
            this.bounds = arg1;
        }
    }
    // Implementation
    /**
     * `Initialize` the annotation event handler and specifies the type of the annotation.
     * @private
     */
    protected initialize() : void {
        this.pdfDictionary.annotationBeginSave = new SaveAnnotationEventHandler(this);
        this.pdfDictionary.items.setValue(this.dictionaryProperties.type, new PdfName(this.dictionaryProperties.annot));
    }
    /**
     * Sets related `page` of the annotation.
     * @private
     */
    public setPage(page : PdfPageBase) : void {
        this.pdfPage = page as PdfPage;
        this.pdfDictionary.items.setValue(this.dictionaryProperties.p, new PdfReferenceHolder(this.pdfPage));
    }
    /**
     * Handles the `BeginSave` event of the Dictionary.
     * @private
     */
    public beginSave() : void {
        this.save();
    }
    /**
     * `Saves` an annotation.
     * @private
     */
    /* tslint:disable */
    protected save() : void {
        let nativeRectangle : RectangleF = new RectangleF(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
        let section : PdfSection = this.pdfPage.section;
        let initialHeight : number = nativeRectangle.height;
        let tempLoacation : PointF = section.pointToNativePdf(this.page, new PointF(nativeRectangle.x, nativeRectangle.y));
        nativeRectangle.x = tempLoacation.x;
        nativeRectangle.width = tempLoacation.x + nativeRectangle.width;
        nativeRectangle.y = (tempLoacation.y - this.page.document.pageSettings.margins.top);
        nativeRectangle.height = nativeRectangle.y - initialHeight;
        this.pdfDictionary.items.setValue(this.dictionaryProperties.rect, PdfArray.fromRectangle(nativeRectangle));
        this.dictionary.items.setValue(this.dictionaryProperties.ca, new PdfNumber(this.darkness));
    }
    /* tslint:enable */
    // IPdfWrapper Members
    /**
     * Gets the `element`.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.pdfDictionary;
    }
}