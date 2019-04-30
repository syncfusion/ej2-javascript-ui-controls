import { TreeView } from '../../src/treeview/treeview';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';

let hierarchicalData: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder',
        nodeChild: [
            { nodeId: '01-01', nodeText: 'Gouttes.mp3', nodeIcon: 'file' }
        ]
    },
    {
        nodeId: '02', nodeText: 'Videos', nodeIcon: 'folder',
        nodeChild: [
            { nodeId: '02-01', nodeText: 'Naturals.mp4', nodeIcon: 'file' },
            { nodeId: '02-02', nodeText: 'Wild.mpeg', nodeIcon: 'file' },
        ]
    },
    {
        nodeId: '03', nodeText: 'Documents', nodeIcon: 'folder',
        nodeChild: [
            { nodeId: '03-01', nodeText: 'Environment Pollution.docx', nodeIcon: 'file' },
            { nodeId: '03-02', nodeText: 'Global Water, Sanitation, & Hygiene.docx', nodeIcon: 'file' },
            { nodeId: '03-03', nodeText: 'Global Warming.ppt', nodeIcon: 'file' },
            { nodeId: '03-04', nodeText: 'Social Network.pdf', nodeIcon: 'file' },
            { nodeId: '03-05', nodeText: 'Youth Empowerment.pdf', nodeIcon: 'file' },
        ]
    },
    {
        nodeId: '04', nodeText: 'Pictures', nodeIcon: 'folder',
        nodeChild: [
            {
                nodeId: '04-01', nodeText: 'Camera Roll', nodeIcon: 'folder',
                nodeChild: [
                    { nodeId: '04-01-01', nodeText: 'WIN_20160726_094117.JPG', nodeIcon: 'file' },
                    { nodeId: '04-01-02', nodeText: 'WIN_20160726_094118.JPG', nodeIcon: 'file' },
                    { nodeId: '04-01-03', nodeText: 'WIN_20160726_094119.JPG', nodeIcon: 'file' }
                ]
            },
            { nodeId: '04-02', nodeText: 'Wind.jpg', nodeIcon: 'file' },
            { nodeId: '04-03', nodeText: 'Stone.jpg', nodeIcon: 'file' },
            { nodeId: '04-04', nodeText: 'Home.jpg', nodeIcon: 'file' },
            { nodeId: '04-05', nodeText: 'Bridge.png', nodeIcon: 'file' }
        ]
    },
    {
        nodeId: '05', nodeText: 'Downloads', nodeIcon: 'folder',
        nodeChild: [
            { nodeId: '05-01', nodeText: 'UI-Guide.pdf', nodeIcon: 'file' },
            { nodeId: '05-02', nodeText: 'Tutorials.zip', nodeIcon: 'file' },
            { nodeId: '05-03', nodeText: 'Game.exe', nodeIcon: 'file' },
            { nodeId: '05-04', nodeText: 'TypeScript.7z', nodeIcon: 'file' },
        ]
    },
];

let localData: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', image: 'images/Shooting.png', nodeHasChild: true, nodeExpanded: true },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3' },
    { nodeId: '02', nodeText: 'Videos', nodeIcons: 'folder', image: 'images/Shooting.png', nodeHasChild: true },
    { nodeId: '02-01', nodePid: '02',nodeText: 'Naturals.mp4', nodeIcons: 'file', image: 'images/Shooting.png' },
    { nodeId: '02-02', nodePid: '02',nodeText: 'Wild.mpeg', nodeIcons: 'file' },
    { nodeId: '03', nodeText: 'Documents', nodeIcons: 'folder', nodeHasChild: true },
    { nodeId: '03-01', nodePid: '03',nodeText: 'Environment Pollution.docx', nodeIcons: 'file' },
    { nodeId: '03-02', nodePid: '03',nodeText: 'Global Water, Sanitation, & Hygiene.docx', nodeIcons: 'file' },
    { nodeId: '03-03', nodePid: '03',nodeText: 'Global Warming.ppt', nodeIcons: 'file' },
    { nodeId: '03-04', nodePid: '03',nodeText: 'Social Network.pdf', nodeIcons: 'file' },
    { nodeId: '03-05', nodePid: '03',nodeText: 'Youth Empowerment.pdf', nodeIcons: 'file' },
    { nodeId: '04', nodeText: 'Pictures', nodeIcons: 'folder', nodeHasChild: true },
    { nodeId: '04-01', nodePid: '04',nodeText: 'Camera Roll', nodeIcons: 'folder', nodeHasChild: true },
    { nodeId: '04-01-01', nodePid: '04-01',nodeText: 'WIN_20160726_094117.JPG', nodeIcons: 'file' },
    { nodeId: '04-01-02', nodePid: '04-01',nodeText: 'WIN_20160726_094118.JPG', nodeIcons: 'file' },
    { nodeId: '04-01-03', nodePid: '04-01',nodeText: 'WIN_20160726_094119.JPG', nodeIcons: 'file' },
    { nodeId: '04-02', nodePid: '04',nodeText: 'Wind.jpg', nodeIcons: 'file' },
    { nodeId: '04-03', nodePid: '04',nodeText: 'Stone.jpg', nodeIcons: 'file' },
    { nodeId: '04-04', nodePid: '04',nodeText: 'Home.jpg', nodeIcons: 'file' },
    { nodeId: '04-05', nodePid: '04',nodeText: 'Bridge.png', nodeIcons: 'file' },
    { nodeId: '05', nodeText: 'Downloads', nodeIcons: 'folder', nodeHasChild: true },
    { nodeId: '05-01', nodePid: '05',nodeText: 'UI-Guide.pdf', nodeIcons: 'file' },
    { nodeId: '05-02', nodePid: '05',nodeText: 'Tutorials.zip', nodeIcons: 'file' },
    { nodeId: '05-03', nodePid: '05',nodeText: 'Game.exe', nodeIcons: 'file' },
    { nodeId: '05-04', nodePid: '05',nodeText: 'TypeScript.7z', nodeIcons: 'file' },
];

let data: DataManager = new DataManager({
    url: 'https://services.odata.org/V4/Northwind/Northwind.svc',
    adaptor: new ODataV4Adaptor,
    crossDomain: true,
});
let query = new Query().from("Orders").select("CustomerID,OrderID,EmployeeID,Freight").take(3);

let tree1: TreeView = new TreeView({
    fields: { dataSource: hierarchicalData, id: "nodeId", text: "nodeText", tooltip: "nodeText", child: "nodeChild" },
    enablePersistence: true,
    showCheckBox: true
});
tree1.appendTo('#per-tree1');

let tree2: TreeView = new TreeView({
    enablePersistence: true,
    showCheckBox: true,
    fields: { dataSource: localData, id: "nodeId", text: "nodeText", parentID: 'nodePid', tooltip: "nodeText", hasChildren: "nodeHasChild" },
});
tree2.appendTo('#per-tree2');

let tree3: TreeView = new TreeView({
    enablePersistence: true,
    showCheckBox: true,
    fields: { dataSource: data, query: query, id: "CustomerID", text: "CustomerID", hasChildren: "CustomerID", tooltip: "Freight", expanded: 'CustomerID', navigateUrl: '',
        child: { dataSource: data, tableName: "Customers", id: "Country", parentID: "CustomerID", text: "ContactName", hasChildren: "ContactName", tooltip: "ContactTitle", navigateUrl: '',
            child: { dataSource: data, tableName: "Suppliers", id: "PostalCode", parentID: "Country", text: "CompanyName", tooltip: "Fax", navigateUrl: '', }
        }
    }
});
tree3.appendTo('#per-tree3');