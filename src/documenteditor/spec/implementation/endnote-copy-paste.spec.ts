import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { BaseHistoryInfo, Editor, FootnoteElementBox, FootnoteEndnoteMarkerElementBox, Toolbar } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { LineWidget, BodyWidget, ParagraphWidget, TextElementBox } from '../../src/index';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
/**
 * Copy and paste End note
 */
describe('Copy Paste the endnote', () => {
    let editor: DocumentEditor = undefined;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.enableLocalPaste = true;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Empty insert endnote and copy Paste', () => {
        editor.openBlank();
        editor.editor.insertEndnote();
        editor.selection.select('0;0;0', '0;0;1');
        editor.selection.copy();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).footnoteType).toBe('Endnote');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteEndnoteMarkerElementBox).text).toBe('i');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TextElementBox).text).toBe(' ');
        expect(((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(2);
        editor.openBlank();
        editor.editorModule.paste();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).footnoteType).toBe('Endnote');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteEndnoteMarkerElementBox).text).toBe('i');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TextElementBox).text).toBe(' ');
        expect(((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(2);
        //undo operation
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(0);
        //redo operation
        editor.editorHistory.redo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).footnoteType).toBe('Endnote');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteEndnoteMarkerElementBox).text).toBe('i');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TextElementBox).text).toBe(' ');
        expect(((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(2);
    });
    it('insert endnote with text and copy Paste', () => {
        editor.openBlank();
        editor.editor.insertEndnote();
        editor.editor.insertText('endnote');
        editor.selection.select('0;0;0', '0;0;1');
        editor.selection.copy();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).footnoteType).toBe('Endnote');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteEndnoteMarkerElementBox).text).toBe('i');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TextElementBox).text).toBe(' ');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as TextElementBox).text).toBe('endnote');
        expect(((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(3);
        editor.openBlank();
        editor.editorModule.paste();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).footnoteType).toBe('Endnote');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteEndnoteMarkerElementBox).text).toBe('i');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TextElementBox).text).toBe(' ');
        expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as TextElementBox).text).toBe('endnote');
        expect(((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(3);
         //undo operation
         editor.editorHistory.undo();
         expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(0);
         //redo operation
         editor.editorHistory.redo();
         expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).footnoteType).toBe('Endnote');
         expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteEndnoteMarkerElementBox).text).toBe('i');
         expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TextElementBox).text).toBe(' ');
         expect((((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as TextElementBox).text).toBe('endnote');
         expect(((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as FootnoteElementBox).bodyWidget as BodyWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(3);
    });
});



