/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { GridlinesModel, SnapSettingsModel } from '../../../src/diagram/diagram/grid-lines-model';
/**
 * Gridlines
 */
describe('Diagram Control', () => {

    describe('Gridlines', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramd' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1000px', height: '600px'
            });
            diagram.appendTo('#diagramd');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking default gridlines', (done: Function) => {

            done();
        });
        it('Checking horizontalgridlines with custom style', (done: Function) => {
            let horizontalGridlines: GridlinesModel = { lineColor: 'blue', lineDashArray: '2,2' };
            let verticalGridlines: GridlinesModel = { lineColor: 'red', lineDashArray: '2,2' };
            let snapSettings: SnapSettingsModel = { horizontalGridlines: horizontalGridlines };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            done();
        });
        it('Checking verticalGridlines', (done: Function) => {
            let horizontalGridlines: GridlinesModel = { lineColor: 'blue', lineDashArray: '2,2' };
            let verticalGridlines: GridlinesModel = { lineColor: 'red', lineDashArray: '2,2' };
            let snapSettings: SnapSettingsModel = {verticalGridlines: verticalGridlines };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            done();
        });
        it('Checking gridlines with custom style', (done: Function) => {
            let horizontalGridlines: GridlinesModel = { lineColor: 'blue', lineDashArray: '2,2', lineIntervals: [1, 14, 0.5, 14.5] };
            let verticalGridlines: GridlinesModel = { lineColor: 'red', lineDashArray: '2,2', lineIntervals: [1, 14, 0.5, 14.5] };
            let snapSettings: SnapSettingsModel = { horizontalGridlines: horizontalGridlines, verticalGridlines: verticalGridlines };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            done();
        });
    });

    describe('Gridlines', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramgridcount' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1000px', height: '600px',
                rulerSettings: {
                    showRulers: true,
                    horizontalRuler: {
                        segmentWidth: 50,
                        interval: 10
                    },
                    verticalRuler: {
                        segmentWidth: 200,
                        interval: 20
                    }
                }
            });
            diagram.appendTo('#diagramgridcount');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking dynamic gridlines', (done: Function) => {
            let pattern: HTMLElement = document.getElementById('diagramgridcount_pattern');
            expect(Number(pattern.getAttribute("height")) === diagram.rulerSettings.verticalRuler.segmentWidth &&
            Number(pattern.getAttribute("width")) === diagram.rulerSettings.horizontalRuler.segmentWidth &&
                pattern.children.length === (diagram.rulerSettings.horizontalRuler.interval +
                    diagram.rulerSettings.verticalRuler.interval)).toBe(true);
            done();
        });
    });

});