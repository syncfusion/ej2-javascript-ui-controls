import { Diagram } from '../../src/diagram/diagram';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { Snapping } from '../../src/diagram/objects/snapping';
import { ConnectorModel, DiagramConstraints } from '../../src/diagram/index';
import { Overview } from '../../src/index';
Diagram.Inject(Snapping);


/**
 * Page Settings
 */
let diagram: Diagram;
let nodes: NodeModel[] = [];
let connectors: ConnectorModel[] = [];

for (let i: number = 0; i < 6000; i++) {
    nodes.push({
        id: 'node' + i, offsetX: 10 + i * 20, offsetY: 260 + 250 * Math.sin(Math.PI * i / 22.5), width: 42, height: 16,
        annotations: [{ content: i.toString() }],
    });
}

for (let i: number = 0; i < 6000 - 15; i++) {
    connectors.push({ id: 'connector' + i, sourceID: nodes[i].id, targetID: nodes[i + 15].id });
}

diagram = new Diagram({
    width: '1000px', height: '600px', nodes: nodes, connectors: connectors,
    constraints: DiagramConstraints.Default | DiagramConstraints.Virtualization,
    mode: 'SVG'
});

diagram.appendTo('#diagram');
