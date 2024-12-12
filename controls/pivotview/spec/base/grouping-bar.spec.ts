import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { ExcelExport, PDFExport, VirtualScroll } from '../../src/pivotview/actions';
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
    describe(' -  Display mode testing', () => {
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
            PivotView.Inject(FieldList, GroupingBar, CalculatedField, Toolbar, ConditionalFormatting, PivotChart, ExcelExport, PDFExport);
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
                groupingBarSettings: { displayMode: 'Table', showFieldsPanel: true },
                showGroupingBar: true,
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
        it('Initial render check', () => {
            expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
        });
        it('Grouping bar check', () => {
            expect((document.querySelector('.e-pivot-grouping-bar') as HTMLElement).style.display === '').toBeTruthy();
        });
    });

    describe(' -  Display mode testing-1', () => {
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
            PivotView.Inject(FieldList, GroupingBar, CalculatedField, Toolbar, ConditionalFormatting, PivotChart, ExcelExport, PDFExport);
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
                groupingBarSettings: { displayMode: 'Chart', showFieldsPanel: true },
                showGroupingBar: true,
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
        it('Initial render check', () => {
            expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
        });
        it('Grouping bar check', () => {
            expect(document.querySelector('.e-pivot-grouping-bar') === null).toBeTruthy();
        });
    });

    describe(' -  Display mode testing-2', () => {
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
            PivotView.Inject(FieldList, GroupingBar, CalculatedField, Toolbar, ConditionalFormatting, PivotChart, ExcelExport, PDFExport);
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
                    view: 'Chart'
                },
                dataBound: dataBound,
                groupingBarSettings: { displayMode: 'Both', showFieldsPanel: true },
                showGroupingBar: true,
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
        it('Initial render check', () => {
            expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
        });
        it('Grouping bar check', () => {
            expect((document.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === '').toBeTruthy();
        });
    });

    describe(' -  Display mode testing-3', () => {
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
            PivotView.Inject(FieldList, GroupingBar, CalculatedField, Toolbar, ConditionalFormatting, PivotChart, ExcelExport, PDFExport);
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
                    view: 'Table'
                },
                dataBound: dataBound,
                groupingBarSettings: { displayMode: 'Both', showFieldsPanel: true },
                showGroupingBar: true,
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
        it('Initial render check', () => {
            expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
        });
        it('Grouping bar check', () => {
            expect((document.querySelector('.e-pivot-grouping-bar') as HTMLElement).style.display === '').toBeTruthy();
        });
    });

    describe(' -  Display mode testing-4', () => {
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
            PivotView.Inject(FieldList, GroupingBar, CalculatedField, Toolbar, ConditionalFormatting, PivotChart, ExcelExport, PDFExport);
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
                    view: 'Table'
                },
                dataBound: dataBound,
                groupingBarSettings: { displayMode: 'Table', showFieldsPanel: true },
                showGroupingBar: true,
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
        it('Initial render check', () => {
            expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
        });
        it('Grouping bar check', () => {
            expect((document.querySelector('.e-pivot-grouping-bar') as HTMLElement).style.display === '').toBeTruthy();
        });
    });

    describe(' -  Single page', () => {
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
            PivotView.Inject(FieldList, VirtualScroll);
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
                    view: 'Table'
                },
                dataBound: dataBound,
                enableVirtualization: true,
                virtualScrollSettings: { allowSinglePage: true },
                showFieldList: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,

        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Initial render check', () => {
            expect(document.querySelector('[aria-colindex="4"][index="5"]').textContent).toBe('5736.27');
        });
        it('Cell click', () => {
            document.querySelector('[aria-colindex="4"][index="5"]').dispatchEvent(click);
        });
        it('Cell check', () => {
            expect(document.querySelector('[aria-colindex="3"][index="3"]').textContent).toBe('226');
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