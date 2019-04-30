/**
 * Test cases for grid panel
 */

import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { GridPanel, RowDefinition, ColumnDefinition } from '../../../src/diagram/core/containers/grid';
import { Margin } from '../../../src/diagram/core/appearance';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { Selector } from '../../../src/diagram/interaction/selector';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';

function resize(diagram: Diagram, direction: string): void {
    if ((diagram.selectedItems as Selector).nodes.length) {
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        let element: HTMLElement = document.getElementById('borderRect');
        let mouseEvents: MouseEvents = new MouseEvents();
        let x: number; let y: number;
        switch (direction) {
            case 'resizeSouth':
                x = Number(element.getAttribute('x')) + Number(element.getAttribute('width')) / 2;
                y = Number(element.getAttribute('y')) + Number(element.getAttribute('height'));
                break;
            case 'resizeEast':
                x = Number(element.getAttribute('x')) + Number(element.getAttribute('width'));
                y = Number(element.getAttribute('y')) + Number(element.getAttribute('height')) / 2;
                break;
            case 'resizeNorth':
                x = Number(element.getAttribute('x')) + Number(element.getAttribute('width')) / 2;
                y = Number(element.getAttribute('y'));
                break;
            case 'resizeWest':
                x = Number(element.getAttribute('x'));
                y = Number(element.getAttribute('y')) + Number(element.getAttribute('height')) / 2;
                break;
        }
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    }
}

describe('Diagram Control', () => {
    describe('Simple Grid panel without rows and columns', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram16' });
            document.body.appendChild(ele);
            let grid: GridPanel = new GridPanel();
            grid.offsetX = 300;
            grid.offsetY = 200;
            grid.width = 100;
            grid.height = 100;
            grid.style.fill = 'red';
            diagram = new Diagram({ width: 1000, height: 1000, basicElements: [grid] });
            diagram.appendTo('#diagram16');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking grid panel without rows and columns', (done: Function) => {
            expect(diagram.basicElements[0].actualSize.width == 100 && diagram.basicElements[0].actualSize.height == 100).toBe(true);
            done();
        });
    });

    describe('Grid panel with row and without column', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram17' });
            document.body.appendChild(ele);
            let grid: GridPanel = new GridPanel();
            grid.offsetX = 300;
            grid.offsetY = 200;
            grid.width = 100;
            grid.height = 100;
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
            /* let colDefn: ColumnDefinition = new ColumnDefinition();
             colDefn.width = 100;
             colDefns.push(colDefn);
             let colDefn2: ColumnDefinition = new ColumnDefinition();
             colDefn2.width = 200;
             colDefns.push(colDefn2);*/

            grid.setDefinitions(rowDefns, colDefns);

            diagram = new Diagram({ width: 1000, height: 1000, basicElements: [grid] });
            diagram.appendTo('#diagram17');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking grid panel without rows and columns', (done: Function) => {
            expect(diagram.basicElements[0].actualSize.width == 100 && diagram.basicElements[0].actualSize.height == 100).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children.length == 2)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[0].bounds.x == 250 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.y == 150 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.width == 100 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.height == 50)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[1].bounds.x == 250 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.y == 200 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.width == 100 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.height == 50)).toBe(true);
            done();
        });
    });

    describe('Grid panel with two rows and two columns', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram18' });
            document.body.appendChild(ele);
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
            diagram = new Diagram({ width: 1000, height: 1000, basicElements: [grid] });
            diagram.appendTo('#diagram18');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking grid panel without rows and columns', (done: Function) => {
            expect(diagram.basicElements[0].actualSize.width == 300 && diagram.basicElements[0].actualSize.height == 100).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children.length == 4)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[0].bounds.x == 150 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.y == 150 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.width == 100 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.height == 50)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[1].bounds.x == 250 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.y == 150 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.height == 50)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[2].bounds.x == 150 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.y == 200 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.width == 100 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.height == 50)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[3].bounds.x == 250 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.y == 200 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.height == 50)).toBe(true);
            done();
        });
    });

    describe('Grid Panel with row span', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram20' });
            document.body.appendChild(ele);
            let grid: GridPanel = new GridPanel();
            grid.offsetX = 300;
            grid.offsetY = 200;
            // grid.width = 100;
            // grid.height = 100;
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

            let colDefns: ColumnDefinition[] = [];
            let colDefn: ColumnDefinition = new ColumnDefinition();
            colDefn.width = 200;
            colDefns.push(colDefn);

            let colDefn2: ColumnDefinition = new ColumnDefinition();
            colDefn2.width = 200;
            colDefns.push(colDefn2);

            grid.setDefinitions(rowDefns, colDefns);

            let child1: DiagramElement = new DiagramElement();
            //  child1.margin = new Margin(0, 0, 0, 0);
            grid.addObject(child1, 0, 0, 2);

            let child2: DiagramElement = new DiagramElement();
            grid.addObject(child2, 1, 1);

            let child3: DiagramElement = new DiagramElement();
            grid.addObject(child3, 1, 1);

            diagram = new Diagram({ width: 1000, height: 1000, basicElements: [grid] });
            diagram.appendTo('#diagram20');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking grid panel without rows and columns', (done: Function) => {
            expect(diagram.basicElements[0].actualSize.width == 400 && diagram.basicElements[0].actualSize.height == 100).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children.length == 3)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[0].bounds.x == 100 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.y == 150 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.height == 100 &&
                ((diagram.basicElements[0] as GridPanel).children[0] as Canvas).children.length == 1)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[1].bounds.x == 300 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.y == 150 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.height == 50)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[2].bounds.x == 300 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.y == 200 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.height == 50 &&
                ((diagram.basicElements[0] as GridPanel).children[2] as Canvas).children.length == 2)).toBe(true);
            done();
        });
    });

    describe('Grid Panel with column span', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram21' });
            document.body.appendChild(ele);
            let grid: GridPanel = new GridPanel();
            grid.offsetX = 300;
            grid.offsetY = 200;
            // grid.width = 100;
            // grid.height = 100;
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

            let colDefns: ColumnDefinition[] = [];
            let colDefn: ColumnDefinition = new ColumnDefinition();
            colDefn.width = 200;
            colDefns.push(colDefn);

            let colDefn2: ColumnDefinition = new ColumnDefinition();
            colDefn2.width = 200;
            colDefns.push(colDefn2);

            grid.setDefinitions(rowDefns, colDefns);

            let child1: DiagramElement = new DiagramElement();
            //child1.margin = new Margin(0, 0, 0, 0);
            grid.addObject(child1, 0, 0, 1, 2);

            let child2: DiagramElement = new DiagramElement();
            grid.addObject(child2, 1, 0);

            let child3: DiagramElement = new DiagramElement();
            grid.addObject(child3, 1, 0);

            diagram = new Diagram({ width: 1000, height: 1000, basicElements: [grid] });
            diagram.appendTo('#diagram21');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking grid panel without rows and columns', (done: Function) => {
            expect(diagram.basicElements[0].actualSize.width == 400 && diagram.basicElements[0].actualSize.height == 100).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children.length == 3)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[0].bounds.x == 100 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.y == 150 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.width == 400 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.height == 50 &&
                ((diagram.basicElements[0] as GridPanel).children[0] as Canvas).children.length == 1)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[1].bounds.x == 100 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.y == 200 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.height == 50 &&
                ((diagram.basicElements[0] as GridPanel).children[1] as Canvas).children.length == 2)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[2].bounds.x == 300 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.y == 200 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.height == 50)).toBe(true);
            done();
        });
    });

    describe('Grid Panel with Row span and column span', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramGridPanel' });
            document.body.appendChild(ele);
            let grid: GridPanel = new GridPanel();
            grid.offsetX = 300;
            grid.offsetY = 200;
            // grid.width = 100;
            // grid.height = 100;
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
            grid.addObject(child00, 0, 0, 1, 3);

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
            grid.addObject(child20, 2, 0, 2, 1);

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

            diagram = new Diagram({ width: 1000, height: 1000, basicElements: [grid] });
            diagram.appendTo('#diagramGridPanel');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking grid panel without rows and columns', (done: Function) => {
            expect(diagram.basicElements[0].actualSize.width == 800 && diagram.basicElements[0].actualSize.height == 250).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children.length == 17)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[0].bounds.x == -100 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.y == 75 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.width == 600 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.height == 50 &&
                ((diagram.basicElements[0] as GridPanel).children[0] as Canvas).children.length == 1)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[6].bounds.x == -100 &&
                (diagram.basicElements[0] as GridPanel).children[6].bounds.y == 175 &&
                (diagram.basicElements[0] as GridPanel).children[6].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[6].bounds.height == 100 &&
                ((diagram.basicElements[0] as GridPanel).children[6] as Canvas).children.length == 1)).toBe(true);
            done();
        });
    });

    describe('Swimlane structure', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram22' });
            document.body.appendChild(ele);
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
            grid.addObject(swimlaneHeader, 0, 0, 1, 2);

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

            diagram = new Diagram({ width: 1000, height: 1000, basicElements: [grid] });
            diagram.appendTo('#diagram22');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking grid panel without rows and columns', (done: Function) => {
            expect(diagram.basicElements[0].actualSize.width == 425 && diagram.basicElements[0].actualSize.height == 375).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children.length == 5)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[0].bounds.x == 87.5 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.y == 12.5 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.width == 425 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.height == 25 &&
                ((diagram.basicElements[0] as GridPanel).children[0] as Canvas).children.length == 1)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[1].bounds.x == 87.5 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.y == 37.5 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.width == 25 &&
                (diagram.basicElements[0] as GridPanel).children[1].bounds.height == 250 &&
                ((diagram.basicElements[0] as GridPanel).children[1] as Canvas).children.length == 1)).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[2].bounds.x == 112.5 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.y == 37.5 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.width == 400 &&
                (diagram.basicElements[0] as GridPanel).children[2].bounds.height == 250 &&
                ((diagram.basicElements[0] as GridPanel).children[2] as Canvas).children.length == 2)).toBe(true);
            expect((diagram.basicElements[0] as GridPanel).children[3].bounds.x == 87.5 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.y == 287.5 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.width == 25 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.height == 100 &&
                ((diagram.basicElements[0] as GridPanel).children[3] as Canvas).children.length == 1).toBe(true);
            expect(((diagram.basicElements[0] as GridPanel).children[4].bounds.x == 112.5 &&
                (diagram.basicElements[0] as GridPanel).children[4].bounds.y == 287.5 &&
                (diagram.basicElements[0] as GridPanel).children[4].bounds.width == 400 &&
                (diagram.basicElements[0] as GridPanel).children[4].bounds.height == 100 &&
                ((diagram.basicElements[0] as GridPanel).children[4] as Canvas).children.length == 1)).toBe(true);
            done();
        });
    });

    describe('Grid panel size changing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let grid: GridPanel = new GridPanel();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramGrid4' });
            document.body.appendChild(ele);

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
            grid.addObject(child00, 0, 0, 1, 3);

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
            grid.addObject(child20, 2, 0, 2, 1);

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

            diagram = new Diagram({ width: 1000, height: 1000, basicElements: [grid] });
            diagram.appendTo('#diagramGrid4');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking grid panel row height when change the row height at run time', (done: Function) => {
            expect(((diagram.basicElements[0] as GridPanel).children[3].bounds.x == 50 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.y == 35 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.height == 115 &&
                ((diagram.basicElements[0] as GridPanel).children[3] as Canvas).children.length == 2)).toBe(true);
            grid.updateRowHeight(1, 240, true);
            diagram.updateGridContainer(grid);
            expect(((diagram.basicElements[0] as GridPanel).children[3].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.height == 240 &&
                ((diagram.basicElements[0] as GridPanel).children[3] as Canvas).children.length == 2)).toBe(true);
            done();
        });

        it('Checking grid panel column width when change the column width at run time', (done: Function) => {
            expect(((diagram.basicElements[0] as GridPanel).children[3].bounds.width == 200 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.height == 240 &&
                ((diagram.basicElements[0] as GridPanel).children[3] as Canvas).children.length == 2)).toBe(true);
            grid.updateColumnWidth(1, 240, true);
            diagram.updateGridContainer(grid);
            expect(((diagram.basicElements[0] as GridPanel).children[3].bounds.width == 240 &&
                (diagram.basicElements[0] as GridPanel).children[3].bounds.height == 240 &&
                ((diagram.basicElements[0] as GridPanel).children[3] as Canvas).children.length == 2)).toBe(true);
            done();
        });
    });

    describe('Grid panel - Add Row at runtime', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let grid: GridPanel = new GridPanel();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramGrid10' });
            document.body.appendChild(ele);

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

            diagram = new Diagram({ width: 500, height: 500, basicElements: [grid] });
            diagram.appendTo('#diagramGrid10');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking insert row in first', (done: Function) => {
            expect((diagram.basicElements[0] as GridPanel).children.length == 4).toBe(true);
            var rowDefns = [];
            var rowDefn1 = new RowDefinition();
            rowDefn1.height = 100;
            rowDefns.push(rowDefn1);
            grid.addRow(0, rowDefn1, true);
            var child10 = new DiagramElement();
            child10.id = 'child20';
            grid.addObject(child10, 0, 0);
            var child11 = new DiagramElement();
            child11.id = 'child21';
            grid.addObject(child11, 0, 1);
            expect((diagram.basicElements[0] as GridPanel).children.length == 6).toBe(true);
            done();
        });

        it('Checking insert row in middle', (done: Function) => {
            expect((diagram.basicElements[0] as GridPanel).children.length == 6).toBe(true);
            var rowDefns = [];
            var rowDefn1 = new RowDefinition();
            rowDefn1.height = 70;
            rowDefns.push(rowDefn1);
            grid.addRow(1, rowDefn1, true);
            var child10 = new DiagramElement();
            child10.id = 'child220';
            grid.addObject(child10, 1, 0);
            var child11 = new DiagramElement();
            child11.id = 'child221';
            grid.addObject(child11, 1, 1);
            expect((diagram.basicElements[0] as GridPanel).children.length == 8).toBe(true);
            done();
        });

        it('Checking insert row in last', (done: Function) => {
            expect((diagram.basicElements[0] as GridPanel).children.length == 8).toBe(true);
            var rowDefns = [];
            var rowDefn1 = new RowDefinition();
            rowDefn1.height = 100;
            rowDefns.push(rowDefn1);
            grid.addRow(4, rowDefn1, true);
            var child10 = new DiagramElement();
            child10.id = 'child40';
            grid.addObject(child10, 4, 0);
            var child11 = new DiagramElement();
            child11.id = 'child41';
            grid.addObject(child11, 4, 1);
            expect((diagram.basicElements[0] as GridPanel).children.length == 10).toBe(true);
            done();
        });
    });

    describe('Grid panel - Add Column at runtime', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let grid: GridPanel = new GridPanel();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramGrid11' });
            document.body.appendChild(ele);

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

            diagram = new Diagram({ width: 500, height: 500, basicElements: [grid] });
            diagram.appendTo('#diagramGrid11');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking insert column in first', (done: Function) => {
            expect((diagram.basicElements[0] as GridPanel).children.length == 4).toBe(true);
            var colDefns = [];
            var colDefn = new ColumnDefinition();
            colDefn.width = 100;
            colDefns.push(colDefn);
            grid.addColumn(0, colDefn, true);
            var child10 = new DiagramElement();
            child10.id = 'newchild20';
            grid.addObject(child10, 0, 0);
            var child11 = new DiagramElement();
            child11.id = 'newchild21';
            grid.addObject(child11, 1, 0);
            expect((diagram.basicElements[0] as GridPanel).children.length == 6).toBe(true);
            done();
        });

        it('Checking insert column in middle', (done: Function) => {
            expect((diagram.basicElements[0] as GridPanel).children.length == 6).toBe(true);
            var colDefns = [];
            var colDefn = new ColumnDefinition();
            colDefn.width = 100;
            colDefns.push(colDefn);
            grid.addColumn(1, colDefn, true);
            var child10 = new DiagramElement();
            child10.id = 'newchild120';
            grid.addObject(child10, 0, 1);
            var child11 = new DiagramElement();
            child11.id = 'newchild121';
            grid.addObject(child11, 1, 1);
            expect((diagram.basicElements[0] as GridPanel).children.length == 8).toBe(true);
            done();
        });

        it('Checking insert column in last', (done: Function) => {
            expect((diagram.basicElements[0] as GridPanel).children.length == 8).toBe(true);
            var colDefns = [];
            var colDefn = new ColumnDefinition();
            colDefn.width = 100;
            colDefns.push(colDefn);
            grid.addColumn(4, colDefn, true);
            var child10 = new DiagramElement();
            child10.id = 'newchild220';
            grid.addObject(child10, 4, 0);
            var child11 = new DiagramElement();
            child11.id = 'newchild221';
            grid.addObject(child11, 4, 0);
            expect((diagram.basicElements[0] as GridPanel).children.length == 10).toBe(true);
            done();
        });
    });
    describe('Grid panel - Remove Row and Column at runtime', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let grid: GridPanel = new GridPanel();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramGrid12' });
            document.body.appendChild(ele);

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

            diagram = new Diagram({ width: 500, height: 500, basicElements: [grid] });
            diagram.appendTo('#diagramGrid12');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking remove column in first', (done: Function) => {
            expect((diagram.basicElements[0] as GridPanel).children.length == 4).toBe(true);
            grid.removeColumn(1);
            diagram.updateGridContainer(grid);
            expect((diagram.basicElements[0] as GridPanel).children.length == 2).toBe(true);
            done();
        });
        it('Checking remove row', (done: Function) => {
            expect((diagram.basicElements[0] as GridPanel).children.length == 2).toBe(true);
            grid.removeRow(1);
            diagram.updateGridContainer(grid);
            expect((diagram.basicElements[0] as GridPanel).children.length == 1).toBe(true);
            done();
        });
    });

    describe('Grid panel - Swap the rows in grid', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let grid: GridPanel = new GridPanel();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramGrid13' });
            document.body.appendChild(ele);
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
            diagram = new Diagram({ width: 500, height: 500, basicElements: [grid] });
            diagram.appendTo('#diagramGrid13');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking inter change the row in the grid', (done: Function) => {
            expect((diagram.basicElements[0] as GridPanel).children[0].bounds.x == 200 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.y == 150 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.width == 100 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.height == 50).toBe(true);
            grid.updateRowIndex(1, 0);
            diagram.updateGridContainer(grid);
            expect((diagram.basicElements[0] as GridPanel).children[0].bounds.x == 200 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.y == 200 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.width == 100 &&
                (diagram.basicElements[0] as GridPanel).children[0].bounds.height == 50).toBe(true);
            done();
        });

        it('Checking the properties after change', (done: Function) => {
            grid.updateProperties(400, 300, 400, 400);
            diagram.updateGridContainer(grid);
            expect((diagram.basicElements[0] as GridPanel).offsetX == 400 &&
                (diagram.basicElements[0] as GridPanel).offsetY == 300 &&
                (diagram.basicElements[0] as GridPanel).width == 400 &&
                (diagram.basicElements[0] as GridPanel).height == 400).toBe(true);
            done();
        });
    });
    describe('Simple Grid container', () => {
        let diagram: Diagram;
        let ele: HTMLElement; let diagramCanvas: HTMLElement;
        let mouseevents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramGridContainer' });
            document.body.appendChild(ele);
            let rowDefns: RowDefinition[] = [];
            let rowDefn1: RowDefinition = new RowDefinition();
            rowDefn1.height = 50;
            rowDefns.push(rowDefn1);

            let rowDefn2: RowDefinition = new RowDefinition();
            rowDefn2.height = 100;
            rowDefns.push(rowDefn2);

            let rowDefn3: RowDefinition = new RowDefinition();
            rowDefn3.height = 50;
            rowDefns.push(rowDefn3);

            let colDefns: ColumnDefinition[] = [];
            let colDefn: ColumnDefinition = new ColumnDefinition();
            colDefn.width = 20;
            colDefns.push(colDefn);

            let colDefn2: ColumnDefinition = new ColumnDefinition();
            colDefn2.width = 100;
            colDefns.push(colDefn2);

            let colDefn3: ColumnDefinition = new ColumnDefinition();
            colDefn3.width = 100;
            colDefns.push(colDefn3);
            let nodes: NodeModel[] = [
                {
                    id: 'node01', offsetX: 100, offsetY: 100, rowIndex: 0, columnIndex: 0, columnSpan: 3, annotations: [{ content: 'H' }], container: { type: 'Canvas', orientation: 'Vertical' }
                },
                {
                    id: 'n1', offsetX: 100, offsetY: 100, annotations: [{ content: 'n1' }], margin: { left: 10, top: 10 }, width: 40, height: 30
                },
                {
                    id: 'n2', offsetX: 100, offsetY: 100, annotations: [{ content: 'n2' }], margin: { left: 10, top: 10 }, width: 40, height: 30
                },
                {
                    id: 'node02', offsetX: 100, offsetY: 100, rowIndex: 1, columnIndex: 0, columnSpan: 1, annotations: [{ content: 'p' }], container: { type: 'Canvas', orientation: 'Vertical' }
                },
                {
                    id: 'node03', offsetX: 100, offsetY: 100, rowIndex: 1, columnIndex: 1, columnSpan: 1, annotations: [{ content: 'L' }], container: { type: 'Canvas', orientation: 'Vertical' },

                },
                {
                    id: 'node04', offsetX: 100, offsetY: 100, rowIndex: 1, columnIndex: 2, rowSpan: 1, annotations: [{ content: 'L' }], container: { type: 'Canvas', orientation: 'Vertical' },
                    children: ['n2'], constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
                },
                {
                    id: 'node05', offsetX: 100, offsetY: 100, rowIndex: 2, columnIndex: 0, annotations: [{ content: 'p' }], container: { type: 'Canvas', orientation: 'Vertical' }
                },
                {
                    id: 'node06', offsetX: 100, offsetY: 100, rowIndex: 2, columnIndex: 1, annotations: [{ content: 'L' }], container: { type: 'Canvas', orientation: 'Vertical' },
                    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
                },
                {
                    id: 'node07', offsetX: 100, offsetY: 100, rowIndex: 2, columnIndex: 2, annotations: [{ content: 'L' }], container: { type: 'Canvas', orientation: 'Vertical' },
                    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                    children: ['n1']
                },
                {
                    id: 'grid', offsetX: 400, offsetY: 300,
                    rows: rowDefns, columns: colDefns, children: ['node01', 'node02', 'node03', 'node04', 'node05', 'node06', 'node07'],
                    container: { type: 'Grid', orientation: 'Vertical' }
                },
            ];
            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramGridContainer');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseevents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking grid container', (done: Function) => {
            expect(diagram.nodes[9].offsetX == 400 && diagram.nodes[9].offsetY == 300).toBe(true);
            done();
        });
        it('Checking grid container resize the column width', (done: Function) => {
            mouseevents.clickEvent(diagramCanvas, 10, 10);
            var node1 = diagram.nodes[4];
            mouseevents.clickEvent(diagramCanvas, node1.offsetX + diagram.element.offsetLeft, node1.offsetY + diagram.element.offsetTop);
            resize(diagram, 'resizeEast');
            expect(diagram.nodes[9].offsetX == 407.5 && diagram.nodes[9].offsetY == 300 && diagram.nodes[9].wrapper.actualSize.width == 265 && diagram.nodes[9].wrapper.actualSize.height == 200).toBe(true);
            done();
        });
        it('Checking grid container resize the row height', (done: Function) => {
            debugger
            mouseevents.clickEvent(diagramCanvas, 10, 10);
            var node1 = diagram.nodes[6];
            mouseevents.clickEvent(diagramCanvas, node1.offsetX + diagram.element.offsetLeft, node1.offsetY + diagram.element.offsetTop);
            resize(diagram, 'resizeSouth');
            expect(diagram.nodes[9].offsetX == 407.5 && diagram.nodes[9].offsetY == 310 && diagram.nodes[9].wrapper.actualSize.width == 265 && diagram.nodes[9].wrapper.actualSize.height == 220).toBe(true);
            done();
        });
        it('Checking Select the node', (done: Function) => {
            debugger
            let node: NodeModel = diagram.nodes[1];
            mouseevents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
            resize(diagram, 'resizeEast');
            expect(diagram.nodes[9].offsetX == 397.5 && diagram.nodes[9].offsetY == 310 && diagram.nodes[9].wrapper.actualSize.width == 245 && diagram.nodes[9].wrapper.actualSize.height == 220).toBe(true);

            resize(diagram, 'resizeSouth');
            resize(diagram, 'resizeSouth');
            expect(diagram.nodes[9].offsetX == 397.5 && diagram.nodes[9].offsetY == 315 && diagram.nodes[9].wrapper.actualSize.width == 245 && diagram.nodes[9].wrapper.actualSize.height == 230).toBe(true);
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