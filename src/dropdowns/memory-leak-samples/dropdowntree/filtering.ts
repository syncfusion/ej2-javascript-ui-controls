/**
 * DropDownTree Default Sample
 */
import { DropDownTree } from '../../src/drop-down-tree/index';

 let date1: number;
 let date2: number;
 let flag: boolean = true;
 let treeData: any[] = [];
 let treeObj: DropDownTree;

 document.getElementById('render').addEventListener('click', renderDDTree);
 document.getElementById('destroy').addEventListener('click', destoryDDTree);

 for (var i = 1; i <= 100; i++) {
   treeData.push({
     Id: i,
     Text: 'Item' + i,
     Parent: null,
     HasChildren: true,
     IsExpanded: true,
   });
 }
 
 for (var i = 1; i <= 100; i++) {
   for (var j = 1; j <= 10; j++) {
     treeData.push({
       Id: j + i * 100,
       Text: 'Item1' + i + j,
       Parent: i,
       HasChildren: false,
       IsExpanded: false,
     });
   }
 }
 
 function renderDDTree(): void {
    // Initialize  the Dropdown Tree control
    treeObj = new DropDownTree({
        fields: {
        dataSource: treeData,
        value: 'Id',
        parentValue: 'Parent',
        text: 'Text',
        hasChildren: 'HasChildren',
        expanded: 'IsExpanded',
        },
        showCheckBox: true,
        showSelectAll: true,
        width: '250px',
        placeholder: 'Select an Item',
        popupWidth: '250px',
        popupHeight: '300px',
        treeSettings: {expandOn: 'Click'},
        allowFiltering: true,
        filterType: 'StartsWith',
        created: function () {
            date1 = new Date().getTime();
            treeObj.showPopup();
        },
        dataBound: hide
    });
    treeObj.appendTo('#filter');
 }

function hide(): void {
    if (flag && date1) {
        date2 = new Date().getTime();
        document.getElementById('performanceTime').innerHTML = 'Time Taken: ' + (date2 - date1) + 'ms';
        flag = false;
    }
}

function destoryDDTree(): void {
    if (treeObj && !treeObj.isDestroyed) {
        treeObj.destroy();
        treeObj = null;
    }
}
