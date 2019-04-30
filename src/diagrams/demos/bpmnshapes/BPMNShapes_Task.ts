/**
 * BPMNShapes_Events
 */

import {
    Diagram, NodeModel, BpmnDiagrams
} from '../../src/diagram/index';

Diagram.Inject(BpmnDiagrams);
let node: NodeModel = {
    id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'None'
            }
        },
    },
};
let node1: NodeModel = {
    id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'Service'
            }
        }
    },
};
let node2: NodeModel = {
    id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'BusinessRule'
            }
        },
    },
};
let node3: NodeModel = {
    id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'InstantiatingReceive'
            }
        },
    },
};
let node4: NodeModel = {
    id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'Manual'
            }
        },
    },
};
let node5: NodeModel = {
    id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'Receive'
            }
        },
    },
};
let node6: NodeModel = {
    id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'Script'
            }
        },
    },
};
let node7: NodeModel = {
    id: 'node7', width: 100, height: 100, offsetX: 500, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'Send'
            }
        },
    },
};
let node8: NodeModel = {
    id: 'node8', width: 100, height: 100, offsetX: 700, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'User'
            }
        },

    },
};
let node9: NodeModel = {
    id: 'node9', width: 100, height: 100, offsetX: 100, offsetY: 500,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                loop: 'Standard',
            }
        },
    },
};
let node10: NodeModel = {
    id: 'node10', width: 100, height: 100, offsetX: 300, offsetY: 500,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                loop: 'ParallelMultiInstance',
            }
        },
    },
};
let node12: NodeModel = {
    id: 'node12', width: 100, height: 100, offsetX: 500, offsetY: 500,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                loop: 'SequenceMultiInstance',
            }
        },
    },
};
let node13: NodeModel = {
    id: 'node13', width: 100, height: 100, offsetX: 700, offsetY: 500,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'InstantiatingReceive', loop: 'None',
            }
        },
    },
};
let node14: NodeModel = {
    id: 'node14', width: 100, height: 100, offsetX: 900, offsetY: 500,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'InstantiatingReceive', loop: 'ParallelMultiInstance',
            }
        },
    },
};
let node15: NodeModel = {
    id: 'node15', width: 100, height: 100, offsetX: 100, offsetY: 700,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'Receive', loop: 'SequenceMultiInstance',
            }
        },
    },
};
let node16: NodeModel = {
    id: 'node16', width: 100, height: 100, offsetX: 300, offsetY: 700,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: {
                type: 'Service', loop: 'ParallelMultiInstance', call: true,
            }
        },
    },
};
let node17: NodeModel = {
    id: 'node17', width: 100, height: 100, offsetX: 500, offsetY: 700,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task',
            task: { call: true, compensation: false, type: 'Service', loop: 'ParallelMultiInstance' }
        },
    }
};
let node18: NodeModel = {
    id: 'node18', width: 100, height: 100, offsetX: 700, offsetY: 700,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'Task', task: { call: true, compensation: true, type: 'Service', loop: 'ParallelMultiInstance', }
        },
    }
};
let diagram = new Diagram({

    width: 1200, height: 1200, nodes: [node, node1, node2, node3, node4, node5, node6, node7,
        node8, node9, node10, node12, node13, node14, node15, node16, node17, node18]
});

diagram.appendTo('#diagram');

