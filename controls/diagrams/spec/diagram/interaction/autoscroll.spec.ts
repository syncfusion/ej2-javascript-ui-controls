/**
 * Auto scroll
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { DiagramContextMenu } from '../../../src/diagram/objects/context-menu';
import { MouseEvents } from './mouseevents.spec';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { SnapConstraints, BasicShapeModel, DiagramConstraints } from '../../../src/diagram/index';
Diagram.Inject(BpmnDiagrams, DiagramContextMenu, UndoRedo);
describe('Diagram Control', () => {
    describe('Auto Scroll left and right', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node1: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 50, offsetY: 150 };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 950, offsetY: 350 };
            let node3: NodeModel = { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 50 };
            let node4: NodeModel = { id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 550 };
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [node1, node2, node3, node4],
                scrollSettings: { canAutoScroll: true, scrollLimit: 'Infinity' },
                snapSettings: { constraints: SnapConstraints.None }
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Autoscroll Left', (done: Function) => {
            let dgm: Diagram = diagram;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let center: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.center;
            mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
            mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x - 50, center.y - 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x - 50 - 25, center.y - 50 - 25);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x - 50 - 25 - 10, center.y - 50 - 25 - 10);
            setTimeout(() => {
                expect(dgm.scroller.horizontalOffset == 10).toBe(true);
                done();
                mouseEvents.mouseUpEvent(diagramCanvas, center.x - 50 - 25 - 10, center.y - 50 - 25 - 10);
            }, 110);
        });
        it('Checking Autoscroll right', (done: Function) => {
            let dgm: Diagram = diagram;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let center: PointModel = (diagram.nodes[1] as NodeModel).wrapper.bounds.center;
            mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
            mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50, center.y + 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25, center.y + 50 + 25);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25 + 10, center.y + 50 + 25 + 10);

            setTimeout(() => {
                expect(dgm.scroller.horizontalOffset == 20 || dgm.scroller.horizontalOffset == 30).toBe(true);
                done();
                mouseEvents.mouseUpEvent(diagramCanvas, center.x + 50 + 25 + 10 + 10, center.y + 50 + 25 + 10 + 10);
            }, 110);
        });


    });

    describe('Auto Scroll top and bottom', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node1: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 50, offsetY: 150 };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 950, offsetY: 350 };
            let node3: NodeModel = { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 50 };
            let node4: NodeModel = { id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 550 };
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [node1, node2, node3, node4], scrollSettings: { canAutoScroll: true, scrollLimit: 'Infinity' },
                snapSettings: { constraints: SnapConstraints.None }
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Autoscroll top', (done: Function) => {
            let dgm: Diagram = diagram;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let center: PointModel = (diagram.nodes[2] as NodeModel).wrapper.bounds.center;
            mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
            mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x - 50, center.y - 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x - 50 - 25, center.y - 50 - 25);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x - 50 - 25 - 10, center.y - 50 - 25 - 10);
            setTimeout(() => {
                expect(dgm.scroller.verticalOffset === 10).toBe(true);
                done();
                mouseEvents.mouseUpEvent(diagramCanvas, center.x - 50 - 25 - 10, center.y - 50 - 25 - 10);
            }, 110);
        });
        it('Checking Autoscroll bottom', (done: Function) => {
            let dgm: Diagram = diagram;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let center: PointModel = (diagram.nodes[3] as NodeModel).wrapper.bounds.center;
            mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
            mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50, center.y + 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25, center.y + 50 + 25);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25 + 10, center.y + 50 + 25 + 10);
            setTimeout(() => {
                expect(dgm.scroller.verticalOffset === 20 || dgm.scroller.verticalOffset === 30).toBe(true);
                done();
                mouseEvents.mouseUpEvent(diagramCanvas, center.x + 50 + 25 + 10 + 10, center.y + 50 + 25 + 10 + 10);
            }, 110);
        });
    })

    describe('Auto Scroll top and bottom with enabled ruler', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node1: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 50, offsetY: 150 };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 950, offsetY: 350 };
            let node3: NodeModel = { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 50 };
            let node4: NodeModel = { id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 550 };
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [node1, node2, node3, node4], scrollSettings: { canAutoScroll: true, scrollLimit: 'Infinity' },
                snapSettings: { constraints: SnapConstraints.None },
                rulerSettings: { showRulers: true },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Autoscroll right', (done: Function) => {
            let dgm: Diagram = diagram;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let center: PointModel = (diagram.nodes[1] as NodeModel).wrapper.bounds.center;
            mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
            mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50, center.y + 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25, center.y + 50 + 25);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25 + 10, center.y + 50 + 25 + 10);
            setTimeout(() => {
                console.log(dgm.scroller.horizontalOffset);
                expect(dgm.scroller.horizontalOffset == -10 || dgm.scroller.horizontalOffset == 30).toBe(true);
                done();
                mouseEvents.mouseUpEvent(diagramCanvas, center.x + 50 + 25 + 10 + 10, center.y + 50 + 25 + 10 + 10);
            }, 110);
        });
        it('Checking Autoscroll bottom', (done: Function) => {
            let dgm: Diagram = diagram;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let center: PointModel = (diagram.nodes[3] as NodeModel).wrapper.bounds.center;
            mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
            mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50, center.y + 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25, center.y + 50 + 25);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25 + 10, center.y + 50 + 25 + 10);
            setTimeout(() => {
                console.log(dgm.scroller.verticalOffset);
                expect(dgm.scroller.verticalOffset === 0 || dgm.scroller.verticalOffset === 30).toBe(true);
                done();
                mouseEvents.mouseUpEvent(diagramCanvas, center.x + 50 + 25 + 10 + 10, center.y + 50 + 25 + 10 + 10);
            }, 110);
        });
    });
    describe('Virtualization in Canvas mode', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle', cornerRadius: 10 };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, width: 50, height: 50, shape: shape, borderColor: "red" };
            let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
            let node2: NodeModel = { id: 'node2', offsetX: 400, offsetY: 100, shape: shape2 };
            let shape3: BasicShapeModel = { type: 'Basic', shape: 'Hexagon' };
            let node3: NodeModel = { id: 'node3', offsetX: 600, offsetY: 100, shape: shape3 };
            let shape4: BasicShapeModel = { type: 'Basic', shape: 'Parallelogram' };
            let node4: NodeModel = { id: 'node4', offsetX: 900, offsetY: 100, shape: shape4 };
            let shape5: BasicShapeModel = { type: 'Basic', shape: 'Triangle' };
            let node5: NodeModel = { id: 'node5', offsetX: 1200, offsetY: 100, shape: shape5 };
            let shape6: BasicShapeModel = { type: 'Basic', shape: 'Plus' };
            let node6: NodeModel = { id: 'node6', offsetX: 100, offsetY: 300, shape: shape6 };
            let shape7: BasicShapeModel = { type: 'Basic', shape: 'Star' };
            let node7: NodeModel = { id: 'node7', offsetX: 300, offsetY: 300, shape: shape7 };
            let shape8: BasicShapeModel = { type: 'Basic', shape: 'Pentagon' };
            let node8: NodeModel = { id: 'node8', offsetX: 600, offsetY: 300, shape: shape8 };
            let shape9: BasicShapeModel = { type: 'Basic', shape: 'Heptagon' };
            let node9: NodeModel = { id: 'node9', offsetX: 900, offsetY: 300, shape: shape9 };
            let shape10: BasicShapeModel = { type: 'Basic', shape: 'Octagon' };
            let node10: NodeModel = { id: 'node10', offsetX: 1200, offsetY: 300, shape: shape10 };
            let shape11: BasicShapeModel = { type: 'Basic', shape: 'Trapezoid' };
            let node11: NodeModel = { id: 'node11', offsetX: 100, offsetY: 500, shape: shape11 };
            let shape12: BasicShapeModel = { type: 'Basic', shape: 'Decagon' };
            let node12: NodeModel = { id: 'node12', offsetX: 300, offsetY: 500, shape: shape12 };
            let shape13: BasicShapeModel = { type: 'Basic', shape: 'RightTriangle' };
            let node13: NodeModel = { id: 'node13', offsetX: 600, offsetY: 500, shape: shape13 };
            let shape14: BasicShapeModel = { type: 'Basic', shape: 'Cylinder' };
            let node14: NodeModel = { id: 'node14', offsetX: 900, offsetY: 500, shape: shape14 };
            let shape15: BasicShapeModel = { type: 'Basic', shape: 'Diamond', };
            let node15: NodeModel = { id: 'node15', offsetX: 1200, offsetY: 500, shape: shape15 };
            diagram = new Diagram({
                width: 500, height: 500,
                constraints: DiagramConstraints.Default | DiagramConstraints.Virtualization,
                scrollSettings: { canAutoScroll: true, scrollLimit: 'Infinity' },
                mode: 'Canvas',
                nodes: [node1, node2, node3, node4, node5, node6, node7,
                    node8, node9, node10, node11, node12, node13, node14, node15]
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('checking initial rendering and zooming', (done: Function) => {
            let element = document.getElementById('diagram_diagram');
            let width = element.getAttribute("width");
            let height = element.getAttribute("height");
            expect(width === '750' && height === '750').toBe(true);
            done();

        });
        it('Checking Autoscroll canvas diagram', (done: Function) => {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let mouseEvents = new MouseEvents();
            let center = diagram.nodes[1].wrapper.bounds.center;
            mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
            mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50, center.y + 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25, center.y + 50 + 25);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25 + 10, center.y + 50 + 25 + 10);
            setTimeout(() => {
                mouseEvents.mouseUpEvent(diagramCanvas, center.x + 50 + 25 + 10 + 10, center.y + 50 + 25 + 10 + 10);
                let element = document.getElementById('diagram_diagram');
                let value = element.getAttribute("style");
                expect(value === "position: absolute; left: 20px; top: 0px; transform: scale(0.666667); transform-origin: 0px 0px 0px;").toBe(true);
                done();
            }, 250);

        });
        it('zoom in zoom out node selection', (done: Function) => {
            let node = diagram.nameTable['node'];
            diagram.select([node]);
            var selecelement = document.getElementById('borderRect');
            let oldxvalue = selecelement.getAttribute("x");
            let oldyvalue = selecelement.getAttribute("y");
            diagram.zoom(1.8);
            let selecelement1 = document.getElementById('borderRect');
            let xvalue = selecelement1.getAttribute("x");
            let yvalue = selecelement1.getAttribute("y");
            expect(oldxvalue === '75.5' && oldyvalue === '75.5' && xvalue === '135.9' && yvalue === '135.9').toBe(true);
            diagram.zoom(.5);
            var selecelement2 = document.getElementById('borderRect');
            var xvalue2 = selecelement2.getAttribute("x");
            var yvalue2 = selecelement2.getAttribute("y");
  
            expect(xvalue2 === '72.95' && yvalue2 === '92.95').toBe(true);
            done();
        });

    });
    describe('Virtualization in SVG mode', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle', cornerRadius: 10 };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, width: 50, height: 50, shape: shape, borderColor: "red" };
            let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
            let node2: NodeModel = { id: 'node2', offsetX: 400, offsetY: 100, shape: shape2 };
            let shape3: BasicShapeModel = { type: 'Basic', shape: 'Hexagon' };
            let node3: NodeModel = { id: 'node3', offsetX: 600, offsetY: 100, shape: shape3 };
            let shape4: BasicShapeModel = { type: 'Basic', shape: 'Parallelogram' };
            let node4: NodeModel = { id: 'node4', offsetX: 900, offsetY: 100, shape: shape4 };
            let shape5: BasicShapeModel = { type: 'Basic', shape: 'Triangle' };
            let node5: NodeModel = { id: 'node5', offsetX: 1200, offsetY: 100, shape: shape5 };
            let shape6: BasicShapeModel = { type: 'Basic', shape: 'Plus' };
            let node6: NodeModel = { id: 'node6', offsetX: 100, offsetY: 300, shape: shape6 };
            let shape7: BasicShapeModel = { type: 'Basic', shape: 'Star' };
            let node7: NodeModel = { id: 'node7', offsetX: 300, offsetY: 300, shape: shape7 };
            let shape8: BasicShapeModel = { type: 'Basic', shape: 'Pentagon' };
            let node8: NodeModel = { id: 'node8', offsetX: 600, offsetY: 300, shape: shape8 };
            let shape9: BasicShapeModel = { type: 'Basic', shape: 'Heptagon' };
            let node9: NodeModel = { id: 'node9', offsetX: 900, offsetY: 300, shape: shape9 };
            let shape10: BasicShapeModel = { type: 'Basic', shape: 'Octagon' };
            let node10: NodeModel = { id: 'node10', offsetX: 1200, offsetY: 300, shape: shape10 };
            let shape11: BasicShapeModel = { type: 'Basic', shape: 'Trapezoid' };
            let node11: NodeModel = { id: 'node11', offsetX: 100, offsetY: 500, shape: shape11 };
            let shape12: BasicShapeModel = { type: 'Basic', shape: 'Decagon' };
            let node12: NodeModel = { id: 'node12', offsetX: 300, offsetY: 500, shape: shape12 };
            let shape13: BasicShapeModel = { type: 'Basic', shape: 'RightTriangle' };
            let node13: NodeModel = { id: 'node13', offsetX: 600, offsetY: 500, shape: shape13 };
            let shape14: BasicShapeModel = { type: 'Basic', shape: 'Cylinder' };
            let node14: NodeModel = { id: 'node14', offsetX: 900, offsetY: 500, shape: shape14 };
            let shape15: BasicShapeModel = { type: 'Basic', shape: 'Diamond', };
            let node15: NodeModel = { id: 'node15', offsetX: 1200, offsetY: 500, shape: shape15 };
            diagram = new Diagram({
                width: 500, height: 500,
                mode: 'SVG',
                constraints: DiagramConstraints.Default | DiagramConstraints.Virtualization,
                scrollSettings: { canAutoScroll: true, scrollLimit: 'Infinity' },
                nodes: [node1, node2, node3, node4, node5, node6, node7,
                    node8, node9, node10, node11, node12, node13, node14, node15]
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('checking initial rendering and zooming', (done: Function) => {
            let nodes = document.getElementById('diagram_diagramLayer');
            expect(nodes.childNodes.length === 6).toBe(true);
            diagram.zoom(1.5);
            setTimeout(function () {
                let nodes1 = document.getElementById('diagram_diagramLayer');
                expect(nodes1.childNodes.length === 4).toBe(true);

                done();
            }, 100);
            setTimeout(function () {
                diagram.zoom(.5);
                let nodes1 = document.getElementById('diagram_diagramLayer');
                expect(nodes1.childNodes.length === 9).toBe(true);
                done();
            }, 120);


        });
        it('Checking Autoscroll right', (done: Function) => {
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            var mouseEvents = new MouseEvents();
            var center = diagram.nodes[1].wrapper.bounds.center;
            mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
            mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50, center.y + 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25, center.y + 50 + 25);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 50 + 25 + 10, center.y + 50 + 25 + 10);
            setTimeout(function () {
                mouseEvents.mouseUpEvent(diagramCanvas, center.x + 50 + 25 + 10 + 10, center.y + 50 + 25 + 10 + 10);
                var element = document.getElementById('diagram_diagramLayer');
                expect(element.childNodes.length === 9).toBe(true);
                done();
            }, 850);

        });
        it('Checking autoscroll left', (done: Function) => {
            var mouseEvents = new MouseEvents();
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            var center = diagram.nodes[0].wrapper.bounds.center;
            mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
            mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x - 50, center.y - 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x - 50 - 25, center.y - 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, center.x - 50 - 25 - 10, center.y - 50 - 25 - 10);
            setTimeout(function () {
                mouseEvents.mouseUpEvent(diagramCanvas, center.x - 50 - 25 - 10, center.y - 50 - 25 - 10);

                setTimeout(function () {
                    var element = document.getElementById('diagram_diagramLayer');

                    expect(element.childNodes.length === 6).toBe(true);
                    done();
                }, 200)
            }, 1550);
        });

    });
});