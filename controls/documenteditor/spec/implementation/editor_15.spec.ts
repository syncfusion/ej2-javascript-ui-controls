import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
/**
 * Autolist feature enhancement test cases
 */
describe('Arabic list previous paragraph is list', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('valid list conversion', () => {
        editor.editor.insertText('1');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('2');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('after some paragraph check valid list conversion', () => {
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('4');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('invalid number format', () => {
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('4');
        editor.editor.insertText(')');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).toBe(-1);
    });

});

describe('History validation after Uproman list ', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('valid list conversion', () => {
        editor.editor.insertText('I');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('II');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('undo after valid list conversion', () => {
       editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).toBe(-1);
    });
    it('redo after valid list conversion', () => {
        editor.editorHistory.redo();
         expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
     });

});

describe('Uproman and lowRoman auto list validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('uproman validation', () => {
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.selection.selectAll();
        editor.editor.applyNumbering('%1.', 'UpRoman');
        editor.selection.handleDownKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('V');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('lowRoman list validation', () => {
        editor.openBlank();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.selection.selectAll();
        editor.editor.applyNumbering('%1.', 'LowRoman');
        editor.selection.handleDownKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('v');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });

});

describe('UpLetter list previous paragraph is list', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('low letter valid list conversion', () => {
        editor.editor.insertText('a');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('c');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('after some paragraph check low letter valid list conversion', () => {
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('c');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('up letter valid list conversion', () => {
        editor.openBlank();
        editor.editor.insertText('A');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('B');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('after some paragraph check up letter valid list conversion', () => {
        
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('D');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });

});