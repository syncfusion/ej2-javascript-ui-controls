import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { TextElement } from '../../../src/diagram/core/elements/text-element';
import { ShapeAnnotationModel } from '../../../src';
import { getDiagramElement } from '../../../src/diagram/utility/dom-util';
import { MouseEvents } from '../interaction/mouseevents.spec';

/**
 * Annotation - changing offsets
 */
describe('Diagram Control', () => {

    describe('Annotations with zero offsets', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pathData: string = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
            '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram50' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    content: 'label data content for path node',
                    height: 50,
                    width: 50,
                    offset: { x: 0, y: 0 },
                    style: { italic: true, whiteSpace: 'CollapseAll' }
                }]
            };

            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100,
                offsetX: 300,
                offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    content: 'label data content for path node',
                    height: 50,
                    width: 50,
                    offset: { x: 0, y: 0.5 },
                    style: { italic: true, whiteSpace: 'CollapseSpace' }
                }]
            };

            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100,
                offsetX: 500,
                offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    content: 'label data content for path node',
                    height: 50,
                    width: 50,
                    offset: { x: 0, y: 1 },
                    style: { italic: true, whiteSpace: 'PreserveAll' }
                }]
            };


            diagram = new Diagram({ mode: 'SVG', width: 800, height: 800, nodes: [node, node2, node3] });
            diagram.appendTo('#diagram50');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking annotation offsets as 0 in SVG rendering Mode', (done: Function) => {
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 50
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 50 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 250 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 450 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 150).toBe(true);
            done();
        });

        it('Checking annotation offset as 1 in SVG rendering Mode', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].offset.x = 1;
            (diagram.nodes[1] as NodeModel).annotations[0].offset.x = 1;
            (diagram.nodes[2] as NodeModel).annotations[0].offset.x = 1;
            diagram.dataBind();
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 150
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 50 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 350 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 550 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 150).toBe(true);
            done();
        });
    });


    describe('Annotations with zero offsets ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pathData: string = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
            '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram50' });
            document.body.appendChild(ele);
            let element1: TextElement = new TextElement();
            element1.content = 'Text element with width/100 height/100';
            element1.style.color = 'red';
            element1.style.italic = true;
            element1.style.fontSize = 12;
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.style.fill = 'transparent';
            element1.width = 100;
            element1.height = 100;
            element1.style.bold = true;
            element1.style.fontFamily = 'Arial';
            element1.style.textAlign = 'Center';

            let element2: TextElement = new TextElement();
            element2.content = 'Text element without width and height';
            element2.style.fontSize = 12;
            element2.style.fill = 'transparent';
            element2.offsetX = 350;
            element2.offsetY = 250;
            element2.style.textAlign = 'Center';
            element2.style.textWrapping = 'WrapWithOverflow';

            let element3: TextElement = new TextElement();
            element3.content = 'Text element align with left side';
            element3.style.fill = 'transparent';
            element3.style.fontSize = 12;
            element3.offsetX = 350;
            element3.offsetY = 400;
            element3.width = 100;
            element3.height = 100;
            element3.style.textAlign = 'Left';
            element3.style.textWrapping = 'Wrap';

            let element4: TextElement = new TextElement();
            element4.content = 'Text element align with center';
            element4.style.fontSize = 12;
            element4.style.fill = 'transparent';
            element4.offsetX = 400;
            element4.offsetY = 550;
            element4.width = 100;
            element4.height = 100;
            element4.style.textAlign = 'Center';
            element4.style.textWrapping = 'NoWrap';

            let element5: TextElement = new TextElement();
            element5.content = 'Text element align with right side';
            element5.style.fontSize = 12;
            element5.style.fill = 'transparent';
            element5.offsetX = 400;
            element5.offsetY = 700;
            element5.width = 100;
            element5.height = 100;
            element5.style.textAlign = 'Right';

            let element6: TextElement = new TextElement();
            element6.offsetX = 400;
            element6.offsetY = 700;
            element6.style.bold = true;
            element6.style.italic = true;

            diagram = new Diagram({
                mode: 'SVG',
                width: '1000px', height: '1000px', basicElements: [element1, element2, element3, element4,
                    element5, element6]
            });
            diagram.appendTo('#diagram50');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking annotation offset as 1 in SVG rendering Mode', (done: Function) => {
            expect((diagram.basicElements[0] as TextElement).offsetX == 400 &&
                (diagram.basicElements[0] as TextElement).offsetY == 100 &&
                (diagram.basicElements[1] as TextElement).offsetX == 350 &&
                (diagram.basicElements[1] as TextElement).offsetY == 250 &&
                (diagram.basicElements[2] as TextElement).offsetX == 350 &&
                (diagram.basicElements[2] as TextElement).offsetY == 400 &&
                (diagram.basicElements[3] as TextElement).offsetX == 400 &&
                (diagram.basicElements[3] as TextElement).offsetY == 550
            ).toBe(true);
            done();
        });
    });

    describe('Remove labels API ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram50' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                mode: 'SVG',
                width: '1000px', height: '1000px',
                nodes: [
                    {
                        id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                    }
                ]
            });
            diagram.appendTo('#diagram50');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking remove labels API', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let mouseEvents: MouseEvents = new MouseEvents();
            let node: Node = diagram.nodes[0] as Node
            let label: ShapeAnnotationModel[] =
                [{ id: 'label1', content: 'Default Shape', offset: { x: 0 }, style: { color: 'rgb(255,250,235)' } },
                { id: 'label2', content: 'Default Shape', offset: { y: 0 }, style: { color: '#000000' } },
                { id: 'label3', content: 'Default Shape', offset: { x: 1 } }]
            diagram.addLabels(node, label);
            let label1 = document.getElementById('node1_label1_groupElement');
            let label2 = document.getElementById('node1_label2_groupElement');
            let label3 = document.getElementById('node1_label3_groupElement');
            expect(label1 != null && label2 != null && label3 != null).toBe(true);
            diagram.removeLabels(node, node.annotations);
            label1 = document.getElementById('node1_label1_groupElement');
            label2 = document.getElementById('node1_label2_groupElement');
            label3 = document.getElementById('node1_label3_groupElement');
            expect(label1.childNodes.length == 0 && label2.childNodes.length == 0 && label3.childNodes.length == 0).toBe(true);
            diagram.addLabels(node, label);
            diagram.startTextEdit(diagram.nodes[0], diagram.nodes[0].annotations[0].id);
            expect(document.getElementById('diagram50_editBox').style.background === 'black')
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            diagram.startTextEdit(diagram.nodes[0], diagram.nodes[0].annotations[1].id);
            expect(document.getElementById('diagram50_editBox').style.background === 'white')
            done();
        });
    });

});;