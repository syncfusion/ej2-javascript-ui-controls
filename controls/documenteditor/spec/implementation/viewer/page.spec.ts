import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { WidthInfo } from '../../../src/index';


/**
 * Get Next and previous widget validation
 */
describe('Numbering apply validation in different scenario', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Get next Rendered widget validation in splitted table ', () => {
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertText('Syncfusion');
        editor.selection.handleTabKey(true, false);
        editor.editorModule.insertText('Syncfusion');
        for (let i: number = 0; i < 60; i++) {
            editor.editorModule.onEnter();
        }
        editor.selection.handleTabKey(true, true);
        expect(editor.selection.start.paragraph.nextRenderedWidget).toBeUndefined();
    });
});

describe('Get Minimum and maximum width form cell', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container', styles: 'width:100%;height:500px' }));
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 500);
    });
    it('Get minimum and maximum width from cell', () => {
        editor.editor.insertTable(2, 2);
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company.');
        editor.editor.insertHyperlink('https://syncfusion.com', 'Syncfusion', true, false);
        let widthInfo: WidthInfo = editor.selection.start.paragraph.associatedCell.getMinimumAndMaximumWordWidth(0, 0);
        expect(widthInfo.minimumWordWidth).toBeGreaterThan(70);
        expect(widthInfo.minimumWordWidth).toBeLessThan(78);
        expect(widthInfo.maximumWordWidth).toBeGreaterThan(738);
        expect(widthInfo.maximumWordWidth).toBeLessThan(758);
    });
    it('Get min and max width from table', () => {
        editor.editor.insertTable(1, 2);
        // get width info from nested cell
        editor.selection.start.paragraph.associatedCell.ownerTable.isGridUpdated = false;
        let widthInfo: WidthInfo = editor.selection.start.paragraph.associatedCell.ownerTable.getMinimumAndMaximumWordWidth(0, 0);
        expect(widthInfo.maximumWordWidth).toBe(editor.selection.start.paragraph.associatedCell.ownerTable.tableHolder.getTotalWidth(0));
        expect(widthInfo.minimumWordWidth).toBe(editor.selection.start.paragraph.associatedCell.ownerTable.tableHolder.getTotalWidth(0));
    });
    it('Get min and max width from Row', () => {
        let widthInfo: WidthInfo = editor.selection.start.paragraph.associatedCell.ownerRow.getMinimumAndMaximumWordWidth(0, 0);
        expect(widthInfo.minimumWordWidth).toBe(0);
        expect(widthInfo.maximumWordWidth).toBe(0);
    });
});