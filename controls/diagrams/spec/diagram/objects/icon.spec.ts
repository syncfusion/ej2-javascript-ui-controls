import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { Node, Path } from '../../../src/diagram/objects/node';
import { Connector } from '../../../src/diagram/objects/connector';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { Container } from '../../../src/diagram/core/containers/container';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { getDiagramElement } from '../../../src/diagram/utility/dom-util';
import { DiagramNativeElement } from '../../../src/diagram/core/elements/native-element';
import { Canvas, PathElement, HierarchicalTree, DataBinding, LayoutAnimation } from '../../../src/index';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { ConnectorModel, DiagramModel } from '../../../src/diagram/index';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);

/**
 * Test cases to check different kind of Icons
 */
describe('Diagram Control', () => {

    describe('Expand Icon in svg mode', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_expandicon' });
            document.body.appendChild(ele);

            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, isExpanded: true,
                expandIcon: { height: 20, width: 20, shape: "None" }
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, isExpanded: true,
                expandIcon: { height: 20, width: 20, shape: "ArrowDown" }
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, isExpanded: true,
                expandIcon: { height: 20, width: 20, shape: "Minus", offset: { x: 0.5, y: 0.5 } }
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, isExpanded: true,
                expandIcon: { height: 20, width: 20, shape: "Plus" }
            };
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300, isExpanded: false,
                collapseIcon: { height: 20, width: 20, shape: "ArrowUp" }
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300, isExpanded: false,
                collapseIcon: { height: 20, width: 20, shape: "Path", pathData: "M0,0 L0,100" }
            };
            let node7: NodeModel = {
                id: 'node7', width: 100, height: 100, offsetX: 500, offsetY: 300, isExpanded: false,
                collapseIcon: {
                    height: 20, width: 20,
                    shape: "Template",
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
                        'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
                }
            };
            let node8: NodeModel = {
                id: 'node8', width: 100, height: 100, offsetX: 700, offsetY: 300, isExpanded: true,
                expandIcon: { height: 20, width: 20, shape: "ArrowDown" },
                collapseIcon: { height: 20, width: 20, shape: "ArrowUp" }
            };
            let node9: NodeModel = {
                id: 'node9', width: 100, height: 100, offsetX: 100, offsetY: 500, isExpanded: true,
                expandIcon: { height: 20, width: 20, shape: "ArrowDown" }
            };
            let node10: NodeModel = {
                id: 'node10', width: 100, height: 100, offsetX: 300, offsetY: 500, isExpanded: false,
                collapseIcon: {
                    height: 20, width: 20, shape: "Template",
                    content:
                        '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
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
                        'C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>'
                }
            };
            let node11: NodeModel = {
                id: 'node11', width: 100, height: 100, offsetX: 350, offsetY: 200, isExpanded: false,
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
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px',
                nodes: [node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11],
                layout: {
                    type: 'OrganizationalChart',
                },
            });
            diagram.appendTo('#diagram_expandicon');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking expand and collapse icon', (done: Function) => {
            let node1: Node = diagram.nodes[0] as Node;
            let node2: Node = diagram.nodes[1] as Node;
            let node3: Node = diagram.nodes[2] as Node;
            let node4: Node = diagram.nodes[3] as Node;
            let node5: Node = diagram.nodes[4] as Node;
            let node6: Node = diagram.nodes[5] as Node;
            let node7: Node = diagram.nodes[6] as Node;
            expect(
                node1.wrapper && node1.wrapper.children.length === 1 &&
                node2.wrapper && node2.wrapper.children.length === 2 &&
                node2.wrapper.children[1].id === 'node2_icon_content' &&
                node3.wrapper && node3.wrapper.children.length === 2 &&
                node3.wrapper.children[1].id === 'node3_icon_content' &&
                node4.wrapper && node4.wrapper.children.length === 2 &&
                node4.wrapper.children[1].id === 'node4_icon_content' &&
                node5.wrapper && node5.wrapper.children.length === 2 &&
                node5.wrapper.children[1].id === 'node5_icon_content' &&
                node6.wrapper && node6.wrapper.children.length === 2 &&
                node6.wrapper.children[1].id === 'node6_icon_content' &&
                node7.wrapper && node7.wrapper.children.length === 2 &&
                node7.wrapper.children[1].id === 'node7_icon_content').toBe(true);
            done();
        });

        it('Checking expand and collapse icon update on runtime', (done: Function) => {
            let node8: Node = diagram.nodes[7] as Node;
            node8.isExpanded = false;
            let node9: Node = diagram.nodes[8] as Node;
            node9.expandIcon.shape = 'Plus';
            let node10: Node = diagram.nodes[9] as Node;
            node10.collapseIcon.shape = 'Minus';
            diagram.dataBind();
            setTimeout(() => {
                let node8Icon: Canvas = node8.wrapper.children[1] as Canvas;
                let node9Icon: Canvas = node9.wrapper.children[1] as Canvas;
                let node10Icon: Canvas = node10.wrapper.children[1] as Canvas;
                expect(node8.isExpanded === false && (node8Icon.children[1] as PathElement).data === 'M0,100 L50,0 L100,100 Z' &&
                    (node9Icon.children[1] as PathElement).data === 'M0,-50 L0,50 M-50,0 L50,0' &&
                    (node10Icon.children[1] as PathElement).data === 'M0,50 L100,50').toBe(true);
                done();
            }, 300);
        });
        it('Checking node with collapse icon delete', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node10: NodeModel = diagram.nodes[10];
            mouseEvents.clickEvent(diagramCanvas, diagram.nodes[10].offsetX - 20, diagram.nodes[10].offsetY - 20);
            setTimeout(() => {
                expect(getDiagramElement(node10.id + '_icon_content_groupElement') !== null).toBe(true);
                diagram.remove(node10);
                expect(getDiagramElement(node10.id + '_icon_content_groupElement') === null).toBe(true);
                diagram.add(node10);
                done();
            }, 300);
        });

        it('Checking icon Corner radius', (done: Function) => {
            let newNode: NodeModel = {
                id: "newNode", offsetX: 150, offsetY: 150,
                height: 100, width: 100,
                expandIcon: {
                    height: 15, width: 15, shape: "Plus",
                    fill: 'lightgray', offset: { x: .5, y: .85 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                    padding: { left: 50 }
                },
                collapseIcon: {
                    height: 15, width: 15, shape: "Minus",
                    fill: 'lightgray', offset: { x: .5, y: .85 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                    padding: { left: 50 }
                },
                isExpanded: false
            };
            diagram.add(newNode);
            setTimeout(function () {
                let nodeIcon: Canvas = (diagram.nodes[diagram.nodes.length - 1] as Node).wrapper.children[1] as Canvas;
                expect((nodeIcon.children[1] as PathElement).data === 'M0,50 L100,50').toBe(true);
                expect(nodeIcon.children[1].offsetX === 150).toBe(true);
                expect(nodeIcon.children[1].offsetY === 185).toBe(true);
                done();
            }, 300);
        });
    });

    describe('Expand Icon in svg mode', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let data: object[] = [
            {
                'Id': 'parent1', 'Name': 'Maria ', 'Designation': 'Managing Director',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
            },
            {
                'Id': 'parent', 'Name': ' sam', 'Designation': 'Managing Director', 'ReportingPerson': 'parent1',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
            },
            {
                'Id': 'parent3', 'Name': ' sam geo', 'Designation': 'Managing Director', 'ReportingPerson': 'parent1',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
            },
            {
                'Id': '80', 'Name': ' david', 'Designation': 'Managing Director', 'ReportingPerson': 'parent3',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
            },
            {
                'Id': '81', 'Name': ' andres', 'Designation': 'Managing Director', 'ReportingPerson': 'parent3',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
            },
            {
                'Id': '82', 'Name': ' pirlo', 'Designation': 'Managing Director', 'ReportingPerson': '81',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
            },
            {
                'Id': '83', 'Name': ' antonio', 'Designation': 'Managing Director', 'ReportingPerson': '81',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
            },
            {
                'Id': '84', 'Name': ' antonio', 'Designation': 'Managing Director', 'ReportingPerson': '84',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
            },
            {
                'Id': 1, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
                'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
                'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
            },
            {
                'Id': 1111, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
                'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
                'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
            },
            {
                'Id': 2, 'Name': 'Anto damien', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': '1111'
            },
            {
                'Id': 39, 'Name': 'sathik', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': '2'
            },
            {
                'Id': 69, 'Name': 'Anto savilla', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': '39    '
            },
        ];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_expandicon' });
            document.body.appendChild(ele);
            let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
            diagram = new Diagram({
                width: '1000px', height: '1000px',
                layout: {
                    enableAnimation: true,
                    orientation: 'RightToLeft',
                    type: 'OrganizationalChart', margin: { top: 20 },
                },
                dataSourceSettings: {
                    id: 'Id', parentId: 'ReportingPerson', dataSource: items
                },
                getNodeDefaults: (node: Node, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.expandIcon = {
                        height: 15, width: 15,
                        shape: "Plus",
                        fill: 'lightgray',
                    };
                    obj.collapseIcon = {
                        height: 15, width: 15, shape: "Minus",
                        fill: 'lightgray',
                    };
                    obj.height = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                },
                getConnectorDefaults: function (connector: Connector, diagram: Diagram) {
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram_expandicon');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking expand and collapse icon', (done: Function) => {
            expect(diagram.nodes[0].wrapper.children[1].offsetX == 355 && diagram.nodes[0].wrapper.children[1].offsetY == 477.5).toBe(true);
            diagram.layout.orientation = 'BottomToTop'
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[1].offsetX == 477.5 && diagram.nodes[0].wrapper.children[1].offsetY == 325).toBe(true);
            diagram.layout.orientation = 'TopToBottom'
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[1].offsetX == 477.5 && diagram.nodes[0].wrapper.children[1].offsetY == 70).toBe(true);
            diagram.layout.orientation = 'LeftToRight';
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[1].offsetX == 100 && diagram.nodes[0].wrapper.children[1].offsetY == 477.5).toBe(true);
            done();
        });
        it('Checking expand and collapse enable disable ', (done: Function) => {
            expect(document.getElementById(diagram.nodes[0].id + '_icon_content') !== null).toBe(true);
            diagram.nodes[0].expandIcon.shape = 'None';
            diagram.nodes[0].collapseIcon.shape = 'None';
            diagram.dataBind();
            expect(document.getElementById(diagram.nodes[0].id + '_icon_content') === null).toBe(true);
            diagram.nodes[0].expandIcon.shape = 'Plus';
            diagram.nodes[0].collapseIcon.shape = 'Minus';
            diagram.dataBind();
            expect(document.getElementById(diagram.nodes[0].id + '_icon_content') !== null).toBe(true);
            done();
        });
        it('Checking aria Label for the expand Collapse ', (done: Function) => {
            let rect: HTMLElement = (document.getElementById(diagram.nodes[0].id + '_icon_content_rect'));
            // BLAZ-24062: Should to include the role attribute while adding the aria-label attribute.
            expect((rect.getAttribute('role') === 'img'));
            expect((rect.getAttribute('aria-label') === 'Click here to expand or collapse'));
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

});

describe('Icon Apperance - EJ2-70586',()=>{
    //test the path colour and path width applies for expand & Collapse icon
    describe('Expand and Collapse Icon Appearance', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let data: object[] = [
            { id: 1, Label: 'StackPanel' },
            { id: 2, Label: 'Label', parentId: 1 },
            { id: 3, Label: 'ListBox', parentId: 1 },
            { id: 4, Label: 'StackPanel', parentId: 1 },
        ];
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_expandicon' });
            document.body.appendChild(ele);
            let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
            diagram = new Diagram({
                width: '1000px', height: '1000px',
                layout: {
                    enableAnimation: true,
                    orientation: 'RightToLeft',
                    type: 'OrganizationalChart', margin: { top: 20 },
                },
                dataSourceSettings: { id: 'id', parentId: 'parentId', dataSource: items },
                getNodeDefaults: (node: Node, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.expandIcon = {
                        height: 15, width: 15,
                        shape: "Minus",
                        fill: 'lightgray',
                    };
                    obj.collapseIcon = {
                        height: 15, width: 15, shape: "Plus",
                        fill: 'lightgray',
                    };
                    obj.height = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                },
                getConnectorDefaults: function (connector: Connector, diagram: Diagram) {
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram_expandicon');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Checking expand icon', (done: Function) => {
            var icon_content_shape = document.getElementById(diagram.nodes[0].id + "_icon_content_shape");
            expect(icon_content_shape.getAttribute('stroke')).toBe('#1a1a1a');
            diagram.nodes[0].expandIcon.iconColor = 'red';
            diagram.dataBind();
            var icon_content_shape2 = document.getElementById(diagram.nodes[0].id + "_icon_content_shape");
            expect(diagram.nodes[0].expandIcon.iconColor).toBe('red');
            expect(icon_content_shape2.getAttribute('stroke')).toBe('red');
            done();
        });
        it('Checking collapse icon', (done: Function) => {
            diagram.nodes[0].isExpanded = false;
            diagram.dataBind();
            var icon_content_shape = document.getElementById(diagram.nodes[0].id + "_icon_content_shape");
            expect(icon_content_shape.getAttribute('stroke')).toBe('#1a1a1a');
        
            diagram.nodes[0].collapseIcon.iconColor = 'yellow';
            
            diagram.dataBind();
            var icon_content_shape2 = document.getElementById(diagram.nodes[0].id + "_icon_content_shape");
            expect(diagram.nodes[0].collapseIcon.iconColor).toBe('yellow');
            
            expect(icon_content_shape2.getAttribute('stroke')).toBe('yellow');
        
            done();
        });
        it('Checking collapse icon content corner radius', (done: Function) => {
            var icon_content = document.getElementById(diagram.nodes[0].id + "_icon_content");
            expect(icon_content.getAttribute('rx')).toBe('0');
            expect(icon_content.getAttribute('ry')).toBe('0');
            expect(diagram.nodes[0].collapseIcon.cornerRadius).toBe(0);
            diagram.nodes[0].collapseIcon.cornerRadius = 10;
            diagram.dataBind();
            var icon_content2 = document.getElementById(diagram.nodes[0].id + "_icon_content");
            expect(icon_content2.getAttribute('rx')).toBe('10');
            expect(icon_content2.getAttribute('ry')).toBe('10');
            expect(diagram.nodes[0].collapseIcon.cornerRadius).toBe(10);
            done();
        });
    });

    //Add new node at runtime and check whether path colour and path width get applied properly.
    describe('Expand and Collapse Icon for run time node check', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_expandicon' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                { id: 'sample1', annotations: [{ content: 'node1' }] },
                { id: 'sample2', annotations: [{ content: 'node2' }] }
            ]
            let connector: ConnectorModel[] = [{ id: 'c1', targetID: 'sample1', sourceID: "sample2" }]
            let runtimeNode: NodeModel = { id: 'r_node', annotations: [{ content: 'r_node' }] };
            diagram = new Diagram({
                width: '1000px', height: '1000px',
                layout: {
                    enableAnimation: true,
                    orientation: 'RightToLeft',
                    type: 'OrganizationalChart', margin: { top: 20 },
                },
                nodes: nodes, connectors: connector,
                getNodeDefaults: (node: Node, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.expandIcon = {
                        height: 15, width: 15,
                        shape: "Minus",
                        fill: 'lightgray',
                    };
                    obj.collapseIcon = {
                        height: 15, width: 15, shape: "Plus",
                        fill: 'lightgray',
                    };
                    obj.height = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                },
                getConnectorDefaults: function (connector: Connector, diagram: Diagram) {
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram_expandicon');
            diagram.add(runtimeNode);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Checking expand icon', (done: Function) => {
            debugger
            diagram.nodes[2].isExpanded;
            var icon_content_shape = document.getElementById(diagram.nodes[2].id + "_icon_content_shape");
            expect(icon_content_shape.getAttribute('stroke')).toBe('#1a1a1a');
        
            diagram.nodes[2].expandIcon.iconColor = 'red';
        
            diagram.dataBind();
            var icon_content_shape2 = document.getElementById(diagram.nodes[2].id + "_icon_content_shape");
            expect(diagram.nodes[2].expandIcon.iconColor).toBe('red');
        
            expect(icon_content_shape2.getAttribute('stroke')).toBe('red');
            
            done();
        });
        it('Checking collapse icon', (done: Function) => {
            debugger
            diagram.nodes[2].isExpanded = false;
            diagram.dataBind();
            var icon_content_shape = document.getElementById(diagram.nodes[2].id + "_icon_content_shape");
            expect(icon_content_shape.getAttribute('stroke')).toBe('#1a1a1a');
        
            diagram.nodes[2].collapseIcon.iconColor = 'blue';
        
            diagram.dataBind();
            var icon_content_shape2 = document.getElementById(diagram.nodes[2].id + "_icon_content_shape");
            expect(diagram.nodes[2].collapseIcon.iconColor).toBe('blue');
        
            expect(icon_content_shape2.getAttribute('stroke')).toBe('blue');
        
            done();
        });
        it('Checking collapse icon content corner radius', (done: Function) => {
            debugger
            var icon_content = document.getElementById(diagram.nodes[2].id + "_icon_content");
            expect(icon_content.getAttribute('rx')).toBe('0');
            expect(icon_content.getAttribute('ry')).toBe('0');
            expect(diagram.nodes[2].collapseIcon.cornerRadius).toBe(0);
            diagram.nodes[2].collapseIcon.cornerRadius = 10;
            diagram.dataBind();
            var icon_content2 = document.getElementById(diagram.nodes[2].id + "_icon_content");
            expect(icon_content2.getAttribute('rx')).toBe('10');
            expect(icon_content2.getAttribute('ry')).toBe('10');
            expect(diagram.nodes[2].collapseIcon.cornerRadius).toBe(10);
            done();
        });
    });

    //After save and load the diagram, check whether path colour and path width applied properly
    describe('Expand and Collapse Icon save & load data', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_expandicon' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                { id: 'sample1', annotations: [{ content: 'node1' }] },
                { id: 'sample2', annotations: [{ content: 'node2' }] }
            ]
            let connector: ConnectorModel[] = [{ id: 'c1', targetID: 'sample1', sourceID: "sample2" }]
            let runtimeNode: NodeModel = { id: 'r_node', annotations: [{ content: 'r_node' }] };
            diagram = new Diagram({
                width: '1000px', height: '1000px',
                layout: {
                    enableAnimation: true,
                    orientation: 'RightToLeft',
                    type: 'OrganizationalChart', margin: { top: 20 },
                },
                nodes: nodes, connectors: connector,
                getNodeDefaults: (node: Node, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.expandIcon = {
                        height: 15, width: 15,
                        shape: "Minus",
                        fill: 'lightgray',
                    };
                    obj.collapseIcon = {
                        height: 15, width: 15, shape: "Plus",
                        fill: 'lightgray',
                    };
                    obj.height = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                },
                getConnectorDefaults: function (connector: Connector, diagram: Diagram) {
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram_expandicon');
            // diagram.add(runtimeNode);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking before, after, customProperties', (done: Function) => {
            debugger
            var icon_content_shape = document.getElementById(diagram.nodes[1].id + "_icon_content_shape");
            expect(icon_content_shape.getAttribute('stroke')).toBe('#1a1a1a');
        
            diagram.nodes[1].expandIcon.iconColor = 'red';
            
            diagram.dataBind();
            let savedata: string = diagram.saveDiagram();
            diagram.clear();
            diagram.loadDiagram(savedata);
            expect(savedata != null).toBe(true);
            var icon_content_shape2 = document.getElementById(diagram.nodes[1].id + "_icon_content_shape");
            expect(icon_content_shape2.getAttribute('stroke')).toBe('red');
        
            diagram.clear();
            done();
        });

    });

    //Test whether border colour and border width apply only for icon border colour and border width.
    describe('Expand and Collapse Icon check only applies to icon', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_expandicon' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                { id: 'sample1', annotations: [{ content: 'node1' }] },
                { id: 'sample2', annotations: [{ content: 'node2' }] }
            ]
            let connector: ConnectorModel[] = [{ id: 'c1', targetID: 'sample1', sourceID: "sample2" }]
            let runtimeNode: NodeModel = { id: 'r_node', annotations: [{ content: 'r_node' }] };
            diagram = new Diagram({
                width: '1000px', height: '1000px',
                layout: {
                    enableAnimation: true,
                    orientation: 'RightToLeft',
                    type: 'OrganizationalChart', margin: { top: 20 },
                },
                nodes: nodes, connectors: connector,
                getNodeDefaults: (node: Node, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.expandIcon = {
                        height: 15, width: 15,
                        shape: "Minus",
                        fill: 'lightgray',
                    };
                    obj.collapseIcon = {
                        height: 15, width: 15, shape: "Plus",
                        fill: 'lightgray',
                    };
                    obj.height = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                },
                getConnectorDefaults: function (connector: Connector, diagram: Diagram) {
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram_expandicon');
            // diagram.add(runtimeNode);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking only applies to icon', (done: Function) => {
            debugger
            var icon_shape = document.getElementById(diagram.nodes[1].id + "_icon_content_shape");
            expect(icon_shape.getAttribute('stroke')).toBe('#1a1a1a');
            
            diagram.nodes[1].expandIcon.iconColor = 'red';
        
            diagram.dataBind();

            var rect = document.getElementById(diagram.nodes[1].id + "_icon_content_rect");
            expect(rect.getAttribute('stroke')).toBe('#1a1a1a');
        
            diagram.nodes[1].expandIcon.borderColor = 'cyan';
        
            diagram.dataBind();


            var icon_shape2 = document.getElementById(diagram.nodes[1].id + "_icon_content_shape");
            var rect2 = document.getElementById(diagram.nodes[1].id + "_icon_content_rect");
            expect(icon_shape2.getAttribute('stroke') == rect2.getAttribute('stroke')).toBe(false);
            

            done();
        });

    });

    //After export the diagram, the path colour and path width also export along with nodes. 
    describe('Export data with Nodes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_expandicon' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                { id: 'sample1', annotations: [{ content: 'node1' }] },
                { id: 'sample2', annotations: [{ content: 'node2' }] }
            ]
            let connector: ConnectorModel[] = [{ id: 'c1', targetID: 'sample1', sourceID: "sample2" }]
            let runtimeNode: NodeModel = { id: 'r_node', annotations: [{ content: 'r_node' }] };
            diagram = new Diagram({
                width: '1000px', height: '1000px',
                layout: {
                    enableAnimation: true,
                    orientation: 'RightToLeft',
                    type: 'OrganizationalChart', margin: { top: 20 },
                },
                nodes: nodes, connectors: connector,
                getNodeDefaults: (node: Node, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.expandIcon = {
                        height: 15, width: 15,
                        shape: "Minus",
                        fill: 'lightgray',
                    };
                    obj.collapseIcon = {
                        height: 15, width: 15, shape: "Plus",
                        fill: 'lightgray',
                    };
                    obj.height = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                },
                getConnectorDefaults: function (connector: Connector, diagram: Diagram) {
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram_expandicon');
            // diagram.add(runtimeNode);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('export data along with nodes', (done: Function) => {
            debugger
            var icon_shape = document.getElementById(diagram.nodes[1].id + "_icon_content_shape");
            expect(icon_shape.getAttribute('stroke')).toBe('#1a1a1a');
            
            diagram.nodes[1].expandIcon.iconColor = 'red';
            
            diagram.dataBind();
            download(diagram.saveDiagram());
            //save the diagram object in json data.
            function download(data: string): void {
                if (window.navigator.msSaveBlob) {
                    let blob: any = new Blob([data], { type: 'data:text/json;charset=utf-8,' });
                    window.navigator.msSaveOrOpenBlob(blob, 'Diagram_icon.json');
                } else {
                    let dataStr: string = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
                    let a: HTMLAnchorElement = document.createElement('a');
                    a.href = dataStr;
                    a.download = 'Diagram_icon.json';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            }
            diagram.clear();
            done();
        });

    });
});