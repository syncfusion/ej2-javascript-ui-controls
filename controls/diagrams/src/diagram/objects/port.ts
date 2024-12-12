/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { ShapeStyle, Margin } from '../core/appearance';
import { ShapeStyleModel, MarginModel } from '../core/appearance-model';
import { Point } from '../primitives/point';
import { PointModel } from '../primitives/point-model';
import { HorizontalAlignment, VerticalAlignment, PortShapes, PortConstraints, PortVisibility, PortAlignment, PortConnectionDirection } from '../enum/enum';
import { DiagramTooltip } from './tooltip';
import { DiagramTooltipModel } from './tooltip-model';


/**
 * Defines the behavior of connection ports
 */
export abstract class Port extends ChildProperty<Port> {

    /**
     * Defines the unique id of the port
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Sets the horizontal alignment of the port with respect to its immediate parent(node/connector)
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     *
     * @default 'Center'
     */
    @Property('Center')
    public horizontalAlignment: HorizontalAlignment;

    /**
     * Sets the vertical alignment of the port with respect to its immediate parent(node/connector)
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     *
     * @default 'Center'
     */
    @Property('Center')
    public verticalAlignment: VerticalAlignment;

    /**
     * Defines the space that the port has to be moved from its actual position
     *
     * @default new Margin(0,0,0,0)
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Sets the width of the port
     *
     * @default 12
     */
    @Property(12)
    public width: number;

    /**
     * Sets the height of the port
     *
     * @default 12
     */
    @Property(12)
    public height: number;
    /**
     * Defines the appearance of the port
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     *   let port: PointPortModel[] =
     * [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0 } },];
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     * }];
     * nodes.ports = port;
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default {}
     */
    @Complex<ShapeStyleModel>({}, ShapeStyle)
    public style: ShapeStyleModel;

    /**
     * Defines the type of the port shape
     * * X - Sets the decorator shape as X
     * * Circle - Sets the decorator shape as Circle
     * * Square - Sets the decorator shape as Square
     * * Custom - Sets the decorator shape as Custom
     *
     * @default 'Square'
     */
    @Property('Square')
    public shape: PortShapes;

    /**
     * Defines the allowed direction for connections to the port
     * * Auto - Maintains the default behavior of automatic direction calculation.
     * * Left - Restricts connections to only connect to the left side of the port.
     * * Top - Restricts connections to only connect to the top side of the port.
     * * Right - Restricts connections to only connect to the right side of the port.
     * * Bottom - Restricts connections to only connect to the bottom side of the port.
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public connectionDirection: PortConnectionDirection;

    /**
     * Defines the type of the port visibility
     * * Visible - Always shows the port
     * * Hidden - Always hides the port
     * * Hover - Shows the port when the mouse hovers over a node
     * * Connect - Shows the port when a connection end point is dragged over a node
     *
     * @default 'Connect'
     * @aspNumberEnum
     */
    @Property(PortVisibility.Connect)
    public visibility: PortVisibility;

    /**
     * Defines the geometry of the port
     *
     * @default ''
     */
    @Property('')
    public pathData: string;

    /**
     * Defines the constraints of port
     *
     * @default 'Default'
     * @aspNumberEnum
     */
    @Property(PortConstraints.Default)
    public constraints: PortConstraints;

    /**
     * Allows the user to save custom information/data about a port
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public addInfo: Object;

    /**
     * Defines the collection of the objects that are connected to a particular port
     *
     * @default undefined
     * @blazorDefaultValue new string[] { }
     */
    @Property()
    public outEdges: string[];

    /**
     * Defines the collection of the objects that are connected to a particular port
     *
     * @default undefined
     * @blazorDefaultValue new string[] { }
     */
    @Property()
    public inEdges: string[];
    // tslint:disable-next-line:no-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
        this.inEdges = [];
        this.outEdges = [];
    }

    /**
     * defines the tooltip for the Ports
     *
     * @default new DiagramToolTip();
     */
    @Complex<DiagramTooltipModel>({}, DiagramTooltip)
    public tooltip: DiagramTooltipModel;
}

/**
 * Defines the behavior of a port, that sticks to a point
 */
export class PointPort extends Port {
    /**
     * Defines the position of the port with respect to the boundaries of nodes/connector
     *
     * @default new Point(0.5,0.5)
     * @blazorType NodePortOffset
     */
    @Complex<PointModel>({ x: 0.5, y: 0.5 }, Point)
    public offset: PointModel;

    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }

    /**
     * getClassName method \
     *
     * @returns { string } toBounds method .\
     *
     * @private
     */
    public getClassName(): string {
        return 'PointPort';
    }
}

/**
 * Defines the behavior of a port, that sticks to a point
 */
export class PathPort extends Port {

    /**
     * Sets the segment offset of port
     *
     * @default 0.5
     */
    @Property(0.5)
    public offset: number;

    /**
     * Sets the displacement of an ports from its actual position
     *
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    @Complex<PointModel>({ x: 0, y: 0 }, Point)
    public displacement: PointModel;

    /**
     * Sets the segment alignment of ports
     *  * Center - Aligns the ports at the center of a connector segment
     *  * Before - Aligns the ports before a connector segment
     *  * After - Aligns the ports after a connector segment
     *
     * @default Center
     */
    @Property('Center')
    public alignment: PortAlignment;

    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }

    /**
     * getClassName method \
     *
     * @returns { string } toBounds method .\
     *
     * @private
     */
    public getClassName(): string {
        return 'PathPort';
    }
}
