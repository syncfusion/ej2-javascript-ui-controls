import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import { HtmlModel, ImageModel, NodeModel, PathModel } from '../../src/diagram/objects/node-model';
import { BasicShape, Node } from '../../src/diagram/objects/node';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { MouseEvents } from '../diagram/interaction/mouseevents.spec';
import { AnnotationConstraints, DiagramConstraints, Shapes } from '../../src/diagram/enum/enum';
import {

    BpmnDiagrams,
    NodeConstraints,
    PhaseModel,
    SwimLaneModel,

} from '../../src/diagram/index';
import { Selector } from '../../src/diagram/objects/node';
import { DiagramElement } from '../../src/diagram/core/elements/diagram-element';
import { PointModel } from '../../src/diagram/primitives/point-model';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix } from '../../src/diagram/primitives/matrix';
import { GroupableView } from '../../src/diagram/core/containers/container';
import { UndoRedo } from '../../src/diagram/objects/undo-redo';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Snapping } from '../../src/diagram/objects/snapping';
import { IHistoryChangeArgs, PointPortModel, ShapeAnnotationModel } from '../../src';
import { DiagramCollaboration } from '../../src/diagram/objects/collaboration';
Diagram.Inject(UndoRedo, Snapping, DiagramCollaboration, BpmnDiagrams);

function collaborativeNode1drag(diagram: Diagram, mouseEvents: MouseEvents) {
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    if ((diagram.selectedItems as Selector).annotation) {
        let textElement: DiagramElement = diagram.selectedItems.wrapper.children[0];
        let centerX = textElement.offsetX;
        let centerY = textElement.offsetY;
        mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 50, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 100, centerY + diagram.element.offsetTop + 50);
        mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 100, centerY + diagram.element.offsetTop + 50);
    }
}

function collaborativeNodeRotate(diagram: Diagram, value: number) {
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    let mouseEvents: MouseEvents = new MouseEvents();
    if ((diagram.selectedItems as Selector).nodes) {
        let element: DiagramElement = diagram.selectedItems.wrapper.children[0];
        let ten: number = 10 / diagram.scroller.currentZoom;
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, element.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
        //check for resizing tool
        let rotate: number = (value ? value : 20) + 5;
        let x: number = element.offsetX - element.pivot.x * element.actualSize.width;
        let y: number = element.offsetY - element.pivot.y * element.actualSize.height;
        let rotateThumb: PointModel = { x: x + element.actualSize.width / 2, y: y - 30 / diagram.scroller.currentZoom };
        rotateThumb = transformPointByMatrix(matrix, rotateThumb);
        mouseEvents.mouseDownEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft, rotateThumb.y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + rotate, rotateThumb.y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + rotate, rotateThumb.y + diagram.element.offsetTop + rotate);
        mouseEvents.mouseUpEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + rotate, rotateThumb.y + diagram.element.offsetTop + rotate);
    }
}

describe('Collaboration interactions', () => {
    describe('Swimlane Interactions', () => {

        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let diagramEle1: HTMLElement;
        let diagramEle2: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;
        let left1: number; let top1: number;
        let left2: number; let top2: number;


        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'NodeInteraction' });
            diagramEle1 = createElement('div', { id: 'diagram9' });
            diagramEle2 = createElement('div', { id: 'diagram10' })
            ele.appendChild(diagramEle1);
            ele.appendChild(diagramEle2);
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    header: {
                        id: 'header1',
                        annotation: {
                            id: 'annotate1', content: 'header1'

                        }
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            height: 100,
                        },
                        {
                            id: 'stackCanvas330',
                            height: 100,
                            style: { fill: 'lightgrey' },
                            header: {
                                annotation: {
                                    content: 'New LANE',
                                    style: { fill: 'brown', color: 'white', fontSize: 15 }
                                },
                                style: { fill: 'pink' }
                            }
                        },
                    ],

                    phases: [
                        {
                            id: 'phase1',
                            offset: 170,
                            header: { annotation: { content: 'Phase' } },
                        },
                        {
                            id: 'phase154', offset: 200,
                            style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                            header: { annotation: { content: 'Phase' } }
                        }
                    ],
                    phaseSize: 20,
                },
                offsetX: 300,
                offsetY: 200,
                height: 200,
                width: 350,
            }];
            diagram = new Diagram({
                width: 800, height: 500, nodes: nodes,
                enableCollaborativeEditing: true,
                historyChange: function (args: IHistoryChangeArgs) {
                    let changes: string[] = diagram.getDiagramUpdates(args);
                    if (changes.length > 0) {
                        diagram2.setDiagramUpdates(changes);
                    }
                }
            });
            diagram2 = new Diagram({
                width: 800, height: 500, nodes: nodes,
                enableCollaborativeEditing: true,
            })
            diagram.appendTo('#diagram9');
            diagram2.appendTo("#diagram10");
            diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
            diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas1, 1, 1);
            left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
        });

        afterAll((): void => {
            mouseEvents = null;
            diagramCanvas1 = null;
            diagram.destroy();
            diagram2.destroy();
            diagramEle1.remove();
            diagramEle2.remove();
            ele.remove();
        });

        it('SwimLane - drag node to lane end and verify collaborator sync', function (done) {
            let node: NodeModel[] = [{
                id: 'node1',
                width: 50,
                height: 40,

            }]
            diagram.addNodeToLane(node[0], 'swimlane', 'stackCanvas330');
            expect((diagram2.nodes[0].shape as SwimLaneModel).lanes[1])
            done();
            mouseEvents.clickEvent(diagramCanvas1, 1, 1);
            mouseEvents.mouseDownEvent(diagramCanvas1, 220, 290);
            mouseEvents.mouseMoveEvent(diagramCanvas1, 460, 320);
            mouseEvents.mouseUpEvent(diagramCanvas1, 460, 320);
            expect(diagram2.nodes[0].width == diagram.nodes[0].width).toBe(true)
            done();
        })
        it('SwimLane - drag node to lane end and verify collaborator sync', function (done) {
            mouseEvents.clickEvent(diagramCanvas1, 1, 1);
            mouseEvents.mouseDownEvent(diagramCanvas1, 220, 290);
            mouseEvents.mouseMoveEvent(diagramCanvas1, 220, 160);
            mouseEvents.mouseUpEvent(diagramCanvas1, 220, 160);
            expect((diagram2.nodes[0].shape as SwimLaneModel).lanes[0].id == (diagram.nodes[0].shape as SwimLaneModel).lanes[0].id).toBe(true)
            done();
        })

        it('SwimLane - RowHeightChanged', function (done) {
            diagram2.setDiagramUpdates([
                "{\"modifiedNodes\":[{\"id\":\"swimlanestackCanvas3301\",\"rowIndex\":3,\"columnIndex\":1,\"width\":180,\"height\":100,\"offsetX\":300,\"offsetY\":200,\"style\":{\"fill\":\"lightgrey\",\"strokeColor\":\"#CCCCCC\",\"gradient\":{\"type\":\"None\"},\"strokeWidth\":1,\"strokeDashArray\":\"\",\"opacity\":1,\"textOverflow\":\"Wrap\"},\"pivot\":{\"x\":0.5,\"y\":0.5},\"constraints\":30408302,\"container\":{\"type\":\"Canvas\",\"orientation\":\"Horizontal\"},\"shape\":{\"type\":\"Basic\",\"shape\":\"Rectangle\",\"cornerRadius\":0},\"ports\":[],\"zIndex\":8,\"visible\":true,\"horizontalAlignment\":\"Left\",\"verticalAlignment\":\"Top\",\"backgroundColor\":\"transparent\",\"borderColor\":\"none\",\"borderWidth\":0,\"rotateAngle\":0,\"margin\":{\"right\":0,\"bottom\":0,\"left\":0,\"top\":0},\"flip\":0,\"flipMode\":\"All\",\"wrapper\":{\"actualSize\":{\"width\":274,\"height\":145},\"offsetX\":432,\"offsetY\":307.5},\"annotations\":[],\"isExpanded\":true,\"expandIcon\":{\"shape\":\"None\"},\"fixedUserHandles\":[],\"tooltip\":{\"openOn\":\"Auto\",\"content\":\"\",\"isSticky\":false},\"inEdges\":[],\"outEdges\":[],\"parentId\":\"swimlane\",\"processId\":\"\",\"umlIndex\":-1,\"isPhase\":false,\"isLane\":true,\"addInfo\":{\"parentId\":\"swimlane\"}}],\"modifiedConnectors\":[],\"entryType\":\"RowHeightChanged\",\"actionTrigger\":\"CustomAction\",\"propertyChanges\":null,\"entry\":{\"type\":\"RowHeightChanged\"}}"
            ]);
            diagram.setDiagramUpdates([
                "{\"modifiedNodes\":[{\"id\":\"swimlanestackCanvas3301\",\"rowIndex\":3,\"columnIndex\":1,\"width\":180,\"height\":100,\"offsetX\":300,\"offsetY\":200,\"style\":{\"fill\":\"lightgrey\",\"strokeColor\":\"#CCCCCC\",\"gradient\":{\"type\":\"None\"},\"strokeWidth\":1,\"strokeDashArray\":\"\",\"opacity\":1,\"textOverflow\":\"Wrap\"},\"pivot\":{\"x\":0.5,\"y\":0.5},\"constraints\":30408302,\"container\":{\"type\":\"Canvas\",\"orientation\":\"Horizontal\"},\"shape\":{\"type\":\"Basic\",\"shape\":\"Rectangle\",\"cornerRadius\":0},\"ports\":[],\"zIndex\":8,\"visible\":true,\"horizontalAlignment\":\"Left\",\"verticalAlignment\":\"Top\",\"backgroundColor\":\"transparent\",\"borderColor\":\"none\",\"borderWidth\":0,\"rotateAngle\":0,\"margin\":{\"right\":0,\"bottom\":0,\"left\":0,\"top\":0},\"flip\":0,\"flipMode\":\"All\",\"wrapper\":{\"actualSize\":{\"width\":274,\"height\":145},\"offsetX\":432,\"offsetY\":307.5},\"annotations\":[],\"isExpanded\":true,\"expandIcon\":{\"shape\":\"None\"},\"fixedUserHandles\":[],\"tooltip\":{\"openOn\":\"Auto\",\"content\":\"\",\"isSticky\":false},\"inEdges\":[],\"outEdges\":[],\"parentId\":\"swimlane\",\"processId\":\"\",\"umlIndex\":-1,\"isPhase\":false,\"isLane\":true,\"addInfo\":{\"parentId\":\"swimlane\"}}],\"modifiedConnectors\":[],\"entryType\":\"RowHeightChanged\",\"actionTrigger\":\"CustomAction\",\"propertyChanges\":null,\"entry\":{\"type\":\"RowHeightChanged\"}}"
            ]);
            expect((diagram2.nodes[0].shape as SwimLaneModel).lanes[1].height == (diagram.nodes[0].shape as SwimLaneModel).lanes[1].height).toBe(true)
            done();
        })

        it('SwimLane - ColumnWidthChanged', function (done) {
            diagram2.setDiagramUpdates([
                "{\"modifiedNodes\":[{\"annotations\":[{\"id\":\"phase154\",\"content\":\"Phase\",\"rotateAngle\":0,\"annotationType\":\"String\",\"style\":{\"strokeWidth\":0,\"strokeColor\":\"transparent\",\"fill\":\"transparent\",\"bold\":false,\"textWrapping\":\"WrapWithOverflow\",\"color\":\"black\",\"whiteSpace\":\"CollapseSpace\",\"fontFamily\":\"Arial\",\"fontSize\":12,\"italic\":false,\"opacity\":1,\"strokeDashArray\":\"\",\"textAlign\":\"Center\",\"textOverflow\":\"Wrap\",\"textDecoration\":\"None\"},\"hyperlink\":{\"link\":\"\",\"hyperlinkOpenState\":\"NewTab\",\"content\":\"\",\"textDecoration\":\"None\"},\"constraints\":4,\"visibility\":true,\"rotationReference\":\"Parent\",\"margin\":{\"right\":0,\"bottom\":0,\"left\":0,\"top\":0},\"horizontalAlignment\":\"Center\",\"verticalAlignment\":\"Center\",\"offset\":{\"x\":0.5,\"y\":0.5},\"tooltip\":{\"content\":\"\"}}],\"maxWidth\":274,\"id\":\"swimlanephase154_header\",\"offsetX\":300,\"offsetY\":200,\"style\":{\"fill\":\"#FFFFFF\",\"strokeColor\":\"#CCCCCC\",\"strokeWidth\":1,\"strokeDashArray\":\"3,3\",\"gradient\":{\"type\":\"None\"},\"opacity\":1,\"textOverflow\":\"Wrap\"},\"rowIndex\":1,\"columnIndex\":1,\"pivot\":{\"x\":0.5,\"y\":0.5},\"container\":{\"type\":\"Canvas\",\"orientation\":\"Horizontal\"},\"height\":20,\"shape\":{\"type\":\"Basic\",\"shape\":\"Rectangle\",\"cornerRadius\":0},\"ports\":[],\"constraints\":22017646,\"zIndex\":2,\"visible\":true,\"horizontalAlignment\":\"Left\",\"verticalAlignment\":\"Top\",\"backgroundColor\":\"transparent\",\"borderColor\":\"none\",\"borderWidth\":0,\"rotateAngle\":0,\"margin\":{\"right\":0,\"bottom\":0,\"left\":0,\"top\":0},\"flip\":0,\"flipMode\":\"All\",\"wrapper\":{\"actualSize\":{\"width\":274,\"height\":20},\"offsetX\":432,\"offsetY\":125},\"isExpanded\":true,\"expandIcon\":{\"shape\":\"None\"},\"fixedUserHandles\":[],\"tooltip\":{\"openOn\":\"Auto\",\"content\":\"\",\"isSticky\":false},\"inEdges\":[],\"outEdges\":[],\"parentId\":\"swimlane\",\"processId\":\"\",\"umlIndex\":-1,\"isPhase\":true,\"isLane\":false,\"addInfo\":{\"parentId\":\"swimlane\"}}],\"modifiedConnectors\":[],\"entryType\":\"ColumnWidthChanged\",\"actionTrigger\":\"CustomAction\",\"propertyChanges\":null,\"entry\":{\"type\":\"ColumnWidthChanged\"}}"
            ]);
            diagram.setDiagramUpdates([
                "{\"modifiedNodes\":[{\"annotations\":[{\"id\":\"phase154\",\"content\":\"Phase\",\"rotateAngle\":0,\"annotationType\":\"String\",\"style\":{\"strokeWidth\":0,\"strokeColor\":\"transparent\",\"fill\":\"transparent\",\"bold\":false,\"textWrapping\":\"WrapWithOverflow\",\"color\":\"black\",\"whiteSpace\":\"CollapseSpace\",\"fontFamily\":\"Arial\",\"fontSize\":12,\"italic\":false,\"opacity\":1,\"strokeDashArray\":\"\",\"textAlign\":\"Center\",\"textOverflow\":\"Wrap\",\"textDecoration\":\"None\"},\"hyperlink\":{\"link\":\"\",\"hyperlinkOpenState\":\"NewTab\",\"content\":\"\",\"textDecoration\":\"None\"},\"constraints\":4,\"visibility\":true,\"rotationReference\":\"Parent\",\"margin\":{\"right\":0,\"bottom\":0,\"left\":0,\"top\":0},\"horizontalAlignment\":\"Center\",\"verticalAlignment\":\"Center\",\"offset\":{\"x\":0.5,\"y\":0.5},\"tooltip\":{\"content\":\"\"}}],\"maxWidth\":274,\"id\":\"swimlanephase154_header\",\"offsetX\":300,\"offsetY\":200,\"style\":{\"fill\":\"#FFFFFF\",\"strokeColor\":\"#CCCCCC\",\"strokeWidth\":1,\"strokeDashArray\":\"3,3\",\"gradient\":{\"type\":\"None\"},\"opacity\":1,\"textOverflow\":\"Wrap\"},\"rowIndex\":1,\"columnIndex\":1,\"pivot\":{\"x\":0.5,\"y\":0.5},\"container\":{\"type\":\"Canvas\",\"orientation\":\"Horizontal\"},\"height\":20,\"shape\":{\"type\":\"Basic\",\"shape\":\"Rectangle\",\"cornerRadius\":0},\"ports\":[],\"constraints\":22017646,\"zIndex\":2,\"visible\":true,\"horizontalAlignment\":\"Left\",\"verticalAlignment\":\"Top\",\"backgroundColor\":\"transparent\",\"borderColor\":\"none\",\"borderWidth\":0,\"rotateAngle\":0,\"margin\":{\"right\":0,\"bottom\":0,\"left\":0,\"top\":0},\"flip\":0,\"flipMode\":\"All\",\"wrapper\":{\"actualSize\":{\"width\":274,\"height\":20},\"offsetX\":432,\"offsetY\":125},\"isExpanded\":true,\"expandIcon\":{\"shape\":\"None\"},\"fixedUserHandles\":[],\"tooltip\":{\"openOn\":\"Auto\",\"content\":\"\",\"isSticky\":false},\"inEdges\":[],\"outEdges\":[],\"parentId\":\"swimlane\",\"processId\":\"\",\"umlIndex\":-1,\"isPhase\":true,\"isLane\":false,\"addInfo\":{\"parentId\":\"swimlane\"}}],\"modifiedConnectors\":[],\"entryType\":\"ColumnWidthChanged\",\"actionTrigger\":\"CustomAction\",\"propertyChanges\":null,\"entry\":{\"type\":\"ColumnWidthChanged\"}}"
            ]);
            expect((diagram2.nodes[0].shape as SwimLaneModel).lanes[1].width == (diagram.nodes[0].shape as SwimLaneModel).lanes[1].width).toBe(true)
            done();
        })
        
        it('Invalid DiagramChanges passed to setDiagramUpdates method', function (done) {
            diagram2.setDiagramUpdates([
                "{\"modifiedNodes\":{},\"entry\":{\"type\":\"ColumnWidthChanged\"}}", 
                "{\"modifiedConnectors\":{},\"entry\":{\"type\":\"ColumnWidthChanged\"}}",
                null,
                "{\"modifiedNodes\":{}}"
            ]);
            done();
        })

    })

    describe('Node group interactions', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let diagramEle1: HTMLElement;
        let diagramEle2: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;
        let left1: number; let top1: number;
        let left2: number; let top2: number;


        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'NodeInteraction' });
            diagramEle1 = createElement('div', { id: 'diagram9' });
            diagramEle2 = createElement('div', { id: 'diagram10' })
            ele.appendChild(diagramEle1);
            ele.appendChild(diagramEle2);
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1',
                offsetX: 0,
                offsetY: 0,
                width: 50,
                height: 50
            },
            {
                id: 'node2',
                offsetX: 100,
                offsetY: 100,
                width: 50,
                height: 50
            }];
            diagram = new Diagram({
                width: 800, height: 500, nodes: nodes,
                enableCollaborativeEditing: true,
                historyChange: function (args: IHistoryChangeArgs) {
                    let changes: string[] = diagram.getDiagramUpdates(args);
                    if (changes.length > 0) {
                        diagram2.setDiagramUpdates(changes);
                    }
                }
            });
            diagram2 = new Diagram({
                width: 800, height: 500, nodes: nodes,
                enableCollaborativeEditing: true,
            })
            diagram.appendTo('#diagram9');
            diagram2.appendTo("#diagram10");
            diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
            diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas1, 1, 1);
            left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
        });

        afterAll((): void => {
            mouseEvents = null;
            diagramCanvas1 = null;
            diagram.destroy();
            diagram2.destroy();
            diagramEle1.remove();
            diagramEle2.remove();
            ele.remove();
        });
        it('NodeGroup keyboard interaction', function (done) {
            diagram.selectAll();
            diagram.group();
            expect(diagram2.nodes.length == 3).toBe(true);
            diagram.unGroup();
            expect(diagram2.nodes.length == 2).toBe(true);
            done()
        });
        it('NodeGroup Undo and redo', function (done) {
            diagram.selectAll();
            diagram.group();
            expect(diagram2.nodes.length == 3).toBe(true);
            diagram.unGroup();
            expect(diagram2.nodes.length == 2).toBe(true);
            diagram.undo();
            expect(diagram2.nodes.length == 3).toBe(true);
            diagram.undo();
            expect(diagram2.nodes.length == 2).toBe(true);
            diagram.redo();
            expect(diagram2.nodes.length == 3).toBe(true);
            diagram.redo();
            expect(diagram2.nodes.length == 2).toBe(true);
            done()

        });
        it('NodeGroup drag', function (done) {
            diagram.selectAll();
            diagram.group()
            collaborativeNodeRotate(diagram, 30);
            expect(diagram2.nodes[0].offsetX == diagram2.nodes[0].offsetX).toBe(true);
            diagram.group();
            done()

        })
        it('NodeGroup copy paste', function (done) {
            diagram.selectAll();
            diagram.group()
            diagram.copy();
            expect(diagram2.nodes.length).toBe(3);
            diagram.paste();
            expect(diagram2.nodes.length).toBe(6);
            diagram.cut();
            expect(diagram2.nodes.length).toBe(3);
            diagram.paste();
            expect(diagram2.nodes.length).toBe(6);
            diagram.undo();
            expect(diagram2.nodes.length).toBe(3);
            diagram.redo();
            expect(diagram2.nodes.length).toBe(6);
            diagram.undo();
            done();
        });

        it('NodeGroup copy paste', function (done) {
            let nodes: NodeModel[] = [{
                id: 'node3',
                offsetX: 200,
                offsetY: 200,
                width: 50,
                height: 50
            },]
            diagram.addElements(nodes)
            diagram.addChildToGroup(diagram.nodes[2], 'node3');
            expect(diagram2.nodes[2].children.length).toBe(3);
            diagram.undo();
            expect(diagram2.nodes[2].children.length).toBe(2);
            diagram.redo();
            expect(diagram2.nodes[2].children.length).toBe(3);
            done()
        });
        it('NodeGroup copy paste', function (done) {
            diagram.removeChildFromGroup(diagram.nodes[2], 'node3');
            expect(diagram2.nodes[2].children.length).toBe(2);
            diagram.undo();
            expect(diagram2.nodes[2].children.length).toBe(3);
            diagram.redo();
            expect(diagram2.nodes[2].children.length).toBe(2);
            done()
        });

    })

    describe('Node annotation interactions', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let diagramEle1: HTMLElement;
        let diagramEle2: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;
        let left1: number; let top1: number;
        let left2: number; let top2: number;


        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'NodeInteraction' });
            diagramEle1 = createElement('div', { id: 'diagram9' });
            diagramEle2 = createElement('div', { id: 'diagram10' })
            ele.appendChild(diagramEle1);
            ele.appendChild(diagramEle2);
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ id: 'annotation1', offset: { x: 2, y: 1.5 }, content: 'Path Element', constraints: AnnotationConstraints.Interaction, width: 100, height: 100 }]
            }];
            diagram = new Diagram({
                width: 800, height: 500, nodes: nodes,
                enableCollaborativeEditing: true,
                historyChange: function (args: IHistoryChangeArgs) {
                    let changes: string[] = diagram.getDiagramUpdates(args);
                    if (changes.length > 0) {
                        diagram2.setDiagramUpdates(changes);
                    }
                }
            });
            diagram2 = new Diagram({
                width: 800, height: 500, nodes: nodes,
                enableCollaborativeEditing: true,
            })
            diagram.appendTo('#diagram9');
            diagram2.appendTo("#diagram10");
            diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
            diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
            mouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas1, 1, 1);
            left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
        });

        afterAll((): void => {
            mouseEvents = null;
            diagramCanvas1 = null;
            diagram.destroy();
            diagram2.destroy();
            diagramEle1.remove();
            diagramEle2.remove();
            ele.remove();
        });
        it('annotation drag', (done: Function) => {
            var node = diagram.nodes[0];
            var annotation = node.wrapper.children[1];
            mouseEvents.clickEvent(diagramCanvas1, annotation.offsetX + left1, annotation.offsetY + top1);
            collaborativeNode1drag(diagram, mouseEvents);
            expect(diagram.nodes[0].wrapper.children[1].offsetX == diagram2.nodes[0].wrapper.children[1].offsetX).toBe(true);
            expect(diagram.nodes[0].wrapper.children[1].offsetY == diagram2.nodes[0].wrapper.children[1].offsetY).toBe(true);
            done();
        });

        it('serializeHistoryChange checking', function (done) {
            var changes = diagram.getDiagramUpdates(null);
            expect(changes.length == 0).toBe(true);
            changes = diagram.getDiagramUpdates({} as IHistoryChangeArgs);
            expect(changes.length == 0).toBe(true);
            done();
        });

    })
    describe('Node z-order interactions', () => {
        let diagram: Diagram;
        let diagram2: Diagram;
        let ele: HTMLElement;
        let diagramEle1: HTMLElement;
        let diagramEle2: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas1: HTMLElement;
        let diagramCanvas2: HTMLElement;
        let left1: number; let top1: number;
        let left2: number; let top2: number;


        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'NodeInteraction' });
            diagramEle1 = createElement('div', { id: 'diagram9' });
            diagramEle2 = createElement('div', { id: 'diagram10' })
            ele.appendChild(diagramEle1);
            ele.appendChild(diagramEle2);
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{

                id: 'node2',
                width: 200,
                height: 100,
                offsetX: 250,
                offsetY: 220,
                style: {
                    fill: '#6BA5D7',
                    strokeColor: 'white',
                    strokeWidth: 1
                },
            },

            {
                id: 'node3',
                width: 200,
                height: 200,
                offsetX: 300,
                offsetY: 220,
                style: {
                    fill: '#6BA5D7',
                    strokeColor: 'white',
                    strokeWidth: 1
                },
            }];
            diagram = new Diagram({
                width: 800, height: 500, nodes: nodes,
                enableCollaborativeEditing: true,
                historyChange: function (args: IHistoryChangeArgs) {
                    let changes: string[] = diagram.getDiagramUpdates(args);
                    if (changes.length > 0) {
                        diagram2.setDiagramUpdates(changes);
                    }
                }
            });
            diagram2 = new Diagram({
                width: 800, height: 500, nodes: nodes,
                enableCollaborativeEditing: true,
            })
            diagram.appendTo('#diagram9');
            diagram2.appendTo("#diagram10");
            diagramCanvas1 = document.getElementById(diagram.element.id + 'content');
            diagramCanvas2 = document.getElementById(diagram2.element.id + 'content');
            mouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas1, 1, 1);
            left1 = diagram.element.offsetLeft; top1 = diagram.element.offsetTop;
        });

        afterAll((): void => {
            mouseEvents = null;
            diagramCanvas1 = null;
            diagram.destroy();
            diagram2.destroy();
            diagramEle1.remove();
            diagramEle2.remove();
            ele.remove();
        });
        it('z-order command sendBackward', (done) => {
            mouseEvents.clickEvent(diagramCanvas1, 300, 220);
            diagram.sendBackward()
            expect(diagram2.nodes[0].zIndex == diagram2.nodes[0].zIndex);
            done();

        });

        it('z-order command bringToFront', (done) => {
            diagram.bringToFront()
            expect(diagram2.nodes[0].zIndex == diagram2.nodes[0].zIndex);
            done();
        });

        it('z-order command sendToBack', (done) => {
            diagram.sendToBack();
            expect(diagram2.nodes[0].zIndex == diagram2.nodes[0].zIndex);
            done();

        });

        it('z-order command moveForward', (done) => {
            diagram.moveForward()
            expect(diagram2.nodes[0].zIndex == diagram2.nodes[0].zIndex);
            done();

        });


    })
})

