import { TreeView } from '../../src/treeview/treeview';
import { Droppable, DropEventArgs } from '@syncfusion/ej2-base';
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

let hierarchicalData1: { [key: string]: Object }[] = [
    {
        subId: '01', subText: 'Music', subIcon: 'folder',
        subChild: [
            { subId: '01-01', subText: 'Gouttes.mp3', subIcon: 'file' }
        ]
    },
    {
        subId: '02', subText: 'Videos', subIcon: 'folder',
        subChild: [
            { subId: '02-01', subText: 'Naturals.mp4', subIcon: 'file' },
            { subId: '02-02', subText: 'Wild.mpeg', subIcon: 'file' },
        ]
    },
    {
        subId: '03', subText: 'Documents', subIcon: 'folder',
        subChild: [
            { subId: '03-01', subText: 'Environment Pollution.docx', subIcon: 'file' },
            { subId: '03-02', subText: 'Global Water, Sanitation, & Hygiene.docx', subIcon: 'file' },
            { subId: '03-03', subText: 'Global Warming.ppt', subIcon: 'file' },
            { subId: '03-04', subText: 'Social Network.pdf', subIcon: 'file' },
            { subId: '03-05', subText: 'Youth Empowerment.pdf', subIcon: 'file' },
        ]
    },
    {
        subId: '04', subText: 'Pictures', subIcon: 'folder',
        subChild: [
            {
                subId: '04-01', subText: 'Camera Roll', subIcon: 'folder',
                subChild: [
                    { subId: '04-01-01', subText: 'WIN_20160726_094117.JPG', subIcon: 'file' },
                    { subId: '04-01-02', subText: 'WIN_20160726_094118.JPG', subIcon: 'file' },
                    { subId: '04-01-03', subText: 'WIN_20160726_094119.JPG', subIcon: 'file' }
                ]
            },
            { subId: '04-02', subText: 'Wind.jpg', subIcon: 'file' },
            { subId: '04-03', subText: 'Stone.jpg', subIcon: 'file' },
            { subId: '04-04', subText: 'Home.jpg', subIcon: 'file' },
            { subId: '04-05', subText: 'Bridge.png', subIcon: 'file' }
        ]
    },
    {
        subId: '05', subText: 'Downloads', subIcon: 'folder',
        subChild: [
            { subId: '05-01', subText: 'UI-Guide.pdf', subIcon: 'file' },
            { subId: '05-02', subText: 'Tutorials.zip', subIcon: 'file' },
            { subId: '05-03', subText: 'Game.exe', subIcon: 'file' },
            { subId: '05-04', subText: 'TypeScript.7z', subIcon: 'file' },
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

let localData1: { [key: string]: Object }[] = [
    { subId: '01', subText: 'Music', image: 'images/Shooting.png', subHasChild: true, nodeExpanded: true },
    { subId: '01-01', subPid: '01', subText: 'Gouttes.mp3' },
    { subId: '02', subText: 'Videos', subIcons: 'folder', image: 'images/Shooting.png', subHasChild: true },
    { subId: '02-01', subPid: '02',subText: 'Naturals.mp4', subIcons: 'file', image: 'images/Shooting.png' },
    { subId: '02-02', subPid: '02',subText: 'Wild.mpeg', subIcons: 'file' },
    { subId: '03', subText: 'Documents', subIcons: 'folder', subHasChild: true },
    { subId: '03-01', subPid: '03',subText: 'Environment Pollution.docx', subIcons: 'file' },
    { subId: '03-02', subPid: '03',subText: 'Global Water, Sanitation, & Hygiene.docx', subIcons: 'file' },
    { subId: '03-03', subPid: '03',subText: 'Global Warming.ppt', subIcons: 'file' },
    { subId: '03-04', subPid: '03',subText: 'Social Network.pdf', subIcons: 'file' },
    { subId: '03-05', subPid: '03',subText: 'Youth Empowerment.pdf', subIcons: 'file' },
    { subId: '04', subText: 'Pictures', subIcons: 'folder', subHasChild: true },
    { subId: '04-01', subPid: '04',subText: 'Camera Roll', subIcons: 'folder', subHasChild: true },
    { subId: '04-01-01', subPid: '04-01',subText: 'WIN_20160726_094117.JPG', subIcons: 'file' },
    { subId: '04-01-02', subPid: '04-01',subText: 'WIN_20160726_094118.JPG', subIcons: 'file' },
    { subId: '04-01-03', subPid: '04-01',subText: 'WIN_20160726_094119.JPG', subIcons: 'file' },
    { subId: '04-02', subPid: '04',subText: 'Wind.jpg', subIcons: 'file' },
    { subId: '04-03', subPid: '04',subText: 'Stone.jpg', subIcons: 'file' },
    { subId: '04-04', subPid: '04',subText: 'Home.jpg', subIcons: 'file' },
    { subId: '04-05', subPid: '04',subText: 'Bridge.png', subIcons: 'file' },
    { subId: '05', subText: 'Downloads', subIcons: 'folder', subHasChild: true },
    { subId: '05-01', subPid: '05',subText: 'UI-Guide.pdf', subIcons: 'file' },
    { subId: '05-02', subPid: '05',subText: 'Tutorials.zip', subIcons: 'file' },
    { subId: '05-03', subPid: '05',subText: 'Game.exe', subIcons: 'file' },
    { subId: '05-04', subPid: '05',subText: 'TypeScript.7z', subIcons: 'file' },
];

let data: DataManager = new DataManager({
    url: 'https://services.odata.org/V4/Northwind/Northwind.svc',
    adaptor: new ODataV4Adaptor,
    crossDomain: true,
});
let query = new Query().from("Orders").select("CustomerID,OrderID,EmployeeID,Freight").take(3);

let tree1: TreeView = new TreeView({
    fields: { dataSource: hierarchicalData, id: "nodeId", text: "nodeText", tooltip: "nodeText", child: "nodeChild", iconCss: 'nodeIcon' },
    allowDragAndDrop: true,
});
tree1.appendTo('#tree1');

let tree2: TreeView = new TreeView({
    fields: { dataSource: hierarchicalData1, id: "subId", text: "subText", tooltip: "subText", child: "subChild", iconCss: 'subIcon' },
});
tree2.appendTo('#tree2');

let tree3: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", text: "nodeText", parentID: 'nodePid', tooltip: "nodeText", hasChildren: "nodeHasChild", iconCss: 'nodeIcons' },
    allowDragAndDrop: true,    
});
tree3.appendTo('#tree3');

let tree4: TreeView = new TreeView({
    fields: { dataSource: localData1, id: "subId", text: "subText", parentID: 'subPid', tooltip: "subText", hasChildren: "subHasChild", iconCss: 'subIcons' },
});
tree4.appendTo('#tree4');

let tree5: TreeView = new TreeView({
    fields: { dataSource: data, query: query, id: "CustomerID", text: "CustomerID", hasChildren: "CustomerID", tooltip: "Freight", expanded: 'CustomerID',
        child: { dataSource: data, tableName: "Customers", id: "Country", parentID: "CustomerID", text: "ContactName", hasChildren: "ContactName", tooltip: "ContactTitle",
            child: { dataSource: data, tableName: "Suppliers", id: "PostalCode", parentID: "Country", text: "CompanyName", tooltip: "Fax" }
        }
    },
    allowDragAndDrop: true,    
});
tree5.appendTo('#tree5');

let tree6: TreeView = new TreeView({
    fields: { dataSource: data, query: query, id: "CustomerID", text: "CustomerID", hasChildren: "CustomerID", tooltip: "Freight", expanded: 'CustomerID',
        child: { dataSource: data, tableName: "Customers", id: "Country", parentID: "CustomerID", text: "ContactName", hasChildren: "ContactName", tooltip: "ContactTitle",
            child: { dataSource: data, tableName: "Suppliers", id: "PostalCode", parentID: "Country", text: "CompanyName", tooltip: "Fax" }
        }
    }
});
tree6.appendTo('#tree6');

let ele: HTMLElement = document.getElementById('div1');
let div1: Droppable = new Droppable(ele, {
    drop: (e: DropEventArgs) => {
        e.target.appendChild(e.droppedElement);
        e.droppedElement.style.position = 'inherit';
    }
})