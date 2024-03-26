// import { DocumentEditorContainer, ContainerContentChangeEventArgs, DocumentEditor, ActionInfo, CONTROL_CHARACTERS, TableWidget, TableRowWidget, TableCellWidget, CollaborativeEditingHandler } from '../../../src/index';
// import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
// import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
// /**
//  * Apply remote action Collaborative editing spec
//  */
// describe('Apply remote action in collaborative editing', () => {
//     let container: DocumentEditorContainer;
//     let element: HTMLElement;
//     let args: ContainerContentChangeEventArgs;
//     beforeAll(() => {
//         DocumentEditor.Inject(CollaborativeEditingHandler);
//         element = createElement('div');
//         document.body.appendChild(element);
//         DocumentEditorContainer.Inject(Toolbar);
//         container = new DocumentEditorContainer();
//         container.appendTo(element);
//         container.documentEditor.enableCollaborativeEditing = true;
//     });
//     afterAll(() => {
//         container.destroy();
//         expect(element.childNodes.length).toBe(0);
//         document.body.removeChild(element);
//         expect(() => { container.destroy(); }).not.toThrowError();
//         document.body.innerHTML = '';
//         element = undefined;
//         container = undefined;
//     });

//     it('Apply Remote action as row', () => {
//         console.log('Insert Row in romote action');
//         let argsEle: ContainerContentChangeEventArgs;
//         container.contentChange = function (args: ContainerContentChangeEventArgs) {
//             if (args.operations.length > 0) {
//                 argsEle = args;
//             }
//         }
//         const actions: ActionInfo = { "currentUser": "Mugunthan Anbalagan", "roomName": "Paragraph Formatting.docx", "connectionId": "_3ET94I_P_UjEeJDbGAuLQ", "version": 1, "operations": [{ "action": "Insert", "offset": 5, "text": "\u0013", "length": 1, "skipOperation": false, "format": "{\"height\":0,\"allowBreakAcrossPages\":true,\"heightType\":\"Auto\",\"isHeader\":false,\"borders\":{\"top\":{},\"left\":{},\"right\":{},\"bottom\":{},\"diagonalDown\":{},\"diagonalUp\":{},\"horizontal\":{},\"vertical\":{}},\"gridBefore\":0,\"gridBeforeWidth\":0,\"gridBeforeWidthType\":\"Point\",\"gridAfter\":0,\"gridAfterWidth\":0,\"gridAfterWidthType\":\"Point\",\"leftIndent\":0}" }, { "action": "Insert", "offset": 5, "text": "\u0014", "type": "CellFormat", "length": 1, "skipOperation": false, "format": "{\"borders\":{\"top\":{},\"left\":{},\"right\":{},\"bottom\":{},\"diagonalDown\":{},\"diagonalUp\":{},\"horizontal\":{},\"vertical\":{}},\"shading\":{},\"preferredWidth\":111.475,\"preferredWidthType\":\"Point\",\"cellWidth\":111.475,\"columnSpan\":1,\"rowSpan\":1,\"verticalAlignment\":\"Top\"}" }, { "action": "Insert", "offset": 5, "text": "\u0014", "type": "ParagraphFormat", "length": 1, "skipOperation": false, "format": "{\"borders\":{\"top\":{},\"left\":{},\"right\":{},\"bottom\":{},\"horizontal\":{},\"vertical\":{}},\"leftIndent\":0,\"rightIndent\":0,\"firstLineIndent\":0,\"textAlignment\":\"Left\",\"beforeSpacing\":0,\"afterSpacing\":0,\"spaceBeforeAuto\":false,\"spaceAfterAuto\":false,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"styleName\":\"Normal\",\"outlineLevel\":\"BodyText\",\"bidi\":false,\"keepLinesTogether\":false,\"keepWithNext\":false,\"contextualSpacing\":false,\"widowControl\":true}" }, { "action": "Insert", "offset": 5, "text": "\u0014", "type": "CharacterFormat", "length": 0, "skipOperation": false, "format": "{\"bold\":false,\"italic\":false,\"fontSize\":12,\"fontFamily\":\"Times New Roman\",\"underline\":\"None\",\"strikethrough\":\"None\",\"baselineAlignment\":\"Normal\",\"highlightColor\":\"NoColor\",\"fontColor\":\"#00000000\",\"bidi\":false,\"bdo\":\"None\",\"boldBidi\":false,\"italicBidi\":false,\"fontSizeBidi\":12,\"fontFamilyBidi\":\"Times New Roman\",\"allCaps\":false,\"localeIdBidi\":1025,\"complexScript\":false,\"fontFamilyAscii\":\"Times New Roman\",\"fontFamilyNonFarEast\":\"Times New Roman\",\"fontFamilyFarEast\":\"Times New Roman\",\"characterSpacing\":0,\"scaling\":100}" }, { "action": "Insert", "offset": 5, "text": "\u0014", "type": "CellFormat", "length": 1, "skipOperation": false, "format": "{\"borders\":{\"top\":{},\"left\":{},\"right\":{},\"bottom\":{},\"diagonalDown\":{},\"diagonalUp\":{},\"horizontal\":{},\"vertical\":{}},\"shading\":{},\"preferredWidth\":111.475,\"preferredWidthType\":\"Point\",\"cellWidth\":111.475,\"columnSpan\":1,\"rowSpan\":1,\"verticalAlignment\":\"Top\"}" }, { "action": "Insert", "offset": 5, "text": "\u0014", "type": "ParagraphFormat", "length": 1, "skipOperation": false, "format": "{\"borders\":{\"top\":{},\"left\":{},\"right\":{},\"bottom\":{},\"horizontal\":{},\"vertical\":{}},\"leftIndent\":0,\"rightIndent\":0,\"firstLineIndent\":0,\"textAlignment\":\"Left\",\"beforeSpacing\":0,\"afterSpacing\":0,\"spaceBeforeAuto\":false,\"spaceAfterAuto\":false,\"lineSpacing\":1,\"lineSpacingType\":\"Multiple\",\"styleName\":\"Normal\",\"outlineLevel\":\"BodyText\",\"bidi\":false,\"keepLinesTogether\":false,\"keepWithNext\":false,\"contextualSpacing\":false,\"widowControl\":true}" }, { "action": "Insert", "offset": 5, "text": "\u0014", "type": "CharacterFormat", "length": 0, "skipOperation": false, "format": "{\"bold\":false,\"italic\":false,\"fontSize\":12,\"fontFamily\":\"Times New Roman\",\"underline\":\"None\",\"strikethrough\":\"None\",\"baselineAlignment\":\"Normal\",\"highlightColor\":\"NoColor\",\"fontColor\":\"#00000000\",\"bidi\":false,\"bdo\":\"None\",\"boldBidi\":false,\"italicBidi\":false,\"fontSizeBidi\":12,\"fontFamilyBidi\":\"Times New Roman\",\"allCaps\":false,\"localeIdBidi\":1025,\"complexScript\":false,\"fontFamilyAscii\":\"Times New Roman\",\"fontFamilyNonFarEast\":\"Times New Roman\",\"fontFamilyFarEast\":\"Times New Roman\",\"characterSpacing\":0,\"scaling\":100}" }] };
//         container.documentEditor.editorModule.insertTable(2, 2);
//         container.documentEditor.editorModule.insertTable(2, 2);
//         //Inserting row in nested table
//         let connections: CollaborativeEditingHandler;
//         if (isNullOrUndefined(container.documentEditor.collaborativeEditingHandlerModule)) {
//             connections = new CollaborativeEditingHandler(container.documentEditor);
//         }
//         connections.applyRemoteAction('action', actions);
//         expect(((((container.documentEditor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as TableWidget).childWidgets.length).toBe(3);
//     });
// });