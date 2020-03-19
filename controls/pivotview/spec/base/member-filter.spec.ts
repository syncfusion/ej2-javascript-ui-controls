import { PivotEngine, IDataOptions, IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Member Filter', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Filter settings', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            allowMemberFilter: true,
            filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
            { name: 'company', type: 'Include', items: ['NIPAZ'] },
            { name: 'gender', type: 'Include', items: ['male'] }],
            dataSource: ds,
            rows: [{ name: 'company' }, { name: 'state' }],
            columns: [{ name: 'name' }],
            values: [{ name: 'balance' },
            { name: 'quantity' }], filters: [{ name: 'gender' }]
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('Only include filters', () => {
            expect(pivotEngine.pivotValues.length).toBe(4);
            expect(pivotEngine.pivotValues[0].length).toBe(5);
        });
        it('Exclude with include filter', () => {
            dataSourceSettings.filterSettings[0].type = 'Exclude';
            dataSourceSettings.filterSettings[1].type = 'Exclude';
            // dataSource.filterSettings.length = 1;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(218);
            expect(pivotEngine.pivotValues[0].length).toBe(433);
        });
        it('Only exclude filter', () => {
            dataSourceSettings.filterSettings[0].type = 'Exclude';
            dataSourceSettings.filterSettings[1].type = 'Exclude';
            dataSourceSettings.filterSettings.length = 1;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(422);
            expect(pivotEngine.pivotValues[0].length).toBe(841);
        });
        it('Invalid exclude filter', () => {
            dataSourceSettings.filterSettings.length = 2;
            dataSourceSettings.filterSettings = [{ name: 'name', type: 'Exclude', items: ['bl'] },
            { name: 'gender', type: 'Exclude', items: ['ma'] }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(423);
            expect(pivotEngine.pivotValues[0].length).toBe(843);
        });
        it('Invalid Include filter', () => {
            dataSourceSettings.filterSettings[0].type = 'Include';
            dataSourceSettings.filterSettings[1].type = 'Include';
            dataSourceSettings.filterSettings[0].items[0] = 'bl';
            dataSourceSettings.filterSettings[1].items[1] = 'mal';
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(3);
            expect(pivotEngine.pivotValues[0].length).toBe(3);
        });
        it('Clear filters items', () => {
            dataSourceSettings.filterSettings = [];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues).toBeTruthy;
        });
        it('Filtering with unavailable field', () => {
            dataSourceSettings.filterSettings = [{ name: 'test', type: 'Include', items: ['test'] }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues).toBeTruthy;
        });
    });

    describe('Filter settings without member filtering enabled', () => {
        let ds: IDataSet[] = pivot_dataset as IDataSet[];
        let dataSourceSettings: IDataOptions = {
            allowMemberFilter: false,
            filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
            { name: 'company', type: 'Include', items: ['NIPAZ'] },
            { name: 'gender', type: 'Include', items: ['male'] }],
            dataSource: ds,
            rows: [{ name: 'company' }, { name: 'state' }],
            columns: [{ name: 'name' }],
            values: [{ name: 'balance' },
            { name: 'quantity' }], filters: [{ name: 'gender' }]
        };
        let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        it('Only include filters', () => {
            expect(pivotEngine.pivotValues.length).toBe(423);
            expect(pivotEngine.pivotValues[0].length).toBe(843);
        });
        it('Exclude with include filter', () => {
            dataSourceSettings.filterSettings[0].type = 'Exclude';
            dataSourceSettings.filterSettings[1].type = 'Exclude';
            // dataSource.filterSettings.length = 1;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(423);
            expect(pivotEngine.pivotValues[0].length).toBe(843);
        });
        it('Only exclude filter', () => {
            dataSourceSettings.filterSettings[0].type = 'Exclude';
            dataSourceSettings.filterSettings[1].type = 'Exclude';
            dataSourceSettings.filterSettings.length = 1;
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(423);
            expect(pivotEngine.pivotValues[0].length).toBe(843);
        });
        it('Invalid exclude filter', () => {
            dataSourceSettings.filterSettings.length = 2;
            dataSourceSettings.filterSettings = [{ name: 'name', type: 'Exclude', items: ['bl'] },
            { name: 'gender', type: 'Exclude', items: ['ma'] }];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(423);
            expect(pivotEngine.pivotValues[0].length).toBe(843);
        });
        it('Invalid Include filter', () => {
            dataSourceSettings.filterSettings[0].type = 'Include';
            dataSourceSettings.filterSettings[1].type = 'Include';
            dataSourceSettings.filterSettings[0].items[0] = 'bl';
            dataSourceSettings.filterSettings[1].items[1] = 'mal';
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues.length).toBe(423);
            expect(pivotEngine.pivotValues[0].length).toBe(843);
        });
        it('Clear filters items', () => {
            dataSourceSettings.filterSettings = [];
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            expect(pivotEngine.pivotValues).toBeTruthy;
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