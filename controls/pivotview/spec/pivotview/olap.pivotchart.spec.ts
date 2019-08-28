import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from '../common.spec';

let url: string = 'https://olap.flexmonster.com/olap/msmdpump.dll';
let catalog: string = 'Adventure Works DW Standard Edition';

describe('- Grid properties - ', () => {
    let originalTimeout: number;
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotView' });
    document.body.appendChild(elem);
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
    beforeAll(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                catalog: catalog,
                cube: 'Adventure Works',
                dataProviderType: 'microsoft analysis services',
                url: url,
                localeIdentifier: 1033,
                rows: [
                    { name: '[Product].[Product Categories]', caption: 'Product' }
                ],
                columns: [
                    { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                    { name: '[Measures]', caption: 'Measures' }
                ],
                values: [
                    { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                ],
                filters: [],
                valueAxis: 'column'
            },
            width: 1000,
            height: 500,
            displayOption: { view: 'Chart' },
            chartSettings: { chartSeries: { type: 'Column', animation: { enable: false } }, enableMultiAxis: false, }
        });
        pivotGridObj.appendTo('#PivotView');
    });
    it('Pivot Chart render testing', (done: Function) => {
        setTimeout(() => {
            expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Accessories:2905');
            expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Accessories:1230');
            expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('Bikes:2155');
            expect(document.getElementById('PivotView_chart_Series_3_Point_2').getAttribute('aria-label')).toBe('Clothing:636');
            expect(document.getElementById('PivotView_chart_Series_0_Point_3')).toBeNull();
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_2').textContent).toBe(' + Clothing');
            expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('5000');
            expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('Product');
            expect(document.getElementById('PivotView_chart_AxisTitle_1').textContent).toBe('Sum of Customer Count');
            expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('Australia');
            expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('Germany');
            done();
        }, 2000);
    });

    it('Measure in row axis', (done: Function) => {
        pivotGridObj.setProperties({
            dataSource: {
                rows: [
                    { name: '[Product].[Product Categories]', caption: 'Product' },
                    { name: '[Measures]', caption: 'Measures' }
                ]
            }
        }, true);
        pivotGridObj.dataSourceSettings.columns = [
            { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' }
        ];
        setTimeout(() => {
            expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Accessories:2905');
            expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Accessories:1230');
            expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('Bikes:2155');
            expect(document.getElementById('PivotView_chart_Series_3_Point_2').getAttribute('aria-label')).toBe('Clothing:636');
            expect(document.getElementById('PivotView_chart_Series_0_Point_3')).toBeNull();
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_2').textContent).toBe(' + Clothing');
            expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('5000');
            expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('Product');
            expect(document.getElementById('PivotView_chart_AxisTitle_1').textContent).toBe('Sum of Customer Count');
            expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('Australia');
            expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('Germany');
            done();
        }, 2000);
    });

    it('NamedSet in row axis', (done: Function) => {
        pivotGridObj.dataSourceSettings.rows = [
            { name: '[Product].[Product Categories]', caption: 'Product' },
            { name: '[Measures]', caption: 'Measures' },
            { name: '[Account].[Accounts]', caption: 'Accounts' }
        ];
        setTimeout(() => {
            expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Accessories - Net Income - Operating Profit:2905');
            expect(document.getElementById('PivotView_chart_Series_0_Point_2').getAttribute('aria-label')).toBe('Accessories - Net Income - Taxes:2905');
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_0').textContent).toBe(' + Operating Profit');
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0').textContent).toBe(' - Net Income');
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_2_Text_0').textContent).toBe(' + Accessories');
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_2').textContent).toBe('Taxes');
            done();
        }, 2000);
    });

    it('Measure in first position', (done: Function) => {
        pivotGridObj.dataSourceSettings.rows = [
            { name: '[Measures]', caption: 'Measures' },
            { name: '[Product].[Product Categories]', caption: 'Product' },
            { name: '[Account].[Accounts]', caption: 'Accounts' }
        ];
        setTimeout(() => {
            expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Accessories - Net Income - Operating Profit:2905');
            expect(document.getElementById('PivotView_chart_Series_0_Point_2').getAttribute('aria-label')).toBe('Accessories - Net Income - Taxes:2905');
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_0').textContent).toBe(' + Operating Profit');
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0').textContent).toBe(' - Net Income');
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_2_Text_0').textContent).toBe(' + Accessories');
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_2').textContent).toBe('Taxes');
            done();
        }, 2000);
    });

    it('Swap column and row', (done: Function) => {
        pivotGridObj.setProperties({
            dataSource: {
                rows: [
                    { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' }
                ]
            }
        }, true);
        pivotGridObj.dataSourceSettings.columns = [
            { name: '[Measures]', caption: 'Measures' },
            { name: '[Product].[Product Categories]', caption: 'Product' },
            { name: '[Account].[Accounts]', caption: 'Accounts' }
        ];
        setTimeout(() => {
            expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Australia:2905');
            expect(document.getElementById('PivotView_chart_Series_0_Point_2').getAttribute('aria-label')).toBe('France:1505');
            expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_0').textContent).toBe(' + Australia');
            expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('Accessories - Net Income - Operating Profit');
            expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('Bikes - Net Income - Operating Profit');
            done();
        }, 2000);
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