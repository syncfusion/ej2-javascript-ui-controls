/**
 * PdfTemplate.ts class for EJ2-PDF
 */
import { PdfStream } from './../../primitives/pdf-stream';
import { DictionaryProperties } from './../../input-output/pdf-dictionary-properties';
import { PdfArray } from './../../primitives/pdf-array';
import { PdfGraphics } from './../pdf-graphics';
import { PdfStreamWriter } from './../../input-output/pdf-stream-writer';
import { PdfResources } from './../pdf-resources';
import { PdfName } from './../../primitives/pdf-name';
import { PointF, SizeF, RectangleF } from './../../drawing/pdf-drawing';
import { IPdfWrapper } from './../../../interfaces/i-pdf-wrapper';
import { IPdfPrimitive } from './../../../interfaces/i-pdf-primitives';
import { GetResourceEventHandler } from './../pdf-graphics';
/**
 * Represents `Pdf Template` object.
 * @private
 */
export class PdfTemplate implements IPdfWrapper {
    //Fields
    /**
     * Stores the value of current `graphics`.
     * @private
     */
    private pdfGraphics : PdfGraphics;
    /**
     * Stores the instance of `PdfResources` class.
     * @private
     */
    private resources : PdfResources;
    /**
     * Stores the `size` of the 'PdfTemplate'.
     * @private
     */
    private templateSize : SizeF;
    /**
     * Initialize an instance for `DictionaryProperties` class.
     * @private
     * @hidden
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * Stores the `content` of the 'PdfTemplate'.
     * @private
     */
    public content : PdfStream;
    /**
     * Checks whether the transformation 'is performed'.
     * @default true
     * @private
     */
    public writeTransformation : boolean = true;
    //Properties
    /**
     * Gets the size of the 'PdfTemplate'.
     */
    public get size() : SizeF {
        return this.templateSize;
    }
    /**
     * Gets the width of the 'PdfTemplate'.
     */
    public get width() : number {
        return this.size.width;
    }
    /**
     * Gets the height of the 'PdfTemplate'.
     */
    public get height() : number {
        return this.size.height;
    }
    /**
     * Gets the `graphics` of the 'PdfTemplate'.
     */
    public get graphics() : PdfGraphics {
        if (this.pdfGraphics == null || typeof this.pdfGraphics === 'undefined') {
            let gr : GetResourceEventHandler = new GetResourceEventHandler(this);
            let g : PdfGraphics = new PdfGraphics(this.size, gr, this.content);
            this.pdfGraphics = g;
            // if(this.writeTransformation) {
            // Transform co-ordinates to Top/Left.
            this.pdfGraphics.initializeCoordinates();
            // }
        }
        return this.pdfGraphics;
    }
    /**
     * Gets the resources and modifies the template dictionary.
     * @private
     */
    public getResources() : PdfResources {
        if (this.resources == null) {
            this.resources = new PdfResources();
            this.content.items.setValue(this.dictionaryProperties.resources, this.resources);
        }
        return this.resources;
    }
    /**
     * Create the new instance for `PdfTemplate` class.
     * @private
     */
    public constructor()
    /**
     * Create the new instance for `PdfTemplate` class with Size.
     * @private
     */
    public constructor(arg1 : SizeF)
    /**
     * Create the new instance for `PdfTemplate` class with width and height.
     * @private
     */
    public constructor(arg1 : number, arg2 : number)
    public constructor(arg1 ?: number | SizeF, arg2 ?: number) {
        if (typeof arg1 === 'undefined') {
            //
        } else if (arg1 instanceof SizeF && typeof arg2 === 'undefined') {
            this.content = new PdfStream();
            let tempSize : SizeF = new SizeF(arg1.width, arg1.height);
            this.setSize(tempSize);
            this.initialize();
        } else {
            this.content = new PdfStream();
            this.setSize(new SizeF(arg1 as number, arg2 as number));
            this.initialize();
        }
    }
    // Public methods
    /**
     * `Initialize` the type and subtype of the template.
     * @private
     */
    private initialize() : void {
        this.addType();
        this.addSubType();
    }
    /**
     * `Adds type key`.
     * @private
     */
    private addType() : void {
        let value : PdfName = new PdfName(this.dictionaryProperties.xObject);
        this.content.items.setValue(this.dictionaryProperties.type, value);
    }
    /**
     * `Adds SubType key`.
     * @private
     */
    private addSubType() : void {
        let value : PdfName = new PdfName(this.dictionaryProperties.form);
        this.content.items.setValue(this.dictionaryProperties.subtype, value);
    }
    /**
     * `Reset` the size of the 'PdfTemplate'.
     */
    public reset() : void
    public reset(size : SizeF) : void
    public reset(size ?: SizeF) : void {
        if (typeof size === 'undefined') {
            if (this.resources != null) {
                this.resources = null;
                this.content.remove(this.dictionaryProperties.resources);
            }
            if (this.graphics != null) {
                this.graphics.reset(this.size);
            }
        } else {
            this.setSize(size);
            this.reset();
        }
    }
    /**
     * `Set the size` of the 'PdfTemplate'.
     * @private
     */
    private setSize(size : SizeF) : void {
        let rect : RectangleF = new RectangleF(new PointF(0, 0), size);
        let val : PdfArray = PdfArray.fromRectangle(rect);
        this.content.items.setValue(this.dictionaryProperties.bBox, val);
        this.templateSize = size;
    }
    // /**
    //  * Returns the value of current graphics.
    //  * @private
    //  */
    // public GetGraphics(g : PdfGraphics) : PdfGraphics {
    //     if (this.graphics == null || typeof this.graphics === 'undefined') {
    //         this.graphics = g;
    //         this.graphics.Size = this.Size;
    //         this.graphics.StreamWriter = new PdfStreamWriter(this.content)
    //         this.graphics.Initialize();
    //         if(this.writeTransformation) {
    //             this.graphics.InitializeCoordinates();
    //         }
    //     }
    //     return this.graphics;
    // }
    // IPdfWrapper Members
    /**
     * Gets the `content stream` of 'PdfTemplate' class.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.content;
    }
}