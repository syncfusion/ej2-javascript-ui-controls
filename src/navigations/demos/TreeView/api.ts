import { TreeView, NodeExpandEventArgs, NodeSelectEventArgs, NodeEditEventArgs, DragAndDropEventArgs, DataBoundEventArgs, NodeClickEventArgs, NodeKeyPressEventArgs, DrawNodeEventArgs, NodeCheckEventArgs } from '../../src/treeview/treeview';
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

let tree: TreeView = new TreeView({
    fields: { dataSource: hierarchicalData, id: "nodeId", text: "nodeText", tooltip: "nodeText", child: "nodeChild", imageUrl: "image", iconCss: "icons", htmlAttributes: 'attr', expanded: 'nodeExpanded', selected: 'nodeSelected', navigateUrl: 'nodeUrl' },
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
    },
    nodeChecked: function(args: NodeCheckEventArgs) {
        if (args.data) {
            (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + args.action + 'ed: ' + args.data[0].text + '\\\n';
        }
    },
    nodeChecking: function(args: NodeCheckEventArgs) {
        if (args.data) {
            (<HTMLInputElement>document.getElementById("events")).value = (<HTMLInputElement>document.getElementById("events")).value + args.action + 'ing: ' + args.data[0].text + '\\\n';
        }
    }
});
tree.appendTo('#tree');