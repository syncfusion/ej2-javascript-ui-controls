// import { DocumentEditor } from '../../../../../src/document-editor/document-editor';
// import { DocumentHelper } from '../../../../../src/document-editor/implementation/viewer/viewer';
// import { createElement} from '@syncfusion/ej2-base';
// import { TestHelper } from '../../../../test-helper.spec';
// import { Editor } from '../../../../../src/document-editor/implementation/editor/editor';
// import { EditorHistory } from '../../../../../src/document-editor/implementation/editor-history/editor-history';
// import { Selection } from '../../../../../src/document-editor/implementation/selection/selection';
// import { WordExport } from '../../../../../src/document-editor/implementation/writer/word-export';
// import { SfdtExport } from '../../../../../src/document-editor/implementation/writer/sfdt-export';
// import { BlockContainer, BlockWidget, BodyWidget, FieldElementBox, FootNoteWidget, TextFormField } from '../../../../../src';


// describe('Editor history group undo action', () => {
//     let editor: DocumentEditor;
//     let documentHelper: DocumentHelper;
//     beforeAll((): void => {
//         document.body.appendChild(createElement('div', { id: 'container' }));
//         editor = new DocumentEditor({ isReadOnly: false});
//         editor.enableAllModules();
//         editor.acceptTab = true;
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//         documentHelper = editor.documentHelper;
//     });
//     afterAll((done): void => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         setTimeout(function () {
//             document.body.innerHTML = '';
//             done();
//         }, 1000);
//     });
//     it('group undo action', () => {
//      console.log('group undo action');
//      editor.editorHistory.beginUndoAction();
//      editor.editor.insertText('Syncfusion');
//      editor.selection.selectAll();
//      editor.editor.toggleItalic();
//      editor.editor.toggleBold();
//         editor.editorHistory.endUndoAction();
//         //Undo validation
//         editor.editorHistory.undo();
//         editor.selection.selectAll();
//         expect(editor.selection.text).toBe('');

//         //Redo validation

//         editor.editorHistory.redo();
//         editor.selection.selectAll();
//         expect(editor.selection.text).toBe('Syncfusion');
//     });

//     it('Insert column break', () => {
//         console.log('Insert column break');
//         editor.editor.insertColumnBreak();
//         editor.editorHistory.undo();
//         editor.editorHistory.redo();
//         expect(editor.selection.text).toBe('');
//     });
// });