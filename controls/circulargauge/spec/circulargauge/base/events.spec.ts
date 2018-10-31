/**
 * Circular Gauge pointer drag spec
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper';
import { Annotations } from '../../../src/circular-gauge/annotations/annotations';
import { GaugeTooltip } from '../../../src/circular-gauge/user-interaction/tooltip';
import { MouseEvents } from '../user-interaction/mouse-events.spec';
import { IAnimationCompleteEventArgs, IAxisLabelRenderEventArgs, IMouseEventArgs } from '../../../src/circular-gauge/model/interface';
import { IAnnotationRenderEventArgs, ILoadedEventArgs, ITooltipRenderEventArgs } from '../../../src/circular-gauge/model/interface';
CircularGauge.Inject(Annotations, GaugeTooltip);

describe('Circular-Gauge Control', () => {
    describe('Checking Gauge Events', () => {
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
                enablePointerDrag: true,
                tooltip: {
                    enable: true, fill: 'white',
                    format: '####',
                    border: { color: '#ffb133', width: 1 },
                    textStyle: { color: 'black', size: '12px' }
                },
                axes: [
                    {
                        annotations: [{ content: '#akbar' }],
                        lineStyle: { width: 1, color: '#1d1d1d' },
                        labelStyle: {
                            position: 'Inside',
                            autoAngle: true, hiddenLabel: 'Last',
                            font: { color: '#1d1d1d' }
                        }, majorTicks: {
                            position: 'Inside',
                            interval: 20, width: 2,
                            height: 10, color: '#1d1d1d'
                        }, minorTicks: {
                            position: 'Inside', width: 2,
                            height: 5, interval: 5, color: '#1d1d1d'
                        },
                        minimum: 0, maximum: 120, radius: '80%',
                        startAngle: 230, endAngle: 230,
                        ranges: [{
                            radius: '90%', start: 0,
                            end: 40, color: '#27d5ff'
                        }, {
                            radius: '90%', start: 40,
                            end: 80, color: '#50c917'
                        }, {
                            radius: '90%', start: 80,
                            end: 120, color: '#ff5985'
                        }],
                        pointers: [
                            {
                                value: 60, type: 'Needle',
                                radius: '65%', pointerWidth: 10,
                                border: { width: 1.5, color: '#ffb133' },
                                cap: {
                                    radius: 10, color: 'white',
                                    border: { width: 5, color: '#ffb133' }
                                },
                                needleTail: { length: '0%' },
                                color: '#ffb133'
                            }
                        ]
                    }
                ]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            gauge.annotationsModule = null;
            ele.remove();
        });
        it('Checking Load Event', (done: Function) => {
            gauge.load = (args: ILoadedEventArgs): void => {
                args.gauge.title = 'Cricular Gauge';
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg.textContent).toBe('Cricular Gauge');
                done();
            };
            gauge.refresh();
        });

        it('Checking pointer animation event', (done: Function) => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                expect(args.pointer.pathElement.length).toBe(3);
                done();
            };
            gauge.loaded = null;
            gauge.load = null;
            gauge.refresh();
        });

        it('Checking axesLabelRender event', (done: Function) => {
            gauge.axisLabelRender = (args: IAxisLabelRenderEventArgs): void => {
                args.text = args.text + 'C';
                args.cancel = args.value > 60;
            };
            gauge.animationComplete = null;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_2');
                expect(svg.textContent).toBe('40C');
                svg = document.getElementById('container_Axis_Labels_0');
                expect(svg.childElementCount).toBe(3);
                done();
            };
            gauge.refresh();
        });

        it('Checking annotationRender event', (done: Function) => {
            gauge.annotationRender = (args: IAnnotationRenderEventArgs): void => {
                args.content = 'This is circular gauge';
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.childNodes[0].textContent).toBe('This is circular gauge');
                done();
            };
            gauge.refresh();
        });

        it('Checking annotationRender event with cancel', (done: Function) => {
            gauge.annotationRender = (args: IAnnotationRenderEventArgs): void => {
                args.cancel = true;
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount).toBe(0);
                done();
            };
            gauge.refresh();
        });

        it('Checking tooltipRender event without cancel', (done: Function) => {
            gauge.annotationRender = null;
            gauge.tooltipRender = (args: ITooltipRenderEventArgs): void => {
                args.content = 'This is pointer';
            };
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_Axis_0_Pointer_Needle_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });

        // it('Checking tooltipRender event with cancel', (done: Function) => {
        //     gauge.annotationRender = null;
        //     gauge.tooltipRender = (args: ITooltipRenderEventArgs): void => {
        //         args.cancel = true;
        //     };
        //     gauge.loaded = (args: ILoadedEventArgs): void => {
        //         expect(document.getElementsByClassName('e-tip-content')[0].textContent).toBe('This is pointer');
        //         targetElement = document.getElementById('container_Axis_0_Pointer_Needle_0');
        //         trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
        //         done();
        //     };
        //     gauge.refresh();
        // });

        it('Checking mouse move event', (done: Function) => {
            gauge.annotationRender = null;
            gauge.gaugeMouseMove = (args: IMouseEventArgs): void => {
                args.cancel = true;
            };
            gauge.tooltipRender = null;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect(document.getElementsByClassName('e-tip-content')[1]).toBe(undefined);
                targetElement = document.getElementById('container_Axis_0_Pointer_Needle_0');
                trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
                done();
            };
            gauge.refresh();
        });
    });
});