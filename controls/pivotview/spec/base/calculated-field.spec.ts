import { PivotEngine, IDataOptions, IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Calculated field', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let ds: IDataSet[] = pivot_dataset as IDataSet[];
    let dataSourceSettings: IDataOptions = {
        expandAll: false,
        enableSorting: true,
        allowMemberFilter: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
        { name: 'company', type: 'Include', items: ['NIPAZ'] },
        { name: 'gender', type: 'Include', items: ['male'] }],
        dataSource: ds,
        calculatedFieldSettings: [{ name: 'price', formula: '10+5' },
        { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
        rows: [{ name: 'company' }, { name: 'state' }],
        columns: [{ name: 'name' }],
        values: [{ name: 'balance' }, { name: 'price', type: 'CalculatedField' },
        { name: 'quantity' }], filters: [{ name: 'gender' }]
    };
    let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
    it('Calculated field with simple calculation', () => {
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('15');
    });
    it('Calculated field with complex calculation', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('11673.65');
    });
    it('Calculated field using min function', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = 'min("Sum(balance)","Count(quantity)")';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1');
    });
    it('Calculated field using max function', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = 'max("Sum(balance)","Count(quantity)")';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1061.24');
    });
    it('Calculated field using abs function', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = 'abs("Sum(balance)") + "Count(quantity)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1062.24');
    });
    it('Calculated field using Math.min function', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = 'Math.min("Sum(balance)","Count(quantity)")';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1');
    });
    it('Calculated field using Math.max function', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = 'Math.max("Sum(balance)","Count(quantity)")';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1061.24');
    });
    it('Calculated field using Math.abs function', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = 'Math.abs("Sum(balance)") + "Count(quantity)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1062.24');
    });
    it('Calculated field using > condition', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" > "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1');
    });
    it('Calculated field using < condition', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" < "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1061.24');
    });
    it('Calculated field using >= condition', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" >= "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1');
    });
    it('Calculated field using <= condition', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" <= "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1061.24');
    });
    it('Calculated field using == condition', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" == "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1061.24');
    });
    it('Calculated field using != condition', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" != "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1');
    });
    it('Calculated field using | condition', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" | "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1');
    });
    it('Calculated field using & condition', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" & "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1');
    });
    it('Calculated field using isNaN condition', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = 'isNaN("Sum(balance)") ? "Count(quantity)" : "Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1061.24');
    });
    it('Calculated field using !isNaN condition', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '!isNaN("Sum(balance)") ? "Count(quantity)" : "Sum(balance)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('1');
    });
    it('Calculated field with unavailable field', () => {
        dataSourceSettings.calculatedFieldSettings[0].formula = '!isNaN("Sum(balance)") ? "Count(test)" : "Sum(test)"';
        pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
        expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
        expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('0');
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