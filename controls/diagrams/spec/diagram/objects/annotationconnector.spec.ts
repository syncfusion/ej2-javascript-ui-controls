import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
import { BezierSegment, NodeModel } from '../../../src';
import { MouseEvents } from '../interaction/mouseevents.spec';
/**
 * Connector Annotations
 */
describe('Diagram Control', () => {
  
    describe('Bezier Annotation', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'Annotation' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }],
                ports: [
                    { id: 'port1', offset: { x: 0.5, y: 0 } },
                    { id: 'port2', offset: { x: 0, y: 0.5 } },
                    { id: 'port3', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', offset: { x: 0.5, y: 1 } },
            ]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 350, annotations: [{ content: 'Node2' }],
                ports: [
                    { id: 'port1', offset: { x: 0.5, y: 0 } },
                    { id: 'port2', offset: { x: 0, y: 0.5 } },
                    { id: 'port3', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', offset: { x: 0.5, y: 1 } },
            ]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 450, annotations: [{ content: 'Node4' }]
            };
            let connector1: ConnectorModel = {  id: 'connector1', sourceID: 'node1', targetID: 'node2', sourcePortID: 'port3', targetPortID: 'port1',  annotations: [{ content: 'Connector' }],
            type: 'Bezier' };
            let connector2: ConnectorModel = { id: 'connector2',type: 'Bezier',
            annotations: [{ content: 'Connector1'}],
            sourceID: 'node3', targetID: 'node4', };
            let connector3: ConnectorModel = { id: 'connector3',type: 'Bezier',
            sourcePoint:{x:700,y:200} ,targetPoint: {x:1000,y:400},
            annotations: [{ content: 'Connector3'}],
            segments:[{type:'Bezier',point:{x:750,y:250}},{type:'Bezier',point:{x:900,y:350}}]
            };

            diagram = new Diagram({
                width: '1200px', height: '800px', nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2,connector3]
            });
            diagram.appendTo('#Annotation');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('checking the annotation of the connector connected with port', (done: Function) => {
            let diagramCanvas:HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 100,350);
            mouseEvents.mouseMoveEvent(diagramCanvas, 120, 550);
            mouseEvents.mouseUpEvent(diagramCanvas,120, 550);
            mouseEvents.mouseMoveEvent(diagramCanvas, 150, 550);
            diagram.connectors[0].type = 'Bezier';
            diagram.dataBind();
            expect(diagram.connectors[0].wrapper.offsetX=== 145).toBe(true);
            expect(diagram.connectors[0].wrapper.offsetY=== 298.33).toBe(true);
            done();
        });
        it('checking the annotation of the connector connected with node', (done: Function) => {
            let diagramCanvas:HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 470,500);
            mouseEvents.mouseMoveEvent(diagramCanvas, 520, 750);
            mouseEvents.mouseUpEvent(diagramCanvas,520, 750);
            diagram.connectors[1].type = 'Bezier';
            diagram.dataBind();
            expect(diagram.connectors[1].wrapper.offsetX=== 524.99).toBe(true);
            expect(diagram.connectors[1].wrapper.offsetY=== 398.48).toBe(true);
            done();
        });
        it('checking the annotation of the connector ', (done: Function) => {
            let diagramCanvas:HTMLElement = document.getElementById(diagram.element.id + 'content');
            let connector= diagram.connectors[2];
            (connector.segments[1] as BezierSegment).point.x = 950;
            (connector.segments[1] as BezierSegment).point.y = 550;
            diagram.dataBind();
            (connector.segments[0] as BezierSegment).point.x = 650;
            (connector.segments[0] as BezierSegment).point.y = 400;
            diagram.dataBind();
            diagram.connectors[2].type = 'Bezier';
            diagram.dataBind();
            expect(diagram.connectors[2].wrapper.offsetX=== 824.99).toBe(true);
            expect(diagram.connectors[2].wrapper.offsetY=== 375).toBe(true);
            done();
        });
    });
    describe('Straight segment annotation with offset 0', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagramk1' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 100 },
                annotations: [{ 'content': 'label', 'offset': 0, 'alignment': 'Center' }]
            };

            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Straight',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 400, y: 100 },
                annotations: [{ 'content': 'label', 'offset': 0, 'alignment': 'Before' }]
            };


            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Straight',
                sourcePoint: { x: 500, y: 100 },
                targetPoint: { x: 600, y: 100 },
                annotations: [{ 'content': 'label', 'offset': 0, 'alignment': 'After' }]
            };

            diagram = new Diagram({ width: 1000, height: 1000, connectors: [connector1, connector2, connector3] });
            diagram.appendTo('#diagramk1');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking annotation alignment with offset 0', (done: Function) => {
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];

            expect((Math.round(element1.offsetX) === 113 || Math.round(element1.offsetX) >= 111 || Math.round(element1.offsetX) <= 116) && Math.round(element1.offsetY) === 100 &&
                (Math.round(element2.offsetX) === 313 || Math.round(element2.offsetX) >= 311 || Math.round(element2.offsetX) <= 316) && Math.round(element2.offsetY) === 93 &&
                (Math.round(element3.offsetX) === 513 || Math.round(element3.offsetX) >= 511 || Math.round(element3.offsetX) <= 516) && Math.round(element3.offsetY) === 107).toBe(true);
            done();
        });

        it('Checking annotation alignment with offset 0.5', (done: Function) => {
            diagram.connectors[0].annotations[0].offset = 0.5;
            diagram.connectors[1].annotations[0].offset = 0.5;
            diagram.connectors[2].annotations[0].offset = 0.5;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];
            expect(Math.round(element1.offsetX) === 150 && Math.round(element1.offsetY) === 100 &&
                Math.round(element2.offsetX) === 350 && Math.round(element2.offsetY) === 93 &&
                Math.round(element3.offsetX) === 550 && Math.round(element3.offsetY) === 107).toBe(true);
            done();
        });

        it('Checking annotation alignment with offset 1', (done: Function) => {

            diagram.connectors[0].annotations[0].offset = 1;
            diagram.connectors[1].annotations[0].offset = 1;
            diagram.connectors[2].annotations[0].offset = 1;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];
            expect((Math.round(element1.offsetX) === 187 || Math.round(element1.offsetX) >= 185 || Math.round(element1.offsetX) <= 189) && Math.round(element1.offsetY) === 100 &&
            (Math.round(element2.offsetX) === 387 || Math.round(element2.offsetX) >= 385 || Math.round(element2.offsetX) <= 389) && Math.round(element2.offsetY) === 93 &&
            (Math.round(element3.offsetX) === 587 || Math.round(element3.offsetX) >= 585 || Math.round(element3.offsetX) <= 589) && Math.round(element3.offsetY) === 107).toBe(true);
        done();
        });

        it('Checking alignment, offset 0, for slanting connector', (done: Function) => {
            diagram.connectors[0].targetPoint = { x: 200, y: 200 };
            diagram.connectors[1].targetPoint = { x: 400, y: 200 };
            diagram.connectors[2].targetPoint = { x: 600, y: 200 };
            diagram.connectors[0].annotations[0].offset = 0;
            diagram.connectors[1].annotations[0].offset = 0;
            diagram.connectors[2].annotations[0].offset = 0;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];

            expect(Math.round(element1.offsetX) === 100 && Math.round(element1.offsetY) === 107 &&
                (Math.round(element2.offsetX) === 287 || Math.round(element2.offsetX) >= 285 || Math.round(element2.offsetX) <= 289) && Math.round(element2.offsetY) === 107 &&
                (Math.round(element3.offsetX) === 513 || Math.round(element3.offsetX) >= 511 || Math.round(element3.offsetX) <= 515) && Math.round(element3.offsetY) === 107).toBe(true);
            done();
        });

        it('Checking alignment, offset 0.5, for slanting connector', (done: Function) => {

            diagram.connectors[0].annotations[0].offset = 0.5;
            diagram.connectors[1].annotations[0].offset = 0.5;
            diagram.connectors[2].annotations[0].offset = 0.5;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];

            expect(Math.round(element1.offsetX) === 150 && Math.round(element1.offsetY) === 150 &&
                (Math.round(element2.offsetX) === 337 || Math.round(element2.offsetX) >= 335 || Math.round(element2.offsetX) <= 339) && Math.round(element2.offsetY) === 150 &&
                (Math.round(element3.offsetX) === 563 || Math.round(element3.offsetX) >= 561 || Math.round(element3.offsetX) <= 566) && Math.round(element3.offsetY) === 150).toBe(true);
            done();
        });

        it('Checking alignment, offset 1, for slanting connector', (done: Function) => {

            diagram.connectors[0].annotations[0].offset = 1;
            diagram.connectors[1].annotations[0].offset = 1;
            diagram.connectors[2].annotations[0].offset = 1;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];
            expect(Math.round(element1.offsetX) === 200 && Math.round(element1.offsetY) === 193 &&
                (Math.round(element2.offsetX) === 387 || Math.round(element2.offsetX) >= 385 || Math.round(element2.offsetX) <= 389) && Math.round(element2.offsetY) === 193 &&
                (Math.round(element3.offsetX) === 613 || Math.round(element3.offsetX) >= 611 || Math.round(element3.offsetX) <= 617) && Math.round(element3.offsetY) === 193).toBe(true);
            done();
        });

        it('Checking alignment, offset 0, for orthogonal connector', (done: Function) => {

            diagram.connectors[0].type = 'Orthogonal';
            diagram.connectors[1].type = 'Orthogonal';
            diagram.connectors[2].type = 'Orthogonal';
            diagram.connectors[0].annotations[0].offset = 0;
            diagram.connectors[1].annotations[0].offset = 0;
            diagram.connectors[2].annotations[0].offset = 0;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];

            expect(Math.round(element1.offsetX) === 100 && Math.round(element1.offsetY) === 107 &&
                (Math.round(element2.offsetX) === 287 || Math.round(element2.offsetX) >= 285 || Math.round(element2.offsetX) <= 289) && Math.round(element2.offsetY) === 107 &&
                (Math.round(element3.offsetX) === 513 || Math.round(element3.offsetX) >= 511 || Math.round(element3.offsetX) <= 515) && Math.round(element3.offsetY) === 107).toBe(true);
            done();
        });

        it('Checking alignment, offset 0.5, for orthogonal connector', (done: Function) => {

            diagram.connectors[0].annotations[0].offset = 0.5;
            diagram.connectors[1].annotations[0].offset = 0.5;
            diagram.connectors[2].annotations[0].offset = 0.5;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];
            expect(Math.round(element1.offsetX) === 180 && Math.round(element1.offsetY) === 120 &&
                Math.round(element2.offsetX) === 380 && Math.round(element2.offsetY) === 113 &&
                Math.round(element3.offsetX) === 580 && Math.round(element3.offsetY) === 127).toBe(true);
            done();
        });

        it('Checking alignment, offset 1, for orthogonal connector', (done: Function) => {

            diagram.connectors[0].annotations[0].offset = 1;
            diagram.connectors[1].annotations[0].offset = 1;
            diagram.connectors[2].annotations[0].offset = 1;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];

            expect(Math.round(element1.offsetX) === 200 && Math.round(element1.offsetY) === 193 &&
                (Math.round(element2.offsetX) === 387 || Math.round(element2.offsetX) >= 385 || Math.round(element2.offsetX) <= 389) && Math.round(element2.offsetY) === 193 &&
                (Math.round(element3.offsetX) === 613 || Math.round(element3.offsetX) >= 611 || Math.round(element3.offsetX) <= 615) && Math.round(element3.offsetY) === 193).toBe(true);
            done();
        });


        it('Checking alignment, offset 0, for reverse straight connector', (done: Function) => {

            diagram.connectors[0].sourcePoint = { x: 200, y: 100 };
            diagram.connectors[1].sourcePoint = { x: 400, y: 100 };
            diagram.connectors[2].sourcePoint = { x: 600, y: 100 };

            diagram.connectors[0].targetPoint = { x: 100, y: 100 };
            diagram.connectors[1].targetPoint = { x: 300, y: 100 };
            diagram.connectors[2].targetPoint = { x: 500, y: 100 };

            diagram.connectors[0].annotations[0].offset = 0;
            diagram.connectors[1].annotations[0].offset = 0;
            diagram.connectors[2].annotations[0].offset = 0;

            diagram.connectors[0].type = 'Straight';
            diagram.connectors[1].type = 'Straight';
            diagram.connectors[2].type = 'Straight';

            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];

            expect((Math.round(element1.offsetX) === 187 || Math.round(element1.offsetX) >= 185 || Math.round(element1.offsetX) <= 188) && Math.round(element1.offsetY) === 100 &&
                (Math.round(element2.offsetX) === 387 || Math.round(element2.offsetX) >= 385 || Math.round(element2.offsetX) <= 388) && Math.round(element2.offsetY) === 107 &&
                (Math.round(element3.offsetX) === 587 || Math.round(element3.offsetX) >= 585 || Math.round(element3.offsetX) <= 588) && Math.round(element3.offsetY) === 93).toBe(true);
            done();
        });

        it('Checking alignment, offset 0.5, for reverse straight connector', (done: Function) => {

            diagram.connectors[0].annotations[0].offset = 0.5;
            diagram.connectors[1].annotations[0].offset = 0.5;
            diagram.connectors[2].annotations[0].offset = 0.5;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];

            expect(Math.round(element1.offsetX) === 150 && Math.round(element1.offsetY) === 100 &&
                Math.round(element2.offsetX) === 350 && Math.round(element2.offsetY) === 107 &&
                Math.round(element3.offsetX) === 550 && Math.round(element3.offsetY) === 93).toBe(true);
            done();
        });

        it('Checking alignment, offset 1, for reverse straight connector', (done: Function) => {

            diagram.connectors[0].annotations[0].offset = 1;
            diagram.connectors[1].annotations[0].offset = 1;
            diagram.connectors[2].annotations[0].offset = 1;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];

            expect(Math.round(element1.offsetX) === 113 || 112.671875 && Math.round(element1.offsetY) === 100 &&
                Math.round(element2.offsetX) === 313 || 312.671875 && Math.round(element2.offsetY) === 106 || 107.2 &&
                Math.round(element3.offsetX) === 513 || 512.671875 && Math.round(element3.offsetY) === 93 || 92.8).toBe(true);
            done();
        });

        it('Checking alignment, offset 0, for reverse slanting connector', (done: Function) => {

            diagram.connectors[0].sourcePoint = { x: 200, y: 200 };
            diagram.connectors[1].sourcePoint = { x: 400, y: 200 };
            diagram.connectors[2].sourcePoint = { x: 600, y: 200 };

            diagram.connectors[0].annotations[0].offset = 0;
            diagram.connectors[1].annotations[0].offset = 0;
            diagram.connectors[2].annotations[0].offset = 0;

            diagram.connectors[0].type = 'Straight';
            diagram.connectors[1].type = 'Straight';
            diagram.connectors[2].type = 'Straight';

            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];
            expect(Math.round(element1.offsetX) === 200 && Math.round(element1.offsetY) === 193 &&
                (Math.round(element2.offsetX) === 413 || Math.round(element2.offsetX) >= 412 || Math.round(element2.offsetX) <= 416) && Math.round(element2.offsetY) === 193 &&
                (Math.round(element3.offsetX) === 587 || Math.round(element3.offsetX) >= 585 || Math.round(element3.offsetX) <= 589) && Math.round(element3.offsetY) === 193).toBe(true);
            done();
        });

        it('Checking alignment, offset 0.5, for reverse slanting connector', (done: Function) => {

            diagram.connectors[0].annotations[0].offset = 0.5;
            diagram.connectors[1].annotations[0].offset = 0.5;
            diagram.connectors[2].annotations[0].offset = 0.5;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];
            expect(Math.round(element1.offsetX) === 150 && Math.round(element1.offsetY) === 150 &&
                (Math.round(element2.offsetX) === 363 || Math.round(element2.offsetX) >= 362 || Math.round(element2.offsetX) <= 366) && Math.round(element2.offsetY) === 150 &&
                (Math.round(element3.offsetX) === 537 || Math.round(element3.offsetX) >= 535 || Math.round(element3.offsetX) <= 538) && Math.round(element3.offsetY) === 150).toBe(true);
            done();
        });

        it('Checking alignment, offset 1, for reverse slanting connector', (done: Function) => {
            diagram.connectors[0].annotations[0].offset = 1;
            diagram.connectors[1].annotations[0].offset = 1;
            diagram.connectors[2].annotations[0].offset = 1;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
            let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
            let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];
            expect(Math.round(element1.offsetX) === 100 && Math.round(element1.offsetY) === 107 &&
                (Math.round(element2.offsetX) === 313 || Math.round(element2.offsetX) >= 312 || Math.round(element2.offsetX) <= 317) && Math.round(element2.offsetY) === 107 &&
                (Math.round(element3.offsetX) === 487 || Math.round(element3.offsetX) >= 485 || Math.round(element3.offsetX) <= 488) && Math.round(element3.offsetY) === 107).toBe(true);
            done();
        });

        it('checking the displacement of the connector', (done: Function) => {
            diagram.connectors[0].type = 'Orthogonal';
            diagram.dataBind();
            diagram.connectors[0].annotations[0].displacement.x = 15;
            diagram.connectors[0].annotations[0].displacement.y = 15;
            diagram.dataBind();
            expect(diagram.connectors[0].wrapper.children[3].offsetX === 100 &&
                diagram.connectors[0].wrapper.children[3].offsetY === 122.2).toBe(true);
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
});