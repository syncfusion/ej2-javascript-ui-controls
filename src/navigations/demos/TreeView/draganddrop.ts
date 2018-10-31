import { TreeView } from '../../src/treeview/treeview';

let productTeam: { [key: string]: Object }[] = [
    {
        id: 1, name: 'ASP.NET MVC Team', expanded: true,
        child: [
            { id: 2, pid: 1, name: 'Smith', isSelected: true },
            { id: 3, pid: 1, name: 'Johnson', isSelected: true },
            { id: 4, pid: 1, name: 'Anderson' },
        ]
    },
    {
        id: 5, name: 'Windows Team',
        child: [
            { id: 6, pid: 5, name: 'Clark' },
            { id: 7, pid: 5, name: 'Wright' },
            { id: 8, pid: 5, name: 'Lopez' },
        ]
    },
    {
        id: 9, name: 'Web Team',
        child: [
            { id: 11, pid: 9, name: 'Joshua' },
            { id: 12, pid: 9, name: 'Matthew' },
            { id: 13, pid: 9, name: 'David' },
        ]
    },
    {
        id: 14, name: 'Build Team',
        child: [
            { id: 15, pid: 14, name: 'Ryan' },
            { id: 16, pid: 14, name: 'Justin' },
            { id: 17, pid: 14, name: 'Robert' },
        ]
    },
    {
        id: 18, name: 'WPF Team',
        child: [
            { id: 19, pid: 18, name: 'Brown' },
            { id: 20, pid: 18, name: 'Johnson' },
            { id: 21, pid: 18, name: 'Miller' },
        ]
    }
];

let tree1: TreeView = new TreeView({
    fields: { dataSource: productTeam, id: 'id', text: 'name', child: 'child', selected: 'isSelected' },
    allowDragAndDrop: true,
    allowMultiSelection: true,
});
tree1.appendTo('#tree1');