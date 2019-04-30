/**
 * FlowChart
 */
import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import {
    Diagram, NodeModel, ConnectorModel, TextStyleModel, UndoRedo,
    DiagramContextMenu, Keys, KeyModifiers, Snapping, SnapConstraints, PageOrientation

} from '../../src/diagram/index';
import { NodeConstraints } from '../../src/diagram/index';

Diagram.Inject(UndoRedo, DiagramContextMenu, Snapping);

let node1: NodeModel = {
    id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
    shape: { type: 'Flow', shape: 'Terminator' },
    annotations: [{
        id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
    }],
    constraints: NodeConstraints.Default | NodeConstraints.AspectRatio
};

let node2: NodeModel = {
    id: 'Meeting', width: 150, height: 60, offsetX: 300, offsetY: 155,
    shape: { type: 'Flow', shape: 'Process' },
    annotations: [{
        id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
    }]
};
let node3: NodeModel = {
    id: 'BoardDecision', width: 150, height: 110, offsetX: 300, offsetY: 280,
    shape: { type: 'Flow', shape: 'Decision' },
    annotations: [{
        id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
        margin: { left: 25, right: 25 },
        style: { whiteSpace: 'PreserveAll' }
    }]
};
let node4: NodeModel = {
    id: 'Project', width: 150, height: 100, offsetX: 300, offsetY: 430,
    shape: { type: 'Flow', shape: 'Decision' },
    annotations: [{
        id: 'label4', content: 'Find Project manager', offset: { x: 0.5, y: 0.5 },

    }]
};
let node5: NodeModel = {
    id: 'End', width: 150, height: 60, offsetX: 300, offsetY: 555,
    shape: { type: 'Flow', shape: 'Process' },
    annotations: [{
        id: 'label5', content: 'Implement and Deliver', offset: { x: 0.5, y: 0.5 },

    }]
};
let node6: NodeModel = {
    id: 'Decision', width: 250, height: 60, offsetX: 550, offsetY: 60,
    shape: { type: 'Flow', shape: 'Card' },
    annotations: [{
        id: 'label6', content: 'Decision Process for new software ideas', offset: { x: 0.5, y: 0.5 },
        style: { whiteSpace: 'PreserveAll' } as TextStyleModel
    }]
};
let node7: NodeModel = {
    id: 'Reject', width: 150, height: 60, offsetX: 550, offsetY: 280,
    shape: { type: 'Flow', shape: 'Process' },
    annotations: [{
        id: 'label7', content: 'Reject and write report', offset: { x: 0.5, y: 0.5 },

    }]
};
let node8: NodeModel = {
    id: 'Resources', width: 150, height: 60, offsetX: 550, offsetY: 430,
    shape: { type: 'Flow', shape: 'Process' },
    annotations: [{
        id: 'label8', content: 'Hire new resources', offset: { x: 0.5, y: 0.5 },

    }]
};

let connector1: ConnectorModel = {
    id: 'connector1', type: 'Straight', sourceID: 'NewIdea', targetID: 'Meeting'
};
let connector2: ConnectorModel = {
    id: 'connector2', type: 'Straight', sourceID: 'Meeting', targetID: 'BoardDecision'
};
let connector3: ConnectorModel = {
    id: 'connector3', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Project'
};
let connector4: ConnectorModel = {
    id: 'connector4', type: 'Straight', sourceID: 'Project', targetID: 'End'
};
let connector5: ConnectorModel = {
    id: 'connector5', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Reject'
};
let connector6: ConnectorModel = {
    id: 'connector6', type: 'Straight', sourceID: 'Project', targetID: 'Resources'
};
let diagram: Diagram = new Diagram({
    width: '100%', height: '600px', nodes: [node1, node2, node3, node4, node5, node6, node7, node8],
    connectors: [connector1, connector2, connector3, connector4, connector5, connector6],
    pageSettings: {
        width: 800, height: 600, showPageBreaks: true, multiplePage: true,
        margin: { left: 10, top: 10, bottom: 10, right: 10 },
        background: { source: '', scale: 'Meet', align: 'XMidYMid' }
    },
    snapSettings: {
        horizontalGridlines: { lineIntervals: [0.95, 9.05, 0.2, 9.75], snapIntervals: [10] },
        verticalGridlines: { lineIntervals: [0.95, 9.05, 0.2, 9.75], snapIntervals: [10] }
    },
    commandManager: {
        commands: [{
            name: 'clone',
            canExecute: () => {
                return diagram.selectedItems.nodes.length || diagram.selectedItems.connectors.length;
            },
            execute: () => {
                diagram.copy();
                diagram.paste();
            },
            gesture: { key: Keys.P, keyModifiers: KeyModifiers.Shift }
        },
        {
            name: 'cut',
            canExecute: () => {
                return diagram.selectedItems.connectors.length === 0;
            }
        }]
    },
    contextMenuSettings: {
        show: true, items: [{
            text: 'Save', id: 'save', target: '.e-diagramcontent',
            iconCss: 'e-save'
        },
        {
            text: 'Load', id: 'load', target: '.e-diagramcontent',
            iconCss: 'e-load'
        },
        {
            text: 'Clear', id: 'clear', target: '.e-diagramcontent',
            iconCss: 'e-clear'
        }],
        showCustomMenuOnly: false,
    },
    contextMenuOpen: (args: BeforeOpenCloseMenuEventArgs) => {
        let show: boolean = (document.getElementById('custommenu') as HTMLInputElement).checked;
        for (let item of args.items) {
            if ((item.text === 'Save' || item.text === 'Load' || item.text === 'Clear')) {
                if (diagram.selectedItems.nodes.length || diagram.selectedItems.connectors.length || !show) {
                    diagram.contextMenuModule.hiddenItems.push(item.text);
                }
            }
        }
    },
    contextMenuClick: (args: MenuEventArgs) => {
        if (args.item.id === 'save') {
            localStorage.setItem('diagram', diagram.saveDiagram());
        } else if (args.item.id === 'load') {
            diagram.loadDiagram(localStorage.getItem('diagram'));
        } else if (args.item.id === 'clear') {
            diagram.clear();
        }
    }
});

diagram.appendTo('#diagram');

document.getElementById('pagewidth').onchange = () => {
    diagram.pageSettings.width = Number((document.getElementById('pagewidth') as HTMLInputElement).value);
    diagram.dataBind();
};

document.getElementById('pageheight').onchange = () => {
    diagram.pageSettings.height = Number((document.getElementById('pageheight') as HTMLInputElement).value);
    diagram.dataBind();
};

document.getElementById('multiplepage').onchange = () => {
    diagram.pageSettings.multiplePage = (document.getElementById('multiplepage') as HTMLInputElement).checked;
    diagram.dataBind();
};

document.getElementById('pagebreaks').onchange = () => {
    diagram.pageSettings.showPageBreaks = (document.getElementById('pagebreaks') as HTMLInputElement).checked;
    diagram.dataBind();
};

document.getElementById('orientation').onchange = () => {
    diagram.pageSettings.orientation = (document.getElementById('orientation') as HTMLSelectElement).value as PageOrientation;
    diagram.dataBind();
};
document.getElementById('showgrid').onchange = () => {
    diagram.snapSettings.constraints ^= SnapConstraints.ShowLines;
    diagram.dataBind();
};
document.getElementById('snaptogrid').onchange = () => {
    diagram.snapSettings.constraints ^= SnapConstraints.SnapToLines;
    diagram.dataBind();
};

document.getElementById('snaptoobject').onchange = () => {
    diagram.snapSettings.constraints ^= SnapConstraints.SnapToObject;
    diagram.dataBind();
};

document.getElementById('backgroundimage').onchange = () => {
    if ((document.getElementById('backgroundimage') as HTMLInputElement).checked) {
        diagram.pageSettings.background.source = './Artboard 13.png';
    } else {
        diagram.pageSettings.background.source = '';
    }
    diagram.dataBind();
};
 