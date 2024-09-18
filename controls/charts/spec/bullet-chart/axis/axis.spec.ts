import { BulletChart, IBulletLoadedEventArgs } from '../../../src/bullet-chart/index';
import { createElement, remove, EventHandler } from '@syncfusion/ej2-base';
import { BulletChartLegend } from '../../../src/bullet-chart/legend/legend';
import { MouseEvents } from '../../chart/base/events.spec';
BulletChart.Inject(BulletChartLegend);

/**
 * Spec for Bullet chart axis.
 */
describe('Bullet Chat Axis', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('with default case', () => {
        let bullet: BulletChart;
        let svg: Element;
        let bulletElement: Element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(bulletElement);
            bullet = new BulletChart({
                dataSource: [{ value: 4, target: 4 }],
                valueField: 'value', targetField: 'target',
                minimum: 0, maximum: 20, 
                animation: {enable: false}
            });
            bullet.appendTo('#container');
        });
        afterAll((): void => {
            bullet.destroy();
            bulletElement.remove();
        });
        it('Checking module name', () => {
            expect(bullet.getModuleName()).toBe('bulletChart');
        });
        it('Checking Major TickLine', () => {
            bullet.majorTickLines = { width: 2, color: '#424242' };
            bullet.dataBind();

            svg = document.getElementById('container_svg_MajorTickLine_0');
            expect(svg.getAttribute('stroke') == '#424242').toBe(true);
            expect(svg.getAttribute('stroke-width') == '2').toBe(true);
        });
        it('checking with Minimum and Maximum', (done: Function) => {
            bullet.minimum = 0;
            bullet.maximum = 25;
            bullet.interval = 5;
            bullet.dataBind();

            svg = document.getElementById('container_svg_AxisLabel_25');
            svg = document.getElementById('container_svg_axisLabelGroup');
            expect(svg.childNodes[5].lastChild.textContent).toEqual('25');
            done();
        });
        it('checking with Title', (done: Function) => {
            bullet.title = 'Testing Sample';
            bullet.ranges = [{end: 6}, {end: 8}, {end: 25}]
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('fill') == 'rgba(0, 0, 0, 1)').toBe(true);
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            expect(svg.getAttribute('y') == '28').toBe(true);
            done();
        });
        it('checking with Title Postion Bottom and alignment near', (done: Function) => {
            bullet.titlePosition = 'Bottom';
            bullet.titleStyle.textAlignment = 'Near';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('x') == '15').toBe(true);
            expect(svg.getAttribute('fill') == 'rgba(0, 0, 0, 1)').toBe(true);
            expect(svg.getAttribute('text-anchor') == 'start').toBe(true);
            done();
        });
        it('checking with Title Postion Bottom and alignment far', (done: Function) => {
            bullet.titlePosition = 'Bottom';
            // eslint-disable-next-line @typescript-eslint/indent
            bullet.titleStyle.textAlignment = 'Far';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('fill') == 'rgba(0, 0, 0, 1)').toBe(true);
            expect(svg.getAttribute('text-anchor') == 'end').toBe(true);
            done();
        });
        it('checking with Title Postion Bottom and alignment center', (done: Function) => {
            bullet.titlePosition = 'Bottom';
            bullet.titleStyle.textAlignment = 'Center';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('fill') == 'rgba(0, 0, 0, 1)').toBe(true);
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
        it('checking with Title Postion Top and alignment near', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.titleStyle.textAlignment = 'Near';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('x')).toBe('15');
            expect(svg.getAttribute('text-anchor') == 'start').toBe(true);
            done();
        });
        it('checking with Title maximum width', (done: Function) => {
            bullet.titleStyle.maximumTitleWidth = 12;
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('x')).toBe('15');
            expect(svg.getAttribute('text-anchor') == 'start').toBe(true);
            done();
        });
        it('checking with Title Postion Top and alignment far', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.titleStyle.textAlignment = 'Far';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') == 'end').toBe(true);
            done();
        });
        it('checking with Title Postion Top and alignment center', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.titleStyle.textAlignment = 'Center';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
        it('checking with Title Postion Bottom and TickPostion Inside', (done: Function) => {
            bullet.titlePosition = 'Bottom';
            bullet.titleStyle.textAlignment = 'Center';
            bullet.tickPosition = 'Inside';
            bullet.labelPosition = 'Inside';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
        it('checking with Title Postion Top label and TickPostion Inside', (done: Function) => {
            bullet.titlePosition = 'Bottom';
            bullet.titleStyle.textAlignment = 'Center';
            bullet.tickPosition = 'Inside';
            bullet.labelPosition = 'Inside';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
        it('checking with Title Postion Top and Opposed Postion', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.tickPosition = 'Inside';
            bullet.labelPosition = 'Inside';
            bullet.opposedPosition = true;
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
        it('checking with Title and subTitle', (done: Function) => {
            bullet.subtitle = 'KWH';
            bullet.titlePosition = 'Top';
            bullet.tickPosition = 'Outside';
            bullet.labelPosition = 'Outside';
            bullet.opposedPosition = true;
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
        it('checking with range color in ticks', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.opposedPosition = false;
            bullet.ranges = [{ end: 5.2, opacity: 1, color: 'red' },
            { end: 7.3, opacity: 1, color: 'yellow' },
            { end: 25, opacity: 1, color: 'blue' }
            ];
            bullet.majorTickLines = { useRangeColor: true };
            bullet.minorTickLines = { useRangeColor: true };
            bullet.dataBind();
            svg = document.getElementById('container_svg_MajorTickLine_15');
            expect(svg.getAttribute('stroke') == 'blue').toBe(true);
            done();
        });
        it('checking with range color in labels', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.opposedPosition = false;
            bullet.ranges = [{ end: 5.2, opacity: 1, color: 'red' },
            { end: 7.3, opacity: 1, color: 'yellow' },
            { end: 20, opacity: 1, color: 'blue' }
            ];
            bullet.majorTickLines = { useRangeColor: false };
            bullet.labelStyle.useRangeColor = true;
            bullet.dataBind();
            svg = document.getElementById('container_svg_AxisLabel_15');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            expect(svg.getAttribute('fill') == 'blue').toBe(true);
            done();
        });
        it('checking with axis label custom format', (done: Function) => {
            bullet.majorTickLines = { useRangeColor: false };
            bullet.labelFormat = '{value}%';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
        it('checking with axis in rtl mode', (done: Function) => {
            bullet.majorTickLines = { useRangeColor: false };
            bullet.labelFormat = '{value}%';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
        it('checking with title position as left', (done: Function) => {
            bullet.titlePosition = 'Left';
            bullet.refresh();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') == 'end').toBe(true);
            done();
        });
        it('checking with title position as right', (done: Function) => {
            bullet.titlePosition = 'Right';
            bullet.refresh();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') == 'start').toBe(true);
            done();
        });
    });
    describe('Vertical orientation', () => {
        let bullet: BulletChart;
        let svg: Element;
        let value: string;
        let bulletElement: Element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(bulletElement);
            bullet = new BulletChart({
                dataSource: [{ value: 4, target: 4 }],
                valueField: 'value', targetField: 'target',
                animation: {enable: false},
                interval: 10,
                orientation: 'Vertical'
            });
            bullet.appendTo('#container');
        });
        afterAll((): void => {
            bullet.destroy();
            bulletElement.remove();
        });
        it('checking without Maximum', (done: Function) => {
            bullet.minimum = 0;
            bullet.dataBind();

            svg = document.getElementById('container_svg_AxisLabel_25');
            svg = document.getElementById('container_svg_axisLabelGroup');
            expect(svg.lastElementChild.textContent).toEqual('10');
            done();
        });
        it('checking without Minimum', (done: Function) => {
            bullet.maximum = 25;
            bullet.interval = 5;
            bullet.dataBind();

            svg = document.getElementById('container_svg_axisLabelGroup');
            expect(svg.firstElementChild.textContent).toBe('0');
            done();
        });
        it('checking with minimum and maximum', (done: Function) => {
            bullet.minimum = 10;
            bullet.maximum = 25;
            bullet.interval = 5;
            bullet.dataBind();

            svg = document.getElementById('container_svg_AxisLabel_25');
            svg = document.getElementById('container_svg_axisLabelGroup');
            expect(svg.childNodes[3].lastChild.textContent).toEqual('25');
            done();
        });
        it('checking with datalabel', (done: Function) => {
            bullet.dataLabel = { enable: true };
            bullet.dataSource = [{value: 15, target: 17 }];
            bullet.dataBind();

            svg = document.getElementById('container_svg_AxisLabel_25');
            svg = document.getElementById('container_svg_axisLabelGroup');
            expect(svg.childNodes[3].lastChild.textContent).toEqual('25');
            done();
        });
        it('checking with label format', (done: Function) => {
            bullet.labelFormat = '{value}%';
            bullet.dataBind();

            svg = document.getElementById('container_svg_AxisLabel_25');
            svg = document.getElementById('container_svg_axisLabelGroup');
            expect(svg.childNodes[3].lastChild.textContent).toEqual('25');
            done();
        });
        it('checking with ranges in vertical mode', (done: Function) => {
            bullet.ranges = [{end: 6, color: 'red'}, {end: 8, color: 'yellow'}, {end: 25, color: 'green'}];
            bullet.dataSource = [{value: 15, target: 16}];
            bullet.dataBind();

            svg = document.getElementById('container_svg_range_0');
            expect(svg != null).toBe(true);
            done();
        });
        it('checking with title in vertical mode', (done: Function) => {
            bullet.title = 'Vertical Orientation';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.textContent).toEqual('Vertical Orientation');
            done();
        });
        it('Title as Top', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('y')).toBe('28');
            done();
        });
        it('Title as Left', (done: Function) => {
            bullet.titlePosition = 'Left';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            value = svg.getAttribute('x');
            expect(value === '20.666666666666668' || value === '15').toBe(true);
            done();
        });
        it('Title as Bottom', (done: Function) => {
            bullet.titlePosition = 'Bottom';
            bullet.titleStyle.textAlignment = 'Far';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('y')).toEqual('444.6666666666667');
            done();
        });
        it('Title as Right', (done: Function) => {
            bullet.titlePosition = 'Right';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            let text: string = svg.getAttribute('transform');
            let degree: string = text.split('')[7].concat(text.split('')[8]);
            expect(degree).toBe('90');
            done();
        });
        it('checking with title and subtitle', (done: Function) => {
            bullet.subtitle = '(in px)';
            bullet.titleStyle.textAlignment = 'Center';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.textContent).toEqual('(in px)');
            done();
        });
        it('checking subtitle position as Left', (done: Function) => {
            bullet.titlePosition = 'Left';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.textContent).toEqual('(in px)');
            done();
        });
        it('checking subtitle position as Right', (done: Function) => {
            bullet.titlePosition = 'Right';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.textContent).toEqual('(in px)');
            expect(svg.getAttribute('font-size')).toBe('12px');
            done();
        });
        it('checking subtitle position as Top', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.textContent).toEqual('(in px)');
            expect(svg.getAttribute('font-size')).toBe('12px');
            done();
        });
        it('checking subtitle position as Bottom', (done: Function) => {
            bullet.titlePosition = 'Bottom';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.textContent).toEqual('(in px)');
            done();
        });
        it('checking with title and subtitleStyle', (done: Function) => {
            bullet.subtitle = '(in px)';
            bullet.subtitleStyle = {size: '20px', color: 'red'};
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.textContent).toEqual('(in px)');
            expect(svg.getAttribute('font-size')).toBe('20px');
            // eslint-disable-next-line 
            expect(svg.getAttribute('fill')).toBe('red');
            done();
        });
        it('checking with chart area border', (done: Function) => {
            bullet.border = { width: 4, color: 'red'};
            bullet.refresh();

            svg = document.getElementById('container_ChartBorder');
            expect(svg.getAttribute('stroke')).toEqual('red');
            done();
        });
        it('checking with tick position and label position inside', (done: Function) => {
            bullet.tickPosition = 'Inside';
            bullet.labelPosition = 'Inside';
            bullet.refresh();

            svg = document.getElementById('container_svg_AxisLabel_10');
            expect(svg.getAttribute('x')).toEqual('41');
            done();
        });
        it('checking with Title maximum width', (done: Function) => {
            bullet.titleStyle.maximumTitleWidth = 70;
            bullet.refresh();

            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.getAttribute('y')).toBe('437.3333333333333');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
        it('checking with rtl mode', (done: Function) => {
            bullet.enableRtl = true;
            bullet.refresh();

            svg = document.getElementById('container_svg_range_0');
            expect(svg.getAttribute('x')).toBe('20');
            expect(svg.getAttribute('fill') == 'red').toBe(true);
            done();
        });
        it('checking with opposed position', (done: Function) => {
            bullet.opposedPosition = true;
            bullet.refresh();

            svg = document.getElementById('container_svg_AxisLabel_20');
            expect(svg.textContent).toEqual('20%');
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(svg.getAttribute('y') == '270.66666666666663' || svg.getAttribute('y') == '270').toBe(true);
            done();
        });
        it('checking with maximums value as end', (done: Function) => {
            bullet.maximum = 0;
            bullet.ranges = [{ end: 6, color: 'red' }, { end: 0, color: 'yellow' }, { end: 10, color: 'green' }];
            bullet.refresh();
            svg = document.getElementById('container_svg_AxisLabel_10');

            expect(svg.getAttribute('y')).toEqual('20');
            done();
        });
        it('checking with Title Postion left and alignment far', (done: Function) => {
            bullet.titlePosition = 'Left';
            bullet.titleStyle.textAlignment = 'Far';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') ).toBe('start');
            done();
        });
        it('checking with Title Postion left and alignment near', (done: Function) => {
            bullet.titlePosition = 'Left';
            bullet.titleStyle.textAlignment = 'Near';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') ).toBe('end');
            done();
        });
        it('checking with Title Postion right and alignment near', (done: Function) => {
            bullet.titlePosition = 'Right';
            bullet.titleStyle.textAlignment = 'Near';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') ).toBe('end');
            done();
        });
        it('checking with Title Postion Top and alignment near', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.titleStyle.textAlignment = 'Near';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor')).toBe('middle');
            done();
        });
        it('checking with Title Postion Top and alignment far', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.titleStyle.textAlignment = 'Far';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('text-anchor') ).toBe('middle');
            done();
        });
        it('checking with datalabel with textAlignment as Near', (done: Function) => {
            bullet.dataLabel = {
                enable: true, labelStyle: {
                    textAlignment: 'Near'
                }
            };
            bullet.dataSource = [{ value: 15, target: 17 }];
            bullet.dataBind();
            svg = document.getElementById('container_svg_AxisLabel_25');
            svg = document.getElementById('container_svg_axisLabelGroup');
            expect(svg !== null).toEqual(true);
            done();
        });
        it('checking with datalabel with textAlignment as Far', (done: Function) => {
            bullet.dataLabel = {
                enable: true, labelStyle: {
                    textAlignment: 'Far'
                }
            };
            bullet.dataSource = [{ value: 15, target: 17 }];
            bullet.dataBind();
            svg = document.getElementById('container_svg_AxisLabel_25');
            svg = document.getElementById('container_svg_axisLabelGroup');
            expect(svg !== null).toEqual(true);
            done();
        });
        it('checking with subTitle', (done: Function) => {
            bullet.subtitle = 'KWH';
            bullet.titlePosition = 'Bottom';
            bullet.title = 'BulletChart';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
        it('checking with subTitle and theme', (done: Function) => {
            bullet.subtitle = 'KWH';
            bullet.subtitleStyle.color = "red";
            bullet.titlePosition = 'Bottom';
            bullet.title = 'BulletChart';
            bullet.theme = "Bootstrap";
            bullet.enableRtl = true;
            bullet.locale = "";
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            done();
        });
    });
    describe('Horizontal orientation', () => {
        let bullet: BulletChart;
        let svg: Element;
        let bulletElement: Element = createElement('div', { id: 'container' });
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            document.body.appendChild(bulletElement);
            bullet = new BulletChart({
                dataSource: [{ value: 8, target: 6 }],
                valueField: 'value', targetField: 'target',
                animation: {enable: false},
                interval: 2,
                orientation: 'Horizontal'
            });
            bullet.appendTo('#container');
        });
        afterAll((): void => {
            bullet.destroy();
            bulletElement.remove();
        });
        it('checking subtitle position as Bottom', (done: Function) => {
            bullet.title = 'Bullet Chart';
            bullet.subtitle = 'KWH';
            bullet.subtitleStyle.color = "red";
            bullet.titlePosition = 'Bottom';
            bullet.dataBind();
            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.textContent).toEqual('KWH');
            done();
        });
        it('checking with datalabel with position as Near ', (done: Function) => {
            bullet.loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container');
                expect(element !== null).toBe(true);
                done();
            }
            bullet.dataLabel = { enable: true, labelStyle: { textAlignment: 'Near' } };
            bullet.refresh();
        });
        it('checking with datalabel with position as Far', (done: Function) => {
            bullet.loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container');
                expect(element !== null).toBe(true);
                done();
            }
            bullet.dataLabel = { enable: true, labelStyle: { textAlignment: 'Far' } };
            bullet.interval = null;
            bullet.refresh();
        });
        it('checking with datalabel with position as Near and RTL', (done: Function) => {
            bullet.loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container');
                expect(element !== null).toBe(true);
                done();
            }
            bullet.dataLabel = { enable: true, labelStyle: { textAlignment: 'Near' } };
            bullet.enableRtl = true;
            bullet.maximum = null;
            bullet.interval = 8;
            bullet.refresh();
        });
        it('checking with datalabel with position as Far and RTL ', (done: Function) => {
            bullet.loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container');
                expect(element !== null).toBe(true);
                done();
            }
            bullet.dataLabel = { enable: true, labelStyle: { textAlignment: 'Far' } };
            bullet.enableRtl = true;
            bullet.tickPosition = 'Inside';
            bullet.refresh();
        });
        it('checking with element event', (done: Function) => {
            bullet.loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container');

                expect(element !== null).toBe(true);
                done();
            }
            bullet.dataLabel = { enable: true, labelStyle: { textAlignment: 'Far' } };
            bullet.enableRtl = true;
            bullet.tickPosition = 'Inside';
            bullet.legendSettings = { visible: true, position: 'Left' };
            bullet.refresh();
        });
        it('checking with maximum and minimum ', (done: Function) => {
            bullet.loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container');
                expect(element !== null).toBe(true);
                done();
            }
            bullet.dataLabel = { enable: true, labelStyle: { textAlignment: 'Far' } };
            bullet.interval = null;
            bullet.orientation = 'Vertical';
            bullet.legendSettings = { visible: true, position: 'Bottom' };
            bullet.refresh();
            bullet.delayRedraw = true;
        });
        it('checking with checking data bind method ', (done: Function) => {
            bullet.orientation = 'Vertical';
            bullet.titleStyle.textAlignment = 'Near';
            bullet.delayRedraw = true;
            let element: HTMLElement = document.getElementById('container');
            expect(element !== null).toBe(true);
            done();
        });
        it('checking with checking element tabIndex  ', (done: Function) => {
            bullet.loaded = (args: IBulletLoadedEventArgs): void => {
                bullet.loaded = null;
                let element: HTMLElement = document.getElementById('container');
                args.bulletChart.setTabIndex(element, element);
                args.bulletChart.getActualIndex(1,2);
                args.bulletChart.getActualIndex(0,0);
                args.bulletChart.export('PDF', 'sample', 0, [args.bulletChart]);
                args.bulletChart.export('PDF', 'sample');
                args.bulletChart.bulletMouseLeave(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100));
                expect(element !== null).toBe(true);
                done();
            }
            bullet.orientation = 'Vertical';
            bullet.title = 'Bullet Chart';
            bullet.subtitle = 'KWH';
            bullet.titleStyle.size = '0px';
            bullet.delayRedraw = false;
            bullet.refresh();
        });
        it('checking with bullet chart orientation ', (done: Function) => {
            bullet.loaded = (args: IBulletLoadedEventArgs): void => {
                bullet.loaded = null;
                let element: HTMLElement = document.getElementById('container');
                args.bulletChart.setTabIndex(element, element);
                args.bulletChart.getActualIndex(1,2);
                args.bulletChart.getActualIndex(0,0);
                args.bulletChart.export('PDF', 'sample', 0, [args.bulletChart]);
                args.bulletChart.export('PDF', 'sample');
                args.bulletChart.bulletMouseLeave(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100));
                expect(element !== null).toBe(true);
                done();
            }
            bullet.orientation = 'Vertical';
            bullet.opposedPosition = true;
            bullet.labelPosition = 'Outside';
            bullet.refresh();
        });
    });
});
