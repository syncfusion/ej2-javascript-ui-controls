import { TreeView, NodeSelectEventArgs, NodeExpandEventArgs, NodeEditEventArgs, DragAndDropEventArgs, DrawNodeEventArgs, DataBoundEventArgs, NodeKeyPressEventArgs, NodeClickEventArgs } from '../../src/treeview/treeview';
import { DataManager, Adaptor, Query, UrlAdaptor, ODataAdaptor, ODataV4Adaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import '../../node_modules/es6-promise/dist/es6-promise';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let nodeAttr: { [key: string]: string } = { 'style': 'font-weight: 500' };
let hierarchicalData: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', image: 'images/Shooting.png', attr: nodeAttr, nodeSelected: 'true', nodeExpanded: true,
        nodeChild: [
            { nodeId: '01-01', nodeText: 'Gouttes.mp3', nodeUrl: 'http://npmci.syncfusion.com/development/demos/#/material/chart/line.html' }
        ]
    },
    {
        nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'images/Shooting.png',
        nodeChild: [
            { nodeId: '02-01', nodeText: 'Naturals.mp4', icons: 'file', image: 'images/Shooting.png' },
            { nodeId: '02-02', nodeText: 'Wild.mpeg', icons: 'file' },
        ]
    },
    {
        nodeId: '03', nodeText: 'Documents', icons: 'folder',
        nodeChild: [
            { nodeId: '03-01', nodeText: 'Environment Pollution.docx', icons: 'file' },
            { nodeId: '03-02', nodeText: 'Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
            { nodeId: '03-03', nodeText: 'Global Warming.ppt', icons: 'file' },
            { nodeId: '03-04', nodeText: 'Social Network.pdf', icons: 'file' },
            { nodeId: '03-05', nodeText: 'Youth Empowerment.pdf', icons: 'file' },
        ]
    },
    {
        nodeId: '04', nodeText: 'Pictures', icons: 'folder', nodeExpanded: true,
        nodeChild: [
            {
                nodeId: '04-01', nodeText: 'Camera Roll', icons: 'folder', nodeExpanded: 'true',
                nodeChild: [
                    { nodeId: '04-01-01', nodeText: 'WIN_20160726_094117.JPG', icons: 'file' },
                    { nodeId: '04-01-02', nodeText: 'WIN_20160726_094118.JPG', icons: 'file' },
                    { nodeId: '04-01-03', nodeText: 'WIN_20160726_094119.JPG', icons: 'file' }
                ]
            },
            { nodeId: '04-02', nodeText: 'Wind.jpg', icons: 'file' },
            { nodeId: '04-03', nodeText: 'Stone.jpg', icons: 'file' },
            { nodeId: '04-04', nodeText: 'Home.jpg', icons: 'file' },
            { nodeId: '04-05', nodeText: 'Bridge.png', icons: 'file' }
        ]
    },
    {
        nodeId: '05', nodeText: 'Downloads', icons: 'folder',
        nodeChild: [
            { nodeId: '05-01', nodeText: 'UI-Guide.pdf', icons: 'file' },
            { nodeId: '05-02', nodeText: 'Tutorials.zip', icons: 'file' },
            { nodeId: '05-03', nodeText: 'Game.exe', icons: 'file' },
            { nodeId: '05-04', nodeText: 'TypeScript.7z', icons: 'file' },
        ]
    },
    { nodeId: '06', nodeText: 'Home', icons: 'folder', nodeChild: [] },
    { nodeId: '06', nodeText: 'App-Data', icons: 'folder', nodeChild: null},
    { nodeText: 'Content', icons: 'folder', hasChildren: true },
    { nodeId: '07', nodeText: 'App-start', icons: 'file' },
];

let localData: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', image: 'images/Shooting.png', attr: nodeAttr, nodeSelected: true, hasChild: true, nodeExpanded: true, nodeSelected1: true },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3', nodeUrl: 'http://npmci.syncfusion.com/development/demos/#/material/chart/line.html' },
    { nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'images/Shooting.png', hasChild: true, nodeSelected1: true },
    { nodeId: '02-01', nodePid: '02',nodeText: 'Naturals.mp4', icons: 'file', image: 'images/Shooting.png' },
    { nodeId: '02-02', nodePid: '02',nodeText: 'Wild.mpeg', icons: 'file' },
    { nodeId: '03', nodeText: 'Documents', icons: 'folder', hasChild: true },
    { nodeId: '03-01', nodePid: '03',nodeText: 'Environment Pollution.docx', icons: 'file' },
    { nodeId: '03-02', nodePid: '03',nodeText: 'Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
    { nodeId: '03-03', nodePid: '03',nodeText: 'Global Warming.ppt', icons: 'file' },
    { nodeId: '03-04', nodePid: '03',nodeText: 'Social Network.pdf', icons: 'file' },
    { nodeId: '03-05', nodePid: '03',nodeText: 'Youth Empowerment.pdf', icons: 'file' },
    { nodeId: '04', nodeText: 'Pictures', icons: 'folder', hasChild: true, nodeExpanded: true, },
    { nodeId: '04-01', nodePid: '04',nodeText: 'Camera Roll', icons: 'folder', hasChild: true, nodeExpanded: 'true', },
    { nodeId: '04-01-01', nodePid: '04-01',nodeText: 'WIN_20160726_094117.JPG', icons: 'file' },
    { nodeId: '04-01-02', nodePid: '04-01',nodeText: 'WIN_20160726_094118.JPG', icons: 'file' },
    { nodeId: '04-01-03', nodePid: '04-01',nodeText: 'WIN_20160726_094119.JPG', icons: 'file' },
    { nodeId: '04-02', nodePid: '04',nodeText: 'Wind.jpg', icons: 'file' },
    { nodeId: '04-03', nodePid: '04',nodeText: 'Stone.jpg', icons: 'file' },
    { nodeId: '04-04', nodePid: '04',nodeText: 'Home.jpg', icons: 'file' },
    { nodeId: '04-05', nodePid: '04',nodeText: 'Bridge.png', icons: 'file' },
    { nodeId: '05', nodeText: 'Downloads', icons: 'folder', hasChild: true },
    { nodeId: '05-01', nodePid: '05',nodeText: 'UI-Guide.pdf', icons: 'file' },
    { nodeId: '05-02', nodePid: '05',nodeText: 'Tutorials.zip', icons: 'file' },
    { nodeId: '05-03', nodePid: '05',nodeText: 'Game.exe', icons: 'file' },
    { nodeId: '05-04', nodePid: '05',nodeText: 'TypeScript.7z', icons: 'file' },
    { nodeId: '06', nodeText: 'Home', icons: 'folder', hasChild: true },
    { nodeId: '06', nodeText: 'App-Data', icons: 'folder', hasChild: "true"},
    { nodeText: 'Content', icons: 'folder', hasChild: "true" },
    { nodeId: '07', nodeText: 'App-start', icons: 'file' },
];

let rootData: Object[] = [
    { nodeId: '01', nodeText: 'Music', image: 'images/Shooting.png', attr: nodeAttr, hasChild: true },
    { nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'images/Shooting.png', hasChild: true },
    { nodeId: '03', nodeText: 'Documents', icons: 'folder', hasChild: true },
    { nodeId: '04', nodeText: 'Pictures', icons: 'folder', hasChild: true, nodeExpanded: true, },
    { nodeId: '05', nodeText: 'Downloads', icons: 'folder', hasChild: true },
    { nodeId: '07', nodeText: 'App-start', icons: 'file' },
];

let rootData1: Object[] = [
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3' },
    { nodeId: '02-01', nodePid: '02',nodeText: 'Naturals.mp4', icons: 'file', image: 'images/Shooting.png' },
    { nodeId: '02-02', nodePid: '02',nodeText: 'Wild.mpeg', icons: 'file' },
    { nodeId: '03-01', nodePid: '03',nodeText: 'Environment Pollution.docx', icons: 'file' },
    { nodeId: '03-02', nodePid: '03',nodeText: 'Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
    { nodeId: '03-03', nodePid: '03',nodeText: 'Global Warming.ppt', icons: 'file' },
    { nodeId: '03-04', nodePid: '03',nodeText: 'Social Network.pdf', icons: 'file' },
    { nodeId: '03-05', nodePid: '03',nodeText: 'Youth Empowerment.pdf', icons: 'file' },
    { nodeId: '04-01', nodePid: '04',nodeText: 'Camera Roll', icons: 'folder', hasChild: true, nodeExpanded: 'true', },
    { nodeId: '04-01-01', nodePid: '04-01',nodeText: 'WIN_20160726_094117.JPG', icons: 'file' },
    { nodeId: '04-01-02', nodePid: '04-01',nodeText: 'WIN_20160726_094118.JPG', icons: 'file' },
    { nodeId: '04-01-03', nodePid: '04-01',nodeText: 'WIN_20160726_094119.JPG', icons: 'file' },
    { nodeId: '04-02', nodePid: '04',nodeText: 'Wind.jpg', icons: 'file' },
    { nodeId: '04-03', nodePid: '04',nodeText: 'Stone.jpg', icons: 'file' },
    { nodeId: '04-04', nodePid: '04',nodeText: 'Home.jpg', icons: 'file' },
    { nodeId: '04-05', nodePid: '04',nodeText: 'Bridge.png', icons: 'file' },
    { nodeId: '05-01', nodePid: '05',nodeText: 'UI-Guide.pdf', icons: 'file' },
    { nodeId: '05-02', nodePid: '05',nodeText: 'Tutorials.zip', icons: 'file' },
    { nodeId: '05-03', nodePid: '05',nodeText: 'Game.exe', icons: 'file' },
    { nodeId: '05-04', nodePid: '05',nodeText: 'TypeScript.7z', icons: 'file' },
];

let localData1: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeCusText: 'This is Music', image: 'images/Shooting.png', attr: nodeAttr, nodeSelected: true, hasChild: true, nodeExpanded: true },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3', nodeCusText: 'This is Gouttes.mp3', nodeUrl: 'http://npmci.syncfusion.com/development/demos/#/material/chart/line.html' },
    { nodeId: '02', nodeText: 'Videos', nodeCusText: 'This is Videos', icons: 'folder', image: 'images/Shooting.png', hasChild: true },
    { nodeId: '02-01', nodePid: '02',nodeText: 'Naturals.mp4', nodeCusText: 'This is Naturals.mp4', icons: 'file', image: 'images/Shooting.png' },
    { nodeId: '02-02', nodePid: '02',nodeText: 'Wild.mpeg', nodeCusText: 'This is Wild.mpeg', icons: 'file' },
    { nodeId: '03', nodeText: 'Documents', nodeCusText: 'This is Documents', icons: 'folder', hasChild: true },
    { nodeId: '03-01', nodePid: '03',nodeText: 'Environment Pollution.docx', nodeCusText: 'This is Environment Pollution.docx', icons: 'file' },
    { nodeId: '03-02', nodePid: '03',nodeText: 'Global Water, Sanitation, & Hygiene.docx', nodeCusText: 'This is Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
    { nodeId: '03-03', nodePid: '03',nodeText: 'Global Warming.ppt', nodeCusText: 'This is Global Warming.ppt', icons: 'file' },
    { nodeId: '03-04', nodePid: '03',nodeText: 'Social Network.pdf', nodeCusText: 'This is Social Network.pdf', icons: 'file' },
    { nodeId: '03-05', nodePid: '03',nodeText: 'Youth Empowerment.pdf', nodeCusText: 'This is Youth Empowerment.pdf', icons: 'file' },
    { nodeId: '04', nodeText: 'Pictures', nodeCusText: 'This is Pictures', icons: 'folder', hasChild: true },
    { nodeId: '04-01', nodePid: '04',nodeText: 'Camera Roll', nodeCusText: 'This is Camera Roll', icons: 'folder', hasChild: true },
    { nodeId: '04-01-01', nodePid: '04-01',nodeText: 'WIN_20160726_094117.JPG', nodeCusText: 'This is WIN_20160726_094117.JPG', icons: 'file' },
    { nodeId: '04-01-02', nodePid: '04-01',nodeText: 'WIN_20160726_094118.JPG', nodeCusText: 'This is WIN_20160726_094118.JPG', icons: 'file', hasChild: true },
    { nodeId: '04-01-03', nodePid: '04-01-02',nodeText: 'WIN_20160726_094119.JPG', nodeCusText: 'This is WIN_20160726_094119.JPG', icons: 'file' },
    { nodeId: '04-02', nodePid: '04',nodeText: 'Wind.jpg', nodeCusText: 'This is Wind.jpg', icons: 'file' },
    { nodeId: '04-03', nodePid: '04',nodeText: 'Stone.jpg', nodeCusText: 'This is Stone.jpg', icons: 'file' },
    { nodeId: '04-04', nodePid: '04',nodeText: 'Home.jpg', nodeCusText: 'This is Home.jpg', icons: 'file' },
    { nodeId: '04-05', nodePid: '04',nodeText: 'Bridge.png', nodeCusText: 'This is Bridge.png', icons: 'file' },
    { nodeId: '05', nodeText: 'Downloads', nodeCusText: 'This is Downloads', icons: 'folder', hasChild: true },
    { nodeId: '05-01', nodePid: '05',nodeText: 'UI-Guide.pdf', nodeCusText: 'This is UI-Guide.pdf', icons: 'file' },
    { nodeId: '05-02', nodePid: '05',nodeText: 'Tutorials.zip', nodeCusText: 'This is Tutorials.zip', icons: 'file' },
    { nodeId: '05-03', nodePid: '05',nodeText: 'Game.exe', nodeCusText: 'This is Game.exe', icons: 'file' },
    { nodeId: '05-04', nodePid: '05',nodeText: 'TypeScript.7z', nodeCusText: 'This is TypeScript.7z', icons: 'file' },
    { nodeId: '06', nodeText: 'Home', nodeCusText: 'This is Home', icons: 'folder', hasChild: true },
    { nodeId: '06', nodeText: 'App-Data', nodeCusText: 'This is App-Data', icons: 'folder', hasChild: "true"},
    { nodeText: 'Content', icons: 'folder', nodeCusText: 'This is Content', hasChild: "true" },
    { nodeId: '07', nodeText: 'App-start', nodeCusText: 'This is App-start', icons: 'file' },
];

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

// remote data binding
let data: DataManager = new DataManager({
    url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Categories',
    crossDomain: true,
});
let data1: DataManager = new DataManager({
    url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
    crossDomain: true,
});
let data2: DataManager = new DataManager({
    url: 'https://services.odata.org/V4/Northwind/Northwind.svc',
    adaptor: new ODataV4Adaptor,
    crossDomain: true,
});
let data3: DataManager = new DataManager(<JSON[]>rootData);
let data4: DataManager = new DataManager({
    url: 'http://js.syncfusion.com/demos/ejServices/api/TreeViewData/GetTreeData',
    adaptor: new UrlAdaptor,
    crossDomain: true,
});
let data5: DataManager = new DataManager({
    url: "http://js.syncfusion.com/demos/ejServices/api/TreeViewData/GetTreeData", crossDomain: true, adaptor: new WebApiAdaptor
});
let data6: DataManager = new DataManager({
    url: "http://mvc.syncfusion.com/Services/Northwnd.svc", crossDomain: true, adaptor: new ODataAdaptor
});
let data7: DataManager = new DataManager({
    //url: 'http://localhost:64599/api/TreeViewData/GetAllData',
    url: 'http://js.syncfusion.com/demos/ejServices/api/TreeViewData/GetTreeData',
    adaptor: new UrlAdaptor,
    crossDomain: true,
    offline: true
});
// let data8: DataManager = new DataManager({
//     url: 'http://localhost:64599/api/TreeViewData/GetAllHiData',
//     adaptor: new UrlAdaptor,
//     crossDomain: true,
//     offline: true
// });
let data9: DataManager = new DataManager(<JSON[]>rootData1);
      
let query = new Query().from("Categories").select("CategoryID,CategoryName,Description").take(7);
let query2 = new Query().from("Orders").select("CustomerID,OrderID,EmployeeID,Freight").take(3);
let query3 = new Query().from("Customers").select("CustomerID,ContactTitle,ContactName,Country").take(5);
let query4 = new Query().from("Suppliers").select("PostalCode,Country,CompanyName,Fax").take(5);
let query5 = new Query().from('Products').select('ProductID,ProductName').take(5);
let query6 = new Query().take(5);
let query7 = new Query().from("Foods").select("ItemID,ItemName,ItemType,Price,Stock").take(7)

// Hierarchical data binding
let tree1: TreeView = new TreeView({
    fields: { dataSource: hierarchicalData, id: "nodeId", text: "nodeText", tooltip: "nodeText", child: "nodeChild", imageUrl: "image", iconCss: "icons", htmlAttributes: 'attr', expanded: 'nodeExpanded', selected: 'nodeSelected', navigateUrl: 'nodeUrl' },    
});
tree1.appendTo('#tree1');

// local data binding
let tree2: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', tooltip: "nodeText", imageUrl: "image", iconCss: "icons", htmlAttributes: 'attr', expanded: 'nodeExpanded', selected: 'nodeSelected', navigateUrl: 'nodeUrl' },
});
tree2.appendTo('#tree2');

// let tree3: TreeView = new TreeView({
//     fields: null,
// });
// let tree3: TreeView = new TreeView({
//     fields: {},
// });
// let tree3: TreeView = new TreeView({
//     fields: { dataSource: data, id: "CategoryID", text: "CategoryName" },
// });
// let tree3: TreeView = new TreeView({
//     fields: { dataSource: data1, tableName: "Categories", id: "CategoryID", text: "CategoryName", 
//             iconCss: 'CategoryName', imageUrl: 'CategoryName', tooltip: 'Description', hasChildren: 'CategoryName',
//             child: { dataSource: data1, tableName: "Products", id: "ProductName", parentID: "CategoryID", text: "ProductName",
//                 tooltip: "UnitPrice", iconCss: 'ProductID', imageUrl: 'ProductName'
//             }
//         },
// });
// let tree3: TreeView = new TreeView({
//     fields: { //dataSource: data1, query: query2, id: "CustomerID", text: "CustomerID", hasChildren: "CustomerID", tooltip: "Freight",
//         //child: { 
//             dataSource: data1, tableName: "Customers", id: "Country", text: "ContactName", hasChildren: "ContactName", tooltip: "ContactTitle",
//             child: { dataSource: data1, tableName: "Suppliers", id: "PostalCode", parentID: "Country", text: "CompanyName", tooltip: "Fax" }
//         //}
//     }
// });
// let tree3: TreeView = new TreeView({
//     fields: { dataSource: data1, query: query, id: "CategoryID", text: "CategoryName", tooltip: "Description" },
// });
// let tree3: TreeView = new TreeView({
//     fields: { dataSource: data1, query: query, id: "CategoryID", text: "CategoryName", tooltip: "Description", hasChildren: "CategoryID", child: null },
// });
// let tree3: TreeView = new TreeView({
//     fields: { dataSource: data1, query: query2, id: "CustomerID", text: "CustomerID", tooltip: "Freight", hasChildren: 'CustomerID',
//         child: { dataSource: data1, tableName: "Customers", id: "Country", parentID: "CustomerID", text: "ContactName", tooltip: "ContactTitle" }
//     },
// });

// let tree3: TreeView = new TreeView({
//     fields: { dataSource: data1, query: query2, id: "CustomerID", text: "OrderID", hasChildren: "CustomerID", tooltip: "Freight",
//         child: { dataSource: data1, query: query3, id: "Country", parentID: "CustomerID", text: "ContactName", tooltip: "ContactTitle",}
//     }
// });
// let tree3: TreeView = new TreeView({
//     fields: { dataSource: data1, query: query2, id: "CustomerID", text: "CustomerID", hasChildren: "CustomerID", tooltip: "Freight",
//         child: { dataSource: data1, query: query3, tableName: "Customers", id: "Country", parentID: "CustomerID", text: "ContactName", hasChildren: "ContactName", tooltip: "ContactTitle",
//             child: { dataSource: data1, tableName: "Suppliers", id: "Fax", parentID: "Country", text: "CompanyName", tooltip: "Fax", hasChildren: "PostalCode",
//                 child: { dataSource: data1, tableName: "Suppliers" }
//             }
//         }
//     }
// });

// widthout adaptor
let tree3: TreeView = new TreeView({
    fields: { dataSource: data1, query: query2, id: "CustomerID", text: "CustomerID", hasChildren: "CustomerID", tooltip: "Freight", expanded: 'CustomerID',
        child: { dataSource: data1, tableName: "Customers", id: "Country", parentID: "CustomerID", text: "ContactName", hasChildren: "ContactName", tooltip: "ContactTitle", expanded: 'ContactName',
            child: { dataSource: data1, tableName: "Suppliers", id: "PostalCode", parentID: "Country", text: "CompanyName", tooltip: "Fax" }
        }
    }
});
tree3.appendTo('#tree3');
// for ODataV4Adaptor
let tree4: TreeView = new TreeView({
    fields: { dataSource: data2, query: query2, id: "CustomerID", text: "CustomerID", hasChildren: "CustomerID", tooltip: "Freight",
        child: { dataSource: data2, tableName: "Customers", id: "Country", parentID: "CustomerID", text: "ContactName", hasChildren: "ContactName", tooltip: "ContactTitle",
            child: { dataSource: data2, tableName: "Suppliers", id: "PostalCode", parentID: "Country", text: "CompanyName", tooltip: "Fax" }
        }
    }
});
tree4.appendTo('#tree4');
// for JSON
let tree5: TreeView = new TreeView({
    fields: { dataSource: data3, id: "nodeId", text: "nodeText", hasChildren: 'hasChild', tooltip: "nodeText", imageUrl: "image", iconCss: "icons", htmlAttributes: 'attr', expanded: 'nodeExpanded',
        child: { dataSource: data9, id: "nodeId", text: "nodeText", parentID: "nodePid", tooltip: "nodeText", iconCss: "icons", hasChildren: 'hasChild', expanded: 'nodeExpanded' }
    }
});
tree5.appendTo('#tree5');
// URL adaptor
let tree6: TreeView = new TreeView({
    fields: { dataSource: data4, query: query6, id: "id", text: "name", hasChildren: 'hasChild', 
        child: { dataSource: data4, query: query6, id: "id", text: "name", parentID: 'pid'}
    }
});
tree6.appendTo('#tree6');
// Web API adaptor
let tree7: TreeView = new TreeView({
    fields: { dataSource: data5, query: query6, id: "id", text: "name", hasChildren: 'hasChild', 
        child: { dataSource: data5, query: query6, id: "id", text: "name", parentID: 'pid'}
    }
});
tree7.appendTo('#tree7');
// Odata adaptor
let tree8: TreeView = new TreeView({
    fields: { dataSource: data6, query: query7, id: "ItemID", text: "ItemName", }
});
tree8.appendTo('#tree8');
// Offline mode
let tree9: TreeView = new TreeView({
    fields: { dataSource: data7, id: "id", text: "name", hasChildren: 'hasChild', expanded: 'expanded' }
});
tree9.appendTo('#tree9');
// // Offline mode and hierarchical Data
// let tree10: TreeView = new TreeView({
//     fields: { dataSource: data8, id: "id", text: "name", hasChildren: 'hasChild', }
// });
// tree10.appendTo('#tree10');
// Expand on
let tree10: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', imageUrl: "image", iconCss: "icons" },
    expandOn: 'Click',
});
tree10.appendTo('#tree10');
// Editing
let tree11: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', imageUrl: "image", iconCss: "icons" },
    allowEditing: true,
    nodeEditing: function(args: NodeEditEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'editing: ' + args.oldText + '\\\n';
    },
    nodeEdited: function(args: NodeEditEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + args.oldText + ' is edited to: ' + args.newText + '\\\n';
    },
});
tree11.appendTo('#tree11');
// RTL
let tree12: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', imageUrl: "image", iconCss: "icons" },
    enableRtl: true,
});
tree12.appendTo('#tree12');
// Sorting
let tree13: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', imageUrl: "image", iconCss: "icons" },
    sortOrder: 'Ascending',
});
tree13.appendTo('#tree13');
// Animation
let tree14: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', imageUrl: "image", iconCss: "icons" },
    animation: { expand: { duration: 0 }, collapse: { duration: 0 } }
});
tree14.appendTo('#tree14');
// Drag and Drop
let tree15: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', imageUrl: "image", iconCss: "icons" },
    allowDragAndDrop: true,
    allowMultiSelection: true,
});
tree15.appendTo('#tree15');
// Full Row Select
let tree16: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', imageUrl: "image", iconCss: "icons", selected: 'nodeSelected1' },
    fullRowSelect: false,
});
tree16.appendTo('#tree16');
// Multi Selection
let tree17: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', imageUrl: "image", iconCss: "icons", selected: 'nodeSelected1' },
    allowMultiSelection: true,
});
tree17.appendTo('#tree17');
// Template support
let tree18: TreeView = new TreeView({
    fields: { dataSource: employees, id: "id", parentID: 'pid', text: "name", hasChildren: 'hasChild' },
    cssClass: 'custom',
    nodeTemplate: '<div><img class="eimage" src="images/Employees/${eimg}.png" alt="${eimg}"/><div class="ejob">${job}</div><div class="ename">${name}</div></div>'
});
tree18.appendTo('#tree18');
// state maintenance
let tree19: TreeView = new TreeView({
    fields: { dataSource: localData, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', imageUrl: "image", iconCss: "icons", selected: 'nodeSelected1' },
    enablePersistence: true,
});
tree19.appendTo('#tree19');
// Events
let tree50: TreeView = new TreeView({
    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", tooltip: "nodeText", hasChildren: "hasChild", imageUrl: "image", iconCss: "icons", htmlAttributes: 'attr', expanded: 'nodeExpanded', selected: 'nodeSelected' },
    cssClass: 'custom-tree',
    selectedNodes: ['02'],
    allowMultiSelection: true,
    allowDragAndDrop: true,
    allowEditing: true,    
    created: function(args: Object) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'TreeView has been created. \\\n';
    },
    destroyed: function(args: Object) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'TreeView has been destroyed. \\\n';
    },
    dataBound: function(args: DataBoundEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'TreeView data source is populated. \\\n';
    },
    nodeExpanding: function(args: NodeExpandEventArgs) {
        if (args.nodeData) {
            (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'expanding: ' + args.nodeData.text + '\\\n';
        }
    },
    nodeExpanded: function(args: NodeExpandEventArgs) {
        if (args.nodeData) {
            (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'expanded: ' + args.nodeData.text + '\\\n';
        }
    },
    nodeCollapsing: function(args: NodeExpandEventArgs) {
        if (args.nodeData) {
            (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'collapsing: ' + args.nodeData.text + '\\\n';
        }
    },
    nodeCollapsed: function(args: NodeExpandEventArgs) {
        if (args.nodeData) {
            (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'collapsed: ' + args.nodeData.text + '\\\n';
        }
    },
    nodeSelected: function(args: NodeSelectEventArgs) {
        if (args.nodeData) {
            (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + args.action + 'ed: ' + args.nodeData.text + '\\\n';
        }
    },
    nodeSelecting: function(args: NodeSelectEventArgs) {
        if (args.nodeData) {
            (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + args.action + 'ing: ' + (args.nodeData ? args.nodeData.text : '') + '\\\n';
        }
    },
    nodeEditing: function(args: NodeEditEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'editing: ' + args.oldText + '\\\n';
    },
    nodeEdited: function(args: NodeEditEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + args.oldText + ' is edited to: ' + args.newText + '\\\n';
    },
    nodeDragStart: function(args: DragAndDropEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'nodeDragStarted on: ' + args.draggedNodeData.text + '\\\n';
    },
    nodeDragging: function(args: DragAndDropEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'nodeDragging from: ' + args.draggedNodeData.text + ' to: ' + (args.droppedNodeData ? args.droppedNodeData.text: '') + '\\\n';
    },
    nodeDragStop: function(args: DragAndDropEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'nodeDragStop on: ' + (args.droppedNodeData ? args.droppedNodeData.text: '') + '\\\n';
    },
    nodeDropped: function(args: DragAndDropEventArgs) {
        (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'nodeDropped to: ' + (args.droppedNodeData ? args.droppedNodeData.text: '') + '\\\n';
    },
    drawNode: function(args: DrawNodeEventArgs) {
        if (!args.node.querySelector('.e-icons')) {
            var rowDiv = document.createElement('span');
            rowDiv.className += 'new';
            args.node.querySelector('.e-list-text').appendChild(rowDiv);
        }
    },
    keyPress: function(args: NodeKeyPressEventArgs) {
        if (args.node) {
            (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'key press on: ' + args.node.querySelector('.e-list-text').textContent + '\\\n';
        }
    },
    nodeClicked: function(args: NodeClickEventArgs) {
        if (args.node) {
            (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + 'clicked: ' + args.node.querySelector('.e-list-text').textContent + '\\\n';
        }
    }
});
tree50.appendTo('#tree50');