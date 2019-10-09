import {
    Diagram, NodeModel, BasicShapeModel, DiagramConstraints, NodeConstraints, PointModel, Rect, ConnectorModel, Node, ConnectorConstraints, PointPortModel, PortVisibility
} from '../../src/diagram/index';
import { NodeAnimationSettings } from '@syncfusion/ej2-navigations';

/**
 * Basic Shapes
 */
let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle', cornerRadius: 10 };
let port: PointPortModel[] = [{ id: 'a', visibility: PortVisibility.Visible | PortVisibility.Hover }];
let node1: NodeModel = {
    id: 'node', height: 50, width: 50, offsetX: 100, offsetY: 100, shape: shape, tooltip: { content: 'node1', position: 'BottomRight', relativeMode: 'Object', animation: { open: { effect: 'FadeZoomIn', delay: 0 }, close: { effect: 'FadeZoomOut', delay: 0 } } },
    constraints: NodeConstraints.Default | NodeConstraints.Tooltip, ports: port,
};
let connectors: ConnectorModel[] = [{
    id: 'connector1',
    type: 'Straight',
    sourcePoint: { x: 200, y: 100 },
    targetPoint: { x: 300, y: 200 },
    tooltip: { content: 'node1', position: 'BottomRight', relativeMode: 'Object', animation: { open: { effect: 'FadeZoomIn', delay: 0 }, close: { effect: 'FadeZoomOut', delay: 0 } } },

}];
let diagram: Diagram = new Diagram({
   connectors: connectors, nodes: [node1],
    constraints: DiagramConstraints.Default | DiagramConstraints.Tooltip,
    tooltip: { content: getcontent(), position: 'TopLeft', relativeMode: 'Object', animation: { open: { effect: 'FadeZoomIn', delay: 0 }, close: { effect: 'FadeZoomOut', delay: 0 } } }
});
diagram.appendTo('#diagram');

function getcontent(): HTMLElement {
    let tooltipContent: HTMLElement = document.createElement('div');
    tooltipContent.innerHTML = '<div style="background-color: #f4f4f4; color: black; border-width:1px;border-style: solid;border-color: #d3d3d3; border-radius: 8px;white-space: nowrap;"> <span style="margin: 10px;"> Tooltip !!! </span> </div>';
    return tooltipContent;
}

let content: any = document.getElementById('content');
let text: any = document.getElementById('tcontent');
let textBlock: any = document.getElementById('tBlock');
let htmlContent: any = document.getElementById('ht');
let htmlBlock: any = document.getElementById('hBlock');
content.onchange = getTooltipContent;
function getTooltipContent() {
    iniTextData();
    initHtmlContent();
    diagram.dataBind();
}

function iniTextData() {
    if (content.value === 'Text') {
        textBlock.style.display = "block";
        getTextData();
    } else {
        textBlock.style.display = "none"
    }
}

text.onchange = getTextData;
function getTextData() {
    let node = diagram.nodes[0] as Node;
    node.tooltip.content = text.value.toString();
    diagram.dataBind();
}

function initHtmlContent() {
    if (content.value === 'HTML ELEMENT') {
        htmlBlock.style.display = "block";
        getHtmlContent();
    } else {
        htmlBlock.style.display = "none"
    }
}

htmlContent.onchange = getHtmlContent;
function getHtmlContent() {
    if (htmlContent.value === 'Html 1') {
        let tooltipContent: HTMLElement = document.createElement('div');
        tooltipContent.innerHTML = '<div style="background-color: #f4f4f4; color: black; border-width:1px;border-style: solid;border-color: #d3d3d3; border-radius: 8px;white-space: nowrap;"> <span style="margin: 10px;"> Tooltip !!! </span> </div>';
        diagram.tooltip.content = tooltipContent;
    } else if (htmlContent.value === 'Html 2') {
        let tooltipContent: HTMLElement = document.createElement('div');
        tooltipContent.innerHTML = '<div style="background-color: #f4f4f4; color: black; border-width:1px;border-style: solid;border-color: #d3d3d3; border-radius: 8px;white-space: nowrap;"> <span style="margin: 10px;"> Diagram Tooltip </span> </div>';
        diagram.tooltip.content = tooltipContent;
    }
    diagram.dataBind();
}

let mode: any = document.getElementById('mode');
mode.onchange = getRelativeMode;
function getRelativeMode() {
    if (mode.value === 'Mouse') {
        diagram.tooltip.relativeMode = 'Mouse';
    } else if (mode.value === 'Object') {
        diagram.tooltip.relativeMode = 'Object';
    }
    diagram.dataBind();
}




let position: any = document.getElementById('position');
position.onchange = getTooltipPosition;
function getTooltipPosition() {
    if (position.value === 'bottom center') {
        diagram.tooltip.position = 'BottomCenter';
    } else if (position.value === 'bottom left') {
        diagram.tooltip.position = 'BottomLeft';
    } else if (position.value === 'bottom right') {
        diagram.tooltip.position = 'BottomRight';
    } else if (position.value === 'left bottom') {
        diagram.tooltip.position = 'LeftBottom';
    } else if (position.value === 'left center') {
        diagram.tooltip.position = 'LeftCenter';
    } else if (position.value === 'left top') {
        diagram.tooltip.position = 'LeftTop';
    } else if (position.value === 'right bottom') {
        diagram.tooltip.position = 'RightBottom';
    } else if (position.value === 'right center') {
        diagram.tooltip.position = 'RightCenter';
    } else if (position.value === 'right top') {
        diagram.tooltip.position = 'RightTop';
    } else if (position.value === 'top center') {
        diagram.tooltip.position = 'TopCenter';
    } else if (position.value === 'top left') {
        diagram.tooltip.position = 'TopLeft';
    } else if (position.value === 'top right') {
        diagram.tooltip.position = 'TopRight';
    }
    diagram.dataBind();
}

let pointer: any = document.getElementById("showTipPointer");
pointer.onclick = showPointer;
function showPointer() {
    if (pointer.checked) {
        diagram.tooltip.showTipPointer = true;
    }
    else {
        diagram.tooltip.showTipPointer = false;
    }
    diagram.dataBind();
}

let showanimation: any = document.getElementById("showTipPointer");
showanimation.onclick = showanimation1;
function showanimation1() {
    if (pointer.checked) {
        diagram.tooltip.animation = { open: { effect: 'FadeZoomIn' }, close: { effect: 'FadeOut' } };
    }
    else {
        diagram.tooltip.animation = null;
    }
    diagram.dataBind();
}