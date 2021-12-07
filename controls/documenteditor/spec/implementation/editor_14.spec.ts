import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, SfdtExport } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';

describe('Empty selection check whether selection is in field', () => {
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
    it('selection is in text', () => {
console.log('selection is in text');
        editor.editor.insertText('Hello World');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        expect(editor.selection.isInField).toBe(false);
    });
    it('select Field validation in text', () => {
console.log('select Field validation in text');
        editor.selection.selectField();
        expect(editor.selection.isEmpty).toBe(true);
    });
    it('selection is in field', () => {
console.log('selection is in field');
        editor.openBlank();
        let text: string = 'Lead#Email';
        editor.editor.insertField('MERGEFIELD ' + text + ' \\* MERGEFORMAT');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        expect(editor.selection.isInField).toBe(true);
    });
    it('select Field validation in field', () => {
console.log('select Field validation in field');
        editor.selection.selectField();
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('Delete after select field', () => {
console.log('Delete after select field');
        editor.editor.delete();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });

    it('Undo after select and delete field', () => {
console.log('Undo after select and delete field');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(false);
    });
    it('redo after select and delete field', () => {
console.log('redo after select and delete field');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });
});


describe('Non-selection check whether selection is in field', () => {
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
    it('selection is in field', () => {
console.log('selection is in field');
        let text: string = 'Lead#Email';
        editor.editor.insertField('MERGEFIELD ' + text + ' \\* MERGEFORMAT');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        expect(editor.selection.isInField).toBe(true);
    });
    it('select Field validation in field', () => {
console.log('select Field validation in field');
        editor.selection.selectField();
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('Delete after select field', () => {
console.log('Delete after select field');
        editor.editor.delete();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });

    it('Undo after select and delete field', () => {
console.log('Undo after select and delete field');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(false);
    });
    it('redo after select and delete field', () => {
console.log('redo after select and delete field');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });
});

describe('Insert bookmark inside header', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableEditorHistory: true, enableSfdtExport: true });

        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
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
    it('insert bookmark inside header', () => {
console.log('insert bookmark inside header');
        editor.enableHeaderAndFooter = true;
        editor.selection.enableHeadersFootersRegion(editor.documentHelper.pages[0].headerWidget);
        editor.editor.insertText('Hello');
        editor.selection.selectAll();
        editor.editor.insertBookmark('sample');
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('navigate bookmark in header', () => {
console.log('navigate bookmark in header');
        editor.selection.closeHeaderFooter();
        editor.selection.navigateBookmark('sample');
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('export the document and open same in documenteditor', () => {
console.log('export the document and open same in documenteditor');
        let sfdtString = editor.sfdtExportModule.serialize();
        editor.open(sfdtString);
        editor.selection.navigateBookmark('sample');
        expect(editor.selection.isEmpty).toBe(false);
    });
});


describe('Insert bookmark validaiton for splitted paragraph', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableEditorHistory: true, enableSfdtExport: true });

        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
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
    it('insert bookmark', () => {
console.log('insert bookmark');
        editor.selection.sectionFormat.pageWidth = 300;
        editor.selection.sectionFormat.pageHeight = 100;
        editor.editor.insertText('ert reteterterteterterterte te treteterter t ');
        editor.selection.selectAll();
        editor.editor.insertBookmark('sample');
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('undo after insert bookmark splitted paragraph', () => {
console.log('undo after insert bookmark splitted paragraph');
        editor.editorHistory.undo();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(0);
    });
    it('redo after insert bookmark splitted paragraph', () => {
console.log('redo after insert bookmark splitted paragraph');
        editor.editorHistory.redo();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('navigation for bookmark splitted paragraph', () => {
console.log('navigation for bookmark splitted paragraph');
        editor.selection.navigateBookmark('sample');
        expect(editor.selection.isEmpty).toBe(false);
    });
});


describe('Bookmark remove validation for two paragraph', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableEditorHistory: true, enableSfdtExport: true });

        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
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
    it('insert bookmark', () => {
console.log('insert bookmark');
        editor.editor.onEnter()
        editor.selection.selectAll();
        editor.editor.insertBookmark('sample');
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('on backspace before splitted paragraph', () => {
console.log('on backspace before splitted paragraph');
        editor.selection.handleDownKey();
        editor.editor.onBackSpace();
        editor.editor.onBackSpace();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(0);
    });
    it('undo after on backspace before splitted paragraph', () => {
console.log('undo after on backspace before splitted paragraph');
        editor.editorHistory.undo();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(1);
    });
    it('redo after on backspace before splitted paragraph', () => {
console.log('redo after on backspace before splitted paragraph');
        editor.editorHistory.redo();
        expect(editor.documentHelper.bookmarks.keys.length).toBe(0);
    });
});
