import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { Side } from '../enum/enum';
import { HorizontalAlignment, VerticalAlignment } from '../enum/enum';
import { MarginModel } from '../core/appearance-model';
import { Margin } from '../core/appearance';


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
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Defines the path data of user Handle
     *
     * @default ''
     */
    @Property('')
    public pathData: string;

    /**
     * Defines the custom content of the user handle
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Defines the image source of the user handle
     *
     * @default ''
     */
    @Property('')
    public source: string;

    /**
     * Defines the background color of user Handle
     *
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
     *
     * @default 'Top'
     */
    @Property('Top')
    public side: Side;

    /**
     * Defines the borderColor of user Handle
     *
     * @default ''
     */
    @Property('')
    public borderColor: string;

    /**
     * Defines the borderWidth of user Handle
     *
     * @default 0.5
     */
    @Property(0.5)
    public borderWidth: number;

    /**
     * Defines the size of user Handle
     *
     * @default 25
     */
    @Property(25)
    public size: number;

    /**
     * Defines the path color of user Handle
     *
     * @default 'white'
     */
    @Property('white')
    public pathColor: string;

    /**
     * Defines the displacement of user Handle
     *
     * @default 10
     */
    @Property(10)
    public displacement: number;

    /**
     * Defines the visible of user Handle
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Defines the offset of user Handle
     *
     * @default 0
     */
    @Property(0)
    public offset: number;

    /**
     * Defines the margin of the user handle
     *
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
     *
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
     *
     * @default 'Center'
     */
    @Property('Center')
    public verticalAlignment: VerticalAlignment;

    /**
     * Defines the visible of user Handle
     *
     * @default false
     */
    @Property(false)
    public disableNodes: boolean;

    /**
     * Defines the visible of user Handle
     *
     * @default false
     */
    @Property(false)
    public disableConnectors: boolean;


    /**
     *
     * Returns the name of class UserHandle
     *
     * @returns {string}  Returns the name of class UserHandle
     * @private
     */
    public getClassName(): string {
        return 'UserHandle';
    }

    /**
     * defines geometry of the html element
     *
     * @private
     * @default ''
     */
    @Property('')
    public template: HTMLElement;
}

