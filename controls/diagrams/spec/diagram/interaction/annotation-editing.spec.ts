/**
 * Annotation Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, PathModel, } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { MouseEvents } from '../interaction/mouseevents.spec';

describe('Diagram Control', () => {
    describe('Annotation Editing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'textediting' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: "node1", width: 90, height: 40, annotations: [{ content: 'Start \n \n \n ssss', style: { bold: true } }],
                offsetX: 400, offsetY: 30, shape: { type: 'Flow', shape: 'Terminator' }
            };
            let node2: NodeModel = {
                id: "node2", offsetX: 400, offsetY: 100, width: 90, height: 40, annotations: [{ content: 'Process', style: { color: 'green', italic: true, bold: true } }],
                shape: { type: 'Flow', shape: 'Process' }
            };
            let node3: NodeModel = {
                id: "node3", offsetX: 400, offsetY: 180, minWidth: 90,// height: 40,
                 annotations: [
                    { content: 'Coding', style: { bold: true } },
                    { content: 'label2', offset: { x: 0, y: 0 }, style: { fontSize: 20 } }],
                shape: { type: 'Flow', shape: 'Process' }
            };
            let node4: NodeModel = {
                id: "node4", width: 90, height: 40, offsetX: 400, offsetY: 260,
                annotations: [{ content: 'Testing', style: { bold: true } }], shape: { type: 'Flow', shape: 'Process' },
            };
            let node5: NodeModel = {
                id: "node5", width: 90, height: 40, offsetX: 400, offsetY: 340,
                annotations: [{ content: 'Errors?' }], shape: { type: 'Flow', shape: 'Decision' },
            };
            let node6: NodeModel = {
                id: "node6", width: 90, height: 40, offsetX: 400, offsetY: 450,
                annotations: [{ content: 'VeryLongAnnotation' }], shape: { type: 'Flow', shape: 'Terminator' },
            };
            let node7: NodeModel = {
                id: "node7", width: 110, height: 60, offsetX: 220, offsetY: 180,
                annotations: [{ content: 'Design \n Error?\n\n', style: { bold: true } }], shape: { type: 'Flow', shape: 'Decision' }
            };


            let connector1: ConnectorModel = { id: "connector1", sourceID: node1.id, targetID: node2.id };

            let connector2: ConnectorModel = { id: "connector2", sourceID: node2.id, targetID: node3.id };
            let connector3: ConnectorModel = { id: "connector3", sourceID: node3.id, targetID: node4.id };
            let connector4: ConnectorModel = { id: "connector4", sourceID: node4.id, targetID: node5.id };
            let connector5: ConnectorModel = {
                id: "connector5", sourceID: node5.id, targetID: node6.id,
                annotations: [{ content: "No", style: { fill: 'white' } }]
            };
            let connector6: ConnectorModel = {
                id: "connector6", sourceID: node5.id, targetID: node7.id, type: "Orthogonal",
                annotations: [{ content: "Yes", style: { fill: "white" } }]
            };
            let connector7: ConnectorModel = {
                id: "connector7", sourceID: node7.id, targetID: node3.id, type: "Orthogonal",
                annotations: [{ content: "No", style: { fill: "white" } }]
            };
            let connector8: ConnectorModel = {
                id: "connector8", sourceID: node7.id, targetID: node2.id, type: "Orthogonal",
                annotations: [{ content: "Yes", style: { fill: "white" } }]
            };

            diagram = new Diagram({
                width: 800, height: 500, nodes: [node1, node2, node3, node4, node5, node6, node7],
                connectors: [connector1, connector2, connector3, connector4, connector5, connector6, connector7, connector8]
            });
            diagram.appendTo('#textediting');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking textediting for node when text box change', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 400, 100);
            expect(diagram.selectedItems.nodes[0].annotations[0].content == 'Process').toBe(true);
            diagram.startTextEdit(diagram.selectedItems.nodes[0], diagram.selectedItems.nodes[0].annotations[0].id);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'editText1';
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            expect((diagram.nodes[1] as NodeModel).annotations[0].content == 'editText1').toBe(true);
            done();
        });
        it('Checking textediting for connector when text box change', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = (diagram.nodes[6] as NodeModel);
            let annotationBounds = diagram.getWrapper(node.wrapper, node.annotations[0].id);
            mouseEvents.clickEvent(diagramCanvas, annotationBounds.bounds.center.x, annotationBounds.bounds.center.y);
            mouseEvents.dblclickEvent(diagramCanvas, annotationBounds.bounds.center.x + 5, annotationBounds.bounds.center.y);
            let textBox = document.getElementById(diagram.element.id + '_editBox');
            mouseEvents.inputEvent(textBox);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'Label';
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            expect((diagram.nodes[6] as NodeModel).annotations[0].content == 'Label').toBe(true);
            done();
        });
        it('Checking textediting for connector when text box change', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = (diagram.nodes[5] as NodeModel);
            let annotationBounds = diagram.getWrapper(node.wrapper, node.annotations[0].id);
            mouseEvents.clickEvent(diagramCanvas, annotationBounds.bounds.center.x, annotationBounds.bounds.center.y);
            mouseEvents.dblclickEvent(diagramCanvas, annotationBounds.bounds.center.x + 5, annotationBounds.bounds.center.y + 5);
            let textBox = document.getElementById(diagram.element.id + '_editBox');
            mouseEvents.inputEvent(textBox);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'endddddEdit';
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            expect((diagram.nodes[5] as NodeModel).annotations[0].content == 'endddddEdit').toBe(true);
            done();
        });
        it('Checking textediting for connector when text box change', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let connector: ConnectorModel = (diagram.connectors[6] as ConnectorModel);
            let annotationBounds = diagram.getWrapper(connector.wrapper, connector.annotations[0].id);
            mouseEvents.clickEvent(diagramCanvas, annotationBounds.bounds.center.x, annotationBounds.bounds.center.y);
            expect(diagram.selectedItems.connectors[0].annotations[0].content == 'No').toBe(true);
            diagram.startTextEdit(diagram.selectedItems.connectors[0], diagram.selectedItems.connectors[0].annotations[0].id);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'editLabel';
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            expect((diagram.connectors[6] as ConnectorModel).annotations[0].content == 'editLabel').toBe(true);
            done();
        });
        it('Checking textediting when text box change using keydown', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 400, 180);
            expect(diagram.selectedItems.nodes[0].annotations[0].content == 'Coding').toBe(true);
            diagram.startTextEdit();
            let textBox = document.getElementById(diagram.element.id + '_editBox')
            mouseEvents.inputEvent(textBox);
            mouseEvents.keyDownEvent(textBox, 'l');
            mouseEvents.keyDownEvent(textBox, 'a');
            mouseEvents.keyDownEvent(textBox, 'b');
            mouseEvents.keyDownEvent(textBox, 'e');
            mouseEvents.keyDownEvent(textBox, 'l');
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'labelewidthgreaterthanwidth';
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            expect((diagram.nodes[2] as NodeModel).annotations[0].content == 'labelewidthgreaterthanwidth' && (Math.ceil(diagram.nodes[2].wrapper.actualSize.width) === 163) || diagram.nodes[2].wrapper.actualSize.width == 166.015625).toBe(true);
            done();
        });
        it('Checking textediting for connector when text box change using keydown', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content')
            let connector: ConnectorModel = (diagram.connectors[7] as ConnectorModel);
            expect((diagram.connectors[7] as ConnectorModel).annotations[0].content == 'Yes').toBe(true);
            let annotationBounds = diagram.getWrapper(connector.wrapper, connector.annotations[0].id);
            mouseEvents.clickEvent(diagramCanvas, annotationBounds.bounds.center.x, annotationBounds.bounds.center.y);
            mouseEvents.dblclickEvent(diagramCanvas, annotationBounds.bounds.center.x, annotationBounds.bounds.center.y);
            let textBox = document.getElementById(diagram.element.id + '_editBox');

            mouseEvents.inputEvent(textBox);
            mouseEvents.keyDownEvent(textBox, 'l');
            mouseEvents.keyDownEvent(textBox, 'a');
            mouseEvents.keyDownEvent(textBox, 'b');
            mouseEvents.keyDownEvent(textBox, 'e');
            mouseEvents.keyDownEvent(textBox, 'l');
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'label';
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            expect((diagram.connectors[7] as ConnectorModel).annotations[0].content == 'label').toBe(true);
            done();
        });
        it('Checking textediting for node when more than one annotation', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 400, 180);
            let diagramBounds = diagramCanvas.getBoundingClientRect();
            let targetNode = (diagram.nodes[2] as NodeModel);
            expect((diagram.nodes[2] as NodeModel).annotations[1].content == 'label2').toBe(true);
            let targetAnnotationContainer = diagram.getWrapper(targetNode.wrapper, targetNode.annotations[1].id);
            let targetAnnotationBounds = targetAnnotationContainer.bounds.middleLeft;
            mouseEvents.mouseMoveEvent(diagramCanvas, (targetAnnotationBounds.x + diagramBounds.left + 5), (targetAnnotationBounds.y + diagramBounds.top + 5));
            diagram.doubleClick = (arg) => {
                if (arg.count === 2) {
                    done();
                }
            };
            diagram.textEdit = (arg) => {
                expect(arg.newValue !== arg.oldValue).toBe(true);
            };

            mouseEvents.dblclickEvent(diagramCanvas, (targetAnnotationBounds.x + diagramBounds.left + 5), (targetAnnotationBounds.y + diagramBounds.top + 5));
            let textBox = document.getElementById(diagram.element.id + '_editBox');
            mouseEvents.inputEvent(textBox);
            mouseEvents.keyDownEvent(textBox, 'T');
            mouseEvents.keyDownEvent(textBox, 'e');
            mouseEvents.keyDownEvent(textBox, 'x');
            mouseEvents.keyDownEvent(textBox, 't');
            mouseEvents.keyDownEvent(textBox, 'Enter');
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'Text';
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            expect((diagram.nodes[2] as NodeModel).annotations[1].content == 'Text').toBe(true);
            done();

        });
        it('Checking textediting - code coverage', (done: Function) => {
            diagram.clearSelection();
            diagram.selectedItems.nodes = [];
            diagram.selectedItems.connectors = [];
            diagram.startTextEdit();
            done();
        });

    });
});