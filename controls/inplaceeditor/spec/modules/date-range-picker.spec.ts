/**
 * DateRangePicker module spec document
 */
import { select, selectAll, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { InPlaceEditor, ValidateEventArgs } from '../../src/inplace-editor/base/index';
import { DateRangePicker } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';

InPlaceEditor.Inject(DateRangePicker);

describe('DateRangePicker module', () => {
    describe('Basic testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let editorObj: any;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DateRange',
                value: [new Date('11/12/2018'), new Date('11/15/2018')]
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('element availability testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', ele).length === 1).toEqual(true);
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'INPUT').toEqual(true);
        });
        it('Clear icon availability testing', () => {
            expect(editorObj.dateRangeModule.compObj.showClearButton === true).toEqual(true);
            expect(selectAll('.e-clear-icon', ele).length === 1).toEqual(true);
        });
        it('Value property testing', () => {
            expect(editorObj.dateRangeModule.compObj.value === editorObj.value).toEqual(true);
            expect((<HTMLInputElement>select('.e-daterangepicker', ele)).value === '11/12/2018 - 11/15/2018').toEqual(true);
        });
        it('save method with value property testing', () => {
            editorObj.dateRangeModule.compObj.value = [new Date("11/9/2018"), new Date("12/9/2018")];
            editorObj.dateRangeModule.compObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === '11/9/2018 - 12/9/2018').toEqual(true);
        });
        it('value as "" with testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DateRange',
                value: ''
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect((<HTMLInputElement>select('.e-daterangepicker', ele)).value === '').toEqual(true);
        });
    });
    describe('Value as "" with testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let editorObj: any;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DateRange',
                value: ''
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('element availability testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', ele).length === 1).toEqual(true);
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'INPUT').toEqual(true);
        });
        it('Clear icon availability testing', () => {
            expect(editorObj.dateRangeModule.compObj.showClearButton === true).toEqual(true);
            expect(selectAll('.e-clear-icon', ele).length === 1).toEqual(true);
        });
        it('Value property testing', () => {
            expect(isNOU(editorObj.dateRangeModule.compObj.startDate)).toEqual(true);
            expect(isNOU(editorObj.dateRangeModule.compObj.endDate)).toEqual(true);
            expect((<HTMLInputElement>select('.e-daterangepicker', ele)).value === '').toEqual(true);
        });
        it('save method with value property testing', () => {
            editorObj.dateRangeModule.compObj.value = [new Date("11/9/2018"), new Date("12/9/2018")];
            editorObj.dateRangeModule.compObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === '11/9/2018 - 12/9/2018').toEqual(true);
        });
    });
    describe('DateRange Picker Form validation Testing', () => {
        let ele: HTMLElement;
        let editorObj: any;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let buttonEle: HTMLElement;
        let ctrlGroup: HTMLElement;
        let editorError: HTMLElement;
        let errMsg: string;
        let eventValue: string;
        let eventFieldName: string;
        let eventPrimaryKey: string;
        let editEle: HTMLElement;
        let errorEle: HTMLElement;
        function click1(e: ValidateEventArgs): void {
            e.errorMessage = 'Empty Field';
            errMsg = e.errorMessage;
            eventValue = e.data.value;
            eventFieldName = e.data.name;
            eventPrimaryKey = e.data.primaryKey;
        }
        function click2(e: ValidateEventArgs): void {
            errMsg = e.errorMessage;
            eventValue = e.data.value;
            eventFieldName = e.data.name;
            eventPrimaryKey = e.data.primaryKey;
        }
        function click3(e: ValidateEventArgs): void {
            e.errorMessage = 'Empty Field';
            errMsg = e.errorMessage;
            eventFieldName = e.data.name;
            eventPrimaryKey = e.data.primaryKey;
            eventValue = e.data.value;
        }
        afterEach((): void => {
            destroy(editorObj);
        });
        it('validation with rules testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                validating: click2,
                name: 'Game',
                validationRules: {
                    Game: {
                        required: true
                    }
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
                buttonEle.dispatchEvent(new MouseEvent('mousedown'));
                let formEle: HTMLElement = <HTMLElement>select('.' + classes.FORM, ele);
                expect(formEle.classList.contains(classes.ERROR)).toEqual(true);
                ctrlGroup = <HTMLElement>select('.' + classes.CTRL_GROUP, ele);
                editorError = <HTMLElement>select('.' + classes.EDITABLE_ERROR, ctrlGroup);
                expect(editorError.childElementCount).toBe(1);
                let errorContainer: HTMLElement = <HTMLElement>select('.' + classes.ERROR, editorError);
                expect(errMsg).toBe(errorContainer.innerText);
                expect(eventValue).toEqual('Empty');
                expect(eventFieldName).toEqual('Game');
                expect(eventPrimaryKey).toEqual('');
                done();
            }, 400);
        });
        it('validation with rules  and error message customization testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                validating: click3,
                name: 'Game',
                validationRules: {
                    Game: {
                        required: true
                    }
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
                buttonEle.dispatchEvent(new MouseEvent('mousedown'));
                let formEle: HTMLElement = <HTMLElement>select('.' + classes.FORM, ele);
                expect(formEle.classList.contains(classes.ERROR)).toEqual(true);
                ctrlGroup = <HTMLElement>select('.' + classes.CTRL_GROUP, ele);
                editorError = <HTMLElement>select('.' + classes.EDITABLE_ERROR, ctrlGroup);
                expect(editorError.childElementCount).toBe(1);
                let errorContainer: HTMLElement = <HTMLElement>select('.' + classes.ERROR, editorError);
                expect(errorContainer.innerText).toBe(errMsg);
                expect(eventFieldName).toBe('Game');
                expect(eventValue).toBe('Empty');
                expect(eventPrimaryKey).toBe('');
                done();
            }, 400);
        });
        it('validation without rules testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DateRange',
                validating: click1
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
                buttonEle.dispatchEvent(new MouseEvent('mousedown'));
                let formEle: HTMLElement = <HTMLElement>select('.' + classes.FORM, ele);
                expect(formEle.classList.contains(classes.ERROR)).toEqual(true);
                ctrlGroup = <HTMLElement>select('.' + classes.CTRL_GROUP, ele);
                editorError = <HTMLElement>select('.' + classes.EDITABLE_ERROR, ctrlGroup);
                expect(editorError.childElementCount).toBe(0);
                expect(errMsg).toBe(editorError.innerText);
                expect(eventFieldName).toBe('');
                expect(eventValue).toBe('Empty');
                expect(eventPrimaryKey).toBe('');
                done();
            }, 400);
        });
        it('DateRange picker Input value testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DateRange',
                value: [new Date('11/12/2018'), new Date('11/15/2018')],
                validating: click1
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
                buttonEle.dispatchEvent(new MouseEvent('mousedown'));
                let editVal: HTMLElement = <HTMLElement>select('.' + classes.VALUE);
                expect(editVal.innerText).toBe('11/12/2018 - 11/15/2018');
                done();
            }, 400);
        });
        it('Form submission with Invalid Date testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'DateRange',
                value: [new Date('11/12/20189'), new Date('11/15/2018')],
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
                buttonEle.dispatchEvent(new MouseEvent('mousedown'));
                editEle = <HTMLElement>select('.' + classes.INPUT, ele);
                errorEle = <HTMLElement>select('.e-date-range-wrapper', editEle);
                expect(errorEle.classList.contains(classes.ERROR)).toEqual(true);
                done();
            }, 400);
            let editWrapper: HTMLElement = <HTMLElement>select('.' + classes.WRAPPER);
            expect(editWrapper.lastChild).toBe(<HTMLElement>select('.' + classes.FORM, ele));
        });
    });
});
