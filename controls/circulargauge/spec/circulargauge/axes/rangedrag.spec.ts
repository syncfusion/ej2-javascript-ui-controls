import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { MouseEvents } from '../user-interaction/mouse-events.spec';

describe('Circular-Gauge Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Gauge axis Range properties checking', () => {
        let gauge: CircularGauge;
        let value: string[] | string | number;
        let ele: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
 
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                title: 'Gauge with Multiple Axes',
                enablePointerDrag : false, enableRangeDrag: true,
                titleStyle: { color: 'gray', size: '16px' },
                axes: [{
                    lineStyle: { width: 1.5, color: ' #9E9E9E' },
                    radius: '95%',
                    labelStyle: {
                        position: 'Inside', autoAngle: true,
                        hiddenLabel: 'None', font: { color: '#333333' }
                    }, majorTicks: {
                        position: 'Inside',
                        width: 2, height: 10, color: '#757575'
                    }, minorTicks: {
                        position: 'Inside', width: 2,
                        height: 5, color: '#757575'
                    },
                    minimum: 0, maximum: 160, startAngle: 220, endAngle: 140,
                      ranges: [
                             {
                                 start: 100, end: 155,roundedCornerRadius:10,
                                position: "Outside",
                                 startWidth: 40, endWidth: 40,
                                 color: 'blue',
                             },
                         ],
                        pointers: [
                                 {
                                    animation: { enable: false },
                                    value: 90, radius: '100%', color: 'green',
                                    markerHeight: 15, markerWidth: 5, type: 'RangeBar',
                                    markerShape: 'InvertedTriangle',
                                },
                                ]
                },
            ]
            });
            gauge.appendTo('#container');
        });

        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });

        it('Checking stroke of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                expect(ele.getAttribute('stroke')).toBe('blue');
                done();
            };
            gauge.refresh();
        });

        it('Checking the fill property of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                debugger;
                expect(ele.getAttribute('fill')).toBe('blue');
                done();
            };
            gauge.refresh();
        });

        it('Checking stroke-dasharray of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                debugger;
                expect(ele.getAttribute('stroke-dasharray')).toBe('0');
                done();
            };
            gauge.refresh();
        });

        it('Checking range position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById('container_Axis_0_Range_0');
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                value = ele.getAttribute('d').split(' ');
                expect((value[2] == '87.96275251328018') || (value[2] =='83.30174328517799' )).toBe(true);
                expect((value[4] == '190.4') || (value[4] =='191.82500000000002')).toBe(true);
                expect((value[5] == '190.4') || (value[5] =='191.82500000000002')).toBe(true);
                done();
            };
            gauge.axes[0].ranges[0].position = 'Inside';
            gauge.refresh();
        });

        it('Checking the opacity of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                debugger;
                expect(ele.getAttribute('opacity')).toBe('1');
                done();
            };
            gauge.refresh();
        });

    }),

    describe('Gauge axis Range properties checking when mousemoveEvent occurs', () => {
        let gauge: CircularGauge;
        let value: string[] | string | number;
        let ele: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
 
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                title: 'Gauge with Multiple Axes',
                enablePointerDrag : false, enableRangeDrag: true,
                titleStyle: { color: 'gray', size: '16px' },
                axes: [{
                    lineStyle: { width: 1.5, color: ' #9E9E9E' },
                    radius: '95%',
                    labelStyle: {
                        position: 'Inside', autoAngle: true,
                        hiddenLabel: 'None', font: { color: '#333333' }
                    }, majorTicks: {
                        position: 'Inside',
                        width: 2, height: 10, color: '#757575'
                    }, minorTicks: {
                        position: 'Inside', width: 2,
                        height: 5, color: '#757575'
                    },
                    minimum: 0, maximum: 160, startAngle: 220, endAngle: 140,
                      ranges: [
                             {
                                 start: 100, end: 155,roundedCornerRadius:10,
                                position: "Outside",
                                 startWidth: 40, endWidth: 40,
                                 color: 'blue',
                             },
                        
                         ],
                        pointers: [
                                 {
                                    animation: { enable: false },
                                    value: 90, radius: '100%', color: 'green',
                                    markerHeight: 15, markerWidth: 5, type: 'RangeBar',
                                    markerShape: 'InvertedTriangle',
                                },
                                ]
                },
            ]
            });
            gauge.appendTo('#container');
        });

        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });

        it('Checking stroke of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                expect(ele.getAttribute('stroke')).toBe('blue');
                done();
            };
            gauge.refresh();
        });

        it('Checking the fill property of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                expect(ele.getAttribute('fill')).toBe('blue');
                done();
            };
            gauge.refresh();
        });

        it('Checking stroke-dasharray of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                expect(ele.getAttribute('stroke-dasharray')).toBe('0');
                done();
            };
            gauge.refresh();
        });
       
        it('Checking range position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById('container_Axis_0_Range_0');
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                value = ele.getAttribute('d').split(' ');
                expect((value[2] == '87.96275251328018') || (value[2] =='83.30174328517799' )).toBe(true);
                expect((value[4] == '190.4') || (value[4] =='191.82500000000002')).toBe(true);
                expect((value[5] == '190.4') || (value[5] =='191.82500000000002')).toBe(true);
                done();
            };
            gauge.axes[0].ranges[0].position = 'Inside';
            gauge.refresh();
        });

        it('Checking the opacity of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                debugger;
                expect(ele.getAttribute('opacity')).toBe('1');
                done();
            };
            gauge.refresh();
        });

        it('Checking the dragging of the range with multiple range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_10");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                let path = document.getElementById("container_Axis_0_Range_10").getAttribute('d');
                expect(path != null).toBe(true);
                done();
            };
            gauge.axes = [{
                ranges:[
                    {start: 0, end: 5},{start: 5, end: 10},{start: 10, end: 15},
                    {start: 15, end: 20},{start: 20, end: 25},{start: 25, end: 30},
                    {start: 30, end: 35},{start: 35, end: 40},{start: 40, end: 45},
                    {start: 45, end: 50},{start: 50, end: 55}
                ]
            }] 
            gauge.refresh();
        });

        it('Checking the dragging of the range with align attribute', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                document.getElementById('container').setAttribute('align','center');
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                let path = document.getElementById("container_Axis_0_Range_0").getAttribute('d');
                expect(path != null).toBe(true);
                done();
                document.getElementById('container').removeAttribute('align');
            };
            gauge.axes = [{
                ranges:[
                    {start: 0, end: 5}
                ]
            }] 
            gauge.refresh();
        });

        it('Checking the dragging of the range with range start greater than range end', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                let path = document.getElementById("container_Axis_0_Range_0").getAttribute('d');
                expect(path != null).toBe(true);
                done();
            };
            gauge.axes = [{
                ranges:[
                    {start: 0, end: 5}
                ]
            }] 
            gauge.refresh();
        });

        it('Checking the dragging of the range with enablePointerDrag set as false', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                let pointer: HTMLElement = document.getElementById('container_Axis_0_Pointer_Needle_0');
                trigger.mouseupEvent(ele,382,238,382,238);
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,311,427,'touchstart',gauge);
                trigger.mousemoveEvent(ele,311,427,451,450);
                let path = document.getElementById("container_Axis_0_Range_0").getAttribute('d');
                expect(path != null).toBe(true);
                done();
            };
            gauge.enablePointerDrag = false;
            gauge.enableRangeDrag = true;
            gauge.axes = [{
                pointers:[
                   {
                       type: 'Needle',
                       value: 20
                   } 
                ],
                ranges:[
                    {start: 0, end: 5}
                ]
            }] 
            gauge.refresh();
        });
    }),

    describe('Gauge axis Range properties checking when mouseupEvent occurs', () => {
        let gauge: CircularGauge;
        let value: string[] | string | number;
        let ele: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
 
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                title: 'Gauge with Multiple Axes',
                enablePointerDrag : false, enableRangeDrag: true,
                titleStyle: { color: 'gray', size: '16px' },
                axes: [{
                    lineStyle: { width: 1.5, color: ' #9E9E9E' },
                    radius: '95%',
                    labelStyle: {
                        position: 'Inside', autoAngle: true,
                        hiddenLabel: 'None', font: { color: '#333333' }
                    }, majorTicks: {
                        position: 'Inside',
                        width: 2, height: 10, color: '#757575'
                    }, minorTicks: {
                        position: 'Inside', width: 2,
                        height: 5, color: '#757575'
                    },
                    minimum: 0, maximum: 160, startAngle: 220, endAngle: 140,
                      ranges: [
                             {
                                 start: 100, end: 155,roundedCornerRadius:10,
                                position: "Outside",
                                 startWidth: 40, endWidth: 40,
                                 color: 'blue',
                             },
                        
                         ],
                        pointers: [
                                 {
                                    animation: { enable: false },
                                    value: 90, radius: '100%', color: 'green',
                                    markerHeight: 15, markerWidth: 5, type: 'RangeBar',
                                    markerShape: 'InvertedTriangle',
                                },
                                ]
                },
            ]
            });
            gauge.appendTo('#container');
        });

        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });

        it('Checking stroke of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                trigger.mouseupEvent(ele,812,197,813,265);
                expect(ele.getAttribute('stroke')).toBe('blue');
                done();
            };
            gauge.refresh();
        });

        it('Checking the fill property of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                trigger.mouseupEvent(ele,812,197,813,265);
                expect(ele.getAttribute('fill')).toBe('blue');
                done();
            };
            gauge.refresh();
        });

        it('Checking stroke-dasharray of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                trigger.mouseupEvent(ele,812,197,813,265);
                debugger;
                expect(ele.getAttribute('stroke-dasharray')).toBe('0');
                done();
            };
            gauge.refresh();
        });
       
        it('Checking range position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                ele = document.getElementById('container_Axis_0_Range_0');
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                trigger.mouseupEvent(ele,812,197,813,265);
                value = ele.getAttribute('d').split(' ');
                expect((value[2] == '87.96275251328018') || (value[2] =='83.30174328517799' )).toBe(true);
                expect((value[4] == '190.4') || (value[4] =='191.82500000000002')).toBe(true);
                expect((value[5] == '190.4') || (value[5] =='191.82500000000002')).toBe(true);
                done();
            };
            gauge.axes[0].ranges[0].position = 'Inside';
            gauge.refresh();
        });

        it('Checking the opacity of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void =>{
                ele = document.getElementById("container_Axis_0_Range_0");
                trigger.mousedownEvent(ele,812,197,'touchstart',gauge);
                trigger.mousemoveEvent(ele,812,197,813,265);
                trigger.mouseupEvent(ele,812,197,813,265);
                debugger;
                expect(ele.getAttribute('opacity')).toBe('1');
                done();
            };
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