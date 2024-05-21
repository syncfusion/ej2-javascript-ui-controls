import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, EmitType, closest, getInstance } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { PivotCommon } from '../../src/common/base/pivot-common';
import { TreeView } from '@syncfusion/ej2-navigations';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { EventHandler } from '@syncfusion/ej2-base';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { FieldListRefreshedEventArgs } from '../../src';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

let isRefresh: boolean = false;

function fieldListRefreshed(args: FieldListRefreshedEventArgs) {
    isRefresh = true;
}

describe('Pivot Field List Rendering - Defer Update', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Check pivot button drag and drop Actions', () => {
        let down: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        let up: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        let fieldListObj: PivotFieldList;
        let pivotGridObj: PivotView;
        let pivotCommon: PivotCommon;
        let mouseEventArgs: any;
        let grid: HTMLElement = createElement('div', { id: 'PivotView', styles: 'width: 58%; height: 100%' });
        let fieldlist: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'width: 42%; height: 100%' });
        let elem: HTMLElement = createElement('div', { className: 'container' });
        elem.appendChild(grid); elem.appendChild(fieldlist);
        PivotView.Inject(GroupingBar);
        PivotFieldList.Inject(CalculatedField);
        beforeEach(() => {
        }, 1000);
        afterAll(() => {
            if (fieldListObj) {
                fieldListObj.destroy();
            }
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            pivotGridObj = new PivotView({
                enginePopulated: () => {
                    if (fieldListObj) {
                        fieldListObj.update(pivotGridObj);
                    }
                },
                fieldListRefreshed: fieldListRefreshed,
                enableValueSorting: true,
                showGroupingBar: true,
                allowDeferLayoutUpdate: true,
                width: '99%',
                height: 530,
                gridSettings: { columnWidth: 140 }
            });
            pivotGridObj.appendTo('#PivotView');
            fieldListObj = new PivotFieldList(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        calculatedFieldSettings: [{ name: 'price', formula: '5+10' }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'price', type: 'CalculatedField' },
                        { name: 'quantity' }],
                        filters: [{ name: 'gender' }]
                    },
                    enableFieldSearching: true,
                    allowDeferLayoutUpdate: true,
                    allowCalculatedField: true,
                    showValuesButton: true,
                    enginePopulated: (): void => {
                        if (fieldListObj.isRequiredUpdate) {
                            fieldListObj.updateView(pivotGridObj);
                        }
                        pivotGridObj.notify('ui-update', pivotGridObj);
                        fieldListObj.notify('tree-view-update', fieldListObj);
                    },
                    renderMode: 'Fixed',
                    dataBound: dataBound
                });
            fieldListObj.appendTo('#PivotFieldList');
            pivotCommon = fieldListObj.pivotCommon;
        });
        it('drag and drop pivot button to body', (done: Function) => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, treeObj.element, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = treeObj.element;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, treeObj.element);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = treeObj.element;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                done();
            });
        });
        it('Cancel button', (done: Function) => {
            document.getElementById('PivotFieldList_DeferUpdateButton2').click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(8);
                done();
            });
        });
        it('drag and drop pivot button to body', (done: Function) => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, treeObj.element, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = treeObj.element;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, treeObj.element);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = treeObj.element;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                done();
            });
        });
        it('Apply button', () => {
            document.getElementById('PivotFieldList_DeferUpdateButton1').click();
            expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(7);
            expect(isRefresh).toBeTruthy();
        });
        it('Check node', () => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            closest(checkEle[0], 'li').dispatchEvent(down);
            closest(checkEle[0], 'li').dispatchEvent(up);
            expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(6);
        });
        it('Cancel button', (done: Function) => {
            document.getElementById('PivotFieldList_DeferUpdateButton2').click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(7);
                done();
            });
        });
        it('Check node', (done: Function) => {
            setTimeout(() => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                closest(checkEle[0], 'li').dispatchEvent(down);
                closest(checkEle[0], 'li').dispatchEvent(up);
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(6);
                done();
            });
        });
        it('Apply button', (done: Function) => {
            setTimeout(() => {
                document.getElementById('PivotFieldList_DeferUpdateButton1').click();
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(6);
                done();
            });
        });
        it('Check node', (done: Function) => {
            setTimeout(() => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                closest(checkEle[0], 'li').dispatchEvent(down);
                closest(checkEle[0], 'li').dispatchEvent(up);
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(7);
                done();
            });
        });
        it('Cancel button', (done: Function) => {
            document.getElementById('PivotFieldList_DeferUpdateButton2').click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(6);
                done();
            });
        });
        it('Check node', (done: Function) => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            closest(checkEle[0], 'li').dispatchEvent(down);
            closest(checkEle[0], 'li').dispatchEvent(up);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(7);
                done();
            });
        });
        it('Apply button', (done: Function) => {
            document.getElementById('PivotFieldList_DeferUpdateButton1').click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(7);
                done();
            });
        });
        it('Sort Click', () => {
            (fieldListObj.element.querySelector('.e-pivot-button .e-sort') as HTMLElement).click();
            expect(document.querySelector('.e-pivotfieldlist .e-pivot-button.state .e-sort').classList.contains('e-descend')).toBeTruthy;
        });
        it('Cancel button', () => {
            document.getElementById('PivotFieldList_DeferUpdateButton2').click();
            expect(document.querySelector('.e-pivotfieldlist .e-pivot-button.state .e-sort').classList.contains('e-descend')).toBeFalsy;
        });
        it('Sort Click', () => {
            (fieldListObj.element.querySelector('.e-pivot-button .e-sort') as HTMLElement).click();
            expect(document.querySelector('.e-pivotfieldlist .e-pivot-button.state .e-sort').classList.contains('e-descend')).toBeTruthy;
        });
        it('Apply button', () => {
            document.getElementById('PivotFieldList_DeferUpdateButton1').click();
            expect(document.querySelector('.e-pivotfieldlist .e-pivot-button.state .e-sort').classList.contains('e-descend')).toBeTruthy;
        });
        it('check include type filter field', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 3000);
        });
        it('check all nodes on filter popup', () => {
            let treeObj: TreeView = fieldListObj.pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = fieldListObj.pivotCommon.filterDialog.memberTreeView;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(allNode.classList.contains('e-small')).toBe(false);
            closest(allNode, 'li').dispatchEvent(down);
            closest(allNode, 'li').dispatchEvent(up);
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkEle.length).toEqual(2);
            (fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter state after update', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filter')).toBeTruthy;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                done();
            }, 1000);
        });
        it('Cancel button', () => {
            document.getElementById('PivotFieldList_DeferUpdateButton2').click();
            expect(document.querySelector('.e-pivot-button .e-sort').classList.contains('e-descend')).toBeFalsy;
        });
        it('check include type filter field', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('check all nodes on filter popup', () => {
            let treeObj: TreeView = fieldListObj.pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = fieldListObj.pivotCommon.filterDialog.memberTreeView;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(allNode.classList.contains('e-small')).toBe(false);
            closest(allNode, 'li').dispatchEvent(down);
            closest(allNode, 'li').dispatchEvent(up);
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkEle.length).toEqual(2);
            expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter state after update', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filter')).toBeTruthy;
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                (fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Apply button', () => {
            document.getElementById('PivotFieldList_DeferUpdateButton1').click();
        });
        it('Remove Click', () => {
            (fieldListObj.element.querySelector('.e-pivot-button .e-remove') as HTMLElement).click();
            expect(document.querySelectorAll('.e-pivot-button').length === 12).toBeTruthy;
        });
        it('Cancel button', () => {
            document.getElementById('PivotFieldList_DeferUpdateButton2').click();
            expect(document.querySelectorAll('.e-pivot-button').length === 14).toBeTruthy;
        });
        it('Remove Click', () => {
            (fieldListObj.element.querySelector('.e-pivot-button .e-remove') as HTMLElement).click();
            expect(document.querySelectorAll('.e-pivot-button').length === 12).toBeTruthy;
        });
        it('Apply button', () => {
            document.getElementById('PivotFieldList_DeferUpdateButton1').click();
            expect(document.querySelectorAll('.e-pivot-button').length === 12).toBeTruthy;
        });
        it('Check defer update', (done: Function) => {
            (fieldListObj.element.querySelector('.e-layout-footer .e-frame') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((fieldListObj.element.querySelector('#PivotFieldList_DeferUpdateButton1') as HTMLButtonElement).disabled).toBe(true);
                done();
            }, 1000);
        });
        it('Check defer update', (done: Function) => {
            (fieldListObj.element.querySelector('.e-layout-footer .e-frame') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((fieldListObj.element.querySelector('#PivotFieldList_DeferUpdateButton1') as HTMLButtonElement).disabled).toBe(false);
                done();
            }, 1000);
        });



        it('Apply button', () => {
            pivotCommon.dataSourceUpdate.control = fieldListObj;
        });
        it('testing row axis using drop args', () => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rowsAxisContent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            let pivotButton: HTMLElement[] = [].slice.call((rowsAxisContent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(1);
            let args: any = {
                target: rowsAxisContent,
                cancel: true,
                event: util.getEventObject('MouseEvents', 'mouseup', treeObj.element, rowsAxisContent) as any
            } as DragAndDropEventArgs;
            pivotCommon.nodeStateModified.onStateModified(args, 'pno');
            fieldListObj.axisFieldModule.render();
            pivotButton = [].slice.call((rowsAxisContent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('pno');
        });
        it('Cancel button', () => {
            document.getElementById('PivotFieldList_DeferUpdateButton2').click();
            expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(6);
        });
        it('testing row axis using drop args', (done: Function) => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rowsAxisContent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            setTimeout(() => {
                let pivotButton: HTMLElement[] = [].slice.call((rowsAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let args: any = {
                    target: rowsAxisContent,
                    cancel: true,
                    event: util.getEventObject('MouseEvents', 'mouseup', treeObj.element, rowsAxisContent) as any
                } as DragAndDropEventArgs;
                pivotCommon.nodeStateModified.onStateModified(args, 'pno');
                fieldListObj.axisFieldModule.render();
                pivotButton = [].slice.call((rowsAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('pno');
                done();
            });
        });
        it('Apply button', (done: Function) => {
            document.getElementById('PivotFieldList_DeferUpdateButton1').click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(7);
                done();
            });
        });
        it('testing column axis using drop args', (done: Function) => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let columnAxisContent: HTMLElement = rightAxisPanel.querySelector('.e-columns');
            let pivotButton: HTMLElement[] = [].slice.call((columnAxisContent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let args: any = {
                target: columnAxisContent,
                cancel: true,
                event: util.getEventObject('MouseEvents', 'mouseup', treeObj.element, columnAxisContent) as any
            } as DragAndDropEventArgs;
            pivotCommon.nodeStateModified.onStateModified(args, 'pno');
            fieldListObj.axisFieldModule.render();
            setTimeout(() => {
                pivotButton = [].slice.call((columnAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('pno');
                done();
            });
        });
        it('Cancel button', (done: Function) => {
            document.getElementById('PivotFieldList_DeferUpdateButton2').click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(7);
                done();
            });
        });
        it('testing column axis using drop args', (done: Function) => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let columnAxisContent: HTMLElement = rightAxisPanel.querySelector('.e-columns');
            let pivotButton: HTMLElement[] = [].slice.call((columnAxisContent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let args: any = {
                target: columnAxisContent,
                cancel: true,
                event: util.getEventObject('MouseEvents', 'mouseup', treeObj.element, columnAxisContent) as any
            } as DragAndDropEventArgs;
            pivotCommon.nodeStateModified.onStateModified(args, 'pno');
            fieldListObj.axisFieldModule.render();
            setTimeout(() => {
                pivotButton = [].slice.call((columnAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('pno');
                done();
            });
        });
        it('Apply button', (done: Function) => {
            document.getElementById('PivotFieldList_DeferUpdateButton1').click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-pivot-button').length).toBe(7);
                done();
            });
        });
    });
    describe('- Field List with injected Module - ', () => {
        let pivotGridObj: PivotView;
        let keyModule: any;
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
                allowDeferLayoutUpdate: true,
                showGroupingBar: true,
                showFieldList: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
            util.disableDialogAnimation(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog);
        });
        let persistdata: string;
        it('set keymodule', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                keyModule = pivotGridObj.pivotCommon.keyboardModule
                done();
            }, 1000);
        });
        it('check dropdown icon', (done: Function) => {
            let valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
            let pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'enter', target: pivotButtons[0], preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.getElementById("PivotGridvalueFieldContextMenu")).toBeTruthy;
                done();
            }, 1000);
        });
        it('select context Menu', (done: Function) => {
            let menuObj: any = (pivotGridObj.pivotButtonModule.menuOption as any).menuInfo[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
            let menu: any = {
                element: li[1],
                item: menuObj.items[1]
            };
            menuObj.select(menu as MenuEventArgs);
            let valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
            let pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            let buttonText: HTMLElement = ((pivotButtons[0]).querySelector('.e-pvt-btn-content') as HTMLElement);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                menuObj.close();
                expect(buttonText.innerHTML).toEqual('Count of balance');
                pivotGridObj.dataSourceSettings.showAggregationOnValueField = false;
                done();
            }, 1000);
        });
        it('check dropdown icon', (done: Function) => {
            let valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
            let pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'enter', target: pivotButtons[0], preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.getElementById("FieldListcontextmenu")).toBeTruthy;
                done();
            }, 1000);
        });
        it('select context Menu', (done: Function) => {
            let menuObj: any = (document.getElementById('PivotGridvalueFieldContextMenu') as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
            let menu: any = {
                element: li[2],
                item: menuObj.items[2]
            };
            menuObj.select(menu as MenuEventArgs);
            let valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
            let pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            let buttonText: HTMLElement = ((pivotButtons[0]).querySelector('.e-pvt-btn-content') as HTMLElement);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                menuObj.close();
                expect(buttonText.innerHTML).toEqual('balance');
                pivotGridObj.dataSourceSettings.showAggregationOnValueField = true;
                done();
            }, 1000);
        });
        it('Check aggregation in fieldlist', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click()).toBeTruthy;
                done();
            }, 1000);
        });
        it('check dropdown icon', (done: Function) => {
            let valueField: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-field-list-values');
            let pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            keyModule.keyActionHandler({ action: 'enter', target: pivotButtons[0], preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.getElementById("FieldListcontextmenu")).toBeTruthy;
                done();
            }, 1000);
        });
        it('select context Menu', (done: Function) => {
            let menuObj: any = (pivotGridObj.pivotFieldListModule.pivotButtonModule.menuOption as any).menuInfo[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
            let menu: any = {
                element: li[6],
                item: menuObj.items[6]
            };
            menuObj.select(menu as MenuEventArgs);
            let valueField: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-field-list-values');
            let pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            let buttonText: HTMLElement = ((pivotButtons[0]).querySelector('.e-pvt-btn-content') as HTMLElement);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(buttonText.innerHTML === 'Avg of balance').toBeTruthy;
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('check sorting order field', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('sorting order after update', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
                done();
            }, 1000);
        });
        it('Cancel button', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('sorting order after update', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeFalsy;
                done();
            }, 1000);
        });
        it('check open field list popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check sorting order field', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('Apply button', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('.e-defer-update-btn') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('sorting order after update', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
                done();
            }, 1000);
        });
        it('check open field list popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check filtering field', (done: Function) => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let filterDialog: Dialog = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('check all nodes on filter popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let treeObj: TreeView = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.dialogPopUp;
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
                done();
            }, 1000);
        });
        it('check filter state after update', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let filterDialog: Dialog = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
                done();
            }, 1000);
        });
        it('Cancel button', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check open field list popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check filtering field', (done: Function) => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let filterDialog: Dialog = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('check all nodes on filter popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let treeObj: TreeView = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.memberTreeView;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(1);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                done();
            }, 1000);
        });
        it('check all nodes on filter popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let memberTreeObj: TreeView = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.memberTreeView;
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                let filterDialog: Dialog = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.dialogPopUp;
                expect(checkEle.length).toBe(2);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('check filter state after update', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
                done();
            }, 1000);
        });
        it('Apply button', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('.e-defer-update-btn') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check open field list popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check remove pivot button1', (done: Function) => {
            let pivotButton: HTMLElement = (pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector(
                '.e-filters').querySelector('.e-pivot-button') as HTMLElement);
            setTimeout(() => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                expect(pivotButton.id).toBe('PivotGrid_PivotFieldList_gender');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                done();
            }, 1000); 
        });
        it('check remove pivot button2', (done: Function) => {
            let pivotButton: HTMLElement = (pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector(
                '.e-filters').querySelector('.e-pivot-button') as HTMLElement);
            setTimeout(() => {
                expect(pivotButton).toBeNull();
                done();
            }, 1000);
        });
        it('Cancel button', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check open field list popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check remove pivot button1', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButton: HTMLElement = (pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector(
                    '.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                expect(pivotButton.id).toBe('PivotGrid_PivotFieldList_gender');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('check remove pivot button2', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButton: HTMLElement = (pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector(
                    '.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                expect(pivotButton).toBeNull();
                done();
            }, 1000);
        });
        it('Apply button', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('.e-defer-update-btn') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check open field list popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check drag and drop pivot button', (done: Function) => {
            let rowAxiscontent: HTMLElement = pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-rows');
            let valueAxiscontent: HTMLElement = pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-values');
            let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
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
                done();
            }, 1000);
        });
        it('Cancel button', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check open field list popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check drag and drop pivot button', (done: Function) => {
            let rowAxiscontent: HTMLElement = pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-rows');
            let valueAxiscontent: HTMLElement = pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-values');
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
                done();
            }, 1000);
        });
        it('Apply button', (done: Function) => {
            (document.querySelector('.e-defer-update-btn') as HTMLElement).click();
            setTimeout(() => {
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('check open field list popup', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('Check defer update', (done: Function) => {
            (pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-layout-footer .e-frame') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('#PivotGrid_PivotFieldList_DeferUpdateButton1') as HTMLButtonElement).style.display === 'none').toBe(true);
                done();
            }, 1000);
        });
        it('Check defer update', (done: Function) => {
            (pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('.e-layout-footer .e-frame') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog.element.querySelector('#PivotGrid_PivotFieldList_DeferUpdateButton1') as HTMLButtonElement).style.display === '').toBe(true);
                done();
            }, 1000);
        });
    });
    describe('Pop Field list with defer update ', () => {
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
                allowDeferLayoutUpdate: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        let click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        it('Open popup field list', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-toggle-field-list')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('Disable defer update', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-check')[6].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('check spinner cleared', () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('.e-spinner-pane')[2].classList.contains('e-spin-hide')).toBe(true);
        });
    });

    describe('Retain the defer update UI after refreshing the component', () => {
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
                allowDeferLayoutUpdate: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        let click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        it('Open popup field list', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-toggle-field-list')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('Disable defer update', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-check')[6].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('Refreshing the component', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotGridObj.refresh();
                done();
            }, 1000);
        });
        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});