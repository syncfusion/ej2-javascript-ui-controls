import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';

/**
 * Selector spec
 */
describe('Diagram Control', () => {

    describe('Scroller', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagramik' });
            ele.style.width = '100%';
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 400, offsetY: 400 };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 600, offsetY: 400 };
            diagram = new Diagram({ width: '100%', height: '600px', nodes: [node, node2] });
            diagram.appendTo('#diagramik');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Moving nodes out of view - negative', (done: Function) => {
            diagram.nodes[0].offsetX = -500;
            diagram.nodes[0].offsetY = -500;
            diagram.dataBind();
            document.getElementById("diagramik").scrollLeft = 0;
            document.getElementById("diagramik").scrollTop = 0;
            diagram.updateScrollOffset();
            done();
        });

        it('Moving nodes into view - negative', (done: Function) => {
            diagram.nodes[0].offsetX = 400;
            diagram.nodes[0].offsetY = 400;
            diagram.dataBind();
            document.getElementById("diagramik").scrollLeft = 550;
            document.getElementById("diagramik").scrollTop = 550;
            diagram.updateScrollOffset();
            done();
        });

        it('Moving nodes out of view - positive', (done: Function) => {
            diagram.nodes[1].offsetX = 1500;
            diagram.nodes[1].offsetY = 1000;
            diagram.dataBind();
            document.getElementById("diagramik").scrollLeft = 874;
            document.getElementById("diagramik").scrollTop = 470;
            diagram.updateScrollOffset();
            done();
        });

        it('Moving nodes into view - positive', (done: Function) => {
            diagram.nodes[1].offsetX = 600;
            diagram.nodes[1].offsetY = 400;
            diagram.dataBind();
            document.getElementById("diagramik").scrollLeft = 0;
            document.getElementById("diagramik").scrollTop = 0;
            diagram.updateScrollOffset();
            done();
        });


        it('Moving nodes out of view - invalid - negative', (done: Function) => {
            diagram.nodes[0].offsetX = 200;
            diagram.nodes[0].offsetY = 200;
            diagram.dataBind();
            document.getElementById("diagramik").scrollLeft = 80;
            document.getElementById("diagramik").scrollTop = 80;
            diagram.updateScrollOffset();
            done();
        });

        it('Moving nodes out of view - invalid', (done: Function) => {
            diagram.nodes[1].offsetX = 1400;
            diagram.nodes[1].offsetY = 800;
            document.getElementById("diagramik").scrollLeft = 1500;
            document.getElementById("diagramik").scrollTop = 800;
            diagram.updateScrollOffset();
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

    describe('Diagram padding left and top', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram_padding_tl' });
            ele.style.width = '100%';
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 50, offsetY: 50 };
            diagram = new Diagram({
                width: '400px',
                height: '400px',
                nodes: [node],
                scrollSettings: { padding: { left: 50, top: 50 }}
            });
            diagram.appendTo('#diagram_padding_tl');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('checking Diagram padding left and top', (done: Function) => {
            let diagramContent: HTMLElement = document.getElementById(diagram.element.id + 'content');
            expect(diagramContent.scrollLeft).toBe(50);
            expect(diagramContent.scrollTop).toBe(50);
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
        });
    });

    describe('Diagram padding Right and Bottom', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram_padding_rb' });
            ele.style.width = '100%';
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 350, offsetY: 350 };
            diagram = new Diagram({
                width: '400px',
                height: '400px',
                nodes: [node],
                scrollSettings: { padding: { right: 50, bottom: 50 }}
            });
            diagram.appendTo('#diagram_padding_rb');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('checking Diagram padding Right and Bottom', (done: Function) => {
            let diagramContent: HTMLElement = document.getElementById(diagram.element.id + 'content');
            expect(diagramContent.scrollHeight).toBe(450);
            expect(diagramContent.scrollWidth).toBe(450);
            done();
        });
    });
});