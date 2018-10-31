import { createElement } from '@syncfusion/ej2-base';
import { Diagram, } from '../../../src/diagram/diagram';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { SelectorConstraints } from '../../../src/diagram/enum/enum';
import { getAdornerLayer } from '../../../src/diagram/utility/dom-util';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';

/**
 * Node spec
 */
describe('Diagram Control', () => {

    describe('selector constraints ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100,width: 50, height: 50, shape: shape };
            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 },
            }];
            diagram = new Diagram({
                width: 600, height: 500, nodes: [node1], connectors: connectors, selectedItems: { constraints: SelectorConstraints.None }
            });
            diagram.appendTo('#diagram');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('visibility of the selector element ', (done: Function) => {
            diagram.select(selArray);
            let elements = getAdornerLayer('diagram');
            let element = elements.childNodes[0].childNodes;
            for (let i: number = 0; i <= 12; i++) {
                var constrain = SelectorConstraints.All & ~Math.pow(2, i);
                diagram.selectedItems.constraints = constrain;
                diagram.select(selArray);
                diagram.dataBind();
                switch (constrain) {
                    case SelectorConstraints.All:
                        for (let j = 0; j < element.length; j++) {
                            if (element[j].nodeName === 'circle' || element[j].nodeName === 'path') {
                                let visibility = (element[j] as SVGElement).getAttribute('visibility');
                                expect(visibility === 'visible').toBe(true);
                                done();
                            }
                        } break;
                    case SelectorConstraints.ResizeAll:
                        for (let j = 0; j < element.length; j++) {
                            if (element[j].nodeName === 'circle') {
                                let visibility = (element[j] as SVGElement).getAttribute('visibility');
                                expect(visibility === 'visible').toBe(true);
                                done();
                            }
                        }
                        break;
                }
                expect(diagram.selectedItems.constraints === constrain).toBe(true);
                done();
            }
        });
    });
});    