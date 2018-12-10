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
import { tooltipData1, tooltipData2, datetimeData, unbindResizeEvents } from '../base/data.spec';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointEventArgs } from '../../../src/common/model/interface';
import { IPointRenderEventArgs, ITooltipRenderEventArgs } from '../../../src/chart/index';
Chart.Inject(LineSeries, ColumnSeries, DateTime, Category, BarSeries);
Chart.Inject(Tooltip);



let data: any = tooltipData1;
let data2: any = tooltipData2;

describe('Chart Control', () => {

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
                expect(group.childNodes.length == 5).toBe(true);
                expect(text1.childNodes.length == 3).toBe(true);
                expect(text1.textContent == 'ChartSeriesNameGold$2000.00 : 40').toBe(true);
                expect(text1.childNodes[1].textContent == '$2000.00 : ').toBe(true);
                expect(text1.childNodes[2].textContent == '40').toBe(true);
                expect((<HTMLElement>group.childNodes[2]).getAttribute('d') != '' || ' ').toBe(true);
                done();
            };
            chartObj.pointClick = null;
            chartObj.pointMove = null;
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

            let text2: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1].childNodes[2] as HTMLElement;
            expect(text2.textContent == '70').toBe(true);

            let trackSymbol: HTMLElement = document.getElementById('containerSymbolGroup0').lastChild as HTMLElement;
            expect(trackSymbol != null).toBe(true);

            targetElement = chartObj.element.querySelector('#container_Series_0_Point_7_Symbol') as HTMLElement;

            y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
            x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft - 1;
            trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
            let text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1].childNodes[1] as HTMLElement;

            expect(text1.textContent == '$8000.00 : ').toBe(true);
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
                expect(text1.textContent == 'ChartSeriesNameGold7000 : 40').toBe(true);
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
                expect(text1.textContent == 'ChartSeriesNameGold5000 : 50').toBe(true);
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
                expect(text1.textContent == 'ChartSeriesNameGold2006 : 65').toBe(true);
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
                expect(text1.textContent == 'ChartSeriesNameGold#3000 : 70C').toBe(true);
                expect(document.getElementById('container_Series_0_Point_2_Trackball_0').getAttribute('fill') == 'transparent').toBe(true);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y + 50));
            };
            chartObj.animationComplete =  (args: Object): void => {
                let track: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_0');
                expect(track === null).toBe(true);
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
    });
});