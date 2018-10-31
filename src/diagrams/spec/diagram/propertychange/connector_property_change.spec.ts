import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, TextModel, PathModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel, BpmnFlowModel, ConnectorShapeModel } from '../../../src/diagram/objects/connector-model';
import { Point } from '../../../src/diagram/primitives/point';
import { Segments, AnnotationConstraints, ConnectorConstraints } from '../../../src/diagram/enum/enum';
import { TextStyle } from '../../../src/diagram/core/appearance';
import { PathAnnotationModel } from '../../../src/diagram/objects/annotation-model';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';

/**
 * Connector Property Change  spec
 */
describe('Diagram Control', () => {

    describe('Connetor property change', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Straight', sourcePoint: { x: 350, y: 300 },
                targetPoint: { x: 450, y: 300 }
            };
            let connectors2: ConnectorModel =
                {
                    id: 'connector2',
                    type: 'Straight',
                    annotations: [
                        {
                            id: 'label1',
                            content: 'Default Shape1', style: { color: 'red' },
                            constraints: ~AnnotationConstraints.InheritReadOnly
                        }, {
                            id: 'label1111',
                            visibility: false,
                            content: 'Default Shape2', style: { color: 'red' },
                            offset: 1,
                        }
                    ],
                    constraints: ConnectorConstraints.Default | ConnectorConstraints.ReadOnly,
                    sourcePoint: { x: 100, y: 100 },
                    targetPoint: { x: 200, y: 200 },

                }

            diagram = new Diagram({ width: 600, height: 500, connectors: [connector1, connectors2] });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connector style property change', (done: Function) => {
            diagram.connectors[0].style.strokeColor = 'red';
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.style.strokeColor === 'red').toBe(true);
            done();
        });
        it('Checking connector source point change', (done: Function) => {
            diagram.connectors[0].sourcePoint = { x: 300, y: 300 };
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourcePoint.x === 300 && connector.sourcePoint.y === 300).toBe(true);
            done();
        });
        it('Checking connector target point change', (done: Function) => {
            diagram.connectors[0].targetPoint = { x: 550, y: 200 };
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.targetPoint.x === 550 && connector.targetPoint.y === 200).toBe(true);
            done();
        });
        it('Checking connector type change', (done: Function) => {
            diagram.connectors[0].type = 'Orthogonal';
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.type === 'Orthogonal').toBe(true);
            done();
        });

        it('Checking connector corner radius change', (done: Function) => {
            diagram.connectors[0].cornerRadius = 20;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.cornerRadius === 20).toBe(true);
            done();
        });
        it('Checking connector target Decorator change', (done: Function) => {
            diagram.connectors[0].targetDecorator.style.fill = 'red';
            diagram.connectors[0].targetDecorator.shape = 'Diamond';
            diagram.connectors[0].targetDecorator.width = 15;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.targetDecorator.style.fill === 'red' && connector.targetDecorator.shape === 'Diamond'
                && connector.targetDecorator.width === 15).toBe(true);
            done();
        });
        it('Checking connector source decorator change', (done: Function) => {
            diagram.connectors[0].sourceDecorator.shape = 'Diamond';
            diagram.connectors[0].targetDecorator.style.strokeWidth = 4;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourceDecorator.shape === 'Diamond' && connector.targetDecorator.style.strokeWidth === 4).toBe(true);
            done();
        });
        it('Checking connector annotation', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let label: PathAnnotationModel = (diagram.connectors[1] as ConnectorModel).annotations[1];
            expect(label.visibility == false).toBe(true);
            (diagram.connectors[1] as ConnectorModel).annotations[1].visibility = true,
                diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            expect(label.visibility == true).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 150, 150);
            mouseEvents.dblclickEvent(diagramCanvas, 150, 150);
            let element = document.getElementById('diagram_editTextBoxDiv');
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            mouseEvents.dblclickEvent(diagramCanvas, 200, 200);
            let element1 = document.getElementById('diagram_editTextBoxDiv');
            expect(element && !element1).toBe(true);
            done();
        });
        it('Checking connector type change to bezier', (done: Function) => {
            diagram.connectors[0].type = 'Bezier';
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(((connector.wrapper.children[0]) as PathModel).data === 'M300.5 300C360.46 299.81 489.53999999999996 200.19 549.5 200').toBe(true);
            done();
        });
    });

    describe('Connetor property change ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram8' });
            document.body.appendChild(ele);

            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: {
                    type: 'Path', data:
                        'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z',
                } as PathModel,
                ports: [{ id: 'port', offset: { x: 0.5, y: 1 }, shape: 'Square' }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: { type: 'Text', content: 'textelement' } as TextModel,
                style: { color: 'green', fontSize: 12, fontFamily: 'sans-serif' } as TextStyle,
                ports: [{ id: 'port1', offset: { x: 0.5, y: 1 }, shape: 'Square' }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: { type: 'Text', content: 'textelement' } as TextModel,
                style: { color: 'green', fontSize: 12, fontFamily: 'sans-serif' } as TextStyle,
                ports: [{ id: 'port2', offset: { x: 0.5, y: 1 }, shape: 'Square' }]
            };
            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Orthogonal', sourceID: node.id,
                targetID: node1.id
            };

            diagram = new Diagram({
                width: 600, height: 500, nodes: [node, node1, node2], connectors: [connector1]
            });
            diagram.appendTo('#diagram8');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connector source node change', (done: Function) => {
            diagram.connectors[0].sourceID = diagram.nodes[2].id;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourceID == diagram.nodes[2].id).toBe(true);
            done();
        });
        it('Checking connector target node change', (done: Function) => {
            diagram.connectors[0].targetID = diagram.nodes[0].id;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.targetID == diagram.nodes[0].id).toBe(true);
            done();
        });
        it('Checking connector source port change', (done: Function) => {
            diagram.connectors[0].sourceID = diagram.nodes[2].id;
            diagram.connectors[0].sourcePortID = (diagram.nodes[2] as NodeModel).ports[0].id;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourcePortID === (diagram.nodes[2] as NodeModel).ports[0].id).toBe(true);
            done();
        });
        it('Checking connector target port change', (done: Function) => {
            diagram.connectors[0].targetID = diagram.nodes[0].id;
            diagram.connectors[0].targetPortID = (diagram.nodes[0] as NodeModel).ports[0].id;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.targetPortID === (diagram.nodes[0] as NodeModel).ports[0].id).toBe(true);
            done();
        });
        it('Change the node offset and connect the connector based on node', (done: Function) => {
            diagram.nodes[1].offsetX = 600;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            expect(diagram.nodes[1].offsetX === 600).toBe(true);
            done();
        });
    });

});