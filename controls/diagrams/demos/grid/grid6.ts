import {
    Diagram, ColumnDefinition, RowDefinition, GridPanel, DiagramElement, Size
} from '../../src/diagram/index';

/**
 * Grid Panel with Row span and column span
 */

let grid: GridPanel = new GridPanel();
grid.offsetX = 300;
grid.offsetY = 200;
grid.cellStyle.fill = 'none';
grid.cellStyle.strokeColor = 'none';
let rowDefns: RowDefinition[] = [];
let rowDefn1: RowDefinition = new RowDefinition();
rowDefn1.height = 50;
rowDefns.push(rowDefn1);

let rowDefn2: RowDefinition = new RowDefinition();
rowDefn2.height = 50;
rowDefns.push(rowDefn2);

let colDefns: ColumnDefinition[] = [];
let colDefn: ColumnDefinition = new ColumnDefinition();
colDefn.width = 100;
colDefns.push(colDefn);

let colDefn2: ColumnDefinition = new ColumnDefinition();
colDefn2.width = 100;
colDefns.push(colDefn2);

grid.setDefinitions(rowDefns, colDefns);

let child00: DiagramElement = new DiagramElement();
child00.id = 'child00';
grid.addObject(child00, 0, 0);

let child01: DiagramElement = new DiagramElement();
child01.id = 'child01';
grid.addObject(child01, 0, 1);

let child10: DiagramElement = new DiagramElement();
child10.id = 'child10';
grid.addObject(child10, 1, 0);

let child11: DiagramElement = new DiagramElement();
child11.id = 'child11';
grid.addObject(child11, 1, 1);

let diagram: Diagram = new Diagram({ width: "850px", height: "2000px", basicElements: [grid] });
diagram.appendTo('#diagram');


document.getElementById('AddRow').onclick = function () {
    var rowDefns = [];
    var rowDefn1 = new RowDefinition();
    rowDefn1.height = 100;
    rowDefns.push(rowDefn1);
    grid.addRow(0, rowDefns);
    var child10 = new DiagramElement();
    child10.id = 'child20';
    grid.addObject(child10, 0, 0);
    var child11 = new DiagramElement();
    child11.id = 'child21';
    grid.addObject(child11, 0, 1);
    grid.measure(new Size(grid.width, grid.height));
    grid.arrange(grid.desiredSize);
    diagram.updateGridContainer(grid);
}

document.getElementById('AddColumn').onclick = function () {
    var colDefns = [];
    var colDefn = new ColumnDefinition();
    colDefn.width = 100;
    colDefns.push(colDefn);
    grid.addColumn(0, colDefns);
    var child10 = new DiagramElement();
    child10.id = 'newchild20';
    grid.addObject(child10, 0, 0);
    var child11 = new DiagramElement();
    child11.id = 'newchild21';
    grid.addObject(child11, 1, 0);
    grid.measure(new Size(grid.width, grid.height));
    grid.arrange(grid.desiredSize);
    diagram.updateGridContainer(grid);
}

document.getElementById('removeRow').onclick = function () {
    grid.removeRow(1);
    diagram.updateGridContainer(grid);
}

document.getElementById('removeColumn').onclick = function () {
    grid.removeColumn(1);
    diagram.updateGridContainer(grid);
}

document.getElementById('changeRowOrder').onclick = function () {
    grid.updateRowIndex(1, 0);
    diagram.updateGridContainer(grid);
}