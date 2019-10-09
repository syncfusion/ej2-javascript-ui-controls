import { Diagram } from '../../src/diagram/diagram';
import { SnapConstraints, NodeConstraints, DiagramConstraints } from '../../src/diagram/enum/enum';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { NodeModel } from '../../src/diagram/objects/node-model';
/**
 * pageSettings
 */
let diagram: Diagram;
let node: NodeModel = {
    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }],
    tooltip: { content: 'node1', position: 'BottomRight', relativeMode: 'Object', animation: { open: { effect: 'FadeZoomIn', delay: 0 }, close: { effect: 'FadeZoomOut', delay: 0 } } },
    constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
};
let node2: NodeModel = {
    id: 'node2', width: 100, height: 100, offsetX: 220, offsetY: 220, annotations: [{ content: 'Node2' }],
    tooltip: { openOn: 'Custom' }
};
let node3: NodeModel = {
    id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }]
};

function setTooltipTemplate(): string | HTMLElement {
    let content: string = 'Custom Template';
    let htmlElement: HTMLElement = document.getElementById('property');
    return htmlElement;
}



addStyles('../../node_modules/@syncfusion/ej2-base/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-navigations/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-inputs/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-lists/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-popups/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-diagrams/styles/material.css')

let count = 0;
function addStyles(location: string, addLoadEvent?: boolean) {
    var link = document.createElement("link");
    link.href = location;
    link.type = "text/css";
    link.rel = "stylesheet";

    link.onload = function () { CSSDone(); }

    document.getElementsByTagName("head")[0].appendChild(link);
}
function CSSDone() {
    count++;
    if (count === 6) {
        diagram = new Diagram({
            width: '1000px', height: '500px',
            nodes: [node, node2, node3],
            selectedItems: { setTooltipTemplate: setTooltipTemplate },
            constraints: DiagramConstraints.Default | DiagramConstraints.Tooltip,
            tooltip: { content: 'Default Tooltip', position: 'TopLeft', relativeMode: 'Object', animation: { open: { effect: 'FadeZoomIn', delay: 0 }, close: { effect: 'FadeZoomOut', delay: 0 } } }
        });
        diagram.appendTo('#diagram');

    }
}
document.getElementById('show').onclick = () => {
    diagram.showTooltip(diagram.nodes[1]);
}
document.getElementById('hide').onclick = () => {
    diagram.hideTooltip(diagram.nodes[1]);
}
