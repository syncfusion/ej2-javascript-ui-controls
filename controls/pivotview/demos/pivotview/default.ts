/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../../spec/base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import '../../node_modules/es6-promise/dist/es6-promise';

//335 or 315
PivotView.Inject(FieldList, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: pivot_dataset as IDataSet[],
        expandAll: true,
        enableSorting: true,
        allowLabelFilter: true,
        allowValueFilter: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        formatSettings: [{ name: 'balance', format: 'C' },
        { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
        filterSettings: [
            { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
            { name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' },
            // { name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'Contains', value1: 'e', value2: 'v' },
            // { name: 'product', type: 'Value', condition: 'GreaterThan', value1: '2000', value2: '800', measure: 'quantity' },
            // { name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '600', value2: '800', measure: 'quantity' },
            { name: 'eyeColor', type: 'Exclude', items: ['blue'] }
        ],
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        // rows: [{ name: 'date', caption: 'TimeLine' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'quantity' }],
        filters: [],
    },
    allowCalculatedField: true,
    showFieldList: true,
    width: 1000,
});
pivotGridObj.appendTo('#PivotView');