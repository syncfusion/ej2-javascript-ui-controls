import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { ConnectorConstraints, DiagramConstraints } from '../../../src/diagram/enum/enum';
import { ConnectorBridging } from '../../../src/diagram/objects/connector-bridging';
import { Connector, OrthogonalSegment } from '../../../src/diagram/index';
import { getLineSegment } from '../../../src/diagram/utility/diagram-util';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(ConnectorBridging);
/**
 * Bridging spec
 */
describe('Diagram Control', () => {
    describe('Connector with bridging', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Straight',
                sourcePoint: { x: 220, y: 55 },
                targetPoint: { x: 295, y: 180 },
            };
            let connector4: ConnectorModel = {
                id: 'connector4',
                type: 'Straight',
                targetPoint: { x: 365, y: 160 },
                sourcePoint: { x: 290, y: 40 },
            };

            let connector5: ConnectorModel = {
                id: 'connector5',
                type: 'Straight',
                targetPoint: { x: 415, y: 70 },
                sourcePoint: { x: 185, y: 130 },
            };

            let connector6: ConnectorModel = {
                id: 'connector6',
                type: 'Straight',
                targetPoint: { x: 200, y: 0 },
                sourcePoint: { x: 200, y: 100 },
            };

            diagram = new Diagram({
                width: 1000, height: 1000, bridgeDirection: 'Top', constraints: DiagramConstraints.Bridging,
                connectors: [connector3, connector4, connector5, connector6]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Straight Line with bridge direction as top', (done: Function) => {

            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M220 55 L294.74 179.57').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M290 40 L364.74 159.58').toBe(true);
            let element2: DiagramElement = diagram.connectors[2].wrapper.children[0];
            expect((element2 as PathElement).data == 'M185 130 L249.33484596884284 113.21699670378008A 5 5 165.37912601136836 , 1 1 259.01101869281126,110.69277773231005 L318.80677345109984 95.0938851866695A 5 5 165.37912601136836 , 1 1 328.4829461750683,92.56966621519948 L414.52 70.13').toBe(true);
            done();
        });

        it('Checking Straight Line with bridge direction as left', (done: Function) => {

            diagram.bridgeDirection = 'Left';
            diagram.dataBind();
            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M220 55 L251.60045355368942 107.66742258948238A 5 5 -120.96375653207352 , 1 0 256.7454111079647,116.24235184660783 L294.74 179.57').toBe(true);
            let element1: PathElement = diagram.connectors[1].wrapper.children[0] as PathElement;
            expect(element1.data == 'M290 40 L290 60 L365 60 L365 65A 5 5 -122.00538320808352 , 1 0 365,75 L365 159.5' ||
                element1.data == 'M290 40 L320.9948651130682 89.59178418090912A 5 5 -122.00538320808352 , 1 0 326.2948545131,98.07176722096 L364.74 159.58').toBe(true);
            let element2: DiagramElement = diagram.connectors[2].wrapper.children[0];
            expect((element2 as PathElement).data == 'M185 130 L414.52 70.13').toBe(true);
            done();
        });

        it('Checking Orthogonal Line with bridgr direction left', (done: Function) => {

            diagram.connectors[0].type = 'Orthogonal';
            diagram.connectors[1].type = 'Orthogonal';
            diagram.connectors[2].type = 'Orthogonal';
            diagram.dataBind();
            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M220 55 L220 65A 5 5 -90 , 1 0 220,75 L220 75 L295 75 L295 179.5').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M290 40 L290 60 L365 60 L365 65A 5 5 -122.00538320808352 , 1 0 365,75 L365 159.5' ||
                (element1 as PathElement).data == 'M290 40 L290 60 L365 60 L365 65A 5 5 -122.11300099946992 , 1 0 365,75 L365 159.5').toBe(true);
            let element2: DiagramElement = diagram.connectors[2].wrapper.children[0];
            expect((element2 as PathElement).data == 'M185 130 L205 130 L205 70 L414.5 70').toBe(true);
            done();
        });

        it('Checking Orthogonal Line with bridge direction right', (done: Function) => {

            diagram.bridgeDirection = 'Right';
            diagram.dataBind();
            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M220 55 L220 65A 5 5 -90 , 1 1 220,75 L220 75 L295 75 L295 179.5').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M290 40 L290 60 L365 60 L365 65A 5 5 -122.00538320808352 , 1 1 365,75 L365 159.5').toBe(true);
            let element2: DiagramElement = diagram.connectors[2].wrapper.children[0];
            expect((element2 as PathElement).data == 'M185 130 L205 130 L205 70 L414.5 70').toBe(true);
            done();
        });

        it('Checking Orthogonal Line with bridge direction bottom', (done: Function) => {

            diagram.bridgeDirection = 'Bottom';
            diagram.dataBind();
            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M220 55 L220 75 L295 75 L295 179.5').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M290 40 L290 60 L365 60 L365 159.5').toBe(true);
            let element2: DiagramElement = diagram.connectors[2].wrapper.children[0];
            expect((element2 as PathElement).data == 'M185 130 L205 130 L205 70 L215 70A 5 5 165.37912601136836 , 1 0 225,70 L360 70A 5 5 165.37912601136836 , 1 0 370,70 L414.5 70').toBe(true);
            done();
        });

        it('Checking Orthogonal Line without inherit Bridging', (done: Function) => {

            diagram.connectors[2].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.InheritBridging |
                ConnectorConstraints.Bridging;
            diagram.dataBind();
            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M220 55 L220 75 L295 75 L295 179.5').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M290 40 L290 60 L365 60 L365 159.5').toBe(true);
            let element2: DiagramElement = diagram.connectors[2].wrapper.children[0];
            expect((element2 as PathElement).data == 'M185 130 L205 130 L205 70 L215 70A 5 5 165.37912601136836 , 1 0 225,70 L360 70A 5 5 165.37912601136836 , 1 0 370,70 L414.5 70').toBe(true);
            done();
        });

        it('Checking Orthogonal Line with inherit Bridging', (done: Function) => {

            diagram.connectors[2].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.InheritBridging | ConnectorConstraints.Bridging;
            diagram.dataBind();
            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M220 55 L220 75 L295 75 L295 179.5').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M290 40 L290 60 L365 60 L365 159.5').toBe(true);
            let element2: DiagramElement = diagram.connectors[2].wrapper.children[0];
            expect((element2 as PathElement).data == 'M185 130 L205 130 L205 70 L215 70A 5 5 165.37912601136836 , 1 0 225,70 L360 70A 5 5 165.37912601136836 , 1 0 370,70 L414.5 70').toBe(true);
            done();
        });
    });

    describe('Bridging based on connector without inherit', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);

            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 396, y: 80 },
                targetPoint: { x: 396, y: 220 },
                constraints: ConnectorConstraints.Default & ~ConnectorConstraints.InheritBridging
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                targetPoint: { x: 400, y: 200 },
                sourcePoint: { x: 300, y: 100 },
                constraints: ConnectorConstraints.Default & ~ConnectorConstraints.InheritBridging
            };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Straight',
                sourcePoint: { x: 393, y: 80 },
                targetPoint: { x: 393, y: 220 },
                constraints: ConnectorConstraints.Default & ~ConnectorConstraints.InheritBridging
            };
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector1, connector2, connector3],
                constraints: DiagramConstraints.Default | DiagramConstraints.Bridging
            });
            diagram.appendTo('#diagram1');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Bridging based on connector without inherit', (done: Function) => {

            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M396 80 L396 219.5').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M300 100 L300 120 L400 120 L400 199.5').toBe(true);
            done();
        });
        it('Merging bridge segments', (done: Function) => {
            diagram.connectors[1].constraints |= ConnectorConstraints.InheritBridging;
            diagram.dataBind();
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M300 100 L300 120 L388 120A 5 5 -168.6900675259798 , 1 1 400,121 L400 120 L400 199.5').toBe(true);
            getLineSegment(undefined, undefined, undefined, undefined);
            diagram.bridgingModule.intersect(
                (diagram.connectors[1] as Connector).intermediatePoints,
                (diagram.connectors[1] as Connector).intermediatePoints, true, 'Top', true);
            done();

        });
    });

    describe('Bridging based on diagram with inherit', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);

            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 300, y: 80 },
                targetPoint: { x: 400, y: 220 },
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                targetPoint: { x: 400, y: 200 },
                sourcePoint: { x: 300, y: 100 },
                constraints: ConnectorConstraints.Default & ~ConnectorConstraints.InheritBridging | ConnectorConstraints.Bridging
            };
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram2');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Bridging based on diagram with inherit', (done: Function) => {

            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M300 80 L399.71 219.59').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M300 100 L300 120 L323.57142857142856 120A 5 5 -168.6900675259798 , 1 1 333.57142857142856,120 L400 120 L400 199.5').toBe(true);
            done();
        });
    });

    describe('Bridging With Corner Radius Straight', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);

            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 300, y: 80 },
                targetPoint: { x: 400, y: 220 },
                cornerRadius: 10
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Straight',
                targetPoint: { x: 400, y: 200 },
                sourcePoint: { x: 300, y: 100 },
                cornerRadius: 10
            };
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector1, connector2], constraints: DiagramConstraints.Bridging
            });
            diagram.appendTo('#diagram3');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Bridging corner radius straight', (done: Function) => {

            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M300 80 L399.71 219.59').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M300 100 L346.4644660940673 146.46446609406726A 5 5 -135 , 1 1 353.53553390593277,153.53553390593274 L399.65 199.65').toBe(true);
            done();
        });
    });
    describe('Bridging With Corner Radius Orthogonal', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);

            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 300 },
                targetPoint: { x: 400, y: 400 },
                cornerRadius: 10
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 350, y: 350 },
                targetPoint: { x: 450, y: 450 },
                cornerRadius: 10
            };
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector1, connector2], constraints: DiagramConstraints.Bridging
            });
            diagram.appendTo('#diagram4');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Bridging corner radius Orthogonal', (done: Function) => {
            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M300 300 L300 310Q300 320 310 320 L390 320Q400 320 400 330 L400 399.5').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M350 350 L350 360Q350 370 360 370 L395 370A 5 5 -168.6900675259798 , 1 1 405,370 L440 370Q450 370 450 380 L450 449.5').toBe(true);
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
    describe('Bridging With connector visibility false', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);

            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 300, y: 80 },
                targetPoint: { x: 400, y: 220 },
                visible: false,
                cornerRadius: 10
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Straight',
                targetPoint: { x: 500, y: 150 },
                sourcePoint: { x: 200, y: 100 },
                cornerRadius: 10
            };
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector1, connector2], constraints: DiagramConstraints.Default | DiagramConstraints.Bridging
            });
            diagram.appendTo('#diagram3');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Bridging is enabled or not for the connector visibility false', (done: Function) => {
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            console.log("Connector element" + (element1 as PathElement).data);
            expect((element1 as PathElement).data == 'M200 100 L499.51 149.92').toBe(true);
            done();
        });
    });
    describe('Connector segments not update properly', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);


            diagram = new Diagram({
                width: 1000, height: 1000
            });
            diagram.appendTo('#diagram4');
            diagram.loadDiagram(`{
                "enableRtl": false,
                "locale": "en-US",
                "animationComplete": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "click": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "collectionChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "commandExecute": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "connectionChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "contextMenuBeforeItemRender": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "contextMenuClick": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "contextMenuOpen": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "created": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "dataLoaded": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "doubleClick": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "dragEnter": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "dragLeave": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "dragOver": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "drop": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "expandStateChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "historyChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "historyStateChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "keyDown": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "keyUp": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "mouseEnter": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "mouseLeave": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "mouseOver": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "onImageLoad": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "onUserHandleMouseDown": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "onUserHandleMouseEnter": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "onUserHandleMouseLeave": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "onUserHandleMouseUp": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "positionChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "propertyChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "rotateChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "scrollChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "segmentCollectionChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "selectionChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "sizeChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "sourcePointChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "targetPointChange": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "textEdit": {
                  "_isScalar": false,
                  "closed": false,
                  "isStopped": false,
                  "hasError": false,
                  "thrownError": null,
                  "__isAsync": false
                },
                "commandManager": {
                  "commands": [{
                    "name": "undo",
                    "parameter": "node",
                    "canExecute": {},
                    "execute": {},
                    "gesture": {
                      "key": 90,
                      "keyModifiers": 1
                    }
                  }, {
                    "name": "redo",
                    "parameter": "node",
                    "canExecute": {},
                    "execute": {},
                    "gesture": {
                      "key": 89,
                      "keyModifiers": 1
                    }
                  }, {
                    "name": "copy",
                    "parameter": "node",
                    "canExecute": {},
                    "execute": {},
                    "gesture": {
                      "key": 67,
                      "keyModifiers": 1
                    }
                  }, {
                    "name": "cut",
                    "parameter": "node",
                    "canExecute": {},
                    "execute": {},
                    "gesture": {
                      "key": 88,
                      "keyModifiers": 1
                    }
                  }, {
                    "name": "paste",
                    "parameter": "node",
                    "canExecute": {},
                    "gesture": {
                      "key": 86,
                      "keyModifiers": 1
                    }
                  }, {
                    "name": "delete",
                    "parameter": "node",
                    "canExecute": {},
                    "execute": {},
                    "gesture": {}
                  }]
                },
                "connectors": [{
                  "shape": {
                    "type": "None"
                  },
                  "id": "node0-node1",
                  "sourceID": "node0",
                  "sourceDecorator": {
                    "shape": "None",
                    "style": {
                      "fill": "black",
                      "strokeColor": "#778899",
                      "strokeWidth": 1,
                      "strokeDashArray": "",
                      "opacity": 1,
                      "gradient": {
                        "type": "None"
                      }
                    },
                    "width": 10,
                    "height": 10,
                    "pivot": {
                      "x": 0,
                      "y": 0.5
                    }
                  },
                  "targetID": "node1",
                  "cornerRadius": 10,
                  "targetDecorator": {
                    "shape": "Arrow",
                    "style": {
                      "fill": "#778899",
                      "strokeColor": "#778899",
                      "strokeWidth": 1,
                      "strokeDashArray": "",
                      "opacity": 1,
                      "gradient": {
                        "type": "None"
                      }
                    },
                    "height": 8,
                    "width": 10,
                    "pivot": {
                      "x": 0,
                      "y": 0.5
                    }
                  },
                  "type": "Orthogonal",
                  "constraints": 486150,
                  "sourcePortID": "right",
                  "targetPortID": "left",
                  "zIndex": 6,
                  "sourcePoint": {
                    "x": 65,
                    "y": 239
                  },
                  "targetPoint": {
                    "x": 91,
                    "y": 50
                  },
                  "sourcePadding": 0,
                  "targetPadding": 0,
                  "segments": [{
                    "type": "Orthogonal",
                    "length": 10,
                    "direction": "Bottom"
                  }, {
                    "type": "Orthogonal",
                    "length": 40,
                    "direction": "Left"
                  }, {
                    "type": "Orthogonal",
                    "length": 214,
                    "direction": "Top"
                  }, {
                    "type": "Orthogonal",
                    "length": 33,
                    "direction": "Right"
                  }, {
                    "type": "Orthogonal",
                    "direction": null
                  }],
                  "wrapper": {
                    "actualSize": {
                      "width": 53,
                      "height": 214
                    },
                    "offsetX": 64.5,
                    "offsetY": 142
                  },
                  "style": {
                    "strokeWidth": 1,
                    "strokeColor": "black",
                    "fill": "transparent",
                    "strokeDashArray": "",
                    "opacity": 1,
                    "gradient": {
                      "type": "None"
                    }
                  },
                  "annotations": [],
                  "visible": true,
                  "bridgeSpace": 10,
                  "hitPadding": 10,
                  "tooltip": {
                    "openOn": "Auto"
                  },
                  "parentId": ""
                }, {
                  "shape": {
                    "type": "None"
                  },
                  "id": "node0-node2",
                  "sourceID": "node0",
                  "sourceDecorator": {
                    "shape": "None",
                    "style": {
                      "fill": "black",
                      "strokeColor": "#778899",
                      "strokeWidth": 1,
                      "strokeDashArray": "",
                      "opacity": 1,
                      "gradient": {
                        "type": "None"
                      }
                    },
                    "width": 10,
                    "height": 10,
                    "pivot": {
                      "x": 0,
                      "y": 0.5
                    }
                  },
                  "targetID": "node2",
                  "cornerRadius": 10,
                  "targetDecorator": {
                    "shape": "Arrow",
                    "style": {
                      "fill": "#778899",
                      "strokeColor": "#778899",
                      "strokeWidth": 1,
                      "strokeDashArray": "",
                      "opacity": 1,
                      "gradient": {
                        "type": "None"
                      }
                    },
                    "height": 8,
                    "width": 10,
                    "pivot": {
                      "x": 0,
                      "y": 0.5
                    }
                  },
                  "type": "Orthogonal",
                  "constraints": 486150,
                  "sourcePortID": "right",
                  "targetPortID": "left",
                  "zIndex": 7,
                  "sourcePoint": {
                    "x": 65,
                    "y": 239
                  },
                  "targetPoint": {
                    "x": 91,
                    "y": 166
                  },
                  "sourcePadding": 0,
                  "targetPadding": 0,
                  "segments": [{
                    "type": "Orthogonal",
                    "length": 10,
                    "direction": "Bottom"
                  }, {
                    "type": "Orthogonal",
                    "length": 40,
                    "direction": "Left"
                  }, {
                    "type": "Orthogonal",
                    "length": 98,
                    "direction": "Top"
                  }, {
                    "type": "Orthogonal",
                    "length": 33,
                    "direction": "Right"
                  }, {
                    "type": "Orthogonal",
                    "direction": null
                  }],
                  "wrapper": {
                    "actualSize": {
                      "width": 53,
                      "height": 98
                    },
                    "offsetX": 64.5,
                    "offsetY": 200
                  },
                  "style": {
                    "strokeWidth": 1,
                    "strokeColor": "black",
                    "fill": "transparent",
                    "strokeDashArray": "",
                    "opacity": 1,
                    "gradient": {
                      "type": "None"
                    }
                  },
                  "annotations": [],
                  "visible": true,
                  "bridgeSpace": 10,
                  "hitPadding": 10,
                  "tooltip": {
                    "openOn": "Auto"
                  },
                  "parentId": ""
                }],
                "constraints": 2550,
                "getCustomTool": {},
                "height": "100%",
                "nodes": [{
                  "shape": {
                    "type": "Bpmn",
                    "shape": "Event",
                    "event": {
                      "event": "Start",
                      "trigger": "None"
                    },
                    "activity": {
                      "subProcess": {}
                    },
                    "annotations": []
                  },
                  "id": "node0",
                  "width": 30,
                  "height": 30,
                  "annotations": [{
                    "id": "node0-label",
                    "content": "Start",
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Top",
                    "style": {
                      "strokeWidth": 0,
                      "strokeColor": "transparent",
                      "fill": "transparent",
                      "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                      "fontSize": 11,
                      "textOverflow": "Wrap",
                      "textWrapping": "WrapWithOverflow",
                      "whiteSpace": "CollapseSpace",
                      "bold": false,
                      "color": "black",
                      "italic": false,
                      "opacity": 1,
                      "strokeDashArray": "",
                      "textAlign": "Center",
                      "textDecoration": "None"
                    },
                    "offset": {
                      "x": 0.5,
                      "y": 1
                    },
                    "margin": {
                      "left": 0,
                      "top": 2,
                      "right": 0,
                      "bottom": 0
                    },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": {
                      "link": "",
                      "content": "",
                      "textDecoration": "None"
                    },
                    "visibility": true,
                    "rotateAngle": 0
                  }],
                  "offsetX": 50,
                  "offsetY": 239,
                  "style": {
                    "fill": "#FFFFFF",
                    "strokeColor": "#62A716",
                    "strokeWidth": 2,
                    "strokeDashArray": "",
                    "opacity": 1,
                    "gradient": {
                      "type": "None"
                    }
                  },
                  "constraints": 38795174,
                  "addInfo": {
                    "node": {
                      "__type": "StartNode:http://www.kofax.com/agility/services/sdk",
                      "Process": {
                        "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "ProcessIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "4C6F8CDABC3640DC937E1D447955A3D2",
                          "Version": 6,
                          "Name": "PreconditionsVariables"
                        },
                        "Name": null,
                        "Version": 0,
                        "Id": null,
                        "ProcessType": 0,
                        "ExpectedDuration": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": true,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "ExpectedCost": 0,
                        "Synchronous": false,
                        "Category": {
                          "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "00DE1D3FB1524285952B1DD326D7EDC4",
                          "Name": "US1138144"
                        },
                        "AssociatedCase": {
                          "__type": "CaseIdentity:http://www.kofax.com/agility/services/sdk",
                          "CaseReference": "",
                          "CaseId": ""
                        },
                        "LockedBy": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "45A6F67FBA114B9ABDA454EF92363727",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "Description": "",
                        "LatestVersion": true,
                        "OwnerId": null,
                        "SupportsSkinning": false,
                        "Author": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "Unknown",
                          "ResourceType": 0
                        },
                        "ServerId": "7C309C9BD5473A4B9912086844525E9F",
                        "LastModified": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "LastModifiedDate": {},
                        "WorkQueueDefinition": {
                          "__type": "WorkQueueDefinitionIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "",
                          "Name": ""
                        },
                        "CaptureEnabled": false,
                        "HasDocumentContainer": true
                      },
                      "Identity": {
                        "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 0,
                        "Name": "Start",
                        "NodeType": 5
                      },
                      "NodeType": 5,
                      "Origins": [],
                      "Dependants": [],
                      "Destinations": [{
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 1,
                          "Name": "Scan",
                          "NodeType": 27
                        },
                        "EmbeddedProcess": {}
                      }, {
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 2,
                          "Name": "Ordinary",
                          "NodeType": 1
                        },
                        "EmbeddedProcess": {}
                      }, {
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 3,
                          "Name": "Create New Job",
                          "NodeType": 15
                        },
                        "EmbeddedProcess": {}
                      }, {
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 4,
                          "Name": ".Net",
                          "NodeType": 10
                        },
                        "EmbeddedProcess": {}
                      }],
                      "MilestoneAvailable": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "MilestoneCompleted": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "PendingMilestone": null,
                      "DesignTimeSettingsXml": null,
                      "States": [],
                      "AvailableFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "CompletedFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "Status": 0,
                      "HelpText": null,
                      "IsAfterStartNode": false,
                      "PathId": 0,
                      "EmbeddedProcessCount": 0,
                      "EmbeddedName": "",
                      "BranchingRules": null,
                      "IsLibraryItem": false,
                      "LibraryItemName": "",
                      "ActivationProbability": 100,
                      "TitlePosition": 0,
                      "NodeDescription": "",
                      "TextPosition": 9,
                      "ShouldTrackVariableChanges": false,
                      "Color": "#FF62A716",
                      "Height": 30,
                      "Width": 30,
                      "XPosition": 50,
                      "YPosition": 239,
                      "Allocate": false,
                      "MobileFriendly": false,
                      "RuntimeSettings": 0,
                      "StartNodeEventType": 0,
                      "EndNodeEventType": 0,
                      "Annotations": [],
                      "Attachments": [],
                      "SwimLane": {
                        "__type": "SwimLaneIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": "Lane1",
                        "Index": 0,
                        "PoolId": "AC197505CA9545DCAC0FA527A66FC91A",
                        "Height": 732.7
                      },
                      "CollaborationNodes": [],
                      "GroupArtifacts": [],
                      "ShouldEvaluateScoreWhenAvailable": false,
                      "ShouldEvaluateScoreWhenCompleted": false,
                      "PartialCompletion": false,
                      "DesignTimeType": 0,
                      "NodeColorGroup": 0,
                      "InheritNodeGroupColorFromSystem": false,
                      "ThreadPool": {
                        "__type": "ThreadPoolIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 0,
                        "Name": "Default Thread Pool"
                      }
                    }
                  },
                  "ports": [{
                    "inEdges": [],
                    "outEdges": ["node0-node1", "node0-node2"],
                    "id": "right",
                    "offset": {
                      "x": 1,
                      "y": 0.5
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "bottom",
                    "offset": {
                      "x": 0.5,
                      "y": 1
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }],
                  "zIndex": 0,
                  "container": null,
                  "visible": true,
                  "horizontalAlignment": "Left",
                  "verticalAlignment": "Top",
                  "backgroundColor": "transparent",
                  "borderColor": "none",
                  "borderWidth": 0,
                  "rotateAngle": 0,
                  "pivot": {
                    "x": 0.5,
                    "y": 0.5
                  },
                  "margin": {},
                  "flip": "None",
                  "wrapper": {
                    "actualSize": {
                      "width": 30,
                      "height": 30
                    },
                    "offsetX": 50,
                    "offsetY": 239
                  },
                  "isExpanded": true,
                  "expandIcon": {
                    "shape": "None"
                  },
                  "tooltip": {
                    "openOn": "Auto"
                  },
                  "inEdges": [],
                  "outEdges": ["node0-node1", "node0-node2"],
                  "parentId": "",
                  "processId": "",
                  "umlIndex": -1,
                  "isPhase": false,
                  "isLane": false
                }, {
                  "shape": {
                    "shape": "Activity",
                    "type": "Bpmn",
                    "activity": {
                      "task": {
                        "type": "User",
                        "call": false,
                        "compensation": false,
                        "loop": "None"
                      },
                      "subProcess": {
                        "type": "None"
                      },
                      "activity": "Task"
                    },
                    "annotations": []
                  },
                  "id": "node1",
                  "width": 90,
                  "height": 60,
                  "annotations": [{
                    "id": "node1-label",
                    "content": "Scan",
                    "style": {
                      "strokeWidth": 0,
                      "strokeColor": "transparent",
                      "fill": "transparent",
                      "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                      "fontSize": 11,
                      "textOverflow": "Wrap",
                      "textWrapping": "WrapWithOverflow",
                      "whiteSpace": "CollapseSpace",
                      "color": "#000000",
                      "bold": false,
                      "italic": false,
                      "opacity": 1,
                      "strokeDashArray": "",
                      "textAlign": "Center",
                      "textDecoration": "None"
                    },
                    "offset": {
                      "x": 0.5,
                      "y": 0.5
                    },
                    "margin": {
                      "top": 10,
                      "right": 2,
                      "bottom": 3,
                      "left": 2
                    },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": {
                      "link": "",
                      "content": "",
                      "textDecoration": "None"
                    },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                  }],
                  "offsetX": 136,
                  "offsetY": 50,
                  "style": {
                    "fill": "#E3EDF3",
                    "strokeColor": "#7fadc8",
                    "strokeWidth": 2,
                    "strokeDashArray": "",
                    "opacity": 1,
                    "gradient": {
                      "type": "None"
                    }
                  },
                  "constraints": 38795238,
                  "addInfo": {
                    "node": {
                      "__type": "ScanCaptureActivity:http://www.kofax.com/agility/services/sdk",
                      "Process": {
                        "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "ProcessIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "4C6F8CDABC3640DC937E1D447955A3D2",
                          "Version": 6,
                          "Name": "PreconditionsVariables"
                        },
                        "Name": null,
                        "Version": 0,
                        "Id": null,
                        "ProcessType": 0,
                        "ExpectedDuration": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": true,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "ExpectedCost": 0,
                        "Synchronous": false,
                        "Category": {
                          "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "00DE1D3FB1524285952B1DD326D7EDC4",
                          "Name": "US1138144"
                        },
                        "AssociatedCase": {
                          "__type": "CaseIdentity:http://www.kofax.com/agility/services/sdk",
                          "CaseReference": "",
                          "CaseId": ""
                        },
                        "LockedBy": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "45A6F67FBA114B9ABDA454EF92363727",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "Description": "",
                        "LatestVersion": true,
                        "OwnerId": null,
                        "SupportsSkinning": false,
                        "Author": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "Unknown",
                          "ResourceType": 0
                        },
                        "ServerId": "7C309C9BD5473A4B9912086844525E9F",
                        "LastModified": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "LastModifiedDate": {},
                        "WorkQueueDefinition": {
                          "__type": "WorkQueueDefinitionIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "",
                          "Name": ""
                        },
                        "CaptureEnabled": false,
                        "HasDocumentContainer": true
                      },
                      "Identity": {
                        "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 1,
                        "Name": "Scan",
                        "NodeType": 27
                      },
                      "NodeType": 27,
                      "Origins": [{
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 0,
                          "Name": "Start",
                          "NodeType": 5
                        },
                        "EmbeddedProcess": {}
                      }],
                      "Dependants": [],
                      "Destinations": [{
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 8,
                          "Name": "End",
                          "NodeType": 6
                        },
                        "EmbeddedProcess": {}
                      }],
                      "MilestoneAvailable": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "MilestoneCompleted": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "PendingMilestone": null,
                      "DesignTimeSettingsXml": "<designtimesettings><xposition>136</xposition><yposition>50</yposition><width>90</width><height>60</height><inheritcolorfromsystem>True</inheritcolorfromsystem><colour>#FF7AADCC</colour><textposition>Centre</textposition><lane><name>Lane1</name><index>0</index><poolid>AC197505CA9545DCAC0FA527A66FC91A</poolid><height>732.7</height></lane><annotations /><attachments /><resourcenotes /></designtimesettings>",
                      "States": [],
                      "AvailableFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "CompletedFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "Status": 0,
                      "HelpText": "",
                      "IsAfterStartNode": true,
                      "PathId": 0,
                      "EmbeddedProcessCount": 0,
                      "EmbeddedName": "",
                      "BranchingRules": null,
                      "IsLibraryItem": false,
                      "LibraryItemName": "",
                      "ActivationProbability": 100,
                      "TitlePosition": 5,
                      "NodeDescription": "",
                      "TextPosition": 8,
                      "ShouldTrackVariableChanges": false,
                      "Color": "#FFE3EDF3",
                      "Height": 60,
                      "Width": 90,
                      "XPosition": 136,
                      "YPosition": 50,
                      "Allocate": false,
                      "MobileFriendly": false,
                      "RuntimeSettings": 0,
                      "StartNodeEventType": 0,
                      "EndNodeEventType": 0,
                      "Annotations": [],
                      "Attachments": [],
                      "SwimLane": {
                        "__type": "SwimLaneIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": "Lane1",
                        "Index": 0,
                        "PoolId": "AC197505CA9545DCAC0FA527A66FC91A",
                        "Height": 732.7
                      },
                      "CollaborationNodes": [],
                      "GroupArtifacts": [],
                      "ShouldEvaluateScoreWhenAvailable": false,
                      "ShouldEvaluateScoreWhenCompleted": false,
                      "PartialCompletion": false,
                      "DesignTimeType": 27,
                      "NodeColorGroup": 2,
                      "InheritNodeGroupColorFromSystem": true,
                      "UsePreviousUser": false,
                      "SkillLevel": 10,
                      "SecurityLevel": 10,
                      "TargetDuration": {
                        "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                        "Days": 0,
                        "Hours": 0,
                        "Minutes": 0,
                        "Seconds": 0,
                        "UseNegative": false,
                        "Negative": false,
                        "ShowSeconds": true,
                        "DynamicVariable": null,
                        "Milestone": null,
                        "DurationType": 0
                      },
                      "Priority": 1,
                      "Automatic": false,
                      "LagDuration": {
                        "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                        "Days": 0,
                        "Hours": 0,
                        "Minutes": 0,
                        "Seconds": 0,
                        "UseNegative": true,
                        "Negative": false,
                        "ShowSeconds": false,
                        "DynamicVariable": null,
                        "Milestone": null,
                        "DurationType": 0
                      },
                      "FixedCost": 0,
                      "ExpectedCost": 0,
                      "AssociatedFile": "",
                      "Description": "",
                      "RuntimeSetting": 0,
                      "NegativeDuration": false,
                      "TargetTimeVaried": null,
                      "Rag": {
                        "__type": "RagStatus:http://www.kofax.com/agility/services/sdk",
                        "SlaStatus2Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus3Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus4Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus5Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        }
                      },
                      "HasDueDateTriggers": false,
                      "UseDueDateVaried": false,
                      "PreconditionText": {\"__type\":\"Rule:#Agility.Sdk.Model.Rules\",\"RuleInputs\":[{\"__type\":\"RuleInput:#Agility.Sdk.Model.Rules\",\"Id\":\"PROCESSEVENT_0F9DBFA9754D4A90A74E926D53924FFC\",\"Scope\":20,\"RuleInputType\":0},{\"__type\":\"RuleInput:#Agility.Sdk.Model.Rules\",\"Id\":\"_DOC_TYPE_CC89A4D7034642B194DAE4B2DEF0579E_P_941C28E46A664D0981F54A160E26BB97_NO_OF_DOCS\",\"Scope\":20,\"RuleInputType\":0}],\"Script\":\" ¬PROCESSEVENT_0F9DBFA9754D4A90A74E926D53924FFC¬ < ¬_DOC_TYPE_CC89A4D7034642B194DAE4B2DEF0579E_P_941C28E46A664D0981F54A160E26BB97_NO_OF_DOCS¬ \",\"RuleType\":1},
                      "Form": null,
                      "Resources": {
                        "__type": "ActivityResources:http://www.kofax.com/agility/services/sdk",
                        "UsableResources": [{
                          "__type": "ActivityResource:http://www.kofax.com/agility/services/sdk",
                          "StaticResource": {
                            "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": "7DF43CCDF24611D2804B00104B71BD15",
                            "Name": "Everyone",
                            "ResourceType": 3
                          },
                          "SequentialOrder": 0,
                          "Excluded": false,
                          "Dynamic": false,
                          "DynamicResourceVariable": null
                        }],
                        "DynamicResourcesOverwriteStatic": false,
                        "RequiredResources": [],
                        "SameAsResource": null,
                        "ResourceNotes": null,
                        "AdvanceWorkflowRules": {
                          "__type": "AdvanceWorkflowRules:http://www.kofax.com/agility/services/sdk",
                          "SequentialActivityAssignment": false,
                          "ConcurrentActivityAccess": false,
                          "ExpandGroupResources": false,
                          "NoOfResourcesRequired": 0,
                          "NoOfResourcesRequiredValue": 0,
                          "NoOfResourcesRequiredVariable": {
                            "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": "",
                            "Name": ""
                          },
                          "ExitCondition": null,
                          "UseAdvanceWorkflowRules": false,
                          "UseExitCondition": false,
                          "UseExcludedResources": false,
                          "UseResourceSettings": false,
                          "NeedsValidated": false
                        }
                      },
                      "ThreadPool": {
                        "__type": "ThreadPoolIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 0,
                        "Name": "Default Thread Pool"
                      },
                      "Notification": {
                        "__type": "ActivityNotification:http://www.kofax.com/agility/services/sdk",
                        "SendEmail": false,
                        "SendTo": 0,
                        "SubjectText": null,
                        "SubjectVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "ContentText": null,
                        "ContentVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "UrlText": null,
                        "UrlVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "AppendAssociatedFile": false
                      },
                      "PreconditionInputs": [{
                        "__type": "ActivityPrecondition:http://www.kofax.com/agility/services/sdk",
                        "Position": 0,
                        "OpenBrackets": "",
                        "Event": {
                          "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": "PROCESSEVENT",
                          "Scope": 0,
                          "DisplayName": null
                        },
                        "Operator": "<",
                        "LiteralValue": null,
                        "Variable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "_DOC_TYPE_CC89A4D7034642B194DAE4B2DEF0579E_P_941C28E46A664D0981F54A160E26BB97_NO_OF_DOCS",
                          "Name": null
                        },
                        "CloseBrackets": "",
                        "LogOperator": null,
                        "DocumentContainerIdentity": null
                      }],
                      "DueDateTriggers": [],
                      "BusinessEvents": [],
                      "InputVariables": [{
                        "__type": "Variable:http://www.kofax.com/agility/services/sdk",
                        "VariableType": 0,
                        "Value": null,
                        "Identity": {
                          "__type": "VariableIdentity2:http://www.kofax.com/agility/services/sdk",
                          "Id": "DOCUMENT",
                          "Name": null,
                          "Version": 0,
                          "OwnerId": null
                        },
                        "Dynamic": false,
                        "Entity": {
                          "__type": "EntityIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "Category": null,
                        "Grouping": null,
                        "ProcessSummary": {
                          "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                          "Identity": {
                            "__type": "ProcessIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": "",
                            "Version": 0,
                            "Name": ""
                          },
                          "Name": null,
                          "Version": 0,
                          "Id": null,
                          "ProcessType": 0,
                          "ExpectedDuration": null,
                          "ExpectedCost": 0,
                          "Synchronous": false,
                          "Category": {
                            "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": null,
                            "Name": null
                          },
                          "AssociatedCase": {
                            "__type": "CaseIdentity:http://www.kofax.com/agility/services/sdk",
                            "CaseReference": "",
                            "CaseId": null
                          },
                          "LockedBy": null,
                          "Description": null,
                          "LatestVersion": false,
                          "OwnerId": null,
                          "SupportsSkinning": false,
                          "Author": {
                            "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": null,
                            "Name": null,
                            "ResourceType": 0
                          },
                          "ServerId": null,
                          "LastModified": null,
                          "LastModifiedDate": {},
                          "WorkQueueDefinition": null,
                          "CaptureEnabled": false,
                          "HasDocumentContainer": false
                        },
                        "IsDateExpression": false
                      }],
                      "OutputVariables": [],
                      "CreationDate": {},
                      "UseSameAsPrevious": false,
                      "AppendAssociatedFile": false,
                      "UseSameAsPreviousType": false,
                      "Purpose": "",
                      "TaskId": 0,
                      "SettingsXml": null,
                      "ActivitySettings": {
                        "__type": "ScanCaptureActivitySettings:http://www.kofax.com/agility/services/sdk",
                        "ClassificationGroup": {
                          "__type": "ClassificationGroupIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "6015F102C09C43EC84BB52DA9845666D",
                          "Version": 1,
                          "Name": "CG"
                        },
                        "ScanVrsProfiles": [{
                          "__type": "ScanVrsProfileIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "C525FA863EB74348961543C740ED00A0",
                          "Name": "Default"
                        }],
                        "SeparationProfile": {
                          "__type": "SeparationProfileIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "EA50A5E926E34ECCAAED6913E061831D",
                          "Name": null
                        },
                        "DefaultScanVrsProfile": {
                          "__type": "ScanVrsProfileIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "C525FA863EB74348961543C740ED00A0",
                          "Name": "Default"
                        },
                        "ProcessLevel": null,
                        "ClassificationGroupLevel": 1,
                        "PageRenditionLevel": 1,
                        "SaveScannedImageAsPageRendition": false,
                        "ScannedImagePageRendition": 0,
                        "DefaultDisplayPageRendition": -1,
                        "AutoNavigateToRejectedItems": false,
                        "AllowCompletionOnlyWhenNoRejectedItems": false,
                        "InheritDocumentModifySettings": true,
                        "AllowSplitMergeDeleteImportedDocument": true,
                        "AllowRotateReorderImportedImages": true,
                        "AfterScanEvent": {
                          "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": null,
                          "Scope": 0,
                          "DisplayName": null
                        },
                        "ScanCaptureOption": 0
                      },
                      "MFPReady": 0,
                      "ResetLimit": -1,
                      "ActivityTimedOutAction": 0,
                      "SuspendReasonText": null,
                      "SuspendReasonVarId": null,
                      "ClassificationGroup": {
                        "__type": "ClassificationGroupIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": "6015F102C09C43EC84BB52DA9845666D",
                        "Version": 1,
                        "Name": "CG"
                      },
                      "ScanVrsProfiles": [{
                        "__type": "ScanVrsProfileIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": "C525FA863EB74348961543C740ED00A0",
                        "Name": "Default"
                      }],
                      "ClassificationGroupLevel": 1,
                      "SeparationProfile": {
                        "__type": "SeparationProfileIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": "EA50A5E926E34ECCAAED6913E061831D",
                        "Name": null
                      },
                      "DefaultScanVrsProfile": {
                        "__type": "ScanVrsProfileIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": "C525FA863EB74348961543C740ED00A0",
                        "Name": "Default"
                      },
                      "ProcessLevel": null,
                      "PageRenditionLevel": 1,
                      "SaveScannedImageAsPageRendition": false,
                      "ScannedImagePageRendition": 0,
                      "DefaultDisplayPageRendition": -1,
                      "AutoNavigateToRejectedItems": false,
                      "AllowCompletionOnlyWhenNoRejectedItems": false,
                      "DocumentModificationLevel": true,
                      "AllowSplitMergeDeleteImportedDocument": true,
                      "AllowRotateReorderImportedImages": true,
                      "AfterScanEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "ScanCaptureOption": 0
                    }
                  },
                  "ports": [{
                    "inEdges": ["node0-node1"],
                    "outEdges": [],
                    "id": "left",
                    "offset": {
                      "x": 0,
                      "y": 0.5
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "top",
                    "offset": {
                      "x": 0.5,
                      "y": 0
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "right",
                    "offset": {
                      "x": 1,
                      "y": 0.5
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "bottom",
                    "offset": {
                      "x": 0.5,
                      "y": 1
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }],
                  "zIndex": 1,
                  "container": null,
                  "visible": true,
                  "horizontalAlignment": "Left",
                  "verticalAlignment": "Top",
                  "backgroundColor": "transparent",
                  "borderColor": "none",
                  "borderWidth": 0,
                  "rotateAngle": 0,
                  "pivot": {
                    "x": 0.5,
                    "y": 0.5
                  },
                  "margin": {},
                  "flip": "None",
                  "wrapper": {
                    "actualSize": {
                      "width": 90,
                      "height": 60
                    },
                    "offsetX": 136,
                    "offsetY": 50
                  },
                  "isExpanded": true,
                  "expandIcon": {
                    "shape": "None"
                  },
                  "tooltip": {
                    "openOn": "Auto"
                  },
                  "inEdges": ["node0-node1"],
                  "outEdges": [],
                  "parentId": "",
                  "processId": "",
                  "umlIndex": -1,
                  "isPhase": false,
                  "isLane": false
                }, {
                  "shape": {
                    "shape": "Activity",
                    "type": "Bpmn",
                    "activity": {
                      "activity": "Task",
                      "task": {
                        "type": "User",
                        "call": false,
                        "compensation": false,
                        "loop": "None"
                      },
                      "subProcess": {
                        "type": "None"
                      }
                    },
                    "annotations": []
                  },
                  "id": "node2",
                  "width": 90,
                  "height": 60,
                  "annotations": [{
                    "id": "node2-label",
                    "content": "Ordinary",
                    "style": {
                      "strokeWidth": 0,
                      "strokeColor": "transparent",
                      "fill": "transparent",
                      "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                      "fontSize": 11,
                      "textOverflow": "Wrap",
                      "textWrapping": "WrapWithOverflow",
                      "whiteSpace": "CollapseSpace",
                      "color": "#000000",
                      "bold": false,
                      "italic": false,
                      "opacity": 1,
                      "strokeDashArray": "",
                      "textAlign": "Center",
                      "textDecoration": "None"
                    },
                    "offset": {
                      "x": 0.5,
                      "y": 0.5
                    },
                    "margin": {
                      "top": 10,
                      "right": 2,
                      "bottom": 3,
                      "left": 2
                    },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": {
                      "link": "",
                      "content": "",
                      "textDecoration": "None"
                    },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                  }],
                  "offsetX": 136,
                  "offsetY": 166,
                  "style": {
                    "fill": "#E3EDF3",
                    "strokeColor": "#7fadc8",
                    "strokeWidth": 2,
                    "strokeDashArray": "",
                    "opacity": 1,
                    "gradient": {
                      "type": "None"
                    }
                  },
                  "constraints": 38795238,
                  "addInfo": {
                    "node": {
                      "__type": "OrdinaryActivity:http://www.kofax.com/agility/services/sdk",
                      "Process": {
                        "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "ProcessIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "4C6F8CDABC3640DC937E1D447955A3D2",
                          "Version": 6,
                          "Name": "PreconditionsVariables"
                        },
                        "Name": null,
                        "Version": 0,
                        "Id": null,
                        "ProcessType": 0,
                        "ExpectedDuration": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": true,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "ExpectedCost": 0,
                        "Synchronous": false,
                        "Category": {
                          "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "00DE1D3FB1524285952B1DD326D7EDC4",
                          "Name": "US1138144"
                        },
                        "AssociatedCase": {
                          "__type": "CaseIdentity:http://www.kofax.com/agility/services/sdk",
                          "CaseReference": "",
                          "CaseId": ""
                        },
                        "LockedBy": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "45A6F67FBA114B9ABDA454EF92363727",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "Description": "",
                        "LatestVersion": true,
                        "OwnerId": null,
                        "SupportsSkinning": false,
                        "Author": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "Unknown",
                          "ResourceType": 0
                        },
                        "ServerId": "7C309C9BD5473A4B9912086844525E9F",
                        "LastModified": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "LastModifiedDate": {},
                        "WorkQueueDefinition": {
                          "__type": "WorkQueueDefinitionIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "",
                          "Name": ""
                        },
                        "CaptureEnabled": false,
                        "HasDocumentContainer": true
                      },
                      "Identity": {
                        "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 2,
                        "Name": "Ordinary",
                        "NodeType": 1
                      },
                      "NodeType": 1,
                      "Origins": [{
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 0,
                          "Name": "Start",
                          "NodeType": 5
                        },
                        "EmbeddedProcess": {}
                      }],
                      "Dependants": [],
                      "Destinations": [{
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 8,
                          "Name": "End",
                          "NodeType": 6
                        },
                        "EmbeddedProcess": {}
                      }],
                      "MilestoneAvailable": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "MilestoneCompleted": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "PendingMilestone": null,
                      "DesignTimeSettingsXml": "<designtimesettings><xposition>136</xposition><yposition>166</yposition><width>90</width><height>60</height><inheritcolorfromsystem>True</inheritcolorfromsystem><colour>#FF7AADCC</colour><textposition>Centre</textposition><lane><name>Lane1</name><index>0</index><poolid>AC197505CA9545DCAC0FA527A66FC91A</poolid><height>732.7</height></lane><annotations /><attachments /><resourcenotes /></designtimesettings>",
                      "States": [],
                      "AvailableFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "CompletedFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "Status": 0,
                      "HelpText": "",
                      "IsAfterStartNode": true,
                      "PathId": 0,
                      "EmbeddedProcessCount": 0,
                      "EmbeddedName": "",
                      "BranchingRules": null,
                      "IsLibraryItem": false,
                      "LibraryItemName": "",
                      "ActivationProbability": 100,
                      "TitlePosition": 5,
                      "NodeDescription": "",
                      "TextPosition": 8,
                      "ShouldTrackVariableChanges": false,
                      "Color": "#FFE3EDF3",
                      "Height": 60,
                      "Width": 90,
                      "XPosition": 136,
                      "YPosition": 166,
                      "Allocate": false,
                      "MobileFriendly": false,
                      "RuntimeSettings": 0,
                      "StartNodeEventType": 0,
                      "EndNodeEventType": 0,
                      "Annotations": [],
                      "Attachments": [],
                      "SwimLane": {
                        "__type": "SwimLaneIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": "Lane1",
                        "Index": 0,
                        "PoolId": "AC197505CA9545DCAC0FA527A66FC91A",
                        "Height": 732.7
                      },
                      "CollaborationNodes": [],
                      "GroupArtifacts": [],
                      "ShouldEvaluateScoreWhenAvailable": false,
                      "ShouldEvaluateScoreWhenCompleted": false,
                      "PartialCompletion": false,
                      "DesignTimeType": 1,
                      "NodeColorGroup": 1,
                      "InheritNodeGroupColorFromSystem": true,
                      "UsePreviousUser": false,
                      "SkillLevel": 10,
                      "SecurityLevel": 10,
                      "TargetDuration": {
                        "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                        "Days": 0,
                        "Hours": 0,
                        "Minutes": 0,
                        "Seconds": 0,
                        "UseNegative": false,
                        "Negative": false,
                        "ShowSeconds": true,
                        "DynamicVariable": null,
                        "Milestone": null,
                        "DurationType": 0
                      },
                      "Priority": 1,
                      "Automatic": false,
                      "LagDuration": {
                        "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                        "Days": 0,
                        "Hours": 0,
                        "Minutes": 0,
                        "Seconds": 0,
                        "UseNegative": true,
                        "Negative": false,
                        "ShowSeconds": false,
                        "DynamicVariable": null,
                        "Milestone": null,
                        "DurationType": 0
                      },
                      "FixedCost": 0,
                      "ExpectedCost": 0,
                      "AssociatedFile": "",
                      "Description": "",
                      "RuntimeSetting": 0,
                      "NegativeDuration": false,
                      "TargetTimeVaried": null,
                      "Rag": {
                        "__type": "RagStatus:http://www.kofax.com/agility/services/sdk",
                        "SlaStatus2Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus3Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus4Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus5Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        }
                      },
                      "HasDueDateTriggers": false,
                      "UseDueDateVaried": false,
                      "PreconditionText": null,
                      "Form": null,
                      "Resources": {
                        "__type": "ActivityResources:http://www.kofax.com/agility/services/sdk",
                        "UsableResources": [{
                          "__type": "ActivityResource:http://www.kofax.com/agility/services/sdk",
                          "StaticResource": {
                            "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": "7DF43CCDF24611D2804B00104B71BD15",
                            "Name": "Everyone",
                            "ResourceType": 3
                          },
                          "SequentialOrder": 0,
                          "Excluded": false,
                          "Dynamic": false,
                          "DynamicResourceVariable": null
                        }],
                        "DynamicResourcesOverwriteStatic": false,
                        "RequiredResources": [],
                        "SameAsResource": null,
                        "ResourceNotes": null,
                        "AdvanceWorkflowRules": {
                          "__type": "AdvanceWorkflowRules:http://www.kofax.com/agility/services/sdk",
                          "SequentialActivityAssignment": false,
                          "ConcurrentActivityAccess": false,
                          "ExpandGroupResources": false,
                          "NoOfResourcesRequired": 0,
                          "NoOfResourcesRequiredValue": 0,
                          "NoOfResourcesRequiredVariable": {
                            "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": "",
                            "Name": ""
                          },
                          "ExitCondition": null,
                          "UseAdvanceWorkflowRules": false,
                          "UseExitCondition": false,
                          "UseExcludedResources": false,
                          "UseResourceSettings": false,
                          "NeedsValidated": false
                        }
                      },
                      "ThreadPool": {
                        "__type": "ThreadPoolIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 0,
                        "Name": "Default Thread Pool"
                      },
                      "Notification": {
                        "__type": "ActivityNotification:http://www.kofax.com/agility/services/sdk",
                        "SendEmail": false,
                        "SendTo": 0,
                        "SubjectText": null,
                        "SubjectVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "ContentText": null,
                        "ContentVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "UrlText": null,
                        "UrlVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "AppendAssociatedFile": false
                      },
                      "PreconditionInputs": [],
                      "DueDateTriggers": [],
                      "BusinessEvents": [],
                      "InputVariables": [],
                      "OutputVariables": [],
                      "CreationDate": {},
                      "UseSameAsPrevious": false,
                      "AppendAssociatedFile": false,
                      "UseSameAsPreviousType": false,
                      "Purpose": "",
                      "TaskId": 0,
                      "SettingsXml": null,
                      "ActivitySettings": null,
                      "MFPReady": 0,
                      "ResetLimit": -1,
                      "ActivityTimedOutAction": 0,
                      "SuspendReasonText": null,
                      "SuspendReasonVarId": null
                    }
                  },
                  "ports": [{
                    "inEdges": ["node0-node2"],
                    "outEdges": [],
                    "id": "left",
                    "offset": {
                      "x": 0,
                      "y": 0.5
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "top",
                    "offset": {
                      "x": 0.5,
                      "y": 0
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "right",
                    "offset": {
                      "x": 1,
                      "y": 0.5
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "bottom",
                    "offset": {
                      "x": 0.5,
                      "y": 1
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }],
                  "zIndex": 2,
                  "container": null,
                  "visible": true,
                  "horizontalAlignment": "Left",
                  "verticalAlignment": "Top",
                  "backgroundColor": "transparent",
                  "borderColor": "none",
                  "borderWidth": 0,
                  "rotateAngle": 0,
                  "pivot": {
                    "x": 0.5,
                    "y": 0.5
                  },
                  "margin": {},
                  "flip": "None",
                  "wrapper": {
                    "actualSize": {
                      "width": 90,
                      "height": 60
                    },
                    "offsetX": 136,
                    "offsetY": 166
                  },
                  "isExpanded": true,
                  "expandIcon": {
                    "shape": "None"
                  },
                  "tooltip": {
                    "openOn": "Auto"
                  },
                  "inEdges": ["node0-node2"],
                  "outEdges": [],
                  "parentId": "",
                  "processId": "",
                  "umlIndex": -1,
                  "isPhase": false,
                  "isLane": false
                }, {
                  "shape": {
                    "shape": "Activity",
                    "type": "Bpmn",
                    "activity": {
                      "activity": "Task",
                      "task": {
                        "type": "Service",
                        "call": false,
                        "compensation": false,
                        "loop": "None"
                      },
                      "subProcess": {
                        "type": "None"
                      }
                    },
                    "annotations": []
                  },
                  "id": "node3",
                  "width": 90,
                  "height": 60,
                  "annotations": [{
                    "id": "node3-label",
                    "content": "Create New Job",
                    "style": {
                      "strokeWidth": 0,
                      "strokeColor": "transparent",
                      "fill": "transparent",
                      "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                      "fontSize": 11,
                      "textOverflow": "Wrap",
                      "textWrapping": "WrapWithOverflow",
                      "whiteSpace": "CollapseSpace",
                      "color": "#000000",
                      "bold": false,
                      "italic": false,
                      "opacity": 1,
                      "strokeDashArray": "",
                      "textAlign": "Center",
                      "textDecoration": "None"
                    },
                    "offset": {
                      "x": 0.5,
                      "y": 0.5
                    },
                    "margin": {
                      "top": 10,
                      "right": 2,
                      "bottom": 3,
                      "left": 2
                    },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": {
                      "link": "",
                      "content": "",
                      "textDecoration": "None"
                    },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                  }],
                  "offsetX": 136,
                  "offsetY": 282,
                  "style": {
                    "fill": "#E3EDF3",
                    "strokeColor": "#7fadc8",
                    "strokeWidth": 2,
                    "strokeDashArray": "",
                    "opacity": 1,
                    "gradient": {
                      "type": "None"
                    }
                  },
                  "constraints": 38795238,
                  "addInfo": {
                    "node": {
                      "__type": "CreateNewJobActivity:http://www.kofax.com/agility/services/sdk",
                      "Process": {
                        "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "ProcessIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "4C6F8CDABC3640DC937E1D447955A3D2",
                          "Version": 6,
                          "Name": "PreconditionsVariables"
                        },
                        "Name": null,
                        "Version": 0,
                        "Id": null,
                        "ProcessType": 0,
                        "ExpectedDuration": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": true,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "ExpectedCost": 0,
                        "Synchronous": false,
                        "Category": {
                          "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "00DE1D3FB1524285952B1DD326D7EDC4",
                          "Name": "US1138144"
                        },
                        "AssociatedCase": {
                          "__type": "CaseIdentity:http://www.kofax.com/agility/services/sdk",
                          "CaseReference": "",
                          "CaseId": ""
                        },
                        "LockedBy": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "45A6F67FBA114B9ABDA454EF92363727",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "Description": "",
                        "LatestVersion": true,
                        "OwnerId": null,
                        "SupportsSkinning": false,
                        "Author": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "Unknown",
                          "ResourceType": 0
                        },
                        "ServerId": "7C309C9BD5473A4B9912086844525E9F",
                        "LastModified": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "LastModifiedDate": {},
                        "WorkQueueDefinition": {
                          "__type": "WorkQueueDefinitionIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "",
                          "Name": ""
                        },
                        "CaptureEnabled": false,
                        "HasDocumentContainer": true
                      },
                      "Identity": {
                        "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 3,
                        "Name": "Create New Job",
                        "NodeType": 15
                      },
                      "NodeType": 15,
                      "Origins": [{
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 0,
                          "Name": "Start",
                          "NodeType": 5
                        },
                        "EmbeddedProcess": {}
                      }],
                      "Dependants": [],
                      "Destinations": [{
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 8,
                          "Name": "End",
                          "NodeType": 6
                        },
                        "EmbeddedProcess": {}
                      }],
                      "MilestoneAvailable": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "MilestoneCompleted": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "PendingMilestone": null,
                      "DesignTimeSettingsXml": "<designtimesettings><xposition>136</xposition><yposition>282</yposition><width>90</width><height>60</height><inheritcolorfromsystem>True</inheritcolorfromsystem><colour>#FF78BE83</colour><textposition>Centre</textposition><lane><name>Lane1</name><index>0</index><poolid>AC197505CA9545DCAC0FA527A66FC91A</poolid><height>732.7</height></lane><annotations /><attachments /><resourcenotes /></designtimesettings>",
                      "States": [],
                      "AvailableFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "CompletedFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "Status": 0,
                      "HelpText": "",
                      "IsAfterStartNode": true,
                      "PathId": 0,
                      "EmbeddedProcessCount": 0,
                      "EmbeddedName": "",
                      "BranchingRules": null,
                      "IsLibraryItem": false,
                      "LibraryItemName": "",
                      "ActivationProbability": 100,
                      "TitlePosition": 5,
                      "NodeDescription": "",
                      "TextPosition": 8,
                      "ShouldTrackVariableChanges": false,
                      "Color": "#FFE3EDF3",
                      "Height": 60,
                      "Width": 90,
                      "XPosition": 136,
                      "YPosition": 282,
                      "Allocate": false,
                      "MobileFriendly": false,
                      "RuntimeSettings": 0,
                      "StartNodeEventType": 0,
                      "EndNodeEventType": 0,
                      "Annotations": [],
                      "Attachments": [],
                      "SwimLane": {
                        "__type": "SwimLaneIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": "Lane1",
                        "Index": 0,
                        "PoolId": "AC197505CA9545DCAC0FA527A66FC91A",
                        "Height": 732.7
                      },
                      "CollaborationNodes": [],
                      "GroupArtifacts": [],
                      "ShouldEvaluateScoreWhenAvailable": false,
                      "ShouldEvaluateScoreWhenCompleted": false,
                      "PartialCompletion": false,
                      "DesignTimeType": 15,
                      "NodeColorGroup": 3,
                      "InheritNodeGroupColorFromSystem": true,
                      "UsePreviousUser": false,
                      "SkillLevel": 10,
                      "SecurityLevel": 10,
                      "TargetDuration": {
                        "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                        "Days": 0,
                        "Hours": 0,
                        "Minutes": 0,
                        "Seconds": 0,
                        "UseNegative": false,
                        "Negative": false,
                        "ShowSeconds": true,
                        "DynamicVariable": null,
                        "Milestone": null,
                        "DurationType": 0
                      },
                      "Priority": 1,
                      "Automatic": true,
                      "LagDuration": {
                        "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                        "Days": 0,
                        "Hours": 0,
                        "Minutes": 0,
                        "Seconds": 0,
                        "UseNegative": true,
                        "Negative": false,
                        "ShowSeconds": false,
                        "DynamicVariable": null,
                        "Milestone": null,
                        "DurationType": 0
                      },
                      "FixedCost": 0,
                      "ExpectedCost": 0,
                      "AssociatedFile": "",
                      "Description": "",
                      "RuntimeSetting": 0,
                      "NegativeDuration": false,
                      "TargetTimeVaried": null,
                      "Rag": {
                        "__type": "RagStatus:http://www.kofax.com/agility/services/sdk",
                        "SlaStatus2Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus3Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus4Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus5Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        }
                      },
                      "HasDueDateTriggers": false,
                      "UseDueDateVaried": false,
                      "PreconditionText": null,
                      "Form": null,
                      "Resources": {
                        "__type": "ActivityResources:http://www.kofax.com/agility/services/sdk",
                        "UsableResources": [],
                        "DynamicResourcesOverwriteStatic": false,
                        "RequiredResources": [],
                        "SameAsResource": null,
                        "ResourceNotes": null,
                        "AdvanceWorkflowRules": {
                          "__type": "AdvanceWorkflowRules:http://www.kofax.com/agility/services/sdk",
                          "SequentialActivityAssignment": false,
                          "ConcurrentActivityAccess": false,
                          "ExpandGroupResources": false,
                          "NoOfResourcesRequired": 0,
                          "NoOfResourcesRequiredValue": 0,
                          "NoOfResourcesRequiredVariable": {
                            "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": "",
                            "Name": ""
                          },
                          "ExitCondition": null,
                          "UseAdvanceWorkflowRules": false,
                          "UseExitCondition": false,
                          "UseExcludedResources": false,
                          "UseResourceSettings": false,
                          "NeedsValidated": false
                        }
                      },
                      "ThreadPool": {
                        "__type": "ThreadPoolIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 0,
                        "Name": "Default Thread Pool"
                      },
                      "Notification": {
                        "__type": "ActivityNotification:http://www.kofax.com/agility/services/sdk",
                        "SendEmail": false,
                        "SendTo": 0,
                        "SubjectText": null,
                        "SubjectVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "ContentText": null,
                        "ContentVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "UrlText": null,
                        "UrlVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "AppendAssociatedFile": false
                      },
                      "PreconditionInputs": [],
                      "DueDateTriggers": [],
                      "BusinessEvents": [],
                      "InputVariables": [],
                      "OutputVariables": [],
                      "CreationDate": {},
                      "UseSameAsPrevious": false,
                      "AppendAssociatedFile": false,
                      "UseSameAsPreviousType": false,
                      "Purpose": "",
                      "TaskId": 0,
                      "SettingsXml": null,
                      "ActivitySettings": null,
                      "MFPReady": 0,
                      "ResetLimit": -1,
                      "ActivityTimedOutAction": 0,
                      "SuspendReasonText": null,
                      "SuspendReasonVarId": null,
                      "CreateJobProcess": {
                        "__type": "ProcessIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": "440208A3732A4D3DA4AB4F2C86598441",
                        "Version": 0,
                        "Name": "CNJProcess"
                      },
                      "InputMappedVariables": [],
                      "OutputMappedVariables": [],
                      "SelectedVariable": {
                        "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": null,
                        "Name": null
                      },
                      "CreateJobType": 0,
                      "ReferenceType": 0
                    }
                  },
                  "ports": [{
                    "inEdges": [],
                    "outEdges": [],
                    "id": "left",
                    "offset": {
                      "x": 0,
                      "y": 0.5
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "top",
                    "offset": {
                      "x": 0.5,
                      "y": 0
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "right",
                    "offset": {
                      "x": 1,
                      "y": 0.5
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "bottom",
                    "offset": {
                      "x": 0.5,
                      "y": 1
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }],
                  "zIndex": 3,
                  "container": null,
                  "visible": true,
                  "horizontalAlignment": "Left",
                  "verticalAlignment": "Top",
                  "backgroundColor": "transparent",
                  "borderColor": "none",
                  "borderWidth": 0,
                  "rotateAngle": 0,
                  "pivot": {
                    "x": 0.5,
                    "y": 0.5
                  },
                  "margin": {},
                  "flip": "None",
                  "wrapper": {
                    "actualSize": {
                      "width": 90,
                      "height": 60
                    },
                    "offsetX": 136,
                    "offsetY": 282
                  },
                  "isExpanded": true,
                  "expandIcon": {
                    "shape": "None"
                  },
                  "tooltip": {
                    "openOn": "Auto"
                  },
                  "inEdges": [],
                  "outEdges": [],
                  "parentId": "",
                  "processId": "",
                  "umlIndex": -1,
                  "isPhase": false,
                  "isLane": false
                }, {
                  "shape": {
                    "shape": "Activity",
                    "type": "Bpmn",
                    "activity": {
                      "activity": "Task",
                      "task": {
                        "type": "Service",
                        "call": false,
                        "compensation": false,
                        "loop": "None"
                      },
                      "subProcess": {
                        "type": "None"
                      }
                    },
                    "annotations": []
                  },
                  "id": "node4",
                  "width": 90,
                  "height": 60,
                  "annotations": [{
                    "id": "node4-label",
                    "content": ".Net",
                    "style": {
                      "strokeWidth": 0,
                      "strokeColor": "transparent",
                      "fill": "transparent",
                      "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                      "fontSize": 11,
                      "textOverflow": "Wrap",
                      "textWrapping": "WrapWithOverflow",
                      "whiteSpace": "CollapseSpace",
                      "color": "#000000",
                      "bold": false,
                      "italic": false,
                      "opacity": 1,
                      "strokeDashArray": "",
                      "textAlign": "Center",
                      "textDecoration": "None"
                    },
                    "offset": {
                      "x": 0.5,
                      "y": 0.5
                    },
                    "margin": {
                      "top": 10,
                      "right": 2,
                      "bottom": 3,
                      "left": 2
                    },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": {
                      "link": "",
                      "content": "",
                      "textDecoration": "None"
                    },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                  }],
                  "offsetX": 136,
                  "offsetY": 398,
                  "style": {
                    "fill": "#E3EDF3",
                    "strokeColor": "#7fadc8",
                    "strokeWidth": 2,
                    "strokeDashArray": "",
                    "opacity": 1,
                    "gradient": {
                      "type": "None"
                    }
                  },
                  "constraints": 38795238,
                  "addInfo": {
                    "node": {
                      "__type": "DotNetActivity:http://www.kofax.com/agility/services/sdk",
                      "Process": {
                        "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "ProcessIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "4C6F8CDABC3640DC937E1D447955A3D2",
                          "Version": 6,
                          "Name": "PreconditionsVariables"
                        },
                        "Name": null,
                        "Version": 0,
                        "Id": null,
                        "ProcessType": 0,
                        "ExpectedDuration": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": true,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "ExpectedCost": 0,
                        "Synchronous": false,
                        "Category": {
                          "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "00DE1D3FB1524285952B1DD326D7EDC4",
                          "Name": "US1138144"
                        },
                        "AssociatedCase": {
                          "__type": "CaseIdentity:http://www.kofax.com/agility/services/sdk",
                          "CaseReference": "",
                          "CaseId": ""
                        },
                        "LockedBy": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "45A6F67FBA114B9ABDA454EF92363727",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "Description": "",
                        "LatestVersion": true,
                        "OwnerId": null,
                        "SupportsSkinning": false,
                        "Author": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "Unknown",
                          "ResourceType": 0
                        },
                        "ServerId": "7C309C9BD5473A4B9912086844525E9F",
                        "LastModified": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "LastModifiedDate": {},
                        "WorkQueueDefinition": {
                          "__type": "WorkQueueDefinitionIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "",
                          "Name": ""
                        },
                        "CaptureEnabled": false,
                        "HasDocumentContainer": true
                      },
                      "Identity": {
                        "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 4,
                        "Name": ".Net",
                        "NodeType": 10
                      },
                      "NodeType": 10,
                      "Origins": [{
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 0,
                          "Name": "Start",
                          "NodeType": 5
                        },
                        "EmbeddedProcess": {}
                      }],
                      "Dependants": [],
                      "Destinations": [{
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 8,
                          "Name": "End",
                          "NodeType": 6
                        },
                        "EmbeddedProcess": {}
                      }],
                      "MilestoneAvailable": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "MilestoneCompleted": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "PendingMilestone": null,
                      "DesignTimeSettingsXml": "<designtimesettings><xposition>136</xposition><yposition>398</yposition><width>90</width><height>60</height><inheritcolorfromsystem>True</inheritcolorfromsystem><colour>#FF78BE83</colour><textposition>Centre</textposition><lane><name>Lane1</name><index>0</index><poolid>AC197505CA9545DCAC0FA527A66FC91A</poolid><height>732.7</height></lane><annotations /><attachments /><resourcenotes /></designtimesettings>",
                      "States": [],
                      "AvailableFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "CompletedFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "Status": 0,
                      "HelpText": "",
                      "IsAfterStartNode": true,
                      "PathId": 0,
                      "EmbeddedProcessCount": 0,
                      "EmbeddedName": "",
                      "BranchingRules": null,
                      "IsLibraryItem": false,
                      "LibraryItemName": "",
                      "ActivationProbability": 100,
                      "TitlePosition": 5,
                      "NodeDescription": "",
                      "TextPosition": 8,
                      "ShouldTrackVariableChanges": false,
                      "Color": "#FFE3EDF3",
                      "Height": 60,
                      "Width": 90,
                      "XPosition": 136,
                      "YPosition": 398,
                      "Allocate": false,
                      "MobileFriendly": false,
                      "RuntimeSettings": 0,
                      "StartNodeEventType": 0,
                      "EndNodeEventType": 0,
                      "Annotations": [],
                      "Attachments": [],
                      "SwimLane": {
                        "__type": "SwimLaneIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": "Lane1",
                        "Index": 0,
                        "PoolId": "AC197505CA9545DCAC0FA527A66FC91A",
                        "Height": 732.7
                      },
                      "CollaborationNodes": [],
                      "GroupArtifacts": [],
                      "ShouldEvaluateScoreWhenAvailable": false,
                      "ShouldEvaluateScoreWhenCompleted": false,
                      "PartialCompletion": false,
                      "DesignTimeType": 10,
                      "NodeColorGroup": 5,
                      "InheritNodeGroupColorFromSystem": true,
                      "UsePreviousUser": false,
                      "SkillLevel": 10,
                      "SecurityLevel": 10,
                      "TargetDuration": {
                        "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                        "Days": 0,
                        "Hours": 0,
                        "Minutes": 0,
                        "Seconds": 0,
                        "UseNegative": false,
                        "Negative": false,
                        "ShowSeconds": true,
                        "DynamicVariable": null,
                        "Milestone": null,
                        "DurationType": 0
                      },
                      "Priority": 1,
                      "Automatic": true,
                      "LagDuration": {
                        "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                        "Days": 0,
                        "Hours": 0,
                        "Minutes": 0,
                        "Seconds": 0,
                        "UseNegative": true,
                        "Negative": false,
                        "ShowSeconds": false,
                        "DynamicVariable": null,
                        "Milestone": null,
                        "DurationType": 0
                      },
                      "FixedCost": 0,
                      "ExpectedCost": 0,
                      "AssociatedFile": "",
                      "Description": "",
                      "RuntimeSetting": 0,
                      "NegativeDuration": false,
                      "TargetTimeVaried": null,
                      "Rag": {
                        "__type": "RagStatus:http://www.kofax.com/agility/services/sdk",
                        "SlaStatus2Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus3Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus4Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "SlaStatus5Threshold": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": false,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        }
                      },
                      "HasDueDateTriggers": false,
                      "UseDueDateVaried": false,
                      "PreconditionText": null,
                      "Form": null,
                      "Resources": {
                        "__type": "ActivityResources:http://www.kofax.com/agility/services/sdk",
                        "UsableResources": [],
                        "DynamicResourcesOverwriteStatic": false,
                        "RequiredResources": [],
                        "SameAsResource": null,
                        "ResourceNotes": null,
                        "AdvanceWorkflowRules": {
                          "__type": "AdvanceWorkflowRules:http://www.kofax.com/agility/services/sdk",
                          "SequentialActivityAssignment": false,
                          "ConcurrentActivityAccess": false,
                          "ExpandGroupResources": false,
                          "NoOfResourcesRequired": 0,
                          "NoOfResourcesRequiredValue": 0,
                          "NoOfResourcesRequiredVariable": {
                            "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": "",
                            "Name": ""
                          },
                          "ExitCondition": null,
                          "UseAdvanceWorkflowRules": false,
                          "UseExitCondition": false,
                          "UseExcludedResources": false,
                          "UseResourceSettings": false,
                          "NeedsValidated": false
                        }
                      },
                      "ThreadPool": {
                        "__type": "ThreadPoolIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 0,
                        "Name": "Default Thread Pool"
                      },
                      "Notification": {
                        "__type": "ActivityNotification:http://www.kofax.com/agility/services/sdk",
                        "SendEmail": false,
                        "SendTo": 0,
                        "SubjectText": null,
                        "SubjectVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "ContentText": null,
                        "ContentVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "UrlText": null,
                        "UrlVariable": {
                          "__type": "VariableIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "AppendAssociatedFile": false
                      },
                      "PreconditionInputs": [],
                      "DueDateTriggers": [],
                      "BusinessEvents": [],
                      "InputVariables": [{
                        "__type": "Variable:http://www.kofax.com/agility/services/sdk",
                        "VariableType": 0,
                        "Value": null,
                        "Identity": {
                          "__type": "VariableIdentity2:http://www.kofax.com/agility/services/sdk",
                          "Id": "SPP_SYSTEM_SESSION_ID",
                          "Name": "",
                          "Version": 6,
                          "OwnerId": "4C6F8CDABC3640DC937E1D447955A3D2"
                        },
                        "Dynamic": false,
                        "Entity": {
                          "__type": "EntityIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "Category": null,
                        "Grouping": null,
                        "ProcessSummary": {
                          "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                          "Identity": {
                            "__type": "ProcessIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": "",
                            "Version": 0,
                            "Name": ""
                          },
                          "Name": null,
                          "Version": 0,
                          "Id": null,
                          "ProcessType": 0,
                          "ExpectedDuration": null,
                          "ExpectedCost": 0,
                          "Synchronous": false,
                          "Category": {
                            "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": null,
                            "Name": null
                          },
                          "AssociatedCase": {
                            "__type": "CaseIdentity:http://www.kofax.com/agility/services/sdk",
                            "CaseReference": "",
                            "CaseId": null
                          },
                          "LockedBy": null,
                          "Description": null,
                          "LatestVersion": false,
                          "OwnerId": null,
                          "SupportsSkinning": false,
                          "Author": {
                            "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": null,
                            "Name": null,
                            "ResourceType": 0
                          },
                          "ServerId": null,
                          "LastModified": null,
                          "LastModifiedDate": {},
                          "WorkQueueDefinition": null,
                          "CaptureEnabled": false,
                          "HasDocumentContainer": false
                        },
                        "IsDateExpression": false
                      }, {
                        "__type": "Variable:http://www.kofax.com/agility/services/sdk",
                        "VariableType": 0,
                        "Value": null,
                        "Identity": {
                          "__type": "VariableIdentity2:http://www.kofax.com/agility/services/sdk",
                          "Id": "STRING",
                          "Name": "String",
                          "Version": 6,
                          "OwnerId": "4C6F8CDABC3640DC937E1D447955A3D2"
                        },
                        "Dynamic": false,
                        "Entity": {
                          "__type": "EntityIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": null,
                          "Name": null
                        },
                        "Category": null,
                        "Grouping": null,
                        "ProcessSummary": {
                          "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                          "Identity": {
                            "__type": "ProcessIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": "",
                            "Version": 0,
                            "Name": ""
                          },
                          "Name": null,
                          "Version": 0,
                          "Id": null,
                          "ProcessType": 0,
                          "ExpectedDuration": null,
                          "ExpectedCost": 0,
                          "Synchronous": false,
                          "Category": {
                            "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": null,
                            "Name": null
                          },
                          "AssociatedCase": {
                            "__type": "CaseIdentity:http://www.kofax.com/agility/services/sdk",
                            "CaseReference": "",
                            "CaseId": null
                          },
                          "LockedBy": null,
                          "Description": null,
                          "LatestVersion": false,
                          "OwnerId": null,
                          "SupportsSkinning": false,
                          "Author": {
                            "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                            "Id": null,
                            "Name": null,
                            "ResourceType": 0
                          },
                          "ServerId": null,
                          "LastModified": null,
                          "LastModifiedDate": {},
                          "WorkQueueDefinition": null,
                          "CaptureEnabled": false,
                          "HasDocumentContainer": false
                        },
                        "IsDateExpression": false
                      }],
                      "OutputVariables": [],
                      "CreationDate": {},
                      "UseSameAsPrevious": false,
                      "AppendAssociatedFile": false,
                      "UseSameAsPreviousType": false,
                      "Purpose": "",
                      "TaskId": 0,
                      "SettingsXml": null,
                      "ActivitySettings": null,
                      "MFPReady": 0,
                      "ResetLimit": -1,
                      "ActivityTimedOutAction": 0,
                      "SuspendReasonText": null,
                      "SuspendReasonVarId": null,
                      "AssemblyId": "TotalAgility.Sdk.dll",
                      "AssemblyLoadType": 0,
                      "AssemblyName": "TotalAgility.Sdk.dll",
                      "ClassName": "TotalAgility.Sdk.CategoryService",
                      "MethodName": "GetCategory",
                      "DuplicateMethodNo": 1,
                      "NumberOfParameters": 0
                    }
                  },
                  "ports": [{
                    "inEdges": [],
                    "outEdges": [],
                    "id": "left",
                    "offset": {
                      "x": 0,
                      "y": 0.5
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "top",
                    "offset": {
                      "x": 0.5,
                      "y": 0
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "right",
                    "offset": {
                      "x": 1,
                      "y": 0.5
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "bottom",
                    "offset": {
                      "x": 0.5,
                      "y": 1
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }],
                  "zIndex": 4,
                  "container": null,
                  "visible": true,
                  "horizontalAlignment": "Left",
                  "verticalAlignment": "Top",
                  "backgroundColor": "transparent",
                  "borderColor": "none",
                  "borderWidth": 0,
                  "rotateAngle": 0,
                  "pivot": {
                    "x": 0.5,
                    "y": 0.5
                  },
                  "margin": {},
                  "flip": "None",
                  "wrapper": {
                    "actualSize": {
                      "width": 90,
                      "height": 60
                    },
                    "offsetX": 136,
                    "offsetY": 398
                  },
                  "isExpanded": true,
                  "expandIcon": {
                    "shape": "None"
                  },
                  "inEdges": [],
                  "outEdges": [],
                  "parentId": "",
                  "processId": "",
                  "umlIndex": -1,
                  "isPhase": false,
                  "isLane": false
                }, {
                  "shape": {
                    "type": "Bpmn",
                    "shape": "Event",
                    "event": {
                      "event": "End",
                      "trigger": "None"
                    },
                    "activity": {
                      "subProcess": {}
                    },
                    "annotations": []
                  },
                  "id": "node8",
                  "width": 30,
                  "height": 30,
                  "annotations": [{
                    "id": "node8-label",
                    "content": "End",
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Top",
                    "style": {
                      "strokeWidth": 0,
                      "strokeColor": "transparent",
                      "fill": "transparent",
                      "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                      "fontSize": 11,
                      "textOverflow": "Wrap",
                      "textWrapping": "WrapWithOverflow",
                      "whiteSpace": "CollapseSpace",
                      "bold": false,
                      "color": "black",
                      "italic": false,
                      "opacity": 1,
                      "strokeDashArray": "",
                      "textAlign": "Center",
                      "textDecoration": "None"
                    },
                    "offset": {
                      "x": 0.5,
                      "y": 1
                    },
                    "margin": {
                      "left": 0,
                      "top": 2,
                      "right": 0,
                      "bottom": 0
                    },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": {
                      "link": "",
                      "content": "",
                      "textDecoration": "None"
                    },
                    "visibility": true,
                    "rotateAngle": 0
                  }],
                  "offsetX": 282,
                  "offsetY": 65,
                  "style": {
                    "fill": "#FFFFFF",
                    "strokeColor": "#9b0000",
                    "strokeWidth": 4,
                    "strokeDashArray": "",
                    "opacity": 1,
                    "gradient": {
                      "type": "None"
                    }
                  },
                  "constraints": 38795238,
                  "addInfo": {
                    "node": {
                      "__type": "EndNode:http://www.kofax.com/agility/services/sdk",
                      "Process": {
                        "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "ProcessIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "4C6F8CDABC3640DC937E1D447955A3D2",
                          "Version": 6,
                          "Name": "PreconditionsVariables"
                        },
                        "Name": null,
                        "Version": 0,
                        "Id": null,
                        "ProcessType": 0,
                        "ExpectedDuration": {
                          "__type": "Duration:http://www.kofax.com/agility/services/sdk",
                          "Days": 0,
                          "Hours": 0,
                          "Minutes": 0,
                          "Seconds": 0,
                          "UseNegative": false,
                          "Negative": false,
                          "ShowSeconds": true,
                          "DynamicVariable": null,
                          "Milestone": null,
                          "DurationType": 0
                        },
                        "ExpectedCost": 0,
                        "Synchronous": false,
                        "Category": {
                          "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "00DE1D3FB1524285952B1DD326D7EDC4",
                          "Name": "US1138144"
                        },
                        "AssociatedCase": {
                          "__type": "CaseIdentity:http://www.kofax.com/agility/services/sdk",
                          "CaseReference": "",
                          "CaseId": ""
                        },
                        "LockedBy": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "45A6F67FBA114B9ABDA454EF92363727",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "Description": "",
                        "LatestVersion": true,
                        "OwnerId": null,
                        "SupportsSkinning": false,
                        "Author": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "Unknown",
                          "ResourceType": 0
                        },
                        "ServerId": "7C309C9BD5473A4B9912086844525E9F",
                        "LastModified": {
                          "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "743017C5316A441C984F0F6D49489E94",
                          "Name": "",
                          "ResourceType": 0
                        },
                        "LastModifiedDate": {},
                        "WorkQueueDefinition": {
                          "__type": "WorkQueueDefinitionIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": "",
                          "Name": ""
                        },
                        "CaptureEnabled": false,
                        "HasDocumentContainer": true
                      },
                      "Identity": {
                        "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 8,
                        "Name": "End",
                        "NodeType": 6
                      },
                      "NodeType": 6,
                      "Origins": [{
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 1,
                          "Name": "Scan",
                          "NodeType": 27
                        },
                        "EmbeddedProcess": {}
                      }, {
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 2,
                          "Name": "Ordinary",
                          "NodeType": 1
                        },
                        "EmbeddedProcess": {}
                      }, {
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 3,
                          "Name": "Create New Job",
                          "NodeType": 15
                        },
                        "EmbeddedProcess": {}
                      }, {
                        "Identity": {
                          "__type": "NodeIdentity:http://www.kofax.com/agility/services/sdk",
                          "Id": 4,
                          "Name": ".Net",
                          "NodeType": 10
                        },
                        "EmbeddedProcess": {}
                      }],
                      "Dependants": [],
                      "Destinations": [],
                      "MilestoneAvailable": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "MilestoneCompleted": {
                        "__type": "MilestoneSummary:http://www.kofax.com/agility/services/sdk",
                        "Identity": {
                          "__type": "MilestoneIdentity:http://www.kofax.com/agility/services/sdk",
                          "Name": ""
                        },
                        "Scope": 0,
                        "DisplayName": ""
                      },
                      "PendingMilestone": null,
                      "DesignTimeSettingsXml": "<designtimesettings><xposition>282</xposition><yposition>65</yposition><width>30</width><height>30</height><inheritcolorfromsystem>False</inheritcolorfromsystem><colour>#FF9B0000</colour><eventtype>Default</eventtype><name>End</name><textposition>CentreRight</textposition><lane><name>Lane1</name><index>0</index><poolid>AC197505CA9545DCAC0FA527A66FC91A</poolid><height>732.7</height></lane><annotations /><attachments /></designtimesettings>",
                      "States": [],
                      "AvailableFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "CompletedFireEvent": {
                        "__type": "EventIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": null,
                        "Scope": 0,
                        "DisplayName": null
                      },
                      "Status": 0,
                      "HelpText": null,
                      "IsAfterStartNode": false,
                      "PathId": 0,
                      "EmbeddedProcessCount": 0,
                      "EmbeddedName": "",
                      "BranchingRules": null,
                      "IsLibraryItem": false,
                      "LibraryItemName": "",
                      "ActivationProbability": 100,
                      "TitlePosition": 5,
                      "NodeDescription": "",
                      "TextPosition": 9,
                      "ShouldTrackVariableChanges": false,
                      "Color": "#FF9B0000",
                      "Height": 30,
                      "Width": 30,
                      "XPosition": 282,
                      "YPosition": 65,
                      "Allocate": false,
                      "MobileFriendly": false,
                      "RuntimeSettings": 0,
                      "StartNodeEventType": 0,
                      "EndNodeEventType": 0,
                      "Annotations": [],
                      "Attachments": [],
                      "SwimLane": {
                        "__type": "SwimLaneIdentity:http://www.kofax.com/agility/services/sdk",
                        "Name": "Lane1",
                        "Index": 0,
                        "PoolId": "AC197505CA9545DCAC0FA527A66FC91A",
                        "Height": 732.7
                      },
                      "CollaborationNodes": [],
                      "GroupArtifacts": [],
                      "ShouldEvaluateScoreWhenAvailable": false,
                      "ShouldEvaluateScoreWhenCompleted": false,
                      "PartialCompletion": false,
                      "DesignTimeType": 0,
                      "NodeColorGroup": 0,
                      "InheritNodeGroupColorFromSystem": false,
                      "ThreadPool": {
                        "__type": "ThreadPoolIdentity:http://www.kofax.com/agility/services/sdk",
                        "Id": 0,
                        "Name": "Default Thread Pool"
                      }
                    }
                  },
                  "ports": [{
                    "inEdges": [],
                    "outEdges": [],
                    "id": "left",
                    "offset": {
                      "x": 0,
                      "y": 0.5
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }, {
                    "inEdges": [],
                    "outEdges": [],
                    "id": "top",
                    "offset": {
                      "x": 0.5,
                      "y": 0
                    },
                    "visibility": 2,
                    "height": 12,
                    "width": 12,
                    "shape": "Square",
                    "margin": {
                      "right": 0,
                      "bottom": 0,
                      "left": 0,
                      "top": 0
                    },
                    "style": {
                      "fill": "white",
                      "strokeColor": "black",
                      "opacity": 1,
                      "strokeDashArray": "",
                      "strokeWidth": 1
                    },
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "constraints": 24
                  }],
                  "zIndex": 5,
                  "container": null,
                  "visible": true,
                  "horizontalAlignment": "Left",
                  "verticalAlignment": "Top",
                  "backgroundColor": "transparent",
                  "borderColor": "none",
                  "borderWidth": 0,
                  "rotateAngle": 0,
                  "pivot": {
                    "x": 0.5,
                    "y": 0.5
                  },
                  "margin": {},
                  "flip": "None",
                  "wrapper": {
                    "actualSize": {
                      "width": 30,
                      "height": 30
                    },
                    "offsetX": 282,
                    "offsetY": 65
                  },
                  "isExpanded": true,
                  "expandIcon": {
                    "shape": "None"
                  },
                  "inEdges": [],
                  "outEdges": [],
                  "parentId": "",
                  "processId": "",
                  "umlIndex": -1,
                  "isPhase": false,
                  "isLane": false
                }],
                "scrollSettings": {
                  "canAutoScroll": true,
                  "scrollLimit": "Infinity",
                  "padding": {
                    "left": 10,
                    "right": 30,
                    "top": 10,
                    "bottom": 30
                  },
                  "viewPortWidth": 1404,
                  "viewPortHeight": 829,
                  "currentZoom": 1,
                  "horizontalOffset": 0,
                  "verticalOffset": 0
                },
                "selectedItems": {
                  "nodes": [],
                  "connectors": [],
                  "wrapper": null,
                  "constraints": 4096,
                  "userHandles": [{
                    "name": "connector",
                    "backgroundColor": "transparent",
                    "pathColor": "#5a5a64",
                    "side": "Top",
                    "offset": 1,
                    "visible": true,
                    "size": 33,
                    "pathData": "M4,11v2h8v7l8-8L12,4v7Z",
                    "margin": {
                      "top": 17
                    }
                  }, {
                    "name": "delete",
                    "backgroundColor": "transparent",
                    "pathColor": "#5a5a64",
                    "side": "Top",
                    "offset": 1,
                    "visible": true,
                    "size": 25,
                    "pathData": "M828.2096467757849,-5.547905384373092c-3.201999999999998,-2.8130000000000006,-8.105999999999995,-2.455,-11.119,0.5579999999999998l-34.179,34.205l-34.337,-34.362c-3.093,-3.0920000000000005,-8.108,-3.0920000000000005,-11.201,0l-0.11299999999999956,0.11299999999999956c-3.093,3.093,-3.093,8.107,0,11.201l34.341,34.366l-34.34,34.366c-3.093,3.0930000000000035,-3.093,8.108000000000004,0,11.201000000000008l0.11299999999999956,0.11299999999999956c3.093,3.0930000000000035,8.107,3.0930000000000035,11.201,0l34.337,-34.363l34.17900000000001,34.205c3.0130000000000052,3.0130000000000052,7.917000000000002,3.3700000000000045,11.119,0.5580000000000069c3.507000000000005,-3.081000000000003,3.6370000000000005,-8.429000000000002,0.38800000000000534,-11.677999999999997l-34.37899999999999,-34.403l34.37700000000001,-34.404c3.25,-3.2489999999999988,3.1200000000000045,-8.596,-0.38800000000000534,-11.677Z",
                    "margin": {
                      "top": 10,
                      "right": 10
                    }
                  }, {
                    "name": "node",
                    "backgroundColor": "transparent",
                    "pathColor": "#e9f8ff",
                    "side": "Right",
                    "offset": 0,
                    "visible": true,
                    "size": 33,
                    "pathData": "M17.75,13.89H2.5a2,2,0,0,1-2-2V2.5a2,2,0,0,1,2-2H17.75a2,2,0,0,1,2,2v9.39A2,2,0,0,1,17.75,13.89Z",
                    "margin": {
                      "right": 15
                    }
                  }, {
                    "name": "decision",
                    "backgroundColor": "transparent",
                    "pathColor": "#fff6df",
                    "side": "Right",
                    "offset": 0.5,
                    "visible": true,
                    "size": 33,
                    "pathData": "M19.94,11.93l-8,8a2,2,0,0,1-2.83,0l-8-8a2,2,0,0,1,0-2.83l8-8a2,2,0,0,1,2.83,0l8,8A2,2,0,0,1,19.94,11.93Z",
                    "margin": {
                      "right": 15
                    }
                  }, {
                    "name": "end",
                    "backgroundColor": "transparent",
                    "pathColor": "#ffedef",
                    "side": "Right",
                    "offset": 1,
                    "visible": true,
                    "size": 33,
                    "pathData": "M16.92,8.71A8.21,8.21,0,1,1,8.71.5,8.21,8.21,0,0,1,16.92,8.71Z",
                    "margin": {
                      "right": 15
                    }
                  }, {
                    "name": "annotation",
                    "backgroundColor": "transparent",
                    "pathColor": "#5a5a64",
                    "side": "Bottom",
                    "offset": 1,
                    "visible": true,
                    "size": 33,
                    "pathData": "M8,11h8v2H8Zm8-4H8V9h8Zm0,8H8v2h8ZM18,2H10V4h8V20H10v2h8a2,2,0,0,0,2-2V4A2,2,0,0,0,18,2ZM6,4H8V2H6A2,2,0,0,0,4,4v6L2,12l2,2v6a2,2,0,0,0,2,2H8V20H6Z",
                    "margin": {
                      "right": 10,
                      "bottom": 9,
                      "left": 5
                    }
                  }, {
                    "name": "attachment",
                    "backgroundColor": "transparent",
                    "pathColor": "#5a5a64",
                    "side": "Bottom",
                    "offset": 0.5,
                    "visible": true,
                    "size": 33,
                    "pathData": "M11,9h5.5L11,3.5V9M4,2h8l6,6V20a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2M9,4H4V20H16V11H9Z",
                    "margin": {
                      "bottom": 9
                    }
                  }],
                  "rotateAngle": 0
                },
                "snapSettings": {
                  "constraints": 0,
                  "horizontalGridlines": {
                    "lineIntervals": [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75],
                    "snapIntervals": [10]
                  },
                  "verticalGridlines": {
                    "lineIntervals": [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75],
                    "snapIntervals": [10]
                  },
                  "gridType": "Lines"
                },
                "width": "100%",
                "enablePersistence": false,
                "rulerSettings": {
                  "showRulers": false
                },
                "backgroundColor": "transparent",
                "layout": {
                  "type": "None",
                  "enableAnimation": true
                },
                "contextMenuSettings": {},
                "dataSourceSettings": {
                  "dataManager": null,
                  "dataSource": null,
                  "crudAction": {
                    "read": ""
                  },
                  "connectionDataSource": {
                    "crudAction": {
                      "read": ""
                    }
                  }
                },
                "mode": "SVG",
                "layers": [{
                  "id": "default_layer",
                  "visible": true,
                  "lock": false,
                  "objects": ["node0", "node1", "node2", "node0-node1", "node0-node2"],
                  "zIndex": 0
                }],
                "pageSettings": {
                  "orientation": "Landscape",
                  "height": null,
                  "width": null,
                  "background": {
                    "source": "",
                    "color": "transparent"
                  },
                  "showPageBreaks": false,
                  "fitOptions": {
                    "canFit": false
                  },
                  "boundaryConstraints": "Infinity"
                },
                "basicElements": [],
                "tooltip": {
                  "content": "",
                  "relativeMode": "Mouse"
                },
                "diagramSettings": {
                  "inversedAlignment": true
                },
                "bridgeDirection": "Top",
                "tool": 3,
                "customCursor": [],
                "version": 17.1
              }`);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Connector segments not update properly', (done: Function) => {
            expect(((diagram.connectors[0].segments[2]) as OrthogonalSegment).length === 214 && ((diagram.connectors[1].segments[2]) as OrthogonalSegment).length === 98).toBe(true);
            done();
        });

    });

});
