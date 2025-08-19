/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { MouseEvents } from '../base/events.spec';
import  {profile , inMB, getMemoryProfile} from '../common.spec';

describe('Cheking thermometer animation', () => {
    let gauge: LinearGauge;
    let element: HTMLElement;
    let svg: HTMLElement;
    let timeout: number;
    let trigger: MouseEvents = new MouseEvents();
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    beforeAll((): void => {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        //  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        element = createElement('div', { id: 'container' });
        document.body.appendChild(element);
        gauge = new LinearGauge();
        gauge.appendTo('#container');
    });
    afterAll((): void => {
        // jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
        element.remove();
    });
    it('bar animation - vertical - thermometer', () => {
        gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
            let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
            // expect(svg != null).toBe(true);
            //done();
        };
        gauge.container.type = 'Thermometer';
        gauge.axes[0].pointers[0].type = 'Bar'
        gauge.axes[0].pointers[0].value = 50;
        gauge.axes[0].pointers[0].animationDuration = 10;
        gauge.refresh();
    });

    it('bar animation - Horizontal - thermometer', () => {
        gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
            let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
            //  expect(svg != null).toBe(true);
           // done();
        };
        gauge.axes[0].pointers[0].value = 80;
        gauge.axes[0].pointers[0].animationDuration = 10;
        gauge.orientation = 'Horizontal';
        gauge.refresh();
    });
    it('bar animation - Vertical - thermometer', () => {
        gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
            let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
            //  expect(svg != null).toBe(true);
           // done();
        };
        gauge.container.width = 30;
        gauge.container.type = 'Thermometer';
        gauge.axes[0].pointers[0].type = 'Bar'
        gauge.axes[0].pointers[0].value = 50;
        gauge.axes[0].pointers[0].animationDuration = 1000;
        gauge.orientation = 'Vertical';
        gauge.refresh();
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