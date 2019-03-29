/**
 * DatePicker module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { ValidateEventArgs } from '../../src/inplace-editor/base/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';

describe('DatePicker Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Date render testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        //let currentDate: Date = new Date();
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'Date',
                value: '11/29/2018',
                name: 'DateComponent'
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
            expect(selectAll('.e-datepicker', ele).length === 1).toEqual(true);
        });
        it('Name property testing', () => {
            expect((<HTMLElement>select('.e-datepicker', ele)).getAttribute('name')).toEqual('DateComponent');
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'INPUT').toEqual(true);
        });
        it('Clear icon availability testing', () => {
            expect(editorObj.componentObj.showClearButton).toBe(true);
            expect(selectAll('.e-clear-icon', ele).length).toBe(1);
        });
        it('Clear icon availability testing for false', () => {
            editorObj.componentObj.showClearButton = false;
            editorObj.componentObj.dataBind();
            expect(editorObj.componentObj.showClearButton).toBe(false);
            expect(selectAll('.e-clear-icon', ele).length).toBe(0);
        });
        it('Clear icon availability testing for true', () => {
            editorObj.componentObj.showClearButton = true;
            editorObj.componentObj.dataBind();
            expect(editorObj.componentObj.showClearButton).toBe(true);
            expect(selectAll('.e-clear-icon', ele).length).toBe(1);
        });
        it('Value property testing', () => {
            // expect((<HTMLInputElement>select('input', ele)).value === '11/29/2018').toEqual(true);
        });
        it('value as date string', (done: Function) => {
            editorObj.value = "2018-11-29T10:35:17.5647822+05:30";
            editorObj.dataBind();
            setTimeout(() => {
                expect(valueEle.innerHTML === '11/29/2018').toEqual(true);
                done();
            }, 500);
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
                type: 'Date'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', ele).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'Date'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
    });
    describe('Date Picker Form validation Testing', () => {
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
                type: 'Date',
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
                type: 'Date',
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
                type: 'Date',
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
        it('Date picker Input value testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'Date',
                mode: 'Inline',
                validating: click2,
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                editorObj.componentObj.value = new Date('4/6/2019');
                editorObj.componentObj.dataBind();
                buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
                buttonEle.dispatchEvent(new MouseEvent('mousedown'));
                let editVal: HTMLElement = <HTMLElement>select('.' + classes.VALUE);
                expect(editVal.innerText).toBe('4/6/2019');
                done();
            }, 400);
        });
        it('Form submission with Invalid Date testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'Date',
                value: '4/6/20191',
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
                errorEle = <HTMLElement>select('.e-date-wrapper', editEle);
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
                type: 'Date',
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
            expect(editorObj.emptyText).toEqual('Enter some text');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = new Date('4/9/2018');
            editorObj.dataBind();
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('4/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Date',
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
            expect(editorObj.emptyText).toEqual('Enter some text');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = new Date('4/9/2018');
            editorObj.dataBind();
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('4/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Date',
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
            expect(editorObj.emptyText).toEqual('Enter some text');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = new Date('4/9/2018');
            editorObj.dataBind();
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('4/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Date',
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
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = new Date('4/9/2018');
            editorObj.dataBind();
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('4/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Date',
                mode: 'Inline',
                value: new Date('4/9/2018')
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('4/9/2018'));
            expect(valueEle.innerHTML).toEqual('4/9/2018');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = '6/9/2018';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(new Date('6/9/2018'));
            expect(valueEle.innerHTML).toEqual('6/9/2018');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('6/9/2018'));
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('6/9/2018');
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('6/9/2018'));
            expect(valueEle.innerHTML).toEqual('6/9/2018');
        });
    });
    describe('DatePicker format property testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Format testing', () => {
            editorObj = renderEditor({
                type: 'Date',
                mode: 'Inline',
                model: {
                    format: 'yyyy-MM-dd',
                    value: '2019-01-10'
                }
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
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('2019-01-10');
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('2019-01-10');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('2019-01-10');
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('2019-01-10');
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
            let date: Date = new Date('01/02/2019');
            editorObj = renderEditor({
                type: 'Date',
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
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            editorObj.save();
            expect(dateString).toEqual(date.toISOString());
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
            let date: Date = new Date('11/12/2019');
            editorObj = renderEditor({
                type: 'Date',
                mode: 'Inline',
                value: date
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(date);
            expect(valueEle.innerHTML).toEqual('11/12/2019');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(date);
            expect(editorObj.model.value).toEqual(date);
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('11/12/2019');
            (<HTMLInputElement>select('.e-datepicker', document.body)).value = '';
            editorObj.setProperties({ value: null }, true);
            editorObj.componentObj.value = null;
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-datepicker', document.body)).value).toEqual('');
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