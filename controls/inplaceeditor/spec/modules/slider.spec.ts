/**
 * Slider module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { InPlaceEditor, ValidateEventArgs } from '../../src/inplace-editor/base/index';
import { Slider } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';

InPlaceEditor.Inject(Slider);

describe('Slider module', () => {
    describe('Basic testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                value: '10',
                mode: 'Inline',
                type: 'Slider'
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
            expect(selectAll('.e-slider', ele).length === 1).toEqual(true);
        });
        it('Value property testing', () => {
            expect(editorObj.sliderModule.compObj.value === 10).toEqual(true);
            expect(editorObj.value === editorObj.sliderModule.compObj.value.toString()).toEqual(true);
            expect((<HTMLInputElement>select('input', ele)).value === '10').toEqual(true);
        });
        it('save method with value property testing', () => {
            editorObj.sliderModule.compObj.value = 20;
            editorObj.save();
            expect(valueEle.innerHTML === '20').toEqual(true);
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
        afterEach((): void => {
            destroy(editorObj);
        });
        it('validation with rules testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'Slider',
                mode: 'Inline',
                value: '30',
                validating: click2,
                name: 'Game',
                validationRules: {
                    Game: {
                        validateHidden: true,
                        max: [60, 'select a value less than 60']
                    }
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            editorObj.sliderModule.compObj.value = 70;
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
                expect(eventValue).toEqual(editorObj.value);
                expect(eventFieldName).toEqual('Game');
                expect(eventPrimaryKey).toEqual('');
                done();
            }, 400);
        });
        it('validation without rules testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'Slider',
                value: '30',
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
                done();
            }, 400);
            expect(valueEle.innerHTML).toEqual(editorObj.value);
        });
    });
});
