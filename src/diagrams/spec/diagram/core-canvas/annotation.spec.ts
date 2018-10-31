import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { ConnectorModel, PathModel, BasicShapeModel } from '../../../src';

/**
 * Annotations - Alignments
 */
describe('Diagram Control', () => {

    describe('Annotation alignment- horizontal center', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pathData: string = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,'
            + '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram53' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center',
                    height: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };

            let node2: NodeModel = {
                id: 'node2',
                width: 100, height: 100,
                offsetX: 300, offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'top center',
                    height: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Top',
                }]
            };

            let node3: NodeModel = {
                id: 'node3',
                width: 100, height: 100,
                offsetX: 500, offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'bottom center',
                    height: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Bottom',
                }]
            };

            let node4: NodeModel = {
                id: 'node4',
                width: 100, height: 100,
                offsetX: 700, offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'stretch center',
                    height: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Stretch',
                }]
            };

            diagram = new Diagram({ mode: 'Canvas', width: 800, height: 800, nodes: [node, node2, node3, node4] });
            diagram.appendTo('#diagram53');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking horizontal center annotation alignment', (done: Function) => {
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 100
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 300 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 125 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 500 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 75 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetX === 700 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetY === 100).toBe(true);
            done();
        });

        it('Checking horizontal left annotation alignment', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].horizontalAlignment = 'Left';
            (diagram.nodes[1] as NodeModel).annotations[0].horizontalAlignment = 'Left';
            (diagram.nodes[2] as NodeModel).annotations[0].horizontalAlignment = 'Left';
            (diagram.nodes[3] as NodeModel).annotations[0].horizontalAlignment = 'Left';
            diagram.dataBind();
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 150
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 350 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 125 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 550 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 75 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetX === 750 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetY === 100).toBe(true);
            done();
        });

        it('Checking horizontal right annotation alignment', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            (diagram.nodes[1] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            (diagram.nodes[2] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            (diagram.nodes[3] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            diagram.dataBind();
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 50
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 250 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 125 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 450 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 75 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetX === 650 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetY === 100).toBe(true);
            done();
        });

        it('Checking horizontal stretch annotation alignment', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].horizontalAlignment = 'Stretch';
            (diagram.nodes[1] as NodeModel).annotations[0].horizontalAlignment = 'Stretch';
            (diagram.nodes[2] as NodeModel).annotations[0].horizontalAlignment = 'Stretch';
            (diagram.nodes[3] as NodeModel).annotations[0].horizontalAlignment = 'Stretch';
            diagram.dataBind();
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 100
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 300 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 125 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 500 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 75 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetX === 700 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetY === 100).toBe(true);
            done();
        });
    });
    describe('Annotation editing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {

            ele = createElement('div', { id: 'diagramannotationEditing' });
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            diagram = new Diagram({
                mode: 'Canvas',
                width: '600px', height: '600px',
                nodes: [node]
            });
            diagram.appendTo('#diagramannotationEditing');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking without label', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.dblclickEvent(diagramCanvas, 100, 100);
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            expect((diagram.nodes[0] as NodeModel).annotations.length > 0).toBe(true);
            done();
        });

    });

});