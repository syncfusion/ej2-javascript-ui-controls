/**
 * Explores the behaviour of the Fixed User Handle
 */

import {
    Diagram, NodeModel, StackPanel, TextElement, Orientation, VerticalAlignment, HorizontalAlignment, NativeModel, ConnectorModel, MoveTool, MouseEventArgs, IElement, cloneObject, randomId, ToolBase,
} from '../../src/diagram/index';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { IconShapeModel } from '../../src/diagram/objects/icon-model';
import { DiagramNativeElement } from '../../src/diagram/core/elements/native-element';
import { Shape, Native } from '../../src/index';

let nodes: NodeModel[] = [

    {
        id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 150, isExpanded: true,
        annotations: [{ content: 'node1' }], fixedUserHandles:[{offset:{x:0,y:0} ,visibility:true, iconStrokeColor:'red', fill:'green', margin:{right:20},width:20,handleStrokeColor:'orange', height:20,id:'user1',pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'},{offset:{x:0.5,y:0}, margin:{bottom:20} ,width:20, height:20,id:'user2', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}, {offset:{x:1,y:0}, margin:{left:20} ,width:20, height:20,id:'user3', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}, {offset:{x:0,y:0.5}, margin:{right:20} ,width:20, height:20,id:'user4', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}, {offset:{x:1,y:0.5}, margin:{left:20} ,width:20, height:20,id:'user5', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}, {offset:{x:0,y:1}, margin:{right:20} ,width:20, height:20,id:'user6', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}, {offset:{x:0.5,y:1}, margin:{top:20} ,width:20, height:20,id:'user7', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}, {offset:{x:1,y:1}, margin:{left:20} ,width:20, height:20,id:'user8', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'} ],
        
    }
];
let connector: ConnectorModel[] = [{
    id: 'connector1',
    type: 'Orthogonal',
    sourcePoint: { x: 300, y: 100 },
    targetPoint: { x: 400, y: 200 },fixedUserHandles:[{padding:{left:2,right:2,top:2, bottom:2}, offset:0.5 , width:20,alignment:'Before', height:20,id:'usercon1',pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}]
}]
let diagram: Diagram = new Diagram({
    width: '800px', height: '1000px', nodes: nodes, connectors:connector, 
     fixedUserHandleClick: function (args) {
         if (args.element.id === "node1" && args.fixedUserHandle.id == "user1") {
             diagram.copy();
              diagram.paste();
         }
     },
    
});
diagram.appendTo('#diagram');
diagram.click = function (args) {
    console.log(args);
};
let pathdata2: any = document.getElementById('d2');
pathdata2.onchange = getpathData2;
function getpathData2() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];
    
    if ((<HTMLInputElement>pathdata2).value === 'Path 1') {
        node1.pathData = 'M0,25 L100,25 L25,100 L50,0 L75,100 Z';
    } else if (pathdata2.value === 'Path 2') {
        node1.pathData = 'M0,0 L100,0 L0,100 L100,100';
    } else if ((<HTMLInputElement>pathdata2).value === 'Path 3') {
        node1.pathData = 'M0,100 L0,0 L100,100 L100,0';
    } else if (pathdata2.value === 'Path 4') {
        node1.pathData = 'M50,0 L50,100 M0,50 L100,50 M80,20 L20,80 M20,20 L80,80';
    } else if ((<HTMLInputElement>pathdata2).value === 'Path 5') {
        node1.pathData = 'M0,40 L100,40 M0,60 L100,60';
    } else if ((<HTMLInputElement>pathdata2).value === 'Path 6') {
        node1.pathData = 'M40,0 L40,100 M60,0 L60,100';
    }
    diagram.dataBind();
}

let borderColor2: any = document.getElementById('sColor2');
borderColor2.onchange = getBorderColor2;
function getBorderColor2() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];    
    node1.handleStrokeColor = borderColor2.value.toString();
    diagram.dataBind();
}

let borderWidth2: any = document.getElementById('sWidth2');
borderWidth2.onchange = getBorderWidth2;
function getBorderWidth2() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];
    node1.handleStrokeWidth = parseInt(borderWidth2.value);
    diagram.dataBind();
}

let r1: any = document.getElementById('r1');
r1.onchange = getr1;
function getr1() {
    let node1 = diagram.nodes[0].fixedUserHandles[0];
    node1.cornerRadius = parseInt(r1.value);
    diagram.dataBind();
}

let r2: any = document.getElementById('r2');
r2.onchange = getr2;
function getr2() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];
    node1.cornerRadius = parseInt(r2.value);
    diagram.dataBind();
}
let fill1: any = document.getElementById('fill');
fill1.onchange = getfill;
function getfill() {
    let node1 = diagram.nodes[0].fixedUserHandles[0];    
    node1.fill = fill1.value.toString();
    diagram.dataBind();
}

    let fill2: any  = document.getElementById('iconfill');
    fill2.onchange = getfill2;
    function getfill2() {
        let node1 = diagram.nodes[0].fixedUserHandles[0];    
        node1.iconStrokeColor = fill2.value.toString();
        diagram.dataBind();
    }
    let s1: any  = document.getElementById('s1');
    s1.onchange = gets1;
    function gets1() {
        let node1 = diagram.nodes[0].fixedUserHandles[0];    
        node1.iconStrokeWidth = parseInt(s1.value);
        diagram.dataBind();
    }
    let s2: any  = document.getElementById('s2');
    s2.onchange = gets2;
    function gets2() {
        let node1 = diagram.connectors[0].fixedUserHandles[0];    
        node1.iconStrokeWidth = parseInt(s2.value);
        diagram.dataBind();
    }
    let fill3: any  = document.getElementById('fill3');
    fill3.onchange = getfill3;
    function getfill3() {
        let node1 = diagram.connectors[0].fixedUserHandles[0];    
        node1.fill = fill3.value.toString();
        diagram.dataBind();
    }
    let fill4: any  = document.getElementById('fill2');
    fill4.onchange = getfill4;
    function getfill4() {
        let node1 = diagram.connectors[0].fixedUserHandles[0];    
        node1.iconStrokeColor = fill4.value.toString();
        diagram.dataBind();
    }
let Width2: any = document.getElementById('Width2');
Width2.onchange = getWidth2;
function getWidth2() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];
    node1.width = parseInt(Width2.value);
    diagram.dataBind();
}
let pad1: any = document.getElementById('pad1');
pad1.onchange = Pad1;
function Pad1() {
    let node1 = diagram.nodes[0].fixedUserHandles[0];
    node1.padding.bottom = parseInt(pad1.value);
    node1.padding.left = parseInt(pad1.value);
    node1.padding.right = parseInt(pad1.value);
    node1.padding.top = parseInt(pad1.value);
    diagram.dataBind();
}
let pad2: any = document.getElementById('pad2');
pad2.onchange = Pad2;
function Pad2() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];
    node1.padding.bottom = parseInt(pad2.value);
    node1.padding.left = parseInt(pad2.value);
    node1.padding.right = parseInt(pad2.value);
    node1.padding.top = parseInt(pad2.value);
    diagram.dataBind();
}

let height2: any = document.getElementById('Height2');
height2.onchange = getHeight2;
function getHeight2() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];
    node1.height = parseInt(height2.value);
    diagram.dataBind();
}


let X1: any = document.getElementById('displacement1');
X1.onchange = x1;
function x1() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];
    node1.displacement.x = parseInt(X1.value);
    diagram.dataBind();
}
let X2: any = document.getElementById('displacement2');
X2.onchange = x2;
function x2() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];
    node1.displacement.y = parseInt(X2.value);
    diagram.dataBind();
}
let offset: any = document.getElementById('offset');
offset.onchange = getOffsetX2;
function getOffsetX2() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];
    node1.offset = offset.value;
    diagram.dataBind();
}


let pathdata: any = document.getElementById('da');
pathdata.onchange = getpathData;
function getpathData() {
    let node1 = diagram.nodes[0].fixedUserHandles[0];
    
    if ((<HTMLInputElement>pathdata).value === 'Path 1') {
        node1.pathData = 'M0,25 L100,25 L25,100 L50,0 L75,100 Z';
    } else if (pathdata.value === 'Path 2') {
        node1.pathData = 'M0,0 L100,0 L0,100 L100,100';
    } else if ((<HTMLInputElement>pathdata).value === 'Path 3') {
        node1.pathData = 'M0,100 L0,0 L100,100 L100,0';
    } else if (pathdata.value === 'Path 4') {
        node1.pathData = 'M50,0 L50,100 M0,50 L100,50 M80,20 L20,80 M20,20 L80,80';
    } else if ((<HTMLInputElement>pathdata).value === 'Path 5') {
        node1.pathData = 'M0,40 L100,40 M0,60 L100,60';
    } else if ((<HTMLInputElement>pathdata).value === 'Path 6') {
        node1.pathData = 'M40,0 L40,100 M60,0 L60,100';
    }
    diagram.dataBind();
}

let borderColor: any = document.getElementById('sColor');
borderColor.onchange = getBorderColor;
function getBorderColor() {
    let node1 = diagram.nodes[0].fixedUserHandles[0];
    node1.handleStrokeColor = borderColor.value.toString();
    diagram.dataBind();
}

let borderWidth: any = document.getElementById('sWidth');
borderWidth.onchange = getBorderWidth;
function getBorderWidth() {
    let node1 = diagram.nodes[0].fixedUserHandles[0];
    node1.handleStrokeWidth = parseInt(borderWidth.value);
    diagram.dataBind();
}

let Width: any = document.getElementById('Width');
Width.onchange = getWidth;
function getWidth() {
    let node1 = diagram.nodes[0].fixedUserHandles[0];
    node1.width = parseInt(Width.value);
    diagram.dataBind();
}

let height: any = document.getElementById('Height');
height.onchange = getHeight;
function getHeight() {
    let node1 = diagram.nodes[0].fixedUserHandles[0];
    node1.height = parseInt(height.value);
    diagram.dataBind();
}
let offsetX: any = document.getElementById('offsetx');
offsetX.onchange = getOffsetX;
function getOffsetX() {
    let node1 = diagram.nodes[0].fixedUserHandles[0];
    node1.offset.x = offsetX.value;
    diagram.dataBind();
}

let offsetY: any = document.getElementById('offsety');
offsetY.onchange = getOffsetY;
function getOffsetY() {
   let node1 = diagram.nodes[0].fixedUserHandles[0];
    node1.offset.y = offsetY.value;
    diagram.dataBind();
}

let Align: any = document.getElementById('Align');
Align.onchange = getAlign;
function getAlign() {
    let node1 = diagram.connectors[0].fixedUserHandles[0];
    if (Align.value === 'Center') {
        node1.alignment = 'Center';
    } else if (Align.value === 'Before') {
        node1.alignment = 'Before';
    } else if (Align.value === 'After') {
        node1.alignment = 'After';
    }
    diagram.dataBind();
}