import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Node } from '../../../src/diagram/objects/node';
import { NodeModel, BpmnShapeModel } from '../../../src/diagram/objects/node-model';
import { ShapeStyleModel, ShadowModel } from '../../../src/diagram/core/appearance-model';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { Canvas, Connector, BpmnShape } from '../../../src/diagram/index';
import { MouseEvents } from '../interaction/mouseevents.spec';
Diagram.Inject(BpmnDiagrams);

/**
 * BPMN shapes -  Message, DataSource, Group
 */
describe('Diagram Control', () => {

    describe('BPMN Transaction Subprocess', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shadow: ShadowModel = { distance: 10, opacity: 0.5 };
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { type: 'Transaction' }
                    }
                }
            };

            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('BPMN shapes -  Transaction Rendering', (done: Function) => {
            let node: NodeModel = diagram.nodes[0];
            expect(((node.wrapper.children[0] as Canvas).children[0] as Canvas).children.length).toBe(7);
            expect((((node.wrapper.children[0] as Canvas).children[0] as Canvas).children[2] as Canvas).children.length).toBe(3);
            done();
        });

        it('Creating connections to transaction sub-process', (done: Function) => {
            diagram.add({
                id: 'success', offsetX: 300, offsetY: 200, width: 100, height: 100,
                shape: { type: 'Bpmn', shape: 'Event', event: { trigger: 'Message', event: 'Intermediate' } }
            });

            diagram.add({ id: 'connector', sourceID: 'node', targetID: 'success' });

            let connector = diagram.nameTable['connector'];

            expect((connector as Connector).sourceWrapper.id == 'node_boundary').toBe(true);

            connector.sourcePortID = 'success';
            diagram.dataBind();
            expect((connector as Connector).sourceWrapper.id == 'node_success_0_event').toBe(true);
            done();
        });

        it('Connecting to transaction events interactively', (done: Function) => {

            let events: MouseEvents = new MouseEvents();
            diagram.add({ id: 'connector1', sourcePoint: { x: 300, y: 300 }, targetPoint: { x: 500, y: 500 } });

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            events.clickEvent(diagramCanvas, 308, 308);

            events.mouseDownEvent(diagramCanvas, 300, 300);

            events.mouseMoveEvent(diagramCanvas, 300, 250);

            events.mouseMoveEvent(diagramCanvas, 130, 150);

            events.mouseUpEvent(diagramCanvas, 130, 150);

            let connector = diagram.nameTable['connector1'];

            expect(connector.sourcePortID == 'cancel').toBe(true);

            expect((connector as Connector).sourceWrapper.id == 'node_cancel_0_event').toBe(true);
            done();
        });

        it('Creating the visibility of the sub-event', (done: Function) => {

            diagram.add({ id: 'connector3', sourceID: 'node', sourcePortID: 'failure' });
            (diagram.nodes[0].shape as BpmnShape).activity.subProcess.transaction.success.visible = false;
            (diagram.nodes[0].shape as BpmnShape).activity.subProcess.transaction.failure.visible = false;
            (diagram.nodes[0].shape as BpmnShape).activity.subProcess.transaction.cancel.visible = false;
            diagram.nodes[0].style.strokeColor = 'red';
            diagram.nodes[0].style.opacity = 0.5;
            diagram.dataBind();
            let connector: Connector = diagram.connectors[0] as Connector;
            expect(connector.sourceWrapper.id == 'node_boundary').toBe(true);
            connector = diagram.connectors[1] as Connector;
            expect(connector.sourceWrapper.id == 'node_boundary').toBe(true);
            done();
        });

        it('Changing the position of the sub-event', (done: Function) => {
            let node = diagram.nodes[0];
            (diagram.nodes[0].shape as BpmnShape).activity.subProcess.transaction.success.offset = { x: 0, y: 0.5 };

            diagram.dataBind();

            expect((((node.wrapper.children[0] as Canvas).children[0] as Canvas).children[2] as Canvas).children[0].offsetX).toBe(50);
            expect((((node.wrapper.children[0] as Canvas).children[0] as Canvas).children[2] as Canvas).children[0].offsetY).toBe(100);
            done();
        });

    });
});