import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { MouseEvents } from './mouseevents.spec';
import { NodeConstraints, ConnectorConstraints, PointModel } from '../../../src/diagram/index';
import { IDropEventArgs, IElement } from '../../../src/diagram/objects/interface/IElement';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';

const TEST_COORDS = {
    node1Start: { x: 100, y: 100 },       // Top-left node, no AllowDrop
    node2Target: { x: 260, y: 100 },      // Drag target (node2, has AllowDrop)
    node3Target: { x: 450, y: 100 },      // No AllowDrop; should reject
    node4AllowTarget: { x: 490, y: 300 }, // AllowDrop constraint
    connectorPath: { x: 250, y: 290 },    // On connector path
    dragSource2: { x: 225, y: 100 }       // Drag source
};
describe('Testing AllowDrop', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

    });

    beforeEach((): void => {

        ele = createElement('div', { id: 'allowDrop' });
        document.body.appendChild(ele);
        let node1: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 90, offsetY: 90 };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 290, offsetY: 90,
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
        };
        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 490, offsetY: 90,
        };
        let node4: NodeModel = {
            id: 'node4', width: 100, height: 100, offsetX: 490, offsetY: 290,
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
        };
        let connector1: ConnectorModel = {
            id: 'connector1', sourcePoint: { x: 190, y: 290 }, targetPoint: { x: 290, y: 290 },
            constraints: ConnectorConstraints.Default | ConnectorConstraints.AllowDrop
        };

        diagram = new Diagram({
            width: 700, height: 600, nodes: [node1, node2, node3, node4],
            connectors: [connector1],
        });

        diagram.appendTo('#allowDrop');
    });
    afterEach((): void => {
        diagram.drop = undefined;
        diagram.destroy();
        if (ele && ele.parentNode) {
            ele.parentNode.removeChild(ele);
        }
    });
    afterAll((): void => {
        // Explicitly clear references
        diagram = null;
        ele = null;
        mouseEvents = null;
    });

    it('Checking node with AlllowDrop Constraint', (done: DoneFn): void => {
        let node2: NodeModel = diagram.nodes[1];
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas,
            TEST_COORDS.node1Start.x,
            TEST_COORDS.node1Start.y,
            TEST_COORDS.node2Target.x,
            TEST_COORDS.node2Target.y
        );
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        diagram.drop = (args: IDropEventArgs): void => {
            try {
                highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
                expect(highlighter === null && args.target === node2).toBe(true);
                done();
            } catch (err) {
                done.fail(err);
            }
        };
        mouseEvents.mouseUpEvent(diagramCanvas, 255, 100);
        mouseEvents.dragEvent(diagramCanvas, TEST_COORDS.dragSource2.x,
            TEST_COORDS.dragSource2.y,
            TEST_COORDS.node1Start.x,
            TEST_COORDS.node1Start.y);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        // Cleanup local references
        diagramCanvas = null;
        highlighter = null;
    });

    it('Checking node without AlllowDrop Constraint', (done: DoneFn): void => {
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas,
            TEST_COORDS.node1Start.x,
            TEST_COORDS.node1Start.y,
            TEST_COORDS.node3Target.x,
            TEST_COORDS.node3Target.y,
        );
        mouseEvents.mouseMoveEvent(diagramCanvas, 455, 100);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter === null).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        diagramCanvas = null;
        highlighter = null;
        done();
    });

    it('Checking AlllowDrop Constraint', (done: DoneFn): void => {
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas,
            TEST_COORDS.node1Start.x,
            TEST_COORDS.node1Start.y,
            TEST_COORDS.node3Target.x,
            TEST_COORDS.node4AllowTarget.y
        );
        mouseEvents.mouseMoveEvent(diagramCanvas, 455, 300);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 470, 300);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        diagramCanvas = null;
        highlighter = null;
        done();
    });

    it('Checking connector with AlllowDrop Constraint', (done: DoneFn): void => {
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 100, 100, 250, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 255, 100);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 295);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 105, 100);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        diagramCanvas = null;
        highlighter = null;
        done();
    });
});

describe('Testing Object Sorting - 1', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    beforeEach((): void => {
        ele = createElement('div', { id: 'allowDrop_1' });
        document.body.appendChild(ele);
        let node1: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, zIndex: 4 };

        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, zIndex: 3,
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
        };

        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, zIndex: 2,
        };

        let node4: NodeModel = {
            id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 300, zIndex: 1,
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
        };

        let connector1: ConnectorModel = {
            id: 'connector1', sourcePoint: { x: 200, y: 300 }, targetPoint: { x: 300, y: 300 },
            constraints: ConnectorConstraints.Default | ConnectorConstraints.AllowDrop
        };

        diagram = new Diagram({
            width: 700, height: 600, nodes: [node1, node2, node3, node4],
            connectors: [connector1],
        });

        diagram.appendTo('#allowDrop_1');

    });
    afterEach((): void => {
        if (diagram) {
            diagram.destroy();
        }
        if (ele && ele.parentNode) {
            ele.parentNode.removeChild(ele);
        }
    })
    afterAll((): void => {
        // Explicitly clear references
        diagram = null;
        ele = null;
        mouseEvents = null;
    });

    it('Checking inserting of the first element to the collection', (done: DoneFn): void => {
        let node = diagram.nodes[0];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100);
        let currentPosition: PointModel = { x: 100, y: 100 };
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);

        expect(objects.length !== 0 && objects[0] === node).toBe(true);
        objects = null;
        diagramCanvas = null;
        done();
    });

    it('Checking inserting two elements with reverse zIndex to the collection', (done: DoneFn): void => {
        let node = diagram.nodes[0];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 300, 100, 100, 100);
        let currentPosition: PointModel = { x: 100, y: 100 };
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);

        expect(objects.length !== 0 && objects[1] === node).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        objects = null;
        diagramCanvas = null;
        done();
    });

    it('Checking inserting of the three elements with reverse zIndex to the collection', (done: DoneFn): void => {
        let node = diagram.nodes[0];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 500, 100, 100, 100);
        let currentPosition: PointModel = { x: 100, y: 100 };
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);
        let object: IElement = diagram.findObjectUnderMouse(objects, 'Drag', true);
        expect(objects.length !== 0 && objects[1] === node).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        // Cleanup local references
        objects = null;
        object = null;
        diagramCanvas = null;
        done();
    });

    it('Checking inserting of the four elements with reverse zIndex to the collection', (done: DoneFn): void => {
        let node = diagram.nodes[0];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 500, 300, 100, 100);
        let currentPosition: PointModel = { x: 100, y: 100 };
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);

        expect(objects.length !== 0 && objects[1] === node).toBe(true)
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        // Cleanup local references
        objects = null;
        diagramCanvas = null;
        done();
    });

});

describe('Testing Object Sorting - 2', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'allowDrop_2' });
        document.body.appendChild(ele);

        let node1: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, };

        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
        };

        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
        };

        let node4: NodeModel = {
            id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 300,
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
        };
        diagram = new Diagram({
            width: 700, height: 600, nodes: [node1, node2, node3, node4],
        });

        diagram.appendTo('#allowDrop_2');

    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
        // Explicitly clear references
        diagram = null;
        ele = null;
        mouseEvents = null;
    });

    it('Checking inserting two elements with Normal zIndex to the collection', (done: DoneFn): void => {

        let node = diagram.nodes[1];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 300, 100, 100, 100);
        let currentPosition: PointModel = { x: 100, y: 100 };
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);

        expect(objects.length !== 0 && objects[1] === node).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        objects = null;
        diagramCanvas = null;
        done();
    });

    it('Checking inserting of the three elements with Normal zIndex to the collection', (done: DoneFn): void => {
        let node = diagram.nodes[2];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 500, 100, 100, 100);
        let currentPosition: PointModel = { x: 100, y: 100 };
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);

        expect(objects.length !== 0 && objects[2] === node).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        objects = null;
        diagramCanvas = null;
        done();
    });

    it('Checking inserting of the four elements with Normal zIndex to the collection', (done: DoneFn): void => {
        let node = diagram.nodes[3];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 500, 300, 100, 100);
        let currentPosition: PointModel = { x: 100, y: 100 };
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);

        expect(objects.length !== 0 && objects[3] === node).toBe(true)
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        objects = null;
        diagramCanvas = null;
        done();
    });

});

describe('Testing Object Sorting - 3', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'allowDrop_3' });
        document.body.appendChild(ele);

        let node1: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, zIndex: 3 };

        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, zIndex: 1,
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
        };

        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, zIndex: 2,
        };
        diagram = new Diagram({
            width: 700, height: 600, nodes: [node1, node2, node3],
        });
        diagram.appendTo('#allowDrop_3');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
        // Explicitly clear references
        diagram = null;
        ele = null;
        mouseEvents = null;
    });

    it('Checking inserting of the three elements with randomly arranged zIndex to the collection', (done: DoneFn): void => {
        let node = diagram.nodes[2];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas, 300, 100, 100, 100);
        mouseEvents.dragEvent(diagramCanvas, 500, 100, 100, 100);
        let currentPosition: PointModel = { x: 100, y: 100 };
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);

        expect(objects.length !== 0 && objects[1] === node).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        objects = null;
        diagramCanvas = null;
        done();
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});

describe('Connector Allow Drop', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'Allow_drop' });
        document.body.appendChild(ele);

        let port1 = { id: "port1", shape: "square", offset: { x: 0, y: 0.5 } }
        let port2 = { id: "port2", shape: "square", offset: { x: 1, y: 0.5 } }
        let node1: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 150, offsetY: 150, annotations: [{ content: 'node1' }], };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 650, offsetY: 150, annotations: [{ content: 'node2' }],
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
        };
        let node3 = {
            id: 'node3', width: 100, height: 100, offsetX: 490, offsetY: 290, annotations: [{ content: 'node3' }],
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
        };
        let node4 = {
            id: 'node4', width: 100, height: 100, offsetX: 150, offsetY: 450, annotations: [{ content: 'node4' }],
        }
        let node5 = {
            id: 'node5', width: 100, height: 100, offsetX: 150, offsetY: 650, annotations: [{ content: 'node5' }],
        }
        let node6 = {
            id: 'node6', width: 100, height: 100, offsetX: 290, offsetY: 290, annotations: [{ content: 'node6' }],
        };
        let node7 = {
            id: 'node7', width: 100, height: 100, offsetX: 90, offsetY: 290, annotations: [{ content: 'node7' }],
        };
        let node8 = {
            id: 'node8', width: 100, height: 100, offsetX: 790, offsetY: 290, annotations: [{ content: 'node8' }],
        };
        let node9 = {
            id: 'node9', width: 100, height: 100, offsetX: 150, offsetY: 850, ports: [port1, port2], annotations: [{ content: 'node9' }],
        };
        let node10 = {
            id: 'node10', width: 100, height: 100, offsetX: 550, offsetY: 850, ports: [port1], annotations: [{ content: 'node10' }],
        };
        let node11 = {
            id: 'node11', width: 100, height: 100, offsetX: 990, offsetY: 290, annotations: [{ content: 'node11' }],
        };
        let connector1: ConnectorModel = {
            id: 'connector1', sourceID: "node1", targetID: "node2",
            constraints: ConnectorConstraints.Default | ConnectorConstraints.AllowDrop
        };
        let connector2 = {
            id: 'connector2', sourceID: "node4", targetPoint: { x: 500, y: 450 },
            constraints: ConnectorConstraints.Default | ConnectorConstraints.AllowDrop
        };
        let connector3 = {
            id: 'connector3', sourcePoint: { x: 500, y: 650 }, targetID: "node5",
            constraints: ConnectorConstraints.Default | ConnectorConstraints.AllowDrop
        };
        let connector4 = {
            id: 'connector4', sourcePoint: { x: 600, y: 550 }, targetPoint: { x: 800, y: 550 },
            constraints: ConnectorConstraints.Default | ConnectorConstraints.AllowDrop
        }
        let connector5 = {
            id: 'connector5', sourceID: "node9", targetID: "node10", targetPortID: 'port1', sourcePortID: 'port2',
            constraints: ConnectorConstraints.Default | ConnectorConstraints.AllowDrop
        };
        diagram = new Diagram({
            enableConnectorSplit: true,
            width: 700, height: 600, nodes: [node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11],
            connectors: [connector1, connector2, connector3, connector4, connector5]
        });
        diagram.appendTo('#Allow_drop');

    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
        // Explicitly clear references
        diagram = null;
        ele = null;
        mouseEvents = null;
    });

    it('Dropping node on Connector', (done: DoneFn): void => {
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas, 490, 290);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 150);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 400, 150);
        expect(diagram.connectors[0].targetID === diagram.nodes[2].id).toBe(true);
        diagram.undo();
        expect(diagram.nodes[2].offsetX === 490 && diagram.nodes[2].offsetY === 290).toBe(true);
        diagram.redo();
        expect(diagram.connectors.length === 6).toBe(true);
        diagramCanvas = null;
        highlighter = null;
        done();
    });
    it("drop node on connector with source id", (done: DoneFn): void => {
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas, 290, 290);
        mouseEvents.mouseMoveEvent(diagramCanvas, 290, 450);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 290, 450);
        expect(diagram.connectors[1].targetID === diagram.nodes[5].id).toBe(true);
        diagramCanvas = null;
        highlighter = null;
        done();
    });
    it("drop node on connector with target id", (done: DoneFn): void => {
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas, 90, 290);
        mouseEvents.mouseMoveEvent(diagramCanvas, 290, 650);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 290, 650);
        expect(diagram.connectors[2].sourceID === diagram.nodes[6].id).toBe(true);
        diagramCanvas = null;
        highlighter = null;
        done();
    });
    it("drop node on empty connector ", (done: DoneFn): void => {
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas, 790, 290);
        mouseEvents.mouseMoveEvent(diagramCanvas, 710, 550);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 710, 550);
        expect(diagram.connectors[3].sourceID === diagram.nodes[7].id).toBe(true);
        diagramCanvas = null;
        highlighter = null;
        done();
    });
    it("drop node on connector ports ", (done: DoneFn): void => {
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas, 990, 290);
        mouseEvents.mouseMoveEvent(diagramCanvas, 350, 850);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 350, 850);
        expect(diagram.connectors[4].targetID === diagram.nodes[10].id).toBe(true);
        diagramCanvas = null;
        highlighter = null;
        done();
    });
});
