import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram'

/**
 * Connector Property Change  spec
 */
describe('Diagram Control', () => {

    describe('Diagram property change ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram_property_change' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: 500, height: 500
            });
            diagram.appendTo('#diagram_property_change');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connector annotation', (done: Function) => {
            diagram.width = 1000;
            diagram.height = 1000;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            expect(diagramCanvas.style.height === (diagram.height + 'px') &&
                diagramCanvas.style.width === (diagram.width + 'px')).toBe(true);
            done();
        });
    });

});