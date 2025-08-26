/**
 * Linear gauge spec document.
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs, IAxisLabelRenderEventArgs, IAnnotationRenderEventArgs, ITooltipRenderEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { Annotations } from '../../src/linear-gauge/annotations/annotations';
import { MouseEvents } from '../base/events.spec';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
LinearGauge.Inject(Annotations);

describe('Linear gauge control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('Checking Gauge Events', () => {
        let gauge: LinearGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new LinearGauge({
                title: 'Temperature Measure',
                container: {
                    width: 13,
                    roundedCornerRadius: 5,
                    type: 'Thermometer'
                },
                axes: [{
                    minimum: 0,
                    maximum: 180,
                    line: {
                        width: 2
                    },
                    labelStyle: {
                        font: {
                            color: '#000000',
                        }
                    },
                    majorTicks: {
                        interval: 20,
                    },
                    pointers: [
                        {
                            value: 90,
                            height: 13,
                            width: 13,
                            roundedCornerRadius: 5,
                            type: 'Bar',
                            color: '#f02828',
                        }
                    ],
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
            gauge.load =  (args: ILoadEventArgs): void => {
                args.gauge.axes[0].opposedPosition = true;
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_6');
                expect(gauge.axes[0].opposedPosition).toBe(true);
                done();
            };
            gauge.refresh();
        });
        it('Checking Loaded Event', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                args.gauge.container.backgroundColor = 'pink';
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Container_Group');
                expect(svg.childElementCount).toBe(1);
                expect(svg.children[0].getAttribute('fill')).toBe("pink");
                done();
            };
            gauge.axes[0].opposedPosition = false;
            gauge.container.backgroundColor = 'pink';
            gauge.refresh();
        });
        it('Checking AxisLabel Event', (done: Function) => {
            gauge.axisLabelRender = (args: IAxisLabelRenderEventArgs): void => {
                args.axis.labelStyle.font.color = 'violet';
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabelsGroup_0');
                expect(svg.childElementCount).toBe(10);
                svg = document.getElementById('container_Axis_0_Label_5');
                expect(svg.style.fill).toBe('violet');
                done();
            };
            gauge.axes[0].opposedPosition = false;
            gauge.refresh();
        });
        it('Checking Axis Label Event Text', (done: Function) => {
            gauge.axisLabelRender =  (args: IAxisLabelRenderEventArgs): void => {
                if(args.value === 60) {
                    args.text = 'sixty';
                }
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabelsGroup_0');
                expect(svg.childElementCount).toBe(10);
                svg = document.getElementById('container_Axis_0_Label_3');
                expect(svg.textContent).toBe('sixty');
                done();
            };
            gauge.axes[0].opposedPosition = false;
            gauge.refresh();
        });
    });

    describe('Checking Gauge Annotation Events', () => {
        let gauge: LinearGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new LinearGauge({
                rangePalettes: ['#30b32d', '#ffdd00', '#f03e3e'],
                orientation: 'Vertical',
                annotations: [{
                    content: 'Annotation',
                    verticalAlignment: 'Center',
                    x: 35, zIndex: '1',
                    y: 50
                }],
                axes: [{
                    maximum: 90,
                    labelStyle: {
                        font: {
                            size: '0px'
                        }   
                    },
                    line: {
                        width: 0
                    },
                    pointers: [
                        {
                            value: 35,
                            height: 15,
                            width: 15,
                            color: '#757575',
                            placement: 'Near',
                            markerType: 'Triangle',
                            offset: -50
                        }
                    ],
                    majorTicks: { interval: 10, height: 0 },
                    minorTicks: { height: 0 },
                    ranges: [
                        { start: 0, end: 30, startWidth: 50, endWidth: 50 },
                        { start: 30, end: 60, startWidth: 50, endWidth: 50 },
                        { start: 60, end: 90, startWidth: 50, endWidth: 50 }]
                }],
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            gauge.annotationsModule = null;
            ele.remove();
        });

        it('Checking Annotation Event Customization', (done: Function) => {
            gauge.annotationRender = (args: IAnnotationRenderEventArgs): void => {
                args.annotation.content = '<div id="title" style="width:200px;"><p style="font-size:18px;">CPU Utilization</p></div>';
                args.annotation.horizontalAlignment = 'Far';
                args.textStyle.size = '20px';
                args.textStyle.color = 'red';
            };
            gauge.loaded = (args: ILoadEventArgs): void => {
                svg = document.getElementById('container_Annotation_0');
                expect(svg.childElementCount).toBe(1);
                expect(svg.children[0].textContent).toBe("CPU Utilization");
               done();
            };
            gauge.annotations[0].content = "CPU Utilization";
            gauge.refresh();
        });
        it('Checking Annotation Event textStyle', (done: Function) => {
            gauge.annotationRender = (args: IAnnotationRenderEventArgs): void => {
                args.textStyle.size = '20px';
                args.textStyle.color = 'red';
                args.textStyle.fontFamily = "Times New Roman";
                args.textStyle.fontStyle = "italic";
                args.textStyle.fontWeight = "bold";
                args.textStyle.opacity = 0.5;
            };
            gauge.loaded = (args: ILoadEventArgs): void => {
                svg = document.getElementById('container_Annotation_0');
                expect(svg !== null).toBe(true);
                done();
            };
            gauge.annotations[0].content = "Annotation";
            gauge.refresh();
        });
        it('Checking Annotation Event text Content', (done: Function): void => {
            gauge.annotationRender = (args: IAnnotationRenderEventArgs): void => {
                args.content = 'Annotation';
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Annotation_0');
                expect(svg.children[0].textContent).toBe('Annotation');
                done();
            };
            gauge.refresh();
        });
        it('Checking Annotation Event text Content', (done: Function): void => {
            gauge.annotationRender = (args: IAnnotationRenderEventArgs): void => {
                args.cancel = true;
                args.content = null;
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Annotation_0');
                expect(svg == null).toBe(true);
                done();
            };
            gauge.refresh();
        });
    });

    describe('Checking Gauge tooltip Events', () => {
        let gauge: LinearGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new LinearGauge({
                container: {
                    width: 140,
                    border: {
                        width: 2,
                        color: '#a6a6a6'
                    }
                },
                tooltip: {
                    enable: true
                },
                orientation: 'Horizontal',
                axes: [
                    {
                        minimum: 0,
                        maximum: 10,
                        line: {
                            offset: 140
                        },
                        majorTicks: {
                            interval: 1
                        },
                        minorTicks: {
                            interval: 0.2
                        },
                        labelStyle: {
                            font: {
                                color: '#000000'
                            }
                        },
                        pointers: [{
                            type: 'Bar',
                            value: 5.4,
                            offset: 15,
                            color: '#ff66b3'
                        }],
                    },
                    {
                        opposedPosition: true,
                        minimum: 0,
                        maximum: 25,
                        line: {
                            offset: -140,
                        },
                        labelStyle: {
                            font: {
                                color: '#000000'
                            }
                        },
                        majorTicks: {
                            interval: 1
                        },
                        minorTicks: {
                            interval: 0.2
                        },
                        pointers: [{
                            type: 'Bar',
                            offset: -15,
                            value: 16.5,
                            color: '#4d94ff'
                        }]
                    }
                ],
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            gauge.annotationsModule = null;
            ele.remove();
        });

        it('Checking with Tooltip content', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void =>{
                if(args.pointer.value === 5.4) {
                    args.content = '5.4 Inches'
                 }
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });
        it('Checking with Tooltip Location', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void =>{
                args.location.x = 1000;
                args.location.y = 230;
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });
        it('Checking with Tooltip TextStyle', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void =>{
                args.location.x = 1000;
                args.location.y = 230;
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });
        it('Checking with Tooltip Template', (done: Function): void => {
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void =>{
                args.location.x = 1000;
                args.location.y = 230;
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });

    });
});