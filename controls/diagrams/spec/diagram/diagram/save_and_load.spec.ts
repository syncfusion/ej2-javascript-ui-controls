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
import { Node } from '../../../src/diagram/objects/node';
import { SelectorModel } from '../../../src/diagram/interaction/selector-model';
import { Keys, KeyModifiers } from '../../../src/diagram/enum/enum';

describe('Diagram Control', () => {

    describe('SAVE AND LOAD', () => {
        let diagram: Diagram; let savedata: string;
        let ele: HTMLElement;
        beforeAll((): void => {
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

    describe('addport and label', () => {
        let diagram2: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {

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

    });

});