import { ContainerContentChangeEventArgs, DocumentEditor, Selection, Editor, EditorHistory, CollaborativeEditingHandler, SfdtExport, WordExport, SfdtReader, WParagraphFormat, ParagraphWidget, ActionInfo, Operation, LineWidget, TextElementBox, TableWidget, TableRowWidget, TableCellWidget, WTableFormat, CONTROL_CHARACTERS, BodyWidget } from '../../../../../src/index';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TestHelper } from '../../../../test-helper.spec';
/**
 * Character formatting collaborative editing spec
 */
describe('Validate the operation for section format', () => {
    let editor1: DocumentEditor = undefined;
    let editor2: DocumentEditor = undefined;
    let version: number = 0;
    beforeAll(() => {
        document.body.innerHTML = '';
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
        document.body.innerHTML = '';
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

    it('Apply section format', () => {
        console.log('Apply section format');
        let argsEle: ContainerContentChangeEventArgs;
        let connections: CollaborativeEditingHandler = editor2.collaborativeEditingHandlerModule;
        if (isNullOrUndefined(connections)) {
            connections = new CollaborativeEditingHandler(editor2);
        }
        editor1.contentChange = function (args: ContainerContentChangeEventArgs) {
            if (args.operations.length > 0) {
                argsEle = args;
                connections.applyRemoteAction('action', getoperation(args.operations));
            }
        }
        editor1.editorModule.insertText('Syncfusion software company');
        editor1.selection.sectionFormat.headerDistance = 72;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(28);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.headerDistance).toBe(72);

        editor1.selection.sectionFormat.footerDistance = 72;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(28);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.footerDistance).toBe(72);

        editor1.selection.sectionFormat.differentFirstPage = true;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.differentFirstPage).toBe(true);

        editor1.selection.sectionFormat.differentOddAndEvenPages = true;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.differentOddAndEvenPages).toBe(true);

        editor1.selection.sectionFormat.pageWidth = 800;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.pageWidth).toBe(800);

        editor1.selection.sectionFormat.pageHeight = 900;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.pageHeight).toBe(900);

        editor1.selection.sectionFormat.leftMargin = 108;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.leftMargin).toBe(108);

        editor1.selection.sectionFormat.rightMargin = 108;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.rightMargin).toBe(108);

        editor1.selection.sectionFormat.topMargin = 108;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.topMargin).toBe(108);

        editor1.selection.sectionFormat.bottomMargin = 108;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.bottomMargin).toBe(108);

        editor1.selection.sectionFormat.restartPageNumbering = true;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.restartPageNumbering).toBe(true);

        editor1.selection.sectionFormat.pageStartingNumber = 1;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.pageStartingNumber).toBe(1);

        editor1.selection.sectionFormat.endnoteNumberFormat = 'UpperCaseLetter';
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.endnoteNumberFormat).toBe('UpperCaseLetter');

        editor1.selection.sectionFormat.footNoteNumberFormat = 'UpperCaseLetter';
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.footNoteNumberFormat).toBe('UpperCaseLetter');

        editor1.selection.sectionFormat.restartIndexForEndnotes = 'RestartForEachSection';
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.restartIndexForEndnotes).toBe('RestartForEachSection');

        editor1.selection.sectionFormat.restartIndexForFootnotes = 'RestartForEachSection';
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.restartIndexForFootnotes).toBe('RestartForEachSection');

        editor1.selection.sectionFormat.initialFootNoteNumber = 0;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.initialFootNoteNumber).toBe(0);

        editor1.selection.sectionFormat.initialEndNoteNumber = 0;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.initialEndNoteNumber).toBe(0);

        editor1.selection.sectionFormat.lineBetweenColumns = true;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.lineBetweenColumns).toBe(true);

        editor1.selection.sectionFormat.equalWidth = false;
        expect(argsEle.operations[0].format).toBeDefined();
        expect(argsEle.operations[0].length).toBe(1);
        expect(argsEle.operations[0].offset).toBe(1);
        expect(argsEle.operations[0].type).toBe('SectionFormat');
        //Remote action
        expect(editor2.selection.sectionFormat.equalWidth).toBe(false);
    });
});