/**
 * Stock chart test cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { CandleSeries, DateTime, getElement, Tooltip, RangeTooltip, Zoom, Axis, VisibleRangeModel } from '../../src/index';
import { StockChart } from '../../src/stock-chart/index';
import { chartData } from './indicatordata.spec';
import { IStockChartEventArgs, IRangeChangeEventArgs } from '../../src/stock-chart/model/base';
import { MouseEvents } from '../chart/base/events.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
StockChart.Inject(CandleSeries, DateTime, Tooltip, RangeTooltip, Zoom);

describe('Stock Chart', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
// tslint:disable-next-line:align
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
            chart.stockChartOnMouseMove(<PointerEvent>eventObj);
            let currentRange: VisibleRangeModel = (chart.chart.primaryXAxis as Axis).visibleRange;
            //expect(previousRange.min).not.toEqual(currentRange.min);
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
            chart.stockChartOnMouseMove(<PointerEvent>eventObj);
            let currentRange: VisibleRangeModel = (chart.chart.primaryXAxis as Axis).visibleRange;
            //expect(previousRange.min).not.toEqual(currentRange.min);
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
            chart.stockChartOnMouseMove(<PointerEvent>eventObj);
            let currentRange: VisibleRangeModel = (chart.chart.primaryXAxis as Axis).visibleRange;
            //expect(previousRange.min).not.toEqual(currentRange.min);
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
    it('checked with rangeChange event', (done: Function) => {
        chart.rangeChange = (args: IRangeChangeEventArgs) => {
            let data: Object[] = [{
                x: new Date( '2012-04-02' ),
                open : 85.9757,
                high : 90.6657,
                low : 85.7685,
                close : 90.5257,
                volume : 660187068
              },
              {
                x: new Date( '2012-04-09' ),
                open : 89.4471,
                high : 92,
                low : 86.2157,
                close : 86.4614,
                volume : 912634864
              },
              {
                x: new Date( '2012-04-16' ),
                open : 87.1514,
                high : 88.6071,
                low : 81.4885,
                close : 81.8543,
                volume : 1221746066
              },
              {
                x: new Date( '2012-04-23' ),
                open : 81.5157,
                high : 88.2857,
                low : 79.2857,
                close : 86.1428,
                volume : 965935749
              },
              {
                x: new Date( '2012-04-30' ),
                open : 85.4,
                high : 85.4857,
                low : 80.7385,
                close : 80.75,
                volume : 615249365
              },
              {
                x: new Date( '2012-05-07' ),
                open : 80.2143,
                high : 82.2685,
                low : 79.8185,
                close : 80.9585,
                volume : 541742692
              },
              {
                x: new Date( '2012-05-14' ),
                open : 80.3671,
                high : 81.0728,
                low : 74.5971,
                close : 75.7685,
                volume : 708126233
              },
              {
                x: new Date( '2012-05-21' ),
                open : 76.3571,
                high : 82.3571,
                low : 76.2928,
                close : 80.3271,
                volume : 682076215
              }
            ];
            args.data = data;
            done();
        };
        chart.title = '';
        chart.enableSelector = true;
        chart.series =  [{
            xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
            dataSource: chartData, type: 'Candle', yName: 'close'
        }];
        chart.loaded = (args: IStockChartEventArgs) => {
            let element: number = (chart.series[0].dataSource as Object[]).length;
            //expect( element == 8).toBe(true);
            done();
        };
        chart.refresh();
    });
    it('checked with annotation content in chart', (done: Function) => {
        chart.loaded = (args: IStockChartEventArgs) => {
            let element: Element = document.getElementById('stock_stockChart_chart_Annotation_Collections');
            expect(element.childElementCount).not.toBe(0);
            done();
        };
        chart.annotations = [{ content: '<div>StockChart</div>'}];
        chart.refresh();
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