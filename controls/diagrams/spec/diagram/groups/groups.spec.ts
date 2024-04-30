import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { DiagramScroller } from '../../../src/diagram/interaction/scroller';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { Snapping } from '../../../src/diagram/objects/snapping';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { DiagramContextMenu } from '../../../src/diagram/objects/context-menu';
import { Node, SnapSettingsModel, DiagramElement, ShapeAnnotationModel, PointPortModel, Connector } from '../../../src/diagram/index';
import { SnapConstraints, PortVisibility, PortConstraints, AnnotationConstraints, ConnectorConstraints } from '../../../src/diagram/enum/enum';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
import { GradientModel, LinearGradientModel, RadialGradientModel, NodeConstraints, ShadowModel, GradientType } from "../../../src/diagram/index"
Diagram.Inject(UndoRedo, DiagramContextMenu, Snapping);
/**
 * Groups Spec
 */
describe('Group', () => {

    describe('Group', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

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
                    id: 'node1', width: 100, height: 100, offsetX: 100,
                    offsetY: 200,
                }, {
                    id: 'node2', width: 200, height: 100, offsetX: 400,
                    offsetY: 400
                },
                {
                    id: 'node3', width: 100, height: 100, offsetX: 700,
                    offsetY: 400
                },
                { id: 'group', children: ['node1', 'node2', 'connector1'] },
                { id: 'group2', children: ['node3', 'group'] }];
            let connector: ConnectorModel = {
                id: 'connector1', sourceID: 'node1', targetID: 'node2'
            };
            let connector2: ConnectorModel = {
                id: 'connector2', sourceID: 'group', targetID: 'node3'
            };

            diagram = new Diagram({
                width: '1500px', height: '600px', nodes: nodes,
                connectors: [connector, connector2],
                snapSettings: { constraints: 0 }, contextMenuSettings: { show: true }
            });
            diagram.appendTo('#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('select group', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.selectAll();
            expect(diagram.selectedItems.nodes.length).toBe(1);
            diagram.clearSelection();
            done();
        });
        it('Group With Default', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 275, 300);
            mouseEvents.mouseMoveEvent(diagramCanvas, 400, 400);
            //check size too
            expect(diagram.selectedItems.nodes[0].wrapper.offsetX === 400 &&
                diagram.selectedItems.nodes[0].wrapper.offsetY === 300).toBe(true);
            done();
        });
        it('Scale the group', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 700, 300);
            mouseEvents.mouseMoveEvent(diagramCanvas, 749, 299);
            mouseEvents.mouseDownEvent(diagramCanvas, 749, 299);
            mouseEvents.mouseMoveEvent(diagramCanvas, 800, 300);
            mouseEvents.mouseUpEvent(diagramCanvas, 800, 300);
            diagram.undo();
            //check not proper - have to check size
            expect(diagram.selectedItems.nodes[0].wrapper.offsetX === 400 &&
                diagram.selectedItems.nodes[0].wrapper.offsetY === 300).toBe(true);
            done();
        });
        it('Drag the group', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 700, 300);
            mouseEvents.mouseDownEvent(diagramCanvas, 700, 300);
            mouseEvents.mouseMoveEvent(diagramCanvas, 750, 250);
            mouseEvents.mouseUpEvent(diagramCanvas, 750, 250);
            expect(diagram.selectedItems.nodes[0].wrapper.offsetX === 450 &&
                diagram.selectedItems.nodes[0].wrapper.offsetY === 250).toBe(true);
            done();
            diagram.undo();
        });
        it('Background color for the group', (done: Function) => {
            diagram.nodes[2].backgroundColor = 'blue';
            diagram.nodes[3].backgroundColor = 'red';
            diagram.dataBind();
            //check not proper
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            expect(diagram.selectedItems.nodes[0].backgroundColor).toBe('transparent');
            done();
            diagram.clearSelection();
        });
        it('Multiple selection restriction for the group', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 400, 400);
            mouseEvents.clickEvent(diagramCanvas, 400, 400);
            mouseEvents.clickEvent(diagramCanvas, 400, 400);
            mouseEvents.clickEvent(diagramCanvas, 100, 200, true);
            expect(diagram.selectedItems.nodes.length).toBe(1);
            done();
            diagram.clearSelection();
        });
        it('Delete the group', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 275, 300);
            diagram.remove();
            expect(diagram.nodes.length).toBe(0);
            diagram.undo();
            expect(diagram.nodes.length).toBe(5);
            diagram.clearSelection();
            done();
        });
        it('Delete the child from the group', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 400, 400);
            mouseEvents.clickEvent(diagramCanvas, 400, 400);
            mouseEvents.clickEvent(diagramCanvas, 400, 400);
            diagram.remove();
            expect(diagram.nodes.length).toBe(4);

            diagram.undo();
            expect(diagram.nodes.length).toBe(5);
            done();
        });

        it('Copy paste the multilevel group', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 400, 400);
            diagram.copy();
            expect(Object.keys(diagram.nameTable).length).toBe(7);
            //2 groups,1 connector, 3 nodes so 7+6 =13
            diagram.paste();
            expect(Object.keys(diagram.nameTable).length).toBe(13);
            diagram.cut();
            expect(Object.keys(diagram.nameTable).length).toBe(7);
            diagram.paste();
            expect(Object.keys(diagram.nameTable).length).toBe(13);
            diagram.undo();
            expect(Object.keys(diagram.nameTable).length).toBe(7);
            diagram.redo();
            expect(Object.keys(diagram.nameTable).length).toBe(13);
            done();
        });
    });
    describe('Group With context Menu', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();
        let group: NodeModel = { id: 'group2', children: ['node3', 'node4'] };
        let node6: NodeModel = {
            width: 100, height: 100, offsetX: 950,
            offsetY: 100
        };

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourceID: 'node1', targetID: 'node2'
            };
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100,
                    offsetY: 200,
                }, {
                    id: 'node2', width: 200, height: 100, offsetX: 400,
                    offsetY: 400
                },
                {
                    id: 'node3', width: 100, height: 100, offsetX: 700,
                    offsetY: 400
                },
                {
                    id: 'node4', width: 100, height: 100, offsetX: 950,
                    offsetY: 300
                },
                {
                    id: 'node5', width: 100, height: 100, offsetX: 950,
                    offsetY: 600
                },
            ];

            diagram = new Diagram({
                width: '1500px', height: '600px', nodes: nodes,
                connectors: [connector],
                snapSettings: { constraints: 0 }, contextMenuSettings: { show: true }
            });
            diagram.appendTo('#diagram');
            diagram.add(group);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Add Child as string to the  group', (done: Function) => {
            diagram.addChild(group, 'node5');
            for (let i: number = 0; i < diagram.nodes.length; i++) {
                if (diagram.nodes[i].id === 'group') {
                    expect(diagram.nodes[i].children.length).toBe(3);
                }
            }
            done();
        });
        it('Add Child as Object to the  group', (done: Function) => {
            diagram.addChild(group, node6);
            for (let i: number = 0; i < diagram.nodes.length; i++) {
                if (diagram.nodes[i].id === 'group') {
                    expect(diagram.nodes[i].children.length).toBe(4);
                }
            }
            done();
        });
        it('Add Child as string to the  group which is not in name table', (done: Function) => {
            diagram.addChild(group, 'xxx');
            for (let i: number = 0; i < diagram.nodes.length; i++) {
                if (diagram.nodes[i].id === 'group') {
                    expect(diagram.nodes[i].children.length).toBe(4);
                }
            }
            done();
        });
        it('Add Child to the node which does not have any children', (done: Function) => {
            diagram.addChild(node6, 'xxx');
            for (let i: number = 0; i < diagram.nodes.length; i++) {
                if (diagram.nodes[i].id === 'group') {
                    expect(diagram.nodes[i].children.length).toBe(4);
                }
            }
            done();
        });
        it('Delete Child from the node as string', (done: Function) => {
            diagram.deleteChild('node5', group);
            for (let i: number = 0; i < diagram.nodes.length; i++) {
                if (diagram.nodes[i].id === 'group') {
                    expect(diagram.nodes[i].children.length).toBe(3);
                }
            }
            done();
        });
        it('Delete Child from the node  as Object', (done: Function) => {
            diagram.deleteChild('xxx', node6);
            for (let i: number = 0; i < diagram.nodes.length; i++) {
                if (diagram.nodes[i].id === 'group') {
                    expect(diagram.nodes[i].children.length).toBe(3);
                }
            }
            done();
        });
        it('Delete Child from the Group  as Object', (done: Function) => {
            diagram.deleteChild(node6, group);
            for (let i: number = 0; i < diagram.nodes.length; i++) {
                if (diagram.nodes[i].id === 'group') {
                    expect(diagram.nodes[i].children.length).toBe(3);
                }
            }
            done();
        });
        it('Context Menu - Group', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 200);
            mouseEvents.clickEvent(diagramCanvas, 400, 400, true);
            (diagram.contextMenuModule as any).eventArgs = { target: document.getElementById('diagramdraw_diagramAdorner_svg') };
            let e = {
                event: (diagram.contextMenuModule as any).eventArgs,
                items: (diagram.contextMenuModule.contextMenu.items[6] as MenuItemModel).items,
            };
            for (let i of e.items) {
                if (i.id ===
                    diagram.contextMenuModule.contextMenu.element.id + '_' + 'group') {
                    (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                    (diagram.contextMenuModule as any).contextMenuOpen();
                    (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                    (diagram.contextMenuModule as any).contextMenuOnClose(e);
                    break;
                }
            }
            diagram.clearSelection();
            expect(diagram.nodes.length).toBe(8);
            diagram.undo();
            expect(diagram.nodes.length).toBe(7);
            diagram.redo();
            expect(diagram.nodes.length).toBe(8);
            done();
        });
        it('Context Menu - Ungroup', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            (diagram.contextMenuModule as any).eventArgs = { target: document.getElementById('diagramdraw_diagramAdorner_svg') };
            let e = {
                event: (diagram.contextMenuModule as any).eventArgs,
                items: (diagram.contextMenuModule.contextMenu.items[6] as MenuItemModel).items,
            };
            for (let i of e.items) {
                if (i.id ===
                    diagram.contextMenuModule.contextMenu.element.id + '_' + 'unGroup') {
                    (diagram.contextMenuModule as any).contextMenuBeforeOpen(e);
                    (diagram.contextMenuModule as any).contextMenuOpen();
                    (diagram.contextMenuModule as any).contextMenuItemClick({ item: i });
                    (diagram.contextMenuModule as any).contextMenuOnClose(e);
                    break;
                }
            }
            diagram.clearSelection();
            expect(diagram.nodes.length).toBe(7);
            diagram.undo();
            expect(diagram.nodes.length).toBe(8);
            diagram.redo();
            expect(diagram.nodes.length).toBe(7);
            done();
        });

        it('Ungroup - Internal Group', (done: Function) => {
            diagram.add({ id: 'group1', children: ['node1', 'group2'] });
            expect(diagram.nodes.length).toBe(8);
            expect((diagram.nameTable['group1'] as Node).children.length).toBe(2);
            let internalGroup = diagram.nameTable['group2'];
            let groupElement: HTMLElement = document.getElementById(internalGroup.id + '_groupElement');
            expect((internalGroup as Node).parentId).toBe('group1');
            diagram.select([internalGroup]);
            diagram.unGroup();
            expect(diagram.nodes.length).toBe(7);
            expect((diagram.nameTable['group1'] as Node).children.length).toBe(1);
            expect(document.getElementById(internalGroup.id)).toBeNull;
            expect(groupElement).toBeNull;
            done();
        });
    });
    describe('Add child to the group', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();
        let group: NodeModel = { id: 'group2', children: ['node3', 'node4'] };
        let node6: NodeModel = {
            width: 100, height: 100, offsetX: 950,
            offsetY: 100
        };

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourceID: 'node1', targetID: 'node2'
            };
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100,
                    offsetY: 200,
                }, {
                    id: 'node2', width: 200, height: 100, offsetX: 400,
                    offsetY: 400
                },
                {
                    id: 'node3', width: 100, height: 100, offsetX: 700,
                    offsetY: 400
                },
                {
                    id: 'node4', width: 100, height: 100, offsetX: 950,
                    offsetY: 300
                },
                {
                    id: 'node5', width: 100, height: 100, offsetX: 950,
                    offsetY: 600
                },
            ];

            diagram = new Diagram({
                width: '1500px', height: '600px', nodes: nodes,
                connectors: [connector],
                snapSettings: { constraints: 0 }, contextMenuSettings: { show: true }
            });
            diagram.appendTo('#diagram');
            diagram.add(group);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Add Child as string to the  group', (done: Function) => {
            diagram.addChildToGroup(group, 'node5');
            for (let i: number = 0; i < diagram.nodes.length; i++) {
                if (diagram.nodes[i].id === 'group') {
                    expect(diagram.nodes[i].children.length).toBe(3);
                }
            }
            done();
        });
        it('Add Child as Object to the  group', (done: Function) => {
            diagram.addChildToGroup(group, node6);
            for (let i: number = 0; i < diagram.nodes.length; i++) {
                if (diagram.nodes[i].id === 'group') {
                    expect(diagram.nodes[i].children.length).toBe(4);
                }
            }
            done();
        });
    });
    describe('Diagram with element pass as parameter', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();
        let group: NodeModel = { id: 'group2', children: ['node3', 'node4'] };
        let node6: NodeModel = {
            width: 100, height: 100, offsetX: 950,
            offsetY: 100
        };

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourceID: 'node1', targetID: 'node2'
            };
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100,
                    offsetY: 200,
                }, {
                    id: 'node2', width: 200, height: 100, offsetX: 400,
                    offsetY: 400
                },
                { id: 'group', children: ['node1', 'node2'], }
            ];

            let snapSettings: SnapSettingsModel = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.SnapToObject | SnapConstraints.SnapToLines) | SnapConstraints.ShowLines
            };

            diagram = new Diagram({
                width: '1000px', height: '500px', nodes: nodes,
                connectors: [connector],
                snapSettings: snapSettings, contextMenuSettings: { show: true }
            }, '#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Copy paste - group', (done: Function) => {

            let offsetX = diagram.nodes[2].offsetX;
            let offsetY = diagram.nodes[2].offsetY;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, offsetX, offsetY);
            diagram.copy();
            diagram.paste();
            expect(diagram.nodes.length).toBe(6);
            diagram.undo();
            expect(diagram.nodes.length).toBe(3);
            diagram.redo();
            expect(diagram.nodes.length).toBe(6);
            expect(diagram.nodes[5].offsetX).toBe(offsetX + 10);
            expect(diagram.nodes[5].offsetY).toBe(offsetY + 10);
            done();
        });
    });
    describe('Copy and paste two time for group', () => {
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
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourceID: 'node1', targetID: 'node2'
            };
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100,
                    offsetY: 200,
                }, {
                    id: 'node2', width: 200, height: 100, offsetX: 400,
                    offsetY: 400
                },
                { id: 'group', children: ['node1', 'node2'], }
            ];
            diagram = new Diagram({
                width: '1000px', height: '500px', nodes: nodes,
                connectors: [connector],
            }, '#diagram');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Copy paste - group two times', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.selectAll();
                diagram.copy();
                diagram.paste();
                diagram.paste();
            expect(diagram.connectors.length === 3).toBe(true);
            done();
        });
    });
    describe('Group with annnotation', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

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
                    id: 'node1', width: 100, height: 100, offsetX: 100,
                    ports: [{ id: 'port1', visibility: PortVisibility.Visible }],
                    offsetY: 200,
                }, {
                    id: 'node2', width: 200, height: 100, offsetX: 400,
                    offsetY: 400
                },
                {
                    id: 'node3', width: 100, height: 100, offsetX: 700,
                    offsetY: 400
                },
                { id: 'group', children: ['node1', 'node2'] },
                { id: 'group2', children: ['node3', 'group'] }
            ];
            let connector: ConnectorModel = {
                id: 'connector1', sourceID: 'node1', targetID: 'node2'
            };
            let connector2: ConnectorModel = {
                id: 'connector2', sourceID: 'group', targetID: 'node3'
            };

            diagram = new Diagram({
                width: '1000px', height: '600px', nodes: nodes,
                snapSettings: { constraints: 0 },
                contextMenuSettings: { show: true }
            });
            diagram.appendTo('#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Group With Default along with annotation rotate', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 275, 300);
            mouseEvents.dblclickEvent(diagramCanvas, 400, 400);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'Text';
            //check size too
            expect(diagram.selectedItems.nodes[0].wrapper.offsetX === 400 &&
                diagram.selectedItems.nodes[0].wrapper.offsetY === 300).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            mouseEvents.clickEvent(diagramCanvas, 275, 300);
            mouseEvents.clickEvent(diagramCanvas, 275, 300);
            mouseEvents.dragAndDropEvent(diagramCanvas, 275, 120, 200, 150);

            expect(Math.round(diagram.selectedItems.nodes[0].wrapper.children[0].parentTransform) === 331 || Math.round(diagram.selectedItems.nodes[0].wrapper.children[0].parentTransform) === 332 || Math.ceil(diagram.selectedItems.nodes[0].wrapper.children[0].parentTransform) === 334).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            mouseEvents.clickEvent(diagramCanvas, 100, 300);
            expect(diagram.selectedItems.nodes[0].id === 'group2').toBe(true);
            done();
        });

        it('Rotated Group', (done: Function) => {
            diagram.select([diagram.nameTable['group2']]);
            let copiedObject = diagram.copy();
            copiedObject[0].rotateAngle = 45;
            diagram.paste(copiedObject as object[]);
            expect(Math.round(diagram.nodes[diagram.nodes.length - 2].rotateAngle) == 16 || Math.round(diagram.nodes[diagram.nodes.length - 2].rotateAngle) === 17 || Math.round(diagram.nodes[diagram.nodes.length - 2].rotateAngle) == 18 ).toBe(true);
            done();
        });
    });
    describe('Group with crash issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

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
                    id: 'node1', width: 100, height: 100, offsetX: 100,
                    ports: [{ id: 'port1', visibility: PortVisibility.Visible }],
                    offsetY: 200,
                }, {
                    id: 'node2', width: 200, height: 100, offsetX: 400,
                    offsetY: 400
                },

                {
                    id: 'group', children: ['node1', 'node2'], ports: [{
                        id: 'port22', constraints: PortConstraints.Drag,
                        visibility: PortVisibility.Visible, offset: { x: 0, y: 0 }
                    },
                    {
                        id: 'port222', constraints: PortConstraints.Drag,
                        visibility: PortVisibility.Visible, offset: { x: 1, y: 1 }
                    }],
                },

            ];

            diagram = new Diagram({
                width: '1000px', height: '600px', nodes: nodes, mode: 'SVG',
                snapSettings: { constraints: 0 },
                contextMenuSettings: { show: true },
            });
            diagram.appendTo('#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Group With crash issue while select all', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.add({ id: 'node', width: 50, height: 50, offsetX: 100, offsetY: 100 });
            diagram.selectAll();
            expect(diagram.selectedItems.nodes.length === 2).toBe(true);
            done();
        });
        it('Drag GroupPort and drag child node of the group ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            
            let portelement = document.getElementById('group_port22');
            let bounds: DOMRect | ClientRect = portelement.getBoundingClientRect();
            mouseEvents.dragAndDropEvent(diagramCanvas, (bounds as DOMRect).x + (bounds as DOMRect).width / 2, (bounds as DOMRect).y + (bounds as DOMRect).height / 2, 70, 170);
            console.log('diagram.nodes[2].ports[0].offset.x: +' + diagram.nodes[2].ports[0].offset.x);
            console.log('diagram.nodes[2].ports[0].offset.y: +' + diagram.nodes[2].ports[0].offset.y);
            expect(diagram.nodes[2].ports[0].offset.x === 0.02666666666666667 &&
                diagram.nodes[2].ports[0].offset.y === 0.06666666666666667).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            mouseEvents.clickEvent(diagramCanvas, 400, 400);
            mouseEvents.clickEvent(diagramCanvas, 400, 400);
            mouseEvents.dragAndDropEvent(diagramCanvas, 400, 400, 450, 450);
            let element = document.getElementById('group_port222')
            console.log('element.attributes[2].value: ' + element.attributes[2].value);
            expect(element.attributes[2].value === 'rotate(0,562.5,520.5)translate(556.5,514.5)').toBe(false);
            done()
        });
    });
    describe('Group - width and height', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_group_width_height' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', offsetX: 450, offsetY: 150, width: 100, height: 100,
                }, {
                    id: 'node2', width: 100, height: 100, offsetX: 550, offsetY: 250,
                }, {
                    id: 'group', ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } }],
                    children: ['node1', 'node2'], style: { fill: 'gray', strokeColor: "black" }, rotateAngle: 0, width: 40, height: 40
                }
            ];

            diagram = new Diagram({
                width: '800px', height: '600px', nodes: nodes,
                snapSettings: { constraints: 0 }, contextMenuSettings: { show: true }
            });
            diagram.appendTo('#diagram_group_width_height');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking group have width and height in rendering', (done: Function) => {
            expect(Math.round(diagram.nodes[0].width) === 20 && Math.round(diagram.nodes[0].height) === 20 &&
                Math.round(diagram.nodes[1].width) === 20 && Math.round(diagram.nodes[1].height) === 20 &&
                diagram.nodes[2].width === 40 && diagram.nodes[2].height === 40 &&
                diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 200).toBe(true);
            done();
        });
        it('Update group width and height at run time', (done: Function) => {
            var group1 = diagram.nodes[2];
            group1.width = 100;
            group1.height = 100;
            diagram.dataBind();
            expect(Math.round(diagram.nodes[0].width) === 50 && Math.round(diagram.nodes[0].height) === 50 &&
                Math.round(diagram.nodes[1].width) === 50 && Math.round(diagram.nodes[1].height) === 50 &&
                diagram.nodes[2].width === 100 && diagram.nodes[2].height === 100 &&
                diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 200).toBe(true);
            done();
        });
        it('group property issue and save and load isse', (done: Function) => {
            let element: HTMLElement = document.getElementById("group_groupElement");
            let group: HTMLElement = element.childNodes[0] as HTMLElement;
            expect(group.attributes[15].value === "gray" && group.attributes[12].value === "black").toBe(true);
            let savedata = diagram.saveDiagram();
            var group1 = diagram.nodes[2];
            diagram.scale(group1, 1.2, 1.2, { x: 0, y: 0.5 });
            var groupNode = diagram.nodes[2];
            expect(groupNode.width === 120 && groupNode.height === 120).toBe(true);
            done();
        })
        it('add and remove label issue', (done: Function) => {
            let group1 = diagram.nodes[2] as Node;
            let label: ShapeAnnotationModel[] = [{ id: 'label1', content: 'Label1', offset: { x: 0.5, y: 0.5 } },]
            diagram.addLabels(group1, label);
            let element: HTMLElement = document.getElementById("group_label1_groupElement");
            expect((element.childNodes.length > 0)).toBe(true);
            diagram.removeLabels(group1, label);
            let element1 = document.getElementById("group_label1_groupElement");
            expect(!(element1.childNodes.length > 0)).toBe(true);
            done();
        })
        it('remove Port issue', (done: Function) => {
            let group1 = diagram.nodes[2] as Node;
            let port: PointPortModel[] = [
                { id: 'port1', }, { id: 'port2', }, { id: 'port3', }, { id: 'port4', }
            ]
            let element: HTMLElement = document.getElementById("group_port1_groupElement");
            expect((element.childNodes.length > 0)).toBe(true);
            diagram.removePorts(group1, port);
            var element1 = document.getElementById("group_port1_groupElement")
            expect(!(element1.childNodes.length > 0)).toBe(true);
            done();
        })
    });
    describe('Group - width and height', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_group_group_width_height' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node6', width: 50, height: 50, offsetX: 750,
                    offsetY: 100
                },
                {
                    id: 'node7', width: 50, height: 50, offsetX: 750,
                    offsetY: 170
                },
                {
                    id: 'node8', width: 50, height: 50, offsetX: 850,
                    offsetY: 100
                },

                { id: 'group4', children: ['node6', 'node7'], },
                { id: 'group5', children: ['group4', 'node8'], },
            ];

            diagram = new Diagram({
                width: '800px', height: '600px', nodes: nodes,
                scrollSettings: { verticalOffset: 20 },
                snapSettings: { constraints: 0 }, contextMenuSettings: { show: true }
            });
            diagram.appendTo('#diagram_group_group_width_height');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking group have width and height in rendering', (done: Function) => {
            expect(diagram.nodes[3].width == 50 && diagram.nodes[3].height == 120 &&
                diagram.nodes[3].offsetX == 750 && diagram.nodes[3].offsetY == 135).toBe(true);
            diagram.nodes[4].offsetX = 500;
            diagram.nodes[4].offsetY = 500;
            diagram.nodes[4].width = 200;
            diagram.nodes[4].height = 200;
            diagram.dataBind();
            expect(diagram.nodes[3].offsetX == 733.3299999999999 && diagram.nodes[3].offsetY == 135).toBe(true);
            done();
        });
        it('Checking group have width and height in rendering', (done: Function) => {
            let data
            let selArray = [];
            selArray.push(diagram.nodes[3]);
            diagram.select(selArray);
            let selectorElement = document.getElementById('diagram_group_group_width_height_SelectorElement');
            var children = selectorElement.children[3] as HTMLElement
            expect(children.getAttribute('cx') === '699.9966666666667' || children.getAttribute('x') === '692.9966666666667').toBe(true)
            data = diagram.selectedItems.nodes;
            diagram.paste(data);

            expect(diagram.nodes.length === 8).toBe(true);
            done();
        });
    });
    describe('Performance Fix break issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_group_group_width_height' });
            document.body.appendChild(ele);
            var newnode = {
                offsetX: 250,
                offsetY: 250,
                width: 100,
                height: 100,
                shape: {
                    type: "Basic",
                    shape: "Triangle"
                },
                style: {
                    fill: '#6BA5D7',
                    strokeColor: 'white'
                },
                annotations: [
                    { content: "ssss",
                    constraints: AnnotationConstraints.Interaction,
                        style: { fill: "transparent" } }
                ]
            };
            var nodes = [
                {
                    id: 'node1', width: 50, height: 50, offsetX: 600,
                    offsetY: 300,
                }, {
                    id: 'node2', width: 50, height: 50, offsetX: 600,
                    offsetY: 400
                },
                { id: 'group', children: ['node1', 'node2'], rotateAngle: 45 },
            ];
            var connectors:ConnectorModel = {
                id: 'connector2',
                type: 'Straight',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 400, y: 200 },
                annotations: [{ content: 'tecp' }],
                sourceDecorator: {
                    style: { fill: 'black' },
                    shape: 'Diamond',
                    pivot: { x: 0, y: 0.5 }
                },
                targetDecorator: {
                   // shape: 'None',
                    style: { fill: 'blue' },
                    pivot: { x: 0, y: 0.5 }
                }
            };
            diagram = new Diagram({
                width: '800px', height: '500px',nodes: nodes,
                connectors: [connectors],
            });
            diagram.appendTo('#diagram_group_group_width_height');
            diagram.add(newnode as Node);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking node drag and changing the text element by double click', (done: Function) => {
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            var offsetX = diagram.nodes[3].offsetX;
            var offsetY = diagram.nodes[3].offsetY;
            var mouseEvents = new MouseEvents();
            mouseEvents.mouseMoveEvent(diagramCanvas, offsetX, offsetY, true);
            mouseEvents.dragAndDropEvent(diagramCanvas, offsetX, offsetY, offsetX, offsetY);
            mouseEvents.mouseMoveEvent(diagramCanvas, 800, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.dragAndDropEvent(diagramCanvas, offsetX, offsetY, offsetX + 100, offsetY);
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 400, 300);
            diagram.startTextEdit(diagram.selectedItems.nodes[0], diagram.selectedItems.nodes[0].annotations[0].id);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'editText1';
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            var temp = document.getElementById(diagram.nodes[3].wrapper.children[1].id + '_groupElement');
            expect(temp.children[0].getAttribute('fill') === 'transparent').toBe(true);
            var shape = document.getElementById(diagram.nodes[3].wrapper.children[0].id + '_groupElement');
            expect(shape.children[0].getAttribute('d') === "M50,0 L100,100 L0,100 L50,0 Z ").toBe(true);
            let left: number; let top: number;
            mouseEvents.clickEvent(diagramCanvas, 1, 1);
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            let node: NodeModel = (diagram.nodes[3] as NodeModel);
            let annotation: DiagramElement = node.wrapper.children[1];
            mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
            diagram.nudge('Right'); 
            done();
        });
        it('Checking source and target decorator color', (done: Function) => {
        let diagramCanvas = document.getElementById(diagram.element.id + 'content');
        let offsetX = diagram.connectors[0].wrapper.offsetX;
        let offsetY= diagram.connectors[0].wrapper.offsetY;

        mouseEvents.dragAndDropEvent(diagramCanvas, offsetX, offsetY, offsetX - 20, offsetY - 20);
        var connector = diagram.connectors[0];
        connector.targetDecorator.style.fill = 'red';
        diagram.dataBind();
        var element = document.getElementById((connector as Connector).id+'_tarDec_groupElement')
        expect(element.children[0].getAttribute('fill')==='red').toBe(true);
            done();
        });
        it('copy and paste group issue', (done: Function) => {
            let offsetX = diagram.nodes[2].offsetX;
        let offsetY = diagram.nodes[2].offsetY;
        let diagramCanvas = document.getElementById(diagram.element.id + 'content');
        var mouseEvents = new MouseEvents();
        mouseEvents.clickEvent(diagramCanvas, offsetX, offsetY);
        diagram.copy();
        diagram.paste();
        var node =diagram.nodes[5];
        var element = document.getElementById((node as Node).id+'_content_groupElement')
        expect(element.children[0].getAttribute('fill')==='white'&&element.children[0].getAttribute('stroke')==='black').toBe(true);
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
    describe('group undo redo', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_group_group_width_height' });
            document.body.appendChild(ele);
            var newnode = {
                offsetX: 250,
                offsetY: 250,
                width: 100,
                height: 100,
                shape: {
                    type: "Basic",
                    shape: "Triangle"
                },
                style: {
                    fill: '#6BA5D7',
                    strokeColor: 'white'
                },
                annotations: [
                    { content: "ssss",
                    constraints: AnnotationConstraints.Interaction,
                        style: { fill: "transparent" } }
                ]
            };
            var nodes = [
                {
                    id: 'node1', width: 50, height: 50, offsetX: 600,
                    offsetY: 300,
                }, {
                    id: 'node2', width: 50, height: 50, offsetX: 600,
                    offsetY: 400
                },
            ];

            diagram = new Diagram({
                width: '800px', height: '500px',nodes: nodes,
            });
            diagram.appendTo('#diagram_group_group_width_height');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('group the node and undo testing', (done: Function) => {
           let diagramCanvas = document.getElementById(diagram.element.id + 'content');
           diagram.selectAll();
           expect((diagram.selectedItems.nodes.length === 2)).toBe(true);
           diagram.group();
           diagram.undo();
           diagram.clearSelection();
           diagram.select([diagram.nameTable['node1']]);
           expect((diagram.selectedItems.nodes.length === 1)).toBe(true);
           done();
           diagram.select([diagram.nameTable['node2']]);
           expect((diagram.selectedItems.nodes.length === 1)).toBe(true);
           done();
        });
    });
    describe('Z-index Check For Group', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_group_group_width_height' });
            document.body.appendChild(ele);
            var nodes = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
                }, {
                    id: 'node2', width: 50, height: 50, offsetX: 250,
                    offsetY: 300,
                    style: { fill: '#6BA5D7', strokeColor: 'white' },
                },
            ];
            diagram = new Diagram({
                width: '800px', height: '500px', nodes: nodes,
            });
            diagram.appendTo('#diagram_group_group_width_height');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Performing BringToFront', (done: Function) => {
            diagram.select([diagram.nameTable['node1']]);
            diagram.bringToFront();
            let zindexValue = diagram.nameTable['node1'].zIndex;
            diagram.selectAll();
            diagram.group();
            expect((diagram.nameTable['node1'].zIndex === zindexValue)).toBe(true);
            done();
        });
    });
    describe('Resize handle not rendered properly issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll(() => {

            ele = createElement('div', { id: 'diagrampivot' });
            document.body.appendChild(ele);

            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }],
                    pivot: { x: 0, y: 0 }
                },
                { id: 'group', children: ['node1'], pivot: { x: 0, y: 0 }},

            ];
            diagram = new Diagram({
                width: '900px', height: '500px', nodes: nodes,
            });
            diagram.appendTo('#diagrampivot');

        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Check whether resize handle renders properly for node pivot - 0, 0', function (done) {
            diagram.select([diagram.nodes[1]]);
            let northWestelement: HTMLElement = document.getElementById('resizeNorthWest');
            let northEastelement: HTMLElement = document.getElementById('resizeNorthEast');
            let southWestelement: HTMLElement = document.getElementById('resizeSouthWest');
            let southEastelement: HTMLElement = document.getElementById('resizeSouthEast');
            expect(northWestelement.getAttribute('x') === '93' && northWestelement.getAttribute('y') === '93').toBe(true);
            expect(northEastelement.getAttribute('x') === '193' && northEastelement.getAttribute('y') === '93').toBe(true);
            expect(southWestelement.getAttribute('x') === '93' && southWestelement.getAttribute('y') === '193').toBe(true);
            expect(southEastelement.getAttribute('x') === '193' && southEastelement.getAttribute('y') === '193').toBe(true);
            done();
        });
    });
    describe('Group - with selection issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_group_group_width_height' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node6', width: 50, height: 50, offsetX: 750,
                    offsetY: 100
                },
                {
                    id: 'node7', width: 50, height: 50, offsetX: 750,
                    offsetY: 170
                },
                {
                    id: 'node8', width: 50, height: 50, offsetX: 850,
                    offsetY: 100
                },

                { id: 'group4', children: ['node6', 'node7'], },
            ];

            diagram = new Diagram({
                width: '800px', height: '600px', nodes: nodes,
                scrollSettings: { verticalOffset: 20 },
                snapSettings: { constraints: 0 }, contextMenuSettings: { show: true }
            });
            diagram.appendTo('#diagram_group_group_width_height');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking group selection issue', (done: Function) => {
            diagram.nodes[3].rotateAngle = 45;
            diagram.dataBind();
            expect((Math.round(diagram.nodes[3].wrapper.bounds.left) == 690) &&
                (Math.round(diagram.nodes[3].wrapper.bounds.right) == 810)).toBe(true);
            done();
        });
    });

    describe('Group - Properties', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_group_child_rendering' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 50, height: 50, offsetX: 100,
                    offsetY: 100,
                }, {
                    id: 'node2', width: 50, height: 50, offsetX: 200,
                    offsetY: 200
                },
                { id: 'group', children: ['node1', 'node2'], rotateAngle: 45, offsetX: 300, offsetY: 300, style: {fill: 'orange', strokeColor: 'red' } },
            ];

            diagram = new Diagram({
                width: '800px', height: '600px', nodes: nodes,
            });
            diagram.appendTo('#diagram_group_child_rendering');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it("Checking group's childern not visiblie issue - When group have own properties", (done: Function) => {
            var group = document.getElementById(diagram.element.id + "_diagramLayer");
            expect(group.children.length == 1).toBe(true);
            done();
        });
    });
    describe('Group - save and load', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_group_child_rendering' });
            document.body.appendChild(ele);
            
            diagram = new Diagram({
                width: '800px', height: '600px',
            });
            diagram.appendTo('#diagram_group_child_rendering');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it("load nested children of node", (done: Function) => {
            diagram.loadDiagram('{"enableRtl":false,"locale":"en-US","animationComplete":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"click":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"collectionChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"commandExecute":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"connectionChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"contextMenuBeforeItemRender":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"contextMenuClick":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"contextMenuOpen":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"created":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dataLoaded":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"doubleClick":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dragEnter":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dragLeave":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dragOver":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"drop":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"expandStateChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"historyChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"historyStateChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"keyDown":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"keyUp":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"mouseEnter":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"mouseLeave":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"mouseOver":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onImageLoad":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseDown":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseEnter":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseLeave":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseUp":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"positionChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"propertyChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"rotateChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"scrollChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"segmentCollectionChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"selectionChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"sizeChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"sourcePointChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"targetPointChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"textEdit":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"width":"10000px","height":"10000px","nodes":[{"id":"rootContainer","offsetX":5000,"offsetY":5000,"width":10000,"height":10000,"constraints":0,"children":["7cca9325-0508-4ef5-8dc4-a42562ac7f22"],"container":{"type":"Canvas","orientation":"Vertical"},"margin":{"top":0,"bottom":0,"left":0,"right":0},"shape":{"type":"Basic"},"zIndex":1,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":10000,"height":10000},"offsetX":5000,"offsetY":5000},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"processId":"","isPhase":false,"isLane":false},{"margin":{"top":2675,"bottom":0,"left":2675,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"offsetX":2750,"offsetY":2750,"width":450,"height":300,"id":"7cca9325-0508-4ef5-8dc4-a42562ac7f22","borderWidth":10,"borderColor":"#000000","children":["d7685690-f6f8-4bb2-a125-f1df16d18915","fe368c26-b4d3-4012-b876-938e24092a9d","233ccdd6-ab18-4c9f-824c-9c0ad3c44182","b2e515a5-02da-4af7-bd78-f97c2ea9efd9","577c2313-fcb6-4c4b-86ff-64d821a3d0ff","5a25a4c5-6afe-463b-b7f9-f2c0ab50ee4d","a7d2eeaf-c459-4741-93e4-34feacf55a5f"],"shape":{"type":"Basic","shape":"Rectangle","cornerRadius":0},"zIndex":2,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":150,"height":150},"offsetX":2750,"offsetY":2750},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"rootContainer","processId":"","isPhase":false,"isLane":false},{"margin":{"top":-160,"bottom":0,"left":0,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"height":150,"width":150,"id":"d7685690-f6f8-4bb2-a125-f1df16d18915","children":["b071a11f-310a-f793-63ef-957c60fdafe8"],"shape":{"type":"Basic","shape":"Rectangle","cornerRadius":0},"zIndex":3,"offsetX":2750,"offsetY":2590,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":150,"height":150},"offsetX":2750,"offsetY":2590},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"7cca9325-0508-4ef5-8dc4-a42562ac7f22","processId":"","isPhase":false,"isLane":false},{"margin":{"top":-160,"bottom":0,"left":150,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"height":150,"width":150,"id":"fe368c26-b4d3-4012-b876-938e24092a9d","children":["757749f8-7657-0bae-ea4d-cbf47f4d06ff"],"shape":{"type":"Basic","shape":"Rectangle","cornerRadius":0},"zIndex":4,"offsetX":2900,"offsetY":2590,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":150,"height":150},"offsetX":2900,"offsetY":2590},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"7cca9325-0508-4ef5-8dc4-a42562ac7f22","processId":"","isPhase":false,"isLane":false},{"margin":{"top":-160,"bottom":0,"left":300,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"height":150,"width":150,"id":"233ccdd6-ab18-4c9f-824c-9c0ad3c44182","children":["4c75da75-d893-a749-6cbb-cecb46f8cb0c"],"shape":{"type":"Basic","shape":"Rectangle","cornerRadius":0},"zIndex":5,"offsetX":3050,"offsetY":2590,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":150,"height":150},"offsetX":3050,"offsetY":2590},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"7cca9325-0508-4ef5-8dc4-a42562ac7f22","processId":"","isPhase":false,"isLane":false},{"margin":{"top":310,"bottom":0,"left":0,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"height":150,"width":150,"id":"b2e515a5-02da-4af7-bd78-f97c2ea9efd9","children":["a4c599ae-a055-ca4c-ffcc-21761fb82722"],"shape":{"type":"Basic","shape":"Rectangle","cornerRadius":0},"zIndex":6,"offsetX":2750,"offsetY":3060,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":150,"height":150},"offsetX":2750,"offsetY":3060},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"7cca9325-0508-4ef5-8dc4-a42562ac7f22","processId":"","isPhase":false,"isLane":false},{"margin":{"top":310,"bottom":0,"left":150,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"height":150,"width":150,"id":"577c2313-fcb6-4c4b-86ff-64d821a3d0ff","children":["0f317fe2-726d-0b5c-14a8-08de944b5333"],"shape":{"type":"Basic","shape":"Rectangle","cornerRadius":0},"zIndex":7,"offsetX":2900,"offsetY":3060,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":150,"height":150},"offsetX":2900,"offsetY":3060},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"7cca9325-0508-4ef5-8dc4-a42562ac7f22","processId":"","isPhase":false,"isLane":false},{"margin":{"top":0,"bottom":0,"left":460,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"height":150,"width":150,"id":"5a25a4c5-6afe-463b-b7f9-f2c0ab50ee4d","shape":{"type":"Basic","shape":"Rectangle","cornerRadius":0},"zIndex":8,"offsetX":3210,"offsetY":2750,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":150,"height":150},"offsetX":3210,"offsetY":2750},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"7cca9325-0508-4ef5-8dc4-a42562ac7f22","processId":"","isPhase":false,"isLane":false},{"margin":{"top":150,"bottom":0,"left":460,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"height":150,"width":150,"id":"a7d2eeaf-c459-4741-93e4-34feacf55a5f","shape":{"type":"Basic","shape":"Rectangle","cornerRadius":0},"zIndex":9,"offsetX":3210,"offsetY":2900,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":150,"height":150},"offsetX":3210,"offsetY":2900},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"7cca9325-0508-4ef5-8dc4-a42562ac7f22","processId":"","isPhase":false,"isLane":false},{"margin":{"top":40,"bottom":0,"left":36,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"shape":{"type":"Basic","shape":"Ellipse"},"width":46,"height":46,"id":"b071a11f-310a-f793-63ef-957c60fdafe8","zIndex":10,"offsetX":2734,"offsetY":2578,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":46,"height":46},"offsetX":2734,"offsetY":2578},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"d7685690-f6f8-4bb2-a125-f1df16d18915","processId":"","isPhase":false,"isLane":false},{"margin":{"top":44,"bottom":0,"left":29,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"shape":{"type":"Basic","shape":"Rectangle","cornerRadius":15},"height":50,"width":50,"id":"757749f8-7657-0bae-ea4d-cbf47f4d06ff","zIndex":11,"offsetX":2879,"offsetY":2584,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":50,"height":50},"offsetX":2879,"offsetY":2584},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"fe368c26-b4d3-4012-b876-938e24092a9d","processId":"","isPhase":false,"isLane":false},{"margin":{"top":75,"bottom":0,"left":46,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"shape":{"type":"Basic","shape":"Ellipse"},"width":26,"height":26,"id":"4c75da75-d893-a749-6cbb-cecb46f8cb0c","zIndex":12,"offsetX":3034,"offsetY":2603,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":26,"height":26},"offsetX":3034,"offsetY":2603},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"233ccdd6-ab18-4c9f-824c-9c0ad3c44182","processId":"","isPhase":false,"isLane":false},{"margin":{"top":33,"bottom":0,"left":58,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"shape":{"type":"Basic","shape":"Ellipse"},"width":26,"height":26,"id":"a4c599ae-a055-ca4c-ffcc-21761fb82722","zIndex":13,"offsetX":2746,"offsetY":3031,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":26,"height":26},"offsetX":2746,"offsetY":3031},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"b2e515a5-02da-4af7-bd78-f97c2ea9efd9","processId":"","isPhase":false,"isLane":false},{"margin":{"top":40,"bottom":0,"left":39,"right":0},"container":{"type":"Canvas","orientation":"Vertical"},"shape":{"type":"Basic","shape":"Ellipse"},"width":60,"height":60,"id":"0f317fe2-726d-0b5c-14a8-08de944b5333","zIndex":14,"offsetX":2894,"offsetY":3055,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"flip":"None","wrapper":{"actualSize":{"width":60,"height":60},"offsetX":2894,"offsetY":3055},"constraints":5240814,"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[{"id":"817558d8-84fd-4612-8cfe-76931782cf4c","content":"CS","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"577c2313-fcb6-4c4b-86ff-64d821a3d0ff","processId":"","isPhase":false,"isLane":false}],"enablePersistence":false,"scrollSettings":{"viewPortWidth":10000,"viewPortHeight":10000,"currentZoom":1,"horizontalOffset":0,"verticalOffset":0,"padding":{"left":0,"right":0,"top":0,"bottom":0}},"rulerSettings":{"showRulers":false},"backgroundColor":"transparent","dataSourceSettings":{"crudAction":{"read":""},"dataManager":null,"dataSource":null},"mode":"SVG","layers":[{"id":"default_layer","visible":true,"lock":false,"objects":["rootContainer","7cca9325-0508-4ef5-8dc4-a42562ac7f22","d7685690-f6f8-4bb2-a125-f1df16d18915","fe368c26-b4d3-4012-b876-938e24092a9d","233ccdd6-ab18-4c9f-824c-9c0ad3c44182","b2e515a5-02da-4af7-bd78-f97c2ea9efd9","577c2313-fcb6-4c4b-86ff-64d821a3d0ff","5a25a4c5-6afe-463b-b7f9-f2c0ab50ee4d","a7d2eeaf-c459-4741-93e4-34feacf55a5f","b071a11f-310a-f793-63ef-957c60fdafe8","757749f8-7657-0bae-ea4d-cbf47f4d06ff","4c75da75-d893-a749-6cbb-cecb46f8cb0c","a4c599ae-a055-ca4c-ffcc-21761fb82722","0f317fe2-726d-0b5c-14a8-08de944b5333"],"zIndex":0}],"connectors":[],"constraints":500,"layout":{"type":"None"},"pageSettings":{"boundaryConstraints":"Infinity","orientation":"Landscape","height":null,"width":null,"background":{"source":"","color":"transparent"},"showPageBreaks":false,"fitOptions":{"canFit":false}},"snapSettings":{"constraints":31,"gridType":"Lines","verticalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20],"lineDashArray":"","lineColor":"lightgray"},"horizontalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20],"lineDashArray":"","lineColor":"lightgray"}},"selectedItems":{"nodes":[],"connectors":[],"wrapper":null,"constraints":16382,"rotateAngle":0,"userHandles":[]},"basicElements":[],"tooltip":{"content":""},"commandManager":{"commands":[]},"tool":3,"customCursor":[],"version":17.1}');
            expect(diagram.nodes.length == 14).toBe(true);
            done();
        });
    });
    describe('Group width and height does not update', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let nodes: NodeModel[];
        let linearGradient: GradientModel | LinearGradientModel | RadialGradientModel;
        linearGradient = {
            x1: 0,
            y1: 0,
            x2: 50,
            y2: 50,
            stops: [{
                color: 'white',
                offset: 0
            },
            {
                color: '#6BA5D7',
                offset: 100
            }
            ],
            type: 'Linear'
        };
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_group' });
            document.body.appendChild(ele);
            nodes = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100,
                    offsetY: 100,
                }, {
                    id: 'node2', width: 100, height: 100, offsetX: 200,
                    offsetY: 200
                },
                {
                    id: 'group2',
                    children: ['node1', 'node2']
                },
                {
                    id: 'node3', width: 100, height: 100, offsetX: 350,
                    offsetY: 300
                }
            ];
            diagram = new Diagram({
                width: '1050px', height: '500px', nodes: nodes,
            });
            diagram.appendTo('#diagram_group');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it("When child is added to a group", (done: Function) => {
        diagram.addChildToGroup(diagram.nodes[2], diagram.nodes[3]);
        expect(diagram.nodes[2].height === 300 && diagram.nodes[2].width === 350 && diagram.nodes[2].offsetX === 225 && diagram.nodes[2].offsetY === 200 ).toBe(true);
        done();
        });
        it("When linear gradient is applied to a group", (done: Function) => {
            // let node: any = diagram.select([diagram.nodes[2]]);
            diagram.nodes[2].style = {
                gradient: linearGradient
            }
            expect(diagram.nodes[2].style.gradient !== null).toBe(true);
            done();
        });
    });
    describe('Group width and height does not update', () => {
        let diagram: Diagram;
        let ele: HTMLElement;        
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_group_AddChildToGroup' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 180,
                    offsetY: 100,
                },
                { id: 'group', children: ['node1', 'con1'],},
            ];
            let connectors: ConnectorModel[] = [
                {
                    id: 'con1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 450, y: 100 }
                }];
            diagram = new Diagram({
                width: '1050px', height: '500px', nodes: nodes, connectors: connectors
            });
            diagram.appendTo('#diagram_group_AddChildToGroup');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it("Dragging issue - group have a one of conector as a child", (done: Function) => {
            let mouseevents = new MouseEvents();
            let diagramCanvas = document.getElementById(diagram.element.id+'content');
            let group: Node =  diagram.getObject("group") as Node;
            let oldOffsetX = group.offsetX; let oldOffsetY = group.offsetY;            
            mouseevents.clickEvent(diagramCanvas, group.offsetX + diagram.element.offsetLeft, group.offsetY + diagram.element.offsetTop);
            expect(diagram.selectedItems.nodes[0].id == 'group').toBe(true);
            mouseevents.mouseDownEvent(diagramCanvas, group.offsetX + diagram.element.offsetLeft, group.offsetY + diagram.element.offsetTop);
            mouseevents.mouseMoveEvent(diagramCanvas, group.offsetX + diagram.element.offsetLeft+500, group.offsetY + diagram.element.offsetTop+100);
            mouseevents.mouseUpEvent(diagramCanvas, group.offsetX + diagram.element.offsetLeft+500+10, group.offsetY + diagram.element.offsetTop+100);
            let newOffsetX = group.offsetX; let newOffsetY = group.offsetY;
            expect(newOffsetX != oldOffsetX && newOffsetY != oldOffsetY).toBe(false);
            diagram.clearSelection();
            expect(diagram.selectedItems.nodes.length == 0).toBe(true);
            diagram.undo();
            expect(group.offsetX == oldOffsetX && group.offsetY == oldOffsetY).toBe(true);
            diagram.redo();
            expect(group.offsetX == newOffsetX && group.offsetY == newOffsetY).toBe(true);
            done();       
        });
        it("AddChildToGroup method", (done: Function) => {
            let group: Node =  diagram.getObject("group") as Node;
            let node6: NodeModel = { id: 'node2', width: 80, height: 100, offsetX: 520, offsetY: 100 };
            diagram.undo();
            diagram.select([group]);
            expect(diagram.selectedItems.nodes[0].id == 'group').toBe(true);
            diagram.addChildToGroup(group, node6);
            let node: Node = diagram.getObject('node2') as Node;
            expect(diagram.nodes.length == 3 && node.parentId == 'group' && group.children.length == 3).toBe(true);
            diagram.undo();
            expect(group.children.length == 2 && diagram.nodes.length == 2).toBe(true);
            diagram.redo();
            node = diagram.getObject('node2') as Node;
            expect(group.children.length == 3 && node.parentId == 'group' && diagram.nodes.length == 3).toBe(true);
            done();
        });
        it("Remove method", (done: Function) => {
            expect(diagram.nodes.length == 3).toBe(true);
            let group: Node =  diagram.getObject("group") as Node;
            diagram.remove(group);
            expect(diagram.nodes.length == 0).toBe(true);
            diagram.undo();
            expect(diagram.nodes.length == 3).toBe(true);
            diagram.redo();
            expect(diagram.nodes.length == 0).toBe(true);
            done();
        });
    });
});
describe('change styles of group', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'diagram_group_group_width_height' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0 } }],
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                ports: [{ id: 'port2', visibility: PortVisibility.Visible, offset: { x: 0, y: 0.5 } }],                
            },
        ];

        diagram = new Diagram({
            width: '800px', height: '500px', nodes: nodes,
        });
        diagram.appendTo('#diagram_group_group_width_height');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    function applyStyle(
        node: NodeModel, width: number, array: string, con: NodeConstraints,
        type: GradientType, sh: ShadowModel): void {
        node.style.fill = '#37909A';
        node.style.strokeWidth = width;
        node.style.strokeColor = '#024249';
        node.style.strokeDashArray = array;
        if (!type) {
            node.style.gradient.type = 'None';
        } else {
            let gradient: GradientModel | LinearGradientModel | RadialGradientModel;
            if (type === 'Linear') {
                gradient = {
                    //Start point of linear gradient
                    x1: 0, y1: 0,
                    //End point of linear gradient
                    x2: 50, y2: 50,
                    //Sets an array of stop objects
                    stops: [{ color: '#00555b', offset: 0 },
                    { color: '#37909A', offset: 90 }],
                    type: 'Linear'
                };
            } else {
                gradient = {
                    cx: 50, cy: 50, fx: 50, fy: 50,
                    stops: [{ color: '#00555b', offset: 0 },
                    { color: '#37909A', offset: 90 }],
                    type: 'Radial'
                };
            }
    
            node.style.gradient = gradient;
        }        
        diagram.dataBind();
    }
    it('applying styles for the group in runtime', (done: Function) => {
       let diagramCanvas = document.getElementById(diagram.element.id + 'content');
       diagram.selectAll();      
       diagram.group();
       //mouseEvents.clickEvent(diagramCanvas, 200, 200);
        mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 150);
        mouseEvents.mouseUpEvent(diagramCanvas, 250, 150);
        applyStyle(diagram.selectedObject.actualObject, 2, '5,5', undefined, undefined, undefined);        
        expect((diagram.selectedItems.nodes[0].style.fill === '#37909A')).toBe(true);
        expect((diagram.selectedItems.nodes[0].wrapper.children[1].style.fill === 'transparent')).toBe(true);
        done();
    });
});
describe('Check connector when in grouping ', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let diagramCanvas: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'groupDragging' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
            }, {
                id: 'node2', width: 100, height: 100, offsetX: 240, offsetY: 240,
            },
        ];
        let connector: ConnectorModel = {};
        connector.id = 'connector_1';
        connector.type = 'Straight';
        connector.sourceID = 'node1';
        connector.targetID = 'node2';
        connector.segments = [{ type: 'Straight', direction: "Right", length: 70 }, { type: 'Straight', direction: "Bottom", length: 20 }]

        diagram = new Diagram({
            width: 1000, height: 1000, connectors: [connector], nodes: nodes,
            getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                let connector: ConnectorModel = {};
                connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                return connector;
            },
        });

        diagram.appendTo('#groupDragging');
        diagram.selectAll();
        diagram.group();
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking when drag and drop the node in group', (done: Function) => {
        expect(diagram.nodes[0].offsetX).toEqual(100);
        expect(diagram.nodes[0].offsetY).toEqual(100);
        expect(diagram.nodes[1].offsetX).toEqual(240);
        expect(diagram.nodes[1].offsetY).toEqual(240);
        expect(diagram.nodes[2].offsetX).toEqual(145);
        expect(diagram.nodes[2].offsetY).toEqual(145);
        mouseEvents.mouseDownEvent(diagramCanvas, 100, 100, true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 150, true);
        mouseEvents.mouseUpEvent(diagramCanvas, 250, 150);
        expect(diagram.nodes[0].offsetX).toEqual(250);
        expect(diagram.nodes[0].offsetY).toEqual(150);
        expect(diagram.nodes[1].offsetX).toEqual(390);
        expect(diagram.nodes[1].offsetY).toEqual(290);
        expect(diagram.nodes[2].offsetX).toEqual(295);
        expect(diagram.nodes[2].offsetY).toEqual(195);
        done();
    });
});
describe('group', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'diagram_group_group_width_height' });
        document.body.appendChild(ele);
        var newnode = {
            offsetX: 250,
            offsetY: 250,
            width: 100,
            height: 100,
            shape: {
                type: "Basic",
                shape: "Triangle"
            },
            style: {
                fill: '#6BA5D7',
                strokeColor: 'white'
            },
            annotations: [
                { content: "ssss",
                constraints: AnnotationConstraints.Interaction,
                    style: { fill: "transparent" } }
            ]
        };
        var nodes = [
            {
                id: 'node1', width: 50, height: 50, offsetX: 600,
                offsetY: 300,
            },
        ];

        var connectors = [
            {
            id: "connector1",
            style: {
                strokeColor: '#6BA5D7',
                fill: '#6BA5D7',
                strokeWidth: 2
            },
            targetDecorator: {
                style: {
                    fill: '#6BA5D7',
                    strokeColor: '#6BA5D7'
                }
            },
            sourcePoint: {
                x: 100,
                y: 100
            },
            targetPoint: {
                x: 200,
                y: 200
            }},
        ];

        diagram = new Diagram({
            width: '800px', height: '500px',nodes: nodes, connectors: connectors,
        });
        diagram.appendTo('#diagram_group_group_width_height');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('group multiple node and connectors', (done: Function) => {
       diagram.selectAll();
       expect(function() {diagram.group()}).not.toThrow();
       diagram.clearSelection();       
       done();
    });
});
describe('Group issue in Canvas mode', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'diagram_group' });
        document.body.appendChild(ele);
        
        var nodes = [
            {
                id: 'node1', width: 50, height: 50, offsetX: 100,
                offsetY: 100,
            },
            {
                id: 'node2', width: 50, height: 50, offsetX: 300,
                offsetY: 100,
            },
        ];

       

        diagram = new Diagram({
            width: '800px', height: '500px',nodes: nodes,
            mode: 'Canvas'
        });
        diagram.appendTo('#diagram_group');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('group multiple node and connectors', (done: Function) => {
       diagram.selectAll();
       diagram.group();
       expect(diagram.nodes.length === 3).toBe(true);
       expect(function() {diagram.unGroup()}).not.toThrow();
       expect(diagram.nodes.length === 2).toBe(true);  
       done();
    });
});

describe('Group Node padding', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let diagramCanvas: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'GroupPadding' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 50, height: 50, offsetX: 100,
                offsetY: 100,
            }, {
                id: 'node2', width: 50, height: 50, offsetX: 200,
                offsetY: 200
            },
            {
                id: 'node3', width: 100, height: 100, offsetX: 400,
                offsetY: 300
            },
            { id: 'group', children: ['node1', 'node2'] }
        ];

        diagram = new Diagram({
            width: '1000px', height: '600px', nodes: nodes,
        });
        diagram.appendTo('#GroupPadding');

    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Group node initial rendering without padding',(done:Function)=>{
        expect(diagram.nodes[3].height==150 && diagram.nodes[3].width==150 && diagram.nodes[3].padding.left==0).toBe(true);
        console.log('group node initial rendering');
        done();
    });
    it('Group node initial rendering with padding',(done:Function)=>{
        diagram.nodes[3].padding.left = 10;
        diagram.nodes[3].padding.right = 10;
        diagram.nodes[3].padding.top = 20;
        diagram.nodes[3].padding.bottom = 20;
        diagram.dataBind();
        let padding = diagram.nodes[3].padding;
        expect(diagram.nodes[3].height==190 && diagram.nodes[3].width==170 && padding.left==10 && padding.top==20).toBe(true);
        console.log('group node with padding added at runtime');
        done();
    });
    it('Rotating group node with padding',(done:Function)=>{
        let diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, diagram.nodes[3].offsetX, diagram.nodes[3].offsetY,true)
        diagram.rotate(diagram.selectedItems, 45);
        let padding = diagram.nodes[3].padding;
        expect(diagram.nodes[3].height==190 && diagram.nodes[3].width==170 && padding.left==10 &&diagram.nodes[3].rotateAngle==45).toBe(true);
        console.log('Rotate angle is '+diagram.nodes[3].rotateAngle);
        done();
    });
    it('Dragging group node with padding',(done:Function)=>{
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        let prevOffsetX = diagram.nodes[3].offsetX;
        mouseEvents.dragAndDropEvent(diagramCanvas,150,150,170,170);
        let curOffsetX = diagram.nodes[3].offsetX;
        let padding = diagram.nodes[3].padding;
        expect(diagram.nodes[3].height==190 && diagram.nodes[3].width==170 && prevOffsetX!==curOffsetX && padding.right==10 && padding.top==20).toBe(true);
        console.log(prevOffsetX+' Dragging group node with padding '+curOffsetX);
        done();
    });
    it('Save and load group node',(done:Function)=>{
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        let saveData = diagram.saveDiagram();
        localStorage.setItem('group', saveData);
        diagram.loadDiagram(localStorage.getItem('group'));
        diagram.dataBind();
        let padding = diagram.nodes[3].padding;
        expect(diagram.nodes[3].height==190 && diagram.nodes[3].width==170 && padding.left==10 && padding.top==20).toBe(true);
        console.log('After save and load');
        done();
    });
    it('Resize group node with padding', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.selectedItems.selectedObjects = [];
        diagram.select([diagram.nodes[3]]);
        let resizeOptions: HTMLElement = document.getElementById('resizeEast');
        let bounds: any = resizeOptions.getBoundingClientRect();
        let x: number = bounds.x;
        let y: number = bounds.y;
        let preWidth = diagram.nodes[3].width;
        mouseEvents.mouseDownEvent(diagramCanvas, x + 8, y + 8);
        mouseEvents.mouseMoveEvent(diagramCanvas, x - 2, y);
        mouseEvents.mouseUpEvent(diagramCanvas, x - 2, y);
        let curWidth = diagram.nodes[3].width;
        let padding = diagram.nodes[3].padding;
        expect(preWidth!==curWidth && padding.bottom==20 && padding.right==10).toBe(true);
        console.log('Before resizing :'+preWidth+', After resizing'+curWidth+', Padding')
        done();
    });
    it('Grouping in runtime and drag and rotate with and without padding',(done:Function)=>{
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents.dragAndDropEvent(diagramCanvas,10,10,550,400);
        diagram.group();
        diagram.dataBind();
        let preWidth = diagram.nodes[4].width;
        diagram.unGroup();
        diagram.dataBind();
        diagram.getNodeDefaults =(obj: Node, diagram: Diagram)=> {
            if(obj.children && obj.children.length > 0) {
                obj.padding.left = 20;
                obj.padding.right = 10;
                obj.padding.top = 20;
                obj.padding.bottom = 10;
            }else{
            obj.shape = { type: 'Basic', shape: 'Rectangle' };
            obj.style = { fill: 'transparent', strokeWidth: 1 };
            }
            return obj;
        }
        mouseEvents.dragAndDropEvent(diagramCanvas, 10, 10, 550, 400);
        diagram.group();
        let curWidth = diagram.nodes[4].width;
        diagram.rotate(diagram.selectedItems,40);
        let preOffsetX = diagram.nodes[4].offsetX;
        mouseEvents.dragAndDropEvent(diagramCanvas, 300, 300, 400, 400);
        let curOffsetX = diagram.nodes[4].offsetX;
        diagram.dataBind();
        expect(preWidth !== curWidth && preOffsetX!==curOffsetX && diagram.nodes[4].rotateAngle==40 && diagram.nodes[4].padding.bottom==10).toBe(true);
        console.log('without padding ' + preWidth +','+preOffsetX+', ' +'with padding' + curWidth +','+curOffsetX+','+diagram.nodes[4].rotateAngle);
        done();
    });
});

describe('Checking performance for dragging the group node', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let diagramCanvas: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'groupDragging' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 240, offsetY: 100,
            },
            {
                id: 'node3', width: 100, height: 100, offsetX: 100, offsetY: 300,
            }, 
            {
                id: 'node4', width: 100, height: 100, offsetX: 240, offsetY: 300,
            },
            {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 500,
            }, 
            {
                id: 'node6', width: 100, height: 100, offsetX: 240, offsetY: 500,
            },
            {
                id: 'node7', width: 100, height: 100, offsetX: 100, offsetY: 700,
            }, 
            {
                id: 'node8', width: 100, height: 100, offsetX: 240, offsetY: 700,
            },
            {
                id: 'node9', width: 100, height: 100, offsetX:400, offsetY: 100,
            },
            {
                id: 'node10', width: 100, height: 100, offsetX: 400, offsetY: 300,
            },
            {
                id: 'node11', width: 100, height: 100, offsetX: 400, offsetY: 500,
            }, 
            {
                id: 'node12', width: 100, height: 100, offsetX: 400, offsetY: 700,
            },
            {
                id: 'node13', width: 100, height: 100, offsetX:600, offsetY: 100,
            },
            {
                id: 'node14', width: 100, height: 100, offsetX: 600, offsetY: 300,
            },
            {
                id: 'node15', width: 100, height: 100, offsetX: 600, offsetY: 500,
            }, 
            {
                id: 'node16', width: 100, height: 100, offsetX: 600, offsetY: 700,
            },
        ];
        let connectors:ConnectorModel[] = [{
            id: 'connector1',
            type: 'Straight',
            sourceID : 'node1',
            targetID : 'node2',
        },
        {
            id: 'connector2',
            type: 'Straight',
            sourceID : 'node3',
            targetID : 'node4',
        },
        {
            id: 'connector3',
            type: 'Straight',
            sourceID : 'node5',
            targetID : 'node6',
        },
        {
            id: 'connector4',
            type: 'Straight',
            sourceID : 'node7',
            targetID : 'node8',
        },
        {
            id: 'connector5',
            type: 'Straight',
            sourceID : 'node2',
            targetID : 'node9',
        },
        {
            id: 'connector6',
            type: 'Straight',
            sourceID : 'node4',
            targetID : 'node10',
        },
        {
            id: 'connector7',
            type: 'Straight',
            sourceID : 'node6',
            targetID : 'node11',
        },
        {
            id: 'connector8',
            type: 'Straight',
            sourceID : 'node8',
            targetID : 'node12',
        },
        {
            id: 'connector9',
            type: 'Straight',
            sourceID : 'node9',
            targetID : 'node13',
        },
        {
            id: 'connector10',
            type: 'Straight',
            sourceID : 'node10',
            targetID : 'node14',
        },
        {
            id: 'connector11',
            type: 'Straight',
            sourceID : 'node11',
            targetID : 'node15',
        },
        {
            id: 'connector12',
            type: 'Straight',
            sourceID : 'node12',
            targetID : 'node16',
        }
    ];
        diagram = new Diagram({
            width: 1000, height: 1000, connectors: connectors, nodes: nodes,
        });
        diagram.appendTo('#groupDragging');
        diagram.selectAll();
        diagram.group();
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking when drag and drop the node in group', (done: Function) => {
        mouseEvents.mouseDownEvent(diagramCanvas, 200, 200, true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 350, true);
        mouseEvents.mouseUpEvent(diagramCanvas, 250, 350);
        expect(diagram.nodes[0].offsetX).toEqual(150);
        expect(diagram.nodes[0].offsetY).toEqual(250);
        expect(diagram.nodes[1].offsetX).toEqual(290);
        expect(diagram.nodes[1].offsetY).toEqual(250);
        expect(diagram.nodes[2].offsetX).toEqual(150);
        expect(diagram.nodes[2].offsetY).toEqual(450);
        done();
    });
});

describe('Ungrouping nodes with Id underscore', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'diagram_group' });
        document.body.appendChild(ele);
        
        var nodes = [
            {
                id: 'transaction_com', width: 50, height: 50, offsetX: 100,
                offsetY: 100,
            },
            {
                id: 'node2', width: 50, height: 50, offsetX: 300,
                offsetY: 100,
            },
        ];

        diagram = new Diagram({
            width: '800px', height: '500px',nodes: nodes,
            getNodeDefaults: function (node:any) {
                if(node.width==undefined){
                    node.width = 150
                }
                node.style = { fill: '#357BD2', strokeColor: 'white' };
            },
        });
        diagram.appendTo('#diagram_group');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Ungrouping nodes with underscore in Id', (done: Function) => {
       diagram.selectAll();
       diagram.group();
       expect(diagram.nodes.length === 3).toBe(true);
       expect(function() {diagram.unGroup()}).not.toThrow();
       expect(diagram.nodes.length === 2).toBe(true);  
       done();
    });
});

describe('UnGroup Issue - EJ2-66928',()=>{
    describe('checks Ungrouping Performing Correctly and Grouping Ports are Removed ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();
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
                    id: 'node1', width: 100, height: 100, offsetX: 100,
                    offsetY: 200,
                }, {
                    id: 'node2', width: 200, height: 100, offsetX: 400,
                    offsetY: 400
                },
                {
                    id: 'node3', width: 100, height: 100, offsetX: 700,
                    offsetY: 400
                },
                {
                    id: 'node4', width: 100, height: 100, offsetX: 900,
                    offsetY: 400
                },
                {
                    id: 'node5', width: 100, height: 100, offsetX: 700,
                    offsetY: 100
                },
                {
                    id: 'node6', width: 100, height: 100, offsetX: 100,
                    offsetY: 800,
                }, {
                    id: 'node7', width: 200, height: 100, offsetX: 400,
                    offsetY: 800
                },
                {
                    id: 'node8', width: 100, height: 100, offsetX: 400,
                    offsetY: 950
                },
                {
                    id: 'node9', width: 100, height: 100, offsetX: 900,
                    offsetY: 1000
                },
                {
                    id: 'node10', width: 100, height: 100, offsetX: 700,
                    offsetY: 1050
                },
                {
                    id: 'node11', width: 100, height: 100, offsetX: 700,
                    offsetY: 1200
                },
                { id: 'group11', children: ['node1', 'node2', 'connector1'] },
                { id: 'group22', children: ['node6', 'node7',] },
                { id: 'group33', children: ['node6', 'node7', 'node8'] },
                { id: 'group44', children: ['node9', 'node10',] },
                { id: 'group55', children: ['node9', 'node10', 'node11'] },
            ];
            let connector: ConnectorModel = {
                id: 'connector1', sourceID: 'node1', targetID: 'node2'
            };
            diagram = new Diagram({
                width: '1500px', height: '600px', nodes: nodes,
                connectors: [connector],
                snapSettings: { constraints: 0 }, contextMenuSettings: { show: true },
                getNodeDefaults: getNodeDefaults,
            });
            function getPorts(): PointPortModel[] {
                let ports: PointPortModel[] = [
                    { id: 'g_port1', shape: 'Circle', offset: { x: 0, y: 0.4 }, visibility: PortVisibility.Visible },
                    { id: 'g_port2', shape: 'Circle', offset: { x: 0.4, y: 1 }, visibility: PortVisibility.Visible },
                    { id: 'g_port3', shape: 'Circle', offset: { x: 1, y: .6 }, visibility: PortVisibility.Visible },
                    { id: 'g_port4', shape: 'Circle', offset: { x: .6, y: 0 }, visibility: PortVisibility.Visible }
                ];
                return ports;
            }
            function getNodeDefaults(node: NodeModel): NodeModel {
                let obj: NodeModel = {};
                obj.ports = getPorts();
                return obj;
            }
            diagram.appendTo('#diagram');
            //add group Runtime
            let group_runtime = { id: 'groupingID_3', children: ['node4', 'node5',] };
            diagram.add(group_runtime);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        
        // Check if Ungrouping & removing all the grouping Ports
        // Check if Ungrouping removing all the grouping Ports At Runtime groups
        it('Ungroup and remove Ports', (done: Function) => {
            diagram.select([diagram.nodes[11]]);
            let addedPorts = diagram.nodes[11];
            diagram.unGroup();          
            let portElementId_1: HTMLElement = document.getElementById(addedPorts.id + '_g_port1');
            let portElementId_2: HTMLElement = document.getElementById(addedPorts.id + '_g_port2');
            let portElementId_3: HTMLElement = document.getElementById(addedPorts.id + '_g_port3');
            let portElementId_4: HTMLElement = document.getElementById(addedPorts.id + '_g_port4');
            expect(portElementId_1).toBeNull;
            expect(portElementId_2).toBeNull;
            expect(portElementId_3).toBeNull;
            expect(portElementId_4).toBeNull;
            diagram.clearSelection();
            expect((diagram.nodes.length)).toBe(16);
            done();
        });
        
        // Check if Ungrouping removing all the grouping Ports At Runtime groups
        it('Ungroup and remove Ports in runtime added groups', (done: Function) => {
            diagram.select([diagram.nodes[15]]);
            let addedPorts = diagram.nodes[15];
            diagram.unGroup();
            let portElementId_1: HTMLElement = document.getElementById(addedPorts.id + '_g_port1');
            let portElementId_2: HTMLElement = document.getElementById(addedPorts.id + '_g_port2');
            let portElementId_3: HTMLElement = document.getElementById(addedPorts.id + '_g_port3');
            let portElementId_4: HTMLElement = document.getElementById(addedPorts.id + '_g_port4');
            expect(portElementId_1).toBeNull;
            expect(portElementId_2).toBeNull;
            expect(portElementId_3).toBeNull;
            expect(portElementId_4).toBeNull;
            diagram.clearSelection();
            expect((diagram.nodes.length)).toBe(15);
            done();
        });
        
        //to Check if the Ports are Added in the Single Node
        it('Add Ports to the selected single node', (done: Function) => {
            //addPort
            let addPort_runtime: PointPortModel[] = [
                { id: 'runtimeport_1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0.8, y: 0.8 } },
                { id: 'runtimeport_2', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0.2, y: 0.2 } },
            ];
            diagram.addPorts(diagram.nodes[3], addPort_runtime);
            expect((diagram.nodes[3]).ports.length).toBe(6);
            let addedPorts = diagram.nodes[3];
            let portElementId_1: HTMLElement = document.getElementById(addedPorts.id + '_runtimeport_1');
            let portElementId_2: HTMLElement = document.getElementById(addedPorts.id + '_runtimeport_2');
            expect(portElementId_1.id).toMatch(addedPorts.id +'_runtimeport_1');
            expect(portElementId_2.id).toMatch(addedPorts.id +'_runtimeport_2');
            done();
        });

        //to Check if the Ports are Removed in the Single Node
        it('Remove Ports form the single Node', (done: Function) => {
            // addPort Runtime
            let addPort_runtime: PointPortModel[] = [
                { id: 'runtimeport_1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0.8, y: 0.8 } },
                { id: 'runtimeport_2', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0.2, y: 0.2 } },
            ];
            //removePort
            diagram.addPorts(diagram.nodes[4], addPort_runtime);
            let removePort_runtime: PointPortModel[] = [
                { id: 'runtimeport_1', },
                { id: 'runtimeport_2', },
            ];
            diagram.removePorts(diagram.nodes[4]  as Node, removePort_runtime);
            let addedPorts = diagram.nodes[4];
            let portElementId_1: HTMLElement = document.getElementById(addedPorts.id + '_runtimeport_1');
            let portElementId_2: HTMLElement = document.getElementById(addedPorts.id + '_runtimeport_2');
            expect(portElementId_1).toBeNull;
            expect(portElementId_2).toBeNull;
            done();
        });
         
        //check ig nested groups are working fine 
        
        it('Ungroup of nested groups - ungrouping outer group node', (done: Function) => {
            
            diagram.select([diagram.nodes[12]]);
            let addedPorts = diagram.nodes[12];
            diagram.unGroup();
            let portElementId_1: HTMLElement = document.getElementById(addedPorts.id + '_g_port1');
            let portElementId_2: HTMLElement = document.getElementById(addedPorts.id + '_g_port2');
            let portElementId_3: HTMLElement = document.getElementById(addedPorts.id + '_g_port3');
            let portElementId_4: HTMLElement = document.getElementById(addedPorts.id + '_g_port4');
            expect(portElementId_1).toBeNull;
            expect(portElementId_2).toBeNull;
            expect(portElementId_3).toBeNull;
            expect(portElementId_4).toBeNull;
            diagram.clearSelection();
            expect(diagram.nodes[11].children.length).toBe(2);
            expect((diagram.nodes.length)).toBe(14);
            done();
        });
        it('Ungroup of nested groups - ungrouping inner group Node', (done: Function) => {
            diagram.select([diagram.nodes[12]]);
             let addedPorts = diagram.nodes[12];
            diagram.unGroup();
            let portElementId_1: HTMLElement = document.getElementById(addedPorts.id + '_g_port1');
            let portElementId_2: HTMLElement = document.getElementById(addedPorts.id + '_g_port2');
            let portElementId_3: HTMLElement = document.getElementById(addedPorts.id + '_g_port3');
            let portElementId_4: HTMLElement = document.getElementById(addedPorts.id + '_g_port4');
            expect(portElementId_1).toBeNull;
            expect(portElementId_2).toBeNull;
            expect(portElementId_3).toBeNull;
            expect(portElementId_4).toBeNull;
            diagram.clearSelection();
            expect(diagram.nodes[12].children.length).toBe(3);
            expect((diagram.nodes.length)).toBe(13);
            done();
        });
        it('Add and remove ports for single group node ',(done: Function)=>{
            //add port for a group node
             let addPort_runtime: PointPortModel[] = [
                { id: 'group_port_1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0.8, y: 0.8 } },
                { id: 'group_port_2', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0.2, y: 0.2 } },
            ];
            //removePort for a group node
            diagram.addPorts(diagram.nodes[11], addPort_runtime);
            let removePort_runtime: PointPortModel[] = [
                { id: 'group_port_1', },
                { id: 'group_port_2', },
            ];
            diagram.removePorts(diagram.nodes[11]  as Node, removePort_runtime);
            let addedPorts = diagram.nodes[11];
            let portElementId_1: HTMLElement = document.getElementById(addedPorts.id + '_group_port_1');
            let portElementId_2: HTMLElement = document.getElementById(addedPorts.id + '_group_port_2');
            expect(portElementId_1).toBeNull;
            expect(portElementId_2).toBeNull;
            done();
        })
    });
});
describe('Copy Paste the child node of group outside the group', () => {
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
        ele = createElement('div', { id: 'diagram3' });
        document.body.appendChild(ele);
        let port :any= [
            {
                id: 'port1',
                offset: { x: 0, y: 0.5 },
                visibility: PortVisibility.Visible,
                constraints: PortConstraints.Default | PortConstraints.Draw,
            },
            {
                id: 'port2',
                offset: { x: 1, y: 0.5 },
                visibility: PortVisibility.Visible,
                constraints: PortConstraints.Default | PortConstraints.Draw,
            },
            {
                id: 'port3',
                offset: { x: 0.5, y: 0 },
                visibility: PortVisibility.Visible,
                constraints: PortConstraints.Default | PortConstraints.Draw,
            },
            {
                id: 'port4',
                offset: { x: 0.5, y: 1 },
                visibility: PortVisibility.Visible,
                constraints: PortConstraints.Default | PortConstraints.Draw,
            },
        ]
        let node: any = [ {
            id: 'node1',
            offsetX: 150,
            offsetY: 150,
            width: 100,
            height: 100,
            ports: port,
        },
        {
            id: 'node2',
            offsetX: 550,
            offsetY: 350,
            width: 100,
            height: 100,
            ports: port,
        },
        {
            id: 'group1',
            children: ['node1', 'node2'],
            padding: { left: 10, right: 10, top: 10, bottom: 10 },
            ports: port,
            style: { strokeColor: 'black' },
        }];
            diagram = new Diagram({
            width: '500px', height: '600px', nodes:node,contextMenuSettings: { show: true }
        });

        diagram.appendTo('#diagram3');
        });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether the copied child node parentid is empty', (done: Function) => {
        diagram.select([diagram.nodes[0]])
        diagram.copy();
        diagram.paste();
        expect((diagram.selectedItems.nodes[0] as any).parentId ==="").toBe(true); done();
    });
});
   describe('Provide support to delete child from group', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'removeChildGroup' });
        document.body.appendChild(ele);

        let nodes: any = [
            {
                id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
            },
            {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2' }]
            },
            {
                id: 'group1', children: ['node1', 'node2']
            },
            {
                id: 'group2', children: ['connector1', 'connector2']
            },
            {
                id: 'node3', width: 100, height: 75, offsetX: 600, offsetY: 100, annotations: [{ content: 'node3' }]
            },
            {
                id: 'node4', width: 100, height: 75, offsetX: 800, offsetY: 100, annotations: [{ content: 'node4' }]
            },
            {
                id: 'group3', children: ['node3', 'node4', 'connector3']
            },
            {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 700, isExpanded: true,
                annotations: [{ content: 'Double click on node' }],
                expandIcon: {
                    height: 20, width: 20, shape: 'ArrowDown',
                    content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                        'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                        'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                        'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                        'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                        'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                        'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                        'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                        'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                        'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                        'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z">' +
                        '</path></g>'
                },
                collapseIcon: { height: 20, width: 20, shape: 'ArrowUp' }
            },
            {
                id: 'node6', width: 150, height: 100, offsetX: 300, offsetY: 700, style: { fill: 'none' },
                annotations: [{ content: 'Start \n Text Editing' }],
                shape: {
                    type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<g>			<path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28     C62.726,435.13,62.354,435.072,61.979,435.057z"/>			<path style="fill:#61443C;" d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304     c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296     c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504     c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/>		</g>		<path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/>		<path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/>		<path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/>		<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/>		<path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/>	</g>	<g>		<path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/>		<path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/>		<path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>		<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/>		<path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/>		<path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/>		<path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/>		<path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/>		<path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/>		<path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/>		<path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>		<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/>		<path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/>		<path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>		<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/>		<path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/>		<path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/>		<path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/>		<path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>',
                }
            },
            {
                id: 'node7', width: 100, height: 100, offsetX: 500, offsetY: 700, style: { fill: 'none' },
                annotations: [{ content: 'Check all causes' }],
                shape: { type: 'HTML', content: "<div style='background:#6BA5D7;height:100%;width:100%;'><button type='button' style='width:100px'> Button</button></div>" }
            },
            {
                id: 'group3', children: ['node5', 'node6', 'node7']
            },
            {
                id: 'node8', width: 100, height: 100, offsetX: 200, offsetY: 900, shape: {
                    type: 'HTML',
                    content: '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>'
                }
            },
            {
                id: 'node9', width: 100, height: 100, offsetX: 500, offsetY: 900,
                shape: {
                    type: 'Native',
                    content: '<g xmlns="http://www.w3.org/2000/svg"> <g transform="translate(1 1)"><g>	   <path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,             1.791-6.827,1.28 C62.726,435.13,62.354,435.072,61.979,435.057z"/><path style="fill:#61443C;"d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304 c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296 c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504 c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/>		</g>	<path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/>		<path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/>		<path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/>		<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/>		<path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/>	</g>	<g>		<path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/>		<path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/>		<path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>		<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/>		<path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/>		<path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/>		<path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/>		<path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/>		<path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/>		<path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/>		<path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>		<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/>		<path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/>		<path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>		<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/>		<path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/>		<path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/>		<path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/>		<path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>'
                },
            },
            {
                id: 'group4', children: ['node4', 'node5', 'connector4']
            }
        ];
        let connectors: any = [
            { id: 'connector1', sourcePoint: { x: 200, y: 300 }, targetPoint: { x: 200, y: 400 }, annotations: [{ content: 'Connector' }] },
            { id: 'connector2', sourcePoint: { x: 300, y: 300 }, targetPoint: { x: 300, y: 400 }, annotations: [{ content: 'Connector2' }] },
            { id: 'connector3', sourceID: 'node3', targetID: 'node4', annotations: [{ content: 'Connector3' }] },
            { id: 'connector4', sourceID: 'node4', targetID: 'node5' }
        ]
        diagram = new Diagram({
            width: '500px', height: '600px', nodes: nodes, connectors: connectors
        });
        diagram.appendTo('#removeChildGroup');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether the child is removed from group node after calling removeChild method or not', (done: Function) => {
        expect((diagram.nodes[2] as any).children.length === 2).toBe(true);
        diagram.removeChildFromGroup(diagram.nodes[2], 'node1');
        expect((diagram.nodes[2] as any).children.length === 1).toBe(true);
        diagram.undo();
        expect((diagram.nodes[2] as any).children.length === 2).toBe(true);
        diagram.redo();
        expect((diagram.nodes[2] as any).children.length === 1).toBe(true);
        var saveObj = diagram.saveDiagram();
        diagram.loadDiagram(saveObj);
        expect((diagram.nodes[2] as any).children.length === 1).toBe(true);
        expect((diagram.nodes[3] as any).children.length === 2).toBe(true);
        diagram.removeChildFromGroup(diagram.nodes[3], 'connector1');
        expect((diagram.nodes[3] as any).children.length === 1).toBe(true);
        done();
    });
    it('Check whether the child is removed with HTML node with native node ', (done: Function) => {
        expect((diagram.nodes[10] as any).children.length === 3).toBe(true);
        diagram.removeChildFromGroup(diagram.nodes[10], 'node7');
        expect((diagram.nodes[10] as any).children.length === 2).toBe(true);
        expect((diagram.nodes[13] as any).children.length === 3).toBe(true);
        diagram.removeChildFromGroup(diagram.nodes[13], 'node4');
        expect((diagram.nodes[13] as any).children.length === 2).toBe(true);
        done();
    });
});
describe('867606-Perform Grouping on the existing group', () => {
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
        ele = createElement('div', { id: 'exisitingGroup' });
        document.body.appendChild(ele);

        let nodes: any = [
            {
                id: 'node1', width: 50, height: 50, offsetX: 100,
                offsetY: 100,
            }, {
                id: 'node2', width: 50, height: 50, offsetX: 200,
                offsetY: 200
            },{
            id: 'node3', width: 50, height: 50, offsetX: 450,
                offsetY: 150
            },
            { id: 'group', children: ['node1', 'node2'], rotateAngle: 45 },

        ];
        let connectors: any = [
            { id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 300, y: 200 }}

        ]
        diagram = new Diagram({
            width: '500px', height: '600px', nodes: nodes, connectors: connectors
        });
        diagram.appendTo('#exisitingGroup');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('select nodes of a group as multiple select and perform grouping', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        expect((diagram.nodes[3] as any).children.length === 2).toBe(true);
        expect(diagram.nodes.length === 4).toBe(true);
        //do rubber band selection
        mouseEvents.dragAndDropEvent(diagramCanvas, 100, 40, 210, 275);
        diagram.group();
        expect(diagram.nodes.length === 4).toBe(true);
        expect((diagram.nodes[3] as any).children.length === 2).toBe(true);
        diagram.unSelect(diagram.nodes[3]);
        done();
    });
    it('select nodes and conectors of a different group as multiple select and perform grouping ', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        expect((diagram.nodes[3] as any).children.length === 2).toBe(true);
        expect(diagram.nodes.length === 4).toBe(true);
        //do rubber band selection
        mouseEvents.dragAndDropEvent(diagramCanvas, 253, 80, 513, 230);
        diagram.group();
        expect(diagram.nodes.length === 5).toBe(true);
        expect((diagram.nodes[3] as any).children.length === 2).toBe(true);
        expect((diagram.nodes[4] as any).children.length === 2).toBe(true);
        done();
    });
});
describe('880811-grouping child nodes with addChildToGroup method does not push child to group at DOM Level', () => {
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
        ele = createElement('div', { id: 'exisitingGroup' });
        document.body.appendChild(ele);

        let connectors = [
            {
                id: 'connector1',
                sourceID: 'node1',
                targetID: 'node2',
            },
            {
                id: 'connector2',
                sourceID: 'node2',
                targetID: 'node3',
            },
            {
                id: 'connector3',
                sourceID: 'node3',
                targetID: 'node1',
            },
            {
                id: 'connector5',
                sourcePoint: { x: 800, y: 300 },
                targetPoint: { x: 900, y: 400 },
            },
        ];

        let nodes = [
            {
                id: 'node1',
                offsetX: 375,
                offsetY: 130,
                height: 60,
                width: 100,
                annotations: [
                    {
                        content: 'Node1',
                    },
                ],
            },
            {
                id: 'node2',
                offsetX: 675,
                offsetY: 130,
                height: 60,
                width: 100,
                annotations: [
                    {
                        content: 'Node2',
                    },
                ],
            },
            {
                id: 'node3',
                offsetX: 525,
                offsetY: 300,
                height: 60,
                width: 100,
                annotations: [
                    {
                        content: 'Node3',
                    },
                ],
            },
            {
                id: 'node4',
                offsetX: 850,
                offsetY: 130,
                height: 60,
                width: 100,
                annotations: [
                    {
                        content: 'node4',
                    },
                ],
            },
            {
                id: 'group1',
                children: ['node1', 'node2', 'connector2', 'connector3'],
                padding: { left: 20, right: 20, top: 20, bottom: 20 },
                style: { fill: "white", strokeColor: 'black', strokeWidth: 2 }
            }
        ];
        diagram = new Diagram({
            width: '500px', height: '600px', nodes: nodes, connectors: connectors, getNodeDefaults: getNodeDefaults,
        });
        diagram.appendTo('#exisitingGroup');
        function getNodeDefaults(node: Node) {
            if (node.children) {
                node.padding = { left: 20, right: 20, top: 20, bottom: 20 },
                    node.style = { fill: "white", strokeColor: 'black', strokeWidth: 2 }
            }
            return node;
        }
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check the child node is moved inside the Group at DOM Level', (done: Function) => {
        expect((diagram.nodes[4] as any).children.length === 4).toBe(true);  
        diagram.addChildToGroup(diagram.nodes[4], 'node3');
        let childElement = document.getElementById('node3_groupElement');
        let groupElement = document.getElementById('group1_groupElement');
        expect((groupElement.contains(childElement))).toBe(true);
        expect((diagram.nodes[4] as any).children.length === 5).toBe(true);  
        done();
    });
    it('check the child node is moved outside the Group at DOM Level', (done: Function) => {
        expect((diagram.nodes[4] as any).children.length === 5).toBe(true);  
        diagram.removeChildFromGroup(diagram.nodes[4], 'node3');
        let childElement = document.getElementById('node3_groupElement');
        let groupElement = document.getElementById('group1_groupElement');
        expect((groupElement.parentNode.contains(childElement))).toBe(true);
        expect((diagram.nodes[4] as any).children.length === 4).toBe(true);  
        done();
    });
    it('Check the child connector is moved inside the Group at DOM Level', (done: Function) => {
        expect((diagram.nodes[4] as any).children.length === 4).toBe(true);  
        diagram.addChildToGroup(diagram.nodes[4], 'connector5');
        let childElement = document.getElementById('connector5_groupElement');
        let groupElement = document.getElementById('group1_groupElement');
        expect((groupElement.contains(childElement))).toBe(true);
        expect((diagram.nodes[4] as any).children.length === 5).toBe(true);  
        done();
    });
    it('check the child node is moved outside the Group at DOM Level', (done: Function) => {
        expect((diagram.nodes[4] as any).children.length === 5).toBe(true);  
        diagram.removeChildFromGroup(diagram.nodes[4], 'connector5');
        let childElement = document.getElementById('connector5_groupElement');
        let groupElement = document.getElementById('group1_groupElement');
        expect((groupElement.parentNode.contains(childElement))).toBe(true);
        expect((diagram.nodes[4] as any).children.length === 4).toBe(true);  
        done();
    });
    it('Group the node and connector', (done: Function) => {
        diagram.select([diagram.nodes[3], diagram.connectors[3]])
        diagram.group();
        let newGroup = diagram.getObject((diagram.nodes[3] as any).parentId);
        diagram.addChildToGroup(newGroup, 'node3');
        expect((diagram.selectedItems.nodes[0] as any).children.length === 3).toBe(true);
        done();
    });
});