/**
 * TimePicker module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { InPlaceEditor, ValidateEventArgs } from '../../src/inplace-editor/base/index';
import { TimePicker } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { HtmlEditor } from '@syncfusion/ej2-richtexteditor';

InPlaceEditor.Inject(TimePicker);

describe('TimePicker module', () => {
    describe('Basic testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let currentDate: Date = new Date();
        let timeString: string = currentDate.toLocaleTimeString();
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'Time',
                value: currentDate
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
            expect(selectAll('.e-timepicker', ele).length === 1).toEqual(true);
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'INPUT').toEqual(true);
        });
        it('Clear icon availability testing', () => {
            expect(editorObj.timeModule.compObj.showClearButton === true).toEqual(true);
            expect(selectAll('.e-clear-icon', ele).length === 1).toEqual(true);
        });
        it('Value property testing', () => {
            expect(editorObj.timeModule.compObj.value.toString() === currentDate.toString()).toEqual(true);
            expect((<HTMLInputElement>select('input', ele)).value === timeString.replace(/(.*)\D\d+/, '$1')).toEqual(true);
        });
        it('save method with value property testing', () => {
            let newDate: Date = new Date();
            editorObj.timeModule.compObj.value = newDate;
            editorObj.timeModule.compObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === newDate.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')).toEqual(true);
        });
        it('value as date string', (done: Function) => {
            editorObj.value = "2018-11-29T10:35:17.5647822+05:30";
            editorObj.dataBind();
            setTimeout(() => {
                // expect(valueEle.innerHTML === '10:35 AM').toEqual(true);
                done();
            }, 500);
        });
    });
    describe('Value as "" with testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let currentDate: Date = new Date();
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'Time',
                value: null
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
            expect(selectAll('.e-timepicker', ele).length === 1).toEqual(true);
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'INPUT').toEqual(true);
        });
        it('Clear icon availability testing', () => {
            expect(editorObj.timeModule.compObj.showClearButton === true).toEqual(true);
            expect(selectAll('.e-clear-icon', ele).length === 1).toEqual(true);
        });
        it('Value property testing', () => {
            expect(editorObj.timeModule.compObj.value === null).toEqual(true);
            expect((<HTMLInputElement>select('input', ele)).value === '').toEqual(true);
        });
        it('Clear input with save testing', () => {
            editorObj.timeModule.compObj.value = null;
            editorObj.save();
            expect(valueEle.innerHTML === 'Empty').toEqual(true);
        });
    });
    describe('Form validation Testing', () => {
        let ele: HTMLElement;
        let editorObj: any;
        let valueEle: HTMLElement;
        let buttonEle: HTMLElement;
        let ctrlGroup: HTMLElement;
        let editorError: HTMLElement;
        let valueWrapper: HTMLElement;
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
                type: 'Time',
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
                type: 'Time',
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
                type: 'Time',
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
                done(name);
            }, 400);
        });
    });
});
