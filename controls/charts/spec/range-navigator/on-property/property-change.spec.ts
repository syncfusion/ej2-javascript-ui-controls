import { RangeNavigator, AreaSeries, DateTime, IChangedEventArgs } from '../../../src/range-navigator/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
RangeNavigator.Inject(AreaSeries, DateTime);

/**
 * Spec for range navigator
 */
let value: number = 0;
let point: object;
let data: object[] = [];
let dateTime: object[] = [];

for (let j: number = 0; j < 100; j++) {
    value += (Math.random() * 10 - 5);
    point = { x: j, y: value, y1: value + 10 };
    dateTime.push({ date: new Date(2018, 0, j), yValue: value });
    data.push(point);
}
describe('Range navigator', () => {
    describe('with default case', () => {
        let element: Element;
        let range: RangeNavigator;
        let rangeElement: Element = createElement('div', { id: 'container' });
        let axisLabel: Element;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{ dataSource: data, xName: 'x', yName: 'y' }]
            });
            range.appendTo('#container');
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        });
        it('empty options control class names', () => {
            element = document.getElementById('container');
            expect(element.classList.contains('e-control')).toBe(true);
            expect(element.classList.contains('e-rangenavigator')).toBe(true);
        });
        it('checking height and width', () => {
            range.width = '200';
            range.height = '100';
            range.dataBind();
            let container: Element = document.getElementById('container_svg');
            // expect(container.getAttribute('width')).toEqual('200');
            // expect(container.getAttribute('width')).toEqual('100');
        });
        it('checking height and width', () => {
            range.labelPosition = 'Inside';
            range.dataBind();
            let element: Element = document.getElementById('container_AxisLabel_0');
            expect(element.getAttribute('x')).toEqual('16');
            expect(element.getAttribute('y')).toEqual('102');
        });
        it('checking with tickPosition change', () => {
            range.tickPosition = 'Inside';
            range.dataBind();
            let element: Element = document.getElementById('container_AxisLabel_0');
            expect(element.getAttribute('x')).toEqual('16');
            expect(element.getAttribute('y')).toEqual('102');
        });
        it('checking labelstyle', () => {
            range.tickPosition = 'Outside';
            range.labelStyle.color = 'yellow';
            range.dataBind();
            let element: Element = document.getElementById('container_AxisLabel_0');
            expect(element.getAttribute('fill')).toEqual('yellow');
        });
        // it('checking with series', () => {
        //     range.series = [];
        //     range.dataSource = data;
        //     range.xName  = 'x';
        //     range.yName = 'y';
        //     range.dataBind();
        //     let element: Element = document.getElementById('container_chart');
        //     expect(element.childElementCount).toEqual(0);
        // });
        it('checking with range', () => {
            range.minimum = 5;
            range.maximum = 20;
            range.interval = 5;
            range.labelFormat = '{value}K';
            range.dataBind();
            let element: Element = document.getElementById('container_AxisLabel_0');
            expect(element.textContent).toEqual('5K');
        });
        it('checking with valueType', () => {
            range.minimum = new Date(2018, 4);
            range.maximum = new Date(2018, 8);
            range.interval = null;
            range.intervalType = 'Months';
            range.labelFormat = '';
            range.labelStyle.color = 'blue';
            range.valueType = 'DateTime';
            range.series = [{ dataSource: dateTime, xName: 'date', yName: 'yValue' }];
            range.dataBind();
            let element: Element = document.getElementById('container_chart');
            expect(element.childElementCount).not.toEqual(0);
        });
        it('checking skeleton', () => {
            range.skeleton = 'yMd';
            range.navigatorBorder = { color: 'red', width: 2 };
            range.enableRtl = true;
            range.dataBind();
            let element: Element = document.getElementById('container_AxisLabel_0');
            expect(element.textContent === '5/1/2018' || element.textContent === '12/1/2017').toBe(true);
        });
        it('checking with resize', () => {
            window.dispatchEvent(new Event('resize'));
            let container: Element = document.getElementById('container_svg');
            expect(container.getAttribute('width') === '769' || container.getAttribute('width') === '758').toEqual(true);
        });
        it('check with theme change', () => {
            range.theme = 'Fabric';
            range.labelStyle.color = '';
            range.locale = '';
            range.dataBind();
            let element: Element = document.getElementById('container_AxisLabel_0');
            expect(element.getAttribute('fill') === '#686868').toBe(true);
        });
        it('check with range change', () => {
            range.value = [new Date(2018, 5, 3), new Date(2018, 5, 20)];
            range.dataBind();
            range.changed = (args: IChangedEventArgs ) => {
                expect(args.start).not.toEqual(null);
            };
        });
    });
});