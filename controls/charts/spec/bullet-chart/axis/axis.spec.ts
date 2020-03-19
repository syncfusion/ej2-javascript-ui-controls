import { BulletChart } from '../../../src/bullet-chart/index';
import { createElement, remove, EventHandler } from '@syncfusion/ej2-base';

/**
 * Spec for Bullet chart axis
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
            expect(svg.getAttribute('fill') == 'rgba(0,0,0,0.87)').toBe(true);
            expect(svg.getAttribute('text-anchor') == 'middle').toBe(true);
            expect(svg.getAttribute('y') == '28.5').toBe(true);
            done();
        });
        it('checking with Title Postion Bottom and alignment near', (done: Function) => {
            bullet.titlePosition = 'Bottom';
            bullet.titleStyle.textAlignment = 'Near';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('x') == '15').toBe(true);
            expect(svg.getAttribute('fill') == 'rgba(0,0,0,0.87)').toBe(true);
            expect(svg.getAttribute('text-anchor') == 'start').toBe(true);
            done();
        });
        it('checking with Title Postion Bottom and alignment far', (done: Function) => {
            bullet.titlePosition = 'Bottom';
            // tslint:disable-next-line:align
            bullet.titleStyle.textAlignment = 'Far';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('fill') == 'rgba(0,0,0,0.87)').toBe(true);
            expect(svg.getAttribute('text-anchor') == 'end').toBe(true);
            done();
        });
        it('checking with Title Postion Bottom and alignment center', (done: Function) => {
            bullet.titlePosition = 'Bottom';
            bullet.titleStyle.textAlignment = 'Center';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartTitle');
            expect(svg.getAttribute('fill') == 'rgba(0,0,0,0.87)').toBe(true);
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
            expect(svg.getAttribute('y')).toBe('28.5');
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
            expect(svg.getAttribute('y')).toEqual('444.3333333333333');
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
            expect(svg.getAttribute('font-size')).toBe('13px');
            done();
        });
        it('checking subtitle position as Top', (done: Function) => {
            bullet.titlePosition = 'Top';
            bullet.dataBind();

            svg = document.getElementById('container_BulletChartSubTitle');
            expect(svg.textContent).toEqual('(in px)');
            expect(svg.getAttribute('font-size')).toBe('13px');
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
            // tslint:disable-next-line:chai-vague-errors
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
            // tslint:disable-next-line:no-unused-expression
            expect(svg.getAttribute('y') == '269.66666666666663' || svg.getAttribute('y') == '270').toBe(true);
            done();
        });
    });
});