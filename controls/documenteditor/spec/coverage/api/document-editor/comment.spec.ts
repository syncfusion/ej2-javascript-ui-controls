import { DocumentEditor } from '../../../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, BookmarkDialog, BookmarkElementBox, BorderSettings, TableWidget, TableRowWidget, ContentControl, CommentElementBox } from '../../../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition, WSectionFormat } from '../../../../src/index';
import { TestHelper } from '../../../test-helper.spec';
import { Selection, PageLayoutViewer, SfdtExport } from '../../../../src/index';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
describe('Comment initial validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, enableComment: true });
        editor.enableAllModules();
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Comment initial construction validation', () => {
        console.log('Comment initial construction validation');
        editor.openBlank();
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        editor.selection.selectAll();
        editor.editor.deleteComment();
        expect(editor.documentHelper.comments.length).toBe(0);
    });
    it('Add comment and close the comment review pane', () => {
        console.log('Add comment and close the comment review pane');
        editor.editorModule.insertText("Syncfusion software");
        editor.selection.selectAll();
        editor.editorModule.isUserInsert = true;
        editor.editorModule.insertComment('');
        editor.editorModule.isUserInsert = false;
        editor.commentReviewPane.closePane();
        expect(() => { ((editor.commentReviewPane as any).discardButtonClick()) }).not.toThrowError();
    });
    it('Insert comment from comment review pane', () => {
        console.log('Insert comment from comment review pane');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        editor.commentReviewPane.insertComment();
        editor.selection.selectAll();
        editor.editor.deleteComment();
        expect(editor.documentHelper.comments.length).toBe(1);
    });
    it('Navigating to inserted comments', () => {
        console.log('Navigating to inserted comments');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check1');
        editor.commentReviewPane.navigatePreviousComment();
        editor.commentReviewPane.navigateNextComment();
        expect(editor.documentHelper.comments.length).toBe(1);
    });
    it('select Comment', () => {
        console.log('select Comment');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        (document.getElementsByClassName('e-de-cmt-readonly e-mention')[0] as any).click();
        editor.selection.selectAll();
        editor.editor.deleteComment();
        expect(editor.documentHelper.comments.length).toBe(0); 
    });
    it('userOptionSelectEvent - Edit', () => {
        console.log('userOptionSelectEvent - Edit');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        let event: any = { preventDefault: function () { }, item:{text:'Edit'} };  
     ((editor.commentReviewPane.commentPane.comments.get(editor.documentHelper.comments[0])) as any).userOptionSelectEvent(event);
        expect(editor.documentHelper.comments.length).toBe(1); 
    });
    it('userOptionSelectEvent - Reply', () => {
        console.log('userOptionSelectEvent - Reply');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        let event: any = { preventDefault: function () { }, item:{text:'Reply'} };  
     ((editor.commentReviewPane.commentPane.comments.get(editor.documentHelper.comments[0])) as any).userOptionSelectEvent(event);
        expect(editor.documentHelper.comments.length).toBe(1); 
    });
    it('userOptionSelectEvent - Delete', () => {
        console.log('userOptionSelectEvent - Delete');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        let event: any = { preventDefault: function () { }, item:{text:'Delete'} };  
     ((editor.commentReviewPane.commentPane.comments.get(editor.documentHelper.comments[0])) as any).userOptionSelectEvent(event);
        expect(editor.documentHelper.comments.length).toBe(0); 
    });
    it('userOptionSelectEvent - Resolve', () => {
        console.log('userOptionSelectEvent - Resolve');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        let event: any = { preventDefault: function () { }, item:{text:'Resolve'} };  
     ((editor.commentReviewPane.commentPane.comments.get(editor.documentHelper.comments[0])) as any).userOptionSelectEvent(event);
        expect(editor.documentHelper.comments.length).toBe(1); 
    });
    it('userOptionSelectEvent - Reopen', () => {
        console.log('userOptionSelectEvent - Reopen');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        let event: any = { preventDefault: function () { }, item:{text:'Reopen'} };  
     ((editor.commentReviewPane.commentPane.comments.get(editor.documentHelper.comments[0])) as any).userOptionSelectEvent(event);
        expect(editor.documentHelper.comments.length).toBe(1); 
    });
    it('Comment reply Cancel', () => {
        console.log('Comment reply Cancel');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        let event: any = { preventDefault: function () { }, item:{text:'Reply'} };  
     ((editor.commentReviewPane.commentPane.comments.get(editor.documentHelper.comments[0])) as any).userOptionSelectEvent(event);
     editor.commentReviewPane.commentPane.currentEditingComment.cancelReply();
        expect(editor.documentHelper.comments.length).toBe(1); 
    });
    it('Comment reply post', () => {
        console.log('Comment reply post');
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        let event: any = { preventDefault: function () { }, item:{text:'Reply'} };  
     ((editor.commentReviewPane.commentPane.comments.get(editor.documentHelper.comments[0])) as any).userOptionSelectEvent(event);
     (editor.commentReviewPane.commentPane.currentEditingComment as any).postReply();
        expect(editor.documentHelper.comments.length).toBe(1); 
    });
});

/**
 * Converts an RGB or RGBA color string to a hexadecimal color value.
 *
 * @param {string} color - RGB or RGBA color string.
 * @returns {string} Hexadecimal color code.
 */
function rgbOrRgbaToHex(color: string): string {
    const match: RegExpMatchArray = color.match(/^rgba?\(([^)]*)\)$/i);

    if (!match) {
        throw new Error('Invalid RGB/RGBA color format');
    }

    const values: string[] = match[1].split(',');

    const r: number = parseInt(values[0].trim(), 10);
    const g: number = parseInt(values[1].trim(), 10);
    const b: number = parseInt(values[2].trim(), 10);

    const toHex: (value: number) => string = (value: number): string =>
        ('0' + value.toString(16)).slice(-2).toUpperCase();

    return '#' + toHex(r) + toHex(g) + toHex(b);
}

describe('Highlight Comments By Author', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        const ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false, enableComment: true });
        editor.enableAllModules();
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.documentEditorSettings.highlightCommentsByAuthor = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Should apply the author color to comment start markers', () => {
        editor.openBlank();
        editor.currentUser = 'User_1';
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        const markerColor: string = rgbOrRgbaToHex((editor.documentHelper.comments[0] as any).commentStartIn.commentMarkSpan.style.color);
        expect(editor.documentHelper.getAuthorColor('User_1').toLowerCase()).toBe(markerColor.toLowerCase());
    });
});
