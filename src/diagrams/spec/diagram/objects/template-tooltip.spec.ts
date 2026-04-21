import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model'; 
import { MouseEvents } from '../interaction/mouseevents.spec';


/*
 * Node spec
 */

describe('Diagram Control', () => {

    describe('Template tooltip', () => {
        var diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();


        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 },
                tooltip: { openOn: "Custom" }
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
            };

            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 550, offsetY: 100, annotations: [{ content: 'Node1' }],
                tooltip: { openOn: 'Custom' }
            };

            function setTooltipTemplate(): string | HTMLElement {
                let content: string = 'Custom Template';
                return content;
            }

            diagram = new Diagram({
                width: '1000px', height: '500px',
                nodes: [node, node2],
                connectors: [connector],
                selectedItems: { setTooltipTemplate: setTooltipTemplate }
            });
            diagram.appendTo('#diagram1');
        });

        afterAll((): void => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
        });

        it('Checking custom tooltip template as string', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 90);
            mouseEvents.mouseDownEvent(diagramCanvas, 100, 90);
            mouseEvents.mouseMoveEvent(diagramCanvas, 130, 130);
            // setTimeout(() => {
                let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
                expect(tooltipElement !== null).toBe(true);
                done();
            // }, 5);
            done();
        });

        it('Checking show tooltip method', (done: Function) => {
            diagram.showTooltip(diagram.nodes[1]);
            // setTimeout(() => {
                let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
                expect(tooltipElement !== null).toBe(true);
                done();
            // }, 5);
            done();
        });

        it('Checking hide tooltip method', (done: Function) => {
            diagram.hideTooltip(diagram.nodes[1]);
            // setTimeout(() => {
                let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
                expect(tooltipElement !== null).toBe(true);
                done();
            // }, 5);
            done();
        });

        it('Checking show tooltip method - connector', (done: Function) => {
            diagram.showTooltip(diagram.connectors[0]);
            // setTimeout(() => {
                let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
                expect(tooltipElement !== null).toBe(true);
                done();
            // }, 5);
            done();
        });

        it('Checking hide tooltip method', (done: Function) => {
            diagram.hideTooltip(diagram.connectors[0]);
            // setTimeout(() => {
                let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
                expect(tooltipElement !== null).toBe(true);
                done();
            // }, 5);
            done();
        });
    });
    describe('Html Content Template tooltip', () => {
        var diagram: Diagram;
        let ele: HTMLElement;
        let btn: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram2' });
            btn = document.createElement("BUTTON");
            btn.innerHTML = "CLICK ME";
            btn.id = "property";
            document.body.appendChild(btn);
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 }
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
            };

            function setTooltipTemplate(): string | HTMLElement {
                let htmlElement: HTMLElement = document.getElementById('property');
                return htmlElement;
            }

            diagram = new Diagram({
                width: '1000px', height: '500px',
                nodes: [node],
                connectors: [connector],
                selectedItems: { setTooltipTemplate: setTooltipTemplate }
            });
            diagram.appendTo('#diagram2');
        });
        afterAll((): void => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
            btn.remove();
        });


        it('Checking custom tooltip template with html template', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 90);
            mouseEvents.mouseDownEvent(diagramCanvas, 100, 90);
            mouseEvents.mouseMoveEvent(diagramCanvas, 120, 120);
            // setTimeout(() => {
                let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
                expect(tooltipElement !== null).toBe(true);
                done();
            // }, 5);
            done();
        });
    });

    describe('Default Template tooltip', () => {
        var diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 }
            };
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 550, offsetY: 100, annotations: [{ content: 'Node1' }],
                tooltip: { openOn: 'Custom' }
            };
            diagram = new Diagram({
                width: '1000px', height: '500px',
                nodes: [node, node2],
                connectors: [connector],
            });
            diagram.appendTo('#diagram3');
        });
        afterAll((): void => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
        });
        it('Checking custom tooltip template with default template', (done: Function) => {
            diagram.showTooltip(diagram.nodes[1]);
            // setTimeout(() => {
                let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
                expect(tooltipElement !== null).toBe(true);
                done();
            // }, 5);
        });
        it('Checking tooltip on mouse enter of custom object', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 320, 320);
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            expect(tooltipElement !== null).toBe(true);
            done();
        });
        it('Checking tooltip on mouse enter of non custom object', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 120, 120);
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            expect(tooltipElement !== null).toBe(true);
            done();
        });
        it('Checking hide tooltip method', (done: Function) => {
            diagram.hideTooltip(diagram.nodes[1]);
            // setTimeout(() => {
                let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
                expect(tooltipElement !== null).toBe(true);
                done();
            // }, 5);
            done();
        });
        
    });
});    