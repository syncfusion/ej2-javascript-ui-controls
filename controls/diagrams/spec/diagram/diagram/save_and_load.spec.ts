/**
 * PathElement Test Cases
 */

import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { ShapeAnnotationModel, AnnotationModel } from '../../../src/diagram/objects/annotation-model';
import { Container } from '../../../src/diagram/core/containers/container';
import { Node, SwimLane } from '../../../src/diagram/objects/node'; 
import { Keys, KeyModifiers } from '../../../src/diagram/enum/enum';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';

describe('Diagram Control', () => {

    describe('SAVE AND LOAD', () => {
        let diagram: Diagram; let savedata: string;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
                shape: { type: 'Flow', shape: 'Terminator' },
                annotations: [{
                    id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
                }]
            };

            let node2: NodeModel = {
                id: 'Meeting', width: 150, height: 60, offsetX: 300, offsetY: 155,
                shape: { type: 'Flow', shape: 'Process' },
                annotations: [{
                    id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }

                }]
            };
            let node3: NodeModel = {
                id: 'BoardDecision', width: 150, height: 110, offsetX: 300, offsetY: 280,
                shape: { type: 'Flow', shape: 'Decision' },
                annotations: [{
                    id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
                    margin: { left: 25, right: 25 },
                    style: { whiteSpace: 'PreserveAll' }
                }]
            };
            let node4: NodeModel = {
                id: 'Project', width: 150, height: 100, offsetX: 300, offsetY: 430,
                shape: { type: 'Flow', shape: 'Decision' },
                annotations: [{
                    id: 'label4', content: 'Find Project manager', offset: { x: 0.5, y: 0.5 },

                }]
            };
            let node5: NodeModel = {
                id: 'End', width: 150, height: 60, offsetX: 300, offsetY: 555,
                shape: { type: 'Flow', shape: 'Process' },
                annotations: [{
                    id: 'label5', content: 'Implement and Deliver', offset: { x: 0.5, y: 0.5 },

                }]
            };
            let node6: NodeModel = {
                id: 'Decision', width: 250, height: 60, offsetX: 550, offsetY: 60,
                shape: { type: 'Flow', shape: 'Card' }
            };
            let node7: NodeModel = {
                id: 'Reject', width: 150, height: 60, offsetX: 550, offsetY: 280,
                shape: { type: 'Flow', shape: 'Process' },
                annotations: [{
                    id: 'label7', content: 'Reject and write report', offset: { x: 0.5, y: 0.5 },
                }]
            };
            let node8: NodeModel = {
                id: 'Resources', width: 150, height: 60, offsetX: 550, offsetY: 430,
                shape: { type: 'Flow', shape: 'Process' },
                annotations: [{
                    id: 'label8', content: 'Hire new resources', offset: { x: 0.5, y: 0.5 },
                }],
            };

            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Straight', sourceID: 'NewIdea', targetID: 'Meeting'
            };
            let connector2: ConnectorModel = {
                id: 'connector2', type: 'Straight', sourceID: 'Meeting', targetID: 'BoardDecision'
            };
            let connector3: ConnectorModel = {
                id: 'connector3', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Project'
            };
            let connector4: ConnectorModel = {
                id: 'connector4', type: 'Straight', sourceID: 'Project', targetID: 'End'
            };
            let connector5: ConnectorModel = {
                id: 'connector5', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Reject'
            };
            let connector6: ConnectorModel = {
                id: 'connector6', type: 'Straight', sourceID: 'Project', targetID: 'Resources'
            };
            diagram = new Diagram({
                width: 600, height: 500, nodes: [node1, node2, node3, node4, node5, node7, node8],
                connectors: [connector1, connector2, connector3, connector4, connector5, connector6],
                tooltip: {
                    content: getcontent(), position: 'TopLeft', relativeMode: 'Object',
                    animation: { open: { effect: 'FadeZoomIn', delay: 0 }, close: { effect: 'FadeZoomOut', delay: 0 } }
                },
            });
            diagram.appendTo('#diagram');

            function getcontent(): HTMLElement {
                let tooltipContent: HTMLElement = document.createElement('div');
                tooltipContent.innerHTML = '<div style="background-color: #f4f4f4; color: black; border-width:1px;border-style: solid;' +
                    'border-color: #d3d3d3;border-radius: 8px;white-space: nowrap;"> <span style="margin: 10px;"> Tooltip !!! </span> </div>';
                return tooltipContent;
            }
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking before, after, Saving the diagram', (done: Function) => {
            savedata = diagram.saveDiagram();
            expect(savedata != null).toBe(true);
            done();
        });
        it('Checking before, after, Load the saved diagram', (done: Function) => {
            diagram.loadDiagram(savedata);
            expect(diagram != null && diagram.commands !== null).toBe(true);
            done();
        });
        it('Checking before, after, customProperties', (done: Function) => {
            diagram.getCustomProperty = (propName: string): any => {
                if (propName === 'nodes') {
                    return ['description'];
                }
                return null;
            }
            savedata = diagram.saveDiagram();
            diagram.loadDiagram(savedata);
            expect(savedata != null).toBe(true);
            diagram.clear();
            done();
        });

        it('Checking before, after, customProperties using string', (done: Function) => {
            window['getCustomProperty'] = function (propName: string): any {
                if (propName === 'nodes') {
                    return ['description'];
                }
                return null;
            }
            diagram.getCustomProperty = 'getCustomProperty';
            savedata = diagram.saveDiagram();
            diagram.loadDiagram(savedata);
            expect(savedata != null).toBe(true);
            done();
        });
      });
    describe('empty diagram', () => {
        let diagram2: Diagram; let savedata2: string;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram2a' });
            document.body.appendChild(ele);
            diagram2 = new Diagram({
                width: '1000px', height: '600px',
            });
            diagram2.appendTo('#diagram2a');
        });
        afterAll((): void => {
            diagram2.destroy();
            ele.remove();
        });

        it('Checking diagram with empty diagram', (done: Function) => {

            savedata2 = diagram2.saveDiagram();
            diagram2.loadDiagram(savedata2);
            expect(savedata2 != null).toBe(true);
            done();
        });
   });

    describe('Checking Swimlane', () => {
        let diagram2: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            let nodes: NodeModel[] = [
                {
                    id: 'swimlane',
                    shape: {
                        type: 'SwimLane',
                        header: {
                            annotation: { content: 'ONLI' },
                            height: 50, style: { fontSize: 11 },
                        },
                        lanes: [
                            {
                                id: 'stackCanvas1',
                                header: {
                                    annotation: { content: 'CUSTOMER' }, height: 50,
                                    style: { fontSize: 11 }
                                },
                                width: 140,
                                children: [
                                    {
                                        id: 'Order',
                                        annotations: [
                                            {
                                                content: 'ORDER',
                                                style: { fontSize: 11 }
                                            }
                                        ],
                                        margin: { left: 60, top: 60 },
                                        height: 40, width: 100
                                    }
                                ],
                            },
                        ],
                        phases: [
                            {
                                id: 'phase1', offset: 200,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 290,
                    height: 360, width: 650
                },
            ];

            ele = createElement('div', { id: 'diagramport' });
            document.body.appendChild(ele);
            diagram2 = new Diagram({
                width: '1000px', height: '600px', nodes: nodes
            });
            diagram2.appendTo('#diagramport');
        });
        afterAll((): void => {
            diagram2.destroy();
            ele.remove();
        });

        it('Child after loading', (done: Function) => {
            diagram2.select([diagram2.nameTable['Order']]);
            diagram2.remove(diagram2.selectedItems.nodes[0]);
            diagram2.undo();
            let data: string = diagram2.saveDiagram();
            diagram2.loadDiagram(data);
            console.log('swimlane lane childs = ' + (diagram2.nodes[0].shape as SwimLane).lanes[0].children.length)
            expect((diagram2.nodes[0].shape as SwimLane).lanes[0].children.length === 1).toBe(true)
            done();
        });
    });

    describe('addport and label', () => {
        let diagram2: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }

            let node1: NodeModel = {
                id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
                shape: { type: 'Flow', shape: 'Terminator' },
            };
            ele = createElement('div', { id: 'diagramport' });
            document.body.appendChild(ele);
            diagram2 = new Diagram({
                width: '1000px', height: '600px', nodes: [node1],
            });
            diagram2.appendTo('#diagramport');
        });
        afterAll((): void => {
            diagram2.destroy();
            ele.remove();
        });

        it('Checking port add', (done: Function) => {
            let nodes: Node = diagram2.nodes[0] as Node
            let port: PointPortModel[] =
                [
                    {
                        id: 'abc',
                        shape: 'Circle',
                        offset: { x: 0, y: 0.75 }
                    }
                    , {
                        id: 'xyz',
                        shape: 'Circle',
                        offset: { x: 0.4, y: 0.75 }
                    }
                ]
            diagram2.addPorts(nodes, port)
            let node: Node = diagram2.nodes[0] as Node
            expect(node.ports.length === 2).toBe(true)
            done();
        });

        it('Checking label add', (done: Function) => {
            let nodes: Node = diagram2.nodes[0] as Node
            let label: ShapeAnnotationModel[] =
                [{ id: '123', content: 'Default Shape', offset: { y: .2 } }, { id: '789', content: 'Default Shape', offset: { y: .4 } }]
            diagram2.addLabels(nodes, label);
            var node = diagram2.nodes[0] as Node;
            expect(node.annotations.length === 2).toBe(true);
            done()
        });
        it('delete port', (done: Function) => {
            let nodes: Node = diagram2.nodes[0] as Node
            let port: PointPortModel[] = [{ id: 'abc' }]
            diagram2.removePorts(nodes, port);
            var node = diagram2.nodes[0] as Node;
            expect(node.ports.length === 1).toBe(true)
            done()
        });
        it('delete port', (done: Function) => {
            let nodes: Node = diagram2.nodes[0] as Node
            let port: PointPortModel[] = [{ id: 'xyz' }]
            diagram2.removePorts(nodes, port);
            var node = diagram2.nodes[0] as Node;
            expect(node.ports.length === 0).toBe(true)
            done()
        });
        it('delete label', (done: Function) => {
            let nodes: Node = diagram2.nodes[0] as Node
            let port: AnnotationModel[] = [{ id: '789' }];
            diagram2.removeLabels(nodes, port);
            var node = diagram2.nodes[0] as Node;
            expect(node.annotations.length === 1).toBe(true)
            done()
        });
        it('delete label', (done: Function) => {
            let nodes: Node = diagram2.nodes[0] as Node
            let port: AnnotationModel[] = [{ id: '123' }];
            diagram2.removeLabels(nodes, port);
            var node = diagram2.nodes[0] as Node;
            expect(node.annotations.length === 0).toBe(true)
            done()
        });
       });
    describe('addport and label in canvas', () => {
        let diagram2: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }

            let node1: NodeModel = {
                id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
                shape: { type: 'Flow', shape: 'Terminator' },
            };
            ele = createElement('div', { id: 'diagramport' });
            document.body.appendChild(ele);
            diagram2 = new Diagram({
                width: '1000px', height: '600px', nodes: [node1],
                commandManager: {
                    commands: [
                        {
                            name: 'clone',
                            canExecute: function () {
                                if (diagram2.selectedItems.nodes.length > 0 || diagram2.selectedItems.connectors.length > 0) {
                                    return true;
                                }
                                return false;
                            },

                            execute: function () {
                                diagram2.copy();
                                diagram2.paste();
                            },

                            //Defines that the clone command has to be executed on the recognition of Shift+C key press.
                            gesture: {
                                key: Keys.C,
                                keyModifiers: KeyModifiers.Shift
                            }
                        }
                    ]
                }
            });
            diagram2.appendTo('#diagramport');
        });
        afterAll((): void => {
            diagram2.destroy();
            ele.remove();
        });

        it('Checking port add', (done: Function) => {
            let nodes: Node = diagram2.nodes[0] as Node
            let port: PointPortModel[] =
                [
                    {
                        id: 'abc',
                        shape: 'Circle',
                        offset: { x: 0, y: 0.75 }
                    }
                    , {
                        id: 'xyz',
                        shape: 'Circle',
                        offset: { x: 0.4, y: 0.75 }
                    }
                ]
            diagram2.addPorts(nodes, port)
            let node: Node = diagram2.nodes[0] as Node
            expect(node.ports.length === 2).toBe(true)
            done();
        });

        it('Checking label add', (done: Function) => {
            let nodes: Node = diagram2.nodes[0] as Node
            let label: ShapeAnnotationModel[] =
                [{ id: '123', content: 'Default Shape', offset: { y: .2 } }, { id: '789', content: 'Default Shape', offset: { y: .4 } }]
            diagram2.addLabels(nodes, label);
            var node = diagram2.nodes[0] as Node;
            expect(node.annotations.length === 2).toBe(true);
            done()
        });
        it('delete port', (done: Function) => {
            let nodes: Node = diagram2.nodes[0] as Node
            let port: PointPortModel[] = [{ id: 'abc' }]
            diagram2.removePorts(nodes, port);
            var node = diagram2.nodes[0] as Node;
            expect(node.ports.length === 1).toBe(true)
            done()
        });
        it('delete label', (done: Function) => {
            let nodes: Node = diagram2.nodes[0] as Node
            let port: AnnotationModel[] = [{ id: '789' }];
            diagram2.removeLabels(nodes, port);
            var node = diagram2.nodes[0] as Node;
            expect(node.annotations.length === 1).toBe(true)
            done()
        });
        it('serialize and deserialize diagram', (done: Function) => {

            let data: string = diagram2.saveDiagram();
            diagram2.loadDiagram(data);
            expect(diagram2.commandManager.commands.length > 0).toBe(true)
            done()
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

    describe('883335: loading data wihout nodeTeamplate issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagramloadWithoutTemplate' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '500px', height: '600px'
            });
            diagram.appendTo('#diagramloadWithoutTemplate');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Add data with node template without defining nodeteamplate at application level', (done: Function) => {
            diagram.loadDiagram(
                '{"width":"100%","height":"600px","nodes":[{"shape":{"type":"HTML","content":""},"ports":[],"id":"Node","offsetX":100,"offsetY":100,"width":100,"height":100,"annotations":[],"zIndex":0,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":100},"offsetX":100,"offsetY":100},"constraints":5240814,"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"textOverflow":"Wrap"},"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","tooltip":{"openOn":"Auto","content":"","isSticky":false},"inEdges":[],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false}],"nodeTemplate":"#nodetemplate","enableRtl":false,"locale":"en-US","enablePersistence":false,"scrollSettings":{"viewPortWidth":656.7999877929688,"viewPortHeight":600,"currentZoom":1,"horizontalOffset":0,"verticalOffset":0,"padding":{"left":0,"right":0,"top":0,"bottom":0},"scrollLimit":"Diagram"},"rulerSettings":{"showRulers":false},"backgroundColor":"transparent","dataSourceSettings":{"crudAction":{"read":""},"dataManager":null,"dataSource":null},"mode":"SVG","layers":[{"id":"default_layer","visible":true,"lock":false,"objects":["Node"],"zIndex":0,"objectZIndex":0}],"connectors":[],"diagramSettings":{"inversedAlignment":true},"constraints":500,"layout":{"type":"None","enableRouting":false},"pageSettings":{"boundaryConstraints":"Infinity","orientation":"Landscape","height":null,"width":null,"background":{"source":"","color":"transparent"},"showPageBreaks":false,"fitOptions":{"canFit":false}},"snapSettings":{"constraints":31,"gridType":"Lines","verticalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20],"lineDashArray":"","lineColor":"lightgray"},"horizontalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20],"lineDashArray":"","lineColor":"lightgray"}},"selectedItems":{"nodes":[],"connectors":[],"constraints":16382,"selectedObjects":[],"userHandles":[],"rotateAngle":0,"canToggleSelection":false,"pivot":{"x":0.5,"y":0.5},"width":0,"height":0,"offsetX":0,"offsetY":0,"handleSize":14,"wrapper":null},"basicElements":[],"tooltip":{"content":""},"commandManager":{"commands":[]},"tool":3,"customCursor":[],"version":17.1}'
            );
            expect(diagram.nodes.length === 1).toBe(true)
            expect((diagram.nodes[0].shape as any).content === '').toBe(true)
            expect((diagram as any).nodeTemplate === undefined).toBe(true)
            done();
        });
    });

});