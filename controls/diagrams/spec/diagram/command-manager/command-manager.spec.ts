/**
 * Command Manager - Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Path} from '../../../src/diagram/objects/node';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { KeyModifiers, Keys } from '../../../src/diagram/enum/enum';
import { CommandManager } from '../../../src/diagram/diagram/keyboard-commands';
import { CommandManagerModel, CommandModel } from '../../../src/diagram/diagram/keyboard-commands-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(UndoRedo);

describe('Diagram Control', () => {
    describe('Testing the Commands - Command Manager', () => {
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
            ele = createElement('div', { id: 'diagram_command2' });
            document.body.appendChild(ele);
            let selArray: (NodeModel)[] = [];
            let node: NodeModel = {
                id: 'node5',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100, style: { fill: 'green' },
                shape: {
                    type: 'Basic',
                    shape: 'Rectangle'
                }
            };
            let node2: NodeModel = {
                id: 'node2',
                width: 100, height: 100,
                offsetX: 400, offsetY: 100, style: { fill: 'blue' },
                shape: {
                    type: 'Basic',
                    shape: 'Rectangle'
                },
                annotations: [{ content: 'Annotation' }]
            };

            let connector: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 600, y: 100 },
                targetPoint: { x: 700, y: 200 },
            }

            diagram = new Diagram({
                width: '900px', height: '700px', nodes: [node, node2], connectors: [connector],
                commandManager: {
                    commands: [
                        {
                            name: 'clone',
                            canExecute: function () {
                                if (diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0) {
                                    return true;
                                }
                                return false;
                            },

                            execute: function () {
                                diagram.copy();
                                diagram.paste();
                            },

                            //Defines that the clone command has to be executed on the recognition of Shift+C key press.
                            gesture: {
                                key: Keys.C,
                                keyModifiers: KeyModifiers.Shift
                            }
                        },
                        {
                            name: 'copy',
                            canExecute: function () {
                                if (diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0) {
                                    return true;
                                }
                                return false;
                            }
                        },
                        {
                            name: 'undo',
                            gesture: {
                                key: Keys.G,
                                keyModifiers: KeyModifiers.Alt
                            }
                        }

                    ]
                }
            });
            diagram.appendTo('#diagram_command2');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking custom commands - clone', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            expect(diagram.selectedItems.nodes.length > 0).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'C', false, true);
            expect(diagram.nodes.length === 3 && diagram.nodes[2].offsetX === 110 &&
                diagram.nodes[2].offsetY === 110 && diagram.nodes[0].offsetX === 100).toBe(true);

            done();
        });
        it('Checking commands - copy and paste', (done: Function) => {
            diagram.clearSelection();
            diagram.selectedItems.nodes = [];
            diagram.selectedItems.connectors = [];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.keyDownEvent(diagramCanvas, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            expect(diagram.nodes.length === 4 && diagram.nodes[3].offsetX === 120 &&
                diagram.nodes[3].offsetY === 120 && diagram.nodes[0].offsetX === 100).toBe(true);
            done();
        });
        it('Checking commands - cut', (done: Function) => {
            diagram.clearSelection();
            diagram.selectedItems.nodes = [];
            diagram.selectedItems.connectors = [];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 80, 100);
            expect(diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'X', true);
            expect(diagram.nodes.length === 3).toBe(true);
            done();
        });
        it('Checking commands - undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.keyDownEvent(diagramCanvas, 'G', false, false, true);
            expect(diagram.nodes.length === 4).toBe(true);
            done();
        });
        it('Checking commands - redo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.keyDownEvent(diagramCanvas, 'Y', true);
            expect(diagram.nodes.length === 3).toBe(true);
            done();
        });
        it('Checking commands - Select All', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.keyDownEvent(diagramCanvas, 'A', true);
            expect(diagram.selectedItems.nodes.length === diagram.nodes.length).toBe(true);
            done();
        });
        it('Checking commands - delete', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            expect(diagram.nodes.length === 0).toBe(true);
            done();
        });
        it('Checking commands - nudge commands', (done: Function) => {
            diagram.undo();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.clearSelection();
            diagram.selectedItems.nodes = [];
            diagram.selectedItems.connectors = [];
            mouseEvents.clickEvent(diagramCanvas, 400, 100);
            expect(diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0).toBe(true);
            let tempNodeOffsetY = diagram.selectedItems.nodes[0].offsetY;
            let tempNodeOffsetX = diagram.selectedItems.nodes[0].offsetX;
            mouseEvents.keyDownEvent(diagramCanvas, 'Up');
            expect(diagram.selectedItems.nodes[0].offsetY == 99).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Down');
            expect(diagram.selectedItems.nodes[0].offsetY == 100).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Left');
            expect(diagram.selectedItems.nodes[0].offsetX == 399).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Right');
            expect(diagram.selectedItems.nodes[0].offsetX == 400).toBe(true);
            done();
        });
        it('Checking commands - annotation edit', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 400, 100);
            expect(diagram.selectedItems.nodes.length > 0 && diagram.selectedItems.nodes[0].annotations[0] !== undefined).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'F2');
            let editBox = document.getElementById(diagram.element.id + '_editBox');
            expect(editBox != undefined).toBe(true);
            done();
        });
        it('Checking commands - end annotation edit', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let editBox = document.getElementById(diagram.element.id + '_editBox');
            expect(editBox !== undefined).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
            editBox = document.getElementById(diagram.element.id + '_editBox');
            expect(editBox == undefined).toBe(true);
            done();
        });
        it('Checking commands - start text edit (connector)', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            expect(diagram.selectedItems.nodes.length > 0).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Enter');
            let editBox = document.getElementById(diagram.element.id + '_editBox');
            (editBox as HTMLInputElement).value = "Node";
            mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
            expect((diagram.selectedItems.nodes[0] as NodeModel).annotations[0].content == "Node").toBe(true);

            done();
        });
        it('Checking commands - start text edit (node)', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
            expect(diagram.selectedItems.connectors.length > 0).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Enter');
            let editBox = document.getElementById(diagram.element.id + '_editBox');
            (editBox as HTMLInputElement).value = "Connector";
            mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
            expect((diagram.connectors[0] as ConnectorModel).annotations[0].content == "Connector").toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            expect(diagram.connectors.length === 0).toBe(true);
            done();
        });
        it('Checking select all delete undo select all paste index ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.keyDownEvent(diagramCanvas, 'A', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            mouseEvents.keyDownEvent(diagramCanvas, 'G', false, false, true);
            mouseEvents.keyDownEvent(diagramCanvas, 'A', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            expect(diagram.nodes.length === 6).toBe(true);
            done();
        });
    });
});
describe('Diagram Control', () => {
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
        ele = createElement('div', { id: 'diagram_command3' });
        document.body.appendChild(ele);
        let selArray: (NodeModel)[] = [];
        let node: NodeModel = {
            id: 'node55',
            width: 100, height: 100,
            offsetX: 100, offsetY: 100, style: { fill: 'green' },
            shape: {
                type: 'Basic',
                shape: 'Rectangle'
            }
        };
        diagram = new Diagram({
            width: '900px', height: '700px', nodes: [node],
            commandManager: {
                commands: [
                    {
                        name: 'clone1',
                        //Defines that the clone command has to be executed on the recognition of Shift+C key press.
                        gesture: {
                            key: Keys.G,
                            keyModifiers: KeyModifiers.Shift
                        }
                    },
                ]
            }
        });
        diagram.appendTo('#diagram_command3');
        selArray.push(diagram.nodes[0]);
        diagram.select(selArray);
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Breakage issue if we dont specify the can execute commands', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        expect(diagram.selectedItems.nodes.length > 0).toBe(true);
        mouseEvents.keyDownEvent(diagramCanvas, 'G', false, true);
        expect(diagram.nodes.length === 1).toBe(true);

        done();
    });
    it('Breakage issue if we dont specify the execute commands', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        expect(diagram.selectedItems.nodes.length > 0).toBe(true);
        mouseEvents.keyDownEvent(diagramCanvas, 'G', false, true);
        expect(diagram.nodes.length === 1).toBe(true);

        done();
    });
    it('add commands at run time', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.commandManager = {
            commands: []
        }
        diagram.dataBind();
        expect(diagram.commandManager.commands.length === 0).toBe(true);

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
describe('SendToBack exception', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndexBeforeCall: number;
    let zIndexAfterCall : number;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram_div' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: "rectangle1",
                offsetX: 100,
                offsetY: 100,
                width: 100,
                height: 100,
                annotations: [{
                    content: 'rectangle1'
                }]
            }, {
                id: "rectangle2",
                offsetX: 200,
                offsetY: 200,
                width: 100,
                height: 100,
                annotations: [{
                    content: 'rectangle2'
                }]
            },
            {
                id: 'group',
                children: ['rectangle1', 'rectangle2']
            },
            {
                id: "rectangle3",
                offsetX: 300,
                offsetY: 300,
                width: 100,
                height: 100,
                annotations: [{
                    content: 'rectangle3'
                }]
            },
        
        ];
        
        diagram = new Diagram({
            width: '1500px',
            height: '600px',
            nodes: nodes,
        });
        diagram.appendTo("#diagram_div");
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Exception occurs when sendToBack method is called', (done: Function) => {
        zIndexBeforeCall = diagram.nodes[2].zIndex;
        diagram.select([diagram.nodes[2]]);
        diagram.sendToBack();
        zIndexAfterCall = diagram.nodes[2].zIndex;
        expect(zIndexBeforeCall === zIndexAfterCall).toBe(true);
        done();
    });
    it('Exception occurs when bringToFront method is called', (done: Function) => {
        zIndexBeforeCall = diagram.nodes[3].zIndex;
        diagram.select([diagram.nodes[3]]);
        diagram.bringToFront();
        zIndexAfterCall = diagram.nodes[3].zIndex;
        expect(zIndexBeforeCall === zIndexAfterCall).toBe(true);
        done();
    });
});
describe('Default Template tooltip', () => {
    var diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'tooltipCheck' });
        document.body.appendChild(ele);
        let connector: ConnectorModel = {
            id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 }
        };
        let node: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 450, annotations: [{ content: 'Node1' }]
        };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 550, offsetY: 450, annotations: [{ content: 'Node1' }],
            tooltip: { openOn: 'Custom' }
        };
        diagram = new Diagram({
            width: '1000px', height: '500px',
            nodes: [node, node2],
            connectors: [connector],
        });
        diagram.appendTo('#tooltipCheck');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking custom tooltip template with default template', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.showTooltip(diagram.nodes[1]);
        setTimeout(() => { done(); }, 50);
    });
    it('Checking tooltip on mouse enter of custom object', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 320, 320);
        let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
        expect(tooltipElement !== null).toBe(true);
        expect(tooltipElement.offsetLeft).toEqual(522);
        expect(tooltipElement.offsetTop).toEqual(517);
        done();
    });
});