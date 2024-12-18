/**
 * PdfLayoutElement.ts class for EJ2-PDF
 */
import { PdfPage } from './../../pages/pdf-page';
import { RectangleF, PointF } from './../../drawing/pdf-drawing';
import { PdfLayoutParams, PdfLayoutFormat, PdfLayoutResult } from './base/element-layouter';
import { PdfBorders} from './../../structured-elements/grid/styles/pdf-borders';
import { PdfGridBeginPageLayoutEventArgs, PdfGridEndPageLayoutEventArgs }  from './../../structured-elements/grid/layout/grid-layouter';
import { BeginPageLayoutEventArgs, EndPageLayoutEventArgs } from './../../structured-elements/grid/layout/grid-layouter';
/**
 * `PdfLayoutElement` class represents the base class for all elements that can be layout on the pages.
 * @private
 */
export abstract class PdfLayoutElement {
    /* tslint:disable */
    /**
     * Indicating whether [`embed fonts`]
     * @private
     */
    private bEmbedFonts : boolean;
    // Events 
    public endPageLayout : Function;
    public beginPageLayout : Function;

    // Property
    /**
     * Gets a value indicating whether the `start page layout event` should be raised.
     * @private
     */   
    public get raiseBeginPageLayout() : boolean {
        return (typeof this.beginPageLayout !== 'undefined');
    }
    /**
     * Gets a value indicating whether the `ending page layout event` should be raised.
     * @private
     */
    public get raiseEndPageLayout() : boolean {
        return (typeof this.endPageLayout !== 'undefined');
    }
    //Event Handlers
    public onBeginPageLayout(args : PdfGridBeginPageLayoutEventArgs | BeginPageLayoutEventArgs): void {
        if (this.beginPageLayout) {
            this.beginPageLayout(this, args);
        }
    }
    public onEndPageLayout(args : PdfGridEndPageLayoutEventArgs | EndPageLayoutEventArgs): void {
        if (this.endPageLayout) {
            this.endPageLayout(this, args);
        }
    }
    /**
     * `Draws` the element on the page with the specified page and "PointF" class
     * @private
     */
    public drawHelper(page : PdfPage, location : PointF) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page and pair of coordinates
     * @private
     */
    public drawHelper(page : PdfPage, x : number, y : number) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page and "RectangleF" class
     * @private
     */
    public drawHelper(page : PdfPage, layoutRectangle : RectangleF) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, "PointF" class and layout format
     * @private
     */
    public drawHelper(page : PdfPage, location : PointF, format : PdfLayoutFormat) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, pair of coordinates and layout format
     * @private
     */
    public drawHelper(page : PdfPage, x : number, y : number, format : PdfLayoutFormat) : PdfLayoutResult
    /**
     * `Draws` the element on the page.
     * @private
     */
    public drawHelper(page : PdfPage, layoutRectangle : RectangleF, embedFonts : boolean) : PdfLayoutResult
    /**
     * `Draws` the element on the page with the specified page, "RectangleF" class and layout format
     * @private
     */
    public drawHelper(page : PdfPage, layoutRectangle : RectangleF, format : PdfLayoutFormat) : PdfLayoutResult
    public drawHelper(arg2 : PdfPage, arg3 : RectangleF | PointF | number, arg4 ?: PdfLayoutFormat | number | boolean, arg5 ?: PdfLayoutFormat) : PdfLayoutResult {
        if (arg3 instanceof PointF && typeof (arg3 as RectangleF).width === 'undefined' && typeof arg4 === 'undefined') {
            return this.drawHelper(arg2, arg3.x, arg3.y);
        } else if (typeof arg3 === 'number' && typeof arg4 === 'number' && typeof arg5 === 'undefined') {
            return this.drawHelper(arg2, arg3, arg4, null);
        } else if (arg3 instanceof RectangleF && typeof (arg3 as RectangleF).width !== 'undefined' && typeof arg4 === 'undefined') {
            return this.drawHelper(arg2, arg3, null);
        } else if (arg3 instanceof PointF && typeof (arg3 as RectangleF).width === 'undefined' && arg4 instanceof PdfLayoutFormat) {
            return this.drawHelper(arg2, arg3.x, arg3.y, arg4);
        } else if (typeof arg3 === 'number' && typeof arg4 === 'number' && (arg5 instanceof PdfLayoutFormat || arg5 == null)) {
            let width : number = (arg2.graphics.clientSize.width - arg3);
            let layoutRectangle : RectangleF = new RectangleF(arg3, arg4, width, 0);
            return this.drawHelper(arg2, layoutRectangle, arg5);
        } else if (arg3 instanceof RectangleF && typeof (arg3 as RectangleF).width !== 'undefined' && typeof arg4 === 'boolean') {
            this.bEmbedFonts = arg4;
            return this.drawHelper(arg2, arg3, null);
        } else {
            let param : PdfLayoutParams = new PdfLayoutParams();
            let temparg3 : RectangleF = arg3 as RectangleF;
            let temparg4 : PdfLayoutFormat = arg4 as PdfLayoutFormat;
            param.page = arg2;
            param.bounds = temparg3;
            if (param != null ) {
                let x : number = param.bounds.x;
                let y : number = param.bounds.y;
                if (param.bounds.x === 0) {
                    x = PdfBorders.default.right.width / 2;
                }
                if (param.bounds.y === 0) {
                    y = PdfBorders.default.top.width / 2;
                }
                let newBound : RectangleF = new RectangleF(x, y, param.bounds.width, param.bounds.height);
                param.bounds = newBound;
            }
            param.format = (temparg4 != null) ? temparg4 : new PdfLayoutFormat();
            let result : PdfLayoutResult = this.layout(param);
            return result;
        }
    }
   
    /**
     * `Layouts` the specified param.
     * @private
     */
    protected abstract layout(param : PdfLayoutParams) : PdfLayoutResult;
    /* tslint:enable */
}