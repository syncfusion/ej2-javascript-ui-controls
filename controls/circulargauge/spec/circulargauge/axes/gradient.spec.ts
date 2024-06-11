/**
 * Circular Gauge Spec Started
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper-common';
import { Gradient } from '../../../src/circular-gauge/axes/gradient';
CircularGauge.Inject(Gradient);

describe('Circular-Gauge Control', () => {
    let gauge: CircularGauge;
    let svg: HTMLElement;
    let ele: HTMLElement;
    let value: string[] | string | number;
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
        it('Checking the range with lineargardient colorStop as null', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Range_0');
                expect(svg.getAttribute('fill')).toEqual('#50c917');
                done();
            };
            gauge.axes[0].ranges[0].linearGradient.colorStop = null;
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
    describe('Gauge axis Range Gradient in Circular Path', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let pathStart: HTMLElement;
        let pathEnd: HTMLElement;
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
                    startAngle: 0, endAngle: 360, minimum: 0, maximum: 120, radius: '80%',
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
                            start: 0, end: 120, startWidth: 40, endWidth: 40,
                            linearGradient:
                            {
                                colorStop: [
                                    { color: 'blue', offset: '15%', opacity: 0.9 },
                                    { color: 'orange', offset: '30%', opacity: 0.9 },
                                    { color: "red", offset: "50%", opacity: 0.9 },
                                    { color: "green", offset: "80%", opacity: 0.9 },
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
        it('Checking the circular path for blue color gradient position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('_container_svg_range_0_color_0_linearGradient');
                expect(svg.getAttribute('x1')).toBe('0%');
                expect(svg.getAttribute('x2')).toBe('100%');
                expect(svg.getAttribute('y1')).toBe('0%');
                expect(svg.getAttribute('y2')).toBe('0%');
                done();
            };
            gauge.refresh();
        });
        it('Checking the circular path for orange color gradient position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('_container_svg_range_0_color_1_linearGradient');
                expect(svg.getAttribute('x1')).toBe('0%');
                expect(svg.getAttribute('x2')).toBe('0%');
                expect(svg.getAttribute('y1')).toBe('0%');
                expect(svg.getAttribute('y2')).toBe('100%');
                done();
            };
            gauge.refresh();
        });
        it('Checking the circular path for red color gradient position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('_container_svg_range_0_color_2_linearGradient');
                expect(svg.getAttribute('x1')).toBe('0%');
                expect(svg.getAttribute('x2')).toBe('0%');
                expect(svg.getAttribute('y1')).toBe('100%');
                expect(svg.getAttribute('y2')).toBe('0%');
                done();
            };
            gauge.refresh();
        });
        it('Checking the circular path for green color gradient position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('_container_svg_range_0_color_3_linearGradient');
                expect(svg.getAttribute('x1')).toBe('0%');
                expect(svg.getAttribute('x2')).toBe('0%');
                expect(svg.getAttribute('y1')).toBe('100%');
                expect(svg.getAttribute('y2')).toBe('0%');
                done();
            };
            gauge.refresh();
        });
        it('Checking the circular path for blue color gradient position in AntiClockwise direction', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('_container_svg_range_0_color_0_linearGradient');
                expect(svg.getAttribute('x1')).toBe('100%');
                expect(svg.getAttribute('x2')).toBe('0%');
                expect(svg.getAttribute('y1')).toBe('0%');
                expect(svg.getAttribute('y2')).toBe('0%');
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.refresh();
        });
        it('Checking the circular path for orange color gradient position in AntiClockwise direction', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('_container_svg_range_0_color_1_linearGradient');
                expect(svg.getAttribute('x1')).toBe('0%');
                expect(svg.getAttribute('x2')).toBe('0%');
                expect(svg.getAttribute('y1')).toBe('0%');
                expect(svg.getAttribute('y2')).toBe('100%');
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.refresh();
        });
        it('Checking the circular path for red color gradient position in AntiClockwise direction', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('_container_svg_range_0_color_2_linearGradient');
                expect(svg.getAttribute('x1')).toBe('0%');
                expect(svg.getAttribute('x2')).toBe('0%');
                expect(svg.getAttribute('y1')).toBe('0%');
                expect(svg.getAttribute('y2')).toBe('100%');
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.refresh();
        });
        it('Checking the circular path for green color gradient position in AntiClockwise direction', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('_container_svg_range_0_color_3_linearGradient');
                expect(svg.getAttribute('x1')).toBe('0%');
                expect(svg.getAttribute('x2')).toBe('0%');
                expect(svg.getAttribute('y1')).toBe('100%');
                expect(svg.getAttribute('y2')).toBe('0%');
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.refresh();
        });
        it('Checking the circular path range with rounded corner radius in clockwise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                pathStart = document.getElementById('container_Axis_0_Range_0_Circular_0');
                value = pathStart.getAttribute('d');
                expect(value === 'M 387.74010469257166 58.22886769598617 A 167 167 0 0 1 546 225 C 545.9999999999841 224.99992713250376 505.99999999998795 224.99994458579627 506 225 A 127 127 0 0 0 385.64666644285387 98.17404908616912 C 375.54464413338593 98.04701454540324 374.45634307303504 58.06182227623893 387.74010469257166 58.22886769598617 Z' ||
                value === 'M 393.24010469257166 58.22886769598617 A 167 167 0 0 1 551.5 225 C 551.4999999999841 224.99992713250376 511.49999999998795 224.99994458579627 511.5 225 A 127 127 0 0 0 391.14666644285387 98.17404908616912 C 381.04464413338593 98.04701454540324 379.95634307303504 58.06182227623893 393.24010469257166 58.22886769598617 Z');
                pathEnd = document.getElementById('container_Axis_0_Range_0_Circular_3');
                value = pathEnd.getAttribute('d');
                expect(value === 'M 212.02543490888266 227.91455187502635 A 167 167 0 0 1 370.2598953074283 58.22886769598617 C 383.5433655648731 58.06181434631583 382.4551342918496 98.04700851486294 372.3533335571461 98.17404908616912 A 127 127 0 0 0 252.0193427151383 227.216455617535 C 252.0000000001088 225.00016624261124 212.00000000014307 225.00021860248881 212.02543490888266 227.91455187502635 Z' ||
                value === 'M 217.52543490888266 227.91455187502635 A 167 167 0 0 1 375.7598953074283 58.22886769598617 C 389.0433655648731 58.06181434631583 387.9551342918496 98.04700851486294 377.8533335571461 98.17404908616912 A 127 127 0 0 0 257.5193427151383 227.216455617535 C 257.5000000001088 225.00016624261124 217.50000000014307 225.00021860248881 217.52543490888266 227.91455187502635 Z');
                done();
            };
            gauge.axes[0].direction = 'ClockWise';
            gauge.axes[0].ranges[0].roundedCornerRadius = 10;
            gauge.refresh();
        });
        it('Checking the circular path range with rounded corner radius in anticlockwise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                pathStart = document.getElementById('container_Axis_0_Range_0_Circular_0');
                value = pathStart.getAttribute('d');
                expect(value === 'M 212.02543490888266 227.91455187502635 A 167 167 0 0 1 370.2598953074283 58.22886769598617 C 383.5433655648731 58.06181434631583 382.4551342918496 98.04700851486294 372.3533335571461 98.17404908616912 A 127 127 0 0 0 252.0193427151383 227.216455617535 C 252.0000000001088 225.00016624261124 212.00000000014307 225.00021860248881 212.02543490888266 227.91455187502635 Z' ||
                value === 'M 217.52543490888266 227.91455187502635 A 167 167 0 0 1 375.7598953074283 58.22886769598617 C 389.0433655648731 58.06181434631583 387.9551342918496 98.04700851486294 377.8533335571461 98.17404908616912 A 127 127 0 0 0 257.5193427151383 227.216455617535 C 257.5000000001088 225.00016624261124 217.50000000014307 225.00021860248881 217.52543490888266 227.91455187502635 Z');
                pathEnd = document.getElementById('container_Axis_0_Range_0_Circular_3');
                value = pathEnd.getAttribute('d');
                expect(value === 'M 387.74010469257166 58.22886769598617 A 167 167 0 0 1 546 225 C 545.9999999999841 224.99992713250376 505.99999999998795 224.99994458579627 506 225 A 127 127 0 0 0 385.64666644285387 98.17404908616912 C 375.54464413338593 98.04701454540324 374.45634307303504 58.06182227623893 387.74010469257166 58.22886769598617 Z' ||
                value === 'M 393.24010469257166 58.22886769598617 A 167 167 0 0 1 551.5 225 C 551.4999999999841 224.99992713250376 511.49999999998795 224.99994458579627 511.5 225 A 127 127 0 0 0 391.14666644285387 98.17404908616912 C 381.04464413338593 98.04701454540324 379.95634307303504 58.06182227623893 393.24010469257166 58.22886769598617 Z');
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.axes[0].ranges[0].roundedCornerRadius = 10;
            gauge.refresh();
        });
        it('Checking the circular path range with range gap in clockwise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                pathStart = document.getElementById('container_Axis_0_Range_0_Circular_0');
                value = pathStart.getAttribute('d');
                expect(value === 'M 387.74010469257166 58.22886769598617 A 167 167 0 0 1 546 225 C 545.9999999999841 224.99992713250376 505.99999999998795 224.99994458579627 506 225 A 127 127 0 0 0 385.64666644285387 98.17404908616912 C 375.54464413338593 98.04701454540324 374.45634307303504 58.06182227623893 387.74010469257166 58.22886769598617 Z' ||
                value === 'M 393.24010469257166 58.22886769598617 A 167 167 0 0 1 551.5 225 C 551.4999999999841 224.99992713250376 511.49999999998795 224.99994458579627 511.5 225 A 127 127 0 0 0 391.14666644285387 98.17404908616912 C 381.04464413338593 98.04701454540324 379.95634307303504 58.06182227623893 393.24010469257166 58.22886769598617 Z');
                pathEnd = document.getElementById('container_Axis_0_Range_0_Circular_3');
                value = pathEnd.getAttribute('d');
                expect(value === 'M 212.02543490888266 227.91455187502635 A 167 167 0 0 1 370.2598953074283 58.22886769598617 C 383.5433655648731 58.06181434631583 382.4551342918496 98.04700851486294 372.3533335571461 98.17404908616912 A 127 127 0 0 0 252.0193427151383 227.216455617535 C 252.0000000001088 225.00016624261124 212.00000000014307 225.00021860248881 212.02543490888266 227.91455187502635 Z' ||
                value === 'M 217.52543490888266 227.91455187502635 A 167 167 0 0 1 375.7598953074283 58.22886769598617 C 389.0433655648731 58.06181434631583 387.9551342918496 98.04700851486294 377.8533335571461 98.17404908616912 A 127 127 0 0 0 257.5193427151383 227.216455617535 C 257.5000000001088 225.00016624261124 217.50000000014307 225.00021860248881 217.52543490888266 227.91455187502635 Z');
                done();
            };
            gauge.axes[0].direction = 'ClockWise';
            gauge.axes[0].rangeGap = 10;
            gauge.refresh();
        });  
    });
    
    describe('Gradient Range behavior', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                animationDuration: 0,
                axes: [{
                    lineStyle: { width: 10, color: 'transparent' },
                    labelStyle: {
                        position: 'Inside', useRangeColor: true,
                        font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' },
                    }, 
                    startAngle: 0, endAngle: 360, minimum: 0, maximum: 120, radius: '80%',
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
                            start: 0, end: 50, startWidth: 40, endWidth: 40,
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
                            start: 50, end: 120, startWidth: 40, endWidth: 40,
                            linearGradient:
                            {
                                colorStop: [
                                    { color: 'blue', offset: '15%', opacity: 0.9 },
                                    { color: 'orange', offset: '30%', opacity: 0.9 },
                                    { color: "red", offset: "50%", opacity: 0.9 },
                                    { color: "green", offset: "80%", opacity: 0.9 },
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
        it('Checking the range with radialGradient innerPosition as null', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                debugger;
                svg = document.getElementById('container_Axis_0_Range_0');
                expect(svg.getAttribute('fill')).toEqual('#50c917');
                done();
            };
            debugger;
            gauge.axes[0].ranges[0].radialGradient.radius = null;
            gauge.axes[0].ranges[0].radialGradient.innerPosition = null;
            gauge.axes[0].ranges[0].radialGradient.outerPosition = null;
            gauge.axes[0].ranges[0].radialGradient.colorStop = null;            
            gauge.refresh();
        });
        it('Checking the range with linearGradient innerPosition as null', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                debugger;
                svg = document.getElementById('container_Axis_0_Range_1');
                expect(svg.getAttribute('fill')).toEqual('#27d5ff');
                done();
            };
            debugger;
            gauge.axes[0].ranges[1].linearGradient.colorStop = null;            
            gauge.refresh();
        });
    }); 
       
});