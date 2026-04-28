/**
 * AccumulationChart legend Series Spec file
 */

import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { Legend } from '../../../src/circular-gauge/legend/legend';
import { Range, Axis } from '../../../src/circular-gauge/axes/axis';
import { ILoadedEventArgs, ILegendRenderEventArgs } from '../../../src/circular-gauge/model/interface';
import { getElement, GaugeLocation, getAngleFromLocation } from '../../../src/circular-gauge/utils/helper-common';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { MouseEvents } from '../user-interaction/mouse-events.spec';

CircularGauge.Inject(Legend);

describe('Circular-Gauge Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Legend checking for ranges', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let legendEle: Element;
        let svg: HTMLElement;
        let location: GaugeLocation;
        let value: string[] | string | number;
        let legendId: string = 'container_gauge_legend';
        let gaugeEle: Element;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                legendSettings: {
                    visible: false,
                },
                axes: [{
                    lineStyle: { width: 10, color: 'transparent' },
                    labelStyle: {
                        position: 'Inside', useRangeColor: false,
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
                    ranges: [
                        { start: 0, end: 20 },
                        { start: 20, end: 40, color: '#FFDD00' },
                        { start: 40, end: 60, color: '#F03E3E' },
                        { start: 60, end: 80, color: '#30B32D' },
                        { start: 80, end: 100, color: '#FFDD00' },
                        { start: 100, end: 120, color: '#F03E3E' }
                    ],
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
            ele.remove();
        });
        it('Legend visibility false checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_g');
                expect(legendEle).toBe(null);
                done();
            };
            gauge.refresh();
        });
        it('Legend visibility visible checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_translate_g');
                expect(legendEle.childNodes.length).toBe(6);
                expect(legendEle.childNodes.length).toBe(gauge.axes[0].ranges.length);
                done();
            };
            gauge.legendSettings.visible = true;
            gauge.refresh();
        });
        it('Legend auto position checking width is greater than height', () => {
            legendEle = getElement(legendId + '_element');
            gaugeEle = getElement('container_AxesCollection');
            expect(legendEle !== null).toBe(true);
        });
        it('Legend auto position checking while width is less than height', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                gaugeEle = getElement('container_AxesCollection');
                expect(+legendEle.getAttribute('y') > gaugeEle.getClientRects()[0].top).toBe(true);
                done();
            };
            gauge.height = '600';
            gauge.width = '400';
            gauge.refresh();
        });
        it('Legend left position checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                gaugeEle = getElement('container_AxesCollection');
                expect(+legendEle.getAttribute('x') < gaugeEle.getClientRects()[0].left).toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Left';
            gauge.height = '400';
            gauge.width = '600';
            gauge.refresh();
        });
        it('Legend Top position checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                gaugeEle = getElement('container_AxesCollection');
                expect(+legendEle.getAttribute('y') < gaugeEle.getClientRects()[0].top).toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Top';
            gauge.refresh();
        });
        it('Legend Bottom position checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                gaugeEle = getElement('container_AxesCollection');
                expect(+legendEle.getAttribute('y') > gaugeEle.getClientRects()[0].top).toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Bottom';
            gauge.refresh();
        });
        it('Legend Right position checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                gaugeEle = getElement('container_AxesCollection');
                expect(legendEle).not.toBe(null);
                done();
            };
            gauge.legendSettings.position = 'Right';
            gauge.refresh();
        });
        it('Legend Right position chekcing with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle).not.toBe(null);
                done();
            };
            gauge.legendSettings.height = '100';
            gauge.legendSettings.width = '90';
            gauge.refresh();
        });
        it('Legend Left position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('110');
                expect(legendEle.getAttribute('y')).toBe('150');
                expect(legendEle.getAttribute('height')).toBe('100');
                expect(legendEle.getAttribute('width')).toBe('90');
                done();
            };
            gauge.legendSettings.position = 'Left';
            gauge.refresh();
        });
        it('Legend Top position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('255');
                let y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(11);
                expect(legendEle.getAttribute('height')).toBe('100');
                expect(legendEle.getAttribute('width')).toBe('90');
                done();
            };
            gauge.legendSettings.position = 'Top';
            gauge.refresh();
        });
        it('Legend Bottom position chekcing with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle).not.toBe(null);
                done();
            };
            gauge.legendSettings.position = 'Bottom';
            gauge.dataBind();
        });
        it('Legend placing label Outside, legend position right, exploding length greater than gauge width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '396' || legendEle.getAttribute('x') == '400').toBe(true);

                expect(legendEle.getAttribute('y') === '124' || legendEle.getAttribute('y') == '127').toBe(true);

                expect(legendEle.getAttribute('height') === '152' || legendEle.getAttribute('height') == '146').toBe(true);

                expect(legendEle.getAttribute('width') == '94' || legendEle.getAttribute('width') == '90').toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.legendSettings.position = 'Right';
            gauge.legendSettings.height = null;
            gauge.legendSettings.width = null;
            gauge.refresh();
        });
        it('Legend placing label Outside, legend position right, exploding length less than gauge width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '496' || legendEle.getAttribute('x') == '500').toBe(true);

                expect(legendEle.getAttribute('y') === '124' || legendEle.getAttribute('y') == '127').toBe(true);

                expect(legendEle.getAttribute('height') === '152' || legendEle.getAttribute('height') == '146').toBe(true);

                expect(legendEle.getAttribute('width') == '94' || legendEle.getAttribute('width') == '90').toBe(true);
                done();
            };
            gauge.width = '800';
            gauge.refresh();
        });
        it('Legend placing label Inside, legend position left, exploding length less than gauge width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '210').toBe(true);

                expect(legendEle.getAttribute('y') === '124' || legendEle.getAttribute('y') == '127').toBe(true);

                expect(legendEle.getAttribute('height') === '152' || legendEle.getAttribute('height') == '146').toBe(true);

                expect(legendEle.getAttribute('width') == '94' || legendEle.getAttribute('width') == '90').toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Left';
            gauge.refresh();
        });
        it('Legend placing label Inside, legend position left, exploding length greater than gauge width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '110' || legendEle.getAttribute('x') == '110').toBe(true);

                expect(legendEle.getAttribute('y') === '124' || legendEle.getAttribute('y') == '127').toBe(true);

                expect(legendEle.getAttribute('height') === '152'  || legendEle.getAttribute('height') == '146').toBe(true);

                expect(legendEle.getAttribute('width') == '94' || legendEle.getAttribute('width') == '90').toBe(true);
                done();
            };
            gauge.width = '600';
            gauge.refresh();
        });
        it('Legend placing label Inside, legend position top, exploding length greater than gauge height', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '13' || legendEle.getAttribute('x') == '21').toBe(true);

                expect(legendEle.getAttribute('y') === '11' || legendEle.getAttribute('y') == '11').toBe(true);

                expect(legendEle.getAttribute('height') === '56' || legendEle.getAttribute('height') == '54').toBe(true);

                expect(legendEle.getAttribute('width') == '374' || legendEle.getAttribute('width') == '358').toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Top';
            gauge.width = '400';
            gauge.refresh();
        });
        it('Legend placing label Inside, legend position top, exploding length less than gauge height', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle).not.toBe(null);
                done();
            };
            gauge.height = '600';
            gauge.refresh();
        });
        it('Legend placing label Inside, legend position bottom, exploding length less than gauge height', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle).not.toBe(null);
                done();
            };
            gauge.legendSettings.position = 'Bottom';
            gauge.refresh();
        });
        it('Legend placing label Inside, legend position bottom, exploding length greater than gauge height', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle).not.toBe(null);
                done();
            };
            gauge.height = '400';
            gauge.refresh();
        });
        it('Legend paging feature checking for position right with default height, width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_translate_g');
                legendEle = getElement(legendId + '_pagedown');
                trigger.clickEvent(legendEle);
                legendEle = getElement(legendId + '_pagenumber');
                expect(legendEle.textContent).toBe('2/2');
                legendEle = getElement(legendId + '_element_clipPath_rect');
                expect(legendEle.getAttribute('x') == '190' || legendEle.getAttribute('x') == '200').toBe(true);
                expect(legendEle.getAttribute('y')).toBe('10');
                expect(legendEle.getAttribute('width') == '92' || legendEle.getAttribute('width') == '82').toBe(true);
                expect(legendEle.getAttribute('height') === '168' || legendEle.getAttribute('height') == '161').toBe(true);
                done();
            };
            gauge.legendSettings.height = null;
            gauge.legendSettings.width = null;
            gauge.axes = [
                {
                    lineStyle: { width: 10, color: 'transparent' },
                    labelStyle: {
                        position: 'Inside', useRangeColor: false,
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
                    ranges: [
                        { start: 0, end: 20, color: '#30B32D' },
                        { start: 20, end: 40, color: '#FFDD00' },
                        { start: 40, end: 60, color: '#F03E3E' },
                        { start: 60, end: 80, color: '#30B32D' },
                        { start: 80, end: 100, color: '#FFDD00' },
                        { start: 100, end: 120, color: '#F03E3E' }
                    ],
                    pointers: [{
                        animation: { enable: false },
                        value: 65, radius: '60%', color: '#757575', pointerWidth: 8,
                        cap: { radius: 7, color: '#757575' }, needleTail: { length: '18%' }
                    }]
                },
                {
                    lineStyle: { width: 10, color: 'transparent' },
                    labelStyle: {
                        position: 'Inside', useRangeColor: false,
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
                    ranges: [
                        { start: 0, end: 20, color: '#30B32D' },
                        { start: 20, end: 40, color: '#FFDD00' },
                        { start: 40, end: 60, color: '#F03E3E' },
                        { start: 60, end: 80, color: '#30B32D' },
                        { start: 80, end: 100, color: '#FFDD00' },
                        { start: 100, end: 120, color: '#F03E3E' }
                    ],
                    pointers: [{
                        animation: { enable: false },
                        value: 65, radius: '60%', color: '#757575', pointerWidth: 8,
                        cap: { radius: 7, color: '#757575' }, needleTail: { length: '18%' }
                    }]
                }
            ]
            gauge.legendSettings.position = 'Right';
            gauge.height = '200';
            gauge.refresh();
        });
        it('Legend paging feature checking for position bottom', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_pagedown');
                trigger.clickEvent(legendEle);
                legendEle = getElement(legendId + '_pagenumber');
                expect(legendEle.textContent).toBe('2/2');
                legendEle = getElement(legendId + '_pageup');
                trigger.clickEvent(legendEle);
                legendEle = getElement(legendId + '_pagenumber');
                expect(legendEle.textContent).toBe('1/2');
                done();
            };
            gauge.legendSettings.position = 'Bottom';
            gauge.height = '300';
            gauge.refresh();
        });
        it('Legend paging feature checking for alignment far', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement('container_gauge_legend_element');
                expect(legendEle.getAttribute('x') === '93' || legendEle.getAttribute('x') === '104').toBe(true);
                expect(legendEle.getAttribute('y') === '215' || legendEle.getAttribute('y') === '215').toBe(true);
                expect(legendEle !== null).toBe(true);
                done();
            };
            gauge.legendSettings.alignment = 'Far';
            gauge.refresh();
        });
        it('Legend toggleVisibility checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_Axis_0_text_0');
                trigger.clickEvent(legendEle);
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement(legendId + '_Axis_0_Shape_0');
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement('container_Axis_0_Range_0');
                expect(legendEle['style'].visibility === "hidden").toBe(true);
                legendEle = getElement(legendId + '_Axis_0_text_1');
                trigger.clickEvent(legendEle);
                trigger.clickEvent(legendEle);
                legendEle = getElement(legendId + '_Axis_0_text_0');
                trigger.clickEvent(legendEle);
                done();
            };
            gauge.legendSettings.alignment = 'Center';
            gauge.refresh();
        });
        it('Legend toggleVisibility false checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_Axis_0_text_0');
                trigger.clickEvent(legendEle);
                expect(legendEle.getAttribute('fill') !== "#D3D3D3").toBe(true);
                legendEle = getElement(legendId + '_Axis_0_Shape_0');
                expect(legendEle.getAttribute('fill') !== "#D3D3D3").toBe(true);
                legendEle = getElement('container_Axis_0_Range_0');
                expect(legendEle['style'].visibility !== "hidden").toBe(true);
                legendEle = getElement(legendId + '_Axis_0_text_0');
                trigger.clickEvent(legendEle);
                done();
            };
            gauge.legendSettings.toggleVisibility = false;
            gauge.refresh();
        });
        it('Legend long text trimming feature checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_Axis_0_text_0');
                expect(legendEle.textContent.indexOf('...') > -1).toBe(true);
                legendEle = getElement(legendId + '_Axis_0_text_0');
                trigger.mousemoveEvent(legendEle, 0, 0, 460, 210);
                legendEle = getElement('container_EJ2_Legend_Tooltip');
                expect(legendEle.textContent).toBe('Legend long text trimming feature checking');
                legendEle = getElement(legendId + '_Axis_0_text_1');
                trigger.mousemoveEvent(legendEle, 0, 0, 460, 210);
                legendEle = getElement('container_EJ2_Legend_Tooltip');
                expect(legendEle.textContent).toBe('Legend long text trimming feature checking');
                setTimeout(()=>{
                    legendEle = getElement('container_EJ2_Legend_Tooltip');
                    expect(legendEle === null).toBe(true);
                }, 1500)
                done();
            };
            gauge.axes[0].ranges[0].legendText = 'Legend long text trimming feature checking';
            gauge.axes[0].ranges[1].legendText = 'Legend long text trimming feature checking';
            gauge.legendSettings.position = 'Auto';
            gauge.refresh();
        });
        it('Legend with custom position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_Axis_0_text_0');
                expect(legendEle.getAttribute('x')).toBe('123');
                expect(legendEle.getAttribute('y') === '119.25' || legendEle.getAttribute('y') === '120' ).toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Custom';
            gauge.legendSettings.location = { x: 100, y: 100 };
            gauge.refresh();
        });
        it('Legend with legend render event with cancel', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_Axis_0_text_0');
                expect(legendEle === null).toBe(true);
                done();
            };
            gauge.legendRender = (args: ILegendRenderEventArgs) => {
                if (args.text === "Range 1") {
                    args.cancel = true;
                }
            };
            gauge.legendSettings.position = 'Auto';
            gauge.axes[0].ranges[0].legendText = 'Range 1';
            gauge.refresh();
        });
        it('Legend without ranges', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_Axis_0_text_0');
                expect(legendEle === null).toBe(true);
                done();
            };
            gauge.axes[0].ranges = [];
            gauge.refresh();
        });
        it('Click event without legend', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                debugger
                legendEle = getElement('container_Axis_1_Range_0');
                trigger.clickEvent(legendEle);
                expect(legendEle['style'].visibility !== "hidden").toBe(true);
                done();
            };
            gauge.legendSettings.visible = false;
            gauge.refresh();
        });
        it('Legend single ranges', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                gauge.loaded = null;
                legendEle = getElement(legendId + '_Axis_0_text_1');
                expect(legendEle === null).toBe(true);
                done();
            };
            gauge.legendSettings.visible = true;
            gauge.axes[0].ranges = [{
                start: 0, end: 20
            }, {
                start: null, end: null
            }];
            gauge.refresh();
        });
        it('Legend toggleVisibility shape color checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_Axis_0_text_3');
                trigger.clickEvent(legendEle);
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement(legendId + '_Axis_0_Shape_3');
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement('container_Axis_0_Range_3');
                expect(legendEle['style'].visibility === "hidden").toBe(true);
                done();
            };
            gauge.axes = [{
                ranges:[
                { start: 0, end: 20, color: '#ccffff', legendText: 'Light air'},
                { start: 11, end: 11, color: '#99ffff', legendText: 'Light breeze' },
                { start: 11, end: 19, color: '#99ff99', legendText: 'Gentle breeze' },
                { start: 19, end: 28, color: '#79ff4d', legendText: 'Moderate breeze' },
                ],
            }];
            gauge.legendSettings.toggleVisibility = true;
            gauge.legendSettings.alignment = 'Center';
            gauge.refresh();
        });
        it('Legend range rendering with setRangeValue method', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                gauge.setRangeValue(0, 3, 19, 25);
                legendEle = getElement(legendId + '_Axis_0_text_3');
                trigger.clickEvent(legendEle);
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement(legendId + '_Axis_0_Shape_3');
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement('container_Axis_0_Range_3');
                expect(legendEle['style'].visibility === "hidden").toBe(true);
                done();
            };
            gauge.axes = [{
                ranges:[
                { start: 0, end: 5, color: '#ccffff', legendText: 'Light air'},
                { start: 5, end: 11, color: '#99ffff', legendText: 'Light breeze' },
                { start: 11, end: 19, color: '#99ff99', legendText: 'Gentle breeze' },
                { start: 19, end: 19, color: '#79ff4d', legendText: 'Moderate breeze' },
                ],
            }];
            gauge.legendSettings.toggleVisibility = true;
            gauge.legendSettings.alignment = 'Center';
            gauge.refresh();
        });
        it('Legend range rendering with range greater than axis maximum', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_Axis_0_text_0');
                trigger.clickEvent(legendEle);
                legendEle = getElement(legendId + '_Axis_0_Shape_1');
                trigger.clickEvent(legendEle);
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                trigger.clickEvent(legendEle);
                legendEle = getElement(legendId + '_Axis_0_Shape_1');
                expect(legendEle.getAttribute('fill') === "#99ffff").toBe(true);
                done();
            };
            gauge.axes = [{
                minimum: 0,
                maximum: 50,
                ranges:[
                { start: 60, end: 100, color: '#ccffff', legendText: 'Light air'},
                { start: 0, end: 30, color: '#99ffff', legendText: 'Light breeze' },
                ],
            }];
            gauge.legendSettings.toggleVisibility = true;
            gauge.legendSettings.alignment = 'Center';
            gauge.refresh();
        });
        it('Legend Top and range rendering with setRangeValue method', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                gauge.setRangeValue(0, 3, 19, 25);
                legendEle = getElement(legendId + '_Axis_0_text_3');
                trigger.clickEvent(legendEle);
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement(legendId + '_Axis_0_Shape_3');
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement('container_Axis_0_Range_3');
                expect(legendEle['style'].visibility === "hidden").toBe(true);
                done();
            };
            gauge.axes = [{
                ranges:[
                { start: 0, end: 5, color: '#ccffff', legendText: 'Light air'},
                { start: 5, end: 11, color: '#99ffff', legendText: 'Light breeze' },
                { start: 11, end: 19, color: '#99ff99', legendText: 'Gentle breeze' },
                { start: 19, end: 19, color: '#79ff4d', legendText: 'Moderate breeze' },
                ],
            }];
            gauge.legendSettings.toggleVisibility = true;
            gauge.legendSettings.alignment = 'Center';
            gauge.legendSettings.position = 'Top';
            gauge.refresh();
        });
        it('Legend Bottom and range rendering with setRangeValue method', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                gauge.setRangeValue(0, 3, 19, 25);
                legendEle = getElement(legendId + '_Axis_0_text_3');
                trigger.clickEvent(legendEle);
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement(legendId + '_Axis_0_Shape_3');
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement('container_Axis_0_Range_3');
                expect(legendEle['style'].visibility === "hidden").toBe(true);
                done();
            };
            gauge.axes = [{
                ranges:[
                { start: 0, end: 5, color: '#ccffff', legendText: 'Light air'},
                { start: 5, end: 11, color: '#99ffff', legendText: 'Light breeze' },
                { start: 11, end: 19, color: '#99ff99', legendText: 'Gentle breeze' },
                { start: 19, end: 19, color: '#79ff4d', legendText: 'Moderate breeze' },
                ],
            }];
            gauge.legendSettings.toggleVisibility = true;
            gauge.legendSettings.alignment = 'Center';
            gauge.legendSettings.position = 'Bottom';
            gauge.refresh();
        });
        it('Legend left and range rendering with setRangeValue method', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                gauge.setRangeValue(0, 3, 19, 25);
                legendEle = getElement(legendId + '_Axis_0_text_3');
                trigger.clickEvent(legendEle);
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement(legendId + '_Axis_0_Shape_3');
                expect(legendEle.getAttribute('fill') === "#D3D3D3").toBe(true);
                legendEle = getElement('container_Axis_0_Range_3');
                expect(legendEle['style'].visibility === "hidden").toBe(true);
                done();
            };
            gauge.axes = [{
                ranges:[
                { start: 0, end: 5, color: '#ccffff', legendText: 'Light air'},
                { start: 5, end: 11, color: '#99ffff', legendText: 'Light breeze' },
                { start: 11, end: 19, color: '#99ff99', legendText: 'Gentle breeze' },
                { start: 19, end: 19, color: '#79ff4d', legendText: 'Moderate breeze' },
                ],
            }];
            gauge.legendSettings.toggleVisibility = true;
            gauge.legendSettings.alignment = 'Center';
            gauge.legendSettings.position = 'Left';
            gauge.refresh();
        });
    });
    describe('Legend checking for enableRtl', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let legendEle: Element;
        let svg: HTMLElement;
        let location: GaugeLocation;
        let value: string[] | string | number;
        let legendId: string = 'container_gauge_legend';
        let gaugeEle: Element;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                title: 'Measure of wind speed in Km/h',
                 titleStyle: {
                     fontFamily: 'Segoe UI',
                 },
             axes: [{
                 lineStyle: {
                     width: 0,
                     color: '#E0E0E0',
                 },
                 labelStyle: {
                     font: {
                         fontFamily: 'inherit',
                         size: '0px',
                     },
                     offset: -1,
                 },
                 majorTicks: { width: 0, height: 0 },
                 minorTicks: { width: 0, height: 0 },
                 ranges: [
                     {
                         start: 0,
                         end: 20,
                         startWidth: 20,
                         endWidth: 20,
                         radius: '100%',
                         color: '#ffd54f',
                     },
                     {
                         start: 20,
                         end: 40,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 40,
                         end: 60,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 60,
                         end: 70,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 70,
                         end: 80,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 80,
                         end: 90,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 90,
                         end: 95,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 95,
                         end: 100,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                 ],
                 pointers: [{
                     value: 60,
                     radius: '60%',
                     pointerWidth: 22,
                     color: '#ffe082',
                     animation: {
                         enable: true,
                         duration: 500,
                     },
                     cap: {
                         radius: 0,
                         color: '#c06c84',
                         border: { width: 0 },
                     },
                     needleTail: {
                         length: '0%',
                     },
                 },
                 {
                     value: 100,
                     type: 'Marker',
                     markerShape: 'InvertedTriangle',
                     radius: '110%',
                     color: '#ffd54f',
                     markerHeight: 15,
                     markerWidth: 15,
                 },]
             }],
             legendSettings: {
                 visible: true,
                 shapeWidth: 10,
                 shapeHeight: 10,
                 shape: 'Diamond',
                 position: 'Top',
                 padding: 15,
                 width:'300px',
                 height:'50px',
             },
             enableRtl:true,
             tooltip: {
                 enable: true,
                 type: ['Pointer', 'Range'],
                 rangeSettings: { format: 'Start: {start} <br/> End: {end}' },
                 format: 'Start: {value}',
             },
            
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Legend Top position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '234.5' || legendEle.getAttribute('x') == '224.5' || legendEle.getAttribute('x')  == '215.5').toBe(true);
                expect(legendEle.getAttribute('y') == '34' || legendEle.getAttribute('y') == '37').toBe(true);
                expect(legendEle.getAttribute('height')).toBe('50');
                expect(legendEle.getAttribute('width')).toBe('300');
                done();
            };
            gauge.legendSettings.position = 'Top';
            gauge.refresh();
        });
        it('Legend Bottom position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '234.5' || legendEle.getAttribute('x') == '224.5' || legendEle.getAttribute('x')  == '215.5').toBe(true);
                expect(legendEle.getAttribute('y')).toBe('390');
                expect(legendEle.getAttribute('height')).toBe('50');
                expect(legendEle.getAttribute('width')).toBe('300');
                done();
            };
            gauge.legendSettings.position = 'Bottom';
            gauge.refresh();
        });
        it('Legend Left position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '181' || legendEle.getAttribute('x') == '171' || legendEle.getAttribute('x') == '163.5').toBe(true);
                expect(legendEle.getAttribute('y') == '211.5' || legendEle.getAttribute('y') == '213').toBe(true);
                expect(legendEle.getAttribute('height')).toBe('50');
                expect(legendEle.getAttribute('width') == '285' || legendEle.getAttribute('width') == '203').toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Left';
            gauge.refresh();
        });
        it('Legend Right position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '288' || legendEle.getAttribute('x') == '278' || legendEle.getAttribute('x') == '267.5').toBe(true);
                expect(legendEle.getAttribute('y') == '211.5' || legendEle.getAttribute('y') == '213').toBe(true);
                expect(legendEle.getAttribute('height')).toBe('50');
                expect(legendEle.getAttribute('width') == '285' || legendEle.getAttribute('width') == '203').toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Right';
            gauge.refresh();
        });
        it('Legend shape Triangle checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '285.5' || legendEle.getAttribute('x') == '278' || legendEle.getAttribute('x') == '288' || legendEle.getAttribute('x') == '267.5').toBe(true);
                expect(legendEle.getAttribute('y') == '213' || legendEle.getAttribute('y') == '211.5').toBe(true);
                expect(legendEle.getAttribute('height')).toBe('50');
                expect(legendEle.getAttribute('width') == '203' || legendEle.getAttribute('width') == '285').toBe(true);
                done();
            };
            gauge.legendSettings.shape = 'Triangle';
            gauge.refresh();
        });
        it('Legend shape InvertedTriangle checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '285.5' || legendEle.getAttribute('x') == '278' || legendEle.getAttribute('x') == '288' || legendEle.getAttribute('x') == '267.5').toBe(true);
                expect(legendEle.getAttribute('y') == '213' || legendEle.getAttribute('y') == '211.5').toBe(true);
                expect(legendEle.getAttribute('height')).toBe('50');
                expect(legendEle.getAttribute('width') == '203' || legendEle.getAttribute('width') == '285').toBe(true);
                done();
            };
            gauge.legendSettings.shape = 'InvertedTriangle';
            gauge.refresh();
        });
    });
    describe('Legend checking for enableRtl', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let legendEle: Element;
        let svg: HTMLElement;
        let location: GaugeLocation;
        let value: string[] | string | number;
        let legendId: string = 'container_gauge_legend';
        let gaugeEle: Element;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                title: 'Measure of wind speed in Km/h',
                 titleStyle: {
                     fontFamily: 'Segoe UI',
                 },
             axes: [{
                 lineStyle: {
                     width: 2,
                     color: '#E0E0E0',
                 },
                 labelStyle: {
                     font: {
                         fontFamily: 'inherit',
                         size: '0px',
                     },
                     offset: -1,
                 },
                 majorTicks: { width: 0, height: 0 },
                 minorTicks: { width: 0, height: 0 },
                 ranges: [
                     {
                         start: 0,
                         end: 20,
                         startWidth: 20,
                         endWidth: 20,
                         radius: '100%',
                         color: '#ffd54f',
                     },
                     {
                         start: 20,
                         end: 40,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 40,
                         end: 60,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 60,
                         end: 70,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 70,
                         end: 80,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 80,
                         end: 90,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 90,
                         end: 95,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                     {
                         start: 95,
                         end: 100,
                         radius: '80%',
                         startWidth: 20,
                         endWidth: 20,
                         color: '#ffe082',
                     },
                 ],
                 pointers: [{
                     value: 60,
                     radius: '60%',
                     pointerWidth: 22,
                     color: '#ffe082',
                     animation: {
                         enable: true,
                         duration: 500,
                     },
                     cap: {
                         radius: 0,
                         color: '#c06c84',
                         border: { width: 0 },
                     },
                     needleTail: {
                         length: '0%',
                     },
                 },
                 {
                    
                     value: 100,
                     type: 'Marker',
                     markerShape: 'InvertedTriangle',
                     radius: '110%',
                     color: '#ffd54f',
                     markerHeight: 15,
                     markerWidth: 15,
                 },]
             }],
             legendSettings: {
                 visible: true,
                 shapeWidth: 10,
                 shapeHeight: 10,
                 shape: 'Diamond',
                 position: 'Top',
                 padding: 15,
                 width:'300px',
                 height:'50px',
             },
             enableRtl:true,
             tooltip: {
                 enable: true,
                 type: ['Pointer', 'Range'],
                 rangeSettings: { format: 'Start: {start} <br/> End: {end}' },
                 format: 'Start: {value}',
             },
            
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Legend Top position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '233.5' || legendEle.getAttribute('x') == '234.5' || legendEle.getAttribute('x') == '224.5' || legendEle.getAttribute('x') == '215.5').toBe(true);
                expect(legendEle.getAttribute('y') == '34' || legendEle.getAttribute('y') == '37').toBe(true);
                expect(legendEle.getAttribute('height')).toBe('50');
                expect(legendEle.getAttribute('width')).toBe('300');
                done();
            };
            gauge.legendSettings.position = 'Top';
            gauge.refresh();
        });
        it('Checking startAngle and endAngle range startWidth and endWidth', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '234.5' || legendEle.getAttribute('x') == '224.5' || legendEle.getAttribute('x') == '233.5' || legendEle.getAttribute('x') == '215.5').toBe(true);
                expect(legendEle.getAttribute('y') == '34' || legendEle.getAttribute('y') == '37').toBe(true);
                expect(legendEle.getAttribute('height')).toBe('50');
                expect(legendEle.getAttribute('width')).toBe('300');
                done();
            };
            gauge.axes[0].startAngle = 0;
            gauge.axes[0].endAngle = 0;
            gauge.axes[0].ranges[0].startWidth = 10;
            gauge.axes[0].ranges[0].endWidth = 20;
            gauge.refresh();
        });
    });
    describe('Legend with allowMargin', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let legendEle: Element;
        let svg: HTMLElement;
        let location: GaugeLocation;
        let value: string[] | string | number;
        let legendId: string = 'container_gauge_legend';
        let gaugeEle: Element;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                allowMargin: false,
                legendSettings: {
                    visible: true,
                    position: 'Top',
                },
                border: {
                    width: 2
                },
                axes: [
                    {
                        startAngle: 270,
                        endAngle: 70,
                        ranges: [
                            { start: 0, end: 20 },
                            { start: 20, end: 40 },
                            { start: 40, end: 60 },
                            { start: 60, end: 80 },
                            { start: 80, end: 100 },
                            { start: 100, end: 120 }
                        ],
                        pointers: [{
                                animation: { enable: false },
                                value: 65, radius: '60%', color: '#757575', pointerWidth: 8,
                                cap: { radius: 7, color: '#757575' }, needleTail: { length: '18%' }
                        }]
                    },
                    {
                        ranges: [
                            { start: 0, end: 20 },
                            { start: 20, end: 40 },
                            { start: 40, end: 60 },
                            { start: 60, end: 80 },
                            { start: 80, end: 100 },
                            { start: 100, end: 120 }
                        ],
                        pointers: [{
                                animation: { enable: false },
                                value: 65, radius: '60%', color: '#757575', pointerWidth: 8,
                                cap: { radius: 7, color: '#757575' }, needleTail: { length: '18%' }
                        }]
                    }
                ]            
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Legend Top position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '193.5' || legendEle.getAttribute('x') == '192.5' || legendEle.getAttribute('x') == '202.5' || legendEle.getAttribute('x') == '175.5').toBe(true);
                expect(legendEle.getAttribute('y')).toBe('13');
                expect(legendEle.getAttribute('height') == '77' || legendEle.getAttribute('height') == '80').toBe(true);
                expect(legendEle.getAttribute('width') == '380' || legendEle.getAttribute('width') == '364').toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Top';
            gauge.refresh();
        });
        it('Legend Left position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '170.5' || legendEle.getAttribute('x') == '161.5' || legendEle.getAttribute('x') == '171.5' || legendEle.getAttribute('x') == '152.5').toBe(true);
                expect(legendEle.getAttribute('y') == '78' || legendEle.getAttribute('y') == '84').toBe(true);
                expect(legendEle.getAttribute('height') == '296' || legendEle.getAttribute('height') == '284').toBe(true);
                expect(legendEle.getAttribute('width') == '94' || legendEle.getAttribute('width') == '90').toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Left';
            gauge.refresh();
        });
        it('Legend Right position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '502.5' || legendEle.getAttribute('x') == '497.5' || legendEle.getAttribute('x') == '507.5' || legendEle.getAttribute('x') == '484.5').toBe(true);
                expect(legendEle.getAttribute('y') == '78' || legendEle.getAttribute('y') == '84').toBe(true);
                expect(legendEle.getAttribute('height') == '296' || legendEle.getAttribute('height') == '284').toBe(true);
                expect(legendEle.getAttribute('width') == '94' || legendEle.getAttribute('width') == '90').toBe(true);
                done();
            };
            gauge.legendSettings.position = 'Right';
            gauge.refresh();
        });
        it('Legend Left position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x') == '170.5' || legendEle.getAttribute('x') == '161.5' || legendEle.getAttribute('x') == '171.5' || legendEle.getAttribute('x') == '152.5').toBe(true);
                expect(legendEle.getAttribute('y') == '78' || legendEle.getAttribute('y') == '84').toBe(true);
                expect(legendEle.getAttribute('height') == '296' || legendEle.getAttribute('height') == '284').toBe(true);
                expect(legendEle.getAttribute('width') == '94' || legendEle.getAttribute('width') == '90').toBe(true);
                done();
            };
            gauge.axes[0].startAngle = 200;
            gauge.axes[0].endAngle = 160;
            gauge.legendSettings.position = 'Left';
            gauge.refresh();
        });
        it('Legend Left position checking with fixed legend size', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                legendEle = getElement(legendId + '_element');                
                expect(legendEle.getAttribute('x') == '170.5' || legendEle.getAttribute('x') == '161.5' || legendEle.getAttribute('x') == '171.5' || legendEle.getAttribute('x') == '152.5').toBe(true);
                expect(legendEle.getAttribute('y') == '78' || legendEle.getAttribute('y') == '84').toBe(true);
                expect(legendEle.getAttribute('height') == '296' || legendEle.getAttribute('height') == '284').toBe(true);
                expect(legendEle.getAttribute('width') == '94' || legendEle.getAttribute('width') == '90').toBe(true);
                done();
            };
            gauge.axes[0].startAngle = 80;
            gauge.axes[0].endAngle = 280;
            gauge.axes[0].radius = '90';
            gauge.legendSettings.position = 'Left';
            gauge.refresh();
        });
        
    });
});