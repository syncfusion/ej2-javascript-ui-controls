import { DocumentEditorContainer, ContainerContentChangeEventArgs } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
/**
 * Track changes collaborative editing spec
 */
describe('Enable track changes in collaborative editing', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    let args: ContainerContentChangeEventArgs;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
        container.documentEditor.enableCollaborativeEditing = true;
    });
    afterAll(() => {
        expect(() => { container.destroy(); }).not.toThrowError();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });


    it('Undo/Redo insert text', () => {
        console.log('Undo/Redo insert text when enable track changes');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            argsEle = args;
        }
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.enableTrackChanges = true;
        container.documentEditor.editorModule.insertText('S');
        expect(argsEle.operations[0].markerData).toBeDefined();
        container.documentEditor.editorHistory.undo();
        expect(argsEle.operations.length).toBe(1);
        container.documentEditor.editorHistory.redo();
        expect(argsEle.operations[0].type).toBe('Paste')
        expect(argsEle.operations[0].pasteContent).toBeDefined();
    });

    it('Undo/Redo delete text', () => {
        console.log('Undo/Redo delete text when enable track changes');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            argsEle = args;
        }
        container.documentEditor.openBlank();
        container.documentEditor.enableTrackChanges = false;
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.enableTrackChanges = true;
        container.documentEditor.selection.select('0;0;2', '0;0;2');
        container.documentEditor.editorModule.onBackSpace();
        expect(argsEle.operations[0].markerData).toBeDefined();
        container.documentEditor.editorHistory.undo();
        expect(argsEle.operations[0].action).toBe('Delete');
        expect(argsEle.operations[0].markerData.isSkipTracking).toBe(true);
        expect(argsEle.operations[1].type).toBe('Paste')
        expect(argsEle.operations[1].pasteContent).toBeDefined();
        container.documentEditor.editorHistory.redo();
        expect(argsEle.operations[0].action).toBe('Format');
        expect(argsEle.operations[0].markerData).toBeDefined();
    });

    it('Undo/Redo Split revision', () => {
        console.log('Undo/Redo split revision track changes');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            argsEle = args;
        }
        container.documentEditor.openBlank();
        container.documentEditor.enableTrackChanges = false;
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.enableTrackChanges = true;
        container.documentEditor.selection.select('0;0;2', '0;0;7');
        container.documentEditor.editorModule.onBackSpace();
        expect(argsEle.operations[0].markerData).toBeDefined();
        container.documentEditor.selection.select('0;0;4', '0;0;4');
        container.documentEditor.editorModule.insertText('a');
        let insertRevisionID: string = argsEle.operations[0].markerData.revisionId;
        expect(argsEle.operations[0].markerData.splittedRevisions.length).toBe(1);
        container.documentEditor.editorHistory.undo();
        expect(argsEle.operations[0].action).toBe('Delete');
        container.documentEditor.editorHistory.redo();
        expect(argsEle.operations[0].type).toBe('Paste')
        expect(argsEle.operations[0].pasteContent).toBeDefined();
    });

    it('Backspace on muliple paragraph', () => {
        console.log('Backspace on muliple paragraph');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            argsEle = args;
        }
        container.documentEditor.openBlank();
        container.documentEditor.enableTrackChanges = false;
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.editor.onEnter();
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.editor.onEnter();
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.enableTrackChanges = true;
        container.documentEditor.selection.select('0;0;0', '0;2;10');
        container.documentEditor.editorModule.onBackSpace();
        expect(argsEle.operations[0].markerData).toBeDefined();
        expect(argsEle.operations[0].markerData.revisionType).toBe('Deletion');
        expect(argsEle.operations[0].markerData.splittedRevisions.length).toBe(4);
    });

    it('Selection with insert', () => {
        console.log('Selection with insert');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            argsEle = args;
        }
        container.documentEditor.openBlank();
        container.documentEditor.enableTrackChanges = false;
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.enableTrackChanges = true;
        container.documentEditor.selection.select('0;0;0', '0;0;10');
        container.documentEditor.editorModule.insertText('S');
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
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            argsEle = args;
        }
        container.documentEditor.openBlank();
        container.documentEditor.enableTrackChanges = false;
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.enableTrackChanges = true;
        container.documentEditor.selection.select('0;0;1', '0;0;1');
        container.documentEditor.editorModule.insertText('S');
        container.documentEditor.selection.select('0;0;3', '0;0;3');
        container.documentEditor.editorModule.insertText('S');
        container.documentEditor.selection.select('0;0;5', '0;0;5');
        container.documentEditor.editorModule.insertText('S');
        container.documentEditor.selection.select('0;0;0', '0;0;13');
        container.documentEditor.editorModule.onBackSpace();
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

    it('Selection with insert revision and delete', () => {
        console.log('Selection with insert revision and delete');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            argsEle = args;
        }
        container.documentEditor.openBlank();
        container.documentEditor.enableTrackChanges = false;
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.enableTrackChanges = true;
        container.documentEditor.selection.select('0;0;1', '0;0;1');
        container.documentEditor.editorModule.insertText('S');
        container.documentEditor.selection.select('0;0;3', '0;0;3');
        container.documentEditor.editorModule.insertText('S');
        container.documentEditor.selection.select('0;0;5', '0;0;5');
        container.documentEditor.editorModule.insertText('S');
        container.documentEditor.selection.select('0;0;0', '0;0;13');
        container.documentEditor.editorModule.onBackSpace();
        container.documentEditor.editorHistory.undo();
        expect(argsEle.operations[0].length).toBe(10);
        expect(argsEle.operations[0].action).toBe('Delete');
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[1].type).toBe('Paste')
        expect(argsEle.operations[1].pasteContent).toBeDefined();
        container.documentEditor.editorHistory.redo();
        expect(argsEle.operations[0].action).toBe('Format');
        expect(argsEle.operations[0].markerData).toBeDefined();
    });
});