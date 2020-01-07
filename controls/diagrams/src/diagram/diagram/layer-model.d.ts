import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class Layer
 */
export interface LayerModel {

    /**
     * Defines the id of a diagram layer 
     * @default ''
     */
    id?: string;

    /**
     * Enables or disables the visibility of objects in a particular layer
     * @default true
     */
    visible?: boolean;

    /**
     * Enables or disables editing objects in a particular layer
     * @default false
     */
    lock?: boolean;

    /**
     * Defines the collection of the objects that are added to a particular layer
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @isBlazorNullableType true
     */
    objects?: string[];

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
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    addInfo?: Object;

    /**
     * Defines the zOrder of the layer
     * @default -1
     */
    zIndex?: number;

}