import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { ConnectorConstraints, DiagramConstraints } from '../../../src/diagram/enum/enum';
import { ConnectorBridging } from '../../../src/diagram/objects/connector-bridging';
import { Connector } from '../../../src/diagram/index';
Diagram.Inject(ConnectorBridging);
/**
 * Bridging spec
 */
describe('Diagram Control', () => {
    // inherit - with & without
    // bridge direction
    // bridge direction - straight/Orthogonal/combination
    // property change
    describe('Connector with bridging', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
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
            diagram.bridgingModule.getLineSegment(undefined, undefined, undefined, undefined);
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
        });

        it('Checking Bridging corner radius Orthogonal', (done: Function) => {
            let element: DiagramElement = diagram.connectors[0].wrapper.children[0];
            expect((element as PathElement).data == 'M300 300 L300 310Q300 320 310 320 L390 320Q400 320 400 330 L400 399.5').toBe(true);
            let element1: DiagramElement = diagram.connectors[1].wrapper.children[0];
            expect((element1 as PathElement).data == 'M350 350 L350 360Q350 370 360 370 L395 370A 5 5 -168.6900675259798 , 1 1 405,370 L440 370Q450 370 450 380 L450 449.5').toBe(true);
            done();
        });
    });
});