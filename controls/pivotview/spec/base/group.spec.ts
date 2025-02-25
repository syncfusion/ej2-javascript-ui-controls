import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType, EventHandler, extend, getInstance } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { VirtualScroll } from '../../src/pivotview/actions';
import {
    FieldDroppedEventArgs, PivotCellSelectedEventArgs, ColumnRenderEventArgs, BeginDrillThroughEventArgs, HeadersSortEventArgs
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
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe(' -  With All Features(Field list, Grouping Bar, Value sorting, Single value header and Editing', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = pivotDatas as IDataSet[];
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
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(Grouping, GroupingBar, FieldList, DrillThrough);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
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
            setTimeout(() => { done(); }, 400);
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
        it('Check code-behind groups initially', () => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('Airways');
            (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
        });
        it('Check single value header', () => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('Airways');
            expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
            (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
        });
        it('check sorting order field', () => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('Four wheelers');
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBe(2);
            expect((pivotButtons[0]).querySelector('.e-ascend')).toBeTruthy;
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('sorting order after update', () => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('Four wheelers');
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBe(2);
            expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
        });
        it('check filtering field', (done: Function) => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('Airways');
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBe(3);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            setTimeout(() => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 200);
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
        it('check remove pivot button', () => {
            let pivotButton: HTMLElement = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
            expect(pivotButton.id).toBe('PivotGrid_gender');
            (pivotButton.querySelector('.e-remove') as HTMLElement).click();
            pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
            expect(pivotButton).toBeTruthy();
        });
        it('check drag and drop pivot button', () => {
            let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
            let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-pvt-btn-content');
            let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
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
            pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            expect((pivotButton[1].id)).toBe("PivotGrid_date_date_group_years");
        });
        it('contextmenu in row header', () => {
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('check context menu in row header', () => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('Airways');
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
        });
        it('Perform group option for false statement', () => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            expect(document.querySelector('.e-pivot-error-dialog')).toBeTruthy();
            (document.querySelector('.e-pivot-error-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('Perform ungroup option', (done: Function) => {
            setTimeout(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                expect(document.querySelector('.e-pivot-error-dialog') === null).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[1].textContent).toBe('Bike');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[1].querySelector('.e-expand')).toBeTruthy();
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[3].textContent).toBe('Grand Total');
                done();
            }, 1000);
        });
        it('check pivot button maintenance', () => {
            let pivotButton: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            expect(pivotButton[0].id).toBe('PivotGrid_date');
        });
        it('Create new group from selction Jet keyboard ctrl + mouse click', function (done) {
            document.querySelector('[aria-colindex="1"][index="3"]').dispatchEvent(ctrlClick);
            setTimeout(function () {
                expect(args.selectedCellsInfo[0].rowHeaders).toBe('Flight');
                document.querySelector('[aria-colindex="1"][index="4"]').dispatchEvent(ctrlClick);
                done();
            }, 500);
        });
        it('Flight keyboard ctrl + mouse click', function () {
            expect(args.selectedCellsInfo[0].rowHeaders).toBe('Flight');
            pivotGridObj.lastCellClicked = document.querySelector('[aria-colindex="1"][index="4"]');
            let cell: HTMLElement = document.querySelector('[aria-colindex="1"][index="4"]');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('Context menu in selected headers', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                done();
            }, 100);
        });
        it('Perform group option for selected headers', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('Category3');
                done();
            }, 100);
        });
        it('Update without group name for false statement', (done: Function) => {
            (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                done();
            }, 100);
        });
        it('Assign new group name for selected headers', (done: Function) => {
            let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(input1).toBeTruthy;
            input1.value = 'Airways';
            setTimeout(() => {
                expect(input1.value).toBe('Airways');
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 100);
        });
        it('Check updated new group selected headers in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('Airways');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[1].textContent).toBe('Bike');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[2].textContent).toBe('Jet');
                done();
            }, 100);
        });
        it('check pivot button maintenance', () => {
            let pivotButton: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            expect(pivotButton[0].id).toBe('PivotGrid_date');
        });
        it('Context menu in column header for number grouping', (done: Function) => {
            expect(pivotGridObj.element.querySelectorAll('th[data-colindex="1"]')[0].textContent).toBe('27-31');
            pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
            let cell: HTMLElement = document.querySelector('.e-columnsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                done();
            }, 100);
        });
        it('Perform group option', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group_interval_input').getAttribute('value')).toBe('5');
                done();
            }, 100);
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
            }, 100);
        });
        it('Check updated number grouping in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[data-colindex="1"]')[0].textContent).toBe('20-29');
                pivotGridObj.lastCellClicked = pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[2];
                let cell: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[2] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 100);
        });
        it('check pivot button maintenance', () => {
            let pivotButton: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            expect(pivotButton[0].id).toBe('PivotGrid_date');
        });
        it('Perform ungrouping custom groups', (done: Function) => {
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('Airways');
                pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
                let cell: HTMLElement = document.querySelector('.e-columnsheader');
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 100);
        });
        it('Perform ungrouping the number groups', (done: Function) => {
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[data-colindex="1"]')[0].textContent).toBe('20');
                pivotGridObj.enableValueSorting = false;
                done();
            }, 100);
        });
        it('Create new group from selction 20 keyboard shift + mouse click', function (done) {
            document.querySelectorAll('th[data-colindex="1"]')[0].dispatchEvent(shiftClick);
            setTimeout(function () {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('20');
                document.querySelectorAll('th[data-colindex="11"]')[0].dispatchEvent(shiftClick);
                done();
            }, 500);
        });
        it('25 keyboard shift + mouse click', function (done) {
            expect(args.selectedCellsInfo[5].columnHeaders).toBe('33');
            setTimeout(function () {
                pivotGridObj.lastCellClicked = document.querySelectorAll('th[data-colindex="1"]')[0];
                let cell: HTMLElement = document.querySelectorAll('th[data-colindex="1"]')[0] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 500);
        });
        it('Perform group option for selected headers', (done: Function) => {
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('age2');
                done();
            }, 200);
        });
        it('Assign new group name for selected headers', (done: Function) => {
            let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(input1).toBeTruthy;
            input1.value = '.Check';
            setTimeout(() => {
                expect(input1.value).toBe('.Check');
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 100);
        });
        it('Check updated new group selected headers in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[data-colindex="1"]')[0].textContent).toBe('.Check');
                done();
            }, 100);
        });
        it('check drag and drop pivot button from column to filter axis', (done: Function) => {
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
            let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-pvt-btn-content');
            let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
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
            setTimeout(() => {
                pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                expect((pivotButton[2].id)).toBe("PivotGrid_age_custom_group");
                done();
            }, 100);
        });
        it('click 20-balance for editing', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[0].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("19");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 400);
        });
        it('check pivot button maintenance', () => {
            let pivotButton: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            expect(pivotButton[0].id).toBe('PivotGrid_date');
        });
        it('check drag and drop pivot button from row to filter axis', (done: Function) => {
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-pvt-btn-content');
            let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
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
            setTimeout(() => {
                pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(4);
                expect((pivotButton[3].id)).toBe("PivotGrid_product_custom_group_custom_group");
                done();
            }, 100);
        });
        it('check drag and drop pivot button from filter to row axis', (done: Function) => {
            let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(4);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-pvt-btn-content');
            let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
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
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                expect((pivotButton[0].id)).toBe("PivotGrid_product_custom_group");
                done();
            }, 100);
        });
        it('Context menu in row header for date grouping', (done: Function) => {
            expect(pivotGridObj.element.querySelector('.e-rowsheader').textContent).toBe('Bike');
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                done();
            }, 100);
        });
        it('Perform-group-option', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows = [{ name: 'date', caption: 'TimeLine' }, { name: 'product', caption: 'Category' }];
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(function () {
                expect(document.querySelector('.e-pivot-error-dialog')).toBeTruthy();
                done();
            }, 100);
        });
        it('Perform group option', (done: Function) => {
            (document.querySelector('.e-ok-btn') as HTMLElement).click();
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-multi-select-wrapper').querySelector('.e-delim-view.e-delim-values').textContent).toBe('Years, Quarters');
                done();
            }, 400);
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
            }, 100);
        });
        it('Check updated number grouping in table', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
                expect(pivotGridObj.element.querySelector('.e-rowsheader').textContent).toBe('Feb');
                done();
            }, 100);
        });
        it('check pivot button maintenance', () => {
            let pivotButton: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            expect(pivotButton[0].id).toBe('PivotGrid_age_custom_group');
            pivotButton = [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            expect(pivotButton[0].id).toBe('PivotGrid_date');
            pivotButton = [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(1);
            expect(pivotButton[0].id).toBe('PivotGrid_age');
            pivotGridObj.lastCellClicked = pivotGridObj.element.querySelector('.e-rowsheader');
            let cell: HTMLElement = pivotGridObj.element.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('Create new group from selction Feb keyboard shift + mouse click', function (done) {
            pivotGridObj.element.querySelector('.e-rowsheader').dispatchEvent(shiftClick);
            setTimeout(function () {
                expect(1).toBe(1);
                done();
            }, 100);
        });
    });

    describe('Filter member', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(Grouping, GroupingBar, FieldList, DrillThrough);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    allowLabelFilter: true,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
                    { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
                    rows: [{ name: 'product', caption: 'Category' }],
                    values: [{ name: 'balance', caption: 'Balance($)' }, { name: 'quantity' }],
                    columns: [{ name: 'age' }],
                    filters: [{ name: 'gender', caption: 'Population' }, { name: 'date', caption: 'TimeLine' }],
                    groupSettings: [
                        { name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                    { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                    { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }
                    ]
                },
                allowDrillThrough: true,
                allowDataCompression: true,
                showGroupingBar: true,
                enableVirtualization: true,
                showFieldList: true,
                maxNodeLimitInMemberEditor: 0,
                showValuesButton: true,
                allowCalculatedField: true,
                allowGrouping: true,
                height: 500,
                width: 1000,
                dataBound: dataBound,
                onHeadersSort: (args: HeadersSortEventArgs) => {
                    if (args.fieldName == 'age') {
                        args.members = ['25-29', 'Out of Range'];
                        args.IsOrderChanged = true;
                    }
                },
                virtualScrollSettings: { allowSinglePage: false }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Filter testing1', () => {
            (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
            expect(1).toBe(1);
        });
        it('Filter testing2', () => {
            expect(document.querySelectorAll('.e-dialog').length > 0).toBeTruthy();
            (document.querySelectorAll('.e-cancel-btn')[0] as HTMLElement).click();
        });
        it('Filter testing3', () => {
            expect(document.querySelectorAll('.e-dialog').length > 0).toBeTruthy();
            (document.querySelectorAll('.e-btn-filter')[4] as HTMLElement).click();
        });
        it('Filter testing4', () => {
            expect((document.querySelectorAll('.e-maskedtextbox')[0] as HTMLInputElement).value === '').toBeTruthy();
            (document.querySelectorAll('.e-maskedtextbox')[0] as HTMLInputElement).value = 'k';
        });
        it('Filter testing5', () => {
            expect((document.querySelectorAll('.e-maskedtextbox')[0] as HTMLInputElement).value === 'k').toBeTruthy();
            (document.querySelectorAll('.e-cancel-btn')[0] as HTMLElement).click();
            pivotGridObj.maxNodeLimitInMemberEditor = 1000;
        });
        it('Filter testing6', function (done) {
            setTimeout(function () {
                expect(document.querySelectorAll('.e-btn-filter').length > 10).toBeTruthy();
                done();
            }, 1000);
        });
        it('Filter testing7', () => {
            (document.querySelectorAll('.e-btn-filter')[4] as HTMLElement).click();
            expect(document.querySelectorAll('.e-member-editor-container-outer-div').length > 0).toBeTruthy();
        });
        it('Filter testing8', () => {
            expect((document.querySelectorAll('.e-maskedtextbox')[0] as HTMLInputElement).value === '').toBeTruthy();
            (document.querySelectorAll('.e-maskedtextbox')[0] as HTMLInputElement).value = 'k';
        });
        it('Filter testing9', () => {
            expect((document.querySelectorAll('.e-maskedtextbox')[0] as HTMLInputElement).value === 'k').toBeTruthy();
            (document.querySelectorAll('.e-cancel-btn')[0] as HTMLElement).click();
        });
    });

    describe('- Dynamically updating the data source with group settings', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Grouping);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    rows: [{ name: 'date', caption: 'Date' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false,
                    groupSettings: [
                        { name: 'date', type: 'Date', groupInterval: ['Years', 'Months'] }
                    ]
                },
                width: '100%',
                height: 300,
                allowCalculatedField: true,
                allowExcelExport: true,
                allowPdfExport: true,
                showFieldList: true,
                enableVirtualization: true,
                showGroupingBar: true,
                allowGrouping: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 500);
        });
        it('- Updating entire data source setting', (done: Function) => {
            pivotGridObj.dataSourceSettings = { ...pivotGridObj.dataSourceSettings, dataSource: pivotData };
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rowsheader')[0].textContent).toBe('1991');
                done();
            }, 1000);
        });
        it('- Updating group settings', (done: Function) => {
            pivotGridObj.dataSourceSettings.groupSettings = [
                { name: 'date', type: 'Date', groupInterval: ['Months'] }
            ];
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rowsheader')[0].textContent).toBe('Feb');
                done();
            }, 1000);
        });
        it('- Updating data source alone', (done: Function) => {
            pivotGridObj.dataSourceSettings.dataSource = [];
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rowsheader')[0].textContent).toBe('Grand Total');
                done();
            }, 1000);
        });
    });

    describe(' -  Date Grouping', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = pivotGroupingData as IDataSet[];
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
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(Grouping, GroupingBar, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotGroupingData as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    allowLabelFilter: true,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    rows: [{ name: 'date'}],
                    values: [{ name: 'balance', caption: 'Balance($)' }, { name: 'quantity' }],
                    columns: [{ name: 'age' }],
                    filters: [{ name: 'gender', caption: 'Population' }],
                    groupSettings: [
                        { name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2000, 10, 5) },
                        { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 }
                    ]
                },
                height: 500,
                allowGrouping: true,
                showGroupingBar: true,
                showFieldList: true,
                dataBound: dataBound,

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
            setTimeout(() => { done(); }, 400);
        });
        it('Sort date field in ascending order', () => {
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBe(2);
            expect((pivotButtons[0]).querySelector('.e-ascend')).toBeTruthy;
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('Sort date field in descending order', () => {
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBe(2);
            expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('Open contextmenu in row header', () => {
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('Check context menu in row header', () => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('1975');
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
        });
        it('Perform ungroup option', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('30/08/1975-04:32 PM');
                done();
            }, 1000);
        });
    });

    describe(' -  Custom Grouping', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = pivotDatas as IDataSet[];
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
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(Grouping, GroupingBar, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    allowLabelFilter: true,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }],
                    rows: [{ name: 'product'}],
                    values: [{ name: 'balance', caption: 'Balance($)' }, { name: 'quantity' }],
                    columns: [{ name: 'age' }],
                    filters: [{ name: 'gender', caption: 'Population' }],
                    groupSettings: [
                        { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                        { name: 'product', type: 'Custom', customGroups: [{ groupName: 'A Four wheelers', items: ['Car', 'Tempo', 'Van'] }] }
                    ]
                },
                height: 500,
                allowGrouping: true,
                showGroupingBar: true,
                showFieldList: true,
                dataBound: dataBound,

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
            setTimeout(() => { done(); }, 400);
        });
        it('Open contextmenu in row header', () => {
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('Check context menu in row header', () => {
            expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('A Four wheelers');
            expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
        });
        it('Perform ungroup option', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('Bike');
                done();
            }, 1000);
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

    describe('- Number grouping with decimal values', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Grouping);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: decimalData as IDataSet[],
                    columns: [],
                    valueSortSettings: { headerDelimiter: ' - ' },
                    values: [{ name: 'Amount', caption: 'Sold Amount' }],
                    rows: [{ name: 'Sold' }],
                    expandAll: false,
                    filters: [],
                    groupSettings: [{ name: 'Sold', type: 'Number', startingAt: 0.1, endingAt: 0.7, rangeInterval: 0.1 }]
                },
                width: '100%',
                height: 300,
                allowCalculatedField: true,
                allowExcelExport: true,
                allowPdfExport: true,
                showFieldList: true,
                enableVirtualization: true,
                showGroupingBar: true,
                allowGrouping: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 500);
        });
        it('- Checking grouped row header', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rowsheader')[0].textContent).toBe('0.1-0.2');
                done();
            }, 1000);
        });
    });
});

let pivotDatas: IDataSet[] = [
    {
        _id: "5a940692c2d185d9fde50e5e",
        index: 0,
        guid: "810a1191-81bd-4c18-ac73-d16ad3fc80eb",
        isActive: "false",
        balance: 2430.87,
        advance: 7658,
        quantity: 11,
        age: 21,
        eyeColor: "blue",
        name: "Skinner Ward",
        gender: "male",
        company: "GROK",
        email: "skinnerward@grok.com",
        phone: "+1 (931) 600-3042",
        date: "Wed Feb 16 2000 15:01:01 GMT+0530 (India Standard Time)",
        product: "Flight",
        state: "New Jercy",
        pno: "FEDD2340",
    },
    {
        _id: "5a940692c5752f1ed81bbb3d",
        index: 1,
        guid: "41c9986b-ccef-459e-a22d-5458bbdca9c7",
        isActive: "true",
        balance: 3192.7,
        advance: 6124,
        quantity: 15,

        age: 27,
        eyeColor: "brown",
        name: "Gwen Dixon",
        gender: "female",
        company: "ICOLOGY",
        email: "gwendixon@icology.com",
        phone: "+1 (951) 589-2187",
        date: "Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)",
        product: "Jet",
        state: "Vetaikan",
        pno: "ERTS4512",
    },
    {
        _id: "5a9406924c0e7f4c98a82ca7",
        index: 2,
        guid: "50d2bf16-9092-4202-84f6-e892721fe5a5",
        isActive: "true",
        balance: 1663.84,
        advance: 7631,
        quantity: 14,

        age: 28,
        eyeColor: "green",
        name: "Deena Gillespie",
        gender: "female",
        company: "OVERPLEX",
        email: "deenagillespie@overplex.com",
        phone: "+1 (826) 588-3430",
        date: "Thu Mar 18 1993 17:07:48 GMT+0530 (India Standard Time)",
        product: "Car",
        state: "New Jercy",
        pno: "ERTS4512",
    },
    {
        _id: "5a940692dd9db638eee09828",
        index: 3,
        guid: "b8bdc65e-4338-440f-a731-810186ce0b3a",
        isActive: "true",
        balance: 1601.82,
        advance: 6519,
        quantity: 18,

        age: 33,
        eyeColor: "green",
        name: "Susanne Peterson",
        gender: "female",
        company: "KROG",
        email: "susannepeterson@krog.com",
        phone: "+1 (868) 499-3292",
        date: "Sat Feb 09 2002 04:28:45 GMT+0530 (India Standard Time)",
        product: "Jet",
        state: "Vetaikan",
        pno: "CCOP1239",
    },
    {
        _id: "5a9406926f9971a87eae51af",
        index: 4,
        guid: "3f4c79ec-a227-4210-940f-162ca0c293de",
        isActive: "false",
        balance: 1855.77,
        advance: 7333,
        quantity: 20,

        age: 33,
        eyeColor: "green",
        name: "Stokes Hicks",
        gender: "male",
        company: "SIGNITY",
        email: "stokeshicks@signity.com",
        phone: "+1 (927) 585-2980",
        date: "Fri Mar 12 2004 11:08:06 GMT+0530 (India Standard Time)",
        product: "Van",
        state: "Tamilnadu",
        pno: "MEWD9812",
    },
    {
        _id: "5a940692bcbbcdde08fcf7ec",
        index: 5,
        guid: "1d0ee387-14d4-403e-9a0c-3a8514a64281",
        isActive: "true",
        balance: 1372.23,
        advance: 5668,
        quantity: 16,

        age: 39,
        eyeColor: "green",
        name: "Sandoval Nicholson",
        gender: "male",
        company: "IDEALIS",
        email: "sandovalnicholson@idealis.com",
        phone: "+1 (951) 438-3539",
        date: "Sat Aug 30 1975 22:02:15 GMT+0530 (India Standard Time)",
        product: "Bike",
        state: "Tamilnadu",
        pno: "CCOP1239",
    },
    {
        _id: "5a940692ff31a6e1cdd10487",
        index: 6,
        guid: "58417d45-f279-4e21-ba61-16943d0f11c1",
        isActive: "false",
        balance: 2008.28,
        advance: 7107,
        quantity: 14,

        age: 20,
        eyeColor: "brown",
        name: "Blake Thornton",
        gender: "male",
        company: "IMMUNICS",
        email: "blakethornton@immunics.com",
        phone: "+1 (852) 462-3571",
        date: "Mon Oct 03 2005 05:16:53 GMT+0530 (India Standard Time)",
        product: "Tempo",
        state: "New Jercy",
        pno: "CCOP1239",
    },
    {
        _id: "5a9406928f2f2598c7ac7809",
        index: 7,
        guid: "d16299e3-e243-4e57-90fb-52446c4c0275",
        isActive: "false",
        balance: 2052.58,
        advance: 7431,
        quantity: 20,

        age: 22,
        eyeColor: "blue",
        name: "Dillard Sharpe",
        gender: "male",
        company: "INEAR",
        email: "dillardsharpe@inear.com",
        phone: "+1 (963) 473-2308",
        date: "Thu May 25 1978 04:57:00 GMT+0530 (India Standard Time)",
        product: "Tempo",
        state: "Rajkot",
        pno: "ERTS4512",
    },
];

let pivotData: IDataSet[] = [
    {
        _id: "5a940692c2d185d9fde50e5e",
        index: 0,
        guid: "810a1191-81bd-4c18-ac73-d16ad3fc80eb",
        isActive: "false",
        balance: 2430.87,
        advance: 7658,
        quantity: 11,
        age: 21,
        eyeColor: "blue",
        name: "Skinner Ward",
        gender: "male",
        company: "GROK",
        email: "skinnerward@grok.com",
        phone: "+1 (931) 600-3042",
        date: "Wed Feb 16 2000 15:01:01 GMT+0530 (India Standard Time)",
        product: "Flight",
        state: "New Jercy",
        pno: "FEDD2340",
    },
    {
        _id: "5a940692c5752f1ed81bbb3d",
        index: 1,
        guid: "41c9986b-ccef-459e-a22d-5458bbdca9c7",
        isActive: "true",
        balance: 3192.7,
        advance: 6124,
        quantity: 15,
        age: 27,
        eyeColor: "brown",
        name: "Gwen Dixon",
        gender: "female",
        company: "ICOLOGY",
        email: "gwendixon@icology.com",
        phone: "+1 (951) 589-2187",
        date: "Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)",
        product: "Jet",
        state: "Vetaikan",
        pno: "ERTS4512",
    },
]

let pivotGroupingData: IDataSet[] = [
    {
        _id: "5a940692c2d185d9fde50e5e",
        index: 0,
        guid: "810a1191-81bd-4c18-ac73-d16ad3fc80eb",
        isActive: "false",
        balance: 2430.87,
        advance: 7658,
        quantity: 11,
        age: 21,
        eyeColor: "blue",
        name: "Skinner Ward",
        gender: "male",
        company: "GROK",
        email: "skinnerward@grok.com",
        phone: "+1 (931) 600-3042",
        date: "Wed Feb 16 2000 15:01:01 GMT+0530 (India Standard Time)",
        product: "Flight",
        state: "New Jercy",
        pno: "FEDD2340",
    },
    {
        _id: "5a940692c5752f1ed81bbb3d",
        index: 1,
        guid: "41c9986b-ccef-459e-a22d-5458bbdca9c7",
        isActive: "true",
        balance: 3192.7,
        advance: 6124,
        quantity: 15,

        age: 27,
        eyeColor: "brown",
        name: "Gwen Dixon",
        gender: "female",
        company: "ICOLOGY",
        email: "gwendixon@icology.com",
        phone: "+1 (951) 589-2187",
        date: "Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)",
        product: "Jet",
        state: "Vetaikan",
        pno: "ERTS4512",
    },
    {
        _id: "5a9406924c0e7f4c98a82ca7",
        index: 2,
        guid: "50d2bf16-9092-4202-84f6-e892721fe5a5",
        isActive: "true",
        balance: 1663.84,
        advance: 7631,
        quantity: 14,

        age: 28,
        eyeColor: "green",
        name: "Deena Gillespie",
        gender: "female",
        company: "OVERPLEX",
        email: "deenagillespie@overplex.com",
        phone: "+1 (826) 588-3430",
        date: "Thu Mar 18 1993 17:07:48 GMT+0530 (India Standard Time)",
        product: "Car",
        state: "New Jercy",
        pno: "ERTS4512",
    },
    {
        _id: "5a940692dd9db638eee09828",
        index: 3,
        guid: "b8bdc65e-4338-440f-a731-810186ce0b3a",
        isActive: "true",
        balance: 1601.82,
        advance: 6519,
        quantity: 18,

        age: 33,
        eyeColor: "green",
        name: "Susanne Peterson",
        gender: "female",
        company: "KROG",
        email: "susannepeterson@krog.com",
        phone: "+1 (868) 499-3292",
        date: "Sat Feb 09 2002 04:28:45 GMT+0530 (India Standard Time)",
        product: "Jet",
        state: "Vetaikan",
        pno: "CCOP1239",
    },
    {
        _id: "5a9406926f9971a87eae51af",
        index: 4,
        guid: "3f4c79ec-a227-4210-940f-162ca0c293de",
        isActive: "false",
        balance: 1855.77,
        advance: 7333,
        quantity: 20,

        age: 33,
        eyeColor: "green",
        name: "Stokes Hicks",
        gender: "male",
        company: "SIGNITY",
        email: "stokeshicks@signity.com",
        phone: "+1 (927) 585-2980",
        date: "Fri Mar 12 2004 11:08:06 GMT+0530 (India Standard Time)",
        product: "Van",
        state: "Tamilnadu",
        pno: "MEWD9812",
    },
    {
        _id: "5a940692bcbbcdde08fcf7ec",
        index: 5,
        guid: "1d0ee387-14d4-403e-9a0c-3a8514a64281",
        isActive: "true",
        balance: 1372.23,
        advance: 5668,
        quantity: 16,

        age: 39,
        eyeColor: "green",
        name: "Sandoval Nicholson",
        gender: "male",
        company: "IDEALIS",
        email: "sandovalnicholson@idealis.com",
        phone: "+1 (951) 438-3539",
        date: "Sat Aug 30 1975 22:02:15 GMT+0530 (India Standard Time)",
        product: "Bike",
        state: "Tamilnadu",
        pno: "CCOP1239",
    },
    {
        _id: "5a940692ff31a6e1cdd10487",
        index: 6,
        guid: "58417d45-f279-4e21-ba61-16943d0f11c1",
        isActive: "false",
        balance: 2008.28,
        advance: 7107,
        quantity: 14,

        age: 20,
        eyeColor: "brown",
        name: "Blake Thornton",
        gender: "male",
        company: "IMMUNICS",
        email: "blakethornton@immunics.com",
        phone: "+1 (852) 462-3571",
        date: "Mon Oct 03 2005 05:16:53 GMT+0530 (India Standard Time)",
        product: "Tempo",
        state: "New Jercy",
        pno: "CCOP1239",
    },
    {
        _id: "5a9406928f2f2598c7ac7809",
        index: 7,
        guid: "d16299e3-e243-4e57-90fb-52446c4c0275",
        isActive: "false",
        balance: 2052.58,
        advance: 7431,
        quantity: 20,

        age: 22,
        eyeColor: "blue",
        name: "Dillard Sharpe",
        gender: "male",
        company: "INEAR",
        email: "dillardsharpe@inear.com",
        phone: "+1 (963) 473-2308",
        date: "Thu May 25 1978 04:57:00 GMT+0530 (India Standard Time)",
        product: "Tempo",
        state: "Rajkot",
        pno: "ERTS4512",
    },
];
let decimalData: IDataSet[] = [
    { 'Sold': 0.1, 'Amount': 42600, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q4' },
    { 'Sold': 0.25, 'Amount': 46008, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2016', 'Quarter': 'Q1' },
    { 'Sold': 0.3, 'Amount': 83496, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2016', 'Quarter': 'Q2' },
    { 'Sold': 0.4, 'Amount': 52824, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q1' },
    { 'Sold': 0.5, 'Amount': 86904, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q2' },
    { 'Sold': 0.6, 'Amount': 153360, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2017', 'Quarter': 'Q4' },
    { 'Sold': 0.7, 'Amount': 161880, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2016', 'Quarter': 'Q3' },
    { 'Sold': 0.8, 'Amount': 114168, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2016', 'Quarter': 'Q4' },
    { 'Sold': 1.2, 'Amount': 153360, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q3' },
];