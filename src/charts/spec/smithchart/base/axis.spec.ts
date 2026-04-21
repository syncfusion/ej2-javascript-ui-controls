
import { Smithchart, ISmithchartLoadedEventArgs } from '../../../src/smithchart/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';


export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
/**
 * Legend spec
 */
describe('Smithchart axis properties tesing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Axis testing', () => {
        let id: string = 'axis';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });
        it('Horizontal axis minorGridLines as True in impedance type', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_svg_horizontalAxisMinorGridLines');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.horizontalAxis.minorGridLines.visible = true;
            smithchart.refresh();
        });
        it('Radial axis minorGridLines as True in impedance type', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_svg_radialAxisMinorGridLines');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.radialAxis.minorGridLines.visible = true;
            smithchart.refresh();
        });
        it('Horizontal axis minorGridLines as True in admittance type', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_svg_horizontalAxisMinorGridLines');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.renderType = 'Admittance';
            smithchart.horizontalAxis.minorGridLines.visible = true;
            smithchart.refresh();
        });
        it('Radial axis minorGridLines as True in admittance type', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_svg_radialAxisMinorGridLines');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.renderType = 'Admittance';
            smithchart.radialAxis.minorGridLines.visible = true;
            smithchart.refresh();
        });
        it('Horizontal axis labelPosition as inside', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_HAxisLabels');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.horizontalAxis.labelPosition = 'Inside';
            smithchart.refresh();
        });
        it('Radial axis labelPosition as inside', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_RAxisLabels');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.radialAxis.labelPosition = 'Inside';
            smithchart.refresh();
        });
        it('Horizontal axis labelIntersectAction as none', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_HAxisLabels');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.horizontalAxis.labelIntersectAction = 'None';
            smithchart.refresh();
        });
        it('Radial axis labelIntersectAction as none', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_RAxisLabels');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.radialAxis.labelIntersectAction = 'None';
            smithchart.refresh();
        });
        it('Checking Resize', () => {
           smithchart.smithchartOnResize();
           smithchart.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});