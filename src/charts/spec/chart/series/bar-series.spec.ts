
/**
 * Specifies the Bar series spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { LineSeries } from '../../../src/chart/series/line-series';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Axis } from '../../../src/chart/axis/axis'; 
import { Series, Points } from '../../../src/chart/series/chart-series';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { DataLabel } from '../../../src/chart/series/data-label';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { bar, barData, datetimeData, categoryData, categoryData1, negativeDataPoint, rotateData1, rotateData2 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';

Chart.Inject(LineSeries, BarSeries, ColumnSeries, Tooltip, Crosshair, Category, DateTime, DataLabel);



describe('Chart Control', () => {
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
                        dataSource: bar, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                    },
                    ], width: '800',
                    tooltip: { enable: true, textStyle: { size: '12px' }},
                    legendSettings: { visible: false },
                    title: 'Chart TS Title'
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking with default points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with null Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3');
                expect(svg == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = bar;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.refresh();
        });
        it('Checking with single Points', (done: Function) => {
            loaded = (args: Object): void => {
                let svg1: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg1 != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.rangePadding = 'Additional';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = null;
            chartObj.series[0].dataSource = [{ x: 4, y: 30 }];
            chartObj.refresh();
        });

        it('Checking with negative Points', (done: Function) => {
            loaded = (args: Object): void => {
                let series: Series = <Series>chartObj.series[0];
                let axisLabel = document.getElementById('container1_AxisLabel_4');
                svg = document.getElementById('container_Series_0_Point_1');
                expect(series.points[1].regions[0].x < parseFloat(axisLabel.getAttribute('x'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.refresh();
        });

        it('checking with border', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_1');
                let path = svg.getAttribute('d');
                let count = path.indexOf('Z')
                expect(count !== -1).toBe(true);
                expect(svg.getAttribute('stroke') === 'red').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].border.color = 'red';
            chartObj.series[0].border.width = 4;
            chartObj.refresh();
        });

        it('checking multiple series bar chart', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                let point1 = document.getElementById('container_Series_0_Point_2');
                let point2 = document.getElementById('container_Series_1_Point_2');
                expect((series0.points[2].regions[0].y) == series1.points[2].regions[0].height + series1.points[2].regions[0].y).toBe(true);
                done();
            }
            chartObj.series = [{
                dataSource: bar, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            },
            {
                dataSource: barData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,235,1)',
            },
            {
                dataSource: barData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,000,1)',
            }
            ];
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.rangePadding = 'None';
            chartObj.primaryYAxis.rangePadding = 'None';
            chartObj.refresh();

        });
        it('checking multiple series with diff orientation(horizontal) ', (done: Function) => {
            loaded = (args: Object): void => {
                let point1 = document.getElementById('container_Series_0_Point_0');
                let point2 = document.getElementById('container_Series_1_Point_0');
                expect(point2 == null).toBe(true);
                done();
            }
            chartObj.series = [{
                dataSource: bar, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            },
            {
                dataSource: barData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,235,1)',
            },
            {
                dataSource: barData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,000,1)',
            }
            ];
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('checking multiple series with diff orientation(vertical) ', (done: Function) => {
            loaded = (args: Object): void => {
                let point1 = document.getElementById('container_Series_0_Point_0');
                let point2 = document.getElementById('container_Series_1_Point_0');
                expect(point2 != null).toBe(true);
                expect(point1 != null).toBe(true);
                done();
            }
            chartObj.series = [];
            chartObj.series = [{
                dataSource: bar, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Column',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            },
            {
                dataSource: barData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Column',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,235,1)',
            },
            {
                dataSource: barData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                name: 'ChartSeriesNamepearl', fill: 'rgba(135,000,000,1)',
            }];
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('default Tooltip', (done: Function) => {

            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                expect(parseFloat(tooltip.style.left) > series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')));

                target = document.getElementById('container_Series_0_Point_7');
                series = <Series>chartObj.series[0];

                y = series.points[7].regions[0].y + parseFloat(chartArea.getAttribute('y')) + 30 + elem.offsetTop;
                x = series.points[7].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Bar';
            chartObj.series[0].dataSource = bar;
            chartObj.series[0].dataSource[3].y = 0;
            chartObj.refresh();
        });
        it('tooltip checking with positive edges', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_7');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let tooltipWidth: HTMLElement;
                y = series.points[7].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[7].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                tooltipWidth = document.getElementById('container_tooltip_svg');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                expect(parseFloat(tooltip.style.left) > (elem.offsetLeft + series.points[7].regions[0].x + (series.points[7].regions[0].width / 2) + parseFloat(chartArea.getAttribute('x')))).toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = bar;
            chartObj.primaryXAxis.rangePadding = 'Additional';
            chartObj.refresh();
        });
        it('negative Tooltip', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                expect(parseFloat(tooltip.style.left) < series.points[1].regions[0].x + series.points[1].regions[0].width + parseFloat(chartArea.getAttribute('x'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Bar';
            bar[7].y = -10, bar[1].y = -60;
            chartObj.series[0].dataSource = bar;
            chartObj.refresh();
        });
        it('tooltip checking with negative edge', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_7');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let tooltipWidth: HTMLElement;
                y = series.points[7].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[7].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                tooltipWidth = document.getElementById('container_tooltip_svg');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                expect((parseFloat(tooltip.style.left) + parseFloat(tooltipWidth.getAttribute('width'))) < series.points[1].regions[0].x + series.points[1].regions[0].width + parseFloat(chartArea.getAttribute('x'))).toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = bar;
            chartObj.refresh();
        });
        it(' checking with category  axis', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                point = document.getElementById("container_Series_0_Point_1");
                let point2 = document.getElementById("container_Series_1_Point_1");
                expect(point.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                expect(point2 == null).toBe(true);
                let target: HTMLElement = document.getElementById('container_Series_0_Point_0');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[0].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[0].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                done();
            };
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series = [{
                dataSource: categoryData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            },
            {
                dataSource: categoryData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,235,1)',
            },
            {
                dataSource: categoryData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                name: 'ChartSeriesNameRuby', fill: 'rgba(135,000,000,1)',
            }],
                chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('checking with track ball', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_7');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[7].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[7].regions[0].x + parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) - 10 + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.offsetTop < y + series.points[7].regions[0].height).toBe(true);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.series[1].type = 'Bar';
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.crosshair.enable = true;
            chartObj.tooltip.shared = true;
            chartObj.refresh();
        });
        it('checking with cross hair', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let series: Series = <Series>chartObj.series[0];

                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[2].regions[0].x + series.points[2].regions[0].width / 2 + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').childNodes[4];
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 4).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == 'Japan').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent == '35.075' || element1.textContent == '35.076').toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[5].y = 0;
            chartObj.refresh();
        });

        it(' checking with datetime  axis', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                point = document.getElementById("container_Series_0_Point_1");
                let point2 = document.getElementById("container_Series_1_Point_1");
                expect(point.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                expect(point2 == null).toBe(true);
                done();
            }
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = null;
            chartObj.series[1].dataSource = null;
            chartObj.series = [{
                dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            }],
                chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with multiple axes rows', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById('container_Series_0_Point_0');
                expect(point.getAttribute('fill') === 'rgba(135,206,235,1)').toBe(true);
                let point1 = document.getElementById('container_Series_1_Point_1');
                expect(point1.getAttribute('fill') === 'rgba(135,000,235,1)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis1', title: 'AdditionalAxis',
                titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' }
            }];
            chartObj.series = [{
                dataSource: bar, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            },
            {
                dataSource: barData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Bar',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,235,1)',
            },
            ],
                chartObj.height = '600';
            chartObj.series[1].xAxisName = 'yAxis1';
            chartObj.rows = [{ height: '300', border: { width: 4, color: 'red' } },
            { height: '300', border: { width: 4, color: 'blue' } }];
            chartObj.refresh();
        });

        it('Checking animation', (done: Function) => {

            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                done();
            };
            chartObj.series[0].animation.enable = true;
            chartObj.series[1].animation.enable = true;
            chartObj.animationComplete = animationComplete;
            chartObj.refresh();

        });
        it('checking data label position with multiple axes - rows', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                expect(document.getElementById('containerTextGroup1').childElementCount).toBe(
                    document.getElementById('containerTextGroup0').childElementCount
                );
                done();
            };
            chartObj.series[0].animation.enable = false;
            chartObj.series[1].animation.enable = false;
            chartObj.animationComplete = null;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[1].marker.dataLabel.visible = true;
            chartObj.series[1].dataSource = bar;
            chartObj.axes[0].rangePadding = 'Additional';
            chartObj.rows = [{ height: '50%', border: { width: 4, color: 'red' } },
            { height: '50%', border: { width: 4, color: 'blue' } }];
            chartObj.refresh(); unbindResizeEvents(chartObj);

        });
    });
    describe('Bar Series with data label', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
        let element: HTMLElement;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            if(document.getElementById('template')) {
              remove(document.getElementById('template'));           
            }
            if(document.getElementById('template1')) {
                remove(document.getElementById('template1'));           
              }
            let template: Element = createElement('div', { id: 'template', styles: 'display: none;' });           
            document.body.appendChild(template);
            template.innerHTML = '<div>80</div>';
            let template1: Element = createElement('div', { id: 'template1', styles: 'display: none;' });
            document.body.appendChild(template1);
            template1.innerHTML = '<div>${point.y}</div>';
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold', dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: -40 },
                        { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: -50 }, { x: 6000, y: -40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y',
                        type: 'Bar', fill: 'rgba(135,206,235,1)',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
            remove(document.getElementById('template'));
            remove(document.getElementById('template1'));
        });

        it('With negative location', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].x;
                expect(svg < point0Location).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].x;
                expect(svg > point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let pointLocation1 = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].x;
                expect(svg < pointLocation1).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.refresh();

        });
        it('With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location: number = ((<Points>(<Series>chartObj.series[0]).points[1]).regions[0].x +
                    (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].width);
                expect(svg < point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                let point0Location1 = (<Points>(<Series>chartObj.series[0]).points[0]).regions[0].x;
                expect(svg1 > point0Location1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();

        });
        it('With Label position Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let svgHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('height');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg < point0Location).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.refresh();

        });
        it('Color saturation middle position', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'white').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.fill = 'red';
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();

        });

        it('Color saturation fill as transparent', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'black').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.fill = 'transparent';
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();

        });
        it('Color saturation with chart area background black', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'white').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.chartArea.background = 'black';
            chartObj.chartArea.border = {
                color: ''
            };
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();

        });
        it('Color saturation with top position', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();

        });
        it('Color saturation with data label fill color', (done: Function) => {
            loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'white').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].animation.enable = true;
            chartObj.series[0].marker.dataLabel.fill = 'red';
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();

        });
        it('Checking Events', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_2');
                expect(element.getAttribute('fill') == 'brown').toBe(true);
                element = document.getElementById('container_Series_0_Point_0');
                expect(element == null).toBe(true);
                done();
            };
            chartObj.pointRender = (args: IPointRenderEventArgs) => {
                if (args.point.index === 0) {
                    args.cancel = true;
                }
                if (args.point.index === 2) {
                    args.fill = 'brown';
                }
            };
            chartObj.loaded = loaded;
            chartObj.title = 'Events Changed';
            chartObj.dataBind();
        });

        it('checking elements counts without using template', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element != null).toBe(true);
                element = document.getElementById('container_Secondary_Element');
                expect(element.childElementCount).toBe(0);
                done();
            };
            chartObj.pointRender = null;
            chartObj.series[0].animation.enable = false;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh();

        });
        it('checking elements counts with using template without element', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element).toBe(null);
                element = document.getElementById('container_Secondary_Element');
                expect(element.childElementCount).toBe(0);
                element = document.getElementById('container_Series_0_DataLabelCollections');
                expect(element).toBe(null);
                done();
            };
            chartObj.series[0].marker.dataLabel.template = 'label';
            chartObj.chartArea.background = 'transparent';
            chartObj.refresh();

        });
        it('checking elements counts and datalabel with using template as html string', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element).toBe(null);
                element = document.getElementById('container_Secondary_Element');
                expect(element.childElementCount).toBe(1);
                expect(element.children[0].id).toBe('container_Series_0_DataLabelCollections');
                element = document.getElementById('container_Series_0_DataLabelCollections');
                expect(element.childElementCount).toBe(8);
                element = document.getElementById('container_Series_0_DataLabel_5');
                expect(element.children[0].innerHTML).toBe('-40');
                done();
            };
            chartObj.series[0].marker.dataLabel.template = '<div>${point.y}</div>';
            chartObj.refresh();

        });
        it('checking template as point x value and cheecking style', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_DataLabel_5');
                expect(element.children[0].innerHTML).toBe('6000 : -40');
                expect(element.style.backgroundColor).toBe('red');
                expect(element.style.color).toBe('white');
                done();
            };
            chartObj.series[0].marker.dataLabel.template = '<div>${point.x} : ${point.y}</div>';
            chartObj.refresh();

        });
        it('checking template using script element', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_DataLabel_5');
                expect(element.children[0].innerHTML).toBe('80');
                expect(element.style.backgroundColor).toBe('red');
                expect(element.style.color).toBe('white');
                done();
            };
            chartObj.series[0].marker.dataLabel.template = '#template';
            chartObj.refresh();

        });
        it('checking template using script element as format', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element).toBe(null);
                element = document.getElementById('container_Secondary_Element');
                expect(element.childElementCount).toBe(1);
                expect(element.children[0].id).toBe('container_Series_0_DataLabelCollections');
                element = document.getElementById('container_Series_0_DataLabelCollections');
                expect(element.childElementCount).toBe(8);
                element = document.getElementById('container_Series_0_DataLabel_5');
                expect(element.children[0].innerHTML).toBe('-40');
                done();
            };
            chartObj.series[0].marker.dataLabel.template = '#template1';
            chartObj.series[0].animation.enable = true;
            chartObj.refresh();
        });
    });
    describe('Bar Series Inversed axis', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        let dataLabelX;
        let pointX;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', isInversed: true },
                    series: [{
                        animation: { enable: false },  name: 'ChartSeriesNameGold',
                        dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: -40 }, { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: -50 }, { x: 6000, y: -40 },{ x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y',
                        type: 'Bar', marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: false }
                });
            chart.appendTo('#container');

        });

        afterAll((): void => {
            chart.destroy();
            element.remove();
        });

        it('With Label position Auto', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelX = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].x;
                expect(dataLabelX > pointX).toBe(true);
                dataLabelX = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].x;
                expect(dataLabelX < pointX).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Auto';
            chart.refresh();

        });

        it('With Label position Outer', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelX = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].x;
                expect(dataLabelX > pointX).toBe(true);
                dataLabelX = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].x;
                expect(dataLabelX < pointX).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.refresh();

        });

        it('With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelX = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].x;
                expect(dataLabelX < pointX).toBe(true);
                dataLabelX = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].x;
                expect(dataLabelX > pointX).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.series[0].marker.dataLabel.alignment = 'Center';
            chart.refresh();

        });
        it('With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelX = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point: Points = (<Points>(<Series>chart.series[0]).points[1]);
                pointX = point.regions[0].x - point.regions[0].width;
                expect(dataLabelX > pointX).toBe(true);
                dataLabelX = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                point = (<Points>(<Series>chart.series[0]).points[0]);
                pointX = point.regions[0].x + point.regions[0].width;
                expect(dataLabelX < pointX).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.refresh();

        });

        it('With Label position Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let labelX: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let labelHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('width');
                let point: Points = (<Points>(<Series>chart.series[0]).points[1]);
                expect(labelX + labelHeight / 2).toEqual(point.regions[0].x + point.regions[0].width / 2);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.refresh();
        });
        it('checking with axis area', (done: Function) => {
            loaded = (args: ILoadedEventArgs): void => {
                expect(document.getElementById('container_Series_0_DataLabelCollections').childElementCount).toEqual(11);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis = { title: 'Months', valueType: 'Category' };
            chart.primaryYAxis = { minimum: 0, maximum: 80, interval: 20, title: 'Temperature (Fahrenheit)', isInversed: false };
            chart.rows = [{ height: '40%' }, { height: '60%' }];
            chart.axes = [{
                rowIndex: 1, opposedPosition: true, minimum: 24, maximum: 36, interval: 4,
                name: 'yAxis', title: 'Temperature (Celsius)'
            }];
            chart.series = [
                {
                    dataSource: [
                        { x: 'Jan', y: 15, y1: 33 }, { x: 'Feb', y: 20, y1: 31 }, { x: 'Mar', y: 35, y1: 30 },
                        { x: 'Apr', y: 40, y1: 28 }, { x: 'May', y: 80, y1: 29 }, { x: 'Jun', y: 70, y1: 30 },
                        { x: 'Jul', y: 65, y1: 33 }, { x: 'Aug', y: 55, y1: 32 }, { x: 'Sep', y: 50, y1: 34 },
                        { x: 'Oct', y: 30, y1: 32 }, { x: 'Nov', y: 35, y1: 32 }, { x: 'Dec', y: 35, y1: 31 }
                    ],
                    xName: 'x', yName: 'y', name: 'Germany', type: 'Line', animation: { enable: false },
                    marker: { dataLabel: { visible: true, template: '<div>56</div>', position: 'Outer' } }
                }, {
                    dataSource: [
                        { x: 'Jan', y: 15, y1: 33 }, { x: 'Feb', y: 20, y1: 31 }, { x: 'Mar', y: 35, y1: 30 },
                        { x: 'Apr', y: 40, y1: 28 }, { x: 'May', y: 80, y1: 29 }, { x: 'Jun', y: 70, y1: 30 },
                        { x: 'Jul', y: 65, y1: 33 }, { x: 'Aug', y: 55, y1: 32 }, { x: 'Sep', y: 50, y1: 34 },
                        { x: 'Oct', y: 30, y1: 32 }, { x: 'Nov', y: 35, y1: 32 }, { x: 'Dec', y: 35, y1: 31 }
                    ],
                    xName: 'x', yName: 'y', name: 'Germany', type: 'Column', animation: { enable: false },
                    marker: { dataLabel: { visible: true, template: '<div>56</div>', position: 'Outer' } }
                }, {
                    dataSource: [
                        { x: 'Jan', y: 15, y1: 33 }, { x: 'Feb', y: 20, y1: 31 }, { x: 'Mar', y: 35, y1: 30 },
                        { x: 'Apr', y: 40, y1: 28 }, { x: 'May', y: 80, y1: 29 }, { x: 'Jun', y: 70, y1: 30 },
                        { x: 'Jul', y: 65, y1: 33 }, { x: 'Aug', y: 55, y1: 32 }, { x: 'Sep', y: 50, y1: 34 },
                        { x: 'Oct', y: 30, y1: 32 }, { x: 'Nov', y: 35, y1: 32 }, { x: 'Dec', y: 35, y1: 31 }
                    ], width: 2,
                    xName: 'x', yName: 'y1', yAxisName: 'yAxis',
                    name: 'Japan', type: 'Line', animation: { enable: false },
                    marker: { visible: true, width: 10, height: 10, border: { width: 2, color: '#F8AB1D' } }
                }];
            chart.refresh();
        });
    });
    describe('checking rotated bar chart', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        let dataLabel: HTMLElement;
        let point: Points;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        let tooltip: HTMLElement;
        let chartArea: HTMLElement;
        let series: Series;
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart({
                primaryXAxis: { title: 'primaryXAxis', valueType: 'DateTime' },
                primaryYAxis: { title: 'PrimaryYAxis' },
                series: [
                {type: 'Bar', name: 'barSeries1', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false }},
                {type: 'Bar', name: 'barSeries2', dataSource: rotateData2, xName: 'x', yName: 'y', animation: { enable: false }}
                ],
                title: 'rotated Bar Chart',
                width: '700'
            });
        });
        afterAll((): void => {
            chart.destroy();
            element.remove();
        });
        it('checking without rotated', (done: Function) => {
            loaded = (args: Object): void => {
                let axis: Axis = <Axis>chart.primaryYAxis;
                expect(axis.orientation).toEqual('Horizontal');
                axis = <Axis>chart.primaryXAxis;
                expect(axis.orientation).toEqual('Vertical');
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#container');
        });

        it('checking with rotated', (done: Function) => {
            loaded = (args: Object): void => {
                let axis: Axis = <Axis>chart.primaryXAxis;
                expect(axis.orientation).toEqual('Horizontal');
                axis = <Axis>chart.primaryYAxis;
                expect(axis.orientation).toEqual('Vertical');
                done();
            };
            chart.loaded = loaded;
            chart.isTransposed = true;
            chart.refresh();
        });
        it('checking with datalabel Auto position', (done: Function) => {
            loaded = (args: Object): void => {
                //positive yValues
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.visible = true;
            chart.refresh();
        });
        it('checking with datalabel Outer position', (done: Function) => {
            loaded = (args: Object): void => {
                //positive yValues
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.refresh();
        });
        it('checking with datalabel Top position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.refresh();
        });
        it('checking with datalabel Middle position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) > (point.symbolLocations[0].y + point.regions[0].height / 2)).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.refresh();
        });
        it('checking with datalabel bottom position', (done: Function) => {
            loaded = (args: Object): void => {
                //position yValues
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y + point.regions[0].height).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y - point.regions[0].height).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.refresh();
        });
        it('checking with tooltip positive values', (done: Function) => {
            loaded = (args: Object): void => {
                //positive y yValues
                dataLabel = document.getElementById('container_Series_0_Point_2');
                series = <Series>chart.series[0];
                chartArea = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.top) < series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')));


                done();
            };
            chart.loaded = loaded;
            chart.tooltip.enable = true;
            chart.refresh();
        });
        it('checking with tooltip negative values', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_1');
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.top) > series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')));
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('checking with track ball', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_1');
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.top) > series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')));
                done();
            };
            chart.loaded = loaded;
            chart.tooltip.shared = true;
            chart.refresh();
        });
    });
    describe('Bar Series - Marker', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                primaryXAxis: { title: 'primaryXAxis', valueType: 'DateTime' },
                primaryYAxis: { title: 'PrimaryYAxis' },
                series: [
                {type: 'Bar', name: 'barSeries1', dataSource: rotateData1, xName: 'x', yName: 'y', 
                animation: { enable: false }, marker: { visible: true }
             },
                ],
                width: '700'
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('Showing default marker', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Changing visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('containerSymbolGroup0');
                expect(series1 == null).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = false;
            chartObj.refresh();
        });
        it('Changing size', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(series1.getAttribute('rx') == '5').toBe(true);
                expect(series1.getAttribute('ry') == '5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].marker.width = 10;
            chartObj.series[0].marker.height = 10;
            chartObj.refresh();
        });
        it('Checking specify marker color', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(series1.getAttribute('fill') == 'violet').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.fill = 'violet';
            chartObj.refresh();
        });
        it('with image', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(series1.getAttribute('href') == 'base/spec/img/img1.jpg').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Image';
            chartObj.series[0].marker.imageUrl = 'base/spec/img/img1.jpg';
            chartObj.series[0].marker.height = 20;
            chartObj.series[0].marker.width = 20;
            chartObj.refresh();
        });

        it('with marker properties', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_0_Point_2_Symbol');
                expect(series1.getAttribute('fill') == 'green').toBe(true);
                expect(series1.getAttribute('opacity') == '0.1').toBe(true);
                expect(series1.getAttribute('stroke') == 'red').toBe(true);
                expect(series1.getAttribute('stroke-width') == '4').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Circle';
            chartObj.series[0].marker.fill = 'green';
            chartObj.series[0].marker.opacity = 0.1;
            chartObj.series[0].marker.border = {
                width: 4,
                color: 'red'
            };
            chartObj.refresh();
        });
        it('with marker and datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                debugger
                let series1 = document.getElementById('container_Series_0_Point_1_Symbol');
                let datalabel = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(+(datalabel.getAttribute('x')) < +(series1.getAttribute('cx'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });
    });
});

export interface series1 {
    series: Series;
}
