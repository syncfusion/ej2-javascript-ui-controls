/**
 * Circular Gauge Spec Started
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { Axis } from '../../../src/circular-gauge/axes/axis';
import { getAngleFromLocation, GaugeLocation } from '../../../src/circular-gauge/utils/helper';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';

describe('Circular-Gauge Control', () => {
    describe('Gauge axis properties default behavior', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.destroy();
        });
        it('Checking with default axis', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('stroke')).toBe('#757575');
                expect(svg.getAttribute('fill')).toBe('transparent');
                expect(svg.getAttribute('stroke-width')).toBe('2');
                done();
            };
            gauge.refresh();
        });

        it('Checking with default axis angle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect(args.gauge.axes[0].startAngle == 200).toBe(true);
                expect(args.gauge.axes[0].endAngle == 160).toBe(true);
                done();
            };
            gauge.refresh();
        });
        it('Checking with default axis elements', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxesCollection');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Axis_Labels_0');
                expect(svg.childElementCount == 11).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking with default axis label start, mid and end', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '0').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_10');
                expect(svg.textContent == '100').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_5');
                expect(svg.textContent == '50').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking Major Tick Line', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Major_TickLine_0_0');
                expect(svg.getAttribute('stroke-width')).toBe('2');
                expect(svg.getAttribute('stroke')).toBe('#757575');
                expect(svg.getAttribute('fill')).toBe('transparent');
                done();
            };
            gauge.refresh();
        });

        it('Checking Minor Tick Line overlapping to others', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Minor_TickLine_0_0');
                expect(svg == null).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking Minor Tick Line ', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Minor_TickLine_0_5');
                expect(svg.getAttribute('stroke-width')).toBe('2');
                expect(svg.getAttribute('stroke')).toBe('#757575');
                expect(svg.getAttribute('fill')).toBe('transparent');
                done();
            };
            gauge.refresh();
        });

        it('Checking Axis minimum and maximum value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '-10').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_10');
                expect(svg.textContent == '10').toBe(true);
                done();
            };
            gauge.axes[0].minimum = -10;
            gauge.axes[0].maximum = 10;
            gauge.refresh();
        });

        it('Checking Axis minimum and maximum value with intersect', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '-10').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_10');
                expect(svg.textContent == '10').toBe(true);
                done();
            };
            gauge.axes[0].minimum = 10;
            gauge.axes[0].maximum = -10;
            gauge.refresh();
        });

        it('Checking Axis minimum and maximum value as same with default interval', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '-11').toBe(true);
                done();
            };
            gauge.axes[0].minimum = -10;
            gauge.axes[0].maximum = -10;
            gauge.refresh();
        });

        it('Checking Axis minimum and maximum value as same with given interval', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '-20').toBe(true);
                done();
            };
            gauge.axes[0].minimum = -10;
            gauge.axes[0].maximum = -10;
            gauge.axes[0].majorTicks.interval = 10;
            gauge.refresh();
        });

        it('Checking Axis range with interval within range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Labels_0');
                expect(svg.childElementCount == 2).toBe(true);
                done();
            };
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 100;
            gauge.axes[0].majorTicks.interval = 100;
            gauge.refresh();
        });

        it('Checking Axis range with interval exceed range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Labels_0');
                expect(svg.childElementCount == 1).toBe(true);
                done();
            };
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 100;
            gauge.axes[0].majorTicks.interval = 200;
            gauge.refresh();
        });

        it('Checking Axis line style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill') == 'transparent').toBe(true);
                expect(svg.getAttribute('stroke-dasharray') == '5').toBe(true);
                expect(svg.getAttribute('stroke-width') == '10').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                done();
            };
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 100;
            gauge.axes[0].majorTicks.interval = 10;
            gauge.axes[0].lineStyle.width = 10;
            gauge.axes[0].lineStyle.dashArray = '5';
            gauge.axes[0].lineStyle.color = 'red';
            gauge.refresh();
        });

        it('Checking Axis default radius', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect((<Axis>args.gauge.axes[0]).currentRadius == 185).toBe(true);
                done();
            };
            gauge.width = '400';
            gauge.refresh();
        });

        it('Checking Axis radius for given value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect((<Axis>args.gauge.axes[0]).currentRadius == 147).toBe(true);
                done();
            };
            gauge.axes[0].radius = '80%';
            gauge.refresh();
        });

        it('Checking Axis minimum value with pointer value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '0').toBe(true);
                expect(svg.textContent != '-10').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_10');
                expect(svg.textContent == '100').toBe(true);
                done();
            };
            gauge.axes[0].radius = '100%';
            gauge.axes[0].lineStyle.width = 1;
            gauge.axes[0].pointers[0].value = -10;
            gauge.refresh();
        });

        it('Checking Axis minimum value with pointer value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '0').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_10');
                expect(svg.textContent == '100').toBe(true);
                done();
            };
            gauge.axes[0].radius = '100%';
            gauge.axes[0].lineStyle.width = 1;
            gauge.axes[0].pointers[0].value = 120;
            gauge.refresh();
        });

        it('Checking Axis line width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg == null).toBe(true);
                done();
            };
            gauge.axes[0].lineStyle.width = 0;
            gauge.refresh();
        });

        it('Checking Axis end angle with negative point', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                value = document.getElementById('container_AxisLine_0').getAttribute('d').split(' ');
                location = new GaugeLocation(
                    (<Axis>args.gauge.axes[0]).rect.x + ((<Axis>args.gauge.axes[0]).rect.width / 2),
                    (<Axis>args.gauge.axes[0]).rect.y + ((<Axis>args.gauge.axes[0]).rect.height / 2)
                );
                expect(getAngleFromLocation(location, {
                    x: +value[value.length - 2],
                    y: +value[value.length - 1]
                })).toBe(270);
                done();
            };
            gauge.axes[0].startAngle = -180;
            gauge.axes[0].endAngle = -90;
            gauge.axes[0].lineStyle.width = 1;
            gauge.refresh();
        });

        it('Checking Axis end angle with positive point', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                value = document.getElementById('container_AxisLine_0').getAttribute('d').split(' ');
                location = new GaugeLocation(
                    (<Axis>args.gauge.axes[0]).rect.x + ((<Axis>args.gauge.axes[0]).rect.width / 2),
                    (<Axis>args.gauge.axes[0]).rect.y + ((<Axis>args.gauge.axes[0]).rect.height / 2)
                );
                expect(getAngleFromLocation(location, {
                    x: +value[value.length - 2],
                    y: +value[value.length - 1]
                })).toBe(10);
                done();
            };
            gauge.axes[0].startAngle = 180;
            gauge.axes[0].endAngle = 10;
            gauge.axes[0].lineStyle.width = 1;
            gauge.refresh();
        });

        it('Checking Axis direction', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                value = document.getElementById('container_AxisLine_0').getAttribute('d').split(' ');
                location = new GaugeLocation(
                    (<Axis>args.gauge.axes[0]).rect.x + ((<Axis>args.gauge.axes[0]).rect.width / 2),
                    (<Axis>args.gauge.axes[0]).rect.y + ((<Axis>args.gauge.axes[0]).rect.height / 2)
                );
                expect(getAngleFromLocation(location, {
                    x: +value[value.length - 2],
                    y: +value[value.length - 1]
                })).toBe(10);
                expect(getAngleFromLocation(location, {
                    x: +value[1],
                    y: +value[2]
                })).toBe(180);
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.refresh();
        });

    });

    describe('Axis Tick Lines(Major and Minor) and Visible Label', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let direction: string;
        let boundingRect: ClientRect;
        let boundingRect1: ClientRect;
        let svg: HTMLElement;
        let value: string | number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge(
                {
                    axes: [{
                        minimum: 20,
                        maximum: 50,
                        pointers: [{
                            value: 0
                        }]
                    }]
                },
                '#container'
            );
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking axis value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '20').toBe(true);
                done();
            };
            gauge.refresh();
        });
        it('Checking axis major tick line default style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Major_TickLine_0_20');
                expect(svg.getAttribute('fill')).toBe('transparent');
                expect(svg.getAttribute('stroke')).toBe('#757575');
                expect(svg.getAttribute('stroke-width')).toBe('2');
                expect(svg.getAttribute('stroke-dasharray')).toBe('0');
                done();
            };
            gauge.refresh();
        });

        it('Checking axis major tick line given style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Major_TickLine_0_20');
                expect(svg.getAttribute('fill') == 'transparent').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '5').toBe(true);
                expect(svg.getAttribute('stroke-dasharray') == '0').toBe(true);
                done();
            };
            gauge.axes[0].majorTicks.color = 'red';
            gauge.axes[0].majorTicks.width = 5;
            gauge.refresh();
        });

        it('Checking axis major tick inside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_MajorTickLines_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_AxisLine_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) > Math.round(boundingRect1.top)).toBe(true);
                expect(Math.round(boundingRect.bottom) < Math.round(boundingRect1.bottom)).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking axis major tick outside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_MajorTickLines_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_AxisLine_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) < Math.round(boundingRect1.top)).toBe(true);
                expect(Math.round(boundingRect.bottom) > Math.round(boundingRect1.bottom)).toBe(true);
                done();
            };
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.refresh();
        });

        it('Checking default major interval of the axis', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                direction = document.getElementById('container_Axis_Major_TickLine_0_20').getAttribute('d');
                expect(direction.match(new RegExp('M', 'g')).length == 1).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking major interval of the axis given value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                direction = document.getElementById('container_Axis_Major_TickLine_0_20').getAttribute('d');
                expect(direction.match(new RegExp('M', 'g')).length == 1).toBe(true);
                done();
            };
            gauge.axes[0].majorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.interval = 10;
            gauge.refresh();
        });

        it('checking major tick lines width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_MajorTickLines_0');
                expect(svg).toBe(null);
                done();
            };
            gauge.axes[0].majorTicks.width = 0;
            gauge.refresh();
        });

        it('checking major tick lines height', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_MajorTickLines_0');
                expect(svg).toBe(null);
                done();
            };
            gauge.axes[0].majorTicks.width = 2;
            gauge.axes[0].majorTicks.height = 0;
            gauge.refresh();
        });

        it('checking major tick lines height and width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_MajorTickLines_0');
                expect(svg).toBe(null);
                done();
            };
            gauge.axes[0].majorTicks.width = 0;
            gauge.axes[0].majorTicks.height = 0;
            gauge.refresh();
        });

        it('Checking axis minor tick line default style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Minor_TickLine_0_20');
                expect(svg.getAttribute('fill')).toBe('transparent');
                expect(svg.getAttribute('stroke')).toBe('#757575');
                expect(svg.getAttribute('stroke-width')).toBe('2');
                expect(svg.getAttribute('stroke-dasharray')).toBe('0');
                done();
            };
            gauge.refresh();
        });

        it('Checking axis minor tick line given style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Minor_TickLine_0_20');
                expect(svg.getAttribute('fill') == 'transparent').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '5').toBe(true);
                expect(svg.getAttribute('stroke-dasharray') == '0').toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.color = 'red';
            gauge.axes[0].minorTicks.width = 5;
            gauge.refresh();
        });

        it('Checking axis minor tick inside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_Minor_TickLine_0_20').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_AxisLine_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) > Math.round(boundingRect1.top)).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking axis minor tick outside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_MinorTickLines_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_AxisLine_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) < Math.round(boundingRect1.top)).toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.position = 'Outside';
            gauge.refresh();
        });

        it('Checking default minor interval of the axis', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                direction = document.getElementById('container_Axis_Minor_TickLine_0_20').getAttribute('d');
                expect(direction.match(new RegExp('M', 'g')).length == 1).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking minor interval of the axis given value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                direction = document.getElementById('container_Axis_Minor_TickLine_0_20').getAttribute('d');
                expect(direction.match(new RegExp('M', 'g')).length == 1).toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.position = 'Inside';
            gauge.axes[0].minorTicks.interval = 9;
            gauge.refresh();
        });

        it('Checking axis default label', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Labels_0');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '20').toBe(true);
                expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_3');
                expect(svg.textContent == '50').toBe(true);
                expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking axis default label style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('fill')).toBe('#212121');
                expect(svg.style.fontSize).toBe('12px');
                expect(svg.style.fontStyle).toBe('normal');
                expect(svg.style.fontWeight).toBe('normal');
                done();
            };
            gauge.refresh();
        });

        it('Checking axis given label style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                expect(svg.style.fontSize == '14px').toBe(true);
                expect(svg.style.fontStyle == 'normal').toBe(true);
                expect(svg.style.fontWeight == 'normal').toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.font.color = 'red';
            gauge.axes[0].labelStyle.font.size = '14px';
            gauge.refresh();
        });

        it('Checking axis axis labels inside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_Labels_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_AxisLine_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) > Math.round(boundingRect1.top)).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking axis labels outside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_Labels_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_AxisLine_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) < Math.round(boundingRect1.top)).toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.axes[0].majorTicks.interval = 5;
            gauge.refresh();
        });

        it('Checking axis labels inside position - auto angle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_4');
                expect(svg.getAttribute('transform').split(',')[0]).toBe('rotate(413');
                done();
            };
            gauge.axes[0].labelStyle.position = 'Inside';
            gauge.axes[0].labelStyle.autoAngle = true;
            gauge.axes[0].majorTicks.interval = 5;
            gauge.refresh();
        });

        it('Checking axis labels outside position - auto angle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_4');
                expect(svg.getAttribute('transform').split(',')[0]).toBe('rotate(413');
                done();
            };
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.axes[0].labelStyle.autoAngle = true;
            gauge.axes[0].majorTicks.interval = 5;
            gauge.refresh();
        });

        it('Checking axis labels outside position - auto angle as false', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_4');
                expect(svg.getAttribute('transform') == '').toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.autoAngle = false;
            gauge.axes[0].majorTicks.interval = 5;
            gauge.refresh();
        });

        it('Checking axis labels outside position major tick outside', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_Labels_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_Axis_MajorTickLines_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) < Math.round(boundingRect1.top)).toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].majorTicks.width = 2;
            gauge.axes[0].majorTicks.height = 5;
            gauge.axes[0].majorTicks.interval = 5;
            gauge.refresh();
        });

        it('Checking axis labels outside position minor tick outside', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_Labels_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_Axis_MinorTickLines_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) < Math.round(boundingRect1.top)).toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.position = 'Outside';
            gauge.axes[0].majorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.interval = 5;
            gauge.refresh();
        });

        it('checking minor tick lines width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_MinorTickLines_0');
                expect(svg).toBe(null);
                done();
            };
            gauge.axes[0].minorTicks.width = 0;
            gauge.refresh();
        });

        it('checking minor tick lines height', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_MinorTickLines_0');
                expect(svg).toBe(null);
                done();
            };
            gauge.axes[0].minorTicks.width = 2;
            gauge.axes[0].minorTicks.height = 0;
            gauge.refresh();
        });

        it('checking minor tick lines height and width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_MinorTickLines_0');
                expect(svg).toBe(null);
                done();
            };
            gauge.axes[0].minorTicks.width = 0;
            gauge.axes[0].minorTicks.height = 0;
            gauge.refresh();
        });

        it('Checking label format', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_6');
                expect(svg.textContent == '$50.00').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '$20.00').toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.position = 'Inside';
            gauge.axes[0].labelStyle.format = 'C';
            gauge.refresh();
        });

        it('Checking label format with group separator as false', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_6');
                expect(svg.textContent == '$6000.00').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_9');
                expect(svg.textContent == '$9000.00').toBe(true);
                done();
            };
            gauge.useGroupingSeparator = false;
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 10000;
            gauge.axes[0].majorTicks.interval = 1000;
            gauge.refresh();
        });

        it('Checking label format with group separator as true', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_6');
                expect(svg.textContent == '$6,000.00').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_9');
                expect(svg.textContent == '$9,000.00').toBe(true);
                done();
            };
            gauge.useGroupingSeparator = true;
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 10000;
            gauge.axes[0].majorTicks.interval = 1000;
            gauge.refresh();
        });

        it('Checking custom label format', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_6');
                expect(svg.textContent == '6KM').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_9');
                expect(svg.textContent == '9KM').toBe(true);
                done();
            };
            gauge.useGroupingSeparator = false;
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 10;
            gauge.axes[0].majorTicks.interval = 1;
            gauge.axes[0].labelStyle.format = '{value}KM';
            gauge.refresh();
        });

        it('Checking hidden axis label - First', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Labels_0');
                expect(svg.childElementCount == 10).toBe(true);
                svg = document.getElementById('container_Axis_0_Label_1');
                expect(svg.textContent == '1KM').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_1');
                expect(svg.textContent != '0KM').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_10');
                expect(svg.textContent == '10KM').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg == null).toBe(true);
                done();
            };
            gauge.axes[0].startAngle = 90;
            gauge.axes[0].endAngle = 90;
            gauge.axes[0].labelStyle.hiddenLabel = 'First';
            gauge.refresh();
        });

        it('Checking hidden axis label - Last', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Labels_0');
                expect(svg.childElementCount == 10).toBe(true);
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '0KM').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_9');
                expect(svg.textContent != '10KM').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_9');
                expect(svg.textContent == '9KM').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_10');
                expect(svg == null).toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.hiddenLabel = 'Last';
            gauge.refresh();
        });

        it('Checking hidden axis label - First with specified range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Labels_0');
                expect(svg.childElementCount == 3).toBe(true);
                svg = document.getElementById('container_Axis_0_Label_1');
                expect(svg.textContent == '3KM').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_2');
                expect(svg.textContent == '6KM').toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.hiddenLabel = 'First';
            gauge.axes[0].majorTicks.interval = 3;
            gauge.refresh();
        });

        it('Checking hidden axis label - Last with specified range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Labels_0');
                expect(svg.childElementCount == 3).toBe(true);
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.textContent == '0KM').toBe(true);
                svg = document.getElementById('container_Axis_0_Label_2');
                expect(svg.textContent == '6KM').toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.hiddenLabel = 'Last';
            gauge.axes[0].majorTicks.interval = 3;
            gauge.refresh();
        });
    });

    describe('Multiple Axes Behavior', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let direction: string;
        let boundingRect: ClientRect;
        let boundingRect1: ClientRect;
        let svg: HTMLElement;
        let value: string[] | string | number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge(
                {
                    axes: [{}, {}]
                },
                '#container'
            );
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking axis group elements', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxesCollection');
                expect(svg.childElementCount == 2).toBe(true);
                done();
            };
            gauge.refresh();
        });
        it('Checking bounding rect', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_Group_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_Axis_Group_1').getBoundingClientRect();
                expect(boundingRect.top > boundingRect1.top);
                expect(boundingRect.bottom < boundingRect1.bottom);
                expect(boundingRect.left > boundingRect1.left);
                expect(boundingRect.right < boundingRect1.right);
                done();
            };
            gauge.refresh();
        });
        it('checking axes radius', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                value = document.getElementById('container_AxisLine_0').getAttribute('d').split(' ');
                expect(+value[4] == (<Axis>args.gauge.axes[0]).currentRadius).toBe(true);
                value = document.getElementById('container_AxisLine_1').getAttribute('d').split(' ');
                expect(+value[4] == (<Axis>args.gauge.axes[1]).currentRadius).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('checking axes with outside label', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                value = document.getElementById('container_AxisLine_0').getAttribute('d').split(' ');
                expect(value[4] == '112' || value[4] == '115').toBe(true);
                value = document.getElementById('container_AxisLine_1').getAttribute('d').split(' ');
                expect(value[4]).toBe('214');
                done();
            };
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.refresh();
        });

        it('checking space value between axes - label outside', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_Group_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_Axis_Group_1').getBoundingClientRect();
                expect(Math.round(boundingRect.top) == 93|| Math.round(boundingRect.top) == 92).toBe(true);
                expect(Math.round(boundingRect1.top)).toBe(19);
                done();
            };
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.refresh();
        });

        it('checking space value between axes - ticks outside', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_Group_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('container_Axis_Group_1').getBoundingClientRect();
                expect(Math.round(boundingRect.top)).toBe(121);
                expect(Math.round(boundingRect1.top)).toBe(19);
                done();
            };
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].minorTicks.position = 'Outside';
            gauge.refresh();
        });
    });

});