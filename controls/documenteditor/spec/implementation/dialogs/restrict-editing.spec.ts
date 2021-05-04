import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { FontDialog } from '../../../src/document-editor/implementation/dialogs/font-dialog';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';

import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { WCharacterFormat } from '../../../src/document-editor/implementation/format/character-format';
import { BookmarkDialog } from '../../../src/document-editor/implementation/dialogs/bookmark-dialog';
import { ParagraphWidget, LineWidget, BookmarkElementBox } from '../../../src/index';
import { LineInfo } from '../../../src/document-editor/implementation/editor/editor-helper';


describe('Restrict editing dialog validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, enableBookmarkDialog: true, isReadOnly: false, enableContextMenu: true, enableFontDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        editor = undefined;
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Restrict editing pane open', () => {
console.log('Restrict editing pane open');
        editor.documentHelper.restrictEditingPane.showHideRestrictPane(true);
        editor.documentHelper.restrictEditingPane.showHideRestrictPane(false);
    });
    it('open enforce dialog', () => {
console.log('open enforce dialog');
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.show();
        editor.documentHelper.restrictEditingPane.enforceProtectionDialog.hideDialog();
    });
    it('open add user dialog', () => {
console.log('open add user dialog');
        (editor.documentHelper.restrictEditingPane as any).addUserDialog.show();
        (editor.documentHelper.restrictEditingPane as any).addUserDialog.hideDialog();

    });
    it('open unprotect document dialog', () => {
console.log('open unprotect document dialog');
        editor.documentHelper.restrictEditingPane.unProtectDialog.show();
        editor.documentHelper.restrictEditingPane.unProtectDialog.hideDialog();

    });
    it('stop protection pane', () => {
console.log('stop protection pane');
        editor.documentHelper.restrictEditingPane.showStopProtectionPane(true);
        (editor.documentHelper.restrictEditingPane as any).closePane();
    });

});

let protectString:any='{"sections":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"name":"_GoBack","bookmarkType":0},{"editRangeId":"1779577094","group":"everyone"},{"text":"sample"},{"name":"_GoBack","bookmarkType":1},{"editRangeId":"1779577094","editableRangeStart":{"editRangeId":"1779577094","group":"everyone"}}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36.0,"formatting":true,"protectionType":"ReadOnly","enforcement":true}';


describe('Unprotect loaded document with password empty', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, enableBookmarkDialog: true, isReadOnly: false, enableContextMenu: true, enableFontDialog: true });
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Open protected document', () => {
console.log('Open protected document');
       editor.open(protectString);
       expect(editor.documentHelper.isDocumentProtected).toBe(true);
    });
    it('Unprotect document', () => {
console.log('Unprotect document');
        (editor.documentHelper.restrictEditingPane as any).stopProtectionTriggered(undefined);
        expect(editor.documentHelper.isDocumentProtected).toBe(false);
    });
});
