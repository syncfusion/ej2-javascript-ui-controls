/**
 * DropDownList module spec document
 */
import { select, selectAll, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';
import { BeginEditEventArgs, ChangeEventArgs } from '../../src/inplace-editor/base/index';

describe('DropDownList Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('DropDownList render testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DropDownList',
                value: 'test',
                name: 'DropDownComponent',
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
            expect(selectAll('.e-dropdownlist', ele).length === 1).toEqual(true);
        });
        it('Name property testing', () => {
            expect((<HTMLElement>select('.e-ddl-hidden', ele)).getAttribute('name')).toEqual('DropDownComponent');
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
            editorObj.componentObj.value = 'testing';
            editorObj.save();
            expect(valueEle.innerHTML === 'Empty').toEqual(true);
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
                type: 'DropDownList'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', ele).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'DropDownList'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
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
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Cricket';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Cricket');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Cricket');
            editorObj.save();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Cricket';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Cricket');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Cricket');
            editorObj.save();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Cricket';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Cricket');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Cricket');
            editorObj.save();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Cricket';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Cricket');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Cricket');
            editorObj.save();
            expect(editorObj.value).toEqual('Cricket');
            expect(valueEle.innerHTML).toEqual('Cricket');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Badminton');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Badminton');
            editorObj.save();
            expect(editorObj.value).toEqual('Badminton');
            expect(valueEle.innerHTML).toEqual('Badminton');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Football';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Football');
            expect(valueEle.innerHTML).toEqual('Football');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Football');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Football');
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
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game1');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Badminton');
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game1');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Badminton');
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game1');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Badminton');
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'game1';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('game1');
            expect(valueEle.innerHTML).toEqual('game1');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game1');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Badminton');
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game1');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Badminton');
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(serverValue).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'game2';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('game2');
            expect(valueEle.innerHTML).toEqual('game2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('game2');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Basketball');
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
                type: 'DropDownList',
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
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Badminton');
            expect(editorObj.model.value).toEqual('Badminton');
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('Badminton');
            (<HTMLInputElement>select('.e-dropdownlist', document.body)).value = '';
            editorObj.setProperties({ value: null }, true);
            editorObj.componentObj.value = null;
            editorObj.save();
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-dropdownlist', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-dropdownlist', document.body)).value).toEqual('');
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
                type: 'DropDownList',
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
                type: 'DropDownList',
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

    describe('EJ2-34562 - DropDownList initial value render testing', () => {
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
                type: 'DropDownList',
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
                type: 'DropDownList',
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
                type: 'DropDownList',
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
                type: 'DropDownList',
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
                type: 'DropDownList',
                textOption: 'Always',
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
                type: 'DropDownList',
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
                type: 'DropDownList',
                textOption: 'Always',
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
                type: 'DropDownList',
                textOption: 'Always',
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
                type: 'DropDownList',
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
                type: 'DropDownList',
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
                type: 'DropDownList',
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
                type: 'DropDownList',
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
                type: 'DropDownList',
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

    describe('BLAZ-4764 - New change event testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let changeArgs: any = {};
        afterEach((): void => {
            destroy(editorObj);
            changeArgs = {};
        });
        it('Without Fields & without initial value - Check changed value', (done) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DropDownList',
                model: {
                    dataSource: ['Badminton', 'Cricket']
                },
                change: function (e: ChangeEventArgs) {
                    changeArgs = e;
                }
            });
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(editorObj.value).toEqual(null);
                editorObj.componentObj.value = "Badminton";
                (ele.querySelector('.e-editable-component') as HTMLElement).click();
                setTimeout(() => {
                    expect(changeArgs['name']).toEqual('change');
                    expect(changeArgs['previousValue']).toEqual(null);
                    expect(changeArgs['value']).toEqual('Badminton');
                    expect(changeArgs['previousItemData']).toEqual(null);
                    expect(changeArgs['itemData']).toEqual({value: "Badminton", text: "Badminton"});
                    done();
                }, 1000);
            }, 1500);
        });
        it('Without Fields - Check changed value', (done) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DropDownList',
                value: 'Cricket',
                model: {
                    dataSource: ['Badminton', 'Cricket']
                },
                change: function (e: ChangeEventArgs) {
                    changeArgs = e;
                }
            });
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(editorObj.value).toEqual('Cricket');
                editorObj.componentObj.value = "Badminton";
                (ele.querySelector('.e-editable-component') as HTMLElement).click();
                setTimeout(() => {
                    expect(changeArgs['name']).toEqual('change');
                    expect(changeArgs['previousValue']).toEqual('Cricket');
                    expect(changeArgs['value']).toEqual('Badminton');
                    expect(changeArgs['previousItemData']).toEqual({value: "Cricket", text: "Cricket"});
                    expect(changeArgs['itemData']).toEqual({value: "Badminton", text: "Badminton"});
                    done();
                }, 1000);
            }, 1500);
        });
        it('With Fields & without initail value - Check changed value', (done) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DropDownList',
                model: {
                    dataSource: [
                        { Id: 'game1', Game: 'Badminton' },
                        { Id: 'game2', Game: 'Basketball' },
                        { Id: 'game3', Game: 'Cricket' },
                        { Id: 'game4', Game: 'Football' },
                    ],
                    fields: { text: 'Game', value: 'Id' },
                },
                change: function (e: ChangeEventArgs) {
                    changeArgs = e;
                }
            });
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(editorObj.value).toEqual(null);
                editorObj.componentObj.value = "game1";
                (ele.querySelector('.e-editable-component') as HTMLElement).click();
                setTimeout(() => {
                    expect(changeArgs['name']).toEqual('change');
                    expect(changeArgs['previousValue']).toEqual(null);
                    expect(changeArgs['value']).toEqual('game1');
                    expect(changeArgs['previousItemData']).toEqual(null);
                    expect(changeArgs['itemData']).toEqual({Id: "game1", Game: "Badminton"});
                    done();
                }, 1000);
            }, 1500);
        });
        it('With Fields - Check changed value', (done) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DropDownList',
                value: 'game3',
                model: {
                    dataSource: [
                        { Id: 'game1', Game: 'Badminton' },
                        { Id: 'game2', Game: 'Basketball' },
                        { Id: 'game3', Game: 'Cricket' },
                        { Id: 'game4', Game: 'Football' },
                    ],
                    fields: { text: 'Game', value: 'Id' },
                },
                change: function (e: ChangeEventArgs) {
                    changeArgs = e;
                }
            });
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(editorObj.value).toEqual('game3');
                editorObj.componentObj.value = "game1";
                (ele.querySelector('.e-editable-component') as HTMLElement).click();
                setTimeout(() => {
                    expect(changeArgs['name']).toEqual('change');
                    expect(changeArgs['previousValue']).toEqual('game3');
                    expect(changeArgs['value']).toEqual('game1');
                    expect(changeArgs['previousItemData']).toEqual({Id: "game3", Game: "Cricket"});
                    expect(changeArgs['itemData']).toEqual({Id: "game1", Game: "Badminton"});
                    done();
                }, 1000);
            }, 1500);
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