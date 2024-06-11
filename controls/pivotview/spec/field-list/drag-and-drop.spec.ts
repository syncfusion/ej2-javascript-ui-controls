import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, EmitType, closest, extend } from '@syncfusion/ej2-base';
import { pivot_dataset, pivot_nodata } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { PivotCommon } from '../../src/common/base/pivot-common';
import { TreeView } from '@syncfusion/ej2-navigations';
import { FieldDroppedEventArgs, FieldDragStartEventArgs, FieldDropEventArgs, FieldRemoveEventArgs, CalculatedFieldCreateEventArgs } from '../../src/common/base/interface';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { EventHandler } from '@syncfusion/ej2-base';
import * as util from '../utils.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldListRefreshedEventArgs } from '../../src';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';

/**
 * Pivot Field List Drag and drop spec
 */

describe('Pivot Field List Rendering', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });

    let isRefresh: boolean = false;

    function fieldListRefreshed(args: FieldListRefreshedEventArgs) {
        isRefresh = true;
    }
    describe('Check node drag and drop Actions', () => {
        let fieldListObj: PivotFieldList;
        let pivotCommon: PivotCommon;
        let mouseEventArgs: any;
        let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
        afterAll(() => {
            if (fieldListObj) {
                fieldListObj.destroy();
            }
            remove(elem);
        });
        beforeEach(() => {
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
        });
        beforeAll((done: Function) => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
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
                        calculatedFieldSettings: [
                            { name: 'price', formula: '5+10' },
                            { name: 'total', formula: '10/2' }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'price', type: 'CalculatedField' },
                        { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    allowCalculatedField: true,
                    renderMode: 'Fixed',
                    dataBound: dataBound,
                    fieldDragStart: (args: FieldDragStartEventArgs) => {
                        expect(args.fieldItem).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldDragName: ' + args.fieldItem.name);
                    },
                    fieldDrop: (args: FieldDropEventArgs) => {
                        expect(args.dropField).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldDropName: ' + args.dropField.name);
                    },
                    onFieldDropped: (args: FieldDroppedEventArgs) => {
                        expect(args.droppedField).toBeTruthy;
                        console.log('fieldDroppedName: ' + args.droppedField.name);
                    },
                    fieldRemove: (args: FieldRemoveEventArgs) => {
                        expect(args.fieldItem).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldRemoveName: ' + args.fieldItem.name);
                    }
                });
            fieldListObj.appendTo('#PivotFieldList');
            pivotCommon = fieldListObj.pivotCommon;
        });
        it('drag and drop node to body', () => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-drag'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-drag'), 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = treeObj.element;
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, treeObj.element);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((li[0]).querySelector('e-check')).not.toBeTruthy;
        });
        it('check node drag start for false case', () => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(1);
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-list-text'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-list-text'), 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((li[0]).querySelector('e-check')).not.toBeTruthy;
        });
        it('drag and drop node to filter axis', (done: Function) => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(1);
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[14].querySelector('.e-drag'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[14].querySelector('.e-drag'), 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((li[14]).querySelector('e-check')).toBeTruthy;
            setTimeout(() => {
                pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('advance');
                done();
            });
        });
        it('drag and drop node to filter axis with button axis', (done: Function) => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[14].querySelector('.e-drag'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[14].querySelector('.e-drag'), 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = pivotButton[0];
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseEventArgs.target = pivotButton[0];
            (fieldListObj.pivotButtonModule as any).parentElement = fieldListObj.element.querySelector('.e-pivotfieldlist-container');
            (fieldListObj.pivotButtonModule as any).updateDropIndicator(mouseEventArgs);
            let mouseOverEventArgs: any = extend({}, mousemove, null, true);
            mouseOverEventArgs.type = 'mouseover';
            mouseOverEventArgs.srcElement = mouseOverEventArgs.target = closest(mousemove.srcElement, '.e-droppable');
            (fieldListObj.axisTableModule as any).updateDropIndicator(mouseOverEventArgs);
            let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
            mouseLeaveEventArgs.type = 'mouseleave';
            (fieldListObj.axisTableModule as any).updateDropIndicator(mouseLeaveEventArgs);
            (fieldListObj.pivotButtonModule as any).updateDropIndicator(mouseEventArgs);
            let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, pivotButton[0]);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((li[14]).querySelector('e-check')).toBeTruthy;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[0].getAttribute('data-uid')).toBe('advance');
                done();
            }, 1000);
        });
        it('show filter popup', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('drag and drop node to value axis', (done: Function) => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let valueAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-values');
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[14].querySelector('.e-drag'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[14].querySelector('.e-drag'), 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = valueAxiscontent;
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, valueAxiscontent);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((li[14]).querySelector('e-check')).toBeTruthy;
            setTimeout(() => {
                pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp).toBeNull;
                expect(pivotButton.length).toEqual(4);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('advance');
                done();
            }, 1000);
        });
        it('drag and drop node to value axis with button axis', (done: Function) => {
            fieldListObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                args.droppedField.caption = "droppedButton"
            };
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let valueAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-values');
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(4);
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[14].querySelector('.e-drag'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[14].querySelector('.e-drag'), 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = pivotButton[0];
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, pivotButton[0]);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((li[14]).querySelector('e-check')).toBeTruthy;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(4);
                expect(pivotButton[0].getAttribute('data-uid')).toBe('advance');
                expect((pivotButton[0].querySelector('.e-pvt-btn-content') as HTMLElement).innerText).toEqual("Sum of droppedButton");
                done();
            }, 1000);
        });
        it('drag/drop calculated field to value axis field', (done: Function) => {
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let valueAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-values');
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(4);
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-drag'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-drag'), 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = valueAxiscontent;
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, valueAxiscontent);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((li[0]).querySelector('e-check')).toBeTruthy;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp).toBeNull;
                expect(pivotButton.length).toEqual(5);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('total');
                done();
            }, 1000);
        });
    });
    describe('Check pivot button drag and drop Actions', () => {
        let fieldListObj: PivotFieldList;
        let pivotCommon: PivotCommon;
        let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
        afterAll(() => {
            if (fieldListObj) {
                fieldListObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotFieldList.Inject(CalculatedField);
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
                    allowCalculatedField: true,
                    renderMode: 'Fixed',
                    dataBound: dataBound,
                    fieldDragStart: (args: FieldDragStartEventArgs) => {
                        expect(args.fieldItem).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldDragName: ' + args.fieldItem.name);
                    },
                    fieldDrop: (args: FieldDropEventArgs) => {
                        expect(args.dropField).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldDropName: ' + args.dropField.name);
                    },
                    onFieldDropped: (args: FieldDroppedEventArgs) => {
                        expect(args.droppedField).toBeTruthy;
                        console.log('fieldDroppedName: ' + args.droppedField.name);
                    },
                    fieldRemove: (args: FieldRemoveEventArgs) => {
                        expect(args.fieldItem).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldRemoveName: ' + args.fieldItem.name);
                    },
                    calculatedFieldCreate: (args: CalculatedFieldCreateEventArgs) => {
                        expect(args.calculatedField).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        
                        console.log('CreateCalcaltedFieldName: ' + args.calculatedField.name);
                    }
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
            }, 1000);
        });
        it('show filter popup', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] =
                [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('drag/drop pivot button from axis field to axis field', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
            let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(1);
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
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp).toBeNull;
                expect(pivotButton.length).toEqual(2);
                done();
            }, 1000);
        });
        it('drag/drop pivot button from axis field to same axis field', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[pivotButton.length - 1].querySelector('.e-draggable');
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
                expect(pivotCommon.filterDialog.dialogPopUp).toBeNull;
                expect(pivotButton.length).toEqual(2);
                done();
            }, 1000);
        });
        it('drag/drop pivot button from axis field to same button', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[pivotButton.length - 1].querySelector('.e-draggable');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, dragElement, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = dragElement;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, dragElement);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = dragElement;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp).toBeNull;
                expect(pivotButton.length).toEqual(2);
                done();
            }, 1000);
        });
        it('drag/drop pivot button from axis field to button position', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let columnAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-columns');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            let columnButtonElement: Element = (columnAxiscontent).querySelectorAll('.e-pivot-button')[0];
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, columnButtonElement, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = columnButtonElement;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, columnButtonElement);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = columnButtonElement;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            setTimeout(() => {
                pivotButton = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                done();
            }, 1000);
        });
        it('drag/drop calculated field to filter axis field', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let valueAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-values');
            let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
            let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            let dragElement: HTMLElement = pivotButton[1].querySelector('.e-draggable');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, filterAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = filterAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.errorDialog.errorPopUp.element.classList.contains('e-popup-open')).toBeTruthy;
                (pivotCommon.errorDialog.errorPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Updated DataSource', () => {
            expect(pivotCommon.errorDialog.errorPopUp).toBeUndefined;
            let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let valueAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-values');
            let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
        });
    });

    describe('Drag and drop restriction event support', () => {
        let fieldListObj: PivotFieldList;
        let pivotGridObj: PivotView;
        let pivotCommon: PivotCommon;
        let grid: HTMLElement = createElement('div', { id: 'PivotView', styles: 'width: 58%; height: 100%' });
        let fieldlist: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'width: 42%; height: 100%' });
        let elem: HTMLElement = createElement('div', { className: 'container' });
        let gridFilterElement: string;
        elem.appendChild(grid); elem.appendChild(fieldlist);
        PivotView.Inject(GroupingBar);
        PivotFieldList.Inject(CalculatedField);
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
                gridSettings: { columnWidth: 140 },
                fieldDrop: function (args) {
                    if (args.draggedAxis != args.dropAxis)
                        args.cancel = true;
                },
            });
            pivotGridObj.appendTo('#PivotView');
            fieldListObj = new PivotFieldList(
                {
                    dataSourceSettings: {
                        dataSource: pivot_nodata as IDataSet[],
                        enableSorting: true,
                        expandAll: true,
                        rows: [{ name: 'Country' }, { name: 'Date' }],
                        columns: [{ name: 'Product' }],
                        values: [{ name: 'Amount' }],
                        filters: [{ name: 'State' }],
                        filterSettings: [
                            { name: 'Country', type: 'Include', items: ['France'] },
                            { name: 'Product', type: 'Exclude', items: ['Van'] }
                        ],
                    },
                    enginePopulated: (): void => {
                        if (fieldListObj.isRequiredUpdate) {
                            fieldListObj.updateView(pivotGridObj);
                        }
                        pivotGridObj.notify('ui-update', pivotGridObj);
                        fieldListObj.notify('tree-view-update', fieldListObj);
                    },
                    fieldDrop: function (args) {
                        if (args.draggedAxis != args.dropAxis)
                            args.cancel = true;
                    },
                    renderMode: 'Fixed',
                    dataBound: dataBound
                });
            fieldListObj.appendTo('#PivotFieldList');
            pivotCommon = fieldListObj.pivotCommon;
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
        it('Drag value axis field to row axis field in grouping bar', (done: Function) => {
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
            let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let draggedElement: string = pivotButton[0].querySelector('.e-pvt-btn-content').textContent;
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
                pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(draggedElement == pivotButton[0].innerText).toEqual(true);
                done();
            }, 1000);
        });
        it('Drag row axis field to row axis field in grouping bar', (done: Function) => {
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let draggedElement: string = pivotButton[0].querySelector('.e-pvt-btn-content').textContent;
            let axisLength: number = pivotButton.length;
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
                expect(draggedElement == pivotButton[axisLength - 1].innerText).toEqual(true);
                done();
            }, 1000);
        });
        it('Drag filter axis field to row axis field in field list', (done: Function) => {
            let rowAxiscontent: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields .e-field-list-rows');
            let filterAxiscontent: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields .e-field-list-filters');
            let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let draggedElement: string = pivotButton[0].querySelector('.e-pvt-btn-content').textContent;
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
                pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(draggedElement == pivotButton[0].innerText).toEqual(true);
                done();
            }, 1000);
        });
        it('Drag row axis field to row axis field in field list', (done: Function) => {
            let rowAxiscontent: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields .e-field-list-rows');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let draggedElement: string = pivotButton[0].querySelector('.e-pvt-btn-content').textContent;
            let axisLength: number = pivotButton.length;
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
                expect(draggedElement == pivotButton[axisLength - 2].innerText).toEqual(true);
                done();
            }, 1000);
        });
        it('drag value axis field to row axis field in grouping bar & check filter state', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                gridFilterElement = pivotGridObj.element.querySelectorAll('td')[2].innerText;
                let mousedown: any =
                    util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    util.getEventObject('MouseEvents', 'mousemove', dragElement, valueAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = valueAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = util.setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, valueAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = valueAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                done();
            }, 1000);
        });
        it('expect filter state icon', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td')[2].innerText == gridFilterElement).toEqual(true);
                expect(pivotGridObj.element.querySelectorAll('.e-rows .e-pivot-button .e-btn-filter')[1].classList.contains('e-pv-filtered')).toBe(true);
                done();
            }, 1000);
        });
        it('Country -> descending _using grouping bar sort icon', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-group-rows .e-sort')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('expect sort state icon after drag row axis field to value axis field', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    util.getEventObject('MouseEvents', 'mousemove', dragElement, valueAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = valueAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = util.setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, valueAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = valueAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                done();
            }, 1000);
        });
        it('expect sort state icon after drag row axis field to value axis field', () => {
            let sortElement: string = pivotGridObj.element.querySelectorAll('td')[2].innerText;
            expect(document.querySelectorAll('.e-content tr')[0].querySelector('td .e-cellvalue').textContent == sortElement).toBe(true);
            expect(document.querySelectorAll('.e-group-rows .e-sort')[0].classList.contains('e-descend')).toBe(true);
        });
        it('uncheck country field', () => {
            document.querySelectorAll('.e-treeview li')[4].querySelector('.e-frame').dispatchEvent(click);
            expect(true).toBe(true);
        });
        it('expect country field check state', () => {
            expect(document.querySelectorAll('.e-treeview li')[4].querySelector('.e-frame').classList.contains('e-check') === true).toBe(true);
        });
        it('check country field', () => {
            document.querySelectorAll('.e-treeview li')[1].querySelector('.e-frame').dispatchEvent(click);
            expect(true).toBe(true);
        });
        it('expect quantity field check state', () => {
            expect(document.querySelectorAll('.e-treeview li')[1].querySelector('.e-frame').classList.contains('e-check') === false).toBe(true);
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

describe('PivotView spec', () => {
    /**
     * PivotGrid base spec for OLAP data source
     */

    function disableDialogAnimation(dialogObject: Dialog): void {
        dialogObject.animationSettings = { effect: 'None' };
        dialogObject.dataBind();
        dialogObject.hide();
    }

    function copyObject(source: any, destiation: any): Object {
        for (let prop of source) {
            destiation[prop] = source[prop];
        }
        return destiation;
    }

    function getEventObject(eventType: string, eventName: string, currentTarget?: Element, target?: Element, x?: number, y?: number): Object {
        let tempEvent: any = document.createEvent(eventType);
        tempEvent.initEvent(eventName, true, true);
        let returnObject: any = copyObject(tempEvent, {});
        returnObject.preventDefault = () => { return true; };

        if (!isNullOrUndefined(x)) {
            returnObject.pageX = x;
            returnObject.clientX = x;
        }
        if (!isNullOrUndefined(y)) {
            returnObject.pageY = y;
            returnObject.clientY = y;
        }
        if (!isNullOrUndefined(currentTarget)) {
            returnObject.currentTarget = currentTarget;
        }
        if (!isNullOrUndefined(target)) {
            returnObject.target = returnObject.srcElement = returnObject.toElement = target;
            returnObject.offsetY = 7;
        }
        returnObject.type = 'mouse';
        return returnObject;
    }

    function setMouseCordinates(eventarg: any, x: number, y: number): Object {
        eventarg.pageX = x;
        eventarg.pageY = y;
        eventarg.clientX = x;
        eventarg.clientY = y;
        eventarg.offsetY = 7;
        return eventarg;
    }

    function triggerMouseEvent(node: HTMLElement, eventType: string, x?: number, y?: number) {
        let mouseEve: MouseEvent = document.createEvent('MouseEvents');
        if (x && y) {
            mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
        } else {
            mouseEve.initEvent(eventType, true, true);
        }
        node.dispatchEvent(mouseEve);
    }

    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });

    describe('Grid base module - ', () => {
        describe('- Grid properties - ', () => {
            let originalTimeout: number;
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            document.body.appendChild(elem);
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll(() => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        catalog: 'Adventure Works DW 2008 SE',
                        cube: 'Adventure Works',
                        providerType: 'SSAS',
                        url: 'https://bi.syncfusion.com/olap/msmdpump.dll',
                        localeIdentifier: 1033,
                        drilledMembers: [
                            {
                                name: '[Date].[Fiscal]',
                                items: ['[Date].[Fiscal].[Fiscal Year].&[2006]',
                                    '[Date].[Fiscal].[Fiscal Semester].&[2006]&[2]',
                                    '[Date].[Fiscal].[Fiscal Year].&[2008]']
                            },
                            {
                                name: '[Customer].[Customer Geography]',
                                items: ['[Customer].[Customer Geography].[Country].&[Australia]',
                                    '[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]'], delimiter: '##'
                            },
                            {
                                name: '[Geography].[Geography]',
                                items: ['[Geography].[Geography].[Country].&[Australia]',
                                    '[Geography].[Geography].[State-Province].&[NSW]&[AU]'], delimiter: '##'
                            }
                        ],
                        allowLabelFilter: true,
                        allowValueFilter: true,
                        filterSettings: [
                            {
                                name: '[Customer].[Customer Geography]',
                                items: ['[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]',
                                    '[Customer].[Customer Geography].[State-Province].&[QLD]&[AU]',
                                    '[Customer].[Customer Geography].[Country].&[Germany]',
                                    '[Customer].[Customer Geography].[Country].&[France]',
                                    '[Customer].[Customer Geography].[Country].&[United Kingdom]',
                                    '[Customer].[Customer Geography].[Country].&[United States]'],
                                levelCount: 2
                            },
                        ],
                        rows: [
                            { name: '[Date].[Fiscal]', caption: 'Date Fiscal' },
                        ],
                        columns: [
                            { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                            { name: '[Measures]', caption: 'Measures' },
                        ],
                        values: [
                            { name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                            { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' },
                        ],
                        filters: [],
                        valueAxis: 'column',
                        valueSortSettings: {
                            sortOrder: 'Descending',
                            measure: '[Measures].[Internet Sales Amount]'
                        }
                    },
                    enableVirtualization: false,
                    showGroupingBar: true,
                    showFieldList: true,
                    width: '80%',
                    height: '500px',
                    groupingBarSettings: {
                        allowDragAndDrop: true
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let persistdata: string;
            it('pivotgrid render testing', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                    pivotGridObj.onWindowResize();
                    pivotGridObj.renderModule.updateGridSettings();
                    done();
                }, 2000);
            });
            it('pivotgrid setPersist', () => {
                persistdata = pivotGridObj.getPersistData();
                expect(!isNullOrUndefined(JSON.parse(persistdata).dataSourceSettings)).toBeTruthy();
            });
            it('Mouse hover event testing - Value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelector('td[aria-colindex="3"]');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$72,200.48');
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - Value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="3"]')[1] as HTMLElement;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$52,871.87');
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - top left cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelector('.e-rowcell');
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(27);
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - bottom left value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="6"]')[1] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('105');
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - bottom right value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="6"]')[6] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$141,028.21');
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - bottom middle value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="6"]')[3] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('79');
                    done();
                }, 2000);
            });
            it('Filter testing', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 2000);
            });
            it('Filter testing', (done: Function) => {
                (document.querySelectorAll('.e-maskedtextbox')[0] as HTMLInputElement).value = 'k';
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-maskedtextbox')[0] as HTMLInputElement).value === 'k').toBeTruthy();
                    done();
                }, 2000);
            });
            it('Filter testing', (done: Function) => {
                (document.querySelectorAll('.e-cancel-btn')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 2000);
            });
        });
    });
});