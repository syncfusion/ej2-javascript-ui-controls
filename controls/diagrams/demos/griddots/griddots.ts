/**
 * Explores the types of nodes
 */

import {
    Diagram, NodeModel, StackPanel, PortVisibility, AnnotationModel, ShapeAnnotationModel, Node, TextElement, ConnectorModel, Orientation, VerticalAlignment, Port, PointPort, PortModel, PointPortModel
} from '../../src/diagram/index';



let diagram: Diagram = new Diagram({
    width: '800px', height: '500px',
    snapSettings: {
        gridType: 'Dots'
    },
});
diagram.appendTo('#diagram');
let DotGrid: any = document.getElementById('DotGrid');
DotGrid.onclick = selectable;
function selectable() {
    diagram.snapSettings.gridType = (DotGrid.checked) ? 'Dots' : 'Lines';
}

document.getElementById('interval').onchange = intervalmethod;
function intervalmethod() {
    var e = (document.getElementById('interval')) as HTMLSelectElement;
    if (diagram.snapSettings.gridType === "Dots") {
        if (e.value === 'Interval1') {
            diagram.snapSettings.horizontalGridlines.dotIntervals = [1, 20, 0.5, 20, 0.5, 20, 0.5, 20, 0.5, 20];
            diagram.snapSettings.verticalGridlines.dotIntervals = [1, 20, 0.5, 20, 0.5, 20, 0.5, 20, 0.5, 20];
        }
        else if (e.value === 'Interval2') {
            diagram.snapSettings.horizontalGridlines.dotIntervals = [1, 30, 0.5, 30, 0.5, 30, 0.5, 30, 0.5, 30];
            diagram.snapSettings.verticalGridlines.dotIntervals = [1, 30, 0, 30, 0, 30, 0, 30, 0, 30];
        }
        else if (e.value === 'Interval3') {
            diagram.snapSettings.horizontalGridlines.dotIntervals = [1, 10, 0.5, 10, 0.5, 10, 0.5, 10, 0.5, 10];
            diagram.snapSettings.verticalGridlines.dotIntervals = [1, 10, 0.5, 10, 0.5, 10, 0.5, 10, 0.5, 10];
        }
        else if (e.value === 'Interval4') {
            diagram.snapSettings.horizontalGridlines.dotIntervals = [3, 20, 1, 20, 1, 20, 1, 20, 1, 20];
            diagram.snapSettings.verticalGridlines.dotIntervals = [3, 20, 1, 20, 1, 20];
        } else {

            diagram.snapSettings.horizontalGridlines.dotIntervals = [3, 20, 1, 20, 1, 20];
            diagram.snapSettings.verticalGridlines.dotIntervals = [3, 20, 1, 20, 1, 20, 1, 20, 1, 20];
        }
    }
    diagram.dataBind()

}
document.getElementById('dotcolor').onchange = dotcolormethod;
function dotcolormethod() {
    var e = (document.getElementById('dotcolor')) as HTMLSelectElement;
    if (diagram.snapSettings.gridType === "Dots") {
        diagram.snapSettings.horizontalGridlines.lineColor = e.value;
        diagram.dataBind()
    }
}
document.getElementById('testcasecheck').onclick = testcasecheck;
function testcasecheck() {
    var diagramgriddot = document.getElementById("diagram_pattern");
    if (diagramgriddot.children.length === 72) {
        console.log('check1');
    }
    if (diagramgriddot.children[0] instanceof SVGCircleElement && diagramgriddot.children[0].getAttribute('fill') === 'lightgray'
        && diagramgriddot.children[0].getAttribute("cx") === "0" && diagramgriddot.children[0].getAttribute("cy") === "0"
        && diagramgriddot.children[5].getAttribute("cy") === "0"
        && diagramgriddot.children[20].getAttribute("cx") === "40" && diagramgriddot.children[20].getAttribute("cy") === "60"
        && diagramgriddot.children[71].getAttribute("cx") === "100" && diagramgriddot.children[71].getAttribute("cy") === "100") {
        console.log('check2');
    }
    diagram.snapSettings.horizontalGridlines.dotIntervals = [1, 30, 0.5, 30, 0.5, 30, 0.5, 30, 0.5, 30];
    diagram.snapSettings.verticalGridlines.dotIntervals = [1, 30, 0.5, 30, 0.5, 30, 0.5, 30, 0.5, 30];
    diagram.snapSettings.horizontalGridlines.lineColor = 'black';
    diagram.dataBind();
    var diagramgriddot1 = document.getElementById("diagram_pattern");
    if (diagramgriddot1.children[0].getAttribute('fill') === 'black' && diagramgriddot1.children[0].getAttribute("cx") === "0"
        && diagramgriddot1.children[0].getAttribute("cy") === "0"
        && diagramgriddot1.children[5].getAttribute("cy") === "0"
        && diagramgriddot1.children[20].getAttribute("cx") === "61.5" && diagramgriddot1.children[20].getAttribute("cy") === "92"
        && diagramgriddot1.children[71].getAttribute("cx") === "153" && diagramgriddot1.children[71].getAttribute("cy") === "153") {
        console.log('check3');
    }
    diagram.snapSettings.horizontalGridlines.dotIntervals = [3, 20, 1, 20, 1, 20, 1, 20, 1, 20];
    diagram.snapSettings.verticalGridlines.dotIntervals = [3, 20, 1, 20, 1, 20];
    diagram.dataBind();
    var diagramgriddot1 = document.getElementById("diagram_pattern");
    if (diagramgriddot1.children[0].getAttribute('fill') === 'black' && diagramgriddot1.children[0].getAttribute("cx") === "0"
        && diagramgriddot1.children[0].getAttribute("cy") === "0"
        && diagramgriddot1.children[5].getAttribute("cy") === "23"
        && diagramgriddot1.children[20].getAttribute("cx") === "0" && diagramgriddot1.children[20].getAttribute("cy") === "107"
        && diagramgriddot1.children[47].getAttribute("cx") === "65" && diagramgriddot1.children[47].getAttribute("cy") === "107") {
        console.log('check3extra');
    }
    diagram.snapSettings.gridType = 'Lines';
    diagram.snapSettings.horizontalGridlines.lineColor = 'lightgray';
    diagram.dataBind();
    var diagramgriddot2 = document.getElementById("diagram_pattern");
    if (diagramgriddot2.children.length === 10 && diagramgriddot2.children[0] instanceof SVGPathElement &&
        diagramgriddot2.children[0].getAttribute("d") === "M0,0.625 L100,0.625 Z"
        && diagramgriddot2.children[9].getAttribute("d") === "M80.125,0 L80.125,100 Z") {
        console.log('check4');
    }
    diagram.snapSettings.gridType = 'Dots';
    diagram.dataBind();
    if (diagramgriddot1.children[0].getAttribute('fill') === 'black' && diagramgriddot1.children[0].getAttribute("cx") === "0"
    && diagramgriddot1.children[0].getAttribute("cy") === "0"
    && diagramgriddot1.children[5].getAttribute("cy") === "23"
    && diagramgriddot1.children[20].getAttribute("cx") === "0" && diagramgriddot1.children[20].getAttribute("cy") === "107"
    && diagramgriddot1.children[47].getAttribute("cx") === "65" && diagramgriddot1.children[47].getAttribute("cy") === "107") {
        console.log('check5');
    }
}