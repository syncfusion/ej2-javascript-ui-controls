import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ShapeAnnotationModel } from '../../../src/diagram/objects/annotation-model';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
import { TextStyleModel } from '../../../src/diagram/core/appearance-model';
import { MouseEvents } from '../interaction/mouseevents.spec';

/**
 * Annotations - Changing Margin
 */
describe('Diagram Control', () => {

    describe('Annotations with margin', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let annotation: ShapeAnnotationModel;
        let node: NodeModel;
        let node2: NodeModel;
        let node3: NodeModel;
        let style: TextStyleModel = { strokeColor: 'black', opacity: 0.5, strokeWidth: 1 };
        let pathData: string = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,' +
            '194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366' +
            'L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram48' });
            document.body.appendChild(ele);

            node = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Path', data: pathData
                }
            };
            style.textWrapping = 'NoWrap';
            style.whiteSpace = 'CollapseAll';

            annotation = {
                content: 'top left margin, top left alignment, offset 0', offset: { x: 0, y: 0 },
                horizontalAlignment: 'Left', verticalAlignment: 'Top', margin: { left: 15, top: 10 },
                style: style, width: 85
            };

            node.annotations = [annotation];

            node2 = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: { type: 'Path', data: pathData }
            };
            style.textWrapping = 'Wrap';
            style.whiteSpace = 'CollapseSpace';
            annotation = {
                content: 'bottom right margin bottom right alignment, offset 1', offset: { x: 1, y: 1 },
                horizontalAlignment: 'Right', verticalAlignment: 'Bottom',
                margin: { right: 15, bottom: 15 },
                style: style
            };
            node2.annotations = [annotation];

            node3 = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shape: {
                    type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,' +
                        '194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366' +
                        'L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
                }
            };

            style.textWrapping = 'WrapWithOverflow';
            style.whiteSpace = 'PreserveAll';
            annotation = {
                content: 'top margin, offset 0, top left alignment', offset: { x: 0, y: 0 },
                horizontalAlignment: 'Left', verticalAlignment: 'Top', margin: { top: 15 },
                style: style
            };

            node3.annotations = [annotation];
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    content: 'elementpathwidthheight',
                    style: { textOverflow: 'Ellipsis', textDecoration: 'Underline' }
                },]
            };

            let node6: NodeModel = {
                id: 'Decision', width: 150, height: 60, offsetX: 550, offsetY: 60,
                shape: { type: 'Flow', shape: 'Card' },
                annotations: [{
                    id: 'label6', content: 'Decision Process for new software ideas', offset: { x: 0.5, y: 0.5 },
                    style: { whiteSpace: 'PreserveAll' } as TextStyleModel
                }]
            };

            diagram = new Diagram({ mode: 'SVG', width: '800px', height: '800px', nodes: [node, node2, node3, node4, node6] });
            diagram.appendTo('#diagram48');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking different labels margin with different values in SVG rendering Mode', (done: Function) => {
            expect(((diagram.nodes[0] as NodeModel).wrapper.children[1].actualSize.width === 79.359375
                && (diagram.nodes[0] as NodeModel).wrapper.children[1].actualSize.height === 48 &&
                (diagram.nodes[0] as NodeModel).wrapper.children[1].offsetX === 104.6796875 &&
                (diagram.nodes[0] as NodeModel).wrapper.children[1].offsetY === 84)).toBe(true);

            done();
        });
        it('annotation OverFlow issue and node readonly issue', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let nodes = diagram.nodes[3];
            let annotationBounds = diagram.getWrapper(nodes.wrapper, nodes.annotations[0].id);
            let ele = document.getElementById(nodes.wrapper.children[1].id + '_text');
            expect(ele.getAttribute('text-decoration') === 'Underline').toBe(true);
            nodes.annotations[0].style.textOverflow = 'Clip';
            nodes.annotations[0].style.textDecoration = 'LineThrough';
            diagram.dataBind();
            let ele1 = document.getElementById(nodes.wrapper.children[1].id + '_text');
            expect(ele1.getAttribute('text-decoration') === 'line-through').toBe(true);
            nodes.constraints = NodeConstraints.Default | NodeConstraints.ReadOnly,
                diagram.dataBind();
            mouseEvents.clickEvent(diagramCanvas, annotationBounds.bounds.center.x, annotationBounds.bounds.center.y);
            mouseEvents.dblclickEvent(diagramCanvas, annotationBounds.bounds.center.x + 5, annotationBounds.bounds.center.y);
            var textBox = document.getElementById('diagram48_editTextBoxDiv')
            expect(!textBox).toBe(true);
            done();
        });

        it('Checking annotation margin wrapping', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 600, 64);
            mouseEvents.dragAndDropEvent(diagramCanvas, 630, 64, 550, 60);
            let temp: HTMLElement = document.getElementById('Decision_label6_groupElement');
            expect(temp.children[1].childElementCount === 4 || temp.children[1].childElementCount === 5).toBe(true);
            done();
        });
    });
});