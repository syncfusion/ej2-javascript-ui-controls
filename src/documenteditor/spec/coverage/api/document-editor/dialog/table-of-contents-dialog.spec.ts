/**
 * TOC dialog spec
 */
import { DocumentEditor } from '../../../../../src/document-editor/document-editor';
import { ParagraphWidget, FieldElementBox } from '../../../../../src/index';
import { TableOfContentsDialog } from '../../../../../src/document-editor/implementation/dialogs/index';
import { Editor } from '../../../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../../../test-helper.spec';
import { Selection } from '../../../../../src/index';
import { EditorHistory } from '../../../../../src/document-editor/implementation/editor-history/editor-history';



describe('TOC test case validation - 2', () => {
    let editor: DocumentEditor;
    let dialog: TableOfContentsDialog;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(TableOfContentsDialog, Selection, Editor, EditorHistory);
        editor.enableEditorHistory = true;
        editor.enableTableOfContentsDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.tableOfContentsDialogModule;
        editor.editor.insertText("Hello world");
        editor.editorModule.applyStyle('Heading 1');
        editor.editor.insertTableOfContents();
        dialog.show();

    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        dialog = undefined;
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('On Insert Button testing', function () {
        console.log('On Insert Button testing');

        (dialog as any).heading1.value = 1;
        (dialog as any).heading2.value = 2;
        dialog.applyTableOfContentProperties();
    });
    it('On close Button testing', function () {
        console.log('On close Button testing');
        dialog.closeTableOfContentDialog();
    });
    it('On cancel Button testing', function () {
        console.log('On cancel Button testing');
        dialog.onCancelButtonClick();

    });
    it('showStyleDialog', function () {
        console.log('showStyleDialog');
        (dialog as any).showStyleDialog();
    });
});
describe('TOC test case validation - 3', () => {
    let editor: DocumentEditor;
    let dialog: TableOfContentsDialog;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(TableOfContentsDialog, Selection, Editor, EditorHistory);
        editor.enableEditorHistory = true;
        editor.enableTableOfContentsDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.tableOfContentsDialogModule;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        dialog = undefined;
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('TOC hyperlink validation', () => {
        console.log('TOC hyperlink validation');
        editor.editor.insertText("Hello world");
        editor.editorModule.applyStyle('Heading 1');
        editor.editor.insertTableOfContents();
        dialog.show();
        (dialog as any).showLevel.value = 1;
        (dialog as any).hyperlink.checked = true;
        (dialog as any).pageNumber.checked = false;
        (dialog as any).rightAlign.checked = false;
        (dialog as any).heading1.value = 1;
        dialog.applyTableOfContentProperties();
        expect((dialog as any).heading1.value).toBe('1');
    })
    it('reset Button validation', () => {
        console.log('reset Button validation');
        editor.editor.insertText("Hello world");
        editor.editorModule.applyStyle('Heading 1');
        editor.editor.insertTableOfContents();
        dialog.show();
        (dialog as any).heading1.value = 1;
        (dialog as any).heading2.value = 2;
        (dialog as any).heading3.value = 3;
        (dialog as any).heading4.value = 4;
        (dialog as any).reset();
        expect((dialog as any).heading1.value).toBe('1');
    })
});
