import { PivotEngine, IDataOptions, IDataSet, ICustomProperties } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Label Filtering', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Label Filtering', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            dataSource: pivot_dataset as IDataSet[],
            allowLabelFilter: true,
            allowMemberFilter: true,
            filterSettings: [{ name: 'company', type: 'Label', condition: 'Contains', value1: 'z' }],
            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
            columns: [{ name: 'company' }, { name: 'isActive' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [{ name: 'gender', caption: 'Population' }]
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('With single label filters', () => {
            expect(pivotEngine.pivotValues.length).toBe(10);
            expect(pivotEngine.pivotValues[0].length).toBe(89);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Bike');
        });
        it('With two label filters', () => {
            dataSourceSettings.filterSettings.push({ name: 'product', type: 'Label', condition: 'DoesNotContains', value1: 'i' });
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(67);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Include filter', () => {
            dataSourceSettings.filterSettings.push({ name: 'eyeColor', type: 'Include', items: ['blue'] });
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(19);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('PULZE');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Exclude filter', () => {
            dataSourceSettings.filterSettings[2].type = 'Exclude';
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(51);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'product', order: 'Descending' }];
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(51);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
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
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(51);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
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
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(16);
            expect(pivotEngine.pivotValues[0].length).toBe(99);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Drilled members', () => {
            dataSourceSettings.drilledMembers = [{ name: 'product', items: ['Bike', 'Van'] }, { name: 'company', items: ['BIZMATIC'] }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(14);
            expect(pivotEngine.pivotValues[0].length).toBe(97);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Format Settings', () => {
            dataSourceSettings.formatSettings = [{ name: 'balance', format: 'C' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(14);
            expect(pivotEngine.pivotValues[0].length).toBe(97);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(14);
            expect(pivotEngine.pivotValues[0].length).toBe(145);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With label filter condition(Equals and NotEquals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'Equals', value1: 'BIZMATIC' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'DoesNotEquals', value1: 'bike' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(6);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
        });
        it('With label filter condition(BeginWith and DoesNotBeginWith)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'BeginWith', value1: 'BIZMATIC' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'DoesNotBeginWith', value1: 'bike' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(6);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
        });
        it('With label filter condition(EndsWith and DoesNotEndsWith)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'EndsWith', value1: 'BIZMATIC' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'DoesNotEndsWith', value1: 'bike' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(6);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
        });
        it('With label filter condition(GreaterThan and GreaterThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'GreaterThan', value1: 'z' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'GreaterThanOrEqualTo', value1: 'bike' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(14);
            expect(pivotEngine.pivotValues[0].length).toBe(106);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ZAGGLE');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
        });
        it('With label filter condition(LessThan and LessThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'LessThan', value1: 'b' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'LessThanOrEqualTo', value1: 'bike' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(22);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('AQUACINE');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Bike');
        });
        it('With label filter condition(Between and NotBetween)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'Between', value1: 'a', value2: 'c' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'NotBetween', value1: 'a', value2: 'c' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(17);
            expect(pivotEngine.pivotValues[0].length).toBe(169);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
        });
        it('Label filter with unavialble field and member', () => {
            dataSourceSettings.filterSettings[0] = { name: 'test', type: 'Label', condition: 'Between', value1: 'a', value2: 'c' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'NotBetween', value1: 'test', value2: 'c' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(18);
            expect(pivotEngine.pivotValues[0].length).toBe(1747);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
        });
    });

    describe('Label Filtering without member filtering enabled', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            dataSource: pivot_dataset as IDataSet[],
            allowLabelFilter: true,
            allowMemberFilter: false,
            filterSettings: [{ name: 'company', type: 'Label', condition: 'Contains', value1: 'z' }],
            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
            columns: [{ name: 'company' }, { name: 'isActive' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [{ name: 'gender', caption: 'Population' }]
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('With single label filters', () => {
            expect(pivotEngine.pivotValues.length).toBe(10);
            expect(pivotEngine.pivotValues[0].length).toBe(89);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Bike');
        });
        it('With two label filters', () => {
            dataSourceSettings.filterSettings.push({ name: 'product', type: 'Label', condition: 'DoesNotContains', value1: 'i' });
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(67);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Include filter', () => {
            dataSourceSettings.filterSettings.push({ name: 'eyeColor', type: 'Include', items: ['blue'] });
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(67);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Exclude filter', () => {
            dataSourceSettings.filterSettings[2].type = 'Exclude';
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(67);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'product', order: 'Descending' }];
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(67);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
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
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(8);
            expect(pivotEngine.pivotValues[0].length).toBe(67);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
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
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(20);
            expect(pivotEngine.pivotValues[0].length).toBe(131);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Drilled members', () => {
            dataSourceSettings.drilledMembers = [{ name: 'product', items: ['Bike', 'Van'] }, { name: 'company', items: ['BIZMATIC'] }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(17);
            expect(pivotEngine.pivotValues[0].length).toBe(129);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Format Settings', () => {
            dataSourceSettings.formatSettings = [{ name: 'balance', format: 'C' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(17);
            expect(pivotEngine.pivotValues[0].length).toBe(129);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Calculated Settings', () => {
            dataSourceSettings.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
            dataSourceSettings.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(17);
            expect(pivotEngine.pivotValues[0].length).toBe(193);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With label filter condition(Equals and NotEquals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'Equals', value1: 'BIZMATIC' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'DoesNotEquals', value1: 'bike' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(6);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
        });
        it('With label filter condition(BeginWith and DoesNotBeginWith)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'BeginWith', value1: 'BIZMATIC' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'DoesNotBeginWith', value1: 'bike' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(6);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
        });
        it('With label filter condition(EndsWith and DoesNotEndsWith)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'EndsWith', value1: 'BIZMATIC' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'DoesNotEndsWith', value1: 'bike' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(6);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
        });
        it('With label filter condition(GreaterThan and GreaterThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'GreaterThan', value1: 'z' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'GreaterThanOrEqualTo', value1: 'bike' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(17);
            expect(pivotEngine.pivotValues[0].length).toBe(160);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ZAGGLE');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
        });
        it('With label filter condition(LessThan and LessThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'LessThan', value1: 'b' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'LessThanOrEqualTo', value1: 'bike' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(22);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('AQUACINE');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Bike');
        });
        it('With label filter condition(Between and NotBetween)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'company', type: 'Label', condition: 'Between', value1: 'a', value2: 'c' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'NotBetween', value1: 'a', value2: 'c' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(21);
            expect(pivotEngine.pivotValues[0].length).toBe(235);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
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