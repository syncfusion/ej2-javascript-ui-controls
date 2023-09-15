import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
import { TestHelper } from '../test-helper.spec';
import { TableWidget, TableRowWidget, TableCellWidget } from '../../src/index';
describe('Selection Table format Bidi validation in table empty selection', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('For table with bidi true', () => {
console.log('For table with bidi true');
        editor.editor.insertTable(2, 2);
        editor.editor.insertText('سشةحمث');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('سشةحمث');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('سشةحمث');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('سشةحمث');
        editor.selection.tableFormat.bidi = true;
        expect(editor.selection.tableFormat.bidi).toBe(true);
    });
    it('undo after bidi for tabl format is true', () => {
console.log('undo after bidi for tabl format is true');
        editor.editorHistory.undo();
        expect(editor.selection.tableFormat.bidi).toBe(false);
    });
    it('redo after bidi for tabl format is true', () => {
console.log('redo after bidi for tabl format is true');
        editor.editorHistory.redo();
        expect(editor.selection.tableFormat.bidi).toBe(true);
    });
    it('Multiple undo and redo after bidi for tabl format is true', () => {
console.log('Multiple undo and redo after bidi for tabl format is true');
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(editor.selection.tableFormat.bidi).toBe(false);
    });
});

describe('Selection Table format Bidi validation in table with non empty selection', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('For table with bidi true', () => {
console.log('For table with bidi true');
        editor.editor.insertTable(2, 2);
        editor.editor.insertText('سشةحمث');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('سشةحمث');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('سشةحمث');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('سشةحمث');
        editor.selection.selectCell();
        editor.selection.tableFormat.bidi = true;
        expect(editor.selection.tableFormat.bidi).toBe(true);
    });
    it('undo after bidi for tabl format is true', () => {
console.log('undo after bidi for tabl format is true');
        editor.editorHistory.undo();
        expect(editor.selection.tableFormat.bidi).toBe(false);
    });
    it('redo after bidi for tabl format is true', () => {
console.log('redo after bidi for tabl format is true');
        editor.editorHistory.redo();
        expect(editor.selection.tableFormat.bidi).toBe(true);
    });
    it('Multiple undo and redo after bidi for tabl format is true', () => {
console.log('Multiple undo and redo after bidi for tabl format is true');
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(editor.selection.tableFormat.bidi).toBe(false);
    });

    describe('Selection Paragraph format keepWithNext validation', () => {
        let editor: DocumentEditor;
        let documentHelper: DocumentHelper;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
            document.body.innerHTML = '';
            document.body.appendChild(ele);
            DocumentEditor.Inject(Editor, EditorHistory, Selection);
            editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
            editor.acceptTab = true;
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo('#container');
            documentHelper = editor.documentHelper;
        });
        afterAll((done) => {
            editor.destroy();
            document.body.removeChild(document.getElementById('container'));
            editor = undefined;
            documentHelper = undefined;
            document.body.innerHTML = '';
            setTimeout(() => {
                done();
            }, 1000);
        });
        
    it('undo redo for  paragraph format keepWithNext true', () => {
        console.log('undo redo for  paragraph format keepWithNext true');
        documentHelper.selection.paragraphFormat.keepWithNext = true;
        expect(documentHelper.selection.start.paragraph.paragraphFormat.keepWithNext).toBe(true);
        editor.editorHistory.undo();
        expect(documentHelper.selection.start.paragraph.paragraphFormat.keepWithNext).toBe(false);
        editor.editorHistory.redo();
        expect(documentHelper.selection.start.paragraph.paragraphFormat.keepWithNext).toBe(true);
    });
        it('Multiple undo and redo after keepWithNext for paragraph format is true', () => {
    console.log('Multiple undo and redo after keepWithNext for paragraph format is true');
            for (let i: number = 0; i < 5; i++) {
                editor.editorHistory.undo();
                editor.editorHistory.redo();
            }
            editor.editorHistory.undo();
            expect(documentHelper.selection.start.paragraph.paragraphFormat.keepWithNext).toBe(false);
        });
    });

    describe('Selection Paragraph format keepLinesTogether validation', () => {
        let editor: DocumentEditor;
        let documentHelper: DocumentHelper;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
            document.body.innerHTML = '';
            document.body.appendChild(ele);
            DocumentEditor.Inject(Editor, EditorHistory, Selection);
            editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
            editor.acceptTab = true;
            (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
            (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
            (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
            (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
            editor.appendTo('#container');
            documentHelper = editor.documentHelper;
        });
        afterAll((done) => {
            editor.destroy();
            document.body.removeChild(document.getElementById('container'));
            editor = undefined;
            documentHelper = undefined;
            document.body.innerHTML = '';
            setTimeout(() => {
                done();
            }, 1000);
        });
        
    it('undo redo for  paragraph format keepLinesTogether true', () => {
        console.log('undo redo for  paragraph format keepLinesTogether true');
        documentHelper.selection.paragraphFormat.keepLinesTogether = true;
        expect(documentHelper.selection.start.paragraph.paragraphFormat.keepLinesTogether).toBe(true);
        editor.editorHistory.undo();
        expect(documentHelper.selection.start.paragraph.paragraphFormat.keepLinesTogether).toBe(false);
        editor.editorHistory.redo();
        expect(documentHelper.selection.start.paragraph.paragraphFormat.keepLinesTogether).toBe(true);
    });
        it('Multiple undo and redo after keepLinesTogether for paragraph format is true', () => {
    console.log('Multiple undo and redo after keepLinesTogether for paragraph format is true');
            for (let i: number = 0; i < 5; i++) {
                editor.editorHistory.undo();
                editor.editorHistory.redo();
            }
            editor.editorHistory.undo();
            expect(documentHelper.selection.start.paragraph.paragraphFormat.keepLinesTogether).toBe(false);
        });
    });
}); 