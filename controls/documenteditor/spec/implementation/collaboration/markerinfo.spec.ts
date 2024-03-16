// import { DocumentEditorContainer, ContainerContentChangeEventArgs, CONTROL_CHARACTERS, FormField, DropDownFormField, CheckBoxFormField, TextFormField, ActionInfo, CollaborativeEditingHandler, ParagraphWidget, LineWidget, EditRangeEndElementBox, EditRangeStartElementBox } from '../../../src/index';
// import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
// import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
// /**
//  * insert text
//  */
// describe('Insert Marker Info', () => {
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

//     it('insert hyperlink operation', () => {
//         console.log('insert hyperlink operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.openBlank();
//         container.documentEditor.editorModule.insertText('Syncfusion Software');
//         container.documentEditor.selection.select('0;0;2', '0;0;10');
//         container.documentEditor.editor.insertHyperlinkInternal("http://www.google.com", "ncfusion", true, false);
//         expect(argsEle.operations.length).toBe(6);
//         //Delete operation
//         expect(argsEle.operations[0].action).toBe('Delete');
//         expect(argsEle.operations[0].length).toBe(8);
//         expect(argsEle.operations[0].offset).toBe(3);
//         //field start operation
//         expect(argsEle.operations[1].action).toBe('Insert');
//         expect(argsEle.operations[1].length).toBe(1);
//         expect(argsEle.operations[1].offset).toBe(3);
//         expect(argsEle.operations[1].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//         expect(argsEle.operations[1].markerData.type).toBe('Field');
//         //insert hyperlink
//         expect(argsEle.operations[2].action).toBe('Insert');
//         expect(argsEle.operations[2].length).toBe(35);
//         expect(argsEle.operations[2].offset).toBe(4);
//         //insert field sepertator
//         expect(argsEle.operations[3].action).toBe('Insert');
//         expect(argsEle.operations[3].length).toBe(1);
//         expect(argsEle.operations[3].offset).toBe(39);
//         expect(argsEle.operations[3].text).toBe(CONTROL_CHARACTERS.Field_Separator);
//         expect(argsEle.operations[3].markerData.type).toBe('Field');
//         //insert deleted text
//         expect(argsEle.operations[4].action).toBe('Insert');
//         expect(argsEle.operations[4].length).toBe(8);
//         expect(argsEle.operations[4].offset).toBe(40);
//         expect(argsEle.operations[4].text).toBe('ncfusion');
//         //field delete operation
//         expect(argsEle.operations[5].action).toBe('Insert');
//         expect(argsEle.operations[5].length).toBe(1);
//         expect(argsEle.operations[5].offset).toBe(48);
//         expect(argsEle.operations[5].text).toBe(CONTROL_CHARACTERS.Marker_End);
//         expect(argsEle.operations[5].markerData.type).toBe('Field');
//     });

//     // it('remove hyperlink operation', () => {
//     //     console.log('remove hyperlink operation');
//     //     let argsEle: ContainerContentChangeEventArgs;
//     //     container.contentChange = function (args: ContainerContentChangeEventArgs) {
//     //         argsEle = args;
//     //     }

//     //     container.documentEditor.selection.select('0;0;42', '0;0;42');
//     //     container.documentEditor.editor.removeHyperlink();
//     //     //Remove field end
//     //     expect(argsEle.operations[0].action).toBe('Delete');
//     //     expect(argsEle.operations[0].length).toBe(1);
//     //     expect(argsEle.operations[0].offset).toBe(48);
//     //     //Remove undeline format
//     //     expect(argsEle.operations[1].action).toBe('Format');
//     //     expect(argsEle.operations[1].length).toBe(8);
//     //     expect(argsEle.operations[1].offset).toBe(40);
//     //     expect(JSON.parse(argsEle.operations[1].format).underline).toBe('None');
//     //     //Remove font color
//     //     expect(argsEle.operations[2].action).toBe('Format');
//     //     expect(argsEle.operations[2].length).toBe(8);
//     //     expect(argsEle.operations[2].offset).toBe(40);
//     //     expect(JSON.parse(argsEle.operations[2].format).fontColor).toBe('#00000000');
//     //     // Clear format
//     //     expect(argsEle.operations[3].action).toBe('Format');
//     //     expect(argsEle.operations[3].length).toBe(8);
//     //     expect(argsEle.operations[3].offset).toBe(40);
//     //     //Remove field start, seperator and hyperlink
//     //     expect(argsEle.operations[4].action).toBe('Delete');
//     //     expect(argsEle.operations[4].length).toBe(37);
//     //     expect(argsEle.operations[4].offset).toBe(3);

//     // });

//     // it('insert and remove text form field operation', () => {
//     //     console.log('insert and remove text form field operation');
//     //     let argsEle: ContainerContentChangeEventArgs;
//     //     container.contentChange = function (args: ContainerContentChangeEventArgs) {
//     //         argsEle = args;
//     //     }
//     //     container.documentEditor.openBlank();
//     //     container.documentEditor.editorModule.insertText('Syncfusion Software');
//     //     container.documentEditor.selection.select('0;0;4', '0;0;4');
//     //     container.documentEditor.editor.insertFormField('Text');
//     //     //insert field start
//     //     expect(argsEle.operations[0].action).toBe('Insert');
//     //     expect(argsEle.operations[0].length).toBe(1);
//     //     expect(argsEle.operations[0].offset).toBe(5);
//     //     expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//     //     expect(argsEle.operations[0].markerData.formFieldData).toBeDefined();
//     //     //insert bookmark start
//     //     expect(argsEle.operations[1].action).toBe('Insert');
//     //     expect(argsEle.operations[1].length).toBe(1);
//     //     expect(argsEle.operations[1].offset).toBe(6);
//     //     let bookmarkStartValue: boolean = argsEle.operations[1].markerData.bookmarkName === 'Text1' && argsEle.operations[1].markerData.type === 'Bookmark';
//     //     expect(bookmarkStartValue).toBe(true);
//     //     //insert form text
//     //     expect(argsEle.operations[2].action).toBe('Insert');
//     //     expect(argsEle.operations[2].length).toBe(8);
//     //     expect(argsEle.operations[2].offset).toBe(7);
//     //     expect(argsEle.operations[2].text).toBe('FORMTEXT');
//     //     //insert field seperator
//     //     expect(argsEle.operations[3].action).toBe('Insert');
//     //     expect(argsEle.operations[3].length).toBe(1);
//     //     expect(argsEle.operations[3].offset).toBe(15);
//     //     expect(argsEle.operations[3].text).toBe(CONTROL_CHARACTERS.Field_Separator);
//     //     expect(argsEle.operations[3].markerData.type).toBe('Field');
//     //     //insert space text
//     //     expect(argsEle.operations[4].action).toBe('Insert');
//     //     expect(argsEle.operations[4].length).toBe(5);
//     //     expect(argsEle.operations[4].offset).toBe(16);
//     //     //insert field end
//     //     expect(argsEle.operations[5].action).toBe('Insert');
//     //     expect(argsEle.operations[5].length).toBe(1);
//     //     expect(argsEle.operations[5].offset).toBe(21);
//     //     expect(argsEle.operations[5].text).toBe(CONTROL_CHARACTERS.Marker_End);
//     //     expect(argsEle.operations[5].markerData.type).toBe('Field');
//     //     //insert bookmark end
//     //     expect(argsEle.operations[6].action).toBe('Insert');
//     //     expect(argsEle.operations[6].length).toBe(1);
//     //     expect(argsEle.operations[6].offset).toBe(22);
//     //     let bookmarkEndValue: boolean = argsEle.operations[6].markerData.bookmarkName === 'Text1' && argsEle.operations[6].markerData.type === 'Bookmark';
//     //     expect(bookmarkEndValue).toBe(true);

//     //     //Delete text form field operation
//     //     container.documentEditor.selection.select('0;0;4', '0;0;22');
//     //     container.documentEditor.editor.onBackSpace();
//     //     expect(argsEle.operations[0].action).toBe('Delete');
//     //     expect(argsEle.operations[0].length).toBe(18);
//     //     expect(argsEle.operations[0].offset).toBe(5);
//     // });

//     it('insert and remove checkbox form field operation', () => {
//         console.log('insert and remove checkbox form field operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.selection.select('0;0;4', '0;0;4');
//         container.documentEditor.editor.insertFormField('CheckBox');
//         //insert field start
//         expect(argsEle.operations[0].action).toBe('Insert');
//         expect(argsEle.operations[0].length).toBe(1);
//         expect(argsEle.operations[0].offset).toBe(5);
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//         expect(argsEle.operations[0].markerData.formFieldData).toBeDefined();
//         //insert bookmark start
//         expect(argsEle.operations[1].action).toBe('Insert');
//         expect(argsEle.operations[1].length).toBe(1);
//         expect(argsEle.operations[1].offset).toBe(6);
//         let bookmarkStartValue: boolean = argsEle.operations[1].markerData.bookmarkName === 'CheckBox1' && argsEle.operations[1].markerData.type === 'Bookmark';
//         expect(bookmarkStartValue).toBe(true);
//         //insert form check box
//         expect(argsEle.operations[2].action).toBe('Insert');
//         expect(argsEle.operations[2].length).toBe(12);
//         expect(argsEle.operations[2].offset).toBe(7);
//         expect(argsEle.operations[2].text).toBe('FORMCHECKBOX');
//         //insert field seperator
//         expect(argsEle.operations[3].action).toBe('Insert');
//         expect(argsEle.operations[3].length).toBe(1);
//         expect(argsEle.operations[3].offset).toBe(19);
//         expect(argsEle.operations[3].text).toBe(CONTROL_CHARACTERS.Field_Separator);
//         expect(argsEle.operations[3].markerData.type).toBe('Field');
//         //insert check box
//         expect(argsEle.operations[4].action).toBe('Insert');
//         expect(argsEle.operations[4].length).toBe(1);
//         expect(argsEle.operations[4].offset).toBe(20);
//         //insert field end
//         expect(argsEle.operations[5].action).toBe('Insert');
//         expect(argsEle.operations[5].length).toBe(1);
//         expect(argsEle.operations[5].offset).toBe(21);
//         expect(argsEle.operations[5].text).toBe(CONTROL_CHARACTERS.Marker_End);
//         expect(argsEle.operations[5].markerData.type).toBe('Field');
//         //insert bookmark end
//         expect(argsEle.operations[6].action).toBe('Insert');
//         expect(argsEle.operations[6].length).toBe(1);
//         expect(argsEle.operations[6].offset).toBe(22);
//         let bookmarkEndValue: boolean = argsEle.operations[6].markerData.bookmarkName === 'CheckBox1' && argsEle.operations[6].markerData.type === 'Bookmark';
//         expect(bookmarkEndValue).toBe(true);

//         //Delete checkbox form field operation
//         container.documentEditor.selection.select('0;0;4', '0;0;22');
//         container.documentEditor.editor.onBackSpace();
//         expect(argsEle.operations[0].action).toBe('Delete');
//         expect(argsEle.operations[0].length).toBe(18);
//         expect(argsEle.operations[0].offset).toBe(5);
//     });

//     it('insert and remove dropdown form field operation', () => {
//         console.log('insert and remove dropdown form field operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.selection.select('0;0;4', '0;0;4');
//         container.documentEditor.editor.insertFormField('DropDown');
//         //insert field start
//         expect(argsEle.operations[0].action).toBe('Insert');
//         expect(argsEle.operations[0].length).toBe(1);
//         expect(argsEle.operations[0].offset).toBe(5);
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//         expect(argsEle.operations[0].markerData.formFieldData).toBeDefined();
//         //insert bookmark start
//         expect(argsEle.operations[1].action).toBe('Insert');
//         expect(argsEle.operations[1].length).toBe(1);
//         expect(argsEle.operations[1].offset).toBe(6);
//         let bookmarkStartValue: boolean = argsEle.operations[1].markerData.bookmarkName === 'DropDown1' && argsEle.operations[1].markerData.type === 'Bookmark';
//         expect(bookmarkStartValue).toBe(true);
//         //insert form check box
//         expect(argsEle.operations[2].action).toBe('Insert');
//         expect(argsEle.operations[2].length).toBe(12);
//         expect(argsEle.operations[2].offset).toBe(7);
//         expect(argsEle.operations[2].text).toBe('FORMDROPDOWN');
//         //insert field seperator
//         expect(argsEle.operations[3].action).toBe('Insert');
//         expect(argsEle.operations[3].length).toBe(1);
//         expect(argsEle.operations[3].offset).toBe(19);
//         expect(argsEle.operations[3].text).toBe(CONTROL_CHARACTERS.Field_Separator);
//         expect(argsEle.operations[3].markerData.type).toBe('Field');
//         //insert drop down text
//         expect(argsEle.operations[4].action).toBe('Insert');
//         expect(argsEle.operations[4].length).toBe(5);
//         expect(argsEle.operations[4].offset).toBe(20);
//         //insert field end
//         expect(argsEle.operations[5].action).toBe('Insert');
//         expect(argsEle.operations[5].length).toBe(1);
//         expect(argsEle.operations[5].offset).toBe(25);
//         expect(argsEle.operations[5].text).toBe(CONTROL_CHARACTERS.Marker_End);
//         expect(argsEle.operations[5].markerData.type).toBe('Field');
//         //insert bookmark end
//         expect(argsEle.operations[6].action).toBe('Insert');
//         expect(argsEle.operations[6].length).toBe(1);
//         expect(argsEle.operations[6].offset).toBe(26);
//         let bookmarkEndValue: boolean = argsEle.operations[6].markerData.bookmarkName === 'DropDown1' && argsEle.operations[6].markerData.type === 'Bookmark';
//         expect(bookmarkEndValue).toBe(true);

//         //Delete Dropdown form field operation
//         container.documentEditor.selection.select('0;0;4', '0;0;26');
//         container.documentEditor.editor.onBackSpace();
//         expect(argsEle.operations[0].action).toBe('Delete');
//         expect(argsEle.operations[0].length).toBe(22);
//         expect(argsEle.operations[0].offset).toBe(5);
//     });

//     it('insert value operation of form field', () => {
//         console.log('insert value operation of form field');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.selection.select('0;0;12', '0;0;12');
//         container.documentEditor.editor.insertFormField('DropDown');
//         container.documentEditor.selection.select('0;0;8', '0;0;8');
//         container.documentEditor.editor.insertFormField('CheckBox');
//         container.documentEditor.selection.select('0;0;4', '0;0;4');
//         container.documentEditor.editor.insertFormField('Text');

//         //dropdown
//         container.documentEditor.selection.select('0;0;48', '0;0;70');
//         let dropDownField: DropDownFormField = new DropDownFormField();
//         dropDownField.dropdownItems = ['Company'];
//         dropDownField.selectedIndex = 0;
//         dropDownField.name = 'DropDown1';
//         dropDownField.helpText = '';
//         dropDownField.enabled = true;
//         container.documentEditor.editor.editFormField('DropDown', dropDownField);
//         expect(argsEle.operations.length).toBe(8);
//         expect(argsEle.operations[0].action).toBe('Delete');
//         expect(argsEle.operations[0].length).toBe(22);
//         expect(argsEle.operations[0].offset).toBe(49);
//         expect(argsEle.operations[5].action).toBe('Insert');
//         expect(argsEle.operations[5].length).toBe(7);
//         expect(argsEle.operations[5].offset).toBe(64);
//         expect(argsEle.operations[5].text).toBe('Company');

//         //Checkbox
//         container.documentEditor.selection.select('0;0;26', '0;0;44');
//         let checkBoxField: CheckBoxFormField = new CheckBoxFormField();
//         checkBoxField.defaultValue = true;
//         checkBoxField.name = 'CheckBox1';
//         checkBoxField.helpText = '';
//         checkBoxField.checked = true;
//         checkBoxField.enabled = true;
//         checkBoxField.sizeType = 'Auto';
//         checkBoxField.size = 11;
//         container.documentEditor.editor.editFormField('CheckBox', checkBoxField);
//         expect(argsEle.operations.length).toBe(8);
//         expect(argsEle.operations[0].action).toBe('Delete');
//         expect(argsEle.operations[0].length).toBe(18);
//         expect(argsEle.operations[0].offset).toBe(27);
//         expect((argsEle.operations[1].markerData.formFieldData as CheckBoxFormField).checked).toBe(true);
//         expect((argsEle.operations[1].markerData.formFieldData as CheckBoxFormField).name).toBe('CheckBox1');

//         //Input text
//         container.documentEditor.selection.select('0;0;4', '0;0;22');
//         let formField: TextFormField = new TextFormField();
//         formField.type = 'Text';
//         formField.defaultValue = 'Company';
//         formField.maxLength = 0;
//         formField.format = '';
//         formField.name = 'Text1';
//         formField.helpText = '';
//         formField.enabled = true;
//         container.documentEditor.editor.editFormField('Text', formField);
//         expect(argsEle.operations.length).toBe(8);
//         expect(argsEle.operations[0].action).toBe('Delete');
//         expect(argsEle.operations[0].length).toBe(18);
//         expect(argsEle.operations[0].offset).toBe(5);
//         expect((argsEle.operations[1].markerData.formFieldData as TextFormField).defaultValue).toBe('Company');
//         expect((argsEle.operations[1].markerData.formFieldData as TextFormField).name).toBe('Text1');
//     });
// });

// describe('Insert Marker Info bookmark', () => {
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

//     it('insert bookmark operation', () => {
//         console.log('insert bookmark operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.openBlank();
//         container.documentEditor.editorModule.insertText('Syncfusion Software');
//         container.documentEditor.selection.select('0;0;2', '0;0;10');
//         container.documentEditor.editor.insertBookmark('Company');
//         expect(argsEle.operations[0].action).toBe('Insert');
//         expect(argsEle.operations[0].length).toBe(1);
//         expect(argsEle.operations[0].offset).toBe(3);
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//         expect(argsEle.operations[0].markerData.bookmarkName).toBe('Company');
//         expect(argsEle.operations[0].markerData.type).toBe('Bookmark');
//         expect(argsEle.operations[1].action).toBe('Insert');
//         expect(argsEle.operations[1].length).toBe(1);
//         expect(argsEle.operations[1].offset).toBe(12);
//         expect(argsEle.operations[1].text).toBe(CONTROL_CHARACTERS.Marker_End);
//         expect(argsEle.operations[1].markerData.bookmarkName).toBe('Company');
//         expect(argsEle.operations[1].markerData.type).toBe('Bookmark');
//     });

//     it('delete bookmark operation', () => {
//         console.log('delete bookmark operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.editor.deleteBookmark('Company');
//         expect(argsEle.operations[0].action).toBe('Delete');
//         expect(argsEle.operations[0].length).toBe(1);
//         expect(argsEle.operations[0].offset).toBe(4);
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//         expect(argsEle.operations[0].markerData.bookmarkName).toBe('Company');
//         expect(argsEle.operations[1].action).toBe('Delete');
//         expect(argsEle.operations[1].length).toBe(1);
//         expect(argsEle.operations[1].offset).toBe(12);
//         expect(argsEle.operations[1].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//         expect(argsEle.operations[1].markerData.bookmarkName).toBe('Company');
//     });
// });

// describe('Insert Marker Info comment', () => {
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

//     it('insert comment operation', () => {
//         console.log('insert comment operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.openBlank();
//         container.documentEditor.editorModule.insertText('Syncfusion Software');
//         container.documentEditor.selection.select('0;0;2', '0;0;10');
//         container.documentEditor.editor.insertComment('Company');
//         expect(argsEle.operations[0].action).toBe('Insert');
//         expect(argsEle.operations[0].length).toBe(1);
//         expect(argsEle.operations[0].offset).toBe(3);
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//         expect(argsEle.operations[0].markerData.commentId).toBeDefined();
//         expect(argsEle.operations[0].markerData.type).toBe('Comment');
//         expect(argsEle.operations[1].action).toBe('Insert');
//         expect(argsEle.operations[1].length).toBe(1);
//         expect(argsEle.operations[1].offset).toBe(12);
//         expect(argsEle.operations[1].text).toBe(CONTROL_CHARACTERS.Marker_End);
//         expect(argsEle.operations[1].markerData.commentId).toBeDefined();
//         expect(argsEle.operations[1].markerData.type).toBe('Comment');
//         expect(argsEle.operations[2].action).toBe('Update');
//         expect(argsEle.operations[2].text).toBe(CONTROL_CHARACTERS.Marker_Start + CONTROL_CHARACTERS.Marker_End);
//         expect(argsEle.operations[2].markerData.commentId).toBeDefined();
//         expect(argsEle.operations[2].markerData.commentAction).toBe('add');
//         expect(argsEle.operations[2].markerData.text).toBe('Company');
//         expect(argsEle.operations[2].markerData.type).toBe('Comment');
//     });

//     it('delete comment operation', () => {
//         console.log('delete comment operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.editor.deleteCommentInternal(container.documentEditor.documentHelper.comments[0]);
//         expect(argsEle.operations[0].action).toBe('Update');
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start + CONTROL_CHARACTERS.Marker_End);
//         expect(argsEle.operations[0].markerData.commentId).toBeDefined();
//         expect(argsEle.operations[0].markerData.commentAction).toBe('remove');
//         expect(argsEle.operations[0].markerData.text).toBe('Company');
//         expect(argsEle.operations[0].markerData.type).toBe('Comment');
//         expect(argsEle.operations[1].action).toBe('Delete');
//         expect(argsEle.operations[1].length).toBe(1);
//         expect(argsEle.operations[1].offset).toBe(12);
//         expect(argsEle.operations[1].text).toBe(CONTROL_CHARACTERS.Marker_End);
//         expect(argsEle.operations[1].markerData.commentId).toBeDefined();
//         expect(argsEle.operations[2].action).toBe('Delete');
//         expect(argsEle.operations[2].length).toBe(1);
//         expect(argsEle.operations[2].offset).toBe(3);
//         expect(argsEle.operations[2].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//         expect(argsEle.operations[2].markerData.commentId).toBeDefined();
//     });

//     it('insert edit range operation', () => {
//         console.log('insert edit range operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.editorModule.insertText('Syncfusion Software');
//         container.documentEditor.selection.select('0;0;2', '0;0;10');
//         container.documentEditor.editor.insertEditRangeElement('Everyone');
//         expect(argsEle.operations[0].action).toBe('Insert');
//         expect(argsEle.operations[0].length).toBe(1);
//         expect(argsEle.operations[0].offset).toBe(3);
//         expect(argsEle.operations[0].markerData.type).toBe('EditRange');
//         expect(argsEle.operations[0].markerData.user).toBe('Everyone');
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//         expect(argsEle.operations[1].length).toBe(1);
//         expect(argsEle.operations[1].offset).toBe(12);
//         expect(argsEle.operations[1].markerData.type).toBe('EditRange');
//         expect(argsEle.operations[1].markerData.user).toBe('Everyone');
//         expect(argsEle.operations[1].text).toBe(CONTROL_CHARACTERS.Marker_End);
//     });

//     it('delete edit range operation', () => {
//         console.log('delete edit range operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.selection.select('0;0;4', '0;0;4');
//         container.documentEditor.editor.removeUserRestrictions('Everyone');
//         expect(argsEle.operations[0].action).toBe('Delete');
//         expect(argsEle.operations[0].length).toBe(1);
//         expect(argsEle.operations[0].offset).toBe(4);
//         expect(argsEle.operations[0].markerData.type).toBe('EditRange');
//         expect(argsEle.operations[0].markerData.user).toBe('Everyone');
//         expect(argsEle.operations[0].text).toBe(CONTROL_CHARACTERS.Marker_Start);
//         expect(argsEle.operations[1].length).toBe(1);
//         expect(argsEle.operations[1].offset).toBe(12);
//         expect(argsEle.operations[1].markerData.type).toBe('EditRange');
//         expect(argsEle.operations[1].markerData.user).toBe('Everyone');
//     });

//     it('sync insert edit range operation', () => {
//         console.log('sync insert edit range operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         container.documentEditor.openBlank();
//         container.documentEditor.editorModule.insertText('Syncfusion Software');
//         let action: ActionInfo = JSON.parse('{"currentUser":"Mugunthan Anbalagan","roomName":"Endnote.docx","connectionId":"d93YftCEG-Dke0TK5AYHvQ","version":1,"operations":[{"action":"Insert","offset":3,"text":"\\u0015","length":1,"skipOperation":false,"markerData":{"user":"Everyone","type":"EditRange","editRangeId":606161972,"columnFirst":"-1","columnLast":"-1"}},{"action":"Insert","offset":12,"text":"\\u0016","length":1,"skipOperation":false,"markerData":{"user":"Everyone","type":"EditRange","editRangeId":606161972,"columnFirst":"-1","columnLast":"-1"}}]}');
//         let connections: CollaborativeEditingHandler;
//         if (isNullOrUndefined(container.documentEditor.collaborativeEditingHandlerModule)) {
//             connections = new CollaborativeEditingHandler(container.documentEditor);
//         }
//         connections.applyRemoteAction('action', action);
//         let editStart: Boolean = ((container.documentEditor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] instanceof EditRangeStartElementBox;
//         let editEnd: Boolean = ((container.documentEditor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] instanceof EditRangeEndElementBox;
//         expect(editStart).toBe(true);
//         expect(editEnd).toBe(true);
//     });

//     it('sync delete edit range operation', () => {
//         console.log('sync delete edit range operation');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             argsEle = args;
//         }
//         let action: ActionInfo = JSON.parse('{"currentUser":"Mugunthan Anbalagan","roomName":"Endnote.docx","connectionId":"d93YftCEG-Dke0TK5AYHvQ","version":1,"operations":[{"action":"Delete","offset":4,"text":"\\u0015","length":1,"markerData":{"user":"Everyone","type":"EditRange","editRangeId":606161972,"columnFirst":"-1","columnLast":"-1"}},{"action":"Delete","offset":12,"text":"\\u0015","length":1,"markerData":{"user":"Everyone","type":"EditRange","editRangeId":606161972,"columnFirst":"-1","columnLast":"-1"}}]}');
//         let connections: CollaborativeEditingHandler;
//         if (isNullOrUndefined(container.documentEditor.collaborativeEditingHandlerModule)) {
//             connections = new CollaborativeEditingHandler(container.documentEditor);
//         }
//         connections.applyRemoteAction('action', action);
//         expect(((container.documentEditor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(4);
//     });

// });