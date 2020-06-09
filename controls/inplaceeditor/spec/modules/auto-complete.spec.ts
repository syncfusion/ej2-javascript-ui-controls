/**
 * AutoComplete module spec document
 */
import { select, selectAll, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { InPlaceEditor, ValidateEventArgs, BeginEditEventArgs } from '../../src/inplace-editor/base/index';
import { AutoComplete } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';

InPlaceEditor.Inject(AutoComplete);

describe('AutoComplete module', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Basic testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'AutoComplete',
                value: 'test',
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
            expect(selectAll('.e-autocomplete', ele).length === 1).toEqual(true);
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'INPUT').toEqual(true);
        });
        it('Clear icon availability testing', () => {
            expect(editorObj.atcModule.compObj.showClearButton).toBe(true);
            expect(selectAll('.e-clear-icon', ele).length).toBe(1);
        });
        it('cssClass availability testing', () => {
            expect(editorObj.model.cssClass === 'customCSS e-editable-elements').toBe(true);
        });
        it('remove icon availability testing false', () => {
            editorObj.atcModule.compObj.showClearButton = false;
            editorObj.atcModule.compObj.dataBind();
            expect(editorObj.atcModule.compObj.showClearButton).toBe(false);
            expect(selectAll('.e-clear-icon', ele).length).toBe(0);
        });
        it('Clear icon availability testing for true', () => {
            editorObj.atcModule.compObj.showClearButton = true;
            editorObj.atcModule.compObj.dataBind();
            expect(editorObj.atcModule.compObj.showClearButton).toBe(true)
            expect(selectAll('.e-clear-icon', ele).length).toBe(1);
         });
        it('Value property testing', () => {
            expect(editorObj.atcModule.compObj.value === 'test').toEqual(true);
            expect(editorObj.value === editorObj.atcModule.compObj.value).toEqual(true);
            expect((<HTMLInputElement>select('input', ele)).value === 'test').toEqual(true);
        });
        it('save method with value property testing', () => {
            editorObj.atcModule.compObj.value = 'testing';
            editorObj.atcModule.compObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === 'testing').toEqual(true);
        });
        it('Without compObj data to update value method testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', ele).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('testing');
            expect(editorObj.atcModule.compObj.value).toEqual('testing');
            editorObj.atcModule.compObj.value = 'Tested';
            expect(editorObj.atcModule.compObj.value).toEqual('Tested');
            editorObj.atcModule.compObj = undefined;
            editorObj.save();
            expect(editorObj.value).toEqual('testing');
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
                type: 'AutoComplete'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', ele).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'AutoComplete'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
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
        let eventValue: string | number;
        let eventFieldName: string | number;
        let eventPrimaryKey: string | number;
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
        it('validation with rules and no error to submit testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'test',
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
                let errorContainer: HTMLElement = <HTMLElement>select('.' + classes.ERROR, editorObj.element);
                expect(errorContainer).toBe(null);
                expect(eventValue).toEqual('test');
                expect(eventFieldName).toEqual('Game');
                expect(eventPrimaryKey).toEqual('');
                done();
            }, 400);
        });
        it('validation with rules testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'AutoComplete',
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
                type: 'AutoComplete',
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
                type: 'AutoComplete',
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
    describe('Value formatting related testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let dataSource: any = ['Badminton', 'Cricket', 'Baseball', 'Football'];
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                model: {
                    dataSource: dataSource
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
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Cricket';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Cricket');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Cricket');
            editorObj.save();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: null,
                model: {
                    dataSource: dataSource
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
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Cricket';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Cricket');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Cricket');
            editorObj.save();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: undefined,
                model: {
                    dataSource: dataSource
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
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Cricket';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Cricket');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Cricket');
            editorObj.save();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: '',
                model: {
                    dataSource: dataSource
                }
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
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Cricket';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Cricket');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Cricket');
            editorObj.save();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'Badminton',
                model: {
                    dataSource: dataSource
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('Badminton');
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Badminton');
            expect(valueEle.innerHTML).toEqual('Badminton');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Badminton');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Badminton');
            editorObj.save();
            expect(editorObj.value).toEqual('Badminton');
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Football';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Football');
            expect(valueEle.innerHTML).toEqual('Football');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Football');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Football');
            editorObj.save();
            expect(editorObj.value).toEqual('Football');
            expect(valueEle.innerHTML).toEqual('Football');
        });
    });
    describe('FieldSettings - Value formatting related testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let serverValue: any = null;
        let valueWrapper: HTMLElement;
        let dataSource: { [key: string]: Object }[] = [
            { Id: 'game1', Game: 'Badminton' },
            { Id: 'game2', Game: 'Basketball' },
            { Id: 'game3', Game: 'Cricket' },
            { Id: 'game4', Game: 'Football' },
            { Id: 'game5', Game: 'Golf' },
            { Id: 'game6', Game: 'Gymnastics' },
            { Id: 'game7', Game: 'Tennis' }
        ];
        function success(e: any): void {
            serverValue = e.value;
        }
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                actionSuccess: success,
                model: {
                    dataSource: dataSource,
                    fields: { text: 'Game', value: 'Id' }
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
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'game1';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('game1');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game1');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Badminton');
            editorObj.save();
            expect(editorObj.value).toEqual('game1');
            expect(serverValue).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                actionSuccess: success,
                value: null,
                model: {
                    dataSource: dataSource,
                    fields: { text: 'Game', value: 'Id' }
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
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'game1';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('game1');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game1');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Badminton');
            editorObj.save();
            expect(editorObj.value).toEqual('game1');
            expect(serverValue).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                actionSuccess: success,
                value: undefined,
                model: {
                    dataSource: dataSource,
                    fields: { text: 'Game', value: 'Id' }
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
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'game1';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('game1');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game1');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Badminton');
            editorObj.save();
            expect(editorObj.value).toEqual('game1');
            expect(serverValue).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                actionSuccess: success,
                value: '',
                model: {
                    dataSource: dataSource,
                    fields: { text: 'Game', value: 'Id' }
                }
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
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'game1';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('game1');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game1');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Badminton');
            editorObj.save();
            expect(editorObj.value).toEqual('game1');
            expect(serverValue).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'game1',
                actionSuccess: success,
                model: {
                    dataSource: dataSource,
                    fields: { text: 'Game', value: 'Id' }
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('game1');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('game1');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game1');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Badminton');
            editorObj.save();
            expect(editorObj.value).toEqual('game1');
            expect(serverValue).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'game2';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('game2');
            expect(valueEle.innerHTML).toEqual('game2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game2');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Basketball');
            editorObj.save();
            expect(editorObj.value).toEqual('game2');
            expect(serverValue).toEqual('game2');
            expect(valueEle.innerHTML).toEqual('Basketball');
        });
    });

    describe('Model - value child property update testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let dataSource: string[] = ['Badminton', 'Cricket'];
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'Badminton',
                model: {
                    dataSource: dataSource
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('Badminton');
            expect(valueEle.innerHTML).toEqual('Badminton');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Badminton');
            expect(editorObj.model.value).toEqual('Badminton');
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('Badminton');
            (<HTMLInputElement>select('.e-autocomplete', document.body)).value = '';
            editorObj.setProperties({ value: null }, true);
            editorObj.atcModule.compObj.value = null;
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-autocomplete', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-autocomplete', document.body)).value).toEqual('');
        });
    });

    describe('beginEdit event testing', () => {
        let editorObj: any;
        let dataSource: string[] = ['Badminton', 'Cricket'];
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Inline - Focus testing', (done: Function) => {
            let count: number = 0;
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'Badminton',
                model: {
                    dataSource: dataSource
                },
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
                type: 'AutoComplete',
                mode: 'Popup',
                value: 'Badminton',
                model: {
                    dataSource: dataSource
                },
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

    describe('EJ2-34562 - AutoComplete initial value render testing', () => {
        let editorObj: any;
        let stringData1: string[] = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf'];
        let stringData2: { [key: string]: Object }[] = [
            { Id: 'game1', Game: 'Badminton' },
            { Id: 'game2', Game: 'Basketball' },
            { Id: 'game3', Game: 'Cricket' },
            { Id: 'game4', Game: 'Football' },
        ];
        let stringData3: { [key: string]: Object }[] = [
            { Country: { Name: 'Australia' }, Code: { Id: 'AU' } },
            { Country: { Name: 'Bermuda' }, Code: { Id: 'BM' } },
            { Country: { Name: 'Canada' }, Code: { Id: 'CA' } },
            { Country: { Name: 'Cameroon' }, Code: { Id: 'CM' } },
            { Country: { Name: 'Denmark' }, Code: { Id: 'DK' } }
        ];

        let numberData1: number[] = [11, 12, 13, 14, 15];
        let numberData2: { [key: string]: Object }[] = [
            { Id: 1, Game: 12345 },
            { Id: 2, Game: 23456 },
            { Id: 3, Game: 34567 },
            { Id: 4, Game: 45678 },
        ];
        let numberData3: { [key: string]: Object }[] = [
            { Country: { Population: 11000 }, Code: { Id: 11 } },
            { Country: { Population: 12000 }, Code: { Id: 12 } },
            { Country: { Population: 13000 }, Code: { Id: 13 } },
            { Country: { Population: 14000 }, Code: { Id: 14 } },
            { Country: { Population: 15000 }, Code: { Id: 15 } }
        ];
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Without Fields - String', (done: Function) => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'Badminton',
                model: {
                    dataSource: stringData1
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Badminton');
                done();
            }, 400);
        });
        it('With Fields and value API has "" testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: "",
                model: {
                    dataSource: stringData2,
                    fields: { text: 'Game', value: 'Id' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Empty');
                done();
            }, 400);
        });
        it('With Fields and without value API config testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                model: {
                    dataSource: stringData2,
                    fields: { text: 'Game', value: 'Id' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Empty');
                done();
            }, 400);
        });
        it('With Fields and value API then without dataSource config testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                model: {
                    fields: { text: 'Game', value: 'Id' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Empty');
                done();
            }, 400);
        });
        it('With Fields - String - Local Data - Array of Object', (done: Function) => {
            editorObj = renderEditor({
                textOption: 'Always',
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'game3',
                model: {
                    dataSource: stringData2,
                    fields: { text: 'Game', value: 'Id' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Cricket');
                done();
            }, 400);
        });
        it('With Fields - String - Local Data - Array of Object - value field alone', (done: Function) => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'Cricket',
                model: {
                    dataSource: stringData2,
                    fields: { value: 'Game' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Cricket');
                done();
            }, 400);
        });
        it('With Fields - String - Local Data - Array of Complex Object', (done: Function) => {
            editorObj = renderEditor({
                textOption: 'Always',
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'DK',
                model: {
                    dataSource: stringData3,
                    fields: { value: 'Code.Id', text: 'Country.Name' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Denmark');
                done();
            }, 400);
        });
        it('With Fields - String - Remote Data', (done: Function) => {
            editorObj = renderEditor({
                textOption: 'Always',
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'ALFKI',
                model: {
                    dataSource: new DataManager({
                        url: 'https://services.odata.org/V4/Northwind/Northwind.svc/',
                        adaptor: new ODataV4Adaptor,
                        crossDomain: true
                    }),
                    query: new Query().from('Customers').select(['ContactName', 'CustomerID']).take(6),
                    fields: { value: 'CustomerID', text: 'ContactName' }
                }
            });
            expect((select('.' + classes.VALUE_WRAPPER, editorObj.element) as HTMLElement).classList.contains(classes.LOAD)).toEqual(true);
            expect(isNullOrUndefined(select('.' + classes.VALUE_WRAPPER + ' .e-spinner-pane', editorObj.element))).toEqual(false);
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Maria Anders');
                expect((select('.' + classes.VALUE_WRAPPER, editorObj.element) as HTMLElement).classList.contains(classes.LOAD)).toEqual(false);
                expect(select('.' + classes.VALUE_WRAPPER + ' .e-spinner-pane', editorObj.element).classList.contains('e-spin-hide')).toEqual(true);
                done();
            }, 2000);
        });
        it('With Fields - String - Remote Data with loadingText locale value testing', (done: Function) => {
            L10n.load({
                'fr-BE': {
                    'inplace-editor': {
                        'loadingText': 'chargement'
                    }
                }
            });
            editorObj = renderEditor({
                textOption: 'Always',
                type: 'AutoComplete',
                mode: 'Inline',
                value: 'ALFKI',
                locale: 'fr-BE',
                model: {
                    dataSource: new DataManager({
                        url: 'https://services.odata.org/V4/Northwind/Northwind.svc/',
                        adaptor: new ODataV4Adaptor,
                        crossDomain: true
                    }),
                    query: new Query().from('Customers').select(['ContactName', 'CustomerID']).take(6),
                    fields: { value: 'CustomerID', text: 'ContactName' }
                }
            });
            expect((select('.' + classes.VALUE_WRAPPER, editorObj.element) as HTMLElement).classList.contains(classes.LOAD)).toEqual(true);
            expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('chargement');
            expect(isNullOrUndefined(select('.' + classes.VALUE_WRAPPER + ' .e-spinner-pane', editorObj.element))).toEqual(false);
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Maria Anders');
                expect((select('.' + classes.VALUE_WRAPPER, editorObj.element) as HTMLElement).classList.contains(classes.LOAD)).toEqual(false);
                expect(select('.' + classes.VALUE_WRAPPER + ' .e-spinner-pane', editorObj.element).classList.contains('e-spin-hide')).toEqual(true);
                done();
            }, 2000);
        });
        it('Without Fields - Number', (done: Function) => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: 12,
                model: {
                    dataSource: numberData1
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('12');
                done();
            }, 400);
        });
        it('With Fields - Number - Local Data - Array of Object', (done: Function) => {
            editorObj = renderEditor({
                textOption: 'Always',
                type: 'AutoComplete',
                mode: 'Inline',
                value: 2,
                model: {
                    dataSource: numberData2,
                    fields: { text: 'Game', value: 'Id' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('23456');
                done();
            }, 400);
        });
        it('With Fields - Number - Local Data - Array of Object - value alone', (done: Function) => {
            editorObj = renderEditor({
                type: 'AutoComplete',
                mode: 'Inline',
                value: 23456,
                model: {
                    dataSource: numberData2,
                    fields: { value: 'Game' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('23456');
                done();
            }, 400);
        });
        it('With Fields - Number - Local Data - Array of Complex Object', (done: Function) => {
            editorObj = renderEditor({
                textOption: 'Always',
                type: 'AutoComplete',
                mode: 'Inline',
                value: 12,
                model: {
                    dataSource: numberData3,
                    fields: { value: 'Code.Id', text: 'Country.Population' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('12000');
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