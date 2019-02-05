/**
 * Stack Panel test cases
 */

import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { ImageElement } from '../../../src/diagram/core/elements/image-element';
import { StackPanel } from '../../../src/diagram/core/containers/stack-panel';
import { Thickness } from '../../../src/diagram/core/appearance';
import { DiagramModel } from '../../../src/diagram/index';


describe('Diagram Control', () => {
    describe('Simple Stack Panel without children', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram35' });
            document.body.appendChild(ele);
            let stackPanel: StackPanel = new StackPanel();
            stackPanel.offsetX = 300;
            stackPanel.offsetY = 200;
            stackPanel.width = 100;
            stackPanel.height = 100;
            stackPanel.style.fill = 'red';
            diagram = new Diagram({ width: '500px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram35');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking stack panel without children', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 100 && diagram.basicElements[0].actualSize.height == 100).toBe(true);
            done();
        });
    });

    describe('Stack Panel with empty children collection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram36' });
            document.body.appendChild(ele);
            let stackPanel: StackPanel = new StackPanel();
            stackPanel.offsetX = 300;
            stackPanel.offsetY = 200;
            stackPanel.width = 100;
            stackPanel.height = 100;
            stackPanel.children = [];
            stackPanel.style.fill = 'red';
            diagram = new Diagram({ width: '500px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram36');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking stack panel with empty children', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 100 && diagram.basicElements[0].actualSize.height == 100).toBe(true);
            done();
        });
    });

    describe('Default stack panel - without orientation', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram37' });
            document.body.appendChild(ele);
            let stackPanel: StackPanel = new StackPanel();
            stackPanel.offsetX = 300;
            stackPanel.offsetY = 200;
            stackPanel.style.fill = 'blue';

            let element1: DiagramElement = new DiagramElement();
            element1.width = 50;
            element1.height = 50;
            element1.style.fill = 'green';

            let element2: DiagramElement = new DiagramElement();
            element2.width = 200;
            element2.height = 50;
            element2.style.fill = 'red';
            stackPanel.children = [element1, element2];
            diagram = new Diagram({ width: '500px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram37');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking default orientation', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 200 && diagram.basicElements[0].actualSize.height == 100 &&
                (diagram.basicElements[0] as StackPanel).children.length == 2).toBe(true);
            done();
        });
    });

    describe('Horizontal Stack Panel', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram38' });
            document.body.appendChild(ele);
            let nodes: DiagramElement[];
            let stackPanel: StackPanel = new StackPanel();
            stackPanel.offsetX = 300;
            stackPanel.offsetY = 200;
            stackPanel.orientation = 'Horizontal';
            stackPanel.style.fill = 'blue';

            let element1: DiagramElement = new DiagramElement();
            element1.width = 50;
            element1.height = 50;
            element1.style.fill = 'green';

            let element2: DiagramElement = new DiagramElement();
            element2.width = 200;
            element2.height = 50;
            element2.style.fill = 'red';

            let element3: DiagramElement = new DiagramElement();
            element3.width = 50;
            element3.height = 50;
            element3.horizontalAlignment = 'Left';
            element3.style.fill = 'green';

            let element4: DiagramElement = new DiagramElement();
            element4.width = 100;
            element4.height = 50;
            element4.horizontalAlignment = 'Stretch';
            element4.style.fill = 'red';

            let element5: DiagramElement = new DiagramElement();
            element5.width = 50;
            element5.height = 50;
            element5.horizontalAlignment = 'Right';
            element5.style.fill = 'green';

            stackPanel.children = [element1, element2, element3, element4, element5];

            diagram = new Diagram({ width: '500px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram38');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking horizontal panel', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 450 && diagram.basicElements[0].actualSize.height == 50 &&
                (diagram.basicElements[0] as StackPanel).children.length == 5).toBe(true);
            done();
        });
    });

    describe('Vertical Stack Panel', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram39' });
            document.body.appendChild(ele);
            let image: ImageElement = new ImageElement();
            let nodes: DiagramElement[];
            let stackPanel: StackPanel = new StackPanel();
            stackPanel.offsetX = 300;
            stackPanel.offsetY = 200;
            stackPanel.orientation = 'Vertical';
            stackPanel.style.fill = 'blue';

            let element1: DiagramElement = new DiagramElement();
            element1.width = 50;
            element1.height = 50;
            element1.style.fill = 'green';

            let element2: DiagramElement = new DiagramElement();
            element2.width = 200;
            element2.height = 50;
            element2.style.fill = 'red';

            let element3: DiagramElement = new DiagramElement();
            element3.width = 50;
            element3.height = 50;
            element3.horizontalAlignment = 'Left';
            element3.style.fill = 'green';

            let element4: DiagramElement = new DiagramElement();
            element4.width = 100;
            element4.height = 50;
            element4.horizontalAlignment = 'Stretch';
            element4.style.fill = 'red';

            let element5: DiagramElement = new DiagramElement();
            element5.width = 50;
            element5.height = 50;
            element5.horizontalAlignment = 'Right';
            element5.style.fill = 'green';

            stackPanel.children = [element1, element2, element3, element4, element5];

            diagram = new Diagram({ width: '500px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram39');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking vertical panel', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 200 &&
                diagram.basicElements[0].actualSize.height == 250 &&
                (diagram.basicElements[0] as StackPanel).children.length == 5).toBe(true);
            done();
        });
    });

    describe('Horizontal stack panel - padding', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram40' });
            document.body.appendChild(ele);
            let stackPanel: StackPanel = new StackPanel();
            stackPanel.offsetX = 300;
            stackPanel.offsetY = 200;
            stackPanel.padding = new Thickness(10, 10, 10, 10);
            stackPanel.orientation = 'Horizontal';
            stackPanel.style.fill = 'blue';

            let element1: DiagramElement = new DiagramElement();
            element1.width = 50;
            element1.height = 50;
            element1.style.fill = 'green';

            let element2: DiagramElement = new DiagramElement();
            element2.width = 200;
            element2.height = 50;
            element2.style.fill = 'red';
            stackPanel.children = [element1, element2];
            diagram = new Diagram({ width: '500px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram40');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking horizontal panel with padding', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 270 &&
                diagram.basicElements[0].actualSize.height == 70 &&
                (diagram.basicElements[0] as StackPanel).children.length == 2).toBe(true);
            done();
        });
    });

    describe('Vertical stack panel - padding', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram41' });
            document.body.appendChild(ele);
            let stackPanel: StackPanel = new StackPanel();
            stackPanel.offsetX = 300;
            stackPanel.offsetY = 200;
            stackPanel.padding = new Thickness(10, 10, 10, 10);
            stackPanel.orientation = 'Vertical';
            stackPanel.style.fill = 'blue';

            let element1: DiagramElement = new DiagramElement();
            element1.width = 50;
            element1.height = 50;
            element1.style.fill = 'green';

            let element2: DiagramElement = new DiagramElement();
            element2.width = 200;
            element2.height = 50;
            element2.style.fill = 'red';
            stackPanel.children = [element1, element2];
            diagram = new Diagram({ width: '500px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram41');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking vertical stack panel with padding', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 220 &&
                diagram.basicElements[0].actualSize.height == 120 &&
                (diagram.basicElements[0] as StackPanel).children.length == 2).toBe(true);
            done();
        });
    });

    describe('Horizontal stack panel - margin', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram42' });
            document.body.appendChild(ele);
            let stackPanel: StackPanel = new StackPanel();
            stackPanel.offsetX = 300;
            stackPanel.offsetY = 200;
            stackPanel.orientation = 'Horizontal';
            stackPanel.style.fill = 'blue';

            let element1: DiagramElement = new DiagramElement();
            element1.width = 50;
            element1.height = 50;
            element1.margin = { left: 10, right: 10, top: 10, bottom: 10 };;
            element1.style.fill = 'green';

            let element2: DiagramElement = new DiagramElement();
            element2.width = 200;
            element2.height = 50;
            element2.style.fill = 'red';
            element2.margin = { left: 20, right: 20, top: 20, bottom: 20 };;
            stackPanel.children = [element1, element2];
            diagram = new Diagram({ width: '500px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram42');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking horizontal panel with margin', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 310 &&
                diagram.basicElements[0].actualSize.height == 90 &&
                (diagram.basicElements[0] as StackPanel).children.length == 2).toBe(true);
            done();
        });
    });

    describe('Vertical stack panel - margin', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram43' });
            document.body.appendChild(ele);
            let stackPanel: StackPanel = new StackPanel();
            stackPanel.offsetX = 300;
            stackPanel.offsetY = 200;
            stackPanel.orientation = 'Vertical';
            stackPanel.style.fill = 'blue';

            let element1: DiagramElement = new DiagramElement();
            element1.width = 50;
            element1.height = 50;
            element1.margin = { left: 10, right: 10, top: 10, bottom: 10 };;
            element1.style.fill = 'green';

            let element2: DiagramElement = new DiagramElement();
            element2.width = 200;
            element2.height = 50;
            element2.style.fill = 'red';
            element2.margin = { left: 20, right: 20, top: 20, bottom: 20 };;
            stackPanel.children = [element1, element2];
            diagram = new Diagram({ width: '500px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram43');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking vertical stack panel with margin', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 240 &&
                diagram.basicElements[0].actualSize.height == 160 &&
                (diagram.basicElements[0] as StackPanel).children.length == 2).toBe(true);
            done();
        });
    });



    describe('Rotated vertical Stack Panel', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let stackPanel: StackPanel = new StackPanel();
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram44' });
            document.body.appendChild(ele);
            let nodes: DiagramElement[];
            stackPanel.offsetX = 400;
            stackPanel.offsetY = 300;
            // stackPanel.width = 400;
            //stackPanel.height = 400;
            stackPanel.orientation = 'Vertical';
            stackPanel.style.fill = 'blue';
            stackPanel.margin = { left: 10, right: 10, top: 10, bottom: 10 };;

            let childPanel: StackPanel = new StackPanel();
            childPanel.style.fill = 'orange';
            childPanel.rotateAngle = 50;
            // childPanel.width=300;
            // childPanel.height = 300;

            let element1: DiagramElement = new DiagramElement();
            element1.width = 50;
            element1.height = 50;
            element1.style.fill = 'green';

            let element2: DiagramElement = new DiagramElement();
            element2.width = 200;
            element2.height = 100;
            element2.style.fill = 'red';
            element2.rotateAngle = 0;

            let element3: DiagramElement = new DiagramElement();
            element3.width = 50;
            element3.height = 50;
            element3.horizontalAlignment = 'Left';
            element3.style.fill = 'green';

            let element4: DiagramElement = new DiagramElement();
            element4.width = 100;
            element4.height = 100;
            element4.horizontalAlignment = 'Stretch';
            element4.style.fill = 'red';

            let element5: DiagramElement = new DiagramElement();
            element5.width = 50;
            element5.height = 50;
            element5.horizontalAlignment = 'Right';
            element5.style.fill = 'green';


            childPanel.children = [element1, element2, element3, element4, element5];

            let childPanel2: StackPanel = new StackPanel();
            childPanel2.style.fill = 'orange';
            let element6: DiagramElement = new DiagramElement();
            element6.width = 100;
            element6.height = 100;
            element6.style.fill = 'green';
            element6.rotateAngle = 30;
            childPanel2.children = [element6];
            stackPanel.children = [childPanel, childPanel2];
            diagram = new Diagram({ width: '1000px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram44');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking rotated vertical stack panel', (done: Function) => {

            expect(stackPanel.actualSize.width == 396.68 &&
                stackPanel.actualSize.height == 514.78 &&
                stackPanel.children[0].actualSize.width == 200 && stackPanel.children[0].actualSize.height == 350 &&
                stackPanel.children[0].parentTransform == 0 &&
                stackPanel.children[1].actualSize.width == 136.60 && stackPanel.children[1].actualSize.height == 136.6 &&
                (stackPanel.children[0] as StackPanel).children[0].parentTransform == 50).toBe(true);
            done();
        });
    });
    describe('Rotated horizontal Stack Panel', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let stackPanel: StackPanel = new StackPanel();
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram45' });
            document.body.appendChild(ele);
            let nodes: DiagramElement[];
            stackPanel.offsetX = 400;
            stackPanel.offsetY = 300;
            // stackPanel.width = 400;
            //stackPanel.height = 400;
            stackPanel.orientation = 'Horizontal';
            stackPanel.style.fill = 'blue';
            stackPanel.margin = { left: 10, right: 10, top: 10, bottom: 10 };;

            let childPanel: StackPanel = new StackPanel();
            childPanel.style.fill = 'orange';
            childPanel.rotateAngle = 50;
            // childPanel.width=300;
            // childPanel.height = 300;

            let element1: DiagramElement = new DiagramElement();
            element1.width = 50;
            element1.height = 50;
            element1.style.fill = 'green';

            let element2: DiagramElement = new DiagramElement();
            element2.width = 200;
            element2.height = 100;
            element2.style.fill = 'red';
            element2.rotateAngle = 0;

            let element3: DiagramElement = new DiagramElement();
            element3.width = 50;
            element3.height = 50;
            element3.horizontalAlignment = 'Left';
            element3.style.fill = 'green';

            let element4: DiagramElement = new DiagramElement();
            element4.width = 100;
            element4.height = 100;
            element4.horizontalAlignment = 'Stretch';
            element4.style.fill = 'red';

            let element5: DiagramElement = new DiagramElement();
            element5.width = 50;
            element5.height = 50;
            element5.horizontalAlignment = 'Right';
            element5.style.fill = 'green';


            childPanel.children = [element1, element2, element3, element4, element5];

            let childPanel2: StackPanel = new StackPanel();
            childPanel2.style.fill = 'orange';
            let element6: DiagramElement = new DiagramElement();
            element6.width = 100;
            element6.height = 100;
            element6.style.fill = 'green';
            element6.rotateAngle = 30;
            childPanel2.children = [element6];
            stackPanel.children = [childPanel, childPanel2];
            diagram = new Diagram({ width: '500px', height: '500px', basicElements: [stackPanel] } as DiagramModel);
            diagram.appendTo('#diagram45');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking rotated horizontal stack panel', (done: Function) => {

            expect(stackPanel.actualSize.width == 533.28 &&
                stackPanel.actualSize.height == 378.18 &&
                stackPanel.children[0].actualSize.width == 200 && stackPanel.children[0].actualSize.height == 350 &&
                stackPanel.children[0].parentTransform == 0 &&
                stackPanel.children[1].actualSize.width == 136.6 && stackPanel.children[1].actualSize.height == 136.6 &&
                (stackPanel.children[0] as StackPanel).children[0].parentTransform == 50).toBe(true);
            done();

        });
    });
});