import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, EmitType, closest, getInstance } from '@syncfusion/ej2-base';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { MenuEventArgs, TreeView } from '@syncfusion/ej2-navigations';
import { LoadEventArgs, FieldDragStartEventArgs, FieldDropEventArgs, FieldDroppedEventArgs, FieldRemoveEventArgs, CalculatedFieldCreateEventArgs } from '../../src/common/base/interface';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { FieldList } from '../../src/common/actions/field-list';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';

describe('Field List rendering on mobile device', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Static rendering', () => {
        let originalTimeout: number;
        let fieldListObj: PivotFieldList;
        let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:100%' });
        afterAll(() => {
            if (fieldListObj) {
                fieldListObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            fieldListObj = new PivotFieldList({
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
                allowCalculatedField: true,
                dataBound: dataBound,
                renderMode: 'Fixed',
                load: (args: LoadEventArgs) => {
                    fieldListObj.isAdaptive = true;
                },
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
            setTimeout(() => {
                expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('close filter popup by cancel', (done: Function) => {
            (fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-cancel-btn') as HTMLElement).click();
            setTimeout(() => {
                expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(false);
                done();
            });
        });
        it('check remove pivot button', (done: Function) => {
            let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
            let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
            let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect(pivotButtons[0].id).toBe('PivotFieldList_name');
            (pivotButtons[0].querySelector('.e-remove') as HTMLElement).click();
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
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
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
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
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
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            expect(checkEle[0].querySelector('.e-check')).toBeTruthy;
            (element.parentElement
                .querySelector('.e-adaptive-field-list-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
            setTimeout(() => {
                expect(element.parentElement
                    .querySelector('.e-adaptive-field-list-dialog')).toBeUndefined;
                let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toEqual(1);
                expect(pivotButtons[0].id).toBe('PivotFieldList__id');
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
            setTimeout(() => {
                expect(checkEle[0].querySelector('.e-check')).toBeTruthy;
                (element.parentElement
                    .querySelector('.e-adaptive-field-list-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('set rtl property', (done: Function) => {
            fieldListObj.enableRtl = true;
            setTimeout(() => {
                expect(fieldListObj.element.classList.contains('e-rtl')).toBeTruthy;
                done();
            }, 1000);
        });
        it('remove rtl property', (done: Function) => {
            fieldListObj.enableRtl = false;
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
        it('check on calculated field apply button', (done: Function) => {
            (document.querySelector('.e-pivot-ok-button') as any).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-dialog').length === 0).toBeTruthy;
                done();
            }, 1000);
        });
        it('check on calculated field add button', (done: Function) => {
            (document.querySelector('.e-calculated-field-btn') as any).click();
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
            let formatString: MaskedTextBox = getInstance(document.querySelector('#' + fieldListObj.element.id + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(formatString).toBeTruthy;
            formatString.setProperties({ value: 'C0' });
            formatString.refresh();
            (document.querySelector('.e-pivot-ok-button') as any).click();
            setTimeout(() => {
                expect((document.querySelector('.e-pivot-calc-input') as any).value === '').toBeTruthy;
                (document.querySelector('.e-calculated-field-btn') as any).click();
                done();
            }, 1000);
        });
        it('check on calculated field add field', (done: Function) => {
            (document.querySelector('.e-icons.e-frame') as any).click();
            (document.querySelectorAll('.e-tgl-collapse-icon') as any)[11].click();
            (document.querySelectorAll('.e-pivot-calc-radio')[1] as any).click();
            (document.querySelectorAll('.e-icons.e-frame')[12] as any).click();
            (document.querySelector('.e-pivot-add-button') as any).click();
            setTimeout(() => {
                expect((document.querySelector('.e-pivot-formula') as any).
                    value === '"DistinctCount(pno)""Sum(advance)"').toBeTruthy();
                (document.querySelector('.e-pivot-calc-input') as any).value = 'New';
                let calc: any = fieldListObj.calculatedFieldModule;
                calc.inputObj.value = 'New';
                (document.querySelector('.e-pivot-ok-button') as any).click();
                done();
            }, 1000);
        });
        it('Invalid-popup', () => {
            (document.querySelector('.e-ok-btn') as any).click();
        });
        it('check on calculated field change existing formula', (done: Function) => {
            (document.querySelector('.e-pivot-calc-input') as any).value = 'New';
            (document.querySelector('.e-pivot-formula') as any).value = '100/100';
            let calc: any = fieldListObj.calculatedFieldModule;
            calc.inputObj.value = 'New';
            let formatString: MaskedTextBox = getInstance(document.querySelector('#' + fieldListObj.element.id + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(formatString).toBeTruthy;
            formatString.value = 'P1';
            formatString.change({ value: formatString.value });
            (document.querySelector('.e-pivot-ok-button') as any).click();
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
            setTimeout(() => {
                expect((document.querySelector('.e-pivot-calc-input') as any).value === 'balance').toBeTruthy;
                expect(document.querySelectorAll('.e-pivot-error-dialog').length > 0).toBeTruthy;
                (document.querySelector('.e-control.e-btn.e-ok-btn') as any).click();
                done();
            }, 1000);
        });
        it('check on calculated field change existing formula', (done: Function) => {
            (document.querySelector('.e-pivot-calc-input') as any).value = 'Sales';
            (document.querySelector('.e-pivot-formula') as any).value = '100/+/';
            let calc: any = fieldListObj.calculatedFieldModule;
            calc.inputObj.value = 'Sales';
            (document.querySelector('.e-pivot-ok-button') as any).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivot-error-dialog').length > 0).toBeTruthy;
                (document.querySelector('.e-control.e-btn.e-ok-btn') as any).click();
                done();
            }, 1000);
        });
        it('check on calculated field edit icon', (done: Function) => {
            (document.querySelector('.e-calculated-field-btn') as any).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivot-accord').length > 0).toBeTruthy;
                let accordions: HTMLElement[] = [].slice.call(document.querySelectorAll('.e-pivot-accord .e-acrdn-item'));
                expect(accordions.length).toBe(20);
                let calcElement: HTMLElement = accordions[accordions.length - 1] as HTMLElement;
                expect(calcElement).toBeTruthy;
                expect(calcElement.textContent).toBe('New (Calculated Field)');
                (calcElement.querySelector('div.e-acrdn-header-icon > span') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('check on edited calculated field info', (done: Function) => {
            expect((document.querySelector('.e-pivot-calc-input') as any).value).toBe('New');
            expect((document.querySelector('.e-pivot-formula') as any).value).toBe('100/100');
            expect((document.querySelector('.e-custom-format-input') as any).value).toBe('');
            (document.querySelector('.e-pivot-formula') as any).value = '(100/10)+5';
            let calc: any = fieldListObj.calculatedFieldModule;
            calc.inputObj.value = 'New -1';
            calc.inputObj.change({ value: calc.inputObj.value });
            let formatString: MaskedTextBox = getInstance(document.querySelector('#' + fieldListObj.element.id + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(formatString).toBeTruthy;
            formatString.value = 'C1';
            formatString.change({ value: formatString.value });
            setTimeout(() => {
                expect((document.querySelector('.e-pivot-calc-input') as any).value).toBe('New -1');
                expect((document.querySelector('.e-pivot-formula') as any).value).toBe('(100/10)+5');
                expect((document.querySelector('.e-custom-format-input') as any).value).toBe('C1');
                done();
            }, 1000);
        });
        it('check on change calculated field to axis view', (done: Function) => {
            let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
            expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
            let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
            expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
            headerElement[3].click();
            setTimeout(() => {
                expect(headerElement[3].textContent).toBe('Values');
                expect(headerElement[3].classList.contains('e-active')).toBeTruthy;
                let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                done();
            }, 100);
        });
        it('check on axis view change to calculated field', (done: Function) => {
            let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
            expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
            let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
            expect(headerElement[3].classList.contains('e-active')).toBeTruthy;
            headerElement[4].click();
            setTimeout(() => {
                expect(headerElement[4].textContent).toBe('Create Calculated Field');
                expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
                let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-calculated-field-btn');
                expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                done();
            }, 100);
        });
        it('check on edited calculated field info matained after axis changes', (done: Function) => {
            expect((document.querySelector('.e-pivot-calc-input') as any).value).toBe('New -1');
            expect((document.querySelector('.e-pivot-formula') as any).value).toBe('(100/10)+5');
            expect((document.querySelector('.e-custom-format-input') as any).value).toBe('');
            setTimeout(() => {
                (document.querySelector('.e-pivot-ok-button') as any).click();
                done();
            }, 1000);
        });
        it('check on calculated field info reset after changes applied', () => {
            expect((document.querySelector('.e-pivot-calc-input') as any).value).toBe('');
            expect((document.querySelector('.e-pivot-formula') as any).value).toBe('');
            expect((document.querySelector('.e-custom-format-input') as any).value).toBe('');
        });
        it('check on calculated field button edit option', (done: Function) => {
            let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
            expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
            let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
            expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
            headerElement[3].click();
            setTimeout(() => {
                expect(headerElement[3].textContent).toBe('Values');
                expect(headerElement[3].classList.contains('e-active')).toBeTruthy;
                let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                let contentElement: HTMLElement = element.querySelector('.e-field-list-values');
                let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect(pivotButtons[pivotButtons.length - 1].id).toBe('PivotFieldList_New');
                expect(pivotButtons[pivotButtons.length - 1].textContent).toBe('New -1');
                expect(pivotButtons[pivotButtons.length - 1].querySelector('.e-edit')).toBeTruthy;
                (pivotButtons[pivotButtons.length - 1].querySelector('.e-edit') as HTMLElement).click();
                done();
            }, 100);
        });
        it('check -> edited calculated field info', () => {
            let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
            let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
            expect(headerElement[4].textContent).toBe('Create Calculated Field');
            expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
            expect((document.querySelector('.e-pivot-calc-input') as any).value).toBe('New -1');
            expect((document.querySelector('.e-pivot-formula') as any).value).toBe('(100/10)+5');
            expect((document.querySelector('.e-custom-format-input') as any).value).toBe('');
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
                allowCalculatedField: true,
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
                },
                load: (args: LoadEventArgs) => {
                    fieldListObj.isAdaptive = true;
                }
            });
            fieldListObj.appendTo('#PivotFieldList');
            util.disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
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
                expect(document.querySelectorAll('.e-descend').length > 0).toBeTruthy();
                done();
            }, 1000);
        });
        it('Open fields dialog', (done: Function) => {
            let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
            let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
            let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
            let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toEqual(1);
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
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            expect(checkEle[0].querySelector('.e-check')).toBeTruthy;
        });
        it('un-check on field node', () => {
            let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
            let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            expect(checkEle[0].querySelector('.e-check')).toBeUndefined;
        });
        it('check add fields to current axis', (done: Function) => {
            let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
            let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
            let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            expect(checkEle[0].querySelector('.e-check')).toBeTruthy;
            (dialogElement.querySelector('.e-adaptive-field-list-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(dialogElement.querySelector('.e-adaptive-field-list-dialog')).toBeUndefined;
                let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toEqual(2);
                expect(pivotButtons[0].id).toBe('PivotFieldList_name');
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

    describe('Context menu rendering', () => {
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
            PivotView.Inject(FieldList, CalculatedField, GroupingBar);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    formatSettings: [ { name: 'balance', format: 'C' },{ name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                    filterSettings: [
                        { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                        { name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' },
                        { name: 'eyeColor', type: 'Exclude', items: ['blue'] }
                    ],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance', type: 'isMeasureFieldsAvail' as any }, { name: 'quantity', type: 'isMeasureAvail' as any }],
                    filters: [],
                },
                gridSettings:{
                    contextMenuItems:['Aggregate','CalculatedField','Drillthrough','Excel Export','Pdf Export','Csv Export','Expand','Collapse',
                    'Sort Ascending','Sort Descending',{ separator: true, target: 'td.e-valuescontent,th.e-columnsheader,td.e-rowsheader' },{text:'Tooltip',id:'tooltip',target:'td.e-valuescontent',
                    items:[{text:'Show',id:'show'},{text:'Hide',id:'hide',}]},{text:'Exit',id:'close', target:'td.e-valuescontent,th.e-columnsheader,td.e-rowsheader'} as any],
                    contextMenuClick(args:MenuEventArgs):void {
                        if(args.item.id==='show'){
                            pivotGridObj.showTooltip = true;
                        } else if(args.item.id==='hide'){
                            pivotGridObj.showTooltip = false;
                        }
                    }
                },
                load: (args: LoadEventArgs) => {
                    pivotGridObj.isAdaptive = true;
                },
                allowCalculatedField: true,
                showFieldList: true,
                allowExcelExport:true,
                allowPdfExport:true,
                allowDrillThrough:true,
                showGroupingBar: true,
                showTooltip: false,
                showValuesButton: true,
                editSettings:{allowEditing:true,mode:'Normal'},
                enableValueSorting:true,
                width: 1000,
                dataBound: dataBound
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
        it('context menu', (done: Function) => {
            setTimeout(() => {
                document.querySelectorAll('.e-pivot-button.balance')[0].dispatchEvent(mousedown);
                expect(document.querySelectorAll('.e-pivot-button').length > 10).toBeTruthy();
                done();
            }, 1000);
        });
        it('context menu select', (done: Function) => {
            setTimeout(() => {
                document.querySelectorAll('.e-pivot-button.balance')[0].dispatchEvent(mouseup);
                expect(document.querySelectorAll('#PivotGrid_PivotContextMenu').length > 0).toBeTruthy();
                done();
            }, 1000);
        });
        // it('context menu select 1', (done: Function) => {
        //     setTimeout(() => {
        //         if (document.querySelectorAll('.e-contextmenu .e-menu-item')[14] as HTMLElement) {
        //             (document.querySelectorAll('.e-contextmenu .e-menu-item')[14] as HTMLElement).click();
        //         }
        //         expect(1).toEqual(1);
        //         done();
        //     }, 1000);
        // });
        // it('context menu', (done: Function) => {
        //     setTimeout(() => {
        //         document.querySelectorAll('.e-pivot-button.quantity')[0].dispatchEvent(mousedown);
        //         expect(1).toEqual(1);
        //         done();
        //     }, 1000);
        // });
        // it('context menu select2', (done: Function) => {
        //     setTimeout(() => {
        //         document.querySelectorAll('.e-pivot-button.quantity')[0].dispatchEvent(mouseup);
        //         expect(1).toEqual(1);
        //         done();
        //     }, 1000);
        // });
        // it('context menu select3', (done: Function) => {
        //     setTimeout(() => {
        //         if (document.querySelectorAll('.e-contextmenu .e-menu-item')[12] as HTMLElement) {
        //             (document.querySelectorAll('.e-contextmenu .e-menu-item')[12] as HTMLElement).click();
        //         }
        //         expect(1).toEqual(1);
        //         done();
        //     }, 1000);
        // });
        // it('context menu open', (done: Function) => {
        //     setTimeout(() => {
        //         pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
        //         let cell: HTMLElement = document.querySelector('.e-valuescontent');
        //         util.triggerMouseEvent(cell, 'contextmenu');
        //         expect(1).toEqual(1);
        //         done();
        //     }, 1000);
        // });
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