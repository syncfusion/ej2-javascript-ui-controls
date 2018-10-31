/**
 * PathElement Test Cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Path } from '../../../src/diagram/objects/node';
import { NodeModel, PathModel, } from '../../../src/diagram/objects/node-model';
import { PointPortModel } from '../../../src/diagram/objects/port-model';

describe('Diagram Control', () => {

    describe('Port property change', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'nodeannot', width: 100, height: 100, offsetX: 140, offsetY: 80,
                shape: {
                    type: 'Path',
                    data: 'M127.2842,291.4492L95.0322,291.4492L81.1582,256.3152L141.1582,256.3152L127.2842,291.4492z'
                } as PathModel,
                ports: [{ shape: 'Square', id: 'port', offset: { x: 0, y: 0 } } as PointPortModel],
            };
            let node1: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: {
                    type: 'Path',
                    data: 'M127.2842,291.4492L95.0322,291.4492L81.1582,256.3152L141.1582,256.3152L127.2842,291.4492z'
                } as PathModel,
                ports: [{ shape: 'Square', id: 'port1', offset: { x: 0, y: 0 } } as PointPortModel],
            };
            let node2: NodeModel = {
                id: 'node1annot', width: 100, height: 100, offsetX: 340, offsetY: 80,
                shape: {
                    type: 'Path',
                    data: 'M127.2842,291.4492L95.0322,291.4492L81.1582,256.3152L141.1582,256.3152L127.2842,291.4492z'
                } as PathModel,
                ports: [{ shape: 'Square', id: 'port4', width: 15, offset: { x: 0, y: 0 } } as PointPortModel]
            };
            let node3: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: {
                    type: 'Path',
                    data: 'M127.2842,291.4492L95.0322,291.4492L81.1582,256.3152L141.1582,256.3152L127.2842,291.4492z'
                } as PathModel,
                ports: [{ shape: 'Square', id: 'port4', width: 15, offset: { x: 0, y: 0 } } as PointPortModel]
            };
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [node, node1, node2, node3,]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking port width change', (done: Function) => {
            (diagram.nodes[0] as NodeModel).ports[0].width = 20;
            diagram.dataBind();
            let port: PointPortModel = (diagram.nodes[0] as NodeModel).ports[0];
            expect(port.width == 20).toBe(true);
            done();
        });
        it('Checking port height change', (done: Function) => {
            (diagram.nodes[1] as NodeModel).ports[0].height = 2;
            diagram.dataBind();
            let port: PointPortModel = (diagram.nodes[1] as NodeModel).ports[0];
            expect(port.height == 2).toBe(true);
            done();
        });
        it('Checking port margin change', (done: Function) => {
            (diagram.nodes[2] as NodeModel).ports[0].margin.top = 5;
            (diagram.nodes[2] as NodeModel).ports[0].margin.left = 45;
            (diagram.nodes[1] as NodeModel).ports[0].margin.bottom = 10;
            (diagram.nodes[1] as NodeModel).ports[0].margin.right = 10;
            diagram.dataBind();
            let port: PointPortModel = (diagram.nodes[2] as NodeModel).ports[0];
            expect(port.margin.top === 5 && port.margin.left === 45).toBe(true);
            done();
        });
        it('Checking port alignment change', (done: Function) => {
            (diagram.nodes[0] as NodeModel).ports[0].horizontalAlignment = 'Right';
            (diagram.nodes[0] as NodeModel).ports[0].verticalAlignment = 'Bottom';
            (diagram.nodes[3] as NodeModel).ports[0].horizontalAlignment = 'Right';
            (diagram.nodes[3] as NodeModel).ports[0].verticalAlignment = 'Bottom';
            diagram.dataBind();
            let port: PointPortModel = (diagram.nodes[3] as NodeModel).ports[0];
            expect((port.horizontalAlignment === 'Right') && (port.verticalAlignment === 'Bottom')).toBe(true);
            done();
        });
        it('Checking port offset change', (done: Function) => {
            (diagram.nodes[0] as NodeModel).ports[0].offset.x = 1;
            (diagram.nodes[0] as NodeModel).ports[0].offset.y = 1;
            diagram.dataBind();
            let port: PointPortModel = (diagram.nodes[0] as NodeModel).ports[0];
            expect((port.offset.x === 1) && (port.offset.y === 1)).toBe(true);
            done();
        });
        it('Checking port shape change', (done: Function) => {
            (diagram.nodes[2] as NodeModel).ports[0].shape = 'X';
            diagram.dataBind();
            let port: PointPortModel = (diagram.nodes[2] as NodeModel).ports[0];
            expect(port.shape == 'X').toBe(true);
            done();
        });
        it('Checking port style change', (done: Function) => {
            (diagram.nodes[3] as NodeModel).ports[0].style.fill = 'red';
            (diagram.nodes[3] as NodeModel).ports[0].style.strokeColor = 'orange';
            (diagram.nodes[3] as NodeModel).ports[0].style.strokeWidth = 2;
            (diagram.nodes[3] as NodeModel).ports[0].style.opacity = 2;
            (diagram.nodes[3] as NodeModel).ports[0].style.strokeDashArray = '5,5';
            diagram.dataBind();
            let port: PointPortModel = (diagram.nodes[3] as NodeModel).ports[0];
            expect((port.style.fill === 'red') && (port.style.strokeColor === 'orange') && (port.style.strokeWidth === 2)).toBe(true);
            done();
        });
    });
});
