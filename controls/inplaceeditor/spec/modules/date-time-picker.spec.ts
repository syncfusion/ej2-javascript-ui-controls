/**
 * DateTimePicker module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { ValidateEventArgs, BeginEditEventArgs } from '../../src/inplace-editor/base/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';

describe('DateTimePicker Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('DateTime render testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DateTime',
                name: 'DateTimeComponent',
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
        it('Component render testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', ele).length === 1).toEqual(true);
        });
        it('Name property testing', () => {
            expect((<HTMLElement>select('.e-datetimepicker', ele)).getAttribute('name')).toEqual('DateTimeComponent');
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'INPUT').toEqual(true);
        });
        it('Clear icon availability testing', () => {
            expect(editorObj.componentObj.showClearButton).toBe(true);
            expect(selectAll('.e-clear-icon', ele).length).toBe(1);
        });
        it('cssClass availability testing', () => {
            expect(editorObj.model.cssClass === 'customCSS e-editable-elements').toBe(true);
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
        it('save method with value property testing', () => {
            let date: Date = new Date();
            editorObj.componentObj.value = date;
            editorObj.componentObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === date.toLocaleString().replace(/[,](.*)\D\d+/, '$1')).toEqual(true);
        });
        it('value as date string', () => {
            editorObj.value = "2018-11-29T10:35:17.5647822+05:30";
            editorObj.dataBind();
            // expect(valueEle.innerHTML === '11/29/2018, 10:35 AM').toEqual(true);
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
                type: 'DateTime'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', ele).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'DateTime'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
    });
    describe('DateTime Picker Form validation Testing', () => {
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
                type: 'DateTime',
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
        it('DateTime picker Input value testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'DateTime',
                mode: 'Inline',
                validating: click2,
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                editorObj.componentObj.value = new Date('01/02/2019 12:00 PM');
                buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
                buttonEle.dispatchEvent(new MouseEvent('mousedown'));
                let editVal: HTMLElement = <HTMLElement>select('.' + classes.VALUE);
                // expect(editVal.innerText).toBe('15/6/2019 12:00');
                done();
            }, 400);
        });
        it('validation with rules  and error message customization testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'DateTime',
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
                type: 'DateTime',
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
                expect(formEle).toBe(null);
                done();
            }, 400);
        });
        it('Form submission with Invalid Date testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'DateTime',
                value: '12/6/201889 11:18 AM',
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
                errorEle = <HTMLElement>select('.e-datetime-wrapper', editEle);
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
                type: 'DateTime',
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
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = new Date('4/9/2018 12:30 AM');
            editorObj.dataBind();
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('4/9/2018 12:30 AM');
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DateTime',
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
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = new Date('4/9/2018 12:30 AM');
            editorObj.dataBind();
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('4/9/2018 12:30 AM');
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DateTime',
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
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = new Date('4/9/2018 12:30 AM');
            editorObj.dataBind();
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('4/9/2018 12:30 AM');
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DateTime',
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
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = new Date('4/9/2018 12:30 AM');
            editorObj.dataBind();
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('4/9/2018 12:30 AM');
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DateTime',
                mode: 'Inline',
                value: new Date('4/9/2018 12:30 AM')
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('4/9/2018 12:30 AM'));
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            editorObj.value = '';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = new Date('6/9/2018 12:30 AM');
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('6/9/2018 12:30 AM');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(new Date('6/9/2018 12:30 AM'));
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('6/9/2018 12:30 AM');
            editorObj.save();
            expect(editorObj.value).toEqual(new Date('6/9/2018 12:30 AM'));
            expect(valueEle.innerHTML).toEqual('6/9/2018 12:30 AM');
        });
    });
    describe('DateTimePicker format property testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Format testing', () => {
            editorObj = renderEditor({
                type: 'DateTime',
                mode: 'Inline',
                model: {
                    format: 'yyyy-MM-dd hh:mm:ss',
                    value: '2019-01-10 11:10:52'
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
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('2019-01-10 11:10:52');
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('2019-01-10 11:10:52');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('2019-01-10 11:10:52');
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('2019-01-10 11:10:52');
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
            let date: Date = new Date('4/9/2018 12:30 AM');
            editorObj = renderEditor({
                type: 'DateTime',
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
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
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
            let date: Date = new Date('4/9/2018 12:30 AM');
            editorObj = renderEditor({
                type: 'DateTime',
                mode: 'Inline',
                value: date
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(date);
            expect(valueEle.innerHTML).toEqual('4/9/2018 12:30 AM');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(date);
            expect(editorObj.model.value).toEqual(date);
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('4/9/2018 12:30 AM');
            (<HTMLInputElement>select('.e-datetimepicker', document.body)).value = '';
            editorObj.setProperties({ value: null }, true);
            editorObj.componentObj.value = null;
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(editorObj.model.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-datetimepicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-datetimepicker', document.body)).value).toEqual('');
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
                type: 'DateTime',
                mode: 'Inline',
                value: '2019-01-10 11:10:52',
                model: {
                    format: ''
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('1/10/2019 11:10 AM');
        });
        it('testing with specified format value', () => {
            editorObj = renderEditor({
                type: 'DateTime',
                mode: 'Inline',
                value: '2019-01-10 11:10:52',
                model: {
                    format: 'dd-MM-yyyy HH:mm'
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('10-01-2019 11:10');
            editorObj.value = '2018-05-20 12:12:52';
            editorObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('20-05-2018 12:12');
        });
    });

    describe('beginEdit event testing', () => {
        let editorObj: any;
        let date: Date = new Date('4/9/2018 12:30 AM');
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Inline - Focus testing', (done: Function) => {
            let count: number = 0;
            editorObj = renderEditor({
                type: 'DateTime',
                value: date,
                mode: 'Inline',
                beginEdit: function(e: BeginEditEventArgs) {
                    count = count + 1;
                    e.cancelFocus = true
                }
            });
            (<HTMLElement>select('.' + classes.VALUE, editorObj.element)).click();
            setTimeout(() => {
                expect(document.activeElement.tagName === 'INPUT').not.toEqual(true);
                expect(count).toEqual(1);
                done();
            }, 400);
        });
        it('Popup - Focus testing', (done: Function) => {
            let count: number = 0;
            editorObj = renderEditor({
                type: 'DateTime',
                mode: 'Popup',
                value: date,
                beginEdit: function(e: BeginEditEventArgs) {
                    count = count + 1;
                    e.cancelFocus = true
                }
            });
            (<HTMLElement>select('.' + classes.VALUE, editorObj.element)).click();
            setTimeout(() => {
                expect(document.activeElement.tagName === 'INPUT').not.toEqual(true);
                expect(count).toEqual(1);
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