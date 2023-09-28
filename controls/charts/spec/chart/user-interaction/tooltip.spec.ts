/**
 * Tooltip spec document
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ChartSeriesType, ChartRangePadding, ValueType, ChartShape } from '../../../src/chart/utils/enum';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { MouseEvents } from '../base/events.spec';
import { tooltipData1, tooltipData2,datetimeData } from '../base/data.spec';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointEventArgs } from '../../../src/chart/model/chart-interface';
import { IPointRenderEventArgs, ITooltipRenderEventArgs } from '../../../src/chart/index';
Chart.Inject(LineSeries, ColumnSeries, DateTime, Category, BarSeries);
Chart.Inject(Tooltip);



let data: any = tooltipData1;
let data2: any = tooltipData2;

describe('Chart Control', () => {  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
});
    // eslint-disable-next-line @typescript-eslint/indent
    describe('Chart Tooltip', () => {
        let chartObj: Chart;
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let pointEvent: EmitType<IPointEventArgs>;
        let loaded1: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', labelFormat: 'C' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },

                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                        marker: {
                            shape: 'Circle', visible: true, width: 10, height: 10, opacity: 1,
                            border: { width: 1, color: null }
                        }
                    }], width: '800',
                    tooltip: { enable: true},
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Point mouse move and click', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container_Series_0_Point_1_Symbol') as HTMLElement;

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                trigger.clickEvent(targetElement);
                done();
            };
            pointEvent = (args: IPointEventArgs) : void => {
                expect(args.pointIndex == 1).toBe(true);
                expect(args.seriesIndex == 0).toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.pointClick = pointEvent;
            chartObj.pointMove = pointEvent;
            chartObj.refresh();
        });

        it('Default Tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container_Series_0_Point_1_Symbol') as HTMLElement;

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);

                let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                let path: HTMLElement = group.childNodes[0] as HTMLElement;
                let text1: HTMLElement = group.childNodes[1] as HTMLElement;
                let text2: HTMLElement = group.childNodes[2] as HTMLElement;

                expect(path.localName == 'path').toBe(true);
                expect(path.getAttribute('d') != '' || ' ').toBe(true);
                expect(group.childNodes.length == 4).toBe(true);
                expect(text1.childNodes.length == 5).toBe(true);
                expect(text1.textContent.replace(/\u200E/g, '') == 'ChartSeriesNameGold$2000.00 : 40').toBe(true);
                // expect(text1.childNodes[1].textContent.replace(/\u200E/g, '') == '$2000.00 : ').toBe(true);
                // expect(text1.childNodes[2].textContent.replace(/\u200E/g, '') == '40').toBe(true);
                expect((<HTMLElement>group.childNodes[2]).getAttribute('d') != '' || ' ').toBe(true);
                done();
            };
            chartObj.pointClick = null;
            chartObj.pointMove = null;
            chartObj.selectionMode = 'None';
            chartObj.selectionPattern = 'None';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });


        it('Edge Tooltip', () => {

            targetElement = chartObj.element.querySelector('#container_Series_0_Point_0_Symbol') as HTMLElement;

            let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
            y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
            x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
            trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));

            let tooltip: HTMLElement = document.getElementById('container_tooltip');
            expect(tooltip != null).toBe(true);

            let text2: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
            expect(text2.textContent.replace(/\u200E/g, '')).toEqual('ChartSeriesNameGold$1000.00 : 70');

            //expect(text2.textContent.replace(/\u200E/g, '') == '70').toBe(true);

            let trackSymbol: HTMLElement = document.getElementById('containerSymbolGroup0').lastChild as HTMLElement;
            expect(trackSymbol != null).toBe(true);

            targetElement = chartObj.element.querySelector('#container_Series_0_Point_7_Symbol') as HTMLElement;

            y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
            x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft - 1;
            trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
            let text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1]as HTMLElement;

            expect(text1.textContent.replace(/\u200E/g, '') == 'ChartSeriesNameGold$8000.00 : 70').toBe(true);
            expect((<HTMLElement>tooltip.childNodes[0].childNodes[0].childNodes[2]).getAttribute('d') != '' || ' ').toBe(true);
        });

        it('Column Tooltip', (done: Function) => {
            remove(document.getElementById('container_tooltip'));

            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);


                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                expect(parseFloat(tooltip.style.top) > series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')));

                target = document.getElementById('container_Series_0_Point_0');
                y = series.points[0].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[0].regions[0].x + series.points[0].regions[0].width / 2 + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                expect(parseFloat(tooltip.style.left) > series.points[0].regions[0].width / 2 + series.points[0].regions[0].x + parseFloat(chartArea.getAttribute('x')));

                target = document.getElementById('container_Series_0_Point_7');
                y = series.points[7].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[7].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Column';
            chartObj.series[0].dataSource = data;
            chartObj.refresh();
        });

        it('Tooltip with Highlight color', (done: Function) => {
            remove(document.getElementById('container_tooltip'));

            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '1').toBe(true);
                expect(target.getAttribute('fill') == 'red').toBe(true);

                target = document.getElementById('container_Series_0_Point_0');
                y = series.points[0].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[0].regions[0].x + series.points[0].regions[0].width / 2 + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                expect(target.getAttribute('opacity') == '1').toBe(true);
                expect(target.getAttribute('fill') == 'red').toBe(true);

                target = document.getElementById('container_Series_0_Point_5');
                y = series.points[5].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[5].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                expect(target.getAttribute('opacity') == '1').toBe(true);
                expect(target.getAttribute('fill') == 'red').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.highlightColor = 'red';
            chartObj.series[0].type = 'Column';
            chartObj.series[0].dataSource = data;
            chartObj.refresh();
        });

        it('Tooltip for Negative point', (done: Function) => {
            remove(document.getElementById('container_tooltip'));

            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let series: Series = <Series>chartObj.series[0];
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.top) < series.points[1].regions[0].height + series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')));


                target = document.getElementById('container_Series_0_Point_5');
                y = series.points[5].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[5].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.top) > series.points[5].regions[0].height + series.points[5].regions[0].y + parseFloat(chartArea.getAttribute('y')));
                done();
            };
            chartObj.loaded = loaded;
            data[1].y = -40; data[5].y = -20;
            chartObj.series[0].dataSource = data;
            chartObj.highlightColor = '';
            chartObj.refresh();

        });
        it('Tooltip for Category Axis', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
                expect(text1.textContent.replace(/\u200E/g, '') == 'ChartSeriesNameGold7000 : 40').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].type = 'Line';
            chartObj.refresh();
        });

        it('Tooltip Without marker', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = (<Points>(<Series>chartObj.series[0]).points[4]).symbolLocations[0].y;
                x = (<Points>(<Series>chartObj.series[0]).points[4]).symbolLocations[0].x;
                y += parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x += parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
                expect(text1.textContent.replace(/\u200E/g, '') == 'ChartSeriesNameGold5000 : 50').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = false; chartObj.series[0].marker.height = 5;
            chartObj.series[0].marker.width = 5;
            chartObj.refresh();

        });
        it('checking with tooltip with marker events', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: ILoadedEventArgs) => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                x = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].x;
                y += parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x += parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
                let trackSymbol: HTMLElement = document.getElementById('container_tooltip_Trackball_0');
                expect(trackSymbol.getAttribute('fill')).toEqual('red');
                done();
            };
            chartObj.tooltipRender = (args : ITooltipRenderEventArgs) => {
                if (args.point.index == 3) {
                     args.cancel = true;
                }
            },
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.pointRender = (args: IPointRenderEventArgs) => {
                if (args.point.index === 2) {
                    args.shape = 'Triangle';
                    args.fill = 'red';
                }
            };
            chartObj.refresh();
        });

        it('Tooltip for datetime Axis', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
                expect(text1.textContent.replace(/\u200E/g, '') == 'ChartSeriesNameGold2006 : 65').toBe(true);
                remove(document.getElementById('container_tooltip'));
                remove(document.getElementById('container_Series_0_Point_3_Trackball_0'));
                remove(document.getElementById('container_Series_0_Point_3_Trackball_1'));
                done();
            };
            chartObj.tooltipRender = null;
            chartObj.loaded = loaded;
            chartObj.pointRender = null;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.labelFormat = '';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.series[0].marker.visible = false;
            chartObj.series[0].marker.visible = true;
            chartObj.height = '470';
            chartObj.refresh();
        });

        it('Changing the visibility of tooltip', (done: Function) => {
            let target: HTMLElement; let tooltip: HTMLElement;
            loaded = (args: Object): void => {
                target = document.getElementById('container_Series_0_Point_3_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = false;
            chartObj.refresh();
        });

        it('Changing the visibility of tooltip with axis label format', (done: Function) => {
            let target: HTMLElement; let tooltip: HTMLElement;
            loaded1 = (args: Object): void => {
                target = document.getElementById('container_Series_0_Point_2_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;

                let path: HTMLElement = group.childNodes[0] as HTMLElement;
                let text1: HTMLElement = group.childNodes[1] as HTMLElement;
                expect(path.getAttribute('fill') == 'pink').toBe(true);
                expect((<HTMLElement>text1.childNodes[0]).getAttribute('fill') == 'red').toBe(true);
                expect(text1.textContent.replace(/\u200E/g, '') == 'ChartSeriesNameGold#3000 : 70C').toBe(true);
                expect(document.getElementById('container_Series_0_Point_2_Trackball_0').getAttribute('fill') == 'transparent').toBe(true);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y + 50));
            };
            chartObj.animationComplete =  (args: Object): void => {
                let track: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_0');
                //expect(track !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded1;
            chartObj.tooltip.enable = true;
            chartObj.tooltip.fill = 'pink';
            chartObj.tooltip.textStyle.color = 'red';
            chartObj.tooltip.format = null;
            chartObj.primaryYAxis.labelFormat = '{value}C';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryXAxis.labelFormat = '#{value}';
            chartObj.series[0].dataSource = data;
            chartObj.series[0].marker.fill = 'blue';
            chartObj.refresh();
        });
        it('Checking with template', (done: Function) => {
            let tooltip: HTMLElement;
            remove(document.getElementById('container_tooltip'));
            loaded1 = (args: Object): void => {
                let target: HTMLElement;
                target = document.getElementById('container_Series_0_Point_1_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                //done();
                chartArea = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('height')) + parseFloat(chartArea.getAttribute('y')) + 200 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('width')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                //trigger.mouseleavetEvent(elem, Math.ceil(x), Math.ceil(y));
                done();
            };
            let animate: EmitType<IAnimationCompleteEventArgs> = (args: Object): void => {
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip == null).toBe(true);
                done();
            };
            chartObj.animationComplete = null;
            chartObj.tooltip.template = '<div>${x}</div><div>${y}</div>';
            chartObj.title = 'Template';
            chartObj.loaded = loaded1;
            chartObj.dataBind();
        });
        it('Checking with inverted axis series', (done: Function) => {
            let tooltip: HTMLElement;
            loaded1 = (args: Object): void => {
                trigger.mousemovetEvent(elem, 400, 110);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                trigger.mousemovetEvent(elem, 300, 170);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded1;
            chartObj.series = [{
                type: 'Bar', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },
            }, { type: 'Bar', dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false } }];
            chartObj.animationComplete = null;
            chartObj.refresh();
        });
        it('Tooltip for Category Axis with Tooltip Mapping Name', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
                expect(text1.textContent == 'undefined').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].type = 'Line';
            chartObj.tooltip.template = '';
            chartObj.series[0].tooltipMappingName = 'tooltip';
            chartObj.tooltip.format = '${point.tooltip}';
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
        });
        it('Tooltip for Category Axis with Tooltip Mapping Name', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
                expect(text1.textContent == '40').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].type = 'Line';
            chartObj.tooltip.template = '';
            chartObj.series[0].tooltipMappingName = 'y';
            chartObj.tooltip.format = '${point.tooltip}';
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
        });


        it('Checking with multiple series with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
                expect(text1.textContent == '40').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].type = 'Line';
            chartObj.tooltip.template = '';
            chartObj.tooltip.format = '${point.x} : ${point.y}';
            chartObj.series[0].tooltipMappingName = 'y';
            chartObj.series[0].tooltipFormat  = '${point.tooltip}';
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
        });

        it('Tooltip for column with marker', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(+((tooltip.style.top).replace('px', '')) < +target.getAttribute('cy')).toBe(true);
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Column';
            chartObj.refresh();
        });
        it('Tooltip for Line with marker', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(+((tooltip.style.top).replace('px', '')) < +target.getAttribute('cy')).toBe(true);
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Line';
            chartObj.refresh();
        });
        it('checking with tooltipRender event with headerText', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip_text');
                expect(tooltip.firstElementChild.innerHTML).toEqual('${point.x}');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltipRender = (args: ITooltipRenderEventArgs) => {
                args.headerText = '${point.x}';
            };
            chartObj.tooltip = { enable: true };
            chartObj.refresh();
        });
        it('checking with headerText without header', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip_text');
                expect(tooltip.firstElementChild.innerHTML).toEqual('${point.x}');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltipRender = (args: ITooltipRenderEventArgs) => {
                args.headerText = '${point.x}';
            };
            chartObj.tooltip.header = '';
            chartObj.refresh();
        });
        it('checking with tooltipRender event with template', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6_Symbol');
                let target1: HTMLElement = document.getElementById('container_Series_0_Point_5_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.firstElementChild.innerHTML).toEqual('<div>40C</div><div>7000</div>');
                y = parseFloat(target1.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target1.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target1, Math.ceil(x), Math.ceil(y));
                expect(tooltip.firstElementChild.innerHTML).toEqual('<div>6000</div><div>-20C</div>');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip = { enable: true };
            chartObj.tooltip.template = "<div>${x}</div><div>${y}</div>";
            chartObj.tooltipRender = (args: ITooltipRenderEventArgs) => {
                if(args.point.index == 6)
                args.template = '<div>${y}</div><div>${x}</div>';
            };
            chartObj.refresh();
        });
        it('checking shared tooltip with single point', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_0_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.labelFormat = '';
            chartObj.series[0].dataSource = [{ x: new Date(2012, 10, 11), y: 70 }]
            chartObj.tooltip = { enable: true, shared: true };
            chartObj.tooltip.template = null;
            chartObj.refresh();
        });
        it('checking shared tooltip with one series with single point and other series with multiple point', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_1_Point_0_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [
                { type: 'Line', dataSource: [{ x: new Date(2012, 9, 11), y: 80 }, { x: new Date(2012, 10, 11), y: 90 }], xName: 'x', yName: 'y', animation: { enable: false }, marker:{visible: true} },
                { type: 'Line', dataSource: [{ x: new Date(2012, 11, 11), y: 70 }], xName: 'x', yName: 'y', animation: { enable: false },marker: {visible:true, shape:'Circle'}},
                { type: 'Line', dataSource: [{ x: new Date(2013, 1, 11), y: 70 }], xName: 'x', yName: 'y', animation: { enable: false },marker: {visible:true, shape:'Circle'}}];
                
            chartObj.tooltip = { enable: true, shared: true };
            chartObj.refresh();
        });
    });

    describe('Chart template', () => {
        let chartObj: Chart;
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let pointEvent: EmitType<IPointEventArgs>;
        let loaded1: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Category' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', labelFormat: '{value}°C' },

                    series: [{
                        dataSource: [
                            { x: 'Sun', y: 15 }, { x: 'Mon', y: 22 },
                            { x: 'Tue', y: 32 },
                            { x: 'Wed', y: 31 },
                            { x: 'Thu', y: 29 }, { x: 'Fri', y: 24 },
                            { x: 'Sat', y: 18 },
                        ], xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                        marker: {
                            shape: 'Circle', visible: true, width: 10, height: 10, opacity: 1,
                            border: { width: 1, color: null }
                        }
                    },
                    {
                        dataSource: [
                            { x: 'Sun', y: 10 }, { x: 'Mon', y: 18 },
                            { x: 'Tue', y: 28 },
                            { x: 'Wed', y: 28 },
                            { x: 'Thu', y: 26 }, { x: 'Fri', y: 20 },
                            { x: 'Sat', y: 15 }
                        ], xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameSilver', fill: 'rgba(135,206,235,1)',
                        marker: {
                            shape: 'Circle', visible: true, width: 10, height: 10, opacity: 1,
                            border: { width: 1, color: null }
                        }
                    }], width: '800',
                    tooltip: { enable: true, shared: true },
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking with shared template', (done: Function) => {
            let tooltip: HTMLElement;            
            loaded1 = (args: Object): void => {
                let target: HTMLElement;
                target = document.getElementById('container_Series_0_Point_1_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                //done();
                chartArea = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('height')) + parseFloat(chartArea.getAttribute('y')) + 200 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('width')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                //trigger.mouseleavetEvent(elem, Math.ceil(x), Math.ceil(y));
                done();
            };
            let animate: EmitType<IAnimationCompleteEventArgs> = (args: Object): void => {
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip == null).toBe(true);
                done();
            };
            chartObj.animationComplete = null;
            chartObj.tooltip.template = '<div>${x}</div><div>${y}</div>';
            chartObj.title = 'Template';
            chartObj.loaded = loaded1;
            chartObj.dataBind();
        });
    });

    describe('customer issue: Tooltip on property change console error checking', () => {
        let chartObj: Chart;
        let div: HTMLElement = createElement('div', { id: 'mainDiv' });
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let button1: HTMLElement = createElement('button', {id: 'button1'});
        let button2: HTMLElement = createElement('button', { id: 'button2' });
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            document.body.appendChild(div);
            div.appendChild(button1);
            div.appendChild(button2);
            div.appendChild(elem);
            chartObj = new Chart(
                {
                    //Initializing Primary X and Y Axis
                    primaryXAxis: {
                        valueType: 'Category', interval: 1, majorGridLines: { width: 0 }
                    },
                    chartArea: { border: { width: 0 } },
                    primaryYAxis:
                    {
                        majorGridLines: { width: 0 },
                        majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' }
                    },
                    //Initializing Chart Series
                    series: [
                        {
                            type: 'Column', xName: 'x', width: 2, yName: 'y', name: 'Gold',
                            dataSource: [{ x: 'USA', y: 46 }, { x: 'GBR', y: 27 }, { x: 'CHN', y: 26 }],
                            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }
                        },
                        {
                            type: 'Column', xName: 'x', width: 2, yName: 'y', name: 'Silver',
                            dataSource: [{ x: 'USA', y: 37 }, { x: 'GBR', y: 23 }, { x: 'CHN', y: 18 }],
                            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }
                        },
                        {
                            type: 'Column', xName: 'x', width: 2, yName: 'y', name: 'Bronze',
                            dataSource: [{ x: 'USA', y: 38 }, { x: 'GBR', y: 17 }, { x: 'CHN', y: 26 }],
                            marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }
                        }
                    ],
                    //Initializing Chart title
                    width: '500px',
                    title: 'Olympic Medal Counts - RIO', tooltip: { enable: true },
                });
            chartObj.appendTo('#container');
            document.getElementById('button1').onclick = function () {
                chartObj.tooltip = { enable: false };
            }
            document.getElementById('button2').onclick = function () {
                chartObj.tooltip = { enable: true };
            }
        });
        afterAll((): void => {
            chartObj.destroy();
            div.remove();
        });

        it('Disable the tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('button1') as HTMLElement;
                trigger.clickEvent(targetElement);
                expect(chartObj.tooltip.enable === false).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Enable the tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('button2') as HTMLElement;
                trigger.clickEvent(targetElement);
                expect(chartObj.tooltip.enable === true).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
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