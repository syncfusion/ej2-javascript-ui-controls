/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { PivotFieldList } from '../../../src/pivotfieldlist/base/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { DrillThrough } from '../../../src/pivotview/actions';
import { BeginDrillThroughEventArgs } from '../../../src/common/base/interface';
import { Grid, Sort, Filter, Group, ContextMenu } from '@syncfusion/ej2-grids';

PivotFieldList.Inject(CalculatedField, DrillThrough);
PivotView.Inject(GroupingBar);
let pivotGridObj: PivotView = new PivotView({
    enginePopulated: () => {
        if (fieldlist) {
            fieldlist.update(pivotGridObj);
        }
    },
    width: '99%',
    height: 530,
    gridSettings: { columnWidth: 140 },
    showGroupingBar: true,
    allowDrillThrough: true,
    beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
        if (args.gridObj) {
            Grid.Inject(Sort, Filter, Group, ContextMenu);
            let gridObj: Grid = args.gridObj;
            gridObj.allowGrouping = true;
            gridObj.allowSorting = true;
            gridObj.allowFiltering = true;
            gridObj.filterSettings = { type: 'CheckBox' };
            gridObj.contextMenuItems = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
                'Copy', 'FirstPage', 'PrevPage', 'LastPage', 'NextPage'];
        }
    },
    maxNodeLimitInMemberEditor: 20
});
pivotGridObj.appendTo('#PivotView');
let fieldlist: PivotFieldList = new PivotFieldList({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        expandAll: false,
        enableSorting: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
        { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
        rows: [{ name: 'product' }, { name: 'state' }],
        columns: [{ name: 'gender' }],
        values: [{ name: 'balance' }, { name: 'price', type: 'CalculatedField' },
        { name: 'quantity' }], filters: [{ name: 'index' }],
        allowLabelFilter: true,
        allowValueFilter: true
    },
    showValuesButton: true,
    enginePopulated: (): void => {
        fieldlist.updateView(pivotGridObj);
    },
    allowCalculatedField: true,
    renderMode: 'Fixed',
    maxNodeLimitInMemberEditor: 20
});
fieldlist.appendTo('#FieldList');
