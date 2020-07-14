/**
 * MultiSelect module spec document
 */
import { select, selectAll, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { InPlaceEditor, ValidateEventArgs, BeginEditEventArgs } from '../../src/inplace-editor/base/index';
import { MultiSelect } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';

InPlaceEditor.Inject(MultiSelect);

describe('MultiSelect module', () => {
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
            expect(editorObj.multiSelectModule.compObj.showClearButton).toBe(true);
            expect(selectAll('.e-chips-close', ele).length).toBe(1);
        });
        it('Clear icon availability testing for false', () => {
            editorObj.multiSelectModule.compObj.showClearButton = false;
            editorObj.multiSelectModule.compObj.dataBind();
            expect(editorObj.multiSelectModule.compObj.showClearButton).toBe(false);
            expect(selectAll('.e-clear-icon ', ele).length).toBe(0);
        });
       it('Clear icon availability testing for true', () => {
            editorObj.multiSelectModule.compObj.showClearButton = true;
            editorObj.multiSelectModule.compObj.dataBind();
            expect(editorObj.multiSelectModule.compObj.showClearButton).toBe(true);
            expect(selectAll('.e-chips-close', ele).length).toBe(1);
        });
        it('Value property testing', () => {
            expect(editorObj.value[0] === 'test').toEqual(true);
            expect(editorObj.multiSelectModule.compObj.value[0] === 'test').toEqual(true);
        });
        it('save method with value property testing', () => {
            editorObj.multiSelectModule.compObj.value = ['testing'];
            editorObj.multiSelectModule.compObj.text = 'testing';
            editorObj.multiSelectModule.compObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === 'testing').toEqual(true);
        });
        it('Without compObj data to update value method testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multiselect', ele).length === 2).toEqual(true);
            expect(editorObj.value).toEqual(['testing']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['testing']);
            editorObj.multiSelectModule.compObj.value = ['Tested'];
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['Tested']);
            editorObj.multiSelectModule.compObj = undefined;
            editorObj.multiSelectModule.updateValue({ type: 'MultiSelect' });
            expect(editorObj.value).toEqual(['testing']);
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
        it('Wrapper element click testing', () => {
            let trg: HTMLElement = <HTMLElement>select('.' + classes.WRAPPER, document.body);
            trg.click();
            expect(selectAll('.e-tooltip-wrap', document.body).length === 1).toEqual(true);
        });
        it('Wrapper element mousedown testing', () => {
            let trg: HTMLElement = <HTMLElement>select('.' + classes.WRAPPER, document.body);
            trg.dispatchEvent(new MouseEvent('mousedown'));
            expect(selectAll('.e-tooltip-wrap', document.body).length === 1).toEqual(true);
        });
        it('Tip element mousedown testing', () => {
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
            editorObj.multiSelectModule.compObj.text = 'testing';
            editorObj.multiSelectModule.compObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === 'testing').toEqual(true);
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
                type: 'MultiSelect'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multiselect', ele).length === 2).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'MultiSelect'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multiselect', document.body).length === 2).toEqual(true);
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
                expect(formEle).toBe(null);
                done();
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
                type: 'MultiSelect',
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
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(null);
            editorObj.value = ['Cricket'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['Cricket']);
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['Cricket']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['Cricket']);
            editorObj.value = [];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'MultiSelect',
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
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(null);
            editorObj.value = ['Cricket'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['Cricket']);
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['Cricket']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['Cricket']);
            editorObj.value = [];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
        });
        it('Value as "undefined" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'MultiSelect',
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
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(null);
            editorObj.value = ['Cricket'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['Cricket']);
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['Cricket']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['Cricket']);
            editorObj.value = [];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
        });
        it('Value as empty array with initial render testing', () => {
            editorObj = renderEditor({
                type: 'MultiSelect',
                mode: 'Inline',
                value: [],
                model: {
                    dataSource: dataSource
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
            editorObj.value = ['Cricket'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['Cricket']);
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['Cricket']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['Cricket']);
            editorObj.value = [];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'MultiSelect',
                mode: 'Inline',
                value: ['Badminton'],
                model: {
                    dataSource: dataSource
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(['Badminton']);
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['Badminton']);
            expect(valueEle.innerHTML).toEqual('Badminton');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['Badminton']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['Badminton']);
            editorObj.value = [];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
            editorObj.value = ['Football'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['Football']);
            expect(valueEle.innerHTML).toEqual('Football');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['Football']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['Football']);
        });
    });
    describe('FieldSettings - Value formatting related testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let buttonEle: HTMLElement;
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
                type: 'MultiSelect',
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
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(null);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = ['game1'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['game1']);
            expect(valueEle.innerHTML).toEqual('game1');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['game1']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['game1']);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual(['game1']);
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = [];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'MultiSelect',
                mode: 'Inline',
                value: null,
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
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(null);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = ['game1'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['game1']);
            expect(valueEle.innerHTML).toEqual('game1');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['game1']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['game1']);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual(['game1']);
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = [];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'MultiSelect',
                mode: 'Inline',
                value: undefined,
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
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(null);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = ['game1'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['game1']);
            expect(valueEle.innerHTML).toEqual('game1');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['game1']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['game1']);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual(['game1']);
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = [];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as empty array with initial render testing', () => {
            editorObj = renderEditor({
                type: 'MultiSelect',
                mode: 'Inline',
                value: [],
                actionSuccess: success,
                model: {
                    dataSource: dataSource,
                    fields: { text: 'Game', value: 'Id' }
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = ['game1'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['game1']);
            expect(valueEle.innerHTML).toEqual('game1');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['game1']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['game1']);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual(['game1']);
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = [];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'MultiSelect',
                mode: 'Inline',
                value: ['game3'],
                actionSuccess: success,
                model: {
                    dataSource: dataSource,
                    fields: { text: 'Game', value: 'Id' }
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(['game3']);
            expect(valueEle.innerHTML).toEqual('game3');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['game3']);
            expect(valueEle.innerHTML).toEqual('game3');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['game3']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['game3']);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual(['game3']);
            expect(valueEle.innerHTML).toEqual('Cricket');
            editorObj.value = ['game7'];
            editorObj.dataBind();
            expect(editorObj.value).toEqual(['game7']);
            expect(valueEle.innerHTML).toEqual('game7');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(['game7']);
            expect(editorObj.multiSelectModule.compObj.value).toEqual(['game7']);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual(['game7']);
            expect(valueEle.innerHTML).toEqual('Tennis');
            editorObj.value = [];
            editorObj.dataBind();
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([]);
            expect(editorObj.multiSelectModule.compObj.value).toEqual([]);
            buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(editorObj.value).toEqual([]);
            expect(valueEle.innerHTML).toEqual('Enter some text');
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
                type: 'MultiSelect',
                mode: 'Inline',
                value: ['Badminton'],
                model: {
                    dataSource: dataSource
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual([ 'Badminton' ]);
            expect(valueEle.innerHTML).toEqual('Badminton');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-multi-hidden', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual([ 'Badminton' ]);
            expect(editorObj.model.value).toEqual([ 'Badminton' ]);
            editorObj.setProperties({ value: null }, true);
            editorObj.multiSelectModule.compObj.value = null;
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(editorObj.model.value).toEqual(null);
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
                type: 'MultiSelect',
                mode: 'Inline',
                value: ['Badminton'],
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
                type: 'MultiSelect',
                mode: 'Popup',
                value: ['Badminton'],
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

    describe('EJ2-34562 - MultiSelect initial value render testing', () => {
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
                type: 'MultiSelect',
                mode: 'Inline',
                value: 'Badminton',
                model: {
                    value: ['Badminton', 'Basketball'],
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Badminton');
                done();
            }, 400);
        });
        it('With Fields and value API has "" testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'MultiSelect',
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
                type: 'MultiSelect',
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
                type: 'MultiSelect',
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
                type: 'MultiSelect',
                mode: 'Inline',
                value: ['game1', 'game2'],
                model: {
                    dataSource: stringData2,
                    fields: { text: 'Game', value: 'Id' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Badminton,Basketball');
                done();
            }, 400);
        });
        it('With Fields - String - Local Data - Array of Object - value field alone', (done: Function) => {
            editorObj = renderEditor({
                type: 'MultiSelect',
                mode: 'Inline',
                value: ['Badminton', 'Basketball'],
                model: {
                    dataSource: stringData2,
                    fields: { value: 'Game' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Badminton,Basketball');
                done();
            }, 400);
        });
        it('With Fields - String - Local Data - Array of Complex Object', (done: Function) => {
            editorObj = renderEditor({
                textOption: 'Always',
                type: 'MultiSelect',
                mode: 'Inline',
                value: ['AU', 'BM'],
                model: {
                    dataSource: stringData3,
                    fields: { value: 'Code.Id', text: 'Country.Name' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Australia,Bermuda');
                done();
            }, 400);
        });
        it('With Fields - String - Remote Data', (done: Function) => {
            editorObj = renderEditor({
                textOption: 'Always',
                type: 'MultiSelect',
                mode: 'Inline',
                value: ['ALFKI', 'ANATR'],
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
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Maria Anders,Ana Trujillo');
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
                type: 'MultiSelect',
                mode: 'Inline',
                locale: 'fr-BE',
                value: ['ALFKI', 'ANATR'],
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
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('Maria Anders,Ana Trujillo');
                expect((select('.' + classes.VALUE_WRAPPER, editorObj.element) as HTMLElement).classList.contains(classes.LOAD)).toEqual(false);
                expect(select('.' + classes.VALUE_WRAPPER + ' .e-spinner-pane', editorObj.element).classList.contains('e-spin-hide')).toEqual(true);
                done();
            }, 2000);
        });
        it('Without Fields - Number', (done: Function) => {
            editorObj = renderEditor({
                type: 'MultiSelect',
                mode: 'Inline',
                value: [12, 13],
                model: {
                    dataSource: numberData1
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('12,13');
                done();
            }, 400);
        });
        it('With Fields - Number - Local Data - Array of Object', (done: Function) => {
            editorObj = renderEditor({
                textOption: 'Always',
                type: 'MultiSelect',
                mode: 'Inline',
                value: [2, 3],
                model: {
                    dataSource: numberData2,
                    fields: { text: 'Game', value: 'Id' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('23456,34567');
                done();
            }, 400);
        });
        it('With Fields - Number - Local Data - Array of Object - value alone', (done: Function) => {
            editorObj = renderEditor({
                type: 'MultiSelect',
                mode: 'Inline',
                value: [12345, 23456],
                model: {
                    dataSource: numberData2,
                    fields: { value: 'Game' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('12345,23456');
                done();
            }, 400);
        });
        it('With Fields - Number - Local Data - Array of Complex Object', (done: Function) => {
            editorObj = renderEditor({
                textOption: 'Always',
                type: 'MultiSelect',
                mode: 'Inline',
                value: [12, 13],
                model: {
                    dataSource: numberData3,
                    fields: { value: 'Code.Id', text: 'Country.Population' },
                }
            });
            setTimeout(() => {
                expect((select('.' + classes.VALUE_WRAPPER + ' .' + classes.VALUE, editorObj.element) as HTMLElement).innerText).toEqual('12000,13000');
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