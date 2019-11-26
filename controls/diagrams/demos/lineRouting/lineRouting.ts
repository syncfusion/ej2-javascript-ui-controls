import {
    Diagram, UndoRedo, PortVisibility, BpmnDiagrams, PointModel, LineRouting, DiagramConstraints, Connector, NodeModel, ConnectorModel
} from '../../src/diagram/index';
import {createSvgElement, createHtmlElement } from '../../src/diagram/utility/dom-util';

import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../src/diagram/primitives/matrix';

Diagram.Inject(UndoRedo, LineRouting, BpmnDiagrams);

// Node to Node

function getIntermediatePoints(points: PointModel[], value: string) {
    var output = 'expect(';
    for (var i = 0; i < points.length; i++) {
        output += value + '.intermediatePoints[' + i + '].x ==' + points[i].x +
            '&&' + value + '.intermediatePoints[' + i + '].y ==' + points[i].y + '&&';
    }
    output += ').toBe(true);';
    return output;
}
let nodes: NodeModel[] = [
    {
        id: 'node0',
        offsetX: 100,
        offsetY: 100,
        width: 30,
        height: 30,
        annotations: [{
          content: 'Start',
          margin: { bottom: -30 }
        }],
        shape: {
          type: 'Bpmn',
          shape: 'Event',
          event: {
            event: 'Start',
            trigger: 'None'
          }
        },
        style: {
          strokeColor: '#62A716',
          strokeWidth: 1
        }
      },
      {
        id: 'node1',
        offsetX: 250,
        offsetY: 250,
        width: 90,
        height: 60,
        annotations: [
          {
            width: 72,
            height: 48,
            content: 'Activity1',
            style: {
              textOverflow: 'Clip',
              textWrapping: 'Wrap',
              whiteSpace: 'PreserveAll'
            }
          }
        ],
        /*borderColor: '#78BE83',*/
        borderWidth: 4,
        shape: {
          type: 'Bpmn',
          shape: 'Activity',
          activity: {
            activity: 'Task',
            task: {
              type: 'Service'
            }
          }
        },
        style: {
          fill: '#d8ecdc',
          strokeColor: '#78BE83',
          strokeWidth: 3,
          gradient: {
            // Start point of linear gradient
            x1: 0,
            y1: 0,
            // End point of linear gradient
            x2: 1,
            y2: 1,
            // Sets an array of stop objects
            stops: [
              {
                color: 'white',
                offset: 30,
                opacity: 0.1
              },
              {
                color: '#d8ecdc',
                offset: 100,
                opacity: 0.1
              }
            ],
            type: 'Linear'
          }
        }
      },
      {
        id: 'node2',
        offsetX: 250,
        offsetY: 500,
        width: 90,
        height: 60,
        /*borderColor: '#78BE83',*/
        borderWidth: 4,
        shape: {
          type: 'Flow',
          shape: 'Annotation',
        },
        annotations: [
          {
            content: `Sample Text`,
            // horizontalAlignment: 'Left',
            style: {
              textOverflow: 'Ellipsis',
              textWrapping: 'NoWrap',
              // textAlign: 'Left',
              whiteSpace: 'CollapseAll'
            },
            height: 50,
            width: 80,
            margin: { left: 0, top: 0, right: 0, bottom: 0 }
          }
        ],
        style: {
          strokeColor: '#778899',
          strokeWidth: 3
        }
      },
      {
        id: 'node3',
        offsetX: 480,
        offsetY: 218,
        width: 90,
        height: 60,
        annotations: [
          {
            width: 72,
            height: 48,
            content: 'Activity3',
            style: {
              textOverflow: 'Clip',
              textWrapping: 'Wrap',
              whiteSpace: 'PreserveAll'
            }
          }
        ],
        /*borderColor: '#78BE83',*/
        borderWidth: 4,
        shape: {
          type: 'Bpmn',
          shape: 'Activity',
          activity: {
            activity: 'Task',
            task: {
              type: 'Service'
            }
          }
        },
        style: {
          fill: '#d8ecdc',
          strokeColor: '#78BE83',
          strokeWidth: 3,
          gradient: {
            // Start point of linear gradient
            x1: 0,
            y1: 0,
            // End point of linear gradient
            x2: 1,
            y2: 1,
            // Sets an array of stop objects
            stops: [
              {
                color: 'white',
                offset: 30,
                opacity: 0.1
              },
              {
                color: '#d8ecdc',
                offset: 100,
                opacity: 0.1
              }
            ],
            type: 'Linear'
          }
        }
      },
      {
        id: 'node4',
        offsetX: 700,
        offsetY: 195,
        width: 90,
        height: 60,
        annotations: [
          {
            width: 72,
            height: 48,
            content: 'Activity4',
            style: {
              textOverflow: 'Clip',
              textWrapping: 'Wrap',
              whiteSpace: 'PreserveAll'
            }
          }
        ],
        /*borderColor: '#78BE83',*/
        borderWidth: 4,
        shape: {
          type: 'Bpmn',
          shape: 'Activity',
          activity: {
            activity: 'Task',
            task: {
              type: 'Service'
            }
          }
        },
        style: {
          fill: '#d8ecdc',
          strokeColor: '#78BE83',
          strokeWidth: 3,
          gradient: {
            // Start point of linear gradient
            x1: 0,
            y1: 0,
            // End point of linear gradient
            x2: 1,
            y2: 1,
            // Sets an array of stop objects
            stops: [
              {
                color: 'white',
                offset: 30,
                opacity: 0.1
              },
              {
                color: '#d8ecdc',
                offset: 100,
                opacity: 0.1
              }
            ],
            type: 'Linear'
          }
        }
      },
      {
        id: 'node5',
        offsetX: 678,
        offsetY: 502,
        width: 90,
        height: 60,
        annotations: [
          {
            width: 72,
            height: 48,
            content: 'Activity4',
            style: {
              textOverflow: 'Clip',
              textWrapping: 'Wrap',
              whiteSpace: 'PreserveAll'
            }
          }
        ],
        /*borderColor: '#78BE83',*/
        borderWidth: 4,
        shape: {
          type: 'Bpmn',
          shape: 'Activity',
          activity: {
            activity: 'Task',
            task: {
              type: 'Service'
            }
          }
        },
        style: {
          fill: '#d8ecdc',
          strokeColor: '#78BE83',
          strokeWidth: 3,
          gradient: {
            // Start point of linear gradient
            x1: 0,
            y1: 0,
            // End point of linear gradient
            x2: 1,
            y2: 1,
            // Sets an array of stop objects
            stops: [
              {
                color: 'white',
                offset: 30,
                opacity: 0.1
              },
              {
                color: '#d8ecdc',
                offset: 100,
                opacity: 0.1
              }
            ],
            type: 'Linear'
          }
        }
      },
      {
        id: 'node6',
        offsetX: 480,
        offsetY: 62,
        width: 90,
        height: 60,
        annotations: [
          {
            width: 72,
            height: 48,
            content: 'Activity3',
            style: {
              textOverflow: 'Clip',
              textWrapping: 'Wrap',
              whiteSpace: 'PreserveAll'
            }
          }
        ],
        /*borderColor: '#78BE83',*/
        borderWidth: 4,
        shape: {
          type: 'Bpmn',
          shape: 'Activity',
          activity: {
            activity: 'Task',
            task: {
              type: 'Service'
            }
          }
        },
        style: {
          fill: '#d8ecdc',
          strokeColor: '#78BE83',
          strokeWidth: 3,
          gradient: {
            // Start point of linear gradient
            x1: 0,
            y1: 0,
            // End point of linear gradient
            x2: 1,
            y2: 1,
            // Sets an array of stop objects
            stops: [
              {
                color: 'white',
                offset: 30,
                opacity: 0.1
              },
              {
                color: '#d8ecdc',
                offset: 100,
                opacity: 0.1
              }
            ],
            type: 'Linear'
          }
        }
      },
];

let connectors: ConnectorModel[] = [
    {
        id: 'Connector1',
        sourceID: 'node0',
        targetID: 'node1',
        style: {
          strokeColor: '#888888',
          fill: '#555555',
          strokeWidth: 1
        },
        targetDecorator: {
          style: {
            fill: '#555555',
            strokeColor: '#888888'
          }
        },
        type: 'Orthogonal',
        cornerRadius: 10
      },
      {
        id: 'Connector2',
        sourceID: 'node1',
        targetID: 'node2',
        /*shape: {
          type: 'Bpmn',
          flow: 'Association',
          association: 'Directional'
        },*/
        style: {
          strokeDashArray: '2,2'
        },
        targetDecorator: {
          shape: 'None'
        },
        type: 'Orthogonal',
        cornerRadius: 10
      },
      {
        id: 'Connector3',
        sourceID: 'node1',
        targetID: 'node3',           
        style: {
          strokeColor: '#888888',
          fill: '#555555',
          strokeWidth: 1
        },
        targetDecorator: {
          style: {
            fill: '#555555',
            strokeColor: '#888888'
          }
        },
        type: 'Orthogonal',
        cornerRadius: 10
      },
      {
        id: 'Connector4',
        sourceID: 'node3',
        targetID: 'node4',
        style: {
          strokeColor: '#888888',
          fill: '#555555',
          strokeWidth: 1
        },
        targetDecorator: {
          style: {
            fill: '#555555',
            strokeColor: '#888888'
          }
        },
        type: 'Orthogonal',
        cornerRadius: 10
      },
      {
        id: 'Connector5',
        sourceID: 'node4',
        targetID: 'node5',
        style: {
          strokeColor: '#888888',
          fill: '#555555',
          strokeWidth: 1
        },
        targetDecorator: {
          style: {
            fill: '#555555',
            strokeColor: '#888888'
          }
        },
        type: 'Orthogonal',
        cornerRadius: 10
      },
      {
        id: 'Connector6',
        sourceID: 'node5',
        targetID: 'node6',
        style: {
          strokeColor: '#888888',
          fill: '#555555',
          strokeWidth: 1
        },
        targetDecorator: {
          style: {
            fill: '#555555',
            strokeColor: '#888888'
          }
        },
        type: 'Orthogonal',
        cornerRadius: 10
      },
];

let diagram: Diagram = new Diagram({
    width: '100%', height: 900, nodes: nodes, connectors: connectors,
    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
    getConnectorDefaults: function(connector: ConnectorModel){
        connector.type = 'Orthogonal';
        return connector;
    }
});

diagram.appendTo('#diagram');
document.getElementById('lineRouting').onclick = function(){
    diagram.constraints = DiagramConstraints.Default | DiagramConstraints.LineRouting;
    diagram.dataBind();
    diagram.resetSegments();
}
document.getElementById('DisablelineRouting').onclick = function(){
    diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.LineRouting;
    diagram.dataBind();
    diagram.resetSegments();
}