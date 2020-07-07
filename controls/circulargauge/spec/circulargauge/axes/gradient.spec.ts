/**
 * Circular Gauge Spec Started
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper';
import { Gradient } from '../../../src/circular-gauge/axes/gradient';
CircularGauge.Inject(Gradient);

describe('Circular-Gauge Control', () => {
    let gauge: CircularGauge;
    let svg: HTMLElement;
    let ele: HTMLElement;
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Gauge axis Range Gradient properties default behavior', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let location: GaugeLocation;
        let value: string[] | string | number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
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
                    ranges: [

                        {
                            start: 0, end: 40, startWidth: 20, endWidth: 20,
                            linearGradient:
                            {
                                startValue: '0',
                                endValue: '100',
                                colorStop: [
                                    { color: 'blue', offset: '0', opacity: 2 },
                                    { color: 'orange', offset: '100', opacity: 2 }
                                ]
                            }
                        },
                        {
                            start: 40, end: 80, startWidth: 20, endWidth: 20,
                            radialGradient:
                            {
                                radius: '50',
                                innerPosition: { x: '50', y: '50' },
                                outerPosition: { x: '50', y: '50' },
                                colorStop: [
                                    { color: 'red', offset: '0', opacity: 2 },
                                    { color: 'green', offset: '100', opacity: 2 }
                                ]
                            }
                        },
                        {
                            start: 80, end: 120, startWidth: 20, endWidth: 20,
                            linearGradient:
                            {
                                startValue: '0',
                                endValue: '100',
                                colorStop: [
                                    { color: 'yellow', offset: '0' },
                                    { color: 'black', offset: '100' }
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
        it('Checking the gradient is linear gradient', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('_container_svg_3_linearGradient');
                expect(svg.getAttribute('x1')).toBe('0%');
                expect(svg.getAttribute('x2')).toBe('100%');
                expect(svg.getAttribute('y1')).toBe('0%');
                expect(svg.getAttribute('y2')).toBe('0%');
                done();
            };
            gauge.refresh();
        });
        it('Checking the gradient is radial gradient', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('_container_svg_7_radialGradient');
                expect(svg.getAttribute('cx')).toBe('50%');
                expect(svg.getAttribute('cy')).toBe('50%');
                expect(svg.getAttribute('fx')).toBe('50%');
                expect(svg.getAttribute('fy')).toBe('50%');
                expect(svg.getAttribute('r')).toBe('50%');
                done();
            };
            gauge.refresh();
        });

        it('Checking the range with multiple gradients', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Range_0');
                expect(svg.getAttribute('fill')).toBe('url(#_container_svg_9_linearGradient)');
                svg = document.getElementById('container_Axis_0_Range_1');
                expect(svg.getAttribute('fill')).toBe('url(#_container_svg_10_radialGradient)');
                svg = document.getElementById('container_Axis_0_Range_2');
                expect(svg.getAttribute('fill')).toBe('url(#_container_svg_11_linearGradient)');
                done();
            };
            gauge.refresh();
        });
    });

    describe('Gradient pointer behavior - Needle Pointer', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'gauge' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    radius: '80%',
                    pointers: [{
                        animation: { enable: false },
                        value: 60,
                        radius: '60%',
                        color: '#F8C7FD',
                        pointerWidth: 7,
                        needleStartWidth: 2,
                        needleEndWidth: 4,
                        linearGradient: {
                            startValue: '0',
                            endValue: '100',
                            colorStop: [
                                { color: 'yellow', offset: '0', opacity: 1 },
                                { color: 'blue', offset: '100', opacity: 1 },
                            ],
                        },
                        needleTail: {
                            radialGradient:
                            {
                                radius: '50%',
                                innerPosition:
                                    { x: '50%', y: '50%' },
                                outerPosition: { x: '50%', y: '50%' },
                                colorStop: [
                                    { color: 'yellow', offset: '0', opacity: 1 },
                                    { color: 'blue', offset: '100', opacity: 1 }],
                            },
                            length: '25%'
                        },
                        cap:
                        {
                            radius: 8,
                            linearGradient: {
                                startValue: '0%',
                                endValue: '100%',
                                colorStop: [
                                    { color: 'yellow', offset: '0', opacity: 1 },
                                    { color: 'blue', offset: '100', opacity: 1 },
                                ],
                            },

                        }
                    },
                    {
                        type: 'Marker',
                        value: 90,
                        linearGradient: {
                            startValue: '0',
                            endValue: '100',
                            colorStop: [
                                { color: 'blue', offset: '0', opacity: 2 },
                                { color: 'red', offset: '100', opacity: 2 }]
                        }
                    },
                    {
                        type: 'RangeBar',
                        value: 60,
                        linearGradient: {
                            startValue: '0',
                            endValue: '100',
                            colorStop: [
                                { color: 'blue', offset: '0', opacity: 2 },
                                { color: 'red', offset: '100', opacity: 2 }]
                        }
                    }
                    ]
                }]
            });
            gauge.appendTo('#gauge');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking linear gradient in needle pointer', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('_gauge_svg_5_linearGradient');
                expect(svg.getAttribute('x1')).toBe('0%');
                expect(svg.getAttribute('x2')).toBe('100%');
                expect(svg.getAttribute('y1')).toBe('0%');
                expect(svg.getAttribute('y2')).toBe('0%');
                done();
            };
            gauge.refresh();
        });

        it('Checking radial gradient in needle tail', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('_gauge_svg_11_radialGradient');
                expect(svg.getAttribute('cx')).toBe('50%');
                expect(svg.getAttribute('cy')).toBe('50%');
                expect(svg.getAttribute('fx')).toBe('50%');
                expect(svg.getAttribute('fy')).toBe('50%');
                expect(svg.getAttribute('r')).toBe('50%');
                done();
            };
            gauge.refresh();
        });

        it('Checking gradient with multiple pointers', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('fill')).toBe('url(#_gauge_svg_15_linearGradient)');
                svg = document.getElementById('gauge_Axis_0_Pointer_Marker_1');
                expect(svg.getAttribute('fill')).toBe('url(#_gauge_svg_18_linearGradient)');
                svg = document.getElementById('gauge_Axis_0_Pointer_RangeBar_2');
                expect(svg.getAttribute('fill')).toBe('url(#_gauge_svg_19_linearGradient)');
                
                done();
            };
            gauge.refresh();
        });
        it('Checking gradient with pointer cap', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('fill')).toBe('url(#_gauge_svg_22_linearGradient)');
                done();
            };
            gauge.refresh();
        });

        it('Checking gradient againts bootstrap4 theme', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('fill')).toBe('#6C757D');
                done();
            };
            gauge.theme = 'Bootstrap4';
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].linearGradient = null;
            gauge.axes[0].pointers[0].radialGradient = null;
            gauge.axes[0].pointers[0].color = null;
            gauge.refresh();
        });
      

    });  
       
});