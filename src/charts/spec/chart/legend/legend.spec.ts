/**
 * Legend Spec 
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Series } from '../../../src/chart/series/chart-series';
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
import { ILegendRenderEventArgs } from '../../../src/common/model/interface';
import { unbindResizeEvents } from '../base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, SplineSeries, Legend, StepLineSeries, AreaSeries, StackingAreaSeries, StackingColumnSeries, ColumnSeries,
    ScatterSeries, BarSeries, Selection);
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
            position: 'Right'
        };
        chartObj.loaded = loaded;
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
            expect(selectedElement.length).not.toBe(0);
            legendElement = document.getElementById(legendId + '_text_' + 1);
            trigger.clickEvent(legendElement);
            selectedElement = document.getElementsByClassName(selection + 1);
            expect(selectedElement.length).not.toBe(0);
            done();
        };
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
});