/**
 * Path.ts class for EJ2-PDF
 */
import { PdfBrush } from './../brushes/pdf-brush';
import { PdfPen } from './../pdf-pen';
import { PdfLayoutResult, PdfLayoutFormat } from './../figures/base/element-layouter';
import { PdfGraphics } from './../pdf-graphics';
import { RectangleF, PointF } from './../../drawing/pdf-drawing';
import { PdfPage } from './../../pages/pdf-page';
import { PathPointType } from './enum';
import { PdfFillElement} from './../figures/base/fill-element';
import { PdfFillMode} from './../enum';
/**
 * `PdfPath` class Implements graphics path, which is a sequence of primitive graphics elements.
 * @private
 */
export class PdfPath extends PdfFillElement {
    // Fields
    /**
     * Local variable to store the points.
     * @private
     */
    private mpoints : PointF[] = null;
    /**
     * Local variable to store the path Types.
     * @private
     */
    private mpathTypes : number[] = null;
    /**
     * Local variable to store the Start Figure.
     * @private
     */
    private mStartFigure : boolean = true;
    /**
     * Local variable to store the fill Mode.
     * @private
     */
    private mfillMode: PdfFillMode = PdfFillMode.Alternate;
    /**
     * Local variable to store the Beziers.
     * @private
     */
    private isBeziers3: boolean = false;
    /**
     * Local variable to store the xps.
     * @private
     */
    private isXps: boolean = false;
    // Constructor
    /**
     * Initializes a new instance of the `PdfPath` class.
     * @public
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfPath` class.
     * @public
     */
    public constructor(pen: PdfPen)
    /**
     * Initializes a new instance of the `PdfPath` class.
     * @public
     */
    public constructor(brush: PdfBrush)
    /**
     * Initializes a new instance of the `PdfPath` class.
     * @public
     */
    public constructor(points: PointF[], pathTypes: number[])
    /**
     * Initializes a new instance of the `PdfPath` class.
     * @public
     */
    public constructor(brush: PdfBrush, fillMode: PdfFillMode)
    /**
     * Initializes a new instance of the `PdfPath` class.
     * @public
     */
    public constructor(pen: PdfPen, points: PointF[], pathTypes: number[])
    /**
     * Initializes a new instance of the `PdfPath` class.
     * @public
     */
    public constructor(pen: PdfPen, brush: PdfBrush, fillMode: PdfFillMode)
    /**
     * Initializes a new instance of the `PdfPath` class.
     * @public
     */
    public constructor(brush: PdfBrush, fillMode: PdfFillMode, points: PointF[], pathTypes: number[])
    /**
     * Initializes a new instance of the `PdfPath` class.
     * @public
     */
    /* tslint:disable-next-line:max-line-length */
    public constructor(arg1?: PdfPen|PdfBrush|PointF[], arg2?: PdfFillMode|number[]|PointF[]|PdfBrush, arg3?: PointF[]|number[]|PdfFillMode, arg4?: number[]) {
        super();
        if (typeof arg1 === 'undefined') {
            //
        } else if (arg1 instanceof PdfPen) {
            super(<PdfPen>arg1);
            if (arg2 instanceof PdfBrush) {
                super(<PdfPen> arg1, <PdfBrush>arg2);
                this.fillMode = <PdfFillMode>arg3;
            } else if (arg2 !== null && typeof arg2 !== 'undefined' && arg3 !== null && typeof arg3 !== 'undefined') {
                this.addPath(<PointF[]>arg2, <number[]>arg3);
            }
        } else if (arg1 instanceof PdfBrush) {
            super(<PdfBrush>arg1);
            if (arg2 !== null && typeof arg2 !== 'undefined') {
                this.fillMode = <PdfFillMode>arg2;
            }
            if (arg3 !== null && typeof arg3 !== 'undefined' && arg4 !== null && typeof arg4 !== 'undefined' ) {
                this.addPath(<PointF[]>arg3, <number[]>arg4);
            }
        } else {
            this.addPath(arg1, <number[]>arg2);
        }
    }
    // Properties
    /**
     * Gets or sets the fill mode.
     * @public
     */
    public get fillMode(): PdfFillMode {
        return this.mfillMode;
    }
    public set fillMode(value: PdfFillMode)  {
        this.mfillMode = value;
    }
    /**
     * Gets the path points.
     * @public
     */
    public get pathPoints(): PointF[] {
        return this.points;
    }
    /**
     * Gets the path point types.
     * @public
     */
    public get pathTypes(): number[] {
        return this.types;
    }
    /**
     * Gets the point count.
     * @public
     */
    public get pointCount(): number {
        let count: number = 0;
        if ((this.mpoints != null)) {
            count = this.mpoints.length;
        }
        return count;
    }
    /**
     * Gets the last points.
     * @public
     */
    public get lastPoint(): PointF {
        return this.getLastPoint();
    }
    /**
     * Gets the points list.
     * @private
     */
    private get points(): PointF[] {
        if ((this.mpoints == null)) {
            this.mpoints = [];
        }
        return this.mpoints;
    }
    /**
     * Gets the types.
     * @private
     */
    private get types(): number[] {
        if ((this.mpathTypes == null)) {
            this.mpathTypes = [];
        }
        return this.mpathTypes;
    }
    // Public methods
    /**
     * `draw` the element on the page with the specified page and 'PointF' class
     * @param page Current page where the element should be drawn.
     * @param location Start location on the page.
     */
    public draw(page : PdfPage, location : PointF) : PdfLayoutResult
    /**
     * `draw` the element on the page with the specified page and pair of coordinates
     * @private
     */
    public draw(page : PdfPage, x : number, y : number) : PdfLayoutResult
    /**
     * `draw` the element on the page with the specified page and 'RectangleF' class
     * @private
     */
    public draw(page : PdfPage, layoutRectangle : RectangleF) : PdfLayoutResult
    /**
     * `draw` the element on the page with the specified page, 'PointF' class and layout format
     * @private
     */
    public draw(page : PdfPage, location : PointF, format : PdfLayoutFormat) : PdfLayoutResult
    /**
     * `draw` the element on the page with the specified page, pair of coordinates and layout format
     * @private
     */
    public draw(page : PdfPage, x : number, y : number, format : PdfLayoutFormat) : PdfLayoutResult
    /**
     * `draw` the element on the page.
     * @private
     */
    public draw(page : PdfPage, layoutRect : RectangleF, format : PdfLayoutFormat) : PdfLayoutResult
    public draw(arg1 : PdfPage, arg2 : RectangleF|PointF|number, arg3 ?: PdfLayoutFormat|number,
                arg4 ?: PdfLayoutFormat) : PdfLayoutResult {
        if (arg2 instanceof PointF && typeof (arg2 as RectangleF).width === 'undefined' && typeof arg3 === 'undefined') {
            return this.drawHelper(arg1, arg2.x, arg2.y);
        } else if (arg2 instanceof RectangleF && typeof (arg2 as RectangleF).width !== 'undefined' && typeof arg3 === 'undefined') {
            return this.drawHelper(arg1, arg2, null);
        } else if (typeof arg2 === 'number' && typeof arg3 === 'number' && typeof arg4 === 'undefined') {
            return this.drawHelper(arg1, arg2, arg3, null);
        } else if (arg2 instanceof PointF && arg3 instanceof PdfLayoutFormat) {
            return this.drawHelper(arg1, arg2.x, arg2.y, arg3);
        } else if (typeof arg2 === 'number' && (arg4 instanceof PdfLayoutFormat || arg4 == null) && typeof arg3 === 'number') {
            let widthValue : number = (arg1.graphics.clientSize.width - arg2);
            let layoutRect : RectangleF = new RectangleF(arg2, arg3, widthValue, 0);
            return this.drawHelper(arg1, layoutRect, arg4);
        } else if (arg2 instanceof RectangleF && arg3 instanceof PdfLayoutFormat) {
            return this.drawHelper(arg1, arg2, arg3);
        } else {
            return this.drawHelper(arg1, (arg2 as RectangleF), arg3 as PdfLayoutFormat);
        }
    }
    /**
     * `add a arc` specified by a rectangle, a coordinate start angle and sweepangle.
     * @param rectangle The boundaries of the arc.
     * @param startAngle The start angle of the arc.
     * @param sweepAngle The angle between startAngle and the end of the arc.
     */
    public addArc(rectangle: RectangleF, startAngle: number, sweepAngle: number) : void
    /**
     * `add a arc` specified by a x , y coordinate points, a width, a height and coordinate start angle and sweepangle.
     * @param x The x-coordinate of the upper-left corner of the rectangular region.
     * @param y The y-coordinate of the upper-left corner of the rectangular region
     * @param width The width of the rectangular region.
     * @param height The height of the rectangular region.
     * @param startAngle The start angle of the arc.
     * @param sweepAngle The angle between startAngle and the end of the arc.
     */
    public addArc(x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number) : void
    public addArc(arg1: number|RectangleF, arg2?: number, arg3?: number, arg4?: number, arg5?: number, arg6?: number) : void {
        if (arg1 instanceof RectangleF) {
            this.addArc(arg1.x, arg1.y, arg1.width, arg1.height, arg2, arg3);
        } else {
            let points: number[] = this.getBezierArcPoints(<number>arg1, arg2, (arg2 + arg3), (arg2 + arg4), arg5, arg6);
            for (let i : number = 0 ; i < points.length ; i = i + 8 ) {
                /* tslint:disable-next-line:max-line-length */
                let point : number[] = [ points[i], points[i + 1], points[i + 2], points[i + 3], points[i + 4], points[i + 5], points[i + 6], points[i + 7]];
                this.addPoints(point, PathPointType.Bezier3);
            }
        }
    }
    /**
     * `add a bezier curve` specified by region points.
     * @param startPoint The start point - represents the starting point of the curve.
     * @param firstControlPoint The first control point - represents the second control point of the curve.
     * @param secondControlPoint The second control point - represents the second control point of the curve.
     * @param endPoint The end point - represents the end point of the curve.
     */
    public addBezier(startPoint: PointF, firstControlPoint: PointF, secondControlPoint: PointF, endPoint: PointF) : void
    /**
     * `add a bezier curve` specified by region points.
     * @param startPointX The start point X.
     * @param startPointY The start point Y.
     * @param firstControlPointX The first control point X.
     * @param firstControlPointY The first control point Y.
     * @param secondControlPointX The second control point X.
     * @param secondControlPointY The second control point Y.
     * @param endPointX The end point X.
     * @param endPointY The end point Y.
     */
    /* tslint:disable-next-line:max-line-length */
    public addBezier(startPointX: number, startPointY: number, firstControlPointX: number, firstControlPointY: number, secondControlPointX: number, secondControlPointY: number, endPointX: number, endPointY: number) : void
    /* tslint:disable-next-line:max-line-length */
    public addBezier(arg1: number|PointF, arg2: number|PointF, arg3: number|PointF, arg4: number|PointF, arg5?: number, arg6?: number, arg7?: number, arg8?: number) : void {
        if (arg1 instanceof PointF && arg2 instanceof PointF && arg3 instanceof PointF && arg4 instanceof PointF ) {
            this.addBezier(arg1.x, arg1.y, arg2.x, arg2.y, arg3.x, arg3.y, arg4.x, arg4.y);
        } else {
            let points : number[] = [];
            points.push(<number>arg1);
            points.push(<number>arg2);
            points.push(<number>arg3);
            points.push(<number>arg4);
            points.push(arg5);
            points.push(arg6);
            points.push(arg7);
            points.push(arg8);
            this.addPoints(points, PathPointType.Bezier3);
        }
    }
    /**
     * `add a ellipse` specified by a rectangle.
     * @param rectangle The boundaries of the ellipse.
     */
    public addEllipse(rectangle : RectangleF) : void
    /**
     * `add a ellipse` specified by a rectangle bounds .
     * @param x The x-coordinate of the upper-left corner of the rectangular region.
     * @param y The y-coordinate of the upper-left corner of the rectangular region.
     * @param width The width of the rectangular region.
     * @param height The height of the rectangular region.
     */
    public addEllipse(x : number, y : number, width : number, height : number) : void
    public addEllipse(arg1 : number|RectangleF, arg2 ?: number, arg3 ?: number, arg4 ?: number) : void {
        if (arg1 instanceof RectangleF) {
            this.addEllipse(arg1.x, arg1.y, arg1.width, arg1.height);
        } else {
            this.startFigure();
            this.addArc(arg1, arg2, arg3, arg4, 0, 360);
            this.closeFigure();
        }
    }
    /**
     * `add a line` specified by points .
     * @param point1 The start point of the line.
     * @param point2 The end point of the line.
     */
    public addLine(point1: PointF, point2: PointF) : void
    /**
     * `add a line` specified by a rectangle bounds.
     * @param x1 The x-coordinate of the starting point of the line.
     * @param y1 The y-coordinate of the starting point of the line.
     * @param x2 The x-coordinate of the end point of the line.
     * @param y2 The y-coordinate of the end point of the line.
     */
    public addLine(x1: number, y1: number, x2: number, y2: number) : void
    public addLine(arg1: number|PointF, arg2: number|PointF, arg3?: number, arg4?: number): void {
        if (arg1 instanceof PointF && arg2 instanceof PointF) {
            this.addLine(arg1.x, arg1.y, arg2.x, arg2.y);
        } else {
            let points: number[] = [];
            points.push(<number>arg1);
            points.push(<number>arg2);
            points.push(arg3);
            points.push(arg4);
            this.addPoints(points, PathPointType.Line);
        }
    }
    /**
     * `add a path` specified by a path, appends the path specified to this one.
     * @param path The path, which should be appended.
     */
    public addPath(path : PdfPath) : void
    /**
     * `add a path` specified by a path points and path types.
     * @param pathPoints The array of points that represents the points to define the path
     * @param pathTypes The path types specifies the types of the corresponding points in the path.
     */
    public addPath(pathPoints: PointF[], pathTypes: number[]) : void
    public addPath(arg1: PointF[]|PdfPath, arg2?: number[]) : void {
        if (arg1 instanceof PdfPath) {
            this.addPath((<PdfPath>arg1).pathPoints, arg1.pathTypes);
        } else {
            if ((arg1 == null)) {
                throw new Error('ArgumentNullException:pathPoints');
            }
            if ((arg2 == null)) {
                throw new Error('ArgumentNullException:pathTypes');
            }
            let count: number = arg1.length;
            if ((count !== arg2.length)) {
                throw new Error('The argument arrays should be of equal length.');
            }
        }
    }
    /**
     * `add a pie` specified by a rectangle, a coordinate start angle and sweepangle.
     * @param rectangle The bounding rectangle of the pie.
     * @param startAngle The start angle of the pie.
     * @param sweepAngle The sweep angle of the pie.
     */
    public addPie(rectangle: RectangleF, startAngle: number, sweepAngle: number) : void
    /**
     * `add a pie` specified by x , y coordinate points, a width, a height and start angle and sweepangle.
     * @param x The x-coordinate of the upper-left corner of the bounding rectangle.
     * @param y The y-coordinate of the upper-left corner of the bounding rectangle.
     * @param width The width of the bounding rectangle.
     * @param height The height of the bounding rectangle
     * @param startAngle The start angle of the pie.
     * @param sweepAngle The sweep angle of the pie.
     */
    public addPie(x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number) : void
    public addPie(arg1: number|RectangleF, arg2?: number, arg3?: number, arg4?: number, arg5?: number, arg6?: number) : void {
        if (arg1 instanceof RectangleF) {
            this.addPie(arg1.x, arg1.y, arg1.width, arg1.height, arg2, arg3);
        } else {
            this.startFigure();
            this.addArc(<number>arg1, arg2, arg3, arg4, arg5, arg6);
            this.addPoint(new PointF((arg1 + (arg3 / 2)), (arg2 + (arg4 / 2))), PathPointType.Line);
            this.closeFigure();
        }
    }
    /**
     * `add a polygon` specified by points.
     * @param points The points of the polygon
     */
    public addPolygon(points: PointF[]) : void {
        let count: number = (points.length * 2);
        let p: number[] = [];
        this.startFigure();
        for (let i: number = 0; i < points.length ; i++) {
            p.push(points[i].x);
            p.push(points[i].y);
        }
        this.addPoints(p, PathPointType.Line);
        this.closeFigure();
    }
    /**
     * `add a rectangle` specified by a rectangle.
     * @param rectangle The rectangle.
     */
    public addRectangle(rectangle: RectangleF) : void
    /**
     * `add a rectangle` specified by a rectangle.
     * @param x The x-coordinate of the upper-left corner of the rectangular region.
     * @param y The y-coordinate of the upper-left corner of the rectangular region
     * @param width The width of the rectangular region.
     * @param height The height of the rectangular region.
     */
    public addRectangle(x: number, y: number, width: number, height: number) : void
    public addRectangle(arg1: number|RectangleF, y?: number, width?: number, height?: number) : void {
        if (arg1 instanceof RectangleF) {
            this.addRectangle(arg1.x, arg1.y, arg1.width, arg1.height);
        } else {
            let points: number[] = [];
            this.startFigure();
            points.push(<number>arg1);
            points.push(y);
            points.push((<number>arg1 + width));
            points.push(y);
            points.push((<number>arg1 + width));
            points.push((y + height));
            points.push(<number>arg1);
            points.push((y + height));
            this.addPoints(points, PathPointType.Line);
            this.closeFigure();
        }
    }
    /**
     * Starts a new figure.
     * @public
     */
    public startFigure() : void {
        this.mStartFigure = true;
    }
    /**
     * Closed all non-closed figures.
     * @public
     */
    public closeAllFigures() : void {
        let startPath: PointF = this.pathPoints[0];
        for (let i: number = 0 ; i < this.mpathTypes.length; i++) {
            let pt: PathPointType = (<PathPointType>((<number>(this.types[i]))));
            let flag: boolean = false;
            if (((i !== 0) && (pt === PathPointType.Start))) {
                this.closeFigure((i - 1));
                flag = true;
            } else if (((i === (this.mpathTypes.length - 1)) && (!flag && this.isXps))) {
                if ((startPath.x === this.pathPoints[i].y)) {
                    this.closeFigure(i);
                }
            }
        }
    }
    /**
     * Gets the last point.
     * @public
     */
    public getLastPoint(): PointF {
        let lastPoint: PointF = new PointF(0, 0);
        let count: number = this.pointCount;
        if (((count > 0)  && (this.mpoints != null))) {
            lastPoint.x = this.mpoints[(count - 1)].x;
            lastPoint.y = this.mpoints[(count - 1)].y;
        }
        return lastPoint;
    }
    /**
     * Gets the bezier points for arc constructing.
     * @public
     */
    public getBezierArcPoints(x1: number, y1: number, x2: number, y2: number, s1: number, e1: number): number[] {
        if ((x1 > x2)) {
            let tmp: number;
            tmp = x1;
            x1 = x2;
            x2 = tmp;
        }
        if ((y2 > y1)) {
            let tmp: number;
            tmp = y1;
            y1 = y2;
            y2 = tmp;
        }
        let fragAngle: number;
        let numFragments: number;
        if ((Math.abs(e1) <= 90)) {
            fragAngle = e1;
            numFragments = 1;
        } else {
            numFragments = (<number>(Math.ceil((Math.abs(e1) / 90))));
            fragAngle = (e1 / numFragments);
        }
        let xcen: number = ((x1 + x2) / 2);
        let ycen: number = ((y1 + y2) / 2);
        let rx: number = ((x2 - x1) / 2);
        let ry: number = ((y2 - y1) / 2);
        let halfAng: number = (<number>((fragAngle * (Math.PI / 360))));
        let kappa: number = (<number>(Math.abs(4.0 / 3.0 * (1.0 - Math.cos(halfAng)) / Math.sin(halfAng))));
        let pointList: number[] = [];
        for (let i: number = 0; (i < numFragments); i++) {
            let theta0: number = (<number>(((s1 + (i * fragAngle)) * (Math.PI / 180))));
            let theta1: number = (<number>(((s1 + ((i + 1) * fragAngle)) * (Math.PI / 180))));
            let cos0: number = (<number>(Math.cos(theta0)));
            let cos1: number = (<number>(Math.cos(theta1)));
            let sin0: number = (<number>(Math.sin(theta0)));
            let sin1: number = (<number>(Math.sin(theta1)));
            if ((fragAngle > 0)) {
                /* tslint:disable-next-line:max-line-length */
                pointList.push((xcen  + (rx * cos0)), (ycen - (ry * sin0)), (xcen + (rx * (cos0 - (kappa * sin0)))), (ycen - (ry * (sin0 + (kappa * cos0)))), (xcen + (rx * (cos1 + (kappa * sin1)))), (ycen - (ry * (sin1 - (kappa * cos1)))), (xcen + (rx * cos1)), (ycen - (ry * sin1)));
            } else {
                /* tslint:disable-next-line:max-line-length */
                pointList.push((xcen + (rx * cos0)), (ycen - (ry * sin0)), (xcen + (rx * (cos0 + (kappa * sin0)))), (ycen - (ry * (sin0 - (kappa * cos0)))), (xcen + (rx * (cos1 - (kappa * sin1)))), (ycen - (ry * (sin1 + (kappa * cos1)))), (xcen + (rx * cos1)), (ycen - (ry * sin1)));
            }
        }
        return pointList;
    }
    /**
     * `getBoundsInternal` Returns a rectangle that bounds this element.
     * @public
     */
    public getBoundsInternal(): RectangleF {
        let points: PointF[] = this.pathPoints;
        let bounds: RectangleF = new RectangleF(0, 0, 0, 0);
        if ((points.length > 0)) {
            let xmin: number = points[0].x;
            let xmax: number = points[0].x;
            let ymin: number = points[0].y;
            let ymax: number = points[0].y;
            for (let i: number = 1; i < points.length; i++) {
                let point: PointF = points[i];
                xmin = Math.min(point.x, xmin);
                xmax = Math.max(point.x, xmax);
                ymin = Math.min(point.y, ymin);
                ymax = Math.max(point.y, ymax);
            }
            bounds = new RectangleF(xmin, ymin, (xmax - xmin), (ymax - ymin));
        }
        return bounds;
    }
    /**
     * `drawInternal` Draws an element on the Graphics.
     * @param graphics Graphics context where the element should be printed.
     * @public
     */
    public drawInternal(graphics: PdfGraphics) : void {
        if ((graphics == null)) {
            throw new Error('ArgumentNullException :graphics');
        }
        graphics.drawPath(this.obtainPen(), this.brush, this);
    }
    /**
     * `add a points` Adds the points along with their type to the path.
     * @param points The points.
     * @param pointType Type of the points.
     * @private
     */
    private addPoints(points: number[], pointType: PathPointType) : void
    /**
     * `add a points` Adds the points along with their type to the path.
     * @param points The points.
     * @param pointType Type of the points.
     * @param startIndex The start index.
     * @param endIndex The end index.
     * @private
     */
    private addPoints(points: number[], pointType: PathPointType, startIndex: number, endIndex: number) : void
    private addPoints(points: number[], pointType: PathPointType, startIndex?: number, endIndex?: number) : void {
        if (typeof startIndex === 'undefined' && typeof endIndex === 'undefined') {
            this.addPoints(points, pointType, 0, points.length);
        } else {
            for (let i: number = startIndex; i < endIndex; i++) {
                let point: PointF = new PointF(points[i], points[(i + 1)]);
                if ((i === startIndex)) {
                    if (((this.pointCount <= 0) || this.mStartFigure)) {
                        this.addPoint(point, PathPointType.Start);
                        this.mStartFigure = false;
                    } else if (((point.x !== this.lastPoint.x) && (point.y !== this.lastPoint.y) && !this.isBeziers3)) {
                        this.addPoint(point, PathPointType.Line);
                    } else if ((point.x !== this.lastPoint.x) && (point.y !== this.lastPoint.y)) {
                        this.addPoint(point, PathPointType.Bezier3);
                    }
                } else {
                    this.addPoint(point, pointType);
                }
                i++;
            }
        }
    }
    /**
     * `add a point` Adds the point and its type
     * @param points The points.
     * @param pointType Type of the points.
     * @private
     */
    private addPoint(point: PointF, pointType: PathPointType) : void {
        this.points.push(point);
        this.types.push((<number>(pointType)));
    }
    /**
     * Closes the figure.
     * @public
     */
    public closeFigure() : void
    /**
     * Closes the figure.
     * @param index The index of the last figure point.
     * @public
     */
    public closeFigure(index: number) : void
    public closeFigure(index?: number) : void {
        if (typeof index === 'undefined') {
            if ((this.pointCount > 0)) {
                this.closeFigure(this.pointCount - 1);
            }
            this.startFigure();
        } else {
            if ((index < 0)) {
                throw new Error('IndexOutOfRangeException()');
            }
            let pt: PathPointType = (<PathPointType>((<number>(this.types[index]))));
            pt = (pt | PathPointType.CloseSubpath);
            this.types[index] = (<number>(pt));
        }
    }
}