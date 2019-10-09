/**
 * ColorPicker module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { InPlaceEditor, BeginEditEventArgs } from '../../src/inplace-editor/base/index';
import { ColorPicker } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';

InPlaceEditor.Inject(ColorPicker);

describe('ColorPicker module', () => {
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
                type: 'Color',
                value: '#035a',
                mode: 'Inline',
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
        it('Value update testing', (done: Function) => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            setTimeout(() => {
                expect(selectAll('.e-colorpicker', ele).length === 1).toEqual(true);
                done();
            }, 400);
        });
        it('element availability testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', ele).length === 1).toEqual(true);
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'INPUT').toEqual(true);
        });
        it('cssClass availability testing', () => {
            expect(editorObj.model.cssClass === 'customCSS e-editable-elements').toBe(true);
        });
        it('Value property testing', () => {
            editorObj.colorModule.compObj.value === '#035a';
            editorObj.colorModule.compObj.dataBind();
            expect(valueEle.innerHTML === '#035a').toEqual(true);
            expect((<HTMLInputElement>select('input', ele)).value === '#003355').toEqual(true);
        });
        it('save method with value property testing', () => {
            editorObj.colorModule.compObj.value = '#bae8e8';
            editorObj.save();
            expect(valueEle.innerHTML === '#bae8e8').toEqual(true);
        });
        it('Without compObj data to update value method testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', ele).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('#bae8e8');
            expect(editorObj.colorModule.compObj.value).toEqual('#bae8e8ff');
            editorObj.colorModule.compObj.value = '#bae8b8';
            expect(editorObj.colorModule.compObj.value).toEqual('#bae8b8');
            editorObj.colorModule.compObj = undefined;
            editorObj.save();
            expect(editorObj.value).toEqual('#bae8e8');
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
                type: 'Color'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', ele).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'Color'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
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
                type: 'Color',
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
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#008000');
            editorObj.save();
            expect(editorObj.value).toEqual('#008000ff');
            expect(valueEle.innerHTML).toEqual('#008000');
            editorObj.value = '#e2c2e2';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('#e2c2e2');
            expect(valueEle.innerHTML).toEqual('#e2c2e2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('#e2c2e2');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#e2c2e2');
            editorObj.save();
            expect(editorObj.value).toEqual('#e2c2e2ff');
            expect(valueEle.innerHTML).toEqual('#e2c2e2');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#008000');
            editorObj.save();
            expect(editorObj.value).toEqual('#008000ff');
            expect(valueEle.innerHTML).toEqual('#008000');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Color',
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
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#008000');
            editorObj.save();
            expect(editorObj.value).toEqual('#008000ff');
            expect(valueEle.innerHTML).toEqual('#008000');
            editorObj.value = '#e2c2e2';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('#e2c2e2');
            expect(valueEle.innerHTML).toEqual('#e2c2e2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('#e2c2e2');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#e2c2e2');
            editorObj.save();
            expect(editorObj.value).toEqual('#e2c2e2ff');
            expect(valueEle.innerHTML).toEqual('#e2c2e2');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#008000');
            editorObj.save();
            expect(editorObj.value).toEqual('#008000ff');
            expect(valueEle.innerHTML).toEqual('#008000');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Color',
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
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#008000');
            editorObj.save();
            expect(editorObj.value).toEqual('#008000ff');
            expect(valueEle.innerHTML).toEqual('#008000');
            editorObj.value = '#e2c2e2';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('#e2c2e2');
            expect(valueEle.innerHTML).toEqual('#e2c2e2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('#e2c2e2');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#e2c2e2');
            editorObj.save();
            expect(editorObj.value).toEqual('#e2c2e2ff');
            expect(valueEle.innerHTML).toEqual('#e2c2e2');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#008000');
            editorObj.save();
            expect(editorObj.value).toEqual('#008000ff');
            expect(valueEle.innerHTML).toEqual('#008000');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Color',
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
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#008000');
            editorObj.save();
            expect(editorObj.value).toEqual('#008000ff');
            expect(valueEle.innerHTML).toEqual('#008000');
            editorObj.value = '#e2c2e2';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('#e2c2e2');
            expect(valueEle.innerHTML).toEqual('#e2c2e2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('#e2c2e2');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#e2c2e2');
            editorObj.save();
            expect(editorObj.value).toEqual('#e2c2e2ff');
            expect(valueEle.innerHTML).toEqual('#e2c2e2');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#008000');
            editorObj.save();
            expect(editorObj.value).toEqual('#008000ff');
            expect(valueEle.innerHTML).toEqual('#008000');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Color',
                mode: 'Inline',
                value: '#d2e2c2'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('#d2e2c2');
            expect(valueEle.innerHTML).toEqual('#d2e2c2');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('#d2e2c2');
            expect(valueEle.innerHTML).toEqual('#d2e2c2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('#d2e2c2');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#d2e2c2');
            editorObj.save();
            expect(editorObj.value).toEqual('#d2e2c2ff');
            expect(valueEle.innerHTML).toEqual('#d2e2c2');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#008000');
            editorObj.save();
            expect(editorObj.value).toEqual('#008000ff');
            expect(valueEle.innerHTML).toEqual('#008000');
            editorObj.value = '#a2e2c2';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('#a2e2c2');
            expect(valueEle.innerHTML).toEqual('#a2e2c2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-colorpicker', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('#a2e2c2');
            expect((<HTMLInputElement>select('.e-colorpicker', document.body)).value).toEqual('#a2e2c2');
            editorObj.save();
            expect(editorObj.value).toEqual('#a2e2c2ff');
            expect(valueEle.innerHTML).toEqual('#a2e2c2');
        });
    });

    describe('beginEdit event testing', () => {
        let editorObj: any;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Inline - Focus testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'Color',
                value: '#035a',
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
                type: 'Color',
                mode: 'Popup',
                value: '#035a',
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