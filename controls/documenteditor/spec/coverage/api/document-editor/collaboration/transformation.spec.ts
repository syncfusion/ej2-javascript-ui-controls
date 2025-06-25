import { ContainerContentChangeEventArgs, DocumentEditor, Selection, Editor, EditorHistory, CollaborativeEditingHandler, SfdtExport, WordExport, SfdtReader, WParagraphFormat, ParagraphWidget, ActionInfo, Operation, LineWidget, TextElementBox, TableWidget, TableRowWidget, TableCellWidget, WTableFormat, WBorder, WBorders, WCellFormat } from '../../../../../src/index';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TestHelper } from '../../../../test-helper.spec';

/**
 * validate the acknowldgement transformation collaborative editing spec
 */
describe('Validate the acknowldgement transformation', () => {
    let editor1: DocumentEditor = undefined;
    let editor2: DocumentEditor = undefined;
    let version: number = 0;
    beforeAll(() => {
        
        let ele1: HTMLElement = createElement('div', { id: 'container1' });
        document.body.appendChild(ele1);
        editor1 = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true, isReadOnly: false, enableCollaborativeEditing: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, CollaborativeEditingHandler, SfdtExport);
        (editor1.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor1.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor1.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor1.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor1.appendTo('#container1');

        let ele2: HTMLElement = createElement('div', { id: 'container2' });
        document.body.appendChild(ele2);
        editor2 = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true, isReadOnly: false, enableCollaborativeEditing: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, CollaborativeEditingHandler, SfdtExport);
        (editor2.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor2.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor2.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor2.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor2.appendTo('#container2');
    });
    afterAll((done) => {
        editor1.destroy();
        document.body.removeChild(document.getElementById('container1'));
        editor1 = undefined;
        editor2.destroy();
        document.body.removeChild(document.getElementById('container2'));
        editor2 = undefined;
        
        setTimeout(() => {
            done();
        }, 1000);
    });

    function getoperation(operation: Operation[]): ActionInfo {
        let changes: ActionInfo = {};
        changes.currentUser = 'Document Editor';
        changes.roomName = 'Endnote.docx';
        changes.connectionId = 'YInqI1-CIpt_ckI0ktl6JA';
        changes.version = ++version;
        changes.operations = operation;
        return changes;
    }

    it('Validate the transformation of insert and insert', () => {
        console.log('Validate the transformation of insert and insert');
        let argsEle: ContainerContentChangeEventArgs;
        let connections: any = editor2.collaborativeEditingHandlerModule;
        if (isNullOrUndefined(connections)) {
            connections = new CollaborativeEditingHandler(editor2);
        }
        editor1.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
                connections.applyRemoteAction('action', getoperation(args.operations));
            }
        }
        editor1.editorModule.insertText('Adventure Works Cycles, the fictitious company on which the Adventure Works sample databases are based, is a large, multinational manufacturing company.');
        let operation: Operation = {
            action: 'Insert',
            offset: 11,
            length: 11,
            text: 'Syncfusion ',
            format: '{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","bidi":false,"bdo":"None","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false,"localeIdBidi":0,"localeId":0,"complexScript":false,"fontFamilyAscii":"Calibri","fontFamilyNonFarEast":"Calibri","fontFamilyFarEast":"Calibri","characterSpacing":0,"scaling":100}',
            type: 'CharacterFormat'
        };
        editor2.selectionModule.select('0;0;10', '0;0;10');
        editor2.editorModule.insertText('Syncfusion ');
        (connections.acknowledgmentPending as Operation[]) = [];
        (connections.acknowledgmentPending as Operation[]).push(operation);
        editor1.selectionModule.select('0;0;16', '0;0;16');
        editor1.editorModule.insertText('software ');
        let para: ParagraphWidget = editor2.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        expect(((para.childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('Adventure Syncfusion Works software Cycles, the fictitious company on which the Adventure Works ');
    });

    it('Validate the transformation of insert and delete', () => {
        console.log('Validate the transformation of insert and delete');
        let argsEle: ContainerContentChangeEventArgs;
        let connections: any = editor2.collaborativeEditingHandlerModule;
        if (isNullOrUndefined(connections)) {
            connections = new CollaborativeEditingHandler(editor2);
        }
        editor1.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
                connections.applyRemoteAction('action', getoperation(args.operations));
            }
        }
        editor1.selectionModule.select('0;0;16', '0;0;25');
        editor1.editorModule.onBackSpace();
        let para: ParagraphWidget = editor2.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        expect(((para.childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('Adventure Syncfusion Works Cycles, the fictitious company on which the Adventure Works ');
    });

});