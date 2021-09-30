import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, DocumentHelper, SfdtExport } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Auto Convert List Test script
 */

describe('HTML Writer validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    // it('Underline Strikethrough validation.', () => {
    //     console.log('Underline Strikethrough validation');
    //     editor.openBlank();
    //     editor.editorModule.insertText('hello world');
    //     editor.selection.selectAll();
    //     editor.selection.characterFormat.underline = 'Single';
    //     editor.selection.characterFormat.strikethrough = 'SingleStrike';
    //     expect(editor.selection.getHtmlContent()).toEqual('<div style="font-weight:normal;font-style:normal;text-decoration:line-through underline;color:empty;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1;white-space:pre"><span style="font-weight:normal;font-style:normal;text-decoration:line-through underline;">hello world</span></div>');
    // })
    // it('Strikethrough validation.', () => {
    //     console.log('Strikethrough validation.');
    //     editor.openBlank();
    //     editor.editorModule.insertText('hello world');
    //     editor.selection.selectAll();        
    //     editor.selection.characterFormat.strikethrough = 'SingleStrike';
    //     expect(editor.selection.getHtmlContent()).toEqual('<div style="font-weight:normal;font-style:normal;text-decoration:line-through ;color:empty;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1;white-space:pre"><span style="font-weight:normal;font-style:normal;text-decoration:line-through ;">hello world</span></div>');
    // })
    // it('Underline validation.', () => {
    //     console.log('Underline validation.');
    //     editor.openBlank();
    //     editor.editorModule.insertText('hello world');
    //     editor.selection.selectAll();
    //     editor.selection.characterFormat.underline = 'Single';
    //     expect(editor.selection.getHtmlContent()).toEqual('<div style="font-weight:normal;font-style:normal;text-decoration:underline;color:empty;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1;white-space:pre"><span style="font-weight:normal;font-style:normal;text-decoration:underline;">hello world</span></div>');
    // })
})