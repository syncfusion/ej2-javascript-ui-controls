import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, PathModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel} from '../../../src/diagram/objects/connector-model';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { Container } from '../../../src/diagram/core/containers/container';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
import { PortVisibility, PortConstraints } from '../../../src/diagram/enum/enum';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { ICollectionChangeEventArgs } from '../../../src/index';


/**
 * Test cases for default ports and port positions
 */
describe('Diagram Control', () => {

    describe('Center Ports', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram101' });
            document.body.appendChild(ele);
            let node: NodeModel = { shape: {}, style: {} };
            node.id = 'node';
            node.width = 100; node.height = 100;
            node.offsetX = 300; node.offsetY = 300;
            node.shape = { type: 'Path' };
            (node.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,' +
                '194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport: PointPortModel = { offset: {} };
            nodeport.shape = 'Square';

            let nodeport12: PointPortModel = { offset: {} };
            node.ports = [nodeport, nodeport12];

            let node2: NodeModel = { shape: {}, style: {} };
            node2.id = 'node2'; node2.width = 100; node2.height = 100;
            node2.offsetX = 500;
            node2.offsetY = 300;
            node2.shape = { type: 'Path' };
            (node2.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,' +
                '194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport2: PointPortModel = { offset: {} };
            nodeport2.shape = 'Circle';
            node2.ports = [nodeport2];

            let node3: NodeModel = { shape: {}, style: {} };
            node3.id = 'node3'; node3.width = 100; node3.height = 100;
            node3.offsetX = 700;
            node3.offsetY = 300;
            node3.shape = { type: 'Path' };
            (node3.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,' +
                '194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport3: PointPortModel = { offset: {} };
            nodeport3.shape = 'X';
            node3.ports = [nodeport3];
            diagram = new Diagram({ width: 800, height: 800, nodes: [node, node2, node3] });
            diagram.appendTo('#diagram101');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking default port', (done: Function) => {
            let container1: Container = (diagram.nodes[0] as Node).wrapper;
            expect((container1.children[2] as PathElement).absolutePath === 'M 0 0 L 12 0 L 12 12 L 0 12 Z' &&
                container1.children[2].offsetX === 300 && container1.children[2].offsetY === 300 &&
                container1.children[2].actualSize.width === 12 && container1.children[2].actualSize.height === 12).toBe(true);
            done();
        });
        it('Checking square port at center', (done: Function) => {
            let container1: Container = (diagram.nodes[0] as Node).wrapper;
            expect((container1.children[1] as PathElement).absolutePath === 'M 0 0 L 12 0 L 12 12 L 0 12 Z' &&
                container1.children[1].offsetX === 300 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking circle port at center', (done: Function) => {
            let container1: Container = (diagram.nodes[1] as Node).wrapper;
            expect((container1.children[1] as PathElement).absolutePath === 'M 0 6 A 6 6 0 1 1 12 6 A 6 6 0 1 1 0 6 Z' &&
                container1.children[1].offsetX === 500 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking X port at center', (done: Function) => {
            let container1: Container = (diagram.nodes[2] as Node).wrapper;
            expect((container1.children[1] as PathElement).absolutePath === 'M 0 0 L 12 12 M 12 0 L 0 12' &&
                container1.children[1].offsetX === 700 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });
        it('Checking port at 0,0', (done: Function) => {
            (diagram.nodes[0] as Node).ports[0].offset.x = 0;
            (diagram.nodes[0] as Node).ports[0].offset.y = 0;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[0] as Node).wrapper;
            expect(container1.children[1].offsetX === 250 && container1.children[1].offsetY === 250 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking circle port at 0,0.5', (done: Function) => {
            (diagram.nodes[1] as Node).ports[0].offset.x = 0;
            (diagram.nodes[1] as Node).ports[0].offset.y = 0.5;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[1] as Node).wrapper;
            expect(container1.children[1].offsetX === 450 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking square port at 0,1', (done: Function) => {
            (diagram.nodes[2] as Node).ports[0].offset.x = 0;
            (diagram.nodes[2] as Node).ports[0].offset.y = 1;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[2] as Node).wrapper;
            expect(container1.children[1].offsetX === 650 && container1.children[1].offsetY === 350 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });
        it('Checking port at 1,0', (done: Function) => {
            (diagram.nodes[0] as Node).ports[0].offset.x = 1;
            (diagram.nodes[0] as Node).ports[0].offset.y = 0;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[0] as Node).wrapper;
            expect(container1.children[1].offsetX === 350 && container1.children[1].offsetY === 250 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking circle port at 1,0.5', (done: Function) => {
            (diagram.nodes[1] as Node).ports[0].offset.x = 1;
            (diagram.nodes[1] as Node).ports[0].offset.y = 0.5;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[1] as Node).wrapper;
            expect(container1.children[1].offsetX === 550 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking square port at 1,1', (done: Function) => {
            (diagram.nodes[2] as Node).ports[0].offset.x = 1;
            (diagram.nodes[2] as Node).ports[0].offset.y = 1;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[2] as Node).wrapper;
            expect(container1.children[1].offsetX === 750 && container1.children[1].offsetY === 350 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });
        it('Checking port at 0.5,0', (done: Function) => {
            (diagram.nodes[1] as Node).ports[0].offset.x = 0.5;
            (diagram.nodes[1] as Node).ports[0].offset.y = 0;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[0] as Node).wrapper;
            expect(container1.children[1].offsetX === 350 && container1.children[1].offsetY === 250 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking circle port at 0.5,0.5', (done: Function) => {
            (diagram.nodes[1] as Node).ports[0].offset.x = 0.5;
            (diagram.nodes[1] as Node).ports[0].offset.y = 0.5;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[1] as Node).wrapper;
            expect(container1.children[1].offsetX === 500 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking square port at 0.5,1', (done: Function) => {
            (diagram.nodes[2] as Node).ports[0].offset.x = 0.5;
            (diagram.nodes[2] as Node).ports[0].offset.y = 1;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[2] as Node).wrapper;
            expect(container1.children[1].offsetX === 700 && container1.children[1].offsetY === 350 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });
        it('Checking updation of custom port', (done: Function) => {
            (diagram.nodes[2] as Node).ports[0].shape = 'Custom';
            (diagram.nodes[2] as Node).ports[0].pathData = 'M6.805,0L13.61,10.703L0,10.703z';
            diagram.dataBind();
            expect((diagram.nodes[2] as Node).ports[0].pathData === 'M6.805,0L13.61,10.703L0,10.703z').toBe(true);
            done();
        });
        it('memory leak', () => { 
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        })
    });

    describe('Port drag issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramPortDragIssue' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: "node", offsetX: 250, offsetY: 250, width: 100, height: 100, rotateAngle: 180, annotations: [{content: "Test"}],
                ports: [
                    {
                        id: "port", width: 25, height: 25, offset: {x: 0.5, y: 1},
                        visibility: PortVisibility.Visible, constraints: PortConstraints.Drag | PortConstraints.OutConnect
                    }
                ]
            };
            let connector: ConnectorModel = {sourceID: "node", sourcePortID: "port", targetPoint: { x: 350, y: 250 }};
            diagram = new Diagram({ width: 800, height: 800, nodes: [node], connectors: [connector] });
            diagram.appendTo('#diagramPortDragIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking drag port when rotate angle is 90 degree', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let nodePort: PointPortModel = diagram.nodes[0].ports[0];
            let connectorSourcePoint: PointModel = diagram.connectors[0].sourcePoint;
            expect(nodePort.offset.x === 0.5 && nodePort.offset.y === 1).toBe(true);
            expect(connectorSourcePoint.x === 250 && connectorSourcePoint.y === 200).toBe(true);
            let bounds: ClientRect = document.getElementById('node').getBoundingClientRect();
            let mE: MouseEvents = new MouseEvents();
            mE.mouseMoveEvent(diagramCanvas, (bounds.left + (bounds.width / 2)), (bounds.top - 10));
            mE.mouseDownEvent(diagramCanvas, (bounds.left + (bounds.width / 2)), (bounds.top - 10));
            mE.mouseMoveEvent(diagramCanvas, 500, 100);
            mE.mouseUpEvent(diagramCanvas, 500, 100);
            expect(nodePort.offset.x === -1.92 && nodePort.offset.y === 1.98).toBe(true);
            expect(connectorSourcePoint.x === 492 && connectorSourcePoint.y === 102).toBe(true);
            done();
        });
    });
    describe('Port constraint issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramPortDragIssue' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: "node", offsetX: 250, offsetY: 250, width: 100, height: 100, rotateAngle: 180, annotations: [{ content: "Test" }],
                ports: [
                    {
                        id: "port", width: 25, height: 25, offset: { x: 0.5, y: 1 },
                        visibility: PortVisibility.Visible, constraints: PortConstraints.Drag
                    }
                ]
            };
            let connector: ConnectorModel = { sourceID: "node", sourcePortID: "port", targetPoint: { x: 350, y: 250 } };
            diagram = new Diagram({ width: 800, height: 800, nodes: [node], connectors: [connector] });
            diagram.appendTo('#diagramPortDragIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking drag port with constraints', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let nodePort: PointPortModel = diagram.nodes[0].ports[0];
            let connectorSourcePoint: PointModel = diagram.connectors[0].sourcePoint;
            expect(diagram.connectors[0].sourcePortID == "port").toBe(true);
            done();
        });

        it('Checking port with serialization', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let nodePort: PointPortModel = diagram.nodes[0].ports[0];
            let connectorSourcePoint: PointModel = diagram.connectors[0].sourcePoint;
            let saveData = '{"width":"100%","height":"700px","nodes":[{"shape":{"type":"Flow","shape":"Process"},"id":"Meeting","height":60,"offsetX":309,"offsetY":160,"annotations":[{"content":"Start Transaction","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","color":"white","bold":false,"textWrapping":"WrapWithOverflow","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"id":"0annotation","hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"zIndex":1,"width":145,"style":{"fill":"#357BD2","strokeColor":"white","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"ports":[{"id":"port1","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8},{"id":"port2","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8},{"id":"port3","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8},{"id":"port4","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":1}],            "container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":145,"height":60},"offsetX":309,"offsetY":160},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":["connector2"],"parentId":"","processId":"","umlIndex":-1},{"shape":{"type":"Flow","shape":"Process"},"id":"BoardDecision","height":60,"offsetX":309,"offsetY":240,"annotations":[{"content":"Verification","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","color":"white","bold":false,"textWrapping":"WrapWithOverflow","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"id":"0annotation","hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"zIndex":2,"width":145,"style":{"fill":"#357BD2","strokeColor":"white","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"ports":[{"id":"port1","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8},{"id":"port2","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":1},{"id":"port3","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8},{"id":"port4","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8}],"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":145,"height":60},"offsetX":309,"offsetY":240},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":["connector2"],"outEdges":[],"parentId":"","processId":"","umlIndex":-1},{"shape":{"type":"Flow","shape":"Process"},"id":"node11","height":60,"offsetX":539,"offsetY":330,"annotations":[{"content":"Enter payment method","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","color":"white","bold":false,"textWrapping":"WrapWithOverflow","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"id":"0annotation","hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"zIndex":5,"width":145,"style":{"fill":"#357BD2","strokeColor":"white","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"ports":[{"id":"port1","shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8},{"id":"port2","shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8},{"id":"port3","shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8},{"id":"port4","shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8}],"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":145,"height":60},"offsetX":539,"offsetY":330},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"inEdges":[],"outEdges":[],"parentId":"","processId":"","umlIndex":-1}],"connectors":[{"shape":{"type":"None"},"id":"connector2","sourceID":"Meeting","targetID":"BoardDecision","zIndex":12,"type":"Orthogonal","targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"segments":[{"type":"Orthogonal","direction":null}],"sourcePortID":"","targetPortID":"","sourcePoint":{"x":309,"y":190},"targetPoint":{"x":309,"y":210},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"style":{"strokeWidth":1,"strokeColor":"black","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":20},"offsetX":309,"offsetY":200},"annotations":[],"visible":true,"constraints":11838,"hitPadding":10,"parentId":""}],"snapSettings":{"horizontalGridlines":{"lineColor":"#e0e0e0","lineIntervals":[1,9,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75],"snapIntervals":[20],"lineDashArray":""},"verticalGridlines":{"lineColor":"#e0e0e0","lineIntervals":[1,9,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75,0.25,9.75],"snapIntervals":[20],"lineDashArray":""},"constraints":31},"getNodeDefaults":{},"getConnectorDefaults":{},"dragEnter":{},"enableRtl":false,"locale":"en-US","enablePersistence":false,"scrollSettings":{"viewPortWidth":463,"viewPortHeight":700,"currentZoom":1,"horizontalOffset":0,"verticalOffset":16,"minZoom":0.2,"maxZoom":30,"scrollLimit":"Diagram"},"rulerSettings":{"showRulers":false},"backgroundColor":"transparent","constraints":500,"layout":{"type":"None","enableAnimation":true},"contextMenuSettings":{},"dataSourceSettings":{"dataManager":null,"crudAction":{"read":""},"connectionDataSource":{"crudAction":{"read":""}}},"mode":"SVG","layers":[{"id":"default_layer","visible":true,"lock":false,"objects":["Meeting","BoardDecision","node11","connector2"],"zIndex":0}],"pageSettings":{"boundaryConstraints":"Infinity","orientation":"Landscape","height":null,"width":null,"background":{"source":"","color":"transparent"},"showPageBreaks":false},"selectedItems":{"nodes":[],"connectors":[],"wrapper":null,"constraints":16382,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"width":145,"height":60,"offsetX":489,"offsetY":630,"userHandles":[]},"basicElements":[],"tooltip":{"content":"","relativeMode":"Mouse"},"commandManager":{"commands":[]},"tool":3}'
            diagram.loadDiagram(saveData);
            let value = JSON.parse(saveData)
            expect(value.nodes.length > 0).toBe(true);
            done();
        });

    });

    describe('Checking after flip', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramPortDragIssue' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 300, offsetY: 300,flip:'Horizontal',
                ports: [
                    {
                        id: 'feed1',
                        shape: 'Circle',
                        offset: {
                            x: 0.1,
                            y: 0,
                        }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default | PortConstraints.Draw
                    },

                    {
                        id: 'outlet',
                        shape: 'Circle',
                        offset: {
                            x: 1,
                            y: 0.8,
                        }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default | PortConstraints.Draw
                    },
                ],
            };

            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{id:'node2', content: 'Label', style: { fill: 'white' } }],
                shape: {
                    type: 'Native',
                    content: '<g xmlns="http://www.w3.org/2000/svg">' +
                        '<rect height="256" width="256" fill="#34353F"/>' +
                        '<path id="path1" transform="rotate(0,128,128) translate(59.1078108549118,59) scale(4.3125,4.3125)  " fill="#FFFFFF" d="M12.12701,24.294998C12.75201,24.294998 13.258998,24.803009 13.258998,25.428009 13.258998,26.056 12.75201,26.563004 12.12701,26.563004 11.499019,26.563004 10.993007,26.056 10.993007,25.428009 10.993007,24.803009 11.499019,24.294998 12.12701,24.294998z M7.9750035,24.294998C8.6010101,24.294998 9.1090057,24.803009 9.1090057,25.428009 9.1090057,26.056 8.6010101,26.563004 7.9750035,26.563004 7.3480199,26.563004 6.8399942,26.056 6.8399942,25.428009 6.8399942,24.803009 7.3480199,24.294998 7.9750035,24.294998z M7.9750035,20.286011C8.6010101,20.286011 9.1090057,20.792999 9.1090057,21.419006 9.1090057,22.044006 8.6010101,22.552002 7.9750035,22.552002 7.3500035,22.552002 6.8420084,22.044006 6.8420084,21.419006 6.8420084,20.792999 7.3500035,20.286011 7.9750035,20.286011z M18.499994,19.317001C18.313013,19.317001,18.156,19.472,18.156,19.656006L18.156,27.01001C18.156,27.195007,18.313013,27.350006,18.499994,27.350006L29.521993,27.350006C29.707998,27.350006,29.865988,27.195007,29.865988,27.01001L29.865988,19.656006C29.865988,19.472,29.707998,19.317001,29.521993,19.317001z M17.243006,17.443008L30.778003,17.443008C31.425007,17.445007,31.947986,17.962006,31.950001,18.602997L31.950001,28.542007C31.947986,29.182999,31.425007,29.702011,30.778003,29.703003L25.654012,29.703003C25.511007,29.703003 25.399008,29.824997 25.413992,29.964996 25.430013,30.13501 25.452993,30.360001 25.477011,30.559998 25.506002,30.809998 25.727987,30.980011 25.976003,31.033997L27.756002,31.419006C27.907003,31.452011 28.015005,31.584 28.015005,31.738007 28.015005,31.883011 27.895986,32 27.74999,32L27.571005,32 20.450004,32 20.318016,32C20.171013,32 20.053001,31.883011 20.053001,31.738007 20.053001,31.585007 20.161003,31.452011 20.312004,31.419998L22.115989,31.033005C22.35601,30.98201 22.572014,30.815002 22.596,30.574005 22.616997,30.363007 22.636009,30.130997 22.648002,29.960007 22.658012,29.819 22.542015,29.70401 22.399986,29.70401L17.243006,29.703003C16.596002,29.702011,16.072992,29.182999,16.071008,28.542007L16.071008,18.602997C16.072992,17.962006,16.596002,17.445007,17.243006,17.443008z M7.9750035,16.133011C8.6020172,16.133011 9.1100128,16.641006 9.1100128,17.268005 9.1100128,17.893997 8.6020172,18.402008 7.9750035,18.402008 7.3489964,18.402008 6.8410013,17.893997 6.8410013,17.268005 6.8410013,16.641006 7.3489964,16.133011 7.9750035,16.133011z M24.027,13.762009C24.654014,13.762009 25.16201,14.270004 25.16201,14.895996 25.16201,15.522003 24.654014,16.029999 24.027,16.029999 23.400993,16.029999 22.892998,15.522003 22.892998,14.895996 22.892998,14.270004 23.400993,13.762009 24.027,13.762009z M24.027,9.6110077C24.653007,9.6110077 25.161003,10.119003 25.161003,10.74501 25.161003,11.37001 24.653007,11.878006 24.027,11.878006 23.402,11.878006 22.894005,11.37001 22.894005,10.74501 22.894005,10.119003 23.402,9.6110077 24.027,9.6110077z M24.027,5.6000061C24.654014,5.6000061 25.16201,6.1080017 25.16201,6.7350006 25.16201,7.3610077 24.654014,7.8690033 24.027,7.8690033 23.400993,7.8690033 22.892998,7.3610077 22.892998,6.7350006 22.892998,6.1080017 23.400993,5.6000061 24.027,5.6000061z M19.876001,5.6000061C20.503013,5.6000061 21.011009,6.1080017 21.011009,6.7350006 21.011009,7.3610077 20.503013,7.8690033 19.876001,7.8690033 19.249994,7.8690033 18.743006,7.3610077 18.743006,6.7350006 18.743006,6.1080017 19.249994,5.6000061 19.876001,5.6000061z M2.4290157,1.8740082C2.2420037,1.8740082,2.0850215,2.029007,2.0850215,2.2140045L2.0850215,9.5680084C2.0850215,9.753006,2.2420037,9.9069977,2.4290157,9.9069977L13.451014,9.9069977C13.637995,9.9069977,13.795008,9.753006,13.795008,9.5680084L13.795008,2.2140045C13.795008,2.029007,13.637995,1.8740082,13.451014,1.8740082z M1.1730042,0L14.706996,0C15.353999,0.0019989014,15.877009,0.51899719,15.878993,1.1600037L15.878993,11.100006C15.877009,11.740005,15.353999,12.26001,14.706996,12.26001L9.5830047,12.26001C9.4399994,12.26001 9.3290069,12.382004 9.3420074,12.52301 9.3600128,12.692001 9.3829925,12.917999 9.4060028,13.117004 9.4349945,13.367004 9.6570099,13.53801 9.9049957,13.591003L11.684994,13.975998C11.835994,14.009003 11.945003,14.141998 11.945003,14.294998 11.945003,14.440002 11.826015,14.557007 11.679012,14.557007L11.499996,14.557007 4.3789966,14.557007 4.2470081,14.557007C4.1000049,14.557007 3.9819935,14.440002 3.9819937,14.294998 3.9819935,14.141998 4.0899952,14.009003 4.2409961,13.977005L6.0450113,13.589996C6.2860086,13.539001 6.501005,13.373001 6.5249918,13.130997 6.5460184,12.921005 6.5650003,12.688004 6.5769937,12.516998 6.5870035,12.376999 6.4710062,12.262009 6.3290079,12.262009L1.1730042,12.26001C0.52499391,12.26001,0.0020143806,11.740005,0,11.100006L0,1.1600037C0.0020143806,0.51899719,0.52499391,0.0019989014,1.1730042,0z"/>' +
                        '</g>'
                },
                flipMode: 'Label',
                flip: 'Horizontal',
                ports: [
                    {
                        shape: 'Circle',
                        offset: {
                            x: 0.1,
                            y: 0,
                        }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default | PortConstraints.Draw
                    },
                    {
                        shape: 'Circle',
                        offset: {
                            x: 1,
                            y: 0.8,
                        }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default | PortConstraints.Draw
                    },
                ],
            };

            let node3: NodeModel = {
                id: 'node4', width: 100, height: 150, offsetX: 700, offsetY: 100, style: { fill: 'none' }, annotations: [{id:'node3', content: 'None' }], flipMode: 'None',
                flip: 'Horizontal',
                shape: { type: 'Image', source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOIAAADfCAMAAADcKv+WAAAAsVBMVEX///8rNXz2kh4aJ3YeKnejpsGMkLAyPIIoM3u7vc8UI3UjLnlrcZ9fZZfCxNYKHHLc3efQ0d9LUoz1igD+8eP3n0IRIXRXXZJzeaQ5QoT95M32jQD1iAD2kBT96tj83MD+9/D70Kn4r2gAAGv5u4H+8+j6wYz6yp/3mTH71bP3pVI/R4b6xpf4s3H3okr4qVr2lib7zqX4sWwAEW/x8fXk5Ox9gqqsr8aRlbUAC26oq8Veod7kAAAEZ0lEQVR4nO2d4VbiMBBGQ8VV0BW0gC5toQooKgIusq77/g+2srhtgXaSaelJwvnu//HMPaWTzCSgEAAAAAAAQCeh7gRKZ+L3dKdQMn3fcfu6kyiVnus4jj/RnUaJhIGzwn3RnUh5jNeKjjcNdadSEjPP+SKYt3QnUwrDyPDT0evqTqcEXl0niXurO6G90/WdTfx73SntmZbrbOPNdCe1V0In2FF0vHaoO6890k4xXBWdw9nN3XlphqsHeSi7ufvdFzEqOoexm3vcLqZJDmI3181+hv8+q1PdCRZmlPUeRkVnPtKdYzHCeWox3XC0fDc3lRquXshH3WkW4EX2MV1j8W5uQpeaxHO8051qTsjlYhNLd3M91We4IggsbJNDlUqTcLRwNydfLrbwH3SnzGTGNfwsOkPZH62dnfCo3ESx3yvM2OoFnYzicrGJ9yRT7JzyqJ7HimfM2Aat+MApNTHBmN7N1eoVHmdJRWZsnVTsqy8XW450m2yOImu52ILczRmjmDqqUYZqk41RHBcxJHdzpijO8hTTJF7bcMVhUUPHfTVb8TZvMY0fYvYOwAjFnck+35AYk5ug2Cr8KQ3G2YYmKBZbLtaKodmKdwXW/DX0lQ4DFAs7+nTTaIKiuC9UblzJAYARipyBzQ6ebPxvhqLoenlLTiBrF01RFCP2SOPLcC4zNEZRiKdcq6MnP9wwR1G85CisvsLRhkGK4oFddHyVgw2TFEWf+RxdpWMNoxRFL+AUHe+niqFhiiIcqxedILMJNlqR0f4HTmipohgqvpCu6pGNeYqKIwBX+STcQEWl3ZyvfqvRREXRkhZWYlRjh6IIp3TRYd1oNFNR0iaToxprFMUku+gE5KjGHkWiTXZ59zXNVRS9jMIqGdXYpChGqUc5Lvd032TF1DaZs1zYoLjbJstHNbYpbrfJvOXCDsWtNtkLD1Bxo01mLhe2KIqw/b/oKI1qbFSM2mS1UY2dius2WXFUY6niqk1WHdXYqvjZJquOaqxVFL3c35WyRjE/UDwIxUGDx+J7FHu9YMYOajoU35pcllHskh37pkMRAAAAADFvl1yaUWyTHRsv/V02uRVrgw6PjQ0cMzaxgXO5+Lm/qqhrG86+8aZ8tA9FKEIRilCEIhShCEUoQhGKUIQiFKEIRShCEYpQhCIUoQhFKEIRilCEIhShCEUoQhGKUIQiFKFokmKjwA/cV/P/wH3AJf991IvnKya/otgbbuhzrNjmIvmhfgAAAACANc1vXI6j2Hd27GUU+5sdu0xLX4WLRZVH/SqKPe8wYxfvUezJETP2o5mWvpJih9tpXEexN+xOI/5a2I9TZmwDilDkAEUSKJJAEYosoEgCRRIoQpEFFEmgSAJFKLKAIgkUSaAIRRZQJIEiCRShyAKKJFAkgSIUWUCRBIokUIQiCyiSQJEEilBkAUUSKJJAkVL8OOLRSdxHbTBjE/dRK3Vm7OAyLX0Vlsdc4jRr7Nj4Sfxhx+IfOAEAAAAAAAAAKMhf3Xcl0U5GidEAAAAASUVORK5CYII=' },
                ports: [
                    {
                        shape: 'Circle',
                        offset: {
                            x: 0.1,
                            y: 0,
                        }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default | PortConstraints.Draw
                    },
                    {
                        shape: 'Circle',
                        offset: {
                            x: 1,
                            y: 0.8,
                        }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default | PortConstraints.Draw
                    },
                ],
            };

            let connector: ConnectorModel = {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePortID: 'outlet',
                sourceID: 'node',
                targetPoint: { x: 500, y: 550 },
            };
            diagram = new Diagram({ width: 800, height: 800, nodes: [node, node2, node3], connectors: [connector] });
            diagram.appendTo('#diagramPortDragIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        function numbersinranges(x: number, r: number, t: number) {
            if ((x >= r && x <= t)) {
                return true;
            }
            else {
                return false;
            }
        }

        it('Checking ports after flip', (done: Function) => {
            let nodePosition = document.getElementById('node_outlet_groupElement').getBoundingClientRect();
            let x1 = Math.round((nodePosition as any).x);
            let check: boolean = numbersinranges(x1, 250, 255)
            expect(check).toBe(true);
            done();
        });

        it('Checking Label after flip', (done: Function) => {
            let nodePosition = document.getElementById('node2_node2_groupElement');
            expect(nodePosition.attributes[1].nodeName === 'transform').toBe(true);
            done();
        });

        it('Checking Node after flip', (done: Function) => {
            let nodePosition = document.getElementById("node4_content_groupElement");
            expect(nodePosition.attributes[1].nodeName === 'transform').toBe(true);
            done();
        });


    });
    
    describe('Port edges', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramPortDragIssue' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: "node", offsetX: 250, offsetY: 250, width: 100, height: 100, rotateAngle: 180, annotations: [{content: "Test"}],
                ports: [
                    { id: "port", width: 25, height: 25, offset: {x: 0.5, y: 1}, visibility: PortVisibility.Visible },
                    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
                    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
                   
                ]
            };
            let connector: ConnectorModel = {id:"connector1",sourceID: "node", sourcePortID: "port", targetPoint: { x: 350, y: 250 }};
            diagram = new Diagram({ width: 800, height: 800, nodes: [node], connectors: [connector] });
            diagram.appendTo('#diagramPortDragIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking port inedges and out edges at runtime', (done: Function) => {
            expect((diagram.nodes[0].ports[0]).outEdges[0] ==="connector1").toBe(true);
            done();
            diagram.connectors[0].sourcePortID ="port2";
            diagram.dataBind();
            diagram.undo();
            expect((diagram.nodes[0].ports[0]).outEdges[0] ==="connector1").toBe(true);
            done();
            diagram.redo();
            expect((diagram.nodes[0].ports[0]).outEdges.length === 0).toBe(true);
            done();
            expect(((diagram.nodes[0].ports[1]).outEdges[0] === "connector1")).toBe(true);
            done();
        });
        it('Checking port inedges and out edges after copy paste', (done: Function) => {
            diagram.selectAll();
            diagram.copy();
            diagram.paste();
            expect(((diagram.nodes[1].ports[1]).outEdges[0] == diagram.connectors[1].id)).toBe(true);
            done();
        });
    });
    describe('Port edges', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramPortEdgeIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 800, height: 800,
                nodes: [{
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                },
                {
                    id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                    shape: { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' },
                    annotations: [{ content: 'Path Element' }]
                }],
                connectors: [{ id: 'Conne', sourceID: "node1", targetID: "node2", sourcePortID: "port4", targetPortID: "port1" }],
                getNodeDefaults: function (obj: NodeModel) {
                    var defaults = {
                        width: 150, height: 50, offsetX: 100, offsetY: 100,
                        ports: [
                            { id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0 } },
                            { id: 'port2', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 1, y: 0 } },
                            { id: 'port3', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 1 } },
                            { id: 'port4', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 1, y: 1 } }
                        ]
                    };
                    return defaults;
                },
            });
            diagram.appendTo('#diagramPortEdgeIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking port inedges and out edges at runtime', (done: Function) => {
            expect(diagram.nodes[0].ports[0].inEdges.length == 0 && diagram.nodes[0].ports[0].outEdges.length == 0).toBe(true);
            expect(diagram.nodes[0].ports[3].outEdges[0] == diagram.connectors[0].id &&
                diagram.nodes[1].ports[0].inEdges[0] == diagram.connectors[0].id).toBe(true);
            done();
        });
    });
    describe('Render port at diagram ports layer', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramPortDragIssue' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: "node", offsetX: 100, offsetY: 100, width: 100, height: 100, shape: {
                    type: 'HTML',
                    content: '<div style="height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>'
                },
                ports: [
                    { id: "port", width: 25, height: 25, offset: { x: 0.5, y: 0.5 }, visibility: PortVisibility.Visible },
                    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
                    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }

                ]
            };
            diagram = new Diagram({ width: 700, height: 600, nodes: [node] });
            diagram.appendTo('#diagramPortDragIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('port dragging', (done: Function) => {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let mouseEvents: MouseEvents = new MouseEvents();
            let node: NodeModel = diagram.nodes[0];
            node.ports[0].constraints = PortConstraints.Drag;
            console.log(diagram.nodes[0].ports[0].offset.x);
           console.log(diagram.nodes[0].ports[0].offset.y);
            mouseEvents.clickEvent(diagramCanvas, 102.5, 102.5);
            mouseEvents.dragAndDropEvent(diagramCanvas, 102.5, 102.5, 103, 103);
           console.log(diagram.nodes[0].ports[0].offset.x);
           console.log(diagram.nodes[0].ports[0].offset.y);
           expect(diagram.nodes[0].ports[0].offset.x).toBe(0.51);
           expect(diagram.nodes[0].ports[0].offset.y).toBe(0.51);
           diagram.clearSelection();
           done();
         
     });


     it('Checking selected port drawing with constraint', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 358, 68, true);
        let node: NodeModel = diagram.nodes[0];
        node.ports[0].constraints = PortConstraints.Draw;
        mouseEvents.clickEvent(diagramCanvas, 106, 106);
        mouseEvents.mouseDownEvent(diagramCanvas, 106, 106);
        mouseEvents.mouseMoveEvent(diagramCanvas, 106, 108.5);
        mouseEvents.mouseMoveEvent(diagramCanvas, 106, 204);
        mouseEvents.mouseUpEvent(diagramCanvas, 106, 204);
        expect(diagram.connectors.length == 1).toBe(true);
        expect(diagram.connectors[0].sourcePortID == diagram.nodes[0].ports[0].id).toBe(true);
        done();
    });

        it('Checking port rendered in portlayer or not', (done: Function) => {
            let ele = document.getElementById("node_port_groupElement");
            expect(ele != null).toBe(true);
            expect(document.getElementById(diagram.element.id + "_diagramPorts").children.length).toEqual(4);
            done();
        });

        it('zooming the diagram with node and port', (done: Function) => {
            let diagramCanvas = document.getElementById('node_' + (diagram.nodes[0] as Node).ports[0].id);
            let rect: ClientRect = diagramCanvas.getBoundingClientRect();
            console.log(diagramCanvas);
            console.log(rect.width, rect.height);
            diagram.zoom(1.2);
            console.log(rect.width, rect.height)
            expect(rect.width === 25 && rect.height === 25).toBe(true);
            done();
        });

        it('checking node children length', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            diagram.copy();
            diagram.paste();
            expect(document.getElementById(diagram.element.id + "_diagramPorts").children.length).toEqual(8);
            diagram.undo();
            expect(document.getElementById(diagram.element.id + "_diagramPorts").children.length).toEqual(4);
            done();
        });
    })

    describe('InEdge OutEdge not removed after deleting connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramPortInEdgeOutEdge' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                  id: 'node1', offsetX: 300, offsetY: 200, height: 100, width: 100,
                  annotations: [{ content: 'Node1'}],
                  ports: [
                    {
                      id: 'left', offset: {x: 1, y: 0.5}, visibility: PortVisibility.Visible
                    }                   
                  ]
                },
                 {
                  id: 'node2', offsetX: 500, offsetY: 200, height: 100, width: 100,
                  annotations: [{ content: 'Node2'}],
                  ports: [
                    
                    {
                      id: 'right', offset: {x: 0, y: 0.5}, visibility: PortVisibility.Visible
                    }
                  ]
                }
              ];
            diagram = new Diagram({
                width: '100%', height: 900, nodes: nodes
            });
            diagram.appendTo('#diagramPortInEdgeOutEdge');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('InEdge OutEdge', (done: Function) => {
            diagram.addConnector({ id: "connector1", sourceID: 'node1', targetID: 'node2', sourcePortID: 'left', targetPortID: 'right' })
            diagram.remove({ id: "connector1" })
            expect(diagram.nodes[0].ports[0].outEdges.length === 0 && diagram.nodes[1].ports[0].inEdges.length === 0).toBe(true);
           done();
     });
 });
});

describe('Port Draw', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramPortDraw' });
        document.body.appendChild(ele);
        let node: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 150, annotations: [{ content: 'Node1' }],
            shape: { type: 'Basic', shape: 'Rectangle' },
            ports: [
                { id: 'port1', visibility: PortVisibility.Visible, constraints: PortConstraints.Draw, offset: { x: 1, y: 0.5 } },
            ]
        };
        diagram = new Diagram({ width: 700, height: 600, nodes: [node], collectionChange: collectionChange, });
        function collectionChange(args: ICollectionChangeEventArgs): void {
            if (args.state === 'Changing' && args.type === 'Addition') {
                args.cancel = true;
            }
        }
        diagram.appendTo('#diagramPortDraw');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking port collections after arg.cancel is true', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas, 150, 150);
        mouseEvents.mouseMoveEvent(diagramCanvas, 451, 150);
        mouseEvents.mouseUpEvent(diagramCanvas, 451, 150);
        expect(diagram.nodes[0].ports[0].outEdges.length === 0).toBe(true);
        done();
    });
});

describe('Port Hover for group node', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramPort' });
        document.body.appendChild(ele);
        let port = [
            {
              id: 'port1',
              offset: { x: 0, y: 0.5 },
              visibility: PortVisibility.Visible,
              constraints: PortConstraints.Default | PortConstraints.Draw,
            },
            {
              id: 'port2',
              offset: { x: 1, y: 0.5 },
              visibility: PortVisibility.Visible,
              constraints: PortConstraints.Default | PortConstraints.Draw,
            },
            {
              id: 'port3',
              offset: { x: 0.5, y: 0 },
              visibility: PortVisibility.Visible,
              constraints: PortConstraints.Default | PortConstraints.Draw,
            },
            {
              id: 'port4',
              offset: { x: 0.5, y: 1 },
              visibility: PortVisibility.Visible,
              constraints: PortConstraints.Default | PortConstraints.Draw,
            },
          ];
        let nodes: NodeModel[] = [
            // Group
            {
              id: 'child1',
              width: 70,
              height: 70,
              offsetX: 400,
              offsetY: 100,
              shape: {
                type: 'Image',
                source:
                  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHsA5gMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcDBQgEAQL/xABREAABAwMBBAUFCA0JCQEAAAABAAIDBAURBgcSITFBUWFxgRMUIpGhFzIzg5SxwdEIFSM2QkVSVGJys8LSNDVEdJKissPwJENjZHOCk+HxFv/EABsBAQACAwEBAAAAAAAAAAAAAAADBgEEBQIH/8QALBEAAgEDAQYFBAMAAAAAAAAAAAECAwQRBRIVMTRBkSFRYXGBM7HB8BMiMv/aAAwDAQACEQMRAD8AmiIiopZwiIgCIiAIiIAiLHJMyMcTk9QWG0uI4mRF5TVH8FnDvTzo/k+1eP5oHvYkZJphHwHFxXgq62OnjMtVUMhiAyXPcGhavVN+isFqfWSgPmcd2KPON9/1DmqcllvOq7q2Nramuq5T6EMbS7Hc3oA/+rfstOqXi25PETVuLuFv/VLLLlZqWxSSbjLtRF3QPKgZW0a5rmhzCHNIyCDkFVDWbLdZ0dJ50+ySPYGlzmRPa97R+qDk9wytfpnVFfp2rDXOklpA7EtM9x8cZ96Vt19ASjmlLx8mQUtVecVF4F380WKlqIqqmiqKd4fDKwPY4dIKyqtSi4vDOwmmsoIiLzgyEREAREQHhqvhneHzLCstSczO8PmWJbK4ET4hERZMBERASZERTkQREQBERAEREBiqJdxuG++KjGptS0enqcSVWZJ5Pg4GH0ndp6gt7UyDfc55w1oyT1AKgrlWVWptQmSJrnz1UwjgjPQM4aPm9q2tOs1eVW5/5iQXdw7emlHizb1+0S/VEm9TSx0jOhrI2u4dpcD9CzWzaPeKaRvn3kq2LPEFgY7wLeHsV1aS2Tads1BGLlRx3KvIBmlqBvNDupjeQHtWr2hbI7RXWyes05StorjBGXNhi4Rz447pb0HqI8c9FldjbOOz/GsexxldVs52mVHr/UVPfpqF1E5/kWQ7xY4YLXknIPgB61b32P1jpKXSTrwGB1ZXSva6Q82sYSA0dmQT257AucQOlXv9jnf556a4WGVu9DT/AO0QvzxbvHDm92ePiVNRowo01ThwRHUqSqScpcS6sLnT7IKyUls1LR3CkYI3XGJzpmN5F7CBveII9S6LHJcu7bL9PedbVVNI3cht3+zwsBznpc49pPsAUp4P1prW9PZdLNp5mPnrGSubFGDgBnAguPVkkeC1VZtB1DPKXR1MdMzoZHC0+1wJWl03Z6m/3qktNGB5aqkDGk8mjmXHuAJ8F0xYNlmlLRQshktkVdNj7pPVjfc49JA5AdgWorG3U3NxTb8zYd1W2VFSwkUhZ9pNygka26xR1cPIuY0MePVwKs62XClulHHV0MokhfyPSD1EdBWs2sbK7dTWiovmmoPNpKYb89K0+g5nS5oPIjq5HvVfbLbs+lvot5OYKwEbvU8AkH2Eepc7U9LpSpOpSWGvLqbdnfTU1CbymW8iY4Iqgd8Ii/L3brCekJgHglO9I49q/C+kr4tohCIiAIiICTIiKciCIiAIiIAh5IsM8wj4Di5YbSWWZSyzwV0TpYKmJvvpGPaOwkEfSqK0fXxWXVlrr6xpEVNVNdKCOLRnB4diu653Sjtsfl7jVxwNPHLzgu7h0qltZy2mpu8lXZZXOjm9KRroy3df04zzB5rsaC5LaTXg+pz9USai8+K6HX0ErJo2yRPa+NzQ5rmnIcDyIK/ZGVyjpTaZqbTFMyko6uOejZwbT1TN9rB+ieBHdnHYuh9Ca0oNZWkVVIfJVUeG1NK4jeid9LT0FWM45Rm1fZxPpeskudvD5rPO/OQ3Jp3H8F3Z1Hw79z9jeMagu39Ub/iV91dNBV0stNVRMlglaWvjeMhwPQVA9E6AOjtY3GpoDv2mrpsRBzsuicHZLD1jqPr7QLDXIu0wb20C+Drq3fQuugq3sOzeA63umqL2xsj31bn0VOTkNHISO6z1Dx58gNJsV2bz2l8epL0HRVbmHzWlc3Bja4YLndRIOMdHTz4XHyC+clWm1HahHpQi22cRVN2ODJv+kynb+lgjLj0DxPaBKdoN3prPo66VNW5oBp3RsYTxe9wwGjtXMWgIHzautwZnDHmR2ByAaT/rvWPVGrr3qqdst6rTM2MnycTWhjGdzR854rf7OrlYLQZZrhVGOtm9Ab0Z3WN/W5ZJWteSlG3nsrLwTW6TqrLwi1kWOCaKohbNBI2WNwy1zDkOWRfP5JxeGWtNPxQWCrdiPdHMlZ14Kh+/ISOjgs014iTwjEiIpyIIiIAiIgJMiIpyIIiIAiIgPj3brC5RzUl4jslpqK+UBzmj7mz8t55Bb6r+C8VV+2Koe2mtUA9498j3dpaGgf4ipLakq91CnLgeK1R0qMpohTIrxq6+iOCOWtuFQfRY3oHjwa0epTz3CtSeZGY1lvFRz8hvux/axzWPY1qrS+lYbhVXt8jK+dwjjc2AvxEOJAI5ZPMdgVm+7Por89qfkr/qV1SSWFwK4228s58r9Iajoqp9NUWOvEsZw7cgLx4ObkHwK9mnYdXabukNytNruUVRHw40by17c8WuGOIKvf3ZtF/ntV8lf9Se7Pov89qfkr/qWTBJdH6gGo7UyqfR1NDUt9GemqI3MLHdmRxb1Fb5V37s2i+fntT8lf8AUvvu0aK/Pan5K/6kBYa+Hkq992fRf55U/JX/AFJ7s+ivz2p+Sv8AqQH62o6xudlo3W7TdvrKq5zN4zRUz3sp2npyBgu6h0cz286z2DUU80k01nuj5JHFz3upZCXE8SScLocbZtFj+m1PyV/1L77s+i/z2p+Sv+pAUVp3Z3qe/wBYaemtctO1vv5qtpiYz18T3AFSS97FNTW2jNRRyU1w3RvPihcWv8AeB9eVaPuzaLz/AC2q+Sv+pfDtn0Wf6bU/JX/UgKE0pqKq03cQDvebOfu1MDsjHQSB0OH/AKV3RyMljZJG4OY8BzXDpB6VTO0u42S76tqblp4uNLUhr5Mxln3X8Lh28D3kqydBTvqNIWx8nMRuZ4Ne5o9gCruvW0diNZcc4Z2NLrPadNm8mfuRk+C1y9NY/Lw0chzXmVegsI60n4hERejyEREAREQEmREU5EEREAREQGGr+BPeFVW2Pj9p/j/3FatX8Ce8Kqdsn4n+O/y1s6Zz8fn7MgvOVl+9SH220NmhbNUOIDhkNbzx1qa6I2Yt1TM+Zz5ae2wv3ZJs5c93PdYOntPR2rQUzty3RP8AyYgfYuntOW2GzWCioYWhscMI3u1x4uPiSSriV80Fu2W6LoodxtkimJAzJUPdI53bxOB4ALQaq2K2Cup3yWCM2+sHpNYZXOieeo5yW945dSid+2g3653GWair5aKkDiIIYMD0c8C4kZJI49XHCnOzfXJulNUUl/q4GVNMGlk8pEflWHPPoLgRxx1hAVzs80zbYNdNtN/trJfKRywugqQHbkoAcD6mu78qY7V9Caeo9LCstdqp6SSKoZvvgbuktPo4PiQmvqq3Umt9P36gqqeV7pGsqPJyB3AOABOP0XOGewdSn2tqA3PSV2pWDMj6Z7o/12jeb7QEBy++y0YY52JMgflLoqg2d6TpbXTissNC6WOBvlXujyS4D0ifaqZ0tR/bTUVppebJauJzv1GnecD3hpHir713X/a7SF1qA4Nf5AsZ+s70R7SEBz5p/RA1heZo7dEKeJ7nTSPziOnjcSQAOvoA7PFXJZdkmj7XC0S27z6YNw6aqe529/253R6l6dklsioNGwTsaPK1r3TyO6T+C31ABQ/aJrq6i/VNstNS+kp6Nwje+IYfK/AJ4nkBnHeDzCAkOoNj2k7pA/zOjdbqkj0ZaZ7t0HtYTj1YVLX/AEUdP3OS33JpEzRvMex/oyMJOHDhyOD3EFWhs315Wy3T7WX+sbLBKxxhqZiGuY5vHdceRBGcdII6c8PbthfarjYqarpq2mlqqWcBojla5xY/g4Y7w0+CAoG6WzzRglhdmPOHA8wrZ2du3dFW93UJf2rlXd6/m6X/AF0qdaEkJ0dboxyHlCf/ACuXH1tZtl7r8nQ0x4rP2N45284uPMlfERVY7gREQBERAEREBJkRFORBERAEREBhq/gT3hVTtk/E/wAd+4rWq/gT3hVTtk/E/wAd/lrZ0zn4/P2ZBecrL96kZhuVF5myKSX/AHYa4YPUuotG3uDUOmaC407w/wApEBIAeLXjg4HtyuOlL9A68ueiqx5psVFDMcz0jzgOP5QP4Lvn6VcSvlj6g2X3inr5nWVsVVRPeXRtMgY+ME+9OeBxyz9Kht8stysRH26t81I0n0ZZWAxk9jxlvhnPYrStu23SVVCHVfntFJw3mSQb4z2FmeHq7lNqSqtGqLMZKeSCvt1S0sdn0muHS0g/MgOYjLSyxvZHNF6TS30XhdPacrhd9OW+scQfOaVj3jOeJaN4evK5k2paPGj9Svp6YE2+pb5akJOcNzxYT+ifZhXfsMuP2w2fUrC/efRyvpzw5YO8B6nBARXZlaTFtEq4XMwLaJxxHIh+432EnwUo211nktN0tGDxqqtpcOtrAXf4gxb+x6eFt1VqG7Y4XJ0Jb2BrMH+9kqqfshr1LDfbVQU8haYqZ0rxgEem7A5/qH1oC1dnP3j2j/ofSVSetzjWF7P/ADb+HqV0bMHOfoCxvccl1KCT25KoXaDdRTa8vcD48t88d6YPIHHQgJIdmuqiMOt0RH9YYvBeNF3uxULq640UUVO17WF7ZWuILjgcAre09tJ0xqG6RWu1Vk0tVIHFrXU72ghoJPEjqC8+2SRsWhKp7yA0TwZJ6PugQHP96/m+Xw+dTbQX3p0Hxn7Rygl0qIJbdKIpmPPDGHdqneg/vTofjP2jlydZ5Ze6/Jv6d9Z+xv0RFVDuhERAEREAREQEmREU5EEREAREQGGr+BPeFVO2T8T/AB37itar+BPeFVW2Pj9p/jv8tbWmc/D5+zILzlZfvUrRXbDsG8tBHNFqEESMD2nzfmCOHSqTI4rozYvr6mutngsFynbFdKVu5CZHfyiMDhjP4QHAjsz14uBXznu40U9vrp6OqjdHNBI6N7XcCCDhXZ9jWysbT3tzw8UJdFuE8vKelvY8N3PgrKvuh9NX+rbV3W1QzVAGDKMtc7vxz8V7mMs+lbQdwUttttOMnkxjes9pPrKAqj7JQw+b2QHHl9+UgdO7gZ9uFj+xsuPo3u2uJxmOoYPW137qr3afq7/9jqV9ZCHsooGeRpWO/JByXEdBJ4+rqW02EXHzHaBTQOJ3K2GSE8eGcbwP93HigOn1yjthrzcNol2e05ZE9sLeP5LQPnyuqZ5mU9PLNI4NjjYXucTyAGSuLLlWPuFyqq6QYfUTPlcM5wXHP0oDqvZVIyXZ5YzG4O3aYNOOggnIXPe12jnpNol5E8Zb5WUSxnHvmOAwR/roKmewzXtNa2u05eZhDBJIX0k8jsNY482E9AJ4g9eetXFqDS9j1MxgvNugqjGPuchGHNHY4ccIDn/YLSTz7QaeeOMmKmglfK4cmgtLR7SFbO3eVrNnFYwnjJPC1o6zvg/QpXZLFZtNUb4rTRwUcHvpHN4F3a5x5qhttmu4NSVsNptEolt1I4ufM08JpOXDraByPTlAVceauDQX3p0Pxn7Ryp/CuDQf3p0Of+J+0cuTrPLL3X5Ohp31vg36Iiqh3AiIgCIiAIiICTIiKciCIiAIiIDDV/A+IUW1bpyLUdCyF0nkpoSXRSYzgnmCOpSmr+BPevGoXWnRqqcOKJFTjUpuMuBVDtl91zwr6DHRkv8A4V9bsyvLHh7LjQtc05Dg6QEHr96rWRbu/LvzXY192UPXuRSgi2k2+AQU2racxgYAlb5Ugd74yVqL5pPWGoHh151DBV7py1skj90HsaG4HqVhIsb8u/Ndhu2h69yqPcvu5/p9v9b/AOFei27PdQWuvp6+gulBFVU7xJFIN47rhyOCzB8VZ6Jvy7812G7aHr3IzWHaVW0k1JU6poHwTxujkb5uwbzSMEZEWRwKh3uX3bH8vt/9p/8ACrWPAFeCWR7nYc446l7jrV2+q7GHp1BdH3Kxds4uYcQK6hPaC/8AhUjs9Pr6ywNgt2p444WjDY35kaO4PYcKTopd8XXp2I930PUil8t+ub/EYrtqWKeE84gXMYe9rWAFR87OroedbRet/wDCrLRN8XPp2G76HqVvDs4ri8eWr6VrOncDifaArAt9HFb6KGkgBEcTd0Z+dehFrXF9WuElN+BNRtqdF5iERFpmwEREAREQBERAf//Z',
              },
            },
            {
              id: 'child2',
              width: 70,
              height: 70,
              offsetX: 550,
              offsetY: 100,
              shape: {
                type: 'Path',
                data: 'M100,20 L132.7,71.6 L200,78.4 L152.3,119.6 L166.5,186.2 L100,155 L33.5,186.2 L47.7,119.6 L0,78.4 L67.3,71.6 Z',
              },
            },
            {
              id: 'group1',
              children: ['child1', 'child2'],
              padding: { left: 10, right: 10, top: 10, bottom: 10 },
              ports: port,
              style: { strokeColor: 'black' },
            },
          ];
        diagram = new Diagram({ width: 700, height: 600, nodes: nodes,});
        diagram.appendTo('#diagramPort');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking port hover for group node', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 330, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 340, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 350, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 360, 100);
        expect(diagram.nodes[0].ports[0].outEdges.length === 0).toBe(true);
        done();
    });
});