/**
 * Explores the types of nodes
 */

import {
    Diagram, UndoRedo, NodeModel, Annotation, TextElement, ConnectorModel, PortConstraints, PortVisibility, PointModel, Rect, ShapeAnnotation, ShapeAnnotationModel, PointPortModel, DistributeOptions, NodeConstraints, ShadowModel, GradientType, GradientModel, LinearGradientModel, RadialGradientModel, Point
} from '../../src/diagram/index';

import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../src/diagram/primitives/matrix';
import { Group } from '@syncfusion/ej2-data';
import { Uploader } from '@syncfusion/ej2-inputs';
Diagram.Inject(UndoRedo);
let node: NodeModel = {};
var pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
var darkColor = '#C7D4DF';
var lightColor = '#f5f5f5';
let nodes: NodeModel[] = [
    {
        id: "Businessworkflow", offsetX: 300, offsetY: 200, height: 120, width: 280,
        shape: {
            type: "SwimLane", orientation: "Vertical",
            header: {
                id: "swimHeader",
                annotation: { id: "headerAnnotation", content: "Process" } as Annotation
            },
            lanes: [
                {
                    id: "lane1", width: 140,
                    header: { annotation: { content: "Customer" } as Annotation }                                    
                },
                {
                    id: "lane2",
                    width: 140,
                    header: {
                        annotation: { id: "annotation2", content: "Business" } as Annotation
                    }
                }
            ],                            
        }
    }
];

let diagram: Diagram = new Diagram({
    width: '100%', height: 900, nodes: nodes
});
diagram.appendTo('#diagram');


