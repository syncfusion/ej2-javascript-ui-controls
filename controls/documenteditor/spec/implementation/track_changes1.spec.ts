import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, ElementBox, LineWidget, ParagraphWidget, TableCellWidget, TableRowWidget, TableWidget } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
/**
 * TrackChanges pane revision checking
 */
let sfdtContent: any ='{"sfdt":"UEsDBAoAAAAIACBnLFlxl4f5IgUAALsoAAAEAAAAc2ZkdO1aS2/jNhD+KwZ79Qp6y9St2CLtoSgWaE8NctCLEm09KdlyEuS/ly8nciQl0m42FlA7cIbmY/jNzMeRSOkRFGWDM/wQ/Y3CBrgN2UdrUEcBcG8fAZUlAe4jKFvg2pq+BmUCXAfSQprRApVEykZKX8okBK5hrwGSMkQlcFUqi0gUfCwEnQn8FbXfvDgCaxDlCLh0OGKSNhN8khGXGOXA1aiMhCzjvKYKfiWejwM6Pg+KtOYtUdVymfpNwIeKltu7Jzopt47w/8JSUVMiZqwfkprJhgJ9pL3TRkgSC+nL34kQByZYN5zzeZCUdZMz0wqSeSlgzUh2DJAYiMX8Yk76A3lpHdH6JqUTgzpEMfsCZnzIkIOornFVVXVh+wFScZFYdhYcwN0T/aPDZKymwg9DKfeD5tSymYVes2gEg+cCdWTJfUtaXmA2sWg+rZfoyGTbcSEigZNoB/0YZZZJouTeSBxqw1JcqC3ThWF0xsMUojLDSbHZbiKi52ZWHXwjXowTdY6CCBQJtz9pRLL5GEixz7XFHuM8i9hSc0hC84ffCRzUMSZJa+uBo6HMh3kaqO01f7ybiDsuVCt/W20Lv9pV5abOjqG9S67p420P7rZJ3PWhtw10FLTN/kCcnRlX0H4oLf+aPxZ5D5KQs9zf6qHpHTcFPsb7sPVwUB1gek0h71w/qRs7PtxW+ICatDhUtWWguDjmtkquSWReEmnzXRbtcqjtvHtI0njv7KFT/l+TCJ0sJnTALQMlvwyAnw74AbCNEB2bUiNUxTph6FdzSP1qf7j3EOB+r8NAbcfDJ9aw/aQqtpeWYor9Ji/4oqFsG77cWQBo+jQYaX+IrpPoybmViJa79Ymrkqq8iyyh+oFygbIC0S7gq5din2Cqdi+XgmCCJ3gh9qd0CGO9GMRKnWFe8KIZeWdNiG6Vo1c1ZxWMth+xjsmr9dwI9L4IpScjKjbfqbSwSJ/3+hL+js16Krf5c7kNTocPL55HtUTUoFRSq2nFcQLb02vyuIC5kIIF1PRaSpSJ+UshwqTJBBKEBMCgyEoZinu6SARKznZ2HvHLDf8ATot7npbOyCGV/5hXX/MrP75MwdjMZvwj8kKcxyvtoyZ9N5TskKcbS0V1oGbbtqU6jq5C0zkPrtazRFLfPqf+6k8c0/xHK7l/9RvLhDZ4xeaXTuec7tQPVIvznM7K7fpt9TXxCHjHuadOjaDGJa34LULePm1W3zzixcQrk9VNkTfPkEeaz6A/vbZP/zTyzOOOPsYdYxHc0adwRx/njrEw7pwgGwulgzFGB/1NR2o3hmMbP58OxhQ6GON0+HQrJtLBXCgdzD4d8OkWYQHZwZxCB3OIDheyYiIdrIXSwRrIDpdngTWFBdZgUlhi8O2FBt+eFfzPuiLYU4Jvzwz+5S4EzkKD73zfheCzWOBMYYHzvReCy9Fhs1A6bMZuE1XFetOVBv/8fEJsphBiM36jeAE7JlICLpQS8K0MsShuwCncgG8niwWTJCIfw5Dhw8T+kdmZn7lLJYoTqJuiaC4PSqJgJ8YpP0WmylIhg0xI8S4SC9Xv+6huVvuaw2avZAFd1c0vKvyi6f9ommtCV7UUaJv/sochgiIEh7TfyOtBzBcTFWu6oqtWT/HISzNzFEPF0LSe4pEXSWYoVh3FNvquGH7RYQ5gU9EH9A4+/Z+hVtcUe8DBIw/E5+BVFdNSe4qHn9bO0Wsrpgl7eoefYM5xhKFAcwDv8EM9/qzlKFYKzuKar7j/AFBLAQIUAAoAAAAIACBnLFlxl4f5IgUAALsoAAAEAAAAAAAAAAAAAAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAEQFAAAAAA=="}';
describe('907861-Track changes Bug', () => {
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
            
            done();
        }, 1000);
    });
    it('Track changes revision testing', () => {
        editor.open(sfdtContent);
        editor.selection.select('0;0;2;0;0;0','0;0;2;2;0;6');
        editor.editor.onBackSpace();
        editor.editorHistory.undo();
        expect(() => { editor.revisions.acceptAll(); }).not.toThrowError();
        expect(editor.revisions.length).toBe(0);
    });
   
});
describe('Track changes - tracking the cell of the nested table', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('tracking the cell of the nested table', () => {
        console.log('tracking the cell of the nested table');
        container.openBlank();
        container.editor.insertTable(2,2);
        container.editor.insertText("Helloworld");
        container.selection.select('0;0;0;0;0;0', '0;0;0;0;0;0');
        container.editor.insertTable(2,2);
        container.enableTrackChanges = true;
        container.selection.select('0;0;0;0;0;0;0;0;0', '0;0;0;0;1;11');
        container.editor.delete();
        expect(container.revisions.length).toBe(2);
    });
});
describe('Track changes - nested table cell deletion redo issue', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableSelection: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('nested table cell deletion redo issue', () => {
        console.log('nested table cell deletion redo issue');
        container.openBlank();
        container.editor.insertTable(2,2);
        container.editor.insertText("Helloworld");
        container.selection.select('0;0;0;0;0;0', '0;0;0;0;0;0');
        container.editor.insertTable(2,2);
        container.enableTrackChanges = true;
        container.selection.select('0;0;0;0;0;0;0;0;0', '0;0;0;0;1;11');
        container.editor.delete();
        container.editorHistory.undo();
        container.editorHistory.redo();
        expect((((((((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget).children) as ElementBox[]).length).toBe(1);
    });
});

