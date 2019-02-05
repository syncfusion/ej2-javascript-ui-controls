import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Point } from '../../../src/diagram/primitives/point';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { Rect, ConnectorModel, PointModel } from '../../../src/diagram/index';

/**
 * Spatial Search - Page Bounds
 */
describe('Diagram Control', () => {

    describe('Spatial Search ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                nodes: [
                    { id: 'center', width: 100, height: 100, offsetX: 0, offsetY: 0 },
                    { id: 'mid-1', width: 100, height: 100, offsetX: -100, offsetY: -100 },
                    { id: 'mid-2', width: 100, height: 100, offsetX: 100, offsetY: -100 },
                    { id: 'mid-3', width: 100, height: 100, offsetX: -100, offsetY: 100 },
                    { id: 'mid-4', width: 100, height: 100, offsetX: 100, offsetY: 100 },
                    { id: 'outer-1', width: 100, height: 100, offsetX: -1000, offsetY: -1000 },
                    { id: 'outer-2', width: 100, height: 100, offsetX: 1000, offsetY: -1000 },
                    { id: 'outer-3', width: 100, height: 100, offsetX: -1000, offsetY: 1000 },
                    { id: 'outer-4', width: 100, height: 100, offsetX: 1000, offsetY: 1000 },
                ],
                width: '1000px',
                height: '600px'
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking the page bounds', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left == -1050 && bounds.right == 1050 && bounds.top == -1050 && bounds.bottom == 1050).toBe(true);
            done();
        });

        it('Removing nodes at intermediate layer', (done: Function) => {
            diagram.remove(diagram.nodes[1]);
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left == -1050 && bounds.right == 1050 && bounds.top == -1050 && bounds.bottom == 1050).toBe(true);

            diagram.remove(diagram.nodes[1]);
            bounds = diagram.spatialSearch.getPageBounds();
            expect(bounds.left == -1050 && bounds.right == 1050 && bounds.top == -1050 && bounds.bottom == 1050).toBe(true);

            diagram.remove(diagram.nodes[1]);
            bounds = diagram.spatialSearch.getPageBounds();

            expect(bounds.left == -1050 && bounds.right == 1050 && bounds.top == -1050 && bounds.bottom == 1050).toBe(true);

            diagram.remove(diagram.nodes[1]);
            bounds = diagram.spatialSearch.getPageBounds();

            expect(bounds.left == -1050 && bounds.right == 1050 && bounds.top == -1050 && bounds.bottom == 1050).toBe(true);
            done();
        });

        it('Removing nodes at outer layer', (done: Function) => {
            diagram.remove(diagram.nodes[1]);
            let bounds: Rect = diagram.spatialSearch.getPageBounds();

            expect(bounds.left == -1050 && bounds.right == 1050 && bounds.top == -1050 && bounds.bottom == 1050).toBe(true);

            diagram.remove(diagram.nodes[1]);
            bounds = diagram.spatialSearch.getPageBounds();

            expect(bounds.left == -1050 && bounds.right == 1050 && bounds.top == -50 && bounds.bottom == 1050).toBe(true);

            diagram.remove(diagram.nodes[1]);
            bounds = diagram.spatialSearch.getPageBounds();

            expect(bounds.left == -50 && bounds.right == 1050 && bounds.top == -50 && bounds.bottom == 1050).toBe(true);

            diagram.remove(diagram.nodes[1]);
            bounds = diagram.spatialSearch.getPageBounds();

            expect(bounds.left == -50 && bounds.right == 50 && bounds.top == -50 && bounds.bottom == 50).toBe(true);
            done();
        });

        it('Removing all nodes', (done: Function) => {
            diagram.remove(diagram.nodes[0]);
            let bounds: Rect = diagram.spatialSearch.getPageBounds();

            expect(bounds.left == 0 && bounds.right == 0 && bounds.top == 0 && bounds.bottom == 0).toBe(true);
            done();
        });

        it('Adding node to an empty quad', (done: Function) => {
            diagram.add({ offsetX: 1500, offsetY: 1500, width: 100, height: 100 });
            done();
        });
    });
    describe('Spatial Search for huge diagrams', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            let nodes: NodeModel[] = [{
                id: 'node1', offsetX: 0, offsetY: 0, width: 100, height: 100,
                style: { opacity: 0.5 }
            }];

            let connectors: ConnectorModel[] = [];
            let angle: number = 45;

            let distance: number = 200;

            let sourcePt: PointModel = { x: 0, y: 0 };

            for (let i: number = 0; i < 8; i++) {
                let newPoint: PointModel = Point.transform(sourcePt, angle, distance);
                nodes.push({
                    id: 'target ' + i, width: 100, height: 100, offsetX: newPoint.x, offsetY: newPoint.y,
                    style: { opacity: 0.5 }
                });
                connectors.push({ sourceID: 'node1', targetID: 'target ' + i, type: 'Orthogonal' });
                angle += 45;
            }

            distance = 500;

            angle = 300 / 16;

            for (let i: number = 0; i < 16; i++) {
                let newPoint: PointModel = Point.transform(sourcePt, angle, distance);
                nodes.push({
                    id: 'target ' + (i + 7), width: 100, height: 100, offsetX: newPoint.x, offsetY: newPoint.y,
                    style: { opacity: 0.5 }
                });
                connectors.push({ sourceID: 'node1', targetID: 'target ' + (i + 7), type: 'Orthogonal' });
                angle += 45;
            }


            distance = 1000;

            angle = 300 / 32;

            for (let i: number = 0; i < 32; i++) {
                let newPoint: PointModel = Point.transform(sourcePt, angle, distance);
                nodes.push({
                    id: 'target ' + (i + 23), width: 100, height: 100, offsetX: newPoint.x, offsetY: newPoint.y,
                    style: { opacity: 0.5 }
                });
                connectors.push({ sourceID: 'node1', targetID: 'target ' + (i + 23), type: 'Orthogonal' });
                angle += 45;
            }


            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: nodes, connectors: connectors
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking the page bounds', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            let quads = diagram.spatialSearch.findQuads(bounds);
            let quad = diagram.spatialSearch.getQuad((diagram.nodes[0] as NodeModel).wrapper);
            expect(quad !== null).toBe(true);
            done();
        });
    });
});