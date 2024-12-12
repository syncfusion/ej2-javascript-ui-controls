import { DocumentEditorContainer, ContainerContentChangeEventArgs, DocumentEditor, Selection, Editor, EditorHistory, CollaborativeEditingHandler, SfdtExport } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
import { TestHelper } from '../../test-helper.spec';
/**
 * Track changes collaborative editing spec
 */
describe('Enable track changes in collaborative editing', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSfdtExport: true,  enableSelection: true, isReadOnly: false, enableCollaborativeEditing: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, CollaborativeEditingHandler, SfdtExport);
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

    it('Undo/Redo insert text', () => {
        console.log('Undo/Redo insert text when enable track changes');
        let argsEle: ContainerContentChangeEventArgs;
        editor.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        editor.editorModule.insertText('Syncfusion Software');
        editor.enableTrackChanges = true;
        editor.editorModule.insertText('S');
        expect(argsEle.operations[0].markerData).toBeDefined();
        editor.editorHistory.undo();
        expect(argsEle.operations.length).toBe(1);
        editor.editorHistory.redo();
        expect(argsEle.operations[0].type).toBe('Paste')
        expect(argsEle.operations[0].pasteContent).toBeDefined();
    });

    it('Undo/Redo delete text', () => {
        console.log('Undo/Redo delete text when enable track changes');
        let argsEle: ContainerContentChangeEventArgs;
        editor.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        editor.openBlank();
        editor.enableTrackChanges = false;
        editor.editorModule.insertText('Syncfusion Software');
        editor.enableTrackChanges = true;
        editor.selection.select('0;0;2', '0;0;2');
        editor.editorModule.onBackSpace();
        expect(argsEle.operations[0].markerData).toBeDefined();
        editor.editorHistory.undo();
        expect(argsEle.operations[0].action).toBe('Delete');
        expect(argsEle.operations[0].markerData.isSkipTracking).toBe(true);
        expect(argsEle.operations[1].type).toBe('Paste')
        expect(argsEle.operations[1].pasteContent).toBeDefined();
        editor.editorHistory.redo();
        expect(argsEle.operations[0].action).toBe('Delete');
        expect(argsEle.operations[0].markerData.isSkipTracking).toBe(true);
        expect(argsEle.operations[1].type).toBe('Paste')
        expect(argsEle.operations[1].pasteContent).toBeDefined();
    });

    it('Undo/Redo Split revision', () => {
        console.log('Undo/Redo split revision track changes');
        let argsEle: ContainerContentChangeEventArgs;
        editor.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        editor.openBlank();
        editor.enableTrackChanges = false;
        editor.editorModule.insertText('Syncfusion Software');
        editor.enableTrackChanges = true;
        editor.selection.select('0;0;2', '0;0;7');
        editor.editorModule.onBackSpace();
        expect(argsEle.operations[0].markerData).toBeDefined();
        editor.selection.select('0;0;4', '0;0;4');
        editor.editorModule.insertText('a');
        let insertRevisionID: string = argsEle.operations[0].markerData.revisionId;
        expect(argsEle.operations[0].markerData.splittedRevisions.length).toBe(1);
        editor.editorHistory.undo();
        expect(argsEle.operations[0].action).toBe('Delete');
        editor.editorHistory.redo();
        expect(argsEle.operations[0].type).toBe('Paste')
        expect(argsEle.operations[0].pasteContent).toBeDefined();
    });

    it('Backspace on muliple paragraph', () => {
        console.log('Backspace on muliple paragraph');
        let argsEle: ContainerContentChangeEventArgs;
        editor.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        editor.openBlank();
        editor.enableTrackChanges = false;
        editor.editorModule.insertText('Syncfusion Software');
        editor.editor.onEnter();
        editor.editorModule.insertText('Syncfusion Software');
        editor.editor.onEnter();
        editor.editorModule.insertText('Syncfusion Software');
        editor.enableTrackChanges = true;
        editor.selection.select('0;0;0', '0;2;10');
        editor.editorModule.onBackSpace();
        expect(argsEle.operations[0].markerData).toBeDefined();
        expect(argsEle.operations[0].markerData.revisionType).toBe('Deletion');
        expect(argsEle.operations[0].markerData.revisionId).toBeDefined();
    });

    it('Selection with insert', () => {
        console.log('Selection with insert');
        let argsEle: ContainerContentChangeEventArgs;
        editor.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        editor.openBlank();
        editor.enableTrackChanges = false;
        editor.editorModule.insertText('Syncfusion Software');
        editor.enableTrackChanges = true;
        editor.selection.select('0;0;0', '0;0;10');
        editor.editorModule.insertText('S');
        expect(argsEle.operations[0].action).toBe('Format');
        expect(argsEle.operations[0].length).toBe(10);
        expect(argsEle.operations[0].markerData.revisionType).toBe('Deletion');
        expect(argsEle.operations[1].action).toBe('Insert');
        expect(argsEle.operations[1].offset).toBe(11);
        expect(argsEle.operations[1].markerData.revisionType).toBe('Insertion');
    });

    it('Selection with insert revision and delete', () => {
        console.log('Selection with insert revision and delete');
        let argsEle: ContainerContentChangeEventArgs;
        editor.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        editor.openBlank();
        editor.enableTrackChanges = false;
        editor.editorModule.insertText('Syncfusion Software');
        editor.enableTrackChanges = true;
        editor.selection.select('0;0;1', '0;0;1');
        editor.editorModule.insertText('S');
        editor.selection.select('0;0;3', '0;0;3');
        editor.editorModule.insertText('S');
        editor.selection.select('0;0;5', '0;0;5');
        editor.editorModule.insertText('S');
        editor.selection.select('0;0;0', '0;0;13');
        editor.editorModule.onBackSpace();
        expect(argsEle.operations.length).toBe(4);
        expect(argsEle.operations[0].action).toBe('Delete');
        expect(argsEle.operations[0].offset).toBe(6);
        expect(argsEle.operations[1].action).toBe('Delete');
        expect(argsEle.operations[1].offset).toBe(4);
        expect(argsEle.operations[2].action).toBe('Delete');
        expect(argsEle.operations[2].offset).toBe(2);
        expect(argsEle.operations[3].action).toBe('Format');
        expect(argsEle.operations[3].offset).toBe(1);
        expect(argsEle.operations[3].length).toBe(10);
        expect(argsEle.operations[3].markerData).toBeDefined();
    });

    it('Combination of backing in revision', () => {
        console.log('Combination of backing in revision');
        let argsEle: ContainerContentChangeEventArgs;
        editor.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        editor.openBlank();
        editor.enableTrackChanges = false;
        editor.editorModule.insertText('Syncfusion Software');
        editor.enableTrackChanges = true;
        editor.selection.select('0;0;3', '0;0;3');
        editor.editorModule.insertText('com');
        editor.editorModule.onBackSpace();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].action).toBe('Delete');
        expect(argsEle.operations[0].offset).toBe(6);
        editor.editorModule.onBackSpace();
        expect(argsEle.operations[0].action).toBe('Delete');
        expect(argsEle.operations[0].length).toBe(1)
        expect(argsEle.operations[0].offset).toBe(5);
        editor.selection.select('0;0;4', '0;0;4');
        editor.editorModule.insertText('com');
        editor.selection.select('0;0;4', '0;0;7');
        editor.editorModule.onBackSpace();
        expect(argsEle.operations[0].action).toBe('Delete');
        expect(argsEle.operations[0].length).toBe(3)
        expect(argsEle.operations[0].offset).toBe(5);
        editor.selection.select('0;0;4', '0;0;4');
        editor.editorModule.insertText('com');
        editor.selection.select('0;0;2', '0;0;10');
        editor.editorModule.onBackSpace();
        expect(argsEle.operations[0].action).toBe('Delete');
        expect(argsEle.operations[0].length).toBe(4)
        expect(argsEle.operations[0].offset).toBe(4);
        expect(argsEle.operations[1].action).toBe('Format');
        expect(argsEle.operations[1].length).toBe(4);
        expect(argsEle.operations[1].offset).toBe(3);
        expect(argsEle.operations[1].markerData.revisionId).toBeDefined();
        expect(argsEle.operations[1].markerData.revisionType).toBe('Deletion');
    });

    it('Combination of multiple paragraph and table selection delete', () => {
        console.log('Combination of multiple paragraph and table selection delete');
        let argsEle: ContainerContentChangeEventArgs;
        editor.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        editor.openBlank();
        editor.enableTrackChanges = false;
        editor.editorModule.insertText('Syncfusion Software');
        editor.editorModule.insertTable(2,2);
        editor.selectionModule.select('0;2;0', '0;2;0');
        editor.editorModule.insertText('Syncfusion Software');
        editor.enableTrackChanges = true;
        editor.selectionModule.select('0;0;0', '0;2;19');
        editor.editorModule.onBackSpace();
        //Add revison to last paragraph
        expect(argsEle.operations[0].length).toBe(19);
        expect(argsEle.operations[0].action).toBe('Format');
        expect(argsEle.operations[0].offset).toBe(32);
        //Add revison to first row
        expect(argsEle.operations[1].length).toBe(4);
        expect(argsEle.operations[1].action).toBe('Format');
        expect(argsEle.operations[1].offset).toBe(22);
        expect(argsEle.operations[1].type).toBe('RemoveRowTrack');
        //Add revison to second row
        expect(argsEle.operations[2].length).toBe(4);
        expect(argsEle.operations[2].action).toBe('Format');
        expect(argsEle.operations[2].offset).toBe(27);
        expect(argsEle.operations[2].type).toBe('RemoveRowTrack');
        //Add revison to first paragraph
        expect(argsEle.operations[3].length).toBe(19);
        expect(argsEle.operations[3].action).toBe('Format');
        expect(argsEle.operations[3].offset).toBe(1);
    });

    it('Insert text inside the cell', () => {
        console.log('Insert text inside the cell');
        let argsEle: ContainerContentChangeEventArgs;
        editor.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        editor.openBlank();
        editor.enableTrackChanges = true;
        editor.editor.insertTable(2, 2);
        editor.editor.insertText('s');
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].action).toBe('Insert');
        expect(argsEle.operations[0].offset).toBe(4);
        expect(argsEle.operations[0].markerData).toBeDefined();
    });
});