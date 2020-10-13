import { Kanban, KanbanModel } from '../../src/kanban/index';
import { DropDownList, ChangeEventArgs as DropDownChangeArgs } from '@syncfusion/ej2-dropdowns';
import { SortDirection, SortOrderBy } from '../../src/kanban/base/type';
import { kanbanData } from '../../spec/kanban/common/kanban-data.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * kanban sample
 */

let kanbanOptions: KanbanModel = {
    dataSource: kanbanData,
    keyField: 'Status',
    columns: [
        { headerText: 'Backlog', keyField: 'Open' },
        { headerText: 'In Progress', keyField: 'InProgress' },
        { headerText: 'Done', keyField: 'Close' }
    ],
    cardSettings: {
        contentField: 'Summary',
        headerField: 'Id',
        selectionType: 'Multiple'
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
let sortBy: DropDownList = new DropDownList({
    width: '100%',
    change: changeSortOrder,
    value: 'DataSourceOrder'
});
sortBy.appendTo('#sortBy');
let field: DropDownList = new DropDownList({
    width: '100%',
    change: changeSortOrder
});
field.appendTo('#field');
let direction: DropDownList = new DropDownList({
    width: '100%',
    change: changeSortOrder,
    value: 'Ascending'
});
direction.appendTo('#direction');
function changeSortOrder(args: DropDownChangeArgs): void {
    let value: string = args.element.id;
    switch (value) {
        case 'sortBy':
            let sortBy: SortOrderBy = args.itemData.value as SortOrderBy;
            kanbanObj.sortSettings.sortBy = sortBy;
            break;
        case 'field':
            let field: string = args.itemData.value;
            kanbanObj.sortSettings.field = field;
            break;
        case 'direction':
            let direction: SortDirection = args.itemData.value as SortDirection;
            kanbanObj.sortSettings.direction = direction;
            break;
        default:
            break;
    }
}