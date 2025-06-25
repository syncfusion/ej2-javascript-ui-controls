// import { createElement } from "@syncfusion/ej2-base";
// import { CollaborativeEditingHandler, DocumentEditor, Editor, EditorHistory, SfdtExport, Selection } from "../../../src/index";
// import { TestHelper } from "../../test-helper.spec";

// describe('Delete text', () => {
//     let editor: DocumentEditor = undefined;
//     beforeAll(() => {
//         
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true, isReadOnly: false, enableCollaborativeEditing: true });
//         DocumentEditor.Inject(Editor, Selection, EditorHistory, CollaborativeEditingHandler, SfdtExport);
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
//         
//         setTimeout(() => {
//             done();
//         }, 1000);
//     });

//     it('delete whole paragraph', () => {
//         console.log('delete whole paragraph');
//         editor.openBlank();
//         editor.editor.insertText('Syncfusion');
//         editor.editor.onEnter();
//         editor.editor.insertText('Software');
//         editor.editor.onEnter();
//         editor.editor.insertText('Company');
//         editor.selection.select('0;1;0', '0;1;9');
//         editor.editor.onBackSpace();
//         expect(editor.testingOPeration[0].offset).toBe(12);
//         expect(editor.testingOPeration[0].length).toBe(9);
//         expect(editor.testingOPeration[0].action).toBe('Delete');
//     })
// });