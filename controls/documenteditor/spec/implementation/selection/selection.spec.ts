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
        setTimeout(() => {
            done();
        }, 750);
    });
    it('isTable Selected false', () => {
        expect(editor.selection.isTableSelected()).toBe(false);
    });
    it('isTableSelected API inside table', () => {
        editor.editor.insertTable(2, 2);
        expect(editor.selection.isTableSelected()).toBe(false);
    });
    it('IsTableSelected API by selecting single column', () => {
        editor.selection.selectColumn();
        expect(editor.selection.isTableSelected()).toBe(false);
    });
    it('IsTableSelected API by selecting single row', () => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        editor.selection.selectRow();
        expect(editor.selection.isTableSelected()).toBe(false);
    });
    it('IsTableSelected API by selecting whole table', () => {
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
        setTimeout(() => {
            done();
        }, 750);
    });
    it('using shift home key', () => {
        editor.editorModule.insertText('sample');
        editor.selection.handleShiftHomeKey();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.start.paragraph.characterFormat.bold).toBe(true);
    });
});