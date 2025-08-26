import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

import { Grid } from '../src/grid/base/grid';
import { Page } from '../src/grid/actions/page';
import { Group } from '../src/grid/actions/group';
import { RowDD } from '../src/grid/actions/row-reorder';
import { Filter } from '../src/grid/filter';
import { Sort } from '../src/grid/sort';
import { Reorder } from '../src/grid/actions/reorder';
import { Selection } from '../src/grid/actions/selection';
import { Toolbar } from "../src/grid/actions/toolbar";
import { Edit } from '../src/grid/actions/edit';
import { data } from '../spec/grid/base/datasource.spec';

Grid.Inject(Filter, Edit, Page, Reorder, Toolbar, Sort, Group, RowDD, Selection);

let grid: Grid;
let date1: number;
let date2: number;
let flag: boolean = true;

document.getElementById('render').addEventListener('click', renderGrid);
document.getElementById('destroy').addEventListener('click', destoryGrid);

function renderGrid(): void {
    grid = new Grid(
        {
            dataSource: data,
            height: 400,
            allowPaging: true,
            editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true },
            toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
            allowFiltering: true,
            allowSorting: true,
            allowGrouping: true,
            allowReordering: true,
            allowRowDragAndDrop: true,
            created: function () {
                date1 = new Date().getTime();
            },
            columns: [
                { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right', width: 120 },
                { field: 'CustomerID', headerText: 'Customer ID', width: 160 },
                { field: 'ShipCity', headerText: 'Ship City', textAlign: 'Right', width: 120 },
                { field: 'ShipRegion', headerText: 'Ship Region', width: 120 },
                { field: 'ShipCountry', headerText: 'Ship Country', width: 160 }
            ],
            dataBound: hide
        });
    grid.appendTo('#Grid');
}

function hide(): void {
    if (flag && date1) {
        date2 = new Date().getTime();
        document.getElementById('performanceTime').innerHTML = 'Time Taken: ' + (date2 - date1) + 'ms';
        flag = false;
    }
}

function destoryGrid(): void {
    if (grid && !grid.isDestroyed) {
        grid.destroy();
        grid = null;
    }
}
