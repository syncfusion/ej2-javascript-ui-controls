/**
 * Circular Gauge Spec Started
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { Axis } from '../../../src/circular-gauge/axes/axis';
import { getAngleFromLocation, GaugeLocation } from '../../../src/circular-gauge/utils/helper-common';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';

describe('Circular-Gauge Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Checking whether the half and quarter circle placed in center position', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({

            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.destroy();
        });
        it('Checking start angle greater than 270 and end angle less than 360 - semi circle ', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById("container_Axis_0_Pointer_Marker_0");
                expect(ele != null).toBe(true);
                done();
            };
            gauge.axes = [{
                startAngle: 270,
                endAngle: 90,
                pointers: [{
                    value: 50,
                    type: 'Marker',
                    markerHeight: 30,
                    markerWidth: 30,
                    markerShape: 'Triangle'
                }]
            }];
            gauge.moveToCenter = true;
            gauge.refresh();
        });
        it('Checking move to center for small size gauges - semi circle ', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById("container_Axis_Group_0");
                let height : number = ele.getBoundingClientRect().height;
                let gaugeHeight: number = 186;
                expect(height >=  gaugeHeight / 2).toBe(true);                
                done();
            };
            gauge.height = '186';
            gauge.width = '209';
            gauge.refresh();
        });
        it('Checking start angle greater than 270 and end angle less than 360 - quarter circle ', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById("container_AxisLine_0");
                expect(ele != null).toBe(true);
                done();
            };
            gauge.axes = [{
                startAngle: 270,
                endAngle: 350
            }];
            gauge.height = '100%';
            gauge.width = '100%';
            gauge.refresh();
        });
        it('Checking start angle greater than 270 and end angle less than 360 - full circle ', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById("container_Axis_MajorTickLines_0");
                expect(ele != null).toBe(true);
                done();
            };
            gauge.axes = [{
                startAngle: 270,
                endAngle: 170
            }];
            gauge.refresh();
        });
        it('Checking start angle greater than 0 and end angle less than 270 - quarter circle ', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById("container_Axis_MinorTickLines_0");
                expect(ele != null).toBe(true);
                done();
            };
            gauge.axes = [{
                startAngle: 0,
                endAngle: 80
            }];
            gauge.refresh();
        });
        it('Checking start angle greater than 0 and end angle less than 270 - half circle ', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById("container_Axis_Labels_0");
                expect(ele != null).toBe(true);
                done();
            };
            gauge.axes = [{
                startAngle: 0,
                endAngle: 180
            }];
            gauge.refresh();
        });
        it('Checking start angle greater than 0 and end angle less than 270 - full circle ', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById("container_Axis_Pointers_0");
                expect(ele != null).toBe(true);
                done();
            };
            gauge.axes = [{
                startAngle: 0,
                endAngle: 270
            }];
            gauge.refresh();
        });
        it('Checking start angle greater than 90 and end angle less than 360', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById("container_Axis_Ranges_0");
                expect(ele.childElementCount === 1).toBe(true);
                done();
            };
            gauge.axes = [{
                startAngle: 90,
                endAngle: 270
            }];
            gauge.refresh();
        });
        it('Checking start angle greater than 180 and end angle less than 90', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById("container_AxesCollection");
                expect(ele.childElementCount === 1).toBe(true);
                done();
            };
            gauge.axes = [{
                startAngle: 180,
                endAngle: 360
            }];
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