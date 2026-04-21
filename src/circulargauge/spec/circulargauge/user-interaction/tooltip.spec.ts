/**
 * Circular Gauge pointer drag spec
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';
import { GaugeTooltip } from '../../../src/circular-gauge/user-interaction/tooltip';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper-common';
import { MouseEvents } from './mouse-events.spec';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
CircularGauge.Inject(GaugeTooltip);

describe('Circular-Gauge Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Gauge Tooltip', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        let eventObj: object;
        afterEach((): void => {
            trigger.mouseLeaveEvent(ele);
        });
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                border: { width: 1 },
                title: 'Tooltip Customization',
                axes: [{
                    background: 'transparent',
                    startAngle: 0,
                    endAngle: 360,
                    maximum: 360.000,
                    minimum: 0
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking normal tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                    eventObj = {
                        target: ele,
                        type: 'mousemove',
                        pageX: ele.getBoundingClientRect().left,
                        pageY: ele.getBoundingClientRect().top
                    }
                    gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
                }
                ele = document.getElementById('container_CircularGaugeTitle');
                eventObj = {
                    target: ele,
                    type: 'mousemove',
                    pageX: ele.getBoundingClientRect().left,
                    pageY: ele.getBoundingClientRect().top
                }
                gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 10;
            gauge.theme = 'HighContrast';
            gauge.tooltip.showAtMousePosition = true;
            gauge.refresh();
        });

        it('Checking Tooltip with roundedplace', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 120;
            gauge.axes[0].pointers[0].value = 50;
            gauge.tooltip.showAtMousePosition = false;
            gauge.axes[0].roundingPlaces = 2;
            gauge.refresh();
        });

        it('Checking Tooltip format', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.axes[0].roundingPlaces = null;
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 120;
            gauge.axes[0].pointers[0].value = 50;
            gauge.tooltip.format = '{value}%';
            gauge.tooltip.showAtMousePosition = false;
            gauge.refresh();
        });

        it('Checking Tooltip template', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 120;
            gauge.axes[0].pointers[0].value = 50;
            gauge.tooltip.showAtMousePosition = false;
            gauge.tooltip.template = '<div id="tooltip1" style="border:2px solid red;"><div class="des"><span>${value} MPH</span></div></div>';
            gauge.refresh();
        });
        it('Checking Tooltip template and vue', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                    gauge.isVue = true;
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 120;
            gauge.axes[0].pointers[0].value = 50;
            gauge.tooltip.showAtMousePosition = false;
            gauge.tooltip.template = '<div id="tooltip1" style="border:2px solid red;"><div class="des"><span>${value} MPH</span></div></div>';
            gauge.refresh();
        });

        it('Checking Tooltip template with none content', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                gauge.isVue = false;
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.template = ' ';
            gauge.refresh();
        });
    });
    describe('Gauge Range Tooltip', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        let eventObj: object;
        afterEach((): void => {
            trigger.mouseLeaveEvent(ele);
        });
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                border: { width: 1 },
                title: 'Tooltip Customization',
                axes: [{
                    background: 'transparent',
                    startAngle: 0,
                    endAngle: 360,
                    maximum: 360,
                    minimum: 0,
                    annotations: [{
                        content: '<div id="1">Circular</div>', zIndex: '1', angle: 180
                    },
                    {
                        content: '<div id="2">Guage</div>', zIndex: '1', angle: 270
                    },
                    {
                        content: '<div id="3">360</div>', zIndex: '1' , angle: 360
                    },
                    {
                        content: '<div id="4">Annotation</div>', zIndex: '1' , angle: 90
                    }],
                    ranges: [{
                        start: 0,
                        end: 61,
                        color: '#3A5DC8',
                    }, {
                        start: 60,
                        end: 120,
                        color: '#33BCBD',
                    },
                    {
                        start: 120,
                        end: 180,
                        color: '#33BCBD',
                    },
                    {
                        start: 180,
                        end: 240,
                        color: '#33BCBD',
                    },
                    {
                        start: 240,
                        end: 300,
                        color: '#33BCBD',
                    },
                    {
                        start: 300,
                        end: 360,
                        color: '#33BCBD',
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking normal Range tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('container_Axis_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'mousemove',
                        pageX: ele.getBoundingClientRect().left,
                        pageY: ele.getBoundingClientRect().top
                    }
                    gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
                }
                ele = document.getElementById('container_CircularGaugeTitle');
                eventObj = {
                    target: ele,
                    type: 'mousemove',
                    pageX: ele.getBoundingClientRect().left,
                    pageY: ele.getBoundingClientRect().top
                }
                gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
            };
            gauge.tooltip.enable = true;
            gauge.tooltip.type = ['Range'];
            gauge.theme = 'HighContrast';
            gauge.tooltip.rangeSettings.showAtMousePosition = true;
            gauge.refresh();
        });

        it('Checking Range Tooltip with roundedplace', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('container_Axis_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.axes[0].roundingPlaces = 2;
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.refresh();
        });

        it('Checking Range Tooltip with Format', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('container_Axis_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.format = '{start}%'
            gauge.refresh();
        });

        it('Checking Range Tooltip template', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('container_Axis_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = '<div id="tooltip1" style="border:2px solid red;"><div class="des"><span>${start} MPH</span></div></div>';
            gauge.refresh();
        });

        it('Checking Range Tooltip template with empty Content', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('container_Axis_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = ' ';
            gauge.refresh();
        });

        it('Checking Range Tooltip template with Content', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('container_Axis_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                    gauge.mouseMove
                }
                let tooltip = document.getElementById("container_CircularGauge_Tooltip");
                let split = tooltip.getAttribute('style').split(" ");
                expect(split[5].indexOf('-') == -1 && tooltip.getBoundingClientRect().left > 0).toBe(true);
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.width = '100';
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = '<div>Sum of Freight</div>';
            gauge.refresh();
        });

        // it('Checking pointer with range tooltip', () => {
        //     gauge.loaded = (args: ILoadedEventArgs) => {
        //         for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
        //             ele = document.getElementById('container_Axis_0_Range_' + i);
        //             eventObj = {
        //                 target: ele,
        //                 type: 'mousemove',
        //                 pageX: ele.getBoundingClientRect().left,
        //                 pageY: ele.getBoundingClientRect().top
        //             }
        //             gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
        //         }
        //         ele = document.getElementById('container_Axis_0_Pointer_0');
        //         eventObj = {
        //             target: ele,
        //             type: 'mousemove',
        //             pageX: ele.getBoundingClientRect().left,
        //             pageY: ele.getBoundingClientRect().top
        //         }
        //         gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
        //     };
        //     gauge.axes[0].pointers = [{value: 20}];
        //     gauge.tooltip.enable = true;
        //     gauge.tooltip.type = ['Range'];
        //     gauge.tooltip.rangeSettings.showAtMousePosition = true;
        //     gauge.refresh();
        // });

        it('Checking range with pointer tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('container_Axis_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'mousemove',
                        pageX: ele.getBoundingClientRect().left,
                        pageY: ele.getBoundingClientRect().top
                    }
                    gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
                }
                ele = document.getElementById('container_Axis_0_Pointer_0');
                eventObj = {
                    target: ele,
                    type: 'mousemove',
                    pageX: ele.getBoundingClientRect().left,
                    pageY: ele.getBoundingClientRect().top
                }
                gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
            };
            gauge.axes[0].pointers = [{value: 20}];
            gauge.tooltip.enable = true;
            gauge.tooltip.type = ['Pointer'];
            gauge.tooltip.rangeSettings.showAtMousePosition = true;
            gauge.refresh();
        });
        it('Checking range with pointer tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                ele = document.getElementById('container_CircularGaugeTitle');
                eventObj = {
                    target: ele,
                    type: 'touchend',
                    changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }],
                    pageX: ele.getBoundingClientRect().left,
                    pageY: ele.getBoundingClientRect().top
                }
                gauge.mouseEnd(<PointerEvent>eventObj);
            };
            gauge.title = 'Gauge with Multiple Axes Gauge with Multiple Axes Gauge with Multiple Axes Gauge with Multiple AxesGauge with Multiple Axes Gauge with Multiple AxesGauge with Multiple Axes Gauge with Multiple AxesGauge with Multiple Axes Gauge with Multiple AxesGauge with Multiple Axes Gauge with Multiple Axes';
            gauge.refresh();
        });

    });

    describe('Gauge Annotation Tooltip', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        let eventObj: object;
        afterEach((): void => {
            trigger.mouseLeaveEvent(ele);
        });
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                border: { width: 1 },
                title: 'Tooltip Customization',
                axes: [{
                    background: 'transparent',
                    startAngle: 0,
                    endAngle: 360,
                    maximum: 360,
                    minimum: 0,
                    annotations: [{
                        content: '<div id="1">Circular</div>', zIndex: '1', angle: 180
                    },
                    {
                        content: '<div id="2">Guage</div>', zIndex: '1', angle: 270
                    },
                    {
                        content: '<div id="3">360</div>', zIndex: '1' , angle: 360
                    },
                    {
                        content: '<div id="4">Annotation</div>', zIndex: '1' , angle: 90
                    }],
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking normal Annotation tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].annotations.length); i++) {
                    ele = document.getElementById('container_Axis_0_Annotation_' + i);
                    eventObj = {
                        target: ele.firstElementChild,
                        type: 'mousemove',
                        pageX: ele.getBoundingClientRect().left,
                        pageY: ele.getBoundingClientRect().top
                    }
                    gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
                }
                ele = document.getElementById('container_CircularGaugeTitle');
                eventObj = {
                    target: ele,
                    type: 'mousemove',
                    pageX: ele.getBoundingClientRect().left,
                    pageY: ele.getBoundingClientRect().top
                }
                gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
            };
            gauge.tooltip.enable = true;
            gauge.tooltip.type = ['Annotation'];
            gauge.theme = 'HighContrast';
            gauge.refresh();
        });

        it('Checking Annotation Tooltip with Format', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].annotations.length); i++) {
                    ele = document.getElementById('container_Axis_0_Annotation_' + i);
                    eventObj = {
                        target: ele.firstElementChild,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.annotationSettings.format = 'Annotation';
            gauge.refresh();
        });

        it('Checking Annotation Tooltip template', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].annotations.length); i++) {
                    ele = document.getElementById('container_Axis_0_Annotation_' + i);
                    eventObj = {
                        target: ele.firstElementChild,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.annotationSettings.template = '<div id="tooltip1" style="border:2px solid red;"><div class="des"><span> ${value} MPH</span></div></div>';
            gauge.refresh();
        });

        it('Checking Annotation Tooltip template with empty content', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].annotations.length); i++) {
                    ele = document.getElementById('container_Axis_0_Annotation_' + i);
                    eventObj = {
                        target: ele.firstElementChild,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.annotationSettings.template = ' ';
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