import { PivotEngine, IDataOptions, IDataSet, ICustomProperties } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotUtil } from '../../src/base/util';
import { L10n } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Grouping', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Group by date', () => {
        let ds: IDataSet[] = (PivotUtil.getClonedData(pivot_dataset) as IDataSet[]);
        let dataSourceSettings: IDataOptions = {
            dataSource: ds,
            allowLabelFilter: true,
            allowMemberFilter: true,
            formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
            filterSettings: [{ name: 'date_date_group_years', type: 'Include', items: ['1970', '1971', '1972', '1973', '1974', '1975'] }],
            rows: [{ name: 'date', caption: 'TimeLine' }],
            columns: [{ name: 'gender', caption: 'Population' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [{ name: 'product', caption: 'Category' }],
            groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days', 'Hours', 'Minutes', 'Seconds'] }]
        };
        let pivotEngine: PivotEngine = new PivotEngine();
        it('Check with group date at code-behind', () => {
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(9);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('1971');
        });
        it('With Advanced filtering', () => {
            let newDate: Date = PivotUtil.resetTime(new Date());
            dataSourceSettings.filterSettings = [{ name: 'date_date_group_years', type: 'Date', condition: 'Between', value1: new Date(newDate.setFullYear(1970)), value2: new Date(newDate.setFullYear(1975)) }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(9);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('1971');
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'date_date_group_years', order: 'Descending' }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(9);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('1974');
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            expect(pivotEngine.pivotValues.length).toBe(9);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('1971');
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(250);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).toBe('Qtr4');
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.expandAll = false;
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(9);
            expect(pivotEngine.pivotValues[0].length).toBe(10);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('1971');
        });
        it('Date grouping with unavailable field', () => {
            dataSourceSettings.groupSettings = [{ name: 'test', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days', 'Hours', 'Minutes', 'Seconds'] }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(9);
            expect(pivotEngine.pivotValues[0].length).toBe(10);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('1971');
        });
    });
    describe('Group by date - Quarter Year', () => {
        let ds: IDataSet[] = (PivotUtil.getClonedData(pivot_dataset) as IDataSet[]);
        let dataSourceSettings: IDataOptions = {
            dataSource: ds,
            allowLabelFilter: true,
            allowMemberFilter: true,
            formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
            filterSettings: [{ name: 'date_date_group_years', type: 'Include', items: ['1970', '1971', '1972', '1973', '1974', '1975'] }],
            columns: [{ name: 'date', caption: 'TimeLine' }],
            rows: [{ name: 'gender', caption: 'Population' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [{ name: 'product', caption: 'Category' }],
            groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['QuarterYear', 'Months', 'Days'] }]
        };
        let pivotEngine: PivotEngine = new PivotEngine();
        it('Check with group date at code-behind', () => {
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(7);
            expect(pivotEngine.pivotValues[0].length).toBe(331);
        });
        it('With Advanced filtering', () => {
            let newDate: Date = PivotUtil.resetTime(new Date());
            dataSourceSettings.filterSettings = [{ name: 'date_date_group_years', type: 'Date', condition: 'Between', value1: new Date(newDate.setFullYear(1970)), value2: new Date(newDate.setFullYear(1975)) }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(7);
            expect(pivotEngine.pivotValues[0].length).toBe(331);
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'date_date_group_years', order: 'Descending' }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(7);
            expect(pivotEngine.pivotValues[0].length).toBe(331);
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            expect(pivotEngine.pivotValues.length).toBe(7);
            expect(pivotEngine.pivotValues[0].length).toBe(331);
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(7);
            expect(pivotEngine.pivotValues[0].length).toBe(1747);
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.expandAll = false;
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(7);
            expect(pivotEngine.pivotValues[0].length).toBe(496);
        });
    });
    describe('Group by date - Column', () => {
        let ds: IDataSet[] = (PivotUtil.getClonedData(pivot_dataset) as IDataSet[]);
        let dataSourceSettings: IDataOptions = {
            dataSource: ds,
            allowLabelFilter: true,
            allowMemberFilter: true,
            formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
            filterSettings: [{ name: 'date_date_group_years', type: 'Include', items: ['1970', '1971', '1972', '1973', '1974', '1975'] }],
            columns: [{ name: 'date', caption: 'TimeLine' }],
            rows: [{ name: 'gender', caption: 'Population' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [{ name: 'product', caption: 'Category' }],
            groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days', 'Hours', 'Minutes', 'Seconds'] }]
        };
        let pivotEngine: PivotEngine = new PivotEngine();
        it('Check with group date at code-behind', () => {
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(11);
            expect(pivotEngine.pivotValues[0].length).toBe(15);
            expect((pivotEngine.pivotValues[8][0] as IDataSet).formattedText).toBe('female');
        });
        it('With Advanced filtering', () => {
            let newDate: Date = PivotUtil.resetTime(new Date());
            dataSourceSettings.filterSettings = [{ name: 'date_date_group_years', type: 'Date', condition: 'Between', value1: new Date(newDate.setFullYear(1970)), value2: new Date(newDate.setFullYear(1975)) }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(11);
            expect(pivotEngine.pivotValues[0].length).toBe(15);
            expect((pivotEngine.pivotValues[8][0] as IDataSet).formattedText).toBe('female');
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'date_date_group_years', order: 'Descending' }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(11);
            expect(pivotEngine.pivotValues[0].length).toBe(15);
            expect((pivotEngine.pivotValues[8][0] as IDataSet).formattedText).toBe('female');
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            expect(pivotEngine.pivotValues.length).toBe(11);
            expect(pivotEngine.pivotValues[0].length).toBe(15);
            expect((pivotEngine.pivotValues[8][0] as IDataSet).formattedText).toBe('male');
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(11);
            expect(pivotEngine.pivotValues[0].length).toBe(497);
            expect((pivotEngine.pivotValues[8][0] as IDataSet).actualText.toString()).toBe('male');
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.expandAll = false;
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(11);
            expect(pivotEngine.pivotValues[0].length).toBe(22);
            expect((pivotEngine.pivotValues[8][0] as IDataSet).formattedText).toBe('male');
        });
    });
    describe('Range Group by Date', () => {
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            dataSource: ds,
            allowLabelFilter: true,
            formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
            rows: [{ name: 'date', caption: 'TimeLine' }],
            columns: [{ name: 'gender', caption: 'Population' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [{ name: 'product', caption: 'Category' }],
            groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days', 'Hours'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) }]
        };
        let pivotEngine: PivotEngine = new PivotEngine();
        it('Check with range group date at code-behind', () => {
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(35);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('1976');
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'date_date_group_years', order: 'Descending' }];
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(35);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('2005');
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            expect(pivotEngine.pivotValues.length).toBe(35);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('1994');
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: new L10n('pivotview', {
                    Years: 'Years',
                    Quarters: 'Quarters',
                    Months: 'Months',
                    Days: 'Days',
                    Hours: 'Hours',
                    Minutes: 'Minutes',
                    Seconds: 'Seconds',
                    qtr: 'Qtr',
                    null: 'null',
                    undefined: 'undefined',
                    groupOutOfRange: 'Out of Range'
                }, 'en-US')
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(884);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).toBe('Out of Range');
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.expandAll = false;
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(35);
            expect(pivotEngine.pivotValues[0].length).toBe(10);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('1994');
        });
    });
    describe('Range Group by Number', () => {
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            dataSource: ds,
            allowLabelFilter: true,
            formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
            rows: [{ name: 'date', caption: 'TimeLine' }],
            columns: [{ name: 'age' }, { name: 'gender', caption: 'Population' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [{ name: 'product', caption: 'Category' }],
            groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days', 'Hours'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
            { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 }]
        };
        let pivotEngine: PivotEngine = new PivotEngine();
        it('Check with range and interval number at code-behind', () => {
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(36);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('25-29');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('1975');
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'date_date_group_years', order: 'Descending' }];
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(36);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('25-29');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('undefined');
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            expect(pivotEngine.pivotValues.length).toBe(36);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('25-29');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('undefined');
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(885);
            expect(pivotEngine.pivotValues[0].length).toBe(27);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('25-29');
            expect((pivotEngine.pivotValues[4][0] as IDataSet).actualText.toString()).toBe('undefined');
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.expandAll = false;
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(36);
            expect(pivotEngine.pivotValues[0].length).toBe(16);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('25-29');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('undefined');
        });
    });
    describe('Custom group by string', () => {
        let ds: IDataSet[] = (PivotUtil.getClonedData(pivot_dataset) as IDataSet[]);
        let dataSourceSettings: IDataOptions = {
            dataSource: ds,
            allowLabelFilter: true,
            allowMemberFilter: true,
            expandAll: false,
            formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
            filterSettings: [{ name: 'product_custom_group', items: ['Bike'], type: 'Exclude' }],
            rows: [{ name: 'product', caption: 'Category' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            columns: [{ name: 'gender', caption: 'Population' }],
            filters: [{ name: 'age' }, { name: 'date', caption: 'TimeLine' }],
            groupSettings: [{ name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }]
        };
        let pivotEngine: PivotEngine = new PivotEngine();
        it('Check with group date at code-behind', () => {
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('Airways');
        });
        it('With Advanced filtering', () => {
            dataSourceSettings.filterSettings = [{ name: 'product_custom_group', type: 'Label', condition: 'Contains', value1: 'Four' }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(4);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('Four wheelers');
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.filterSettings = [{ name: 'product_custom_group', type: 'Label', condition: 'DoesNotContains', value1: 'Four' }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            dataSourceSettings.sortSettings = [{ name: 'product_custom_group', order: 'Descending' }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('Bike');
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('Airways');
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).toBe('Jet');
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.expandAll = false;
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(10);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('Airways');
        });
        it('Custom grouping with unavailable field', () => {
            dataSourceSettings.groupSettings = [{ name: 'test', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(10);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('Airways');
        });
    });
    describe('Custom group by number', () => {
        let ds: IDataSet[] = (PivotUtil.getClonedData(pivot_dataset) as IDataSet[]);
        let dataSourceSettings: IDataOptions = {
            dataSource: ds,
            allowLabelFilter: true,
            allowMemberFilter: true,
            expandAll: false,
            formatSettings: [{ name: 'age', format: 'C' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
            filterSettings: [{ name: 'age_custom_group', items: ['38', '39'], type: 'Exclude' }],
            rows: [{ name: 'age' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            columns: [{ name: 'gender', caption: 'Population' }],
            filters: [{ name: 'product', caption: 'Category' }, { name: 'date', caption: 'TimeLine' }],
            groupSettings: [{ name: 'age', type: 'Custom', customGroups: [{ groupName: '20-30', items: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'] }] }]
        };
        let pivotEngine: PivotEngine = new PivotEngine();
        it('Check with group date at code-behind', () => {
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(12);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('20-30');
        });
        it('With Advanced filtering', () => {
            dataSourceSettings.filterSettings = [{ name: 'age_custom_group', type: 'Label', condition: 'Contains', value1: '20-30' }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(4);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('20-30');
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.filterSettings = [{ name: 'age_custom_group', type: 'Label', condition: 'LessThan', value1: '35' }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            dataSourceSettings.sortSettings = [{ name: 'age_custom_group', order: 'Descending' }];
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('34');
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(dataSourceSettings.filterSettings.length === 1).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('20-30');
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(23);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).toBe('22');
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.expandAll = false;
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(10);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('20-30');
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