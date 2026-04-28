/**
 * ElementLayouter.ts class for EJ2-PDF
 */
import { RectangleF } from './../../../drawing/pdf-drawing';
import { PdfPage } from './../../../pages/pdf-page';
import { PdfLayoutType, PdfLayoutBreakType } from './../enum';
import { PdfLayoutElement } from './../layout-element';
import { PdfSection } from './../../../pages/pdf-section';
/**
 * Base class for `elements lay outing`.
 * @private
 */
export abstract class ElementLayouter {
    // Fields
    /**
     * Layout the `element`.
     * @private
     */
    private layoutElement : PdfLayoutElement;
    // Constructor
    /**
     * Initializes a new instance of the `ElementLayouter` class.
     * @private
     */
    public constructor(element : PdfLayoutElement) {
        this.layoutElement = element;
    }
    // Properties
    /**
     * Gets the `element`.
     * @private
     */
    public get elements() : PdfLayoutElement {
        return this.layoutElement;
    }
    /**
     * Gets the `element`.
     * @private
     */
    public getElement() : PdfLayoutElement {
        return this.layoutElement;
    }
    // Implementation
    /**
     * `Layouts` the element.
     * @private
     */
    public layout(param : PdfLayoutParams) : PdfLayoutResult {
        return this.layoutInternal(param);
    }
    public Layouter(param : PdfLayoutParams) : PdfLayoutResult {
        return this.layoutInternal(param);
    }
    /**
     * Returns the `next page`.
     * @private
     */
    public getNextPage(currentPage : PdfPage) : PdfPage {
        let section : PdfSection = currentPage.section;
        let nextPage : PdfPage = section.add() as PdfPage;
        return nextPage;
    }
    protected getPaginateBounds(param: PdfLayoutParams): RectangleF {
        if ((param == null)) {
            throw new Error('ArgumentNullException : param');
        }
        let result : RectangleF = param.format.usePaginateBounds ? param.format.paginateBounds
         : new RectangleF(param.bounds.x, 0, param.bounds.width, param.bounds.height);
        return result;
    }
    /**
     * `Layouts` the element.
     * @private
     */
    protected abstract layoutInternal(param : PdfLayoutParams) : PdfLayoutResult;
   // protected abstract layoutInternal(param : PdfLayoutParams, isBoundsChanged ?: boolean) : PdfLayoutResult;
}
export class PdfLayoutFormat {
    // Fields
    /**
     * Indicates whether `PaginateBounds` were set and should be used or not.
     * @private
     */
    private boundsSet : boolean;
    /**
     * `Bounds` for the paginating.
     * @private
     */
    private layoutPaginateBounds : RectangleF;
    /**
     * `Layout` type of the element.
     * @private
     */
    private layoutType : PdfLayoutType;
    /**
     * `Break` type of the element.
     * @private
     */
    private breakType : PdfLayoutBreakType;

    // Properties
    /**
     * Gets or sets `layout` type of the element.
     * @private
     */
    public get layout() : PdfLayoutType {
        // if (typeof this.layoutType === 'undefined' || this.layoutType == null) {
        //      this.layoutType = PdfLayoutType.Paginate;
        // }
        return this.layoutType;
    }
    public set layout(value : PdfLayoutType) {
        this.layoutType = value;
    }
    /**
     * Gets or sets `break` type of the element.
     * @private
     */
    public get break() : PdfLayoutBreakType {
        // if (typeof this.breakType === 'undefined' || this.boundsSet == null) {
        //      this.breakType = PdfLayoutBreakType.FitPage;
        // }
        return this.breakType;
    }
    public set break(value : PdfLayoutBreakType) {
        this.breakType = value;
    }
    /**
     * Gets or sets the `bounds` on the next page.
     * @private
     */
    public get paginateBounds() : RectangleF {
        if (typeof this.layoutPaginateBounds === 'undefined' && this.layoutPaginateBounds == null) {
            this.layoutPaginateBounds = new RectangleF(0, 0, 0, 0);
        }
        return this.layoutPaginateBounds;
    }
    public set paginateBounds(value : RectangleF) {
        this.layoutPaginateBounds = value;
        this.boundsSet = true;
    }
    /**
     * Gets a value indicating whether [`use paginate bounds`].
     * @private
     */
    public get usePaginateBounds() : boolean {
        // if (typeof this.boundsSet === 'undefined' || this.boundsSet == null) {
        //      this.boundsSet = false;
        // }
        return this.boundsSet;
    }
    // Constructors
    /**
     * Initializes a new instance of the `PdfLayoutFormat` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfLayoutFormat` class.
     * @private
     */
    public constructor(baseFormat : PdfLayoutFormat)
    public constructor(baseFormat ?: PdfLayoutFormat) {
        if (typeof baseFormat === 'undefined') {
            //
        } else {
            this.break = baseFormat.break;
            this.layout = baseFormat.layout;
            this.paginateBounds = baseFormat.paginateBounds;
            this.boundsSet = baseFormat.usePaginateBounds;
        }
    }
}
export class PdfLayoutParams {
    // Fields
    /**
     * The last `page` where the element was drawn.
     * @private
     */
    private pdfPage : PdfPage;
    /**
     * The `bounds` of the element on the last page where it was drawn.
     * @private
     */
    private layoutBounds : RectangleF;
    /**
     * Layout settings as `format`.
     * @private
     */
    private layoutFormat : PdfLayoutFormat;
    // Properties
    /**
     * Gets or sets the layout `page` for the element.
     * @private
     */
    public get page() : PdfPage {
        return this.pdfPage;
    }
    public set page(value : PdfPage) {
        this.pdfPage = value;
    }
    /**
     * Gets or sets layout `bounds` for the element.
     * @private
     */
    public get bounds() : RectangleF {
        return new RectangleF(this.layoutBounds.x, this.layoutBounds.y, this.layoutBounds.width, this.layoutBounds.height);
    }
    public set bounds(value : RectangleF) {
        this.layoutBounds = value;
    }
    /**
     * Gets or sets `layout settings` for the element.
     * @private
     */
    public get format() : PdfLayoutFormat {
        return this.layoutFormat;
    }
    public set format(value : PdfLayoutFormat) {
        this.layoutFormat = value;
    }
}
export class PdfLayoutResult {
    // Fields    
    /**
     * The last `page` where the element was drawn.
     * @private
     */
    private pdfPage : PdfPage;
    /**
     * The `bounds` of the element on the last page where it was drawn.
     * @private
     */
    private layoutBounds : RectangleF;

    // Properties
    /**
     * Gets the last `page` where the element was drawn.
     * @private
     */
    public get page() : PdfPage {
        return this.pdfPage;
    }
    /**
     * Gets the `bounds` of the element on the last page where it was drawn.
     * @private
     */
    public get bounds() : RectangleF {
         return this.layoutBounds;
    }
    // Constructors
    /**
     * Initializes the new instance of `PdfLayoutResult` class.
     * @private
     */
    public constructor(page : PdfPage, bounds : RectangleF) {
        this.pdfPage = page;
        this.layoutBounds = bounds;
    }
}