import { PdfPageBase } from './pdf-page-base';
import { PdfDictionary, SaveTemplateEventHandler } from './../primitives/pdf-dictionary';
import { PdfName } from './../primitives/pdf-name';
import { PdfDocument } from './../document/pdf-document';
import { PdfSection } from './pdf-section';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
import { SizeF, PointF, RectangleF } from './../drawing/pdf-drawing';
import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { PdfArray } from './../primitives/pdf-array';
import { PdfAnnotationCollection } from './../annotations/annotation-collection';
import { PdfGraphics } from './../graphics/pdf-graphics';
import { PdfPageLayer } from './pdf-page-layer';
import { PdfAutomaticFieldInfo } from './../document/automatic-fields/automatic-field-info';
/**
 * Provides methods and properties to create pages and its elements. 
 * `PdfPage` class inherited from the `PdfPageBase` class.
 * ```typescript
 * // create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * //
 * // add a new page to the document
 * let page1 : PdfPage = document.pages.add();
 * //
 * // set the font
 * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
 * // create black brush
 * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
 * // draw the text
 * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(0, 0));
 * // save the document
 * document.save('output.pdf');
 * // destroy the document
 * document.destroy();
 * ```
 */
export class PdfPage extends PdfPageBase {
    //Fields
    /**
     * Checks whether the `progress is on`.
     * @hidden
     * @private
     */
    private isProgressOn : boolean;
    /**
     * Stores the instance of `PdfAnnotationCollection` class.
     * @hidden
     * @default null
     * @private
     */
    private annotationCollection : PdfAnnotationCollection = null;
    /**
     * Stores the instance of `PageBeginSave` event for Page Number Field.
     * @default null
     * @private
     */
    public beginSave : Function = null;
    //constructors
    /**
     * Initialize the new instance for `PdfPage` class.
     * @private
     */
    public constructor() {
        super(new PdfDictionary());
        this.initialize();
    }
    //Properties
    /**
     * Gets current `document`.
     * @private
     */
    public get document() : PdfDocument {
        if (this.section !== null && this.section.parent !== null) {
            return this.section.parent.document;
        } else {
            return null;
        }
    }
    /**
     * Get the current `graphics`.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a new page to the document
     * let page1 : PdfPage = document.pages.add();
     * //
     * // get graphics
     * let graphics : PdfGraphics = page1.graphics;
     * //
     * // set the font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // create black brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * // draw the text
     * graphics.drawString('Hello World', font, blackBrush, new PointF(0, 0));
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get graphics() : PdfGraphics {
        let result : PdfGraphics = this.defaultLayer.graphics;
        result.currentPage = this;
        return result;
    }
    /**
     * Gets the `cross table`.
     * @private
     */
    public get crossTable() : PdfCrossTable {
        if (this.section === null) {
            throw new Error('PdfDocumentException : Page is not created');
        }
        return this.section.parent === null ? this.section.parentDocument.crossTable : this.section.parent.document.crossTable;
    }
    /**
     * Gets the size of the PDF page- Read only.
     * @public
     */
    public get size() : SizeF {
        return this.section.pageSettings.size;
    }
    /**
     * Gets the `origin` of the page.
     * @private
     */
    public get origin() : PointF {
        return this.section.pageSettings.origin;
    }
    /**
     * Gets a collection of the `annotations` of the page- Read only.
     * @private
     */
    public get annotations() : PdfAnnotationCollection {
        if (this.annotationCollection == null) {
            this.annotationCollection = new PdfAnnotationCollection(this);
            // if (!this.Dictionary.ContainsKey(this.dictionaryProperties.annots)) {
            this.dictionary.items.setValue(this.dictionaryProperties.annots, (this.annotationCollection as IPdfWrapper).element);
            // }
            this.annotationCollection.annotations = this.dictionary.items.getValue(this.dictionaryProperties.annots) as PdfArray;
        }
        return this.annotationCollection;
    }
    //Implementation
    /**
     * `Initializes` a page.
     * @private
     */
    private initialize() : void {
        this.dictionary.items.setValue(this.dictionaryProperties.type, new PdfName('Page'));
        this.dictionary.pageBeginDrawTemplate = new SaveTemplateEventHandler(this);
    }
    /**
     * Sets parent `section` to the page.
     * @private
     */
    public setSection(section : PdfSection) : void {
        this.section = section;
        this.dictionary.items.setValue(this.dictionaryProperties.parent, new PdfReferenceHolder(section));
    }
    /**
     * `Resets the progress`.
     * @private
     */
    public resetProgress() : void {
        this.isProgressOn = false;
    }
    /**
     * Get the page size reduced by page margins and page template dimensions.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * // create new standard font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // set brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * //
     * // set the specified point using `getClientSize` method
     * let point : PointF = new PointF(page1.getClientSize().width - 200, page1.getClientSize().height - 200);
     * // draw the text
     * page1.graphics.drawString('Hello World', font, blackBrush, point);
     * //
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public getClientSize() : SizeF {
        let returnValue : RectangleF = this.section.getActualBounds(this, true);
        return new SizeF(returnValue.width, returnValue.height);
    }
    /**
     * Helper method to retrive the instance of `PageBeginSave` event for header and footer elements.
     * @private
     */
    public pageBeginSave() : void {
        let doc : PdfDocument = this.document as PdfDocument;
        if (typeof doc !== undefined && doc != null) {
            this.drawPageTemplates(doc);
        }
        if ( this.beginSave != null && typeof this.beginSave !== 'undefined') {
            this.beginSave(this);
        }
    }
    /**
     * Helper method to draw template elements.
     * @private
     */
    private drawPageTemplates(document : PdfDocument) : void {
        // Draw Background templates.
        let hasBackTemplates : boolean = this.section.containsTemplates(document, this, false);
        if (hasBackTemplates) {
            let backLayer : PdfPageLayer = new PdfPageLayer(this, false);
            this.layers.insert(0, backLayer);
            this.section.drawTemplates(this, backLayer, document, false);
            if (backLayer.graphics !== null && typeof backLayer.graphics !== 'undefined') {
                for (let i : number = 0; i < backLayer.graphics.automaticFields.automaticFields.length; i++) {
                    let fieldInfo : PdfAutomaticFieldInfo = backLayer.graphics.automaticFields.automaticFields[i] as PdfAutomaticFieldInfo;
                    fieldInfo.field.performDraw(backLayer.graphics, fieldInfo.location, fieldInfo.scalingX, fieldInfo.scalingY);
                }
            }
        }
        // Draw Foreground templates.
        let hasFrontTemplates : boolean = this.section.containsTemplates(document, this, true);
        if (hasFrontTemplates) {
            let frontLayer : PdfPageLayer = new PdfPageLayer(this, false);
            this.layers.add(frontLayer);
            this.section.drawTemplates(this, frontLayer, document, true);
        }
    }
}