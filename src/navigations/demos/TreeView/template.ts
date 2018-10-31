import { TreeView, DrawNodeEventArgs } from '../../src/treeview/treeview';

let employees: { [key: string]: Object }[] = [
    { id: 1, name: 'Steven Buchanan', eimg: '10', job: 'CEO', hasChild: true, expanded: true },   
    { id: 2, pid: 1, name: 'Laura Callahan', eimg: '2', job: 'Product Manager', hasChild: true },
    { id: 3, pid: 2, name: 'Andrew Fuller', eimg: '7', job: 'Team Lead', hasChild: true },
    { id: 4, pid: 3, name: 'Anne Dodsworth', eimg: '1', job: 'Developer' },
    { id: 5, pid: 1, name: 'Nancy Davolio', eimg: '4', job: 'Product Manager', hasChild: true },   
    { id: 6, pid: 5, name: 'Michael Suyama', eimg: '9', job: 'Team Lead', hasChild: true },
    { id: 7, pid: 6, name: 'Robert King', eimg: '8', job: 'Developer ' },
    { id: 8, pid: 7, name: 'Margaret Peacock', eimg: '6', job: 'Developer' },
    { id: 9, pid: 1, name: 'Janet Leverling', eimg: '3', job: 'HR' },
];

let tree1: TreeView = new TreeView({
    fields: { dataSource: employees, id: "id", parentID: 'pid', text: "name", hasChildren: 'hasChild' },
    cssClass: 'custom',
    nodeTemplate: '#treeTemplate'
});
tree1.appendTo('#tree1');