/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { TextElement } from '../../../src/diagram/core/elements/text-element';

/**
 * Text Element
 */
describe('Diagram Control', () => {

    let width: string = 'width';
    let height: string = 'height';

    let firstOutput: object[] = [{ width: 100, height: 100 },
    { width: 200, height: 14 }, { width: 100, height: 100 },
    { width: 100, height: 100 }, { width: 100, height: 100 },
    { width: 0, height: 0 }];

    let secondOutput: object[] = [{ width: 100, height: 100 }, { width: 317, height: 14 },
    { width: 218, height: 42 }, { width: 150, height: 100 }, { width: 150, height: 100 },
    { width: 100, height: 100 }, { width: 283, height: 42 }, { width: 165, height: 28 }];

    let thirdOutput: object[] = [
        { width: 100, height: 60 }, { width: 100, height: 60 },
        { width: 100, height: 60 }, { width: 100, height: 60 }
    ];
    describe('Text element style with width', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram46' });
            document.body.appendChild(ele);

            let element1: TextElement = new TextElement();
            element1.content = 'Text element with width/100 height/100';
            element1.style.color = 'red';
            element1.style.italic = true;
            element1.style.fontSize = 12;
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.style.fill = 'transparent';
            element1.width = 100;
            element1.height = 100;
            element1.style.bold = true;
            element1.style.fontFamily = 'Arial';
            element1.style.textAlign = 'Center';
            element1.style.textWrapping = 'WrapWithOverflow';


            let element2: TextElement = new TextElement();
            element2.content = 'Text element without width and height';
            element2.style.fontSize = 12;
            element2.style.fill = 'transparent';
            element2.offsetX = 350;
            element2.offsetY = 250;
            element2.style.textAlign = 'Center';
            element2.style.textWrapping = 'Wrap';

            let element3: TextElement = new TextElement();
            element3.content = 'Text element align with left side';
            element3.style.fill = 'transparent';
            element3.style.fontSize = 12;
            element3.offsetX = 350;
            element3.offsetY = 400;
            element3.width = 100;
            element3.height = 100;
            element3.style.textAlign = 'Left';
            element3.style.textWrapping = 'WrapWithOverflow';

            let element4: TextElement = new TextElement();
            element4.content = 'Text element align with center';
            element4.style.fontSize = 12;
            element4.style.fill = 'transparent';
            element4.offsetX = 400;
            element4.offsetY = 550;
            element4.width = 100;
            element4.height = 100;
            element4.style.textAlign = 'Center';
            element4.style.textWrapping = 'WrapWithOverflow';

            let element5: TextElement = new TextElement();
            element5.content = 'Text element align with right side';
            element5.style.fontSize = 12;
            element5.style.fill = 'transparent';
            element5.offsetX = 400;
            element5.offsetY = 700;
            element5.width = 100;
            element5.height = 100;
            element5.style.textAlign = 'Right';
            element5.style.textWrapping = 'NoWrap';

            let element6: TextElement = new TextElement();
            element6.offsetX = 400;
            element6.offsetY = 700;
            element6.style.bold = true;
            element6.style.italic = true;
            element6.style.textWrapping = 'Wrap';

            diagram = new Diagram({
                mode: 'Canvas',

                width: '1000px', height: '1000px', basicElements: [element1, element2, element3, element4,
                    element5, element6]
            });
            diagram.appendTo('#diagram46');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
    });

    describe('Text element white space and break word property', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram47' });
            document.body.appendChild(ele);

            let element7: TextElement = new TextElement();
            element7.content = 'Text element will not be wrapped - width/100';
            element7.offsetX = 400;
            element7.offsetY = 250;
            element7.style.fill = 'transparent';
            element7.width = 100;
            element7.height = 100;
            element7.style.fontSize = 12;
            element7.style.whiteSpace = 'CollapseAll';
            element7.style.textAlign = 'Center';

            let element8: TextElement = new TextElement();
            element8.content = 'Text element will not be wrapped - with out width and height';
            element8.offsetX = 250;
            element8.offsetY = 400;
            element8.style.fontSize = 12;
            element8.style.fill = 'transparent';
            element8.style.whiteSpace = 'CollapseAll';
            element8.style.textAlign = 'Center';

            let element9: TextElement = new TextElement();
            element9.content = 'Text element will be wrapped \n  on line breaks \n width and when necessary - without size';
            element9.offsetX = 250;
            element9.offsetY = 550;
            element9.style.fill = 'transparent';
            element9.style.fontSize = 12;
            element9.style.whiteSpace = 'CollapseSpace';
            element9.style.textAlign = 'Center';

            let element10: TextElement = new TextElement();
            element10.content = 'It will not collapse the        white space and \n will not wrap the text - with width and height';
            element10.offsetX = 450;
            element10.offsetY = 700;
            element10.style.fill = 'transparent';
            element10.style.fontSize = 12;
            element10.style.whiteSpace = 'PreserveAll';
            element10.width = 150;
            element10.height = 100;
            element10.style.textAlign = 'Center';

            let element11: TextElement = new TextElement();
            element11.content = 'It will not collapse the     white space and \n will wrap the text on breaks and when necessary - with width and height';
            element11.offsetX = 600;
            element11.offsetY = 100;
            element11.width = 150;
            element11.height = 100;
            element11.style.fill = 'transparent';
            element11.style.fontSize = 12;
            element11.style.whiteSpace = 'PreserveAll';
            element11.style.textAlign = 'Center';

            let element12: TextElement = new TextElement();
            element12.content = 'Text element will be wrapped based on characters with size(100)';
            element12.offsetX = 650;
            element12.offsetY = 250;
            element12.width = 100;
            element12.height = 100;
            element12.style.fill = 'transparent';
            element12.style.fontSize = 12;
            element12.style.whiteSpace = 'PreserveAll';
            element12.style.textWrapping = 'Wrap';
            element12.style.textAlign = 'Center';

            let element13: TextElement = new TextElement();
            element13.content = 'Text element(nl) \n style(nl) \ as keep-all(nl) \n and pre-line so text will be wrapped based on words ';
            element13.offsetX = 650;
            element13.offsetY = 400;
            element12.width = 100;
            element12.height = 100;
            element13.style.fontSize = 12;
            element13.style.fill = 'transparent';
            element13.style.whiteSpace = 'CollapseSpace';
            element13.style.textWrapping = 'NoWrap';
            element13.style.textAlign = 'Center';

            let element14: TextElement = new TextElement();
            element14.content = 'Text element\n style \ as wrap and preserve all';
            element14.offsetX = 600;
            element14.offsetY = 550;
            element14.style.fontSize = 12;
            element14.style.fill = 'transparent';
            element14.style.whiteSpace = 'PreserveAll';
            element14.style.textWrapping = 'WrapWithOverflow';
            element14.style.textAlign = 'Center';


            diagram = new Diagram({
                mode: 'Canvas',

                width: '1000px', height: '1000px', basicElements: [element7, element8, element9, element10,
                    element11, element12, element13, element14]
            });
            diagram.appendTo('#diagram47');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
    });
    describe('Text element style with Text Align', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            let element1: TextElement = new TextElement();
            element1.content = 'Text element with Wrapping and align - center';
            element1.style.color = 'red';
            element1.style.italic = true;
            element1.style.fontSize = 12;
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.style.fill = 'transparent';
            element1.width = 100;
            element1.height = 60;
            element1.style.bold = true;
            element1.style.fontFamily = 'Arial';
            element1.style.textAlign = 'Center';

            let element2: TextElement = new TextElement();
            element2.content = 'Text element with Wrapping and without align';
            element2.style.color = 'red';
            element2.style.italic = true;
            element2.style.fontSize = 12;
            element2.offsetX = 400;
            element2.offsetY = 300;
            element2.style.fill = 'transparent';
            element2.width = 100;
            element2.height = 60;
            element2.style.bold = true;
            element2.style.fontFamily = 'Arial';

            let element3: TextElement = new TextElement();
            element3.content = 'Text element with Wrapping and align - right';
            element3.style.color = 'blue';
            element3.style.italic = false;
            element3.style.bold = true;
            element3.style.fontSize = 12;
            element3.offsetX = 600;
            element3.offsetY = 100;
            element3.style.fill = 'transparent';
            element3.width = 100;
            element3.height = 60;
            element3.style.bold = true;
            element3.style.fontFamily = 'Arial';
            element3.style.textAlign = 'Right';

            let element4: TextElement = new TextElement();
            element4.content = 'Text element with Wrapping and align - left';
            element4.style.color = 'green';
            element4.style.italic = false;
            element4.style.bold = true;
            element4.style.fontSize = 12;
            element4.offsetX = 600;
            element4.offsetY = 300;
            element4.style.fill = 'transparent';
            element4.width = 100;
            element4.height = 60;
            element4.style.bold = true;
            element4.style.fontFamily = 'Arial';
            element4.style.textAlign = 'Left';

            diagram = new Diagram({
                mode: 'Canvas',
                width: '1000px', height: '1000px', basicElements: [element1, element2, element3, element4]

            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
    });
});