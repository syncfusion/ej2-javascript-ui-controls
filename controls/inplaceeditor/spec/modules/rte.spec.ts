/**
 * Rte module spec document
 */
import { select, selectAll } from '@syncfusion/ej2-base';
import { InPlaceEditor, BeginEditEventArgs, ChangeEventArgs } from '../../src/inplace-editor/base/index';
import { Rte } from '../../src/inplace-editor/modules/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, triggerKeyBoardEvent, destroy } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';

InPlaceEditor.Inject(Rte);

describe('Rte module', () => {
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
                type: 'RTE',
                name: 'TextEditor',
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
            expect(editorObj.rteModule.compObj.value === '<p>test</p>').toEqual(true);
            expect(editorObj.value === 'test').toEqual(true);
        });
        it('Name property testing', () => {
            expect(select('#TextEditor_editor-value', editorObj.element).getAttribute('name')).toEqual('TextEditor');
        });
        it('save method with value property testing', () => {
            editorObj.rteModule.compObj.value = 'testing';
            editorObj.rteModule.compObj.dataBind();
            editorObj.save();
            expect(valueEle.innerHTML === '<p>testing</p>').toEqual(true);
        });
        it('Without compObj data to update value method testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', ele).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('<p>testing</p>');
            expect(editorObj.rteModule.compObj.value).toEqual('<p>testing</p>');
            editorObj.rteModule.compObj.value = 'Tested';
            expect(editorObj.rteModule.compObj.value).toEqual('Tested');
            editorObj.rteModule.compObj = undefined;
            editorObj.save();
            expect(editorObj.value).toEqual('<p>testing</p>');
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
                type: 'RTE'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', ele).length === 1).toEqual(true);
            expect(selectAll('#' + ele.id, document.body).length === 1).toEqual(true);
        });
        it('Popup - ID testing', () => {
            editorObj = renderEditor({
                mode: 'Popup',
                type: 'RTE'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
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
                type: 'RTE',
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
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Welcome';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Welcome');
            expect(valueEle.innerHTML).toEqual('Welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Welcome');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('Welcome');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>Welcome</p>');
            expect(valueEle.innerHTML).toEqual('<p>Welcome</p>');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "null" with initial render testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
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
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Welcome';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Welcome');
            expect(valueEle.innerHTML).toEqual('Welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Welcome');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('Welcome');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>Welcome</p>');
            expect(valueEle.innerHTML).toEqual('<p>Welcome</p>');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as "undefined" string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
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
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual(null);
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Welcome';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Welcome');
            expect(valueEle.innerHTML).toEqual('Welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Welcome');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('Welcome');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>Welcome</p>');
            expect(valueEle.innerHTML).toEqual('<p>Welcome</p>');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Value as empty string with initial render testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
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
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'Welcome';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Welcome');
            expect(valueEle.innerHTML).toEqual('Welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('Welcome');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('Welcome');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>Welcome</p>');
            expect(valueEle.innerHTML).toEqual('<p>Welcome</p>');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
        });
        it('Defined value with initial render testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline',
                value: 'RichText'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('RichText');
            expect(valueEle.innerHTML).toEqual('RichText');
            editorObj.emptyText = 'Enter some text';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('RichText');
            expect(valueEle.innerHTML).toEqual('RichText');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('RichText');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>RichText</p>');
            expect(valueEle.innerHTML).toEqual('<p>RichText</p>');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Enter some text');
            editorObj.value = 'RichTextEditor';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('RichTextEditor');
            expect(valueEle.innerHTML).toEqual('RichTextEditor');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.value).toEqual('RichTextEditor');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('RichTextEditor');
            editorObj.save();
            expect(editorObj.value).toEqual('<p>RichTextEditor</p>');
            expect(valueEle.innerHTML).toEqual('<p>RichTextEditor</p>');
        });
    });

    // Enter key action not working inside RTE
    describe('Enter key action testing inside RTE', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Enter key testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline',
                value: 'RichText'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual('RichText');
            expect(valueEle.innerHTML).toEqual('RichText');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            triggerKeyBoardEvent(select('.e-rte-content .e-content', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            (<HTMLElement>select('.e-btn-save', ele)).focus();
            triggerKeyBoardEvent(select('.e-btn-save', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(false);
        });
    });

    // inplce editor text is not saved in RTE
    describe('inplce editor RTE text Save', () => {
        let editorObj: any;
        let ele: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                type: 'RTE',
                name: 'TextEditor',
                value: 'testValue',
                mode: 'Inline'
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Value property testing', () => {
            expect(editorObj.element.innerText === 'testValue').toEqual(true);
        });
    });

    describe('I237441 - In-place Editor RTE value not updated properly', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('HTMLEditor - Value testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
            expect(editorObj.rteModule.compObj.value).toEqual(null);
            editorObj.rteModule.compObj.value = 'Welcome';
            editorObj.rteModule.compObj.dataBind();
            editorObj.save();
            expect(editorObj.value).toEqual('<p>Welcome</p>');
            expect(valueEle.innerHTML).toEqual('<p>Welcome</p>');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.rteModule.compObj.value).toEqual('<p>Welcome</p>');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('Welcome');
            editorObj.rteModule.compObj.value = '';
            editorObj.rteModule.compObj.dataBind();
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.rteModule.compObj.value).toEqual('');
            expect((<HTMLElement>select('.e-content', document.body)).innerText.trim()).toEqual('');
        });
        it('Markdown - Value testing', () => {
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline',
                model: {
                    editorMode: 'Markdown'
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.value).toEqual(null);
            expect(valueEle.innerHTML).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect((<HTMLTextAreaElement>select('.e-content', document.body)).value.trim()).toEqual('');
            expect(editorObj.rteModule.compObj.value).toEqual(null);
            editorObj.rteModule.compObj.value = 'Welcome';
            editorObj.rteModule.compObj.dataBind();
            editorObj.save();
            expect(editorObj.value).toEqual('Welcome');
            expect(valueEle.innerHTML).toEqual('Welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.rteModule.compObj.value).toEqual('Welcome');
            expect((<HTMLTextAreaElement>select('.e-content', document.body)).value.trim()).toEqual('Welcome');
            editorObj.rteModule.compObj.value = '';
            editorObj.rteModule.compObj.dataBind();
            editorObj.save();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', document.body).length === 1).toEqual(true);
            expect(editorObj.rteModule.compObj.value).toEqual('');
            expect((<HTMLTextAreaElement>select('.e-content', document.body)).value.trim()).toEqual('');
        });
    });

    describe('beginEdit event testing', () => {
        let editorObj: any;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Inline - Focus testing', (done: Function) => {
            let count: number = 0;
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Inline',
                value: '<p>Syncfusion</p>',
                beginEdit: function(e: BeginEditEventArgs) {
                    count = count + 1;
                    e.cancelFocus = true
                }
            });
            (<HTMLElement>select('.' + classes.VALUE, editorObj.element)).click();
            setTimeout(() => {
                expect(document.activeElement.tagName === 'DIV').not.toEqual(true);
                expect(count).toEqual(1);
                done();
            }, 400);
        });
        it('Popup - Focus testing', (done: Function) => {
            let count: number = 0;
            editorObj = renderEditor({
                type: 'RTE',
                mode: 'Popup',
                value: '<p>Syncfusion</p>',
                beginEdit: function(e: BeginEditEventArgs) {
                    count = count + 1;
                    e.cancelFocus = true
                }
            });
            (<HTMLElement>select('.' + classes.VALUE, editorObj.element)).click();
            setTimeout(() => {
                expect(document.activeElement.tagName === 'DIV').not.toEqual(true);
                expect(count).toEqual(1);
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
        it('Without initial value - Check changed value', (done) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'RTE',
                model: {
                    saveInterval: 1
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
                editorObj.rteModule.compObj.value = "<p>Syncfusion</p>";
                editorObj.rteModule.compObj.dataBind();
                (ele.querySelector('.e-btn-save') as HTMLElement).click();
                setTimeout(() => {
                    expect(changeArgs['name']).toEqual('change');
                    expect(changeArgs['previousValue']).toEqual(null);
                    expect(changeArgs['value']).toEqual('<p>Syncfusion</p>');
                    done();
                }, 1000);
            }, 1500);
        });
        it('Check changed value', (done) => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'RTE',
                value: '<p>Test</p>',
                model: {
                    saveInterval: 1
                },
                change: function (e: ChangeEventArgs) {
                    changeArgs = e;
                }
            });
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(editorObj.value).toEqual('<p>Test</p>');
                editorObj.rteModule.compObj.value = "<p>Syncfusion</p>";
                editorObj.rteModule.compObj.dataBind();
                (ele.querySelector('.e-btn-save') as HTMLElement).click();
                setTimeout(() => {
                    expect(changeArgs['name']).toEqual('change');
                    expect(changeArgs['previousValue']).toEqual('<p>Test</p>');
                    expect(changeArgs['value']).toEqual('<p>Syncfusion</p>');
                    done();
                }, 1000);
            }, 1500);
        });
    });

    // describe('EJ2-48274 - New `enableHtmlParse` API testing', () => {
    //     let editorObj: any;
    //     let ele: HTMLElement;
    //     let valueEle: HTMLElement;
    //     let changeArgs: any = {};
    //     let valueWrapper: HTMLElement;
    //     let buttonEle: HTMLElement;
    //     afterEach((): void => {
    //         destroy(editorObj);
    //         changeArgs = {};
    //     });
    //     it('Editor DOM value testing', (done) => {
    //         editorObj = renderEditor({
    //             mode: 'Inline',
    //             enableHtmlParse: false,
    //             enableHtmlSanitizer: false,
    //             type: 'RTE',
    //             value: '<img src=x onerror=console.log("test")><script>alert("test")</script>'
    //         });
    //         ele = editorObj.element;
    //         valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
    //         valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
    //         expect(valueEle.innerText).toEqual('<img src=x onerror=console.log("test")><script>alert("test")</script>');
    //         valueEle.click();
    //         setTimeout(() => {
    //             expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
    //             buttonEle = <HTMLElement>select('.' + classes.BTN_SAVE, ele);
    //             buttonEle.dispatchEvent(new MouseEvent('mousedown'));
    //             setTimeout(() => {
    //                 expect(valueEle.innerText).toEqual('<p><img src="x" class="e-rte-image e-imginline"></p>');
    //                 done();
    //             }, 1000);
    //         }, 1500);
    //     });
    // });

    describe('Validation testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                type: 'RTE',
                name: 'TextEditor',
                value: 'test',
                mode: 'Inline',
                validationRules: {
                    TextEditor: { required: [true, 'Enter valid comments'], minLength: 10, maxLength: 200 }
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('minLength testing', function () {
            valueWrapper = select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(selectAll('.e-richtexteditor', ele).length === 1).toEqual(true);
            document.querySelector('.e-richtexteditor .e-content').innerHTML= '<p>t</p>';
            editorObj.rteModule.compObj.value = '<p>t</p>';
            var buttonEle = select('.' + classes.BTN_SAVE, ele);
            buttonEle.dispatchEvent(new MouseEvent('mousedown'));
            expect(document.querySelector('.e-editable-error')).not.toBe(null);
            expect((document.querySelector('.e-editable-error') as HTMLElement).innerText).toBe('Please enter at least 10 characters.');
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