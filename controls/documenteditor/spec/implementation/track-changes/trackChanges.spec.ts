import { Toolbar } from "../../../src/document-editor-container/tool-bar/tool-bar"
import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../../test-helper.spec";
import { DocumentEditor } from "../../../src/document-editor/document-editor";
import { Editor } from "../../../src/document-editor/implementation/editor/editor";
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { EditorHistory } from "../../../src/document-editor/implementation/editor-history/editor-history";
import { SfdtExport } from "../../../src/document-editor/implementation/writer/sfdt-export";
import { HeaderFooterWidget, LineWidget, ParagraphWidget, TableWidget } from "../../../src/document-editor/implementation/viewer/page";
describe('Track changes Validation', () => {
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
    it('Enabling Tracking Changes  And enabling Readonly mode', function () {
        console.log('Enabling Tracking Changes And enabling Readonly mode');
        container.currentUser = "Guest";
        container.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.editor.insertText("world");
        container.isReadOnly = true;
        container.revisions.acceptAll();
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
});
describe('Track changes Pane in RTL Validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
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
    it('Track Changes Pane close button validation', function () {
        console.log('Track Changes Pane close button validation');
        let left: string = container.trackChangesPane.closeButton.style.left;
        let right: string = container.trackChangesPane.closeButton.style.right;
        expect(left).toBe('1px');
        expect(right).toBe('');
    });
});

describe('Track changes in Table validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
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
    it('Delete Table validation when Track Changes is enabled', () => {
        console.log('Delete Table validation when Track Changes is enabled');
        container.enableTrackChanges = true;
        container.currentUser = "Guest User";
        container.editor.insertTable(2, 2);
        container.selection.moveToDocumentStart();
        container.editor.deleteTable();
        let flag : number = 0;
        if(!(container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] instanceof TableWidget)) {
            flag = 1;
        } 
        expect(flag).not.toBe(0);
    });

});

describe('Track changes Select all and replace text', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
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
    it('Track changes Select all and replace text and insert new para validation', () => {
        console.log('Track changes Select all and replace text and insert new para validation');
        container.enableTrackChanges = true;
        container.editor.insertText("Hello");
        container.selection.selectAll();
        container.editor.insertText("Hello");
        container.editor.onEnter();
        container.editor.insertText("World");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
});
describe('Track changes hyperlink reject validation', () => {
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
    it('Test hyperlink formatting preservation on rejecting action', function () {
        console.log('Test hyperlink formatting preservation on rejecting action');
        container.openBlank();
        container.editor.insertHyperlink('https://www.syncfusion.com/', 'Syncfusion');
        container.enableTrackChanges = true;
        container.selection.select('0;0;0', '0;0;43');
        container.editor.removeHyperlink();
        container.revisions.changes[0].reject();
        container.selection.select('0;0;43', '0;0;53');
        expect(container.selection.characterFormat.underline).toBe('Single');
        expect(container.selection.characterFormat.fontColor).toBe('#0563c1');
    });
});
describe('Track changes hyperlink inserting validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
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
    it('Track changes hyperlink inserting validation', () => {
        console.log('Track changes hyperlink inserting validation');
        container.enableTrackChanges = true;
        container.editor.insertText("Google");  
        container.selection.select('0;0;0', '0;0;6');
        container.editor.insertHyperlink('https://www.syncfusion.com/', container.selection.text, container.selection.text);
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
});
