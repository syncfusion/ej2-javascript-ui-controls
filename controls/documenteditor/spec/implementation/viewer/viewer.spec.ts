import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Page, HelperMethods } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Editor Spec
 */

describe('Position editable div on', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 750);
    });
    it('IME start event', (done: DoneFn) => {
        editor.editor.insertText('Syncfusion Software ');
        expect(editor.documentHelper.iframe.getAttribute('style')).toBe('pointer-events:none;position:absolute;left:0px;top:0px;outline:none;background-color:transparent;width:0px;height:0px;overflow:hidden');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionstart', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.documentHelper.iframe.getAttribute('style')).not.toBe('pointer-events:none;position:absolute;left:0px;top:0px;outline:none;background-color:transparent;width:0px;height:0px;overflow:hidden');
            let left: string = editor.documentHelper.iframe.style.left;
            let page: Page = editor.selection.start.paragraph.bodyWidget.page;
            let marginLeft: number = HelperMethods.convertPointToPixel(editor.selection.start.paragraph.bodyWidget.sectionFormat.leftMargin);
            expect(parseFloat(left.substring(0, left.length - 1))).toBe(page.boundingRectangle.x + marginLeft);

            let top: string = editor.documentHelper.iframe.style.top;
            let pageTop: number = page.boundingRectangle.y;
            expect(parseFloat(top.substring(0, top.length - 1))).toBe(pageTop + editor.selection.start.location.y);
            done();
        }, 10);
    });
    //TODO
    // it('IME start end', (done: DoneFn) => {
    //     let event: CompositionEvent = document.createEvent('CompositionEvent');
    //     event.initEvent('compositionend', true, true);
    //     editor.documentHelper.editableDiv.dispatchEvent(event);
    //     setTimeout(() => {
    //         expect(editor.documentHelper.iframe.getAttribute('style')).toBe('pointer-events:none;position:absolute;left:' + editor.documentHelper.containerLeft + 'px;top:' + editor.documentHelper.containerTop + 'px;outline:none;background-color:transparent;width:0px;height:0px;overflow:hidden');
    //         done();
    //     });
    // });
});

describe('IME Text processing with History', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Trigger Composition start event validation', () => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionstart', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.documentHelper.isComposingIME).toBe(true);
    });
    it('Composition Update event', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'S';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 2', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'Sy';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Sy');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 3', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'Syncfusion';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Syncfusion');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition end event', () => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.selection.text).toBe('');
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.documentHelper.isComposingIME).toBe(false);
        expect(editor.editorHistory.undoStack.length).toBe(1);
    });
    it('Undo IME Text', () => {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
        expect(editor.selection.start.offset).toBe(0);
    });
    it('Redo IME text', () => {
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(false);
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.selection.start.offset).toBe(10);
    });
});

describe('IME Text processing without History', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Trigger Composition start event validation', () => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionstart', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.documentHelper.isComposingIME).toBe(true);
    });
    it('Composition Update event', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'S';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 2', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'Sy';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Sy');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 3', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'Syncfusion';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Syncfusion');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition end event', () => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.selection.text).toBe('');
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.documentHelper.isComposingIME).toBe(false);
    });
});

describe('Composition event on Device validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Composition updated without start', () => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.documentHelper.isComposingIME).toBe(false);
        expect(editor.selection.isEmpty).toBe(true);
    });
    it('IME start end', () => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.documentHelper.isComposingIME).toBe(false);
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.editorHistory.undoStack).toBeUndefined();
    });
});

describe('Composition event cancel by undo operation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Trigger Composition start event validation', () => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionstart', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.documentHelper.isComposingIME).toBe(true);
    });
    it('Composition Update event', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'S';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 2', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.documentHelper.editableDiv.innerText = 'S';
        editor.documentHelper.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition end event', () => {
        // Composition event end on undo operation update empty string in editable div
        editor.documentHelper.editableDiv.innerText = '';
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.documentHelper.editableDiv.dispatchEvent(event);
        expect(editor.selection.text).toBe('');
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.documentHelper.isComposingIME).toBe(false);
        expect(editor.editorHistory.redoStack.length).toBe(0);
    });
});