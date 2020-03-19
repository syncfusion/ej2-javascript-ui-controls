/**
 * Grouping Bar Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import '../../../node_modules/es6-promise/dist/es6-promise';

PivotView.Inject(GroupingBar, FieldList, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        expandAll: false,
        enableSorting: true,
        allowLabelFilter: true,
        allowValueFilter: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'price', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
        filterSettings: [
            { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
            { name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' },
            { name: 'eyeColor', type: 'Exclude', items: ['blue'] },
            { name: 'name', type: 'Exclude', items: ['Knight Wooten'] }
        ],
        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
        { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'price', type: 'CalculatedField' }, { name: 'quantity' }],
        filters: [{ name: 'name' }]
    },
    allowCalculatedField: true,
    showGroupingBar: true,
    showFieldList: true,
    height: 500
});

pivotGridObj.appendTo('#PivotView');

let sort: CheckBox = new CheckBox({
    label: 'Show Sort Icon',
    checked: true,
    change: onChange
});
sort.appendTo('#sort');
let filter: CheckBox = new CheckBox({
    label: 'Show Filter Icon',
    checked: true,
    change: onChange
});
filter.appendTo('#filter');
let remove: CheckBox = new CheckBox({
    label: 'Show Remove Icon',
    checked: true,
    change: onChange
});
remove.appendTo('#remove');
let dropdown: CheckBox = new CheckBox({
    label: 'Show DropDown Icon',
    checked: true,
    change: onChange
});
dropdown.appendTo('#dropdown');
/* tslint:disable */
function onChange(args: any) {
    if ((args.event.target as HTMLElement).id === 'filter') {
        pivotGridObj.groupingBarSettings.showFilterIcon = args.checked;
    } else if (args.event.target.id === 'sort') {
        pivotGridObj.groupingBarSettings.showSortIcon = args.checked;
    } else if (args.event.target.id === 'remove') {
        pivotGridObj.groupingBarSettings.showRemoveIcon = args.checked;
    }
    else {
        pivotGridObj.groupingBarSettings.showValueTypeIcon = args.checked
    }
}
/* tslint:enable */