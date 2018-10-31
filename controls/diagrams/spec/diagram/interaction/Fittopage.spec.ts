import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { SelectorModel } from '../../../src/diagram/interaction/selector-model';
import { Rect } from "../../../src/index";


/**
 * fit to page
 */
describe('Diagram Control', () => {
    describe('fit to page', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 500, offsetY: 400 };
            diagram = new Diagram({
                width: '1000px', height: '500px', nodes: [node],
                pageSettings: { width: 1000, height: 1000 }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('checking content,custom,page property', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            let zoom: number = diagram.scroller.currentZoom;

            diagram.fitToPage({ mode: 'Page', region: 'Content', margin: { left: 50, right: 50 }, canZoomIn: false });
            expect(diagram.scroller.currentZoom == zoom).toBe(true);
            done();
            diagram.fitToPage({ mode: 'Width', region: 'Content', margin: { bottom: 50 }, canZoomIn: false });
            expect(diagram.scroller.currentZoom == zoom).toBe(true);
            done();
            diagram.fitToPage({ mode: 'Height', region: 'Content', margin: { top: 50 }, canZoomIn: false });
            expect(diagram.scroller.currentZoom == zoom).toBe(true);
            done();

            diagram.fitToPage({ mode: 'Page', region: 'PageSettings', margin: { left: 50, right: 50 }, canZoomIn: false });
            expect(diagram.scroller.currentZoom == 0.45).toBe(true);
            done();
            diagram.fitToPage({ mode: 'Width', region: 'PageSettings', margin: { bottom: 50 }, canZoomIn: false });
            expect(diagram.scroller.currentZoom == 0.9500000000000001).toBe(true);
            done();
            diagram.fitToPage({ mode: 'Height', region: 'PageSettings', margin: { top: 50 }, canZoomIn: false });
            expect(diagram.scroller.currentZoom == 0.425).toBe(true);
            done();
            let bound: Rect = new Rect(200, 400, 500, 400)
            diagram.fitToPage({ mode: 'Page', region: 'CustomBounds', margin: { left: 50, right: 50 }, canZoomIn: false, customBounds: bound });
            expect(diagram.scroller.currentZoom == zoom).toBe(true);
            done();
            diagram.fitToPage({ mode: 'Width', region: 'CustomBounds', margin: { bottom: 50 }, canZoomIn: false, customBounds: bound });
            expect(diagram.scroller.currentZoom == 1.9).toBe(true);
            done();
            diagram.fitToPage({ mode: 'Height', region: 'CustomBounds', margin: { top: 50 }, canZoomIn: false, customBounds: bound });
            expect(diagram.scroller.currentZoom == 0.9999999999999999).toBe(true);
            done();
            diagram.bringIntoView(bound);
            expect(diagram.scroller.currentZoom == 0.9999999999999999).toBe(true);
            done();
            diagram.bringToCenter(bound);
            expect(diagram.scroller.currentZoom == 0.9999999999999999).toBe(true);
            done();
        });


    });

    describe('fit to page', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 500, offsetY: 400 };
            diagram = new Diagram({
                width: '1000px', height: '500px'
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('checking page settings', (done: Function) => {
            let selectorModel: SelectorModel = diagram.selectedItems;
            diagram.fitToPage({ mode: 'Page', region: 'PageSettings', margin: { bottom: 50 }, canZoomIn: false });
            done();
        });
    });
    describe('Multiple diagram', () => {
        let diagram: Diagram; let diagram2: Diagram;
        let ele: HTMLElement; let ele2: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'multiple_Diagram1' });
            document.body.appendChild(ele);
            ele2 = createElement('div', { id: 'multiple_Diagram2' });
            document.body.appendChild(ele2);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            diagram = new Diagram({
                width: '500px', height: '300px', nodes: [node]
            });
            diagram.appendTo('#multiple_Diagram1');

            diagram2 = new Diagram({
                width: '500px', height: '300px', nodes: [node]
            });
            diagram2.appendTo('#multiple_Diagram2');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram2.destroy();
            ele2.remove();
        });

        it('Remove node from diagram 2', (done: Function) => {
            debugger
            expect(diagram2.nodes.length === 1).toBe(true);
            expect(document.getElementById('multiple_Diagram2').querySelector('#' + 'node1_groupElement') !== null).toBe(true);
            diagram2.remove(diagram2.nodes[0]);
            expect(diagram2.nodes.length === 0).toBe(true);
            expect(document.getElementById('multiple_Diagram2').querySelector('#' + 'node1_groupElement') === null).toBe(true);
            done();
        });
        it('Remove node from diagram 1', (done: Function) => {
            expect(diagram.nodes.length === 1).toBe(true);
            expect(document.getElementById('multiple_Diagram1').querySelector('#' + 'node1_groupElement') !== null).toBe(true);
            diagram.remove(diagram.nodes[0]);
            expect(diagram.nodes.length === 0).toBe(true);
            expect(document.getElementById('multiple_Diagram1').querySelector('#' + 'node1_groupElement') === null).toBe(true);
            done();
        });
    });
});