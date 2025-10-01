/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable security/detect-object-injection */
/**
 * Legend Spec
 */
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { Chart3DLoadedEventArgs, Chart3DLegendRenderEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { BarSeries3D } from '../../../src/chart3d/series/bar-series';
import { Highlight3D } from '../../../src/chart3d/user-interaction/high-light';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Legend3D } from '../../../src/chart3d/legend/legend';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { MouseEvents } from '../base/events.spec';
import { Chart3DSeriesModel } from '../../../src/chart3d/series/chart-series-model';
import { categoryData, categoryData1, secureRandom } from '../../chart/base/data.spec';
import { Selection3D } from '../../../src/chart3d/user-interaction/selection';
import { StackingColumnSeries3D } from '../../../src/chart3d/series/stacking-column-series';
import { DateTime3D } from '../../../src/chart3d/axis/date-time-axis';
import { Tooltip3D } from '../../../src/chart3d/user-interaction/tooltip';


Chart3D.Inject(Legend3D, StackingColumnSeries3D, ColumnSeries3D, Tooltip3D, Selection3D, Highlight3D, DateTime3D, Tooltip3D);

let i: number; let currentPoint: Points; let value: number = 0; let data: Points[] = []; const seriesCollection: Chart3DSeriesModel[] = [];
const colors: string[] = ['#663AB6', '#EB3F79', '#F8AB1D', '#B82E3D', '#049CB1', '#F2424F', '#C2C924', '#3DA046', '#074D67', '#02A8F4'];
let toggle: boolean = true;
for (let j: number = 0; j < 20; j++) {
    for (i = 0; i < 10; i++) {
        value = secureRandom() * 100;
        currentPoint = { x: i, y: value };
        data.push(currentPoint);
    }
    if (j % 5 === 0 && j !== 0) { toggle = false; } else { toggle = true; }
    seriesCollection[j] = {
        name: 'Series ' + j, fill: colors[j % 9], dataSource: data,
        xName: 'x', yName: 'y',
        animation: { enable: false },
        legendShape: 'SeriesType', visible: toggle,
        type: 'Column'
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
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Chart Control Legend Checking', () => {
        const count: number = 0;
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        let legendRendering: EmitType<Chart3DLegendRenderEventArgs>;
        const id: string = 'container1';
        const legendId: string = id + '_chart_legend';
        let legendElement: Element;
        const trigger: MouseEvents = new MouseEvents();
        let value: number;
        const ele: HTMLElement = createElement('div', { id: id });
        document.body.appendChild(ele);
        const series: Chart3DSeriesModel[] = [seriesCollection[0], seriesCollection[1], seriesCollection[2], seriesCollection[3], seriesCollection[4]];
        beforeAll((): void => {
            chartObj = new Chart3D({
                height: '400', width: '800', series: series,
                legendSettings: { border: { color: 'red' }, visible: true },
                enableSideBySidePlacement: true,
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
        it('legend highlight', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                    legendElement = document.getElementById(legendId + '_shape_' + 0);
                    expect(legendElement !== null).toEqual(true);
                    trigger.mousemovetEvent(legendElement, 0, 0);
                    legendElement = document.getElementById(legendId + '_shape_' + 0);
                    trigger.mousemovetEvent(legendElement, 0, 0);
                    legendElement = document.getElementById(id);
                    trigger.mousemovetEvent(legendElement, 0, 0);
                done();
            };
            chartObj.legendSettings.enableHighlight = true
            chartObj.loaded = loaded;
            chartObj.highlightMode = 'None';
            chartObj.highlightColor = 'Red';
            chartObj.tooltip.enable = true
            chartObj.refresh();
        });
        it('Style font, background, padding', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                const legendgroup: Element = document.getElementById(legendId + '_element');
                expect(legendgroup.getAttribute('fill')).toEqual('gray');
                legendElement = document.getElementById(legendId + '_shape_0');
                const d: string[] = legendElement.getAttribute('d').split(' ');
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
                position: 'Bottom'
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
                const container: Element = document.getElementById(id + '_svg');
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
                expect(value === 280).toBe(true);
                value = parseInt(legendElement.getAttribute('y'), 10);
                expect(value === 48 || value === 49).toBe(true);
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
                const y: number = parseInt(legendElement.getAttribute('y'), 10);
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
                let pagenumber: number; const downclick: number = 3;
                for (i = 1; i < downclick; i++) {
                    trigger.clickEvent(legendElement);
                    pagenumber = parseInt((document.getElementById(legendId + '_pagenumber').textContent.split('/')[0]), 10);
                }
                legendElement = document.getElementById(legendId + '_pageup');
                const upclick: number = 1;
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
            let pagenumber: number; const downclick: number = 3;
            for (i = 1; i < downclick; i++) {
                trigger.clickEvent(legendElement);
                pagenumber = parseInt((document.getElementById(legendId + '_pagenumber').textContent.split('/')[0]), 10);
            }
            legendElement = document.getElementById(legendId + '_pageup');
            const upclick: number = 1;
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
                const element: Element = document.getElementById(legendId);
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
            legendRendering = (args: Chart3DLegendRenderEventArgs): void => {
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
                const seriesElement: Element = document.getElementById(id + '-svg-0-region-series-0-point-3');
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
        it('Legend click on Point', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById(legendId + '_text_' + 0);
                trigger.clickEvent(legendElement);
                expect(legendElement !== null).toBe(true);
                done();
            };
            chartObj.legendSettings = { visible: true , mode:'Point' };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

    });
    describe('Legend title checking', () => {
        let chartObj: Chart3D;
        let chartContainer: Element;
        let titleElement: Element;
        let xValue: string; let yValue: string;
        beforeAll((): void => {
            chartContainer = createElement('div', { id: 'container', styles: 'width: 800px;height:450px' });
            document.body.appendChild(chartContainer);
            chartObj = new Chart3D({
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
                    majorTickLines: { width: 0 },
                    minorTickLines: { width: 0 }
                },
                //Initializing Chart Series
                series: [
                    {
                        type: 'Column',
                        dataSource: [
                            { x: new Date(2005, 0, 1), y: 21 }, { x: new Date(2006, 0, 1), y: 24 },
                            { x: new Date(2007, 0, 1), y: 36 }, { x: new Date(2008, 0, 1), y: 38 },
                            { x: new Date(2009, 0, 1), y: 54 }, { x: new Date(2010, 0, 1), y: 57 },
                            { x: new Date(2011, 0, 1), y: 70 }
                        ],
                        xName: 'x',
                        yName: 'y', name: 'Germany'
                    },
                    {
                        type: 'Column',
                        dataSource: [
                            { x: new Date(2005, 0, 1), y: 28 }, { x: new Date(2006, 0, 1), y: 44 },
                            { x: new Date(2007, 0, 1), y: 48 }, { x: new Date(2008, 0, 1), y: 50 },
                            { x: new Date(2009, 0, 1), y: 66 }, { x: new Date(2010, 0, 1), y: 78 }, { x: new Date(2011, 0, 1), y: 84 }
                        ],
                        xName: 'x',
                        yName: 'y', name: 'England'
                    }
                ],
                enableSideBySidePlacement: false,
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
                    }
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
                expect(xValue === '285.5' || xValue === '292');
                expect(yValue === '425.25' || yValue === '425.5').toBe(true);
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
                expect(xValue === '458' || xValue === '449').toBe(true);
                expect(yValue === '425' || yValue === '425.5').toBe(true);
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
                expect(xValue === '277' || xValue === '292').toBe(true);
                expect(yValue === '70' || yValue === '67.5').toBe(true);
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
                expect(xValue === '458' || xValue === '449').toBe(true);
                expect(yValue === '70' || yValue === '67.5').toBe(true);
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
                expect(xValue === '741' || xValue === '747.5').toBe(true);
                expect(yValue === '221.5' || yValue === '220.5').toBe(true);
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
                expect(xValue === '741' || xValue === '747.5').toBe(true);
                expect(yValue === '221.75' || yValue === '221.5').toBe(true);
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
                expect(xValue === '741' || xValue === '747.5').toBe(true);
                expect(yValue === '221.5' || yValue === '220.5').toBe(true);
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
                expect(xValue === '59' || xValue === '52.5').toBe(true);
                expect(yValue === '221.5' || yValue === '220.5').toBe(true);
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
                expect(xValue === '59' || xValue === '52.5').toBe(true);
                expect(yValue === '221.5' || yValue === '220.5').toBe(true);
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
                expect(xValue === '59' || xValue === '52.5').toBe(true);
                expect(yValue === '221.5' || yValue === '220.5').toBe(true);
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
                const legendText: Element = document.getElementById('container_chart_legend_text_0');
                xValue = legendText.getAttribute('x');
                yValue = legendText.getAttribute('y');
                expect(xValue === '317.5' || xValue === '329.5').toBe(true);
                expect(yValue === '419.75' || yValue === '420.25').toBe(true);
                done();
            };
            chartObj.legendSettings.position = 'Bottom';
            chartObj.legendSettings.titlePosition = 'Top';
            chartObj.legendSettings.isInversed = true;
            chartObj.refresh();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

    describe('Check the RTL behaviour for legend', () => {
        let chart: Chart3D;
        let ele: HTMLElement;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        let element: Element;
        let posX: string;
        const trigger: MouseEvents = new MouseEvents();
        let chartData: any[] = [
            { x: 'Jan', y: 15, y1: 33 }, { x: 'Feb', y: 20, y1: 31 }, { x: 'Mar', y: 35, y1: 30 },
            { x: 'Apr', y: 40, y1: 28 }, { x: 'May', y: 80, y1: 29 }, { x: 'Jun', y: 70, y1: 30 },
            { x: 'Jul', y: 65, y1: 33 }, { x: 'Aug', y: 55, y1: 32 }, { x: 'Sep', y: 50, y1: 34 },
            { x: 'Oct', y: 30, y1: 32 }, { x: 'Nov', y: 35, y1: 32 }, { x: 'Dec', y: 35, y1: 31 }
        ];
        
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart3D(
                {
                    primaryXAxis: { valueType: 'Category', rangePadding: 'Normal' },
                    axes:[
                        {
                            majorGridLines: { width: 0 },
                            rowIndex: 1, opposedPosition: true,
                            minimum: 24, maximum: 36, interval: 4,
                            name: 'yAxis', title: 'Temperature (Celsius)',
                            labelFormat: '{value}°C'
                        },
                        { valueType: 'Category', opposedPosition: true, rangePadding: 'Normal', name: 'xAxis' }
                    ],
                    series: [
                        { dataSource: categoryData, xName: 'x', yName: 'y', name: 'Series 1', animation: { enable: false } },
                        { dataSource: categoryData1, xName: 'x', yName: 'y', name: 'Series 2', animation: { enable: false } }],
                    height: '400px', width: '900px', enableSideBySidePlacement: false,
                });

        });
        afterAll((): void => {
            chart.loaded = null;
            chart.destroy();
            ele.remove();
        });
        it('Checking 3d chart the legend group default position', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('container_chart_legend_text_0');
                posX = element.getAttribute('x');
                expect(posX == '402' || posX == '389').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#container');
        });
        it('Checking the legend group default position with Right', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('container_chart_legend_text_0');
                posX = element.getAttribute('x');
                expect(posX == '844' || posX == '831').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.legendSettings.position = 'Right';
            chart.appendTo('#container');
        });
        it('Checking the legend group with RTL', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('container_chart_legend_text_0');
                posX = element.getAttribute('x');
                expect(posX).toBe('460');
                done();
            };
            chart.loaded = loaded;
            chart.legendSettings.position = 'Bottom';
            chart.enableRtl = true;
            chart.appendTo('#container');
        });
        it('Checking the legend group RTL with Right', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('container_chart_legend_text_0');
                posX = element.getAttribute('x');
                expect(posX == '813' || posX == '826').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.legendSettings.position = 'Right';
            chart.appendTo('#container');
        });
        it('Checking the legend title default text anchor', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('container_chart_legend_title');
                expect(element.getAttribute('text-anchor') == '').toBe(true);
                element = document.getElementById('container_chart_legend_text_0');
                posX = element.getAttribute('x');

                expect(posX == '448.5' || posX == '438.5').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.legendSettings.position = 'Bottom';
            chart.legendSettings.title = 'Legend Groups';
            chart.legendSettings.titlePosition = 'Left';
            chart.enableRtl = false;
            chart.appendTo('#container');
        });
        it('Checking the legend title RTL text anchor', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('container_chart_legend_title');
                expect(element.getAttribute('text-anchor') == 'end').toBe(true);
                element = document.getElementById('container_chart_legend_text_0');
                posX = element.getAttribute('x');
                expect(posX == '511.5' || posX == '505.5').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.enableRtl = true;
            chart.appendTo('#container');
        });
        it('Checking the legend reverse behaviour', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('container_chart_legend_text_0');
                posX = element.getAttribute('x');
                expect(posX == '524.5' || posX == '518.5').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.enableRtl = false;
            chart.legendSettings.reverse = true;
            chart.appendTo('#container');
        });
        it('Checking the chart 3d legend paging with rtl', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('container_chart_legend_navigation');
                posX = element.getAttribute('transform');
                expect(posX).toBe('translate(5, 0)');
                done();
            };
            chart.loaded = loaded;
            chart.enableRtl = true;
            chart.series = [
                { dataSource: categoryData, xName: 'x', yName: 'y', name: 'Series 0', animation: { enable: false } },
                { dataSource: categoryData1, xName: 'x', yName: 'y', name: 'Series 1', animation: { enable: false } },
                { dataSource: categoryData1, xName: 'x', yName: 'y', name: 'Series 2', animation: { enable: false } },
                { dataSource: categoryData1, xName: 'x', yName: 'y', name: 'Series 3', animation: { enable: false } },
                { dataSource: categoryData1, xName: 'x', yName: 'y', name: 'Series 4', animation: { enable: false } }],
                chart.legendSettings.width = '100px';
            chart.legendSettings.title = '';
            chart.appendTo('#container');
        });
        it('Checking the legend click with axis', (done: Function) => {
            loaded = (args: Object): void => {
                chart.loaded = null;
                element = document.getElementById('container_chart_legend_shape_1');
                trigger.clickEvent(element);
                done();
            };
            chart.loaded = loaded;
            chart.enableRtl = true;
            chart.series = [
                {dataSource: chartData, xName: 'x', yName: 'y', name: 'Germany', type: 'Column'}
                ,{dataSource: chartData, xName: 'x', yName: 'y1', yAxisName: 'yAxis', xAxisName: 'xAxis', name: 'Japan', type: 'Column',}],
                chart.legendSettings.width = '100px';
            chart.legendSettings.title = '';
            chart.appendTo('#container');
        });

    });
    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
