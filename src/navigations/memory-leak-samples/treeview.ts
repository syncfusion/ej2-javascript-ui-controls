import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

import { TreeView } from '../src/treeview/treeview';
/**
 * TreeView default functionalities sample
 */
document.getElementById('render').addEventListener('click', renderTreeView);
document.getElementById('destroy').addEventListener('click', destoryTreeView);

let date1: number;
let date2: number;
let treeObj: TreeView;
let treeData: any[] = [];
let flag: boolean = true;

for (var i = 1; i <= 10; i++) {
  treeData.push({
    Id: i,
    Text: 'Item' + i,
    Parent: null,
    HasChildren: true,
    IsExpanded: true,
    eimg: i
  });
}

for (var i = 1; i <= 10; i++) {
  for (var j = 1; j <= 10; j++) {
    treeData.push({
      Id: j + i * 100,
      Text: 'Item1' + i + j,
      Parent: i,
      HasChildren: false,
      IsExpanded: false,
      eimg: i
    });
  }
}

function renderTreeView(): void {
    // Render the TreeView by mapping its fields property with data source properties
    treeObj = new TreeView({
        fields: {
        dataSource: treeData,
        id: 'Id',
        parentID: 'Parent',
        text: 'Text',
        hasChildren: 'HasChildren',
        expanded: 'IsExpanded',
        },
        cssClass: 'custom-tree',
        nodeTemplate: '<div>${Text}</div><div><img class="eimage" src="../demos/TreeView/images/Employees/${eimg}.png" alt="${eimg}"/></div>',
        selectedNodes: ['2'],
        allowMultiSelection: true,
        fullRowSelect: false,
        allowDragAndDrop: true,
        allowEditing: true,
        enablePersistence: true,
        animation: { expand: { duration: 0 }, collapse: { duration: 0 } },
        sortOrder: 'Ascending',
        expandOn: 'Click',
        created: function () {
            date1 = new Date().getTime();
        },
        dataBound: hide
    });
    treeObj.appendTo('#tree');
}
function hide(): void {
    if (flag && date1) {
        date2 = new Date().getTime();
        document.getElementById('performanceTime').innerHTML = 'Time Taken: ' + (date2 - date1) + 'ms';
        flag = false;
    }
}

function destoryTreeView(): void {
    if (treeObj && !treeObj.isDestroyed) {
        treeObj.destroy();
        treeObj = null;
    }
}
