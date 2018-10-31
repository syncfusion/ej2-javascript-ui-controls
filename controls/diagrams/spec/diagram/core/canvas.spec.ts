/**
 * Test cases for grid panel
 */

import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { Thickness } from '../../../src/diagram/core/appearance';
import { DiagramModel } from '../../../src/diagram/index';
import { Size } from '../../../src/index';

describe('Diagram Control', () => {
    describe('Simple canvas panel without children', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let canvas: Canvas;
        let canvasWithMinMaxSize: Canvas;
        let canvasWithoutSize: Canvas;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            canvas = new Canvas();
            canvas.pivot = { x: 0, y: 0 };
            canvas.offsetX = 200;
            canvas.offsetY = 100;
            canvas.width = 200;
            canvas.height = 200;
            canvas.minWidth = canvas.minHeight = 125;
            canvas.maxWidth = canvas.maxHeight = 150;

            canvasWithMinMaxSize = new Canvas();
            canvasWithMinMaxSize.pivot = { x: 0, y: 0 };
            canvasWithMinMaxSize.offsetX = 400;
            canvasWithMinMaxSize.offsetY = 100;
            canvasWithMinMaxSize.minWidth = canvasWithMinMaxSize.minHeight = 125;
            canvasWithMinMaxSize.maxWidth = canvasWithMinMaxSize.maxHeight = 150;

            canvasWithoutSize = new Canvas();
            canvasWithoutSize.pivot = { x: 0, y: 0 };
            canvasWithoutSize.offsetX = 600;
            canvasWithoutSize.offsetY = 100;

            diagram = new Diagram({ width: '1000px', height: '600px', basicElements: [canvas, canvasWithMinMaxSize, canvasWithoutSize] } as DiagramModel);
            diagram.appendTo('#diagram4');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking canvas panel and with size', (done: Function) => {
            expect(canvas.actualSize.width === 150 && canvas.actualSize.height === 150).toBe(true);
            done();
        });

        it('Checking canvas panel without size and with min max size', (done: Function) => {
            expect(canvasWithMinMaxSize.actualSize.width === 125 && canvasWithMinMaxSize.actualSize.height === 125).toBe(true);
            done();
        });

        it('Checking canvas panel without size and without min max size', (done: Function) => {
            expect(canvasWithoutSize.actualSize.width === 0 && canvasWithoutSize.actualSize.height === 0).toBe(true);
            done();
        });
    });

    describe('Simple canvas panel with empty children collection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let canvas: Canvas = new Canvas();
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            canvas.pivot = { x: 0, y: 0 };
            canvas.offsetX = 200;
            canvas.offsetY = 100;
            canvas.width = 100;
            canvas.height = 100;
            canvas.children = [];
            diagram = new Diagram({ width: '1000px', height: '600px', basicElements: [canvas] } as DiagramModel);
            diagram.appendTo('#diagram5');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Simple canvas panel with empty children collection', (done: Function) => {
            expect(canvas.actualSize.width === 100 && canvas.actualSize.height === 100).toBe(true);
            done();
        });
    });

    describe('Simple canvas panel with one child', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let child: DiagramElement;
        let canvasWithoutSize: Canvas;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let canvas: Canvas = new Canvas();
            canvas.pivot = { x: 0, y: 0 };
            canvas.offsetX = 200;
            canvas.offsetY = 100;
            canvas.width = 100;
            canvas.height = 100;

            child = new DiagramElement();
            child.margin = { left: 10, right: 10, top: 10, bottom: 10 };

            canvas.children = [child];
            canvasWithoutSize = new Canvas();
            canvasWithoutSize.offsetX = 400;
            canvasWithoutSize.offsetY = 100;
            let child2: DiagramElement = new DiagramElement();
            child2.width = 100;
            child2.height = 100;
            canvasWithoutSize.children = [child2];

            diagram = new Diagram({ width: '1000px', height: '600px', basicElements: [canvas, canvasWithoutSize] } as DiagramModel);
            diagram.appendTo('#diagram6');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking canvas panel with a child - inherits size from canvas', (done: Function) => {
            expect(child.actualSize.width === 80 && child.actualSize.height === 80).toBe(true);
            done();
        });

        it('Checking canvas panel with a child - canvas wraps the child', (done: Function) => {
            expect(canvasWithoutSize.actualSize.width === 100 && canvasWithoutSize.actualSize.height === 100).toBe(true);
            done();
        });
    });

    describe('Canvas Panel with one child with absolute position', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let child: DiagramElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram7' });
            document.body.appendChild(ele);
            let canvas: Canvas = new Canvas();
            canvas.pivot = { x: 0, y: 0 };
            canvas.offsetX = 200;
            canvas.offsetY = 100;
            canvas.width = 200;
            canvas.height = 200;

            child = new DiagramElement();
            child.setOffsetWithRespectToBounds(95, 95, 'Absolute');
            child.width = 10;
            child.height = 10;

            canvas.children = [child];
            diagram = new Diagram({ width: '1000px', height: '600px', basicElements: [canvas] } as DiagramModel);
            diagram.appendTo('#diagram7');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking canvas panel with a child with absolute position', (done: Function) => {
            expect(child.offsetX === 300 && child.offsetY === 200).toBe(true);
            done();
        });
    });

    describe('Simple canvas panel without size and two children', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let canvas: Canvas;
        let child1: DiagramElement;
        let child2: DiagramElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram8' });
            document.body.appendChild(ele);
            canvas = new Canvas();
            canvas.pivot = { x: 0, y: 0 };
            canvas.offsetX = 200;
            canvas.offsetY = 100;
            canvas.style.fill = 'wheat';

            child1 = new DiagramElement();
            child1.width = 100;
            child1.height = 100;
            child1.margin.left = child1.margin.top = 10;

            child2 = new DiagramElement();
            child2.width = 100; child2.height = 100;
            child2.margin.left = 190;
            child2.margin.top = 190;

            canvas.children = [child1, child2];

            diagram = new Diagram({ width: '1000px', height: '600px', basicElements: [canvas] } as DiagramModel);
            diagram.appendTo('#diagram8');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking canvas panel without size with two children(margin)', (done: Function) => {
            expect(canvas.actualSize.width === 290 && canvas.actualSize.height === 290 && child1.offsetX === 260 && child2.offsetX === 440 &&
                child1.offsetY === 160 && child2.offsetY === 340).toBe(true);
            done();
        });
    });

    describe('Simple canvas panel with padding and two children', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let canvas: Canvas;
        let child1: DiagramElement;
        let child2: DiagramElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram9' });
            document.body.appendChild(ele);
            canvas = new Canvas();
            canvas.padding = new Thickness(10, 10, 10, 10);
            canvas.pivot = { x: 0, y: 0 };
            canvas.offsetX = 200;
            canvas.offsetY = 100;
            canvas.style.fill = 'wheat';

            child1 = new DiagramElement();
            child1.width = 100;
            child1.height = 100;
            child1.margin.left = child1.margin.top = 10;

            child2 = new DiagramElement();
            child2.width = 100; child2.height = 100;
            child2.margin.left = 190;
            child2.margin.top = 190;

            canvas.children = [child1, child2];

            diagram = new Diagram({ width: '1000px', height: '600px', basicElements: [canvas] } as DiagramModel);
            diagram.appendTo('#diagram9');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking canvas panel with padding and with two children', (done: Function) => {
            expect(canvas.actualSize.width === 310 && canvas.actualSize.height === 310 && child1.offsetX === 270 && child2.offsetX === 450 &&
                child1.offsetY === 170 && child2.offsetY === 350).toBe(true);
            done();
        });
    });

    describe('Simple canvas panel with size and two children', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let canvas: Canvas;
        let child1: DiagramElement;
        let child2: DiagramElement;
        let child3: DiagramElement;
        let child4: DiagramElement;
        let child5: DiagramElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram11' });
            document.body.appendChild(ele);
            canvas = new Canvas();
            canvas.pivot = { x: 0, y: 0 };
            canvas.offsetX = 200;
            canvas.offsetY = 100;
            canvas.width = 400;
            canvas.height = 400;

            child1 = new DiagramElement();
            child1.width = 100;
            child1.height = 100;
            child1.horizontalAlignment = 'Center';
            child1.verticalAlignment = 'Stretch';
            child1.relativeMode = 'Object';

            child2 = new DiagramElement();
            child2.width = 100; child2.height = 100;
            child2.horizontalAlignment = 'Stretch';
            child2.verticalAlignment = 'Center';
            child2.relativeMode = 'Object';

            child3 = new DiagramElement();
            child3.width = 100; child3.height = 100;
            child3.horizontalAlignment = 'Left';
            child3.verticalAlignment = 'Top';
            child3.relativeMode = 'Object';

            child3.margin.left = child3.margin.top = 10;

            child4 = new DiagramElement();
            child4.width = 100; child4.height = 100;
            child4.horizontalAlignment = 'Right';
            child4.verticalAlignment = 'Bottom';
            child4.relativeMode = 'Object';
            child4.margin.right = 10;
            child4.margin.bottom = 10;

            child5 = new DiagramElement();
            child5.width = 100;
            child5.height = 100;
            child5.relativeMode = 'Object';

            canvas.children = [child1, child2, child3, child4, child5];

            diagram = new Diagram({ width: '1000px', height: '600px', basicElements: [canvas] } as DiagramModel);
            diagram.appendTo('#diagram11');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking canvas panel with size and with two children(relative position)', (done: Function) => {
            expect(canvas.actualSize.width === 400 && canvas.actualSize.height === 400 &&
                child1.offsetX === 400 && child1.offsetY === 300 &&
                child2.offsetX === 400 && child2.offsetY === 300 &&
                child3.offsetX === 260 && child3.offsetY === 160 &&
                child4.offsetX === 540 && child4.offsetY === 440 &&
                child5.offsetX === 250 && child5.offsetY === 150).toBe(true);
            done();
        });
    });

    describe('Simple canvas panel with two rotated children', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let canvas: Canvas;
        let child1: DiagramElement;
        let child2: DiagramElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            canvas = new Canvas();
            canvas.pivot = { x: 0, y: 0 };
            canvas.offsetX = 200;
            canvas.offsetY = 100;
            canvas.style.fill = 'wheat';
            canvas.padding = new Thickness(10, 10, 10, 10);

            child1 = new DiagramElement();
            child1.width = 200;
            child1.height = 100;
            child1.rotateAngle = 45;

            child2 = new DiagramElement();
            child2.width = 100; child2.height = 100;
            child2.margin.left = 190;
            child2.margin.top = 190;
            child2.rotateAngle = 45;

            canvas.children = [child1, child2];

            diagram = new Diagram({ width: 1000, height: 1000, basicElements: [canvas] } as DiagramModel);
            diagram.appendTo('#diagram12');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking canvas panel with two rotated children', (done: Function) => {
            expect(canvas.actualSize.width === 351.41999999999996 && canvas.actualSize.height === 351.41999999999996
                && child1.offsetX === 316.07 && child2.offsetX === 470.71 &&
                child1.offsetY === 216.07 && child2.offsetY === 370.71).toBe(true);
            done();
        });
    });

    describe('Rotated canvas panel without size and two rotated children', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let canvas: Canvas;
        let child1: DiagramElement;
        let child2: DiagramElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram13' });
            document.body.appendChild(ele);
            canvas = new Canvas();
            canvas.pivot = { x: 0, y: 0 };
            canvas.offsetX = 200;
            canvas.offsetY = 100;
            canvas.style.fill = 'wheat';
            canvas.rotateAngle = 45;

            child1 = new DiagramElement();
            child1.width = 200;
            child1.height = 100;
            child1.margin.left = child1.margin.top = 10;

            child2 = new DiagramElement();
            child2.width = 100; child2.height = 100;
            child2.margin.left = 190;
            child2.margin.top = 190;

            canvas.children = [child1, child2];

            diagram = new Diagram({ width: '1000px', height: '600px', basicElements: [canvas] } as DiagramModel);
            diagram.appendTo('#diagram13');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking canvas panel without size and rotated children', (done: Function) => {
            expect(canvas.actualSize.width === 290 && canvas.actualSize.height === 290 && child1.offsetX === 235.36 && child2.offsetX === 200 &&
                child1.offsetY === 220.21 && child2.offsetY === 439.41 && child1.parentTransform === canvas.parentTransform + canvas.rotateAngle &&
                child2.parentTransform === canvas.parentTransform + canvas.rotateAngle).toBe(true);
            done();
        });
    });
    describe('Rotated canvas panel without size and two rotated children', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let canvas: Canvas;
        let child1: DiagramElement;
        let child2: DiagramElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram14' });
            document.body.appendChild(ele);
            canvas = new Canvas();
            canvas.pivot = { x: 0, y: 0 };
            canvas.offsetX = 200;
            canvas.offsetY = 100;
            canvas.style.fill = 'wheat';
            canvas.rotateAngle = 45;

            child1 = new DiagramElement();
            child1.width = 200;
            child1.height = 100;
            child1.margin.left = child1.margin.top = 10;
            child1.rotateAngle = 45;

            child2 = new Canvas();
            child2.width = 100; child2.height = 100;
            child2.margin.left = 190;
            child2.margin.top = 190;
            child2.rotateAngle = 45;

            canvas.children = [child1, child2];

            diagram = new Diagram({ width: '1000px', height: '600px', basicElements: [canvas] } as DiagramModel);
            diagram.appendTo('#diagram14');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking rotated canvas with rotated children', (done: Function) => {
            let size: Size = new Size(0, 0);
            size.isEmpty();
            expect(canvas.actualSize.width === 331.41999999999996 && canvas.actualSize.height === 331.41999999999996 && child1.offsetX === 200 && child2.offsetX === 200 &&
                child1.offsetY === 264.15 && child2.offsetY === 468.7 && child1.parentTransform === canvas.parentTransform + canvas.rotateAngle &&
                child2.parentTransform === canvas.parentTransform + canvas.rotateAngle).toBe(true);
            done();
        });
    });
    //write test case for nested canvas

});