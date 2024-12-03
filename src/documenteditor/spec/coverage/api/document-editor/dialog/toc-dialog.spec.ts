import { DropDownFormFieldDialog, TextFormFieldDialog, isCheckedProperty } from '../../../../../src';
import { DocumentEditorContainer } from '../../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import { TableOfContentsDialog } from '../../../../../src/document-editor/implementation/dialogs/table-of-contents-dialog';
import { ChangeEventArgs } from '@syncfusion/ej2-buttons';
describe('Form-Field-text-checkbox', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    let dialog: TableOfContentsDialog
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: false, enableLocalPaste: true });
        container.appendTo(element);
        dialog = container.documentEditor.tableOfContentsDialogModule;
    });
    afterAll(() => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        element = undefined;
        container = undefined;
        document.body.innerHTML = '';
    });

    it('TOC - dialog', () => {
        console.log('TOC - dialog');
        //dialog.show();
        container.documentEditor.tableOfContentsDialogModule.show();
        dialog.onCancelButtonClick();
    });
    it('TOC - closeTableOfContentDialog', () => {
        console.log('TOC - closeTableOfContentDialog');
      //  dialog.show();
    //   container.documentEditor.tableOfContentsDialogModule.show();
        dialog.closeTableOfContentDialog();
    });
    it('TOC - showStyleDialog', () => {
        console.log('TOC - showStyleDialog');
        (dialog as any).showStyleDialog();
        //dialog.closeTableOfContentDialog();
    });
    it('TOC - reset', () => {
        console.log('TOC - reset');
        dialog.show();
        (dialog as any).reset();
    });
    it('TOC - changePageNumberValue()', () => {
        console.log('TOC - changePageNumberValue()');
        let args:any = {isCheckedProperty:true  }
        dialog.show();
        dialog.changePageNumberValue(args);
    });
    it('TOC - changeStyleValue()', () => {
        console.log('TOC - changeStyleValue()');
        let args:any = {isCheckedProperty:true  }
        dialog.show();
        dialog.changeStyleValue(args);
    });
    it('TOC - changeRightAlignValue()', () => {
        console.log('TOC - changeRightAlignValue()');
        let args:any = {isCheckedProperty:true  }
        dialog.show();
        dialog.changeRightAlignValue(args);
    });
});

