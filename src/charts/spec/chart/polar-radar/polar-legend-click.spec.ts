/**
 * legend click checking
 */
import { Chart, Legend, LineSeries, ILoadedEventArgs, SeriesModel, getElement, Series, ColumnSeries, } from '../../../src/chart/index';
import { BarSeries, SplineSeries, DataLabel, AreaSeries, StackingColumnSeries, StackingAreaSeries } from '../../../src/chart/index';
import { PolarSeries, RadarSeries, DateTime, Category, Logarithmic } from '../../../src/chart/index';
import { DateTimeCategory, RangeColumnSeries, RangeAreaSeries, ScatterSeries } from '../../../src/chart/index';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { MouseEvents } from '../base/events.spec';
Chart.Inject(Legend, LineSeries, ColumnSeries, BarSeries, SplineSeries, DataLabel, AreaSeries);
Chart.Inject(StackingColumnSeries, ScatterSeries, StackingAreaSeries, ScatterSeries);
Chart.Inject(PolarSeries, RadarSeries, DateTime, Category, Logarithmic, DateTimeCategory, RangeColumnSeries, RangeAreaSeries);

let i: number; let currentPoint: Points; let value: number = 0; let data: Points[] = []; let seriesCollection: SeriesModel[] = [];
let colors: string[] = ['#663AB6', '#EB3F79', '#F8AB1D', '#B82E3D', '#049CB1', '#F2424F', '#C2C924', '#3DA046', '#074D67', '#02A8F4'];
let toggle: boolean = true;
for (let j: number = 0; j < 20; j++) {
    for (i = 0; i < 10; i++) {
        value = i * j + (10 * (j + 1));
        currentPoint = { x: i, y: value, date: new Date(value), z: value + 10 };
        data.push(currentPoint);
    }
    if (j % 5 === 0 && j !== 0) { toggle = false; } else { toggle = true; }
    seriesCollection[j] = {
        name: 'Series ' + j, fill: colors[j % 9], dataSource: data,
        xName: 'x', yName: 'y',
        marker: { visible: true, shape: 'Circle', dataLabel: { visible: true, border: { color: 'red', width: 2} } },
        animation: { enable: false },
        legendShape: 'SeriesType', visible: toggle,
        type: 'Polar'
    };
    data = [];
}
interface Points {
    x: number;
    y: number;
    z: number;
    date: Date;
}

describe('Legend Checking Polar Radar Series ', () => {
    let chart: Chart;
    let loaded: EmitType<ILoadedEventArgs>;
    let legendId: string = 'legendClick' + '_chart_legend';
    let legendElement: Element;
    let id: string = 'legendClick';
    let series: SeriesModel[] = [seriesCollection[0], seriesCollection[1], seriesCollection[2], seriesCollection[3], seriesCollection[4]];
    let trigger: MouseEvents = new MouseEvents();
    let value: number;
    let ele: HTMLElement = createElement('div', { id: id });
    let seriesElement: HTMLElement;
    let lastLabel: HTMLElement;
    let seriesCollectionEle: HTMLElement;
    let symbolElement: HTMLElement;
    let textElement: HTMLElement;
    let shapeElement: HTMLElement;
    document.body.appendChild(ele);
    beforeAll((): void => {
        chart = new Chart({
            series: series,
            legendSettings: { border: { color: 'red' }, visible: true },
        });
        chart.appendTo(ele);
    });
    afterAll((): void => {
        chart.destroy();
        ele.remove();
    });
    it('checked before legend click', () => {
        seriesCollectionEle = getElement(ele.id + 'SeriesCollection') as HTMLElement;
        seriesElement = getElement('legendClickSeriesGroup2') as HTMLElement;
        lastLabel = getElement(ele.id + 'AxisLabels1') as HTMLElement;
        expect(seriesElement).not.toEqual(null);
        expect(seriesCollectionEle.childElementCount).toEqual(12);
        expect(lastLabel.lastElementChild.innerHTML).toEqual('100');
    });
    it('checking with legend click series deselect', (done: Function) => {
        legendElement = getElement('legendClick_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesElement = getElement('legendClickSeriesGroup4') as HTMLElement;
            symbolElement = getElement('legendClickSeriesGroup4') as HTMLElement;
            shapeElement = getElement('legendClickShapeGroup4') as HTMLElement;
            textElement = getElement('legendClickTextGroup4') as HTMLElement;
            seriesCollectionEle = getElement('legendClickSeriesCollection') as HTMLElement;
            expect(seriesElement).toEqual(null);
            expect(symbolElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            lastLabel = getElement(ele.id + 'AxisLabels1') as HTMLElement;
            expect(lastLabel.lastElementChild.innerHTML).toEqual('80');
            expect(seriesCollectionEle.childElementCount).toEqual(10);
            done();
        }, 301);
    });
    it('checking with legend click series select', (done: Function) => {
        legendElement = getElement('legendClick_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesElement = getElement('legendClickSeriesGroup4') as HTMLElement;
            symbolElement = getElement('legendClickSeriesGroup4') as HTMLElement;
            shapeElement = getElement('legendClickShapeGroup4') as HTMLElement;
            textElement = getElement('legendClickTextGroup4') as HTMLElement;
            expect(seriesElement).not.toEqual(null);
            expect(symbolElement).not.toEqual(null);
            expect(shapeElement).not.toEqual(null);
            expect(textElement).not.toEqual(null);
            lastLabel = getElement(ele.id + 'AxisLabels1') as HTMLElement;
            expect(lastLabel.lastElementChild.innerHTML).toEqual('100');
            expect(seriesCollectionEle.childElementCount).toEqual(10);
            done();
        }, 301);
    });

    it('changed to seriesType as Spline', () => {
        for (let value of chart.series) {
            value.drawType = 'Spline';
        }
        chart.refresh();
        expect(getElement('legendClick_Series_4').getAttribute('d').indexOf('C') > -1).toBe(true);
        lastLabel = getElement(ele.id + 'AxisLabels1') as HTMLElement;
        expect(lastLabel.lastElementChild.innerHTML).toEqual('100');
    });

    it('checking with spline legend click series deselect', (done: Function) => {
        legendElement = getElement('legendClick_chart_legend_text_4');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesElement = getElement('legendClickSeriesGroup4') as HTMLElement;
            symbolElement = getElement('legendClickSeriesGroup4') as HTMLElement;
            shapeElement = getElement('legendClickShapeGroup4') as HTMLElement;
            textElement = getElement('legendClickTextGroup4') as HTMLElement;
            expect(seriesElement).toEqual(null);
            expect(symbolElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            lastLabel = getElement(ele.id + 'AxisLabels1') as HTMLElement;
            expect(lastLabel.lastElementChild.innerHTML).toEqual('80');
            done();
        }, 301);
    });
    it('checking with spline legend click series select', (done: Function) => {
        legendElement = getElement('legendClick_chart_legend_text_2');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesElement = getElement('legendClickSeriesGroup2') as HTMLElement;
            symbolElement = getElement('legendClickSeriesGroup2') as HTMLElement;
            shapeElement = getElement('legendClickShapeGroup2') as HTMLElement;
            textElement = getElement('legendClickTextGroup2') as HTMLElement;
            expect(seriesElement).toEqual(null);
            expect(symbolElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            done();
        }, 301);
    });
    it('checking with Area series legend click series select', (done: Function) => {
        for (let series of chart.series) {
            series.drawType = 'Area';
        }
        chart.refresh();
        legendElement = getElement('legendClick_chart_legend_text_1');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesElement = getElement('legendClickSeriesGroup1') as HTMLElement;
            symbolElement = getElement('legendClickSeriesGroup1') as HTMLElement;
            shapeElement = getElement('legendClickShapeGroup1') as HTMLElement;
            textElement = getElement('legendClickTextGroup1') as HTMLElement;
            expect(seriesElement).toEqual(null);
            expect(symbolElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            lastLabel = getElement(ele.id + 'AxisLabels1') as HTMLElement;
            expect(lastLabel.lastElementChild.innerHTML).toEqual('80');
            done();
        }, 301);
    });
    it('checking with StackingArea series legend click series select', (done: Function) => {
        for (let series of chart.series) {
            series.drawType = 'StackingArea';
        }
        chart.refresh();
        lastLabel = getElement(ele.id + 'AxisLabels1') as HTMLElement;
        expect(lastLabel.lastElementChild.innerHTML).toEqual('100');
        legendElement = getElement('legendClick_chart_legend_text_2');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesElement = getElement('legendClickSeriesGroup2') as HTMLElement;
            symbolElement = getElement('legendClickSeriesGroup2') as HTMLElement;
            shapeElement = getElement('legendClickShapeGroup2') as HTMLElement;
            textElement = getElement('legendClickTextGroup2') as HTMLElement;
            expect(seriesElement).not.toEqual(null);
            expect(symbolElement).not.toEqual(null);
            expect(shapeElement).not.toEqual(null);
            expect(textElement).not.toEqual(null);
            lastLabel = getElement(ele.id + 'AxisLabels1') as HTMLElement;
            expect(lastLabel.lastElementChild.innerHTML).toEqual('150');
            done();
        }, 301);
    });
    it('checking with StackingColumn series legend click series select', (done: Function) => {
        for (let series of chart.series) {
            series.drawType = 'StackingColumn';
        }
        chart.refresh();
        legendElement = getElement('legendClick_chart_legend_text_2');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesElement = getElement('legendClickSeriesGroup2') as HTMLElement;
            symbolElement = getElement('legendClickSeriesGroup2') as HTMLElement;
            shapeElement = getElement('legendClickShapeGroup2') as HTMLElement;
            textElement = getElement('legendClickTextGroup2') as HTMLElement;
            expect(seriesElement).toEqual(null);
            expect(symbolElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            expect(getElement('legendClick1_AxisLabel_3').innerHTML).toEqual('60');
            done();
        }, 301);
    });
    it('checking with Scatter series legend click series select', (done: Function) => {
        for (let series of chart.series) {
            series.drawType = 'Scatter';
            series.marker.dataLabel.visible = false;
        }
        chart.refresh();
        legendElement = getElement('legendClick_chart_legend_text_3');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesElement = getElement('legendClickSeriesGroup3') as HTMLElement;
            symbolElement = getElement('legendClickSeriesGroup3') as HTMLElement;
            shapeElement = getElement('legendClickShapeGroup3') as HTMLElement;
            textElement = getElement('legendClickTextGroup3') as HTMLElement;
            expect(seriesElement).toEqual(null);
            expect(symbolElement).toEqual(null);
            expect(shapeElement).toEqual(null);
            expect(textElement).toEqual(null);
            expect(getElement('legendClick1_AxisLabel_3').innerHTML).toEqual('10.000');
            done();
        }, 301);
    });
    it('checking with RangeColumn series legend click series select', (done: Function) => {
        for (let series of chart.series) {
            series.drawType = 'RangeColumn';
            series.high = 'y';
            series.low = 'z';
        }
        chart.refresh();
        legendElement = getElement('legendClick_chart_legend_text_2');
        trigger.clickEvent(legendElement);
        setTimeout(() => {
            seriesElement = getElement('legendClickSeriesGroup2') as HTMLElement;
            expect(seriesElement).not.toEqual(null);
            expect(getElement('legendClick1_AxisLabel_3').innerHTML).toEqual('60');
            done();
        }, 301);
    });
});