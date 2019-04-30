/**
 * Default FlowShape sample
 */
import {
    Diagram, NodeModel, Node, SwimLane
} from '../../src/diagram/index';
import { PaletteModel, SymbolPalette } from '../../src/symbol-palette/index';

let palettes: PaletteModel[] = [
    {
        id: 'swimlaneShapes', expanded: true,
        title: 'Swimlane Shapes',
        symbols: [
            {
                id: 'stackCanvas1',
                shape: {
                    type: 'SwimLane',lanes: [
                        {
                            id: 'lane1',
                            style: { fill: '#f5f5f5'},height: 60, width: 150,
                                            header:{ width: 50, height: 50, style: {fill:'#C7D4DF', fontSize: 11} },
                        }
                    ],
                    orientation: 'Horizontal', isLane: true
                },
                height: 60,
                width: 140,
                style: { fill: '#f5f5f5'},
                offsetX: 70,
                offsetY: 30,
            }, {
                id: 'stackCanvas2',
                shape: {
                    type: 'SwimLane',
                    lanes: [
                        {
                            id: 'lane1',
                            style: { fill: '#f5f5f5'}, height: 150, width: 60,
                                            header:{ width: 50, height: 50, style: {fill:'#C7D4DF', fontSize: 11} },
                        }
                    ],
                    orientation: 'Vertical', isLane: true
                },
                height: 140,
                width: 60,
                style: { fill: '#f5f5f5'},
                offsetX: 70,
                offsetY: 30,
            }, {
                id: 'verticalPhase',
                shape: {
                    type: 'SwimLane',
                    phases: [{style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#A9A9A9'},}],
                    annotations: [{text: ''}],
                    orientation: 'Vertical', isPhase: true
                },
                height: 60,
                width: 140
            }, {
                id: 'horizontalPhase',
                shape: {
                    type: 'SwimLane',
                    phases: [{style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#A9A9A9'},}],
                    annotations: [{text: ''}],
                    orientation: 'Horizontal', isPhase: true
                },
                height: 60,
                width: 140
            }
        ]
    }
];

let nodes: NodeModel[] = [ {
    id: 'stackCanvas1',
    shape: {
        type: 'SwimLane',lanes: [
            {
                id: 'lane1',
                style: { fill: '#f5f5f5'},height: 60, width: 150,
                                header:{ width: 50, height: 50, style: {fill:'#C7D4DF', fontSize: 11} },
            }
        ],
        orientation: 'Horizontal', isLane: true,
        data: 'M0,0 L0,100'
    },
    height: 60,
    width: 140,
    style: { fill: '#f5f5f5'},
    offsetX: 170,
    offsetY: 130,
}, {
    id: 'stackCanvas2',
    shape: {
        type: 'SwimLane',
        lanes: [
            {
                id: 'lane1',
                style: { fill: '#f5f5f5'}, height: 60, width: 150,
                                header:{ width: 50, height: 50, style: {fill:'#C7D4DF', fontSize: 11} },
            }
        ],
        orientation: 'Vertical', isLane: true
    },
    height: 140,
    width: 60,
    style: { fill: '#f5f5f5'},
    offsetX: 370,
    offsetY: 130,
},]

let symbolPalette: SymbolPalette = new SymbolPalette ({
    palettes: palettes,
    symbolHeight: 50, symbolWidth: 50,
    symbolPreview: { width: 100, height: 100},
    expandMode: 'Multiple',
    height: '400px',
    width: '200px',
});
symbolPalette.appendTo('#symbolpalette');

let diagram: Diagram = new Diagram({
    width: '100%',
    height:'800px',
    nodes: nodes
});

diagram.appendTo('#diagram');
diagram.dragEnter = function (arg) {
    if (arg.element instanceof Node) {
        if ((arg.element.shape as SwimLane).orientation === "Horizontal") {
            (arg.element.shape as SwimLane).lanes[0].height = 100;
            (arg.element.shape as SwimLane).lanes[0].width = 500;
        } else if ((arg.element.shape as SwimLane).orientation === "Vertical") {
            (arg.element.shape as SwimLane).lanes[0].height = 500;
            (arg.element.shape as SwimLane).lanes[0].width = 100;
        }
    }
};