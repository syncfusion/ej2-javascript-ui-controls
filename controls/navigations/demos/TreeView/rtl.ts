import { TreeView } from '../../src/treeview/treeview';

let productTeam: { [key: string]: Object }[] = [
    {
        id: 1, name: 'Web Controls', expanded: true,
        child: [
            {
                id: 2, pid: 1, name: 'Calendar', child: [
                    { id: 7, pid: 2, name: 'Constructors' },
                    { id: 8, pid: 2, name: 'Properties' },
                    { id: 9, pid: 2, name: 'Methods' },
                    { id: 10, pid: 2, name: 'Events' }
                ]
            },
            {
                id: 3, pid: 1, name: 'Data Grid', child: [
                    { id: 11, pid: 3, name: 'Constructors' },
                    { id: 12, pid: 3, name: 'Fields' },
                    { id: 13, pid: 3, name: 'Properties' },
                    { id: 14, pid: 3, name: 'Methods' },
                    { id: 15, pid: 3, name: 'Events' }
                ]
            },
            {
                id: 4, pid: 1, name: 'DropDownList', child: [
                    { id: 16, pid: 4, name: 'Constructors' },
                    { id: 17, pid: 4, name: 'Properties' },
                    { id: 18, pid: 4, name: 'Methods' }
                ]
            },
            {
                id: 5, pid: 1, name: 'Menu', child: [
                    { id: 19, pid: 5, name: 'Constructors' },
                    { id: 20, pid: 5, name: 'Fields' },
                    { id: 21, pid: 5, name: 'Properties' },
                    { id: 22, pid: 5, name: 'Methods' },
                    { id: 23, pid: 5, name: 'Events' }
                ]
            },
            {
                id: 6, pid: 1, name: 'TextBox', child: [
                    { id: 20, pid: 6, name: 'Constructors' },
                    { id: 21, pid: 6, name: 'Properties' },
                    { id: 22, pid: 6, name: 'Methods' },
                    { id: 23, pid: 6, name: 'Events' }
                ]
            }
        ]
    }
];

let tree1: TreeView = new TreeView({
    fields: { dataSource: productTeam, id: 'id', text: 'name', child: 'child' },
    enableRtl: true,
});
tree1.appendTo('#tree1');