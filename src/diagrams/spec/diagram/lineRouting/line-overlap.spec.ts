import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { LineRouting } from '../../../src/diagram/interaction/line-routing';
import { AvoidLineOverlapping } from '../../../src/diagram/interaction/line-overlapping';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { SymbolPalette } from '../../../src/symbol-palette/index';
import {
    Node, DataBinding, HierarchicalTree, TreeInfo, PathElement, LineDistribution, BpmnDiagrams, ConnectorBridging, IElement,
    PortVisibility,
    Snapping,
    PointPortModel,
    DiagramConstraints,
    Connector
} from '../../../src/diagram/index';
Diagram.Inject(AvoidLineOverlapping, LineRouting, UndoRedo, LineDistribution, BpmnDiagrams, ConnectorBridging);

let diagram: Diagram;
let ele: HTMLElement;
let connectors: ConnectorModel[];
let nodes: NodeModel[];
let ports: PointPortModel[];
describe('Diagram Control', () => {
    describe('Rendering', () => {
        describe('Line Overlapping - Initial Connector Overlaps-342636', () => {
            beforeAll(() => {
                ele = createElement('div', { id: 'overlaps_342636' });
                document.body.appendChild(ele);

                ports = [
                    { id: 'Top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hover },
                    { id: 'Left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hover },
                    { id: 'Bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hover },
                    { id: 'Right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hover },
                ];

                nodes = [
                    { id: 'Start', width: 50, height: 50, offsetX: 300, offsetY: 50, style: { fill: 'yellow' }, annotations: [{ content: 'Start' }], },
                    { id: 'TopGroup', width: 250, height: 100, offsetX: 300, offsetY: 150, },
                    { id: 'LeftAttach', width: 20, height: 50, offsetX: 175, offsetY: 150, },
                    { id: 'RightAttach', width: 50, height: 20, offsetX: 425, offsetY: 150 },

                    { id: 'CenterTop', width: 80, height: 30, offsetX: 300, offsetY: 250 },
                    { id: 'CenterMiddle', width: 20, height: 50, offsetX: 310, offsetY: 350 },
                    { id: 'CenterBottom', width: 80, height: 30, offsetX: 300, offsetY: 420 },

                    { id: 'BottomGroup', width: 250, height: 100, offsetX: 200, offsetY: 550 },
                    { id: 'BottomLeftAttach', width: 50, height: 20, offsetX: 70, offsetY: 550 },
                    { id: 'BottomRightAttach', width: 20, height: 50, offsetX: 330, offsetY: 550 },

                    { id: 'EndAttach', width: 20, height: 50, offsetX: 550, offsetY: 450 },

                    { id: 'End', width: 50, height: 50, offsetX: 550, offsetY: 530, style: { fill: 'yellow' }, annotations: [{ content: 'End' }] }
                ];


                connectors = [
                    { id: 'connector1', sourceID: 'Start', targetID: 'TopGroup', },
                    { id: 'connector2', sourceID: 'TopGroup', targetID: 'CenterTop', },
                    { id: 'connector3', sourceID: 'CenterTop', targetID: 'CenterMiddle', sourcePortID: 'Bottom', targetPortID: 'Top' },
                    { id: 'connector4', sourceID: 'CenterMiddle', targetID: 'CenterBottom', sourcePortID: 'Bottom', targetPortID: 'Top' },
                    { id: 'connector5', sourceID: 'CenterBottom', targetID: 'BottomGroup', },
                    { id: 'connector6', sourceID: 'BottomGroup', targetID: 'RightAttach', sourcePortID: 'Bottom', targetPortID: 'Top', },
                    { id: 'connector7', sourceID: 'CenterMiddle', targetID: 'EndAttach', sourcePortID: 'Right', targetPortID: 'Top', },
                    { id: 'connector8', sourceID: 'EndAttach', targetID: 'End', targetPortID: 'BottomRightAttach', },
                    { id: 'connector9', sourceID: 'BottomLeftAttach', targetID: 'End', sourcePortID: 'Left', targetPortID: 'Left' },
                    { id: 'connector9', sourceID: 'BottomRightAttach', targetID: 'CenterTop', sourcePortID: 'Right', targetPortID: 'Top', },
                    { id: 'connector10', sourceID: 'LeftAttach', targetID: 'BottomLeftAttach', sourcePortID: 'Left', targetPortID: 'Top', }
                ];


                diagram = new Diagram({
                    width: '1000px',
                    height: '900px',
                    nodes: nodes,
                    connectors: connectors,
                    getNodeDefaults: (node: NodeModel) => node.ports = ports,
                    getConnectorDefaults: (connector: ConnectorModel) => connector.type = 'Orthogonal',
                    rulerSettings: { showRulers: true },
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.AvoidLineOverlapping
                });
                diagram.appendTo('#overlaps_342636');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('check segment overlaps', (done: Function) => {
                debugger;
                let overlapFound = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector);
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                const overlaps = (diagram.avoidLineOverlappingModule as any).segmentTree.findOverlappingSegments(segment);
                                if (overlaps.length !== 0) {
                                    overlapFound = true;
                                    return;
                                }
                            }
                        });
                        if (overlapFound) {
                            return;
                        }
                    }
                });
                expect(overlapFound).toBe(false);
                done();
            });
            it('check node overlaps', (done: Function) => {
                debugger;
                let overlaped: boolean = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector) as any[];
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                overlaped = !diagram.lineRoutingModule.isPathWalkable(segment.startPoint, segment.endPoint, diagram);
                                if (overlaped) {
                                    return;
                                }
                            }
                        });
                        if (overlaped) {
                            return;
                        }
                    }
                })
                expect(overlaped).toBe(false);
                done();
            });
        });
        describe('Line Overlapping - Initial Connector Overlaps-350232', () => {
            beforeAll(() => {
                ele = createElement('div', { id: 'overlaps_350232' });
                document.body.appendChild(ele);

                ports = [
                    { id: 'Top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hover },
                    { id: 'Left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hover },
                    { id: 'Bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hover },
                    { id: 'Right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hover },
                ];

                nodes = [
                    { id: 'MMR', offsetX: 150, offsetY: 100, width: 80, height: 40, annotations: [{ content: 'MMR' }] },
                    { id: 'CIVIC', offsetX: 350, offsetY: 100, width: 80, height: 40, annotations: [{ content: 'CIVIC' }] },
                    { id: 'PVC', offsetX: 550, offsetY: 100, width: 80, height: 40, annotations: [{ content: 'PVC' }] },
                    { id: 'LIDAR', offsetX: 750, offsetY: 100, width: 80, height: 40, annotations: [{ content: 'LIDAR' }] },
                    { id: 'RAMSES', offsetX: 950, offsetY: 100, width: 80, height: 40, annotations: [{ content: 'RAMSES' }] },
                    { id: 'IDC6', offsetX: 550, offsetY: 300, width: 80, height: 40, annotations: [{ content: 'IDC6' }] },
                    { id: 'SMPC', offsetX: 150, offsetY: 500, width: 80, height: 40, annotations: [{ content: 'SMPC' }] },
                    { id: 'MMRFL', offsetX: 350, offsetY: 500, width: 80, height: 40, annotations: [{ content: 'MMRFL' }] },
                    { id: 'MMRFR', offsetX: 550, offsetY: 500, width: 80, height: 40, annotations: [{ content: 'MMRFR' }] },
                    { id: 'LRR', offsetX: 750, offsetY: 500, width: 80, height: 40, annotations: [{ content: 'LRR' }] },
                    { id: 'RVC', offsetX: 950, offsetY: 500, width: 80, height: 40, annotations: [{ content: 'RVC' }] }
                ];

                connectors = [
                    { sourceID: 'MMR', targetID: 'IDC6', annotations: [{ content: 'signal_MMR_A' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'MMR', targetID: 'IDC6', annotations: [{ content: 'signal_MMR_B' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'MMR', targetID: 'MMRFR', annotations: [{ content: 'signal_MMRFR_A' }], type: 'Orthogonal', cornerRadius: 10 },

                    { sourceID: 'CIVIC', targetID: 'IDC6', annotations: [{ content: 'signal_CIVIC_A' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'CIVIC', targetID: 'IDC6', annotations: [{ content: 'signal_CIVIC_B' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'CIVIC', targetID: 'RAMSES', annotations: [{ content: 'signal_RAMSES_A' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'CIVIC', targetID: 'RAMSES', annotations: [{ content: 'signal_RAMSES_B' }], type: 'Orthogonal', cornerRadius: 10 },


                    { sourceID: 'PVC', targetID: 'IDC6', annotations: [{ content: 'signal_PVC_A' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'PVC', targetID: 'IDC6', annotations: [{ content: 'signal_PVC_B' }], type: 'Orthogonal', cornerRadius: 10 },

                    { sourceID: 'LIDAR', targetID: 'IDC6', annotations: [{ content: 'signal_LIDAR_A' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'LIDAR', targetID: 'IDC6', annotations: [{ content: 'signal_LIDAR_B' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'LIDAR', targetID: 'MMRFR', annotations: [{ content: 'signal_LIDARFR_A' }], type: 'Orthogonal', cornerRadius: 10 },

                    { sourceID: 'RAMSES', targetID: 'IDC6', annotations: [{ content: 'signal_RAMSES_B' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'RAMSES', targetID: 'IDC6', annotations: [{ content: 'signal_RAMSES_C' }], type: 'Orthogonal', cornerRadius: 10 },

                    { sourceID: 'SMPC', targetID: 'IDC6', annotations: [{ content: 'signal_SMPC_A' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'SMPC', targetID: 'IDC6', annotations: [{ content: 'signal_SMPC_B' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'SMPC', targetID: 'LRR', annotations: [{ content: 'signal_LRR_A' }], type: 'Orthogonal', cornerRadius: 10 },

                    { sourceID: 'MMRFL', targetID: 'IDC6', annotations: [{ content: 'signal_MMRFL_A' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'MMRFL', targetID: 'IDC6', annotations: [{ content: 'signal_MMRFL_B' }], type: 'Orthogonal', cornerRadius: 10 },

                    { sourceID: 'MMRFR', targetID: 'IDC6', annotations: [{ content: 'signal_MMRFR_B' }], type: 'Orthogonal', cornerRadius: 10 },

                    { sourceID: 'LRR', targetID: 'IDC6', annotations: [{ content: 'signal_LRR_B' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'LRR', targetID: 'IDC6', annotations: [{ content: 'signal_LRR_C' }], type: 'Orthogonal', cornerRadius: 10 },

                    { sourceID: 'RVC', targetID: 'IDC6', annotations: [{ content: 'signal_RVC_A' }], type: 'Orthogonal', cornerRadius: 10 },
                    { sourceID: 'RVC', targetID: 'IDC6', annotations: [{ content: 'signal_RVC_B' }], type: 'Orthogonal', cornerRadius: 10 }
                ];

                diagram = new Diagram({
                    width: '1000px', height: '600px',
                    nodes: nodes,
                    getNodeDefaults: (node: any) => node.ports = ports,
                    connectors: connectors,
                    getConnectorDefaults: (connector: any) => connector.type = 'Orthogonal',
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.AvoidLineOverlapping
                });
                diagram.appendTo('#overlaps_350232');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('check segment overlaps', (done: Function) => {
                let overlapFound = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector);
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                const overlaps = (diagram.avoidLineOverlappingModule as any).segmentTree.findOverlappingSegments(segment);
                                if (overlaps.length !== 0) {
                                    overlapFound = true;
                                    return;
                                }
                            }
                        });
                        if (overlapFound) {
                            return;
                        }
                    }
                });
                expect(overlapFound).toBe(false);
                done();
            });
            it('check node overlaps', (done: Function) => {
                let overlaped: boolean = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector) as any[];
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                overlaped = !diagram.lineRoutingModule.isPathWalkable(segment.startPoint, segment.endPoint, diagram);
                                if (overlaped) {
                                    return;
                                }
                            }
                        });
                        if (overlaped) {
                            return;
                        }
                    }
                })
                expect(overlaped).toBe(false);
                done();
            });
        });
        describe('Line Overlapping - Initial Connector Overlaps-355641', () => {
            beforeAll(() => {
                ele = createElement('div', { id: 'overlaps_355641' });
                document.body.appendChild(ele);

                let orData: string = 'M21.7,76.5L21.7,76.5c6.4-18.1,6.4-37.8,0-55.9l0-0.1h1.6c21.5,0,41.7,10.4,54.2,28l0,0l0,0  c-12.5,17.6-32.7,28-54.2,28H21.7z M99.5,48.5l-22,0 M0,31.5h25 M0,65.5h25';
                let andData: string = 'M21.5,20.5h28a28,28,0,0,1,28,28v0a28,28,0,0,1-28,28h-28a0,0,0,0,1,0,0v-56a0,0,0,0,1,0,0Z M78,48.5 L 100,48.5Z M0,32.5 L 21.4,32.5Z M0,65.5 L 21.4,65.5Z';
                let notData: string = 'M75.5,50.5l-52,28v-56L75.5,50.5z M81.5,50.5h18 M1.5,50.5h22 M78.5,47.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3  S80.2,47.5,78.5,47.5z';

                let orPort: PointPortModel[] = [
                    { id: 'Or_port1', offset: { x: 0.01, y: 0.1963 }, visibility: PortVisibility.Visible, shape: 'Circle' }, { id: 'Or_port2', offset: { x: 0.26, y: 0.5 } },
                    { id: 'Or_port3', offset: { x: 0.01, y: 0.805 }, visibility: PortVisibility.Visible, shape: 'Circle' }, { id: 'Or_port4', offset: { x: 0.99, y: 0.5 }, visibility: PortVisibility.Visible, shape: 'Circle' }
                ];
                let andPort: PointPortModel[] = [
                    { id: 'And_port1', offset: { x: 0.01, y: 0.215 }, visibility: PortVisibility.Visible, shape: 'Circle' }, { id: 'And_port2', offset: { x: 0.22, y: 0.5 } },
                    { id: 'And_port3', offset: { x: 0.01, y: 0.805 }, visibility: PortVisibility.Visible, shape: 'Circle' }, { id: 'And_port4', offset: { x: 0.99, y: 0.5 }, visibility: PortVisibility.Visible, shape: 'Circle' }
                ];
                let notPort: PointPortModel[] = [
                    { id: 'Not_port1', offset: { x: 0.01, y: 0.5 }, visibility: PortVisibility.Visible, shape: 'Circle' }, { id: 'Not_port2', offset: { x: 0.99, y: 0.5 }, visibility: PortVisibility.Visible, shape: 'Circle' }
                ];
                nodes = [
                    { id: 'switch', offsetX: 100, offsetY: 50, width: 50, height: 50, ports: orPort },
                    { id: 'Push', offsetX: 100, offsetY: 150, width: 50, height: 50, ports: orPort },
                    { id: 'clock', offsetX: 100, offsetY: 250, width: 50, height: 50, ports: orPort },
                    { id: 'switch2', offsetX: 100, offsetY: 350, width: 50, height: 50, ports: orPort },

                    { id: 'AND21', offsetX: 200, offsetY: 100, width: 50, height: 50, shape: { type: 'Path', data: andData }, ports: andPort },
                    { id: 'OR22', offsetX: 200, offsetY: 200, width: 50, height: 50, shape: { type: 'Path', data: orData }, ports: orPort },
                    { id: 'AND23', offsetX: 200, offsetY: 300, width: 50, height: 50, shape: { type: 'Path', data: andData }, ports: andPort },

                    { id: 'AND31', offsetX: 300, offsetY: 250, width: 50, height: 50, shape: { type: 'Path', data: andData }, ports: andPort },

                    { id: 'OR41', offsetX: 400, offsetY: 150, width: 50, height: 50, shape: { type: 'Path', data: orData }, ports: orPort },
                    { id: 'NOT42', offsetX: 400, offsetY: 350, width: 50, height: 50, shape: { type: 'Path', data: notData }, ports: notPort },

                    {
                        id: 'Exor5', ports: orPort, offsetX: 500, offsetY: 250, width: 50, height: 50,
                        shape: {
                            type: 'Path', data: 'M21.7,76.5L21.7,76.5c6.4-18.1,6.4-37.8,0-55.9l0-0.1h1.6c21.5,0,41.7,10.4,54.2,28l0,0l0,0  c-12.5,17.6-32.7,28-54.2,28H21.7z M73.4,48.5L73.4,48.5 M17.5,76.8L17.5,76.8c6.7-18.2,6.7-38.1,0-56.3l0-0.1 M77.5,48.5h22   M0,32.5h21 M0,65.5h21'
                        },
                    },

                    { id: 'bulb', offsetX: 600, offsetY: 150, width: 50, height: 50, ports: [{ id: 'bulbPort', offset: { x: 0.5, y: 1 } }] }
                ];
                connectors = [
                    { id: 'ExOr-Output', sourceID: 'Exor5', targetID: 'bulb', sourcePortID: 'Or_port4', targetPortID: 'bulbPort', type: 'Orthogonal' },
                    { id: '4-ExOr1', sourceID: 'OR41', targetID: 'Exor5', sourcePortID: 'Or_port4', targetPortID: 'Or_port1', type: 'Orthogonal' },
                    { id: '4-ExOr2', sourceID: 'NOT42', targetID: 'Exor5', sourcePortID: 'Not_port2', targetPortID: 'Or_port3', type: 'Orthogonal' },
                    { id: '3-AND-OR', sourceID: 'AND31', targetID: 'OR41', sourcePortID: 'And_port4', targetPortID: 'Or_port3', type: 'Orthogonal' },
                    { id: '2AND1-4AND1', sourceID: 'AND21', targetID: 'OR41', sourcePortID: 'And_port4', targetPortID: 'Or_port1', type: 'Orthogonal' },
                    { id: '2OR2-3AND', sourceID: 'OR22', targetID: 'AND31', sourcePortID: 'Or_port4', targetPortID: 'And_port1', type: 'Orthogonal' },
                    { id: '2AND3-3AND', sourceID: 'AND23', targetID: 'AND31', sourcePortID: 'And_port4', targetPortID: 'And_port3', type: 'Orthogonal' },

                    { id: 'switch-Not42', sourceID: 'switch', targetID: 'NOT42', sourcePortID: 'Or_port4', targetPortID: 'Not_port1', type: 'Orthogonal' },

                    { id: 'Push-AND21', sourceID: 'Push', targetID: 'AND21', sourcePortID: 'Or_port4', targetPortID: 'And_port3', type: 'Orthogonal' },
                    { id: 'Push-OR22', sourceID: 'Push', targetID: 'OR22', sourcePortID: 'Or_port4', targetPortID: 'Or_port1', type: 'Orthogonal' },
                    { id: 'Push-AND23', sourceID: 'Push', targetID: 'AND23', sourcePortID: 'Or_port4', targetPortID: 'And_port1', type: 'Orthogonal' },

                    { id: 'clock-OR22', sourceID: 'clock', targetID: 'OR22', sourcePortID: 'Or_port4', targetPortID: 'Or_port3', type: 'Orthogonal' },
                    { id: 'clock-AND23', sourceID: 'clock', targetID: 'AND23', sourcePortID: 'Or_port4', targetPortID: 'And_port3', type: 'Orthogonal' },

                    { id: 'switch2-And21', sourceID: 'switch2', targetID: 'AND21', sourcePortID: 'Or_port4', targetPortID: 'And_port1', type: 'Orthogonal' },
                ];

                diagram = new Diagram({
                    width: '1400px',
                    height: '700px',
                    nodes: nodes,
                    connectors: connectors,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.AvoidLineOverlapping
                });
                diagram.appendTo('#overlaps_355641');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            //it('check segment overlaps', (done: Function) => {
            //    let overlapFound = false;
            //    diagram.connectors.forEach((connector: Connector) => {
            //        const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector);
            //        if (lineSegments && lineSegments.length !== 0) {
            //            lineSegments.forEach((segment: any) => {
            //                if (segment.previous && segment.next) {
            //                    const overlaps = (diagram.avoidLineOverlappingModule as any).segmentTree.findOverlappingSegments(segment);
            //                    if (overlaps.length !== 0) {
            //                        overlapFound = true;
            //                        return;
            //                    }
            //                }
            //            });
            //            if (overlapFound) {
            //                return;
            //            }
            //        }
            //    });
            //    expect(overlapFound).toBe(false);
            //    done();
            //});
            it('check node overlaps', (done: Function) => {
                let overlaped: boolean = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector) as any[];
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                overlaped = !diagram.lineRoutingModule.isPathWalkable(segment.startPoint, segment.endPoint, diagram);
                                if (overlaped) {
                                    return;
                                }
                            }
                        });
                        if (overlaped) {
                            return;
                        }
                    }
                })
                expect(overlaped).toBe(false);
                done();
            });
        });
        describe('Line Overlapping - Initial Connector Overlaps-400341', () => {
            beforeAll(() => {
                ele = createElement('div', { id: 'overlaps_400341' });
                document.body.appendChild(ele);
                ports = [
                    { id: 'Top', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hover },
                    { id: 'Left', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hover },
                    { id: 'Bottom', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hover },
                    { id: 'Right', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hover },
                ];
                nodes = [
                    { id: 'node1', offsetX: 150, offsetY: 50, annotations: [{ content: 'node1' }] },
                    { id: 'node2', offsetX: 350, offsetY: 50, annotations: [{ content: 'node2' }] },
                    { id: 'node3', offsetX: 550, offsetY: 50, annotations: [{ content: 'node3' }] },
                    { id: 'node4', offsetX: 150, offsetY: 150, annotations: [{ content: 'node4' }] },
                    { id: 'node5', offsetX: 350, offsetY: 150, annotations: [{ content: 'node5' }] },
                    { id: 'node6', offsetX: 550, offsetY: 150, annotations: [{ content: 'node6' }] },
                    { id: 'node7', offsetX: 150, offsetY: 250, annotations: [{ content: 'node7' }] },
                    { id: 'node8', offsetX: 350, offsetY: 250, annotations: [{ content: 'node8' }] },
                    { id: 'node9', offsetX: 550, offsetY: 250, annotations: [{ content: 'node9' }] },
                ];

                connectors = [
                    { id: 'connector1', sourceID: 'node1', targetID: 'node4' },
                    { id: 'connector2', sourceID: 'node2', targetID: 'node5' },
                    { id: 'connector3', sourceID: 'node3', targetID: 'node6' },
                    { id: 'connector4', sourceID: 'node2', targetID: 'node3', sourcePortID: 'Bottom', targetPortID: 'Top' },
                    { id: 'connector5', sourceID: 'node5', targetID: 'node6', sourcePortID: 'Bottom', targetPortID: 'Top' },
                    { id: 'connector6', sourceID: 'node4', targetID: 'node5', sourcePortID: 'Bottom', targetPortID: 'Top' },
                    { id: 'connector7', sourceID: 'node6', targetID: 'node7', sourcePortID: 'Bottom', targetPortID: 'Top' },
                    { id: 'connector8', sourceID: 'node7', targetID: 'node8', sourcePortID: 'Bottom', targetPortID: 'Top' },
                    { id: 'connector9', sourceID: 'node8', targetID: 'node9', sourcePortID: 'Bottom', targetPortID: 'Top' },
                ];

                diagram = new Diagram({
                    width: '800px',
                    height: '600px',
                    nodes: nodes,
                    connectors: connectors,
                    getNodeDefaults: (node: NodeModel) => node.ports = ports,
                    getConnectorDefaults: (connector: ConnectorModel) => connector.type = 'Orthogonal',
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.AvoidLineOverlapping
                });
                diagram.appendTo('#overlaps_400341');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('check segment overlaps', (done: Function) => {
                let overlapFound = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector);
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                const overlaps = (diagram.avoidLineOverlappingModule as any).segmentTree.findOverlappingSegments(segment);
                                if (overlaps.length !== 0) {
                                    overlapFound = true;
                                    return;
                                }
                            }
                        });
                        if (overlapFound) {
                            return;
                        }
                    }
                });
                expect(overlapFound).toBe(false);
                done();
            });
            it('check node overlaps', (done: Function) => {
                let overlaped: boolean = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector) as any[];
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                overlaped = !diagram.lineRoutingModule.isPathWalkable(segment.startPoint, segment.endPoint, diagram);
                                if (overlaped) {
                                    return;
                                }
                            }
                        });
                        if (overlaped) {
                            return;
                        }
                    }
                })
                expect(overlaped).toBe(false);
                done();
            });
        });
        describe('Line Overlapping - Initial Connector Overlaps-Test7', () => {
            beforeAll(() => {
                ele = createElement('div', { id: 'overlaps_test7' });
                document.body.appendChild(ele);
                ports = [
                    { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, shape: 'Circle' },
                    { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, shape: 'Circle' },
                    { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, shape: 'Circle' },
                    { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, shape: 'Circle' }
                ];

                nodes = [
                    { id: 'node1', offsetX: 100, offsetY: 50, width: 50, height: 50, ports: ports },
                    { id: 'node2', offsetX: 100, offsetY: 150, width: 50, height: 50, ports: ports },
                    { id: 'node3', offsetX: 100, offsetY: 270, width: 50, height: 50, ports: ports },
                    { id: 'node4', offsetX: 100, offsetY: 350, width: 50, height: 50, ports: ports },
                    { id: 'node5', offsetX: 300, offsetY: 350, width: 50, height: 50, ports: ports },
                    { id: 'node6', offsetX: 400, offsetY: 550, width: 50, height: 50, ports: ports },
                    { id: 'node7', offsetX: 500, offsetY: 550, width: 50, height: 50, ports: ports },
                    { id: 'node8', offsetX: 400, offsetY: 150, width: 50, height: 50, ports: ports },
                    { id: 'node9', offsetX: 500, offsetY: 150, width: 50, height: 50, ports: ports },
                    { id: 'node10', offsetX: 600, offsetY: 350, width: 50, height: 50, ports: ports },
                    { id: 'node11', offsetX: 800, offsetY: 350, width: 50, height: 50, ports: ports },
                    { id: 'node12', offsetX: 1080, offsetY: 200, width: 40, height: 40, ports: ports },
                    { id: 'node13', offsetX: 1020, offsetY: 300, width: 40, height: 40, ports: ports },
                    { id: 'node14', offsetX: 1000, offsetY: 200, width: 40, height: 40, ports: ports },
                    { id: 'node15', offsetX: 1100, offsetY: 340, width: 40, height: 40, ports: ports },
                ];
                connectors = [
                    { id: 'connector1', sourceID: 'node1', targetID: 'node5', sourcePortID: 'port3', targetPortID: 'port1', type: 'Orthogonal' },
                    { id: 'connector2', sourceID: 'node2', targetID: 'node3', sourcePortID: 'port3', targetPortID: 'port1', type: 'Orthogonal' },
                    { id: 'connector3', sourceID: 'node3', targetID: 'node4', sourcePortID: 'port3', targetPortID: 'port1', type: 'Orthogonal' },
                    { id: 'connector4', sourceID: 'node4', targetID: 'node1', sourcePortID: 'port2', targetPortID: 'port1', type: 'Orthogonal' },
                    { id: 'connector5', sourceID: 'node4', targetID: 'node7', sourcePortID: 'port4', targetPortID: 'port1', type: 'Orthogonal' },
                    { id: 'connector6', sourceID: 'node5', targetID: 'node7', sourcePortID: 'port4', targetPortID: 'port1', type: 'Orthogonal' },
                    { id: 'connector7', sourceID: 'node4', targetID: 'node9', sourcePortID: 'port2', targetPortID: 'port1', type: 'Orthogonal' },
                    { id: 'connector8', sourceID: 'node5', targetID: 'node9', sourcePortID: 'port2', targetPortID: 'port1', type: 'Orthogonal' },
                    { id: 'connector9', sourceID: 'node11', targetID: 'node8', sourcePortID: 'port2', targetPortID: 'port3', type: 'Orthogonal' },
                    { id: 'connector10', sourceID: 'node10', targetID: 'node8', sourcePortID: 'port2', targetPortID: 'port3', type: 'Orthogonal' },
                    { id: 'connector11', sourceID: 'node11', targetID: 'node6', sourcePortID: 'port4', targetPortID: 'port3', type: 'Orthogonal' },
                    { id: 'connector12', sourceID: 'node10', targetID: 'node6', sourcePortID: 'port4', targetPortID: 'port3', type: 'Orthogonal' },
                    { id: 'connector13', sourceID: 'node12', targetID: 'node13', sourcePortID: 'port4', targetPortID: 'port2', type: 'Orthogonal' },
                    { id: 'connector14', sourceID: 'node14', targetID: 'node15', sourcePortID: 'port4', targetPortID: 'port2', type: 'Orthogonal' },
                ];
                diagram = new Diagram({
                    width: '800px',
                    height: '600px',
                    nodes: nodes,
                    connectors: connectors,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.AvoidLineOverlapping
                });
                diagram.appendTo('#overlaps_test7');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('check segment overlaps', (done: Function) => {
                let overlapFound = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector);
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                const overlaps = (diagram.avoidLineOverlappingModule as any).segmentTree.findOverlappingSegments(segment);
                                if (overlaps.length !== 0) {
                                    overlapFound = true;
                                    return;
                                }
                            }
                        });
                        if (overlapFound) {
                            return;
                        }
                    }
                });
                expect(overlapFound).toBe(false);
                done();
            });
            it('check node overlaps', (done: Function) => {
                let overlaped: boolean = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector) as any[];
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                overlaped = !diagram.lineRoutingModule.isPathWalkable(segment.startPoint, segment.endPoint, diagram);
                                if (overlaped) {
                                    return;
                                }
                            }
                        });
                        if (overlaped) {
                            return;
                        }
                    }
                })
                expect(overlaped).toBe(false);
                done();
            });
        });
        describe('Line Overlapping - Initial Connector Overlaps-Less than 3 segments', () => {
            beforeAll(() => {
                ele = createElement('div', { id: 'lessSegmentsDiagram' });
                document.body.appendChild(ele);
                ports = [
                    { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, shape: 'Circle' },
                    { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible, shape: 'Circle' },
                    { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible, shape: 'Circle' },
                    { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible, shape: 'Circle' }
                ];

                nodes = [
                    { id: 'node1', offsetX: 100, offsetY: 100, width: 50, height: 50, ports: ports },
                    { id: 'node2', offsetX: 450, offsetY: 150, width: 50, height: 50, ports: ports },
                    { id: 'node3', offsetX: 145, offsetY: 0, width: 50, height: 50, ports: ports },
                    { id: 'node4', offsetX: 145, offsetY: 450, width: 50, height: 50, ports: ports },
            
                    { id: 'node5', offsetX: 600, offsetY: 100, width: 50, height: 50, ports: ports },
                    { id: 'node6', offsetX: 850, offsetY: 150, width: 50, height: 50, ports: ports },
                    { id: 'node7', offsetX: 645, offsetY: 300, width: 50, height: 50, ports: ports },
                ];
                connectors = [
                    { id: 'connector1', sourceID: 'node1', targetID: 'node2', sourcePortID: 'port3', targetPortID: 'port1', type: 'Orthogonal' },
                    { id: 'connector2', sourceID: 'node3', targetID: 'node4', sourcePortID: 'port4', targetPortID: 'port2', type: 'Orthogonal' },
                    { id: 'connector3', sourceID: 'node5', targetID: 'node6', sourcePortID: 'port3', targetPortID: 'port1', type: 'Orthogonal' },
                    { id: 'connector4', sourceID: 'node5', targetID: 'node7', sourcePortID: 'port3', targetPortID: 'port2', type: 'Orthogonal' },
                ];
                diagram = new Diagram({
                    width: '1400px',
                    height: '700px',
                    nodes: nodes,
                    connectors: connectors,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.AvoidLineOverlapping
                });
                diagram.appendTo('#lessSegmentsDiagram');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('check segment overlaps', (done: Function) => {
                let overlapFound = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector);
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                const overlaps = (diagram.avoidLineOverlappingModule as any).segmentTree.findOverlappingSegments(segment);
                                if (overlaps.length !== 0) {
                                    overlapFound = true;
                                    return;
                                }
                            }
                        });
                        if (overlapFound) {
                            return;
                        }
                    }
                });
                expect(overlapFound).toBe(false);
                done();
            });
            it('check node overlaps', (done: Function) => {
                let overlaped: boolean = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector) as any[];
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                overlaped = !diagram.lineRoutingModule.isPathWalkable(segment.startPoint, segment.endPoint, diagram);
                                if (overlaped) {
                                    return;
                                }
                            }
                        });
                        if (overlaped) {
                            return;
                        }
                    }
                })
                expect(overlaped).toBe(false);
                done();
            });
        });
        describe('Line Overlapping - Initial Connector Overlaps-edgeGrouping', () => {
            beforeAll(() => {
                ele = createElement('div', { id: 'edgeGrouping' });
                document.body.appendChild(ele);
                nodes = [
                    { id: 'node1', offsetX: 600, offsetY: 100, width: 50, height: 25 },
                    { id: 'node21', offsetX: 600, offsetY: 200, width: 50, height: 25 },
                    { id: 'node22', offsetX: 700, offsetY: 200, width: 50, height: 25 },
                    { id: 'node23', offsetX: 800, offsetY: 200, width: 50, height: 25 },
                    { id: 'node31', offsetX: 300, offsetY: 300, width: 50, height: 25 },
                    { id: 'node32', offsetX: 400, offsetY: 300, width: 50, height: 25 },
                    { id: 'node33', offsetX: 500, offsetY: 300, width: 50, height: 25 },
                    { id: 'node34', offsetX: 600, offsetY: 300, width: 50, height: 25 },
                    { id: 'node35', offsetX: 800, offsetY: 300, width: 50, height: 25 },
                    { id: 'node41', offsetX: 250, offsetY: 400, width: 50, height: 25 },
                    { id: 'node42', offsetX: 400, offsetY: 400, width: 50, height: 25 },
                    { id: 'node43', offsetX: 600, offsetY: 400, width: 50, height: 25 },
                    { id: 'node44', offsetX: 700, offsetY: 400, width: 50, height: 25 },
                    { id: 'node45', offsetX: 800, offsetY: 400, width: 50, height: 25 },
                    { id: 'node51', offsetX: 100, offsetY: 500, width: 50, height: 25 },
                    { id: 'node52', offsetX: 200, offsetY: 500, width: 50, height: 25 },
                    { id: 'node53', offsetX: 410, offsetY: 500, width: 50, height: 25 },
                    { id: 'node54', offsetX: 550, offsetY: 500, width: 50, height: 25 },
                    { id: 'node55', offsetX: 650, offsetY: 500, width: 50, height: 25 },
                    { id: 'node61', offsetX: 200, offsetY: 600, width: 50, height: 25 },
                    { id: 'node62', offsetX: 650, offsetY: 600, width: 50, height: 25 }
                ];
                connectors = [
                    { id: '1-32', sourceID: 'node1', targetID: 'node32', type: 'Orthogonal' },
                    { id: '1-34', sourceID: 'node1', targetID: 'node34', type: 'Orthogonal' },
                    { id: '1-21', sourceID: 'node1', targetID: 'node21', type: 'Orthogonal' },
                    { id: '1-22', sourceID: 'node1', targetID: 'node22', type: 'Orthogonal' },
                    { id: '1-23', sourceID: 'node1', targetID: 'node23', type: 'Orthogonal' },

                    { id: '21-31', sourceID: 'node21', targetID: 'node31', type: 'Orthogonal' },
                    { id: '21-32', sourceID: 'node21', targetID: 'node32', type: 'Orthogonal' },
                    { id: '21-33', sourceID: 'node21', targetID: 'node33', type: 'Orthogonal' },
                    { id: '21-34', sourceID: 'node21', targetID: 'node34', type: 'Orthogonal' },
                    { id: '21-43', sourceID: 'node21', targetID: 'node43', type: 'Orthogonal' },
                    { id: '21-45', sourceID: 'node21', targetID: 'node45', type: 'Orthogonal' },

                    { id: '23-35', sourceID: 'node23', targetID: 'node35', type: 'Orthogonal' },

                    { id: '31-41', sourceID: 'node31', targetID: 'node41', type: 'Orthogonal' },
                    { id: '31-42', sourceID: 'node31', targetID: 'node42', type: 'Orthogonal' },

                    { id: '32-42', sourceID: 'node32', targetID: 'node42', type: 'Orthogonal' },
                    { id: '33-42', sourceID: 'node33', targetID: 'node42', type: 'Orthogonal' },

                    { id: '34-54', sourceID: 'node34', targetID: 'node54', type: 'Orthogonal' },
                    { id: '34-43', sourceID: 'node34', targetID: 'node43', type: 'Orthogonal' },
                    { id: '34-44', sourceID: 'node34', targetID: 'node44', type: 'Orthogonal' },

                    { id: '35-45', sourceID: 'node35', targetID: 'node45', type: 'Orthogonal' },

                    { id: '41-61', sourceID: 'node41', targetID: 'node61', type: 'Orthogonal' },
                    { id: '42-61', sourceID: 'node42', targetID: 'node61', type: 'Orthogonal' },
                    { id: '42-53', sourceID: 'node42', targetID: 'node53', type: 'Orthogonal' },

                    { id: '43-54', sourceID: 'node42', targetID: 'node53', type: 'Orthogonal' },
                    { id: '44-62', sourceID: 'node44', targetID: 'node62', type: 'Orthogonal' },
                    { id: '45-62', sourceID: 'node45', targetID: 'node62', type: 'Orthogonal' },

                    { id: '51-61', sourceID: 'node51', targetID: 'node61', type: 'Orthogonal' },
                    { id: '52-61', sourceID: 'node52', targetID: 'node61', type: 'Orthogonal' },
                    { id: '53-62', sourceID: 'node53', targetID: 'node62', type: 'Orthogonal' },
                    { id: '54-62', sourceID: 'node54', targetID: 'node62', type: 'Orthogonal' },
                    { id: '55-62', sourceID: 'node55', targetID: 'node62', type: 'Orthogonal' },
                ];
                diagram = new Diagram({
                    width: '1400px', height: '700px', nodes: nodes, connectors: connectors, rulerSettings: { showRulers: true },
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.AvoidLineOverlapping
                });
                diagram.appendTo('#edgeGrouping');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('check segment overlaps', (done: Function) => {
                let overlapFound = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector);
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                const overlaps = (diagram.avoidLineOverlappingModule as any).segmentTree.findOverlappingSegments(segment);
                                if (overlaps.length !== 0) {
                                    overlapFound = true;
                                    return;
                                }
                            }
                        });
                        if (overlapFound) {
                            return;
                        }
                    }
                });
                expect(overlapFound).toBe(false);
                done();
            });
            it('check node overlaps', (done: Function) => {
                let overlaped: boolean = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector) as any[];
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                overlaped = !diagram.lineRoutingModule.isPathWalkable(segment.startPoint, segment.endPoint, diagram);
                                if (overlaped) {
                                    return;
                                }
                            }
                        });
                        if (overlaped) {
                            return;
                        }
                    }
                })
                expect(overlaped).toBe(false);
                done();
            });
        });
        describe('Line Overlapping - Initial Connector Overlaps-edgeRouter', () => {
            beforeAll(() => {
                ele = createElement('div', { id: 'edgeRouter' });
                document.body.appendChild(ele);
                nodes = [
                    { id: 'node11', offsetX: 100, offsetY: 200, width: 50, height: 25 },
                    { id: 'node12', offsetX: 100, offsetY: 260, width: 50, height: 25 },
                    { id: 'node13', offsetX: 100, offsetY: 320, width: 50, height: 25 },
                    { id: 'node14', offsetX: 100, offsetY: 380, width: 50, height: 25 },
                    { id: 'node15', offsetX: 100, offsetY: 440, width: 50, height: 25 },
                    { id: 'node16', offsetX: 100, offsetY: 500, width: 50, height: 25 },

                    { id: 'node21', offsetX: 350, offsetY: 80, width: 50, height: 25 },
                    { id: 'node22', offsetX: 300, offsetY: 320, width: 50, height: 25 },
                    { id: 'node23', offsetX: 300, offsetY: 380, width: 50, height: 25 },
                    { id: 'node24', offsetX: 300, offsetY: 470, width: 50, height: 25 },
                    { id: 'node25', offsetX: 300, offsetY: 600, width: 50, height: 25 },
                    { id: 'node26', offsetX: 325, offsetY: 900, width: 50, height: 25 },

                    { id: 'node31', offsetX: 450, offsetY: 80, width: 50, height: 25 },
                    { id: 'node32', offsetX: 450, offsetY: 200, width: 50, height: 25 },
                    { id: 'node33', offsetX: 450, offsetY: 320, width: 50, height: 25 },
                    { id: 'node34', offsetX: 400, offsetY: 410, width: 50, height: 25 },
                    { id: 'node35', offsetX: 450, offsetY: 490, width: 50, height: 25 },
                    { id: 'node36', offsetX: 400, offsetY: 660, width: 50, height: 25 },
                    { id: 'node37', offsetX: 450, offsetY: 900, width: 50, height: 25 },

                    { id: 'node41', offsetX: 550, offsetY: 80, width: 50, height: 25 },
                    { id: 'node42', offsetX: 525, offsetY: 600, width: 50, height: 25 },
                    { id: 'node43', offsetX: 580, offsetY: 900, width: 50, height: 25 },

                    { id: 'node51', offsetX: 680, offsetY: 440, width: 50, height: 25 },
                    { id: 'node52', offsetX: 650, offsetY: 590, width: 50, height: 25 },
                    { id: 'node53', offsetX: 675, offsetY: 900, width: 50, height: 25 },

                    { id: 'node61', offsetX: 750, offsetY: 570, width: 50, height: 25 },
                    { id: 'node62', offsetX: 750, offsetY: 660, width: 50, height: 25 },
                    { id: 'node63', offsetX: 750, offsetY: 750, width: 50, height: 25 },
                    { id: 'node64', offsetX: 750, offsetY: 840, width: 50, height: 25 },

                    { id: 'node71', offsetX: 800, offsetY: 180, width: 50, height: 25 },
                    { id: 'node72', offsetX: 800, offsetY: 320, width: 50, height: 25 },

                    { id: 'node81', offsetX: 1000, offsetY: 150, width: 50, height: 25 },
                    { id: 'node82', offsetX: 1000, offsetY: 230, width: 50, height: 25 },
                    { id: 'node83', offsetX: 1000, offsetY: 320, width: 50, height: 25 },
                    { id: 'node84', offsetX: 1000, offsetY: 440, width: 50, height: 25 },
                    { id: 'node85', offsetX: 1000, offsetY: 570, width: 50, height: 25 },
                ];
                connectors = [
                    { id: '11-21', sourceID: 'node11', targetID: 'node22', type: 'Orthogonal' },
                    { id: '12-21', sourceID: 'node12', targetID: 'node22', type: 'Orthogonal' },
                    { id: '13-21', sourceID: 'node13', targetID: 'node22', type: 'Orthogonal' },
                    { id: '14-21', sourceID: 'node14', targetID: 'node22', type: 'Orthogonal' },
                    { id: '15-21', sourceID: 'node15', targetID: 'node22', type: 'Orthogonal' },
                    { id: '16-21', sourceID: 'node16', targetID: 'node22', type: 'Orthogonal' },

                    { id: '21-32', sourceID: 'node21', targetID: 'node32', type: 'Orthogonal' },
                    { id: '22-33', sourceID: 'node22', targetID: 'node33', type: 'Orthogonal' },
                    { id: '33-22', sourceID: 'node33', targetID: 'node22', type: 'Orthogonal' },
                    { id: '23-33', sourceID: 'node23', targetID: 'node33', type: 'Orthogonal' },
                    { id: '52-25', sourceID: 'node52', targetID: 'node25', type: 'Orthogonal' },
                    { id: '26-35', sourceID: 'node26', targetID: 'node25', type: 'Orthogonal' },
                    { id: '24-33', sourceID: 'node24', targetID: 'node33', type: 'Orthogonal' },

                    { id: '31-32', sourceID: 'node31', targetID: 'node32', type: 'Orthogonal' },
                    { id: '33-32', sourceID: 'node33', targetID: 'node32', type: 'Orthogonal' },
                    { id: '34-33', sourceID: 'node34', targetID: 'node33', type: 'Orthogonal' },
                    { id: '35-33', sourceID: 'node35', targetID: 'node33', type: 'Orthogonal' },
                    { id: '26-36', sourceID: 'node26', targetID: 'node36', type: 'Orthogonal' },
                    { id: '37-26', sourceID: 'node37', targetID: 'node26', type: 'Orthogonal' },
                    { id: '37-36', sourceID: 'node37', targetID: 'node36', type: 'Orthogonal' },
                    { id: '36-35', sourceID: 'node36', targetID: 'node35', type: 'Orthogonal' },
                    { id: '36-42', sourceID: 'node36', targetID: 'node42', type: 'Orthogonal' },


                    { id: '41-32', sourceID: 'node41', targetID: 'node32', type: 'Orthogonal' },
                    { id: '71-32', sourceID: 'node71', targetID: 'node32', type: 'Orthogonal' },
                    { id: '72-33', sourceID: 'node72', targetID: 'node33', type: 'Orthogonal' },
                    { id: '33-72', sourceID: 'node33', targetID: 'node72', type: 'Orthogonal' },
                    { id: '51-33', sourceID: 'node51', targetID: 'node33', type: 'Orthogonal' },
                    { id: '71-42', sourceID: 'node71', targetID: 'node42', type: 'Orthogonal' },

                    { id: '61-35', sourceID: 'node61', targetID: 'node35', type: 'Orthogonal' },
                    { id: '42-35', sourceID: 'node42', targetID: 'node35', type: 'Orthogonal' },
                    { id: '42-37', sourceID: 'node42', targetID: 'node37', type: 'Orthogonal' },
                    { id: '42-62', sourceID: 'node42', targetID: 'node62', type: 'Orthogonal' },
                    { id: '42-63', sourceID: 'node42', targetID: 'node63', type: 'Orthogonal' },
                    { id: '42-64', sourceID: 'node42', targetID: 'node64', type: 'Orthogonal' },
                    { id: '42-53', sourceID: 'node42', targetID: 'node53', type: 'Orthogonal' },
                    { id: '42-43', sourceID: 'node42', targetID: 'node43', type: 'Orthogonal' },

                    { id: '61-51', sourceID: 'node61', targetID: 'node51', type: 'Orthogonal' },
                    { id: '61-52', sourceID: 'node61', targetID: 'node52', type: 'Orthogonal' },

                    { id: '72-71', sourceID: 'node72', targetID: 'node71', type: 'Orthogonal' },
                    { id: '61-72', sourceID: 'node61', targetID: 'node72', type: 'Orthogonal' },
                    { id: '72-85', sourceID: 'node72', targetID: 'node85', type: 'Orthogonal' },
                    { id: '72-84', sourceID: 'node72', targetID: 'node84', type: 'Orthogonal' },
                    { id: '72-81', sourceID: 'node72', targetID: 'node81', type: 'Orthogonal' },
                    { id: '72-82', sourceID: 'node72', targetID: 'node82', type: 'Orthogonal' },
                    { id: '72-83', sourceID: 'node72', targetID: 'node83', type: 'Orthogonal' },
                ];
                diagram = new Diagram({
                    width: '1400px', height: '800px', nodes: nodes, connectors: connectors,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.AvoidLineOverlapping
                });

                diagram.appendTo('#edgeRouter');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('check segment overlaps', (done: Function) => {
                let overlapFound = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector);
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                const overlaps = (diagram.avoidLineOverlappingModule as any).segmentTree.findOverlappingSegments(segment);
                                if (overlaps.length !== 0) {
                                    overlapFound = true;
                                    return;
                                }
                            }
                        });
                        if (overlapFound) {
                            return;
                        }
                    }
                });
                expect(overlapFound).toBe(false);
                done();
            });
            it('check node overlaps', (done: Function) => {
                let overlaped: boolean = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector) as any[];
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                overlaped = !diagram.lineRoutingModule.isPathWalkable(segment.startPoint, segment.endPoint, diagram);
                                if (overlaped) {
                                    return;
                                }
                            }
                        });
                        if (overlaped) {
                            return;
                        }
                    }
                })
                expect(overlaped).toBe(false);
                done();
            });
        });
        describe('Line Overlapping - Initial Connector Overlaps-layoutStyleDemo', () => {
            beforeAll(() => {
                ele = createElement('div', { id: 'layoutStyleDemo' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'top1', offsetX: 50, offsetY: 245, width: 30, height: 100,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'center1', offsetX: 50, offsetY: 380, width: 30, height: 30,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'bottom1', offsetX: 50, offsetY: 550, width: 30, height: 30,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'top2', offsetX: 220, offsetY: 40, width: 110, height: 60,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'center2', offsetX: 220, offsetY: 300, width: 110, height: 60,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'bottom2', offsetX: 220, offsetY: 550, width: 110, height: 60,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'top31', offsetX: 380, offsetY: 40, width: 30, height: 30,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'top32', offsetX: 380, offsetY: 90, width: 30, height: 30,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'top33', offsetX: 380, offsetY: 140, width: 30, height: 30,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'center31', offsetX: 380, offsetY: 300, width: 30, height: 30,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'center32', offsetX: 380, offsetY: 400, width: 30, height: 30,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'bottom3', offsetX: 380, offsetY: 550, width: 30, height: 30,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'top4', offsetX: 550, offsetY: 150, width: 110, height: 100,
                        style: { fill: '#3eb7a0', strokeWidth: 2, strokeColor: '#02aab0' },
                    }, // Slightly darker teal
                    {
                        id: 'center41', offsetX: 550, offsetY: 300, width: 110, height: 30,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'center42', offsetX: 550, offsetY: 400, width: 30,
                        height: 60,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                    {
                        id: 'bottom4', offsetX: 550, offsetY: 550, width: 30, height: 30,
                        style: { fill: '#41f5e7', strokeWidth: 2, strokeColor: '#02aab0' },
                    },
                ];
                connectors = [
                    { id: '2center-top1', sourceID: 'center2', targetID: 'top2', type: 'Orthogonal' },
                    { id: '2center-top2', sourceID: 'center2', targetID: 'top2', type: 'Orthogonal' },
                    { id: '2center-top3', sourceID: 'center2', targetID: 'top2', type: 'Orthogonal' },
                    { id: '2center-top4', sourceID: 'center2', targetID: 'top2', type: 'Orthogonal' },
                    { id: '2center-top5', sourceID: 'center2', targetID: 'top2', type: 'Orthogonal' },
                    { id: '2center-top6', sourceID: 'center2', targetID: 'top2', type: 'Orthogonal' },

                    { id: '1top-4top1', sourceID: 'top1', targetID: 'top4', type: 'Orthogonal' },
                    { id: '1top-4top2', sourceID: 'top1', targetID: 'top4', type: 'Orthogonal' },
                    { id: '1top-4top3', sourceID: 'top1', targetID: 'top4', type: 'Orthogonal' },
                    { id: '1top-4top4', sourceID: 'top1', targetID: 'top4', type: 'Orthogonal' },
                    { id: '1top-4top5', sourceID: 'top1', targetID: 'top4', type: 'Orthogonal' },
                    { id: '1top-4top6', sourceID: 'top1', targetID: 'top4', type: 'Orthogonal' },

                    { id: '1top-3bottom1', sourceID: 'top1', targetID: 'bottom3', type: 'Orthogonal' },
                    { id: '1top-3bottom2', sourceID: 'top1', targetID: 'bottom3', type: 'Orthogonal' },
                    { id: '1top-3bottom3', sourceID: 'top1', targetID: 'bottom3', type: 'Orthogonal' },

                    { id: '1top-4bottom1', sourceID: 'top1', targetID: 'bottom4', type: 'Orthogonal' },
                    { id: '1top-4bottom2', sourceID: 'top1', targetID: 'bottom4', type: 'Orthogonal' },
                    { id: '1top-4bottom3', sourceID: 'top1', targetID: 'bottom4', type: 'Orthogonal' },

                    { id: '1top-4center21', sourceID: 'top1', targetID: 'center42', type: 'Orthogonal' },
                    { id: '1top-4center22', sourceID: 'top1', targetID: 'center42', type: 'Orthogonal' },

                    { id: '2top-4center23', sourceID: 'top2', targetID: 'center42', type: 'Orthogonal' },
                    { id: '2top-4center24', sourceID: 'top2', targetID: 'center42', type: 'Orthogonal' },
                    { id: '2top-4center25', sourceID: 'top2', targetID: 'center42', type: 'Orthogonal' },

                    { id: '4top-3top1', sourceID: 'top4', targetID: 'top31', type: 'Orthogonal' },
                    { id: '3top1-4top', sourceID: 'top31', targetID: 'top4', type: 'Orthogonal' },

                    { id: '3top1-2top', sourceID: 'top31', targetID: 'top2', type: 'Orthogonal' },
                    { id: '3top2-2top', sourceID: 'top32', targetID: 'top2', type: 'Orthogonal' },
                    { id: '3top2-3top1', sourceID: 'top32', targetID: 'top31', type: 'Orthogonal' },
                    { id: '3top3-2top', sourceID: 'top33', targetID: 'top2', type: 'Orthogonal' },
                    { id: '3top3-3top2', sourceID: 'top33', targetID: 'top32', type: 'Orthogonal' },

                    { id: '2top-1top', sourceID: 'top2', targetID: 'top1', type: 'Orthogonal' },
                    { id: '1top-2top', sourceID: 'top1', targetID: 'top2', type: 'Orthogonal' },

                    { id: '1top-1bottom1', sourceID: 'top1', targetID: 'bottom1', type: 'Orthogonal' },
                    { id: '1top-1bottom2', sourceID: 'top1', targetID: 'bottom1', type: 'Orthogonal' },

                    { id: '1top-2bottom1', sourceID: 'top1', targetID: 'bottom2', type: 'Orthogonal' },
                    { id: '1top-2bottom2', sourceID: 'top1', targetID: 'bottom2', type: 'Orthogonal' },

                    { id: '1bottom-2bottom', sourceID: 'bottom1', targetID: 'bottom2', type: 'Orthogonal' },

                    { id: '1center-1bottom', sourceID: 'center1', targetID: 'bottom1', type: 'Orthogonal' },
                    { id: '1bottom-1center', sourceID: 'bottom1', targetID: 'center1', type: 'Orthogonal' },

                    { id: '2center-2bottom', sourceID: 'center2', targetID: 'bottom2', type: 'Orthogonal' },
                    { id: '2bottom-2center', sourceID: 'bottom2', targetID: 'center2', type: 'Orthogonal' },

                    { id: '2bottom-3bottom', sourceID: 'bottom2', targetID: 'bottom3', type: 'Orthogonal' },
                    { id: '3bottom-2bottom', sourceID: 'bottom3', targetID: 'bottom2', type: 'Orthogonal' },


                    { id: '3bottom-3center2', sourceID: 'bottom3', targetID: 'center32', type: 'Orthogonal' },
                    { id: '3center2-3bottom', sourceID: 'center32', targetID: 'bottom3', type: 'Orthogonal' },

                    { id: '4bottom-4center2', sourceID: 'bottom4', targetID: 'center42', type: 'Orthogonal' },
                    { id: '4center2-4bottom', sourceID: 'center42', targetID: 'bottom4', type: 'Orthogonal' },

                    { id: '4center2-3center2', sourceID: 'center42', targetID: 'center32', type: 'Orthogonal' },
                    { id: '3center2-4center2', sourceID: 'center32', targetID: 'center42', type: 'Orthogonal' },

                    { id: '4center1-3center1', sourceID: 'center41', targetID: 'center31', type: 'Orthogonal' },
                    { id: '3center1-4center1', sourceID: 'center31', targetID: 'center41', type: 'Orthogonal' },

                    { id: '4center1-4center2', sourceID: 'center41', targetID: 'center42', type: 'Orthogonal' },
                    { id: '3center2-3center1', sourceID: 'center32', targetID: 'center31', type: 'Orthogonal' },

                    { id: '4center1-4top1', sourceID: 'center41', targetID: 'top4', type: 'Orthogonal' },
                    { id: '4center1-4top2', sourceID: 'center41', targetID: 'top4', type: 'Orthogonal' },
                    { id: '4center1-4top3', sourceID: 'center41', targetID: 'top4', type: 'Orthogonal' },
                    { id: '4center1-4top4', sourceID: 'center41', targetID: 'top4', type: 'Orthogonal' },

                    { id: '2center-4top1', sourceID: 'center2', targetID: 'top4', type: 'Orthogonal' },
                    { id: '2center-4top2', sourceID: 'center2', targetID: 'top4', type: 'Orthogonal' },

                    { id: '2center-4center1', sourceID: 'center2', targetID: 'center41', type: 'Orthogonal' },
                    { id: '2center-4center2', sourceID: 'center2', targetID: 'center42', type: 'Orthogonal' },

                ];
                diagram = new Diagram({
                    width: '1400px', height: '800px', nodes: nodes, connectors: connectors,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.AvoidLineOverlapping
                });

                diagram.appendTo('#layoutStyleDemo');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('check segment overlaps', (done: Function) => {
                let overlapFound = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector);
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                const overlaps = (diagram.avoidLineOverlappingModule as any).segmentTree.findOverlappingSegments(segment);
                                if (overlaps.length !== 0) {
                                    overlapFound = true;
                                    return;
                                }
                            }
                        });
                        if (overlapFound) {
                            return;
                        }
                    }
                });
                expect(overlapFound).toBe(false);
                done();
            });
            it('check node overlaps', (done: Function) => {
                let overlaped: boolean = false;
                diagram.connectors.forEach((connector: Connector) => {
                    const lineSegments: any[] = (diagram.avoidLineOverlappingModule as any).segmentMappings.get(connector) as any[];
                    if (lineSegments && lineSegments.length !== 0) {
                        lineSegments.forEach((segment: any) => {
                            if (segment.previous && segment.next) {
                                overlaped = !diagram.lineRoutingModule.isPathWalkable(segment.startPoint, segment.endPoint, diagram);
                                if (overlaped) {
                                    return;
                                }
                            }
                        });
                        if (overlaped) {
                            return;
                        }
                    }
                })
                expect(overlaped).toBe(false);
                done();
            });
        });
    });
});
