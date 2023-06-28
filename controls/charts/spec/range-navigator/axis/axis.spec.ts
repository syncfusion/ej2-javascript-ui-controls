import { RangeNavigator } from '../../../src/range-navigator/index';
import { AreaSeries } from '../../../src/chart/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
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
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
        it('checking with Bootstrap4 theme', (done: Function) => {
            range.loaded = (args: Object) => {
                let selectedElement: Element = document.getElementById('container_SelectedArea');
                expect(selectedElement.getAttribute('fill')).toEqual('#FFD939');
                done();
            };
            range.theme = 'Bootstrap4';
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
        it('checking with highContrast theme', (done: Function) => {
            range.loaded = (args: Object) => {
                let selectedElement: Element = document.getElementById('container_SelectedArea');
                expect(selectedElement.getAttribute('fill')).toEqual('#FFD939');
                done();
            };
            range.theme = 'HighContrastLight';
            range.refresh();
        });
        it('checking with tailwind theme', (done: Function) => {
            range.loaded = (args: Object) => {
                let selectedElement: Element = document.getElementById('container_SelectedArea');
                expect(selectedElement.getAttribute('fill')).toEqual('#4F46E5');
                done();
            };
            range.theme = 'Tailwind';
            range.refresh();
        });
        it('checking with tailwind dark theme', (done: Function) => {
            range.loaded = (args: Object) => {
                let selectedElement: Element = document.getElementById('container_SelectedArea');
                expect(selectedElement.getAttribute('fill')).toEqual('#22D3EE');
                done();
            };
            range.theme = 'TailwindDark';
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
                expect(element.getAttribute('y') === '107').toBe(true);
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
                expect(element.getAttribute('stroke-width')).toBe('0');
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
            range.theme = 'HighContrastLight';
            range.refresh();
        });
        it('checking with area series', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_Series_0');
                expect(element.getAttribute('fill')).toBe('#00bdae');
                expect(element.getAttribute('stroke-width')).toBe('0');
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
        it('checking with remote date lightweight', () => {
            range.loaded = (args: object): void => {
                element = document.getElementById('container_chart');
                // expect(element.childElementCount).toEqual(0);
                // done();
            };
            range.dataSource = dataManager;
            range.xName = 'Id';
            range.yName = 'Estimate';
            range.query = query
            range.series = [];
            range.refresh();
        });
        it('checking with remote date lightweight', () => {
            range.loaded = (args: object): void => {
                element = document.getElementById('container_chart');
                // expect(element.childElementCount).toEqual(1);
                // done();
            };
            range.series = [{
                dataSource: dataManager, xName: 'Id', yName: 'Estimate',
                query: query
            }];
            range.getPersistData();
            range.refresh();
        });
        it('checking with margin', () => {
            range.loaded = (args: Object): void => {
                let container: Element = document.getElementById('containerSeriesGroup0');
                // expect(
                //     container.getAttribute('transform') === 'translate(21.5,10)' ||
                //     container.getAttribute('transform') === 'translate(21,10)'
                // ).toBe(true);
                // done();
            };
            range.margin = { top: 10, left: 10, right: 10, bottom: 10 };
            range.refresh();
        });
        it('checking materialdark', () => {
            range.loaded = (args: Object): void => {
                let container: Element = document.getElementById('containerSeriesGroup0');
                // expect(
                //     container.getAttribute('transform') === 'translate(21.5,10)' ||
                //     container.getAttribute('transform') === 'translate(21,10)'
                // ).toBe(true);
                // done();
            };
            range.theme = 'MaterialDark';
            range.refresh();
        });
        it('checking fabricdark', () => {
            range.loaded = (args: Object): void => {
                let container: Element = document.getElementById('containerSeriesGroup0');
                // expect(
                //     container.getAttribute('transform') === 'translate(21.5,10)' ||
                //     container.getAttribute('transform') === 'translate(21,10)'
                // ).toBe(true);
                // done();
            };
            range.theme = 'FabricDark';
            range.refresh();
        });
        it('checking Bootstrapdark', () => {
            range.loaded = (args: Object): void => {
                let container: Element = document.getElementById('containerSeriesGroup0');
                // expect(
                //     container.getAttribute('transform') === 'translate(21.5,10)' ||
                //     container.getAttribute('transform') === 'translate(21,10)'
                // ).toBe(true);
                // done();
            };
            range.theme = 'BootstrapDark';
            range.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});
