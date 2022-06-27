import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType, EventHandler, extend, getInstance } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import {
    FieldDroppedEventArgs, PivotCellSelectedEventArgs, ColumnRenderEventArgs, BeginDrillThroughEventArgs
} from '../../src/common/base/interface';
import { Grid } from '@syncfusion/ej2-grids';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { DrillThrough } from '../../src/pivotview/actions';
import { MaskedTextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import * as util from '../utils.spec';
import { Grouping } from '../../src/common/popups/grouping'
import { CheckBox } from '@syncfusion/ej2-buttons';
import { MultiSelect } from '@syncfusion/ej2-dropdowns';
import { PivotUtil } from '../../src/base/util';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Group By Date feature', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe(' -  Initial Rendering and Value Sorting', () => {
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
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
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: ds,
                    expandAll: false,
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    filterSettings: [{ name: 'date_date_group_years', type: 'Include', items: ['1970', '1971', '1972', '1973', '1974', '1975'] }],
                    rows: [{ name: 'date', caption: 'TimeLine' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance', caption: 'Balance' }],
                    filters: [{ name: 'product', caption: 'Category' }],
                    groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'] }],
                    alwaysShowValueHeader: true
                },
                enableValueSorting: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Check date groups initially', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1970');
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 2000);
        });
        it('Check single value header', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1975');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 2000);
        });
        it('Check date groups after value sorting', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1970');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 2000);
        });
        it('Check group settings update using on proptery', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.groupSettings[0].groupInterval = ['Years', 'Quarters', 'Months', 'Days', 'Hours'];
            setTimeout(() => {
                // expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1970');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 2000);
        });
    });
    describe(' -  Initial Rendering with range', () => {
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
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
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: ds,
                    expandAll: false,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    rows: [{ name: 'date', caption: 'TimeLine' }],
                    columns: [{ name: 'age' }, { name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance', caption: 'Balance' }],
                    filters: [{ name: 'product', caption: 'Category' }],
                    groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                    { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 }],
                    alwaysShowValueHeader: true
                },
                enableValueSorting: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Check date groups initially', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1975');
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 2000);
        });
        it('Check single value header', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Out of Range');
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 2000);
        });
        it('Check date groups after value sorting', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1983');
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 2000);
        });
        it('Check group settings update using on proptery', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.groupSettings[0].groupInterval = ['Years', 'Quarters', 'Months', 'Days', 'Hours'];
            setTimeout(() => {
                // expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1970');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 2000);
        });
    });
    describe(' -  Initial Rendering with range - PivotChart', () => {
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
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
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: ds,
                    expandAll: false,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    rows: [{ name: 'date', caption: 'TimeLine' }],
                    columns: [{ name: 'age' }, { name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance', caption: 'Balance' }],
                    filters: [{ name: 'product', caption: 'Category' }],
                    groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                    { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 }],
                    alwaysShowValueHeader: true
                },
                chartSettings: {
                    chartSeries: { type: 'Column', animation: { enable: false } }
                },
                displayOption: { view: 'Chart' },
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Group settings with chart - Days on values', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.rows = [{ name: 'date_date_group_years' }, { name: 'date_date_group_quarters' }, { name: 'date_date_group_months' }];
            pivotGridObj.dataSourceSettings.values = [{ name: 'date' }];
            setTimeout(() => {
                expect(document.getElementById('PivotGrid_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('1975:4');
                done();
            }, 2000);
        });
        it('Group settings with chart - Days and Months on values', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.rows = [{ name: 'date_date_group_years' }, { name: 'date_date_group_quarters' }];
            pivotGridObj.dataSourceSettings.values = [{ name: 'date' }, { name: 'date_date_group_months' }];
            setTimeout(() => {
                expect(document.getElementById('PivotGrid_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('1975:4');
                done();
            }, 2000);
        });
        it('Group settings with chart - Days, Months and Quarters on values', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.rows = [{ name: 'date_date_group_years' }];
            pivotGridObj.dataSourceSettings.values = [{ name: 'date' }, { name: 'date_date_group_months' }, { name: 'date_date_group_quarters' }];
            setTimeout(() => {
                expect(document.getElementById('PivotGrid_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('1975:4');
                done();
            }, 2000);
        });
        it('Group settings with chart - Days, Months, Quarters and Years on values', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.rows = [];
            pivotGridObj.dataSourceSettings.values = [{ name: 'date' }, { name: 'date_date_group_months' }, { name: 'date_date_group_years' }, { name: 'date_date_group_quarters' }];
            setTimeout(() => {
                expect(document.getElementById('PivotGrid_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:67');
                done();
            }, 2000);
        });
    });
    describe(' -  Initial Rendering with range value as string', () => {
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
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
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: ds,
                    expandAll: false,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    rows: [{ name: 'date', caption: 'TimeLine' }],
                    columns: [{ name: 'age' }, { name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance', caption: 'Balance' }],
                    filters: [{ name: 'product', caption: 'Category' }],
                    groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'], startingAt: '1975-01-10', endingAt: '2005-11-5' },
                    { name: 'age', type: 'Number', startingAt: '25', endingAt: '35', rangeInterval: 5 }],
                    alwaysShowValueHeader: true
                },
                enableValueSorting: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Check date groups initially', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1975');
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 2000);
        });
        it('Check single value header', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Out of Range');
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 2000);
        });
        it('Check date groups after value sorting', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1983');
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 2000);
        });
        it('Check group settings update using on proptery', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.groupSettings[0].groupInterval = ['Years', 'Quarters', 'Months', 'Days', 'Hours'];
            setTimeout(() => {
                // expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1970');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 2000);
        });
    });
    describe('- Editing - normal', () => {
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
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
            PivotView.Inject(GroupingBar, DrillThrough, CalculatedField);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: ds,
                    expandAll: false,
                    allowLabelFilter: true,
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    filterSettings: [{ name: 'date_date_group_years', type: 'Exclude', items: ['1970', '1971', '1972', '1973', '1974', '1975'] }],
                    rows: [{ name: 'date', caption: 'TimeLine' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [{ name: 'product', caption: 'Category' }],
                    groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'] }]
                },
                height: 300,
                width: 800,
                allowDrillThrough: true,
                editSettings: {
                    allowAdding: true, allowDeleting: true, allowEditing: true,
                    showConfirmDialog: false, showDeleteConfirmDialog: false, allowCommandColumns: false, mode: 'Normal'
                },
                beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
                    if (args.gridObj) {
                        let eventType: string = args.type;
                        let gridObj: Grid = args.gridObj;
                        gridObj.allowKeyboard = false;
                    }
                },
                showGroupingBar: true,
                dataBound: dataBound,
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let mouseup: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let mousedown: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        it('render testing', () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('.e-pivot-button').length).toBe(8);
        });
        it('click female-balance', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("16");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 2000);
        });
        it('click female-quantity', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("$15,800.99");
            document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mouseup);
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("16");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 2000);
        });
    });
    describe('- Grouping Bar with injected Module - ', () => {
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
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
            PivotView.Inject(GroupingBar);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: ds,
                    expandAll: false,
                    enableSorting: true,
                    allowLabelFilter: true,
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    filterSettings: [{ name: 'date_date_group_years', type: 'Exclude', items: ['1970', '1971', '1972', '1973', '1974', '1975'] },
                    { name: 'product', items: ['Flight'], type: 'Exclude' }],
                    rows: [{ name: 'date', caption: 'TimeLine' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [{ name: 'product', caption: 'Category' }],
                    groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'] }]
                },
                showGroupingBar: true,
                groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false, showValueTypeIcon: false },
                dataBound: dataBound,
                gridSettings: {
                    columnRender: (args: ColumnRenderEventArgs) => {
                        args.columns[0].width = 200;
                        args.columns[1].allowReordering = true;
                        args.columns[1].allowResizing = true;
                    }
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let persistdata: string;
        it('check window resize with grouping bar', () => {
            pivotGridObj.onWindowResize();
            pivotGridObj.renderModule.updateGridSettings();
            expect(true).toBeTruthy();
        });
        it('grouping bar render testing', () => {
            expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            pivotGridObj.dataBind();
            pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
            expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
        });
        it('check sorting order field', () => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('sorting order after update', () => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
        });
        it('check filtering field', (done: Function) => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 2000);
        });
        it('check all nodes on filter popup', () => {
            let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
            let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(allNode.classList.contains('e-small')).toBe(false);
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkEle.length).toEqual(checkedEle.length);
            expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter state after update', () => {
            let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
            expect(filterDialog).toBeUndefined;
        });
        it('check remove pivot button', (done: Function) => {
            let pivotButton: HTMLElement =
                (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
            expect(pivotButton.id).toBe('product');
            (pivotButton.querySelector('.e-remove') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton).toBeNull();
                done();
            }, 2000);
        });
        it('check drag and drop pivot button', (done: Function) => {
            pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                args.droppedField.caption = "droppedButton"
            };
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(4);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, columnAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = columnAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseOverEventArgs: any = extend({}, mousemove, null, true);
            mouseOverEventArgs.type = 'mouseover';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
            let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
            mouseLeaveEventArgs.type = 'mouseleave';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, columnAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = columnAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect((pivotButton[1].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                done();
            }, 2000);
        });
        it('destroy common event handlers', () => {
            pivotGridObj.commonModule.destroy();
            expect(true).toBeTruthy();
        });
        it('pivotgrid destroy', () => {
            pivotGridObj.destroy();
            expect(true).toBeTruthy();
        });
        it('pivotgrid destroy expect', () => {
            expect(pivotGridObj.element.innerHTML).toBe('');
        });
    });

    describe('- Field List with injected Module - ', () => {
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
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
            PivotView.Inject(GroupingBar, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: ds,
                    expandAll: false,
                    enableSorting: true,
                    allowLabelFilter: true,
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    filterSettings: [{ name: 'date_date_group_years', type: 'Exclude', items: ['1970', '1971', '1972', '1973', '1974', '1975'] },
                    { name: 'product', items: ['Flight'], type: 'Exclude' }],
                    rows: [{ name: 'date', caption: 'TimeLine' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [{ name: 'product', caption: 'Category' }],
                    groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'] }]
                },
                showGroupingBar: true,
                showFieldList: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
            util.disableDialogAnimation(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog);
        });
        let persistdata: string;
        it('check window resize with grouping bar', () => {
            pivotGridObj.onWindowResize();
            pivotGridObj.renderModule.updateGridSettings();
            expect(true).toBeTruthy();
        });
        it('grouping bar render testing', () => {
            pivotGridObj.dataBind();
            expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy();
        });
        it('field list render testing', () => {
            pivotGridObj.dataBind();
            expect(pivotGridObj.pivotFieldListModule).not.toBeUndefined;
        });
        it('check open field list popup', () => {
            (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('check sorting order field', () => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('sorting order after update', () => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
        });
        it('check filtering field', (done: Function) => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 2000);
        });
        it('check all nodes on filter popup', () => {
            let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
            let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(allNode.classList.contains('e-small')).toBe(false);
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkEle.length).toEqual(checkedEle.length);
            expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter state after update', () => {
            let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
            expect(filterDialog).toBeUndefined;
        });
        it('check remove pivot button', (done: Function) => {
            let pivotButton: HTMLElement =
                (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
            expect(pivotButton.id).toBe('product');
            (pivotButton.querySelector('.e-remove') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton).toBeNull();
                done();
            }, 2000);
        });
        it('check drag and drop pivot button', (done: Function) => {
            pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                args.droppedField.caption = "droppedButton"
            };
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(4);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, columnAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = columnAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, columnAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = columnAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect((pivotButton[1].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                done();
            }, 2000);
        });
        it('set rtl property', (done: Function) => {
            pivotGridObj.enableRtl = true;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.classList.contains('e-rtl')).toBeTruthy;
                done();
            }, 2000);
        });
        it('remove rtl property', (done: Function) => {
            pivotGridObj.enableRtl = false;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.classList.contains('e-rtl')).not.toBeTruthy;
                done();
            }, 2000);
        });
        it('destroy common event handlers', () => {
            pivotGridObj.commonModule.destroy();
            expect(true).toBeTruthy();
        });
        it('pivotgrid destroy', () => {
            pivotGridObj.destroy();
            expect(true).toBeTruthy();
        });
        it('pivotgrid destroy expect', () => {
            expect(pivotGridObj.element.innerHTML).toBe('');
        });
    });
});

describe('Grouping feature in UI', () => {
    describe(' -  Initial Rendering with Grouping module', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        let args: PivotCellSelectedEventArgs;
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(Grouping);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: ds,
                    expandAll: false,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    rows: [{ name: 'product', caption: 'Category' }],
                    values: [{ name: 'balance', caption: 'Balance($)' }, { name: 'quantity' }],
                    columns: [{ name: 'age' }],
                    filters: [{ name: 'gender', caption: 'Population' }, { name: 'date', caption: 'TimeLine' }],
                    groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters'] },
                    { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                    { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }],
                },
                height: 500,
                allowGrouping: true,
                dataBound: dataBound,
                cellSelected: function (arg: PivotCellSelectedEventArgs): void {
                    args = arg;
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let shiftClick: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'shiftKey': true
        });
        let ctrlClick: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'ctrlKey': true
        });

        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 2000);
        });
        it('Check code-behind groups initially', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
                done();
            }, 2000);
        });
        it('contextmenu in row header', () => {
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('check context menu in row header', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                done();
            }, 2000);
        });
        it('Perform group option for false statement', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-pivot-error-dialog')).toBeTruthy();
                (document.querySelector('.e-pivot-error-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Perform ungroup option', (done: Function) => {
            expect(document.querySelector('.e-pivot-error-dialog') == null).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].textContent).toBe('Flight');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].querySelector('.e-expand')).toBeTruthy();
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Jet');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].querySelector('.e-expand')).toBeTruthy();
                done();
            }, 2000);
        });
        it('Expand All', (done: Function) => {
            pivotGridObj.dataSourceSettings.expandAll = true;
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Flight');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[2].querySelector('.e-collapse')).toBeTruthy();
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Flight');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[8].textContent).toBe('Jet');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[8].querySelector('.e-collapse')).toBeTruthy();
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9].textContent).toBe('Jet');
                done();
            }, 2000);
        });
        it('Create new group from selction Jet keyboard ctrl + mouse click', function (done) {
            document.querySelector('[aria-colindex="0"][index="10"]').dispatchEvent(ctrlClick);
            setTimeout(function () {
                expect(args.selectedCellsInfo[0].rowHeaders).toBe('Jet');
                document.querySelector('[aria-colindex="0"][index="4"]').dispatchEvent(ctrlClick);
                done();
            }, 2000);
        });
        it('Flight keyboard ctrl + mouse click', function (done) {
            expect(args.selectedCellsInfo[0].rowHeaders).toBe('Flight');
            setTimeout(function () {
                pivotGridObj.lastCellClicked = document.querySelector('[aria-colindex="0"][index="4"]');
                let cell: HTMLElement = document.querySelector('[aria-colindex="0"][index="4"]');
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 2000);
        });
        it('Context menu in selected headers', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                done();
            }, 2000);
        });
        it('Perform group option for selected headers', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('Category3');
                done();
            }, 2000);
        });
        it('Update without group name for false statement', (done: Function) => {
            (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                done();
            }, 2000);
        });
        it('Assign new group name for selected headers', (done: Function) => {
            let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(input1).toBeTruthy;
            input1.value = 'Airways';
            setTimeout(() => {
                expect(input1.value).toBe('Airways');
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Check updated new group selected headers in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].textContent).toBe('Flight');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Flight');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Jet');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[4].textContent).toBe('Jet');
                done();
            }, 2000);
        });
        it('Context menu in column header for number grouping', (done: Function) => {
            expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
            pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
            let cell: HTMLElement = document.querySelector('.e-columnsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                done();
            }, 2000);
        });
        it('Perform group option', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group_interval_input').getAttribute('value')).toBe('5');
                done();
            }, 2000);
        });
        it('Change grouping interval to 10', (done: Function) => {
            let option1: CheckBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_start_option') as HTMLElement, CheckBox) as CheckBox;
            let input1: NumericTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_interval_input') as HTMLElement, NumericTextBox) as NumericTextBox;
            expect(option1).toBeTruthy;
            expect(input1).toBeTruthy;
            option1.click();
            input1.value = 10;
            setTimeout(() => {
                expect(input1.value).toBe(10);
                expect(option1.checked).toBe(false);
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Check updated number grouping in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('20-29');
                pivotGridObj.lastCellClicked = pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9];
                let cell: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 2000);
        });
        it('Perform ungrouping custom groups', (done: Function) => {
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Bike');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].querySelector('.e-expand') == null).toBeTruthy();
                pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
                let cell: HTMLElement = document.querySelector('.e-columnsheader');
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 2000);
        });
        it('Perform ungrouping the number groups', (done: Function) => {
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('20');
                done();
            }, 2000);
        });
        it('Create new group from selction 20 keyboard shift + mouse click', function (done) {
            document.querySelectorAll('th[aria-colindex="1"]')[0].dispatchEvent(shiftClick);
            setTimeout(function () {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('20');
                document.querySelectorAll('th[aria-colindex="11"]')[0].dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('25 keyboard shift + mouse click', function (done) {
            expect(args.selectedCellsInfo[5].columnHeaders).toBe('25');
            setTimeout(function () {
                pivotGridObj.lastCellClicked = document.querySelectorAll('th[aria-colindex="1"]')[0];
                let cell: HTMLElement = document.querySelectorAll('th[aria-colindex="1"]')[0] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 2000);
        });
        it('Perform group option for selected headers', (done: Function) => {
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('age2');
                done();
            }, 2000);
        });
        it('Assign new group name for selected headers', (done: Function) => {
            let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(input1).toBeTruthy;
            input1.value = '.Check';
            setTimeout(() => {
                expect(input1.value).toBe('.Check');
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Check updated new group selected headers in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('.Check');
                done();
            }, 2000);
        });
    });

    describe(' -  With All Features(Field list, Grouping Bar, Value sorting, Single value header and Editing', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        let args: PivotCellSelectedEventArgs;
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(Grouping, GroupingBar, FieldList, DrillThrough);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: ds,
                    expandAll: false,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    filterSettings: [{ name: 'gender', items: ['male'], type: 'Exclude' }],
                    rows: [{ name: 'product', caption: 'Category' }],
                    values: [{ name: 'balance', caption: 'Balance' }, { name: 'price', caption: 'Totals' }],
                    columns: [{ name: 'age' }],
                    filters: [{ name: 'gender', caption: 'Population' }, { name: 'date', caption: 'TimeLine' }],
                    calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                    groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10) },
                    { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                    { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }],
                    alwaysShowValueHeader: true
                },
                height: 500,
                allowGrouping: true,
                enableValueSorting: true,
                allowDrillThrough: true,
                editSettings: {
                    allowAdding: true, allowDeleting: true, allowEditing: true,
                    showConfirmDialog: false, showDeleteConfirmDialog: false, allowCommandColumns: false, mode: 'Normal'
                },
                beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
                    if (args.gridObj) {
                        let eventType: string = args.type;
                        let gridObj: Grid = args.gridObj;
                        gridObj.allowKeyboard = false;
                    }
                },
                showGroupingBar: true,
                showFieldList: true,
                dataBound: dataBound,
                cellSelected: function (arg: PivotCellSelectedEventArgs): void {
                    args = arg;
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let shiftClick: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'shiftKey': true
        });
        let ctrlClick: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'ctrlKey': true
        });
        let event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let mouseup: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let mousedown: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 2000);
        });
        it('check window resize with grouping bar', () => {
            pivotGridObj.onWindowResize();
            pivotGridObj.renderModule.updateGridSettings();
            expect(true).toBeTruthy();
        });
        it('grouping bar render testing', () => {
            expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            pivotGridObj.dataBind();
            pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
            expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
        });
        it('field list render testing', () => {
            pivotGridObj.dataBind();
            expect(pivotGridObj.pivotFieldListModule).not.toBeUndefined;
        });
        it('check open field list popup', () => {
            (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('check close field list', () => {
            let controlWrapper: HTMLElement = document.querySelector('.e-pivotfieldlist-container');
            (controlWrapper.querySelector('.e-cancel-btn') as HTMLElement).click();
            expect(document.querySelector('.e-pivotfieldlist-container').classList.contains('e-popup-close'));
        });
        it('Check code-behind groups initially', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 2000);
        });
        it('Check single value header', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Four wheelers');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 2000);
        });
        it('check sorting order field', () => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Bike');
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBe(2);
            expect((pivotButtons[0]).querySelector('.e-ascend')).toBeTruthy;
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('sorting order after update', () => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Four wheelers');
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBe(2);
            expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
        });
        it('check filtering field', (done: Function) => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBe(3);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            setTimeout(() => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 2000);
        });
        it('check all nodes on filter popup', () => {
            let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
            let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(allNode.classList.contains('e-small')).toBe(false);
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkEle.length).toEqual(checkedEle.length);
            expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter state after update', () => {
            let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
            expect(filterDialog).toBeUndefined;
        });
        it('check remove pivot button', (done: Function) => {
            let pivotButton: HTMLElement =
                (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
            expect(pivotButton.id).toBe('gender');
            (pivotButton.querySelector('.e-remove') as HTMLElement).click();
            setTimeout(() => {
                pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton).toBeTruthy();
                done();
            }, 2000);
        });
        it('check drag and drop pivot button', (done: Function) => {
            let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
            let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseOverEventArgs: any = extend({}, mousemove, null, true);
            mouseOverEventArgs.type = 'mouseover';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
            let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
            mouseLeaveEventArgs.type = 'mouseleave';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, filterAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = filterAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect((pivotButton[1].id)).toBe("date_date_group_years");
                done();
            }, 2000);
        });
        it('contextmenu in row header', () => {
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('check context menu in row header', (done: Function) => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                done();
            }, 2000);
        });
        it('Perform group option for false statement', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-pivot-error-dialog')).toBeTruthy();
                (document.querySelector('.e-pivot-error-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Perform ungroup option', (done: Function) => {
            expect(document.querySelector('.e-pivot-error-dialog') == null).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].textContent).toBe('Flight');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].querySelector('.e-expand')).toBeTruthy();
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Jet');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].querySelector('.e-expand')).toBeTruthy();
                done();
            }, 2000);
        });
        it('check pivot button maintenance', () => {
            let pivotButton: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            expect(pivotButton[0].id).toBe('date');
        });
        it('Create new group from selction Jet keyboard ctrl + mouse click', function (done) {
            document.querySelector('[aria-colindex="0"][index="10"]').dispatchEvent(ctrlClick);
            setTimeout(function () {
                expect(args.selectedCellsInfo[0].rowHeaders).toBe('Jet');
                document.querySelector('[aria-colindex="0"][index="4"]').dispatchEvent(ctrlClick);
                done();
            }, 2000);
        });
        it('Flight keyboard ctrl + mouse click', function (done) {
            expect(args.selectedCellsInfo[0].rowHeaders).toBe('Flight');
            setTimeout(function () {
                pivotGridObj.lastCellClicked = document.querySelector('[aria-colindex="0"][index="4"]');
                let cell: HTMLElement = document.querySelector('[aria-colindex="0"][index="4"]');
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 2000);
        });
        it('Context menu in selected headers', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                done();
            }, 2000);
        });
        it('Perform group option for selected headers', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('Category3');
                done();
            }, 2000);
        });
        it('Update without group name for false statement', (done: Function) => {
            (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                done();
            }, 2000);
        });
        it('Assign new group name for selected headers', (done: Function) => {
            let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(input1).toBeTruthy;
            input1.value = 'Airways';
            setTimeout(() => {
                expect(input1.value).toBe('Airways');
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Check updated new group selected headers in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].textContent).toBe('Flight');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Flight');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Jet');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[4].textContent).toBe('Jet');
                done();
            }, 2000);
        });
        it('check pivot button maintenance', () => {
            let pivotButton: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            expect(pivotButton[0].id).toBe('date');
        });
        it('Context menu in column header for number grouping', (done: Function) => {
            expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
            pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
            let cell: HTMLElement = document.querySelector('.e-columnsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                done();
            }, 2000);
        });
        it('Perform group option', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group_interval_input').getAttribute('value')).toBe('5');
                done();
            }, 2000);
        });
        it('Change grouping interval to 10', (done: Function) => {
            let option1: CheckBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_start_option') as HTMLElement, CheckBox) as CheckBox;
            let input1: NumericTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_interval_input') as HTMLElement, NumericTextBox) as NumericTextBox;
            expect(option1).toBeTruthy;
            expect(input1).toBeTruthy;
            option1.click();
            input1.value = 10;
            setTimeout(() => {
                expect(input1.value).toBe(10);
                expect(option1.checked).toBe(false);
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Check updated number grouping in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('20-29');
                pivotGridObj.lastCellClicked = pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9];
                let cell: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 2000);
        });
        it('check pivot button maintenance', () => {
            let pivotButton: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            expect(pivotButton[0].id).toBe('date');
        });
        it('Perform ungrouping custom groups', (done: Function) => {
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Bike');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].querySelector('.e-expand') == null).toBeTruthy();
                pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
                let cell: HTMLElement = document.querySelector('.e-columnsheader');
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 2000);
        });
        it('Perform ungrouping the number groups', (done: Function) => {
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('20');
                pivotGridObj.enableValueSorting = false;
                done();
            }, 2000);
        });
        it('Create new group from selction 20 keyboard shift + mouse click', function (done) {
            document.querySelectorAll('th[aria-colindex="1"]')[0].dispatchEvent(shiftClick);
            setTimeout(function () {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('20');
                document.querySelectorAll('th[aria-colindex="11"]')[0].dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('25 keyboard shift + mouse click', function (done) {
            expect(args.selectedCellsInfo[5].columnHeaders).toBe('25');
            setTimeout(function () {
                pivotGridObj.lastCellClicked = document.querySelectorAll('th[aria-colindex="1"]')[0];
                let cell: HTMLElement = document.querySelectorAll('th[aria-colindex="1"]')[0] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 2000);
        });
        it('Perform group option for selected headers', (done: Function) => {
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('age2');
                done();
            }, 2000);
        });
        it('Assign new group name for selected headers', (done: Function) => {
            let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(input1).toBeTruthy;
            input1.value = '.Check';
            setTimeout(() => {
                expect(input1.value).toBe('.Check');
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Check updated new group selected headers in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('.Check');
                done();
            }, 2000);
        });
        it('check drag and drop pivot button from column to filter axis', (done: Function) => {
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
            let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseOverEventArgs: any = extend({}, mousemove, null, true);
            mouseOverEventArgs.type = 'mouseover';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
            let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
            mouseLeaveEventArgs.type = 'mouseleave';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, filterAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = filterAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                expect((pivotButton[2].id)).toBe("age_custom_group");
                done();
            }, 2000);
        });
        it('click 20-balance for editing', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("19");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 2000);
        });
        it('check pivot button maintenance', () => {
            let pivotButton: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            expect(pivotButton[0].id).toBe('date');
        });
        it('check drag and drop pivot button from row to filter axis', (done: Function) => {
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(1);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseOverEventArgs: any = extend({}, mousemove, null, true);
            mouseOverEventArgs.type = 'mouseover';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
            let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
            mouseLeaveEventArgs.type = 'mouseleave';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, filterAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = filterAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(4);
                expect((pivotButton[3].id)).toBe("product");
                done();
            }, 2000);
        });
        it('check drag and drop pivot button from filter to row axis', (done: Function) => {
            let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(4);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseOverEventArgs: any = extend({}, mousemove, null, true);
            mouseOverEventArgs.type = 'mouseover';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
            let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
            mouseLeaveEventArgs.type = 'mouseleave';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                expect((pivotButton[0].id)).toBe("date");
                done();
            }, 2000);
        });
        it('Context menu in row header for date grouping', (done: Function) => {
            expect(pivotGridObj.element.querySelector('.e-rowsheader').textContent).toBe('Out of Range');
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                done();
            }, 2000);
        });
        it('Perform group option', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-multi-select-wrapper').querySelector('.e-delim-view.e-delim-values').textContent).toBe('Years, Quarters');
                done();
            }, 2000);
        });
        it('Change grouping interval to Months', (done: Function) => {
            let option1: CheckBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_start_option') as HTMLElement, CheckBox) as CheckBox;
            let input1: MultiSelect = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_interval_input') as HTMLElement, MultiSelect) as MultiSelect;
            expect(option1).toBeTruthy;
            expect(input1).toBeTruthy;
            option1.click();
            input1.value = ['Months'];
            setTimeout(() => {
                expect(option1.checked).toBe(false);
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Check updated number grouping in table', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
                expect(pivotGridObj.element.querySelector('.e-rowsheader').textContent).toBe('Jan');
                done();
            }, 2000);
        });
        it('check pivot button maintenance', () => {
            let pivotButton: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            expect(pivotButton[0].id).toBe('age_custom_group');
            pivotButton = [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(1);
            expect(pivotButton[0].id).toBe('date');
            pivotButton = [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(1);
            expect(pivotButton[0].id).toBe('age');
            pivotGridObj.lastCellClicked = pivotGridObj.element.querySelector('.e-rowsheader');
            let cell: HTMLElement = pivotGridObj.element.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('Create new group from selction 20/01/1970-10:54 AM keyboard shift + mouse click', function (done) {
            pivotGridObj.element.querySelector('.e-rowsheader').dispatchEvent(shiftClick);
            setTimeout(function () {
                expect(args.selectedCellsInfo[0].rowHeaders).toBe('20/01/1970-10:54 AM');
                document.querySelector('td[aria-colindex="0"][index="420"]').dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('01/01/2018-09:50 AM keyboard shift + mouse click', function (done) {
            expect(args.selectedCellsInfo[416].rowHeaders).toBe('01/01/2018-09:50 AM');
            setTimeout(function () {
                pivotGridObj.lastCellClicked = pivotGridObj.element.querySelector('.e-rowsheader');
                let cell: HTMLElement = pivotGridObj.element.querySelector('.e-rowsheader');
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 2000);
        });
        it('Perform group option for selected headers', (done: Function) => {
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('TimeLine2');
                done();
            }, 2000);
        });
        it('Assign new group name for selected headers', (done: Function) => {
            let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(input1).toBeTruthy;
            input1.value = '.Check';
            setTimeout(() => {
                expect(input1.value).toBe('.Check');
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Check updated new group selected headers in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelector('.e-rowsheader').textContent).toBe('.Check');
                done();
            }, 2000);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        //expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});