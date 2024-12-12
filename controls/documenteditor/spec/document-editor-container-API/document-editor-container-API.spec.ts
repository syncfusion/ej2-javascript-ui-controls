import { Toolbar } from "../../src/document-editor-container/tool-bar/tool-bar"
import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../test-helper.spec";
import { DocumentEditor } from "../../src/document-editor/document-editor";
import { Editor } from "../../src/document-editor/implementation/editor/editor";
import { Selection } from '../../src/document-editor/implementation/selection/selection';
import { EditorHistory } from "../../src/document-editor/implementation/editor-history/editor-history";
import { SfdtExport } from "../../src/document-editor/implementation/writer/sfdt-export";


describe('CurrentuserAPI', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
  it('CurrentuserAPI', function () {
    console.log('CurrentuserAPI');
    container.currentUser = "vijay";
    container.editor.insertText("Hello");
    container.enableTrackChanges = true;
    container.editor.insertText("world");
   expect(container.currentUser).toEqual("vijay");
});

});

describe('documentEditorSettingsAPI', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('documentEditorSettingsAPI', () => {
        console.log('documentEditorSettingsAPI');
        container.openBlank();
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.insertFormField('CheckBox');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1.length).toEqual(3);
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'CheckBox3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(2);
        container.editor.stopProtection('123');
    });
});
describe('Script error throws whenever using refresh API,', () => {
    let documentEditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documentEditor = new DocumentEditor();
        (documentEditor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (documentEditor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (documentEditor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (documentEditor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        documentEditor.appendTo("#container");
    });
    afterAll((done) => {
        documentEditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documentEditor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    // it('Checking Script error throws whenever using refresh API', () => {
    //     console.log('Checking Script error throws whenever using refresh API');
    //     expect(function () { documentEditor.refresh(); }).not.toThrowError();
    // });

});

describe('isDocumentEmptyAPI', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('isDocumentEmpty API Checking with document Body', function () {
        console.log('isDocumentEmpty API Checking with document Body');
        container.openBlank();
        expect(container.isDocumentEmpty).toBeTruthy();
        container.editor.insertText("Hello");
        expect(container.isDocumentEmpty).toBeFalsy();
        container.selection.selectAll();
        container.editor.delete();
        expect(container.isDocumentEmpty).toBeTruthy();
    });
    it('isDocumentEmpty API Checking with document Header', function () {
        console.log('isDocumentEmpty API Checking with document Header');
        container.openBlank();
        expect(container.isDocumentEmpty).toBeTruthy();
        container.selection.goToHeader();
        container.editor.insertText("Header");
        expect(container.isDocumentEmpty).toBeFalsy();
        container.selection.selectAll();
        container.editor.delete();
        expect(container.isDocumentEmpty).toBeTruthy();
    });
    it('isDocumentEmpty API Checking with document Footer', function () {
        console.log('isDocumentEmpty API Checking with document Footer');
        container.openBlank();
        expect(container.isDocumentEmpty).toBeTruthy();
        container.selection.goToFooter();
        container.editor.insertText("Footer");
        expect(container.isDocumentEmpty).toBeFalsy();
        container.selection.selectAll();
        container.editor.delete();
        expect(container.isDocumentEmpty).toBeTruthy();
    });

});