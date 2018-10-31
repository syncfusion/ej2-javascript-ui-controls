/**
 * Empty Point specs
 */
import { createElement } from '@syncfusion/ej2-base';
import {
    Chart, LineSeries, ILoadedEventArgs, getElement, DataLabel, AreaSeries, ColumnSeries, BarSeries,
    StackingAreaSeries, ScatterSeries, BubbleSeries, StepLineSeries, SplineSeries, removeElement,
    StepAreaSeries, RangeColumnSeries, Category
 } from '../../../src/chart/index';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents, DataValue } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
Chart.Inject(
    LineSeries, DataLabel, AreaSeries, ColumnSeries, BarSeries, SplineSeries,
    StackingAreaSeries, ScatterSeries, BubbleSeries, StepLineSeries, StepAreaSeries,
    RangeColumnSeries, Category);
export let emptyPointsData1: DataValue[] = [
    { x: 1000, y: 70 }, { x: 2000, y: 40 },
    { x: 3000, y: null }, { x: 4000, y: 60 },
    { x: 5000, y: 50 }, { x: 6000, y: null },
    { x: 7000, y: 40 }];
export let emptyPointsData2: DataValue[] = [
        { x: 1000, y: null }, { x: 2000, y: 40 },
        { x: 3000, y: 50 }, { x: 4000, y: null },
        { x: 5000, y: null }, { x: 6000, y: 90 },
        { x: 7000, y: 40 }];
describe('Empty Points checking with', () => {
    let element: HTMLElement;
    describe('Numeric value Type', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let pathElement: Element = null;
        let markerElement: Element = null;
        let pointElement: Element = null;
        let path: string = null;
        let id: string = 'empty-container';
        let temp: number;
        element = createElement('div', { id: id });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    series: [{
                        animation: { enable: false }, name: 'Holiday Expense', dataSource: emptyPointsData1, xName: 'x', yName: 'y',
                        type: 'Line', fill: 'rgba(135,206,235,1)',
                        marker: { visible: true, dataLabel: { visible: true}}
                    },
                    {
                        animation: { enable: false }, name: 'Holiday Income', dataSource: emptyPointsData2, xName: 'x', yName: 'y',
                        type: 'Line', fill: 'green',
                        marker: { visible: true, dataLabel: { visible: true}}
                    }],
                    width: '800', title: 'Chart Empty Point Sample',
                    loaded: loaded,
                    legendSettings: { visible: false }
                });
            chartObj.appendTo('#' + id);

        });
        afterAll((): void => {
            chartObj.loaded = null;
            chartObj.destroy();
            removeElement('empty-container');
        });
        it('Empty Point with Line Series Gap mode', (done: Function) => {
            loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(3);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Empty Point with Line Series Zero mode', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(12);
                markerElement = getElement('empty-container_Series_0_Point_2_Symbol');
                expect(parseInt(markerElement.getAttribute('cx'), 10)).toBe(250);
                temp = parseInt(markerElement.getAttribute('cy'), 10);
                expect( temp === 372  || temp === 368 ).toBe(true);
                expect(markerElement.getAttribute('fill')).toBe('blue');
                expect(markerElement.getAttribute('stroke')).toBe('purple');
                expect(markerElement.getAttribute('stroke-width')).toBe('2');
                expect(pathLength).toBe(12);
                markerElement = getElement('empty-container_Series_1_Point_3_Symbol');
                expect(parseInt(markerElement.getAttribute('cx'), 10)).toBe(375);
                temp = parseInt(markerElement.getAttribute('cy'), 10);
                expect(temp === 372  || temp === 368).toBe(true);
                expect(markerElement.getAttribute('fill')).toBe('blue');
                expect(markerElement.getAttribute('stroke')).toBe('purple');
                expect(markerElement.getAttribute('stroke-width')).toBe('2');
                done();
            };
            chartObj.series[0].emptyPointSettings = { mode: 'Zero', fill: 'blue', border: { width: 2, color: 'purple'}};
            chartObj.series[1].emptyPointSettings = { mode: 'Zero', fill: 'blue', border: { width: 2, color: 'purple'}};
            chartObj.refresh();
        });
        it('Empty Point with Line Series Average Mode', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(12);
                markerElement = getElement('empty-container_Series_0_Point_5_Symbol');
                temp = parseInt(markerElement.getAttribute('cx'), 10);
                expect(temp === 626 || temp === 625).toBe(true);
                temp = parseInt(markerElement.getAttribute('cy'), 10);
                expect(temp === 204  ||temp === 202).toBe(true);
                markerElement = getElement('empty-container_Series_1_Point_4_Symbol');
                temp = parseInt(markerElement.getAttribute('cx'), 10);
                expect(temp === 500 || temp === 501).toBe(true);
                temp = parseInt(markerElement.getAttribute('cy'), 10);
                expect(temp === 204  ||temp === 202).toBe(true);
                done();
            };
            chartObj.series[0].emptyPointSettings = { mode: 'Average'};
            chartObj.series[1].emptyPointSettings = { mode: 'Average'};
            chartObj.refresh();
        });
        it('Empty Point with Line Series Drop Mode', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(8);
                markerElement = getElement('empty-container_Series_0_Point_5_Symbol');
                expect(markerElement).toBe(null);
                markerElement = getElement('empty-container_Series_0_Point_2_Symbol');
                expect(markerElement).toBe(null);
                done();
            };
            chartObj.series[0].emptyPointSettings = { mode: 'Drop'};
            chartObj.series[1].emptyPointSettings = { mode: 'Drop'};
            chartObj.refresh();
        });
        it('Empty Point with Column Series Average and Zero Mode', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_1_Point_4');
                path = pathElement.getAttribute('d');
                let pathXY: string[] = path.split(' ');
                expect(pathXY[2] === '372.25' || pathXY[2] === '368.25' ).toBe(true);
                expect(pathXY[2] === '372.25' || pathXY[5] === '368.25' ).toBe(true);
                pathElement = getElement(id + '_Series_0_Point_5');
                path = pathElement.getAttribute('d');
                pathXY = path.split(' ');
                temp = parseInt(pathXY[18], 10);
                expect(temp === 372 || temp === 368).toBe(true);
                temp = parseInt(pathXY[5], 10);
                expect(temp === 204 || temp === 202).toBe(true);
                done();
            };
            chartObj.series[0].type = 'Column';
            chartObj.series[1].type = 'Column';
            chartObj.series[0].emptyPointSettings = { mode: 'Average'};
            chartObj.series[1].emptyPointSettings = { mode: 'Zero'};
            chartObj.refresh();
        });
        it('Empty Point with Area Series Drop', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(7);
                markerElement = getElement('empty-container_Series_0_Point_5_Symbol');
                expect(markerElement).toBe(null);
                markerElement = getElement('empty-container_Series_0_Point_2_Symbol');
                expect(markerElement).toBe(null);
                pathElement = getElement(id + '_Series_1');
                path = pathElement.getAttribute('d');
                pathLength = path.split('L').length;
                expect(pathLength).toBe(6);
                markerElement = getElement('empty-container_Series_1_Point_4_Symbol');
                expect(markerElement).toBe(null);
                markerElement = getElement('empty-container_Series_1_Point_0_Symbol');
                expect(markerElement).toBe(null);
                done();
            };
            chartObj.series[0].type = 'Area';
            chartObj.series[1].type = 'Area';
            chartObj.series[0].emptyPointSettings = { mode: 'Drop'};
            chartObj.series[1].emptyPointSettings = { mode: 'Drop'};
            chartObj.refresh();
        });
        it('Empty Point with Stepline Series Drop', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(14);
                markerElement = getElement('empty-container_Series_0_Point_5_Symbol');
                expect(markerElement).toBe(null);
                markerElement = getElement('empty-container_Series_0_Point_2_Symbol');
                expect(markerElement).toBe(null);
                pathElement = getElement(id + '_Series_1');
                path = pathElement.getAttribute('d');
                pathLength = path.split('L').length;
                expect(pathLength).toBe(11);
                markerElement = getElement('empty-container_Series_1_Point_4_Symbol');
                expect(markerElement).toBe(null);
                markerElement = getElement('empty-container_Series_1_Point_0_Symbol');
                expect(markerElement).toBe(null);
                done();
            };
            chartObj.series[0].type = 'StepLine';
            chartObj.series[1].type = 'StepLine';
            chartObj.refresh();
        });
        it('Empty Point with Stacking Area Series Drop', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(11);
                markerElement = getElement('empty-container_Series_0_Point_5_Symbol');
                expect(markerElement).toBe(null);
                markerElement = getElement('empty-container_Series_0_Point_2_Symbol');
                expect(markerElement).toBe(null);
                pathElement = getElement(id + '_Series_1');
                path = pathElement.getAttribute('d');
                pathLength = path.split('L').length;
                expect(pathLength).toBe(10);
                markerElement = getElement('empty-container_Series_1_Point_4_Symbol');
                expect(markerElement).toBe(null);
                markerElement = getElement('empty-container_Series_1_Point_0_Symbol');
                expect(markerElement).toBe(null);
                done();
            };
            chartObj.series[0].type = 'StackingArea';
            chartObj.series[1].type = 'StackingArea';
            chartObj.refresh();
        });
        it('Empty Point with Scatter Series Average', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                markerElement = getElement(id + '_Series_1_Point_0');
                expect(parseInt(markerElement.getAttribute('cx'), 10)).toBe(0); 
                temp = parseInt(markerElement.getAttribute('cy'), 10);
                expect(temp === 297 || temp === 294).toBe(true);
                markerElement = getElement(id + '_Series_0_Point_5');
                temp = parseInt(markerElement.getAttribute('cx'), 10);
                expect(temp === 625 || temp === 626).toBe(true);
                temp = parseInt(markerElement.getAttribute('cy'), 10);
                expect(temp === 204 || temp === 202).toBe(true);
                done();
            };
            chartObj.series[0].type = 'Scatter';
            chartObj.series[1].type = 'Scatter';
            chartObj.series[0].emptyPointSettings = { mode: 'Average'};
            chartObj.series[1].emptyPointSettings = { mode: 'Average'};
            chartObj.refresh();
        });
        it('Empty Point with Bubble Series Average', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                markerElement = getElement(id + '_Series_1_Point_3');
                expect(parseInt(markerElement.getAttribute('cx'), 10)).toBe(375);
                temp = parseInt(markerElement.getAttribute('cy'), 10);
                expect(temp === 279 || temp === 276).toBe(true);
                markerElement = getElement(id + '_Series_0_Point_1');
                expect(parseInt(markerElement.getAttribute('cx'), 10)).toBe(125);
                temp = parseInt(markerElement.getAttribute('cy'), 10);
                expect(temp === 223 || temp === 220).toBe(true);
                done();
            };
            chartObj.series[0].type = 'Bubble';
            chartObj.series[1].type = 'Bubble';
            chartObj.series[0].emptyPointSettings = { mode: 'Average'};
            chartObj.series[1].emptyPointSettings = { mode: 'Average'};
            chartObj.refresh();
        });
        it('Empty Point with Spline Series Drop', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(4);
                pathElement = getElement(id + '_Series_1');
                path = pathElement.getAttribute('d');
                pathLength = path.split('L').length;
                expect(pathLength).toBe(3);
                done();
            };
            chartObj.series[0].type = 'Spline';
            chartObj.series[1].type = 'Spline';
            chartObj.series[0].emptyPointSettings = { mode: 'Drop'};
            chartObj.series[1].emptyPointSettings = { mode: 'Drop'};
            chartObj.refresh();
        });
        it('Empty Point with StepArea Series Drop', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(15);
                pathElement = getElement(id + '_Series_1');
                path = pathElement.getAttribute('d');
                pathLength = path.split('L').length;
                expect(pathLength).toBe(10);
                done();
            };
            chartObj.series[0].type = 'StepArea';
            chartObj.series[0].dataSource = [
                { x: 1000, y: 70 }, { x: 2000, y: undefined },
                { x: 3000, y: 40 }, { x: 4000, y: 60 },
                { x: 5000, y: 50 }, { x: 6000, y: null },
                { x: 7000, y: 40 }];
            chartObj.series[1].type = 'StepArea';
            chartObj.series[0].emptyPointSettings = { mode: 'Gap'};
            chartObj.series[1].emptyPointSettings = { mode: 'Drop'};
            chartObj.refresh();
        });
        it('Empty Point with Range Column Series Average and Zero', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement(id + '_Series_0_Point_5');
                path = pathElement.getAttribute('d');
                let pathXY: string[] = path.split(' ');
                temp = parseInt(pathXY[18], 10);
                expect(temp === 230 || temp === 227).toBe(true);
                temp = parseInt(pathXY[5], 10);
                expect(temp === 87).toBe(true);
                expect(pathElement.getAttribute('fill')).toBe('blue');
                pathElement = getElement(id + '_Series_1_Point_9');
                path = pathElement.getAttribute('d');
                pathXY = path.split(' ');
                temp = parseInt(pathXY[2], 10);
                expect(temp === 372 || temp === 368).toBe(true);
                temp = parseInt(pathXY[5], 10);
                expect(temp === 372 || temp === 368).toBe(true);
                done();
            };
            chartObj.series[0].dataSource = [
                    { x: 'Jan', low: 0.7, high: 6.1 }, { x: 'Feb', low: 1.3, high: 6.3 },
                    { x: 'Mar', low: 1.9, high: 8.5 }, { x: 'Apr', low: null, high: 10.8 },
                    { x: 'May', low: 5.7, high: 14.4 }, { x: 'June', low: 8.4, high: null },
                    { x: 'July', low: 10.6, high: 19.2 }, { x: 'Aug', low: 10.5, high: 18.9 },
                    { x: 'Sep', low: 8.5, high: 16.1 }, { x: 'Oct', low: null, high: null },
                    { x: 'Nov', low: 1.5, high: 6.9 }, { x: 'Dec', low: 5.1, high: 12.1 }
                ];
            chartObj.series[0].xName = 'x';
            chartObj.series[0].high = 'high';
            chartObj.series[0].low = 'low';
            chartObj.series[0].type = 'RangeColumn';
            chartObj.series[1].dataSource = [
                { x: 'Jan', low: 1.7, high: 7.1 }, { x: 'Feb', low: 1.9, high: 7.7 },
                { x: 'Mar', low: 1.2, high: 7.5 }, { x: 'Apr', low: null, high: 9.8 },
                { x: 'May', low: 4.7, high: 11.4 }, { x: 'June', low: 6.4, high: null },
                { x: 'July', low: 9.6, high: 17.2 }, { x: 'Aug', low: 10.7, high: 17.9 },
                { x: 'Sep', low: 7.5, high: 15.1 }, { x: 'Oct', low: null, high: null },
                { x: 'Nov', low: 1.2, high: 7.9 }, { x: 'Dec', low: 4.1, high: 9.1 }
            ];
            chartObj.series[1].xName = 'x';
            chartObj.series[1].high = 'high';
            chartObj.series[1].low = 'low';
            chartObj.series[1].type = 'RangeColumn';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].emptyPointSettings = { mode: 'Average'};
            chartObj.series[1].emptyPointSettings = { mode: 'Zero'};
            chartObj.refresh();
        });
     });
});