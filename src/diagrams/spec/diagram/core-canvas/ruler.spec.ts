import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
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


            diagram = new Diagram({
                mode: 'Canvas',
                width: 800, height: 800, rulerSettings: { showRulers: true },
                nodes: [node, node2, node3]
            });
            diagram.appendTo('#diagram50');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Checking ruler offset as 1 in SVG rendering Mode', (done: Function) => {
            if (diagram.rulerSettings.showRulers) {
                done();
            }
            done();
        });
    });

    describe('Testing Selection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);

            let node: NodeModel = {
                id: 'node',
                width: 50, height: 50,
                offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
            };

            diagram = new Diagram({
                mode: 'Canvas',
                width: 800, height: 800, rulerSettings: { showRulers: true },
                nodes: [node]
            });
            diagram.appendTo('#diagram12');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking node selection with ruler', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 90, 90);
            expect(diagram.selectedItems.nodes.length == 0).toBe(true);
            done();
        });

    });

    describe('Testing Selection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);

            let node: NodeModel = {
                id: 'node',
                width: 50, height: 50,
                offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
            };

            diagram = new Diagram({
                mode: 'Canvas',
                width: 800, height: 800, rulerSettings: { showRulers: false },
                nodes: [node]
            });
            diagram.appendTo('#diagram12');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking node selection without ruler', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 90, 90);
            expect(diagram.selectedItems.nodes.length == 1).toBe(true);
            done();
        });

    });
});