import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { PdfWriter } from './../input-output/pdf-writer';
import { PdfMainObjectCollection } from './../input-output/pdf-main-object-collection';
import { PdfDocumentBase } from './pdf-document-base';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
import { PdfCatalog } from './pdf-catalog';
import { PdfPageSettings } from './../pages/pdf-page-settings';
import { PdfSectionCollection } from './../pages/pdf-section-collection';
import { PdfDocumentPageCollection } from './../pages/pdf-document-page-collection';
import { PdfCacheCollection } from './../general/pdf-cache-collection';
import { PdfColorSpace } from './../graphics/enum';
import { PdfDocumentTemplate } from './pdf-document-template';
import { PdfFont } from './../graphics/fonts/pdf-font';
import { PdfFontFamily } from './../graphics/fonts/enum';
import { PdfStandardFont } from './../graphics/fonts/pdf-standard-font';
/**
 * Represents a PDF document and can be used to create a new PDF document from the scratch.
 * ```typescript
 * // create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // add a new page to the document
 * let page1 : PdfPage = document.pages.add();
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
export class PdfDocument extends PdfDocumentBase {
    //Fields
    /**
     * `Cache` of the objects.
     * @private
     */
    private static cacheCollection : PdfCacheCollection;
    /**
     * Default `margin` value.
     * @default 40.0
     * @private
     */
    public readonly defaultMargin : number = 40.0;
    /**
     * Default page `settings`.
     * @private
     */
    private settings : PdfPageSettings;
    /**
     * Internal variable to store document`s collection of `sections`.
     * @private
     */
    private sectionCollection : PdfSectionCollection;
    /**
     * Internal variable to store document`s collection of `pages`.
     * @private
     */
    private documentPageCollection : PdfDocumentPageCollection;
    /**
     * Internal variable to store instance of `StreamWriter` classes..
     * @default null
     * @private
     */
    public streamWriter : StreamWriter = null;
    /**
     * Defines the `color space` of the document
     * @private
     */
    private pdfColorSpace : PdfColorSpace;
    /**
     * Internal variable to store `template` which is applied to each page of the document.
     * @private
     */
    private pageTemplate : PdfDocumentTemplate;
    /**
     * `Font` used in complex objects to draw strings and text when it is not defined explicitly.
     * @default null
     * @private
     */
    private static defaultStandardFont : PdfFont = null;
    /**
     * Indicates whether enable cache or not
     * @default true
     * @private
     */
    private static isCacheEnabled : boolean = true;
    //Constructors
    /**
     * Initializes a new instance of the `PdfDocument` class.
     * @public
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfDocument` class.
     * @private
     */
    public constructor(isMerging : boolean)
    public constructor(isMerging? : boolean) {
        super();
        super(this);
        if (isMerging === true || isMerging === false || typeof isMerging !== 'undefined') {
            let objects : PdfMainObjectCollection = new PdfMainObjectCollection();
            this.setMainObjectCollection(objects);
            let crossTable : PdfCrossTable = new PdfCrossTable();
            crossTable.isMerging = isMerging;
            crossTable.document = this;
            this.setCrossTable(crossTable);
            let catalog : PdfCatalog = new PdfCatalog();
            this.setCatalog(catalog);
            objects.add(catalog);
            catalog.position = -1;
            this.sectionCollection = new PdfSectionCollection(this);
            this.documentPageCollection = new PdfDocumentPageCollection(this);
            catalog.pages = this.sectionCollection;
        } else {
            PdfDocument.cacheCollection = new PdfCacheCollection();
            this.constructor(false);
        }
    }
    //Properties
    /**
     * Gets the `default font`. It is used for complex objects when font is not explicitly defined.
     * @private
     */
    public static get defaultFont() : PdfFont {
        if (this.defaultStandardFont == null) {
            this.defaultStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 8);
        }
        return this.defaultStandardFont;
    }
    /**
     * Gets the collection of the `sections` in the document.
     * @private
     */
    public get sections() : PdfSectionCollection {
        return this.sectionCollection;
    }
    /**
     * Gets the document's page setting.
     * @public
     */
    public get pageSettings() : PdfPageSettings {
        if (this.settings == null) {
            this.settings = new PdfPageSettings(this.defaultMargin);
        }
        return this.settings;
    }
    /**
     * Sets the document's page setting.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * 
     * // sets the right margin of the page
     * document.pageSettings.margins.right = 0;
     * // set the page size.
     * document.pageSettings.size = new SizeF(500, 500);
     * // change the page orientation to landscape
     * document.pageSettings.orientation = PdfPageOrientation.Landscape;
     * // apply 90 degree rotation on the page
     * document.pageSettings.rotate = PdfPageRotateAngle.RotateAngle90;
     * 
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * // set font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // set brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * // set the specified Point
     * let point : PointF = new PointF(page1.getClientSize().width - 200, page1.getClientSize().height - 200);
     * // draw the text
     * page1.graphics.drawString('Hello World', font, blackBrush, point);
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public set pageSettings(value : PdfPageSettings) {
        this.settings = value;
    }
    /**
     * Represents the collection of pages in the PDF document.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * //
     * // get the collection of pages in the document
     * let pageCollection : PdfDocumentPageCollection  = document.pages;
     * //
     * // add pages
     * let page1 : PdfPage = pageCollection.add();
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get pages() : PdfDocumentPageCollection {
        return this.documentPageCollection;
    }
    /**
     * Gets collection of the `cached objects`.
     * @private
     */
    public static get cache() : PdfCacheCollection {
        if (typeof PdfDocument.cacheCollection === 'undefined' || PdfDocument.cacheCollection == null) {
            return new PdfCacheCollection();
        }
        return PdfDocument.cacheCollection;
    }
    /**
     * Sets collection of the `cached objects`.
     * @private
     */
    public static set cache(value : PdfCacheCollection) {
        this.cacheCollection = value;
    }
    /**
     * Gets the value of enable cache.
     * @private
     */
    public static get enableCache() : boolean {
        return this.isCacheEnabled;
    }
    /**
     * Sets thie value of enable cache.
     * @private
     */
    public static set enableCache(value : boolean) {
        this.isCacheEnabled = value;
    }
    /* tslint:disable */
    /**
     * Gets or sets the `color space` of the document. This property can be used to create PDF document in RGB, Gray scale or CMYK color spaces.
     * @private
     */
    public get colorSpace() : PdfColorSpace {
        if ((this.pdfColorSpace === PdfColorSpace.Rgb) || ((this.pdfColorSpace === PdfColorSpace.Cmyk)
             || (this.pdfColorSpace === PdfColorSpace.GrayScale))) {
            return this.pdfColorSpace;
        } else {
            return PdfColorSpace.Rgb;
        }
    }
    public set colorSpace(value : PdfColorSpace) {
        if ((value === PdfColorSpace.Rgb) || ((value === PdfColorSpace.Cmyk) ||
             (value === PdfColorSpace.GrayScale))) {
            this.pdfColorSpace = value;
        } else {
            this.pdfColorSpace = PdfColorSpace.Rgb;
        }
    }
    /* tslint:enable */
    /**
     * Gets or sets a `template` to all pages in the document.
     * @private
     */
    public get template() : PdfDocumentTemplate {
        if (this.pageTemplate == null) {
            this.pageTemplate = new PdfDocumentTemplate();
        }
        return this.pageTemplate;
    }
    public set template(value : PdfDocumentTemplate) {
        this.pageTemplate = value;
    }
    // Public methods
    /**
     * Saves the document to the specified output stream and return the stream as Blob.
     * @private
     */
    public docSave(stream : StreamWriter, isBase : boolean) : Blob
    /**
     * Saves the document to the specified output stream.
     * @private
     */
    public docSave(stream : StreamWriter, filename : string, isBase : boolean) : void
    public docSave(stream : StreamWriter, arg2 : string | boolean, arg3 ?: boolean) : void | Blob {
        this.checkPagesPresence();
        if (stream === null) {
            throw new Error('ArgumentNullException : stream');
        }
        this.streamWriter = stream;
        let writer : PdfWriter = new PdfWriter(stream);
        writer.document = this;
        if (typeof arg2 === 'boolean' && typeof arg3 === 'undefined') {
            return this.crossTable.save(writer);
        } else {
            this.crossTable.save(writer, (arg2 as string));
        }
    }
    /**
     * Checks the pages `presence`.
     * @private
     */
    private checkPagesPresence() : void {
        if (this.pages.count === 0) {
            this.pages.add();
        }
    }
    /**
     * disposes the current instance of `PdfDocument` class.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a new page to the document
     * let page1 : PdfPage = document.pages.add();
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
    public destroy() : void {
        this.catalog = undefined;
        this.colorSpace = undefined;
        this.currentSavingObj = undefined;
        this.documentPageCollection = undefined;
        this.isStreamCopied = undefined;
        this.pageSettings = undefined;
        this.pageTemplate = undefined;
        this.pdfColorSpace = undefined;
        this.sectionCollection = undefined;
        PdfDocument.cache.destroy();
        this.crossTable.pdfObjects.destroy();
        PdfDocument.cache = undefined;
        this.streamWriter.destroy();
    }
}