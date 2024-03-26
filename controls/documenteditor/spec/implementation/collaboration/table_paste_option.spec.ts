// import { DocumentEditorContainer, ContainerContentChangeEventArgs, CONTROL_CHARACTERS, HelperMethods, Operation } from '../../../src/index';
// import { createElement } from '@syncfusion/ej2-base';
// import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
// /**
//  * Footnote endnote collaborative editing spec
//  */
// describe('Table paste options in collaborative editing', () => {
//     let container: DocumentEditorContainer;
//     let element: HTMLElement;
//     let args: ContainerContentChangeEventArgs;
//     let pasteValue: string = "UEsDBBQAAAAIABZlM1jb23r+FQQAAOFOAAAEAAAAc2ZkdOxcS2/bMAz+K4F2DQo7ie0mt2FFjkWx7bb14Gds1C/IcrM16H8fKcpumqZt3KBDkTIHi5IoyZIofhIdcSOqWmVFdhf/SCIlFkq28Vg0cSgWvzYi0E+pn0rWQGyEH8gbsbDHIo0gbkEIzzMMoTgEQSQb5MshCs9GJ+ZrZHKgZuSGoO4KlcQA7Ykvlv4tl+J+LOTqqOKqPqp4cNzL3x5VGviOKB1FXXG7K249VxzZ2wHswJ8XYuGczWCCOkIVhikgApi2pSdMsAGggSPTz5bqJnFJmjto2sbyCXCKb36eBTITEN3qmmVBQkDFAxNmJoQakOrqQHq7lsTfiSfxTkK5k+KHVD8MpG1Np0ghx8RyJkhjA0SHNAUN8NsW9bzWvc2z0oyJ7Kmkp4LGEH5HNAG8JIY+hXo6MCM3o1TlOlCUfbMuKcQ1BuEaX6AfH/NWT9fhqxNsP1p3B7E/rLOD2B/W1QHsKG4Z6Z4cssQFzA1J04ES9PEF5n7cda4K2yIu1eiU+xhHmarkCfbw+v4alkJIABlWOUoyCLhcG6IGSbcd5+wcNdnUcmzP8c4xGfoOFd7Ssmbk3ELOg8ArHQZ10SBdNQAZQVdBkq4epRkRcN+M66XAqMioyKjIqMio2KOiAzrSBcx1bMcFOGRYPH1YfDTljIt8WuTTIp8W+bT4+LTIuPjZcfFabxPZ8s6Wd7a8s+WdLe9seWfLO1ve3/eb9alspdjyzt+j+Xs0f4/m79HPf49mC8Ong0W2vDMuMi4yLjIuMi7ycZEt7/yf95e3aWx5Z8s7W97Z8s6Wd7a8s+WdLe98E4xvgvFNML4JduRNMLa8s+Wd74LxXTC+C8Z3wfguGOPiJ/6j1pP/vOMWCpjKNs+hjRi3V0SrIDdOaNpEUaPkhYTGZ+5MXW82nfTOSXaTd12VQPneK4fxraEvH+69jH/QAA5wn2ENc59hDXOfYX0cSXmLmxnj5CGtaVZS4tCacqBDmZ9ZETejy3g9+l4Vfvl2xzL+/srIscS+jPKZnP/qX+b8Bf8y3tx2XdexPG9izWceu5vR7ma0/klxnFFjxeYsl8JsTV090D2FhznXnmgSJNmbaxJVkqcp1EJEoeIhCjUPUVGCQg1hFRNhxE7W5N2nbiiMS3gXkAaQJ8rPujAmvhWuGvFV+kEWojSjeIO8XfmrWIA6fUloegl5TSKMdtSehnB5ajWn19HS/BCaGvWX/PVoZmhEXFay8HN4q/LPdoydQh0z/nq/qDUpDvFFnPhtrkZXvvRX0q/T0bIqlcCJjxRIqJHawlREyqemmJYtlMFUFeRiyleS3LolCSnrBNrYCKBhXre9Mf1u0bMJNIMNoabalz/r8qESkw9xkJT4XWoNqwKYYK2AIMJeAbHkHwAAAP//AwBQSwECLQAUAAAACAAWZTNY29t6/hUEAADhTgAABAAAAAAAAAAAACAAAAAAAAAAc2ZkdFBLBQYAAAAAAQABADIAAAA3BAAAAAA=";
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

//     it('insert table paste insert column option', () => {
//         console.log('insert table paste insert column option');
//         let operations: Operation[] = [];
//         let addpaste: boolean = false;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             if (addpaste) {
//                 operations.push(...args.operations);
//             }
//         }
//         container.documentEditor.editorModule.insertTable(2, 2);
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;0;1;0;0", "0;0;0;1;0;0");
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;1;0;0;0", "0;0;1;0;0;0");
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;1;1;0;0", "0;0;1;1;0;0");
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;0;0;0;0", "0;0;0;0;0;0");
//         addpaste = true;
//         container.documentEditor.editorModule.pasteContents(HelperMethods.getSfdtDocument({ sfdt: pasteValue }));
//         expect(operations[0].action).toBe('Delete');
//         expect(operations[0].length).toBe(51);
//         expect(operations[0].offset).toBe(1);
//         expect(operations[1].action).toBe('Insert');
//         expect(operations[1].length).toBe(209);
//         expect(operations[1].offset).toBe(1);
//         expect(operations[1].pasteContent).toBeDefined();
//         operations = [];
//     });

//     it('insert table paste overwrite cell option', () => {
//         console.log('insert table paste overwrite cell option');
//         let operations: Operation[] = [];
//         let addpaste: boolean = false;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             if (addpaste) {
//                 operations.push(...args.operations);
//             }
//         }
//         container.documentEditor.openBlank();
//         container.documentEditor.editorModule.insertTable(2, 2);
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;0;1;0;0", "0;0;0;1;0;0");
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;1;0;0;0", "0;0;1;0;0;0");
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;1;1;0;0", "0;0;1;1;0;0");
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;1;0;0;0", "0;0;1;0;0;0");
//         addpaste = true;
//         container.documentEditor.editorModule.pasteContents(HelperMethods.getSfdtDocument({ sfdt: pasteValue }));
//         expect(operations[0].action).toBe('Delete');
//         expect(operations[0].length).toBe(51);
//         expect(operations[0].offset).toBe(1);
//         expect(operations[1].action).toBe('Insert');
//         expect(operations[1].length).toBe(182);
//         expect(operations[1].offset).toBe(1);
//         expect(operations[1].pasteContent).toBeDefined();
//         operations = [];
//     });

//     it('insert table paste option', () => {
//         console.log('insert table paste option');
//         let operations: Operation[] = [];
//         let addpaste: boolean = false;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             if (addpaste) {
//                 operations.push(...args.operations);
//             }
//         }
//         container.documentEditor.openBlank();
//         container.documentEditor.editorModule.insertTable(2, 2);
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;0;1;0;0", "0;0;0;1;0;0");
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;1;0;0;0", "0;0;1;0;0;0");
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;1;1;0;0", "0;0;1;1;0;0");
//         container.documentEditor.editorModule.insertText('Syncfusion');
//         container.documentEditor.selection.select("0;0;1;0;0;0", "0;0;1;0;0;0");
//         container.documentEditor.editorModule.pasteContents(HelperMethods.getSfdtDocument({ sfdt: pasteValue }));
//         addpaste = true;
//         container.documentEditor.editorModule.copiedTextContent = "Document editor	Document editor	Document editor Document editor	Document editor	Document editor Document editor	Document editor	Document editor";
//         container.documentEditor.editor.applyTablePasteOptions('InsertAsRows');
//         expect(operations[0].action).toBe('Delete');
//         expect(operations[0].length).toBe(182);
//         expect(operations[0].offset).toBe(1);
//         expect(operations[1].action).toBe('Insert');
//         expect(operations[1].length).toBe(51);
//         expect(operations[1].offset).toBe(1);
//         expect(operations[1].pasteContent).toBeDefined();
//         expect(operations[2].action).toBe('Delete');
//         expect(operations[2].length).toBe(51);
//         expect(operations[2].offset).toBe(1);
//         expect(operations[3].action).toBe('Insert');
//         expect(operations[3].length).toBe(207);
//         expect(operations[3].offset).toBe(1);
//         expect(operations[3].pasteContent).toBeDefined();
//         operations = [];
//         container.documentEditor.editor.applyTablePasteOptions('OverwriteCells');
//         expect(operations[0].action).toBe('Delete');
//         expect(operations[0].length).toBe(207);
//         expect(operations[0].offset).toBe(1);
//         expect(operations[1].action).toBe('Insert');
//         expect(operations[1].length).toBe(51);
//         expect(operations[1].offset).toBe(1);
//         expect(operations[1].pasteContent).toBeDefined();
//         expect(operations[2].action).toBe('Delete');
//         expect(operations[2].length).toBe(51);
//         expect(operations[2].offset).toBe(1);
//         expect(operations[3].action).toBe('Insert');
//         expect(operations[3].length).toBe(182);
//         expect(operations[3].offset).toBe(1);
//         expect(operations[3].pasteContent).toBeDefined();
//         operations = [];
//         container.documentEditor.editor.applyTablePasteOptions('NestTable');
//         expect(operations[0].action).toBe('Delete');
//         expect(operations[0].length).toBe(182);
//         expect(operations[0].offset).toBe(1);
//         expect(operations[1].action).toBe('Insert');
//         expect(operations[1].length).toBe(51);
//         expect(operations[1].offset).toBe(1);
//         expect(operations[1].pasteContent).toBeDefined();
//         expect(operations[2].action).toBe('Insert');
//         expect(operations[2].length).toBe(157);
//         expect(operations[2].offset).toBe(29);
//         expect(operations[2].pasteContent).toBeDefined();
//         addpaste = false;
//     });
// });