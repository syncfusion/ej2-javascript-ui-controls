import { PivotEngine, IDataOptions, IDataSet, ICustomProperties } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Value Filtering', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Value Filtering', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            dataSource: pivot_dataset as IDataSet[],
            allowLabelFilter: true,
            allowValueFilter: true,
            allowMemberFilter: true,
            filterSettings: [{ name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '400', measure: 'quantity' }],
            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [],
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('With single value filters', () => {
            expect(pivotEngine.pivotValues.length).toBe(9);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Bike');
        });
        it('With two value filters', () => {
            dataSourceSettings.filterSettings.push({ name: 'product', type: 'Value', condition: 'GreaterThan', value1: '500', measure: 'quantity' });
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With label filters', () => {
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'Equals', value1: 'Van' };
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
        });
        it('With Include filter', () => {
            dataSourceSettings.filterSettings.pop();
            dataSourceSettings.filterSettings[0].type = 'Value';
            dataSourceSettings.filterSettings[0].condition = 'GreaterThanOrEqualTo';
            dataSourceSettings.filterSettings[0].value1 = '500';
            dataSourceSettings.filterSettings.push({ name: 'eyeColor', type: 'Include', items: ['blue', 'green'] });
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(4);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
        });
        it('With Exclude filter', () => {
            dataSourceSettings.filterSettings.pop();
            dataSourceSettings.filterSettings.push({ name: 'eyeColor', type: 'Exclude', items: ['blue'] })
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'product', order: 'Descending' }];
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
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
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(6);
            expect(pivotEngine.pivotValues[0].length).toBe(15);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Drilled members', () => {
            dataSourceSettings.drilledMembers = [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Format Settings', () => {
            dataSourceSettings.formatSettings = [{ name: 'balance', format: 'C' }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With value filter condition(Equals and NotEquals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'isActive', type: 'Value', condition: 'Equals', value1: '1339', measure: 'quantity' };
            dataSourceSettings.filterSettings[1] = { name: 'eyeColor', type: 'Value', condition: 'DoesNotEquals', value1: '194', measure: 'quantity' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(22);
            expect(pivotEngine.pivotValues[0].length).toBe(3);
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
        });
        it('With value filter condition(GreaterThan and GreaterThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '400', measure: 'quantity' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Value', condition: 'GreaterThanOrEqualTo', value1: '500', measure: 'quantity' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With value filter condition(LessThan and LessThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'eyeColor', type: 'Value', condition: 'LessThan', value1: '400', measure: 'quantity' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Value', condition: 'LessThanOrEqualTo', value1: '500', measure: 'quantity' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(7);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
        });
        it('With value filter condition(Between and NotBetween)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'eyeColor', type: 'Value', condition: 'Between', value1: '400', value2: '550', measure: 'quantity' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Value', condition: 'NotBetween', value1: '400', value2: '660', measure: 'quantity' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(4);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
        });
        it('Value filter with unavailable field and member', () => {
            dataSourceSettings.filterSettings[0] = { name: 'test', type: 'Value', condition: 'Between', value1: '400', value2: 'test', measure: 'quantity' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Value', condition: 'NotBetween', value1: '400', value2: '660', measure: 'quantity' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(22);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
        });
    });

    describe('Value Filtering without member filtering enabled', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            dataSource: pivot_dataset as IDataSet[],
            allowLabelFilter: true,
            allowValueFilter: true,
            allowMemberFilter: false,
            filterSettings: [{ name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '400', measure: 'quantity' }],
            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [],
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('With single value filters', () => {
            expect(pivotEngine.pivotValues.length).toBe(9);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Bike');
        });
        it('With two value filters', () => {
            dataSourceSettings.filterSettings.push({ name: 'product', type: 'Value', condition: 'GreaterThan', value1: '500', measure: 'quantity' });
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With label filters', () => {
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Label', condition: 'Equals', value1: 'Van' };
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
        });
        it('With Include filter', () => {
            dataSourceSettings.filterSettings.pop();
            dataSourceSettings.filterSettings[0].type = 'Value';
            dataSourceSettings.filterSettings[0].condition = 'GreaterThanOrEqualTo';
            dataSourceSettings.filterSettings[0].value1 = '500';
            dataSourceSettings.filterSettings.push({ name: 'eyeColor', type: 'Include', items: ['blue', 'green'] });
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
        });
        it('With Exclude filter', () => {
            dataSourceSettings.filterSettings.pop();
            dataSourceSettings.filterSettings.push({ name: 'eyeColor', type: 'Exclude', items: ['blue'] })
            expect(dataSourceSettings.filterSettings.length === 2).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With sorting enabled', () => {
            dataSourceSettings.enableSorting = true;
            dataSourceSettings.sortSettings = [{ name: 'product', order: 'Descending' }];
            expect(dataSourceSettings.sortSettings.length === 1).toBeTruthy;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
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
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(7);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With ExpandAll enabled', () => {
            dataSourceSettings.expandAll = true;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(6);
            expect(pivotEngine.pivotValues[0].length).toBe(15);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Drilled members', () => {
            dataSourceSettings.drilledMembers = [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With Format Settings', () => {
            dataSourceSettings.formatSettings = [{ name: 'balance', format: 'C' }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With value filter condition(Equals and NotEquals)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'isActive', type: 'Value', condition: 'Equals', value1: '1339', measure: 'quantity' };
            dataSourceSettings.filterSettings[1] = { name: 'eyeColor', type: 'Value', condition: 'DoesNotEquals', value1: '194', measure: 'quantity' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(22);
            expect(pivotEngine.pivotValues[0].length).toBe(3);
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
        });
        it('With value filter condition(GreaterThan and GreaterThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '400', measure: 'quantity' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Value', condition: 'GreaterThanOrEqualTo', value1: '500', measure: 'quantity' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(5);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
        });
        it('With value filter condition(LessThan and LessThanOrEqualTo)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'eyeColor', type: 'Value', condition: 'LessThan', value1: '400', measure: 'quantity' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Value', condition: 'LessThanOrEqualTo', value1: '500', measure: 'quantity' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(7);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
        });
        it('With value filter condition(Between and NotBetween)', () => {
            dataSourceSettings.filterSettings[0] = { name: 'eyeColor', type: 'Value', condition: 'Between', value1: '400', value2: '550', measure: 'quantity' };
            dataSourceSettings.filterSettings[1] = { name: 'product', type: 'Value', condition: 'NotBetween', value1: '400', value2: '660', measure: 'quantity' };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(4);
            expect(pivotEngine.pivotValues[0].length).toBe(11);
            expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
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