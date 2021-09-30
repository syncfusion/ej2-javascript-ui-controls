import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Selection } from '../../src/index';
import { WListLevel } from '../../src/document-editor/implementation/list/list-level';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { LineWidget, FieldElementBox, BodyWidget, ParagraphWidget, HeaderFooters, TextElementBox, TableCellWidget, TableWidget, TableRowWidget, Widget } from '../../src/index';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
import { WParagraphFormat } from '../../src/document-editor/implementation/format/paragraph-format';
import { WCharacterFormat } from '../../src/document-editor/implementation/format/character-format';
import { HyperlinkDialog } from '../../src/document-editor/implementation/dialogs/hyperlink-dialog';
import { JsonAdaptor } from '@syncfusion/ej2-data';
import { BookmarkDialog } from '../../src/document-editor/implementation/dialogs/bookmark-dialog';

/**
 * Editor Spec
 */

describe('insert hyperlink validation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('In backward selection edit hyperlink validation', () => {
console.log('In backward selection edit hyperlink validation');
        editor.openBlank();
        editor.editorModule.insertText('sample');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.editorModule.insertHyperlinkInternal('www.google.com', editor.selection.text, false);
        editor.selection.handleLeftKey();
        expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
        let fieldBegin = editor.selection.getHyperlinkField();
        expect(editor.selection.getFieldCode(fieldBegin)).toBe('HYPERLINK "www.google.com"');
    });
});

describe('Edit hyperlink validation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableHyperlinkDialog: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, HyperlinkDialog);
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('In backward selection insert hyperlink validation in Multiple paragraph', () => {
console.log('In backward selection insert hyperlink validation in Multiple paragraph');
        editor.openBlank();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleShiftUpKey();
        editor.selection.handleShiftUpKey();
        editor.editorModule.insertHyperlinkInternal('s', editor.selection.text, false);
        editor.selection.handleLeftKey();
        expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
        let fieldBegin = editor.selection.getHyperlinkField();
        expect(editor.selection.getFieldCode(fieldBegin)).toBe('HYPERLINK "s"');
    });
    it('In backward selection edit hyperlink validation in Multiple paragraph', () => {
console.log('In backward selection edit hyperlink validation in Multiple paragraph');
        editor.hyperlinkDialogModule.show();
        (editor.hyperlinkDialogModule as any).urlTextBox.value = 'ss';
        editor.hyperlinkDialogModule.onInsertButtonClick();
        editor.selection.handleUpKey();
        expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
        let fieldBegin = editor.selection.getHyperlinkField();
        expect(editor.selection.getFieldCode(fieldBegin)).toBe('HYPERLINK "ss"');
    });
    // it('undo edit hyperlink in multiple paragraph', () => {
    //     editor.editorHistory.undo();
    //     expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
    //     let fieldBegin = editor.selection.getHyperlinkField();
    //     expect(editor.selection.getFieldCode(fieldBegin)).toBe('s');
    // });
    // it('redo edit hyperlink in multiple paragraph', () => {
    //     editor.editorHistory.undo();
    //     expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
    //     let fieldBegin = editor.selection.getHyperlinkField();
    //     expect(editor.selection.getFieldCode(fieldBegin)).toBe('ss');
    // });
});


describe('Remove Hyperlink valdiation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableHyperlinkDialog: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, HyperlinkDialog);
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Hyerplink using enter', () => {
console.log('Hyerplink using enter');
        editor.openBlank();
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.onEnter();
        editor.selection.handleUpKey();
        editor.selection.handleRightKey();
        expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
        let fieldBegin = editor.selection.getHyperlinkField();
        expect(editor.selection.getFieldCode(fieldBegin)).not.toBeUndefined();
    });
    it('remove Hyperlink validation', () => {
console.log('remove Hyperlink validation');
        editor.editor.removeHyperlink();
        expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children.length).toBe(1);
    });
//     it('undo after remove Hyperlink validation', () => {
// console.log('undo after remove Hyperlink validation');
//         editor.editorHistory.undo();
//         expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children.length).toBe(5);
//     });
    it('redo after remove Hyperlink validation', () => {
console.log('redo after remove Hyperlink validation');
        editor.editorHistory.redo();
        expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children.length).toBe(1);
    });
    it('Multiple undo and redo after remove Hyperlink validation', () => {
console.log('Multiple undo and redo after remove Hyperlink validation');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children.length).toBe(1);
    });
});



