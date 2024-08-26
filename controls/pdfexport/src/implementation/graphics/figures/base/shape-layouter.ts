/**
 * ShapeLayouter.ts class for EJ2-PDF
 * @private
 */
import { ElementLayouter, PdfLayoutResult, PdfLayoutParams } from './element-layouter';
import { RectangleF, SizeF, PointF } from './../../../drawing/pdf-drawing';
import { PdfPage } from './../../../pages/pdf-page';
import { PdfShapeElement } from './pdf-shape-element';
import { PdfLayoutBreakType, PdfLayoutType } from './../../figures/enum';
import { BeginPageLayoutEventArgs, EndPageLayoutEventArgs } from './../../../structured-elements/grid/layout/grid-layouter';
import { PdfGraphics, PdfGraphicsState } from './../../pdf-graphics';
/**
 * ShapeLayouter class.
 * @private
 */
export class ShapeLayouter extends ElementLayouter {
    // Fields
    /**
     * Initializes the object to store `older form elements` of previous page.
     * @default 0
     * @private
     */
    public olderPdfForm : number = 0;
    /**
     * Initializes the offset `index`.
     * * @default 0
     * @private
     */
    private static index : number = 0;
    /**
     * Initializes the `difference in page height`.
     * * @default 0
     * @private
     */
    private static splitDiff : number = 0;
    /**
     * Determines the `end of Vertical offset` values.
     * * @default false
     * @private
     */
    private static last : boolean = false;
    /**
     * Determines the document link annotation `border width`.
     * * @default 0
     * @private
     */
    private static readonly borderWidth : number = 0;
    /**
     * Checks weather `is pdf grid` or not.
     * @private
     */
    public isPdfGrid : boolean;
    /**
     * The `bounds` of the shape element.
     * * @default new RectangleF()
     * @private
     */
    public shapeBounds : RectangleF = new RectangleF();
    /**
     * The `bottom cell padding`.
     * @private
     */
    public bottomCellPadding : number;
    /**
     * Total Page size of the web page.
     * * @default 0
     * @private
     */
    private totalPageSize : number = 0;

    // Constructors
    /**
     * Initializes a new instance of the `ShapeLayouter` class.
     * @private
     */
    public constructor(element : PdfShapeElement) {
        super(element);
    }
    // Properties
    /**
     * Gets shape element.
     * @private
     */
    public get element() : PdfShapeElement {
        return (this.elements as PdfShapeElement);
    }
    // Implementation
    /**
     * Layouts the element.
     * @private
     */
    protected layoutInternal(param : PdfLayoutParams) : PdfLayoutResult {
        let currentPage : PdfPage = param.page;
        let currentBounds : RectangleF = param.bounds;
        let shapeLayoutBounds : RectangleF = this.element.getBounds();
        shapeLayoutBounds.x = 0;
        shapeLayoutBounds.y = 0;
        /* tslint:disable */
        let isEmpty : boolean = (this.shapeBounds.x === this.shapeBounds.y && this.shapeBounds.y === this.shapeBounds.width && this.shapeBounds.width === this.shapeBounds.height && this.shapeBounds.height === 0) ? true : false;
        /* tslint:enable */
        if ((this.isPdfGrid) && (!(isEmpty))) {
            shapeLayoutBounds = this.shapeBounds;
        }
        let result : PdfLayoutResult = null;
        let pageResult : ShapeLayoutResult = new ShapeLayoutResult();
        pageResult.page = currentPage;
        /*tslint:disable:no-constant-condition */
        while (true) {
            // Raise event.
            let result1 : { currentBounds: RectangleF, cancel : boolean } = this.raiseBeforePageLayout(currentPage, currentBounds);
            currentBounds = result1.currentBounds;
            let endArgs : EndPageLayoutEventArgs = null;
            if (!result1.cancel) {
                pageResult = this.layoutOnPage(currentPage, currentBounds, shapeLayoutBounds, param);
                // Raise event.
                endArgs = this.raiseEndPageLayout(pageResult);
                result1.cancel = (endArgs === null) ? false : endArgs.cancel;
            }
            if (!pageResult.end && !result1.cancel) {
                currentBounds = this.getPaginateBounds(param);
                shapeLayoutBounds = this.getNextShapeBounds(shapeLayoutBounds, pageResult);
                currentPage = (endArgs === null || endArgs.nextPage === null) ?
                    this.getNextPage(currentPage) : endArgs.nextPage;
                if (this.isPdfGrid) {
                    result = this.getLayoutResult(pageResult);
                    break;
                }
            } else {
                result = this.getLayoutResult(pageResult);
                break;
            }
        }
        return result;
    }
    /**
     * Raises BeforePageLayout event.
     * @private
     */
    private raiseBeforePageLayout(currentPage: PdfPage, currentBounds: RectangleF): { currentBounds : RectangleF, cancel : boolean } {
        let cancel: boolean = false;
        if (this.element.raiseBeginPageLayout) {
            let args: BeginPageLayoutEventArgs = new BeginPageLayoutEventArgs(currentBounds, currentPage);
            this.element.onBeginPageLayout(args);
            cancel = args.cancel;
            currentBounds = args.bounds;
        }
        return { currentBounds : currentBounds, cancel : cancel};
    }
    /**
     * Raises PageLayout event if needed.
     * @private
     */
    private raiseEndPageLayout(pageResult: ShapeLayoutResult): EndPageLayoutEventArgs {
        let args: EndPageLayoutEventArgs = null;
        if (this.element.raiseEndPageLayout) {
            let res: PdfLayoutResult = this.getLayoutResult(pageResult);
            args = new EndPageLayoutEventArgs(res);
            this.element.onEndPageLayout(args);
        }
        return args;
    }
    /**
     * Creates layout result.
     * @private
     */
    private getLayoutResult(pageResult: ShapeLayoutResult): PdfLayoutResult {
        let result: PdfLayoutResult = new PdfLayoutResult(pageResult.page, pageResult.bounds);
        return result;
    }
    /**
     * Calculates the next active shape bounds.
     * @private
     */
    private getNextShapeBounds(shapeLayoutBounds: RectangleF, pageResult: ShapeLayoutResult): RectangleF {
        let layoutedBounds: RectangleF = pageResult.bounds;
        shapeLayoutBounds.y = (shapeLayoutBounds.y + layoutedBounds.height);
        shapeLayoutBounds.height = (shapeLayoutBounds.height - layoutedBounds.height);
        return shapeLayoutBounds;
    }
    /**
     * Layouts the element on the current page.
     * @private
     */
    private layoutOnPage(currentPage: PdfPage, curBounds: RectangleF, sBounds: RectangleF, param: PdfLayoutParams): ShapeLayoutResult {
        let result: ShapeLayoutResult = new ShapeLayoutResult();
        curBounds = this.checkCorrectCurrentBounds(currentPage, curBounds, param);
        let fitToPage: boolean = this.fitsToBounds(curBounds, sBounds);
        let canDraw: boolean = !((param.format.break === PdfLayoutBreakType.FitElement)
                    && (!fitToPage && (currentPage === param.page)));
        let shapeFinished: boolean = false;
        if (canDraw) {
            let drawRectangle: RectangleF = this.getDrawBounds(curBounds, sBounds);
            this.drawShape(currentPage.graphics, curBounds, drawRectangle);
            result.bounds = this.getPageResultBounds(curBounds, sBounds);
            shapeFinished = ((<number>(curBounds.height)) >= (<number>(sBounds.height)));
        }
        result.end = (shapeFinished || (param.format.layout === PdfLayoutType.OnePage));
        result.page = currentPage;
        return result;
    }
    /**
     * Returns Rectangle for element drawing on the page.
     * @private
     */
    private getDrawBounds(currentBounds: RectangleF, shapeLayoutBounds: RectangleF): RectangleF {
        let result: RectangleF = currentBounds;
        result.y = (result.y - shapeLayoutBounds.y);
        result.height = (result.height + shapeLayoutBounds.y);
        return result;
    }
    /**
     * Draws the shape.
     * @private
     */
    private drawShape(g: PdfGraphics, currentBounds: RectangleF, drawRectangle: RectangleF): void {
        let gState: PdfGraphicsState = g.save();
        try {
            g.setClip(currentBounds);
            this.element.drawGraphicsHelper(g, new PointF(drawRectangle.x, drawRectangle.y));
        }
        finally {
            g.restore(gState);
        }
    }
    /**
     * Corrects current bounds on the page.
     * @protected
     */
    protected checkCorrectCurrentBounds(currentPage: PdfPage, curBounds: RectangleF, param: PdfLayoutParams): RectangleF {
        let pageSize: SizeF = currentPage.graphics.clientSize;
        curBounds.width = (curBounds.width > 0) ? curBounds.width : (pageSize.width - curBounds.x);
        curBounds.height = (curBounds.height > 0) ? curBounds.height : (pageSize.height - curBounds.y);
        if (this.isPdfGrid) {
            curBounds.height = (curBounds.height - this.bottomCellPadding);
        }
        return curBounds;
    }
    /**
     * Calculates bounds where the shape was layout on the page.
     * @private
     */
    private getPageResultBounds(currentBounds: RectangleF, shapeLayoutBounds: RectangleF): RectangleF {
        let result: RectangleF = currentBounds;
        result.height = Math.min(result.height, shapeLayoutBounds.height);
        return result;
    }
    /**
     * Checks whether shape rectangle fits to the lay outing bounds.
     * @private
     */
    private fitsToBounds(currentBounds: RectangleF, shapeLayoutBounds: RectangleF): boolean {
        let fits: boolean = (shapeLayoutBounds.height <= currentBounds.height);
        return fits;
    }
}
/**
 * Contains lay outing result settings.
 * @private
 */
class ShapeLayoutResult {
    /**
     * The last page where the element was drawn.
     * @private
     */
    public page : PdfPage;
    /**
     * The bounds of the element on the last page where it was drawn.
     * @private
     */
    public bounds : RectangleF;
    /**
     * Indicates whether the lay outing has been finished.
     * @private
     */
    public end : boolean;
}