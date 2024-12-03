import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { BaseHistoryInfo, BookmarkElementBox, Editor, FieldElementBox, FootnoteElementBox, FootnoteEndnoteMarkerElementBox, Toolbar } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { LineWidget, BodyWidget, ParagraphWidget, TextElementBox } from '../../src/index';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
/**
 * bookmark to hyperLink conversion
 */
let sfdtContent: any ='{"sfdt":"UEsDBAoAAAAIAC+VIlmUCONinAMAAFsfAAAEAAAAc2ZkdO1Zy27iMBT9lcizmZFQlRBISnajjtAsRqNKs+iiw8JJbGLhPMY2pRTx7/UrvKGlrZogDZvj2E587j33+gZnAcpKkJw8oT84FSASbIo6gKMERPcLILFiIFqAagaiwOt2QJWBKBzIBs1lQyKzKCzGFrMURH7QAdhiiisQuRJLZBoxMSBXAr/R7BaOEegAVGAQyduxQjnMSI1II8EFiDyJyGA1Lrh8wHcGY5LI+4ukpFyPoH8zjTQWib7VjNyPlnJRbV2FlWlxyrhCIWkt5BgVBtnYYGyvMwMPCiRyUSjiJcshletSxVMPJNhMJHqNxKwBIgwpR7rXtjB/kvyUqXIKuIGUxIzIJ2HlkC+u/g2HsoPEGzdhdbE5G8Od6wKjnZ6djoQrASRDQSvluvQBFWLKkHNXsgl3buYJRbzjiAw5YNlZrAyKJ0L7Udkdl+Ukh2zirWe02kgsg+MymAoiSDnlTlLmFSzm+wp4l6mAcyE8ywvhWTizjCSZTtN1CoPlaDmSe5XZjEadFw3x9gyZ6iTnJtdjqEHOVQaY2TumwGTDzDOtkta8axOmpLDVwSC2KAztmGuABmxdoNa0kq7KkKU/UavW7Vmxas+Sui6ud3nMLSOBqWmkYmYqnS03yFawTJIF0nRuEedm/cpAmoncMMHYEFSZbzWYi9iyVH4AOsSG9gd0EZrrKrNViuzj3+fX3WpWPK6XUAmiVvyJYEqKseN91KIviqnyblPNKzcceEEQ9N0w7LqDXrgtr7dniY36YDvqnV9knIlVEneH/d4g0Em8FdHradtxvdF/oNu8bqzlOelJ5yaDzLjTa5zyD4ThlArnFjI4ZrDKnGFZiBXpI8Nb5Je7FnY/LVbOC5XusVDxWxoq3eOh4rcuVGrSfkvV94+p3z3pSm/oh4HfhPr+cfUboPxK9XstVb+3rz6pK34rc793SP3GKL9S/X5L1e8fyP02it4/mPLt1DpoqdbBWVo3t70HZ2rd5K4etlTr8G27enOih2/d1ZtU/7ql6l8fe6Nzr/onnenrXxP6Xx9/p2uE9CsjYNDSCBicyv+Wh8Lg9FbQ6phA7GMC4vCp3f7J1L5TLYua1LAsRfOkLIualBl0vt6h+NvHUFMZ0jcMJXB1cms/5kG4f3659Y/xRGhahuoomaovWhLlFI1JbpDZy0eDJB9zw0x9qlsA/rnf2lYH5H+nruv69kA8aZRFr2ZRfBILudpSnUD/939z/l8+A1BLAQIUAAoAAAAIAC+VIlmUCONinAMAAFsfAAAEAAAAAAAAAAAAAAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAL4DAAAAAA=="}';
describe('Bookmark to HyperLink conversion', () => {
    let editor: DocumentEditor = undefined;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.enableLocalPaste = true;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Bookmark to Hyperlink text conversion', () => {
        editor.open(sfdtContent);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('Adventure Works Cycles, the ');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] instanceof BookmarkElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as TextElementBox).text).toBe('fic');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] as TextElementBox).text).toBe('titious company');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[4] instanceof BookmarkElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[5] as TextElementBox).text).toBe(' ');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[6] as TextElementBox).text).toBe('o');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[7] as TextElementBox).text).toBe('n which the Adventure ');
        editor.selection.select('0;0;40','0;0;57');
        editor.editor.insertHyperlinkInternal("http://www.google.com", "company on which", true, false);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('Adventure Works Cycles, the ');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] instanceof BookmarkElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as TextElementBox).text).toBe('fic');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] as TextElementBox).text).toBe('titious ');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[4] instanceof FieldElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[5] as TextElementBox).text).toBeDefined();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[6] instanceof FieldElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[7] as TextElementBox).text).toBe('company on which');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[8] instanceof FieldElementBox).toBe(true);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[9] instanceof BookmarkElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[10] as TextElementBox).text).toBe(' ');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[11] as TextElementBox).text).toBe('the Adventure ');
        editor.editorHistory.undo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('Adventure Works Cycles, the ');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] instanceof BookmarkElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as TextElementBox).text).toBe('fic');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] as TextElementBox).text).toBe('titious ');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[4] as TextElementBox).text).toBe('company');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[5] instanceof BookmarkElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[6] as TextElementBox).text).toBe(' ');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[7] as TextElementBox).text).toBe('o');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[8] as TextElementBox).text).toBe('n which');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[9] as TextElementBox).text).toBe(' ');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[10] as TextElementBox).text).toBe('the Adventure ');
        editor.editorHistory.redo();
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('Adventure Works Cycles, the ');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] instanceof BookmarkElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[2] as TextElementBox).text).toBe('fic');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[3] as TextElementBox).text).toBe('titious ');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[4] instanceof FieldElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[5] as TextElementBox).text).toBeDefined();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[6] instanceof FieldElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[7] as TextElementBox).text).toBe('company on which');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[8] instanceof FieldElementBox).toBe(true);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[9] instanceof BookmarkElementBox).toBe(true);
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[10] as TextElementBox).text).toBe(' ');
        expect((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[11] as TextElementBox).text).toBe('the Adventure ');
    });
   
});



