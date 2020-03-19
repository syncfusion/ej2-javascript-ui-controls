import { PivotEngine, IDataOptions, IDataSet, ICustomProperties } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Date Filtering', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Date Filtering', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            dataSource: pivot_dataset as IDataSet[],
            allowLabelFilter: true,
            allowMemberFilter: true,
            formatSettings: [{ name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
            filterSettings: [{ name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') }],
            rows: [{ name: 'date', caption: 'TimeLine' }],
            columns: [{ name: 'company' }, { name: 'isActive' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [{ name: 'gender', caption: 'Population' }]
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('With date filters at code-behind', () => {
            expect(pivotEngine.pivotValues.length).toBe(29);
            expect(pivotEngine.pivotValues[0].length).toBe(53);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2000/02/16/')).toBeGreaterThanOrEqual(0);
        });
        it('With label filters', () => {
            dataSourceSettings.filterSettings.push({ name: 'company', type: 'Label', condition: 'BeginWith', value1: 'a' });
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With Include filter', () => {
            dataSourceSettings.filterSettings.push({ name: 'isActive', type: 'Include', items: ['true'] });
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(4);
            expect(pivotEngine.pivotValues[0].length).toBe(3);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe(undefined);
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(undefined);
        });
        it('With Exclude filter', () => {
            dataSourceSettings.filterSettings[2].type = 'Exclude';
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With sorting enabled', () => {
            dataSourceSettings.filterSettings.pop();
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'date', order: 'Descending' }];
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With Drilled members', () => {
            dataSourceSettings.drilledMembers = [{ name: 'company', items: ['ACRUEX'] }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With Format Settings', () => {
            dataSourceSettings.formatSettings = [{ name: 'balance', format: 'C' }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Aug 31 2001 20:48:59 GMT+0530 (India Standard Time)');
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Aug 31 2001 20:48:59 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(Equals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'Equals', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(4);
            expect(pivotEngine.pivotValues[0].length).toBe(4);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe(undefined);
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(undefined);
        });
        it('With date filter condition(NotEquals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'DoesNotEquals', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(30);
            expect(pivotEngine.pivotValues[0].length).toBe(157);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(Before)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'Before', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(23);
            expect(pivotEngine.pivotValues[0].length).toBe(118);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(BeforeOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'BeforeOrEqualTo', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(23);
            expect(pivotEngine.pivotValues[0].length).toBe(118);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(After)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'After', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(11);
            expect(pivotEngine.pivotValues[0].length).toBe(43);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCUFARM');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jan 01 2016 13:46:21 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(AfterOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'AfterOrEqualTo', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(11);
            expect(pivotEngine.pivotValues[0].length).toBe(43);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCUFARM');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jan 01 2016 13:46:21 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(Between)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Aug 31 2001 20:48:59 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(NotBetween)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'NotBetween', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(29);
            expect(pivotEngine.pivotValues[0].length).toBe(154);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
        });
        it('Date filter with unavailabe field and member', () => {
            dataSourceSettings.filterSettings[0] = { name: 'test', type: 'Date', condition: 'NotBetween', value1: 'test', value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(30);
            expect(pivotEngine.pivotValues[0].length).toBe(157);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
        });
    });

    describe('Date Filtering without member filtering enabled', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            dataSource: pivot_dataset as IDataSet[],
            allowLabelFilter: true,
            allowMemberFilter: false,
            formatSettings: [{ name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
            filterSettings: [{ name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') }],
            rows: [{ name: 'date', caption: 'TimeLine' }],
            columns: [{ name: 'company' }, { name: 'isActive' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [{ name: 'gender', caption: 'Population' }]
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('With date filters at code-behind', () => {
            expect(pivotEngine.pivotValues.length).toBe(29);
            expect(pivotEngine.pivotValues[0].length).toBe(53);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2000/02/16/')).toBeGreaterThanOrEqual(0);
        });
        it('With label filters', () => {
            dataSourceSettings.filterSettings.push({ name: 'company', type: 'Label', condition: 'BeginWith', value1: 'a' });
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With Include filter', () => {
            dataSourceSettings.filterSettings.push({ name: 'isActive', type: 'Include', items: ['true'] });
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With Exclude filter', () => {
            dataSourceSettings.filterSettings[2].type = 'Exclude';
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With sorting enabled', () => {
            dataSourceSettings.filterSettings.pop();
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'date', order: 'Descending' }];
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With Drilled members', () => {
            dataSourceSettings.drilledMembers = [{ name: 'company', items: ['ACRUEX'] }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect(((pivotEngine.pivotValues[3][0] as IDataSet).dateText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
        });
        it('With Format Settings', () => {
            dataSourceSettings.formatSettings = [{ name: 'balance', format: 'C' }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Aug 31 2001 20:48:59 GMT+0530 (India Standard Time)');
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Aug 31 2001 20:48:59 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(Equals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'Equals', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(4);
            expect(pivotEngine.pivotValues[0].length).toBe(4);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe(undefined);
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(undefined);
        });
        it('With date filter condition(NotEquals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'DoesNotEquals', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(30);
            expect(pivotEngine.pivotValues[0].length).toBe(157);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(Before)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'Before', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(23);
            expect(pivotEngine.pivotValues[0].length).toBe(118);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(BeforeOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'BeforeOrEqualTo', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(23);
            expect(pivotEngine.pivotValues[0].length).toBe(118);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(After)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'After', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(11);
            expect(pivotEngine.pivotValues[0].length).toBe(43);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCUFARM');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jan 01 2016 13:46:21 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(AfterOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'AfterOrEqualTo', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(11);
            expect(pivotEngine.pivotValues[0].length).toBe(43);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCUFARM');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jan 01 2016 13:46:21 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(Between)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Aug 31 2001 20:48:59 GMT+0530 (India Standard Time)');
        });
        it('With date filter condition(NotBetween)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'date', type: 'Date', condition: 'NotBetween', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(29);
            expect(pivotEngine.pivotValues[0].length).toBe(154);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
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