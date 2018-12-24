/**
 * MultiSelect module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { InPlaceEditor, ValidateEventArgs } from '../../src/inplace-editor/base/index';
import { MultiSelect } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';

InPlaceEditor.Inject(MultiSelect);

describe('MultiSelect module', () => {
    describe('Basic testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                value: ['test'],
                mode: 'Inline',
                type: 'MultiSelect'
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
            expect(selectAll('.e-multiselect', ele).length === 2).toEqual(true);
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'INPUT').toEqual(true);
        });
        it('Clear icon availability testing', () => {
            expect(editorObj.multiSelectModule.compObj.showClearButton === true).toEqual(true);
            expect(selectAll('.e-chips-close', ele).length === 1).toEqual(true);
        });
        it('Value property testing', () => {
            expect(editorObj.value[0] === 'test').toEqual(true);
            expect(editorObj.multiSelectModule.compObj.value[0] === 'test').toEqual(true);
        });
        it('save method with value property testing', () => {
            editorObj.multiSelectModule.compObj.value = ['testing'];
            editorObj.save();
            expect(valueEle.innerHTML === 'testing').toEqual(true);
        });
    });
    describe('Popup - Basic testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                value: ['test'],
                type: 'MultiSelect',
                model: {
                    dataSource: ['test', 'test1', 'test2']
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('element availability testing', (done: Function) => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                expect(selectAll('.e-multiselect', document.body).length === 2).toEqual(true);
                done();
            }, 1000);
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'INPUT').toEqual(true);
        });
        it('Clear icon availability testing', () => {
            expect(editorObj.multiSelectModule.compObj.showClearButton === true).toEqual(true);
        });
        it('Value property testing', () => {
            expect(editorObj.value[0] === 'test').toEqual(true);
            expect(editorObj.multiSelectModule.compObj.value[0] === 'test').toEqual(true);
        });
        it('Clear icon click testing', () => {
            let closeEle: HTMLElement = <HTMLElement>select('.e-multi-select-wrapper > .e-chips-close', document.body);
            closeEle.click();
            expect(selectAll('.e-multiselect', document.body).length === 2).toEqual(true);
        });
        it('Tip element click testing', () => {
            let trg: HTMLElement = <HTMLElement>select('.e-tip-content', document.body);
            trg.dispatchEvent(new MouseEvent('mousedown'));
            expect(selectAll('.e-tooltip-wrap', document.body).length === 1).toEqual(true);
        });
        it('Chips clear icon click testing', (done: Function) => {
            let closeEle: HTMLElement = <HTMLElement>select('.e-multi-select-wrapper .e-chips .e-chips-close', document.body);
            expect((<HTMLInputElement>select('.e-multi-hidden', document.body)).value === 'test').toEqual(true);
            editorObj.popMouseDown({ target: <HTMLElement>select('.e-multi-select-wrapper .e-chips .e-chips-close', document.body) });
            closeEle.dispatchEvent(new MouseEvent('mousedown'));
            setTimeout(() => {
                expect((<HTMLInputElement>select('.e-multi-hidden', document.body)).value === '').toEqual(true);
                done();
            }, 1000);
        });
        it('save method with value property testing', () => {
            editorObj.multiSelectModule.compObj.value = ['testing'];
            editorObj.save();
            expect(valueEle.innerHTML === 'testing').toEqual(true);
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
                type: 'MultiSelect',
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
                type: 'MultiSelect',
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
                type: 'MultiSelect',
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
    describe('Remove chips after cancel and open editor multiselect value not update proper testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                value: ['Badminton', 'Cricket', 'Football'],
                mode: 'Inline',
                type: 'MultiSelect',
                model: {
                    dataSource: ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis']
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('chips availability testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-chips-collection .e-chips', ele).length === 3).toEqual(true);
            select('.e-chips-collection .e-chips .e-chips-close', ele).dispatchEvent(new MouseEvent('mousedown'));
            expect(selectAll('.e-chips-collection .e-chips', ele).length === 2).toEqual(true);
            let buttonEle: HTMLElement = <HTMLElement>select('.' + classes.BTN_CANCEL, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-chips-collection .e-chips', ele).length === 3).toEqual(true);
            select('.e-chips-collection .e-chips .e-chips-close', ele).dispatchEvent(new MouseEvent('mousedown'));
            expect(selectAll('.e-chips-collection .e-chips', ele).length === 2).toEqual(true);
            buttonEle = <HTMLElement>select('.' + classes.BTN_CANCEL, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-chips-collection .e-chips', ele).length === 3).toEqual(true);
        });
    });
});