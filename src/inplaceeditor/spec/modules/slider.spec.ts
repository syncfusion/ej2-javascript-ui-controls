/**
 * Slider module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { InPlaceEditor, ValidateEventArgs, ChangeEventArgs } from '../../src/inplace-editor/base/index';
import { Slider } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';

InPlaceEditor.Inject(Slider);

describe('Slider module', () => {
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
                value: 10,
                mode: 'Inline',
                type: 'Slider',
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
            expect(selectAll('.e-slider', ele).length === 1).toEqual(true);
        });
        it('Value property testing', () => {
            expect(editorObj.sliderModule.compObj.value === 10).toEqual(true);
            expect(editorObj.value === editorObj.sliderModule.compObj.value).toEqual(true);
            expect((<HTMLInputElement>select('input', ele)).value === '10').toEqual(true);
        });
        it('cssClass availability testing', () => {
            expect(editorObj.model.cssClass === 'customCSS e-editable-elements').toBe(true);
        });
        it('save method with value property testing', () => {
            editorObj.sliderModule.compObj.value = 20;
            editorObj.save();
            expect(valueEle.innerHTML === '20').toEqual(true);
        });
        it('Without compObj data to update value method testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', ele).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(20);
            expect(editorObj.sliderModule.compObj.value).toEqual(20);
            editorObj.sliderModule.compObj.value = 30;
            expect(editorObj.sliderModule.compObj.value).toEqual(30);
            editorObj.sliderModule.compObj = undefined;
            editorObj.save();
            expect(editorObj.value).toEqual(20);
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
                type: 'Slider'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', ele).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'Slider'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
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
        afterEach((): void => {
            destroy(editorObj);
        });
        it('validation with rules testing', (done: Function) => {
            editorObj = renderEditor({
                type: 'Slider',
                mode: 'Inline',
                value: 30,
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
            editorObj.sliderModule.compObj.dataBind();
            expect(editorObj.sliderModule.compObj.element.nextElementSibling.getAttribute('name')).toEqual('Game');
            editorObj.sliderModule.compObj.element.nextElementSibling.value = 70;
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            editorObj.validate();
            setTimeout(() => {
                let formEle: HTMLElement = <HTMLElement>select('.' + classes.FORM, ele);
                expect(formEle.classList.contains(classes.ERROR)).toEqual(true);
                ctrlGroup = <HTMLElement>select('.' + classes.CTRL_GROUP, ele);
                editorError = <HTMLElement>select('.' + classes.EDITABLE_ERROR, ctrlGroup);
                expect(editorError.childElementCount).toBe(1);
                let errorContainer: HTMLElement = <HTMLElement>select('.' + classes.ERROR, editorError);
                expect(errMsg).toBe(errorContainer.innerText);
                expect(eventValue).toEqual(editorObj.value.toString());
                expect(eventFieldName).toEqual('Game');
                expect(eventPrimaryKey).toEqual('');
                done();
            }, 400);
        });
        it('validation without rules testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'Slider',
                value: 30,
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
            expect(valueEle.innerHTML).toEqual(editorObj.value.toString());
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
                type: 'Slider',
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
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('0');
            editorObj.save();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            editorObj.value = 2;
            editorObj.dataBind();
            expect(editorObj.value).toEqual(2);
            expect(valueEle.innerHTML).toEqual('2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(2);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('2');
            editorObj.save();
            expect(editorObj.value).toEqual(2);
            expect(valueEle.innerHTML).toEqual('2');
            editorObj.value = 0;
            editorObj.dataBind();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(0);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('0');
            editorObj.save();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Slider',
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
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('0');
            editorObj.save();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            editorObj.value = 2;
            editorObj.dataBind();
            expect(editorObj.value).toEqual(2);
            expect(valueEle.innerHTML).toEqual('2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(2);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('2');
            editorObj.save();
            expect(editorObj.value).toEqual(2);
            expect(valueEle.innerHTML).toEqual('2');
            editorObj.value = 0;
            editorObj.dataBind();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(0);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('0');
            editorObj.save();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Slider',
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
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('0');
            editorObj.save();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            editorObj.value = 2;
            editorObj.dataBind();
            expect(editorObj.value).toEqual(2);
            expect(valueEle.innerHTML).toEqual('2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(2);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('2');
            editorObj.save();
            expect(editorObj.value).toEqual(2);
            expect(valueEle.innerHTML).toEqual('2');
            editorObj.value = 0;
            editorObj.dataBind();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(0);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('0');
            editorObj.save();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
        });
        it('Value as "0" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Slider',
                mode: 'Inline',
                value: 0
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(0);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('0');
            editorObj.save();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            editorObj.value = 2;
            editorObj.dataBind();
            expect(editorObj.value).toEqual(2);
            expect(valueEle.innerHTML).toEqual('2');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(2);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('2');
            editorObj.save();
            expect(editorObj.value).toEqual(2);
            expect(valueEle.innerHTML).toEqual('2');
            editorObj.value = 0;
            editorObj.dataBind();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(0);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('0');
            editorObj.save();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'Slider',
                mode: 'Inline',
                value: 10
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(10);
            expect(valueEle.innerHTML).toEqual('10');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual(10);
            expect(valueEle.innerHTML).toEqual('10');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(10);
            editorObj.save();
            expect(editorObj.value).toEqual(10);
            expect(valueEle.innerHTML).toEqual('10');
            editorObj.value = 0;
            editorObj.dataBind();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(0);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('0');
            editorObj.save();
            expect(editorObj.value).toEqual(0);
            expect(valueEle.innerHTML).toEqual('0');
            editorObj.value = 6;
            editorObj.dataBind();
            expect(editorObj.value).toEqual(6);
            expect(valueEle.innerHTML).toEqual('6');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-slider', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(6);
            expect((<HTMLInputElement>select('.e-slider-input', document.body)).value).toEqual('6');
            editorObj.save();
            expect(editorObj.value).toEqual(6);
            expect(valueEle.innerHTML).toEqual('6');
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
        it('Without initial value - Check changed value', (done) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'Slider',
                change: function (e: ChangeEventArgs) {
                    changeArgs = e;
                }
            });
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(editorObj.value).toEqual(null);
                editorObj.sliderModule.compObj.value = 10;
                (ele.querySelector('.e-editable-component') as HTMLElement).click();
                setTimeout(() => {
                    expect(changeArgs['name']).toEqual('change');
                    expect(changeArgs['previousValue']).toEqual(null);
                    expect(changeArgs['value']).toEqual(10);
                    done();
                }, 1000);
            }, 1500);
        });
        it('Check changed value', (done) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'Slider',
                value: 6,
                change: function (e: ChangeEventArgs) {
                    changeArgs = e;
                }
            });
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(editorObj.value).toEqual(6);
                editorObj.sliderModule.compObj.value = 10;
                (ele.querySelector('.e-editable-component') as HTMLElement).click();
                setTimeout(() => {
                    expect(changeArgs['name']).toEqual('change');
                    expect(changeArgs['previousValue']).toEqual(6);
                    expect(changeArgs['value']).toEqual(10);
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
    })
});