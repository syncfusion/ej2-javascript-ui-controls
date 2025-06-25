

import { TabDialog } from '../../../../../src/document-editor/implementation/dialogs/tab-dialog';
import { ParagraphDialog } from '../../../../../src/document-editor/implementation/dialogs/paragraph-dialog';
import { DocumentEditor } from '../../../../../src/document-editor/document-editor';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TestHelper } from '../../../../test-helper.spec';

describe('Tab dialog functions', () => {
    let editor: DocumentEditor;
    let element: HTMLElement;
    let dialog: TabDialog;

    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.tabDialogModule;
    });
    afterAll(() => {
        editor.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { editor.destroy(); }).not.toThrowError();
        element = undefined;
        editor = undefined;
        
    });
    it('Tab dialog functions apply paragraphformat', () => {
        console.log('Tab dialog functions apply paragraphformat');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.showParagraphDialog();
        editor.tabDialogModule.show();
        editor.tabDialogModule.applyParagraphFormat();
        expect(editor.selection.text).toContain('hello');
    });
    it('Textbox Input change', () => {
        console.log('Textbox Input change');

        editor.editor.insertText('hello');
        editor.selection.selectAll();
        // let event = { value: 2, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.showParagraphDialog();
        editor.tabDialogModule.show();
        // (dialog as any).textBoxInputChange(event);
        (dialog as any).textBoxInputChange();
        expect(editor.selection.text).toContain('hello');
    });

    it('Tab dialog functions', () => {
        console.log('Tab dialog functions');

        editor.editor.insertText('hello');
        editor.selection.selectAll();
        // let event = { value: 2, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.showParagraphDialog();
        editor.tabDialogModule.show();
        // (dialog as any).textBoxInputChange(event);
        (dialog as any).textBoxInput.value = '2pt';
        (dialog as any).setButtonClick();
        (dialog as any).clearButtonClick();
        (dialog as any).clearAllButtonClick();
        expect(editor.selection.text).toContain('hello');
    });
});
