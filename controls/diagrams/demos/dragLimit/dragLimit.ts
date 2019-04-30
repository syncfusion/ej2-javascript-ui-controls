/**
 * Team Organizational Chart
 */

import {
    Diagram, ConnectorModel, Node, Animation,
    Container, TextElement, StackPanel, SelectorConstraints, ImageElement, DataBinding, HierarchicalTree, LayoutAnimation
} from '../../src/diagram/index';

Diagram.Inject(DataBinding, HierarchicalTree);

import { DataManager, Query } from '@syncfusion/ej2-data';
import {
    NodeModel, Orientation, VerticalAlignment, PathElement, HorizontalAlignment, AnnotationConstraints
} from '../../src/diagram/index';


let connectors: ConnectorModel[] = [
    {
        id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 100 },
        annotations: [{ content: 'Path Annotation', constraints: AnnotationConstraints.Interaction,
        dragLimit: { top: 20, bottom: 20, left: 20, right: 20 }}]
    }, {
        id: 'connector2',
        type: 'Orthogonal',
        sourcePoint: { x: 300, y: 300 },
        targetPoint: { x: 400, y: 400 },
        sourceDecorator: {
            style: { fill: 'black' },
            shape: 'Diamond',
            pivot: { x: 0, y: 0.5 }
        },
        targetDecorator: {
            shape: 'None',
            style: { fill: 'blue' },
            pivot: { x: 0, y: 0.5 }
        },
        segments: [{ length: 50, direction: "Bottom" }],
        annotations: [{ content: 'Path Annotation', constraints: AnnotationConstraints.Interaction,
        dragLimit: { top: 20, bottom: 20, left: 20, right: 20 } }]
    }
];
let diagram: Diagram = new Diagram({
    width: '1250px', height: '590px', connectors: connectors
});

diagram.appendTo('#diagram');