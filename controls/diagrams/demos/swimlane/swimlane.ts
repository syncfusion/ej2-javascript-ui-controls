/**
 * Explores the types of nodes
 */

import {
    Diagram, UndoRedo, NodeModel, StackPanel, TextElement, ConnectorModel, PortConstraints, PortVisibility, PointModel, Rect, ShapeAnnotation, ShapeAnnotationModel, PointPortModel, DistributeOptions, NodeConstraints, ShadowModel, GradientType, GradientModel, LinearGradientModel, RadialGradientModel, Point
} from '../../src/diagram/index';

import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../src/diagram/primitives/matrix';
import { Group } from '@syncfusion/ej2-data';
import { Uploader } from '@syncfusion/ej2-inputs';
Diagram.Inject(UndoRedo);
let node: NodeModel = {};
let nodes: NodeModel[] = [
    {
        id: 'node1', offsetX: 600, offsetY: 250,
        shape: {
            type: 'SwimLane', orientation: 'Vertical',
            header: { content: { content: 'Header', style: { fontSize: 20, color: 'red' } }, style: { fill: 'gray' } },
            phases: [{ header: { content: { content: 'phase1' } }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 300 },
            // { header: { content: { content: 'phase2' } }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 100 }
        ],
            lanes: [
                {
                    id: 'lane1',//offset:100,
                    // childNodes: [{
                    //     id: 'node111',
                    //     width: 50, height: 50,
                    //     margin: { left: 30, top: 50 }
                    // }, {
                    //     id: 'node113rr',
                    //     width: 50, height: 50,
                    //     margin: { left: 50, top: 150 }
                    // }],
                    style: { fill: 'red', opacity: .4 }, height: 100,
                    header: {
                        content: { content: 'lane1' }
                    }
                },
                // {
                //     id: 'lane2', height: 100,
                //     childNodes: [{
                //         id: 'abc',
                //         width: 50, height: 50,
                //         margin: { left: 30, top: 50 }
                //     }, {
                //         id: 'efg',
                //         width: 50, height: 50,
                //         margin: { left: 50, top: 150 }
                //     }],
                //     style: { fill: 'red', opacity: .4 },
                //     header: {
                //         content: { content: 'lane1' }, style: { fill: 'red' }
                //     }
                // }
            ]
        }
    },

    // {
    //     id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
    //     shape:{type:'Image',source:''
    //     //    Headers:[{content:'Header'}],
    //     //     Phases:[{content:'Phase1'},{content:'Phase1'}],
    //     //     Lanes:[{id:'lane1'},{id:'lane2'}]
    //         }
    // }
];

let connectors: ConnectorModel[] = [
    {
        id: 'connector1', sourceID: 'node111', targetID: 'node113rr'
    }
]



//nodes = [{ id: 'root', offsetX: 300, offsetY: 300 }];

let getTextElement: Function = (text: string) => {
    let textElement: TextElement = new TextElement();
    textElement.width = 50;
    textElement.height = 20;
    textElement.content = text;
    return textElement;
};

let addRows: Function = (column: StackPanel) => {
    column.children.push(getTextElement('Row1'));
    column.children.push(getTextElement('Row2'));
    column.children.push(getTextElement('Row3'));
    column.children.push(getTextElement('Row4'));
};

let diagram: Diagram = new Diagram({
    width: '100%', height: 900, nodes: nodes, connectors: connectors,
    setNodeTemplate: (obj: NodeModel, diagram: Diagram): StackPanel => {
        if (obj.id.indexOf('node5') !== -1) {
            //it will be replaced with grid panel
            let table: StackPanel = new StackPanel();
            table.orientation = 'Horizontal';

            let column1: StackPanel = new StackPanel();
            column1.children = [];
            column1.children.push(getTextElement('Column1'));
            addRows(column1);

            let column2: StackPanel = new StackPanel();
            column2.children = [];
            column2.children.push(getTextElement('Column2'));
            addRows(column2);

            table.children = [column1, column2];
            return table;
        }
        return null;
    },
    // getNodeDefaults: (obj: NodeModel) => {
    //     let defaults: NodeModel = {
    //         width: 150, height: 50, offsetX: 100, offsetY: 100,
    //     };
    //     return defaults;
    // }
});
diagram.scrollSettings.canAutoScroll = true;
diagram.appendTo('#diagram');


