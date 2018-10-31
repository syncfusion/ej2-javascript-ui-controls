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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        editor.editor.insertText('Syncfusion Software ', false);
        expect(editor.viewer.iframe.getAttribute('style')).toBe('pointer-events:none;position:absolute;top:-10000px');
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionstart', true, true);
        editor.viewer.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.viewer.iframe.getAttribute('style')).not.toBe('pointer-events:none;position:absolute;top:-10000px');
            let left: string = editor.viewer.iframe.style.left;
            let page: Page = editor.selection.start.paragraph.bodyWidget.page;
            let marginLeft: number = HelperMethods.convertPointToPixel(editor.selection.start.paragraph.bodyWidget.sectionFormat.leftMargin);
            expect(parseFloat(left.substring(0, left.length - 1))).toBe(page.boundingRectangle.x + marginLeft);

            let top: string = editor.viewer.iframe.style.top;
            let pageTop: number = page.boundingRectangle.y;
            expect(parseFloat(top.substring(0, top.length - 1))).toBe(pageTop + editor.selection.start.location.y);
            done();
        }, 10);
    });
    it('IME start end', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.viewer.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.viewer.iframe.getAttribute('style')).toBe('pointer-events:none;position:absolute;top:-10000px');
            done();
        }, 10);
    });
});

describe('IME Text processing with History', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        editor.viewer.editableDiv.dispatchEvent(event);
        expect(editor.viewer.isComposingIME).toBe(true);
    });
    it('Composition Update event', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.viewer.editableDiv.innerText = 'S';
        editor.viewer.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 2', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.viewer.editableDiv.innerText = 'Sy';
        editor.viewer.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Sy');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 3', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.viewer.editableDiv.innerText = 'Syncfusion';
        editor.viewer.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Syncfusion');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition end event', () => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.viewer.editableDiv.dispatchEvent(event);
        expect(editor.selection.text).toBe('');
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.viewer.isComposingIME).toBe(false);
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        editor.viewer.editableDiv.dispatchEvent(event);
        expect(editor.viewer.isComposingIME).toBe(true);
    });
    it('Composition Update event', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.viewer.editableDiv.innerText = 'S';
        editor.viewer.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 2', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.viewer.editableDiv.innerText = 'Sy';
        editor.viewer.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Sy');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 3', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.viewer.editableDiv.innerText = 'Syncfusion';
        editor.viewer.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('Syncfusion');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition end event', () => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.viewer.editableDiv.dispatchEvent(event);
        expect(editor.selection.text).toBe('');
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.viewer.isComposingIME).toBe(false);
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        editor.viewer.editableDiv.dispatchEvent(event);
        expect(editor.viewer.isComposingIME).toBe(false);
        expect(editor.selection.isEmpty).toBe(true);
    });
    it('IME start end', () => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.viewer.editableDiv.dispatchEvent(event);
        expect(editor.viewer.isComposingIME).toBe(false);
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
        editor.viewer.editableDiv.dispatchEvent(event);
        expect(editor.viewer.isComposingIME).toBe(true);
    });
    it('Composition Update event', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.viewer.editableDiv.innerText = 'S';
        editor.viewer.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition Update event 2', (done: DoneFn) => {
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionupdate', true, true);
        editor.viewer.editableDiv.innerText = 'S';
        editor.viewer.editableDiv.dispatchEvent(event);
        setTimeout(() => {
            expect(editor.selection.text).toBe('S');
            expect(editor.selection.isEmpty).toBe(false);
            done();
        }, 10);
    });
    it('Composition end event', () => {
        // Composition event end on undo operation update empty string in editable div
        editor.viewer.editableDiv.innerText = '';
        let event: CompositionEvent = document.createEvent('CompositionEvent');
        event.initEvent('compositionend', true, true);
        editor.viewer.editableDiv.dispatchEvent(event);
        expect(editor.selection.text).toBe('');
        expect(editor.selection.isEmpty).toBe(true);
        expect(editor.viewer.isComposingIME).toBe(false);
        expect(editor.editorHistory.redoStack.length).toBe(0);
    });
});