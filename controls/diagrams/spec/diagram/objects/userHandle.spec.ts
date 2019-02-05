import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { UserHandleModel } from '../../../src/diagram/interaction/selector-model';
import { HorizontalAlignment, Side, VerticalAlignment, DiagramTools } from '../../../src/diagram/enum/enum';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { Canvas, ToolBase, MouseEventArgs, IElement, cloneObject, randomId, SelectorConstraints, PathModel, MoveTool } from '../../../src/index';

/*
 * Node spec
 */
let diagram: Diagram;
function getTool(action: string): ToolBase {
    let tool: ToolBase;
    if (action === 'userHandle1') {
        tool = new CloneTool(diagram.commandHandler, true);
    }
    if (action === 'handle1') {
        tool = new CloneAndDragTool(diagram.commandHandler, true);
    }
    return tool;
}

function getCursor(action: string, active: boolean): string {
    let cursor: string;
    if (active && action === 'Drag') {
        cursor = '-webkit-grabbing';
    } else if (action === 'Drag') {
        cursor = '-webkit-grab'
    }
    return cursor;
}


window['getCustomTool'] = function (action: string): ToolBase {
    let tool: ToolBase;
    if (action === 'handle1') {
        tool = new CloneAndDragTool(diagram.commandHandler, true);
    }
    return tool;
}

window['getCustomCursor'] = function (action: string, active: boolean): string {
    let cursor: string;
    if (active && action === 'Drag') {
        cursor = '-webkit-grabbing';
    } else if (action === 'Drag') {
        cursor = '-webkit-grab'
    }
    return cursor;
}

class CloneAndDragTool extends ToolBase {
    public mouseDown(args: MouseEventArgs): void {
        args.source = diagram.selectedItems.nodes[0] as IElement;
        args.sourceWrapper = diagram.selectedItems.wrapper;
        if (!args.source) {
            args.source = diagram.selectedItems.connectors[0] as IElement;
            args.sourceWrapper = diagram.selectedItems.wrapper;
        }
        super.mouseDown(args);
        let newObject: NodeModel
        if (diagram.selectedItems.nodes.length > 0) {
            newObject = cloneObject(diagram.selectedItems.nodes[0]);
        } else {
            newObject = cloneObject(diagram.selectedItems.connectors[0]);
        }
        newObject.id += randomId();
        newObject.wrapper.id = newObject.id;
        newObject.offsetX += 10;
        newObject.offsetY += 10;
        diagram.add(newObject);
        args.source = diagram.nameTable[newObject.id]
        args.sourceWrapper = diagram.nameTable[newObject.id].wrapper;
        diagram.select([diagram.nameTable[newObject.id]]);
        this.currentElement = newObject as IElement;
        this.prevPosition = this.currentPosition;
    }
}

class CloneTool extends ToolBase {
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        diagram.copy();
        diagram.paste();
    }
}

describe('Diagram Control', () => {

    describe('Basic Shapes Without Size', () => {
        var diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];
        let mouseEvents: MouseEvents = new MouseEvents();
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, width: 50, height: 50, shape: shape };
            let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
            let node2: NodeModel = { id: 'node2', offsetX: 300, offsetY: 100, shape: shape2 };
            let shape3: BasicShapeModel = { type: 'Basic', shape: 'Hexagon' };
            let node3: NodeModel = { id: 'node3', offsetX: 600, offsetY: 100, shape: shape3, rotateAngle: 100 };
            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 },
            },
            {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 400, y: 200 },
            },]
            let data = 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889';
            var handle: UserHandleModel = {
                name: 'handle1', pathData: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889'
                , side: "Top", horizontalAlignment: "Center", verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0
                , backgroundColor: 'black'
            }
            diagram = new Diagram({
                width: 600, height: 500, nodes: [node1, node2, node3], connectors: connectors, selectedItems: { userHandles: [handle] }
            });
            diagram.appendTo('#diagram');




        });

        it('Checking user handle events eith out action', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 90);
            mouseEvents.clickEvent(diagramCanvas, 75, 50);
            let eventhandler: any = diagram['eventHandler'];
            let action: any = eventhandler['action'];
            expect(diagram.selectedItems.nodes.length === 0).toBe(true);
            done();
        });

        it('Checking the side of user handle: top', (done: Function) => {
            let i: number = 0
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
            var UserHandleSettingsCollection = [
                {
                    side: "Top", horizontalAlignment: "Left", verticalAlignment: 'Top', margin: { top: 1, bottom: 1, left: 1, right: 1 }, offset: 1
                }, {
                    side: "Bottom", horizontalAlignment: "Left", verticalAlignment: 'Top', margin: { top: 0.5, bottom: 0.5, left: 1, right: 1 }, offset: 0.5
                }, {
                    side: "Left", horizontalAlignment: "Right", verticalAlignment: 'Bottom', margin: { top: 1, bottom: 1, left: 0.5, right: 0.5 }, offset: 0.75
                }, {
                    side: "Right", horizontalAlignment: "Right", verticalAlignment: 'Bottom', margin: { top: 1, bottom: 1, left: 1, right: 0.5 }, offset: 0.75
                }

            ];
            var handles = diagram.selectedItems.userHandles[0];

            for (let UserHandleSettingsCollections of UserHandleSettingsCollection) {
                handles.side = UserHandleSettingsCollections.side as Side;
                handles.horizontalAlignment = UserHandleSettingsCollections.horizontalAlignment as HorizontalAlignment;
                handles.verticalAlignment = UserHandleSettingsCollections.verticalAlignment as VerticalAlignment
                handles.offset = UserHandleSettingsCollections.offset;

                diagram.selectedItems.wrapper.rotateAngle = 30;

                diagram.dataBind();

                diagram.select(selArray);
                expect(handles.side === UserHandleSettingsCollections.side &&
                    handles.horizontalAlignment === UserHandleSettingsCollections.horizontalAlignment &&
                    handles.verticalAlignment === UserHandleSettingsCollections.verticalAlignment &&
                    handles.offset === UserHandleSettingsCollections.offset).toBe(true);
                i++;
            }
            done();
        }
        );

        it('Checking the side of user handle: top', (done: Function) => {
            let i: number = 0
            var UserHandleSettingsCollection = [
                {
                    side: "Top", horizontalAlignment: "Left", verticalAlignment: 'Top', margin: { top: 1, bottom: 1 }, offset: -1
                }

            ];
            var handles = diagram.selectedItems.userHandles[0];

            for (let UserHandleSettingsCollections of UserHandleSettingsCollection) {
                handles.side = UserHandleSettingsCollections.side as Side;
                handles.horizontalAlignment = UserHandleSettingsCollections.horizontalAlignment as HorizontalAlignment;
                handles.verticalAlignment = UserHandleSettingsCollections.verticalAlignment as VerticalAlignment
                handles.offset = UserHandleSettingsCollections.offset;
                handles.margin = UserHandleSettingsCollections.margin;
                diagram.selectedItems.wrapper.rotateAngle = 30;

                diagram.dataBind();

                diagram.select(selArray);
                expect(handles.side === UserHandleSettingsCollections.side &&
                    handles.horizontalAlignment === UserHandleSettingsCollections.horizontalAlignment &&
                    handles.verticalAlignment === UserHandleSettingsCollections.verticalAlignment &&
                    handles.offset === UserHandleSettingsCollections.offset &&
                    handles.margin.top === UserHandleSettingsCollections.margin.top &&
                    handles.margin.bottom === UserHandleSettingsCollections.margin.bottom &&
                    handles.margin.left === 0 && handles.margin.right === 0
                ).toBe(true);
                i++;
            }
            done();
        }
        );
        it('Checking user handle for connector', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.nameTable['connector1']]);
            expect(diagram.selectedItems.connectors.length === 1).toBe(true);
            done();
        });

        it('Checking user handle for empty', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.selectAll();
            diagram.remove();
            mouseEvents.clickEvent(diagramCanvas, 100, 90);
            expect(diagram.selectedItems.nodes.length === 0).toBe(true);
            done();
        });


    });
    describe('Basic Shapes Without Size', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let selArray: any = [];
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, shape: shape };
            let handle: UserHandleModel[] = [{
                name: 'handle1', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'
                , visible: false, backgroundColor: 'black', offset: 0, side: 'Bottom', margin: { top: 0, bottom: 0, left: 0, right: 0 },
                pathColor: 'white'
            }, {
                name: 'handle2', pathData: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889'
                , side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0
                , pathColor: 'yellow'
            }]
            diagram = new Diagram({
                width: 400, height: 400, nodes: [node1], selectedItems: { userHandles: handle },
            });
            diagram.appendTo('#diagram');

            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        it('Checking user handle events while handle is visible', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 75, 50);
            let eventhandler: any = diagram['eventHandler'];
            let action: any = eventhandler['action'];
            expect(action === 'handle2').toBe(true);
            done();
        });

        it('Checking user handle events while handle is not visible', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 75, 150);
            let eventhandler: any = diagram['eventHandler'];
            let action: any = eventhandler['action'];
            expect(action !== 'handle1').toBe(true);
            done();
        });

    });

    describe('Basic Shapes Without Size', () => {
        let ele: HTMLElement;
        let selArray: any = [];
        let mouseEvents: MouseEvents = new MouseEvents();
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);


            /**
             * Basic Shapes
             */
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, shape: shape };
            let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
            let node2: NodeModel = { id: 'node2', offsetX: 300, offsetY: 100, shape: shape2 };
            let shape3: BasicShapeModel = { type: 'Basic', shape: 'Hexagon' };
            let node3: NodeModel = { id: 'node3', offsetX: 600, offsetY: 100, shape: shape3 };
            let shape4: BasicShapeModel = { type: 'Basic', shape: 'Parallelogram' };
            let shape7: BasicShapeModel = { type: 'Basic', shape: 'Star' };
            let node7: NodeModel = { id: 'node7', width: 100, height: 100, offsetX: 300, offsetY: 300, shape: shape7, visible: true };
            let shape8: PathModel = { type: 'Path', data: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889', };
            let node8: NodeModel = { id: 'node7', width: 100, height: 100, offsetX: 300, offsetY: 300, shape: shape8, visible: true };
            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 }
                , annotations: [{ content: 'No', offset: 0, alignment: 'After' }]
            },
            {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 400, y: 200 }
                , annotations: [{ content: 'No', alignment: 'Before' }]
            }];


            var handle: UserHandleModel[] = [{
                name: 'handle1', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'
                , visible: true, backgroundColor: 'black', offset: 0, side: 'Bottom', margin: { top: 0, bottom: 0, left: 0, right: 0 },
                pathColor: 'white'
            }, {
                name: 'handle3', pathData: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889'
                , side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0
                , pathColor: 'yellow'
            }]
            diagram = new Diagram({
                width: 700, height: 600, nodes: [node1, node2, node3, node8], connectors: connectors,
                selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
                getCustomTool: getTool, getCustomCursor: getCursor

            });
            diagram.appendTo('#diagram');

        });

        it('Checking user handle events with out action', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 90);
            diagram.getTool('handle1').mouseLeave({ currentPosition: { x: 100, y: 200 }, prevPosition: { x: 100, y: 200 } } as MouseEventArgs)
            expect(diagram.selectedItems.nodes.length === 1).toBe(true);
            done();
        });

        it('Checking custom cursor', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 90);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100, 88);
            expect(diagramCanvas.style.cursor === '-webkit-grab').toBe(true);
            done();
        });
    });

    describe('Basic Shapes Without Size using string function', () => {
        let ele: HTMLElement;
        let selArray: any = [];
        let mouseEvents: MouseEvents = new MouseEvents();
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramba' });
            document.body.appendChild(ele);


            /**
             * Basic Shapes
             */
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, shape: shape };
            let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
            let node2: NodeModel = { id: 'node2', offsetX: 300, offsetY: 100, shape: shape2 };
            let shape3: BasicShapeModel = { type: 'Basic', shape: 'Hexagon' };
            let node3: NodeModel = { id: 'node3', offsetX: 600, offsetY: 100, shape: shape3 };
            let shape4: BasicShapeModel = { type: 'Basic', shape: 'Parallelogram' };
            let shape7: BasicShapeModel = { type: 'Basic', shape: 'Star' };
            let node7: NodeModel = { id: 'node7', width: 100, height: 100, offsetX: 300, offsetY: 300, shape: shape7, visible: true };
            let shape8: PathModel = { type: 'Path', data: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889', };
            let node8: NodeModel = { id: 'node7', width: 100, height: 100, offsetX: 300, offsetY: 300, shape: shape8, visible: true };
            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 }
                , annotations: [{ content: 'No', offset: 0, alignment: 'After' }]
            },
            {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 400, y: 200 }
                , annotations: [{ content: 'No', alignment: 'Before' }]
            }];


            var handle: UserHandleModel[] = [{
                name: 'handle1', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'
                , visible: true, backgroundColor: 'black', offset: 0, side: 'Bottom', margin: { top: 0, bottom: 0, left: 0, right: 0 },
                pathColor: 'white'
            }, {
                name: 'handle3', pathData: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889'
                , side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0
                , pathColor: 'yellow'
            }]
            diagram = new Diagram({
                width: 700, height: 600, nodes: [node1, node2, node3, node8], connectors: connectors,
                selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
                getCustomTool: 'getCustomTool', getCustomCursor: 'getCustomCursor'
            });
            diagram.appendTo('#diagramba');

        });

        it('Checking user handle events with out action', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 90);
            diagram.getTool('handle1').mouseLeave({ currentPosition: { x: 100, y: 200 }, prevPosition: { x: 100, y: 200 } } as MouseEventArgs)
            expect(diagram.selectedItems.nodes.length === 1).toBe(true);
            done();
        });

        it('Checking custom cursor', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 90);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100, 88);
            expect(diagramCanvas.style.cursor === '-webkit-grab').toBe(true);
            done();
        });
        it('Checking user handle position while zooming', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 90);
            diagram.zoom(1.2);
            let ele = document.getElementById('handle1_userhandle');
            expect(ele.attributes[4].value === '90' && ele.attributes[5].value === '175').toBe(true);
            done();
        });
    });
    describe('ZoomPan and SingleSelect tool - user handle action', () => {
        let ele: HTMLElement;
        let selArray: any = [];
        let mouseEvents: MouseEvents = new MouseEvents();
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramZoomPanAndSingleSelect' });
            document.body.appendChild(ele);


            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, shape: shape };
            var handle: UserHandleModel[] = [{
                name: 'userHandle1', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'
                , visible: true, backgroundColor: 'black', offset: 0, side: 'Bottom', margin: { top: 0, bottom: 0, left: 0, right: 0 },
                pathColor: 'white'
            }, {
                name: 'handle3', pathData: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889'
                , side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0
                , pathColor: 'yellow'
            }]
            diagram = new Diagram({
                width: 700, height: 600, nodes: [node1],
                selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
                getCustomTool: getTool, getCustomCursor: getCursor,
                tool: DiagramTools.SingleSelect | DiagramTools.ZoomPan
            });
            diagram.appendTo('#diagramZoomPanAndSingleSelect');

        });

        it('Checking user handle when zoom pan and single select tool is active', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            expect(diagram.nodes.length == 1).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            expect(diagram.selectedItems.nodes.length == 1).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 75, 150);
            expect(diagram.nodes.length == 2).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 400, 300, 400, 200);
            expect(diagram.scroller.horizontalOffset == 0 && diagram.scroller.verticalOffset == -75).toBe(true);
            done();
        });
    });
});    