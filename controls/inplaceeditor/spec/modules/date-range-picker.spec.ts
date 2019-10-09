/**
 * DateRangePicker module spec document
 */
import { select, selectAll, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { InPlaceEditor, ValidateEventArgs, BeginEditEventArgs } from '../../src/inplace-editor/base/index';
import { DateRangePicker } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';
import { DateRangePickerModel } from '@syncfusion/ej2-calendars';

InPlaceEditor.Inject(DateRangePicker);

describe('DateRangePicker module', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Basic testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let editorObj: any;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DateRange',
                value: [new Date('11/12/2018'), new Date('11/15/2018')],
                model: {
                    cssClass: 'customCSS'
                }
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
            expect(editorObj.dateRangeModule.compObj.showClearButton).toBe(true);
            expect(selectAll('.e-clear-icon', ele).length).toBe(1);
        });
        it('cssClass availability testing', () => {
            expect(editorObj.model.cssClass === 'customCSS e-editable-elements').toBe(true);
        });
        it('Clear icon availability testing for false', () => {
            editorObj.dateRangeModule.compObj.showClearButton = false;
            editorObj.dateRangeModule.compObj.dataBind();
            expect(editorObj.dateRangeModule.compObj.showClearButton).toBe(false);
            expect(selectAll('.e-clear-icon', ele).length).toBe(0);
        });
        it('Clear icon availability testing for true', () => {
            editorObj.dateRangeModule.compObj.showClearButton = true;
            editorObj.dateRangeModule.compObj.dataBind();
            expect(editorObj.dateRangeModule.compObj.showClearButton).toBe(true);
            expect(selectAll('.e-clear-icon', ele).length).toBe(1);
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
        it('Value array as string with value property testing', () => {
            editorObj.value = ['01/02/2018 10:10 AM', '01/05/2018 10:10 AM'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([new Date('01/02/2018 10:10 AM'), new Date('01/05/2018 10:10 AM')]);
        });
        it('Without compObj data to update value method testing', () => {
            editorObj.value = [new Date('01/02/2018 10:10 AM'), new Date('01/05/2018 10:10 AM')];
            editorObj.dataBind();
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', ele).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([new Date('01/02/2018 10:10 AM'), new Date('01/05/2018 10:10 AM')]);
            expect(editorObj.dateRangeModule.compObj.value).toEqual([new Date('01/02/2018 10:10 AM'), new Date('01/05/2018 10:10 AM')]);
            editorObj.dateRangeModule.compObj.value = [new Date('01/03/2018 10:10 AM'), new Date('01/06/2018 10:10 AM')];
            expect(editorObj.dateRangeModule.compObj.value).toEqual([new Date('01/03/2018 10:10 AM'), new Date('01/06/2018 10:10 AM')]);
            editorObj.dateRangeModule.compObj = undefined;
            editorObj.save();
            expect(editorObj.value).toEqual([new Date('01/02/2018 10:10 AM'), new Date('01/05/2018 10:10 AM')]);
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
    describe('Duplicate ID availability testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Inline - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DateRange'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', ele).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'DateRange'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
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
        let eventValue: string | number;
        let eventFieldName: string | number;
        let eventPrimaryKey: string | number;
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
                editEle = <HTMLElement>select('.' + classes.INPUT, ele);
                errorEle = <HTMLElement>select('.e-date-range-wrapper', editEle);
                buttonEle.dispatchEvent(new MouseEvent('mousedown'));
                expect(errorEle.classList.contains(classes.ERROR)).toEqual(true);
                done();
            }, 400);
            let editWrapper: HTMLElement = <HTMLElement>select('.' + classes.WRAPPER);
            expect(editWrapper.lastChild).toBe(<HTMLElement>select('.' + classes.FORM, ele));
        });
    });
    describe('Value formatting related testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = [new Date('4/9/2018'), new Date('6/9/2018')];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('4/9/2018 - 6/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                value: null
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = [new Date('4/9/2018'), new Date('6/9/2018')];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('4/9/2018 - 6/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                value: undefined
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = [new Date('4/9/2018'), new Date('6/9/2018')];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('4/9/2018 - 6/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                value: ''
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = [new Date('4/9/2018'), new Date('6/9/2018')];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('4/9/2018 - 6/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                value: '4/9/2018 - 6/9/2018'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            editorObj.save();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = [new Date('6/9/2018'), new Date('8/9/2018')];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([new Date('6/9/2018'), new Date('8/9/2018')]);
            expect(valueEle.innerHTML).toEqual('6/9/2018 - 8/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([new Date('6/9/2018'), new Date('8/9/2018')]);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('6/9/2018 - 8/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual([new Date('6/9/2018'), new Date('8/9/2018')]);
            expect(valueEle.innerHTML).toEqual('6/9/2018 - 8/9/2018');
        });
        it('Defined value without space initial render testing', () => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                value: '4/9/2018-6/9/2018'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            editorObj.save();
            expect(editorObj.value).toEqual([new Date('4/9/2018'), new Date('6/9/2018')]);
            expect(valueEle.innerHTML).toEqual('4/9/2018 - 6/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = [new Date('6/9/2018'), new Date('8/9/2018')];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([new Date('6/9/2018'), new Date('8/9/2018')]);
            expect(valueEle.innerHTML).toEqual('6/9/2018 - 8/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([new Date('6/9/2018'), new Date('8/9/2018')]);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('6/9/2018 - 8/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual([new Date('6/9/2018'), new Date('8/9/2018')]);
            expect(valueEle.innerHTML).toEqual('6/9/2018 - 8/9/2018');
        });
    });
    describe('DateRangePicker format property testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Format testing', () => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                model: {
                    format: 'yyyy-MM-dd',
                    value: [new Date('01/01/2019'), new Date('01/10/2019')]
                } as DateRangePickerModel
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(null);
            expect(editorObj.emptyText).toEqual('Enter some text');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('2019-01-01 - 2019-01-10');
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('2019-01-01 - 2019-01-10');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect((<HTMLInputElement>select('.e-daterangepicker', document.body)).value).toEqual('2019-01-01 - 2019-01-10');
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('2019-01-01 - 2019-01-10');
        });
    });
    describe('Sending date value testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let dateString: string;
        function begin(e: any): void {
            dateString = e.data.value;
        }
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Value string testing', () => {
            let date: Date[] = [new Date('01/01/2019'), new Date('01/10/2019')]
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                model: {
                    value: date
                },
                actionBegin: begin
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            editorObj.save();
            expect(dateString).toEqual(date[0].toISOString() + ' - ' + date[1].toISOString());
        });
    });

    describe('Model - value child property update testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default value with initial render testing', () => {
            let date: Date[] = [new Date('01/01/2019'), new Date('01/10/2019')];
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                value: date
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(date);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(date);
            expect(editorObj.model.value).toEqual(date);
            editorObj.setProperties({ value: null }, true);
            editorObj.dateRangeModule.compObj.value = null;
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(editorObj.model.value).toEqual(null);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-daterangepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
        });
    });

    describe('Testing Display format when using inital value ', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('testing with empty format value', () => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                value: [new Date('01/01/2019'), new Date('01/10/2019')],
                model: {
                    format: ''
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('1/1/2019 - 1/10/2019');
        });
        it('testing with specified format value', () => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Inline',
                value: [new Date('01/01/2019'), new Date('01/10/2019')],
                model: {
                    format: 'yyyy-MM-dd'
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('2019-01-01 - 2019-01-10');
            editorObj.value = [new Date('05/05/2019'), new Date('12/12/2019')];
            editorObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('2019-05-05 - 2019-12-12');
        });
    });

    describe('beginEdit event testing', () => {
        let editorObj: any;
        let date: Date[] = [new Date('01/01/2019'), new Date('01/10/2019')];
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Inline - Focus testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'DateRange',
                value: date,
                mode: 'Inline',
                beginEdit: function(e: BeginEditEventArgs) {
                    e.cancelFocus = true
                }
            });
            setTimeout(() => {
                expect(document.activeElement.tagName === 'INPUT').not.toEqual(true);
                done();
            }, 400);
        });
        it('Popup - Focus testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'DateRange',
                mode: 'Popup',
                value: date,
                beginEdit: function(e: BeginEditEventArgs) {
                    e.cancelFocus = true
                }
            });
            setTimeout(() => {
                expect(document.activeElement.tagName === 'INPUT').not.toEqual(true);
                done();
            }, 400);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});