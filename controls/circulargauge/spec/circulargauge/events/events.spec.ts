/**
 * Circular Gauge pointer drag spec
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper';
import { Annotations } from '../../../src/circular-gauge/annotations/annotations';
import { GaugeTooltip } from '../../../src/circular-gauge/user-interaction/tooltip';
import { MouseEvents } from '../user-interaction/mouse-events.spec';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { IAnimationCompleteEventArgs, IAxisLabelRenderEventArgs, IMouseEventArgs } from '../../../src/circular-gauge/model/interface';
import { IAnnotationRenderEventArgs, ILoadedEventArgs, ITooltipRenderEventArgs } from '../../../src/circular-gauge/model/interface';
CircularGauge.Inject(Annotations, GaugeTooltip);

describe('Circular-Gauge Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Checking Gauge Events', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let svg1: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    lineStyle: { width: 10, color: 'transparent' },
                    labelStyle: {
                        position: 'Inside',
                        font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
                    }, majorTicks: { height: 10, offset: 5, color: '#9E9E9E' }, minorTicks: { height: 0 },
                    annotations: [{
                        content: '<div><span style="font-size:14px; color:#9E9E9E; font-family:Regular">Speedometer</span></div>',
                        radius: '30%', angle: 0, zIndex: '1'
                    }, {
                        content: '<div><span style="font-size:20px; color:#424242; font-family:Regular">65 MPH</span></div>',
                        radius: '40%', angle: 180, zIndex: '1'
                    }],
                    startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
                    ranges: [{ start: 0, end: 40, color: '#30B32D' }, { start: 40, end: 80, color: '#FFDD00' },
                    { start: 80, end: 120, color: '#F03E3E' }],
                    pointers: [{
                        animation: { enable: false },
                        value: 65, radius: '60%', color: '#757575', pointerWidth: 8,
                        cap: { radius: 7, color: '#757575' }, needleTail: { length: '18%' }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            gauge.annotationsModule = null;
            ele.remove();
        });
        it('Checking Load Event', (done: Function) => {
            gauge.load =  (args: ILoadedEventArgs): void => {
                args.gauge.height = '500px';
                args.gauge.width = '500px';
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_GaugeAreaClipRect__Rect');
                expect(svg.getAttribute('height')).toBe("500");
                expect(svg.getAttribute('width')).toBe("500");
                done();
            };
            gauge.refresh();
        });
        it('Checking axisLabel Event', (done: Function) => {
            gauge.axisLabelRender =  (args: IAxisLabelRenderEventArgs) => {
                args.axis.labelStyle.useRangeColor = true;
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_6');
                expect(svg.getAttribute('fill')).toBe("#FFDD00");
                svg1 = document.getElementById('container_Axis_0_Range_1');
                expect(svg1.getAttribute('fill')).toBe("#FFDD00");
                expect(svg.getAttribute('fill') === svg1.getAttribute('fill')).toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.useRangeColor = true;
            gauge.refresh();
        });
        it('Checking label cancel in axisLabel event', (done: Function) => {
            gauge.axisLabelRender =  (args: IAxisLabelRenderEventArgs) => {
                args.cancel = true;
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg === null).toBe(true);
                done();
            };
            gauge.refresh();
        });
        it('Checking Annotation Event', (done: Function) => {
            gauge.annotationRender = (args: IAnnotationRenderEventArgs) => {
                args.annotation.content = '<div><span style="font-size:20px; color:#424242; font-family:Regular">65 MPH</span></div>';
                args.annotation.radius = '40%';
                args.annotation.angle = 0;
                args.annotation.zIndex = '1';
                args.annotation.textStyle.color = 'red';
                args.annotation.textStyle.size = '14px'
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg !== null).toBe(true);
                done();
            };
            gauge.refresh();
        });
        it('Checking Annotation value Loaded Event', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                args.gauge.setAnnotationValue(0, 0, '<div><span style="font-size:20px; color:#424242; font-family:Regular">65 MPH</span></div>');
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.textContent).toBe("65 MPH");
                done();
            };
            gauge.axes[0].annotations[0].content = "65 MPH";
            gauge.refresh();
        });
        it('Checking Pointer value Loaded Event', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                args.gauge.setPointerValue(0, 0, args.gauge.axes[0].pointers[0].value);
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount).toBe(4);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('aria-label')).toBe('Pointer:50');
                done();
            };
            gauge.axes[0].background = "white";
            gauge.axes[0].pointers[0].value = 50;
            gauge.refresh();
        });
        it('Checking AxisLabel Event', (done: Function) => {
            gauge.axisLabelRender = (args: IAxisLabelRenderEventArgs): void => {
                if (args.value === 20) {
                    args.text = "twenty";
                }
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Labels_0');
                expect(svg.childElementCount).toBe(13);
                expect(svg.children[2].textContent).toBe("twenty");
                done();
            };
            gauge.axes[0].pointers[0].value = 65;
            gauge.axes[0].labelStyle.useRangeColor = false;
            gauge.refresh();
        });
        it('Checking Annotation text Event', (done: Function) => {
            gauge.annotationRender = (args: IAnnotationRenderEventArgs): void => {
                args.textStyle.color = "red";
                args.textStyle.fontFamily = "Times New Roman";
                args.textStyle.fontStyle = "italic";
                args.textStyle.fontWeight = "bold";
                args.textStyle.opacity = 0.5;
                args.textStyle.size = "25px";
            }
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Annotation_1');
                expect(svg.childElementCount).toBe(1);
                expect(svg !== null).toBe(true);
                done();
            };
            gauge.axes[0].annotations[0].content = "Annotation";
            gauge.axes[0].annotations[0].radius = "30%";
            gauge.axes[0].labelStyle.useRangeColor = false;
            gauge.refresh();
        });        
    });

    describe('Checking Gauge Events', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let svg1: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    lineStyle: { width: 10, color: 'transparent' },
                    labelStyle: {
                        position: 'Inside', useRangeColor: false,
                        font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
                    },
                    majorTicks: { height: 10, offset: 5, color: '#9E9E9E' },
                    minorTicks: { height: 0 },
                    startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
                    ranges: [
                        { start: 0, end: 40, color: '#30B32D' },
                        { start: 40, end: 80, color: '#FFDD00' },
                        { start: 80, end: 120, color: '#F03E3E' }
                    ],
                    pointers: [{
                        animation: { enable: false },
                        value: 30,
                    }]
                }],
                tooltip: { enable: true },
                
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            gauge.annotationsModule = null;
            ele.remove();
        });
        it('Checking with Tooltip content', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void => {
                args.content = 'tooltip event';
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });
        it('Checking with Tooltip textStyle', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void => {
                args.tooltip.fill = 'red';
                args.tooltip.border.color = "blue";
                args.tooltip.border.width = 1.5;
                args.tooltip.textStyle.color = "green";
                args.tooltip.textStyle.fontFamily = "Times New Roman";
                args.tooltip.textStyle.fontStyle = "italic";
                args.tooltip.textStyle.fontWeight = "Bold";
                args.tooltip.textStyle.opacity = 0.5;
                args.tooltip.textStyle.size = "25px";
                
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });
        it('Checking with Tooltip template', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void => {
                args.tooltip.template = "Pointer${Math.round(value)";
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });
        it('Checking with Tooltip Location', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void => {
                args.location.x = 600;
                args.location.y = 200
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });
        it('Checking with Tooltip position', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void => {
                args.tooltip.showAtMousePosition = true
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });
		it('Checking with Tooltip appendInBodyTag', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void => {
                args.tooltip.showAtMousePosition = true;
				args.appendInBodyTag = true;
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });
    });
    describe('Checking Gauge Events', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let svg1: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        let targetToolElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    lineStyle: { width: 10, color: 'transparent' },
                    labelStyle: {
                        position: 'Inside', useRangeColor: false,
                        font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
                    },
                    majorTicks: { height: 10, offset: 5, color: '#9E9E9E' },
                    minorTicks: { height: 0 },
                    startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
                    ranges: [
                        { start: 0, end: 40, color: '#30B32D' },
                        { start: 40, end: 80, color: '#FFDD00' },
                        { start: 80, end: 120, color: '#F03E3E' }
                    ],
                    pointers: [{
                        animation: { enable: false },
                        value: 30,
                    }]
                }],
                tooltip: { enable: true },
                
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            gauge.annotationsModule = null;
            ele.remove();
        });
        it('Checking with Tooltip appendInBodyTag', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void => {
                args.tooltip.showAtMousePosition = true;
                args.appendInBodyTag = true;
                targetToolElement = document.getElementById('container_CircularGauge_Tooltip');
                targetToolElement.style.left = '-100px';
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let element : HTMLElement = document.getElementById('container');
                element.style.left = "1530px"; 
                targetElement = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 1000, 250);
                done();
            };
            gauge.refresh();
        });
    });
});