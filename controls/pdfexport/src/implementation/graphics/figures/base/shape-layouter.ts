/**
 * ShapeLayouter.ts class for EJ2-PDF
 * @private
 */
import { ElementLayouter, PdfLayoutResult, PdfLayoutParams } from './element-layouter';
import { RectangleF } from './../../../drawing/pdf-drawing';
import { PdfPage } from './../../../pages/pdf-page';
import { PdfShapeElement } from './pdf-shape-element';
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
        // while (true) {
        //     // Raise event.
        //     // let cancel : boolean = this.RaiseBeforePageLayout(currentPage, currentBounds);
        //     let endArgs : EndPageLayoutEventArgs = null;
        //     if (!cancel) {
        //         pageResult = this.LayoutOnPage(currentPage, currentBounds, shapeLayoutBounds, param);
        //         // Raise event.
        //         endArgs = this.RaiseEndPageLayout(pageResult);
        //         cancel = (endArgs == null) ? false : endArgs.Cancel;
        //     }
        //     // Tagged PDF
        //     if (pageResult.Page.Document.FileStructure.TaggedPdf && !pageResult.End && !cancel) {
        //         return new PdfLayoutResult(pageResult.Page, pageResult.Bounds);
        //     }
        //     if (!pageResult.End && !cancel) {
        //         currentBounds = this.GetPaginateBounds(param);
        //         shapeLayoutBounds = this.GetNextShapeBounds(shapeLayoutBounds, pageResult);
        //         currentPage = (endArgs == null || endArgs.NextPage == null) ?
        //             this.GetNextPage(currentPage) : endArgs.NextPage;
        //         if (this.isPdfGrid) {
        //             result = this.GetLayoutResult(pageResult);
        //             break;
        //         }
        //     } else {
        //         result = this.GetLayoutResult(pageResult);
        //         break;
        //     }
        // }
        return result;
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
    public end : RectangleF;
}