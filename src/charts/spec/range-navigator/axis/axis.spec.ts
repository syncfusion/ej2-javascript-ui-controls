import { RangeNavigator, AreaSeries } from '../../../src/range-navigator/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import '../../../node_modules/es6-promise/dist/es6-promise';
RangeNavigator.Inject(AreaSeries);

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
    data.push(point);
}
describe('Range navigator', () => {
    describe('with default case', () => {
        let element: Element;
        let range: RangeNavigator;
        let rangeElement: Element = createElement('div', { id: 'container' });
        let axisLabel: Element;
        let dataManager: DataManager = new DataManager({
            url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
        });
        let query: Query = new Query().take(5).where('Estimate', 'lessThan', 3, false);
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                dataSource: data, xName: 'x', yName: 'y', value: [20, 30]
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
        it('checking with numeric lightweight', () => {
            let container: Element = document.getElementById('container_svg');
            let selectedElement: Element = document.getElementById('container_SelectedArea');
            expect(selectedElement.getAttribute('fill')).toEqual('#FF4081');
            expect(container.getAttribute('height')).toEqual('50');
            expect(range != null).toBe(true);
        });
        it('checking with fabric theme', (done: Function) => {
            range.loaded = (args: Object) => {
                let selectedElement: Element = document.getElementById('container_SelectedArea');
                expect(selectedElement.getAttribute('fill')).toEqual('#007897');
                done();
            };
            range.theme = 'Fabric';
            range.refresh();
        });
        it('checking with bootstrap theme', (done: Function) => {
            range.loaded = (args: Object) => {
                let selectedElement: Element = document.getElementById('container_SelectedArea');
                expect(selectedElement.getAttribute('fill')).toEqual('#428BCA');
                done();
            };
            range.theme = 'Bootstrap';
            range.refresh();
        });
        it('checking with highcontrast theme', (done: Function) => {
            range.loaded = (args: Object) => {
                let selectedElement: Element = document.getElementById('container_SelectedArea');
                expect(selectedElement.getAttribute('fill')).toEqual('#FFD939');
                done();
            };
            range.theme = 'Highcontrast';
            range.refresh();
        });
        it('checking with custom width', (done: Function) => {
            range.loaded = (args: Object): void => {
                let container: Element = document.getElementById('container_svg');
                expect(container.getAttribute('width')).toEqual('200');
                expect(range != null).toBe(true);
                done();
            };
            range.theme = 'Material';
            range.width = '200';
            range.refresh();
        });
        it('checking with numeric axis with minimum only', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_0');
                expect(element.textContent).toEqual('10');
                expect(range != null).toBe(true);
                done();
            };
            range.series = [{ dataSource: data, xName: 'x', yName: 'y', type: 'Line' }];
            range.minimum = 10;
            range.height = '';
            range.width = '';
            range.refresh();
        });
        it('checking with numeric axis with maximum only', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabels');
                expect(element.childNodes[0].lastChild.textContent).toEqual('1000');
                done();
            };
            range.minimum = null;
            range.maximum = 1000;
            range.refresh();
        });
        it('checking with numeric axis with interval only', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_0');
                expect(element.textContent).toEqual('0');
                element = document.getElementById('container_AxisLabel_1');
                expect(element.textContent).toEqual('50');
                done();
            };
            range.minimum = null;
            range.interval = 50;
            range.maximum = 1000;
            range.refresh();
        });
        it('checking with numeric axis with range', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_0');
                expect(element.textContent).toEqual('20');
                element = document.getElementById('container_AxisLabel_1');
                expect(element.textContent).toEqual('40');
                done();
            };
            range.minimum = 20;
            range.interval = 20;
            range.maximum = 100;
            range.refresh();
        });
        it('checking with label position inside', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_0');
                expect(element.getAttribute('y') === '102').toBe(true);
                done();
            };
            range.labelPosition = 'Inside';
            range.refresh();
        });
        it('checking with label position outside', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_0');
                expect(element.getAttribute('y') === '111' || element.getAttribute('y') === '111.25').toBe(true);
                done();
            };
            range.labelPosition = 'Outside';
            range.refresh();
        });
        it('checking with interval', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_0');
                expect(element.textContent).toEqual('20');
                element = document.getElementById('container_AxisLabel_1');
                expect(element.textContent).toEqual('25');
                done();
            };
            range.interval = 5;
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
        it('checking with area series', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_Series_0');
                expect(element.getAttribute('fill')).toBe('#00bdae');
                expect(element.getAttribute('stroke-width')).toBe('2');
                done();
            };
            range.series = [{ dataSource: data, xName: 'x', yName: 'y', type: 'Area' }];
            range.refresh();
        });
        it('checking with line series', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_Series_0');
                expect(element.getAttribute('fill')).toBe('none');
                expect(element.getAttribute('stroke-width')).toBe('1');
                expect(element.getAttribute('stroke')).toBe('#00bdae');
                done();
            };
            range.series[0].type = 'Line';
            range.refresh();
        });
        it('checking with multiple series', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_chart');
                expect(element.childElementCount).toEqual(2);
                done();
            };
            range.minimum = 10;
            range.maximum = 50;
            range.series = [{ dataSource: data, xName: 'x', yName: 'y' },
            { dataSource: data, xName: 'x', yName: 'y1' }];
            range.refresh();
        });
        it('checking with combination series', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_chart');
                expect(element.childElementCount).toEqual(2);
                element = document.getElementById('container_Series_0');
                expect(element.getAttribute('fill')).toBe('none');
                expect(element.getAttribute('stroke-width')).toBe('1');
                expect(element.getAttribute('stroke')).toBe('#00bdae');
                element = document.getElementById('container_Series_1');
                expect(element.getAttribute('fill')).toBe('#404041');
                done();
            };
            range.series = [{ dataSource: data, xName: 'x', yName: 'y' },
            { dataSource: data, xName: 'x', yName: 'y1', type: 'Area' }];
            range.refresh();
        });
        it('checking with fabric theme', (done: Function) => {
            range.loaded = (args: Object) => {
                let selectedElement: Element = document.getElementById('container_SelectedArea');
                expect(selectedElement.getAttribute('fill')).toEqual('transparent');
                done();
            };
            range.theme = 'Fabric';
            range.refresh();
        });
        it('checking with bootstrap theme', (done: Function) => {
            range.loaded = (args: Object) => {
                let selectedElement: Element = document.getElementById('container_SelectedArea');
                expect(selectedElement.getAttribute('fill')).toEqual('transparent');
                done();
            };
            range.theme = 'Bootstrap';
            range.refresh();
        });
        it('checking with highcontrast theme', (done: Function) => {
            range.loaded = (args: Object) => {
                let selectedElement: Element = document.getElementById('container_SelectedArea');
                expect(selectedElement.getAttribute('fill')).toEqual('transparent');
                done();
            };
            range.theme = 'Highcontrast';
            range.refresh();
        });
        it('checking with area series', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_Series_0');
                expect(element.getAttribute('fill')).toBe('#00bdae');
                expect(element.getAttribute('stroke-width')).toBe('2');
                done();
            };
            range.theme = 'Material';
            range.series[0].type = 'Area';
            range.refresh();
        });
        it('checking with line series', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_Series_0');
                expect(element.getAttribute('fill')).toBe('none');
                expect(element.getAttribute('stroke-width')).toBe('1');
                expect(element.getAttribute('stroke')).toBe('#00bdae');
                done();
            };
            range.series[0].type = 'Line';
            range.refresh();
        });
        it('checking with multiple series', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_chart');
                expect(element.childElementCount).toEqual(2);
                done();
            };
            range.minimum = 10;
            range.maximum = 50;
            range.series = [{ dataSource: data, xName: 'x', yName: 'y' },
            { dataSource: data, xName: 'x', yName: 'y1' }];
            range.refresh();
        });
        it('checking with combination series', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_chart');
                expect(element.childElementCount).toEqual(2);
                element = document.getElementById('container_Series_0');
                expect(element.getAttribute('fill')).toBe('none');
                expect(element.getAttribute('stroke-width')).toBe('1');
                expect(element.getAttribute('stroke')).toBe('#00bdae');
                element = document.getElementById('container_Series_1');
                expect(element.getAttribute('fill')).toBe('#404041');
                done();
            };
            range.value = [20, 50];
            range.series = [{ dataSource: data, xName: 'x', yName: 'y' },
            { dataSource: data, xName: 'x', yName: 'y1', type: 'Area' }];
            range.refresh();
        });
        it('checking with remote date lightweight', (done: Function) => {
            range.loaded = (args: object): void => {
                element = document.getElementById('container_chart');
                //expect(element.childElementCount).toEqual(0);
                done();
            };
            //range.dataSource = dataManager;
            //range.xName = 'Id';
            //range.yName = 'Estimate';
            //range.query = query
            //range.series = [];
            range.refresh();
        });
        it('checking with remote date lightweight', (done: Function) => {
            range.loaded = (args: object): void => {
                element = document.getElementById('container_chart');
                //expect(element.childElementCount).toEqual(1);
                done();
            };/*
            range.series = [{
                dataSource: dataManager, xName: 'Id', yName: 'Estimate',
                query: query
            }];
            range.getPersistData();*/
            range.refresh();
        });
        it('checking with margin', (done: Function) => {
            range.loaded = (args: Object): void => {
                let container: Element = document.getElementById('containerSeriesGroup0');
                /*expect(
                    container.getAttribute('transform') === 'translate(21.5,10)' ||
                    container.getAttribute('transform') === 'translate(21,10)'
                ).toBe(true);*/
                done();
            };
            //range.margin = { top: 10, left: 10, right: 10, bottom: 10 };
            range.refresh();
        });
    });
});
