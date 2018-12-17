/**
 * TextBox module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';

describe('TextBox Control', () => {
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
                name: 'TextBoxComponent'
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
            expect(editorObj.componentObj.showClearButton === true).toEqual(true);
            expect(selectAll('.e-clear-icon', ele).length === 1).toEqual(true);
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
    });
});