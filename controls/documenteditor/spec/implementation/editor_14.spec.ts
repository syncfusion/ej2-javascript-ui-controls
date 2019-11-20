import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';

describe('Empty selection check whether selection is in field', () => {
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
    it('selection is in text', () => {
        editor.editor.insertText('Hello World');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        expect(editor.selection.isInField).toBe(false);
    });
    it('select Field validation in text', () => {
        editor.selection.selectField();
        expect(editor.selection.isEmpty).toBe(true);
    });
    it('selection is in field', () => {
        editor.openBlank();
        let text: string = 'Lead#Email';
        editor.editor.insertField('MERGEFIELD ' + text + ' \\* MERGEFORMAT');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        expect(editor.selection.isInField).toBe(true);
    });
    it('select Field validation in field', () => {
        editor.selection.selectField();
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('Delete after select field', () => {
        editor.editor.delete();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });

    it('Undo after select and delete field', () => {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(false);
    });
    it('redo after select and delete field', () => {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });
});


describe('Non-selection check whether selection is in field', () => {
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
    it('selection is in field', () => {
        let text: string = 'Lead#Email';
        editor.editor.insertField('MERGEFIELD ' + text + ' \\* MERGEFORMAT');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        expect(editor.selection.isInField).toBe(true);
    });
    it('select Field validation in field', () => {
        editor.selection.selectField();
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('Delete after select field', () => {
        editor.editor.delete();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });

    it('Undo after select and delete field', () => {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(false);
    });
    it('redo after select and delete field', () => {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });
});