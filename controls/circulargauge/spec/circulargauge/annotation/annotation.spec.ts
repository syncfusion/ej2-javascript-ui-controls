/**
 * Circular Gauge pointer drag spec.
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { Annotations } from '../../../src/circular-gauge/annotations/annotations';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper-common';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
CircularGauge.Inject(Annotations);

describe('Circular-Gauge Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Gauge Annotation', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let targetElement: HTMLElement;
        let template: string = '<script id=template type="text/x-template"><div>80</div></script>' +
            '<script id=template1 type="text/x-template"><div>100</div></script>';
        beforeAll((): void => {
            document.body.innerHTML = template;
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('default annotation element checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 0).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('checking annotation text', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Annotations_0');
                expect(svg.textContent).toBe('Annotation');
                done();
            };
            gauge.axes[0].annotations[0].content = 'Annotation';
            gauge.refresh();
        });

        it('checking annotation numeric text', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Annotations_0');
                expect(svg.textContent).toBe('30');
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.childElementCount == 1).toBe(true);
                expect(svg.children[0]['style'].color).toBe("red");
                expect(svg.children[0]['style']["font-size"]).toBe("50px");
                expect(svg.children[0]['style']["font-family"]).toBe("Roboto");
                done();
            };
            gauge.axes[0].annotations[0].content = '30';
            gauge.axes[0].annotations[0].textStyle = {
                    size: "50px",
                    color: "red",
                    fontFamily: "Roboto",
                    fontStyle: "Regular"
                  }
            gauge.refresh();
        })

        it('checking annotation template', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('annotation1');
                expect(svg.textContent).toBe('Annotation');
                done();
            };
            gauge.axes[0].annotations[0].content = '<div id=annotation1>Annotation</div>';
            gauge.refresh();
        });

        it('checking annotation as null', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 0).toBe(true);
                done();
            };
            gauge.axes[0].annotations[0].content = null;
            gauge.refresh();
        });

        it('checking annotation template', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.firstElementChild.textContent).toBe('80');
                done();
            };
            gauge.axes[0].annotations[0].content = '#template';
            gauge.refresh();
        });

        it('checking annotation template with rotation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.firstElementChild.textContent).toBe('80');
                done();
            };
            gauge.axes[0].annotations[0].autoAngle = true;
            gauge.refresh();
        });

        // it('checking to change annotation value using method', () => {
        //     gauge.setAnnotationValue(0, 0, '#template1')
        //     svg = document.getElementById('container_Secondary_Element');
        //     expect(svg.childElementCount == 1).toBe(true);
        //     svg = document.getElementById('container_Axis_0_Annotation_0');
        //     expect(svg.firstElementChild.textContent).toBe('100');
        // });

        it('checking to change add the annotation using method', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(true).toBe(true);
                gauge.setAnnotationValue(0, 0, '#template1');
                svg = document.getElementById('container_Annotations_0');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.firstElementChild.textContent).toBe('100');
                done();
            };
            gauge.axes[0].annotations[0].autoAngle = false;
            gauge.axes[0].annotations[0].content = null;
            gauge.refresh();
        });

        it('checking multiple annotation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Annotations_0');
                expect(svg.childElementCount == 2).toBe(true);
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.firstElementChild.textContent).toBe('100');
                svg = document.getElementById('container_Axis_0_Annotation_1');
                expect(svg.firstElementChild.textContent).toBe('80');
                done();
            };
            gauge.axes[0].annotations[0].autoAngle = false;
            gauge.axes[0].annotations[1] = {
                content: '#template',
                angle: 90,
                radius: '0%',
                autoAngle: false,
                zIndex: '1'
            };
            gauge.refresh();
        });

        it('checking svg annotation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = <HTMLElement>document.getElementById('container_Axis_0_Annotation_1').childNodes[0];
                expect(svg.nodeName).toBe('svg');
                done();
            };
            gauge.axes[0].annotations[1].content = '<svg height="100" width="100">' +
                '<circle cx="50" cy="50" r="40" stroke="black"' +
                ' stroke-width="3" fill="red" /></svg>';
            gauge.refresh();
        });

        it('checking annotation with element visibility', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = <HTMLElement>document.getElementById('container_Axis_0_Annotation_1').childNodes[0];
                expect(svg.getAttribute('display')).toBe('none');
                done();
            };
            gauge.axes[0].annotations[1].content = '<svg id="annotation_svg" display="none"' +
                ' height="100" width="100">' +
                '<circle cx="50" cy="50" r="40" stroke="black"' +
                ' stroke-width="3" fill="red" /></svg>';
            gauge.refresh();
        });
        it('checking annotation with multiple element', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = <HTMLElement>document.getElementById('container_Axis_0_Annotation_1').childNodes[0];
                expect(svg.innerHTML == 'Annotation1').toBe(true);
                svg = <HTMLElement>document.getElementById('container_Axis_0_Annotation_1').childNodes[1];
                expect(svg.innerHTML == 'Annotation2').toBe(true);
                done();
            };
            gauge.axes[0].annotations[1].content = '<div id="content1">Annotation1</div><div id="content2">Annotation2</div>';
            gauge.refresh();
        });
    });
    describe('axis boarder with background', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let boundingRect: ClientRect;
        let targetElement: HTMLElement;
        let template: string = '<script id=template type="text/x-template"><div>80</div></script>' +
            '<script id=template1 type="text/x-template"><div>100</div></script>';
        beforeAll((): void => {
            document.body.innerHTML = template;
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('default axis background', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisOuterLine_0');
                expect(svg.getAttribute('stroke')).toBe('transparent');
                expect(svg.getAttribute('stroke-width')).toBe('0');
                expect(svg.getAttribute('fill')).toBe('transparent');
                expect(svg != null).toBe(true);
                done();
            };
            gauge.axes[0].background = 'transparent';
            gauge.refresh();
        });

        it('axis background as null', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisOuterLine_0');
                expect(svg == null).toBe(true);
                done();
            };
            gauge.axes[0].background = null;
            gauge.refresh();
        });

        it('checking axis background', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisOuterLine_0');
                expect(svg.getAttribute('fill')).toBe('whitesmoke');
                done();
            };
            gauge.axes[0].background = 'whitesmoke';
            gauge.refresh();
        });
    });
    describe('annotation animation duration', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let boundingRect: ClientRect;
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 1000,
                axes: [{
                    annotations: [{
                        content: '<div style="color:#757575; font-family:Roboto; font-size:14px;">Range Bar</div>',
                        angle: 90,
                        radius: '0%',
                        autoAngle: false,
                        zIndex: '1'
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('checking with therometer with one annotation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('container_Annotations_0');
            expect(svg.childElementCount === 1).toBe(true);
        });
    });
    describe('Range animation duration', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let boundingRect: ClientRect;
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 1000,
                axes: [{
                    annotations: [{
                        content: '<div id="content" style="color:#518C03;font-size:20px;font-family:Segoe UI;font-weight:semibold;">145</div>',
                        angle: 0, radius: '0%', zIndex: '1',
                    }],
                    minimum: 0,
                    showLastLabel: true,
                    maximum: 170,
                    startAngle: 210, endAngle: 150,
                    lineStyle: { width: 2, color: '#9E9E9E' },
                    labelStyle: {
                        position: 'Outside', autoAngle: true,
                        font: { size: '10px', fontFamily: 'inherit' }
                    }, majorTicks: {
                         width: 0, height: 0, interval: 20
                    }, minorTicks: {
                        width: 0, height: 0, interval: 10
                    },
                    radius: '84%',
                    ranges: [
                        { start: 20, end: 80, color: '#8BC34A' },
                        { start: 80, end: 170 }
                    ],
                    pointers: [{
                        animation: { enable: false }, value: 145,
                        type: 'RangeBar', roundedCornerRadius: 10, pointerWidth: 7,
                        color: '#8BC34A', radius: '60%',
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('checking with annotation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('container_Annotations_0');
            expect(svg.childElementCount === 1).toBe(true);
        });
        it('checking with range', async (): Promise<void> => {
            svg = document.getElementById('container_Axis_0_Range_0');
            expect(svg.getAttribute('fill')).toBe('#8BC34A');
        });
    });
    describe('major tick animation duration', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let boundingRect: ClientRect;
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 1000,
                axes: [{
                    annotations: [{
                        content: '<div id="content" style="color:#518C03;font-size:20px;font-family:Segoe UI;font-weight:semibold;">145</div>',
                        angle: 0, radius: '0%', zIndex: '1',
                    }],
                    minimum: 0,
                    showLastLabel: true,
                    maximum: 170,
                    startAngle: 210, endAngle: 150,
                    lineStyle: { width: 2, color: '#9E9E9E' },
                    labelStyle: {
                        position: 'Outside', autoAngle: true,
                        font: { size: '10px', fontFamily: 'inherit' }
                    }, majorTicks: {
                         width: 3, height: 10, interval: 20
                    }, minorTicks: {
                        width: 0, height: 0, interval: 10
                    },
                    radius: '84%',
                    ranges: [
                        { start: 20, end: 80 },
                        { start: 80, end: 170 }
                    ],
                    pointers: [{
                        animation: { enable: false }, value: 145,
                        type: 'RangeBar', roundedCornerRadius: 10, pointerWidth: 7,
                        color: '#8BC34A', radius: '60%',
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('checking with annotation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('container_Annotations_0');
            expect(svg.childElementCount === 1).toBe(true);
        });
        it('checking with major Tick', async (): Promise<void> => {
            svg = document.getElementById('container_Axis_Major_TickLine_0_0');
            expect(svg.getAttribute('stroke')).toBe('#9E9E9E');
        });
    });
    describe('minor tick animation duration', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let boundingRect: ClientRect;
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 1000,
                axes: [{
                    annotations: [{
                        content: '<div id="content" style="color:#518C03;font-size:20px;font-family:Segoe UI;font-weight:semibold;">145</div>',
                        angle: 0, radius: '0%', zIndex: '1',
                    }],
                    minimum: 0,
                    showLastLabel: true,
                    maximum: 170,
                    startAngle: 210, endAngle: 150,
                    lineStyle: { width: 2, color: '#9E9E9E' },
                    labelStyle: {
                        position: 'Outside', autoAngle: true,
                        font: { size: '10px', fontFamily: 'inherit' }
                    }, majorTicks: {
                         width: 0, height: 0, interval: 20
                    }, minorTicks: {
                        width: 3, height: 10, interval: 10
                    },
                    radius: '84%',
                    ranges: [
                        { start: 20, end: 80 },
                        { start: 80, end: 170 }
                    ],
                    pointers: [{
                        animation: { enable: false }, value: 145,
                        type: 'RangeBar', roundedCornerRadius: 10, pointerWidth: 7,
                        color: '#8BC34A', radius: '60%',
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('checking with annotation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('container_Annotations_0');
            expect(svg.childElementCount === 1).toBe(true);
        });
        it('checking with minor Tick', async (): Promise<void> => {
            svg = document.getElementById('container_Axis_Minor_TickLine_0_0');
            expect(svg.getAttribute('stroke')).toBe('#9E9E9E');
        });
    });
    describe('axis without pointer animation duration', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let boundingRect: ClientRect;
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 1000,
                axes: [{
                    annotations: [{
                        content: '<div id="content" style="color:#518C03;font-size:20px;font-family:Segoe UI;font-weight:semibold;">145</div>',
                        angle: 0, radius: '0%', zIndex: '1',
                    }],
                    minimum: 0,
                    showLastLabel: true,
                    maximum: 170,
                    startAngle: 210, endAngle: 150,
                    lineStyle: { width: 2, color: '#9E9E9E' },
                    labelStyle: {
                        position: 'Outside', autoAngle: true,
                        font: { size: '10px', fontFamily: 'inherit' }
                    }, majorTicks: {
                         width: 0, height: 0, interval: 20
                    }, minorTicks: {
                        width: 0, height: 0, interval: 10
                    },
                    radius: '84%',
                    ranges: [
                        { start: 20, end: 80 },
                        { start: 80, end: 170 }
                    ],
                    pointers: []
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('checking with annotation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('container_Annotations_0');
            expect(svg.childElementCount === 1).toBe(true);
        });
        it('checking with range', async (): Promise<void> => {
            svg = document.getElementById('container_Axis_Pointers_0');
            expect(svg.childElementCount === 0).toBe(true);
        });
    });
    describe('axis with pointer animation duration', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let boundingRect: ClientRect;
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 1000,
                axes: [{
                    annotations: [{
                        content: '<div id="content" style="color:#518C03;font-size:20px;font-family:Segoe UI;font-weight:semibold;">145</div>',
                        angle: 0, radius: '0%', zIndex: '1',
                    }],
                    minimum: 0,
                    showLastLabel: true,
                    maximum: 170,
                    startAngle: 210, endAngle: 150,
                    lineStyle: { width: 2, color: '#9E9E9E' },
                    labelStyle: {
                        position: 'Outside', autoAngle: true,
                        font: { size: '10px', fontFamily: 'inherit' }
                    }, majorTicks: {
                         width: 0, height: 0, interval: 20
                    }, minorTicks: {
                        width: 0, height: 0, interval: 10
                    },
                    radius: '84%',
                    ranges: [
                        { start: 20, end: 80 },
                        { start: 80, end: 170 }
                    ],
                    pointers: [
                        {
                            value: 145,
                            type: 'RangeBar', roundedCornerRadius: 10, pointerWidth: 7,
                            color: '#8BC34A', radius: '60%',
                        },
                        {
                            value: 10,
                            type: 'RangeBar', roundedCornerRadius: 10, pointerWidth: 7,
                            color: '#8BC34A', radius: '40%',
                        }
                    ]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('checking with annotation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('container_Annotations_0');
            expect(svg.childElementCount === 1).toBe(true);
        });
        it('checking with range', async (): Promise<void> => {
            svg = document.getElementById('container_Axis_Pointers_0');
            expect(svg.childElementCount === 2).toBe(true);
        });
    });
    describe('axis without axisline animation duration', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let boundingRect: ClientRect;
        let targetElement: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 1000,
                axes: [{
                    annotations: [{
                        content: '<div id="content" style="color:#518C03;font-size:20px;font-family:Segoe UI;font-weight:semibold;">145</div>',
                        angle: 0, radius: '0%', zIndex: '1',
                    }],
                    minimum: 0,
                    showLastLabel: true,
                    maximum: 170,
                    startAngle: 210, endAngle: 150,
                    lineStyle: { width: 0, color: '#9E9E9E' },
                    labelStyle: {
                        position: 'Outside', autoAngle: true,
                        font: { size: '10px', fontFamily: 'inherit' }
                    }, majorTicks: {
                        width: 2, height: 20, interval: 20
                   }, minorTicks: {
                       width: 2, height: 10, interval: 10
                   },
                    radius: '84%',
                    ranges: [
                        { start: 20, end: 80 },
                        { start: 80, end: 170 }
                    ],
                    pointers: [
                        {
                            value: 145,
                            type: 'RangeBar', roundedCornerRadius: 10, pointerWidth: 7,
                            color: '#8BC34A', radius: '60%',
                        },
                        {
                            value: 10,
                            type: 'RangeBar', roundedCornerRadius: 10, pointerWidth: 7,
                            color: '#8BC34A', radius: '40%',
                        }
                    ]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('checking with annotation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('container_Annotations_0');
            expect(svg.childElementCount === 1).toBe(true);
        });
        it('checking with range', async (): Promise<void> => {
            svg = document.getElementById('container_AxisLine_0');
            expect(svg == null).toBe(true);
        });
    });
    describe('Gradient Range without pointer', () => {
        let ele: HTMLElement;
        let gauge: CircularGauge;
        let svg: HTMLElement;
        beforeAll((): void => {
           ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 0,
                axes: [{
                    direction: 'AntiClockWise',
                    lineStyle: { width: 10, color: 'transparent' },
                    labelStyle: {
                        position: 'Inside', useRangeColor: true,
                        font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' },
                    }, 
                    startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
                    majorTicks:
                    {
                    useRangeColor: true,
                    
                    },
                    minorTicks: 
                    {
                        useRangeColor: true
                        
                    },
                    rangeGap: 10,
                    ranges: [
                        {
                            roundedCornerRadius: 350,
                            start: 0, end: 40, startWidth: '20%', endWidth: '20',
                            linearGradient:
                            {
                                startValue: null,
                                endValue: null,
                                colorStop: [
                                    { color: 'blue', offset: '0', opacity: 2 }
                                ]
                            }
                        },
                        {
                            start: 40, end: 80, startWidth: 20, endWidth: 20,
                            linearGradient:
                            {
                                startValue: null,
                                endValue: null,
                                colorStop: [
                                    { color: 'green', offset: '0', opacity: 2 }
                                ]
                            }
                        }
                    ],
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('checking with annotation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('container_Axis_Pointers_0');
            expect(svg.childElementCount === 1).toBe(true);
            svg = document.getElementById('container_Axis_0_Range_1_Circular_0');
            expect(svg.getAttribute('fill')).toBe('url(#_container_svg_range_1_color_0_linearGradient)');
        });
        
    }); 
    describe('checking the load event to acheive the animation', () => {
        let ele: HTMLElement;
        let gauge: CircularGauge;
        let svg: HTMLElement;
        beforeAll((): void => {
           ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 1500,
                axes: [{
                        lineStyle: { width: 1.5, color: ' #9E9E9E' },
                        radius: '95%',
                        minimum: 0, maximum: 160, startAngle: 220, endAngle: 140,
                        pointers: [
                            {
                                value: 80, radius: '80%', color: '#333333',
                                markerHeight: 15, markerWidth: 15, type: 'Marker',
                                markerShape: 'Triangle',
                            },
                            {
                                value: 70, 
                                position: 'Cross',
                                radius: '80%', color: '#333333',
                                markerHeight: 15, markerWidth: 15, type: 'Marker',
                                markerShape: 'Text', text: '70', 
                            },
                            {
                                type: 'RangeBar',
                                value: 60,
                                radius: '70%',
                                color: '#ff5985',
                                pointerWidth: 10,
                                animation: { enable: false }
                            },
                            {
                                value: 50,
                                radius: null,
                                position:'Outside',
                                color: '#757575',
                                pointerWidth: 7,
                                cap: {
                                    radius: 8,
                                    color: '#757575',
                                    border: { width: 0 }
                                },
                                needleTail: {
                                    length: '25%'
                                }
                            }
                        ]
                    }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('checking with pointer ', async (): Promise<void> => {
            await wait(3000); // Wait for 5 seconds
            svg = document.getElementById('container_Axis_Pointers_0');
            expect(svg.childElementCount === 4).toBe(true);
        });
        it('Checking the animation and anti clock wise using the loaded event', async (): Promise<void> => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                gauge.axes[0].pointers[0].value = 90;
                gauge.axes[0].pointers[0].animation.enable = false;
                
                gauge.axes[0].pointers[1].value = 80;
                gauge.axes[0].pointers[1].animation.enable = false;
                
                gauge.axes[0].pointers[2].value = 70;
                gauge.axes[0].pointers[2].animation.enable = false;
                
                gauge.axes[0].pointers[3].value = 60;
                gauge.axes[0].pointers[3].animation.enable = false;
            }
            gauge.refresh();
            await wait(3000);
        });
        it('Checking the animation and clock wise and setPointer method', async (): Promise<void> => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                gauge.axes[0].pointers[0].value = 90;
                gauge.axes[0].pointers[0].animation.enable = false;
                
                gauge.axes[0].pointers[1].value = 80;
                gauge.axes[0].pointers[1].animation.enable = false;
                
                gauge.axes[0].pointers[2].value = 70;
                gauge.axes[0].pointers[2].animation.enable = false;
                
                gauge.axes[0].pointers[3].value = 60;
                gauge.axes[0].pointers[3].animation.enable = false;
            }
            gauge.axes[0].direction = 'ClockWise';            
            gauge.setPointerValue(0, 0, 90);
            gauge.refresh();
            await wait(3000);
        });
        it('Checking the animation and clock wise and position outside', async (): Promise<void> => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_1');
                expect(svg.getAttribute('fill')).toBe('#757575');
            }
            gauge.axes[0].direction = 'ClockWise';
            gauge.axes[0].pointers[1].radius = null;
            gauge.axes[0].pointers[1].position = 'Outside';
            gauge.refresh();
            await wait(3000);
        });
    });
    describe('coverage for helper-common', () => {
        let ele: HTMLElement;
        let gauge: CircularGauge;
        let svg: HTMLElement;
        beforeAll((): void => {
           ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 0,
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
                    minimum: 0, maximum: 160, startAngle: 0, endAngle: 336,
                    ranges: [
                        {
                            start: 0, end: 160,
                            radius: '100%',
                            startWidth: 40, endWidth: 30,
                            color: '#E0E0E0',
                            position: 'Cross'
                        },
                    ],
                    pointers: [{
                            animation: { enable: false },
                            value: 80, radius: '100%', color: '#333333',
                            markerHeight: 15, markerWidth: 15, type: 'RangeBar',
                            markerShape: 'Triangle',
                            pointerWidth: 30,
                        }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('checking with pointer ', async (): Promise<void> => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Pointers_0');
                expect(svg.childElementCount === 1).toBe(true);
            }
            gauge.refresh();
        });
        it('checking with AntiClockWise and enadAngle as 350', async (): Promise<void> => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg.getAttribute('fill')).toBe('#333333');
            }
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.axes[0].endAngle = 350;
            gauge.refresh();
        });
    })
    async function wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
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