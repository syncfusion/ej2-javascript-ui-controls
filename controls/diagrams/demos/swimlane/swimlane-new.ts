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
            type: 'SwimLane',
            orientation: 'Horizontal',
            header: {
                annotation: { content: 'ONLINE PURCHASE STATUS' },
                height: 50, style: { fill: darkColor, fontSize: 11 },
            },
            lanes: [
                {
                    id: 'stackCanvas1',
                    header: {
                        annotation: { content: 'CUSTOMER' }, width: 50,
                        style: { fill: darkColor, fontSize: 11 }
                    },
                    style: { fill: lightColor },
                    height: 100,
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
                            margin: { left: 60, top: 20 },
                            height: 40, width: 100,
                            constraints: NodeConstraints.Default | NodeConstraints.AllowMovingOutsideLane
                        }
                    ],
                },
                {
                    id: 'stackCanvas2', canMove: false,
                    header: {
                        annotation: { content: 'ONLINE' }, width: 50,
                        style: { fill: darkColor, fontSize: 11 }
                    },
                    style: { fill: lightColor }, height: 100,
                    children: [
                        {
                            id: 'selectItemaddcart',
                            annotations: [{ content: 'Select item\nAdd cart' }],
                            margin: { left: 190, top: 20 },
                            height: 40, width: 100
                        },
                        {
                            id: 'paymentondebitcreditcard',
                            annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                            margin: { left: 350, top: 20 },
                            height: 40, width: 100
                        }
                    ],
                },
                {
                    id: 'stackCanvas3',
                    header: {
                        annotation: { content: 'SHOP' }, width: 50,
                        style: { fill: darkColor, fontSize: 11 }
                    },
                    style: { fill: lightColor },
                    height: 100,
                    children: [
                        {
                            id: 'getmaildetailaboutorder',
                            annotations: [{ content: 'Get mail detail\nabout order' }],
                            margin: { left: 190, top: 20 },
                            height: 40, width: 100
                        },
                        {
                            id: 'pakingitem',
                            annotations: [{ content: 'Paking item' }],
                            margin: { left: 350, top: 20 },
                            height: 40, width: 100
                        }
                    ],
                },
                {
                    id: 'stackCanvas4',
                    header: {
                        annotation: { content: 'DELIVERY' }, width: 50,
                        style: { fill: darkColor, fontSize: 11 }
                    },
                    style: { fill: lightColor },
                    height: 100,
                    children: [
                        {
                            id: 'sendcourieraboutaddress',
                            annotations: [{ content: 'Send Courier\n about Address' }],
                            margin: { left: 190, top: 20 },
                            height: 40, width: 100
                        },
                        {
                            id: 'deliveryonthataddress',
                            annotations: [{ content: 'Delivery on that\n Address' }],
                            margin: { left: 350, top: 20 },
                            height: 40, width: 100
                        },
                        {
                            id: 'getitItem',
                            shape: { type: 'Path', data: pathData },
                            annotations: [{ content: 'GET IT ITEM', style: { fontSize: 11 } }],
                            margin: { left: 500, top: 20 },
                            height: 40, width: 100
                        }
                    ],
                },
            ],
            phases: [
                {
                    id: 'phase1', offset: 170,
                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                    header: { annotation: { content: 'Phase' } }
                },
                {
                    id: 'phase2', offset: 450,
                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                    header: { annotation: { content: 'Phase' } }
                },
            ],
            phaseSize: 20,
        },
        offsetX: 420, offsetY: 270,
        height: 100,
        width: 650
    },
];

let diagram: Diagram = new Diagram({
    width: '100%', height: 900, nodes: nodes
});
diagram.appendTo('#diagram');


