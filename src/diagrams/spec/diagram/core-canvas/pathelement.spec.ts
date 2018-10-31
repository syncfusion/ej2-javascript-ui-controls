/**
 * PathElement Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ShapeStyleModel } from '../../../src/diagram/core/appearance-model';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { ShadowModel, RadialGradientModel, StopModel, LinearGradientModel, GradientModel } from '../../../src/diagram/core/appearance-model';

describe('Diagram Control', () => {

    describe('render path element with size', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let element1: PathElement;
        let element2: PathElement;
        let element3: PathElement;
        let element4: PathElement;
        let element5: PathElement;
        let element6: PathElement;
        let element7: PathElement;
        let element8: PathElement;
        let element9: PathElement;
        let element10: PathElement;
        let element11: PathElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram33' });
            document.body.appendChild(ele);
            let nodes: PathElement[];

            element1 = new PathElement();
            let shapestyle: ShapeStyleModel = {};
            element1.width = 50;
            element1.height = 50;
            element1.offsetX = 300;
            element1.offsetY = 100;
            element1.style.strokeWidth = 1;
            element1.data = 'm10 80 q 52.5 10, 95 80 t 180 80 ';

            element2 = new PathElement();
            element2.width = 100;
            element2.height = 100;
            element2.offsetX = 700;
            element2.style.strokeWidth = 1;
            element2.offsetY = 100;
            element2.data = 'M300,200 h-150 a150,150 0 1,0 150,-150 z';
            element2.style.fill = 'red';

            element3 = new PathElement();
            element3.width = 100;
            element3.height = 100;
            element3.offsetX = 500;
            element3.offsetY = 100;
            element3.style.strokeWidth = 1;
            element3.data = 'M35.2441,25 L22.7161,49.9937 L22.7161,0.00657536 L35.2441,25 z M22.7167,25 L-0.00131226,25 M35.2441,49.6337 L35.2441,0.368951 M35.2441,25 L49.9981,25';
            element3.style.fill = 'blue';

            element4 = new PathElement();
            element4.width = 100;
            element4.height = 100;
            element4.offsetX = 350;
            element4.style.strokeWidth = 1;
            element4.offsetY = 300;
            element4.data = 'M100,200 C100,100 250,100 250,200 S400,300 400,200';

            element5 = new PathElement();
            element5.width = 100;
            element5.height = 100;
            element5.offsetX = 500;
            element5.offsetY = 300;
            element5.style.strokeWidth = 1;
            element5.data = 'M433.4624,503.8848C429.4244,493.2388,419.1354,485.6678,407.0734,485.6678C391.4884,485.6678,378.8544,498.3018,378.8544,513.8868L384.4984,513.8868C384.4984,501.4178,394.6054,491.3108,407.0734,491.3108C415.9494,491.3108,423.6264,496.4338,427.3144,503.8848L422.9114,503.8848L426.8974,508.8848L430.8824,513.8868L434.8684,508.8848L438.8544,503.8848L433.4624,503.8848z';

            element6 = new PathElement();
            element6.width = 50;
            element6.height = 50;
            element6.offsetX = 50;
            element6.offsetY = 50;
            element6.style.strokeWidth = 1;
            element6.data = 'M10 80 T 180 80 ';


            element8 = new PathElement();
            element8.width = 50;
            element8.height = 50;
            element8.offsetX = 150;
            element8.style.strokeWidth = 1;
            element8.offsetY = 150;
            element8.data = 'M300,200 h-150 a150,150 0 0,1 150,-150 z';
            element8.style.fill = 'red';

            element9 = new PathElement();
            element9.width = 50;
            element9.height = 50;
            element9.offsetX = 200;
            element9.style.strokeWidth = 1;
            element9.offsetY = 200;
            element9.data = 'M300,200 h-150 a150,150 0 0,0 150,-150 z';
            element9.style.fill = 'red';



            element10 = new PathElement();
            element10.width = 50;
            element10.height = 50;
            element10.offsetX = 150;
            element10.style.strokeWidth = 1;
            element10.offsetY = 300;
            element10.data = 'M300,200 h-150 a150,150 0 1,1 150,-150 z';
            element10.style.fill = 'red';


            element11 = new PathElement();
            element11.width = 50;
            element11.height = 50;
            element11.offsetX = 370;
            element11.offsetY = 130;
            element11.style.strokeWidth = 1;
            element11.style.strokeDashArray = '';
            element11.style.fill = '';
            element11.data = 'M10 80 Q 52.5 10, 95 80 T 180 80 ';

            diagram = new Diagram({
                mode: 'Canvas',
                width: 1000, height: 1000,
                basicElements: [element1, element2, element3, element4, element5, element6, element8, element9,
                    element10, element11],
            });
            diagram.appendTo('#diagram33');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking stack panel without children in SVG rendering Mode', (done: Function) => {
            expect(element1.absolutePath === "M 0 0 Q 9.55 3.13 17.27 25 T 50 50" &&
                element2.absolutePath === 'M 50 50 H 0 A 50 49.999994913737495 0 1 0 50 0 Z' &&
                element3.absolutePath === "M 70.49 50 L 45.44 100 L 45.44 0 L 70.49 50 Z M 45.44 50 L 0 50 M 70.49 99.28 L 70.49 0.72 M 70.49 50 L 100 50" &&
                element4.absolutePath === "M 0 50 C 0 -16.67 50 -16.67 50 50 S 100 116.67 100 50" &&
                element5.absolutePath === "M 91.01 64.56 C 84.28 26.83 67.13 0 47.03 0 C 21.06 0 0 44.77 0 100 L 9.41 100 C 9.41 55.81 26.25 20 47.03 20 C 61.82 20 74.62 38.15 80.77 64.56 L 73.43 64.56 L 80.07 82.27 L 86.71 100 L 93.36 82.27 L 100 64.56 L 91.01 64.56 Z" &&
                element6.absolutePath === "M 0 0 T 50 0" &&
                element8.absolutePath === "M 50 50 H 0 A 50 50 0 0 1 50 0 Z" &&
                element9.absolutePath === "M 50 50 H 0 A 50 50 0 0 0 50 0 Z" &&
                element10.absolutePath === "M 50 50 H 25 A 25 25 0 1 1 50 25 Z" &&
                element11.absolutePath === "M 0 25 Q 12.5 -25 25 25 T 50 25"
            ).toBe(true);
            done();
        });
    });
    describe('render path element without size', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let element1: PathElement;
        let element2: PathElement;
        let element3: PathElement;
        let element4: PathElement;
        let element5: PathElement;
        let element6: PathElement;
        let element7: PathElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram34' });
            document.body.appendChild(ele);
            let nodes: PathElement[];

            element1 = new PathElement();
            element1.offsetX = 300;
            element1.offsetY = 100;
            element1.style.strokeWidth = 1;
            element1.data = 'M 0,0 L 100,0 M100,0 L100,100 M100,100 L0,100 M0,100 L0,0 Z ';
            element1.style.fill = 'red';

            element2 = new PathElement();
            element2.offsetX = 700;
            element2.offsetY = 100;
            element2.data = 'M300,200 h-150 a150,150 0 1,0 150,-150 z';
            element2.style.fill = 'red';
            element2.style.strokeWidth = 1;

            element3 = new PathElement();
            element3.offsetX = 500;
            element3.offsetY = 100;
            element3.data = 'M35.2441,25 L22.7161,49.9937 L22.7161,0.00657536 L35.2441,25 z M22.7167,25 L-0.00131226,25 M35.2441,49.6337 L35.2441,0.368951 M35.2441,25 L49.9981,25';
            element3.style.fill = 'blue';
            element3.style.strokeWidth = 1;

            element4 = new PathElement();
            element4.offsetX = 350;
            element4.offsetY = 300;
            element4.data = 'M100,200 C100,100 250,100 250,200 S400,300 400,200';
            element4.style.strokeWidth = 1;

            element5 = new PathElement();
            element5.offsetX = 100;
            element5.offsetY = 100;
            element5.style.strokeWidth = 1;
            element5.data = 'M433.4624,503.8848C429.4244,493.2388,419.1354,485.6678,407.0734,485.6678C391.4884,485.6678,378.8544,498.3018,378.8544,513.8868L384.4984,513.8868C384.4984,501.4178,394.6054,491.3108,407.0734,491.3108C415.9494,491.3108,423.6264,496.4338,427.3144,503.8848L422.9114,503.8848L426.8974,508.8848L430.8824,513.8868L434.8684,508.8848L438.8544,503.8848L433.4624,503.8848z';

            element6 = new PathElement();
            element6.offsetX = 50;
            element6.offsetY = 50;
            element6.width = 50;
            element6.height = 50;
            element6.data = 'M100,200 S400,300 400,200';
            element6.style.strokeWidth = 1;

            element7 = new PathElement();
            element7.width = 75;
            element7.height = 75;
            element7.offsetX = 75;
            element7.offsetY = 75;
            element7.style.strokeWidth = 1;
            element7.data = '';//S400,300 400,200 ';

            diagram = new Diagram({
                mode: 'Canvas',
                width: 1000, height: 1000, basicElements: [element1, element2, element3, element4, element5, element6, element7]
                ,
            });
            diagram.appendTo('#diagram34');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking stack panel without children in SVG rendering Mode', (done: Function) => {
            expect(element1.absolutePath === "M 0 0 L 100 0 M 100 0 L 100 100 M 100 100 L 0 100 M 0 100 L 0 0 Z" &&
                element2.absolutePath === "M 150 150 H 0 A 150 150 0 1 0 150 0 Z" &&
                element3.absolutePath === "M 35.25 24.99 L 22.72 49.99 L 22.72 0 L 35.25 24.99 Z M 22.72 24.99 L 0 24.99 M 35.25 49.63 L 35.25 0.36 M 35.25 24.99 L 50 24.99" &&
                element4.absolutePath === "M 0 75 C 0 -25 150 -25 150 75 S 300 175 300 75" &&
                element5.absolutePath === "M 54.61 18.22 C 50.57 7.57 40.28 0 28.22 0 C 12.63 0 0 12.63 0 28.22 L 5.64 28.22 C 5.64 15.75 15.75 5.64 28.22 5.64 C 37.09 5.64 44.77 10.77 48.46 18.22 L 44.06 18.22 L 48.04 23.22 L 52.03 28.22 L 56.01 23.22 L 60 18.22 L 54.61 18.22 Z" &&
                element6.absolutePath === "M 0 0 S 50 112.5 50 0" &&
                element7.absolutePath === "").toBe(true);
            done();
        });

    });

});