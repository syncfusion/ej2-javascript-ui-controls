import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BpmnShapeModel } from '../../../src/diagram/objects/node-model';
import { ShapeStyleModel } from '../../../src/diagram/core/appearance-model';
import { ShadowModel, RadialGradientModel, StopModel } from '../../../src/diagram/core/appearance-model';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { PathElement } from '../../../src/diagram/index';
import { MouseEvents } from './../interaction/mouseevents.spec';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
import { Container } from '../../../src/diagram/core/containers/container';


Diagram.Inject(BpmnDiagrams);

/**
 * BPMN Text Annotations
 */
describe('Diagram Control', () => {
    let mouseEvents: MouseEvents = new MouseEvents();

    describe('BPMN Text Annotations', () => {
        let diagram: Diagram;
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shadow1: ShadowModel = { angle: 135 };

            let node: NodeModel[] = [
                {
                    id: 'node', width: 100, height: 100, offsetX: 300, offsetY: 450,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 } as ShapeStyleModel,
                    shadow: shadow1, constraints: NodeConstraints.Default | NodeConstraints.Shadow,
                    shape: {
                        type: 'Bpmn', shape: 'DataObject',
                        dataObject: { collection: false, type: 'Input' },
                        annotations: [
                            { id: 'annot1', angle: 30, length: 150, text: 'textAnnotation1' },
                            { id: 'annot2', angle: 90, width: 100, height: 100, length: 150, text: 'textAnnotation2' },
                            { id: 'annot3', angle: 180, width: 100, height: 100, length: 150, text: 'textAnnotation3' },
                            { id: 'annot4', angle: 280, width: 100, height: 100, length: 150, text: 'textAnnotation4' }
                        ]
                    } as BpmnShapeModel,
                },
                {
                    id: 'bpmn2', width: 100, height: 100, offsetX: 750, offsetY: 240,
                    shape: {
                        type: 'Bpmn', shape: 'DataObject',
                        dataObject: { collection: false, type: 'Input' },
                        annotations: [{ id: 'left', angle: 170, length: 150, text: 'Left', },
                        { id: 'right', angle: 30, length: 150, text: 'Right', },
                        { id: 'top', angle: 270, length: 150, text: 'Top' },
                        { id: 'bottom', angle: 120, length: 150, text: 'Bottom' }
                        ]
                    } as BpmnShapeModel,
                }, {
                    id: 'annot_uni', width: 100, height: 100,
                    shape: { type: 'Bpmn', shape: 'TextAnnotation', annotation: { angle: 280, length: 150, text: 'textAnnotation node' } }
                }
            ];
            diagram = new Diagram({
                width: 900, height: 550, nodes: node
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        //check the values at rendering
        it('Checking annotation dragging of the second node', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 565, 290);
            mouseEvents.dragAndDropEvent(diagramCanvas, 565, 290, 565, 200);
            let wrapper: Container = (diagram.nodes[1] as NodeModel).wrapper.children[0] as Container;
            expect((Math.round(wrapper.children[4].offsetX) === 552 &&
                (Math.round(wrapper.children[4].offsetY) <= 185 && Math.round(wrapper.children[4].offsetY) >= 183))).toBe(true);

            done();
        })
        it('Checking annotation dragging in the same direction', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: HTMLElement = document.getElementById('node');
            mouseEvents.clickEvent(diagramCanvas, 308, 258);
            mouseEvents.dragAndDropEvent(diagramCanvas, 308, 258, 240, 200);
            let wrapper: Container = (diagram.nodes[0] as NodeModel).wrapper.children[0] as Container;
            expect((Math.round(wrapper.children[10].offsetX) === 272 ||
                Math.round(wrapper.children[10].offsetX) === 273) &&
                (Math.round(wrapper.children[10].offsetY) === 192 || Math.round(wrapper.children[10].offsetY) === 191)).toBe(true);
            done();
        });
        it('Checking annotation dragging in the oppsite direction', (done: Function) => {

            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 250, 200);
            mouseEvents.dragAndDropEvent(diagramCanvas, 250, 200, 250, 550);
            let wrapper: Container = (diagram.nodes[0] as NodeModel).wrapper.children[0] as Container;

            expect((Math.round(wrapper.children[10].offsetX) === 272 ||
                Math.round(wrapper.children[10].offsetX) === 273) &&
                (Math.round(wrapper.children[10].offsetY) === 544 ||
                    Math.round(wrapper.children[10].offsetY) === 549)).toBe(true);
            expect(((wrapper.children[10] as Canvas).children[0] as PathElement).data).toBe('M20,10 L20,0 L0,0 L0,10');
            done();
        });
        it('Checking dragging a BPMN Shape with annotations', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 450);
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 450, 250, 200);
            expect((Math.round(diagram.nodes[0].offsetX) === 250 &&
                (Math.round(diagram.nodes[0].offsetY) === 200) || Math.round(diagram.nodes[0].offsetY) === 210)).toBe(true);
            let wrapper: Container = (diagram.nodes[0] as NodeModel).wrapper.children[0] as Container;
            expect((Math.round(wrapper.children[10].offsetX) === 211 || Math.round(wrapper.children[10].offsetX) === 214 || Math.round(wrapper.children[10].offsetX) === 212) &&
                (Math.round(wrapper.children[10].offsetY) === 408 ||
                    Math.round(wrapper.children[10].offsetY) === 409 || Math.round(wrapper.children[10].offsetY) === 394)).toBe(true);
            done();
        });

        it('Clicking at connector to select annotation', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.nameTable['node_textannotation_annot4']])
            expect(diagram.selectedItems.nodes.length == 1
                && diagram.selectedItems.nodes[0].id == 'node_textannotation_annot4').toBe(true);
            //copy paste should not work
            mouseEvents.keyDownEvent(diagramCanvas, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Z', true);
            expect(((diagram.nodes[0] as BpmnShapeModel).shape as BpmnShapeModel).annotations.length).toBe(4);
            mouseEvents.clickEvent(diagramCanvas, 225 + 8, 300);
            done();
        });


        it('Deleting an annotation', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            expect(((diagram.nodes[0] as BpmnShapeModel).shape as BpmnShapeModel).annotations.length).toBe(3);
            expect(((diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas).children.length).toBe(9);
            done();
        });

        it('Copy paste the selected node', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 250, 250);
            mouseEvents.keyDownEvent(diagramCanvas, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);

            expect(diagram.nodes.length).toBe(4);
            expect(((diagram.nodes[3] as NodeModel).wrapper.children[0] as Canvas).children.length).toBe(9);
            done();
        });

        it('Deleting a node with annotations', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 220, 220);
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            expect(diagram.nodes.length).toBe(3);
            done();
        });

        it('Adding an annotation', (done: Function) => {

            expect(((diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas).children.length).toBe(9);
            diagram.addTextAnnotation({ id: 'newAnnotation', text: 'New Annotation', length: 100, angle: 270 }, diagram.nodes[0]);
            expect(((diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas).children.length).toBe(11);
            done();
        });

        it('EDiting an annotation', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let wrapper: Container = (diagram.nodes[1] as NodeModel).wrapper.children[0] as Container;
            mouseEvents.clickEvent(diagramCanvas, wrapper.children[10].offsetX, wrapper.children[10].offsetY);
            mouseEvents.dblclickEvent(diagramCanvas, wrapper.children[10].offsetX, wrapper.children[10].offsetY);
            let textBox = document.getElementById(diagram.element.id + '_editBox');
            mouseEvents.inputEvent(textBox);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'Label';
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            expect(((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).annotations[3].text == 'Label').toBe(true);
            done();
        });
        it('checking text annotation node', (done: Function) => {
            diagram.select([diagram.nameTable['annot_uni']]);
            expect((diagram.selectedItems.nodes[0].shape as BpmnShapeModel).annotation.text === 'textAnnotation node').toBe(true);
            done();
        });
        it('drag a connector and drop another node', function (done) {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            var connector = diagram.nameTable['node_annot3_connector']
            mouseEvents.clickEvent(diagramCanvas, connector.sourcePoint.x, connector.sourcePoint.y);
            mouseEvents.dragAndDropEvent(diagramCanvas, connector.sourcePoint.x, connector.sourcePoint.y, 720, 220)
            mouseEvents.keyDownEvent(diagramCanvas, 'Z', true);
            expect(((diagram.nodes[0] as BpmnShapeModel).shape as BpmnShapeModel).annotations.length).toBe(4);
            done();
        });
        it('drag a connector and drop on diagram', function (done) {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            var connector = diagram.nameTable['node_annot3_connector']
            mouseEvents.clickEvent(diagramCanvas, connector.sourcePoint.x, connector.sourcePoint.y);
            mouseEvents.dragAndDropEvent(diagramCanvas, connector.sourcePoint.x, connector.sourcePoint.y, 100, 50)
            expect(((diagram.nodes[0] as BpmnShapeModel).shape as BpmnShapeModel).annotations.length).toBe(4);
            done();
        });
        it('checking text annotation node copy paste', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.nameTable['annot_uni']]);
            mouseEvents.keyDownEvent(diagramCanvas, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            expect((diagram.selectedItems.nodes[0].shape as BpmnShapeModel).annotation.text === 'textAnnotation node').toBe(true);
            done();
        });
    });
    describe('BPMN Text Annotations  undo redo', () => {

        let diagram: Diagram;
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shadow1: ShadowModel = { angle: 135 };

            let node: NodeModel[] = [
                {
                    id: 'node', width: 100, height: 100, offsetX: 300, offsetY: 450,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 } as ShapeStyleModel,
                    shadow: shadow1, constraints: NodeConstraints.Default | NodeConstraints.Shadow,
                    shape: {
                        type: 'Bpmn', shape: 'DataObject',
                        dataObject: { collection: false, type: 'Input' },
                        annotations: [
                            { id: 'annot1', angle: 30, length: 150, text: 'textAnnotation1' },
                            { id: 'annot2', angle: 90, width: 100, height: 100, length: 150, text: 'textAnnotation2' },
                            { id: 'annot3', angle: 180, width: 100, height: 100, length: 150, text: 'textAnnotation3' },
                            { id: 'annot4', angle: 280, width: 100, height: 100, length: 150, text: 'textAnnotation4' }
                        ]
                    } as BpmnShapeModel,
                },
                {
                    id: 'bpmn2', width: 100, height: 100, offsetX: 750, offsetY: 240,
                    shape: {
                        type: 'Bpmn', shape: 'DataObject',
                        dataObject: { collection: false, type: 'Input' },
                        annotations: [{ id: 'left', angle: 170, length: 150, text: 'Left', },
                        { id: 'right', angle: 30, length: 150, text: 'Right', },
                        { id: 'top', angle: 270, length: 150, text: 'Top' },
                        { id: 'bottom', angle: 120, length: 150, text: 'Bottom' }
                        ]
                    } as BpmnShapeModel,
                }, {
                    id: 'annot_uni', width: 100, height: 100,
                    shape: { type: 'Bpmn', shape: 'TextAnnotation', annotation: { angle: 280, length: 150, text: 'textAnnotation node' } }
                }
            ];
            diagram = new Diagram({
                width: 900, height: 550, nodes: node
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        //check the values at rendering
        it('Checking annotation dragging of the second node undo redo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 565, 290);
            mouseEvents.dragAndDropEvent(diagramCanvas, 565, 290, 565, 200);
            let wrapper: Container = (diagram.nodes[1] as NodeModel).wrapper.children[0] as Container;
            expect((Math.round(wrapper.children[4].offsetX) === 552 &&
                (Math.round(wrapper.children[4].offsetY) <= 185 && Math.round(wrapper.children[4].offsetY) >= 183))).toBe(true);
            diagram.undo();
            diagram.redo();
            done();
        })
    })

});