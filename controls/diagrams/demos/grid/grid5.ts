import {
    Diagram, ColumnDefinition, RowDefinition, GridPanel, DiagramElement
} from '../../src/diagram/index';

/**
 * Grid Panel with Row span and column span
 */

let grid: GridPanel = new GridPanel();
grid.offsetX = 300;
grid.offsetY = 200;
grid.width = 900;
grid.height = 300;
// grid.style.fill = 'wheat';
grid.cellStyle.fill = 'none';
grid.cellStyle.strokeColor = 'none';
let rowDefns: RowDefinition[] = [];
let rowDefn1: RowDefinition = new RowDefinition();
rowDefn1.height = 50;
rowDefns.push(rowDefn1);

let rowDefn2: RowDefinition = new RowDefinition();
rowDefn2.height = 50;
rowDefns.push(rowDefn2);

let rowDefn3: RowDefinition = new RowDefinition();
rowDefn3.height = 50;
rowDefns.push(rowDefn3);

let rowDefn4: RowDefinition = new RowDefinition();
rowDefn4.height = 50;
rowDefns.push(rowDefn4);

let rowDefn5: RowDefinition = new RowDefinition();
rowDefn5.height = 50;
rowDefns.push(rowDefn5);

let colDefns: ColumnDefinition[] = [];
let colDefn: ColumnDefinition = new ColumnDefinition();
colDefn.width = 200;
colDefns.push(colDefn);

let colDefn2: ColumnDefinition = new ColumnDefinition();
colDefn2.width = 200;
colDefns.push(colDefn2);

let colDefn3: ColumnDefinition = new ColumnDefinition();
colDefn3.width = 200;
colDefns.push(colDefn3);

let colDefn4: ColumnDefinition = new ColumnDefinition();
colDefn4.width = 200;
colDefns.push(colDefn4);

grid.setDefinitions(rowDefns, colDefns);

let child00: DiagramElement = new DiagramElement();
child00.id = 'child00';
grid.addObject(child00, 0, 0, 3);

let child03: DiagramElement = new DiagramElement();
child03.id = 'child03';
grid.addObject(child03, 0, 3);

let child10: DiagramElement = new DiagramElement();
child10.id = 'child10';
grid.addObject(child10, 1, 0);

let child11: DiagramElement = new DiagramElement();
child11.id = 'child11';
grid.addObject(child11, 1, 1);

let child12: DiagramElement = new DiagramElement();
child12.id = 'child12';
grid.addObject(child12, 1, 2);

let child13: DiagramElement = new DiagramElement();
child13.id = 'child13';
grid.addObject(child13, 1, 3);

let child20: DiagramElement = new DiagramElement();
child20.id = 'child20';
grid.addObject(child20, 2, 0, 1, 2);

let child21: DiagramElement = new DiagramElement();
child21.id = 'child21';
grid.addObject(child21, 2, 1);

let child22: DiagramElement = new DiagramElement();
child22.id = 'child22';
grid.addObject(child22, 2, 2);

let child23: DiagramElement = new DiagramElement();
child23.id = 'child23';
grid.addObject(child23, 2, 3);

let child31: DiagramElement = new DiagramElement();
child31.id = 'child31';
grid.addObject(child31, 3, 1);

let child32: DiagramElement = new DiagramElement();
child32.id = 'child32';
grid.addObject(child32, 3, 2);

let child33: DiagramElement = new DiagramElement();
child33.id = 'child33';
grid.addObject(child33, 3, 3);

let child40: DiagramElement = new DiagramElement();
child40.id = 'child40';
grid.addObject(child40, 4, 0);

let child41: DiagramElement = new DiagramElement();
child41.id = 'child41';
grid.addObject(child41, 4, 1);

let child42: DiagramElement = new DiagramElement();
child42.id = 'child42';
grid.addObject(child42, 4, 2);

let child43: DiagramElement = new DiagramElement();
child43.id = 'child43';
grid.addObject(child43, 4, 3);

let node1: DiagramElement = new DiagramElement();
node1.width = 100;
node1.height = 100;
node1.margin.left = 30;
node1.margin.top = 15;
node1.style.fill = 'red';
grid.addObject(node1, 1, 1);

let node2: DiagramElement = new DiagramElement();
node2.width = 100;
node2.height = 100;
node2.margin.left = 30;
node2.margin.top = 15;
node2.style.fill = 'blue';
grid.addObject(node2, 2, 1);

let diagram: Diagram = new Diagram({ width: "850px", height: "2000px",  basicElements: [grid] });
diagram.appendTo('#diagram');

document.getElementById('rowHeight').onclick = function () {
    grid.updateRowHeight(1, 240);
    diagram.updateGridContainer(grid);
}

document.getElementById('columnWidth').onclick = function () {
    grid.updateColumnWidth(1, 240);
    diagram.updateGridContainer(grid);
}
