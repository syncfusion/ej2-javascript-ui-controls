import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, GDPData } from '../util/datasource.spec';
import { CellModel, getFormatFromType, SheetModel, Spreadsheet } from '../../../src/index';
import { Overlay } from '../../../src/spreadsheet/services/index';
import { getComponent, EventHandler } from '@syncfusion/ej2-base';
import { Chart } from '@syncfusion/ej2-charts';

/**
 *  Chart test cases
 */
describe('Chart ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        let cell: CellModel;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            cell = helper.getInstance().sheets[0].rows[0].cells[3];
            // expect(JSON.stringify(cell.chart)).toBe('[{"type":"Column","range":"Sheet1!D1:E5","theme":"Material","isSeriesInRows":false,"id":"e_spreadsheet_chart_1","height":290,"width":480,"top":0,"left":192}]'); check this now
            expect(helper.getElementFromSpreadsheet('#' + cell.chart[0].id).classList).toContain('e-chart');
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
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('20:30, Price');
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
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('20:30, ');
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
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('20:15, Price');
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
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('20:30, ');
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
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('20:30, ');
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
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0').getAttribute('aria-label')).toBe('20:30, ');
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
                expect(document.getElementById('e_spreadsheet_chart_1_Series_0_Point_0')).toBeNull();
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
});