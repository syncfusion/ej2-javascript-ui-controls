/**
 * Legend Spec 
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Series } from '../../../src/chart/series/chart-series';
import { Highlight } from '../../../src/chart/user-interaction/high-light';
import { SeriesModel } from '../../../src/chart/series/chart-series-model';
import { LineSeries } from '../../../src/chart/series/line-series';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { StepLineSeries } from '../../../src/chart/series/step-line-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { StackingAreaSeries } from '../../../src/chart/series/stacking-area-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { StackingColumnSeries } from '../../../src/chart/series/stacking-column-series';
import { ScatterSeries } from '../../../src/chart/series/scatter-series';
import { SplineSeries } from '../../../src/chart/series/spline-series';
import { Legend } from '../../../src/chart/legend/legend';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { MouseEvents } from '../base/events.spec';
import { ILegendRenderEventArgs } from '../../../src/chart/model/chart-interface';
import { unbindResizeEvents } from '../base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../../src/chart/model/chart-interface';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
Chart.Inject(LineSeries, SplineSeries, Legend, StepLineSeries, AreaSeries, StackingAreaSeries, StackingColumnSeries, ColumnSeries,
    ScatterSeries, BarSeries, Selection, Highlight, DateTime, Tooltip);
let i: number; let currentPoint: Points; let value: number = 0; let data: Points[] = []; let seriesCollection: SeriesModel[] = [];
let colors: string[] = ['#663AB6', '#EB3F79', '#F8AB1D', '#B82E3D', '#049CB1', '#F2424F', '#C2C924', '#3DA046', '#074D67', '#02A8F4'];
let toggle: boolean = true;
for (let j: number = 0; j < 20; j++) {
    for (i = 0; i < 10; i++) {
        value = Math.random() * 100;
        currentPoint = { x: i, y: value };
        data.push(currentPoint);
    }
    if (j % 5 === 0 && j !== 0) { toggle = false; } else { toggle = true; }
    seriesCollection[j] = {
        name: 'Series ' + j, fill: colors[j % 9], dataSource: data,
        xName: 'x', yName: 'y',
        marker: { visible: true, shape: 'Circle' },
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
describe('Chart Legend', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Chart Control Legend Checking', () => {
        let count: number = 0;
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let legendRendering: EmitType<ILegendRenderEventArgs>;
        let id: string = 'container1';
        let legendId: string = id + '_chart_legend';
        let legendElement: Element;
        let trigger: MouseEvents = new MouseEvents();
        let value: number;
        let ele: HTMLElement = createElement('div', { id: id });
        document.body.appendChild(ele);
        let series: SeriesModel[] = [seriesCollection[0], seriesCollection[1], seriesCollection[2], seriesCollection[3], seriesCollection[4]];
        beforeAll((): void => {
            chartObj = new Chart({
                height: '400', width: '800', series: series,
                legendSettings: { border: { color: 'red' }, visible: true },
                primaryYAxis: { minimum: 0, maximum: 100 },
                primaryXAxis: { minimum: 0, maximum: 10 }
            });
            chartObj.appendTo(ele);
        });
        afterAll((): void => {
            chartObj.destroy();
            document.getElementById(id).remove();
        });
        it('Single Series Static Name and Multiple series legend text', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_text_0');
                expect(legendElement.textContent).toEqual('SeriesOnetesting');
                for (let i: number = 0, length: number = chartObj.series.length; i < length; i++) {
                    legendElement = document.getElementById(legendId + '_text_' + i);
                    expect(legendElement.textContent).toEqual(chartObj.series[i].name);
                }
                done();
            };
            chartObj.series[0].name = 'SeriesOnetesting';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Height Only', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('height'), 10)).toEqual(100);
                done();
            };
            chartObj.legendSettings = { height: '100' };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Width Only', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('width'), 10)).toEqual(240);
                done();
            };
            chartObj.legendSettings = { width: '240', height: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Height and Width', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('width'), 10)).toEqual(240);
                expect(parseInt(legendElement.getAttribute('height'), 10)).toEqual(100);
                done();
            };
            chartObj.legendSettings = { height: '100', width: '240' };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Trimmed text and mouse over and out', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_text_0');
                trigger.mousemoveEvent(legendElement, 0, 0, 387, 309.25);
                let tooltip: Element = document.getElementById('container1_EJ2_Legend_Tooltip');
                expect(tooltip.textContent).toBe('Series one');
                expect(legendElement.textContent.split('...').length).toEqual(2);
                legendElement = document.getElementById(legendId + '_text_2');
                trigger.mousemoveEvent(legendElement, 0, 0, 387, 278.5);
                tooltip = document.getElementById('container1_EJ2_Legend_Tooltip');
                //expect(tooltip).toBe(null);
                legendElement = document.getElementById(legendId + '_text_1');
                trigger.mousemoveEvent(legendElement, 0, 0, 387, 330.75);
                tooltip = document.getElementById('container1_EJ2_Legend_Tooltip');
                // expect(tooltip.textContent).toBe('Series two');
                remove(tooltip)
                done();
            };
            chartObj.legendSettings = { width: '80' };
            chartObj.series[0].name = 'Series one';
            chartObj.series[1].name = 'Series two';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('legend highlight with patterns', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_text_0');
                trigger.mousemoveEvent(legendElement, 0, 0, 387, 309.25);
                let selectedId: string = id + '_ej2_chart_highlight_series_0';
                expect(document.getElementsByClassName(selectedId).length).toBe(3);
                done();
            };
            chartObj.legendSettings = { width: '80', toggleVisibility: false };
            chartObj.series[0].name = 'Series one';
            chartObj.series[1].name = 'Series two';
            chartObj.highlightMode = 'Point';
            chartObj.highlightPattern = 'HorizontalDash';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Style fill, height, width', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                for (let i: number = 0, length: number = chartObj.series.length; i < length; i++) {
                    legendElement = document.getElementById(legendId + '_shape_' + i);
                    if (i % 5 === 0 && i !== 0) {
                        expect(legendElement.getAttribute('fill')).toEqual('lightgray');
                    } else {
                        expect(legendElement.getAttribute('fill')).toEqual(chartObj.series[i].fill);
                    }
                    expect(legendElement.getAttribute('d')).not.toEqual('');
                }
                done();
            };
            chartObj.legendSettings = {
                border: { color: 'red', width: 1 },
                shapePadding: 8, shapeHeight: 10, shapeWidth: 10,
                height: '100', width: '240',
                position: 'Right',
                toggleVisibility: true
            };
            chartObj.loaded = loaded;
            chartObj.highlightMode = 'None';
            chartObj.highlightPattern = 'None';
            chartObj.refresh();
        });
        it('Style font, background, padding', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let legendgroup: Element = document.getElementById(legendId + '_element');
                expect(legendgroup.getAttribute('fill')).toEqual('gray');
                legendElement = document.getElementById(legendId + '_shape_0');
                let d: string[] = legendElement.getAttribute('d').split(' ');
                expect(Number(d[7]) - Number(d[1])).toBe(10);
                expect(Number(d[8]) - Number(d[2])).toBe(10);
                legendElement = document.getElementById(legendId + '_text_0');
                expect(legendElement.getAttribute('x')).toEqual('34');
                expect(legendElement.getAttribute('font-size')).toEqual(chartObj.legendSettings.textStyle.size);
                expect(legendElement.getAttribute('fill')).toEqual(chartObj.legendSettings.textStyle.color);
                expect(parseFloat(legendElement.getAttribute('opacity'))).toEqual(chartObj.legendSettings.textStyle.opacity);
                expect(legendElement.getAttribute('font-style')).toEqual(chartObj.legendSettings.textStyle.fontStyle);
                expect(legendElement.getAttribute('font-family')).toEqual(chartObj.legendSettings.textStyle.fontFamily);
                expect(legendElement.getAttribute('font-weight')).toEqual(chartObj.legendSettings.textStyle.fontWeight);
                done();
            };
            chartObj.legendSettings = {
                shapePadding: 4, border: { color: 'red', width: 5 }, padding: 10,
                textStyle: {
                    size: '12px', color: 'Blue', opacity: 0.5, fontStyle: 'italic', fontFamily: 'Lucida Console',
                    fontWeight: 'bold'
                },
                background: 'gray', alignment: 'Near',
                position: 'Bottom',
            };
            chartObj.series[0].legendShape = 'Rectangle';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Bottom Position', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(280);
                expect(parseInt(legendElement.getAttribute('y'), 10)).toBe(290);
                done();
            };
            chartObj.legendSettings = {
                position: 'Bottom', alignment: 'Center',
                width: '240'
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Custom X and Y Position', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                let container: Element = document.getElementById(id + '_svg');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(100);
                expect(parseInt(legendElement.getAttribute('y'), 10)).toBe(100);
                done();
            };
            chartObj.legendSettings = {
                position: 'Custom',
                height: '100', width: '240',
                location: { x: 100, y: 100 }
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Right Position', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(550);
                expect(parseInt(legendElement.getAttribute('y'), 10)).toBe(150);
                done();
            };
            chartObj.legendSettings = {
                position: 'Right',
                height: '100', width: '240'
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Top Position', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(280);
                expect(parseInt(legendElement.getAttribute('y'), 10)).toBe(15);
                done();
            };
            chartObj.legendSettings = {
                position: 'Top',
                height: '100', width: '240'
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Top Position With Title', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                value = parseInt(legendElement.getAttribute('x'), 10);
                expect(value == 280).toBe(true);
                value = parseInt(legendElement.getAttribute('y'), 10);
                expect(value === 47 || value === 50).toBe(true);
                done();
            };
            chartObj.title = 'Chart Legend Spec Title';
            chartObj.legendSettings = {
                position: 'Top',
                height: '100', width: '240'
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Left Position', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(10);
                let y: number = parseInt(legendElement.getAttribute('y'), 10);
                expect(y === 166 || y === 167).toBe(true);
                done();
            };
            chartObj.legendSettings = {
                position: 'Left',
                height: '100', width: '240'
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Page Navigation Down and Up for vertical orientation', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_pagedown');
                let pagenumber: number; let downclick: number = 3;
                for (i = 1; i < downclick; i++) {
                    trigger.clickEvent(legendElement);
                    pagenumber = parseInt((document.getElementById(legendId + '_pagenumber').textContent.split('/')[0]), 10);
                }
                legendElement = document.getElementById(legendId + '_pageup');
                let upclick: number = 1;
                for (i = 1; i <= upclick; i++) {
                    trigger.clickEvent(legendElement);
                    pagenumber = parseInt((document.getElementById(legendId + '_pagenumber').textContent.split('/')[0]), 10);
                }
                expect(pagenumber).toBe(downclick - upclick);
                trigger.clickEvent(legendElement);
                done();
            };
            chartObj.series = seriesCollection;
            chartObj.legendSettings = {
                position: 'Right', alignment: 'Near', height: '180', width: '100'
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Page Navigation Down and Up for horizontal orientation', () => {
            chartObj.legendSettings = {
                position: 'Bottom', alignment: 'Near', height: '180', width: '160'
            };
            chartObj.dataBind();
            legendElement = document.getElementById(legendId + '_pagedown');
            let pagenumber: number; let downclick: number = 3;
            for (i = 1; i < downclick; i++) {
                trigger.clickEvent(legendElement);
                pagenumber = parseInt((document.getElementById(legendId + '_pagenumber').textContent.split('/')[0]), 10);
            }
            legendElement = document.getElementById(legendId + '_pageup');
            let upclick: number = 1;
            for (i = 1; i <= upclick; i++) {
                trigger.clickEvent(legendElement);
                pagenumber = parseInt((document.getElementById(legendId + '_pagenumber').textContent.split('/')[0]), 10);
            }
            // expect(pagenumber).toBe(downclick - upclick);
            trigger.clickEvent(legendElement);
        });
        it('Legend Alignment Far placing for Horizontal', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(540);
                expect(parseInt(legendElement.getAttribute('y'), 10)).toBe(290);
                done();
            };
            chartObj.series = [series[0]];
            chartObj.legendSettings = { position: 'Bottom', alignment: 'Far', height: '100', width: '250' };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Alignment Far placing for Vertical', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(10);
                expect(parseInt(legendElement.getAttribute('y'), 10)).toBe(290);
                done();
            };
            chartObj.legendSettings = { position: 'Left', alignment: 'Far' };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as ColumnSeries', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].type = 'Column';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as AreaSeries', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].type = 'Area';
            chartObj.series[0].animation.enable = true;
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as StackingColumnSeries', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].type = 'StackingColumn';
            chartObj.series[0].animation.enable = false;
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as StackingAreaSeries', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].type = 'StackingArea';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as SteplineSeries', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].type = 'StepLine';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as SplineSeries', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                expect(legendElement.getAttribute('fill')).toEqual('transparent');
                done();
            };
            chartObj.series[0].type = 'Spline';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as Scatter Series', (done: Function) => {
            loaded = (args: Object): void => {
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('ellipse');
                expect(legendElement.getAttribute('rx')).toEqual('5');
                expect(legendElement.getAttribute('ry')).toEqual('5');
                done();
            };
            chartObj.series[0].type = 'Scatter';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as Bar series', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].type = 'Bar';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as Circle', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('ellipse');
                expect(legendElement.getAttribute('rx')).toEqual('5');
                expect(legendElement.getAttribute('ry')).toEqual('5');
                done();
            };
            chartObj.series[0].legendShape = 'Circle';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as Rectangle', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].legendShape = 'Rectangle';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as Cross', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].legendShape = 'Cross';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as Diamond', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].legendShape = 'Diamond';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as HorizontalLine', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].legendShape = 'HorizontalLine';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as VerticalLine', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].legendShape = 'VerticalLine';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Shape type as Triangle', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.series[0].legendShape = 'Triangle';
            chartObj.legendSettings = { height: null, width: null };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend border width', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chartObj.legendSettings = { border: { width: 1, color: 'yellow' } };
            chartObj.loaded = loaded;
            chartObj.dataBind();
        });
        it('Legend visible false', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let element: Element = document.getElementById(legendId);
                expect(element).toBe(null);
                done();
            };
            chartObj.legendSettings = { visible: false };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend click on Visible series', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_text_' + 0);
                trigger.clickEvent(legendElement);
                expect(chartObj.series[0].visible).toBe(false);
                done();
            };
            chartObj.legendSettings = { visible: true };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend click on Hidden series', () => {
            legendElement = document.getElementById(legendId + '_text_' + 0);
            trigger.clickEvent(legendElement);
            expect(chartObj.series[0].visible).toBe(true);
        });
        it('Legend Rendering Event Checking', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_text_' + 0);
                expect(legendElement.textContent).toBe('Text Changed');
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.getAttribute('fill')).toBe('#33CCFF');
                expect(legendElement.getAttribute('d').split('L').length).toBe(4);
                done();
            };
            legendRendering = (args: ILegendRenderEventArgs): void => {
                args.text = 'Text Changed';
                args.fill = '#33CCFF';
                args.shape = 'Triangle';
            };
            chartObj.legendRender = legendRendering;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Toggle visible and adding different type opposite axis series', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_text_' + 0);
                trigger.clickEvent(legendElement);
                let seriesElement: Element = document.getElementById(id + 'SeriesGroup0');
                expect(seriesElement).not.toBe(null);
                done();
            };
            legendElement = document.getElementById(legendId + '_text_' + 0);
            trigger.clickEvent(legendElement);
            chartObj.series[0].type = 'Column';
            chartObj.legendRender = null;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Rendering Series Names are same ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_text_' + 0);
                expect(legendElement.textContent).toBe('All are Same Text');
                legendElement = document.getElementById(legendId + '_text_' + 1);
                expect(legendElement.textContent).toBe('All are Same Text');
                legendElement = document.getElementById(legendId + '_text_' + 2);
                expect(legendElement.textContent).toBe('All are Same Text');
                legendElement = document.getElementById(legendId + '_text_' + 3);
                expect(legendElement.textContent).toBe('All are Same Text');
                done();
            };
            chartObj.series = seriesCollection.slice(0, 4);
            for (let series of chartObj.series) {
                series.name = 'All are Same Text';
            }
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Toggle visible and adding different type series ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let seriesElement: Element = document.getElementById(id + 'SeriesGroup' + 4);
                expect(seriesElement).not.toBe(null);
                done();
            };
            legendElement = document.getElementById(legendId + '_text_' + 0);
            trigger.clickEvent(legendElement);
            let allseries: SeriesModel[] = chartObj.series;
            seriesCollection[4].type = 'Line';
            allseries.push(seriesCollection[4]);
            chartObj.series = allseries;
            chartObj.loaded = loaded;
            chartObj.legendRender = null;
            chartObj.refresh();
        });
        it('Selection and legend click', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let selection: string = id + '_ej2_chart_selection_series_';
                let point: Element = document.getElementById(id + '_Series_4' + '_Point_3');
                trigger.clickEvent(point);
                point = document.getElementById(id + '_Series_1' + '_Point_3');
                trigger.clickEvent(point);
                let selectedElement: HTMLCollection = document.getElementsByClassName(selection + 4);
                expect(selectedElement.length).not.toBe(0);
                selectedElement = document.getElementsByClassName(selection + 1);
                expect(selectedElement.length).not.toBe(0);
                legendElement = document.getElementById(legendId + '_text_' + 4);
                trigger.clickEvent(legendElement);
                selectedElement = document.getElementsByClassName(selection + 4);
                expect(selectedElement.length).toBe(0);
                selectedElement = document.getElementsByClassName(selection + 1);
                expect(selectedElement.length).not.toBe(0);
                legendElement = document.getElementById(legendId + '_text_' + 1);
                trigger.clickEvent(legendElement);
                selectedElement = document.getElementsByClassName(selection + 1);
                expect(selectedElement.length).toBe(0);
                legendElement = document.getElementById(legendId + '_text_' + 4);
                trigger.clickEvent(legendElement);
                selectedElement = document.getElementsByClassName(selection + 4);
                expect(selectedElement.length).toBe(3);
                legendElement = document.getElementById(legendId + '_text_' + 1);
                trigger.clickEvent(legendElement);
                selectedElement = document.getElementsByClassName(selection + 1);
                expect(selectedElement.length).toBe(3);
                done();
            };
            chartObj.legendSettings.toggleVisibility = false;
            chartObj.selectionMode = 'Point';
            chartObj.isMultiSelect = true;
            for (let series of chartObj.series) {
                series.type = 'Column';
            }
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Legend Rendering Event args cancel Checking', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_text_' + 0);
                expect(legendElement).toBe(null);
                legendElement = document.getElementById(legendId + '_text_' + 1);
                expect(legendElement).not.toBe(null);

                expect(legendElement.getAttribute('x') == '34').toBe(true);

                expect(legendElement.getAttribute('y') == '311' || legendElement.getAttribute('y') == '301.25').toBe(true);
                legendElement = document.getElementById(legendId + '_text_' + 2);
                expect(legendElement).not.toBe(null);

                expect(legendElement.getAttribute('x') == '34').toBe(true);

                expect(legendElement.getAttribute('y') == '333' || legendElement.getAttribute('y') == '326.25').toBe(true);
                legendElement = document.getElementById(legendId + '_text_' + 3);
                expect(legendElement).not.toBe(null);

                expect(legendElement.getAttribute('x') == '34').toBe(true);

                expect(legendElement.getAttribute('y') == '355' || legendElement.getAttribute('y') == '351.25').toBe(true);
                value = chartObj.legendModule.legendBounds.height;

                expect(value == 98 || value == 110).toBe(true);
                value = chartObj.legendModule.legendBounds.width;

                expect(value == 94 || value == 73).toBe(true);
                done();
            };
            legendRendering = (args: ILegendRenderEventArgs): void => {
                if (args.text === 'Series 0') {
                    args.cancel = true;
                }
            };
            i = 0;
            for (let series of chartObj.series) {
                series.name = 'Series ' + i;
                i++;
            }
            chartObj.series[0].visible = true;
            chartObj.legendRender = legendRendering;
            chartObj.loaded = loaded;
            chartObj.legendSettings.height = null;
            chartObj.legendSettings.width = null;
            chartObj.refresh();
        });
        it('Bottom Position with margin', function (done) {
            loaded = function (args) {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('y'), 10) == 306 || parseInt(legendElement.getAttribute('y'), 10) == 310);
                done();
            };
            chartObj.legendSettings = {
                position: 'Bottom', alignment: 'Center',
                width: '240', margin: { top: 20, bottom: 30, right: 20, left: 40 }
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Left Position with margin', function (done) {
            loaded = function (args) {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('x'), 10) == 50);
                done();
            };
            chartObj.legendSettings = {
                position: 'Left', alignment: 'Center',
                width: '240', margin: { top: 20, bottom: 30, right: 20, left: 40 }
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Right Position with margin', function (done) {
            loaded = function (args) {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('x'), 10) == 530);
                done();
            };
            chartObj.legendSettings = {
                position: 'Right', alignment: 'Center',
                width: '240', margin: { top: 20, bottom: 30, right: 20, left: 40 }
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Top Position with margin', function (done) {
            loaded = function (args) {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('y'), 10) == 66);
                done();
            };
            chartObj.legendSettings = {
                position: 'Top', alignment: 'Center',
                width: '240', margin: { top: 20, bottom: 30, right: 20, left: 40 }
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Top Position with margin', function (done) {
            loaded = function (args) {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('y'), 10) == 20);
                expect(parseInt(legendElement.getAttribute('x'), 10) == 200);
                done();
            };
            chartObj.legendSettings = {
                position: 'Custom', location: { x: 200, y: 20 },
                width: '240', margin: { top: 20, bottom: 30, right: 20, left: 40 }
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('Customer issue: Legend color is not working when use point color mapping', () => {
        let chartObj: Chart;
        let ele: Element;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart({
                //Initializing Primary X Axis
                primaryXAxis: {
                    majorGridLines: { width: 0 },
                    minorGridLines: { width: 0 },
                    majorTickLines: { width: 0 },
                    minorTickLines: { width: 0 },
                    interval: 1,
                    lineStyle: { width: 0 },
                    labelIntersectAction: 'Rotate45',
                    valueType: 'Category'
                },
                //Initializing Primary Y Axis
                primaryYAxis:
                {
                    title: 'Sales',
                    lineStyle: { width: 0 },
                    minimum: 0,
                    maximum: 500,
                    interval: 100,
                    majorTickLines: { width: 0 },
                    majorGridLines: { width: 1 },
                    minorGridLines: { width: 1 },
                    minorTickLines: { width: 0 },
                    labelFormat: '{value}B',
                },
                chartArea: {
                    border: {
                        width: 0
                    }
                },
                //Initializing Chart Series
                series: [
                    {
                        type: 'StackingColumn',
                        dataSource: [
                            { x: '2014', y: 111.1, color: 'fuchsia' },
                            { x: '2015', y: 127.3, color: 'fuchsia' },
                            { x: '2016', y: 143.4, color: 'fuchsia' },
                            { x: '2017', y: 159.9, color: 'fuchsia' }],
                        xName: 'x', width: 2,
                        yName: 'y', name: 'UK',
                        pointColorMapping: 'color'
                    },
                    {
                        type: 'StackingColumn',
                        dataSource: [
                            { x: '2014', y: 76.9, color: 'skyblue' },
                            { x: '2015', y: 99.5, color: 'skyblue' },
                            { x: '2016', y: 121.7, color: 'skyblue' },
                            { x: '2017', y: 142.5, color: 'skyblue' }],
                        xName: 'x', width: 2,
                        yName: 'y', name: 'Germany',
                        pointColorMapping: 'color'
                    },
                    {
                        type: 'StackingColumn',
                        dataSource: [
                            { x: '2014', y: 66.1, color: 'purple' },
                            { x: '2015', y: 79.3, color: 'purple' },
                            { x: '2016', y: 91.3, color: 'purple' },
                            { x: '2017', y: 102.4, color: 'purple' }],
                        xName: 'x', width: 2,
                        yName: 'y', name: 'France',
                        pointColorMapping: 'color'

                    },
                    {
                        type: 'StackingColumn',
                        dataSource: [
                            { x: '2014', y: 34.1 },
                            { x: '2015', y: 38.2 },
                            { x: '2016', y: 44.0 },
                            { x: '2017', y: 51.6 }],
                        xName: 'x', width: 2,
                        yName: 'y', name: 'Italy'

                    }
                ],

                //Initializing Chart title
                title: 'Mobile Game Market by Country',
                //Initializing User Interaction Tooltip
                tooltip: {
                    enable: true
                },
            });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });
        it('Legend Symbol Color Checking with point color mapping', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
            let color1: string = document.getElementById('container_chart_legend_shape_0').getAttribute('fill'); 
            expect(color1 === 'fuchsia').toBe(true);
            let color2: string = document.getElementById('container_chart_legend_shape_1').getAttribute('fill'); 
            expect(color2 === 'skyblue').toBe(true);
            let color3: string = document.getElementById('container_chart_legend_shape_2').getAttribute('fill'); 
            expect(color3 === 'purple').toBe(true);
            let color4: string = document.getElementById('container_chart_legend_shape_3').getAttribute('fill'); 
            expect(color4 === '#e56590').toBe(true);
            done();
            };
            chartObj.refresh();
        });
    });
    describe('Legend title checking', () => {
        let chartObj: Chart;
        let chartContainer: Element;
        let titleElement: Element;
        let xValue: string; let yValue: string;
        beforeAll((): void => {
            chartContainer = createElement('div', { id: 'container', styles: 'width: 800px;height:450px' });
            document.body.appendChild(chartContainer);
            chartObj = new Chart({
                enableAnimation: false,
                border: {
                    width: 3,
                    color: 'blue'
                },
                //Initializing Primary X Axis
                primaryXAxis: {
                    valueType: 'DateTime',
                    labelFormat: 'y',
                    intervalType: 'Years',
                    edgeLabelPlacement: 'Shift',
                    majorGridLines: { width: 0 }
                },

                //Initializing Primary Y Axis
                primaryYAxis:
                {
                    labelFormat: '{value}%',
                    rangePadding: 'None',
                    minimum: 0,
                    maximum: 100,
                    interval: 20,
                    lineStyle: { width: 0 },
                    majorTickLines: { width: 0 },
                    minorTickLines: { width: 0 }
                },
                chartArea: {
                    border: {
                        width: 3,
                        color: 'black'
                    }
                },
                //Initializing Chart Series
                series: [
                    {
                        type: 'Line',
                        dataSource: [
                            { x: new Date(2005, 0, 1), y: 21 }, { x: new Date(2006, 0, 1), y: 24 },
                            { x: new Date(2007, 0, 1), y: 36 }, { x: new Date(2008, 0, 1), y: 38 },
                            { x: new Date(2009, 0, 1), y: 54 }, { x: new Date(2010, 0, 1), y: 57 },
                            { x: new Date(2011, 0, 1), y: 70 }
                        ],
                        xName: 'x', width: 2, marker: {
                            visible: true,
                            width: 10,
                            height: 10
                        },
                        yName: 'y', name: 'Germany',
                    },
                    {
                        type: 'Line',
                        dataSource: [
                            { x: new Date(2005, 0, 1), y: 28 }, { x: new Date(2006, 0, 1), y: 44 },
                            { x: new Date(2007, 0, 1), y: 48 }, { x: new Date(2008, 0, 1), y: 50 },
                            { x: new Date(2009, 0, 1), y: 66 }, { x: new Date(2010, 0, 1), y: 78 }, { x: new Date(2011, 0, 1), y: 84 }
                        ],
                        xName: 'x', width: 2, marker: {
                            visible: true,
                            width: 10,
                            height: 10
                        },
                        yName: 'y', name: 'England',
                    },
                ],

                //Initializing Chart title
                title: 'Inflation - Consumer Price',
                titleStyle: {
                    textAlignment: 'Near',
                    textOverflow: 'Wrap'
                },
                //Initializing User Interaction Tooltip
                tooltip: {
                    enable: true
                },
                legendSettings: {
                    visible: true,
                    title: 'Countries',
                    titleStyle: {
                        size: '14px',
                        color: 'orange',
                        textAlignment: 'Center',
                        textOverflow: 'Trim'
                    },
                    border: {
                        width: 2,
                        color: 'red'
                    },
                }
            });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });
        it('legend bottom and title top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.refresh();
        });
        it('legend bottom and title left', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '294.5' || xValue === '300.5').toBe(true);
                expect(yValue === '425.25' || yValue === '425').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.titlePosition = 'Left';
            chartObj.refresh();
        });
        it('legend bottom and title right', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '446.5' || xValue === '445.5').toBe(true);
                expect(yValue === '425.25' || yValue === '425').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.titlePosition = 'Right';
            chartObj.refresh();
        });
        it('legend top and title top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.position = 'Top';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.refresh();
        });
        it('legend top and title left', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '294.5' || xValue === '300.5').toBe(true);
                expect(yValue === '69.75' || yValue === '65.5').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.titlePosition = 'Left';
            chartObj.refresh();
        });
        it('legend top and title right', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '446.5' || xValue === '445.5').toBe(true);
                expect(yValue === '69.75' || yValue === '65.5').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.titlePosition = 'Right';
            chartObj.refresh();
        });
        it('legend right and title top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '745.5' || xValue === '747.5').toBe(true);
                expect(yValue === '221.25' || yValue === '219.25').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.position = 'Right';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.refresh();
        });
        it('legend right and title left', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '745.5' || xValue === '747.5').toBe(true);
                expect(yValue === '221.25' || yValue === '219.25').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.titlePosition = 'Left';
            chartObj.refresh();
        });
        it('legend right and title right', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '745.5' || xValue === '747.5').toBe(true);
                expect(yValue === '221.25' || yValue === '219.25').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.titlePosition = 'Right';
            chartObj.refresh();
        });
        it('legend left and title top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '51.5' || xValue === '49.5').toBe(true);
                expect(yValue === '221.25' || yValue === '219.25').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.position = 'Left';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.refresh();
        });
        it('legend left and title left', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '51.5' || xValue === '49.5').toBe(true);
                expect(yValue === '221.25' || yValue === '219.25').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.titlePosition = 'Left';
            chartObj.refresh();
        });
        it('legend left and title right', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '51.5' || xValue === '49.5').toBe(true);
                expect(yValue === '221.25' || yValue === '219.25').toBe(true);
                let legendText: string = document.getElementById('container_chart_legend_text_0').textContent;
                expect(legendText === 'Germany').toBe(true);
                legendText = document.getElementById('container_chart_legend_text_1').textContent;
                expect(legendText === 'England').toBe(true);
                done();
            };
            chartObj.legendSettings.titlePosition = 'Right';
            chartObj.refresh();
        });
        it('legend with RTL', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let legendText: Element = document.getElementById('container_chart_legend_text_0');
                xValue = legendText.getAttribute('x');
                yValue = legendText.getAttribute('y');
                expect(xValue === '331.5' || xValue === '335.5').toBe(true);
                expect(yValue === '419.75' || yValue === '420').toBe(true);
                done();
            };
            chartObj.legendSettings.position = 'Bottom';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.legendSettings.isInversed = true;
            chartObj.refresh();
        });
    });
    describe('Legend new paging support checking', () => {
        let chartObj: Chart;
        let chartContainer: HTMLElement;
        let titleElement: Element;
        let xValue: string; let yValue: string;
        let backArrow: Element; let forwardArrow: Element;
        let path: string; let opacity: string;
        beforeAll((): void => {
            chartContainer = createElement('div', { id: 'container', styles: 'width: 300px;height:300px' });
            document.body.appendChild(chartContainer);
            chartObj = new Chart({
                border: {
                    width: 3,
                    color: 'blue'
                },
                //Initializing Primary X Axis
                primaryXAxis: {
                    valueType: 'DateTime',
                    labelFormat: 'y',
                    intervalType: 'Years',
                    edgeLabelPlacement: 'Shift',
                    majorGridLines: { width: 0 }
                },

                //Initializing Primary Y Axis
                primaryYAxis:
                {
                    labelFormat: '{value}%',
                    rangePadding: 'None',
                    minimum: 0,
                    maximum: 100,
                    interval: 20,
                    lineStyle: { width: 0 },
                    majorTickLines: { width: 0 },
                    minorTickLines: { width: 0 }
                },
                chartArea: {
                    border: {
                        width: 3,
                        color: 'black'
                    }
                },
                //Initializing Chart Series
                series: [
                    {
                        type: 'Line',
                        dataSource: [
                            { x: new Date(2005, 0, 1), y: 21 }, { x: new Date(2006, 0, 1), y: 24 },
                            { x: new Date(2007, 0, 1), y: 36 }, { x: new Date(2008, 0, 1), y: 38 },
                            { x: new Date(2009, 0, 1), y: 54 }, { x: new Date(2010, 0, 1), y: 57 },
                            { x: new Date(2011, 0, 1), y: 70 }
                        ],
                        xName: 'x', width: 2, marker: {
                            visible: true,
                            width: 10,
                            height: 10
                        },
                        yName: 'y', name: 'Germany',
                    },
                    {
                        type: 'Line',
                        dataSource: [
                            { x: new Date(2005, 0, 1), y: 28 }, { x: new Date(2006, 0, 1), y: 44 },
                            { x: new Date(2007, 0, 1), y: 48 }, { x: new Date(2008, 0, 1), y: 50 },
                            { x: new Date(2009, 0, 1), y: 66 }, { x: new Date(2010, 0, 1), y: 78 }, { x: new Date(2011, 0, 1), y: 84 }
                        ],
                        xName: 'x', width: 2, marker: {
                            visible: true,
                            width: 10,
                            height: 10
                        },
                        yName: 'y', name: 'England',
                    },
                    {
                        type: 'Line',
                        dataSource: [
                            { x: new Date(2005, 0, 1), y: 28 }, { x: new Date(2006, 0, 1), y: 44 },
                            { x: new Date(2007, 0, 1), y: 48 }, { x: new Date(2008, 0, 1), y: 50 },
                            { x: new Date(2009, 0, 1), y: 66 }, { x: new Date(2010, 0, 1), y: 78 }, { x: new Date(2011, 0, 1), y: 84 }
                        ],
                        xName: 'x', width: 2, marker: {
                            visible: true,
                            width: 10,
                            height: 10
                        },
                        yName: 'y', name: 'India',
                    },
                    {
                        type: 'Line',
                        dataSource: [
                            { x: new Date(2005, 0, 1), y: 28 }, { x: new Date(2006, 0, 1), y: 44 },
                            { x: new Date(2007, 0, 1), y: 48 }, { x: new Date(2008, 0, 1), y: 50 },
                            { x: new Date(2009, 0, 1), y: 66 }, { x: new Date(2010, 0, 1), y: 78 }, { x: new Date(2011, 0, 1), y: 84 }
                        ],
                        xName: 'x', width: 2, marker: {
                            visible: true,
                            width: 10,
                            height: 10
                        },
                        yName: 'y', name: 'Unites States',
                    },
                    {
                        type: 'Line',
                        dataSource: [
                            { x: new Date(2005, 0, 1), y: 28 }, { x: new Date(2006, 0, 1), y: 44 },
                            { x: new Date(2007, 0, 1), y: 48 }, { x: new Date(2008, 0, 1), y: 50 },
                            { x: new Date(2009, 0, 1), y: 66 }, { x: new Date(2010, 0, 1), y: 78 }, { x: new Date(2011, 0, 1), y: 84 }
                        ],
                        xName: 'x', width: 2, marker: {
                            visible: true,
                            width: 10,
                            height: 10
                        },
                        yName: 'y', name: 'United Kingdom',
                    },
                    {
                        type: 'Line',
                        dataSource: [
                            { x: new Date(2005, 0, 1), y: 28 }, { x: new Date(2006, 0, 1), y: 44 },
                            { x: new Date(2007, 0, 1), y: 48 }, { x: new Date(2008, 0, 1), y: 50 },
                            { x: new Date(2009, 0, 1), y: 66 }, { x: new Date(2010, 0, 1), y: 78 }, { x: new Date(2011, 0, 1), y: 84 }
                        ],
                        xName: 'x', width: 2, marker: {
                            visible: true,
                            width: 10,
                            height: 10
                        },
                        yName: 'y', name: 'Switzerland',
                    },

                ],

                //Initializing Chart title
                title: 'Inflation - Consumer Price',
                titleStyle: {
                    textAlignment: 'Near',
                    textOverflow: 'Wrap'
                },
                //Initializing User Interaction Tooltip
                tooltip: {
                    enable: true
                },
                legendSettings: {
                    visible: true,
                    title: '',
                    titleStyle: {
                        fontStyle: 'italic',
                        fontWeight: 'Bold'
                    },
                    border: {
                        width: 2,
                        color: 'red'
                    },
                    position: 'Bottom',
                    enablePages: false
                }
            });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });
        it('01.legend bottom: without legend title', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 38 266.5 L 30 270.5 L 38 274.5 L 38 272.5 L 34 270.5 L38 268.5 Z' ||
                    path === 'M 44 267.5 L 36 271.5 L 44 275.5 L 44 273.5 L 40 271.5 L44 269.5 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 262 266.5 L 270 270.5 L 262 274.5 L 262 272.5 L 266 270.5 L262 268.5 Z' ||
                    path === 'M 256 267.5 L 264 271.5 L 256 275.5 L 256 273.5 L 260 271.5 L256 269.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup= document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.refresh();
        });
        it('02.legend bottom: with legend title top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '150').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '249' || yValue === '250').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 38 261.5 L 30 265.5 L 38 269.5 L 38 267.5 L 34 265.5 L38 263.5 Z' ||
                    path === 'M 44 262.5 L 36 266.5 L 44 270.5 L 44 268.5 L 40 266.5 L44 264.5 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 262 261.5 L 270 265.5 L 262 269.5 L 262 267.5 L 266 265.5 L262 263.5 Z' ||
                    path === 'M 256 262.5 L 264 266.5 L 256 270.5 L 256 268.5 L 260 266.5 L256 264.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.refresh();
        });
        it('03.legend bottom: with legend title left', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '27.5' || xValue === '33.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '274.75' || yValue === '275').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 97.5 266.5 L 89.5 270.5 L 97.5 274.5 L 97.5 272.5 L 93.5 270.5 L97.5 268.5 Z' ||
                    path === 'M 98.5 267.5 L 90.5 271.5 L 98.5 275.5 L 98.5 273.5 L 94.5 271.5 L98.5 269.5 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 260.5 266.5 L 268.5 270.5 L 260.5 274.5 L 260.5 272.5 L 264.5 270.5 L260.5 268.5 Z' ||
                    path === 'M 254.5 267.5 L 262.5 271.5 L 254.5 275.5 L 254.5 273.5 L 258.5 271.5 L254.5 269.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Left';
            chartObj.refresh();
        });
        it('04.legend bottom: with legend title right', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '214.5' || xValue === '213.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '274.75' || yValue === '275').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 39.5 266.5 L 31.5 270.5 L 39.5 274.5 L 39.5 272.5 L 35.5 270.5 L39.5 268.5 Z' ||
                    path === 'M 45.5 267.5 L 37.5 271.5 L 45.5 275.5 L 45.5 273.5 L 41.5 271.5 L45.5 269.5 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 197.5 266.5 L 205.5 270.5 L 197.5 274.5 L 197.5 272.5 L 201.5 270.5 L197.5 268.5 Z' ||
                    path === 'M 196.5 267.5 L 204.5 271.5 L 196.5 275.5 L 196.5 273.5 L 200.5 271.5 L196.5 269.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Right';
            chartObj.refresh();
        });
        it('05.legend top: without legend title', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 38 61 L 30 65 L 38 69 L 38 67 L 34 65 L38 63 Z' ||
                    path === 'M 44 58 L 36 62 L 44 66 L 44 64 L 40 62 L44 60 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 262 61 L 270 65 L 262 69 L 262 67 L 266 65 L262 63 Z' ||
                    path === 'M 256 58 L 264 62 L 256 66 L 256 64 L 260 62 L256 60 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = '';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.legendSettings.position = 'Top';
            chartObj.refresh();
        });
        it('06.legend top: with legend title top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '150').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '65.5' || yValue === '61.5').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 38 78 L 30 82 L 38 86 L 38 84 L 34 82 L38 80 Z' ||
                    path === 'M 44 74 L 36 78 L 44 82 L 44 80 L 40 78 L44 76 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 262 78 L 270 82 L 262 86 L 262 84 L 266 82 L262 80 Z' ||
                    path === 'M 256 74 L 264 78 L 256 82 L 256 80 L 260 78 L256 76 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.legendSettings.position = 'Top';
            chartObj.refresh();
        });
        it('07.legend top: with legend title left', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '27.5' || xValue === '33.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '69.25' || yValue === '65.5').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 97.5 61 L 89.5 65 L 97.5 69 L 97.5 67 L 93.5 65 L97.5 63 Z' ||
                    path === 'M 98.5 58 L 90.5 62 L 98.5 66 L 98.5 64 L 94.5 62 L98.5 60 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 260.5 61 L 268.5 65 L 260.5 69 L 260.5 67 L 264.5 65 L260.5 63 Z' ||
                    path === 'M 254.5 58 L 262.5 62 L 254.5 66 L 254.5 64 L 258.5 62 L254.5 60 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Left';
            chartObj.legendSettings.position = 'Top';
            chartObj.refresh();
        });
        it('08.legend top: with legend title right', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '214.5' || xValue === '213.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '69.25' || yValue === '65.5').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 39.5 61 L 31.5 65 L 39.5 69 L 39.5 67 L 35.5 65 L39.5 63 Z' ||
                    path === 'M 45.5 58 L 37.5 62 L 45.5 66 L 45.5 64 L 41.5 62 L45.5 60 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 197.5 61 L 205.5 65 L 197.5 69 L 197.5 67 L 201.5 65 L197.5 63 Z' ||
                    path === 'M 196.5 58 L 204.5 62 L 196.5 66 L 196.5 64 L 200.5 62 L196.5 60 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Right';
            chartObj.legendSettings.position = 'Top';
            chartObj.refresh();
        });
        it('09.legend right: without legend title', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 333 64 L 337 56 L 341 64L 339 64 L 337 60L335 64 Z' ||
                    path === 'M 333 61 L 337 53 L 341 61L 339 61 L 337 57L335 61 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 333 172.5 L 337 180.5 L 341 172.5L 339 172.5 L 337 176.5L335 172.5 Z' ||
                    path === 'M 333 172.5 L 337 180.5 L 341 172.5L 339 172.5 L 337 176.5L335 172.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartContainer.style.width = '400px';
            chartContainer.style.height = '200px';
            chartObj.legendSettings.title = '';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.legendSettings.position = 'Right';
            chartObj.refresh();
        });
        it('10.legend right: with legend title left', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '337').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '65' || yValue === '61').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 333 81 L 337 73 L 341 81L 339 81 L 337 77L335 81 Z' ||
                    path === 'M 333 77 L 337 69 L 341 77L 339 77 L 337 73L335 77 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 333 172.5 L 337 180.5 L 341 172.5L 339 172.5 L 337 176.5L335 172.5 Z' ||
                    path === 'M 333 172.5 L 337 180.5 L 341 172.5L 339 172.5 L 337 176.5L335 172.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Left';
            chartObj.legendSettings.position = 'Right';
            chartObj.refresh();
        });
        it('11.legend right: with legend title right', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '337').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '65' || yValue === '61').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 333 81 L 337 73 L 341 81L 339 81 L 337 77L335 81 Z' ||
                    path === 'M 333 77 L 337 69 L 341 77L 339 77 L 337 73L335 77 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 333 172.5 L 337 180.5 L 341 172.5L 339 172.5 L 337 176.5L335 172.5 Z' ||
                    path === 'M 333 172.5 L 337 180.5 L 341 172.5L 339 172.5 L 337 176.5L335 172.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Right';
            chartObj.legendSettings.position = 'Right';
            chartObj.refresh();
        });
        it('12.legend left: without legend title', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 56 64 L 60 56 L 64 64L 62 64 L 60 60L58 64 Z' ||
                    path === 'M 56 61 L 60 53 L 64 61L 62 61 L 60 57L58 61 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 56 172.5 L 60 180.5 L 64 172.5L 62 172.5 L 60 176.5L58 172.5 Z' ||
                    path === 'M 56 172.5 L 60 180.5 L 64 172.5L 62 172.5 L 60 176.5L58 172.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = '';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.legendSettings.position = 'Left';
            chartObj.refresh();
        });
        it('13.legend left: with legend title top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '60').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '65' || yValue === '61').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 56 81 L 60 73 L 64 81L 62 81 L 60 77L58 81 Z' ||
                    path === 'M 56 77 L 60 69 L 64 77L 62 77 L 60 73L58 77 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 56 172.5 L 60 180.5 L 64 172.5L 62 172.5 L 60 176.5L58 172.5 Z' ||
                    path === 'M 56 172.5 L 60 180.5 L 64 172.5L 62 172.5 L 60 176.5L58 172.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.legendSettings.position = 'Left';
            chartObj.refresh();
        });
        it('14.legend left: with legend title left', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '60').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '65' || yValue === '61').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 56 81 L 60 73 L 64 81L 62 81 L 60 77L58 81 Z' ||
                    path === 'M 56 77 L 60 69 L 64 77L 62 77 L 60 73L58 77 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 56 172.5 L 60 180.5 L 64 172.5L 62 172.5 L 60 176.5L58 172.5 Z' ||
                    path === 'M 56 172.5 L 60 180.5 L 64 172.5L 62 172.5 L 60 176.5L58 172.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Left';
            chartObj.legendSettings.position = 'Left';
            chartObj.refresh();
        });
        it('15.legend left: with legend title right', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                titleElement = document.getElementById('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '60').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '65' || yValue === '61').toBe(true);
                backArrow = document.getElementById('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 56 81 L 60 73 L 64 81L 62 81 L 60 77L58 81 Z' ||
                    path === 'M 56 77 L 60 69 L 64 77L 62 77 L 60 73L58 77 Z').toBe(true);
                opacity = backArrow.getAttribute('opacity');
                expect(opacity === '0').toBe(true);
                forwardArrow = document.getElementById('container_chart_legend_pagedown');
                path = forwardArrow.getAttribute('d');
                expect(path === 'M 56 172.5 L 60 180.5 L 64 172.5L 62 172.5 L 60 176.5L58 172.5 Z' ||
                    path === 'M 56 172.5 L 60 180.5 L 64 172.5L 62 172.5 L 60 176.5L58 172.5 Z').toBe(true);
                opacity = forwardArrow.getAttribute('opacity');
                expect(opacity === '1').toBe(true);
                let legendGroup = document.getElementById('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 6).toBe(true);
                done();
            };
            chartObj.legendSettings.title = 'Countries';
            chartObj.legendSettings.titlePosition = 'Right';
            chartObj.legendSettings.position = 'Left';
            chartObj.refresh();
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