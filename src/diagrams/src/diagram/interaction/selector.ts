import { Property, ChildProperty, Collection, Complex } from '@syncfusion/ej2-base';
import { IElement } from '../objects/interface/IElement';
import { Container } from '../core/containers/container';
import { Node } from '../objects/node';
import { Connector } from '../objects/connector';
import { PointModel } from '../primitives/point-model';
import { Point } from '../primitives/point';
import { Size } from '../primitives/size';
import { RubberBandSelectionMode, Side, ThumbsConstraints } from '../enum/enum';
import { SelectorConstraints, HorizontalAlignment, VerticalAlignment } from '../enum/enum';
import { NodeModel } from '../objects/node-model';
import { ConnectorModel } from '../objects/connector-model';
import { UserHandleModel } from '../interaction/selector-model';
import { Diagram } from '../../diagram/diagram';
import { MarginModel } from '../core/appearance-model';
import { Margin } from '../core/appearance';
import { ShapeAnnotationModel, PathAnnotationModel } from '../objects/annotation-model';
import { DiagramElement } from '..';

/** 
 * A collection of frequently used commands that will be added around the selector
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let nodes: NodeModel[] = [{
 *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
 *           annotations: [{ content: 'Default Shape' }]
 *       },
 *       {
 *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
 *           shape: {
 *               type: 'Basic', shape: 'Ellipse'
 *           },
 *           annotations: [{ content: 'Path Element' }]
 *       }
 *       ];
 *       let connectors: ConnectorModel[] = [{
 *           id: 'connector1',
 *           type: 'Straight',
 *           sourcePoint: { x: 100, y: 300 },
 *           targetPoint: { x: 200, y: 400 },
 *       }];
 * let handle: UserHandleModel[] = [
 * { name: 'handle', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0,
 * pathData: 'M 376.892,225.284L 371.279,211.95L 376.892,198.617L 350.225,211.95L 376.892,225.284 Z',
 * side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center', 
 * pathColor: 'yellow' }];
 * let diagram: Diagram = new Diagram({
 * ...
 *     connectors: connectors, nodes: nodes,
 *     selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 * @default {}
 */
export class UserHandle extends ChildProperty<UserHandle> {
    /**
     * Defines the name of user Handle
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Defines the path data of user Handle 
     * @default ''
     */
    @Property('')
    public pathData: string;

    /**
     * Defines the background color of user Handle 
     * @default 'black'
     */
    @Property('#000000')
    public backgroundColor: string;

    /**
     * Defines the position of user Handle
     *  * Top - Aligns the user handles at the top of an object
     *  * Bottom - Aligns the user handles at the bottom of an object
     *  * Left - Aligns the user handles at the left of an object
     *  * Right - Aligns the user handles at the right of an object
     * @default 'top'
     */
    @Property('top')
    public side: Side;

    /**
     * Defines the borderColor of user Handle 
     * @default ''
     */
    @Property('')
    public borderColor: string;

    /**
     * Defines the borderWidth of user Handle 
     * @default 0.5
     */
    @Property(0.5)
    public borderWidth: number;

    /**
     * Defines the size of user Handle 
     * @default 25
     */
    @Property(25)
    public size: number;

    /**
     * Defines the path color of user Handle 
     * @default 'white'
     */
    @Property('white')
    public pathColor: string;

    /**
     * Defines the displacement of user Handle 
     * @default 10
     */
    @Property(10)
    public displacement: number;

    /**
     * Defines the visible of user Handle 
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Defines the offset of user Handle 
     * @default 0
     */
    @Property(0)
    public offset: number;

    /**
     * Defines the margin of the user handle
     * @default new Margin(0,0,0,0)
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Defines the horizontal alignment of the user handle
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    @Property('Center')
    public horizontalAlignment: HorizontalAlignment;

    /**
     * Defines the vertical alignment of the user handle
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    @Property('Center')
    public verticalAlignment: VerticalAlignment;
}

/**
 * Defines the size and position of selected items and defines the appearance of selector
 */
export class Selector extends ChildProperty<Selector> implements IElement {
    /**
     * Defines the size and position of the container
     * @default null
     */
    @Property(null)
    public wrapper: Container;

    /**
     * Defines the collection of selected nodes
     */
    @Collection<NodeModel>([], Node)
    public nodes: NodeModel[];

    /**
     * Defines the collection of selected connectors
     */
    @Collection<ConnectorModel>([], Connector)
    public connectors: ConnectorModel[];

    /**
     * @private
     */
    public annotation: ShapeAnnotationModel | PathAnnotationModel;
    /**
     * Sets/Gets the width of the container
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets/Gets the height of the container
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Sets the rotate angle of the container
     * @default 0
     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Sets the positionX of the container
     * @default 0
     */
    @Property(0)
    public offsetX: number;

    /**
     * Sets the positionY of the container
     * @default 0
     */
    @Property(0)
    public offsetY: number;

    /**
     * Sets the pivot of the selector
     * @default { x: 0.5, y: 0.5 }
     */
    @Complex<PointModel>({ x: 0.5, y: 0.5 }, Point)
    public pivot: PointModel;

    /**
     * Defines how to pick the objects to be selected using rubber band selection
     * * CompleteIntersect - Selects the objects that are contained within the selected region
     * * PartialIntersect - Selects the objects that are partially intersected with the selected region
     * @default 'CompleteIntersect'
     */
    @Property('CompleteIntersect')
    public rubberBandSelectionMode: RubberBandSelectionMode;

    /**
     * Defines the collection of user handle
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *           annotations: [{ content: 'Default Shape' }]
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: {
     *               type: 'Basic', shape: 'Ellipse'
     *           },
     *           annotations: [{ content: 'Path Element' }]
     *       }
     *       ];
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1',
     *           type: 'Straight',
     *           sourcePoint: { x: 100, y: 300 },
     *           targetPoint: { x: 200, y: 400 },
     *       }];
     * let handle: UserHandleModel[] = [
     * { name: 'handle', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0,
     * pathData: 'M 376.892,225.284L 371.279,211.95L 376.892,198.617L 350.225,211.95L 376.892,225.284 Z',
     * side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center', 
     * pathColor: 'yellow' }];
     * let diagram: Diagram = new Diagram({
     * ...
     *     connectors: connectors, nodes: nodes,
     *     selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default []
     */
    @Collection<UserHandleModel>([], UserHandle)
    public userHandles: UserHandleModel[];

    /**
     * Controls the visibility of selector.
     * * None - Hides all the selector elements
     * * ConnectorSourceThumb - Shows/hides the source thumb of the connector
     * * ConnectorTargetThumb - Shows/hides the target thumb of the connector
     * * ResizeSouthEast - Shows/hides the bottom right resize handle of the selector
     * * ResizeSouthWest - Shows/hides the bottom left resize handle of the selector
     * * ResizeNorthEast - Shows/hides the top right resize handle of the selector
     * * ResizeNorthWest - Shows/hides the top left resize handle of the selector
     * * ResizeEast - Shows/hides the middle right resize handle of the selector
     * * ResizeWest - Shows/hides the middle left resize handle of the selector
     * * ResizeSouth - Shows/hides the bottom center resize handle of the selector
     * * ResizeNorth - Shows/hides the top center resize handle of the selector
     * * Rotate - Shows/hides the rotate handle of the selector
     * * UserHandles - Shows/hides the user handles of the selector
     * * Resize - Shows/hides all resize handles of the selector
     * @default 'All'
     * @aspNumberEnum 
     */
    @Property(SelectorConstraints.All)
    public constraints: SelectorConstraints;


    /**
     * set the constraint of the container
     * * Rotate - Enable Rotate Thumb
     * * ConnectorSource - Enable Connector source point
     * * ConnectorTarget - Enable Connector target point
     * * ResizeNorthEast - Enable ResizeNorthEast Resize
     * * ResizeEast - Enable ResizeEast Resize
     * * ResizeSouthEast - Enable ResizeSouthEast Resize
     * * ResizeSouth - Enable ResizeSouth Resize
     * * ResizeSouthWest - Enable ResizeSouthWest Resize
     * * ResizeWest - Enable ResizeWest Resize
     * * ResizeNorthWest - Enable ResizeNorthWest Resize
     * * ResizeNorth - Enable ResizeNorth Resize
     * @private
     * @aspNumberEnum
     */
    public thumbsConstraints: ThumbsConstraints;

    /**
     * Initializes the UI of the container
     */
    public init(diagram: Diagram): Container {
        let container: Container = new Container();
        container.measureChildren = false;
        let consize: Size = new Size();
        container.children = [];
        if (this.annotation) {
            let object: Container = (this.nodes.length > 0) ? diagram.nameTable[this.nodes[0].id].wrapper :
                diagram.nameTable[this.connectors[0].id].wrapper;
            let wrapper: DiagramElement = diagram.getWrapper(object, this.annotation.id);
            container.children.push(wrapper);
        } else {
            if (this.nodes || this.connectors) {
                for (let i: number = 0; i < this.nodes.length; i++) {
                    let node: NodeModel = diagram.nameTable[this.nodes[i].id];
                    let wrapper: Container = node.wrapper;
                    // this.width = wrapper.actualSize.width; 
                    // this.height = wrapper.actualSize.height;
                    // this.rotateAngle = wrapper.rotateAngle;
                    // this.offsetX = wrapper.offsetX;
                    // this.offsetY = wrapper.offsetY;
                    container.children.push(wrapper);
                }
                for (let j: number = 0; j < this.connectors.length; j++) {
                    let connector: ConnectorModel = diagram.nameTable[this.connectors[j].id];
                    let wrapper: Container = connector.wrapper;
                    // this.width = wrapper.actualSize.width; this.height = wrapper.actualSize.height;
                    // this.rotateAngle = wrapper.rotateAngle; this.offsetX = wrapper.offsetX;
                    // this.offsetY = wrapper.offsetY;
                    container.children.push(wrapper);
                }
            }
        }
        this.wrapper = container;
        return container;
    }
}