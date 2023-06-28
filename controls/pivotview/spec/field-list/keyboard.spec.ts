import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, isNullOrUndefined, EmitType, closest, getInstance } from '@syncfusion/ej2-base';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { PivotCommon } from '../../src/common/base/pivot-common';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

/**
 * Pivot keyboard interaction spec
 */

describe('Pivot Rendering', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Testing on keyboard interaction with Field List', () => {
        let fieldListObj: PivotFieldList;
        let pivotCommon: PivotCommon;
        let keyModule: any;
        let cField: any;
        interface CommonArgs {
            preventDefault(): void;
        }
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
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [{ name: 'gender' }]
                    },
                    allowCalculatedField: true,
                    renderMode: 'Fixed',
                    dataBound: dataBound
                });
            fieldListObj.appendTo('#PivotFieldList');
            keyModule = fieldListObj.pivotCommon.keyboardModule;
            pivotCommon = fieldListObj.pivotCommon;
            cField = fieldListObj.calculatedFieldModule;
        });
        it('Check shiftS key for sort action', () => {
            let pivotButtons: HTMLElement[] = [].slice.call(fieldListObj.element.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'shiftS', target: pivotButtons[2], preventDefault: (): void => { /** Null */ } });
            expect((pivotButtons[2]).querySelector('.e-descend')).toBeTruthy;
        });
        it('Check shiftF key for filter action', (done: Function) => {
            let pivotButtons: HTMLElement[] = [].slice.call(fieldListObj.element.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'shiftF', target: pivotButtons[0], preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('Check shiftF key for filter update action', (done: Function) => {
            let filterDialog: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
            (filterDialog.querySelector('.e-ok-btn') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                done();
            }, 1000);
        });
        it('Check remove action', () => {
            let pivotButtons: HTMLElement[] = [].slice.call(fieldListObj.element.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'delete', target: pivotButtons[0], preventDefault: (): void => { /** Null */ } });
            let pivotButtonUpdate: HTMLElement[] = [].slice.call(fieldListObj.element.querySelectorAll('.e-pivot-button'));
            expect(pivotButtonUpdate.length).toEqual(pivotButtons.length - 1);
        });
        it('Check enter formula action', (done: Function) => {
            (document.querySelector('.e-calculated-field') as HTMLElement).click();
            addClass([(document.querySelectorAll('.e-pivot-calc-dialog-div .e-list-item')[0] as HTMLElement)], ['e-hover', 'e-node-focus']);
            cField.keyActionHandler({ action: 'enter', currentTarget: cField.dialog.element, preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelector('#' + cField.parentID + 'droppable') as HTMLTextAreaElement).value === '"Count(_id)"').toBeTruthy();
                (document.querySelector('#' + cField.parentID + 'droppable') as HTMLTextAreaElement).value = '';
                done();
            }, 1000);
        });
        it('Check enter formula action', (done: Function) => {
            removeClass([(document.querySelectorAll('.e-pivot-calc-dialog-div .e-list-item')[0] as HTMLElement)], ['e-hover', 'e-node-focus']);
            addClass([(document.querySelectorAll('.e-pivot-calc-dialog-div .e-list-item')[15] as HTMLElement)], ['e-hover', 'e-node-focus']);
            cField.keyActionHandler({ action: 'enter', currentTarget: cField.dialog.element, preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelector('#' + cField.parentID + 'droppable') as HTMLTextAreaElement).value === '"Count(product)"').toBeTruthy();
                done();
            }, 1000);
        });
        it('Check enter formula action', (done: Function) => {
            (document.querySelector('#' + cField.parentID + 'droppable') as HTMLTextAreaElement).value = '10';
            removeClass([(document.querySelectorAll('.e-pivot-calc-dialog-div .e-list-item')[15] as HTMLElement)], ['e-hover', 'e-node-focus']);
            addClass([(document.querySelectorAll('.e-pivot-calc-dialog-div .e-list-item')[1] as HTMLElement)], ['e-hover', 'e-node-focus']);
            cField.keyActionHandler({ action: 'enter', currentTarget: cField.dialog.element, preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelector('#' + cField.parentID + 'droppable') as HTMLTextAreaElement).value === '10"Sum(advance)"').toBeTruthy();
                done();
            }, 1000);
        });
        it('Check enter formula action', (done: Function) => {
            (document.querySelector('#' + cField.parentID + 'droppable') as HTMLTextAreaElement).value = '10';
            removeClass([(document.querySelectorAll('.e-pivot-calc-dialog-div .e-list-item')[1] as HTMLElement)], ['e-hover', 'e-node-focus']);
            addClass([(document.querySelectorAll('.e-pivot-calc-dialog-div .e-list-item')[15] as HTMLElement)], ['e-hover', 'e-node-focus']);
            cField.keyActionHandler({ action: 'enter', currentTarget: cField.dialog.element, preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelector('#' + cField.parentID + 'droppable') as HTMLTextAreaElement).value === '10"Count(product)"').toBeTruthy();
                (document.querySelector('#' + cField.parentID + 'droppable') as HTMLTextAreaElement).value = '';
                done();
            }, 1000);
        });
        it('Check menu action', () => {
            removeClass([(document.querySelectorAll('.e-pivot-calc-dialog-div .e-list-item')[15] as HTMLElement)], ['e-hover', 'e-node-focus']);
            addClass([(document.querySelectorAll('.e-pivot-calc-dialog-div .e-list-item')[1] as HTMLElement)], ['e-hover', 'e-node-focus']);
            cField.keyActionHandler({ action: 'moveRight', currentTarget: cField.dialog.element, preventDefault: (): void => { /** Null */ } });
            expect(true).toBeTruthy();
            cField.closeDialog();
        });
    });
    describe('Testing on keyboard interaction with Field List-Popup mode', () => {
        let fieldListObj: PivotFieldList;
        let pivotCommon: PivotCommon;
        let eventArgs: any;
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
                        calculatedFieldSettings: [{ name: 'price', formula: '5+10' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }, { name: 'price', type: 'CalculatedField' }]
                    },
                    allowCalculatedField: true,
                    target: elem,
                    dataBound: dataBound
                });
            fieldListObj.appendTo('#PivotFieldList');
            util.disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
            pivotCommon = fieldListObj.pivotCommon;
        });
        it('control class testing', () => {
            expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
        });
        it('Check enter key for filter action', () => {
            let fieldListIcon: HTMLElement = (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement);
            expect(fieldListIcon.classList.contains('e-hide')).not.toBeTruthy();
            eventArgs = {
                keyCode: 13, altKey: false, ctrlKey: false, shiftKey: false,
                target: fieldListIcon, preventDefault: (): void => { /** Null */ }
            };
            (fieldListObj.dialogRenderer as any).keyPress(eventArgs);
            expect(fieldListIcon.classList.contains('e-hide')).toBeTruthy();
        });
        it('check field list icon', () => {
            (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('check field list dialog with targetID', () => {
            expect(!isNullOrUndefined(elem.querySelector('.e-pivotfieldlist-container')));
        });
    });
    describe('Testing on keyboard interaction with PivotGrid with GroupingBar', () => {
        let pivotGridObj: PivotView;
        let pivotCommon: PivotCommon;
        let keyModule: any;
        let pivotViewKeyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
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
            PivotView.Inject(GroupingBar);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    showGroupingBar: true,
                    dataBound: dataBound
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach(() => {
            keyModule = pivotGridObj.pivotCommon.keyboardModule;
            pivotViewKeyModule = pivotGridObj.keyboardModule;
            pivotCommon = pivotGridObj.pivotCommon;
        });
        it('Check sort action', () => {
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'shiftS', target: pivotButtons[pivotButtons.length - 1], preventDefault: (): void => { /** Null */ } });
            expect((pivotButtons[pivotButtons.length - 1]).querySelector('.e-descend')).toBeTruthy;
        });
        it('Check filter action', (done: Function) => {
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'shiftF', target: pivotButtons[pivotButtons.length - 1], preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('Close filter dialog', (done: Function) => {
            let filterDialog: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
            (filterDialog.querySelector('.e-ok-btn') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                done();
            }, 1000);
        });
        it('Check remove action', (done: Function) => {
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'delete', target: pivotButtons[0], preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtonUpdate: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelectorAll('.e-pivot-button'));
                expect(pivotButtonUpdate.length).toEqual(pivotButtons.length - 1);
                done();
            }, 1000);
        });
        it('Check tab action', (done: Function) => {
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            pivotViewKeyModule.keyActionHandler({
                action: 'tab',
                target: pivotButtons[0],
                preventDefault: (): void => { /** Null */ }
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let focuesdEle: HTMLElement = document.activeElement as HTMLElement;
                expect(focuesdEle.id === pivotButtons[1].id).toBeTruthy;
                done();
            }, 1000);
        });
        it('Check tab action to grid cell focus', (done: Function) => {
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            pivotViewKeyModule.keyActionHandler({
                action: 'tab',
                target: pivotButtons[pivotButtons.length - 1],
                preventDefault: (): void => { /** Null */ }
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.grid.element.querySelector('.e-focused')).toBeTruthy;
                done();
            }, 1000);
        });
    });
    describe('Testing on keyboard interaction with PivotGrid with FieldList', () => {
        let pivotGridObj: PivotView;
        let pivotCommon: PivotCommon;
        let pivotViewKeyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
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
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView(
                {
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
                    showFieldList: true,
                    dataBound: dataBound
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotViewKeyModule = pivotGridObj.keyboardModule;
                done();
            }, 1000);
        });
        it('Check tab action', (done: Function) => {
            pivotViewKeyModule.keyActionHandler({
                action: 'tab',
                target: pivotGridObj.element.querySelector('.e-toggle-field-list'),
                preventDefault: (): void => { /** Null */ }
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.grid.element.querySelector('.e-focused')).toBeTruthy;
                done();
            }, 1000);
        });
        it('Check enter action to grid cell', (done: Function) => {
            expect(pivotGridObj.grid.element.querySelector('.e-expand')).toBeTruthy;
            let gridcell: Element = closest(pivotGridObj.grid.element.querySelector('.e-expand'), '.e-rowcell');
            expect(gridcell).toBeTruthy;
            pivotViewKeyModule.keyActionHandler({
                action: 'enter',
                target: gridcell,
                preventDefault: (): void => { /** Null */ }
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.grid.element.querySelector('.e-expand')).toBeTruthy;
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
    });
    describe('Testing on keyboard interaction with PivotGrid with GroupingBar and FieldList', () => {
        let pivotGridObj: PivotView;
        let pivotCommon: PivotCommon;
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
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
            PivotView.Inject(GroupingBar, FieldList);
            pivotGridObj = new PivotView(
                {
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
                    showFieldList: true,
                    showGroupingBar: true,
                    dataBound: dataBound
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                keyModule = pivotGridObj.pivotCommon.keyboardModule;
                pivotCommon = pivotGridObj.pivotCommon;
                done();
            }, 1000);
        });
        it('Check enter action to grid cell', (done: Function) => {
            expect(pivotGridObj.grid.element.querySelector('.e-expand')).toBeTruthy;
            let gridcell: Element = closest(pivotGridObj.grid.element.querySelector('.e-expand'), '.e-rowcell');
            expect(gridcell).toBeTruthy;
            keyModule.keyActionHandler({
                action: 'enter',
                target: gridcell,
                preventDefault: (): void => { /** Null */ }
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.grid.element.querySelector('.e-expand')).toBeTruthy;
                done();
            }, 1000);
        });
    });
    describe('Testing Pivot Grid aggregation module on keyboard interaction in grouping bar with fieldlist', () => {
        let pivotGridObj: any;
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(GroupingBar, FieldList, CalculatedField);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: false,
                    formatSettings: [{ name: 'balance', format: 'C' }],
                    sortSettings: [{ name: 'eyeColor', order: 'Descending' }],
                    rows: [{ name: 'eyeColor' }],
                    columns: [{ name: 'isActive' }],
                    values: [{ name: 'balance' }]
                },
                showFieldList: true,
                allowCalculatedField: true,
                showGroupingBar: true,

                width: 1000,
                height: 500
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('set keymodule', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                keyModule = pivotGridObj.pivotCommon.keyboardModule
                done();
            }, 1000);
        });
        it('check dropdown icon', () => {
            var valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'enter', target: pivotButtons[0], preventDefault: (): void => { /** Null */ } });
            expect(1).toBe(1);
        });
        it('select context Menu', (done: Function) => {
            expect(document.getElementById("PivotGridvalueFieldContextMenu")).toBeTruthy;
            let menuObj: any = (pivotGridObj.pivotButtonModule.menuOption as any).menuInfo[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
            let menu: any = {
                element: li[1],
                item: menuObj.items[1]
            };
            menuObj.select(menu as MenuEventArgs);
            var valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            let buttonText: HTMLElement = ((pivotButtons[0]).querySelector('.e-pvt-btn-content') as HTMLElement);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                menuObj.close();
                expect(buttonText.innerHTML).toEqual('Count of balance');
                done();
            }, 1000);
        });
        it('check pivot grid aggregation', () => {
            expect(pivotGridObj.pivotValues[1][1].formattedText).toEqual('69');
        });
        it('check dropdown icon for more option', () => {
            var valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'enter', target: pivotButtons[0], preventDefault: (): void => { /** Null */ } });
        });
        it('check more option dialog', (done: Function) => {
            expect(document.getElementById("PivotGridvalueFieldContextMenu")).toBeTruthy;
            let menuObj: any = (pivotGridObj.pivotButtonModule.menuOption as any).menuInfo[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
            let menu: any = {
                element: li[li.length - 1],
                item: menuObj.items[li.length - 1]
            };
            menuObj.select(menu as MenuEventArgs);
            var valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            let buttonText: HTMLElement = ((pivotButtons[0]).querySelector('.e-pvt-btn-content') as HTMLElement);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                menuObj.close();
                expect(buttonText.innerHTML).toEqual('Count of balance');
                done();
            }, 1000);
        });
        it('agrregation options check', (done: Function) => {
            let dialogElement: HTMLElement = (pivotGridObj.pivotButtonModule.menuOption as any).valueDialog.element;
            let dropdownlist: any = getInstance(dialogElement.querySelector('#' + 'PivotGrid_type_option') as HTMLElement, DropDownList);
            let fieldsddl: any = getInstance(dialogElement.querySelector('#' + 'PivotGrid_base_field_option') as HTMLElement, DropDownList);
            expect(fieldsddl).toBeTruthy;
            expect(dropdownlist).toBeTruthy;
            dropdownlist.value = "DifferenceFrom";
            fieldsddl.value = "isActive";
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (dialogElement.querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('check pivot grid aggregation', () => {
            expect(pivotGridObj.pivotValues[1][2].formattedText).toEqual('$29,322.76');
        });
        it('Check aggregation in fieldlist', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click()).toBeTruthy;
                done();
            }, 1000);
        });
        it('check dropdown icon', () => {
            var valueField: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-field-list-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            keyModule.keyActionHandler({ action: 'enter', target: pivotButtons[0], preventDefault: (): void => { /** Null */ } });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        it('select context Menu', (done: Function) => {
            expect(document.getElementById("PivotGrid_PivotFieldListvalueFieldContextMenu")).toBeTruthy;
            let menuObj: any = (pivotGridObj.pivotFieldListModule.pivotButtonModule.menuOption as any).menuInfo[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
            let menu: any = {
                element: li[6],
                item: menuObj.items[6]
            };
            menuObj.select(menu as MenuEventArgs);
            var valueField: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-field-list-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            let buttonText: HTMLElement = ((pivotButtons[0]).querySelector('.e-pvt-btn-content') as HTMLElement);
            expect(buttonText.innerHTML === 'Avg of balance').toBeTruthy();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                done();
            }, 1000);
        });
        it('close the fieldlist dialog', (done: Function) => {
            let fieldListWrapper = document.getElementById('PivotGrid_PivotFieldList_Container');

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((fieldListWrapper.querySelector('.e-cancel-btn') as HTMLElement).click()).toBeTruthy;
                done();
            }, 1000);
        });
        it('check pivot grid aggregation', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = pivotGridObj.element.querySelector('td[aria-colindex="1"]');
                expect(target.querySelector(".e-cellvalue").innerHTML).toEqual('green');
                done();
            }, 1000);
        });
        it('destroy aggregate menu', () => {
            let menuOption: any = pivotGridObj.pivotButtonModule.menuOption;
            menuOption.destroy();
            expect((pivotGridObj.pivotButtonModule.menuOption as any).menuInfo[0]).toBeUndefined;
            expect((pivotGridObj.pivotButtonModule.menuOption as any).valueDialog).toBeUndefined;
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