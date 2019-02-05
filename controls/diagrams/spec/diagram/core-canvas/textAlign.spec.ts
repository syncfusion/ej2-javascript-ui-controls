/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { TextElement } from '../../../src/diagram/core/elements/text-element';
import { Rect } from '../../../src/diagram/primitives/rect';

/**
 * Text Align
 */
describe('Diagram Control', () => {
    describe('Text element style with Overflow', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let element1: TextElement = new TextElement();
            element1.content = 'Text element with Wrapping and Overflow Wrap';
            element1.style.color = 'red';
            element1.style.fontSize = 12;
            element1.style.textDecoration = 'LineThrough';
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.style.fill = 'transparent';
            element1.width = 200;
            element1.height = 60;
            element1.style.bold = true;
            element1.style.fontFamily = 'Arial';
            element1.style.textAlign = 'Justify';
            element1.style.textOverflow = 'Wrap';
            let element2: TextElement = new TextElement();
            element2.content = 'Text element with Wrapping and align Left';
            element2.style.color = 'red';
            element2.style.fontSize = 15;
            element2.offsetX = 400;
            element2.offsetY = 300;
            element2.style.fill = 'transparent';
            element2.width = 10;
            element2.height = 60;
            element2.style.bold = true;
            element2.style.fontFamily = 'Arial';
            element2.style.textAlign = 'Left';
            element2.style.whiteSpace = 'PreserveAll';
            element2.style.textOverflow = 'Wrap';
            let element3: TextElement = new TextElement();
            element3.content = 'Text element without Wrapping and Overflow Ellipsis';
            element3.style.color = 'blue';
            element3.style.bold = true;
            element3.style.fontSize = 12;
            element3.offsetX = 700;
            element3.offsetY = 100;
            element3.style.fill = 'transparent';
            element3.width = 200;
            element3.height = 60;
            element3.style.bold = true;
            element3.style.fontFamily = 'Arial';
            element3.style.textAlign = 'Left';
            element3.style.textOverflow = 'Ellipsis';
            element3.visible = false;
            let element4: TextElement = new TextElement();
            element4.content = 'Text element with Wrapping and TextAlign - right';
            element4.style.color = 'red';
            element4.style.fontSize = 12;
            element4.offsetX = 700;
            element4.offsetY = 300;
            element4.style.fill = 'transparent';
            element4.width = 200;
            element4.height = 60;
            element4.style.bold = true;
            element4.style.fontFamily = 'Arial';
            element4.style.textAlign = 'Right';
            let element5: TextElement = new TextElement();
            element5.content = 'Simple Text with no wrap';
            element5.style.color = 'red';
            element5.style.fontSize = 12;
            element5.offsetX = 400;
            element5.offsetY = 500;
            element5.style.fill = 'transparent';
            element5.width = 80;
            element5.height = 60;
            element5.style.textOverflow = 'Ellipsis';
            element5.style.textAlign = 'Center';
            let element6: TextElement = new TextElement();
            element6.content = 'Simple Text with\n no wrap';
            element6.style.color = 'red';
            element6.style.fontSize = 15;
            element6.offsetX = 700;
            element6.offsetY = 500;
            element6.style.fill = 'transparent';
            element6.width = 8;
            element6.height = 60;
            element6.style.textAlign = 'Center';
            element6.style.textWrapping = 'Wrap';
            let element7: TextElement = new TextElement();
            element7.content = 'Simple Text with text align Justify';
            element7.offsetX = 900;
            element7.offsetY = 100;
            element7.style.fill = 'transparent';
            element7.width = 100;
            element7.height = 60;
            element7.style.textAlign = 'Justify';
            element7.style.textOverflow = 'Ellipsis';
            let element8: Rect = new Rect(10, 10);
            let element9: Rect = new Rect(10);
            diagram = new Diagram({
                mode: 'Canvas',
                width: 1000, height: '1000px', basicElements: [element1, element2, element3, element4, element5, element6, element7]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking labels text align in SVG rendering Mode', (done: Function) => {
            done();
        });
    });
});