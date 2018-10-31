import { RangeNavigator } from '../../../src/range-navigator/index';
import { Logarithmic, DateTime, LineSeries } from '../../../src/chart/index';
import { createElement, remove } from '@syncfusion/ej2-base';
RangeNavigator.Inject(Logarithmic, DateTime, LineSeries);

let value: number = 0;
let point: object;
let data: object[] = [];

for (let j: number = 0; j < 100; j++) {
    value += (Math.random() * 10 );
    point = { x: j, y: value };
    data.push(point);
}

/**
 * Spec for range navigator
 */

describe('Range navigator', () => {
    describe('with logarithmic axis', () => {
        let element: Element;
        let range: RangeNavigator;
        let rangeElement: Element = createElement('div', { id: 'container' });
        let axisLabel: Element;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 10000, y: 12 }],
                    xName: 'x', yName: 'y', type: 'Line'
                }],
                valueType: 'Logarithmic'
            });
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        });
        it('checking with instance creation ', (done: Function) => {
            range.loaded = (args: Object): void => {
                let container: Element = document.getElementById('container_svg');
                expect(container.getAttribute('height')).toEqual('120');
                expect(range != null).toBe(true);
                done();
            };
            range.appendTo('#container');
        });
        it('checking with logarithmic axis labels', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_1');
                expect(element.innerHTML).toEqual('100');
                done();
            };
            range.refresh();
        });
        it('checking with minimum', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_0');
                expect(element.textContent).toEqual('10');
                done();
            };
            range.minimum = 10;
            range.refresh();
        });
        it('checking with maximum', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabels');
                expect(element.childNodes[0].lastChild.textContent).toEqual('1000');
                done();
            };
            range.minimum = null;
            range.maximum = 1000;
            range.refresh();
        });
        it('checking with interval', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabels');
                expect(element.childNodes[0].lastChild.textContent).toEqual('1000');
                done();
            };
            range.minimum = null;
            range.maximum = null;
            range.interval = 2;
            range.refresh();
        });
        it('checking with logBase', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabels');
                expect(element.childNodes[0].firstChild.textContent).toEqual('8');
                done();
            };
            range.minimum = null;
            range.maximum = null;
            range.interval = 2;
            range.logBase = 8;
            range.refresh();
        });
        it('checking with logBase with minimum', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabels');
                expect(element.childNodes[0].firstChild.textContent).toEqual('8');
                done();
            };            
            range.maximum = null;
            range.interval = null;
            range.logBase = 8;
            range.minimum = 10;
            range.refresh();
        });
        it('checking with logBase with maximum', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabels');
                expect(element.childNodes[0].lastChild.textContent).toEqual('512');
                done();
            };
            range.interval = null;
            range.logBase = 8;
            range.minimum = null;
            range.maximum = 200;
            range.refresh();
        });
        it('checking with logBase with interval', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabels');
                expect(element.childNodes[0].firstChild.textContent).toEqual('8');
                expect(element.childNodes[0].childNodes[1].textContent).toEqual('512');
                done();
            };
            range.interval = 2;
            range.logBase = 8;
            range.minimum = null;
            range.maximum = null;
            range.refresh();
        });
        it('checking with custom label format', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_1');
                expect(element.textContent.indexOf('K') > -1).toBe(true);
                done();
            };
            range.labelFormat = '{value}K';
            range.refresh();
        });
    });
});