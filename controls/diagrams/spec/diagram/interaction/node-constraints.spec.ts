import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { Rect } from '../../../src/diagram/primitives/rect';
import { Matrix, identityMatrix, rotateMatrix, transformPointByMatrix } from '../../../src/diagram/primitives/matrix';
import { MouseEvents } from './mouseevents.spec';
import { TextAlign, Orientation, NodeConstraints, PortVisibility } from '../../../src/diagram/enum/enum';
import { Node } from '../../../src/diagram/objects/node';
import { SnapConstraints } from '../../../src/diagram/index';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
Diagram.Inject(UndoRedo);

/**
 * Interaction Specification Document
 */
describe('Diagram Control', () => {



    describe('Testing Selection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 300, offsetY: 300,

            };



            diagram = new Diagram({
                width: '600px', height: '600px', nodes: [node1, node2, node3],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });

            diagram.appendTo('#diagram1');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking node without selection constraints', (done: Function) => {
            let node: NodeModel = diagram.nodes[1];
            node.constraints = NodeConstraints.Default
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);
            expect(diagram.selectedItems.nodes[0].id === 'node2').toBe(true);
            done();
        });
        it('Checking node with selection constraints', (done: Function) => {
            let node: NodeModel = diagram.nodes[2];
            node.constraints = NodeConstraints.Default & ~NodeConstraints.Select;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 350, 350);
            expect(diagram.selectedItems.nodes.length === 0).toBe(true);
            done();
        });
        it('Checking node pointer without constraints', (done: Function) => {
            let node: NodeModel = diagram.nodes[1];
            node.constraints = NodeConstraints.Default
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 150, 150);
            expect(diagram.selectedItems.nodes[0].id === 'node2').toBe(true);
            done();
        })

        it('Checking node pointer with constraints', (done: Function) => {
            let node: NodeModel = diagram.nodes[1];

            node.constraints = diagram.removeConstraints(NodeConstraints.Default, NodeConstraints.PointerEvents);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 500, 500);
            mouseEvents.clickEvent(diagramCanvas, 150, 150);
            expect(diagram.selectedItems.nodes[0].id === 'node1').toBe(true);
            done();
        })
    });
});

describe('Testing Rotation ', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram2' });
        document.body.appendChild(ele);

        let node1: NodeModel = { id: 'node11', width: 100, height: 100, offsetX: 300, offsetY: 300 };
        let node2: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };

        diagram = new Diagram({
            width: '600px', height: '600px', nodes: [node1, node2], snapSettings: { constraints: SnapConstraints.ShowLines }
        });

        diagram.appendTo('#diagram2');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });



    it('Testing Rotation constraints', (done: Function) => {
        let node: NodeModel = diagram.nodes[1];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.Rotate;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let output: string = '';
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        let bounds: Rect = (diagram.nodes[1] as NodeModel).wrapper.bounds;
        let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, 50, bounds.center.x, bounds.center.y);
        let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
        mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + 8, rotator.y + 8, endPoint.x + 8, endPoint.y + 8);
        diagram.nodes[0].rotateAngle = Math.round(diagram.nodes[0].rotateAngle);
        diagram.nodes[0].rotateAngle = Math.round(diagram.nodes[0].rotateAngle);
        expect(bounds.topLeft.x === node.wrapper.bounds.topLeft.x).toBe(true);
        done();
    });


});
describe('Testing Dragging', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram3' });
        document.body.appendChild(ele);
        let selArray: (NodeModel | ConnectorModel)[] = [];
        let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
        let node1: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100 };
        diagram = new Diagram({
            width: 600, height: 600, nodes: [node, node1], snapSettings: { constraints: SnapConstraints.ShowLines }
            //connectors: [connector]
        });

        diagram.appendTo('#diagram3');
        selArray.push(diagram.nodes[0]);
        diagram.select(selArray);
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking selected  dragging without constraint', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 150, 150);
        mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 600, 600);
        expect(diagram.selectedItems.nodes.length === 1 && diagram.selectedItems.nodes[0].offsetX === 600 &&
            diagram.selectedItems.nodes[0].offsetY === 600).toBe(true);
        done();

    });
    it('Checking selected  dragging with constraint', (done: Function) => {
        let node: NodeModel = diagram.nodes[0];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.Drag
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 150, 150);
        mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 600, 600);
        expect(diagram.selectedItems.nodes[0].offsetX === 100 &&
            diagram.selectedItems.nodes[0].offsetY === 100).toBe(true);
        done();
    });

})
describe('Testing Resizing', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram3333' });
        document.body.appendChild(ele);
        let selArray: (NodeModel | ConnectorModel)[] = [];
        let node: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
            minWidth: 40, maxWidth: 500, minHeight: 40, maxHeight: 500
        };

        let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 500 };


        diagram = new Diagram({
            width: 600, height: 500, nodes: [node, node2], snapSettings: { constraints: SnapConstraints.ShowLines }
        });

        diagram.appendTo('#diagram3333');
        selArray.push(diagram.nodes[0]);
        diagram.select(selArray);
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });



    it('Checking  node   resizing constraint - top left', (done: Function) => {
        let node: NodeModel = diagram.nodes[0];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.ResizeNorthWest;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        let offsetLeft: number = diagram.element.offsetLeft;
        let offsetTop: number = diagram.element.offsetTop;
        //increasing size
        let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topLeft;
        let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
        mouseEvents.clickEvent(diagramCanvas, 300, 300);
        mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);
        expect(bounds.topLeft.x === node.wrapper.bounds.topLeft.x && bounds.topLeft.y === node.wrapper.bounds.topLeft.y).toBe(true);
        done();
    });

    it('Checking single node resizing constraint - top right', (done: Function) => {
        let node: NodeModel = diagram.nodes[0];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.ResizeNorthEast;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        let offsetLeft: number = diagram.element.offsetLeft;
        let offsetTop: number = diagram.element.offsetTop;
        //reducing size
        let topRight: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topRight;
        let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
        mouseEvents.clickEvent(diagramCanvas, 295, 295);
        mouseEvents.dragAndDropEvent(diagramCanvas, topRight.x, topRight.y, topRight.x - 10, topRight.y + 10);
        expect(bounds.topRight.y === node.wrapper.bounds.topRight.y && bounds.topRight.x === node.wrapper.bounds.topRight.x).toBe(true);
        done();
    });


    it('Checking single node resizing constraint - bottom left', (done: Function) => {
        let node: NodeModel = diagram.nodes[0];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.ResizeSouthWest;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        let offsetLeft: number = diagram.element.offsetLeft;
        let offsetTop: number = diagram.element.offsetTop;
        //increasing size
        let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.bottomLeft;
        let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
        mouseEvents.clickEvent(diagramCanvas, 290, 300);
        mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y + 10);
        expect(bounds.bottomLeft.x === node.wrapper.bounds.bottomLeft.x && bounds.bottomLeft.y === node.wrapper.bounds.bottomLeft.y).toBe(true);
        done();
    });

    it('Checking single node resizing constraint- bottom right', (done: Function) => {
        let node: NodeModel = diagram.nodes[0];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.ResizeSouthEast;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        let offsetLeft: number = diagram.element.offsetLeft;
        let offsetTop: number = diagram.element.offsetTop;

        //reducing size
        let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.bottomRight;
        let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
        mouseEvents.clickEvent(diagramCanvas, 285, 305);

        mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);
        expect(bounds.height === 100 && bounds.width === 100).toBe(true);
        done();
        //increasing size

    });

    it('Checking single node resizing constraint - top', (done: Function) => {
        let node: NodeModel = diagram.nodes[0];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.ResizeNorth;

        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        let offsetLeft: number = diagram.element.offsetLeft;
        let offsetTop: number = diagram.element.offsetTop;

        //reducing size

        //offset - 280, 300
        let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
        mouseEvents.clickEvent(diagramCanvas, 280, 300);
        let topCenter: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topCenter;

        //increase size at top 240, 360
        mouseEvents.dragAndDropEvent(diagramCanvas, topCenter.x, topCenter.y, topCenter.x - 10, topCenter.y - 20);
        expect(bounds.topCenter.x === node.wrapper.bounds.topCenter.x && bounds.topCenter.y === node.wrapper.bounds.topCenter.y).toBe(true);
        done();


    });

    it('Checking single node resizing constraint - bottom', (done: Function) => {
        let node: NodeModel = diagram.nodes[0];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.ResizeSouth;

        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        let offsetLeft: number = diagram.element.offsetLeft;
        let offsetTop: number = diagram.element.offsetTop;

        //reducing size

        //offset - 280, 300
        let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
        mouseEvents.clickEvent(diagramCanvas, 280, 295);
        let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.bottomCenter;

        //increase size at top 240, 360
        mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y + 20);
        expect(bounds.height === 100 && bounds.width === 100).toBe(true);
        done();

    });


    it('Checking single node resizing constraint- left', (done: Function) => {
        let node: NodeModel = diagram.nodes[0];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.ResizeWest;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        let offsetLeft: number = diagram.element.offsetLeft;
        let offsetTop: number = diagram.element.offsetTop;

        //reducing size

        //offset - 280, 300
        let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
        mouseEvents.clickEvent(diagramCanvas, 280, 300);
        let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.middleLeft;

        //increase size at top 240, 360
        mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 20, topLeft1.y + 20);
        expect(bounds.middleLeft.x === node.wrapper.bounds.middleLeft.x && bounds.middleLeft.y === node.wrapper.bounds.middleLeft.y).toBe(true);
        done();
        //size should be increased by 20, offset should be inceased by 10

    });

    it('Checking single node resizing constraint- right', (done: Function) => {
        let node: NodeModel = diagram.nodes[0];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.ResizeEast;

        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        let offsetLeft: number = diagram.element.offsetLeft;
        let offsetTop: number = diagram.element.offsetTop;
        let bounds: Rect = (diagram.nodes[0] as NodeModel).wrapper.bounds;
        mouseEvents.clickEvent(diagramCanvas, 280, 300);
        let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.middleRight;
        mouseEvents.dragAndDropEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x + 20, topLeft1.y + 20);
        expect(bounds.height === 100 && bounds.width === 100).toBe(true);
        done();
    });

});



describe('Testing Delete Constraints', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram45' });
        document.body.appendChild(ele);
        let selArray: (NodeModel | ConnectorModel)[] = [];
        let node: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
            minWidth: 40, maxWidth: 500, minHeight: 40, maxHeight: 500
        };

        let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 500 };


        diagram = new Diagram({
            width: 600, height: 600, nodes: [node, node2], snapSettings: { constraints: SnapConstraints.ShowLines }
        });

        diagram.appendTo('#diagram45');
        selArray.push(diagram.nodes[0]);
        diagram.select(selArray);
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking delete constraints', (done: Function) => {
        diagram.clearSelection();
        diagram.selectedItems.connectors = [];
        diagram.selectedItems.nodes = [];
        let node: NodeModel = diagram.nodes[0];
        node.constraints = NodeConstraints.Default & ~NodeConstraints.Delete;

        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        var temp: number = diagram.nodes.length;
        diagram.remove(diagram.nodes[0]);
        expect(diagram.nodes.length === temp).toBe(true);
        done();
    });
    it('Checking delete without constraints', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        var temp: number = diagram.nodes.length;
        diagram.remove(diagram.nodes[1]);
        //var t=node;
        expect(diagram.nodes.length != temp).toBe(true);
        done();
    })
});



describe('node inConnect outConnect without constraints', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram125' });
        document.body.appendChild(ele);
        let node1: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,

        };
        let node2: NodeModel = {
            id: 'Meeting', width: 100, height: 100, offsetX: 200, offsetY: 300,
        };
        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 200,
        };
        let node4: NodeModel = {
            id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 200,
        };
        let connector1: ConnectorModel = {};
        connector1.id = 'connector1';
        connector1.type = 'Straight';
        connector1.sourceID = node1.id;
        connector1.targetID = node2.id;

        let connector2: ConnectorModel = {};
        connector2.id = 'connector2';
        connector2.type = 'Straight';
        connector2.sourceID = node4.id;
        connector2.sourceID = node3.id;
        connector2.targetID = node4.id;

        diagram = new Diagram({
            width: 600, height: 500, nodes: [node1, node2, node3, node4],
            connectors: [connector1], snapSettings: { constraints: SnapConstraints.ShowLines }
        });
        diagram.appendTo('#diagram125');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });


    it('Checking in - out edges', (done: Function) => {
        expect((diagram.nodes[1] as Node).inEdges != undefined).toBe(true);

        expect((diagram.nodes[1] as Node).outEdges != undefined).toBe(true);
        done();
    });

})
describe('node inConnect outConnect constraints', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram555' });
        document.body.appendChild(ele);
        let node1: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
            constraints: NodeConstraints.Default & ~NodeConstraints.InConnect,


        };
        let node2: NodeModel = {
            id: 'Meeting', width: 100, height: 100, offsetX: 200, offsetY: 300,
            constraints: NodeConstraints.Default & ~NodeConstraints.OutConnect,
        };
        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 200,
            constraints: NodeConstraints.Default & ~NodeConstraints.InConnect,
        };
        let node4: NodeModel = {
            id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 200,
            constraints: NodeConstraints.Default & ~NodeConstraints.OutConnect,
        };
        let connector1: ConnectorModel = {};
        connector1.id = 'connector1';
        connector1.type = 'Straight';
        connector1.sourceID = node1.id;
        connector1.targetID = node2.id;

        let connector2: ConnectorModel = {};
        connector2.id = 'connector2';
        connector2.type = 'Straight';
        connector2.sourceID = node3.id;
        connector2.targetID = node4.id;

        diagram = new Diagram({
            width: 600, height: 500, nodes: [node1, node2, node3, node4],
            connectors: [connector1], snapSettings: { constraints: SnapConstraints.ShowLines }
        });
        diagram.appendTo('#diagram555');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });


    it('Checking in - out edges', (done: Function) => {
        expect((diagram.nodes[1] as Node).outEdges.length === 0).toBe(true);
        done();

    });

})


describe('checking lock not allowed cursor issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram5555' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { strokeWidth: 0, strokeColor: 'red' },
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                constraints: NodeConstraints.Default | NodeConstraints.Shadow,
            },
            {
                id: 'node3', width: 100, height: 100, offsetX: 600, offsetY: 100,
            },
            {
                id: 'node4', width: 100, height: 100, offsetX: 300, offsetY: 300,
            },
            {
                id: 'node44', width: 100, height: 100, offsetX: 600, offsetY: 300,
            },
            {
                id: 'node444', width: 100, height: 100, offsetX: 900, offsetY: 100,
                annotations: [{
                    id: 'label1',
                    content: 'Default Shape', style: { color: 'red' },
                    hyperlink: { link: '' }
                }],
            },
            {
                id: 'node4444', width: 100, height: 100, offsetX: 900, offsetY: 300, ports: [
                    {
                        id: 'as', visibility: PortVisibility.Visible
                    },
                    {
                        id: 'ab', visibility: PortVisibility.Visible, offset: { x: 1, y: 1 }
                    }],

            },
            {
                id: 'node56', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' },
                constraints: NodeConstraints.Default | NodeConstraints.Shadow,
            },
        ];
        let connectors: ConnectorModel[] = [{
            id: 'connector1',
            type: 'Straight',
            sourceID: 'node2',
            targetID: 'node3'
        },
        {
            id: 'connector2',
            type: 'Straight',
            sourceID: 'node2',
            targetID: 'node4'
        },]

        diagram = new Diagram({
            width: '1000px', height: '500px', nodes: nodes, connectors: connectors,
        });
        diagram.appendTo('#diagram5555');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });



    it('checking lock not allowed cursor issue along with hyperlink', function (done) {
        (diagram.nodes[5] as NodeModel).annotations[0].hyperlink.link = 'https://gitlab.syncfusion.com';
        (diagram.nodes[5] as NodeModel).constraints = NodeConstraints.Default | NodeConstraints.PointerEvents;
        diagram.dataBind();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 900, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 899, 99);
        let value: HTMLElement = document.getElementById('diagram5555_SelectorElement')
        expect((value.childNodes[1] as SVGElement).getAttribute('class') === 'e-diagram-resize-handle e-northwest e-disabled')
        var nodelement = document.getElementById('diagram5555content');

        expect(nodelement.style.cursor === 'move').toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 100);
        var nodelement = document.getElementById('diagram5555content');
        expect(nodelement.style.cursor === 'default').toBe(true);
        done();
    });
    it('checking shawdow for the path element', function (done) {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.nodes[7].id + '_content_groupElement_shadow');
        diagram.nodes[7].constraints = NodeConstraints.Default
        diagram.dataBind();
        let diagramCanvas1: HTMLElement = document.getElementById(diagram.nodes[7].id + '_content_groupElement_shadow');
        expect(diagramCanvas && !diagramCanvas1).toBe(true);
        done();
    })

});

describe('Checking Node Constraints - multiple selecion', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramNodeConstraintsMultipleSelecion' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                constraints: NodeConstraints.Default & ~NodeConstraints.ResizeNorthWest
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
            },
            {
                id: 'node3', width: 100, height: 100, offsetX: 200, offsetY: 100,
                constraints: NodeConstraints.Default & ~NodeConstraints.ResizeNorth
            },
        ];
        let connectors: ConnectorModel[] = [
            {
                id: 'connector3',
                type: 'Straight',
                sourcePoint: { x: 500, y: 100 },
                targetPoint: { x: 600, y: 200 },
                sourceDecorator: {
                    style: { fill: 'black' },
                    shape: 'Arrow',
                    pivot: { x: 0, y: 0.5 }
                },
                targetDecorator: {
                    shape: 'Diamond',
                    style: { fill: 'blue' },
                    pivot: { x: 0, y: 0.5 }
                }
            },
            {
                id: 'connector4',
                type: 'Straight',
                sourcePoint: { x: 700, y: 100 },
                targetPoint: { x: 800, y: 200 },
                sourceDecorator: {
                    style: { fill: 'black' },
                    shape: 'Arrow',
                    pivot: { x: 0, y: 0.5 }
                },
                targetDecorator: {
                    shape: 'Diamond',
                    style: { fill: 'blue' },
                    pivot: { x: 0, y: 0.5 }
                }
            },]

        diagram = new Diagram({
            width: '1000px', height: '500px', nodes: nodes, connectors: connectors,
        });
        diagram.appendTo('#diagramNodeConstraintsMultipleSelecion');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking Node Resize constraints - multiple selection', function (done) {
        diagram.select(diagram.nodes, true);
        expect(document.getElementsByClassName('e-diagram-resize-handle e-northwest e-disabled').length !== 0).toBe(true);
        expect(document.getElementsByClassName('e-diagram-resize-handle e-north e-disabled').length !== 0).toBe(true);
        done();
    });
    it('Checking Connector Resize - multiple selection', function (done) {
        diagram.clearSelection();
        diagram.select(diagram.connectors, true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas, 500, 150, 400, 150);
        expect(diagram.connectors[0].sourcePoint.x < 500 && diagram.connectors[0].sourcePoint.y == 100).toBe(true);
        expect(diagram.connectors[1].sourcePoint.x < 700 && diagram.connectors[1].sourcePoint.y == 100 &&
            diagram.connectors[1].targetPoint.x == 800 && diagram.connectors[1].targetPoint.y == 200).toBe(true);
        done();
    })

});
