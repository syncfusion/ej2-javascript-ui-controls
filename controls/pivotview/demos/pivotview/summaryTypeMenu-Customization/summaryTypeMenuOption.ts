import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import { AggregateTypes } from '../../../src';

PivotView.Inject(GroupingBar, FieldList, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        expandAll: false,
        enableSorting: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
        { name: 'company', type: 'Include', items: ['NIPAZ'] },
        { name: 'gender', type: 'Include', items: ['male'] }],
        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
        { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
        rows: [{ name: 'company', caption: 'Industry' }, { name: 'state' }],
        columns: [{ name: 'name' }],
        values: [{ name: 'balance', caption: 'Balance($)' }, { name: 'price', type: 'CalculatedField' },
        { name: 'quantity' }], filters: [{ name: 'gender' }]
    },
    allowCalculatedField: true,
    showGroupingBar: true,
    aggregateTypes: [],
    showFieldList: true
});
pivotGridObj.appendTo('#PivotView');
let a: string[] = ['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index',
    'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal',
    'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal',
    'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
for (let i: number = 0; i < a.length; i++) {
    let sort: CheckBox = new CheckBox({
        label: a[i],
        checked: false,
        cssClass: 'checkBox-demo',
        change: onChange
    });
    let b = document.createElement('input');
    b.setAttribute('id', a[i]);
    b.setAttribute('type', 'checkbox')
    document.querySelector('.container').insertBefore(b, pivotGridObj.element);
    sort.appendTo('#' + a[i]);
}
function onChange(args: any) {
    if (args.checked) {
        pivotGridObj.aggregateTypes = pivotGridObj.aggregateTypes.concat((args.event.target as HTMLElement).id as AggregateTypes);
    }
    else {
        var index = pivotGridObj.aggregateTypes.indexOf((args.event.target as HTMLElement).id as AggregateTypes);
        if (index > -1) {
            pivotGridObj.aggregateTypes = pivotGridObj.aggregateTypes.filter(function (Val) { return args.event.target.id !== Val });
        }
    }
}