import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, DocumentHelper, TextElementBox } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
import { TestHelper } from '../test-helper.spec';

let sfdtContent: any ='{"sfdt":"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"}';
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
    it('Document with table in header',()=>{
        console.log('Document with table in header');
        editor.open(sfdtContent);
        editor.selection.goToPage(1);
        editor.selection.goToHeader();
        editor.selection.select('1;H;1;0;0;0;0;0','1;H;1;0;0;0;0;0');
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        editor.selection.select('2;H;2;0;0;0;0;0','2;H;2;0;0;0;0;0');
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
    });
    it('Document with table and paragraph in header',()=>{
        console.log('Document with table and paragraph in header');
        editor.open(sfdtContent);
        editor.selection.goToPage(1);
        editor.selection.goToHeader();
        editor.selection.select('1;H;1;1;0','1;H;1;1;0');
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
        editor.selection.select('2;H;2;1;0','2;H;2;1;0');
        expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
    });
    // it('Document with multiple section and Enabled different header footer types',()=>{
    //     console.log('Document with multiple section and Enabled different header footer types');
    //     editor.openBlank();

    //     editor.editor.insertPageBreak();
    //     editor.editor.insertSectionBreak();

    //     editor.editor.insertPageBreak();

    //     editor.selection.goToPage(1);
    //     editor.selection.goToHeader();
    //     editor.selection.sectionFormat.differentOddAndEvenPages = true;
    //     //editor.selection.sectionFormat.differentFirstPage = true;
    //     expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);
    //     editor.selection.goToPage(2);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.evenPageHeader.linkToPrevious).toBe(false);
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.evenPageFooter.linkToPrevious).toBe(false);

    //     editor.selection.goToPage(3);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);

    //     editor.selection.goToPage(4);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.evenPageHeader.linkToPrevious).toBe(true);
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.evenPageFooter.linkToPrevious).toBe(true);

    //     //editing
    //     editor.selection.goToPage(1);
    //     editor.selection.goToHeader();
    //     editor.editor.insertText("Oddpage HeaderText");
    //     editor.selection.goToFooter();
    //     editor.editor.insertText("Oddpage FooterText");

    //     editor.selection.goToPage(2);
    //     editor.selection.goToHeader();
    //     editor.editor.insertText("Evenpage HeaderText");
    //     editor.selection.goToFooter();
    //     editor.editor.insertText("Evenpage FooterText");

    //     editor.selection.goToPage(3);
    //     editor.selection.goToHeader();
    //     expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage HeaderText");
    //     editor.selection.goToFooter();
    //     expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage FooterText");

    //     editor.selection.goToPage(4);
    //     editor.selection.goToHeader();
    //     expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage HeaderText");
    //     editor.selection.goToFooter();
    //     expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage FooterText");

    //     editor.selection.goToPage(3);
    //     editor.selection.goToHeader();
    //     editor.selection.sectionFormat.oddPageHeader.linkToPrevious = false;
    //     editor.editor.insertText("LP OFF ");
    //     editor.selection.goToFooter();
    //     editor.selection.sectionFormat.oddPageFooter.linkToPrevious = false;
    //     editor.editor.insertText("LP OFF ");

    //     editor.selection.goToPage(4);
    //     editor.selection.goToHeader();
    //     editor.selection.sectionFormat.evenPageHeader.linkToPrevious = false;
    //     editor.editor.insertText("LP OFF ");
    //     editor.selection.goToFooter();
    //     editor.selection.sectionFormat.evenPageFooter.linkToPrevious = false;
    //     editor.editor.insertText("LP OFF ");

    //     editor.selection.goToPage(1);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
    //     expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage HeaderText");
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);
    //     expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage FooterText");

    //     editor.selection.goToPage(2);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.evenPageHeader.linkToPrevious).toBe(false);
    //     expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage HeaderText");
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.evenPageFooter.linkToPrevious).toBe(false);
    //     expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage FooterText");

    //     editor.selection.goToPage(3);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);

    //     editor.selection.goToPage(4);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.evenPageHeader.linkToPrevious).toBe(false);
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.evenPageFooter.linkToPrevious).toBe(false);

    //     //History
    //     let i: number = 0;
    //     while(i < 8) {
    //         editor.editorHistory.undo();
    //         i++;
    //     }

    //     editor.selection.goToPage(3);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
    //     expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage HeaderText");
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);
    //     expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Oddpage FooterText");

    //     editor.selection.goToPage(4);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(true);
    //     // expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage HeaderText");
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(true);
    //     // expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe("Evenpage FooterText");

    //     let j: number = 0;
    //     while(j < 8) {
    //         editor.editorHistory.redo();
    //         j++;
    //     }

    //     editor.selection.goToPage(3);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.oddPageHeader.linkToPrevious).toBe(false);
    //     editor.selection.selectAll();
    //     // expect(editor.selection.text).toBe("LP OFF Oddpage HeaderText\r");
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.oddPageFooter.linkToPrevious).toBe(false);
    //     editor.selection.selectAll();
    //     // expect(editor.selection.text).toBe("LP OFF Oddpage FooterText\r");

    //     editor.selection.goToPage(4);
    //     editor.selection.goToHeader();
    //     expect(editor.selection.sectionFormat.evenPageHeader.linkToPrevious).toBe(false);
    //     editor.selection.selectAll();
    //     // expect(editor.selection.text).toBe("LP OFF Evenpage HeaderText\r");
    //     editor.selection.goToFooter();
    //     expect(editor.selection.sectionFormat.evenPageFooter.linkToPrevious).toBe(false);
    //     editor.selection.selectAll();
    //     // expect(editor.selection.text).toBe("LP OFF Evenpage FooterText\r");

    // });

});