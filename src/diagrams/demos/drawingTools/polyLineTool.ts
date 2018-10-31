/**
 * Explores the behaviour of the Native Element and the Expand and Collapse Icon
 */

import {
    Diagram, ConnectorModel, DiagramTools
} from '../../src/diagram/index';

let connectors: ConnectorModel = {
    id: 'connector1', type: 'Polyline',
};

let diagram: Diagram = new Diagram({
    width: '800px', height: '1000px',
});
diagram.appendTo('#diagram');


let drawPolygon: HTMLElement = document.getElementById('drwpolygon');
drawPolygon.onclick = function () {
    let continuousDraw: any = document.getElementById('drawnode');
    if (continuousDraw.checked) {
        diagram.tool = DiagramTools.ContinuousDraw;
    } else {
        diagram.tool = DiagramTools.DrawOnce;
    }
    diagram.drawingObject = connectors;
    diagram.dataBind();
};

