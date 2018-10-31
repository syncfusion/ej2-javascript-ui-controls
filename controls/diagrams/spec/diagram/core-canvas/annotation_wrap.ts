import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ShapeAnnotationModel } from '../../../src/diagram/objects/annotation-model';
import { TextStyleModel } from '../../../src/diagram/core/appearance-model';
import { HorizontalAlignment, VerticalAlignment } from '../../../src/diagram/enum/enum';

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
        let node4: NodeModel;
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

            annotation = {
                content: 'top left margin, top left alignment, offset 0', offset: { x: 0, y: 0 },
                horizontalAlignment: 'Left', verticalAlignment: 'Top', margin: { left: 15, top: 10 },
                style: style
            };

            node.annotations = [annotation];

            node2 = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: { type: 'Path', data: pathData }
            };


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

            annotation = {
                content: 'top margin, offset 0, top left alignment', offset: { x: 0, y: 0 },
                horizontalAlignment: 'Left', verticalAlignment: 'Top', margin: { top: 15 },
                style: style
            };
            node3.annotations = [annotation];
            node4 = {
                id: 'industry1', width: 130, height: 50, offsetX: 100, offsetY: 200,
                annotations: [{
                    content: 'ShapeAnnotationaaaaaaaaaaaaaaaaa NoWrap', style: { textWrapping: "NoWrap", fill: 'red', strokeColor: 'red' },
                }]
            }

            diagram = new Diagram({ mode: 'Canvas', width: '800px', height: '800px', nodes: [node, node2, node3, node4] });
            diagram.appendTo('#diagram48');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking annotation alinments and positions in SVG rendering Mode', (done: Function) => {

            (diagram.nodes[0] as NodeModel).annotations[0].content = 'left margin, top left alignment, offset 0';
            (diagram.nodes[0] as NodeModel).annotations[0].offset = { x: 0, y: 0 };
            (diagram.nodes[0] as NodeModel).annotations[0].horizontalAlignment = 'Left';
            (diagram.nodes[0] as NodeModel).annotations[0].verticalAlignment = 'Top';
            (diagram.nodes[0] as NodeModel).annotations[0].margin = { top: 10, left: 0 };

            (diagram.nodes[1] as NodeModel).annotations[0].content = 'right margin, bottom right alignment, offset 1';
            (diagram.nodes[1] as NodeModel).annotations[0].offset = { x: 1, y: 1 };
            (diagram.nodes[1] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            (diagram.nodes[1] as NodeModel).annotations[0].verticalAlignment = 'Bottom';
            (diagram.nodes[1] as NodeModel).annotations[0].margin = { right: 15, bottom: 0 };


            (diagram.nodes[2] as NodeModel).annotations[0].content = 'bottom margin, bottom right alignment, offset 1';
            (diagram.nodes[2] as NodeModel).annotations[0].offset = { x: 1, y: 1 };
            (diagram.nodes[2] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            (diagram.nodes[2] as NodeModel).annotations[0].verticalAlignment = 'Bottom';
            (diagram.nodes[2] as NodeModel).annotations[0].margin = { bottom: 15, top: 0 };

            diagram.dataBind();
            var node = diagram.nodes[3]
            var element = document.getElementById(node.wrapper.children[1].id+"_text");

            //first label
            expect(((diagram.nodes[0] as NodeModel).wrapper.children[1].actualSize.width === 85
                && (diagram.nodes[0] as NodeModel).wrapper.children[1].actualSize.height === 42 &&
                (diagram.nodes[0] as NodeModel).wrapper.children[1].offsetX === 92.5 &&
                (diagram.nodes[0] as NodeModel).wrapper.children[1].offsetY === 81) &&
                //second label
                ((diagram.nodes[1] as NodeModel).wrapper.children[1].actualSize.width === 85
                    && (diagram.nodes[1] as NodeModel).wrapper.children[1].actualSize.height === 56 &&
                    (diagram.nodes[1] as NodeModel).wrapper.children[1].offsetX === 292.5 &&
                    (diagram.nodes[1] as NodeModel).wrapper.children[1].offsetY === 122) &&
                //third label
                ((diagram.nodes[2] as NodeModel).wrapper.children[1].actualSize.width === 100
                    && (diagram.nodes[2] as NodeModel).wrapper.children[1].actualSize.height === 42 &&
                    (diagram.nodes[2] as NodeModel).wrapper.children[1].offsetX === 500 &&
                    (diagram.nodes[2] as NodeModel).wrapper.children[1].offsetY === 114) &&
                    element.childNodes.length===1
            ).toBe(true);
            done();
        });
    });
});