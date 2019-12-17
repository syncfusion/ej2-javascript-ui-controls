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
                minimum: 0, maximum: 20, interval: 5,
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
            expect(svg.getAttribute('x') === '15').toBe(true);
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
    })
});