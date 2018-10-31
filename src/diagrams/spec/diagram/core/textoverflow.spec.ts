/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { TextElement } from '../../../src/diagram/core/elements/text-element';
import { DiagramModel } from '../../../src/diagram/index';

/**
 * Text Overflow
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
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.style.fill = 'transparent';
            element1.width = 200;
            element1.height = 60;
            element1.style.bold = true;
            element1.style.fontFamily = 'Arial';
            element1.style.textAlign = 'Center';
            element1.style.textOverflow = 'Wrap';
            let element2: TextElement = new TextElement();
            element2.content = 'Text element with Wrapping and without Overflow- Default Behaviour';
            element2.style.color = 'red';
            element2.style.fontSize = 12;
            element2.offsetX = 400;
            element2.offsetY = 300;
            element2.style.fill = 'transparent';
            element2.width = 200;
            element2.height = 60;
            element2.style.bold = true;
            element2.style.fontFamily = 'Arial';
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
            let element4: TextElement = new TextElement();
            element4.content = 'Text element without Wrapping and Overflow Clip ';
            element4.style.color = 'green';
            element4.style.bold = true;
            element4.style.fontSize = 12;
            element4.offsetX = 700;
            element4.offsetY = 300;
            element4.style.fill = 'transparent';
            element4.width = 200;
            element4.height = 60;
            element4.style.bold = true;
            element4.style.fontFamily = 'Arial';
            element4.style.textAlign = 'Left';
            element4.style.textOverflow = 'Clip';
            let element5: TextElement = new TextElement();
            element5.content = 'Smaller Text element with Ellipsis';
            element5.style.color = 'blue';
            element5.style.bold = true;
            element5.style.fontSize = 12;
            element5.offsetX = 400;
            element5.offsetY = 500;
            element5.style.fill = 'transparent';
            element5.width = 200;
            element5.height = 60;
            element5.style.bold = true;
            element5.style.fontFamily = 'Arial';
            element5.style.textAlign = 'Left';
            element5.style.textOverflow = 'Ellipsis';
            let element6: TextElement = new TextElement();
            element6.content = ' Smaller Text element with clip ';
            element6.style.color = 'green';
            element6.style.bold = true;
            element6.style.fontSize = 12;
            element6.offsetX = 700;
            element6.offsetY = 500;
            element6.style.fill = 'transparent';
            element6.width = 200;
            element6.height = 60;
            element6.style.bold = true;
            element6.style.fontFamily = 'Arial';
            element6.style.textAlign = 'Left';
            element6.style.textOverflow = 'Clip';
            let element7: TextElement = new TextElement();
            element7.content = ' Text element with Overflow clip and without size';
            element7.style.color = 'green';
            element7.style.bold = true;
            element7.style.fontSize = 12;
            element7.offsetX = 700;
            element7.offsetY = 700;
            element7.style.fill = 'transparent';
            element7.style.bold = true;
            element7.style.fontFamily = 'Arial';
            element7.style.textAlign = 'Left';
            element7.style.textOverflow = 'Clip';
            diagram = new Diagram({

                width: 1000, height: '1000px', basicElements: [element1, element2, element3, element4, element5, element6,
                    element7]
            } as DiagramModel);
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            done();
        });
    });
});