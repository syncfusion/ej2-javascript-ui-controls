import { TreeView, NodeExpandEventArgs, NodeSelectEventArgs, NodeEditEventArgs, DragAndDropEventArgs, DataBoundEventArgs, NodeClickEventArgs, NodeKeyPressEventArgs, DrawNodeEventArgs, NodeCheckEventArgs, DataSourceChangedEventArgs } from '../../src/treeview/treeview';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import '../../node_modules/es6-promise/dist/es6-promise';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let nodeAttr: { [key: string]: string } = { 'style': 'font-weight: 500' };
let hierarchicalData: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', nodeCusText: 'This is Music', icons: 'folder', image: 'images/Shooting.png', attr: nodeAttr, nodeExpanded: true,
        nodeChild: [
            { nodeId: '01-01', nodeText: 'Gouttes.mp3', nodeCusText: 'This is Gouttes.mp3', nodeSelected: true, nodeUrl: 'http://npmci.syncfusion.com/development/demos/#/material/chart/line.html' }
        ]
    },
    {
        nodeId: '02', nodeText: 'Videos', nodeCusText: 'This is Videos', icons: 'folder', image: 'images/Shooting.png',
        nodeChild: [
            { nodeId: '02-01', nodeText: 'Naturals.mp4', nodeCusText: 'This is Naturals.mp4', icons: 'file', image: 'images/Shooting.png' },
            { nodeId: '02-02', nodeText: 'Wild.mpeg', nodeCusText: 'This is Wild.mpeg', icons: 'file' },
        ]
    },
    {
        nodeId: '03', nodeText: 'Documents', nodeCusText: 'This is Documents', icons: 'folder',
        nodeChild: [
            { nodeId: '03-01', nodeText: 'Environment Pollution.docx', nodeCusText: 'This is Environment Pollution.docx', icons: 'file' },
            { nodeId: '03-02', nodeText: 'Global Water, Sanitation, & Hygiene.docx', nodeCusText: 'This is Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
            { nodeId: '03-03', nodeText: 'Global Warming.ppt', nodeCusText: 'This is Global Warming.ppt', icons: 'file' },
            { nodeId: '03-04', nodeText: 'Social Network.pdf', nodeCusText: 'This is Social Network.pdf', icons: 'file' },
            { nodeId: '03-05', nodeText: 'Youth Empowerment.pdf', nodeCusText: 'This is Youth Empowerment.pdf', icons: 'file' },
        ]
    },
    {
        nodeId: '04', nodeText: 'Pictures', nodeCusText: 'This is Pictures', icons: 'folder',
        nodeChild: [
            {
                nodeId: '04-01', nodeText: 'Camera Roll', nodeCusText: 'This is Camera Roll', icons: 'folder',
                nodeChild: [
                    { nodeId: '04-01-01', nodeText: 'WIN_20160726_094117.JPG', nodeCusText: 'This is WIN_20160726_094117.JPG', icons: 'file' },
                    { nodeId: '04-01-02', nodeText: 'WIN_20160726_094118.JPG', nodeCusText: 'This is WIN_20160726_094118.JPG', icons: 'file' },
                    { nodeId: '04-01-03', nodeText: 'WIN_20160726_094119.JPG', nodeCusText: 'This is WIN_20160726_094119.JPG', icons: 'file' },                    
                    {
                        nodeId: '05', nodeText: 'Downloads', nodeCusText: 'This is Downloads', icons: 'folder',
                        nodeChild: [
                            { nodeId: '05-01', nodeText: 'UI-Guide.pdf', nodeCusText: 'This is UI-Guide.pdf', icons: 'file' },
                            { nodeId: '05-02', nodeText: 'Tutorials.zip', nodeCusText: 'This is Tutorials.zip', icons: 'file' },
                            { nodeId: '05-03', nodeText: 'Game.exe', nodeCusText: 'This is Game.exe', icons: 'file' },
                            { nodeId: '05-04', nodeText: 'TypeScript.7z', nodeCusText: 'This is TypeScript.7z', icons: 'file' },
                        ]
                    },
                ]
            },
            { nodeId: '04-02', nodeText: 'Wind.jpg', nodeCusText: 'This is Wind.jpg', icons: 'file' },
            { nodeId: '04-03', nodeText: 'Stone.jpg', nodeCusText: 'This is Stone.jpg', icons: 'file' },
            { nodeId: '04-04', nodeText: 'Home.jpg', nodeCusText: 'This is Home.jpg', icons: 'file' },
            { nodeId: '04-05', nodeText: 'Bridge.png', nodeCusText: 'This is Bridge.png', icons: 'file' }
        ]
    }
];
declare let window: IPages;
export interface IPages extends Window {
    localData: { [key: string]: Object }[];
}
window.localData = [
    { localId: '01', localText: 'Music', localImage: 'images/Shooting.png', localAttr: nodeAttr, localSelected: true, localHasChild: true, localExpanded: true, localSelected1: true },
    { localId: '01-01', localPid: '01', localText: 'Gouttes.mp3', localUrl: 'http://npmci.syncfusion.com/development/demos/#/material/chart/line.html' },
    { localId: '02', localText: 'Videos', localIcons: 'folder', localImage: 'images/Shooting.png', localHasChild: true, localSelected1: true },
    { localId: '02-01', localPid: '02', localText: 'Naturals.mp4', localIcons: 'file', localImage: 'images/Shooting.png' },
    { localId: '02-02', localPid: '02', localText: 'Wild.mpeg', localIcons: 'file' },
    { localId: '03', localText: 'Documents', localIcons: 'folder', localHasChild: true },
    { localId: '03-01', localPid: '03', localText: 'Environment Pollution.docx', localIcons: 'file' },
    { localId: '03-02', localPid: '03', localText: 'Global Water, Sanitation, & Hygiene.docx', localIcons: 'file' },
    { localId: '03-03', localPid: '03', localText: 'Global Warming.ppt', localIcons: 'file' },
    { localId: '03-04', localPid: '03', localText: 'Social Network.pdf', localIcons: 'file' },
    { localId: '03-05', localPid: '03', localText: 'Youth Empowerment.pdf', localIcons: 'file' },
    { localId: '04', localText: 'Pictures', localIcons: 'folder', localHasChild: true, localExpanded: true, },
    { localId: '04-01', localPid: '04', localText: 'Camera Roll', localIcons: 'folder', localHasChild: true, localExpanded: 'true', },
    { localId: '04-01-01', localPid: '04-01', localText: 'WIN_20160726_094117.JPG', localIcons: 'file' },
    { localId: '04-01-02', localPid: '04-01', localText: 'WIN_20160726_094118.JPG', localIcons: 'file' },
    { localId: '04-01-03', localPid: '04-01', localText: 'WIN_20160726_094119.JPG', localIcons: 'file' },
    { localId: '04-02', localPid: '04', localText: 'Wind.jpg', localIcons: 'file' },
    { localId: '04-03', localPid: '04', localText: 'Stone.jpg', localIcons: 'file' },
    { localId: '04-04', localPid: '04', localText: 'Home.jpg', localIcons: 'file' },
    { localId: '04-05', localPid: '04', localText: 'Bridge.png', localIcons: 'file' },
    { localId: '05', localText: 'Downloads', localIcons: 'folder', localHasChild: true },
    { localId: '05-01', localPid: '05', localText: 'UI-Guide.pdf', localIcons: 'file' },
    { localId: '05-02', localPid: '05', localText: 'Tutorials.zip', localIcons: 'file' },
    { localId: '05-03', localPid: '05', localText: 'Game.exe', localIcons: 'file' },
    { localId: '05-04', localPid: '05', localText: 'TypeScript.7z', localIcons: 'file' }
];

let tree: TreeView = new TreeView({
    fields: { dataSource: hierarchicalData, id: "nodeId", text: "nodeText", tooltip: "nodeText", child: "nodeChild", imageUrl: "image", iconCss: "icons", htmlAttributes: 'attr', expanded: 'nodeExpanded', selected: 'nodeSelected', navigateUrl: 'nodeUrl' },
    created: function(args: Object) {
        addEventLog('TreeView has been created.');
    },
    dataBound: function(args: DataBoundEventArgs) {
        addEventLog('TreeView data source is populated.');
    },
    dataSourceChanged: function(args: DataSourceChangedEventArgs) {
        addEventLog('TreeView data source is changed.');
    },
    drawNode: function(args: DrawNodeEventArgs) {
        if (this.element.classList.contains("via-event") && !args.node.querySelector('.e-icons')) {
            var rowDiv = document.createElement('span');
            rowDiv.className += 'new';
            args.node.querySelector('.e-list-text').appendChild(rowDiv);
        }
    },
    destroyed: function(args: Object) {
        addEventLog('TreeView has been destroyed.');
    },
    keyPress: function(args: NodeKeyPressEventArgs) {
        if (args.node) {
            addEventLog('key press on: ' + args.node.querySelector('.e-list-text').textContent);
        } else {
            addEventLog('key press on: ');
        }
    },
    nodeChecked: function(args: NodeCheckEventArgs) {
        if (args.data) {
            addEventLog(args.action + 'ed: ' + args.data[0]["text"]);
        } else {
            addEventLog(args.action + 'ed: ');
        }
    },
    nodeChecking: function(args: NodeCheckEventArgs) {
        if (args.data) {
            addEventLog(args.action + 'ing: ' + args.data[0]["text"]);
        } else {
            addEventLog(args.action + 'ing: ');
        }
    },
    nodeClicked: function(args: NodeClickEventArgs) {
        if (args.node) {
            addEventLog('clicked: ' + args.node.querySelector('.e-list-text').textContent);
        } else {
            addEventLog('clicked: ');
        }
    },
    nodeCollapsed: function(args: NodeExpandEventArgs) {
        if (args.nodeData) {
            addEventLog('collapsed: ' + args.nodeData["text"]);
        } else {
            addEventLog('collapsed: ');
        }
    },
    nodeCollapsing: function(args: NodeExpandEventArgs) {
        if (args.nodeData) {
            addEventLog('collapsing: ' + args.nodeData["text"]);
        } else {
            addEventLog('collapsing: ');
        }
    },
    nodeDragging: function(args: DragAndDropEventArgs) {
        addEventLog('nodeDragging from: ' + args.draggedNodeData["text"] + ' to: ' + (args.droppedNodeData ? args.droppedNodeData["text"]: ''));
    },
    nodeDragStart: function(args: DragAndDropEventArgs) {
        addEventLog('nodeDragStarted on: ' + args.draggedNodeData["text"] );
    },
    nodeDragStop: function(args: DragAndDropEventArgs) {
        addEventLog('nodeDragStop on: ' + (args.droppedNodeData ? args.droppedNodeData["text"]: ''));
    },
    nodeDropped: function(args: DragAndDropEventArgs) {
        addEventLog('nodeDropped to: ' + (args.droppedNodeData ? args.droppedNodeData["text"]: ''));
    },
    nodeEdited: function(args: NodeEditEventArgs) {
        addEventLog(args.oldText + ' is edited to: ' + args.newText);
    },
    nodeEditing: function(args: NodeEditEventArgs) {
        addEventLog('editing: ' + args.oldText);
    },
    nodeExpanded: function(args: NodeExpandEventArgs) {
        if (args.nodeData) {
            addEventLog('expanded: ' + args.nodeData["text"]);
        } else {
            addEventLog('expanded: ');
        }
    },
    nodeExpanding: function(args: NodeExpandEventArgs) {
        if (args.nodeData) {
            addEventLog('expanding: ' + args.nodeData["text"]);
        } else {
            addEventLog('expanding: ');
        }
    },
    nodeSelected: function(args: NodeSelectEventArgs) {
        if (args.nodeData) {
            addEventLog(args.action + 'ed: ' + args.nodeData["text"]);
        } else {
            addEventLog(args.action + 'ed: ');
        }
    },
    nodeSelecting: function(args: NodeSelectEventArgs) {
        if (args.nodeData) {
            addEventLog(args.action + 'ing: ' + (args.nodeData ? args.nodeData["text"] : ''));
        } else {
            addEventLog(args.action + 'ing: ');
        }
    },
});
tree.appendTo('#tree');

function addEventLog(text: string) {
    let clog = document.getElementById('events');
    clog.innerHTML = text + '\n' + clog.innerHTML;
}