import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { NotesDialog } from '../../../src/document-editor/implementation/dialogs/notes-dialog';
import { Editor } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { Selection } from '../../../src/index';
/**
 * Notes dialog spec
 */
describe('Insert Notes Dialog Test Case Validation', () => {
    let editor: DocumentEditor;
    let dialog: NotesDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, NotesDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableFootnoteAndEndnoteDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('On Apply Button testing', () => {
        console.log('On Apply Button testing');
        dialog = new NotesDialog(editor.documentHelper);
        editor.editor.insertEndnote();
        dialog.show();
        dialog.onInsertFootnoteClick();
        dialog.destroy();
    });
    it('On Cancel Button testing', () => {
        console.log('On Cancel Button testing');
        dialog = new NotesDialog(editor.documentHelper);
        dialog.show();
        dialog.onCancelButtonClick();
        dialog.destroy();
    });
});
describe('Changing Formats', () => {
    let editor: DocumentEditor;
    let dialog: NotesDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, NotesDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableFootnoteAndEndnoteDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    // it('Changing the Footnote Number Format', () => {
    //     console.log('Changing the footnote number Format');
    //     dialog = new NotesDialog(editor.documentHelper);
    //     editor.openBlank();
    //     editor.editor.insertFootnote();
    //     editor.editor.insertText("Hello");
    //     dialog.show();
    //     let notesList: HTMLInputElement = (dialog as any).notesList;
    //     notesList.value = 'A, B, C, ...';
    //     dialog.onInsertFootnoteClick();
    //     expect(editor.documentHelper.selection.sectionFormat.footNoteNumberFormat).toBe('UpperCaseLetter');
    // });
    it('Changing the ENdnote Number Format', function () {
        console.log('Changing the ENdnote number Format');
        dialog = new NotesDialog(editor.documentHelper);
        editor.openBlank();
        editor.editor.insertEndnote();
        editor.editor.insertText("Hello");
        dialog.show();
        let notesList: HTMLInputElement = (dialog as any).notesList;
        notesList.value = 'a, b, c, ...';
        dialog.onInsertFootnoteClick();
        expect(editor.documentHelper.selection.sectionFormat.endnoteNumberFormat).toBe('LowerCaseLetter');
        editor.selection.moveToDocumentStart();
        editor.editor.insertEndnote();
        dialog.show();
        let notesLists: HTMLInputElement = (dialog as any).notesList;
        notesLists.value = 'A, B, C, ...';
        dialog.onInsertFootnoteClick();
        expect(editor.documentHelper.selection.sectionFormat.endnoteNumberFormat).toBe('UpperCaseLetter');

    });
    // it('Changing the Footnote and Endnote Number Format', function () {
    //     console.log('Changing the Footnote and Endnote Number Formatt');
    //     dialog = new NotesDialog(editor.documentHelper);
    //     editor.openBlank();
    //     editor.editor.insertEndnote();
    //     editor.editor.insertText("Hello");
    //     dialog.show();
    //     let notesList: HTMLInputElement = (dialog as any).notesList;
    //     notesList.value = 'a, b, c, ...';
    //     dialog.onInsertFootnoteClick();
    //     expect(editor.documentHelper.selection.sectionFormat.endnoteNumberFormat).toBe('LowerCaseLetter');
    //     editor.selection.moveToDocumentStart();
    //     editor.editor.insertFootnote();
    //     dialog.show();
    //     let notesLists: HTMLInputElement = (dialog as any).notesList;
    //     notesLists.value = 'A, B, C, ...';
    //     dialog.onInsertFootnoteClick();
    //     expect(editor.documentHelper.selection.sectionFormat.footNoteNumberFormat).toBe('UpperCaseLetter');
    // });
});

describe('History preservation of endnote and foot note numberformats', () => {
    let editor: DocumentEditor;
    let dialog: NotesDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, NotesDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableFootnoteAndEndnoteDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    // it('Footnote history preservation ', () => {
    //     console.log(' Footnote history preservation');
    //     dialog = new NotesDialog(editor.documentHelper);
    //     editor.openBlank();
    //     editor.editor.insertFootnote();
    //     editor.editor.insertText("Hello");
    //     dialog.show();
    //     let notesList: HTMLInputElement = (dialog as any).notesList;
    //     notesList.value = 'A, B, C, ...';
    //     dialog.onInsertFootnoteClick();
    //     dialog.show();
    //     let notesLists: HTMLInputElement = (dialog as any).notesList;
    //     notesLists.value = 'a, b, c, ...';
    //     dialog.onInsertFootnoteClick();
    //     editor.editorHistory.undo();
    //     expect(editor.documentHelper.selection.sectionFormat.footNoteNumberFormat).toBe('UpperCaseLetter');            
    // });
    it('Endnote History Preservation', function () {
        console.log('Endnote History Preservation');
        dialog = new NotesDialog(editor.documentHelper);
        editor.openBlank();
        editor.editor.insertEndnote();
        editor.editor.insertText("Hello");
        dialog.show();
        let notesList: HTMLInputElement = (dialog as any).notesList;
        notesList.value = 'A, B, C, ...';       
        dialog.onInsertFootnoteClick();
        dialog.show();
        let notesLists: HTMLInputElement = (dialog as any).notesList;
        notesLists.value = 'a, b, c, ...';
        dialog.onInsertFootnoteClick();
        editor.editorHistory.undo();
        expect(editor.documentHelper.selection.sectionFormat.endnoteNumberFormat).toBe('UpperCaseLetter');       
    });
    // it('Footnote and Endnote History Preservation', function () {
    //     console.log('Footnote and Endnote History Preservation');
    //     dialog = new NotesDialog(editor.documentHelper);
    //     editor.openBlank();
    //     editor.editor.insertEndnote();
    //     editor.editor.insertText("Hello");
    //     dialog.show();
    //     let Endnotelist: HTMLInputElement = (dialog as any).notesList;
    //     Endnotelist.value = 'A, B, C, ...';
    //     dialog.onInsertFootnoteClick();
    //     editor.selection.moveToDocumentStart();
    //     editor.editor.insertFootnote();
    //     dialog.show();        
    //     let footnotesList: HTMLInputElement = (dialog as any).notesList;
    //     footnotesList.value = 'A, B, C, ...';
    //     dialog.onInsertFootnoteClick();
    //     dialog.show();
    //     let footnotesLists: HTMLInputElement = (dialog as any).notesList;
    //     footnotesLists.value = 'a, b, c, ...';
    //     let footStartValues: HTMLInputElement = (dialog as any).startValueTextBox;
    //     dialog.onInsertFootnoteClick();
    //     editor.editorHistory.undo();
    //     expect(editor.documentHelper.selection.sectionFormat.footNoteNumberFormat).toBe('UpperCaseLetter');
    //     editor.editorHistory.undo();
    //     expect(editor.documentHelper.selection.sectionFormat.endnoteNumberFormat).toBe('UpperCaseLetter');         
    // });
});