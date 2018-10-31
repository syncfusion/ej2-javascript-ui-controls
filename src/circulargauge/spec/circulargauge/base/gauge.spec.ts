/**
 * Circular Gauge Spec Started
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';

describe('Circular-Gauge Control', () => {
    describe('Gauge direct properties and its behavior', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string | number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                enablePersistence: true
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking with empty options', () => {
            let className: string = document.getElementById('container').className;
            expect(className).toEqual('e-control e-circulargauge');
        });
        it('Checking gauge instance creation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect(gauge != null).toBe(true);
                done();
            };
            gauge.refresh();
        });
        it('Checking module name', () => {
            expect(gauge.getModuleName()).toBe('circulargauge');
        });
        it('Checking the border properties of the gauge', () => {
            expect(gauge.border != null).toBe(true);
            expect(gauge.border.color == 'transparent').toBe(true);
            expect(gauge.border.width == 0).toBe(true);
        });
        it('Checking the height of the gauge', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
               expect(svg.getAttribute('height')).toEqual('250');
                done();
            };
            gauge.height = '250';
            gauge.dataBind();
        });
        it('Checking the height of the gauge with percentage', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
                //expect(svg.getAttribute('height')).toEqual('200');
                done();
            };
            ele.style.height = '400px';
            gauge.height = '50%';
            gauge.dataBind();
        });
        it('Checking the width of the gauge', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
                expect(svg.getAttribute('width')).toEqual('250');
                done();
            };
            gauge.width = '250';
            gauge.dataBind();
        });
        it('Checking the null width of the gauge', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
               // expect(svg.getAttribute('width')).toEqual('600');
                done();
            };
            gauge.width = null;
            ele.setAttribute('style', 'width:0px');
            gauge.dataBind();
        });
        it('Checking the width of the gauge with percentage', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
               // expect(svg.getAttribute('width')).toEqual('200');
                done();
            };
            ele.style.width = '400px';
            gauge.width = '50%';
            gauge.dataBind();
        });
        it('Checking the load event of the gauge', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
                expect(value != '100').toBe(true);
                expect(svg.getAttribute('width')).toEqual('100');
                gauge.load = null;
                done();
            };
            gauge.load = (args: ILoadedEventArgs): void => {
                args.gauge.width = '100';
            };
            gauge.refresh();
        });
        it('Checking the gauge border width', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeBorder');
                expect(svg != null).toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                gauge.load = null;
                done();
            };
            gauge.border.width = 2;
            gauge.dataBind();
        });
        it('Checking the gauge border width and color', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeBorder');
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                 expect(svg.getAttribute('fill') == 'transparent').toBe(true);
                gauge.load = null;
                done();
            };
            gauge.border.color = 'red';
            gauge.dataBind();
        });
        it('Checking the gauge background and title', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeBorder');
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                expect(svg.getAttribute('fill') == 'violet').toBe(true);
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg == null).toBe(true);
                done();
            };
            gauge.background = 'violet';
            gauge.dataBind();
        });
        it('Checking the gauge title', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg != null).toBe(true);
                expect(svg.textContent == 'This is circular-gauge').toBe(true);
                 expect(svg.getAttribute('aria-label')).toBe('This is circular-gauge');
                done();
            };
            gauge.title = 'This is circular-gauge';
            gauge.dataBind();
        });
        it('Checking the gauge title with description', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg != null).toBe(true);
                expect(svg.textContent == 'circular-gauge').toBe(true);
                 expect(svg.getAttribute('aria-label')).toBe('this is title');
                done();
            };
            gauge.description = 'this is title';
            gauge.title = 'circular-gauge';
            gauge.dataBind();
        });
        it('Checking the gauge title-style', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg != null).toBe(true);
                expect(svg.getAttribute('fill') == 'green').toBe(true);
                expect(svg.style.fontSize == '20px').toBe(true);
                done();
            };
            gauge.titleStyle.color = 'green';
            gauge.titleStyle.size = '20px';
            gauge.dataBind();
        });
        it('Checking the gauge title with top margin', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg != null).toBe(true);
                expect(svg.style.fontSize == '12px').toBe(true);
                expect(svg.getAttribute('y') == '12' || svg.getAttribute('y') == '11.25').toBe(true);
                done();
            };
            gauge.titleStyle.color = 'green';
            gauge.titleStyle.size = '12px';
            gauge.margin.top = 0;
            gauge.dataBind();
        });
        it('Checking the data bind method - title style - fill', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg != null).toBe(true);
                expect(svg.style.fontSize == '12px').toBe(true);
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                done();
            };
            gauge.titleStyle.color = 'red';
            gauge.dataBind();
        });
        it('Checking the data bind method - title style - font size', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg != null).toBe(true);
                expect(svg.style.fontSize == '14px').toBe(true);
                expect(svg.getAttribute('y') != '11.25').toBe(true);
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                done();
            };
            gauge.titleStyle.color = 'red';
            gauge.titleStyle.size = '14px';
            gauge.margin.top = 0;
            gauge.dataBind();
        });
        it('Checking the data bind method - width, height and margin', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
                expect(svg.getAttribute('height')).toEqual('500');
                expect(svg.getAttribute('width')).toEqual('500');
                done();
            };
            gauge.width = '500';
            gauge.height = '500';
            gauge.margin = {
                top: 0, left: 0, bottom: 0, right: 0
            };
            gauge.dataBind();
        });
        it('Checking the data bind method - center x and center y', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('cx')).toEqual('350');
                expect(svg.getAttribute('cy')).toEqual('250');
                done();
            };
            gauge.centerX = '70%';
            gauge.centerY = '50%';
            gauge.dataBind();
        });
        it('Checking the gauge background as null with border 0', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeBorder');
                expect(svg).toBe(null);
                done();
            };
            gauge.background = null;
            gauge.border.width = 0;
            gauge.dataBind();
        });
        it('Checking the gauge background as transparent with border 0', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeBorder');
                expect(svg).toBe(null);
                done();
            };
            gauge.background = 'transparent';
            gauge.border.width = 0;
            gauge.dataBind();
        });
        it('Checking the gauge background as transparent with border as value', (done: Function) => {
            value = gauge.width;
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeBorder');
                expect(svg != null).toBe(true);
                done();
            };
            gauge.background = 'transparent';
            gauge.border.width = 2;
            gauge.dataBind();
        });
        it('Checking touch resize event', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                gauge.loaded = null;
                expect(document.getElementById('container_svg').getAttribute('width') == '500').toBe(true);
                done();
            };
            gauge.gaugeResize(<Event>{});
        });
    });
});