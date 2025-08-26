/**
 * Markdown Undo Redo steps spec
 */
import { RichTextEditor } from '../../../../src/index';
import { renderRTE, destroy, dispatchEvent } from '../../render.spec';

describe('RTE Markdown UNDO REDO - undoRedoSteps - ', () => {

    describe(' Default value  - ', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                editorMode: "Markdown",
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
                    editorMode: "Markdown",
                    value: 'EJ2 RichTextEditor Component',
                    toolbarSettings: {
                        items: ['Bold', 'Italic', 'StrikeThrough', '|',
                            'Formats', 'OrderedList', 'UnorderedList', '|',
                            'CreateLink', 'Image', '|', 'Undo', 'Redo']
                    }
                });
                rteObj.undoRedoSteps = 2;
                rteObj.dataBind();
                controlId = rteObj.element.id;
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });

            it(' Test - Click the Undo item', () => {
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 0, 2);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 RichTextEditor Component").toBe(true);
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 8, 12);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 *Rich*TextEditor Component").toBe(true);
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 15, 17);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_StrikeThrough');
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 *Rich*T~~ex~~tEditor Component").toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 *Rich*TextEditor Component").toBe(true);
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 RichTextEditor Component").toBe(true);
                expect(item.parentElement.classList.contains('e-overlay')).toBe(true);
            });

            it(' Test - Click the Redo item', () => {
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 0, 2);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 8, 12);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 15, 17);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_StrikeThrough');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Redo');
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 *Rich*TextEditor Component").toBe(true);
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 *Rich*T~~ex~~tEditor Component").toBe(true);
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
                    editorMode: "Markdown",
                    value: 'EJ2 RichTextEditor Component',
                    toolbarSettings: {
                        items: ['Bold', 'Italic', 'StrikeThrough', '|',
                            'Formats', 'OrderedList', 'UnorderedList', '|',
                            'CreateLink', 'Image', '|', 'Undo', 'Redo']
                    },
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
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 0, 2);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 RichTextEditor Component").toBe(true);
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 8, 12);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 *Rich*TextEditor Component").toBe(true);
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 15, 17);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_StrikeThrough');
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 *Rich*T~~ex~~tEditor Component").toBe(true);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 *Rich*TextEditor Component").toBe(true);
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 RichTextEditor Component").toBe(true);
                expect(item.parentElement.classList.contains('e-overlay')).toBe(true);
            });

            it(' Test - Click the Redo item', () => {
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 0, 2);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 8, 12);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 15, 17);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_StrikeThrough');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Redo');
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 *Rich*TextEditor Component").toBe(true);
                item.click();
                expect((rteObj as any).inputElement.value === "**EJ**2 *Rich*T~~ex~~tEditor Component").toBe(true);
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
                    editorMode: "Markdown",
                    value: 'EJ2 RichTextEditor Component',
                    toolbarSettings: {
                        items: ['Bold', 'Italic', 'StrikeThrough', '|',
                            'Formats', 'OrderedList', 'UnorderedList', '|',
                            'CreateLink', 'Image', '|', 'Undo', 'Redo']
                    },
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
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 0, 2);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 8, 12);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 15, 17);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_StrikeThrough');
                item.click();
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
                    editorMode: "Markdown",
                    value: 'EJ2 RichTextEditor Component',
                    toolbarSettings: {
                        items: ['Bold', 'Italic', 'StrikeThrough', '|',
                            'Formats', 'OrderedList', 'UnorderedList', '|',
                            'CreateLink', 'Image', '|', 'Undo', 'Redo']
                    },
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
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 0, 2);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 8, 12);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 15, 17);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_StrikeThrough');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                item.click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getText() === "**EJ**2 RichTextEditor Component").toBe(true);
            });

            it(' Test - return the getText method value last redo action value', () => {
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 0, 2);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 8, 12);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 15, 17);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_StrikeThrough');
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Undo');
                item.click();
                item.click();
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Redo');
                item.click();
                item.click();
                dispatchEvent(document.body, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'focusout');
                expect(rteObj.getText() === "**EJ**2 *Rich*T~~ex~~tEditor Component").toBe(true);
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
                    editorMode: "Markdown",
                    change: changeSpy,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    toolbarClick: toolbarClick,
                    value: 'EJ2 RichTextEditor Component',
                    toolbarSettings: {
                        items: ['Bold', 'Italic', 'StrikeThrough', '|',
                            'Formats', 'OrderedList', 'UnorderedList', '|',
                            'CreateLink', 'Image', '|', 'Undo', 'Redo']
                    },
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
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 0, 2);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Bold');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 8, 12);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
                item.click();
                rteObj.formatter.editorManager.markdownSelection.setSelection((rteObj as any).inputElement, 15, 17);
                item = rteObj.element.querySelector('#' + controlId + '_toolbar_StrikeThrough');
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