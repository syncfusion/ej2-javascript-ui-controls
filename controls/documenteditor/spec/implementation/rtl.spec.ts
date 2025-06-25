import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../spec/test-helper.spec';

// eslint-disable-next-line max-len
import { LayoutViewer, StyleDialog, StylesDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, TableOfContentsDialog, CellOptionsDialog, ListDialog, PageSetupDialog, BookmarkDialog, DocumentHelper } from '../../src/index';
import { Editor, EditorHistory } from '../../src/index';
import { Selection, PageLayoutViewer } from '../../src/index';
/**
 * RTL Spec
 */


describe('List Dialog testing', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ListDialog);
        // eslint-disable-next-line max-len
        editor = new DocumentEditor({ enableRtl: true, enableSelection: true, enableEditor: true, isReadOnly: false, enableListDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });

//     it('Show ListDialog dialog testing in rtl view', () => {
// console.log('Show ListDialog dialog testing in rtl view');
//         editor.showListDialog();
//         expect((editor.listDialogModule as any).target).not.toBeNull();
//         expect((editor.listDialogModule as any).target).not.toBeUndefined();
//     });
});


describe('Style dialog validation', () => {
    let editor: DocumentEditor;
    let styleDialog: StyleDialog;
    let stylesDialog: StylesDialog;
    let fontDialog: FontDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, StyleDialog, StylesDialog, FontDialog, EditorHistory);
        // eslint-disable-next-line max-len
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true, enableStyleDialog: true, enableRtl: true, enableFontDialog: true, enableParagraphDialog: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        styleDialog = editor.styleDialogModule;
        stylesDialog = editor.stylesDialogModule;
        fontDialog = editor.fontDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        styleDialog = undefined;
        stylesDialog = undefined;
        fontDialog = undefined;
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Show style and font dialog testing in rtl view', () => {
console.log('Show style and font dialog testing in rtl view');
        editor.showFontDialog();
        editor.showStyleDialog();
        editor.showStylesDialog();
    });
});

describe('TableOfContents dialog validation', () => {
    let editor: DocumentEditor;
    let tableOfContents: TableOfContentsDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(TableOfContentsDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableRtl: true });
        editor.enableEditorHistory = true;
        editor.enableTableOfContentsDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        tableOfContents = editor.tableOfContentsDialogModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        tableOfContents = undefined;
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Show toc in rtl view', () => {
console.log('Show toc in rtl view');
        editor.showTableOfContentsDialog();
    });
    it('Show toc in ltr view', function () {
console.log('Show toc in ltr view');
        editor.enableRtl = false;
        editor.showTableOfContentsDialog();
    });
});


describe('PageSetup Dialog Test Case Validation', () => {
    let editor: DocumentEditor;
    let dialog: PageSetupDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(PageSetupDialog, Selection, Editor, EditorHistory);
        // eslint-disable-next-line max-len
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableRtl: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        editor.enablePageSetupDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.pageSetupDialogModule;
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load PageSetup Dialog testing', () => {
console.log('Load PageSetup Dialog testing');
        dialog.loadPageSetupDialog();
    });
});


describe('BookMark add validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, EditorHistory);
        // eslint-disable-next-line max-len
        editor = new DocumentEditor({ enableEditorHistory: true, enableRtl: true, enableEditor: true, enableSelection: true, enableBookmarkDialog: true, isReadOnly: false, enableContextMenu: true, enableFontDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Bookmark dialog testing in rtl view', () => {
console.log('Bookmark dialog testing in rtl view');
        editor.showBookmarkDialog();
    });
});


