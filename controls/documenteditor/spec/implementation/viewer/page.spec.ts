import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { PageLayoutViewer, LayoutViewer } from '../../../src/document-editor/implementation/viewer/viewer';;
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { TextElementBox } from '../../../src';


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
        editor.editorModule.insertText('Syncfusion', false);
        editor.selection.handleTabKey(true, false);
        editor.editorModule.insertText('Syncfusion', false);
        for (let i: number = 0; i < 60; i++) {
            editor.editorModule.onEnter();
        }
        editor.selection.handleTabKey(true, true);
        expect(editor.selection.start.paragraph.nextRenderedWidget).toBeUndefined();
    });
});