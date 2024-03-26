// import { DocumentEditorContainer, ContainerContentChangeEventArgs, CONTROL_CHARACTERS } from '../../../src/index';
// import { createElement } from '@syncfusion/ej2-base';
// import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
// /**
//  * Footnote endnote collaborative editing spec
//  */
// describe('Enable track changes in collaborative editing', () => {
//     let container: DocumentEditorContainer;
//     let element: HTMLElement;
//     let args: ContainerContentChangeEventArgs;
//     beforeAll(() => {
//         element = createElement('div');
//         document.body.appendChild(element);
//         DocumentEditorContainer.Inject(Toolbar);
//         container = new DocumentEditorContainer();
//         container.appendTo(element);
//         container.documentEditor.enableCollaborativeEditing = true;
//     });
//     afterAll(() => {
//         expect(() => { container.destroy(); }).not.toThrowError();
//         expect(element.childNodes.length).toBe(0);
//         document.body.removeChild(element);
//         document.body.innerHTML = '';
//         element = undefined;
//         container = undefined;
//     });

//     it('insert footnote', () => {
//         console.log('insert footnote');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.editorModule.insertText('Syncfusion Software');
//         container.documentEditor.selection.select('0;0;4', '0;0;4');
//         container.documentEditor.editor.insertFootnote();
//         expect(argsEle.operations[0].markerData.type).toBe("Footnote");
//         expect(argsEle.operations[0].length).toBe(4);
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//     });

//     it('footnote undo/redo', () => {
//         console.log('footnote undo/redo');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.openBlank();
//         container.documentEditor.editorModule.insertText('Syncfusion Software');
//         container.documentEditor.selection.select('0;0;4', '0;0;4');
//         container.documentEditor.editor.insertFootnote();
//         container.documentEditor.editorHistory.undo();
//         expect(argsEle.operations[0].length).toBe(4);
//         expect(argsEle.operations[0].action).toBe('Delete');
//         container.documentEditor.editorHistory.redo();
//         expect(argsEle.operations[0].type).toBe('Paste');
//         expect(argsEle.operations[0].pasteContent).toBeDefined();
//         //Undo redo delete footnote
//         container.documentEditor.selection.select('0;0;5', '0;0;5');
//         container.documentEditor.editor.onBackSpace();
//         expect(argsEle.operations[0].length).toBe(4);
//         expect(argsEle.operations[0].action).toBe('Delete');
//         container.documentEditor.editorHistory.undo();
//         expect(argsEle.operations[0].type).toBe('Paste');
//         expect(argsEle.operations[0].pasteContent).toBeDefined();
//         container.documentEditor.editorHistory.redo();
//         expect(argsEle.operations[0].length).toBe(4);
//         expect(argsEle.operations[0].action).toBe('Delete');
//     });

//     it('insert endnote', () => {
//         console.log('insert endnote');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.openBlank();
//         container.documentEditor.editorModule.insertText('Syncfusion Software');
//         container.documentEditor.selection.select('0;0;4', '0;0;4');
//         container.documentEditor.editor.insertEndnote();
//         expect(argsEle.operations[0].markerData.type).toBe("Endnote");
//         expect(argsEle.operations[0].length).toBe(4);
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//     });

//     it('endnote undo/redo', () => {
//         console.log('endnote undo/redo');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.openBlank();
//         container.documentEditor.editorModule.insertText('Syncfusion Software');
//         container.documentEditor.selection.select('0;0;4', '0;0;4');
//         container.documentEditor.editor.insertEndnote();
//         container.documentEditor.editorHistory.undo();
//         expect(argsEle.operations[0].length).toBe(4);
//         expect(argsEle.operations[0].action).toBe('Delete');
//         container.documentEditor.editorHistory.redo();
//         expect(argsEle.operations[0].type).toBe('Paste');
//         expect(argsEle.operations[0].pasteContent).toBeDefined();
//         //Undo redo delete endtnote
//         // Undo is not working correctly after backspace.
//         // container.documentEditor.selection.select('0;0;5', '0;0;5');
//         // container.documentEditor.editor.onBackSpace();
//         // expect(argsEle.operations[0].length).toBe(4);
//         // expect(argsEle.operations[0].action).toBe('Delete');
//         // container.documentEditor.editorHistory.undo();
//         // expect(argsEle.operations[0].type).toBe('Paste');
//         // expect(argsEle.operations[0].pasteContent).toBeDefined();
//         // container.documentEditor.editorHistory.redo();
//         // expect(argsEle.operations[0].length).toBe(4);
//         // expect(argsEle.operations[0].action).toBe('Delete');
//     });
// });