import { Kanban, KanbanModel } from '../../src/kanban/index';
import { ChangeEventArgs, CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownList, ChangeEventArgs as DropDownChangeArgs } from '@syncfusion/ej2-dropdowns';
import { SortDirection } from '../../src/kanban/base/type';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * kanban sample
 */

let kanbanOptions: KanbanModel = {
    dataSource: [],
    keyField: 'Status',
    columns: [
        { headerText: 'Backlog', keyField: 'Open, Review', showAddButton: true },
        { headerText: 'In Progress', keyField: 'InProgress', showAddButton: true },
        { headerText: 'Done', keyField: 'Close', showAddButton: true }
    ],
    showEmptyColumn: true,
    cardSettings: {
        showHeader: true,
        contentField: 'Summary',
        headerField: 'Id'
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
//Initialize DropDownList control
let layout: DropDownList = new DropDownList({
    width: '100%',
    change: changeSortOrder
});
layout.appendTo('#layout');
function changeSortOrder(args: DropDownChangeArgs): void {
    let value: string = args.itemData.value;
    if (value === 'Column') {
        kanbanObj.swimlaneSettings.keyField = null;
    } else {
        kanbanObj.swimlaneSettings.keyField = 'Assignee';
    }
}