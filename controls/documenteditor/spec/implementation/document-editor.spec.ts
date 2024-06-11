import { DocumentEditor, XmlHttpRequestEventArgs } from '../../src/index';
import { DocumentEditorContainer } from '../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { createElement, Browser } from '@syncfusion/ej2-base';
import './../../node_modules/es6-promise/dist/es6-promise';
import { TestHelper } from './../test-helper.spec';


describe('Null or Undefined values check for Document Editor properties', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        //DocumentEditor.Inject(Regular);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo("#container");
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Accept tab', () => {
        console.log('Accept tab');
        editor = new DocumentEditor({acceptTab:null});
        editor.appendTo("#container");
        expect(editor.acceptTab).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({acceptTab:undefined});
        editor.appendTo("#container");
        expect(editor.acceptTab).toBe(false);
        editor.destroy();
    });
    it('autoResizeOnVisibilityChange', () => {
        console.log('autoResizeOnVisibilityChange');
        editor = new DocumentEditor({autoResizeOnVisibilityChange:null});
        editor.appendTo("#container");
        expect(editor.autoResizeOnVisibilityChange).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({autoResizeOnVisibilityChange:undefined});
        editor.appendTo("#container");
        expect(editor.autoResizeOnVisibilityChange).toBe(false);
        editor.destroy();
    });
    it('enableCollaborativeEditing', () => {
        console.log('enableCollaborativeEditing');
        editor = new DocumentEditor({enableCollaborativeEditing:null});
        editor.appendTo("#container");
        expect(editor.enableCollaborativeEditing).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableCollaborativeEditing:undefined});
        editor.appendTo("#container");
        expect(editor.enableCollaborativeEditing).toBe(false);
        editor.destroy();
    });
    it('defaultPasteOption', () => {
        console.log('defaultPasteOption');
        editor = new DocumentEditor({defaultPasteOption:null});
        editor.appendTo("#container");
        expect(editor.defaultPasteOption).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({defaultPasteOption:undefined});
        editor.appendTo("#container");
        expect(editor.defaultPasteOption).toBe('KeepSourceFormatting');
        editor.destroy();
    });
    it('layoutType', () => {
        console.log('layoutType');
        editor = new DocumentEditor({layoutType:null});
        editor.appendTo("#container");
        expect(editor.layoutType).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({layoutType:undefined});
        editor.appendTo("#container");
        expect(editor.layoutType).toBe('Pages');
        editor.destroy();
        
    });
    it('currentUser', () => {
        console.log('currentUser');
        editor = new DocumentEditor({currentUser:null});
        editor.appendTo("#container");
        expect(editor.currentUser).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({currentUser:undefined});
        editor.appendTo("#container");
        expect(editor.currentUser).toBe('');
        editor.destroy();
    });
    it('userColor', () => {
        console.log('userColor');
        editor = new DocumentEditor({userColor:null});
        editor.appendTo("#container");
        expect(editor.userColor).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({userColor:undefined});
        editor.appendTo("#container");
        expect(editor.userColor).toBe('#FFFF00');
        editor.destroy();
        
    });
    it('pageGap', () => {
        console.log('pageGap');
        editor = new DocumentEditor({pageGap:null});
        editor.appendTo("#container");
        expect(editor.pageGap).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({pageGap:undefined});
        editor.appendTo("#container");
        expect(editor.pageGap).toBe(20);
        editor.destroy();
    });
    it('documentName', () => {
        console.log('documentName');
        editor = new DocumentEditor({documentName:null});
        editor.appendTo("#container");
        expect(editor.documentName).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({documentName:undefined});
        editor.appendTo("#container");
        expect(editor.documentName).toBe('');
        editor.destroy();
    });
    it('width', () => {
        console.log('width');
        editor = new DocumentEditor({width:null});
        editor.appendTo("#container");
        expect(editor.width).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({width:undefined});
        editor.appendTo("#container");
        expect(editor.width).toBe('100%');
        editor.destroy();
    });
    it('height', () => {
        console.log('height');
        editor = new DocumentEditor({height:null});
        editor.appendTo("#container");
        expect(editor.height).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({height:undefined});
        editor.appendTo("#container");
        expect(editor.height).toBe('200px');
        editor.destroy();
    });
    it('serviceUrl', () => {
        console.log('serviceUrl');
        editor = new DocumentEditor({serviceUrl:null});
        editor.appendTo("#container");
        expect(editor.serviceUrl).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({serviceUrl:undefined});
        editor.appendTo("#container");
        expect(editor.serviceUrl).toBe('');
        editor.destroy();
       
    });
    it('zoomFactor', () => {
        console.log('zoomFactor');
        editor = new DocumentEditor({zoomFactor:null});
        editor.appendTo("#container");
        expect(editor.zoomFactor).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({zoomFactor:undefined});
        editor.appendTo("#container");
        expect(editor.zoomFactor).toBe(1);
        editor.destroy();
    });
    it('zIndex', () => {
        console.log('zIndex');
        editor = new DocumentEditor({zIndex:null});
        editor.appendTo("#container");
        expect(editor.zIndex).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({zIndex:undefined});
        editor.appendTo("#container");
        expect(editor.zIndex).toBe(2000);
        editor.destroy();
    });
    it('isReadOnly', () => {
        console.log('isReadOnly');
        editor = new DocumentEditor({isReadOnly:null});
        editor.appendTo("#container");
        expect(editor.isReadOnly).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({isReadOnly:undefined});
        editor.appendTo("#container");
        expect(editor.isReadOnly).toBe(true);
        editor.destroy();
    });
    it('enablePrint', () => {
        console.log('enablePrint');
        editor = new DocumentEditor({enablePrint:null});
        editor.appendTo("#container");
        expect(editor.enablePrint).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enablePrint:undefined});
        editor.appendTo("#container");
        expect(editor.enablePrint).toBe(false);
        editor.destroy();
    });
    it('enableSelection', () => {
        console.log('enableSelection');
        editor = new DocumentEditor({enableSelection:null});
        editor.appendTo("#container");
        expect(editor.enableSelection).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableSelection:undefined});
        editor.appendTo("#container");
        expect(editor.enableSelection).toBe(false);
        editor.destroy();
    });
    it('enableEditor', () => {
        console.log('enableEditor');
        editor = new DocumentEditor({enableEditor:null});
        editor.appendTo("#container");
        expect(editor.enableEditor).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableEditor:undefined});
        editor.appendTo("#container");
        expect(editor.enableEditor).toBe(false);
        editor.destroy();
    });
    it('enableEditorHistory', () => {
        console.log('enableEditorHistory');
        editor = new DocumentEditor({enableEditorHistory:null});
        editor.appendTo("#container");
        expect(editor.enableEditorHistory).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableEditorHistory:undefined});
        editor.appendTo("#container");
        expect(editor.enableEditorHistory).toBe(false);
        editor.destroy();
    });
    it('enableSfdtExport', () => {
        console.log('enableSfdtExport');
        editor = new DocumentEditor({enableSfdtExport:null});
        editor.appendTo("#container");
        expect(editor.enableSfdtExport).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableSfdtExport:undefined});
        editor.appendTo("#container");
        expect(editor.enableSfdtExport).toBe(false);
        editor.destroy();
    });
    it('enableWordExport', () => {
        console.log('enableWordExport');
        editor = new DocumentEditor({enableWordExport:null});
        editor.appendTo("#container");
        expect(editor.enableWordExport).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableWordExport:undefined});
        editor.appendTo("#container");
        expect(editor.enableWordExport).toBe(false);
        editor.destroy();
    });
    it('enableAutoFocus', () => {
        console.log('enableAutoFocus');
        editor = new DocumentEditor({enableAutoFocus:null});
        editor.appendTo("#container");
        expect(editor.enableAutoFocus).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableAutoFocus:undefined});
        editor.appendTo("#container");
        expect(editor.enableAutoFocus).toBe(true);
        editor.destroy();
    });
    it('enableTextExport', () => {
        console.log('enableTextExport');
        editor = new DocumentEditor({enableTextExport:null});
        editor.appendTo("#container");
        expect(editor.enableTextExport).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableTextExport:undefined});
        editor.appendTo("#container");
        expect(editor.enableTextExport).toBe(false);
        editor.destroy();
    });
    it('enableOptionsPane', () => {
        console.log('enableOptionsPane');
        editor = new DocumentEditor({enableOptionsPane:null});
        editor.appendTo("#container");
        expect(editor.enableOptionsPane).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableOptionsPane:undefined});
        editor.appendTo("#container");
        expect(editor.enableOptionsPane).toBe(false);
        editor.destroy();
    });
    it('enableContextMenu', () => {
        console.log('enableContextMenu');
        editor = new DocumentEditor({enableContextMenu:null});
        editor.appendTo("#container");
        expect(editor.enableContextMenu).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableContextMenu:undefined});
        editor.appendTo("#container");
        expect(editor.enableContextMenu).toBe(false);
        editor.destroy();
    });
    it('enableHyperlinkDialog', () => {
        console.log('enableHyperlinkDialog');
        editor = new DocumentEditor({enableHyperlinkDialog:null});
        editor.appendTo("#container");
        expect(editor.enableHyperlinkDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableHyperlinkDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableHyperlinkDialog).toBe(false);
        editor.destroy();
    });
    it('enableBookmarkDialog', () => {
        console.log('enableBookmarkDialog');
        editor = new DocumentEditor({enableBookmarkDialog:null});
        editor.appendTo("#container");
        expect(editor.enableBookmarkDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableBookmarkDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableBookmarkDialog).toBe(false);
        editor.destroy();
    });
    it('enableTableOfContentsDialog', () => {
        console.log('enableTableOfContentsDialog');
        editor = new DocumentEditor({enableTableOfContentsDialog:null});
        editor.appendTo("#container");
        expect(editor.enableTableOfContentsDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableTableOfContentsDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableTableOfContentsDialog).toBe(false);
        editor.destroy();
    });
    it('enableSearch', () => {
        console.log('enableSearch');
        editor = new DocumentEditor({enableSearch:null});
        editor.appendTo("#container");
        expect(editor.enableSearch).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableSearch:undefined});
        editor.appendTo("#container");
        expect(editor.enableSearch).toBe(false);
        editor.destroy();
    });
    it('enableParagraphDialog', () => {
        console.log('enableParagraphDialog');
        editor = new DocumentEditor({enableParagraphDialog:null});
        editor.appendTo("#container");
        expect(editor.enableParagraphDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableParagraphDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableParagraphDialog).toBe(false);
        editor.destroy();
    });
    it('enableListDialog', () => {
        console.log('enableListDialog');
        editor = new DocumentEditor({enableListDialog:null});
        editor.appendTo("#container");
        expect(editor.enableListDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableListDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableListDialog).toBe(false);
        editor.destroy();
    });
    it('enableTablePropertiesDialog', () => {
        console.log('enableTablePropertiesDialog');
        editor = new DocumentEditor({enableTablePropertiesDialog:null});
        editor.appendTo("#container");
        expect(editor.enableTablePropertiesDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableTablePropertiesDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableTablePropertiesDialog).toBe(false);
        editor.destroy();
    });
    it('enableBordersAndShadingDialog', () => {
        console.log('enableBordersAndShadingDialog');
        editor = new DocumentEditor({enableBordersAndShadingDialog:null});
        editor.appendTo("#container");
        expect(editor.enableBordersAndShadingDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableBordersAndShadingDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableBordersAndShadingDialog).toBe(false);
        editor.destroy();
    });
    it('enableFootnoteAndEndnoteDialog', () => {
        console.log('enableFootnoteAndEndnoteDialog');
        editor = new DocumentEditor({enableFootnoteAndEndnoteDialog:null});
        editor.appendTo("#container");
        expect(editor.enableFootnoteAndEndnoteDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableFootnoteAndEndnoteDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableFootnoteAndEndnoteDialog).toBe(false);
        editor.destroy();
    });
    it('enableColumnsDialog', () => {
        console.log('enableColumnsDialog');
        editor = new DocumentEditor({enableColumnsDialog:null});
        editor.appendTo("#container");
        expect(editor.enableColumnsDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableColumnsDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableColumnsDialog).toBe(false);
        editor.destroy();
    });
    it('enablePageSetupDialog', () => {
        console.log('enablePageSetupDialog');
        editor = new DocumentEditor({enablePageSetupDialog:null});
        editor.appendTo("#container");
        expect(editor.enablePageSetupDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enablePageSetupDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enablePageSetupDialog).toBe(false);
        editor.destroy();
    });
    it('enableStyleDialog', () => {
        console.log('enableStyleDialog');
        editor = new DocumentEditor({enableStyleDialog:null});
        editor.appendTo("#container");
        expect(editor.enableStyleDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableStyleDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableStyleDialog).toBe(false);
        editor.destroy();
    });
    it('enableFontDialog', () => {
        console.log('enableFontDialog');
        editor = new DocumentEditor({enableFontDialog:null});
        editor.appendTo("#container");
        expect(editor.enableFontDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableFontDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableFontDialog).toBe(false);
        editor.destroy();
    });
    it('enableTableOptionsDialog', () => {
        console.log('enableTableOptionsDialog');
        editor = new DocumentEditor({enableTableOptionsDialog:null});
        editor.appendTo("#container");
        expect(editor.enableTableOptionsDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableTableOptionsDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableTableOptionsDialog).toBe(false);
        editor.destroy();
    });
    it('enableTableDialog', () => {
        console.log('enableTableDialog');
        editor = new DocumentEditor({enableTableDialog:null});
        editor.appendTo("#container");
        expect(editor.enableTableDialog).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableTableDialog:undefined});
        editor.appendTo("#container");
        expect(editor.enableTableDialog).toBe(false);
        editor.destroy();
    });
    it('enableImageResizer', () => {
        console.log('enableImageResizer');
        editor = new DocumentEditor({enableImageResizer:null});
        editor.appendTo("#container");
        expect(editor.enableImageResizer).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableImageResizer:undefined});
        editor.appendTo("#container");
        expect(editor.enableImageResizer).toBe(false);
        editor.destroy();
    });
    it('enableSpellCheck', () => {
        console.log('enableSpellCheck');
        editor = new DocumentEditor({enableSpellCheck:null});
        editor.appendTo("#container");
        expect(editor.enableSpellCheck).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableSpellCheck:undefined});
        editor.appendTo("#container");
        expect(editor.enableSpellCheck).toBe(false);
        editor.destroy();
    });
    it('enableComment', () => {
        console.log('enableComment');
        editor = new DocumentEditor({enableComment:null});
        editor.appendTo("#container");
        expect(editor.enableComment).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableComment:undefined});
        editor.appendTo("#container");
        expect(editor.enableComment).toBe(false);
        editor.destroy();
    });
    it('enableTrackChanges', () => {
        console.log('enableTrackChanges');
        editor = new DocumentEditor({enableTrackChanges:null});
        editor.appendTo("#container");
        expect(editor.enableTrackChanges).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableTrackChanges:undefined});
        editor.appendTo("#container");
        expect(editor.enableTrackChanges).toBe(false);
        editor.destroy();
    });
    it('enableFormField', () => {
        console.log('enableFormField');
        editor = new DocumentEditor({enableFormField:null});
        editor.appendTo("#container");
        expect(editor.enableFormField).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableFormField:undefined});
        editor.appendTo("#container");
        expect(editor.enableFormField).toBe(true);
        editor.destroy();
    });
    it('useCtrlClickToFollowHyperlink', () => {
        console.log('useCtrlClickToFollowHyperlink');
        editor = new DocumentEditor({useCtrlClickToFollowHyperlink:null});
        editor.appendTo("#container");
        expect(editor.useCtrlClickToFollowHyperlink).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({useCtrlClickToFollowHyperlink:undefined});
        editor.appendTo("#container");
        expect(editor.useCtrlClickToFollowHyperlink).toBe(true);
        editor.destroy();
    });
    it('pageOutline', () => {
        console.log('pageOutline');
        editor = new DocumentEditor({pageOutline:null});
        editor.appendTo("#container");
        expect(editor.pageOutline).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({pageOutline:undefined});
        editor.appendTo("#container");
        expect(editor.pageOutline).toBe('#000000');
        editor.destroy();
    });
    it('enableCursorOnReadOnly', () => {
        console.log('enableCursorOnReadOnly');
        editor = new DocumentEditor({enableCursorOnReadOnly:null});
        editor.appendTo("#container");
        expect(editor.enableCursorOnReadOnly).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableCursorOnReadOnly:undefined});
        editor.appendTo("#container");
        expect(editor.enableCursorOnReadOnly).toBe(false);
        editor.destroy();
    });
    it('enableLocalPaste', () => {
        console.log('enableLocalPaste');
        editor = new DocumentEditor({enableLocalPaste:null});
        editor.appendTo("#container");
        expect(editor.enableLocalPaste).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableLocalPaste:undefined});
        editor.appendTo("#container");
        expect(editor.enableLocalPaste).toBe(false);
        editor.destroy();
    });
    it('enableLockAndEdit', () => {
        console.log('enableLockAndEdit');
        editor = new DocumentEditor({enableLockAndEdit:null});
        editor.appendTo("#container");
        expect(editor.enableLockAndEdit).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({enableLockAndEdit:undefined});
        editor.appendTo("#container");
        expect(editor.enableLockAndEdit).toBe(false);
        editor.destroy();
    });
    it('headers', () => {
        console.log('headers');
        editor = new DocumentEditor({headers:null});
        editor.appendTo("#container");
        expect(editor.headers).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({headers:undefined});
        editor.appendTo("#container");
        expect(editor.headers.length).toBe(0);
        editor.destroy();
    });
    it('showComments', () => {
        console.log('showComments');
        editor = new DocumentEditor({showComments:null});
        editor.appendTo("#container");
        expect(editor.showComments).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({showComments:undefined});
        editor.appendTo("#container");
        expect(editor.showComments).toBe(false);
        editor.destroy();
    });
    it('showRevisions', () => {
        console.log('showRevisions');
        editor = new DocumentEditor({showRevisions:null});
        editor.appendTo("#container");
        expect(editor.showRevisions).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({showRevisions:undefined});
        editor.appendTo("#container");
        expect(editor.showRevisions).toBe(false);
        editor.destroy();
    });
    it('serverActionSettings', () => {
        console.log('serverActionSettings');
        editor = new DocumentEditor({serverActionSettings:null});
        editor.appendTo("#container");
        expect(editor.serverActionSettings).toBe(null);
        editor.destroy();
        editor = new DocumentEditor({serverActionSettings:undefined});
        editor.appendTo("#container");
        expect(editor.serverActionSettings.spellCheck).toBe('SpellCheck');
        expect(editor.serverActionSettings.systemClipboard).toBe('SystemClipboard');
        expect(editor.serverActionSettings.spellCheckByPage).toBe('SpellCheckByPage');
        expect(editor.serverActionSettings.restrictEditing).toBe('RestrictEditing');
        expect(editor.serverActionSettings.canLock).toBe('CanLock');
        expect(editor.serverActionSettings.getPendingActions).toBe('GetPendingActions');
        editor.destroy();
    });

});


