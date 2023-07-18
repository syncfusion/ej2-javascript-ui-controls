import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType, EventHandler, extend } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import {
    FieldDroppedEventArgs, ColumnRenderEventArgs
} from '../../src/common/base/interface';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

// cell template function
(<{ getCellContent?: Function }>window).getCellContent = (e: any) => {
    let template: string;
    if (e && e.targetCell.className.indexOf('e-valuescontent') > -1) {
        template = '<div class="caption" style="color: red;">Values</div>';
    } else if (e && e.targetCell.className.indexOf('e-columnsheader') > -1) {
        template = '<div class="caption" style="color: green;">Colum Header</div>';
    } else if (e && e.targetCell.className.indexOf('e-rowsheader') > -1) {
        template = '<div class="caption" style="color: blue;">Row Header</div>';
    }
    return template;
};
describe('Pivot Grid Cell Template', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('- Grouping Bar with injected Module - ', () => {
        let pivotGridObj: PivotView;
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
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    sortSettings: [{ name: 'company', order: 'Descending' }],
                    filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                    { name: 'company', type: 'Include', items: ['NIPAZ'] },
                    { name: 'gender', type: 'Include', items: ['male'] }],
                    rows: [{ name: 'company' }, { name: 'state' }],
                    columns: [{ name: 'name' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                },
                height: 400,
                width: 1000,
                showGroupingBar: true,
                groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false, showValueTypeIcon: false },
                dataBound: dataBound,
                gridSettings: {
                    columnRender: (args: ColumnRenderEventArgs) => {
                        args.columns[0].width = 200;
                        args.columns[1].allowReordering = true;
                        args.columns[1].allowResizing = true;
                    },
                    rowHeight: 90
                },
                cellTemplate: '<div class="templatewrap">${getCellContent(data)}</div>',
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
            expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).not.toBeTruthy;
            pivotGridObj.dataBind();
            pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
            expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).not.toBeTruthy;
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
            }, 1000);
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
            expect(pivotButton.id).toBe('PivotGrid_gender');
            (pivotButton.querySelector('.e-remove') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton).toBeNull();
                done();
            }, 1000);
        });
        it('check drag and drop pivot button', (done: Function) => {
            pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                args.droppedField.caption = "droppedButton"
            };
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
            let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-pvt-btn-content');
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
                expect(pivotButton.length).toEqual(3);
                expect((pivotButton[2].querySelector('.e-pvt-btn-content') as HTMLElement).innerText).toEqual("droppedButton");
                done();
            }, 1000);
        });
        it('check cell template', () => {
            expect(pivotGridObj.element.querySelectorAll('td')[4].childElementCount == 2).toBeTruthy();
            pivotGridObj.cellTemplate = '<script type="text/javascript">${getCellContent(data)}</script>';
            pivotGridObj.refresh();
        });
        it('check cell template with sanitizer', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td')[4].childElementCount == 2).toBeTruthy();
                pivotGridObj.enableHtmlSanitizer = false;
                pivotGridObj.refresh();
                done();
            }, 1000);
        });
        it('check cell template without sanitizer', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td')[4].childElementCount == 2).toBeTruthy();
                done();
            }, 1000);
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
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    sortSettings: [{ name: 'company', order: 'Descending' }],
                    filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                    { name: 'company', type: 'Include', items: ['NIPAZ'] },
                    { name: 'gender', type: 'Include', items: ['male'] }],
                    rows: [{ name: 'company' }, { name: 'state' }],
                    columns: [{ name: 'name' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                },
                showGroupingBar: true,
                showFieldList: true,
                dataBound: dataBound,
                gridSettings: {
                    rowHeight: 90
                },
                cellTemplate: '<div class="templatewrap">${getCellContent(data)}</div>',
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
            expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy;
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
            }, 1000);
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
            expect(pivotButton.id).toBe('PivotGrid_gender');
            (pivotButton.querySelector('.e-remove') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton).toBeNull();
                done();
            }, 1000);
        });
        it('check drag and drop pivot button', (done: Function) => {
            pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                args.droppedField.caption = "droppedButton"
            };
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
            let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                expect((pivotButton[2].querySelector('.e-pvt-btn-content') as HTMLElement).innerText).toEqual("droppedButton");
                done();
            }, 1000);
        });
        it('set rtl property', (done: Function) => {
            pivotGridObj.enableRtl = true;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.classList.contains('e-rtl')).toBeTruthy;
                done();
            }, 1000);
        });
        it('remove rtl property', (done: Function) => {
            pivotGridObj.enableRtl = false;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.classList.contains('e-rtl')).not.toBeTruthy;
                done();
            }, 1000);
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