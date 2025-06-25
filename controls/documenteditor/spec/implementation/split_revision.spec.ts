import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, ElementBox, ElementInfo, LineWidget, TextElementBox} from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';

describe('Insert revision after delete revision', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
    it('Insert revision before delete revision', () => {
        editor.openBlank();
        editor.enableTrackChanges = true;
        editor.editor.insertText('Syncfusion');
        editor.selection.select('0;0;5','0;0;5');
        editor.currentUser = 'owner';
        editor.editor.onBackSpace();
        editor.editor.insertText('S');
        expect(editor.revisions.changes.length).toBe(4);
    });
    it('Insert revision after delete revision', () => {
        editor.openBlank();
        editor.enableTrackChanges = true;
        editor.editor.insertText('Syncfusion');
        editor.selection.select('0;0;5','0;0;5');
        editor.currentUser = 'owner';
        editor.editor.onBackSpace();
        editor.selection.select('0;0;5','0;0;5');
        editor.editor.insertText('S');
        let currentLine: LineWidget = editor.selection.start.currentWidget as LineWidget;
        let lastElement: TextElementBox = currentLine.children[currentLine.children.length - 1] as TextElementBox;
        expect(lastElement.revisionLength).toBe(1);
    });
    it('Insert revision after delete revision with previous user', () => {
        editor.openBlank();
        editor.enableTrackChanges = true;
        editor.editor.insertText('Syncfusion');
        editor.selection.select('0;0;5','0;0;5');
        editor.currentUser = 'owner';
        editor.editor.onBackSpace();
        editor.currentUser = '';
        editor.selection.select('0;0;5','0;0;5');
        editor.editor.insertText('S');
        let indexInInline: number = 0;
        let inlineObj: ElementInfo = editor.selection.start.currentWidget.getInline(editor.selection.start.offset, indexInInline);
        let curInline: ElementBox = inlineObj.element;
        expect(curInline.revisionLength).toBe(1);
    });
});