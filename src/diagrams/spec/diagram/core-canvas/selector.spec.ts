import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { SelectorModel } from '../../../src/diagram/interaction/selector-model';
import { SelectorConstraints } from '../../../src/diagram/enum/enum';


/**
 * Selector spec
 */
describe('Diagram Control', () => {

    describe('Single Selection for node with pivot 0.5 in SVG rendering Mode', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramik' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node] });
            diagram.appendTo('#diagramik');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Single selection for node for pivot 0.5 in SVG rendering Mode', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(selectorModel.wrapper.actualSize.width === 100 && selectorModel.wrapper.actualSize.height === 100 && selectorModel.offsetX === 100 && selectorModel.offsetY === 100).toBe(true);
            done();
        });


        it('Checking unselect', (done: Function) => {
            diagram.unSelect(diagram.nodes[0]);
            expect(diagram.selectedItems.nodes.length === 0).toBe(true);
            done();
        });
    });

    describe('Single Selection for node with pivot 0 in SVG rendering Mode', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramim' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, pivot: { x: 0, y: 0 }, height: 100, offsetX: 100, offsetY: 100 };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node] });
            diagram.appendTo('#diagramim');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking single selection for node for pivot 0 in SVG rendering Mode', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(selectorModel.wrapper.actualSize.width === 100 && selectorModel.wrapper.actualSize.height === 100 && selectorModel.offsetX === 100 && selectorModel.offsetY === 100).toBe(true);
            done();
        });
    });

    describe('Single Selection for node with pivot 1', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramin' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, pivot: { x: 1, y: 1 }, height: 100, offsetX: 300, offsetY: 300 };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node] });
            diagram.appendTo('#diagramin');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking single selection for pivot 1 in SVG rendering Mode', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(selectorModel.wrapper.actualSize.width === 100 && selectorModel.wrapper.actualSize.height === 100 && selectorModel.offsetX === 300 && selectorModel.offsetY === 300).toBe(true);
            done();
        });
    });

    describe('Single Selection for node with pivot 1 with rotateAngle', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramio' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, pivot: { x: 1, y: 1 }, rotateAngle: 45, height: 100, offsetX: 300, offsetY: 300 };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node] });
            diagram.appendTo('#diagramio');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking single selection for pivot 1 based on rotateAngle in SVG rendering Mode', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(Math.round(selectorModel.wrapper.actualSize.width) === 100 && Math.round(selectorModel.wrapper.actualSize.height) === 100
                && Math.round(selectorModel.offsetX) === 300 && Math.round(selectorModel.offsetY) === 300).toBe(true);
            done();
        });
    });
    describe('Single Selection for connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramil' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 }
            };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, connectors: [connector1] });
            diagram.appendTo('#diagramil');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Single Selection for Connector in SVG rendering Mode', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(selectorModel.wrapper.actualSize.width === 100 && selectorModel.wrapper.actualSize.height === 100 && selectorModel.offsetX === 150 && selectorModel.offsetY === 150).toBe(true);
            done();
        });

    });

    describe('Multiple Selection for connectors', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramiweebb' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 }
            };

            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 300 },
                targetPoint: { x: 400, y: 400 }
            };

            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Orthogonal',
                sourcePoint: { x: 500, y: 500 },
                targetPoint: { x: 600, y: 600 }
            };

            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, connectors: [connector1, connector2, connector3] });
            diagram.appendTo('#diagramiweebb');
            selArray.push(diagram.connectors[0]);
            selArray.push(diagram.connectors[1]);
            selArray.push(diagram.connectors[2]);
            diagram.select(selArray, true);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Multiple Selection for Connector in SVG rendering Mode', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(selectorModel.wrapper.actualSize.width === 500 && selectorModel.wrapper.actualSize.height === 500 && selectorModel.offsetX === 350 && selectorModel.offsetY === 350).toBe(true);
            done();
        });
    });

    describe('Multiple Selection for nodes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram98' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, rotateAngle: 45, offsetX: 100, offsetY: 100 };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, rotateAngle: 90, offsetX: 300, offsetY: 300 };
            let node3: NodeModel = { id: 'node3', width: 100, height: 100, rotateAngle: 45, offsetX: 500, offsetY: 300 };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node, node2, node3] });
            diagram.appendTo('#diagram98');
            selArray.push(diagram.nodes[0]);
            selArray.push(diagram.nodes[1]);
            selArray.push(diagram.nodes[2]);
            diagram.select(selArray, true);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Multiple Selection for Nodes in SVG rendering Mode', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(Math.round(selectorModel.wrapper.actualSize.width) === 541
                && Math.round(selectorModel.wrapper.actualSize.height) === 341 && Math.round(selectorModel.offsetX) === 300
                && Math.round(selectorModel.offsetY) === 200).toBe(true);
            done();
        });
    });
    describe('Multiple Selection for nodes and connectors', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram99' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, rotateAngle: 45, offsetX: 100, offsetY: 100 };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Orthogonal',
                sourcePoint: { x: 500, y: 500 },
                targetPoint: { x: 600, y: 600 }
            };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 300 };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node, node2], connectors: [connector3] });
            diagram.appendTo('#diagram99');
            selArray.push(diagram.nodes[0]);
            selArray.push(diagram.connectors[0]);
            selArray.push(diagram.nodes[1]);
            diagram.select(selArray, true);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking multiple selection for nodes and connectors in SVG rendering Mode', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(Math.round(selectorModel.wrapper.actualSize.width) === 571 && Math.round(selectorModel.wrapper.actualSize.height) === 571 && Math.round(selectorModel.offsetX) === 315 && Math.round(selectorModel.offsetY) === 315).toBe(true);
            done();
        });
    });
    describe('Multiple Selection for nodes and connectors with removeselection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram100' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Orthogonal',
                sourcePoint: { x: 500, y: 500 },
                targetPoint: { x: 600, y: 600 }
            };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 300 };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node, node2], connectors: [connector3] });
            diagram.appendTo('#diagram100');
            selArray.push(diagram.nodes[0]);
            selArray.push(diagram.connectors[0]);
            selArray.push(diagram.nodes[1]);
            diagram.select(selArray, true);
            diagram.unSelect(diagram.connectors[0]);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking multiple selection for nodes and connectors with remove selection in SVG rendering Mode', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(Math.round(selectorModel.wrapper.actualSize.width) === 300 && Math.round(selectorModel.wrapper.actualSize.height) === 300 && Math.round(selectorModel.offsetX) === 200 && Math.round(selectorModel.offsetY) === 200).toBe(true);
            done();
        });
    });

    describe('Multiple Selection for nodes and  connectors with removeAll', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrameee' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, rotateAngle: 45, offsetX: 100, offsetY: 100 };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Orthogonal',
                sourcePoint: { x: 500, y: 500 },
                targetPoint: { x: 600, y: 600 }
            };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 300 };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node, node2], connectors: [connector3] });
            diagram.appendTo('#diagrameee');
            selArray.push(diagram.nodes[0]);
            selArray.push(diagram.connectors[0]);
            selArray.push(diagram.nodes[1]);
            diagram.select(selArray, true);
            diagram.clearSelection();
            diagram.select(selArray, true);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Multiple Selection for nodes and  connectors with removeAll in SVG rendering Mode', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(Math.round(selectorModel.wrapper.actualSize.width) === 571 && Math.round(selectorModel.wrapper.actualSize.height) === 571 && Math.round(selectorModel.offsetX) === 315 && Math.round(selectorModel.offsetY) === 315).toBe(true);
            done();
        });
    });
    describe('Connector Selection - selector constraints(ConnectorSourceThumb and ConnectorTargetThumb)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSelectorConstraintsIssue' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            diagram = new Diagram({
                mode: 'Canvas',
                width: 1000, height: 1000,
                connectors: [{ id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 } }],
                selectedItems: { constraints: (SelectorConstraints.ConnectorSourceThumb | SelectorConstraints.ConnectorTargetThumb) }
            });
            diagram.appendTo('#diagramSelectorConstraintsIssue');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking single selection for pivot 1 in SVG rendering Mode', (done: Function) => {
            expect(document.getElementsByClassName('e-diagram-endpoint-handle e-targetend')[0].getAttribute('visibility') == 'visible').toBe(true);
            expect(document.getElementsByClassName('e-diagram-endpoint-handle e-targetend')[1].getAttribute('visibility') == 'visible').toBe(true);
            done();
        });
    });
});