/**
 * Explores the types of nodes
 */

import {
    Diagram, UndoRedo, NodeModel, StackPanel, TextElement, ConnectorModel, PortConstraints, PortVisibility, PointModel, Rect, ShapeAnnotation, ShapeAnnotationModel, PointPortModel, DistributeOptions, NodeConstraints, ShadowModel, GradientType, GradientModel, LinearGradientModel, RadialGradientModel, Point
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
        id: 'swimlane',
        shape: {
            orientation: 'Vertical',
            type: 'SwimLane',
            header: {
                annotation: { content: 'ONLI' },
                height: 50, style: { fill: darkColor, fontSize: 11 },
            },
            lanes: [
                {
                    id: 'stackCanvas1',
                    header: {
                        annotation: { content: 'CUSTOMER' }, height: 50,
                        style: { fill: darkColor, fontSize: 11 }
                    },
                    style: { fill: lightColor },
                    width: 140,
                    children: [
                        {
                            id: 'Order',
                            shape: { type: 'Path', data: pathData },
                            annotations: [
                                {
                                    content: 'ORDER',
                                    style: { fontSize: 11 }
                                }
                            ],
                            margin: { left: 60, top: 60 },
                            height: 40, width: 100
                        }
                    ],
                },
                {
                    id: 'stackCanvas2',
                    header: {
                        annotation: { content: 'ONLINE' }, height: 50,
                        style: { fill: darkColor, fontSize: 11 }
                    },
                    style: { fill: lightColor }, width: 120,
                    children: [
                        {
                            id: 'selectItemaddcart',
                            annotations: [{ content: 'Select item\nAdd cart' }],
                            margin: { left: 210, top: 60 },
                            height: 40, width: 100
                        },
                        {
                            id: 'paymentondebitcreditcard',
                            annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                            margin: { left: 350, top: 250 },
                            height: 40, width: 100
                        }
                    ],
                },
            ],
            phases: [
                {
                    id: 'phase1', offset: 200,
                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                    header: { content: { content: 'Phase' } }
                },
                {
                    id: 'phase2', offset: 400,
                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                    header: { content: { content: 'Phase' } }
                },
            ],
            phaseSize: 20,
        },
        offsetX: 350, offsetY: 290,
        height: 360, width: 650
    },
];

let diagram: Diagram = new Diagram({
    width: '100%', height: 900, nodes: nodes
});
diagram.appendTo('#diagram');


