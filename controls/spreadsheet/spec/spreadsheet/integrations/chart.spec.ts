import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { dateData, defaultData, GDPData, productData } from '../util/datasource.spec';
import { CellModel, ChartModel, ExtendedAxisModel, ExtendedChartModel, ExtendedSheet, getColumnsWidth, getFormatFromType, onContentScroll, setCell, SheetModel, Spreadsheet } from '../../../src/index';
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
            expect(ribbonTabObj.selectedItem).toBe(7);
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
            expect(ribbonTabObj.selectedItem).toBe(7);
            done();
        });
        it('select and deselect the chart', (done: Function) => {
            const chartOverlay: HTMLElement = helper.getElementFromSpreadsheet(`#${cell.chart[0].id}`).parentElement;
            const ribbonObj: any = spreadsheet.ribbonModule.ribbon;
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(ribbonObj.selectedTab).toBe(6);
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
            expect(ribbonObj.selectedTab).toBe(6);
            helper.invoke('deselectChart');
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(ribbonObj.selectedTab).toBe(0);
            helper.invoke('insertChart', [[{ type: 'Column', range: 'B1:C11' }]]);
            const chartCell: CellModel = spreadsheet.sheets[0].rows[0].cells[1];
            const chartOverlay1: HTMLElement = helper.getElementFromSpreadsheet(`#${chartCell.chart[0].id}`).parentElement;
            expect(chartOverlay1.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(ribbonObj.selectedTab).toBe(6);
            helper.invoke('selectChart');
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(chartOverlay1.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(ribbonObj.selectedTab).toBe(6);
            helper.invoke('selectRange', ['B1:B1']);
            helper.invoke('selectChart');
            expect(chartOverlay.classList.contains('e-ss-overlay-active')).toBeFalsy();
            expect(chartOverlay1.classList.contains('e-ss-overlay-active')).toBeTruthy();
            expect(ribbonObj.selectedTab).toBe(6);
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
        it('Chart with uncalculated formulas and non auto-detected formatted values in the data range', (done: Function) => {
            const sheet: SheetModel = helper.getInstance().getActiveSheet();
            setCell(0, 9, sheet, { value: 'Sale 1' });
            setCell(0, 10, sheet, { value: 'Sale 2' });
            setCell(1, 9, sheet, { value: '$10' });
            setCell(1, 10, sheet, { value: '$20' });
            setCell(2, 9, sheet, { formula: '=J2+20' });
            setCell(2, 10, sheet, { formula: '=K2+30' });
            setCell(3, 9, sheet, { value: '$30' });
            setCell(3, 10, sheet, { value: '$40' });
            helper.invoke('insertChart', [[{ type: 'Column', range: 'J1:K4', dataLabelSettings: { position: 'Middle', visible: true } }]]);
            const cell: CellModel = sheet.rows[0].cells[9];
            expect(cell.chart.length).toBe(1);
            let chartId: string = cell.chart[0].id;
            let chart: HTMLElement = helper.getElementFromSpreadsheet(`#${chartId}`);
            expect(chart).not.toBeNull();
            expect(chart.querySelector(`#${chartId}_Series_0_Point_0`).getAttribute('aria-label')).toBe('1:10, Sale 1');
            expect(chart.querySelector(`#${chartId}_Series_0_Point_0_Text_0`).textContent).toBe('$10');
            expect(chart.querySelector(`#${chartId}_Series_1_Point_0`).getAttribute('aria-label')).toBe('1:20, Sale 2');
            expect(chart.querySelector(`#${chartId}_Series_1_Point_0_Text_0`).textContent).toBe('$20');
            expect(chart.querySelector(`#${chartId}_Series_0_Point_1`).getAttribute('aria-label')).toBe('2:30, Sale 1');
            expect(chart.querySelector(`#${chartId}_Series_0_Point_1_Text_0`).textContent).toBe('$30');
            expect(chart.querySelector(`#${chartId}_Series_1_Point_1`).getAttribute('aria-label')).toBe('2:50, Sale 2');
            expect(chart.querySelector(`#${chartId}_Series_1_Point_1_Text_0`).textContent).toBe('$50');
            expect(sheet.rows[2].cells[9].value).toBe('30');
            expect(sheet.rows[2].cells[10].value).toBe('50');
            expect(sheet.rows[3].cells[9].format).toBe('$#,##0');
            expect(sheet.rows[3].cells[10].format).toBe('$#,##0');
            helper.invoke('deleteChart', [chartId]);
            setCell(4, 9, sheet, { formula: '=J4+20' });
            setCell(4, 10, sheet, { formula: '=K4+30' });
            helper.invoke('insertChart', [[{ type: 'Column', range: 'J1:K5', dataLabelSettings: { position: 'Middle', visible: true } }]]);
            chartId = cell.chart[0].id;
            chart = helper.getElementFromSpreadsheet(`#${chartId}`);
            expect(chart).not.toBeNull();
            expect(chart.querySelector(`#${chartId}_Series_0_Point_3`).getAttribute('aria-label')).toBe('4:50, Sale 1');
            expect(chart.querySelector(`#${chartId}_Series_0_Point_3_Text_0`).textContent).toBe('$50');
            expect(chart.querySelector(`#${chartId}_Series_1_Point_3`).getAttribute('aria-label')).toBe('4:70, Sale 2');
            expect(chart.querySelector(`#${chartId}_Series_1_Point_3_Text_0`).textContent).toBe('$70');
            done();
        });
        it('Changing number format in the chart range', (done: Function) => {
            const sheet: SheetModel = helper.getInstance().getActiveSheet();
            const cell: CellModel = sheet.rows[0].cells[9];
            const chartId: string = cell.chart[0].id;
            helper.invoke('numberFormat', [getFormatFromType('Scientific'), 'J1:J5']);
            const chart: HTMLElement = helper.getElementFromSpreadsheet(`#${chartId}`);
            expect(chart.querySelector(`#${chartId}_Series_0_Point_0_Text_0`).textContent).toBe('1.00E+01');
            expect(chart.querySelector(`#${chartId}_Series_0_Point_1_Text_0`).textContent).toBe('3.00E+01');
            expect(chart.querySelector(`#${chartId}_Series_0_Point_2_Text_0`).textContent).toBe('3.00E+01');
            expect(chart.querySelector(`#${chartId}_Series_0_Point_3_Text_0`).textContent).toBe('5.00E+01');
            helper.invoke('deleteChart', [chartId]);
            done();
        });
        it('Testing a Line Chart with Markers After Changing the Chart Type from a Pie Chart ->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:F11' }]]);
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            let target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Pie/Doughnut"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#pie').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-accumulationchart');
                expect(chart).not.toBeNull();
                helper.getElement('#' + helper.id + '_chart-type-btn').click();
                const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Line"]');
                helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
                helper.getElement('#lineMarker').click();
                setTimeout(() => {
                    const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                    const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
                    expect(marker.length).not.toBe(0);
                    done();
                });
            });
        });
        it('Testing a Line Chart with Markers after a Pie Chart switch and undo-redo ->', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                helper.click('#spreadsheet_redo');
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
                expect(marker.length).not.toBe(0);
                done();
            });
        });
        it('Testing a Line Chart with Markers after switching from a Pie Chart with multiple charts inserted ->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Bar', range: 'D1:F11' }]]);
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            let target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Pie/Doughnut"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#pie').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-accumulationchart');
                expect(chart).not.toBeNull();
                helper.getElement('#' + helper.id + '_chart-type-btn').click();
                const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Line"]');
                helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
                helper.getElement('#lineMarker').click();
                setTimeout(() => {
                    const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                    const marker: HTMLCollectionOf<SVGEllipseElement> = chart.getElementsByTagName("ellipse");
                    expect(marker.length).not.toBe(0);
                    done();
                });
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
        it('EJ2-943526 - Chart is missing after deleting it and performing an undo action in a duplicated sheet', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'H2:H11', id: 'e_spreadsheet_chart_1' }]]);
            const parentCell: CellModel = helper.getInstance().sheets[0].rows[1].cells[7];
            expect(parentCell.chart[0].range).toBe('Sheet1!H2:H11');
            expect(helper.getElementFromSpreadsheet('#' + parentCell.chart[0].id).classList).toContain('e-chart');
            helper.invoke('duplicateSheet', [0]);
            setTimeout(() => {
                const cell: CellModel = helper.getInstance().sheets[1].rows[1].cells[7];
                const chartId: string = cell.chart[0].id;
                expect(cell.chart[0].range).toBe('Sheet1 (2)!H2:H11');
                expect(parentCell.chart[0].id).not.toEqual(chartId);
                expect(helper.getElementFromSpreadsheet('#' + chartId).classList).toContain('e-chart');
                helper.invoke('deleteChart', [cell.chart[0].id]);
                expect(cell.chart[0]).toBeUndefined();
                expect(helper.getElementFromSpreadsheet('#' + chartId)).toBeNull();
                helper.invoke('undo');
                expect(cell.chart[0].range).toBe('Sheet1 (2)!H2:H11');
                expect(cell.chart[0].id).toEqual(chartId);
                expect(helper.getElementFromSpreadsheet('#' + chartId).classList).toContain('e-chart');
                done();
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
                helper.invoke('selectChart');
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
        it('EJ2-884319 - ### symbol displayed in chart series for time format', (done: Function) => {
            helper.invoke('selectRange', ['G1:H11']);
            helper.invoke('numberFormat', ['h:mm:ss AM/PM', 'G1:H11']);
            helper.edit('G9', '-9');
            helper.edit('G10', '-10');
            helper.edit('G11', '-11');
            helper.edit('H9', '-9');
            helper.edit('H10', '-10');
            helper.edit('H11', '-11');
            helper.invoke('insertChart', [[{ type: 'Scatter', range: 'G1:H11', id: 'e_spreadsheet_chart_11' }]]);
            setTimeout(function () {
                expect(document.getElementById('e_spreadsheet_chart_110_AxisLabel_0').textContent).toBe('12:00:00 AM');
                expect(document.getElementById('e_spreadsheet_chart_111_AxisLabel_0').textContent).toBe('12:00:00 AM');
                expect(document.getElementById('e_spreadsheet_chart_111_AxisLabel_1').textContent).toBe('12:00:00 AM');
                expect(document.getElementById('e_spreadsheet_chart_111_AxisLabel_2').textContent).toBe('12:00:00 AM');
                expect(document.getElementById('e_spreadsheet_chart_111_AxisLabel_3').textContent).toBe('12:00:00 AM');
                expect(document.getElementById('e_spreadsheet_chart_111_AxisLabel_4').textContent).toBe('12:00:00 AM');
                expect(document.getElementById('e_spreadsheet_chart_111_AxisLabel_5').textContent).toBe('12:00:00 AM');
                const chartEle: HTMLElement = document.getElementById('e_spreadsheet_chart_11');
                const target: HTMLElement = document.getElementById('e_spreadsheet_chart_11_Series_0_Point_7');
                helper.triggerMouseAction('mousemove', { x: target.getBoundingClientRect().left, y: target.getBoundingClientRect().top }, chartEle, target);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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
                helper.switchRibbonTab(7);
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('HighContrast');
                done();
            });
        });
        it('Choosing Tailwind3Dark in Chart Theme Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="Tailwind 3 Dark"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Tailwind 3 Dark');
                done();
            }, 20);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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

    describe('Bar UI - Interaction for Gridlines and Legends in Chart Design Tab->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [
                    {
                        height: 30,
                        cells: [
                            {
                                value: 'Gross Domestic Product (in trillions)',
                                style: {
                                    backgroundColor: '#e56590', color: '#fff',
                                    fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle'
                                }
                            }
                        ]
                    },
                    {
                        cells: [
                            { index: 6, chart: [{ range: 'A3:E10' }] }
                        ]
                    }
                ], }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('chart is rendered or not ->', (done: Function) => {
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart).not.toBeNull();
            done();
        });
    }); 
    describe('Bar UI - Interaction for Gridlines and Legends in Chart Design Tab->', () => {
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
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Bar"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#clusteredBar').click();
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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
            helper.switchRibbonTab(7);
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

    describe('966952 - Chart Drag and Drop with Freeze Pane position restore ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }],  frozenRows: 5, frozenColumns: 3 }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Set D6 cell to freeze pane and insert chart at D6:E9', (done: Function) => {
            helper.invoke('selectRange', ['D6:E9']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Column"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#clusteredColumn').click();
            setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].frozenRows).toBe(5);
                expect(spreadsheet.sheets[0].frozenColumns).toBe(3);
                const initialCell = spreadsheet.sheets[0].rows[5].cells[3];
                expect(initialCell.chart).toBeDefined();
                expect(initialCell.chart.length).toBe(1);
                expect(initialCell.chart[0].type).toBe('Column');
                done();
            });
        });
        it('Drag and drop chart from D6 to F6 cell', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            const initialChartId = spreadsheet.sheets[0].rows[5].cells[3].chart[0].id;
            helper.triggerMouseAction('mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 }, chart, chart);
            const targetCell = helper.invoke('getCell', [5, 5]); // F6 cell
            const targetRect = targetCell.getBoundingClientRect();
            helper.triggerMouseAction('mousemove', { x: targetRect.left + 10, y: targetRect.top + 10 }, chart, chart);
            helper.triggerMouseAction('mouseup', { x: targetRect.left + 10, y: targetRect.top + 10 }, document, chart);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[5].cells[3].chart.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[5].cells[5].chart).toBeDefined();
                expect(spreadsheet.sheets[0].rows[5].cells[5].chart.length).toBe(1);
                expect(spreadsheet.sheets[0].rows[5].cells[5].chart[0].id).toBe(initialChartId);
                done();
            });
        });
        it('Drag and drop chart from F6 to F23', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            helper.triggerMouseAction('mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 }, chart, chart);
            const targetCell = helper.invoke('getCell', [22, 5]);
            const targetRect = targetCell.getBoundingClientRect();
            helper.triggerMouseAction('mousemove', { x: targetRect.left + 10, y: targetRect.top + 10 }, chart, chart);
            helper.triggerMouseAction('mouseup', { x: targetRect.left + 10, y: targetRect.top + 10 }, document, chart);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[5].cells[5].chart.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[22].cells[5].chart).toBeDefined();
                expect(spreadsheet.sheets[0].rows[22].cells[5].chart.length).toBe(1);
                done();
            });
        });
        it('Drag and drop chart from F23 to B12', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            helper.triggerMouseAction('mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 }, chart, chart);
            const targetCell = helper.invoke('getCell', [11, 1]);
            const targetRect = targetCell.getBoundingClientRect();
            helper.triggerMouseAction('mousemove', { x: targetRect.left + 10, y: targetRect.top + 10 }, chart, chart);
            helper.triggerMouseAction('mouseup', { x: targetRect.left + 10, y: targetRect.top + 10 }, document, chart);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[22].cells[5].chart.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[11].cells[1].chart).toBeDefined();
                expect(spreadsheet.sheets[0].rows[11].cells[1].chart.length).toBe(1);
                done();
            });
        });

        it('Drag and drop chart from B12 to B2', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            helper.triggerMouseAction('mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 }, chart, chart);
            const targetCell = helper.invoke('getCell', [1, 1]); // B2 cell
            const targetRect = targetCell.getBoundingClientRect();
            helper.triggerMouseAction('mousemove', { x: targetRect.left + 10, y: targetRect.top + 10 }, chart, chart);
            helper.triggerMouseAction('mouseup', { x: targetRect.left + 10, y: targetRect.top + 10 }, document, chart);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[11].cells[1].chart.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[1].cells[1].chart).toBeDefined();
                expect(spreadsheet.sheets[0].rows[1].cells[1].chart.length).toBe(1);
                done();
            });
        });
        it('Drag and drop chart from B2 to F2', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            helper.triggerMouseAction('mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 }, chart, chart);
            const targetCell = helper.invoke('getCell', [1, 5]);
            const targetRect = targetCell.getBoundingClientRect();
            helper.triggerMouseAction('mousemove', { x: targetRect.left + 10, y: targetRect.top + 10 }, chart, chart);
            helper.triggerMouseAction('mouseup', { x: targetRect.left + 10, y: targetRect.top + 10 }, document, chart);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].cells[1].chart.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[1].cells[5].chart).toBeDefined();
                expect(spreadsheet.sheets[0].rows[1].cells[5].chart.length).toBe(1);
                done();
            });
        });
        it('Drag and drop chart from F2 to H6', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            helper.triggerMouseAction('mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 }, chart, chart);
            const targetCell = helper.invoke('getCell', [5, 7]);
            const targetRect = targetCell.getBoundingClientRect();
            helper.triggerMouseAction('mousemove', { x: targetRect.left + 10, y: targetRect.top + 10 }, chart, chart);
            helper.triggerMouseAction('mouseup', { x: targetRect.left + 10, y: targetRect.top + 10 }, document, chart);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].cells[5].chart.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[5].cells[7].chart).toBeDefined();
                expect(spreadsheet.sheets[0].rows[5].cells[7].chart.length).toBe(1);
                done();
            });
        });
        it('Resize chart to height 350px and width 350px', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart).not.toBeNull();
            const overlay: HTMLElement = helper.getElementFromSpreadsheet('.e-ss-overlay-active');
            expect(overlay).not.toBeNull();
            const overlayBottomHandle: HTMLElement = overlay.querySelector('.e-ss-overlay-b');
            let offset: DOMRect = overlayBottomHandle.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top }, overlay, overlayBottomHandle);
            const heightDifference = 60;
            helper.triggerMouseAction('mousemove', { x: offset.left, y: offset.top + heightDifference }, overlay, overlayBottomHandle);
            helper.triggerMouseAction('mouseup', { x: offset.left, y: offset.top + heightDifference }, document, overlayBottomHandle);
            setTimeout(() => {
                const overlayRightHandle: HTMLElement = overlay.querySelector('.e-ss-overlay-r');
                offset = overlayRightHandle.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top }, overlay, overlayRightHandle);
                const widthDifference = -130;
                helper.triggerMouseAction('mousemove', { x: offset.left + widthDifference, y: offset.top }, overlay, overlayRightHandle);
                helper.triggerMouseAction('mouseup', { x: offset.left + widthDifference, y: offset.top }, document, overlayRightHandle);
                setTimeout(() => {
                    expect(chart.style.height).toBe('350px');
                    expect(chart.style.width).toBe('350px');
                    const chartModel = spreadsheet.sheets[0].rows[5].cells[7].chart[0];
                    expect(chartModel.height).toBe(350);
                    expect(chartModel.width).toBe(350);
                    done();
                });
            });
        });
        it('Perform all undo operations in sequence', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.style.width).toBe('480px');
            expect(chart.style.height).toBe('350px');
            helper.click('#spreadsheet_undo');
            expect(chart.style.height).toBe('290px');
            expect(chart.style.width).toBe('480px');
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[5].cells[7].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[1].cells[5].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[1].cells[5].chart.length).toBe(1);
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[1].cells[5].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[1].cells[1].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[1].cells[1].chart.length).toBe(1);
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[1].cells[1].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[11].cells[1].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[11].cells[1].chart.length).toBe(1);
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[11].cells[1].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[22].cells[5].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[22].cells[5].chart.length).toBe(1);
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[22].cells[5].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[5].cells[5].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[5].cells[5].chart.length).toBe(1);
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[5].cells[5].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[5].cells[3].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[5].cells[3].chart.length).toBe(1);
            done();
        });
        it('Perform all redo operations in sequence', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[5].cells[3].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[5].cells[5].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[5].cells[5].chart.length).toBe(1);
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[5].cells[5].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[22].cells[5].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[22].cells[5].chart.length).toBe(1);
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[22].cells[5].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[11].cells[1].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[11].cells[1].chart.length).toBe(1);
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[11].cells[1].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[1].cells[1].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[1].cells[1].chart.length).toBe(1);
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[1].cells[1].chart.length).toBe(0); 
            expect(spreadsheet.sheets[0].rows[1].cells[5].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[1].cells[5].chart.length).toBe(1);
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[1].cells[5].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[5].cells[7].chart).toBeDefined();
            expect(spreadsheet.sheets[0].rows[5].cells[7].chart.length).toBe(1);
            helper.click('#spreadsheet_redo');
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.style.height).toBe('350px');
            helper.click('#spreadsheet_redo');
            expect(chart.style.width).toBe('350px');
            expect(chart.style.height).toBe('350px');
            (spreadsheet.serviceLocator.getService('shape') as Overlay).destroy();
            done();
        });
    });

    describe('994206 - Script error issue->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }], frozenRows: 1, frozenColumns: 1,
                    rows: [{
                        index: 1,
                        cells: [{ index: 2, chart: [{ type: 'Scatter', theme: 'Material', isSeriesInRows: true, range: 'Sheet1!A1:M10', id: 'test_chart_freeze_pane', top: 35, left: 145 }] }]
                    }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('while interacting with charts containing large data points ', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const chart: ChartModel[] = spreadsheet.sheets[0].rows[1].cells[2].chart;
            expect(chart).toBeDefined();
            expect(chart.length).toBe(1);
            expect(chart[0].range).toBe('Sheet1!A1:M10');
            helper.edit('K5', '');
            expect(spreadsheet.sheets[0].rows[4].cells[10].value).toBe('');
            done();
        });
    });
    
    describe('EJ2-883265 -> Testing bar chart with Add chart elements UI interaction->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking Horizontal Axes->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Bar"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#clusteredBar').click();
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Axes"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PHAxes').click();
            setTimeout(() => {
                let chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                let chartEle: HTMLElement = helper.getInstance().element.querySelector(chartId) as HTMLElement;
                let chart: Chart = getComponent(chartEle, 'chart');
                expect(chart.primaryYAxis.labelStyle.size).toBe('0px');
                expect(chart.primaryYAxis.majorTickLines.width).toBe(0);
                done();
            });
        });
        it('Checking Vertical Axes->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Axes"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PVAxes').click();
            setTimeout(() => {
                let chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                let chartEle: HTMLElement = helper.getInstance().element.querySelector(chartId) as HTMLElement;
                let chart: Chart = getComponent(chartEle, 'chart');
                expect(chart.primaryXAxis.labelStyle.size).toBe('0px');
                expect(chart.primaryXAxis.majorTickLines.width).toBe(0);
                done();
            });
        });
        it('Checking Horizontal Title->', (done: Function) => {
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
                setTimeout(() => {
                    let chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                    let chartEle: HTMLElement = helper.getInstance().element.querySelector(chartId) as HTMLElement;
                    let chart: Chart = getComponent(chartEle, 'chart');
                    expect(chart.primaryYAxis.title).toBe("Horizontal");
                    done();
                });
            });
        });
        it('Checking Vertical Title->', (done: Function) => {
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
                setTimeout(() => {
                    let chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                    let chartEle: HTMLElement = helper.getInstance().element.querySelector(chartId) as HTMLElement;
                    let chart: Chart = getComponent(chartEle, 'chart');
                    expect(chart.primaryXAxis.title).toBe("Vertical");
                    done();
                });
            });
        });
        it('Checking Major Horizonatal Gridlines->', (done: Function) => {
            helper.invoke('selectRange', ['G1:H5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Bar"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#stackedBar').click();
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
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
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

    describe('EJ2-884357 -> Chart Design tab not displayed properly on pressing undo button.', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, {}] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Inserting chart then cut and paste the chart in the other sheet->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['D1:E5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#line').click();
            helper.invoke('cut').then(function () {
                const args = { action: 'gotoSheet', eventArgs: { currentSheetIndex: 1, previousSheetIndex: 0 } };
                helper.getInstance().updateAction(args);
                setTimeout((): void => {
                    expect(spreadsheet.activeSheetIndex).toEqual(1);
                    helper.invoke('paste');
                    expect(spreadsheet.sheets[1].rows[0].cells[0].chart[0]).not.toBeUndefined();
                    done();
                });
            });
        });
        it('Delete the chart and perform undo->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.deleteChart()
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(1);
                expect(spreadsheet.sheets[1].rows[0].cells[0].chart[0]).toBeUndefined();
                const args = { action: 'gotoSheet', eventArgs: { currentSheetIndex: 0, previousSheetIndex: 1 } };
                helper.getInstance().updateAction(args);
                setTimeout(() => {
                    helper.switchRibbonTab(1);
                    helper.click('#spreadsheet_undo');
                    setTimeout(() => {
                        expect(spreadsheet.activeSheetIndex).toBe(0);
                        expect(spreadsheet.sheets[1].rows[0].cells[0].chart[0]).not.toBeUndefined();
                        done();
                    });
                });
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
                spreadsheet.insertChart([{ type: 'Scatter', theme: 'Material', range: 'C1:D5', }]);
                setTimeout(() => {
                    const chartId: string = `#${spreadsheet.sheets[0].rows[0].cells[2].chart[0].id}`;
                    const chart: HTMLElement = spreadsheet.element.querySelector(chartId);
                    expect(chart).not.toBeNull();
                    const chartObj: any = getComponent(chart, 'chart');
                    expect(chartObj.series.length).toBe(1);
                    expect(chartObj.series[0].dataModule.dataManager.dataSource.json.length).toBe(4);
                    expect(chartObj.series[0].dataModule.dataManager.dataSource.json[0].x).toBe('11:34:32 AM');
                    expect(chartObj.series[0].dataModule.dataManager.dataSource.json[0].y).toBe(10);
                    expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('11:34:32 AM');
                    expect(chart.querySelector(`${chartId}0_AxisLabel_3`).textContent).toBe('6:23:54 AM');
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
                    expect(chartObj.series[0].dataModule.dataManager.dataSource.json[0].x.toString()).toBe('Sat Jan 20 1900 00:00:00 GMT+0000 (Coordinated Universal Time)');
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
        describe('EJ2-879106', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Chart button is duplicated while disabling and enabling the toolbar items after inserting a chart', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('selectRange', ['D1:E5']);
                helper.switchRibbonTab(2);
                helper.getElement('#' + helper.id + '_chart-btn').click();
                const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
                (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
                helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
                helper.getElement('#line').click();
                spreadsheet.hideToolbarItems('Insert', [0, 1, 2, 3], true);
                spreadsheet.hideToolbarItems('Formulas', [0], true);
                spreadsheet.hideToolbarItems(
                    'Home',
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
                    ],
                    true
                );
                spreadsheet.enableRibbonTabs(['Data', 'Formulas', 'Insert'], false);
                spreadsheet.enableRibbonTabs(['Home', 'View'], true);
                spreadsheet.allowEditing = false;
                spreadsheet.enableContextMenu = false;
                done();
            });
            it('Check whether chart dropdown button is duplicated or not', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.hideToolbarItems('Data', [0, 1, 2], true);
                spreadsheet.hideToolbarItems('Data', [3], false);
                spreadsheet.hideToolbarItems('Insert', [0, 1, 2, 3], false);
                spreadsheet.hideToolbarItems('Formulas', [0], false);
                spreadsheet.hideToolbarItems(
                    'Home',
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
                    ],
                    false
                );
                spreadsheet.enableRibbonTabs(['Data', 'Formulas', 'Insert'], true);
                spreadsheet.allowEditing = true;
                spreadsheet.enableContextMenu = true;
                helper.switchRibbonTab(2);
                expect(document.querySelectorAll('.e-chart-icon').length).toBe(1);
                done();
            });
        });
        describe('EJ2-957830 -> Chart design properties not updating correctly when selecting different charts', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Insert chart and apply Material 3 Dark theme from dropdown', (done: Function) => {
                helper.invoke('selectRange', ['A1:D5']);
                helper.switchRibbonTab(2);
                helper.getElement('#' + helper.id + '_chart-btn').click();
                const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
                (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
                helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
                helper.getElement('#line').click();
                helper.switchRibbonTab(7);
                helper.getElement('#' + helper.id + '_chart_theme').click();
                helper.getElement('.e-item[aria-label="Material 3 Dark"]').click();
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Material 3 Dark');
                    done();
                }, 10);
            });
            it('Insert chart and apply Fluent 2 Dark theme->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.insertChart([{ type: "Column", range: 'G1:H11' }]);
                helper.switchRibbonTab(7);
                helper.getElement('#' + helper.id + '_chart_theme').click();
                helper.getElement('.e-item[aria-label="Fluent 2 Dark"]').click();
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Fluent 2 Dark');
                    done();
                }, 10);
            });
            it('Switch chart and apply Fabric theme ->', (done: Function) => {
                helper.invoke('selectRange', ['A1']);
                helper.invoke('selectChart');
                helper.switchRibbonTab(7);
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Material 3 Dark');
                helper.getElement('#' + helper.id + '_chart_theme').click();
                helper.getElement('.e-item[aria-label="Fabric"]').click();
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Fabric');
                    done();
                }, 10);
            });
            it('Switch chart and apply Bootstrap theme->', (done: Function) => {
                helper.invoke('selectRange', ['G1']);
                helper.invoke('selectChart');
                helper.switchRibbonTab(7);
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Fluent 2 Dark');
                helper.getElement('#' + helper.id + '_chart_theme').click();
                helper.getElement('.e-item[aria-label="Bootstrap"]').click();
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Bootstrap');
                    done();
                }, 10);
            });
        });
        describe('EJ2-896138 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        ranges: [{ dataSource: defaultData }], rows: [{
                            index: 0, cells: [{
                                index: 6, chart: [{ type: 'Pie', range: 'A1:E8', top: 50, left: 20 },
                                { type: 'Column', range: 'H7:J10', top: 60, left: 25 },
                                { type: 'Bar', range: 'E5:H9', top: 70, left: 30 },
                                { type: 'Line', range: 'H7:J10', top: 80, left: 100 }]
                            }]
                        }]
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Handle the script error occurs when rendering multiple charts in a different cell due to their top and left properties. ->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[6].chart.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[2].cells[0].chart.length).toBe(1);
                expect(spreadsheet.sheets[0].rows[3].cells[0].chart.length).toBe(2);
                expect(spreadsheet.sheets[0].rows[4].cells[1].chart.length).toBe(1);
                done();
            });
        });
        describe('EJ2-947846 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        ranges: [{ dataSource: productData }],
                        rows: [
                            { index: 1, cells: [{ index: 1, chart: [{ id: 'chart1', type: 'Line', range: 'A1:F75', markerSettings: { visible: true } }] }] },
                            { index: 53, cells: [{ index: 6, formula: '=SUM(A51:A54)' }] },
                            { index: 54, cells: [{ index: 6, formula: '=SUM(A51:A54)' }] }
                        ]
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Spreadsheet became unresponsive when rendering a chart with a large data range and scrolling', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[1].chart.length).toBe(1);
                helper.invoke('goTo', ['A55']);
                spreadsheet.notify(onContentScroll, { scrollTop: 1080, scrollLeft: 0 });
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toEqual('A55');
                    helper.invoke('goTo', ['A1']);
                    setTimeout(() => {
                        //expect(spreadsheet.sheets[0].paneTopLeftCell).toEqual('A1');
                        done();
                    }, 20);
                }, 20);
            });
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
    describe('Provide Canvas rendering support for charts with large datasets', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }],
                actionBegin(args: any) {
                    if (args.action === 'beforeInsertChart') {
                        if (args.args.eventArgs) { args.args.eventArgs.enableCanvas = true; }
                    }
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert Column chart using UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['A1:CX51']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Column"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#clusteredColumn').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.querySelector('canvas')).not.toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[0].chart[0].enableCanvas).toBeTruthy();
            helper.invoke('deleteChart');
            done();
        });
        it('Insert Column chart using insertChart method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:CZ51'}]]);
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.querySelector('canvas')).not.toBeNull();
            helper.invoke('deleteChart');
            done();
        });
        it('Insert Bar chart using UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['A1:CX51']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Bar"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#clusteredBar').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.querySelector('canvas')).not.toBeNull();
            helper.invoke('deleteChart');
            done();
        });
        it('Insert Bar chart using insertChart method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Bar', range: 'D1:CZ51'}]]);
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.querySelector('canvas')).not.toBeNull();
            helper.invoke('deleteChart');
            done();
        });
        it('Insert Area chart using UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['A1:CX51']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Area"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#area').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.querySelector('canvas')).not.toBeNull();
            helper.invoke('deleteChart');
            done();
        });
        it('Insert Area chart using insertChart method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Area', range: 'D1:CZ51'}]]);
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.querySelector('canvas')).not.toBeNull();
            helper.invoke('deleteChart');
            done();
        });
        it('Insert Line chart using UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['A1:CX51']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#line').click();
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.querySelector('canvas')).not.toBeNull();
            helper.invoke('deleteChart');
            done();
        });
        it('Insert Line chart using insertChart method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Line', range: 'D1:CZ51' }]]);
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart.querySelector('canvas')).not.toBeNull();
            helper.invoke('deleteChart');
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
        let spreadsheet: Spreadsheet; let sheet: SheetModel;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }], columns: [{ index: 3, hidden: true }, { hidden: true }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Inserting a chart after hiding some columns, the chart data is not properly updated. ->', (done: Function) => {
            sheet = helper.getInstance().sheets[0];
            expect(sheet.columns[3].hidden).toBeTruthy();
            expect(sheet.columns[4].hidden).toBeTruthy();
            spreadsheet = helper.getInstance();
            spreadsheet.insertChart([{ type: 'Scatter', range: 'A1:B4' }]);
            setTimeout(() => {
                let chartId: string = `#${spreadsheet.sheets[0].rows[0].cells[0].chart[0].id}`;
                let chartEle: HTMLElement = spreadsheet.element.querySelector(chartId) as HTMLElement;
                let chart: any = getComponent(chartEle, 'chart');
                expect(chart.primaryXAxis['labels'][0]).toBe('Casual Shoes');
                done();
            });
        });
        it('Inserting a chart after the hidden row and column ->', (done: Function) => {
            helper.invoke('hideRow', [1, 1]);
            setTimeout(() => {
                expect(sheet.rows[1].hidden).toBeTruthy();
                spreadsheet.insertChart([{ type: 'Column', range: 'F1:G5' }]);
                setTimeout(() => {
                    let cell: HTMLElement = spreadsheet.getCell(0, 2);
                    expect(cell.classList).toContain('e-rcborderright');
                    cell = spreadsheet.getCell(0, 5);
                    expect(cell.classList).toContain('e-rcborderbottom');
                    expect(cell.classList).toContain('e-bcborderbottom');
                    cell = spreadsheet.getCell(0, 6);
                    expect(cell.classList).toContain('e-rcborderright');
                    expect(cell.classList).toContain('e-rcborderbottom');
                    expect(cell.classList).toContain('e-bcborderbottom');
                    cell = spreadsheet.getCell(2, 2);
                    expect(cell.classList).toContain('e-bcborderright');
                    cell = spreadsheet.getCell(2, 6);
                    expect(cell.classList).toContain('e-bcborderright');
                    cell = spreadsheet.getCell(3, 2);
                    expect(cell.classList).toContain('e-bcborderright');
                    cell = spreadsheet.getCell(3, 6);
                    expect(cell.classList).toContain('e-bcborderright');
                    cell = spreadsheet.getCell(4, 2);
                    expect(cell.classList).toContain('e-bcborderright');
                    cell = spreadsheet.getCell(4, 5);
                    expect(cell.classList).toContain('e-bcborderbottom');
                    cell = spreadsheet.getCell(4, 6);
                    expect(cell.classList).toContain('e-bcborderright');
                    expect(cell.classList).toContain('e-bcborderbottom');
                    done();
                });
            });
        });
    });
    describe('EJ2-867926 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Handle Chart element positions and model values properly while filtering ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            setTimeout(() => {
                helper.invoke('insertChart', [[{ type: 'Column', range: 'H5:H10' }]]);
                expect(spreadsheet.sheets[0].rows[4].cells[7].chart.length).toBe(1);
                spreadsheet.applyFilter();
                spreadsheet.applyFilter([{ field: 'A', predicate: 'and', operator: 'notequal', value: 'Casual Shoes' }, { field: 'A', predicate: 'and', operator: 'notequal', value: 'Sports Shoes' }]);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[6].cells[7].chart.length).toBe(1);
                    expect(spreadsheet.sheets[0].rows[4].cells[7].chart.length).toBe(0);
                    helper.invoke('clearFilter');
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[4].cells[7].chart.length).toBe(1);
                        expect(spreadsheet.sheets[0].rows[6].cells[7].chart.length).toBe(0);
                        done();
                    });
                });
            });
        });
        it('Handle Chart element positions and model values properly while hiding rows and columns ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[4].cells[7].chart.length).toBe(1);
                helper.invoke('hideRow', [0, 1]);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[6].cells[7].chart.length).toBe(1);
                    expect(spreadsheet.sheets[0].rows[4].cells[7].chart.length).toBe(0);
                    helper.invoke('hideRow', [0, 1, false]);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[4].cells[7].chart.length).toBe(1);
                        expect(spreadsheet.sheets[0].rows[6].cells[7].chart.length).toBe(0);
                        helper.invoke('hideColumn', [2, 2]);
                        setTimeout(() => {
                            expect(spreadsheet.sheets[0].rows[4].cells[8].chart.length).toBe(1);
                            expect(spreadsheet.sheets[0].rows[4].cells[7].chart.length).toBe(0);
                            helper.invoke('hideColumn', [2, 2, false]);
                            setTimeout(() => {
                                expect(spreadsheet.sheets[0].rows[4].cells[7].chart.length).toBe(1);
                                expect(spreadsheet.sheets[0].rows[4].cells[8].chart.length).toBe(0);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
    describe('EJ2-879107, EJ2-883259 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ index: 1, cells: [{ index: 6, chart: [{ type: 'Pie', range: 'A1:E8', top: 80, left: 20 }] }] }],
                    columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Handle Chart model when position top and left is given ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[1].cells[6].chart.length).toBe(0);
            expect(spreadsheet.sheets[0].rows[4].cells[0].chart.length).toBe(1);
            setTimeout(() => {
                helper.invoke('insertChart', [[{ type: 'Column', range: 'H5:H10', top: 100, left: 50 }]]);
                expect(spreadsheet.sheets[0].rows[4].cells[7].chart).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[5].cells[0].chart.length).toBe(1);
                done();
            });
        });
        it('Label position mismatch in spreadsheet when compared to Excel for negative values ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.edit('I1', 'Negative Values'); helper.edit('I2', '-10');
            helper.edit('I3', '50'); helper.edit('I4', '-10'); helper.edit('I5', '32');
            helper.edit('I6', '45'); helper.edit('I7', '-29');
            helper.invoke('insertChart', [[{ type: 'Column', range: 'I1:I7' }]]);
            expect(spreadsheet.sheets[0].rows[0].cells[8].chart.length).toBe(1);
            let chartId: string = `#${spreadsheet.sheets[0].rows[0].cells[8].chart[0].id}`;
            let chartEle: HTMLElement = spreadsheet.element.querySelector(chartId) as HTMLElement;
            let chart: Chart = getComponent(chartEle, 'chart');
            expect(chart.primaryXAxis['crossesAt']).toBe(0);
            expect(chartEle.querySelector(chartId + '0_AxisLabel_0').textContent).toBe('1');
            expect(spreadsheet.sheets[0].rows[5].cells[0].chart.length).toBe(1);
            chartId = `#${spreadsheet.sheets[0].rows[5].cells[0].chart[0].id}`;
            chartEle = spreadsheet.element.querySelector(chartId) as HTMLElement;
            chart = getComponent(chartEle, 'chart');
            expect(chart.primaryXAxis['crossesAt']).toBe(0);
            done();
        });
    });
    describe('Testing chart with single row and single column cases ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    rows: [
                        { cells: [{ index: 10, value: '12' }] }, { cells: [{ index: 10, value: '10' }] }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking Delete chart method with empty arguments and without inserting chart->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.deleteChart();
            done();
        });
        it('Insert chart with isSingleCol value set as true->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['E11:E15']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#line').click();
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[10].cells[4].chart.length).toBe(1);
                done();
            });
        });
        it('Insert chart with isSinglerow value set as true->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['I2:K2']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#line').click();
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].cells[8].chart.length).toBe(1);
                done();
            });
        });
    });
    describe('Testing chart by providing chart titles ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    rows: [
                        { cells: [{ index: 10, value: '12' }] }, { cells: [{ index: 10, value: '10' }] }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Add Chart Title for accumulation charts ->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Pie/Doughnut"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#pie').click();
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
                    expect(helper.getInstance().sheets[0].rows[0].cells[3].chart[0].title).toBe('Chart');
                    done();
                });
            });
        });
    });
    describe('Testing chart by swichinng different chart themes ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Choosing Fluent 2 Dark in Chart Theme Dropdown->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertChart([{ type: "Scatter", range: 'A1:B4' }]);
            helper.switchRibbonTab(7);
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="Fluent 2 Dark"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Fluent 2 Dark');
                done();
            }, 20);
        });
        it('Choosing Material 3 Dark in Chart Theme Dropdown->', (done: Function) => {
            helper.switchRibbonTab(7);
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="Material 3 Dark"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Material 3 Dark');
                done();
            }, 20);
        });
    });
    describe('Testing chart by switching the chart rows and column ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Switch row and column->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertChart([{ type: "Column", range: 'A1:H3' }]);
            let cell: CellModel = spreadsheet.sheets[0].rows[0].cells[0];
            expect(cell.chart[0].isSeriesInRows).toBeTruthy();
            helper.switchRibbonTab(7);
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            expect(cell.chart[0].isSeriesInRows).toBeFalsy();
            expect(cell.chart[0].type === 'Column').toBeTruthy();
            done();
        });
        it('Add chart and verify isSeriesInRows property across sheet navigation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('.e-add-sheet-tab');
            helper.click('.e-add-sheet-tab');
            setTimeout(() => {
                (document.querySelectorAll('.e-sheet-tab .e-toolbar-item')[0] as HTMLElement).click();
                const chartAfterNavigation: ChartModel = spreadsheet.sheets[0].rows[0].cells[0].chart[0];
                expect(chartAfterNavigation).toBeDefined();
                expect(chartAfterNavigation.isSeriesInRows).toBeFalsy();
                done();
            }, 500);
        });
    });
    describe('Testing chart by switching the chart rows and column - Pie chart ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Switch row and column->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertChart([{ type: "Pie", range: 'D1:H11' }]);
            helper.switchRibbonTab(7);
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            let cell: CellModel = spreadsheet.sheets[0].rows[0].cells[3];
            expect(cell.chart[0].type === 'Pie').toBeTruthy();
            done();
        });
    });
    describe('Testing chart by selected the entire cell ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Select all with entire cell applied', (done: Function) => {
            helper.invoke('selectRange', ['C3']);
            const selectAl: HTMLElement = helper.getElement('#' + helper.id + '_select_all');
            helper.triggerMouseAction('mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null, selectAl);
            helper.triggerMouseAction('mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document, selectAl);
            setTimeout((): void => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].selectedRange).toBe('A1:CV100');
                done();
            }, 100);
        }); 
        it('Selected the entire cell and Create the chart', (done: Function) => {
            helper.getInstance().insertChart([{ type: "Column", range: null }]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
    });

    describe('EJ2-877764 , EJ2-877488 - Scatter chart with different formatted text in multiple columns ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert Chart with Accounting Number Formatting->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5'])
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Accounting').click();
            helper.invoke('insertChart', [[{ type: 'Scatter', range: 'D1:E5' }]]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
        it('Insert Chart with Currency Number Formatting->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5'])
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Currency').click();
            helper.invoke('insertChart', [[{ type: 'Scatter', range: 'D1:E5' }]]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
        it('Insert Chart with Percentage Number Formatting->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5'])
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
        it('Insert Chart with Fraction Number Formatting->', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5'])
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Fraction').click();
            helper.invoke('insertChart', [[{ type: 'Scatter', range: 'D1:E5' }]]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                helper.triggerKeyNativeEvent(46);
                done();
            });
        });
    });
    describe('Chart elements not restored correctly after undo action on deleted chart ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Adding Chart Title ->', (done: Function) => {
            helper.invoke('selectRange', ['D1:H11']);
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
                input.value = 'Clustered Column Chart';
                helper.click('.e-title-dlg .e-primary');
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-chart-focused')[1].textContent).toBe('Clustered Column Chart');
                    done();
                });
            });
        });
        it('Adding Chart Horizontal Title->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Axis Title"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PHAxisTitle').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-title-dlg.e-dialog')
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-title-dlg .e-dlg-content .e-input') as HTMLInputElement;
                input.value = 'Purchase Details';
                helper.click('.e-title-dlg .e-primary');
                done();
            });
        });
        it('Adding Chart Vertical Title->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Axis Title"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PVAxisTitle').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-title-dlg.e-dialog')
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-title-dlg .e-dlg-content .e-input') as HTMLInputElement;
                input.value = 'Price Details';
                helper.click('.e-title-dlg .e-primary');
                done();
            });
        });
        it('Applying Inside End Data Labels->', (done: Function) => {
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
        it('Apply Bottom Legend settings->', (done: Function) => {
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
        it('Performing undo action after deleting the chart', (done: Function) => {
            helper.invoke('deleteChart');
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                expect(document.getElementsByClassName('e-chart-focused')[1].textContent).toBe('Clustered Column Chart');
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    const chartCell: ChartModel = spreadsheet.sheets[0].rows[0].cells[3].chart[0];
                    expect(chartCell.title).toBe('Clustered Column Chart');
                    expect(chartCell.dataLabelSettings.position).toBe('Top');
                    expect(chartCell.legendSettings.position).toBe('Bottom');
                    expect(chartCell.primaryXAxis.title).toBe('Purchase Details');
                    expect(chartCell.primaryXAxis.minorGridLines.width).toBe(1);
                    expect(chartCell.primaryYAxis.title).toBe('Price Details');
                    expect(chartCell.primaryYAxis.minorGridLines.width).toBe(1);
                    done();
                });
            });
        });
    });

    describe('EJ2-883261 - Unable to add axis title when both primary and horizontal axes are hidden ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Inserting chart and hiding horizontal axes ->', (done: Function) => {
            helper.invoke('selectRange', ['D1:H11']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Column"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#clusteredColumn').click();
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Axes"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PHAxes').click();
            setTimeout(() => {
                let chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                let chartEle: HTMLElement = helper.getInstance().element.querySelector(chartId) as HTMLElement;
                let chart: Chart = getComponent(chartEle, 'chart');
                expect(chart.primaryXAxis.labelStyle.size).toBe('0px');
                expect(chart.primaryXAxis.majorTickLines.width).toBe(0);
                done();
            });
        });
        it('Hiding Vertical Axes->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Axes"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PVAxes').click();
            setTimeout(() => {
                let chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                let chartEle: HTMLElement = helper.getInstance().element.querySelector(chartId) as HTMLElement;
                let chart: Chart = getComponent(chartEle, 'chart');
                expect(chart.primaryYAxis.labelStyle.size).toBe('0px');
                expect(chart.primaryYAxis.majorTickLines.width).toBe(0);
                done();
            });
        });
        it('Adding Chart Horizontal Title->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Axis Title"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PHAxisTitle').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-title-dlg.e-dialog')
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-title-dlg .e-dlg-content .e-input') as HTMLInputElement;
                input.value = 'Purchase Details';
                helper.click('.e-title-dlg .e-primary');
                setTimeout(() => {
                    let chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                    let chartEle: HTMLElement = helper.getInstance().element.querySelector(chartId) as HTMLElement;
                    let chart: Chart = getComponent(chartEle, 'chart');
                    expect(chart.primaryXAxis.title).toBe('Purchase Details');
                    done();
                });
            });
        });
        it('Adding Chart Vertical Title->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item[aria-label="Axis Title"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PVAxisTitle').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-title-dlg.e-dialog')
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-title-dlg .e-dlg-content .e-input') as HTMLInputElement;
                input.value = 'Price Details';
                helper.click('.e-title-dlg .e-primary');
                setTimeout(() => {
                    let chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                    let chartEle: HTMLElement = helper.getInstance().element.querySelector(chartId) as HTMLElement;
                    let chart: Chart = getComponent(chartEle, 'chart');
                    expect(chart.primaryYAxis.title).toBe('Price Details');
                    done();
                });
            });
        });
        it('Performing undo action after adding chart title', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            const chartCell: ChartModel = helper.getInstance().sheets[0].rows[0].cells[3].chart[0];
            setTimeout(() => {
                expect(chartCell.primaryYAxis.title).toBeUndefined();
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(chartCell.primaryXAxis.title).toBeUndefined();
                    done();
                });
            });
        });
        it('Performing undo action after hiding axes', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            const chartCell: ChartModel = helper.getInstance().sheets[0].rows[0].cells[3].chart[0];
            setTimeout(() => {
                expect((chartCell.primaryYAxis as ExtendedAxisModel).labelStyle.size).toBe('12px');
                expect((chartCell.primaryYAxis as ExtendedAxisModel).majorTickLines.width).toBe(1);
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect((chartCell.primaryXAxis as ExtendedAxisModel).labelStyle.size).toBe('12px');
                    expect((chartCell.primaryXAxis as ExtendedAxisModel).majorTickLines.width).toBe(1);
                    done();
                });
            });
        });
        it('Inserting chart using public method with primary axis visible false', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'E1:F5', primaryXAxis: { visible: false }, primaryYAxis: { visible: false } }]]);
            let chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[4].chart[0].id}`;
            let chartEle: HTMLElement = helper.getInstance().element.querySelector(chartId) as HTMLElement;
            let chart: Chart = getComponent(chartEle, 'chart');
            expect(chart.primaryXAxis.labelStyle.size).toBe('0px');
            expect(chart.primaryXAxis.majorTickLines.width).toBe(0);
            expect(chart.primaryYAxis.labelStyle.size).toBe('0px');
            expect(chart.primaryYAxis.majorTickLines.width).toBe(0);
            done();
        });
    });

    describe('EJ2-953213 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Chart model not updated after deleting the columns', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertChart([{ type: 'Column', theme: 'Material', range: 'F1:H11', }]);
            expect(spreadsheet.sheets[0].rows[0].cells[5].chart.length).toBe(1);
            expect(spreadsheet.sheets[0].rows[0].cells[5].chart[0].type).toBe('Column');
            expect(spreadsheet.sheets[0].rows[0].cells[5].chart[0].theme).toBe('Material');
            helper.invoke('selectRange', ['C1']);
            helper.openAndClickCMenuItem(0, 2, [7], null, true);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[0].cells[4].chart.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[0].cells[5].chart.length).toBe(1);
                expect(spreadsheet.sheets[0].rows[0].cells[5].chart[0].type).toBe('Column');
                expect(spreadsheet.sheets[0].rows[0].cells[5].chart[0].theme).toBe('Material');
                done();
            });
        });
        it('Chart model not updated after inserting the columns', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[0].cells[5].chart.length).toBe(1);
            expect(spreadsheet.sheets[0].rows[0].cells[5].chart[0].type).toBe('Column');
            expect(spreadsheet.sheets[0].rows[0].cells[5].chart[0].theme).toBe('Material');
            helper.invoke('selectRange', ['C1']);
            helper.openAndClickCMenuItem(0, 2, [6, 2], false, true);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[0].cells[6].chart.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[0].cells[5].chart.length).toBe(1);
                expect(spreadsheet.sheets[0].rows[0].cells[5].chart[0].type).toBe('Column');
                expect(spreadsheet.sheets[0].rows[0].cells[5].chart[0].theme).toBe('Material');
                done();
            });
        });
        it('Apply freezepane with chart', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('freezePanes', [3, 2]);
            setTimeout(() => {
                spreadsheet.insertChart([{ type: 'Column', theme: 'Material', range: 'G1:H11', }]);
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                const overlayObj: any = spreadsheet.serviceLocator.getService('shape') as Overlay;
                expect(overlayObj.originalWidth).toBe(480);
                expect(overlayObj.originalHeight).toBe(290);
                const overlay: HTMLElement = helper.getElementFromSpreadsheet('.e-ss-overlay-active');
                const overlayHgtHanlde: HTMLElement = overlay.querySelector('.e-ss-overlay-b');
                let offset: DOMRect = overlayHgtHanlde.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top }, overlay, overlayHgtHanlde);
                helper.triggerMouseAction('mousemove', { x: offset.left, y: offset.top + 30 }, overlay, overlayHgtHanlde);
                helper.triggerMouseAction('mouseup', { x: offset.left, y: offset.top + 30 }, document, overlayHgtHanlde);
                (spreadsheet.serviceLocator.getService('shape') as Overlay).destroy();
                done();
            });
        });
        it('Deleting chart within the Apply freezepane', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const chartId: string = spreadsheet.sheets[0].rows[0].cells[6].chart[0].id;
            const chart: ExtendedChartModel = spreadsheet.chartColl.find((model: ChartModel) => model.id === chartId);
            expect(chart.address[0]).toBe(0);
            expect(chart.address[1]).toBe(6);
            delete chart.address;
            helper.invoke('deleteChart', [chartId]);
            expect(spreadsheet.sheets[0].rows[0].cells[6].chart.length).toBe(0);
            expect(document.getElementById(chart.id + '_overlay')).toBeNull();
            done();
        });
    });

    describe('Clear All for chart ->', () => {
        let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert Chart->', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['G1:H6']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Bar"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedBar').click();
            setTimeout(() => {
                helper.switchRibbonTab(1);
                done();
            });
        });
        it('Check Chart->', (done: Function) => {
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                expect(helper.invoke('getCell', [1, 7]).textContent).toBe('10');
                helper.invoke('selectRange', ['C1']);
                done();
            });
        });
        it('Select All->', (done: Function) => {
            setTimeout(() => {
                const selectAl: HTMLElement = helper.getElement('#' + helper.id + '_select_all');
                helper.triggerMouseAction('mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null, selectAl);
                helper.triggerMouseAction('mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document, selectAl);
                helper.switchRibbonTab(1);
                done();
            });
        });
        it('Clear all', (done: Function) => {
            setTimeout(() => {
                helper.click('#spreadsheet_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(1)');
                done();
            });
        });
        it('Undo action', (done: Function) => {
            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('');
            setTimeout(() => {
                helper.click('#spreadsheet_undo');
                done();
            });
        });
        it('Redo check', (done: Function) => {
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 7]).textContent).toBe('10');
                helper.click('#spreadsheet_redo');
                done();
            });
        });
        it('Value Check', (done: Function) => {
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 7]).textContent).toBe('');
                expect(document.getElementById('e_spreadsheet_chart_868_Series_1_Point_4')).toBeNull();
                done();
            }, 30);
        });
    });

    describe('EJ2-914951, EJ2-914955 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Exception occur while trying to change the chart type in the duplicate sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertChart([{ type: "Column", range: 'D1:H11', id: 'Custom_Chart' }]);
            let chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart).not.toBeNull();
            expect(chart.id).toBe('Custom_Chart_overlay');
            let td: HTMLElement = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            let coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.left, y: coords.top }, null, td);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.click('#' + helper.id + '_contextmenu li:nth-child(3)');
            setTimeout(() => {
                expect(spreadsheet.sheets[1].name.toString()).toBe('Sheet1 (2)');
                expect(spreadsheet.activeSheetIndex).toBe(1);
                helper.invoke('selectChart');
                helper.getElement('#' + helper.id + '_chart-type-btn').click();
                const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Pie/Doughnut"]');
                (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
                helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
                helper.getElement('#pie').click();
                setTimeout(() => {
                    chart = helper.getElement().querySelector('.e-accumulationchart');
                    expect(chart).not.toBeNull();
                    done();
                });
            });
        });
         it('Exception occurs while deleting the chart inserted sheet after inserting a duplicate sheet.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.goTo('Sheet1!A1')
            setTimeout(() => {
                let chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(spreadsheet.activeSheetIndex).toBe(0);
                expect(chart).not.toBeNull();
                expect(chart.id).toBe('Custom_Chart_overlay');
                let td: HTMLElement = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.left, y: coords.top }, null, td);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(2)');
                helper.setAnimationToNone('.e-delete-sheet-dlg.e-dialog');
                helper.click('.e-delete-sheet-dlg .e-primary');
                setTimeout(() => {
                    expect(spreadsheet.activeSheetIndex).toBe(0);
                    expect(spreadsheet.sheets[0].name).toBe('Sheet1 (2)');
                    chart = helper.getElement().querySelector('.e-accumulationchart');
                    expect(chart).not.toBeNull();
                    expect(chart.id).not.toEqual('Custom_Chart');
                    expect(chart.id).toContain('Custom_Chart');
                    done();
                });
            });
        });
        it('EJ2-871101 - Chart range selection not properly working when virtualization is used', (done: Function) => {
            helper.invoke('copy', ['A1:B2']).then(() => {
                helper.invoke('paste', ['AH3']);
                expect(helper.getInstance().sheets[0].rows[2].cells[33].value).toEqual('Item Name');
                expect(helper.getInstance().sheets[0].rows[2].cells[34].value).toEqual('Date');
                expect(helper.getInstance().sheets[0].rows[3].cells[33].value).toEqual('Casual Shoes');
                expect(helper.getInstance().sheets[0].rows[3].cells[34].value).toEqual(41684);
                helper.invoke('insertChart', [[{ type: 'Column', range: 'AH3:AI4', id: 'e_spreadsheet_chart_10' }]]);
                setTimeout(function () {
                    expect(helper.getInstance().sheets[0].rows[2].cells[33].chart[0].id).toBe('e_spreadsheet_chart_10');
                    expect(helper.invoke('getCell', [2, 33]).className).toBe('e-cell e-rcborderright e-vcborderbottom');
                    expect(helper.invoke('getCell', [3, 34]).className).toBe('e-cell e-right-align e-bcborderright e-bcborderbottom');
                    expect(helper.invoke('getCell', [2, 33]).className).toBe('e-cell e-rcborderright e-vcborderbottom');
                    expect(helper.invoke('getCell', [3, 34]).className).toBe('e-cell e-right-align e-bcborderright e-bcborderbottom');
                    done();
                });
            });
        });
    });

    describe('EJ2-844826 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Script error occurs when adding chart element after deleting columns', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertChart([{ type: "Column", range: 'G1:H11', id: 'Custom_Chart' }]);
            let chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart).not.toBeNull();
            expect(chart.id).toBe('Custom_Chart_overlay');
            helper.invoke('selectRange', ['G1:H11']);
            let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[6];
            let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.click('#' + helper.id + '_contextmenu li:nth-child(7)');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[0].cells[6]).toBeUndefined();
                chart = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
    });

    describe('EJ2-967471, Migrate chart properties from the cell model to the sheet model during import ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking sheet chart update to cells during import action', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            const sheet: ExtendedSheet = spreadsheet.sheets[0];
            const chart: ExtendedChartModel[] = [
                { type: 'Column', theme: 'Material', range: 'A1:C3', address: [0,0] },
                { type: 'Column', theme: 'Material', range: 'A1:C11', address: [0,0] },
                { type: 'Bar', theme: 'Material', range: 'D1:E6', address: [0,3] },
                { type: 'Area', range: 'F1:G6', id: 'chart_3', address: [0,5] }];
            spreadsheet.setSheetPropertyOnMute(sheet, 'chartColl', chart);
            spreadsheet.workbookChartModule.updateChartsFromSheet();
            expect(sheet.rows[0].cells[0].chart[0]).not.toBeUndefined();
            expect(sheet.rows[0].cells[0].chart[1]).not.toBeUndefined();
            expect(sheet.rows[0].cells[3].chart[0]).not.toBeUndefined();
            expect(sheet.rows[0].cells[5].chart[0]).not.toBeUndefined();
            expect(sheet.chartColl.length).toBe(4);
            expect(spreadsheet.chartColl.length).toBe(4);
            done();
        });
    });

    describe('EJ2-953146, Provide Interpolation Support for Charts Referencing Date Values ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: dateData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking date values in Column chart rendering using public method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'B1:C4', id: 'chart_1' }]]);
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_1');
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_10_AxisLabel_0').textContent).toBe('2/14/2014');
            expect(document.getElementById('chart_10_AxisLabel_1').textContent).toBe('3/14/2014');
            done();
        });
        it('Testing inbetween values editing and undo & redo in Column chart ', (done: Function) => {
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_1');
            const chartObj: any = getComponent(chart, 'chart');
            helper.edit('B3', 'Hello');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_10_AxisLabel_0').textContent).toBe('2/14/2014');
            expect(document.getElementById('chart_10_AxisLabel_1').textContent).toBe('Hello');
            helper.invoke('undo');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_10_AxisLabel_0').textContent).toBe('2/14/2014');
            expect(document.getElementById('chart_10_AxisLabel_1').textContent).toBe('3/14/2014');
            helper.invoke('redo');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_10_AxisLabel_0').textContent).toBe('2/14/2014');
            expect(document.getElementById('chart_10_AxisLabel_1').textContent).toBe('Hello');
            done();
        });
        it('Checking date values in Bar chart rendering using public method', (done: Function) => {
            helper.invoke('numberFormat', [getFormatFromType('LongDate'), 'D1:D11']);
            helper.invoke('insertChart', [[{ type: 'Bar', range: 'D1:E6', id: 'chart_2' }]]);
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_2');
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_20_AxisLabel_0').textContent).toBe('Friday, February 14, 2014');
            expect(document.getElementById('chart_20_AxisLabel_1').textContent).toBe('Monday, April 14, 2014');
            done();
        });
        it('Testing inbetween values editing and undo & redo in Bar chart ', (done: Function) => {
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_2');
            const chartObj: any = getComponent(chart, 'chart');
            helper.edit('D3', 'Hello');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_20_AxisLabel_0').textContent).toBe('Friday, February 14, 2014');
            expect(document.getElementById('chart_20_AxisLabel_1').textContent).toBe('Hello');
            helper.invoke('undo');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_20_AxisLabel_0').textContent).toBe('Friday, February 14, 2014');
            expect(document.getElementById('chart_20_AxisLabel_1').textContent).toBe('Monday, April 14, 2014');
            helper.invoke('redo');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_20_AxisLabel_0').textContent).toBe('Friday, February 14, 2014');
            expect(document.getElementById('chart_20_AxisLabel_1').textContent).toBe('Hello');
            done();
        });
        it('Checking date values in Area chart rendering using public method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Area', range: 'F1:G6', id: 'chart_3' }]]);
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_3');
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_30_AxisLabel_0').textContent).toBe('14-Feb-14');
            expect(document.getElementById('chart_30_AxisLabel_1').textContent).toBe('14-Mar-14');
            done();
        });
        it('Testing inbetween values editing and undo & redo in Area chart ', (done: Function) => {
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_3');
            const chartObj: any = getComponent(chart, 'chart');
            helper.edit('F3', 'Hello');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_30_AxisLabel_0').textContent).toBe('14-Feb-14');
            expect(document.getElementById('chart_30_AxisLabel_1').textContent).toBe('Hello');
            helper.invoke('undo');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_30_AxisLabel_0').textContent).toBe('14-Feb-14');
            expect(document.getElementById('chart_30_AxisLabel_1').textContent).toBe('14-Mar-14');
            helper.invoke('redo');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_30_AxisLabel_0').textContent).toBe('14-Feb-14');
            expect(document.getElementById('chart_30_AxisLabel_1').textContent).toBe('Hello');
            done();
        });
        it('Checking date values in Line chart rendering using public method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Line', range: 'H1:I6', id: 'chart_4' }]]);
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_4');
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_40_AxisLabel_0').textContent).toBe('14-Feb');
            expect(document.getElementById('chart_40_AxisLabel_1').textContent).toBe('14-Apr');
            done();
        });
        it('Testing inbetween values editing and undo & redo in Line chart ', (done: Function) => {
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_4');
            const chartObj: any = getComponent(chart, 'chart');
            helper.edit('H3', 'Hello');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_40_AxisLabel_0').textContent).toBe('14-Feb');
            expect(document.getElementById('chart_40_AxisLabel_1').textContent).toBe('Hello');
            helper.invoke('undo');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_40_AxisLabel_0').textContent).toBe('14-Feb');
            expect(document.getElementById('chart_40_AxisLabel_1').textContent).toBe('14-Apr');
            helper.invoke('redo');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_40_AxisLabel_0').textContent).toBe('14-Feb');
            expect(document.getElementById('chart_40_AxisLabel_1').textContent).toBe('Hello');
            done();
        });
        it('Checking date values in Scatter chart rendering using public method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Scatter', range: 'J1:K6', id: 'chart_5' }]]);
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_5');
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_50_AxisLabel_0').textContent).toBe('1/1/1900 0...');
            expect(document.getElementById('chart_50_AxisLabel_1').textContent).toBe('1/1/1920 0...');
            done();
        });
        it('Testing inbetween values editing and undo & redo in Scatter chart ', (done: Function) => {
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_5');
            const chartObj: any = getComponent(chart, 'chart');
            helper.edit('J3', 'Hello');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_50_AxisLabel_0').textContent).toBe('2/14/2014 3:00');
            expect(document.getElementById('chart_50_AxisLabel_1').textContent).toBe('Hello');
            helper.invoke('undo');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_50_AxisLabel_0').textContent).toBe('1/1/1900 0...');
            expect(document.getElementById('chart_50_AxisLabel_1').textContent).toBe('1/1/1920 0...');
            helper.invoke('redo');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_50_AxisLabel_0').textContent).toBe('2/14/2014 3:00');
            expect(document.getElementById('chart_50_AxisLabel_1').textContent).toBe('Hello');
            done();
        });
        it('Checking date values in Pie chart rendering using public method', (done: Function) => {
            helper.invoke('undo');
            helper.invoke('insertChart', [[{ type: 'Pie', range: 'J1:K6', id: 'chart_6' }]]);
            expect(document.getElementById('chart_6_chart_legend_text_0').textContent).toBe('2/14/2014 3:00');
            expect(document.getElementById('chart_6_chart_legend_text_1').textContent).toBe('1/1/1900 0:00');
            done();
        });
        it('Checking date values in Doughnut chart rendering using public method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Doughnut', range: 'L1:M6', id: 'chart_7' }]]);
            expect(document.getElementById('chart_7_chart_legend_text_0').textContent).toBe('14-Feb');
            expect(document.getElementById('chart_7_chart_legend_text_1').textContent).toBe('14-Jun');
            done();
        });
        it('Checking date values in Column chart rendering using UI interaction', (done: Function) => {
            helper.edit('B3', '6/11/2014');
            helper.invoke('selectRange', ['B1:C5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Column"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#clusteredColumn').click();
            setTimeout(() => {
                const chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[1].chart[1].id}`;
                const chart: HTMLElement = helper.getInstance().element.querySelector(chartId);
                expect(chart).not.toBeNull();
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
                expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('2/14/2014');
                expect(chart.querySelector(`${chartId}0_AxisLabel_1`).textContent).toBe('4/14/2014');
                expect(chart.querySelector(`${chartId}0_AxisLabel_2`).textContent).toBe('6/14/2014');
                done();
            });
        });
        it('Checking date values in stackedArea chart rendering using UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['B1:C5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Area"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#stackedArea').click();
            setTimeout(() => {
                const chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[1].chart[2].id}`;
                const chart: HTMLElement = helper.getInstance().element.querySelector(chartId);
                expect(chart).not.toBeNull();
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
                expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('2/14/2014');
                expect(chart.querySelector(`${chartId}0_AxisLabel_3`).textContent).toBe('8/14/2014');
                done();
            });
        });
        it('Checking date values in stackedLine chart rendering using UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['B1:C5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#stackedLine').click();
            setTimeout(() => {
                const chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[1].chart[3].id}`;
                const chart: HTMLElement = helper.getInstance().element.querySelector(chartId);
                expect(chart).not.toBeNull();
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
                expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('2/14/2014');
                expect(chart.querySelector(`${chartId}0_AxisLabel_3`).textContent).toBe('8/14/2014');
                done();
            });
        });
    });

    describe('EJ2-970453, EJ2-972832, EJ2-972870, EJ2-972920, EJ2-981368 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: dateData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking date values in lineMarker chart rendering using UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['B1:C5']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart-btn').click();
            const target1: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(target1.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target1.getBoundingClientRect().left + 5, y: target1.getBoundingClientRect().top + 5 }, document, target1);
            helper.getElement('#lineMarker').click();
            setTimeout(() => {
                const chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[1].chart[0].id}`;
                const chart: HTMLElement = helper.getInstance().element.querySelector(chartId);
                expect(chart).not.toBeNull();
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
                expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('2/14/2014');
                expect(chart.querySelector(`${chartId}0_AxisLabel_3`).textContent).toBe('8/14/2014');
                done();
            });
        });
        it('Checking date values in StackingLine chart rendering using public method', (done: Function) => {
            helper.edit('H3', '11-Jun');
            helper.invoke('insertChart', [[{ type: 'StackingLine', range: 'H1:I6', id: 'chart_1' }]]);
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_1');
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_10_AxisLabel_0').textContent).toBe('14-Feb');
            expect(document.getElementById('chart_10_AxisLabel_1').textContent).toBe('14-Apr');
            done();
        });
        it('Delete the chart data ranges values and check the chart rendering', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.triggerKeyNativeEvent(46);
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_1');
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_10_AxisLabel_0').textContent).toBe('11-Jun');
            expect(document.getElementById('chart_10_AxisLabel_1').textContent).toBe('11-Jul');
            helper.invoke('selectRange', ['H5']);
            helper.triggerKeyNativeEvent(46);
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_10_AxisLabel_0').textContent).toBe('11-Jun');
            expect(document.getElementById('chart_10_AxisLabel_1').textContent).toBe('21-Jun');
            helper.invoke('undo');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_10_AxisLabel_0').textContent).toBe('11-Jun');
            expect(document.getElementById('chart_10_AxisLabel_1').textContent).toBe('11-Jul');
            helper.invoke('redo');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_10_AxisLabel_0').textContent).toBe('11-Jun');
            expect(document.getElementById('chart_10_AxisLabel_1').textContent).toBe('21-Jun');
            done();
        });
        it('Resize the chart with date interpolated values ->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E11', id: 'chart_2' }]]);
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_2');
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_20_AxisLabel_0').textContent).toBe('2/4/2014');
            expect(document.getElementById('chart_20_AxisLabel_2').textContent).toBe('6/4/2014');
            const overlay: HTMLElement = helper.getElementFromSpreadsheet('.e-ss-overlay-active');
            const overlayHgtHanlde: HTMLElement = overlay.querySelector('.e-ss-overlay-r');
            let offset: DOMRect = overlayHgtHanlde.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top }, overlay, overlayHgtHanlde);
            helper.triggerMouseAction('mousemove', { x: offset.left + 200, y: offset.top }, overlay, overlayHgtHanlde);
            helper.triggerMouseAction('mouseup', { x: offset.left + 200, y: offset.top }, document, overlayHgtHanlde);
            done();
        });
        it('Undo and redo the resized chart ->', (done: Function) => {
            expect(document.getElementById('chart_20_AxisLabel_1').textContent).toBe('3/4/2014');
            expect(document.getElementById('chart_20_AxisLabel_2').textContent).toBe('4/4/2014');
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(document.getElementById('chart_20_AxisLabel_1').textContent).toBe('4/4/2014');
                expect(document.getElementById('chart_20_AxisLabel_2').textContent).toBe('6/4/2014');
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(document.getElementById('chart_20_AxisLabel_1').textContent).toBe('3/4/2014');
                    expect(document.getElementById('chart_20_AxisLabel_2').textContent).toBe('4/4/2014');
                    done();
                });
            });
        });
        it('Checking Switch row column cases with date interpolation chart and tooltip checking', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'B1:C11', id: 'chart_3' }]]);
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_3');
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
            expect(document.getElementById('chart_30_AxisLabel_0').textContent).toBe('2/4/2014');
            expect(document.getElementById('chart_30_AxisLabel_1').textContent).toBe('4/4/2014');
            const target: HTMLElement = document.getElementById('chart_3_Series_0_Point_7');
            helper.triggerMouseAction('mousemove', { x: target.getBoundingClientRect().left, y: target.getBoundingClientRect().top }, chart, target);
            helper.switchRibbonTab(7);
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_30_AxisLabel_0').textContent).toBe('Quantity');
            done();
        });
        it('Inserting chart with same date with different y values', (done: Function) => {
            helper.invoke('autoFill', ['B3:B11', 'B2', 'Down', 'CopyCells']);
            helper.invoke('insertChart', [[{ type: 'Column', range: 'B1:C11', id: 'chart_4' }]]);
            const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_4');
            const chartObj: any = getComponent(chart, 'chart');
            expect(chartObj.primaryXAxis.valueType).toBe('Category');
            expect(document.getElementById('chart_40_AxisLabel_0').textContent).toBe('2/14/2014');
            done();
        });
        it('Insert scatter chart and check switch row column cases', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Scatter', range: 'J1:K11', id: 'chart_7' }]]);
            setTimeout(() => {
                const chart: HTMLElement = helper.getInstance().element.querySelector('#chart_7');
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
                expect(document.getElementById('chart_70_AxisLabel_0').textContent).toBe('1/1/1900 0...');
                expect(document.getElementById('chart_70_AxisLabel_1').textContent).toBe('1/1/1920 0...');
                const target: HTMLElement = document.getElementById('chart_7_Series_0_Point_7');
                helper.triggerMouseAction('mousemove', { x: target.getBoundingClientRect().left, y: target.getBoundingClientRect().top }, chart, target);
                helper.switchRibbonTab(7);
                helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
                expect(chartObj.primaryXAxis.valueType).toBe('Category');
                helper.switchRibbonTab(7);
                helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
                expect(chartObj.primaryXAxis.valueType).toBe('DateTime');
                expect(document.getElementById('chart_70_AxisLabel_0').textContent).toBe('1/1/1900 0...');
                expect(document.getElementById('chart_70_AxisLabel_1').textContent).toBe('1/1/1920 0...');
                helper.invoke('deleteChart');
                done();
            });
        });
    });

    describe('EJ2-972229 -> Provide an option to enable/disable the date interpolation support in the chart', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: dateData }] }],
                actionBegin(args: any) {
                    if (args.action === 'beforeInsertChart') {
                        if (args.args.eventArgs) { args.args.eventArgs.skipDateInterpolation = true; }
                    }
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert Column chart using UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['B1:C11']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Column"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#clusteredColumn').click();
            setTimeout(() => {
                const chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[1].chart[0].id}`;
                const chart: HTMLElement = helper.getInstance().element.querySelector(chartId);
                expect(chart).not.toBeNull();
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('Category');
                expect(helper.getInstance().sheets[0].rows[0].cells[1].chart[0].skipDateInterpolation).toBeTruthy();
                expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('2/14/...');
                expect(chart.querySelector(`${chartId}0_AxisLabel_3`).textContent).toBe('11/21...');
                helper.invoke('deleteChart');
                done();
            });
        });
        it('Insert Column chart using insertChart method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E11' }]]);
            setTimeout(() => {
                const chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                const chart: HTMLElement = helper.getInstance().element.querySelector(chartId);
                expect(chart).not.toBeNull();
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('Category');
                expect(helper.getInstance().sheets[0].rows[0].cells[3].chart[0].skipDateInterpolation).toBeTruthy();
                expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('2/14/...');
                expect(chart.querySelector(`${chartId}0_AxisLabel_3`).textContent).toBe('11/21...');
                helper.invoke('deleteChart');
                done();
            });
        });
        it('Insert Bar chart using UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['B1:C11']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Bar"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#clusteredBar').click();
            setTimeout(() => {
                const chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[1].chart[0].id}`;
                const chart: HTMLElement = helper.getInstance().element.querySelector(chartId);
                expect(chart).not.toBeNull();
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('Category');
                expect(helper.getInstance().sheets[0].rows[0].cells[1].chart[0].skipDateInterpolation).toBeTruthy();
                expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('2/14/2014');
                expect(chart.querySelector(`${chartId}0_AxisLabel_3`).textContent).toBe('11/21/2014');
                helper.invoke('deleteChart');
                done();
            });
        });
        it('Insert Bar chart using insertChart method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Bar', range: 'D1:E11' }]]);
            setTimeout(() => {
                const chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                const chart: HTMLElement = helper.getInstance().element.querySelector(chartId);
                expect(chart).not.toBeNull();
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('Category');
                expect(helper.getInstance().sheets[0].rows[0].cells[3].chart[0].skipDateInterpolation).toBeTruthy();
                expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('2/14/2014');
                expect(chart.querySelector(`${chartId}0_AxisLabel_3`).textContent).toBe('11/21/2014');
                helper.invoke('deleteChart');
                done();
            });
        });
        it('Insert Area chart using UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['B1:C11']);
            helper.switchRibbonTab(2);
            helper.getElement('#' + helper.id + '_chart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-btn-popup .e-menu-item[aria-label="Area"]');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#area').click();
            setTimeout(() => {
                const chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[1].chart[0].id}`;
                const chart: HTMLElement = helper.getInstance().element.querySelector(chartId);
                expect(chart).not.toBeNull();
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('Category');
                expect(helper.getInstance().sheets[0].rows[0].cells[1].chart[0].skipDateInterpolation).toBeTruthy();
                expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('2/14/...');
                expect(chart.querySelector(`${chartId}0_AxisLabel_3`).textContent).toBe('11/21...');
                helper.invoke('deleteChart');
                done();
            });
        });
        it('Insert Area chart using insertChart method', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Area', range: 'D1:E11' }]]);
            setTimeout(() => {
                const chartId: string = `#${helper.getInstance().sheets[0].rows[0].cells[3].chart[0].id}`;
                const chart: HTMLElement = helper.getInstance().element.querySelector(chartId);
                expect(chart).not.toBeNull();
                const chartObj: any = getComponent(chart, 'chart');
                expect(chartObj.primaryXAxis.valueType).toBe('Category');
                expect(helper.getInstance().sheets[0].rows[0].cells[3].chart[0].skipDateInterpolation).toBeTruthy();
                expect(chart.querySelector(`${chartId}0_AxisLabel_0`).textContent).toBe('2/14/...');
                expect(chart.querySelector(`${chartId}0_AxisLabel_3`).textContent).toBe('11/21...');
                helper.invoke('deleteChart');
                done();
            });
        });
    });

    describe('EJ2-947829 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Duplicated sheets chart still reference original sheet data ', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertChart([{ type: "Column", range: '\'Sheet1\'!D1:H11' }]);
            spreadsheet.insertChart([{ type: "Pie", range: 'Sheet1!D2:H11' }]);
            expect(spreadsheet.sheets[0].rows[0].cells[3].chart[0].type).toBe('Column');
            expect(spreadsheet.sheets[0].rows[0].cells[3].chart.length).toBe(1);
            expect(spreadsheet.sheets[0].rows[0].cells[3].chart[0].range).toBe('\'Sheet1\'!D1:H11');
            expect(spreadsheet.sheets[0].rows[1].cells[3].chart[0].type).toBe('Pie');
            expect(spreadsheet.sheets[0].rows[1].cells[3].chart.length).toBe(1);
            expect(spreadsheet.sheets[0].rows[1].cells[3].chart[0].range).toBe('Sheet1!D2:H11');
            expect(spreadsheet.sheets.length).toBe(1);
            expect(spreadsheet.activeSheetIndex).toBe(0);
            helper.invoke('duplicateSheet', [0]);
            setTimeout(() => {
                expect(spreadsheet.sheets.length).toBe(2);
                expect(spreadsheet.activeSheetIndex).toBe(1);
                expect(spreadsheet.sheets[1].rows[0].cells[3].chart[0].type).toBe('Column');
                expect(spreadsheet.sheets[1].rows[0].cells[3].chart.length).toBe(1);
                expect(spreadsheet.sheets[1].rows[0].cells[3].chart[0].range).toBe('\'Sheet1 (2)\'!D1:H11');
                expect(spreadsheet.sheets[1].rows[1].cells[3].chart.length).toBe(1);
                expect(spreadsheet.sheets[1].rows[1].cells[3].chart[0].type).toBe('Pie');
                expect(spreadsheet.sheets[1].rows[1].cells[3].chart[0].range).toBe('Sheet1 (2)!D2:H11');
                helper.invoke('duplicateSheet', [0]);
                setTimeout(() => {
                    expect(spreadsheet.sheets.length).toBe(3);
                    expect(spreadsheet.activeSheetIndex).toBe(1);
                    expect(spreadsheet.sheets[1].rows[0].cells[3].chart[0].type).toBe('Column');
                    expect(spreadsheet.sheets[1].rows[0].cells[3].chart.length).toBe(1);
                    expect(spreadsheet.sheets[1].rows[0].cells[3].chart[0].range).toBe('\'Sheet1 (3)\'!D1:H11');
                    expect(spreadsheet.sheets[1].rows[1].cells[3].chart.length).toBe(1);
                    expect(spreadsheet.sheets[1].rows[1].cells[3].chart[0].type).toBe('Pie');
                    expect(spreadsheet.sheets[1].rows[1].cells[3].chart[0].range).toBe('Sheet1 (3)!D2:H11');
                    expect(spreadsheet.sheets[2].rows[0].cells[3].chart[0].type).toBe('Column');
                    expect(spreadsheet.sheets[2].rows[0].cells[3].chart.length).toBe(1);
                    expect(spreadsheet.sheets[2].rows[0].cells[3].chart[0].range).toBe('\'Sheet1 (2)\'!D1:H11');
                    expect(spreadsheet.sheets[2].rows[1].cells[3].chart.length).toBe(1);
                    expect(spreadsheet.sheets[2].rows[1].cells[3].chart[0].type).toBe('Pie');
                    expect(spreadsheet.sheets[2].rows[1].cells[3].chart[0].range).toBe('Sheet1 (2)!D2:H11');
                    done();
                });
            });
        });
    });

    describe('Spreadsheet Chart Properties Checks when allowchart is false', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }], rows: [{ cells: [{ chart: [{ type: 'Bar', range: 'A1:B2', title: 'Fake Chart', theme: 'Fabric', height: 150, width: 300, id: 'fakeId1', isSeriesInRows: false }] }] }]
                }],
                allowChart: false
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Inserting chart through celldata bind and public method', (done: Function) => {
            const chartEl = helper.getElement('.e-datavisualization-chart');
            expect(chartEl).toBeNull();
            const cell = helper.getInstance().sheets[0].rows[0].cells[0];
            expect(cell.chart).not.toBeNull();
            helper.invoke('insertChart', [[{
                type: 'Line',
                range: 'A2:A2',
                title: '',
                theme: 'Material',
                height: 290,
                width: 480,
                id: '',
                isSeriesInRows: false,
                dataLabelSettings: {},
                legendSettings: {},
                markerSettings: {},
                primaryXAxis: {},
                primaryYAxis: {}
            }]]);
            setTimeout(() => {
                const methodCell=helper.getInstance().sheets[0].rows[1].cells[0];
                expect(methodCell.chart).toBeUndefined();
                done();
            }, 10);
        });
        it('should switch to Insert tab and check #spreadsheet_chart button is present', (done: Function) => {
            helper.switchRibbonTab(2);
            const chartBtn = helper.getElement('#spreadsheet_chart');
            expect(chartBtn).toBeNull();
            done();
        });
    });
});