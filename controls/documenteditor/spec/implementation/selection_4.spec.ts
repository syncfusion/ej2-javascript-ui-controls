import { DocumentEditor } from '../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, TablePropertiesDialog } from '../../src/index';

import { TestHelper } from '../test-helper.spec';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';

describe('Selection bookmark property validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Single line in a paragraph with selection 1', () => {
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b1');
        expect(editor.selection.bookmarks[0]).toBe('b1');
    });
    it('Multiple lines in a paragraph with selection', () => {
        editor.openBlank();
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large');
        editor.selection.handleShiftUpKey();
        editor.editor.insertBookmark('b1');
        expect(editor.selection.bookmarks[0]).toBe('b1');
    });
    it('Multiple lines in different paragraph with selection', () => {
        editor.openBlank();
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large');
        editor.editor.onEnter();
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large');
        editor.selection.handleShiftUpKey();
        editor.selection.handleShiftUpKey();
        editor.selection.handleShiftUpKey();
        editor.editor.insertBookmark('b1');
        expect(editor.selection.bookmarks[0]).toBe('b1');
    });
    it('Inside table cell with selection', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b1');
        (editor.selection as any).selectNextCell();
        editor.editorModule.insertTable(2, 2);
        editor.editor.insertText('Happy World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b2');
        editor.selection.handleShiftLeftKey();
        editor.selection.selectAll()
        expect(editor.selection.bookmarks.length).toBe(2);
    });
    it('Single line in a paragraph without selection', () => {
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b1');
        editor.selection.handleLeftKey();
        expect(editor.selection.bookmarks[0]).toBe('b1');
    });
    it('Empty bookmark on single line in a paragraph without selection', () => {
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b1');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.bookmarks.length).toBe(0);
    });
    it('single line in a paragraph with selection 2', () => {
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.editor.insertBookmark('b1');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.bookmarks.length).toBe(1);
    });
    it('combination paragraph and table contains bookmark validation ', () => {
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b1');
        editor.selection.handleRightKey();
        editor.editor.onEnter();
        editor.editorModule.insertTable(2, 2);
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b2');
        editor.selection.selectAll();
        expect(editor.selection.bookmarks.length).toBe(2);
    });
    it('insert text after bookmark insert validation', () => {
        editor.openBlank();
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.editor.insertBookmark('b1');
        editor.selection.handleRightKey();
        editor.selection.handleLeftKey();
        editor.selection.handleRightKey();
        editor.editor.insertText('s');
        expect(editor.selection.start.currentWidget.children.length).toBe(4);
    });
});

describe('enable repeat row header test', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('enable repeat row header scenario 1', () => {
        editor.editor.insertTable(2, 2);
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(true);
    });
    it('enable repeat row header scenario 2', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.moveDown();
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(false);
    });
    it('enable repeat row header scenario 3', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.moveDown();
        editor.editor.insertTable(2, 2);
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(true);
    });
    it('enable repeat row header scenario 4', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.moveDown();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(false);
    });
});

describe('Selection public API validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('selects current line', () => {
        editor.editor.insertText('Hello World');
        editor.selection.selectLine();
        expect(editor.selection.start.hierarchicalPosition).not.toBe(editor.selection.end.hierarchicalPosition);
    });
    it('selects current paragraph', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American,');
        editor.selection.moveUp();
        editor.selection.selectParagraph();
        expect(editor.selection.start.currentWidget).not.toBe(editor.selection.end.currentWidget);
    });
    it('select current word by excluding space', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Hello world');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.text).toBe('world');
    });
    it('select current word by including space', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Hello world ');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord(true);
        expect(editor.selection.text).toBe('world ');
    });
    it('moves selection to document start', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Hello world ');
        editor.selection.moveToDocumentStart();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;0;0;0');
    });
    it('moves selection to document end', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Hello world ');
        editor.selection.moveToDocumentEnd();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;4;0;12');
    });
    it('moves selection to paragraph start', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American,');
        editor.selection.moveToParagraphStart();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;0;0');
    });
    it('moves selection to paragraph end', () => {
        editor.selection.moveToParagraphEnd();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;2;38');
    });
    it('moves selection to previous line', () => {
        editor.selection.moveToPreviousLine();
        //expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;1;39');
    });
    it('moves selection to next line', () => {
        editor.selection.moveToNextLine();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;2;37');
    });
    it('moves selection to line start', () => {
        editor.selection.moveToLineStart();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;2;0');
    });
    it('moves selection to line end', () => {
        editor.selection.moveToLineEnd();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;2;37');
    });
    it('moves selection to previous character', () => {
        let endOffset = editor.selection.end.offset;
        editor.selection.moveToPreviousCharacter();
        expect(editor.selection.end.offset).toBeLessThan(endOffset);
    });
    it('moves selection to next character', () => {
        let endOffset = editor.selection.end.offset;
        editor.selection.moveToNextCharacter();
        expect(editor.selection.end.offset).toBe(endOffset + 1);
    });
    it('extends selection to line start', () => {
        editor.selection.extendToLineStart();
        expect(editor.selection.start.offset).not.toBe(editor.selection.end.offset);
    });
    it('extends selection to line end', () => {
        editor.selection.extendToLineEnd();
        expect(editor.selection.start.offset).not.toBe(editor.selection.end.offset);
    });
    it('extends selection to line end', () => {
        editor.selection.extendToLineEnd();
        expect(editor.selection.start.offset).not.toBe(editor.selection.end.offset);
    });
    it('extends selection to previous line', () => {
        editor.selection.extendToPreviousLine();
        expect(editor.selection.start.currentWidget).not.toBe(editor.selection.end.currentWidget);
    });
    it('extends selection to next line', () => {
        editor.selection.extendToNextLine();
        expect(editor.selection.start.currentWidget).toBe(editor.selection.end.currentWidget);
    });
    it('extends selection to paragraph start', () => {
        editor.selection.extendToParagraphStart();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;0;0');
    });
    it('extends selection to paragraph end', () => {
        editor.selection.extendToParagraphEnd();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;2;38');
    });
    it('extends selection backward', () => {
        editor.selection.moveToLineEnd();
        let endOffset: number = editor.selection.end.offset;
        editor.selection.extendBackward();
        expect(editor.selection.end.offset).toBe(endOffset - 1);
    });
    it('extends selection forward', () => {
        editor.selection.moveToLineStart();
        let endOffset: number = editor.selection.start.offset;
        editor.selection.extendForward();
        expect(editor.selection.end.offset).toBe(endOffset + 1);
    });
    it('extends selection to word start', () => {
        editor.openBlank();
        editor.editor.insertText('Hello world');
        editor.selection.extendToWordStart();
        expect(editor.selection.text).toBe('world');
    });
    it('extends selection to word start', () => {
        editor.selection.extendToWordEnd();
        expect(editor.selection.text).toBe('');
    });
    it('start offset property', () => {
        expect(editor.selection.startOffset).toBe('0;0;11');
    });
    it('end offset property', () => {
        expect(editor.selection.endOffset).toBe('0;0;11');
    });
    it('select using hierarchical index', () => {
        editor.openBlank();
        editor.editor.insertText('Hello world');
        editor.selection.select('0;0;0', '0;0;11');
        expect(editor.selection.text).toBe('Hello world');
    });
});
