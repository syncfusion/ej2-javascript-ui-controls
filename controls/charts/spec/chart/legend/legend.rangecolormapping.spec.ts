/**
 * Legend Spec 
 */
import {
    Chart, AreaSeries, LineSeries, ColumnSeries, StackingColumnSeries, RadarSeries, PolarSeries, StackingAreaSeries,
    SplineSeries, StepAreaSeries, RangeColumnSeries, DataLabel, Category, Legend, ScatterSeries,
    ITextRenderEventArgs, Series, ErrorBar, Logarithmic, DateTime, ILegendRenderEventArgs, BarSeries, StackingBarSeries, StepLineSeries,
    ILegendClickEventArgs, getElement
} from '../../../src/chart/index';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { MouseEvents } from '../base/events.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { Highlight } from '../../../src/chart/user-interaction/high-light';
import { SeriesModel } from '../../../src/chart/series/chart-series-model';
import { Selection } from '../../../src/chart/user-interaction/selection';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { ILoadedEventArgs } from '../../../src/chart/model/chart-interface';
import { pointByIndex } from '../../../src';
Chart.Inject(LineSeries, SplineSeries, Legend, StepLineSeries, AreaSeries, StackingAreaSeries, StackingColumnSeries, ColumnSeries,
    // tslint:disable-next-line:align
    BarSeries, Selection, Highlight,
    RadarSeries, PolarSeries, DataLabel,
    StepAreaSeries, RangeColumnSeries, ErrorBar, Category, ScatterSeries,
    Logarithmic, DateTime);
let i: number; let currentPoint: Points; let value: number = 0;
let data: Points[] = []; let seriesCollection: SeriesModel[] = [];
let colors: string[] = ['#663AB6', '#EB3F79', '#F8AB1D', '#B82E3D', '#049CB1', '#F2424F', '#C2C924', '#3DA046', '#074D67', '#02A8F4'];
let toggle: boolean = true;
for (let j: number = 0; j < 1; j++) {
    seriesCollection[j] = {
        name: 'Series ' + j, fill: colors[j], dataSource: [

            { x: 'Point1', y: 73, size: 55 },
            { x: 'Point2', y: 50, size: 200 },
            { x: 'Point3', y: 75, size: 35 },
            { x: 'Point4', y: 80, size: 25 },
            { x: 'Point5', y: 56, size: 45 },
            { x: 'Point6', y: 60, size: 10 },
            { x: 'Point7', y: 41, size: 240 },
            { x: 'Point8', y: 45, size: 45 }
        ],
        xName: 'x', yName: 'y',
        marker: { visible: true, shape: 'Circle' },
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
describe('Chart Range Color Mapping Legend', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Range Color Mapping With Varies Legend Mode', () => {
        let count: number = 0;
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let legendRendering: EmitType<ILegendRenderEventArgs>;
        let id: string = 'container1';
        let legendId: string = id + '_chart_legend';
        let legendElement: Element;
        let seriesElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let value: number;
        let ele: HTMLElement = createElement('div', { id: id });
        document.body.appendChild(ele);
        let series: SeriesModel[] = [seriesCollection[0]];
        beforeAll((): void => {
            chartObj = new Chart({
                height: '400', width: '800',
                primaryXAxis: { valueType: 'Category' },
                series: series,
                legendSettings: {
                    border: { color: 'red' }, visible: true
                }
            });
            chartObj.appendTo(ele);
        });
        afterAll((): void => {
            chartObj.destroy();
            document.getElementById(id).remove();
        });
        it('Series Legend mode', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let legendContainer: HTMLElement = document.getElementById(legendId + '_translate_g');
                expect(chartObj.series.length).toEqual(legendContainer.childElementCount);
                done();
            };
            chartObj.legendSettings.mode = 'Series';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Point Legend mode', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let legendContainer: HTMLElement = document.getElementById(legendId + '_translate_g');
                expect(chartObj.visibleSeries[0].points.length).toEqual(legendContainer.childElementCount);
                done();
            };
            chartObj.legendSettings.mode = 'Point';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Point Legend Mode- Legend Item Hide', (done: Function) => {
            let currentPointLegend: number = chartObj.visibleSeries[0].points.length;
            legendElement = getElement(legendId + '_text_0');
            trigger.clickEvent(legendElement);
            setTimeout(() => {
                let legendContainer: HTMLElement = document.getElementById(legendId + '_translate_g');
                expect(chartObj.visibleSeries[0].points[0].visible).toEqual(false);
                done();
            }, 300);
        });
        it('Point Legend Mode- Legend Item Show', (done: Function) => {
            let currentPointLegend: number = chartObj.visibleSeries[0].points.length;
            legendElement = getElement(legendId + '_text_0');
            trigger.clickEvent(legendElement);
            setTimeout(() => {
                let legendContainer: HTMLElement = document.getElementById(legendId + '_translate_g');
                expect(chartObj.visibleSeries[0].points[0].visible).toEqual(true);
                done();
            }, 300);
        });
        it('Range Legend mode with full range', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let legendContainer: HTMLElement = document.getElementById(legendId + '_translate_g');
                console.log(legendId + '_translate_g');
                expect(chartObj.rangeColorSettings.length).toEqual(legendContainer.childElementCount);
                done();
            };
            chartObj.rangeColorSettings = [
                {
                    start: 41,
                    end: 60.5,
                    label: '0 to 50',
                    colors: ['red']
                },
                {
                    start: 60.5,
                    end: 80,
                    label: '51 to 80',
                    colors: ['green']
                },
            ];
            chartObj.legendSettings.mode = 'Range';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Range Legend mode - legend Click', (done: Function) => {
            let currentPointLegend: number = chartObj.visibleSeries[0].points.length;
            legendElement = getElement(legendId + '_text_0');
            trigger.clickEvent(legendElement);
            setTimeout(() => {
                let legendContainer: HTMLElement = document.getElementById(legendId + '_translate_g');
                expect(chartObj.visibleSeries[0].points[0].visible).toEqual(false);
                expect(chartObj.visibleSeries[0].points[2].visible).toEqual(false);
                expect(chartObj.visibleSeries[0].points[3].visible).toEqual(false);
                done();
            }, 300);
        });
        it('Range Legend mode - legend Click', (done: Function) => {
            let currentPointLegend: number = chartObj.visibleSeries[0].points.length;
            legendElement = getElement(legendId + '_text_0');
            trigger.clickEvent(legendElement);
            setTimeout(() => {
                let legendContainer: HTMLElement = document.getElementById(legendId + '_translate_g');
                expect(chartObj.visibleSeries[0].points[0].visible).toEqual(true);
                expect(chartObj.visibleSeries[0].points[2].visible).toEqual(true);
                expect(chartObj.visibleSeries[0].points[3].visible).toEqual(true);
                done();
            }, 300);
        });
        it('Range Legend mode with missing range', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let legendContainer: HTMLElement = document.getElementById(legendId + '_translate_g');
                expect(2).toEqual(legendContainer.childElementCount);
                done();
            };
            chartObj.rangeColorSettings = [
                {
                    start: 0,
                    end: 50,
                    label: '0 to 50',
                    colors: ['red']
                }
            ];
            chartObj.legendSettings.mode = 'Range';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Gradient Legend mode with full range', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let legendContainer: HTMLElement = document.getElementById(legendId + '_translate_g');
                expect(4).toEqual(legendContainer.childElementCount);
                done();
            };
            chartObj.rangeColorSettings = [
                {
                    start: 41,
                    end: 60.5,
                    label: '0 to 60.5',
                    colors: ['red', 'yellow']
                },
                {
                    start: 60.5,
                    end: 80,
                    label: '60.5 to 80',
                    colors: ['yellow', 'green']
                },
            ];
            chartObj.legendSettings.mode = 'Gradient';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Range Legend mode with missing range', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let legendContainer: HTMLElement = document.getElementById(legendId + '_translate_g');
                expect(4).toEqual(legendContainer.childElementCount);
                done();
            };
            chartObj.rangeColorSettings = [
                {
                    start: 0,
                    end: 50,
                    label: '0 to 50',
                    colors: ['red', 'green']
                }
            ];
            chartObj.legendSettings.mode = 'Gradient';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Range Legend mode with point fill color', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                for (let point of chartObj.visibleSeries[0].points) {
                    if (point.y <= 60.5 && point.y >= 41) {
                        expect(point.interior).toEqual('red');
                    } else if (point.y <= 80 && point.y >= 60.5) {
                        expect(point.interior).toEqual('green');
                    }
                }
                done();
            };
            chartObj.rangeColorSettings = [
                {
                    start: 41,
                    end: 60.5,
                    label: '0 to 50',
                    colors: ['red']
                },
                {
                    start: 60.5,
                    end: 80,
                    label: '51 to 80',
                    colors: ['green']
                },
            ];
            chartObj.legendSettings.mode = 'Range';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Range Legend mode with point fill & series fill ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                for (let point of chartObj.visibleSeries[0].points) {
                    if (point.y <= 60.5 && point.y >= 41) {
                        expect(point.interior).toEqual('red');
                    } else {
                        expect(point.interior).toBeUndefined();
                    }
                }
                done();
            };
            chartObj.rangeColorSettings = [
                {
                    start: 41,
                    end: 60.5,
                    label: '0 to 50',
                    colors: ['red']
                }
            ];
            chartObj.legendSettings.mode = 'Range';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Gradient Legend mode with point fill color', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                for (let point of chartObj.visibleSeries[0].points) {
                    if (point.y === 41) {
                        expect(point.interior).toEqual('#fd2e57');
                    } else if (point.y === 60.5) {
                        expect(point.interior).toEqual('#e5ed00');
                    } else if (point.y === 80) {
                        expect(point.interior).toEqual('#4cd766');
                    } else if (point.y === 50) {
                        expect(point.interior).toEqual('#f2862f');
                    } else if (point.y === 75) {
                        expect(point.interior).toEqual('#73dd4c');
                    }
                }
                done();
            };
            chartObj.rangeColorSettings = [
                {
                    start: 41,
                    end: 60.5,
                    label: '0 to 60.5',
                    colors: ['#fd2e57', '#e5ed00']
                },
                {
                    start: 60.5,
                    end: 80,
                    label: '60.5 to 80',
                    colors: ['#e5ed00', '#4cd766']
                },
            ];
            chartObj.legendSettings.mode = 'Gradient';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Gradient with multiple colors', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                for (let point of chartObj.visibleSeries[0].points) {
                    if (point.y === 41) {
                        expect(point.interior).toEqual('#fd2e57');
                    } else if (point.y === 60.5) {
                        expect(point.interior).toEqual('#e5ed00');
                    } else if (point.y === 80) {
                        expect(point.interior).toEqual('#4cd766');
                    }
                }
                done();
            };
            chartObj.rangeColorSettings = [
                {
                    start: 41,
                    end: 80,
                    label: '0 to 60.5',
                    colors: ['#fd2e57', '#e5ed00', '#4cd766']
                }
            ];
            chartObj.legendSettings.mode = 'Gradient';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
});