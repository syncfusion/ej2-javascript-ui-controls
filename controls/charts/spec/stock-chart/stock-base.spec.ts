/**
 * Stock chart test cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { CandleSeries, DateTime, getElement, Tooltip, RangeTooltip, Zoom, Axis, VisibleRangeModel } from '../../src/index';
import { StockChart } from '../../src/stock-chart/index';
import { chartData } from './indicatordata.spec';
import { IStockChartEventArgs } from '../../src/stock-chart/model/base';
import { MouseEvents } from '../chart/base/events.spec';
StockChart.Inject(CandleSeries, DateTime, Tooltip, RangeTooltip, Zoom);

describe('default stock chart', () => {
    let chart: StockChart;
    let chartElement: Element = createElement('div', { id: 'stock' });
    let trigger: MouseEvents = new MouseEvents();
    let element: Element;
    let prevent: Function = (): void => {
    };
    beforeAll(() => {
        document.body.appendChild(chartElement);
        chart = new StockChart({
            primaryXAxis: { valueType: 'DateTime' },
            series: [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Candle', yName: 'close'
            }],
        });
    });
    afterAll((): void => {
        chart.destroy();
        chartElement.remove();
    });
    it('Checking accumulation instance creation', (done: Function) => {
        chart.loaded = (args: Object): void => {
            expect(chart != null).toBe(true);
            done();
        };
        chart.appendTo('#stock');
    });
    it('empty options control class names', () => {
        element = getElement(chartElement.id);
        expect(element.classList.contains('e-control')).toBe(true);
        expect(element.classList.contains('e-stockchart')).toBe(true);
    });
    it('checking with disabling period selector', (done: Function) => {
        chart.loaded = (args: IStockChartEventArgs) => {
            element = getElement('stock_Secondary_Element');
            expect(element.childElementCount).toEqual(0);
            done();
        };
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.enablePeriodSelector = false;
        chart.refresh();
    });
    it('checking with disabling range selector', (done: Function) => {
        chart.loaded = (args: IStockChartEventArgs) => {
            element = getElement('stock_stockChart_svg');
            expect(element.childElementCount).toEqual(1);
            done();
        };
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.enableSelector = false;
        chart.refresh();
    });
    it('checking with enabling period selector with default periods', (done: Function) => {
        chart.loaded = (args: IStockChartEventArgs) => {
            element = getElement('stock_selector');
            expect(element.childElementCount).toEqual(1);
            done();
        };
        chart.enablePeriodSelector = true;
        chart.enableSelector = true;
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.refresh();
    });
    it('checking with tooltip', (done: Function) => {
        chart.loaded = (args: IStockChartEventArgs) => {
            done();
        };
        chart.tooltip = { enable: true, shared: true };
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.refresh();
    });

    it('checking with tooltip with formats', (done: Function) => {
        chart.loaded = (args: IStockChartEventArgs) => {
            done();
        };
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.tooltip = { enable: true, shared: true, header: '${point.x}', format: '${point.x}' };
        chart.refresh();
    });

    it('checked with custom periods', (done: Function) => {
        chart.loaded = (args: IStockChartEventArgs) => {
            done();
        };
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.periods = [{ interval: 1, intervalType: 'Years', text: '1M' }, { interval: 2, intervalType: 'Years', text: '2M' },
        { text: 'ytd', selected: true }];
        chart.refresh();
    });
    it('checked with title', (done: Function) => {
        chart.loaded = (args: IStockChartEventArgs) => {
            // element = getElement('stock_stockChart_Title');
            // expect(element).not.toEqual(null);
            // expect(element.innerHTML).toBe('Stock chart');
            done();
        };
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        // chart.title = 'Stock chart';
        // chart.titleStyle = { color: 'red'};
        chart.refresh();
    });
    it('checked without title', (done: Function) => {
        chart.loaded = (args: IStockChartEventArgs) => {
            element = getElement('stock_stockChart_Title');
            expect(element).toEqual(null);
            done();
        };
        chart.title = '';
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.refresh();
    });
    it('Checking with panning mouse events', (done: Function) => {
        let elem: Element = getElement('stock_stockChart_chart');
        chart.loaded = (args: Object): void => {
            chart.loaded = null;
            let previousRange: VisibleRangeModel = (chart.chart.primaryXAxis as Axis).visibleRange;
            let resetElement = document.getElementById('stock_Zooming_Reset');
            expect(resetElement == null).toBe(true);
            chart.primaryXAxis.zoomFactor = 1;
            let eventObj: Object = {
                target: elem,
                type: 'mousedown',
                stopImmediatePropagation: prevent,
                pageX: 50,
                pageY: 50,
                clientX: 50,
                clientY: 250
            };
            chart.stockChartOnMouseDown(<PointerEvent>eventObj);
            eventObj = {
                target: elem,
                type: 'mousemove',
                stopImmediatePropagation: prevent,
                pageX: 100,
                pageY: 350,
                clientX: 100,
                clientY: 350
            };
            chart.stockChartMouseMove(<PointerEvent>eventObj);
            let currentRange: VisibleRangeModel = (chart.chart.primaryXAxis as Axis).visibleRange;
            expect(previousRange.min).not.toEqual(currentRange.min);
            eventObj = {
                target: elem,
                type: 'mouseend',
                stopImmediatePropagation: prevent,
                pageX: 100,
                pageY: 350,
                clientX: 100,
                clientY: 350
            };
            chart.stockChartMouseEnd(<PointerEvent>eventObj);
            done();
        };
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.zoomSettings = { enableSelectionZooming: true, enablePan: true };
        chart.refresh();
    });
    it('Checking with panning touch events', (done: Function) => {
        let elem: Element = getElement('stock_stockChart_chart');
        chart.loaded = (args: Object): void => {
            chart.loaded = null;
            let previousRange: VisibleRangeModel = (chart.chart.primaryXAxis as Axis).visibleRange;
            let resetElement = document.getElementById('stock_Zooming_Reset');
            expect(resetElement == null).toBe(true);
            chart.primaryXAxis.zoomFactor = 1;
            let eventObj: Object = {
                target: elem,
                type: 'touchstart',
                stopImmediatePropagation: prevent,
                pageX: 50,
                pageY: 50,
                clientX: 50,
                clientY: 250,
                changedTouches: [{ clientX: 100, clientY: 350}]
            };
            chart.stockChartOnMouseDown(<PointerEvent>eventObj);
            eventObj = {
                target: elem,
                type: 'touchmove',
                stopImmediatePropagation: prevent,
                pageX: 100,
                pageY: 350,
                clientX: 100,
                clientY: 350,
                changedTouches: [{ clientX: 200, clientY: 350}]
            };
            chart.stockChartMouseMove(<PointerEvent>eventObj);
            let currentRange: VisibleRangeModel = (chart.chart.primaryXAxis as Axis).visibleRange;
            expect(previousRange.min).not.toEqual(currentRange.min);
            eventObj = {
                target: elem,
                type: 'touchend',
                stopImmediatePropagation: prevent,
                pageX: 100,
                pageY: 350,
                clientX: 100,
                clientY: 350,
                changedTouches: [{ clientX: 210, clientY: 350}]
            };
            chart.stockChartMouseEnd(<PointerEvent>eventObj);
            done();
        };
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.zoomSettings = { enableSelectionZooming: true, enablePan: true };
        chart.refresh();
    });

    it('Checking with panning touch leave', (done: Function) => {
        let elem: Element = getElement('stock_stockChart_chart');
        chart.loaded = (args: Object): void => {
            chart.loaded = null;
            let previousRange: VisibleRangeModel = (chart.chart.primaryXAxis as Axis).visibleRange;
            let resetElement = document.getElementById('stock_Zooming_Reset');
            expect(resetElement == null).toBe(true);
            chart.primaryXAxis.zoomFactor = 1;
            let eventObj: Object = {
                target: elem,
                type: 'touchstart',
                stopImmediatePropagation: prevent,
                pageX: 50,
                pageY: 50,
                clientX: 50,
                clientY: 250,
                changedTouches: [{ clientX: 80, clientY: 350}]
            };
            chart.stockChartOnMouseDown(<PointerEvent>eventObj);
            eventObj = {
                target: elem,
                type: 'touchmove',
                stopImmediatePropagation: prevent,
                pageX: 100,
                pageY: 350,
                clientX: 100,
                clientY: 350,
                changedTouches: [{ clientX: 100, clientY: 350}]
            };
            chart.stockChartMouseMove(<PointerEvent>eventObj);
            let currentRange: VisibleRangeModel = (chart.chart.primaryXAxis as Axis).visibleRange;
            expect(previousRange.min).not.toEqual(currentRange.min);
            eventObj = {
                target: elem,
                type: 'touchleave',
                stopImmediatePropagation: prevent,
                pageX: 100,
                pageY: 350,
                clientX: 100,
                clientY: 350,
                changedTouches: [{ clientX: 100, clientY: 350}]
            };
            chart.stockChartMouseEnd(<PointerEvent>eventObj);
            done();
        };
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.zoomSettings = { enableSelectionZooming: true, enablePan: true };
        chart.refresh();
    });

    it('Checking mouse wheel as forward ', (done: Function) => {
        chart.loaded = (args: Object): void => {
            chart.loaded = null;
            let wheelArgs = {
                preventDefault: prevent,
                wheelDelta: 120,
                detail: 3,
                clientX: 210,
                clientY: 100,
            };
            chart.chart.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
            done();
        };
        chart.zoomSettings.enableMouseWheelZooming = true;
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.refresh();
    });
    it('Checking button click with selector', (done: Function) => {
        chart.loaded = (args: Object): void => {
            let element: Element = document.getElementsByClassName('e-hscroll-content')[0].children[0].children[4].firstElementChild;
            trigger.clickEvent(element);
            done();
        };
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.enableSelector = false;
        chart.refresh();

    });
});
