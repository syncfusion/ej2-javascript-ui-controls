/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { GaugeTooltip } from '../../src/linear-gauge/user-interaction/tooltip';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { MouseEvents } from '../base/events.spec';
LinearGauge.Inject(GaugeTooltip);

describe('Linear gauge control', () => {
    describe('Checking other properties', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let targetElement: HTMLElement;
        let svg: Element;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });
        it('Checking triangle pointer', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].pointers[0].value = 50;
            gauge.axes[0].pointers[0].markerType = 'Triangle';
            gauge.refresh();
        });

        it('Checking circle pointer', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.axes[0].pointers[0].placement = 'Near';
            gauge.axes[0].pointers[0].markerType = 'Circle';
            gauge.refresh();
        });

        it('Checking circle pointer axis opposed position', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg != null).toBe(true);
            };
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });

        it('Checking right click', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_svg');
                trigger.rightClick(targetElement, 0, 0, 'touch', 1, gauge);
                done();
            };
            gauge.refresh();
        });
    });

    describe('Checking normal rectangle animation', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let timeout: number;
        let trigger: MouseEvents = new MouseEvents();
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

        it('bar animation - Vertical - Normal rectangle', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                //expect(svg != null).toBe(true);
                done();
            };
            gauge.container.type = 'Normal';
            gauge.axes[0].pointers[0].type = 'Bar';
            gauge.axes[0].pointers[0].value = 50;
            gauge.axes[0].pointers[0].animationDuration = 10;
            gauge.refresh();
        });

        it('bar animation - horizontal - Normal rectangle', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                //expect(svg != null).toBe(true);
                done();
            };
            gauge.container.type = 'Normal';
            gauge.orientation = 'Horizontal';
            gauge.axes[0].pointers[0].type = 'Bar';
            gauge.axes[0].pointers[0].value = 30;
            gauge.axes[0].pointers[0].animationDuration = 10;
            gauge.refresh();
        });
    });
});
