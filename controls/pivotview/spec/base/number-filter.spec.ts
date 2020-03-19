import { PivotEngine, IDataOptions, IDataSet, ICustomProperties } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Number Filtering', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Number Filtering', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            dataSource: pivot_dataset as IDataSet[],
            allowLabelFilter: true,
            allowMemberFilter: true,
            filterSettings: [{ name: 'age', type: 'Number', condition: 'Equals', value1: '25', value2: '35' }],
            rows: [{ name: 'age', caption: 'Age' }],
            columns: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [],
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('With number filters at code-behind', () => {
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(13);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With label filters', () => {
            dataSourceSettings.filterSettings.push({ name: 'product', type: 'Label', condition: 'Contains', value1: 'e' });
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(9);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With Include filter', () => {
            dataSourceSettings.filterSettings.push({ name: 'eyeColor', type: 'Include', items: ['blue', 'brown'] });
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(9);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With Exclude filter', () => {
            dataSourceSettings.filterSettings.pop();
            dataSourceSettings.filterSettings.push({ name: 'eyeColor', type: 'Exclude', items: ['green'] })
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(9);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'product', order: 'Descending' }];
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(9);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(9);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(19);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With Drilled members', () => {
            dataSourceSettings.drilledMembers = [{ name: 'product', items: ['Bike', 'Car'] }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With Format Settings', () => {
            dataSourceSettings.formatSettings = [{ name: 'balance', format: 'C' }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With number filter condition(Equals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'Equals', value1: '25', value2: '35' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With number filter condition(NotEquals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'DoesNotEquals', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(24);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
        });
        it('With number filter condition(GreaterThan)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'GreaterThan', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(19);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
        });
        it('With number filter condition(GreaterThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'GreaterThanOrEqualTo', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(20);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
        });
        it('With number filter condition(LessThan)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'LessThan', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(9);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(21);
        });
        it('With number filter condition(LessThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'LessThanOrEqualTo', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(10);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(21);
        });
        it('With number filter condition(Between)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(15);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(27);
        });
        it('With number filter condition(NotBetween)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'NotBetween', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(14);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
        });
        it('Number filter with unavailable field and member', () => {
            dataSourceSettings.filterSettings[0] = { name: 'test', type: 'Number', condition: 'NotBetween', value1: 'test', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(25);
            expect(pivotEngine.pivotValues[0].length).toBe(17);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
        });
    });

    describe('Number Filtering without member filtering enabled', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            dataSource: pivot_dataset as IDataSet[],
            allowLabelFilter: true,
            allowMemberFilter: false,
            filterSettings: [{ name: 'age', type: 'Number', condition: 'Equals', value1: '25', value2: '35' }],
            rows: [{ name: 'age', caption: 'Age' }],
            columns: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [],
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('With number filters at code-behind', () => {
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(13);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With label filters', () => {
            dataSourceSettings.filterSettings.push({ name: 'product', type: 'Label', condition: 'Contains', value1: 'e' });
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(9);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With Include filter', () => {
            dataSourceSettings.filterSettings.push({ name: 'eyeColor', type: 'Include', items: ['blue', 'brown'] });
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(9);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With Exclude filter', () => {
            dataSourceSettings.filterSettings.pop();
            dataSourceSettings.filterSettings.push({ name: 'eyeColor', type: 'Exclude', items: ['green'] })
            expect(dataSourceSettings.filterSettings.length === 3).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(9);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'product', order: 'Descending' }];
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(9);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With valuesorting enabled', () => {
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(9);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(23);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With Drilled members', () => {
            dataSourceSettings.drilledMembers = [{ name: 'product', items: ['Bike', 'Car'] }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(19);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With Format Settings', () => {
            dataSourceSettings.formatSettings = [{ name: 'balance', format: 'C' }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(19);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With number filter condition(Equals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'Equals', value1: '25', value2: '35' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(19);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
        });
        it('With number filter condition(NotEquals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'DoesNotEquals', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(24);
            expect(pivotEngine.pivotValues[0].length).toBe(21);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
        });
        it('With number filter condition(GreaterThan)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'GreaterThan', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(19);
            expect(pivotEngine.pivotValues[0].length).toBe(21);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
        });
        it('With number filter condition(GreaterThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'GreaterThanOrEqualTo', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(20);
            expect(pivotEngine.pivotValues[0].length).toBe(21);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
        });
        it('With number filter condition(LessThan)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'LessThan', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(9);
            expect(pivotEngine.pivotValues[0].length).toBe(21);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(22);
        });
        it('With number filter condition(LessThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'LessThanOrEqualTo', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(10);
            expect(pivotEngine.pivotValues[0].length).toBe(21);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(22);
        });
        it('With number filter condition(Between)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(15);
            expect(pivotEngine.pivotValues[0].length).toBe(21);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(27);
        });
        it('With number filter condition(NotBetween)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'age', type: 'Number', condition: 'NotBetween', value1: '25', value2: '35' };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            expect(pivotEngine.pivotValues.length).toBe(14);
            expect(pivotEngine.pivotValues[0].length).toBe(21);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
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