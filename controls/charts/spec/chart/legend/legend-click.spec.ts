/**
 * legend click checking
 */
import { Chart, Legend, LineSeries, ILoadedEventArgs, ILegendClickEventArgs, SeriesModel, getElement, Series, ColumnSeries, 
    Category, Trendlines  } from '../../../src/index';
import { BarSeries, SplineSeries, DataLabel, AreaSeries, StackingColumnSeries, StackingAreaSeries } from '../../../src/index';
import { ErrorBar, StackingBarSeries, StripLine, DateTime, AccumulationDistributionIndicator, ChartAnnotation } from '../../../src/index';
import { CandleSeries, HiloOpenCloseSeries, HiloSeries, RangeAreaSeries, RangeColumnSeries, ScatterSeries } from '../../../src/index';
import { Logarithmic, DateTimeCategory } from '../../../src/index';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { MouseEvents } from '../base/events.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
Chart.Inject(Legend, LineSeries, ColumnSeries, BarSeries, SplineSeries, DataLabel, AreaSeries, ScatterSeries, Trendlines);
Chart.Inject(StackingColumnSeries, StackingBarSeries, StackingAreaSeries, ErrorBar, StripLine, ChartAnnotation);
Chart.Inject(DateTime, CandleSeries, HiloOpenCloseSeries, HiloSeries, RangeAreaSeries, RangeColumnSeries);
Chart.Inject(AccumulationDistributionIndicator, Logarithmic, Category, DateTimeCategory);

let i: number; let currentPoint: Points; let value: number = 0; let data: Points[] = []; let seriesCollection: SeriesModel[] = [];
let colors: string[] = ['#663AB6', '#EB3F79', '#F8AB1D', '#B82E3D', '#049CB1', '#F2424F', '#C2C924', '#3DA046', '#074D67', '#02A8F4'];
let toggle: boolean = true;
for (let j: number = 0; j < 20; j++) {
    for (i = 0; i < 10; i++) {
        value = i * j + (10 * (j + 1));
        currentPoint = { x: i, y: value };
        data.push(currentPoint);
    }
    if (j % 5 === 0 && j !== 0) { toggle = false; } else { toggle = true; }
    seriesCollection[j] = {
        name: 'Series ' + j, fill: colors[j % 9], dataSource: data,
        xName: 'x', yName: 'y',
        marker: { visible: false, shape: 'Circle', dataLabel: { visible: true, border: { color: 'red', width: 2} } },
        animation: { enable: false },
        legendShape: 'SeriesType', visible: toggle,
        type: 'Line'
    };
    data = [];
}
interface Points {
    x: number;
    y: number;
}
describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
});
describe('Chart Control Legend Checking', () => {
    let chart: Chart;
    let loaded: EmitType<ILoadedEventArgs>;
    let legendClick: EmitType<ILegendClickEventArgs>;
    let legendId: string = 'cartesianChart' + '_chart_legend';
    let legendElement: Element;
    let series: SeriesModel[] = [seriesCollection[0], seriesCollection[1], seriesCollection[2], seriesCollection[3], seriesCollection[4]];
    let trigger: MouseEvents = new MouseEvents();
    let value: number;
    let ele: HTMLElement = createElement('div', { id: 'cartesianChart'  });
    let seriesElement: HTMLElement;
    let lastLabel: HTMLElement;
    let dataLabel: HTMLElement;
    let svg: HTMLElement;
    document.body.appendChild(ele);
    beforeAll((): void => {
        chart = new Chart({
            height: '400', width: '800', series: series,
            legendSettings: { border: { color: 'red' }, visible: true },
        });
        chart.appendTo(ele);
    });
    afterAll((): void => {
        chart.destroy();
        document.getElementById('cartesianChart').remove();
    });
    it('checking with before legend click', () => {
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        lastLabel = getElement('cartesianChart1_AxisLabel_5') as  HTMLElement;
        expect(seriesElement.childElementCount).toEqual(7);
        expect(seriesElement.style.visibility).toEqual('');
        expect(lastLabel.innerHTML).toEqual('100');
    });
    it('checking with datalabel before legend click', () => {
        dataLabel = getElement('cartesianChart_Series_3_Point_0_Text_0') as HTMLElement;
        expect(parseFloat(dataLabel.getAttribute('y')) == 216 || parseFloat(dataLabel.getAttribute('y')) == 213.75).toBe(true);
    });
    it('checking with line series legend deselect', (done: Function) => {
        legendElement = getElement('cartesianChart_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        lastLabel = getElement('cartesianChartAxisLabels1') as HTMLElement;
        setTimeout(() => {
            expect(seriesElement.childElementCount).toEqual(6);
            expect((lastLabel.lastChild as HTMLElement).innerHTML).toEqual('80');
            done();
        }, 301);
    });
    it('checking with datalabel after legend click', () => {
        dataLabel = getElement('cartesianChart_Series_3_Point_0_Text_0') as HTMLElement;
        expect(parseFloat(dataLabel.getAttribute('y'))).toBeGreaterThanOrEqual(181.625);
    });
    it('checking with line series legend again selected', (done: Function) => {
        legendElement = getElement('cartesianChart_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        lastLabel = getElement('cartesianChartAxisLabels1') as HTMLElement;
        setTimeout(() => {
            expect((lastLabel.lastChild as HTMLElement).innerHTML).toEqual('100');
            expect(seriesElement.childElementCount).toEqual(7);
            done();
        }, 301);
    });

    it('checking with datalabel before legend selected', () => {
        dataLabel = getElement('cartesianChart_Series_3_Point_0_Text_0') as HTMLElement;
        expect(+(dataLabel.getAttribute('y'))).toBeLessThanOrEqual(216);
    });

    it('checking with column series legend deselect', (done: Function) => {
        chart.animateSeries = false;
        chart.series.every((value: Series) => {
            value.type = 'Column';
            return true;
        });
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        lastLabel = getElement('cartesianChartAxisLabels1') as HTMLElement;
        setTimeout(() => {
            expect(seriesElement.childElementCount).toEqual(6);
            expect((lastLabel.lastChild as HTMLElement).innerHTML).toEqual('80');
            done();
        }, 301);
    });

    it('checking with column series changed to bar series and check select', (done: Function) => {
        chart.animateSeries = false;
        chart.series.every((value: Series) => {
            value.type = 'Bar';
            return true;
        });
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        lastLabel = getElement('cartesianChartAxisLabels1') as HTMLElement;
        setTimeout(() => {
            expect(seriesElement.childElementCount == 7 || seriesElement.childElementCount == 6);
            expect((lastLabel.lastChild as HTMLElement).innerHTML == '100' || (lastLabel.lastChild as HTMLElement).innerHTML == '80');
            done();
        }, 301);
    });
    it('checking with spline series and check deselect', (done: Function) => {
        chart.series.every((value: Series) => {
            value.type = 'Spline';
            return true;
        });
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        lastLabel = getElement('cartesianChartAxisLabels1') as HTMLElement;
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        setTimeout(() => {
            expect(seriesElement.childElementCount).toEqual(6);
            expect(seriesElement.contains(getElement(ele.id + 'SeriesGroup4'))).toEqual(false);
            expect((lastLabel.lastChild as HTMLElement).innerHTML).toEqual('80');
            done();
        }, 301);
    });
    it('checking with area series with select', (done: Function) => {
        chart.series.every((value: Series) => {
            value.type = 'Area';
            return true;
        });
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_1');
        trigger.clickEvent(legendElement);
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        lastLabel = getElement('cartesianChartAxisLabels1') as HTMLElement;
        setTimeout(() => {
            expect(seriesElement.childElementCount == 5 || seriesElement.childElementCount == 6);
            expect(seriesElement.contains(getElement(ele.id + 'SeriesGroup1'))).toEqual(false);
            expect(seriesElement.childElementCount == 5 || seriesElement.childElementCount == 6);
            expect(lastLabel.lastElementChild.innerHTML).toEqual('80');
            done();
        }, 301);
    });
    it('checking with area series with deselect', (done: Function) => {
        chart.series.every((value: Series) => {
            value.type = 'Area';
            return true;
        });
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_0');
        trigger.clickEvent(legendElement);
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        lastLabel = getElement('cartesianChartAxisLabels1') as HTMLElement;
        setTimeout(() => {
            expect(seriesElement.childElementCount).toEqual(4);
            expect(lastLabel.lastElementChild.innerHTML).toEqual('80');
            expect(seriesElement.contains(getElement(ele.id + 'SeriesGroup1'))).toEqual(false);
            done();
        }, 301);
    });
    it('checking with area Stacked Column series', (done: Function) => {
        chart.series.every((value: Series) => {
            value.type = 'StackingColumn';
            return true;
        });
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_0');
        trigger.clickEvent(legendElement);
        legendElement = getElement('cartesianChart_chart_legend_text_1');
        trigger.clickEvent(legendElement);
        legendElement = getElement('cartesianChart_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        lastLabel = getElement('cartesianChartAxisLabels1') as HTMLElement;
        setTimeout(() => {
            expect(seriesElement.childElementCount).toEqual(7);
            expect(lastLabel.lastElementChild.innerHTML).toEqual('300');
            done();
        }, 301);
    });
    it('checking with Stacking bar', (done: Function) => {
        chart.series.every((value: Series) => {
            value.type = 'StackingBar';
            return true;
        });
        chart.refresh();
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        lastLabel = getElement('cartesianChartAxisLabels1') as HTMLElement;
        setTimeout(() => {
            dataLabel = getElement('cartesianChart_Series_3_Point_0_Text_0') as HTMLElement;
            expect(dataLabel.getAttribute('x') == '236.5' || dataLabel.getAttribute('x') == '237').toBe(true);
            expect(seriesElement.childElementCount).toEqual(7);
            expect(lastLabel.lastElementChild.innerHTML).toEqual('300');
            done();
        }, 301);
    });
    it('checking with marker', () => {
        chart.series.every((value: Series) => {
            value.type = 'Line';
            value.marker.visible = true;
            return true;
        });
        chart.refresh();
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        dataLabel = getElement('cartesianChart_Series_2_Point_0_Symbol') as HTMLElement;
        expect(parseFloat(dataLabel.getAttribute('cy')) == 223.475 || parseFloat(dataLabel.getAttribute('cy')) == 224.87499999999997).toBe(true);
        expect(seriesElement.contains(getElement(ele.id + 'SymbolGroup4'))).toBe(true);
    });
    it('checking with marker after legend click', (done: Function) => {
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        legendElement = getElement('cartesianChart_chart_legend_text_4');
        expect(seriesElement.childElementCount).toEqual(12);
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            expect(seriesElement.contains(getElement(ele.id + 'SymbolGropu4'))).toBe(false);
            dataLabel = getElement('cartesianChart_Series_2_Point_0_Symbol') as HTMLElement;
            expect(parseFloat(dataLabel.getAttribute('cy')) == 199.53125 || parseFloat(dataLabel.getAttribute('cy')) == 200.78125).toBe(true);
            expect(seriesElement.childElementCount).toEqual(12);
            done();
        }, 301);
    });
    it('checked with errorBar', () => {
        for (let value of chart.series) {
            value.errorBar.visible = true;
        }
        chart.refresh();
        seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        let errorBar: Element = getElement('cartesianChart_Series__ErrorBarGroup_0_Point_0');
        expect(seriesElement.childElementCount).toEqual(14);
        let path: string = errorBar.getAttribute('d').split(' ')[2];
        expect(path == '275.35312500000003' || path == '277.078125').toBe(true);
    });
    it('checked with error bar after legend Click', (done: Function) => {
        legendElement = getElement('cartesianChart_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            let errorBar: Element = getElement('cartesianChart_Series__ErrorBarGroup_0_Point_0');
            seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            expect((errorBar.getAttribute('d').split(' ')[2])).toBeLessThanOrEqual(285.9125);
            expect(seriesElement.childElementCount).toEqual(17);
            done();
        }, 301);
    });

    it('checked with stripline', () => {
        chart.primaryYAxis.stripLines = [
            {
                start: 20, end: 50, visible: true
            }
        ];
        chart.refresh();
        let stripLine: Element = getElement('cartesianChart_stripline_Behind_rect_primaryYAxis_0');
        expect(stripLine.getAttribute('d') === 'M 38.5 219.0625 L 790 219.0625').toBe(true);
    });
    it('checked with stripline after legend click', (done: Function) => {
        legendElement = getElement('cartesianChart_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            let stripLine: Element = getElement('cartesianChart_stripline_Behind_rect_primaryYAxis_0');
            expect(stripLine.getAttribute('d') === 'M 32.5 190.953125 L 790 190.953125').toBe(true);
            done();
        }, 301);
    });
    it('checking with Scatter Series', (done: Function) => {
        chart.series.every((value: Series) => {
            value.type = 'Scatter';
            return true;
        });
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_3');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesElement = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            expect(seriesElement.childElementCount).toEqual(8);
            done();
        }, 301);
    });
    it('checking series color without giving fill color in legendClick event', (done: Function) => {
        loaded = (args: Object): void => {
            chart.loaded = null;
            legendElement = document.getElementById(legendId + '_shape_0');
            trigger.clickEvent(legendElement);
            expect(legendElement.getAttribute('d').split('L').length).toBe(4);
            trigger.clickEvent(legendElement);
            svg = document.getElementById('cartesianChart_Series_0_Point_0');
            expect(svg.getAttribute('fill') == '#663AB6').toBe(true);
            done();
        };
        legendClick = (args: ILegendClickEventArgs): void => {
            args.legendShape = 'Triangle';
        }
        chart.legendClick = legendClick;
        chart.loaded = loaded;
        chart.refresh();
    });
    it('checking with legend shape after legendClick event', (done: Function) => {
        loaded = (args: Object): void => {
            chart.loaded = null;
            legendElement = document.getElementById(legendId + '_text_' + 0);
            trigger.clickEvent(legendElement);
            expect(legendElement.textContent).toBe('Series 0');
            legendElement = document.getElementById(legendId + '_shape_0');
            trigger.clickEvent(legendElement);
            expect(legendElement.getAttribute('d').split('L').length).toBe(5);
            svg = document.getElementById('cartesianChart_Series_0_Point_0');
            trigger.clickEvent(legendElement);
            expect(svg.getAttribute('fill') == 'red').toBe(true);
            done();
        };
        legendClick = (args: ILegendClickEventArgs): void =>{
            args.legendShape = 'Diamond';
            args.chart.series[0].fill = "red";
        }
        chart.legendClick = legendClick;
        chart.loaded = loaded;
        chart.refresh();
    });
});


let dateTimeData: any[] = [
    { x: new Date(2000, 1, 12), high: 125, low: 70, open: 115, close: 90, volume: 1000 },
    { x: new Date(2002, 1, 12), high: 150, low: 60, open: 120, close: 70 , volume: 2000},
    { x: new Date(2006, 1, 12), high: 170, low: 90, open: 140, close: 110, volume: 1500 },
    { x: new Date(2008, 1, 12), high: 200, low: 100, open: 180, close: 120, volume: 2500 }];

let chartData: any[] = [
    { x: new Date(2000, 1, 12), high: 70, low: 30, open: 40, close: 60, volume: 2000 },
    { x: new Date(2002, 1, 12), high: 200, low: 100, open: 80, close: 180, volume: 1500 },
    { x: new Date(2006, 1, 12), high: 50, low: 10, open: 40, close: 30, volume: 1000 },
    { x: new Date(2008, 1, 12), high: 200, low: 100, open: 180, close: 120, volume: 2700 }
];
describe('Financial chart', () => {
    let chart: Chart;
    let loaded: EmitType<ILoadedEventArgs>;
    let legendId: string = 'cartesianChart' + '_chart_legend';
    let legendElement: Element;
    let trigger: MouseEvents = new MouseEvents();
    let value: number;
    let ele: HTMLElement = createElement('div', { id: 'cartesianChart' });
    let seriesCollection: HTMLElement;
    let seriesElement: HTMLElement;
    let textElement: HTMLElement;
    let shapeElement: HTMLElement;
    document.body.appendChild(ele);
    beforeAll((): void => {
        chart = new Chart({
            primaryXAxis: { valueType: 'DateTime'},
            height: '400', width: '800',
            series: [{
                dataSource: chartData, width: 2,
                xName: 'x', yName: 'y', low: 'low', high: 'high', close: 'close', volume: 'volume', open: 'open',
                name: 'Apple Inc', marker: { dataLabel: { visible: true}},
                type: 'Candle', animation: { enable: false }
            },
            {
                dataSource: dateTimeData, width: 2,
                xName: 'x', yName: 'y', low: 'low', high: 'high', close: 'close', volume: 'volume', open: 'open',
                name: 'Apple Inc1', marker: { dataLabel: { visible: true}},
                type: 'Candle', animation: { enable: false }
            }],
            legendSettings: { border: { color: 'red' }, visible: true },
        });
        chart.appendTo(ele);
    });
    afterAll((): void => {
        chart.destroy();
        document.getElementById('cartesianChart').remove();
    });
    it('checked before legend click', () => {
        seriesElement = getElement('cartesianChartSeriesGroup1') as HTMLElement;
        seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
    });
    it('checking with legend click series deselect', (done: Function) => {
        legendElement = getElement('cartesianChart_chart_legend_text_1');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            seriesElement = getElement('cartesianChartSeriesGroup1') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup1') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup1') as HTMLElement;
            let dataLabelCollection: HTMLElement = getElement(ele.id + 'DataLabelCollection') as HTMLElement;
            expect(seriesCollection.childElementCount).toEqual(3);
            expect(seriesElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            expect(dataLabelCollection.contains(shapeElement)).toEqual(false);
            done();
        }, 301);
    });
    it('checking with legend click series select', (done: Function) => {
        legendElement = getElement('cartesianChart_chart_legend_text_1');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            seriesElement = getElement('cartesianChartSeriesGroup1') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup1') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup1') as HTMLElement;
            let dataLabelCollection: HTMLElement = getElement(ele.id + 'DataLabelCollection') as HTMLElement;
            expect(seriesCollection.childElementCount).toEqual(4);
            expect(dataLabelCollection.contains(shapeElement)).toEqual(true);
            done();
        }, 301);
    });
    it('checking with legend click series select hilo series', (done: Function) => {
        for (let series of chart.series) {
            series.type = 'Hilo';
        }
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_0');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            seriesElement = getElement('cartesianChartSeriesGroup0') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup0') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup0') as HTMLElement;
            let dataLabelCollection: HTMLElement = getElement(ele.id + 'DataLabelCollection') as HTMLElement;
            expect(seriesCollection.childElementCount).toEqual(3);
            expect(seriesElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            expect(dataLabelCollection.contains(shapeElement)).toEqual(false);
            done();
        }, 301);
    });
    it('checking with legend click series select hiloOpenClose series', (done: Function) => {
        for (let series of chart.series) {
            series.type = 'HiloOpenClose';
        }
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_0');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            seriesElement = getElement('cartesianChartSeriesGroup0') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup0') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup0') as HTMLElement;
            let dataLabelCollection: HTMLElement = getElement(ele.id + 'DataLabelCollection') as HTMLElement;
            expect(seriesCollection.childElementCount).toEqual(4);
            expect(seriesElement).not.toEqual(null);
            expect(shapeElement).not.toEqual(null);
            expect(textElement).not.toEqual(null);
            expect(dataLabelCollection.contains(shapeElement)).toEqual(true);
            done();
        }, 301);
    });
    it('checking with legend click series select RangeColumn series', (done: Function) => {
        for (let series of chart.series) {
            series.type = 'RangeColumn';
        }
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_1');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            seriesElement = getElement('cartesianChartSeriesGroup1') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup1') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup1') as HTMLElement;
            let dataLabelCollection: HTMLElement = getElement(ele.id + 'DataLabelCollection') as HTMLElement;
            expect(seriesCollection.childElementCount).toEqual(3);
            expect(seriesElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            expect(dataLabelCollection.contains(shapeElement)).toEqual(false);
            done();
        }, 301);
    });
    it('checking with legend click series select RangeArea series', (done: Function) => {
        for (let series of chart.series) {
            series.type = 'RangeArea';
        }
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_1');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            seriesElement = getElement('cartesianChartSeriesGroup1') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup1') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup1') as HTMLElement;
            let dataLabelCollection: HTMLElement = getElement(ele.id + 'DataLabelCollection') as HTMLElement;
            expect(seriesCollection.childElementCount).toEqual(4);
            expect(seriesElement).not.toEqual(null);
            expect(shapeElement).not.toEqual(null);
            expect(textElement).not.toEqual(null);
            done();
        }, 301);
    });
    it('checking with legend click series select RangeArea series', (done: Function) => {
        chart.primaryXAxis.valueType = 'DateTimeCategory';
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_1');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            seriesElement = getElement('cartesianChartSeriesGroup1') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup1') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup1') as HTMLElement;
            let dataLabelCollection: HTMLElement = getElement(ele.id + 'DataLabelCollection') as HTMLElement;
            expect(seriesCollection.childElementCount).toEqual(3);
            expect(seriesElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            done();
        }, 301);
    });
    it('checking without series', (done: Function) => {
        legendElement = getElement('cartesianChart_chart_legend_text_0');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            seriesElement = getElement('cartesianChartSeriesGroup0') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup0') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup0') as HTMLElement;
            let dataLabelCollection: HTMLElement = getElement(ele.id + 'DataLabelCollection') as HTMLElement;
            expect(seriesCollection.childElementCount).toEqual(1);
            expect(seriesElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            seriesElement = getElement('cartesianChartSeriesGroup1') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup1') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup1') as HTMLElement;
            expect(seriesElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            let lastLabel: HTMLElement = getElement(ele.id + 'AxisLabels1') as HTMLElement;
            expect((lastLabel.lastChild as HTMLElement).innerHTML).toEqual('6');
            done();
        }, 301);
    });
    it('checking with category axis', (done: Function) => {
        chart.primaryXAxis.valueType = 'Category';
        chart.series = [
            { dataSource: [{ x: 'IND', y: 60}, { x: 'AUS', y: 180}], xName: 'x', yName: 'y', name: 'series2', animation: { enable: false}},
            { dataSource: [{ x: 'IND', y: 45}, { x: 'AUS', y: 56}], xName: 'x', yName: 'y', name: 'series1', animation: { enable: false}}
        ];
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_0');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            seriesElement = getElement('cartesianChartSeriesGroup0') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup0') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup0') as HTMLElement;
            expect(seriesElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            let lastLabel: HTMLElement = getElement(ele.id + 'AxisLabels1') as HTMLElement;
            expect((lastLabel.lastChild as HTMLElement).innerHTML).toEqual('60');
            expect((lastLabel.firstElementChild.innerHTML)).toEqual('0');
            done();
        }, 301);
    });
    it('checking with log axis', (done: Function) => {
        chart.primaryXAxis.valueType = 'Category';
        chart.primaryYAxis.valueType = 'Logarithmic';
        chart.series = [
            { dataSource: [{ x: 'IND', y: 600}, { x: 'AUS', y: 180}], xName: 'x', yName: 'y', name: 'series2', animation: { enable: false}},
            { dataSource: [{ x: 'IND', y: 45}, { x: 'AUS', y: 5006}], xName: 'x', yName: 'y', name: 'series1', animation: { enable: false}}
        ];
        chart.refresh();
        legendElement = getElement('cartesianChart_chart_legend_text_1');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            seriesElement = getElement('cartesianChartSeriesGroup1') as HTMLElement;
            shapeElement = getElement('cartesianChartShapeGroup1') as HTMLElement;
            textElement = getElement('cartesianChartTextGroup1') as HTMLElement;
            expect(seriesElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            let lastLabel: HTMLElement = getElement(ele.id + 'AxisLabels1') as HTMLElement;
            expect((lastLabel.lastChild as HTMLElement).innerHTML).toEqual('1000');
            done();
        }, 301);
    });
    it('checking multiple axes', (done: Function) => {
        chart.primaryXAxis.valueType = 'Double';
        chart.rows = [ { height: '50%', border: { width: 1, color: 'red'}}, { height: '50%', border: { width: 1, color: 'blue'}}];
        chart.axes = [ { rowIndex: 1, name: 'secondaryY'}];
        chart.series = [
            { dataSource: [{ x: 2, y: 34}, { x: 4, y: 45 }], xName: 'x', yName: 'y', type: 'Line', name: 'Ser1', animation: { enable: false} },
            { dataSource: [{ x: 1, y: 50}, { x: 5, y: 12 }], xName: 'x', yName: 'y', type: 'Line', name: 'Ser2', animation: { enable: false} },
            { dataSource: [{ x: 1, y: 50}, { x: 5, y: 12 }], xName: 'x', yName: 'y', type: 'Line', name: 'Ser3', yAxisName: 'secondaryY', animation: { enable: false} },
            { dataSource: [{ x: 1, y: 50}, { x: 5, y: 112 }], xName: 'x', yName: 'y', type: 'Line', name: 'Ser4', yAxisName: 'secondaryY', animation: { enable: false} },
        ];
        chart.refresh();
        seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        legendElement = getElement('cartesianChart_chart_legend_text_3');
        expect(seriesCollection.childElementCount).toEqual(5);
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesCollection = getElement(ele.id + 'SeriesCollection') as HTMLElement;
            let lastLabel: HTMLElement = getElement(ele.id + 'AxisLabels2') as HTMLElement;
            expect((lastLabel.lastChild as HTMLElement).innerHTML).toEqual('60');
            expect((lastLabel.firstChild as HTMLElement).innerHTML).toEqual('0');
            expect(seriesCollection.childElementCount).toEqual(4);
            done();
        }, 301);
    });
    it('checking with series visibilty with trendline series', (done: Function) => {
        loaded = (args: Object): void => {
            chart.loaded = null;
            legendElement = document.getElementById('cartesianChart_chart_legend_text_0');
            trigger.clickEvent(legendElement);
            expect(legendElement.textContent).toBe('Series');
            legendElement = document.getElementById('cartesianChart_chart_legend_text_1');
            trigger.clickEvent(legendElement);
            trigger.clickEvent(legendElement);
            expect(legendElement.textContent).toBe('Trendlines');
            legendElement = document.getElementById('cartesianChart_chart_legend_text_0');
            trigger.clickEvent(legendElement);
            expect(legendElement.textContent).toBe('Series');
            done();
        };
        chart.series = [
            {
                dataSource: [{ x: "1947", y: 4.76 }, { x: "1967", y: 7.50 }, { x: "1974", y: 8.10 }, { x: "1989", y: 16.64 }, { x: "1990", y: 17.32 }, { x: "2000", y: 43.56 },], xName: 'x', yName: 'y', name: 'Series', type: 'Spline',
                trendlines: [{ type: 'Linear', width: 3, name: 'Trendlines', fill: '#C64A75', enableTooltip: false }]
            },
        ];
        chart.primaryYAxis = {
            minimum: 0, maximum: 50,
            interval: 2, lineStyle: { width: 0 }, majorTickLines: { width: 0 }, majorGridLines: { width: 1 },
        },
        chart.primaryXAxis.valueType = 'Category';
        chart.loaded = loaded;
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