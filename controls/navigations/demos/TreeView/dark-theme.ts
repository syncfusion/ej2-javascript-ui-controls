import { TreeView } from '../../src/treeview/treeview';

let hierarchicalData: { [key: string]: Object }[] = [
    { id: '01', name: 'Local Disk (C:)', expanded: true,
        subChild: [
            {
                id: '01-01', name: 'Program Files',
                subChild: [
                    { id: '01-01-01', name: 'Windows NT' },
                    { id: '01-01-02', name: 'Windows Mail' },
                    { id: '01-01-03', name: 'Windows Photo Viewer' },
                ]
            },
            {
                id: '01-02', name: 'Users', expanded: true,
                subChild: [
                    { id: '01-02-01', name: 'Smith' },
                    { id: '01-02-02', name: 'Public' },
                    { id: '01-02-03', name: 'Admin' },
                ]
            },
            {
                id: '01-03', name: 'Windows',
                subChild: [
                    { id: '01-03-01', name: 'Boot' },
                    { id: '01-03-02', name: 'FileManager' },
                    { id: '01-03-03', name: 'System32' },
                ]
            },
        ]
    },
    {
        id: '02', name: 'Local Disk (D:)',
        subChild: [
            {
                id: '02-01', name: 'Personals',
                subChild: [
                    { id: '02-01-01', name: 'My photo.png' },
                    { id: '02-01-02', name: 'Rental document.docx' },
                    { id: '02-01-03', name: 'Pay slip.pdf' },
                ]
            },
            {
                id: '02-02', name: 'Projects',
                subChild: [
                    { id: '02-02-01', name: 'ASP Application' },
                    { id: '02-02-02', name: 'TypeScript Application' },
                    { id: '02-02-03', name: 'React Application' },
                ]
            },
            {
                id: '02-03', name: 'Office',
                subChild: [
                    { id: '02-03-01', name: 'Work details.docx' },
                    { id: '02-03-02', name: 'Weekly report.docx' },
                    { id: '02-03-03', name: 'Wish list.csv' },
                ]
            },
        ]
    },
    {
        id: '03', name: 'Local Disk (E:)', icon: 'folder',
        subChild: [
            {
                id: '03-01', name: 'Pictures',
                subChild: [
                    { id: '03-01-01', name: 'Wind.jpg' },
                    { id: '03-01-02', name: 'Stone.jpg' },
                    { id: '03-01-03', name: 'Home.jpg' },
                ]
            },
            {
                id: '03-02', name: 'Documents',
                    subChild: [
                    { id: '03-02-01', name: 'Environment Pollution.docx' },
                    { id: '03-02-02', name: 'Global Warming.ppt' },
                    { id: '03-02-03', name: 'Social Network.pdf' },
                ]
            },
            {
                id: '03-03', name: 'Study Materials',
                subChild: [
                    { id: '03-03-01', name: 'UI-Guide.pdf' },
                    { id: '03-03-02', name: 'Tutorials.zip' },
                    { id: '03-03-03', name: 'TypeScript.7z' },
                ]
            },
        ]
    }
];

let tree1: TreeView = new TreeView({
    fields: { dataSource: hierarchicalData, id: 'id', text: 'name', child: 'subChild' }
});
tree1.appendTo('#tree1');