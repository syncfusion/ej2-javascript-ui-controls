import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BasicShapeModel, PathModel } from '../../../src/diagram/objects/node-model';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
import { ConnectorModel } from '../../../src';
/**
 * Node spec
 */
describe('Diagram Control', () => {
    describe('Add diagram nodes or connectors collection dynamically through API method',()=>{
        let diagram: Diagram;
        let ele: HTMLElement;
    
        beforeAll(():void=>{
            ele = createElement('div', { id: 'addDiagramElements' }); 
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: "1200px", height: "500px",
                 });
             diagram.appendTo('#addDiagramElements');
             let nodes: NodeModel[]=[
                {
                    id: 'node1',  offsetX: 100, offsetY: 100,
                   
                },
                {
                    id: 'node2',  offsetX: 300, offsetY: 100,
                    
                },
                {
                    id: 'node3', offsetX: 600, offsetY: 100,
                },
                {
                    id: 'node4',  offsetX: 300, offsetY: 300,
                },
                {
                    id: 'node44', offsetX: 600, offsetY: 300,
                },
             ];
            let connectors: ConnectorModel[] = [
                 {
                    id: 'connector0',  sourceID: 'node1', targetID: 'node2',
               
                },
                {
                    id: 'connector1', sourceID: 'node2', targetID: 'node3',
                   
                },
                {
                    id: 'connector2',  sourceID: 'node3', targetID: 'node4',
                  
                },
                {
                    id: 'connector3', sourceID: 'node4', targetID: 'node44',
                },
             ];
            diagram.addElements(nodes);
            diagram.addElements(connectors);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });
        it('Pass a node or connector collection as a parameter in the method and verify nodes are added properly in the diagram',(done:Function)=>{
            expect(diagram.nodes.length).toBe(5);
            expect(diagram.connectors.length).toBe(4);
            done();
        });
        
    });

    describe('Basic Shapes Without Size', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramroundedrect' });
            document.body.appendChild(ele);
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle', cornerRadius: 10 };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, width: 50, height: 50, shape: shape };
            let shape1: BasicShapeModel = {
                type: 'Basic', shape: 'Polygon',
                points: [{ x: 200, y: 100 }, { x: 150, y: 150 }, { x: 50, y: 150 }]
            };
            let node2: NodeModel = { id: 'node1', offsetX: 300, offsetY: 100, shape: shape1 };
            diagram = new Diagram({
                width: '1500px', height: '1000px', nodes: [node1, node2],
            });
            diagram.appendTo('#diagramroundedrect');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });
        it('Checking rectangle corner radius', (done: Function) => {
            let element = document.getElementById('node_content');
            expect(element.attributes[7].value === '10' && element.attributes[8].value === '10').toBe(true)
            done();

        });
        it('Checking polygon', (done: Function) => {
            let node: NodeModel = diagram.nodes[1];
            let element: DiagramElement = node.wrapper.children[0];
            expect((element as PathModel).data == 'M200 100L150 150L50 150Z').toBe(true);
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