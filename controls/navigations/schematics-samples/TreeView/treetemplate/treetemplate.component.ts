import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-treetemplate',
    templateUrl: 'treetemplate.component.html',
    styleUrls: ['treetemplate.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TreetemplateController {
    public localData: Object[] = [
        { id: 1, name: 'Favorites', hasChild: true},
        { id: 2, pid: 1, name: 'Sales Reports', count: '4' },
        { id: 3, pid: 1, name: 'Sent Items'},
        { id: 4, pid: 1, name: 'Marketing Reports ', count: '6'},
        { id: 5, name: 'My Folder', hasChild: true, expanded: true },
        { id: 6, pid: 5, name: 'Inbox',  selected: true , count: '20'},
        { id: 7, pid: 5,  name: 'Drafts', count: '5'},
        { id: 8, pid: 5,  name: 'Deleted Items'},
        { id: 9, pid: 5, name: 'Sent Items'},
        { id: 10, pid: 5, name: 'Sales Reports' , count: '4'},
        { id: 11, pid: 5, name: 'Marketing Reports', count: '6' },
        { id: 12, pid: 5, name: 'Outbox' },
    ];
    public field:Object ={ dataSource: this.localData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
}