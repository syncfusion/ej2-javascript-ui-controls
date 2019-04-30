import {
    Diagram, ColumnDefinition, RowDefinition, GridPanel, DiagramElement
} from '../../src/diagram/index';

/**
 * Swimlane structure
 */

let grid: GridPanel = new GridPanel();
grid.offsetX = 300;
grid.offsetY = 200;
// grid.width = 300;
// grid.height = 250;
grid.style.fill = 'red';
grid.cellStyle.fill = "none";
grid.cellStyle.strokeColor = "none";
let rowDefns: RowDefinition[] = [];
let rowDefn1: RowDefinition = new RowDefinition();
rowDefn1.height = 25;
rowDefns.push(rowDefn1);

let rowDefn2: RowDefinition = new RowDefinition();
rowDefn2.height = 100;
rowDefns.push(rowDefn2);
let rowDefn3: RowDefinition = new RowDefinition();
rowDefn3.height = 100;
rowDefns.push(rowDefn3);
let colDefns: ColumnDefinition[] = [];
let colDefn: ColumnDefinition = new ColumnDefinition();
colDefn.width = 25;
colDefns.push(colDefn);

let colDefn2: ColumnDefinition = new ColumnDefinition();
colDefn2.width = 200;
colDefns.push(colDefn2);

grid.setDefinitions(rowDefns, colDefns);

let swimlaneHeader: DiagramElement = new DiagramElement();
grid.addObject(swimlaneHeader, 0, 0, 2);

let laneheader1: DiagramElement = new DiagramElement();
// laneheader1.width = 100;
// laneheader1.height = 25;
// laneheader1.rotateAngle = 270;
grid.addObject(laneheader1, 1, 0);

let lane1: DiagramElement = new DiagramElement();
//lane1.width = 275;
//lane1.height = 100;
grid.addObject(lane1, 1, 1);

let laneheader2: DiagramElement = new DiagramElement();
laneheader2.width = 100;
laneheader2.height = 25;
laneheader2.rotateAngle = 270;
grid.addObject(laneheader2, 2, 0);

let lane2: DiagramElement = new DiagramElement();
//lane1.width = 275;
//lane1.height = 100;
grid.addObject(lane2, 2, 1);

let node: DiagramElement = new DiagramElement();
node.width = 100;
node.height = 100;
node.margin.left = 300;
node.margin.top = 150;
grid.addObject(node, 1, 1);

let diagram: Diagram = new Diagram({ width: 1000, height: 1000, basicElements: [grid] });
diagram.appendTo('#diagram');