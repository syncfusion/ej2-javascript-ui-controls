import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { ExcelExport, PDFExport } from '../../src/pivotview/actions';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { Toolbar } from '../../src/common/popups/toolbar';
import { PivotChart } from '../../src/pivotchart/index';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Pivot Grid Toolbar', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe(' -  Initial Rendering and Basic Operations', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList, CalculatedField, Toolbar, ConditionalFormatting, PivotChart, ExcelExport, PDFExport);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                displayOption: {
                    view: 'Both'
                },
                dataBound: dataBound,
                saveReport: util.saveReport.bind(this),
                fetchReport: util.fetchReport.bind(this),
                loadReport: util.loadReport.bind(this),
                removeReport: util.removeReport.bind(this),
                renameReport: util.renameReport.bind(this),
                newReport: util.newReport.bind(this),
                toolbarRender: util.beforeToolbarRender.bind(this),
                toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load', 'ConditionalFormatting',
                    'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'FieldList'],
                allowExcelExport: true,
                allowConditionalFormatting: true,
                allowPdfExport: true,
                showToolbar: true,
                allowCalculatedField: true,
                showFieldList: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Toolbar initial render check', () => {
            expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
            (pivotGridObj.element.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
        });

        it('Save As Report', () => {
            (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value).toBe('');
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report2";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();

        });
        it('Save As Report1', () => {
            if (window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none') {
                expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
            }
        });
        it('Save As Report2', () => {
            (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value).toBe('');
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report2";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[2] as HTMLElement).click();
        });
        it('Save As Report3', () => {
            (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value).toBe('');
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report2";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });
        it('Save As Report4', () => {
            (document.querySelectorAll('.e-cancel-btn')[1] as HTMLElement).click();
        });
        it('Save Report Dialog-check', function () {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
        });
        it('Remove Report Dialog - Cancel', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
            (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[2] as HTMLElement).click();

        });
        it('Save Report Dialog-check1', function () {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
        });
        it('Remove Report Dialog - Cancel2', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
            (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[1] as HTMLElement).click();
        });
        it('Save Report No Records Dialog', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
            (pivotGridObj.element.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
            expect(document.querySelectorAll('.e-dialog').length > 0).toBeTruthy();
        });

        it('Rename Report Dialog - Cancel', () => {
            expect(document.querySelectorAll('.e-dialog').length > 0).toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-rename-report') as HTMLElement).click();
        });
        it('Rename Report Dialog - OK', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });
        it('Rename Report', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "ReportRenamed";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
            (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
        });
        it('Remove Report Dialog', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
            (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[2] as HTMLElement).click();
        });

        it('Rename Report', () => {
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value === 'ReportRenamed').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "ReportRenamed";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });

        it('Rename Report Dialog - Cancel', () => {
            expect(document.querySelectorAll('.e-pivot-error-dialog').length > 0).toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-rename-report') as HTMLElement).click();
        });
        it('Rename Report', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "ReportRenamed";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });

        it('New Report', () => {
            if (window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'flex') {
                expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'flex').toBeTruthy();
            }
            (document.querySelector('.e-pivot-toolbar .e-new-report') as HTMLElement).click();
        });
        it('New Report1', () => {
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value === '').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "NewReport";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });
        it('New Report2', () => {
            expect(document.querySelectorAll('.e-pivot-error-dialog').length > 0).toBeTruthy();
            (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
        });
        it('New Report4', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-new-report') as HTMLElement).click();
        });
        it('New Report5', () => {
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value === '').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "NewReport";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });
        it('New Report6', () => {
            expect(document.querySelectorAll('#PivotGrid_ConfirmDialog').length > 0).toBeTruthy();
            (document.querySelectorAll('.e-cancel-btn')[1] as HTMLElement).click();
        });

        it('Load Report', () => {
            (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value).toBe('');
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report2";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
            pivotGridObj.toolbarModule.action = 'Load';
        });
    });

    describe(' -  Initial Rendering with cssClass', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList, CalculatedField, Toolbar, ConditionalFormatting, PivotChart, ExcelExport, PDFExport);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                    subTotalsPosition: 'Bottom'
                },
                displayOption: {
                    view: 'Both'
                },
                cssClass: 'pivot-toolbar',
                dataBound: dataBound,
                saveReport: util.saveReport.bind(this),
                fetchReport: util.fetchReport.bind(this),
                loadReport: util.loadReport.bind(this),
                removeReport: util.removeReport.bind(this),
                renameReport: util.renameReport.bind(this),
                newReport: util.newReport.bind(this),
                toolbarRender: util.beforeToolbarRender.bind(this),
                toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load', 'Formatting',
                    'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', ['CustomDrill'], 'FieldList'] as any,
                allowExcelExport: true,
                allowConditionalFormatting: true,
                allowPdfExport: true,
                showToolbar: true,
                allowCalculatedField: true,
                showFieldList: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Toolbar initial render check', () => {
            expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
            (pivotGridObj.element.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
        });

        it('Save As Report', () => {
            (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value).toBe('');
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report2";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();

        });
        it('Save As Report1', () => {
            if (window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none') {
                expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
            }
        });
        it('Save As Report2', () => {
            (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value).toBe('');
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report2";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[2] as HTMLElement).click();
        });
        it('Save As Report3', () => {
            (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value).toBe('');
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report2";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });
        it('Save As Report4', () => {
            (document.querySelectorAll('.e-cancel-btn')[1] as HTMLElement).click();
        });
        it('Save Report Dialog-check', function () {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
        });
        it('Remove Report Dialog - Cancel', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
            (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[2] as HTMLElement).click();

        });
        it('Save Report Dialog-check1', function () {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
        });
        it('Remove Report Dialog - Cancel2', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
            (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[1] as HTMLElement).click();
        });
        it('Save Report No Records Dialog', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
            (pivotGridObj.element.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
            expect(document.querySelectorAll('.e-dialog').length > 0).toBeTruthy();
        });

        it('Rename Report Dialog - Cancel', () => {
            expect(document.querySelectorAll('.e-dialog').length > 0).toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-rename-report') as HTMLElement).click();
        });
        it('Rename Report Dialog - OK', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });
        it('Rename Report', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "ReportRenamed";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
            (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
        });
        it('Remove Report Dialog', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
            (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[2] as HTMLElement).click();
        });

        it('Rename Report', () => {
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value === 'ReportRenamed').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "ReportRenamed";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });

        it('Rename Report Dialog - Cancel', () => {
            expect(document.querySelectorAll('.e-pivot-error-dialog').length > 0).toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-rename-report') as HTMLElement).click();
        });
        it('Rename Report', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "ReportRenamed";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });

        it('New Report', () => {
            if (window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'flex') {
                expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'flex').toBeTruthy();
            }
            (document.querySelector('.e-pivot-toolbar .e-new-report') as HTMLElement).click();
        });
        it('New Report1', () => {
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value === '').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "NewReport";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });
        it('New Report2', () => {
            expect(document.querySelectorAll('.e-pivot-error-dialog').length > 0).toBeTruthy();
            (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
        });
        it('New Report4', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-new-report') as HTMLElement).click();
        });
        it('New Report5', () => {
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value === '').toBeTruthy();
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "NewReport";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        });
        it('New Report6', () => {
            expect(document.querySelectorAll('#PivotGrid_ConfirmDialog').length > 0).toBeTruthy();
            (document.querySelectorAll('.e-cancel-btn')[1] as HTMLElement).click();
        });

        it('Load Report', () => {
            (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
            expect((document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value).toBe('');
            (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report2";
            (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
            pivotGridObj.toolbarModule.action = 'Load';
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});