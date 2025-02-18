/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { MouseEvents } from '../base/events.spec';
import  {profile , inMB, getMemoryProfile} from '../common.spec';

describe('Linear gauge control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('Cheking bar pointer animation', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let timeout: number;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            //timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            // jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                axes: [{
                    pointers: [{
                        animationDuration: 10,
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            // jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
            element.remove();
        });

        it('bar animation ', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                // expect(svg != null).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 80;
            gauge.axes[0].pointers[0].type = 'Bar';
            gauge.refresh();
        });

        it('bar animation - axis inversed', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                // expect(svg != null).toBe(true);
                done();
            };
            gauge.axes[0].isInversed = true;
            gauge.refresh();
        });

        it('bar animation - RoundedRectangle', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                // expect(svg != null).toBe(true);
                done();
            };
            gauge.axes[0].isInversed = false;
            gauge.container.type = 'RoundedRectangle';
            gauge.axes[0].pointers[0].value = 0;
            gauge.refresh();
        });

        it('bar animation - RoundedRectangle - axis inversed', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                // expect(svg != null).toBe(true);
                done();
            };
            gauge.axes[0].isInversed = true;
            gauge.container.type = 'RoundedRectangle';
            gauge.refresh();
        });

        it('bar animation - Thermometer', () => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                // expect(svg != null).toBe(true);
                //done();
            };
            gauge.container.type = 'Thermometer';
            gauge.refresh();
        });

        it('bar animation - Thermometer - horizontal', () => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                // expect(svg != null).toBe(true);
                // done();
            };
            gauge.axes[0].pointers[0].value = 40;
            gauge.orientation = 'Horizontal';
            gauge.container.type = 'Thermometer';
            gauge.refresh();
        });

        it('bar animation - horizontal', () => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                // expect(svg != null).toBe(true);
               // done();
            };
            gauge.container.type = 'Normal';
            gauge.refresh();
        });

        it('bar animation - horizontal - axis inversed', (): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                //  expect(svg != null).toBe(true);
                //done();
            };
            gauge.axes[0].isInversed = true;
            gauge.refresh();
        });

        it('bar animation - horizontal', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                //  expect(svg != null).toBe(true);
                done();
            };
            gauge.container.type = 'RoundedRectangle';
            gauge.axes[0].isInversed = false;
            gauge.refresh();
        });

        it('bar animation - RoundedRectangle container width as zero', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                expect(svg != null).toBe(true);
                done();
            };
            gauge.container.type = 'RoundedRectangle';
            gauge.container.width = 0;
            gauge.axes[0].isInversed = false;
            gauge.refresh();
        });

        it('bar animation - Thermometer container width as zero', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_PointersGroup_0');
                expect(svg.childNodes != null).toBe(true);
                done();
            };
            gauge.container.type = 'Thermometer';
            gauge.container.width = 0;
            gauge.refresh();
        });

        // it('bar animation - vertical - thermometer', (done: Function): void => {
        //     gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
        //         let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
        //         // expect(svg != null).toBe(true);
        //         done();
        //     };
        //     gauge.orientation = 'Vertical';
        //     gauge.axes[0].pointers[0].value = 80;
        //     gauge.container.type = 'Thermometer';
        //     gauge.refresh();
        // });
        it('markerType as circle', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg != null).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].markerType = "Circle";
            gauge.axes[0].pointers[0].value = 20;
        });
        it('markerType as image', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg!= null).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].markerType = 'Image';
            gauge.axes[0].pointers[0].value = 40;
        });
        it('markerType as Triangle', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg!= null).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].markerType = 'Triangle';
            gauge.axes[0].pointers[0].value = 60;
        });
        it('markerType as Text pointer', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg!= null).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].markerType = 'Text';
            gauge.axes[0].pointers[0].value = 80;
        });
        it('markerType as Text pointer', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg!= null).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].markerType = 'Text';
            gauge.axes[0].pointers[0].animationDuration = 2000;
            gauge.setPointerValue(0, 0, 60);
        });
        it('orientation changes', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg!= null).toBe(true);
                done();
            };
            gauge.orientation = 'Vertical';
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