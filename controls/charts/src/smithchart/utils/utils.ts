import { Property, ChildProperty} from '@syncfusion/ej2-base';
import { SmithchartFontModel} from './utils-model';

export class SmithchartFont extends ChildProperty<SmithchartFont> {

/**
 * font family for text.
 */
@Property('Segoe UI')
    public fontFamily: string;
/**
 * font style for text.
 * @default Normal
 */
@Property('Normal')
    public fontStyle: string;

    /**
     * font weight for text.
     * @default Regular
     */
@Property('Regular')
    public fontWeight: string;

   /**
    * Color for the text.
    * @default ''
    */
@Property('')
public color: string;

/**
 * font size for text.
 * @default 12px
 */
    @Property('12px')
    public size: string;

/**
 * font opacity for text.
 * @default 1
 */
@Property(1)
    public opacity: number;

}
export class SmithchartMargin extends ChildProperty<SmithchartMargin> {
/**
 * top margin of chartArea.
 * @default 10
 */
 @Property(10)
    public top: number;

/**
 * bottom margin of chartArea.
 * @default 10
 */
 @Property(10)
public bottom: number;

 /**
  * right margin of chartArea.
  * @default 10
  */

    @Property(10)
    public right: number;

    /**
     * left margin of chartArea.
     * @default 10
     */

    @Property(10)
    public left: number;

}

export class SmithchartBorder extends ChildProperty<SmithchartBorder> {

/**
 * width for smithchart border.
 * @default 0
 */

    @Property(0)
public width: number;

/**
 * opacity for smithchart border.
 * @default 1
 */
 @Property(1)
public opacity: number;

/**
 * color for smithchart border .
 * @default transparent
 */

@Property('transparent')
public color: string;
}

/**
 * Internal use of type rect
 */
export class SmithchartRect {
    /** x value for rect */
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
export class LabelCollection {

    public centerX: number;
    public centerY: number;
    public radius: number;
    public value: number;
}

export class LegendSeries {
    public text: string;
    public seriesIndex: number;
    public shape: string;
    public fill: string;
    public bounds: SmithchartSize;
}

export class LabelRegion {
    public bounds: SmithchartRect;
    public labelText: string;
}

export class HorizontalLabelCollection extends LabelCollection {
    public region: LabelRegion;
}

export class RadialLabelCollections extends HorizontalLabelCollection {
    public angle: number;
}

export class LineSegment {
    public x1: number;
    public x2: number;
    public y1: number;
    public y2: number;
}

export class PointRegion {
    public point: Point;
    public x: number;
    public y: number;
}

/**
 * Smithchart internal class for point
 */

export class Point {
    public x: number;
    public y: number;
}

export class ClosestPoint {
    public location: Point;
    public index: number;
}
export class MarkerOptions {
    public id: string;
    public fill: string;
    public opacity: number;
    public borderColor: string;
    public borderWidth: number;
    constructor(id?: string, fill?: string, borderColor?: string, borderWidth?: number, opacity?: number) {
        this.id = id;
        this.fill = fill;
        this.borderColor = borderColor;
        this.borderWidth = borderWidth;
        this.opacity = opacity;
    }
}
export class SmithchartLabelPosition {
    public textX: number;
    public textY: number;
    public x: number;
    public y: number;
}

export class Direction {
    public counterclockwise: number = 0;
    public clockwise: number = 1;
}

export class DataLabelTextOptions {
    public id: string;
    public x: number;
    public y: number;
    public text: string;
    public fill: string;
    public font: SmithchartFontModel;
    public xPosition: number;
    public yPosition: number;
    public width: number;
    public height: number;
    public location: Point;
    public labelOptions: SmithchartLabelPosition;
    public visible: boolean;
    public connectorFlag: boolean;

}

export class LabelOption {
    public textOptions: DataLabelTextOptions[];
}

/** @private */
export class SmithchartSize {

    public height: number;
    public width: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}
export class GridArcPoints {
    public startPoint: Point;
    public endPoint: Point;
    public rotationAngle: number;
    public sweepDirection: number;
    public isLargeArc: boolean;
    public size: SmithchartSize;
}