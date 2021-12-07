import { PivotEngine, IDataOptions, IDataSet } from '../../src/base/engine';
import { excel_data, pivot_dataset } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Aggregation', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Basic Aggregations', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            expandAll: false,
            dataSource: ds,
            rows: [{ name: 'state' }],
            columns: [{ name: 'product' }],
            values: [{ name: 'balance' },
            { name: 'quantity', type: 'Count' }], filters: [{ name: 'gender' }]
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('Count', () => {
            expect((pivotEngine.pivotValues[2][2] as IDataSet).value).toBe(8);
            expect((pivotEngine.pivotValues[8][2] as IDataSet).value).toBe(69);
        });
        it('Minimum type', () => {
            dataSourceSettings.values[1].type = 'Min';
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect((pivotEngine.pivotValues[2][2] as IDataSet).value).toBe(11);
            expect((pivotEngine.pivotValues[8][2] as IDataSet).value).toBe(10);
        });
        it('Maximum Type', () => {
            dataSourceSettings.values[1].type = 'Max';
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect((pivotEngine.pivotValues[2][2] as IDataSet).value).toBe(20);
            expect((pivotEngine.pivotValues[8][2] as IDataSet).value).toBe(20);
        });
        it('Average Type', () => {
            dataSourceSettings.values[1].type = 'Avg';
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect((pivotEngine.pivotValues[7][1] as IDataSet).value).toBe(34644.87);
            expect((pivotEngine.pivotValues[7][2] as IDataSet).value).toBe(14.785714285714286);
        });
        it('Summary Type', () => {
            dataSourceSettings.values[1].type = 'Sum';
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect((pivotEngine.pivotValues[2][2] as IDataSet).value).toBe(126);
            expect((pivotEngine.pivotValues[8][2] as IDataSet).value).toBe(1060);
        });
    });
    describe('Advanced Aggregation', () => {
        describe('- Normal', () => {
            let ds: IDataSet[] = excel_data as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                expandAll: false,
                dataSource: ds,
                emptyCellsTextContent: '*',
                rows: [{ name: 'Product' }],
                columns: [{ name: 'Date' }],
                values: [{ name: 'Qty 1', type: 'Product' }, { name: 'Qty 2' }],
                filters: []
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('Product', () => {
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(776);
                expect((pivotEngine.pivotValues[6][19] as IDataSet).value).toBe(7740600000000);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('*');
                expect((pivotEngine.pivotValues[4][11] as IDataSet).formattedText).toBe('*');
            });
            it('DistinctCount type', () => {
                dataSourceSettings.values[0].type = 'DistinctCount';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(2);
                expect((pivotEngine.pivotValues[6][19] as IDataSet).value).toBe(7);
            });
            it('Index type', () => {
                dataSourceSettings.values[0].type = 'Index';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(1);
                expect((pivotEngine.pivotValues[6][19] as IDataSet).value).toBe(1);
            });
            it('% of Grand Totals of total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfGrandTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(0.30701754385964913);
                expect((pivotEngine.pivotValues[6][19] as IDataSet).value).toBe(1);
            });
            it('% of Grand Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(0.30701754385964913);
                expect((pivotEngine.pivotValues[6][19] as IDataSet).value).toBe(1);
            });
            it('% of Grand Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(1);
                expect((pivotEngine.pivotValues[6][19] as IDataSet).value).toBe(1);
            });
            it('% of Parent Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('30.70%');
                expect((pivotEngine.pivotValues[6][19] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('92.38%');
                expect((pivotEngine.pivotValues[6][3] as IDataSet).formattedText).toBe('28.36%');
            });
            it('% of Parent Total type with single level in column type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Date';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[6][3] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total type with single level in row type', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Product';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Qty 2' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }],
                    columns: [],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('7.62%');
                expect((pivotEngine.pivotValues[23][1] as IDataSet).formattedText).toBe('45.65%');
            });
            it('% of Parent Total with multiple level in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Product' }],
                    filters: [],
                    valueAxis: 'row'
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][4] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[29][4] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level(innner level selection) in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Qty 2' }, { name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal', baseField: 'Product' }],
                    columns: [],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[16][1] as IDataSet).formattedText).toBe('100%');
            });
            it('Standard Deviation of population type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'PopulationStDev' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(44.5);
                expect((pivotEngine.pivotValues[6][19] as IDataSet).value).toBe(32.34535858855521);
            });
            it('Sample Standard Deviation type', () => {
                dataSourceSettings.values[0].type = 'SampleStDev';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(62.932503525602726);
                expect((pivotEngine.pivotValues[6][19] as IDataSet).value).toBe(34.307433596816885);
            });
            it('Variance of population type', () => {
                dataSourceSettings.values[0].type = 'PopulationVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(1980.25);
                expect((pivotEngine.pivotValues[6][19] as IDataSet).value).toBe(1046.2222222222222);
            });
            it('Sample Variance type', () => {
                dataSourceSettings.values[0].type = 'SampleVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(3960.5);
                expect((pivotEngine.pivotValues[6][19] as IDataSet).value).toBe(1177);
            });
            it('Running Totals with value(one level) in column type', () => {
                dataSourceSettings.values[0].type = 'RunningTotals';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[6][19] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(multiple level) in column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(one level) in rows type', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    valueAxis: 'row'
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[14][10] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(multiple level) in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    valueAxis: 'row'
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[44][1] as IDataSet).formattedText).toBe('342');
            });
            it('Difference From with value(one level) in column type without using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][19] as IDataSet).formattedText).toBe('-55');
                expect((pivotEngine.pivotValues[6][19] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[6][19] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in rows type without using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].baseField = undefined;
                dataSourceSettings.values[0].baseItem = undefined;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('17');
            });
            it('Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[14][10] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    columns: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[6][19] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[14][10] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('13');
            });
            it('Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[29][1] as IDataSet).formattedText).toBe('13');
            });
            it('Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][9] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[3][13] as IDataSet).formattedText).toBe('-42');
            });
            it('Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-42');
            });
            it('% Of Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('14.13%');
            });
            it('% Of Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[29][1] as IDataSet).formattedText).toBe('14.13%');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: []
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][5] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[3][19] as IDataSet).formattedText).toBe('3.26%');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-45.65%');
            });
        });
        describe('- Without Row GrandTotal', () => {
            let ds: IDataSet[] = excel_data as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                expandAll: false,
                dataSource: ds,
                emptyCellsTextContent: '*',
                rows: [{ name: 'Product' }],
                columns: [{ name: 'Date' }],
                values: [{ name: 'Qty 1', type: 'Product' }, { name: 'Qty 2' }],
                filters: [],
                showRowGrandTotals: false
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('Product', () => {
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(776);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(26250);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('*');
                expect((pivotEngine.pivotValues[4][11] as IDataSet).formattedText).toBe('*');
            });
            it('DistinctCount type', () => {
                dataSourceSettings.values[0].type = 'DistinctCount';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(2);
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(2);
            });
            it('Index type', () => {
                dataSourceSettings.values[0].type = 'Index';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(1);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(1);
            });
            it('% of Grand Totals of total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfGrandTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(0.30701754385964913);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(0.26900584795321636);
            });
            it('% of Grand Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(0.30701754385964913);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(0.26900584795321636);
            });
            it('% of Grand Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(1);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(1);
            });
            it('% of Parent Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('30.70%');
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).formattedText).toBe('26.90%');
            });
            it('% of Parent Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('92.38%');
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][3] as IDataSet).formattedText).toBe('*');
            });
            it('% of Parent Total type with single level in column type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Date';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('100%');
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][3] as IDataSet).formattedText).toBe('*');
            });
            it('% of Parent Total type with single level in row type', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Product';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Qty 2' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }],
                    columns: [],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('7.62%');
                expect((pivotEngine.pivotValues[23][1] as IDataSet).formattedText).toBe('45.65%');
            });
            it('% of Parent Total with multiple level in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Product' }],
                    filters: [],
                    valueAxis: 'row',
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][4] as IDataSet).formattedText).toBe('100%');
                expect(pivotEngine.pivotValues[29]).toBeUndefined;
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level(innner level selection) in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Qty 2' }, { name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal', baseField: 'Product' }],
                    columns: [],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[16][1] as IDataSet).formattedText).toBe('100%');
            });
            it('Standard Deviation of population type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'PopulationStDev' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(44.5);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(8.013876853447538);
            });
            it('Sample Standard Deviation type', () => {
                dataSourceSettings.values[0].type = 'SampleStDev';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(62.932503525602726);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(9.814954576223638);
            });
            it('Variance of population type', () => {
                dataSourceSettings.values[0].type = 'PopulationVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(1980.25);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(64.22222222222221);
            });
            it('Sample Variance type', () => {
                dataSourceSettings.values[0].type = 'SampleVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(3960.5);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(96.33333333333333);
            });
            it('Running Totals with value(one level) in column type', () => {
                dataSourceSettings.values[0].type = 'RunningTotals';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('105');
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(multiple level) in column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(one level) in rows type', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    valueAxis: 'row',
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[11][10] as IDataSet).formattedText).toBe('92');
            });
            it('Running Totals with value(multiple level) in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    valueAxis: 'row',
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[41][1] as IDataSet).formattedText).toBe('42');
            });
            it('Difference From with value(one level) in column type without using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][19] as IDataSet).formattedText).toBe('-55');
                expect((pivotEngine.pivotValues[5][19] as IDataSet).formattedText).toBe('-13');
            });
            it('Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[5][19] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in rows type without using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].baseField = undefined;
                dataSourceSettings.values[0].baseItem = undefined;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('25');
            });
            it('Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[11][10] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    columns: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[5][19] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[11][10] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('-45.65%');
            });
            it('Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[10][1] as IDataSet).formattedText).toBe('8');
            });
            it('Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('8');
            });
            it('Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][9] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[3][13] as IDataSet).formattedText).toBe('-42');
            });
            it('Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-42');
            });
            it('% Of Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[10][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showRowGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][5] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[3][19] as IDataSet).formattedText).toBe('3.26%');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-45.65%');
            });
        });
        describe('- Without Row GrandTotal and SubTotals', () => {
            let ds: IDataSet[] = excel_data as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                expandAll: false,
                dataSource: ds,
                emptyCellsTextContent: '*',
                rows: [{ name: 'Product' }],
                columns: [{ name: 'Date' }],
                values: [{ name: 'Qty 1', type: 'Product' }, { name: 'Qty 2' }],
                filters: [],
                showRowGrandTotals: false,
                showRowSubTotals: false
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('Product', () => {
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(776);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(26250);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('*');
                expect((pivotEngine.pivotValues[4][11] as IDataSet).formattedText).toBe('*');
            });
            it('DistinctCount type', () => {
                dataSourceSettings.values[0].type = 'DistinctCount';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(2);
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(2);
            });
            it('Index type', () => {
                dataSourceSettings.values[0].type = 'Index';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(1);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(1);
            });
            it('% of Grand Totals of total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfGrandTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(0.30701754385964913);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(0.26900584795321636);
            });
            it('% of Grand Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(0.30701754385964913);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(0.26900584795321636);
            });
            it('% of Grand Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(1);
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(1);
            });
            it('% of Parent Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('30.70%');
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][19] as IDataSet).formattedText).toBe('26.90%');
            });
            it('% of Parent Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('92.38%');
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][3] as IDataSet).formattedText).toBe('*');
            });
            it('% of Parent Total type with single level in column type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Date';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(21);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('100%');
                expect(pivotEngine.pivotValues[6]).toBeUndefined;
                expect((pivotEngine.pivotValues[5][3] as IDataSet).formattedText).toBe('*');
            });
            it('% of Parent Total type with single level in row type', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Product';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Qty 2' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }],
                    columns: [],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('7.62%');
                expect((pivotEngine.pivotValues[23][1] as IDataSet).formattedText).toBe('45.65%');
            });
            it('% of Parent Total with multiple level in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Product' }],
                    filters: [],
                    valueAxis: 'row',
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][4] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level(innner level selection) in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Qty 2' }, { name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal', baseField: 'Product' }],
                    columns: [],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[16][1] as IDataSet).formattedText).toBe('100%');
            });
            it('Standard Deviation of population type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'PopulationStDev' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(44.5);
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(8.013876853447538);
            });
            it('Sample Standard Deviation type', () => {
                dataSourceSettings.values[0].type = 'SampleStDev';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(62.932503525602726);
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(9.814954576223638);
            });
            it('Variance of population type', () => {
                dataSourceSettings.values[0].type = 'PopulationVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(1980.25);
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(64.22222222222221);
            });
            it('Sample Variance type', () => {
                dataSourceSettings.values[0].type = 'SampleVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).value).toBe(3960.5);
                expect((pivotEngine.pivotValues[5][19] as IDataSet).value).toBe(96.33333333333333);
            });
            it('Running Totals with value(one level) in column type', () => {
                dataSourceSettings.values[0].type = 'RunningTotals';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[5][19] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(multiple level) in column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('');
            });
            it('Running Totals with value(one level) in rows type', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    valueAxis: 'row',
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[11][10] as IDataSet).formattedText).toBe('92');
            });
            it('Running Totals with value(multiple level) in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    valueAxis: 'row',
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('97');
                expect((pivotEngine.pivotValues[33][1] as IDataSet).formattedText).toBe('42');
            });
            it('Difference From with value(one level) in column type without using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][19] as IDataSet).formattedText).toBe('-55');
                expect((pivotEngine.pivotValues[5][19] as IDataSet).formattedText).toBe('-13');
            });
            it('Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[5][19] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in rows type without using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].baseField = undefined;
                dataSourceSettings.values[0].baseItem = undefined;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('25');
            });
            it('Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[11][10] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('20');
            });
            it('% Of Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    columns: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][19] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[5][19] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][10] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[11][10] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('20');
            });
            it('Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[10][1] as IDataSet).formattedText).toBe('8');
            });
            it('Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('8');
            });
            it('Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][9] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[3][13] as IDataSet).formattedText).toBe('-42');
            });
            it('Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-42');
            });
            it('% Of Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[10][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showRowGrandTotals: false,
                    showRowSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][5] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[3][19] as IDataSet).formattedText).toBe('3.26%');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-45.65%');
            });
        });
        describe('- Without Column GrandTotal', () => {
            let ds: IDataSet[] = excel_data as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                expandAll: false,
                dataSource: ds,
                emptyCellsTextContent: '*',
                rows: [{ name: 'Product' }],
                columns: [{ name: 'Date' }],
                values: [{ name: 'Qty 1', type: 'Product' }, { name: 'Qty 2' }],
                filters: [],
                showColumnGrandTotals: false
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('Product', () => {
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(8);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(8);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('*');
                expect((pivotEngine.pivotValues[4][11] as IDataSet).formattedText).toBe('*');
            });
            it('DistinctCount type', () => {
                dataSourceSettings.values[0].type = 'DistinctCount';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(1);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(1);
            });
            it('Index type', () => {
                dataSourceSettings.values[0].type = 'Index';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(3.257142857142857);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(1);
            });
            it('% of Grand Totals of total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfGrandTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(0.023391812865497075);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(0.023391812865497075);
            });
            it('% of Grand Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(1);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(1);
            });
            it('% of Grand Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(0.0761904761904762);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(0.023391812865497075);
            });
            it('% of Parent Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[6][17] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('92.38%');
                expect((pivotEngine.pivotValues[6][3] as IDataSet).formattedText).toBe('28.36%');
            });
            it('% of Parent Total type with single level in column type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Date';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[6][3] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total type with single level in row type', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Product';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Qty 2' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }],
                    columns: [],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('7.62%');
                expect((pivotEngine.pivotValues[23][1] as IDataSet).formattedText).toBe('45.65%');
            });
            it('% of Parent Total with multiple level in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Product' }],
                    filters: [],
                    valueAxis: 'row',
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][4] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[29][4] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level(innner level selection) in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Qty 2' }, { name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal', baseField: 'Product' }],
                    columns: [],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[16][1] as IDataSet).formattedText).toBe('100%');
            });
            it('Standard Deviation of population type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'PopulationStDev' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBeNaN();
            });
            it('Sample Standard Deviation type', () => {
                dataSourceSettings.values[0].type = 'SampleStDev';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBeNaN();
            });
            it('Variance of population type', () => {
                dataSourceSettings.values[0].type = 'PopulationVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBeNaN();
            });
            it('Sample Variance type', () => {
                dataSourceSettings.values[0].type = 'SampleVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBeNaN();
            });
            it('Running Totals with value(one level) in column type', () => {
                dataSourceSettings.values[0].type = 'RunningTotals';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[6][17] as IDataSet).formattedText).toBe('8');
            });
            it('Running Totals with value(multiple level) in column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(one level) in rows type', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    valueAxis: 'row',
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[14][9] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(multiple level) in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    valueAxis: 'row',
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[44][1] as IDataSet).formattedText).toBe('342');
            });
            it('Difference From with value(one level) in column type without using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][17] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[6][17] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[6][17] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in rows type without using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].baseField = undefined;
                dataSourceSettings.values[0].baseItem = undefined;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('17');
            });
            it('Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[14][9] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    columns: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[6][17] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('');
                expect((pivotEngine.pivotValues[14][9] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('13');
            });
            it('Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[29][1] as IDataSet).formattedText).toBe('13');
            });
            it('Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][9] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[3][13] as IDataSet).formattedText).toBe('-42');
            });
            it('Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-42');
            });
            it('% Of Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('14.13%');
            });
            it('% Of Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[29][1] as IDataSet).formattedText).toBe('14.13%');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showColumnGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][5] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[3][19] as IDataSet).formattedText).toBe('3.26%');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-45.65%');
            });
        });
        describe('- Without Column GrandTotal and SubTotals', () => {
            let ds: IDataSet[] = excel_data as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                expandAll: false,
                dataSource: ds,
                emptyCellsTextContent: '*',
                rows: [{ name: 'Product' }],
                columns: [{ name: 'Date' }],
                values: [{ name: 'Qty 1', type: 'Product' }, { name: 'Qty 2' }],
                filters: [],
                showColumnGrandTotals: false,
                showColumnSubTotals: false
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('Product', () => {
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(8);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(8);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('*');
                expect((pivotEngine.pivotValues[4][11] as IDataSet).formattedText).toBe('*');
            });
            it('DistinctCount type', () => {
                dataSourceSettings.values[0].type = 'DistinctCount';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(1);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(1);
            });
            it('Index type', () => {
                dataSourceSettings.values[0].type = 'Index';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(3.257142857142857);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(1);
            });
            it('% of Grand Totals of total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfGrandTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(0.023391812865497075);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(0.023391812865497075);
            });
            it('% of Grand Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(1);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(1);
            });
            it('% of Grand Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(0.0761904761904762);
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBe(0.023391812865497075);
            });
            it('% of Parent Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[6][17] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('92.38%');
                expect((pivotEngine.pivotValues[6][3] as IDataSet).formattedText).toBe('28.36%');
            });
            it('% of Parent Total type with single level in column type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Date';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[6][3] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total type with single level in row type', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Product';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Qty 2' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }],
                    columns: [],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('7.62%');
                expect((pivotEngine.pivotValues[23][1] as IDataSet).formattedText).toBe('45.65%');
            });
            it('% of Parent Total with multiple level in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Product' }],
                    filters: [],
                    valueAxis: 'row',
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][4] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[29][4] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level(innner level selection) in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Qty 2' }, { name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal', baseField: 'Product' }],
                    columns: [],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[16][1] as IDataSet).formattedText).toBe('100%');
            });
            it('Standard Deviation of population type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'PopulationStDev' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBeNaN();
            });
            it('Sample Standard Deviation type', () => {
                dataSourceSettings.values[0].type = 'SampleStDev';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBeNaN();
            });
            it('Variance of population type', () => {
                dataSourceSettings.values[0].type = 'PopulationVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBeNaN();
            });
            it('Sample Variance type', () => {
                dataSourceSettings.values[0].type = 'SampleVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[6][17] as IDataSet).value).toBeNaN();
            });
            it('Running Totals with value(one level) in column type', () => {
                dataSourceSettings.values[0].type = 'RunningTotals';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[6][17] as IDataSet).formattedText).toBe('8');
            });
            it('Running Totals with value(multiple level) in column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(one level) in rows type', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    valueAxis: 'row',
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[14][9] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(multiple level) in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    valueAxis: 'row',
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[44][1] as IDataSet).formattedText).toBe('342');
            });
            it('Difference From with value(one level) in column type without using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][17] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[6][17] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[6][17] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in rows type without using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].baseField = undefined;
                dataSourceSettings.values[0].baseItem = undefined;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('17');
            });
            it('Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[14][9] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    columns: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[6][17] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[14][9] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('13');
            });
            it('Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[29][1] as IDataSet).formattedText).toBe('13');
            });
            it('Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[3][13] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][4] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('14.13%');
            });
            it('% Of Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[29][1] as IDataSet).formattedText).toBe('14.13%');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showColumnGrandTotals: false,
                    showColumnSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-20%');
                expect((pivotEngine.pivotValues[3][17] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][4] as IDataSet).formattedText).toBe('-20%');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('');
            });
        });
        describe('- Without Row and Column GrandTotals', () => {
            let ds: IDataSet[] = excel_data as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                expandAll: false,
                dataSource: ds,
                emptyCellsTextContent: '*',
                rows: [{ name: 'Product' }],
                columns: [{ name: 'Date' }],
                values: [{ name: 'Qty 1', type: 'Product' }, { name: 'Qty 2' }],
                filters: [],
                showGrandTotals: false
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('Product', () => {
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(8);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(42);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('*');
                expect((pivotEngine.pivotValues[4][11] as IDataSet).formattedText).toBe('*');
            });
            it('DistinctCount type', () => {
                dataSourceSettings.values[0].type = 'DistinctCount';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(1);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(1);
            });
            it('Index type', () => {
                dataSourceSettings.values[0].type = 'Index';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(3.257142857142857);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(3.717391304347826);
            });
            it('% of Grand Totals of total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfGrandTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(0.023391812865497075);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(0.12280701754385964);
            });
            it('% of Grand Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(1);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(1);
            });
            it('% of Grand Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(0.0761904761904762);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(0.45652173913043476);
            });
            it('% of Parent Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[5][9] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('92.38%');
                expect((pivotEngine.pivotValues[5][9] as IDataSet).formattedText).toBe('45.65%');
            });
            it('% of Parent Total type with single level in column type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Date';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[5][9] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total type with single level in row type', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Product';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Qty 2' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }],
                    columns: [],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('7.62%');
                expect((pivotEngine.pivotValues[23][1] as IDataSet).formattedText).toBe('45.65%');
            });
            it('% of Parent Total with multiple level in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Product' }],
                    filters: [],
                    valueAxis: 'row',
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][4] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level(innner level selection) in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Qty 2' }, { name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal', baseField: 'Product' }],
                    columns: [],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[16][1] as IDataSet).formattedText).toBe('100%');
            });
            it('Standard Deviation of population type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'PopulationStDev' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[5][17] as IDataSet).value).toBe(0);
            });
            it('Sample Standard Deviation type', () => {
                dataSourceSettings.values[0].type = 'SampleStDev';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[5][17] as IDataSet).value).toBe(0);
            });
            it('Variance of population type', () => {
                dataSourceSettings.values[0].type = 'PopulationVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[5][17] as IDataSet).value).toBe(0);
            });
            it('Sample Variance type', () => {
                dataSourceSettings.values[0].type = 'SampleVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[5][17] as IDataSet).value).toBe(0);
            });
            it('Running Totals with value(one level) in column type', () => {
                dataSourceSettings.values[0].type = 'RunningTotals';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[5][17] as IDataSet).formattedText).toBe('8');
            });
            it('Running Totals with value(multiple level) in column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('342');
            });
            it('Running Totals with value(one level) in rows type', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    valueAxis: 'row',
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[11][9] as IDataSet).formattedText).toBe('92');
            });
            it('Running Totals with value(multiple level) in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    valueAxis: 'row',
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[41][1] as IDataSet).formattedText).toBe('42');
            });
            it('Difference From with value(one level) in column type without using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][17] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[5][17] as IDataSet).formattedText).toBe('-8');
            });
            it('Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[5][17] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in rows type without using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].baseField = undefined;
                dataSourceSettings.values[0].baseItem = undefined;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('25');
            });
            it('Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[11][9] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    columns: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('');
                expect((pivotEngine.pivotValues[5][17] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][4] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[11][9] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[1][1] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[9][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('8');
            });
            it('Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][9] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[3][13] as IDataSet).formattedText).toBe('-42');
            });
            it('Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('13');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-42');
            });
            it('% Of Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[10][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showGrandTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][5] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[3][19] as IDataSet).formattedText).toBe('3.26%');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('14.13%');
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-45.65%');
            });
        });
        describe('- Without Row and Column GrandTotals and SubTotals', () => {
            let ds: IDataSet[] = excel_data as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                expandAll: false,
                dataSource: ds,
                emptyCellsTextContent: '*',
                rows: [{ name: 'Product' }],
                columns: [{ name: 'Date' }],
                values: [{ name: 'Qty 1', type: 'Product' }, { name: 'Qty 2' }],
                filters: [],
                showGrandTotals: false,
                showSubTotals: false
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('Product', () => {
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(8);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(42);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('*');
                expect((pivotEngine.pivotValues[4][11] as IDataSet).formattedText).toBe('*');
            });
            it('DistinctCount type', () => {
                dataSourceSettings.values[0].type = 'DistinctCount';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(1);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(1);
            });
            it('Index type', () => {
                dataSourceSettings.values[0].type = 'Index';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(3.257142857142857);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(3.717391304347826);
            });
            it('% of Grand Totals of total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfGrandTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(0.023391812865497075);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(0.12280701754385964);
            });
            it('% of Grand Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(1);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(1);
            });
            it('% of Grand Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBe(0.0761904761904762);
                expect((pivotEngine.pivotValues[5][9] as IDataSet).value).toBe(0.45652173913043476);
            });
            it('% of Parent Row Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentRowTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[5][9] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Column Total type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentColumnTotal';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('92.38%');
                expect((pivotEngine.pivotValues[5][9] as IDataSet).formattedText).toBe('45.65%');
            });
            it('% of Parent Total type with single level in column type', () => {
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Date';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[5][9] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total type with single level in row type', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
                dataSourceSettings.values[0].baseField = 'Product';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Qty 2' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }],
                    columns: [],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('92.38%');
                expect((pivotEngine.pivotValues[23][1] as IDataSet).formattedText).toBe('45.65%');
            });
            it('% of Parent Total with multiple level in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Product' }],
                    filters: [],
                    valueAxis: 'row',
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][4] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('100%');
            });
            it('% of Parent Total with multiple level(innner level selection) in Column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Qty 2' }, { name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfParentTotal', baseField: 'Product' }],
                    columns: [],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('100%');
                expect((pivotEngine.pivotValues[16][1] as IDataSet).formattedText).toBe('100%');
            });
            it('Standard Deviation of population type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'PopulationStDev' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[5][17] as IDataSet).value).toBe(0);
            });
            it('Sample Standard Deviation type', () => {
                dataSourceSettings.values[0].type = 'SampleStDev';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[5][17] as IDataSet).value).toBe(0);
            });
            it('Variance of population type', () => {
                dataSourceSettings.values[0].type = 'PopulationVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[5][17] as IDataSet).value).toBe(0);
            });
            it('Sample Variance type', () => {
                dataSourceSettings.values[0].type = 'SampleVar';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).value).toBeNaN();
                expect((pivotEngine.pivotValues[5][17] as IDataSet).value).toBe(0);
            });
            it('Running Totals with value(one level) in column type', () => {
                dataSourceSettings.values[0].type = 'RunningTotals';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[5][17] as IDataSet).formattedText).toBe('8');
            });
            it('Running Totals with value(multiple level) in column type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('92');
            });
            it('Running Totals with value(one level) in rows type', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    valueAxis: 'row',
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('105');
                expect((pivotEngine.pivotValues[11][9] as IDataSet).formattedText).toBe('92');
            });
            it('Running Totals with value(multiple level) in row type', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'RunningTotals' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    valueAxis: 'row',
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[4][1] as IDataSet).formattedText).toBe('97');
                expect((pivotEngine.pivotValues[33][1] as IDataSet).formattedText).toBe('42');
            });
            it('Difference From with value(one level) in column type without using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom' }, { name: 'Qty 2' }],
                    columns: [{ name: 'Date' }],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][17] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[5][17] as IDataSet).formattedText).toBe('-8');
            });
            it('Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[5][17] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in rows type without using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.values[0].baseField = undefined;
                dataSourceSettings.values[0].baseItem = undefined;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-8');
                expect((pivotEngine.pivotValues[11][1] as IDataSet).formattedText).toBe('25');
            });
            it('Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.values[0].baseField = 'Product';
                dataSourceSettings.values[0].baseItem = 'Staplers';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][9] as IDataSet).formattedText).toBe('8');
                expect((pivotEngine.pivotValues[11][9] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[6][1] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[14][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[13][1] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[33][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    rows: [{ name: 'Product' }],
                    columns: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][17] as IDataSet).formattedText).toBe('');
                expect((pivotEngine.pivotValues[5][17] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][4] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[11][9] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected row member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    rows: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    columns: [],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[6][1] as IDataSet).formattedText).toBe('-20%');
                expect((pivotEngine.pivotValues[5][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected row member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[13][1] as IDataSet).formattedText).toBe('-20%');
                expect((pivotEngine.pivotValues[33][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[9][1] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-25');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('8');
            });
            it('Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'DifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[3][13] as IDataSet).formattedText).toBe('');
            });
            it('Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][4] as IDataSet).formattedText).toBe('-5');
                expect((pivotEngine.pivotValues[3][10] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: false,
                    dataSource: ds,
                    columns: [{ name: 'Product' }],
                    rows: [{ name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[10][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(one level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('-100%');
                expect((pivotEngine.pivotValues[26][1] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(mulitple level) in column type using selected column member', () => {
                dataSourceSettings = {
                    expandAll: true,
                    dataSource: ds,
                    columns: [{ name: 'Product' }, { name: 'Date' }],
                    values: [{ name: 'Qty 1', type: 'PercentageOfDifferenceFrom', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
                    rows: [],
                    filters: [],
                    showGrandTotals: false,
                    showSubTotals: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][7] as IDataSet).formattedText).toBe('-20%');
                expect((pivotEngine.pivotValues[3][19] as IDataSet).formattedText).toBe('');
            });
            it('% Of Difference From with value(multiple level) in rows type using selected column member', () => {
                dataSourceSettings.valueAxis = 'row';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][4] as IDataSet).formattedText).toBe('-20%');
                expect((pivotEngine.pivotValues[3][10] as IDataSet).formattedText).toBe('');
            });
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});