import {
    Diagram, NodeModel
} from '../../src/diagram/index';

/**
 * Canvas
 */
let node: NodeModel = { shape: {} };
node.id = 'node';
node.width = 90;
node.height = 90;
node.offsetX = 100;
node.offsetY = 100;
node.shape = { type: 'Flow', shape: 'Process' };

let node1: NodeModel = { shape: {} };
node1.id = 'node1';
node1.width = 90;
node1.height = 90;
node1.offsetX = 300;
node1.offsetY = 100;
node1.shape.type = 'Flow';
node1.shape = { type: 'Flow', shape: 'Decision' };

let node2: NodeModel = { shape: {} };
node2.id = 'node2';
node2.width = 90;
node2.height = 90;
node2.offsetX = 500;
node2.offsetY = 100;
node2.shape.type = 'Flow';
node2.shape = { type: 'Flow', shape: 'Document' };

let node3: NodeModel = { shape: {} };
node3.id = 'node3';
node3.width = 90;
node3.height = 90;
node3.offsetX = 700;
node3.offsetY = 100;
node3.shape.type = 'Flow';
node3.shape = { type: 'Flow', shape: 'PreDefinedProcess' };

let node4: NodeModel = { shape: {} };
node4.id = 'node4';
node4.width = 90;
node4.height = 90;
node4.offsetX = 900;
node4.offsetY = 100;
node4.shape.type = 'Flow';
node4.shape = { type: 'Flow', shape: 'Terminator' };

let node5: NodeModel = { shape: {} };
node5.id = 'node5';
node5.width = 90;
node5.height = 90;
node5.offsetX = 1100;
node5.offsetY = 100;
node5.shape.type = 'Flow';
node5.shape = { type: 'Flow', shape: 'PaperTap' };

let node6: NodeModel = { shape: {} };
node6.id = 'node6';
node6.width = 90;
node6.height = 90;
node6.offsetX = 100;
node6.offsetY = 300;
node6.shape.type = 'Flow';
node6.shape = { type: 'Flow', shape: 'DirectData' };

let node7: NodeModel = { shape: {} };
node7.id = 'node7';
node7.width = 90;
node7.height = 90;
node7.offsetX = 300;
node7.offsetY = 300;
node7.shape.type = 'Flow';
node7.shape = { type: 'Flow', shape: 'SequentialData' };

let node8: NodeModel = { shape: {} };
node8.id = 'node8';
node8.width = 90;
node8.height = 90;
node8.offsetX = 500;
node8.offsetY = 300;
node8.shape.type = 'Flow';
node8.shape = { type: 'Flow', shape: 'Sort' };

let node9: NodeModel = { shape: {} };
node9.id = 'node9';
node9.width = 90;
node9.height = 90;
node9.offsetX = 700;
node9.offsetY = 300;
node9.shape.type = 'Flow';
node9.shape = { type: 'Flow', shape: 'MultiDocument' };

let node10: NodeModel = { shape: {} };
node10.id = 'node10';
node10.width = 90;
node10.height = 90;
node10.offsetX = 900;
node10.offsetY = 300;
node10.shape.type = 'Flow';
node10.shape = { type: 'Flow', shape: 'Collate' };

let node11: NodeModel = { shape: {} };
node11.id = 'node11';
node11.width = 90;
node11.height = 90;
node11.offsetX = 1100;
node11.offsetY = 300;
node11.shape.type = 'Flow';
node11.shape = { type: 'Flow', shape: 'SummingJunction' };

let node12: NodeModel = { shape: {} };
node12.id = 'node12';
node12.width = 90;
node12.height = 90;
node12.offsetX = 100;
node12.offsetY = 500;
node12.shape.type = 'Flow';
node12.shape = { type: 'Flow', shape: 'Or' };

let node13: NodeModel = { shape: {} };
node13.id = 'node13';
node13.width = 90;
node13.height = 90;
node13.offsetX = 300;
node13.offsetY = 500;
node13.shape.type = 'Flow';
node13.shape = { type: 'Flow', shape: 'InternalStorage' };

let node14: NodeModel = { shape: {} };
node14.id = 'node14';
node14.width = 90;
node14.height = 90;
node14.offsetX = 500;
node14.offsetY = 500;
node14.shape.type = 'Flow';
node14.shape = { type: 'Flow', shape: 'Extract' };

let node15: NodeModel = { shape: {} };
node15.id = 'node15';
node15.width = 90;
node15.height = 90;
node15.offsetX = 700;
node15.offsetY = 500;
node15.shape.type = 'Flow';
node15.shape = { type: 'Flow', shape: 'ManualOperation' };

let node16: NodeModel = { shape: {} };
node16.id = 'node16';
node16.width = 90;
node16.height = 90;
node16.offsetX = 900;
node16.offsetY = 500;
node16.shape.type = 'Flow';
node16.shape = { type: 'Flow', shape: 'Merge' };

let node17: NodeModel = { shape: {} };
node17.id = 'node17';
node17.width = 90;
node17.height = 90;
node17.offsetX = 1100;
node17.offsetY = 500;
node17.shape.type = 'Flow';
node17.shape = { type: 'Flow', shape: 'OffPageReference' };

let node18: NodeModel = { shape: {} };
node18.id = 'node18';
node18.width = 90;
node18.height = 90;
node18.offsetX = 100;
node18.offsetY = 700;
node18.shape.type = 'Flow';
node18.shape = { type: 'Flow', shape: 'SequentialAccessStorage' };

let node19: NodeModel = { shape: {} };
node19.id = 'node19';
node19.width = 90;
node19.height = 90;
node19.offsetX = 300;
node19.offsetY = 700;
node19.shape.type = 'Flow';
node19.shape = { type: 'Flow', shape: 'Annotation' };

let node20: NodeModel = { shape: {} };
node20.id = 'node20';
node20.width = 90;
node20.height = 90;
node20.offsetX = 500;
node20.offsetY = 700;
node20.shape.type = 'Flow';
node20.shape = { type: 'Flow', shape: 'Annotation2' };

let node21: NodeModel = { shape: {} };
node21.id = 'node21';
node21.width = 90;
node21.height = 90;
node21.offsetX = 700;
node21.offsetY = 700;
node21.shape.type = 'Flow';
node21.shape = { type: 'Flow', shape: 'Data' };

let node22: NodeModel = { shape: {} };
node22.id = 'node22';
node22.width = 90;
node22.height = 90;
node22.offsetX = 900;
node22.offsetY = 700;
node22.shape.type = 'Flow';
node22.shape = { type: 'Flow', shape: 'Card' };

let node23: NodeModel = { shape: {} };
node23.id = 'node23';
node23.width = 90;
node23.height = 90;
node23.offsetX = 1100;
node23.offsetY = 700;
node23.shape.type = 'Flow';
node23.shape = { type: 'Flow', shape: 'Delay' };

let node24: NodeModel = { shape: {} };
node24.id = 'node24';
node24.width = 90;
node24.height = 90;
node24.offsetX = 100;
node24.offsetY = 900;
node24.shape.type = 'Flow';
node24.shape = { type: 'Flow', shape: 'Preparation' };

let node25: NodeModel = { shape: {} };
node25.id = 'node25';
node25.width = 90;
node25.height = 90;
node25.offsetX = 300;
node25.offsetY = 900;
node25.shape.type = 'Flow';
node25.shape = { type: 'Flow', shape: 'Display' };

let node26: NodeModel = { shape: {} };
node26.id = 'node26';
node26.width = 90;
node26.height = 90;
node26.offsetX = 500;
node26.offsetY = 900;
node26.shape.type = 'Flow';
node26.shape = { type: 'Flow', shape: 'ManualInput' };

let node27: NodeModel = { shape: {} };
node27.id = 'node27';
node27.width = 90;
node27.height = 90;
node27.offsetX = 700;
node27.offsetY = 900;
node27.shape.type = 'Flow';
node27.shape = { type: 'Flow', shape: 'LoopLimit' };

let node28: NodeModel = { shape: {} };
node28.id = 'node28';
node28.width = 90;
node28.height = 90;
node28.offsetX = 900;
node28.offsetY = 900;
node28.shape.type = 'Flow';
node28.shape = { type: 'Flow', shape: 'StoredData' };

let diagram = new Diagram({
    width: 1500, height: 1500, nodes: [node,
        node1, node2, node3, node4, node5, node6, node7, node8, node9, node10,
        node11, node12, node13, node14, node15, node16, node17, node18, node19,
        node20, node21, node22, node23, node24, node25, node26, node27, node28,
    ]
});
diagram.appendTo('#diagram');


