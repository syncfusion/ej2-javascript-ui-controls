/**
 * Annotation Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Path } from '../../../src/diagram/objects/node';
import { ShapeAnnotationModel } from '../../../src/diagram/objects/annotation-model';
import { NodeModel, PathModel, } from '../../../src/diagram/objects/node-model';
import { NodeConstraints, AnnotationConstraints } from '../../../src/diagram/enum/enum';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';

describe('Diagram Control', () => {
    describe('Annotation property change', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'nodeannot', width: 80, height: 100, offsetX: 140, offsetY: 80, shape: {
                    type: 'Path',
                    data: 'M127.2842,291.4492L95.0322,291.4492L81.1582,256.3152L141.1582,256.3152L127.2842,291.4492z'
                } as PathModel,
                annotations: [{
                    visibility: false,
                    content: 'text1', id: 'text1', offset: { x: 0, y: 0 }, width: 40, height: 30,
                } as ShapeAnnotationModel]
            };
            let node1: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: {
                    type: 'Path',
                    data: 'M127.2842,291.4492L95.0322,291.4492L81.1582,256.3152L141.1582,256.3152L127.2842,291.4492z'
                } as PathModel,
                annotations: [{
                    content: 'text1', id: 'text1', width: 80, height: 100, offset: { x: 0, y: 0 }
                } as ShapeAnnotationModel]
            };
            let node2: NodeModel = {
                id: 'node1annot', width: 100, height: 100, offsetX: 340, offsetY: 80,
                shape: {
                    type: 'Path',
                    data: 'M127.2842,291.4492L95.0322,291.4492L81.1582,256.3152L141.1582,256.3152L127.2842,291.4492z'
                } as PathModel,
                annotations: [{
                    content: 'text1', id: 'text1', offset: { x: 0, y: 0 }, width: 80, height: 80,
                } as ShapeAnnotationModel]
            };
            let node3: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: {
                    type: 'Path',
                    data: 'M127.2842,291.4492L95.0322,291.4492L81.1582,256.3152L141.1582,256.3152L127.2842,291.4492z'
                } as PathModel,
                annotations: [{
                    content: 'text1', id: 'text1', offset: { x: 0, y: 0 }, width: 80, height: 80,
                } as ShapeAnnotationModel]
            };

            let node4: NodeModel = {
                id: 'node11', width: 100, height: 100, offsetX: 500, offsetY: 100,
                constraints: NodeConstraints.Default | NodeConstraints.ReadOnly,
                annotations: [{
                    id: 'label1',
                    content: 'Default Shape1', style: { color: 'red' },
                    constraints: ~AnnotationConstraints.InheritReadOnly
                },
                {
                    id: 'label11',
                    content: 'Default Shape2', style: { color: 'red' }, offset: { y: 1 }
                }]
            };

            diagram = new Diagram({
                width: 800, height: 400, nodes: [node, node1, node2, node3, node4]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking annotation width and height change', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].width = 100;
            (diagram.nodes[0] as NodeModel).annotations[0].height = 60;
            diagram.dataBind();
            let label: ShapeAnnotationModel = (diagram.nodes[0] as NodeModel).annotations[0];
            expect(label.visibility == false).toBe(true);
            (diagram.nodes[0] as NodeModel).annotations[0].visibility = true,
                diagram.dataBind();
            expect(label.width == 100 && label.height == 60 && label.visibility == true).toBe(true);
            done();
        });
        it('Checking annotation content change', (done: Function) => {
            (diagram.nodes[1] as NodeModel).annotations[0].content = 'changed text';
            diagram.dataBind();
            let label: ShapeAnnotationModel = (diagram.nodes[1] as NodeModel).annotations[0];
            expect(label.content == 'changed text').toBe(true);
            done();
        });
        it('Checking annotation Alignment change', (done: Function) => {
            (diagram.nodes[2] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            (diagram.nodes[2] as NodeModel).annotations[0].verticalAlignment = 'Bottom';
            diagram.dataBind();
            let label: ShapeAnnotationModel = (diagram.nodes[2] as NodeModel).annotations[0];
            expect((label.horizontalAlignment == 'Right') && (label.verticalAlignment == 'Bottom')).toBe(true);
            done();
        });
        it('Checking annotation offset change', (done: Function) => {
            (diagram.nodes[1] as NodeModel).annotations[0].offset.x = 1;
            (diagram.nodes[1] as NodeModel).annotations[0].offset.y = 1;
            diagram.dataBind();
            let label: ShapeAnnotationModel = (diagram.nodes[1] as NodeModel).annotations[0];
            expect((label.offset.x == 1) && (label.offset.y == 1)).toBe(true);
            done();
        });
        it('Checking annotation style change', (done: Function) => {
            (diagram.nodes[3] as NodeModel).annotations[0].style.opacity = 4;
            (diagram.nodes[3] as NodeModel).annotations[0].style.strokeColor = 'blue';
            (diagram.nodes[3] as NodeModel).annotations[0].style.strokeWidth = 3;
            (diagram.nodes[3] as NodeModel).annotations[0].style.strokeDashArray = '5,5';
            (diagram.nodes[3] as NodeModel).annotations[0].style.bold = false;
            (diagram.nodes[3] as NodeModel).annotations[0].style.fontSize = 25;
            (diagram.nodes[3] as NodeModel).annotations[0].style.color = 'red';
            (diagram.nodes[3] as NodeModel).annotations[0].style.fill = 'white';
            (diagram.nodes[3] as NodeModel).annotations[0].style.italic = true;
            (diagram.nodes[3] as NodeModel).annotations[0].style.fontFamily = 'Fantasy';
            (diagram.nodes[3] as NodeModel).annotations[0].style.whiteSpace = 'CollapseSpace';
            (diagram.nodes[3] as NodeModel).annotations[0].style.textWrapping = 'WrapWithOverflow';
            (diagram.nodes[3] as NodeModel).annotations[0].style.textAlign = 'Left';
            (diagram.nodes[3] as NodeModel).annotations[0].style.textDecoration = 'Overline';
            diagram.dataBind();
            let label: ShapeAnnotationModel = (diagram.nodes[3] as NodeModel).annotations[0];
            expect((label.style.textWrapping == 'WrapWithOverflow') && (label.style.fontSize == 25)).toBe(true);
            done();
        });
        it('Checking annotation margin change', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].margin.top = 20;
            (diagram.nodes[0] as NodeModel).annotations[0].margin.left = 25;
            (diagram.nodes[0] as NodeModel).annotations[0].margin.right = 20;
            (diagram.nodes[0] as NodeModel).annotations[0].margin.bottom = 25;
            diagram.dataBind();
            let label: ShapeAnnotationModel = (diagram.nodes[0] as NodeModel).annotations[0];
            expect((label.margin.top == 20) && (label.margin.left == 25)).toBe(true);
            done();
        });
        it('Checking without label', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 500, 108);
            mouseEvents.dblclickEvent(diagramCanvas, 500, 108);
            let element = document.getElementById('diagram_editTextBoxDiv');
            mouseEvents.clickEvent(diagramCanvas, 500, 158);
            mouseEvents.dblclickEvent(diagramCanvas, 500, 158);
            let element1 = document.getElementById('diagram_editTextBoxDiv');
            (diagram.nodes[4] as NodeModel).annotations[0].constraints = AnnotationConstraints.InheritReadOnly;
            diagram.dataBind();
            mouseEvents.clickEvent(diagramCanvas, 500, 108);
            mouseEvents.dblclickEvent(diagramCanvas, 500, 108);
            (diagram.nodes[4] as NodeModel).constraints = NodeConstraints.Default;
            (diagram.nodes[4] as NodeModel).annotations[0].constraints = AnnotationConstraints.ReadOnly;
            diagram.dataBind();
            mouseEvents.clickEvent(diagramCanvas, 500, 108);
            mouseEvents.dblclickEvent(diagramCanvas, 500, 108);
            expect(element && !element1).toBe(true);
            done();
        });
    });
});