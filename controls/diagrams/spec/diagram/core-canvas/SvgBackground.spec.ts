/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { BackgroundModel } from '../../../src/diagram/diagram/page-settings-model';



/**
 * Path
 */
describe('Diagram Control', () => {

    describe('background element  with width and height and colour', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramb' });
            document.body.appendChild(ele);
            let background: BackgroundModel = { color: 'red' };
            diagram = new Diagram({
                mode: 'Canvas',
                width: 1000, height: 1000,
                pageSettings: {
                    background: background
                }
            });
            diagram.appendTo('#diagramb');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking background colour in SVG rendering Mode', (done: Function) => {
            expect(diagram.pageSettings.background.color === 'red').toBe(true);
            done();
        });
    });
});