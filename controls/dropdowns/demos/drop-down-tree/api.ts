/**
 * dropdowntree API Sample
 */
import { DropDownTree } from '../../src/drop-down-tree/index';
import { enableRipple } from '@syncfusion/ej2-base';
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


let ddTreeObj: DropDownTree = new DropDownTree({
    fields: { dataSource: hierarchicalData, value: "nodeId", text: "nodeText", tooltip: "nodeText", child: "nodeChild", imageUrl: "image", iconCss: "icons", htmlAttributes: 'attr', expanded: 'nodeExpanded', selected: 'nodeSelected' },
    width: '250px',
    created: function () {
        addEventLog("Created");
    },
    destroyed: function () {
        addEventLog("destroyed");
    },
    beforeOpen: function (args) {
        addEventLog("beforeOpen");
    },
    open: function (args) {
        addEventLog("Open");
    },
    close: function (args) {
        addEventLog("Close");
    },
    change: function (args) {
        addEventLog("change");
    },
    select: function (args) {
        addEventLog("Select");
    },
    blur: function () {
        addEventLog("blur");
    },
    focus: function (args) {
        addEventLog("focus");
    }
});
ddTreeObj.appendTo('#api');
function addEventLog(text: string) {
    let clog = document.getElementById('events');
    clog.innerHTML = text + '\n' + clog.innerHTML;
}