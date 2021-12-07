/**
 * PdfPageTemplateElement.ts class for EJ2-Pdf
 */
import { PdfDockStyle, PdfAlignmentStyle, TemplateType } from './enum';
import { PointF, SizeF } from './../drawing/pdf-drawing';
import { PdfGraphics } from './../graphics/pdf-graphics';
import { PdfTemplate } from './../graphics/figures/pdf-template';
import { PdfPageLayer } from './pdf-page-layer';
import { PdfPage } from './pdf-page';
import { PdfDocument } from './../document/pdf-document';
import { RectangleF } from './../drawing/pdf-drawing';
import { PdfSection } from './pdf-section';
/**
 * Describes a `page template` object that can be used as header/footer, watermark or stamp.
 */
export class PdfPageTemplateElement {
    // Fields
    /**
     * `Layer type` of the template.
     * @private
     */
    private isForeground : boolean;
    /**
     * `Docking style`.
     * @private
     */
    private dockStyle : PdfDockStyle;
    /**
     * `Alignment style`.
     * @private
     */
    private alignmentStyle : PdfAlignmentStyle;
    /**
     * `PdfTemplate` object.
     * @private
     */
    private pdfTemplate : PdfTemplate;
    /**
     * Usage `type` of this template.
     * @private
     */
    private templateType : TemplateType;
    /**
     * `Location` of the template on the page.
     * @private
     */
    private currentLocation : PointF;
    // Properties
    /**
     * Gets or sets the `dock style` of the page template element.
     * @private
     */
    public get dock() : PdfDockStyle {
        return this.dockStyle;
    }
    public set dock(value : PdfDockStyle) {
        // if (this.dockStyle !== value && this.Type === TemplateType.None) {
        this.dockStyle = value;
        // Reset alignment.
        this.resetAlignment();
        // }
    }
    /**
     * Gets or sets `alignment` of the page template element.
     * @private
     */
    public get alignment() : PdfAlignmentStyle {
        return this.alignmentStyle;
    }
    public set alignment(value : PdfAlignmentStyle) {
        // if (this.alignmentStyle !== value) {
        this.setAlignment(value);
        // }
    }
    /**
     * Indicates whether the page template is located `in front of the page layers or behind of it`.
     * @private
     */
    public get foreground() : boolean {
        return this.isForeground;
    }
    public set foreground(value : boolean) {
        // if (this.foreground !== value) {
        this.isForeground = value;
        // }
    }
    /**
     * Indicates whether the page template is located `behind of the page layers or in front of it`.
     * @private
     */
    public get background() : boolean {
        return !this.isForeground;
    }
    public set background(value : boolean) {
        this.isForeground = !value;
    }
    /**
     * Gets or sets `location` of the page template element.
     * @private
     */
    public get location() : PointF {
        return this.currentLocation;
    }
    public set location(value : PointF) {
        if (this.type === TemplateType.None) {
            this.currentLocation = value;
        } else {
            //
        }
    }
    /**
     * Gets or sets `X` co-ordinate of the template element on the page.
     * @private
     */
    public get x() : number {
        let value : number = (typeof this.currentLocation !== 'undefined') ? this.currentLocation.x : 0;
        return value;
    }
    public set x(value : number) {
        if (this.type === TemplateType.None) {
            this.currentLocation.x = value;
        } else {
            //
        }
    }
    /**
     * Gets or sets `Y` co-ordinate of the template element on the page.
     * @private
     */
    public get y() : number {
        let value : number = (typeof this.currentLocation !== 'undefined') ? this.currentLocation.y : 0;
        return value;
    }
    public set y(value : number) {
        if (this.type === TemplateType.None) {
            this.currentLocation.y = value;
        } else {
            //
        }
    }
    /**
     * Gets or sets `size` of the page template element.
     * @private
     */
    public get size() : SizeF {
        return this.template.size;
    }
    public set size(value : SizeF) {
        if (this.type === TemplateType.None) {
            this.template.reset(value);
        }
    }
    /**
     * Gets or sets `width` of the page template element.
     * @private
     */
    public get width() : number {
        return this.template.width;
    }
    public set width(value : number) {
        if (this.template.width !== value && this.type === TemplateType.None) {
            let size : SizeF = this.template.size;
            size.width = value;
            this.template.reset(size);
        }
    }
    /**
     * Gets or sets `height` of the page template element.
     * @private
     */
    public get height() : number {
        return this.template.height;
    }
    public set height(value : number) {
        if (this.template.height !== value && this.type === TemplateType.None) {
            let size : SizeF = this.template.size;
            size.height = value;
            this.template.reset(size);
        }
    }
    /**
     * Gets `graphics` context of the page template element.
     * @private
     */
    public get graphics() : PdfGraphics {
        return this.template.graphics;
    }
    /**
     * Gets Pdf `template` object.
     * @private
     */
    public get template() : PdfTemplate {
        // if (typeof this.pdfTemplate === 'undefined' || this.pdfTemplate == null) {
        //     this.pdfTemplate = new PdfTemplate(this.size);
        // }
        return this.pdfTemplate;
    }
    /**
     * Gets or sets `type` of the usage of this page template.
     * @private
     */
    public get type() : TemplateType {
        return this.templateType;
    }
    public set type(value : TemplateType) {
        this.updateDocking(value);
        this.templateType = value;
    }
    /**
     * Gets or sets `bounds` of the page template.
     * @public
     */
    public get bounds() : RectangleF {
        return new RectangleF(new PointF(this.x, this.y), this.size);
    }
    public set bounds(value : RectangleF) {
        if (this.type === TemplateType.None) {
            this.location = new PointF(value.x, value.y);
            this.size = new SizeF(value.width, value.height);
        }
    }

    // constructor
    /**
     * Creates a new page template.
     * @param bounds Bounds of the template.
     */
    public constructor(bounds : RectangleF)
    /**
     * Creates a new page template.
     * @param bounds Bounds of the template.
     * @param page Page of the template.
     */
    public constructor(bounds : RectangleF, page : PdfPage)
    /**
     * Creates a new page template.
     * @param location Location of the template.
     * @param size Size of the template.
     */
    public constructor(location : PointF, size : SizeF)
    /**
     * Creates a new page template.
     * @param location Location of the template.
     * @param size Size of the template.
     * @param page Page of the template.
     */
    public constructor(location : PointF, size : SizeF, page : PdfPage)
    /**
     * Creates a new page template.
     * @param size Size of the template.
     */
    public constructor(size : SizeF)
    /**
     * Creates a new page template.
     * @param width Width of the template.
     * @param height Height of the template.
     */
    public constructor(width : number, height : number)
    /**
     * Creates a new page template.
     * @param width Width of the template.
     * @param height Height of the template.
     * @param page The Current Page object.
     */
    public constructor(width : number, height : number, page : PdfPage)
    /**
     * Creates a new page template.
     * @param x X co-ordinate of the template.
     * @param y Y co-ordinate of the template.
     * @param width Width of the template.
     * @param height Height of the template.
     */
    public constructor(x : number, y : number, width : number, height : number)
    /**
     * Creates a new page template.
     * @param x X co-ordinate of the template.
     * @param y Y co-ordinate of the template.
     * @param width Width of the template.
     * @param height Height of the template.
     * @param page The Current Page object.
     */
    public constructor(x : number, y : number, width : number, height : number, page : PdfPage)
    /* tslint:disable */
    public constructor(arg1 : number|PointF|SizeF|RectangleF, arg2 ?: number|SizeF|PdfPage, arg3 ?: number|PdfPage, arg4 ?: number, arg5 ?: PdfPage) {
        if (arg1 instanceof RectangleF && typeof arg2 === 'undefined') {
           this.InitiateBounds(arg1.x, arg1.y, arg1.width, arg1.height, null);
        } else if (arg1 instanceof RectangleF && arg2 instanceof PdfPage && typeof arg3 === 'undefined') {
            this.InitiateBounds(arg1.x, arg1.y, arg1.width, arg1.height, arg2);
        } else if (arg1 instanceof PointF && arg2 instanceof SizeF && typeof arg3 === 'undefined') {
            this.InitiateBounds(arg1.x, arg1.y, arg2.width, arg2.height, null);
        } else if (arg1 instanceof PointF && arg2 instanceof SizeF && arg3 instanceof PdfPage && typeof arg4 === 'undefined') {
            this.InitiateBounds(arg1.x, arg1.y, arg2.width, arg2.height, arg3);
        } else if (arg1 instanceof SizeF && typeof arg2 === 'undefined') {
            this.InitiateBounds(0, 0, arg1.width, arg1.height , null);
        } else if (typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'undefined') {
            this.InitiateBounds(0, 0, arg1, arg2, null);
        } else if (typeof arg1 === 'number' && typeof arg2 === 'number' && arg3 instanceof PdfPage && typeof arg4 === 'undefined') {
            this.InitiateBounds(0, 0, arg1, arg2, arg3);
        } else if (typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'number' && typeof arg4 === 'number' && typeof arg5 === 'undefined') {
            this.InitiateBounds(arg1, arg2, arg3, arg4, null);
        } else {
            this.InitiateBounds(arg1 as number, arg2 as number, arg3 as number, arg4 as number, null);
            // this.graphics.colorSpace = this.page.document.colorSpace;
        }
        /* tslint:enable */
    }
    /**
     * `Initialize Bounds` Initialize the bounds value of the template.
     * @private
     */
    private InitiateBounds(arg1 : number, arg2 : number, arg3 : number, arg4 : number , arg5 : PdfPage) : void {
        this.x = arg1 as number;
        this.y = arg2 as number;
        this.pdfTemplate = new PdfTemplate(arg3 as number, arg4 as number);
        // this.graphics.colorSpace = this.page.document.colorSpace;
    }
    /**
     * `Updates Dock` property if template is used as header/footer.
     * @private
     */
    private updateDocking(type : TemplateType) : void {
        if (type !== TemplateType.None) {
            switch (type) {
                case TemplateType.Top:
                    this.dock = PdfDockStyle.Top;
                    break;
                case TemplateType.Bottom:
                    this.dock = PdfDockStyle.Bottom;
                    break;
                case TemplateType.Left:
                    this.dock = PdfDockStyle.Left;
                    break;
                case TemplateType.Right:
                    this.dock = PdfDockStyle.Right;
                    break;
            }
            this.resetAlignment();
        }
    }
    /**
     * `Resets alignment` of the template.
     * @private
     */
    private resetAlignment() : void {
        this.alignment = PdfAlignmentStyle.None;
    }
    /**
     * `Sets alignment` of the template.
     * @private
     */
    private setAlignment(alignment : PdfAlignmentStyle) : void {
        if (this.dock === PdfDockStyle.None) {
            this.alignmentStyle = alignment;
        } else {
            // Template is docked and alignment has been changed.
            let canBeSet : boolean = false;
            switch (this.dock) {
                case PdfDockStyle.Left:
                    canBeSet = (alignment === PdfAlignmentStyle.TopLeft || alignment === PdfAlignmentStyle.MiddleLeft ||
                        alignment === PdfAlignmentStyle.BottomLeft || alignment === PdfAlignmentStyle.None);
                    break;
                case PdfDockStyle.Top:
                    canBeSet = (alignment === PdfAlignmentStyle.TopLeft || alignment === PdfAlignmentStyle.TopCenter ||
                        alignment === PdfAlignmentStyle.TopRight || alignment === PdfAlignmentStyle.None);
                    break;
                case PdfDockStyle.Right:
                    canBeSet = (alignment === PdfAlignmentStyle.TopRight || alignment === PdfAlignmentStyle.MiddleRight ||
                        alignment === PdfAlignmentStyle.BottomRight || alignment === PdfAlignmentStyle.None);
                    break;
                case PdfDockStyle.Bottom:
                    canBeSet = (alignment === PdfAlignmentStyle.BottomLeft || alignment === PdfAlignmentStyle.BottomCenter
                                || alignment === PdfAlignmentStyle.BottomRight || alignment === PdfAlignmentStyle.None);
                    break;
                case PdfDockStyle.Fill:
                    canBeSet = (alignment === PdfAlignmentStyle.MiddleCenter || alignment === PdfAlignmentStyle.None);
                    break;
            }
            if (canBeSet) {
                this.alignmentStyle = alignment;
            }
        }
    }
    /**
     * Draws the template.
     * @private
     */
    public draw(layer : PdfPageLayer, document : PdfDocument) : void {
        let page : PdfPage = layer.page as PdfPage;
        let bounds : RectangleF = this.calculateBounds(page, document);
        if (bounds.x === -0) {
            bounds.x = 0;
        }
        layer.graphics.drawPdfTemplate(this.template, new PointF(bounds.x, bounds.y), new SizeF(bounds.width, bounds.height));
    }
    /**
     * Calculates bounds of the page template.
     * @private
     */
    private calculateBounds(page : PdfPage, document : PdfDocument) : RectangleF {
        let result : RectangleF = this.bounds;
        if (this.alignmentStyle !== PdfAlignmentStyle.None) {
            result = this.getAlignmentBounds(page, document);
        } else if (this.dockStyle !== PdfDockStyle.None) {
            result = this.getDockBounds(page, document);
        }
        return result;
    }
    /**
     * Calculates bounds according to the alignment.
     * @private
     */
    private getAlignmentBounds(page : PdfPage, document : PdfDocument) : RectangleF {
        let result : RectangleF = this.bounds;
        if (this.type === TemplateType.None) {
            result = this.getSimpleAlignmentBounds(page, document);
        } else {
            result = this.getTemplateAlignmentBounds(page, document);
        }
        return result;
    }
    /**
     * Calculates bounds according to the alignment.
     * @private
     */
    private getSimpleAlignmentBounds(page : PdfPage, document : PdfDocument) : RectangleF {
        let bounds : RectangleF = this.bounds;
        let pdfSection : PdfSection = page.section;
        let actualBounds : RectangleF = pdfSection.getActualBounds(document, page, false);
        let x : number = this.x as number;
        let y : number = this.y as number;
        switch (this.alignmentStyle) {
            case PdfAlignmentStyle.TopLeft:
                x = 0;
                y = 0;
                break;
            case PdfAlignmentStyle.TopCenter:
                x = (actualBounds.width - this.width) / 2;
                y = 0;
                break;
            case PdfAlignmentStyle.TopRight:
                x = actualBounds.width - this.width;
                y = 0;
                break;
            case PdfAlignmentStyle.MiddleLeft:
                x = 0;
                y = (actualBounds.height - this.height) / 2;
                break;
            case PdfAlignmentStyle.MiddleCenter:
                x = (actualBounds.width - this.width) / 2;
                y = (actualBounds.height - this.height) / 2;
                break;
            case PdfAlignmentStyle.MiddleRight:
                x = actualBounds.width - this.width;
                y = (actualBounds.height - this.height) / 2;
                break;
            case PdfAlignmentStyle.BottomLeft:
                x = 0;
                y = actualBounds.height - this.height;
                break;
            case PdfAlignmentStyle.BottomCenter:
                x = (actualBounds.width - this.width) / 2;
                y = actualBounds.height - this.height;
                break;
            case PdfAlignmentStyle.BottomRight:
                x = actualBounds.width - this.width;
                y = actualBounds.height - this.height;
                break;
        }
        bounds.x = x;
        bounds.y = y;
        return bounds;
    }
    /**
     * Calculates bounds according to the alignment.
     * @private
     */
    private getTemplateAlignmentBounds(page : PdfPage, document : PdfDocument) : RectangleF {
        let result : RectangleF = this.bounds;
        let section : PdfSection = page.section;
        let actualBounds : RectangleF = section.getActualBounds(document, page, false);
        let x : number = this.x;
        let y : number = this.y;
        switch (this.alignmentStyle) {
            case PdfAlignmentStyle.TopLeft:
                if (this.type === TemplateType.Left) {
                    x = -actualBounds.x;
                    y = 0;
                } else if (this.type === TemplateType.Top) {
                    x = -actualBounds.x;
                    y = -actualBounds.y;
                }
                break;
            case PdfAlignmentStyle.TopCenter:
                x = (actualBounds.width - this.width) / 2;
                y = -actualBounds.y;
                break;
            case PdfAlignmentStyle.TopRight:
                if (this.type === TemplateType.Right) {
                    x = actualBounds.width + section.getRightIndentWidth(document, page, false) - this.width;
                    y = 0;
                } else if (this.type === TemplateType.Top) {
                    x = actualBounds.width + section.getRightIndentWidth(document, page, false) - this.width;
                    y = -actualBounds.y;
                }
                break;
            case PdfAlignmentStyle.MiddleLeft:
                x = -actualBounds.x;
                y = (actualBounds.height - this.height) / 2;
                break;
            case PdfAlignmentStyle.MiddleCenter:
                x = (actualBounds.width - this.width) / 2;
                y = (actualBounds.height - this.height) / 2;
                break;
            case PdfAlignmentStyle.MiddleRight:
                x = actualBounds.width + section.getRightIndentWidth(document, page, false) - this.width;
                y = (actualBounds.height - this.height) / 2;
                break;
            case PdfAlignmentStyle.BottomLeft:
                if (this.type === TemplateType.Left) {
                    x = -actualBounds.x;
                    y = actualBounds.height - this.height;
                } else if (this.type === TemplateType.Bottom) {
                    x = -actualBounds.x;
                    y = actualBounds.height + section.getBottomIndentHeight(document, page, false) - this.height;
                }
                break;
            case PdfAlignmentStyle.BottomCenter:
                x = (actualBounds.width - this.width) / 2;
                y = actualBounds.height + section.getBottomIndentHeight(document, page, false) - this.height;
                break;
            case PdfAlignmentStyle.BottomRight:
                if (this.type === TemplateType.Right) {
                    x = actualBounds.width + section.getRightIndentWidth(document, page, false) - this.width;
                    y = actualBounds.height - this.height;
                } else if (this.type === TemplateType.Bottom) {
                    x = actualBounds.width + section.getRightIndentWidth(document, page, false) - this.width;
                    y = actualBounds.height + section.getBottomIndentHeight(document, page, false) - this.height;
                }
                break;
        }
        result.x = x;
        result.y = y;
        return result;
    }
    /**
     * Calculates bounds according to the docking.
     * @private
     */
    private getDockBounds(page : PdfPage, document : PdfDocument) : RectangleF {
        let result : RectangleF = this.bounds;
        if (this.type === TemplateType.None) {
            result = this.getSimpleDockBounds(page, document);
        } else {
            result = this.getTemplateDockBounds(page, document);
        }
        return result;
    }
    /**
     * Calculates bounds according to the docking.
     * @private
     */
    private getSimpleDockBounds(page : PdfPage, document : PdfDocument) : RectangleF {
        let result : RectangleF = this.bounds;
        let section : PdfSection = page.section;
        let actualBounds : RectangleF = section.getActualBounds(document, page, false);
        let x : number = this.x;
        let y : number = this.y;
        let width : number = this.width;
        let height : number = this.height;
        switch (this.dockStyle) {
            case PdfDockStyle.Left:
                x = 0;
                y = 0;
                width = this.width;
                height = actualBounds.height;
                break;
            case PdfDockStyle.Top:
                x = 0;
                y = 0;
                width = actualBounds.width;
                height = this.height;
                break;
            case PdfDockStyle.Right:
                x = actualBounds.width - this.width;
                y = 0;
                width = this.width;
                height = actualBounds.height;
                break;
            case PdfDockStyle.Bottom:
                x = 0;
                y = actualBounds.height - this.height;
                width = actualBounds.width;
                height = this.height;
                break;
            case PdfDockStyle.Fill:
                x = 0;
                x = 0;
                width = actualBounds.width;
                height = actualBounds.height;
                break;
        }
        result = new RectangleF(x, y, width, height);
        return result;
    }
    /**
     * Calculates template bounds basing on docking if template is a page template.
     * @private
     */
    private getTemplateDockBounds(page : PdfPage, document : PdfDocument) : RectangleF {
        let result : RectangleF = this.bounds;
        let section : PdfSection = page.section;
        let actualBounds : RectangleF = section.getActualBounds(document, page, false);
        let actualSize : SizeF = section.pageSettings.getActualSize();
        let x : number = this.x;
        let y : number = this.y;
        let width : number = this.width;
        let height : number = this.height;
        switch (this.dockStyle) {
            case PdfDockStyle.Left:
                x = -actualBounds.x;
                y = 0;
                width = this.width;
                height = actualBounds.height;
                break;
            case PdfDockStyle.Top:
                x = -actualBounds.x;
                y = -actualBounds.y;
                width = actualSize.width;
                height = this.height;
                if (actualBounds.height < 0) {
                    y = -actualBounds.y + actualSize.height;
                }
                break;
            case PdfDockStyle.Right:
                x = actualBounds.width + section.getRightIndentWidth(document, page, false) - this.width;
                y = 0;
                width = this.width;
                height = actualBounds.height;
                break;
            case PdfDockStyle.Bottom:
                x = -actualBounds.x;
                y = actualBounds.height + section.getBottomIndentHeight(document, page, false) - this.height;
                width = actualSize.width;
                height = this.height;
                if (actualBounds.height < 0) {
                    y -= actualSize.height;
                }
                break;
            case PdfDockStyle.Fill:
                x = 0;
                x = 0;
                width = actualBounds.width;
                height = actualBounds.height;
                break;
        }
        result = new RectangleF(x, y, width, height);
        return result;
    }
}