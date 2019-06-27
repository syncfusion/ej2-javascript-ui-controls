import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer } from '../../../src/index';
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
    let viewer: LayoutViewer;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, ContextMenu, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, enableBookmarkDialog: true, isReadOnly: false, enableContextMenu: true, enableFontDialog: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Restrict editing pane open', () => {
        viewer.restrictEditingPane.showHideRestrictPane(true);
        viewer.restrictEditingPane.showHideRestrictPane(false);
    });
    it('open enforce dialog', () => {
        viewer.restrictEditingPane.enforceProtectionDialog.show();
        viewer.restrictEditingPane.enforceProtectionDialog.hideDialog();
    });
    it('open add user dialog', () => {
        (viewer.restrictEditingPane as any).addUserDialog.show();
        (viewer.restrictEditingPane as any).addUserDialog.hideDialog();

    });
    it('open unprotect document dialog', () => {
        viewer.restrictEditingPane.unProtectDialog.show();
        viewer.restrictEditingPane.unProtectDialog.hideDialog();

    });
    it('stop protection pane', () => {
        viewer.restrictEditingPane.showStopProtectionPane(true);
        (viewer.restrictEditingPane as any).closePane();
    });

});
