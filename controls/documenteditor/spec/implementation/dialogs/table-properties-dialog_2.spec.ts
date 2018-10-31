import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TablePropertiesDialog } from '../../../src/document-editor/implementation/dialogs/table-properties-dialog';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * table alignment
 */
describe('Table vertical alignment - center validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('in 3*4 table cell table vertical alignment validation', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.tableFormat.leftIndent = 10.8;
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).center.click();
        tablePropertiesDialog.applyTableProperties();
        expect(editor.selection.tableFormat.tableAlignment).toBe('Center');
        expect(editor.selection.tableFormat.leftIndent).toBe(0);
    });

    it('in 3*4 table and last column resized with minimum width', () => {
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.cellFormat.preferredWidth = 0;
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).preferredCellWidthCheckBox.checked = false;
        (tablePropertiesDialog as any).preferredCellWidth.value = 0;
        (tablePropertiesDialog as any).preferCheckBox.checked = false;
        (tablePropertiesDialog as any).rowHeightCheckBox.checked = false;
        (tablePropertiesDialog as any).rowHeight.value = 0;
        tablePropertiesDialog.applyTableProperties();
        expect(editor.selection.tableFormat.preferredWidth).not.toBe(0);
    });
});