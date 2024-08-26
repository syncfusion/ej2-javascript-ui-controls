/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import {
    ConnectorModel, Node, TextModel, Connector, IExpandStateChangeEventArgs, LineRouting,
    DataBinding, HierarchicalTree, NodeModel, Rect, TextElement, LayoutAnimation, Container, StackPanel, ImageElement, TreeInfo, SnapConstraints, DiagramConstraints, OrthogonalSegmentModel
} from '../../../src/diagram/index';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(DataBinding, HierarchicalTree);
Diagram.Inject(LayoutAnimation, LineRouting);
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { Animation, ISelectionChangeEventArgs } from '../../../src/diagram/objects/interface/IElement'

import { DataManager, Query } from '@syncfusion/ej2-data';
import { Selector } from '../../../src/diagram/objects/node';
/**
 * Organizational Chart
 */

let assitants: object[] = [
    { 'Id': 'parent', 'Role': 'Board', 'color': '#71AF17' },
    { 'Id': '1', 'Role': 'General Manager', 'Manager': 'parent', 'ChartType': 'Right', 'color': '#71AF17' },
    { 'Id': '11', 'Role': 'Assistant Manager', 'Manager': '1', 'color': '#71AF17' },
    { 'Id': '2', 'Role': 'Human Resource Manager', 'Manager': '1', 'ChartType': 'Right', 'color': '#1859B7' },
    { 'Id': '3', 'Role': 'Trainers', 'Manager': '2', 'color': '#2E95D8' },
    { 'Id': '4', 'Role': 'Recruiting Team', 'Manager': '2', 'color': '#2E95D8' },
    { 'Id': '5', 'Role': 'Finance Asst. Manager', 'Manager': '2', 'color': '#2E95D8' },
    { 'Id': '6', 'Role': 'Design Manager', 'Manager': '1', 'ChartType': 'Right', 'color': '#1859B7' },
    { 'Id': '7', 'Role': 'Design Supervisor', 'Manager': '6', 'color': '#2E95D8' },
    { 'Id': '8', 'Role': 'Development Supervisor', 'Manager': '6', 'color': '#2E95D8' },
    { 'Id': '9', 'Role': 'Drafting Supervisor', 'Manager': '6', 'color': '#2E95D8' },
    { 'Id': '10', 'Role': 'Operation Manager', 'Manager': '1', 'ChartType': 'Right', 'color': '#1859B7' },
    { 'Id': '11', 'Role': 'Statistic Department', 'Manager': '10', 'color': '#2E95D8' },
    { 'Id': '12', 'Role': 'Logistic Department', 'Manager': '10', 'color': '#2E95D8' },
    { 'Id': '16', 'Role': 'Marketing Manager', 'Manager': '1', 'ChartType': 'Right', 'color': '#1859B7' },
    { 'Id': '17', 'Role': 'Oversea sales Manager', 'Manager': '16', 'color': '#2E95D8' },
    { 'Id': '18', 'Role': 'Petroleum Manager', 'Manager': '16', 'color': '#2E95D8' },
    { 'Id': '20', 'Role': 'Service Dept. Manager', 'Manager': '16', 'color': '#2E95D8' },
    { 'Id': '21', 'Role': 'Quality Department', 'Manager': '16', 'color': '#2E95D8' }
];

let assitants1: object[] = [
    { 'Id': 'parent', 'Role': 'Board', 'color': '#71AF17' },
    { 'Id': '1', 'Role': 'General Manager', 'Manager': 'parent', 'ChartType': 'Right', 'color': '#71AF17' },
    { 'Id': '11', 'Role': 'Assistant Manager', 'Manager': '1', 'color': '#71AF17' },
    { 'Id': '2', 'Role': 'Human Resource Manager', 'Manager': '1', 'ChartType': 'Right', 'color': '#1859B7' },
    { 'Id': '3', 'Role': 'Trainers', 'Manager': '2', 'color': '#2E95D8' },
];
let data: object[] = [
    { id: 1, Label: 'StackPanel' },
    { id: 2, Label: 'Label', parentId: 1 },
    { id: 3, Label: 'ListBox', parentId: 1 },
    { id: 4, Label: 'StackPanel', parentId: 1 },
    { id: 5, Label: 'Border', parentId: 2 },
    { id: 6, Label: 'Border', parentId: 3 },
    { id: 7, Label: 'Button', parentId: 4 },
    { id: 8, Label: 'ContentPresenter', parentId: 5 },
    { id: 9, Label: 'Text Block', parentId: 8 },
    { id: 10, Label: 'ScrollViewer', parentId: 6 },
    { id: 11, Label: 'Grid', parentId: 10 },
    { id: 12, Label: 'Rectangle', parentId: 11 },
    { id: 13, Label: 'ScrollContentPresenter', parentId: 11 },
    { id: 14, Label: 'ScrollBar', parentId: 11 },
    { id: 15, Label: 'ScrollBar', parentId: 11 },
    { id: 16, Label: 'ItemsPresenter', parentId: 13 },
    { id: 17, Label: 'AdornerLayer', parentId: 13 },
    { id: 18, Label: 'VirtualizingStackPanel', parentId: 15 },
    { id: 19, Label: 'ListBoxItem', parentId: 18 },
    { id: 20, Label: 'ListBoxItem', parentId: 18 },
    { id: 21, Label: 'Border', parentId: 19 },
    { id: 22, Label: 'ContentPresenter', parentId: 19 },
    { id: 23, Label: 'TextBlock', parentId: 19 },
    { id: 24, Label: 'Border', parentId: 20 },
    { id: 25, Label: 'ContentPresenter', parentId: 20 },
    { id: 26, Label: 'TextBlock', parentId: 20 },
    { id: 27, Label: 'ButtonChrome', parentId: 7 },
    { id: 28, Label: 'ContentPresenter', parentId: 27 },
    { id: 29, Label: 'TextBlock', parentId: 28 }
];

let multipleRoot: object[] = [
    { 'Name': 'Tree Layout' },
    { 'Name': 'Organizational Chart' },
    { 'Name': 'Hierarchical Tree', 'Category': 'Tree Layout' },
    { 'Name': 'Radial Tree', 'Category': 'Tree Layout' },
    { 'Name': 'Mind Map', 'Category': 'Hierarchical Tree' },
    { 'Name': 'Family Tree', 'Category': 'Hierarchical Tree' },
    { 'Name': 'Management', 'Category': 'Organizational Chart' },
    { 'Name': 'Human Resource', 'Category': 'Management' },
    { 'Name': 'University', 'Category': 'Management' },
    { 'Name': 'Business', 'Category': 'Management' }
];


let balancedTree: object[] = [
    { 'Name': 'a' },
    { 'Name': 'b', 'Category': 'a' },
    { 'Name': 'c', 'Category': 'a' },
    { 'Name': 'd', 'Category': 'a' },
    { 'Name': 'e', 'Category': 'a' },
    { 'Name': 'b1', 'Category': 'b' },
    { 'Name': 'b2', 'Category': 'b' },
    { 'Name': 'b3', 'Category': 'b' },
    { 'Name': 'c1', 'Category': 'c' },
    { 'Name': 'c2', 'Category': 'c' },
    { 'Name': 'c3', 'Category': 'c' },
    { 'Name': 'c4', 'Category': 'c' },
    { 'Name': 'c5', 'Category': 'c' },
    { 'Name': 'd1', 'Category': 'd' },
    { 'Name': 'd2', 'Category': 'd' },
    { 'Name': 'd3', 'Category': 'd' },
    { 'Name': 'd4', 'Category': 'd' },
    { 'Name': 'd5', 'Category': 'd' },
    { 'Name': 'd6', 'Category': 'd' },
    { 'Name': 'e1', 'Category': 'e' },
    { 'Name': 'e2', 'Category': 'e' },
    { 'Name': 'e3', 'Category': 'e' },
    { 'Name': 'e4', 'Category': 'e' }
];

let singleChild: object[] = [
    { 'Name': 'a' },
    { 'Name': 'b', 'Category': 'a' },
    { 'Name': 'c', 'Category': 'b' },
    { 'Name': 'd', 'Category': 'c' }];

let completeVerticalTree: object[] = [
    { 'Name': 'a' },
    { 'Name': 'b', 'Category': 'a' },
    { 'Name': 'c', 'Category': 'a' },
    { 'Name': 'd', 'Category': 'b' },
    { 'Name': 'e', 'Category': 'b' },
    { 'Name': 'f', 'Category': 'c' },
    { 'Name': 'g', 'Category': 'c' },
];

let expandRoutingData: object[] =    [
    { 'Id': 'parent', 'Role': 'Board', 'color': '#71AF17' },
    { 'Id': '1', 'Role': 'General Manager', 'Manager': 'parent', 'ChartType': 'right', 'color': '#71AF17' },
    { 'Id': '11', 'Role': 'Assistant Manager', 'Manager': '1', 'color': '#71AF17' },
    { 'Id': '2', 'Role': 'Human Resource Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
    { 'Id': '3', 'Role': 'Trainers', 'Manager': '2', 'color': '#2E95D8' },
    { 'Id': '4', 'Role': 'Recruiting Team', 'Manager': '2', 'color': '#2E95D8' },
    { 'Id': '5', 'Role': 'Finance Asst. Manager', 'Manager': '2', 'color': '#2E95D8' },
    { 'Id': '6', 'Role': 'Design Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
    { 'Id': '7', 'Role': 'Design Supervisor', 'Manager': '6', 'color': '#2E95D8' },
    { 'Id': '8', 'Role': 'Development Supervisor', 'Manager': '6', 'color': '#2E95D8' },
    { 'Id': '9', 'Role': 'Drafting Supervisor', 'Manager': '6', 'color': '#2E95D8' },
]

export interface EmployeeInfo {
    Id: string;
    ManagerId: string;
    Name:string;
  }
let layoutData: object[] = [
    {
      "Id": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "ManagerId": "",
      "Name": "Tim Johnson"
    },
    {
      "Id": "0cc3c86b-200b-43ea-8122-b3107557f61e",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Yan Nem"
    },
    {
      "Id": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "ManagerId": "1a3c1a45-9b53-4bd1-8ad6-7b64ec2d3258",
      "Name": "Jessica Small"
    },
    {
      "Id": "5d57fa17-7df2-4722-91c6-bcd2a0778f2e",
      "ManagerId": "0cc3c86b-200b-43ea-8122-b3107557f61e",
      "Name": "Thomas Ngyuen"
    },
    {
      "Id": "f493da2b-ec35-45b1-97aa-a5ba757798e0",
      "ManagerId": "378755ac-222b-4f93-a8d3-8546c83e8f2e",
      "Name": "Christine Qin"
    },
    {
      "Id": "57125eda-a326-46e3-bc5f-5af1be058e50",
      "ManagerId": "5c826fa5-c2f4-4714-813d-cf072f98eb40",
      "Name": "Rosita Ramos"
    },
    {
      "Id": "5db5db14-d74f-4685-aa38-dc026f8b87ee",
      "ManagerId": "5d57fa17-7df2-4722-91c6-bcd2a0778f2e",
      "Name": "Ursala Burnet"
    },
    {
      "Id": "bc3a25b5-86c1-4864-b1c8-70a92e2fe92c",
      "ManagerId": "5d57fa17-7df2-4722-91c6-bcd2a0778f2e",
      "Name": "Hayley Santos"
    },
    {
      "Id": "59f91bfe-c7c1-4be4-aa14-d4b06a8105db",
      "ManagerId": "0d95088a-3f47-4c1c-9ac0-b5d5dfd59455",
      "Name": "Joan Isbell"
    },
    {
      "Id": "26eaca86-c907-448c-a44a-a1de967417e5",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Marcus Hawes"
    },
    {
      "Id": "28fb81b8-0c6a-479b-9bf9-a0f6b462837b",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Wei Sun"
    },
    {
      "Id": "736f416b-32d7-44a7-b99f-519db6581b2c",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Shauna Mosley"
    },
    {
      "Id": "84b9e4e9-aac3-4374-8be5-50fee1d5bb8f",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Skylar Cotton"
    },
    {
      "Id": "8eae136d-ac13-4c64-b742-babf8f725888",
      "ManagerId": "1328b010-1ad9-4b15-8dab-50623b1e01e6",
      "Name": "Aicha Stiffel"
    },
    {
      "Id": "a130fd55-8ffc-4987-a497-2dc03f0589aa",
      "ManagerId": "8eae136d-ac13-4c64-b742-babf8f725888",
      "Name": "Ibrahim Bukhari"
    },
    {
      "Id": "c9b6fe99-dbe6-40b3-be7a-f4335897dc08",
      "ManagerId": "8eae136d-ac13-4c64-b742-babf8f725888",
      "Name": "Anthony Peeples"
    },
    {
      "Id": "f997dd1e-5a0a-4591-bd14-a6a278cd6a08",
      "ManagerId": "8eae136d-ac13-4c64-b742-babf8f725888",
      "Name": "Jeremy Rukowski"
    },
    {
      "Id": "e77bd427-8b76-4724-8bee-5ced085484ae",
      "ManagerId": "a130fd55-8ffc-4987-a497-2dc03f0589aa",
      "Name": "Nicky Castillo"
    },
    {
      "Id": "64d57052-e220-45cc-8625-02ba8b4be252",
      "ManagerId": "e77bd427-8b76-4724-8bee-5ced085484ae",
      "Name": "Susan Cheung"
    },
    {
      "Id": "60807129-0215-4ade-951c-b2f486328425",
      "ManagerId": "64d57052-e220-45cc-8625-02ba8b4be252",
      "Name": "Rosalita Clarkson"
    },
    {
      "Id": "7a656afa-2444-4502-b60e-5fb0c04fb2f4",
      "ManagerId": "64d57052-e220-45cc-8625-02ba8b4be252",
      "Name": "Gloria Delarosa"
    },
    {
      "Id": "32e80929-092b-41e5-9050-adfdd23e7a42",
      "ManagerId": "60807129-0215-4ade-951c-b2f486328425",
      "Name": "Maria Delgado"
    },
    {
      "Id": "66b7348e-c5ea-4195-8df2-29ce63464540",
      "ManagerId": "60807129-0215-4ade-951c-b2f486328425",
      "Name": "Belinda Criswell"
    },
    {
      "Id": "d38eff47-edcd-4e27-96d2-420f669863e6",
      "ManagerId": "c9b6fe99-dbe6-40b3-be7a-f4335897dc08",
      "Name": "Linda Permutter"
    },
    {
      "Id": "0bb404c2-6b75-46b3-bc1c-ebe2b949925a",
      "ManagerId": "d38eff47-edcd-4e27-96d2-420f669863e6",
      "Name": "Arisha Davie"
    },
    {
      "Id": "8e9f0361-4b4f-4487-b4fb-3561770feb37",
      "ManagerId": "d38eff47-edcd-4e27-96d2-420f669863e6",
      "Name": "Rosa Delacroix"
    },
    {
      "Id": "46e8f064-fa6a-4bec-985c-9540ad5025a4",
      "ManagerId": "8e9f0361-4b4f-4487-b4fb-3561770feb37",
      "Name": "Ailsa Coates"
    },
    {
      "Id": "6236e62d-f4c4-440b-9bb8-80f668d46ab4",
      "ManagerId": "8e9f0361-4b4f-4487-b4fb-3561770feb37",
      "Name": "Zakir Shelson"
    },
    {
      "Id": "cff4ed13-eeda-49c8-a9c3-f8f924a16ab4",
      "ManagerId": "8e9f0361-4b4f-4487-b4fb-3561770feb37",
      "Name": "Rohit Grimes"
    },
    {
      "Id": "6c81be8f-47cb-497d-a542-7b8533527916",
      "ManagerId": "f997dd1e-5a0a-4591-bd14-a6a278cd6a08",
      "Name": "Hector Sanchez"
    },
    {
      "Id": "e3517e53-28f2-4b9e-94e7-712944dca222",
      "ManagerId": "6c81be8f-47cb-497d-a542-7b8533527916",
      "Name": "Lisa Sicarelli"
    },
    {
      "Id": "0509e334-840f-40d7-9796-8e0c33c7c889",
      "ManagerId": "e3517e53-28f2-4b9e-94e7-712944dca222",
      "Name": "Crystal Dodd"
    },
    {
      "Id": "0c0f8f79-1455-47bb-8c67-4768c9c008c1",
      "ManagerId": "e3517e53-28f2-4b9e-94e7-712944dca222",
      "Name": "Dolcie Ware"
    },
    {
      "Id": "583dd23e-c722-45b8-a8ed-57e422177832",
      "ManagerId": "e3517e53-28f2-4b9e-94e7-712944dca222",
      "Name": "Saffa Alfaro"
    },
    {
      "Id": "8a7f43f3-b645-48ce-b0f7-a815aeed185e",
      "ManagerId": "e3517e53-28f2-4b9e-94e7-712944dca222",
      "Name": "Zaki McKnight"
    },
    {
      "Id": "f4ea67e7-3391-41ed-b7de-744868b883aa",
      "ManagerId": "a3c38803-fb28-4bb1-a8ce-706e5e3f14c8",
      "Name": "Nhan Tran"
    },
  ];

function resize(diagram: Diagram, direction: string): void {
    if ((diagram.selectedItems as Selector).nodes[0]) {
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        let element: HTMLElement = document.getElementById(direction);
        let mouseEvents: MouseEvents = new MouseEvents();
        let x: number = Number(element.getAttribute('cx'));
        let y: number = Number(element.getAttribute('cy'));
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    }
}

describe('Diagram Control', () => {
    describe('Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let items = new DataManager(data, new Query().take(7));
            diagram = new Diagram({
                width: '1200px', height: '580px',
                snapSettings: { constraints: 0 },
                layout: {
                    type: 'OrganizationalChart',
                },
                dataSourceSettings: {
                    id: 'id', parentId: 'parentId', dataSource: items
                },
                getNodeDefaults: (node: NodeModel, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.width = 150;
                    obj.height = 50;
                    obj.style = { fill: node.data['color'] };
                    obj.annotations = [{ content: node.data['Role'], style: { color: 'white' } }];
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.targetDecorator = { shape: 'None' };
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking organizational chart', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 65 && bounds.y == 50 && bounds.width == 1070 && bounds.height == 740).toBe(true);
            expect(diagram.nodes[0].offsetX == 525 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking hierarchical tree layout', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 30 && bounds.y == 50 && bounds.width == 1140 && (bounds.height == 690 || bounds.height === 715)).toBe(true);
            expect(diagram.nodes[0].offsetX == 510 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical left tree orientation', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Left';
                    options.orientation = 'Vertical';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 118 && bounds.y == 50 && bounds.width == 1055 && bounds.height == 805).toBe(true);
            expect(diagram.nodes[0].offsetX == 712.5 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical left tree with less offset', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Left';
                    options.orientation = 'Vertical';
                    options.offset = -20;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 120 && bounds.y == 50 && bounds.width == 1015 && bounds.height == 805).toBe(true);
            expect(diagram.nodes[0].offsetX == 695 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical left tree with 0 offset', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Left';
                    options.orientation = 'Vertical';
                    options.offset = 0;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 118 && bounds.y == 50 && bounds.width == 1055 && bounds.height == 805).toBe(true);
            expect(diagram.nodes[0].offsetX == 712.5 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical left tree with greater offset', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Alternate';
                    options.orientation = 'Vertical';
                    options.offset = 60;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 75 && bounds.y == 50 && bounds.width == 1050 && bounds.height == 740).toBe(true);
            expect(diagram.nodes[0].offsetX == 532.5 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical right tree orientation', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Right';
                    options.orientation = 'Vertical';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 70 && bounds.y == 50 && bounds.width == 1060 && bounds.height == 805).toBe(true);
            expect(diagram.nodes[0].offsetX == 593.75 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical right tree with less offset', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Right';
                    options.orientation = 'Vertical';
                    options.offset = -20;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 93 && bounds.y == 50 && bounds.width == 1015 && bounds.height == 805).toBe(true);
            expect(diagram.nodes[0].offsetX == 626.25 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical alternate tree orientation', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Alternate';
                    options.orientation = 'Vertical';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 65 && bounds.y == 50 && bounds.width == 1070 && bounds.height == 740).toBe(true);
            expect(diagram.nodes[0].offsetX == 525 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical alternate tree with less offset', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Alternate';
                    options.orientation = 'Vertical';
                    options.offset = 4;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 97 && bounds.y == 50 && bounds.width == 1006 && bounds.height == 740).toBe(true);
            expect(diagram.nodes[0].offsetX == 549 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking balanced tree with left orientation', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Balanced';
                    options.orientation = 'Horizontal';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 120 && bounds.y == 50 && bounds.width == 960 && bounds.height == 770).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking horizontal left tree orientation', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Left';
                    options.orientation = 'Horizontal';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 30 && bounds.y == 50 && bounds.width == 1140 && bounds.height == 690).toBe(true);
            expect(diagram.nodes[0].offsetX == 510 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking horizontal right tree orientation', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Right';
                    options.orientation = 'Horizontal';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 30 && bounds.y == 50 && bounds.width == 1140 && bounds.height == 690).toBe(true);
            expect(diagram.nodes[0].offsetX == 510 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking hierarchical tree - left to right orientation', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 5 && bounds.width == 1590 && bounds.height == 570).toBe(true);
            expect(diagram.nodes[0].offsetX == 125 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });
        it('Checking right to left orientation', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 5 && bounds.width == 1590 && bounds.height == 570).toBe(true);
            expect(diagram.nodes[0].offsetX == 1565 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });
        it('Checking tree - bottom to top orientation', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -60 && bounds.y == 50 && bounds.width == 1320 && bounds.height == 690).toBe(true);
            expect(diagram.nodes[0].offsetX == 420 && diagram.nodes[0].offsetY == 715).toBe(true);
            done();
        });
        it('Checking tree - with variable size', (done: Function) => {
            let i = 0;
            let reset = diagram.getNodeDefaults;
            for (let _i = 0, _a = diagram.nodes; _i < _a.length; _i++) {
                let node = _a[_i];
                if (i % 2 === 0) {
                    node.width = 200;
                }
                if (i % 3 === 0) {
                    node.height = 200;
                }
                i++;
            }
            diagram.layout.orientation = 'TopToBottom';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -122 && bounds.y == 50 && bounds.width == 1445 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 407.5 && diagram.nodes[0].offsetY == 150).toBe(true);
            diagram.getNodeDefaults = reset;
            done();
        });
        it('Checking tree - with variable size  - Org chart', (done: Function) => {
            let i = 0;
            let reset = diagram.getNodeDefaults;
            for (let _i = 0, _a = diagram.nodes; _i < _a.length; _i++) {
                let node = _a[_i];
                if (i % 2 === 0) {
                    node.width = 200;
                }
                if (i % 3 === 0) {
                    node.height = 200;
                }
                i++;
            }
            diagram.layout.type = 'HierarchicalTree';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -77 && bounds.y == 50 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 532.5 && diagram.nodes[0].offsetY == 150).toBe(true);
            diagram.getNodeDefaults = reset;
            done();
        });
        it('Checking fixed node at first level', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.fixedNode = diagram.nodes[0].id;
            diagram.nodes[0].offsetX = 500;
            diagram.nodes[0].offsetY = 50;

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -110 && bounds.y == -50 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 500 && diagram.nodes[0].offsetY == 50).toBe(true);
            done();
        });
        it('Checking fixed node', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.fixedNode = diagram.nodes[2].id;
            diagram.nodes[2].offsetX = 500;
            diagram.nodes[2].offsetY = 50;

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 290 && bounds.y == -285 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 900 && diagram.nodes[0].offsetY == -185).toBe(true);
            done();
        });
        it('Checking fixed node - left to right orientation', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -10 && bounds.y == -130 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 90 && diagram.nodes[0].offsetY == 360).toBe(true);
            done();
        });
        it('Checking fixed node - right to left orientation', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -880 && bounds.y == -130
                    && bounds.width == 1890 && bounds.height == 1020).toBe(true);
                expect(diagram.nodes[0].offsetX == 910 && diagram.nodes[0].offsetY == 360).toBe(true);
            done();
        });
        it('Checking fixed node - bottom to top orientation', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 290 && bounds.y == -905 && bounds.width == 1355 && (bounds.height == 1290 || bounds.height === 1425)).toBe(true);
                expect(diagram.nodes[0].offsetX == 900 && diagram.nodes[0].offsetY == 285).toBe(true);
            done();
        });
        it('Checking Left Top Alignment', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.fixedNode = '';
            diagram.layout.horizontalAlignment = 'Left';
            diagram.layout.verticalAlignment = 'Top';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 50 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 660 && diagram.nodes[0].offsetY == 150).toBe(true);
            done();
        });
        it('Checking Left Top Alignment - Bottom To Top Orientation', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 50 && bounds.width == 1355 && (bounds.height == 1290 || bounds.height === 1420)).toBe(true);
            expect(diagram.nodes[0].offsetX == 660 && diagram.nodes[0].offsetY == 1240).toBe(true);
            done();
        });
        it('Checking Left Top Alignment - Left To Right Orientation', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 50 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 150 && diagram.nodes[0].offsetY == 540).toBe(true);
            done();
        });
        it('Checking Left Top Alignment - Right To Left Orientation', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 50 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 1840 && diagram.nodes[0].offsetY == 540).toBe(true);
            done();
        });
        it('Checking Right Bottom Alignment', (done: Function) => {
            diagram.layout.horizontalAlignment = 'Right';
            diagram.layout.verticalAlignment = 'Bottom';
            diagram.layout.orientation = 'TopToBottom';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -155 && bounds.y == -710 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 455 && diagram.nodes[0].offsetY == -610).toBe(true);
            done();
        });
        it('Checking Right Bottom Alignment - Bottom to top', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -155 && bounds.y == -710 && bounds.width == 1355 && (bounds.height == 1290 || bounds.height === 1420)).toBe(true);
            expect(diagram.nodes[0].offsetX == 455 && diagram.nodes[0].offsetY == 480).toBe(true);
            done();
        });
        it('Checking Right Bottom Alignment - left to right', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -690 && bounds.y == -440 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == -590 && diagram.nodes[0].offsetY == 50).toBe(true);
            done();
        });
        it('Checking Right Bottom Alignment - right to left', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -690 && bounds.y == -440 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 1100 && diagram.nodes[0].offsetY == 50).toBe(true);
            done();
        });
        it('Checking Center Center Alignment', (done: Function) => {
            diagram.layout.horizontalAlignment = 'Center';
            diagram.layout.verticalAlignment = 'Center';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -345 && bounds.y == -220 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 1445 && diagram.nodes[0].offsetY == 270).toBe(true);
            done();
        });
        it('Checking Center Center Alignment - Bottom To Top Orientation', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -77 && bounds.y == -355 && bounds.width == 1355 && (bounds.height == 1290 || bounds.height === 1425)).toBe(true);
            expect(diagram.nodes[0].offsetX == 532.5 && diagram.nodes[0].offsetY == 835).toBe(true);
            done();
        });
        it('Checking Center Center Alignment - Left To Right Orientation', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -345 && bounds.y == -220 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == -245 && diagram.nodes[0].offsetY == 270).toBe(true);
            done();
        });
        it('Checking Center Center Alignment - Right To Left Orientation', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -345 && bounds.y == -220 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 1445 && diagram.nodes[0].offsetY == 270).toBe(true);
            done();
        });
        it('Checking multiple roots', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataSource = new DataManager({ json: multipleRoot });
            diagram.dataSourceSettings.id = 'Name';
            diagram.dataSourceSettings.parentId = 'Category';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 165 && bounds.y == 185 && bounds.width == 870 && bounds.height == 210).toBe(true);
            expect(diagram.nodes[0].offsetX == 420 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });
        it('Checking multiple roots - bottom to top', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 165 && bounds.y == 185 && bounds.width == 870 && bounds.height == 210).toBe(true);
            expect(diagram.nodes[0].offsetX == 420 && diagram.nodes[0].offsetY == 370).toBe(true);
            done();
        });
        it('Checking multiple roots - left to right', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 345 && bounds.y == 105 && bounds.width == 510 && bounds.height == 370).toBe(true);
            expect(diagram.nodes[0].offsetX == 420 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });
        it('Checking multiple roots - right to left', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 345 && bounds.y == 105 && bounds.width == 510 && bounds.height == 370).toBe(true);
            expect(diagram.nodes[0].offsetX == 780 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });
        it('Checking balanced tree - Multiple Levels', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataSource = new DataManager({ json: balancedTree });
            diagram.dataSourceSettings.id = 'Name';
            diagram.dataSourceSettings.parentId = 'Category';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Balanced';
                    options.orientation = 'Horizontal';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -375 && bounds.y == 145 && bounds.width == 1950 && bounds.height == 290).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 170).toBe(true);
            done();
        });
        it('Checking balanced tree - Bottom to top', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -375 && bounds.y == 145 && bounds.width == 1950 && bounds.height == 290).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 410).toBe(true);
            done();
        });

        it('Checking balanced tree - left to right', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 255 && bounds.y == -135 && bounds.width == 690 && bounds.height == 850).toBe(true);
            expect(diagram.nodes[0].offsetX == 330 && diagram.nodes[0].offsetY == 290).toBe(true);
            done();
        });
        it('Checking balanced tree - right to left', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 255 && bounds.y == -135 && bounds.width == 690 && bounds.height == 850).toBe(true);
            expect(diagram.nodes[0].offsetX == 870 && diagram.nodes[0].offsetY == 290).toBe(true);
            done();
        });
        it('Checking balanced tree - custom rows', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (node.data['Name'] === 'd') {
                    options.rows = 3;
                }
                if (!options.hasSubTree) {
                    options.type = 'Balanced';
                    options.orientation = 'Horizontal';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -195 && bounds.y == 105 && bounds.width == 1590 && bounds.height == 370).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 130).toBe(true);
            done();
        });
        it('Checking exclude from layout', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';
            (diagram.nodes[8] as NodeModel).excludeFromLayout = true;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -105 && bounds.y == 105 && bounds.width == 1410 && bounds.height == 370).toBe(true);
            expect(diagram.nodes[8].offsetX == 600 && diagram.nodes[8].offsetY == 290).toBe(true);
            (diagram.nodes[8] as NodeModel).excludeFromLayout = false;
            done();
        });
        it('Checking Assistants', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataSource = new DataManager({ json: assitants });
            diagram.dataSourceSettings.id = 'Id';
            diagram.dataSourceSettings.parentId = 'Manager';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (node.data['Role'] === 'General Manager') {
                    options.assistants.push(options.children[0]);
                    options.children.splice(0, 1);
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -30 && bounds.y == 80 && bounds.width == 1260 && bounds.height == 420).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 105).toBe(true);
            done();
        });
        it('Checking Assitants - Bottom to top', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -30 && bounds.y == 80 && bounds.width == 1260 && bounds.height == 420).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 475).toBe(true);
            done();
        });
        it('Checking Assitants - left to right', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 90 && bounds.y == 10 && bounds.width == 1020 && bounds.height == 560).toBe(true);
            expect(diagram.nodes[0].offsetX == 165 && diagram.nodes[0].offsetY == 290).toBe(true);
            done();
        });
        it('Checking Assitants - right to left', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 90 && bounds.y == 10 && bounds.width == 1020 && bounds.height == 560).toBe(true);
            expect(diagram.nodes[0].offsetX == 1035 && diagram.nodes[0].offsetY == 290).toBe(true);
            done();
        });
        it('Checking with two Assistants', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataSource = new DataManager({ json: assitants });
            diagram.dataSourceSettings.id = 'Id';
            diagram.dataSourceSettings.parentId = 'Manager';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (node.data['Role'] === 'General Manager') {
                    options.assistants.push(options.children[0]);
                    options.assistants.push(options.children[1]);
                    options.children.splice(0, 2);
                }
                if (node.data['Role'] === 'Human Resource Manager') {
                    options.children = [];
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -75 && bounds.y == -25 && bounds.width == 1120 && bounds.height == 525).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 105).toBe(true);
            done();
        });
        it('Checking Assitants - without children', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (node.data['Role'] === 'General Manager') {
                    options.assistants.push(options.children[0]);
                    options.children.splice(0, 1);
                    options.children = [];
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -75 && bounds.y == -50 && bounds.width == 1120 && bounds.height == 550).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });

        it('Checking single column with vertical tree', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataSource = new DataManager({ json: singleChild });
            diagram.dataSourceSettings.id = 'Name';
            diagram.dataSourceSettings.parentId = 'Category';
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 478 && bounds.y == 153 && bounds.width == 245 && bounds.height == 275).toBe(true);
            expect(diagram.nodes[0].offsetX == 552.5 && diagram.nodes[0].offsetY == 177.5).toBe(true);
            done();
        });

        it('Checking with empty diagram', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager({ json: [] });

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 0 && bounds.y == 0 && bounds.width == 0 && bounds.height == 0).toBe(true);
            done();
        });
        it('Checking complete vertical tree', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataSource = new DataManager({ json: completeVerticalTree });
            diagram.dataSourceSettings.id = 'Name';
            diagram.dataSourceSettings.parentId = 'Category';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                options.type = 'Left';
                options.orientation = 'Vertical';
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 430 && bounds.y == 70 && bounds.width == 340 && bounds.height == 440).toBe(true);
            expect(diagram.nodes[0].offsetX == 695 && diagram.nodes[0].offsetY == 95).toBe(true);
            done();
        });
        it('Checking with layout bounds', (done: Function) => {
            diagram.layout.bounds = new Rect(0, 0, 500, 500);
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 80 && bounds.y == 30 && bounds.width == 340 && bounds.height == 440).toBe(true);
            expect(diagram.nodes[0].offsetX == 345 && diagram.nodes[0].offsetY == 55).toBe(true);
            done();
        });
    });
    describe('Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let items = new DataManager(data, new Query().take(7));
            diagram = new Diagram({
                width: '1200px', height: '580px', mode: 'SVG',
                snapSettings: { constraints: 0 },
                layout: {
                    type: 'HierarchicalTree',
                },
                dataSourceSettings: {
                    id: 'id', parentId: 'parentId', dataSource: items
                },
                getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                    obj.shape = { type: 'Text', content: (obj.data as { Label: 'string' }).Label };
                    obj.style = { fill: 'lightgrey', strokeColor: 'none', strokeWidth: 2 };
                    obj.borderColor = 'black';
                    obj.backgroundColor = 'lightgrey';
                    obj.borderWidth = 1;
                    (obj.shape as TextModel).margin = { left: 5, right: 5, top: 5, bottom: 5 };
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.targetDecorator = { shape: 'None' };
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking organizational chart - save and load', (done: Function) => {
            var savedata2 = diagram.saveDiagram();
            diagram.loadDiagram(savedata2);
            expect(diagram.nodes[0].width == undefined && diagram.nodes[0].height == undefined).toBe(true);
            done();
        });
    });
});
export interface TreeInfo {
    orientation?: string; type?: string; offset?: number; enableRouting?: boolean; children?: string[];
    assistants?: string[]; level?: number; hasSubTree?: boolean; rows?: number;
}

let data1: object[] = [//code added
    {
        'Id': 'parent1', 'Name': 'Maria Anders', 'Designation': 'Managing Director',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': 'parent', 'Name': 'Maria Anders', 'Designation': 'Managing Director', 'ReportingPerson': 'parent1',
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
        'Id': 2, 'Name': 'Anto Moreno', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 'parent'
    },
    {
        'Id': 3, 'Name': 'Thomas Hardy', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },


];
describe('Tree Layout', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimation' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        diagram = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: true,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataSource: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .7, y: .8 } }
                obj.collapseIcon.offset = { x: .7, y: .8 }
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style = {};
                obj.style.fill = obj.data['color'];
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                let obj: any = {};
                obj.targetDecorator = {};
                obj.targetDecorator.shape = 'None';
                obj.type = 'Orthogonal';
                return obj;
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram.appendTo('#diagramanimation');
    });

    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking icons on proper layer', (done: Function) => {
        let svgElement: SVGSVGElement = document.getElementsByClassName('e-ports-expand-layer')[0] as SVGSVGElement;
        let gElement: SVGElement = svgElement.getElementById(diagram.nodes[0].id + '_icon_content_groupElement') as SVGElement;
        expect(gElement != null).toBe(true);
        done();
    });

    it('Checking organizational chart collapse', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 648, 54);
        let nodes: Node = diagram.nodes[1] as Node
        diagram.animationComplete = () => {
            expect(nodes.visible === false).toBe(true);
            done();
        };
    });

    it('Checking organizational chart expand', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 648, 54);
        let nodes: Node = diagram.nodes[1] as Node
        diagram.animationComplete = () => {
            expect(nodes.visible === true).toBe(true);
            done();

        };
    });

    it('Checking organizational chart expand along with layout', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 648, 127);
        let nodes: Node = diagram.nodes[0] as Node
        diagram.animationComplete = () => {
            console.log('nodes.offsetX' + nodes.offsetX);
            console.log('nodes.offsetY' + nodes.offsetY);
            expect(Math.round(nodes.offsetX) === 545 && (Math.round(nodes.offsetY) === 57 || Math.round(nodes.offsetY) === 295)).toBe(true);
            done();
        };

    });
    it('Checking organizational chart collapse along with layout', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 648, 127);
        let nodes: Node = diagram.nodes[0] as Node
        diagram.animationComplete = () => {
            expect((Math.round(nodes.offsetX) === 625 || Math.round(nodes.offsetX) === 624) && Math.round(nodes.offsetY) === 42).toBe(true);
            done();
        };
    });
    it('Checking icons on proper layer if removed', (done: Function) => {
        let id = diagram.nodes[0].id;
        diagram.remove(diagram.nodes[0]);
        let svgElement: SVGSVGElement = document.getElementsByClassName('e-ports-expand-layer')[0] as SVGSVGElement;
        let gElement: SVGElement = svgElement.getElementById(id + '_icon_content_groupElement') as SVGElement;
        expect(gElement == null).toBe(true);
        done();
    });

});
describe('Tree Layout expand collapse operation of icon take place distance from node', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimation' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        diagram = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: true,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataSource: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .7, y: .8 } }
                obj.expandIcon.margin = { left: 0, right: 0, top: 20, bottom: 0 };
                obj.collapseIcon.offset = { x: .7, y: .8 }
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.collapseIcon.margin = { left: 0, right: 0, top: 20, bottom: 0 };
                obj.width = 150;
                obj.height = 50;
                obj.style = {};
                obj.style.fill = obj.data['color'];
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                let obj: any = {};
                obj.targetDecorator = {};
                obj.targetDecorator.shape = 'None';
                obj.type = 'Orthogonal';
                return obj;
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram.appendTo('#diagramanimation');
    });

    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });

  

 
    it('ree Layout expand collapse operation of icon take place distance from node', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 658, 148);
        let nodes: Node = diagram.nodes[0] as Node
        diagram.animationComplete = () => {
            expect(diagram.nodes[4].wrapper.visible === false).toBe(true);
            done();
        };
    });
    
});
describe('Organization chart', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramOrgChart32' });
        document.body.appendChild(ele);
        let items: DataManager = new DataManager(assitants1 as JSON[], new Query().take(7));

        diagram = new Diagram({
            width: '100%', height: '700px',
            snapSettings: { constraints: 0 },
            layout: {
                type: 'OrganizationalChart', orientation: 'BottomToTop', horizontalSpacing: 30, verticalSpacing: 30,
                getLayoutInfo: (node: Node, options: TreeInfo) => {
                    if (node.data['Role'] === 'General Manager') {
                        options.assistants.push(options.children[0]);
                        options.children.splice(0, 1);
                    }
                    if (!options.hasSubTree) {
                        options.offset = -50;
                        options.type = 'Left';
                        options.orientation = 'Vertical';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'Manager', dataSource: items
            },

            getNodeDefaults: (obj: Node, diagram: Diagram) => {
                obj.width = 150;
                obj.height = 50;
                obj.style.fill = obj.data['color'];
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#diagramOrgChart32');
    });

    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking organizational chart- orientation (Bottom to Top), type (Left) and the offset value is negative', (done: Function) => {

        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.topCenter.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.topCenter.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.middleRight.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.middleRight.y).toBe(true);
        done();
    });
    it('Checking organizational chart- orientation (Bottom to Top), type (Right) and the offset value is negative', (done: Function) => {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (node.data['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.offset = -50;
                options.type = 'Right';
                options.orientation = 'Vertical';
            }
        };
        diagram.dataBind();
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.topCenter.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.topCenter.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.middleLeft.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.middleLeft.y).toBe(true);
        done();
    });
    it('Checking organizational chart- orientation (Left to Right), type (Left) and the offset value is negative', (done: Function) => {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.orientation = 'LeftToRight';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (node.data['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.offset = -50;
                options.type = 'Left';
                options.orientation = 'Vertical';
            }
        };
        diagram.dataBind();
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleRight.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleRight.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.topCenter.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.topCenter.y).toBe(true);
        done();
    });
    it('Checking organizational chart- orientation (Left to Right), type (Right) and the offset value is negative', (done: Function) => {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.orientation = 'LeftToRight';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (node.data['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.offset = -50;
                options.type = 'Right';
                options.orientation = 'Vertical';
            }
        };
        diagram.dataBind();
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleRight.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleRight.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.bottomCenter.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.bottomCenter.y).toBe(true);
        done();
    });
    it('Checking organizational chart- orientation (Right to Left), type (Left) and the offset value is negative', (done: Function) => {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.orientation = 'RightToLeft';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (node.data['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.offset = -50;
                options.type = 'Left';
                options.orientation = 'Vertical';
            }
        };
        diagram.dataBind();
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleLeft.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleLeft.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.topCenter.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.topCenter.y).toBe(true);
        done();
    });
    it('Checking organizational chart- orientation (Left to Right), type (Right) and the offset value is negative', (done: Function) => {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.orientation = 'RightToLeft';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (node.data['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.offset = -50;
                options.type = 'Right';
                options.orientation = 'Vertical';
            }
        };
        diagram.dataBind();
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleLeft.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleLeft.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.bottomCenter.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.bottomCenter.y).toBe(true);
        done();
    });

});

describe('Tree Layout', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimationlayputorientation' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        window['setNodeTemplate'] = function (obj: Node, diagram: Diagram): Container {
            let content: StackPanel = new StackPanel();
            content.id = obj.id + '_outerstack';
            content.style.strokeColor = 'darkgreen';
            content.orientation = 'Horizontal';
            content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
            let innerStack: StackPanel = new StackPanel();
            innerStack.style.strokeColor = 'none';
            innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
            innerStack.id = obj.id + '_innerstack';

            let text: TextElement = new TextElement();
            text.content = obj.data['Name'];

            text.style.color = 'blue';
            text.style.strokeColor = 'none';
            text.style.fill = 'none';
            text.id = obj.id + '_text1';

            let desigText: TextElement = new TextElement();
            desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
            desigText.content = obj.data['Designation'];
            desigText.style.color = 'blue';
            desigText.style.strokeColor = 'none';
            desigText.style.fill = 'none';
            desigText.style.textWrapping = 'Wrap';
            desigText.id = obj.id + '_desig';
            innerStack.children = [text, desigText];

            content.children = [innerStack];

            return content;
        }
        diagram = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: true,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataSource: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .5, y: .85 } }
                obj.collapseIcon.offset = { x: .5, y: .85 }
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style.fill = obj.data['color'];
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            },
            setNodeTemplate: 'setNodeTemplate'
        });

        diagram.appendTo('#diagramanimationlayputorientation');


    });

    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });


    it('Checking icons positioning based on orinetation', (done: Function) => {
        let nodes: Node = diagram.nodes[0] as Node;
        expect(Math.ceil(nodes.wrapper.children[2].offsetX) === 625 && Math.ceil(nodes.wrapper.children[2].offsetY) === 58).toBe(true);
        diagram.layout.orientation = 'BottomToTop'
        diagram.dataBind();
        let nodes1: Node = diagram.nodes[0] as Node;
        expect(Math.ceil(nodes1.wrapper.children[2].offsetX) === 625 && Math.ceil(nodes1.wrapper.children[2].offsetY) === 218).toBe(true);
        diagram.layout.orientation = 'LeftToRight'
        diagram.dataBind();
        let nodes2: Node = diagram.nodes[0] as Node;
        expect((Math.ceil(nodes2.wrapper.children[2].offsetX) === 152 || Math.ceil(nodes2.wrapper.children[2].offsetX) === 151)
            && Math.ceil(nodes2.wrapper.children[2].offsetY) === 295).toBe(true);
        diagram.layout.orientation = 'RightToLeft';
        diagram.dataBind();
        let nodes3: Node = diagram.nodes[0] as Node;
        expect((Math.ceil(nodes3.wrapper.children[2].offsetX) === 465 || Math.ceil(nodes3.wrapper.children[2].offsetX) === 464
            || (Math.ceil(nodes3.wrapper.children[2].offsetX) === 466))
            && Math.ceil(nodes3.wrapper.children[2].offsetY) === 295).toBe(true);
        done();
    })
    it('Checking node size after resizing', (done: Function) => {
        diagram.select([diagram.nodes[0]]);
        console.log(diagram.nodes[0].width);
            resize(diagram, 'resizeEast');
            console.log('afterWidth'+diagram.nodes[0].width);
            console.log('afterOffsetX'+diagram.nodes[0].offsetX );
            console.log('afterHeight'+diagram.nodes[0].height);
            console.log('afterOffsetY'+diagram.nodes[0].offsetY);
            console.log("offsets");
            expect(diagram.nodes[0].offsetX ===507.3310546875 && diagram.nodes[0].offsetY === 295
                && diagram.nodes[0].width === 150 && diagram.nodes[0].height === 50).toBe(false);
            done();
    })

});

describe('Tree Layout', () => {
    let diagram1: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimationfalse' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        diagram1 = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: false,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataSource: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .7, y: .8 } }
                obj.collapseIcon.offset = { x: .7, y: .8 }
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style = { fill: obj.data['color'] };
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                let connector: ConnectorModel = {};
                connector.targetDecorator = { shape: 'None' };
                connector.type = 'Orthogonal';
                return connector;
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram1.appendTo('#diagramanimationfalse');
    });

    afterAll(() => {
        diagram1.destroy();
        ele.remove();
    });

    it('Checking organizational chart collapse', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram1.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 620, 54);
        mouseEvents.clickEvent(diagramCanvas, 648, 54);
        let nodes: Node = diagram1.nodes[1] as Node;
        expect((Math.round(nodes.offsetX) == 625 || Math.round(nodes.offsetX) == 624) && Math.round(nodes.offsetY) == 116).toBe(true);
        done();
    });

});


describe('Tree Layout', () => {
    let diagram2: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimationExpand' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        diagram2 = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: false,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataSource: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .7, y: .8 } }
                obj.collapseIcon.offset = { x: .7, y: .8 }
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style = { fill: obj.data['color'] };
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram2.appendTo('#diagramanimationExpand');
    });

    afterAll(() => {
        diagram2.destroy();
        ele.remove();
    });

    it('Checking organizational chart collapse', (done: Function) => {
        (diagram2.nodes[0] as Node).isExpanded = !(diagram2.nodes[0] as Node).isExpanded;
        diagram2.dataBind();
        setTimeout(() => {
            let node: Node = diagram2.nodes[1] as Node;
            let nodeObj: HTMLElement = document.getElementById(node.id);
            expect(nodeObj.getAttribute('visibility') === 'hidden').toBe(true);
            done();
        }, 200);
    });

    it('Checking organizational chart expand', (done: Function) => {
        (diagram2.nodes[0] as Node).isExpanded = !(diagram2.nodes[0] as Node).isExpanded;
        diagram2.dataBind();
        setTimeout(() => {
            let node: Node = diagram2.nodes[1] as Node;
            let nodeObj: HTMLElement = document.getElementById(node.id);
            expect(nodeObj.getAttribute('visibility') === 'visible').toBe(true);
            done();
        }, 200);
    });
    it('Checking organizational chart expand', (done: Function) => {
        let node: Node = diagram2.nodes[5] as Node;
        let wrapper = node.wrapper.children[2];
        expect(wrapper.visible === false).toBe(true);
        done();
    });


});

describe('Tree Layout', () => {
    let diagram3: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimationExpand' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        diagram3 = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: false,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataSource: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {

                obj.isExpanded = false;
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .7, y: .8 } };
                obj.collapseIcon.offset = { x: .7, y: .8 };
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style = { fill: obj.data['color'] };
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram3.appendTo('#diagramanimationExpand');
    });

    afterAll(() => {
        diagram3.destroy();
        ele.remove();
    });

    it('Checking organizational chart Expand', (done: Function) => {
        (diagram3.nodes[0] as Node).isExpanded = !(diagram3.nodes[0] as Node).isExpanded;
        diagram3.dataBind();
        setTimeout(() => {
            let node: Node = diagram3.nodes[1] as Node;
            let nodeObj: HTMLElement = document.getElementById(node.id);
            expect(nodeObj.getAttribute('visibility') === 'visible').toBe(true);
            done();
        }, 200);
    });

});

describe('Layout collapse  ', () => {
    let diagram3: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimationExpand' });
        document.body.appendChild(ele);
        let data2 = [
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
        let items1 = new DataManager(data2, new Query().take(7));
        diagram3 = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: false,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataSource: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .7, y: .8 } };
                obj.collapseIcon.offset = { x: .7, y: .8 };
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style = { fill: obj.data['color'] };
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram3.appendTo('#diagramanimationExpand');
    });

    afterAll(() => {
        diagram3.destroy();
        ele.remove();
    });

    it('Checking organizational chart collapse and layout', (done: Function) => {
        var mouseEvents = new MouseEvents();
        var diagramCanvas = document.getElementById(diagram3.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 748, 129);
        expect((Math.ceil(diagram3.nodes[3].offsetX) === 645 || Math.floor) && Math.round(diagram3.nodes[3].offsetY) === 190).toBe(true);
        done();
    });
});

describe('Connector Update in Layout Issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramConnectorUpdateInLayoutIssue' });
        document.body.appendChild(ele);
        let data: object[] = [
            { id: 1, Label: 'StackPanel' },
            { id: 2, Label: 'Label', parentId: 1 },
            { id: 3, Label: 'ListBox', parentId: 1 }
        ];
        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        diagram = new Diagram({
            width: '900px', height: '550px',
            layout: { type: 'HierarchicalTree' },
            dataSourceSettings: { id: 'id', parentId: 'parentId', dataSource: items },
            getNodeDefaults: (obj: Node) => {
                obj.shape = { type: 'Text', content: (obj.data as { Label: 'string' }).Label };
                obj.style = { fill: 'lightgrey', strokeColor: 'none', strokeWidth: 2 };
                obj.borderColor = 'black';
                obj.backgroundColor = 'lightgrey';
                obj.borderWidth = 1;
                (obj.shape as TextModel).margin = { left: 5, right: 5, top: 5, bottom: 5 };
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#diagramConnectorUpdateInLayoutIssue');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking Connector update in DOM - After checking the layout', (done: Function) => {
        diagram.layout.type = "OrganizationalChart";
        diagram.dataBind();
        let id = diagram.connectors[0].id;
        let x = (Math.ceil(Number(document.getElementById(id).getAttribute('x')))).toString();
        let y = document.getElementById(id).getAttribute('y');
        console.log("update in DOM");
        console.log(x);
        console.log(y);
        expect(x == '433' && y == '74.4').toBe(true);
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

describe('OrgChart-Layout Expand collapse issue exception raise issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    function nodeDefaults(node: any) {
        node.annotations[0].style.color = "white";
        node.width = 120;
        node.height = 50;
        node.expandIcon = { shape: 'Minus', height: 20, width: 20 };
        node.collapseIcon = { shape: 'Plus', height: 20, width: 20 };
        return node;
    }

    //The below method used to define the common settings for connectors.
    function connectorDefaults(connector: any) {
        connector.type = 'Orthogonal';
        connector.targetDecorator = { shape: 'None' };
        return connector;
    }
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramConnectorUpdateInLayoutIssue' });
        document.body.appendChild(ele);
        var data: object[] = [
            { 'id': 'parent', 'role': 'Board', 'color': '#71AF17' },
            { 'id': '1', 'role': 'General Manager', 'manager': 'parent', 'color': '#71AF17' },
            { 'id': '2', 'role': 'Human Resource Manager', 'manager': '1', 'color': '#1859B7' },
            { 'id': '3', 'role': 'Trainers', 'manager': '2', 'color': '#2E95D8' },
            { 'id': '4', 'role': 'Recruiting Team', 'manager': '2', 'color': '#2E95D8' },
            { 'id': '5', 'role': 'Finance Asst. Manager', 'manager': '2', 'color': '#2E95D8' },
            { 'id': '6', 'role': 'Design Manager', 'manager': '1', 'color': '#1859B7' },
            { 'id': '7', 'role': 'Design Supervisor', 'manager': '6', 'color': '#2E95D8' },
            { 'id': '8', 'role': 'Development Supervisor', 'manager': '6', 'color': '#2E95D8' },
            { 'id': '9', 'role': 'Drafting Supervisor', 'manager': '6', 'color': '#2E95D8' },
            { 'id': '11', 'role': 'Assistant General Manager', 'manager': '1', 'color': '#71AF17' },
        ];
        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        diagram = new Diagram({
            width: "1000px",
            height: "600px",
            // bind the data to diagram and map the columns.
            dataSourceSettings: {
                id: 'id', parentId: 'manager', dataSource: items,
                doBinding: function (node: any, data: any) {
                    node.id = data.role,
                        // You will get the employee information in data argument and bind that value directly to node's built-in properties for customization.
                        node.annotations = [
                            { content: data.role },
                        ];
                    node.style = { fill: data.color };
                }
            },
            layout: {
                // set the layout type and alignment
                type: 'OrganizationalChart',
                orientation: 'TopToBottom',
                horizontalSpacing: 50, verticalSpacing: 50,
                getLayoutInfo: function (node: any, options: any) {
                    // define the assistants in the organization and leaf level nodes alignment.
                    if (node.data.role === 'General Manager') {
                        options.assistants.push(options.children[2]);
                        options.children.splice(2, 1);
                    }
                    if (!options.hasSubTree) {
                        options.orientation = 'Horizontal';
                        options.type = 'Center';
                    }
                }
            },
            getNodeDefaults: nodeDefaults,
            getConnectorDefaults: connectorDefaults
        });
        diagram.appendTo('#diagramConnectorUpdateInLayoutIssue');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('OrgChart-Layout Expand collapse issue exception raise issue', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        var element = document.getElementById('General Manager_icon_content_rect');
        let bounds: DOMRect | ClientRect = element.getBoundingClientRect();
        diagram.animationComplete = function () {
            console.log("animationComplete")
            expect(diagram.nodes[2].visible === false).toBe(true);
            done();
        };
        mouseEvents.clickEvent(diagramCanvas, diagram.nodes[0].offsetX, diagram.nodes[0].offsetY);
        mouseEvents.mouseMoveEvent(diagramCanvas, (bounds as DOMRect).x + 4, ((bounds as DOMRect).y + (bounds as DOMRect).height / 2) - 12);
        mouseEvents.mouseDownEvent(diagramCanvas, (bounds as DOMRect).x + 4, ((bounds as DOMRect).y + (bounds as DOMRect).height / 2) - 12);
        mouseEvents.mouseUpEvent(diagramCanvas, (bounds as DOMRect).x + 4, ((bounds as DOMRect).y + (bounds as DOMRect).height / 2) - 12);
    });

});

describe('Node and connector default for layout', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    Diagram.Inject(LayoutAnimation);
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
    let items: DataManager = new DataManager(data as JSON[], new Query().take(7));


    beforeAll(() => {
        ele = createElement('div', { id: 'diagramConnectorUpdateInLayoutIssue' });
        document.body.appendChild(ele);


        diagram = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: true,
                type: 'OrganizationalChart', margin: { top: 20 },
                layoutInfo: { type: 'Left', offset: -20, orientation: 'Vertical' },
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataSource: items
            },
            nodeDefaults: {
                expandIcon: { height: 15, width: 15, shape: "Plus", fill: 'lightgray', borderColor: 'red', borderWidth: 3, offset: { x: .5, y: .85 } },
                height: 50, backgroundColor: 'lightgrey', style: { fill: 'transparent', strokeWidth: 2 },
                collapseIcon: { height: 15, width: 15, shape: "Minus", fill: 'lightgray', borderColor: 'red', borderWidth: 3, offset: { x: .5, y: .85 } }
            },
            connectorDefaults: {
                type: 'Orthogonal',
                style: { strokeColor: 'red' },
                targetDecorator: {
                    shape: 'None',

                },
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 15, right: 15, top: 15, bottom: 15 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram.appendTo('#diagramConnectorUpdateInLayoutIssue');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Node and connector default for layout', (done: Function) => {
        let iconElement = document.getElementById(diagram.nodes[0].id + '_icon_content_shape')
        let connectorElement = document.getElementById(diagram.connectors[0].id + '_path');
        expect(iconElement.getAttribute('d') === 'M3,0 L3,6 M0,3 L6,3 ' && (iconElement.getAttribute('stroke') === 'red' || iconElement.getAttribute('stroke') === '#1a1a1a')
            && iconElement.getAttribute('stroke-width') === '3' && connectorElement.getAttribute('stroke') === 'red'
            && connectorElement.getAttribute('d') === 'M0,0 L0,7.5 L35,7.5 L35,51.9 L20,51.9 ').toBe(true)
        done();
    });

    it('get layout info test cases', (done: Function) => {
        let node = diagram.nodes[0]
        let nodeElement: any = document.getElementById(node.id)
        expect(Math.round(nodeElement.getAttribute('x')) === 631 || Math.round(nodeElement.getAttribute('x')) === 632 || Math.round(nodeElement.getAttribute('x')) === 633).toBe(true);
        nodeElement = document.getElementById(diagram.nodes[1].id)
        expect(Math.round(nodeElement.getAttribute('x')) === 579 || Math.round(nodeElement.getAttribute('x')) === 580 || Math.round(nodeElement.getAttribute('x')) === 581).toBe(true)
        done();
    });

});
describe('Data Map - Blazor Support', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    function nodeDefaults(node: any) {
        node.annotations[0].style.color = "white";
        node.width = 120;
        node.height = 50;
        node.expandIcon = { shape: 'Minus' };
        node.collapseIcon = { shape: 'Plus' };
        return node;
    }

    //The below method used to define the common settings for connectors.
    function connectorDefaults(connector: any) {
        connector.type = 'Orthogonal';
        connector.targetDecorator = { shape: 'None' };
        return connector;
    }
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramdataMap' });
        document.body.appendChild(ele);
        let data: object[] = [{ 'Name': 'Customer Support', 'fillColor': '#0f688d' },
        { 'Name': 'OEM Support', 'fillColor': '#0f688d' },
        { 'Name': 'Customer Care', 'ReportingPerson': ['Customer Support', 'OEM Support'], 'fillColor': '#14ad85' },
        { 'Name': 'Central Region', 'fillColor': '#0f688d' },
        { 'Name': 'Eastern Region', 'fillColor': '#0f688d' },
        { 'Name': 'ServiceCare', 'ReportingPerson': ['Central Region', 'Eastern Region'], 'fillColor': '#14ad85' },
        { 'Name': 'National Channel Marketing', 'fillColor': '#0f688d' },
        { 'Name': 'Retail Channel Marketing', 'fillColor': '#0f688d' },
        {
            'Name': 'Channel Marketing', 'ReportingPerson': ['National Channel Marketing', 'Retail Channel Marketing'],
            'fillColor': '#14ad85'
        },
        { 'Name': 'Northern Region', 'fillColor': '#0f688d' },
        { 'Name': 'Western Region', 'fillColor': '#0f688d' },
        { 'Name': 'Channel Field Sales', 'ReportingPerson': ['Northern Region', 'Western Region'], 'fillColor': '#14ad85' },
        { 'Name': 'Customer', 'ReportingPerson': ['Customer Care', 'ServiceCare'], 'fillColor': '#0aa6ce' },
        { 'Name': 'SalesMan', 'ReportingPerson': ['Channel Marketing', 'Channel Field Sales'], 'fillColor': '#0aa6ce' },
        { 'Name': 'Adventure Work Cycle', 'ReportingPerson': ['Customer', 'SalesMan'], 'fillColor': '#f16f62' },
        ];
        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        diagram = new Diagram({
            width: 1500, height: 2500,
            layout: { type: 'HierarchicalTree', verticalSpacing: 40 },
            dataSourceSettings: {
                id: 'Name', parentId: 'ReportingPerson', dataSource: items,
                doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
                    nodeModel.annotations = [{
                        margin: { top: 10 }
                    }];
                },
                dataMapSettings: [{
                    property: 'Annotations[0].Style.Fill', field: 'fillColor'
                },
                {
                    property: 'Annotations[0].Content', field: 'Name'
                },
                {
                    property: 'Style.Fill', field: 'fillColor'
                }]
            },
            getNodeDefaults: (obj: Node, diagram: Diagram) => {
                obj.width = 150; obj.height = 50; obj.shape = { type: 'Basic', shape: 'Rectangle' };
                obj.style = { fill: 'transparent', strokeWidth: 2 };
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#diagramdataMap');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Diagram Data Map property for Layout', (done: Function) => {
        expect(diagram.nodes[0].annotations[0].style.fill === '#0f688d').toBe(true);
        done();
    });

});

describe('layout-info assistant support', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    function nodeDefaults(node: any) {
        node.annotations[0].style.color = "white";
        node.width = 120;
        node.height = 50;
        node.expandIcon = { shape: 'Minus' };
        node.collapseIcon = { shape: 'Plus' };
        return node;
    }

    //The below method used to define the common settings for connectors.
    function connectorDefaults(connector: any) {
        connector.type = 'Orthogonal';
        connector.targetDecorator = { shape: 'None' };
        return connector;
    }
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramdataMap' });
        document.body.appendChild(ele);
        let data: object[] = [
            { 'Id': 'parent', 'Role': 'Board', 'color': '#71AF17' },
            { 'Id': '1', 'Role': 'General Manager', 'Manager': 'parent', 'ChartType': 'right', 'color': '#71AF17' },
            { 'Id': '11', 'Role': 'Assistant Manager', 'Manager': '1', 'color': '#71AF17' },
            { 'Id': '110', 'Role': 'Assistant Manager1', 'Manager': '1', 'color': '#71AF17' },
            { 'Id': '2', 'Role': 'Human Resource Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
            { 'Id': '3', 'Role': 'Trainers', 'Manager': '2', 'color': '#2E95D8' },
            { 'Id': '4', 'Role': 'Recruiting Team', 'Manager': '2', 'color': '#2E95D8' },
            { 'Id': '5', 'Role': 'Finance Asst. Manager', 'Manager': '2', 'color': '#2E95D8' },
            { 'Id': '6', 'Role': 'Design Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
            { 'Id': '7', 'Role': 'Design Supervisor', 'Manager': '6', 'color': '#2E95D8' },
            { 'Id': '8', 'Role': 'Development Supervisor', 'Manager': '6', 'color': '#2E95D8' },
            { 'Id': '9', 'Role': 'Drafting Supervisor', 'Manager': '6', 'color': '#2E95D8' },
            { 'Id': '10', 'Role': 'Operation Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
            { 'Id': '11', 'Role': 'Statistic Department', 'Manager': '10', 'color': '#2E95D8' },
            { 'Id': '12', 'Role': 'Logistic Department', 'Manager': '10', 'color': '#2E95D8' },
            { 'Id': '16', 'Role': 'Marketing Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
            { 'Id': '17', 'Role': 'Oversea sales Manager', 'Manager': '16', 'color': '#2E95D8' },
            { 'Id': '18', 'Role': 'Petroleum Manager', 'Manager': '16', 'color': '#2E95D8' },
            { 'Id': '20', 'Role': 'Service Dept. Manager', 'Manager': '16', 'color': '#2E95D8' },
            { 'Id': '21', 'Role': 'Quality Department', 'Manager': '16', 'color': '#2E95D8' }
        ];

        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        diagram = new Diagram({
            width: '4000px', height: '2000px',
            snapSettings: { constraints: 0 },
            layout: {
                type: 'OrganizationalChart',
                layoutInfo: { getAssistantDetails: { root: "General Manager", assistants: ["Assistant Manager", "Assistant Manager1"] } },
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'Manager', dataSource: items
            },

            getNodeDefaults: (obj: Node, diagram: Diagram) => {
                obj.width = 150;
                obj.height = 50;
                obj.style.fill = obj.data['color'];
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#diagramdataMap');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('layout-info assistant support', (done: Function) => {
        expect(diagram.nodes[2].offsetY === 235 && diagram.nodes[3].offsetY === 235).toBe(true);
        done();
    });
    describe('layout-Type as none', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        function nodeDefaults(node: any) {
            node.annotations[0].style.color = "white";
            node.width = 120;
            node.height = 50;
            node.expandIcon = { shape: 'Minus' };
            node.collapseIcon = { shape: 'Plus' };
            return node;
        }

        //The below method used to define the common settings for connectors.
        function connectorDefaults(connector: any) {
            connector.type = 'Orthogonal';
            connector.targetDecorator = { shape: 'None' };
            return connector;
        }
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramdataMaps' });
            document.body.appendChild(ele);
            let data: object[] = [
                { 'Id': 'parent', 'Role': 'Board', 'color': '#71AF17' },
                { 'Id': '1', 'Role': 'General Manager', 'Manager': 'parent', 'ChartType': 'right', 'color': '#71AF17' },
                { 'Id': '11', 'Role': 'Assistant Manager', 'Manager': '1', 'color': '#71AF17' },
                { 'Id': '110', 'Role': 'Assistant Manager1', 'Manager': '1', 'color': '#71AF17' },
                { 'Id': '2', 'Role': 'Human Resource Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
                { 'Id': '3', 'Role': 'Trainers', 'Manager': '2', 'color': '#2E95D8' },
                { 'Id': '4', 'Role': 'Recruiting Team', 'Manager': '2', 'color': '#2E95D8' },
                { 'Id': '5', 'Role': 'Finance Asst. Manager', 'Manager': '2', 'color': '#2E95D8' },
                { 'Id': '6', 'Role': 'Design Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
                { 'Id': '7', 'Role': 'Design Supervisor', 'Manager': '6', 'color': '#2E95D8' },
                { 'Id': '8', 'Role': 'Development Supervisor', 'Manager': '6', 'color': '#2E95D8' },
                { 'Id': '9', 'Role': 'Drafting Supervisor', 'Manager': '6', 'color': '#2E95D8' },
                { 'Id': '10', 'Role': 'Operation Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
                { 'Id': '11', 'Role': 'Statistic Department', 'Manager': '10', 'color': '#2E95D8' },
                { 'Id': '12', 'Role': 'Logistic Department', 'Manager': '10', 'color': '#2E95D8' },
                { 'Id': '16', 'Role': 'Marketing Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
                { 'Id': '17', 'Role': 'Oversea sales Manager', 'Manager': '16', 'color': '#2E95D8' },
                { 'Id': '18', 'Role': 'Petroleum Manager', 'Manager': '16', 'color': '#2E95D8' },
                { 'Id': '20', 'Role': 'Service Dept. Manager', 'Manager': '16', 'color': '#2E95D8' },
                { 'Id': '21', 'Role': 'Quality Department', 'Manager': '16', 'color': '#2E95D8' }
            ];

            let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
            diagram = new Diagram({
                width: '4000px', height: '2000px',
                snapSettings: { constraints: 0 },
                layout: {
                    type: 'HierarchicalTree',
                    layoutInfo: { getAssistantDetails: { root: "General Manager", assistants: ["Assistant Manager", "Assistant Manager1"] } },
                },
                dataSourceSettings: {
                    id: 'Id', parentId: 'Manager', dataSource: items
                },

                getNodeDefaults: (obj: Node, diagram: Diagram) => {
                    obj.width = 150;
                    obj.height = 50;
                    obj.style.fill = obj.data['color'];
                    obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.targetDecorator.shape = 'None';
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagramdataMaps');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking hierarchical chart - save and load with layout type as none', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let obj: NodeModel = diagram.nodes[0];
            diagram.drag(obj, 50, 50);
            expect(diagram.nodes[0].offsetX === 1915 && diagram.nodes[0].offsetY === 125).toBe(true)
            let saveloaddata: any = diagram.saveDiagram();
            saveloaddata = JSON.parse(saveloaddata);
            saveloaddata.layout.type = "None";
            saveloaddata = JSON.stringify(saveloaddata)
            diagram.loadDiagram(saveloaddata);
            expect(diagram.nodes[0].width == 150 && diagram.nodes[0].height == 50).toBe(true);
            expect(diagram.nodes[0].offsetX === 1915 && diagram.nodes[0].offsetY === 125).toBe(true)
            done();
        });
    });
    describe('expand icon working at the position of scroll bar', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll(() => {
            ele = createElement('div', { id: 'diagramdataMaps' });
            document.body.appendChild(ele);
            interface Activity {
                Code: string;
                Description: string;
                NodeType: string,
                Speed: string,
                Allocation: number,
            }
            let data: object[] = [
                {
                    "Id": "L1",
                    "Code": "WBD",
                    "Description": "Whole Birds",
                    "NodeType": "Line",
                    "Speed": "15.5k",
                    "Allocation": "0"
                },
                {
                    "Id": "L1-373",
                    "Code": "373",
                    "Description": "Carcass A Drop Bulk",
                    "NodeType": "Equipment",
                    "Speed": "12.2k",
                    "Allocation": "0",
                    "ParentList": [
                        "L1"
                    ]
                },
                {
                    "Id": "L1-377",
                    "Code": "377",
                    "Description": "Shrink Pack Machine",
                    "NodeType": "Equipment",
                    "Speed": "4.9k",
                    "Allocation": "19",
                    "ParentList": [
                        "L1-373", "L1-353"
                    ]
                },
                {
                    "Id": "L1-10911",
                    "Code": "10911",
                    "Description": "Product Crating",
                    "NodeType": "Manpower",
                    "Speed": "4.9k",
                    "Allocation": "19",
                    "ParentList": [
                        "L1-377"
                    ]
                },
                {
                    "Id": "L1-380",
                    "Code": "380",
                    "Description": "Product Labeling",
                    "NodeType": "Manpower",
                    "Speed": "4.9k",
                    "Allocation": "19",
                    "ParentList": [
                        "L1-10911", "L1-367"
                    ]
                },
                {
                    "Id": "L1-367",
                    "Code": "367",
                    "Description": "Cartoon Freezer",
                    "NodeType": "Equipment",
                    "Speed": "0.2k",
                    "Allocation": "98",
                    "ParentList": [
                        "L1-10911"
                    ]
                },
                {
                    "Id": "L1-353",
                    "Code": "353",
                    "Description": "Carcass B Drop Bulk",
                    "NodeType": "Equipment",
                    "Speed": "12.2k",
                    "Allocation": "0",
                    "ParentList": [
                        "L1"
                    ]
                },
                {
                    "Id": "L2",
                    "Code": "CUT",
                    "Description": "Cut-Ups",
                    "NodeType": "Line",
                    "Speed": "3.8k",
                    "Allocation": "0"
                },
                {
                    "Id": "L2-10930",
                    "Code": "10930",
                    "Description": "Drop Off Bulk Wings",
                    "NodeType": "Equipment",
                    "Speed": "1.0k",
                    "Allocation": "0",
                    "ParentList": [
                        "L2"
                    ]
                },
                {
                    "Id": "L2-398",
                    "Code": "398",
                    "Description": "Manual Product Grading",
                    "NodeType": "Manpower",
                    "Speed": "1.0k",
                    "Allocation": "0",
                    "ParentList": [
                        "L2-10930"
                    ]
                },
                {
                    "Id": "L2-10935",
                    "Code": "10935",
                    "Description": "Product Weighing",
                    "NodeType": "Equipment",
                    "Speed": "8.1k",
                    "Allocation": "29",
                    "ParentList": [
                        "L2-398", "L2-10574"
                    ]
                },
                {
                    "Id": "L2-401",
                    "Code": "401",
                    "Description": "Product Packing",
                    "NodeType": "Equipment",
                    "Speed": "1.0k",
                    "Allocation": "100",
                    "ParentList": [
                        "L2-10935"
                    ]
                },
                {
                    "Id": "L2-466",
                    "Code": "466",
                    "Description": "Breast Fillet Deboning",
                    "NodeType": "Manpower",
                    "Speed": "7.5k",
                    "Allocation": "0",
                    "ParentList": [
                        "L2"
                    ]
                },
                {
                    "Id": "L2-10574",
                    "Code": "10574",
                    "Description": "Breast Skinner",
                    "NodeType": "Equipment",
                    "Speed": "7.5k",
                    "Allocation": "26",
                    "ParentList": [
                        "L2-466"
                    ]
                },
                {
                    "Id": "L2-485",
                    "Code": "485",
                    "Description": "Drop Off Bulk IQF",
                    "NodeType": "Equipment",
                    "Speed": "1.0k",
                    "Allocation": "0",
                    "ParentList": [
                        "L2"
                    ]
                },
                {
                    "Id": "L2-10592",
                    "Code": "10592",
                    "Description": "Spiral Freezer",
                    "NodeType": "Equipment",
                    "Speed": "1.0k",
                    "Allocation": "93",
                    "ParentList": [
                        "L2-485"
                    ]
                },
                {
                    "Id": "L2-490",
                    "Code": "490",
                    "Description": "Product Boxing",
                    "NodeType": "Manpower",
                    "Speed": "1.0k",
                    "Allocation": "100",
                    "ParentList": [
                        "L2-10592"
                    ]
                }
            ]
            let items: DataManager = new DataManager(data as JSON[], new Query().take(7));

            diagram = new Diagram({
                width: '100%', height: '580px', backgroundColor: "#F9FAFD",
                layout: {
                    type: 'ComplexHierarchicalTree',
                    horizontalSpacing: 40, verticalSpacing: 80, orientation: 'LeftToRight',
                    margin: { left: 48, right: 48, top: 32, bottom: 32 },
                    enableAnimation: true
                },
                dataSourceSettings: {
                    id: 'Id',
                    parentId: 'ParentList',
                    Code: 'Code',
                    Description: 'Description',
                    NodeType: 'NodeType',
                    Speed: 'Speed',
                    Allocation: 'Allocation',
                    dataSource: new DataManager(data)
                } as any,

                getNodeDefaults: (obj: Node, diagram: Diagram) => {
                    obj.shape = { type: 'Basic', shape: 'Rectangle' };
                    obj.expandIcon.height = 10;
                    obj.expandIcon.width = 10;
                    obj.expandIcon.shape = 'Minus';
                    obj.expandIcon.fill = '#fff';
                    obj.expandIcon.offset = { x: .5, y: 1 };
                    obj.expandIcon.verticalAlignment = 'Auto';
                    obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                    obj.expandIcon.borderColor = '#ABB8E7';
                    obj.expandIcon.cornerRadius = 1;
                    obj.collapseIcon.height = 10;
                    obj.collapseIcon.width = 10;
                    obj.collapseIcon.shape = 'Plus';
                    obj.collapseIcon.fill = '#fff';
                    obj.collapseIcon.offset = { x: .5, y: 1 };
                    obj.collapseIcon.verticalAlignment = 'Auto';
                    obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                    obj.collapseIcon.borderColor = '#ABB8E7';
                    obj.collapseIcon.cornerRadius = 1;
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.type = 'Orthogonal';
                    connector.cornerRadius = 7;
                    connector.targetDecorator.height = 5;
                    connector.targetDecorator.width = 3;
                    connector.targetDecorator.style.fill = '#ABB8E7';
                    connector.targetDecorator.style.strokeColor = '#ABB8E7';
                    connector.style.strokeColor = '#ABB8E7';
                    return connector;
                },

                setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                    var nodePanel: StackPanel = new StackPanel();
                    nodePanel.id = obj.id + '_nodePanel';
                    nodePanel.orientation = 'Horizontal';
                    nodePanel.style.strokeColor = 'none';
                    nodePanel.height = 96;
                    nodePanel.width = 196;
                    nodePanel.style.fill = 'White';

                    // Content Panel
                    var contentPanel: StackPanel = new StackPanel();
                    contentPanel.id = obj.id + '_contentPanel';
                    contentPanel.orientation = 'Vertical';
                    contentPanel.style.fill = 'none';
                    contentPanel.style.strokeColor = 'none';
                    contentPanel.width = 148;
                    contentPanel.height = 96;

                    // Sets panel for the alert, which indicates bottlenecks (i.e. green, yellow, red)
                    var statusPanel: StackPanel = new StackPanel();
                    statusPanel.orientation = 'Horizontal';
                    statusPanel.style.strokeColor = 'none';
                    statusPanel.id = obj.id + '_alert';
                    statusPanel.width = 48;
                    statusPanel.height = 96;

                    // Header Panel
                    var headerPanel: StackPanel = new StackPanel();
                    headerPanel.id = obj.id + '_headerPanel';
                    headerPanel.orientation = 'Vertical';
                    headerPanel.style.fill = 'none';
                    headerPanel.style.strokeColor = 'none';
                    headerPanel.height = 40;
                    headerPanel.width = 148;
                    headerPanel.verticalAlignment = 'Top';
                    headerPanel.horizontalAlignment = 'Left';

                    // Sets panel for the header first line (code)
                    var code: TextElement = new TextElement();
                    code.margin = { left: 8, right: 0, top: 8, bottom: 0 };
                    code.content = (obj.data as Activity).Code;
                    code.style.fontFamily = '"Fira Sans", sans-serif';
                    code.style.fontSize = 10;
                    code.style.color = 'rgba(0,0,0,0.60)';
                    code.style.textWrapping = 'Wrap';
                    code.style.textAlign = 'Left';
                    code.style.strokeColor = 'none';
                    code.horizontalAlignment = 'Left';
                    code.verticalAlignment = 'Top';
                    code.style.fill = 'none';
                    code.id = obj.id + '_code';

                    // Sets panel for the header second line (description)
                    var description: TextElement = new TextElement();
                    description.margin = { left: 8, right: 0, top: 0, bottom: 0 };
                    description.content = (obj.data as Activity).Description;
                    description.style.fontFamily = '"Fira Sans", sans-serif';
                    description.style.color = 'rgba(0,0,0,0.60)';
                    description.style.fontSize = 10;
                    description.style.textAlign = 'Left';
                    description.style.textWrapping = 'Wrap';
                    description.style.strokeColor = 'none';
                    description.horizontalAlignment = 'Left';
                    description.verticalAlignment = 'Bottom';
                    description.style.strokeColor = 'none';
                    description.style.textWrapping = 'Wrap';
                    description.style.fill = 'none';
                    description.id = obj.id + '_description';

                    // Sets fake panel to help spliting speed and capacity into different lines
                    var detailPanel: StackPanel = new StackPanel();
                    detailPanel.style.fill = 'none';
                    detailPanel.style.strokeColor = 'none';
                    detailPanel.orientation = 'Vertical';
                    detailPanel.id = obj.id + '_detailPanel';
                    detailPanel.horizontalAlignment = 'Left';
                    detailPanel.width = 148;
                    detailPanel.height = 56;

                    // Sets panel for the details first line (speed)
                    var speed: TextElement = new TextElement();
                    speed.margin = { left: 8, right: 0, top: 18, bottom: 0 };
                    speed.content = 'Speed: ' + (obj.data as Activity).Speed;
                    speed.style.fontFamily = '"Fira Sans", sans-serif';
                    speed.style.color = 'rgba(0,0,0,0.87)';
                    speed.style.fontSize = 12;
                    speed.style.strokeColor = 'none';
                    speed.horizontalAlignment = 'Left';
                    speed.style.textWrapping = 'Wrap';
                    speed.style.fill = 'none';
                    speed.id = obj.id + '_speed';

                    var icon: ImageElement = new ImageElement();
                    icon.id = obj.id + '_icon';
                    icon.style.strokeColor = 'None';
                    icon.margin = { left: 12, right: 0, top: 39, bottom: 0 };
                    icon.style.fill = 'none';
                    icon.width = 24;
                    icon.height = 24;

                    // Sets panel for the details second line (allocation)
                    var allocation: TextElement = new TextElement();
                    allocation.margin = { left: 8, right: 0, top: 3, bottom: 0 };
                    allocation.style.fontFamily = '"Fira Sans", sans-serif';
                    allocation.style.color = 'rgba(0,0,0,0.87)';
                    allocation.style.fontSize = 12;
                    // When allocation percent is zero, then it is showed as Non-Aplicable
                    if ((obj.data as Activity).Allocation === 0) {
                        allocation.content = 'Allocation: N/A';
                    } else {
                        allocation.content = 'Allocation: ' + (obj.data as Activity).Allocation + '%';
                    }
                    allocation.style.strokeColor = 'none';
                    allocation.horizontalAlignment = 'Left';
                    allocation.style.textWrapping = 'Wrap';
                    allocation.style.fill = 'none';
                    allocation.id = obj.id + '_allocation';

                    // When the node is a line, no alerts will be visible and font will be slightly different
                    if ((obj.data as Activity).NodeType === 'Line') {
                        // Composes the whole header panel
                        nodePanel.style.fill = '#252E4E';
                        contentPanel.style.fill = '#252E4E';
                        statusPanel.style.fill = '#4A5C9B';
                        description.style.color = 'rgba(255,255,255,0.60)';
                        code.style.color = 'rgba(255,255,255,0.60)';
                        speed.style.color = 'rgba(255,255,255, 1)';
                        allocation.style.color = 'rgba(255,255,255, 1)';
                        icon.source = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3Espeedometer%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='speedometer' fill='%2300EACE' fill-rule='nonzero'%3E%3Cpath d='M10.35,13.4841078 C8.63515585,13.4841078 7.245,12.0909446 7.245,10.3723906 C7.245,9.21068287 7.87635,8.19418859 8.7975,7.66519667 L18.84735,1.83591314 L13.1238,11.7726634 C12.6063,12.7891576 11.56095,13.4841078 10.35,13.4841078 M10.35,0 C12.22335,0 13.9725,0.518619531 15.49395,1.36915556 L13.32045,2.62421483 C12.42,2.27155355 11.385,2.07447812 10.35,2.07447812 C5.77708227,2.07447812 2.07,5.78958009 2.07,10.3723906 C2.07,12.6646889 2.99115,14.7391671 4.4919,16.2327913 L4.50225,16.2327913 C4.9059,16.6373146 4.9059,17.2907752 4.50225,17.6952984 C4.0986,18.0998216 3.4362,18.0998216 3.03255,17.7056708 L3.03255,17.7056708 C1.1592,15.8282681 0,13.2351704 0,10.3723906 C0,4.64387746 4.63385284,0 10.35,0 M20.7,10.3723906 C20.7,13.2351704 19.5408,15.8282681 17.66745,17.7056708 L17.66745,17.7056708 C17.2638,18.0998216 16.61175,18.0998216 16.2081,17.6952984 C15.80445,17.2907752 15.80445,16.6373146 16.2081,16.2327913 L16.2081,16.2327913 C17.70885,14.7287947 18.63,12.6646889 18.63,10.3723906 C18.63,9.33515156 18.43335,8.2979125 18.0711,7.36439734 L19.32345,5.18619531 C20.1825,6.7420539 20.7,8.48461553 20.7,10.3723906 Z' id='Shape'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
                    } else { // When the node is an activity
                        // Alert will show the respective color based on bottlenecks
                        if ((obj.data as Activity).Allocation < 90) {
                            // Green
                            statusPanel.style.fill = '#C8F0AA';
                            switch ((obj.data as Activity).NodeType) {
                                case 'Manpower':
                                    icon.source = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='worker' fill='%237FBC52' fill-rule='nonzero'%3E%3Cpath d='M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z' id='Shape'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
                                    break;
                                case 'Equipment':
                                    icon.source = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M18.8971429,3.42857143 L16.1428571,6.18285714 L16.1428571,6.38857143 L18.8971429,9.14285714 L23,9.14285714 L23,11.4285714 L17.96,11.4285714 L16.1428571,9.61142857 L16.1428571,12.5714286 L15,12.5714286 C13.7376349,12.5714286 12.7142857,11.5480794 12.7142857,10.2857143 L12.7142857,7.42857143 L9.12571429,7.42857143 C9.02285714,7.85142857 8.85142857,8.25142857 8.62285714,8.62857143 L15.2057143,20.5714286 L20.7142857,20.5714286 C21.9766509,20.5714286 23,21.5947777 23,22.8571429 L23,24 L0.142857143,24 L0.142857143,22.8571429 C0.142857143,21.5947777 1.16620629,20.5714286 2.42857143,20.5714286 L9.98285714,20.5714286 L4.62285714,10.8571429 C2.56571429,10.8228571 0.782857143,9.41714286 0.268571429,7.42857143 C-0.36,4.98285714 1.11428571,2.49142857 3.57142857,1.86285714 C6.00571429,1.23428571 8.49714286,2.69714286 9.12571429,5.14285714 L12.7142857,5.14285714 L12.7142857,2.28571429 C12.7142857,1.02334914 13.7376349,0 15,0 L16.1428571,0 L16.1428571,2.96 L17.96,1.14285714 L23,1.14285714 L23,3.42857143 L18.8971429,3.42857143 M4.71428571,4 C3.45192057,4 2.42857143,5.02334914 2.42857143,6.28571429 C2.42857143,7.54807943 3.45192057,8.57142857 4.71428571,8.57142857 C5.97665086,8.57142857 7,7.54807943 7,6.28571429 C7,5.02334914 5.97665086,4 4.71428571,4 Z' id='Shape' fill='%237ABD12' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                            }
                        } else if ((obj.data as Activity).Allocation < 97) {
                            // Red
                            statusPanel.style.fill = '#F2B7BF';
                            switch ((obj.data as Activity).NodeType) {
                                case 'Manpower':
                                    icon.source = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z' id='Shape' fill='%23B02032' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                                    break;
                                case 'Equipment':
                                    icon.source = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M18.8971429,3.42857143 L16.1428571,6.18285714 L16.1428571,6.38857143 L18.8971429,9.14285714 L23,9.14285714 L23,11.4285714 L17.96,11.4285714 L16.1428571,9.61142857 L16.1428571,12.5714286 L15,12.5714286 C13.7376349,12.5714286 12.7142857,11.5480794 12.7142857,10.2857143 L12.7142857,7.42857143 L9.12571429,7.42857143 C9.02285714,7.85142857 8.85142857,8.25142857 8.62285714,8.62857143 L15.2057143,20.5714286 L20.7142857,20.5714286 C21.9766509,20.5714286 23,21.5947777 23,22.8571429 L23,24 L0.142857143,24 L0.142857143,22.8571429 C0.142857143,21.5947777 1.16620629,20.5714286 2.42857143,20.5714286 L9.98285714,20.5714286 L4.62285714,10.8571429 C2.56571429,10.8228571 0.782857143,9.41714286 0.268571429,7.42857143 C-0.36,4.98285714 1.11428571,2.49142857 3.57142857,1.86285714 C6.00571429,1.23428571 8.49714286,2.69714286 9.12571429,5.14285714 L12.7142857,5.14285714 L12.7142857,2.28571429 C12.7142857,1.02334914 13.7376349,0 15,0 L16.1428571,0 L16.1428571,2.96 L17.96,1.14285714 L23,1.14285714 L23,3.42857143 L18.8971429,3.42857143 M4.71428571,4 C3.45192057,4 2.42857143,5.02334914 2.42857143,6.28571429 C2.42857143,7.54807943 3.45192057,8.57142857 4.71428571,8.57142857 C5.97665086,8.57142857 7,7.54807943 7,6.28571429 C7,5.02334914 5.97665086,4 4.71428571,4 Z' id='Shape' fill='%23B02032' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                                    break;
                            }
                        } else {
                            // Yellow
                            statusPanel.style.fill = '#FCE0A6';
                            switch ((obj.data as Activity).NodeType) {
                                case 'Manpower':
                                    icon.source = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z' id='Shape' fill='%23CD9A32' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                                    break;
                                case 'Equipment':
                                    icon.source = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M18.8971429,3.42857143 L16.1428571,6.18285714 L16.1428571,6.38857143 L18.8971429,9.14285714 L23,9.14285714 L23,11.4285714 L17.96,11.4285714 L16.1428571,9.61142857 L16.1428571,12.5714286 L15,12.5714286 C13.7376349,12.5714286 12.7142857,11.5480794 12.7142857,10.2857143 L12.7142857,7.42857143 L9.12571429,7.42857143 C9.02285714,7.85142857 8.85142857,8.25142857 8.62285714,8.62857143 L15.2057143,20.5714286 L20.7142857,20.5714286 C21.9766509,20.5714286 23,21.5947777 23,22.8571429 L23,24 L0.142857143,24 L0.142857143,22.8571429 C0.142857143,21.5947777 1.16620629,20.5714286 2.42857143,20.5714286 L9.98285714,20.5714286 L4.62285714,10.8571429 C2.56571429,10.8228571 0.782857143,9.41714286 0.268571429,7.42857143 C-0.36,4.98285714 1.11428571,2.49142857 3.57142857,1.86285714 C6.00571429,1.23428571 8.49714286,2.69714286 9.12571429,5.14285714 L12.7142857,5.14285714 L12.7142857,2.28571429 C12.7142857,1.02334914 13.7376349,0 15,0 L16.1428571,0 L16.1428571,2.96 L17.96,1.14285714 L23,1.14285714 L23,3.42857143 L18.8971429,3.42857143 M4.71428571,4 C3.45192057,4 2.42857143,5.02334914 2.42857143,6.28571429 C2.42857143,7.54807943 3.45192057,8.57142857 4.71428571,8.57142857 C5.97665086,8.57142857 7,7.54807943 7,6.28571429 C7,5.02334914 5.97665086,4 4.71428571,4 Z' id='Shape' fill='%23CD9A32' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                                    break;
                            }
                        }
                    }

                    // Sets the respective icon for line nodes, without showing the allocation as it doesn't make sense
                    if ((obj.data as Activity).NodeType === 'Line') {
                        speed.style.fontSize = 13;
                        detailPanel.children = [speed];
                    } else if ((obj.data as Activity).NodeType === 'Manpower') { // Sets the respective icon for manpower nodes
                        detailPanel.children = [speed, allocation];
                    } else if ((obj.data as Activity).NodeType === 'Equipment') {  // Sets the respective icon for equipment nodes
                        detailPanel.children = [speed, allocation];
                    }
                    headerPanel.children = [code, description];
                    statusPanel.children = [icon];
                    contentPanel.children = [headerPanel, detailPanel];
                    nodePanel.children = [contentPanel, statusPanel];
                    return nodePanel;

                }
            });
            diagram.appendTo('#diagramdataMaps');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking collpase icon is working', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 716, 446);
            console.log(diagram.selectedItems.nodes.length);
            expect(diagram.selectedItems.nodes.length === 1).toBe(true);
            done();
        });
    });

    describe('layout expand collapse orientation issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        function nodeDefaults(node: any) {
            node.annotations[0].style.color = "white";
            node.width = 120;
            node.height = 50;
            node.expandIcon = { shape: 'Minus' };
            node.collapseIcon = { shape: 'Plus' };
            return node;
        }

        //The below method used to define the common settings for connectors.
        function connectorDefaults(connector: any) {
            connector.type = 'Orthogonal';
            connector.targetDecorator = { shape: 'None' };
            return connector;
        }
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramdataMaps' });
            document.body.appendChild(ele);
            let data: object[] = [
                {
                    "Name": "Diagram",
                    "fillColor": "#916DAF"
                },
                {
                    "Name": "Layout",
                    "Category": "Diagram"
                },
                {
                    "Name": "Tree Layout",
                    "Category": "Layout"
                },
                {
                    "Name": "Organizational Chart",
                    "Category": "Layout"
                },
                {
                    "Name": "Hierarchical Tree",
                    "Category": "Tree Layout"
                },
                {
                    "Name": "Radial Tree",
                    "Category": "Tree Layout"
                },
                {
                    "Name": "Mind Map",
                    "Category": "Hierarchical Tree"
                },
                {
                    "Name": "Family Tree",
                    "Category": "Hierarchical Tree"
                },
                {
                    "Name": "Management",
                    "Category": "Organizational Chart"
                },
                {
                    "Name": "Human Resources",
                    "Category": "Management"
                },
                {
                    "Name": "University",
                    "Category": "Management"
                },
                {
                    "Name": "Business",
                    "Category": "Management"
                }
            ]


            //sets node default value
            function nodeDefaults(obj: NodeModel): NodeModel {
                obj.style = { fill: '#659be5', strokeColor: 'none', color: 'white', strokeWidth: 2 };
                obj.borderColor = '#3a6eb5';
                obj.backgroundColor = '#659be5';
                (obj.shape as TextModel).margin = { left: 5, right: 5, bottom: 5, top: 5 };
                obj.expandIcon = { height: 10, width: 10, shape: 'Plus', fill: 'lightgray', offset: { x: .5, y: 1 } };
                obj.expandIcon.verticalAlignment = 'Auto';
                obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                obj.collapseIcon.offset = { x: .5, y: 1 };
                obj.collapseIcon.verticalAlignment = 'Auto';
                obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                obj.collapseIcon.height = 10;
                obj.collapseIcon.width = 10;
                obj.collapseIcon.padding.top = 5;
                obj.collapseIcon.shape = 'Minus';
                obj.collapseIcon.fill = 'lightgray';
                return obj;
            }

            function connectorDefaults(connector: ConnectorModel, diagram: Diagram): ConnectorModel {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                connector.style.strokeColor = '#6d6d6d';
                connector.constraints = 0;
                connector.cornerRadius = 5;
                return connector;
            }

            let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
            diagram = new Diagram({
                width: '100%', height: '499px', snapSettings: { constraints: SnapConstraints.None },
                rulerSettings: { showRulers: true },
                //configures data source settings
                dataSourceSettings: {
                    //sets the fields to bind
                    id: 'Name', parentId: 'Category',
                    dataSource: new DataManager((data as any)),
                    //binds the data with the nodes
                    doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
                        nodeModel.shape = { type: 'Text', content: (data as any).Name };
                    }
                },
                
                layout: {
                    type: 'HierarchicalTree', verticalSpacing: 30, horizontalSpacing: 40, orientation: "RightToLeft",
                    enableAnimation: true
                },
                //Defines the default node and connector properties
                getNodeDefaults: nodeDefaults,
                getConnectorDefaults: connectorDefaults
            });
            diagram.appendTo('#diagramdataMaps');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });

        it('layout expand collapse orientation issue', (done: Function) => {
            let node1 = diagram.nodes[1]
            node1.isExpanded = false;
            diagram.dataBind();
            expect(diagram.nodes[2].visible === false && diagram.nodes[1].visible === true).toBe(true)
            done();
        });
    });
    describe('Nodes overlapping issue in hierarchical tree layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            debugger;
            ele = createElement('div', { id: 'diagramdataMaps' });
            document.body.appendChild(ele);
            let items: DataManager = new DataManager(layoutData as JSON[], new Query().take(7));
            diagram = new Diagram({
                width: '1200px', height: '600px',
                snapSettings: { constraints: SnapConstraints.None,
                  snapAngle: 90,
                  snapObjectDistance: 50 
              },
                //Use automatic layout to arrange elements on the page
                layout: {
                  type: 'HierarchicalTree',
                  margin: { left: 10, top: 10 },
                  horizontalSpacing: 70.0,
                  verticalSpacing: 70.0,
                  springFactor: 40.0,
                  springLength: 50.0,
                  orientation: 'TopToBottom',
              },
              dataSourceSettings: {
                  id: "Id", parentId: "ManagerId", dataManager: items,
                  doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
                      nodeModel.shape = { type: 'Text', content: (data as EmployeeInfo).Name };
                  }
              },
                getNodeDefaults: (obj: Node, diagram: Diagram) => {
                  obj.shape = { type: 'Text'};
                  obj.style = { fill: '#659be5', strokeColor: 'none', color: 'white', strokeWidth: 2 };
                  obj.borderColor = '#3a6eb5';
                  obj.backgroundColor = '#659be5';
                  (obj.shape as TextModel).margin = { left: 5, right: 5, bottom: 5, top: 5 };
                  obj.expandIcon = { height: 10, width: 10, shape: 'Plus', fill: 'lightgray', offset: { x: 0.5, y: 1 } };
                  obj.expandIcon.verticalAlignment = 'Auto';
                  obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                  obj.collapseIcon.offset = { x: 0.5, y: 1 };
                  obj.collapseIcon.verticalAlignment = 'Auto';
                  obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                  obj.collapseIcon.height = 10;
                  obj.collapseIcon.width = 10;
                  obj.collapseIcon.padding.top = 5;
                  obj.collapseIcon.shape = 'Minus';
                  obj.collapseIcon.fill = 'lightgray';
                  return obj;
                },
                getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                  connector.targetDecorator.shape = 'None';
                  connector.type = 'Straight';
                  connector.style.strokeColor = '#6d6d6d';
                  connector.constraints = 0;
                  connector.cornerRadius = 5;
                  return connector;
                },
            });
            diagram.appendTo('#diagramdataMaps');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
    
        it('nodes overlapping issue in hierarchical tree layout', (done: Function) => {
            console.log('diagram.nodes[2].offsetX' + diagram.nodes[2].offsetX);
            console.log('diagram.nodes[3].offsetX' + diagram.nodes[3].offsetX);
            console.log('diagram.nodes[7].offsetX' + diagram.nodes[7].offsetX);
            console.log('diagram.nodes[11].offsetX' + diagram.nodes[11].offsetX);
            expect(Math.round(diagram.nodes[2].offsetX) === -76 || Math.round(diagram.nodes[2].offsetX) === -75 || Math.round(diagram.nodes[2].offsetX) === -77).toBe(true);
            expect(Math.round(diagram.nodes[3].offsetX) === -154  || Math.round(diagram.nodes[3].offsetX) === -155 || Math.round(diagram.nodes[3].offsetX) === -153).toBe(true);
            expect(Math.round(diagram.nodes[7].offsetX) === 230 || Math.round(diagram.nodes[7].offsetX) === 231).toBe(true);
            expect(Math.round(diagram.nodes[11].offsetX) === 218 || Math.round(diagram.nodes[11].offsetX) === 219 || Math.round(diagram.nodes[11].offsetX) === 217).toBe(true);
            done();
        });
    });
});


describe('Layout children issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    function nodeDefaults(node: any) {
        node.annotations[0].style.color = "white";
        node.width = 120;
        node.height = 50;
        node.expandIcon = { shape: 'Minus' };
        node.collapseIcon = { shape: 'Plus' };
        return node;
    }

    //The below method used to define the common settings for connectors.
    function connectorDefaults(connector: any) {
        connector.type = 'Orthogonal';
        connector.targetDecorator = { shape: 'None' };
        return connector;
    }
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramdataMap' });
        document.body.appendChild(ele);

        var data = [
            {
                Id: "parent",
                Role: "Board",
                color: "#71AF17"
            },


            {
                Id: "6",
                Role: "Design Manager",
                Manager: "parent",
                ChartType: "right",
                color: "#1859B7"
            },
            {
                Id: "7",
                Role: "Design Supervisor",
                Manager: "6",
                color: "#2E95D8"
            },
            {
                Id: "8",
                Role: "Development Supervisor",
                Manager: "6",
                color: "#2E95D8"
            },
            {
                Id: "9",
                Role: "Drafting Supervisor",
                Manager: "6",
                color: "#2E95D8"
            },
            {
                Id: "10",
                Role: "Operations Manager",
                Manager: "parent",
                ChartType: "right",
                color: "#1859B7"
            },
            {
                Id: "11",
                Role: "Statistics Department",
                Manager: "10",
                color: "#2E95D8"
            },
            {
                Id: "12",
                Role: "Logistics Department",
                Manager: "10",
                color: "#2E95D8"
            },
            {
                Id: "16",
                Role: "Marketing Manager",
                Manager: "parent",
                ChartType: "right",
                color: "#1859B7"
            },
            {
                Id: "17",
                Role: "Overseas Sales Manager",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "18",
                Role: "Petroleum Manager",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "20",
                Role: "Service Department Manager",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "21",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "22",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "23",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "24",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            }
        ];
        var items = new DataManager(data, new Query().take(7));
        function nodeDefaultss(obj: any) {
            obj.backgroundColor = (obj.data).color;
            obj.style = { fill: "none", strokeColor: "none", color: "white" };
            obj.expandIcon = {
                height: 10,
                width: 10,
                shape: "None",
                fill: "lightgray",
                offset: { x: 0.5, y: 1 }
            };
            obj.expandIcon.verticalAlignment = "Center";
            obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
            obj.collapseIcon.offset = { x: 0.5, y: 1 };
            obj.collapseIcon.verticalAlignment = "Center";
            obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
            obj.collapseIcon.height = 10;
            obj.collapseIcon.width = 10;
            obj.collapseIcon.shape = "None";
            obj.collapseIcon.fill = "lightgray";
            obj.width = 120;
            obj.height = 30;
            return obj;
        }
        function connectorDefaultss(connector: any) {
            connector.targetDecorator.shape = "None";
            connector.type = "Orthogonal";
            connector.constraints = 0;
            connector.cornerRadius = 0;
            return connector;
        }

        diagram = new Diagram({
            width: '900px', height: '550px',
            layout: {
                type: "OrganizationalChart",
                getLayoutInfo: (node: any, options: any) => {
                    options.type = "Balanced";
                    options.orientation = "Horizontal";
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'Manager', dataSource: items,
                doBinding: (nodeModel: any, data: any, diagram: any) => {
                    nodeModel.shape = {
                        type: "Text",
                        content: (data).Role,
                        margin: { left: 10, right: 10, top: 10, bottom: 10 }
                    };
                },
            },
            getNodeDefaults: nodeDefaultss,
            getConnectorDefaults: connectorDefaultss
        });
        diagram.appendTo('#diagramdataMap');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Layout children break issue', (done: Function) => {
        debugger
        console.log("check values")
        expect(diagram.nodes[9].offsetX === 535 && diagram.nodes[10].offsetX === 705
            && diagram.nodes[11].offsetX === 875 && diagram.nodes[12].offsetX === 1045
            && diagram.nodes[13].offsetX === 705 && diagram.nodes[14].offsetX === 875).toBe(true)
        done();
    });

});


describe('EJ2-44782-Child nodes are not rendered properly in Organizational chart', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    function nodeDefaults(node: any) {
        node.annotations[0].style.color = "white";
        node.width = 120;
        node.height = 50;
        node.expandIcon = { shape: 'Minus' };
        node.collapseIcon = { shape: 'Plus' };
        return node;
    }
    var data19 = [
        {
            Id: "parent",
            Role: "Board",
            color: "#71AF17"
        },
        {
            Id: "6",
            Role: "Design Manager",
            Manager: "parent",
            ChartType: "right",
            color: "#1859B7"
        },
        {
            Id: "7",
            Role: "Design Supervisor",
            Manager: "6",
            color: "#2E95D8"
        },
        {
            Id: "8",
            Role: "Development Supervisor",
            Manager: "6",
            color: "#2E95D8"
        },
        {
            Id: "9",
            Role: "Drafting Supervisor",
            Manager: "6",
            color: "#2E95D8"
        },
        {
            Id: "10",
            Role: "Operations Manager",
            Manager: "parent",
            ChartType: "right",
            color: "#1859B7"
        },
        {
            Id: "11",
            Role: "Statistics Department",
            Manager: "10",
            color: "#2E95D8"
        },
        {
            Id: "12",
            Role: "Logistics Department",
            Manager: "10",
            color: "#2E95D8"
        },
        {
            Id: "16",
            Role: "Marketing Manager",
            Manager: "parent",
            ChartType: "right",
            color: "#1859B7"
        },
        {
            Id: "17",
            Role: "Overseas Sales Manager",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "18",
            Role: "Petroleum Manager",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "20",
            Role: "Service Department Manager",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "21",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "22",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "23",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "24",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "25",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "26",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "27",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "28",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "29",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "30",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "31",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "32",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        }, {
            Id: "33",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "34",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        }, {
            Id: "35",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "36",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
    ];
    var data17 = [
        {
            Id: "parent",
            Role: "Board",
            color: "#71AF17"
        },
        {
            Id: "6",
            Role: "Design Manager",
            Manager: "parent",
            ChartType: "right",
            color: "#1859B7"
        },
        {
            Id: "7",
            Role: "Design Supervisor",
            Manager: "6",
            color: "#2E95D8"
        },
        {
            Id: "8",
            Role: "Development Supervisor",
            Manager: "6",
            color: "#2E95D8"
        },
        {
            Id: "9",
            Role: "Drafting Supervisor",
            Manager: "6",
            color: "#2E95D8"
        },
        {
            Id: "10",
            Role: "Operations Manager",
            Manager: "parent",
            ChartType: "right",
            color: "#1859B7"
        },
        {
            Id: "11",
            Role: "Statistics Department",
            Manager: "10",
            color: "#2E95D8"
        },
        {
            Id: "12",
            Role: "Logistics Department",
            Manager: "10",
            color: "#2E95D8"
        },
        {
            Id: "16",
            Role: "Marketing Manager",
            Manager: "parent",
            ChartType: "right",
            color: "#1859B7"
        },
        {
            Id: "17",
            Role: "Overseas Sales Manager",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "18",
            Role: "Petroleum Manager",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "20",
            Role: "Service Department Manager",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "21",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "22",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "23",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "24",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "25",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "26",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "27",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "28",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "29",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "30",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "31",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "32",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        }, {
            Id: "33",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "34",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        }
    ];
    var data13 = [
        {
            Id: "parent",
            Role: "Board",
            color: "#71AF17"
        },
        {
            Id: "6",
            Role: "Design Manager",
            Manager: "parent",
            ChartType: "right",
            color: "#1859B7"
        },
        {
            Id: "7",
            Role: "Design Supervisor",
            Manager: "6",
            color: "#2E95D8"
        },
        {
            Id: "8",
            Role: "Development Supervisor",
            Manager: "6",
            color: "#2E95D8"
        },
        {
            Id: "9",
            Role: "Drafting Supervisor",
            Manager: "6",
            color: "#2E95D8"
        },
        {
            Id: "10",
            Role: "Operations Manager",
            Manager: "parent",
            ChartType: "right",
            color: "#1859B7"
        },
        {
            Id: "11",
            Role: "Statistics Department",
            Manager: "10",
            color: "#2E95D8"
        },
        {
            Id: "12",
            Role: "Logistics Department",
            Manager: "10",
            color: "#2E95D8"
        },
        {
            Id: "16",
            Role: "Marketing Manager",
            Manager: "parent",
            ChartType: "right",
            color: "#1859B7"
        },
        {
            Id: "17",
            Role: "Overseas Sales Manager",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "18",
            Role: "Petroleum Manager",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "20",
            Role: "Service Department Manager",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "21",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "22",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "23",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "24",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "25",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "26",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "27",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "28",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "29",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        },
        {
            Id: "30",
            Role: "Quality Control Department",
            Manager: "16",
            color: "#2E95D8"
        }
    ];
    //The below method used to define the common settings for connectors.
    function connectorDefaults(connector: any) {
        connector.type = 'Orthogonal';
        connector.targetDecorator = { shape: 'None' };
        return connector;
    }
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramdataMap' });
        document.body.appendChild(ele);

        var data11 = [
            {
                Id: "parent",
                Role: "Board",
                color: "#71AF17"
            },
            {
                Id: "16",
                Role: "Marketing Manager",
                Manager: "parent",
                ChartType: "right",
                color: "#1859B7"
            },
            {
                Id: "17",
                Role: "Overseas Sales Manager",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "18",
                Role: "Petroleum Manager",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "20",
                Role: "Service Department Manager",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "21",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "22",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "23",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "24",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "25",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "26",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "27",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
            {
                Id: "28",
                Role: "Quality Control Department",
                Manager: "16",
                color: "#2E95D8"
            },
        ];
        var items = new DataManager(data11, new Query().take(7));
        function nodeDefaultss(obj: any) {
            obj.backgroundColor = (obj.data).color;
            obj.style = { fill: "none", strokeColor: "none", color: "white" };
            obj.expandIcon = {
                height: 10,
                width: 10,
                shape: "None",
                fill: "lightgray",
                offset: { x: 0.5, y: 1 }
            };
            obj.expandIcon.verticalAlignment = "Center";
            obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
            obj.collapseIcon.offset = { x: 0.5, y: 1 };
            obj.collapseIcon.verticalAlignment = "Center";
            obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
            obj.collapseIcon.height = 10;
            obj.collapseIcon.width = 10;
            obj.collapseIcon.shape = "None";
            obj.collapseIcon.fill = "lightgray";
            obj.width = 120;
            obj.height = 30;
            return obj;
        }
        function connectorDefaultss(connector: any) {
            connector.targetDecorator.shape = "None";
            connector.type = "Orthogonal";
            connector.constraints = 0;
            connector.cornerRadius = 0;
            return connector;
        }

        diagram = new Diagram({
            width: '900px', height: '550px',
            layout: {
                type: "OrganizationalChart",
                getLayoutInfo: (node: any, options: any) => {
                    options.type = "Balanced";
                    options.orientation = "Horizontal";
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'Manager', dataSource: items,
                doBinding: (nodeModel: any, data: any, diagram: any) => {
                    nodeModel.shape = {
                        type: "Text",
                        content: (data).Role,
                        margin: { left: 10, right: 10, top: 10, bottom: 10 }
                    };
                },
            },
            getNodeDefaults: nodeDefaultss,
            getConnectorDefaults: connectorDefaultss
        });
        diagram.appendTo('#diagramdataMap');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Rendering with 11 child nodes', (done: Function) => {
        console.log("check values Rendering with 11 child nodes")
        expect(diagram.nodes[10].offsetX === 365 && diagram.nodes[10].offsetY === 395
            && diagram.nodes[11].offsetX === 535 && diagram.nodes[11].offsetY === 395
            && diagram.nodes[12].offsetX === 450 && diagram.nodes[12].offsetY === 475).toBe(true)
        done();
    });
    it('Rendering with 13 child nodes', (done: Function) => {
        console.log("check values Rendering with 13 child nodes")
        var items = new DataManager(data13, new Query().take(7));
        diagram.dataSourceSettings.dataSource = items;
        diagram.dataBind();
        expect(diagram.nodes[20].offsetX === 1045 && diagram.nodes[20].offsetY === 395
            && diagram.nodes[21].offsetX === 790 && diagram.nodes[21].offsetY === 475).toBe(true)
        done();
    });
    it('Rendering with 17 child nodes', (done: Function) => {
        console.log("check values Rendering with 17 child nodes")
        var items = new DataManager(data17, new Query().take(7));
        diagram.dataSourceSettings.dataSource = items;
        diagram.dataBind();
        expect(diagram.nodes[23].offsetX === 875 && diagram.nodes[23].offsetY === 475
            && diagram.nodes[24].offsetX === 1045 && diagram.nodes[24].offsetY === 475
            && diagram.nodes[25].offsetX === 790 && diagram.nodes[25].offsetY === 555).toBe(true)
        done();
    });
    it('Rendering with 19 child nodes', (done: Function) => {
        console.log("check values Rendering with 19 child nodes")
        var items = new DataManager(data19, new Query().take(7));
        diagram.dataSourceSettings.dataSource = items;
        diagram.dataBind();
        expect(diagram.nodes[25].offsetX === 705 && diagram.nodes[25].offsetY === 555
            && diagram.nodes[26].offsetX === 875 && diagram.nodes[26].offsetY === 555
            && diagram.nodes[27].offsetX === 790 && diagram.nodes[27].offsetY === 635).toBe(true)
        done();
    });
});
describe('EJ2-44231-Exception occurs while change the datasource for layout at runtime', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    var updated = [
        { id: 1, Label: 'updatedchild 1', color: "#71AF17" },
        { id: 2, Label: 'updatedchild 2', parentId: 1, color: "red" },
        { id: 3, Label: 'updatedGrandChild 1', parentId: 2, color: "#2E95D8" },
        { id: 4, Label: 'updatedGrandChild 2', parentId: 2, color: "#2E95D8" },
        { id: 5, Label: 'updatedChild 3', parentId: 1, color: "red" },
        { id: 6, Label: 'updatedGrandChild 3', parentId: 5, color: "#2E95D8" }
    ];
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramdataMap' });
        document.body.appendChild(ele);
        
        var data = [
            { id: 1, Label: 'child 1', color: "#71AF17" },
            { id: 2, Label: 'child 2', parentId: 1, color: "#1859B7" },
            { id: 3, Label: 'GrandChild 1', parentId: 2 , color: "#2E95D8"},
            { id: 4, Label: 'GrandChild 2', parentId: 2 , color: "#2E95D8"},
            { id: 5, Label: 'Child 3', parentId: 1, color: "#1859B7" },
            { id: 6, Label: 'GrandChild 3', parentId: 5, color: "#2E95D8" }
        ];
        
    var items = new DataManager(data, new Query().take(7));
    function nodeDefaultss(obj: any) {
        obj.width = 120;
        obj.height = 50;
        obj.backgroundColor = obj.data.color;
        obj.style = { fill: "none", strokeColor: "none", color: "white" };
        obj.annotations = [{ content: obj.data['Label'], style: { color: 'white' } }];
        obj.expandIcon = {
            shape: "Plus",
            width: 10,
            height: 10,
        };
        obj.collapseIcon = {
            shape: "Minus",
            width: 10,
            height: 10,
        };
        return obj;
    }
    function connectorDefaultss(connector: any) {
        connector.targetDecorator.shape = "None";
        connector.type = "Orthogonal";
        connector.constraints = 0;
        connector.cornerRadius = 0;
        return connector;
    }

        diagram = new Diagram({
                width: '900px', height: '550px',
                layout: {
                    type: "OrganizationalChart",
                    getLayoutInfo: function (node:any, options:any) {
                        if (!options.hasSubTree) {
                            options.orientation = "Horizontal";
                            options.type = "Center";
                        }
                    }
                },
                dataSourceSettings: { id: 'id', parentId: 'parentId', dataSource: items },
                getNodeDefaults: nodeDefaultss,
                getConnectorDefaults: connectorDefaultss
            });
        diagram.appendTo('#diagramdataMap');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Exception occurs while change the datasource for layout at runtime', (done: Function) => {
        let diagramCanvas: HTMLElement; 
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        let mouseEvents: MouseEvents = new MouseEvents();
        mouseEvents.mouseDownEvent(diagramCanvas, 384, 100);
        mouseEvents.mouseUpEvent(diagramCanvas, 384, 100);
        mouseEvents.mouseDownEvent(diagramCanvas, 384, 100);
        mouseEvents.mouseUpEvent(diagramCanvas, 384, 100);
        var items = new DataManager(updated, new Query().take(7));
        diagram.dataSourceSettings.dataSource=items;
        diagram.dataBind();
        expect(diagram.nodes[0].offsetX === 487.5&&diagram.nodes[0].offsetY === 75).toBe(true)
        done();
        });

});

describe('balanced layout at runtime not wroking properly', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    var updated = [
        { id: 1, Label: 'updatedchild 1', color: "#71AF17" },
        { id: 2, Label: 'updatedchild 2', parentId: 1, color: "red" },
        { id: 3, Label: 'updatedGrandChild 1', parentId: 2, color: "#2E95D8" },
        { id: 4, Label: 'updatedGrandChild 2', parentId: 2, color: "#2E95D8" },
        { id: 5, Label: 'updatedChild 3', parentId: 1, color: "red" },
        { id: 6, Label: 'updatedGrandChild 3', parentId: 5, color: "#2E95D8" }
    ];
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramdataMap' });
        document.body.appendChild(ele);
 

        diagram = new Diagram({
                width: '1250px', height: '590px', nodes:[{id:"node1",offsetX:500,offsetY:500}],
                snapSettings: { constraints: 0 },
                layout: {
                    enableAnimation: true,
                    type: 'OrganizationalChart', margin: { top: 20 },
                    getLayoutInfo: (node: Node, tree: TreeInfo) => {
                        if (!tree.hasSubTree) {
                            tree.orientation = 'Horizontal';
                            tree.type = 'Balanced';
                            tree.rows = 10
                        }
                    }
                   
                    }
            });
        diagram.appendTo('#diagramdataMap');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('balance layout at runtime', (done: Function) => {
        let diagramCanvas: HTMLElement; 
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        for(let g:number = 0; g <= 12; g++) {
        var Iid = diagram.nodes[diagram.nodes.length -1].id+"_1";
        diagram.add({id:Iid});
        diagram.add({sourceID: diagram.nodes[0].id, targetID:Iid});
    }
    diagram.doLayout();
    console.log("balance layout at runtime  "+diagram.nodes[12].offsetX+"   " + diagram.nodes[12].offsetY)
        expect(diagram.nodes[12].offsetX === 665 &&diagram.nodes[12].offsetY === 205).toBe(true)
        done();
        });

});


describe('balanced layout connectors segment length is not correct', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    var nodes = [
        {
            id: 'node',
        },
        {
            id: 'node1',
        },
        {
            id: 'node11',
        },
        {
            id: 'node111',
        },
        
        {
            id: 'node1111',
        },
        
    ];
    var connectors = [
        { sourceID: "node", targetID:"node1" },
        { sourceID: "node", targetID:"node11" },
        { sourceID: "node", targetID:"node111" },
        { sourceID: "node", targetID:"node1111" },

    ]
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramdataMap' });
        document.body.appendChild(ele);
 

        diagram = new Diagram({
            width:"100%",
            nodes:nodes,
            connectors:connectors,
            getConnectorDefaults: function (connector:any) {
                connector.type = "Orthogonal";
        connector.style.strokeColor = "#6d6d6d";
        return connector;
            },
            getNodeDefaults: function (obj:any) {
                obj.style = {
                  fill: "#659be5",
                  strokeColor: "none",
                  color: "white",
                  strokeWidth: 2
                };
                obj.borderColor = "#3a6eb5";
                obj.backgroundColor = "#659be5";
                (obj.shape).margin = { left: 5, right: 5, bottom: 5, top: 5 };
                obj.expandIcon = {
                  height: 10,
                  width: 10,
                  shape: "None",
                  fill: "lightgray",
                  offset: { x: 0.5, y: 1 }
                };
                obj.expandIcon.verticalAlignment = "Auto";
                obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                obj.collapseIcon.offset = { x: 0.5, y: 1 };
                obj.collapseIcon.verticalAlignment = "Auto";
                obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                obj.collapseIcon.height = 10;
                obj.collapseIcon.width = 10;
                obj.collapseIcon.padding.top = 5;
                obj.collapseIcon.shape = "None";
                obj.collapseIcon.fill = "lightgray";
                return obj;
              },
            layout:{
                type: "OrganizationalChart",
                orientation: "TopToBottom",
                getLayoutInfo: (node:any, options:any) => {
                  if (!options.hasSubTree) {
                    options.type = "Balanced";
                    options.orientation = "Horizontal";
                   options.rows = 4;
                   
                  }
                },
                enableAnimation: true
              },
              dataSourceSettings: {
                //sets the fields to bind
                id: "Name",
                parentId: "Category"
              },
            height:"400px",
            
        });
        diagram.appendTo('#diagramdataMap');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('balanced layout connectors segment length is not correct', (done: Function) => {
        var length = (diagram.connectors[2].segments[0] as OrthogonalSegmentModel).length
        expect(length === 7.5).toBe(true)
        done();
    });

});

describe('Node Expand & Collapse does not work properly issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramexpand' });
        document.body.appendChild(ele);
 

        let Data: any = [
            {
                key: '1',
                parentKey: null,
                name: 'Black Pluto',
            },
            {
                key: '2',
                parentKey: '1',
                name: 'Pluton Town Quick',
            },
            {
                key: '3',
                parentKey: '1',
                name: 'New Wind Duck',
            },
            {
                key: '4',
                parentKey: '1',
                name: 'King',
            },
            {
                key: '5',
                parentKey: '1',
                name: 'South Pluto',
            },
            {
                key: '6',
                parentKey: '1',
                name: 'Crazy',
            },
            {
                key: '7',
                parentKey: '1',
                name: 'Brick',
            },
            {
                key: '8',
                parentKey: '2',
                name: 'Wheel',
            },
            {
                key: '9',
                parentKey: '3',
                name: 'Concrete Centre',
            },
            {
                key: '10',
                parentKey: '3',
                name: 'Group Support Office',
            },
            {
                key: '11',
                parentKey: '3',
                name: 'Newcastle',
            },
            {
                key: '12',
                parentKey: '3',
                name: 'French',
            },
            {
                key: '13',
                parentKey: '3',
                name: 'French Airport',
            },
            {
                key: '14',
                parentKey: '3',
                name: 'Turkey',
            },
            {
                key: '15',
                parentKey: '4',
                name: 'Universe',
            },
            {
                key: '16',
                parentKey: '4',
                name: 'Gold Coast',
            },
            {
                key: '17',
                parentKey: '4',
                name: 'Island',
            },
            {
                key: '18',
                parentKey: '5',
                name: 'Hawaii',
            },
            {
                key: '19',
                parentKey: '5',
                name: 'Mount Gambier',
            },
            {
                key: '20',
                parentKey: '6',
                name: 'Hobart',
            },
            {
                key: '21',
                parentKey: '7',
                name: 'Geelong',
            },
            {
                key: '22',
                parentKey: '7',
                name: 'Melbourne',
            },
            {
                key: '23',
                parentKey: '7',
                name: 'Townsville',
            },
            {
                key: '24',
                parentKey: '8',
                name: 'Old and Client',
            },
            {
                key: '25',
                parentKey: '8',
                name: 'Support',
            },
            {
                key: '26',
                parentKey: '9',
                name: 'Concrete Centre',
            },
            {
                key: '27',
                parentKey: '10',
                name: 'Support',
            },
            {
                key: '28',
                parentKey: '12',
                name: 'Old and Customer',
            },
            {
                key: '29',
                parentKey: '13',
                name: 'Air Freight',
            },
            {
                key: '30',
                parentKey: '13',
                name: 'Export',
            },
            {
                key: '31',
                parentKey: '13',
                name: 'Operations',
            },
            {
                key: '32',
                parentKey: '13',
                name: 'Technical',
            },
            {
                key: '33',
                parentKey: '14',
                name: 'Old and Customer',
            },
            {
                key: '34',
                parentKey: '14',
                name: 'Support',
            },
            {
                key: '35',
                parentKey: '15',
                name: 'Old and Customer',
            },
            {
                key: '36',
                parentKey: '15',
                name: 'Support',
            },
            {
                key: '37',
                parentKey: '16',
                name: 'Old and Customer',
            },
            {
                key: '38',
                parentKey: '16',
                name: 'Support',
            },
            {
                key: '39',
                parentKey: '17',
                name: 'Old and Customer',
            },
            {
                key: '40',
                parentKey: '17',
                name: 'Support',
            },
            {
                key: '41',
                parentKey: '18',
                name: 'Old and Customer',
            },
            {
                key: '42',
                parentKey: '18',
                name: 'Support',
            },
            {
                key: '43',
                parentKey: '19',
                name: 'Old and Customer',
            },
            {
                key: '44',
                parentKey: '19',
                name: 'Support',
            },
            {
                key: '45',
                parentKey: '20',
                name: 'Old and Customer',
            },
            {
                key: '46',
                parentKey: '20',
                name: 'Support',
            },
            {
                key: '47',
                parentKey: '21',
                name: 'Old and Customer',
            },
            {
                key: '48',
                parentKey: '21',
                name: 'Support',
            },
            {
                key: '49',
                parentKey: '22',
                name: 'Old and Customer',
            },
            {
                key: '50',
                parentKey: '22',
                name: 'Support',
            },
            {
                key: '51',
                parentKey: '23',
                name: 'Old and Customer',
            },
            {
                key: '52',
                parentKey: '23',
                name: 'Support',
            },
            {
                key: '53',
                parentKey: '24',
                name: 'North',
            },
            {
                key: '54',
                parentKey: '24',
                name: 'Group',
            },
            {
                key: '55',
                parentKey: '24',
                name: 'Maniside',
            },
            {
                key: '56',
                parentKey: '25',
                name: 'Jack',
            },
            {
                key: '57',
                parentKey: '26',
                name: 'Logistics',
            },
            {
                key: '58',
                parentKey: '27',
                name: 'Jack',
            },
            {
                key: '59',
                parentKey: '27',
                name: 'Computer Operations',
            },
            {
                key: '60',
                parentKey: '27',
                name: 'Employee Relations',
            },
            {
                key: '61',
                parentKey: '27',
                name: 'Finance',
            },
            {
                key: '62',
                parentKey: '27',
                name: 'Vicky',
            },
            {
                key: '63',
                parentKey: '27',
                name: 'Marketing',
            },
            {
                key: '64',
                parentKey: '27',
                name: 'Free Health',
            },
            {
                key: '65',
                parentKey: '27',
                name: 'Accounting',
            },
            {
                key: '66',
                parentKey: '28',
                name: 'Customer liason',
            },
            {
                key: '67',
                parentKey: '28',
                name: 'Customer Services',
            },
            {
                key: '68',
                parentKey: '28',
                name: 'North',
            },
            {
                key: '69',
                parentKey: '28',
                name: 'Group',
            },
            {
                key: '70',
                parentKey: '28',
                name: 'Maniside',
            },
            {
                key: '71',
                parentKey: '29',
                name: 'Air Crew',
            },
            {
                key: '72',
                parentKey: '29',
                name: 'Drink',
            },
            {
                key: '73',
                parentKey: '30',
                name: 'Area Vicky',
            },
            {
                key: '74',
                parentKey: '30',
                name: 'Origin Supervision',
            },
            {
                key: '75',
                parentKey: '31',
                name: 'Layer Handling',
            },
            {
                key: '76',
                parentKey: '31',
                name: 'Checkin',
            },
            {
                key: '77',
                parentKey: '31',
                name: 'Ground Control',
            },
            {
                key: '78',
                parentKey: '31',
                name: 'Operations',
            },
            {
                key: '79',
                parentKey: '32',
                name: 'Engineering',
            },
            {
                key: '80',
                parentKey: '32',
                name: 'Laboratory',
            },
            {
                key: '81',
                parentKey: '32',
                name: 'Maintenance',
            },
            {
                key: '82',
                parentKey: '32',
                name: 'Projects',
            },
            {
                key: '83',
                parentKey: '33',
                name: 'North',
            },
            {
                key: '84',
                parentKey: '33',
                name: 'Group',
            },
            {
                key: '85',
                parentKey: '33',
                name: 'Maniside',
            },
            {
                key: '86',
                parentKey: '34',
                name: 'Jack',
            },
            {
                key: '87',
                parentKey: '35',
                name: 'North',
            },
            {
                key: '88',
                parentKey: '35',
                name: 'Group',
            },
            {
                key: '89',
                parentKey: '35',
                name: 'Maniside',
            },
            {
                key: '90',
                parentKey: '36',
                name: 'Jack',
            },
            {
                key: '91',
                parentKey: '36',
                name: 'Vicky',
            },
            {
                key: '92',
                parentKey: '36',
                name: 'Marketing',
            },
            {
                key: '93',
                parentKey: '37',
                name: 'North',
            },
            {
                key: '94',
                parentKey: '37',
                name: 'Group',
            },
            {
                key: '95',
                parentKey: '37',
                name: 'Maniside',
            },
            {
                key: '96',
                parentKey: '38',
                name: 'Jack',
            },
            {
                key: '97',
                parentKey: '39',
                name: 'North',
            },
            {
                key: '98',
                parentKey: '39',
                name: 'Group',
            },
            {
                key: '99',
                parentKey: '39',
                name: 'Maniside',
            },
            {
                key: '100',
                parentKey: '40',
                name: 'Jack',
            },
            {
                key: '101',
                parentKey: '41',
                name: 'North',
            },
            {
                key: '102',
                parentKey: '41',
                name: 'Group',
            },
            {
                key: '103',
                parentKey: '41',
                name: 'Maniside',
            },
            {
                key: '104',
                parentKey: '42',
                name: 'Jack',
            },
            {
                key: '105',
                parentKey: '43',
                name: 'North',
            },
            {
                key: '106',
                parentKey: '43',
                name: 'Group',
            },
            {
                key: '107',
                parentKey: '43',
                name: 'Maniside',
            },
            {
                key: '108',
                parentKey: '44',
                name: 'Jack',
            },
            {
                key: '109',
                parentKey: '45',
                name: 'North',
            },
            {
                key: '110',
                parentKey: '45',
                name: 'Group',
            },
            {
                key: '111',
                parentKey: '45',
                name: 'Maniside',
            },
            {
                key: '112',
                parentKey: '46',
                name: 'Jack',
            },
            {
                key: '113',
                parentKey: '47',
                name: 'North',
            },
            {
                key: '114',
                parentKey: '47',
                name: 'Group',
            },
            {
                key: '115',
                parentKey: '47',
                name: 'Maniside',
            },
            {
                key: '116',
                parentKey: '48',
                name: 'Jack',
            },
            {
                key: '117',
                parentKey: '49',
                name: 'North',
            },
            {
                key: '118',
                parentKey: '49',
                name: 'Group',
            },
            {
                key: '119',
                parentKey: '49',
                name: 'Maniside',
            },
            {
                key: '120',
                parentKey: '50',
                name: 'Jack',
            },
            {
                key: '121',
                parentKey: '50',
                name: 'Vicky',
            },
            {
                key: '122',
                parentKey: '50',
                name: 'Marketing',
            },
            {
                key: '123',
                parentKey: '51',
                name: 'North',
            },
            {
                key: '124',
                parentKey: '51',
                name: 'Group',
            },
            {
                key: '125',
                parentKey: '51',
                name: 'Maniside',
            },
            {
                key: '126',
                parentKey: '52',
                name: 'Jack',
            },
        ];
        
        let items: DataManager = new DataManager(Data as JSON[], new Query().take(7));
        
        diagram = new Diagram({
            width: '100%', height: '550px',
            layout: {
                type: 'OrganizationalChart',
                verticalSpacing: 30,
                horizontalSpacing: 40,
                enableAnimation: false,
                getLayoutInfo: (_: NodeModel, options: TreeInfo) => {
                    options.type = 'Center';
                    options.orientation = 'Horizontal';
                },
            },
            dataSourceSettings: {
                id: 'key',
                parentId: 'parentKey', dataSource: items,
                //binds the data with the nodes
                doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
                    nodeModel.annotations = [
                        {
                            content: (data as any).name,
                        },
                    ];
                },
            },
            getNodeDefaults: (obj: Node) => {
                obj.width = 120;
                obj.height = 60;
                obj.expandIcon = {
                    height: 10,
                    width: 10,
                    shape: 'Minus',
                    fill: 'lightgray',
                    offset: { x: 0.5, y: 1 },
                };
                obj.collapseIcon = {
                    height: 10,
                    width: 10,
                    shape: 'Plus',
                    fill: 'lightgray',
                    offset: { x: 0.5, y: 1 },
                };
                obj.isExpanded = true;
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        
        diagram.appendTo('#diagramexpand');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether Child nodes get expand properly after expand and collapse', (done: Function) => {
        diagram.nodes[0].isExpanded = false;
        diagram.dataBind();
        let node: NodeModel = diagram.nodes[diagram.nodes.length - 1];
        expect(node.visible === false).toBe(true);
        diagram.nodes[0].isExpanded = true;
        diagram.dataBind();
        expect(node.visible === true).toBe(true);
        done();
    });

});

describe('877226 - Nodes overlapped while changing isExpanded property with Layout Animation', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramexpand' });
        document.body.appendChild(ele);


        let localBindData: object[] = [
            {
                "Id": "parent",
                "Role": "Board",
                "color": "#71AF17"
            },
            {
                "Id": "1",
                "Role": "General Manager",
                "Manager": "parent",
                "ChartType": "right",
                "color": "#71AF17"
            },
            {
                "Id": "2",
                "Role": "Human Resource Manager",
                "Manager": "6",
                "ChartType": "right",
                "color": "#1859B7"
            },

            {
                "Id": "4",
                "Role": "Recruiting Team",
                "Manager": "2",
                "color": "#2E95D8"
            },
            {
                "Id": "5",
                "Role": "Finance Asst. Manager",
                "Manager": "2",
                "color": "#2E95D8"
            },
            {
                "Id": "6",
                "Role": "Design Manager",
                "Manager": "1",
                "ChartType": "right",
                "color": "#1859B7"
            },
            {
                "Id": "7",
                "Role": "Design Supervisor",
                "Manager": "6",
                "color": "#2E95D8"
            },
            {
                "Id": "77",
                "Role": "Design Editor",
                "Manager": "7",
                "color": "#2E95D8"
            },
            {
                "Id": "8",
                "Role": "Development Supervisor",
                "Manager": "6",
                "color": "#2E95D8"
            },

            {
                "Id": "10",
                "Role": "Operations Manager",
                "Manager": "1",
                "ChartType": "right",
                "color": "#1859B7"
            },
            {
                "Id": "11",
                "Role": "Statistics Department",
                "Manager": "10",
                "color": "#2E95D8"
            },
            {
                "Id": "12",
                "Role": "Logistics Department",
                "Manager": "10",
                "color": "#2E95D8"
            },
            {
                "Id": "16",
                "Role": "Marketing Manager",
                "Manager": "1",
                "ChartType": "right",
                "color": "#1859B7"
            },

            {
                "Id": "18",
                "Role": "Petroleum Manager",
                "Manager": "16",
                "color": "#2E95D8"
            },
            {
                "Id": "20",
                "Role": "Service Department Manager",
                "Manager": "18",
                "color": "#2E95D8"
            },
            {
                "Id": "21",
                "Role": "Quality Control Department",
                "Manager": "18",
                "color": "#2E95D8"
            }
        ];

        let items: DataManager = new DataManager(localBindData as JSON[], new Query().take(25));

        diagram = new Diagram({
            width: '100%', height: 1000,
            selectionChange: function (args: ISelectionChangeEventArgs) {
                const nodes: NodeModel[] = diagram.nodes as NodeModel[];
                if(args.state === 'Changed' && args.newValue.length > 0){
                    collapseNodes();
                }
            },
            layout: {
                type: 'OrganizationalChart',
                getLayoutInfo: (node: Node, options: TreeInfo) => {
                    options.orientation = 'Horizontal';
                     options.type = 'Center';
                },

             },
            dataSourceSettings: {
                id: 'Id', parentId: 'Manager', dataSource: items,
                doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
                    nodeModel.shape = {
                        type: 'Basic',

                        margin: { left: 10, right: 10, top: 10, bottom: 10 },
                        cornerRadius:20
                    };
                }
            },
            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.annotations=[{content: (obj.data as any).Role}],
                obj.style = { strokeColor: 'lightgreen', color: 'lightgreen',strokeWidth:2 };
                obj.expandIcon = { height: 15, width: 15, shape: 'Minus', fill: 'lightgray', offset: { x: .5, y: 1 } };
                obj.collapseIcon = { height:15, width: 15, shape: 'Plus', fill: 'lightgray', offset: { x: .5, y: 1 } };

                obj.width = 120;
                obj.height = 60;
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.style={fill:"lightgreen",strokeColor:"lightgreen"}
                connector.type = 'Orthogonal';
                connector.style = {fill:"lightgreen",strokeColor:"lightgreen",strokeWidth:2};
                connector.cornerRadius = 0;
                return connector;
            },
        });

        diagram.appendTo('#diagramexpand');
    });
    function  collapseNodes() {
        let selectedNode = diagram.selectedItems.nodes[0];
            findSibling(selectedNode);
      }

      function findSibling(selectedNode:any){
        let nodes: NodeModel[] = diagram.nodes;
        let siblingNodes = nodes.filter(
            (obj) => (obj as any).data.Manager === selectedNode.data.Manager
          );
        for(let i=0;i<siblingNodes.length;i++){
            let sibNode = siblingNodes[i];
            if (sibNode.isExpanded) {
                sibNode.isExpanded = false;
                diagram.dataBind();
            }
        }
      }
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking collapse of single node with layout animation', (done: Function) => {
        let diagramCanvas = document.getElementById(diagram.element.id + 'content');
        let designNode = diagram.nodes.find((node) => (node as any).data.Role === 'Design Manager');
        designNode.isExpanded = false;
        diagram.dataBind();
        let designChild = diagram.nodes.find((node) => (node as any).data.Manager === '6');
        console.log(designChild.visible);
        expect(designChild.visible).toBe(false);
        designNode.isExpanded = true;
        diagram.dataBind();
        console.log(designChild.visible);
        expect(designChild.visible).toBe(true);
        done();
    });
    it('Checking collapse of multiple nodes with layout animation', (done: Function) => {
        let designNode = diagram.nodes.find((node) => (node as any).data.Role === 'Design Manager');
        diagram.select([designNode]);
        let designChild = diagram.nodes.find((node) => (node as any).data.Manager === '6');
        let operationChild = diagram.nodes.find((node) => (node as any).data.Manager === '10');
        let marketChild = diagram.nodes.find((node) => (node as any).data.Manager === '16');
        expect(designChild.visible === false && marketChild.visible === false && operationChild.visible === false).toBe(true);
        for(let i=0;i<diagram.nodes.length;i++){
            diagram.nodes[i].isExpanded = true;
            diagram.dataBind();
        }
        expect(designChild.visible === true && marketChild.visible === true && operationChild.visible === true).toBe(true);
        done();
    });
    it('Checking collapse of level 4 node with layout animation', (done: Function) => {
        let designSupervisorNode = diagram.nodes.find((node) => (node as any).data.Role === 'Design Supervisor');
        diagram.select([designSupervisorNode]);
        let designSupervisorChild = diagram.nodes.find((node) => (node as any).data.Manager === '7');
        let hrChild = diagram.nodes.find((node) => (node as any).data.Manager === '2');
        expect(designSupervisorChild.visible === false && hrChild.visible === false).toBe(true);
        for(let i=0;i<diagram.nodes.length;i++){
            diagram.nodes[i].isExpanded = true;
            diagram.dataBind();
        }
        expect(designSupervisorChild.visible === true && hrChild.visible === true).toBe(true);
        done();
    });
    describe('832886 - Rendering the Layout Child Data without Considering Case Sensitivity', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'casesensitivity' });
            document.body.appendChild(ele);
            let data: object[] = [
                {
                    'Id': 'Parent1', 'Name': 'Maria Anders', 'Designation': 'Managing Director', 'IsExpand': 'true', 'RatingColor': '#C34444'
                },
                {
                    'Id': 1, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager', 'IsExpand': 'false',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 'parent1'
                },
                {
                    'Id': 2, 'Name': 'Anto Moreno', 'Designation': 'Project Lead', 'IsExpand': 'false',
                    'RatingColor': '#93B85A', 'ReportingPerson': 1
                },
                {
                    'Id': 3, 'Name': 'Thomas Hardy', 'Designation': 'Senior S/w Engg', 'IsExpand': 'false',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 2
                },
                {
                    'Id': 4, 'Name': 'Christina kaff', 'Designation': 'S/w Engg', 'IsExpand': 'false',
                    'RatingColor': '#93B85A', 'ReportingPerson': 3
                },
                {
                    'Id': 5, 'Name': 'Hanna Moos', 'Designation': 'Project Trainee', 'IsExpand': 'true',
                    'RatingColor': '#D46E89', 'ReportingPerson': 4
                },
                {
                    'Id': 6, 'Name': 'Peter Citeaux', 'Designation': 'Project Trainee', 'IsExpand': 'true',
                    'RatingColor': '#68C2DE', 'ReportingPerson': 4
                },
                {
                    'Id': 7, 'Name': 'Martín Kloss', 'Designation': 'Senior S/w Engg', 'IsExpand': 'false',
                    'RatingColor': '#93B85A', 'ReportingPerson': 1
                },
                {
                    'Id': 9, 'Name': 'Elizabeth Mary', 'Designation': 'Project Trainee', 'IsExpand': 'None',
                    'RatingColor': '#93B85A', 'ReportingPerson': 'PARENT1'
                },
                {
                    'Id': 10, 'Name': 'Victoria Ash', 'Designation': 'Project Trainee', 'IsExpand': 'None',
                    'RatingColor': '#D46E89', 'ReportingPerson': 'pArEnT1'
                },
            ];
            let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
            diagram = new Diagram({
                width: '1250px', height: '590px',
                snapSettings: { constraints: 0 },
                layout: {
                    type: 'OrganizationalChart', margin: { top: 20 },
                    getLayoutInfo: (node: Node, tree: TreeInfo) => {
                        if (!tree.hasSubTree) {
                            tree.orientation = 'Vertical';
                            tree.type = 'Alternate';
                        }
                    }
                },
                dataSourceSettings: {
                    id: 'Id', parentId: 'ReportingPerson', dataSource: items
                },
                getNodeDefaults: (obj: Node, diagram: Diagram) => {
                    obj.height = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.targetDecorator.shape = 'None';
                    connector.type = 'Orthogonal';
                    return connector;
                },
            });
            diagram.appendTo('#casesensitivity');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Rendering the Layout Child Data without Considering Case Sensitivity', (done: Function) => {
            expect(diagram.nodes.length === 10).toBe(true);
            done();
        });
    });
});
