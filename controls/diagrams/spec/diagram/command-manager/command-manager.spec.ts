/**
 * Command Manager - Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Path } from '../../../src/diagram/objects/node';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { KeyModifiers, Keys } from '../../../src/diagram/enum/enum';
import { CommandManager } from '../../../src/diagram/diagram/keyboard-commands';
import { CommandManagerModel, CommandModel } from '../../../src/diagram/diagram/keyboard-commands-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
Diagram.Inject(UndoRedo);

describe('Diagram Control', () => {
    describe('Testing the Commands - Command Manager', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
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
});