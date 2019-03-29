/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import  {profile , inMB, getMemoryProfile} from '../common.spec';

describe('Linear gauge control', () => {
    describe('linear gauge direct properties', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
        });
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });


        it('checking with ranges in vertical orientation', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg != null).toBe(true);

            };
            gauge.orientation = 'Vertical';
            gauge.axes[0].opposedPosition = false;
            gauge.axes[0].ranges = [
                {
                    start: 0,
                    end: 50,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Inside'
                },
                {
                    start: 50,
                    end: 100,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Outside'
                }
            ];
            gauge.refresh();
        });

        it('checking with ranges in opposed position', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.axes[0].opposedPosition = true;
            gauge.axes[0].ranges = [
                {
                    start: 0,
                    end: 50,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Inside'
                },
                {
                    start: 50,
                    end: 100,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Outside'
                }
            ];
            gauge.refresh();
        });
        it('checking with ranges start and end with databind', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg != null).toBe(true);
            };
            gauge.axes[0].ranges = [
                {
                    start: 10,
                    end: 40,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Inside'
                },
                {
                    start: 50,
                    end: 100,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Outside'
                }
            ];
            gauge.dataBind();
        });

        it('checking with ranges in horizontal orientation', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                // svg = document.getElementById('container_AxisIndex_0_Range_0');
                // expect(svg != null).toBe(true);
                // svg = document.getElementById('container_AxisIndex_0_Range_1');
                // expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].opposedPosition = false;
            gauge.axes[0].ranges = [
                {
                    start: 0,
                    end: 50,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Inside'
                },
                {
                    start: 50,
                    end: 100,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Outside'
                }
            ];
            gauge.refresh();

        });

        it('checking with ranges in axis opposed position', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].opposedPosition = true;
            gauge.axes[0].ranges = [
                {
                    start: 0,
                    end: 50,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Inside'
                },
                {
                    start: 50,
                    end: 100,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Outside'
                }
            ];
            gauge.refresh();
            gauge.axes[0].ranges = [{}];
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