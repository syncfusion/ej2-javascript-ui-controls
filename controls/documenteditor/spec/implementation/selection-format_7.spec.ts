import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, DocumentHelper, TextElementBox } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
import { TestHelper } from '../test-helper.spec';

describe('Selection headerFooter format link to previous selection, editing and history validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.editor.insertText('Hello world');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Simple document with page break',()=>{
        console.log('Simple document with page break');
        editor.openBlank();
        editor.editor.insertPageBreak();
        editor.editor.insertPageBreak();
        editor.selection.goToPage(1);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);
        editor.selection.goToPage(2);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);
        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);

        //editing
        editor.selection.goToPage(1);
        editor.selection.goToHeader();
        editor.editor.insertText("HeaderText");
        editor.selection.goToFooter();
        editor.editor.insertText("FooterText");

        editor.selection.goToPage(2);
        editor.selection.goToHeader();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("HeaderText");
        editor.selection.goToFooter();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("FooterText");

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("HeaderText");
        editor.selection.goToFooter();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("FooterText");

    });
    it('Document with multiple section',()=>{
        console.log('Document with multiple section');
        editor.openBlank();
        editor.editor.insertSectionBreak();
        editor.editor.insertSectionBreak();
        editor.selection.goToPage(1);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);
        editor.selection.goToPage(2);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);
        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);

        //editing
        editor.selection.goToPage(1);
        editor.selection.goToHeader();
        editor.editor.insertText("HeaderText");
        editor.selection.goToFooter();
        editor.editor.insertText("FooterText");

        editor.selection.goToPage(2);
        editor.selection.goToHeader();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("HeaderText");
        editor.selection.goToFooter();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("FooterText");

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("HeaderText");
        editor.selection.goToFooter();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("FooterText");

        editor.selection.goToPage(2);
        editor.selection.goToHeader();
        editor.selection.sectionFormat.oddPageHeader.linkToPrevious = false;
        editor.editor.insertText("LP OFF ");
        editor.selection.goToFooter();
        editor.selection.sectionFormat.oddPageFooter.linkToPrevious = false;
        editor.editor.insertText("LP OFF ");

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("LP OFF HeaderText");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("LP OFF FooterText");

        editor.selection.goToPage(1);
        editor.selection.goToHeader();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("HeaderText");
        editor.selection.goToFooter();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("FooterText");

        //History
        let i: number = 0;
        while(i < 4) {
            editor.editorHistory.undo();
            i++;
        }

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("HeaderText");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("FooterText");

        editor.selection.goToPage(2);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("HeaderText");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("FooterText");

        let j: number = 0;
        while(j < 4) {
            editor.editorHistory.redo();
            j++;
        }

        editor.selection.goToPage(2);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        editor.selection.selectAll();
        expect(editor.selection.text).toBe("LP OFF HeaderText\r");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);
        editor.selection.selectAll();
        expect(editor.selection.text).toBe("LP OFF FooterText\r");

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
        editor.selection.selectAll();
        expect(editor.selection.text).toBe("LP OFF HeaderText\r");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);
        editor.selection.selectAll();
        expect(editor.selection.text).toBe("LP OFF FooterText\r");

    });
    it('Document with multiple section and Enabled different header footer types',()=>{
        console.log('Document with multiple section and Enabled different header footer types');
        editor.openBlank();

        editor.editor.insertPageBreak();
        editor.editor.insertSectionBreak();

        editor.editor.insertPageBreak();

        editor.selection.goToPage(1);
        editor.selection.goToHeader();
        editor.selection.sectionFormat.differentOddAndEvenPages = true;
        //editor.selection.sectionFormat.differentFirstPage = true;
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);
        editor.selection.goToPage(2);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.evenPageHeader.linkToPrevious).toBe(false);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.evenPageFooter.linkToPrevious).toBe(false);

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);

        editor.selection.goToPage(4);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.evenPageHeader.linkToPrevious).toBe(true);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.evenPageFooter.linkToPrevious).toBe(true);

        //editing
        editor.selection.goToPage(1);
        editor.selection.goToHeader();
        editor.editor.insertText("Oddpage HeaderText");
        editor.selection.goToFooter();
        editor.editor.insertText("Oddpage FooterText");

        editor.selection.goToPage(2);
        editor.selection.goToHeader();
        editor.editor.insertText("Evenpage HeaderText");
        editor.selection.goToFooter();
        editor.editor.insertText("Evenpage FooterText");

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage HeaderText");
        editor.selection.goToFooter();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage FooterText");

        editor.selection.goToPage(4);
        editor.selection.goToHeader();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage HeaderText");
        editor.selection.goToFooter();
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage FooterText");

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        editor.selection.sectionFormat.oddPageHeader.linkToPrevious = false;
        editor.editor.insertText("LP OFF ");
        editor.selection.goToFooter();
        editor.selection.sectionFormat.oddPageFooter.linkToPrevious = false;
        editor.editor.insertText("LP OFF ");

        editor.selection.goToPage(4);
        editor.selection.goToHeader();
        editor.selection.sectionFormat.evenPageHeader.linkToPrevious = false;
        editor.editor.insertText("LP OFF ");
        editor.selection.goToFooter();
        editor.selection.sectionFormat.evenPageFooter.linkToPrevious = false;
        editor.editor.insertText("LP OFF ");

        editor.selection.goToPage(1);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage HeaderText");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage FooterText");

        editor.selection.goToPage(2);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.evenPageHeader.linkToPrevious).toBe(false);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage HeaderText");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.evenPageFooter.linkToPrevious).toBe(false);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage FooterText");

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);

        editor.selection.goToPage(4);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.evenPageHeader.linkToPrevious).toBe(false);
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.evenPageFooter.linkToPrevious).toBe(false);

        //History
        let i: number = 0;
        while(i < 8) {
            editor.editorHistory.undo();
            i++;
        }

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage HeaderText");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage FooterText");

        editor.selection.goToPage(4);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage HeaderText");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage FooterText");

        let j: number = 0;
        while(j < 8) {
            editor.editorHistory.redo();
            j++;
        }

        editor.selection.goToPage(3);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        editor.selection.selectAll();
        expect(editor.selection.text).toBe("LP OFF Oddpage HeaderText\r");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);
        editor.selection.selectAll();
        expect(editor.selection.text).toBe("LP OFF Oddpage FooterText\r");

        editor.selection.goToPage(4);
        editor.selection.goToHeader();
        expect(editor.selection.sectionFormat.evenPageHeader.linkToPrevious).toBe(false);
        editor.selection.selectAll();
        expect(editor.selection.text).toBe("LP OFF Evenpage HeaderText\r");
        editor.selection.goToFooter();
        expect(editor.selection.sectionFormat.evenPageFooter.linkToPrevious).toBe(false);
        editor.selection.selectAll();
        expect(editor.selection.text).toBe("LP OFF Evenpage FooterText\r");

    });

});