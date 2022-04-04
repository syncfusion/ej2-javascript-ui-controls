import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { GridlinesModel } from './grid-lines-model';
import { SnapConstraints, GridType } from '../enum/enum';


/**
 * Provides a visual guidance while dragging or arranging the objects on the Diagram surface
 */
export class Gridlines extends ChildProperty<Gridlines> {
    /**
     * Sets the line color of gridlines
     *
     * @default ''
     */
    @Property('lightgray')
    public lineColor: string;
    /**
     * Defines the pattern of dashes and gaps used to stroke horizontal grid lines
     *
     * @default ''
     */
    @Property('')
    public lineDashArray: string;
    /**
     * A pattern of lines and gaps that defines a set of horizontal/vertical gridlines
     *
     * @default [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75]
     */
    @Property([1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75])
    public lineIntervals: number[];
    /**
     * A pattern of gaps that defines a set of horizontal/vertical grid dots
     *
     * @default [1, 19, 0.5, 19.5, 0.5, 19.5, 0.5, 19.5, 0.5, 19.5]
     */
    @Property([1, 19, 0.5, 19.5, 0.5, 19.5, 0.5, 19.5, 0.5, 19.5])
    public dotIntervals: number[];
    /**
     * Specifies a set of intervals to snap the objects
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * snapSettings: {
     * horizontalGridlines: { lineIntervals: [0.95, 9.05, 0.2, 9.75], snapIntervals: [10] },
     * verticalGridlines: { lineIntervals: [0.95, 9.05, 0.2, 9.75], snapIntervals: [10] }
     * },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default [20]
     */
    @Property([20])
    public snapIntervals: number[];

    /** @private */
    public scaledIntervals: number[];
}

/**
 * Defines the gridlines and defines how and when the objects have to be snapped
 *
 * @default {}
 */
export class SnapSettings extends ChildProperty<SnapSettings> {
    /**
     * Defines the horizontal gridlines
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let horizontalGridlines: GridlinesModel = {lineColor: 'black', lineDashArray: '1,1' };
     * let verticalGridlines: GridlinesModel = {lineColor: 'black', lineDashArray: '1,1'};
     * let diagram: Diagram = new Diagram({
     * ...
     * snapSettings: { horizontalGridlines, verticalGridlines, constraints: SnapConstraints.ShowLines,
     * snapObjectDistance: 5, snapAngle: 5 },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default {}
     */
    @Complex<GridlinesModel>({}, Gridlines)
    public horizontalGridlines: GridlinesModel;
    /**
     * Defines the vertical gridlines
     *
     * @default {}
     */
    @Complex<GridlinesModel>({}, Gridlines)
    public verticalGridlines: GridlinesModel;
    /**
     * Constraints for gridlines and snapping
     * * None - Snapping does not happen
     * * ShowHorizontalLines - Displays only the horizontal gridlines in diagram.
     * * ShowVerticalLines - Displays only the Vertical gridlines in diagram.
     * * ShowLines - Display both Horizontal and Vertical gridlines.
     * * SnapToHorizontalLines - Enables the object to snap only with horizontal gridlines.
     * * SnapToVerticalLines - Enables the object to snap only with horizontal gridlines.
     * * SnapToLines - Enables the object to snap with both horizontal and Vertical gridlines.
     * * snapToObject - Enables the object to snap with the other objects in the diagram.
     *
     * @default 'All'
     * @aspNumberEnum
     */
    @Property(SnapConstraints.All)
    public constraints: SnapConstraints;
    /**
     * Defines the angle by which the object needs to be snapped
     *
     * @default 5
     */
    @Property(5)
    public snapAngle: number;

    /**
     * Defines the diagram Grid pattern.
     * * Lines - Render the line for the grid
     * * Dots - Render the dot for the grid
     *
     * @default 'Lines'
     */
    @Property('Lines')
    public gridType: GridType;

    /**
     * Sets the minimum distance between the selected object and the nearest object
     *
     * @default 5
     */
    @Property(5)
    public snapObjectDistance: number;

    /**
     * Defines the color of snapping lines
     * 
     * @default '#07EDE1'
     */
     @Property('#07EDE1')
     public snapLineColor : string;
}






