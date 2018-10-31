
/**
 * Specifies the  Error Bar spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import {
    ChartSeriesType, ChartRangePadding, ValueType,
    ChartShape, LabelPlacement
} from '../../../src/chart/utils/enum';
import { unbindResizeEvents } from '../base/data.spec';
import { DataLabel } from '../../../src/chart/series/data-label';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { ErrorBar } from '../../../src/chart/series/error-bar';
import { LineSeries } from '../../../src/chart/series/line-series';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { StackingColumnSeries } from '../../../src/chart/series/stacking-column-series';
import { PolarSeries } from '../../../src/chart/series/polar-series';
import { RadarSeries } from '../../../src/chart/series/radar-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { ErrorBarSettings, ErrorBarCapSettings } from '../../../src/chart/series/chart-series';
import { MouseEvents } from '../base/events.spec';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { ErrorBarMode, ErrorBarDirection, ErrorBarType } from '../../../src/chart/utils/enum';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Zoom } from '../../../src/chart/user-interaction/zooming';
import { Axis } from '../../../src/chart/axis/axis';
import { tooltipData1, tooltipData2, tool1, datetimeData, categoryData, negativeDataPoint, categoryData1,tooltipData21,tooltipData22 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';

Chart.Inject(LineSeries, Zoom, ColumnSeries,PolarSeries,StackingColumnSeries, BarSeries, Category, DateTime, ErrorBar, Tooltip, Crosshair, DataLabel);
let data: any = tooltipData1;
let data2: any = tooltipData2;
let data3: any = tool1;
let datetime: any = datetimeData;
let chartData: any = tooltipData21;
let chartData1: any = tooltipData21
let trigger: MouseEvents = new MouseEvents();
export interface Arg {
    chart: Chart;
}

describe('Chart Control', () => {
    describe('Error Bar for series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let marker: HTMLElement;
        let datalabel: HTMLElement;
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', interval: 2000 },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                        name: 'ChartSeriesNameGold', fill: 'green', errorBar: { visible: false, errorBarCap: {length : 0} },
                        marker: { visible: false, dataLabel: { visible: false, position: 'Top' } },
                    },
                    ], width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false },
                    zoomSettings : {enableSelectionZooming : true}
                });
            chartObj.appendTo('#container');
            unbindResizeEvents(chartObj);
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });

        it('Checking with errorBar visibilty false', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(svg === null).toBe(true);               
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = false;
            chartObj.refresh();
        });

        it('Checking with errorBar visibilty', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.refresh();
        });
        it('Checking with errorBarCap visibilty', (done: Function) => {
            loaded = (args: Object): void => {
                let cap: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(cap != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.errorBarCap.length = 10;
            chartObj.refresh();
        });

        it('Checking with errorBar Fixed type', (done: Function) => {
            loaded = (args: Object): void => {
                let fixElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let heightElement = fixElem.getAttribute('d').split(' ');
                let value1 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                let value2 = (parseInt(heightElement[11]) - parseInt(heightElement[8]));
                let errorHeight = value1 + value2;
                let fixElem1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_2');
                let heightElement1 = fixElem1.getAttribute('d').split(' ');
                let value21 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                let value22 = (parseInt(heightElement[11]) - parseInt(heightElement[8]));
                let errorHeight1 = value21 + value22;
                expect(fixElem.getAttribute('errorHeight') == fixElem1.getAttribute('errorHeight')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Fixed';
            chartObj.series[0].errorBar.errorBarCap.length = 10;
            chartObj.refresh();
        });

        it('Checking with errorBar percentage type', (done: Function) => {
            loaded = (args: Object): void => {
                let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                let heightEle = percent.getAttribute('d').split(' ');
                let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                let errorHeight = value1 + value2;
                let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let heightEle1 = percent1.getAttribute('d').split(' ');
                let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                let errorHeight1 = value1 + value2;
                expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Percentage';
            chartObj.series[0].errorBar.errorBarCap.length = 10;
            chartObj.refresh();
        });

        it('Checking with errorBar standard deviation type', (done: Function) => {
            loaded = (args: Object): void => {
                let sdElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let sdHeight = sdElem.getAttribute('d').split(' ');
                expect(sdElem != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'StandardDeviation';
            chartObj.refresh();
            unbindResizeEvents(chartObj);
        });

        it('Checking with errorBar standard error type', (done: Function) => {
            loaded = (args: Object): void => {
                let sdErrorElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(sdErrorElem != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'StandardError';
            chartObj.refresh();
        });

        it('Checking with errorBar custom type', (done: Function) => {
            loaded = (args: Object): void => {
                let customElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(customElem != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Custom';
            chartObj.refresh();
        });

        it('Checking with errorBar custom type in verticalChart', (done: Function) => {
            loaded = (args: Object): void => {
                let customElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(customElem != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = true;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Custom';
            chartObj.refresh();
        });
         
        it('Checking with errorBar vertical mode', (done: Function) => {
            loaded = (args: Object): void => {
                let fixElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let heightElement = fixElem.getAttribute('d').split(' ');
                let value1 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                let fixElem1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_2');
                let heightElement1 = fixElem1.getAttribute('d').split(' ');
                let value21 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                expect(fixElem.getAttribute('value1') == fixElem1.getAttribute('value21')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = false;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Fixed';
            chartObj.series[0].errorBar.mode = 'Vertical';
            chartObj.refresh();
        });

        it('Checking with errorBar horizontal mode', (done: Function) => {
            loaded = (args: Object): void => {
                let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                let heightEle = percent.getAttribute('d').split(' ');
                let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                let errorHeight = value1 + value2;
                let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let heightEle1 = percent1.getAttribute('d').split(' ');
                let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                let errorHeight1 = value1 + value2;
                expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Percentage';
            chartObj.series[0].errorBar.mode = 'Horizontal';
            chartObj.refresh();
        });

        it('Checking with errorBar horizontal mode direction plus', (done: Function) => {
            loaded = (args: Object): void => {
                let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                let heightEle = percent.getAttribute('d').split(' ');
                let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                let errorHeight = value1 + value2;
                let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let heightEle1 = percent1.getAttribute('d').split(' ');
                let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                let errorHeight1 = value1 + value2;
                expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Percentage';
            chartObj.series[0].errorBar.mode = 'Horizontal';
            chartObj.series[0].errorBar.direction = 'Plus'
            chartObj.refresh();
        });

        it('Checking with errorBar horizontal mode direction minus', (done: Function) => {
            loaded = (args: Object): void => {
                let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                let heightEle = percent.getAttribute('d').split(' ');
                let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                let errorHeight = value1 + value2;
                let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let heightEle1 = percent1.getAttribute('d').split(' ');
                let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                let errorHeight1 = value1 + value2;
                expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Percentage';
            chartObj.series[0].errorBar.mode = 'Horizontal';
            chartObj.series[0].errorBar.direction = 'Minus';
            chartObj.refresh();
        });

        it('Checking with errorBar both mode', (done: Function) => {
            loaded = (args: Object): void => {
                let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                let heightEle = percent.getAttribute('d').split(' ');
                let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                let errorHeight = value1 + value2;
                let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let heightEle1 = percent1.getAttribute('d').split(' ');
                let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                let errorHeight1 = value1 + value2;
                expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Percentage';
            chartObj.series[0].errorBar.mode = 'Both';
            chartObj.refresh();
        });

        it('Checking with errorBar Plus direction', (done: Function) => {
            loaded = (args: Object): void => {
                let fixElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let heightElement = fixElem.getAttribute('d').split(' ');
                let value1 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                let fixElem1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_2');
                let heightElement1 = fixElem1.getAttribute('d').split(' ');
                let value21 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                expect(fixElem.getAttribute('value1') == fixElem1.getAttribute('value21')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Fixed';
            chartObj.series[0].errorBar.direction = 'Plus';
            chartObj.refresh();
        });


        it('Checking with errorBar Minus direction', (done: Function) => {
            loaded = (args: Object): void => {
                let fixElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let heightElement = fixElem.getAttribute('d').split(' ');
                let value1 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                let fixElem1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_2');
                let heightElement1 = fixElem1.getAttribute('d').split(' ');
                let value21 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                expect(fixElem.getAttribute('value1') == fixElem1.getAttribute('value21')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Fixed';
            chartObj.series[0].errorBar.direction = 'Minus';
            chartObj.refresh();
        });

        it('Checking with errorBar both direction', (done: Function) => {
            loaded = (args: Object): void => {
                let fixElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                let heightElement = fixElem.getAttribute('d').split(' ');
                let value1 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                let value2 = (parseInt(heightElement[11]) - parseInt(heightElement[8]));
                let errorHeight = value1 + value2;
                let fixElem1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_2');
                let heightElement1 = fixElem1.getAttribute('d').split(' ');
                let value21 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                let value22 = (parseInt(heightElement[11]) - parseInt(heightElement[8]));
                let errorHeight1 = value21 + value22;
                expect(fixElem.getAttribute('errorHeight') == fixElem1.getAttribute('errorHeight1')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.type = 'Fixed';
            chartObj.series[0].errorBar.direction = 'Both';
            chartObj.refresh();
        });

        it('Checking with marker visible', (done: Function) => {
            loaded = (args: Object): void => {
                datalabel = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(datalabel != null).toBe(true);
                let fixElement: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(fixElement != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].errorBar.visible = true;
            chartObj.refresh();
            
        });
        it('With Label position Auto', (done: Function) => {
            loaded = (args: Object): void => {
                let dataLabelY = +document.getElementById('container_Series_0_Point_1_Text_0').getAttribute('y');
                let pointY = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh();
        });

        it('With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                let dataLabelY = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                let pointY = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_5_Text_0').getAttribute('y');
                pointY = (<Points>(<Series>chartObj.series[0]).points[5]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.series[0].errorBar.mode = 'Vertical';
            chartObj.refresh();
        });

        it('With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                let dataLabelY = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                let pointY = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_5_Text_0').getAttribute('y');
                pointY = (<Points>(<Series>chartObj.series[0]).points[5]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].errorBar.mode = 'Horizontal';
            chartObj.refresh();
        });
        
        it('With Label position Bottom plus direction', (done: Function) => {
            loaded = (args: Object): void => {
                let dataLabelY = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                let pointY = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_5_Text_0').getAttribute('y');
                pointY = (<Points>(<Series>chartObj.series[0]).points[5]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].errorBar.mode = 'Vertical';
            chartObj.series[0].errorBar.direction = 'Plus';
            chartObj.refresh();
        });
         it('With Label position Bottom in both mode', (done: Function) => {
            loaded = (args: Object): void => {
                let dataLabelY = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                let pointY = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_5_Text_0').getAttribute('y');
                pointY = (<Points>(<Series>chartObj.series[0]).points[5]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].errorBar.mode = 'Both';
            chartObj.refresh();
        });

        it('Checking with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker != null).toBe(true);
                let fixElement: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(fixElement != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = categoryData;
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.errorBarCap.length = 10;
            chartObj.refresh();
        });


        it('checking with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1_Symbol');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let fixElement: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(fixElement != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = true;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.errorBarCap.length = 10;
            chartObj.refresh();
        });

        it('checking with trackball', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1_Symbol');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let fixElement: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(fixElement != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.shared = true;
            chartObj.series[0].errorBar.visible = true;
            chartObj.series[0].errorBar.errorBarCap.length = 10;
            chartObj.refresh();
        });

         it('Checking with errorBar visibilty in polarseries', (done: Function) => {
            loaded = (args: Object): void => {
                let errorElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                expect(errorElem == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar'
            chartObj.series[0].errorBar.visible = true;
            chartObj.refresh();
        });
       
    });
        describe('Chart Bar series', () => {
            let chartObj: Chart;
            let elem: HTMLElement;
            let point: HTMLElement;
            let svg: HTMLElement;
            let targetElement: HTMLElement;
            let loaded: EmitType<ILoadedEventArgs>;
            let done: Function;
            let dataLabel: HTMLElement;
            let trigger: MouseEvents = new MouseEvents();
            let x: number;
            let y: number;
            let animationComplete: EmitType<IAnimationCompleteEventArgs>;

            beforeAll(() => {
                elem = createElement('div', { id: 'container' });
                document.body.appendChild(elem);
                chartObj = new Chart(
                    {
                        primaryXAxis: { title: 'PrimaryXAxis', },
                        primaryYAxis: { title: 'PrimaryYAxis', },
                        series: [{
                            dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                            name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                        },
                        ], width: '800',
                        tooltip: { enable: true, fill: 'rgba(247,247,247,0.85)', textStyle: { size: '12px' }, format: '${series.name} : ${point.x} <br/> : ${point.y}' },
                        legendSettings: { visible: false },
                        title: 'Chart TS Title'
                    });
                chartObj.appendTo('#container');
                unbindResizeEvents(chartObj);
            });

            afterAll((): void => {
                 chartObj.destroy();
                elem.remove();
            });
            it('Checking with errorBar visibilty false', (done: Function) => {
                loaded = (args: Object): void => {
                    let svg: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(svg === null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = false;
                chartObj.refresh();
            });
            it('Checking with errorBar visibilty', (done: Function) => {
                loaded = (args: Object): void => {
                    let svg: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(svg != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.refresh();
            });
            it('Checking with errorBarCap visibilty', (done: Function) => {
                loaded = (args: Object): void => {
                    let cap: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(cap != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.errorBarCap.length = 10;
                chartObj.refresh();
            });

            it('Checking with errorBar Fixed type', (done: Function) => {
                loaded = (args: Object): void => {
                    let fixElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightElement = fixElem.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                    let value2 = (parseInt(heightElement[11]) - parseInt(heightElement[8]));
                    let errorHeight = value1 + value2;
                    let fixElem1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_2');
                    let heightElement1 = fixElem1.getAttribute('d').split(' ');
                    let value21 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                    let value22 = (parseInt(heightElement[11]) - parseInt(heightElement[8]));
                    let errorHeight1 = value21 + value22;
                    expect(fixElem.getAttribute('errorHeight') == fixElem1.getAttribute('errorHeight')).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Fixed';
                chartObj.refresh();
            });

            it('Checking with errorBar percentage type', (done: Function) => {
                loaded = (args: Object): void => {
                    let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    let heightEle = percent.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                    let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                    let errorHeight = value1 + value2;
                    let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightEle1 = percent1.getAttribute('d').split(' ');
                    let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                    let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                    let errorHeight1 = value1 + value2;
                    expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Percentage';
                chartObj.refresh();
            });

            it('Checking with errorBar standard deviation type', (done: Function) => {
                loaded = (args: Object): void => {
                    let sdElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let sdHeight = sdElem.getAttribute('d').split(' ');
                    expect(sdElem != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'StandardDeviation';
                chartObj.refresh();
            });

            it('Checking with errorBar standard error type', (done: Function) => {
                loaded = (args: Object): void => {
                    let sdErrorElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(sdErrorElem != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'StandardError';
                chartObj.refresh();
            });

            it('Checking with errorBar standard error type in horizontal mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let sdErrorElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(sdErrorElem != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'StandardError';
                chartObj.series[0].errorBar.mode = 'Horizontal';
                chartObj.refresh();
            });

            it('Checking with errorBar custom type', (done: Function) => {
                loaded = (args: Object): void => {
                    let customElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(customElem != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Custom';
                chartObj.refresh();
                
            });

           it('Checking with errorBar vertical mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    let heightEle = percent.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                    let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                    let errorHeight = value1 + value2;
                    let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightEle1 = percent1.getAttribute('d').split(' ');
                    let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                    let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                    let errorHeight1 = value1 + value2;
                    expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Percentage';
                chartObj.series[0].errorBar.mode = 'Vertical';
                chartObj.refresh();
            });

            it('Checking with errorBar horizontal mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    let heightEle = percent.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                    let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                    let errorHeight = value1 + value2;
                    let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightEle1 = percent1.getAttribute('d').split(' ');
                    let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                    let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                    let errorHeight1 = value1 + value2;
                    expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Percentage';
                chartObj.series[0].errorBar.mode = 'Horizontal';
                chartObj.refresh();
            });
             
            it('Checking with errorBar horizontal mode plus direction', (done: Function) => {
                loaded = (args: Object): void => {
                    let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    let heightEle = percent.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                    let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                    let errorHeight = value1 + value2;
                    let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightEle1 = percent1.getAttribute('d').split(' ');
                    let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                    let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                    let errorHeight1 = value1 + value2;
                    expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Percentage';
                chartObj.series[0].errorBar.mode = 'Horizontal';
                chartObj.series[0].errorBar.direction = 'Plus';
                chartObj.refresh();
               
            });

            it('Checking with errorBar horizontal mode minus direction', (done: Function) => {
                loaded = (args: Object): void => {
                    let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    let heightEle = percent.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                    let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                    let errorHeight = value1 + value2;
                    let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightEle1 = percent1.getAttribute('d').split(' ');
                    let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                    let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                    let errorHeight1 = value1 + value2;
                    expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Percentage';
                chartObj.series[0].errorBar.mode = 'Horizontal';
                chartObj.series[0].errorBar.direction = 'Minus';
                chartObj.refresh();
                
            });
            
            it(' Standard deviation type errorBar horizontal mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    let heightEle = percent.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                    let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                    let errorHeight = value1 + value2;
                    let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightEle1 = percent1.getAttribute('d').split(' ');
                    let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                    let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                    let errorHeight1 = value1 + value2;
                    expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'StandardDeviation';
                chartObj.series[0].errorBar.mode = 'Horizontal';
                chartObj.refresh();
                
            });

            it('Checking with errorBar custom type', (done: Function) => {
                loaded = (args: Object): void => {
                    let customElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(customElem != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Custom';
                chartObj.series[0].errorBar.mode ='Both';
                chartObj.refresh();
                unbindResizeEvents(chartObj);
            });

            it('Checking with errorBar both mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let percent: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    let heightEle = percent.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightEle[2]) - parseInt(heightEle[5]));
                    let value2 = (parseInt(heightEle[11]) - parseInt(heightEle[8]));
                    let errorHeight = value1 + value2;
                    let percent1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightEle1 = percent1.getAttribute('d').split(' ');
                    let value11 = (parseInt(heightEle1[2]) - parseInt(heightEle1[5]));
                    let value22 = (parseInt(heightEle1[11]) - parseInt(heightEle1[8]));
                    let errorHeight1 = value1 + value2;
                    expect(percent.getAttribute('errorHeight') == percent1.getAttribute('errorHeight1'));
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Percentage';
                chartObj.series[0].errorBar.mode = 'Both';
                chartObj.refresh();
                
            });

            it('Checking with errorBar Plus direction', (done: Function) => {
                loaded = (args: Object): void => {
                    let fixElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightElement = fixElem.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                    let fixElem1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_2');
                    let heightElement1 = fixElem1.getAttribute('d').split(' ');
                    let value21 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                    expect(fixElem.getAttribute('value1') == fixElem1.getAttribute('value21')).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Fixed';
                chartObj.series[0].errorBar.direction = 'Plus';
                chartObj.refresh();
               
            });


            it('Checking with errorBar Minus direction', (done: Function) => {
                loaded = (args: Object): void => {
                    let fixElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightElement = fixElem.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                    let fixElem1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_2');
                    let heightElement1 = fixElem1.getAttribute('d').split(' ');
                    let value21 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                    expect(fixElem.getAttribute('value1') == fixElem1.getAttribute('value21')).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Fixed';
                chartObj.series[0].errorBar.direction = 'Minus';
                chartObj.refresh();
                
            });

            it('Checking with errorBar both direction', (done: Function) => {
                loaded = (args: Object): void => {
                    let fixElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_1');
                    let heightElement = fixElem.getAttribute('d').split(' ');
                    let value1 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                    let value2 = (parseInt(heightElement[11]) - parseInt(heightElement[8]));
                    let errorHeight = value1 + value2;
                    let fixElem1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_2');
                    let heightElement1 = fixElem1.getAttribute('d').split(' ');
                    let value21 = (parseInt(heightElement[2]) - parseInt(heightElement[5]));
                    let value22 = (parseInt(heightElement[11]) - parseInt(heightElement[8]));
                    let errorHeight1 = value21 + value22;
                    expect(fixElem.getAttribute('errorHeight') == fixElem1.getAttribute('errorHeight1')).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Fixed';
                chartObj.series[0].errorBar.direction = 'Both';
                chartObj.refresh();
               
            });

            it('With Label position Auto', (done: Function) => {
                loaded = (args: Object): void => {
                    let dataLabelY = +document.getElementById('container_Series_0_Point_1_Text_0').getAttribute('y');
                    let pointY = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                    expect(dataLabelY > pointY).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].marker.dataLabel.visible = true;
                chartObj.refresh();
               
            });

            it('With Label position Bottom horizontal mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let dataLabelY = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                    let pointY = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                    expect(dataLabelY > pointY).toBe(true);
                    dataLabelY = +document.getElementById('container_Series_0_Point_5_Text_0').getAttribute('y');
                    pointY = (<Points>(<Series>chartObj.series[0]).points[5]).symbolLocations[0].y;
                    expect(dataLabelY > pointY).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].marker.dataLabel.position = 'Bottom';
                chartObj.series[0].errorBar.mode = 'Horizontal';
                chartObj.refresh();
            });

            it('With Label position Bottom horizontal mode minus direction', (done: Function) => {
                loaded = (args: Object): void => {
                    let dataLabelY = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                    let pointY = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                    expect(dataLabelY > pointY).toBe(true);
                    dataLabelY = +document.getElementById('container_Series_0_Point_5_Text_0').getAttribute('y');
                    pointY = (<Points>(<Series>chartObj.series[0]).points[5]).symbolLocations[0].y;
                    expect(dataLabelY > pointY).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].marker.dataLabel.position = 'Bottom';
                chartObj.series[0].errorBar.mode = 'Horizontal';
                chartObj.series[0].errorBar.direction = 'Minus';
                chartObj.refresh();
            });

            it('With Label position Bottom vertical mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let dataLabelY = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                    let pointY = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                    expect(dataLabelY > pointY).toBe(true);
                    dataLabelY = +document.getElementById('container_Series_0_Point_5_Text_0').getAttribute('y');
                    pointY = (<Points>(<Series>chartObj.series[0]).points[5]).symbolLocations[0].y;
                    expect(dataLabelY > pointY).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].marker.dataLabel.position = 'Bottom';
                chartObj.series[0].errorBar.mode = 'Vertical';
                chartObj.series[0].errorBar.direction ='Plus';
                chartObj.refresh();
            });

            it('checking with animation', (done: Function) => {
                loaded = (args: Object): void => {
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].animation.enable = true;
                chartObj.refresh();
            });
        });
    describe('Chart StackingColumn series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let dataLabel: HTMLElement;
        let marker: HTMLElement;


        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        dataSource: chartData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',

                    },
                    {
                        dataSource: chartData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',

                    },
                    ], width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
         it('Checking with errorBar  vertical mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let svg: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(svg != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                 chartObj.series[1].errorBar.visible = true;
                chartObj.refresh();
            });

            it('Checking with errorBar  fixed type horizontal mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let svg: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(svg != null).toBe(true);
                    let svg1: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_1_Point_1');
                    expect(svg1 != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.mode = 'Horizontal';
                chartObj.series[1].errorBar.visible = true;
                chartObj.series[1].errorBar.mode = 'Horizontal';
                chartObj.refresh();
            });

            it('Checking with horizontal mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let sdErrorElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(sdErrorElem != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'StandardError';
                chartObj.series[0].errorBar.mode = 'Horizontal';
                chartObj.series[1].errorBar.visible = true;
                chartObj.series[1].errorBar.type = 'StandardError';
                chartObj.series[1].errorBar.mode = 'Horizontal';
                chartObj.refresh();
            });

             it('Checking with both mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let sdErrorElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(sdErrorElem != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'StandardError';
                chartObj.series[0].errorBar.mode = 'Both';
                chartObj.series[1].errorBar.visible = true;
                chartObj.series[1].errorBar.type = 'StandardError';
                chartObj.series[1].errorBar.mode = 'Both';
                chartObj.refresh();
            });

             it('Checking with custom type vertical mode', (done: Function) => {
                loaded = (args: Object): void => {
                    let cusErrorElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(cusErrorElem != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Custom';
                chartObj.series[0].errorBar.mode = 'Vertical';
                chartObj.series[1].errorBar.visible = true;
                chartObj.series[1].errorBar.type = 'Custom';
                chartObj.series[0].errorBar.mode = 'Vertical';
                chartObj.refresh();
            });
             it('Checking with custom type', (done: Function) => {
                loaded = (args: Object): void => {
                    let cusErrorElem: HTMLElement = document.getElementById('container_Series__ErrorBarGroup_0_Point_0');
                    expect(cusErrorElem != null).toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.series[0].errorBar.visible = true;
                chartObj.series[0].errorBar.type = 'Custom';
                chartObj.series[0].errorBar.mode ='Horizontal';
                chartObj.series[1].errorBar.visible = true;
                chartObj.series[1].errorBar.type = 'Custom';
                chartObj.series[0].errorBar.mode ='Horizontal';
                chartObj.zoomSettings.enableSelectionZooming = true;
                chartObj.refresh();
            });
            it('Checking pinch zooming with label', (done: Function) => {
                loaded = (args: Object): void => {
                    chartObj.loaded = null;
                    let touchStartArgs: Object;
                    let content: string;
                    let areaElement: HTMLElement = document.getElementById('container_ChartAreaBorder');
                    chartObj.chartOnMouseDown(<PointerEvent>trigger.onTouchStart(areaElement, 608, 189, 504, 289, 504, 289));
                    chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 728, 389, 404, 289, 404, 189));
                    chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 748, 129, 304, 289, 304, 289));
                    content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                    expect(content == '0.23').toBe(true);
                    content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                    expect(content == '0.63').toBe(true);
                    chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.zoomSettings.enableSelectionZooming = true;
                chartObj.zoomSettings.enablePinchZooming = true;
                chartObj.refresh();
            });
    });
    });
