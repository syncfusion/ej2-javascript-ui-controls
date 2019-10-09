import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TableCellWidget, TextElementBox, TextHelper, RtlInfo } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { BorderSettings } from '../../src/document-editor/implementation/editor/editor';
/**
 * Clear Format Validation
 */

let text: string = 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.';
describe('Clear format selection validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableEditorHistory: true, isReadOnly: false });
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
    it('Applying clear format', () => {
        editor.editor.insertText(text);
        editor.editor.applyStyle('Heading 1');
        editor.editor.clearFormatting();
        expect(editor.selection.paragraphFormat.styleName).toBe('Normal');
    });
    it('undo after clear format', () => {
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
    });
    it('redo after clear format', () => {
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri');
    });
    it('Multiple undo and redo after clear format', () => {
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
    });
});

describe('Test RTL combination text', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableEditorHistory: true, isReadOnly: false });
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
    it('RTL english RTL test', () => {
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('bidi', true, false, false);
        editor.editor.insertText('גכיגכלדגכ');
        editor.editor.insertText('Welcome');
        editor.editor.insertText('גכיגכלדגכ');
        expect((editor.selection.start.currentWidget.children[2] as TextElementBox).text).toBe('גכיגכלדגכ');
    });
});

