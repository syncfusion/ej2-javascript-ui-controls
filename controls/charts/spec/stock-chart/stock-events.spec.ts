/**
 * Unit test cases for stock events
 */
import { CandleSeries, DateTime, getElement, ChartLocation } from '../../src/chart/index';
import { StockChart, IStockEventRenderArgs } from '../../src/stock-chart/index';
import { createElement } from '@syncfusion/ej2-base';
import { chartData } from './indicatordata.spec';
import { MouseEvents } from '../chart/base/events.spec';
StockChart.Inject(CandleSeries, DateTime);


describe('default stock chart', () => {
    let stockchart: StockChart;
    let chartElement: Element = createElement('div', { id: 'stockEvents' });
    let element: Element;
    let trigger: MouseEvents = new MouseEvents();
    let pointLocation: ChartLocation;
    beforeAll(() => {
        document.body.appendChild(chartElement);
        stockchart = new StockChart({
            primaryXAxis: { valueType: 'DateTime' },
            series: [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Candle', yName: 'close'
            }],
        });
    });
    afterAll((): void => {
        stockchart.destroy();
        chartElement.remove();
    });
    it('Checking stock chart instance creation', (done: Function) => {
        stockchart.loaded = (args: Object): void => {
            expect(stockchart != null).toBe(true);
            done();
        };
        stockchart.appendTo('#stockEvents');
    });
    it('checking with default stock events', (done: Function) => {
        stockchart.loaded = (args: Object) => {
            element = getElement(chartElement.id + '_StockEvents');
            expect(element.childElementCount).toBe(1);
            //expect((element.childNodes[1]).childNodes.length).toBe(3);
            done();
        };
        stockchart.stockEvents = [{ date: new Date(2017, 2, 31), text: 'Market' }];
        stockchart.refresh();
    });
    it('checking with stock events with arrow shapes', (done: Function) => {
        stockchart.loaded = (args: Object) => {
            element = getElement(chartElement.id + '_StockEvents');
            expect(element.childElementCount).toBe(4);
            //expect((element.childNodes[0]).childNodes.length).toBe(3);
            document.getElementById('stockEvents_Series_0_StockEvents_1_Shape').dispatchEvent(new MouseEvent('mousemove'));
            done();
        };
        stockchart.stockEvents = [
            { date: new Date(2017, 2, 31), text: 'A', type: 'ArrowDown', description: 'Add your text' },
            { date: new Date(2017, 3, 31), text: 'B', type: 'ArrowUp', description: 'Longer text' },
            { date: new Date(2017, 4, 31), text: 'C', type: 'ArrowRight', description: 'Market starts' },
            { date: new Date(2017, 5, 31), text: 'D', type: 'ArrowLeft', description: 'Marker ends' }];
        stockchart.refresh();
    });
    it('checking with stock events tooltip', (done: Function) => {
        stockchart.loaded = (args: Object) => {
            element = getElement(chartElement.id + '_StockEvents');
            expect(element.childElementCount).toBe(1);
            pointLocation = stockchart.stockEvent.symbolLocations[0][0];
            trigger.mousemovetEvent(element.childNodes[0] as Element, pointLocation.x, pointLocation.y + 40);
            expect(getElement('stockEvents_StockEvents_Tooltip_text').textContent).toEqual('Stock events tooltip');
            done();
        };
        stockchart.stockEvents = [{ date: new Date(2017, 2, 31), text: 'Market', description: 'Stock events tooltip' }];
        stockchart.refresh();
    });
    it('checking with successive tooltip cases', (done: Function) => {
        stockchart.loaded = (args: Object) => {
            element = getElement(chartElement.id + '_StockEvents');
            expect(element.childElementCount).toBe(4);
            pointLocation = stockchart.stockEvent.symbolLocations[0][13];
            trigger.mousemovetEvent(element.childNodes[0] as Element, pointLocation.x, pointLocation.y + 40);
            expect(getElement('stockEvents_Series_0_StockEvents_13_Text').textContent).toEqual('A');
            expect(getElement('stockEvents_StockEvents_Tooltip_text').textContent).toEqual('This is event description');
            pointLocation = stockchart.stockEvent.symbolLocations[0][14];
            expect(getElement('stockEvents_Series_0_StockEvents_14_Text').textContent).toEqual('C');
            trigger.mousemovetEvent(element.childNodes[1] as Element, pointLocation.x, pointLocation.y + 40);
            expect(getElement('stockEvents_StockEvents_Tooltip_text').textContent).toEqual('Add longer text');
            done();
        };
        stockchart.stockEvents = [
            { date: new Date(2012, 3, 1), text: 'Q2', description: '2012 Quarter2 starts', type: 'Square' },
            { date: new Date(2012, 6, 1), text: 'Q3', description: '2012 Quarter3 starts' },
            { date: new Date(2012, 9, 1), text: 'Q4', description: '2012 Quarter3 starts', type: 'Flag' },
            { date: new Date(2012, 12, 0), text: 'Q1', description: '2013 Quarter1 starts', type: 'Pin', showOnSeries: false },
            { date: new Date(2013, 3, 1), text: 'Q2', description: '2013 Quarter2 starts', type: 'Square' },
            { date: new Date(2013, 6, 1), text: 'Q3', description: '2013 Quarter3 starts' },
            { date: new Date(2013, 9, 1), text: 'Q4', description: '2013 Quarter3 starts', type: 'Flag' },
            { date: new Date(2013, 12, 0), text: 'Q1', description: '2014 Quarter1 starts', type: 'Pin', showOnSeries: false },
            { date: new Date(2014, 3, 1), text: 'Q2', description: '2014 Quarter2 starts', type: 'Square' },
            { date: new Date(2014, 6, 1), text: 'Q3', description: '2014 Quarter3 starts' },
            { date: new Date(2014, 9, 1), text: 'Q4', description: '2014 Quarter3 starts', type: 'Flag' },
            { date: new Date(2014, 12, 0), text: 'Q1', description: '2015 Quarter1 starts', type: 'Pin', showOnSeries: false },
            { date: new Date(2014, 2, 2), text: 'End', description: 'Markets closed', type: 'Flag' },
            { date: new Date('2017-01-07'), text: 'A', description: 'This is event description', type: 'Circle' },
            { date: new Date(2017, 1, 2), text: 'C', description: 'Add longer text', type: 'Square'},
            { date: new Date(2017, 2, 2), text: 'D', description: 'Stock events', type: 'Flag' },
            { date: new Date(2017, 2, 12), text: 'Market', description: 'Markets closed', type: 'Pin' },
        ];
        stockchart.series[0].dataSource = chartData;
        stockchart.refresh();
    });

    it('checking with mouse move in the same element', () => {
        trigger.mousemovetEvent(element.childNodes[1] as Element, pointLocation.x + 10, pointLocation.y + 40);
        expect(getElement('stockEvents_StockEvents_Tooltip_text').textContent).toEqual('Add longer text');
        trigger.mousemoveEvent(getElement('stockEvents'), 200, 200, 100, 100);
    });


    it('checking with stock event colors', (done: Function) => {
        stockchart.loaded = () => {
           element = getElement('stockEvents_Series_0_StockEvents_0_Shape');
           expect(element.getAttribute('fill')).toBe('black');
           expect(element.getAttribute('stroke')).toBe('red');
           done();
        };
        stockchart.series[0].dataSource = chartData;
        stockchart.stockEvents = [
            { date: new Date('2017-01-07'), text: 'A', description: 'This is event description', type: 'Triangle',
             textStyle: { color: 'white'}, background: 'black', border: { color: 'red'} },
            { date: new Date(2017, 1, 2), text: 'C', description: 'Add longer text', type: 'InvertedTriangle'},
            { date: new Date(2017, 2, 2), text: 'D', description: 'Stock events', type: 'Flag' },
            { date: new Date(2017, 2, 12), text: 'Market', description: 'Markets closed', type: 'Text' },
        ];
        stockchart.refresh();
    });

    it('checking with stock event for particular series', (done: Function) => {
        stockchart.loaded = () => {
            element = getElement('stockEvents_Series_0_StockEvents_0_Shape');
           expect(element.getAttribute('fill')).toBe('black');
           expect(element.getAttribute('stroke')).toBe('red');
           done();
        };
        stockchart.series[0].dataSource = chartData;
        stockchart.series[0].type = 'Line';
        stockchart.stockEvents = [
            { date: new Date('2017-01-07'), placeAt: 'y', text: 'A', description: 'This is event description', type: 'Triangle',
             textStyle: { color: 'white'}, seriesIndexes: [0], background: 'black', border: { color: 'red'} },
            { date: new Date(2017, 1, 2), text: 'C', placeAt: 'y', description: 'Add longer text',
             seriesIndexes: [0], type: 'InvertedTriangle'}
        ];
        stockchart.refresh();
    });

    it('checking with stock event render', (done: Function) => {
        stockchart.loaded = () => {
            element = getElement(chartElement.id + '_StockEvents');
            expect(element.childElementCount).toBe(0);
            done();
        };
        stockchart.series[0].dataSource = chartData;
        stockchart.stockEventRender = (args: IStockEventRenderArgs) => {
            args.cancel = true;
        };
        stockchart.stockEvents = [
            { date: new Date('2017-01-07'), text: 'A', description: 'This is event description', type: 'Triangle',
             textStyle: { color: 'white'}, background: 'black', border: { color: 'red'} },
            { date: new Date(2017, 1, 2), text: 'C', description: 'Add longer text', type: 'InvertedTriangle'},
            { date: new Date(2017, 2, 2), text: 'D', description: 'Stock events', type: 'Flag' },
            { date: new Date(2017, 2, 12), text: 'Market', description: 'Markets closed', type: 'Text' },
        ];
        stockchart.refresh();
    });
});