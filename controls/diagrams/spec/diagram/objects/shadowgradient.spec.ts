import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { NodeModel, PathModel } from '../../../src/diagram/objects/node-model';
import { ShadowModel, RadialGradientModel, StopModel, LinearGradientModel, GradientModel } from '../../../src/diagram/core/appearance-model';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
/**
 * Shadow & Gradient
 */
describe('Diagram Control for shadow properties', () => {
    describe('Shadow', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramg' });
            document.body.appendChild(ele);
            let shape1: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: shape1
            };

            let shadow1: ShadowModel = { angle: 135 };
            let shape2: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200,
                shape: shape2, shadow: shadow1, constraints: NodeConstraints.Default | NodeConstraints.Shadow
            };


            let shadow2: ShadowModel = { distance: 10 };
            let shape3: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: shape3, shadow: shadow2, constraints: NodeConstraints.Default | NodeConstraints.Shadow
            };


            let shadow3: ShadowModel = { opacity: 0.9 };
            let shape4: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 100, offsetY: 400,
                shape: shape4, shadow: shadow3, constraints: NodeConstraints.Default | NodeConstraints.Shadow
            };


            let shadow4: ShadowModel = { color: 'red', opacity: 0.9 };
            let shape5: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 250, offsetY: 400,
                shape: shape5, shadow: shadow4, constraints: NodeConstraints.Default | NodeConstraints.Shadow
            };


            diagram = new Diagram({ mode: 'SVG', width: 1000, height: 1000, nodes: [node1, node2, node3, node4, node5] });
            diagram.appendTo('#diagramg');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Testing default and custom shadow in SVG rendering Mode', (done: Function) => {
            if (diagram.nodes.length) {
                let failure: boolean = false;
                for (let i: number = 0; i < diagram.nodes.length; i++) {
                    let node: NodeModel = diagram.nodes[i];
                    let element: DiagramElement = node.wrapper.children[0];
                    if (!(node.shadow === element.shadow) && element.shadow) {
                        failure = true;
                        break;
                    }
                }
                if (!failure) {
                    done();
                } else {
                    fail();
                }
            }
        });
    });
    describe('Gradient', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramh' });
            document.body.appendChild(ele);

            let shape1: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' }
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: shape1
            };


            let stopscol: StopModel[] = [];
            let stops1: StopModel = { color: 'white', offset: 0 };
            stopscol.push(stops1);
            let stops2: StopModel = { color: 'red', offset: 50 };
            stopscol.push(stops2);
            let gradient1: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };
            let shape2: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200,
                shape: shape2, style: { gradient: gradient1 }
            };



            let stopscol2: StopModel[] = [];
            let stops3: StopModel = { color: 'white', offset: 0 };
            stopscol2.push(stops3);
            let stops4: StopModel = { color: 'red', offset: 50 };
            stopscol2.push(stops4);
            let gradient2: RadialGradientModel = { stops: stopscol2, type: 'Radial' };
            let shape3: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: shape3, style: { gradient: gradient2 }
            };


            diagram = new Diagram({ mode: 'SVG', width: 1000, height: 1000, nodes: [node1, node2, node3] });
            diagram.appendTo('#diagramh');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Testing radial gradient in SVG rendering Mode', (done: Function) => {
            if (diagram.nodes.length) {
                let failure: boolean = false;
                for (let i: number = 0; i < diagram.nodes.length; i++) {
                    let node: NodeModel = diagram.nodes[i];
                    let element: DiagramElement = node.wrapper.children[0];
                    if (!(node.style.gradient === element.style.gradient)) {
                        failure = true;
                        break;
                    }
                }
                if (!failure) {
                    done();
                } else {
                    fail();
                }
            }
        });
    });

    describe('Gradient', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramh' });
            document.body.appendChild(ele);

            let shape1: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' }
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: shape1
            };


            let stopscol: StopModel[] = [];
            let stops1: StopModel = { color: 'white', offset: 0 };
            stopscol.push(stops1);
            let stops2: StopModel = { color: 'red', offset: 50 };
            stopscol.push(stops2);
            let gradient1: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };
            let shape2: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200,
                shape: shape2, style: { gradient: gradient1 }
            };



            let stopscol2: StopModel[] = [];
            let stops3: StopModel = { color: 'white', offset: 50 };
            stopscol2.push(stops3);
            let stops4: StopModel = { color: 'red', offset: 0 };
            stopscol2.push(stops4);
            let gradient2: RadialGradientModel = { stops: stopscol2, type: 'Radial' };
            let shape3: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: shape3, style: { gradient: gradient2 }
            };

            let stopscol21: StopModel[] = [];
            let stops31: StopModel = { color: 'white', offset: 50 };
            stopscol21.push(stops3);
            let stops41: StopModel = { color: 'red', offset: 0 };
            stopscol21.push(stops4);
            let gradient21: GradientModel = { stops: stopscol21, type: undefined };
            let shape31: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node31: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: shape3, style: { gradient: gradient21 }
            };

            diagram = new Diagram({ mode: 'SVG', width: 1000, height: 1000, nodes: [node1, node2, node3] });
            diagram.appendTo('#diagramh');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Testing radial gradient for offset change in SVG rendering Mode', (done: Function) => {
            if (diagram.nodes.length) {
                let failure: boolean = false;
                for (let i: number = 0; i < diagram.nodes.length; i++) {
                    let node: NodeModel = diagram.nodes[i];
                    let element: DiagramElement = node.wrapper.children[0];
                    if (!(node.style.gradient === element.style.gradient)) {
                        failure = true;
                        break;
                    }
                }
                if (!failure) {
                    done();
                } else {
                    fail();
                }
            }
        });
    });
    describe('Gradient', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrami' });
            document.body.appendChild(ele);

            let shape1: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' }
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: shape1
            };
            let stopscol: StopModel[] = [];
            let stops1: StopModel = { color: 'white', offset: 0 };
            stopscol.push(stops1);
            let stops2: StopModel = { color: 'red', offset: 50 };
            stopscol.push(stops2);
            let gradient1: LinearGradientModel = { x1: 0, x2: 50, y1: 0, y2: 50, stops: stopscol, type: 'Linear' };
            let shape2: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200,
                shape: shape2, style: { gradient: gradient1 }
            };

            let stopscol2: StopModel[] = [];
            let stops3: StopModel = { color: 'white', offset: 0 };
            stopscol2.push(stops3);
            let stops4: StopModel = { color: 'red', offset: 50 };
            stopscol2.push(stops4);
            let gradient2: LinearGradientModel = { stops: stopscol2, type: 'Linear' };
            gradient2.x1 = 10;
            gradient2.x2 = 20;
            gradient2.y1 = 20;
            gradient2.y2 = 20;
            let shape3: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: shape3, style: { gradient: gradient2 }
            };

            diagram = new Diagram({ mode: 'SVG', width: 1000, height: 1000, nodes: [node1, node2, node3] });
            diagram.appendTo('#diagrami');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Linear Gradient in SVG rendering Mode', (done: Function) => {
            if (diagram.nodes.length) {
                let failure: boolean = false;
                for (let i: number = 0; i < diagram.nodes.length; i++) {
                    let node: NodeModel = diagram.nodes[i];
                    let element: DiagramElement = node.wrapper.children[0];
                    if (!(node.style.gradient === element.style.gradient)) {
                        failure = true;
                        break;
                    }
                }
                if (!failure) {
                    done();
                } else {
                    fail();
                }
            }
        });
    });

    describe('Gradient', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramh' });
            document.body.appendChild(ele);

            let shape1: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' }
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: shape1,
                annotations: [{ id: 'label1', content: 'label' }]
            };
            let stopscol: StopModel[] = [];
            let stops1: StopModel = { color: 'white', offset: 0 };
            stopscol.push(stops1);
            let stops2: StopModel = { color: 'red', offset: 50 };
            stopscol.push(stops2);
            let gradient1: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };
            let shape2: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200,
                shape: shape2, style: { gradient: gradient1 },
                annotations: [{ id: 'label1', content: 'label' }]
            };
            let stopscol2: StopModel[] = [];
            let stops3: StopModel = { color: 'white', offset: 0 };
            stopscol2.push(stops3);
            let stops4: StopModel = { color: 'red', offset: 50 };
            stopscol2.push(stops4);
            let gradient2: RadialGradientModel = { stops: stopscol2, type: 'Radial' };
            let shape3: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: shape3, style: { gradient: gradient2 }
            };


            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node1, node2, node3] });
            diagram.appendTo('#diagramh');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Testing radial gradient in SVG mode', (done: Function) => {
            expect((document.getElementById('node2_content_radial').parentNode as SVGElement).id === 'diagramhgradient_pattern').toBe(true);
            done();
        });
    });
});