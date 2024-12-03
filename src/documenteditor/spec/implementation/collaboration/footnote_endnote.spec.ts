// import { CONTROL_CHARACTERS, Operation, DocumentEditor, Editor, EditorHistory, Selection, CollaborativeEditingHandler } from '../../../src/index';
// import { createElement } from '@syncfusion/ej2-base';
// import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
// import { TestHelper } from '../../test-helper.spec';
// /**
//  * Footnote endnote collaborative editing spec
//  */
// describe('Enable track changes in collaborative editing', () => {
//     let editor: DocumentEditor = undefined;
//     beforeAll(() => {
//         document.body.innerHTML = '';
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableCollaborativeEditing: true });
//         DocumentEditor.Inject(Editor, Selection, EditorHistory, CollaborativeEditingHandler);
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.isTesting = true;
//         editor.appendTo('#container');
//     });
//     afterAll((done) => {
//         editor.isTesting = false;
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         document.body.innerHTML = '';
//         setTimeout(() => {
//             done();
//         }, 1000);
//     });

//     it('insert footnote', () => {
//         console.log('insert footnote');
//         editor.editor.insertText('Syncfusion Software');
//         editor.selection.select('0;0;4', '0;0;4');
//         editor.editor.insertFootnote();
//         expect(editor.testingOPeration[0].markerData.type).toBe("Footnote");
//         expect(editor.testingOPeration[0].length).toBe(4);
//         expect(editor.testingOPeration[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//     });

//     it('footnote undo/redo', () => {
//         console.log('footnote undo/redo');
//         editor.openBlank();
//         editor.editorModule.insertText('Syncfusion Software');
//         editor.selection.select('0;0;4', '0;0;4');
//         editor.editor.insertFootnote();
//         editor.editorHistory.undo();
//         expect(editor.testingOPeration[0].length).toBe(4);
//         expect(editor.testingOPeration[0].action).toBe('Delete');
//         editor.editorHistory.redo();
//         expect(editor.testingOPeration[0].type).toBe('Paste');
//         expect(editor.testingOPeration[0].pasteContent).toBeDefined();
//         //Undo redo delete footnote
//         editor.selection.select('0;0;5', '0;0;5');
//         editor.editor.onBackSpace();
//         expect(editor.testingOPeration[0].length).toBe(4);
//         expect(editor.testingOPeration[0].action).toBe('Delete');
//         editor.editorHistory.undo();
//         expect(editor.testingOPeration[0].type).toBe('Paste');
//         expect(editor.testingOPeration[0].pasteContent).toBeDefined();
//         editor.editorHistory.redo();
//         expect(editor.testingOPeration[0].length).toBe(4);
//         expect(editor.testingOPeration[0].action).toBe('Delete');
//     });

//     it('insert endnote', () => {
//         editor.openBlank();
//         editor.editorModule.insertText('Syncfusion Software');
//         editor.selection.select('0;0;4', '0;0;4');
//         editor.editor.insertEndnote();
//         expect(editor.testingOPeration[0].markerData.type).toBe("Endnote");
//         expect(editor.testingOPeration[0].length).toBe(4);
//         expect(editor.testingOPeration[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//     });

//     it('endnote undo/redo', () => {
//         console.log('endnote undo/redo');
//         editor.openBlank();
//         editor.editorModule.insertText('Syncfusion Software');
//         editor.selection.select('0;0;4', '0;0;4');
//         editor.editor.insertEndnote();
//         editor.editorHistory.undo();
//         expect(editor.testingOPeration[0].length).toBe(4);
//         expect(editor.testingOPeration[0].action).toBe('Delete');
//         editor.editorHistory.redo();
//         expect(editor.testingOPeration[0].type).toBe('Paste');
//         expect(editor.testingOPeration[0].pasteContent).toBeDefined();
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