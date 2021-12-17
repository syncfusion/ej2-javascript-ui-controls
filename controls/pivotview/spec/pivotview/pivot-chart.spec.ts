import { IDataSet } from '../../src/base/engine';
import { pivot_smalldata, pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { ChartSeriesCreatedEventArgs } from '../../src/common/base/interface';
import { Series,IResizeEventArgs, Chart } from '@syncfusion/ej2-charts';
import { PivotChart } from '../../src/pivotchart/index';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { Toolbar } from '../../src/common/popups/toolbar';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { ILoadedEventArgs } from '@syncfusion/ej2-charts';
import { ILoadEventArgs } from '@syncfusion/ej2-charts';

describe('Chart - ', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Grouping bar - ', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotView', styles: 'height:500px; width:100%' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
            setTimeout(() => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, FieldList, PivotChart);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_smalldata as IDataSet[],
                        expandAll: false,
                        columns: [{ name: 'Date' }, { name: 'Product' }],
                        rows: [{ name: 'Country' }, { name: 'State' }],
                        formatSettings: [{ name: 'Amount', format: 'C' }],
                        values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                    },
                    dataBound: dataBound,
                    height: 500,
                    showGroupingBar: true,
                    showFieldList: true,
                    tooltipTemplate: '<div id="templateCheck"><span>${rowHeaders}</span><span>${columnHeaders}</span><span>${value}</span><span>${aggregateType}</span><span>${rowFields}</span><span>${columnFields}</span>',
                    displayOption: { view: 'Chart' },
                    chartSettings: {
                        value: 'Amount',
                        chartSeries: { type: 'Column', animation: { enable: false } }
                    },
                });
                pivotGridObj.appendTo('#PivotView');
            }, 2000);
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 2000);
        });
        it('Check initial render', (done: Function) => {
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Canada:100');
                expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Canada:400');
                expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('France:200');
                expect(document.getElementById('PivotView_chart_Series_3_Point_4').getAttribute('aria-label')).toBe('United States:400');
                expect(document.getElementById('PivotView_chart_Series_4_Point_4')).toBeNull();
                expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4').textContent).toBe(' + United States');
                expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('$500.00');
                expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('Country / State');
                expect(document.getElementById('PivotView_chart_AxisTitle_1').textContent).toBe('Sum of Amount');
                expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('FY 2005');
                expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('FY 2008');
                done();
            }, 2000);
        });

        // it('tooltip template => Grand Total', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     let dataLabel: HTMLElement = document.getElementById('PivotView_chart_Series_0_Point_0');
        //     let series: Series = <Series>pivotGridObj.chart.series[0];
        //     let chartArea: HTMLElement = document.getElementById('PivotView_chart_ChartAreaBorder');
        //     let y: number = series.points[0].regions[0].y + parseFloat(chartArea.getAttribute('y')) + (elem.querySelector('.e-pivotchart') as HTMLElement).offsetTop;
        //     let x: number = series.points[0].regions[0].x + parseFloat(chartArea.getAttribute('x')) + (elem.querySelector('.e-pivotchart') as HTMLElement).offsetLeft;
        //     util.triggerMouseEvent(dataLabel, 'mousemove', Math.ceil(x), Math.ceil(y))
        //     setTimeout(() => {
        //         let tooltip: HTMLElement = document.getElementById('PivotView_chart_tooltip');
        //         expect(tooltip != null).toBe(true);
        //         expect(parseFloat(tooltip.style.left) > series.points[0].regions[0].x + parseFloat(chartArea.getAttribute('x')));
        //         expect(tooltip.querySelectorAll('span')[0].textContent.trim()).toBe('Canada');
        //         expect(tooltip.querySelectorAll('span')[1].textContent.trim()).toBe('FY 2005');
        //         expect(tooltip.querySelectorAll('span')[2].textContent.trim()).toBe('$100.00');
        //         expect(tooltip.querySelectorAll('span')[3].textContent.trim()).toBe('Sum');
        //         expect(tooltip.querySelectorAll('span')[4].textContent.trim()).toBe('Country');
        //         expect(tooltip.querySelectorAll('span')[5].textContent.trim()).toBe('Date');
        //         done();
        //     }, 2000);
        // });
        // it('tooltip => FY 2005 * Germany', (done: Function) => {
        //     let dataLabel: HTMLElement = document.getElementById('PivotView_chart_Series_0_Point_2');
        //     let series: Series = <Series>pivotGridObj.chart.series[0];
        //     let chartArea: HTMLElement = document.getElementById('PivotView_chart_ChartAreaBorder');
        //     let y: number = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + (elem.querySelector('.e-chart') as HTMLElement).offsetTop;
        //     let x: number = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + (elem.querySelector('.e-chart') as HTMLElement).offsetLeft;
        //     util.triggerMouseEvent(dataLabel, 'mousemove', Math.ceil(x), Math.ceil(y))
        //     setTimeout(() => {
        //         let tooltip: HTMLElement = document.getElementById('PivotView_chart_tooltip');
        //         expect(tooltip != null).toBe(true);
        //         expect(parseFloat(tooltip.style.left) > series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')));
        //         expect(tooltip.querySelectorAll('tspan')[0].textContent.trim()).toBe('Sum of Amount');
        //         expect(tooltip.querySelectorAll('tspan')[2].textContent.trim()).toBe('$100.00');
        //         expect(tooltip.querySelectorAll('tspan')[5].textContent.trim()).toBe('FY 2005');
        //         expect(tooltip.querySelectorAll('tspan')[8].textContent.trim()).toBe('Germany');
        //         done();
        //     }, 2000);
        // });

        it('chart type changed to stackingcolumn100', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'StackingColumn100';
            setTimeout(() => {
                //  expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('50%');
                done();
            }, 2000);
        });
        it('chart type changed to stackingarea100', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'StackingArea100';
            setTimeout(() => {
                // expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('50%');
                done();
            }, 2000);
        });
        it('chart type changed to column', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'Column';
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('$500.00');
                done();
            }, 2000);
        });

        it('sort descending -> Country', (done: Function) => {
            util.triggerMouseEvent(document.querySelector('.e-chart-grouping-bar .e-rows #Country .e-sort'), 'click');
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('United States:400');
                expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4').textContent).toBe(' + Canada');
                done();
            }, 2000);
        })

        it('remove Date from column', (done: Function) => {
            util.triggerMouseEvent(document.querySelector('.e-chart-grouping-bar .e-columns #Date .e-remove'), 'click');
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('United States:300');
                expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4').textContent).toBe(' + Canada');
                expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('Bike');
                expect(document.getElementById('PivotView_chart_chart_legend_text_2').textContent).toBe('Van');
                done();
            }, 2000);
        })

        it('empty column', (done: Function) => {
            util.triggerMouseEvent(document.querySelector('.e-chart-grouping-bar .e-columns #Product .e-remove'), 'click');
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('United States:1450');
                expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4').textContent).toBe(' + Canada');
                done();
            }, 2000);
        })

        it('remove Country from row', function (done) {
            util.triggerMouseEvent(document.querySelector('.e-chart-grouping-bar .e-rows #Country .e-remove'), 'click');
            setTimeout(function () {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Alabama:250');
                done();
            }, 2000);
        })

        it('empty row', (done: Function) => {
            util.triggerMouseEvent(document.querySelector('.e-chart-grouping-bar .e-rows #State .e-remove'), 'click');
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:4600');
                expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_0').textContent).toBe('Grand Total');
                expect(document.getElementById('PivotView_chart_chart_legend_text_0')).toBe(null);
                done();
            }, 2000);
        })

        // it('tooltip => Grand Total', (done: Function) => {
        //     let dataLabel: HTMLElement = document.getElementById('PivotView_chart_Series_0_Point_0');
        //     let series: Series = <Series>pivotGridObj.chart.series[0];
        //     let chartArea: HTMLElement = document.getElementById('PivotView_chart_ChartAreaBorder');
        //     let y: number = series.points[0].regions[0].y + parseFloat(chartArea.getAttribute('y')) + (elem.querySelector('.e-pivotchart') as HTMLElement).offsetTop;
        //     let x: number = series.points[0].regions[0].x + parseFloat(chartArea.getAttribute('x')) + (elem.querySelector('.e-pivotchart') as HTMLElement).offsetLeft;
        //     util.triggerMouseEvent(dataLabel, 'mousemove', Math.ceil(x), Math.ceil(y))
        //     setTimeout(() => {
        //         let tooltip: HTMLElement = document.getElementById('PivotView_chart_tooltip');
        //         expect(tooltip != null).toBe(true);
        //         expect(parseFloat(tooltip.style.left) > series.points[0].regions[0].x + parseFloat(chartArea.getAttribute('x')));
        //         expect(tooltip.querySelectorAll('tspan')[0].textContent.trim()).toBe('Sum of Amount');
        //         expect(tooltip.querySelectorAll('tspan')[2].textContent.trim()).toBe('$4,600.00');
        //         done();
        //     }, 2000);
        // });

        it('expand all', function (done) {
            pivotGridObj.dataSourceSettings = {
                dataSource: pivot_smalldata as IDataSet[],
                expandAll: true,
                columns: [{ name: 'Date' }, { name: 'Product' }],
                rows: [{ name: 'Country' }, { name: 'State' }],
                formatSettings: [{ name: 'Amount', format: 'C' }],
                values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
            };
            setTimeout(function () {
                done();
            }, 2000);
        });

        it('multi measure => Amount * Quantity', (done: Function) => {
            pivotGridObj.chartSettings.enableMultipleAxis = true;
            setTimeout(function () {
                //  expect(document.getElementById('PivotView_chart_Series_11_Point_0').getAttribute('aria-label')).toBe('United States - Alabama:4');
                //  expect(document.getElementById('PivotView_chart_Series_10_Point_0').getAttribute('aria-label')).toBe('United States - Alabama:250');
                done();
            }, 2000);
        });
        it('perform drill up operation', (done: Function) => {
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0').textContent).toBe(' - United States');
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            let node: HTMLElement = document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0') as HTMLElement;
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            node.dispatchEvent(args);
            setTimeout(function () {
                expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0').textContent).toBe(' + United States');
                expect(document.getElementById('PivotView_chart_Series_11_Point_0').getAttribute('aria-label')).toBe('United States:4');
                expect(document.getElementById('PivotView_chart_Series_10_Point_0').getAttribute('aria-label')).toBe('United States:250');
                done();
            }, 3000);
        });
        it('perform drill down operation', (done: Function) => {
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0').textContent).toBe(' + United States');
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            let node: HTMLElement = document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0') as HTMLElement;
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            node.dispatchEvent(args);
            setTimeout(function () {
                expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0').textContent).toBe(' - United States');
                expect(document.getElementById('PivotView_chart_Series_11_Point_0').getAttribute('aria-label')).toBe('United States - Alabama:4');
                expect(document.getElementById('PivotView_chart_Series_10_Point_0').getAttribute('aria-label')).toBe('United States - Alabama:250');
                done();
            }, 3000);
        });
        it('empty rows', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows = [];
            setTimeout(function () {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:600');
                expect(document.getElementById('PivotView_chart_Series_5_Point_0').getAttribute('aria-label')).toBe('Grand Total:2');
                expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('');
                expect(document.getElementById('PivotView_chart_AxisTitle_1').textContent).toBe('Sum of Amount');
                expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('FY 2005 - Bike | Amount');
                expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('FY 2005 - Van | Quantity');
                done();
            }, 2000);
        });
        it('chart type changed to stackingarea100', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'StackingArea100';
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart1_AxisLabel_1').textContent).toBe('50%');
                done();
            }, 2000);
        });
        it('chart type changed to column', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'Column';
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart1_AxisLabel_1').textContent).toBe('$500.00');
                done();
            }, 2000);
        });

        it('load y axis properties', () => {
            pivotGridObj.setProperties({ chartSettings: { primaryYAxis: { labelFormat: 'C', title: 'Custom title', plotOffset: 30 } } }, true);
            pivotGridObj.pivotChartModule.refreshChart();
        });
        it('load y axis properties-update', () => {
            expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:600');
            expect(document.getElementById('PivotView_chart_Series_5_Point_0').getAttribute('aria-label')).toBe('Grand Total:2');
            expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('');
            expect(document.getElementById('PivotView_chart_AxisTitle_1').getAttribute('aria-label')).toBe('Custom title');
            expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('FY 2005 - Bike | Amount');
            expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('FY 2005 - Van | Quantity');
        });
        it('customize tooltip, legend and zoom properties', () => {
            pivotGridObj.chartSettings = {
                legendSettings: { padding: 20, shapePadding: 15 },
                value: 'Amount',
                chartSeries: { type: 'Column', animation: { enable: false } }
            };
            expect(true).toBeTruthy();
        });
        it('customize tooltip, legend and zoom properties-update', () => {
            expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:600');
            expect(document.getElementById('PivotView_chart_Series_5_Point_0').getAttribute('aria-label')).toBe('Grand Total:2');
            expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('');
            expect(document.getElementById('PivotView_chart_AxisTitle_1').getAttribute('aria-label')).toBe('Custom title');
            expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('FY 2005 - Bike | Amount');
            expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('FY 2005 - Van | Quantity');
        });
        it('display option view as both', (done: Function) => {
            pivotGridObj.displayOption = { view: 'Both' };
            setTimeout(function () {
                expect(true).toBeTruthy();
                done();
            }, 2000);
        });
        it('Set display option view as both, primary as chart', (done: Function) => {
            pivotGridObj.displayOption.primary = 'Chart';
            setTimeout(function () {
                expect(true).toBeTruthy();
                done();
            }, 2000);
        });
        it('Set display option view as both, primary as table', (done: Function) => {
            pivotGridObj.chartSeriesCreated = function (args: ChartSeriesCreatedEventArgs) {
                args.cancel = true;
            },
                pivotGridObj.displayOption.primary = 'Table';
            setTimeout(function () {
                expect(document.querySelectorAll('.e-grid,.e-chart')[0].classList.contains('e-pivotchart')).toBeFalsy();
                done();
            }, 2000);
        });
    });

    describe('Normal - ', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotView', styles: 'height:500px; width:100%' });
        let eventArgs: any;
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 13000;
            setTimeout(() => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, FieldList, PivotChart);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_smalldata as IDataSet[],
                        expandAll: false,
                        columns: [{ name: 'Date' }, { name: 'Product' }],
                        rows: [{ name: 'Country' }, { name: 'State' }],
                        formatSettings: [{ name: 'Amount', format: 'C' }],
                        values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                    },
                    dataBound: dataBound,
                    height: '500px',
                    width: '80%',
                    displayOption: { view: 'Chart' },
                    chartSettings: {
                        enableExport: true,
                        primaryXAxis: { title: 'X axis title', labelIntersectAction: 'Rotate90' },
                        primaryYAxis: { title: 'Y axis title', labelFormat: 'N' },
                        beforePrint: (args: any) => { eventArgs = args; },
                        animationComplete: (args: any) => { eventArgs = args; },
                        legendRender: (args: any) => { eventArgs = args; },
                        textRender: (args: any) => { eventArgs = args; },
                        pointRender: (args: any) => { eventArgs = args; },
                        seriesRender: (args: any) => { eventArgs = args; },
                        chartMouseMove: (args: any) => { eventArgs = args; },
                        chartMouseClick: (args: any) => { eventArgs = args; },
                        pointMove: (args: any) => { eventArgs = args; },
                        pointClick: (args: any) => { eventArgs = args; },
                        chartMouseLeave: (args: any) => { eventArgs = args; },
                        chartMouseDown: (args: any) => { eventArgs = args; },
                        chartMouseUp: (args: any) => { eventArgs = args; },
                        dragComplete: (args: any) => { eventArgs = args; },
                        zoomComplete: (args: any) => { eventArgs = args; },
                        scrollStart: (args: any) => { eventArgs = args; },
                        scrollEnd: (args: any) => { eventArgs = args; },
                        scrollChanged: (args: any) => { eventArgs = args; },
                        tooltipRender: (args: any) => { eventArgs = args; },
                        loaded: (args: any) => { eventArgs = args; },
                        load: (args: any) => { eventArgs = args; },
                        resized: (args: any) => { eventArgs = args; },
                        axisLabelRender: (args: any) => { eventArgs = args; }
                    },
                });
                pivotGridObj.appendTo('#PivotView');
            }, 2000);
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 2000);
        });
        it('Check initial render', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries = {
                type: 'Column', animation: { enable: false }
            };
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Canada:100');
                expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Canada:400');
                expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('France:200');
                expect(document.getElementById('PivotView_chart_Series_3_Point_4').getAttribute('aria-label')).toBe('United States:400');
                expect(document.getElementById('PivotView_chart_Series_4_Point_4')).toBeNull();
                expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4').textContent).toBe(' + United States');
                expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('500');
                expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('X axis title');
                expect(document.getElementById('PivotView_chart_AxisTitle_1').textContent).toBe('Y axis title');
                expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('FY 2005');
                expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('FY 2008');
                done();
            }, 2000);
        });
        it('change width to  800px', (done: Function) => {
            pivotGridObj.width = '800px';
            pivotGridObj.pivotChartModule.loadChart(pivotGridObj, pivotGridObj.chartSettings);
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis')).toBe(null);
                done();
            }, 2000);
        });
        it('change width to 500', (done: Function) => {
            pivotGridObj.width = 500;
            pivotGridObj.pivotChartModule.loadChart(pivotGridObj, pivotGridObj.chartSettings);
            setTimeout(() => {
                //  expect(Math.ceil(Number(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis').getAttribute('width')))).toBe(445);
                done();
            }, 2000);
        });
        it('current measure set to amt(false case)', (done: Function) => {
            pivotGridObj.chartSettings.value = 'Amt';
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Canada:100');
                expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Canada:400');
                expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('France:200');
                expect(document.getElementById('PivotView_chart_Series_3_Point_4').getAttribute('aria-label')).toBe('United States:400');
                done();
            }, 2000);
        });
        it('chart type changed to polar', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'Polar';
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis')).toBe(null);
                done();
            }, 2000);
        });
        it('chart type changed to radar', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'Radar';
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis')).toBe(null);
                // pivotGridObj.pivotChartModule.destroy();
                done();
            }, 2000);
        });
        it('onResize', (done: Function) => {
            (pivotGridObj.pivotChartModule as any).resized({
                chart: pivotGridObj.chart,
                currentSize: { height: 800, width: 800 },
                previousSize: { height: 500, width: 500 },
                name: 'resized'
            } as IResizeEventArgs);
            setTimeout(() => {
                expect(true).toBeTruthy();
                done();
            }, 2000);
        })
        it('onExport', (done: Function) => {
            pivotGridObj.chartExport('JPEG', 'jp');
            setTimeout(() => {
                pivotGridObj.pivotChartModule.destroy();
                expect(pivotGridObj.chart.isDestroyed).toBeTruthy(true);
                done();
            }, 2000);
        })
    });

    describe('ZoomFactor in chart', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:100%; width:100%' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(PivotChart, GroupingBar, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                height: '500',
                width: '25%',
                dataBound: dataBound,
                showFieldList: true,
                showGroupingBar: true,
                displayOption: { view: 'Chart' },
                load: function (args) {
                    args.pivotview.chartSettings.zoomSettings.enableScrollbar = false;
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Find zoomfactor value', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((pivotGridObj.chart as Chart).primaryXAxis.zoomFactor === 1).toBeTruthy();
                done();
            }, 2000);
        });
    });

    describe('Chart in percentage', () => {
        let pivotGridObj: PivotView;
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'height:1000px; width:100%' });
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:100%; width:100%' });
        ele.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(ele.id)) {
                document.body.appendChild(ele);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(PivotChart, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                height: '50%',
                width: '100%',
                dataBound: dataBound,
                showFieldList: true,
                displayOption: { view: 'Chart' },
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 2000);
        });
        it('find height of chart for percentage', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                // expect(pivotGridObj.chart.height === "500").toBeTruthy();
                done();
            }, 2000);
        });
    });

    describe('Chart Events', () => {
        let pivotGridObj: PivotView;
        let loadEvent: string;
        let axisLabelEvent: string;
        let legendRenderEvent: string;
        let seriesRenderEvent: string;
        let loadedEvent: string;
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'height:1000px; width:100%' });
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:100%; width:100%' });
        ele.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(ele.id)) {
                document.body.appendChild(ele);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(PivotChart, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                height: '50%',
                width: '100%',
                dataBound: dataBound,
                showFieldList: true,
                displayOption: { view: 'Chart' },
                chartSettings: {
                    load:(args:ILoadedEventArgs) =>{
                        loadEvent ="Load";
                    },
                    loaded:(args:ILoadedEventArgs) =>{
                        loadedEvent ="Loaded";
                    },
                    axisLabelRender:(args:any)=>{
                        axisLabelEvent="AxisLabel";
                    },
                    legendRender:(args:any)=>{
                        legendRenderEvent="LegendRender";
                    },
                    seriesRender:(args:any)=>{
                        seriesRenderEvent="SeriesRender";
                    }
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 2000);
        });
        it('Chart Events Check', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(loadEvent).toBe("Load");
                expect(loadedEvent).toBe("Loaded");
                expect(axisLabelEvent).toBe("AxisLabel");
                expect(legendRenderEvent).toBe("LegendRender");
                expect(seriesRenderEvent).toBe("SeriesRender");
                done();
            }, 2000);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        //expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});