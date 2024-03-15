import { DocumentEditorContainer, ContainerContentChangeEventArgs, WCharacterFormat, WParagraphFormat, WSectionFormat, WTableFormat, WRowFormat, WCellFormat } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
/**
 * Formatting Collaborative editing spec
 */
describe('Formatting in collaborative editing', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    let args: ContainerContentChangeEventArgs;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
        container.documentEditor.enableCollaborativeEditing = true;
    });
    afterAll(() => {
        expect(() => { container.destroy(); }).not.toThrowError();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });

    it('Undo/Redo character formatting', () => {
        console.log('Undo/Redo character formatting');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.selection.select('0;0;4', '0;0;10');
        container.documentEditor.selection.characterFormat.bold = true;
        expect(argsEle.operations[0].type).toBe("CharacterFormat");
        expect(argsEle.operations[0].format).toBe("{\"bold\":true}");
        container.documentEditor.editorHistory.undo();
        let format: WCharacterFormat = new WCharacterFormat(undefined);
        let characterFormat: any = JSON.parse(argsEle.operations[0].format);
        container.documentEditor.documentHelper.owner.parser.parseCharacterFormat(0, characterFormat, format);
        expect(format.bold).toBe(false);
        container.documentEditor.editorHistory.redo();
        characterFormat = JSON.parse(argsEle.operations[0].format);
        container.documentEditor.documentHelper.owner.parser.parseCharacterFormat(0, characterFormat, format);
        expect(format.bold).toBe(true);
    });

    it('Undo/Redo paragraph formatting', () => {
        console.log('Undo/Redo paragraph formatting');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        container.documentEditor.openBlank();
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.selection.select('0;0;4', '0;0;4');
        container.documentEditor.selection.paragraphFormat.textAlignment = "Center";
        expect(argsEle.operations[0].type).toBe("ParagraphFormat");
        expect(argsEle.operations[0].format).toBe("{\"textAlignment\":\"Center\"}");
        container.documentEditor.editorHistory.undo();
        let format: WParagraphFormat = new WParagraphFormat(undefined);
        container.documentEditor.documentHelper.owner.parser.parseParagraphFormat(0, JSON.parse(argsEle.operations[0].format), format);
        expect(format.textAlignment).toBe("Left");
        container.documentEditor.editorHistory.redo();
        container.documentEditor.documentHelper.owner.parser.parseParagraphFormat(0, JSON.parse(argsEle.operations[0].format), format);
        expect(format.textAlignment).toBe("Center");
    });

    it('Undo/Redo Section formatting', () => {
        console.log('Undo/Redo Section formatting');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        container.documentEditor.openBlank();
        container.documentEditor.editorModule.insertText('Syncfusion Software');
        container.documentEditor.selection.sectionFormat.topMargin = 108;
        expect(argsEle.operations[0].type).toBe("SectionFormat");
        expect(argsEle.operations[0].format).toBe("{\"topMargin\":108}");
        container.documentEditor.editorHistory.undo();
        let sectionFormat: WSectionFormat = new WSectionFormat();
        container.documentEditor.documentHelper.owner.parser.parseSectionFormat(0, JSON.parse(argsEle.operations[0].format), sectionFormat);
        expect(sectionFormat.topMargin).toBe(72);
        container.documentEditor.editorHistory.redo();
        sectionFormat = new WSectionFormat();
        container.documentEditor.documentHelper.owner.parser.parseSectionFormat(0, JSON.parse(argsEle.operations[0].format), sectionFormat);
        expect(sectionFormat.topMargin).toBe(108);
    });

    it('Undo/Redo Table formatting', () => {
        console.log('Undo/Redo Table formatting');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        container.documentEditor.openBlank();
        container.documentEditor.editorModule.insertTable(2, 2);
        container.documentEditor.selection.tableFormat.leftIndent = 30;
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe("TableFormat");
        expect(argsEle.operations[0].format).toBe("{\"leftIndent\":30}");
        container.documentEditor.editorHistory.undo();
        let tableFormat: WTableFormat = new WTableFormat();
        container.documentEditor.documentHelper.owner.parser.parseTableFormat(JSON.parse(argsEle.operations[0].format), tableFormat, 0);
        expect(tableFormat.leftIndent).toBe(0);
        container.documentEditor.editorHistory.redo();
        container.documentEditor.documentHelper.owner.parser.parseTableFormat(JSON.parse(argsEle.operations[0].format), tableFormat, 0);
        expect(tableFormat.leftIndent).toBe(30);
    });

    it('Undo/Redo Row formatting', () => {
        console.log('Undo/Redo Row formatting');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        container.documentEditor.openBlank();
        container.documentEditor.editorModule.insertTable(2, 2);
        container.documentEditor.selection.rowFormat.heightType = 'AtLeast';
        container.documentEditor.selection.rowFormat.height = 30;
        expect(argsEle.operations[0].offset).toBe(4);
        expect(argsEle.operations[0].type).toBe("RowFormat");
        expect(argsEle.operations[0].format).toBe("{\"height\":30}");
        container.documentEditor.editorHistory.undo();
        let rowFormat: WRowFormat = new WRowFormat();
        container.documentEditor.documentHelper.owner.parser.parseRowFormat(JSON.parse(argsEle.operations[0].format), rowFormat, 0);
        expect(rowFormat.height).toBe(0);
        container.documentEditor.editorHistory.redo();
        container.documentEditor.documentHelper.owner.parser.parseRowFormat(JSON.parse(argsEle.operations[0].format), rowFormat, 0);
        expect(rowFormat.height).toBe(30);
    });

    it('Undo/Redo Cell formatting', () => {
        console.log('Undo/Redo Cell formatting');
        let argsEle: ContainerContentChangeEventArgs;
        container.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
            }
        }
        container.documentEditor.openBlank();
        container.documentEditor.editorModule.insertTable(2, 2);
        container.documentEditor.selection.cellFormat.preferredWidth = 300;
        expect(argsEle.operations[0].offset).toBe(3);
        expect(argsEle.operations[0].type).toBe("CellFormat");
        expect(argsEle.operations[0].format).toBe("{\"preferredWidth\":300}");
        container.documentEditor.editorHistory.undo();
        expect(argsEle.operations[0].format).toBe("{\"preferredWidth\":234}");
        container.documentEditor.editorHistory.redo();
        expect(argsEle.operations[0].format).toBe("{\"preferredWidth\":300}");
    });
});