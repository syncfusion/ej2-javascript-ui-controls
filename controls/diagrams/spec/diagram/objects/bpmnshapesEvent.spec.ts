import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ShadowModel, RadialGradientModel, StopModel,LinearGradientModel } from '../../../src/diagram/core/appearance-model';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
Diagram.Inject(BpmnDiagrams);

/**
 * bpmn shapes for event
 */
describe('Diagram Control', () => {
    describe('BPMN Events', () => {
        let diagram: Diagram;
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };
        let linearGradient: LinearGradientModel;
            linearGradient = {
                //Start point of linear gradient
                x1: 0,
                y1: 0,
                //End point of linear gradient
                x2: 50,
                y2: 50,
                //Sets an array of stop objects
                stops: [{ color: "white", offset: 0 },
                { color: "darkCyan", offset: 100 }
                ],
                type: 'Linear'
            };

        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node7', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue',gradient: linearGradient,
                 strokeWidth: 5, },
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'Start', trigger: 'Message' }
                },
            };
            let node2: NodeModel = {
                id: 'node8', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shadow: shadow,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'NonInterruptingStart', trigger: 'Message' }
                },
            };
            let node3: NodeModel = {
                id: 'node9', width: 100, height: 100, offsetX: 500, offsetY: 100,
                style: { gradient: gradient },
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'Intermediate', trigger: 'Message' }
                },
            };
            let node4: NodeModel = {
                id: 'node10', width: 100, height: 100, offsetX: 700, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'NonInterruptingIntermediate', trigger: 'None' }
                },
            };
            let node5: NodeModel = {
                id: 'node11', width: 100, height: 100, offsetX: 900, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'ThrowingIntermediate', trigger: 'None' }
                },
            };
            let node6: NodeModel = {
                id: 'node12', width: 100, height: 100, offsetX: 1100, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'End', trigger: 'None' }
                },
            };
            let node7: NodeModel = {
                id: 'node13', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'Start', trigger: 'Message' }
                },
            };
            let node8: NodeModel = {
                id: 'node14', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'NonInterruptingStart', trigger: 'Multiple' }
                },
            };

            diagram = new Diagram({
                width: 1500, height: 500, nodes: [node1, node2, node3, node4, node5, node6, node7, node8]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking event as Start and trigger as None', (done: Function) => {
            let ele = document.getElementById("node7_0_event");
            let value = ele.getAttribute("fill");
            let wrapper: Canvas = (diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas;
            expect(value ===
                "url(#node7_0_event_linear)" && wrapper.style.fill == 'transparent').toBe(true);
            expect(wrapper.style.strokeColor == 'transparent').toBe(true);
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 100 && wrapper.children[1].offsetY === 100) &&
                //third node
                (wrapper.children[2].actualSize.width === 54
                    && wrapper.children[2].actualSize.height === 40 &&
                    wrapper.children[2].offsetX === 100 && wrapper.children[2].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking event as NonInterruptingStart and trigger as None ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[1] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 300 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 300 && wrapper.children[1].offsetY === 100) &&
                //third node
                (wrapper.children[2].actualSize.width === 54
                    && wrapper.children[2].actualSize.height === 40 &&
                    wrapper.children[2].offsetX === 300 && wrapper.children[2].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking event as Intermediate and trigger as None ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[2] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 500 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 500 && wrapper.children[1].offsetY === 100) &&
                //third node
                (wrapper.children[2].actualSize.width === 54
                    && wrapper.children[2].actualSize.height === 40 &&
                    wrapper.children[2].offsetX === 500 && wrapper.children[2].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking event as NonInterruptingIntermediate and trigger as None ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[3] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 700 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 700 && wrapper.children[1].offsetY === 100) &&
                //third node
                (wrapper.children[2].actualSize.width === 50
                    && wrapper.children[2].actualSize.height === 50 &&
                    wrapper.children[2].offsetX === 700 && wrapper.children[2].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking event as ThrowingIntermediate and trigger as None ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[4] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 900 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 900 && wrapper.children[1].offsetY === 100) &&
                //third node
                (wrapper.children[2].actualSize.width === 50
                    && wrapper.children[2].actualSize.height === 50 &&
                    wrapper.children[2].offsetX === 900 && wrapper.children[2].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking event as End and trigger as None', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[5] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 1100 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 1100 && wrapper.children[1].offsetY === 100) &&
                //third node
                (wrapper.children[2].actualSize.width === 50
                    && wrapper.children[2].actualSize.height === 50 &&
                    wrapper.children[2].offsetX === 1100 && wrapper.children[2].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking event as Start and trigger as Message', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[6] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 100 && wrapper.children[1].offsetY === 300) &&
                //third node
                (wrapper.children[2].actualSize.width === 54
                    && wrapper.children[2].actualSize.height === 40 &&
                    wrapper.children[2].offsetX === 100 && wrapper.children[2].offsetY === 300)
            ).toBe(true);
            done();
        });

        it('Checking event as NonInterruptingStart and trigger as Multiple', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[7] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 300 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 300 && wrapper.children[1].offsetY === 300) &&
                //third node
                (wrapper.children[2].actualSize.width === 50
                    && wrapper.children[2].actualSize.height === 50 &&
                    wrapper.children[2].offsetX === 300 && wrapper.children[2].offsetY === 300)
            ).toBe(true);
            done();
        });
    });

    describe('Diagram Element', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node15', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'Intermediate', trigger: 'Parallel' }
                },
            };
            let node2: NodeModel = {
                id: 'node16', width: 100, height: 100, offsetX: 700, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'NonInterruptingIntermediate', trigger: 'Signal' }
                },
            };
            let node3: NodeModel = {
                id: 'node18', width: 100, height: 100, offsetX: 900, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'ThrowingIntermediate', trigger: 'Signal' }
                },
            };
            let node4: NodeModel = {
                id: 'node19', width: 100, height: 100, offsetX: 1100, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'End', trigger: 'Timer' }
                },
            };
            let node5: NodeModel = {
                id: 'node7', width: 100, height: 100, offsetX: 100, offsetY: 500,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'Start', trigger: 'Cancel' }
                },
            };
            let node6: NodeModel = {
                id: 'node21', width: 100, height: 100, offsetX: 300, offsetY: 500,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'Start', trigger: 'Timer' }
                },
            };
            diagram = new Diagram({
                width: 1500, height: 1500, nodes: [node1,
                    node2, node3, node4, node5, node6]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking event as Intermediate and trigger as parallel ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 500 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 500 && wrapper.children[1].offsetY === 300) &&
                //third node
                (wrapper.children[2].actualSize.width === 50
                    && wrapper.children[2].actualSize.height === 50 &&
                    wrapper.children[2].offsetX === 500 && wrapper.children[2].offsetY === 300)
            ).toBe(true);
            done();
        });
        it('Checking event as NonInterruptingIntermediate and trigger as signal', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[1] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 700 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 700 && wrapper.children[1].offsetY === 300) &&
                //third node
                (wrapper.children[2].actualSize.width === 50
                    && wrapper.children[2].actualSize.height === 50 &&
                    wrapper.children[2].offsetX === 700 && wrapper.children[2].offsetY === 300)
            ).toBe(true);
            done();
        });
        it('Checking event as ThrowingIntermediate and trigger as signal ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[2] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 900 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 900 && wrapper.children[1].offsetY === 300) &&
                //third node
                (wrapper.children[2].actualSize.width === 50
                    && wrapper.children[2].actualSize.height === 50 &&
                    wrapper.children[2].offsetX === 900 && wrapper.children[2].offsetY === 300)
            ).toBe(true);
            done();
        });
        it('Checking event as end and trigger as timer ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[3] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 1100 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 1100 && wrapper.children[1].offsetY === 300) &&
                //third node
                (wrapper.children[2].actualSize.width === 50
                    && wrapper.children[2].actualSize.height === 50 &&
                    wrapper.children[2].offsetX === 1100 && wrapper.children[2].offsetY === 300)
            ).toBe(true);
            done();
        });
        it('Checking event as Start and trigger as cancel ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[4] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 500) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 100 && wrapper.children[1].offsetY === 500) &&
                //third node
                (wrapper.children[2].actualSize.width === 50
                    && wrapper.children[2].actualSize.height === 50 &&
                    wrapper.children[2].offsetX === 100 && wrapper.children[2].offsetY === 500)
            ).toBe(true);
            done();
        });
        it('Checking event as Start and trigger as timer ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[5] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 300 && wrapper.children[0].offsetY === 500) &&
                //second node
                (wrapper.children[1].actualSize.width === 85
                    && wrapper.children[1].actualSize.height === 85 &&
                    wrapper.children[1].offsetX === 300 && wrapper.children[1].offsetY === 500) &&
                //third node
                (wrapper.children[2].actualSize.width === 50
                    && wrapper.children[2].actualSize.height === 50 &&
                    wrapper.children[2].offsetX === 300 && wrapper.children[2].offsetY === 500)
            ).toBe(true);
            done();
        });
        it('Checking changing the style of BPMN Shapes', (done: Function) => {
            diagram.nodes[0].style.fill = 'red';
            diagram.dataBind();
            let wrapper: Canvas = (diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas;
            expect(wrapper.children[0].style.fill == 'red').toBe(true);
            expect(wrapper.style.fill == 'transparent').toBe(true);
            expect(wrapper.style.strokeColor == 'transparent').toBe(true);
            done();
        });
    });
});
