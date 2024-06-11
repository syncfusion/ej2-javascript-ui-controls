// import { Selection, CONTROL_CHARACTERS, DocumentEditor, Editor, EditorHistory, CollaborativeEditingHandler, SfdtExport, WCharacterFormat } from '../../../src/index';
// import { createElement } from '@syncfusion/ej2-base';
// import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
// import { TestHelper } from '../../test-helper.spec';
// /**
//  * insert text
//  */
// describe('Insert single length text', () => {
//     let editor: DocumentEditor = undefined;
//     beforeAll(() => {
//         document.body.innerHTML = '';
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSfdtExport: true,  enableSelection: true, isReadOnly: false, enableCollaborativeEditing: true });
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
//         document.body.innerHTML = '';
//         setTimeout(() => {
//             done();
//         }, 1000);
//     });

//     it('insert enter', () => {
//         console.log('insert enter');
//         editor.editor.insertText('Syncfusion Software');
//         editor.selection.select('0;0;4', '0;0;4');
//         editor.editor.onEnter();
//         expect(editor.testingOPeration[0].action).toBe('Insert');
//         expect(editor.testingOPeration[0].length).toBe(1);
//         expect(editor.testingOPeration[0].text).toBe(CONTROL_CHARACTERS.Paragraph);
//     });

//     it('insert text', () => {
//         console.log('insert text');
//         editor.openBlank();
//         editor.editorModule.insertText('Syncfusion Software');
//         editor.selection.select('0;0;4', '0;0;4');
//         editor.editor.toggleBold();
//         editor.editorModule.insertText('D');
//         expect(editor.testingOPeration[0].offset).toBe(5);
//         expect(editor.testingOPeration[0].length).toBe(1);
//         let characterFormat: WCharacterFormat = new WCharacterFormat();
//         var data: object = JSON.parse(editor.testingOPeration[0].format);
//         editor.parser.parseCharacterFormat(0, data, characterFormat);
//         editor.selection.characterFormat.copyFormat(characterFormat);
//         expect(characterFormat.bold).toBe(true);
//         editor.selection.select('0;0;3', '0;0;6');
//         editor.selection.characterFormat.underline = 'Single';
//         editor.selection.select('0;0;4', '0;0;4');
//         editor.editor.toggleUnderline('None');
//         editor.editor.insertText('V');
//         expect(editor.testingOPeration[0].offset).toBe(5);
//         expect(editor.testingOPeration[0].length).toBe(1);
//         var data: object = JSON.parse(editor.testingOPeration[0].format);
//         editor.parser.parseCharacterFormat(0, data, characterFormat);
//         editor.selection.characterFormat.copyFormat(characterFormat);
//         expect(characterFormat.underline).toBe('None');
//     });

//     // it('undo/redo insert text', () => {
//     //     console.log('undo/redo insert text');
//     //     let argsEle: ContainerContentChangeEventArgs;
//     //     container.contentChange = function (args: ContainerContentChangeEventArgs) {
//     //         argsEle = args;
//     //     }
//     //     editor.openBlank();
//     //     editor.editorModule.insertText('Syncfusion Software');
//     //     editor.selection.select('0;0;4', '0;0;4');
//     //     editor.editor.toggleBold();
//     //     editor.editorModule.insertText('D');
//     //     editor.editorHistory.undo();
//     //     expect(editor.testingOPeration[0].offset).toBe(5);
//     //     expect(editor.testingOPeration[0].length).toBe(1);
//     //     expect(editor.testingOPeration[0].action).toBe('Delete');
//     //     editor.editorHistory.redo();
//     //     //Need to port the code after merge the commit PR.
//     // });
// });