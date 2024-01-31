import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, GDPData } from '../util/datasource.spec';
import { CellModel, getColumnsWidth, getFormatFromType, SheetModel, Spreadsheet } from '../../../src/index';
import { Overlay } from '../../../src/spreadsheet/services/index';
import { getComponent, EventHandler } from '@syncfusion/ej2-base';
import { Chart, Export } from '@syncfusion/ej2-charts';
Chart.Inject(Export);

/**
 *  Chart test cases
 */
describe('Chart ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        let cell: CellModel; let spreadsheet: Spreadsheet; let imageCell: CellModel;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5', left: getColumnsWidth(spreadsheet.sheets[0], 0, 2, true) + 1 }]]);
            cell = spreadsheet.sheets[0].rows[0].cells[3];
            // expect(JSON.stringify(cell.chart)).toBe('[{"type":"Column","range":"Sheet1!D1:E5","theme":"Material","isSeriesInRows":false,"id":"e_spreadsheet_chart_1","height":290,"width":480,"top":0,"left":192}]'); check this now
            expect(helper.getElementFromSpreadsheet('#' + cell.chart[0].id).classList).toContain('e-chart');
            done();
        });
        it('Allow Editing property change', (done: Function) => {
            const overlay: HTMLElement = helper.getElementFromSpreadsheet('.e-ss-overlay');
            expect(overlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            const ribbonTabObj: any = getComponent(helper.getElementFromSpreadsheet('.e-tab'), 'tab');
            expect(ribbonTabObj.selectedItem).toBe(6);
            spreadsheet.allowEditing = false;
            spreadsheet.dataBind();
            expect(overlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(ribbonTabObj.selectedItem).toBe(1);
            helper.triggerMouseAction('mousedown', { x: 0, y: 0 }, overlay, overlay);
            expect(overlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(ribbonTabObj.selectedItem).toBe(1);
            helper.invoke('selectChart');
            expect(overlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            spreadsheet.allowEditing = true;
            spreadsheet.dataBind();
            helper.triggerMouseAction('mousedown', { x: 0, y: 0 }, overlay, overlay);
            expect(overlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(ribbonTabObj.selectedItem).toBe(6);
            done();
        });
        it('select and deselect the chart', (done: Function) => {
            const chartOverlay: HTMLElement = helper.getElementFromSpreadsheet(`#${cell.chart[0].id}`).parentElement;
            const ribbonObj: any = spreadsheet.ribbonModule.ribbon;
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(ribbonObj.selectedTab).toBe(5);
            helper.invoke('selectImage');
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            helper.invoke('deselectChart');
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(ribbonObj.selectedTab).toBe(0);
            helper.invoke('insertImage', [[{src:"https://cdn.syncfusion.com/content/images/Logo/Logo_150dpi.png", width: 110, height: 70 }], 'B7']);
            imageCell = spreadsheet.sheets[0].rows[6].cells[1];
            const imageOverlay: HTMLElement = helper.getElementFromSpreadsheet(`#${imageCell.image[0].id}`);
            expect(imageOverlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            helper.invoke('selectChart', [cell.chart[0].id]);
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(imageOverlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(ribbonObj.selectedTab).toBe(5);
            helper.invoke('deselectChart');
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(ribbonObj.selectedTab).toBe(0);
            helper.invoke('insertChart', [[{ type: 'Column', range: 'B1:C11' }]]);
            const chartCell: CellModel = spreadsheet.sheets[0].rows[0].cells[1];
            const chartOverlay1: HTMLElement = helper.getElementFromSpreadsheet(`#${chartCell.chart[0].id}`).parentElement;
            expect(chartOverlay1.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(ribbonObj.selectedTab).toBe(5);
            helper.invoke('selectChart');
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(chartOverlay1.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(ribbonObj.selectedTab).toBe(5);
            helper.invoke('selectRange', ['B1:B1']);
            helper.invoke('selectChart');
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(chartOverlay1.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(ribbonObj.selectedTab).toBe(5);
            done();
        });
        it('select and deselect the image', (done: Function) => {
            const imageOverlay: HTMLElement = helper.getElementFromSpreadsheet(`#${imageCell.image[0].id}`);
            expect(imageOverlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            helper.invoke('selectImage', [imageCell.image[0].id]);
            expect(imageOverlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            const chartCell: CellModel = spreadsheet.sheets[0].rows[0].cells[1];
            const chartOverlay: HTMLElement = helper.getElementFromSpreadsheet(`#${chartCell.chart[0].id}`).parentElement;
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(spreadsheet.ribbonModule.ribbon.selectedTab).toBe(0);
            helper.invoke('insertImage', [[{src:"https://cdn.syncfusion.com/content/images/Logo/Logo_150dpi.png", width: 110, height: 70 }], 'D10']);
            const imageCell1: CellModel = spreadsheet.sheets[0].rows[9].cells[3];
            helper.invoke('selectImage', [imageCell1.image[0].id]);
            const imageOverlay1: HTMLElement = helper.getElementFromSpreadsheet(`#${imageCell1.image[0].id}`);
            expect(imageOverlay1.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(imageOverlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            helper.invoke('selectImage');
            expect(imageOverlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(imageOverlay1.classList.contains('e-ss-overlay-active')).toBeFalsy();
            helper.invoke('selectRange', ['D10:D10']);
            helper.invoke('selectImage');
            expect(imageOverlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(imageOverlay1.classList.contains('e-ss-overlay-active')).toBeTruthy();
            helper.invoke('deselectImage');
            expect(imageOverlay1.classList.contains('e-ss-overlay-active')).toBeFalsy();
            spreadsheet.sheets[0].isProtected = true;
            helper.invoke('selectImage', [imageCell1.image[0].id]);
            expect(imageOverlay1.classList.contains('e-ss-overlay-active')).toBeFalsy();
            spreadsheet.sheets[0].isProtected = false;
            done();
        });
        it('Apply freezepane with chart', (done: Function) => {
            helper.invoke('freezePanes', [3, 2]);
            setTimeout((): void => {
                expect(helper.getElementFromSpreadsheet('#' + cell.chart[0].id).parentElement.parentElement.classList).toContain('e-sheet');
                done();
            });
        });
        it('Delete', (done: Function) => {
            const id: string = cell.chart[0].id;
            (helper.getInstance().serviceLocator.getService('shape') as Overlay).destroy();// Need to remove once destory of overlay service handled in chart.
            helper.invoke('deleteChart', [id]);
            cell = spreadsheet.sheets[0].rows[0].cells[3];
            expect(JSON.stringify(cell.chart)).toBe('[]');
            expect(helper.getElementFromSpreadsheet('#' + id)).toBeNull();
            done();
        });
    });

    describe('UI - Interaction for Chart Type->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('100% stacked Column Chart->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedColumn100').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('clustered Bar Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Bar"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#clusteredBar').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('stacked Bar Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Bar"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedBar').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('100% stacked Bar Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Bar"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedBar100').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Area Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Area"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#area').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('stacked Area Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Area"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedArea').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('100% stacked Area Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Area"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedArea100').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Pie Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Pie/Doughnut"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#pie').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-accumulationchart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Doughnut Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Pie/Doughnut"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#doughnut').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Line Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#line').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('stacked Line Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedLine').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('100% stacked line Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedLine100').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Scatter Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Scatter"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#scatter').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Chartrange handler method testing ->', (done: Function) => {
            helper.getInstance().spreadsheetChartModule.chartRangeHandler();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Undo after change chart type->', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('toIntrnlRange Method testing without providing range->', (done: Function) => {
            helper.getInstance().spreadsheetChartModule.toIntrnlRange('',0);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('toIntrnlRange Method testing with providing range->', (done: Function) => {
            helper.getInstance().spreadsheetChartModule.toIntrnlRange('D1:E6',0);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
        it('Insert doughnut chart with isseriesinrows as true and datalabel as outer and legends as right->', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            helper.getInstance().insertChart([{ type: "Doughnut", theme: "Material", isSeriesInRows: true, range: "Sheet1!A1:E5", id: "Chart1",  legendSettings: { visible: true, position: 'Right' }, dataLabelSettings: { visible: true, position: 'Outer' } }]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
        it('Insert doughnut chart with isseriesinrows as true and datalabel as middle->', (done: Function) => {
            helper.getInstance().insertChart([{ type: "Doughnut", theme: "Material", isSeriesInRows: true, range: "Sheet1!A1:E5", id: "Chart1", dataLabelSettings: { visible: true, position: 'Middle' }}]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
        it('Insert chart with percentage number formatting->', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Percentage').click();
            helper.getInstance().insertChart([{ type: "Column", range: "H1:H11" }]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
        it('Insert chart without providing range->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.getInstance().insertChart([{ type: "Column", theme: "Material", }]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Delete chart without providing id->', (done: Function) => {
            helper.getInstance().deleteChart()
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).toBeNull();
                done();
            });
        });
    });


    describe('UI - interaction for copy and paste chart->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Copy and paste chart->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#line').click();
            setTimeout(() => {
                helper.switchRibbonTab(1);
                helper.getElement('#' + helper.id + '_copy').click();
                setTimeout(() => {
                    helper.invoke('paste');
                    expect(helper.getElementFromSpreadsheet('#' + helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id).classList).toContain('e-chart');
                    done();
                });
            });
        });
    });

    describe('UI - Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Copy and paste the deleted chart->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#line').click();
            setTimeout(() => {
                helper.switchRibbonTab(1);
                helper.getElement('#' + helper.id + '_copy').click();
                setTimeout(() => {
                    helper.triggerKeyNativeEvent(46);
                    helper.invoke('paste');
                    expect(helper.getElementFromSpreadsheet('#' + helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id).classList).toContain('e-chart');
                    helper.triggerKeyNativeEvent(46);
                    done();
                });
            });
        });
        it('Edit the formuala refernece cell after applying chart for formula referenced cells ->', (done: Function) => {
            helper.edit('H2', '=E2+E3');
            helper.invoke('selectRange', ['G1:H7']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#line').click();
            setTimeout(() => {
                helper.invoke('selectRange', ['E2']);
                helper.edit('E2', '25');
                setTimeout(() => {
                    const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                    expect(chart).not.toBeNull();
                    done();
                });
            });
        });
        it('Chart value refreshing by hiding row -I->', (done: Function) => {
            helper.invoke('hideRow', [2]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Chart value refreshing by hiding row -II->', (done: Function) => {
            helper.invoke('hideRow', [6]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Copy and paste line chart->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#line').click();
            setTimeout(() => {
                helper.switchRibbonTab(1);
                helper.getElement('#' + helper.id + '_copy').click();
                setTimeout(() => {
                    helper.invoke('paste');
                    expect(helper.getElementFromSpreadsheet('#' + helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id).classList).toContain('e-chart');
                    done();
                });
            });
        });
        it('Copy and paste the Line Chart With Marker->', (done: Function) => {
            helper.invoke('selectRange', ['F1:G5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#lineMarker').click();
            setTimeout(() => {
                helper.invoke('selectRange', ['F1']);
                helper.switchRibbonTab(1);
                helper.getElement('#' + helper.id + '_copy').click();
                setTimeout(() => {
                    helper.invoke('selectRange', ['I4']);
                    helper.invoke('paste');
                    expect(helper.getElementFromSpreadsheet('#' + helper.getInstance().sheets[0].rows[3].cells[8].chart[0].id).classList).toContain('e-chart');
                    expect(helper.getInstance().sheets[0].rows[3].cells[8].chart[0].markerSettings.visible).toBeTruthy();
                    done();
                });
            });
        });
        it('Chart for the date values', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'B4:B7', id: 'e_spreadsheet_chart_1' }]]);
            helper.invoke('insertChart', [[{ type: 'Column', theme: 'Material', InRows: false, range: 'Sheet1!A1:C3', height: 290, width: 480, top: 5, left: 10 }]]);
            setTimeout(() => {
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:41847, series0');
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_1').getAttribute('aria-label')).toBe('2:41964, series0');
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_2').getAttribute('aria-label')).toBe('3:41813, series0');
                done();
            });
        });
        it('Chart for the date and time values', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'B4:C11', id: 'e_spreadsheet_chart_2' }]]);
            setTimeout(() => {
                expect(document.getElementById('e_spreadsheet_chart_2_Series_0_Point_0').getAttribute('aria-label')).toBe('1:41847, series0');
                expect(document.getElementById('e_spreadsheet_chart_2_Series_0_Point_1').getAttribute('aria-label')).toBe('2:41964, series0');
                expect(document.getElementById('e_spreadsheet_chart_2_Series_0_Point_2').getAttribute('aria-label')).toBe('3:41813, series0');
                expect(document.getElementById('e_spreadsheet_chart_2_Series_0_Point_3').getAttribute('aria-label')).toBe('4:41674, series0');
                expect(document.getElementById('e_spreadsheet_chart_2_Series_0_Point_4').getAttribute('aria-label')).toBe('5:41973, series0');
                expect(document.getElementById('e_spreadsheet_chart_2_Series_0_Point_5').getAttribute('aria-label')).toBe('6:41829, series0');
                expect(document.getElementById('e_spreadsheet_chart_2_Series_0_Point_6').getAttribute('aria-label')).toBe('7:41943, series0');
                done();
            });
        });
    });

    describe('UI - Interaction for chart resize->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply chart->', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            helper.getInstance().insertChart([{ type: "Line", theme: "Material",  range: "Sheet1!G1:H7"}]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Chart size refreshing ->', (done: Function) => {
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            helper.getInstance().workbookChartModule.refreshChartSize({ height: '300', width: '300', overlayEle: chart  });
            setTimeout(() => {
                expect(chart.style.width).toBe('480px');
                expect(chart.style.height).toBe('290px');
                done();
            });
        });
    });

    describe('UI - Interaction for insert chart with protect sheet and allowchart as false->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ allowChart: false, sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert chart with protect sheet and allowchart as false->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Sheet1', { selectCells: true });
            helper.getInstance().insertChart([{ type: "Column", theme: "Material", range: "Sheet1!A1:E5", }]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).toBeNull();
                done();
            });
        });
    });
    
    describe('UI - Interaction for Chart Design Tab->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Add Chart Title->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Column"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#clusteredColumn').click();
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Chart Title"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#ChartTitleAbove').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-title-dlg.e-dialog')
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-title-dlg .e-dlg-content .e-input') as HTMLInputElement;
                input.value = 'Chart';
                helper.click('.e-title-dlg .e-primary');
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-chart-focused')[1].textContent).toBe('Chart');
                    done();
                });
            });
        });
        it('Add Chart Horizontal Title->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Axis Title"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PHAxisTitle').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-title-dlg.e-dialog')
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-title-dlg .e-dlg-content .e-input') as HTMLInputElement;
                input.value = 'Horizontal';
                helper.click('.e-title-dlg .e-primary');
                done();
            });
        });
        it('Add Chart Vertical Title->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Axis Title"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PVAxisTitle').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-title-dlg.e-dialog')
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-title-dlg .e-dlg-content .e-input') as HTMLInputElement;
                input.value = 'Vertical';
                helper.click('.e-title-dlg .e-primary');
                done();
            });
        });
        it('Undo after Adding Chart Vertical Title->', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
        it('Undo after Adding Chart Horizontal Title->', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
        it('Undo after Adding Chart Title->', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(document.getElementsByClassName('e-chart-focused')[1]).toBeUndefined();
                done();
            });
        });
        it('Add Chart Title Non->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Chart Title"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#ChartTitleNone').click();
            setTimeout(() => {
                expect(document.getElementsByClassName('e-chart-focused')[1]).toBeUndefined();
                done();
            });
        });
        it('Undo after Adding Chart Title None->', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(document.getElementsByClassName('e-chart-focused')[1]).toBeUndefined();
                done();
            });
        });
        it('Choosing Material Dark in Chart Theme Dropdown->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="Material Dark"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Material Dark');
                done();
            }, 20);
        });
        it('Choosing Fabric Dark in Chart Theme Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="Fabric Dark"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Fabric Dark');
                done();
            }, 20);
        });
        it('Choosing Bootstrap Dark in Chart Theme Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="Bootstrap Dark"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Bootstrap Dark');
                done();
            }, 20);
        });
        it('Choosing Bootstrap5 Dark in Chart Theme Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="Bootstrap5 Dark"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Bootstrap5 Dark');
                done();
            }, 20);
        });
        it('Choosing Tailwind Dark in Chart Theme Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="Tailwind Dark"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Tailwind Dark');
                done();
            }, 20);
        });
        it('Choosing Fluent Dark in Chart Theme Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="Fluent Dark"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Fluent Dark');
                done();
            }, 20);
        });
        it('Choosing HighContrast in Chart Theme Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="HighContrast"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('HighContrast');
                done();
            }, 20);
        });
        it('Undo after Adding Chart Theme->', (done: Function) => { // need to check
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                helper.switchRibbonTab(6);
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('HighContrast');
                done();
            });
        });
    });

    describe('UI - Interaction for Data Label in Chart Design Tab->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply Center Data Labels->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Column"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#clusteredColumn').click();
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Data Labels"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#DLCenter').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Undo after Adding Center Data Labels->', (done: Function) => { 
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
        it('Apply Inside End Data Labels->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Data Labels"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#DLInsideend').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Undo after Adding Inside End Data Labels->', (done: Function) => { 
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
        it('Apply Inside Base Data Labels->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Data Labels"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#DLInsidebase').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Undo after Adding Inside Base Data Labels->', (done: Function) => { 
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
        it('Apply Outside End Data Labels->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Data Labels"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#DLOutsideend').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Undo after Adding Outside End Data Labels->', (done: Function) => { 
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
        it('Apply None Data Labels->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Data Labels"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#DLNone').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Undo after Adding None Data Labels->', (done: Function) => { 
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
    });

    describe('UI - Interaction for Data Label in Pie Chart->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert Pie Chart->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Pie', range: 'D1:E5' }]]);
            done();
        });
        it('Apply Center Data Labels for Pie Chart->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Data Labels"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#DLCenter').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-accumulationchart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Apply Inside End Data Labels for Pie Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Data Labels"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#DLInsideend').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-accumulationchart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Apply Inside Base Data Labels for Pie Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Data Labels"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#DLInsidebase').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-accumulationchart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Apply Outside End Data Labels for Pie Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Data Labels"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#DLOutsideend').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-accumulationchart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Apply None Data Labels for Pie Chart->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Data Labels"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#DLNone').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-accumulationchart');
                expect(chart).not.toBeNull();
                done();
            });
        });
    });

    describe('UI - Interaction for Gridlines and Legends in Chart Design Tab->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply Major Horizonatal Gridlines->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Column"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#clusteredColumn').click();
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Gridlines"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#GLMajorHorizontal').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Apply Major Vertical Gridlines->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Gridlines"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#GLMajorVertical').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Apply Minor Horizontal Gridlines->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Gridlines"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#GLMinorHorizontal').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Apply Minor Vertical Gridlines->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Gridlines"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#GLMinorVertical').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Apply Right Legend->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Legends"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#LegendsRight').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Undo after Adding Right Legend->', (done: Function) => { 
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
        it('Apply Left Legend->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Legends"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#LegendsLeft').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Undo after Adding Left Legend->', (done: Function) => { 
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
        it('Apply Bottom Legend->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Legends"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#LegendsBottom').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Undo after Adding Bottom Legend->', (done: Function) => { 
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
        it('Apply Legend Top->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Legends"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#LegendsTop').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Undo after Adding Top Legend->', (done: Function) => { 
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
        it('Apply No Legend->', (done: Function) => {
            helper.switchRibbonTab(6);
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Legends"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#LegendNone').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Undo after Adding No Legend->', (done: Function) => { 
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                done();
            });
        });
    });

    describe('UI - Interaction for Chart Design with Freezed Row and Column->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], frozenRows: 3, frozenColumns: 4 }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply Minor Horizonatal Gridlines with Freeze Panes->', (done: Function) => {
            helper.invoke('selectRange', ['A1:E5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Column"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#clusteredColumn').click();
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Gridlines"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#GLMinorHorizontal').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Apply Minor Vertical Gridlines with Freeze Panes->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Gridlines"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#GLMinorVertical').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Focus Chart with Freeze Panes->', (done: Function) => {
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const inst: Spreadsheet = helper.getInstance();
            inst.element.focus();
            helper.triggerKeyNativeEvent(46);
            expect(chart).not.toBeNull();
            done();
        });
        it('Insert Chart with Accounting Number Formatting->', (done: Function) => {
            helper.invoke('selectRange', ['D2:D5'])
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Accounting').click();
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
        it('Insert Chart with Currency Number Formatting->', (done: Function) => {
            helper.invoke('selectRange', ['D2:D5'])
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Currency').click();
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
        it('Insert Chart with Percentage Number Formatting->', (done: Function) => {
            helper.invoke('selectRange', ['D2:D5'])
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Percentage').click();
            helper.invoke('insertChart', [[{ type: 'Scatter', range: 'D1:E5' }]]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
        it('Insert Chart with no Value Max Chart Range Row->', (done: Function) => {
            helper.invoke('updateCell', [{ value: '' }, 'D5']);
            helper.invoke('updateCell', [{ value: '10' }, 'E1']);
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
        it('Insert Chart with Hidden Row and Hidden Column->', (done: Function) => {
            helper.invoke('hideRow', [2]);
            setTimeout(() => {
                helper.invoke('hideColumn', [2]);
                setTimeout(() => {
                    helper.invoke('insertChart', [[{ type: 'Column', range: 'A1:E5' }]]);
                    const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                    expect(chart).not.toBeNull();
                    helper.triggerKeyNativeEvent(46);
                    done();
                });
            });
        });
    });

    describe('Chart data refreshing after merge action->', () => {
        beforeAll((done: Function) => {
            let model: SheetModel[] = [{ ranges: [{ dataSource: defaultData, startCell: 'C3' }],
                rows: [{ index: 0, cells: [{ index: 10, chart: [{ type: 'Column', range: 'F3:G13', id: 'e_spreadsheet_chart_1' }] }] }],
                columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }] },
                { rows: [{ cells: [{ chart: [{ type: 'Column', theme: 'Material',
                isSeriesInRows: false, range: 'Sheet1!A1:C3', height: 290, width: 480, top: 5, left: 10 }] }] }] }];
            helper.initializeSpreadsheet({
                sheets: model,
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'C3:J3');
                }
            },done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Merge with chart applied range - 1', (done: Function) => {
            helper.invoke('selectRange', ['F3:F4'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:0, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 1 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:10, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 2', (done: Function) => {
            helper.invoke('selectRange', ['F3:F4'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:0, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 2 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_1').getAttribute('aria-label')).toBe('2:20, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 3', (done: Function) => {
            helper.invoke('selectRange', ['F1:F4'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0')).not.toBeNull();
                done();
            });
        });
        it('Merge with chart applied range - 3 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:10, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 4', (done: Function) => {
            helper.invoke('selectRange', ['G3:G4'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:0, Price');
                done();
            });
        });
        it('Merge with chart applied range - 4 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:20, Price');
                done();
            });
        });
        it('Merge with chart applied range - 5', (done: Function) => {
            helper.invoke('selectRange', ['G13:H14'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_9').getAttribute('aria-label')).toBe('10:10, Price');
                done();
            });
        });
        it('Merge with chart applied range - 5 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_9').getAttribute('aria-label')).toBe('10:10, Price');
                done();
            });
        });
        it('Merge with chart applied range - 6', (done: Function) => {
            helper.invoke('selectRange', ['F13:G14'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_9').getAttribute('aria-label')).toBe('10:0, Price');
                done();
            });
        });
        it('Merge with chart applied range - 6 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_9').getAttribute('aria-label')).toBe('10:10, Price');
                done();
            });
        });
        it('Merge with chart applied range - 7', (done: Function) => {
            helper.invoke('selectRange', ['F2:G4'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0')).not.toBeNull();
                done();
            });
        });
        it('Merge with chart applied range - 7 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:10, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 8', (done: Function) => {
            helper.invoke('selectRange', ['E2:F5'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0')).not.toBeNull();
                done();
            });
        });
        it('Merge with chart applied range - 8 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:10, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 9', (done: Function) => {
            helper.invoke('selectRange', ['E5:H5'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_1').getAttribute('aria-label')).toBe('2:0, Quantity');
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_1').getAttribute('aria-label')).toBe('2:0, Price');
                done();
            });
        });
        it('Merge with chart applied range - 9 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_1').getAttribute('aria-label')).toBe('2:20, Quantity');
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_1').getAttribute('aria-label')).toBe('2:30, Price');
                done();
            });
        });
        it('Merge with chart applied range - 10', (done: Function) => {
            helper.invoke('selectRange', ['E5:G5'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_1').getAttribute('aria-label')).toBe('2:0, Quantity');
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_1').getAttribute('aria-label')).toBe('2:0, Price');
                done();
            });
        });
        it('Merge with chart applied range - 10 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_1').getAttribute('aria-label')).toBe('2:20, Quantity');
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_1').getAttribute('aria-label')).toBe('2:30, Price');
                done();
            });
        });
        it('Merge with chart applied range - 11', (done: Function) => {
            helper.invoke('selectRange', ['E2:G4'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0')).not.toBeNull();
                done();
            });
        });
        it('Merge with chart applied range - 11 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:10, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 12', (done: Function) => {
            helper.invoke('selectRange', ['E2:G4'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0')).not.toBeNull();
                done();
            });
        });
        it('Merge with chart applied range - 12 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:10, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 13', (done: Function) => {
            helper.invoke('selectRange', ['E13:G14'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_8').getAttribute('aria-label')).toBe('41:30, Price');
                done();
            });
        });
        it('Merge with chart applied range - 13 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:10, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 14', (done: Function) => {
            helper.invoke('selectRange', ['F2:H4'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0')).not.toBeNull();
                done();
            });
        });
        it('Merge with chart applied range - 14 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:10, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 15', (done: Function) => {
            helper.invoke('selectRange', ['F13:H14'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_9').getAttribute('aria-label')).toBe('10:0, Price');
                done();
            });
        });
        it('Merge with chart applied range - 15 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_9').getAttribute('aria-label')).toBe('10:10, Price');
                done();
            });
        });
        it('Merge with chart applied range - 16', (done: Function) => {
            helper.invoke('selectRange', ['G13:H13']);
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:20, Price');
                done();
            });
        });
        it('Merge with chart applied range - 16 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_9').getAttribute('aria-label')).toBe('10:10, Price');
                done();
            });
        });
        it('Merge with chart applied range - 17', (done: Function) => {
            helper.invoke('selectRange', ['E3:F13']);
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0')).not.toBeNull();
                done();
            });
        });
        it('Merge with chart applied range - 17 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('1:10, Quantity');
                done();
            });
        });
        it('Merge with chart applied range - 18', (done: Function) => {
            helper.invoke('selectRange', ['G2:G14']);
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:0, ');
                done();
            });
        });
        it('Merge with chart applied range - 18 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:20, Price');
                done();
            });
        });
        it('Merge with chart applied range - 19', (done: Function) => {
            helper.invoke('selectRange', ['H3:G13']);
            helper.click('#spreadsheet_merge');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:0, Price');
                done();
            });
        });
        it('Merge with chart applied range - 19 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:20, Price');
                done();
            });
        });
        it('Merge with chart applied range - 20', (done: Function) => {
            helper.invoke('selectRange', ['E5:E9']);
            helper.click('#spreadsheet_merge');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:20, Price');
                done();
            });
        });
        it('Merge with chart applied range - 20 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:20, Price');
                done();
            });
        });
        it('Merge with chart applied range - 21', (done: Function) => {
            helper.invoke('selectRange', ['E3:E13']);
            helper.click('#spreadsheet_merge');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:20, Price');
                done();
            });
        });
        it('Merge with chart applied range - 21 undo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {  
                expect(document.getElementById('e_spreadsheet_chart_1_Series_1_Point_0').getAttribute('aria-label')).toBe('1:20, Price');
                done();
            });
        });
    });

    describe('Chart data refreshing after clear content action->', () => {
        beforeAll((done: Function) => {
            let model: SheetModel[] = [{ ranges: [{ dataSource: defaultData, startCell: 'C3' }],
                rows: [{ index: 0, cells: [{ index: 10, chart: [{ type: 'Column', range: 'C3:D13', id: 'e_spreadsheet_chart_1' }] }] }],
                columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }]
            },
            { rows: [{ cells: [{ chart: [{ type: 'Column', theme: 'Material', isSeriesInRows: false, range: 'Sheet1!A1:C3', height: 290, width: 480, top: 5, left: 10 }] }] }] }];
            helper.initializeSpreadsheet({
                sheets: model,
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'C3:J3');
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Clear contents with chart applied range in single cell', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.clear({ type: 'Clear Contents', range: 'C4' });
            setTimeout(() => {
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0')).not.toBeNull();
                expect(document.getElementById('e_spreadsheet_chart_10_AxisLabel_0').textContent).toBe('');
                done();
            });
        });
        it('Clear contents with chart applied range in multiple cells', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.clear({ type: 'Clear Contents', range: 'C6:C8' });
            setTimeout(() => {
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_2')).not.toBeNull();
                expect(document.getElementById('e_spreadsheet_chart_10_AxisLabel_2').textContent).toBe('');
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_3')).not.toBeNull();
                expect(document.getElementById('e_spreadsheet_chart_10_AxisLabel_3').textContent).toBe('');
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_4')).not.toBeNull();
                expect(document.getElementById('e_spreadsheet_chart_10_AxisLabel_4').textContent).toBe('');
                done();
            });
        });
    });

    describe('Chart data refreshing after merge action->', () => {
        beforeAll((done: Function) => {
            let model: SheetModel[] = [{ ranges: [{ dataSource: defaultData, startCell: 'C3' }],
                rows: [{ index: 0, cells: [{ index: 10, chart: [{ type: 'Column', range: 'C3:D13', id: 'e_spreadsheet_chart_1' }] }] }],
                columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }]
            },
            { rows: [{ cells: [{ chart: [{ type: 'Column', theme: 'Material', isSeriesInRows: false, range: 'Sheet1!A1:C3', height: 290, width: 480, top: 5, left: 10 }] }] }] }];
            helper.initializeSpreadsheet({
                sheets: model,
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'C3:J3');
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Merge action after the chart applied', (done: Function) => {
            helper.invoke('selectRange', ['C4:C6'])
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0')).not.toBeNull();
                expect(document.getElementById('e_spreadsheet_chart_10_AxisLabel_0').textContent).not.toBe('');
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_1')).not.toBeNull();
                expect(document.getElementById('e_spreadsheet_chart_10_AxisLabel_1').textContent).toBe('');
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_2')).not.toBeNull();
                expect(document.getElementById('e_spreadsheet_chart_10_AxisLabel_2').textContent).toBe('');
                done();
            });
        });
    });
    
    describe('CR-Issues ->', () => {
        // describe('I315401, I281820 ->', () => {
        //     beforeEach((done: Function) => {
        //         let sheet: SheetModel[] = [{
        //             ranges: [{ dataSource: GDPData }],
        //             rows: [{ index: 1, cells: [{ index: 6, chart: [{ type: 'Column', range: 'A1:E8' }] }] }],
        //             columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }]
        //         }];
        //         helper.initializeSpreadsheet({
        //             sheets: sheet,
        //             created: (): void => {
        //                 const spreadsheet: Spreadsheet = helper.getInstance();
        //                 spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'A1:E1');
        //                 spreadsheet.numberFormat(getFormatFromType('Currency'), 'B2:E8');
        //             }
        //         }, done);
        //     });
        //     afterEach(() => {
        //         helper.invoke('destroy');
        //     });
        //     it('Charts are deleting only on selection of the value', (done: Function) => {
        //         const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
        //         expect(chart.style.top).toEqual('20px');
        //         expect(chart.style.left).toEqual('444px');
        //         const inst: Spreadsheet = helper.getInstance();
        //         inst.element.focus();
        //         expect(inst.sheets[0].rows[1].cells[6].chart[0].top).toBe(20);
        //         expect(inst.sheets[0].rows[1].cells[6].chart[0].left).toBe(444);
        //         expect(inst.sheets[0].rows[1].cells[6].chart[0].range).toEqual('Sheet1!A1:E8');
        //         helper.triggerMouseAction(
        //             'mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 },
        //             chart, chart);
        //         helper.triggerMouseAction(
        //             'mousemove', { x: chart.getBoundingClientRect().left + 200, y: chart.getBoundingClientRect().top + 100 },
        //             chart, chart);
        //         helper.triggerMouseAction(
        //             'mouseup', { x: chart.getBoundingClientRect().left + 200, y: chart.getBoundingClientRect().top + 100 },
        //             document, chart);
        //         (inst.serviceLocator.getService('shape') as Overlay).destroy();// Need to remove once destory of overlay service handled in chart.
        //         expect(inst.sheets[0].rows[1].cells[6].chart.length).toBe(0);
        //         expect(inst.sheets[0].rows[11].cells[9].chart.length).toBe(1);
        //         expect(chart.style.top).toEqual('233px');
        //         expect(chart.style.left).toEqual('643px');
        //         expect(inst.sheets[0].rows[11].cells[9].chart[0].top).toBe(233);
        //         expect(inst.sheets[0].rows[11].cells[9].chart[0].left).toBe(643);
        //         helper.triggerKeyNativeEvent(46);
        //         expect(inst.sheets[0].rows[11].cells[9].chart.length).toBe(0);
        //         done();
        //     });
        // });
        describe('Chart actions->', () => {
            beforeAll((done: Function) => {
                let model: SheetModel[] = [{ ranges: [{ dataSource: GDPData }],
                    rows: [{ index: 1, cells: [{ index: 6, chart: [{ type: 'Pie', range: 'A1:E8' }] }] }],
                    columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }] },
                    { rows: [{ cells: [{ chart: [{ type: 'Column', theme: 'Material',
                    isSeriesInRows: false, range: 'Sheet1!A1:C3', height: 290, width: 480, top: 5, left: 10 }] }] }] }];
                helper.initializeSpreadsheet({
                    sheets: model,
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'A1:E1');
                    }
                },done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-50430 -> Aggregate value wrongly displayed in chart Sample', (done: Function) => {
                helper.invoke('selectRange', ['B2:E8']);
                expect(helper.getInstance().sheets[0].selectedRange).toEqual('B2:E8');
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 28');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(1)');
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 28');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li:nth-child(2)').textContent).toBe('Sum: 197.61');
                done();
            });
            it('Chart data not refreshed after merge action', (done: Function) => {
                const chartObj: any = getComponent(helper.getElementFromSpreadsheet('.e-accumulationchart'), 'accumulationchart');
                expect(chartObj.series[0].dataSource[5].y).toBe(2.9);
                expect(chartObj.series[0].dataSource[6].y).toBe(2.4);
                expect(chartObj.series[1].dataSource[4].y).toBe(2.85);
                expect(chartObj.series[1].dataSource[5].y).toBe(2.94);
                expect(chartObj.series[1].dataSource[6].y).toBe(2.93);
                helper.invoke('merge', ['B6:C10']);
                expect(chartObj.series[0].dataSource[5].y).toBe(0);
                expect(chartObj.series[0].dataSource[6].y).toBe(0);
                expect(chartObj.series[1].dataSource[4].y).toBe(0);
                expect(chartObj.series[1].dataSource[5].y).toBe(0);
                expect(chartObj.series[1].dataSource[6].y).toBe(0);
                done();
            });
            it('ej2-react-ui-components/issues/79 -> Charts are not loaded if data range is not from active sheet', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.activeSheetIndex = 1;
                spreadsheet.dataBind();
                setTimeout((): void => {
                    const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                    expect(chart).not.toBeNull();
                    expect(chart.style.top).toEqual('5px');
                    expect(chart.style.left).toEqual('10px');
                    expect(spreadsheet.sheets[1].rows[0].cells[0].chart[0].range).toEqual('Sheet1!A1:C3');
                    done();
                });
            });
        });
        describe('Dependent use cases->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ index: 1, cells: [{ index: 6, chart: [{ type: 'Pie', range: 'A1:E8' }] }] }],
                    columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Sheet rename update on chart range', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[6].chart[0].range).toEqual('Sheet1!A1:E8');
                helper.triggerMouseAction(
                    'dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'),
                    helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
                const editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
                editorElem.click();
                editorElem.value = 'Sheet11';
                helper.triggerKeyNativeEvent(13, false, false, editorElem);
                expect(spreadsheet.sheets[0].rows[1].cells[6].chart[0].range).toEqual('Sheet11!A1:E8');
                done();
            });
            it('Apply Undo after Chart Refresh', (done: Function) => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                const inst: Spreadsheet = helper.getInstance();
                inst.element.focus();       
                helper.triggerMouseAction('mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 }, chart, chart);
                helper.triggerMouseAction('mousemove', { x: chart.getBoundingClientRect().left + 200, y: chart.getBoundingClientRect().top + 100 }, chart, chart);
                helper.triggerMouseAction('mouseup', { x: chart.getBoundingClientRect().left + 200, y: chart.getBoundingClientRect().top + 100 }, document, chart);
                (inst.serviceLocator.getService('shape') as Overlay).destroy();
                setTimeout(() => {
                    expect(chart.style.left).toEqual('643px');
                    helper.switchRibbonTab(1);
                    helper.click('#spreadsheet_undo');
                    expect(chart.style.left).toEqual('444px');
                    EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                    done();
                });
            });
            it('Apply Redo after Chart Refresh', (done: Function) => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                helper.click('#spreadsheet_redo');
                expect(chart.style.left).toEqual('643px');
                EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                done();
            });
        });
        describe('EJ2-70711->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Inserting chart remains blank when selecting the range from downwards->', (done: Function) => {
                helper.getInstance().insertChart([{ type: "Column", theme: "Material", range: "H7:H2", }]);
                setTimeout(() => {
                    const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                    expect(chart).not.toBeNull();
                    done();
                });
            });
            it('Inserting chart remains blank when selecting the multiple range from downwards->', (done: Function) => {
                helper.getInstance().insertChart([{ type: "Column", theme: "Material", range: "H7:G2", }]);
                setTimeout(() => {
                    const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                    expect(chart).not.toBeNull();
                    done();
                });
            });
            it('Insert chart with time formatted values->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.insertChart([{ type: 'Column', theme: 'Material', range: 'C1:D5', }]);
                setTimeout(() => {
                    const chartId: string = `#${spreadsheet.sheets[0].rows[0].cells[2].chart[0].id}`;
                    const chart: HTMLElement = spreadsheet.element.querySelector(chartId);
                    expect(chart).not.toBeNull();
                    const chartObj: any = getComponent(chart, 'chart');
                    expect(chartObj.series.length).toBe(1);
                    expect(chartObj.series[0].dataModule.dataManager.dataSource.json.length).toBe(4);
                    expect(chartObj.series[0].dataModule.dataManager.dataSource.json[0].x).toBe('11:34:32 AM');
                    expect(chartObj.series[0].dataModule.dataManager.dataSource.json[0].y).toBe(10);
                    done();
                });
            });
            it('Insert chart with date formatted values->', (done: Function) => {
                helper.invoke('numberFormat', ['dddd, mmmm dd, yyyy', 'E1:E4']);
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.insertChart([{ type: 'Column', theme: 'Material', range: 'E1:F4', }]);
                setTimeout(() => {
                    const chartId: string = `#${spreadsheet.sheets[0].rows[0].cells[4].chart[0].id}`;
                    const chart: HTMLElement = spreadsheet.element.querySelector(chartId);
                    expect(chart).not.toBeNull();
                    const chartObj: any = getComponent(chart, 'chart');
                    expect(chartObj.series.length).toBe(1);
                    expect(chartObj.series[0].dataModule.dataManager.dataSource.json.length).toBe(3);
                    expect(chartObj.series[0].dataModule.dataManager.dataSource.json[0].x).toBe('Saturday, January 20, 1900');
                    expect(chartObj.series[0].dataModule.dataManager.dataSource.json[0].y).toBe(200);
                    done();
                });
            });
        });
        describe('EJ2-71624', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],  selectedRange: 'K2:K2' }]}, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Spreadsheet displays wrong value for percentage data while inserting chart', (done: Function) => {
                helper.edit('I2', 'A');
                helper.edit('I3', 'B');
                helper.edit('I4', 'C');
                helper.edit('J2', '1');
                helper.edit('J3', '2');
                helper.edit('J4', '3');
                helper.invoke('numberFormat', ['0.00%', 'J2:J4']);
                helper.getInstance().insertChart([{ type: "Line", range: "I2:J4" }]);
                helper.invoke('deleteChart');
                done()
            });
            it('custom formating applied while inserting chart', (done: Function) => {
                helper.edit('J2', '20');
                helper.edit('J3', '43');
                helper.edit('J4', '23');
                helper.invoke('numberFormat', ['mm-dd-yyyy', 'J2:J4']);
                helper.getInstance().insertChart([{ type: "Line", range: "I2:J4" }]);
                helper.invoke('deleteChart');
                done()
            })
            it('empty cell applied while inserting chart', (done: Function) => {
                helper.edit('I3', '');
                helper.edit('J2', '20');
                helper.edit('J3', '43');
                helper.edit('J4', '23');
                helper.getInstance().insertChart([{ type: "Line", range: "I2:J4" }]);
                helper.invoke('deleteChart');
                done()
            });
            it('merge cell applied while inserting chart', (done: Function) => {
                helper.edit('I2', 'A');
                helper.edit('I3', 'B');
                helper.edit('I4', 'C');
                helper.edit('J2', '20');
                helper.edit('J3', '43');
                helper.edit('J4', '23');
                helper.invoke('merge', ['I2:I3']);
                helper.getInstance().insertChart([{ type: "Column", range: "I2:J4" }]);
                helper.invoke('deleteChart');
                done()
            })
        });
    });
    describe('Provide support for inserting a line chart with/without marker options in the spreadsheet', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('insert Line chart without marker', (done: Function) => {
            helper.invoke('selectRange', ['G1:H6']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#line').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
            expect(marker.length).toBe(0);
            helper.invoke('deleteChart');
            done();  
        });
        it('insert Stacked Line chart without marker', (done: Function) => {
            helper.invoke('selectRange', ['G1:H6']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedLine').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
            expect(marker.length).toBe(0);
            helper.invoke('deleteChart');
            done();  
        });
        it('insert 100% Stacked Line chart without marker', (done: Function) => {
            helper.invoke('selectRange', ['G1:H6']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedLine100').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
            expect(marker.length).toBe(0);
            helper.invoke('deleteChart');
            done();  
        });
        it('insert Line chart with marker', (done: Function) => {
            helper.invoke('selectRange', ['G1:H6']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#lineMarker').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
            expect(marker.length).not.toBe(0);
            helper.invoke('deleteChart');
            done();  
        });
        it('insert Stacked Line chart with marker', (done: Function) => {
            helper.invoke('selectRange', ['G1:H6']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedLineMarker').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
            expect(marker.length).not.toBe(0);
            helper.invoke('deleteChart');
            done();  
        });
        it('insert 100% Stacked Line chart with marker', (done: Function) => {
            helper.invoke('selectRange', ['G1:H6']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedLine100Marker').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
            expect(marker.length).not.toBe(0);
            helper.invoke('deleteChart');
            done();  
        });
        it('insert chart using insertChart function with marker : { visible: true}', (done : Function) => {
            helper.invoke('insertChart', [[{ type: 'StackingLine', range: 'D1:E5', markerSettings: { visible: true }}]]);
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
            expect(marker.length).not.toBe(0);
            helper.invoke('deleteChart');
            done();
        });
        it('insert chart using insertChart function with marker: { visible: true, width: 10, height: 10, shape: Diamond }', (done : Function) => {
            helper.invoke('insertChart', [[{ type: 'StackingLine', range: 'D1:E5', markerSettings: { visible: true, size: 10, shape: 'Diamond' }}]]);
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const marker: HTMLCollectionOf<SVGPathElement> = chart.getElementsByTagName("path");
            expect(marker.length).not.toBe(0);
            helper.invoke('deleteChart');
            done();
        });
        it('insert chart using insertChart function with marker: { visible: true, width: 10, height: 10, shape: Diamond, border: { width: 1, color: blue }}', (done : Function) => {
            helper.invoke('insertChart', [[{ type: 'StackingLine', range: 'D1:E5', markerSettings: { visible: true, size: 10, shape: 'Diamond', border: { width: 1, color: 'blue' }}}]]);
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const marker: HTMLCollectionOf<SVGPathElement> = chart.getElementsByTagName("path");
            expect(marker.length).not.toBe(0);
            helper.invoke('deleteChart');
            done();
        });
        it('changing chart type from without marker chart to with marker chart', (done: Function) => {
            helper.invoke('selectRange', ['G1:H6']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedLine100').click();
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Line"]');
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#lineMarker').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
            expect(marker.length).not.toBe(0);
            done();
        });
    });
    describe('insert chart using cell binding', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges:  [{ dataSource: defaultData }] ,rows: [{ index: 1, cells: [{ index: 6, chart: [{ id: 'chart1', type: 'Line', range: 'A1:E8', markerSettings: { visible: true }}, 
            {id: 'chart2', type: 'Line', range: 'A1:E8', markerSettings: { visible: true,  size: 10, shape: 'Diamond' }}, 
            {id: 'chart3', type: 'Line', range: 'A1:E8', markerSettings: { visible: true, border: { width: 1, color: 'blue' } }}] }] }]}]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('using cell binding', (done: Function) => {
            const chart: HTMLElement = document.getElementById('chart1_svg');
            const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
            expect(marker.length).not.toBe(0);
            done();
        })
        it('using cell binding with marker visible, shape', (done: Function) => {
            const chart: HTMLElement = document.getElementById('chart2_svg');
            const marker: HTMLCollectionOf<SVGPathElement> = chart.getElementsByTagName("path");
            expect(marker.length).not.toBe(0);
            done();
        })
        it('using cell binding with marker visible, shape and border', (done: Function) => {
            const chart: HTMLElement = document.getElementById('chart3_svg');
            const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
            expect(marker.length).not.toBe(0);
            done();
        })
    });
    describe('EJ2-832434', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], enableRtl: true }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Issue in chart series and legend when enable rtl set to true', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('insertChart', [[{ type: 'Column', range: 'G2:H5' }]]);
            const chartId: string = `#${spreadsheet.sheets[0].rows[1].cells[6].chart[0].id}`;
            const chart: HTMLElement = spreadsheet.element.querySelector(chartId);
            expect(chart).not.toBeNull();
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.enableRtl).toBeTruthy();
            done();
        })
    });
    describe('EJ2-852097', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ 
                sheets: [{ rows: [
                    { cells: [{ value: 'Heading1' }, { value: 'Heading2'}, { value: 'Heading3'}, { value: 'Heading4'}] },
                    { cells: [{ value: 'Text1' }, { value: '1'}, { value: '2'}, { value: '3'}] },
                    { cells: [{ value: 'Text2' }, { value: '3'}, { value: '6'}, { value: '9'}] },
                    { cells: [{ value: 'Text3' }, { value: '2'}, { value: '4'}, { value: '6'}] }
                ] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Scatter chart X - axis plottings are not ordered with numerical values in a series order', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().insertChart([{ type: "Scatter", range: 'A1:B4' }]);
            let chartId: string = `#${spreadsheet.sheets[0].rows[0].cells[0].chart[0].id}`;
            let chartEle: HTMLElement = spreadsheet.element.querySelector(chartId) as HTMLElement;
            let chart: Chart = getComponent(chartEle, 'chart');
            expect(chart.primaryXAxis['labels'][0]).toBe('Text1');
            expect(chart.primaryXAxis.valueType).toBe("Category");
            expect(chart.primaryXAxis.rangePadding).toBe("Auto");
            expect(chartEle.querySelector(chartId + '0_AxisLabel_0').textContent).toBe('1');
            expect(chartEle.querySelector(chartId + '_chart_legend_translate_g').childElementCount).toEqual(1);
            expect(chartEle.querySelector(chartId + '_chart_legend_g_0').textContent).toBe('Heading2');
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            let target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedColumn').click();
            setTimeout(() => {
                expect(chart.primaryXAxis['labels'][0]).toBe('Text1');
                expect(chartEle.querySelector(chartId + '0_AxisLabel_0').textContent).toBe('Text1');
                helper.getElement('#' + helper.id + '_chart-type-btn').click();
                target = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Scatter"]');
                (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
                helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
                helper.getElement('#scatter').click();
                helper.getElement('#spreadsheetswitch_row_column_chart').click();
                setTimeout(() => {
                    expect(chartEle.querySelector(chartId + '0_AxisLabel_0').textContent).toBe('1');
                    expect(chartEle.querySelector(chartId + '_chart_legend_translate_g').childElementCount).toEqual(3);
                    expect(chartEle.querySelector(chartId + '_chart_legend_g_0').textContent).toBe('Text1');
                    helper.getInstance().insertChart([{ type: "Scatter", range: 'B1:C4' }]);
                    chartId = `#${spreadsheet.sheets[0].rows[0].cells[1].chart[0].id}`;
                    chartEle = spreadsheet.element.querySelector(chartId) as HTMLElement;
                    chart = getComponent(spreadsheet.element.querySelector(chartId) as HTMLElement, 'chart');
                    expect(chart.primaryXAxis.valueType).toBe("Double");
                    expect(chart.primaryXAxis.rangePadding).toBe("Round");
                    helper.getInstance().insertChart([{ type: "Scatter", range: 'B1:D4' }]);
                    chartId = `#${spreadsheet.sheets[0].rows[0].cells[1].chart[1].id}`;
                    chartEle = spreadsheet.element.querySelector(chartId) as HTMLElement;
                    chart = getComponent(spreadsheet.element.querySelector(chartId) as HTMLElement, 'chart');
                    expect(chart.primaryXAxis.valueType).toBe("Double");
                    expect(chart.primaryXAxis.rangePadding).toBe("Round");
                    expect(chartEle.querySelector(chartId + '_chart_legend_translate_g').childElementCount).toEqual(2);
                    expect(chartEle.querySelector(chartId + '_chart_legend_g_0').textContent).toBe('Heading3');
                    done();
                });
            });
        })
    });
    describe('EJ2-858068', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ 
                sheets: [{ rows: [
                    { cells: [{ value: 'A' }, { value: 'B'}] },
                    { cells: [{ value: '7' }, { value: '16'}] },
                    { cells: [{ value: '9' }, { value: '20'}] },
                    { cells: [{ value: '749085' }, { value: '4'}] }
                ] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Plotting point for scatter chart is not visible in UI for large (or) decimal values as expected', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().insertChart([{ type: "Scatter", range: 'A1:B4' }]);
            let chartId: string = `#${spreadsheet.sheets[0].rows[0].cells[0].chart[0].id}`;
            let chartEle: HTMLElement = spreadsheet.element.querySelector(chartId) as HTMLElement;
            let chart: Chart = getComponent(chartEle, 'chart');
            expect(chart.primaryXAxis.edgeLabelPlacement).toBe("Shift");
            done();
        })
    });
    describe('EJ2-858159->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource:  GDPData }],
                    rows: [{ index: 1, cells: [{ index: 6, chart: [{ type: 'Column', range: 'A1:E8' }] }] }],
                    columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }]
                }],
                allowImage: false
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Chart is in selection state and data entry is restricted when allowImage is set to false->', (done: Function) => {
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const inst: Spreadsheet = helper.getInstance();
            inst.element.focus();
            helper.triggerMouseAction('mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 }, chart, chart);
            setTimeout(() => {
                expect(chart.classList.contains('e-ss-overlay-active')).toBeTruthy();
                helper.invoke('selectRange', ['A8']);
                expect(chart.classList.contains('e-ss-overlay-active')).toBeFalsy();
                helper.triggerKeyEvent('keydown', 65);
                expect(helper.getInstance().isEdit).toBeTruthy();
                done();
            });
        });
    });
    describe('EJ2-858143 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert column chart and resize the chart ->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'H2:H10' }]]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                const overlayObj: any = helper.getInstance().serviceLocator.getService('shape') as Overlay;
                expect(overlayObj.originalWidth).toBe(480);
                expect(overlayObj.originalHeight).toBe(290);
                const overlay: HTMLElement = helper.getElementFromSpreadsheet('.e-ss-overlay-active');
                const overlayHgtHanlde: HTMLElement = overlay.querySelector('.e-ss-overlay-b');
                let offset: DOMRect = overlayHgtHanlde.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top }, overlay, overlayHgtHanlde);
                helper.triggerMouseAction('mousemove', { x: offset.left, y: offset.top + 30 }, overlay, overlayHgtHanlde);
                helper.triggerMouseAction('mouseup', { x: offset.left, y: offset.top + 30 }, document, overlayHgtHanlde);
                done();
            });
        });
        it('Undo the resized chart ->', (done: Function) => {
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.style.width).toBe('480px');
            expect(chart.style.height).toBe('320px');
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(chart.style.width).toBe('480px');
                expect(chart.style.height).toBe('290px');
                done();
            });
        });
        it('Redo the resized chart ->', (done: Function) => {
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.style.width).toBe('480px');
            expect(chart.style.height).toBe('290px');
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_redo');
            setTimeout(() => {
                expect(chart.style.width).toBe('480px');
                expect(chart.style.height).toBe('320px');
                done();
            });
        });
    });
    describe('EJ2-866111 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Inserting a chart after hiding some columns, the chart data is not properly updated. ->', (done: Function) => {
            helper.invoke('hideColumn', [3, 4]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].columns[3].hidden).toBeTruthy();
                expect(helper.getInstance().sheets[0].columns[4].hidden).toBeTruthy();
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.getInstance().insertChart([{ type: "Scatter", range: 'A1:B4' }]);
                setTimeout(() => {
                    let chartId: string = `#${spreadsheet.sheets[0].rows[0].cells[0].chart[0].id}`;
                    let chartEle: HTMLElement = spreadsheet.element.querySelector(chartId) as HTMLElement;
                    let chart: Chart = getComponent(chartEle, 'chart');
                    expect(chart.primaryXAxis['labels'][0]).toBe('Casual Shoes');
                    done();
                });
            });
        });
    });
});
