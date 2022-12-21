import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, GDPData } from '../util/datasource.spec';
import { CellModel, getFormatFromType, SheetModel, Spreadsheet } from '../../../src/index';
import { Overlay } from '../../../src/spreadsheet/services/index';
import { getComponent, EventHandler } from '@syncfusion/ej2-base';

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
            helper.getElement('#stackedline100').click();
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
        it('Undo after change Chart Type->', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
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
                helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
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
    });
});