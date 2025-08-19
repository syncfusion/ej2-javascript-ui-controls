/**
 * HTML Editor Undo Redo steps spec
 */
import { RichTextEditor } from '../../../../src/index';
import { renderRTE, destroy, dispatchEvent } from '../../render.spec';

describe('RTE UNDO REDO - undoRedoSteps - ', () => {

    describe(' Default value  - ', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
            });
            done();
        })
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the default value ', () => {
            expect(rteObj.undoRedoSteps === 30).toBe(true);
        });
    });

    describe(' onPropertyChange - ', () => {
        describe(' toolbarSettings property - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>'
                });
                rteObj.undoRedoSteps = 2;
                rteObj.undoRedoTimer = 100;
                rteObj.dataBind();
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - Click the Undo item', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong>RTE</strong></span></p>').toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em>RTE</em></strong></span></p>').toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Underline');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em><span style="text-decoration: underline;">RTE</span></em></strong></span></p>').toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em>RTE</em></strong></span></p>').toBe(true);
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong>RTE</strong></span></p>').toBe(true);
                expect(item.parentElement.classList.contains('e-overlay')).toBe(true);
            });

            it(' Test - Click the Redo item', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Underline');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Redo');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em>RTE</em></strong></span></p>').toBe(true);
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em><span style="text-decoration: underline;">RTE</span></em></strong></span></p>').toBe(true);
                expect(item.parentElement.classList.contains('e-overlay')).toBe(true);
            });
        });
    });
    describe(' PROPERTIES - ', () => {
        describe(' toolbarSettings property - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    undoRedoSteps: 2,
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - Click the Undo item', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong>RTE</strong></span></p>').toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em>RTE</em></strong></span></p>').toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Underline');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em><span style="text-decoration: underline;">RTE</span></em></strong></span></p>').toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em>RTE</em></strong></span></p>').toBe(true);
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong>RTE</strong></span></p>').toBe(true);
                expect(item.parentElement.classList.contains('e-overlay')).toBe(true);
            });

            it(' Test - Click the Redo item', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Underline');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Redo');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em>RTE</em></strong></span></p>').toBe(true);
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em><span style="text-decoration: underline;">RTE</span></em></strong></span></p>').toBe(true);
                expect(item.parentElement.classList.contains('e-overlay')).toBe(true);
            });
        });
    });
    describe(' PUBLIC METHODS - ', () => {
        describe(' refresh method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    undoRedoSteps: 2,
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - Undo item toolbar status', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong>RTE</strong></span></p>').toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em>RTE</em></strong></span></p>').toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Underline');
                item.click();
                expect((rteObj as any).inputElement.innerHTML === '<p><span id="rte"><strong><em><span style="text-decoration: underline;">RTE</span></em></strong></span></p>').toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                item.click();
                rteObj.refresh();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                expect(item.parentElement.classList.contains('e-overlay')).toBe(true);
            });
        });

        describe(' getText method - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    value: '<span id="rte">RTE</span>',
                    undoRedoSteps: 2,
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - return the getText method value last undo action value', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Underline');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                item.click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getText() === 'RTE').toBe(true);
            });

            it(' Test - return the getText method value last redo action value', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Underline');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Redo');
                item.click();
                item.click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getText() === 'RTE').toBe(true);
            });
        });
    });
    describe(' PUBLIC METHODS - ', () => {
        describe(' change, actionBegin, actionComplete and toolbarClick events - ', () => {
            let rteObj: RichTextEditor;
            let controlId: string;
            let actionBegin: jasmine.Spy;
            let actionComplete: jasmine.Spy;
            let toolbarClick: jasmine.Spy;
            let changeSpy: jasmine.Spy;
            beforeEach((done: Function) => {
                changeSpy = null;
                actionComplete = null;
                actionBegin = null;
                toolbarClick = null;
                actionBegin = jasmine.createSpy("actionBegin");
                actionComplete = jasmine.createSpy("actionComplete");
                toolbarClick = jasmine.createSpy('toolbarClick');
                changeSpy = jasmine.createSpy("change");
                rteObj = renderRTE({
                    change: changeSpy,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    toolbarClick: toolbarClick,
                    value: '<span id="rte">RTE</span>',
                    undoRedoSteps: 2,
                });
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            })
            it(' Test - apply the "P" format to selected node', () => {
                let pEle: HTMLElement = rteObj.element.querySelector('#rte');
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Underline');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                item.click();
                (rteObj as any).inputElement.blur();
                dispatchEvent(document.body, 'mousedown');
                document.body.click();
                rteObj.isBlur = true;
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(actionBegin).toHaveBeenCalled();
                expect(actionComplete).toHaveBeenCalled();
                expect(toolbarClick).toHaveBeenCalled();
                expect(changeSpy).toHaveBeenCalled();
            });
        });
    });
});