/**
 * FlowChart
 */
import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import {
    Diagram, NodeModel, ConnectorModel, TextStyleModel, UndoRedo, PortVisibility, ConnectorConstraints,
    DiagramContextMenu, Keys, KeyModifiers, Snapping, SnapConstraints, PageOrientation, ICommandExecuteEventArgs

} from '../../src/diagram/index';
import { NodeConstraints } from '../../src/diagram/index';

Diagram.Inject(UndoRedo, DiagramContextMenu, Snapping);

let node1: NodeModel = {
    id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
    shape: { type: 'Flow', shape: 'Terminator' },
    annotations: [{
        id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
    }],
    constraints: NodeConstraints.Default | NodeConstraints.AspectRatio, ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
    ]
};

let node2: NodeModel = {
    id: 'Meeting', width: 150, height: 60, offsetX: 300, offsetY: 155,
    shape: { type: 'Flow', shape: 'Process' },
    annotations: [{
        id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
    }], ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
    ]
};
let node3: NodeModel = {
    id: 'BoardDecision', width: 150, height: 110, offsetX: 300, offsetY: 280,
    shape: { type: 'Flow', shape: 'Decision' },
    annotations: [{
        id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
        margin: { left: 25, right: 25 },
        style: { whiteSpace: 'PreserveAll' }
    }], ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
    ]
};
let node4: NodeModel = {
    id: 'Project', width: 150, height: 100, offsetX: 300, offsetY: 430,
    shape: { type: 'Flow', shape: 'Decision' },
    annotations: [{
        id: 'label4', content: 'Find Project manager', offset: { x: 0.5, y: 0.5 },

    }], ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
    ]
};
let node5: NodeModel = {
    id: 'End', width: 150, height: 60, offsetX: 300, offsetY: 555,
    shape: { type: 'Flow', shape: 'Process' },
    annotations: [{
        id: 'label5', content: 'Implement and Deliver', offset: { x: 0.5, y: 0.5 },

    }], ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
    ]
};
let node6: NodeModel = {
    id: 'Decision', width: 250, height: 60, offsetX: 550, offsetY: 60,
    shape: { type: 'Flow', shape: 'Card' },
    annotations: [{
        id: 'label6', content: 'Decision Process for new software ideas', offset: { x: 0.5, y: 0.5 },
        style: { whiteSpace: 'PreserveAll' } as TextStyleModel
    }], ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
    ]
};
let node7: NodeModel = {
    id: 'Reject', width: 150, height: 60, offsetX: 550, offsetY: 280,
    shape: { type: 'Flow', shape: 'Process' },
    annotations: [{
        id: 'label7', content: 'Reject and write report', offset: { x: 0.5, y: 0.5 },

    }], ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
    ]
};
let node8: NodeModel = {
    id: 'Resources', width: 150, height: 60, offsetX: 550, offsetY: 430,
    shape: { type: 'Flow', shape: 'Process' },
    annotations: [{
        id: 'label8', content: 'Hire new resources', offset: { x: 0.5, y: 0.5 },

    }], ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
    ]
};


let connector2: ConnectorModel = {
    id: 'connector2', type: 'Straight', sourceID: 'Meeting', targetID: 'BoardDecision', annotations: [{
        id: 'label8', content: '~ConnectNearAll'

    }], connectPadding: 25, constraints: ConnectorConstraints.Default & ~(ConnectorConstraints.ConnectNearAll)
};
let connector3: ConnectorModel = {
    id: 'connector3', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Project', annotations: [{
        id: 'label8', content: '~ConnectNearPort'

    }], connectPadding: 25, constraints: ConnectorConstraints.Default & ~(ConnectorConstraints.ConnectNearPort)
};
let connector4: ConnectorModel = {
    id: 'connector4', type: 'Straight', sourceID: 'Project', targetID: 'End', annotations: [{
        id: 'label8', content: '~ConnectNearNode'

    }], connectPadding: 25, constraints: ConnectorConstraints.Default & ~(ConnectorConstraints.ConnectNearNode)
};
let connector5: ConnectorModel = {
    id: 'connector5', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Reject', connectPadding: 25,
};

let diagram: Diagram = new Diagram({
    width: '100%', height: '600px', nodes: [node1, node2, node3, node4, node5, node6, node7, node8],
    connectors: [connector2, connector3, connector4, connector5],

});

diagram.appendTo('#diagram');

