import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BasicShapeModel, SelectorModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { UserHandleModel } from '../../../src/diagram/interaction/selector-model';
import { HorizontalAlignment, Side, VerticalAlignment, DiagramTools, BpmnSequenceFlows, DiagramConstraints, NodeConstraints, AnnotationConstraints, ConnectorConstraints, PortConstraints, PortVisibility, SnapConstraints } from '../../../src/diagram/enum/enum';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { Canvas,Node, ToolBase,BpmnShapeModel, MouseEventArgs, IElement, cloneObject, randomId, SelectorConstraints, PathModel, MoveTool, UserHandleEventsArgs, IDraggingEventArgs, ISelectionChangeEventArgs, ScrollSettingsModel, ConnectorDrawingTool, PointPortModel, SnapSettingsModel } from '../../../src/index';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';

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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
            expect(diagram.selectedItems.nodes.length === 1).toBe(true);
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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

    describe('Template Rendering UserHandle', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let selArray: any = [];
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, shape: shape };
            let handle: UserHandleModel[] = [{
                name: 'handle1', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'
                , visible: false, backgroundColor: 'black', offset: 0, side: 'Bottom', margin: { top: 0, bottom: 0, left: 0, right: 0 },
                pathColor: 'white'
            }, {
                name: 'handle2',
                content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                    'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                    'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                    'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z' +
                    ' M68.129,53.938' +
                    'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                    'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                    'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                    'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                    'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                    'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                    'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107' +
                    'C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
                side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0
                , pathColor: 'yellow'
            }]
            diagram = new Diagram({
                width: 400, height: 400, nodes: [node1], selectedItems: { userHandles: handle },
            });
            diagram.appendTo('#diagram');

            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        it('Template Rendering', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let pathElement: HTMLElement = document.getElementById('handle2_shape_native_element');
            console.log(pathElement.getAttribute('transform'));
            expect(pathElement.getAttribute('transform') === "rotate(0,75,50) translate(62.5,37.5) scale(0.2777777777777778,0.2777777777777778)").toBe(true);
            done();
        });

        it('Checking Template Rendering User Handle', (done: Function) => {
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
        it('Change the UserHandle content dynamically', (done: Function) => {
            diagram.selectedItems.userHandles[1].content = '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<g>			<path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28     C62.726,435.13,62.354,435.072,61.979,435.057z"/>			<path style="fill:#61443C;" d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304     c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296     c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504     c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/>		</g>		<path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/>		<path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/>		<path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/>		<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/>		<path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/>	</g>	<g>		<path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/>		<path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/>		<path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>		<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/>		<path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/>		<path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/>		<path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/>		<path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/>		<path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/>		<path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/>		<path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>		<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/>		<path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/>		<path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>		<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/>		<path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/>		<path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/>		<path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/>		<path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>';
            diagram.dataBind();
            let pathElement: HTMLElement = document.getElementById('handle2_shape_native_element');
            expect(pathElement.getAttribute('transform') ==="rotate(0,75,50) translate(62.499977834829224,37.49996274740788) scale(0.04882744980047025,0.048827717549773636)").toBe(true);
            done();
        });
        it('Change the UserHandle offset dynamically', (done: Function) => {
            diagram.selectedItems.userHandles[1].offset = 0.5;
            diagram.dataBind();
            let pathElement: HTMLElement = document.getElementById('handle2_shape_native_element');
            expect(pathElement.getAttribute('transform') === "rotate(0,100,50) translate(87.49997783482922,37.49996274740788) scale(0.04882744980047025,0.048827717549773636)").toBe(true);
            done();
        });
        it('Change the UserHandle alignment dynamically', (done: Function) => {
            diagram.selectedItems.userHandles[1].horizontalAlignment = 'Left';
            diagram.selectedItems.userHandles[1].verticalAlignment = 'Center';
            diagram.dataBind();
            let pathElement: HTMLElement = document.getElementById('handle2_shape_native_element');
            expect(pathElement.getAttribute('transform') ===  "rotate(0,112.5,50) translate(99.99997783482922,37.49996274740788) scale(0.04882744980047025,0.048827717549773636)").toBe(true);
            done();
        });
    });

    describe('Image Rendering UserHandle', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let selArray: any = [];
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, shape: shape };
            let handle: UserHandleModel[] = [{
                name: 'handle1', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'
                , visible: false, backgroundColor: 'black', offset: 0, side: 'Bottom', margin: { top: 0, bottom: 0, left: 0, right: 0 },
                pathColor: 'white'
            }, {
                name: 'handle2', source: 'http://www.syncfusion.com/content/images/nuget/sync_logo_icon.png', visible: true, backgroundColor: 'black', offset: 0, side: 'Top', margin: { top: 0, bottom: 0, left: 0, right: 0 }
                ,pathColor: 'white'
            }]
            diagram = new Diagram({
                width: 400, height: 400, nodes: [node1], selectedItems: { userHandles: handle },
            });
            diagram.appendTo('#diagram');

            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        it('Template Rendering', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let pathElement: HTMLElement = document.getElementById('handle2_image');
            console.log(pathElement.getAttribute('transform'));
            expect(pathElement.getAttribute('transform') === "rotate(0,75,50)").toBe(true);
            done();
        });

        it('Checking Template Rendering User Handle', (done: Function) => {
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
        it('Change the UserHandle content dynamically', (done: Function) => {
            diagram.selectedItems.userHandles[1].source = 'https://raw.githubusercontent.com/remojansen/logo.ts/master/stickers/fp.png';
            diagram.dataBind();
            let pathElement: HTMLElement = document.getElementById('handle2_image');
            expect(pathElement.getAttribute('transform') === "rotate(0,75,50)").toBe(true);
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
            expect(ele.attributes[4].value === '90' && ele.attributes[5].value === '177.49999999999997').toBe(true);
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
            // Pan the diagram
            mouseEvents.dragAndDropEvent(diagramCanvas, 400, 300, 400, 200);
            expect(diagram.scroller.horizontalOffset == 0 && diagram.scroller.verticalOffset == -75).toBe(true);
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
    describe('User handle position not proper during zoom issue', () => {
        let ele: HTMLElement;
        let selArray: any = [];
        let mouseEvents: MouseEvents = new MouseEvents();
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);


            let nodes: NodeModel[] = [
                {
                    id: 'node0',
                    offsetX: 300,
                    offsetY: 300,
                    width: 30,
                    height: 30,
                    annotations: [{
                        content: 'Start',
                        margin: { bottom: -30 }
                    }],
                    shape: {
                        type: 'Bpmn',
                        shape: 'Event',
                        event: {
                            event: 'Start',
                            trigger: 'None'
                        }
                    },
                    style: {
                        strokeColor: '#62A716',
                        strokeWidth: 1
                    }
                }]
            var handle: UserHandleModel[] = [
            {
                name: 'node',
                pathData: 'M17.75,13.89H2.5a2,2,0,0,1-2-2V2.5a2,2,0,0,1,2-2H17.75a2,2,0,0,1,2,2v9.39A2,2,0,0,1,17.75,13.89Z',
                visible: true,
                offset: 0,
                side: 'Right',
                pathColor: '#e9f8ff',
                backgroundColor: 'none',
                size: 35,
                margin: { top: 0, bottom: 0, left: 0, right: 12 }
            },
           
        ]
            diagram = new Diagram({
                width: 700, height: 600,
                nodes: nodes,
                selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
                getCustomTool: getTool, getCustomCursor: getCursor
            });
            diagram.appendTo('#diagram');

        });

        it('User handle position not proper during zoom issue', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            diagram.zoom(5)
            let seletotElement = document.getElementById('diagram_SelectorElement')
            expect(seletotElement.children[0].getAttribute('cx') === '1643').toBe(true);
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
    describe('UserHandle Events', () => {
        let ele: HTMLElement;
        let diagramuserhandle: Diagram;
        let selArray: any = [];
        let mouseEvents: MouseEvents = new MouseEvents();
        afterAll((): void => {
            diagramuserhandle.destroy();
            ele.remove();
        });

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip();
                return;
            }
            ele = createElement('div', { id: 'diagramZoomPanAndSingleSelect' });
            document.body.appendChild(ele);


            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, shape: shape };
            var handle: UserHandleModel[] = [{
                name: 'userHandle11', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'
                , visible: true, backgroundColor: 'black', offset: 0, side: 'Bottom', margin: { top: 0, bottom: 0, left: 0, right: 0 },
                pathColor: 'white'
            }, {
                name: 'handle3', pathData: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889'
                , side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0
                , pathColor: 'yellow'
            }]
            diagramuserhandle = new Diagram({
                width: 700, height: 600, nodes: [node1],
                selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
                getCustomTool: getTool, getCustomCursor: getCursor,
                tool: DiagramTools.SingleSelect | DiagramTools.ZoomPan
            });
            diagramuserhandle.appendTo('#diagramZoomPanAndSingleSelect');

        });

        it('Checking UserHandle Events', (done: Function) => {
            diagramuserhandle.onUserHandleMouseDown = (args: UserHandleEventsArgs) => {
                expect(args.element.name === 'userHandle11').toBe(true);
                done();
            }
            diagramuserhandle.onUserHandleMouseUp = (args: UserHandleEventsArgs) => {
                expect(args.element.name === 'userHandle11').toBe(true);
                done();
            }
            diagramuserhandle.onUserHandleMouseEnter = (args: UserHandleEventsArgs) => {
                expect(args.element.name === 'userHandle11').toBe(true);
                done();
            }
            diagramuserhandle.onUserHandleMouseLeave = (args: UserHandleEventsArgs) => {
                expect(args.element.name === 'userHandle11').toBe(true);
                done();
            }
           
            let diagramCanvas: HTMLElement = document.getElementById(diagramuserhandle.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 75, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 175, 150);
            mouseEvents.clickEvent(diagramCanvas, 75, 150);
            mouseEvents.mouseUpEvent(diagramCanvas, 75, 150);
            mouseEvents.dragAndDropEvent(diagramCanvas, 400, 300, 400, 200);
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
});
describe('rendering user handle template', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let script: HTMLElement;
    let button:HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let selArray: any = [];
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'diagram' });
        document.body.appendChild(ele);
        let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
        let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, shape: shape };
        let handle: UserHandleModel[] = [{
            name: 'handle1',
            side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0
            , pathColor: 'yellow'
        },
       ]
        script = createElement('script', { id: 'userHandletemplate' });
        button = createElement('button', { id: 'startGroup2' });
        script.appendChild(button);
        //script.innerHTML = "<button id='startGroup2'onclick='myFunction()'/>startGroupuserhandle</button>"
        document.body.appendChild(script);
        diagram = new Diagram({
            width: 400, height: 400, nodes: [node1], selectedItems: { userHandles: handle }, userHandleTemplate: '#userHandletemplate'
        });
        diagram.appendTo('#diagram');
        selArray.push(diagram.nodes[0]);
        diagram.select(selArray);
        document.getElementById('startGroup2').onclick = function () {
            alert('clicked');
        }
    })
    it('Template Rendering', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let pathElement: HTMLElement = document.getElementById('handle1_shape_html_element');
        console.log(pathElement.offsetLeft);
        console.log(pathElement.offsetTop);
        expect(pathElement.offsetLeft === 63 && pathElement.offsetTop === 38).toBe(true);
        done();
    });
    it('changing the alignment dynamically', (done: Function) => {
        diagram.selectedItems.userHandles[0].horizontalAlignment = 'Left';
        diagram.selectedItems.userHandles[0].verticalAlignment = 'Bottom';
        diagram.dataBind();
        let pathElement: HTMLElement = document.getElementById('handle1_shape_html_element');
        console.log(pathElement.style.transform);
        expect(pathElement.style.transform === "rotate(0deg)").toBe(true);
        done()

    });
    it('Dynamic changing of position', (done: Function) => {
        diagram.selectedItems.userHandles[0].offset = 0.5;
        diagram.dataBind();
        let pathElement: HTMLElement = document.getElementById('handle1_shape_html_element');
        console.log(pathElement.style.transform);
        expect(pathElement.style.transform === "rotate(0deg)").toBe(true);
        done();
    });
    it('Checking user handle events while handle is not visible', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 75, 150);
        let eventhandler: any = diagram['eventHandler'];
        let action: any = eventhandler['action'];
        expect(action !== 'handle1').toBe(true)
        done();
    })
    it('Checking position of userhandle', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let pathElement: HTMLElement = document.getElementById('handle1_shape_html_element');
        let rect: any = pathElement.getBoundingClientRect();
        console.log(rect.bottom  ,rect.height,   rect.left  , rect.right, rect.top, rect.width, rect.x,rect.y );
        expect(rect.bottom === 83 && rect.height === 25 && rect.left === 108 && rect.right === 133 && rect.top === 58 && rect.width === 25 && rect.x === 108 && rect.y === 58).toBe(true)
        done();

    });
    it('Checking visibility of userhandle', (done: Function) => {
        diagram.selectedItems.userHandles[0].visible = false;
        let pathElement: HTMLElement = document.getElementById('handle1_shape_html_element');
        console.log(pathElement.style.transform);
        expect(pathElement.style.transform === "rotate(0deg)").toBe(true)
        done();

    });
    it('Checking user handle position while zooming', function (done) {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 90);
        diagram.zoom(1.2);
        let ele: HTMLElement = document.getElementById('handle1_shape_html_element');
        console.log( ele.offsetTop, ele.offsetLeft);
        expect(  ele.offsetTop === 63 &&ele.offsetLeft=== 120).toBe(true)
        done();


    });
});

describe('user handle ToolTip', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'diagram' });
        document.body.appendChild(ele);
        let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
        let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100,width:100,height:100, shape: shape,
        tooltip: {
            content: 'node',
            position: 'TopCenter',
            relativeMode: 'Object'
        },
        constraints:NodeConstraints.Default | NodeConstraints.Tooltip,
    };
        let connectors:ConnectorModel[] = [{
            id: 'connector1',
            type: 'Straight',
            sourcePoint: { x: 200, y: 100 },
            targetPoint: { x: 300, y: 200 },
            tooltip: {
                content: 'Connectors',
                position: 'TopLeft'
            },
            constraints: ConnectorConstraints.Default | ConnectorConstraints.Tooltip,
        }];
        let handle: UserHandleModel[] = [{
            name: 'handle1',
            pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z',
            visible: true, backgroundColor: 'black', offset: 0, side: 'Right',
            pathColor: 'white',
            tooltip: {
                content: 'handle1',
                position: 'TopCenter',
                relativeMode: 'Object'
            },
        },
        {
            name: 'handle2',
            visible: true, backgroundColor: 'black', offset: 0, side: 'Left', 
            pathColor: 'white',
            tooltip: {
                content: 'handle2',
                position: 'TopCenter',
                relativeMode: 'Object'
            },
        },
        {
            name: 'handle3', source: './download.png', visible: true, backgroundColor: 'black', offset: 0, side: 'Top', margin: { top: 0, bottom: 0, left: 0, right: 0 },
            pathColor: 'white',
            tooltip: {
                content: 'handle3',
                position: 'TopCenter',
                relativeMode: 'Object'
            },
        },
        {
            name: 'handle4',
            content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
            'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
            'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
            'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z' +
            ' M68.129,53.938' +
            'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
            'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
            'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
            'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
            'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
            'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
            'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107' +
            'C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
            side: 'Bottom', horizontalAlignment: 'Center', verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0,
            pathColor: 'yellow',
            tooltip: {
                content: 'handle4',
                position: 'TopCenter',
                relativeMode: 'Object'
            },
        }
        ];
    diagram = new Diagram({
        width: 800, height: 600, nodes: [node1],connectors:connectors, selectedItems: { userHandles: handle }, userHandleTemplate: '#userHandletemplate',
        tooltip: {
            content: 'Diagram', position: 'TopLeft', height: 'auto', width: 'auto',
            showTipPointer: true, relativeMode: 'Object',
            animation: {
                open: {
                    effect: 'None',
                },
                close: {
                    effect: 'None'
                }
            }
        },
        constraints: DiagramConstraints.Default | DiagramConstraints.Tooltip
    });
    diagram.appendTo('#diagram');
    })
    it('Checking UserHandle for path ', function (done) {
        var diagramCanvas:HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100, false, false);
        mouseEvents.mouseMoveEvent(diagramCanvas, 174, 40, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
        done();
    });
    it('Checking  UserHandle for html element', function (done) {
        var diagramCanvas:HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100, false, false);
        mouseEvents.mouseMoveEvent(diagramCanvas, 30, 40, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
        done();
    });
    it('Checking UserHandle for Image', function (done) {
        var diagramCanvas:HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100, false, false);
        mouseEvents.mouseMoveEvent(diagramCanvas, 50, 20, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
        done();
    });
    it('Checking UserHandle for Native element', function (done) {
        var diagramCanvas:HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100, false, false);
        mouseEvents.mouseMoveEvent(diagramCanvas, 50, 170, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
        done();
    });
});

describe('EJ2-42693 - Exception occurs when try to draw connector on node text edit', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let script: HTMLElement;
    let button:HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let selArray: any = [];
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'diagram' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            getStartNode(),
            getOrdinaryNode('node1', 'Activity 1', 200, 100),                     
            getOrdinaryNode('node2', 'Activity 2', 350, 200),
            getOrdinaryNode('node3', 'Activity 3', 350, 100),
            getOrdinaryNode('node4', 'Activity 4', 500, 200),
            getEndNode('node5', 650, 200)
          ];
        
          let connectors: ConnectorModel[] = [
            get01Connector('connector1', 'node0', 'node1'),
            get01Connector('connector2', 'node0', 'node2'),
            get03Connector('connector3', 'node1', 'node2', 'Conditional'),
            get03Connector('connector4', 'node1', 'node3', 'Default'),
            get01Connector('connector5', 'node2', 'node4'),
            /*this.get01Connector('connector6', 'node3', 'node5'),
            this.get01Connector('connector7', 'node4', 'node5')*/
          ];
        
          function getOrdinaryNode(nodeId:string, label:string, x:number, y:number): NodeModel {
            return {
              id: nodeId,
              offsetX: x,
              offsetY: y,
              width: 90,
              height: 60,
              annotations: [
                {
                  content: label,
                  style: {
                    fontSize: 11,
                    textWrapping: 'WrapWithOverflow',
                    textOverflow: 'Ellipsis'
                  },
                  offset: { x: 0.5, y: 0.5 },
                  margin: { top: 7, right: 0, bottom: -8, left: 0 },
                }
              ],
              /*borderColor: '#78BE83',*/
              borderWidth: 4,
              shape: {
                type: 'Bpmn',
                shape: 'Activity',
                activity: {
                  activity: 'Task',
                  task: {
                    type: 'Service'
                  }
                }
              },
              style: {
                fill: '#d8ecdc',
                strokeColor: '#78BE83',
                strokeWidth: 3,
                gradient: {
                  // Start point of linear gradient
                  x1: 0,
                  y1: 0,
                  // End point of linear gradient
                  x2: 1,
                  y2: 1,
                  // Sets an array of stop objects
                  stops: [
                    {
                        color: 'white',
                        offset: x,
                        opacity: 0.1
                    },
                    {
                        color: '#d8ecdc',
                        offset: y,
                        opacity: 0.1
                    }
                  ],
                  type: 'Linear'
                }
              },
              ports: [
                {
                  id: 'left',
                  offset: { x: 0, y: 0.5 }
                },
                {
                  id: 'right',
                  offset: { x: 1, y: 0.5 }
                },
                {
                  id: 'top',
                  offset: { x: 0.5, y: 0 }
                },
                {
                  id: 'bottom',
                  offset: { x: 0.5, y: 1 }
                }
              ]
            };
          }
          function getStartNode(): NodeModel {
            return {
              id: 'node0',
              offsetX: 100,
              offsetY: 300,
              width: 30,
              height: 30,
              annotations: [{
                content: 'Start',
                margin: { bottom: -30 }
              }],
              shape: {
                type: 'Bpmn',
                shape: 'Event',
                event: {
                  event: 'Start',
                  trigger: 'None'
                }
              },
              style: {
                strokeColor: '#62A716',
                strokeWidth: 1
              },
              ports: [
                { id: 'right', offset: { x: 1, y: 0.5 } },
                { id: 'bottom', offset: { x: 0.5, y: 1 } }
              ]
            };
          }
          function getEndNode(nodeId: string, x: number, y: number): NodeModel {
            return {
              id: nodeId,
              offsetX: x,
              offsetY: y,
              width: 30,
              height: 30,
              annotations: [{
                content: 'End',
                margin: { bottom: -30 }
              }],
              shape: {
                type: 'Bpmn',
                shape: 'Event',
                event: {
                  event: 'End',
                  trigger: 'None'
                }
              },
              style: {
                strokeColor: '#FF0000',
                strokeWidth: 1
              },
              ports: [
                { id: 'left', offset: { x: 0, y: 0.5 } },
                { id: 'top', offset: { x: 0.5, y: 0 } }
              ]
            };
          }
        
          function getTool(action: string): ToolBase {
            let tool: ToolBase;
            if (action === 'node') {
             tool = new OrdinaryTool(diagram);
            } 
             else if (action === 'arrow') {
              tool = new DrawConnector(diagram);
             } 
            return tool;
          }
        
          function get01Connector(conId:string, source:string, target:string): ConnectorModel {
            return {
              id: conId,
              sourceID: source,
              targetID: target,
              sourcePortID: 'right',
              targetPortID: 'left',
              style: {
                strokeColor: '#888888',
                fill: '#555555',
                strokeWidth: 1
              },
              targetDecorator: {
                style: {
                    fill: '#555555',
                    strokeColor: '#888888'
                }
              },
              type: 'Orthogonal',
              cornerRadius: 10
            };
          }
          function get03Connector(conId:string, source:string, target:string, sequence:BpmnSequenceFlows): ConnectorModel {
            return {
              id: conId,
              sourceID: source,
              targetID: target,
              sourcePortID: 'right',
              targetPortID: 'left',
              shape: {
                type: 'Bpmn',
                flow: 'Sequence',
                sequence: sequence
              },
              style: {
                strokeColor: '#888888',
                fill: '#555555',
                strokeWidth: 1
              },
              targetDecorator: {
                style: {
                    fill: '#555555',
                    strokeColor: '#888888'
                }
              },
              type: 'Orthogonal',
              cornerRadius: 10
            };
          }
          
          let snapSettings: SnapSettingsModel = {
            // Define the Constraints for gridlines and snapping
            constraints: SnapConstraints.None,
            // Defines the horizontalGridlines for SnapSettings
            horizontalGridlines: {
                // Sets the line color of gridlines
                // lineColor: 'blue',
                // Defines the lineDashArray of gridlines
                lineDashArray: '2 2',
                lineIntervals: [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75,
                 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75],
                 // snapIntervals: [10]
            },
            // Defines the verticalGridlines for SnapSettings
            verticalGridlines: {
                // lineColor: 'blue',
                lineDashArray: '2 2',
                lineIntervals: [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75,
                 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75],
                 // snapIntervals: [10]
            }
          };
        
          let scrollSettings: ScrollSettingsModel = {
            canAutoScroll: true,
            scrollLimit: 'Infinity',
            // scrollableArea: new Rect(0, 0, 300, 300),
            // horizontalOffset: 30,
            //verticalOffset: 30,
            padding: { left: 0, top: 0, right: 10, bottom: 0 }
        };
        let constraints: DiagramConstraints = DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.Bridging;
        let handles: UserHandleModel[] = [
            {
              name: 'arrow',
              pathData: 'M4,11v2h8v7l8-8L12,4v7Z',
              visible: true,
              offset: 0.5,
              side: 'Top',
              pathColor: 'black',
              backgroundColor: 'transparent',
              size: 32,
              margin: {top: 12, bottom: 0, left: 0, right: 0}
            },
            {
              name: 'Delete',
              pathData: `M 0, 0 c -3.201999999999998,-2.8130000000000006,-8.105999999999995,-2.455,-11.119,
                      0.5579999999999998l-34.179,34.205l-34.337,-34.362c-3.093,-3.0920000000000005,-8.108,-3.0920000000000005,-11.201,
                      0l-0.11299999999999956,0.11299999999999956c-3.093,3.093,-3.093,8.107,0,11.201l34.341,34.366l-34.34,34.366c-3.093,
                      3.0930000000000035,-3.093,8.108000000000004,0,11.201000000000008l0.11299999999999956,0.11299999999999956c3.093,
                      3.0930000000000035,8.107,3.0930000000000035,11.201,0l34.337,-34.363l34.17900000000001,34.205c3.0130000000000052,
                      3.0130000000000052,7.917000000000002,3.3700000000000045,11.119,0.5580000000000069c3.507000000000005,
                      -3.081000000000003,3.6370000000000005,-8.429000000000002,0.38800000000000534,-11.677999999999997l-34.37899999999999,
                      -34.403l34.37700000000001,-34.404c3.25,-3.2489999999999988,3.1200000000000045,-8.596,-0.38800000000000534,-11.677Z`,
              visible: true,
              offset: 1,
              side: 'Top',
              pathColor: 'black',
              backgroundColor: 'none',
              size: 30,
              margin: {top: 12, bottom: 0, left: 0, right: 0}
            },
            {
              name: 'node',
              pathData: 'M17.75,13.89H2.5a2,2,0,0,1-2-2V2.5a2,2,0,0,1,2-2H17.75a2,2,0,0,1,2,2v9.39A2,2,0,0,1,17.75,13.89Z',
              visible: true,
              offset: 0,
              side: 'Right',
              pathColor: '#e9f8ff',
              backgroundColor: 'none',
              size: 35,
              margin: {top: 0, bottom: 0, left: 0, right: 12}
            },
            {
              name: 'decision',
              pathData: 'M19.94,11.93l-8,8a2,2,0,0,1-2.83,0l-8-8a2,2,0,0,1,0-2.83l8-8a2,2,0,0,1,2.83,0l8,8A2,2,0,0,1,19.94,11.93Z',
              visible: true,
              offset: 0.5,
              side: 'Right',
              pathColor: '#fff6df',
              backgroundColor: 'none',
              size: 35,
              margin: {top: 0, bottom: 0, left: 0, right: 12}
            },
            {
              name: 'end',
              pathData: 'M16.92,8.71A8.21,8.21,0,1,1,8.71.5,8.21,8.21,0,0,1,16.92,8.71Z',
              visible: true,
              offset: 1,
              side: 'Right',
              pathColor: '#ffedef',
              backgroundColor: 'none',
              size: 35,
              margin: {top: 0, bottom: 0, left: 0, right: 12}
            },
            {
              name: 'attachment',
              pathData: 'M11,9h5.5L11,3.5V9M4,2h8l6,6V20a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2M9,4H4V20H16V11H9Z',
              visible: true,
              offset: 0.5,
              side: 'Bottom',
              pathColor: '#5a5a64',
              backgroundColor: 'none',
              size: 35,
              margin: {top: 0, bottom: 12, left: 0, right: 0}
            },
            {
              name: 'annotation',
              pathData: `M8,11h8v2H8Zm8-4H8V9h8Zm0,8H8v2h8ZM18,2H10V4h8V20H10v2h8a2,2,0,0,0,2-2V4A2,2,0,0,0,18,2ZM6,4H8V2H6A2,2,0,0,0,4,4v6L2,12l2,
                        2v6a2,2,0,0,0,2,2H8V20H6Z`,
              visible: true,
              offset: 1,
              side: 'Bottom',
              pathColor: '#5a5a64',
              backgroundColor: 'none',
              size: 35,
              margin: {top: 0, bottom: 12, left: 0, right: 0}
            }
          ];
          let selectedItems: SelectorModel = {
            constraints: SelectorConstraints.UserHandle,
            userHandles: handles
          };
          let commandManager: any;
          
          let _userHandles: UserHandleModel[] = JSON.parse(JSON.stringify(handles));
        
          function selectionChanged(event: ISelectionChangeEventArgs): void {
            if (event.state === 'Changed') {
              if (event.newValue.length > 0) {
                let node = null;
                if (event.newValue[0].addInfo) {
                  node = (event.newValue[0].addInfo as any).getDiagramNode();
                }
        
                if (event.newValue[0].id === '0') {
                  handles[1].visible = false;
                handles[3].offset = 1;
                  handles[4].visible = false;
                  handles[6].offset = 0;
                } else {
                  // tslint:disable
                  event.newValue[0].constraints = NodeConstraints.Default & ~NodeConstraints.Rotate;
                  // tslint:enable
                  handles = JSON.parse(JSON.stringify(_userHandles));
                }
              }
        
              selectedItems = {
                constraints: SelectorConstraints.UserHandle,
                userHandles: handles
              };
            }
          }     
        
        diagram = new Diagram({
            width: '100%',height: '600px',nodes: nodes,connectors: connectors, getCustomTool:getTool,
            selectedItems: selectedItems,constraints: constraints,snapSettings: snapSettings,
            scrollSettings: scrollSettings,commandManager: commandManager,selectionChange: selectionChanged
        });
        diagram.appendTo('#diagram');
        class DrawConnector extends ConnectorDrawingTool {
            public sourceNode: NodeModel;
            private isDragging = false;
        
            constructor(private diagram: Diagram) {
                super(diagram.commandHandler, '', diagram.selectedItems.nodes[0] as Node);
                this.diagram.drawingObject = this.getConnector();
                /*this.diagram.tool = DiagramTools.DrawOnce;*/
                this.diagram.dataBind();
            }
        
            public mouseDown(args: MouseEventArgs): Promise<void> {
                let b = super.mouseDown(args);
                this.sourceNode = this.diagram.selectedItems.nodes[0];
                this.diagram.drawingObject = this.getConnector();
                return b;
            }
        
            public mouseUp(args: MouseEventArgs): Promise<void> {
                let no:Node;
                let b = super.mouseUp(args);
                // this.diagram.add(this.addConnector(this.sourceNode, args.target));
                this.diagram.selectedItems.connectors[0].sourceID = this.sourceNode.id;
                this.diagram.dataBind();
                this.diagram.clearSelection();
                this.isDragging = false;
                this.diagram.drawingObject = null;
                return b;
            }
        
            private addConnector(source: NodeModel, dest: NodeModel): ConnectorModel {
                const connector: ConnectorModel = {
                    sourceID: source.id,
                    targetID: dest.id,
                    shape: {
                        type: 'Bpmn',
                        flow: 'Sequence',
                        sequence: 'Default'
                    },
                    style: {
                        strokeColor: '#888888',
                        strokeWidth: 1
                    },
                    targetDecorator: {
                        style: {
                            fill: '#555555',
                            strokeColor: '#888888'
                        },
                        height: 6
                    },
                    type: 'Orthogonal',
                    constraints: ConnectorConstraints.Default | ConnectorConstraints.LineRouting
                  };
        
                  return connector;
            }
        
            private getConnector(): ConnectorModel {
                return {
                    cornerRadius: 10,
                    type: 'Orthogonal'
                };
            }
        }
        class OrdinaryTool extends ToolBase {
            public node: NodeModel;
            constructor(private diagram: Diagram) {
                super(diagram.commandHandler, true);
            }
        
            public mouseDown(args: MouseEventArgs): void {
                super.mouseDown(args);
                this.node = this.diagram.selectedItems.nodes[0];
            }
        
            public mouseUp(args: MouseEventArgs): void {
                super.mouseUp(args);
        
                let ordNode = new OrdinaryActivity(this.diagram.nodes.length + 1);
                let nodeModel = ordNode.getDiagramNode();
                let newPos: { x: number, y: number } = { x: 0, y: 0 };
                newPos.x = this.node.offsetX + this.node.width + 75;
                newPos.y = this.node.offsetY;
                ordNode.setLocation(nodeModel, newPos.x, newPos.y);
                this.createPorts(nodeModel);
                const n = this.diagram.add(nodeModel) as Node;
        
                let ports: string[] = ['right', 'left'];
        
                if (this.diagram.layout.orientation === 'TopToBottom') {
                  ports = ['bottom', 'top'];
                }
        
                if ((this.node.shape as BpmnShapeModel).shape === 'Gateway') {
                  if (this.diagram.layout.orientation === 'LeftToRight') {
                    if ((this.node as Node).outEdges.length % 2 === 0) {
                      ports = ['top', 'left'];
                    } else {
                      ports = ['bottom', 'left'];
                    }
                  } else {
                    if ((this.node as Node).outEdges.length % 2 === 0) {
                      ports = ['left', 'top'];
                    } else {
                      ports = ['right', 'top'];
                    }
                  }
        
                  ports[0] = '';
                }
        
                this.diagram.add(this.getConnector(this.node, nodeModel, ports));
                this.diagram.select([n], false);
                this.diagram.bringIntoView(n.wrapper.bounds);
                this.diagram.startTextEdit(n, n.annotations[0].id);
            }
        
            private createPorts(node: Node | NodeModel): void {
              let ports: PointPortModel[] = [
                {
                  id: 'left',
                  offset: { x: 0, y: 0.5 },
                  visibility: PortVisibility.Hidden,
                  constraints: PortConstraints.InConnect
                },
                {
                  id: 'top',
                  offset: { x: 0.5, y: 0 },
                  visibility: PortVisibility.Hidden,
                  constraints: PortConstraints.InConnect
                },
                {
                  id: 'right',
                  offset: { x: 1, y: 0.5 },
                  visibility: PortVisibility.Hidden,
                  constraints: PortConstraints.OutConnect
                },
                {
                  id: 'bottom',
                  offset: { x: 0.5, y: 1 },
                  visibility: PortVisibility.Hidden,
                  constraints: PortConstraints.OutConnect
                }
              ];
        
              node.ports = ports;
            }
        
            private getConnector(source: NodeModel, dest: NodeModel, ports: string[]): ConnectorModel {
                const connector: ConnectorModel = {
                  sourceID: source.id,
                  targetID: dest.id,
                  zIndex: 0,
                  style: {
                    strokeColor: '#888888',
                    fill: '#555555',
                    strokeWidth: 1
                  },
                  targetDecorator: {
                    style: {
                        fill: '#555555',
                        strokeColor: '#888888'
                    }
                  },
                  type: 'Orthogonal',
                  constraints: ConnectorConstraints.Default | ConnectorConstraints.InheritLineRouting,
                  cornerRadius: 10,
                  sourcePortID: ports[0],
                  targetPortID: ports[1]
                };
        
                return connector;
            }
        }
        class KtaNode {
            constructor(protected id: number) {}
        
            public getDiagramNode(): NodeModel {
                return null;
            }
        
            public setAddInfo(node: NodeModel): void {
                // Done by Child
            }
        
            public setColor(node: NodeModel): void {
                // Done by Child
            }
        
            public setLocation(node: NodeModel, x: number, y: number): void {
            }
        }
        
        class OrdinaryActivity extends KtaNode {
            private myNode: NodeModel;
            constructor(protected id: number) {
                super(id);
            }
        
            public getDiagramNode(): NodeModel {
                const width = 90;
                const height = 60;
        
                this.myNode = {
                    id: 'node' + this.id,
                    annotations: [
                        {
                            content: 'Activity ' + this.id.toString(),
                            style: {
                                textOverflow: 'Clip',
                                textWrapping: 'Wrap',
                                whiteSpace: 'CollapseSpace'
                            },
                            margin: { top: 10, right: 5, bottom: 3, left: 5 },
                            constraints: AnnotationConstraints.None & ~AnnotationConstraints.Drag & ~AnnotationConstraints.Resize
                        }
                    ],
                    shape: {
                        type: 'Bpmn',
                        shape: 'Activity',
                        activity: {
                            activity: 'Task',
                            task: {
                                type: 'Service'
                            }
                        }
                    },
                    width: width,
                    height: 60,
                    style: {
                        fill: '#d8ecdc',
                        strokeColor: '#78BE83',
                        strokeWidth: 3
                    }
                };
        
                return this.myNode;
            }
        
            public setAddInfo(node: NodeModel): void {
                node.addInfo = this;
            }
        
            public setColor(node: NodeModel): void {
                node.style.fill = '#FF4432';
                this.setAddInfo(node);
            }
        
            public setLocation(node: NodeModel, x: number, y: number): void {
                node.offsetX = x;
                node.offsetY = y;
            }
        }
    })
    it('Template Rendering', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        expect(diagram.nodes.length === 6 && diagram.connectors.length === 5).toBe(true);
        diagram.select([diagram.nodes[3]]);
        mouseEvents.mouseDownEvent(diagramCanvas, 410, 79);
        mouseEvents.mouseUpEvent(diagramCanvas, 410, 79);    
        mouseEvents.dragAndDropEvent(diagramCanvas, 535, 55, 200, 93);
        console.log(diagram.connectors.length);
        expect(diagram.nodes.length === 7 && (diagram.connectors.length === 7 || diagram.connectors.length === 6)).toBe(true);
        done();
    });   
});