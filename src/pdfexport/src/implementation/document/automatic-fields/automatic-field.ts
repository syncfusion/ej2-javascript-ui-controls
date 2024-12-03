/**
 * PdfAutomaticField.ts class for EJ2-PDF
 */
import { RectangleF, SizeF, PointF } from './../../drawing/pdf-drawing';
import { PdfFont } from './../../graphics/fonts/pdf-font';
import { PdfBrush } from './../../graphics/brushes/pdf-brush';
import { PdfSolidBrush } from './../../graphics/brushes/pdf-solid-brush';
import { PdfStringFormat } from './../../graphics/fonts/pdf-string-format';
import { PdfPen } from './../../graphics/pdf-pen';
import { PdfGraphics } from './../../graphics/pdf-graphics';
import { PdfColor } from './../../graphics/pdf-color';
import { PdfDocument } from './../pdf-document';
import { PdfGraphicsElement } from './../../graphics/figures/base/graphics-element';
import { PdfAutomaticFieldInfo } from './automatic-field-info';
import { PdfPage } from './../../pages/pdf-page';
/**
 * Represents a fields which is calculated before the document saves.
 */
export abstract class PdfAutomaticField extends PdfGraphicsElement {
    // Fields
    private internalBounds : RectangleF = new RectangleF(0, 0, 0, 0);
    private internalFont : PdfFont;
    private internalBrush : PdfBrush;
    private internalPen : PdfPen;
    private internalStringFormat : PdfStringFormat;
    private internalTemplateSize : SizeF = new SizeF(0, 0);
    // Constructors
    protected constructor() {
        super();
    }
    // Properties
    public get bounds() : RectangleF {
        return this.internalBounds;
    }
    public set bounds(value : RectangleF) {
        this.internalBounds = value;
    }
    public get size() : SizeF {
        return new SizeF(this.bounds.width, this.bounds.height);
    }
    public set size(value : SizeF) {
        this.bounds.width = value.width;
        this.bounds.height = value.height;
    }
    public get location() : PointF {
        return new PointF(this.bounds.x, this.bounds.y);
    }
    public set location(value : PointF) {
        this.bounds.x = value.x;
        this.bounds.y = value.y;
    }
    public get font() : PdfFont {
        return this.internalFont;
    }
    public set font(value : PdfFont) {
        this.internalFont = value;
    }
    public get brush() : PdfBrush {
        return this.internalBrush;
    }
    public set brush(value : PdfBrush) {
        this.internalBrush = value;
    }
    public get pen() : PdfPen {
        return this.internalPen;
    }
    public set pen(value : PdfPen) {
        this.internalPen = value;
    }
    public get stringFormat() : PdfStringFormat {
        return this.internalStringFormat;
    }
    public set stringFormat(value : PdfStringFormat) {
        this.internalStringFormat = value;
    }
    // Implementation
    public abstract getValue(graphics : PdfGraphics) : string;
    public abstract performDraw(graphics : PdfGraphics, location : PointF, scalingX : number, scalingY : number) : void;
    public performDrawHelper(graphics : PdfGraphics, location : PointF, scalingX : number, scalingY : number) : void {
        if (this.bounds.height === 0 || this.bounds.width === 0) {
            let text : string = this.getValue(graphics);
            this.internalTemplateSize = this.getFont().measureString(text, this.size, this.stringFormat);
        }
    }
    public draw(graphics : PdfGraphics) : void
    public draw(graphics : PdfGraphics, location : PointF) : void
    public draw(graphics : PdfGraphics, x : number, y : number) : void
    public draw(arg1 ?: PdfGraphics, arg2 ?: number | PointF, arg3 ?: number) : void {
        if (typeof arg2 === 'undefined') {
            let location : PointF = new PointF(0, 0);
            this.draw(arg1, location);
        } else if (arg2 instanceof PointF) {
            this.draw(arg1, arg2.x, arg2.y);
        } else {
            this.drawHelper(arg1, arg2, arg3);
            let info : PdfAutomaticFieldInfo = new PdfAutomaticFieldInfo(this, new PointF(arg2, arg3));
            arg1.automaticFields.add(info);
        }
    }
    protected getSize() : SizeF {
        if (this.bounds.height === 0 || this.bounds.width === 0) {
            return this.internalTemplateSize;
        } else {
            return this.size;
        }
    }
    protected drawInternal(graphics : PdfGraphics) : void {
        //
    }
    /* tslint:disable */
    protected getBrush() : PdfBrush {
        return (typeof this.internalBrush === 'undefined' || this.internalBrush == null) ? new PdfSolidBrush(new PdfColor(0, 0, 0)) : this.internalBrush;
    }
    protected getFont() : PdfFont {
        return (typeof this.internalFont === 'undefined' || this.internalFont == null) ? PdfDocument.defaultFont : this.internalFont;
    }
    /* tslint:enable */
    public getPageFromGraphics(graphics : PdfGraphics) : PdfPage {
        if (typeof graphics.page !== 'undefined' && graphics.page !== null) {
            let page : PdfPage = graphics.page as PdfPage;
            return page;
        } else {
            let page : PdfPage = graphics.currentPage as PdfPage;
            return page;
        }
    }
}