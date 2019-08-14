/**
 * PdfPageLayer.ts class for EJ2-PDF
 */
import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { PdfPageBase } from './pdf-page-base';
import { PdfStream } from './../primitives/pdf-stream';
import { PdfDictionary } from './../primitives/pdf-dictionary';
import { PdfGraphics, GetResourceEventHandler } from './../graphics/pdf-graphics';
import { PdfPageLayerCollection } from './pdf-page-layer-collection';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
import { PdfArray } from './../primitives/pdf-array';
import { PdfPage } from './pdf-page';
import { RectangleF } from './../drawing/pdf-drawing';
import { PdfSectionCollection } from './../pages/pdf-section-collection';
import { PdfColorSpace } from './../graphics/enum';
import { PdfMargins } from './../graphics/pdf-margins';
/**
 * The `PdfPageLayer` used to create layers in PDF document.
 * @private
 */
export class PdfPageLayer implements IPdfWrapper {
    // Fields
    /**
     * Parent `page` of the layer.
     * @private
     */
    private pdfPage : PdfPageBase;
    /**
     * `Graphics context` of the layer.
     * @private
     */
    private pdfGraphics : PdfGraphics;
    /**
     * `Content` of the object.
     * @private
     */
    private content : PdfStream;
    /**
     * Indicates whether the layer should `clip page template` dimensions or not.
     * @private
     */
    private clipPageTemplates : boolean;
    // private bSaved : boolean;
    /**
     * Local Variable to store the `color space` of the document.
     * @private
     */
    private pdfColorSpace : PdfColorSpace = PdfColorSpace.Rgb;
    /**
     * Local Variable to store the `layer id`.
     * @private
     */
    private layerid : string;
    /**
     * Local Variable to store the `name`.
     * @private
     */
    private layerName : string;
    /**
     * Local Variable to set `visibility`.
     * @default true
     * @private
     */
    private isVisible : boolean = true;
    /**
     * Collection of the `layers` of the page.
     * @private
     */
    private layer : PdfPageLayerCollection;
    /**
     * Indicates if `Sublayer` is present.
     * @default false
     * @private
     */
    public sublayer : boolean = false;
    /**
     * Local variable to store `length` of the graphics.
     * @default 0
     * @private
     */
    public contentLength : number = 0;
    /**
     * Stores the `print Option` dictionary.
     * @private
     */
    public printOption : PdfDictionary;
    /**
     * Stores the `usage` dictionary.
     * @private
     */
    public usage : PdfDictionary;
    /**
     * Instance for `PdfDictionaryProperties` Class.
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    // Properties
    /**
     * Get or set the `color space`.
     * @private
     */
    public get colorSpace() : PdfColorSpace {
        return this.pdfColorSpace;
    }
    public set colorSpace(value : PdfColorSpace) {
        this.pdfColorSpace = value;
    }
    /**
     * Gets parent `page` of the layer.
     * @private
     */
    public get page() : PdfPageBase {
        return this.pdfPage;
    }
    /**
     * Gets and Sets the `id of the layer`.
     * @private
     */
    public get layerId() : string {
        return this.layerid;
    }
    public set layerId(value : string) {
        this.layerid = value;
    }
    /**
     * Gets or sets the `name` of the layer.
     * @private
     */
    public get name() : string {
        return this.layerName;
    }
    public set name(value : string) {
        this.layerName = value;
    }
    /**
     * Gets or sets the `visibility` of the layer.
     * @private
     */
    public get visible() : boolean {
        return this.isVisible;
    }
    public set visible(value : boolean) {
        this.isVisible = value;
    }
    /**
     * Gets `Graphics` context of the layer, used to draw various graphical content on layer.
     * @private
     */
    public get graphics() : PdfGraphics {
        if ((this.pdfGraphics == null)) {
            this.initializeGraphics(this.page);
        }
        return this.pdfGraphics;
    }
    /**
     * Gets the collection of `PdfPageLayer`, this collection handle by the class 'PdfPageLayerCollection'.
     * @private
     */
    public get layers() : PdfPageLayerCollection {
        if (this.layer == null) {
            this.layer = new PdfPageLayerCollection(this.page);
            this.layer.sublayer  = true;
            return this.layer;
        } else {
            return this.layer;
        }
    }
    // Constructors
    /**
     * Initializes a new instance of the `PdfPageLayer` class with specified PDF page.
     * @private
     */
    public constructor(page : PdfPageBase)
    /**
     * Initializes a new instance of the `PdfPageLayer` class with specified PDF page and PDF stream.
     * @private
     */
    public constructor(page : PdfPageBase, stream : PdfStream)
    /**
     * Initializes a new instance of the `PdfPageLayer` class.
     * @private
     */
    public constructor(page : PdfPageBase, clipPageTemplates : boolean)
    public constructor(page : PdfPageBase, streamClipPageTemplates ?: boolean|PdfStream) {
        if (page === null) {
            throw new Error('ArgumentNullException:page');
        }
        this.pdfPage = page;
        this.clipPageTemplates = true;
        if (typeof streamClipPageTemplates === 'undefined') {
             this.content = new PdfStream();
        } else if (streamClipPageTemplates instanceof PdfStream || streamClipPageTemplates === null) {
            if (streamClipPageTemplates === null) {
                throw new Error('ArgumentNullException:stream');
            }
            this.content = streamClipPageTemplates as PdfStream;
        } else {
            this.content = new PdfStream();
            this.clipPageTemplates = streamClipPageTemplates;
        }
    }
    // Implementation
    /**
     * `Adds` a new PDF Page layer.
     * @private
     */
    public add() : PdfPageLayer {
        let layer : PdfPageLayer = new PdfPageLayer(this.pdfPage);
        layer.name = '';
        return layer;
    }
    /**
     * Returns a value indicating the `sign` of a single-precision floating-point number.
     * @private
     */
    private sign(number : number) : number {
        if (number === 0) {
            return 0;
        } else if (number > 0) {
            return 1;
        } else {
            return -1;
        }
    }
    /**
     * `Initializes Graphics context` of the layer.
     * @private
     */
    private initializeGraphics(page : PdfPageBase) : void {
        let oPage : PdfPage = page as PdfPage;
        let gr : GetResourceEventHandler = new GetResourceEventHandler(this.page);
        let cropBox : PdfArray = null;
        this.pdfGraphics = new PdfGraphics(page.size, gr, this.content);
        this.pdfGraphics.mediaBoxUpperRightBound = 0;
        if (oPage != null) {
            let sc : PdfSectionCollection = oPage.section.parent;
            if (sc != null) {
                this.pdfGraphics.colorSpace = sc.document.colorSpace;
                this.colorSpace = sc.document.colorSpace;
            }
        }
        // Transform coordinates to the left/top and activate margins.
        let isSame : boolean = (this.sign(page.origin.y) === this.sign(page.origin.x));
        // if (page != null) {
        if (page.origin.x >= 0 && page.origin.y >= 0 || !(isSame)) {
            this.pdfGraphics.initializeCoordinates();
        } else {
            // this.m_graphics.InitializeCoordinates(page);
        }
        let clipRect : RectangleF = oPage.section.getActualBounds(oPage, true);
        let margins : PdfMargins = oPage.section.pageSettings.margins;
        if (this.clipPageTemplates) {
            if (page.origin.x >= 0 && page.origin.y >= 0) {
                this.pdfGraphics.clipTranslateMargins(clipRect);
            }
        } else {
            this.graphics.clipTranslateMargins(clipRect.x, clipRect.y, margins.left, margins.top, margins.right, margins.bottom);
        }
        this.pdfGraphics.setLayer(this);
        // this.bSaved = false;
    }
    // IPdfWrapper Members
    /**
     * Gets the wrapped `element`.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.content;
    }
}