/**
 * Explores the types of nodes
 */

import {Diagram, UndoRedo, NodeModel, DiagramTools, RealAction, DiagramEvent, IScrollChangeEventArgs, IBlazorScrollChangeEventArgs} from '../../src/diagram/index';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
Diagram.Inject(UndoRedo);
let mouseevents: MouseEvents = new MouseEvents();
let diagevents: DiagramEvent;
let nodes: NodeModel[] = [
    {
        id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, pivot: {x: 0,y: 0}
    },
  
];
let diagram: Diagram = new Diagram({
    width: '100%', height: 900, nodes: nodes,
    tool: DiagramTools.ZoomPan,
});
diagram.appendTo('#diagram');
var diagramCanvas = document.getElementById('diagramcontent');
diagram.click = function (args) {
    console.log(args.button);
};
mouseevents.clickEvent(diagramCanvas,400,300);

