import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { MouseEvents } from './mouseevents.spec';
import { ConnectorModel, BpmnFlowModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { SelectorModel } from '../../../src/diagram/objects/node-model';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
import { NodeConstraints, SnapConstraints } from '../../../src/diagram/enum/enum';
import { IDraggingEventArgs } from '../../../src/diagram/objects/interface/IElement'

/**
 * Selector spec
 */
describe('Diagram Control', () => {

    describe('Single Selection for node with pivot 0.5', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramik' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node] });
            diagram.appendTo('#diagramik');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Single selection for node for pivot 0.5', (done: Function) => {
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

    describe('Single Selection for node with pivot 0', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramim' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, pivot: { x: 0, y: 0 }, height: 100, offsetX: 100, offsetY: 100 };
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node] });
            diagram.appendTo('#diagramim');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking single selection for node for pivot 0', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(selectorModel.wrapper.actualSize.width === 100
                && selectorModel.wrapper.actualSize.height === 100
                && selectorModel.offsetX === 100 && selectorModel.offsetY === 100).toBe(true);
            done();
        });
    });

    describe('Single Selection for node with pivot 1', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramin' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, pivot: { x: 1, y: 1 }, height: 100, offsetX: 300, offsetY: 300 };
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node] });
            diagram.appendTo('#diagramin');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking single selection for pivot 1', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(selectorModel.wrapper.actualSize.width === 100 && selectorModel.wrapper.actualSize.height === 100 && selectorModel.offsetX === 300 && selectorModel.offsetY === 300).toBe(true);
            done();
        });
    });

    describe('Single Selection for node with pivot 1 with rotateAngle', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramio' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, pivot: { x: 1, y: 1 }, rotateAngle: 45, height: 100, offsetX: 300, offsetY: 300 };
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node] });
            diagram.appendTo('#diagramio');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking single selection for pivot 1 based on rotateAngle', (done: Function) => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramil' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 }
            };
            diagram = new Diagram({ width: 1000, height: 1000, connectors: [connector1] });
            diagram.appendTo('#diagramil');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Single Selection for Connector', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(selectorModel.wrapper.actualSize.width === 100 && selectorModel.wrapper.actualSize.height === 100 && selectorModel.offsetX === 150 && selectorModel.offsetY === 150).toBe(true);
            done();
        });
    });

    describe('Multiple Selection for connectors', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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

            diagram = new Diagram({ width: 1000, height: 1000, connectors: [connector1, connector2, connector3] });
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

        it('Checking Multiple Selection for Connector', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(selectorModel.wrapper.actualSize.width === 500 && selectorModel.wrapper.actualSize.height === 500 && selectorModel.offsetX === 350 && selectorModel.offsetY === 350).toBe(true);
            done();
        });
    });

    describe('Multiple Selection for nodes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram98' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, rotateAngle: 45, offsetX: 100, offsetY: 100 };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, rotateAngle: 90, offsetX: 300, offsetY: 300 };
            let node3: NodeModel = { id: 'node3', width: 100, height: 100, rotateAngle: 45, offsetX: 500, offsetY: 300 };
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node, node2, node3] });
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

        it('Checking Multiple Selection for Nodes', (done: Function) => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node, node2], connectors: [connector3] });
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

        it('Checking multiple selection for nodes and connectors', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(Math.round(selectorModel.wrapper.actualSize.width) === 571 && Math.round(selectorModel.wrapper.actualSize.height) === 571 && Math.round(selectorModel.offsetX) === 315 && Math.round(selectorModel.offsetY) === 315).toBe(true);
            done();
        });
    });
    describe('Multiple Selection for nodes and connectors with removeselection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node, node2], connectors: [connector3] });
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

        it('Checking multiple selection for nodes and connectors with remove selection', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(Math.round(selectorModel.wrapper.actualSize.width) === 300 && Math.round(selectorModel.wrapper.actualSize.height) === 300 && Math.round(selectorModel.offsetX) === 200 && Math.round(selectorModel.offsetY) === 200).toBe(true);
            done();
        });
    });

    describe('Multiple Selection for nodes and  connectors with removeAll', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node, node2], connectors: [connector3] });
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

        it('Checking Multiple Selection for nodes and  connectors with removeAll', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(Math.round(selectorModel.wrapper.actualSize.width) === 571 && Math.round(selectorModel.wrapper.actualSize.height) === 571 && Math.round(selectorModel.offsetX) === 315 && Math.round(selectorModel.offsetY) === 315).toBe(true);
            done();
        });

        it('Checking deleting multiple selection', (done: Function) => {
            diagram.selectAll();
            diagram.remove();
            expect(diagram.nodes.length).toBe(0);
            expect(diagram.connectors.length).toBe(0);
            done();
        });
    });
    describe('Select All the connectors, No node should be in diagram', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramfff' });
            document.body.appendChild(ele);

            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Orthogonal',
                sourcePoint: { x: 500, y: 500 },
                targetPoint: { x: 600, y: 600 }
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 300 },
                targetPoint: { x: 400, y: 400 }
            };
            diagram = new Diagram({ width: 1000, height: 1000, connectors: [connector3, connector2] });
            diagram.appendTo('#diagramfff');

            diagram.selectAll();

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Multiple Selection for nodes and  connectors with removeAll', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.mouseMoveEvent(diagramCanvas, 150, 150);
            let selectorModel: SelectorModel = diagram.selectedItems;
            expect(Math.round(selectorModel.wrapper.actualSize.width) === 300 && Math.round(selectorModel.wrapper.actualSize.height) === 300 && Math.round(selectorModel.offsetX) === 450 && Math.round(selectorModel.offsetY) === 450).toBe(true);
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
    describe('Select All the connectors, No node should be in diagram', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramRotateThumb' });
            document.body.appendChild(ele);

            let node = {
                offsetX: 250,
                offsetY: 250,
                width: 100,
                height: 100,
                annotations: [
                    {
                        content: "Keep this way up",
                    }
                ],
                constraints: NodeConstraints.Default & ~NodeConstraints.Rotate // Default except rotate
            };

            let node2 = {
                offsetX: 550,
                offsetY: 250,
                width: 100,
                height: 100,
                annotations: [
                    {
                        content: "Spin me",
                    }
                ],
            };

            let connector = {
                sourcePoint: {
                    x: 350,
                    y: 250,
                },
                targetPoint: {
                    x: 450,
                    y: 250,
                }
            }

            diagram = new Diagram({
                width: '100%',
                height: '600px',
                nodes: [node, node2],
                connectors: [connector],
            });

            diagram.appendTo('#diagramRotateThumb');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Check rotate thumb for multiple selection when rotate for one node is disabled', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 550, 250, true);
            events.clickEvent(diagramCanvas, 400, 250, true);
            expect(document.getElementById('rotateThumb') !== null && document.getElementById('pivotLine') !== null).toBe(true);
            events.clickEvent(diagramCanvas, 100, 100);
            events.clickEvent(diagramCanvas, 250, 250, true);
            events.clickEvent(diagramCanvas, 400, 250, true);
            expect(document.getElementById('rotateThumb') !== null && document.getElementById('pivotLine') !== null).toBe(false);
            events.clickEvent(diagramCanvas, 100, 100);
            events.clickEvent(diagramCanvas, 250, 250, true);
            events.clickEvent(diagramCanvas, 550, 250, true);
            expect(document.getElementById('rotateThumb') !== null && document.getElementById('pivotLine') !== null).toBe(false);
            events.clickEvent(diagramCanvas, 100, 100);
            events.clickEvent(diagramCanvas, 550, 250, true);
            events.clickEvent(diagramCanvas, 250, 250, true);
            expect(document.getElementById('rotateThumb') !== null && document.getElementById('pivotLine') !== null).toBe(false);
            done();
        });
    });
    describe('EJ2-44023-PositionChange event does not gets triggered for completed state', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram99' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];

            let nodes: NodeModel[] = [
                {
                    id: "sdlc",
                    offsetX: 300,
                    offsetY: 288,
                    annotations: [{ content: "SDLC" }]
                },
                {
                    id: "support",
                    offsetX: 150,
                    offsetY: 250, width: 150,
                    height: 150,
                    annotations: [{ content: "Support" }]
                },
                {
                    id: "analysis",
                    offsetX: 300,
                    offsetY: 150,
                    annotations: [{ content: "Analysis" }]
                },
                {
                    id: "design",
                    offsetX: 450,
                    offsetY: 250,
                    annotations: [{ content: "Design" }]
                },
                {
                    id: "implement",
                    offsetX: 400,
                    offsetY: 400,
                    annotations: [{ content: "implement" }]
                },
                {
                    id: "deploy",
                    offsetX: 200,
                    offsetY: 400,
                    annotations: [{ content: "Deploy" }]
                }
            ];

            let connections: ConnectorModel[] = [
                { id: "connector1", sourceID: "analysis", targetID: "design" },
                { id: "connector2", sourceID: "design", targetID: "implement" },
                { id: "connector3", sourceID: "implement", targetID: "deploy" },
                { id: "connector4", sourceID: "deploy", targetID: "support" },
                { id: "connector5", sourceID: "support", targetID: "analysis" }
            ];
            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes, connectors: connections, positionChange: position });
            diagram.appendTo('#diagram99');
            selArray.push(diagram.nodes[1]);
            selArray.push(diagram.connectors[3]);
            selArray.push(diagram.connectors[4]);
            diagram.select(selArray, true);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        function position(args: IDraggingEventArgs): void {
            if (args.state === "Completed") {
                console.log("positionChange", args);
            }
        }
        it('PositionChange event does not gets triggered for completed state', (done: Function) => {
            
            let events: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.mouseDownEvent(diagramCanvas, 120, 200);
            events.mouseMoveEvent(diagramCanvas, 100, 335);
            events.mouseUpEvent(diagramCanvas, 100, 335);
            diagram.positionChange = (args: IDraggingEventArgs) => {
                args.cancel = true;
                if (args.state === 'Completed') {
                    expect(args.newValue.offsetX == 167.5 &&
                        args.newValue.offsetY == 312.5).toBe(true);
                }
            };
            done();
        });
    });
    describe('Node-Highlight feature', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let events: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram99' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 50 }, targetPoint: { x: 450, y: 150 }, annotations: [{ content: 'Connector1' }]
            };
            let connector2: ConnectorModel = {
                id: 'connector2', sourcePoint: { x: 400, y: 300 }, targetPoint: { x: 550, y: 450 }, annotations: [{ content: 'Connector2' }],
                type: 'Orthogonal'
            };
            let connector3: ConnectorModel = {
                id: 'connector3', type: 'Bezier',
                sourcePoint: { x: 600, y: 100 },
                targetPoint: { x: 500, y: 250 },
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2' }],
                shape: { type: 'Basic', shape: 'Triangle' }
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3' }],
                shape: { type: 'Basic', shape: 'Ellipse' }
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 100, offsetY: 450, annotations: [{ content: 'Node3' }],
                shape: { type: 'Flow', shape: 'Decision' }
            };
            diagram = new Diagram({
                width: '100%', height: '900px', nodes: [node, node2, node3, node4], connectors: [connector, connector2, connector3],
            });
            diagram.appendTo('#diagram99');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Check node selection rect is rendered or not', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 100, 100);
            events.clickEvent(diagramCanvas, 200, 200, true);
            var element = document.getElementById('node1_highlighter');
            expect(element !== null).toBe(true);
            done();
        });
        it('Check whether objects are pushed in correct order in selected objects', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            expect(diagram.selectedItems.selectedObjects.length === 2).toBe(true);
            expect(diagram.selectedItems.selectedObjects[0].id === "node1" && diagram.selectedItems.selectedObjects[1].id === "node2").toBe(true);
            done();
        });
        it('Check first node selection rectangle stroke color and stroke width', (done: Function) => {
            var element = document.getElementById('node1_highlighter');
            expect(element.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(element.getAttribute('stroke-width') === "2").toBe(true);
            done();
        });
        it('Check second node selection rectangle stroke color and stroke width', (done: Function) => {
            var element = document.getElementById('node2_highlighter');
            expect(element.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(element.getAttribute('stroke-width') === "1").toBe(true);
            done();
        });
        it('Clear selection and check selection element is rendered or not', (done: Function) => {
            diagram.clearSelection();
            var element = document.getElementById('node1_highlighter');
            var element2 = document.getElementById('node2_highlighter');
            expect(element === null && element2 === null).toBe(true);
            done();
        });
        it('Multi select the nodes using ctrl', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 100, 100);
            events.clickEvent(diagramCanvas, 200, 200, true);
            events.clickEvent(diagramCanvas, 300, 350, true);
            expect(diagram.selectedItems.selectedObjects.length === 3).toBe(true);
            expect(diagram.selectedItems.selectedObjects[0].id === "node1" && diagram.selectedItems.selectedObjects[1].id === "node2" &&
            diagram.selectedItems.selectedObjects[2].id === "node3").toBe(true);
            done();
        });
        it('Remove the middle node and check selection rectangle', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 100, 100);
            events.clickEvent(diagramCanvas, 200, 200, true);
            events.clickEvent(diagramCanvas, 300, 350, true);
            events.clickEvent(diagramCanvas, 200, 200, true);
            var element = document.getElementById('node1_highlighter');
            var element2 = document.getElementById('node3_highlighter');
            expect(element !== null && element2 !== null).toBe(true);
            done();
        });
        it('Remove the middle node and check selected objects length', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 100, 100);
            events.clickEvent(diagramCanvas, 200, 200, true);
            events.clickEvent(diagramCanvas, 300, 350, true);
            events.clickEvent(diagramCanvas, 200, 200, true);
            expect(diagram.selectedItems.selectedObjects.length === 2).toBe(true);
            expect(diagram.selectedItems.selectedObjects[0].id === "node1" && diagram.selectedItems.selectedObjects[1].id === "node3").toBe(true);
            done();
        });
    });
    describe('Rubber band selection - Node-Highlight feature', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let events: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram99' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 50 }, targetPoint: { x: 450, y: 150 }, annotations: [{ content: 'Connector1' }]
            };
            let connector2: ConnectorModel = {
                id: 'connector2', sourcePoint: { x: 400, y: 300 }, targetPoint: { x: 550, y: 450 }, annotations: [{ content: 'Connector2' }],
                type: 'Orthogonal'
            };
            let connector3: ConnectorModel = {
                id: 'connector3', type: 'Bezier',
                sourcePoint: { x: 600, y: 100 },
                targetPoint: { x: 500, y: 250 },
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2' }],
                shape: { type: 'Basic', shape: 'Triangle' }
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3' }],
                shape: { type: 'Basic', shape: 'Ellipse' }
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 100, offsetY: 450, annotations: [{ content: 'Node3' }],
                shape: { type: 'Flow', shape: 'Decision' }
            };
            diagram = new Diagram({
                width: '100%', height: '900px', nodes: [node, node2, node3, node4], connectors: [connector, connector2, connector3],
            });
            diagram.appendTo('#diagram99');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        
        it('Check node selection rect is rendered or not on rubber band selection', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.dragAndDropEvent(diagramCanvas, 40, 20, 400, 550);
            var element = document.getElementById('node1_highlighter');
            var element2 = document.getElementById('node2_highlighter');
            var element3 = document.getElementById('node3_highlighter');
            var element4 = document.getElementById('node4_highlighter');
            expect(element !== null && element2 !== null && element3 !== null && element4 !== null).toBe(true);
            expect(diagram.selectedItems.selectedObjects.length === 4).toBe(true);
            done();
        });
        it('Check whether objects are pushed in correct order in rubber band selection', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.dragAndDropEvent(diagramCanvas, 40, 20, 400, 550);
            expect(diagram.selectedItems.selectedObjects.length === 4).toBe(true);
            expect(diagram.selectedItems.selectedObjects[0].id === "node1" && diagram.selectedItems.selectedObjects[1].id === "node2" &&
            diagram.selectedItems.selectedObjects[2].id === "node3" && diagram.selectedItems.selectedObjects[3].id === "node4").toBe(true);
            done();
        });
        it('Remove First node from selection and check whether selection rect rendered or not', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.dragAndDropEvent(diagramCanvas, 40, 20, 400, 550);
            events.clickEvent(diagramCanvas, 100, 100, true);
            var element = document.getElementById('node1_highlighter');
            expect(element === null).toBe(true);
            done();
        });
        it('Remove First node from selection and check element attributes', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            var element = document.getElementById('node2_highlighter');
            expect(element.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(element.getAttribute('stroke-width') === "2").toBe(true);
            done();
        });
        it('Remove First node from selection and check selection rect', (done: Function) => {
            
            var element2 = document.getElementById('node2_highlighter');
            var element3 = document.getElementById('node3_highlighter');
            var element4 = document.getElementById('node4_highlighter');
            expect(element2 !== null && element3 !== null && element4 !== null).toBe(true);
            expect(diagram.selectedItems.selectedObjects.length === 3).toBe(true);
            done();
        });
    });
    describe('Group Selection - Node-Highlight feature', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let events: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram99' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 50 }, targetPoint: { x: 450, y: 150 }, annotations: [{ content: 'Connector1' }]
            };
            let connector2: ConnectorModel = {
                id: 'connector2', sourcePoint: { x: 400, y: 300 }, targetPoint: { x: 550, y: 450 }, annotations: [{ content: 'Connector2' }],
                type: 'Orthogonal'
            };
            let connector3: ConnectorModel = {
                id: 'connector3', type: 'Bezier',
                sourcePoint: { x: 600, y: 100 },
                targetPoint: { x: 500, y: 250 },
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2' }],
                shape: { type: 'Basic', shape: 'Triangle' }
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3' }],
                shape: { type: 'Basic', shape: 'Ellipse' }
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 100, offsetY: 450, annotations: [{ content: 'Node3' }],
                shape: { type: 'Flow', shape: 'Decision' }
            };
            diagram = new Diagram({
                width: '100%', height: '900px', nodes: [node, node2, node3, node4], connectors: [connector, connector2, connector3],
            });
            diagram.appendTo('#diagram99');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        
        it('Group all nodes and check selection rect element', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.dragAndDropEvent(diagramCanvas, 40, 20, 400, 550);
            diagram.group();
            var element = document.getElementById('node1_highlighter');
            var element2 = document.getElementById('node2_highlighter');
            var element3 = document.getElementById('node3_highlighter');
            var element4 = document.getElementById('node4_highlighter');
            expect(element === null && element2 === null && element3 === null && element4 === null).toBe(true);
            expect(diagram.selectedItems.selectedObjects.length === 1).toBe(true);
            diagram.unGroup();
            done();
        });

        it('Group two node and select other node', (done: Function) => {
            diagram.clearSelection();
            diagram.select([diagram.nodes[0], diagram.nodes[1]]);
            diagram.group();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 300, 350, true);
            var groupElement = document.getElementById(diagram.selectedItems.selectedObjects[0].id + "_highlighter");
            var element3 = document.getElementById('node3_highlighter');
            expect( groupElement !== null && element3 !== null).toBe(true);
            expect(diagram.selectedItems.selectedObjects.length === 2).toBe(true);
            done();
        });

        it('Check group node selection rect stroke width', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 100, 100);
            events.clickEvent(diagramCanvas, 300, 350, true);
            var groupElement = document.getElementById(diagram.selectedItems.selectedObjects[0].id + "_highlighter");
            var element3 = document.getElementById('node3_highlighter');
            expect(groupElement.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(groupElement.getAttribute('stroke-width') === "2").toBe(true);
            expect(element3.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(element3.getAttribute('stroke-width') === "1").toBe(true);
            done();
        });

        it('Select node first and select group node second', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 300, 350);
            events.clickEvent(diagramCanvas, 100, 100, true);
            var groupElement = document.getElementById(diagram.selectedItems.selectedObjects[0].id + "_highlighter");
            var element3 = document.getElementById('node3_highlighter');
            expect(groupElement.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(groupElement.getAttribute('stroke-width') === "2").toBe(true);
            expect(element3.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(element3.getAttribute('stroke-width') === "2").toBe(true);
            done();
        });

        it('Remove first node from selection and check whether group moves to first position', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 300, 350);
            events.clickEvent(diagramCanvas, 100, 100, true);
            events.clickEvent(diagramCanvas, 100, 450, true);
            events.clickEvent(diagramCanvas, 300, 350, true);
            var groupElement = document.getElementById(diagram.selectedItems.selectedObjects[0].id + "_highlighter");
            var element3 = document.getElementById('node4_highlighter');
            expect(groupElement.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(groupElement.getAttribute('stroke-width') === "2").toBe(true);
            expect(element3.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(element3.getAttribute('stroke-width') === "1").toBe(true);
            done();
        });

        it('Remove first node from selection and check whether group moves to first position in selection list', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 300, 350);
            events.clickEvent(diagramCanvas, 100, 100, true);
            events.clickEvent(diagramCanvas, 100, 450, true);
            events.clickEvent(diagramCanvas, 300, 350, true);
            expect(diagram.selectedItems.selectedObjects.length === 2).toBe(true);
            done();
        });
        
    });
    describe('Connector Selection - Node-Highlight feature', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let events: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram99' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 50 }, targetPoint: { x: 450, y: 150 }, annotations: [{ content: 'Connector1' }]
            };
            let connector2: ConnectorModel = {
                id: 'connector2', sourcePoint: { x: 400, y: 300 }, targetPoint: { x: 550, y: 450 }, annotations: [{ content: 'Connector2' }],
                type: 'Orthogonal'
            };
            let connector3: ConnectorModel = {
                id: 'connector3', type: 'Bezier',
                sourcePoint: { x: 600, y: 100 },
                targetPoint: { x: 500, y: 250 },
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2' }],
                shape: { type: 'Basic', shape: 'Triangle' }
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3' }],
                shape: { type: 'Basic', shape: 'Ellipse' }
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 100, offsetY: 450, annotations: [{ content: 'Node3' }],
                shape: { type: 'Flow', shape: 'Decision' }
            };
            diagram = new Diagram({
                width: '100%', height: '900px', nodes: [node, node2, node3, node4], connectors: [connector, connector2, connector3],
            });
            diagram.appendTo('#diagram99');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        
        it('Check connector selection line is rendered or not', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.connectors[0], diagram.connectors[1]]);
            var element = document.getElementById('connector1_path_highlighter');
            var element2 = document.getElementById('connector2_path_highlighter');
            expect(element !== null && element2 !== null).toBe(true);
            done();
        });

        it('Check connector selection line stroke and stroke width', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.connectors[0], diagram.connectors[1]]);
            var element = document.getElementById('connector1_path_highlighter');
            var element2 = document.getElementById('connector2_path_highlighter');
            expect(element.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(element.getAttribute('stroke-width') === "2").toBe(true);
            expect(element2.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(element2.getAttribute('stroke-width') === "1").toBe(true);
            done();
        });

        it('Select both node and connector', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.dragAndDropEvent(diagramCanvas, 40, 20, 550, 400);
            var element = document.getElementById('node1_highlighter');
            var element2 = document.getElementById('connector1_path_highlighter');
            expect(element.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(element.getAttribute('stroke-width') === "2").toBe(true);
            expect(element2.getAttribute('stroke') === "#00cc00").toBe(true);
            expect(element2.getAttribute('stroke-width') === "1").toBe(true);
            done();
        });

        it('Select both node and connector and check selected objects', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.dragAndDropEvent(diagramCanvas, 40, 20, 550 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            expect(diagram.selectedItems.selectedObjects.length === 4).toBe(true);
            done();
        });

        it('Select connector 1st and node 2nd', (done: Function) => {
            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.connectors[1], diagram.nodes[1], diagram.nodes[0]]);
            expect(diagram.selectedItems.selectedObjects.length === 3).toBe(true);
            expect(diagram.selectedItems.selectedObjects[0].id === "connector2" && diagram.selectedItems.selectedObjects[1].id === "node2" &&
            diagram.selectedItems.selectedObjects[2].id === "node1").toBe(true);
            done();
        });
        
    });
});
// describe('834641-Support to unselect the diagram element that is already selected ', () => {
//     let diagram: Diagram;
//     let ele: HTMLElement;

//     let mouseEvents: MouseEvents = new MouseEvents();
//     beforeAll((): void => {
//         const isDef = (o: any) => o !== undefined && o !== null;
//         if (!isDef(window.performance)) {
//             console.log("Unsupported environment, window.performance.memory is unavailable");
//             this.skip(); //Skips test (in Chai)
//             return;
//         }
//         ele = createElement('div', { id: 'diagramSelect' });
//         document.body.appendChild(ele);
//         let nodeA: NodeModel = {
//             id: 'nodeA', offsetX: 200, offsetY: 100, height: 100, width: 100
//         };
//         let con: ConnectorModel = { id: 'connectorA', sourcePoint: { x: 400, y: 100 }, targetPoint: { x: 500, y: 200 } }
//         diagram = new Diagram({
//             width: 750, height: 750,
//             nodes: [nodeA], connectors: [con],
//             snapSettings: { constraints: SnapConstraints.ShowLines }
//         });
//         diagram.selectedItems.canToggleSelection = true;
//         diagram.appendTo('#diagramSelect');
//     });

//     afterAll((): void => {
//         diagram.destroy();
//         ele.remove();
//     });
//     it('select and unselect node and connector', (done: Function) => {
//         let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
//         mouseEvents.clickEvent(diagramCanvas, 200, 100);
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 200, 100);
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 480, 180);
//         expect(diagram.selectedItems.connectors.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 480, 180);
//         expect(diagram.selectedItems.connectors.length == 0).toBe(true)
//         done();
//     });
//     it('select and unselect group', (done: Function) => {
//         let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
//         diagram.add({ id: 'group', children: ['nodeA', 'connectorA'] });//group a node and connector
//         mouseEvents.clickEvent(diagramCanvas, 350, 150);//select group
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 250, 150);//select node in that group
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 250, 150);//unselect node in that group
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true)//now nothing is selected
//         mouseEvents.clickEvent(diagramCanvas, 480, 180);//select the group
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 480, 180);//select the connector in group
//         expect(diagram.selectedItems.connectors.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 480, 180);//unselct the connector in group
//         expect(diagram.selectedItems.connectors.length == 0).toBe(true)//no selected objects
//         mouseEvents.clickEvent(diagramCanvas, 480, 180);//again can select the  group
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         done();
//     });
//     it('selection change', (done: Function) => {
//         let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
//         mouseEvents.clickEvent(diagramCanvas, 200, 100);
//         diagram.selectionChange = function (args) {
//             expect(args.oldValue == '' && args.newValue[0].id === 'NodeA').toBe(true);
//             done();
//         }
//         mouseEvents.clickEvent(diagramCanvas, 200, 100);
//         diagram.selectionChange = function (args) {
//             expect(args.oldValue[0].id == 'NodeA' && args.newValue == '').toBe(true);
//             done();
//         }
//     });
// });
// describe('834641-Support to unselect the diagram element that is already selected in swimlane ', () => {
//     let diagram: Diagram;
//     let ele: HTMLElement;
//     let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
//         ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
//         '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
//     let mouseEvents: MouseEvents = new MouseEvents();
//     beforeAll((): void => {
//         const isDef = (o: any) => o !== undefined && o !== null;
//         if (!isDef(window.performance)) {
//             console.log("Unsupported environment, window.performance.memory is unavailable");
//             this.skip(); //Skips test (in Chai)
//             return;
//         }
//         ele = createElement('div', { id: 'diagramSwimlane' });
//         document.body.appendChild(ele);
//         let nodes: NodeModel[] = [
//             {
//                 id: 'swimlane',
//                 shape: {
//                     type: 'SwimLane',
//                     orientation: 'Horizontal',
//                     header: {
//                         annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
//                         height: 50, style: { fontSize: 11 },
//                     },
//                     lanes: [
//                         {
//                             id: 'stackCanvas1',
//                             header: {
//                                 annotation: { content: 'CUSTOMER' }, width: 50,
//                                 style: { fontSize: 11 }
//                             },
//                             height: 100,
//                             children: [
//                                 {
//                                     id: 'Order',
//                                     shape: { type: 'Path', data: pathData },
//                                     annotations: [
//                                         {
//                                             content: 'ORDER',
//                                             style: { fontSize: 11 }
//                                         }
//                                     ],
//                                     margin: { left: 60, top: 20 },
//                                     height: 40, width: 100
//                                 }
//                             ],
//                         },
//                         {
//                             id: 'stackCanvas2',
//                             header: {
//                                 annotation: { content: 'ONLINE' }, width: 50,
//                                 style: { fontSize: 11 }
//                             },
//                             height: 100,
//                             children: [
//                                 {
//                                     id: 'selectItemaddcart',
//                                     annotations: [{ content: 'Select item\nAdd cart' }],
//                                     margin: { left: 190, top: 20 },
//                                     height: 40, width: 100
//                                 },
//                                 {
//                                     id: 'paymentondebitcreditcard',
//                                     annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
//                                     margin: { left: 350, top: 20 },
//                                     height: 40, width: 100
//                                 }
//                             ],
//                         },
//                         {
//                             id: 'stackCanvas3',
//                             header: {
//                                 annotation: { content: 'SHOP' }, width: 50,
//                                 style: { fontSize: 11 }
//                             },
//                             height: 100,
//                             children: [
//                                 {
//                                     id: 'getmaildetailaboutorder',
//                                     annotations: [{ content: 'Get mail detail\nabout order' }],
//                                     margin: { left: 190, top: 20 },
//                                     height: 40, width: 100
//                                 },
//                                 {
//                                     id: 'pakingitem',
//                                     annotations: [{ content: 'Paking item' }],
//                                     margin: { left: 350, top: 20 },
//                                     height: 40, width: 100
//                                 }
//                             ],
//                         },
//                         {
//                             id: 'stackCanvas4',
//                             header: {
//                                 annotation: { content: 'DELIVERY' }, width: 50,
//                                 style: { fontSize: 11 }
//                             },
//                             height: 100,
//                             children: [
//                                 {
//                                     id: 'sendcourieraboutaddress',
//                                     annotations: [{ content: 'Send Courier\n about Address' }],
//                                     margin: { left: 190, top: 20 },
//                                     height: 40, width: 100
//                                 },
//                                 {
//                                     id: 'deliveryonthataddress',
//                                     annotations: [{ content: 'Delivery on that\n Address' }],
//                                     margin: { left: 350, top: 20 },
//                                     height: 40, width: 100
//                                 },
//                                 {
//                                     id: 'getitItem',
//                                     shape: { type: 'Path', data: pathData },
//                                     annotations: [{ content: 'GET IT ITEM', style: { fontSize: 11 } }],
//                                     margin: { left: 500, top: 20 },
//                                     height: 40, width: 100
//                                 }
//                             ],
//                         },
//                     ],
//                     phases: [
//                         {
//                             id: 'phase1', offset: 170,
//                             header: { annotation: { content: 'Phase' } }
//                         },
//                         {
//                             id: 'phase2', offset: 450,
//                             header: { annotation: { content: 'Phase' } }
//                         },
//                     ],
//                     phaseSize: 20,
//                 },
//                 offsetX: 420, offsetY: 270,
//                 height: 100,
//                 width: 650
//             },
//         ];
//         let connectors: ConnectorModel[] = [
//             {
//                 id: 'connector1', sourceID: 'Order',
//                 targetID: 'selectItemaddcart'
//             },
//             {
//                 id: 'connector2', sourceID: 'selectItemaddcart',
//                 targetID: 'paymentondebitcreditcard'
//             },
//             {
//                 id: 'connector3', sourceID: 'paymentondebitcreditcard',
//                 targetID: 'getmaildetailaboutorder'
//             },
//             {
//                 id: 'connector4', sourceID: 'getmaildetailaboutorder',
//                 targetID: 'pakingitem'
//             },
//             {
//                 id: 'connector5', sourceID: 'pakingitem',
//                 targetID: 'sendcourieraboutaddress'
//             },
//             {
//                 id: 'connector6', sourceID: 'sendcourieraboutaddress',
//                 targetID: 'deliveryonthataddress'
//             },
//             {
//                 id: 'connector7', sourceID: 'deliveryonthataddress',
//                 targetID: 'getitItem'
//             },
//         ];
//         diagram = new Diagram({
//             width: 1000, height: 1000,
//             getConnectorDefaults: function getConnectorDefaults(connector: ConnectorModel) {
//                 connector.type = 'Orthogonal';
//             },
//             nodes: nodes, connectors: connectors,
//         });
//         diagram.selectedItems.canToggleSelection = true;
//         diagram.appendTo('#diagramSwimlane');
//     });

//     afterAll((): void => {
//         diagram.destroy();
//         ele.remove();
//     });
//     it('select and unselect node and connector in Swimlane', (done: Function) => {
        
//         let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
//         mouseEvents.clickEvent(diagramCanvas, 220, 150);//select node in swimlane
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 220, 150);
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 422, 286);//select connector in swimlane
//         expect(diagram.selectedItems.connectors.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 422, 286);
//         expect(diagram.selectedItems.connectors.length == 0).toBe(true)
//         done();
//     });
//     it('select and unselect lane phase and header in Swimlane', (done: Function) => {
//         let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
//         mouseEvents.clickEvent(diagramCanvas, 200, 63);//select header
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 200, 62);
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 236, 95);//select phase
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 236, 95);
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 120, 290);//select Lane
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 120, 290);
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true)
//         done();
//     });
//     it('select and unselect node and connector after selecting Lane', (done: Function) => {
//         let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
//         mouseEvents.clickEvent(diagramCanvas, 120, 290);//select Lane
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 220, 150);//select node in Lane
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 220, 150);//unselect node in Lane
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 120, 290);//select Lane
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 422, 286);//select connector in Lane
//         expect(diagram.selectedItems.connectors.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 422, 286);//unselect connector in Lane
//         expect(diagram.selectedItems.connectors.length == 0).toBe(true)
//         done();
//     });
//     it('select and unselect node and connector after selecting Phase', (done: Function) => {
//         let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
//         mouseEvents.clickEvent(diagramCanvas, 236, 95);//select phase
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 220, 150);//select node in phase
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 220, 150);//unselect node in phase
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 120, 290);//select phase
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 422, 286);//select connector in phase
//         expect(diagram.selectedItems.connectors.length == 1).toBe(true)
//         mouseEvents.clickEvent(diagramCanvas, 422, 286);//unselect connector in phase
//         expect(diagram.selectedItems.connectors.length == 0).toBe(true)
//         done();
//     });
// });
// describe('834641-Support to unselect the diagram element that is already selected in BPMN editor', () => {
//     let diagram: Diagram;
//     let ele: HTMLElement;
//     let mouseEvents: MouseEvents = new MouseEvents();
//     beforeAll((): void => {
//         const isDef = (o: any) => o !== undefined && o !== null;
//             if (!isDef(window.performance)) {
//                 console.log("Unsupported environment, window.performance.memory is unavailable");
//                 this.skip(); //Skips test (in Chai)
//                 return;
//             }
//         ele = createElement('div', { id: 'diagrambpmn' });
//         document.body.appendChild(ele);
//         let nodes: NodeModel[] = [
//             {
//                 id: 'start', width: 40, height: 40, offsetX: 35, offsetY: 180, shape: {
//                     type: 'Bpmn', shape: 'Event',
//                     event: { event: 'Start' }
//                 }
//             },
//             {
//                 id: 'subProcess', width: 520, height: 250, offsetX: 355, offsetY: 180,
//                 constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
//                 shape: {
//                     shape: 'Activity', type: 'Bpmn',
//                     activity: {
//                         activity: 'SubProcess', subProcess: {
//                             type: 'Transaction', collapsed: false,
//                             processes: ['processesStart', 'service', 'compensation', 'processesTask',
//                                 'error', 'processesEnd', 'user', 'subProcessesEnd']
//                         }
//                     }
//                 }
//             },
//             {
//                 id: 'hazardEnd', width: 40, height: 40, offsetX: 305, offsetY: 370, shape: {
//                     type: 'Bpmn', shape: 'Event',
//                     event: { event: 'End' },
//                 }, annotations: [{
//                     id: 'label2', content: 'Hazard',
//                     style: { fill: 'white', color: 'black' }, verticalAlignment: 'Top', margin: { top: 20 }
//                 }]
//             },
//             {
//                 id: 'cancelledEnd', width: 40, height: 40, offsetX: 545, offsetY: 370, shape: {
//                     type: 'Bpmn', shape: 'Event',
//                     event: { event: 'End' },
//                 }, annotations: [{
//                     id: 'cancelledEndLabel2', content: 'Cancelled',
//                     style: { fill: 'white', color: 'black' }, verticalAlignment: 'Top', margin: { top: 20 }
//                 }]
//             },
//             {
//                 id: 'end', width: 40, height: 40, offsetX: 665, offsetY: 180, shape: {
//                     type: 'Bpmn', shape: 'Event',
//                     event: { event: 'End' }
//                 },
//             },
//             {
//                 id: 'processesStart', width: 30, height: 30, shape: {
//                     type: 'Bpmn', shape: 'Event',
//                     event: { event: 'Start' }
//                 }, margin: { left: 40, top: 80 }
//             },
//             {
//                 id: 'service', style: { fill: '#6FAAB0' }, width: 95, height: 70,
//                 shape: {
//                     type: 'Bpmn', shape: 'Activity', activity: {
//                         activity: 'Task', task: {
//                             type: 'Service',
//                             loop: 'ParallelMultiInstance',
//                         },
//                     },
//                 }, annotations: [{
//                     id: 'serviceLabel2', content: 'Book hotel', offset: { x: 0.50, y: 0.50 },
//                     style: { color: 'white', }
//                 }], margin: { left: 110, top: 20 },
//             },
//             {
//                 id: 'compensation', width: 30, height: 30,
//                 shape: {
//                     type: 'Bpmn', shape: 'Event',
//                     event: { event: 'Intermediate', trigger: 'Compensation' }
//                 }, margin: { left: 170, top: 100 }
//             },
//             {
//                 id: 'processesTask', style: { fill: '#F6B53F' }, width: 95, height: 70,
//                 shape: {
//                     type: 'Bpmn', shape: 'Activity', activity: {
//                         activity: 'Task', task: {
//                             type: 'Service',
//                         },
//                     },
//                 }, annotations: [{
//                     id: 'serviceLabel2', content: 'Charge credit card', offset: { x: 0.50, y: 0.60 },
//                     style: { color: 'white' }
//                 }], margin: { left: 290, top: 20 },
//             },
//             {
//                 id: 'error', width: 30, height: 30,
//                 shape: {
//                     type: 'Bpmn', shape: 'Event',
//                     event: {
//                         event: 'Intermediate', trigger: 'Error'
//                     }
//                 }, margin: { left: 350, top: 100 }
//             },
//             {
//                 id: 'processesEnd', width: 30, height: 30, shape: {
//                     type: 'Bpmn', shape: 'Event',
//                     event: { event: 'End' }
//                 }, margin: { left: 440, top: 80 }
//             },
//             {
//                 id: 'user', style: { fill: '#E94649' }, width: 90, height: 80,
//                 shape: {
//                     type: 'Bpmn', shape: 'Activity', activity: {
//                         activity: 'Task', task: { type: 'User', compensation: true },
//                     },
//                 }, annotations: [{
//                     id: 'serviceLabel2', content: 'Cancel hotel reservation', offset: { x: 0.50, y: 0.60 },
//                     style: { color: 'white' }
//                 }], margin: { left: 240, top: 160 },
//             },
//             {
//                 id: 'subProcessesEnd', width: 30, height: 30, shape: {
//                     type: 'Bpmn', shape: 'Event',
//                     event: { event: 'End' }
//                 }, margin: { left: 440, top: 210 }
//             },
//         ];
//         let shape: BpmnFlowModel = {
//             type: 'Bpmn',
//             flow: 'Association',
//             association: 'Directional'
//         };
//         let connectors: ConnectorModel[] = [
//             { id: 'connector1', sourceID: 'start', targetID: 'subProcess' },
//             { id: 'connector2', sourceID: 'subProcess', sourcePortID: 'success', targetID: 'end' },
//             {
//                 id: 'connector3', sourceID: 'subProcess', sourcePortID: 'failure', targetID: 'hazardEnd', type: 'Orthogonal',
//                 segments: [{ type: 'Orthogonal', length: 50, direction: 'Bottom' }],
//                 annotations: [{
//                     id: 'connector3Label2', content: 'Booking system failure', offset: 0.50,
//                     style: { fill: 'white' }
//                 }]
//             },
//             {
//                 id: 'connector4', sourceID: 'subProcess', sourcePortID: 'cancel', targetID: 'cancelledEnd', type: 'Orthogonal',
//                 segments: [{ type: 'Orthogonal', length: 50, direction: 'Bottom' }],
//             },
//             { id: 'connector5', sourceID: 'processesStart', targetID: 'service', type: 'Orthogonal', },
//             { id: 'connector6', sourceID: 'service', targetID: 'processesTask' },
//             { id: 'connector7', sourceID: 'processesTask', targetID: 'processesEnd', type: 'Orthogonal', },
//             {
//                 id: 'connector8', sourceID: 'compensation', targetID: 'user', type: 'Orthogonal',
//                 shape: shape,
//                 style: {
//                     strokeDashArray: '2,2'
//                 },
//                 segments: [{ type: 'Orthogonal', length: 30, direction: 'Bottom' },
//                 { type: 'Orthogonal', length: 80, direction: 'Right' }]
//             },
//             {
//                 id: 'connector9', sourceID: 'error', targetID: 'subProcessesEnd', type: 'Orthogonal',
//                 annotations: [{
//                     id: 'connector9Label2', content: 'Cannot charge card', offset: 0.50,
//                     style: { fill: 'white', color: 'black' }
//                 }],
//                 segments: [{ type: 'Orthogonal', length: 50, direction: 'Bottom' }]
//             }
//         ];
//        diagram = new Diagram({

//             width: 1000, height: 1000, nodes: nodes, connectors: connectors,
//         });
//         diagram.appendTo('#diagrambpmn');
//         diagram.selectedItems.canToggleSelection = true;
        
//     });

//     afterAll((): void => {
//         diagram.destroy();
//         ele.remove();
//     });

//     it('Checking unselect action working for BPMN nodes ', (done: Function) => {
        
//         let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
//         mouseEvents.clickEvent(diagramCanvas, 400,325);
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true);
//         mouseEvents.clickEvent(diagramCanvas, 400,325);
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true);
//         mouseEvents.clickEvent(diagramCanvas, 475,255);
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true);
//         mouseEvents.clickEvent(diagramCanvas, 475,255);
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true);
//         mouseEvents.clickEvent(diagramCanvas, 475,255);
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true);
//         mouseEvents.clickEvent(diagramCanvas, 463,178);
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true);
//         mouseEvents.clickEvent(diagramCanvas, 463,178);
//         expect(diagram.selectedItems.nodes.length == 0).toBe(true);       
//         mouseEvents.clickEvent(diagramCanvas, 475,255);
//         expect(diagram.selectedItems.nodes.length == 1).toBe(true);
//         mouseEvents.clickEvent(diagramCanvas, 529,202);
//         expect(diagram.selectedItems.connectors.length == 1).toBe(true);
//         mouseEvents.clickEvent(diagramCanvas, 529,202);
//         expect(diagram.selectedItems.connectors.length == 0).toBe(true);       
//         done();
//     });  
// });