import {
    Diagram, ColumnDefinition, RowDefinition, GridPanel
} from '../../src/diagram/index';

/**
 * Grid panel with two rows and two columns
 */

let grid: GridPanel = new GridPanel();
grid.offsetX = 300;
grid.offsetY = 200;
// grid.width = 100;
// grid.height = 100;
grid.style.fill = 'blue';
//Row Definition
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
colDefn2.width = 200;
colDefns.push(colDefn2);

grid.setDefinitions(rowDefns, colDefns);
let diagram: Diagram = new Diagram({ width: 1000, height: 1000, basicElements: [grid] });
diagram.appendTo('#diagram');