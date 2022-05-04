import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, DocumentHelper, BodyWidget, SfdtExport } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
import { TestHelper } from '../test-helper.spec';
import { TableWidget, TableRowWidget, TableCellWidget } from '../../src/index';
describe('Selection table format validation-1', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.editorModule.insertTable(2, 2);
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
    it('left indent validation testing-1', () => {
console.log('left indent validation testing-1');
        editor.selection.tableFormat.leftIndent = 10;
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.leftIndent).toBe(10);
    });
    it('left indent validation testing-2', () => {
console.log('left indent validation testing-2');
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.leftIndent).toBe(0);
    });
    it('left indent validation testing-3', () => {
console.log('left indent validation testing-3');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.leftIndent).toBe(10);
    });
    it('left indent undo and redo multiple times validation testing-4', () => {
console.log('left indent undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.leftIndent).toBe(10);
    });
    it('left indent undo and redo multiple times validation testing-5', () => {
console.log('left indent undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.leftIndent).toBe(0);
    });
    it('cell spacing validation testing-1', () => {
console.log('cell spacing validation testing-1');
        editor.selection.tableFormat.cellSpacing = 5;
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.cellSpacing).toBe(5);
    });
    it('cell spacing validation testing-2', () => {
console.log('cell spacing validation testing-2');
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.cellSpacing).toBe(0);
    });
    it('cell spacing validation testing-3', () => {
console.log('cell spacing validation testing-3');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.cellSpacing).toBe(5);
    });
    it('cell spacing undo and redo multiple times validation testing-4', () => {
console.log('cell spacing undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.cellSpacing).toBe(5);
    });
    it('cell spacing undo and redo multiple times validation testing-5', () => {
console.log('cell spacing undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.cellSpacing).toBe(0);
    });
    it('left margin validation testing-1', () => {
console.log('left margin validation testing-1');
        editor.selection.tableFormat.leftMargin = 6.5;
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.leftMargin).toBe(6.5);
    });
    it('left margin validation testing-2', () => {
console.log('left margin validation testing-2');
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.leftMargin).toBe(5.4);
    });
    it('left margin validation testing-3', () => {
console.log('left margin validation testing-3');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.leftMargin).toBe(6.5);
    });
    it('left margin undo and redo multiple times validation testing-4', () => {
console.log('left margin undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.leftMargin).toBe(6.5);
    });
    it('left margin undo and redo multiple times validation testing-5', () => {
console.log('left margin undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.leftMargin).toBe(5.4);
    });
});
describe('Selection table format validation-2', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.editorModule.insertTable(2, 2);
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
    it('right margin validation testing-1', () => {
console.log('right margin validation testing-1');
        editor.selection.tableFormat.rightMargin = 6.4;
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.rightMargin).toBe(6.4);
    });
    it('right margin validation testing-2', () => {
console.log('right margin validation testing-2');
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.rightMargin).toBe(5.4);
    });
    it('right margin validation testing-3', () => {
console.log('right margin validation testing-3');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.rightMargin).toBe(6.4);
    });
    it('right margin undo and redo multiple times validation testing-4', () => {
console.log('right margin undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.rightMargin).toBe(6.4);
    });
    it('right margin undo and redo multiple times validation testing-5', () => {
console.log('right margin undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.rightMargin).toBe(5.4);
    });
    it('top margin validation testing-1', () => {
console.log('top margin validation testing-1');
        editor.selection.tableFormat.topMargin = 1;
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.topMargin).toBe(1);
    });
    it('top margin validation testing-2', () => {
console.log('top margin validation testing-2');
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.topMargin).toBe(0);
    });
    it('top margin validation testing-3', () => {
console.log('top margin validation testing-3');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.topMargin).toBe(1);
    });
    it('top margin undo and redo multiple times validation testing-4', () => {
console.log('top margin undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.topMargin).toBe(1);
    });
    it('top margin undo and redo multiple times validation testing-5', () => {
console.log('top margin undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.topMargin).toBe(0);
    });
    it('bottom margin validation testing-1', () => {
console.log('bottom margin validation testing-1');
        editor.selection.tableFormat.bottomMargin = 1;
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.bottomMargin).toBe(1);
    });
    it('bottom margin validation testing-2', () => {
console.log('bottom margin validation testing-2');
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.bottomMargin).toBe(0);
    });
    it('bottom margin validation testing-3', () => {
console.log('bottom margin validation testing-3');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.bottomMargin).toBe(1);
    });
    it('bottom margin undo and redo multiple times validation testing-4', () => {
console.log('bottom margin undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.bottomMargin).toBe(1);
    });
    it('bottom margin undo and redo multiple times validation testing-5', () => {
console.log('bottom margin undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.bottomMargin).toBe(0);
    });
});
describe('Selection table format validation-3', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.editorModule.insertTable(2, 2);
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
    // it('background testing', () => {
    //     editor.selection.tableFormat.background = '#dddddd';
    //     editor.editorHistory.undo();
    //     editor.editorHistory.redo();
    //     expect(editor.selection.tableFormat.background).toBe('#ffffff');
    // });
    it('preferred width testing-1', () => {
console.log('preferred width testing-1');
        editor.selection.tableFormat.preferredWidthType = 'Percent';
        editor.selection.tableFormat.preferredWidth = 5;
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidth).toBe(5);
    });
    it('preferred width testing-2', () => {
console.log('preferred width testing-2');
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidthType).toBe('Percent');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidth).toBe(0);
    });
    it('preferred width validation testing-3', () => {
console.log('preferred width validation testing-3');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidth).toBe(5);
    });
    it('preferred width undo and redo multiple times validation testing-4', () => {
console.log('preferred width undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidth).toBe(5);
    });
    it('preferred width undo and redo multiple times validation testing-4', () => {
console.log('preferred width undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidth).toBe(0);
    });
    it('preferred width type validation testing-1', () => {
console.log('preferred width type validation testing-1');
        editor.selection.tableFormat.preferredWidthType = 'Percent';
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidthType).toBe('Percent');
    });
    it('preferred width type validation testing-2', () => {
console.log('preferred width type validation testing-2');
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidthType).toBe('Auto');
    });
    it('preferred width type validation testing-3', () => {
console.log('preferred width type validation testing-3');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidthType).toBe('Percent');
    });
    it('preferred width type undo and redo multiple times validation testing-4', () => {
console.log('preferred width type undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidthType).toBe('Percent');
    });
    it('preferred width type undo and redo multiple times validation testing-5', () => {
console.log('preferred width type undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.preferredWidthType).toBe('Auto');
    });
    it('table alignment validation testing-1', () => {
console.log('table alignment validation testing-1');
        editor.selection.tableFormat.tableAlignment = 'Right';
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.tableAlignment).toBe('Right');
    });
    it('table alignment validation testing-2', () => {
console.log('table alignment validation testing-2');
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.tableAlignment).toBe('Left');
    });
    it('table alignment validation testing-3', () => {
console.log('table alignment validation testing-3');
        editor.editorHistory.redo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.tableAlignment).toBe('Right');
    });
    it('table alignment undo and redo multiple times validation testing-4', () => {
console.log('table alignment undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.tableAlignment).toBe('Right');
    });
    it('table alignment undo and redo multiple times validation testing-5', () => {
console.log('table alignment undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).tableFormat.tableAlignment).toBe('Left');
    });
});
describe('Selection row format validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.editorModule.insertTable(2, 2);
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
    it('height validation testing-1', () => {
console.log('height validation testing-1');
        editor.selection.rowFormat.heightType = 'AtLeast';
        editor.selection.rowFormat.height = 20;
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.height).toBe(20);
    });
    it('height validation testing-2', () => {
console.log('height validation testing-2');
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.height).toBe(1);
    });
    it('height validation testing-3', () => {
console.log('height validation testing-3');
        editor.editorHistory.redo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.height).toBe(20);
    });
    it('height undo and redo multiple times validation testing-4', () => {
console.log('height undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.height).toBe(20);
    });
    it('height undo and redo multiple times validation testing-5', () => {
console.log('height undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.height).toBe(1);
    });
    it('height type validation testing-1', () => {
console.log('height type validation testing-1');
        editor.selection.rowFormat.heightType = 'AtLeast';
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.heightType).toBe('AtLeast');
    });
    it('height type validation testing-2', () => {
console.log('height type validation testing-2');
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.heightType).toBe('Auto');
    });
    it('height type validation testing-3', () => {
console.log('height type validation testing-3');
        editor.editorHistory.redo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.heightType).toBe('AtLeast');
    });
    it('height type undo and redo multiple times validation testing-4', () => {
console.log('height type undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.heightType).toBe('AtLeast');
    });
    it('height type undo and redo multiple times validation testing-5', () => {
console.log('height type undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.heightType).toBe('Auto');
    });
    it('isheader validation testing-1', () => {
console.log('isheader validation testing-1');
        editor.selection.rowFormat.isHeader = true;
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.isHeader).toBe(true);
    });
    it('isheader validation testing-2', () => {
console.log('isheader validation testing-2');
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.isHeader).toBe(false);
    });
    it('isheader validation testing-3', () => {
console.log('isheader validation testing-3');
        editor.editorHistory.redo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.isHeader).toBe(true);
    });
    it('isheader undo and redo multiple times validation testing-4', () => {
console.log('isheader undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.isHeader).toBe(true);
    });
    it('isheader undo and redo multiple times validation testing-5', () => {
console.log('isheader undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.isHeader).toBe(false);
    });
    it('allow break across pages validation testing-1', () => {
console.log('allow break across pages validation testing-1');
        editor.selection.rowFormat.allowBreakAcrossPages = false;
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.allowBreakAcrossPages).toBe(false);
    });
    it('allow break across pages validation testing-2', () => {
console.log('allow break across pages validation testing-2');
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.allowBreakAcrossPages).toBe(true);
    });
    it('allow break across pages validation testing-3', () => {
console.log('allow break across pages validation testing-3');
        editor.editorHistory.redo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.allowBreakAcrossPages).toBe(false);
    });
    it('allow break across pages undo and redo multiple times validation testing-4', () => {
console.log('allow break across pages undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.allowBreakAcrossPages).toBe(false);
    });
    it('allow break across pages undo and redo multiple times validation testing-5', () => {
console.log('allow break across pages undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.allowBreakAcrossPages).toBe(true);
    });
});
describe('Selection cell format validation-1', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.editorModule.insertTable(2, 2);
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
    it('vertical alignment validation testing-1', () => {
console.log('vertical alignment validation testing-1');
        editor.selection.cellFormat.verticalAlignment = 'Center';
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.verticalAlignment).toBe('Center');
    });
    it('vertical alignment validation testing-2', () => {
console.log('vertical alignment validation testing-2');
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.verticalAlignment).toBe('Top');
    });
    it('vertical alignment validation testing-3', () => {
console.log('vertical alignment validation testing-3');
        editor.editorHistory.redo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.verticalAlignment).toBe('Center');
    });
    it('vertical alignment undo and redo multiple times validation testing-4', () => {
console.log('vertical alignment undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.verticalAlignment).toBe('Center');
    });
    it('vertical alignment undo and redo multiple times validation testing-5', () => {
console.log('vertical alignment undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.verticalAlignment).toBe('Top');
    });
    it('left margin validation testing-1', () => {
console.log('left margin validation testing-1');
        editor.selection.cellFormat.leftMargin = 10;
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.leftMargin).toBe(10);
    });
    it('left margin validation testing-2', () => {
console.log('left margin validation testing-2');
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.leftMargin).toBe(undefined);
    });
    it('left margin validation testing-3', () => {
console.log('left margin validation testing-3');
        editor.editorHistory.redo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.leftMargin).toBe(10);
    });
    it('left margin undo and redo multiple times validation testing-4', () => {
console.log('left margin undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.leftMargin).toBe(10);
    });
    it('left margin undo and redo multiple times validation testing-5', () => {
console.log('left margin undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.leftMargin).toBe(undefined);
    });
    it('right margin validation testing-1', () => {
console.log('right margin validation testing-1');
        editor.selection.cellFormat.rightMargin = 10;
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.rightMargin).toBe(10);
    });
    it('right margin validation testing-2', () => {
console.log('right margin validation testing-2');
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.rightMargin).toBe(undefined);
    });
    it('right margin validation testing-3', () => {
console.log('right margin validation testing-3');
        editor.editorHistory.redo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.rightMargin).toBe(10);
    });
    it('right margin undo and redo multiple times validation testing-4', () => {
console.log('right margin undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.rightMargin).toBe(10);
    });
    it('right margin undo and redo multiple times validation testing-5', () => {
console.log('right margin undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.rightMargin).toBe(undefined);
    });
});
describe('Selection cell format validation-2', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.editorModule.insertTable(2, 2);
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
    it('top margin validation testing-1', () => {
console.log('top margin validation testing-1');
        editor.selection.cellFormat.topMargin = 10;
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.topMargin).toBe(10);
    });
    it('top margin validation testing-2', () => {
console.log('top margin validation testing-2');
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.topMargin).toBe(undefined);
    });
    it('top margin validation testing-3', () => {
console.log('top margin validation testing-3');
        editor.editorHistory.redo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.topMargin).toBe(10);
    });
    it('top margin undo and redo multiple times validation testing-4', () => {
console.log('top margin undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.topMargin).toBe(10);
    });
    it('top margin undo and redo multiple times validation testing-5', () => {
console.log('top margin undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.topMargin).toBe(undefined);
    });
    it('bottom margin validation testing-1', () => {
console.log('bottom margin validation testing-1');
        editor.selection.cellFormat.bottomMargin = 10;
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.bottomMargin).toBe(10);
    });
    it('bottom margin validation testing-2', () => {
console.log('bottom margin validation testing-2');
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.bottomMargin).toBe(undefined);
    });
    it('bottom margin validation testing-3', () => {
console.log('bottom margin validation testing-3');
        editor.editorHistory.redo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.bottomMargin).toBe(10);
    });
    it('bottom margin undo and redo multiple times validation testing-4', () => {
console.log('bottom margin undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.bottomMargin).toBe(10);
    });
    it('bottom margin undo and redo multiple times validation testing-5', () => {
console.log('bottom margin undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.bottomMargin).toBe(undefined);
    });
    // it('background validation testing', () => {
    //     editor.selection.cellFormat.background = '#ffff00';
    //     editor.editorHistory.undo();
    //     expect(editor.selection.cellFormat.background).toBe('#ffffff');
    // });
});
describe('Selection cell format validation-3', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.editorModule.insertTable(2, 2);
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
    it('preferred width testing-1', () => {
console.log('preferred width testing-1');
        editor.selection.cellFormat.preferredWidth = 5;
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidth).toBe(5);
    });
    it('preferred width testing-2', () => {
console.log('preferred width testing-2');
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidth).toBe(234);
    });
    it('preferred width validation testing-3', () => {
console.log('preferred width validation testing-3');
        editor.editorHistory.redo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidth).toBe(5);
    });
    it('preferred width undo and redo multiple times validation testing-4', () => {
console.log('preferred width undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidth).toBe(5);
    });
    it('preferred width undo and redo multiple times validation testing-5', () => {
console.log('preferred width undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidth).toBe(234);
    });
    it('preferred width type validation testing-1', () => {
console.log('preferred width type validation testing-1');
        editor.selection.cellFormat.preferredWidthType = 'Percent';
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidthType).toBe('Percent');
    });
    it('preferred width type validation testing-2', () => {
console.log('preferred width type validation testing-2');
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidthType).toBe('Point');
    });
    it('preferred width type validation testing-3', () => {
console.log('preferred width type validation testing-3');
        editor.editorHistory.redo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidthType).toBe('Percent');
    });
    it('preferred width type undo and redo multiple times validation testing-4', () => {
console.log('preferred width type undo and redo multiple times validation testing-4');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidthType).toBe('Percent');
    });
    it('preferred width type undo and redo multiple times validation testing-5', () => {
console.log('preferred width type undo and redo multiple times validation testing-5');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.preferredWidthType).toBe('Point');
    });
});
let tableDoc:any = {
	"sections": [
		{
			"sectionFormat": {
				"pageWidth": 612,
				"pageHeight": 792,
				"leftMargin": 72,
				"rightMargin": 72,
				"topMargin": 72,
				"bottomMargin": 72,
				"differentFirstPage": false,
				"differentOddAndEvenPages": false,
				"headerDistance": 36,
				"footerDistance": 36,
				"bidi": false
			},
			"blocks": [
				{
					"rows": [
						{
							"cells": [
								{
									"blocks": [
										{
											"paragraphFormat": {
												"rightIndent": 0,
												"textAlignment": "Left",
												"lineSpacing": 1,
												"lineSpacingType": "Multiple",
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {
														"bold": false,
														"italic": false,
														"fontSize": 11,
														"fontFamily": "Calibri",
														"fontColor": "#000000FF",
														"boldBidi": false,
														"italicBidi": false,
														"fontSizeBidi": 11,
														"fontFamilyBidi": "Calibri",
														"allCaps": false
													},
													"text": " "
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 0.5
											},
											"bottom": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 0.5
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 234,
										"preferredWidthType": "Point",
										"cellWidth": 234,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 0
								},
								{
									"blocks": [
										{
											"paragraphFormat": {
												"rightIndent": 0,
												"textAlignment": "Left",
												"lineSpacing": 1,
												"lineSpacingType": "Multiple",
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {
														"bold": false,
														"italic": false,
														"fontSize": 11,
														"fontFamily": "Calibri",
														"fontColor": "#000000FF",
														"boldBidi": false,
														"italicBidi": false,
														"fontSizeBidi": 11,
														"fontFamilyBidi": "Calibri",
														"allCaps": false
													},
													"text": " "
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 0.5
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 0.5
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 234,
										"preferredWidthType": "Point",
										"cellWidth": 234,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 1
								}
							],
							"rowFormat": {
								"height": 0.9999974966049194,
								"allowBreakAcrossPages": true,
								"heightType": "AtLeast",
								"isHeader": false,
								"borders": {
									"top": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"left": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"hasNoneStyle": false,
										"lineStyle": "Cleared",
										"lineWidth": 0
									},
									"vertical": {
										"hasNoneStyle": false,
										"lineStyle": "Cleared",
										"lineWidth": 0
									}
								},
								"gridBefore": 0,
								"gridAfter": 0,
								"leftMargin": 0,
								"topMargin": 0,
								"rightMargin": 0,
								"bottomMargin": 0
							}
						},
						{
							"cells": [
								{
									"blocks": [
										{
											"paragraphFormat": {
												"rightIndent": 0,
												"textAlignment": "Left",
												"lineSpacing": 1,
												"lineSpacingType": "Multiple",
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {
														"bold": false,
														"italic": false,
														"fontSize": 11,
														"fontFamily": "Calibri",
														"fontColor": "#000000FF",
														"boldBidi": false,
														"italicBidi": false,
														"fontSizeBidi": 11,
														"fontFamilyBidi": "Calibri",
														"allCaps": false
													},
													"text": " "
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 0.5
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 0.5
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 234,
										"preferredWidthType": "Point",
										"cellWidth": 234,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 0
								},
								{
									"blocks": [
										{
											"paragraphFormat": {
												"rightIndent": 0,
												"textAlignment": "Left",
												"lineSpacing": 1,
												"lineSpacingType": "Multiple",
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {
														"bold": false,
														"italic": false,
														"fontSize": 11,
														"fontFamily": "Calibri",
														"fontColor": "#000000FF",
														"boldBidi": false,
														"italicBidi": false,
														"fontSizeBidi": 11,
														"fontFamilyBidi": "Calibri",
														"allCaps": false
													},
													"text": " "
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 0.5
											},
											"left": {
												"color": "#000000FF",
												"hasNoneStyle": false,
												"lineStyle": "Single",
												"lineWidth": 0.5
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 234,
										"preferredWidthType": "Point",
										"cellWidth": 234,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 1
								}
							],
							"rowFormat": {
								"height": 0.9999974966049194,
								"allowBreakAcrossPages": true,
								"heightType": "AtLeast",
								"isHeader": false,
								"borders": {
									"top": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"left": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"hasNoneStyle": false,
										"lineStyle": "Cleared",
										"lineWidth": 0
									},
									"vertical": {
										"hasNoneStyle": false,
										"lineStyle": "Cleared",
										"lineWidth": 0
									}
								},
								"gridBefore": 0,
								"gridAfter": 0,
								"leftMargin": 0,
								"topMargin": 0,
								"rightMargin": 0,
								"bottomMargin": 0
							}
						}
					],
					"grid": [
						234,
						234
					],
					"tableFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"diagonalDown": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"diagonalUp": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"horizontal": {
								"hasNoneStyle": false,
								"lineStyle": "Cleared",
								"lineWidth": 0
							},
							"vertical": {
								"hasNoneStyle": false,
								"lineStyle": "Cleared",
								"lineWidth": 0
							}
						},
						"shading": {},
						"leftIndent": 0,
						"tableAlignment": "Left",
						"topMargin": 0,
						"rightMargin": 0,
						"leftMargin": 0,
						"bottomMargin": 0,
						"preferredWidthType": "Auto",
						"bidi": false,
						"allowAutoFit": true
					},
					"description": null,
					"title": null,
					"columnCount": 2
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				}
			],
			"headersFooters": {
				"header": {
					"blocks": [
						{
							"paragraphFormat": {
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"footer": {
					"blocks": [
						{
							"paragraphFormat": {
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"evenHeader": {},
				"evenFooter": {},
				"firstPageHeader": {},
				"firstPageFooter": {}
			}
		}
	],
	"characterFormat": {
		"bold": false,
		"italic": false,
		"fontSize": 11,
		"fontFamily": "Calibri",
		"underline": "None",
		"strikethrough": "None",
		"baselineAlignment": "Normal",
		"highlightColor": "NoColor",
		"fontColor": "#00000000",
		"boldBidi": false,
		"italicBidi": false,
		"fontSizeBidi": 11,
		"fontFamilyBidi": "Calibri",
		"allCaps": false
	},
	"paragraphFormat": {
		"leftIndent": 0,
		"rightIndent": 0,
		"firstLineIndent": 0,
		"textAlignment": "Left",
		"beforeSpacing": 0,
		"afterSpacing": 8,
		"lineSpacing": 1,
		"lineSpacingType": "Multiple",
		"listFormat": {},
		"bidi": false,
		"keepLinesTogether": false,
		"keepWithNext": false,
		"widowControl": true
	},
	"defaultTabWidth": 36,
	"trackChanges": false,
	"enforcement": false,
	"hashValue": "",
	"saltValue": "",
	"formatting": false,
	"protectionType": "NoProtection",
	"dontUseHTMLParagraphAutoSpacing": false,
	"formFieldShading": true,
	"compatibilityMode": "Word2013",
	"styles": [
		{
			"name": "Normal",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {},
			"next": "Normal"
		},
		{
			"name": "Heading 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 12,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level1",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 16,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontSizeBidi": 16,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 1 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 1 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 16,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontSizeBidi": 16,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {}
		},
		{
			"name": "Heading 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 2,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level2",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 13,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 2 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 2 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 13,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 2,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level3",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 3 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 3 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 4",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 2,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level4",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 4 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 4 Char",
			"type": "Character",
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 5",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 2,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level5",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 5 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 5 Char",
			"type": "Character",
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 6",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 2,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level6",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 6 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 6 Char",
			"type": "Character",
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		}
	],
	"lists": [],
	"abstractLists": [],
	"comments": [],
	"revisions": [],
	"customXml": []
}
describe('table border copy/paste validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection,SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, enableLocalPaste:true,enableSfdtExport:true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.editorModule.insertTable(2, 2);
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
    it('table border copy/paste validation',()=>{
        console.log("table border copy/paste validation");
        editor.open(JSON.stringify(tableDoc));
        editor.selection.selectTable();
        editor.selection.copy();
        editor.editor.onBackSpace();
        editor.selection.checkForCursorVisibility();
        editor.editor.paste();
        let body:BodyWidget = editor.documentHelper.pages[0].bodyWidgets[0] as BodyWidget;
        let table: TableWidget = body.childWidgets[0] as TableWidget;
        let firstRow : TableRowWidget = table.childWidgets[0] as TableRowWidget;
        let secondRow : TableRowWidget = table.childWidgets[1] as TableRowWidget;
        //first row
        //first cell
        expect((firstRow.childWidgets[0] as TableCellWidget).cellFormat.borders.right.isBorderDefined).toBe(true);
        expect((firstRow.childWidgets[0] as TableCellWidget).cellFormat.borders.left.isBorderDefined).toBe(false);
        expect((firstRow.childWidgets[0] as TableCellWidget).cellFormat.borders.top.isBorderDefined).toBe(false);
        expect((firstRow.childWidgets[0] as TableCellWidget).cellFormat.borders.bottom.isBorderDefined).toBe(true);
        //second cell
        expect((firstRow.childWidgets[1] as TableCellWidget).cellFormat.borders.right.isBorderDefined).toBe(false);
        expect((firstRow.childWidgets[1] as TableCellWidget).cellFormat.borders.left.isBorderDefined).toBe(true);
        expect((firstRow.childWidgets[1] as TableCellWidget).cellFormat.borders.top.isBorderDefined).toBe(false);
        expect((firstRow.childWidgets[1] as TableCellWidget).cellFormat.borders.bottom.isBorderDefined).toBe(true);
        //second row
        //first cell
        expect((secondRow.childWidgets[0] as TableCellWidget).cellFormat.borders.right.isBorderDefined).toBe(true);
        expect((secondRow.childWidgets[0] as TableCellWidget).cellFormat.borders.left.isBorderDefined).toBe(false);
        expect((secondRow.childWidgets[0] as TableCellWidget).cellFormat.borders.top.isBorderDefined).toBe(true);
        expect((secondRow.childWidgets[0] as TableCellWidget).cellFormat.borders.bottom.isBorderDefined).toBe(false);
        //second cell
        expect((secondRow.childWidgets[1] as TableCellWidget).cellFormat.borders.right.isBorderDefined).toBe(false);
        expect((secondRow.childWidgets[1] as TableCellWidget).cellFormat.borders.left.isBorderDefined).toBe(true);
        expect((secondRow.childWidgets[1] as TableCellWidget).cellFormat.borders.top.isBorderDefined).toBe(true);
        expect((secondRow.childWidgets[1] as TableCellWidget).cellFormat.borders.bottom.isBorderDefined).toBe(false);

    })
});