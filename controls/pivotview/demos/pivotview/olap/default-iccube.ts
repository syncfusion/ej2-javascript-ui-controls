/**
 * Pivot Field List Default Sample
 */

import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { PivotFieldList } from '../../../src/pivotfieldlist/base/field-list';
import { DrillThrough } from '../../../src/pivotview/actions/drill-through';
import { BeginDrillThroughEventArgs } from '../../../src/common/base/interface';
import { Grid, Sort, Filter, Group, ContextMenu } from '@syncfusion/ej2-grids';
import '../../../node_modules/es6-promise/dist/es6-promise';

PivotView.Inject(GroupingBar, FieldList, DrillThrough);


let pivotObj: PivotView = new PivotView({
    enginePopulated: () => {
        if (fieldlist) {
            fieldlist.update(pivotObj);
        }
    },
    beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
        if (args.gridObj) {
            Grid.Inject(Sort, Filter, Group, ContextMenu);
            let gridObj: Grid = args.gridObj;
            gridObj.allowGrouping = true;
            gridObj.allowSorting = true;
            gridObj.allowFiltering = true;
            gridObj.filterSettings = { type: 'CheckBox' };
            gridObj.contextMenuItems = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
                'Copy', 'Edit', 'Delete', 'Save', 'Cancel', 'FirstPage', 'PrevPage',
                'LastPage', 'NextPage'];
        }
    },
    maxRowsInDrillThrough: 10,
    allowDrillThrough: true,
    gridSettings: { columnWidth: 140 },
    height: 550,
    showGroupingBar: true
});
pivotObj.appendTo('#PivotView');

let fieldlist: PivotFieldList = new PivotFieldList({
    dataSourceSettings: {
        catalog: 'Sales',
        cube: 'Sales',
        providerType: 'SSAS',
        url: 'http://52.4.22.157:8282/icCube/xmla',
        localeIdentifier: 1033,

        rows: [
            { name: '[Time].[Calendar]', caption: 'Time' },
            { name: '[Product].[Product]', caption: 'Product' }
        ],
        columns: [
            { name: '[Customers].[Geography]', caption: 'Geography' },
            { name: '[Measures]', caption: 'Measures' }
        ],
        values: [
            { name: '[Measures].[Amount]', caption: 'Amount' },
            { name: '[Measures].[Count]', caption: 'Count' }
        ],
        filters: [],
        valueAxis: 'column',
        valueSortSettings: {
            sortOrder: 'Descending',
            measure: '[Measures].[Amount]',
        }
    },
    renderMode: 'Fixed',
    maxNodeLimitInMemberEditor: 50,
    enginePopulated: (): void => {
        if (pivotObj) {
            fieldlist.updateView(pivotObj);
        }
    },
    dataBound: (): void => {
        if (pivotObj) {
            pivotObj.layoutRefresh();
        }
    }
});
fieldlist.appendTo('#FieldList');
