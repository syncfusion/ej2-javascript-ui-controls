import { IDataSet, IAxisSet, IDataOptions } from '../../src/base/engine';
import { pivot_smalldata, pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType, closest } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { ChartSeriesCreatedEventArgs } from '../../src/common/base/interface';
import { IResizeEventArgs, Chart, ChartSeriesType } from '@syncfusion/ej2-charts';
import { PivotChart } from '../../src/pivotchart/index';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { ILoadedEventArgs } from '@syncfusion/ej2-charts';
import { Toolbar } from '../../src/common/popups/toolbar';
import { DrillThrough } from '../../src/pivotview/actions/drill-through';
import { TreeView } from '@syncfusion/ej2-navigations';
import { ChartSettingsModel } from '../../src/pivotview/model/chartsettings-model';

describe('Chart - ', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
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
                        enableSorting: true,
                        columns: [{ name: 'Date' }, { name: 'Product' }],
                        rows: [{ name: 'Country' }, { name: 'State' }],
                        formatSettings: [{ name: 'Amount', format: 'C' }],
                        values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                        allowValueFilter: false,
                        allowLabelFilter: true
                    },
                    dataBound: dataBound,
                    height: 500,
                    showGroupingBar: true,
                    showFieldList: true,
                    displayOption: { view: 'Chart' },
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                    },
                });
                pivotGridObj.appendTo('#PivotView');
            }, 1000);
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Check initial render 1', (done: Function) => {
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Canada:100, FY 2005');
                // expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Bike:97762.19000000002, male');
                // expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('Car:104702.76999999997, female');
                done();
            }, 1000);
        });
        it('Check initial render 2', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('#PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4')[0].textContent).toBe(' + United States');
                expect(document.querySelectorAll('#PivotView_chart1_AxisLabel_5')[0].textContent).toBe('$500.00');
                expect(document.querySelectorAll('#PivotView_chart_AxisTitle_0')[0].textContent).toBe('Country / State');
                expect(document.querySelectorAll('#PivotView_chart_AxisTitle_1')[0].textContent).toBe('Sum of Amount');
                expect(document.querySelectorAll('#PivotView_chart_chart_legend_text_0')[0].textContent).toBe('FY 2005');
                done();
            }, 1000);
        });

        it('chart type changed to stackingcolumn100', () => {
            pivotGridObj.chartSettings.chartSeries.type = 'StackingColumn100';
        });
        it('chart type changed to stackingarea100', () => {
            pivotGridObj.chartSettings.chartSeries.type = 'StackingArea100';
        });
        it('chart type changed to column', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'Column';
            setTimeout(() => {
                expect(document.querySelectorAll('#PivotView_chart1_AxisLabel_5')[0].textContent).toBe('$500.00');
                done();
            }, 1000);
        });

        it('sort descending -> Country', (done: Function) => {
            util.triggerMouseEvent((document.querySelectorAll('.e-sort')[0] as HTMLElement), 'click');
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('United States:400, FY 2005');
                expect(document.querySelectorAll('#PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4')[0].textContent).toBe(' + Canada');
                done();
            }, 1000);
        })

        it('remove Date from column', (done: Function) => {
            util.triggerMouseEvent((document.querySelectorAll('.e-remove')[2] as HTMLElement), 'click');
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('United States:300, Bike');
                expect(document.querySelectorAll('#PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4')[0].textContent).toBe(' + Canada');
                expect(document.querySelectorAll('#PivotView_chart_chart_legend_text_0')[0].textContent).toBe('Bike');
                done();
            }, 1000);
        })

        it('empty column', (done: Function) => {
            util.triggerMouseEvent((document.querySelectorAll('.e-remove')[2] as HTMLElement), 'click');
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('United States:1450, Grand Total');
                expect(document.querySelectorAll('#PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4')[0].textContent).toBe(' + Canada');
                done();
            }, 1000);
        })

        it('remove Country from row', function (done) {
            util.triggerMouseEvent((document.querySelectorAll('.e-remove')[0] as HTMLElement), 'click');
            setTimeout(function () {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Alabama:250, Grand Total');
                done();
            }, 1000);
        })

        it('empty row', (done: Function) => {
            util.triggerMouseEvent((document.querySelectorAll('.e-remove')[0] as HTMLElement), 'click');
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:4600, Grand Total');
                expect(document.querySelectorAll('#PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_0')[0].textContent).toBe('Total Sum of Amount');
                expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('Grand Total');
                done();
            }, 1000);
        })

        it('expand all', function (done) {
            pivotGridObj.dataSourceSettings = {
                dataSource: pivot_smalldata as IDataSet[],
                expandAll: true,
                enableSorting: true,
                allowLabelFilter: true,
                allowValueFilter: true,
                rows: [{ name: 'Country' }, { name: 'State' }],
                columns: [{ name: 'Date' }, { name: 'Product' }],
                values: [{ name: 'Amount' }, { name: 'Quantity' }],
                filters: [],
            };
            setTimeout(function () {
                done();
            }, 1000);
        });

        it('multi measure => Amount * Quantity', () => {
            pivotGridObj.chartSettings.enableMultipleAxis = true;
        });
        it('perform drill up operation', (done: Function) => {
            expect(document.querySelectorAll('#PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0')[0].textContent).toBe(' - United States');
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            let node: HTMLElement = document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0') as HTMLElement;
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            node.dispatchEvent(args);
            setTimeout(function () {
                expect(document.querySelectorAll('#PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0')[0].textContent).toBe(' + United States');
                done();
            }, 3000);
        });
        it('perform drill down operation', (done: Function) => {
            expect(document.querySelectorAll('#PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0')[0].textContent).toBe(' + United States');
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            let node: HTMLElement = document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0') as HTMLElement;
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            node.dispatchEvent(args);
            setTimeout(function () {
                expect(document.querySelectorAll('#PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0')[0].textContent).toBe(' - United States');
                done();
            }, 3000);
        });
        it('empty rows1', () => {
            pivotGridObj.dataSourceSettings.rows = [];
        });
        it('empty rows2', (done: Function) => {
            setTimeout(function () {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:600, FY 2005 - Bike | Amount');
                expect(document.getElementById('PivotView_chart_Series_5_Point_0').getAttribute('aria-label')).toBe('Grand Total:2, FY 2006 - Bike | Quantity');
                expect(document.getElementById('PivotView_chart_AxisTitle_0')).toBeNull();
                done();
            }, 1000);
        });
        it('empty rows3', (done: Function) => {
            setTimeout(function () {
                expect(document.querySelectorAll('#PivotView_chart_AxisTitle_1')[0].textContent).toBe('Sum of Amount');
                expect(document.querySelectorAll('#PivotView_chart_chart_legend_text_0')[0].textContent).toBe('FY 2005 - Bike | Amount');
                expect(document.querySelectorAll('#PivotView_chart_chart_legend_text_3')[0].textContent).toBe('FY 2005 - Van | Quantity');
                done();
            }, 1000);
        });
        it('chart type changed to stackingarea100 1', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'StackingArea100';
            setTimeout(() => {
                expect(document.querySelectorAll('#PivotView_chart1_AxisLabel_1')[0].textContent).toBe('50%');
                done();
            }, 1000);
        });
        it('chart type changed to column 1', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'Column';
            setTimeout(() => {
                expect(document.querySelectorAll('#PivotView_chart1_AxisLabel_1')[0].textContent).toBe('$500.00');
                done();
            }, 1000);
        });
        it('load y axis properties', () => {
            pivotGridObj.setProperties({ chartSettings: { primaryYAxis: { labelFormat: 'C', title: 'Title', plotOffset: 30 } } }, true);
            pivotGridObj.pivotChartModule.refreshChart();
        });
        it('load y axis properties-update', (done: Function) => {
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:600, FY 2005 - Bike | Amount');
                expect(document.getElementById('PivotView_chart_AxisTitle_0')).toBeNull();
                done();
            }, 1000);
        });
        it('load y axis properties-update', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('#PivotView_chart_AxisTitle_2')[0].textContent).toBe('Title');
                expect(document.querySelectorAll('#PivotView_chart_chart_legend_text_0')[0].textContent).toBe('FY 2005 - Bike | Amount');
                expect(document.querySelectorAll('#PivotView_chart_chart_legend_text_3')[0].textContent).toBe('FY 2005 - Van | Quantity');
                done();
            }, 1000);
        });
        it('customize tooltip, legend and zoom properties', () => {
            pivotGridObj.chartSettings = {
                legendSettings: { padding: 20, shapePadding: 15 },
                value: 'Amount',
                chartSeries: { type: 'Column', animation: { enable: false } }
            };
            expect(true).toBeTruthy();
        });
        it('customize tooltip, legend and zoom properties-update', (done: Function) => {
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:600, FY 2005 - Bike | Amount');
                expect(document.getElementById('PivotView_chart_Series_5_Point_0').getAttribute('aria-label')).toBe('Grand Total:2, FY 2006 - Bike | Quantity');
                expect(document.getElementById('PivotView_chart_AxisTitle_0')).toBeNull();
                done();
            }, 1000);
        });
        it('customize tooltip, legend and zoom properties-update', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('#PivotView_chart_AxisTitle_2')[0].textContent).toBe('Title');
                expect(document.querySelectorAll('#PivotView_chart_chart_legend_text_0')[0].textContent).toBe('FY 2005 - Bike | Amount');
                expect(document.querySelectorAll('#PivotView_chart_chart_legend_text_3')[0].textContent).toBe('FY 2005 - Van | Quantity');
                done();
            }, 1000);
        });
        it('display option view as both', (done: Function) => {
            pivotGridObj.displayOption = { view: 'Both' };
            setTimeout(function () {
                expect(true).toBeTruthy();
                done();
            }, 1000);
        });
        it('Set display option view as both, primary as chart', (done: Function) => {
            pivotGridObj.displayOption.primary = 'Chart';
            setTimeout(function () {
                expect(true).toBeTruthy();
                done();
            }, 1000);
        });
        it('Set display option view as both, primary as table', (done: Function) => {
            pivotGridObj.chartSeriesCreated = function (args: ChartSeriesCreatedEventArgs) {
                args.cancel = true;
            },
                pivotGridObj.displayOption.primary = 'Table';
            setTimeout(function () {
                expect(document.querySelectorAll('.e-grid,.e-chart')[0].classList.contains('e-pivotchart')).toBeFalsy();
                done();
            }, 1000);
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
            }, 1000);
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Check initial render 1', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries = {
                type: 'Column', animation: { enable: false }
            };
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Canada:100, FY 2005');
                expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Canada:400, FY 2006');
                expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('France:200, FY 2005');
                expect(document.getElementById('PivotView_chart_Series_3_Point_4').getAttribute('aria-label')).toBe('United States:400, FY 2008');
                expect(document.getElementById('PivotView_chart_Series_4_Point_4')).toBeNull();
                done();
            }, 1000);
        });
        it('Check initial render 2', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('#PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4')[0].textContent).toBe(' + United States');
                expect(document.querySelectorAll('#PivotView_chart1_AxisLabel_5')[0].textContent).toBe('$500.00');
                expect(document.querySelectorAll('#PivotView_chart_AxisTitle_0')[0].textContent).toBe('X axis title');
                expect(document.querySelectorAll('#PivotView_chart_AxisTitle_1')[0].textContent).toBe('Y axis title');
                expect(document.querySelectorAll('#PivotView_chart_chart_legend_text_0')[0].textContent).toBe('FY 2005');
                expect(document.querySelectorAll('#PivotView_chart_chart_legend_text_3')[0].textContent).toBe('FY 2008');
                done();
            }, 1000);
        });
        it('change width to  800px', (done: Function) => {
            pivotGridObj.width = '800px';
            pivotGridObj.pivotChartModule.loadChart(pivotGridObj, pivotGridObj.chartSettings);
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis')).toBe(null);
                done();
            }, 1000);
        });
        it('change width to 500', (done: Function) => {
            pivotGridObj.width = 500;
            pivotGridObj.pivotChartModule.loadChart(pivotGridObj, pivotGridObj.chartSettings);
            setTimeout(() => {
                done();
            }, 1000);
        });
        it('current measure set to amt(false case)', (done: Function) => {
            pivotGridObj.chartSettings.value = 'Amt';
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Canada:100, FY 2005');
                expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Canada:400, FY 2006');
                expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('France:200, FY 2005');
                expect(document.getElementById('PivotView_chart_Series_3_Point_4').getAttribute('aria-label')).toBe('United States:400, FY 2008');
                done();
            }, 1000);
        });
        it('chart type changed to polar', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'Polar';
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis')).toBe(null);
                done();
            }, 1000);
        });
        it('chart type changed to radar', (done: Function) => {
            pivotGridObj.chartSettings.chartSeries.type = 'Radar';
            setTimeout(() => {
                expect(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis')).toBe(null);
                done();
            }, 1000);
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
            }, 1000);
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
            }, 1000);
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
                    load: (args: ILoadedEventArgs) => {
                        loadEvent = "Load";
                    },
                    loaded: (args: ILoadedEventArgs) => {
                        loadedEvent = "Loaded";
                    },
                    axisLabelRender: (args: any) => {
                        axisLabelEvent = "AxisLabel";
                    },
                    legendRender: (args: any) => {
                        legendRenderEvent = "LegendRender";
                    },
                    seriesRender: (args: any) => {
                        seriesRenderEvent = "SeriesRender";
                    }
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
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
            }, 1000);
        });
    });

    describe('Switch to Chart - ', () => {
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
                PivotView.Inject(GroupingBar, FieldList, PivotChart, Toolbar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_smalldata as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        columns: [{ name: 'Date' }, { name: 'Product' }],
                        rows: [{ name: 'Country' }, { name: 'State' }],
                        formatSettings: [{ name: 'Amount', format: 'C' }],
                        values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                        allowValueFilter: false,
                        allowLabelFilter: true
                    },
                    dataBound: dataBound,
                    height: 500,
                    showGroupingBar: true,
                    showFieldList: true,
                    showToolbar: true,
                    toolbar: ['Grid', 'Chart'],
                    displayOption: { view: 'Both' },
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: true, enableScrollOnMultiAxis: true
                    },
                });
                pivotGridObj.appendTo('#PivotView');
            }, 1000);
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Check initial render 1', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues.length).toBe(9);
                done();
            }, 1000);
        });
        it('Switch from grid to chart', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotViewchart_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 100);
        });
        it('Click chart menu', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Click chart menu', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues.length).toBe(9);
                done();
            }, 100);
        });
    });
    describe('Palettes - ', () => {
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
                PivotView.Inject(GroupingBar, FieldList, PivotChart, Toolbar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_smalldata as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        columns: [{ name: 'Date' }, { name: 'Product' }],
                        rows: [{ name: 'Country' }, { name: 'State' }],
                        formatSettings: [{ name: 'Amount', format: 'C' }],
                        values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                        allowValueFilter: false,
                        allowLabelFilter: true
                    },
                    dataBound: dataBound,
                    height: 500,
                    showGroupingBar: true,
                    showFieldList: true,
                    showToolbar: true,
                    toolbar: ['Grid', 'Chart'],
                    displayOption: { view: 'Chart' },
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column' }, enableMultipleAxis: true, palettes: ["#E94649", "#F6B53F", "#6FAAB0", "#C4C24A"]
                    },
                });
                pivotGridObj.appendTo('#PivotView');
            }, 1000);
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Check initial render 1', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues.length).toBe(9);
                done();
            }, 1000);
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

describe('PivotChart Module Code Coverage - 2', () => {
    let pivotGridObj: PivotView;
    let pivotChart: PivotChart;
    let element: HTMLElement;

    beforeAll((done: Function) => {
        element = createElement('div', { id: 'test-pivot' });
        element.style.width = '600px';
        element.style.height = '400px';
        document.body.appendChild(element);

        const dataBound: EmitType<Object> = () => { done(); };
        PivotView.Inject(GroupingBar, FieldList, PivotChart);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                columns: [{ name: 'Date' }],
                rows: [{ name: 'Country' }],
                values: [{ name: 'Amount' }],
                filters: []
            },
            dataBound: dataBound,
            height: 500,
            displayOption: { view: 'Chart' },
            chartSettings: {
                value: 'Amount',
                chartSeries: { type: 'Column' }
            }
        });
        pivotGridObj.appendTo('#test-pivot');
    });

    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        if (element && element.parentElement) {
            remove(element);
        }
    });

    beforeEach((done: Function) => {
        setTimeout(() => {
            done();
        }, 500);
    });

    describe('PivotChart Initialization', () => {
        it('should access pivotChart from parent pivotView', (done: Function) => {
            pivotChart = pivotGridObj.pivotChartModule;
            expect(pivotChart).toBeDefined();
            expect(pivotChart.getModuleName()).toBe('pivotChart');
            expect(pivotChart.parent).toBe(pivotGridObj);
            done();
        });

        it('should create pivot chart instance directly', (done: Function) => {
            const directChart = new PivotChart();
            expect(directChart).toBeDefined();
            expect(directChart.getModuleName()).toBe('pivotChart');
            expect(directChart.parent).toBeUndefined();
            done();
        });

        it('should set parent property in constructor', (done: Function) => {
            const chartWithParent = new PivotChart(pivotGridObj);
            expect(chartWithParent.parent).toBe(pivotGridObj);
            done();
        });
    });

    describe('Chart Height and Width Calculations', () => {
        it('should calculate chart height correctly', (done: Function) => {
            pivotChart = pivotGridObj.pivotChartModule;
            const height = pivotChart.getChartHeight();
            expect(height).toBeDefined();
            expect(typeof height).toBe('string');
            done();
        });

        it('should calculate width from pivotGridObj', (done: Function) => {
            pivotChart = pivotGridObj.pivotChartModule;
            const width = pivotChart.getCalulatedWidth();
            expect(width).toBeGreaterThan(0);
            done();
        });

        it('should return resized chart height', (done: Function) => {
            pivotChart = pivotGridObj.pivotChartModule;
            const height = pivotChart.getResizedChartHeight();
            expect(typeof height).toBe('string');
            done();
        });
    });

    describe('Column Index Utilities', () => {
        it('should identify column total indices correctly', (done: Function) => {
            pivotChart = pivotGridObj.pivotChartModule;
            const pivotValues: IAxisSet[][] = [
                [
                    { axis: 'column', type: 'sum', colIndex: 0, rowSpan: 1 } as any,
                    { axis: 'value' } as any
                ],
                [
                    { axis: 'column', type: 'grand sum', colIndex: 1, rowSpan: -1 } as any,
                    { axis: 'value' } as any
                ]
            ];
            const result = pivotChart.getColumnTotalIndex(pivotValues);
            expect(result[0]).toBe(0);
            done();
        });

        it('should handle various column configurations', (done: Function) => {
            pivotChart = pivotGridObj.pivotChartModule;
            const pivotValues: IAxisSet[][] = [
                [
                    { axis: 'row', type: 'sum', colIndex: 0 } as any,
                    { axis: 'value' } as any
                ]
            ];
            const result = pivotChart.getColumnTotalIndex(pivotValues);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('PivotChart Properties and Methods', () => {
        beforeEach(() => {
            pivotChart = pivotGridObj.pivotChartModule;
        });

        it('should store and update calculated width', (done: Function) => {
            const width = pivotChart.getCalulatedWidth();
            expect(pivotChart.calculatedWidth).toBeGreaterThan(0);
            done();
        });

        it('should manage current measure property', (done: Function) => {
            pivotChart.currentMeasure = 'Amount';
            expect(pivotChart.currentMeasure).toBe('Amount');
            done();
        });

        it('should store engine module reference', (done: Function) => {
            expect(pivotChart.engineModule).toBeDefined();
            done();
        });

        it('should track parent pivot reference', (done: Function) => {
            expect(pivotChart.parent).toBe(pivotGridObj);
            done();
        });

        it('should initialize chart series info', (done: Function) => {
            expect(pivotChart['chartSeriesInfo']).toBeDefined();
            done();
        });

        it('should initialize column group object', (done: Function) => {
            expect(pivotChart['columnGroupObject']).toBeDefined();
            done();
        });

        it('should track selected legend', (done: Function) => {
            pivotChart['selectedLegend'] = 0;
            expect(pivotChart['selectedLegend']).toBe(0);
            done();
        });

        it('should identify accumulation chart types', (done: Function) => {
            const accTypes = pivotChart['accumulationType'];
            expect(accTypes.length).toBeGreaterThan(0);
            done();
        });

        it('should track empty point flag', (done: Function) => {
            pivotChart['accEmptyPoint'] = false;
            expect(pivotChart['accEmptyPoint']).toBe(false);
            done();
        });

        it('should initialize chart initial state', (done: Function) => {
            expect(pivotChart['isChartInitial']).toBe(true);
            done();
        });

        it('should store current column tracking', (done: Function) => {
            pivotChart['currentColumn'] = 'Column1 | Amount';
            expect(pivotChart['currentColumn']).toBe('Column1 | Amount');
            done();
        });

        it('should track pivot index', (done: Function) => {
            pivotChart['pivotIndex'] = { rIndex: 5, cIndex: 10 };
            expect(pivotChart['pivotIndex'].rIndex).toBe(5);
            done();
        });

        it('should track measure position', (done: Function) => {
            pivotChart['measurePos'] = 0;
            expect(pivotChart['measurePos']).toBe(0);
            done();
        });

        it('should manage measure list', (done: Function) => {
            pivotChart['measureList'] = ['Amount', 'Quantity'];
            expect(pivotChart['measureList'].length).toBe(2);
            done();
        });

        it('should store chart element reference', (done: Function) => {
            const chartDiv = createElement('div');
            pivotChart['element'] = chartDiv;
            expect(pivotChart['element']).toBe(chartDiv);
            done();
        });

        it('should handle template function storage', (done: Function) => {
            const templateFn = () => '<div>Test</div>';
            pivotChart['templateFn'] = templateFn;
            expect(pivotChart['templateFn']).toBe(templateFn);
            done();
        });

        it('should manage chart settings', (done: Function) => {
            const settings: ChartSettingsModel = {
                chartSeries: [{ type: 'Column' as ChartSeriesType }] as any
            };
            pivotChart['chartSettings'] = settings;
            expect(pivotChart['chartSettings']).toBe(settings);
            done();
        });

        it('should store persist settings', (done: Function) => {
            const settings: ChartSettingsModel = {
                chartSeries: [{ type: 'Bar' as ChartSeriesType }] as any
            };
            pivotChart['persistSettings'] = settings;
            expect(pivotChart['persistSettings']).toBe(settings);
            done();
        });

        it('should store data source settings', (done: Function) => {
            const settings: IDataOptions = { values: [] } as any;
            pivotChart['dataSourceSettings'] = settings;
            expect(pivotChart['dataSourceSettings']).toBe(settings);
            done();
        });

        it('should initialize header collection', (done: Function) => {
            pivotChart['headerColl'][0] = {
                0: { name: 'Category1', level: 0, text: 'Category1', hasChild: false, isDrilled: false, levelName: 'Category', fieldName: 'Category', rowIndex: 0, colIndex: 0 }
            };
            expect(pivotChart['headerColl'][0][0]).toBeDefined();
            done();
        });

        it('should map measure names bidirectionally', (done: Function) => {
            pivotChart['measuresNames']['Amount'] = 'Amount_Field';
            pivotChart['measuresNames']['Amount_Field'] = 'Amount';
            expect(pivotChart['measuresNames']['Amount']).toBe('Amount_Field');
            done();
        });

        it('should track max level', (done: Function) => {
            pivotChart['maxLevel'] = 3;
            expect(pivotChart['maxLevel']).toBe(3);
            done();
        });

        it('should initialize measure position to -1', (done: Function) => {
            const newChart = new PivotChart();
            expect(newChart['measurePos']).toBe(-1);
            done();
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

describe('Pivot Chart with Empty data', () => {
    let pivotGridObj: PivotView;
    let pivotChart: PivotChart;
    let element: HTMLElement;
    beforeAll((done: Function) => {
        element = createElement('div', { id: 'PivotView' });
        element.style.width = '600px';
        element.style.height = '400px';
        document.body.appendChild(element);
        const dataBound: EmitType<Object> = () => { done(); };
        PivotView.Inject(GroupingBar, FieldList, PivotChart, DrillThrough);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                columns: [],
                rows: [],
                values: [{ name: 'quantity' }, { name: 'balance' }],
                filters: []
            },
            dataBound: dataBound,
            height: 500,
            showGroupingBar: true,
            allowDrillThrough: true,
            showValuesButton: true,
            showFieldList: true,
            displayOption: { view: 'Chart' },
            chartSettings: {
                value: 'quantity',
                chartSeries: { type: 'Column' },
                enableMultipleAxis: true,
                showPointColorByMembers: true
            }
        });
        pivotGridObj.appendTo('#PivotView');
    });
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        if (element && element.parentElement) {
            remove(element);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(() => {
            done();
        }, 500);
    });
    describe('Remove Value Field', () => {
        it('should remove value field when clicking remove icon in grouping bar', (done: Function) => {
            setTimeout(() => {
                const valueBeforeRemove = pivotGridObj.dataSourceSettings.values.length;
                expect(valueBeforeRemove).toBe(2);
                util.triggerMouseEvent((document.querySelectorAll('.e-remove')[2] as HTMLElement), 'click');
                expect(pivotGridObj.dataSourceSettings.values.length).toBeLessThan(valueBeforeRemove);
                done();
            }, 300);
        });
    });
    describe('Update Report and Hide Legends', () => {
        it('should add fields to value axis and hide legends by clicking', (done: Function) => {
            pivotGridObj.dataSourceSettings.values = [{ name: 'quantity' }, { name: 'balance' }];
            pivotGridObj.chartSettings = {
                value: 'balance',
                chartSeries: { type: 'Column' }
            };
            setTimeout(() => {
                let legend: HTMLElement = document.getElementById('PivotView_chart_chart_legend_text_0');
                expect(legend).toBeTruthy();
                util.triggerMouseEvent(legend, 'click');
                done();
            }, 300);
        });
    });
    describe('Update Chart Settings and Show Legends', () => {
        it('should add fields to value axis and show legends by clicking', (done: Function) => {
            setTimeout(() => {
                let legend: HTMLElement = document.getElementById('PivotView_chart_chart_legend_text_0');
                expect(legend).toBeTruthy();
                util.triggerMouseEvent(legend, 'click');
                pivotGridObj.dataSourceSettings.values = [{ name: 'quantity' }];
                pivotGridObj.chartSettings = {
                    chartSeries: { type: 'Pie' }
                };
                done();
            }, 300);
        });
    });
    describe('Remove Value Field for Accumulation Chart', () => {
        let down: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        let up: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        it('Through Field FieldList', (done: Function) => {
            setTimeout(() => {
                (document.querySelector('.e-toggle-field-list') as HTMLElement).click();
                let treeObj: TreeView = pivotGridObj.pivotFieldListModule.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                closest(checkEle[0], 'li').dispatchEvent(down);
                closest(checkEle[0], 'li').dispatchEvent(up);
                (document.querySelector('.e-cancel-btn') as HTMLElement).click()
                done();
            }, 300);
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

describe('Accumulation Chart', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
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
        PivotView.Inject(FieldList, Toolbar, PivotChart, DrillThrough);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                rows: [{ name: 'product' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender' }],
                values: [{ name: 'balance' }],
            },
            displayOption: { view: 'Chart' },
            dataBound: dataBound,
            chartSettings: {
                value: 'Amount', enableExport: true, chartSeries: { type: 'Pie', animation: { enable: false } },
                enableMultipleAxis: true, showPointColorByMembers: true
            },
            allowDrillThrough: true,
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 500);
    });
    it('Expand Pie chart members by clicking series point', (done: Function) => {
        setTimeout(() => {
            let point: HTMLElement = document.getElementById('PivotGrid_chart_Series_0_Point_1');
            expect(point).toBeTruthy();
            util.triggerMouseEvent(point, 'click');
            setTimeout(() => {
                let expandMenu: HTMLElement = document.getElementById('PivotGrid_DrillMenuChart_expand');
                expect(expandMenu).toBeTruthy();
                expandMenu.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
                let drillExpandItem: HTMLElement = document.getElementById('PivotGrid_chartdrillExpand_2');
                expect(drillExpandItem).toBeTruthy();
                drillExpandItem.click();
                done();
            }, 300);
        }, 500);
    });
    it('Collapse Pie chart members by clicking series point', (done: Function) => {
        setTimeout(() => {
            let point: HTMLElement = document.getElementById('PivotGrid_chart_Series_0_Point_1');
            expect(point).toBeTruthy();
            util.triggerMouseEvent(point, 'click');
            setTimeout(() => {
                let collapseMenu: HTMLElement = document.getElementById('PivotGrid_DrillMenuChart_collapse');
                expect(collapseMenu).toBeTruthy();
                collapseMenu.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
                let drillCollapseItem: HTMLElement = document.getElementById('PivotGrid_chartdrillCollapse_2');
                expect(drillCollapseItem).toBeTruthy();
                drillCollapseItem.click();
                done();
            }, 300);
        }, 500);
    });
    it('Opening Drill Through dialog', (done: Function) => {
        setTimeout(() => {
            pivotGridObj.dataSourceSettings.rows = [];
            pivotGridObj.dataSourceSettings.columns = [];
            let point: HTMLElement = document.getElementById('PivotGrid_chart_Series_0_Point_1');
            expect(point).toBeTruthy();
            util.triggerMouseEvent(point, 'click');
            done();
        }, 300);
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
