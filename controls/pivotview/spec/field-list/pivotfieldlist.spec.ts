import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, isNullOrUndefined, EmitType, closest, extend, getInstance } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { PivotCommon } from '../../src/common/base/pivot-common';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { TreeView } from '@syncfusion/ej2-navigations';
import { LoadEventArgs, FieldDroppedEventArgs } from '../../src';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { EventHandler } from '@syncfusion/ej2-base';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DatePicker } from '@syncfusion/ej2-calendars';

describe('PivotFieldList spec', () => {
    /**
     * Pivot Field List base spec
     */
    function disableDialogAnimation(dialogObject: Dialog): void {
        dialogObject.animationSettings = { effect: 'None' };
        dialogObject.dataBind();
        dialogObject.hide();
    }

    function checkTreeNode(treeObj: TreeView, li: Element): void {
        removeClass(treeObj.element.querySelectorAll('li'), ['e-node-focus', 'e-active']);
        addClass([li], ['e-node-focus', 'e-active']);
        (treeObj as any).checkNode((li).getAttribute('data-uid'));
    }

    describe('Pivot Field List base module', () => {
        describe('Field List properties', () => {
            let fieldListObj: PivotFieldList;
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
                fieldListObj = new PivotFieldList({
                    dataSource: {
                        data: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance', caption: 'Amount' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    cssClass: 'test-class',
                    dataBound: dataBound
                });
                fieldListObj.appendTo('#PivotFieldList');
                disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            it('control class testing', () => {
                expect(document.getElementById('PivotFieldList').classList.contains('e-pivotfieldlist')).toEqual(true);
            });
            it('get component name testing', () => {
                expect(fieldListObj.getModuleName()).toEqual('pivotfieldlist');
            });
            it('show field list', () => {
                (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(fieldListObj.dialogRenderer.fieldListDialog.element.classList.contains('e-popup-open')).toBe(true);
            });
            it('field-list getPersist', () => {
                persistdata = fieldListObj.getPersistData();
                expect(true).toBeTruthy();
            });
            it('field-list getPersist expect', () => {
                expect(!isNullOrUndefined(JSON.parse(persistdata).dataSource)).toBeTruthy();
            });
            it('set rtl property', (done: Function) => {
                fieldListObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('remove rtl property', (done: Function) => {
                fieldListObj.enableRtl = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('set locale property', (done: Function) => {
                fieldListObj.locale = 'fr-FR';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let element: HTMLElement = document.getElementById('PivotFieldList_Wrapper_title').querySelector('.e-title-content');
                    expect(element.textContent).toBe('Field List');
                    done();
                }, 1000);
            });
            it('field-list destroy', () => {
                fieldListObj.destroy();
                expect(true).toBeTruthy();
            });
            it('field-list destroy expect', () => {
                expect(fieldListObj.element.innerHTML).toBe('');
            });
        });
        describe('Field List with RTL', () => {
            let fieldListObj: PivotFieldList;
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
                fieldListObj = new PivotFieldList({
                    dataSource: {
                        data: pivot_dataset as IDataSet[],
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
                    cssClass: 'test-class',
                    enableRtl: true,
                    dataBound: dataBound
                });
                fieldListObj.appendTo('#PivotFieldList');
                disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            it('control class testing', () => {
                expect(document.getElementById('PivotFieldList').classList.contains('e-pivotfieldlist')).toEqual(true);
                expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).toEqual(true);
            });
            it('get component name testing', () => {
                expect(fieldListObj.getModuleName()).toEqual('pivotfieldlist');
            });
            it('show field list', () => {
                (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(fieldListObj.dialogRenderer.fieldListDialog.element.classList.contains('e-popup-open')).toBe(true);
            });
            it('set locale property', (done: Function) => {
                fieldListObj.locale = 'en-US';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let element: HTMLElement = document.getElementById('PivotFieldList_Wrapper_title').querySelector('.e-title-content');
                    expect(element.textContent).toBe('Field List');
                    done();
                }, 1000);
            });
            it('field-list destroy', () => {
                fieldListObj.destroy();
                expect(true).toBeTruthy();
            });
            it('field-list destroy expect', () => {
                expect(fieldListObj.element.innerHTML).toBe('');
            });
        });
    });

    /**
     * Pivot Field List render spec
     */

    describe('Pivot Field List Rendering', () => {
        describe('Field List with Static mode', () => {
            let fieldListObj: PivotFieldList;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: true,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                            { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                            { name: 'gender', type: 'Include', items: ['male'] }],
                            rows: [{ name: 'company' }, { name: 'state' }],
                            columns: [{ name: 'name', caption: 'The caption is used to show the horizontal scrollbar' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                        },
                        renderMode: 'Fixed'
                    });
                fieldListObj.appendTo('#PivotFieldList');
            });
            let persistdata: string;
            it('control class testing', () => {
                expect(document.getElementById('PivotFieldList').classList.contains('e-pivotfieldlist')).toEqual(true);
            });
            it('check field list control wrapper', () => {
                expect(!isNullOrUndefined(fieldListObj.element.querySelector('.e-pivotfieldlist-wrapper')));
            });
            it('check calculated field', () => {
                let controlWrapper: HTMLElement = fieldListObj.element.querySelector('.e-pivotfieldlist-wrapper');
                (controlWrapper.querySelector('.e-calculated-field') as HTMLElement).click();
                expect(!isNullOrUndefined(fieldListObj.element.querySelector('.e-pivotfieldlist-wrapper')));
            });
        });
        describe('Field List with Dynamic mode', () => {
            let fieldListObj: PivotFieldList;
            let pivotCommon: PivotCommon;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            let elem1: HTMLElement = createElement('div', { id: 'PivotFieldList1', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
                remove(elem1);
            });
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                if (document.getElementById(elem1.id)) {
                    remove(document.getElementById(elem1.id));
                }
                document.body.appendChild(elem);
                document.body.appendChild(elem1);
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: true,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                            { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                            { name: 'gender', type: 'Include', items: ['male'] }],
                            rows: [{ name: 'company' }, { name: 'state' }],
                            columns: [{ name: 'name', caption: 'The caption is used to show the horizontal scrollbar' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                        },
                        renderMode: 'Popup',
                        target: elem1
                    });
                fieldListObj.appendTo('#PivotFieldList');
                disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
                pivotCommon = fieldListObj.pivotCommon;
            });
            let persistdata: string;
            it('control class testing', () => {
                expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
            });
            it('check field list icon', () => {
                (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check field list dialog with targetID', () => {
                expect(!isNullOrUndefined(elem1.querySelector('.e-pivotfieldlist-wrapper')));
            });
            it('check calculated field', () => {
                let controlWrapper: HTMLElement = elem1.querySelector('.e-pivotfieldlist-wrapper');
                (controlWrapper.querySelector('.e-calculated-field') as HTMLElement).click();
                expect(!isNullOrUndefined(elem1.querySelector('.e-pivotfieldlist-wrapper')));
                expect(elem1.querySelector('.e-pivotfieldlist-wrapper').classList.contains('e-popup-open'));
            });
            it('check filter popup', (done: Function) => {
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
            it('check close field list', () => {
                let controlWrapper: HTMLElement = elem1.querySelector('.e-pivotfieldlist-wrapper');
                (controlWrapper.querySelector('.e-cancel-btn') as HTMLElement).click();
                expect(elem1.querySelector('.e-pivotfieldlist-wrapper').classList.contains('e-popup-close'));
            });
        });
        describe('Field List with target ID', () => {
            let fieldListObj: PivotFieldList;
            let pivotCommon: PivotCommon;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            let elem1: HTMLElement = createElement('div', { id: 'PivotFieldList1', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
                remove(elem1);
            });
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                if (document.getElementById(elem1.id)) {
                    remove(document.getElementById(elem1.id));
                }
                document.body.appendChild(elem);
                document.body.appendChild(elem1);
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                        renderMode: 'Popup',
                        target: '#' + elem1.id
                    });
                fieldListObj.appendTo('#PivotFieldList');
                disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
                pivotCommon = fieldListObj.pivotCommon;
            });
            let persistdata: string;
            it('control class testing', () => {
                expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
            });
            it('check field list icon', () => {
                (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check field list dialog with targetID', () => {
                expect(!isNullOrUndefined(elem1.querySelector('.e-pivotfieldlist-wrapper')));
            });
            it('check calculated field', () => {
                let controlWrapper: HTMLElement = elem1.querySelector('.e-pivotfieldlist-wrapper');
                (controlWrapper.querySelector('.e-calculated-field') as HTMLElement).click();
                expect(!isNullOrUndefined(elem1.querySelector('.e-pivotfieldlist-wrapper')));
                expect(elem1.querySelector('.e-pivotfieldlist-wrapper').classList.contains('e-popup-open'));
            });
            it('check filter popup', (done: Function) => {
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
            it('check close field list', () => {
                let controlWrapper: HTMLElement = elem1.querySelector('.e-pivotfieldlist-wrapper');
                (controlWrapper.querySelector('.e-cancel-btn') as HTMLElement).click();
                expect(elem1.querySelector('.e-pivotfieldlist-wrapper').classList.contains('e-popup-close'));
            });
        });
        describe('Field List rendering on mobile device', () => {
            describe('Static rendering', () => {
                let fieldListObj: PivotFieldList;
                let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:100%' });
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
                    fieldListObj = new PivotFieldList({
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                        allowCalculatedField: true,
                        dataBound: dataBound,
                        renderMode: 'Fixed',
                        load: (args: LoadEventArgs) => {
                            fieldListObj.isAdaptive = true;
                        }
                    });
                    fieldListObj.appendTo('#PivotFieldList');
                    fieldListObj.calculatedFieldModule = new CalculatedField(fieldListObj);
                });
                let persistdata: string;
                it('control class testing for mobile device', () => {
                    expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
                    expect(fieldListObj.element.classList.contains('e-device')).toEqual(true);
                });
                it('get component name testing', () => {
                    expect(fieldListObj.getModuleName()).toEqual('pivotfieldlist');
                });
                it('check on axis view change', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                    let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                    expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                    headerElement[1].click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(headerElement[1].textContent).toBe('Columns');
                        expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                        let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                        expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                        done();
                    }, 1000);
                });
                it('check on axis view change to calculated field', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                    let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                    expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                    headerElement[4].click();
                    setTimeout(() => {
                        expect(headerElement[4].textContent).toBe('Create Calculated Field');
                        expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
                        let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-calculated-field-btn');
                        expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                        done();
                    }, 100);
                });
                it('check on change calculated field to axis view', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                    let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                    expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
                    headerElement[1].click();
                    setTimeout(() => {
                        expect(headerElement[1].textContent).toBe('Columns');
                        expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                        let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                        expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                        done();
                    }, 100);
                });
                it('check sorting pivotbutton', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    expect(element.querySelector('.e-content').querySelector('.e-item.e-active')).not.toBeUndefined;
                    let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                    let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
                        done();
                    }, 1000);
                });
                it('open filter popup', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                    let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                        done();
                    }, 1000);
                });
                it('close filter popup by cancel', (done: Function) => {
                    (fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-cancel-btn') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                        done();
                    });
                });
                it('check remove pivot button', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                    let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect(pivotButtons[0].id).toBe('name');
                    (pivotButtons[0].querySelector('.e-remove') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButtons = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                        expect(pivotButtons.length).toEqual(0);
                        done();
                    }, 1000);
                });
                it('Open fields dialog', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                    let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toEqual(0);
                    let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                    expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                    addButton.click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(element.parentElement
                            .querySelector('.e-adaptive-field-list-dialog').classList.contains('e-popup-open')).toBe(true);
                        done();
                    }, 1000);
                });
                it('check on field node', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(checkEle[0].querySelector('.e-check')).toBeTruthy;
                        done();
                    }, 1000);
                });
                it('un-check on field node', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(checkEle[0].querySelector('.e-check')).toBeUndefined;
                        done();
                    }, 1000);
                });
                it('check add fields to current axis', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                    expect(checkEle[0].querySelector('.e-check')).toBeTruthy;
                    (element.parentElement
                        .querySelector('.e-adaptive-field-list-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(element.parentElement
                            .querySelector('.e-adaptive-field-list-dialog')).toBeUndefined;
                        let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                        let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                        expect(pivotButtons.length).toEqual(1);
                        expect(pivotButtons[0].id).toBe('_id');
                        let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                        addButton.click();
                        done();
                    }, 1000);
                });
                it('check add fields on search option', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    expect(element.parentElement.querySelector('.e-adaptive-field-list-dialog')).toBeTruthy;
                    expect(element.parentElement
                        .querySelector('.e-adaptive-field-list-dialog').classList.contains('e-popup-open')).toBe(true);
                    let searchOption: MaskedTextBox = (fieldListObj.treeViewModule as any).editorSearch;
                    expect(searchOption).not.toBeUndefined;
                    searchOption.setProperties({ value: 'gender' });
                    searchOption.change({ value: searchOption.value });
                    let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(checkEle[0].querySelector('.e-check')).toBeTruthy;
                        (element.parentElement
                            .querySelector('.e-adaptive-field-list-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('set rtl property', (done: Function) => {
                    fieldListObj.enableRtl = true;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(fieldListObj.element.classList.contains('e-rtl')).toBeTruthy;
                        done();
                    }, 1000);
                });
                it('remove rtl property', (done: Function) => {
                    fieldListObj.enableRtl = false;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(fieldListObj.element.classList.contains('e-rtl')).not.toBeTruthy;
                        done();
                    }, 1000);
                });
                it('check on axis view change to calculated field', (done: Function) => {
                    let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                    expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                    let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                    headerElement[4].click();
                    setTimeout(() => {
                        expect(headerElement[4].textContent).toBe('Create Calculated Field');
                        expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
                        let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-calculated-field-btn');
                        expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                        done();
                    }, 100);
                });
                // it('check field list icon', (done: Function) => {
                //     (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                //     setTimeout(() => {
                //         expect(fieldListObj.dialogRenderer.fieldListDialog.element.classList.contains('e-popup-open')).toBe(true);
                //         let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                //         let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                //         expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                //         let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                //         expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
                //         headerElement[4].click();
                //         done();
                //     }, 1000);
                // });
                it('check on calculated field apply button', (done: Function) => {
                    (document.querySelector('.e-pivot-ok-button') as any).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-dialog').length === 0).toBeTruthy;
                        // (document.querySelector('.e-control.e-btn.e-ok-btn') as any).click();
                        // document.querySelector('.e-pivot-error-dialog').remove();
                        done();
                    }, 1000);
                });
                it('check on calculated field add button', (done: Function) => {
                    (document.querySelector('.e-calculated-field-btn') as any).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-pivot-accord').length > 0).toBeTruthy;
                        (document.querySelector('.e-pivot-cancel-button') as any).click();
                        done();
                    }, 1000);
                });
                it('check on calculated field apply button', (done: Function) => {
                    (document.querySelector('.e-pivot-calc-input') as any).value = 'ss';
                    (document.querySelector('.e-pivot-formula') as any).value = '11';
                    let calc: any = fieldListObj.calculatedFieldModule;
                    calc.inputObj.value = 'ss';
                    (document.querySelector('.e-pivot-ok-button') as any).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelector('.e-pivot-calc-input') as any).value === '').toBeTruthy;
                        (document.querySelector('.e-calculated-field-btn') as any).click();
                        done();
                    }, 1000);
                });
                it('check on calculated field add field', (done: Function) => {
                    (document.querySelector('.e-icons.e-frame') as any).click();
                    (document.querySelector('.e-tgl-collapse-icon') as any).click();
                    (document.querySelectorAll('.e-pivot-calc-radio')[2] as any).click();
                    (document.querySelectorAll('.e-icons.e-frame')[12] as any).click();
                    (document.querySelector('.e-pivot-add-button') as any).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelector('.e-pivot-formula') as any).
                            value === '"Sum(balance)"+"Sum(quantity)""Avg(age)"').toBeTruthy;
                        (document.querySelector('.e-pivot-calc-input') as any).value = 'New';
                        let calc: any = fieldListObj.calculatedFieldModule;
                        calc.inputObj.value = 'New';
                        (document.querySelector('.e-pivot-ok-button') as any).click();
                        done();
                    }, 1000);
                });
                it('check on calculated field change existing formula', (done: Function) => {
                    (document.querySelector('.e-pivot-calc-input') as any).value = 'New';
                    (document.querySelector('.e-pivot-formula') as any).value = '100';
                    let calc: any = fieldListObj.calculatedFieldModule;
                    calc.inputObj.value = 'New';
                    (document.querySelector('.e-pivot-ok-button') as any).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelector('.e-pivot-calc-input') as any).value === '').toBeTruthy;
                        done();
                    }, 1000);
                });
                it('check on calculated field change existing formula', (done: Function) => {
                    (document.querySelector('.e-pivot-calc-input') as any).value = 'balance';
                    (document.querySelector('.e-pivot-formula') as any).value = '100';
                    let calc: any = fieldListObj.calculatedFieldModule;
                    calc.inputObj.value = 'balance';
                    (document.querySelector('.e-pivot-ok-button') as any).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelector('.e-pivot-calc-input') as any).value === '').toBeTruthy;
                        done();
                    }, 1000);
                });
                it('check on calculated field change existing formula', (done: Function) => {
                    (document.querySelector('.e-pivot-calc-input') as any).value = 'Sales';
                    (document.querySelector('.e-pivot-formula') as any).value = '100/+/';
                    let calc: any = fieldListObj.calculatedFieldModule;
                    calc.inputObj.value = 'Sales';
                    (document.querySelector('.e-pivot-ok-button') as any).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-pivot-error-dialog').length > 0).toBeTruthy;
                        (document.querySelector('.e-control.e-btn.e-ok-btn') as any).click();
                        document.querySelector('.e-pivot-error-dialog').remove();
                        done();
                    }, 1000);
                });
            });
            describe('Dynamic rendering', () => {
                let fieldListObj: PivotFieldList;
                let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:100%' });
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
                    fieldListObj = new PivotFieldList({
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                        allowCalculatedField: true,
                        dataBound: dataBound,
                        load: (args: LoadEventArgs) => {
                            fieldListObj.isAdaptive = true;
                        }
                    });
                    fieldListObj.appendTo('#PivotFieldList');
                    disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
                    fieldListObj.calculatedFieldModule = new CalculatedField(fieldListObj);
                });
                let persistdata: string;
                it('control class testing for mobile device', () => {
                    expect(document.getElementById('PivotFieldList').classList.contains('e-pivotfieldlist')).toEqual(true);
                    expect(document.getElementById('PivotFieldList').classList.contains('e-device')).toEqual(true);
                });
                it('get component name testing', () => {
                    expect(fieldListObj.getModuleName()).toEqual('pivotfieldlist');
                });
                it('check field list icon', (done: Function) => {
                    (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(fieldListObj.dialogRenderer.fieldListDialog.element.classList.contains('e-popup-open')).toBe(true);
                        done();
                    }, 1000);
                });

                it('check on axis view change', (done: Function) => {
                    let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                    let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                    expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                    let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                    expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                    headerElement[1].click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(headerElement[1].textContent).toBe('Columns');
                        expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                        let addButton: HTMLElement = dialogElement.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                        expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                        done();
                    }, 1000);
                });
                it('check on axis view change to calculated field', (done: Function) => {
                    let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                    let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                    expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                    let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                    expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                    headerElement[4].click();
                    setTimeout(() => {
                        expect(headerElement[4].textContent).toBe('Create Calculated Field');
                        expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
                        let addButton: HTMLElement = dialogElement.
                            querySelector('.e-field-list-footer').querySelector('.e-calculated-field-btn');
                        expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                        done();
                    }, 100);
                });
                it('check on change calculated field to axis view', (done: Function) => {
                    let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                    let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                    expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                    let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                    expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
                    headerElement[1].click();
                    setTimeout(() => {
                        expect(headerElement[1].textContent).toBe('Columns');
                        expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                        let addButton: HTMLElement = dialogElement.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                        expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                        done();
                    }, 100);
                });
                it('check sorting pivotbutton', (done: Function) => {
                    let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                    let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                    expect(element.querySelector('.e-content').querySelector('.e-item.e-active')).not.toBeUndefined;
                    let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                    let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
                        done();
                    }, 1000);
                });
                it('open filter popup', (done: Function) => {
                    let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                    let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                    let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                    let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                        done();
                    }, 1000);
                });
                it('close filter popup by cancel', (done: Function) => {
                    (fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-cancel-btn') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                        done();
                    }, 1000);
                });
                it('check remove pivot button', (done: Function) => {
                    let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                    let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                    let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                    let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect(pivotButtons[0].id).toBe('name');
                    (pivotButtons[0].querySelector('.e-remove') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButtons = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                        expect(pivotButtons.length).toEqual(0);
                        done();
                    }, 1000);
                });
                it('Open fields dialog', (done: Function) => {
                    let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                    let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                    let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                    let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toEqual(0);
                    let addButton: HTMLElement = dialogElement.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                    expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                    addButton.click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(dialogElement.querySelector('.e-adaptive-field-list-dialog').classList.contains('e-popup-open')).toBe(true);
                        done();
                    }, 1000);
                });
                it('check on field node', () => {
                    let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                    let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                    let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                    expect(checkEle[0].querySelector('.e-check')).toBeTruthy;
                });
                it('un-check on field node', () => {
                    let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                    let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                    let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                    expect(checkEle[0].querySelector('.e-check')).toBeUndefined;
                });
                it('check add fields to current axis', (done: Function) => {
                    let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                    let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                    let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                    checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                    expect(checkEle[0].querySelector('.e-check')).toBeTruthy;
                    (dialogElement.querySelector('.e-adaptive-field-list-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(dialogElement.querySelector('.e-adaptive-field-list-dialog')).toBeUndefined;
                        let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                        let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                        expect(pivotButtons.length).toEqual(1);
                        expect(pivotButtons[0].id).toBe('_id');
                        let addButton: HTMLElement = dialogElement.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                        addButton.click();
                        done();
                    }, 1000);
                });
                it('set rtl property', (done: Function) => {
                    fieldListObj.enableRtl = true;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).toBeTruthy;
                        done();
                    }, 1000);
                });
                it('remove rtl property', (done: Function) => {
                    fieldListObj.enableRtl = false;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).not.toBeTruthy;
                        done();
                    }, 1000);
                });
            });
        });
    });

    /**
     * Pivot Field List tree view spec
     */

    describe('Pivot Field List Rendering', () => {
        describe('Field List with Tree Node Action', () => {
            let fieldListObj: PivotFieldList;
            let pivotCommon: PivotCommon;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                        renderMode: 'Fixed'
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });

            let persistdata: string;
            it('check field list tree view', () => {
                expect(!isNullOrUndefined(fieldListObj.element.querySelector('.e-pivotfieldlist-wrapper')));
                expect(fieldListObj.treeViewModule.fieldTable.element.classList.contains('e-field-list'));
            });
            it('check tree header node', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
            });
            it('checked node check axis button', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] =
                    [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).toBe('_id');
            });
            it('un-check tree header nodes', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                expect(checkEle[0].getAttribute('aria-checked')).toBe('false');
            });
            it('un-checked node check axis button', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).not.toBe('pno');
            });
            it('check tree value node', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[10], 'li'));
                expect(checkEle[10].getAttribute('aria-checked')).toBe('true');
            });
            it('checked node check axis button', () => {
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).toBe('index');
            });
            it('un-check tree value nodes', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[10], 'li'));
                expect(checkEle[10].getAttribute('aria-checked')).toBe('false');
            });
            it('un-checked node check axis button', () => {
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).not.toBe('age');
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
            it('check tree header node with filter popup', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
            });
            it('checked node check axis button with filter popup closed', () => {
                expect(isNullOrUndefined(document.getElementById(fieldListObj.element.id + '_EditorTreeView'))).toBe(true);
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).toBe('_id');
            });
        });
    });

    /**
     * Pivot Field List sort and filter spec
     */

    describe('Pivot Field List Rendering', () => {
        describe('Check Sort Actions', () => {
            let fieldListObj: PivotFieldList;
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
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: false,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                            { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                            { name: 'gender', type: 'Include', items: ['male'] }],
                            rows: [{ name: 'company' }, { name: 'state' }],
                            columns: [{ name: 'name' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                        },
                        renderMode: 'Fixed',
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
            });
            it('check sort icon disabled', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-sort').classList.contains('e-disable')).not.toBeTruthy;
            });
            it('enable enableSorting on dataSource', (done: Function) => {
                fieldListObj.dataSource = {
                    data: pivot_dataset as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    sortSettings: [{ name: 'company', order: 'Descending' }],
                    filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                    { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                    { name: 'gender', type: 'Include', items: ['male'] }],
                    rows: [{ name: 'company' }, { name: 'state' }],
                    columns: [{ name: 'name' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                };
                fieldListObj.refresh();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                    let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect((pivotButtons[0]).querySelector('.e-sort').classList.contains('e-disable')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('sort ascending order field', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check descending order field', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('Sort descending order field', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[1]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check ascending order field', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[1]).querySelector('.e-descend')).toBeUndefined;
            });
        });
        describe('Check Filter Actions', () => {
            let fieldListObj: PivotFieldList;
            let pivotCommon: PivotCommon;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                        renderMode: 'Fixed'
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('open filter popup', (done: Function) => {
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
            it('close filter popup by cancel', (done: Function) => {
                (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-cancel-btn') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    done();
                }, 1000);
            });
            it('check include type filter field', (done: Function) => {
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
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(allNode, 'li'));
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filter')).toBeTruthy;
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('un-check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(allNode, 'li'));
                expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
            });
            it('check single node on filter popup', () => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                expect(checkedEle.length).toEqual(1);
                expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            });
            it('un-check single node on filter popup', () => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                expect(checkedEle.length).toEqual(0);
                expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
                (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('update filter State by check member node', () => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                expect(checkedEle.length).toEqual(1);
                expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter popup after update', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
            });
            it('check exclude type filter field', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[1]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('close filter dialog by sort icon', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                    done();
                }, 1000);
            });
            it('check filter field without having filter-setings', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('un-check single node on filter popup', () => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                let allNode: HTMLElement = pivotCommon.filterDialog.allMemberSelect.element.querySelector('.e-checkbox-wrapper');
                expect(allNode.querySelector('.e-frame').classList.contains('e-stop')).toBeTruthy;
                expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            });
            it('check filter popup after update', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
            });
            it('check search nodes for no matches', () => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                let searchOption: MaskedTextBox = pivotCommon.filterDialog.editorSearch;
                searchOption.setProperties({ value: '1' });
                searchOption.change({ value: searchOption.value });
                let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
                let allNode: HTMLLIElement[] = <HTMLLIElement[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                expect(allNode.length).toBe(1);
                expect(allNode[0].classList.contains('e-disable')).not.toBeTruthy;
                expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
            });
            it('check single node on search nodes', () => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                let searchOption: MaskedTextBox = pivotCommon.filterDialog.editorSearch;
                searchOption.setProperties({ value: 'delhi' });
                searchOption.change({ value: searchOption.value });
                let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
                let allNode: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(allNode.length).toBe(1);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(allNode[0], 'li'));
                expect(allNode[0].querySelector('.e-frame').classList.contains('e-check')).not.toBeTruthy;
                expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter popup after update', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
            });
        });
        describe('Check Label Filter Actions', () => {
            let fieldListObj: PivotFieldList;
            let pivotCommon: PivotCommon;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
                            expandAll: true,
                            enableSorting: true,
                            allowLabelFilter: true,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }],
                            drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                            filterSettings: [
                                { name: 'product', type: 'Label', condition: 'Contains', value1: 'i', value2: 'v' },
                                { name: 'eyeColor', type: 'Exclude', items: ['blue'] }
                            ],
                            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }],
                            filters: [],
                        },
                        renderMode: 'Fixed'
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('check label filter for code behind', () => {
                expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
            });
            it('open filter popup', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    expect(pivotCommon.filterDialog.dialogPopUp).toBeTruthy;
                    done();
                }, 1000);
            });
            it('check on member filter type change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(2);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                headerElement[0].click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(headerElement[0].textContent).toBe('Member');
                    expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                    headerElement[1].click();
                    done();
                }, 1000);
            });
            it('Check clear filter option', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(2);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[1].textContent).toBe('Label');
                expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                (dialogElement.querySelector('.e-clear-filter-button') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).not.toBeTruthy;
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('check on label filter type change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(2);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                headerElement[1].click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(headerElement[1].textContent).toBe('Label');
                    expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('check label filter options', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                let dropdownlist: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_label_contition_option_wrapper') as HTMLElement, DropDownList);
                expect(dropdownlist).toBeTruthy;
                dropdownlist.value = "Between";
                let input1: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_label_input_option_1') as HTMLElement, MaskedTextBox);
                let input2: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_label_input_option_2') as HTMLElement, MaskedTextBox);
                expect(input1).toBeTruthy;
                expect(input2).toBeTruthy;
                input1.setProperties({ value: 'a' });
                input1.change({ value: input1.value });
                input2.setProperties({ value: 'v' });
                input2.change({ value: input2.value });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(input1.value === 'a').toBeTruthy;
                    expect(input2.value === 'v').toBeTruthy;
                    done();
                }, 1000);
            });
            it('check update filter using ok', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                let dropdownlist: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_label_contition_option_wrapper') as HTMLElement, DropDownList);
                dropdownlist.value = 'Contains';
                setTimeout(() => {
                    (dialogElement.querySelector('.e-ok-btn') as HTMLElement).click();
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                    let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                    let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('check with sort order change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
                setTimeout(() => {
                    expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('drag/drop pivot button from axis field to same axis field', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                expect(pivotButton.length).toEqual(2);
                setTimeout(() => {
                    expect((pivotButton[pivotButton.length - 1]).querySelector('.e-descend')).toBeTruthy;
                    expect((pivotButton[pivotButton.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('set rtl property', (done: Function) => {
                fieldListObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('open filter popup', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    expect(pivotCommon.filterDialog.dialogPopUp).toBeTruthy;
                    done();
                }, 1000);
            });
            it('close filter popup by cancel', (done: Function) => {
                let dialogElement: HTMLElement = document.getElementById(fieldListObj.element.id + '_EditorTreeView');
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                (dialogElement.querySelector('.e-cancel-btn') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(dialogElement).toBeUndefined;
                    done();
                }, 1000);
            });
        });
        describe('Check Date Filter Actions', () => {
            let fieldListObj: PivotFieldList;
            let pivotCommon: PivotCommon;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
                            expandAll: true,
                            enableSorting: true,
                            allowLabelFilter: true,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' },
                            { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                            drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                            filterSettings: [
                                { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') }
                            ],
                            rows: [{ name: 'date', caption: 'TimeLine' }],
                            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }],
                            filters: []
                        },
                        renderMode: 'Fixed'
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('check Date type filtering at code-behind', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                    let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                    let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    done();
                }, 2000);
            });
            it('open filter popup', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    expect(pivotCommon.filterDialog.dialogPopUp).toBeTruthy;
                    done();
                }, 2000);
            });
            it('check on member filter type change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(2);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                headerElement[0].click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(headerElement[0].textContent).toBe('Member');
                    expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                    headerElement[1].click();
                    done();
                }, 2000);
            });
            it('Check clear filter option', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(2);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[1].textContent).toBe('Date');
                expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                (dialogElement.querySelector('.e-clear-filter-button') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).not.toBeTruthy;
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('check on date filter type change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(2);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                headerElement[1].click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(headerElement[1].textContent).toBe('Date');
                    expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                    done();
                }, 2000);
            });
            it('check date filter options', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                let dropdownlist: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_date_contition_option_wrapper') as HTMLElement, DropDownList);
                expect(dropdownlist).toBeTruthy;
                dropdownlist.value = "NotBetween";
                let input1: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_date_input_option_1') as HTMLElement, DatePicker);
                let input2: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_date_input_option_2') as HTMLElement, DatePicker);
                expect(input1).toBeTruthy;
                expect(input2).toBeTruthy;
                input1.setProperties({ value: new Date('02/15/2000') });
                input1.change({ value: input1.value });
                input2.setProperties({ value: new Date('02/15/2002') });
                input2.change({ value: input2.value });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(input1.value.toDateString() === 'Tue Feb 15 2000').toBeTruthy;
                    expect(input2.value.toDateString() === 'Fri Feb 15 2002').toBeTruthy;
                    done();
                }, 2000);
            });
            it('check update filter using ok', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                let dropdownlist: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_date_contition_option_wrapper') as HTMLElement, DropDownList);
                dropdownlist.value = 'GreaterThan';
                setTimeout(() => {
                    (dialogElement.querySelector('.e-ok-btn') as HTMLElement).click();
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                    let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                    let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('check with sort order change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
                setTimeout(() => {
                    expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    done();
                }, 2000);
            });
            it('drag/drop pivot button from axis field to same axis field', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                expect(pivotButton.length).toEqual(1);
                setTimeout(() => {
                    expect((pivotButton[pivotButton.length - 1]).querySelector('.e-descend')).toBeTruthy;
                    expect((pivotButton[pivotButton.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    done();
                }, 2000);
            });
            it('set rtl property', (done: Function) => {
                fieldListObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 2000);
            });
            it('open filter popup', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    expect(pivotCommon.filterDialog.dialogPopUp).toBeTruthy;
                    done();
                }, 2000);
            });
            it('close filter popup by cancel', (done: Function) => {
                let dialogElement: HTMLElement = document.getElementById(fieldListObj.element.id + '_EditorTreeView');
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                (dialogElement.querySelector('.e-cancel-btn') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(dialogElement).toBeUndefined;
                    done();
                }, 2000);
            });
        });
        describe('Check Number Filter Actions', () => {
            let fieldListObj: PivotFieldList;
            let pivotCommon: PivotCommon;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
                            expandAll: true,
                            enableSorting: true,
                            allowLabelFilter: true,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }],
                            drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                            filterSettings: [
                                { name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' }
                            ],
                            rows: [{ name: 'age', caption: 'Age' }],
                            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }],
                            filters: []
                        },
                        renderMode: 'Fixed'
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('check Number type filtering at code-behind', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                    let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                    let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('open filter popup', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    expect(pivotCommon.filterDialog.dialogPopUp).toBeTruthy;
                    done();
                }, 1000);
            });
            it('check on member filter type change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(2);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                headerElement[0].click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(headerElement[0].textContent).toBe('Member');
                    expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                    headerElement[1].click();
                    done();
                }, 1000);
            });
            it('Check clear filter option', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(2);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[1].textContent).toBe('Label');
                expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                (dialogElement.querySelector('.e-clear-filter-button') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).not.toBeTruthy;
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('check on number filter type change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(2);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                headerElement[1].click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(headerElement[1].textContent).toBe('Label');
                    expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('check number filter options', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                let dropdownlist: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_number_contition_option_wrapper') as HTMLElement, DropDownList);
                expect(dropdownlist).toBeTruthy;
                dropdownlist.value = "NotBetween";
                let input1: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_number_input_option_1') as HTMLElement, MaskedTextBox);
                let input2: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_number_input_option_2') as HTMLElement, MaskedTextBox);
                expect(input1).toBeTruthy;
                expect(input2).toBeTruthy;
                input1.setProperties({ value: '24' });
                input1.change({ value: input1.value });
                input2.setProperties({ value: '34' });
                input2.change({ value: input2.value });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(input1.value === '24').toBeTruthy;
                    expect(input2.value === '34').toBeTruthy;
                    done();
                }, 1000);
            });
            it('check update filter using ok', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                let dropdownlist: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_number_contition_option_wrapper') as HTMLElement, DropDownList);
                dropdownlist.value = 'GreaterThan';
                setTimeout(() => {
                    (dialogElement.querySelector('.e-ok-btn') as HTMLElement).click();
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                    let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                    let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('check with sort order change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
                setTimeout(() => {
                    expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    done();
                }, 2000);
            });
            it('drag/drop pivot button from axis field to same axis field', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                expect(pivotButton.length).toEqual(1);
                setTimeout(() => {
                    expect((pivotButton[pivotButton.length - 1]).querySelector('.e-descend')).toBeTruthy;
                    expect((pivotButton[pivotButton.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('set rtl property', (done: Function) => {
                fieldListObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 2000);
            });
            it('open filter popup', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    expect(pivotCommon.filterDialog.dialogPopUp).toBeTruthy;
                    done();
                }, 1000);
            });
            it('close filter popup by cancel', (done: Function) => {
                let dialogElement: HTMLElement = document.getElementById(fieldListObj.element.id + '_EditorTreeView');
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                (dialogElement.querySelector('.e-cancel-btn') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(dialogElement).toBeUndefined;
                    done();
                }, 1000);
            });
        });
        describe('Check Value Filter Actions', () => {
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
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
                            expandAll: true,
                            enableSorting: true,
                            allowLabelFilter: true,
                            allowValueFilter: true,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }],
                            drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                            filterSettings: [
                                { name: 'product', type: 'Value', condition: 'GreaterThan', value1: '2000', measure: 'quantity' },
                                { name: 'eyeColor', type: 'Value', condition: 'GreaterThanOrEqualTo', value1: '600', measure: 'quantity' }
                            ],
                            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }],
                            filters: [],
                        },
                        renderMode: 'Fixed',
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('check value filter for code behind', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                    let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                    let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    done();
                }, 2000);
            });
            it('open filter popup', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    expect(pivotCommon.filterDialog.dialogPopUp).toBeTruthy;
                    done();
                }, 2000);
            });
            it('check on member filter type change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(3);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[2].classList.contains('e-active')).toBeTruthy;
                headerElement[0].click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(headerElement[0].textContent).toBe('Member');
                    expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                    headerElement[2].click();
                    done();
                }, 2000);
            });
            it('Check clear filter option', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(3);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[2].textContent).toBe('Value');
                expect(headerElement[2].classList.contains('e-active')).toBeTruthy;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                (dialogElement.querySelector('.e-clear-filter-button') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).not.toBeTruthy;
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('check on value filter type change', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect([].slice.call(dialogElement.querySelectorAll('.e-toolbar-item')).length).toEqual(3);
                let headerElement: HTMLElement[] = [].slice.call(dialogElement.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                headerElement[2].click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(headerElement[2].textContent).toBe('Value');
                    expect(headerElement[2].classList.contains('e-active')).toBeTruthy;
                    done();
                }, 2000);
            });
            it('check value filter options', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                let dropdownlist: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_value_measure_option_wrapper') as HTMLElement, DropDownList);
                expect(dropdownlist).toBeTruthy;
                dropdownlist.value = "quantity";
                let dropdownlist1: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_value_contition_option_wrapper') as HTMLElement, DropDownList);
                expect(dropdownlist1).toBeTruthy;
                dropdownlist1.value = "Between";
                let input1: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_value_input_option_1') as HTMLElement, MaskedTextBox);
                let input2: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_value_input_option_2') as HTMLElement, MaskedTextBox);
                expect(input1).toBeTruthy;
                expect(input2).toBeTruthy;
                input1.setProperties({ value: '1500' });
                input1.change({ value: input1.value });
                input2.setProperties({ value: '2100' });
                input2.change({ value: input2.value });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(input1.value === '1500').toBeTruthy;
                    expect(input2.value === '2100').toBeTruthy;
                    done();
                }, 2000);
            });
            it('check update filter using ok', (done: Function) => {
                let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                let dropdownlist: any = getInstance(dialogElement.querySelector('#' + fieldListObj.element.id + '_value_contition_option_wrapper') as HTMLElement, DropDownList);
                dropdownlist.value = 'Contains';
                setTimeout(() => {
                    (dialogElement.querySelector('.e-ok-btn') as HTMLElement).click();
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                    let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                    let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    done();
                }, 2000);
            });
            // it('check with sort order change', (done: Function) => {
            //     let dialogElement: HTMLElement = pivotCommon.filterDialog.dialogPopUp.element;
            //     let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            //     let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            //     let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
            //     expect(pivotButtons.length).toBeGreaterThan(0);
            //     ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            //     expect(true).toBe(true);
            //     setTimeout(() => {
            //         expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            //         expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
            //         done();
            //     }, 2000);
            // });
            // it('drag/drop pivot button from axis field to same axis field', (done: Function) => {
            //     let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            //     let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            //     let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            //     expect(pivotButton.length).toEqual(2);
            //     let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            //     let mousedown: any =
            //         getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            //     EventHandler.trigger(dragElement, 'mousedown', mousedown);
            //     let mousemove: any =
            //         getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
            //     mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
            //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            //     mousemove = setMouseCordinates(mousemove, 15, 75);
            //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            //     let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
            //     mouseUp.type = 'mouseup';
            //     mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
            //     EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            //     pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            //     expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
            //     expect(pivotButton.length).toEqual(2);
            //     setTimeout(() => {
            //         expect((pivotButton[pivotButton.length - 1]).querySelector('.e-descend')).toBeTruthy;
            //         expect((pivotButton[pivotButton.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
            //         done();
            //     }, 2000);
            // });
            // it('set rtl property', (done: Function) => {
            //     fieldListObj.enableRtl = true;
            //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            //     setTimeout(() => {
            //         expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).toBeTruthy;
            //         done();
            //     }, 2000);
            // });
            it('open filter popup', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButtons: HTMLElement[] = [].slice.call(rowAxiscontent.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    expect(pivotCommon.filterDialog.dialogPopUp).toBeTruthy;
                    done();
                }, 2000);
            });
            it('close filter popup by cancel', (done: Function) => {
                let dialogElement: HTMLElement = document.getElementById(fieldListObj.element.id + '_EditorTreeView');
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                (dialogElement.querySelector('.e-cancel-btn') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(dialogElement).toBeUndefined;
                    done();
                }, 2000);
            });
        });
    });

    /**
     * Pivot Field List Drag and drop spec
     */


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

    describe('Pivot Field List Rendering', () => {
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('drag and drop node to body', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = treeObj.element;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, treeObj.element);
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
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((li[0]).querySelector('e-check')).not.toBeTruthy;
            });
            it('drag and drop node to filter axis', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((li[0]).querySelector('e-check')).toBeTruthy;
                pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('advance');
            });
            it('drag and drop node to filter axis with button axis', (done: Function) => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = pivotButton[0];
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mouseEventArgs.target = pivotButton[0];
                (fieldListObj.pivotButtonModule as any).parentElement = fieldListObj.element.querySelector('.e-pivotfieldlist-wrapper');
                (fieldListObj.pivotButtonModule as any).updateDropIndicator(mouseEventArgs);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                mouseOverEventArgs.srcElement = mouseOverEventArgs.target = closest(mousemove.srcElement, '.e-droppable');
                (fieldListObj.axisTableModule as any).updateDropIndicator(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (fieldListObj.axisTableModule as any).updateDropIndicator(mouseLeaveEventArgs);
                (fieldListObj.pivotButtonModule as any).updateDropIndicator(mouseEventArgs);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, pivotButton[0]);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((li[0]).querySelector('e-check')).toBeTruthy;
                pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
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
            it('drag and drop node to value axis', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let valueAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-values');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = valueAxiscontent;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, valueAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((li[0]).querySelector('e-check')).toBeTruthy;
                pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                expect(pivotButton.length).toEqual(4);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('advance');
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
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = pivotButton[0];
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, pivotButton[0]);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((li[0]).querySelector('e-check')).toBeTruthy;
                pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotButton.length).toEqual(4);
                    expect(pivotButton[0].getAttribute('data-uid')).toBe('advance');
                    expect((pivotButton[0].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
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
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[li.length - 1].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[li.length - 1].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = valueAxiscontent;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, valueAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((li[li.length - 1]).querySelector('e-check')).toBeTruthy;
                pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('drag and drop pivot button to body', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, treeObj.element, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = treeObj.element;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, treeObj.element);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = treeObj.element;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
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
            it('drag/drop pivot button from axis field to axis field', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
                let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                expect(pivotButton.length).toEqual(2);
            });
            it('drag/drop pivot button from axis field to same axis field', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[pivotButton.length - 1].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                expect(pivotButton.length).toEqual(2);
            });
            it('drag/drop pivot button from axis field to same button', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[pivotButton.length - 1].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, dragElement, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = dragElement;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, dragElement);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = dragElement;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                expect(pivotButton.length).toEqual(2);
            });
            it('drag/drop pivot button from axis field to button position', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let columnAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-columns');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                let columnButtonElement: Element = (columnAxiscontent).querySelectorAll('.e-pivot-button')[0];
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, columnButtonElement, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = columnButtonElement;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, columnButtonElement);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = columnButtonElement;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                pivotButton = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
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
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, filterAxiscontent);
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
        describe('Check public method for node state change', () => {
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
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                        renderMode: 'Fixed',
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('testing row axis using drop args', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowsAxisContent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowsAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let args: any = {
                    target: rowsAxisContent,
                    cancel: true,
                    event: getEventObject('MouseEvents', 'mouseup', treeObj.element, rowsAxisContent) as any
                } as DragAndDropEventArgs;
                pivotCommon.nodeStateModified.onStateModified(args, 'pno');
                fieldListObj.axisFieldModule.render();
                pivotButton = [].slice.call((rowsAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('pno');
            });
            it('testing row axis using drop args with button target', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowsAxisContent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowsAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                let args: any = {
                    target: pivotButton[0],
                    cancel: true,
                    event: getEventObject('MouseEvents', 'mouseup', treeObj.element, pivotButton[0]) as any
                } as DragAndDropEventArgs;
                pivotCommon.nodeStateModified.onStateModified(args, 'pno');
                fieldListObj.axisFieldModule.render();
                pivotButton = [].slice.call((rowsAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                expect(pivotButton[0].getAttribute('data-uid')).toBe('pno');
            });
            it('testing column axis using drop args', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let columnAxisContent: HTMLElement = rightAxisPanel.querySelector('.e-columns');
                let pivotButton: HTMLElement[] = [].slice.call((columnAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let args: any = {
                    target: columnAxisContent,
                    cancel: true,
                    event: getEventObject('MouseEvents', 'mouseup', treeObj.element, columnAxisContent) as any
                } as DragAndDropEventArgs;
                pivotCommon.nodeStateModified.onStateModified(args, 'pno');
                fieldListObj.axisFieldModule.render();
                pivotButton = [].slice.call((columnAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('pno');
            });
            it('testing column axis using drop args with button target', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let columnsAxisContent: HTMLElement = rightAxisPanel.querySelector('.e-columns');
                let pivotButton: HTMLElement[] = [].slice.call((columnsAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let args: any = {
                    target: pivotButton[0],
                    cancel: true,
                    event: getEventObject('MouseEvents', 'mouseup', treeObj.element, pivotButton[0]) as any
                } as DragAndDropEventArgs;
                pivotCommon.nodeStateModified.onStateModified(args, 'pno');
                fieldListObj.axisFieldModule.render();
                pivotButton = [].slice.call((columnsAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[0].getAttribute('data-uid')).toBe('pno');
            });
        });
    });

    /**
     * Pivot Field List Drag and drop spec
     */


    describe('Pivot Field List Rendering', () => {
        describe('Check public method for show error dialog', () => {
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
                fieldListObj = new PivotFieldList(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                        renderMode: 'Fixed',
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('testing on open error dialog with message', (done: Function) => {
                let title: string = 'Title';
                let message: string = 'Error dialog has been opened';
                pivotCommon.errorDialog.createErrorDialog(title, message);
                setTimeout(() => {
                    expect(pivotCommon.errorDialog.errorPopUp.element.classList.contains('e-popup-open')).toBe(true);
                    expect(pivotCommon.errorDialog.errorPopUp.element.querySelector('.e-dlg-header').textContent).toBe(title);
                    expect(pivotCommon.errorDialog.errorPopUp.element.querySelector('.e-dlg-content').textContent).toBe(message);
                    done();
                }, 1000);
            });
            it('close error dialog', (done: Function) => {
                (pivotCommon.errorDialog.errorPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotCommon.errorDialog.errorPopUp).toBeUndefined;
                    done();
                }, 1000);
            });
        });
    });

    /**
     * Pivot keyboard interaction spec
     */

    describe('Pivot Rendering', () => {
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                    // expect(true).toBeTruthy();
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
                    // expect(true).toBeTruthy();
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
                    // expect(true).toBeTruthy();
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
                    // expect(true).toBeTruthy();
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
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
                expect(!isNullOrUndefined(elem.querySelector('.e-pivotfieldlist-wrapper')));
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
            beforeEach((done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    keyModule = pivotGridObj.pivotCommon.keyboardModule;
                    pivotViewKeyModule = pivotGridObj.keyboardModule;
                    pivotCommon = pivotGridObj.pivotCommon;
                    done();
                }, 1000);
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
                    expect(focuesdEle.id === pivotButtons[0].id).toBeTruthy;
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                    expect(pivotGridObj.grid.element.querySelector('.e-collapse')).toBeTruthy;
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                    expect(pivotGridObj.grid.element.querySelector('.e-collapse')).toBeTruthy;
                    done();
                }, 1000);
            });
        });
        describe('Testing on keyboard interaction with PivotGrid only', () => {
            let pivotGridObj: PivotView;
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
                pivotGridObj = new PivotView(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                    target: pivotGridObj.element,
                    preventDefault: (): void => { /** Null */ }
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.grid.element.querySelector('.e-focused')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('Check tab action for last cell', (done: Function) => {
                let gridcell: Element =
                    [].slice.call(pivotGridObj.grid.element.querySelectorAll('td'))[pivotGridObj.grid.element.querySelectorAll('td').length - 1];
                pivotViewKeyModule.keyActionHandler({
                    action: 'tab',
                    target: gridcell,
                    preventDefault: (): void => { /** Null */ }
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.grid.element.querySelector('.e-focused')).not.toBeTruthy;
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
                    expect(pivotGridObj.grid.element.querySelector('.e-collapse')).toBeTruthy;
                    done();
                }, 1000);
            });
        });
    });
});
