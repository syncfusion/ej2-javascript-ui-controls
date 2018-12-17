/**
 * Rte module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { InPlaceEditor } from '../../src/inplace-editor/base/index';
import { Rte } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';

InPlaceEditor.Inject(Rte);

describe('Rte module', () => {
    describe('Basic testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                type: 'RTE',
                value: 'test',
                mode: 'Inline'
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
            expect(selectAll('.e-richtexteditor', ele).length === 1).toEqual(true);
        });
        it('Initial focus testing', () => {
            expect(document.activeElement.tagName === 'DIV').toEqual(true);
        });
        it('Value property testing', () => {
            expect(editorObj.rteModule.compObj.value === 'test').toEqual(true);
            expect(editorObj.value === editorObj.rteModule.compObj.value).toEqual(true);
        });
        it('save method with value property testing', () => {
            editorObj.rteModule.compObj.value = 'testing';
            editorObj.rteModule.compObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === 'testing').toEqual(true);
        });
    });
});