import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram'
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';

/**
 * Connector Property Change  spec
 */
describe('Diagram Control', () => {

    describe('Diagram property change ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
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