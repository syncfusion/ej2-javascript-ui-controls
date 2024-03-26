// import { DocumentEditorContainer, ContainerContentChangeEventArgs, CONTROL_CHARACTERS, WCharacterFormat } from '../../../src/index';
// import { createElement } from '@syncfusion/ej2-base';
// import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
// /**
//  * insert text
//  */
// describe('Insert single length text', () => {
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

//     it('insert enter', () => {
//         console.log('insert enter');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.editor.insertText('Syncfusion Software');
//         container.documentEditor.selection.select('0;0;4', '0;0;4');
//         container.documentEditor.editor.onEnter();
//         expect(argsEle.operations[0].action).toBe('Insert');
//         expect(argsEle.operations[0].length).toBe(1);
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Paragraph);
//     });
// });