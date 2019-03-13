/**
 * DropDownList module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';

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
                name: 'DropDownComponent'
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
            expect(editorObj.componentObj.showClearButton === true).toEqual(true);
            expect(selectAll('.e-clear-icon', ele).length === 1).toEqual(true);
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
            expect(serverValue).toEqual('Badminton');
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
            expect(serverValue).toEqual('Badminton');
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
            expect(serverValue).toEqual('Badminton');
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
            expect(serverValue).toEqual('Badminton');
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
            expect(serverValue).toEqual('Badminton');
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
            expect(serverValue).toEqual('Basketball');
            expect(valueEle.innerHTML).toEqual('Basketball');
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

     it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});