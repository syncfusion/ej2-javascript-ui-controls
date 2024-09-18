
import { DocumentEditor } from '../../../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import {
    TablePropertiesDialog, TableOptionsDialog, CellOptionsDialog
} from '../../../../../src/document-editor/implementation/dialogs/index';
import { TestHelper } from '../../../../test-helper.spec';
import { Editor } from '../../../../../src/index';
import { TextPosition } from '../../../../../src/index';
import { Selection } from '../../../../../src/index';
import { EditorHistory } from '../../../../../src/document-editor/implementation/editor-history/editor-history';
import { TableCellWidget } from '../../../../../src/index';

describe('Restrict editing dialog validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/' });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        editor = undefined;
        setTimeout(function () {
            done();
        }, 2000);
    });

    it('open enforce dialog', () => {
        console.log('open enforce dialog');
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.showRestrictEditingPane(true);
        (editor.documentHelper.restrictEditingPane as any).enforceProtection.click();
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.okButtonClick();
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.hideDialog();
        expect(editor.documentHelper.protectionType).toBe('ReadOnly');
    });

    it('open unprotect document dialog', () => {
        console.log('open unprotect document dialog');
        (editor.documentHelper.restrictEditingPane as any).enforceProtection.click();
        (editor.documentHelper.restrictEditingPane.enforceProtectionDialog as any).passwordTextBox.value = '123';
        (editor.documentHelper.restrictEditingPane.enforceProtectionDialog as any).confirmPasswordTextBox.value = '123';
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.okButtonClick();
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.hideDialog();

    });
    it('stop protection pane', () => {
        console.log('stop protection pane');
        (editor.documentHelper.restrictEditingPane).stopProtection.click();
        (editor.documentHelper.restrictEditingPane).unProtectDialog.show();
        editor.documentHelper.restrictEditingPane.unProtectDialog.okButtonClick();
        editor.documentHelper.restrictEditingPane.unProtectDialog.hideDialog();

    });

});


describe('Restrict editing dialog protection type validation', () => {

    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/' });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');

    });
    afterEach(() => {
        (editor.documentHelper.restrictEditingPane as any).enforceProtection.click();
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.okButtonClick();
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.hideDialog();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        editor = undefined;
        setTimeout(function () {
            done();
        }, 2000);
    });

    it('Tracked changes validation', () => {
        console.log('Tracked changes validation');
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.showRestrictEditingPane(true);
        let args={value:'Tracked changes', previousItemData:{Value:'Read Only'}};
        expect(()=>{ (editor.documentHelper.restrictEditingPane as any).protectionTypeDropChanges(args)}).not.toThrowError();
        // expect(editor.documentHelper.protectionType).toBe('ReadOnly');
    });
    it('Comments validation', () => {
        (editor.documentHelper.restrictEditingPane).stopProtection.click();
        console.log('Comments validation');
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.showRestrictEditingPane(true);
        let args={value:'Comments', previousItemData:{Value:'Read Only'}};
        expect(()=>{ (editor.documentHelper.restrictEditingPane as any).protectionTypeDropChanges(args)}).not.toThrowError();
        // expect(editor.documentHelper.protectionType).toBe('ReadOnly');
    });
    it('No changes validation', () => {
        (editor.documentHelper.restrictEditingPane).stopProtection.click();
        console.log('No changes validation');
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.showRestrictEditingPane(true);
        let args={value:'No changes', previousItemData:{Value:'Read Only'}};
        expect(()=>{ (editor.documentHelper.restrictEditingPane as any).protectionTypeDropChanges(args)}).not.toThrowError();
        // expect(editor.documentHelper.protectionType).toBe('NoProtection');
    });
    it('No changes validation', () => {
        (editor.documentHelper.restrictEditingPane).stopProtection.click();
        console.log('No changes validation');
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.showRestrictEditingPane(true);
        let args={value:'Read Only', previousItemData:{Value:'Comments'}};
       expect(()=>{ (editor.documentHelper.restrictEditingPane as any).protectionTypeDropChanges(args)}).not.toThrowError();
    });
});

describe('Restrict editing dialog show ignored validation', () => {

    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/' });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        editor = undefined;
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('show ignored validation', () => {
        console.log('show ignored validation');
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.editor.insertEditingRegion('xxx@gmail.com');
        editor.showRestrictEditingPane(true);
        (editor.documentHelper.restrictEditingPane as any).onYesButtonClick();
        let args={value:'Filling in forms' , previousItemData:{Value:'Read Only'}};
        (editor.documentHelper.restrictEditingPane as any).protectionTypeDropChanges(args);
        (editor.documentHelper.restrictEditingPane as any).enforceProtection.click();
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.okButtonClick();
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.hideDialog();
        expect(editor.documentHelper.protectionType).toBe('FormFieldsOnly');
    });
    it('enable Formatting validation', () => {
        (editor.documentHelper.restrictEditingPane).stopProtection.click();
        console.log('enable Formatting validation');
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.showRestrictEditingPane(true);
        let args={checked:false};
        (editor.documentHelper.restrictEditingPane as any).enableFormatting(args);
    });

    it('show ignored validation -onNoButtonClick', () => {
        console.log('show ignored validation - onNoButtonClick');
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.editor.insertEditingRegion('xxx@gmail.com');
        editor.showRestrictEditingPane(true);
        (editor.documentHelper.restrictEditingPane as any).onNoButtonClick();
        (editor.documentHelper.restrictEditingPane as any).enforceProtection.click();
        // expect(editor.documentHelper.protectionType).toBe('ReadOnly');
    });
});


describe('Add use dialog validation', () => {

    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/' });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        editor = undefined;
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('open add user dialog', () => {
        console.log('open add user dialog');
        editor.showRestrictEditingPane(true);
        (editor.documentHelper.restrictEditingPane).addUserDialog.show();
        ((editor.documentHelper.restrictEditingPane).addUserDialog as any).textBoxInput.value = 'User1@gmail.com';
        editor.documentHelper.restrictEditingPane.addUserDialog.onKeyUpOnDisplayBox();
        ((editor.documentHelper.restrictEditingPane).addUserDialog).addButtonClick();
        expect((editor.documentHelper.restrictEditingPane.addUserDialog as any).userList.dataSource.length).toBe(2);
        //hide dialog
        (editor.documentHelper.restrictEditingPane).addUserDialog.okButtonClick();
    });

    it('invalid email validation', () => {
        (editor.documentHelper.restrictEditingPane).addUserDialog.show();
        ((editor.documentHelper.restrictEditingPane).addUserDialog as any).textBoxInput.value = 'User2';
        editor.documentHelper.restrictEditingPane.addUserDialog.onKeyUpOnDisplayBox();
        ((editor.documentHelper.restrictEditingPane).addUserDialog).addButtonClick();
        expect((editor.documentHelper.restrictEditingPane.addUserDialog as any).userList.dataSource.length).toBe(2);
    });
});

describe('Enforce dialog validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/' });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        editor = undefined;
        setTimeout(function () {
            done();
        }, 2000);
    });

    it('open enforce dialog', () => {
        console.log('open enforce dialog');
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.showRestrictEditingPane(true);
        (editor.documentHelper.restrictEditingPane as any).enforceProtection.click();
        (editor.documentHelper.restrictEditingPane.enforceProtectionDialog as any).passwordTextBox.value = '123';
        (editor.documentHelper.restrictEditingPane.enforceProtectionDialog as any).confirmPasswordTextBox.value = '12';
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.okButtonClick();
        expect(editor.documentHelper.protectionType).not.toBe('ReadOnly');
    });

});



describe('Enforce dialog validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/' });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        editor = undefined;
        setTimeout(function () {
            done();
        }, 2000);
    });

    it('open enforce dialog', () => {
        console.log('open enforce dialog');
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.editor.insertEditingRegion();
        editor.selection.moveToDocumentEnd();
        editor.editor.insertText('Hello World');
        editor.selection.selectParagraph();
        editor.editor.insertEditingRegion();
        editor.showRestrictEditingPane(true);
        (editor.documentHelper.restrictEditingPane as any).enforceProtection.click();
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.okButtonClick();
        editor.documentHelper.restrictEditingPane.navigateNextRegion();
        let args={checked:false};
        (editor.documentHelper.restrictEditingPane as any).highlightClicked(args);
        (editor.documentHelper.restrictEditingPane as any).changeHighlightOptions();
        editor.documentHelper.restrictEditingPane.showAllRegion();
        expect(editor.documentHelper.protectionType).toBe('ReadOnly');
    });

});