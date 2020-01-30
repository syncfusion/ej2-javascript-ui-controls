/**
 * TextBox module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';
import { ValidateEventArgs, BeginEditEventArgs } from '../../src';

describe('TextBox Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('TextBox render testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'Text',
                value: 'enter',
                name: 'TextBoxComponent',
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
            expect(selectAll('.e-textbox', ele).length === 1).toEqual(true);
        });
        it('Name property testing', () => {
            expect((<HTMLElement>select('.e-textbox', ele)).getAttribute('name')).toEqual('TextBoxComponent');
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
        it('Value property testing', () => {
            expect(editorObj.componentObj.value === 'enter').toEqual(true);
            expect(editorObj.value === editorObj.componentObj.value).toEqual(true);
            expect((<HTMLInputElement>select('input', ele)).value === 'enter').toEqual(true);
        });
        it('save method with value property testing', () => {
            editorObj.componentObj.value = 'testing';
            editorObj.componentObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === 'testing').toEqual(true);
        });
        it('Dynamically changing the css class with empty string and mode as popup', () => {
            editorObj.mode = 'Popup';
            editorObj.model.cssClass = '';
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(editorObj.model.cssClass === 'e-editable-elements').toEqual(true);
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
                type: 'Text'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', ele).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'Text'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
    });
    describe('validation testing', () =>{
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let buttonEle: HTMLElement;
        let ctrlGroup: HTMLElement;
        let editorError: HTMLElement;
        let errMsg: string;
        let eventValue: string | number;
        let eventFieldName: string | number;
        let eventPrimaryKey: string | number;
        let message: string;
        function validation(e: ValidateEventArgs) {
            if(this.value.length > 8) {}
            else {
                e.errorMessage = "value length should be more than 8";
                message = e.errorMessage;
            }
        }
        function clickFn(e: ValidateEventArgs): void {
            errMsg = e.errorMessage;
            eventValue = e.data.value;
            eventFieldName = e.data.name;
            eventPrimaryKey = e.data.primaryKey;
        }
        afterEach((): void => {
            destroy(editorObj);
        });
        it('validation rules testing', (done: Function) => {
            editorObj = renderEditor({
                mode: "Inline",
                name: 'Game',
                validating: clickFn,
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
            },400);           
        });
        it('custom validation testing', () => {
            editorObj = renderEditor({
                mode: "Inline",
                value: "sample",
                name: 'text',
                validating: validation
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                let formEle: HTMLElement = <HTMLElement>select('.' + classes.FORM, ele);
                buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
                buttonEle.dispatchEvent(new MouseEvent('mousedown'));
                expect(formEle.classList.contains(classes.ERROR)).toEqual(true);
                let editEle: HTMLElement = <HTMLElement>select('.' + classes.EDITABLE_ERROR, formEle);
                expect(editEle.innerHTML).toBe(message);
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
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test1';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test1');
            let changeEvent = document.createEvent('Events');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test1');
            expect(valueEle.innerHTML).toEqual('Test1');
            editorObj.value = 'Hello';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Hello');
            expect(valueEle.innerHTML).toEqual('Hello');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Hello');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Hello');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test2';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test2');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test2');
            expect(valueEle.innerHTML).toEqual('Test2');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test3';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test3');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test3');
            expect(valueEle.innerHTML).toEqual('Test3');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
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
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test1';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test1');
            let changeEvent = document.createEvent('Events');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test1');
            expect(valueEle.innerHTML).toEqual('Test1');
            editorObj.value = 'Hello';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Hello');
            expect(valueEle.innerHTML).toEqual('Hello');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Hello');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Hello');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test2';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test2');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test2');
            expect(valueEle.innerHTML).toEqual('Test2');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test3';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test3');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test3');
            expect(valueEle.innerHTML).toEqual('Test3');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
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
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test1';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test1');
            let changeEvent = document.createEvent('Events');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test1');
            expect(valueEle.innerHTML).toEqual('Test1');
            editorObj.value = 'Hello';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Hello');
            expect(valueEle.innerHTML).toEqual('Hello');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Hello');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Hello');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test2';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test2');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test2');
            expect(valueEle.innerHTML).toEqual('Test2');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test3';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test3');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test3');
            expect(valueEle.innerHTML).toEqual('Test3');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
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
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test1';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test1');
            let changeEvent = document.createEvent('Events');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test1');
            expect(valueEle.innerHTML).toEqual('Test1');
            editorObj.value = 'Hello';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Hello');
            expect(valueEle.innerHTML).toEqual('Hello');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Hello');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Hello');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test2';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test2');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test2');
            expect(valueEle.innerHTML).toEqual('Test2');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test3';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test3');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test3');
            expect(valueEle.innerHTML).toEqual('Test3');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                value: 'Testing'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('Testing');
            expect(valueEle.innerHTML).toEqual('Testing');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Testing');
            expect(valueEle.innerHTML).toEqual('Testing');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Testing');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Testing');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test1';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test1');
            let changeEvent = document.createEvent('Events');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test1');
            expect(valueEle.innerHTML).toEqual('Test1');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test2';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test2');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test2');
            expect(valueEle.innerHTML).toEqual('Test2');
            editorObj.value = 'Hello';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Hello');
            expect(valueEle.innerHTML).toEqual('Hello');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Hello');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Hello');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = 'Test3';
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test3');
            editorObj.componentObj.changeHandler(changeEvent);
            editorObj.save();
            expect(editorObj.value).toEqual('Test3');
            expect(valueEle.innerHTML).toEqual('Test3');
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
            editorObj = renderEditor({
                type: 'Text',
                mode: 'Inline',
                value: 'Test'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('Test');
            expect(valueEle.innerHTML).toEqual('Test');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Test');
            expect(editorObj.model.value).toEqual('Test');
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('Test');
            (<HTMLInputElement>select('.e-textbox', document.body)).value = '';
            editorObj.setProperties({ value: null }, true);
            editorObj.componentObj.value = null;
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-textbox', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-textbox', document.body)).value).toEqual('');
        });
    });

    describe('beginEdit event testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Inline - Focus testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'Text',
                mode: 'Inline',
                value: 'Badminton',
                beginEdit: function(e: BeginEditEventArgs) {
                    e.cancelFocus = true
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            (<HTMLElement>select('.' + classes.VALUE, editorObj.element)).click();
            setTimeout(() => {
                expect(document.activeElement.tagName === 'INPUT').not.toEqual(true);
                done();
            }, 400);
        });
        it('Inline - Focus as false testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'Text',
                mode: 'Inline',
                value: 'Badminton',
                beginEdit: function(e: BeginEditEventArgs) {
                    e.cancelFocus = false
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(document.activeElement.tagName === 'INPUT').toEqual(true);
                done();
            }, 400);
        });
        it('Popup - Focus testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'Text',
                mode: 'Popup',
                value: 'Badminton',
                beginEdit: function(e: BeginEditEventArgs) {
                    e.cancelFocus = true
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            (<HTMLElement>select('.' + classes.VALUE, editorObj.element)).click();
            setTimeout(() => {
                expect(document.activeElement.tagName === 'INPUT').not.toEqual(true);
                done();
            }, 400);
        });
        it('Popup - Focus as false testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'Text',
                mode: 'Popup',
                value: 'Badminton',
                beginEdit: function(e: BeginEditEventArgs) {
                    e.cancelFocus = false
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(document.activeElement.tagName === 'INPUT').toEqual(true);
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