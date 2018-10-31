import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Connector } from '../../../src/diagram/objects/connector';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { MouseEvents } from './mouseevents.spec';
import { NodeConstraints, ConnectorConstraints, hasSelection, SelectorModel, PointModel } from '../../../src/diagram/index';
import { IDraggingEventArgs, IPropertyChangeEventArgs, IDropEventArgs, IElement } from '../../../src/diagram/objects/interface/IElement';



describe('Testing AllowDrop', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id: 'allowDrop' });
        document.body.appendChild(ele);
        let selArray: (NodeModel | ConnectorModel)[] = [];
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

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking node with AlllowDrop Constraint', (done: Function) => {
        let node1: NodeModel = diagram.nodes[0];
        let node2: NodeModel = diagram.nodes[1];
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 100, 100, 260, 100);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        diagram.drop = (args: IDropEventArgs) => {
            highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
            expect(highlighter === null && args.target === node2).toBe(true);
        }
        mouseEvents.mouseUpEvent(diagramCanvas, 255, 100);
        mouseEvents.dragEvent(diagramCanvas, 225, 100, 100, 100);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        done();
    });

    it('Checking node without AlllowDrop Constraint', (done: Function) => {
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 100, 100, 450, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 455, 100);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter === null).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        done();
    });

    it('Checking AlllowDrop Constraint', (done: Function) => {
        let highlighter: HTMLElement = null;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 100, 100, 450, 300);
        mouseEvents.mouseMoveEvent(diagramCanvas, 455, 300);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 470, 300);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter !== null).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        done();
    });

    it('Checking connector with AlllowDrop Constraint', (done: Function) => {
        let connector1: ConnectorModel = diagram.connectors[0];
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
        done();
    });
});

describe('Testing Object Sorting - 1', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id: 'allowDrop_1' });
        document.body.appendChild(ele);
        let selArray: (NodeModel | ConnectorModel)[] = [];
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

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking inserting of the first element to the collection', (done: Function) => {
        let node = diagram.nodes[0];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100);
        let currentPosition: PointModel = {x: 100, y: 100};
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);
        let object: IElement = diagram.findObjectUnderMouse(objects, 'Select', false);
        expect(objects.length !== 0 && objects[0] === node).toBe(true);
        done();
    });

    it('Checking inserting two elements with reverse zIndex to the collection', (done: Function) => {
        let node = diagram.nodes[0];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 300, 100 , 100, 100);
        let currentPosition: PointModel = {x: 100, y: 100};
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);
        let object: IElement = diagram.findObjectUnderMouse(objects, 'Drag', true);
        expect(objects.length !== 0 && objects[1] === node).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        done();
    });

    it('Checking inserting of the three elements with reverse zIndex to the collection', (done: Function) => {
        let node = diagram.nodes[0];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 500, 100 , 100, 100);
        let currentPosition: PointModel = {x: 100, y: 100};
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);
        let object: IElement = diagram.findObjectUnderMouse(objects, 'Drag', true);
        expect(objects.length !== 0 && objects[2] === node).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        done();
    });

    it('Checking inserting of the four elements with reverse zIndex to the collection', (done: Function) => {
        let node = diagram.nodes[0];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 500, 300 , 100, 100);
        let currentPosition: PointModel = {x: 100, y: 100};
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);
        let object: IElement = diagram.findObjectUnderMouse(objects, 'Drag', true);
        expect(objects.length !== 0 && objects[3] === node).toBe(true)
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        done();
    });
});

describe('Testing Object Sorting - 2', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id: 'allowDrop_2' });
        document.body.appendChild(ele);
        let selArray: (NodeModel | ConnectorModel)[] = [];
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
    });

    it('Checking inserting two elements with Normal zIndex to the collection', (done: Function) => {
        let node = diagram.nodes[1];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 300, 100 , 100, 100);
        let currentPosition: PointModel = {x: 100, y: 100};
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);
        let object: IElement = diagram.findObjectUnderMouse(objects, 'Drag', true);
        expect(objects.length !== 0 && objects[1] === node).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        done();
    });

    it('Checking inserting of the three elements with Normal zIndex to the collection', (done: Function) => {
        let node = diagram.nodes[2];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 500, 100 , 100, 100);
        let currentPosition: PointModel = {x: 100, y: 100};
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);
        let object: IElement = diagram.findObjectUnderMouse(objects, 'Drag', true);
        expect(objects.length !== 0 && objects[2] === node).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        done();
    });

    it('Checking inserting of the four elements with Normal zIndex to the collection', (done: Function) => {
        let node = diagram.nodes[3];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragEvent(diagramCanvas, 500, 300 , 100, 100);
        let currentPosition: PointModel = {x: 100, y: 100};
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);
        let object: IElement = diagram.findObjectUnderMouse(objects, 'Drag', true);
        expect(objects.length !== 0 && objects[3] === node).toBe(true)
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        done();
    });
});

describe('Testing Object Sorting - 3', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id: 'allowDrop_3' });
        document.body.appendChild(ele);
        let selArray: (NodeModel | ConnectorModel)[] = [];
        let node1: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, zIndex: 3};

        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, zIndex: 1,
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
        };

        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,zIndex: 2,
        };
        diagram = new Diagram({
            width: 700, height: 600, nodes: [node1, node2, node3],
        });
        diagram.appendTo('#allowDrop_3');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking inserting of the three elements with randomly arranged zIndex to the collection', (done: Function) => {
        let node = diagram.nodes[2];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas, 300, 100, 100, 100);
        mouseEvents.dragEvent(diagramCanvas, 500, 100 , 100, 100);
        let currentPosition: PointModel = {x: 100, y: 100};
        let objects: IElement[] = diagram.findObjectsUnderMouse(currentPosition);
        let object: IElement = diagram.findObjectUnderMouse(objects, 'Drag', true);
        expect(objects.length !== 0 && objects[1] === node).toBe(true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 100);
        done();
    });
});