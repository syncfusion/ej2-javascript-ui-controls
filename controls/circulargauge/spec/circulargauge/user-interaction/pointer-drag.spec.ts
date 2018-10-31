/**
 * Circular Gauge pointer drag spec
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { Pointer } from '../../../src/circular-gauge/axes/axis';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';
import { MouseEvents } from './mouse-events.spec';

describe('Circular-Gauge Control', () => {
    describe('Gauge axis pointer drag - needle type', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    pointers: [{
                        color: '#b5b5b5',
                        needleTail: {
                            length: '10%'
                        },
                        pointerWidth: 8,
                        cap: {
                            color: '#b5b5b5',
                            border: {
                                width: 0,
                                color: '#DDDDDD'
                            }
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking with default pointer angle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking default drag and drop for event', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                trigger.dragAndDropEvent(ele, 200, 200, 350, 350, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking drag for needle pointer - pointer drag false', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Needle_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 300, 300, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking drag for needle pointer - pointer drag true', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Needle_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 250, 200, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(173,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(173,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(173,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(173,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(173,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(173,384.5,225)').toBe(true);
                done();
            };
            gauge.enablePointerDrag = true;
            gauge.refresh();
        });

        it('Checking drag for needle pointer - cap', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 200, 200, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(190,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(190,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(190,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(190,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(190,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(190,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue).toBe(25);
                done();
            };
            gauge.refresh();
        });

        it('Checking drag for needle pointer - tail', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 100, 100, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue == 29.375 ||
                    (<Pointer>gauge.axes[0].pointers[0]).currentValue == 29.6875).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('needle drag - AntiClock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Needle_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 250, 250, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(173,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(173,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(173,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(173,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(173,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(173,384.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.refresh();
        });

        it('cap drag - AntiClock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 200, 200, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(190,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(190,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(190,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(190,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(190,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(190,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue).toBe(75);
                done();
            };
            gauge.refresh();
        });

        it('tail drag - AntiClock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 100, 100, 'touch', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue == 70.3125 ||
                    (<Pointer>gauge.axes[0].pointers[0]).currentValue == 70.625).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking drag and drop for event - touchstart', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 125, 120, 'touchstart', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(202,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(202,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(202,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(202,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(202,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(202,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue).toBe(71.25);
                done();
            };
            gauge.refresh();
        });

        it('Checking drag and drop for event - touchmove', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 100, 190, 'touchmove', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue == 29.6875 ||
                    (<Pointer>gauge.axes[0].pointers[0]).currentValue == 29.375).toBe(true);
                done();
            };
            gauge.axes[0].direction = 'ClockWise';
            gauge.refresh();
        });

        it('Checking drag and drop for event - exceed the max value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 430, 300, 'touchmove', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(90,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(90,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(90,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(90,384.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(90,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(90,384.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].startAngle = 180;
            gauge.axes[0].endAngle = 0;
            gauge.axes[0].pointers[0].value = 0;
            gauge.refresh();
        });

        it('Checking drag and drop for event - mouse leave', () => {
            targetElement = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
            trigger.mouseLeaveEvent(ele);
            svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
            expect(svg.getAttribute('transform') == 'rotate(90,379,225)' ||
                svg.getAttribute('transform') == 'rotate(90,384.5,225)').toBe(true);
            svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
            expect(svg.getAttribute('transform') == 'rotate(90,379,225)' ||
                svg.getAttribute('transform') == 'rotate(90,384.5,225)').toBe(true);
            svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
            expect(svg.getAttribute('transform') == 'rotate(90,379,225)' ||
                svg.getAttribute('transform') == 'rotate(90,384.5,225)').toBe(true);
        });
    });

    describe('Gauge axis pointer drag - Marker', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    pointers: [{
                        type: 'Marker', color: '#b5b5b5',
                        needleTail: {
                            length: '10%'
                        },
                        pointerWidth: 8,
                        cap: {
                            color: '#b5b5b5',
                            border: {
                                width: 0,
                                color: '#DDDDDD'
                            }
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking with default pointer angle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking default drag and drop for event', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                trigger.dragAndDropEvent(ele, 200, 200, 350, 350, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking drag for marker - pointer drag false', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 300, 300, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking drag for marker - pointer drag true', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 300, 300, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(144,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(142,379,225)').toBe(true);
                done();
            };
            gauge.enablePointerDrag = true;
            gauge.refresh();
        });

        it('Checking drag for marker - triangle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 200, 200, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(190,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(190,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue).toBe(25);
                done();
            };
            gauge.axes[0].pointers[0].markerShape = 'Triangle';
            gauge.refresh();
        });

        it('Checking drag for marker - InvertedTriangle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 100, 100, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue == 29.375 ||
                    (<Pointer>gauge.axes[0].pointers[0]).currentValue == 29.6875).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].markerShape = 'InvertedTriangle';
            gauge.refresh();
        });


        it('inverted triangle - AntiClock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 300, 300, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(142,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(144,384.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.refresh();
        });

        it('rectangle - AntiClock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 200, 200, '', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(190,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(190,379,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue).toBe(75);
                done();
            };
            gauge.axes[0].pointers[0].markerShape = 'Rectangle';
            gauge.refresh();
        });

        it('diamond - AntiClock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 100, 100, 'touch', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue == 70.3125 ||
                    (<Pointer>gauge.axes[0].pointers[0]).currentValue == 70.625).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].markerShape = 'Diamond';
            gauge.refresh();
        });

        it('Checking drag and drop for event - touchstart', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 125, 120, 'touchstart', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(202,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(202,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue).toBe(71.25);
                done();
            };
            gauge.refresh();
        });

        it('Checking drag and drop for event - touchmove', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 100, 190, 'touchmove', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(205,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(204,384.5,225)').toBe(true);
                expect((<Pointer>gauge.axes[0].pointers[0]).currentValue == 29.6875 ||
                    (<Pointer>gauge.axes[0].pointers[0]).currentValue == 29.375).toBe(true);
                done();
            };
            gauge.axes[0].direction = 'ClockWise';
            gauge.axes[0].pointers[0].markerShape = 'Circle';
            gauge.refresh();
        });

        it('Checking drag and drop for event - exceed the max value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 430, 300, 'touchmove', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(90,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(90,384.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].startAngle = 180;
            gauge.axes[0].endAngle = 0;
            gauge.axes[0].pointers[0].markerShape = 'Rectangle';
            gauge.axes[0].pointers[0].value = 0;
            gauge.refresh();
        });

        it('Checking drag and drop for event - with complete circle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Marker_0');
                trigger.dragAndDropEvent(targetElement, 0, 0, 200, 300, 'touchmove', gauge);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(190.00000000000006,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(190.00000000000006,379,225)').toBe(true);
                done();
            };
            gauge.axes[0].startAngle = 0;
            gauge.axes[0].endAngle = 360;
            gauge.axes[0].pointers[0].markerShape = 'Rectangle';
            gauge.refresh();
        });

        it('Checking annotation without initializing modules', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Secondary_Element');
                expect(targetElement.childElementCount).toBe(0);
                done();
            };
            gauge.refresh();
        });

        it('Checking right click', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Secondary_Element');
                trigger.rightClick(targetElement, 0, 0, 'touch', 1, gauge);
                expect(targetElement.childElementCount).toBe(0);
                done();
            };
            gauge.refresh();
        });

        it('Checking right click failed', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Secondary_Element');
                trigger.rightClick(targetElement, 0, 0, 'touchstart', 1, gauge);
                expect(targetElement.childElementCount).toBe(0);
                done();
            };
            gauge.refresh();
        });

        it('Checking range bar animation with same angle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg != null).toBe(true);
                gauge.setPointerValue(0, 0, 80);
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[2]).toBe('225');
                expect(value[9] != '517.341748155199' || value[9] != '523.6507642262819').toBe(true);
                expect(value[10] != '124.48850455115334' || value[10] != '123.90071802806067').toBe(true);
                done();
            };
            gauge.animationComplete = null;
            gauge.axes[0].pointers[0].type = 'RangeBar';
            gauge.axes[0].startAngle = 90;
            gauge.axes[0].endAngle = 90;
            gauge.axes[0].pointers[0].value = 90;
            gauge.refresh();
        });

        it('Checking range bar animation with same angle as AntiClockWise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg != null).toBe(true);
                gauge.setPointerValue(0, 0, 80);
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] != '517.3419235806415' || value[1] != '523.6509406776042').toBe(true);
                expect(value[2] != '325.5112539967936' || value[2] != '326.099039107886').toBe(true);
                expect(value[9] == '549.9999999997395' || value[9] == '556.4999999997381').toBe(true);
                expect(value[10] == '224.99970154869797' || value[10] == '224.99969980336874').toBe(true);
                done();
            };
            gauge.animationComplete = null;
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.axes[0].pointers[0].value = 90;
            gauge.refresh();
        });

        it('Checking needle type animation with same angle as AntiClockWise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg != null).toBe(true);
                gauge.setPointerValue(0, 0, 80);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') != 'rotate(35.99998999999991,379,225)' ||
                    svg.getAttribute('transform') != 'rotate(35.99998999999991,384.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Needle';
            gauge.axes[0].pointers[0].value = 90;
            gauge.refresh();
        });
    });
});