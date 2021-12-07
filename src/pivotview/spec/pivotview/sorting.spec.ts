import { IDataSet } from '../../src/base/engine';
import { pivot_dataset, pivot_nodata } from '../base/datasource.spec';
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

// Field based sorting option 
describe('- PivotGrid with Field based sorting option - ', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Grouping Bar with injected Module - ', () => {
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
                    filterSettings: [{ name: 'state', type: 'Exclude', items: ['Delhi'] }],
                    sortSettings: [{ name: 'product', order: 'None' },
                    { name: 'eyeColor', order: 'Descending' },
                    { name: 'date', order: 'None' }],
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [{ name: 'state' }],
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
                },
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
            expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy;
            pivotGridObj.dataBind();
            pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
            expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy;
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
            expect(pivotButton.id).toBe('state');
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
                expect(pivotButton.length).toEqual(3);
                expect((pivotButton[2].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
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
                    filterSettings: [{ name: 'state', type: 'Exclude', items: ['Delhi'] }],
                    sortSettings: [{ name: 'product', order: 'None' },
                    { name: 'eyeColor', order: 'Descending' },
                    { name: 'date', order: 'None' }],
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                    rows: [{ name: 'date', caption: 'Date' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [{ name: 'state' }],
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
            expect(pivotButton.id).toBe('state');
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
                expect((pivotButton[2].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
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
});

describe('Grouping Bar sorting none ', () => {
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
                sortSettings: [{ name: 'company', order: 'None' }],
                filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                { name: 'company', type: 'Include', items: ['NIPAZ'] },
                { name: 'gender', type: 'Include', items: ['male'] }],
                rows: [{ name: 'company' }, { name: 'state' }],
                columns: [{ name: 'name' }],
                values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
            },
            showGroupingBar: true,
            showFieldList: false,
            gridSettings: {
                contextMenuItems: ['Aggregate', 'Csv Export', 'Drillthrough', 'Expand', 'Collapse']
            },
            dataBound: dataBound
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    let persistdata: string;
    let click: MouseEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    it('grouping bar sort asc', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        let pivotButtons: HTMLElement[] =
            [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
        setTimeout(() => {
            pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'company', order: 'Ascending' }];
            expect((pivotButtons[0]).querySelector('.e-sort')).toBeTruthy;
            done();
        }, 1000);
    });
    it('grouping bar sort desc', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        let pivotButtons: HTMLElement[] =
            [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
        setTimeout(() => {
            pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'company', order: 'Descending' }];
            expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            done();
        }, 1000);
    });
    it('grouping bar sort none', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        let pivotButtons: HTMLElement[] =
            [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
        setTimeout(() => {
            pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'company', order: 'None' }]
            expect((pivotButtons[0]).querySelector('.e-sort')).not.toBeTruthy;
            done();
        }, 1000);
    });
    it('grouping bar sort none icon click', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'company', order: 'Ascending' }];
        let pivotButtons: HTMLElement[] =
            [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
        expect((pivotButtons[1]).querySelector('.e-sort')).toBeTruthy;
        setTimeout(() => {
            // pivotGridObj.dataSource.sortSettings = [{ name: 'company', order: 'None' }]
            document.querySelectorAll('.e-group-rows .e-sort')[1].dispatchEvent(click);
            done();
        }, 1000);
    });
    it('grouping bar sort asc icon click', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        let pivotButtons: HTMLElement[] =
            [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
        expect((pivotButtons[1]).querySelector('.e-descend')).toBeTruthy;
        setTimeout(() => {
            // pivotGridObj.dataSource.sortSettings = [{ name: 'company', order: 'None' }]
            document.querySelectorAll('.e-group-rows .e-sort')[1].dispatchEvent(click);
            expect((pivotButtons[0]).querySelector('.e-sort')).toBeTruthy;
            done();
        }, 1000);
    });
    it('grouping bar sort desc icon click', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        let pivotButtons: HTMLElement[] =
            [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
        expect((pivotButtons[1]).querySelector('.e-sort')).toBeTruthy;
        setTimeout(() => {
            // pivotGridObj.dataSource.sortSettings = [{ name: 'company', order: 'None' }]
            document.querySelectorAll('.e-group-rows .e-sort')[1].dispatchEvent(click);
            done();
        }, 1000);
    });
    it('grouping bar sort desc icon click', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            pivotGridObj.showGroupingBar = false;
            pivotGridObj.setProperties({
                gridSettings: {
                    contextMenuItems: ['Aggregate', 'Expand', 'Collapse']
                }
            }, true);
            done();
        }, 1000);
    });
});

describe('Grouping bar sort icon deferupdate', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    let cf: any;
    beforeAll(() => {
        document.body.appendChild(elem);
        PivotView.Inject(GroupingBar, FieldList);
        pivotGridObj = new PivotView(
            {
                dataSourceSettings: {
                    dataSource: pivot_nodata as IDataSet[],
                    enableSorting: true,
                    expandAll: true,
                    rows: [{ name: 'Country' }],
                    columns: [{ name: 'Product' }],
                    values: [{ name: 'Amount' }],
                },
                allowDeferLayoutUpdate: true,
                showFieldList: true,
                showGroupingBar: true,
                width: 600,
                height: 300
            });
        pivotGridObj.appendTo('#PivotGrid');
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
    it('Country -> descending _using grouping bar sort icon', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            document.querySelectorAll('.e-group-rows .e-sort')[0].dispatchEvent(click);
            done();
        }, 1000);
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
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
});