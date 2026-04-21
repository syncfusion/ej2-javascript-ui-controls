// import {Selection, WCharacterFormat, WParagraphFormat, WSectionFormat, WTableFormat, WRowFormat, WCellFormat, DocumentEditor, Editor, EditorHistory, CollaborativeEditingHandler, SfdtExport } from '../../../src/index';
// import { createElement } from '@syncfusion/ej2-base';
// import { TestHelper } from '../../test-helper.spec';
// /**
//  * Formatting Collaborative editing spec
//  */
// describe('Formatting in collaborative editing', () => {
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

//     it('Undo/Redo character formatting', () => {
//         console.log('Undo/Redo character formatting');
//         editor.editorModule.insertText('Syncfusion Software');
//         editor.selection.select('0;0;4', '0;0;10');
//         editor.selection.characterFormat.bold = true;
//         expect(editor.testingOPeration[0].type).toBe("CharacterFormat");
//         expect(editor.testingOPeration[0].format).toBe("{\"bold\":true}");
//         editor.editorHistory.undo();
//         let format: WCharacterFormat = new WCharacterFormat(undefined);
//         let characterFormat: any = JSON.parse(editor.testingOPeration[0].format);
//         editor.documentHelper.owner.parser.parseCharacterFormat(0, characterFormat, format);
//         expect(format.bold).toBe(false);
//         editor.editorHistory.redo();
//         characterFormat = JSON.parse(editor.testingOPeration[0].format);
//         editor.documentHelper.owner.parser.parseCharacterFormat(0, characterFormat, format);
//         expect(format.bold).toBe(true);
//     });

//     it('Undo/Redo paragraph formatting', () => {
//         console.log('Undo/Redo paragraph formatting');
//         editor.openBlank();
//         editor.editorModule.insertText('Syncfusion Software');
//         editor.selection.select('0;0;4', '0;0;4');
//         editor.selection.paragraphFormat.textAlignment = "Center";
//         expect(editor.testingOPeration[0].type).toBe("ParagraphFormat");
//         expect(editor.testingOPeration[0].format).toBe("{\"textAlignment\":\"Center\"}");
//         editor.editorHistory.undo();
//         let format: WParagraphFormat = new WParagraphFormat(undefined);
//         editor.documentHelper.owner.parser.parseParagraphFormat(0, JSON.parse(editor.testingOPeration[0].format), format);
//         expect(format.textAlignment).toBe("Left");
//         editor.editorHistory.redo();
//         editor.documentHelper.owner.parser.parseParagraphFormat(0, JSON.parse(editor.testingOPeration[0].format), format);
//         expect(format.textAlignment).toBe("Center");
//     });

//     it('Undo/Redo Section formatting', () => {
//         console.log('Undo/Redo Section formatting');
//         editor.openBlank();
//         editor.editorModule.insertText('Syncfusion Software');
//         editor.selection.sectionFormat.topMargin = 108;
//         expect(editor.testingOPeration[0].type).toBe("SectionFormat");
//         expect(editor.testingOPeration[0].format).toBe("{\"topMargin\":108}");
//         editor.editorHistory.undo();
//         let sectionFormat: WSectionFormat = new WSectionFormat();
//         editor.documentHelper.owner.parser.parseSectionFormat(0, JSON.parse(editor.testingOPeration[0].format), sectionFormat);
//         expect(sectionFormat.topMargin).toBe(72);
//         editor.editorHistory.redo();
//         sectionFormat = new WSectionFormat();
//         editor.documentHelper.owner.parser.parseSectionFormat(0, JSON.parse(editor.testingOPeration[0].format), sectionFormat);
//         expect(sectionFormat.topMargin).toBe(108);
//     });

//     it('Undo/Redo Table formatting', () => {
//         console.log('Undo/Redo Table formatting');
//         editor.openBlank();
//         editor.editorModule.insertTable(2, 2);
//         editor.selection.tableFormat.leftIndent = 30;
//         expect(editor.testingOPeration[0].offset).toBe(1);
//         expect(editor.testingOPeration[0].type).toBe("TableFormat");
//         expect(editor.testingOPeration[0].format).toBe("{\"leftIndent\":30}");
//         editor.editorHistory.undo();
//         let tableFormat: WTableFormat = new WTableFormat();
//         editor.documentHelper.owner.parser.parseTableFormat(JSON.parse(editor.testingOPeration[0].format), tableFormat, 0);
//         expect(tableFormat.leftIndent).toBe(0);
//         editor.editorHistory.redo();
//         editor.documentHelper.owner.parser.parseTableFormat(JSON.parse(editor.testingOPeration[0].format), tableFormat, 0);
//         expect(tableFormat.leftIndent).toBe(30);
//     });

//     it('Undo/Redo Row formatting', () => {
//         console.log('Undo/Redo Row formatting');
//         editor.openBlank();
//         editor.editorModule.insertTable(2, 2);
//         editor.selection.rowFormat.heightType = 'AtLeast';
//         editor.selection.rowFormat.height = 30;
//         expect(editor.testingOPeration[0].offset).toBe(4);
//         expect(editor.testingOPeration[0].type).toBe("RowFormat");
//         expect(editor.testingOPeration[0].format).toBe("{\"height\":30}");
//         editor.editorHistory.undo();
//         let rowFormat: WRowFormat = new WRowFormat();
//         editor.documentHelper.owner.parser.parseRowFormat(JSON.parse(editor.testingOPeration[0].format), rowFormat, 0);
//         expect(rowFormat.height).toBe(0);
//         editor.editorHistory.redo();
//         editor.documentHelper.owner.parser.parseRowFormat(JSON.parse(editor.testingOPeration[0].format), rowFormat, 0);
//         expect(rowFormat.height).toBe(30);
//     });

//     it('Undo/Redo Cell formatting', () => {
//         console.log('Undo/Redo Cell formatting');
//         editor.openBlank();
//         editor.editorModule.insertTable(2, 2);
//         editor.selection.cellFormat.preferredWidth = 300;
//         expect(editor.testingOPeration[0].offset).toBe(3);
//         expect(editor.testingOPeration[0].type).toBe("CellFormat");
//         expect(editor.testingOPeration[0].format).toBe("{\"preferredWidth\":300}");
//         editor.editorHistory.undo();
//         expect(editor.testingOPeration[0].format).toBe("{\"preferredWidth\":234}");
//         editor.editorHistory.redo();
//         expect(editor.testingOPeration[0].format).toBe("{\"preferredWidth\":300}");
//     });
// });