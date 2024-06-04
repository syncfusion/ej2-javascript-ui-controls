import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition, TableWidget } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
import { Search } from '../../src/document-editor/implementation/search/index';
/**
 * List editing enhancement
 */



describe('Restart Numbering List validation - 1', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Apply restart numbering with different numberformat', () => {
console.log('Apply restart numbering with different numberformat');
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.editor.applyNumbering('.%1', 'Arabic');
        editor.selection.handleUpKey();
        editor.selection.handleDownKey();
        editor.editor.applyRestartNumbering(editor.selection);
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.1');
    });
    it('undo after restart numbering list', () => {
console.log('undo after restart numbering list');
        editor.editorHistory.undo();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.2');
    });
    it('redo after restart numbering list', () => {
console.log('redo after restart numbering list');
        editor.editorHistory.redo();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.1');
    });
});

describe('Restart Numbering List validation - 2', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Ensuring multiple list level for restart numbering', () => {
console.log('Ensuring multiple list level for restart numbering');
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.editor.applyNumbering('.%1', 'Arabic');
        editor.selection.handleDownKey();
        editor.selection.handleHomeKey();
        editor.selection.handleTabKey(true, false);
        editor.editor.applyBullet('\uf0b7', 'Symbol')
        editor.selection.handleUpKey();
        editor.editor.applyRestartNumbering(editor.selection);
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.1');
        editor.selection.handleDownKey();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).not.toBe('.1');
    });
    it('undo after multiple list level for restart numbering list', () => {
console.log('undo after multiple list level for restart numbering list');
        editor.editorHistory.undo();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.2');
    });
    it('redo after multiple list level for restart numbering list', () => {
console.log('redo after multiple list level for restart numbering list');
        editor.editorHistory.redo();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.1');
    });
});

//Customer reported issue
describe('Page break revision validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Page break revision validation', () => {
        editor.openBlank();
        editor.editor.insertText('hello');
        editor.editor.onEnter();
        expect(editor.revisions.length).toBe(0);
    }); 
});
describe('Pargrapgh indent on table creation validtaion', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true });
        DocumentEditor.Inject(Editor, Selection);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Pargrapgh indent on table creation validtaion', () => {
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.onApplyParagraphFormat('leftIndent', 200, true, false);
        editor.selection.handleHomeKey();
        editor.editor.insertTable(2, 2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBeGreaterThan(0);
    }); 
});
describe('Character format preservation for paste', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Text only paste', () => {
        editor.openBlank();
        editor.selection.characterFormat.bold = true;
        editor.editorModule.insertText('Syncfusion');
        editor.editorModule.onEnter();
        (editor.editor as any).pasteContents('Software');
        editor.editor.applyPasteOptions('KeepTextOnly');
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
});

describe('Validate the inserted form fields order', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
    it('Check the order of Form Fields', () => {
        console.log('Check the order of Form Fields');
        container.openBlank();
        container.editor.insertText("First Paragraph");
        container.editor.onEnter();
        container.editor.insertText("Second Paragraph");
        container.editor.insertFormField('CheckBox');
        container.selection.moveToLineStart();
        container.editor.insertFormField('Text');
        let formFieldNames: string[] = container.getFormFieldNames();
        expect(formFieldNames[0]).toEqual('Text1');
        expect(formFieldNames[1]).toEqual('CheckBox1');
    });
});

describe('remove a table cell with bookmark Element', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
    it('Remove the row', () => {
        console.log('Remove the row with bookmark inside.');
        container.openBlank();
        container.editor.insertTable(2,2);
        container.selection.select("0;0;0;0;0;0","0;0;1;1;0;0");
        container.editor.insertBookmark("bookmark1");
        container.selection.select("0;0;1;1;0;0","0;0;1;1;0;0");
        container.editor.deleteRow();
        expect(container.documentHelper.bookmarks.keys.length).toEqual(0);
    });
    it('Remove the column', () => {
        console.log('Remove the column with bookmark inside.');
        container.openBlank();
        container.editor.insertTable(2,2);
        container.selection.select("0;0;0;0;0;0","0;0;1;1;0;0");
        container.editor.insertBookmark("bookmark1");
        container.selection.select("0;0;1;1;0;0","0;0;1;1;0;0");
        container.editor.deleteColumn();
        expect(container.documentHelper.bookmarks.keys.length).toEqual(0);
    });
});

describe('Open empty string validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
    it('Empty string validation', () => {
        console.log('Empty string validation');
        container.openBlank();
        expect(() => { container.open('') }).not.toThrowError();
        expect(() => { container.open(undefined) }).not.toThrowError();
        expect(() => { container.open(null) }).not.toThrowError();
    });
});