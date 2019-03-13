import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
/**
 * Connector Annotations
 */
describe('Diagram Control', () => {

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

            expect(Math.round(element1.offsetX) === 113 && Math.round(element1.offsetY) === 100 &&
                    Math.round(element2.offsetX) === 313 && Math.round(element2.offsetY) === 93 &&
                    Math.round(element3.offsetX) === 513 && Math.round(element3.offsetY) === 107).toBe(true);
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
            expect(Math.round(element1.offsetX) === 187 && Math.round(element1.offsetY) === 100 &&
            Math.round(element2.offsetX) === 387 && Math.round(element2.offsetY) === 93 &&
            Math.round(element3.offsetX) === 587 && Math.round(element3.offsetY) === 107).toBe(true);
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
                    Math.round(element2.offsetX) === 287 && Math.round(element2.offsetY) === 107 &&
                    Math.round(element3.offsetX) === 513 && Math.round(element3.offsetY) === 107).toBe(true);
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
                Math.round(element2.offsetX) === 337 && Math.round(element2.offsetY) === 150 &&
                Math.round(element3.offsetX) === 563 && Math.round(element3.offsetY) === 150).toBe(true);
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
                    Math.round(element2.offsetX) === 387 && Math.round(element2.offsetY) === 193 &&
                    (Math.round(element3.offsetX) === 613 || Math.round(element3.offsetX) === 613) && Math.round(element3.offsetY) === 193).toBe(true);
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
                    Math.round(element2.offsetX) === 287 && Math.round(element2.offsetY) === 107 &&
                    Math.round(element3.offsetX) === 513 && Math.round(element3.offsetY) === 107).toBe(true);
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
                    Math.round(element2.offsetX) === 387 && Math.round(element2.offsetY) === 193 &&
                    Math.round(element3.offsetX) === 613 && Math.round(element3.offsetY) === 193).toBe(true);
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

            expect(Math.round(element1.offsetX) === 187 && Math.round(element1.offsetY) === 100 &&
                    Math.round(element2.offsetX) === 387 && Math.round(element2.offsetY) === 107 &&
                    Math.round(element3.offsetX) === 587 && Math.round(element3.offsetY) === 93).toBe(true);
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

            expect(Math.round(element1.offsetX) === 113||112.671875 && Math.round(element1.offsetY) === 100 &&
                    Math.round(element2.offsetX) === 313||312.671875 && Math.round(element2.offsetY) === 106||107.2 &&
                    Math.round(element3.offsetX) === 513||512.671875 && Math.round(element3.offsetY) === 93||92.8).toBe(true);
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
                    Math.round(element2.offsetX) === 413 && Math.round(element2.offsetY) === 193 &&
                    Math.round(element3.offsetX) === 587 && Math.round(element3.offsetY) === 193).toBe(true);
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
                Math.round(element2.offsetX) === 363 && Math.round(element2.offsetY) === 150 &&
                Math.round(element3.offsetX) === 537 && Math.round(element3.offsetY) === 150).toBe(true);
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
                    Math.round(element2.offsetX) === 313 && Math.round(element2.offsetY) === 107 &&
                    Math.round(element3.offsetX) === 487 && Math.round(element3.offsetY) === 107).toBe(true);
            done();
        });

        it('checking the displacement of the connector', (done: Function) => {
            diagram.connectors[0].type = 'Orthogonal';
            diagram.dataBind();
            diagram.connectors[0].annotations[0].displacement.x = 15;
            diagram.connectors[0].annotations[0].displacement.y = 15;
            diagram.dataBind();
            expect(diagram.connectors[0].wrapper.children[3].offsetX === 100 &&
                diagram.connectors[0].wrapper.children[3].offsetY === 107.7).toBe(true);
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