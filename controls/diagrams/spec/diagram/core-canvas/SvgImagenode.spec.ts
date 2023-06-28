import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, PathModel, TextModel, ImageModel } from '../../../src/diagram/objects/node-model';
import { TextAlign, Scale, ImageAlignment } from '../../../src/diagram/enum/enum';
import { TextStyleModel } from '../../../src/diagram/core/appearance-model';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';


/**
 * Node spec
 */
describe('Diagram Control', () => {

    describe('Diagram Element', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram97' });
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node] });
            diagram.appendTo('#diagram97');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram default node', (done: Function) => {
            expect(diagram.nodes[0].id === 'node1').toBe(true);
            done();
        });
    });

    describe('Path element ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram98' });
            document.body.appendChild(ele);

            let shape: PathModel = { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' }
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: shape
            };

            diagram = new Diagram({ mode: 'Canvas', width: 500, height: 500, nodes: [node] });
            diagram.appendTo('#diagram98');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram path node', (done: Function) => {
            expect(diagram.nodes[0].offsetX === 300 && diagram.nodes[0].offsetY === 300).toBe(true);
            done();
        });
    });
    describe('Image element with set aspectratio value', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram99' });
            document.body.appendChild(ele);

            let shape: ImageModel = {
                type: 'Image',
                source: 'https://www.w3schools.com/images/w3schools_green.jpg'
            };
            let node: NodeModel = {
                id: 'image', width: 100, height: 100, offsetX: 400, offsetY: 400,
                shape: shape
            };

            diagram = new Diagram({ mode: 'Canvas', width: 500, height: 500, nodes: [node] });
            diagram.appendTo('#diagram99');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram default image node', (done: Function) => {
            expect(((diagram.nodes[0] as NodeModel).shape as ImageModel).source === 'https://www.w3schools.com/images/w3schools_green.jpg').toBe(true);
            done();
        });
        it('832073 - checking with image node opacity with 0', (done: Function) => {
            debugger
            expect(diagram.nodes[0].style.opacity == 1).toBe(true);
            let diagramElement = document.getElementById('diagram99');
            var instance = 'ej2_instances';
            if (diagramElement) {
                diagram = diagramElement["" + instance][0];
            }
            diagram.nodes[0].style.opacity = 0;
            diagram.dataBind();
            expect(diagram.nodes[0].style.opacity == 0).toBe(true);
        })
    });




    describe('Text element', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram100' });
            document.body.appendChild(ele);

            let shape: ImageModel = {
                type: 'Image',
                source: 'https://www.w3schools.com/images/w3schools_green.jpg',
                scale: 'Meet', align: 'XMaxYMax',
            };
            let node: NodeModel = {
                id: 'image', width: 100, height: 100, offsetX: 400, offsetY: 400,
                shape: shape
            };

            diagram = new Diagram({ mode: 'Canvas', width: 500, height: 500, nodes: [node] });

            diagram = new Diagram({ mode: 'Canvas', width: 500, height: 500, nodes: [node] });
            diagram.appendTo('#diagram100');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram default image node with custom properties in SVG rendering Mode', (done: Function) => {
            expect(((diagram.nodes[0] as NodeModel).shape as ImageModel).source === 'https://www.w3schools.com/images/w3schools_green.jpg' &&
                ((diagram.nodes[0] as NodeModel).shape as ImageModel).scale === 'Meet').toBe(true);
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