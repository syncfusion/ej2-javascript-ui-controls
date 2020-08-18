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
});