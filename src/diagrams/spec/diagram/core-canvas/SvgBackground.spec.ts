/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { BackgroundModel } from '../../../src/diagram/diagram/page-settings-model';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';



/**
 * Path
 */
describe('Diagram Control', () => {

    describe('background element  with width and height and colour', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
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
            if (diagram) { diagram.destroy(); diagram = null; }
            if (ele && ele.parentNode) ele.parentNode.removeChild(ele);
            ele = null;
        });

        it('Checking background colour in SVG rendering Mode', (done: Function) => {
            expect(diagram.pageSettings.background.color === 'red').toBe(true);
            done();
        });
        it('memory leak', () => { 
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(100);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        })
    });
});