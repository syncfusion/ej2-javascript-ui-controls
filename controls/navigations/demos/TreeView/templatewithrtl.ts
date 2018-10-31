import { TreeView, DrawNodeEventArgs } from '../../src/treeview/treeview';

let data: { [key: string]: Object }[] = [
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
    { id: 12, pid: 5, name: 'Outbox'},
];

let tree1: TreeView = new TreeView({
    fields: { dataSource: data, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' },
    nodeTemplate: '#treeTemplate',
    enableRtl: true
});
tree1.appendTo('#tree1');