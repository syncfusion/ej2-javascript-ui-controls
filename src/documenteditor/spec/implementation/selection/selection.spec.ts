import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
/**
 * Selection API Validation
 */

describe('Selection API', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1100px;height:700px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ContextMenu);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done: DoneFn) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('isTable Selected false', () => {
console.log('isTable Selected false');
        expect(editor.selection.isTableSelected()).toBe(false);
    });
    it('isTableSelected API inside table', () => {
console.log('isTableSelected API inside table');
        editor.editor.insertTable(2, 2);
        expect(editor.selection.isTableSelected()).toBe(false);
    });
    it('IsTableSelected API by selecting single column', () => {
console.log('IsTableSelected API by selecting single column');
        editor.selection.selectColumn();
        expect(editor.selection.isTableSelected()).toBe(false);
    });
    it('IsTableSelected API by selecting single row', () => {
console.log('IsTableSelected API by selecting single row');
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        editor.selection.selectRow();
        expect(editor.selection.isTableSelected()).toBe(false);
    });
    it('IsTableSelected API by selecting whole table', () => {
console.log('IsTableSelected API by selecting whole table');
        editor.selection.selectTable();
        expect(editor.selection.isTableSelected()).toBe(true);
    });
});


describe('Para mark selection validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1100px;height:700px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ContextMenu);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done: DoneFn) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('using shift home key', () => {
console.log('using shift home key');
        editor.editorModule.insertText('sample');
        editor.selection.handleShiftHomeKey();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.start.paragraph.characterFormat.bold).toBe(true);
    });
});

describe('Bookmarks API validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1100px;height:700px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ContextMenu);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done: DoneFn) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('selection at start of bookmark', () => {
console.log('selection at start of bookmark');
        editor.editorModule.insertText('sample');
        editor.selection.selectAll();
        editor.editor.insertBookmark('s');
        editor.selection.handleHomeKey();
        expect(editor.selection.bookmarks.length).toBe(0);
    });
    it('selection at end of bookmark', () => {
console.log('selection at end of bookmark');
        editor.selection.handleEndKey();
        expect(editor.selection.bookmarks.length).toBe(0);
    });
});
