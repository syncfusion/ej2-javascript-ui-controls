/**
 * ColorPicker module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { InPlaceEditor } from '../../src/inplace-editor/base/index';
import { ColorPicker } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';

InPlaceEditor.Inject(ColorPicker);

describe('ColorPicker module', () => {
    describe('Basic testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let editorObj: any;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                type: 'Color',
                value: '#035a',
                mode: 'Inline'
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
    });
});