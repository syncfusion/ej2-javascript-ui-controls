import { Property, ChildProperty } from '@syncfusion/ej2-base';


/**
 * A collection of JSON objects where each object represents a layer.
 * Layer is a named category of diagram shapes.
 */
export class Layer extends ChildProperty<Layer> {
    /**
     * Defines the id of a diagram layer
     *
     * @default ''
     */
    @Property('')
    public id: string;
    /**
     * Enables or disables the visibility of objects in a particular layer
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;
    /**
     * Enables or disables editing objects in a particular layer
     *
     * @default false
     */
    @Property(false)
    public lock: boolean;

    /**
     * Defines the collection of the objects that are added to a particular layer
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public objects: string[];

    /**
     * Defines the description of the layer
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
     * let diagram: Diagram = new Diagram({
     * ...
     *       connectors: connectors, nodes: nodes,
     *       layers: [{ id: 'layer1', visible: true, objects: ['node1', 'node2', 'connector1'] }],
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public addInfo: Object;
    /**
     * Defines the zOrder of the layer
     *
     * @default -1
     */
    @Property(-1)
    public zIndex: number;
    /**  @private   */
    public objectZIndex: number = -1;
    /**   @private  */
    public zIndexTable: {} = {};

    // tslint:disable-next-line:no-any
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
        this.objects = [];
    }
}









