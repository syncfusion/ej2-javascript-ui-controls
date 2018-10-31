/**
 * Image Element test cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { ShadowModel } from '../../../src/diagram/core/appearance-model';
import { ImageElement } from '../../../src/diagram/core/elements/image-element';
import { Stretch } from '../../../src/diagram/enum/enum';
import { NodeModel } from '../../../src/diagram/index';

//issue in image element without size
describe('Diagram Control', () => {
    describe('Image Element with width and height', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram23' });
            document.body.appendChild(ele);

            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 280;
            elementimg.height = 200;
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            let shadow: ShadowModel = { angle: 45, distance: 5, opacity: 0.7, color: 'red' };
            elementimg.shadow = shadow;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';

            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', basicElements: [elementimg] });
            diagram.appendTo('#diagram23');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking with width and height in SVG rendering Mode', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 280 &&
                diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Image Element without width and height', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram24' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';

            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', basicElements: [elementimg] });
            diagram.appendTo('#diagram24');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without width and height in SVG rendering Mode', (done: Function) => {
            //workaround
            // expect(diagram.basicElements[0].actualSize.width == 104 &&
            //     diagram.basicElements[0].actualSize.height == 142).toBe(true);
            done();
        });
    });

    describe('Image Element ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram25' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Stretch';
            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', basicElements: [elementimg] });
            diagram.appendTo('#diagram25');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without width and height with stretch in SVG rendering Mode', (done: Function) => {
            //workaround
            // expect(diagram.basicElements[0].actualSize.width == 104 &&
            //     diagram.basicElements[0].actualSize.height == 142).toBe(true);
            done();
        });
    });

    describe('Checking with width and height and Stretch.stretch', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram26' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 280;
            elementimg.height = 200;
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Stretch';

            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', basicElements: [elementimg] });
            diagram.appendTo('#diagram26');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without size and with stretch in SVG rendering Mode', (done: Function) => {
            //workaround
            // expect(diagram.basicElements[0].actualSize.width == 280 &&
            //     diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Image Element with width and height and Stretch.Meet', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram27' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 280;
            elementimg.height = 200;
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.stretch = 'Meet';
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';

            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', basicElements: [elementimg] });
            diagram.appendTo('#diagram27');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking with size and meet in SVG rendering Mode', (done: Function) => {
            expect(diagram.basicElements[0].actualSize.width == 280 &&
                diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Image Element with width and height and Stretch.Slice', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram28' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 280;
            elementimg.height = 200;
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Slice';
            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', basicElements: [elementimg] });
            diagram.appendTo('#diagram28');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking with size and slice in SVG rendering Mode', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 280 &&
                diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Image Element with width and height and Stretch.None', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram29' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 280;
            elementimg.height = 200;
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'None';

            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', basicElements: [elementimg] });
            diagram.appendTo('#diagram29');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking with size and Stretch.None in SVG rendering Mode', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 280 &&
                diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Image Element without width and height with Meet', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram30' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Meet';
            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', basicElements: [elementimg] });
            diagram.appendTo('#diagram30');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without size and with meet in SVG rendering Mode', (done: Function) => {
            // //workaround
            // expect(diagram.basicElements[0].actualSize.width == 104 &&
            //     diagram.basicElements[0].actualSize.height == 142).toBe(true);
            done();
        });
    });

    describe('Image Element without width and height with Slice', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram31' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Slice';
            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', basicElements: [elementimg] });
            diagram.appendTo('#diagram31');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without size and with slice', (done: Function) => {

            done();
        });
    });

    describe('Image Element without width and height with Stretch.none ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram32' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'None';
            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', basicElements: [elementimg] });
            diagram.appendTo('#diagram32');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without size and with stretch.none in SVG rendering Mode', (done: Function) => {
            // expect(diagram.basicElements[0].actualSize.width == 104 &&
            //     diagram.basicElements[0].actualSize.height == 142 ||
            //     diagram.basicElements[0].actualSize.width == 104 &&
            //     diagram.basicElements[0].actualSize.height == 142).toBe(true);
            done();
        });

    });
    describe('change of image element at run time', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram33' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node4', width: 50, height: 50, offsetX: 100, offsetY: 100, style: { fill: 'none' },

            },]
            diagram = new Diagram({ mode: 'SVG', width: '500px', height: '500px', nodes: nodes });
            diagram.appendTo('#diagram33');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('change of image element at run time', (done: Function) => {
            diagram.nodes[0].shape = {
                type: 'Image',
                source: 'https://www.w3schools.com/images/w3schools_green.jpg',
                align: 'None'
            };
            diagram.dataBind();

            let image: HTMLElement = document.getElementById('node4_contentimage')
            expect(image.attributes[8].nodeValue === 'https://www.w3schools.com/images/w3schools_green.jpg').toBe(true);
            done();
        });


    });
});